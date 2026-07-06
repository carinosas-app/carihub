/**
 * Render Preview + Ficha — sector Industria packs A–E (MP-INDUSTRIA-DELTAS-V1 Fase 3).
 * Fuente: scripts/industria-packs-v1.mjs + industria-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-industria-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = {
  "consultor-empresarial-independiente": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "auditor-independiente": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "reclutador-independiente": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "asesor-de-procesos": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "supervisor-industrial": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "sectoresIndustriales",
      "capacidadProduccion",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "tecnico-industrial": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "sectoresIndustriales",
      "capacidadProduccion",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "inspector-de-calidad": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "consultor-iso": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "gestor-de-tramites-empresariales": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "contador-publico": {
    "chips": [
      "serviciosProfesionalesIndustrial",
      "especialidadIndustrial",
      "sectoresIndustriales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosProfesionalesIndustrial",
      "especialidadIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "procesosIndustriales",
      "diferenciadorIndustrial",
      "coberturaGeografica"
    ],
    "faq": [
      "certificacionesIndustriales",
      "coberturaGeografica",
      "modalidadServicioIndustrial"
    ]
  },
  "administrador-de-empresas": {
    "chips": [
      "serviciosProfesionalesIndustrial",
      "especialidadIndustrial",
      "sectoresIndustriales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosProfesionalesIndustrial",
      "especialidadIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "procesosIndustriales",
      "diferenciadorIndustrial",
      "coberturaGeografica"
    ],
    "faq": [
      "certificacionesIndustriales",
      "coberturaGeografica",
      "modalidadServicioIndustrial"
    ]
  },
  "ingeniero-industrial": {
    "chips": [
      "serviciosProfesionalesIndustrial",
      "especialidadIndustrial",
      "sectoresIndustriales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosProfesionalesIndustrial",
      "especialidadIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "procesosIndustriales",
      "diferenciadorIndustrial",
      "coberturaGeografica"
    ],
    "faq": [
      "certificacionesIndustriales",
      "coberturaGeografica",
      "modalidadServicioIndustrial"
    ]
  },
  "ingeniero-en-procesos": {
    "chips": [
      "serviciosProfesionalesIndustrial",
      "especialidadIndustrial",
      "sectoresIndustriales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosProfesionalesIndustrial",
      "especialidadIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "procesosIndustriales",
      "diferenciadorIndustrial",
      "coberturaGeografica"
    ],
    "faq": [
      "certificacionesIndustriales",
      "coberturaGeografica",
      "modalidadServicioIndustrial"
    ]
  },
  "especialista-en-seguridad-industrial": {
    "chips": [
      "serviciosProfesionalesIndustrial",
      "especialidadIndustrial",
      "sectoresIndustriales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosProfesionalesIndustrial",
      "especialidadIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "procesosIndustriales",
      "diferenciadorIndustrial",
      "coberturaGeografica"
    ],
    "faq": [
      "certificacionesIndustriales",
      "coberturaGeografica",
      "modalidadServicioIndustrial"
    ]
  },
  "outsourcing": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "procesosIndustriales",
      "certificacionesIndustriales",
      "capacidadProduccion",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "consultoria-fiscal": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "consultoria-legal": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "seguridad-industrial": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "sectoresIndustriales",
      "capacidadProduccion",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "certificaciones-iso": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "servicios-contables": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "servicios-administrativos": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "call-center": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "procesosIndustriales",
      "certificacionesIndustriales",
      "capacidadProduccion",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "centro-de-negocios-empresarial": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "procesosIndustriales",
      "certificacionesIndustriales",
      "capacidadProduccion",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "manufactura": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "capacidadProduccion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "capacidadProduccion",
      "certificacionesIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "maquila": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "capacidadProduccion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "capacidadProduccion",
      "certificacionesIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "automatizacion-industrial": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "capacidadProduccion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "capacidadProduccion",
      "certificacionesIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "ingenieria-industrial": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "procesosIndustriales",
      "certificacionesIndustriales",
      "capacidadProduccion",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "servicios-corporativos": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "maquinaria-industrial": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "capacidadProduccion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "capacidadProduccion",
      "certificacionesIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "mantenimiento-industrial": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "sectoresIndustriales",
      "capacidadProduccion",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "soldadura-industrial": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "capacidadProduccion"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "capacidadProduccion",
      "certificacionesIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  },
  "empaques-y-embalaje": {
    "chips": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosIndustriales",
      "sectoresIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "tiempoRespuestaIndustrial",
      "diferenciadorIndustrial",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tiempoRespuestaIndustrial",
      "certificacionesIndustriales",
      "coberturaGeografica"
    ]
  },
  "limpieza-industrial": {
    "chips": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "modalidadServicioIndustrial"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadServicioIndustrial"
    ],
    "rows": [
      "serviciosEmpresaIndustrial",
      "procesosIndustriales",
      "modalidadServicioIndustrial",
      "certificacionesIndustriales",
      "sectoresIndustriales",
      "capacidadProduccion",
      "equipamientoIndustrial",
      "diferenciadorIndustrial"
    ],
    "faq": [
      "certificacionesIndustriales",
      "modalidadServicioIndustrial"
    ]
  }
};

  var FIELD_LABELS = {
  "modalidadServicioIndustrial": "Modalidad de servicio",
  "serviciosIndustriales": "Servicios industriales",
  "serviciosEmpresaIndustrial": "Servicios de la empresa",
  "sectoresIndustriales": "Sectores / industrias atendidas",
  "procesosIndustriales": "Procesos o líneas",
  "certificacionesIndustriales": "Certificaciones (ISO, NOM…)",
  "capacidadProduccion": "Capacidad / volumen",
  "equipamientoIndustrial": "Equipamiento principal",
  "especialidadIndustrial": "Especialidad industrial",
  "serviciosProfesionalesIndustrial": "Servicios profesionales",
  "tiempoRespuestaIndustrial": "Tiempo de respuesta",
  "diferenciadorIndustrial": "Tu sello industrial",
  "coberturaGeografica": "Zona de cobertura",
  "colaboracionesComerciales": "¿Colaboras con plantas, maquiladoras o integradores?",
  "tiposColaboracionComercial": "Tipo de colaboraciones"
};

  var FIELD_TYPES = {
  "modalidadServicioIndustrial": "enum",
  "serviciosIndustriales": "checklist",
  "serviciosEmpresaIndustrial": "checklist",
  "sectoresIndustriales": "checklist",
  "procesosIndustriales": "checklist",
  "certificacionesIndustriales": "checklist",
  "capacidadProduccion": "text",
  "equipamientoIndustrial": "text",
  "especialidadIndustrial": "text",
  "serviciosProfesionalesIndustrial": "checklist",
  "tiempoRespuestaIndustrial": "enum",
  "diferenciadorIndustrial": "text",
  "coberturaGeografica": "text",
  "colaboracionesComerciales": "enum",
  "tiposColaboracionComercial": "checklist"
};

  var CANON_BLOCK_TITLES = {
  "consultor-empresarial-independiente": "Consultor empresarial independiente",
  "auditor-independiente": "Auditor independiente",
  "reclutador-independiente": "Reclutador independiente",
  "asesor-de-procesos": "Asesor de procesos",
  "supervisor-industrial": "Supervisor industrial",
  "tecnico-industrial": "Técnico industrial",
  "inspector-de-calidad": "Inspector de calidad",
  "consultor-iso": "Consultor ISO",
  "gestor-de-tramites-empresariales": "Gestor de trámites empresariales",
  "contador-publico": "Contador público",
  "administrador-de-empresas": "Administrador de empresas",
  "ingeniero-industrial": "Ingeniero industrial",
  "ingeniero-en-procesos": "Ingeniero en procesos",
  "especialista-en-seguridad-industrial": "Especialista en seguridad industrial",
  "outsourcing": "Outsourcing",
  "consultoria-fiscal": "Consultoría fiscal",
  "consultoria-legal": "Consultoría legal",
  "seguridad-industrial": "Seguridad industrial",
  "certificaciones-iso": "Certificaciones ISO",
  "servicios-contables": "Servicios contables",
  "servicios-administrativos": "Servicios administrativos",
  "call-center": "Call center",
  "centro-de-negocios-empresarial": "Centro de negocios empresarial",
  "manufactura": "Manufactura",
  "maquila": "Maquila",
  "automatizacion-industrial": "Automatización industrial",
  "ingenieria-industrial": "Ingeniería industrial",
  "servicios-corporativos": "Servicios corporativos",
  "maquinaria-industrial": "Maquinaria industrial",
  "mantenimiento-industrial": "Mantenimiento industrial",
  "soldadura-industrial": "Soldadura industrial",
  "empaques-y-embalaje": "Empaques y embalaje",
  "limpieza-industrial": "Limpieza industrial"
};

  var NEGOCIO_CANON = [
  "supervisor-industrial",
  "tecnico-industrial",
  "outsourcing",
  "seguridad-industrial",
  "call-center",
  "centro-de-negocios-empresarial",
  "manufactura",
  "maquila",
  "automatizacion-industrial",
  "ingenieria-industrial",
  "maquinaria-industrial",
  "mantenimiento-industrial",
  "soldadura-industrial",
  "limpieza-industrial"
];

  var CEDULA_CANON = [
  "contador-publico",
  "administrador-de-empresas",
  "ingeniero-industrial",
  "ingeniero-en-procesos",
  "especialista-en-seguridad-industrial"
];

  var PACK_TITLES = {
  "A": "Consultoría y servicios independientes",
  "B": "Profesionistas certificados",
  "C": "Manufactura y producción",
  "D": "Servicios industriales",
  "E": "Corporativo y outsourcing"
};

  var SUB_TO_PACK = {
  "consultor-empresarial-independiente": "A",
  "auditor-independiente": "A",
  "reclutador-independiente": "A",
  "asesor-de-procesos": "A",
  "inspector-de-calidad": "A",
  "consultor-iso": "A",
  "gestor-de-tramites-empresariales": "A",
  "consultoria-fiscal": "A",
  "consultoria-legal": "A",
  "certificaciones-iso": "A",
  "servicios-contables": "A",
  "servicios-administrativos": "A",
  "servicios-corporativos": "A",
  "empaques-y-embalaje": "A",
  "contador-publico": "B",
  "administrador-de-empresas": "B",
  "ingeniero-industrial": "B",
  "ingeniero-en-procesos": "B",
  "especialista-en-seguridad-industrial": "B",
  "manufactura": "C",
  "maquila": "C",
  "automatizacion-industrial": "C",
  "maquinaria-industrial": "C",
  "soldadura-industrial": "C",
  "supervisor-industrial": "D",
  "tecnico-industrial": "D",
  "seguridad-industrial": "D",
  "mantenimiento-industrial": "D",
  "limpieza-industrial": "D",
  "outsourcing": "E",
  "call-center": "E",
  "centro-de-negocios-empresarial": "E",
  "ingenieria-industrial": "E"
};

  var ENUM_LABELS = {
  "modalidadServicioIndustrial": {
    "planta": "Planta",
    "sitio_cliente": "Sitio Cliente",
    "remoto": "Remoto",
    "mixto": "Mixto",
    "instalaciones": "Instalaciones"
  },
  "tiempoRespuestaIndustrial": {
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

  var CARD_PACK_CLASS_PREFIX = 'res-card--ind-pack-';

  var CARD_SECTOR_CLASS = 'res-card--industria-sector';

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
    return (u && u.industriaPerfil) ? u.industriaPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isIndustriaSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'industria' && (u.industriaPerfil || u.deltaPack)) return true;
    if (u.industriaPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isIndustriaNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function isIndustriaCedulaPerfil(u) {
    return CEDULA_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isIndustriaSectorPerfil(u)) return null;
    return isIndustriaNegocioPerfil(u) ? 'empresa' : 'pro';
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
    var pack = packFrom({ industriaPerfil: p });
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    var listFields = {
      A: ['serviciosIndustriales', 'sectoresIndustriales', 'modalidadServicioIndustrial'],
      B: ['serviciosProfesionalesIndustrial', 'especialidadIndustrial', 'sectoresIndustriales'],
      C: ['serviciosEmpresaIndustrial', 'procesosIndustriales', 'capacidadProduccion'],
      D: ['serviciosEmpresaIndustrial', 'procesosIndustriales', 'certificacionesIndustriales'],
      E: ['serviciosEmpresaIndustrial', 'sectoresIndustriales', 'modalidadServicioIndustrial']
    };
    (listFields[pack] || []).forEach(function (fid) {
      formatFieldValue(fid, p[fid]).split(' · ').forEach(function (x) {
        if (x && items.indexOf(x) < 0) items.push(x);
      });
    });
    if (p.modalidadServicioIndustrial) {
      var mod = formatEnumValue('modalidadServicioIndustrial', p.modalidadServicioIndustrial);
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
    if (p.certificacionesIndustriales) pushRow(rows, '🎖️', 'Certificaciones', formatFieldValue('certificacionesIndustriales', p.certificacionesIndustriales));
    else if (p.certificaciones) pushRow(rows, '🎖️', 'Certificaciones', p.certificaciones);
    if (p.diferenciadorIndustrial) pushRow(rows, '🏭', 'Tu sello', p.diferenciadorIndustrial);
    if (p.equipamientoIndustrial) pushRow(rows, '⚙️', 'Equipamiento', p.equipamientoIndustrial);
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.direccion) pushRow(rows, '🏢', 'Dirección', p.direccion);
    if (p.coberturaGeografica) pushRow(rows, '🗺️', 'Cobertura', p.coberturaGeografica);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var badges = [];
    if (isIndustriaCedulaPerfil(u) && (u.cedulaVerificada === true || u.requiresCedula === true)) {
      badges.push({ cls: 'res-badge--cedula', text: 'Cédula verificada' });
    }
    if (p.tiempoRespuestaIndustrial === 'inmediato') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Respuesta inmediata' });
    } else if (p.tiempoRespuestaIndustrial === 'mismo_dia') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Mismo día' });
    }
    if (p.modalidadServicioIndustrial === 'remoto' || p.modalidadServicioIndustrial === 'mixto') {
      badges.push({ cls: 'res-badge--online', text: 'Servicio remoto / mixto' });
    }
    if (p.colaboracionesComerciales && txt(p.colaboracionesComerciales) && p.colaboracionesComerciales !== 'no') {
      badges.push({ cls: 'res-badge--colab', text: 'Colabora con plantas' });
    }
    if ((Array.isArray(p.certificacionesIndustriales) && p.certificacionesIndustriales.length) || txt(p.certificaciones)) {
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
        ['Industria', 'Especialidad'],
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
      return ['Consultoría industrial', 'Sectores declarados', 'Modalidad visible', 'Perfil verificable'];
    }
    if (pack === 'B') {
      return ['Profesional certificado', 'Especialidad industrial', 'Modalidad de servicio', 'Perfil verificable'];
    }
    if (pack === 'C') {
      return ['Manufactura y producción', 'Procesos visibles', 'Capacidad declarada', 'Perfil verificable'];
    }
    if (pack === 'D') {
      return ['Servicios en planta', 'Procesos declarados', 'Certificaciones visibles', 'Perfil verificable'];
    }
    return ['Corporativo B2B', 'Sectores atendidos', 'Cobertura visible', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Cuál es la modalidad?', '¿Cuál es la tarifa?', '¿Qué sectores atienden?', '¿Cuál es la cobertura?'];
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
    if (isIndustriaCedulaPerfil(u)) return 'Consulta desde';
    if (isIndustriaNegocioPerfil(u)) return 'Servicios desde';
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorIndustrial) return p.diferenciadorIndustrial;
    if (p.especialidadIndustrial) return p.especialidadIndustrial;
    if (p.serviciosIndustriales && p.serviciosIndustriales[0]) return p.serviciosIndustriales[0];
    if (p.serviciosEmpresaIndustrial && p.serviciosEmpresaIndustrial[0]) return p.serviciosEmpresaIndustrial[0];
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios industriales en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isIndustriaSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__industriaCanon = canonId;
    u.__industriaPack = pack;
    u.sectorId = u.sectorId || 'industria';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios industriales';
    u.especialidad = u.especialidad || p.especialidadIndustrial || (p.sectoresIndustriales && p.sectoresIndustriales[0]) || (p.serviciosIndustriales && p.serviciosIndustriales[0]) || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioAtencion || p.horarioDetalle || '';
    if (isIndustriaCedulaPerfil(u)) {
      u.nombre = u.nombreProfesional || p.nombreProfesional || u.nombre || '';
      u.nombreProfesional = u.nombreProfesional || p.nombreProfesional || u.nombre;
      u.alias = u.nombre;
    } else if (isIndustriaNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadServicioIndustrial ? formatEnumValue('modalidadServicioIndustrial', p.modalidadServicioIndustrial) : 'Consultar modalidad');
    u.modalidadServicioIndustrial = u.modalidadServicioIndustrial || p.modalidadServicioIndustrial || '';
    u.diferenciadorIndustrial = u.diferenciadorIndustrial || p.diferenciadorIndustrial || '';
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación / registro']];
    }
    u.__industriaDatos = buildDatosRows(canonId, p, u);
    u.__industriaBadges = buildBadges(u, canonId);
    u.__industriaPriceLabel = resolvePriceLabel(u);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Servicios fuera del alcance publicado', 'Refacciones no incluidas salvo indicación', 'Certificación no declarada salvo indicación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || formatEnumValue('tiempoRespuestaIndustrial', p.tiempoRespuestaIndustrial) || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || (p.tiempoRespuestaIndustrial === 'inmediato' ? 'Respuesta inmediata' : 'Consultar disponibilidad');
    if (isIndustriaCedulaPerfil(u)) u.cedulaVerificada = u.cedulaVerificada !== false;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__industriaCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.modalidadServicioIndustrial) {
      chips.push(formatEnumValue('modalidadServicioIndustrial', p.modalidadServicioIndustrial).slice(0, 28));
    }
    if (p.tiempoRespuestaIndustrial === 'inmediato') chips.push('Respuesta inmediata');
    else if (p.tiempoRespuestaIndustrial === 'mismo_dia') chips.push('Mismo día');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubIndustriaSectorRender = {
    PACK_TITLES: PACK_TITLES,
    CARD_PACK_CLASS_PREFIX: CARD_PACK_CLASS_PREFIX,
    CARD_SECTOR_CLASS: CARD_SECTOR_CLASS,
    isIndustriaSectorPerfil: isIndustriaSectorPerfil,
    isIndustriaNegocioPerfil: isIndustriaNegocioPerfil,
    isIndustriaCedulaPerfil: isIndustriaCedulaPerfil,
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
