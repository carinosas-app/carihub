/**
 * Smoke test — CAMCP Phase 1 Step 3 Shared Invalidation Registry (M10)
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import { runContractGate } from '../dist/core/contract-engine/index.js';
import {
  evaluateInvalidation,
  explainInvalidation,
  listAllWatches,
  matchesCheckPattern,
  registerFacadeManifest,
  registryVersion,
  watchList,
} from '../dist/core/invalidation-registry/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const results = [];

function pass(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name} — ${detail}`);
}

function main() {
  console.log('[CAMCP smoke-invalidation] Shared Invalidation Registry (Step 3)\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);

  if (registryVersion() === '1.0.0') {
    pass('registry-version', registryVersion());
  } else {
    fail('registry-version', registryVersion());
  }

  const watches = watchList();
  if (watches.length >= 10) {
    pass('watch-list', `${watches.length} watches`);
  } else {
    fail('watch-list', `expected >=10, got ${watches.length}`);
  }

  if (watches.some((w) => w.facadeId === 'catalog.audit' && w.resourceKey === 'registro-schema-index')) {
    pass('watch-catalog-ssot', 'registro-schema-index');
  } else {
    fail('watch-catalog-ssot', 'missing');
  }

  if (matchesCheckPattern('profile.audit:parity', 'profile.audit:*')) {
    pass('pattern-wildcard', 'profile.audit:*');
  } else {
    fail('pattern-wildcard', 'no match');
  }

  if (matchesCheckPattern('profile.audit:render', 'profile.audit:{render,public_fields,full}')) {
    pass('pattern-brace', 'brace set');
  } else {
    fail('pattern-brace', 'no match');
  }

  const gate = runContractGate({ repoRoot, facadeId: 'catalog.audit', facet: 'summary' });
  const snapshots = gate.snapshots.map((s) => ({
    ssotId: s.ssotId,
    contentHash: s.contentHash,
    version: s.versionField ?? s.version ?? null,
    path: s.path,
  }));

  const idx = snapshots.find((s) => s.ssotId === 'registro-schema-index');
  const validCheck = {
    id: 'catalog.audit:summary',
    toolId: 'catalog.audit',
    facet: 'summary',
    ssotHash: idx?.contentHash ? { 'registro-schema-index': idx.contentHash } : {},
    ssotVersions: idx?.version ? { 'registro-schema-index': idx.version } : {},
    gitCommit: 'abc123',
    gitBranch: 'main',
    registryVersion: registryVersion(),
    schemaVersion: '2.0.0',
    completedAt: new Date().toISOString(),
  };

  const evalValid = evaluateInvalidation({
    repoRoot,
    currentSnapshots: snapshots,
    gitContext: { commit: 'abc123', branch: 'main' },
    completedChecks: [validCheck],
  });

  if (evalValid.checks[0]?.valid === true) {
    pass('evaluate-valid-check', evalValid.checks[0].id);
  } else {
    fail('evaluate-valid-check', JSON.stringify(evalValid.checks[0]));
  }

  const staleCheck = {
    ...validCheck,
    ssotHash: { 'registro-schema-index': 'sha256:deadbeef' },
  };
  const evalStale = evaluateInvalidation({
    repoRoot,
    currentSnapshots: snapshots,
    gitContext: { commit: 'abc123', branch: 'main' },
    completedChecks: [staleCheck],
  });
  if (
    evalStale.checks[0]?.valid === false &&
    evalStale.checks[0]?.reason === 'ssot_hash_mismatch'
  ) {
    pass('evaluate-hash-mismatch', evalStale.checks[0].reason);
  } else {
    fail('evaluate-hash-mismatch', JSON.stringify(evalStale.checks[0]));
  }

  const gitStale = {
    ...validCheck,
    gitCommit: 'oldcommit',
  };
  const evalGit = evaluateInvalidation({
    repoRoot,
    currentSnapshots: snapshots,
    gitContext: { commit: 'newcommit', branch: 'main' },
    completedChecks: [gitStale],
  });
  if (evalGit.checks[0]?.valid === true) {
    pass('ir4-catalog-git-protected', 'catalog not invalidated by git-only change');
  } else {
    fail('ir4-catalog-git-protected', JSON.stringify(evalGit.checks[0]));
  }

  const profileGitStale = {
    id: 'profile.audit:parity',
    toolId: 'profile.audit',
    facet: 'parity',
    ssotHash: idx?.contentHash ? { 'registro-schema-index': idx.contentHash } : {},
    gitCommit: 'oldcommit',
    registryVersion: registryVersion(),
    schemaVersion: '2.0.0',
  };
  const evalProfileGit = evaluateInvalidation({
    repoRoot,
    currentSnapshots: snapshots,
    gitContext: { commit: 'newcommit', branch: 'main' },
    completedChecks: [profileGitStale],
  });
  if (
    evalProfileGit.checks[0]?.valid === false &&
    evalProfileGit.checks[0]?.reason === 'git_head_changed'
  ) {
    pass('evaluate-git-head', evalProfileGit.checks[0].reason);
  } else {
    fail('evaluate-git-head', JSON.stringify(evalProfileGit.checks[0]));
  }

  const expiredCheck = {
    ...validCheck,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    maxAgeMs: 3600000,
  };
  const evalExpired = evaluateInvalidation({
    repoRoot,
    currentSnapshots: snapshots,
    gitContext: { commit: 'abc123', branch: 'main' },
    completedChecks: [expiredCheck],
  });
  if (evalExpired.checks[0]?.valid === false && evalExpired.checks[0]?.reason === 'expired') {
    pass('evaluate-expired', evalExpired.checks[0].reason);
  } else {
    fail('evaluate-expired', JSON.stringify(evalExpired.checks[0]));
  }

  const explain = explainInvalidation('profile.audit:render');
  if (explain.matchedWatches.length >= 2 && explain.dependencyChain.length >= 2) {
    pass('explain-check', `${explain.matchedWatches.length} watches`);
  } else {
    fail('explain-check', JSON.stringify(explain));
  }

  const profileRegs = listAllWatches()
    .filter((w) => w.facadeId === 'profile.audit')
    .map(({ facadeId: _f, ...reg }) => reg);
  const ack = registerFacadeManifest({
    facadeId: 'profile.audit',
    registrations: profileRegs,
  });
  if (ack.ack && ack.facadeId === 'profile.audit') {
    pass('register-manifest', `watchCount=${ack.watchCount}`);
  } else {
    fail('register-manifest', JSON.stringify(ack));
  }

  const failed = results.filter((r) => !r.ok);
  console.log(
    `\n[CAMCP smoke-invalidation] ${results.length - failed.length}/${results.length} checks passed`
  );
  process.exit(failed.length ? 1 : 0);
}

main();
