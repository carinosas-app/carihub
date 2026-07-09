import type { ReportFinding } from '../../reports/schema.js';
import type { ArchReviewFacet } from './types.js';

let findingSeq = 0;

export function resetArchFindingSeq(): void {
  findingSeq = 0;
}

function nextId(prefix: string): string {
  findingSeq += 1;
  return `${prefix}-${String(findingSeq).padStart(3, '0')}`;
}

export function archFinding(
  code: string,
  severity: ReportFinding['severity'],
  title: string,
  message: string,
  facet: ArchReviewFacet,
  extra: Partial<ReportFinding> = {}
): ReportFinding {
  return {
    id: nextId('AR'),
    code,
    severity,
    confidence: extra.confidence ?? 'high',
    title,
    message,
    domain: extra.domain ?? 'ARCH',
    category: extra.category ?? facet,
    subject: extra.subject,
    ssotRef: extra.ssotRef,
    evidenceRefs: extra.evidenceRefs,
    recommendation: extra.recommendation,
    provenance: {
      toolId: 'arch.review',
      facet,
      engineId: 'arch-review-engine',
      ...extra.provenance,
    },
    tags: extra.tags,
  };
}

export function remapDelegatedFindings(
  findings: ReportFinding[],
  facet: ArchReviewFacet,
  delegatedToolId: string
): ReportFinding[] {
  return findings.map((f) => ({
    ...f,
    id: nextId('AR'),
    provenance: {
      toolId: 'arch.review',
      facet,
      engineId: 'arch-review-engine',
      delegatedToolId,
      ...(f.provenance ?? {}),
    },
  }));
}

export function buildSsotInvalidFinding(message: string): ReportFinding {
  return archFinding(
    'ARCH.SSOT.INVALID',
    'BLOQUEADOR',
    'Architecture review SSOT invalid',
    message,
    'summary',
    { category: 'ssot' }
  );
}

export function buildRunCompleteFinding(facet: ArchReviewFacet): ReportFinding {
  return archFinding(
    'CAMCP.ARCH.RUN_COMPLETE',
    'PASS',
    'arch.review run complete',
    `arch.review:${facet} completed`,
    facet,
    { domain: 'CAMCP', category: 'meta' }
  );
}

export function truncateFindings(
  findings: ReportFinding[],
  max: number,
  facet: ArchReviewFacet
): { findings: ReportFinding[]; truncated: boolean } {
  if (findings.length <= max) return { findings, truncated: false };
  const kept = findings.slice(0, max);
  kept.push(
    archFinding(
      'ARCH.STATS.TRUNCATED',
      'INFO',
      'Findings truncated',
      `Facet ${facet} truncated to ${max} findings`,
      facet,
      { category: 'meta' }
    )
  );
  return { findings: kept, truncated: true };
}

export function dedupeFindings(findings: ReportFinding[]): ReportFinding[] {
  const seen = new Set<string>();
  const out: ReportFinding[] = [];
  for (const f of findings) {
    const key = `${f.code}|${JSON.stringify(f.subject ?? {})}|${f.title ?? f.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}
