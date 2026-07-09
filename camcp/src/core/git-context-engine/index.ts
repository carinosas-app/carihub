export {
  composeGitContext,
  capabilityForFacet,
  facetsForInput,
  type ComposeResult,
} from './composer.js';
export { loadGitWorktreeConfig, type GitWorktreeConfig } from './config-loader.js';
export {
  analyzeConflicts,
  assessConflictRiskFromWorktrees,
  duplicateBranchWorktreeIds,
  type ConflictAnalysis,
} from './conflicts.js';
export { buildCleanupReport } from './cleanup-report.js';
export {
  buildCleanupFindings,
  buildConflictFindings,
  buildDiffFindings,
  buildPrFindings,
  buildRecommendFindings,
  buildStaleContextFinding,
  buildStaleFindings,
  buildStateFindings,
  resetFindingSeq,
} from './findings.js';
export { fetchPrContext, isGhAvailable, runGhAllowed, assertGhCommandAllowed } from './gh-readonly.js';
export { buildGitContextHealth, type HealthInput } from './health.js';
export {
  isGitContextStale,
  toHandoffGitFields,
  validateGitContextShape,
} from './handoff-mapper.js';
export { buildRecommendations, suggestedToolChain, type RecommendInput } from './recommend.js';
export { analyzeStaleWorktrees, isWorktreeIdle } from './stale.js';
export { buildDiffSummary, buildGitState, type StateBuildResult } from './state.js';
export {
  GIT_CONTEXT_HEALTH_SCHEMA_VERSION,
  GIT_CONTEXT_SCHEMA_VERSION,
  GIT_WORKTREE_INPUT_SCHEMA_VERSION,
  type ActiveWorktree,
  type CleanupCandidate,
  type ConflictRiskLevel,
  type DiffSummary,
  type GitContextDocument,
  type GitContextHealthDocument,
  type GitRecommendation,
  type GitWorktreeFacet,
  type GitWorktreeInput,
  type HandoffGitFields,
  type PrContext,
  type WorktreeEntry,
} from './types.js';
export {
  normalizePath,
  parseWorktreePorcelain,
  worktreeIdFromPath,
  type ParsedWorktree,
} from './worktree-list.js';
