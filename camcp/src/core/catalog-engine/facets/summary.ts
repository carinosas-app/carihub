import type { ContractGateResult } from '../../contract-engine/types.js';
import type { ReportFinding } from '../../../reports/schema.js';
import { loadCatalogConfig } from '../config-loader.js';
import {
  buildMirrorMismatchFinding,
  buildSsotInvalidFinding,
  buildSsotUnchangedFinding,
  catalogFinding,
} from '../findings.js';
import type { CatalogAuditFacet, CatalogEngineContext } from '../types.js';

export function runSummaryFacet(
  ctx: CatalogEngineContext,
  similarPairsCount = 0,
  legacyAliasCount = 0,
  gapsDeclared = 0
): ReportFinding[] {
  const findings: ReportFinding[] = [];
  const snap = ctx.gate.snapshots.find((s) => s.ssotId === 'registro-schema-index');
  const schemaPath = ctx.schemaIndexPath;

  if (!ctx.gate.ssotValid) {
    const msg =
      ctx.gate.errors.map((e) => e.message).join('; ') || 'Contract gate failed for schema-index';
    return [buildSsotInvalidFinding(msg)];
  }

  if (!ctx.gate.mirrorValid) {
    findings.push(buildMirrorMismatchFinding(ctx.gate.snapshots[0]?.path ?? schemaPath));
  }

  if (ctx.previousFullRunRef && ctx.skippedFacets.length) {
    findings.push(buildSsotUnchangedFinding(ctx.previousFullRunRef));
  }

  if (!ctx.index.version) {
    findings.push(
      catalogFinding(
        'CATALOG.SSOT.VERSION_MISSING',
        'WARNING',
        'Schema-index version missing',
        'Field version is absent in registro-schema-index.json',
        'summary',
        { category: 'ssot' }
      )
    );
  }

  findings.push(
    catalogFinding(
      'CATALOG.STATS.TOTAL_SUBS',
      'INFO',
      'Total subcategorías',
      `${ctx.index.entries.length} subcategorías in schema-index (declared total=${ctx.index.total})`,
      'summary',
      { category: 'stats' }
    )
  );

  findings.push(
    catalogFinding(
      'CATALOG.STATS.SECTOR_COUNT',
      'INFO',
      'Sector distribution',
      `${Object.keys(ctx.index.sectorCounts).length} sectors in catalog`,
      'summary',
      {
        category: 'stats',
        subject: { type: 'sector', sectorCounts: ctx.index.sectorCounts },
      }
    )
  );

  if (ctx.index.idsWithSpaces.length) {
    findings.push(
      catalogFinding(
        'CATALOG.STATS.IDS_WITH_SPACES',
        'WARNING',
        'Subcategoria IDs with spaces',
        `${ctx.index.idsWithSpaces.length} entries use spaces in subcategoriaId`,
        'summary',
        {
          category: 'stats',
          subject: { type: 'subcategoria', ids: ctx.index.idsWithSpaces.slice(0, 20) },
        }
      )
    );
  }

  if (similarPairsCount > 0) {
    findings.push(
      catalogFinding(
        'CATALOG.STATS.SIMILAR_PAIRS',
        'INFO',
        'Similar pairs above threshold',
        `${similarPairsCount} semantic pairs ≥ threshold (see duplicates facet)`,
        'summary',
        { category: 'stats', confidence: 'medium' }
      )
    );
  }

  if (gapsDeclared > 0) {
    findings.push(
      catalogFinding(
        'CATALOG.STATS.GAPS_DECLARED',
        'INFO',
        'Declared gaps',
        `${gapsDeclared} gap rules matched as absent/fused`,
        'summary',
        { category: 'stats' }
      )
    );
  }

  if (legacyAliasCount > 0) {
    findings.push(
      catalogFinding(
        'CATALOG.STATS.LEGACY_ALIASES',
        'INFO',
        'Legacy alias count',
        `${legacyAliasCount} legacy alias mappings loaded`,
        'summary',
        { category: 'stats' }
      )
    );
  }

  if (snap?.contentHash) {
    findings.push(
      catalogFinding(
        'CATALOG.SSOT.SNAPSHOT',
        'INFO',
        'SSOT snapshot captured',
        `registro-schema-index @ ${ctx.index.version ?? 'unknown'} hash ${snap.contentHash.slice(0, 24)}…`,
        'summary',
        {
          category: 'ssot',
          ssotRef: {
            ssotId: 'registro-schema-index',
            path: schemaPath,
            version: ctx.index.version ?? undefined,
            anchor: 'root',
          },
        }
      )
    );
  }

  return findings;
}

export function runTaxonomyFacet(ctx: CatalogEngineContext): ReportFinding[] {
  const cfg = loadCatalogConfig();
  const findings: ReportFinding[] = [];
  const knownFormularioIds = new Set<string>();

  for (const entry of ctx.index.entries) {
    if (!entryInScope(entry, ctx)) continue;
    if (!cfg.knownSectors.includes(entry.sectorId)) {
      findings.push(
        catalogFinding(
          'CATALOG.TAXONOMY.SECTOR_UNKNOWN',
          'BLOQUEADOR',
          'Unknown sector',
          `Entry ${entry.subcategoriaId} references unknown sectorId=${entry.sectorId}`,
          'taxonomy',
          {
            subject: {
              type: 'subcategoria',
              sectorId: entry.sectorId,
              subcategoriaId: entry.subcategoriaId,
            },
          }
        )
      );
    }
    if (!entry.arquetipo) {
      findings.push(
        catalogFinding(
          'CATALOG.TAXONOMY.MISSING_ARQUETIPO',
          'IMPORTANTE',
          'Missing arquetipo',
          `Entry ${entry.subcategoriaId} has no arquetipo`,
          'taxonomy',
          {
            subject: {
              type: 'subcategoria',
              sectorId: entry.sectorId,
              subcategoriaId: entry.subcategoriaId,
            },
          }
        )
      );
    }
    if (entry.formularioId) knownFormularioIds.add(entry.formularioId);
    if (!entry.formularioId) {
      findings.push(
        catalogFinding(
          'CATALOG.TAXONOMY.UNKNOWN_FORMULARIO',
          'IMPORTANTE',
          'Missing formularioId',
          `Entry ${entry.subcategoriaId} has no formularioId`,
          'taxonomy',
          {
            subject: {
              type: 'subcategoria',
              sectorId: entry.sectorId,
              subcategoriaId: entry.subcategoriaId,
            },
          }
        )
      );
    }
  }

  return findings;
}

function entryInScope(
  entry: { sectorId: string; subcategoriaId: string; subcategoria?: string },
  ctx: CatalogEngineContext
): boolean {
  const { scope } = ctx;
  if (scope.subcategoriaIds.length && !scope.subcategoriaIds.includes(entry.subcategoriaId)) {
    return false;
  }
  if (scope.sectorIds.length && !scope.sectorIds.includes(entry.sectorId)) return false;
  return true;
}

export function taxonomyValid(findings: ReportFinding[]): boolean {
  return !findings.some(
    (f) => f.severity === 'IMPORTANTE' || f.severity === 'BLOQUEADOR'
  );
}

export function ssotChangedFinding(
  previousHash: string | undefined,
  currentHash: string | undefined
): ReportFinding | null {
  if (!previousHash || !currentHash || previousHash === currentHash) return null;
  return catalogFinding(
    'CATALOG.SSOT.CHANGED',
    'INFO',
    'Schema-index SSOT changed',
    `Content hash changed from ${previousHash.slice(0, 16)}… to ${currentHash.slice(0, 16)}…`,
    'summary',
    { category: 'ssot' }
  );
}

export function gateBlocksCatalog(gate: ContractGateResult): boolean {
  return !gate.ssotValid;
}
