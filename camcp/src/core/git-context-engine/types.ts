export const GIT_CONTEXT_SCHEMA_VERSION = '1.0.0' as const;
export const GIT_CONTEXT_HEALTH_SCHEMA_VERSION = '1.0.0' as const;
export const GIT_WORKTREE_INPUT_SCHEMA_VERSION = '1.0.0' as const;

export type GitWorktreeFacet =
  | 'state'
  | 'diff'
  | 'pr_status'
  | 'conflicts'
  | 'stale'
  | 'cleanup_report'
  | 'recommend'
  | 'full';

export type ConflictRiskLevel = 'low' | 'medium' | 'high';

export interface GitWorktreeInput {
  facet?: GitWorktreeFacet;
  repoRoot?: string;
  worktreePath?: string | null;
  git?: {
    baseRef?: string;
    remoteRef?: string;
    headRef?: string;
    includeUntracked?: boolean;
    diffStatOnly?: boolean;
    maxChangedFiles?: number;
  };
  pr?: {
    enabled?: boolean;
    prNumber?: number | null;
    inferFromBranch?: boolean;
  };
  stale?: {
    maxBehindCommits?: number;
    maxIdleDays?: number;
  };
  conflicts?: {
    compareWorktrees?: boolean;
    compareBranches?: boolean;
  };
  cleanup?: {
    reportOnly?: boolean;
    includeDetached?: boolean;
    includeMergedBranches?: boolean;
  };
  crossAudit?: {
    archReviewRef?: string | null;
    handoffRef?: string | null;
  };
}

export interface WorktreeEntry {
  id: string;
  path: string;
  isPrimary: boolean;
  branch: string | null;
  headCommit: string | null;
  headShort: string | null;
  dirty: boolean;
  untrackedCount: number;
  modifiedCount: number;
  ahead: number;
  behind: number;
  locked: boolean;
  prunable: boolean;
  detached: boolean;
  lastCommitDate?: string | null;
}

export interface ActiveWorktree extends WorktreeEntry {
  baseRef: string;
  mergeBase: string | null;
}

export interface DiffSummary {
  baseRef: string;
  headRef: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
  changedFiles: string[];
}

export interface PrChecksSummary {
  total: number;
  pass: number;
  fail: number;
  pending: number;
}

export interface PrContext {
  number: number | null;
  url: string | null;
  state: string | null;
  title: string | null;
  checks: PrChecksSummary;
}

export interface GitRecommendation {
  code: string;
  severity: 'INFO' | 'WARNING' | 'IMPORTANTE';
  message: string;
}

export interface GitContextRisk {
  conflictRisk: ConflictRiskLevel;
  staleWorktrees: string[];
  duplicateBranchWorktrees: string[];
}

export interface GitContextDocument {
  $schema: string;
  schemaVersion: typeof GIT_CONTEXT_SCHEMA_VERSION;
  capturedAt: string;
  repoRoot: string;
  activeWorktree: ActiveWorktree;
  worktrees: WorktreeEntry[];
  diffSummary: DiffSummary | null;
  pr: PrContext;
  risk: GitContextRisk;
  recommendations: GitRecommendation[];
  cleanupCandidates?: CleanupCandidate[];
}

export interface CleanupCandidate {
  worktreeId: string;
  path: string;
  reason: string;
  suggestedManualCommand: string;
  autoExecution: false;
}

export type GitContextHealthStatus = 'PASS' | 'WARNING' | 'FAIL';

export interface GitContextHealthDocument {
  $schema: string;
  schemaVersion: typeof GIT_CONTEXT_HEALTH_SCHEMA_VERSION;
  repoReadable: boolean;
  worktreesEnumerated: boolean;
  branchTrackingValid: boolean;
  dirtyStateKnown: boolean;
  diffComputed: boolean;
  prStatusKnown: boolean;
  conflictRiskLevel: ConflictRiskLevel;
  staleWorktreeCount: number;
  overallStatus: GitContextHealthStatus;
}

export interface HandoffGitFields {
  commit: string | null;
  branch: string | null;
  dirty: boolean;
  ahead: number;
  behind: number;
  worktree: {
    id: string;
    path: string;
    isPrimary: boolean;
    linkedBranch: string | null;
  };
  pr: PrContext;
  evidenceRefs: Array<{ kind: 'file'; path: string }>;
}
