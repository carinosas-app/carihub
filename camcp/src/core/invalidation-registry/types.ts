export const INVALIDATION_REGISTRY_SCHEMA_VERSION = '1.0.0' as const;

/** Canonical invalidation reasons (Governance Addendum M10). */
export type InvalidatedReason =
  | 'ssot_hash_mismatch'
  | 'ssot_version_bump'
  | 'git_head_changed'
  | 'git_branch_changed'
  | 'file_hash_changed'
  | 'qa_script_version_bump'
  | 'expired'
  | 'operator_refresh'
  | 'schema_upgraded'
  | 'registry_rules_bump';

export type WatchKind = 'ssot' | 'file' | 'config' | 'git' | 'glob';

export interface WatchRegistration {
  watchId: string;
  kind: WatchKind;
  ssotId?: string;
  path?: string;
  pathGlob?: string;
  hash?: boolean;
  versionField?: string;
  source?: 'git.head' | 'git.branch';
  invalidates: string[];
  completedCheckPattern: string;
}

export interface FacadeRegistration {
  facadeId: string;
  registrations: WatchRegistration[];
}

export interface InvalidationRegistryConfig {
  schemaVersion: string;
  registryVersion: string;
  facades: FacadeRegistration[];
}

export interface FacadeManifest {
  facadeId: string;
  registrations: WatchRegistration[];
}

export interface RegisterAck {
  ack: true;
  facadeId: string;
  watchCount: number;
}

export interface CompletedCheck {
  id: string;
  toolId: string;
  facet?: string | null;
  runId?: string;
  status?: string;
  ssotHash?: Record<string, string>;
  ssotVersions?: Record<string, string>;
  fileHash?: Record<string, string>;
  configVersions?: Record<string, string>;
  gitCommit?: string | null;
  gitBranch?: string | null;
  completedAt?: string;
  maxAgeMs?: number;
  schemaVersion?: string;
  registryVersion?: string;
  forceRefresh?: boolean;
}

export interface GitContext {
  commit: string | null;
  branch: string | null;
}

export interface SnapshotRef {
  ssotId: string;
  contentHash?: string;
  version?: string | null;
  path?: string;
}

export interface EvaluateInput {
  repoRoot: string;
  currentSnapshots: SnapshotRef[];
  gitContext: GitContext;
  completedChecks: CompletedCheck[];
  now?: Date;
  forceRefresh?: boolean;
}

export interface CheckEvaluation {
  id: string;
  valid: boolean;
  reason: InvalidatedReason | null;
  watchId?: string;
  message?: string;
}

export interface EvaluateResult {
  schemaVersion: typeof INVALIDATION_REGISTRY_SCHEMA_VERSION;
  registryVersion: string;
  checks: CheckEvaluation[];
}

export interface WatchedResource {
  watchId: string;
  facadeId: string;
  kind: WatchKind;
  resourceKey: string;
  invalidates: string[];
  completedCheckPattern: string;
}

export interface ExplainStep {
  watchId: string;
  facadeId: string;
  kind: WatchKind;
  resourceKey: string;
  invalidates: string[];
  completedCheckPattern: string;
}

export interface ExplainResult {
  checkId: string;
  matchedWatches: ExplainStep[];
  dependencyChain: string[];
}
