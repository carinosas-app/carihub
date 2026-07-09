import type { SsotSnapshotEntry } from '../../reports/schema.js';

export const CONTRACT_GATE_SCHEMA_VERSION = '1.0.0' as const;
export const CONTRACT_ENGINE_VERSION = '1.0.0' as const;

export type ContractIssueSeverity = 'error' | 'warning';

export interface ContractIssue {
  code: string;
  severity: ContractIssueSeverity;
  message: string;
  ssotId?: string;
  path?: string;
  field?: string;
}

export interface ContractSnapshotEntry extends SsotSnapshotEntry {
  version?: string | null;
}

export interface ContractGateResult {
  schemaVersion: typeof CONTRACT_GATE_SCHEMA_VERSION;
  engineVersion: typeof CONTRACT_ENGINE_VERSION;
  facadeId: string;
  facet: string | null;
  ssotValid: boolean;
  mirrorValid: boolean;
  snapshots: ContractSnapshotEntry[];
  errors: ContractIssue[];
  warnings: ContractIssue[];
  blockedFacets: string[];
}

export interface SsotMirrorConfig {
  path: string;
  exportPrefix: string;
}

export interface SsotDefinition {
  ssotId: string;
  path: string;
  kind: 'json' | 'file';
  versionField: string | null;
  requiredFields: string[];
  supportedVersions: string[];
  facades: string[];
  plugin?: 'catalog' | 'profile' | 'arch';
  mirror?: SsotMirrorConfig;
}

export interface ContractEngineConfig {
  schemaVersion: string;
  engineVersion: string;
  ssots: SsotDefinition[];
}

export interface DomainValidationContext {
  repoRoot: string;
  facadeId: string;
  ssot: SsotDefinition;
  parsed: unknown;
  snapshot: ContractSnapshotEntry;
}

export interface ContractDomainPlugin {
  pluginId: string;
  validateDomain(ctx: DomainValidationContext): ContractIssue[];
}

export interface RunContractGateInput {
  repoRoot: string;
  facadeId: string;
  facet?: string | null;
  ssotIds?: string[];
  gitCommit?: string | null;
}
