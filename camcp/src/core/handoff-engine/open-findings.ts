import type { ReportFindingNormalized } from '../../reports/schema.js';
import type { ReportSeverity } from '../../intelligence/types.js';
import type { HandoffInput, HandoffOpenFinding } from './types.js';
import type { LoadedReport } from './report-loader.js';
import { loadHandoffConfig } from './config-loader.js';

const SEV_ORDER: Record<ReportSeverity, number> = {
  BLOQUEADOR: 0,
  IMPORTANTE: 1,
  WARNING: 2,
  INFO: 3,
  PASS: 4,
};

function severityRank(s: ReportSeverity): number {
  return SEV_ORDER[s] ?? 99;
}

function minSeverityRank(min: ReportSeverity): number {
  return severityRank(min);
}

function subjectKey(subject: Record<string, unknown> | undefined): string {
  if (!subject) return '';
  return JSON.stringify({
    sectorId: subject.sectorId,
    subcategoriaId: subject.subcategoriaId,
    fieldId: subject.fieldId,
    path: subject.path,
    type: subject.type,
  });
}

function findingInScope(
  finding: ReportFindingNormalized,
  scope: HandoffInput['scope']
): boolean {
  if (finding.severity === 'BLOQUEADOR') return true;
  if (!scope) return true;
  const paths = scope.paths ?? [];
  const sectors = new Set(scope.sectors ?? []);
  const subs = new Set(scope.subcategoriaIds ?? []);
  if (!paths.length && !sectors.size && !subs.size) return true;

  const subj = finding.subject ?? {};
  if (sectors.size && subj.sectorId && sectors.has(String(subj.sectorId))) return true;
  if (subs.size && subj.subcategoriaId && subs.has(String(subj.subcategoriaId))) return true;

  if (paths.length) {
    const candidates = [
      subj.path,
      finding.evidence?.[0]?.path,
      finding.ssotRef?.path,
    ].filter(Boolean) as string[];
    for (const p of candidates) {
      const norm = p.replace(/\\/g, '/');
      if (paths.some((sp) => norm === sp || norm.startsWith(sp.endsWith('/') ? sp : `${sp}/`))) {
        return true;
      }
    }
    return false;
  }
  return true;
}

function collectRawFindings(reports: LoadedReport[]): Array<{
  finding: ReportFindingNormalized;
  report: LoadedReport;
}> {
  const out: Array<{ finding: ReportFindingNormalized; report: LoadedReport }> = [];
  for (const report of reports) {
    if (!report.document) continue;
    for (const f of report.document.findings) {
      out.push({ finding: f, report });
    }
  }
  return out;
}

export interface OpenFindingsResult {
  openFindings: HandoffOpenFinding[];
  truncated: boolean;
}

export function selectOpenFindings(
  reports: LoadedReport[],
  input: HandoffInput,
  maxOverride?: number
): OpenFindingsResult {
  const cfg = loadHandoffConfig();
  const minSeverity = (input.findings?.minSeverity ??
    cfg.defaults.minSeverity) as ReportSeverity;
  const includeWarnings = input.findings?.includeWarnings ?? cfg.defaults.includeWarnings;
  const includeHypothesis = input.findings?.includeHypothesis ?? cfg.defaults.includeHypothesis;
  const maxOpen =
    maxOverride ??
    input.findings?.maxOpenFindings ??
    cfg.defaults.maxOpenFindings;

  const minRank = minSeverityRank(minSeverity);
  const raw = collectRawFindings(reports);

  const filtered = raw.filter(({ finding }) => {
    if (finding.severity === 'PASS') return false;
    if (finding.confidence === 'hypothesis' && !includeHypothesis) return false;
    if (finding.severity === 'INFO' && !includeWarnings) return false;
    if (finding.severity === 'WARNING' && !includeWarnings) return false;
    if (severityRank(finding.severity) > minRank) {
      if (finding.severity === 'WARNING' && includeWarnings) {
        /* OF2 */
      } else if (
        finding.severity === 'BLOQUEADOR' ||
        finding.severity === 'IMPORTANTE'
      ) {
        /* OF1 */
      } else {
        return false;
      }
    }
    if (
      (finding.severity === 'IMPORTANTE' || finding.severity === 'BLOQUEADOR') &&
      finding.confidence === 'hypothesis' &&
      !includeHypothesis
    ) {
      return false;
    }
    if (!findingInScope(finding, input.scope)) return false;
    return Boolean(finding.code && finding.id);
  });

  const dedup = new Map<string, { finding: ReportFindingNormalized; report: LoadedReport }>();
  for (const item of filtered) {
    const key = `${item.finding.code}|${subjectKey(item.finding.subject)}`;
    const prev = dedup.get(key);
    if (!prev) {
      dedup.set(key, item);
      continue;
    }
    const prevTime = new Date(prev.report.generatedAt).getTime();
    const curTime = new Date(item.report.generatedAt).getTime();
    const prevSev = severityRank(prev.finding.severity);
    const curSev = severityRank(item.finding.severity);
    if (curSev < prevSev || (curSev === prevSev && curTime > prevTime)) {
      dedup.set(key, item);
    }
  }

  const sorted = [...dedup.values()].sort((a, b) => {
    const sd = severityRank(a.finding.severity) - severityRank(b.finding.severity);
    if (sd !== 0) return sd;
    return a.finding.code.localeCompare(b.finding.code);
  });

  const truncated = sorted.length > maxOpen;
  const openFindings: HandoffOpenFinding[] = sorted.slice(0, maxOpen).map(({ finding, report }) => ({
    findingId: finding.id,
    code: finding.code,
    severity: finding.severity,
    confidence: finding.confidence,
    title: finding.title,
    domain: finding.domain,
    subject: finding.subject,
    reportRef: report.reportRef,
    runId: report.runId,
    toolId: report.toolId,
    facet: report.facet,
  }));

  return { openFindings, truncated };
}
