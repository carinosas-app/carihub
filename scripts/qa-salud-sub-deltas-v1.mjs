/**
 * QA — MP-SALUD-DELTAS-V2 blocks + sub-deltas (50 subs).
 * node scripts/qa-salud-sub-deltas-v1.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { SUB_TO_PACK } from "./salud-packs-v1.mjs";
import { SUB_EXTRA_PROFILES, MODALIDAD_CLINICA } from "./salud-sub-extra-fields.mjs";
import { buildSaludSubDeltas } from "./salud-sub-deltas-v1.mjs";
import { HIDE_ADULT_LEAKS } from "./registro-cross-sector-policy.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || "falló" });
}

const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));
const rows = mapa.matrix.filter((r) => r.sectorId === "salud");
const { SUB_DELTAS } = buildSaludSubDeltas(rows);

ok("50 subs salud mapa", rows.length === 50);
ok("50 sub-deltas", Object.keys(SUB_DELTAS).length === 50);
ok("50 SUB_EXTRA_PROFILES", Object.keys(SUB_EXTRA_PROFILES).length === 50);

const modalidadValues = MODALIDAD_CLINICA.map((o) => o.value);
ok("modalidad sin hotel", !modalidadValues.includes("hotel"), modalidadValues.join(","));

const deltasPath = path.join(root, "public/js/data/registro-salud-sub-deltas.js");
const blocksPath = path.join(root, "public/js/data/registro-salud-blocks.js");
let api = null;

if (fs.existsSync(deltasPath) && fs.existsSync(blocksPath)) {
  const ctx = vm.createContext({ window: {}, globalThis: {} });
  ctx.window = ctx;
  vm.runInContext(fs.readFileSync(deltasPath, "utf8"), ctx);
  vm.runInContext(fs.readFileSync(blocksPath, "utf8"), ctx);
  api = ctx.window.CARIHUB_REGISTRO_SALUD_SECTOR_BLOCKS;
  ok("blocks module loaded", !!api);
} else {
  ok("runtime files exist", false, "Regenera deltas y blocks");
}

const packsSeen = new Set();

for (const subId of Object.keys(SUB_TO_PACK)) {
  const d = SUB_DELTAS[subId];
  const extra = SUB_EXTRA_PROFILES[subId];
  const fid = d.formularioId;
  packsSeen.add(d.deltaPack);

  ok(`pack ${subId}`, d.deltaPack === SUB_TO_PACK[subId], d.deltaPack);
  ok(`canon ${subId}`, d.canonSubcategoriaId === subId);
  ok(`formulario ${subId}`, d.formularioId === fid, fid);
  ok(`blockTitle ${subId}`, String(d.blockTitle || "").length > 2, d.blockTitle);
  ok(`blockHint ${subId}`, String(d.blockHint || "").length > 10, d.blockHint);
  ok(`hideFields adult ${subId}`, (d.hideFields || extra?.hideFields || []).includes("nivelServicio"));
  ok(
    `extraFields no escort ${subId}`,
    !(extra?.extraFields || []).some((f) => HIDE_ADULT_LEAKS.includes(f)),
    (extra?.extraFields || []).join(",")
  );
  ok(`diferenciador ${subId}`, (extra?.extraFields || []).includes("diferenciadorSalud"));

  const modalOpts = extra?.fieldOptions?.modalidadAtencionProfesional ||
    extra?.fieldOptions?.modalidadConsulta;
  if (modalOpts) {
    const vals = modalOpts.map((o) => (typeof o === "object" ? o.value : o));
    ok(`modalidad ${subId}`, !vals.includes("hotel") && !vals.includes("motel"), vals.join(","));
  }

  if (api) {
    const cfg = api.buildConfig({ sectorId: "salud", subcategoriaId: subId, formularioId: fid });
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

["A", "B", "C", "D", "E", "F", "G", "H"].forEach(function (p) {
  ok("pack cubierto " + p, packsSeen.has(p), [...packsSeen].join(","));
});

ok("medicos-generales referencias", (SUB_EXTRA_PROFILES["medicos-generales"]?.extraFields || []).includes("referenciasInterconsulta"));
ok("psicologos sin traslado", (SUB_EXTRA_PROFILES.psicologos?.hideFields || []).includes("modalidadTraslado"));
ok("laboratorio domicilio", (SUB_EXTRA_PROFILES["laboratorios-clinicos"]?.extraFields || []).includes("tomaMuestrasDomicilio"));
ok("hospital camas", (SUB_EXTRA_PROFILES["hospitales-privados"]?.extraFields || []).includes("camasHospital"));

console.log("\n=== QA MP-SALUD SUB-DELTAS V2 ===");
console.log("PASS:", pass.length);
console.log("FAIL:", fail.length);
if (fail.length) {
  fail.slice(0, 30).forEach((f) => console.log("  FAIL:", f.name, f.detail || ""));
  process.exit(1);
}
console.log("OK — 50 sub-deltas salud");
