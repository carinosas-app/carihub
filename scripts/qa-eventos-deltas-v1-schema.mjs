/**
 * QA — MP-EVENTOS-DELTAS-V1 Fase 1 (spec + catálogo + schema).
 * node scripts/qa-eventos-deltas-v1-schema.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  CANON_SUBCATEGORIAS,
  LEGACY_TO_CANON,
  NEW_SUBCATEGORIAS,
  EVENTOS_FIELD_REGISTRY,
  ESPECIALIDADES_BY_CANON,
  SUB_DELTAS,
  SUB_TO_PACK,
  REGULATED_CANON_SUBS,
  buildPackPlantillas,
  validateLegacyMapping,
  isDeltaSufficient,
  packPlantillaKey,
  UI_IND_EVENTOS,
  UI_NEG_EVENTOS,
  CATALOG_SEMVER,
  SCHEMA_VERSION,
} from "./eventos-packs-v1.mjs";
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

const eventosMapa = mapa.matrix.filter((r) => r.sectorId === "eventos");
const eventosInd = indSchema.subcategorias.filter((s) => s.sectorId === "eventos");
const eventosNeg = negSchema.subcategorias.filter((s) => s.sectorId === "eventos");
const matrizEventos = matriz.asignaciones.filter((r) => r.sectorId === "eventos");

ok("catalog semver acta", mapa.catalogSemver === CATALOG_SEMVER || mapa.eventosLegacyRedirect);
ok("20 canon mapa eventos", eventosMapa.length === 20, String(eventosMapa.length));
ok("37 legacy mapeadas spec", Object.keys(LEGACY_TO_CANON).length === 37);
ok("9 nuevas subs spec", NEW_SUBCATEGORIAS.length === 9);
ok("legacy redirect busqueda", !!busqueda.legacySubcategoriaRedirectEventos);
ok("legacy redirect count 37", Object.keys(busqueda.legacySubcategoriaRedirectEventos || {}).length === 37);

ok("no canon quintas", !CANON_SUBCATEGORIAS.some((c) => c.subcategoriaId.includes("quinta")));
ok(
  "quintas en tiposEspacio",
  EVENTOS_FIELD_REGISTRY.tiposEspacio.opciones.includes("quinta")
);
ok(
  "fara_fara tipoAgrupacion",
  EVENTOS_FIELD_REGISTRY.tipoAgrupacion.opciones.includes("fara_fara")
);
ok(
  "fara_fara no colombiano",
  !EVENTOS_FIELD_REGISTRY.tipoAgrupacion.opciones.includes("colombiano") &&
    !EVENTOS_FIELD_REGISTRY.tipoAgrupacion.opciones.includes("vallenato")
);

for (const canon of CANON_SUBCATEGORIAS) {
  ok(`mapa ${canon.subcategoriaId}`, eventosMapa.some((r) => r.subcategoriaId === canon.subcategoriaId));
  ok(`matriz ${canon.subcategoriaId}`, matrizEventos.some((r) => r.subcategoriaId === canon.subcategoriaId));
  ok(`delta sufficient ${canon.subcategoriaId}`, isDeltaSufficient(canon.subcategoriaId));
  ok(`especialidades ${canon.subcategoriaId}`, !!ESPECIALIDADES_BY_CANON[canon.subcategoriaId]);
}

ok("schema ind eventos 8", eventosInd.length === 8, String(eventosInd.length));
ok("schema neg eventos 12", eventosNeg.length === 12, String(eventosNeg.length));

for (const sub of [...eventosInd, ...eventosNeg]) {
  const pack = SUB_TO_PACK[sub.subcategoriaId];
  ok(`pack map ${sub.subcategoriaId}`, !!pack);
  ok(
    `arquetipo pack ${sub.subcategoriaId}`,
    sub.arquetipo === packPlantillaKey(pack),
    `${sub.arquetipo} vs ${packPlantillaKey(pack)}`
  );
  ok(`deltaPack ${sub.subcategoriaId}`, sub.delta?.deltaPack === pack);
  ok(`obligatoriosDelta ${sub.subcategoriaId}`, (sub.delta?.obligatoriosDelta || []).length >= 4);
  const schema = eventosNeg.some((x) => x.subcategoriaId === sub.subcategoriaId) ? negSchema : indSchema;
  const merged = mergeRegistrationSchema(schema, sub);
  ok(`merge fields ${sub.subcategoriaId}`, (merged.obligatoriosExtra || []).length > 0);
}

const pirotecnia = eventosNeg.find((s) => s.subcategoriaId === "pirotecnia-efectos-especiales");
ok("pirotecnia regulada delta", pirotecnia?.delta?.regulada === true);
ok("pirotecnia admin review", pirotecnia?.delta?.requiresAdminReview === true);
ok("pirotecnia permiso field", !!EVENTOS_FIELD_REGISTRY.licenciaPirotecnia);

const seguridad = eventosNeg.find((s) => s.subcategoriaId === "seguridad-eventos");
ok("seguridad regulada", seguridad?.delta?.regulada === true);
ok("seguridad admin review", seguridad?.delta?.requiresAdminReview === true);

const shows = eventosInd.find((s) => s.subcategoriaId === "shows-para-eventos");
ok("shows coherencia sensible", shows?.delta?.coherenciaSensible === true);
ok("shows contenidoSensible field", !!EVENTOS_FIELD_REGISTRY.contenidoSensible);

for (const foodId of ["banquetes-catering-eventos", "food-trucks-carritos-eventos", "pasteles-reposteria-eventos"]) {
  const sub = eventosNeg.find((s) => s.subcategoriaId === foodId);
  ok(`${foodId} permiso alimentos`, sub?.delta?.obligatoriosDelta?.includes("permisoManipulacionAlimentos"));
}

ok("valet poliza", SUB_DELTAS["valet-parking-eventos"].obligatoriosDelta.includes("polizaResponsabilidadValet"));
ok(
  "transporte poliza",
  SUB_DELTAS["transporte-eventos"].obligatoriosDelta.includes("polizaTransporte")
);

const packs = buildPackPlantillas();
ok("12 plantillas pack", Object.keys(packs).length === 12);
ok("FX plantilla regulada", packs[packPlantillaKey("FX")]?.requiresAdminReview === true);
ok("SECURITY plantilla regulada", packs[packPlantillaKey("SECURITY")]?.requiresAdminReview === true);

ok("fieldRegistry pirotecnia", "licenciaPirotecnia" in indSchema.meta.fieldRegistry || "licenciaPirotecnia" in negSchema.meta.fieldRegistry);
ok("ui_ind_eventos catalogo", matriz.catalogoUi.some((u) => u.formularioUiId === UI_IND_EVENTOS));
ok("ui_neg_eventos catalogo", matriz.catalogoUi.some((u) => u.formularioUiId === UI_NEG_EVENTOS));
ok(
  "ui_ind count 8",
  matrizEventos.filter((r) => r.formularioUiId === UI_IND_EVENTOS).length === 8
);
ok(
  "ui_neg count 12",
  matrizEventos.filter((r) => r.formularioUiId === UI_NEG_EVENTOS).length === 12
);

for (const neu of NEW_SUBCATEGORIAS) {
  ok(`nueva mapa ${neu.subcategoriaId}`, eventosMapa.some((r) => r.subcategoriaId === neu.subcategoriaId));
  ok(`nueva schema ${neu.subcategoriaId}`, [...eventosInd, ...eventosNeg].some((s) => s.subcategoriaId === neu.subcategoriaId));
}

for (const canon of CANON_SUBCATEGORIAS) {
  const inSectores =
    sectoresJs.includes(canon.nombre) ||
    sectoresJs.includes(canon.nombre.replace(/'/g, "\\'"));
  ok(`sectores js ${canon.subcategoriaId}`, inSectores);
}

const mappingErrors = validateLegacyMapping();
ok("validateLegacyMapping", mappingErrors.length === 0, mappingErrors.slice(0, 3).join("; "));

for (const [legacy, canon] of Object.entries(LEGACY_TO_CANON)) {
  ok(`redirect ${legacy}`, busqueda.legacySubcategoriaRedirectEventos[legacy] === canon);
}

ok("schema version bumped", indSchema.versionSchema === SCHEMA_VERSION);
ok("neg schema version", negSchema.versionSchema === SCHEMA_VERSION);

console.log("\n=== QA MP-EVENTOS-DELTAS-V1 F1 schema/catálogo ===");
console.log("PASS:", pass.length);
console.log("FAIL:", fail.length);
if (fail.length) {
  fail.slice(0, 50).forEach((f) => console.log("  FAIL:", f.name, f.detail || ""));
  process.exit(1);
}
console.log("OK — catálogo + schema eventos sincronizados");
