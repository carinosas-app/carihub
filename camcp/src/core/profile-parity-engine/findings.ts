import type { ReportFinding } from '../../reports/schema.js';
import type { ProfileAuditFacet } from './types.js';

let findingSeq = 0;

export function resetProfileFindingSeq(): void {
  findingSeq = 0;
}

function nextId(prefix: string): string {
  findingSeq += 1;
  return `${prefix}-${String(findingSeq).padStart(3, '0')}`;
}

export function profileFinding(
  code: string,
  severity: ReportFinding['severity'],
  title: string,
  message: string,
  facet: ProfileAuditFacet,
  extra: Partial<ReportFinding> = {}
): ReportFinding {
  const prefix = code.startsWith('PARITY.') || code.startsWith('PRIVACY.') || code.startsWith('PIPELINE.')
    ? 'PRF'
    : code.startsWith('PROFILE.')
      ? 'PRF'
      : 'PRF';
  return {
    id: nextId(prefix),
    code,
    severity,
    confidence: extra.confidence ?? 'high',
    title,
    message,
    domain: extra.domain ?? (code.startsWith('PRIVACY.') ? 'APP_REGISTRO' : 'APP_REGISTRO'),
    category: extra.category ?? facet,
    subject: extra.subject,
    ssotRef: extra.ssotRef,
    evidenceRefs: extra.evidenceRefs,
    recommendation: extra.recommendation,
    provenance: {
      toolId: 'profile.audit',
      facet,
      engineId: 'profile-parity-engine',
      ...extra.provenance,
    },
    tags: extra.tags,
  };
}

export function remapDelegatedFindings(
  findings: ReportFinding[],
  facet: ProfileAuditFacet,
  delegatedToolId: string
): ReportFinding[] {
  return findings.map((f) => ({
    ...f,
    id: nextId('PRF'),
    provenance: {
      toolId: 'profile.audit',
      facet,
      engineId: 'profile-parity-engine',
      delegatedToolId,
      ...(f.provenance ?? {}),
    },
  }));
}

export function buildSsotInvalidFinding(message: string): ReportFinding {
  return profileFinding(
    'PARITY.SSOT.INVALID',
    'BLOQUEADOR',
    'Profile audit SSOT invalid',
    message,
    'summary',
    { category: 'ssot' }
  );
}

export function buildScopeMissingFinding(): ReportFinding {
  return profileFinding(
    'PARITY.SCOPE.MISSING',
    'WARNING',
    'Scope missing',
    'No sectorId, subcategoriaIds, or packId — only summary facet recommended',
    'summary',
    { category: 'scope' }
  );
}

export function buildVisualNotImplementedFinding(): ReportFinding {
  return profileFinding(
    'PROFILE.VISUAL.NOT_IMPLEMENTED',
    'INFO',
    'profile.visual.audit reserved',
    'profile.visual.audit is RESERVED — no runtime in Phase 1 v1',
    'summary',
    { category: 'reserved', domain: 'PROFILE' }
  );
}

export function buildRunCompleteFinding(facet: ProfileAuditFacet): ReportFinding {
  return profileFinding(
    'CAMCP.PROFILE.RUN_COMPLETE',
    'PASS',
    'profile.audit run complete',
    `profile.audit:${facet} completed`,
    facet,
    { domain: 'CAMCP', category: 'meta' }
  );
}

export function truncateFindings(
  findings: ReportFinding[],
  max: number,
  facet: ProfileAuditFacet
): { findings: ReportFinding[]; truncated: boolean } {
  if (findings.length <= max) return { findings, truncated: false };
  const kept = findings.slice(0, max);
  kept.push(
    profileFinding(
      'PARITY.STATS.TRUNCATED',
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
    const key = `${f.code}|${JSON.stringify(f.subject ?? {})}|${f.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}
