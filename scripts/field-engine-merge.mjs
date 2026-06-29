/**
 * Merge FieldEngine — base → plantillaArquetipo → deltaSubcategoria
 * Uso: import { mergeRegistrationSchema } from './field-engine-merge.mjs'
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { packPlantillaKey } from "./bienestar-packs-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function uniqOrdered(arrays) {
  const out = [];
  const seen = new Set();
  for (const list of arrays) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (item == null || item === "") continue;
      const key = String(item);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

function shallowMergeObjects(...objs) {
  const out = {};
  for (const obj of objs) {
    if (!obj || typeof obj !== "object") continue;
    for (const [k, v] of Object.entries(obj)) {
      out[k] = v;
    }
  }
  return out;
}

export function resolvePlantillaChain(schema, arquetipo) {
  const chain = [];
  let current = arquetipo;
  const visited = new Set();
  while (current && !visited.has(current)) {
    visited.add(current);
    const node = schema.plantillasArquetipo?.[current];
    if (!node) break;
    chain.unshift(node);
    const parent = node.heredaDe;
    if (!parent) break;
    current = parent.replace(/^plantillasArquetipo\./, "");
  }
  return chain;
}

export function mergeRegistrationSchema(schema, sub) {
  const base = schema.meta?.base || {};
  const plantilla = schema.plantillasArquetipo?.[sub.arquetipo] || {};
  const chain = resolvePlantillaChain(schema, sub.arquetipo);
  const mergedPlantilla = chain.reduce((acc, node) => Object.assign(acc, node), {});

  const delta = sub.delta || {};
  const listKeys = [
    "camposPublicosResultados",
    "camposPublicosPerfil",
    "camposPrivados",
    "obligatoriosExtra",
    "opcionalesExtra",
    "camposProhibidos",
  ];

  const merged = {
    ...base,
    ...mergedPlantilla,
    ...delta,
    textosAyuda: shallowMergeObjects(
      mergedPlantilla.textosAyuda,
      delta.textosAyuda,
      sub.textosAyuda
    ),
    keywordsIA: uniqOrdered([
      mergedPlantilla.keywordsIA,
      sub.keywordsIA,
      delta.keywordsIA,
    ]),
    coherenciaExtra: uniqOrdered([
      schema.meta?.coherenciaGlobal,
      mergedPlantilla.coherenciaExtra,
      delta.coherenciaExtra,
      sub.coherenciaExtra,
    ]).filter((x) => x && typeof x === "object"),
  };

  for (const key of listKeys) {
    merged[key] = uniqOrdered([base[key], mergedPlantilla[key], delta[key]]);
  }

  merged.obligatorios = uniqOrdered([base.obligatorios, merged.obligatoriosExtra]);
  merged.fotosMin = Math.max(
    base.fotosMin ?? 0,
    mergedPlantilla.fotosMin ?? 0,
    delta.fotosMin ?? 0
  );
  if (delta.fotosMax != null || mergedPlantilla.fotosMax != null || base.fotosMax != null) {
    const candidates = [base.fotosMax, mergedPlantilla.fotosMax, delta.fotosMax].filter((v) => v != null);
    merged.fotosMax = candidates.length ? Math.min(...candidates) : undefined;
  }

  merged.deltaPack = delta.deltaPack || mergedPlantilla.deltaPack || null;
  return merged;
}

export function loadSchema(formularioId) {
  const files = {
    persona_independiente: "config-registro-independiente-schema.json",
    negocio_empresa: "config-registro-negocio-schema.json",
  };
  const file = files[formularioId];
  if (!file) throw new Error(`Schema no soportado: ${formularioId}`);
  return JSON.parse(fs.readFileSync(path.join(root, "scripts", file), "utf8"));
}

export function resolveBienestarSub(formularioId, subcategoriaId, pack) {
  const schema = loadSchema(formularioId);
  const sub =
    schema.subcategorias?.find((s) => s.subcategoriaId === subcategoriaId) ||
    ({
      subcategoriaId,
      arquetipo: packPlantillaKey(pack),
      delta: { deltaPack: pack },
    });
  return mergeRegistrationSchema(schema, sub);
}
