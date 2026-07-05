/**
 * MP-BIENES-RAICES-DELTAS-V1 — campos extra, ocultos y opciones por subcategoría (27 subs).
 */
import {
  mergeHideAdultLeaks,
  HIDE_ADULT_LEAKS,
  COLABORACIONES_COMERCIALES_OPTIONS,
  TIPOS_COLABORACION_COMERCIAL,
} from "./registro-cross-sector-policy.mjs";
import { mergeEnrichmentV2 } from "./bienes-raices-sub-enrichment-v2.mjs";
import { PACK_NEGOCIO_SUBS } from "./bienes-raices-packs-v1.mjs";

export const MODALIDAD_OPERACION_INMOBILIARIA = [
  { value: "venta", label: "Venta" },
  { value: "renta", label: "Renta" },
  { value: "venta_y_renta", label: "Venta y renta" },
  { value: "desarrollo", label: "Desarrollo inmobiliario" },
  { value: "administracion", label: "Administración de propiedades" },
  { value: "temporal", label: "Renta temporal / vacacional" },
];

export const OPERACION_INMOBILIARIA = [
  { value: "venta", label: "Venta" },
  { value: "renta", label: "Renta" },
  { value: "temporal", label: "Renta temporal" },
  { value: "coworking", label: "Coworking / oficinas flexibles" },
];

export const TIEMPO_RESPUESTA_INMOBILIARIA = [
  { value: "inmediato", label: "Inmediato" },
  { value: "mismo_dia", label: "Mismo día" },
  { value: "24_48h", label: "24–48 horas" },
  { value: "por_cita", label: "Con cita programada" },
];

export const TIPOS_INMUEBLE = ["Casa", "Departamento", "Terreno", "Local comercial", "Bodega", "Oficina", "Industrial", "Otro"];

export const AMENIDADES_INMUEBLE = [
  "Estacionamiento",
  "Seguridad",
  "Alberca",
  "Gym",
  "Pet friendly",
  "Roof garden",
  "Elevador",
  "Otro",
];

export { HIDE_ADULT_LEAKS };

const COLAB_OPTS = {
  colaboracionesComerciales: COLABORACIONES_COMERCIALES_OPTIONS,
  tiposColaboracionComercial: TIPOS_COLABORACION_COMERCIAL,
};

const COMMON = {
  extraFields: [
    "diferenciadorInmobiliario",
    "coberturaGeografica",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: { ...COLAB_OPTS },
  textosAyuda: {
    diferenciadorInmobiliario: "Ej. AMPI · Trato directo · Sin comisión oculta",
    coberturaGeografica: "Colonias o municipios donde operas.",
    colaboracionesComerciales: "¿Colaboras con notarías, bancos o desarrolladoras?",
  },
};

const BASE_PERSONA = {
  ...COMMON,
  extraFields: [
    "serviciosInmobiliarios",
    "tiposInmuebleInmobiliario",
    "modalidadOperacionInmobiliaria",
    "especialidadesInmobiliarias",
    "tiempoRespuestaInmobiliaria",
    "rangoPrecioInmobiliario",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosInmobiliarios",
    "tiposInmuebleInmobiliario",
    "modalidadOperacionInmobiliaria",
    "coberturaGeografica",
    "tiempoRespuestaInmobiliaria",
  ],
  fieldOptions: {
    modalidadOperacionInmobiliaria: MODALIDAD_OPERACION_INMOBILIARIA,
    tiempoRespuestaInmobiliaria: TIEMPO_RESPUESTA_INMOBILIARIA,
    tiposInmuebleInmobiliario: TIPOS_INMUEBLE,
    especialidadesInmobiliarias: ["Residencial", "Comercial", "Industrial", "Lujo", "Temporal", "Otro"],
    ...COLAB_OPTS,
  },
};

const BASE_NEGOCIO = {
  ...COMMON,
  extraFields: [
    "serviciosEmpresaInmobiliaria",
    "especialidadesEmpresaInmobiliaria",
    "tiposInmuebleInmobiliario",
    "modalidadOperacionInmobiliaria",
    "operacionInmobiliaria",
    "rangoPrecioInmobiliario",
    "amenidadesInmueble",
    "caracteristicasInmueble",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "nombreComercial",
    "serviciosEmpresaInmobiliaria",
    "tiposInmuebleInmobiliario",
    "direccion",
    "horarioDetalle",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadOperacionInmobiliaria: MODALIDAD_OPERACION_INMOBILIARIA,
    operacionInmobiliaria: OPERACION_INMOBILIARIA,
    tiposInmuebleInmobiliario: TIPOS_INMUEBLE,
    amenidadesInmueble: AMENIDADES_INMUEBLE,
    ...COLAB_OPTS,
  },
};

const SERVICIOS_ASESOR = [
  "Captación",
  "Promoción",
  "Visitas guiadas",
  "Negociación",
  "Trámite notarial",
  "Asesoría hipotecaria",
  "Otro",
];

/** Perfil por subcategoriaId */
export const SUB_EXTRA_PROFILES = {
  "agente-inmobiliario-independiente": {
    ...BASE_PERSONA,
    blockTitle: "Agente inmobiliario independiente",
    aliasPlaceholder: "Ej. Agente · Zona Polanco y Condesa",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosInmobiliarios: SERVICIOS_ASESOR,
    },
  },
  "asesor-inmobiliario": {
    ...BASE_PERSONA,
    blockTitle: "Asesor inmobiliario",
    aliasPlaceholder: "Ej. Asesor · Compra y venta residencial",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosInmobiliarios: ["Asesoría compra", "Asesoría venta", "Inversión", "Due diligence", "Otro"],
    },
  },
  "corredor-inmobiliario": {
    ...BASE_PERSONA,
    blockTitle: "Corredor inmobiliario",
    aliasPlaceholder: "Ej. Corredor · Venta y renta",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosInmobiliarios: SERVICIOS_ASESOR,
      modalidadOperacionInmobiliaria: MODALIDAD_OPERACION_INMOBILIARIA.filter((o) =>
        ["venta", "renta", "venta_y_renta"].includes(o.value)
      ),
    },
  },
  "promotor-de-propiedades": {
    ...BASE_PERSONA,
    blockTitle: "Promotor de propiedades",
    aliasPlaceholder: "Ej. Promotor · Desarrollos y preventa",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosInmobiliarios: ["Preventa", "Promoción", "Eventos", "Material de venta", "Otro"],
      modalidadOperacionInmobiliaria: MODALIDAD_OPERACION_INMOBILIARIA.filter((o) =>
        ["venta", "desarrollo"].includes(o.value)
      ),
    },
  },
  "administrador-de-propiedades": {
    ...BASE_PERSONA,
    blockTitle: "Administrador de propiedades",
    aliasPlaceholder: "Ej. Administrador · Condominios y rentas",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosInmobiliarios: [
        "Cobranza",
        "Mantenimiento",
        "Contratos",
        "Reportes",
        "Atención inquilinos",
        "Otro",
      ],
      modalidadOperacionInmobiliaria: MODALIDAD_OPERACION_INMOBILIARIA.filter((o) =>
        ["administracion", "renta"].includes(o.value)
      ),
    },
  },
  "valuador-inmobiliario": {
    ...BASE_PERSONA,
    blockTitle: "Valuador inmobiliario",
    aliasPlaceholder: "Ej. Valuador · Avalúos certificados",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosInmobiliarios: [
        "Avalúo comercial",
        "Avalúo bancario",
        "Avalúo judicial",
        "Estudio de mercado",
        "Otro",
      ],
      modalidadOperacionInmobiliaria: MODALIDAD_OPERACION_INMOBILIARIA.filter((o) =>
        ["venta", "renta", "administracion"].includes(o.value)
      ),
    },
  },
  "rentas-vacacionales-independiente": {
    ...BASE_PERSONA,
    blockTitle: "Rentas vacacionales independiente",
    aliasPlaceholder: "Ej. Renta vacacional · Airbnb / estancia corta",
    extraFields: [...BASE_PERSONA.extraFields, "amenidadesInmueble", "caracteristicasInmueble"],
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosInmobiliarios: ["Check-in", "Limpieza", "Gestión reservas", "Concierge", "Otro"],
      modalidadOperacionInmobiliaria: MODALIDAD_OPERACION_INMOBILIARIA.filter((o) => o.value === "temporal"),
      amenidadesInmueble: AMENIDADES_INMUEBLE,
      tiposInmuebleInmobiliario: ["Casa", "Departamento", "Otro"],
    },
  },
  "rentas-temporales-independiente": {
    ...BASE_PERSONA,
    blockTitle: "Rentas temporales independiente",
    aliasPlaceholder: "Ej. Renta temporal · Estancia semanal o mensual",
    extraFields: [...BASE_PERSONA.extraFields, "caracteristicasInmueble"],
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosInmobiliarios: ["Estancia corta", "Amueblado", "Servicios incluidos", "Contrato temporal", "Otro"],
      modalidadOperacionInmobiliaria: MODALIDAD_OPERACION_INMOBILIARIA.filter((o) =>
        ["temporal", "renta"].includes(o.value)
      ),
    },
  },
  inmobiliaria: {
    ...BASE_NEGOCIO,
    blockTitle: "Inmobiliaria",
    aliasPlaceholder: "Ej. Inmobiliaria · Venta y renta",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaInmobiliaria: [
        "Venta",
        "Renta",
        "Administración",
        "Valuación",
        "Desarrollo",
        "Otro",
      ],
    },
  },
  "agencia-de-bienes-raices": {
    ...BASE_NEGOCIO,
    blockTitle: "Agencia de bienes raíces",
    aliasPlaceholder: "Ej. Agencia · Residencial y comercial",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaInmobiliaria: SERVICIOS_ASESOR.concat(["Cartera propiedades", "Otro"]),
    },
  },
  "desarrolladora-inmobiliaria": {
    ...BASE_NEGOCIO,
    blockTitle: "Desarrolladora inmobiliaria",
    aliasPlaceholder: "Ej. Desarrolladora · Proyectos verticales",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaInmobiliaria: ["Preventa", "Desarrollo", "Entrega", "Postventa", "Otro"],
      modalidadOperacionInmobiliaria: MODALIDAD_OPERACION_INMOBILIARIA.filter((o) =>
        ["venta", "desarrollo"].includes(o.value)
      ),
    },
  },
  constructora: {
    ...BASE_NEGOCIO,
    blockTitle: "Constructora",
    aliasPlaceholder: "Ej. Constructora · Obra y desarrollo",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaInmobiliaria: [
        "Construcción",
        "Remodelación",
        "Obra civil",
        "Proyecto llave en mano",
        "Otro",
      ],
      tiposInmuebleInmobiliario: ["Casa", "Departamento", "Industrial", "Comercial", "Otro"],
    },
  },
  "administracion-de-condominios": {
    ...BASE_NEGOCIO,
    blockTitle: "Administración de condominios",
    aliasPlaceholder: "Ej. Admin condominios · Mantenimiento y cobranza",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaInmobiliaria: [
        "Cobranza",
        "Mantenimiento",
        "Seguridad",
        "Contabilidad",
        "Asambleas",
        "Otro",
      ],
      modalidadOperacionInmobiliaria: MODALIDAD_OPERACION_INMOBILIARIA.filter((o) => o.value === "administracion"),
      tiposInmuebleInmobiliario: ["Departamento", "Casa", "Condominio", "Otro"],
    },
  },
  "venta-de-casas": {
    ...BASE_NEGOCIO,
    blockTitle: "Venta de casas",
    aliasPlaceholder: "Ej. Casas en venta · Zona residencial",
    obligatoriosExtra: [...BASE_NEGOCIO.obligatoriosExtra, "caracteristicasInmueble", "rangoPrecioInmobiliario"],
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "venta"),
      tiposInmuebleInmobiliario: ["Casa"],
      serviciosEmpresaInmobiliaria: ["Venta", "Visitas", "Trámite", "Crédito", "Otro"],
    },
  },
  "renta-de-casas": {
    ...BASE_NEGOCIO,
    blockTitle: "Renta de casas",
    aliasPlaceholder: "Ej. Casas en renta · Familias y corporativo",
    obligatoriosExtra: [...BASE_NEGOCIO.obligatoriosExtra, "rangoPrecioInmobiliario"],
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "renta"),
      tiposInmuebleInmobiliario: ["Casa"],
      serviciosEmpresaInmobiliaria: ["Renta", "Contratos", "Mantenimiento", "Otro"],
    },
  },
  "venta-de-departamentos": {
    ...BASE_NEGOCIO,
    blockTitle: "Venta de departamentos",
    aliasPlaceholder: "Ej. Departamentos en venta · Nuevos y reventa",
    obligatoriosExtra: [...BASE_NEGOCIO.obligatoriosExtra, "caracteristicasInmueble", "amenidadesInmueble"],
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "venta"),
      tiposInmuebleInmobiliario: ["Departamento"],
    },
  },
  "renta-de-departamentos": {
    ...BASE_NEGOCIO,
    blockTitle: "Renta de departamentos",
    aliasPlaceholder: "Ej. Departamentos en renta · Amueblado y vacío",
    obligatoriosExtra: [...BASE_NEGOCIO.obligatoriosExtra, "rangoPrecioInmobiliario"],
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "renta"),
      tiposInmuebleInmobiliario: ["Departamento"],
    },
  },
  "venta-de-terrenos": {
    ...BASE_NEGOCIO,
    blockTitle: "Venta de terrenos",
    aliasPlaceholder: "Ej. Terrenos · Habitacional y comercial",
    obligatoriosExtra: [...BASE_NEGOCIO.obligatoriosExtra, "caracteristicasInmueble"],
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "venta"),
      tiposInmuebleInmobiliario: ["Terreno"],
    },
  },
  "venta-de-locales-comerciales": {
    ...BASE_NEGOCIO,
    blockTitle: "Venta de locales comerciales",
    aliasPlaceholder: "Ej. Locales comerciales · Venta",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "venta"),
      tiposInmuebleInmobiliario: ["Local comercial"],
    },
  },
  "renta-de-locales-comerciales": {
    ...BASE_NEGOCIO,
    blockTitle: "Renta de locales comerciales",
    aliasPlaceholder: "Ej. Locales en renta · Plazas y a pie de calle",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "renta"),
      tiposInmuebleInmobiliario: ["Local comercial"],
    },
  },
  "venta-de-bodegas": {
    ...BASE_NEGOCIO,
    blockTitle: "Venta de bodegas",
    aliasPlaceholder: "Ej. Bodegas industriales · Venta",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "venta"),
      tiposInmuebleInmobiliario: ["Bodega", "Industrial"],
    },
  },
  "renta-de-bodegas": {
    ...BASE_NEGOCIO,
    blockTitle: "Renta de bodegas",
    aliasPlaceholder: "Ej. Bodegas en renta · Logística",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "renta"),
      tiposInmuebleInmobiliario: ["Bodega", "Industrial"],
    },
  },
  "venta-de-oficinas": {
    ...BASE_NEGOCIO,
    blockTitle: "Venta de oficinas",
    aliasPlaceholder: "Ej. Oficinas en venta · Corporativo",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "venta"),
      tiposInmuebleInmobiliario: ["Oficina"],
    },
  },
  "renta-de-oficinas": {
    ...BASE_NEGOCIO,
    blockTitle: "Renta de oficinas",
    aliasPlaceholder: "Ej. Oficinas en renta · Torre y piso completo",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "renta"),
      tiposInmuebleInmobiliario: ["Oficina"],
    },
  },
  "renta-vacacional": {
    ...BASE_NEGOCIO,
    blockTitle: "Renta vacacional",
    aliasPlaceholder: "Ej. Renta vacacional · Estancia corta",
    obligatoriosExtra: [...BASE_NEGOCIO.obligatoriosExtra, "caracteristicasInmueble", "amenidadesInmueble"],
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "temporal"),
      tiposInmuebleInmobiliario: ["Casa", "Departamento"],
      serviciosEmpresaInmobiliaria: ["Reservas", "Limpieza", "Check-in", "Concierge", "Otro"],
    },
  },
  coworking: {
    ...BASE_NEGOCIO,
    blockTitle: "Coworking",
    aliasPlaceholder: "Ej. Coworking · Oficinas flexibles",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) => o.value === "coworking"),
      tiposInmuebleInmobiliario: ["Oficina"],
      serviciosEmpresaInmobiliaria: [
        "Hot desk",
        "Oficina privada",
        "Sala de juntas",
        "Internet",
        "Cafetería",
        "Otro",
      ],
      amenidadesInmueble: ["Internet", "Impresión", "Sala juntas", "Recepción", "Estacionamiento", "Otro"],
    },
  },
  "centros-de-negocios-y-oficinas": {
    ...BASE_NEGOCIO,
    blockTitle: "Centros de negocios y oficinas",
    aliasPlaceholder: "Ej. Centro de negocios · Oficinas equipadas",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      operacionInmobiliaria: OPERACION_INMOBILIARIA.filter((o) =>
        ["renta", "coworking"].includes(o.value)
      ),
      tiposInmuebleInmobiliario: ["Oficina"],
      serviciosEmpresaInmobiliaria: [
        "Oficina amueblada",
        "Virtual office",
        "Sala juntas",
        "Recepcionista",
        "Otro",
      ],
    },
  },
};

for (const subId of Object.keys(SUB_EXTRA_PROFILES)) {
  SUB_EXTRA_PROFILES[subId] = mergeEnrichmentV2(SUB_EXTRA_PROFILES[subId], subId);
  const p = SUB_EXTRA_PROFILES[subId];
  p.hideFields = mergeHideAdultLeaks(p.hideFields || []);
  p.extraFields = [...new Set([...(p.extraFields || []), "colaboracionesComerciales"])];
  p.fieldOptions = p.fieldOptions || {};
  if (!p.fieldOptions.colaboracionesComerciales) {
    p.fieldOptions.colaboracionesComerciales = COLABORACIONES_COMERCIALES_OPTIONS;
  }
  if (!p.fieldOptions.tiposColaboracionComercial) {
    p.fieldOptions.tiposColaboracionComercial = TIPOS_COLABORACION_COMERCIAL;
  }
  p.negocioLocal = PACK_NEGOCIO_SUBS.has(subId);
}
