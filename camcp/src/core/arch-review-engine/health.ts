import { maxSeverityFromFindings } from '../../reports/counts.js';
import { loadArchReviewConfig } from './config-loader.js';
import type { ArchReviewEngineContext, ArchReviewHealthDocument, ArchReviewFacet } from './types.js';
import type { ReportFinding } from '../../reports/schema.js';

function facetValid(findings: ReportFinding[] | undefined): boolean {
  if (!findings?.length) return true;
  return !findings.some((f) => f.severity === 'IMPORTANTE' || f.severity === 'BLOQUEADOR');
}

function scopeValid(ctx: ArchReviewEngineContext): boolean {
  if (!ctx.gitContext.path) return false;
  if (ctx.gitContext.stale && ctx.input.gitContext?.requireFresh) return false;
  return true;
}

export function buildArchReviewHealth(ctx: ArchReviewEngineContext): ArchReviewHealthDocument {
  const cfg = loadArchReviewConfig();
  const ff = ctx.facetFindings;

  const boundariesValid = facetValid(ff.boundaries);
  const frozenValid = facetValid(ff.frozen);
  const duplicatesValid = facetValid(ff.duplicates);
  const impactValid = facetValid(ff.impact);
  const graphValid = facetValid(ff.graph);
  const scopeValidFlag = scopeValid(ctx);
  const gitContextFresh = ctx.gitContext.path !== null && !ctx.gitContext.stale;

  const allFindings = Object.values(ff).flat().filter(Boolean) as ReportFinding[];
  const maxSev = maxSeverityFromFindings(
    allFindings.length
      ? allFindings.map((f) => ({
          id: f.id,
          severity: f.severity,
          code: f.code ?? 'UNKNOWN',
          confidence: f.confidence ?? 'high',
          title: f.title ?? f.message,
          message: f.message,
          domain: f.domain ?? 'ARCH',
          category: f.category ?? 'meta',
          evidence: [],
          provenance: { toolId: 'arch.review' },
        }))
      : [
          {
            id: 'PASS',
            severity: 'PASS' as const,
            code: 'PASS',
            confidence: 'high' as const,
            title: 'OK',
            message: 'OK',
            domain: 'CAMCP',
            category: 'meta',
            evidence: [],
            provenance: { toolId: 'arch.review' },
          },
        ]
  );

  let overallStatus: ArchReviewHealthDocument['overallStatus'] = 'PASS';
  if (!ctx.gate.ssotValid || maxSev === 'BLOQUEADOR' || maxSev === 'IMPORTANTE') {
    overallStatus = 'FAIL';
  } else if (maxSev === 'WARNING') {
    overallStatus = 'WARNING';
  }

  const dependencyGraph: ArchReviewHealthDocument['dependencyGraph'] = {};
  for (const [key, node] of Object.entries(cfg.archReviewHealthGraph)) {
    let valid = true;
    for (const dep of node.dependsOn) {
      if (dep === 'contract-gate') valid = valid && ctx.gate.ssotValid;
      else if (dep === 'git-context') valid = valid && gitContextFresh;
      else if (dep === 'scope') valid = valid && scopeValidFlag;
      else if (dep === 'boundaries') valid = valid && boundariesValid;
      else if (dep === 'frozen') valid = valid && frozenValid;
      else if (dep === 'duplicates') valid = valid && duplicatesValid;
      else if (dep === 'impact') valid = valid && impactValid;
      else if (dep === 'graph') valid = valid && graphValid;
    }
    dependencyGraph[key] = { dependsOn: node.dependsOn, valid };
  }

  return {
    schemaVersion: '1.0.0',
    ssotValid: ctx.gate.ssotValid,
    gitContextFresh,
    scopeValid: scopeValidFlag,
    boundariesValid,
    frozenValid,
    duplicatesValid,
    impactValid,
    graphValid,
    dependencyGraph,
    overallStatus,
  };
}

export function facetBlockedByGate(facet: ArchReviewFacet, ctx: ArchReviewEngineContext): boolean {
  if (!ctx.gate.ssotValid && facet !== 'summary' && facet !== 'scope') return true;
  return false;
}
