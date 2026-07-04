/**
 * MP-BIENES-RAICES-DELTAS-V1 — deltas públicos detallados por subcategoría (27).
 */
import {
  SUB_TO_PACK,
  PACK_LABELS,
  formularioIdForSub,
  PACK_NEGOCIO_SUBS,
} from "./bienes-raices-packs-v1.mjs";
import { SUB_EXTRA_PROFILES } from "./bienes-raices-sub-extra-fields.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Asesores y profesionales",
    blockHint: "Servicios, tipos de inmueble y cobertura — tu sello genera confianza.",
    aliasPlaceholder: "Ej. Agente · Zona sur CDMX",
    deltaFields: [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "especialidadesInmobiliarias",
    ],
    obligatoriosDelta: [
      "alias",
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "coberturaGeografica",
      "tiempoRespuestaInmobiliaria",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  B: {
    blockTitle: "Empresas inmobiliarias",
    blockHint: "Servicios de la empresa, especialidades y cobertura.",
    aliasPlaceholder: "Ej. Inmobiliaria · Venta y renta",
    deltaFields: [
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
    ],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario",
      "direccion",
      "horarioDetalle",
      "coberturaGeografica",
    ],
  },
  C: {
    blockTitle: "Venta de inmuebles",
    blockHint: "Características, rango de precio y amenidades.",
    aliasPlaceholder: "Ej. Venta de casas · Zona residencial",
    deltaFields: [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
    ],
    obligatoriosDelta: [
      "nombreComercial",
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario",
      "direccion",
      "horarioDetalle",
      "coberturaGeografica",
    ],
  },
  D: {
    blockTitle: "Renta de inmuebles",
    blockHint: "Rango de renta, amenidades y cobertura.",
    aliasPlaceholder: "Ej. Renta de departamentos · Amueblado",
    deltaFields: [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble",
    ],
    obligatoriosDelta: [
      "nombreComercial",
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario",
      "direccion",
      "horarioDetalle",
      "coberturaGeografica",
    ],
  },
  E: {
    blockTitle: "Espacios flexibles",
    blockHint: "Planes, amenidades y ubicación.",
    aliasPlaceholder: "Ej. Coworking · Oficinas flexibles",
    deltaFields: [
      "serviciosEmpresaInmobiliaria",
      "operacionInmobiliaria",
      "amenidadesInmueble",
      "rangoPrecioInmobiliario",
    ],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosEmpresaInmobiliaria",
      "operacionInmobiliaria",
      "direccion",
      "horarioDetalle",
      "coberturaGeografica",
    ],
  },
};

export const SUB_DELTA_PATCHES = {
  "agente-inmobiliario-independiente": { blockTitle: "Agente inmobiliario independiente" },
  "asesor-inmobiliario": { blockTitle: "Asesor inmobiliario" },
  "corredor-inmobiliario": { blockTitle: "Corredor inmobiliario" },
  "promotor-de-propiedades": { blockTitle: "Promotor de propiedades" },
  "administrador-de-propiedades": { blockTitle: "Administrador de propiedades" },
  "valuador-inmobiliario": { blockTitle: "Valuador inmobiliario" },
  "rentas-vacacionales-independiente": { blockTitle: "Rentas vacacionales independiente" },
  "rentas-temporales-independiente": { blockTitle: "Rentas temporales independiente" },
  inmobiliaria: { blockTitle: "Inmobiliaria" },
  "agencia-de-bienes-raices": { blockTitle: "Agencia de bienes raíces" },
  "desarrolladora-inmobiliaria": { blockTitle: "Desarrolladora inmobiliaria" },
  constructora: { blockTitle: "Constructora" },
  "administracion-de-condominios": { blockTitle: "Administración de condominios" },
  "venta-de-casas": { blockTitle: "Venta de casas" },
  "renta-de-casas": { blockTitle: "Renta de casas" },
  "venta-de-departamentos": { blockTitle: "Venta de departamentos" },
  "renta-de-departamentos": { blockTitle: "Renta de departamentos" },
  "venta-de-terrenos": { blockTitle: "Venta de terrenos" },
  "venta-de-locales-comerciales": { blockTitle: "Venta de locales comerciales" },
  "renta-de-locales-comerciales": { blockTitle: "Renta de locales comerciales" },
  "venta-de-bodegas": { blockTitle: "Venta de bodegas" },
  "renta-de-bodegas": { blockTitle: "Renta de bodegas" },
  "venta-de-oficinas": { blockTitle: "Venta de oficinas" },
  "renta-de-oficinas": { blockTitle: "Renta de oficinas" },
  "renta-vacacional": { blockTitle: "Renta vacacional" },
  coworking: { blockTitle: "Coworking" },
  "centros-de-negocios-y-oficinas": { blockTitle: "Centros de negocios y oficinas" },
};

function mergeDelta(subId, nombre, pack, fotosMin) {
  const base = PACK_DELTA_BASE[pack] || PACK_DELTA_BASE.A;
  const patch = SUB_DELTA_PATCHES[subId] || {};
  const extra = SUB_EXTRA_PROFILES[subId] || {};
  const mergedFieldOptions = {
    ...(base.fieldOptions || {}),
    ...(patch.fieldOptions || {}),
    ...(extra.fieldOptions || {}),
  };
  const extraFields = [...new Set([...(extra.extraFields || []), ...(patch.extraFields || [])])];
  const hideFields = [...new Set([...(extra.hideFields || []), ...(patch.hideFields || [])])];
  const obligSet = new Set([
    ...(patch.obligatoriosDelta || base.obligatoriosDelta || []),
    ...(extra.obligatoriosExtra || []),
  ]);
  return {
    canonSubcategoriaId: subId,
    deltaPack: pack,
    formularioId: formularioIdForSub(subId),
    fotosMin: fotosMin || 3,
    nombre,
    packLabel: PACK_LABELS[pack] || pack,
    blockTitle: extra.blockTitle || patch.blockTitle || nombre,
    blockHint: extra.blockHint || patch.blockHint || base.blockHint || "",
    aliasPlaceholder: extra.aliasPlaceholder || patch.aliasPlaceholder || base.aliasPlaceholder || "",
    deltaFields: patch.deltaFields || base.deltaFields || [],
    extraFields: extraFields.length ? extraFields : undefined,
    hideFields: hideFields.length ? hideFields : undefined,
    obligatoriosDelta: [...obligSet],
    textosAyuda: { ...(base.textosAyuda || {}), ...(patch.textosAyuda || {}), ...(extra.textosAyuda || {}) },
    fieldLabels: { ...(base.fieldLabels || {}), ...(patch.fieldLabels || {}), ...(extra.fieldLabels || {}) },
    fieldOptions: Object.keys(mergedFieldOptions).length ? mergedFieldOptions : undefined,
    negocioLocal: PACK_NEGOCIO_SUBS.has(subId),
    personaIndependiente: !PACK_NEGOCIO_SUBS.has(subId),
  };
}

export function buildBienesRaicesSubDeltas(catalogRows) {
  const SUB_CANON_META = {};
  const SUB_DELTAS = {};
  for (const row of catalogRows) {
    const subId = row.subcategoriaId;
    const pack = SUB_TO_PACK[subId];
    if (!pack) continue;
    const fotosMin = row.fotos || 3;
    const delta = mergeDelta(subId, row.subcategoria || row.nombre || subId, pack, fotosMin);
    SUB_CANON_META[subId] = {
      canonSubcategoriaId: subId,
      nombre: delta.nombre,
      deltaPack: pack,
      formularioId: delta.formularioId,
      fotosMin: delta.fotosMin,
      mapa: row.mapa === true,
    };
    SUB_DELTAS[subId] = delta;
  }
  return { SUB_CANON_META, SUB_DELTAS };
}
