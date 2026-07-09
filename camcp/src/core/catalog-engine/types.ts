import type { ContractGateResult } from '../contract-engine/types.js';
import type { ReportFinding } from '../../reports/schema.js';

export const CATALOG_AUDIT_INPUT_SCHEMA_VERSION = '1.0.0';
export const CATALOG_STATS_SCHEMA_VERSION = '1.0.0';
export const CATALOG_HEALTH_SCHEMA_VERSION = '1.0.0';

export type CatalogAuditFacet =
  | 'summary'
  | 'duplicates'
  | 'aliases'
  | 'placement'
  | 'taxonomy'
  | 'gaps'
  | 'assets'
  | 'full';

export const CATALOG_FACET_ORDER: CatalogAuditFacet[] = [
  'summary',
  'taxonomy',
  'aliases',
  'duplicates',
  'placement',
  'gaps',
  'assets',
];

export const EXPENSIVE_FACETS: CatalogAuditFacet[] = [
  'duplicates',
  'aliases',
  'placement',
  'gaps',
  'assets',
];

export interface CatalogAuditScope {
  sectorIds?: string[];
  subcategoriaIds?: string[];
  focusGroups?: string[];
}

export interface CatalogAuditThresholds {
  similarityJaccardMin?: number;
  similarityCrossSectorMin?: number;
  maxFindingsPerFacet?: number;
}

export interface CatalogAuditInput {
  facet?: CatalogAuditFacet;
  ssot?: {
    schemaIndexPath?: string;
    aliasesPaths?: string[];
    blocksGlob?: string;
    packsGlob?: string;
    mapaPath?: string;
  };
  scope?: CatalogAuditScope;
  thresholds?: CatalogAuditThresholds;
  gaps?: {
    mode?: string;
    rulesetId?: string;
    includeHistoricalEvidence?: boolean;
  };
  placement?: {
    rulesetId?: string;
  };
  historicalEvidence?: {
    enabled?: boolean;
    refs?: Array<{ id: string; path: string; role?: string; immutable?: boolean }>;
  };
  comparison?: {
    mode?: 'none' | 'baseline-run' | 'historical-json';
    baselineRunId?: string | null;
    baselineReportRef?: string | null;
  };
  operator?: {
    forceFullScan?: boolean;
  };
}

export interface CatalogEntry {
  subcategoriaId: string;
  subcategoria: string;
  sectorId: string;
  categoriaPrincipal?: string;
  formularioId?: string;
  arquetipo?: string;
  tipoPerfil?: string;
  componenteResultados?: string;
  componentePerfil?: string;
}

export interface NormalizedCatalogEntry extends CatalogEntry {
  normLabel: string;
  normId: string;
}

export interface CatalogIndex {
  version: string | null;
  total: number;
  byId: Record<string, CatalogEntry>;
  entries: NormalizedCatalogEntry[];
  sectorCounts: Record<string, number>;
  idsWithSpaces: string[];
}

export interface AssetsCoverageMetrics {
  ratio: number;
  sectorsWithBlocks: number;
  sectorsExpected: number;
  subsWithPack: number;
  subsMissingAssets: number;
  missingAssetFindings: number;
}

export interface CatalogEngineContext {
  repoRoot: string;
  gate: ContractGateResult;
  index: CatalogIndex;
  schemaIndexPath: string;
  scope: Required<CatalogAuditScope>;
  thresholds: Required<CatalogAuditThresholds>;
  skippedFacets: string[];
  previousFullRunRef: string | null;
  gaps?: { rulesetId?: string };
  legacyAliasCount?: number;
  similarPairsCount?: number;
  gapsDeclared?: number;
  assetsCoverage?: AssetsCoverageMetrics;
}

export interface FacetRunResult {
  facet: CatalogAuditFacet;
  findings: ReportFinding[];
  truncated: boolean;
  skipped: boolean;
  skipReason?: string;
}

export interface CatalogStatsDocument {
  schemaVersion: string;
  ssotId: string;
  ssotVersion: string | null;
  ssotContentHash: string | null;
  totalSubcategorias: number;
  totalSectores: number;
  sectorCounts: Record<string, number>;
  idsWithSpaces: number;
  globalIdCollisions: number;
  exactLabelDuplicates: number;
  similarPairsAboveThreshold: number;
  legacyAliasCount: number;
  gapsDeclared: number;
  facet: CatalogAuditFacet;
  generatedAt: string;
  catalogHealth: CatalogHealthDocument;
}

export interface CatalogHealthDocument {
  schemaVersion: string;
  ssotValid: boolean;
  mirrorValid: boolean;
  taxonomyValid: boolean;
  assetsCoverage: {
    ratio: number;
    sectorsWithBlocks: number;
    sectorsExpected: number;
    subsWithPack: number;
    subsMissingAssets: number;
    missingAssetFindings: number;
  };
  overallStatus: 'PASS' | 'WARNING' | 'FAIL';
}

export interface CatalogComposeResult {
  facet: CatalogAuditFacet;
  findings: ReportFinding[];
  stats: CatalogStatsDocument;
  facetResults: FacetRunResult[];
  skippedFacets: string[];
  bundleFacets: Array<{ facet: CatalogAuditFacet; findings: ReportFinding[] }>;
}
