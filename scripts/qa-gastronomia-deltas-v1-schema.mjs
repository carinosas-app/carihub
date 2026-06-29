/**
 * QA — MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 Fase 1 (spec + catálogo + schema).
 * node scripts/qa-gastronomia-deltas-v1-schema.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  CANON_SUBCATEGORIAS,
  LEGACY_TO_CANON,
  NEW_SUBCATEGORIAS,
  ADULTOS_REDIRECTS,
  EVENTOS_REDIRECTS,
  GASTRONOMIA_FIELD_REGISTRY,
  SUB_DELTAS,
  SUB_TO_PACK,
  CONDITIONAL_RULES,
  RISK_PROFILE_BY_CANON,
  SECURITY_CONTROLS,
  buildPackPlantillas,
  validateLegacyMapping,
  isDeltaSufficient,
  packPlantillaKey,
  UI_IND_GASTRONOMIA,
  UI_NEG_GASTRONOMIA,
  CATALOG_SEMVER,
  SCHEMA_VERSION,
  SECTOR_PUBLIC_NAME,
  GASTRONOMIA_NESTED_PROFILE_KEY,
  MIN_DELTA_FIELD_COUNT,
  SECTOR_UI_SLUG_TO_CANON,
} from "./gastronomia-packs-v1.mjs";
import { mergeRegistrationSchema, loadSchema } from "./field-engine-merge.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || "falló" });
}

const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));
const indSchema = loadSchema("persona_independiente");
const negSchema = loadSchema("negocio_empresa");
const matriz = JSON.parse(fs.readFileSync(path.join(root, "scripts/MATRIZ-FORMULARIO-UI-REGISTRO.json"), "utf8"));
const busqueda = JSON.parse(fs.readFileSync(path.join(root, "scripts/busqueda-enriquecimiento.json"), "utf8"));
const sectoresJs = fs.readFileSync(path.join(root, "public/js/sectores-carihub.js"), "utf8");

const gastronomiaMapa = mapa.matrix.filter((r) => r.sectorId === "restaurantes");
const gastronomiaInd = indSchema.subcategorias.filter((s) => s.sectorId === "restaurantes");
const gastronomiaNeg = negSchema.subcategorias.filter((s) => s.sectorId === "restaurantes");
const matrizGastronomia = matriz.asignaciones.filter((r) => r.sectorId === "restaurantes");

ok("nested key spec", GASTRONOMIA_NESTED_PROFILE_KEY === "gastronomiaPerfil");
ok("sector public name", SECTOR_PUBLIC_NAME.includes("Gastronomía"));
ok("catalog semver mapa", mapa.catalogSemver === CATALOG_SEMVER || mapa.gastronomiaLegacyRedirect);
ok("24 canon mapa restaurantes", gastronomiaMapa.length === 24, String(gastronomiaMapa.length));
ok("25 legacy mapeadas spec", Object.keys(LEGACY_TO_CANON).length === 25);
ok("2 exclusiones adultos", Object.keys(ADULTOS_REDIRECTS).length === 2);
ok("5 exclusiones eventos", Object.keys(EVENTOS_REDIRECTS).length === 5);
ok("legacy redirect busqueda", !!busqueda.legacySubcategoriaRedirectGastronomia);
ok("exclusion adultos busqueda", !!busqueda.gastronomiaExclusionRedirectsAdultos);
ok("exclusion eventos busqueda", !!busqueda.gastronomiaExclusionRedirectsEventos);
ok("no antros en mapa", !gastronomiaMapa.some((r) => r.subcategoriaId === "antros-y-bares"));
ok("no vida-nocturna en mapa", !gastronomiaMapa.some((r) => r.subcategoriaId === "vida-nocturna"));
ok("no catering en mapa", !gastronomiaMapa.some((r) => r.subcategoriaId === "catering"));
ok("restaurante-bar legacy → bares", LEGACY_TO_CANON["restaurante-bar"] === "bares");
ok("food-truck legacy", LEGACY_TO_CANON["food-truck"] === "food-trucks-gastronomia");
ok("SECTOR_UI_SLUG count 24", Object.keys(SECTOR_UI_SLUG_TO_CANON).length === 24);

for (const canon of CANON_SUBCATEGORIAS) {
  ok(`mapa ${canon.subcategoriaId}`, gastronomiaMapa.some((r) => r.subcategoriaId === canon.subcategoriaId));
  ok(`matriz ${canon.subcategoriaId}`, matrizGastronomia.some((r) => r.subcategoriaId === canon.subcategoriaId));
  ok(`delta sufficient ${canon.subcategoriaId}`, isDeltaSufficient(canon.subcategoriaId));
  const fieldCount = SUB_DELTAS[canon.subcategoriaId]?.deltaFields?.length || 0;
  ok(`delta fields >= ${MIN_DELTA_FIELD_COUNT} ${canon.subcategoriaId}`, fieldCount >= MIN_DELTA_FIELD_COUNT, String(fieldCount));
  ok(`pack map ${canon.subcategoriaId}`, SUB_TO_PACK[canon.subcategoriaId] === canon.pack);
  ok(`risk profile ${canon.subcategoriaId}`, !!RISK_PROFILE_BY_CANON[canon.subcategoriaId]);
}

ok("schema ind gastronomía 3", gastronomiaInd.length === 3, String(gastronomiaInd.length));
ok("schema neg gastronomía 21", gastronomiaNeg.length === 21, String(gastronomiaNeg.length));

for (const sub of [...gastronomiaInd, ...gastronomiaNeg]) {
  const pack = SUB_TO_PACK[sub.subcategoriaId];
  ok(`arquetipo pack ${sub.subcategoriaId}`, sub.arquetipo === packPlantillaKey(pack));
  ok(`deltaPack ${sub.subcategoriaId}`, sub.delta?.deltaPack === pack);
  ok(`nested key delta ${sub.subcategoriaId}`, sub.delta?.nestedProfileKey === "gastronomiaPerfil");
  ok(`obligatoriosDelta ${sub.subcategoriaId}`, (sub.delta?.obligatoriosDelta || []).length >= 4);
  ok(`previewFicha ${sub.subcategoriaId}`, !!sub.delta?.previewFicha?.chips);
  ok(`campos publicos ${sub.subcategoriaId}`, (sub.delta?.camposPublicosPerfil || []).length >= 8);
  const schema = gastronomiaNeg.some((x) => x.subcategoriaId === sub.subcategoriaId) ? negSchema : indSchema;
  const merged = mergeRegistrationSchema(schema, sub);
  ok(`merge fields ${sub.subcategoriaId}`, (merged.obligatoriosExtra || []).length > 0);
}

const darkKitchen = gastronomiaNeg.find((s) => s.subcategoriaId === "dark-kitchen");
ok("dark kitchen privacidad", darkKitchen?.delta?.privacidadDireccion === true);
ok("dark kitchen regulada", darkKitchen?.delta?.regulada === true);

const bares = gastronomiaNeg.find((s) => s.subcategoriaId === "bares");
ok("bares alcohol declarativo", bares?.delta?.declarativaAlcohol === true);
ok("bares permiso field", !!GASTRONOMIA_FIELD_REGISTRY.permisoVentaAlcohol);

const foodTruck = gastronomiaNeg.find((s) => s.subcategoriaId === "food-trucks-gastronomia");
ok("food truck eventos campo", !!GASTRONOMIA_FIELD_REGISTRY.aceptaEventosPrivados);

for (const foodId of [
  "restaurantes-tradicional",
  "taquerias",
  "dark-kitchen",
  "distribuidoras-alimentos-bebidas",
]) {
  const sub = gastronomiaNeg.find((s) => s.subcategoriaId === foodId) || gastronomiaInd.find((s) => s.subcategoriaId === foodId);
  ok(`${foodId} permiso alimentos`, sub?.delta?.obligatoriosDelta?.includes("permisoManipulacionAlimentos"));
}

const packs = buildPackPlantillas();
ok("10 plantillas pack", Object.keys(packs).length === 10);
ok("BAR coherencia alcohol", !!packs[packPlantillaKey("BAR_BEBIDAS")]?.coherenciaExtra);
ok("DELIVERY privacidad", !!packs[packPlantillaKey("DELIVERY")]?.privacidadExtra);

ok("fieldRegistry permiso alimentos", "permisoManipulacionAlimentos" in (negSchema.meta?.fieldRegistry || {}));
ok("ui_ind_gastronomia catalogo", matriz.catalogoUi.some((u) => u.formularioUiId === UI_IND_GASTRONOMIA));
ok("ui_neg_gastronomia catalogo", matriz.catalogoUi.some((u) => u.formularioUiId === UI_NEG_GASTRONOMIA));
ok("ui_ind count 3", matrizGastronomia.filter((r) => r.formularioUiId === UI_IND_GASTRONOMIA).length === 3);
ok("ui_neg count 21", matrizGastronomia.filter((r) => r.formularioUiId === UI_NEG_GASTRONOMIA).length === 21);

for (const neu of NEW_SUBCATEGORIAS) {
  ok(`nueva mapa ${neu.subcategoriaId}`, gastronomiaMapa.some((r) => r.subcategoriaId === neu.subcategoriaId));
}

for (const canon of CANON_SUBCATEGORIAS) {
  const inSectores = sectoresJs.includes(canon.nombre) || sectoresJs.includes(canon.nombre.replace(/'/g, "\\'"));
  ok(`sectores js ${canon.subcategoriaId}`, inSectores);
}
ok("sectores nombre público", sectoresJs.includes("Restaurantes, Gastronomía y Bebidas"));

ok("conditional rules", CONDITIONAL_RULES.length >= 10);
ok("security controls xss", !!SECURITY_CONTROLS.xss);
ok("security controls alcohol", !!SECURITY_CONTROLS.alcoholMenores);
ok("security controls dark kitchen", !!SECURITY_CONTROLS.darkKitchen);

const mappingErrors = validateLegacyMapping();
ok("validateLegacyMapping", mappingErrors.length === 0, mappingErrors.slice(0, 3).join("; "));

for (const [legacy, canon] of Object.entries(LEGACY_TO_CANON)) {
  ok(`redirect ${legacy}`, busqueda.legacySubcategoriaRedirectGastronomia[legacy] === canon);
}

ok("aliases json exists", fs.existsSync(path.join(root, "scripts/gastronomia-legacy-subcategoria-aliases.json")));
ok("acta minor md exists", fs.existsSync(path.join(root, "scripts/ACTA-MINOR-CATALOGO-GASTRONOMIA-V1.md")));

console.log("\n=== QA MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 F1 schema/catálogo ===");
console.log("PASS:", pass.length);
console.log("FAIL:", fail.length);
if (fail.length) {
  fail.slice(0, 50).forEach((f) => console.log("  FAIL:", f.name, f.detail || ""));
  process.exit(1);
}
console.log("OK — catálogo + schema gastronomía sincronizados");
