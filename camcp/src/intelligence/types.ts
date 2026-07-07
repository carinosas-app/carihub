export type ReportSeverity = 'BLOQUEADOR' | 'IMPORTANTE' | 'WARNING' | 'INFO' | 'PASS';

export interface DomainInfo {
  id: string;
  label: string;
  maturity: string;
  anchorPaths: string[];
  knowledgeDocs: string[];
}

export interface GraphNode {
  id: string;
  type: 'domain' | 'file' | 'qa_script' | 'doc';
  label: string;
  meta?: Record<string, unknown>;
}

export interface GraphEdge {
  from: string;
  to: string;
  relation: 'anchors' | 'documents' | 'qa_pack' | 'depends';
}

export interface IntelligenceGraph {
  gitCommit: string | null;
  generatedAt: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: { nodes: number; edges: number; domains: number };
}

export interface IntelModuleDefinition {
  id: string;
  label: string;
  qaTool: string;
  requiresPackId?: boolean;
}

export interface IntelligenceConfig {
  version: string;
  cacheTtlMs: number;
  graphCacheSubdir: string;
  modules: IntelModuleDefinition[];
  domainAnchors: Record<string, string[]>;
  impactQaHints: Record<string, string[]>;
}

export interface ImpactFinding {
  id: string;
  severity: ReportSeverity;
  domain: string;
  path: string;
  message: string;
  recommendedModules: string[];
}

export interface ImpactAnalysis {
  range: string;
  changedFiles: string[];
  affectedDomains: string[];
  findings: ImpactFinding[];
  recommendedModules: string[];
}

export interface CacheEntryMeta {
  key: string;
  path: string;
  createdAt: string;
  expiresAt: string;
  gitCommit: string | null;
  sizeBytes: number;
}
