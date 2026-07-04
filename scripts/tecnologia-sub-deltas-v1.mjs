/**
 * MP-TECNOLOGIA-DELTAS-V1 — deltas públicos detallados por subcategoría (32).
 */
import { SUB_TO_PACK, PACK_LABELS, formularioIdForSub, PACK_NEGOCIO_SUBS } from "./tecnologia-packs-v1.mjs";
import { SUB_EXTRA_PROFILES } from "./tecnologia-sub-extra-fields.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Desarrollo profesional",
    blockHint: "Stack, servicios y modalidad — incluye portafolio si aplica.",
    aliasPlaceholder: "Ej. Dev Full Stack · React y Node",
    deltaFields: ["stackTecnologico", "serviciosDesarrollo", "modalidadServicioTI", "lenguajesFrameworks"],
    obligatoriosDelta: [
      "alias",
      "stackTecnologico",
      "serviciosDesarrollo",
      "modalidadServicioTI",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
    ],
    textosAyuda: {
      stackTecnologico: "Tecnologías donde tienes experiencia comprobable.",
      serviciosDesarrollo: "Desarrollo web, apps, APIs, mantenimiento…",
      modalidadServicioTI: "Remoto, presencial, híbrido o visita al cliente.",
    },
  },
  B: {
    blockTitle: "Soporte y reparación",
    blockHint: "Servicios de soporte, reparación y cobertura — sé claro con tiempos de respuesta.",
    aliasPlaceholder: "Ej. Soporte TI · Mismo día CDMX",
    deltaFields: ["serviciosSoporteTI", "tiposEquipoSoporte", "serviciosReparacion", "modalidadServicioTI"],
    obligatoriosDelta: [
      "alias",
      "serviciosSoporteTI",
      "tiposEquipoSoporte",
      "modalidadServicioTI",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
    textosAyuda: {
      serviciosSoporteTI: "Helpdesk, mantenimiento, instalación, recuperación de datos…",
      tiposEquipoSoporte: "PC, Mac, servidores, impresoras, redes…",
      coberturaGeografica: "Colonias, municipios o toda la ciudad donde atiendes.",
    },
  },
  C: {
    blockTitle: "Marketing digital",
    blockHint: "Servicios y canales que manejas — incluye herramientas si aplica.",
    aliasPlaceholder: "Ej. Community Manager · PyME y startups",
    deltaFields: ["serviciosMarketingDigital", "canalesMarketing", "especialidadMarketing", "modalidadServicioTI"],
    obligatoriosDelta: [
      "alias",
      "serviciosMarketingDigital",
      "canalesMarketing",
      "modalidadServicioTI",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  D: {
    blockTitle: "Consultoría y ciberseguridad",
    blockHint: "Áreas de consultoría, servicios y certificaciones relevantes.",
    aliasPlaceholder: "Ej. Consultor IT · Infraestructura y nube",
    deltaFields: ["areasConsultoriaTI", "serviciosConsultoriaTI", "serviciosCiberseguridad", "modalidadServicioTI"],
    obligatoriosDelta: [
      "alias",
      "areasConsultoriaTI",
      "serviciosConsultoriaTI",
      "modalidadServicioTI",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  E: {
    blockTitle: "Negocio / agencia TI",
    blockHint: "Datos del establecimiento — servicios y especialidades.",
    aliasPlaceholder: "Ej. Agencia Digital · Marketing y desarrollo",
    deltaFields: ["serviciosEmpresaTI", "especialidadesEmpresaTI", "tamanoEmpresaAtendida"],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "direccion",
      "horarioDetalle",
      "geo",
    ],
  },
  F: {
    blockTitle: "Creativo e infraestructura",
    blockHint: "Servicios creativos, audiovisual, cloud o telecom — incluye portafolio si aplica.",
    aliasPlaceholder: "Ej. Diseño UX/UI · Producto digital",
    deltaFields: ["serviciosCreativosTI", "especialidadCreativaTI", "modalidadServicioTI", "portfolioURL"],
    obligatoriosDelta: [
      "alias",
      "serviciosCreativosTI",
      "especialidadCreativaTI",
      "modalidadServicioTI",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
};

export const SUB_DELTA_PATCHES = {
  programador: { blockTitle: "Programador" },
  "desarrollador-web": { blockTitle: "Desarrollador web" },
  "desarrollador-movil": { blockTitle: "Desarrollador móvil" },
  "disenador-grafico": { blockTitle: "Diseñador gráfico" },
  "disenador-ux-ui": { blockTitle: "Diseñador UX/UI" },
  "editor-de-video": { blockTitle: "Editor de video" },
  "community-manager": { blockTitle: "Community manager" },
  "especialista-seo": { blockTitle: "Especialista SEO" },
  "especialista-sem": { blockTitle: "Especialista SEM" },
  "administrador-de-redes-sociales": { blockTitle: "Administrador de redes sociales" },
  "soporte-tecnico-independiente": { blockTitle: "Soporte técnico independiente" },
  "tecnico-en-computadoras": { blockTitle: "Técnico en computadoras" },
  "especialista-en-ciberseguridad-independiente": { blockTitle: "Ciberseguridad independiente" },
  "consultor-it": { blockTitle: "Consultor IT" },
  "automatizacion-ia": { blockTitle: "Automatización IA" },
  "prompt-engineer": { blockTitle: "Prompt engineer" },
  "creador-de-contenido-digital": { blockTitle: "Creador de contenido digital" },
  "agencia-de-marketing-digital": { blockTitle: "Agencia de marketing digital" },
  "agencia-seo": { blockTitle: "Agencia SEO" },
  "agencia-de-publicidad-digital": { blockTitle: "Agencia de publicidad digital" },
  "desarrollo-de-software": { blockTitle: "Desarrollo de software" },
  "desarrollo-de-apps": { blockTitle: "Desarrollo de apps" },
  "desarrollo-web": { blockTitle: "Desarrollo web" },
  "hosting-y-dominios": { blockTitle: "Hosting y dominios" },
  "servicios-cloud": { blockTitle: "Servicios cloud" },
  "consultoria-tecnologica": { blockTitle: "Consultoría tecnológica" },
  "ciberseguridad-empresarial": { blockTitle: "Ciberseguridad empresarial" },
  "soporte-empresarial-ti": { blockTitle: "Soporte empresarial TI" },
  "produccion-audiovisual": { blockTitle: "Producción audiovisual" },
  "estudio-de-diseno": { blockTitle: "Estudio de diseño" },
  "redes-y-telecomunicaciones": { blockTitle: "Redes y telecomunicaciones" },
  "venta-de-equipo-de-computo": { blockTitle: "Venta de equipo de cómputo" },
};

function mergeDelta(subId, nombre, pack) {
  const base = PACK_DELTA_BASE[pack] || PACK_DELTA_BASE.B;
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
    negocioLocal: PACK_NEGOCIO_SUBS.has(subId),
    personaIndependiente: !PACK_NEGOCIO_SUBS.has(subId),
  };
}

export function buildTecnologiaSubDeltas(catalogRows) {
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
