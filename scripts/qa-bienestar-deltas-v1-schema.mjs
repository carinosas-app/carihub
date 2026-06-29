/**
 * QA — MP-BIENESTAR-DELTAS-V1 schema/mapa/catálogo (sin browser).
 * node scripts/qa-bienestar-deltas-v1-schema.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  SUB_TO_PACK,
  PACK_H_SUBS,
  PACK_H_PROHIBIDOS,
  NEW_SUBCATEGORIAS,
  RETAIL_FIX_IDS,
  buildPackPlantillas,
  packPlantillaKey,
  isBienestarRetailVenta,
  BIENESTAR_RETAIL_NEGOCIO_ARQUETIPO,
} from "./bienestar-packs-v1.mjs";
import { mergeRegistrationSchema, loadSchema } from "./field-engine-merge.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || "falló" });
}

const sectores = fs.readFileSync(path.join(root, "public/js/sectores-carihub.js"), "utf8");
const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));
const indSchema = loadSchema("persona_independiente");
const negSchema = loadSchema("negocio_empresa");

const bienestarMapa = mapa.matrix.filter((r) => r.sectorId === "bienestar");
const bienestarInd = indSchema.subcategorias.filter((s) => s.sectorId === "bienestar");

ok("mapa bienestar count 60", bienestarMapa.length === 60, String(bienestarMapa.length));
ok("schema independiente bienestar persona 58", bienestarInd.length === 58, String(bienestarInd.length));

for (const neu of NEW_SUBCATEGORIAS) {
  ok(`catálogo ${neu.subcategoriaId}`, sectores.includes(neu.nombre) || sectores.includes(neu.subcategoriaId));
  ok(`mapa ${neu.subcategoriaId}`, bienestarMapa.some((r) => r.subcategoriaId === neu.subcategoriaId));
  ok(`schema ${neu.subcategoriaId}`, bienestarInd.some((s) => s.subcategoriaId === neu.subcategoriaId));
}

for (const id of RETAIL_FIX_IDS) {
  ok(`integrar retail rule ${id}`, isBienestarRetailVenta("bienestar", id.replace(/-/g, " "), id));
}
ok("integrar retail arquetipo canon", BIENESTAR_RETAIL_NEGOCIO_ARQUETIPO === "negocio_comercio");
const integrarSrc = fs.readFileSync(path.join(root, "scripts/integrar-catalogo-expandido.mjs"), "utf8");
ok("integrar importa isBienestarRetailVenta", integrarSrc.includes("isBienestarRetailVenta"));
ok(
  "integrar overrides bienestar retail",
  integrarSrc.includes("venta-de-inciensos") && integrarSrc.includes("BIENESTAR_RETAIL_NEGOCIO_ARQUETIPO")
);
ok("integrar venta de no fuerza inmobiliario global", !integrarSrc.includes('n.startsWith("venta de")') || integrarSrc.includes("isBienestarRetailVenta"));

for (const id of RETAIL_FIX_IDS) {
  const mapRow = bienestarMapa.find((r) => r.subcategoriaId === id);
  const negSub = negSchema.subcategorias.find((s) => s.subcategoriaId === id);
  ok(`${id} mapa negocio_comercio`, mapRow?.arquetipo === "negocio_comercio", mapRow?.arquetipo);
  ok(`${id} schema negocio_comercio`, negSub?.arquetipo === "negocio_comercio", negSub?.arquetipo);
  ok(`${id} no inmobiliario`, mapRow?.arquetipo !== "negocio_inmobiliario");
}

const packKeys = Object.keys(buildPackPlantillas());
ok("plantillas packs A-H", packKeys.length === 8, String(packKeys.length));

for (const sub of bienestarInd) {
  const pack = SUB_TO_PACK[sub.subcategoriaId];
  ok(`pack map ${sub.subcategoriaId}`, !!pack, sub.subcategoriaId);
  ok(
    `arquetipo pack ${sub.subcategoriaId}`,
    sub.arquetipo === packPlantillaKey(pack),
    `${sub.arquetipo} vs ${packPlantillaKey(pack)}`
  );
  ok(`deltaPack ${sub.subcategoriaId}`, sub.delta?.deltaPack === pack, sub.delta?.deltaPack);
  const merged = mergeRegistrationSchema(indSchema, sub);
  ok(`merge obligatorios ${sub.subcategoriaId}`, (merged.obligatoriosExtra || []).length > 0);
}

for (const subId of PACK_H_SUBS) {
  const sub = bienestarInd.find((s) => s.subcategoriaId === subId);
  const merged = mergeRegistrationSchema(indSchema, sub);
  ok(`${subId} sensible`, merged.sensible === true);
  ok(`${subId} regulada`, merged.regulada === true);
  ok(`${subId} requiresAdminReview`, merged.requiresAdminReview === true);
  ok(`${subId} soloExperienciaCeremonial`, merged.soloExperienciaCeremonial === true);
  ok(`${subId} disclaimer`, merged.obligatoriosExtra.includes("disclaimerRegulado"));
  ok(`${subId} jurisdiccion`, merged.obligatoriosExtra.includes("jurisdiccionDeclarada"));
  ok(`${subId} contraindicaciones`, merged.obligatoriosExtra.includes("contraindicacionesObligatorias"));
  ok(`${subId} edad 18`, merged.obligatoriosExtra.includes("edadMinimaServicio"));
  for (const banned of PACK_H_PROHIBIDOS) {
    ok(`${subId} prohibe ${banned}`, !(merged.camposPublicosPerfil || []).includes(banned));
    ok(`${subId} no obliga ${banned}`, !(merged.obligatoriosExtra || []).includes(banned));
  }
}

const ayahuasca = bienestarInd.find((s) => s.subcategoriaId === "ceremonias-ayahuasca-rape-plantas-de-poder");
ok("ayahuasca nombre visible", ayahuasca?.nombre.includes("Ayahuasca"));
ok("ayahuasca pack H", ayahuasca?.delta?.deltaPack === "H");

console.log("\n=== QA MP-BIENESTAR-DELTAS-V1 ===");
console.log("PASS:", pass.length);
console.log("FAIL:", fail.length);
if (fail.length) {
  fail.slice(0, 30).forEach((f) => console.log("  FAIL:", f.name, f.detail || ""));
  process.exit(1);
}
console.log("OK — schema/mapa/catálogo");
