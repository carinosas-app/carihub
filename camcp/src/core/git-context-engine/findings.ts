import type { ReportFinding } from '../../reports/schema.js';
import type { ConflictAnalysis } from './conflicts.js';
import type { GitWorktreeFacet } from './types.js';
import type { StateBuildResult } from './state.js';
import type { StaleAnalysis } from './stale.js';
import type { CleanupCandidate } from './types.js';
import type { DiffSummary } from './types.js';
import type { PrContext } from './types.js';
import type { GitRecommendation } from './types.js';

let findingSeq = 0;

function nextId(prefix: string): string {
  findingSeq += 1;
  return `${prefix}-${String(findingSeq).padStart(3, '0')}`;
}

export function resetFindingSeq(): void {
  findingSeq = 0;
}

export function buildStateFindings(state: StateBuildResult, facet: GitWorktreeFacet): ReportFinding[] {
  const findings: ReportFinding[] = [];

  if (!state.repoReadable) {
    findings.push({
      id: nextId('GW'),
      code: 'GIT.REPO.UNREADABLE',
      severity: 'BLOQUEADOR',
      title: 'Repository unreadable',
      message: 'Cannot read git repository at repoRoot',
      domain: 'GIT',
    });
    return findings;
  }

  if (!state.worktreesEnumerated) {
    findings.push({
      id: nextId('GW'),
      code: 'WORKTREE.DISCOVERY.FAILED',
      severity: 'IMPORTANTE',
      title: 'Worktree discovery failed',
      message: 'git worktree list --porcelain failed',
      domain: 'WORKTREE',
    });
  }

  for (const [, ids] of state.duplicateBranchGroups) {
    if (ids.length < 2) continue;
    findings.push({
      id: nextId('GW'),
      code: 'WORKTREE.DUPLICATE_BRANCH',
      severity: 'WARNING',
      title: 'Duplicate branch across worktrees',
      message: `Branch shared by worktrees: ${ids.join(', ')}`,
      domain: 'WORKTREE',
      subject: { type: 'worktree', worktreeIds: ids },
    });
  }

  for (const wt of state.worktrees) {
    if (wt.detached) {
      findings.push({
        id: nextId('GW'),
        code: 'GIT.BRANCH.DETACHED',
        severity: 'WARNING',
        title: 'Detached HEAD',
        message: `Worktree ${wt.id} is in detached HEAD state`,
        domain: 'GIT',
        subject: {
          type: 'worktree',
          worktreeId: wt.id,
          path: wt.path,
          headCommit: wt.headCommit ?? undefined,
        },
      });
    }
    if (!wt.branch && !wt.detached) {
      findings.push({
        id: nextId('GW'),
        code: 'GIT.BRANCH.NO_UPSTREAM',
        severity: 'INFO',
        title: 'No branch tracking',
        message: `Worktree ${wt.id} has no branch name`,
        domain: 'GIT',
      });
    }
  }

  if (facet === 'full') {
    findings.push({
      id: nextId('GW'),
      code: 'GIT.WORKTREE.RUN_COMPLETE',
      severity: 'PASS',
      title: 'git.worktree full run complete',
      message: `Captured ${state.worktrees.length} worktree(s)`,
      domain: 'GIT',
    });
  }

  return findings;
}

export function buildDiffFindings(diff: DiffSummary | null, computed: boolean, threshold: number): ReportFinding[] {
  const findings: ReportFinding[] = [];
  if (!computed) {
    findings.push({
      id: nextId('GW'),
      code: 'GIT.DIFF.FAILED',
      severity: 'IMPORTANTE',
      title: 'Diff computation failed',
      message: 'Could not compute diff vs baseRef',
      domain: 'GIT',
    });
    return findings;
  }
  if (!diff) {
    findings.push({
      id: nextId('GW'),
      code: 'GIT.BASE.REF_UNKNOWN',
      severity: 'IMPORTANTE',
      title: 'Unknown base ref',
      message: 'Base ref not available for diff',
      domain: 'GIT',
    });
    return findings;
  }
  if (diff.filesChanged > threshold) {
    findings.push({
      id: nextId('GW'),
      code: 'GIT.DIFF.LARGE_CHANGES',
      severity: 'WARNING',
      title: 'Large diff',
      message: `${diff.filesChanged} files changed (threshold ${threshold})`,
      domain: 'GIT',
    });
  }
  return findings;
}

export function buildPrFindings(
  pr: PrContext,
  ghAvailable: boolean,
  prFound: boolean
): ReportFinding[] {
  const findings: ReportFinding[] = [];
  if (!ghAvailable) {
    findings.push({
      id: nextId('GW'),
      code: 'PR.GH.UNAVAILABLE',
      severity: 'INFO',
      title: 'GitHub CLI unavailable',
      message: 'gh not available — PR fields null',
      domain: 'PR',
    });
    return findings;
  }
  if (!prFound) {
    findings.push({
      id: nextId('GW'),
      code: 'PR.NOT_FOUND',
      severity: 'INFO',
      title: 'No PR for branch',
      message: 'No open PR inferred for current branch',
      domain: 'PR',
    });
    return findings;
  }
  if (pr.checks.fail > 0) {
    findings.push({
      id: nextId('GW'),
      code: 'PR.CHECKS.FAILING',
      severity: 'IMPORTANTE',
      title: 'PR checks failing',
      message: `${pr.checks.fail} check(s) failing on PR #${pr.number}`,
      domain: 'PR',
    });
  } else if (pr.checks.pending > 0) {
    findings.push({
      id: nextId('GW'),
      code: 'PR.CHECKS.PENDING',
      severity: 'WARNING',
      title: 'PR checks pending',
      message: `${pr.checks.pending} check(s) pending on PR #${pr.number}`,
      domain: 'PR',
    });
  }
  return findings;
}

export function buildConflictFindings(analysis: ConflictAnalysis): ReportFinding[] {
  const findings: ReportFinding[] = [];
  if (analysis.conflictRisk === 'high') {
    findings.push({
      id: nextId('GW'),
      code: 'WORKTREE.CONFLICT.RISK_HIGH',
      severity: 'IMPORTANTE',
      title: 'High conflict risk',
      message: 'Worktrees on same branch with dirty state or overlapping paths',
      domain: 'WORKTREE',
    });
  } else if (analysis.conflictRisk === 'medium') {
    findings.push({
      id: nextId('GW'),
      code: 'WORKTREE.CONFLICT.RISK_MEDIUM',
      severity: 'WARNING',
      title: 'Medium conflict risk',
      message: 'Potential parallel edits across worktrees',
      domain: 'WORKTREE',
    });
  }
  return findings;
}

export function buildStaleFindings(
  stale: StaleAnalysis,
  worktrees: StateBuildResult['worktrees']
): ReportFinding[] {
  const findings: ReportFinding[] = [];
  for (const id of stale.staleWorktreeIds) {
    const wt = worktrees.find((w) => w.id === id);
    findings.push({
      id: nextId('GW'),
      code: wt && wt.behind > 0 ? 'WORKTREE.STALE.BEHIND' : 'WORKTREE.STALE.IDLE',
      severity: 'WARNING',
      title: 'Stale worktree',
      message: `Worktree ${id} is stale (idle or behind base)`,
      domain: 'WORKTREE',
      subject: {
        type: 'worktree',
        worktreeId: id,
        path: wt?.path,
        branch: wt?.branch ?? undefined,
        headCommit: wt?.headCommit ?? undefined,
      },
    });
  }
  return findings;
}

export function buildCleanupFindings(candidates: CleanupCandidate[]): ReportFinding[] {
  const findings: ReportFinding[] = [
    {
      id: nextId('GW'),
      code: 'GIT.CLEANUP.REPORT_ONLY',
      severity: 'INFO',
      title: 'Cleanup report-only',
      message: 'No worktree remove/prune commands were executed',
      domain: 'GIT',
    },
  ];
  for (const c of candidates) {
    findings.push({
      id: nextId('GW'),
      code: 'GIT.CLEANUP.CANDIDATE',
      severity: 'INFO',
      title: 'Cleanup candidate',
      message: `${c.worktreeId}: ${c.reason}`,
      domain: 'GIT',
      subject: { type: 'worktree', worktreeId: c.worktreeId, path: c.path },
      recommendation: { action: 'manual', hint: c.suggestedManualCommand },
    });
  }
  return findings;
}

export function buildRecommendFindings(recs: GitRecommendation[]): ReportFinding[] {
  return recs
    .filter((r) => r.code !== 'NO_ACTION')
    .map((r) => ({
      id: nextId('GW'),
      code:
        r.code === 'ARCH_REVIEW_RECOMMENDED'
          ? 'GIT.RECOMMEND.ARCH_REVIEW'
          : r.code === 'NEW_WORKTREE_RECOMMENDED'
            ? 'GIT.RECOMMEND.NEW_WORKTREE'
            : `GIT.RECOMMEND.${r.code}`,
      severity: r.severity === 'WARNING' ? 'WARNING' as const : 'INFO' as const,
      title: r.code,
      message: r.message,
      domain: 'GIT',
    }));
}

export function buildStaleContextFinding(storedHead: string, currentHead: string): ReportFinding {
  return {
    id: nextId('GW'),
    code: 'GIT.CONTEXT.STALE',
    severity: 'WARNING',
    title: 'Git context stale',
    message: `Stored HEAD ${storedHead} differs from current ${currentHead}`,
    domain: 'GIT',
    subject: { type: 'git', storedHead, currentHead },
  };
}
