import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../policy/permissions.js';
import { assertReportWritePathAllowed } from '../policy/path-guard.js';
import { makeReportRunDir } from '../qa/report-runner.js';
import {
  buildSuggestedNext,
  capabilityForProfileFacet,
  composeProfileAudit,
  validateProfileAuditInput,
  type ProfileAuditFacet,
  type ProfileAuditInput,
} from '../core/profile-parity-engine/index.js';
import { runContractGate } from '../core/contract-engine/gate.js';
import { buildReportBundle } from '../reports/bundle.js';
import { ssotSnapshotFromGate, gateBlocksDomainEngine } from '../reports/ssot-from-gate.js';
import {
  buildReportFromFindings,
  buildCamcpReportDocument,
  writeCamcpReport,
} from '../reports/writer.js';
import type { CamcpReport, ReportFinding, WriteReportOptions } from '../reports/schema.js';

export interface ProfileAuditRunResult {
  ok: boolean;
  facet: ProfileAuditFacet;
  report: CamcpReport | null;
  reportPaths: string[];
  profileHealthPath: string | null;
  delegationIndexPath: string | null;
  bundlePath: string | null;
  skippedFacets: ProfileAuditFacet[];
  validationErrors: string[];
}

function writeProfileHealth(
  repoRoot: string,
  config: CamcpConfig,
  reportDir: string,
  health: ReturnType<typeof composeProfileAudit>['health']
): string {
  const healthPath = path.join(reportDir, 'profile-health.json');
  assertReportWritePathAllowed(repoRoot, healthPath, config);
  fs.writeFileSync(healthPath, JSON.stringify(health, null, 2), 'utf8');
  return path.relative(repoRoot, healthPath).replace(/\\/g, '/');
}

function writeDelegationIndex(
  repoRoot: string,
  config: CamcpConfig,
  reportDir: string,
  delegations: ReturnType<typeof composeProfileAudit>['delegations']
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
  bundleFacets: ReturnType<typeof composeProfileAudit>['bundleFacets'],
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
      module: 'profile.audit',
      gitCommit,
      durationMs,
      summary: `profile.audit:${item.facet}`,
      findings: item.findings,
    });
    const writeOptions: WriteReportOptions = {
      facet: item.facet,
      capability: 'report-only',
      domains: ['APP_REGISTRO', 'APP_PUBLICA'],
      provenance: {
        engines: [
          { id: 'profile-parity-engine', version: '1.0.0' },
          { id: 'contract-engine', version: '1.0.0' },
          { id: 'reports-engine', version: '2.0.0' },
        ],
      },
    };
    const doc = buildCamcpReportDocument('profile.audit', 'facet', report, writeOptions);
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

export function runProfileAudit(
  repoRoot: string,
  config: CamcpConfig,
  input: ProfileAuditInput = {}
): ProfileAuditRunResult {
  const t0 = Date.now();
  const facet: ProfileAuditFacet = input.facet ?? 'summary';
  const validationErrors = validateProfileAuditInput(input);
  if (validationErrors.length) {
    return {
      ok: false,
      facet,
      report: null,
      reportPaths: [],
      profileHealthPath: null,
      delegationIndexPath: null,
      bundlePath: null,
      skippedFacets: [],
      validationErrors,
    };
  }

  const composed = composeProfileAudit(repoRoot, config, input);
  const gate = runContractGate({
    repoRoot,
    facadeId: 'profile.audit',
    facet,
    ssotIds: ['registro-schema-index', 'perfil-publico'],
  });
  const gitCommit = gate.snapshots[0]?.contentHash?.slice(7, 15) ?? null;
  const durationMs = Date.now() - t0;

  const summaryText = `profile.audit:${facet} — health=${composed.health.overallStatus}, scope=${composed.health.coverage.subsInScope} subs`;

  const report = buildReportFromFindings({
    module: 'profile.audit',
    gitCommit,
    durationMs,
    summary: summaryText,
    findings: composed.findings,
  });

  const ssotSnapshot = ssotSnapshotFromGate(gate, gitCommit);
  const writeOptions: WriteReportOptions = {
    facet,
    capability: capabilityForProfileFacet(facet),
    domains: ['APP_REGISTRO', 'APP_PUBLICA'],
    ssot: ssotSnapshot,
    provenance: {
      engines: [
        { id: 'profile-parity-engine', version: '1.0.0' },
        { id: 'contract-engine', version: '1.0.0' },
        { id: 'qa-adapter-layer', version: '1.0.0' },
        { id: 'reports-engine', version: '2.0.0' },
      ],
      delegatedTools: composed.delegations.map((d) => d.delegatedToolId).filter(Boolean),
    },
    suggestedNext: {
      tools: buildSuggestedNext(composed),
      qaModules: [],
    },
    delegatedRuns: composed.delegations
      .filter((d) => d.qaReportDir)
      .map((d) => ({ toolId: d.delegatedToolId, reportDir: d.qaReportDir! })),
  };

  const reportPaths = writeCamcpReport(repoRoot, config, 'profile.audit', report, writeOptions);
  const manifestPath = reportPaths.find((p) => p.endsWith('manifest.json'));
  const reportDir = manifestPath
    ? path.resolve(repoRoot, path.dirname(manifestPath))
    : makeReportRunDir(repoRoot, config, 'profile.audit').reportDir;

  const profileHealthPath = writeProfileHealth(repoRoot, config, reportDir, composed.health);
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
    const idxSnap = gate.snapshots.find((s) => s.ssotId === 'registro-schema-index');
    const bundle = buildReportBundle({
      toolId: 'profile.audit',
      bundleId: `${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}:profile.audit`,
      facets: composed.bundleFacets.map((b) => b.facet),
      reports: facetReports,
      skippedFacets: composed.skippedFacets,
      summary: summaryText,
      ssotVersions: idxSnap?.version ? { 'registro-schema-index': idxSnap.version } : {},
      ssotHashes: idxSnap?.contentHash
        ? { 'registro-schema-index': idxSnap.contentHash }
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
    composed.health.overallStatus !== 'FAIL';

  return {
    ok,
    facet,
    report,
    reportPaths: [
      ...reportPaths,
      profileHealthPath,
      ...(delegationIndexPath ? [delegationIndexPath] : []),
      ...(bundlePath ? [bundlePath] : []),
    ],
    profileHealthPath,
    delegationIndexPath,
    bundlePath,
    skippedFacets: composed.skippedFacets,
    validationErrors: [],
  };
}
