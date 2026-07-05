/**
 * QA — MP-BIENESTAR sub-deltas V2 (60 subs).
 * node scripts/qa-bienestar-sub-deltas-v1.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { SUB_TO_PACK, PACK_H_SUBS } from "./bienestar-packs-v1.mjs";
import { buildBienestarSubDeltas } from "./bienestar-sub-deltas-v1.mjs";
import { HIDE_ADULT_LEAKS } from "./registro-cross-sector-policy.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || "falló" });
}

const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));
const rows = mapa.matrix.filter((r) => r.sectorId === "bienestar");
const { SUB_CANON_META, SUB_DELTAS } = buildBienestarSubDeltas(rows);

ok("60 sub-deltas generados", Object.keys(SUB_DELTAS).length === 60, String(Object.keys(SUB_DELTAS).length));
ok("60 SUB_TO_PACK", Object.keys(SUB_TO_PACK).length === 60);

const ctx = vm.createContext({ window: {}, globalThis: {} });
ctx.window = ctx;
vm.runInContext(
  fs.readFileSync(path.join(root, "public/js/data/registro-bienestar-sub-deltas.js"), "utf8"),
  ctx,
  { filename: "registro-bienestar-sub-deltas.js" }
);
vm.runInContext(
  fs.readFileSync(path.join(root, "public/js/data/registro-bienestar-blocks.js"), "utf8"),
  ctx,
  { filename: "registro-bienestar-blocks.js" }
);
const api = ctx.window.CARIHUB_REGISTRO_BIENESTAR_SECTOR_BLOCKS;

ok("runtime sub-deltas loaded", Object.keys(ctx.window.CARIHUB_BIENESTAR_SUB_DELTAS || {}).length === 60);

const packsSeen = new Set();

for (const subId of Object.keys(SUB_TO_PACK)) {
  const src = SUB_DELTAS[subId];
  const rt = ctx.window.CARIHUB_BIENESTAR_SUB_DELTAS[subId];
  packsSeen.add(src?.deltaPack);

  ok(`sub-delta ${subId}`, !!src && !!rt, subId);
  ok(`pack match ${subId}`, src?.deltaPack === SUB_TO_PACK[subId], src?.deltaPack);
  ok(`blockTitle ${subId}`, String(src?.blockTitle || "").length > 2, src?.blockTitle);
  ok(`blockHint ${subId}`, String(src?.blockHint || "").length > 10, src?.blockHint);
  ok(`deltaFields ${subId}`, Array.isArray(src?.deltaFields) && src.deltaFields.length > 0);
  ok(`obligatoriosDelta ${subId}`, Array.isArray(src?.obligatoriosDelta) && src.obligatoriosDelta.length > 0);
  ok(`hideFields adult ${subId}`, (src?.hideFields || []).includes("nivelServicio"));
  ok(
    `extraFields no escort ${subId}`,
    !(src?.extraFields || []).some((f) => HIDE_ADULT_LEAKS.includes(f)),
    (src?.extraFields || []).join(",")
  );

  if (!PACK_H_SUBS.has(subId) && !src?.negocioRetail) {
    ok(`colaboraciones ${subId}`, (src?.extraFields || []).includes("colaboracionesComerciales"));
    ok(`diferenciador ${subId}`, (src?.extraFields || []).includes("diferenciadorProfesional"));
  }
  if (PACK_H_SUBS.has(subId)) {
    ok(`H disclaimer ${subId}`, (src?.obligatoriosDelta || []).includes("disclaimerRegulado"));
    ok(`H no colab ${subId}`, !(src?.extraFields || []).includes("colaboracionesComerciales"));
  }

  const cfg = api.buildConfig({
    sectorId: "bienestar",
    subcategoriaId: subId,
    formularioId: subId.startsWith("venta-de-") ? "negocio_empresa" : "persona_independiente",
  });
  ok(`buildConfig ${subId}`, !!cfg, subId);
  ok(`canonSub ${subId}`, cfg?.canonSubcategoriaId === subId, cfg?.canonSubcategoriaId);

  const blob = JSON.stringify(cfg.blocks);
  ok(`block title applied ${subId}`, blob.includes(src.blockTitle), src.blockTitle);
  ok(`block hint applied ${subId}`, blob.includes(src.blockHint), src.blockHint);

  if (src.aliasPlaceholder && !cfg.negocioRetail) {
    ok(`alias placeholder ${subId}`, blob.includes(src.aliasPlaceholder), src.aliasPlaceholder);
  }
  if (src.fieldOptions?.modalidadesTerapia?.[0]) {
    ok(`modalidades options ${subId}`, blob.includes(src.fieldOptions.modalidadesTerapia[0]));
  }
}

["A", "B", "C", "D", "E", "F", "G", "H"].forEach(function (p) {
  ok("pack cubierto " + p, packsSeen.has(p), [...packsSeen].join(","));
});

ok("yoga enrich", String(SUB_DELTAS.yoga?.blockHint || "").includes("Yoga"));
ok("reiki colab", (SUB_DELTAS.reiki?.extraFields || []).includes("colaboracionesComerciales"));
ok("ayahuasca regulada", String(SUB_DELTAS["ceremonias-ayahuasca-rape-plantas-de-poder"]?.blockHint || "").includes("Prohibida"));

console.log("\n=== QA MP-BIENESTAR SUB-DELTAS V2 ===");
console.log("PASS:", pass.length);
console.log("FAIL:", fail.length);
if (fail.length) {
  fail.slice(0, 30).forEach((f) => console.log("  FAIL:", f.name, f.detail || ""));
  process.exit(1);
}
console.log("OK — 60 sub-deltas bienestar");
