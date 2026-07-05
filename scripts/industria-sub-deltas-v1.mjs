/**
 * MP-INDUSTRIA-DELTAS-V1 — deltas públicos detallados por subcategoría (33).
 */
import {
  SUB_TO_PACK,
  PACK_LABELS,
  formularioIdForSub,
  PACK_PROFESIONISTA_SUBS,
  PACK_NEGOCIO_SUBS,
} from "./industria-packs-v1.mjs";
import { SUB_EXTRA_PROFILES } from "./industria-sub-extra-fields.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Consultoría y servicios independientes",
    blockHint: "Servicios, sectores y cobertura — tu sello industrial genera confianza.",
    aliasPlaceholder: "Ej. Consultor · Lean y procesos",
    deltaFields: ["serviciosIndustriales", "sectoresIndustriales", "modalidadServicioIndustrial"],
    obligatoriosDelta: [
      "alias",
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "coberturaGeografica",
      "tiempoRespuestaIndustrial",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  B: {
    blockTitle: "Profesionistas certificados",
    blockHint: "Especialidad, servicios y modalidad — cédula se valida en sección privada.",
    aliasPlaceholder: "Ej. Ing. industrial · Procesos y planta",
    deltaFields: [
      "serviciosProfesionalesIndustrial",
      "especialidadIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
    ],
    obligatoriosDelta: [
      "nombreProfesional",
      "especialidadIndustrial",
      "serviciosProfesionalesIndustrial",
      "modalidadServicioIndustrial",
      "precioConsulta",
      "horarioAtencion",
      "coberturaGeografica",
    ],
  },
  C: {
    blockTitle: "Manufactura y producción",
    blockHint: "Procesos, capacidad y certificaciones.",
    aliasPlaceholder: "Ej. Manufactura · Ensamble y maquinado",
    deltaFields: [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "capacidadProduccion",
      "certificacionesIndustriales",
    ],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "capacidadProduccion",
      "direccion",
      "horarioDetalle",
      "coberturaGeografica",
    ],
  },
  D: {
    blockTitle: "Servicios industriales",
    blockHint: "Servicios en planta, procesos y cobertura.",
    aliasPlaceholder: "Ej. Mantenimiento · Preventivo y correctivo",
    deltaFields: [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
    ],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "direccion",
      "horarioDetalle",
      "coberturaGeografica",
    ],
  },
  E: {
    blockTitle: "Corporativo y outsourcing",
    blockHint: "Servicios B2B, cobertura y modalidad.",
    aliasPlaceholder: "Ej. Outsourcing · Procesos tercerizados",
    deltaFields: [
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
    ],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "direccion",
      "horarioDetalle",
      "coberturaGeografica",
    ],
  },
};

export const SUB_DELTA_PATCHES = {
  "consultor-empresarial-independiente": { blockTitle: "Consultor empresarial independiente" },
  "auditor-independiente": { blockTitle: "Auditor independiente" },
  "reclutador-independiente": { blockTitle: "Reclutador independiente" },
  "asesor-de-procesos": { blockTitle: "Asesor de procesos" },
  "inspector-de-calidad": { blockTitle: "Inspector de calidad" },
  "consultor-iso": { blockTitle: "Consultor ISO" },
  "gestor-de-tramites-empresariales": { blockTitle: "Gestor de trámites empresariales" },
  "consultoria-fiscal": { blockTitle: "Consultoría fiscal" },
  "consultoria-legal": { blockTitle: "Consultoría legal" },
  "certificaciones-iso": { blockTitle: "Certificaciones ISO" },
  "servicios-contables": { blockTitle: "Servicios contables" },
  "servicios-administrativos": { blockTitle: "Servicios administrativos" },
  "servicios-corporativos": { blockTitle: "Servicios corporativos" },
  "empaques-y-embalaje": { blockTitle: "Empaques y embalaje" },
  "contador-publico": { blockTitle: "Contador público" },
  "administrador-de-empresas": { blockTitle: "Administrador de empresas" },
  "ingeniero-industrial": { blockTitle: "Ingeniero industrial" },
  "ingeniero-en-procesos": { blockTitle: "Ingeniero en procesos" },
  "especialista-en-seguridad-industrial": { blockTitle: "Especialista en seguridad industrial" },
  manufactura: { blockTitle: "Manufactura" },
  maquila: { blockTitle: "Maquila" },
  "automatizacion-industrial": { blockTitle: "Automatización industrial" },
  "maquinaria-industrial": { blockTitle: "Maquinaria industrial" },
  "soldadura-industrial": { blockTitle: "Soldadura industrial" },
  "supervisor-industrial": { blockTitle: "Supervisor industrial" },
  "tecnico-industrial": { blockTitle: "Técnico industrial" },
  "seguridad-industrial": { blockTitle: "Seguridad industrial" },
  "mantenimiento-industrial": { blockTitle: "Mantenimiento industrial" },
  "limpieza-industrial": { blockTitle: "Limpieza industrial" },
  outsourcing: { blockTitle: "Outsourcing" },
  "call-center": { blockTitle: "Call center" },
  "centro-de-negocios-empresarial": { blockTitle: "Centro de negocios empresarial" },
  "ingenieria-industrial": { blockTitle: "Ingeniería industrial" },
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
    profesionistaCedula: PACK_PROFESIONISTA_SUBS.has(subId),
    negocioLocal: PACK_NEGOCIO_SUBS.has(subId),
    personaIndependiente: !PACK_PROFESIONISTA_SUBS.has(subId) && !PACK_NEGOCIO_SUBS.has(subId),
  };
}

export function buildIndustriaSubDeltas(catalogRows) {
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
