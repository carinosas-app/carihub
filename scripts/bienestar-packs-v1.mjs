/**
 * MP-BIENESTAR-DELTAS-V1 — packs A–H, campos y mapa subcategoría → pack.
 * Fuente única para apply-bienestar-deltas-v1.mjs y QA schema.
 */

export const PACK_IDS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const PACK_LABELS = {
  A: "Terapia corporal / manual",
  B: "Movimiento / mente-cuerpo",
  C: "Centro / espacio holístico",
  D: "Productos / tienda natural",
  E: "Espiritualidad / lectura",
  F: "Coaching / desarrollo personal",
  G: "Retiros / experiencias / ceremonias",
  H: "Sensible / regulada",
};

/** Campos nuevos en meta.fieldRegistry (persona_independiente) */
export const BIENESTAR_FIELD_REGISTRY = {
  modalidadesTerapia: {
    id: "modalidadesTerapia",
    label: "Modalidades de terapia",
    tipo: "checklist",
    iaCopy: true,
  },
  duracionSesionMinutos: {
    id: "duracionSesionMinutos",
    label: "Duración típica de sesión",
    tipo: "enum",
    opciones: ["30_min", "45_min", "60_min", "90_min", "120_min", "variable"],
  },
  contraindicacionesGenerales: {
    id: "contraindicacionesGenerales",
    label: "Contraindicaciones generales (informativas)",
    tipo: "textarea",
    maxLength: 800,
    iaCopy: true,
  },
  tipoPractica: {
    id: "tipoPractica",
    label: "Estilo o linaje de práctica",
    tipo: "tags",
    iaCopy: true,
  },
  nivelesAtendidos: {
    id: "nivelesAtendidos",
    label: "Niveles atendidos",
    tipo: "enum",
    opciones: ["principiante", "intermedio", "avanzado", "todos"],
  },
  modalidadClase: {
    id: "modalidadClase",
    label: "Modalidad de clase",
    tipo: "enum",
    opciones: ["presencial", "online", "hibrido"],
  },
  serviciosCentro: {
    id: "serviciosCentro",
    label: "Servicios del espacio",
    tipo: "checklist",
    iaCopy: true,
  },
  capacidadGrupo: {
    id: "capacidadGrupo",
    label: "Capacidad máxima (personas)",
    tipo: "number",
    min: 1,
    max: 500,
  },
  categoriasProductoBienestar: {
    id: "categoriasProductoBienestar",
    label: "Categorías de productos",
    tipo: "tags",
    iaCopy: true,
  },
  surtidoPrincipal: {
    id: "surtidoPrincipal",
    label: "Surtido principal",
    tipo: "tags",
    iaCopy: true,
  },
  ventaPresencial: {
    id: "ventaPresencial",
    label: "Venta presencial en punto fijo",
    tipo: "boolean",
  },
  enfoqueEspiritual: {
    id: "enfoqueEspiritual",
    label: "Enfoque espiritual",
    tipo: "textarea",
    maxLength: 600,
    iaCopy: true,
  },
  modalidadLectura: {
    id: "modalidadLectura",
    label: "Modalidad de lectura",
    tipo: "enum",
    opciones: ["presencial", "online", "ambas"],
  },
  areaCoaching: {
    id: "areaCoaching",
    label: "Áreas de acompañamiento",
    tipo: "tags",
    iaCopy: true,
  },
  modalidadSesionCoaching: {
    id: "modalidadSesionCoaching",
    label: "Modalidad de sesión",
    tipo: "enum",
    opciones: ["individual", "grupal", "mixta"],
  },
  tipoExperiencia: {
    id: "tipoExperiencia",
    label: "Tipo de experiencia",
    tipo: "enum",
    opciones: ["retiro", "ceremonia", "taller", "inmersion", "consulta_fechas"],
  },
  duracionExperiencia: {
    id: "duracionExperiencia",
    label: "Duración de la experiencia",
    tipo: "text",
    maxLength: 120,
  },
  cupoMaximo: {
    id: "cupoMaximo",
    label: "Cupo máximo",
    tipo: "number",
    min: 1,
    max: 200,
  },
  fechasExperiencia: {
    id: "fechasExperiencia",
    label: "Fechas o calendario",
    tipo: "text",
    maxLength: 300,
  },
  lugarExperiencia: {
    id: "lugarExperiencia",
    label: "Lugar de la experiencia",
    tipo: "text",
    maxLength: 200,
  },
  disclaimerRegulado: {
    id: "disclaimerRegulado",
    label: "Acepto el aviso legal y limitaciones del servicio",
    tipo: "boolean",
    privado: false,
  },
  edadMinimaServicio: {
    id: "edadMinimaServicio",
    label: "Edad mínima del participante",
    tipo: "number",
    min: 18,
    max: 18,
  },
  jurisdiccionDeclarada: {
    id: "jurisdiccionDeclarada",
    label: "Jurisdicción donde opera la experiencia",
    tipo: "text",
    maxLength: 120,
  },
  contraindicacionesObligatorias: {
    id: "contraindicacionesObligatorias",
    label: "Contraindicaciones obligatorias",
    tipo: "richtext",
    maxLength: 1200,
    iaCopy: true,
  },
  tipoExperienciaCeremonial: {
    id: "tipoExperienciaCeremonial",
    label: "Tipo de experiencia ceremonial",
    tipo: "enum",
    opciones: [
      "ceremonia_guiada",
      "centro_retiro",
      "experiencia_ceremonial",
      "facilitador_guia",
      "consulta_fechas",
    ],
  },
  acompanamientoCeremonial: {
    id: "acompanamientoCeremonial",
    label: "Acompañamiento ofrecido",
    tipo: "checklist",
    opciones: ["antes", "durante", "despues"],
  },
  requisitosPrevios: {
    id: "requisitosPrevios",
    label: "Requisitos previos",
    tipo: "textarea",
    maxLength: 800,
    iaCopy: true,
  },
  fechasCeremonia: {
    id: "fechasCeremonia",
    label: "Fechas / cupo / calendario",
    tipo: "text",
    maxLength: 300,
  },
  cupoCeremonia: {
    id: "cupoCeremonia",
    label: "Cupo disponible",
    tipo: "number",
    min: 1,
    max: 200,
  },
  lugarCeremonia: {
    id: "lugarCeremonia",
    label: "Lugar de la ceremonia o retiro",
    tipo: "text",
    maxLength: 200,
  },
};

export const PACK_H_PROHIBIDOS = [
  "catalogoProductos",
  "envioDomicilio",
  "tiendaOnline",
  "stockProductos",
  "dosisSustancia",
  "precioPorSustancia",
  "carritoEcommerce",
  "categoriasProductoBienestar",
  "surtidoPrincipal",
  "ventaPresencial",
];

const PACK_H_COHERENCIA = [
  {
    id: "PACK_H_DISCLAIMER",
    requiere: ["disclaimerRegulado"],
    severidad: "error",
    mensaje: "Debes aceptar el aviso legal para experiencias sensibles.",
  },
  {
    id: "PACK_H_JURISDICCION",
    requiere: ["jurisdiccionDeclarada"],
    severidad: "error",
  },
  {
    id: "PACK_H_CONTRAINDICACIONES",
    requiere: ["contraindicacionesObligatorias"],
    severidad: "error",
  },
  {
    id: "PACK_H_EDAD",
    requiere: ["edadMinimaServicio"],
    severidad: "error",
    mensaje: "Edad mínima 18 años.",
  },
  {
    id: "PACK_H_EXPERIENCIA",
    requiere: ["tipoExperienciaCeremonial", "fechasCeremonia", "lugarCeremonia"],
    severidad: "error",
  },
];

/** Plantillas plantillasArquetipo.* */
export function buildPackPlantillas() {
  const packs = {};

  packs.bienestar_pack_a = {
    heredaDe: "persona_servicio_bienestar",
    deltaPack: "A",
    camposPublicosPerfil: ["modalidadesTerapia", "duracionSesionMinutos"],
    obligatoriosExtra: ["modalidadesTerapia", "duracionSesionMinutos", "contraindicacionesGenerales"],
    keywordsIA: ["terapia manual", "corporal", "sesión"],
    textosAyuda: {
      contraindicacionesGenerales: "Información general; no sustituye consulta médica ni promete curación.",
      modalidadesTerapia: "Describe técnicas ofrecidas sin claims médicos.",
    },
  };

  packs.bienestar_pack_b = {
    heredaDe: "persona_servicio_bienestar",
    deltaPack: "B",
    camposPublicosPerfil: ["tipoPractica", "modalidadClase", "nivelesAtendidos"],
    obligatoriosExtra: ["tipoPractica", "modalidadClase", "nivelesAtendidos"],
    keywordsIA: ["movimiento", "mente-cuerpo", "clase", "práctica"],
  };

  packs.bienestar_pack_c = {
    heredaDe: "persona_servicio_bienestar",
    deltaPack: "C",
    camposPublicosPerfil: ["serviciosCentro", "capacidadGrupo"],
    obligatoriosExtra: ["serviciosCentro", "capacidadGrupo", "geo"],
    keywordsIA: ["centro", "espacio holístico", "instalaciones"],
  };

  packs.bienestar_pack_d = {
    heredaDe: "persona_servicio_bienestar",
    deltaPack: "D",
    camposPublicosPerfil: ["categoriasProductoBienestar", "surtidoPrincipal", "ventaPresencial"],
    obligatoriosExtra: ["categoriasProductoBienestar", "surtidoPrincipal"],
    keywordsIA: ["productos naturales", "tienda", "surtido"],
    textosAyuda: {
      categoriasProductoBienestar: "Categorías generales; no incluyas venta de sustancias reguladas.",
    },
  };

  packs.bienestar_pack_e = {
    heredaDe: "persona_servicio_bienestar",
    deltaPack: "E",
    camposPublicosPerfil: ["enfoqueEspiritual", "modalidadLectura"],
    obligatoriosExtra: ["enfoqueEspiritual", "modalidadLectura"],
    keywordsIA: ["espiritualidad", "lectura", "guía simbólica"],
    textosAyuda: {
      enfoqueEspiritual: "Orientación simbólica o espiritual; sin diagnóstico médico.",
    },
  };

  packs.bienestar_pack_f = {
    heredaDe: "persona_bienestar_individual",
    deltaPack: "F",
    camposPublicosPerfil: ["areaCoaching", "modalidadSesionCoaching"],
    obligatoriosExtra: ["areaCoaching", "modalidadSesionCoaching", "certificaciones"],
    keywordsIA: ["coaching", "desarrollo personal", "acompañamiento"],
  };

  packs.bienestar_pack_g = {
    heredaDe: "persona_servicio_bienestar",
    deltaPack: "G",
    camposPublicosPerfil: ["tipoExperiencia", "duracionExperiencia", "fechasExperiencia", "lugarExperiencia", "cupoMaximo"],
    obligatoriosExtra: ["tipoExperiencia", "fechasExperiencia", "lugarExperiencia", "cupoMaximo"],
    keywordsIA: ["retiro", "experiencia", "ceremonia informativa", "cupo"],
    textosAyuda: {
      tipoExperiencia: "Retiros, talleres o ceremonias guiadas sin venta de sustancias.",
    },
  };

  packs.bienestar_pack_h = {
    heredaDe: "persona_servicio_bienestar",
    deltaPack: "H",
    sensible: true,
    regulada: true,
    requiresAdminReview: true,
    soloExperienciaCeremonial: true,
    nivelRevisionAdmin: "alta",
    camposProhibidos: PACK_H_PROHIBIDOS.slice(),
    camposPublicosPerfil: [
      "tipoExperienciaCeremonial",
      "acompanamientoCeremonial",
      "requisitosPrevios",
      "fechasCeremonia",
      "cupoCeremonia",
      "lugarCeremonia",
    ],
    obligatoriosExtra: [
      "disclaimerRegulado",
      "edadMinimaServicio",
      "jurisdiccionDeclarada",
      "contraindicacionesObligatorias",
      "tipoExperienciaCeremonial",
      "acompanamientoCeremonial",
      "requisitosPrevios",
      "fechasCeremonia",
      "cupoCeremonia",
      "lugarCeremonia",
    ],
    coherenciaExtra: PACK_H_COHERENCIA,
    keywordsIA: ["ceremonia guiada", "facilitador", "retiro", "consulta fechas"],
    textosAyuda: {
      disclaimerRegulado:
        "Solo experiencias ceremoniales guiadas. Prohibida venta, envío o comercialización de sustancias.",
      contraindicacionesObligatorias: "Obligatorio declarar contraindicaciones; no prometer curación.",
      tipoExperienciaCeremonial: "Ceremonias guiadas, retiros o consulta de fechas — no venta de productos.",
    },
  };

  return packs;
}

/** Subcategorías nuevas Fase 0 */
export const NEW_SUBCATEGORIAS = [
  {
    subcategoriaId: "ceremonias-ayahuasca-rape-plantas-de-poder",
    nombre: "Ceremonias de Ayahuasca, Rapé y Plantas de Poder",
    pack: "H",
  },
  { subcategoriaId: "cacao-ceremonial", nombre: "Cacao Ceremonial", pack: "G" },
  { subcategoriaId: "reflexologia", nombre: "Reflexología", pack: "A" },
  { subcategoriaId: "registros-akashicos", nombre: "Registros Akáshicos", pack: "E" },
  { subcategoriaId: "cosmetica-natural", nombre: "Cosmética Natural", pack: "D" },
  { subcategoriaId: "velas-esotericas", nombre: "Velas Esotéricas", pack: "D" },
  { subcategoriaId: "sahumerios", nombre: "Sahumerios", pack: "D" },
];

export const RETAIL_FIX_IDS = ["venta-de-inciensos", "venta-de-aceites-esenciales"];

/** Clasificación canónica retail bienestar — usada por integrar-catalogo-expandido.mjs */
export function isBienestarRetailVenta(sectorId, nombre, subcategoriaId) {
  if (sectorId !== "bienestar") return false;
  if (RETAIL_FIX_IDS.includes(subcategoriaId)) return true;
  return String(nombre || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .startsWith("venta de");
}

export const BIENESTAR_RETAIL_NEGOCIO_ARQUETIPO = "negocio_comercio";

export function bienestarRetailNegocioPackExtras() {
  return {
    fotos: 5,
    mapa: true,
    admin: "media",
    obs: "Retail bienestar — negocio_comercio (MP-BIENESTAR-DELTAS-V1); NO negocio_inmobiliario",
  };
}

/** Mapa completo subcategoriaId → pack A–H */
export const SUB_TO_PACK = {
  temazcales: "C",
  "centros-holisticos": "C",
  "centros-de-bienestar": "C",
  "centros-de-meditacion": "C",
  "centros-de-yoga": "C",
  "centros-de-sanacion": "C",
  "retiros-espirituales": "G",
  "turismo-espiritual": "G",
  "medicina-ancestral": "H",
  chamanismo: "H",
  "ceremonias-tradicionales": "H",
  "terapias-holisticas": "A",
  reiki: "A",
  biomagnetismo: "A",
  acupuntura: "A",
  aromaterapia: "A",
  sonoterapia: "B",
  "terapias-energeticas": "A",
  "terapias-alternativas": "A",
  "medicina-natural": "A",
  naturopatia: "A",
  herbolaria: "D",
  ayurveda: "B",
  "medicina-tradicional-china": "A",
  "flores-de-bach": "A",
  homeopatia: "A",
  "masajes-holisticos": "A",
  "masajes-relajantes": "A",
  "masajes-terapeuticos": "A",
  yoga: "B",
  pilates: "B",
  meditacion: "B",
  breathwork: "B",
  "coaching-de-vida": "F",
  "coaching-espiritual": "F",
  "desarrollo-personal": "F",
  "crecimiento-personal": "F",
  tarot: "E",
  astrologia: "E",
  numerologia: "E",
  "lectura-de-cartas": "E",
  "lectura-de-runas": "E",
  "feng-shui": "E",
  "limpias-energeticas": "A",
  cristaloterapia: "E",
  "tiendas-esotericas": "D",
  "productos-holisticos": "D",
  "productos-naturistas": "D",
  "suplementos-naturales": "D",
  herbolarios: "D",
  naturistas: "D",
  "venta-de-inciensos": "D",
  "venta-de-aceites-esenciales": "D",
  "ceremonias-ayahuasca-rape-plantas-de-poder": "H",
  "cacao-ceremonial": "G",
  reflexologia: "A",
  "registros-akashicos": "E",
  "cosmetica-natural": "D",
  "velas-esotericas": "D",
  "velas-aromaticas": "D",
  sahumerios: "D",
};

export const PACK_H_SUBS = new Set(
  ["medicina-ancestral", "chamanismo", "ceremonias-tradicionales", "ceremonias-ayahuasca-rape-plantas-de-poder"]
);

export const COACHING_SUBS = new Set([
  "coaching-de-vida",
  "coaching-espiritual",
  "desarrollo-personal",
  "crecimiento-personal",
]);

export function packPlantillaKey(pack) {
  return `bienestar_pack_${pack.toLowerCase()}`;
}

export function arquetipoForPack(pack, subId) {
  if (COACHING_SUBS.has(subId)) return packPlantillaKey("F");
  return packPlantillaKey(pack);
}
