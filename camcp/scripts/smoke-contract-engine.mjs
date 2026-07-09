/**
 * Smoke test — CAMCP Phase 1 Step 2 Shared Contract Engine
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import {
  CONTRACT_ENGINE_VERSION,
  gateBlocksDomainEngine,
  hashFileUtf8,
  listRegisteredPlugins,
  listSsotsForFacade,
  runContractGate,
  validateSsot,
} from '../dist/core/contract-engine/index.js';
import { ssotSnapshotFromGate } from '../dist/reports/ssot-from-gate.js';

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
  console.log('[CAMCP smoke-contract] Shared Contract Engine (Step 2)\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);

  const plugins = listRegisteredPlugins();
  if (plugins.sort().join(',') === 'arch,catalog,profile') {
    pass('plugins-registered', plugins.join(', '));
  } else {
    fail('plugins-registered', plugins.join(', '));
  }

  if (CONTRACT_ENGINE_VERSION === '1.0.0') {
    pass('engine-version', CONTRACT_ENGINE_VERSION);
  } else {
    fail('engine-version', CONTRACT_ENGINE_VERSION);
  }

  const catalogSsots = listSsotsForFacade('catalog.audit');
  if (catalogSsots.some((s) => s.ssotId === 'registro-schema-index')) {
    pass('registry-catalog', `${catalogSsots.length} ssot(s)`);
  } else {
    fail('registry-catalog', 'missing registro-schema-index');
  }

  const gate = runContractGate({
    repoRoot,
    facadeId: 'catalog.audit',
    facet: 'summary',
  });

  if (gate.ssotValid && gate.mirrorValid && gate.snapshots.length >= 1) {
    pass('gate-catalog-live', `snapshots=${gate.snapshots.length}, errors=${gate.errors.length}`);
  } else {
    fail(
      'gate-catalog-live',
      `ssotValid=${gate.ssotValid}, mirrorValid=${gate.mirrorValid}, errors=${gate.errors.length}`
    );
  }

  const idx = gate.snapshots.find((s) => s.ssotId === 'registro-schema-index');
  if (idx?.contentHash?.startsWith('sha256:') && idx.version === '2026-06-10') {
    pass('gate-snapshot-hash', `${idx.contentHash.slice(0, 22)}…`);
  } else {
    fail('gate-snapshot-hash', JSON.stringify(idx));
  }

  const snapDoc = ssotSnapshotFromGate(gate, null);
  if (snapDoc.schemaVersion === '2.0.0' && snapDoc.policy === 'reference-only') {
    pass('reports-bridge-snapshot', `entries=${snapDoc.snapshots.length}`);
  } else {
    fail('reports-bridge-snapshot', 'invalid SsotSnapshotDocument');
  }

  if (!gateBlocksDomainEngine(gate)) {
    pass('gate-blocks-false-when-valid', 'domain engine allowed');
  } else {
    fail('gate-blocks-false-when-valid', 'unexpected block');
  }

  const profileGate = runContractGate({
    repoRoot,
    facadeId: 'profile.audit',
    facet: 'parity',
    ssotIds: ['registro-schema-index', 'perfil-publico'],
  });
  if (profileGate.ssotValid && profileGate.snapshots.length === 2) {
    pass('gate-profile-ssots', 'schema-index + perfil-publico');
  } else {
    fail('gate-profile-ssots', `valid=${profileGate.ssotValid}, n=${profileGate.snapshots.length}`);
  }

  const archGate = runContractGate({
    repoRoot,
    facadeId: 'arch.review',
    facet: 'boundaries',
  });
  if (archGate.ssotValid && archGate.snapshots.length >= 3) {
    pass('gate-arch-ssots', `snapshots=${archGate.snapshots.length}`);
  } else {
    fail('gate-arch-ssots', `valid=${archGate.ssotValid}, n=${archGate.snapshots.length}`);
  }

  const hashA = hashFileUtf8(path.join(repoRoot, 'camcp/config/camcp.config.json'));
  const hashB = hashFileUtf8(path.join(repoRoot, 'camcp/config/camcp.config.json'));
  if (hashA.hash === hashB.hash) {
    pass('hash-stable', hashA.hash.slice(0, 20) + '…');
  } else {
    fail('hash-stable', 'mismatch');
  }

  const missing = validateSsot(repoRoot, 'catalog.audit', {
    ssotId: 'test-missing',
    path: 'camcp/config/__missing-ssot-test__.json',
    kind: 'json',
    versionField: 'version',
    requiredFields: ['version'],
    supportedVersions: ['*'],
    facades: ['catalog.audit'],
  });
  if (missing.issues.some((i) => i.code === 'CONTRACT.SSOT.MISSING')) {
    pass('validate-missing-ssot', missing.issues[0].code);
  } else {
    fail('validate-missing-ssot', JSON.stringify(missing.issues));
  }

  const blockedGate = runContractGate({
    repoRoot,
    facadeId: 'catalog.audit',
    facet: 'full',
    ssotIds: ['registro-schema-index'],
  });
  const syntheticInvalid = {
    ...blockedGate,
    ssotValid: false,
    errors: [{ code: 'CATALOG.SSOT.INVALID', severity: 'error', message: 'synthetic' }],
    blockedFacets: ['full'],
  };
  if (gateBlocksDomainEngine(syntheticInvalid)) {
    pass('gate-blocks-domain-engine', 'blocked when ssotValid=false');
  } else {
    fail('gate-blocks-domain-engine', 'should block');
  }

  if (blockedGate.ssotValid) {
    pass('gate-blocked-facets-live', 'live gate valid — facet not blocked');
  } else if (blockedGate.blockedFacets.includes('full')) {
    pass('gate-blocked-facets-live', blockedGate.blockedFacets.join(','));
  } else {
    fail('gate-blocked-facets-live', JSON.stringify(blockedGate.blockedFacets));
  }

  const failed = results.filter((r) => !r.ok);
  console.log(
    `\n[CAMCP smoke-contract] ${results.length - failed.length}/${results.length} checks passed`
  );
  process.exit(failed.length ? 1 : 0);
}

main();
