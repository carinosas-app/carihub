/**
 * MP-BIENES-RAICES-DELTAS-V1 — packs A–E y mapa subcategoría → pack (27 subs).
 */
export const PACK_IDS = ["A", "B", "C", "D", "E"];

export const PACK_LABELS = {
  A: "Asesores y profesionales",
  B: "Empresas inmobiliarias",
  C: "Venta de inmuebles",
  D: "Renta de inmuebles",
  E: "Espacios flexibles",
};

export const BIENES_RAICES_FIELD_REGISTRY = {
  modalidadOperacionInmobiliaria: {
    id: "modalidadOperacionInmobiliaria",
    label: "Modalidad de operación",
    tipo: "enum",
    opciones: ["venta", "renta", "venta_y_renta", "desarrollo", "administracion", "temporal"],
  },
  operacionInmobiliaria: {
    id: "operacionInmobiliaria",
    label: "Operación principal",
    tipo: "enum",
    opciones: ["venta", "renta", "temporal", "coworking"],
  },
  tiposInmuebleInmobiliario: {
    id: "tiposInmuebleInmobiliario",
    label: "Tipos de inmueble",
    tipo: "checklist",
  },
  serviciosInmobiliarios: {
    id: "serviciosInmobiliarios",
    label: "Servicios inmobiliarios",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosEmpresaInmobiliaria: {
    id: "serviciosEmpresaInmobiliaria",
    label: "Servicios de la empresa",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadesInmobiliarias: {
    id: "especialidadesInmobiliarias",
    label: "Especialidades",
    tipo: "checklist",
  },
  especialidadesEmpresaInmobiliaria: {
    id: "especialidadesEmpresaInmobiliaria",
    label: "Especialidades",
    tipo: "text",
    maxLength: 200,
  },
  rangoPrecioInmobiliario: {
    id: "rangoPrecioInmobiliario",
    label: "Rango de precio / renta",
    tipo: "text",
    maxLength: 80,
  },
  amenidadesInmueble: {
    id: "amenidadesInmueble",
    label: "Amenidades destacadas",
    tipo: "checklist",
  },
  caracteristicasInmueble: {
    id: "caracteristicasInmueble",
    label: "Características del inmueble",
    tipo: "text",
    maxLength: 200,
    iaCopy: true,
  },
  tiempoRespuestaInmobiliaria: {
    id: "tiempoRespuestaInmobiliaria",
    label: "Tiempo de respuesta",
    tipo: "enum",
    opciones: ["inmediato", "mismo_dia", "24_48h", "por_cita"],
  },
  diferenciadorInmobiliario: {
    id: "diferenciadorInmobiliario",
    label: "Tu sello inmobiliario",
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
    label: "¿Colaboras con notarías, bancos o desarrolladoras?",
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
  "agente-inmobiliario-independiente": "A",
  "asesor-inmobiliario": "A",
  "corredor-inmobiliario": "A",
  "promotor-de-propiedades": "A",
  "administrador-de-propiedades": "A",
  "valuador-inmobiliario": "A",
  "rentas-vacacionales-independiente": "A",
  "rentas-temporales-independiente": "A",
  inmobiliaria: "B",
  "agencia-de-bienes-raices": "B",
  "desarrolladora-inmobiliaria": "B",
  constructora: "B",
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
  coworking: "E",
  "centros-de-negocios-y-oficinas": "E",
};

export const PACK_NEGOCIO_SUBS = new Set(
  Object.keys(SUB_TO_PACK).filter((id) => SUB_TO_PACK[id] !== "A")
);

export function packPlantillaKey(pack) {
  return `bienes_raices_pack_${pack.toLowerCase()}`;
}

export function formularioIdForSub(subId) {
  if (PACK_NEGOCIO_SUBS.has(subId)) return "negocio_empresa";
  return "persona_independiente";
}
