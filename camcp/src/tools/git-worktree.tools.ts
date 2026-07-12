import type { CamcpConfig } from '../policy/permissions.js';
import { runGitWorktree } from '../git-worktree/runner.js';
import type { GitWorktreeFacet, GitWorktreeInput } from '../core/git-context-engine/types.js';

export function gitWorktree(
  repoRoot: string,
  config: CamcpConfig,
  input: GitWorktreeInput = {}
) {
  return runGitWorktree(repoRoot, config, input);
}

export type { GitWorktreeFacet, GitWorktreeInput };
