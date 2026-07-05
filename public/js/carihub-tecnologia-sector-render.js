/**

 * Render Preview + Ficha — sector Tecnología packs A–F (MP-TECNOLOGIA-DELTAS-V1 Fase 3).

 * Fuente: scripts/tecnologia-packs-v1.mjs + tecnologia-sub-deltas-v1.mjs

 * Regenerar: node scripts/build-carihub-tecnologia-sector-render.mjs

 */

(function (global) {

  'use strict';



  var PREVIEW_FICHA = {
  "programador": {
    "chips": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI",
      "anosExperienciaTI"
    ],
    "rows": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI",
      "lenguajesFrameworks",
      "tipoProyectosDev",
      "anosExperienciaTI",
      "portfolioURL",
      "diferenciadorProfesional"
    ],
    "faq": []
  },
  "desarrollador-web": {
    "chips": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI",
      "anosExperienciaTI"
    ],
    "rows": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI",
      "lenguajesFrameworks",
      "tipoProyectosDev",
      "anosExperienciaTI",
      "portfolioURL",
      "diferenciadorProfesional"
    ],
    "faq": []
  },
  "desarrollador-movil": {
    "chips": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI",
      "anosExperienciaTI"
    ],
    "rows": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI",
      "lenguajesFrameworks",
      "tipoProyectosDev",
      "anosExperienciaTI",
      "portfolioURL",
      "diferenciadorProfesional"
    ],
    "faq": []
  },
  "disenador-grafico": {
    "chips": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI",
      "portfolioURL",
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
  "disenador-ux-ui": {
    "chips": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI",
      "portfolioURL",
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
  "editor-de-video": {
    "chips": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI",
      "portfolioURL",
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
  "community-manager": {
    "chips": [
      "serviciosMarketingDigital",
      "canalesMarketing",
      "especialidadMarketing"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosMarketingDigital",
      "canalesMarketing",
      "especialidadMarketing",
      "modalidadServicioTI",
      "herramientasMarketing",
      "portfolioURL",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "especialista-seo": {
    "chips": [
      "serviciosMarketingDigital",
      "canalesMarketing",
      "especialidadMarketing"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosMarketingDigital",
      "canalesMarketing",
      "especialidadMarketing",
      "modalidadServicioTI",
      "herramientasMarketing",
      "portfolioURL",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "especialista-sem": {
    "chips": [
      "serviciosMarketingDigital",
      "canalesMarketing",
      "especialidadMarketing"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosMarketingDigital",
      "canalesMarketing",
      "especialidadMarketing",
      "modalidadServicioTI",
      "herramientasMarketing",
      "portfolioURL",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "administrador-de-redes-sociales": {
    "chips": [
      "serviciosMarketingDigital",
      "canalesMarketing",
      "especialidadMarketing"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosMarketingDigital",
      "canalesMarketing",
      "especialidadMarketing",
      "modalidadServicioTI",
      "herramientasMarketing",
      "portfolioURL",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "soporte-tecnico-independiente": {
    "chips": [
      "serviciosSoporteTI",
      "tiposEquipoSoporte",
      "serviciosReparacion"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI",
      "tiempoRespuestaSoporte"
    ],
    "rows": [
      "serviciosSoporteTI",
      "tiposEquipoSoporte",
      "serviciosReparacion",
      "modalidadServicioTI",
      "tiempoRespuestaSoporte",
      "tiposClientesSoporte",
      "garantiaServicio",
      "diferenciadorProfesional"
    ],
    "faq": [
      "garantiaServicio",
      "tiempoRespuestaSoporte"
    ]
  },
  "tecnico-en-computadoras": {
    "chips": [
      "serviciosSoporteTI",
      "tiposEquipoSoporte",
      "serviciosReparacion"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI",
      "tiempoRespuestaSoporte"
    ],
    "rows": [
      "serviciosSoporteTI",
      "tiposEquipoSoporte",
      "serviciosReparacion",
      "modalidadServicioTI",
      "tiempoRespuestaSoporte",
      "tiposClientesSoporte",
      "garantiaServicio",
      "diferenciadorProfesional"
    ],
    "faq": [
      "garantiaServicio",
      "tiempoRespuestaSoporte"
    ]
  },
  "especialista-en-ciberseguridad-independiente": {
    "chips": [
      "areasConsultoriaTI",
      "serviciosConsultoriaTI",
      "serviciosCiberseguridad"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "areasConsultoriaTI",
      "serviciosConsultoriaTI",
      "serviciosCiberseguridad",
      "modalidadServicioTI",
      "certificacionesSeguridad",
      "industriasAtendidas",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "consultor-it": {
    "chips": [
      "areasConsultoriaTI",
      "serviciosConsultoriaTI",
      "serviciosCiberseguridad"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "areasConsultoriaTI",
      "serviciosConsultoriaTI",
      "serviciosCiberseguridad",
      "modalidadServicioTI",
      "certificacionesSeguridad",
      "industriasAtendidas",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "automatizacion-ia": {
    "chips": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI",
      "anosExperienciaTI"
    ],
    "rows": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI",
      "lenguajesFrameworks",
      "tipoProyectosDev",
      "anosExperienciaTI",
      "portfolioURL",
      "diferenciadorProfesional"
    ],
    "faq": []
  },
  "prompt-engineer": {
    "chips": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI",
      "anosExperienciaTI"
    ],
    "rows": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI",
      "lenguajesFrameworks",
      "tipoProyectosDev",
      "anosExperienciaTI",
      "portfolioURL",
      "diferenciadorProfesional"
    ],
    "faq": []
  },
  "creador-de-contenido-digital": {
    "chips": [
      "serviciosMarketingDigital",
      "canalesMarketing",
      "especialidadMarketing"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosMarketingDigital",
      "canalesMarketing",
      "especialidadMarketing",
      "modalidadServicioTI",
      "herramientasMarketing",
      "portfolioURL",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "agencia-de-marketing-digital": {
    "chips": [
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "tamanoEmpresaAtendida"
    ],
    "stats": [
      "tarifaDesde"
    ],
    "rows": [
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "colaboracionesComerciales"
    ]
  },
  "agencia-seo": {
    "chips": [
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "tamanoEmpresaAtendida"
    ],
    "stats": [
      "tarifaDesde"
    ],
    "rows": [
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "colaboracionesComerciales"
    ]
  },
  "agencia-de-publicidad-digital": {
    "chips": [
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "tamanoEmpresaAtendida"
    ],
    "stats": [
      "tarifaDesde"
    ],
    "rows": [
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "colaboracionesComerciales"
    ]
  },
  "desarrollo-de-software": {
    "chips": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI",
      "anosExperienciaTI"
    ],
    "rows": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI",
      "lenguajesFrameworks",
      "tipoProyectosDev",
      "anosExperienciaTI",
      "portfolioURL",
      "diferenciadorProfesional"
    ],
    "faq": []
  },
  "desarrollo-de-apps": {
    "chips": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI",
      "anosExperienciaTI"
    ],
    "rows": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI",
      "lenguajesFrameworks",
      "tipoProyectosDev",
      "anosExperienciaTI",
      "portfolioURL",
      "diferenciadorProfesional"
    ],
    "faq": []
  },
  "desarrollo-web": {
    "chips": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI",
      "anosExperienciaTI"
    ],
    "rows": [
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI",
      "lenguajesFrameworks",
      "tipoProyectosDev",
      "anosExperienciaTI",
      "portfolioURL",
      "diferenciadorProfesional"
    ],
    "faq": []
  },
  "hosting-y-dominios": {
    "chips": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI",
      "portfolioURL",
      "serviciosInfraTI",
      "plataformasInfra",
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "diferenciadorProfesional",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "colaboracionesComerciales"
    ]
  },
  "servicios-cloud": {
    "chips": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI",
      "portfolioURL",
      "serviciosInfraTI",
      "plataformasInfra",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "consultoria-tecnologica": {
    "chips": [
      "areasConsultoriaTI",
      "serviciosConsultoriaTI",
      "serviciosCiberseguridad"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "areasConsultoriaTI",
      "serviciosConsultoriaTI",
      "serviciosCiberseguridad",
      "modalidadServicioTI",
      "certificacionesSeguridad",
      "industriasAtendidas",
      "diferenciadorProfesional",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica"
    ]
  },
  "ciberseguridad-empresarial": {
    "chips": [
      "areasConsultoriaTI",
      "serviciosConsultoriaTI",
      "serviciosCiberseguridad"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "areasConsultoriaTI",
      "serviciosConsultoriaTI",
      "serviciosCiberseguridad",
      "modalidadServicioTI",
      "certificacionesSeguridad",
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "colaboracionesComerciales"
    ]
  },
  "soporte-empresarial-ti": {
    "chips": [
      "serviciosSoporteTI",
      "tiposEquipoSoporte",
      "serviciosReparacion"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI",
      "tiempoRespuestaSoporte"
    ],
    "rows": [
      "serviciosSoporteTI",
      "tiposEquipoSoporte",
      "serviciosReparacion",
      "modalidadServicioTI",
      "tiempoRespuestaSoporte",
      "tamanoEmpresaAtendida",
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI"
    ],
    "faq": [
      "tiempoRespuestaSoporte"
    ]
  },
  "produccion-audiovisual": {
    "chips": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI",
      "portfolioURL",
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
  "estudio-de-diseno": {
    "chips": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI",
      "portfolioURL",
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
  "redes-y-telecomunicaciones": {
    "chips": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTI"
    ],
    "rows": [
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI",
      "portfolioURL",
      "serviciosInfraTI",
      "plataformasInfra",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales",
      "coberturaGeografica"
    ]
  },
  "venta-de-equipo-de-computo": {
    "chips": [
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "tamanoEmpresaAtendida"
    ],
    "stats": [
      "tarifaDesde"
    ],
    "rows": [
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "colaboracionesComerciales"
    ]
  }
};



  var FIELD_LABELS = {
  "modalidadServicioTI": "Modalidad de servicio",
  "stackTecnologico": "Stack / tecnologías principales",
  "lenguajesFrameworks": "Lenguajes y frameworks",
  "serviciosDesarrollo": "Servicios de desarrollo",
  "tipoProyectosDev": "Tipos de proyecto",
  "serviciosSoporteTI": "Servicios de soporte TI",
  "tiposEquipoSoporte": "Equipos que atiendes",
  "serviciosReparacion": "Reparaciones y mantenimiento",
  "tiempoRespuestaSoporte": "Tiempo de respuesta",
  "tiposClientesSoporte": "Tipos de clientes",
  "garantiaServicio": "Garantía del servicio",
  "serviciosMarketingDigital": "Servicios de marketing digital",
  "canalesMarketing": "Canales que manejas",
  "especialidadMarketing": "Especialidad",
  "herramientasMarketing": "Herramientas / plataformas",
  "areasConsultoriaTI": "Áreas de consultoría TI",
  "serviciosConsultoriaTI": "Servicios de consultoría",
  "serviciosCiberseguridad": "Servicios de ciberseguridad",
  "certificacionesSeguridad": "Certificaciones de seguridad",
  "serviciosEmpresaTI": "Servicios de la empresa",
  "especialidadesEmpresaTI": "Especialidades de la empresa",
  "tamanoEmpresaAtendida": "Tamaño de clientes atendidos",
  "serviciosCreativosTI": "Servicios creativos / audiovisual",
  "especialidadCreativaTI": "Especialidad creativa",
  "plataformasInfra": "Plataformas / proveedores",
  "serviciosInfraTI": "Servicios de infraestructura",
  "softwareHerramientas": "Software / herramientas",
  "portfolioURL": "Portafolio (URL)",
  "anosExperienciaTI": "Años de experiencia",
  "industriasAtendidas": "Industrias atendidas",
  "diferenciadorProfesional": "Tu sello profesional",
  "coberturaGeografica": "Zona de atención",
  "tiempoRespuestaConsulta": "Tiempo de respuesta a consultas",
  "colaboracionesComerciales": "¿Colaboras con otros profesionales o negocios?",
  "tiposColaboracionComercial": "Tipo de colaboraciones"
};



  var FIELD_TYPES = {
  "modalidadServicioTI": "enum",
  "stackTecnologico": "checklist",
  "lenguajesFrameworks": "text",
  "serviciosDesarrollo": "checklist",
  "tipoProyectosDev": "checklist",
  "serviciosSoporteTI": "checklist",
  "tiposEquipoSoporte": "checklist",
  "serviciosReparacion": "checklist",
  "tiempoRespuestaSoporte": "enum",
  "tiposClientesSoporte": "checklist",
  "garantiaServicio": "text",
  "serviciosMarketingDigital": "checklist",
  "canalesMarketing": "checklist",
  "especialidadMarketing": "checklist",
  "herramientasMarketing": "text",
  "areasConsultoriaTI": "checklist",
  "serviciosConsultoriaTI": "checklist",
  "serviciosCiberseguridad": "checklist",
  "certificacionesSeguridad": "checklist",
  "serviciosEmpresaTI": "checklist",
  "especialidadesEmpresaTI": "tags",
  "tamanoEmpresaAtendida": "checklist",
  "serviciosCreativosTI": "checklist",
  "especialidadCreativaTI": "checklist",
  "plataformasInfra": "checklist",
  "serviciosInfraTI": "checklist",
  "softwareHerramientas": "text",
  "portfolioURL": "url",
  "anosExperienciaTI": "enum",
  "industriasAtendidas": "checklist",
  "diferenciadorProfesional": "text",
  "coberturaGeografica": "text",
  "tiempoRespuestaConsulta": "enum",
  "colaboracionesComerciales": "enum",
  "tiposColaboracionComercial": "checklist"
};



  var CANON_BLOCK_TITLES = {
  "programador": "Programador",
  "desarrollador-web": "Desarrollador web",
  "desarrollador-movil": "Desarrollador móvil",
  "disenador-grafico": "Diseñador gráfico",
  "disenador-ux-ui": "Diseñador UX/UI",
  "editor-de-video": "Editor de video",
  "community-manager": "Community manager",
  "especialista-seo": "Especialista SEO",
  "especialista-sem": "Especialista SEM",
  "administrador-de-redes-sociales": "Administrador de redes sociales",
  "soporte-tecnico-independiente": "Soporte técnico independiente",
  "tecnico-en-computadoras": "Técnico en computadoras",
  "especialista-en-ciberseguridad-independiente": "Ciberseguridad independiente",
  "consultor-it": "Consultor IT",
  "automatizacion-ia": "Automatización IA",
  "prompt-engineer": "Prompt engineer",
  "creador-de-contenido-digital": "Creador de contenido digital",
  "agencia-de-marketing-digital": "Agencia de marketing digital",
  "agencia-seo": "Agencia SEO",
  "agencia-de-publicidad-digital": "Agencia de publicidad digital",
  "desarrollo-de-software": "Desarrollo de software",
  "desarrollo-de-apps": "Desarrollo de apps",
  "desarrollo-web": "Desarrollo web",
  "hosting-y-dominios": "Hosting y dominios",
  "servicios-cloud": "Servicios cloud",
  "consultoria-tecnologica": "Consultoría tecnológica",
  "ciberseguridad-empresarial": "Ciberseguridad empresarial",
  "soporte-empresarial-ti": "Soporte empresarial TI",
  "produccion-audiovisual": "Producción audiovisual",
  "estudio-de-diseno": "Estudio de diseño",
  "redes-y-telecomunicaciones": "Redes y telecomunicaciones",
  "venta-de-equipo-de-computo": "Venta de equipo de cómputo"
};



  var NEGOCIO_CANON = [
  "soporte-empresarial-ti",
  "ciberseguridad-empresarial",
  "agencia-de-marketing-digital",
  "agencia-seo",
  "agencia-de-publicidad-digital",
  "venta-de-equipo-de-computo",
  "hosting-y-dominios"
];



  var PACK_TITLES = {
  "A": "Desarrollo profesional",
  "B": "Soporte y reparación",
  "C": "Marketing digital (persona)",
  "D": "Consultoría y ciberseguridad",
  "E": "Negocio / agencia TI",
  "F": "Creativo e infraestructura"
};



  var SUB_TO_PACK = {
  "programador": "A",
  "desarrollador-web": "A",
  "desarrollador-movil": "A",
  "automatizacion-ia": "A",
  "prompt-engineer": "A",
  "desarrollo-de-software": "A",
  "desarrollo-de-apps": "A",
  "desarrollo-web": "A",
  "soporte-tecnico-independiente": "B",
  "tecnico-en-computadoras": "B",
  "soporte-empresarial-ti": "B",
  "community-manager": "C",
  "especialista-seo": "C",
  "especialista-sem": "C",
  "administrador-de-redes-sociales": "C",
  "creador-de-contenido-digital": "C",
  "especialista-en-ciberseguridad-independiente": "D",
  "consultor-it": "D",
  "consultoria-tecnologica": "D",
  "ciberseguridad-empresarial": "D",
  "agencia-de-marketing-digital": "E",
  "agencia-seo": "E",
  "agencia-de-publicidad-digital": "E",
  "venta-de-equipo-de-computo": "E",
  "disenador-grafico": "F",
  "disenador-ux-ui": "F",
  "editor-de-video": "F",
  "produccion-audiovisual": "F",
  "estudio-de-diseno": "F",
  "redes-y-telecomunicaciones": "F",
  "hosting-y-dominios": "F",
  "servicios-cloud": "F"
};



  var ENUM_LABELS = {
  "modalidadServicioTI": {
    "remoto": "Remoto",
    "presencial": "Presencial",
    "hibrido": "Hibrido",
    "visita_cliente": "Visita Cliente",
    "domicilio": "Domicilio"
  },
  "tiempoRespuestaSoporte": {
    "mismo_dia": "Mismo Dia",
    "24h": "24 h",
    "48h": "48h",
    "por_cita": "Por Cita",
    "sla_contrato": "Sla Contrato"
  },
  "anosExperienciaTI": {
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

    return (u && u.tecnologiaPerfil) ? u.tecnologiaPerfil : {};

  }



  function packFrom(u) {

    u = u || {};

    var p = perfilNested(u);

    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();

  }



  function isTecnologiaSectorPerfil(u) {

    if (!u) return false;

    if (String(u.sectorId || '') === 'tecnologia' && (u.tecnologiaPerfil || u.deltaPack)) return true;

    if (u.tecnologiaPerfil && resolveCanonSubId(u)) return true;

    return false;

  }



  function isTecnologiaNegocioPerfil(u) {

    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;

  }



  function resolveVistaPerfil(u) {

    if (!isTecnologiaSectorPerfil(u)) return null;

    return isTecnologiaNegocioPerfil(u) ? 'empresa' : 'pro';

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

    var pack = packFrom({ tecnologiaPerfil: p });

    var items = [];

    (pf.chips || []).forEach(function (fid) {

      var val = formatFieldValue(fid, p[fid]);

      if (val) items.push(val);

    });

    var listFields = {

      A: ['stackTecnologico', 'serviciosDesarrollo'],

      B: ['serviciosSoporteTI', 'serviciosReparacion'],

      C: ['serviciosMarketingDigital', 'canalesMarketing'],

      D: ['serviciosConsultoriaTI', 'serviciosCiberseguridad'],

      E: ['serviciosEmpresaTI'],

      F: ['serviciosCreativosTI', 'serviciosInfraTI']

    };

    (listFields[pack] || []).forEach(function (fid) {

      formatFieldValue(fid, p[fid]).split(' · ').forEach(function (x) {

        if (x && items.indexOf(x) < 0) items.push(x);

      });

    });

    if (p.modalidadServicioTI) {

      var mod = formatEnumValue('modalidadServicioTI', p.modalidadServicioTI);

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

    if (p.horarioDetalle) pushRow(rows, '🕐', 'Horario', p.horarioDetalle, 'horario');

    else if (u.horario) pushRow(rows, '🕐', 'Horario', u.horario, 'horario');

    if (p.certificaciones) pushRow(rows, '🎖️', 'Certificaciones', p.certificaciones);

    if (p.diferenciadorProfesional) pushRow(rows, '💡', 'Tu sello', p.diferenciadorProfesional);

    if (p.portfolioURL) pushRow(rows, '🔗', 'Portafolio', 'Disponible en línea');

    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');

    if (loc) pushRow(rows, '📍', 'Ubicación', loc);

    if (p.coberturaGeografica) pushRow(rows, '🗺️', 'Cobertura', p.coberturaGeografica);

    else if (p.direccion) pushRow(rows, '🏢', 'Dirección', p.direccion);

    return rows;

  }



  function buildBadges(u, canonId) {

    u = u || {};

    var p = perfilNested(u);

    var badges = [];

    if (txt(p.garantiaServicio)) {

      badges.push({ cls: 'res-badge--garantia', text: 'Con garantía' });

    }

    if (p.tiempoRespuestaSoporte === 'mismo_dia' || p.tiempoRespuestaSoporte === '24h') {

      badges.push({ cls: 'res-badge--respuesta', text: p.tiempoRespuestaSoporte === 'mismo_dia' ? 'Respuesta mismo día' : 'Respuesta 24 h' });

    }

    if (p.colaboracionesComerciales && txt(p.colaboracionesComerciales) && p.colaboracionesComerciales !== 'no') {

      badges.push({ cls: 'res-badge--colab', text: 'Colabora con otros' });

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

        ['Tecnología', 'Especialidad'],

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

      return ['Stack declarado', 'Servicios de desarrollo', 'Modalidad visible', 'Portafolio publicado'];

    }

    if (pack === 'B') {

      return ['Soporte y reparación', 'Tiempos de respuesta', 'Cobertura geográfica', 'Perfil verificable'];

    }

    if (pack === 'C') {

      return ['Marketing digital', 'Canales declarados', 'Modalidad de servicio', 'Perfil verificable'];

    }

    if (pack === 'D') {

      return ['Consultoría TI', 'Ciberseguridad', 'Certificaciones visibles', 'Perfil verificable'];

    }

    if (pack === 'E') {

      return ['Servicios empresariales', 'Especialidades visibles', 'Cobertura B2B', 'Perfil verificable'];

    }

    return ['Creativo e infraestructura', 'Servicios declarados', 'Modalidad visible', 'Perfil verificable en CariHub'];

  }



  function packFaq(canonId) {

    var pf = previewFields(canonId);

    if (pf.faq && pf.faq.length) {

      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });

    }

    return ['¿Cuál es la tarifa?', '¿Cuál es la modalidad de servicio?', '¿Cuál es el tiempo de respuesta?', '¿Cuál es la cobertura?'];

  }



  function resolvePrecioPublico(p, u) {

    p = p || {};

    u = u || {};

    if (txt(u.precio)) return u.precio;

    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);

    return '';

  }



  function resolvePriceLabel(u) {

    if (isTecnologiaNegocioPerfil(u)) return 'Servicios desde';

    return 'Tarifa desde';

  }



  function buildSobreMi(canonId, p, u) {

    if (txt(u.sobreMi)) return u.sobreMi;

    if (txt(u.sobreNosotros)) return u.sobreNosotros;

    if (txt(p.tagline)) return p.tagline;

    if (txt(u.tagline)) return u.tagline;

    if (p.diferenciadorProfesional) return p.diferenciadorProfesional;

    if (p.stackTecnologico) return formatFieldValue('stackTecnologico', p.stackTecnologico);

    if (p.especialidadesEmpresaTI) return formatFieldValue('especialidadesEmpresaTI', p.especialidadesEmpresaTI);

    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios de tecnología en tu zona.';

  }



  function hydrateDisplayFields(u) {

    u = u || {};

    if (!isTecnologiaSectorPerfil(u)) return u;

    var p = perfilNested(u);

    var canonId = resolveCanonSubId(u);

    var pack = packFrom(u);

    u.__tecnologiaCanon = canonId;

    u.__tecnologiaPack = pack;

    u.sectorId = u.sectorId || 'tecnologia';

    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios de tecnología';

    u.especialidad = u.especialidad || p.stackTecnologico && p.stackTecnologico[0] || p.especialidadMarketing && p.especialidadMarketing[0] || p.especialidadesEmpresaTI && p.especialidadesEmpresaTI[0] || u.titulo;

    u.servicios = u.servicios || u.titulo;

    u.tagline = u.tagline || p.tagline || '';

    u.sobreMi = buildSobreMi(canonId, p, u);

    u.sobreNosotros = u.sobreNosotros || u.sobreMi;

    u.precio = resolvePrecioPublico(p, u);

    u.horario = u.horario || p.horarioDetalle || '';

    if (isTecnologiaNegocioPerfil(u)) {

      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';

      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;

    } else {

      u.nombre = u.alias || p.alias || u.nombre || '';

      u.alias = p.alias || u.alias || u.nombre;

    }

    u.serviciosIncluidos = buildServiciosList(canonId, p);

    u.atencion = u.atencion || (p.modalidadServicioTI ? formatEnumValue('modalidadServicioTI', p.modalidadServicioTI) : 'Consultar modalidad');

    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });

    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || locParts.join(', ') || txt(p.direccion) || '';

    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);

    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {

      u.certificaciones = [[txt(p.certificaciones), 'Formación / certificación']];

    }

    u.__tecnologiaDatos = buildDatosRows(canonId, p, u);

    u.__tecnologiaBadges = buildBadges(u, canonId);

    u.__tecnologiaPriceLabel = resolvePriceLabel(u);

    u.diferenciadorProfesional = u.diferenciadorProfesional || p.diferenciadorProfesional || '';

    u.rating = u.rating != null ? u.rating : '—';

    u.opiniones = u.opiniones != null ? u.opiniones : 0;

    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];

    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);

    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length

      ? u.noIncluidos

      : ['Licencias de software no incluidas', 'Servicios fuera del alcance publicado', 'Soporte fuera de horario salvo indicación'];

    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);

    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);

    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];

    u.tiempoRespuesta = u.tiempoRespuesta || formatEnumValue('tiempoRespuestaSoporte', p.tiempoRespuestaSoporte) || formatEnumValue('tiempoRespuestaConsulta', p.tiempoRespuestaConsulta) || 'Consultar disponibilidad';

    if (txt(p.garantiaServicio)) u.garantia = p.garantiaServicio;

    return u;

  }



  function cardMetaChips(u) {

    u = hydrateDisplayFields(Object.assign({}, u));

    var p = perfilNested(u);

    var canonId = u.__tecnologiaCanon;

    var pf = previewFields(canonId);

    var chips = [];

    (pf.chips || []).slice(0, 3).forEach(function (fid) {

      var val = formatFieldValue(fid, p[fid]);

      if (val) chips.push(val.split(' · ')[0].slice(0, 28));

    });

    if (p.modalidadServicioTI) {

      chips.push(formatEnumValue('modalidadServicioTI', p.modalidadServicioTI).slice(0, 28));

    }

    if (p.tiempoRespuestaSoporte === 'mismo_dia' || p.tiempoRespuestaSoporte === '24h') {

      chips.push(p.tiempoRespuestaSoporte === 'mismo_dia' ? 'Mismo día' : '24 h');

    }

    if (txt(p.garantiaServicio)) chips.push('Con garantía');

    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);

  }



  global.CariHubTecnologiaSectorRender = {

    PACK_TITLES: PACK_TITLES,

    isTecnologiaSectorPerfil: isTecnologiaSectorPerfil,

    isTecnologiaNegocioPerfil: isTecnologiaNegocioPerfil,

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

