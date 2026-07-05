/**
 * MP-BIENES-RAICES-ENRICH-V2 — copy, hints y labels por sub (27 subs).
 */
const BASE_AYUDA = {
  modalidadOperacionInmobiliaria: "Venta, renta, desarrollo o administración — nunca modalidad escort ni hotel genérico.",
  serviciosInmobiliarios: "Sé específico: captación, promoción, trámite, valuación…",
  tiposInmuebleInmobiliario: "Casas, departamentos, terrenos, locales u oficinas.",
  coberturaGeografica: "Colonias, municipios o zona donde operas.",
  rangoPrecioInmobiliario: "Ej. Desde $2M · Renta $12k–$25k",
  caracteristicasInmueble: "Ej. 85 m² · 2 rec · estacionamiento · amenidades",
  diferenciadorInmobiliario: "Ej. AMPI · Trato directo · Sin comisión oculta",
  colaboracionesComerciales: "¿Trabajas con notarías, bancos o desarrolladoras?",
  tiempoRespuestaInmobiliaria: "Tiempo habitual para responder o agendar visita.",
  amenidadesInmueble: "Alberca, gym, seguridad, pet friendly…",
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
  "agente-inmobiliario-independiente": enrich(
    "Agente inmobiliario — servicios, zonas y tipos de inmueble generan confianza.",
    { fieldLabels: { serviciosInmobiliarios: "¿Qué servicios ofreces?" } }
  ),
  "asesor-inmobiliario": enrich(
    "Asesor inmobiliario — especialidad y cobertura geográfica.",
    { fieldLabels: { especialidadesInmobiliarias: "Áreas de asesoría" } }
  ),
  "corredor-inmobiliario": enrich(
    "Corredor inmobiliario — operaciones y tipos de cliente.",
    { fieldLabels: { modalidadOperacionInmobiliaria: "¿Qué operaciones manejas?" } }
  ),
  "promotor-de-propiedades": enrich(
    "Promotor de propiedades — desarrollos y tipos de inmueble.",
    { fieldLabels: { serviciosInmobiliarios: "Servicios de promoción" } }
  ),
  "administrador-de-propiedades": enrich(
    "Administrador de propiedades — servicios de administración y cobertura.",
    { fieldLabels: { serviciosInmobiliarios: "Servicios de administración" } }
  ),
  "valuador-inmobiliario": enrich(
    "Valuador inmobiliario — tipos de valuación y zonas.",
    { fieldLabels: { serviciosInmobiliarios: "Tipos de valuación" } }
  ),
  "rentas-vacacionales-independiente": enrich(
    "Rentas vacacionales — modalidad temporal y amenidades.",
    { fieldLabels: { modalidadOperacionInmobiliaria: "Modalidad de hospedaje temporal" } }
  ),
  "rentas-temporales-independiente": enrich(
    "Rentas temporales — estancia corta y cobertura.",
    { fieldLabels: { caracteristicasInmueble: "Características del alojamiento" } }
  ),
  inmobiliaria: enrich(
    "Inmobiliaria — servicios de la empresa y especialidades.",
    { fieldLabels: { serviciosEmpresaInmobiliaria: "Servicios de la inmobiliaria" } }
  ),
  "agencia-de-bienes-raices": enrich(
    "Agencia de bienes raíces — operaciones y cobertura.",
    { fieldLabels: { serviciosEmpresaInmobiliaria: "Servicios de la agencia" } }
  ),
  "desarrolladora-inmobiliaria": enrich(
    "Desarrolladora — proyectos, amenidades y tipos de inmueble.",
    { fieldLabels: { amenidadesInmueble: "Amenidades de desarrollos" } }
  ),
  constructora: enrich(
    "Constructora — tipos de obra y proyectos inmobiliarios.",
    { fieldLabels: { serviciosEmpresaInmobiliaria: "Servicios de construcción" } }
  ),
  "administracion-de-condominios": enrich(
    "Administración de condominios — servicios y cobertura.",
    { fieldLabels: { serviciosEmpresaInmobiliaria: "Servicios de administración" } }
  ),
  "venta-de-casas": enrich(
    "Venta de casas — características, rango de precio y zona.",
    { fieldLabels: { caracteristicasInmueble: "Características típicas de casas" } }
  ),
  "renta-de-casas": enrich(
    "Renta de casas — rango de renta, amenidades y cobertura.",
    { fieldLabels: { rangoPrecioInmobiliario: "Rango de renta mensual" } }
  ),
  "venta-de-departamentos": enrich(
    "Venta de departamentos — m², recámaras y amenidades.",
    { fieldLabels: { amenidadesInmueble: "Amenidades del edificio" } }
  ),
  "renta-de-departamentos": enrich(
    "Renta de departamentos — rango, amenidades y zona.",
    { fieldLabels: { rangoPrecioInmobiliario: "Rango de renta" } }
  ),
  "venta-de-terrenos": enrich(
    "Venta de terrenos — superficie, uso de suelo y ubicación.",
    { fieldLabels: { caracteristicasInmueble: "Superficie y uso de suelo" } }
  ),
  "venta-de-locales-comerciales": enrich(
    "Venta de locales — metraje, ubicación y tipo de negocio.",
    { fieldLabels: { tiposInmuebleInmobiliario: "Tipos de local" } }
  ),
  "renta-de-locales-comerciales": enrich(
    "Renta de locales — rango de renta y zonas comerciales.",
    { fieldLabels: { rangoPrecioInmobiliario: "Rango de renta comercial" } }
  ),
  "venta-de-bodegas": enrich(
    "Venta de bodegas — metraje, acceso y uso industrial.",
    { fieldLabels: { caracteristicasInmueble: "Metraje y acceso" } }
  ),
  "renta-de-bodegas": enrich(
    "Renta de bodegas — rango de renta y cobertura logística.",
    { fieldLabels: { rangoPrecioInmobiliario: "Rango de renta" } }
  ),
  "venta-de-oficinas": enrich(
    "Venta de oficinas — m², ubicación y amenidades.",
    { fieldLabels: { amenidadesInmueble: "Amenidades de oficina" } }
  ),
  "renta-de-oficinas": enrich(
    "Renta de oficinas — rango, amenidades y zona corporativa.",
    { fieldLabels: { rangoPrecioInmobiliario: "Rango de renta" } }
  ),
  "renta-vacacional": enrich(
    "Renta vacacional — estancia temporal, amenidades y cobertura.",
    { fieldLabels: { caracteristicasInmueble: "Tipo de propiedad vacacional" } }
  ),
  coworking: enrich(
    "Coworking — planes, amenidades y capacidad.",
    { fieldLabels: { serviciosEmpresaInmobiliaria: "Planes y servicios" } }
  ),
  "centros-de-negocios-y-oficinas": enrich(
    "Centros de negocios — oficinas, servicios y ubicación.",
    { fieldLabels: { serviciosEmpresaInmobiliaria: "Servicios del centro" } }
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
