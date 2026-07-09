import { loadGitWorktreeConfig } from './config-loader.js';
import type { CleanupCandidate, GitWorktreeInput, WorktreeEntry } from './types.js';
import { analyzeStaleWorktrees } from './stale.js';

export function buildCleanupReport(
  worktrees: WorktreeEntry[],
  input: GitWorktreeInput,
  now: Date = new Date()
): CleanupCandidate[] {
  const wtCfg = loadGitWorktreeConfig();
  const reportOnly = input.cleanup?.reportOnly ?? wtCfg.cleanup.reportOnly;
  if (!reportOnly) {
    throw new Error('cleanup.reportOnly must remain true (hard constraint)');
  }

  const includeDetached = input.cleanup?.includeDetached ?? wtCfg.cleanup.includeDetached;
  const stale = analyzeStaleWorktrees(worktrees, input, now);
  const candidates: CleanupCandidate[] = [];

  for (const wt of worktrees) {
    if (includeDetached && wt.detached && stale.staleWorktreeIds.includes(wt.id)) {
      candidates.push({
        worktreeId: wt.id,
        path: wt.path,
        reason: 'detached_idle',
        suggestedManualCommand: `git worktree remove ${wt.path}`,
        autoExecution: false,
      });
    }
    if (wt.prunable) {
      candidates.push({
        worktreeId: wt.id,
        path: wt.path,
        reason: 'prunable_worktree',
        suggestedManualCommand: `git worktree remove ${wt.path}`,
        autoExecution: false,
      });
    }
    if (stale.staleWorktreeIds.includes(wt.id) && !wt.isPrimary) {
      candidates.push({
        worktreeId: wt.id,
        path: wt.path,
        reason: `idle_or_behind_stale`,
        suggestedManualCommand: `git worktree remove ${wt.path}`,
        autoExecution: false,
      });
    }
  }

  return candidates;
}
