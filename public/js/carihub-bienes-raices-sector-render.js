/**
 * Render Preview + Ficha — sector Bienes raíces packs A–E (MP-BIENES-RAICES-DELTAS-V1 Fase 3).
 * Fuente: scripts/bienes-raices-packs-v1.mjs + bienes-raices-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-bienes-raices-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = {
  "agente-inmobiliario-independiente": {
    "chips": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "especialidadesInmobiliarias",
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "diferenciadorInmobiliario",
      "coberturaGeografica"
    ],
    "faq": [
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "coberturaGeografica"
    ]
  },
  "asesor-inmobiliario": {
    "chips": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "especialidadesInmobiliarias",
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "diferenciadorInmobiliario",
      "coberturaGeografica"
    ],
    "faq": [
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "coberturaGeografica"
    ]
  },
  "corredor-inmobiliario": {
    "chips": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "especialidadesInmobiliarias",
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "diferenciadorInmobiliario",
      "coberturaGeografica"
    ],
    "faq": [
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "coberturaGeografica"
    ]
  },
  "promotor-de-propiedades": {
    "chips": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "especialidadesInmobiliarias",
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "diferenciadorInmobiliario",
      "coberturaGeografica"
    ],
    "faq": [
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "coberturaGeografica"
    ]
  },
  "administrador-de-propiedades": {
    "chips": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "especialidadesInmobiliarias",
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "diferenciadorInmobiliario",
      "coberturaGeografica"
    ],
    "faq": [
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "coberturaGeografica"
    ]
  },
  "valuador-inmobiliario": {
    "chips": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "especialidadesInmobiliarias",
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "diferenciadorInmobiliario",
      "coberturaGeografica"
    ],
    "faq": [
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "coberturaGeografica"
    ]
  },
  "rentas-vacacionales-independiente": {
    "chips": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "especialidadesInmobiliarias",
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "diferenciadorInmobiliario",
      "coberturaGeografica"
    ],
    "faq": [
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "coberturaGeografica"
    ]
  },
  "rentas-temporales-independiente": {
    "chips": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosInmobiliarios",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "especialidadesInmobiliarias",
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "diferenciadorInmobiliario",
      "coberturaGeografica"
    ],
    "faq": [
      "tiempoRespuestaInmobiliaria",
      "rangoPrecioInmobiliario",
      "coberturaGeografica"
    ]
  },
  "inmobiliaria": {
    "chips": [
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "operacionInmobiliaria",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "constructora": {
    "chips": [
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "operacionInmobiliaria",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "desarrolladora-inmobiliaria": {
    "chips": [
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "operacionInmobiliaria",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "agencia-de-bienes-raices": {
    "chips": [
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "operacionInmobiliaria",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "administracion-de-condominios": {
    "chips": [
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "operacionInmobiliaria",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "venta-de-casas": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "renta-de-casas": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "venta-de-departamentos": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "renta-de-departamentos": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "venta-de-terrenos": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "venta-de-locales-comerciales": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "renta-de-locales-comerciales": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "venta-de-bodegas": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "renta-de-bodegas": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "venta-de-oficinas": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "caracteristicasInmueble",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "renta-de-oficinas": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "renta-vacacional": {
    "chips": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "operacionInmobiliaria",
      "tiposInmuebleInmobiliario",
      "rangoPrecioInmobiliario",
      "amenidadesInmueble",
      "caracteristicasInmueble",
      "serviciosEmpresaInmobiliaria",
      "especialidadesEmpresaInmobiliaria",
      "modalidadOperacionInmobiliaria"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "coworking": {
    "chips": [
      "serviciosEmpresaInmobiliaria",
      "operacionInmobiliaria",
      "amenidadesInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosEmpresaInmobiliaria",
      "operacionInmobiliaria",
      "amenidadesInmueble",
      "rangoPrecioInmobiliario",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "caracteristicasInmueble"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  },
  "centros-de-negocios-y-oficinas": {
    "chips": [
      "serviciosEmpresaInmobiliaria",
      "operacionInmobiliaria",
      "amenidadesInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "rangoPrecioInmobiliario",
      "modalidadOperacionInmobiliaria"
    ],
    "rows": [
      "serviciosEmpresaInmobiliaria",
      "operacionInmobiliaria",
      "amenidadesInmueble",
      "rangoPrecioInmobiliario",
      "especialidadesEmpresaInmobiliaria",
      "tiposInmuebleInmobiliario",
      "modalidadOperacionInmobiliaria",
      "caracteristicasInmueble"
    ],
    "faq": [
      "rangoPrecioInmobiliario",
      "amenidadesInmueble"
    ]
  }
};

  var FIELD_LABELS = {
  "modalidadOperacionInmobiliaria": "Modalidad de operación",
  "operacionInmobiliaria": "Operación principal",
  "tiposInmuebleInmobiliario": "Tipos de inmueble",
  "serviciosInmobiliarios": "Servicios inmobiliarios",
  "serviciosEmpresaInmobiliaria": "Servicios de la empresa",
  "especialidadesInmobiliarias": "Especialidades",
  "especialidadesEmpresaInmobiliaria": "Especialidades",
  "rangoPrecioInmobiliario": "Rango de precio / renta",
  "amenidadesInmueble": "Amenidades destacadas",
  "caracteristicasInmueble": "Características del inmueble",
  "tiempoRespuestaInmobiliaria": "Tiempo de respuesta",
  "diferenciadorInmobiliario": "Tu sello inmobiliario",
  "coberturaGeografica": "Zona de cobertura",
  "colaboracionesComerciales": "¿Colaboras con notarías, bancos o desarrolladoras?",
  "tiposColaboracionComercial": "Tipo de colaboraciones"
};

  var FIELD_TYPES = {
  "modalidadOperacionInmobiliaria": "enum",
  "operacionInmobiliaria": "enum",
  "tiposInmuebleInmobiliario": "checklist",
  "serviciosInmobiliarios": "checklist",
  "serviciosEmpresaInmobiliaria": "checklist",
  "especialidadesInmobiliarias": "checklist",
  "especialidadesEmpresaInmobiliaria": "text",
  "rangoPrecioInmobiliario": "text",
  "amenidadesInmueble": "checklist",
  "caracteristicasInmueble": "text",
  "tiempoRespuestaInmobiliaria": "enum",
  "diferenciadorInmobiliario": "text",
  "coberturaGeografica": "text",
  "colaboracionesComerciales": "enum",
  "tiposColaboracionComercial": "checklist"
};

  var CANON_BLOCK_TITLES = {
  "agente-inmobiliario-independiente": "Agente inmobiliario independiente",
  "asesor-inmobiliario": "Asesor inmobiliario",
  "corredor-inmobiliario": "Corredor inmobiliario",
  "promotor-de-propiedades": "Promotor de propiedades",
  "administrador-de-propiedades": "Administrador de propiedades",
  "valuador-inmobiliario": "Valuador inmobiliario",
  "rentas-vacacionales-independiente": "Rentas vacacionales independiente",
  "rentas-temporales-independiente": "Rentas temporales independiente",
  "inmobiliaria": "Inmobiliaria",
  "constructora": "Constructora",
  "desarrolladora-inmobiliaria": "Desarrolladora inmobiliaria",
  "agencia-de-bienes-raices": "Agencia de bienes raíces",
  "administracion-de-condominios": "Administración de condominios",
  "venta-de-casas": "Venta de casas",
  "renta-de-casas": "Renta de casas",
  "venta-de-departamentos": "Venta de departamentos",
  "renta-de-departamentos": "Renta de departamentos",
  "venta-de-terrenos": "Venta de terrenos",
  "venta-de-locales-comerciales": "Venta de locales comerciales",
  "renta-de-locales-comerciales": "Renta de locales comerciales",
  "venta-de-bodegas": "Venta de bodegas",
  "renta-de-bodegas": "Renta de bodegas",
  "venta-de-oficinas": "Venta de oficinas",
  "renta-de-oficinas": "Renta de oficinas",
  "renta-vacacional": "Renta vacacional",
  "coworking": "Coworking",
  "centros-de-negocios-y-oficinas": "Centros de negocios y oficinas"
};

  var NEGOCIO_CANON = [
  "inmobiliaria",
  "agencia-de-bienes-raices",
  "desarrolladora-inmobiliaria",
  "constructora",
  "administracion-de-condominios",
  "venta-de-casas",
  "venta-de-departamentos",
  "venta-de-terrenos",
  "venta-de-locales-comerciales",
  "venta-de-bodegas",
  "venta-de-oficinas",
  "renta-de-casas",
  "renta-de-departamentos",
  "renta-de-locales-comerciales",
  "renta-de-bodegas",
  "renta-de-oficinas",
  "renta-vacacional",
  "coworking",
  "centros-de-negocios-y-oficinas"
];

  var PACK_TITLES = {
  "A": "Asesores y profesionales",
  "B": "Empresas inmobiliarias",
  "C": "Venta de inmuebles",
  "D": "Renta de inmuebles",
  "E": "Espacios flexibles"
};

  var SUB_TO_PACK = {
  "agente-inmobiliario-independiente": "A",
  "asesor-inmobiliario": "A",
  "corredor-inmobiliario": "A",
  "promotor-de-propiedades": "A",
  "administrador-de-propiedades": "A",
  "valuador-inmobiliario": "A",
  "rentas-vacacionales-independiente": "A",
  "rentas-temporales-independiente": "A",
  "inmobiliaria": "B",
  "agencia-de-bienes-raices": "B",
  "desarrolladora-inmobiliaria": "B",
  "constructora": "B",
  "administracion-de-condominios": "B",
  "venta-de-casas": "C",
  "venta-de-departamentos": "C",
  "venta-de-terrenos": "C",
  "venta-de-locales-comerciales": "C",
  "venta-de-bodegas": "C",
  "venta-de-oficinas": "C",
  "renta-de-casas": "D",
  "renta-de-departamentos": "D",
  "renta-de-locales-comerciales": "D",
  "renta-de-bodegas": "D",
  "renta-de-oficinas": "D",
  "renta-vacacional": "D",
  "coworking": "E",
  "centros-de-negocios-y-oficinas": "E"
};

  var ENUM_LABELS = {
  "modalidadOperacionInmobiliaria": {
    "venta": "Venta",
    "renta": "Renta",
    "venta_y_renta": "Venta Y Renta",
    "desarrollo": "Desarrollo",
    "administracion": "Administracion",
    "temporal": "Temporal"
  },
  "operacionInmobiliaria": {
    "venta": "Venta",
    "renta": "Renta",
    "temporal": "Temporal",
    "coworking": "Coworking"
  },
  "tiempoRespuestaInmobiliaria": {
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

  var CARD_PACK_CLASS_PREFIX = 'res-card--inmo-pack-';

  var CARD_SECTOR_CLASS = 'res-card--bienes-raices-sector';

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
    return (u && u.bienesRaicesPerfil) ? u.bienesRaicesPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isBienesRaicesSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'bienes-raices' && (u.bienesRaicesPerfil || u.deltaPack)) return true;
    if (u.bienesRaicesPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isBienesRaicesNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isBienesRaicesSectorPerfil(u)) return null;
    return isBienesRaicesNegocioPerfil(u) ? 'empresa' : 'pro';
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
    if (fieldId === 'tarifaDesde') return formatMoney(val);
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
    var pack = packFrom({ bienesRaicesPerfil: p });
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    var listFields = {
      A: ['serviciosInmobiliarios', 'tiposInmuebleInmobiliario', 'especialidadesInmobiliarias'],
      B: ['serviciosEmpresaInmobiliaria', 'tiposInmuebleInmobiliario', 'especialidadesEmpresaInmobiliaria'],
      C: ['tiposInmuebleInmobiliario', 'amenidadesInmueble', 'caracteristicasInmueble'],
      D: ['tiposInmuebleInmobiliario', 'amenidadesInmueble', 'caracteristicasInmueble'],
      E: ['serviciosEmpresaInmobiliaria', 'amenidadesInmueble', 'operacionInmobiliaria']
    };
    (listFields[pack] || []).forEach(function (fid) {
      formatFieldValue(fid, p[fid]).split(' · ').forEach(function (x) {
        if (x && items.indexOf(x) < 0) items.push(x);
      });
    });
    if (p.modalidadOperacionInmobiliaria) {
      var mod = formatEnumValue('modalidadOperacionInmobiliaria', p.modalidadOperacionInmobiliaria);
      if (mod && items.indexOf(mod) < 0) items.push(mod);
    }
    if (p.operacionInmobiliaria) {
      var op = formatEnumValue('operacionInmobiliaria', p.operacionInmobiliaria);
      if (op && items.indexOf(op) < 0) items.push(op);
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
    if (p.horarioDetalle) pushRow(rows, '🕐', 'Horario', p.horarioDetalle, 'horario');
    else if (u.horario) pushRow(rows, '🕐', 'Horario', u.horario, 'horario');
    if (p.certificaciones) pushRow(rows, '🎖️', 'Certificaciones', p.certificaciones);
    if (p.diferenciadorInmobiliario) pushRow(rows, '🏠', 'Tu sello', p.diferenciadorInmobiliario);
    if (p.caracteristicasInmueble) pushRow(rows, '🏡', 'Características', p.caracteristicasInmueble);
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
    if (p.tiempoRespuestaInmobiliaria === 'inmediato') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Respuesta inmediata' });
    } else if (p.tiempoRespuestaInmobiliaria === 'mismo_dia') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Mismo día' });
    }
    if (p.operacionInmobiliaria === 'venta' || p.modalidadOperacionInmobiliaria === 'venta') {
      badges.push({ cls: 'res-badge--cert', text: 'Venta' });
    } else if (p.operacionInmobiliaria === 'renta' || p.modalidadOperacionInmobiliaria === 'renta') {
      badges.push({ cls: 'res-badge--online', text: 'Renta' });
    }
    if (p.colaboracionesComerciales && txt(p.colaboracionesComerciales) && p.colaboracionesComerciales !== 'no') {
      badges.push({ cls: 'res-badge--colab', text: 'Colabora con aliados' });
    }
    if (txt(p.certificaciones)) {
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
        ['Inmobiliario', 'Especialidad'],
        ['Consultar', 'Precio'],
        ['Verificado', 'En plataforma'],
        ['Visita', 'Sujeta a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(pack) {
    if (pack === 'A') {
      return ['Asesor inmobiliario', 'Tipos de inmueble', 'Modalidad declarada', 'Perfil verificable'];
    }
    if (pack === 'B') {
      return ['Empresa inmobiliaria', 'Servicios visibles', 'Cobertura declarada', 'Perfil verificable'];
    }
    if (pack === 'C') {
      return ['Venta de inmuebles', 'Rango de precio', 'Amenidades visibles', 'Perfil verificable'];
    }
    if (pack === 'D') {
      return ['Renta de inmuebles', 'Rango declarado', 'Amenidades visibles', 'Perfil verificable'];
    }
    return ['Espacios flexibles', 'Planes visibles', 'Ubicación declarada', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Cuál es el rango de precio?', '¿Qué tipos de inmueble manejan?', '¿Cuál es la cobertura?', '¿Cuál es el horario?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.rangoPrecioInmobiliario) return p.rangoPrecioInmobiliario;
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel(u) {
    var p = perfilNested(u);
    if (isBienesRaicesNegocioPerfil(u)) {
      if (p.operacionInmobiliaria === 'renta' || p.operacionInmobiliaria === 'temporal') return 'Renta desde';
      if (p.operacionInmobiliaria === 'venta') return 'Venta desde';
      if (p.rangoPrecioInmobiliario) return 'Desde';
      return 'Servicios desde';
    }
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorInmobiliario) return p.diferenciadorInmobiliario;
    if (p.caracteristicasInmueble) return p.caracteristicasInmueble;
    if (p.serviciosInmobiliarios && p.serviciosInmobiliarios[0]) return p.serviciosInmobiliarios[0];
    if (p.serviciosEmpresaInmobiliaria && p.serviciosEmpresaInmobiliaria[0]) return p.serviciosEmpresaInmobiliaria[0];
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios inmobiliarios en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isBienesRaicesSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__bienesRaicesCanon = canonId;
    u.__bienesRaicesPack = pack;
    u.sectorId = u.sectorId || 'bienes-raices';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios inmobiliarios';
    u.especialidad = u.especialidad || (p.tiposInmuebleInmobiliario && p.tiposInmuebleInmobiliario[0]) || (p.serviciosInmobiliarios && p.serviciosInmobiliarios[0]) || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioDetalle || '';
    if (isBienesRaicesNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadOperacionInmobiliaria ? formatEnumValue('modalidadOperacionInmobiliaria', p.modalidadOperacionInmobiliaria) : (p.operacionInmobiliaria ? formatEnumValue('operacionInmobiliaria', p.operacionInmobiliaria) : 'Consultar modalidad'));
    u.modalidadOperacionInmobiliaria = u.modalidadOperacionInmobiliaria || p.modalidadOperacionInmobiliaria || '';
    u.operacionInmobiliaria = u.operacionInmobiliaria || p.operacionInmobiliaria || '';
    u.diferenciadorInmobiliario = u.diferenciadorInmobiliario || p.diferenciadorInmobiliario || '';
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación / registro']];
    }
    u.__bienesRaicesDatos = buildDatosRows(canonId, p, u);
    u.__bienesRaicesBadges = buildBadges(u, canonId);
    u.__bienesRaicesPriceLabel = resolvePriceLabel(u);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Trámites notariales no incluidos salvo indicación', 'Inmuebles fuera de catálogo publicado', 'Comisiones no declaradas'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || formatEnumValue('tiempoRespuestaInmobiliaria', p.tiempoRespuestaInmobiliaria) || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || (p.tiempoRespuestaInmobiliaria === 'inmediato' ? 'Respuesta inmediata' : 'Consultar disponibilidad');
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__bienesRaicesCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.operacionInmobiliaria) {
      chips.push(formatEnumValue('operacionInmobiliaria', p.operacionInmobiliaria).slice(0, 28));
    } else if (p.modalidadOperacionInmobiliaria) {
      chips.push(formatEnumValue('modalidadOperacionInmobiliaria', p.modalidadOperacionInmobiliaria).slice(0, 28));
    }
    if (p.tiempoRespuestaInmobiliaria === 'inmediato') chips.push('Respuesta inmediata');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubBienesRaicesSectorRender = {
    PACK_TITLES: PACK_TITLES,
    CARD_PACK_CLASS_PREFIX: CARD_PACK_CLASS_PREFIX,
    CARD_SECTOR_CLASS: CARD_SECTOR_CLASS,
    isBienesRaicesSectorPerfil: isBienesRaicesSectorPerfil,
    isBienesRaicesNegocioPerfil: isBienesRaicesNegocioPerfil,
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
