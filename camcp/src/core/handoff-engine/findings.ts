import type { ReportFinding } from '../../reports/schema.js';
import type { HandoffCompletedCheck } from './types.js';

let seq = 0;

export function resetHandoffFindingSeq(): void {
  seq = 0;
}

function nextId(prefix: string): string {
  seq += 1;
  return `${prefix}-${String(seq).padStart(3, '0')}`;
}

export function buildHandoffMetaFindings(input: {
  noEvidence: boolean;
  prUnavailable: boolean;
  staleChecks: HandoffCompletedCheck[];
  truncatedFindings: boolean;
  facet: string;
}): ReportFinding[] {
  const findings: ReportFinding[] = [];

  findings.push({
    id: nextId('HO'),
    code: 'CAMCP.HANDOFF.GENERATED',
    severity: 'PASS',
    title: 'Handoff brief generated',
    message: `context.handoff:${input.facet} completed`,
    domain: 'CAMCP',
  });

  if (input.noEvidence) {
    findings.push({
      id: nextId('HO'),
      code: 'CAMCP.HANDOFF.NO_EVIDENCE',
      severity: 'WARNING',
      title: 'No report evidence loaded',
      message: 'No CAMCP reports matched selection criteria',
      domain: 'CAMCP',
    });
  }

  if (input.prUnavailable) {
    findings.push({
      id: nextId('HO'),
      code: 'CAMCP.HANDOFF.PR_UNAVAILABLE',
      severity: 'INFO',
      title: 'PR context unavailable',
      message: 'gh not available — PR fields null',
      domain: 'CAMCP',
    });
  }

  for (const check of input.staleChecks.filter((c) => !c.valid)) {
    findings.push({
      id: nextId('HO'),
      code: 'CAMCP.HANDOFF.STALE_CHECK',
      severity: 'WARNING',
      title: 'Completed check stale',
      message: `${check.toolId}:${check.facet ?? 'default'} invalidated (${check.invalidatedReason})`,
      domain: 'CAMCP',
      subject: { toolId: check.toolId, runId: check.runId },
    });
  }

  if (input.truncatedFindings) {
    findings.push({
      id: nextId('HO'),
      code: 'CAMCP.HANDOFF.FINDINGS_TRUNCATED',
      severity: 'INFO',
      title: 'Open findings truncated',
      message: 'maxOpenFindings limit applied',
      domain: 'CAMCP',
    });
  }

  return findings;
}
