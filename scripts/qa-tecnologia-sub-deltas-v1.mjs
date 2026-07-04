/**
 * QA — MP-TECNOLOGIA-DELTAS-V1 blocks + sub-deltas (32 subs).
 * node scripts/qa-tecnologia-sub-deltas-v1.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { SUB_TO_PACK, PACK_IDS } from "./tecnologia-packs-v1.mjs";
import { SUB_EXTRA_PROFILES, MODALIDAD_SERVICIO_TI, HIDE_ADULT_LEAKS } from "./tecnologia-sub-extra-fields.mjs";
import { buildTecnologiaSubDeltas } from "./tecnologia-sub-deltas-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || "falló" });
}

const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));
const rows = mapa.matrix.filter((r) => r.sectorId === "tecnologia");
const { SUB_DELTAS } = buildTecnologiaSubDeltas(rows);

ok("32 subs tecnologia mapa", rows.length === 32, String(rows.length));
ok("32 sub-deltas", Object.keys(SUB_DELTAS).length === 32, String(Object.keys(SUB_DELTAS).length));
ok("32 SUB_TO_PACK", Object.keys(SUB_TO_PACK).length === 32);
ok("32 SUB_EXTRA_PROFILES", Object.keys(SUB_EXTRA_PROFILES).length === 32);

const modalidadValues = MODALIDAD_SERVICIO_TI.map((o) => o.value);
ok("modalidad sin hotel", !modalidadValues.includes("hotel"), modalidadValues.join(","));

const deltasPath = path.join(root, "public/js/data/registro-tecnologia-sub-deltas.js");
if (fs.existsSync(deltasPath)) {
  const ctx = vm.createContext({ window: {}, globalThis: {} });
  ctx.window = ctx;
  vm.runInContext(fs.readFileSync(deltasPath, "utf8"), ctx);
  ok(
    "runtime sub-deltas loaded",
    Object.keys(ctx.window.CARIHUB_TECNOLOGIA_SUB_DELTAS || {}).length === 32
  );
} else {
  ok("runtime sub-deltas file", false, "Ejecuta generate-tecnologia-sub-deltas.mjs");
}

const blocksPath = path.join(root, "public/js/data/registro-tecnologia-blocks.js");
let api = null;
if (fs.existsSync(blocksPath)) {
  const ctx = vm.createContext({ window: {}, globalThis: {} });
  ctx.window = ctx;
  if (fs.existsSync(deltasPath)) {
    vm.runInContext(fs.readFileSync(deltasPath, "utf8"), ctx);
  }
  vm.runInContext(fs.readFileSync(blocksPath, "utf8"), ctx);
  api = ctx.window.CARIHUB_REGISTRO_TECNOLOGIA_SECTOR_BLOCKS;
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
  ok(`blockHint ${subId}`, String(d.blockHint || "").length > 10, d.blockHint);
  ok(`fieldOptions ${subId}`, extra?.fieldOptions && Object.keys(extra.fieldOptions).length > 0);
  ok(`hideFields adult ${subId}`, (d.hideFields || extra?.hideFields || []).includes("nivelServicio"));
  ok(
    `extraFields no escort ${subId}`,
    !(extra?.extraFields || []).some((f) => HIDE_ADULT_LEAKS.includes(f)),
    (extra?.extraFields || []).join(",")
  );
  ok(`colaboraciones ${subId}`, (extra?.extraFields || []).includes("colaboracionesComerciales"));
  ok(`diferenciador ${subId}`, (extra?.extraFields || []).includes("diferenciadorProfesional"));

  const modalOpts = extra?.fieldOptions?.modalidadServicioTI;
  if (modalOpts) {
    const vals = modalOpts.map((o) => (typeof o === "object" ? o.value : o));
    ok(`modalidad ${subId}`, !vals.includes("hotel"), vals.join(","));
  }

  if (api) {
    const cfg = api.buildConfig({ sectorId: "tecnologia", subcategoriaId: subId, formularioId: d.formularioId });
    ok(`buildConfig ${subId}`, !!cfg, subId);
    ok(`formulario ${subId}`, cfg.formularioId === d.formularioId, d.formularioId);
    ok(`blocks ${subId}`, cfg.blocks.length > 0);
    ok(`title ${subId}`, JSON.stringify(cfg.blocks).includes(d.blockTitle), d.blockTitle);
    ok(`hint ${subId}`, JSON.stringify(cfg.blocks).includes(d.blockHint), d.blockHint);
    cfg.obligatorios.forEach(function (key) {
      let found = false;
      cfg.blocks.forEach(function (b) {
        (b.fields || []).forEach(function (f) {
          if (f.id === key) found = true;
        });
      });
      ok(`obligatorio ${subId}:${key}`, found, key);
    });
  }
}

PACK_IDS.forEach(function (p) {
  ok(`pack cubierto ${p}`, packsSeen.has(p), `${p}:${packCounts[p] || 0}`);
});

ok("pack A count", packCounts.A === 8, String(packCounts.A));
ok("pack B count", packCounts.B === 3, String(packCounts.B));
ok("pack C count", packCounts.C === 5, String(packCounts.C));
ok("pack D count", packCounts.D === 4, String(packCounts.D));
ok("pack E count", packCounts.E === 4, String(packCounts.E));
ok("pack F count", packCounts.F === 8, String(packCounts.F));

ok("soporte rich fields", (SUB_EXTRA_PROFILES["soporte-tecnico-independiente"]?.extraFields || []).includes("serviciosReparacion"));
ok("tecnico rich fields", (SUB_EXTRA_PROFILES["tecnico-en-computadoras"]?.extraFields || []).includes("garantiaServicio"));
ok("soporte empresarial rich", (SUB_EXTRA_PROFILES["soporte-empresarial-ti"]?.extraFields || []).includes("tiempoRespuestaSoporte"));

console.log("\n=== QA MP-TECNOLOGIA SUB-DELTAS V2 ===");
console.log("PASS:", pass.length);
console.log("FAIL:", fail.length);
console.log("Pack counts:", packCounts);
if (fail.length) {
  fail.slice(0, 30).forEach((f) => console.log("  FAIL:", f.name, f.detail || ""));
  process.exit(1);
}
console.log("OK — 32 sub-deltas tecnologia");
