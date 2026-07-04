/**
 * MP-TRANSPORTE-ENRICH-V2 — copy, hints y labels por sub (24 subs).
 */
const BASE_AYUDA = {
  modalidadServicioTransporte: "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
  coberturaGeografica: "Colonias, municipios, rutas fijas o cobertura metropolitana.",
  diferenciadorTransporte: "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
  colaboracionesComerciales: "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
  tiempoRespuestaTransporte: "Tiempo habitual de respuesta o llegada al punto de recolección.",
  permisosLicencias: "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
  capacidadCarga: "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
  serviciosTransportePersonas: "Traslados, ejecutivo, turismo, escolar, eventos…",
  serviciosMensajeria: "Paquetería, documentos, same-day, recolección programada…",
  serviciosFleteMudanza: "Flete local, mudanza casa/depto, embalaje, maniobras…",
  serviciosLogistica: "Distribución, cross-dock, almacenaje, rutas dedicadas…",
  serviciosEmpresaTransporte: "Servicios principales que ofrece tu empresa.",
  serviciosEspecialidadTransporte: "Import/export, renta con chofer, rutas internacionales…",
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
  "chofer-privado": enrich(
    "Chofer privado — vehículo, modalidad y cobertura generan confianza.",
    { fieldLabels: { serviciosTransportePersonas: "¿Qué servicios ofreces?", tipoVehiculoPasajeros: "¿Con qué vehículo trabajas?" } }
  ),
  "conductor-ejecutivo": enrich(
    "Conductor ejecutivo — discreción, vehículo y tipos de cliente son clave.",
    { fieldLabels: { tiposClientesTransporte: "¿A quién atiendes?", permisosLicencias: "Licencias y certificaciones" } }
  ),
  "transporte-ejecutivo": enrich(
    "Transporte ejecutivo corporativo — flota, SLA y cobertura metropolitana.",
    { fieldLabels: { serviciosTransportePersonas: "Servicios ejecutivos", tiposClientesTransporte: "Segmentos atendidos" } }
  ),
  "transporte-turistico": enrich(
    "Transporte turístico — rutas, tipos de tour y capacidad del vehículo.",
    { fieldLabels: { serviciosTransportePersonas: "Servicios turísticos", coberturaGeografica: "Destinos o rutas" } }
  ),
  "transporte-escolar": enrich(
    "Transporte escolar — permisos, rutas fijas y seguridad son prioritarios.",
    { fieldLabels: { permisosLicencias: "Permisos escolares / SCT", modalidadServicioTransporte: "¿Rutas fijas o bajo demanda?" } }
  ),
  mensajero: enrich(
    "Mensajería local — tiempos de respuesta y tipos de envío definen tu servicio.",
    { fieldLabels: { serviciosMensajeria: "¿Qué entregas?", tiposEnvio: "Tipos de paquete" } }
  ),
  "repartidor-local": enrich(
    "Reparto local — cobertura, vehículo y horarios de entrega.",
    { fieldLabels: { serviciosMensajeria: "Servicios de reparto", tipoVehiculoMensajeria: "Vehículo de reparto" } }
  ),
  motomensajero: enrich(
    "Motomensajería — rapidez en tráfico urbano y tipos de envío.",
    { fieldLabels: { tipoVehiculoMensajeria: "Motocicleta / scooter", tiempoRespuestaTransporte: "Tiempo de recolección" } }
  ),
  "courier-independiente": enrich(
    "Courier independiente — same-day, documentos o paquetería especializada.",
    { fieldLabels: { serviciosMensajeria: "Servicios courier", tiposEnvio: "Especialidad de envíos" } }
  ),
  "ultima-milla": enrich(
    "Última milla — integración con e-commerce y ventanas de entrega.",
    { fieldLabels: { serviciosMensajeria: "Servicios de última milla", tiposClientesTransporte: "Clientes (e-commerce, retail…)" } }
  ),
  "flete-ligero": enrich(
    "Flete ligero — capacidad, tipos de mercancía y cobertura local.",
    { fieldLabels: { serviciosFleteMudanza: "Servicios de flete", capacidadCarga: "Capacidad del vehículo" } }
  ),
  "mudanzas-pequenas": enrich(
    "Mudanzas pequeñas — servicios, personal de carga y cobertura.",
    { fieldLabels: { serviciosFleteMudanza: "Paquetes de mudanza", incluyePersonalCarga: "¿Incluyes ayudantes?" } }
  ),
  mudanzas: enrich(
    "Empresa de mudanzas — flota, embalaje y cobertura intermunicipal.",
    { fieldLabels: { flotaAproximada: "Unidades disponibles", serviciosFleteMudanza: "Servicios de mudanza" } }
  ),
  "operador-de-carga": enrich(
    "Operador de carga — rutas, tipos de carga y permisos.",
    { fieldLabels: { serviciosLogistica: "Operación de carga", tiposCarga: "Tipos de carga que manejas" } }
  ),
  "transporte-de-carga": enrich(
    "Transporte de carga — capacidad, rutas y tipos de mercancía.",
    { fieldLabels: { tiposCarga: "Tipos de carga", coberturaRutas: "Rutas frecuentes" } }
  ),
  "transporte-refrigerado": enrich(
    "Carga refrigerada — temperatura, permisos y tipos de producto.",
    { fieldLabels: { tiposCarga: "Productos refrigerados", capacidadCarga: "Capacidad y temperatura" } }
  ),
  "almacenes-y-bodegas": enrich(
    "Almacenaje y bodegas — servicios logísticos y cobertura.",
    { fieldLabels: { serviciosLogistica: "Servicios de almacén", coberturaGeografica: "Ubicación / zonas atendidas" } }
  ),
  "distribucion-de-mercancias": enrich(
    "Distribución de mercancías — rutas, clientes y tipos de producto.",
    { fieldLabels: { serviciosLogistica: "Servicios de distribución", coberturaRutas: "Rutas de distribución" } }
  ),
  "logistica-local": enrich(
    "Logística local — última milla B2B, rutas y almacenaje.",
    { fieldLabels: { serviciosLogistica: "Servicios logísticos locales", tamanoClienteTransporte: "Tamaño de clientes" } }
  ),
  "empresa-de-mensajeria": enrich(
    "Empresa de mensajería — flota, cobertura y tipos de envío.",
    { fieldLabels: { serviciosEmpresaTransporte: "Servicios de mensajería", flotaAproximada: "Unidades en operación" } }
  ),
  "empresa-de-paqueteria": enrich(
    "Empresa de paquetería — cobertura, SLA y especialidades.",
    { fieldLabels: { especialidadesEmpresaTransporte: "Especialidades de paquetería" } }
  ),
  "empresa-de-logistica": enrich(
    "Empresa de logística — servicios integrados y tamaño de cliente.",
    { fieldLabels: { serviciosEmpresaTransporte: "Servicios logísticos", tamanoClienteTransporte: "Clientes atendidos" } }
  ),
  "logistica-internacional": enrich(
    "Logística internacional — aduanas, corredores y tipos de carga.",
    { fieldLabels: { coberturaInternacional: "Países / aduanas", serviciosEspecialidadTransporte: "Servicios internacionales" } }
  ),
  "renta-de-camionetas": enrich(
    "Renta de camionetas — flota, modalidad y tipos de unidad.",
    { fieldLabels: { tiposVehiculoRenta: "Unidades en renta", serviciosEspecialidadTransporte: "Servicios de renta" } }
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
