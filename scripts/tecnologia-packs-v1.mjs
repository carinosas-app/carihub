/**
 * MP-TECNOLOGIA-DELTAS-V1 — packs A–F y mapa subcategoría → pack (32 subs sector tecnologia).
 */
export const PACK_IDS = ["A", "B", "C", "D", "E", "F"];

export const PACK_LABELS = {
  A: "Desarrollo profesional",
  B: "Soporte y reparación",
  C: "Marketing digital (persona)",
  D: "Consultoría y ciberseguridad",
  E: "Negocio / agencia TI",
  F: "Creativo e infraestructura",
};

/** Campos nuevos — persona_independiente + negocio_empresa */
export const TECNOLOGIA_FIELD_REGISTRY = {
  modalidadServicioTI: {
    id: "modalidadServicioTI",
    label: "Modalidad de servicio",
    tipo: "enum",
    opciones: ["remoto", "presencial", "hibrido", "visita_cliente", "domicilio"],
  },
  stackTecnologico: {
    id: "stackTecnologico",
    label: "Stack / tecnologías principales",
    tipo: "checklist",
    iaCopy: true,
  },
  lenguajesFrameworks: {
    id: "lenguajesFrameworks",
    label: "Lenguajes y frameworks",
    tipo: "text",
    maxLength: 200,
  },
  serviciosDesarrollo: {
    id: "serviciosDesarrollo",
    label: "Servicios de desarrollo",
    tipo: "checklist",
    iaCopy: true,
  },
  tipoProyectosDev: {
    id: "tipoProyectosDev",
    label: "Tipos de proyecto",
    tipo: "checklist",
  },
  serviciosSoporteTI: {
    id: "serviciosSoporteTI",
    label: "Servicios de soporte TI",
    tipo: "checklist",
    iaCopy: true,
  },
  tiposEquipoSoporte: {
    id: "tiposEquipoSoporte",
    label: "Equipos que atiendes",
    tipo: "checklist",
  },
  serviciosReparacion: {
    id: "serviciosReparacion",
    label: "Reparaciones y mantenimiento",
    tipo: "checklist",
    iaCopy: true,
  },
  tiempoRespuestaSoporte: {
    id: "tiempoRespuestaSoporte",
    label: "Tiempo de respuesta",
    tipo: "enum",
    opciones: ["mismo_dia", "24h", "48h", "por_cita", "sla_contrato"],
  },
  tiposClientesSoporte: {
    id: "tiposClientesSoporte",
    label: "Tipos de clientes",
    tipo: "checklist",
  },
  garantiaServicio: {
    id: "garantiaServicio",
    label: "Garantía del servicio",
    tipo: "text",
    maxLength: 120,
  },
  serviciosMarketingDigital: {
    id: "serviciosMarketingDigital",
    label: "Servicios de marketing digital",
    tipo: "checklist",
    iaCopy: true,
  },
  canalesMarketing: {
    id: "canalesMarketing",
    label: "Canales que manejas",
    tipo: "checklist",
  },
  especialidadMarketing: {
    id: "especialidadMarketing",
    label: "Especialidad",
    tipo: "checklist",
    iaCopy: true,
  },
  herramientasMarketing: {
    id: "herramientasMarketing",
    label: "Herramientas / plataformas",
    tipo: "text",
    maxLength: 200,
  },
  areasConsultoriaTI: {
    id: "areasConsultoriaTI",
    label: "Áreas de consultoría TI",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosConsultoriaTI: {
    id: "serviciosConsultoriaTI",
    label: "Servicios de consultoría",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosCiberseguridad: {
    id: "serviciosCiberseguridad",
    label: "Servicios de ciberseguridad",
    tipo: "checklist",
    iaCopy: true,
  },
  certificacionesSeguridad: {
    id: "certificacionesSeguridad",
    label: "Certificaciones de seguridad",
    tipo: "checklist",
  },
  serviciosEmpresaTI: {
    id: "serviciosEmpresaTI",
    label: "Servicios de la empresa",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadesEmpresaTI: {
    id: "especialidadesEmpresaTI",
    label: "Especialidades de la empresa",
    tipo: "tags",
    iaCopy: true,
  },
  tamanoEmpresaAtendida: {
    id: "tamanoEmpresaAtendida",
    label: "Tamaño de clientes atendidos",
    tipo: "checklist",
  },
  serviciosCreativosTI: {
    id: "serviciosCreativosTI",
    label: "Servicios creativos / audiovisual",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadCreativaTI: {
    id: "especialidadCreativaTI",
    label: "Especialidad creativa",
    tipo: "checklist",
    iaCopy: true,
  },
  plataformasInfra: {
    id: "plataformasInfra",
    label: "Plataformas / proveedores",
    tipo: "checklist",
  },
  serviciosInfraTI: {
    id: "serviciosInfraTI",
    label: "Servicios de infraestructura",
    tipo: "checklist",
    iaCopy: true,
  },
  softwareHerramientas: {
    id: "softwareHerramientas",
    label: "Software / herramientas",
    tipo: "text",
    maxLength: 200,
  },
  portfolioURL: {
    id: "portfolioURL",
    label: "Portafolio (URL)",
    tipo: "url",
    maxLength: 300,
  },
  anosExperienciaTI: {
    id: "anosExperienciaTI",
    label: "Años de experiencia",
    tipo: "enum",
    opciones: ["1_3", "4_7", "8_15", "16_mas"],
  },
  industriasAtendidas: {
    id: "industriasAtendidas",
    label: "Industrias atendidas",
    tipo: "checklist",
  },
  diferenciadorProfesional: {
    id: "diferenciadorProfesional",
    label: "Tu sello profesional",
    tipo: "text",
    maxLength: 160,
    iaCopy: true,
  },
  coberturaGeografica: {
    id: "coberturaGeografica",
    label: "Zona de atención",
    tipo: "text",
    maxLength: 120,
    iaCopy: true,
  },
  tiempoRespuestaConsulta: {
    id: "tiempoRespuestaConsulta",
    label: "Tiempo de respuesta a consultas",
    tipo: "enum",
    opciones: ["mismo_dia", "24_48h", "3_5_dias", "por_cita"],
  },
  colaboracionesComerciales: {
    id: "colaboracionesComerciales",
    label: "¿Colaboras con otros profesionales o negocios?",
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
  programador: "A",
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
  "servicios-cloud": "F",
};

export const PACK_NEGOCIO_SUBS = new Set(
  Object.entries(SUB_TO_PACK)
    .filter(([id]) =>
      [
        "agencia-de-marketing-digital",
        "agencia-seo",
        "agencia-de-publicidad-digital",
        "hosting-y-dominios",
        "ciberseguridad-empresarial",
        "soporte-empresarial-ti",
        "venta-de-equipo-de-computo",
      ].includes(id)
    )
    .map(([id]) => id)
);

export function packPlantillaKey(pack) {
  return `tecnologia_pack_${pack.toLowerCase()}`;
}

export function formularioIdForSub(subId) {
  if (PACK_NEGOCIO_SUBS.has(subId)) return "negocio_empresa";
  return "persona_independiente";
}

export function buildPackPlantillas() {
  const p = {};
  p.tecnologia_pack_a = {
    heredaDe: "persona_servicio_profesional",
    deltaPack: "A",
    formularioId: "persona_independiente",
    camposPublicosPerfil: ["stackTecnologico", "serviciosDesarrollo", "modalidadServicioTI"],
    obligatoriosExtra: ["stackTecnologico", "serviciosDesarrollo", "modalidadServicioTI", "tarifaDesde", "horarioDetalle"],
    keywordsIA: ["desarrollo", "software", "programador", "web", "apps"],
  };
  p.tecnologia_pack_b = {
    heredaDe: "persona_servicio_profesional",
    deltaPack: "B",
    camposPublicosPerfil: ["serviciosSoporteTI", "tiposEquipoSoporte", "modalidadServicioTI"],
    obligatoriosExtra: ["serviciosSoporteTI", "tiposEquipoSoporte", "modalidadServicioTI", "coberturaGeografica", "tarifaDesde", "horarioDetalle"],
    keywordsIA: ["soporte", "reparación", "computadoras", "helpdesk"],
  };
  p.tecnologia_pack_c = {
    heredaDe: "persona_servicio_profesional",
    deltaPack: "C",
    camposPublicosPerfil: ["serviciosMarketingDigital", "canalesMarketing", "modalidadServicioTI"],
    obligatoriosExtra: ["serviciosMarketingDigital", "canalesMarketing", "modalidadServicioTI", "tarifaDesde", "horarioDetalle"],
    keywordsIA: ["marketing digital", "SEO", "SEM", "redes sociales"],
  };
  p.tecnologia_pack_d = {
    heredaDe: "persona_servicio_profesional",
    deltaPack: "D",
    camposPublicosPerfil: ["areasConsultoriaTI", "serviciosConsultoriaTI", "modalidadServicioTI"],
    obligatoriosExtra: ["areasConsultoriaTI", "serviciosConsultoriaTI", "modalidadServicioTI", "tarifaDesde", "horarioDetalle"],
    keywordsIA: ["consultoría", "ciberseguridad", "IT", "transformación digital"],
  };
  p.tecnologia_pack_e = {
    heredaDe: "negocio_servicios_local",
    deltaPack: "E",
    formularioId: "negocio_empresa",
    camposPublicosPerfil: ["serviciosEmpresaTI", "especialidadesEmpresaTI", "tamanoEmpresaAtendida"],
    obligatoriosExtra: ["nombreComercial", "serviciosEmpresaTI", "especialidadesEmpresaTI", "direccion", "horarioDetalle", "geo"],
    keywordsIA: ["agencia", "empresa TI", "marketing", "equipo de cómputo"],
  };
  p.tecnologia_pack_f = {
    heredaDe: "persona_servicio_profesional",
    deltaPack: "F",
    camposPublicosPerfil: ["serviciosCreativosTI", "especialidadCreativaTI", "modalidadServicioTI"],
    obligatoriosExtra: ["serviciosCreativosTI", "especialidadCreativaTI", "modalidadServicioTI", "portfolioURL", "tarifaDesde", "horarioDetalle"],
    keywordsIA: ["diseño", "video", "cloud", "hosting", "telecom"],
  };
  return p;
}

export function arquetipoForPack(pack, subId) {
  if (PACK_NEGOCIO_SUBS.has(subId)) return "negocio_servicios_local";
  return packPlantillaKey(pack);
}
