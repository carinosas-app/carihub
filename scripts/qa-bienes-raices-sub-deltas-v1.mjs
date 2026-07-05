/**
 * QA — MP-BIENES-RAICES-DELTAS-V1 blocks + sub-deltas (27 subs).
 * node scripts/qa-bienes-raices-sub-deltas-v1.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { SUB_TO_PACK, PACK_IDS, PACK_NEGOCIO_SUBS } from "./bienes-raices-packs-v1.mjs";
import {
  SUB_EXTRA_PROFILES,
  MODALIDAD_OPERACION_INMOBILIARIA,
  HIDE_ADULT_LEAKS,
} from "./bienes-raices-sub-extra-fields.mjs";
import { buildBienesRaicesSubDeltas } from "./bienes-raices-sub-deltas-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || "falló" });
}

const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));
const rows = mapa.matrix.filter((r) => r.sectorId === "bienes-raices");
const { SUB_DELTAS, SUB_CANON_META } = buildBienesRaicesSubDeltas(rows);

ok("27 subs bienes-raices mapa", rows.length === 27, String(rows.length));
ok("27 sub-deltas", Object.keys(SUB_DELTAS).length === 27, String(Object.keys(SUB_DELTAS).length));
ok("27 SUB_TO_PACK", Object.keys(SUB_TO_PACK).length === 27);
ok("27 SUB_EXTRA_PROFILES", Object.keys(SUB_EXTRA_PROFILES).length === 27);
ok("5 packs", PACK_IDS.length === 5, PACK_IDS.join(","));

const modalidadValues = MODALIDAD_OPERACION_INMOBILIARIA.map((o) => o.value);
ok("modalidad sin hotel escort", !modalidadValues.includes("hotel"), modalidadValues.join(","));

const deltasPath = path.join(root, "public/js/data/registro-bienes-raices-sub-deltas.js");
if (fs.existsSync(deltasPath)) {
  const ctx = vm.createContext({ window: {}, globalThis: {} });
  ctx.window = ctx;
  vm.runInContext(fs.readFileSync(deltasPath, "utf8"), ctx);
  ok(
    "runtime sub-deltas loaded",
    Object.keys(ctx.window.CARIHUB_BIENES_RAICES_SUB_DELTAS || {}).length === 27
  );
} else {
  ok("runtime sub-deltas file", false, "Ejecuta generate-bienes-raices-sub-deltas.mjs");
}

const blocksPath = path.join(root, "public/js/data/registro-bienes-raices-blocks.js");
let api = null;
if (fs.existsSync(blocksPath)) {
  const ctx = vm.createContext({ window: {}, globalThis: {} });
  ctx.window = ctx;
  if (fs.existsSync(deltasPath)) {
    vm.runInContext(fs.readFileSync(deltasPath, "utf8"), ctx);
  }
  vm.runInContext(fs.readFileSync(blocksPath, "utf8"), ctx);
  api = ctx.window.CARIHUB_REGISTRO_BIENES_RAICES_SECTOR_BLOCKS;
  ok("blocks module loaded", !!api);
}

const packsSeen = new Set();
const packCounts = {};

for (const subId of Object.keys(SUB_TO_PACK)) {
  const d = SUB_DELTAS[subId];
  const extra = SUB_EXTRA_PROFILES[subId];
  const pack = SUB_TO_PACK[subId];
  const mapRow = rows.find((r) => r.subcategoriaId === subId);
  const meta = SUB_CANON_META[subId];
  packsSeen.add(pack);
  packCounts[pack] = (packCounts[pack] || 0) + 1;

  ok(`pack ${subId}`, d.deltaPack === pack, d.deltaPack);
  ok(`canon ${subId}`, d.canonSubcategoriaId === subId);
  ok(`formulario ${subId}`, d.formularioId === mapRow?.formularioId, `${d.formularioId} vs ${mapRow?.formularioId}`);
  ok(`fotosMin meta ${subId}`, meta?.fotosMin === (mapRow?.fotos || 3), String(meta?.fotosMin));
  ok(`blockTitle ${subId}`, String(d.blockTitle || "").length > 2, d.blockTitle);
  ok(`blockHint ${subId}`, String(d.blockHint || "").length > 10, d.blockHint);
  ok(`fieldOptions ${subId}`, extra?.fieldOptions && Object.keys(extra.fieldOptions).length > 0);
  ok(`hideFields adult ${subId}`, (d.hideFields || extra?.hideFields || []).includes("nivelServicio"));
  ok(
    `extraFields no escort ${subId}`,
    !(extra?.extraFields || []).some((f) => HIDE_ADULT_LEAKS.includes(f)),
    (extra?.extraFields || []).join(",")
  );
  ok(`colaboraciones ${subId}`, (extra?.extraFields || []).includes("colaboracionesComerciales"));
  ok(`diferenciador ${subId}`, (extra?.extraFields || []).includes("diferenciadorInmobiliario"));

  if (PACK_NEGOCIO_SUBS.has(subId)) {
    ok(`negocio ${subId}`, d.negocioLocal === true);
    ok(`formulario negocio ${subId}`, d.formularioId === "negocio_empresa");
  } else {
    ok(`persona ${subId}`, d.personaIndependiente === true);
    ok(`formulario persona ${subId}`, d.formularioId === "persona_independiente");
  }

  const modalOpts = extra?.fieldOptions?.modalidadOperacionInmobiliaria;
  if (modalOpts) {
    const vals = modalOpts.map((o) => (typeof o === "object" ? o.value : o));
    ok(`modalidad ${subId}`, !vals.includes("hotel"), vals.join(","));
  }

  if (api) {
    const cfg = api.buildConfig({
      sectorId: "bienes-raices",
      subcategoriaId: subId,
      formularioId: d.formularioId,
    });
    ok(`buildConfig ${subId}`, !!cfg, subId);
    ok(`buildConfig formulario ${subId}`, cfg?.formularioId === d.formularioId, cfg?.formularioId);
    ok(`buildConfig pack ${subId}`, cfg?.deltaPack === pack, cfg?.deltaPack);
    ok(`buildConfig sector ${subId}`, cfg?.sectorId === "bienes-raices");
    ok(`buildConfig blocks ${subId}`, Array.isArray(cfg?.blocks) && cfg.blocks.length > 0);
    ok(`buildConfig fotosMin ${subId}`, cfg?.fotosMin === (mapRow?.fotos || 3), String(cfg?.fotosMin));
    const blockIds = (cfg?.blocks || []).map((b) => b.id).join(",");
    if (PACK_NEGOCIO_SUBS.has(subId)) {
      ok(`negocio base ${subId}`, blockIds.includes("inmoNegocioBase"), blockIds);
    } else {
      ok(`persona base ${subId}`, blockIds.includes("inmoBase"), blockIds);
    }
  }
}

for (const pack of PACK_IDS) {
  ok(`pack count ${pack}`, packCounts[pack] > 0, String(packCounts[pack] || 0));
}

console.log(`\n=== QA BIENES-RAICES V1 ===`);
console.log(`PASS: ${pass.length}`);
console.log(`FAIL: ${fail.length}`);
if (fail.length) {
  fail.slice(0, 20).forEach((f) => console.log("  FAIL:", f.name, f.detail || ""));
  if (fail.length > 20) console.log(`  ... y ${fail.length - 20} más`);
  process.exit(1);
}
console.log("ALL PASS");
