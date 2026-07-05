/**
 * MP-INDUSTRIA-DELTAS-V1 — packs A–E y mapa subcategoría → pack (33 subs).
 */
export const PACK_IDS = ["A", "B", "C", "D", "E"];

export const PACK_LABELS = {
  A: "Consultoría y servicios independientes",
  B: "Profesionistas certificados",
  C: "Manufactura y producción",
  D: "Servicios industriales",
  E: "Corporativo y outsourcing",
};

export const INDUSTRIA_FIELD_REGISTRY = {
  modalidadServicioIndustrial: {
    id: "modalidadServicioIndustrial",
    label: "Modalidad de servicio",
    tipo: "enum",
    opciones: ["planta", "sitio_cliente", "remoto", "mixto", "instalaciones"],
  },
  serviciosIndustriales: {
    id: "serviciosIndustriales",
    label: "Servicios industriales",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosEmpresaIndustrial: {
    id: "serviciosEmpresaIndustrial",
    label: "Servicios de la empresa",
    tipo: "checklist",
    iaCopy: true,
  },
  sectoresIndustriales: {
    id: "sectoresIndustriales",
    label: "Sectores / industrias atendidas",
    tipo: "checklist",
  },
  procesosIndustriales: {
    id: "procesosIndustriales",
    label: "Procesos o líneas",
    tipo: "checklist",
  },
  certificacionesIndustriales: {
    id: "certificacionesIndustriales",
    label: "Certificaciones (ISO, NOM…)",
    tipo: "checklist",
  },
  capacidadProduccion: {
    id: "capacidadProduccion",
    label: "Capacidad / volumen",
    tipo: "text",
    maxLength: 80,
  },
  equipamientoIndustrial: {
    id: "equipamientoIndustrial",
    label: "Equipamiento principal",
    tipo: "text",
    maxLength: 160,
  },
  especialidadIndustrial: {
    id: "especialidadIndustrial",
    label: "Especialidad industrial",
    tipo: "text",
    maxLength: 120,
  },
  serviciosProfesionalesIndustrial: {
    id: "serviciosProfesionalesIndustrial",
    label: "Servicios profesionales",
    tipo: "checklist",
  },
  tiempoRespuestaIndustrial: {
    id: "tiempoRespuestaIndustrial",
    label: "Tiempo de respuesta",
    tipo: "enum",
    opciones: ["inmediato", "mismo_dia", "24_48h", "por_cita"],
  },
  diferenciadorIndustrial: {
    id: "diferenciadorIndustrial",
    label: "Tu sello industrial",
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
    label: "¿Colaboras con plantas, maquiladoras o integradores?",
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
  manufactura: "C",
  maquila: "C",
  "automatizacion-industrial": "C",
  "maquinaria-industrial": "C",
  "soldadura-industrial": "C",
  "supervisor-industrial": "D",
  "tecnico-industrial": "D",
  "seguridad-industrial": "D",
  "mantenimiento-industrial": "D",
  "limpieza-industrial": "D",
  outsourcing: "E",
  "call-center": "E",
  "centro-de-negocios-empresarial": "E",
  "ingenieria-industrial": "E",
};

export const PACK_PROFESIONISTA_SUBS = new Set([
  "contador-publico",
  "administrador-de-empresas",
  "ingeniero-industrial",
  "ingeniero-en-procesos",
  "especialista-en-seguridad-industrial",
]);

export const PACK_NEGOCIO_SUBS = new Set([
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
  "limpieza-industrial",
]);

export function packPlantillaKey(pack) {
  return `industria_pack_${pack.toLowerCase()}`;
}

export function formularioIdForSub(subId) {
  if (PACK_PROFESIONISTA_SUBS.has(subId)) return "profesionista_cedula";
  if (PACK_NEGOCIO_SUBS.has(subId)) return "negocio_empresa";
  return "persona_independiente";
}
