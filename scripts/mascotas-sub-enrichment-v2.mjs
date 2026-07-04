/**
 * MP-MASCOTAS-ENRICH-V2 — copy, hints y labels por sub (20 subs).
 */
const BASE_AYUDA = {
  modalidadServicioMascotas: "Domicilio, consultorio, clínica o en línea — nunca hotel ni modalidad escort.",
  serviciosMascotas: "Sé específico con los servicios que realmente ofreces.",
  especiesAtendidas: "Perros, gatos, aves, reptiles u otras especies.",
  coberturaGeografica: "Colonias, municipios o zona de paseo / reparto.",
  diferenciadorMascotas: "Ej. Certificado · Amor por los animales · Emergencias 24 h",
  colaboracionesComerciales: "¿Trabajas con veterinarios, refugios o tiendas?",
  capacidadInstalacion: "Ej. 10 perros · 5 gatos · cupo diario",
  tiempoRespuestaMascotas: "Tiempo habitual para responder o agendar.",
  serviciosVeterinarios: "Consulta, vacunas, cirugía, urgencias…",
  emergenciasMascotas: "Indica si atiendes urgencias y en qué horario.",
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
  "paseador-de-perros": enrich(
    "Paseo de perros — rutas, tamaños y modalidad generan confianza.",
    { fieldLabels: { serviciosMascotas: "¿Qué incluye el paseo?", coberturaGeografica: "¿Qué zonas recorres?" } }
  ),
  "cuidador-de-mascotas": enrich(
    "Cuidado de mascotas — visitas, alimentación y especies atendidas.",
    { fieldLabels: { modalidadServicioMascotas: "¿Dónde cuidas a las mascotas?" } }
  ),
  "guarderia-para-mascotas": enrich(
    "Guardería — cupo, horarios y especies que recibes.",
    { fieldLabels: { capacidadInstalacion: "Cupo disponible" } }
  ),
  "hotel-para-mascotas": enrich(
    "Hotel para mascotas — hospedaje, servicios extra y capacidad.",
    { fieldLabels: { serviciosMascotas: "Servicios de hospedaje" } }
  ),
  "entrenador-canino": enrich(
    "Entrenamiento canino — métodos, edades y tipos de problema.",
    { fieldLabels: { serviciosMascotas: "Servicios de entrenamiento" } }
  ),
  adiestrador: enrich(
    "Adiestramiento — obediencia, corrección y modalidad.",
    { fieldLabels: { serviciosMascotas: "Tipos de adiestramiento" } }
  ),
  "centro-de-entrenamiento-canino": enrich(
    "Centro de entrenamiento — programas, instalaciones y cupo.",
    { fieldLabels: { serviciosEmpresaMascotas: "Programas del centro" } }
  ),
  groomer: enrich(
    "Groomer — baño, corte y especies que atiendes.",
    { fieldLabels: { serviciosMascotas: "Servicios de estética" } }
  ),
  "estetica-canina": enrich(
    "Estética canina — servicios del establecimiento y cupo.",
    { fieldLabels: { serviciosEmpresaMascotas: "Servicios de estética" } }
  ),
  "fotografo-de-mascotas": enrich(
    "Fotografía de mascotas — sesiones, estilos y modalidad.",
    { fieldLabels: { serviciosMascotas: "Tipos de sesión fotográfica" } }
  ),
  "medico-veterinario": enrich(
    "Médico veterinario — especialidad, servicios y modalidad de consulta.",
    { fieldLabels: { especialidadVeterinaria: "Especialidad (cédula)", serviciosVeterinarios: "Servicios que ofreces" } }
  ),
  "veterinario-especialista": enrich(
    "Veterinario especialista — subespecialidad y tipos de caso.",
    { fieldLabels: { especialidadesVeterinarias: "Áreas de especialidad" } }
  ),
  "cirujano-veterinario": enrich(
    "Cirugía veterinaria — procedimientos, especies y urgencias.",
    { fieldLabels: { serviciosVeterinarios: "Tipos de cirugía" } }
  ),
  "clinica-veterinaria": enrich(
    "Clínica veterinaria — servicios, especialidades y emergencias.",
    { fieldLabels: { serviciosEmpresaMascotas: "Servicios de la clínica" } }
  ),
  "hospital-veterinario": enrich(
    "Hospital veterinario — urgencias 24 h, especialidades e internamiento.",
    { fieldLabels: { emergenciasMascotas: "Cobertura de emergencias" } }
  ),
  "farmacia-veterinaria": enrich(
    "Farmacia veterinaria — productos, surtido y venta con receta.",
    { fieldLabels: { serviciosVeterinarios: "Productos y servicios" } }
  ),
  "tienda-de-mascotas": enrich(
    "Tienda de mascotas — productos, mascotas y servicios extra.",
    { fieldLabels: { serviciosMascotas: "Qué vendes u ofreces" } }
  ),
  "criadero-autorizado": enrich(
    "Criadero autorizado — razas, registros y políticas.",
    { fieldLabels: { especiesAtendidas: "Especies / razas", capacidadInstalacion: "Camadas o cupo" } }
  ),
  "rescatista-independiente": enrich(
    "Rescate independiente — adopciones, rehabilitación y cobertura.",
    { fieldLabels: { serviciosMascotas: "Actividades de rescate" } }
  ),
  "servicio-funerario-para-mascotas": enrich(
    "Servicio funerario — cremación, urnas y despedidas.",
    { fieldLabels: { serviciosMascotas: "Servicios funerarios" } }
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
