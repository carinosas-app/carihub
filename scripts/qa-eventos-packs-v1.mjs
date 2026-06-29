/**
 * QA — MP-EVENTOS-DELTAS-V1 Fase 0 extendida (spec only, sin schema/runtime).
 * node scripts/qa-eventos-packs-v1.mjs
 */
import {
  MP_ID,
  SECTOR_ID,
  PACK_IDS,
  CANON_SUBCATEGORIAS,
  LEGACY_TO_CANON,
  HOME_LEGACY_TO_CANON,
  SUB_TO_PACK,
  NEW_SUBCATEGORIAS,
  EVENTOS_FIELD_REGISTRY,
  ESPECIALIDADES_BY_CANON,
  CONDITIONAL_RULES,
  RISK_PROFILE_BY_CANON,
  SUB_DELTAS,
  GENERIC_ONLY_FORBIDDEN,
  REGULATED_CANON_SUBS,
  buildPackPlantillas,
  validateLegacyMapping,
  isDeltaSufficient,
  packPlantillaKey,
} from "./eventos-packs-v1.mjs";

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || "falló" });
}

ok("MP_ID definido", MP_ID === "MP-EVENTOS-DELTAS-V1");
ok("SECTOR_ID eventos", SECTOR_ID === "eventos");
ok("20 canon subs", CANON_SUBCATEGORIAS.length === 20, String(CANON_SUBCATEGORIAS.length));
ok("12 packs", PACK_IDS.length === 12, String(PACK_IDS.length));
ok("37 legacy → canon", Object.keys(LEGACY_TO_CANON).length === 37, String(Object.keys(LEGACY_TO_CANON).length));
ok("9 subs nuevas", NEW_SUBCATEGORIAS.length === 9, String(NEW_SUBCATEGORIAS.length));

for (const c of CANON_SUBCATEGORIAS) {
  ok(`canon pack ${c.subcategoriaId}`, SUB_TO_PACK[c.subcategoriaId] === c.pack);
  ok(`especialidades ${c.subcategoriaId}`, !!ESPECIALIDADES_BY_CANON[c.subcategoriaId]);
  ok(`risk profile ${c.subcategoriaId}`, !!RISK_PROFILE_BY_CANON[c.subcategoriaId]);
  ok(`delta sufficient ${c.subcategoriaId}`, isDeltaSufficient(c.subcategoriaId));
  const delta = SUB_DELTAS[c.subcategoriaId];
  ok(`obligatorios delta ${c.subcategoriaId}`, (delta?.obligatoriosDelta?.length || 0) >= 4);
  ok(`preview ficha ${c.subcategoriaId}`, !!delta?.previewFicha);
  const onlyGeneric = delta.deltaFields.every((f) => GENERIC_ONLY_FORBIDDEN.includes(f));
  ok(`no solo genéricos ${c.subcategoriaId}`, !onlyGeneric);
}

ok("grupos fara_fara en tipoAgrupacion", EVENTOS_FIELD_REGISTRY.tipoAgrupacion.opciones.includes("fara_fara"));
ok("quintas en tiposEspacio", EVENTOS_FIELD_REGISTRY.tiposEspacio.opciones.includes("quinta"));

const faraRule = CONDITIONAL_RULES.find((r) => r.id === "FARA_FARA_FORMATO");
ok("condicional Fara Fara", !!faraRule && faraRule.require.includes("descripcionFormatoFaraFara"));

const showSensible = CONDITIONAL_RULES.find((r) => r.id === "SHOW_SENSIBLE");
ok("condicional show sensible", !!showSensible);

const stripperRule = CONDITIONAL_RULES.find((r) => r.id === "SHOW_STRIPPER");
ok("condicional stripper", !!stripperRule);

ok("pirotecnia regulada", REGULATED_CANON_SUBS.has("pirotecnia-efectos-especiales"));
ok("seguridad regulada", REGULATED_CANON_SUBS.has("seguridad-eventos"));

const packs = buildPackPlantillas();
ok("12 plantillas pack", Object.keys(packs).length === 12, String(Object.keys(packs).length));
ok("plantilla FX regulada", packs[packPlantillaKey("FX")]?.requiresAdminReview === true);
ok("plantilla SECURITY regulada", packs[packPlantillaKey("SECURITY")]?.requiresAdminReview === true);

for (const neu of NEW_SUBCATEGORIAS) {
  ok(`nueva en canon ${neu.subcategoriaId}`, CANON_SUBCATEGORIAS.some((c) => c.subcategoriaId === neu.subcategoriaId));
}

ok("home legacy 10 refs", Object.keys(HOME_LEGACY_TO_CANON).length === 10);

const mappingErrors = validateLegacyMapping();
ok("validateLegacyMapping sin errores", mappingErrors.length === 0, mappingErrors.slice(0, 5).join("; "));

console.log("\n=== QA MP-EVENTOS-DELTAS-V1 F0 ===");
console.log("PASS:", pass.length);
console.log("FAIL:", fail.length);
if (fail.length) {
  fail.slice(0, 40).forEach((f) => console.log("  FAIL:", f.name, f.detail || ""));
  process.exit(1);
}
console.log("OK — eventos-packs-v1.mjs fuente de verdad");
