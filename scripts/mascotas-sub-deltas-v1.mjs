/**
 * MP-MASCOTAS-DELTAS-V1 — deltas públicos detallados por subcategoría (20).
 */
import {
  SUB_TO_PACK,
  PACK_LABELS,
  formularioIdForSub,
  PACK_PROFESIONISTA_SUBS,
  PACK_NEGOCIO_SUBS,
} from "./mascotas-packs-v1.mjs";
import { SUB_EXTRA_PROFILES } from "./mascotas-sub-extra-fields.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Cuidado y hospedaje",
    blockHint: "Servicios, especies y modalidad — cobertura y tiempos generan confianza.",
    aliasPlaceholder: "Ej. Paseador · Zona sur",
    deltaFields: ["serviciosMascotas", "especiesAtendidas", "modalidadServicioMascotas", "capacidadInstalacion"],
    obligatoriosDelta: [
      "alias",
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "coberturaGeografica",
      "tiempoRespuestaMascotas",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  B: {
    blockTitle: "Entrenamiento canino",
    blockHint: "Programas, métodos y modalidad de entrenamiento.",
    aliasPlaceholder: "Ej. Entrenador · Obediencia y conducta",
    deltaFields: ["serviciosMascotas", "especiesAtendidas", "modalidadServicioMascotas"],
    obligatoriosDelta: [
      "alias",
      "serviciosMascotas",
      "modalidadServicioMascotas",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  C: {
    blockTitle: "Estética y fotografía",
    blockHint: "Servicios, especies y modalidad — muestra tu estilo.",
    aliasPlaceholder: "Ej. Groomer · Baño y corte",
    deltaFields: ["serviciosMascotas", "especiesAtendidas", "modalidadServicioMascotas"],
    obligatoriosDelta: [
      "alias",
      "serviciosMascotas",
      "modalidadServicioMascotas",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  D: {
    blockTitle: "Veterinaria y salud",
    blockHint: "Servicios veterinarios, especies y emergencias.",
    aliasPlaceholder: "Ej. MVZ · Consulta general",
    deltaFields: [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas",
      "emergenciasMascotas",
    ],
    obligatoriosDelta: [],
  },
  E: {
    blockTitle: "Retail, cría y servicios",
    blockHint: "Productos, servicios y cobertura.",
    aliasPlaceholder: "Ej. Tienda mascotas · Alimento y accesorios",
    deltaFields: ["serviciosMascotas", "especiesAtendidas", "modalidadServicioMascotas"],
    obligatoriosDelta: [
      "alias",
      "serviciosMascotas",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
};

export const SUB_DELTA_PATCHES = {
  "paseador-de-perros": { blockTitle: "Paseador de perros" },
  "cuidador-de-mascotas": { blockTitle: "Cuidador de mascotas" },
  "guarderia-para-mascotas": { blockTitle: "Guardería para mascotas" },
  "hotel-para-mascotas": { blockTitle: "Hotel para mascotas" },
  "entrenador-canino": { blockTitle: "Entrenador canino" },
  adiestrador: { blockTitle: "Adiestrador" },
  "centro-de-entrenamiento-canino": { blockTitle: "Centro de entrenamiento canino" },
  groomer: { blockTitle: "Groomer" },
  "estetica-canina": { blockTitle: "Estética canina" },
  "fotografo-de-mascotas": { blockTitle: "Fotógrafo de mascotas" },
  "medico-veterinario": { blockTitle: "Médico veterinario" },
  "veterinario-especialista": { blockTitle: "Veterinario especialista" },
  "cirujano-veterinario": { blockTitle: "Cirujano veterinario" },
  "clinica-veterinaria": { blockTitle: "Clínica veterinaria" },
  "hospital-veterinario": { blockTitle: "Hospital veterinario" },
  "farmacia-veterinaria": { blockTitle: "Farmacia veterinaria" },
  "tienda-de-mascotas": { blockTitle: "Tienda de mascotas" },
  "criadero-autorizado": { blockTitle: "Criadero autorizado" },
  "rescatista-independiente": { blockTitle: "Rescatista independiente" },
  "servicio-funerario-para-mascotas": { blockTitle: "Servicio funerario para mascotas" },
};

function mergeDelta(subId, nombre, pack) {
  const base = PACK_DELTA_BASE[pack] || PACK_DELTA_BASE.A;
  const patch = SUB_DELTA_PATCHES[subId] || {};
  const extra = SUB_EXTRA_PROFILES[subId] || {};
  const mergedFieldOptions = {
    ...(base.fieldOptions || {}),
    ...(patch.fieldOptions || {}),
    ...(extra.fieldOptions || {}),
  };
  const extraFields = [...new Set([...(extra.extraFields || []), ...(patch.extraFields || [])])];
  const hideFields = [...new Set([...(extra.hideFields || []), ...(patch.hideFields || [])])];
  const obligSet = new Set([
    ...(patch.obligatoriosDelta || base.obligatoriosDelta || []),
    ...(extra.obligatoriosExtra || []),
  ]);
  return {
    canonSubcategoriaId: subId,
    deltaPack: pack,
    formularioId: formularioIdForSub(subId),
    nombre,
    packLabel: PACK_LABELS[pack] || pack,
    blockTitle: extra.blockTitle || patch.blockTitle || nombre,
    blockHint: extra.blockHint || patch.blockHint || base.blockHint || "",
    aliasPlaceholder: extra.aliasPlaceholder || patch.aliasPlaceholder || base.aliasPlaceholder || "",
    deltaFields: patch.deltaFields || base.deltaFields || [],
    extraFields: extraFields.length ? extraFields : undefined,
    hideFields: hideFields.length ? hideFields : undefined,
    obligatoriosDelta: [...obligSet],
    textosAyuda: { ...(base.textosAyuda || {}), ...(patch.textosAyuda || {}), ...(extra.textosAyuda || {}) },
    fieldLabels: { ...(base.fieldLabels || {}), ...(patch.fieldLabels || {}), ...(extra.fieldLabels || {}) },
    fieldOptions: Object.keys(mergedFieldOptions).length ? mergedFieldOptions : undefined,
    profesionistaCedula: PACK_PROFESIONISTA_SUBS.has(subId),
    negocioLocal: PACK_NEGOCIO_SUBS.has(subId),
    personaIndependiente: !PACK_PROFESIONISTA_SUBS.has(subId) && !PACK_NEGOCIO_SUBS.has(subId),
  };
}

export function buildMascotasSubDeltas(catalogRows) {
  const SUB_CANON_META = {};
  const SUB_DELTAS = {};
  for (const row of catalogRows) {
    const subId = row.subcategoriaId;
    const pack = SUB_TO_PACK[subId];
    if (!pack) continue;
    const delta = mergeDelta(subId, row.subcategoria || row.nombre || subId, pack);
    SUB_CANON_META[subId] = {
      canonSubcategoriaId: subId,
      nombre: delta.nombre,
      deltaPack: pack,
      formularioId: delta.formularioId,
    };
    SUB_DELTAS[subId] = delta;
  }
  return { SUB_CANON_META, SUB_DELTAS };
}
