/**
 * MP-MASCOTAS-DELTAS-V1 — campos extra, ocultos y opciones por subcategoría (20 subs).
 */
import {
  mergeHideAdultLeaks,
  HIDE_ADULT_LEAKS,
  COLABORACIONES_COMERCIALES_OPTIONS,
  TIPOS_COLABORACION_COMERCIAL,
} from "./registro-cross-sector-policy.mjs";
import { mergeEnrichmentV2 } from "./mascotas-sub-enrichment-v2.mjs";
import { PACK_PROFESIONISTA_SUBS, PACK_NEGOCIO_SUBS } from "./mascotas-packs-v1.mjs";

export const MODALIDAD_SERVICIO_MASCOTAS = [
  { value: "domicilio", label: "A domicilio" },
  { value: "consultorio", label: "Consultorio / local" },
  { value: "clinica", label: "Clínica / instalaciones" },
  { value: "instalaciones", label: "Instalaciones propias" },
  { value: "online", label: "En línea" },
  { value: "ambos", label: "Presencial y en línea" },
];

export const TIEMPO_RESPUESTA_MASCOTAS = [
  { value: "inmediato", label: "Inmediato / urgencias" },
  { value: "mismo_dia", label: "Mismo día" },
  { value: "24_48h", label: "24–48 horas" },
  { value: "por_cita", label: "Con cita programada" },
];

export const ESPECIES_MASCOTAS = ["Perro", "Gato", "Aves", "Reptiles", "Roedores", "Exóticos", "Otro"];

export const TAMANOS_MASCOTAS = ["Pequeño", "Mediano", "Grande", "Gigante"];

export const EMERGENCIAS_MASCOTAS = [
  { value: "si_24h", label: "Sí, 24 horas" },
  { value: "si_horario", label: "Sí, en horario limitado" },
  { value: "no", label: "No" },
  { value: "derivacion", label: "Solo derivación" },
];

export { HIDE_ADULT_LEAKS };

const COLAB_OPTS = {
  colaboracionesComerciales: COLABORACIONES_COMERCIALES_OPTIONS,
  tiposColaboracionComercial: TIPOS_COLABORACION_COMERCIAL,
};

const COMMON = {
  extraFields: [
    "diferenciadorMascotas",
    "coberturaGeografica",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: { ...COLAB_OPTS },
  textosAyuda: {
    diferenciadorMascotas: "Ej. Amor por los animales · Certificado · Emergencias",
    coberturaGeografica: "Colonias, municipios o zona de servicio.",
    colaboracionesComerciales: "¿Colaboras con veterinarios, refugios o tiendas?",
  },
};

const BASE_PERSONA = {
  ...COMMON,
  extraFields: [
    "serviciosMascotas",
    "especiesAtendidas",
    "modalidadServicioMascotas",
    "tamanoMascotasAtendidas",
    "tiempoRespuestaMascotas",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosMascotas",
    "especiesAtendidas",
    "modalidadServicioMascotas",
    "coberturaGeografica",
    "tiempoRespuestaMascotas",
  ],
  fieldOptions: {
    modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS,
    tiempoRespuestaMascotas: TIEMPO_RESPUESTA_MASCOTAS,
    especiesAtendidas: ESPECIES_MASCOTAS,
    tamanoMascotasAtendidas: TAMANOS_MASCOTAS,
    ...COLAB_OPTS,
  },
};

const BASE_HOSPEDAJE = {
  ...BASE_PERSONA,
  extraFields: [...BASE_PERSONA.extraFields, "capacidadInstalacion"],
  obligatoriosExtra: [...BASE_PERSONA.obligatoriosExtra, "capacidadInstalacion"],
};

const BASE_VET_PROF = {
  ...COMMON,
  extraFields: [
    "serviciosVeterinarios",
    "especialidadVeterinaria",
    "especialidadesVeterinarias",
    "especiesAtendidas",
    "modalidadServicioMascotas",
    "emergenciasMascotas",
    "tiempoRespuestaMascotas",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "nombreProfesional",
    "especialidadVeterinaria",
    "serviciosVeterinarios",
    "especiesAtendidas",
    "modalidadServicioMascotas",
    "precioConsulta",
    "horarioAtencion",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS.filter((o) =>
      ["consultorio", "clinica", "domicilio", "online", "ambos"].includes(o.value)
    ),
    tiempoRespuestaMascotas: TIEMPO_RESPUESTA_MASCOTAS,
    especiesAtendidas: ESPECIES_MASCOTAS,
    emergenciasMascotas: EMERGENCIAS_MASCOTAS,
    ...COLAB_OPTS,
  },
};

const BASE_NEGOCIO = {
  ...COMMON,
  extraFields: [
    "serviciosEmpresaMascotas",
    "especialidadesEmpresaMascotas",
    "especiesAtendidas",
    "modalidadServicioMascotas",
    "emergenciasMascotas",
    "capacidadInstalacion",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "nombreComercial",
    "serviciosEmpresaMascotas",
    "especialidadesEmpresaMascotas",
    "especiesAtendidas",
    "direccion",
    "horarioDetalle",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS.filter((o) =>
      ["consultorio", "clinica", "instalaciones", "ambos"].includes(o.value)
    ),
    emergenciasMascotas: EMERGENCIAS_MASCOTAS,
    especiesAtendidas: ESPECIES_MASCOTAS,
    ...COLAB_OPTS,
  },
};

/** Perfil por subcategoriaId */
export const SUB_EXTRA_PROFILES = {
  "paseador-de-perros": {
    ...BASE_PERSONA,
    blockTitle: "Paseador de perros",
    aliasPlaceholder: "Ej. Paseador · Zona norte CDMX",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosMascotas: ["Paseo individual", "Paseo grupal", "Ejercicio", "Socialización", "Otro"],
      modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS.filter((o) =>
        ["domicilio", "ambos"].includes(o.value)
      ),
      tamanoMascotasAtendidas: TAMANOS_MASCOTAS,
    },
  },
  "cuidador-de-mascotas": {
    ...BASE_PERSONA,
    blockTitle: "Cuidador de mascotas",
    aliasPlaceholder: "Ej. Cuidador · Visitas y alimentación",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosMascotas: ["Visitas", "Alimentación", "Medicación", "Noche", "Fin de semana", "Otro"],
    },
  },
  "guarderia-para-mascotas": {
    ...BASE_HOSPEDAJE,
    blockTitle: "Guardería para mascotas",
    aliasPlaceholder: "Ej. Guardería · Día y medio día",
    fieldOptions: {
      ...BASE_HOSPEDAJE.fieldOptions,
      serviciosMascotas: ["Guardería día", "Medio día", "Socialización", "Transporte", "Otro"],
      modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS.filter((o) =>
        ["instalaciones", "clinica"].includes(o.value)
      ),
    },
  },
  "hotel-para-mascotas": {
    ...BASE_HOSPEDAJE,
    blockTitle: "Hotel para mascotas",
    aliasPlaceholder: "Ej. Hotel mascotas · Hospedaje con cámaras",
    fieldOptions: {
      ...BASE_HOSPEDAJE.fieldOptions,
      serviciosMascotas: ["Hospedaje", "Suite", "Paseo incluido", "Grooming", "Transporte", "Otro"],
      modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS.filter((o) => o.value === "instalaciones"),
    },
  },
  "entrenador-canino": {
    ...BASE_PERSONA,
    blockTitle: "Entrenador canino",
    aliasPlaceholder: "Ej. Entrenador · Obediencia y conducta",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosMascotas: [
        "Obediencia básica",
        "Corrección conducta",
        "Cachorros",
        "Agresividad",
        "Ansiedad",
        "Otro",
      ],
      especiesAtendidas: ["Perro"],
      tamanoMascotasAtendidas: TAMANOS_MASCOTAS,
    },
  },
  adiestrador: {
    ...BASE_PERSONA,
    blockTitle: "Adiestrador",
    aliasPlaceholder: "Ej. Adiestrador · En casa o parque",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosMascotas: ["Obediencia", "Modificación conducta", "Protección", "Competencia", "Otro"],
      especiesAtendidas: ["Perro"],
    },
  },
  "centro-de-entrenamiento-canino": {
    ...BASE_NEGOCIO,
    blockTitle: "Centro de entrenamiento canino",
    aliasPlaceholder: "Ej. Centro canino · Grupos y privado",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaMascotas: [
        "Grupos",
        "Privado",
        "Board and train",
        "Agility",
        "Conducta",
        "Otro",
      ],
      especiesAtendidas: ["Perro"],
    },
  },
  groomer: {
    ...BASE_PERSONA,
    blockTitle: "Groomer",
    aliasPlaceholder: "Ej. Groomer · Baño y corte",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosMascotas: ["Baño", "Corte", "Corte uñas", "Limpieza oídos", "Spa", "Otro"],
      modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS.filter((o) =>
        ["domicilio", "consultorio", "ambos"].includes(o.value)
      ),
    },
  },
  "estetica-canina": {
    ...BASE_NEGOCIO,
    blockTitle: "Estética canina",
    aliasPlaceholder: "Ej. Estética canina · Baño y styling",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaMascotas: ["Baño", "Corte raza", "Spa", "Uñas", "Transporte", "Otro"],
      especiesAtendidas: ["Perro", "Gato"],
    },
  },
  "fotografo-de-mascotas": {
    ...BASE_PERSONA,
    blockTitle: "Fotógrafo de mascotas",
    aliasPlaceholder: "Ej. Fotógrafo mascotas · Sesiones en estudio",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosMascotas: ["Sesión estudio", "Exterior", "Eventos", "Producto", "Retrato", "Otro"],
      modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS.filter((o) =>
        ["domicilio", "consultorio", "online", "ambos"].includes(o.value)
      ),
      tamanoMascotasAtendidas: TAMANOS_MASCOTAS,
    },
  },
  "medico-veterinario": {
    ...BASE_VET_PROF,
    blockTitle: "Médico veterinario",
    aliasPlaceholder: "Ej. MVZ · Consulta general",
    fieldOptions: {
      ...BASE_VET_PROF.fieldOptions,
      serviciosVeterinarios: [
        "Consulta general",
        "Vacunas",
        "Desparasitación",
        "Cirugía menor",
        "Urgencias",
        "Otro",
      ],
    },
  },
  "veterinario-especialista": {
    ...BASE_VET_PROF,
    blockTitle: "Veterinario especialista",
    aliasPlaceholder: "Ej. Especialista · Cardiología / derma",
    extraFields: [...BASE_VET_PROF.extraFields],
    obligatoriosExtra: [...BASE_VET_PROF.obligatoriosExtra, "especialidadesVeterinarias"],
    fieldOptions: {
      ...BASE_VET_PROF.fieldOptions,
      serviciosVeterinarios: ["Consulta especializada", "Seguimiento", "Procedimientos", "Segunda opinión", "Otro"],
      especialidadesVeterinarias: [
        "Dermatología",
        "Cardiología",
        "Oftalmología",
        "Oncología",
        "Neurología",
        "Otro",
      ],
    },
  },
  "cirujano-veterinario": {
    ...BASE_VET_PROF,
    blockTitle: "Cirujano veterinario",
    aliasPlaceholder: "Ej. Cirujano vet · Ortopedia y soft tissue",
    fieldOptions: {
      ...BASE_VET_PROF.fieldOptions,
      serviciosVeterinarios: [
        "Cirugía general",
        "Ortopedia",
        "Soft tissue",
        "Emergencias quirúrgicas",
        "Otro",
      ],
      emergenciasMascotas: EMERGENCIAS_MASCOTAS.filter((o) => o.value !== "no"),
    },
  },
  "clinica-veterinaria": {
    ...BASE_NEGOCIO,
    blockTitle: "Clínica veterinaria",
    aliasPlaceholder: "Ej. Clínica vet · Consulta y laboratorio",
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaMascotas: [
        "Consulta",
        "Vacunas",
        "Laboratorio",
        "Imagen",
        "Cirugía",
        "Hospitalización",
        "Otro",
      ],
    },
  },
  "hospital-veterinario": {
    ...BASE_NEGOCIO,
    blockTitle: "Hospital veterinario",
    aliasPlaceholder: "Ej. Hospital vet · Urgencias 24 h",
    obligatoriosExtra: [...BASE_NEGOCIO.obligatoriosExtra, "emergenciasMascotas"],
    fieldOptions: {
      ...BASE_NEGOCIO.fieldOptions,
      serviciosEmpresaMascotas: [
        "Urgencias",
        "Hospitalización",
        "UCI",
        "Cirugía",
        "Laboratorio",
        "Imagen",
        "Otro",
      ],
      emergenciasMascotas: EMERGENCIAS_MASCOTAS.filter((o) => ["si_24h", "si_horario"].includes(o.value)),
    },
  },
  "farmacia-veterinaria": {
    ...BASE_VET_PROF,
    blockTitle: "Farmacia veterinaria",
    aliasPlaceholder: "Ej. Farmacia vet · Medicamentos y receta",
    obligatoriosExtra: [
      "nombreProfesional",
      "serviciosVeterinarios",
      "especiesAtendidas",
      "horarioAtencion",
      "coberturaGeografica",
    ],
    fieldOptions: {
      ...BASE_VET_PROF.fieldOptions,
      serviciosVeterinarios: [
        "Medicamentos",
        "Alimentos medicados",
        "Suplementos",
        "Material médico",
        "Asesoría",
        "Otro",
      ],
      modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS.filter((o) =>
        ["consultorio", "clinica", "online", "ambos"].includes(o.value)
      ),
    },
  },
  "tienda-de-mascotas": {
    ...BASE_PERSONA,
    blockTitle: "Tienda de mascotas",
    aliasPlaceholder: "Ej. Tienda mascotas · Alimento y accesorios",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosMascotas: [
        "Alimento",
        "Accesorios",
        "Juguetes",
        "Ropa",
        "Acuarios",
        "Asesoría",
        "Otro",
      ],
      modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS.filter((o) =>
        ["consultorio", "online", "ambos"].includes(o.value)
      ),
    },
  },
  "criadero-autorizado": {
    ...BASE_HOSPEDAJE,
    blockTitle: "Criadero autorizado",
    aliasPlaceholder: "Ej. Criadero · Razas registradas",
    fieldOptions: {
      ...BASE_HOSPEDAJE.fieldOptions,
      serviciosMascotas: ["Camadas", "Reserva cachorros", "Pedigree", "Asesoría", "Otro"],
      especiesAtendidas: ["Perro", "Gato", "Aves", "Exóticos", "Otro"],
    },
  },
  "rescatista-independiente": {
    ...BASE_PERSONA,
    blockTitle: "Rescatista independiente",
    aliasPlaceholder: "Ej. Rescate · Adopciones responsables",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosMascotas: ["Rescate", "Rehabilitación", "Adopción", "Esterilización", "Traslado", "Otro"],
      modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS.filter((o) =>
        ["domicilio", "instalaciones", "ambos"].includes(o.value)
      ),
    },
  },
  "servicio-funerario-para-mascotas": {
    ...BASE_PERSONA,
    blockTitle: "Servicio funerario para mascotas",
    aliasPlaceholder: "Ej. Funeraria mascotas · Cremación y urnas",
    fieldOptions: {
      ...BASE_PERSONA.fieldOptions,
      serviciosMascotas: ["Cremación", "Urna", "Velación", "Traslado", "Memorial", "Otro"],
      modalidadServicioMascotas: MODALIDAD_SERVICIO_MASCOTAS.filter((o) =>
        ["domicilio", "instalaciones", "ambos"].includes(o.value)
      ),
      especiesAtendidas: ESPECIES_MASCOTAS,
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
