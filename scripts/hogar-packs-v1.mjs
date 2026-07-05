/**
 * MP-HOGAR-DELTAS-V1 — packs A–D y mapa subcategoría → pack (17 subs sector hogar).
 */
export const PACK_IDS = ["A", "B", "C", "D"];

export const PACK_LABELS = {
  A: "Obra húmeda y albañilería",
  B: "Electricidad y tecnología hogar",
  C: "Carpintería, herrería e instalaciones",
  D: "Acabados, jardín y mantenimiento",
};

export const HOGAR_FIELD_REGISTRY = {
  modalidadServicioHogar: {
    id: "modalidadServicioHogar",
    label: "Modalidad de servicio",
    tipo: "enum",
    opciones: ["domicilio", "taller", "ambos", "emergencia_24h"],
  },
  serviciosHogar: {
    id: "serviciosHogar",
    label: "Servicios que ofreces",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadesHogar: {
    id: "especialidadesHogar",
    label: "Especialidades",
    tipo: "checklist",
  },
  tiposTrabajoHogar: {
    id: "tiposTrabajoHogar",
    label: "Tipos de trabajo",
    tipo: "checklist",
  },
  tiposInmueble: {
    id: "tiposInmueble",
    label: "Tipos de inmueble",
    tipo: "checklist",
  },
  tiempoRespuestaHogar: {
    id: "tiempoRespuestaHogar",
    label: "Tiempo de respuesta",
    tipo: "enum",
    opciones: ["emergencia_2h", "mismo_dia", "24_48h", "por_cita"],
  },
  garantiaServicioHogar: {
    id: "garantiaServicioHogar",
    label: "Garantía del servicio",
    tipo: "text",
    maxLength: 120,
  },
  anosExperienciaHogar: {
    id: "anosExperienciaHogar",
    label: "Años de experiencia",
    tipo: "enum",
    opciones: ["1_3", "4_7", "8_15", "16_mas"],
  },
  materialesIncluidos: {
    id: "materialesIncluidos",
    label: "Materiales incluidos",
    tipo: "enum",
    opciones: ["solo_mano_obra", "con_materiales", "convenir", "mixto"],
  },
  diferenciadorHogar: {
    id: "diferenciadorHogar",
    label: "Tu sello en el oficio",
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
    label: "¿Colaboras con otros oficios o constructoras?",
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
  plomeros: "A",
  albaniles: "A",
  impermeabilizadores: "A",
  electricistas: "B",
  "tecnicos-en-clima-hvac": "B",
  "instaladores-de-paneles-solares": "B",
  "tecnicos-en-camaras-de-seguridad": "B",
  "domotica-casa-inteligente": "B",
  carpinteros: "C",
  herreros: "C",
  "instaladores-de-pisos": "C",
  cerrajeros: "C",
  pintores: "D",
  jardineria: "D",
  fumigacion: "D",
  "limpieza-del-hogar": "D",
  "mantenimiento-general": "D",
};

export const PACK_NEGOCIO_SUBS = new Set();

export function packPlantillaKey(pack) {
  return `hogar_pack_${pack.toLowerCase()}`;
}

export function formularioIdForSub() {
  return "persona_independiente";
}
