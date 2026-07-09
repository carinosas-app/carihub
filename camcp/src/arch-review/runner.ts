import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../policy/permissions.js';
import { assertReportWritePathAllowed } from '../policy/path-guard.js';
import { makeReportRunDir } from '../qa/report-runner.js';
import {
  buildSuggestedNext,
  capabilityForArchFacet,
  composeArchReview,
  validateArchReviewInput,
  type ArchReviewFacet,
  type ArchReviewInput,
} from '../core/arch-review-engine/index.js';
import { runContractGate } from '../core/contract-engine/gate.js';
import { buildReportBundle } from '../reports/bundle.js';
import { ssotSnapshotFromGate } from '../reports/ssot-from-gate.js';
import {
  buildReportFromFindings,
  buildCamcpReportDocument,
  writeCamcpReport,
} from '../reports/writer.js';
import type { CamcpReport, ReportFinding, WriteReportOptions } from '../reports/schema.js';

export interface ArchReviewRunResult {
  ok: boolean;
  facet: ArchReviewFacet;
  report: CamcpReport | null;
  reportPaths: string[];
  archReviewHealthPath: string | null;
  delegationIndexPath: string | null;
  bundlePath: string | null;
  skippedFacets: ArchReviewFacet[];
  validationErrors: string[];
}

function writeArchReviewHealth(
  repoRoot: string,
  config: CamcpConfig,
  reportDir: string,
  health: ReturnType<typeof composeArchReview>['health']
): string {
  const healthPath = path.join(reportDir, 'arch-review-health.json');
  assertReportWritePathAllowed(repoRoot, healthPath, config);
  fs.writeFileSync(healthPath, JSON.stringify(health, null, 2), 'utf8');
  return path.relative(repoRoot, healthPath).replace(/\\/g, '/');
}

function writeDelegationIndex(
  repoRoot: string,
  config: CamcpConfig,
  reportDir: string,
  delegations: ReturnType<typeof composeArchReview>['delegations']
): string {
  const delegatedDir = path.join(reportDir, 'delegated');
  fs.mkdirSync(delegatedDir, { recursive: true });
  const indexPath = path.join(delegatedDir, 'delegation-index.json');
  assertReportWritePathAllowed(repoRoot, indexPath, config);
  fs.writeFileSync(
    indexPath,
    JSON.stringify({ schemaVersion: '1.0.0', delegations }, null, 2),
    'utf8'
  );
  return path.relative(repoRoot, indexPath).replace(/\\/g, '/');
}

function writeFacetReports(
  repoRoot: string,
  config: CamcpConfig,
  reportDir: string,
  bundleFacets: ReturnType<typeof composeArchReview>['bundleFacets'],
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
    const facetDir = path.join(facetsDir, item.facet);
    fs.mkdirSync(facetDir, { recursive: true });
    const report = buildReportFromFindings({
      module: 'arch.review',
      gitCommit,
      durationMs,
      summary: `arch.review:${item.facet}`,
      findings: item.findings,
    });
    const writeOptions: WriteReportOptions = {
      facet: item.facet,
      capability: 'report-only',
      domains: ['ARCH', 'CAMCP'],
      provenance: {
        engines: [
          { id: 'arch-review-engine', version: '1.0.0' },
          { id: 'contract-engine', version: '1.0.0' },
          { id: 'reports-engine', version: '2.0.0' },
        ],
      },
    };
    const doc = buildCamcpReportDocument('arch.review', 'facet', report, writeOptions);
    const reportJson = path.join(facetDir, 'report.json');
    assertReportWritePathAllowed(repoRoot, reportJson, config);
    fs.writeFileSync(reportJson, JSON.stringify(doc, null, 2), 'utf8');
    reports.push({
      facet: item.facet,
      reportPath: path.relative(repoRoot, reportJson).replace(/\\/g, '/'),
      document: doc,
    });
  }

  return reports;
}

export function runArchReview(
  repoRoot: string,
  config: CamcpConfig,
  input: ArchReviewInput = {}
): ArchReviewRunResult {
  const t0 = Date.now();
  const facet: ArchReviewFacet = input.facet ?? 'summary';
  const validationErrors = validateArchReviewInput(input);
  if (validationErrors.length) {
    return {
      ok: false,
      facet,
      report: null,
      reportPaths: [],
      archReviewHealthPath: null,
      delegationIndexPath: null,
      bundlePath: null,
      skippedFacets: [],
      validationErrors,
    };
  }

  const composed = composeArchReview(repoRoot, config, input);
  const gate = runContractGate({
    repoRoot,
    facadeId: 'arch.review',
    facet,
  });
  const gitCommit = gate.snapshots[0]?.contentHash?.slice(7, 15) ?? null;
  const durationMs = Date.now() - t0;

  const summaryText = `arch.review:${facet} — health=${composed.health.overallStatus}, scope=${composed.gitContextRef.filesChanged} files`;

  const report = buildReportFromFindings({
    module: 'arch.review',
    gitCommit,
    durationMs,
    summary: summaryText,
    findings: composed.findings,
  });

  const ssotSnapshot = ssotSnapshotFromGate(gate, gitCommit);
  const writeOptions: WriteReportOptions = {
    facet,
    capability: capabilityForArchFacet(facet),
    domains: ['ARCH', 'CAMCP'],
    ssot: ssotSnapshot,
    provenance: {
      engines: [
        { id: 'arch-review-engine', version: '1.0.0' },
        { id: 'contract-engine', version: '1.0.0' },
        { id: 'reports-engine', version: '2.0.0' },
      ],
      delegatedTools: composed.delegations.map((d) => d.delegatedToolId).filter(Boolean),
    },
    suggestedNext: {
      tools: buildSuggestedNext(composed),
      qaModules: [],
    },
    delegatedRuns: composed.delegations
      .filter((d) => d.reportRef)
      .map((d) => ({
        toolId: d.delegatedToolId,
        reportDir: path.dirname(d.reportRef!).replace(/\\/g, '/'),
      })),
  };

  const reportPaths = writeCamcpReport(repoRoot, config, 'arch.review', report, writeOptions);
  const manifestPath = reportPaths.find((p) => p.endsWith('manifest.json'));
  const reportDir = manifestPath
    ? path.resolve(repoRoot, path.dirname(manifestPath))
    : makeReportRunDir(repoRoot, config, 'arch.review').reportDir;

  const archReviewHealthPath = writeArchReviewHealth(
    repoRoot,
    config,
    reportDir,
    composed.health
  );
  const delegationIndexPath =
    composed.delegations.length > 0
      ? writeDelegationIndex(repoRoot, config, reportDir, composed.delegations)
      : null;

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
    const mapaSnap = gate.snapshots.find((s) => s.ssotId === 'mapa-maestro');
    const intelSnap = gate.snapshots.find((s) => s.ssotId === 'intelligence-config');
    const archSnap = gate.snapshots.find((s) => s.ssotId === 'arch-config');
    const ssotVersions: Record<string, string> = {};
    const ssotHashes: Record<string, string> = {};
    for (const snap of [mapaSnap, intelSnap, archSnap]) {
      if (!snap) continue;
      if (snap.version) ssotVersions[snap.ssotId] = snap.version;
      if (snap.contentHash) ssotHashes[snap.ssotId] = snap.contentHash;
    }
    const bundle = buildReportBundle({
      toolId: 'arch.review',
      bundleId: `${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}:arch.review`,
      facets: composed.bundleFacets.map((b) => b.facet),
      reports: facetReports,
      skippedFacets: composed.skippedFacets,
      summary: summaryText,
      ssotVersions,
      ssotHashes,
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
    composed.health.overallStatus !== 'FAIL';

  return {
    ok,
    facet,
    report,
    reportPaths: [
      ...reportPaths,
      archReviewHealthPath,
      ...(delegationIndexPath ? [delegationIndexPath] : []),
      ...(bundlePath ? [bundlePath] : []),
    ],
    archReviewHealthPath,
    delegationIndexPath,
    bundlePath,
    skippedFacets: composed.skippedFacets,
    validationErrors: [],
  };
}
