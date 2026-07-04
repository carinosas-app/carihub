/**
 * Sync schema persona_independiente — delta detallado por sub bienestar (60).
 * Uso: node scripts/apply-bienestar-sub-deltas-schema.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildBienestarSubDeltas } from "./bienestar-sub-deltas-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));
const rows = mapa.matrix.filter((r) => r.sectorId === "bienestar");
const { SUB_DELTAS } = buildBienestarSubDeltas(rows);

const schemaPath = path.join(root, "scripts/config-registro-independiente-schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
let patched = 0;

for (const sub of schema.subcategorias) {
  if (sub.sectorId !== "bienestar") continue;
  const d = SUB_DELTAS[sub.subcategoriaId];
  if (!d) continue;
  sub.delta = {
    ...(sub.delta || {}),
    deltaPack: d.deltaPack,
    blockTitle: d.blockTitle,
    blockHint: d.blockHint,
    deltaFields: d.deltaFields,
    obligatoriosDelta: d.obligatoriosDelta,
    textosAyuda: d.textosAyuda,
    canonSubcategoriaId: d.canonSubcategoriaId,
    keywordsIA: sub.delta?.keywordsIA || sub.keywordsIA || [],
    ...(d.deltaPack === "H" ? { edadMinimaServicio: 18 } : {}),
  };
  patched++;
}

fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + "\n", "utf8");
console.log("Patched config-registro-independiente-schema.json —", patched, "subs bienestar");

const negPath = path.join(root, "scripts/config-registro-negocio-schema.json");
const negSchema = JSON.parse(fs.readFileSync(negPath, "utf8"));
let negPatched = 0;
for (const sub of negSchema.subcategorias) {
  if (sub.sectorId !== "bienestar") continue;
  const d = SUB_DELTAS[sub.subcategoriaId];
  if (!d || !d.negocioRetail) continue;
  sub.delta = {
    ...(sub.delta || {}),
    deltaPack: "D",
    blockTitle: d.blockTitle,
    blockHint: d.blockHint,
    deltaFields: d.deltaFields,
    obligatoriosDelta: d.obligatoriosDelta,
    textosAyuda: d.textosAyuda,
    canonSubcategoriaId: d.canonSubcategoriaId,
  };
  negPatched++;
}
fs.writeFileSync(negPath, JSON.stringify(negSchema, null, 2) + "\n", "utf8");
console.log("Patched config-registro-negocio-schema.json —", negPatched, "retail subs");
