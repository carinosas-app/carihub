/**
 * MP-BIENESTAR-ENRICH-V2 — copy holístico, hints y labels por sub (60 subs).
 */
const BASE_AYUDA = {
  modalidadesTerapia: "Describe técnicas sin prometer curación ni diagnóstico médico.",
  contraindicacionesGenerales: "Información general; no sustituye consulta médica.",
  modalidadClase: "Presencial, en línea o híbrido — nunca hotel, motel ni modalidad escort.",
  modalidadSesionTerapia: "Consultorio, espacio propio o domicilio del cliente — no hotel ni motel.",
  modalidadLectura: "Presencial o en línea — orientación simbólica, no clínica.",
  enfoqueEspiritual: "Enfoque simbólico o espiritual; no sustituye terapia clínica.",
  colaboracionesComerciales: "¿Colaboras con centros, terapeutas o marcas en eventos o proyectos?",
  diferenciadorProfesional: "Ej. Sesiones bilingües · Espacio acogedor · Primera sesión orientativa",
  categoriasProductoBienestar: "Categorías generales; sin venta de sustancias reguladas ni envíos.",
};

function enrich(blockHint, extra = {}) {
  return {
    blockHint,
    fieldLabels: extra.fieldLabels || {},
    textosAyuda: { ...BASE_AYUDA, ...(extra.textosAyuda || {}) },
    extraFields: extra.extraFields,
  };
}

/** @type {Record<string, object>} */
export const SUB_ENRICHMENT_V2 = {
  reiki: enrich("Reiki y sanación energética — linaje, modalidad y certificación.", {
    fieldLabels: { modalidadesTerapia: "Estilos de Reiki que ofreces" },
  }),
  biomagnetismo: enrich("Biomagnetismo y pares biomagnéticos — sesión inicial y seguimiento.", {
    fieldLabels: { modalidadesTerapia: "Técnicas biomagnéticas" },
  }),
  acupuntura: enrich("Acupuntura holística — si eres médico acupunturista, usa registro de salud con cédula.", {
    fieldLabels: { modalidadesTerapia: "Modalidades de acupuntura" },
  }),
  aromaterapia: enrich("Aromaterapia — difusión, masajes con aceites y consulta olfativa.", {
    fieldLabels: { modalidadesTerapia: "Servicios de aromaterapia" },
  }),
  reflexologia: enrich("Reflexología podal o manual — zonas que trabajas y modalidad.", {
    fieldLabels: { modalidadesTerapia: "Tipos de reflexología" },
  }),
  "masajes-holisticos": enrich("Masajes holísticos integradores — aceites, energía y técnicas manuales.", {
    fieldLabels: { modalidadesTerapia: "Estilos de masaje holístico" },
  }),
  "masajes-relajantes": enrich("Masajes relajantes — ambiente, duración y contraindicaciones informativas.", {
    fieldLabels: { modalidadesTerapia: "Tipos de masaje relajante" },
  }),
  "masajes-terapeuticos": enrich("Masaje terapéutico no clínico — no sustituye fisioterapia médica.", {
    fieldLabels: {
      modalidadesTerapia: "Técnicas de masaje terapéutico",
      zonaCorporalMasaje: "Zonas corporales que trabajas",
    },
  }),
  "limpias-energeticas": enrich("Limpias energéticas — hierbas, copal o ritual guiado.", {
    fieldLabels: { modalidadesTerapia: "Tipo de limpia energética" },
  }),
  "flores-de-bach": enrich("Flores de Bach — consulta floral y mezclas personalizadas.", {
    fieldLabels: { modalidadesTerapia: "Servicios florales" },
  }),
  homeopatia: enrich("Homeopatía orientativa — si eres médico homeópata, registra en salud.", {
    textosAyuda: { modalidadesTerapia: "Orientación homeopática; no diagnóstico médico en texto público." },
  }),
  "medicina-tradicional-china": enrich("Medicina tradicional china — tuina, ventosas, herbolaria china.", {
    fieldLabels: { modalidadesTerapia: "Servicios de MTC" },
  }),
  naturopatia: enrich("Naturopatía — consulta holística, hábitos y fitoterapia orientativa.", {
    fieldLabels: { modalidadesTerapia: "Enfoques naturopáticos" },
  }),
  "medicina-natural": enrich("Medicina natural — consulta holística y nutrición natural.", {
    fieldLabels: { modalidadesTerapia: "Servicios de medicina natural" },
  }),
  "terapias-holisticas": enrich("Terapias holísticas integrativas — corporal, energética y emocional.", {
    fieldLabels: { modalidadesTerapia: "Terapias que integras" },
  }),
  "terapias-energeticas": enrich("Terapias energéticas — armonización, cristales o canalización.", {
    fieldLabels: { modalidadesTerapia: "Modalidades energéticas" },
  }),
  "terapias-alternativas": enrich("Terapias alternativas — manual, vibracional o integrativa.", {
    fieldLabels: { modalidadesTerapia: "Terapias alternativas que ofreces" },
  }),
  sonoterapia: enrich("Sonoterapia y cuencos — instrumentos, duración y modalidad de sesión.", {
    fieldLabels: { tipoPractica: "Instrumentos sonoros que usas" },
  }),
  ayurveda: enrich("Ayurveda — consulta, masajes ayurvédicos o yoga ayurvédico.", {
    fieldLabels: { tipoPractica: "Servicios ayurvédicos" },
  }),
  yoga: enrich("Yoga — estilos, formato de clase y niveles que atiendes.", {
    fieldLabels: {
      tipoPractica: "Estilos de yoga",
      modalidadClase: "¿Clases presenciales, en línea o ambas?",
    },
  }),
  pilates: enrich("Pilates — mat, reformer y modalidad grupal o privada.", {
    fieldLabels: { tipoPractica: "Modalidad de Pilates" },
  }),
  meditacion: enrich("Meditación guiada — estilo, duración y experiencia ofrecida.", {
    fieldLabels: { tipoPractica: "Tipo de meditación" },
  }),
  breathwork: enrich("Breathwork — pranayama, respiración consciente o integración.", {
    fieldLabels: { tipoPractica: "Estilo de breathwork" },
  }),
  temazcales: enrich("Temazcal y espacio ceremonial — capacidad, servicios y reservación.", {
    fieldLabels: { serviciosCentro: "Servicios del temazcal / espacio" },
  }),
  "centros-holisticos": enrich("Centro holístico — servicios del espacio, capacidad e instalaciones.", {
    fieldLabels: { serviciosCentro: "¿Qué ofrece tu centro?" },
  }),
  "centros-de-bienestar": enrich("Centro de bienestar — terapias, clases y servicios del espacio.", {
    fieldLabels: { serviciosCentro: "Servicios del centro" },
  }),
  "centros-de-meditacion": enrich("Centro de meditación — salas, retiros cortos y grupos.", {
    fieldLabels: { serviciosCentro: "Servicios de meditación" },
  }),
  "centros-de-yoga": enrich("Estudio o centro de yoga — clases, talleres y retiros.", {
    fieldLabels: { serviciosCentro: "Servicios del estudio" },
  }),
  "centros-de-sanacion": enrich("Centro de sanación — terapias individuales, grupos y talleres.", {
    fieldLabels: { serviciosCentro: "Servicios de sanación" },
  }),
  herbolaria: enrich("Herbolaria — hierbas, tinturas y preparados artesanales en mostrador.", {
    fieldLabels: { categoriasProductoBienestar: "Categorías de herbolaria" },
  }),
  herbolarios: enrich("Herbolario — surtido de plantas y preparados naturales.", {
    fieldLabels: { surtidoPrincipal: "Surtido principal del herbolario" },
  }),
  "tiendas-esotericas": enrich("Tienda esotérica — cristales, tarot, velas e inciensos en punto fijo.", {
    fieldLabels: { categoriasProductoBienestar: "Categorías de la tienda" },
  }),
  "productos-holisticos": enrich("Productos holísticos — surtido presencial sin e-commerce.", {
    fieldLabels: { surtidoPrincipal: "Productos holísticos principales" },
  }),
  "productos-naturistas": enrich("Productos naturistas — surtido en mostrador.", {
    fieldLabels: { surtidoPrincipal: "Surtido naturista" },
  }),
  "suplementos-naturales": enrich("Suplementos naturales — sin prometer efectos curativos.", {
    textosAyuda: { categoriasProductoBienestar: "No prometas curación ni sustitución de medicamento." },
  }),
  naturistas: enrich("Tienda naturista — productos naturales en punto fijo.", {
    fieldLabels: { surtidoPrincipal: "Surtido de la tienda" },
  }),
  "venta-de-inciensos": enrich("Venta de inciensos en local — copal, resinas y sahumerios.", {
    fieldLabels: { surtidoPrincipal: "Tipos de incienso que vendes" },
  }),
  "venta-de-aceites-esenciales": enrich("Aceites esenciales en mostrador — puros, blends y difusores.", {
    fieldLabels: { surtidoPrincipal: "Surtido de aceites esenciales" },
  }),
  "cosmetica-natural": enrich("Cosmética natural — cuidado facial, corporal y capilar.", {
    fieldLabels: { categoriasProductoBienestar: "Líneas de cosmética natural" },
  }),
  "velas-esotericas": enrich("Velas esotéricas y ritual — surtido en tienda física.", {
    fieldLabels: { categoriasProductoBienestar: "Tipos de velas" },
  }),
  sahumerios: enrich("Sahumerios e inciensos — productos en punto fijo.", {
    fieldLabels: { categoriasProductoBienestar: "Categorías de sahumerios" },
  }),
  tarot: enrich("Tarot y oráculo — enfoque, barajas y modalidad de lectura.", {
    fieldLabels: { enfoqueEspiritual: "Tu enfoque de lectura" },
  }),
  astrologia: enrich("Astrología — carta natal y tránsitos sin predicciones absolutas.", {
    fieldLabels: { enfoqueEspiritual: "Servicios astrológicos" },
  }),
  numerologia: enrich("Numerología — análisis simbólico de fechas y nombres.", {
    fieldLabels: { enfoqueEspiritual: "Tipo de consulta numerológica" },
  }),
  "lectura-de-cartas": enrich("Lectura de cartas — oráculos y modalidad presencial o en línea.", {
    fieldLabels: { modalidadLectura: "Modalidad de lectura" },
  }),
  "lectura-de-runas": enrich("Lectura de runas — enfoque nórdico o simbólico.", {
    fieldLabels: { enfoqueEspiritual: "Enfoque de lectura de runas" },
  }),
  "feng-shui": enrich("Feng Shui — consultoría espacial simbólica; no sustituye arquitectura.", {
    fieldLabels: { enfoqueEspiritual: "Servicios de Feng Shui" },
  }),
  cristaloterapia: enrich("Cristaloterapia — uso simbólico de cristales; sin claims médicos.", {
    fieldLabels: { enfoqueEspiritual: "Enfoque con cristales" },
  }),
  "registros-akashicos": enrich("Registros Akáshicos — lectura simbólica y orientación espiritual.", {
    fieldLabels: { enfoqueEspiritual: "Enfoque de la lectura akáshica" },
  }),
  "coaching-de-vida": enrich("Coaching de vida — propósito, metas y hábitos; no terapia clínica.", {
    fieldLabels: { areaCoaching: "Áreas de acompañamiento" },
  }),
  "coaching-espiritual": enrich("Coaching espiritual — transiciones y propósito con enfoque simbólico.", {
    fieldLabels: { areaCoaching: "Temas de coaching espiritual" },
  }),
  "desarrollo-personal": enrich("Desarrollo personal — talleres, sesiones y acompañamiento.", {
    fieldLabels: { areaCoaching: "Áreas de desarrollo personal" },
  }),
  "crecimiento-personal": enrich("Crecimiento personal — metas, autoconocimiento y hábitos.", {
    fieldLabels: { areaCoaching: "Enfoques de crecimiento personal" },
  }),
  "retiros-espirituales": enrich("Retiros espirituales — fechas, lugar, cupo y tipo de experiencia.", {
    fieldLabels: { tipoExperiencia: "Tipo de retiro" },
  }),
  "turismo-espiritual": enrich("Turismo espiritual — destino, fechas y experiencia guiada.", {
    fieldLabels: { lugarExperiencia: "Destino o región del recorrido" },
  }),
  "cacao-ceremonial": enrich("Ceremonia de cacao guiada — sin venta de productos ni envíos.", {
    fieldLabels: { tipoExperiencia: "Formato de ceremonia de cacao" },
  }),
  "medicina-ancestral": enrich("Medicina ancestral — experiencia regulada; solo ceremonias guiadas.", {
    textosAyuda: { requisitosPrevios: "Ayuno, intención y experiencia previa — sé explícito." },
  }),
  chamanismo: enrich("Chamanismo — experiencia ceremonial regulada; consulta fechas.", {
    textosAyuda: { disclaimerRegulado: "Prohibida venta o envío de sustancias." },
  }),
  "ceremonias-tradicionales": enrich("Ceremonias tradicionales guiadas — sin comercialización de sustancias.", {
    textosAyuda: { tipoExperienciaCeremonial: "Ceremonia guiada con acompañamiento responsable." },
  }),
  "ceremonias-ayahuasca-rape-plantas-de-poder": enrich(
    "Solo experiencia ceremonial guiada. Prohibida venta, envío o comercialización.",
    {
      textosAyuda: {
        disclaimerRegulado: "Aceptación obligatoria: no venta ni distribución de sustancias.",
        fechasCeremonia: "Calendario o solicitud de información — nunca precio por dosis.",
      },
    }
  ),
};

export function mergeEnrichmentV2(baseProfile, subId) {
  const enrichData = SUB_ENRICHMENT_V2[subId];
  if (!enrichData) return baseProfile;
  const out = { ...baseProfile };
  if (enrichData.blockHint) out.blockHint = enrichData.blockHint;
  if (enrichData.fieldLabels) {
    out.fieldLabels = { ...(out.fieldLabels || {}), ...enrichData.fieldLabels };
  }
  const ayuda = { ...(out.textosAyuda || {}), ...(enrichData.textosAyuda || {}) };
  out.textosAyuda = ayuda;
  if (enrichData.extraFields) {
    out.extraFields = [...new Set([...(out.extraFields || []), ...enrichData.extraFields])];
  }
  return out;
}
