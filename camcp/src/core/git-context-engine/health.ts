import type { ConflictRiskLevel, GitContextHealthDocument, GitContextHealthStatus } from './types.js';
import { GIT_CONTEXT_HEALTH_SCHEMA_VERSION } from './types.js';
import type { StateBuildResult } from './state.js';

export interface HealthInput {
  state: StateBuildResult;
  diffComputed: boolean;
  prStatusKnown: boolean;
  conflictRiskLevel: ConflictRiskLevel;
  staleWorktreeCount: number;
}

export function buildGitContextHealth(input: HealthInput): GitContextHealthDocument {
  const {
    state,
    diffComputed,
    prStatusKnown,
    conflictRiskLevel,
    staleWorktreeCount,
  } = input;

  let overallStatus: GitContextHealthStatus = 'PASS';

  if (!state.repoReadable) {
    overallStatus = 'FAIL';
  } else if (
    conflictRiskLevel === 'high' ||
    staleWorktreeCount > 0 ||
    (state.activeWorktree.dirty && conflictRiskLevel === 'medium') ||
    state.activeWorktree.behind > 50
  ) {
    overallStatus = 'WARNING';
  }

  return {
    $schema: 'https://carihub.local/camcp/schemas/git-context-health@1.0.0.json',
    schemaVersion: GIT_CONTEXT_HEALTH_SCHEMA_VERSION,
    repoReadable: state.repoReadable,
    worktreesEnumerated: state.worktreesEnumerated,
    branchTrackingValid: state.branchTrackingValid,
    dirtyStateKnown: state.dirtyStateKnown,
    diffComputed,
    prStatusKnown,
    conflictRiskLevel,
    staleWorktreeCount,
    overallStatus,
  };
}
