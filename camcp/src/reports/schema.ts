import type { ReportSeverity } from '../intelligence/types.js';
import { REPORT_SCHEMA_VERSION } from './constants.js';

export type ReportStatus = 'PASS' | 'WARNING' | 'FAIL';
export type FindingConfidence = 'high' | 'medium' | 'hypothesis';

export type EvidenceKind = 'file' | 'url' | 'report' | 'ssot' | 'stdout' | 'handoff';

export interface EvidenceRef {
  kind: EvidenceKind;
  path: string;
  label?: string;
  contentHash?: string;
  generatedAt?: string;
  schemaVersion?: string;
}

export interface FindingSubject {
  type?: string;
  sectorId?: string;
  subcategoriaId?: string;
  fieldId?: string;
  stage?: string;
  path?: string;
  [key: string]: unknown;
}

export interface FindingImpact {
  surfaces?: string[];
  blocksMerge?: boolean;
  breaksContract?: boolean;
}

export interface FindingRecommendation {
  action: string;
  hint?: string;
  owner?: string;
}

export interface FindingProvenance {
  toolId: string;
  facet?: string | null;
  engineId?: string;
  sourceFindingId?: string;
  delegatedToolId?: string;
}

export interface SsotRef {
  ssotId: string;
  path: string;
  version?: string | null;
  anchor?: string;
  contentHash?: string;
}

/** Input finding — v1 fields + optional v2 extensions. */
export interface ReportFinding {
  id: string;
  severity: ReportSeverity;
  message: string;
  impact?: string | FindingImpact;
  recommendation?: string | FindingRecommendation;
  /** @deprecated v1 string evidence — normalized to evidence[] on write */
  evidence?: string;
  code?: string;
  confidence?: FindingConfidence;
  title?: string;
  domain?: string;
  category?: string;
  subject?: FindingSubject;
  ssotRef?: SsotRef;
  evidenceRefs?: EvidenceRef[];
  provenance?: FindingProvenance;
  relatedFindings?: string[];
  supersedes?: string | null;
  tags?: string[];
}

/** Canonical normalized finding written to report.json / findings.json. */
export interface ReportFindingNormalized {
  id: string;
  code: string;
  severity: ReportSeverity;
  confidence: FindingConfidence;
  title: string;
  message: string;
  domain: string;
  category: string;
  subject?: FindingSubject;
  impact?: FindingImpact;
  recommendation?: FindingRecommendation;
  ssotRef?: SsotRef;
  evidence: EvidenceRef[];
  provenance: FindingProvenance;
  relatedFindings?: string[];
  supersedes?: string | null;
  tags?: string[];
}

export interface FindingCounts {
  total: number;
  bloqueador: number;
  importante: number;
  warning: number;
  info: number;
  pass: number;
}

export interface ReportToolMeta {
  id: string;
  namespace: string;
  facet: string | null;
  capability: 'read-only' | 'report-only';
}

export interface SsotSnapshotEntry {
  ssotId: string;
  path: string;
  versionField?: string | null;
  contentHash?: string;
  byteSize?: number;
}

export interface SsotSnapshotDocument {
  schemaVersion: typeof REPORT_SCHEMA_VERSION;
  capturedAt: string;
  gitCommit: string | null;
  snapshots: SsotSnapshotEntry[];
  policy: 'reference-only';
}

export interface ReportGitContext {
  commit: string | null;
  branch: string | null;
  worktreeId: string | null;
}

export interface ReportProvenance {
  engines: Array<{ id: string; version?: string }>;
  delegatedTools?: string[];
}

export interface SuggestedNext {
  tools?: string[];
  qaModules?: string[];
}

export interface WriteReportOptions {
  facet?: string | null;
  capability?: 'read-only' | 'report-only';
  domains?: string[];
  ssot?: SsotSnapshotDocument;
  provenance?: ReportProvenance;
  suggestedNext?: SuggestedNext;
  git?: Partial<ReportGitContext>;
  delegatedRuns?: Array<{ toolId: string; reportDir: string }>;
}

/** Legacy + v2 report shape used by aggregators. */
export interface CamcpReport {
  schemaVersion?: typeof REPORT_SCHEMA_VERSION | '1.0.0';
  module: string;
  status: ReportStatus;
  maxSeverity: ReportSeverity;
  runId: string;
  gitCommit: string | null;
  generatedAt: string;
  durationMs: number;
  summary: string;
  findings: ReportFinding[];
  evidencePaths: string[];
  suggestedQa?: string[];
  /** v2 fields optional on input */
  tool?: ReportToolMeta;
  counts?: FindingCounts;
  domains?: string[];
  ssot?: { snapshots: SsotSnapshotEntry[]; reusePolicy: 'reference-only' };
  provenance?: ReportProvenance;
  suggestedNext?: SuggestedNext;
  git?: ReportGitContext;
  reportId?: string;
}

/** Canonical report.json @ camcp-report@2.0.0 */
export interface CamcpReportDocument {
  $schema?: string;
  schemaVersion: typeof REPORT_SCHEMA_VERSION;
  reportId: string;
  tool: ReportToolMeta;
  status: ReportStatus;
  maxSeverity: ReportSeverity;
  counts: FindingCounts;
  summary: string;
  findings: ReportFindingNormalized[];
  domains: string[];
  ssot: {
    snapshots: SsotSnapshotEntry[];
    reusePolicy: 'reference-only';
  };
  provenance: ReportProvenance;
  evidence: EvidenceRef[];
  suggestedNext: SuggestedNext;
  git: ReportGitContext;
  timing: {
    generatedAt: string;
    durationMs: number;
    runId: string;
  };
}

/** Standardized CAMCP execution fields (consolidation kernel). */
export interface ReportExecutionCore {
  camcpVersion: string;
  commit: string | null;
  tool: string;
  namespace: string;
  capability: 'read-only' | 'report-only';
  durationMs: number;
  timestamp: string;
  exitCode: number;
}

export interface ReportManifestDocument {
  schemaVersion: typeof REPORT_SCHEMA_VERSION;
  runId: string;
  toolId: string;
  facet: string | null;
  capability: 'read-only' | 'report-only';
  status: ReportStatus;
  maxSeverity: ReportSeverity;
  generatedAt: string;
  durationMs: number;
  git: ReportGitContext;
  engines: string[];
  ssotVersions: Record<string, string>;
  artifacts: {
    reportJson: string;
    findingsJson: string;
    summaryJson: string;
    reportMd: string;
    ssotSnapshot: string;
  };
  delegatedRuns: Array<{ toolId: string; reportDir: string }>;
  /** Standardized execution manifest (additive; camcp-execution-manifest@1.0.0). */
  execution?: ReportExecutionCore;
}

export interface ReportSummaryDocument {
  schemaVersion: typeof REPORT_SCHEMA_VERSION;
  module: string;
  toolId: string;
  facet: string | null;
  status: ReportStatus;
  maxSeverity: ReportSeverity;
  runId: string;
  findingCount: number;
  counts: FindingCounts;
  gitCommit: string | null;
  generatedAt: string;
}

export interface ReportBundleDocument {
  $schema?: string;
  schemaVersion: typeof REPORT_SCHEMA_VERSION;
  bundleId: string;
  toolId: string;
  facets: string[];
  status: ReportStatus;
  maxSeverity: ReportSeverity;
  ssotVersions: Record<string, string>;
  ssotHashes: Record<string, string>;
  reports: Array<{ facet: string; reportPath: string }>;
  aggregatedFindings: ReportFindingNormalized[];
  skippedFacets: string[];
  summary: string;
}

export interface ReportIndexEntry {
  runId: string;
  toolId: string;
  facet: string | null;
  status: ReportStatus;
  maxSeverity: ReportSeverity;
  gitCommit: string | null;
  ssotHash: Record<string, string>;
  manifestPath: string;
  generatedAt: string;
}

export interface ReportIndexDocument {
  schemaVersion: typeof REPORT_SCHEMA_VERSION;
  updatedAt: string;
  maxEntries: number;
  entries: ReportIndexEntry[];
}

export function maxSeverity(findings: Array<{ severity: ReportSeverity }>): ReportSeverity {
  const order: ReportSeverity[] = ['BLOQUEADOR', 'IMPORTANTE', 'WARNING', 'INFO', 'PASS'];
  for (const s of order) {
    if (findings.some((f) => f.severity === s)) return s;
  }
  return 'PASS';
}

export function statusFromSeverity(severity: ReportSeverity): ReportStatus {
  if (severity === 'BLOQUEADOR' || severity === 'IMPORTANTE') return 'FAIL';
  if (severity === 'WARNING') return 'WARNING';
  return 'PASS';
}

export function isReportV2(data: unknown): data is CamcpReportDocument {
  return (
    !!data &&
    typeof data === 'object' &&
    (data as CamcpReportDocument).schemaVersion === REPORT_SCHEMA_VERSION
  );
}

export function isReportManifestV2(data: unknown): data is ReportManifestDocument {
  return (
    !!data &&
    typeof data === 'object' &&
    (data as ReportManifestDocument).schemaVersion === REPORT_SCHEMA_VERSION &&
    typeof (data as ReportManifestDocument).toolId === 'string'
  );
}

export function parseToolNamespace(toolId: string): string {
  const dot = toolId.indexOf('.');
  return dot >= 0 ? toolId.slice(0, dot) : toolId;
}
