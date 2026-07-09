import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface GitWorktreeConfig {
  version: string;
  schemaVersion: string;
  ghEnabled: boolean;
  defaults: {
    baseRef: string;
    remoteRef: string;
    headRef: string;
    includeUntracked: boolean;
    diffStatOnly: boolean;
    maxChangedFiles: number;
  };
  stale: {
    maxBehindCommits: number;
    maxIdleDays: number;
  };
  diff: {
    largeChangeThreshold: number;
    archReviewFileThreshold: number;
  };
  conflicts: {
    compareWorktrees: boolean;
    compareBranches: boolean;
    behindDirtyThreshold: number;
  };
  cleanup: {
    reportOnly: boolean;
    includeDetached: boolean;
    includeMergedBranches: boolean;
  };
  pr: {
    enabled: boolean;
    inferFromBranch: boolean;
  };
}

let cached: GitWorktreeConfig | null = null;

function configPath(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '../../../config/git-worktree.config.json');
}

export function loadGitWorktreeConfig(): GitWorktreeConfig {
  if (cached) return cached;
  const raw = fs.readFileSync(configPath(), 'utf8');
  cached = JSON.parse(raw) as GitWorktreeConfig;
  return cached;
}
