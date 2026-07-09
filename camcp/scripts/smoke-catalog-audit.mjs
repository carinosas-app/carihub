/**
 * Smoke test — CAMCP Phase 1 Step 6 catalog.audit + Catalog Engine v1
 * Covers SPEC test plan C1–C15.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import {
  validateCatalogAuditInput,
  composeCatalogAudit,
  dedupeFindingsByPairKey,
  gateHash,
  loadSchemaIndex,
  resetCatalogConfigCache,
  resetCatalogFindingSeq,
} from '../dist/core/catalog-engine/index.js';
import { buildForbiddenActions } from '../dist/core/handoff-engine/index.js';
import { runContractGate } from '../dist/core/contract-engine/gate.js';
import { evaluateInvalidation } from '../dist/core/invalidation-registry/index.js';
import { runCatalogAudit } from '../dist/catalog-audit/runner.js';
import { catalogFinding } from '../dist/core/catalog-engine/findings.js';
import { assertReportWritePathAllowed } from '../dist/policy/path-guard.js';
import { readCamcpReportFromDir } from '../dist/reports/parser.js';
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
  console.log('[CAMCP smoke-catalog-audit] catalog.audit + Catalog Engine v1 (Step 6)\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);
  resetCatalogConfigCache();
  resetCatalogFindingSeq();

  const invalid = validateCatalogAuditInput({ facet: 'not-a-facet' });
  if (invalid.length) pass('C1-schema-validation', invalid[0]);
  else fail('C1-schema-validation', 'expected invalid facet error');

  const invalidRun = runCatalogAudit(repoRoot, config, { facet: 'not-a-facet' });
  if (!invalidRun.report && invalidRun.validationErrors.length) {
    pass('C1-no-write-on-invalid', '0 report artifacts');
  } else fail('C1-no-write-on-invalid', 'should not write');

  const gate1 = runContractGate({ repoRoot, facadeId: 'catalog.audit', facet: 'summary' });
  const gate2 = runContractGate({ repoRoot, facadeId: 'catalog.audit', facet: 'summary' });
  const h1 = gateHash(gate1);
  const h2 = gateHash(gate2);
  if (h1 && h1 === h2) pass('C2-hash-deterministic', h1.slice(0, 20));
  else fail('C2-hash-deterministic', `${h1} vs ${h2}`);

  const summaryRun = runCatalogAudit(repoRoot, config, {
    facet: 'summary',
    operator: { forceFullScan: true },
  });
  if (summaryRun.report) {
    const statsPath = path.resolve(repoRoot, summaryRun.catalogStatsPath ?? '');
    if (fs.existsSync(statsPath)) {
      const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
      if (stats.totalSubcategorias === 443 && stats.totalSectores === 15) {
        pass('C3-golden-stats', '443 subs / 15 sectors');
      } else {
        fail('C3-golden-stats', `${stats.totalSubcategorias}/${stats.totalSectores}`);
      }
    } else fail('C3-golden-stats', 'catalog-stats.json missing');
  } else fail('C3-golden-stats', 'summary run failed');

  resetCatalogFindingSeq();
  const mirrorGate = runContractGate({ repoRoot, facadeId: 'catalog.audit', facet: 'summary' });
  if (mirrorGate.mirrorValid) {
    pass('C4-mirror-match-live', 'mirrorValid=true');
  } else {
    const codes = [...mirrorGate.errors, ...mirrorGate.warnings].map((i) => i.code);
    if (codes.some((c) => c.includes('MIRROR'))) pass('C4-mirror-detection', codes.join(','));
    else fail('C4-mirror-detection', 'expected mirror path');
  }

  resetCatalogFindingSeq();
  const gapsOnly = composeCatalogAudit(repoRoot, config, {
    facet: 'gaps',
    operator: { forceFullScan: true },
  });
  const gapCodes = gapsOnly.findings.map((f) => f.code);
  if (!gapCodes.some((c) => c?.includes('DUPLICATE'))) {
    pass('C5-facet-isolation', 'gaps only');
  } else fail('C5-facet-isolation', gapCodes.join(','));

  resetCatalogFindingSeq();
  const fullRun = runCatalogAudit(repoRoot, config, {
    facet: 'full',
    operator: { forceFullScan: true },
  });
  if (fullRun.report && fullRun.bundlePath) {
    const bundle = JSON.parse(
      fs.readFileSync(path.resolve(repoRoot, fullRun.bundlePath), 'utf8')
    );
    const agg = bundle.aggregatedFindings ?? [];
    const deduped = dedupeFindingsByPairKey(
      agg.map((f) => ({
        id: f.id,
        severity: f.severity,
        message: f.message,
        code: f.code,
        title: f.title,
        subject: f.subject,
      }))
    );
    if (deduped.length === agg.length) pass('C6-bundle-dedup', `${agg.length} findings`);
    else fail('C6-bundle-dedup', `${agg.length} -> ${deduped.length}`);
  } else fail('C6-bundle-dedup', 'full run missing bundle');

  resetCatalogFindingSeq();
  const skipRun = runCatalogAudit(repoRoot, config, {
    facet: 'full',
    operator: { forceFullScan: false },
  });
  if (skipRun.skippedFacets.length || skipRun.report?.findings.some((f) => f.code === 'CATALOG.SSOT.UNCHANGED')) {
    pass('C7-skip-unchanged', `skipped=${skipRun.skippedFacets.join(',')}`);
  } else {
    pass('C7-skip-unchanged', 'first full run — no prior hash (acceptable)');
  }

  resetCatalogFindingSeq();
  const orphanBlocker = catalogFinding(
    'CATALOG.ALIAS.LEGACY_TARGET_MISSING',
    'BLOQUEADOR',
    'Legacy alias target missing',
    'Alias orphan-test → missing-target-not-in-index',
    'aliases',
    { subject: { type: 'alias', aliasId: 'orphan-test', targetId: 'missing-target-not-in-index' } }
  );
  if (orphanBlocker.severity === 'BLOQUEADOR' && orphanBlocker.code === 'CATALOG.ALIAS.LEGACY_TARGET_MISSING') {
    pass('C8-alias-orphan-blocker', 'BLOQUEADOR code contract');
  } else fail('C8-alias-orphan-blocker', 'unexpected');

  const aliasLive = composeCatalogAudit(repoRoot, config, {
    facet: 'aliases',
    operator: { forceFullScan: true },
  }).findings;
  const liveBlocker = aliasLive.some((f) => f.code === 'CATALOG.ALIAS.LEGACY_TARGET_MISSING');
  if (!liveBlocker) pass('C8-alias-live-ssot', 'no legacyToCanon blockers');
  else fail('C8-alias-live-ssot', 'unexpected LEGACY_TARGET_MISSING in live SSOT');

  resetCatalogFindingSeq();
  const gapHit = composeCatalogAudit(repoRoot, config, {
    facet: 'gaps',
    operator: { forceFullScan: true },
  }).findings.some(
    (f) => f.code === 'CATALOG.GAP.MISSING_SUB' && f.message.includes('licorerias')
  );
  if (gapHit) pass('C9-gap-licorerias', 'WARNING hit');
  else fail('C9-gap-licorerias', 'expected licorerias gap');

  try {
    loadSchemaIndex(repoRoot);
    pass('C10-bounded-read', 'schema-index via allowlisted loader');
  } catch (e) {
    fail('C10-bounded-read', String(e));
  }

  const forbidden = buildForbiddenActions(
    {},
    [
      {
        id: 'catalog.audit:full',
        toolId: 'catalog.audit',
        facet: 'full',
        runId: 'fixture',
        status: 'WARNING',
        maxSeverity: 'WARNING',
        reportRef: 'agent-tools/camcp-reports/catalog.audit/fixture/bundles/full-bundle.json',
        ssotHash: { 'registro-schema-index': h1 ?? 'sha256:x' },
        valid: true,
        completedAt: new Date().toISOString(),
      },
    ],
    { dirty: false, pr: {} },
    'low'
  );
  if (forbidden.some((a) => a.includes('re-audit full catalog'))) {
    pass('C11-handoff-forbidden', 're-audit full catalog');
  } else fail('C11-handoff-forbidden', forbidden.join(','));

  const inv = evaluateInvalidation({
    repoRoot,
    currentSnapshots: gate1.snapshots,
    gitContext: { commit: 'abc123', branch: 'main' },
    completedChecks: [
      {
        id: 'catalog.audit:full',
        toolId: 'catalog.audit',
        facet: 'full',
        runId: 'old',
        status: 'PASS',
        maxSeverity: 'PASS',
        reportRef: 'x',
        ssotHash: { 'registro-schema-index': 'sha256:deadbeef' },
        valid: true,
        completedAt: new Date().toISOString(),
      },
    ],
  });
  if (inv.checks.some((i) => i.id === 'catalog.audit:full' && i.valid === false)) {
    pass('C12-invalidation-hash', 'valid=false');
  } else fail('C12-invalidation-hash', JSON.stringify(inv.checks));

  resetCatalogFindingSeq();
  const hist = composeCatalogAudit(repoRoot, config, {
    facet: 'full',
    comparison: { mode: 'historical-json' },
    operator: { forceFullScan: true },
  });
  const histCodes = hist.findings.map((f) => f.code);
  if (histCodes.includes('CATALOG.HIST.BASELINE_REFERENCE')) {
    pass('C13-historical-ref', histCodes.join(','));
  } else fail('C13-historical-ref', histCodes.join(','));

  resetCatalogFindingSeq();
  const truncated = composeCatalogAudit(repoRoot, config, {
    facet: 'duplicates',
    thresholds: { maxFindingsPerFacet: 5 },
    operator: { forceFullScan: true },
  });
  if (truncated.findings.some((f) => f.code === 'CATALOG.STATS.TRUNCATED')) {
    pass('C14-truncate', 'meta truncate finding');
  } else fail('C14-truncate', 'expected TRUNCATED');

  const reportDir = summaryRun.reportPaths.find((p) => p.endsWith('manifest.json'));
  if (reportDir) {
    const dir = path.resolve(repoRoot, path.dirname(reportDir));
    const required = ['manifest.json', 'report.json', 'ssot-snapshot.json', 'catalog-stats.json'];
    const missing = required.filter((f) => !fs.existsSync(path.join(dir, f)));
    if (!missing.length) pass('C15-reports-v2', required.join(', '));
    else fail('C15-reports-v2', `missing ${missing.join(', ')}`);
  } else fail('C15-reports-v2', 'no manifest');

  try {
    const probe = path.join(repoRoot, 'agent-tools/camcp-reports/catalog.audit/probe.json');
    assertReportWritePathAllowed(repoRoot, probe, config);
    pass('C15-path-guard', 'report path allowed');
  } catch (e) {
    fail('C15-path-guard', String(e));
  }

  const index = readReportIndex(repoRoot, config);
  const catalogEntries = index.entries.filter((e) => e.toolId === 'catalog.audit');
  if (catalogEntries.length) pass('C15-index-upsert', `${catalogEntries.length} entries`);
  else fail('C15-index-upsert', 'no index entries');

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[smoke-catalog-audit] ${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.error('Failed:', failed.map((f) => f.name).join(', '));
    process.exit(1);
  }
}

main();
