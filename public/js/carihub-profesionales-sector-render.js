/**
 * Render Preview + Ficha — sector Profesionales packs A–H (MP-PROFESIONALES-DELTAS-V1 Fase 3).
 * Fuente: scripts/profesionales-packs-v1.mjs + profesionales-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-profesionales-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = {
  "abogados": {
    "chips": [
      "especialidadProfesional",
      "serviciosProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidadProfesional",
      "serviciosProfesionales",
      "modalidadAtencionProfesional",
      "precioConsulta",
      "horarioAtencion",
      "areasDerecho",
      "tiposClientesLegales",
      "serviciosLegales",
      "anosExperienciaProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "despachos-juridicos": {
    "chips": [
      "serviciosDespacho",
      "areasPracticaDespacho",
      "tamanoEquipoDespacho"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosDespacho",
      "areasPracticaDespacho",
      "tamanoEquipoDespacho",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "instanciasJudiciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "contadores": {
    "chips": [
      "especialidadProfesional",
      "serviciosProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidadProfesional",
      "serviciosProfesionales",
      "modalidadAtencionProfesional",
      "precioConsulta",
      "horarioAtencion",
      "serviciosContables",
      "tiposClientesContables",
      "anosExperienciaProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "regimenesFiscales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "despachos-contables": {
    "chips": [
      "serviciosDespacho",
      "areasPracticaDespacho",
      "tamanoEquipoDespacho"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosDespacho",
      "areasPracticaDespacho",
      "tamanoEquipoDespacho",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "regimenesFiscales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "asesoria-fiscal": {
    "chips": [
      "serviciosFiscalesLegales",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFiscalesLegales",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "regimenesFiscales",
      "tiempoRespuestaConsulta"
    ],
    "faq": [
      "colaboracionesComerciales",
      "tiempoRespuestaConsulta",
      "coberturaGeografica"
    ]
  },
  "auditoria": {
    "chips": [
      "serviciosFiscalesLegales",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFiscalesLegales",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiempoRespuestaConsulta"
    ],
    "faq": [
      "colaboracionesComerciales",
      "tiempoRespuestaConsulta",
      "coberturaGeografica"
    ]
  },
  "notarias": {
    "chips": [
      "serviciosFiscalesLegales",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFiscalesLegales",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiempoRespuestaConsulta"
    ],
    "faq": [
      "colaboracionesComerciales",
      "tiempoRespuestaConsulta",
      "coberturaGeografica"
    ]
  },
  "corredurias-publicas": {
    "chips": [
      "serviciosFiscalesLegales",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFiscalesLegales",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "gestoria-y-tramites": {
    "chips": [
      "serviciosFiscalesLegales",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFiscalesLegales",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "serviciosTramites",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "arquitectos": {
    "chips": [
      "especialidadTecnica",
      "serviciosTecnicos",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidadTecnica",
      "serviciosTecnicos",
      "modalidadAtencionProfesional",
      "softwareHerramientas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "estilosArquitectonicos"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "despachos-de-arquitectura": {
    "chips": [
      "serviciosDespacho",
      "areasPracticaDespacho",
      "tamanoEquipoDespacho"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosDespacho",
      "areasPracticaDespacho",
      "tamanoEquipoDespacho",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "estilosArquitectonicos"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "ingenieros": {
    "chips": [
      "especialidadProfesional",
      "serviciosProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidadProfesional",
      "serviciosProfesionales",
      "modalidadAtencionProfesional",
      "precioConsulta",
      "horarioAtencion",
      "especialidadTecnica",
      "serviciosTecnicos",
      "softwareHerramientas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "despachos-de-ingenieria": {
    "chips": [
      "serviciosDespacho",
      "areasPracticaDespacho",
      "tamanoEquipoDespacho"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosDespacho",
      "areasPracticaDespacho",
      "tamanoEquipoDespacho",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "softwareHerramientas"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "topografia": {
    "chips": [
      "especialidadTecnica",
      "serviciosTecnicos",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidadTecnica",
      "serviciosTecnicos",
      "modalidadAtencionProfesional",
      "softwareHerramientas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "avaluos": {
    "chips": [
      "especialidadTecnica",
      "serviciosTecnicos",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidadTecnica",
      "serviciosTecnicos",
      "modalidadAtencionProfesional",
      "softwareHerramientas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiempoRespuestaConsulta"
    ],
    "faq": [
      "colaboracionesComerciales",
      "tiempoRespuestaConsulta",
      "coberturaGeografica"
    ]
  },
  "peritos": {
    "chips": [
      "especialidadTecnica",
      "serviciosTecnicos",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidadTecnica",
      "serviciosTecnicos",
      "modalidadAtencionProfesional",
      "softwareHerramientas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "consultoria-empresarial": {
    "chips": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "consultoria-financiera": {
    "chips": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional",
      "industriasAtendidas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "metodologiasConsultoria"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "consultoria-de-negocios": {
    "chips": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional",
      "industriasAtendidas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "metodologiasConsultoria"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "recursos-humanos": {
    "chips": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional",
      "industriasAtendidas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "metodologiasConsultoria"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "reclutamiento-y-seleccion": {
    "chips": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional",
      "industriasAtendidas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiempoRespuestaConsulta"
    ],
    "faq": [
      "colaboracionesComerciales",
      "tiempoRespuestaConsulta",
      "coberturaGeografica"
    ]
  },
  "estudios-socioeconomicos": {
    "chips": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional",
      "industriasAtendidas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiempoRespuestaConsulta"
    ],
    "faq": [
      "colaboracionesComerciales",
      "tiempoRespuestaConsulta",
      "coberturaGeografica"
    ]
  },
  "capacitacion-empresarial": {
    "chips": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "coaching-ejecutivo": {
    "chips": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional",
      "industriasAtendidas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "metodologiasConsultoria"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "traduccion-e-interpretacion": {
    "chips": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional",
      "idiomasServicio",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "portfolioURL"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "marketing-y-publicidad": {
    "chips": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional",
      "idiomasServicio",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "portfolioURL"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "agencias-de-marketing": {
    "chips": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "portfolioURL"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "diseno-grafico": {
    "chips": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional",
      "idiomasServicio",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "portfolioURL"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "diseno-industrial": {
    "chips": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "portfolioURL"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "diseno-de-interiores": {
    "chips": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional",
      "idiomasServicio",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "portfolioURL"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "branding-e-identidad-corporativa": {
    "chips": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional",
      "idiomasServicio",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "portfolioURL"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "fotografia-profesional": {
    "chips": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional",
      "idiomasServicio",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "portfolioURL"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "produccion-de-video": {
    "chips": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional",
      "idiomasServicio",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "portfolioURL"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "relaciones-publicas": {
    "chips": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional",
      "idiomasServicio",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "portfolioURL"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "investigacion-de-mercados": {
    "chips": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosCreativos",
      "especialidadCreativa",
      "modalidadAtencionProfesional",
      "idiomasServicio",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "metodologiasConsultoria"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "desarrollo-organizacional": {
    "chips": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional",
      "industriasAtendidas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "metodologiasConsultoria"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "franquicias": {
    "chips": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "areasConsultoria",
      "serviciosConsultoria",
      "modalidadAtencionProfesional",
      "industriasAtendidas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "seguros": {
    "chips": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "aseguradorasRepresentadas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposPolizaSeguros"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "agentes-de-seguros": {
    "chips": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "aseguradorasRepresentadas",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposPolizaSeguros"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "asesoria-patrimonial": {
    "chips": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "asesoria-en-inversiones": {
    "chips": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "comercio-internacional": {
    "chips": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "importacion-y-exportacion": {
    "chips": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "logistica-empresarial": {
    "chips": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "certificaciones-y-normatividad": {
    "chips": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "normasCertificaciones",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "seguridad-e-higiene": {
    "chips": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "proteccion-civil-empresarial": {
    "chips": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "gestion-de-calidad": {
    "chips": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "consultoria-ambiental": {
    "chips": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosFinancieros",
      "tiposClientesProfesionales",
      "modalidadAtencionProfesional",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "responsabilidad-social-empresarial": {
    "chips": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "serviciosEmpresariales",
      "especialidadesEmpresa",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  }
};

  var FIELD_LABELS = {
  "modalidadAtencionProfesional": "Modalidad de atención",
  "especialidadProfesional": "Especialidad o área principal",
  "serviciosProfesionales": "Servicios profesionales",
  "areasDerecho": "Áreas del derecho",
  "tiposClientesLegales": "Tipos de clientes",
  "serviciosLegales": "Servicios legales",
  "serviciosDespacho": "Servicios del despacho",
  "areasPracticaDespacho": "Áreas de práctica",
  "tamanoEquipoDespacho": "Tamaño del equipo",
  "serviciosContables": "Servicios contables",
  "tiposClientesContables": "Tipos de clientes",
  "serviciosFiscalesLegales": "Servicios fiscales / legales",
  "tiposClientesProfesionales": "Tipos de clientes atendidos",
  "serviciosTramites": "Trámites y gestiones",
  "especialidadTecnica": "Especialidad técnica",
  "serviciosTecnicos": "Servicios técnicos",
  "softwareHerramientas": "Software / herramientas",
  "areasConsultoria": "Áreas de consultoría",
  "serviciosConsultoria": "Servicios de consultoría",
  "industriasAtendidas": "Industrias atendidas",
  "serviciosCreativos": "Servicios creativos",
  "especialidadCreativa": "Especialidad creativa",
  "idiomasServicio": "Idiomas de servicio",
  "serviciosFinancieros": "Servicios financieros / comerciales",
  "aseguradorasRepresentadas": "Aseguradoras / instituciones",
  "normasCertificaciones": "Normas / certificaciones",
  "serviciosEmpresariales": "Servicios empresariales",
  "especialidadesEmpresa": "Especialidades de la empresa",
  "tamanoEmpresaAtendida": "Tamaño de empresas atendidas",
  "anosExperienciaProfesional": "Años de experiencia",
  "diferenciadorProfesional": "Tu sello profesional",
  "coberturaGeografica": "Zona de atención",
  "tiempoRespuestaConsulta": "Tiempo de respuesta a consultas",
  "regimenesFiscales": "Regímenes fiscales que manejas",
  "instanciasJudiciales": "Instancias y etapas procesales",
  "estilosArquitectonicos": "Estilos arquitectónicos",
  "metodologiasConsultoria": "Cómo trabajas con clientes",
  "tiposEntregablesCreativos": "Qué incluye tu servicio",
  "tiposPolizaSeguros": "Tipos de póliza / ramos",
  "portfolioURL": "Portafolio (URL)",
  "colaboracionesComerciales": "¿Colaboras con otros profesionales o negocios?",
  "tiposColaboracionComercial": "Tipo de colaboraciones"
};

  var FIELD_TYPES = {
  "modalidadAtencionProfesional": "enum",
  "especialidadProfesional": "text",
  "serviciosProfesionales": "checklist",
  "areasDerecho": "checklist",
  "tiposClientesLegales": "checklist",
  "serviciosLegales": "checklist",
  "serviciosDespacho": "checklist",
  "areasPracticaDespacho": "checklist",
  "tamanoEquipoDespacho": "enum",
  "serviciosContables": "checklist",
  "tiposClientesContables": "checklist",
  "serviciosFiscalesLegales": "checklist",
  "tiposClientesProfesionales": "checklist",
  "serviciosTramites": "checklist",
  "especialidadTecnica": "checklist",
  "serviciosTecnicos": "checklist",
  "softwareHerramientas": "text",
  "areasConsultoria": "checklist",
  "serviciosConsultoria": "checklist",
  "industriasAtendidas": "checklist",
  "serviciosCreativos": "checklist",
  "especialidadCreativa": "checklist",
  "idiomasServicio": "text",
  "serviciosFinancieros": "checklist",
  "aseguradorasRepresentadas": "text",
  "normasCertificaciones": "checklist",
  "serviciosEmpresariales": "checklist",
  "especialidadesEmpresa": "tags",
  "tamanoEmpresaAtendida": "checklist",
  "anosExperienciaProfesional": "enum",
  "diferenciadorProfesional": "text",
  "coberturaGeografica": "text",
  "tiempoRespuestaConsulta": "enum",
  "regimenesFiscales": "checklist",
  "instanciasJudiciales": "checklist",
  "estilosArquitectonicos": "checklist",
  "metodologiasConsultoria": "checklist",
  "tiposEntregablesCreativos": "checklist",
  "tiposPolizaSeguros": "checklist",
  "portfolioURL": "url",
  "colaboracionesComerciales": "enum",
  "tiposColaboracionComercial": "checklist"
};

  var CANON_BLOCK_TITLES = {
  "abogados": "Abogados",
  "despachos-juridicos": "Despachos jurídicos",
  "contadores": "Contadores",
  "despachos-contables": "Despachos contables",
  "asesoria-fiscal": "Asesoría fiscal",
  "auditoria": "Auditoría",
  "notarias": "Notarías",
  "corredurias-publicas": "Corredurías públicas",
  "gestoria-y-tramites": "Gestoría y trámites",
  "arquitectos": "Arquitectos",
  "despachos-de-arquitectura": "Despachos de arquitectura",
  "ingenieros": "Ingenieros",
  "despachos-de-ingenieria": "Despachos de ingeniería",
  "topografia": "Topografía",
  "avaluos": "Avalúos",
  "peritos": "Peritos",
  "consultoria-empresarial": "Consultoría empresarial",
  "consultoria-financiera": "Consultoría financiera",
  "consultoria-de-negocios": "Consultoría de negocios",
  "recursos-humanos": "Recursos humanos",
  "reclutamiento-y-seleccion": "Reclutamiento y selección",
  "estudios-socioeconomicos": "Estudios socioeconómicos",
  "capacitacion-empresarial": "Capacitación empresarial",
  "coaching-ejecutivo": "Coaching ejecutivo",
  "traduccion-e-interpretacion": "Traducción e interpretación",
  "marketing-y-publicidad": "Marketing y publicidad",
  "agencias-de-marketing": "Agencias de marketing",
  "diseno-grafico": "Diseño gráfico",
  "diseno-industrial": "Diseño industrial",
  "diseno-de-interiores": "Diseño de interiores",
  "branding-e-identidad-corporativa": "Branding e identidad corporativa",
  "fotografia-profesional": "Fotografía profesional",
  "produccion-de-video": "Producción de video",
  "relaciones-publicas": "Relaciones públicas",
  "investigacion-de-mercados": "Investigación de mercados",
  "desarrollo-organizacional": "Desarrollo organizacional",
  "franquicias": "Franquicias",
  "seguros": "Seguros",
  "agentes-de-seguros": "Agentes de seguros",
  "asesoria-patrimonial": "Asesoría patrimonial",
  "asesoria-en-inversiones": "Asesoría en inversiones",
  "comercio-internacional": "Comercio internacional",
  "importacion-y-exportacion": "Importación y exportación",
  "logistica-empresarial": "Logística empresarial",
  "certificaciones-y-normatividad": "Certificaciones y normatividad",
  "seguridad-e-higiene": "Seguridad e higiene",
  "proteccion-civil-empresarial": "Protección civil empresarial",
  "gestion-de-calidad": "Gestión de calidad",
  "consultoria-ambiental": "Consultoría ambiental",
  "responsabilidad-social-empresarial": "Responsabilidad social empresarial"
};

  var NEGOCIO_CANON = [
  "consultoria-empresarial",
  "capacitacion-empresarial",
  "agencias-de-marketing",
  "diseno-industrial",
  "logistica-empresarial",
  "proteccion-civil-empresarial",
  "responsabilidad-social-empresarial"
];

  var CEDULA_CANON = [
  "abogados",
  "contadores",
  "ingenieros"
];

  var PACK_TITLES = {
  "A": "Profesionista con cédula",
  "B": "Despacho / firma profesional",
  "C": "Legal, fiscal y trámites",
  "D": "Arquitectura y servicios técnicos",
  "E": "Consultoría y recursos humanos",
  "F": "Creativo, marketing y comunicación",
  "G": "Seguros, finanzas y comercio",
  "H": "Negocio / empresa profesional"
};

  var SUB_TO_PACK = {
  "abogados": "A",
  "contadores": "A",
  "ingenieros": "A",
  "despachos-juridicos": "B",
  "despachos-contables": "B",
  "despachos-de-arquitectura": "B",
  "despachos-de-ingenieria": "B",
  "asesoria-fiscal": "C",
  "auditoria": "C",
  "notarias": "C",
  "corredurias-publicas": "C",
  "gestoria-y-tramites": "C",
  "arquitectos": "D",
  "topografia": "D",
  "avaluos": "D",
  "peritos": "D",
  "consultoria-financiera": "E",
  "consultoria-de-negocios": "E",
  "recursos-humanos": "E",
  "reclutamiento-y-seleccion": "E",
  "estudios-socioeconomicos": "E",
  "coaching-ejecutivo": "E",
  "desarrollo-organizacional": "E",
  "franquicias": "E",
  "traduccion-e-interpretacion": "F",
  "marketing-y-publicidad": "F",
  "diseno-grafico": "F",
  "diseno-de-interiores": "F",
  "branding-e-identidad-corporativa": "F",
  "fotografia-profesional": "F",
  "produccion-de-video": "F",
  "relaciones-publicas": "F",
  "investigacion-de-mercados": "F",
  "seguros": "G",
  "agentes-de-seguros": "G",
  "asesoria-patrimonial": "G",
  "asesoria-en-inversiones": "G",
  "comercio-internacional": "G",
  "importacion-y-exportacion": "G",
  "certificaciones-y-normatividad": "G",
  "seguridad-e-higiene": "G",
  "gestion-de-calidad": "G",
  "consultoria-ambiental": "G",
  "consultoria-empresarial": "H",
  "capacitacion-empresarial": "H",
  "agencias-de-marketing": "H",
  "diseno-industrial": "H",
  "logistica-empresarial": "H",
  "proteccion-civil-empresarial": "H",
  "responsabilidad-social-empresarial": "H"
};

  var ENUM_LABELS = {
  "modalidadAtencionProfesional": {
    "consultorio": "Consultorio",
    "videollamada": "Videollamada",
    "hibrido": "Hibrido",
    "visita_cliente": "Visita Cliente"
  },
  "tamanoEquipoDespacho": {
    "individual": "Individual",
    "pequeno_2_5": "Pequeno 2 5",
    "mediano_6_15": "Mediano 6 15",
    "grande_16_mas": "Grande 16 Mas"
  },
  "anosExperienciaProfesional": {
    "1_3": "1 3",
    "4_7": "4 7",
    "8_15": "8 15",
    "16_mas": "16 Mas"
  },
  "tiempoRespuestaConsulta": {
    "mismo_dia": "Mismo Dia",
    "24_48h": "24 48h",
    "3_5_dias": "3 5 Dias",
    "por_cita": "Por Cita"
  },
  "colaboracionesComerciales": {
    "si_activo": "Si Activo",
    "ocasional": "Ocasional",
    "convenir": "Convenir",
    "no": "No"
  }
};

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
    return (u && u.profesionalesPerfil) ? u.profesionalesPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isProfesionalesSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'profesionales' && (u.profesionalesPerfil || u.deltaPack)) return true;
    if (u.profesionalesPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isProfesionalesNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function isProfesionalesCedulaPerfil(u) {
    return CEDULA_CANON.indexOf(resolveCanonSubId(u)) >= 0 || packFrom(u) === 'A';
  }

  function resolveVistaPerfil(u) {
    if (!isProfesionalesSectorPerfil(u)) return null;
    return isProfesionalesNegocioPerfil(u) ? 'empresa' : 'pro';
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
    if (fieldId === 'portfolioURL' && txt(val)) return 'Portafolio en línea';
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
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    (pf.rows || []).slice(0, 4).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val && items.indexOf(val) < 0 && items.length < 8) items.push(fieldLabel(fid) + ': ' + val);
    });
    if (p.modalidadAtencionProfesional) {
      var mod = formatEnumValue('modalidadAtencionProfesional', p.modalidadAtencionProfesional);
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
    if (p.certificaciones) pushRow(rows, '🎖️', 'Certificaciones', p.certificaciones);
    if (p.portfolioURL) pushRow(rows, '🔗', 'Portafolio', 'Disponible en línea');
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.coberturaGeografica) pushRow(rows, '🗺️', 'Cobertura', p.coberturaGeografica);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var pack = packFrom(u);
    var badges = [];
    if (isProfesionalesCedulaPerfil(u) && (u.cedulaVerificada === true || p.requiresCedula === true || pack === 'A')) {
      badges.push({ cls: 'res-badge--cedula', text: 'Cédula verificada' });
    }
    if (u.verificado === true || u.verificada === true) {
      badges.push({ cls: 'res-badge--ver', text: 'Profesional verificado' });
    }
    if (p.colaboracionesComerciales && txt(p.colaboracionesComerciales) && p.colaboracionesComerciales !== 'no') {
      badges.push({ cls: 'res-badge--colab', text: 'Colabora con otros' });
    }
    if (p.requiresAdminReview === true || u.requiresAdminReview === true) {
      badges.push({ cls: 'res-badge--review', text: 'Revisión administrativa' });
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
        ['Profesional', 'Especialidad'],
        ['Consultar', 'Honorarios'],
        ['Verificado', 'En plataforma'],
        ['Cita', 'Sujeta a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(pack) {
    if (pack === 'H') {
      return ['Servicios empresariales', 'Equipo o firma declarada', 'Cotización transparente', 'Perfil verificable'];
    }
    if (pack === 'A') {
      return ['Profesionista con cédula', 'Especialidad declarada', 'Modalidad de atención clara', 'Honorarios publicados'];
    }
    return ['Servicios profesionales', 'Experiencia declarada', 'Modalidad de atención', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Cuál es el costo de la consulta?', '¿Atienden mi tipo de caso?', '¿Cuál es la modalidad de atención?', '¿Emiten factura?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.precioConsulta) return formatMoney(p.precioConsulta);
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel(pack) {
    if (pack === 'A') return 'Consulta desde';
    if (pack === 'H') return 'Servicios desde';
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorProfesional) return p.diferenciadorProfesional;
    if (p.especialidadProfesional) return p.especialidadProfesional;
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios profesionales en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isProfesionalesSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__profesionalesCanon = canonId;
    u.__profesionalesPack = pack;
    u.sectorId = u.sectorId || 'profesionales';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios profesionales';
    u.especialidad = u.especialidad || p.especialidadProfesional || p.especialidadTecnica || p.areasConsultoria || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioAtencion || p.horarioDetalle || '';
    u.modalidadAtencionProfesional = u.modalidadAtencionProfesional || p.modalidadAtencionProfesional || '';
    if (pack === 'A') {
      u.nombre = u.nombreProfesional || p.nombreProfesional || u.nombre || '';
      u.nombreProfesional = u.nombreProfesional || p.nombreProfesional || u.nombre;
    } else if (isProfesionalesNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadAtencionProfesional ? formatEnumValue('modalidadAtencionProfesional', p.modalidadAtencionProfesional) : 'Consultar modalidad');
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación profesional']];
    }
    u.__profesionalesDatos = buildDatosRows(canonId, p, u);
    u.__profesionalesBadges = buildBadges(u, canonId);
    u.__profesionalesPriceLabel = resolvePriceLabel(pack);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Asesoría fuera del alcance declarado', 'Honorarios no publicados en el perfil', 'Resultados garantizados no prometidos'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || p.tiempoRespuestaConsulta || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || 'Agenda sujeta a confirmación';
    if (isProfesionalesCedulaPerfil(u)) u.cedulaVerificada = u.cedulaVerificada !== false;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__profesionalesCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.modalidadAtencionProfesional) {
      chips.push(formatEnumValue('modalidadAtencionProfesional', p.modalidadAtencionProfesional).slice(0, 28));
    }
    if (u.cedulaVerificada === true && chips.indexOf('Cédula') < 0) chips.push('Cédula verificada');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubProfesionalesSectorRender = {
    PACK_TITLES: PACK_TITLES,
    isProfesionalesSectorPerfil: isProfesionalesSectorPerfil,
    isProfesionalesNegocioPerfil: isProfesionalesNegocioPerfil,
    isProfesionalesCedulaPerfil: isProfesionalesCedulaPerfil,
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
