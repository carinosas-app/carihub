import fs from 'node:fs';
import path from 'node:path';
import { maxSeverityFromFindings } from './counts.js';
import { REPORT_SCHEMA_VERSION } from './constants.js';
import { normalizeFindings } from './normalize.js';
import type {
  CamcpReportDocument,
  ReportBundleDocument,
  ReportFinding,
  ReportFindingNormalized,
  ReportStatus,
} from './schema.js';
import { statusFromSeverity } from './schema.js';

export interface BuildBundleInput {
  toolId: string;
  bundleId: string;
  facets: string[];
  reports: Array<{ facet: string; reportPath: string; document: CamcpReportDocument }>;
  skippedFacets?: string[];
  summary?: string;
  ssotVersions?: Record<string, string>;
  ssotHashes?: Record<string, string>;
}

function dedupeFindings(findings: ReportFindingNormalized[]): ReportFindingNormalized[] {
  const seen = new Set<string>();
  const out: ReportFindingNormalized[] = [];
  for (const f of findings) {
    const key = `${f.code}|${JSON.stringify(f.subject ?? {})}|${f.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

export function buildReportBundle(input: BuildBundleInput): ReportBundleDocument {
  const aggregated = dedupeFindings(input.reports.flatMap((r) => r.document.findings));
  const maxSev = maxSeverityFromFindings(aggregated.length ? aggregated : [{ id: 'PASS', severity: 'PASS', code: 'CAMCP.PASS', confidence: 'high', title: 'OK', message: 'OK', domain: 'CAMCP', category: 'meta', evidence: [], provenance: { toolId: input.toolId } }]);
  const status: ReportStatus = statusFromSeverity(maxSev);

  return {
    $schema: 'https://carihub.local/camcp/schemas/report-bundle@2.0.0.json',
    schemaVersion: REPORT_SCHEMA_VERSION,
    bundleId: input.bundleId,
    toolId: input.toolId,
    facets: input.facets,
    status,
    maxSeverity: maxSev,
    ssotVersions: input.ssotVersions ?? {},
    ssotHashes: input.ssotHashes ?? {},
    reports: input.reports.map((r) => ({ facet: r.facet, reportPath: r.reportPath })),
    aggregatedFindings: aggregated,
    skippedFacets: input.skippedFacets ?? [],
    summary:
      input.summary ??
      `${input.toolId} bundle ${input.facets.length} facet(s): ${status}, max=${maxSev}.`,
  };
}

/** Upgrade legacy findings-only bundle input for tests. */
export function aggregateFindingsFromReports(
  toolId: string,
  facetFindings: Array<{ facet: string; findings: ReportFinding[] }>
): ReportFindingNormalized[] {
  const all: ReportFindingNormalized[] = [];
  for (const item of facetFindings) {
    all.push(
      ...normalizeFindings(item.findings, {
        toolId,
        defaultCategory: item.facet,
      })
    );
  }
  return dedupeFindings(all);
}

export function writeReportBundleFile(
  repoRoot: string,
  bundleDir: string,
  bundle: ReportBundleDocument
): string {
  const bundlePath = path.join(bundleDir, 'bundles', 'full-bundle.json');
  fs.mkdirSync(path.dirname(bundlePath), { recursive: true });
  fs.writeFileSync(bundlePath, JSON.stringify(bundle, null, 2), 'utf8');
  return path.relative(repoRoot, bundlePath).replace(/\\/g, '/');
}
