/**
 * Render Preview + Ficha — sector Educación packs A–E (MP-EDUCACION-DELTAS-V1 Fase 3).
 * Fuente: scripts/educacion-packs-v1.mjs + educacion-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-educacion-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = {
  "maestro-particular": {
    "chips": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "tutor-academico": {
    "chips": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "profesor-de-idiomas": {
    "chips": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "profesor-de-matematicas": {
    "chips": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "profesor-de-musica": {
    "chips": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "profesor-de-arte": {
    "chips": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "coach-educativo": {
    "chips": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "instructor-de-manejo": {
    "chips": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "instructor-deportivo": {
    "chips": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "instructor-de-computacion": {
    "chips": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "capacitador-empresarial": {
    "chips": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "certificacionesEducativas",
      "materiasEducativas",
      "formatoClase",
      "edadesAtendidas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "psicopedagogo": {
    "chips": [
      "serviciosProfesionalesEducacion",
      "especialidadEducativa",
      "materiasEducativas"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosProfesionalesEducacion",
      "especialidadEducativa",
      "materiasEducativas",
      "modalidadEducacion",
      "nivelesEducativos",
      "edadesAtendidas",
      "certificacionesEducativas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "pedagogo": {
    "chips": [
      "serviciosProfesionalesEducacion",
      "especialidadEducativa",
      "materiasEducativas"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosProfesionalesEducacion",
      "especialidadEducativa",
      "materiasEducativas",
      "modalidadEducacion",
      "nivelesEducativos",
      "edadesAtendidas",
      "certificacionesEducativas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "docente-certificado": {
    "chips": [
      "serviciosProfesionalesEducacion",
      "especialidadEducativa",
      "materiasEducativas"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosProfesionalesEducacion",
      "especialidadEducativa",
      "materiasEducativas",
      "modalidadEducacion",
      "nivelesEducativos",
      "edadesAtendidas",
      "certificacionesEducativas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "especialista-en-educacion-especial": {
    "chips": [
      "serviciosProfesionalesEducacion",
      "especialidadEducativa",
      "materiasEducativas"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosProfesionalesEducacion",
      "especialidadEducativa",
      "materiasEducativas",
      "modalidadEducacion",
      "nivelesEducativos",
      "edadesAtendidas",
      "certificacionesEducativas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "academia-de-idiomas": {
    "chips": [
      "serviciosEmpresaEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEmpresaEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "certificacionesEducativas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "escuela-de-musica": {
    "chips": [
      "serviciosEmpresaEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEmpresaEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "certificacionesEducativas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "escuela-de-arte": {
    "chips": [
      "serviciosEmpresaEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEmpresaEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "certificacionesEducativas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "centro-de-capacitacion": {
    "chips": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "certificacionesEducativas",
      "materiasEducativas",
      "formatoClase",
      "edadesAtendidas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "instituto-educativo": {
    "chips": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "certificacionesEducativas",
      "materiasEducativas",
      "formatoClase",
      "edadesAtendidas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "escuela-tecnica": {
    "chips": [
      "serviciosEmpresaEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEmpresaEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "certificacionesEducativas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "escuela-de-manejo": {
    "chips": [
      "serviciosEmpresaEducacion",
      "materiasEducativas",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEmpresaEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "formatoClase",
      "nivelesEducativos",
      "edadesAtendidas",
      "certificacionesEducativas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "centro-de-certificaciones": {
    "chips": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "certificacionesEducativas",
      "materiasEducativas",
      "formatoClase",
      "edadesAtendidas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "plataforma-educativa": {
    "chips": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "certificacionesEducativas",
      "materiasEducativas",
      "formatoClase",
      "edadesAtendidas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "escuelas": {
    "chips": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "certificacionesEducativas",
      "materiasEducativas",
      "formatoClase",
      "edadesAtendidas",
      "diferenciadorEducacion"
    ],
    "faq": [
      "certificacionesEducativas",
      "modalidadEducacion"
    ]
  },
  "universidades": {
    "chips": [
      "serviciosEducacion",
      "nivelesEducativos",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "edadesAtendidas",
      "materiasEducativas",
      "formatoClase",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "cursos-en-linea": {
    "chips": [
      "serviciosEducacion",
      "nivelesEducativos",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "edadesAtendidas",
      "materiasEducativas",
      "formatoClase",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "preparatoria": {
    "chips": [
      "serviciosEducacion",
      "nivelesEducativos",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "edadesAtendidas",
      "materiasEducativas",
      "formatoClase",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "guarderias": {
    "chips": [
      "serviciosEducacion",
      "nivelesEducativos",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "edadesAtendidas",
      "materiasEducativas",
      "formatoClase",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  },
  "talleres-creativos": {
    "chips": [
      "serviciosEducacion",
      "nivelesEducativos",
      "modalidadEducacion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadEducacion"
    ],
    "rows": [
      "serviciosEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "edadesAtendidas",
      "materiasEducativas",
      "formatoClase",
      "tiempoRespuestaEducacion",
      "diferenciadorEducacion"
    ],
    "faq": [
      "tiempoRespuestaEducacion",
      "modalidadEducacion"
    ]
  }
};

  var FIELD_LABELS = {
  "modalidadEducacion": "Modalidad de enseñanza",
  "serviciosEducacion": "Servicios educativos",
  "serviciosEmpresaEducacion": "Servicios del centro",
  "materiasEducativas": "Materias o áreas",
  "nivelesEducativos": "Niveles educativos",
  "edadesAtendidas": "Edades que atiendes",
  "formatoClase": "Formato de clase",
  "especialidadEducativa": "Especialidad educativa",
  "serviciosProfesionalesEducacion": "Servicios profesionales",
  "certificacionesEducativas": "Certificaciones / acreditaciones",
  "idiomasEnsenanza": "Idiomas que enseñas",
  "tiempoRespuestaEducacion": "Tiempo de respuesta",
  "diferenciadorEducacion": "Tu sello educativo",
  "coberturaGeografica": "Zona de cobertura",
  "colaboracionesComerciales": "¿Colaboras con escuelas, empresas o instituciones?",
  "tiposColaboracionComercial": "Tipo de colaboraciones"
};

  var FIELD_TYPES = {
  "modalidadEducacion": "enum",
  "serviciosEducacion": "checklist",
  "serviciosEmpresaEducacion": "checklist",
  "materiasEducativas": "checklist",
  "nivelesEducativos": "checklist",
  "edadesAtendidas": "checklist",
  "formatoClase": "checklist",
  "especialidadEducativa": "text",
  "serviciosProfesionalesEducacion": "checklist",
  "certificacionesEducativas": "text",
  "idiomasEnsenanza": "checklist",
  "tiempoRespuestaEducacion": "enum",
  "diferenciadorEducacion": "text",
  "coberturaGeografica": "text",
  "colaboracionesComerciales": "enum",
  "tiposColaboracionComercial": "checklist"
};

  var CANON_BLOCK_TITLES = {
  "maestro-particular": "Maestro particular",
  "tutor-academico": "Tutor académico",
  "profesor-de-idiomas": "Profesor de idiomas",
  "profesor-de-matematicas": "Profesor de matemáticas",
  "profesor-de-musica": "Profesor de música",
  "profesor-de-arte": "Profesor de arte",
  "coach-educativo": "Coach educativo",
  "instructor-de-manejo": "Instructor de manejo",
  "instructor-deportivo": "Instructor deportivo",
  "instructor-de-computacion": "Instructor de computación",
  "capacitador-empresarial": "Capacitador empresarial",
  "psicopedagogo": "Psicopedagogo",
  "pedagogo": "Pedagogo",
  "docente-certificado": "Docente certificado",
  "especialista-en-educacion-especial": "Especialista en educación especial",
  "academia-de-idiomas": "Academia de idiomas",
  "escuela-de-musica": "Escuela de música",
  "escuela-de-arte": "Escuela de arte",
  "centro-de-capacitacion": "Centro de capacitación",
  "instituto-educativo": "Instituto educativo",
  "escuela-tecnica": "Escuela técnica",
  "escuela-de-manejo": "Escuela de manejo",
  "centro-de-certificaciones": "Centro de certificaciones",
  "plataforma-educativa": "Plataforma educativa",
  "escuelas": "Escuelas",
  "universidades": "Universidades",
  "cursos-en-linea": "Cursos en línea",
  "preparatoria": "Preparatoria",
  "guarderias": "Guarderías",
  "talleres-creativos": "Talleres creativos"
};

  var NEGOCIO_CANON = [
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
  "escuelas"
];

  var CEDULA_CANON = [
  "psicopedagogo",
  "pedagogo",
  "docente-certificado",
  "especialista-en-educacion-especial"
];

  var PACK_TITLES = {
  "A": "Docencia e instructores",
  "B": "Profesionales certificados",
  "C": "Academias especializadas",
  "D": "Centros e instituciones",
  "E": "Educación formal y alternativa"
};

  var SUB_TO_PACK = {
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
  "psicopedagogo": "B",
  "pedagogo": "B",
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
  "escuelas": "D",
  "universidades": "E",
  "cursos-en-linea": "E",
  "preparatoria": "E",
  "guarderias": "E",
  "talleres-creativos": "E"
};

  var ENUM_LABELS = {
  "modalidadEducacion": {
    "presencial": "Presencial",
    "online": "Online",
    "hibrido": "Hibrido",
    "domicilio": "Domicilio",
    "instalaciones": "Instalaciones"
  },
  "tiempoRespuestaEducacion": {
    "inmediato": "Inmediato",
    "mismo_dia": "Mismo Dia",
    "24_48h": "24 48h",
    "por_cita": "Por Cita"
  },
  "colaboracionesComerciales": {
    "si_activo": "Si Activo",
    "ocasional": "Ocasional",
    "convenir": "Convenir",
    "no": "No"
  }
};

  var CARD_PACK_CLASS_PREFIX = 'res-card--edu-pack-';

  var CARD_SECTOR_CLASS = 'res-card--educacion-sector';

  function txt(v) {
    return String(v == null ? '' : v).trim();
  }

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolveCanonSubId(u) {
    u = u || {};
    var p = perfilNested(u);
    var raw = txt(u.canonSubcategoriaId) || txt(p.canonSubcategoriaId) || txt(u.subcategoriaId);
    var key = slugSubId(raw);
    if (CANON_BLOCK_TITLES[key]) return key;
    if (SUB_TO_PACK[key]) return key;
    return '';
  }

  function perfilNested(u) {
    return (u && u.educacionPerfil) ? u.educacionPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isEducacionSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'educacion' && (u.educacionPerfil || u.deltaPack)) return true;
    if (u.educacionPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isEducacionNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function isEducacionCedulaPerfil(u) {
    return CEDULA_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isEducacionSectorPerfil(u)) return null;
    return isEducacionNegocioPerfil(u) ? 'empresa' : 'pro';
  }

  function joinList(arr) {
    if (!Array.isArray(arr)) return txt(arr);
    return arr.filter(function (x) { return txt(x); }).map(function (x) { return formatEnumValue('', x); }).join(' · ');
  }

  function formatEnumValue(fieldId, val) {
    var k = txt(val);
    if (!k) return '';
    var map = ENUM_LABELS[fieldId];
    if (map && map[k]) return map[k];
    return humanize(k);
  }

  function humanize(v) {
    return String(v).replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function formatMoney(val) {
    var n = txt(val).replace(/[^\d.,]/g, '');
    if (!n) return txt(val);
    return txt(val).indexOf('$') === 0 ? txt(val) : ('$' + n);
  }

  function formatFieldValue(fieldId, val) {
    if (val === true) return 'Sí';
    if (val === false) return 'No';
    if (val == null) return '';
    var tipo = FIELD_TYPES[fieldId] || 'text';
    if (tipo === 'boolean') return val === true || val === 'true' || val === 1 ? 'Sí' : (val === false || val === 'false' ? 'No' : txt(val));
    if (tipo === 'checklist' || Array.isArray(val)) return joinList(val);
    if (tipo === 'enum' || tipo === 'select') return formatEnumValue(fieldId, val);
    if (fieldId === 'precioConsulta' || fieldId === 'tarifaDesde') return formatMoney(val);
    if (tipo === 'number') return txt(val);
    return txt(val);
  }

  function fieldLabel(fieldId) {
    return FIELD_LABELS[fieldId] || humanize(fieldId);
  }

  function previewFields(canonId) {
    return PREVIEW_FICHA[canonId] || {};
  }

  function pushRow(rows, icon, label, value, block) {
    value = txt(value);
    if (!value) return;
    rows.push([icon, label, value, block || '']);
  }

  function buildServiciosList(canonId, p) {
    p = p || {};
    var pf = previewFields(canonId);
    var pack = packFrom({ educacionPerfil: p });
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    var listFields = {
      A: ['serviciosEducacion', 'materiasEducativas', 'formatoClase'],
      B: ['serviciosProfesionalesEducacion', 'materiasEducativas', 'especialidadEducativa'],
      C: ['serviciosEmpresaEducacion', 'materiasEducativas', 'formatoClase'],
      D: ['serviciosEmpresaEducacion', 'nivelesEducativos', 'certificacionesEducativas'],
      E: ['serviciosEducacion', 'nivelesEducativos', 'edadesAtendidas']
    };
    (listFields[pack] || []).forEach(function (fid) {
      formatFieldValue(fid, p[fid]).split(' · ').forEach(function (x) {
        if (x && items.indexOf(x) < 0) items.push(x);
      });
    });
    if (p.modalidadEducacion) {
      var mod = formatEnumValue('modalidadEducacion', p.modalidadEducacion);
      if (mod && items.indexOf(mod) < 0) items.push(mod);
    }
    return items.filter(function (x) { return txt(x); }).slice(0, 8);
  }

  function buildDatosRows(canonId, p, u) {
    p = p || {};
    u = u || {};
    var rows = [];
    var pf = previewFields(canonId);
    var seen = {};
    function addField(fid, icon) {
      if (seen[fid]) return;
      seen[fid] = true;
      var val = formatFieldValue(fid, p[fid]);
      if (!val) return;
      pushRow(rows, icon || '📋', fieldLabel(fid), val);
    }
    (pf.stats || []).forEach(function (fid) { addField(fid, '📊'); });
    (pf.rows || []).forEach(function (fid) { addField(fid, '✨'); });
    (pf.faq || []).slice(0, 2).forEach(function (fid) { addField(fid, 'ℹ️'); });
    if (p.horarioAtencion) pushRow(rows, '🕐', 'Horario', p.horarioAtencion, 'horario');
    else if (p.horarioDetalle) pushRow(rows, '🕐', 'Horario', p.horarioDetalle, 'horario');
    else if (u.horario) pushRow(rows, '🕐', 'Horario', u.horario, 'horario');
    if (p.certificacionesEducativas) pushRow(rows, '🎖️', 'Certificaciones', p.certificacionesEducativas);
    else if (p.certificaciones) pushRow(rows, '🎖️', 'Certificaciones', p.certificaciones);
    if (p.diferenciadorEducacion) pushRow(rows, '📚', 'Tu sello', p.diferenciadorEducacion);
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.direccion) pushRow(rows, '🏫', 'Dirección', p.direccion);
    if (p.coberturaGeografica) pushRow(rows, '🗺️', 'Cobertura', p.coberturaGeografica);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var badges = [];
    if (isEducacionCedulaPerfil(u) && (u.cedulaVerificada === true || u.requiresCedula === true)) {
      badges.push({ cls: 'res-badge--cedula', text: 'Cédula verificada' });
    }
    if (p.tiempoRespuestaEducacion === 'inmediato') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Respuesta inmediata' });
    } else if (p.tiempoRespuestaEducacion === 'mismo_dia') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Mismo día' });
    }
    if (p.modalidadEducacion === 'online' || p.modalidadEducacion === 'hibrido') {
      badges.push({ cls: 'res-badge--online', text: 'Clases en línea' });
    }
    if (p.colaboracionesComerciales && txt(p.colaboracionesComerciales) && p.colaboracionesComerciales !== 'no') {
      badges.push({ cls: 'res-badge--colab', text: 'Colabora con otros' });
    }
    if (txt(p.certificacionesEducativas) || txt(p.certificaciones)) {
      badges.push({ cls: 'res-badge--cert', text: 'Certificado' });
    }
    return badges;
  }

  function buildStats(canonId, p) {
    p = p || {};
    var pf = previewFields(canonId);
    var stats = [];
    (pf.stats || []).slice(0, 4).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) stats.push([val, fieldLabel(fid)]);
    });
    while (stats.length < 4) {
      var fillers = [
        ['Educación', 'Especialidad'],
        ['Consultar', 'Tarifa'],
        ['Verificado', 'En plataforma'],
        ['Cita', 'Sujeta a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(pack) {
    if (pack === 'A') {
      return ['Docencia e instructores', 'Materias declaradas', 'Modalidad visible', 'Perfil verificable'];
    }
    if (pack === 'B') {
      return ['Profesional certificado', 'Especialidad clara', 'Modalidad de enseñanza', 'Perfil verificable'];
    }
    if (pack === 'C') {
      return ['Academia especializada', 'Programas visibles', 'Modalidad declarada', 'Perfil verificable'];
    }
    if (pack === 'D') {
      return ['Centro o institución', 'Niveles declarados', 'Certificaciones visibles', 'Perfil verificable'];
    }
    return ['Educación formal', 'Programas visibles', 'Modalidad declarada', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Cuál es la modalidad?', '¿Cuál es la tarifa?', '¿Qué edades atienden?', '¿Cuál es la cobertura?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.precioConsulta) return formatMoney(p.precioConsulta);
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel(u) {
    if (isEducacionCedulaPerfil(u)) return 'Consulta desde';
    if (isEducacionNegocioPerfil(u)) return 'Servicios desde';
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorEducacion) return p.diferenciadorEducacion;
    if (p.especialidadEducativa) return p.especialidadEducativa;
    if (p.serviciosEducacion && p.serviciosEducacion[0]) return p.serviciosEducacion[0];
    if (p.serviciosEmpresaEducacion && p.serviciosEmpresaEducacion[0]) return p.serviciosEmpresaEducacion[0];
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios educativos en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isEducacionSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__educacionCanon = canonId;
    u.__educacionPack = pack;
    u.sectorId = u.sectorId || 'educacion';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios educativos';
    u.especialidad = u.especialidad || p.especialidadEducativa || (p.materiasEducativas && p.materiasEducativas[0]) || (p.serviciosEducacion && p.serviciosEducacion[0]) || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioAtencion || p.horarioDetalle || '';
    if (isEducacionCedulaPerfil(u)) {
      u.nombre = u.nombreProfesional || p.nombreProfesional || u.nombre || '';
      u.nombreProfesional = u.nombreProfesional || p.nombreProfesional || u.nombre;
      u.alias = u.nombre;
    } else if (isEducacionNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadEducacion ? formatEnumValue('modalidadEducacion', p.modalidadEducacion) : 'Consultar modalidad');
    u.modalidadEducacion = u.modalidadEducacion || p.modalidadEducacion || '';
    u.diferenciadorEducacion = u.diferenciadorEducacion || p.diferenciadorEducacion || '';
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación / registro']];
    }
    u.__educacionDatos = buildDatosRows(canonId, p, u);
    u.__educacionBadges = buildBadges(u, canonId);
    u.__educacionPriceLabel = resolvePriceLabel(u);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Servicios fuera del programa publicado', 'Materiales no incluidos', 'Certificación no declarada salvo indicación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || formatEnumValue('tiempoRespuestaEducacion', p.tiempoRespuestaEducacion) || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || (p.tiempoRespuestaEducacion === 'inmediato' ? 'Respuesta inmediata' : 'Consultar disponibilidad');
    if (isEducacionCedulaPerfil(u)) u.cedulaVerificada = u.cedulaVerificada !== false;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__educacionCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.modalidadEducacion) {
      chips.push(formatEnumValue('modalidadEducacion', p.modalidadEducacion).slice(0, 28));
    }
    if (p.tiempoRespuestaEducacion === 'inmediato') chips.push('Respuesta inmediata');
    else if (p.tiempoRespuestaEducacion === 'mismo_dia') chips.push('Mismo día');
    if (p.modalidadEducacion === 'online' || p.modalidadEducacion === 'hibrido') chips.push('En línea');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubEducacionSectorRender = {
    PACK_TITLES: PACK_TITLES,
    CARD_PACK_CLASS_PREFIX: CARD_PACK_CLASS_PREFIX,
    CARD_SECTOR_CLASS: CARD_SECTOR_CLASS,
    isEducacionSectorPerfil: isEducacionSectorPerfil,
    isEducacionNegocioPerfil: isEducacionNegocioPerfil,
    isEducacionCedulaPerfil: isEducacionCedulaPerfil,
    resolveVistaPerfil: resolveVistaPerfil,
    resolveCanonSubId: resolveCanonSubId,
    packFrom: packFrom,
    hydrateDisplayFields: hydrateDisplayFields,
    cardMetaChips: cardMetaChips,
    buildServiciosList: buildServiciosList,
    buildDatosRows: buildDatosRows,
    buildBadges: buildBadges,
    formatFieldValue: formatFieldValue,
    fieldLabel: fieldLabel,
  };
})(typeof window !== 'undefined' ? window : globalThis);
