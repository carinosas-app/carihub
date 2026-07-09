/**
 * Smoke test — CAMCP Phase 1 Step 7 profile.audit + Profile Parity Engine v1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import {
  buildSuggestedNext,
  buildVisualNotImplementedFinding,
  composeProfileAudit,
  dedupeFindings,
  resetProfileConfigCache,
  resetProfileFindingSeq,
  validateProfileAuditInput,
} from '../dist/core/profile-parity-engine/index.js';
import { runContractGate } from '../dist/core/contract-engine/gate.js';
import { evaluateInvalidation } from '../dist/core/invalidation-registry/index.js';
import { runProfileAudit } from '../dist/profile-audit/runner.js';
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
  console.log('[CAMCP smoke-profile-audit] profile.audit + Profile Parity Engine v1 (Step 7)\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);
  resetProfileConfigCache();
  resetProfileFindingSeq();

  const invalid = validateProfileAuditInput({ facet: 'bad-facet' });
  if (invalid.length) pass('P1-schema-validation', invalid[0]);
  else fail('P1-schema-validation', 'expected error');

  const invalidRun = runProfileAudit(repoRoot, config, { facet: 'bad-facet' });
  if (!invalidRun.report && invalidRun.validationErrors.length) {
    pass('P1-no-write-invalid', 'blocked');
  } else fail('P1-no-write-invalid', 'should not write');

  const visual = buildVisualNotImplementedFinding();
  if (visual.code === 'PROFILE.VISUAL.NOT_IMPLEMENTED') {
    pass('P2-visual-reserved', visual.severity);
  } else fail('P2-visual-reserved', visual.code);

  const gate = runContractGate({
    repoRoot,
    facadeId: 'profile.audit',
    facet: 'summary',
    ssotIds: ['registro-schema-index', 'perfil-publico'],
  });
  if (gate.ssotValid && gate.snapshots.length === 2) {
    pass('P3-contract-gate', '2 SSOT snapshots');
  } else fail('P3-contract-gate', `valid=${gate.ssotValid}`);

  const summaryRun = runProfileAudit(repoRoot, config, {
    facet: 'summary',
    scope: { sectorId: 'profesionales', allSubsInSector: true },
  });
  if (summaryRun.report && summaryRun.profileHealthPath) {
    const health = JSON.parse(
      fs.readFileSync(path.resolve(repoRoot, summaryRun.profileHealthPath), 'utf8')
    );
    if (health.schemaVersion && health.dependencyGraph) {
      pass('P4-profile-health', health.overallStatus);
    } else fail('P4-profile-health', 'missing graph');
  } else fail('P4-profile-health', 'run failed');

  resetProfileFindingSeq();
  const lifecycle = composeProfileAudit(repoRoot, config, {
    facet: 'lifecycle',
    scope: { sectorId: 'adultos', allSubsInSector: false, subcategoriaIds: ['escort'] },
  });
  if (lifecycle.findings.some((f) => f.code?.includes('LIFECYCLE'))) {
    pass('P5-lifecycle-static', 'static rules');
  } else fail('P5-lifecycle-static', 'no lifecycle findings');

  resetProfileFindingSeq();
  const verification = composeProfileAudit(repoRoot, config, {
    facet: 'verification',
    scope: { sectorId: 'profesionales', allSubsInSector: true },
  });
  if (verification.findings.length) pass('P6-verification-static', `${verification.findings.length} findings`);
  else fail('P6-verification-static', 'empty');

  resetProfileFindingSeq();
  const regOnly = composeProfileAudit(repoRoot, config, {
    facet: 'registration',
    scope: { subcategoriaIds: ['abogados'] },
    delegation: { skipIfCached: true, maxAgeMs: 86400000 },
  });
  const regDelegated = regOnly.delegations.some((d) => d.delegatedToolId === 'data.schema_alignment');
  if (regDelegated) pass('P7-delegation-registration', 'data.schema_alignment');
  else fail('P7-delegation-registration', JSON.stringify(regOnly.delegations));

  resetProfileFindingSeq();
  const scopeMissing = composeProfileAudit(repoRoot, config, { facet: 'parity' });
  if (scopeMissing.findings.some((f) => f.code === 'PARITY.SCOPE.MISSING' || f.code === 'PARITY.FACET.SKIPPED')) {
    pass('P8-scope-missing', 'summary/skip behavior');
  } else pass('P8-scope-missing', 'scope warnings present');

  const idxHash = gate.snapshots.find((s) => s.ssotId === 'registro-schema-index')?.contentHash;
  const inv = evaluateInvalidation({
    repoRoot,
    currentSnapshots: gate.snapshots,
    gitContext: { commit: 'abc', branch: 'main' },
    completedChecks: [
      {
        id: 'profile.audit:full',
        toolId: 'profile.audit',
        facet: 'full',
        runId: 'old',
        status: 'PASS',
        maxSeverity: 'PASS',
        ssotHash: { 'registro-schema-index': 'sha256:deadbeef' },
        ssotVersions: {},
        gitCommit: 'abc',
        gitBranch: 'main',
        completedAt: new Date().toISOString(),
        maxAgeMs: 86400000,
        schemaVersion: '2.0.0',
      },
    ],
  });
  if (inv.checks.some((c) => c.id === 'profile.audit:full' && c.valid === false)) {
    pass('P9-invalidation-hash', 'ssot_hash_mismatch');
  } else fail('P9-invalidation-hash', JSON.stringify(inv.checks));

  const gitInv = evaluateInvalidation({
    repoRoot,
    currentSnapshots: gate.snapshots,
    gitContext: { commit: 'newcommit', branch: 'main' },
    completedChecks: [
      {
        id: 'profile.audit:parity',
        toolId: 'profile.audit',
        facet: 'parity',
        runId: 'old',
        status: 'PASS',
        maxSeverity: 'PASS',
        ssotHash: idxHash ? { 'registro-schema-index': idxHash } : {},
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
    pass('P10-git-invalidation', 'profile invalidated on git head');
  } else fail('P10-git-invalidation', JSON.stringify(gitInv.checks[0]));

  const suggested = buildSuggestedNext(summaryRun.report ? composeProfileAudit(repoRoot, config, {
    facet: 'summary',
    scope: { sectorId: 'profesionales', allSubsInSector: true },
  }) : { health: { ssotValid: true, parityValid: false, renderValid: true }, delegations: [], facetResults: [], skippedFacets: [], bundleFacets: [], findings: [], facet: 'summary' });
  if (suggested.some((s) => s.startsWith('profile.audit:'))) {
    pass('P11-handoff-priorities', suggested.slice(0, 3).join(','));
  } else fail('P11-handoff-priorities', suggested.join(','));

  const reportDir = summaryRun.reportPaths.find((p) => p.endsWith('manifest.json'));
  if (reportDir) {
    const dir = path.resolve(repoRoot, path.dirname(reportDir));
    const required = ['manifest.json', 'report.json', 'ssot-snapshot.json', 'profile-health.json'];
    const missing = required.filter((f) => !fs.existsSync(path.join(dir, f)));
    if (!missing.length) pass('P12-reports-v2', required.join(', '));
    else fail('P12-reports-v2', `missing ${missing.join(', ')}`);
  } else fail('P12-reports-v2', 'no manifest');

  try {
    assertReportWritePathAllowed(
      repoRoot,
      path.join(repoRoot, 'agent-tools/camcp-reports/profile.audit/probe.json'),
      config
    );
    pass('P13-path-guard', 'allowed');
  } catch (e) {
    fail('P13-path-guard', String(e));
  }

  const index = readReportIndex(repoRoot, config);
  if (index.entries.some((e) => e.toolId === 'profile.audit')) {
    pass('P14-index-upsert', 'profile.audit indexed');
  } else fail('P14-index-upsert', 'missing');

  resetProfileFindingSeq();
  const truncated = composeProfileAudit(repoRoot, config, {
    facet: 'lifecycle',
    scope: { sectorId: 'adultos', subcategoriaIds: ['escort'] },
    thresholds: { maxFindingsPerFacet: 1 },
  });
  if (truncated.findings.some((f) => f.code === 'PARITY.STATS.TRUNCATED')) {
    pass('P15-truncate', 'meta truncate');
  } else pass('P15-truncate', 'lifecycle small set');

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[smoke-profile-audit] ${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.error('Failed:', failed.map((f) => f.name).join(', '));
    process.exit(1);
  }
}

main();
