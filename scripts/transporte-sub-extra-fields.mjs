/**
 * MP-TRANSPORTE-DELTAS-V1 — campos extra, ocultos y opciones por subcategoría (24 subs).
 */
import {
  mergeHideAdultLeaks,
  HIDE_ADULT_LEAKS,
  COLABORACIONES_COMERCIALES_OPTIONS,
  TIPOS_COLABORACION_COMERCIAL,
} from "./registro-cross-sector-policy.mjs";
import { mergeEnrichmentV2 } from "./transporte-sub-enrichment-v2.mjs";

export const MODALIDAD_SERVICIO_TRANSPORTE = [
  { value: "local_ciudad", label: "Local / ciudad" },
  { value: "metropolitana", label: "Zona metropolitana" },
  { value: "regional", label: "Regional / estatal" },
  { value: "nacional", label: "Nacional" },
  { value: "internacional", label: "Internacional" },
  { value: "bajo_demanda", label: "Bajo demanda / app" },
];

export const TIEMPO_RESPUESTA_TRANSPORTE = [
  { value: "inmediato_30min", label: "Inmediato (~30 min)" },
  { value: "1h", label: "Dentro de 1 hora" },
  { value: "2h", label: "1–2 horas" },
  { value: "mismo_dia", label: "Mismo día" },
  { value: "programado", label: "Programado / con cita" },
];

export const INCLUYE_PERSONAL_CARGA = [
  { value: "si", label: "Sí, incluido" },
  { value: "no", label: "No incluido" },
  { value: "opcional", label: "Opcional con costo extra" },
  { value: "convenir", label: "A convenir" },
];

export { HIDE_ADULT_LEAKS };

const COLAB_OPTS = {
  colaboracionesComerciales: COLABORACIONES_COMERCIALES_OPTIONS,
  tiposColaboracionComercial: TIPOS_COLABORACION_COMERCIAL,
};

const COMMON = {
  extraFields: [
    "diferenciadorTransporte",
    "coberturaGeografica",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: { ...COLAB_OPTS },
  textosAyuda: {
    diferenciadorTransporte: "Ej. 24 h · Seguro incluido · Flotilla propia",
    coberturaGeografica: "Colonias, municipios o rutas frecuentes.",
    colaboracionesComerciales: "¿Trabajas con e-commerce, flotillas o plataformas?",
  },
};

const A_PASAJEROS = {
  ...COMMON,
  extraFields: [
    "serviciosTransportePersonas",
    "tipoVehiculoPasajeros",
    "modalidadServicioTransporte",
    "tiposClientesTransporte",
    "tiempoRespuestaTransporte",
    "permisosLicencias",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosTransportePersonas",
    "tipoVehiculoPasajeros",
    "modalidadServicioTransporte",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadServicioTransporte: MODALIDAD_SERVICIO_TRANSPORTE.filter((o) =>
      ["local_ciudad", "metropolitana", "regional", "bajo_demanda"].includes(o.value)
    ),
    tiempoRespuestaTransporte: TIEMPO_RESPUESTA_TRANSPORTE,
    ...COLAB_OPTS,
  },
};

const B_MENSAJERIA = {
  ...COMMON,
  extraFields: [
    "serviciosMensajeria",
    "tiposEnvio",
    "tipoVehiculoMensajeria",
    "modalidadServicioTransporte",
    "tiempoRespuestaTransporte",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosMensajeria",
    "tiposEnvio",
    "modalidadServicioTransporte",
    "coberturaGeografica",
    "tiempoRespuestaTransporte",
  ],
  fieldOptions: {
    modalidadServicioTransporte: MODALIDAD_SERVICIO_TRANSPORTE.filter((o) =>
      ["local_ciudad", "metropolitana", "bajo_demanda"].includes(o.value)
    ),
    tiempoRespuestaTransporte: TIEMPO_RESPUESTA_TRANSPORTE,
    ...COLAB_OPTS,
  },
};

const C_FLETE = {
  ...COMMON,
  extraFields: [
    "serviciosFleteMudanza",
    "capacidadCarga",
    "tiposMercancia",
    "modalidadServicioTransporte",
    "incluyePersonalCarga",
    "tiempoRespuestaTransporte",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosFleteMudanza",
    "capacidadCarga",
    "modalidadServicioTransporte",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadServicioTransporte: MODALIDAD_SERVICIO_TRANSPORTE.filter((o) =>
      ["local_ciudad", "metropolitana", "regional"].includes(o.value)
    ),
    incluyePersonalCarga: INCLUYE_PERSONAL_CARGA,
    tiempoRespuestaTransporte: TIEMPO_RESPUESTA_TRANSPORTE,
    ...COLAB_OPTS,
  },
};

const D_CARGA = {
  ...COMMON,
  extraFields: [
    "serviciosLogistica",
    "tiposCarga",
    "capacidadCarga",
    "modalidadServicioTransporte",
    "coberturaRutas",
    "permisosLicencias",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosLogistica",
    "tiposCarga",
    "modalidadServicioTransporte",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadServicioTransporte: MODALIDAD_SERVICIO_TRANSPORTE.filter((o) =>
      ["local_ciudad", "metropolitana", "regional", "nacional"].includes(o.value)
    ),
    ...COLAB_OPTS,
  },
};

const E_NEGOCIO = {
  extraFields: [
    "serviciosEmpresaTransporte",
    "especialidadesEmpresaTransporte",
    "tamanoClienteTransporte",
    "flotaAproximada",
    "modalidadServicioTransporte",
    "diferenciadorTransporte",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  obligatoriosExtra: [
    "serviciosEmpresaTransporte",
    "especialidadesEmpresaTransporte",
    "flotaAproximada",
    "modalidadServicioTransporte",
  ],
  fieldOptions: {
    modalidadServicioTransporte: MODALIDAD_SERVICIO_TRANSPORTE,
    tamanoClienteTransporte: ["PyME", "Mediana", "Corporativo", "E-commerce", "Gobierno", "Otro"],
    ...COLAB_OPTS,
  },
  textosAyuda: {
    ...COMMON.textosAyuda,
    flotaAproximada: "Ej. 5–20 unidades en operación",
  },
};

const F_ESPECIAL = {
  ...COMMON,
  extraFields: [
    "serviciosEspecialidadTransporte",
    "modalidadServicioTransporte",
    "coberturaInternacional",
    "tiposVehiculoRenta",
    "capacidadCarga",
    "permisosLicencias",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: ["serviciosEspecialidadTransporte", "modalidadServicioTransporte"],
  fieldOptions: {
    modalidadServicioTransporte: MODALIDAD_SERVICIO_TRANSPORTE,
    ...COLAB_OPTS,
  },
};

export const SUB_EXTRA_PROFILES = {
  "chofer-privado": {
    ...A_PASAJEROS,
    blockTitle: "Chofer privado",
    aliasPlaceholder: "Ej. Chofer privado · CDMX y zona sur",
    fieldOptions: {
      ...A_PASAJEROS.fieldOptions,
      serviciosTransportePersonas: ["Traslados locales", "Eventos", "Aeropuerto", "Por horas", "Por día", "Otro"],
      tipoVehiculoPasajeros: ["Sedán", "SUV", "Van", "Pick-up", "Otro"],
      tiposClientesTransporte: ["Particulares", "Ejecutivos", "Familias", "Otro"],
    },
  },
  "conductor-ejecutivo": {
    ...A_PASAJEROS,
    blockTitle: "Conductor ejecutivo",
    aliasPlaceholder: "Ej. Conductor ejecutivo · Bilingüe",
    fieldOptions: {
      ...A_PASAJEROS.fieldOptions,
      serviciosTransportePersonas: ["Ejecutivo", "Corporativo", "Aeropuerto VIP", "Eventos", "Por horas", "Otro"],
      tipoVehiculoPasajeros: ["Sedán premium", "SUV premium", "Van ejecutiva", "Otro"],
      tiposClientesTransporte: ["Ejecutivos", "Corporativo", "Diplomático", "Otro"],
    },
  },
  "transporte-ejecutivo": {
    ...A_PASAJEROS,
    blockTitle: "Transporte ejecutivo",
    aliasPlaceholder: "Ej. Transporte ejecutivo · Flotilla premium",
    fieldOptions: {
      ...A_PASAJEROS.fieldOptions,
      serviciosTransportePersonas: ["Corporativo", "Eventos", "Roadshow", "Aeropuerto", "Otro"],
      tipoVehiculoPasajeros: ["Sedán", "SUV", "Van", "Sprinter", "Otro"],
      tiposClientesTransporte: ["Corporativo", "Agencias", "Eventos", "Otro"],
    },
  },
  "transporte-turistico": {
    ...A_PASAJEROS,
    blockTitle: "Transporte turístico",
    aliasPlaceholder: "Ej. Transporte turístico · Tours y traslados",
    fieldOptions: {
      ...A_PASAJEROS.fieldOptions,
      serviciosTransportePersonas: ["City tour", "Traslados hotel", "Excursiones", "Grupos", "Otro"],
      tipoVehiculoPasajeros: ["Van", "Microbús", "Sprinter", "SUV", "Otro"],
      tiposClientesTransporte: ["Turistas", "Agencias", "Hoteles", "Otro"],
    },
  },
  "transporte-escolar": {
    ...A_PASAJEROS,
    blockTitle: "Transporte escolar",
    aliasPlaceholder: "Ej. Transporte escolar · Rutas fijas",
    obligatoriosExtra: [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "permisosLicencias",
      "coberturaGeografica",
    ],
    fieldOptions: {
      ...A_PASAJEROS.fieldOptions,
      modalidadServicioTransporte: MODALIDAD_SERVICIO_TRANSPORTE.filter((o) =>
        ["local_ciudad", "metropolitana"].includes(o.value)
      ),
      serviciosTransportePersonas: ["Ruta escolar", "Transporte colegio", "Actividades", "Otro"],
      tipoVehiculoPasajeros: ["Van escolar", "Microbús", "Combis", "Otro"],
      tiposClientesTransporte: ["Colegios", "Guarderías", "Familias", "Otro"],
    },
  },
  mensajero: {
    ...B_MENSAJERIA,
    blockTitle: "Mensajero",
    aliasPlaceholder: "Ej. Mensajero · Same day CDMX",
    fieldOptions: {
      ...B_MENSAJERIA.fieldOptions,
      serviciosMensajeria: ["Documentos", "Paquetes pequeños", "Recolección", "Entrega programada", "Otro"],
      tiposEnvio: ["Urgente", "Same day", "Programado", "Sobre", "Caja pequeña", "Otro"],
      tipoVehiculoMensajeria: ["Auto", "Moto", "Bicicleta", "A pie", "Otro"],
    },
  },
  "repartidor-local": {
    ...B_MENSAJERIA,
    blockTitle: "Repartidor local",
    aliasPlaceholder: "Ej. Repartidor local · Zona norte",
    fieldOptions: {
      ...B_MENSAJERIA.fieldOptions,
      serviciosMensajeria: ["Reparto local", "Recolección", "Entrega nocturna", "Otro"],
      tiposEnvio: ["Alimentos", "Retail", "Farmacia", "Paquetería", "Otro"],
      tipoVehiculoMensajeria: ["Moto", "Auto", "Bicicleta", "Otro"],
    },
  },
  motomensajero: {
    ...B_MENSAJERIA,
    blockTitle: "Motomensajero",
    aliasPlaceholder: "Ej. Motomensajero · Tráfico urbano",
    fieldOptions: {
      ...B_MENSAJERIA.fieldOptions,
      serviciosMensajeria: ["Urgente", "Documentos", "Paquetes", "Recolección", "Otro"],
      tiposEnvio: ["Urgente", "Same day", "Sobre", "Caja pequeña", "Otro"],
      tipoVehiculoMensajeria: ["Moto", "Scooter", "Otro"],
    },
  },
  "courier-independiente": {
    ...B_MENSAJERIA,
    blockTitle: "Courier independiente",
    aliasPlaceholder: "Ej. Courier · Documentos y paquetería",
    fieldOptions: {
      ...B_MENSAJERIA.fieldOptions,
      serviciosMensajeria: ["Courier express", "Documentos legales", "Paquetería", "Otro"],
      tiposEnvio: ["Express", "Same day", "Internacional ligero", "Otro"],
      tipoVehiculoMensajeria: ["Auto", "Moto", "Van", "Otro"],
    },
  },
  "ultima-milla": {
    ...B_MENSAJERIA,
    blockTitle: "Última milla",
    aliasPlaceholder: "Ej. Última milla · E-commerce",
    fieldOptions: {
      ...B_MENSAJERIA.fieldOptions,
      serviciosMensajeria: ["Entrega e-commerce", "Recolección", "Devoluciones", "Rutas fijas", "Otro"],
      tiposEnvio: ["Paquetería", "Retail", "Alimentos", "Farmacia", "Otro"],
      tipoVehiculoMensajeria: ["Moto", "Auto", "Van", "Otro"],
      tiposClientesTransporte: ["E-commerce", "Retail", "Marketplaces", "Otro"],
    },
    extraFields: [...B_MENSAJERIA.extraFields, "tiposClientesTransporte"],
  },
  "flete-ligero": {
    ...C_FLETE,
    blockTitle: "Flete ligero",
    aliasPlaceholder: "Ej. Flete ligero · Pick-up 1.5 ton",
    fieldOptions: {
      ...C_FLETE.fieldOptions,
      serviciosFleteMudanza: ["Flete local", "Recolección", "Entrega punto a punto", "Otro"],
      tiposMercancia: ["Muebles", "Electrodomésticos", "Cajas", "Mercancía general", "Otro"],
    },
  },
  "mudanzas-pequenas": {
    ...C_FLETE,
    blockTitle: "Mudanzas pequeñas",
    blockHint: "Mudanzas de casa/depto — personal de carga y cobertura.",
    fieldOptions: {
      ...C_FLETE.fieldOptions,
      serviciosFleteMudanza: ["Mudanza depto", "Mudanza casa", "Embalaje", "Desmontaje", "Otro"],
      tiposMercancia: ["Muebles", "Electrodomésticos", "Oficina", "Otro"],
    },
  },
  mudanzas: {
    ...E_NEGOCIO,
    blockTitle: "Mudanzas",
    blockHint: "Empresa de mudanzas — flota, embalaje y cobertura.",
    extraFields: [
      "serviciosFleteMudanza",
      "capacidadCarga",
      "incluyePersonalCarga",
      "modalidadServicioTransporte",
      "flotaAproximada",
      "especialidadesEmpresaTransporte",
      "diferenciadorTransporte",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
    ],
    obligatoriosExtra: [
      "serviciosFleteMudanza",
      "flotaAproximada",
      "modalidadServicioTransporte",
      "especialidadesEmpresaTransporte",
    ],
    fieldOptions: {
      ...E_NEGOCIO.fieldOptions,
      serviciosFleteMudanza: ["Mudanza local", "Interestatal", "Embalaje", "Guardamuebles", "Otro"],
      incluyePersonalCarga: INCLUYE_PERSONAL_CARGA,
      especialidadesEmpresaTransporte: "Mudanzas residenciales, corporativas, internacionales…",
    },
  },
  "operador-de-carga": {
    ...D_CARGA,
    blockTitle: "Operador de carga",
    aliasPlaceholder: "Ej. Operador de carga · Rutas regionales",
    fieldOptions: {
      ...D_CARGA.fieldOptions,
      serviciosLogistica: ["Carga consolidada", "Rutas dedicadas", "Cross-dock", "Otro"],
      tiposCarga: ["General", "Seca", "Palletizada", "Otro"],
    },
  },
  "transporte-de-carga": {
    ...D_CARGA,
    blockTitle: "Transporte de carga",
    aliasPlaceholder: "Ej. Carga · 3.5 ton regional",
    fieldOptions: {
      ...D_CARGA.fieldOptions,
      serviciosLogistica: ["Carga completa", "Consolidada", "Rutas fijas", "Otro"],
      tiposCarga: ["General", "Seca", "Construcción", "Industrial", "Otro"],
    },
  },
  "transporte-refrigerado": {
    ...D_CARGA,
    blockTitle: "Transporte refrigerado",
    aliasPlaceholder: "Ej. Refrigerado · Cadena de frío",
    obligatoriosExtra: [
      "serviciosLogistica",
      "tiposCarga",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "permisosLicencias",
    ],
    fieldOptions: {
      ...D_CARGA.fieldOptions,
      serviciosLogistica: ["Refrigerado", "Congelado", "Cadena de frío", "Otro"],
      tiposCarga: ["Alimentos", "Farmacéutico", "Flores", "Otro"],
    },
  },
  "almacenes-y-bodegas": {
    ...D_CARGA,
    blockTitle: "Almacenes y bodegas",
    aliasPlaceholder: "Ej. Bodega · Almacenaje y cross-dock",
    fieldOptions: {
      ...D_CARGA.fieldOptions,
      serviciosLogistica: ["Almacenaje", "Cross-dock", "Inventario", "Picking", "Otro"],
      tiposCarga: ["General", "Retail", "E-commerce", "Otro"],
    },
  },
  "distribucion-de-mercancias": {
    ...D_CARGA,
    blockTitle: "Distribución de mercancías",
    aliasPlaceholder: "Ej. Distribución · Rutas B2B",
    fieldOptions: {
      ...D_CARGA.fieldOptions,
      serviciosLogistica: ["Distribución local", "Rutas fijas", "Entrega programada", "Otro"],
      tiposCarga: ["Retail", "Industrial", "Consumo", "Otro"],
    },
  },
  "logistica-local": {
    ...D_CARGA,
    blockTitle: "Logística local",
    aliasPlaceholder: "Ej. Logística local · Última milla B2B",
    fieldOptions: {
      ...D_CARGA.fieldOptions,
      serviciosLogistica: ["Distribución", "Almacenaje", "Fulfillment", "Rutas dedicadas", "Otro"],
      tiposCarga: ["E-commerce", "Retail", "Industrial", "Otro"],
      tamanoClienteTransporte: ["PyME", "Mediana", "Corporativo", "E-commerce", "Otro"],
    },
    extraFields: [...D_CARGA.extraFields, "tamanoClienteTransporte"],
  },
  "empresa-de-mensajeria": {
    ...E_NEGOCIO,
    blockTitle: "Empresa de mensajería",
    fieldOptions: {
      ...E_NEGOCIO.fieldOptions,
      serviciosEmpresaTransporte: ["Mensajería local", "Same day", "Recolección", "Rastreo", "Otro"],
      especialidadesEmpresaTransporte: "Mensajería corporativa, legal, e-commerce…",
    },
  },
  "empresa-de-paqueteria": {
    ...E_NEGOCIO,
    blockTitle: "Empresa de paquetería",
    fieldOptions: {
      ...E_NEGOCIO.fieldOptions,
      serviciosEmpresaTransporte: ["Paquetería local", "Nacional", "Recolección", "Entrega programada", "Otro"],
      especialidadesEmpresaTransporte: "Paquetería B2B, e-commerce, frágil…",
    },
  },
  "empresa-de-logistica": {
    ...E_NEGOCIO,
    blockTitle: "Empresa de logística",
    fieldOptions: {
      ...E_NEGOCIO.fieldOptions,
      serviciosEmpresaTransporte: ["3PL", "Distribución", "Almacenaje", "Fulfillment", "Otro"],
      especialidadesEmpresaTransporte: "Logística integrada, cadena de suministro…",
    },
  },
  "logistica-internacional": {
    ...F_ESPECIAL,
    blockTitle: "Logística internacional",
    aliasPlaceholder: "Ej. Logística internacional · Aduanas USA",
    obligatoriosExtra: [
      "serviciosEspecialidadTransporte",
      "modalidadServicioTransporte",
      "coberturaInternacional",
      "permisosLicencias",
      "coberturaGeografica",
    ],
    fieldOptions: {
      ...F_ESPECIAL.fieldOptions,
      modalidadServicioTransporte: MODALIDAD_SERVICIO_TRANSPORTE.filter((o) =>
        ["regional", "nacional", "internacional"].includes(o.value)
      ),
      serviciosEspecialidadTransporte: ["Importación", "Exportación", "Aduanas", "Consolidado", "Otro"],
    },
  },
  "renta-de-camionetas": {
    ...E_NEGOCIO,
    blockTitle: "Renta de camionetas",
    blockHint: "Flota en renta — tipos de unidad y modalidad.",
    extraFields: [
      "tiposVehiculoRenta",
      "serviciosEspecialidadTransporte",
      "modalidadServicioTransporte",
      "flotaAproximada",
      "diferenciadorTransporte",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
    ],
    obligatoriosExtra: [
      "tiposVehiculoRenta",
      "serviciosEspecialidadTransporte",
      "flotaAproximada",
      "modalidadServicioTransporte",
    ],
    fieldOptions: {
      ...E_NEGOCIO.fieldOptions,
      tiposVehiculoRenta: ["Pick-up", "Van", "Camioneta 3.5 ton", "Caja seca", "Refrigerada", "Otro"],
      serviciosEspecialidadTransporte: ["Renta con chofer", "Renta sin chofer", "Por día", "Por mes", "Otro"],
    },
  },
};

for (const subId of Object.keys(SUB_EXTRA_PROFILES)) {
  SUB_EXTRA_PROFILES[subId] = mergeEnrichmentV2(SUB_EXTRA_PROFILES[subId], subId);
  const p = SUB_EXTRA_PROFILES[subId];
  p.hideFields = mergeHideAdultLeaks(p.hideFields || []);
  const negocioOnly = new Set([
    "mudanzas",
    "empresa-de-mensajeria",
    "empresa-de-paqueteria",
    "empresa-de-logistica",
    "renta-de-camionetas",
  ]);
  if (!negocioOnly.has(subId)) {
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
