/**
 * MP-PROFESIONALES-DELTAS-V1 — packs A–H y mapa subcategoría → pack (50 subs sector profesionales).
 */
export const PACK_IDS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const PACK_LABELS = {
  A: "Profesionista con cédula",
  B: "Despacho / firma profesional",
  C: "Legal, fiscal y trámites",
  D: "Arquitectura y servicios técnicos",
  E: "Consultoría y recursos humanos",
  F: "Creativo, marketing y comunicación",
  G: "Seguros, finanzas y comercio",
  H: "Negocio / empresa profesional",
};

/** Campos nuevos — persona_independiente + negocio_empresa + profesionista_cedula */
export const PROFESIONALES_FIELD_REGISTRY = {
  modalidadAtencionProfesional: {
    id: "modalidadAtencionProfesional",
    label: "Modalidad de atención",
    tipo: "enum",
    opciones: ["consultorio", "videollamada", "hibrido", "visita_cliente"],
  },
  especialidadProfesional: {
    id: "especialidadProfesional",
    label: "Especialidad o área principal",
    tipo: "text",
    maxLength: 120,
    iaCopy: true,
  },
  serviciosProfesionales: {
    id: "serviciosProfesionales",
    label: "Servicios profesionales",
    tipo: "checklist",
    iaCopy: true,
  },
  areasDerecho: {
    id: "areasDerecho",
    label: "Áreas del derecho",
    tipo: "checklist",
    iaCopy: true,
  },
  tiposClientesLegales: {
    id: "tiposClientesLegales",
    label: "Tipos de clientes",
    tipo: "checklist",
  },
  serviciosLegales: {
    id: "serviciosLegales",
    label: "Servicios legales",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosDespacho: {
    id: "serviciosDespacho",
    label: "Servicios del despacho",
    tipo: "checklist",
    iaCopy: true,
  },
  areasPracticaDespacho: {
    id: "areasPracticaDespacho",
    label: "Áreas de práctica",
    tipo: "checklist",
    iaCopy: true,
  },
  tamanoEquipoDespacho: {
    id: "tamanoEquipoDespacho",
    label: "Tamaño del equipo",
    tipo: "enum",
    opciones: ["individual", "pequeno_2_5", "mediano_6_15", "grande_16_mas"],
  },
  serviciosContables: {
    id: "serviciosContables",
    label: "Servicios contables",
    tipo: "checklist",
    iaCopy: true,
  },
  tiposClientesContables: {
    id: "tiposClientesContables",
    label: "Tipos de clientes",
    tipo: "checklist",
  },
  serviciosFiscalesLegales: {
    id: "serviciosFiscalesLegales",
    label: "Servicios fiscales / legales",
    tipo: "checklist",
    iaCopy: true,
  },
  tiposClientesProfesionales: {
    id: "tiposClientesProfesionales",
    label: "Tipos de clientes atendidos",
    tipo: "checklist",
  },
  serviciosTramites: {
    id: "serviciosTramites",
    label: "Trámites y gestiones",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadTecnica: {
    id: "especialidadTecnica",
    label: "Especialidad técnica",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosTecnicos: {
    id: "serviciosTecnicos",
    label: "Servicios técnicos",
    tipo: "checklist",
    iaCopy: true,
  },
  softwareHerramientas: {
    id: "softwareHerramientas",
    label: "Software / herramientas",
    tipo: "text",
    maxLength: 200,
  },
  areasConsultoria: {
    id: "areasConsultoria",
    label: "Áreas de consultoría",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosConsultoria: {
    id: "serviciosConsultoria",
    label: "Servicios de consultoría",
    tipo: "checklist",
    iaCopy: true,
  },
  industriasAtendidas: {
    id: "industriasAtendidas",
    label: "Industrias atendidas",
    tipo: "checklist",
  },
  serviciosCreativos: {
    id: "serviciosCreativos",
    label: "Servicios creativos",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadCreativa: {
    id: "especialidadCreativa",
    label: "Especialidad creativa",
    tipo: "checklist",
    iaCopy: true,
  },
  idiomasServicio: {
    id: "idiomasServicio",
    label: "Idiomas de servicio",
    tipo: "text",
    maxLength: 120,
  },
  serviciosFinancieros: {
    id: "serviciosFinancieros",
    label: "Servicios financieros / comerciales",
    tipo: "checklist",
    iaCopy: true,
  },
  aseguradorasRepresentadas: {
    id: "aseguradorasRepresentadas",
    label: "Aseguradoras / instituciones",
    tipo: "text",
    maxLength: 200,
  },
  normasCertificaciones: {
    id: "normasCertificaciones",
    label: "Normas / certificaciones",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosEmpresariales: {
    id: "serviciosEmpresariales",
    label: "Servicios empresariales",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadesEmpresa: {
    id: "especialidadesEmpresa",
    label: "Especialidades de la empresa",
    tipo: "tags",
    iaCopy: true,
  },
  tamanoEmpresaAtendida: {
    id: "tamanoEmpresaAtendida",
    label: "Tamaño de empresas atendidas",
    tipo: "checklist",
  },
  anosExperienciaProfesional: {
    id: "anosExperienciaProfesional",
    label: "Años de experiencia",
    tipo: "enum",
    opciones: ["1_3", "4_7", "8_15", "16_mas"],
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
  regimenesFiscales: {
    id: "regimenesFiscales",
    label: "Regímenes fiscales que manejas",
    tipo: "checklist",
    iaCopy: true,
  },
  instanciasJudiciales: {
    id: "instanciasJudiciales",
    label: "Instancias y etapas procesales",
    tipo: "checklist",
  },
  estilosArquitectonicos: {
    id: "estilosArquitectonicos",
    label: "Estilos arquitectónicos",
    tipo: "checklist",
    iaCopy: true,
  },
  metodologiasConsultoria: {
    id: "metodologiasConsultoria",
    label: "Cómo trabajas con clientes",
    tipo: "checklist",
  },
  tiposEntregablesCreativos: {
    id: "tiposEntregablesCreativos",
    label: "Qué incluye tu servicio",
    tipo: "checklist",
  },
  tiposPolizaSeguros: {
    id: "tiposPolizaSeguros",
    label: "Tipos de póliza / ramos",
    tipo: "checklist",
  },
  portfolioURL: {
    id: "portfolioURL",
    label: "Portafolio (URL)",
    tipo: "url",
    maxLength: 300,
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
  abogados: "A",
  contadores: "A",
  ingenieros: "A",
  "despachos-juridicos": "B",
  "despachos-contables": "B",
  "despachos-de-arquitectura": "B",
  "despachos-de-ingenieria": "B",
  "asesoria-fiscal": "C",
  auditoria: "C",
  notarias: "C",
  "corredurias-publicas": "C",
  "gestoria-y-tramites": "C",
  arquitectos: "D",
  topografia: "D",
  avaluos: "D",
  peritos: "D",
  "consultoria-financiera": "E",
  "consultoria-de-negocios": "E",
  "recursos-humanos": "E",
  "reclutamiento-y-seleccion": "E",
  "estudios-socioeconomicos": "E",
  "coaching-ejecutivo": "E",
  "desarrollo-organizacional": "E",
  franquicias: "E",
  "traduccion-e-interpretacion": "F",
  "marketing-y-publicidad": "F",
  "diseno-grafico": "F",
  "diseno-de-interiores": "F",
  "branding-e-identidad-corporativa": "F",
  "fotografia-profesional": "F",
  "produccion-de-video": "F",
  "relaciones-publicas": "F",
  "investigacion-de-mercados": "F",
  seguros: "G",
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
  "responsabilidad-social-empresarial": "H",
};

export const PACK_A_CEDULA_SUBS = new Set(
  Object.entries(SUB_TO_PACK)
    .filter(([, p]) => p === "A")
    .map(([id]) => id)
);

export const PACK_H_NEGOCIO_SUBS = new Set(
  Object.entries(SUB_TO_PACK)
    .filter(([, p]) => p === "H")
    .map(([id]) => id)
);

export function packPlantillaKey(pack) {
  return `profesionales_pack_${pack.toLowerCase()}`;
}

export function formularioIdForSub(subId, pack) {
  if (PACK_A_CEDULA_SUBS.has(subId)) return "profesionista_cedula";
  if (PACK_H_NEGOCIO_SUBS.has(subId)) return "negocio_empresa";
  return "persona_independiente";
}

export function buildPackPlantillas() {
  const p = {};
  p.profesionales_pack_a = {
    heredaDe: "profesional_tecnico_legal",
    deltaPack: "A",
    formularioId: "profesionista_cedula",
    camposPublicosPerfil: ["especialidadProfesional", "serviciosProfesionales", "modalidadAtencionProfesional"],
    obligatoriosExtra: ["especialidadProfesional", "serviciosProfesionales", "modalidadAtencionProfesional", "precioConsulta", "horarioAtencion"],
    keywordsIA: ["abogado", "contador", "ingeniero", "cédula", "profesionista"],
    textosAyuda: {
      especialidadProfesional: "Debe coincidir con tu cédula o ser coherente — admin puede revisar.",
      serviciosProfesionales: "Consultas, asesorías, dictámenes u otros servicios que ofreces.",
    },
  };
  p.profesionales_pack_b = {
    heredaDe: "persona_servicio_profesional",
    deltaPack: "B",
    camposPublicosPerfil: ["serviciosDespacho", "areasPracticaDespacho", "tamanoEquipoDespacho"],
    obligatoriosExtra: ["serviciosDespacho", "areasPracticaDespacho", "tamanoEquipoDespacho", "modalidadAtencionProfesional", "horarioDetalle", "geo"],
    keywordsIA: ["despacho", "firma", "equipo profesional"],
  };
  p.profesionales_pack_c = {
    heredaDe: "persona_servicio_profesional",
    deltaPack: "C",
    camposPublicosPerfil: ["serviciosFiscalesLegales", "tiposClientesProfesionales", "modalidadAtencionProfesional"],
    obligatoriosExtra: ["serviciosFiscalesLegales", "modalidadAtencionProfesional", "certificaciones", "tarifaDesde", "horarioDetalle"],
    keywordsIA: ["fiscal", "legal", "notaría", "trámites"],
  };
  p.profesionales_pack_d = {
    heredaDe: "persona_servicio_profesional",
    deltaPack: "D",
    camposPublicosPerfil: ["especialidadTecnica", "serviciosTecnicos", "modalidadAtencionProfesional"],
    obligatoriosExtra: ["especialidadTecnica", "serviciosTecnicos", "modalidadAtencionProfesional", "certificaciones", "tarifaDesde", "horarioDetalle"],
    keywordsIA: ["arquitectura", "ingeniería", "técnico", "avalúo", "perito"],
  };
  p.profesionales_pack_e = {
    heredaDe: "persona_servicio_profesional",
    deltaPack: "E",
    camposPublicosPerfil: ["areasConsultoria", "serviciosConsultoria", "modalidadAtencionProfesional"],
    obligatoriosExtra: ["areasConsultoria", "serviciosConsultoria", "modalidadAtencionProfesional", "certificaciones", "tarifaDesde", "horarioDetalle"],
    keywordsIA: ["consultoría", "recursos humanos", "coaching", "negocios"],
  };
  p.profesionales_pack_f = {
    heredaDe: "persona_servicio_profesional",
    deltaPack: "F",
    camposPublicosPerfil: ["serviciosCreativos", "especialidadCreativa", "modalidadAtencionProfesional"],
    obligatoriosExtra: ["serviciosCreativos", "especialidadCreativa", "modalidadAtencionProfesional", "portfolioURL", "tarifaDesde", "horarioDetalle"],
    keywordsIA: ["diseño", "marketing", "creativo", "comunicación"],
  };
  p.profesionales_pack_g = {
    heredaDe: "persona_servicio_profesional",
    deltaPack: "G",
    camposPublicosPerfil: ["serviciosFinancieros", "tiposClientesProfesionales", "modalidadAtencionProfesional"],
    obligatoriosExtra: ["serviciosFinancieros", "modalidadAtencionProfesional", "certificaciones", "tarifaDesde", "horarioDetalle"],
    keywordsIA: ["seguros", "finanzas", "comercio exterior", "normatividad"],
  };
  p.profesionales_pack_h = {
    heredaDe: "negocio_servicios_local",
    deltaPack: "H",
    formularioId: "negocio_empresa",
    camposPublicosPerfil: ["serviciosEmpresariales", "especialidadesEmpresa", "tamanoEmpresaAtendida"],
    obligatoriosExtra: ["nombreComercial", "serviciosEmpresariales", "especialidadesEmpresa", "direccion", "horarioDetalle", "geo"],
    keywordsIA: ["empresa", "consultoría empresarial", "capacitación", "agencia"],
  };
  return p;
}

export function arquetipoForPack(pack, subId) {
  if (PACK_A_CEDULA_SUBS.has(subId)) return "profesional_tecnico_legal";
  if (PACK_H_NEGOCIO_SUBS.has(subId)) return "negocio_servicios_local";
  return packPlantillaKey(pack);
}
