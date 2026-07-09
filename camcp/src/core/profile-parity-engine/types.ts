import type { ContractGateResult } from '../contract-engine/types.js';
import type { ReportFinding } from '../../reports/schema.js';

export const PROFILE_AUDIT_INPUT_SCHEMA_VERSION = '1.0.0';
export const PROFILE_HEALTH_SCHEMA_VERSION = '1.0.0';

export type ProfileAuditFacet =
  | 'summary'
  | 'registration'
  | 'parity'
  | 'public_fields'
  | 'private_fields'
  | 'render'
  | 'lifecycle'
  | 'verification'
  | 'full';

export const PROFILE_FACET_ORDER: ProfileAuditFacet[] = [
  'summary',
  'registration',
  'parity',
  'public_fields',
  'private_fields',
  'render',
  'lifecycle',
  'verification',
];

export const DELEGATED_FACETS: ProfileAuditFacet[] = [
  'registration',
  'parity',
  'public_fields',
  'private_fields',
  'render',
];

export interface ProfileAuditScope {
  sectorId?: string;
  subcategoriaIds?: string[];
  packId?: string | null;
  allSubsInSector?: boolean;
}

export interface ProfileAuditInput {
  facet?: ProfileAuditFacet;
  scope?: ProfileAuditScope;
  ssot?: {
    schemaIndexPath?: string;
    supportedVersions?: string[];
  };
  parity?: {
    stages?: string[];
    strictRender?: boolean;
    includePrivacy?: boolean;
  };
  delegation?: {
    mode?: 'auto' | 'manual';
    skipIfCached?: boolean;
    maxAgeMs?: number;
  };
  thresholds?: {
    failOnBlocker?: boolean;
    maxFindingsPerFacet?: number;
  };
  catalogContext?: {
    requireValidCatalogCheck?: boolean;
    catalogHealthRef?: string | null;
  };
  operator?: {
    forceRefresh?: boolean;
  };
}

export interface ResolvedScope {
  sectorId: string | null;
  subcategoriaIds: string[];
  subsInScope: number;
  scopeValid: boolean;
  scopeMissing: boolean;
}

export interface DelegationRecord {
  facet: ProfileAuditFacet;
  delegatedToolId: string;
  reportRef: string | null;
  qaReportDir: string | null;
  cached: boolean;
  ok: boolean;
}

export interface ProfileEngineContext {
  repoRoot: string;
  gate: ContractGateResult;
  input: ProfileAuditInput;
  scope: ResolvedScope;
  gitCommit: string | null;
  thresholds: { failOnBlocker: boolean; maxFindingsPerFacet: number };
  delegation: { skipIfCached: boolean; maxAgeMs: number };
  delegations: DelegationRecord[];
  skippedFacets: ProfileAuditFacet[];
  facetFindings: Partial<Record<ProfileAuditFacet, ReportFinding[]>>;
}

export interface ProfileHealthDocument {
  schemaVersion: string;
  ssotValid: boolean;
  scopeValid: boolean;
  registrationValid: boolean;
  parityValid: boolean;
  privacyValid: boolean;
  renderValid: boolean;
  lifecycleValid: boolean;
  verificationValid: boolean;
  coverage: {
    subsInScope: number;
    subsPassParity: number;
    subsFailParity: number;
    subsSkipped: number;
    passRate: number;
  };
  dependencyGraph: Record<string, { dependsOn: string[]; valid: boolean }>;
  overallStatus: 'PASS' | 'WARNING' | 'FAIL';
}

export interface ProfileComposeResult {
  facet: ProfileAuditFacet;
  findings: ReportFinding[];
  health: ProfileHealthDocument;
  facetResults: Array<{ facet: ProfileAuditFacet; findings: ReportFinding[]; skipped: boolean }>;
  delegations: DelegationRecord[];
  skippedFacets: ProfileAuditFacet[];
  bundleFacets: Array<{ facet: ProfileAuditFacet; findings: ReportFinding[] }>;
}
