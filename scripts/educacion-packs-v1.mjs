/**
 * MP-EDUCACION-DELTAS-V1 — packs A–E y mapa subcategoría → pack (30 subs).
 */
export const PACK_IDS = ["A", "B", "C", "D", "E"];

export const PACK_LABELS = {
  A: "Docencia e instructores",
  B: "Profesionales certificados",
  C: "Academias especializadas",
  D: "Centros e instituciones",
  E: "Educación formal y alternativa",
};

export const EDUCACION_FIELD_REGISTRY = {
  modalidadEducacion: {
    id: "modalidadEducacion",
    label: "Modalidad de enseñanza",
    tipo: "enum",
    opciones: ["presencial", "online", "hibrido", "domicilio", "instalaciones"],
  },
  serviciosEducacion: {
    id: "serviciosEducacion",
    label: "Servicios educativos",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosEmpresaEducacion: {
    id: "serviciosEmpresaEducacion",
    label: "Servicios del centro",
    tipo: "checklist",
    iaCopy: true,
  },
  materiasEducativas: {
    id: "materiasEducativas",
    label: "Materias o áreas",
    tipo: "checklist",
  },
  nivelesEducativos: {
    id: "nivelesEducativos",
    label: "Niveles educativos",
    tipo: "checklist",
  },
  edadesAtendidas: {
    id: "edadesAtendidas",
    label: "Edades que atiendes",
    tipo: "checklist",
  },
  formatoClase: {
    id: "formatoClase",
    label: "Formato de clase",
    tipo: "checklist",
  },
  especialidadEducativa: {
    id: "especialidadEducativa",
    label: "Especialidad educativa",
    tipo: "text",
    maxLength: 120,
  },
  serviciosProfesionalesEducacion: {
    id: "serviciosProfesionalesEducacion",
    label: "Servicios profesionales",
    tipo: "checklist",
  },
  certificacionesEducativas: {
    id: "certificacionesEducativas",
    label: "Certificaciones / acreditaciones",
    tipo: "text",
    maxLength: 160,
  },
  idiomasEnsenanza: {
    id: "idiomasEnsenanza",
    label: "Idiomas que enseñas",
    tipo: "checklist",
  },
  tiempoRespuestaEducacion: {
    id: "tiempoRespuestaEducacion",
    label: "Tiempo de respuesta",
    tipo: "enum",
    opciones: ["inmediato", "mismo_dia", "24_48h", "por_cita"],
  },
  diferenciadorEducacion: {
    id: "diferenciadorEducacion",
    label: "Tu sello educativo",
    tipo: "text",
    maxLength: 160,
    iaCopy: true,
  },
  coberturaGeografica: {
    id: "coberturaGeografica",
    label: "Zona de cobertura",
    tipo: "text",
    maxLength: 120,
    iaCopy: true,
  },
  colaboracionesComerciales: {
    id: "colaboracionesComerciales",
    label: "¿Colaboras con escuelas, empresas o instituciones?",
    tipo: "enum",
    opciones: ["si_activo", "ocasional", "convenir", "no"],
  },
  tiposColaboracionComercial: {
    id: "tiposColaboracionComercial",
    label: "Tipo de colaboraciones",
    tipo: "checklist",
  },
};

export const SUB_TO_PACK = {
  "maestro-particular": "A",
  "tutor-academico": "A",
  "profesor-de-idiomas": "A",
  "profesor-de-matematicas": "A",
  "profesor-de-musica": "A",
  "profesor-de-arte": "A",
  "coach-educativo": "A",
  "instructor-de-manejo": "A",
  "instructor-deportivo": "A",
  "instructor-de-computacion": "A",
  psicopedagogo: "B",
  pedagogo: "B",
  "docente-certificado": "B",
  "especialista-en-educacion-especial": "B",
  "academia-de-idiomas": "C",
  "escuela-de-musica": "C",
  "escuela-de-arte": "C",
  "escuela-de-manejo": "C",
  "escuela-tecnica": "C",
  "capacitador-empresarial": "D",
  "centro-de-capacitacion": "D",
  "instituto-educativo": "D",
  "centro-de-certificaciones": "D",
  "plataforma-educativa": "D",
  escuelas: "D",
  universidades: "E",
  "cursos-en-linea": "E",
  preparatoria: "E",
  guarderias: "E",
  "talleres-creativos": "E",
};

export const PACK_PROFESIONISTA_SUBS = new Set([
  "psicopedagogo",
  "pedagogo",
  "docente-certificado",
  "especialista-en-educacion-especial",
]);

export const PACK_NEGOCIO_SUBS = new Set([
  "capacitador-empresarial",
  "academia-de-idiomas",
  "escuela-de-musica",
  "escuela-de-arte",
  "centro-de-capacitacion",
  "instituto-educativo",
  "escuela-tecnica",
  "escuela-de-manejo",
  "centro-de-certificaciones",
  "plataforma-educativa",
  "escuelas",
]);

export function packPlantillaKey(pack) {
  return `educacion_pack_${pack.toLowerCase()}`;
}

export function formularioIdForSub(subId) {
  if (PACK_PROFESIONISTA_SUBS.has(subId)) return "profesionista_cedula";
  if (PACK_NEGOCIO_SUBS.has(subId)) return "negocio_empresa";
  return "persona_independiente";
}
