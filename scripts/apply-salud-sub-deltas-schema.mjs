/**
 * Sync schema — deltas detallados sector salud (50 subs).
 * Uso: node scripts/apply-salud-sub-deltas-schema.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SALUD_FIELD_REGISTRY, buildPackPlantillas, arquetipoForPack, SUB_TO_PACK } from "./salud-packs-v1.mjs";
import { buildSaludSubDeltas } from "./salud-sub-deltas-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));
const rows = mapa.matrix.filter((r) => r.sectorId === "salud");
const { SUB_DELTAS } = buildSaludSubDeltas(rows);

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}
function writeJson(rel, data) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(data, null, 2) + "\n", "utf8");
}

const ind = readJson("scripts/config-registro-independiente-schema.json");
Object.assign(ind.meta.fieldRegistry, SALUD_FIELD_REGISTRY);
Object.assign(ind.plantillasArquetipo, buildPackPlantillas());

const negocioSaludIds = new Set(
  rows.filter((r) => SUB_DELTAS[r.subcategoriaId]?.formularioId === "negocio_empresa").map((r) => r.subcategoriaId)
);
ind.subcategorias = ind.subcategorias.filter(
  (s) => !(s.sectorId === "salud" && negocioSaludIds.has(s.subcategoriaId))
);

let indPatched = 0;
for (const sub of ind.subcategorias) {
  if (sub.sectorId !== "salud") continue;
  const d = SUB_DELTAS[sub.subcategoriaId];
  if (!d || d.formularioId !== "persona_independiente") continue;
  const pack = d.deltaPack;
  sub.arquetipo = arquetipoForPack(pack, sub.subcategoriaId);
  sub.heredaDe = `plantillasArquetipo.${sub.arquetipo}`;
  sub.delta = {
    deltaPack: pack,
    blockTitle: d.blockTitle,
    blockHint: d.blockHint,
    deltaFields: d.deltaFields,
    obligatoriosDelta: d.obligatoriosDelta,
    textosAyuda: d.textosAyuda,
    canonSubcategoriaId: d.canonSubcategoriaId,
    keywordsIA: sub.delta?.keywordsIA || sub.keywordsIA || [],
  };
  indPatched++;
}
writeJson("scripts/config-registro-independiente-schema.json", ind);

const prof = readJson("scripts/config-registro-profesionista-schema.json");
let profPatched = 0;
for (const sub of prof.subcategorias) {
  if (sub.sectorId !== "salud") continue;
  const d = SUB_DELTAS[sub.subcategoriaId];
  if (!d) continue;
  sub.delta = {
    ...(sub.delta || {}),
    deltaPack: d.deltaPack,
    blockTitle: d.blockTitle,
    blockHint: d.blockHint,
    deltaFields: d.deltaFields,
    obligatoriosDelta: d.obligatoriosDelta,
    textosAyuda: d.textosAyuda,
    canonSubcategoriaId: d.canonSubcategoriaId,
  };
  profPatched++;
}
writeJson("scripts/config-registro-profesionista-schema.json", prof);

const neg = readJson("scripts/config-registro-negocio-schema.json");
let negPatched = 0;
const negSaludIds = new Set(neg.subcategorias.filter((s) => s.sectorId === "salud").map((s) => s.subcategoriaId));
const negTemplate = neg.subcategorias.find((s) => s.subcategoriaId === "clinicas-medicas") || neg.subcategorias.find((s) => s.sectorId === "salud");

for (const row of rows) {
  const d = SUB_DELTAS[row.subcategoriaId];
  if (!d || d.formularioId !== "negocio_empresa") continue;
  if (negSaludIds.has(row.subcategoriaId)) {
    const sub = neg.subcategorias.find((s) => s.subcategoriaId === row.subcategoriaId);
    if (sub) {
      sub.delta = {
        ...(sub.delta || {}),
        deltaPack: d.deltaPack,
        blockTitle: d.blockTitle,
        blockHint: d.blockHint,
        deltaFields: d.deltaFields,
        obligatoriosDelta: d.obligatoriosDelta,
        textosAyuda: d.textosAyuda,
        canonSubcategoriaId: d.canonSubcategoriaId,
      };
      negPatched++;
    }
    continue;
  }
  if (!negTemplate) continue;
  const pack = d.deltaPack;
  const arquetipo = arquetipoForPack(pack, row.subcategoriaId);
  neg.subcategorias.push({
    subcategoriaId: row.subcategoriaId,
    nombre: row.subcategoria,
    sectorId: "salud",
    arquetipo,
    tipoPerfil: "negocio",
    heredaDe: `plantillasArquetipo.${arquetipo}`,
    delta: {
      deltaPack: pack,
      blockTitle: d.blockTitle,
      blockHint: d.blockHint,
      deltaFields: d.deltaFields,
      obligatoriosDelta: d.obligatoriosDelta,
      textosAyuda: d.textosAyuda,
      canonSubcategoriaId: d.canonSubcategoriaId,
    },
    keywordsIA: [row.subcategoria.toLowerCase(), "salud"],
  });
  negSaludIds.add(row.subcategoriaId);
  negPatched++;
}

writeJson("scripts/config-registro-negocio-schema.json", neg);

const FORMULARIO_TEMPORAL = {
  negocio_empresa: "temporal_negocio_empresa",
  profesionista_cedula: "temporal_profesionista_cedula",
  persona_independiente: "temporal_persona_independiente",
};

let mapaPatched = 0;
for (const row of mapa.matrix) {
  if (row.sectorId !== "salud") continue;
  const d = SUB_DELTAS[row.subcategoriaId];
  const pack = SUB_TO_PACK[row.subcategoriaId];
  if (!pack || !d) continue;
  const arquetipo = arquetipoForPack(pack, row.subcategoriaId);
  row.arquetipo = arquetipo;
  row.metadata = { ...(row.metadata || {}), deltaPack: pack, canonSubcategoriaId: row.subcategoriaId };
  if (d.formularioId === "negocio_empresa") {
    row.formularioId = "negocio_empresa";
    row.tipoRegistro = "Negocio o Empresa";
    row.formulario = "Formulario Negocio";
    row.tipoPerfil = "negocio";
    row.componenteResultados = "ResultCardNegocio";
    row.componentePerfil = "ProfileLayoutNegocio";
    row.cedula = false;
    row.factura = true;
  } else if (d.formularioId === "profesionista_cedula") {
    row.formularioId = "profesionista_cedula";
    row.tipoRegistro = "Profesionista con Cédula";
    row.formulario = "Formulario Profesionista";
    row.tipoPerfil = "persona";
    row.componenteResultados = "ResultCardProfesional";
    row.componentePerfil = "ProfileLayoutProfesional";
    row.cedula = true;
  } else {
    row.formularioId = "persona_independiente";
    row.tipoRegistro = "Persona Independiente";
    row.formulario = "Formulario Persona Independiente";
    row.tipoPerfil = "persona";
    row.componenteResultados = "ResultCardServicio";
    row.componentePerfil = "ProfileLayoutServicio";
    row.cedula = false;
  }
  const temporal = FORMULARIO_TEMPORAL[d.formularioId] || null;
  if (row.categoriaSugerida && temporal) {
    row.categoriaSugerida.formularioTemporal = temporal;
  }
  mapaPatched++;
}
mapa.generado = new Date().toISOString();
writeJson("scripts/mapa-registro-categorias.json", mapa);

console.log("Patched independiente:", indPatched, "profesionista:", profPatched, "negocio:", negPatched, "mapa:", mapaPatched);
