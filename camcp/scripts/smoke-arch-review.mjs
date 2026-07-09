/**
 * Smoke test — CAMCP Phase 1 Step 8 arch.review + Architecture Review Engine v1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import {
  buildSuggestedNext,
  composeArchReview,
  dedupeFindings,
  resetArchReviewConfigCache,
  resetArchFindingSeq,
  validateArchReviewInput,
} from '../dist/core/arch-review-engine/index.js';
import { runContractGate } from '../dist/core/contract-engine/gate.js';
import { evaluateInvalidation } from '../dist/core/invalidation-registry/index.js';
import { runArchReview } from '../dist/arch-review/runner.js';
import { assertReportWritePathAllowed } from '../dist/policy/path-guard.js';
import { readReportIndex } from '../dist/reports/index-manager.js';

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
  console.log('[CAMCP smoke-arch-review] arch.review + Architecture Review Engine v1 (Step 8)\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);
  resetArchReviewConfigCache();
  resetArchFindingSeq();

  const invalid = validateArchReviewInput({ facet: 'bad-facet' });
  if (invalid.length) pass('A1-schema-validation', invalid[0]);
  else fail('A1-schema-validation', 'expected error');

  const invalidRun = runArchReview(repoRoot, config, { facet: 'bad-facet' });
  if (!invalidRun.report && invalidRun.validationErrors.length) {
    pass('A2-no-write-invalid', 'blocked');
  } else fail('A2-no-write-invalid', 'should not write');

  const gate = runContractGate({
    repoRoot,
    facadeId: 'arch.review',
    facet: 'boundaries',
  });
  if (gate.ssotValid && gate.snapshots.length >= 3) {
    pass('A3-contract-gate', `${gate.snapshots.length} SSOT snapshots`);
  } else fail('A3-contract-gate', `valid=${gate.ssotValid}`);

  const summaryRun = runArchReview(repoRoot, config, { facet: 'summary' });
  if (summaryRun.report && summaryRun.archReviewHealthPath) {
    const health = JSON.parse(
      fs.readFileSync(path.resolve(repoRoot, summaryRun.archReviewHealthPath), 'utf8')
    );
    if (health.schemaVersion && health.dependencyGraph) {
      pass('A4-arch-review-health', health.overallStatus);
    } else fail('A4-arch-review-health', 'missing graph');
  } else fail('A4-arch-review-health', 'run failed');

  resetArchFindingSeq();
  const scopeOnly = composeArchReview(repoRoot, config, { facet: 'scope' });
  if (scopeOnly.findings.some((f) => f.code?.startsWith('ARCH.SCOPE'))) {
    pass('A5-scope-facet', scopeOnly.findings.length + ' findings');
  } else fail('A5-scope-facet', 'no scope findings');

  resetArchFindingSeq();
  const boundaries = composeArchReview(repoRoot, config, { facet: 'boundaries' });
  const boundariesDelegated = boundaries.delegations.some(
    (d) => d.delegatedToolId === 'arch.domain_boundaries'
  );
  if (boundariesDelegated) pass('A6-delegation-boundaries', 'arch.domain_boundaries');
  else fail('A6-delegation-boundaries', JSON.stringify(boundaries.delegations));

  resetArchFindingSeq();
  const frozen = composeArchReview(repoRoot, config, {
    facet: 'frozen',
    delegation: { skipIfCached: true, maxAgeMs: 86400000 },
  });
  const frozenDelegated = frozen.delegations.some(
    (d) => d.delegatedToolId === 'arch.frozen_violations'
  );
  if (frozenDelegated) pass('A7-delegation-frozen', frozen.delegations[0]?.cached ? 'cached' : 'live');
  else fail('A7-delegation-frozen', JSON.stringify(frozen.delegations));

  resetArchFindingSeq();
  const impact = composeArchReview(repoRoot, config, { facet: 'impact' });
  if (impact.delegations.some((d) => d.delegatedToolId === 'intel.impact')) {
    pass('A8-delegation-impact', 'intel.impact');
  } else fail('A8-delegation-impact', JSON.stringify(impact.delegations));

  resetArchFindingSeq();
  const graph = composeArchReview(repoRoot, config, { facet: 'graph' });
  if (graph.delegations.some((d) => d.delegatedToolId === 'intel.graph')) {
    pass('A9-delegation-graph', 'intel.graph');
  } else fail('A9-delegation-graph', JSON.stringify(graph.delegations));

  const mapaHash = gate.snapshots.find((s) => s.ssotId === 'mapa-maestro')?.contentHash;
  const inv = evaluateInvalidation({
    repoRoot,
    currentSnapshots: gate.snapshots,
    gitContext: { commit: 'abc', branch: 'main' },
    completedChecks: [
      {
        id: 'arch.review:boundaries',
        toolId: 'arch.review',
        facet: 'boundaries',
        runId: 'old',
        status: 'PASS',
        maxSeverity: 'PASS',
        ssotHash: { 'mapa-maestro': 'sha256:deadbeef' },
        ssotVersions: {},
        gitCommit: 'abc',
        gitBranch: 'main',
        completedAt: new Date().toISOString(),
        maxAgeMs: 86400000,
        schemaVersion: '2.0.0',
      },
    ],
  });
  if (inv.checks.some((c) => c.id === 'arch.review:boundaries' && c.valid === false)) {
    pass('A10-invalidation-hash', 'mapa-maestro mismatch');
  } else fail('A10-invalidation-hash', JSON.stringify(inv.checks));

  const gitInv = evaluateInvalidation({
    repoRoot,
    currentSnapshots: gate.snapshots,
    gitContext: { commit: 'newcommit', branch: 'main' },
    completedChecks: [
      {
        id: 'arch.review:frozen',
        toolId: 'arch.review',
        facet: 'frozen',
        runId: 'old',
        status: 'PASS',
        maxSeverity: 'PASS',
        ssotHash: mapaHash ? { 'arch-config': gate.snapshots.find((s) => s.ssotId === 'arch-config')?.contentHash ?? '' } : {},
        ssotVersions: {},
        gitCommit: 'abc',
        gitBranch: 'main',
        completedAt: new Date().toISOString(),
        maxAgeMs: 86400000,
        schemaVersion: '2.0.0',
      },
    ],
  });
  if (gitInv.checks[0]?.valid === false && gitInv.checks[0]?.reason === 'git_head_changed') {
    pass('A11-git-invalidation', 'arch.review invalidated on git head');
  } else fail('A11-git-invalidation', JSON.stringify(gitInv.checks[0]));

  const suggested = buildSuggestedNext(
    composeArchReview(repoRoot, config, { facet: 'summary' })
  );
  if (suggested.some((s) => s.startsWith('arch.review:'))) {
    pass('A12-handoff-priorities', suggested.slice(0, 3).join(','));
  } else fail('A12-handoff-priorities', suggested.join(','));

  const reportDir = summaryRun.reportPaths.find((p) => p.endsWith('manifest.json'));
  if (reportDir) {
    const dir = path.resolve(repoRoot, path.dirname(reportDir));
    const required = ['manifest.json', 'report.json', 'ssot-snapshot.json', 'arch-review-health.json'];
    const missing = required.filter((f) => !fs.existsSync(path.join(dir, f)));
    if (!missing.length) pass('A13-reports-v2', required.join(', '));
    else fail('A13-reports-v2', `missing ${missing.join(', ')}`);
  } else fail('A13-reports-v2', 'no manifest');

  try {
    assertReportWritePathAllowed(
      repoRoot,
      path.join(repoRoot, 'agent-tools/camcp-reports/arch.review/probe.json'),
      config
    );
    pass('A14-path-guard', 'allowed');
  } catch (e) {
    fail('A14-path-guard', String(e));
  }

  const index = readReportIndex(repoRoot, config);
  if (index.entries.some((e) => e.toolId === 'arch.review')) {
    pass('A15-index-upsert', 'arch.review indexed');
  } else fail('A15-index-upsert', 'missing');

  resetArchFindingSeq();
  const fullRun = runArchReview(repoRoot, config, { facet: 'full' });
  if (fullRun.bundlePath && fs.existsSync(path.resolve(repoRoot, fullRun.bundlePath))) {
    pass('A16-full-bundle', fullRun.bundlePath);
  } else fail('A16-full-bundle', 'missing bundle');

  const deduped = dedupeFindings([
    { id: '1', severity: 'INFO', message: 'x', code: 'A', title: 't' },
    { id: '2', severity: 'INFO', message: 'x', code: 'A', title: 't' },
  ]);
  if (deduped.length === 1) pass('A17-dedupe', 'ok');
  else fail('A17-dedupe', String(deduped.length));

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[smoke-arch-review] ${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.error('Failed:', failed.map((f) => f.name).join(', '));
    process.exit(1);
  }
}

main();
