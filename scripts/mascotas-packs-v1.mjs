/**
 * MP-MASCOTAS-DELTAS-V1 — packs A–E y mapa subcategoría → pack (20 subs sector mascotas).
 */
export const PACK_IDS = ["A", "B", "C", "D", "E"];

export const PACK_LABELS = {
  A: "Cuidado y hospedaje",
  B: "Entrenamiento canino",
  C: "Estética y fotografía",
  D: "Veterinaria y salud",
  E: "Retail, cría y servicios",
};

export const MASCOTAS_FIELD_REGISTRY = {
  modalidadServicioMascotas: {
    id: "modalidadServicioMascotas",
    label: "Modalidad de servicio",
    tipo: "enum",
    opciones: ["domicilio", "consultorio", "clinica", "instalaciones", "online", "ambos"],
  },
  serviciosMascotas: {
    id: "serviciosMascotas",
    label: "Servicios para mascotas",
    tipo: "checklist",
    iaCopy: true,
  },
  especiesAtendidas: {
    id: "especiesAtendidas",
    label: "Especies que atiendes",
    tipo: "checklist",
  },
  tamanoMascotasAtendidas: {
    id: "tamanoMascotasAtendidas",
    label: "Tamaños de mascota",
    tipo: "checklist",
  },
  especialidadVeterinaria: {
    id: "especialidadVeterinaria",
    label: "Especialidad veterinaria",
    tipo: "text",
    maxLength: 120,
  },
  serviciosVeterinarios: {
    id: "serviciosVeterinarios",
    label: "Servicios veterinarios",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadesVeterinarias: {
    id: "especialidadesVeterinarias",
    label: "Especialidades veterinarias",
    tipo: "checklist",
  },
  emergenciasMascotas: {
    id: "emergenciasMascotas",
    label: "¿Atiendes emergencias?",
    tipo: "enum",
    opciones: ["si_24h", "si_horario", "no", "derivacion"],
  },
  serviciosEmpresaMascotas: {
    id: "serviciosEmpresaMascotas",
    label: "Servicios del establecimiento",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadesEmpresaMascotas: {
    id: "especialidadesEmpresaMascotas",
    label: "Especialidades",
    tipo: "text",
    maxLength: 200,
  },
  capacidadInstalacion: {
    id: "capacidadInstalacion",
    label: "Capacidad / cupo",
    tipo: "text",
    maxLength: 80,
  },
  tiempoRespuestaMascotas: {
    id: "tiempoRespuestaMascotas",
    label: "Tiempo de respuesta",
    tipo: "enum",
    opciones: ["inmediato", "mismo_dia", "24_48h", "por_cita"],
  },
  diferenciadorMascotas: {
    id: "diferenciadorMascotas",
    label: "Tu sello con mascotas",
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
    label: "¿Colaboras con veterinarios, refugios o tiendas?",
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
  "paseador-de-perros": "A",
  "cuidador-de-mascotas": "A",
  "guarderia-para-mascotas": "A",
  "hotel-para-mascotas": "A",
  "entrenador-canino": "B",
  adiestrador: "B",
  "centro-de-entrenamiento-canino": "B",
  groomer: "C",
  "estetica-canina": "C",
  "fotografo-de-mascotas": "C",
  "medico-veterinario": "D",
  "veterinario-especialista": "D",
  "cirujano-veterinario": "D",
  "clinica-veterinaria": "D",
  "hospital-veterinario": "D",
  "farmacia-veterinaria": "D",
  "tienda-de-mascotas": "E",
  "criadero-autorizado": "E",
  "rescatista-independiente": "E",
  "servicio-funerario-para-mascotas": "E",
};

export const PACK_PROFESIONISTA_SUBS = new Set([
  "medico-veterinario",
  "veterinario-especialista",
  "cirujano-veterinario",
  "farmacia-veterinaria",
]);

export const PACK_NEGOCIO_SUBS = new Set([
  "clinica-veterinaria",
  "hospital-veterinario",
  "estetica-canina",
  "centro-de-entrenamiento-canino",
]);

export function packPlantillaKey(pack) {
  return `mascotas_pack_${pack.toLowerCase()}`;
}

export function formularioIdForSub(subId) {
  if (PACK_PROFESIONISTA_SUBS.has(subId)) return "profesionista_cedula";
  if (PACK_NEGOCIO_SUBS.has(subId)) return "negocio_empresa";
  return "persona_independiente";
}
