import type { ReportSeverity } from '../../intelligence/types.js';
import type { ReportStatus } from '../../reports/schema.js';
import type { EvidenceRef } from '../../reports/schema.js';
import type { InvalidatedReason } from '../invalidation-registry/types.js';

export const HANDOFF_BRIEF_SCHEMA_VERSION = '1.0.0' as const;
export const HANDOFF_INPUT_SCHEMA_VERSION = '1.0.0' as const;
export const HANDOFF_ENGINE_VERSION = '1.0.0' as const;

export type HandoffFacet =
  | 'summarize'
  | 'handoff'
  | 'overflow'
  | 'recommend_chat'
  | 'continuation_brief';

export type OverflowRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'review' | 'done';

export interface HandoffInput {
  facet?: HandoffFacet;
  session?: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    startedAt?: string;
    objective?: string;
    outOfScope?: string[];
  };
  scope?: {
    paths?: string[];
    sectors?: string[];
    subcategoriaIds?: string[];
  };
  git?: {
    baseRef?: string;
    includeDiffStat?: boolean;
    worktreePath?: string | null;
    gitContextPath?: string | null;
  };
  reports?: {
    mode?: 'auto' | 'explicit' | 'latest';
    toolIds?: string[];
    runIds?: string[];
    maxAgeMs?: number;
    includeV1Reports?: boolean;
  };
  findings?: {
    minSeverity?: ReportSeverity;
    includeWarnings?: boolean;
    includeHypothesis?: boolean;
    maxOpenFindings?: number;
  };
  forbiddenActions?: string[];
  operator?: {
    requestedBy?: string;
    forceRefresh?: boolean;
  };
  contextBudget?: {
    maxEstimatedTokens?: number;
    warnThreshold?: number;
    criticalThreshold?: number;
  };
  historicalEvidence?: Record<string, string>;
  supersedes?: {
    briefId?: string;
    path?: string;
  };
}

export interface HandoffBriefGit {
  commit: string;
  branch: string;
  baseRef: string;
  ahead: number;
  behind: number;
  dirty: boolean;
  changedFilesCount: number;
  worktree: {
    id: string;
    path: string;
    isPrimary: boolean;
    linkedBranch: string | null;
  } | null;
  pr: {
    number: number | null;
    url: string | null;
    state: string | null;
    checksSummary: {
      total: number;
      pass: number;
      fail: number;
      pending: number;
    } | null;
  };
}

export interface HandoffCompletedCheck {
  toolId: string;
  facet: string | null;
  runId: string;
  status: ReportStatus;
  maxSeverity: ReportSeverity;
  reportRef: string;
  ssotHash: Record<string, string>;
  valid: boolean;
  invalidatedReason: InvalidatedReason | 'report_missing' | null;
  completedAt: string;
  schemaV1?: boolean;
}

export interface HandoffOpenFinding {
  findingId: string;
  code: string;
  severity: ReportSeverity;
  confidence: 'high' | 'medium' | 'hypothesis';
  title: string;
  domain: string;
  subject?: Record<string, unknown>;
  reportRef: string;
  runId: string;
  toolId: string;
  facet: string | null;
}

export interface HandoffEvidenceRef extends EvidenceRef {
  toolId?: string;
  runId?: string;
}

export interface HandoffBriefDocument {
  $schema: string;
  schemaVersion: typeof HANDOFF_BRIEF_SCHEMA_VERSION;
  briefId: string;
  facet: HandoffFacet;
  generatedAt: string;
  generator: {
    toolId: string;
    engineId: string;
    engineVersion: string;
    reportsEngineVersion: string;
  };
  task: {
    title: string;
    description?: string;
    status: TaskStatus;
    objective?: string;
    outOfScope?: string[];
  };
  git: HandoffBriefGit;
  ssotVersions: Record<string, string>;
  ssotHashes: Record<string, string>;
  completedChecks: HandoffCompletedCheck[];
  openFindings: HandoffOpenFinding[];
  evidenceRefs: HandoffEvidenceRef[];
  forbiddenActions: string[];
  suggestedToolChain: string[];
  scope: {
    paths: string[];
    sectors: string[];
    subcategoriaIds: string[];
  };
  contextMetrics: {
    estimatedTokens: number;
    budgetMaxTokens: number;
    utilizationRatio: number;
    overflowRisk: OverflowRiskLevel;
    recommendNewChat: boolean;
    components: {
      openFindings: number;
      evidenceRefs: number;
      gitContext: number;
      completedChecks: number;
      taskNarrative: number;
      reservedHeadroom: number;
    };
  };
  supersedes?: {
    briefId: string;
    path: string;
  };
  historicalEvidence?: Record<string, string>;
}

export interface ContextOverflowAssessment {
  overflowRisk: OverflowRiskLevel;
  estimatedTokens: number;
  budgetMaxTokens: number;
  utilizationRatio: number;
  recommendNewChat: boolean;
  recommendContinuationBrief: boolean;
  recommendations: string[];
}

export interface SummarizeOutput {
  taskStatus: TaskStatus;
  git: { branch: string; commit: string; dirty: boolean };
  openFindingsCount: number;
  completedChecksValid: number;
  completedChecksStale: number;
  overflowRisk: OverflowRiskLevel;
  latestReports: Array<{ toolId: string; runId: string; status: ReportStatus }>;
}

export interface RecommendChatOutput {
  recommendNewChat: boolean;
  reason: string;
  suggestedFacet: HandoffFacet;
  overflowRisk: OverflowRiskLevel;
}
