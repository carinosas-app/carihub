import { jaccardSimilarity, normId, pairKey } from '../normalize.js';
import { catalogFinding } from '../findings.js';
import type { CatalogEngineContext } from '../types.js';
import type { ReportFinding } from '../../../reports/schema.js';

export function runDuplicatesFacet(ctx: CatalogEngineContext): ReportFinding[] {
  const findings: ReportFinding[] = [];
  const entries = ctx.index.entries.filter((e) => entryInScope(e, ctx));
  const labelMap = new Map<string, typeof entries>();
  const normIdMap = new Map<string, typeof entries>();

  for (const entry of entries) {
    const list = labelMap.get(entry.normLabel) ?? [];
    list.push(entry);
    labelMap.set(entry.normLabel, list);

    const nid = entry.normId;
    const idList = normIdMap.get(nid) ?? [];
    idList.push(entry);
    normIdMap.set(nid, idList);
  }

  for (const [, group] of labelMap) {
    if (group.length < 2) continue;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i]!;
        const b = group[j]!;
        findings.push(
          catalogFinding(
            'CATALOG.DUPLICATE.EXACT_LABEL',
            'WARNING',
            'Exact label duplicate',
            `Label "${a.subcategoria}" shared by ${a.sectorId}/${a.subcategoriaId} and ${b.sectorId}/${b.subcategoriaId}`,
            'duplicates',
            {
              subject: {
                type: 'pair',
                pairKey: pairKey(a, b),
                sectorId: a.sectorId,
                subcategoriaId: a.subcategoriaId,
              },
            }
          )
        );
      }
    }
  }

  for (const [, group] of normIdMap) {
    if (group.length < 2) continue;
    const ids = new Set(group.map((g) => g.subcategoriaId));
    if (ids.size < 2) continue;
    findings.push(
      catalogFinding(
        'CATALOG.DUPLICATE.ID_COLLISION',
        'BLOQUEADOR',
        'Normalized ID collision',
        `Normalized id ${group[0]!.normId} maps to ${group.length} distinct subcategoriaIds`,
        'duplicates',
        {
          subject: {
            type: 'pair',
            pairKey: group.map((g) => `${g.sectorId}/${g.subcategoriaId}`).join('|'),
          },
        }
      )
    );
  }

  const minSim = ctx.thresholds.similarityJaccardMin;
  const crossMin = ctx.thresholds.similarityCrossSectorMin;

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i]!;
      const b = entries[j]!;
      if (a.subcategoriaId === b.subcategoriaId) continue;
      const sim = jaccardSimilarity(a.subcategoria, b.subcategoria);
      const crossSector = a.sectorId !== b.sectorId;
      const threshold = crossSector ? crossMin : minSim;
      if (sim < threshold) continue;

      const isBarPair =
        (a.subcategoriaId === 'bares' && b.subcategoriaId === 'antro restaurant bar') ||
        (b.subcategoriaId === 'bares' && a.subcategoriaId === 'antro restaurant bar');

      findings.push(
        catalogFinding(
          isBarPair ? 'CATALOG.DUPLICATE.CROSS_SECTOR_BAR' : 'CATALOG.DUPLICATE.SEMANTIC_PAIR',
          'INFO',
          isBarPair ? 'Cross-sector bar pair' : 'Semantic similarity pair',
          `${a.sectorId}/${a.subcategoriaId} ~ ${b.sectorId}/${b.subcategoriaId} (Jaccard=${sim.toFixed(2)})`,
          'duplicates',
          {
            confidence: 'medium',
            subject: {
              type: 'pair',
              pairKey: pairKey(a, b),
            },
          }
        )
      );
    }
  }

  ctx.similarPairsCount = findings.filter(
    (f) => f.code?.includes('SEMANTIC') || f.code?.includes('CROSS_SECTOR')
  ).length;

  return findings;
}

export function countSimilarPairs(ctx: CatalogEngineContext): number {
  return ctx.similarPairsCount ?? 0;
}

function entryInScope(
  entry: { sectorId: string; subcategoriaId: string },
  ctx: CatalogEngineContext
): boolean {
  const { scope } = ctx;
  if (scope.subcategoriaIds.length && !scope.subcategoriaIds.includes(entry.subcategoriaId)) {
    return false;
  }
  if (scope.sectorIds.length && !scope.sectorIds.includes(entry.sectorId)) return false;
  return true;
}
