/**
 * QA — MP-GASTRONOMIA SUB-DELTAS V2 (24 canon).
 * node scripts/qa-gastronomia-sub-deltas-v2.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { CANON_SUBCATEGORIAS, SUB_DELTAS } from "./gastronomia-packs-v1.mjs";
import { SUB_ENRICHMENT_V2 } from "./gastronomia-sub-enrichment-v2.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || "falló" });
}

ok("24 enrichment keys", Object.keys(SUB_ENRICHMENT_V2).length === 24);
ok("24 canon subs", CANON_SUBCATEGORIAS.length === 24);

const ctx = vm.createContext({ window: {}, globalThis: {} });
ctx.window = ctx;
vm.runInContext(
  fs.readFileSync(path.join(root, "public/js/data/registro-gastronomia-blocks.js"), "utf8"),
  ctx,
  { filename: "registro-gastronomia-blocks.js" }
);
const api = ctx.window.CARIHUB_REGISTRO_GASTRONOMIA_SECTOR_BLOCKS;
ok("blocks module loaded", !!api);

const packsSeen = new Set();

for (const canon of CANON_SUBCATEGORIAS) {
  const subId = canon.subcategoriaId;
  const enrich = SUB_ENRICHMENT_V2[subId];
  const base = SUB_DELTAS[subId];
  packsSeen.add(canon.pack);

  ok(`enrichment ${subId}`, !!enrich && String(enrich.blockHint || "").length > 10, enrich?.blockHint);
  ok(`delta ${subId}`, !!base && (base.deltaFields?.length || 0) > 0);

  const cfg = api.buildConfig({
    sectorId: "restaurantes",
    subcategoriaId: subId,
    formularioId: canon.formularioId,
  });
  ok(`buildConfig ${subId}`, !!cfg, subId);
  ok(`canon ${subId}`, cfg?.canonSubcategoriaId === subId);

  const blob = JSON.stringify(cfg.blocks);
  ok(`title ${subId}`, blob.includes(canon.blockTitle), canon.blockTitle);
  ok(`hint ${subId}`, blob.includes(enrich.blockHint), enrich.blockHint);
  ok(`colab ${subId}`, blob.includes("colaboracionesComerciales"));
  ok(`diferenciador ${subId}`, blob.includes("diferenciadorProfesional"));
}

ok("10 packs covered", packsSeen.size === 10, [...packsSeen].join(","));
ok("taqueria hint", String(SUB_ENRICHMENT_V2.taquerias?.blockHint || "").includes("Taquería"));
ok("dark kitchen hint", String(SUB_ENRICHMENT_V2["dark-kitchen"]?.blockHint || "").includes("delivery"));

console.log("\n=== QA MP-GASTRONOMIA SUB-DELTAS V2 ===");
console.log("PASS:", pass.length);
console.log("FAIL:", fail.length);
if (fail.length) {
  fail.slice(0, 20).forEach((f) => console.log("  FAIL:", f.name, f.detail || ""));
  process.exit(1);
}
console.log("OK — 24 sub-deltas gastronomía");
