/**
 * Sync render-map.json entries from frozen render-matrix.json (PP-02).
 * Preserves hand-tuned aliases/sections on existing smoke entries when present.
 * node scripts/qa-paridad-reg-pub/sync-render-map-from-matrix.mjs
 */
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { makePipelineCtx } from './lib/vm-pipeline-context.mjs';
import { loadSchemaIndex } from './lib/catalog-loader.mjs';
import {
  getMatrixCases,
  buildRenderMapEntryFromCase,
  loadRenderMap,
} from './lib/render-matrix.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAP_PATH = path.join(__dirname, 'lib', 'render-map.json');

const HAND_TUNED = loadRenderMap();

function mergeEntry(slug, built) {
  const prev = HAND_TUNED[slug];
  if (!prev) return built;
  return {
    ...built,
    aliases: prev.aliases || built.aliases,
    sections: prev.sections || built.sections,
    demoForbiddenNeedles: prev.demoForbiddenNeedles,
    smokeNeedles: prev.smokeNeedles?.length ? prev.smokeNeedles : built.smokeNeedles,
    smokeFields: prev.smokeFields?.length ? prev.smokeFields : built.smokeFields,
  };
}

function main() {
  const { ctx } = makePipelineCtx();
  const index = loadSchemaIndex(ctx);
  const out = {};

  for (const matrixCase of getMatrixCases()) {
    const schemaEntry = index.byId[matrixCase.subcategoriaId];
    const { slug, entry } = buildRenderMapEntryFromCase(matrixCase, schemaEntry);
    out[slug] = mergeEntry(slug, entry);
  }

  writeFileSync(MAP_PATH, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  console.log(`[PP-02] render-map.json synced — ${Object.keys(out).length} entries → ${MAP_PATH}`);
}

main();
