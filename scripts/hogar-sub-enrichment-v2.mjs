/**
 * MP-HOGAR-ENRICH-V2 — copy, hints y labels por sub (17 subs).
 */
const BASE_AYUDA = {
  modalidadServicioHogar: "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
  serviciosHogar: "Sé específico con los servicios que realmente ofreces.",
  especialidadesHogar: "Instalación, reparación, mantenimiento, obra menor…",
  tiposInmueble: "Casa, departamento, local comercial, condominio…",
  coberturaGeografica: "Colonias, municipios o zona metropolitana.",
  tiempoRespuestaHogar: "Tiempo habitual para atender una solicitud.",
  garantiaServicioHogar: "Ej. 30 días mano de obra · 1 año en impermeabilización",
  diferenciadorHogar: "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
  colaboracionesComerciales: "¿Trabajas con arquitectos, contratistas u otros oficios?",
  materialesIncluidos: "Indica si cotizas solo mano de obra o incluyes materiales.",
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
  plomeros: enrich(
    "Plomería — urgencias, tipos de trabajo y cobertura generan confianza.",
    { fieldLabels: { serviciosHogar: "¿Qué servicios de plomería ofreces?", tiempoRespuestaHogar: "¿Atiendes urgencias?" } }
  ),
  albaniles: enrich(
    "Albañilería — tipos de obra, materiales y garantía del trabajo.",
    { fieldLabels: { tiposTrabajoHogar: "¿Qué trabajos de albañilería haces?" } }
  ),
  impermeabilizadores: enrich(
    "Impermeabilización — tipos de superficie, garantía y materiales.",
    { fieldLabels: { garantiaServicioHogar: "Garantía de impermeabilización" } }
  ),
  electricistas: enrich(
    "Electricidad residencial — servicios, especialidades y tiempos de respuesta.",
    { fieldLabels: { serviciosHogar: "Servicios eléctricos", especialidadesHogar: "Especialidades" } }
  ),
  "tecnicos-en-clima-hvac": enrich(
    "Clima / HVAC — instalación, mantenimiento y marcas que manejas.",
    { fieldLabels: { serviciosHogar: "Servicios de clima", especialidadesHogar: "Sistemas que atiendes" } }
  ),
  "instaladores-de-paneles-solares": enrich(
    "Paneles solares — instalación, mantenimiento y tipos de proyecto.",
    { fieldLabels: { tiposTrabajoHogar: "Tipos de instalación solar" } }
  ),
  "tecnicos-en-camaras-de-seguridad": enrich(
    "CCTV y seguridad — instalación, configuración y soporte.",
    { fieldLabels: { serviciosHogar: "Servicios de videovigilancia" } }
  ),
  "domotica-casa-inteligente": enrich(
    "Domótica — automatización, integración y marcas compatibles.",
    { fieldLabels: { serviciosHogar: "Servicios de casa inteligente" } }
  ),
  carpinteros: enrich(
    "Carpintería — muebles, closets, reparaciones y acabados.",
    { fieldLabels: { tiposTrabajoHogar: "Tipos de carpintería" } }
  ),
  herreros: enrich(
    "Herrería — rejas, portones, estructuras y soldadura.",
    { fieldLabels: { serviciosHogar: "Servicios de herrería" } }
  ),
  "instaladores-de-pisos": enrich(
    "Pisos — cerámica, madera, vinílico y preparación de superficie.",
    { fieldLabels: { tiposTrabajoHogar: "Tipos de piso que instalas" } }
  ),
  cerrajeros: enrich(
    "Cerrajería — aperturas, cambio de chapas y urgencias.",
    { fieldLabels: { tiempoRespuestaHogar: "Tiempo de llegada en urgencia" } }
  ),
  pintores: enrich(
    "Pintura — interiores, exteriores, acabados y preparación.",
    { fieldLabels: { tiposTrabajoHogar: "Tipos de pintura" } }
  ),
  jardineria: enrich(
    "Jardinería — mantenimiento, diseño y poda.",
    { fieldLabels: { serviciosHogar: "Servicios de jardinería" } }
  ),
  fumigacion: enrich(
    "Fumigación — plagas, frecuencia y tipos de inmueble.",
    { fieldLabels: { especialidadesHogar: "Plagas o servicios" } }
  ),
  "limpieza-del-hogar": enrich(
    "Limpieza del hogar — profunda, regular, post-obra o por evento.",
    { fieldLabels: { serviciosHogar: "Tipos de limpieza" } }
  ),
  "mantenimiento-general": enrich(
    "Mantenimiento general — oficios múltiples, visitas programadas.",
    { fieldLabels: { serviciosHogar: "Servicios de mantenimiento" } }
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
