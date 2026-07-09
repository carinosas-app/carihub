import type { ReportFinding } from '../../../reports/schema.js';
import type { ArchReviewEngineContext } from '../types.js';
import { archFinding } from '../findings.js';

export function runScopeFacet(ctx: ArchReviewEngineContext): ReportFinding[] {
  const findings: ReportFinding[] = [];
  const gc = ctx.gitContext;

  if (!gc.path) {
    findings.push(
      archFinding(
        'ARCH.SCOPE.NO_GIT_CONTEXT',
        'WARNING',
        'Git context unavailable',
        'No git-context.json from git.worktree — run git.worktree:full first',
        'scope',
        { category: 'git-context' }
      )
    );
    return findings;
  }

  if (gc.stale) {
    const severity = ctx.input.gitContext?.requireFresh ? 'IMPORTANTE' : 'WARNING';
    findings.push(
      archFinding(
        'ARCH.SCOPE.GIT_CONTEXT_STALE',
        severity,
        'Git context stale',
        `Stored HEAD ${gc.headShort} differs from current repo HEAD`,
        'scope',
        {
          category: 'git-context',
          evidenceRefs: [{ kind: 'file', path: gc.path }],
        }
      )
    );
  }

  findings.push(
    archFinding(
      'ARCH.SCOPE.SUMMARY',
      'INFO',
      'Review scope',
      `${gc.filesChanged} file(s) in scope (${gc.baseRef}...${gc.headRef})`,
      'scope',
      {
        category: 'scope',
        evidenceRefs: [{ kind: 'file', path: gc.path }],
      }
    )
  );

  const preview = gc.changedFiles.slice(0, 20);
  for (const file of preview) {
    findings.push(
      archFinding(
        'ARCH.SCOPE.FILE',
        'INFO',
        'Changed file',
        file,
        'scope',
        { category: 'scope', subject: { type: 'file', path: file } }
      )
    );
  }

  if (gc.changedFiles.length > 20) {
    findings.push(
      archFinding(
        'ARCH.SCOPE.TRUNCATED',
        'INFO',
        'Scope truncated',
        `${gc.changedFiles.length - 20} additional file(s) omitted from listing`,
        'scope',
        { category: 'scope' }
      )
    );
  }

  return findings;
}

export function runSummaryFacet(ctx: ArchReviewEngineContext): ReportFinding[] {
  const findings: ReportFinding[] = [...gateFindingsFromContract(ctx)];
  const frozenBlockers =
    ctx.facetFindings.frozen?.filter(
      (f) =>
        f.severity === 'BLOQUEADOR' ||
        f.code?.startsWith('GOV.FROZEN') ||
        f.id.startsWith('ARCH-FROZEN-')
    ).length ?? 0;

  findings.push(
    archFinding(
      'ARCH.HEALTH.SUMMARY',
      frozenBlockers > 0 ? 'BLOQUEADOR' : 'INFO',
      'Architecture review summary',
      `ssot=${ctx.gate.ssotValid} gitContext=${ctx.gitContext.path ? 'present' : 'missing'} frozenBlockers=${frozenBlockers}`,
      'summary',
      { category: 'health' }
    )
  );

  for (const snap of ctx.gate.snapshots) {
    findings.push(
      archFinding(
        'ARCH.SSOT.SNAPSHOT',
        'INFO',
        'SSOT snapshot',
        `${snap.ssotId} @ ${snap.version ?? 'unknown'}`,
        'summary',
        {
          ssotRef: {
            ssotId: snap.ssotId,
            path: snap.path,
            version: snap.version ?? undefined,
          },
        }
      )
    );
  }

  if (frozenBlockers > 0) {
    findings.push(
      archFinding(
        'GOV.FROZEN.PRE_MERGE_BLOCK',
        'BLOQUEADOR',
        'Frozen module violations',
        `${frozenBlockers} frozen violation(s) — resolve before merge`,
        'summary',
        {
          category: 'governance',
          recommendation: 'Revert frozen changes or obtain ACTA authorization',
        }
      )
    );
  }

  return findings;
}

export function gateFindingsFromContract(ctx: ArchReviewEngineContext): ReportFinding[] {
  const findings: ReportFinding[] = [];
  for (const err of ctx.gate.errors) {
    findings.push(
      archFinding(
        err.code.startsWith('ARCH.') ? err.code : 'ARCH.SSOT.INVALID',
        'BLOQUEADOR',
        'Contract gate error',
        err.message,
        'summary',
        { category: 'ssot', provenance: { toolId: 'arch.review', engineId: 'contract-engine' } }
      )
    );
  }
  for (const warn of ctx.gate.warnings) {
    findings.push(
      archFinding(
        'ARCH.SSOT.WARNING',
        'WARNING',
        'Contract gate warning',
        warn.message,
        'summary',
        { category: 'ssot', provenance: { toolId: 'arch.review', engineId: 'contract-engine' } }
      )
    );
  }
  return findings;
}
