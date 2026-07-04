/**
 * QA — MP-PROFESIONALES-DELTAS-V1 blocks + sub-deltas (50 subs).
 * node scripts/qa-profesionales-sub-deltas-v1.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { SUB_TO_PACK, PACK_IDS } from "./profesionales-packs-v1.mjs";
import { SUB_EXTRA_PROFILES, MODALIDAD_PROFESIONAL, HIDE_ESCORT_LEAKS } from "./profesionales-sub-extra-fields.mjs";
import { buildProfesionalesSubDeltas } from "./profesionales-sub-deltas-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || "falló" });
}

const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));
const rows = mapa.matrix.filter((r) => r.sectorId === "profesionales");
const { SUB_DELTAS } = buildProfesionalesSubDeltas(rows);

ok("50 subs profesionales mapa", rows.length === 50, String(rows.length));
ok("50 sub-deltas", Object.keys(SUB_DELTAS).length === 50, String(Object.keys(SUB_DELTAS).length));
ok("50 SUB_TO_PACK", Object.keys(SUB_TO_PACK).length === 50);
ok("50 SUB_EXTRA_PROFILES", Object.keys(SUB_EXTRA_PROFILES).length === 50);

const modalidadValues = MODALIDAD_PROFESIONAL.map((o) => o.value);
ok("modalidad sin hotel", !modalidadValues.includes("hotel"), modalidadValues.join(","));

const deltasPath = path.join(root, "public/js/data/registro-profesionales-sub-deltas.js");
if (fs.existsSync(deltasPath)) {
  const ctx = vm.createContext({ window: {}, globalThis: {} });
  ctx.window = ctx;
  vm.runInContext(fs.readFileSync(deltasPath, "utf8"), ctx);
  ok(
    "runtime sub-deltas loaded",
    Object.keys(ctx.window.CARIHUB_PROFESIONALES_SUB_DELTAS || {}).length === 50
  );
} else {
  ok("runtime sub-deltas file", false, "Ejecuta generate-profesionales-sub-deltas.mjs");
}

const blocksPath = path.join(root, "public/js/data/registro-profesionales-blocks.js");
let api = null;
if (fs.existsSync(blocksPath)) {
  const ctx = vm.createContext({ window: {}, globalThis: {} });
  ctx.window = ctx;
  if (fs.existsSync(deltasPath)) {
    vm.runInContext(fs.readFileSync(deltasPath, "utf8"), ctx);
  }
  vm.runInContext(fs.readFileSync(blocksPath, "utf8"), ctx);
  api = ctx.window.CARIHUB_REGISTRO_PROFESIONALES_SECTOR_BLOCKS;
  ok("blocks module loaded", !!api);
}

const packsSeen = new Set();
const packCounts = {};

for (const subId of Object.keys(SUB_TO_PACK)) {
  const d = SUB_DELTAS[subId];
  const extra = SUB_EXTRA_PROFILES[subId];
  const pack = SUB_TO_PACK[subId];
  packsSeen.add(pack);
  packCounts[pack] = (packCounts[pack] || 0) + 1;

  ok(`pack ${subId}`, d.deltaPack === pack, d.deltaPack);
  ok(`canon ${subId}`, d.canonSubcategoriaId === subId);
  ok(`blockTitle ${subId}`, String(d.blockTitle || "").length > 2, d.blockTitle);
  ok(`fieldOptions ${subId}`, extra?.fieldOptions && Object.keys(extra.fieldOptions).length > 0);
  ok(
    `extraFields no escort ${subId}`,
    !(extra?.extraFields || []).some((f) => HIDE_ESCORT_LEAKS.includes(f)),
    (extra?.extraFields || []).join(",")
  );

  const modalOpts = extra?.fieldOptions?.modalidadAtencionProfesional;
  if (modalOpts) {
    const vals = modalOpts.map((o) => (typeof o === "object" ? o.value : o));
    ok(`modalidad ${subId}`, !vals.includes("hotel"), vals.join(","));
  }

  if (api) {
    const cfg = api.buildConfig({ sectorId: "profesionales", subcategoriaId: subId, formularioId: d.formularioId });
    ok(`buildConfig ${subId}`, !!cfg, subId);
    ok(`formulario ${subId}`, cfg.formularioId === d.formularioId, d.formularioId);
    ok(`blocks ${subId}`, cfg.blocks.length > 0);
    ok(`title ${subId}`, JSON.stringify(cfg.blocks).includes(d.blockTitle), d.blockTitle);
  }
}

PACK_IDS.forEach(function (p) {
  ok(`pack cubierto ${p}`, packsSeen.has(p), `${p}:${packCounts[p] || 0}`);
});

ok("pack A count", packCounts.A === 3, String(packCounts.A));
ok("pack B count", packCounts.B === 4, String(packCounts.B));
ok("pack C count", packCounts.C === 5, String(packCounts.C));
ok("pack D count", packCounts.D === 4, String(packCounts.D));
ok("pack E count", packCounts.E === 8, String(packCounts.E));
ok("pack F count", packCounts.F === 9, String(packCounts.F));
ok("pack G count", packCounts.G === 10, String(packCounts.G));
ok("pack H count", packCounts.H === 7, String(packCounts.H));

console.log("\n=== QA MP-PROFESIONALES SUB-DELTAS V1 ===");
console.log("PASS:", pass.length);
console.log("FAIL:", fail.length);
console.log("Pack counts:", packCounts);
if (fail.length) {
  fail.slice(0, 25).forEach((f) => console.log("  FAIL:", f.name, f.detail || ""));
  process.exit(1);
}
console.log("OK — 50 sub-deltas profesionales");
