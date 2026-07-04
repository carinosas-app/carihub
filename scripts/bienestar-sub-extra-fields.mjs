/**
 * MP-BIENESTAR-DELTAS-V2 — campos extra por subcategoría (60 subs).
 */
export const SUB_EXTRA_PROFILES = {
  reiki: {
    blockTitle: "Reiki y sanación energética",
    aliasPlaceholder: "Ej. Luz Reiki · CDMX",
    extraFields: ["modalidadSesionEnergetica", "certificacionReiki"],
    obligatoriosExtra: ["modalidadSesionEnergetica"],
    fieldOptions: {
      modalidadesTerapia: ["Reiki Usui", "Karuna Reiki", "Reiki a distancia", "Reiki + cristales", "Otra modalidad"],
      modalidadSesionEnergetica: [
        { value: "presencial", label: "Presencial en consultorio / espacio" },
        { value: "online", label: "Sesión en línea / a distancia" },
        { value: "hibrido", label: "Presencial y en línea" },
      ],
    },
  },
  yoga: {
    blockTitle: "Yoga",
    aliasPlaceholder: "Ej. Studio Vida · Hatha & Vinyasa",
    extraFields: ["formatoClaseYoga", "estilosYogaDetalle"],
    obligatoriosExtra: ["formatoClaseYoga"],
    fieldOptions: {
      tipoPractica: ["Hatha", "Vinyasa", "Kundalini", "Yin", "Restaurativo", "Prenatal", "Otra"],
      formatoClaseYoga: ["Clase grupal", "Clase privada", "Ambas", "Retiros / talleres"],
    },
  },
  pilates: {
    blockTitle: "Pilates",
    extraFields: ["equipamientoPilates"],
    fieldOptions: {
      tipoPractica: ["Mat", "Reformer", "Cadillac", "Grupal", "Privado", "Otra"],
      equipamientoPilates: ["Mat", "Reformer", "Ambos", "Otros aparatos"],
    },
  },
  meditacion: {
    blockTitle: "Meditación guiada",
    extraFields: ["duracionMeditacion", "experienciaMeditacion"],
    fieldOptions: {
      tipoPractica: ["Mindfulness", "Vipassana", "Guiada", "Trascendental orientada", "Otra"],
      duracionMeditacion: ["30 min", "45 min", "60 min", "90 min", "Variable"],
    },
  },
  "coaching-de-vida": {
    blockTitle: "Coaching de vida",
    extraFields: ["areasCoachingDetalle", "modalidadSesionCoaching"],
    obligatoriosExtra: ["areasCoachingDetalle", "modalidadSesionCoaching"],
    fieldOptions: {
      areaCoaching: ["Propósito", "Carrera", "Hábitos", "Transiciones", "Relaciones", "Otro"],
      areasCoachingDetalle: ["Propósito", "Metas", "Productividad", "Balance vida-trabajo", "Autoestima", "Otro"],
      modalidadSesionCoaching: [
        { value: "presencial", label: "Presencial" },
        { value: "online", label: "Videollamada / en línea" },
        { value: "hibrido", label: "Híbrido" },
      ],
    },
  },
  "coaching-espiritual": {
    blockTitle: "Coaching espiritual",
    extraFields: ["modalidadSesionCoaching"],
    fieldOptions: {
      modalidadSesionCoaching: [
        { value: "presencial", label: "Presencial" },
        { value: "online", label: "En línea" },
        { value: "hibrido", label: "Híbrido" },
      ],
    },
  },
  temazcales: {
    blockTitle: "Temazcal / espacio ceremonial",
    extraFields: ["capacidadTemazcal", "serviciosTemazcal", "reservacionTemazcal"],
    obligatoriosExtra: ["capacidadTemazcal", "serviciosTemazcal"],
    fieldOptions: {
      serviciosCentro: ["Temazcal", "Sweat lodge", "Ceremonias", "Talleres", "Hospedaje cercano", "Estacionamiento"],
      serviciosTemazcal: ["Ceremonia grupal", "Ceremonia privada", "Ritual de apertura", "Integración post-ceremonia"],
      reservacionTemazcal: ["Cita previa obligatoria", "Eventos programados", "Ambos"],
    },
  },
  "masajes-terapeuticos": {
    blockTitle: "Masajes terapéuticos (no clínico)",
    extraFields: ["zonaCorporalMasaje", "modalidadSesionTerapia"],
    fieldOptions: {
      modalidadesTerapia: ["Tejido profundo", "Deportivo", "Miofascial", "Trigger points", "Otra"],
      zonaCorporalMasaje: ["Espalda", "Cuello", "Piernas", "Cuerpo completo", "Otro"],
      modalidadSesionTerapia: [
        { value: "presencial", label: "Presencial en consultorio / espacio" },
        { value: "domicilio", label: "Visita a domicilio del cliente" },
        { value: "hibrido", label: "Ambas modalidades" },
      ],
    },
  },
  tarot: {
    blockTitle: "Tarot / oráculo",
    extraFields: ["barajasTarot", "modalidadLecturaDetalle"],
    fieldOptions: {
      modalidadLectura: [
        { value: "presencial", label: "Presencial" },
        { value: "online", label: "Videollamada / en línea" },
        { value: "hibrido", label: "Ambas" },
      ],
      barajasTarot: ["Rider Waite", "Marsella", "Oráculos", "Otra baraja"],
    },
  },
};

import { mergeHideAdultLeaks } from "./registro-cross-sector-policy.mjs";
import { mergeEnrichmentV2 } from "./bienestar-sub-enrichment-v2.mjs";

for (const subId of Object.keys(SUB_EXTRA_PROFILES)) {
  SUB_EXTRA_PROFILES[subId] = mergeEnrichmentV2(SUB_EXTRA_PROFILES[subId], subId);
  const p = SUB_EXTRA_PROFILES[subId];
  p.hideFields = mergeHideAdultLeaks(p.hideFields || []);
  p.extraFields = [...new Set([...(p.extraFields || []), "colaboracionesComerciales"])];
  p.fieldOptions = p.fieldOptions || {};
  p.fieldOptions.colaboracionesComerciales = [
    { value: "si_activo", label: "Sí, colaboro activamente" },
    { value: "ocasional", label: "Ocasionalmente" },
    { value: "convenir", label: "A convenir" },
    { value: "no", label: "No por ahora" },
  ];
}

export const BIENESTAR_SUB_EXTRA = SUB_EXTRA_PROFILES;
