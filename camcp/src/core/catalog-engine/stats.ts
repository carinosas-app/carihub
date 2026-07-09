import { maxSeverityFromFindings } from '../../reports/counts.js';
import type { ReportFinding } from '../../reports/schema.js';
import type { ContractGateResult } from '../contract-engine/types.js';
import { loadCatalogConfig } from './config-loader.js';
import { countGapsDeclared } from './facets/gaps.js';
import { countLegacyAliases } from './facets/aliases.js';
import { countSimilarPairs } from './facets/duplicates.js';
import { taxonomyValid } from './facets/summary.js';
import type {
  CatalogAuditFacet,
  CatalogEngineContext,
  CatalogHealthDocument,
  CatalogStatsDocument,
} from './types.js';

function overallStatus(
  ssotValid: boolean,
  mirrorValid: boolean,
  findings: ReportFinding[]
): 'PASS' | 'WARNING' | 'FAIL' {
  if (!ssotValid) return 'FAIL';
  const max = maxSeverityFromFindings(
    findings.map((f) => ({
      id: f.id,
      severity: f.severity,
      code: f.code ?? 'UNKNOWN',
      confidence: f.confidence ?? 'high',
      title: f.title ?? f.message,
      message: f.message,
      domain: f.domain ?? 'CATALOG',
      category: f.category ?? 'meta',
      evidence: [],
      provenance: { toolId: 'catalog.audit' },
    }))
  );
  if (max === 'BLOQUEADOR' || max === 'IMPORTANTE') return 'FAIL';
  if (max === 'WARNING') return 'WARNING';
  return 'PASS';
}

export function buildCatalogStats(
  ctx: CatalogEngineContext,
  facet: CatalogAuditFacet,
  allFindings: ReportFinding[],
  taxonomyFindings: ReportFinding[]
): CatalogStatsDocument {
  const cfg = loadCatalogConfig();
  const snap = ctx.gate.snapshots.find((s) => s.ssotId === 'registro-schema-index');
  const exactLabelDupes = allFindings.filter(
    (f) => f.code === 'CATALOG.DUPLICATE.EXACT_LABEL'
  ).length;
  const idCollisions = allFindings.filter(
    (f) => f.code === 'CATALOG.DUPLICATE.ID_COLLISION'
  ).length;
  const similarPairs = countSimilarPairs(ctx);
  const legacyAliasCount = countLegacyAliases(ctx);
  const gapsDeclared = countGapsDeclared(ctx);
  const assets = ctx.assetsCoverage ?? {
    ratio: 0,
    sectorsWithBlocks: 0,
    sectorsExpected: cfg.knownSectors.length,
    subsWithPack: 0,
    subsMissingAssets: 0,
    missingAssetFindings: 0,
  };

  const catalogHealth: CatalogHealthDocument = {
    schemaVersion: '1.0.0',
    ssotValid: ctx.gate.ssotValid,
    mirrorValid: ctx.gate.mirrorValid,
    taxonomyValid: taxonomyValid(taxonomyFindings),
    assetsCoverage: assets,
    overallStatus: overallStatus(ctx.gate.ssotValid, ctx.gate.mirrorValid, allFindings),
  };

  return {
    schemaVersion: '1.0.0',
    ssotId: 'registro-schema-index',
    ssotVersion: ctx.index.version,
    ssotContentHash: snap?.contentHash ?? null,
    totalSubcategorias: ctx.index.entries.length,
    totalSectores: Object.keys(ctx.index.sectorCounts).length,
    sectorCounts: ctx.index.sectorCounts,
    idsWithSpaces: ctx.index.idsWithSpaces.length,
    globalIdCollisions: idCollisions,
    exactLabelDuplicates: exactLabelDupes,
    similarPairsAboveThreshold: similarPairs,
    legacyAliasCount,
    gapsDeclared,
    facet,
    generatedAt: new Date().toISOString(),
    catalogHealth,
  };
}

export function gateHash(gate: ContractGateResult): string | null {
  return gate.snapshots.find((s) => s.ssotId === 'registro-schema-index')?.contentHash ?? null;
}
