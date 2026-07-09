import type { ReportFinding } from '../../reports/schema.js';
import type { CatalogAuditFacet } from './types.js';

let findingSeq = 0;

export function resetCatalogFindingSeq(): void {
  findingSeq = 0;
}

function nextId(prefix: string): string {
  findingSeq += 1;
  return `${prefix}-${String(findingSeq).padStart(3, '0')}`;
}

export function catalogFinding(
  code: string,
  severity: ReportFinding['severity'],
  title: string,
  message: string,
  facet: CatalogAuditFacet,
  extra: Partial<ReportFinding> = {}
): ReportFinding {
  const prefix = code.startsWith('CATALOG.') ? 'CAT' : 'CAMCP';
  return {
    id: nextId(prefix),
    code,
    severity,
    confidence: extra.confidence ?? 'high',
    title,
    message,
    domain: extra.domain ?? 'CATALOG',
    category: extra.category ?? facet,
    subject: extra.subject,
    ssotRef: extra.ssotRef,
    evidenceRefs: extra.evidenceRefs,
    recommendation: extra.recommendation,
    provenance: {
      toolId: 'catalog.audit',
      facet,
      engineId: 'catalog-engine',
      ...extra.provenance,
    },
    tags: extra.tags,
  };
}

export function truncateFindings(
  findings: ReportFinding[],
  max: number,
  facet: CatalogAuditFacet
): { findings: ReportFinding[]; truncated: boolean } {
  if (findings.length <= max) return { findings, truncated: false };
  const kept = findings.slice(0, max);
  kept.push(
    catalogFinding(
      'CATALOG.STATS.TRUNCATED',
      'INFO',
      'Findings truncated',
      `Facet ${facet} truncated to ${max} findings (had ${findings.length})`,
      facet,
      { category: 'meta' }
    )
  );
  return { findings: kept, truncated: true };
}

export function buildRunCompleteFinding(facet: CatalogAuditFacet): ReportFinding {
  return catalogFinding(
    'CAMCP.CATALOG.RUN_COMPLETE',
    'PASS',
    'catalog.audit run complete',
    `catalog.audit:${facet} completed successfully`,
    facet,
    { domain: 'CAMCP', category: 'meta' }
  );
}

export function buildSsotInvalidFinding(message: string): ReportFinding {
  return catalogFinding(
    'CATALOG.SSOT.INVALID',
    'BLOQUEADOR',
    'Schema-index SSOT invalid',
    message,
    'summary',
    { domain: 'CATALOG', category: 'ssot' }
  );
}

export function buildMirrorMismatchFinding(path: string): ReportFinding {
  return catalogFinding(
    'CATALOG.SSOT.MIRROR_MISMATCH',
    'IMPORTANTE',
    'Schema-index mirror mismatch',
    `Mirror JS does not match JSON canonical hash (${path})`,
    'summary',
    {
      domain: 'CATALOG',
      category: 'ssot',
      evidenceRefs: [{ kind: 'file', path, label: 'schema-index mirror' }],
    }
  );
}

export function buildSsotUnchangedFinding(previousRunRef: string): ReportFinding {
  return catalogFinding(
    'CATALOG.SSOT.UNCHANGED',
    'INFO',
    'SSOT unchanged — expensive facets skipped',
    `Schema-index hash matches previous catalog.audit:full (${previousRunRef})`,
    'summary',
    {
      category: 'ssot',
      evidenceRefs: [{ kind: 'report', path: previousRunRef, label: 'Previous full run' }],
    }
  );
}

export function dedupeFindingsByPairKey(findings: ReportFinding[]): ReportFinding[] {
  const seen = new Set<string>();
  const out: ReportFinding[] = [];
  for (const f of findings) {
    const subject = f.subject as Record<string, unknown> | undefined;
    const pairKey = subject?.pairKey as string | undefined;
    const key = pairKey
      ? `${f.code}|${pairKey}`
      : `${f.code}|${JSON.stringify(subject ?? {})}|${f.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}
