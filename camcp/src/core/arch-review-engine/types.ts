import type { ContractGateResult } from '../contract-engine/types.js';
import type { ReportFinding } from '../../reports/schema.js';

export const ARCH_REVIEW_INPUT_SCHEMA_VERSION = '1.0.0';
export const ARCH_REVIEW_HEALTH_SCHEMA_VERSION = '1.0.0';

export type ArchReviewFacet =
  | 'summary'
  | 'scope'
  | 'frozen'
  | 'boundaries'
  | 'duplicates'
  | 'impact'
  | 'graph'
  | 'full';

export const ARCH_FACET_ORDER: ArchReviewFacet[] = [
  'summary',
  'scope',
  'frozen',
  'boundaries',
  'duplicates',
  'impact',
  'graph',
];

export const DELEGATED_ARCH_FACETS: ArchReviewFacet[] = [
  'boundaries',
  'frozen',
  'duplicates',
  'impact',
  'graph',
];

export interface ArchReviewScope {
  paths?: string[];
  domain?: string;
  baseRef?: string;
  headRef?: string;
}

export interface ArchReviewInput {
  facet?: ArchReviewFacet;
  scope?: ArchReviewScope;
  gitContext?: {
    ref?: string | null;
    requireFresh?: boolean;
  };
  delegation?: {
    skipIfCached?: boolean;
    maxAgeMs?: number;
  };
  thresholds?: {
    failOnBlocker?: boolean;
    maxFindingsPerFacet?: number;
  };
  operator?: {
    forceRefresh?: boolean;
  };
}

export interface GitContextRef {
  path: string | null;
  headShort: string | null;
  baseRef: string | null;
  headRef: string | null;
  filesChanged: number;
  changedFiles: string[];
  stale: boolean;
}

export interface DelegationRecord {
  facet: ArchReviewFacet;
  delegatedToolId: string;
  reportRef: string | null;
  cached: boolean;
  ok: boolean;
}

export interface ArchReviewEngineContext {
  repoRoot: string;
  gate: ContractGateResult;
  input: ArchReviewInput;
  gitContext: GitContextRef;
  gitCommit: string | null;
  thresholds: { failOnBlocker: boolean; maxFindingsPerFacet: number };
  delegation: { skipIfCached: boolean; maxAgeMs: number };
  delegations: DelegationRecord[];
  skippedFacets: ArchReviewFacet[];
  facetFindings: Partial<Record<ArchReviewFacet, ReportFinding[]>>;
}

export interface ArchReviewHealthDocument {
  schemaVersion: string;
  ssotValid: boolean;
  gitContextFresh: boolean;
  scopeValid: boolean;
  boundariesValid: boolean;
  frozenValid: boolean;
  duplicatesValid: boolean;
  impactValid: boolean;
  graphValid: boolean;
  dependencyGraph: Record<string, { dependsOn: string[]; valid: boolean }>;
  overallStatus: 'PASS' | 'WARNING' | 'FAIL';
}

export interface ArchReviewComposeResult {
  facet: ArchReviewFacet;
  findings: ReportFinding[];
  health: ArchReviewHealthDocument;
  facetResults: Array<{ facet: ArchReviewFacet; findings: ReportFinding[]; skipped: boolean }>;
  delegations: DelegationRecord[];
  skippedFacets: ArchReviewFacet[];
  bundleFacets: Array<{ facet: ArchReviewFacet; findings: ReportFinding[] }>;
  gitContextRef: GitContextRef;
}
