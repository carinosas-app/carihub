import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface CatalogConfig {
  version: string;
  schemaVersion: string;
  rulesetIds: { gaps: string; placement: string; aliases?: string };
  aliasRuleset?: {
    rulesetId: string;
    version: string;
    intentionalRedirectBundles: Array<{
      bundleId: string;
      aliasDocumentPath: string;
      actaPath: string;
      runtimeLegacyMapPaths: string[];
    }>;
  };
  ssot: {
    schemaIndexPath: string;
    schemaIndexMirrorPath: string;
    aliasesPaths: string[];
    blocksGlob: string;
    packsGlob: string;
    mapaPath: string;
  };
  defaults: {
    similarityJaccardMin: number;
    similarityCrossSectorMin: number;
    maxFindingsPerFacet: number;
    forceFullScan: boolean;
    historicalEvidenceEnabled: boolean;
    comparisonMode: string;
  };
  focusGroups: Record<string, { sectorIds: string[]; keywords: string[] }>;
  knownSectors: string[];
  sectorAssetMap: Record<
    string,
    {
      blocksPatterns: string[];
      renderPath: string | null;
      packPatterns: string[];
    }
  >;
  gapsRuleset: {
    rulesetId: string;
    version: string;
    rules: Array<{
      gapRuleId: string;
      expectedSub: string;
      expectedSector: string;
      historicalStatus: string;
      fusedInto?: string;
    }>;
  };
  placementRuleset: {
    rulesetId: string;
    version: string;
    rules: Array<Record<string, unknown>>;
  };
  historicalEvidence: {
    refs: Array<{ id: string; path: string; role?: string; immutable?: boolean }>;
    goldenStats: { totalSubcategorias: number; totalSectores: number };
  };
  allowedReadGlobs: string[];
}

let cached: CatalogConfig | null = null;

function configPath(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '../../../config/catalog.config.json');
}

export function loadCatalogConfig(): CatalogConfig {
  if (cached) return cached;
  cached = JSON.parse(fs.readFileSync(configPath(), 'utf8')) as CatalogConfig;
  return cached;
}

export function resetCatalogConfigCache(): void {
  cached = null;
}
