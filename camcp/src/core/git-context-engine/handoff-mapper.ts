import type { GitContextDocument, HandoffGitFields } from './types.js';
import { GIT_CONTEXT_SCHEMA_VERSION } from './types.js';

/** Integration interface for context.handoff (Step 5) — field mapping only. */
export function toHandoffGitFields(
  gitContext: GitContextDocument,
  gitContextJsonPath: string
): HandoffGitFields {
  const active = gitContext.activeWorktree;
  return {
    commit: active.headShort ?? active.headCommit,
    branch: active.branch,
    dirty: active.dirty,
    ahead: active.ahead,
    behind: active.behind,
    worktree: {
      id: active.id,
      path: active.path,
      isPrimary: active.isPrimary,
      linkedBranch: active.branch,
    },
    pr: gitContext.pr,
    evidenceRefs: [{ kind: 'file', path: gitContextJsonPath }],
  };
}

/** Integration interface for arch.review — stale context detection (G13). */
export function isGitContextStale(
  storedHead: string | null | undefined,
  currentHead: string | null | undefined
): boolean {
  if (!storedHead || !currentHead) return false;
  return storedHead !== currentHead;
}

export function validateGitContextShape(doc: GitContextDocument): string[] {
  const missing: string[] = [];
  if (doc.schemaVersion !== GIT_CONTEXT_SCHEMA_VERSION) missing.push('schemaVersion');
  if (!doc.capturedAt) missing.push('capturedAt');
  if (!doc.repoRoot) missing.push('repoRoot');
  if (!doc.activeWorktree) missing.push('activeWorktree');
  if (!Array.isArray(doc.worktrees)) missing.push('worktrees');
  if (!doc.risk) missing.push('risk');
  if (!doc.pr) missing.push('pr');
  return missing;
}
