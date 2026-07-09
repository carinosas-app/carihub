/**
 * Genera public/js/carihub-gastronomia-sector-render.js desde scripts/gastronomia-packs-v1.mjs
 * node scripts/build-carihub-gastronomia-sector-render.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  LEGACY_TO_CANON,
  SECTOR_UI_SLUG_TO_CANON,
  CANON_SUBCATEGORIAS,
  SUB_TO_PACK,
  SUB_DELTAS,
  GASTRONOMIA_FIELD_REGISTRY,
  PACK_LABELS,
} from './gastronomia-packs-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'public/js/carihub-gastronomia-sector-render.js');

const PREVIEW_FICHA = Object.fromEntries(
  Object.entries(SUB_DELTAS).map(([k, v]) => [k, v.previewFicha || {}])
);

const FIELD_LABELS = Object.fromEntries(
  Object.entries(GASTRONOMIA_FIELD_REGISTRY).map(([k, v]) => [k, v.label || k])
);

const FIELD_TYPES = Object.fromEntries(
  Object.entries(GASTRONOMIA_FIELD_REGISTRY).map(([k, v]) => [k, v.tipo || 'text'])
);

const CANON_BLOCK_TITLES = Object.fromEntries(
  CANON_SUBCATEGORIAS.map((c) => [c.subcategoriaId, c.blockTitle])
);

const NEGOCIO_CANON = CANON_SUBCATEGORIAS.filter((c) => c.formularioId === 'negocio_empresa').map(
  (c) => c.subcategoriaId
);

const PACK_TITLES = PACK_LABELS;

const COLABORACIONES_ENUM = {
  si_activo: 'Sí, colaboro activamente',
  ocasional: 'Ocasionalmente',
  convenir: 'A convenir por proyecto',
  no: 'No por ahora',
};

function extractEnumLabels(prev) {
  const start = prev.indexOf('var ENUM_LABELS = ');
  const end = prev.indexOf('\n  var SECTOR_IDS');
  if (start < 0 || end < 0) return null;
  return prev.slice(start + 'var ENUM_LABELS = '.length, end).trim();
}

function injectColaboracionesEnum(enumBlock) {
  if (enumBlock.includes('colaboracionesComerciales')) return enumBlock;
  const insert = `"colaboracionesComerciales": ${JSON.stringify(COLABORACIONES_ENUM, null, 2).replace(/\n/g, '\n  ')},\n  `;
  return enumBlock.replace(/\n};\s*$/, `,\n  ${insert}};`);
}

function extractRuntimeTail(prev) {
  const marker = "  var SECTOR_IDS = ['restaurantes', 'gastronomia'];";
  const idx = prev.indexOf(marker);
  if (idx < 0) throw new Error('No se encontró runtime tail en carihub-gastronomia-sector-render.js');
  return prev.slice(idx);
}

let enumLabelsBlock = JSON.stringify(
  {
    politicaMenoresAlcohol: {
      prohibido_menores: 'Prohibido Menores',
      solo_con_adulto: 'Solo Con Adulto',
      area_separada: 'Area Separada',
      no_aplica: 'No Aplica',
    },
    colaboracionesComerciales: COLABORACIONES_ENUM,
  },
  null,
  2
);

let runtimeTail = '';

if (fs.existsSync(outPath)) {
  const prev = fs.readFileSync(outPath, 'utf8');
  const extractedEnum = extractEnumLabels(prev);
  if (extractedEnum) enumLabelsBlock = injectColaboracionesEnum(extractedEnum);
  runtimeTail = extractRuntimeTail(prev);
} else {
  throw new Error('Falta carihub-gastronomia-sector-render.js base para extraer runtime');
}

const body = `/**
 * Render Preview + Ficha — sector Gastronomía (MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 Fase 3).
 * Fuente: scripts/gastronomia-packs-v1.mjs — regenerar con build-carihub-gastronomia-sector-render.mjs
 */
(function (global) {
  'use strict';

  var LEGACY_TO_CANON = ${JSON.stringify({ ...LEGACY_TO_CANON, ...SECTOR_UI_SLUG_TO_CANON }, null, 2)};

  var PREVIEW_FICHA = ${JSON.stringify(PREVIEW_FICHA, null, 2)};

  var FIELD_LABELS = ${JSON.stringify(FIELD_LABELS, null, 2)};

  var FIELD_TYPES = ${JSON.stringify(FIELD_TYPES, null, 2)};

  var CANON_BLOCK_TITLES = ${JSON.stringify(CANON_BLOCK_TITLES, null, 2)};

  var NEGOCIO_CANON = ${JSON.stringify(NEGOCIO_CANON, null, 2)};

  var PACK_TITLES = ${JSON.stringify(PACK_TITLES, null, 2)};

  var SUB_TO_PACK = ${JSON.stringify(SUB_TO_PACK, null, 2)};

  var ENUM_LABELS = ${enumLabelsBlock};

${runtimeTail}`;

fs.writeFileSync(outPath, body, 'utf8');
console.log('Wrote', outPath, '(' + body.length + ' bytes)');
