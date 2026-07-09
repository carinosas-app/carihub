import type { ReportSeverity } from '../intelligence/types.js';
import type { EvidenceRef, ReportFinding, ReportFindingNormalized } from './schema.js';

function sanitizeCodePart(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
    .slice(0, 48) || 'UNKNOWN';
}

function legacyEvidenceToRefs(f: ReportFinding): EvidenceRef[] {
  if (f.evidenceRefs?.length) return f.evidenceRefs;
  if (typeof f.evidence === 'string' && f.evidence.trim()) {
    return [{ kind: 'file', path: f.evidence.trim(), label: 'Legacy evidence string' }];
  }
  return [];
}

function capSeverityForConfidence(
  severity: ReportSeverity,
  confidence: ReportFindingNormalized['confidence']
): ReportSeverity {
  if (confidence === 'hypothesis' && severity === 'BLOQUEADOR') return 'IMPORTANTE';
  return severity;
}

export function normalizeFinding(
  f: ReportFinding,
  ctx: { toolId: string; defaultDomain?: string; defaultCategory?: string }
): ReportFindingNormalized {
  const message = f.message?.trim() || f.title?.trim() || '(no message)';
  const title =
    f.title?.trim() ||
    (message.length > 120 ? `${message.slice(0, 117)}...` : message);
  const code = f.code?.trim() || `LEGACY.${sanitizeCodePart(f.id)}`;
  const confidence = f.confidence ?? 'high';
  const severity = capSeverityForConfidence(f.severity, confidence);

  const recommendation =
    f.recommendation && typeof f.recommendation === 'object'
      ? f.recommendation
      : f.recommendation
        ? { action: 'review' as const, hint: String(f.recommendation) }
        : undefined;

  return {
    id: f.id,
    code,
    severity,
    confidence,
    title,
    message,
    domain: f.domain ?? ctx.defaultDomain ?? 'CAMCP',
    category: f.category ?? ctx.defaultCategory ?? 'legacy',
    subject: f.subject,
    impact: f.impact && typeof f.impact === 'object' ? f.impact : f.impact ? { surfaces: [String(f.impact)] } : undefined,
    recommendation,
    ssotRef: f.ssotRef,
    evidence: legacyEvidenceToRefs(f),
    provenance: f.provenance ?? {
      toolId: ctx.toolId,
      engineId: 'reports-engine',
    },
    relatedFindings: f.relatedFindings,
    supersedes: f.supersedes ?? null,
    tags: f.tags,
  };
}

export function normalizeFindings(
  findings: ReportFinding[],
  ctx: { toolId: string; defaultDomain?: string; defaultCategory?: string }
): ReportFindingNormalized[] {
  const list = findings.length ? findings : [{ id: 'CAMCP-PASS-0', severity: 'PASS' as const, message: 'OK' }];
  return list.map((f) => normalizeFinding(f, ctx));
}
