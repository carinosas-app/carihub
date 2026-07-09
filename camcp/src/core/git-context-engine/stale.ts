import { loadGitWorktreeConfig } from './config-loader.js';
import type { GitWorktreeInput, WorktreeEntry } from './types.js';

export interface StaleAnalysis {
  staleWorktreeIds: string[];
}

export function analyzeStaleWorktrees(
  worktrees: WorktreeEntry[],
  input: GitWorktreeInput,
  now: Date = new Date()
): StaleAnalysis {
  const wtCfg = loadGitWorktreeConfig();
  const maxBehind = input.stale?.maxBehindCommits ?? wtCfg.stale.maxBehindCommits;
  const maxIdleDays = input.stale?.maxIdleDays ?? wtCfg.stale.maxIdleDays;
  const maxIdleMs = maxIdleDays * 24 * 60 * 60 * 1000;

  const staleWorktreeIds: string[] = [];

  for (const wt of worktrees) {
    if (wt.behind > maxBehind) {
      staleWorktreeIds.push(wt.id);
      continue;
    }
    if (wt.lastCommitDate) {
      const age = now.getTime() - new Date(wt.lastCommitDate).getTime();
      if (age > maxIdleMs) staleWorktreeIds.push(wt.id);
    }
    if (wt.detached && wt.lastCommitDate) {
      const age = now.getTime() - new Date(wt.lastCommitDate).getTime();
      if (age > 24 * 60 * 60 * 1000) staleWorktreeIds.push(wt.id);
    }
  }

  return { staleWorktreeIds: [...new Set(staleWorktreeIds)] };
}

/** Pure helper for smoke G7 with mocked dates. */
export function isWorktreeIdle(
  lastCommitDate: string | null | undefined,
  maxIdleDays: number,
  now: Date
): boolean {
  if (!lastCommitDate) return false;
  const maxIdleMs = maxIdleDays * 24 * 60 * 60 * 1000;
  return now.getTime() - new Date(lastCommitDate).getTime() > maxIdleMs;
}
