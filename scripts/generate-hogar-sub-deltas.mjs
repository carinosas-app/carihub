/**
 * Genera public/js/data/registro-hogar-sub-deltas.js
 * Uso: node scripts/generate-hogar-sub-deltas.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildHogarSubDeltas } from "./hogar-sub-deltas-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));
const rows = mapa.matrix.filter((r) => r.sectorId === "hogar");
const { SUB_CANON_META, SUB_DELTAS } = buildHogarSubDeltas(rows);

const outPath = path.join(root, "public/js/data/registro-hogar-sub-deltas.js");
const js = `/**
 * AUTO-GENERADO — MP-HOGAR-DELTAS-V1 (${rows.length} subs).
 * Regenerar: node scripts/generate-hogar-sub-deltas.mjs
 */
(function (global) {
  'use strict';
  global.CARIHUB_HOGAR_SUB_CANON_META = ${JSON.stringify(SUB_CANON_META, null, 2)};
  global.CARIHUB_HOGAR_SUB_DELTAS = ${JSON.stringify(SUB_DELTAS, null, 2)};
})(typeof window !== 'undefined' ? window : globalThis);
`;
fs.writeFileSync(outPath, js, "utf8");
console.log("Wrote", outPath, "—", Object.keys(SUB_DELTAS).length, "sub-deltas");
