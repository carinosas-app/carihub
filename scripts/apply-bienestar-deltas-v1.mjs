/**
 * MP-BIENESTAR-DELTAS-V1 — aplica Fase 0 (catálogo) + Fase 1 (schema/packs).
 * Uso: node scripts/apply-bienestar-deltas-v1.mjs
 *
 * Nota: integrar-catalogo-expandido.mjs ya clasifica retail bienestar como negocio_comercio.
 * Ejecutar este script después de regenerar mapa/schemas si necesitas re-aplicar packs A–H y deltas.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  BIENESTAR_FIELD_REGISTRY,
  NEW_SUBCATEGORIAS,
  RETAIL_FIX_IDS,
  SUB_TO_PACK,
  buildPackPlantillas,
  arquetipoForPack,
  COACHING_SUBS,
} from "./bienestar-packs-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scripts = path.join(root, "scripts");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function writeJson(rel, data) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(data, null, 2) + "\n", "utf8");
}

function slugKeywords(nombre) {
  return [
    nombre.toLowerCase(),
    ...nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[\s/]+/)
      .filter((t) => t.length > 2),
  ];
}

function cloneMapaRow(template, patch) {
  return JSON.parse(JSON.stringify({ ...template, ...patch }));
}

/** 1. sectores-carihub.js */
function patchSectoresCarihub() {
  const file = path.join(root, "public/js/sectores-carihub.js");
  let content = fs.readFileSync(file, "utf8");
  const insertBefore = "    'Venta de Inciensos',";
  const newLines = [
    "    'Ceremonias de Ayahuasca, Rapé y Plantas de Poder',",
    "    'Cacao Ceremonial',",
    "    'Reflexología',",
    "    'Registros Akáshicos',",
    "    'Cosmética Natural',",
    "    'Velas Esotéricas',",
    "    'Sahumerios',",
  ];
  if (content.includes("Ceremonias de Ayahuasca")) {
    console.log("sectores-carihub.js: subs nuevas ya presentes");
    return;
  }
  if (!content.includes(insertBefore)) throw new Error("No se encontró ancla BIENESTAR en sectores-carihub.js");
  content = content.replace(insertBefore, `${newLines.join("\n")}\n    ${insertBefore}`);
  fs.writeFileSync(file, content, "utf8");
  console.log("Patched public/js/sectores-carihub.js (+7 subs)");
}

/** 2. config-registro-independiente-schema.json */
function patchIndependienteSchema() {
  const rel = "scripts/config-registro-independiente-schema.json";
  const schema = readJson(rel);
  Object.assign(schema.meta.fieldRegistry, BIENESTAR_FIELD_REGISTRY);
  Object.assign(schema.plantillasArquetipo, buildPackPlantillas());

  const bienestarSubs = schema.subcategorias.filter((s) => s.sectorId === "bienestar");
  const existingIds = new Set(bienestarSubs.map((s) => s.subcategoriaId));

  for (const sub of bienestarSubs) {
    const pack = SUB_TO_PACK[sub.subcategoriaId];
    if (!pack) continue;
    const arquetipo = arquetipoForPack(pack, sub.subcategoriaId);
    sub.arquetipo = arquetipo;
    sub.heredaDe = `plantillasArquetipo.${arquetipo}`;
    if (COACHING_SUBS.has(sub.subcategoriaId)) {
      sub.tipoPerfil = "persona";
    }
    sub.delta = {
      deltaPack: pack,
      keywordsIA: sub.keywordsIA || slugKeywords(sub.nombre),
    };
    if (pack === "H") {
      sub.delta.edadMinimaServicio = 18;
    }
  }

  for (const neu of NEW_SUBCATEGORIAS) {
    if (existingIds.has(neu.subcategoriaId)) continue;
    const arquetipo = arquetipoForPack(neu.pack, neu.subcategoriaId);
    schema.subcategorias.push({
      subcategoriaId: neu.subcategoriaId,
      nombre: neu.nombre,
      sectorId: "bienestar",
      arquetipo,
      tipoPerfil: "persona",
      heredaDe: `plantillasArquetipo.${arquetipo}`,
      delta: {
        deltaPack: neu.pack,
        keywordsIA: slugKeywords(neu.nombre),
        ...(neu.pack === "H" ? { edadMinimaServicio: 18 } : {}),
      },
      keywordsIA: slugKeywords(neu.nombre),
    });
  }

  writeJson(rel, schema);
  console.log("Patched config-registro-independiente-schema.json (packs A–H + deltas)");
}

/** 3. config-registro-negocio-schema.json — retail fix */
function patchNegocioSchema() {
  const rel = "scripts/config-registro-negocio-schema.json";
  const schema = readJson(rel);
  for (const sub of schema.subcategorias) {
    if (!RETAIL_FIX_IDS.includes(sub.subcategoriaId)) continue;
    sub.arquetipo = "negocio_comercio";
    sub.heredaDe = "plantillasArquetipo.negocio_comercio";
    sub.delta = {
      deltaPack: "D",
      keywordsIA: sub.keywordsIA || slugKeywords(sub.nombre),
    };
  }
  writeJson(rel, schema);
  console.log("Patched config-registro-negocio-schema.json (retail inciensos/aceites)");
}

/** 4. mapa-registro-categorias.json */
function patchMapa() {
  const rel = "scripts/mapa-registro-categorias.json";
  const mapa = readJson(rel);
  const matrix = mapa.matrix;
  const templatePersona = matrix.find((r) => r.subcategoriaId === "reiki");
  const templateNegocio = matrix.find((r) => r.subcategoriaId === "distribuidoras") || matrix.find((r) => r.arquetipo === "negocio_comercio");

  for (const row of matrix) {
    if (row.sectorId !== "bienestar") continue;
    const pack = SUB_TO_PACK[row.subcategoriaId];
    if (RETAIL_FIX_IDS.includes(row.subcategoriaId)) {
      row.arquetipo = "negocio_comercio";
      row.tipoRegistro = "Negocio o Empresa";
      row.formulario = "Formulario Negocio";
      row.formularioId = "negocio_empresa";
      row.componenteResultados = "ResultCardNegocio";
      row.componentePerfil = "ProfileLayoutNegocio";
      row.fotos = 5;
      row.mapa = true;
      row.admin = "media";
      row.metadata = { ...(row.metadata || {}), deltaPack: "D" };
      continue;
    }
    if (pack) {
      const arquetipo = arquetipoForPack(pack, row.subcategoriaId);
      row.arquetipo = arquetipo;
      row.metadata = { ...(row.metadata || {}), deltaPack: pack };
    }
  }

  const existing = new Set(matrix.map((r) => r.subcategoriaId));
  for (const neu of NEW_SUBCATEGORIAS) {
    if (existing.has(neu.subcategoriaId)) continue;
    const arquetipo = arquetipoForPack(neu.pack, neu.subcategoriaId);
    matrix.push(
      cloneMapaRow(templatePersona, {
        categoriaPrincipal: "Bienestar, Espiritualidad y Terapias Alternativas",
        sectorId: "bienestar",
        categoriaPadre: "bienestar",
        subcategoria: neu.nombre,
        subcategoriaId: neu.subcategoriaId,
        tipoRegistro: "Persona Independiente",
        formulario: "Formulario Persona Independiente",
        formularioId: "persona_independiente",
        arquetipo,
        tipoPerfil: "persona",
        componenteResultados: "ResultCardServicio",
        componentePerfil: "ProfileLayoutServicio",
        schemaVersion: "2026-06-10",
        publico: "alias, servicio, ciudad, tarifa, foto",
        privado: "INE",
        verif: "persona INE",
        fotos: neu.pack === "H" ? 3 : 3,
        admin: neu.pack === "H" ? "alta" : "baja",
        metadata: { deltaPack: neu.pack, requiresAdminReview: neu.pack === "H" },
        busqueda: {
          keywords: slugKeywords(neu.nombre),
          aliases: [],
          sinonimos: [],
          palabrasRelacionadas: ["bienestar"],
          erroresComunes: [],
          prioridadBusqueda: 50,
          estadoActivo: true,
          geoPrimero: true,
        },
      })
    );
  }

  mapa.total = matrix.length;
  mapa.generado = new Date().toISOString();
  writeJson(rel, mapa);
  console.log("Patched mapa-registro-categorias.json (total", matrix.length, ")");
}

/** 5. MATRIZ-FORMULARIO-UI-REGISTRO.json */
function patchMatriz() {
  const rel = "scripts/MATRIZ-FORMULARIO-UI-REGISTRO.json";
  const matriz = readJson(rel);
  const rows = matriz.asignaciones;
  if (!Array.isArray(rows)) throw new Error("MATRIZ sin asignaciones[]");
  const byId = new Map(rows.map((r) => [r.subcategoriaId, r]));

  for (const id of RETAIL_FIX_IDS) {
    const row = byId.get(id);
    if (!row) continue;
    row.arquetipo = "negocio_comercio";
    row.formularioUiId = "ui_neg_comercio";
  }

  for (const neu of NEW_SUBCATEGORIAS) {
    if (byId.has(neu.subcategoriaId)) continue;
    const arquetipo = arquetipoForPack(neu.pack, neu.subcategoriaId);
    const uiId = COACHING_SUBS.has(neu.subcategoriaId) ? "ui_ind_coach" : "ui_ind_bienestar";
    rows.push({
      subcategoriaId: neu.subcategoriaId,
      subcategoria: neu.nombre,
      sectorId: "bienestar",
      formularioSchemaId: "persona_independiente",
      arquetipo,
      formularioUiId: uiId,
    });
    byId.set(neu.subcategoriaId, rows[rows.length - 1]);
  }

  for (const row of rows) {
    if (row.sectorId !== "bienestar") continue;
    const pack = SUB_TO_PACK[row.subcategoriaId];
    if (!pack || RETAIL_FIX_IDS.includes(row.subcategoriaId)) continue;
    row.arquetipo = arquetipoForPack(pack, row.subcategoriaId);
  }

  const bienestarPersona = rows.filter(
    (r) => r.sectorId === "bienestar" && r.formularioSchemaId === "persona_independiente"
  ).length;
  const bienestarUi = rows.filter((r) => r.sectorId === "bienestar" && r.formularioUiId === "ui_ind_bienestar").length;
  const coachUi = rows.filter((r) => r.sectorId === "bienestar" && r.formularioUiId === "ui_ind_coach").length;

  if (matriz.catalogoUi) {
    const uiB = matriz.catalogoUi.find((u) => u.formularioUiId === "ui_ind_bienestar");
    if (uiB) uiB.subcategorias = bienestarUi;
    const uiC = matriz.catalogoUi.find((u) => u.formularioUiId === "ui_ind_coach");
    if (uiC) uiC.subcategorias = coachUi;
  }

  matriz.resumen.totalSubcategorias = rows.length;
  if (matriz.resumen.formulariosSchema?.persona_independiente != null) {
    matriz.resumen.formulariosSchema.persona_independiente = rows.filter(
      (r) => r.formularioSchemaId === "persona_independiente"
    ).length;
  }

  writeJson(rel, matriz);
  console.log("Patched MATRIZ-FORMULARIO-UI-REGISTRO.json (bienestar persona", bienestarPersona, ")");
}

/** 6. arquetipos-catalogo.mjs */
function patchArquetiposCatalogo() {
  const file = path.join(scripts, "arquetipos-catalogo.mjs");
  let content = fs.readFileSync(file, "utf8");
  if (content.includes("bienestarPackForSub")) {
    console.log("arquetipos-catalogo.mjs: ya parcheado");
    return;
  }

  const insert = `
import { SUB_TO_PACK, arquetipoForPack, RETAIL_FIX_IDS } from "./bienestar-packs-v1.mjs";

export function bienestarPackForSub(subcategoriaId) {
  return SUB_TO_PACK[subcategoriaId] || null;
}

export function bienestarArquetipoForSub(subcategoriaId) {
  const pack = bienestarPackForSub(subcategoriaId);
  if (!pack) return "persona_servicio_bienestar";
  return arquetipoForPack(pack, subcategoriaId);
}
`;

  content = content.replace(
    'export function sectorArquetipoIndependiente(sectorId, subcategoriaId) {\n  if (sectorId === "bienestar") return "persona_bienestar_individual";',
    `${insert}\nexport function sectorArquetipoIndependiente(sectorId, subcategoriaId) {\n  if (sectorId === "bienestar") return bienestarArquetipoForSub(subcategoriaId);`
  );

  content = content.replace(
    'export function sectorArquetipoNegocio(sectorId, nombre) {\n  const n = nombre.toLowerCase();',
    `export function sectorArquetipoNegocio(sectorId, nombre, subcategoriaId) {\n  const n = nombre.toLowerCase();\n  if (sectorId === "bienestar" && subcategoriaId && RETAIL_FIX_IDS.includes(subcategoriaId)) return "negocio_comercio";\n  if (sectorId === "bienestar" && (n.includes("venta de") || n.includes("tienda") || n.includes("productos"))) return "negocio_comercio";`
  );

  fs.writeFileSync(file, content, "utf8");
  console.log("Patched arquetipos-catalogo.mjs");
}

patchSectoresCarihub();
patchIndependienteSchema();
patchNegocioSchema();
patchMapa();
patchMatriz();
patchArquetiposCatalogo();
console.log("\nMP-BIENESTAR-DELTAS-V1 apply OK");
