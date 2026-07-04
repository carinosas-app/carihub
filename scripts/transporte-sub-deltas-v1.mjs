/**
 * MP-TRANSPORTE-DELTAS-V1 — deltas públicos detallados por subcategoría (24).
 */
import { SUB_TO_PACK, PACK_LABELS, formularioIdForSub, PACK_NEGOCIO_SUBS } from "./transporte-packs-v1.mjs";
import { SUB_EXTRA_PROFILES } from "./transporte-sub-extra-fields.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Transporte de personas",
    blockHint: "Servicios, vehículo y cobertura — permisos si aplican.",
    aliasPlaceholder: "Ej. Chofer privado · CDMX y zona sur",
    deltaFields: ["serviciosTransportePersonas", "tipoVehiculoPasajeros", "modalidadServicioTransporte"],
    obligatoriosDelta: [
      "alias",
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  B: {
    blockTitle: "Mensajería y última milla",
    blockHint: "Tipos de envío, vehículo y tiempos de respuesta.",
    aliasPlaceholder: "Ej. Mensajero · Same day local",
    deltaFields: ["serviciosMensajeria", "tiposEnvio", "tipoVehiculoMensajeria", "modalidadServicioTransporte"],
    obligatoriosDelta: [
      "alias",
      "serviciosMensajeria",
      "tiposEnvio",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tiempoRespuestaTransporte",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  C: {
    blockTitle: "Fletes y mudanzas",
    blockHint: "Capacidad, tipos de mercancía y cobertura.",
    aliasPlaceholder: "Ej. Flete ligero · Pick-up 1.5 ton",
    deltaFields: ["serviciosFleteMudanza", "capacidadCarga", "modalidadServicioTransporte"],
    obligatoriosDelta: [
      "alias",
      "serviciosFleteMudanza",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  D: {
    blockTitle: "Carga y logística operativa",
    blockHint: "Tipos de carga, rutas y permisos relevantes.",
    aliasPlaceholder: "Ej. Logística local · Distribución B2B",
    deltaFields: ["serviciosLogistica", "tiposCarga", "modalidadServicioTransporte", "capacidadCarga"],
    obligatoriosDelta: [
      "alias",
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  E: {
    blockTitle: "Empresa de transporte",
    blockHint: "Servicios de la empresa, flota y especialidades.",
    aliasPlaceholder: "Ej. Mensajería corporativa · Flotilla propia",
    deltaFields: ["serviciosEmpresaTransporte", "especialidadesEmpresaTransporte", "flotaAproximada"],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada",
      "direccion",
      "horarioDetalle",
      "geo",
    ],
  },
  F: {
    blockTitle: "Especialidades",
    blockHint: "Servicios especializados — internacional o renta.",
    aliasPlaceholder: "Ej. Logística internacional · Aduanas",
    deltaFields: ["serviciosEspecialidadTransporte", "modalidadServicioTransporte", "coberturaInternacional"],
    obligatoriosDelta: [
      "alias",
      "serviciosEspecialidadTransporte",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
};

export const SUB_DELTA_PATCHES = {
  "chofer-privado": { blockTitle: "Chofer privado" },
  "conductor-ejecutivo": { blockTitle: "Conductor ejecutivo" },
  "transporte-ejecutivo": { blockTitle: "Transporte ejecutivo" },
  "transporte-turistico": { blockTitle: "Transporte turístico" },
  "transporte-escolar": { blockTitle: "Transporte escolar" },
  mensajero: { blockTitle: "Mensajero" },
  "repartidor-local": { blockTitle: "Repartidor local" },
  motomensajero: { blockTitle: "Motomensajero" },
  "courier-independiente": { blockTitle: "Courier independiente" },
  "ultima-milla": { blockTitle: "Última milla" },
  "flete-ligero": { blockTitle: "Flete ligero" },
  "mudanzas-pequenas": {
    blockTitle: "Mudanzas pequeñas",
    deltaFields: ["serviciosFleteMudanza", "capacidadCarga", "incluyePersonalCarga", "modalidadServicioTransporte"],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosFleteMudanza",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "direccion",
      "horarioDetalle",
      "geo",
    ],
  },
  mudanzas: {
    blockTitle: "Mudanzas",
    deltaFields: ["serviciosFleteMudanza", "flotaAproximada", "incluyePersonalCarga", "modalidadServicioTransporte"],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosFleteMudanza",
      "flotaAproximada",
      "modalidadServicioTransporte",
      "direccion",
      "horarioDetalle",
      "geo",
    ],
  },
  "operador-de-carga": { blockTitle: "Operador de carga" },
  "transporte-de-carga": { blockTitle: "Transporte de carga" },
  "transporte-refrigerado": { blockTitle: "Transporte refrigerado" },
  "almacenes-y-bodegas": { blockTitle: "Almacenes y bodegas" },
  "distribucion-de-mercancias": { blockTitle: "Distribución de mercancías" },
  "logistica-local": { blockTitle: "Logística local" },
  "empresa-de-mensajeria": { blockTitle: "Empresa de mensajería" },
  "empresa-de-paqueteria": { blockTitle: "Empresa de paquetería" },
  "empresa-de-logistica": { blockTitle: "Empresa de logística" },
  "logistica-internacional": {
    blockTitle: "Logística internacional",
    obligatoriosDelta: [
      "alias",
      "serviciosEspecialidadTransporte",
      "modalidadServicioTransporte",
      "coberturaInternacional",
      "permisosLicencias",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  "renta-de-camionetas": {
    blockTitle: "Renta de camionetas",
    deltaFields: ["tiposVehiculoRenta", "serviciosEspecialidadTransporte", "flotaAproximada", "modalidadServicioTransporte"],
    obligatoriosDelta: [
      "nombreComercial",
      "tiposVehiculoRenta",
      "serviciosEspecialidadTransporte",
      "flotaAproximada",
      "modalidadServicioTransporte",
      "direccion",
      "horarioDetalle",
      "geo",
    ],
  },
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

export function buildTransporteSubDeltas(catalogRows) {
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
