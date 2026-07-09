import type { HandoffEvidenceRef, HandoffOpenFinding } from './types.js';
import type { LoadedReport } from './report-loader.js';

export function buildEvidenceRefs(
  openFindings: HandoffOpenFinding[],
  reports: LoadedReport[],
  gitContextPath: string | null,
  previousHandoffPath: string | null,
  historicalEvidence?: Record<string, string>
): HandoffEvidenceRef[] {
  const refs: HandoffEvidenceRef[] = [];
  const seen = new Set<string>();

  const push = (ref: HandoffEvidenceRef) => {
    const key = `${ref.kind}|${ref.path}`;
    if (seen.has(key)) return;
    seen.add(key);
    refs.push(ref);
  };

  for (const f of openFindings) {
    push({
      kind: 'report',
      path: f.reportRef,
      schemaVersion: '2.0.0',
      toolId: f.toolId,
      runId: f.runId,
      label: `${f.severity} ${f.code}`,
    });
  }

  const impact = reports.find((r) => r.toolId === 'intel.impact');
  if (impact) {
    push({
      kind: 'report',
      path: impact.reportRef,
      schemaVersion: impact.legacy ? '1.0.0' : '2.0.0',
      toolId: impact.toolId,
      runId: impact.runId,
      label: 'Impact analysis',
    });
  }

  for (const r of reports) {
    if (openFindings.some((f) => f.reportRef === r.reportRef)) continue;
    push({
      kind: 'report',
      path: r.reportRef,
      schemaVersion: r.legacy ? '1.0.0' : '2.0.0',
      toolId: r.toolId,
      runId: r.runId,
      label: `Completed check ${r.toolId}`,
    });
  }

  if (gitContextPath) {
    push({
      kind: 'file',
      path: gitContextPath,
      schemaVersion: '1.0.0',
      label: 'Git context snapshot',
    });
  }

  if (previousHandoffPath) {
    push({
      kind: 'handoff',
      path: previousHandoffPath,
      schemaVersion: '1.0.0',
      label: 'Previous handoff (superseded)',
    });
  }

  if (historicalEvidence) {
    for (const [label, p] of Object.entries(historicalEvidence)) {
      push({
        kind: 'file',
        path: p,
        label: `Historical: ${label}`,
      });
    }
  }

  return refs;
}
