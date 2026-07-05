/**
 * MP-BIENESTAR-DELTAS-V1 — deltas públicos por subcategoría (58 persona + 2 retail negocio).
 * Fuente para generate-bienestar-sub-deltas.mjs y sync schema.
 */
import { SUB_TO_PACK, PACK_LABELS } from "./bienestar-packs-v1.mjs";
import { BIENESTAR_SUB_EXTRA } from "./bienestar-sub-extra-fields.mjs";
import { mergeEnrichmentV2 } from "./bienestar-sub-enrichment-v2.mjs";
import {
  mergeHideAdultLeaks,
  COLABORACIONES_COMERCIALES_OPTIONS,
} from "./registro-cross-sector-policy.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Terapia corporal / manual",
    blockHint: "Modalidades, duración y contraindicaciones informativas — sin claims médicos.",
    aliasPlaceholder: "Ej. Luna Terapias · Guadalajara",
    deltaFields: ["modalidadesTerapia", "duracionSesionMinutos", "contraindicacionesGenerales", "atencionDomicilio"],
    obligatoriosDelta: ["modalidadesTerapia", "duracionSesionMinutos", "contraindicacionesGenerales"],
    textosAyuda: {
      modalidadesTerapia: "Describe técnicas ofrecidas sin prometer curación ni diagnóstico.",
      contraindicacionesGenerales: "Información general; no sustituye consulta médica.",
    },
  },
  B: {
    blockTitle: "Movimiento / mente-cuerpo",
    blockHint: "Estilo, modalidad de clase y niveles — práctica orientativa, no clínica.",
    aliasPlaceholder: "Ej. Studio Vida · Yoga & Pilates",
    deltaFields: ["tipoPractica", "modalidadClase", "nivelesAtendidos"],
    obligatoriosDelta: ["tipoPractica", "modalidadClase", "nivelesAtendidos"],
    textosAyuda: {
      tipoPractica: "Linaje o estilo que impartes (Hatha, Vinyasa, Pilates clásico, etc.).",
    },
  },
  C: {
    blockTitle: "Centro / espacio holístico",
    blockHint: "Servicios del espacio e instalaciones — incluye geo en registro.",
    aliasPlaceholder: "Ej. Centro Holístico Armonía",
    deltaFields: ["serviciosCentro", "capacidadGrupo"],
    obligatoriosDelta: ["serviciosCentro", "capacidadGrupo", "geo"],
    textosAyuda: {
      serviciosCentro: "Marca todo lo que ofrece tu espacio físico.",
      capacidadGrupo: "Capacidad máxima simultánea en salón o temazcal.",
    },
  },
  D: {
    blockTitle: "Productos / tienda natural",
    blockHint: "Surtido presencial — sin catálogo de sustancias reguladas ni e-commerce.",
    aliasPlaceholder: "Ej. Tienda Natural Raíz",
    deltaFields: ["categoriasProductoBienestar", "surtidoPrincipal", "ventaPresencial"],
    obligatoriosDelta: ["categoriasProductoBienestar", "surtidoPrincipal"],
    textosAyuda: {
      categoriasProductoBienestar: "Categorías generales; no incluyas venta de sustancias reguladas.",
      surtidoPrincipal: "Describe en una línea tu surtido estrella.",
    },
  },
  D_NEGOCIO: {
    blockTitle: "Tienda natural (negocio presencial)",
    blockHint: "Venta en punto fijo — sin envíos ni catálogo de sustancias reguladas.",
    aliasPlaceholder: "Ej. Incienso & Resina MX",
    deltaFields: ["categoriasProductoBienestar", "surtidoPrincipal", "direccion", "horarioDetalle"],
    obligatoriosDelta: ["nombreComercial", "categoriasProductoBienestar", "surtidoPrincipal", "direccion", "horarioDetalle"],
    textosAyuda: {
      surtidoPrincipal: "Productos principales que vendes en mostrador.",
      direccion: "Zona o dirección pública del local.",
    },
  },
  E: {
    blockTitle: "Espiritualidad / lectura",
    blockHint: "Enfoque simbólico o espiritual — sin diagnóstico médico.",
    aliasPlaceholder: "Ej. Oráculo Luna · Lecturas",
    deltaFields: ["enfoqueEspiritual", "modalidadLectura"],
    obligatoriosDelta: ["enfoqueEspiritual", "modalidadLectura"],
    textosAyuda: {
      enfoqueEspiritual: "Orientación simbólica; no sustituye terapia clínica.",
    },
  },
  F: {
    blockTitle: "Coaching / desarrollo personal",
    blockHint: "Áreas de acompañamiento y modalidad — incluye certificaciones en base.",
    aliasPlaceholder: "Ej. Coach Ana · Propósito y hábitos",
    deltaFields: ["areaCoaching", "modalidadSesionCoaching"],
    obligatoriosDelta: ["areaCoaching", "modalidadSesionCoaching", "certificaciones"],
    textosAyuda: {
      areaCoaching: "Temas en los que acompañas (propósito, transiciones, hábitos).",
    },
  },
  G: {
    blockTitle: "Retiros / experiencias / ceremonias",
    blockHint: "Experiencias guiadas con fechas, lugar y cupo — sin venta de sustancias.",
    aliasPlaceholder: "Ej. Retiros Sol · Oaxaca",
    deltaFields: ["tipoExperiencia", "duracionExperiencia", "fechasExperiencia", "lugarExperiencia", "cupoMaximo"],
    obligatoriosDelta: ["tipoExperiencia", "fechasExperiencia", "lugarExperiencia", "cupoMaximo"],
    textosAyuda: {
      tipoExperiencia: "Retiro, taller o ceremonia guiada — consulta de fechas permitida.",
      fechasExperiencia: "Calendario fijo o ventana para solicitar información.",
    },
  },
  H: {
    blockTitle: "Experiencia ceremonial regulada",
    blockHint: "Solo ceremonias guiadas / retiros / consulta fechas. Prohibida venta o envío de sustancias.",
    aliasPlaceholder: "Ej. Guía ceremonial · consulta fechas",
    deltaFields: [
      "tipoExperienciaCeremonial", "acompanamientoCeremonial", "requisitosPrevios",
      "fechasCeremonia", "cupoCeremonia", "lugarCeremonia", "jurisdiccionDeclarada",
      "contraindicacionesObligatorias", "edadMinimaServicio", "disclaimerRegulado",
    ],
    obligatoriosDelta: [
      "disclaimerRegulado", "edadMinimaServicio", "jurisdiccionDeclarada",
      "contraindicacionesObligatorias", "tipoExperienciaCeremonial", "acompanamientoCeremonial",
      "requisitosPrevios", "fechasCeremonia", "cupoCeremonia", "lugarCeremonia",
    ],
    textosAyuda: {
      disclaimerRegulado: "Solo experiencias ceremoniales guiadas. Prohibida venta, envío o comercialización de sustancias.",
      contraindicacionesObligatorias: "Obligatorio declarar contraindicaciones; no prometer curación.",
      tipoExperienciaCeremonial: "Ceremonias guiadas, retiros o consulta de fechas — no venta de productos.",
    },
  },
};

/** Parches por subcategoriaId — títulos, placeholders y opciones específicas */
export const SUB_DELTA_PATCHES = {
  reiki: {
    blockTitle: "Reiki y sanación energética",
    aliasPlaceholder: "Ej. Luz Reiki · CDMX",
    fieldOptions: {
      modalidadesTerapia: ["Reiki Usui", "Karuna Reiki", "Reiki a distancia", "Reiki + cristales", "Otra modalidad"],
    },
    textosAyuda: { modalidadesTerapia: "Indica linaje o estilo Usui/Karuna. Sin prometer curación." },
  },
  biomagnetismo: {
    blockTitle: "Biomagnetismo / pares biomagnéticos",
    fieldOptions: {
      modalidadesTerapia: ["Pares biomagnéticos", "Seguimiento", "Sesión inicial", "Otra"],
    },
    textosAyuda: { contraindicacionesGenerales: "Declara si hay contraindicaciones conocidas; no es tratamiento médico." },
  },
  acupuntura: {
    blockTitle: "Acupuntura (practitioner holístico)",
    fieldOptions: {
      modalidadesTerapia: ["Acupuntura corporal", "Auricular", "Electroacupuntura", "Moxibustión", "Otra"],
    },
    textosAyuda: {
      modalidadesTerapia: "Si eres médico acupunturista, usa el formulario profesional de salud con cédula.",
    },
  },
  aromaterapia: {
    blockTitle: "Aromaterapia",
    fieldOptions: {
      modalidadesTerapia: ["Difusión", "Masaje con aceites", "Mezclas personalizadas", "Consulta olfativa", "Otra"],
    },
  },
  reflexologia: {
    blockTitle: "Reflexología podal / manual",
    fieldOptions: {
      modalidadesTerapia: ["Reflexología podal", "Reflexología de manos", "Facial", "Presión profunda", "Otra"],
    },
    textosAyuda: { atencionDomicilio: "Indica si visitas domicilio para sesiones." },
  },
  "masajes-holisticos": {
    blockTitle: "Masajes holísticos",
    fieldOptions: {
      modalidadesTerapia: ["Holístico integrador", "Con aceites esenciales", "Energético", "Craneal", "Otra"],
    },
  },
  "masajes-relajantes": {
    blockTitle: "Masajes relajantes",
    fieldOptions: {
      modalidadesTerapia: ["Sueco / relajante", "Con piedras calientes", "Aromaterapia", "Pareja", "Otra"],
    },
  },
  "masajes-terapeuticos": {
    blockTitle: "Masajes terapéuticos (no clínico)",
    fieldOptions: {
      modalidadesTerapia: ["Tejido profundo", "Deportivo", "Miofascial", "Trigger points", "Otra"],
    },
    textosAyuda: {
      contraindicacionesGenerales: "No sustituye fisioterapia médica; declara contraindicaciones.",
    },
  },
  "limpias-energeticas": {
    blockTitle: "Limpias energéticas",
    fieldOptions: {
      modalidadesTerapia: ["Limpia con hierbas", "Con copal/incienso", "Barrido energético", "Ritual guiado", "Otra"],
    },
  },
  "flores-de-bach": {
    blockTitle: "Flores de Bach",
    fieldOptions: {
      modalidadesTerapia: ["Consulta floral", "Mezcla personalizada", "Seguimiento", "Otra"],
    },
  },
  homeopatia: {
    blockTitle: "Homeopatía (orientativa)",
    textosAyuda: {
      modalidadesTerapia: "Si eres médico homeópata, registra en salud con cédula profesional.",
    },
  },
  "medicina-tradicional-china": {
    blockTitle: "Medicina tradicional china (MTC)",
    fieldOptions: {
      modalidadesTerapia: ["MTC integral", "Herbolaria china", "Tuina", "Ventosas", "Otra"],
    },
  },
  naturopatia: {
    blockTitle: "Naturopatía",
    fieldOptions: {
      modalidadesTerapia: ["Consulta naturopática", "Plan de hábitos", "Fitoterapia orientativa", "Otra"],
    },
  },
  "medicina-natural": {
    blockTitle: "Medicina natural",
    fieldOptions: {
      modalidadesTerapia: ["Consulta holística", "Fitoterapia", "Nutrición natural", "Otra"],
    },
  },
  "terapias-holisticas": {
    blockTitle: "Terapias holísticas integrativas",
    fieldOptions: {
      modalidadesTerapia: ["Integrativa", "Corporal", "Energética", "Emocional", "Otra"],
    },
  },
  "terapias-energeticas": {
    blockTitle: "Terapias energéticas",
    fieldOptions: {
      modalidadesTerapia: ["Canalización", "Armonización", "Barrido", "Cristales", "Otra"],
    },
  },
  "terapias-alternativas": {
    blockTitle: "Terapias alternativas",
    fieldOptions: {
      modalidadesTerapia: ["Alternativa integral", "Manual", "Vibracional", "Otra"],
    },
  },
  sonoterapia: {
    blockTitle: "Sonoterapia / cuencos",
    blockHint: "Instrumentos, duración y modalidad de sesión sonora.",
    fieldOptions: { tipoPractica: ["Cuencos tibetanos", "Gong", "Diapasones", "Voz / mantras", "Otra"] },
  },
  ayurveda: {
    blockTitle: "Ayurveda / mente-cuerpo",
    fieldOptions: { tipoPractica: ["Consulta ayurvédica", "Masaje Abhyanga", "Shirodhara", "Yoga ayurvédico", "Otra"] },
  },
  yoga: {
    blockTitle: "Yoga",
    fieldOptions: { tipoPractica: ["Hatha", "Vinyasa", "Kundalini", "Yin", "Restaurativo", "Otra"] },
  },
  pilates: {
    blockTitle: "Pilates",
    fieldOptions: { tipoPractica: ["Mat", "Reformer", "Clínico orientativo", "Grupal", "Otra"] },
  },
  meditacion: {
    blockTitle: "Meditación guiada",
    fieldOptions: { tipoPractica: ["Mindfulness", "Vipassana", "Guiada", "Trascendental orientada", "Otra"] },
  },
  breathwork: {
    blockTitle: "Breathwork / respiración consciente",
    fieldOptions: { tipoPractica: ["Holotrópico orientado", "Wim Hof", "Pranayama", "Integración", "Otra"] },
  },
  temazcales: {
    blockTitle: "Temazcal / espacio ceremonial",
    blockHint: "Instalaciones, capacidad y servicios del temazcal.",
    fieldOptions: {
      serviciosCentro: ["Temazcal", "Sweat lodge", "Ceremonias", "Talleres", "Hospedaje cercano", "Estacionamiento"],
    },
  },
  "centros-holisticos": { blockTitle: "Centro holístico" },
  "centros-de-bienestar": { blockTitle: "Centro de bienestar" },
  "centros-de-meditacion": {
    blockTitle: "Centro de meditación",
    fieldOptions: { serviciosCentro: ["Meditación guiada", "Retiros cortos", "Salas silencio", "Talleres", "Grupos"] },
  },
  "centros-de-yoga": {
    blockTitle: "Centro / estudio de yoga",
    fieldOptions: { serviciosCentro: ["Clases regulares", "Profesorado", "Talleres", "Retiros", "Mat rental"] },
  },
  "centros-de-sanacion": {
    blockTitle: "Centro de sanación",
    fieldOptions: { serviciosCentro: ["Terapias individuales", "Grupos", "Sanación energética", "Talleres"] },
  },
  herbolaria: {
    blockTitle: "Herbolaria / plantas medicinales",
    fieldOptions: {
      categoriasProductoBienestar: ["Hierbas sueltas", "Tinturas", "Tés", "Preparados artesanales", "Otros naturales"],
    },
  },
  herbolarios: { blockTitle: "Herbolario" },
  "tiendas-esotericas": {
    blockTitle: "Tienda esotérica",
    fieldOptions: {
      categoriasProductoBienestar: ["Cristales", "Tarot", "Velas", "Inciensos", "Amuletos", "Otros"],
    },
  },
  "productos-holisticos": { blockTitle: "Productos holísticos" },
  "productos-naturistas": { blockTitle: "Productos naturistas" },
  "suplementos-naturales": {
    blockTitle: "Suplementos naturales",
    textosAyuda: { categoriasProductoBienestar: "No prometas efectos curativos ni sustitución de medicamento." },
  },
  naturistas: { blockTitle: "Tienda naturista" },
  "venta-de-inciensos": {
    blockTitle: "Venta de inciensos (local)",
    aliasPlaceholder: "Ej. Incienso Artesanal MX",
    fieldOptions: { categoriasProductoBienestar: ["Inciensos", "Resinas", "Sahumerios", "Carbones", "Otros"] },
    surtidoPlaceholder: "Ej. Copal, palo santo, incienso artesanal",
  },
  "venta-de-aceites-esenciales": {
    blockTitle: "Venta de aceites esenciales (local)",
    fieldOptions: { categoriasProductoBienestar: ["Aceites esenciales", "Mezclas", "Difusores", "Roll-on", "Otros"] },
    surtidoPlaceholder: "Ej. Aceites puros y blends aromaterapia",
  },
  "cosmetica-natural": {
    blockTitle: "Cosmética natural",
    fieldOptions: { categoriasProductoBienestar: ["Cuidado facial", "Corporal", "Capilar", "Jabones", "Otros"] },
  },
  "velas-esotericas": {
    blockTitle: "Velas esotéricas",
    fieldOptions: { categoriasProductoBienestar: ["Velas ritual", "Velas aromáticas", "Veladoras", "Otros"] },
  },
  sahumerios: {
    blockTitle: "Sahumerios",
    fieldOptions: { categoriasProductoBienestar: ["Sahumerios", "Inciensos", "Resinas", "Otros"] },
  },
  tarot: {
    blockTitle: "Tarot / oráculo",
    fieldOptions: { enfoqueEspiritual: undefined },
    textosAyuda: { enfoqueEspiritual: "Describe tu enfoque (Tarot Rider, Marsella, oráculos). Orientación simbólica." },
  },
  astrologia: {
    blockTitle: "Astrología",
    textosAyuda: { enfoqueEspiritual: "Carta natal, tránsitos, sin predicciones absolutas ni diagnóstico." },
  },
  numerologia: { blockTitle: "Numerología" },
  "lectura-de-cartas": { blockTitle: "Lectura de cartas" },
  "lectura-de-runas": { blockTitle: "Lectura de runas" },
  "feng-shui": {
    blockTitle: "Feng Shui",
    textosAyuda: { enfoqueEspiritual: "Consultoría espacial simbólica; no sustituye arquitectura profesional." },
  },
  cristaloterapia: {
    blockTitle: "Cristaloterapia",
    textosAyuda: { enfoqueEspiritual: "Uso simbólico de cristales; sin claims terapéuticos médicos." },
  },
  "registros-akashicos": {
    blockTitle: "Registros Akáshicos",
    textosAyuda: { enfoqueEspiritual: "Lectura simbólica de registros; orientación espiritual no clínica." },
  },
  "coaching-de-vida": {
    blockTitle: "Coaching de vida",
    textosAyuda: { areaCoaching: "Propósito, metas, transiciones, hábitos — no terapia clínica." },
  },
  "coaching-espiritual": { blockTitle: "Coaching espiritual" },
  "desarrollo-personal": { blockTitle: "Desarrollo personal" },
  "crecimiento-personal": { blockTitle: "Crecimiento personal" },
  "retiros-espirituales": {
    blockTitle: "Retiros espirituales",
    fieldOptions: {
      tipoExperiencia: [
        { value: "retiro", label: "Retiro" },
        { value: "inmersion", label: "Inmersión" },
        { value: "consulta_fechas", label: "Consultar fechas" },
      ],
    },
  },
  "turismo-espiritual": {
    blockTitle: "Turismo espiritual",
    textosAyuda: { lugarExperiencia: "Destino o región del recorrido / experiencia." },
  },
  "cacao-ceremonial": {
    blockTitle: "Cacao ceremonial",
    blockHint: "Ceremonia guiada de cacao — sin venta de productos ni envíos.",
    textosAyuda: {
      tipoExperiencia: "Ceremonia de cacao guiada; declara fechas y cupo.",
    },
  },
  "medicina-ancestral": {
    blockTitle: "Medicina ancestral (experiencia regulada)",
    textosAyuda: {
      requisitosPrevios: "Ayuno, intención, experiencia previa — sé explícito.",
    },
  },
  chamanismo: { blockTitle: "Chamanismo (experiencia regulada)" },
  "ceremonias-tradicionales": { blockTitle: "Ceremonias tradicionales (regulada)" },
  "ceremonias-ayahuasca-rape-plantas-de-poder": {
    blockTitle: "Ceremonias guiadas (plantas de poder)",
    blockHint: "Solo experiencia ceremonial. Prohibida venta, envío o comercialización.",
    textosAyuda: {
      disclaimerRegulado: "Aceptación obligatoria: no venta ni distribución de sustancias.",
      fechasCeremonia: "Calendario o solicitud de información — nunca precio por dosis.",
    },
  },
};

export const RETAIL_NEGOCIO_SUBS = ["venta-de-inciensos", "venta-de-aceites-esenciales"];

function mergeDelta(subId, nombre, pack, negocioRetail) {
  const baseKey = negocioRetail && pack === "D" ? "D_NEGOCIO" : pack;
  const base = PACK_DELTA_BASE[baseKey] || PACK_DELTA_BASE.A;
  const patch = SUB_DELTA_PATCHES[subId] || {};
  const extra = BIENESTAR_SUB_EXTRA[subId] || {};
  const mergedFieldOptions = {
    ...(base.fieldOptions || {}),
    ...(patch.fieldOptions || {}),
    ...(extra.fieldOptions || {}),
  };
  let extraFields = [...new Set([...(extra.extraFields || []), ...(patch.extraFields || [])])];
  let hideFields = [...new Set([...(extra.hideFields || []), ...(patch.hideFields || [])])];
  const obligSet = new Set([
    ...(patch.obligatoriosDelta || base.obligatoriosDelta || []),
    ...(extra.obligatoriosExtra || []),
  ]);

  let profile = mergeEnrichmentV2(
    {
      blockHint: extra.blockHint || patch.blockHint || base.blockHint || "",
      fieldLabels: {
        ...(base.fieldLabels || {}),
        ...(patch.fieldLabels || {}),
        ...(extra.fieldLabels || {}),
      },
      textosAyuda: { ...(base.textosAyuda || {}), ...(patch.textosAyuda || {}), ...(extra.textosAyuda || {}) },
      extraFields,
      hideFields,
    },
    subId
  );

  hideFields = mergeHideAdultLeaks(profile.hideFields || hideFields);
  extraFields = profile.extraFields || extraFields;

  if (pack !== "H" && !negocioRetail) {
    extraFields = [...new Set([...extraFields, "colaboracionesComerciales", "diferenciadorProfesional"])];
    mergedFieldOptions.colaboracionesComerciales = COLABORACIONES_COMERCIALES_OPTIONS;
  }

  const delta = {
    canonSubcategoriaId: subId,
    deltaPack: pack,
    nombre,
    packLabel: PACK_LABELS[pack] || pack,
    blockTitle: extra.blockTitle || patch.blockTitle || nombre,
    blockHint: profile.blockHint || "",
    aliasPlaceholder: extra.aliasPlaceholder || patch.aliasPlaceholder || base.aliasPlaceholder || "",
    deltaFields: patch.deltaFields || base.deltaFields || [],
    extraFields: extraFields.length ? extraFields : undefined,
    hideFields: hideFields.length ? hideFields : undefined,
    obligatoriosDelta: [...obligSet],
    textosAyuda: profile.textosAyuda || {},
    fieldLabels: profile.fieldLabels || {},
    fieldOptions: Object.keys(mergedFieldOptions).length ? mergedFieldOptions : undefined,
    surtidoPlaceholder: extra.surtidoPlaceholder || patch.surtidoPlaceholder || "",
  };
  if (negocioRetail) delta.negocioRetail = true;
  return delta;
}

/** Genera SUB_CANON_META + SUB_DELTAS para las 60 subs del mapa */
export function buildBienestarSubDeltas(catalogRows) {
  const SUB_CANON_META = {};
  const SUB_DELTAS = {};
  for (const row of catalogRows) {
    const subId = row.subcategoriaId;
    const pack = SUB_TO_PACK[subId];
    if (!pack) continue;
    const negocioRetail = RETAIL_NEGOCIO_SUBS.includes(subId);
    const delta = mergeDelta(subId, row.subcategoria || row.nombre || subId, pack, negocioRetail);
    SUB_CANON_META[subId] = {
      canonSubcategoriaId: subId,
      nombre: delta.nombre,
      deltaPack: pack,
      packLabel: delta.packLabel,
      negocioRetail,
    };
    SUB_DELTAS[subId] = delta;
  }
  return { SUB_CANON_META, SUB_DELTAS };
}
