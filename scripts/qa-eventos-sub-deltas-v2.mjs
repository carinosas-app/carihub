/**
 * QA — MP-EVENTOS SUB-DELTAS V2 (20 canon).
 * node scripts/qa-eventos-sub-deltas-v2.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { CANON_SUBCATEGORIAS, SUB_DELTAS } from "./eventos-packs-v1.mjs";
import { SUB_ENRICHMENT_V2 } from "./eventos-sub-enrichment-v2.mjs";
import { HIDE_ADULT_LEAKS } from "./registro-cross-sector-policy.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || "falló" });
}

ok("20 enrichment keys", Object.keys(SUB_ENRICHMENT_V2).length === 20);
ok("20 canon subs", CANON_SUBCATEGORIAS.length === 20);

const ctx = vm.createContext({ window: {}, globalThis: {} });
ctx.window = ctx;
vm.runInContext(
  fs.readFileSync(path.join(root, "public/js/data/registro-eventos-blocks.js"), "utf8"),
  ctx,
  { filename: "registro-eventos-blocks.js" }
);
const api = ctx.window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS;
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
    sectorId: "eventos",
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
  ok(
    `extra no escort ${subId}`,
    !blob.includes('"nivelServicio"') || blob.indexOf("hideFields") >= 0
  );
}

ok("12 packs covered", packsSeen.size === 12, [...packsSeen].join(","));
ok("dj hint", String(SUB_ENRICHMENT_V2["djs-eventos"]?.blockHint || "").includes("DJ"));
ok("venue hint", String(SUB_ENRICHMENT_V2["espacios-para-eventos"]?.blockHint || "").includes("salón"));

console.log("\n=== QA MP-EVENTOS SUB-DELTAS V2 ===");
console.log("PASS:", pass.length);
console.log("FAIL:", fail.length);
if (fail.length) {
  fail.slice(0, 20).forEach((f) => console.log("  FAIL:", f.name, f.detail || ""));
  process.exit(1);
}
console.log("OK — 20 sub-deltas eventos");
