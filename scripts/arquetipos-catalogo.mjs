/**
 * Arquetipos canónicos del catálogo — fuente compartida para mapa y schemas.
 * Equivalencias legacy → canónico documentadas en config-registro-schema.meta.json
 */
import { SUB_TO_PACK, arquetipoForPack, RETAIL_FIX_IDS } from "./bienestar-packs-v1.mjs";
import { SUB_TO_PACK as EVENTOS_SUB_TO_PACK, packPlantillaKey as eventosPackKey } from "./eventos-packs-v1.mjs";
import { SUB_TO_PACK as GASTRONOMIA_SUB_TO_PACK, packPlantillaKey as gastronomiaPackKey } from "./gastronomia-packs-v1.mjs";

/** Nombres legacy (integración antigua) → canónico por defecto */
export const ARQUETIPOS_EQUIVALENCIA = {
  adulto_persona: "persona_acompanante",
  adulto_negocio: "negocio_venue",
  creador_contenido: "persona_creador",
  negocio_local: "negocio_servicios_local",
  persona_servicio: "persona_servicio_general",
  profesional_certificado: "profesional_salud",
};



export function gastronomiaPackForSub(subcategoriaId) {
  return GASTRONOMIA_SUB_TO_PACK[subcategoriaId] || null;
}

export function gastronomiaArquetipoForSub(subcategoriaId) {
  const pack = gastronomiaPackForSub(subcategoriaId);
  if (!pack) return null;
  return gastronomiaPackKey(pack);
}

export function eventosPackForSub(subcategoriaId) {
  return EVENTOS_SUB_TO_PACK[subcategoriaId] || null;
}

export function eventosArquetipoForSub(subcategoriaId) {
  const pack = eventosPackForSub(subcategoriaId);
  if (!pack) return null;
  return eventosPackKey(pack);
}

export function bienestarPackForSub(subcategoriaId) {
  return SUB_TO_PACK[subcategoriaId] || null;
}

export function bienestarArquetipoForSub(subcategoriaId) {
  const pack = bienestarPackForSub(subcategoriaId);
  if (!pack) return "persona_servicio_bienestar";
  return arquetipoForPack(pack, subcategoriaId);
}

export function sectorArquetipoIndependiente(sectorId, subcategoriaId) {
  if (sectorId === "bienestar") return bienestarArquetipoForSub(subcategoriaId);
  if (sectorId === "transporte") return "persona_servicio_movil";
  if (["hogar", "automotriz", "industria"].includes(sectorId)) return "persona_servicio_oficio";
  if (sectorId === "restaurantes") {
    const ga = gastronomiaArquetipoForSub(subcategoriaId);
    if (ga) return ga;
    return "persona_servicio_profesional";
  }
  if (sectorId === "eventos") {
    const ev = eventosArquetipoForSub(subcategoriaId);
    if (ev) return ev;
    return "persona_servicio_profesional";
  }
  if (["educacion", "tecnologia"].includes(sectorId)) return "persona_servicio_profesional";
  if (sectorId === "salud" && !subcategoriaId.includes("enfermer")) return "persona_servicio_salud_auxiliar";
  return "persona_servicio_general";
}

export function sectorArquetipoNegocio(sectorId, nombre, subcategoriaId) {
  const n = nombre.toLowerCase();
  if (sectorId === "bienestar" && subcategoriaId && RETAIL_FIX_IDS.includes(subcategoriaId)) return "negocio_comercio";
  if (sectorId === "bienestar" && (n.includes("venta de") || n.includes("tienda") || n.includes("productos"))) return "negocio_comercio";
  if (["hospital", "clinica", "laboratorio", "farmacia", "veterinaria"].some((k) => n.includes(k))) return "negocio_institucion";
  if (["hotel", "motel", "hospedaje", "retiro", "asil"].some((k) => n.includes(k))) return "negocio_hospedaje";
  if (["antro", "bar", "club", "teatro", "cine", "cabina"].some((k) => n.includes(k))) return "negocio_venue";
  if (["restaurante", "cafeteria", "taqueria", "marisqueria"].some((k) => n.includes(k))) return "negocio_alimentos";
  if (sectorId === "comercio" || n.includes("tienda") || n.includes("shop")) return "negocio_comercio";
  if (sectorId === "bienes-raices") return "negocio_inmobiliario";
  return "negocio_servicios_local";
}

export function sectorArquetipoProfesionista(sectorId, nombre) {
  const n = nombre.toLowerCase();
  if (sectorId === "mascotas" || n.includes("veterin")) return "profesional_veterinario";
  if (n.includes("psicolog") || n.includes("psiquiatr")) return "profesional_salud_mental";
  if (["abogad", "notari", "contad", "arquitect", "ingenier"].some((k) => n.includes(k))) return "profesional_tecnico_legal";
  return "profesional_salud";
}

/** Alineación explícita con config-registro-adultos-schema.json */
const ADULTOS_CANON = {
  sex_shop: { arquetipo: "negocio_retail", tipoPerfil: "negocio", res: "ResultCardNegocio", perf: "ProfileLayoutNegocio" },
  spa: { arquetipo: "negocio_bienestar", tipoPerfil: "negocio", res: "ResultCardNegocio", perf: "ProfileLayoutNegocio" },
  masajes: { arquetipo: "negocio_bienestar", tipoPerfil: "negocio", res: "ResultCardNegocio", perf: "ProfileLayoutNegocio" },
  club_sw: { arquetipo: "negocio_venue", tipoPerfil: "lugar", res: "ResultCardNegocio", perf: "ProfileLayoutVenue" },
  antro: { arquetipo: "negocio_venue", tipoPerfil: "lugar", res: "ResultCardNegocio", perf: "ProfileLayoutVenue" },
  antro_lgbt: { arquetipo: "negocio_venue", tipoPerfil: "lugar", res: "ResultCardNegocio", perf: "ProfileLayoutVenue" },
  hotel_motel: { arquetipo: "negocio_hospedaje", tipoPerfil: "lugar", res: "ResultCardNegocio", perf: "ProfileLayoutNegocio" },
  cabinas: { arquetipo: "negocio_venue", tipoPerfil: "lugar", res: "ResultCardNegocio", perf: "ProfileLayoutVenue" },
  cine_xxx: { arquetipo: "negocio_venue", tipoPerfil: "lugar", res: "ResultCardNegocio", perf: "ProfileLayoutVenue" },
  contenido: { arquetipo: "persona_creador", tipoPerfil: "creador", res: "ResultCardCreador", perf: "ProfileLayoutCreador" },
  stripper: { arquetipo: "persona_espectaculo", tipoPerfil: "espectaculo", res: "ResultCardEspectaculo", perf: "ProfileLayoutEspectaculo" },
  table_dance: { arquetipo: "persona_espectaculo", tipoPerfil: "espectaculo", res: "ResultCardEspectaculo", perf: "ProfileLayoutEspectaculo" },
  dominatrix: { arquetipo: "persona_dominatrix", tipoPerfil: "persona", res: "ResultCardAdultos", perf: "ProfileLayoutAdultos" },
  fetiche: { arquetipo: "persona_dominatrix", tipoPerfil: "persona", res: "ResultCardAdultos", perf: "ProfileLayoutAdultos" },
  sado: { arquetipo: "persona_dominatrix", tipoPerfil: "persona", res: "ResultCardAdultos", perf: "ProfileLayoutAdultos" },
  swinger: { arquetipo: "pareja_grupo", tipoPerfil: "pareja_grupo", res: "ResultCardPareja", perf: "ProfileLayoutPareja" },
  unicorns: { arquetipo: "pareja_grupo", tipoPerfil: "pareja_grupo", res: "ResultCardPareja", perf: "ProfileLayoutPareja" },
  cuckold_hotwife: { arquetipo: "pareja_grupo", tipoPerfil: "pareja_grupo", res: "ResultCardPareja", perf: "ProfileLayoutPareja" },
};

function adultSubCanonId(id) {
  return String(id || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function arquetipoAdultos(sub) {
  const id = sub.id;
  const canonKey = adultSubCanonId(id);
  const canon = ADULTOS_CANON[canonKey];
  if (canon) return canon;

  const n = sub.nombre.toLowerCase();
  if (canonKey.includes("contenido"))
    return { arquetipo: "persona_creador", tipoPerfil: "creador", res: "ResultCardCreador", perf: "ProfileLayoutCreador" };
  if (["stripper", "tabledance", "table_dance"].some((k) => canonKey.includes(k)))
    return { arquetipo: "persona_espectaculo", tipoPerfil: "espectaculo", res: "ResultCardEspectaculo", perf: "ProfileLayoutEspectaculo" };
  if (["dominatrix", "fetiche", "sado"].some((k) => canonKey.includes(k)))
    return { arquetipo: "persona_dominatrix", tipoPerfil: "persona", res: "ResultCardAdultos", perf: "ProfileLayoutAdultos" };
  if (["swinger", "unicorn", "cuckold"].some((k) => canonKey.includes(k)) && !canonKey.includes("club"))
    return { arquetipo: "pareja_grupo", tipoPerfil: "pareja_grupo", res: "ResultCardPareja", perf: "ProfileLayoutPareja" };
  if (["club_sw", "antro", "cabinas", "cine_xxx"].some((k) => canonKey === k || canonKey.includes(k)))
    return { arquetipo: "negocio_venue", tipoPerfil: "lugar", res: "ResultCardNegocio", perf: "ProfileLayoutVenue" };
  if (canonKey === "hotel_motel" || n.includes("hotel") && n.includes("motel"))
    return { arquetipo: "negocio_hospedaje", tipoPerfil: "lugar", res: "ResultCardNegocio", perf: "ProfileLayoutNegocio" };
  if (canonKey === "sex_shop" || n.includes("sex shop"))
    return { arquetipo: "negocio_retail", tipoPerfil: "negocio", res: "ResultCardNegocio", perf: "ProfileLayoutNegocio" };

  return { arquetipo: "persona_acompanante", tipoPerfil: "persona", res: "ResultCardAdultos", perf: "ProfileLayoutAdultos" };
}
