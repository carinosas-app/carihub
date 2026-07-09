import { loadGitWorktreeConfig } from './config-loader.js';
import type {
  ConflictRiskLevel,
  DiffSummary,
  GitRecommendation,
  GitWorktreeInput,
  WorktreeEntry,
} from './types.js';

export interface RecommendInput {
  worktrees: WorktreeEntry[];
  activeDirty: boolean;
  conflictRisk: ConflictRiskLevel;
  diff: DiffSummary | null;
  behind: number;
}

export function buildRecommendations(
  input: RecommendInput,
  wtInput: GitWorktreeInput
): GitRecommendation[] {
  const wtCfg = loadGitWorktreeConfig();
  const recs: GitRecommendation[] = [];
  const archThreshold = wtCfg.diff.archReviewFileThreshold;
  const behindThreshold = wtInput.stale?.maxBehindCommits ?? wtCfg.stale.maxBehindCommits;
  const filesChanged = input.diff?.filesChanged ?? 0;

  if (input.conflictRisk === 'medium' && input.activeDirty) {
    recs.push({
      code: 'NEW_WORKTREE_RECOMMENDED',
      severity: 'INFO',
      message: 'Dirty primary with medium conflict risk — isolate experiments in a separate worktree',
    });
  }

  if (filesChanged > archThreshold) {
    recs.push({
      code: 'ARCH_REVIEW_RECOMMENDED',
      severity: 'INFO',
      message: `Diff touches ${filesChanged} files (>${archThreshold}) — run arch.review:full`,
    });
  }

  if (filesChanged > 0) {
    recs.push({
      code: 'IMPACT_ANALYSIS_RECOMMENDED',
      severity: 'INFO',
      message: 'Non-empty diff — consider intel.impact',
    });
  }

  if (input.behind > behindThreshold) {
    recs.push({
      code: 'SYNC_BASE_RECOMMENDED',
      severity: 'WARNING',
      message: `Branch is ${input.behind} commits behind base — manual fetch/rebase advised (report-only)`,
    });
  }

  if (filesChanged > wtCfg.diff.largeChangeThreshold) {
    recs.push({
      code: 'NEW_SESSION_RECOMMENDED',
      severity: 'INFO',
      message: 'Large diff — consider context.handoff:recommend_chat for continuity',
    });
  }

  if (!recs.length) {
    recs.push({
      code: 'NO_ACTION',
      severity: 'INFO',
      message: 'Clean low-risk context — no action suggested',
    });
  }

  return recs;
}

export function suggestedToolChain(recs: GitRecommendation[]): string[] {
  const chain: string[] = [];
  for (const r of recs) {
    if (r.code === 'IMPACT_ANALYSIS_RECOMMENDED') chain.push('intel.impact');
    if (r.code === 'ARCH_REVIEW_RECOMMENDED') chain.push('arch.review:full');
    if (r.code === 'NEW_SESSION_RECOMMENDED') chain.push('context.handoff:recommend_chat');
  }
  return chain;
}
