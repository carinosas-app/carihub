/**
 * MP-HOGAR-DELTAS-V1 — campos extra, ocultos y opciones por subcategoría (17 subs).
 */
import {
  mergeHideAdultLeaks,
  HIDE_ADULT_LEAKS,
  COLABORACIONES_COMERCIALES_OPTIONS,
  TIPOS_COLABORACION_COMERCIAL,
} from "./registro-cross-sector-policy.mjs";
import { mergeEnrichmentV2 } from "./hogar-sub-enrichment-v2.mjs";

export const MODALIDAD_SERVICIO_HOGAR = [
  { value: "domicilio", label: "Servicio a domicilio" },
  { value: "taller", label: "Taller / bodega propia" },
  { value: "ambos", label: "Domicilio y taller" },
  { value: "emergencia_24h", label: "Emergencias / 24 horas" },
];

export const TIEMPO_RESPUESTA_HOGAR = [
  { value: "emergencia_2h", label: "Emergencia (~2 h)" },
  { value: "mismo_dia", label: "Mismo día" },
  { value: "24_48h", label: "24–48 horas" },
  { value: "por_cita", label: "Con cita programada" },
];

export const ANOS_EXPERIENCIA_HOGAR = [
  { value: "1_3", label: "1–3 años" },
  { value: "4_7", label: "4–7 años" },
  { value: "8_15", label: "8–15 años" },
  { value: "16_mas", label: "16+ años" },
];

export const MATERIALES_INCLUIDOS = [
  { value: "solo_mano_obra", label: "Solo mano de obra" },
  { value: "con_materiales", label: "Mano de obra + materiales" },
  { value: "mixto", label: "Depende del trabajo" },
  { value: "convenir", label: "A convenir por proyecto" },
];

export { HIDE_ADULT_LEAKS };

const COLAB_OPTS = {
  colaboracionesComerciales: COLABORACIONES_COMERCIALES_OPTIONS,
  tiposColaboracionComercial: TIPOS_COLABORACION_COMERCIAL,
};

const COMMON = {
  extraFields: [
    "diferenciadorHogar",
    "coberturaGeografica",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: { ...COLAB_OPTS },
  textosAyuda: {
    diferenciadorHogar: "Ej. Urgencias 24 h · Presupuesto gratis · Garantía por escrito",
    coberturaGeografica: "Colonias o municipios donde atiendes.",
    colaboracionesComerciales: "¿Trabajas con arquitectos, contratistas u otros oficios?",
  },
};

const BASE_HOGAR = {
  ...COMMON,
  extraFields: [
    "serviciosHogar",
    "especialidadesHogar",
    "modalidadServicioHogar",
    "tiposInmueble",
    "tiempoRespuestaHogar",
    "garantiaServicioHogar",
    "materialesIncluidos",
    "anosExperienciaHogar",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosHogar",
    "modalidadServicioHogar",
    "coberturaGeografica",
    "tiempoRespuestaHogar",
  ],
  fieldOptions: {
    modalidadServicioHogar: MODALIDAD_SERVICIO_HOGAR,
    tiempoRespuestaHogar: TIEMPO_RESPUESTA_HOGAR,
    anosExperienciaHogar: ANOS_EXPERIENCIA_HOGAR,
    materialesIncluidos: MATERIALES_INCLUIDOS,
    tiposInmueble: ["Casa", "Departamento", "Local comercial", "Condominio", "Oficina", "Otro"],
    ...COLAB_OPTS,
  },
};

/** Perfil por subcategoriaId */
export const SUB_EXTRA_PROFILES = {
  plomeros: {
    ...BASE_HOGAR,
    blockTitle: "Plomeros",
    aliasPlaceholder: "Ej. Plomero · Urgencias CDMX sur",
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: [
        "Fugas",
        "Instalación",
        "Destape",
        "Calentador",
        "Regaderas",
        "Mantenimiento",
        "Otro",
      ],
      especialidadesHogar: ["Residencial", "Comercial", "Urgencias", "Otro"],
      modalidadServicioHogar: MODALIDAD_SERVICIO_HOGAR.filter((o) =>
        ["domicilio", "emergencia_24h", "ambos"].includes(o.value)
      ),
    },
  },
  albaniles: {
    ...BASE_HOGAR,
    blockTitle: "Albañiles",
    aliasPlaceholder: "Ej. Albañil · Obra menor y remodelación",
    extraFields: [...BASE_HOGAR.extraFields, "tiposTrabajoHogar"],
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Obra menor", "Remodelación", "Ampliación", "Reparación", "Otro"],
      tiposTrabajoHogar: ["Muros", "Losas", "Aplanados", "Demolición", "Otro"],
    },
  },
  impermeabilizadores: {
    ...BASE_HOGAR,
    blockTitle: "Impermeabilizadores",
    aliasPlaceholder: "Ej. Impermeabilización · Techos y losas",
    obligatoriosExtra: [
      ...BASE_HOGAR.obligatoriosExtra,
      "garantiaServicioHogar",
      "materialesIncluidos",
    ],
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Techos", "Losas", "Muros", "Terrazas", "Mantenimiento", "Otro"],
      especialidadesHogar: ["Prefabricado", "Asfáltico", "Membrana", "Otro"],
    },
  },
  electricistas: {
    ...BASE_HOGAR,
    blockTitle: "Electricistas",
    aliasPlaceholder: "Ej. Electricista · Instalaciones residenciales",
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: [
        "Instalación",
        "Reparación",
        "Tablero",
        "Iluminación",
        "Contactos",
        "Urgencias",
        "Otro",
      ],
      especialidadesHogar: ["Residencial", "Comercial", "Industrial ligero", "Otro"],
    },
  },
  "tecnicos-en-clima-hvac": {
    ...BASE_HOGAR,
    blockTitle: "Técnicos en clima / HVAC",
    aliasPlaceholder: "Ej. A/C y calefacción · Instalación y servicio",
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Instalación", "Mantenimiento", "Reparación", "Carga de gas", "Limpieza", "Otro"],
      especialidadesHogar: ["Mini split", "Central", "Calefacción", "Comercial", "Otro"],
    },
  },
  "instaladores-de-paneles-solares": {
    ...BASE_HOGAR,
    blockTitle: "Instaladores de paneles solares",
    aliasPlaceholder: "Ej. Solar residencial · Interconexión CFE",
    extraFields: [...BASE_HOGAR.extraFields, "tiposTrabajoHogar"],
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Instalación", "Mantenimiento", "Diagnóstico", "Ampliación", "Otro"],
      tiposTrabajoHogar: ["Residencial", "Comercial", "Interconexión", "Off-grid", "Otro"],
    },
  },
  "tecnicos-en-camaras-de-seguridad": {
    ...BASE_HOGAR,
    blockTitle: "Técnicos en cámaras de seguridad",
    aliasPlaceholder: "Ej. CCTV · Instalación y monitoreo",
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Instalación", "Configuración", "Mantenimiento", "Ampliación", "Otro"],
      especialidadesHogar: ["IP", "Analógico", "NVR/DVR", "Acceso remoto", "Otro"],
    },
  },
  "domotica-casa-inteligente": {
    ...BASE_HOGAR,
    blockTitle: "Domótica / casa inteligente",
    aliasPlaceholder: "Ej. Casa inteligente · Alexa y Google Home",
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Automatización", "Iluminación", "Cerraduras", "Integración", "Capacitación", "Otro"],
      especialidadesHogar: ["Alexa", "Google Home", "Apple HomeKit", "KNX", "Otro"],
    },
  },
  carpinteros: {
    ...BASE_HOGAR,
    blockTitle: "Carpinteros",
    aliasPlaceholder: "Ej. Carpintero · Muebles a medida",
    extraFields: [...BASE_HOGAR.extraFields, "tiposTrabajoHogar"],
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Muebles a medida", "Closets", "Reparación", "Puertas", "Otro"],
      tiposTrabajoHogar: ["Madera", "MDF", "Triplay", "Exterior", "Otro"],
    },
  },
  herreros: {
    ...BASE_HOGAR,
    blockTitle: "Herreros",
    aliasPlaceholder: "Ej. Herrero · Rejas y portones",
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Rejas", "Portones", "Estructuras", "Soldadura", "Reparación", "Otro"],
      especialidadesHogar: ["Residencial", "Comercial", "Industrial ligero", "Otro"],
    },
  },
  "instaladores-de-pisos": {
    ...BASE_HOGAR,
    blockTitle: "Instaladores de pisos",
    aliasPlaceholder: "Ej. Instalador de pisos · Cerámica y vinílico",
    extraFields: [...BASE_HOGAR.extraFields, "tiposTrabajoHogar"],
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Instalación", "Nivelación", "Remoción", "Mantenimiento", "Otro"],
      tiposTrabajoHogar: ["Cerámica", "Porcelanato", "Madera", "Vinílico", "Epóxico", "Otro"],
    },
  },
  cerrajeros: {
    ...BASE_HOGAR,
    blockTitle: "Cerrajeros",
    aliasPlaceholder: "Ej. Cerrajero · Urgencias 24 h",
    obligatoriosExtra: [...BASE_HOGAR.obligatoriosExtra, "tiempoRespuestaHogar"],
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      modalidadServicioHogar: MODALIDAD_SERVICIO_HOGAR.filter((o) =>
        ["domicilio", "emergencia_24h"].includes(o.value)
      ),
      serviciosHogar: ["Apertura", "Cambio de chapa", "Copiado de llaves", "Cerraduras", "Otro"],
      tiempoRespuestaHogar: TIEMPO_RESPUESTA_HOGAR,
    },
  },
  pintores: {
    ...BASE_HOGAR,
    blockTitle: "Pintores",
    aliasPlaceholder: "Ej. Pintor · Interiores y exteriores",
    extraFields: [...BASE_HOGAR.extraFields, "tiposTrabajoHogar"],
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Interiores", "Exteriores", "Estuco", "Impermeabilizante", "Otro"],
      tiposTrabajoHogar: ["Habitaciones", "Fachada", "Comercial", "Otro"],
    },
  },
  jardineria: {
    ...BASE_HOGAR,
    blockTitle: "Jardinería",
    aliasPlaceholder: "Ej. Jardinería · Mantenimiento semanal",
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Mantenimiento", "Diseño", "Poda", "Sistema de riego", "Fumigación jardín", "Otro"],
      especialidadesHogar: ["Residencial", "Comercial", "Roof garden", "Otro"],
    },
  },
  fumigacion: {
    ...BASE_HOGAR,
    blockTitle: "Fumigación",
    aliasPlaceholder: "Ej. Fumigación · Plagas y control",
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Fumigación", "Desinfección", "Control de roedores", "Mantenimiento", "Otro"],
      especialidadesHogar: ["Cucarachas", "Hormigas", "Roedores", "Termitas", "Otro"],
    },
  },
  "limpieza-del-hogar": {
    ...BASE_HOGAR,
    blockTitle: "Limpieza del hogar",
    aliasPlaceholder: "Ej. Limpieza profunda · Por hora o por visita",
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: ["Limpieza regular", "Profunda", "Post-obra", "Por evento", "Otro"],
      materialesIncluidos: MATERIALES_INCLUIDOS.filter((o) => o.value !== "con_materiales"),
    },
  },
  "mantenimiento-general": {
    ...BASE_HOGAR,
    blockTitle: "Mantenimiento general",
    aliasPlaceholder: "Ej. Mantenimiento general · Multi-oficio",
    fieldOptions: {
      ...BASE_HOGAR.fieldOptions,
      serviciosHogar: [
        "Reparaciones menores",
        "Plomería básica",
        "Electricidad básica",
        "Pintura touch-up",
        "Visitas programadas",
        "Otro",
      ],
      especialidadesHogar: ["Residencial", "Condominios", "Comercial", "Otro"],
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
}
