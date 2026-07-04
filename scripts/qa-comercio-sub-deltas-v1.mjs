/**
 * QA — MP-COMERCIO-DELTAS-V1 blocks + sub-deltas (9 subs).
 * node scripts/qa-comercio-sub-deltas-v1.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { SUB_TO_PACK, PACK_IDS } from "./comercio-packs-v1.mjs";
import {
  SUB_EXTRA_PROFILES,
  MODALIDAD_VENTA_COMERCIO,
  HIDE_ADULT_LEAKS,
} from "./comercio-sub-extra-fields.mjs";
import { buildComercioSubDeltas } from "./comercio-sub-deltas-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || "falló" });
}

const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));
const rows = mapa.matrix.filter((r) => r.sectorId === "comercio");
const { SUB_DELTAS } = buildComercioSubDeltas(rows);

ok("9 subs comercio mapa", rows.length === 9, String(rows.length));
ok("9 sub-deltas", Object.keys(SUB_DELTAS).length === 9, String(Object.keys(SUB_DELTAS).length));
ok("9 SUB_TO_PACK", Object.keys(SUB_TO_PACK).length === 9);
ok("9 SUB_EXTRA_PROFILES", Object.keys(SUB_EXTRA_PROFILES).length === 9);

const modalidadValues = MODALIDAD_VENTA_COMERCIO.map((o) => o.value);
ok("modalidad sin hotel", !modalidadValues.includes("hotel"), modalidadValues.join(","));

const deltasPath = path.join(root, "public/js/data/registro-comercio-sub-deltas.js");
if (fs.existsSync(deltasPath)) {
  const ctx = vm.createContext({ window: {}, globalThis: {} });
  ctx.window = ctx;
  vm.runInContext(fs.readFileSync(deltasPath, "utf8"), ctx);
  ok(
    "runtime sub-deltas loaded",
    Object.keys(ctx.window.CARIHUB_COMERCIO_SUB_DELTAS || {}).length === 9
  );
} else {
  ok("runtime sub-deltas file", false, "Ejecuta generate-comercio-sub-deltas.mjs");
}

const blocksPath = path.join(root, "public/js/data/registro-comercio-blocks.js");
let api = null;
if (fs.existsSync(blocksPath)) {
  const ctx = vm.createContext({ window: {}, globalThis: {} });
  ctx.window = ctx;
  if (fs.existsSync(deltasPath)) {
    vm.runInContext(fs.readFileSync(deltasPath, "utf8"), ctx);
  }
  vm.runInContext(fs.readFileSync(blocksPath, "utf8"), ctx);
  api = ctx.window.CARIHUB_REGISTRO_COMERCIO_SECTOR_BLOCKS;
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
  if (subId !== "distribuidoras") {
    ok(`colaboraciones ${subId}`, (extra?.extraFields || []).includes("colaboracionesComerciales"));
  }
  ok(`diferenciador ${subId}`, (extra?.extraFields || []).includes("diferenciadorComercio"));

  if (api) {
    const cfg = api.buildConfig({
      sectorId: "comercio",
      subcategoriaId: subId,
      formularioId: d.formularioId,
    });
    ok(`buildConfig ${subId}`, !!cfg, subId);
    ok(`formulario ${subId}`, cfg.formularioId === d.formularioId, d.formularioId);
    ok(`blocks ${subId}`, cfg.blocks.length > 0);
    ok(`title ${subId}`, JSON.stringify(cfg.blocks).includes(d.blockTitle), d.blockTitle);
    ok(`hint ${subId}`, JSON.stringify(cfg.blocks).includes(d.blockHint), d.blockHint);
    ok(`fotosMin ${subId}`, cfg.fotosMin === 3, String(cfg.fotosMin));
    cfg.obligatorios.forEach(function (key) {
      let found = false;
      cfg.blocks.forEach(function (b) {
        (b.fields || []).forEach(function (f) {
          if (f.id === key) found = true;
        });
      });
      if (key === "geo") return;
      ok(`obligatorio field ${subId}:${key}`, found || ["alias", "nombreComercial", "geo"].includes(key), key);
    });
  }
}

PACK_IDS.forEach(function (pid) {
  ok(`pack ${pid} usado`, packsSeen.has(pid), String(packCounts[pid] || 0));
});

console.log("\n=== QA COMERCIO V1 ===");
console.log("PASS:", pass.length);
console.log("FAIL:", fail.length);
if (fail.length) {
  fail.slice(0, 30).forEach(function (f) {
    console.log(" FAIL:", f.name, f.detail || "");
  });
  if (fail.length > 30) console.log("… y", fail.length - 30, "más");
  process.exit(1);
}
console.log("All checks passed.");
