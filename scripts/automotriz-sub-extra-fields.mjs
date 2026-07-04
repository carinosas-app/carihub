/**
 * MP-AUTOMOTRIZ-DELTAS-V1 — campos extra, ocultos y opciones por subcategoría (14 subs).
 */
import {
  mergeHideAdultLeaks,
  HIDE_ADULT_LEAKS,
  COLABORACIONES_COMERCIALES_OPTIONS,
  TIPOS_COLABORACION_COMERCIAL,
} from "./registro-cross-sector-policy.mjs";
import { mergeEnrichmentV2 } from "./automotriz-sub-enrichment-v2.mjs";

export const MODALIDAD_SERVICIO_AUTO = [
  { value: "taller_fijo", label: "Taller / local fijo" },
  { value: "domicilio", label: "Servicio a domicilio" },
  { value: "ambos", label: "Taller y domicilio" },
  { value: "unidad_movil", label: "Unidad móvil" },
];

export const TIEMPO_RESPUESTA_AUTO = [
  { value: "emergencia_30min", label: "Emergencia (~30 min)" },
  { value: "1h", label: "Dentro de 1 hora" },
  { value: "2h", label: "1–2 horas" },
  { value: "mismo_dia", label: "Mismo día" },
  { value: "por_cita", label: "Con cita programada" },
];

export const ANOS_EXPERIENCIA_AUTO = [
  { value: "1_3", label: "1–3 años" },
  { value: "4_7", label: "4–7 años" },
  { value: "8_15", label: "8–15 años" },
  { value: "16_mas", label: "16+ años" },
];

export const FINANCIAMIENTO_DISPONIBLE = [
  { value: "si_propio", label: "Financiamiento propio" },
  { value: "si_terceros", label: "Financiamiento con terceros" },
  { value: "contado_solo", label: "Solo contado" },
  { value: "convenir", label: "A convenir" },
];

export { HIDE_ADULT_LEAKS };

const COLAB_OPTS = {
  colaboracionesComerciales: COLABORACIONES_COMERCIALES_OPTIONS,
  tiposColaboracionComercial: TIPOS_COLABORACION_COMERCIAL,
};

const COMMON = {
  extraFields: [
    "diferenciadorAutomotriz",
    "coberturaGeografica",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: { ...COLAB_OPTS },
  textosAyuda: {
    diferenciadorAutomotriz: "Ej. Diagnóstico gratis · Especialista VW · Mismo día",
    coberturaGeografica: "Colonias, municipios o zona metropolitana.",
    colaboracionesComerciales: "¿Trabajas con talleres aliados, agencias o aseguradoras?",
  },
};

const A_MECANICA = {
  ...COMMON,
  extraFields: [
    "serviciosMecanica",
    "especialidadesMecanica",
    "modalidadServicioAuto",
    "marcasAtendidas",
    "tiposVehiculoAtendidos",
    "garantiaServicioAuto",
    "tiempoRespuestaAuto",
    "anosExperienciaAuto",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosMecanica",
    "especialidadesMecanica",
    "modalidadServicioAuto",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadServicioAuto: MODALIDAD_SERVICIO_AUTO.filter((o) => o.value !== "unidad_movil"),
    tiempoRespuestaAuto: TIEMPO_RESPUESTA_AUTO,
    anosExperienciaAuto: ANOS_EXPERIENCIA_AUTO,
    ...COLAB_OPTS,
  },
};

const B_LLANTAS = {
  ...COMMON,
  extraFields: [
    "serviciosLlantas",
    "tiposLlantas",
    "modalidadServicioAuto",
    "marcasAtendidas",
    "garantiaServicioAuto",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: ["serviciosLlantas", "tiposLlantas", "modalidadServicioAuto"],
  fieldOptions: {
    modalidadServicioAuto: MODALIDAD_SERVICIO_AUTO.filter((o) => o.value !== "unidad_movil"),
    ...COLAB_OPTS,
  },
};

const C_CARROCERIA = {
  ...COMMON,
  extraFields: [
    "serviciosCarroceria",
    "serviciosEsteticaAuto",
    "modalidadServicioAuto",
    "tiposVehiculoAtendidos",
    "garantiaServicioAuto",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: ["modalidadServicioAuto", "coberturaGeografica"],
  fieldOptions: {
    modalidadServicioAuto: MODALIDAD_SERVICIO_AUTO.filter((o) => o.value !== "unidad_movil"),
    ...COLAB_OPTS,
  },
};

const D_REFACCIONES = {
  ...COMMON,
  extraFields: [
    "serviciosRefacciones",
    "serviciosEspecialidadAuto",
    "lineasRefacciones",
    "modalidadServicioAuto",
    "marcasAtendidas",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: ["serviciosEspecialidadAuto", "modalidadServicioAuto"],
  fieldOptions: {
    modalidadServicioAuto: MODALIDAD_SERVICIO_AUTO.filter((o) => o.value !== "unidad_movil"),
    ...COLAB_OPTS,
  },
};

const E_VENTA_NEGOCIO = {
  extraFields: [
    "serviciosVentaAutos",
    "tiposVehiculoVenta",
    "financiamientoDisponible",
    "inventarioAproximado",
    "diferenciadorAutomotriz",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  obligatoriosExtra: [
    "serviciosVentaAutos",
    "tiposVehiculoVenta",
    "financiamientoDisponible",
    "inventarioAproximado",
  ],
  fieldOptions: {
    financiamientoDisponible: FINANCIAMIENTO_DISPONIBLE,
    ...COLAB_OPTS,
  },
  textosAyuda: {
    ...COMMON.textosAyuda,
    inventarioAproximado: "Ej. 15–30 unidades en piso",
  },
};

const E_VENTA_PERSONA = {
  ...COMMON,
  extraFields: [
    "serviciosVentaAutos",
    "tiposVehiculoVenta",
    "financiamientoDisponible",
    "cantidadUnidadesAprox",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosVentaAutos",
    "tiposVehiculoVenta",
    "financiamientoDisponible",
    "coberturaGeografica",
  ],
  fieldOptions: {
    financiamientoDisponible: FINANCIAMIENTO_DISPONIBLE,
    ...COLAB_OPTS,
  },
};

const F_GRUA = {
  ...COMMON,
  extraFields: [
    "serviciosGrua",
    "modalidadServicioAuto",
    "coberturaCarretera",
    "tiempoRespuestaAuto",
    "tiposVehiculoAtendidos",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosGrua",
    "modalidadServicioAuto",
    "coberturaGeografica",
    "tiempoRespuestaAuto",
    "coberturaCarretera",
  ],
  fieldOptions: {
    modalidadServicioAuto: MODALIDAD_SERVICIO_AUTO.filter((o) =>
      ["unidad_movil", "ambos"].includes(o.value)
    ),
    tiempoRespuestaAuto: TIEMPO_RESPUESTA_AUTO,
    ...COLAB_OPTS,
  },
};

/** Perfil por subcategoriaId */
export const SUB_EXTRA_PROFILES = {
  "talleres-mecanicos": {
    ...A_MECANICA,
    blockTitle: "Talleres mecánicos",
    blockHint: "Servicios mecánicos, marcas y modalidad — cobertura y garantía generan confianza.",
    aliasPlaceholder: "Ej. Taller Mecánico · Especialista en afinación",
    fieldOptions: {
      ...A_MECANICA.fieldOptions,
      serviciosMecanica: [
        "Afinación",
        "Frenos",
        "Suspensión",
        "Diagnóstico computarizado",
        "Cambio de aceite",
        "Mantenimiento preventivo",
        "Otro",
      ],
      especialidadesMecanica: [
        "Motor",
        "Transmisión",
        "Frenos",
        "Suspensión",
        "Dirección",
        "Inyección",
        "Diesel",
        "Otro",
      ],
      marcasAtendidas: ["Nissan", "VW", "Chevrolet", "Toyota", "Ford", "Hyundai", "Multimarca", "Otro"],
      tiposVehiculoAtendidos: ["Sedán", "SUV", "Pick-up", "Camioneta", "Flotilla ligera", "Otro"],
    },
  },
  electromecanicos: {
    ...A_MECANICA,
    blockTitle: "Electromecánicos",
    aliasPlaceholder: "Ej. Electromecánico · Diagnóstico y CAN bus",
    fieldOptions: {
      ...A_MECANICA.fieldOptions,
      serviciosMecanica: [
        "Diagnóstico eléctrico",
        "Alternador / marcha",
        "Sensores",
        "Tablero / luces",
        "Inmovilizador",
        "Cableado",
        "Otro",
      ],
      especialidadesMecanica: [
        "Sistema eléctrico",
        "Inyección electrónica",
        "CAN bus",
        "Alarmas OEM",
        "Híbridos",
        "Otro",
      ],
      marcasAtendidas: ["Nissan", "VW", "Chevrolet", "Toyota", "Ford", "BMW", "Multimarca", "Otro"],
      tiposVehiculoAtendidos: ["Sedán", "SUV", "Pick-up", "Camioneta", "Moto", "Otro"],
    },
  },
  "mecanicos-a-domicilio": {
    ...A_MECANICA,
    blockTitle: "Mecánicos a domicilio",
    aliasPlaceholder: "Ej. Mecánico a domicilio · CDMX sur",
    obligatoriosExtra: [
      "serviciosMecanica",
      "modalidadServicioAuto",
      "coberturaGeografica",
      "tiempoRespuestaAuto",
    ],
    fieldOptions: {
      ...A_MECANICA.fieldOptions,
      modalidadServicioAuto: MODALIDAD_SERVICIO_AUTO.filter((o) =>
        ["domicilio", "ambos"].includes(o.value)
      ),
      serviciosMecanica: [
        "Diagnóstico en sitio",
        "Afinación",
        "Frenos",
        "Batería",
        "Cambio de aceite",
        "Arranque en sitio",
        "Otro",
      ],
      especialidadesMecanica: ["Mecánica general", "Eléctrico básico", "Frenos", "Suspensión", "Otro"],
      marcasAtendidas: ["Multimarca", "Nissan", "VW", "Chevrolet", "Toyota", "Otro"],
      tiposVehiculoAtendidos: ["Sedán", "SUV", "Pick-up", "Camioneta", "Otro"],
    },
  },
  vulcanizadoras: {
    ...B_LLANTAS,
    blockTitle: "Vulcanizadoras",
    aliasPlaceholder: "Ej. Vulcanizadora · Llantas y alineación",
    fieldOptions: {
      ...B_LLANTAS.fieldOptions,
      serviciosLlantas: [
        "Venta de llantas",
        "Montaje",
        "Balanceo",
        "Alineación",
        "Reparación de pinchaduras",
        "Rotación",
        "Otro",
      ],
      tiposLlantas: ["Auto", "Camioneta / SUV", "Pick-up", "Moto", "Comercial ligero", "Otro"],
      marcasAtendidas: ["Michelin", "Goodyear", "Pirelli", "Hankook", "Yokohama", "Genérico", "Otro"],
    },
  },
  "hojalateria-y-pintura": {
    ...C_CARROCERIA,
    blockTitle: "Hojalatería y pintura",
    aliasPlaceholder: "Ej. Hojalatería · Pintura automotriz",
    obligatoriosExtra: ["serviciosCarroceria", "modalidadServicioAuto", "coberturaGeografica"],
    fieldOptions: {
      ...C_CARROCERIA.fieldOptions,
      serviciosCarroceria: [
        "Enderezado",
        "Pintura completa",
        "Pintura por panel",
        "Match de color",
        "Detallado post-pintura",
        "Seguros / siniestros",
        "Otro",
      ],
      serviciosEsteticaAuto: ["Pulido", "Encerado", "Limpieza profunda", "Otro"],
      tiposVehiculoAtendidos: ["Sedán", "SUV", "Pick-up", "Camioneta", "Motocicleta", "Otro"],
    },
  },
  "lavado-de-autos": {
    ...C_CARROCERIA,
    blockTitle: "Lavado de autos",
    aliasPlaceholder: "Ej. Lavado de autos · Express y completo",
    obligatoriosExtra: ["serviciosEsteticaAuto", "modalidadServicioAuto"],
    fieldOptions: {
      ...C_CARROCERIA.fieldOptions,
      serviciosEsteticaAuto: [
        "Lavado express",
        "Lavado completo",
        "Encerado",
        "Aspirado interior",
        "Lavado de motor",
        "Lavado a domicilio",
        "Otro",
      ],
      serviciosCarroceria: [],
      tiposVehiculoAtendidos: ["Sedán", "SUV", "Pick-up", "Camioneta", "Otro"],
    },
  },
  "detallado-automotriz-premium": {
    ...C_CARROCERIA,
    blockTitle: "Detallado automotriz premium",
    aliasPlaceholder: "Ej. Detailing premium · Cerámico y PPF",
    obligatoriosExtra: ["serviciosEsteticaAuto", "modalidadServicioAuto", "garantiaServicioAuto"],
    fieldOptions: {
      ...C_CARROCERIA.fieldOptions,
      serviciosEsteticaAuto: [
        "Detailing completo",
        "Corrección de pintura",
        "Protección cerámica",
        "PPF / película",
        "Limpieza de tapicería",
        "Restauración de faros",
        "Otro",
      ],
      serviciosCarroceria: ["Pulido profesional", "Otro"],
      tiposVehiculoAtendidos: ["Sedán", "SUV", "Pick-up", "Deportivo", "Clásico", "Otro"],
    },
  },
  refaccionarias: {
    ...D_REFACCIONES,
    blockTitle: "Refaccionarias",
    aliasPlaceholder: "Ej. Refaccionaria · Multimarca y entrega",
    obligatoriosExtra: ["serviciosRefacciones", "lineasRefacciones", "modalidadServicioAuto"],
    fieldOptions: {
      ...D_REFACCIONES.fieldOptions,
      serviciosRefacciones: [
        "Venta mostrador",
        "Pedidos especiales",
        "Entrega a domicilio",
        "Mayoreo",
        "Asesoría técnica",
        "Otro",
      ],
      serviciosEspecialidadAuto: ["Frenos", "Suspensión", "Motor", "Eléctrico", "Filtros", "Otro"],
      lineasRefacciones: ["Bosch", "Monroe", "NGK", "Gates", "Genérico", "OEM", "Otro"],
      marcasAtendidas: ["Nissan", "VW", "Chevrolet", "Toyota", "Ford", "Multimarca", "Otro"],
    },
  },
  "instaladores-de-audio-car-multimedia": {
    ...D_REFACCIONES,
    blockTitle: "Audio / car multimedia",
    aliasPlaceholder: "Ej. Car audio · Pantallas y amplificadores",
    obligatoriosExtra: ["serviciosEspecialidadAuto", "modalidadServicioAuto"],
    fieldOptions: {
      ...D_REFACCIONES.fieldOptions,
      serviciosEspecialidadAuto: [
        "Estéreos / pantallas",
        "Amplificadores",
        "Bocinas",
        "Alarmas",
        "Cámaras de reversa",
        "Apple CarPlay / Android Auto",
        "Otro",
      ],
      lineasRefacciones: ["Pioneer", "Kenwood", "Alpine", "JBL", "Sony", "Otro"],
      serviciosRefacciones: ["Venta de equipo", "Instalación", "Otro"],
    },
  },
  "tecnicos-en-baterias": {
    ...D_REFACCIONES,
    blockTitle: "Técnicos en baterías",
    aliasPlaceholder: "Ej. Baterías automotrices · Prueba y cambio",
    extraFields: [
      ...(D_REFACCIONES.extraFields || []),
      "tiempoRespuestaAuto",
    ],
    obligatoriosExtra: [
      "serviciosEspecialidadAuto",
      "modalidadServicioAuto",
      "tiempoRespuestaAuto",
      "coberturaGeografica",
    ],
    fieldOptions: {
      ...D_REFACCIONES.fieldOptions,
      modalidadServicioAuto: MODALIDAD_SERVICIO_AUTO.filter((o) =>
        ["domicilio", "ambos", "unidad_movil"].includes(o.value)
      ),
      serviciosEspecialidadAuto: [
        "Cambio de batería",
        "Prueba de carga",
        "Arranque auxiliar",
        "Instalación",
        "Reciclaje",
        "Otro",
      ],
      tiempoRespuestaAuto: TIEMPO_RESPUESTA_AUTO,
    },
  },
  "tecnicos-en-a-c-automotriz": {
    ...D_REFACCIONES,
    blockTitle: "A/C automotriz",
    aliasPlaceholder: "Ej. A/C automotriz · Carga y diagnóstico",
    fieldOptions: {
      ...D_REFACCIONES.fieldOptions,
      serviciosEspecialidadAuto: [
        "Carga de gas",
        "Diagnóstico de fugas",
        "Cambio de compresor",
        "Limpieza de evaporador",
        "Mantenimiento A/C",
        "Otro",
      ],
    },
  },
  "agencias-de-autos": {
    ...E_VENTA_NEGOCIO,
    blockTitle: "Agencias de autos",
    blockHint: "Inventario, financiamiento y servicios de agencia.",
    fieldOptions: {
      ...E_VENTA_NEGOCIO.fieldOptions,
      serviciosVentaAutos: [
        "Venta de nuevos",
        "Venta de seminuevos",
        "Consignación",
        "Permuta",
        "Entrega inmediata",
        "Prueba de manejo",
        "Otro",
      ],
      tiposVehiculoVenta: ["Nuevo", "Seminuevo", "Usado certificado", "Flotilla", "Otro"],
    },
  },
  "lotes-de-autos": {
    ...E_VENTA_PERSONA,
    blockTitle: "Lotes de autos",
    aliasPlaceholder: "Ej. Lote de seminuevos · Contado y crédito",
    fieldOptions: {
      ...E_VENTA_PERSONA.fieldOptions,
      serviciosVentaAutos: [
        "Venta contado",
        "Seminuevos",
        "Consignación",
        "Permuta",
        "Entrega inmediata",
        "Otro",
      ],
      tiposVehiculoVenta: ["Seminuevo", "Usado", "Consignación", "Pick-up", "SUV", "Otro"],
    },
  },
  "gruas-y-auxilio-vial": {
    ...F_GRUA,
    blockTitle: "Grúas y auxilio vial",
    aliasPlaceholder: "Ej. Grúa 24 h · Auxilio en carretera",
    fieldOptions: {
      ...F_GRUA.fieldOptions,
      serviciosGrua: [
        "Grúa local",
        "Grúa carretera",
        "Auxilio mecánico",
        "Paso de corriente",
        "Cambio de llanta",
        "Combustible",
        "Otro",
      ],
      tiposVehiculoAtendidos: ["Sedán", "SUV", "Pick-up", "Camioneta", "Motocicleta", "Otro"],
    },
  },
};

for (const subId of Object.keys(SUB_EXTRA_PROFILES)) {
  SUB_EXTRA_PROFILES[subId] = mergeEnrichmentV2(SUB_EXTRA_PROFILES[subId], subId);
  const p = SUB_EXTRA_PROFILES[subId];
  p.hideFields = mergeHideAdultLeaks(p.hideFields || []);
  if (subId !== "agencias-de-autos") {
    p.extraFields = [...new Set([...(p.extraFields || []), "colaboracionesComerciales"])];
  }
  p.fieldOptions = p.fieldOptions || {};
  if (!p.fieldOptions.colaboracionesComerciales) {
    p.fieldOptions.colaboracionesComerciales = COLABORACIONES_COMERCIALES_OPTIONS;
  }
  if (!p.fieldOptions.tiposColaboracionComercial) {
    p.fieldOptions.tiposColaboracionComercial = TIPOS_COLABORACION_COMERCIAL;
  }
}
