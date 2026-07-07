import { slugSubId } from './slug.mjs';

/** Recolecta SUB_TO_PACK de globals CARIHUB_REGISTRO_*_SECTOR_BLOCKS / GASTRONOMIA / EVENTOS. */
export function collectBlocksSubMaps(ctx) {
  const maps = [];
  for (const key of Object.keys(ctx)) {
    if (!key.startsWith('CARIHUB_REGISTRO_') || !key.endsWith('_BLOCKS')) continue;
    const api = ctx[key];
    if (!api || typeof api !== 'object') continue;
    const subToPack = api.subToPack || api.SUB_TO_PACK;
    if (!subToPack || typeof subToPack !== 'object') continue;
    maps.push({
      globalName: key,
      sectorId: api.sectorId || inferSectorFromGlobal(key),
      subToPack,
      keys: Object.keys(subToPack).map(slugSubId),
    });
  }
  return maps;
}

function inferSectorFromGlobal(name) {
  const m = name.match(/CARIHUB_REGISTRO_([A-Z_]+)_/);
  if (!m) return 'unknown';
  return m[1].toLowerCase().replace(/_/g, '-');
}

export function analyzeGaps(schemaEntries, subResults, blocksMaps) {
  const schemaBySlug = new Map();
  for (const e of schemaEntries) {
    schemaBySlug.set(`${e.sectorId}::${slugSubId(e.subcategoriaId)}`, e);
  }

  const schemaSlugsBySector = new Map();
  for (const e of schemaEntries) {
    const sid = e.sectorId || 'unknown';
    if (!schemaSlugsBySector.has(sid)) schemaSlugsBySector.set(sid, new Set());
    schemaSlugsBySector.get(sid).add(slugSubId(e.subcategoriaId));
  }

  const gaps = {
    schemaWithoutResolveConfig: [],
    schemaWithoutFields: [],
    blocksSubNotInSchema: [],
    schemaSubMissingInSubToPack: [],
    sectorAliasMismatches: [],
  };

  for (const r of subResults) {
    if (!r.hasResolveConfig) {
      gaps.schemaWithoutResolveConfig.push({
        subcategoriaId: r.subcategoriaId,
        sectorId: r.sectorId,
        categoriaPrincipal: r.categoriaPrincipal,
        arquetipo: r.arquetipo,
        riesgo: 'importante',
      });
    }
    if (r.hasResolveConfig && r.fieldCount === 0) {
      gaps.schemaWithoutFields.push({
        subcategoriaId: r.subcategoriaId,
        sectorId: r.sectorId,
        configId: r.configId,
        riesgo: 'importante',
      });
    }
  }

  const SECTOR_ALIASES = { gastronomia: 'restaurantes', restaurantes: 'restaurantes' };

  for (const bm of blocksMaps) {
    let sectorForSchema = bm.sectorId;
    if (SECTOR_ALIASES[sectorForSchema]) sectorForSchema = SECTOR_ALIASES[sectorForSchema];
    const schemaSet = schemaSlugsBySector.get(sectorForSchema) || schemaSlugsBySector.get(bm.sectorId) || new Set();

    for (const subSlug of bm.keys) {
      if (!schemaSet.has(subSlug)) {
        gaps.blocksSubNotInSchema.push({
          sectorId: bm.sectorId,
          subcategoriaSlug: subSlug,
          blocksGlobal: bm.globalName,
          pack: bm.subToPack[subSlug] || bm.subToPack[Object.keys(bm.subToPack).find((k) => slugSubId(k) === subSlug)],
          riesgo: 'mejora',
        });
      }
    }
  }

  for (const r of subResults) {
    if (!r.hasResolveConfig) continue;
    const bm = findBlocksMapForSector(blocksMaps, r.sectorId);
    if (!bm) continue;
    const slug = slugSubId(r.subcategoriaId);
    const inMap = bm.keys.includes(slug);
    if (!inMap && bm.keys.length > 0) {
      gaps.schemaSubMissingInSubToPack.push({
        subcategoriaId: r.subcategoriaId,
        sectorId: r.sectorId,
        subSlug: slug,
        blocksGlobal: bm.globalName,
        defaultPackUsed: r.deltaPack || null,
        riesgo: 'mejora',
        nota: 'Puede usar pack default del sector; verificar SUB_TO_PACK',
      });
    }
  }

  return gaps;
}

function findBlocksMapForSector(blocksMaps, sectorId) {
  const sid = slugSubId(sectorId);
  const aliases = { restaurantes: 'gastronomia', gastronomia: 'gastronomia' };
  const want = [sid, aliases[sid]].filter(Boolean);
  return blocksMaps.find((m) => want.includes(slugSubId(m.sectorId)));
}
