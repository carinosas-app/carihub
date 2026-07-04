/**
 * MP-EDUCACION-DELTAS-V1 — campos extra, ocultos y opciones por subcategoría (30 subs).
 */
import {
  mergeHideAdultLeaks,
  HIDE_ADULT_LEAKS,
  COLABORACIONES_COMERCIALES_OPTIONS,
  TIPOS_COLABORACION_COMERCIAL,
} from "./registro-cross-sector-policy.mjs";
import { mergeEnrichmentV2 } from "./educacion-sub-enrichment-v2.mjs";
import { PACK_PROFESIONISTA_SUBS, PACK_NEGOCIO_SUBS } from "./educacion-packs-v1.mjs";

export const MODALIDAD_EDUCACION = [
  { value: "presencial", label: "Presencial" },
  { value: "online", label: "En línea" },
  { value: "hibrido", label: "Híbrido" },
  { value: "domicilio", label: "A domicilio" },
  { value: "instalaciones", label: "En instalaciones propias" },
];

export const TIEMPO_RESPUESTA_EDUCACION = [
  { value: "inmediato", label: "Inmediato" },
  { value: "mismo_dia", label: "Mismo día" },
  { value: "24_48h", label: "24–48 horas" },
  { value: "por_cita", label: "Con cita programada" },
];

export const NIVELES_EDUCATIVOS = [
  "Preescolar",
  "Primaria",
  "Secundaria",
  "Preparatoria",
  "Universidad",
  "Posgrado",
  "Adultos",
  "Empresarial",
  "Otro",
];

export const EDADES_ATENDIDAS = ["3–6 años", "7–12 años", "13–17 años", "18+ adultos", "Todas las edades"];

export const FORMATO_CLASE = ["Individual", "Grupal", "Taller", "Curso", "Diplomado", "Bootcamp", "Otro"];

export const IDIOMAS_ENSENANZA = ["Español", "Inglés", "Francés", "Alemán", "Italiano", "Portugués", "Otro"];

export { HIDE_ADULT_LEAKS };

const COLAB_OPTS = {
  colaboracionesComerciales: COLABORACIONES_COMERCIALES_OPTIONS,
  tiposColaboracionComercial: TIPOS_COLABORACION_COMERCIAL,
};

const COMMON = {
  extraFields: [
    "diferenciadorEducacion",
    "coberturaGeografica",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: { ...COLAB_OPTS },
  textosAyuda: {
    diferenciadorEducacion: "Ej. Grupos reducidos · Resultados · Certificación oficial",
    coberturaGeografica: "Zona presencial o alcance en línea.",
    colaboracionesComerciales: "¿Colaboras con escuelas, empresas o instituciones?",
  },
};

const BASE_PERSONA = {
  ...COMMON,
  extraFields: [
    "serviciosEducacion",
    "materiasEducativas",
    "nivelesEducativos",
    "modalidadEducacion",
    "formatoClase",
    "edadesAtendidas",
    "tiempoRespuestaEducacion",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosEducacion",
    "materiasEducativas",
    "modalidadEducacion",
    "coberturaGeografica",
    "tiempoRespuestaEducacion",
  ],
  fieldOptions: {
    modalidadEducacion: MODALIDAD_EDUCACION,
    tiempoRespuestaEducacion: TIEMPO_RESPUESTA_EDUCACION,
    nivelesEducativos: NIVELES_EDUCATIVOS,
    edadesAtendidas: EDADES_ATENDIDAS,
    formatoClase: FORMATO_CLASE,
    ...COLAB_OPTS,
  },
};

const BASE_VET_PROF = {
  ...COMMON,
  extraFields: [
    "serviciosProfesionalesEducacion",
    "especialidadEducativa",
    "materiasEducativas",
    "nivelesEducativos",
    "modalidadEducacion",
    "edadesAtendidas",
    "certificacionesEducativas",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "nombreProfesional",
    "especialidadEducativa",
    "serviciosProfesionalesEducacion",
    "modalidadEducacion",
    "precioConsulta",
    "horarioAtencion",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadEducacion: MODALIDAD_EDUCACION.filter((o) =>
      ["presencial", "online", "hibrido", "domicilio"].includes(o.value)
    ),
    nivelesEducativos: NIVELES_EDUCATIVOS,
    edadesAtendidas: EDADES_ATENDIDAS,
    ...COLAB_OPTS,
  },
};

const BASE_NEGOCIO = {
  ...COMMON,
  extraFields: [
    "serviciosEmpresaEducacion",
    "materiasEducativas",
    "nivelesEducativos",
    "modalidadEducacion",
    "formatoClase",
    "edadesAtendidas",
    "certificacionesEducativas",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "nombreComercial",
    "serviciosEmpresaEducacion",
    "materiasEducativas",
    "modalidadEducacion",
    "direccion",
    "horarioDetalle",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadEducacion: MODALIDAD_EDUCACION,
    nivelesEducativos: NIVELES_EDUCATIVOS,
    edadesAtendidas: EDADES_ATENDIDAS,
    formatoClase: FORMATO_CLASE,
    ...COLAB_OPTS,
  },
};

const SERVICIOS_DOCENCIA = [
  "Clases particulares",
  "Tutoría",
  "Preparación exámenes",
  "Refuerzo escolar",
  "Curso intensivo",
  "Otro",
];

/** Perfil por subcategoriaId */
export const SUB_EXTRA_PROFILES = {
  "maestro-particular": {
    ...BASE_PERSONA,
    blockTitle: "Maestro particular",
    aliasPlaceholder: "Ej. Maestro · Primaria y secundaria",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosEducacion: SERVICIOS_DOCENCIA,
      materiasEducativas: ["Español", "Matemáticas", "Ciencias", "Historia", "Otro"],
    },
  },
  "tutor-academico": {
    ...BASE_PERSONA,
    blockTitle: "Tutor académico",
    aliasPlaceholder: "Ej. Tutor · Apoyo escolar integral",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosEducacion: ["Tutoría general", "Exámenes", "Tareas", "Organización", "Otro"],
    },
  },
  "profesor-de-idiomas": {
    ...BASE_PERSONA,
    blockTitle: "Profesor de idiomas",
    aliasPlaceholder: "Ej. Profesor · Inglés conversacional",
    extraFields: [...BASE_PERSONA.extraFields, "idiomasEnsenanza"],
    obligatoriosExtra: [...BASE_PERSONA.obligatoriosExtra, "idiomasEnsenanza"],
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosEducacion: ["Conversación", "Gramática", "Exámenes", "Negocios", "Otro"],
      idiomasEnsenanza: IDIOMAS_ENSENANZA,
    },
  },
  "profesor-de-matematicas": {
    ...BASE_PERSONA,
    blockTitle: "Profesor de matemáticas",
    aliasPlaceholder: "Ej. Profesor · Álgebra y cálculo",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      materiasEducativas: ["Aritmética", "Álgebra", "Geometría", "Cálculo", "Estadística", "Otro"],
      nivelesEducativos: ["Primaria", "Secundaria", "Preparatoria", "Universidad", "Otro"],
    },
  },
  "profesor-de-musica": {
    ...BASE_PERSONA,
    blockTitle: "Profesor de música",
    aliasPlaceholder: "Ej. Profesor · Piano y guitarra",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      materiasEducativas: ["Piano", "Guitarra", "Canto", "Teoría musical", "Otro"],
    },
  },
  "profesor-de-arte": {
    ...BASE_PERSONA,
    blockTitle: "Profesor de arte",
    aliasPlaceholder: "Ej. Profesor · Dibujo y pintura",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      materiasEducativas: ["Dibujo", "Pintura", "Escultura", "Digital", "Otro"],
    },
  },
  "coach-educativo": {
    ...BASE_PERSONA,
    blockTitle: "Coach educativo",
    aliasPlaceholder: "Ej. Coach · Hábitos de estudio",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosEducacion: ["Motivación", "Organización", "Metas académicas", "Orientación", "Otro"],
    },
  },
  "instructor-de-manejo": {
    ...BASE_PERSONA,
    blockTitle: "Instructor de manejo",
    aliasPlaceholder: "Ej. Instructor · Auto y moto",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosEducacion: ["Auto", "Moto", "Prácticas", "Teórico", "Otro"],
      modalidadEducacion: MODALIDAD_EDUCACION.filter((o) =>
        ["presencial", "instalaciones"].includes(o.value)
      ),
    },
  },
  "instructor-deportivo": {
    ...BASE_PERSONA,
    blockTitle: "Instructor deportivo",
    aliasPlaceholder: "Ej. Instructor · Fútbol y natación",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      materiasEducativas: ["Fútbol", "Natación", "Yoga", "Fitness", "Artes marciales", "Otro"],
    },
  },
  "instructor-de-computacion": {
    ...BASE_PERSONA,
    blockTitle: "Instructor de computación",
    aliasPlaceholder: "Ej. Instructor · Office y programación",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      materiasEducativas: ["Office", "Programación", "Diseño", "Redes", "Otro"],
    },
  },
  psicopedagogo: {
    ...BASE_VET_PROF,
    blockTitle: "Psicopedagogo",
    aliasPlaceholder: "Ej. Psicopedagogo · Evaluación y apoyo",
    fieldOptions: {
      ...BASE_VET_PROF.fieldOptions,
      serviciosProfesionalesEducacion: [
        "Evaluación",
        "Intervención",
        "Orientación padres",
        "Seguimiento",
        "Otro",
      ],
    },
  },
  pedagogo: {
    ...BASE_VET_PROF,
    blockTitle: "Pedagogo",
    aliasPlaceholder: "Ej. Pedagogo · Asesoría educativa",
    fieldOptions: {
      ...BASE_VET_PROF.fieldOptions,
      serviciosProfesionalesEducacion: ["Asesoría", "Diseño curricular", "Capacitación docente", "Otro"],
    },
  },
  "docente-certificado": {
    ...BASE_VET_PROF,
    blockTitle: "Docente certificado",
    aliasPlaceholder: "Ej. Docente · Certificación SEP",
    fieldOptions: {
      ...BASE_VET_PROF.fieldOptions,
      serviciosProfesionalesEducacion: ["Docencia", "Asesoría", "Capacitación", "Otro"],
      materiasEducativas: ["Español", "Matemáticas", "Ciencias", "Otro"],
    },
  },
  "especialista-en-educacion-especial": {
    ...BASE_VET_PROF,
    blockTitle: "Especialista en educación especial",
    aliasPlaceholder: "Ej. Ed. especial · TEA / TDAH",
    fieldOptions: {
      ...BASE_VET_PROF.fieldOptions,
      serviciosProfesionalesEducacion: ["Apoyo inclusivo", "Terapia", "Evaluación", "Orientación", "Otro"],
      materiasEducativas: ["TEA", "TDAH", "Discapacidad intelectual", "Aprendizaje", "Otro"],
    },
  },
  "academia-de-idiomas": {
    ...BASE_NEGOCIO,
    blockTitle: "Academia de idiomas",
    aliasPlaceholder: "Ej. Academia · Inglés e italiano",
    extraFields: [...BASE_NEGOCIO.extraFields, "idiomasEnsenanza"],
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaEducacion: ["Grupos", "Privado", "Intensivo", "Certificación", "Otro"],
      idiomasEnsenanza: IDIOMAS_ENSENANZA,
    },
  },
  "escuela-de-musica": {
    ...BASE_NEGOCIO,
    blockTitle: "Escuela de música",
    aliasPlaceholder: "Ej. Escuela de música · Instrumentos",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      materiasEducativas: ["Piano", "Guitarra", "Canto", "Batería", "Otro"],
    },
  },
  "escuela-de-arte": {
    ...BASE_NEGOCIO,
    blockTitle: "Escuela de arte",
    aliasPlaceholder: "Ej. Escuela de arte · Talleres creativos",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      materiasEducativas: ["Dibujo", "Pintura", "Cerámica", "Digital", "Otro"],
    },
  },
  "escuela-de-manejo": {
    ...BASE_NEGOCIO,
    blockTitle: "Escuela de manejo",
    aliasPlaceholder: "Ej. Escuela de manejo · Licencia tipo B",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaEducacion: ["Auto", "Moto", "Teórico", "Prácticas", "Otro"],
      modalidadEducacion: MODALIDAD_EDUCACION.filter((o) =>
        ["presencial", "instalaciones"].includes(o.value)
      ),
    },
  },
  "escuela-tecnica": {
    ...BASE_NEGOCIO,
    blockTitle: "Escuela técnica",
    aliasPlaceholder: "Ej. Escuela técnica · Carreras cortas",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      materiasEducativas: ["Electricidad", "Mecánica", "Enfermería", "Gastronomía", "Otro"],
      nivelesEducativos: ["Técnico", "Bachillerato", "Otro"],
    },
  },
  "capacitador-empresarial": {
    ...BASE_NEGOCIO,
    blockTitle: "Capacitador empresarial",
    aliasPlaceholder: "Ej. Capacitación · NOM y soft skills",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaEducacion: ["NOM-035", "Liderazgo", "Ventas", "Seguridad", "Otro"],
      nivelesEducativos: ["Empresarial", "Adultos", "Otro"],
    },
  },
  "centro-de-capacitacion": {
    ...BASE_NEGOCIO,
    blockTitle: "Centro de capacitación",
    aliasPlaceholder: "Ej. Centro · Cursos certificados",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaEducacion: ["Cursos", "Diplomados", "Certificación", "In-company", "Otro"],
    },
  },
  "instituto-educativo": {
    ...BASE_NEGOCIO,
    blockTitle: "Instituto educativo",
    aliasPlaceholder: "Ej. Instituto · Bachillerato y licenciatura",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaEducacion: ["Licenciatura", "Maestría", "Bachillerato", "Otro"],
    },
  },
  "centro-de-certificaciones": {
    ...BASE_NEGOCIO,
    blockTitle: "Centro de certificaciones",
    aliasPlaceholder: "Ej. Certificaciones · Exámenes oficiales",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaEducacion: ["Examen", "Preparación", "Certificación", "Otro"],
    },
  },
  "plataforma-educativa": {
    ...BASE_NEGOCIO,
    blockTitle: "Plataforma educativa",
    aliasPlaceholder: "Ej. Plataforma · Cursos en línea",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      modalidadEducacion: MODALIDAD_EDUCACION.filter((o) => ["online", "hibrido"].includes(o.value)),
      serviciosEmpresaEducacion: ["Cursos", "Suscripción", "Certificados", "Otro"],
    },
  },
  escuelas: {
    ...BASE_NEGOCIO,
    blockTitle: "Escuelas",
    aliasPlaceholder: "Ej. Escuela · Educación básica",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      nivelesEducativos: ["Preescolar", "Primaria", "Secundaria", "Otro"],
    },
  },
  universidades: {
    ...BASE_PERSONA,
    blockTitle: "Universidades",
    aliasPlaceholder: "Ej. Universidad · Licenciaturas y posgrados",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosEducacion: ["Licenciatura", "Maestría", "Doctorado", "Posgrado", "Otro"],
      nivelesEducativos: ["Universidad", "Posgrado"],
    },
  },
  "cursos-en-linea": {
    ...BASE_PERSONA,
    blockTitle: "Cursos en línea",
    aliasPlaceholder: "Ej. Cursos en línea · Autoaprendizaje",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      modalidadEducacion: MODALIDAD_EDUCACION.filter((o) => ["online", "hibrido"].includes(o.value)),
      serviciosEducacion: ["Curso grabado", "En vivo", "Membresía", "Otro"],
    },
  },
  preparatoria: {
    ...BASE_PERSONA,
    blockTitle: "Preparatoria",
    aliasPlaceholder: "Ej. Preparatoria · Bachillerato",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosEducacion: ["Bachillerato", "Preparación UNAM/IPN", "Otro"],
      nivelesEducativos: ["Preparatoria"],
    },
  },
  guarderias: {
    ...BASE_PERSONA,
    blockTitle: "Guarderías",
    aliasPlaceholder: "Ej. Guardería · Estancia infantil",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosEducacion: ["Estancia", "Comedor", "Estimulación", "Lactantes", "Otro"],
      edadesAtendidas: ["3–6 años", "7–12 años"],
      modalidadEducacion: MODALIDAD_EDUCACION.filter((o) =>
        ["presencial", "instalaciones"].includes(o.value)
      ),
    },
  },
  "talleres-creativos": {
    ...BASE_PERSONA,
    blockTitle: "Talleres creativos",
    aliasPlaceholder: "Ej. Talleres · Manualidades y arte",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      materiasEducativas: ["Manualidades", "Cocina", "Arte", "Robótica", "Otro"],
      formatoClase: ["Taller", "Curso", "Grupal", "Otro"],
    },
  },
};

for (const subId of Object.keys(SUB_EXTRA_PROFILES)) {
  SUB_EXTRA_PROFILES[subId] = mergeEnrichmentV2(SUB_EXTRA_PROFILES[subId], subId);
  const p = SUB_EXTRA_PROFILES[subId];
  p.hideFields = mergeHideAdultLeaks(p.hideFields || []);
  p.extraFields = [...new Set([...(p.extraFields || []), "colaboracionesComerciales"])];
  p.fieldOptions = p.fieldOptions || {};
  if (!p.fieldOptions.colaboracionesComerciales) {
    p.fieldOptions.colaboracionesComerciales = COLABORACIONES_COMERCIALES_OPTIONS;
  }
  if (!p.fieldOptions.tiposColaboracionComercial) {
    p.fieldOptions.tiposColaboracionComercial = TIPOS_COLABORACION_COMERCIAL;
  }
  p.profesionistaCedula = PACK_PROFESIONISTA_SUBS.has(subId);
  p.negocioLocal = PACK_NEGOCIO_SUBS.has(subId);
}
