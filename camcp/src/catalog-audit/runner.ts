import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../policy/permissions.js';
import { assertReportWritePathAllowed } from '../policy/path-guard.js';
import { makeReportRunDir } from '../qa/report-runner.js';
import {
  capabilityForCatalogFacet,
  composeCatalogAudit,
  validateCatalogAuditInput,
  type CatalogAuditFacet,
  type CatalogAuditInput,
} from '../core/catalog-engine/index.js';
import { runContractGate } from '../core/contract-engine/gate.js';
import { buildReportBundle } from '../reports/bundle.js';
import { ssotSnapshotFromGate, gateBlocksDomainEngine } from '../reports/ssot-from-gate.js';
import { buildReportFromFindings, writeCamcpReport } from '../reports/writer.js';
import type { CamcpReport, ReportFinding, WriteReportOptions } from '../reports/schema.js';
import { buildCamcpReportDocument } from '../reports/writer.js';

export interface CatalogAuditRunResult {
  ok: boolean;
  facet: CatalogAuditFacet;
  report: CamcpReport | null;
  reportPaths: string[];
  catalogStatsPath: string | null;
  bundlePath: string | null;
  skippedFacets: string[];
  validationErrors: string[];
}

function writeCatalogStats(
  repoRoot: string,
  config: CamcpConfig,
  reportDir: string,
  stats: ReturnType<typeof composeCatalogAudit>['stats']
): string {
  const statsPath = path.join(reportDir, 'catalog-stats.json');
  assertReportWritePathAllowed(repoRoot, statsPath, config);
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');
  return path.relative(repoRoot, statsPath).replace(/\\/g, '/');
}

function writeFacetReports(
  repoRoot: string,
  config: CamcpConfig,
  reportDir: string,
  bundleFacets: ReturnType<typeof composeCatalogAudit>['bundleFacets'],
  gitCommit: string | null,
  durationMs: number
): Array<{ facet: string; reportPath: string; document: ReturnType<typeof buildCamcpReportDocument> }> {
  const facetsDir = path.join(reportDir, 'facets');
  const reports: Array<{
    facet: string;
    reportPath: string;
    document: ReturnType<typeof buildCamcpReportDocument>;
  }> = [];

  for (const item of bundleFacets) {
    if (item.facet === 'full') continue;
    const facetDir = path.join(facetsDir, item.facet);
    fs.mkdirSync(facetDir, { recursive: true });
    const report = buildReportFromFindings({
      module: 'catalog.audit',
      gitCommit,
      durationMs,
      summary: `catalog.audit:${item.facet}`,
      findings: item.findings,
    });
    const relFacetDir = path.relative(repoRoot, facetDir).replace(/\\/g, '/');
    const writeOptions: WriteReportOptions = {
      facet: item.facet,
      capability: 'report-only',
      domains: ['CATALOG', 'APP_REGISTRO'],
      provenance: {
        engines: [
          { id: 'catalog-engine', version: '1.0.0' },
          { id: 'contract-engine', version: '1.0.0' },
          { id: 'reports-engine', version: '2.0.0' },
        ],
      },
    };
    const doc = buildCamcpReportDocument('catalog.audit', 'facet', report, writeOptions);
    const reportJson = path.join(facetDir, 'report.json');
    assertReportWritePathAllowed(repoRoot, reportJson, config);
    fs.writeFileSync(reportJson, JSON.stringify(doc, null, 2), 'utf8');
    reports.push({
      facet: item.facet,
      reportPath: `${relFacetDir}/report.json`,
      document: doc,
    });
  }

  return reports;
}

export function runCatalogAudit(
  repoRoot: string,
  config: CamcpConfig,
  input: CatalogAuditInput = {}
): CatalogAuditRunResult {
  const t0 = Date.now();
  const facet: CatalogAuditFacet = input.facet ?? 'summary';
  const validationErrors = validateCatalogAuditInput(input);
  if (validationErrors.length) {
    return {
      ok: false,
      facet,
      report: null,
      reportPaths: [],
      catalogStatsPath: null,
      bundlePath: null,
      skippedFacets: [],
      validationErrors,
    };
  }

  const composed = composeCatalogAudit(repoRoot, config, input);
  const gate = runContractGate({ repoRoot, facadeId: 'catalog.audit', facet });
  const gitCommit = gate.snapshots[0]?.contentHash?.slice(7, 15) ?? null;
  const durationMs = Date.now() - t0;

  const summaryText = `catalog.audit:${facet} — ${composed.stats.totalSubcategorias} subs, ${composed.stats.totalSectores} sectors, health=${composed.stats.catalogHealth.overallStatus}`;

  const report = buildReportFromFindings({
    module: 'catalog.audit',
    gitCommit,
    durationMs,
    summary: summaryText,
    findings: composed.findings,
  });

  const ssotSnapshot = ssotSnapshotFromGate(gate, gitCommit);
  const writeOptions: WriteReportOptions = {
    facet,
    capability: capabilityForCatalogFacet(facet),
    domains: ['CATALOG', 'APP_REGISTRO'],
    ssot: ssotSnapshot,
    provenance: {
      engines: [
        { id: 'catalog-engine', version: '1.0.0' },
        { id: 'contract-engine', version: '1.0.0' },
        { id: 'reports-engine', version: '2.0.0' },
      ],
    },
    suggestedNext: {
      tools: gateBlocksDomainEngine(gate) ? ['catalog.audit:summary'] : ['context.handoff:summarize'],
      qaModules: [],
    },
  };

  const reportPaths = writeCamcpReport(repoRoot, config, 'catalog.audit', report, writeOptions);
  const manifestPath = reportPaths.find((p) => p.endsWith('manifest.json'));
  const reportDir = manifestPath
    ? path.resolve(repoRoot, path.dirname(manifestPath))
    : makeReportRunDir(repoRoot, config, 'catalog.audit').reportDir;

  const catalogStatsPath = writeCatalogStats(repoRoot, config, reportDir, composed.stats);

  let bundlePath: string | null = null;
  if (facet === 'full') {
    const facetReports = writeFacetReports(
      repoRoot,
      config,
      reportDir,
      composed.bundleFacets,
      gitCommit,
      durationMs
    );
    const bundle = buildReportBundle({
      toolId: 'catalog.audit',
      bundleId: `${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}:catalog.audit`,
      facets: composed.bundleFacets.map((b) => b.facet).filter((f) => f !== 'full'),
      reports: facetReports,
      skippedFacets: composed.skippedFacets,
      summary: summaryText,
      ssotVersions: { 'registro-schema-index': composed.stats.ssotVersion ?? 'unknown' },
      ssotHashes: composed.stats.ssotContentHash
        ? { 'registro-schema-index': composed.stats.ssotContentHash }
        : {},
    });
    const bundleDir = path.join(reportDir, 'bundles');
    fs.mkdirSync(bundleDir, { recursive: true });
    const bundleFile = path.join(bundleDir, 'full-bundle.json');
    assertReportWritePathAllowed(repoRoot, bundleFile, config);
    fs.writeFileSync(bundleFile, JSON.stringify(bundle, null, 2), 'utf8');
    bundlePath = path.relative(repoRoot, bundleFile).replace(/\\/g, '/');
  }

  const ok =
    !composed.findings.some((f: ReportFinding) => f.severity === 'BLOQUEADOR') &&
    composed.stats.catalogHealth.overallStatus !== 'FAIL';

  return {
    ok,
    facet,
    report,
    reportPaths: [...reportPaths, catalogStatsPath, ...(bundlePath ? [bundlePath] : [])],
    catalogStatsPath,
    bundlePath,
    skippedFacets: composed.skippedFacets,
    validationErrors: [],
  };
}
