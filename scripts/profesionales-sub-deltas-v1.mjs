/**
 * MP-PROFESIONALES-DELTAS-V1 — deltas públicos detallados por subcategoría (50).
 */
import { SUB_TO_PACK, PACK_LABELS, formularioIdForSub } from "./profesionales-packs-v1.mjs";
import { SUB_EXTRA_PROFILES } from "./profesionales-sub-extra-fields.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Profesionista con cédula",
    blockHint: "Datos públicos de consulta — cédula se valida en privado.",
    aliasPlaceholder: "Ej. Lic. Ana Pérez · Derecho civil",
    deltaFields: [
      "especialidadProfesional",
      "serviciosProfesionales",
      "modalidadAtencionProfesional",
      "precioConsulta",
      "horarioAtencion",
    ],
    obligatoriosDelta: [
      "nombreProfesional",
      "especialidadProfesional",
      "serviciosProfesionales",
      "modalidadAtencionProfesional",
      "precioConsulta",
      "horarioAtencion",
    ],
    textosAyuda: {
      especialidadProfesional: "Debe ser coherente con tu cédula profesional.",
      serviciosProfesionales: "Consultas, asesorías, dictámenes u otros servicios.",
      modalidadAtencionProfesional: "Consultorio, videollamada, híbrido o visita al cliente.",
    },
  },
  B: {
    blockTitle: "Despacho / firma profesional",
    blockHint: "Servicios del despacho — declara áreas y tamaño del equipo.",
    aliasPlaceholder: "Ej. Despacho Profesional Integral",
    deltaFields: ["serviciosDespacho", "areasPracticaDespacho", "tamanoEquipoDespacho", "modalidadAtencionProfesional"],
    obligatoriosDelta: [
      "alias",
      "serviciosDespacho",
      "areasPracticaDespacho",
      "tamanoEquipoDespacho",
      "modalidadAtencionProfesional",
      "horarioDetalle",
      "geo",
    ],
  },
  C: {
    blockTitle: "Legal, fiscal y trámites",
    blockHint: "Servicios fiscales, legales o de gestión — incluye modalidad de atención.",
    aliasPlaceholder: "Ej. Asesoría Fiscal · PyME",
    deltaFields: ["serviciosFiscalesLegales", "tiposClientesProfesionales", "modalidadAtencionProfesional"],
    obligatoriosDelta: [
      "alias",
      "serviciosFiscalesLegales",
      "modalidadAtencionProfesional",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  D: {
    blockTitle: "Arquitectura y servicios técnicos",
    blockHint: "Especialidad técnica y servicios — software o herramientas si aplica.",
    aliasPlaceholder: "Ej. Arq. García · Proyecto ejecutivo",
    deltaFields: ["especialidadTecnica", "serviciosTecnicos", "modalidadAtencionProfesional"],
    obligatoriosDelta: [
      "alias",
      "especialidadTecnica",
      "serviciosTecnicos",
      "modalidadAtencionProfesional",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  E: {
    blockTitle: "Consultoría y recursos humanos",
    blockHint: "Áreas de consultoría e industrias atendidas.",
    aliasPlaceholder: "Ej. Consultoría RH · Reclutamiento",
    deltaFields: ["areasConsultoria", "serviciosConsultoria", "modalidadAtencionProfesional"],
    obligatoriosDelta: [
      "alias",
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  F: {
    blockTitle: "Creativo, marketing y comunicación",
    blockHint: "Servicios creativos — incluye portafolio si aplica.",
    aliasPlaceholder: "Ej. Diseño Gráfico · Branding",
    deltaFields: ["serviciosCreativos", "especialidadCreativa", "modalidadAtencionProfesional"],
    obligatoriosDelta: [
      "alias",
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional",
      "portfolioURL",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  G: {
    blockTitle: "Seguros, finanzas y comercio",
    blockHint: "Servicios financieros o comerciales — no prometas rendimientos garantizados.",
    aliasPlaceholder: "Ej. Asesoría Financiera · Seguros",
    deltaFields: ["serviciosFinancieros", "tiposClientesProfesionales", "modalidadAtencionProfesional"],
    obligatoriosDelta: [
      "alias",
      "serviciosFinancieros",
      "modalidadAtencionProfesional",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  H: {
    blockTitle: "Negocio / empresa profesional",
    blockHint: "Datos del establecimiento — servicios y especialidades.",
    aliasPlaceholder: "Ej. Consultoría Empresarial Integral",
    deltaFields: ["serviciosEmpresariales", "especialidadesEmpresa", "tamanoEmpresaAtendida"],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "direccion",
      "horarioDetalle",
      "geo",
    ],
  },
};

export const SUB_DELTA_PATCHES = {
  abogados: { blockTitle: "Abogados" },
  contadores: { blockTitle: "Contadores" },
  ingenieros: { blockTitle: "Ingenieros" },
  "despachos-juridicos": { blockTitle: "Despachos jurídicos" },
  "despachos-contables": { blockTitle: "Despachos contables" },
  "despachos-de-arquitectura": { blockTitle: "Despachos de arquitectura" },
  "despachos-de-ingenieria": { blockTitle: "Despachos de ingeniería" },
  "asesoria-fiscal": { blockTitle: "Asesoría fiscal" },
  auditoria: { blockTitle: "Auditoría" },
  notarias: { blockTitle: "Notarías" },
  "corredurias-publicas": { blockTitle: "Corredurías públicas" },
  "gestoria-y-tramites": { blockTitle: "Gestoría y trámites" },
  arquitectos: { blockTitle: "Arquitectos" },
  topografia: { blockTitle: "Topografía" },
  avaluos: { blockTitle: "Avalúos" },
  peritos: { blockTitle: "Peritos" },
  "consultoria-financiera": { blockTitle: "Consultoría financiera" },
  "consultoria-de-negocios": { blockTitle: "Consultoría de negocios" },
  "recursos-humanos": { blockTitle: "Recursos humanos" },
  "reclutamiento-y-seleccion": { blockTitle: "Reclutamiento y selección" },
  "estudios-socioeconomicos": { blockTitle: "Estudios socioeconómicos" },
  "coaching-ejecutivo": { blockTitle: "Coaching ejecutivo" },
  "desarrollo-organizacional": { blockTitle: "Desarrollo organizacional" },
  franquicias: { blockTitle: "Franquicias" },
  "traduccion-e-interpretacion": { blockTitle: "Traducción e interpretación" },
  "marketing-y-publicidad": { blockTitle: "Marketing y publicidad" },
  "diseno-grafico": { blockTitle: "Diseño gráfico" },
  "diseno-de-interiores": { blockTitle: "Diseño de interiores" },
  "branding-e-identidad-corporativa": { blockTitle: "Branding e identidad corporativa" },
  "fotografia-profesional": { blockTitle: "Fotografía profesional" },
  "produccion-de-video": { blockTitle: "Producción de video" },
  "relaciones-publicas": { blockTitle: "Relaciones públicas" },
  "investigacion-de-mercados": { blockTitle: "Investigación de mercados" },
  seguros: { blockTitle: "Seguros" },
  "agentes-de-seguros": { blockTitle: "Agentes de seguros" },
  "asesoria-patrimonial": { blockTitle: "Asesoría patrimonial" },
  "asesoria-en-inversiones": { blockTitle: "Asesoría en inversiones" },
  "comercio-internacional": { blockTitle: "Comercio internacional" },
  "importacion-y-exportacion": { blockTitle: "Importación y exportación" },
  "certificaciones-y-normatividad": { blockTitle: "Certificaciones y normatividad" },
  "seguridad-e-higiene": { blockTitle: "Seguridad e higiene" },
  "gestion-de-calidad": { blockTitle: "Gestión de calidad" },
  "consultoria-ambiental": { blockTitle: "Consultoría ambiental" },
  "consultoria-empresarial": { blockTitle: "Consultoría empresarial" },
  "capacitacion-empresarial": { blockTitle: "Capacitación empresarial" },
  "agencias-de-marketing": { blockTitle: "Agencias de marketing" },
  "diseno-industrial": { blockTitle: "Diseño industrial" },
  "logistica-empresarial": { blockTitle: "Logística empresarial" },
  "proteccion-civil-empresarial": { blockTitle: "Protección civil empresarial" },
  "responsabilidad-social-empresarial": { blockTitle: "Responsabilidad social empresarial" },
};

function mergeDelta(subId, nombre, pack) {
  const base = PACK_DELTA_BASE[pack] || PACK_DELTA_BASE.B;
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
    formularioId: formularioIdForSub(subId, pack),
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
    negocioLocal: pack === "H",
    profesionistaCedula: pack === "A",
  };
}

export function buildProfesionalesSubDeltas(catalogRows) {
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
