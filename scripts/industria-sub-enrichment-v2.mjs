/**
 * MP-INDUSTRIA-ENRICH-V2 — copy, hints y labels por sub (33 subs).
 */
const BASE_AYUDA = {
  modalidadServicioIndustrial: "Planta, sitio del cliente, remoto o mixto — nunca modalidad escort ni hotel.",
  serviciosIndustriales: "Consultoría, auditoría, mantenimiento, producción… sé específico.",
  sectoresIndustriales: "Automotriz, alimentos, metalmecánica, logística…",
  coberturaGeografica: "Plantas, parques industriales o zona de cobertura.",
  certificacionesIndustriales: "ISO 9001, ISO 45001, NOM, IATF…",
  diferenciadorIndustrial: "Ej. ISO certificado · Planta propia · Respuesta 24 h",
  colaboracionesComerciales: "¿Colaboras con maquiladoras, integradores o plantas?",
  tiempoRespuestaIndustrial: "Tiempo habitual para responder o cotizar.",
  capacidadProduccion: "Ej. 10,000 pzas/mes · 3 líneas · turno 24 h",
};

function enrich(blockHint, extra = {}) {
  return {
    blockHint,
    fieldLabels: extra.fieldLabels || {},
    textosAyuda: { ...BASE_AYUDA, ...(extra.textosAyuda || {}) },
    extraFields: extra.extraFields,
  };
}

/** @type {Record<string, object>} */
export const SUB_ENRICHMENT_V2 = {
  "consultor-empresarial-independiente": enrich(
    "Consultor empresarial — servicios, sectores y cobertura generan confianza.",
    { fieldLabels: { serviciosIndustriales: "Servicios de consultoría" } }
  ),
  "auditor-independiente": enrich(
    "Auditor independiente — tipos de auditoría y certificaciones.",
    { fieldLabels: { certificacionesIndustriales: "Normas que auditas" } }
  ),
  "reclutador-independiente": enrich(
    "Reclutador — perfiles, sectores y modalidad.",
    { fieldLabels: { serviciosIndustriales: "Servicios de reclutamiento" } }
  ),
  "asesor-de-procesos": enrich(
    "Asesor de procesos — mejoras, lean y cobertura.",
    { fieldLabels: { procesosIndustriales: "Procesos que optimizas" } }
  ),
  "inspector-de-calidad": enrich(
    "Inspector de calidad — inspecciones y normas.",
    { fieldLabels: { serviciosIndustriales: "Tipos de inspección" } }
  ),
  "consultor-iso": enrich(
    "Consultor ISO — implementación y certificación.",
    { fieldLabels: { certificacionesIndustriales: "Normas ISO" } }
  ),
  "gestor-de-tramites-empresariales": enrich(
    "Gestor de trámites — permisos, licencias y cobertura.",
    { fieldLabels: { serviciosIndustriales: "Trámites que gestionas" } }
  ),
  "consultoria-fiscal": enrich(
    "Consultoría fiscal — servicios y sectores atendidos.",
    { fieldLabels: { serviciosIndustriales: "Servicios fiscales" } }
  ),
  "consultoria-legal": enrich(
    "Consultoría legal — áreas corporativa y laboral.",
    { fieldLabels: { serviciosIndustriales: "Servicios legales" } }
  ),
  "certificaciones-iso": enrich(
    "Certificaciones ISO — normas y modalidad de apoyo.",
    { fieldLabels: { certificacionesIndustriales: "Certificaciones que apoyas" } }
  ),
  "servicios-contables": enrich(
    "Servicios contables — nómina, fiscal y reportes.",
    { fieldLabels: { serviciosIndustriales: "Servicios contables" } }
  ),
  "servicios-administrativos": enrich(
    "Servicios administrativos — back office y cobertura.",
    { fieldLabels: { serviciosIndustriales: "Servicios administrativos" } }
  ),
  "servicios-corporativos": enrich(
    "Servicios corporativos — soporte B2B y modalidad.",
    { fieldLabels: { sectoresIndustriales: "Industrias que atiendes" } }
  ),
  "empaques-y-embalaje": enrich(
    "Empaques y embalaje — materiales, volumen y cobertura.",
    { fieldLabels: { capacidadProduccion: "Volumen o capacidad" } }
  ),
  "contador-publico": enrich(
    "Contador público — servicios, especialidad y modalidad (cédula).",
    { fieldLabels: { serviciosProfesionalesIndustrial: "Servicios contables profesionales" } }
  ),
  "administrador-de-empresas": enrich(
    "Administrador de empresas — consultoría gerencial y procesos.",
    { fieldLabels: { especialidadIndustrial: "Especialidad (cédula)" } }
  ),
  "ingeniero-industrial": enrich(
    "Ingeniero industrial — procesos, planta y optimización.",
    { fieldLabels: { procesosIndustriales: "Procesos que diseñas o optimizas" } }
  ),
  "ingeniero-en-procesos": enrich(
    "Ingeniero en procesos — mejora continua y layout.",
    { fieldLabels: { serviciosProfesionalesIndustrial: "Servicios de ingeniería" } }
  ),
  "especialista-en-seguridad-industrial": enrich(
    "Seguridad industrial — NOM-030, riesgos y capacitación.",
    { fieldLabels: { certificacionesIndustriales: "Normas de seguridad" } }
  ),
  manufactura: enrich(
    "Manufactura — procesos, capacidad y certificaciones.",
    { fieldLabels: { capacidadProduccion: "Capacidad productiva" } }
  ),
  maquila: enrich(
    "Maquila — procesos, sectores y volumen.",
    { fieldLabels: { procesosIndustriales: "Procesos de maquila" } }
  ),
  "automatizacion-industrial": enrich(
    "Automatización industrial — PLC, robots e integración.",
    { fieldLabels: { equipamientoIndustrial: "Tecnologías que integras" } }
  ),
  "maquinaria-industrial": enrich(
    "Maquinaria industrial — venta, renta o servicio.",
    { fieldLabels: { serviciosEmpresaIndustrial: "Servicios de maquinaria" } }
  ),
  "soldadura-industrial": enrich(
    "Soldadura industrial — procesos, certificaciones y cobertura.",
    { fieldLabels: { procesosIndustriales: "Tipos de soldadura" } }
  ),
  "supervisor-industrial": enrich(
    "Supervisor industrial — turnos, procesos y planta.",
    { fieldLabels: { serviciosEmpresaIndustrial: "Servicios de supervisión" } }
  ),
  "tecnico-industrial": enrich(
    "Técnico industrial — mantenimiento, calibración y soporte.",
    { fieldLabels: { serviciosEmpresaIndustrial: "Servicios técnicos" } }
  ),
  "seguridad-industrial": enrich(
    "Seguridad industrial — EPP, capacitación y cumplimiento.",
    { fieldLabels: { certificacionesIndustriales: "Normas y cumplimiento" } }
  ),
  "mantenimiento-industrial": enrich(
    "Mantenimiento industrial — preventivo, correctivo y planta.",
    { fieldLabels: { serviciosEmpresaIndustrial: "Tipos de mantenimiento" } }
  ),
  "limpieza-industrial": enrich(
    "Limpieza industrial — planta, equipos y turnos.",
    { fieldLabels: { serviciosEmpresaIndustrial: "Servicios de limpieza" } }
  ),
  outsourcing: enrich(
    "Outsourcing — procesos tercerizados y cobertura.",
    { fieldLabels: { serviciosEmpresaIndustrial: "Procesos tercerizados" } }
  ),
  "call-center": enrich(
    "Call center — servicios, idiomas y cobertura.",
    { fieldLabels: { serviciosEmpresaIndustrial: "Servicios del call center" } }
  ),
  "centro-de-negocios-empresarial": enrich(
    "Centro de negocios — oficinas, servicios y ubicación.",
    { fieldLabels: { serviciosEmpresaIndustrial: "Servicios del centro" } }
  ),
  "ingenieria-industrial": enrich(
    "Ingeniería industrial — proyectos, planta y sectores.",
    { fieldLabels: { serviciosEmpresaIndustrial: "Servicios de la firma" } }
  ),
};

export function mergeEnrichmentV2(baseProfile, subId) {
  const enrichData = SUB_ENRICHMENT_V2[subId];
  if (!enrichData) return baseProfile;
  const out = { ...baseProfile };
  if (enrichData.blockHint) out.blockHint = enrichData.blockHint;
  if (enrichData.fieldLabels) {
    out.fieldLabels = { ...(out.fieldLabels || {}), ...enrichData.fieldLabels };
  }
  out.textosAyuda = { ...(out.textosAyuda || {}), ...(enrichData.textosAyuda || {}) };
  if (enrichData.extraFields) {
    out.extraFields = [...new Set([...(out.extraFields || []), ...enrichData.extraFields])];
  }
  return out;
}
