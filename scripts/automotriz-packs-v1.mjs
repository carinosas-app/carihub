/**
 * MP-AUTOMOTRIZ-DELTAS-V1 — packs A–F y mapa subcategoría → pack (14 subs sector automotriz).
 */
export const PACK_IDS = ["A", "B", "C", "D", "E", "F"];

export const PACK_LABELS = {
  A: "Mecánica y reparación",
  B: "Llantas y vulcanización",
  C: "Carrocería y estética",
  D: "Refacciones y especialidades",
  E: "Venta de vehículos",
  F: "Grúas y auxilio vial",
};

export const AUTOMOTRIZ_FIELD_REGISTRY = {
  modalidadServicioAuto: {
    id: "modalidadServicioAuto",
    label: "Modalidad de servicio",
    tipo: "enum",
    opciones: ["taller_fijo", "domicilio", "ambos", "unidad_movil"],
  },
  serviciosMecanica: {
    id: "serviciosMecanica",
    label: "Servicios mecánicos",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadesMecanica: {
    id: "especialidadesMecanica",
    label: "Especialidades mecánicas",
    tipo: "checklist",
  },
  marcasAtendidas: {
    id: "marcasAtendidas",
    label: "Marcas que atiendes",
    tipo: "checklist",
  },
  tiposVehiculoAtendidos: {
    id: "tiposVehiculoAtendidos",
    label: "Tipos de vehículo",
    tipo: "checklist",
  },
  garantiaServicioAuto: {
    id: "garantiaServicioAuto",
    label: "Garantía del servicio",
    tipo: "text",
    maxLength: 120,
  },
  tiempoRespuestaAuto: {
    id: "tiempoRespuestaAuto",
    label: "Tiempo de respuesta",
    tipo: "enum",
    opciones: ["emergencia_30min", "1h", "2h", "mismo_dia", "por_cita"],
  },
  serviciosLlantas: {
    id: "serviciosLlantas",
    label: "Servicios de llantas",
    tipo: "checklist",
    iaCopy: true,
  },
  tiposLlantas: {
    id: "tiposLlantas",
    label: "Tipos de llantas",
    tipo: "checklist",
  },
  serviciosCarroceria: {
    id: "serviciosCarroceria",
    label: "Servicios de carrocería",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosEsteticaAuto: {
    id: "serviciosEsteticaAuto",
    label: "Servicios de estética automotriz",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosRefacciones: {
    id: "serviciosRefacciones",
    label: "Servicios / productos de refacciones",
    tipo: "checklist",
    iaCopy: true,
  },
  lineasRefacciones: {
    id: "lineasRefacciones",
    label: "Líneas o marcas de refacciones",
    tipo: "checklist",
  },
  serviciosEspecialidadAuto: {
    id: "serviciosEspecialidadAuto",
    label: "Servicios especializados",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosVentaAutos: {
    id: "serviciosVentaAutos",
    label: "Servicios de venta",
    tipo: "checklist",
    iaCopy: true,
  },
  tiposVehiculoVenta: {
    id: "tiposVehiculoVenta",
    label: "Tipos de vehículo en venta",
    tipo: "checklist",
  },
  financiamientoDisponible: {
    id: "financiamientoDisponible",
    label: "Financiamiento",
    tipo: "enum",
    opciones: ["si_propio", "si_terceros", "contado_solo", "convenir"],
  },
  inventarioAproximado: {
    id: "inventarioAproximado",
    label: "Inventario aproximado",
    tipo: "text",
    maxLength: 80,
  },
  cantidadUnidadesAprox: {
    id: "cantidadUnidadesAprox",
    label: "Unidades disponibles (aprox.)",
    tipo: "text",
    maxLength: 40,
  },
  serviciosGrua: {
    id: "serviciosGrua",
    label: "Servicios de grúa / auxilio",
    tipo: "checklist",
    iaCopy: true,
  },
  coberturaCarretera: {
    id: "coberturaCarretera",
    label: "Cobertura en carretera",
    tipo: "text",
    maxLength: 120,
  },
  anosExperienciaAuto: {
    id: "anosExperienciaAuto",
    label: "Años de experiencia",
    tipo: "enum",
    opciones: ["1_3", "4_7", "8_15", "16_mas"],
  },
  diferenciadorAutomotriz: {
    id: "diferenciadorAutomotriz",
    label: "Tu sello automotriz",
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
  colaboracionesComerciales: {
    id: "colaboracionesComerciales",
    label: "¿Colaboras con talleres, agencias o aseguradoras?",
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
  "talleres-mecanicos": "A",
  electromecanicos: "A",
  "mecanicos-a-domicilio": "A",
  vulcanizadoras: "B",
  "hojalateria-y-pintura": "C",
  "lavado-de-autos": "C",
  "detallado-automotriz-premium": "C",
  refaccionarias: "D",
  "instaladores-de-audio-car-multimedia": "D",
  "tecnicos-en-baterias": "D",
  "tecnicos-en-a-c-automotriz": "D",
  "agencias-de-autos": "E",
  "lotes-de-autos": "E",
  "gruas-y-auxilio-vial": "F",
};

export const PACK_NEGOCIO_SUBS = new Set(["agencias-de-autos"]);

export function packPlantillaKey(pack) {
  return `automotriz_pack_${pack.toLowerCase()}`;
}

export function formularioIdForSub(subId) {
  if (PACK_NEGOCIO_SUBS.has(subId)) return "negocio_empresa";
  return "persona_independiente";
}
