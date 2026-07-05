/**
 * MP-EDUCACION-DELTAS-V1 — deltas públicos detallados por subcategoría (30).
 */
import {
  SUB_TO_PACK,
  PACK_LABELS,
  formularioIdForSub,
  PACK_PROFESIONISTA_SUBS,
  PACK_NEGOCIO_SUBS,
} from "./educacion-packs-v1.mjs";
import { SUB_EXTRA_PROFILES } from "./educacion-sub-extra-fields.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Docencia e instructores",
    blockHint: "Materias, modalidad y cobertura — tu sello educativo genera confianza.",
    aliasPlaceholder: "Ej. Maestro · Primaria y secundaria",
    deltaFields: ["serviciosEducacion", "materiasEducativas", "modalidadEducacion", "formatoClase"],
    obligatoriosDelta: [
      "alias",
      "serviciosEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "coberturaGeografica",
      "tiempoRespuestaEducacion",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  B: {
    blockTitle: "Profesionales certificados",
    blockHint: "Especialidad, servicios y modalidad — cédula se valida en sección privada.",
    aliasPlaceholder: "Ej. Psicopedagogo · Evaluación y apoyo",
    deltaFields: [
      "serviciosProfesionalesEducacion",
      "especialidadEducativa",
      "materiasEducativas",
      "modalidadEducacion",
    ],
    obligatoriosDelta: [
      "nombreProfesional",
      "especialidadEducativa",
      "serviciosProfesionalesEducacion",
      "modalidadEducacion",
      "precioConsulta",
      "horarioAtencion",
      "coberturaGeografica",
    ],
  },
  C: {
    blockTitle: "Academias especializadas",
    blockHint: "Programas, materias y modalidad del centro.",
    aliasPlaceholder: "Ej. Academia · Idiomas y certificación",
    deltaFields: ["serviciosEmpresaEducacion", "materiasEducativas", "modalidadEducacion", "formatoClase"],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosEmpresaEducacion",
      "materiasEducativas",
      "modalidadEducacion",
      "direccion",
      "horarioDetalle",
      "coberturaGeografica",
    ],
  },
  D: {
    blockTitle: "Centros e instituciones",
    blockHint: "Programas, niveles y cobertura institucional.",
    aliasPlaceholder: "Ej. Centro de capacitación · Cursos certificados",
    deltaFields: [
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "certificacionesEducativas",
    ],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosEmpresaEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "direccion",
      "horarioDetalle",
      "coberturaGeografica",
    ],
  },
  E: {
    blockTitle: "Educación formal y alternativa",
    blockHint: "Programas, niveles y modalidad.",
    aliasPlaceholder: "Ej. Preparatoria · Bachillerato",
    deltaFields: ["serviciosEducacion", "nivelesEducativos", "modalidadEducacion", "edadesAtendidas"],
    obligatoriosDelta: [
      "alias",
      "serviciosEducacion",
      "nivelesEducativos",
      "modalidadEducacion",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
};

export const SUB_DELTA_PATCHES = {
  "maestro-particular": { blockTitle: "Maestro particular" },
  "tutor-academico": { blockTitle: "Tutor académico" },
  "profesor-de-idiomas": { blockTitle: "Profesor de idiomas" },
  "profesor-de-matematicas": { blockTitle: "Profesor de matemáticas" },
  "profesor-de-musica": { blockTitle: "Profesor de música" },
  "profesor-de-arte": { blockTitle: "Profesor de arte" },
  "coach-educativo": { blockTitle: "Coach educativo" },
  "instructor-de-manejo": { blockTitle: "Instructor de manejo" },
  "instructor-deportivo": { blockTitle: "Instructor deportivo" },
  "instructor-de-computacion": { blockTitle: "Instructor de computación" },
  psicopedagogo: { blockTitle: "Psicopedagogo" },
  pedagogo: { blockTitle: "Pedagogo" },
  "docente-certificado": { blockTitle: "Docente certificado" },
  "especialista-en-educacion-especial": { blockTitle: "Especialista en educación especial" },
  "academia-de-idiomas": { blockTitle: "Academia de idiomas" },
  "escuela-de-musica": { blockTitle: "Escuela de música" },
  "escuela-de-arte": { blockTitle: "Escuela de arte" },
  "escuela-de-manejo": { blockTitle: "Escuela de manejo" },
  "escuela-tecnica": { blockTitle: "Escuela técnica" },
  "capacitador-empresarial": { blockTitle: "Capacitador empresarial" },
  "centro-de-capacitacion": { blockTitle: "Centro de capacitación" },
  "instituto-educativo": { blockTitle: "Instituto educativo" },
  "centro-de-certificaciones": { blockTitle: "Centro de certificaciones" },
  "plataforma-educativa": { blockTitle: "Plataforma educativa" },
  escuelas: { blockTitle: "Escuelas" },
  universidades: { blockTitle: "Universidades" },
  "cursos-en-linea": { blockTitle: "Cursos en línea" },
  preparatoria: { blockTitle: "Preparatoria" },
  guarderias: { blockTitle: "Guarderías" },
  "talleres-creativos": { blockTitle: "Talleres creativos" },
};

function mergeDelta(subId, nombre, pack, fotosMin) {
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
    fotosMin: fotosMin || 3,
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

export function buildEducacionSubDeltas(catalogRows) {
  const SUB_CANON_META = {};
  const SUB_DELTAS = {};
  for (const row of catalogRows) {
    const subId = row.subcategoriaId;
    const pack = SUB_TO_PACK[subId];
    if (!pack) continue;
    const fotosMin = row.fotos || 3;
    const delta = mergeDelta(subId, row.subcategoria || row.nombre || subId, pack, fotosMin);
    SUB_CANON_META[subId] = {
      canonSubcategoriaId: subId,
      nombre: delta.nombre,
      deltaPack: pack,
      formularioId: delta.formularioId,
      fotosMin: delta.fotosMin,
      mapa: row.mapa === true,
    };
    SUB_DELTAS[subId] = delta;
  }
  return { SUB_CANON_META, SUB_DELTAS };
}
