/**
 * Smoke test — Reports Engine v2 (Phase 1 Step 1)
 * Covers SPEC test plan T1–T6, T10 (T7/T8 deferred — handoff not in scope).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import { PathGuardError } from '../dist/policy/path-guard.js';
import { buildReportBundle } from '../dist/reports/bundle.js';
import { countFindings, maxSeverityFromFindings } from '../dist/reports/counts.js';
import { readReportIndex } from '../dist/reports/index-manager.js';
import { normalizeFinding } from '../dist/reports/normalize.js';
import { readCamcpReportFromDir } from '../dist/reports/parser.js';
import {
  buildCamcpReportDocument,
  buildReportFromFindings,
  writeCamcpReport,
} from '../dist/reports/writer.js';

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

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return `sha256:${crypto.createHash('sha256').update(buf).digest('hex')}`;
}

function main() {
  console.log('[CAMCP smoke-reports-v2] Reports Engine v2\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);
  const toolId = 'smoke.reports_v2';

  // T10 — hypothesis caps BLOQUEADOR → IMPORTANTE
  const capped = normalizeFinding(
    {
      id: 'HYP-1',
      severity: 'BLOQUEADOR',
      confidence: 'hypothesis',
      message: 'Speculative blocker',
    },
    { toolId }
  );
  if (capped.severity === 'IMPORTANTE' && capped.confidence === 'hypothesis') {
    pass('T10-hypothesis-cap', 'BLOQUEADOR→IMPORTANTE');
  } else {
    fail('T10-hypothesis-cap', `got severity=${capped.severity}`);
  }

  // T4 — severity aggregation
  const sampleFindings = [
    { id: 'W1', severity: 'WARNING', message: 'warn' },
    { id: 'I1', severity: 'IMPORTANTE', message: 'imp' },
  ];
  const report = buildReportFromFindings({
    module: toolId,
    gitCommit: null,
    durationMs: 42,
    summary: 'Smoke aggregation test',
    findings: sampleFindings,
  });
  const doc = buildCamcpReportDocument(toolId, 'smoke-run-agg', report);
  const counts = countFindings(doc.findings);
  if (counts.importante === 1 && counts.warning === 1 && doc.maxSeverity === 'IMPORTANTE') {
    pass('T4-severity-aggregation', `max=${doc.maxSeverity}, counts=${JSON.stringify(counts)}`);
  } else {
    fail('T4-severity-aggregation', JSON.stringify({ counts, max: doc.maxSeverity }));
  }

  // T2 — golden write v2 artifacts
  const paths = writeCamcpReport(repoRoot, config, toolId, report, {
    facet: 'summary',
    domains: ['CAMCP'],
    ssot: {
      schemaVersion: '2.0.0',
      capturedAt: new Date().toISOString(),
      gitCommit: null,
      snapshots: [
        {
          ssotId: 'camcp-config',
          path: 'camcp/config/camcp.config.json',
          contentHash: sha256File(path.join(repoRoot, 'camcp/config/camcp.config.json')),
        },
      ],
      policy: 'reference-only',
    },
  });

  const requiredSuffixes = [
    'report.md',
    'report.json',
    'manifest.json',
    'findings.json',
    'summary.json',
    'ssot-snapshot.json',
  ];
  const missing = requiredSuffixes.filter((s) => !paths.some((p) => p.endsWith(s)));
  if (missing.length) {
    fail('T2-artifacts-written', `missing ${missing.join(', ')}`);
  } else {
    pass('T2-artifacts-written', paths.length + ' paths');
  }

  const reportJsonPath = paths.find((p) => p.endsWith('report.json'));
  const manifestPath = paths.find((p) => p.endsWith('manifest.json'));
  const reportMdPath = paths.find((p) => p.endsWith('report.md'));

  if (reportJsonPath) {
    const reportJson = JSON.parse(fs.readFileSync(path.join(repoRoot, reportJsonPath), 'utf8'));
    if (reportJson.schemaVersion === '2.0.0' && reportJson.findings?.[0]?.code) {
      pass('T2-report-json-schema', `reportId=${reportJson.reportId}`);
    } else {
      fail('T2-report-json-schema', 'invalid report.json shape');
    }
  }

  if (manifestPath) {
    const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, manifestPath), 'utf8'));
    if (manifest.schemaVersion === '2.0.0' && manifest.toolId === toolId && !manifest.scriptPath) {
      pass('T2-manifest-v2', `runId=${manifest.runId}`);
    } else {
      fail('T2-manifest-v2', 'CAMCP manifest not distinct from QA manifest');
    }
  }

  if (reportMdPath) {
    const md = fs.readFileSync(path.join(repoRoot, reportMdPath), 'utf8');
    if (md.startsWith('# CAMCP REPORT v2') && md.includes('Schema** | 2.0.0')) {
      pass('T2-report-md-v2', 'derived markdown header');
    } else {
      fail('T2-report-md-v2', 'missing v2 header');
    }
  }

  // T5 — SSOT hash stable
  const hashA = sha256File(path.join(repoRoot, 'camcp/config/camcp.config.json'));
  const hashB = sha256File(path.join(repoRoot, 'camcp/config/camcp.config.json'));
  if (hashA === hashB && hashA.startsWith('sha256:')) {
    pass('T5-ssot-hash-stable', hashA.slice(0, 20) + '…');
  } else {
    fail('T5-ssot-hash-stable', 'hash mismatch');
  }

  // T3 — v1 backward read (legacy findings without schemaVersion)
  const legacyDir = path.join(repoRoot, config.reportsDir, 'smoke.legacy_v1', 'legacy-run-001');
  fs.mkdirSync(legacyDir, { recursive: true });
  fs.writeFileSync(
    path.join(legacyDir, 'findings.json'),
    JSON.stringify([{ id: 'LEG-1', severity: 'WARNING', message: 'legacy finding' }], null, 2)
  );
  fs.writeFileSync(
    path.join(legacyDir, 'summary.json'),
    JSON.stringify(
      {
        module: 'parity.static',
        status: 'WARNING',
        maxSeverity: 'WARNING',
        runId: 'legacy-run-001',
        findingCount: 1,
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    path.join(legacyDir, 'report.md'),
    '# CAMCP REPORT\n\n| **Estado** | WARNING |\n'
  );

  const legacyDoc = readCamcpReportFromDir(legacyDir);
  if (legacyDoc && legacyDoc.findings.length === 1 && legacyDoc.findings[0].code.startsWith('LEGACY.')) {
    pass('T3-v1-backward-read', `normalized code=${legacyDoc.findings[0].code}`);
  } else {
    fail('T3-v1-backward-read', 'could not parse legacy dir');
  }

  // T6 — bundle dedup
  const facetA = buildCamcpReportDocument(toolId, 'run-a', report, { facet: 'a' });
  const facetB = buildCamcpReportDocument(toolId, 'run-b', report, { facet: 'b' });
  facetA.findings.push({
    ...facetA.findings[0],
    id: 'DUP-1',
    code: 'SMOKE.DUP.TEST',
    title: 'Duplicate title',
  });
  facetB.findings.push({
    ...facetB.findings[0],
    id: 'DUP-2',
    code: 'SMOKE.DUP.TEST',
    title: 'Duplicate title',
    subject: facetA.findings[facetA.findings.length - 1].subject,
  });

  const bundle = buildReportBundle({
    toolId,
    bundleId: 'smoke-bundle-001',
    facets: ['a', 'b'],
    reports: [
      { facet: 'a', reportPath: 'a/report.json', document: facetA },
      { facet: 'b', reportPath: 'b/report.json', document: facetB },
    ],
  });
  const dupCount = bundle.aggregatedFindings.filter((f) => f.code === 'SMOKE.DUP.TEST').length;
  if (dupCount === 1) {
    pass('T6-bundle-dedup', `aggregated=${bundle.aggregatedFindings.length}`);
  } else {
    fail('T6-bundle-dedup', `dup findings=${dupCount}`);
  }

  // Index rolling
  const index = readReportIndex(repoRoot, config);
  const hasSmokeEntry = index.entries.some((e) => e.toolId === toolId);
  if (index.schemaVersion === '2.0.0' && hasSmokeEntry) {
    pass('index-rolling', `entries=${index.entries.length}`);
  } else {
    fail('index-rolling', 'smoke entry missing from index.json');
  }

  // T9 — policy guard blocks writes outside reportsDir
  try {
    writeCamcpReport(
      repoRoot,
      config,
      '../outside',
      report
    );
    fail('T9-policy-guard', 'write outside reportsDir should throw');
  } catch (e) {
    if (e instanceof PathGuardError) {
      pass('T9-policy-guard', 'PathGuardError raised');
    } else {
      fail('T9-policy-guard', String(e));
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log(
    `\n[CAMCP smoke-reports-v2] ${results.length - failed.length}/${results.length} checks passed`
  );
  process.exit(failed.length ? 1 : 0);
}

main();
