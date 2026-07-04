/**
 * MP-EDUCACION-ENRICH-V2 — copy, hints y labels por sub (30 subs).
 */
const BASE_AYUDA = {
  modalidadEducacion: "Presencial, en línea, híbrido o a domicilio — nunca modalidad escort ni hotel.",
  serviciosEducacion: "Clases, tutorías, cursos, certificaciones… sé específico.",
  materiasEducativas: "Materias, idiomas, deportes o áreas que enseñas.",
  nivelesEducativos: "Preescolar, primaria, secundaria, universidad, adultos…",
  coberturaGeografica: "Colonias, municipios o alcance en línea.",
  diferenciadorEducacion: "Ej. Resultados comprobables · Grupos reducidos · Certificación",
  colaboracionesComerciales: "¿Colaboras con escuelas, empresas o instituciones?",
  tiempoRespuestaEducacion: "Tiempo habitual para responder o agendar.",
  edadesAtendidas: "Infantil, adolescentes, adultos…",
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
  "maestro-particular": enrich(
    "Maestro particular — materias, niveles y modalidad generan confianza.",
    { fieldLabels: { materiasEducativas: "Materias que enseñas" } }
  ),
  "tutor-academico": enrich(
    "Tutor académico — apoyo escolar y preparación de exámenes.",
    { fieldLabels: { serviciosEducacion: "Tipos de tutoría" } }
  ),
  "profesor-de-idiomas": enrich(
    "Profesor de idiomas — idiomas, niveles y modalidad.",
    { fieldLabels: { idiomasEnsenanza: "Idiomas que impartes" } }
  ),
  "profesor-de-matematicas": enrich(
    "Profesor de matemáticas — niveles y tipos de apoyo.",
    { fieldLabels: { materiasEducativas: "Áreas de matemáticas" } }
  ),
  "profesor-de-musica": enrich(
    "Profesor de música — instrumentos, teoría y modalidad.",
    { fieldLabels: { materiasEducativas: "Instrumentos o disciplinas" } }
  ),
  "profesor-de-arte": enrich(
    "Profesor de arte — técnicas, edades y modalidad.",
    { fieldLabels: { materiasEducativas: "Disciplinas artísticas" } }
  ),
  "coach-educativo": enrich(
    "Coach educativo — habilidades, metas y modalidad.",
    { fieldLabels: { serviciosEducacion: "Servicios de coaching" } }
  ),
  "instructor-de-manejo": enrich(
    "Instructor de manejo — cursos, vehículos y modalidad.",
    { fieldLabels: { serviciosEducacion: "Tipos de curso" } }
  ),
  "instructor-deportivo": enrich(
    "Instructor deportivo — deportes, edades y modalidad.",
    { fieldLabels: { materiasEducativas: "Deportes o disciplinas" } }
  ),
  "instructor-de-computacion": enrich(
    "Instructor de computación — software, niveles y modalidad.",
    { fieldLabels: { materiasEducativas: "Temas técnicos" } }
  ),
  psicopedagogo: enrich(
    "Psicopedagogo — servicios, especialidad y modalidad (cédula).",
    { fieldLabels: { serviciosProfesionalesEducacion: "Servicios psicopedagógicos" } }
  ),
  pedagogo: enrich(
    "Pedagogo — asesoría pedagógica y modalidad.",
    { fieldLabels: { especialidadEducativa: "Especialidad (cédula)" } }
  ),
  "docente-certificado": enrich(
    "Docente certificado — materias, niveles y certificaciones.",
    { fieldLabels: { certificacionesEducativas: "Certificaciones docentes" } }
  ),
  "especialista-en-educacion-especial": enrich(
    "Educación especial — necesidades atendidas y modalidad.",
    { fieldLabels: { serviciosProfesionalesEducacion: "Tipos de apoyo" } }
  ),
  "academia-de-idiomas": enrich(
    "Academia de idiomas — programas, idiomas y modalidad.",
    { fieldLabels: { serviciosEmpresaEducacion: "Programas del centro" } }
  ),
  "escuela-de-musica": enrich(
    "Escuela de música — instrumentos, niveles e instalaciones.",
    { fieldLabels: { materiasEducativas: "Instrumentos y disciplinas" } }
  ),
  "escuela-de-arte": enrich(
    "Escuela de arte — técnicas, edades y programas.",
    { fieldLabels: { serviciosEmpresaEducacion: "Programas artísticos" } }
  ),
  "escuela-de-manejo": enrich(
    "Escuela de manejo — cursos, flota y certificaciones.",
    { fieldLabels: { certificacionesEducativas: "Permisos y acreditaciones" } }
  ),
  "escuela-tecnica": enrich(
    "Escuela técnica — carreras, certificaciones y modalidad.",
    { fieldLabels: { materiasEducativas: "Áreas técnicas" } }
  ),
  "capacitador-empresarial": enrich(
    "Capacitador empresarial — programas corporativos y cobertura.",
    { fieldLabels: { serviciosEmpresaEducacion: "Capacitaciones empresariales" } }
  ),
  "centro-de-capacitacion": enrich(
    "Centro de capacitación — cursos, certificaciones y modalidad.",
    { fieldLabels: { serviciosEmpresaEducacion: "Cursos del centro" } }
  ),
  "instituto-educativo": enrich(
    "Instituto educativo — programas, niveles y acreditaciones.",
    { fieldLabels: { nivelesEducativos: "Niveles que ofreces" } }
  ),
  "centro-de-certificaciones": enrich(
    "Centro de certificaciones — exámenes y acreditaciones.",
    { fieldLabels: { certificacionesEducativas: "Certificaciones que expides" } }
  ),
  "plataforma-educativa": enrich(
    "Plataforma educativa — cursos en línea y audiencia.",
    { fieldLabels: { modalidadEducacion: "Modalidad de la plataforma" } }
  ),
  escuelas: enrich(
    "Escuelas — niveles, programas y modalidad.",
    { fieldLabels: { serviciosEmpresaEducacion: "Servicios escolares" } }
  ),
  universidades: enrich(
    "Universidades — programas, licenciaturas y modalidad.",
    { fieldLabels: { nivelesEducativos: "Nivel académico" } }
  ),
  "cursos-en-linea": enrich(
    "Cursos en línea — temas, formato y audiencia.",
    { fieldLabels: { formatoClase: "Formato de los cursos" } }
  ),
  preparatoria: enrich(
    "Preparatoria — programas, modalidad y cobertura.",
    { fieldLabels: { serviciosEducacion: "Programas de preparatoria" } }
  ),
  guarderias: enrich(
    "Guarderías — edades, horarios y servicios.",
    { fieldLabels: { edadesAtendidas: "Edades que recibes" } }
  ),
  "talleres-creativos": enrich(
    "Talleres creativos — disciplinas, edades y modalidad.",
    { fieldLabels: { materiasEducativas: "Tipos de taller" } }
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
