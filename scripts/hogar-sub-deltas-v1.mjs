/**
 * MP-HOGAR-DELTAS-V1 — deltas públicos detallados por subcategoría (17).
 */
import { SUB_TO_PACK, PACK_LABELS, formularioIdForSub, PACK_NEGOCIO_SUBS } from "./hogar-packs-v1.mjs";
import { SUB_EXTRA_PROFILES } from "./hogar-sub-extra-fields.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Obra húmeda y albañilería",
    blockHint: "Servicios, modalidad y cobertura — garantía y materiales generan confianza.",
    aliasPlaceholder: "Ej. Plomero · Urgencias zona sur",
    deltaFields: ["serviciosHogar", "especialidadesHogar", "modalidadServicioHogar", "tiposInmueble"],
    obligatoriosDelta: [
      "alias",
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tiempoRespuestaHogar",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  B: {
    blockTitle: "Electricidad y tecnología hogar",
    blockHint: "Servicios técnicos, especialidades y tiempos de respuesta.",
    aliasPlaceholder: "Ej. Electricista · Instalaciones residenciales",
    deltaFields: ["serviciosHogar", "especialidadesHogar", "modalidadServicioHogar", "tiposInmueble"],
    obligatoriosDelta: [
      "alias",
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  C: {
    blockTitle: "Carpintería, herrería e instalaciones",
    blockHint: "Tipos de trabajo, materiales y cobertura.",
    aliasPlaceholder: "Ej. Carpintero · Muebles a medida",
    deltaFields: ["serviciosHogar", "tiposTrabajoHogar", "modalidadServicioHogar", "materialesIncluidos"],
    obligatoriosDelta: [
      "alias",
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  D: {
    blockTitle: "Acabados, jardín y mantenimiento",
    blockHint: "Servicios, modalidad y zona de cobertura.",
    aliasPlaceholder: "Ej. Pintor · Interiores y exteriores",
    deltaFields: ["serviciosHogar", "modalidadServicioHogar", "tiposInmueble", "tiempoRespuestaHogar"],
    obligatoriosDelta: [
      "alias",
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
};

export const SUB_DELTA_PATCHES = {
  plomeros: { blockTitle: "Plomeros" },
  albaniles: { blockTitle: "Albañiles" },
  impermeabilizadores: { blockTitle: "Impermeabilizadores" },
  electricistas: { blockTitle: "Electricistas" },
  "tecnicos-en-clima-hvac": { blockTitle: "Técnicos en clima / HVAC" },
  "instaladores-de-paneles-solares": { blockTitle: "Instaladores de paneles solares" },
  "tecnicos-en-camaras-de-seguridad": { blockTitle: "Técnicos en cámaras de seguridad" },
  "domotica-casa-inteligente": { blockTitle: "Domótica / casa inteligente" },
  carpinteros: { blockTitle: "Carpinteros" },
  herreros: { blockTitle: "Herreros" },
  "instaladores-de-pisos": { blockTitle: "Instaladores de pisos" },
  cerrajeros: { blockTitle: "Cerrajeros" },
  pintores: { blockTitle: "Pintores" },
  jardineria: { blockTitle: "Jardinería" },
  fumigacion: { blockTitle: "Fumigación" },
  "limpieza-del-hogar": { blockTitle: "Limpieza del hogar" },
  "mantenimiento-general": { blockTitle: "Mantenimiento general" },
};

function mergeDelta(subId, nombre, pack) {
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

export function buildHogarSubDeltas(catalogRows) {
  const SUB_CANON_META = {};
  const SUB_DELTAS = {};
  for (const row of catalogRows) {
    const subId = row.subcategoriaId;
    const pack = SUB_TO_PACK[subId];
    if (!pack) continue;
    const delta = mergeDelta(subId, row.subcategoria || row.nombre || subId, pack);
    SUB_CANON_META[subId] = {
      canonSubcategoriaId: subId,
      nombre: delta.nombre,
      deltaPack: pack,
      formularioId: delta.formularioId,
    };
    SUB_DELTAS[subId] = delta;
  }
  return { SUB_CANON_META, SUB_DELTAS };
}
