/**
 * MP-AUTOMOTRIZ-DELTAS-V1 — deltas públicos detallados por subcategoría (14).
 */
import { SUB_TO_PACK, PACK_LABELS, formularioIdForSub, PACK_NEGOCIO_SUBS } from "./automotriz-packs-v1.mjs";
import { SUB_EXTRA_PROFILES } from "./automotriz-sub-extra-fields.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Mecánica y reparación",
    blockHint: "Servicios mecánicos, marcas y modalidad — cobertura y garantía generan confianza.",
    aliasPlaceholder: "Ej. Taller Mecánico · Especialista multimarca",
    deltaFields: ["serviciosMecanica", "especialidadesMecanica", "modalidadServicioAuto", "marcasAtendidas"],
    obligatoriosDelta: [
      "alias",
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "coberturaGeografica",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
    ],
    textosAyuda: {
      serviciosMecanica: "Afinación, frenos, suspensión, diagnóstico…",
      modalidadServicioAuto: "Taller fijo, domicilio o ambos.",
    },
  },
  B: {
    blockTitle: "Llantas y vulcanización",
    blockHint: "Servicios de llantas, balanceo y alineación.",
    aliasPlaceholder: "Ej. Vulcanizadora · Llantas y alineación",
    deltaFields: ["serviciosLlantas", "tiposLlantas", "modalidadServicioAuto"],
    obligatoriosDelta: [
      "alias",
      "serviciosLlantas",
      "tiposLlantas",
      "modalidadServicioAuto",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  C: {
    blockTitle: "Carrocería y estética",
    blockHint: "Hojalatería, pintura, lavado o detailing — declara servicios y modalidad.",
    aliasPlaceholder: "Ej. Estética automotriz · Lavado y detailing",
    deltaFields: ["serviciosCarroceria", "serviciosEsteticaAuto", "modalidadServicioAuto"],
    obligatoriosDelta: [
      "alias",
      "modalidadServicioAuto",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  D: {
    blockTitle: "Refacciones y especialidades",
    blockHint: "Refacciones, A/C, baterías, audio u otra especialidad automotriz.",
    aliasPlaceholder: "Ej. Especialista automotriz · Refacciones y servicio",
    deltaFields: ["serviciosEspecialidadAuto", "serviciosRefacciones", "modalidadServicioAuto"],
    obligatoriosDelta: [
      "alias",
      "serviciosEspecialidadAuto",
      "modalidadServicioAuto",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  E: {
    blockTitle: "Venta de vehículos",
    blockHint: "Inventario, tipos de vehículo y financiamiento disponible.",
    aliasPlaceholder: "Ej. Seminuevos · Contado y crédito",
    deltaFields: ["serviciosVentaAutos", "tiposVehiculoVenta", "financiamientoDisponible"],
    obligatoriosDelta: [
      "alias",
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  F: {
    blockTitle: "Grúas y auxilio vial",
    blockHint: "Servicios de grúa, auxilio vial y cobertura en carretera.",
    aliasPlaceholder: "Ej. Grúa 24 h · Auxilio vial",
    deltaFields: ["serviciosGrua", "modalidadServicioAuto", "coberturaCarretera", "tiempoRespuestaAuto"],
    obligatoriosDelta: [
      "alias",
      "serviciosGrua",
      "modalidadServicioAuto",
      "coberturaGeografica",
      "coberturaCarretera",
      "tiempoRespuestaAuto",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
};

export const SUB_DELTA_PATCHES = {
  "talleres-mecanicos": { blockTitle: "Talleres mecánicos" },
  electromecanicos: { blockTitle: "Electromecánicos" },
  "mecanicos-a-domicilio": { blockTitle: "Mecánicos a domicilio" },
  vulcanizadoras: { blockTitle: "Vulcanizadoras" },
  "hojalateria-y-pintura": { blockTitle: "Hojalatería y pintura" },
  "lavado-de-autos": { blockTitle: "Lavado de autos" },
  "detallado-automotriz-premium": { blockTitle: "Detallado automotriz premium" },
  refaccionarias: { blockTitle: "Refaccionarias" },
  "instaladores-de-audio-car-multimedia": { blockTitle: "Audio / car multimedia" },
  "tecnicos-en-baterias": { blockTitle: "Técnicos en baterías" },
  "tecnicos-en-a-c-automotriz": { blockTitle: "A/C automotriz" },
  "agencias-de-autos": {
    blockTitle: "Agencias de autos",
    deltaFields: ["serviciosVentaAutos", "tiposVehiculoVenta", "financiamientoDisponible", "inventarioAproximado"],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible",
      "inventarioAproximado",
      "direccion",
      "horarioDetalle",
      "geo",
    ],
  },
  "lotes-de-autos": {
    blockTitle: "Lotes de autos",
    deltaFields: ["serviciosVentaAutos", "tiposVehiculoVenta", "financiamientoDisponible", "cantidadUnidadesAprox"],
    obligatoriosDelta: [
      "alias",
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible",
      "cantidadUnidadesAprox",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  "gruas-y-auxilio-vial": { blockTitle: "Grúas y auxilio vial" },
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

export function buildAutomotrizSubDeltas(catalogRows) {
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
