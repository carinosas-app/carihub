import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const secPath = path.join(root, "public/js/sectores-carihub.js");
const catPath = path.join(root, "public/js/catalogos-carihub.js");

const sec = fs.readFileSync(secPath, "utf8");
const cat = fs.readFileSync(catPath, "utf8");

const adultos = [...cat.matchAll(/\{id:"([^"]+)",nombre:"([^"]+)"/g)].map((m) => ({
  id: m[1],
  nombre: m[2],
}));

function extractSubs(varName) {
  const re = new RegExp(`var ${varName} = subs\\(\\[([\\s\\S]*?)\\]\\);`);
  const m = sec.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

const BIENESTAR = extractSubs("BIENESTAR");
const SALUD = extractSubs("SALUD");
const PROFESIONALES = extractSubs("PROFESIONALES");

const sectorBlocks = [...sec.matchAll(/\{\s*id: '([^']+)',\s*emoji:[\s\S]*?nombre: '([^']+)'([\s\S]*?)\n    \}/g)];

const inlineSubs = {};
for (const block of sectorBlocks) {
  const id = block[1];
  const body = block[3];
  const subsMatch = body.match(/subcategorias: subs\(\[([\s\S]*?)\]\)/);
  if (subsMatch) {
    inlineSubs[id] = [...subsMatch[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  }
}

const sectors = [
  { id: "adultos", nombre: "Adultos y Entretenimiento para Adultos", subs: adultos.map((s) => s.nombre) },
  { id: "bienestar", nombre: "Bienestar, Espiritualidad y Terapias Alternativas", subs: BIENESTAR },
  { id: "salud", nombre: "Salud y Servicios Médicos", subs: SALUD },
  { id: "profesionales", nombre: "Servicios Profesionales", subs: PROFESIONALES },
  ...Object.entries(inlineSubs).map(([id, subs]) => {
    const meta = sectorBlocks.find((b) => b[1] === id);
    return { id, nombre: meta?.[2] || id, subs };
  }),
];

let total = 0;
for (const s of sectors) {
  total += s.subs.length;
  console.log(`${s.id}\t${s.subs.length}\t${s.nombre}`);
}
console.log("TOTAL\t" + total);
console.log("\nADULTOS_IDS\t" + adultos.map((a) => a.id).join("|"));
