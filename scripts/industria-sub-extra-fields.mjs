/**
 * MP-INDUSTRIA-DELTAS-V1 — campos extra, ocultos y opciones por subcategoría (33 subs).
 */
import {
  mergeHideAdultLeaks,
  HIDE_ADULT_LEAKS,
  COLABORACIONES_COMERCIALES_OPTIONS,
  TIPOS_COLABORACION_COMERCIAL,
} from "./registro-cross-sector-policy.mjs";
import { mergeEnrichmentV2 } from "./industria-sub-enrichment-v2.mjs";
import { PACK_PROFESIONISTA_SUBS, PACK_NEGOCIO_SUBS } from "./industria-packs-v1.mjs";

export const MODALIDAD_SERVICIO_INDUSTRIAL = [
  { value: "planta", label: "En planta / parque industrial" },
  { value: "sitio_cliente", label: "En sitio del cliente" },
  { value: "remoto", label: "Remoto / consultoría" },
  { value: "mixto", label: "Mixto presencial y remoto" },
  { value: "instalaciones", label: "Instalaciones propias" },
];

export const TIEMPO_RESPUESTA_INDUSTRIAL = [
  { value: "inmediato", label: "Inmediato / urgencias" },
  { value: "mismo_dia", label: "Mismo día" },
  { value: "24_48h", label: "24–48 horas" },
  { value: "por_cita", label: "Con cita programada" },
];

export const SECTORES_INDUSTRIALES = [
  "Automotriz",
  "Alimentos",
  "Metalmecánica",
  "Plásticos",
  "Electrónica",
  "Química",
  "Textil",
  "Logística",
  "Construcción",
  "Otro",
];

export const CERTIFICACIONES_INDUSTRIALES = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "IATF 16949",
  "NOM-030",
  "NOM-035",
  "Otro",
];

export { HIDE_ADULT_LEAKS };

const COLAB_OPTS = {
  colaboracionesComerciales: COLABORACIONES_COMERCIALES_OPTIONS,
  tiposColaboracionComercial: TIPOS_COLABORACION_COMERCIAL,
};

const COMMON = {
  extraFields: [
    "diferenciadorIndustrial",
    "coberturaGeografica",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: { ...COLAB_OPTS },
  textosAyuda: {
    diferenciadorIndustrial: "Ej. ISO certificado · Planta propia · Turno 24 h",
    coberturaGeografica: "Parques industriales, ciudades o alcance nacional.",
    colaboracionesComerciales: "¿Colaboras con plantas, maquiladoras o integradores?",
  },
};

const BASE_PERSONA = {
  ...COMMON,
  extraFields: [
    "serviciosIndustriales",
    "sectoresIndustriales",
    "modalidadServicioIndustrial",
    "certificacionesIndustriales",
    "tiempoRespuestaIndustrial",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosIndustriales",
    "sectoresIndustriales",
    "modalidadServicioIndustrial",
    "coberturaGeografica",
    "tiempoRespuestaIndustrial",
  ],
  fieldOptions: {
    modalidadServicioIndustrial: MODALIDAD_SERVICIO_INDUSTRIAL,
    tiempoRespuestaIndustrial: TIEMPO_RESPUESTA_INDUSTRIAL,
    sectoresIndustriales: SECTORES_INDUSTRIALES,
    certificacionesIndustriales: CERTIFICACIONES_INDUSTRIALES,
    ...COLAB_OPTS,
  },
};

const BASE_PROF = {
  ...COMMON,
  extraFields: [
    "serviciosProfesionalesIndustrial",
    "especialidadIndustrial",
    "sectoresIndustriales",
    "modalidadServicioIndustrial",
    "certificacionesIndustriales",
    "procesosIndustriales",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "nombreProfesional",
    "especialidadIndustrial",
    "serviciosProfesionalesIndustrial",
    "modalidadServicioIndustrial",
    "precioConsulta",
    "horarioAtencion",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadServicioIndustrial: MODALIDAD_SERVICIO_INDUSTRIAL.filter((o) =>
      ["sitio_cliente", "remoto", "mixto", "planta"].includes(o.value)
    ),
    sectoresIndustriales: SECTORES_INDUSTRIALES,
    certificacionesIndustriales: CERTIFICACIONES_INDUSTRIALES,
    ...COLAB_OPTS,
  },
};

const BASE_NEGOCIO = {
  ...COMMON,
  extraFields: [
    "serviciosEmpresaIndustrial",
    "sectoresIndustriales",
    "procesosIndustriales",
    "modalidadServicioIndustrial",
    "certificacionesIndustriales",
    "capacidadProduccion",
    "equipamientoIndustrial",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "nombreComercial",
    "serviciosEmpresaIndustrial",
    "sectoresIndustriales",
    "modalidadServicioIndustrial",
    "direccion",
    "horarioDetalle",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadServicioIndustrial: MODALIDAD_SERVICIO_INDUSTRIAL,
    sectoresIndustriales: SECTORES_INDUSTRIALES,
    certificacionesIndustriales: CERTIFICACIONES_INDUSTRIALES,
    procesosIndustriales: [
      "Ensamble",
      "Maquinado",
      "Soldadura",
      "Pintura",
      "Empaque",
      "Automatización",
      "Otro",
    ],
    ...COLAB_OPTS,
  },
};

const SERVICIOS_CONSULTORIA = [
  "Diagnóstico",
  "Implementación",
  "Capacitación",
  "Auditoría",
  "Mejora continua",
  "Otro",
];

/** Perfil por subcategoriaId */
export const SUB_EXTRA_PROFILES = {
  "consultor-empresarial-independiente": {
    ...BASE_PERSONA,
    blockTitle: "Consultor empresarial independiente",
    aliasPlaceholder: "Ej. Consultor · Lean y procesos",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: SERVICIOS_CONSULTORIA,
    },
  },
  "auditor-independiente": {
    ...BASE_PERSONA,
    blockTitle: "Auditor independiente",
    aliasPlaceholder: "Ej. Auditor · ISO y calidad",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Auditoría interna", "Auditoría externa", "Gap analysis", "Otro"],
    },
  },
  "reclutador-independiente": {
    ...BASE_PERSONA,
    blockTitle: "Reclutador independiente",
    aliasPlaceholder: "Ej. Reclutador · Perfiles industriales",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Reclutamiento", "Headhunting", "Temporal", "Otro"],
      modalidadServicioIndustrial: MODALIDAD_SERVICIO_INDUSTRIAL.filter((o) =>
        ["remoto", "mixto", "sitio_cliente"].includes(o.value)
      ),
    },
  },
  "asesor-de-procesos": {
    ...BASE_PERSONA,
    blockTitle: "Asesor de procesos",
    aliasPlaceholder: "Ej. Asesor · Lean Six Sigma",
    extraFields: [...BASE_PERSONA.extraFields, "procesosIndustriales"],
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Mapeo procesos", "Lean", "Six Sigma", "Kaizen", "Otro"],
      procesosIndustriales: ["Producción", "Calidad", "Logística", "Mantenimiento", "Otro"],
    },
  },
  "inspector-de-calidad": {
    ...BASE_PERSONA,
    blockTitle: "Inspector de calidad",
    aliasPlaceholder: "Ej. Inspector · CMM y dimensional",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Inspección dimensional", "Inspección visual", "Reportes", "Otro"],
    },
  },
  "consultor-iso": {
    ...BASE_PERSONA,
    blockTitle: "Consultor ISO",
    aliasPlaceholder: "Ej. Consultor · ISO 9001 y 45001",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Implementación", "Documentación", "Auditoría interna", "Otro"],
    },
  },
  "gestor-de-tramites-empresariales": {
    ...BASE_PERSONA,
    blockTitle: "Gestor de trámites empresariales",
    aliasPlaceholder: "Ej. Gestor · Permisos y licencias",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Permisos", "Licencias", "Registros", "Otro"],
    },
  },
  "consultoria-fiscal": {
    ...BASE_PERSONA,
    blockTitle: "Consultoría fiscal",
    aliasPlaceholder: "Ej. Consultoría fiscal · PyMEs industriales",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Contabilidad", "Nómina", "Declaraciones", "Asesoría", "Otro"],
    },
  },
  "consultoria-legal": {
    ...BASE_PERSONA,
    blockTitle: "Consultoría legal",
    aliasPlaceholder: "Ej. Consultoría legal · Corporativo",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Corporativo", "Laboral", "Contratos", "Compliance", "Otro"],
    },
  },
  "certificaciones-iso": {
    ...BASE_PERSONA,
    blockTitle: "Certificaciones ISO",
    aliasPlaceholder: "Ej. Certificaciones · Preparación ISO",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Preparación", "Documentación", "Auditoría", "Otro"],
    },
  },
  "servicios-contables": {
    ...BASE_PERSONA,
    blockTitle: "Servicios contables",
    aliasPlaceholder: "Ej. Contabilidad · Nómina industrial",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Contabilidad", "Nómina", "Fiscal", "Reportes", "Otro"],
    },
  },
  "servicios-administrativos": {
    ...BASE_PERSONA,
    blockTitle: "Servicios administrativos",
    aliasPlaceholder: "Ej. Admin · Back office industrial",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Facturación", "Compras", "Archivo", "Atención proveedores", "Otro"],
    },
  },
  "servicios-corporativos": {
    ...BASE_PERSONA,
    blockTitle: "Servicios corporativos",
    aliasPlaceholder: "Ej. Servicios corporativos · B2B",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Soporte gerencial", "Proyectos", "Interim management", "Otro"],
    },
  },
  "empaques-y-embalaje": {
    ...BASE_PERSONA,
    blockTitle: "Empaques y embalaje",
    aliasPlaceholder: "Ej. Empaque · Corrugado y stretch",
    extraFields: [...BASE_PERSONA.extraFields, "capacidadProduccion"],
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosIndustriales: ["Empaque", "Embalaje", "Etiquetado", "Logística", "Otro"],
      modalidadServicioIndustrial: MODALIDAD_SERVICIO_INDUSTRIAL.filter((o) =>
        ["planta", "sitio_cliente", "instalaciones"].includes(o.value)
      ),
    },
  },
  "contador-publico": {
    ...BASE_PROF,
    blockTitle: "Contador público",
    aliasPlaceholder: "Ej. CP · Fiscal y nómina industrial",
    fieldOptions: {
      ...BASE_PROF.fieldOptions,
      serviciosProfesionalesIndustrial: ["Auditoría", "Fiscal", "Nómina", "Finanzas", "Otro"],
    },
  },
  "administrador-de-empresas": {
    ...BASE_PROF,
    blockTitle: "Administrador de empresas",
    aliasPlaceholder: "Ej. Administrador · Consultoría gerencial",
    fieldOptions: {
      ...BASE_PROF.fieldOptions,
      serviciosProfesionalesIndustrial: ["Estrategia", "Operaciones", "Finanzas", "RH", "Otro"],
    },
  },
  "ingeniero-industrial": {
    ...BASE_PROF,
    blockTitle: "Ingeniero industrial",
    aliasPlaceholder: "Ej. Ing. industrial · Layout y capacidad",
    fieldOptions: {
      ...BASE_PROF.fieldOptions,
      serviciosProfesionalesIndustrial: ["Layout", "Capacidad", "Simulación", "Lean", "Otro"],
      procesosIndustriales: ["Producción", "Logística", "Calidad", "Mantenimiento", "Otro"],
    },
  },
  "ingeniero-en-procesos": {
    ...BASE_PROF,
    blockTitle: "Ingeniero en procesos",
    aliasPlaceholder: "Ej. Ing. procesos · Mejora continua",
    fieldOptions: {
      ...BASE_PROF.fieldOptions,
      serviciosProfesionalesIndustrial: ["Mapeo", "Optimización", "Automatización", "Otro"],
    },
  },
  "especialista-en-seguridad-industrial": {
    ...BASE_PROF,
    blockTitle: "Especialista en seguridad industrial",
    aliasPlaceholder: "Ej. Seguridad · NOM-030 y 035",
    fieldOptions: {
      ...BASE_PROF.fieldOptions,
      serviciosProfesionalesIndustrial: ["Evaluación riesgos", "Capacitación", "Programas", "Otro"],
    },
  },
  manufactura: {
    ...BASE_NEGOCIO,
    blockTitle: "Manufactura",
    aliasPlaceholder: "Ej. Manufactura · Ensamble y maquinado",
    obligatoriosExtra: [...BASE_NEGOCIO.obligatoriosExtra, "capacidadProduccion"],
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["Producción", "Ensamble", "Maquinado", "Otro"],
    },
  },
  maquila: {
    ...BASE_NEGOCIO,
    blockTitle: "Maquila",
    aliasPlaceholder: "Ej. Maquila · Procesos tercerizados",
    obligatoriosExtra: [...BASE_NEGOCIO.obligatoriosExtra, "capacidadProduccion"],
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["Maquila", "Ensamble", "Empaque", "Logística", "Otro"],
    },
  },
  "automatizacion-industrial": {
    ...BASE_NEGOCIO,
    blockTitle: "Automatización industrial",
    aliasPlaceholder: "Ej. Automatización · PLC y robots",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["PLC", "Robots", "SCADA", "Integración", "Otro"],
      equipamientoIndustrial: ["PLC", "HMI", "Robots", "Sensores", "Otro"],
    },
  },
  "maquinaria-industrial": {
    ...BASE_NEGOCIO,
    blockTitle: "Maquinaria industrial",
    aliasPlaceholder: "Ej. Maquinaria · Venta y servicio",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["Venta", "Renta", "Servicio", "Refacciones", "Otro"],
    },
  },
  "soldadura-industrial": {
    ...BASE_NEGOCIO,
    blockTitle: "Soldadura industrial",
    aliasPlaceholder: "Ej. Soldadura · MIG/TIG estructural",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["MIG", "TIG", "Estructural", "Tubería", "Otro"],
      procesosIndustriales: ["MIG", "TIG", "Spot", "Otro"],
    },
  },
  "supervisor-industrial": {
    ...BASE_NEGOCIO,
    blockTitle: "Supervisor industrial",
    aliasPlaceholder: "Ej. Supervisor · Turnos y producción",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["Supervisión turno", "Producción", "Calidad", "Otro"],
    },
  },
  "tecnico-industrial": {
    ...BASE_NEGOCIO,
    blockTitle: "Técnico industrial",
    aliasPlaceholder: "Ej. Técnico · Mantenimiento y calibración",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["Mantenimiento", "Calibración", "Instalación", "Otro"],
    },
  },
  "seguridad-industrial": {
    ...BASE_NEGOCIO,
    blockTitle: "Seguridad industrial",
    aliasPlaceholder: "Ej. Seguridad · EPP y cumplimiento",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["EPP", "Capacitación", "Evaluación", "Programas", "Otro"],
    },
  },
  "mantenimiento-industrial": {
    ...BASE_NEGOCIO,
    blockTitle: "Mantenimiento industrial",
    aliasPlaceholder: "Ej. Mantenimiento · Preventivo y correctivo",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["Preventivo", "Correctivo", "Predictivo", "Paros programados", "Otro"],
    },
  },
  "limpieza-industrial": {
    ...BASE_NEGOCIO,
    blockTitle: "Limpieza industrial",
    aliasPlaceholder: "Ej. Limpieza · Planta y equipos",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["Planta", "Equipos", "Áreas críticas", "Turnos", "Otro"],
    },
  },
  outsourcing: {
    ...BASE_NEGOCIO,
    blockTitle: "Outsourcing",
    aliasPlaceholder: "Ej. Outsourcing · Procesos tercerizados",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["Producción", "Logística", "RH", "TI", "Otro"],
      modalidadServicioIndustrial: MODALIDAD_SERVICIO_INDUSTRIAL.filter((o) =>
        ["planta", "sitio_cliente", "mixto"].includes(o.value)
      ),
    },
  },
  "call-center": {
    ...BASE_NEGOCIO,
    blockTitle: "Call center",
    aliasPlaceholder: "Ej. Call center · Atención B2B",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["Inbound", "Outbound", "Soporte", "Ventas", "Otro"],
      modalidadServicioIndustrial: MODALIDAD_SERVICIO_INDUSTRIAL.filter((o) =>
        ["instalaciones", "remoto"].includes(o.value)
      ),
    },
  },
  "centro-de-negocios-empresarial": {
    ...BASE_NEGOCIO,
    blockTitle: "Centro de negocios empresarial",
    aliasPlaceholder: "Ej. Centro empresarial · Oficinas",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["Oficinas", "Salas", "Virtual office", "Recepción", "Otro"],
    },
  },
  "ingenieria-industrial": {
    ...BASE_NEGOCIO,
    blockTitle: "Ingeniería industrial",
    aliasPlaceholder: "Ej. Firma de ingeniería · Proyectos",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaIndustrial: ["Proyectos", "Layout", "Automatización", "Consultoría", "Otro"],
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
  p.profesionistaCedula = PACK_PROFESIONISTA_SUBS.has(subId);
  p.negocioLocal = PACK_NEGOCIO_SUBS.has(subId);
}
