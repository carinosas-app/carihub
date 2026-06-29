/**
 * MP-EVENTOS-DELTAS-V1 — Fase 0 extendida (fuente de verdad, sin runtime).
 *
 * Consumidores futuros: apply-eventos-deltas-v1.mjs, generar-schemas, blocks, preview/ficha.
 * No modifica catálogo, schema, blocks, render ni persistencia hasta Fase 1+ autorizada.
 *
 * Arquitectura (FieldEngine 1.0.1 / ValidationEngine 1.1.0 / RenderEngine congelado):
 * - FieldEngine: resuelve schema por subcategoriaId; deltas → obligatoriosExtra, camposPublicosPerfil.
 * - ValidationEngine: coherenciaExtra, flags sensible/regulada, requiresAdminReview.
 * - RenderEngine: consume snapshot publicado; preview/ficha mapeados en previewFicha por sub.
 *
 * Seguridad (ACTA-CONGELAMIENTO-SEGURIDAD 1.0.0):
 * - Contenido explícito/stripper → sensible + admin review.
 * - Pirotecnia, seguridad privada → regulada + admin review.
 * - Alimentos → permisos salud/higiene declarativos.
 * - Valet/transporte → póliza/responsabilidad declarativa.
 * - Menores (animadores infantiles, foto infantil, shows infantiles) → restricciones imagen/datos.
 *
 * Catálogo (ACTA-CONGELAMIENTO-CATALOGO 1.0.0):
 * - Este archivo es diseño previo a MINOR catalogo (37→20 subs eventos).
 * - mapa-registro-categorias.json sigue siendo fuente de verdad hasta apply Fase 0.
 *
 * Alcance congelado — NO TOCAR en runtime hasta fases posteriores:
 * Adultos, Bienestar V1, Home, Geo F1, Placeholders, Firestore/Auth/Storage/Hosting/pagos.
 */

export const MP_ID = "MP-EVENTOS-DELTAS-V1";
export const MP_PHASE = "F1-schema-catalogo";
export const SECTOR_ID = "eventos";
export const CATALOG_VERSION_TARGET = "1.1.0-minor-eventos";

/** 12 packs reutilizables — más granular que Bienestar V1 (8 packs sin sub-deltas). */
export const PACK_IDS = [
  "VENUE",
  "PROD",
  "CREATIVE",
  "MUSIC",
  "SHOW",
  "FOOD",
  "RENTAL",
  "FLORAL",
  "FX",
  "SECURITY",
  "VALET",
  "TRANSPORT",
];

export const PACK_LABELS = {
  VENUE: "Espacio / venue para eventos",
  PROD: "Producción y coordinación",
  CREATIVE: "Creativos (diseño, foto, video, papelería)",
  MUSIC: "Música en vivo y DJ",
  SHOW: "Animación, MC y shows escénicos",
  FOOD: "Alimentos y bebidas para eventos",
  RENTAL: "Renta de mobiliario, equipo y vestuario",
  FLORAL: "Florería e instalación floral",
  FX: "Pirotecnia y efectos especiales",
  SECURITY: "Seguridad para eventos",
  VALET: "Valet parking",
  TRANSPORT: "Transporte para invitados / eventos",
};

/** Campos base compartidos — NO cuentan como delta suficiente solos. */
export const EVENTOS_BASE_FIELD_IDS = [
  "alias",
  "tagline",
  "geo",
  "horarioAtencionComercial",
  "cotizacionDesde",
  "unidadCotizacion",
  "fotos",
  "contactoWhatsapp",
];

/** IDs de campo demasiado genéricos — prohibidos como único delta. */
export const GENERIC_ONLY_FORBIDDEN = [
  "descripcion",
  "horario",
  "precioDesde",
  "ubicacion",
  "serviciosIncluidos",
];

/**
 * 20 subcategorías canon — taxonomía objetivo MP-EVENTOS-DELTAS-V1.
 * tipoPerfil/arquetipoBase: objetivo post-apply; legacy mapa puede diferir hasta Fase 0.
 */
export const CANON_SUBCATEGORIAS = [
  {
    subcategoriaId: "espacios-para-eventos",
    nombre: "Espacios para Eventos",
    pack: "VENUE",
    tipoPerfil: "lugar",
    arquetipoBase: "negocio_venue",
    formularioId: "negocio_empresa",
    blockTitle: "Tu salón, quinta o espacio para eventos",
  },
  {
    subcategoriaId: "organizadores-produccion-eventos",
    nombre: "Organizadores y Producción de Eventos",
    pack: "PROD",
    tipoPerfil: "persona",
    arquetipoBase: "persona_servicio_general",
    formularioId: "persona_independiente",
    blockTitle: "Producción y coordinación de eventos",
  },
  {
    subcategoriaId: "decoracion-ambientacion-eventos",
    nombre: "Decoración y Ambientación",
    pack: "CREATIVE",
    tipoPerfil: "persona",
    arquetipoBase: "persona_servicio_general",
    formularioId: "persona_independiente",
    blockTitle: "Decoración y ambientación para tu evento",
  },
  {
    subcategoriaId: "fotografia-video-eventos",
    nombre: "Fotografía y Video para Eventos",
    pack: "CREATIVE",
    tipoPerfil: "persona",
    arquetipoBase: "persona_servicio_profesional",
    formularioId: "persona_independiente",
    blockTitle: "Cobertura fotográfica y audiovisual",
  },
  {
    subcategoriaId: "djs-eventos",
    nombre: "DJ's para Eventos",
    pack: "MUSIC",
    tipoPerfil: "persona",
    arquetipoBase: "persona_servicio_profesional",
    formularioId: "persona_independiente",
    blockTitle: "Tu servicio de DJ para fiestas y eventos",
  },
  {
    subcategoriaId: "grupos-musicales-eventos",
    nombre: "Grupos Musicales para Eventos",
    pack: "MUSIC",
    tipoPerfil: "persona",
    arquetipoBase: "persona_servicio_profesional",
    formularioId: "persona_independiente",
    blockTitle: "Tu grupo o agrupación musical",
  },
  {
    subcategoriaId: "animadores-maestros-ceremonia",
    nombre: "Animadores y Maestros de Ceremonia",
    pack: "SHOW",
    tipoPerfil: "persona",
    arquetipoBase: "persona_servicio_profesional",
    formularioId: "persona_independiente",
    blockTitle: "Animación, dinámicas y maestro de ceremonias",
  },
  {
    subcategoriaId: "shows-para-eventos",
    nombre: "Shows para Eventos",
    pack: "SHOW",
    tipoPerfil: "persona",
    arquetipoBase: "persona_servicio_profesional",
    formularioId: "persona_independiente",
    blockTitle: "Show escénico para tu evento",
  },
  {
    subcategoriaId: "banquetes-catering-eventos",
    nombre: "Banquetes y Catering",
    pack: "FOOD",
    tipoPerfil: "negocio",
    arquetipoBase: "negocio_alimentos",
    formularioId: "negocio_empresa",
    blockTitle: "Banquetes, buffets y servicio de alimentos",
  },
  {
    subcategoriaId: "renta-mobiliario-eventos",
    nombre: "Renta de Mobiliario",
    pack: "RENTAL",
    tipoPerfil: "negocio",
    arquetipoBase: "negocio_servicios_local",
    formularioId: "negocio_empresa",
    blockTitle: "Renta de mobiliario para eventos",
  },
  {
    subcategoriaId: "renta-equipo-eventos",
    nombre: "Renta de Equipo (Audio, Iluminación, Escenarios)",
    pack: "RENTAL",
    tipoPerfil: "negocio",
    arquetipoBase: "negocio_servicios_local",
    formularioId: "negocio_empresa",
    blockTitle: "Renta de equipo técnico para eventos",
  },
  {
    subcategoriaId: "food-trucks-carritos-eventos",
    nombre: "Food Trucks y Carritos",
    pack: "FOOD",
    tipoPerfil: "negocio",
    arquetipoBase: "negocio_alimentos",
    formularioId: "negocio_empresa",
    blockTitle: "Food truck o carrito para tu evento",
  },
  {
    subcategoriaId: "pasteles-reposteria-eventos",
    nombre: "Pasteles y Repostería para Eventos",
    pack: "FOOD",
    tipoPerfil: "negocio",
    arquetipoBase: "negocio_alimentos",
    formularioId: "negocio_empresa",
    blockTitle: "Pasteles, mesa de postres y repostería",
  },
  {
    subcategoriaId: "invitaciones-papeleria-eventos",
    nombre: "Invitaciones y Papelería",
    pack: "CREATIVE",
    tipoPerfil: "persona",
    arquetipoBase: "persona_servicio_general",
    formularioId: "persona_independiente",
    blockTitle: "Invitaciones, papelería y diseño gráfico",
  },
  {
    subcategoriaId: "florerias-eventos",
    nombre: "Florerías para Eventos",
    pack: "FLORAL",
    tipoPerfil: "negocio",
    arquetipoBase: "negocio_servicios_local",
    formularioId: "negocio_empresa",
    blockTitle: "Flores e instalaciones florales",
  },
  {
    subcategoriaId: "pirotecnia-efectos-especiales",
    nombre: "Pirotecnia y Efectos Especiales",
    pack: "FX",
    tipoPerfil: "negocio",
    arquetipoBase: "negocio_servicios_local",
    formularioId: "negocio_empresa",
    blockTitle: "Pirotecnia y efectos especiales",
  },
  {
    subcategoriaId: "seguridad-eventos",
    nombre: "Seguridad para Eventos",
    pack: "SECURITY",
    tipoPerfil: "negocio",
    arquetipoBase: "negocio_servicios_local",
    formularioId: "negocio_empresa",
    blockTitle: "Seguridad privada para eventos",
  },
  {
    subcategoriaId: "valet-parking-eventos",
    nombre: "Valet Parking",
    pack: "VALET",
    tipoPerfil: "negocio",
    arquetipoBase: "negocio_servicios_local",
    formularioId: "negocio_empresa",
    blockTitle: "Servicio de valet parking",
  },
  {
    subcategoriaId: "transporte-eventos",
    nombre: "Transporte para Eventos",
    pack: "TRANSPORT",
    tipoPerfil: "negocio",
    arquetipoBase: "negocio_servicios_local",
    formularioId: "negocio_empresa",
    blockTitle: "Transporte de invitados y logística",
  },
  {
    subcategoriaId: "renta-vestuario-disfraces-eventos",
    nombre: "Renta de Vestuario y Disfraces",
    pack: "RENTAL",
    tipoPerfil: "negocio",
    arquetipoBase: "negocio_servicios_local",
    formularioId: "negocio_empresa",
    blockTitle: "Renta de vestuario, trajes y disfraces",
  },
];

/** Subcategorías nuevas (no existen como subcategoriaId en mapa legacy 37). */
export const NEW_SUBCATEGORIAS = [
  { subcategoriaId: "food-trucks-carritos-eventos", nombre: "Food Trucks y Carritos", pack: "FOOD" },
  { subcategoriaId: "pasteles-reposteria-eventos", nombre: "Pasteles y Repostería para Eventos", pack: "FOOD" },
  { subcategoriaId: "invitaciones-papeleria-eventos", nombre: "Invitaciones y Papelería", pack: "CREATIVE" },
  { subcategoriaId: "florerias-eventos", nombre: "Florerías para Eventos", pack: "FLORAL" },
  { subcategoriaId: "pirotecnia-efectos-especiales", nombre: "Pirotecnia y Efectos Especiales", pack: "FX" },
  { subcategoriaId: "seguridad-eventos", nombre: "Seguridad para Eventos", pack: "SECURITY" },
  { subcategoriaId: "valet-parking-eventos", nombre: "Valet Parking", pack: "VALET" },
  { subcategoriaId: "transporte-eventos", nombre: "Transporte para Eventos", pack: "TRANSPORT" },
  { subcategoriaId: "renta-vestuario-disfraces-eventos", nombre: "Renta de Vestuario y Disfraces", pack: "RENTAL" },
];

/** Mapa legacy 37 (mapa-registro-categorias.json) → canon 20. */
export const LEGACY_TO_CANON = {
  dj: "djs-eventos",
  "maestro-de-ceremonias": "animadores-maestros-ceremonia",
  animador: "animadores-maestros-ceremonia",
  payaso: "shows-para-eventos",
  mago: "shows-para-eventos",
  comediante: "shows-para-eventos",
  cantante: "grupos-musicales-eventos",
  "mariachi-independiente": "grupos-musicales-eventos",
  "grupo-musical-independiente": "grupos-musicales-eventos",
  "fotografo-de-eventos": "fotografia-video-eventos",
  videografo: "fotografia-video-eventos",
  "organizador-de-eventos": "organizadores-produccion-eventos",
  "wedding-planner": "organizadores-produccion-eventos",
  "decorador-de-eventos": "decoracion-ambientacion-eventos",
  sonidista: "renta-equipo-eventos",
  "iluminacion-para-eventos": "renta-equipo-eventos",
  locutor: "animadores-maestros-ceremonia",
  presentador: "animadores-maestros-ceremonia",
  "edecan-para-eventos": "animadores-maestros-ceremonia",
  "modelo-para-eventos": "animadores-maestros-ceremonia",
  "salon-de-eventos": "espacios-para-eventos",
  "jardin-para-eventos": "espacios-para-eventos",
  "productora-de-espectaculos": "organizadores-produccion-eventos",
  "agencia-de-edecanes": "animadores-maestros-ceremonia",
  "agencia-de-modelos": "animadores-maestros-ceremonia",
  "agencia-de-artistas": "organizadores-produccion-eventos",
  "renta-de-mobiliario": "renta-mobiliario-eventos",
  "renta-de-sonido": "renta-equipo-eventos",
  "renta-de-iluminacion": "renta-equipo-eventos",
  "renta-de-escenarios": "renta-equipo-eventos",
  "catering-para-eventos": "banquetes-catering-eventos",
  "organizacion-de-bodas": "organizadores-produccion-eventos",
  "organizacion-de-eventos-corporativos": "organizadores-produccion-eventos",
  "organizacion-de-fiestas-infantiles": "organizadores-produccion-eventos",
  "organizacion-de-conciertos": "organizadores-produccion-eventos",
  "organizacion-de-exposiciones": "organizadores-produccion-eventos",
  "pinatas-y-festejos": "decoracion-ambientacion-eventos",
};

/** Home legacy (10 subs sectores-carihub.js) → canon — referencia Fase 0 home (Home congelado hasta acta). */
export const HOME_LEGACY_TO_CANON = {
  "salones-de-eventos": "espacios-para-eventos",
  animadores: "animadores-maestros-ceremonia",
  djs: "djs-eventos",
  "grupos-musicales": "grupos-musicales-eventos",
  catering: "banquetes-catering-eventos",
  "renta-de-mobiliario": "renta-mobiliario-eventos",
  "decoracion-de-eventos": "decoracion-ambientacion-eventos",
  "fotografia-de-eventos": "fotografia-video-eventos",
  "organizacion-de-bodas": "organizadores-produccion-eventos",
  "pinatas-y-festejos": "decoracion-ambientacion-eventos",
};

/** Mapa canon → pack (fuente para SUB_TO_PACK post-migración). */
export const SUB_TO_PACK = Object.fromEntries(CANON_SUBCATEGORIAS.map((c) => [c.subcategoriaId, c.pack]));

export function packPlantillaKey(pack) {
  return `eventos_pack_${pack.toLowerCase()}`;
}

export function arquetipoForCanon(canon) {
  return packPlantillaKey(canon.pack);
}

/** Registry de campos sector eventos — meta.fieldRegistry (Fase 1). */
export const EVENTOS_FIELD_REGISTRY = {
  especialidadesEvento: {
    id: "especialidadesEvento",
    label: "Tipos de evento que atiendes",
    tipo: "checklist",
    iaCopy: true,
  },
  tiposEspacio: {
    id: "tiposEspacio",
    label: "Tipo de espacio",
    tipo: "checklist",
    opciones: [
      "salon",
      "quinta",
      "jardin",
      "terraza",
      "hacienda",
      "viniedo",
      "roof_top",
      "salon_industrial",
      "otro",
    ],
    hint: "Ej.: quinta con jardín, salón con terraza, viñedo.",
  },
  capacidadMin: { id: "capacidadMin", label: "Capacidad mínima (personas)", tipo: "number", min: 1, max: 50000 },
  capacidadMax: { id: "capacidadMax", label: "Capacidad máxima (personas)", tipo: "number", min: 1, max: 50000 },
  areasIncluidas: {
    id: "areasIncluidas",
    label: "Áreas incluidas en el espacio",
    tipo: "checklist",
    opciones: ["salon", "jardin", "terraza", "cocina", "camerino", "alberca", "estacionamiento", "area_ninos"],
  },
  estacionamientoCupo: { id: "estacionamientoCupo", label: "Cupo de estacionamiento", tipo: "number", min: 0, max: 5000 },
  mobiliarioIncluido: {
    id: "mobiliarioIncluido",
    label: "Mobiliario incluido",
    tipo: "checklist",
    opciones: ["mesas", "sillas", "manteles", "sillas_ninos", "lounge", "ninguno"],
  },
  cateringPolitica: {
    id: "cateringPolitica",
    label: "Política de catering",
    tipo: "enum",
    opciones: ["propio_exclusivo", "propio_opcional", "externo_permitido", "externo_exclusivo"],
    hint: "¿Deben contratar tu banquete o pueden traer catering externo?",
  },
  restriccionRuido: {
    id: "restriccionRuido",
    label: "Restricción de ruido / horario límite música",
    tipo: "text",
    maxLength: 120,
    hint: "Ej.: música hasta 2:00 am; sin bocinas después de medianoche.",
  },
  permiteMusicaEnVivo: { id: "permiteMusicaEnVivo", label: "Permite música en vivo", tipo: "boolean" },
  permitePirotecnia: { id: "permitePirotecnia", label: "Permite pirotecnia en el venue", tipo: "boolean" },
  tiposEventoAceptados: {
    id: "tiposEventoAceptados",
    label: "Tipos de evento que aceptas",
    tipo: "checklist",
    opciones: ["infantil", "xv_anos", "boda", "corporativo", "social_adulto", "religioso", "concierto", "exposicion"],
  },
  permisosMunicipalesVenue: {
    id: "permisosMunicipalesVenue",
    label: "Cuenta con permisos municipales vigentes",
    tipo: "boolean",
  },
  horarioMaximoEvento: {
    id: "horarioMaximoEvento",
    label: "Horario máximo del evento",
    tipo: "text",
    maxLength: 80,
    hint: "Ej.: hasta 3:00 am los sábados.",
  },
  rolProduccion: {
    id: "rolProduccion",
    label: "Qué coordina tu producción",
    tipo: "checklist",
    opciones: ["proveedores", "cronograma", "montaje_desmontaje", "diseno_experiencia", "logistica_invitados"],
  },
  tamanoEventoAtendido: {
    id: "tamanoEventoAtendido",
    label: "Tamaño de evento que atiendes",
    tipo: "enum",
    opciones: ["intimo", "mediano", "masivo"],
  },
  presupuestoMinimoMxn: { id: "presupuestoMinimoMxn", label: "Presupuesto mínimo de proyecto (MXN)", tipo: "number", min: 0 },
  incluyeDirectorEvento: { id: "incluyeDirectorEvento", label: "Incluye director de evento", tipo: "boolean" },
  eventosReferencia: {
    id: "eventosReferencia",
    label: "Eventos de referencia recientes",
    tipo: "textarea",
    maxLength: 600,
    hint: "Menciona 2–3 eventos similares sin datos privados de clientes.",
  },
  especialidadesDecoracion: {
    id: "especialidadesDecoracion",
    label: "Estilos y técnicas de decoración",
    tipo: "checklist",
    opciones: ["globos", "floral_no_producto", "tematica", "backdrop", "arcos", "lounge", "pinatas_festejos", "iluminacion_decorativa"],
  },
  incluyeMontajeDesmontaje: {
    id: "incluyeMontajeDesmontaje",
    label: "Montaje y desmontaje",
    tipo: "enum",
    opciones: ["ambos_incluidos", "solo_montaje", "cotizar_aparte"],
  },
  tiempoMontajeHoras: { id: "tiempoMontajeHoras", label: "Tiempo estimado de montaje (horas)", tipo: "number", min: 0, max: 72 },
  estructurasPropias: {
    id: "estructurasPropias",
    label: "Estructuras propias disponibles",
    tipo: "checklist",
    opciones: ["arcos", "letras", "tarimas", "tuneles", "carpas"],
  },
  estiloVisual: { id: "estiloVisual", label: "Estilos visuales", tipo: "tags", iaCopy: true },
  requiereVisitaVenue: { id: "requiereVisitaVenue", label: "Requiere visita al venue antes de cotizar", tipo: "boolean" },
  serviciosAudiovisual: {
    id: "serviciosAudiovisual",
    label: "Servicios que ofreces",
    tipo: "checklist",
    opciones: ["foto", "video", "dron", "video_360", "same_day_edit", "photobooth"],
  },
  horasCobertura: { id: "horasCobertura", label: "Horas de cobertura incluidas", tipo: "number", min: 1, max: 24 },
  tiempoEntregaDias: { id: "tiempoEntregaDias", label: "Tiempo de entrega (días)", tipo: "number", min: 1, max: 365 },
  incluyeSegundoOperador: { id: "incluyeSegundoOperador", label: "Incluye segundo fotógrafo/videógrafo", tipo: "boolean" },
  licenciaDron: { id: "licenciaDron", label: "Cuenta con licencia/registro de dron", tipo: "boolean" },
  especialidadesDj: {
    id: "especialidadesDj",
    label: "Eventos donde te especializas",
    tipo: "checklist",
    opciones: ["bodas", "xv_anos", "corporativo", "privados", "graduaciones", "antros_bares"],
  },
  generosMusicales: { id: "generosMusicales", label: "Géneros musicales", tipo: "tags", iaCopy: true },
  duracionSetMinimaHoras: { id: "duracionSetMinimaHoras", label: "Duración mínima de set (horas)", tipo: "number", min: 1, max: 12 },
  incluyeEquipoDj: {
    id: "incluyeEquipoDj",
    label: "Equipo incluido",
    tipo: "checklist",
    opciones: ["audio", "luces", "pantalla", "microfono", "cabina"],
  },
  aceptaPeticionesEnVivo: { id: "aceptaPeticionesEnVivo", label: "Acepta peticiones en vivo", tipo: "boolean" },
  viajaFueraCiudad: { id: "viajaFueraCiudad", label: "Viaja fuera de tu ciudad", tipo: "boolean" },
  costoTraslado: {
    id: "costoTraslado",
    label: "Costo de traslado",
    tipo: "enum",
    opciones: ["incluido", "por_km", "cotizar_aparte"],
  },
  tipoAgrupacion: {
    id: "tipoAgrupacion",
    label: "Tipo de agrupación",
    tipo: "enum",
    opciones: [
      "mariachi",
      "banda",
      "trio",
      "solista",
      "orquesta",
      "grupo_regional",
      "fara_fara",
      "grupo_tropical",
      "otro",
    ],
    hint: "Fara Fara es formato propio — no lo confundas con vallenato o regional colombiano.",
  },
  numeroIntegrantes: { id: "numeroIntegrantes", label: "Número de integrantes", tipo: "number", min: 1, max: 50 },
  repertorioPrincipal: { id: "repertorioPrincipal", label: "Repertorio principal", tipo: "tags", iaCopy: true },
  duracionSetMinutos: { id: "duracionSetMinutos", label: "Duración de cada set (minutos)", tipo: "number", min: 15, max: 240 },
  numeroSetsIncluidos: { id: "numeroSetsIncluidos", label: "Sets incluidos por evento", tipo: "number", min: 1, max: 10 },
  incluyeSonidoMusica: { id: "incluyeSonidoMusica", label: "Incluye equipo de sonido", tipo: "boolean" },
  aceptaPeticiones: { id: "aceptaPeticiones", label: "Toca peticiones del público", tipo: "boolean" },
  experienciaEnEventos: {
    id: "experienciaEnEventos",
    label: "Experiencia en",
    tipo: "checklist",
    opciones: ["bodas", "xv_anos", "empresariales", "fiestas_privadas", "conciertos"],
  },
  descripcionFormatoFaraFara: {
    id: "descripcionFormatoFaraFara",
    label: "Describe tu formato Fara Fara",
    tipo: "textarea",
    maxLength: 400,
    hint: "Duración típica, dinámica con el público, repertorio característico.",
  },
  rolPrincipal: {
    id: "rolPrincipal",
    label: "Tu rol principal",
    tipo: "enum",
    opciones: ["animador", "mc", "presentador", "edecan", "modelo", "mixto"],
  },
  rangoEdadPublico: {
    id: "rangoEdadPublico",
    label: "Rango de edad del público",
    tipo: "checklist",
    opciones: ["infantil", "familiar", "adolescentes", "adultos"],
  },
  dinamicasOfrecidas: {
    id: "dinamicasOfrecidas",
    label: "Dinámicas y actividades",
    tipo: "checklist",
    opciones: ["concursos", "juegos", "show_participativo", "baile", "magia_ligera"],
  },
  estiloCeremonia: {
    id: "estiloCeremonia",
    label: "Estilo de ceremonia",
    tipo: "checklist",
    opciones: ["religiosa", "civil", "hibrida", "corporativa", "xv_anos"],
  },
  incluyeGuionCeremonia: { id: "incluyeGuionCeremonia", label: "Incluye guion o estructura de ceremonia", tipo: "boolean" },
  idiomasAnimacion: { id: "idiomasAnimacion", label: "Idiomas", tipo: "tags" },
  trabajaConMenores: {
    id: "trabajaConMenores",
    label: "Trabaja con menores de edad",
    tipo: "boolean",
    hint: "Si sí: no subas fotos identificables de niños sin autorización documentada.",
  },
  tipoShow: {
    id: "tipoShow",
    label: "Tipo de show",
    tipo: "checklist",
    opciones: [
      "payaso",
      "mago",
      "personajes",
      "comedia",
      "baile",
      "fuego",
      "strippers",
      "otro",
    ],
  },
  publicoObjetivo: {
    id: "publicoObjetivo",
    label: "Público objetivo",
    tipo: "enum",
    opciones: ["infantil", "familiar", "adultos"],
    hint: "Show adulto no implica desnudo automáticamente.",
  },
  contenidoSensible: {
    id: "contenidoSensible",
    label: "Incluye contenido explícito o show para adultos (+18)",
    tipo: "boolean",
    hint: "Marca sí solo si hay desnudez, striptease u otro contenido explícito.",
  },
  duracionShowMinutos: { id: "duracionShowMinutos", label: "Duración del show (minutos)", tipo: "number", min: 5, max: 480 },
  numeroArtistas: { id: "numeroArtistas", label: "Número de artistas en escena", tipo: "number", min: 1, max: 50 },
  requiereEspacioMinimo: {
    id: "requiereEspacioMinimo",
    label: "Espacio mínimo requerido",
    tipo: "text",
    maxLength: 120,
    hint: "Ej.: 4×4 m, escenario elevado, pista despejada.",
  },
  incluyeAudioShow: { id: "incluyeAudioShow", label: "Incluye audio / micrófonos", tipo: "boolean" },
  requiereCamerino: { id: "requiereCamerino", label: "Requiere camerino", tipo: "boolean" },
  restriccionesTecnicas: { id: "restriccionesTecnicas", label: "Restricciones técnicas", tipo: "textarea", maxLength: 600 },
  experienciaAnios: { id: "experienciaAnios", label: "Años de experiencia", tipo: "number", min: 0, max: 80 },
  formatoBanquete: {
    id: "formatoBanquete",
    label: "Formato de servicio",
    tipo: "checklist",
    opciones: ["banquete_emplatado", "buffet", "taquiza", "barra_snacks", "coffee_break"],
  },
  comensalesMax: { id: "comensalesMax", label: "Comensales máximos que atiendes", tipo: "number", min: 1, max: 10000 },
  menuMuestraDisponible: { id: "menuMuestraDisponible", label: "Ofrece menú de degustación o muestra", tipo: "boolean" },
  incluyeMeseros: { id: "incluyeMeseros", label: "Incluye meseros y servicio", tipo: "boolean" },
  dietasEspeciales: {
    id: "dietasEspeciales",
    label: "Dietas que puedes cubrir",
    tipo: "checklist",
    opciones: ["vegetariano", "vegano", "sin_gluten", "kosher", "halal", "sin_mariscos"],
  },
  permisoManipulacionAlimentos: {
    id: "permisoManipulacionAlimentos",
    label: "Permiso de manipulación de alimentos vigente",
    tipo: "boolean",
  },
  inventarioMobiliario: {
    id: "inventarioMobiliario",
    label: "Mobiliario en renta",
    tipo: "checklist",
    opciones: ["mesas", "sillas", "sillas_ninos", "manteles", "vajilla", "lounge", "carpas"],
  },
  incluyeEntregaRecoleccion: { id: "incluyeEntregaRecoleccion", label: "Incluye entrega y recolección", tipo: "boolean" },
  depositoGarantiaMobiliario: { id: "depositoGarantiaMobiliario", label: "Requiere depósito en garantía", tipo: "boolean" },
  minimoRentaMobiliario: { id: "minimoRentaMobiliario", label: "Mínimo de renta (MXN)", tipo: "number", min: 0 },
  tipoEquipoRenta: {
    id: "tipoEquipoRenta",
    label: "Tipo de equipo",
    tipo: "checklist",
    opciones: ["audio", "iluminacion", "escenario", "pantallas", "generador", "efectos_humo"],
  },
  incluyeOperadorTecnico: { id: "incluyeOperadorTecnico", label: "Incluye operador técnico", tipo: "boolean" },
  potenciaAudioWatts: { id: "potenciaAudioWatts", label: "Potencia de audio (W aprox.)", tipo: "number", min: 0 },
  requerimientosElectricos: { id: "requerimientosElectricos", label: "Requerimientos eléctricos", tipo: "text", maxLength: 200 },
  tipoUnidadFood: {
    id: "tipoUnidadFood",
    label: "Tipo de unidad",
    tipo: "enum",
    opciones: ["food_truck", "carrito", "puesto", "trailer"],
  },
  cartaPrincipal: { id: "cartaPrincipal", label: "Carta o especialidad principal", tipo: "tags", iaCopy: true },
  comensalesPorHora: { id: "comensalesPorHora", label: "Comensales que atiendes por hora", tipo: "number", min: 1, max: 5000 },
  requiereAguaLuz: { id: "requiereAguaLuz", label: "Requiere conexión de agua/luz en sitio", tipo: "boolean" },
  radioServicioKm: { id: "radioServicioKm", label: "Radio de servicio (km)", tipo: "number", min: 0, max: 500 },
  productosReposteria: {
    id: "productosReposteria",
    label: "Productos que elaboras",
    tipo: "checklist",
    opciones: ["pastel_boda", "pastel_xv", "cupcakes", "mesa_postres", "galletas", "personalizado"],
  },
  tiempoPedidoAnticipacionDias: {
    id: "tiempoPedidoAnticipacionDias",
    label: "Anticipación mínima de pedido (días)",
    tipo: "number",
    min: 1,
    max: 365,
  },
  incluyeDegustacion: { id: "incluyeDegustacion", label: "Ofrece degustación previa", tipo: "boolean" },
  incluyeMontajeMesaPostres: { id: "incluyeMontajeMesaPostres", label: "Incluye montaje de mesa de postres", tipo: "boolean" },
  productosPapeleria: {
    id: "productosPapeleria",
    label: "Productos de papelería",
    tipo: "checklist",
    opciones: ["invitacion_fisica", "invitacion_digital", "save_the_date", "menu", "seating_chart", "recuerdos"],
  },
  tiempoProduccionDias: { id: "tiempoProduccionDias", label: "Tiempo de producción (días)", tipo: "number", min: 1, max: 180 },
  revisionesIncluidas: { id: "revisionesIncluidas", label: "Revisiones de diseño incluidas", tipo: "number", min: 0, max: 10 },
  entregaFormato: {
    id: "entregaFormato",
    label: "Formatos de entrega",
    tipo: "checklist",
    opciones: ["impresion", "pdf", "web", "qr"],
  },
  incluyeDiseno: { id: "incluyeDiseno", label: "Incluye diseño gráfico", tipo: "boolean" },
  incluyeImpresion: { id: "incluyeImpresion", label: "Incluye impresión", tipo: "boolean" },
  productosFlorales: {
    id: "productosFlorales",
    label: "Productos florales",
    tipo: "checklist",
    opciones: ["ramos", "arcos", "centros_mesa", "instalacion_completa", "preservadas", "temporada"],
  },
  incluyeInstalacionFloral: { id: "incluyeInstalacionFloral", label: "Incluye instalación y desmontaje", tipo: "boolean" },
  tipoEfectoPirotecnia: {
    id: "tipoEfectoPirotecnia",
    label: "Tipo de efecto",
    tipo: "checklist",
    opciones: ["fuegos_artificiales", "cold_sparks", "confetti", "humo", "laser"],
  },
  ambientePirotecnia: {
    id: "ambientePirotecnia",
    label: "Ambiente permitido",
    tipo: "enum",
    opciones: ["exterior", "interior_condicionado", "ambos"],
  },
  licenciaPirotecnia: { id: "licenciaPirotecnia", label: "Licencia o permiso de pirotecnia vigente", tipo: "boolean" },
  jurisdiccionPirotecnia: { id: "jurisdiccionPirotecnia", label: "Jurisdicción donde opera", tipo: "text", maxLength: 120 },
  distanciaSeguridadMetros: { id: "distanciaSeguridadMetros", label: "Distancia de seguridad requerida (m)", tipo: "number", min: 0 },
  polizaSeguroPirotecnia: { id: "polizaSeguroPirotecnia", label: "Póliza de seguro vigente", tipo: "boolean" },
  elementosSeguridad: { id: "elementosSeguridad", label: "Elementos de seguridad", tipo: "number", min: 1, max: 500 },
  controlAcceso: { id: "controlAcceso", label: "Ofrece control de acceso / credenciales", tipo: "boolean" },
  licenciaSeguridadPrivada: { id: "licenciaSeguridadPrivada", label: "Licencia de seguridad privada vigente", tipo: "boolean" },
  eventosMasivos: { id: "eventosMasivos", label: "Experiencia en eventos masivos (+500 personas)", tipo: "boolean" },
  vehiculosPorHora: { id: "vehiculosPorHora", label: "Vehículos que estacionas por hora (aprox.)", tipo: "number", min: 1 },
  elementosValet: { id: "elementosValet", label: "Elementos de valet en equipo", tipo: "number", min: 1, max: 100 },
  polizaResponsabilidadValet: { id: "polizaResponsabilidadValet", label: "Póliza de responsabilidad civil vigente", tipo: "boolean" },
  uniformeProfesionalValet: { id: "uniformeProfesionalValet", label: "Uniforme profesional", tipo: "boolean" },
  coordinacionConVenue: { id: "coordinacionConVenue", label: "Coordina con el venue / estacionamiento", tipo: "boolean" },
  tipoFlotaTransporte: {
    id: "tipoFlotaTransporte",
    label: "Tipo de flota",
    tipo: "checklist",
    opciones: ["sprinter", "autobus", "suv", "sedan_ejecutivo", "limousine", "shuttle"],
  },
  capacidadPasajeros: { id: "capacidadPasajeros", label: "Capacidad por unidad (pasajeros)", tipo: "number", min: 1, max: 80 },
  incluyeChofer: { id: "incluyeChofer", label: "Incluye chofer certificado", tipo: "boolean" },
  permisoTransporte: { id: "permisoTransporte", label: "Permiso de transporte / SCT vigente", tipo: "boolean" },
  polizaTransporte: { id: "polizaTransporte", label: "Póliza de seguro de pasajeros vigente", tipo: "boolean" },
  usoTransporte: {
    id: "usoTransporte",
    label: "Uso principal",
    tipo: "checklist",
    opciones: ["boda_invitados", "corporativo", "shuttle", "traslado_artistas"],
  },
  categoriasVestuario: {
    id: "categoriasVestuario",
    label: "Categorías en renta",
    tipo: "checklist",
    opciones: ["trajes_formales", "vestidos_gala", "disfraces", "botargas", "accesorios"],
  },
  tallasDisponibles: { id: "tallasDisponibles", label: "Rango de tallas", tipo: "text", maxLength: 80 },
  higienizacionVestuario: { id: "higienizacionVestuario", label: "Higienización entre rentas", tipo: "boolean" },
  depositoVestuario: { id: "depositoVestuario", label: "Requiere depósito", tipo: "boolean" },
  unidadCotizacion: {
    id: "unidadCotizacion",
    label: "Cotizas por",
    tipo: "enum",
    opciones: ["evento", "hora", "dia", "persona", "km", "proyecto"],
  },
  cotizacionDesde: { id: "cotizacionDesde", label: "Cotización desde (MXN)", tipo: "number", min: 0 },
  tagline: { id: "tagline", label: "Frase que vende tu servicio", tipo: "text", maxLength: 120, iaCopy: true },
  disclaimerReguladoEventos: {
    id: "disclaimerReguladoEventos",
    label: "Acepto avisos legales y limitaciones del servicio regulado",
    tipo: "boolean",
    privado: false,
  },
};

/** Subniveles / especialidades por canon (checklists dentro del formulario, no subs hijas). */
export const ESPECIALIDADES_BY_CANON = {
  "espacios-para-eventos": {
    fieldId: "tiposEspacio",
    opciones: ["salon", "quinta", "jardin", "hacienda", "viniedo", "terraza", "roof_top"],
    nota: "Quintas viven aquí — no son subcategoría aparte.",
  },
  "organizadores-produccion-eventos": {
    fieldId: "especialidadesEvento",
    opciones: ["bodas", "xv_anos", "corporativo", "infantil", "conciertos", "exposiciones", "fiestas_privadas"],
  },
  "decoracion-ambientacion-eventos": {
    fieldId: "especialidadesDecoracion",
    opciones: ["globos", "tematica", "backdrop", "arcos", "pinatas_festejos", "iluminacion_decorativa"],
  },
  "fotografia-video-eventos": {
    fieldId: "serviciosAudiovisual",
    opciones: ["foto", "video", "dron", "video_360", "same_day_edit"],
  },
  "djs-eventos": {
    fieldId: "especialidadesDj",
    opciones: ["bodas", "xv_anos", "corporativo", "privados", "graduaciones"],
  },
  "grupos-musicales-eventos": {
    fieldId: "tipoAgrupacion",
    opciones: ["mariachi", "banda", "trio", "solista", "orquesta", "fara_fara", "grupo_tropical"],
    nota: "fara_fara es especialidad independiente — no colombiano/vallenato.",
  },
  "animadores-maestros-ceremonia": {
    fieldId: "rolPrincipal",
    opciones: ["animador", "mc", "presentador", "edecan", "modelo", "mixto"],
  },
  "shows-para-eventos": {
    fieldId: "tipoShow",
    opciones: ["payaso", "mago", "personajes", "comedia", "baile", "fuego", "strippers"],
  },
  "banquetes-catering-eventos": {
    fieldId: "formatoBanquete",
    opciones: ["banquete_emplatado", "buffet", "taquiza", "coffee_break"],
  },
  "renta-mobiliario-eventos": {
    fieldId: "inventarioMobiliario",
    opciones: ["mesas", "sillas", "lounge", "carpas", "vajilla"],
  },
  "renta-equipo-eventos": {
    fieldId: "tipoEquipoRenta",
    opciones: ["audio", "iluminacion", "escenario", "pantallas", "generador"],
  },
  "food-trucks-carritos-eventos": {
    fieldId: "tipoUnidadFood",
    opciones: ["food_truck", "carrito", "puesto", "trailer"],
  },
  "pasteles-reposteria-eventos": {
    fieldId: "productosReposteria",
    opciones: ["pastel_boda", "pastel_xv", "mesa_postres", "cupcakes"],
  },
  "invitaciones-papeleria-eventos": {
    fieldId: "productosPapeleria",
    opciones: ["invitacion_fisica", "invitacion_digital", "save_the_date", "seating_chart"],
  },
  "florerias-eventos": {
    fieldId: "productosFlorales",
    opciones: ["ramos", "arcos", "centros_mesa", "instalacion_completa"],
  },
  "pirotecnia-efectos-especiales": {
    fieldId: "tipoEfectoPirotecnia",
    opciones: ["fuegos_artificiales", "cold_sparks", "confetti", "humo"],
  },
  "seguridad-eventos": {
    fieldId: "especialidadesEvento",
    opciones: ["bodas", "corporativo", "conciertos", "eventos_masivos", "acceso_vip"],
  },
  "valet-parking-eventos": {
    fieldId: "especialidadesEvento",
    opciones: ["bodas", "corporativo", "gala", "restaurante"],
  },
  "transporte-eventos": {
    fieldId: "usoTransporte",
    opciones: ["boda_invitados", "corporativo", "shuttle", "traslado_artistas"],
  },
  "renta-vestuario-disfraces-eventos": {
    fieldId: "categoriasVestuario",
    opciones: ["trajes_formales", "vestidos_gala", "disfraces", "botargas"],
  },
};

/** Campos condicionales — blocks runtime Fase 2; coherencia ValidationEngine Fase 1. */
export const CONDITIONAL_RULES = [
  {
    id: "FARA_FARA_FORMATO",
    when: { field: "tipoAgrupacion", equals: "fara_fara" },
    show: ["descripcionFormatoFaraFara"],
    require: ["descripcionFormatoFaraFara"],
    canon: "grupos-musicales-eventos",
  },
  {
    id: "MC_CEREMONIA",
    when: { field: "rolPrincipal", in: ["mc", "mixto"] },
    show: ["estiloCeremonia", "incluyeGuionCeremonia"],
    require: ["estiloCeremonia"],
    canon: "animadores-maestros-ceremonia",
  },
  {
    id: "ANIMADOR_DINAMICAS",
    when: { field: "rolPrincipal", in: ["animador", "mixto"] },
    show: ["rangoEdadPublico", "dinamicasOfrecidas", "trabajaConMenores"],
    require: ["rangoEdadPublico", "dinamicasOfrecidas"],
    canon: "animadores-maestros-ceremonia",
  },
  {
    id: "MENORES_RESTRICCION_IMAGEN",
    when: { field: "trabajaConMenores", equals: true },
    show: [],
    require: [],
    flags: { restriccionImagenMenores: true, hintFotos: "No subir fotos identificables de menores." },
    canon: "animadores-maestros-ceremonia",
  },
  {
    id: "SHOW_SENSIBLE",
    when: { field: "contenidoSensible", equals: true },
    show: ["disclaimerReguladoEventos"],
    require: ["disclaimerReguladoEventos"],
    flags: { sensible: true, requiresAdminReview: true, nivelRevisionAdmin: "alta" },
    canon: "shows-para-eventos",
  },
  {
    id: "SHOW_STRIPPER",
    when: { field: "tipoShow", includes: "strippers" },
    show: ["contenidoSensible", "disclaimerReguladoEventos"],
    require: ["contenidoSensible", "disclaimerReguladoEventos"],
    flags: { sensible: true, requiresAdminReview: true },
    canon: "shows-para-eventos",
  },
  {
    id: "FOTO_INFANTIL",
    when: { field: "especialidadesEvento", includes: "infantil" },
    flags: { restriccionImagenMenores: true },
    canon: "fotografia-video-eventos",
  },
  {
    id: "DRON_LICENCIA",
    when: { field: "serviciosAudiovisual", includes: "dron" },
    show: ["licenciaDron"],
    require: ["licenciaDron"],
    canon: "fotografia-video-eventos",
  },
  {
    id: "VIAJA_TRASLADO",
    when: { field: "viajaFueraCiudad", equals: true },
    show: ["costoTraslado"],
    require: ["costoTraslado"],
    canon: ["djs-eventos", "grupos-musicales-eventos", "shows-para-eventos"],
  },
  {
    id: "PIROTECNIA_REGULADA",
    when: { field: "tipoEfectoPirotecnia", any: true },
    show: ["licenciaPirotecnia", "jurisdiccionPirotecnia", "polizaSeguroPirotecnia", "disclaimerReguladoEventos"],
    require: ["licenciaPirotecnia", "jurisdiccionPirotecnia", "polizaSeguroPirotecnia", "disclaimerReguladoEventos"],
    flags: { regulada: true, requiresAdminReview: true },
    canon: "pirotecnia-efectos-especiales",
  },
  {
    id: "SEGURIDAD_REGULADA",
    when: { field: "licenciaSeguridadPrivada", equals: true },
    require: ["licenciaSeguridadPrivada", "disclaimerReguladoEventos"],
    flags: { regulada: true, requiresAdminReview: true },
    canon: "seguridad-eventos",
  },
  {
    id: "ALIMENTOS_PERMISO",
    when: { formularioId: "negocio_empresa", pack: "FOOD" },
    show: ["permisoManipulacionAlimentos"],
    require: ["permisoManipulacionAlimentos"],
    canon: ["banquetes-catering-eventos", "food-trucks-carritos-eventos", "pasteles-reposteria-eventos"],
  },
  {
    id: "VALET_POLIZA",
    when: { field: "polizaResponsabilidadValet", equals: false },
    severidad: "warn",
    mensaje: "Se recomienda póliza de responsabilidad civil para valet.",
    canon: "valet-parking-eventos",
  },
  {
    id: "TRANSPORTE_POLIZA",
    show: ["permisoTransporte", "polizaTransporte"],
    require: ["permisoTransporte", "polizaTransporte"],
    canon: "transporte-eventos",
  },
  {
    id: "CAPACIDAD_COHERENCIA",
    when: { field: "capacidadMin", field2: "capacidadMax" },
    validate: "capacidadMin <= capacidadMax",
    severidad: "error",
    mensaje: "La capacidad mínima no puede ser mayor que la máxima.",
    canon: "espacios-para-eventos",
  },
];

/** Perfil de riesgo/regulación por canon. */
export const RISK_PROFILE_BY_CANON = {
  "espacios-para-eventos": { sensible: false, regulada: false, requiresAdminReview: false },
  "organizadores-produccion-eventos": { sensible: false, regulada: false, requiresAdminReview: false },
  "decoracion-ambientacion-eventos": { sensible: false, regulada: false, requiresAdminReview: false },
  "fotografia-video-eventos": {
    sensible: false,
    regulada: false,
    requiresAdminReview: false,
    notas: ["Restricción imagen menores si especialidad infantil."],
  },
  "djs-eventos": { sensible: false, regulada: false, requiresAdminReview: false },
  "grupos-musicales-eventos": { sensible: false, regulada: false, requiresAdminReview: false },
  "animadores-maestros-ceremonia": {
    sensible: false,
    regulada: false,
    requiresAdminReview: false,
    notas: ["trabajaConMenores → cuidado datos/imágenes."],
  },
  "shows-para-eventos": {
    sensible: "condicional",
    regulada: false,
    requiresAdminReview: "condicional",
    notas: [
      "publicoObjetivo=adultos NO implica desnudo.",
      "contenidoSensible=true o tipoShow=strippers → admin review.",
    ],
  },
  "banquetes-catering-eventos": {
    sensible: false,
    regulada: "declarativa",
    requiresAdminReview: false,
    notas: ["permisoManipulacionAlimentos obligatorio."],
  },
  "renta-mobiliario-eventos": { sensible: false, regulada: false, requiresAdminReview: false },
  "renta-equipo-eventos": { sensible: false, regulada: false, requiresAdminReview: false },
  "food-trucks-carritos-eventos": {
    sensible: false,
    regulada: "declarativa",
    requiresAdminReview: false,
    notas: ["permisoManipulacionAlimentos + requiereAguaLuz."],
  },
  "pasteles-reposteria-eventos": {
    sensible: false,
    regulada: "declarativa",
    requiresAdminReview: false,
    notas: ["permisoManipulacionAlimentos."],
  },
  "invitaciones-papeleria-eventos": { sensible: false, regulada: false, requiresAdminReview: false },
  "florerias-eventos": { sensible: false, regulada: false, requiresAdminReview: false },
  "pirotecnia-efectos-especiales": {
    sensible: true,
    regulada: true,
    requiresAdminReview: true,
    nivelRevisionAdmin: "alta",
  },
  "seguridad-eventos": {
    sensible: false,
    regulada: true,
    requiresAdminReview: true,
    nivelRevisionAdmin: "alta",
  },
  "valet-parking-eventos": {
    sensible: false,
    regulada: "declarativa",
    requiresAdminReview: false,
    notas: ["polizaResponsabilidadValet recomendada/obligatoria Fase 1."],
  },
  "transporte-eventos": {
    sensible: false,
    regulada: "declarativa",
    requiresAdminReview: false,
    notas: ["permisoTransporte + polizaTransporte."],
  },
  "renta-vestuario-disfraces-eventos": { sensible: false, regulada: false, requiresAdminReview: false },
};

/** Subs canon que siempre requieren revisión admin (base). */
export const REGULATED_CANON_SUBS = new Set([
  "pirotecnia-efectos-especiales",
  "seguridad-eventos",
]);

export const SENSITIVE_CANON_SUBS = new Set(["shows-para-eventos", "pirotecnia-efectos-especiales"]);

/** UI MATRIZ — Fase 1 (sin runtime blocks). */
export const UI_IND_EVENTOS = "ui_ind_eventos";
export const UI_NEG_EVENTOS = "ui_neg_eventos";

/** heredaDe base por pack — FieldEngine merge chain. */
export const PACK_HEREDA_DE = {
  VENUE: "negocio_venue",
  PROD: "persona_servicio_general",
  CREATIVE: "persona_servicio_profesional",
  MUSIC: "persona_servicio_profesional",
  SHOW: "persona_servicio_profesional",
  FOOD: "negocio_alimentos",
  RENTAL: "negocio_servicios_local",
  FLORAL: "negocio_servicios_local",
  FX: "negocio_servicios_local",
  SECURITY: "negocio_servicios_local",
  VALET: "negocio_servicios_local",
  TRANSPORT: "negocio_servicios_local",
};

export const CATALOG_SEMVER = "1.1.0";
export const SCHEMA_VERSION = "2026-06-27";

/**
 * Deltas reforzados por subcategoría canon.
 * obligatoriosDelta: además de base (alias, geo, fotos según arquetipo).
 * previewFicha: claves para preview en vivo y ficha pública (Fase 3).
 */
export const SUB_DELTAS = {
  "espacios-para-eventos": {
    deltaFields: [
      "tiposEspacio",
      "capacidadMin",
      "capacidadMax",
      "areasIncluidas",
      "estacionamientoCupo",
      "mobiliarioIncluido",
      "cateringPolitica",
      "restriccionRuido",
      "permiteMusicaEnVivo",
      "permitePirotecnia",
      "tiposEventoAceptados",
      "horarioMaximoEvento",
      "permisosMunicipalesVenue",
    ],
    obligatoriosDelta: [
      "tiposEspacio",
      "capacidadMin",
      "capacidadMax",
      "areasIncluidas",
      "estacionamientoCupo",
      "mobiliarioIncluido",
      "cateringPolitica",
      "restriccionRuido",
      "permiteMusicaEnVivo",
      "permitePirotecnia",
      "tiposEventoAceptados",
      "horarioMaximoEvento",
      "geo",
    ],
    coherencia: [{ id: "VENUE_CAP", validate: "capacidadMin <= capacidadMax" }],
    textosAyuda: {
      tiposEspacio: "Incluye quinta, salón, jardín, viñedo — elige todo lo que aplique.",
      cateringPolitica: "Si eres exclusivo, el cliente debe contratar tu banquete.",
    },
    previewFicha: {
      chips: ["tiposEspacio", "tiposEventoAceptados"],
      stats: ["capacidadMin", "capacidadMax", "estacionamientoCupo"],
      rows: ["cateringPolitica", "permiteMusicaEnVivo", "permitePirotecnia", "horarioMaximoEvento"],
      faq: ["restriccionRuido", "mobiliarioIncluido"],
    },
  },
  "organizadores-produccion-eventos": {
    deltaFields: [
      "especialidadesEvento",
      "rolProduccion",
      "tamanoEventoAtendido",
      "presupuestoMinimoMxn",
      "experienciaAnios",
      "incluyeDirectorEvento",
      "eventosReferencia",
      "radioServicioKm",
    ],
    obligatoriosDelta: [
      "especialidadesEvento",
      "rolProduccion",
      "tamanoEventoAtendido",
      "presupuestoMinimoMxn",
      "experienciaAnios",
      "incluyeDirectorEvento",
    ],
    textosAyuda: {
      rolProduccion: "Marca todo lo que realmente coordinas — no solo 'organizo fiestas'.",
      presupuestoMinimoMxn: "Filtra clientes; puedes poner 0 si aceptas cualquier tamaño.",
    },
    previewFicha: {
      chips: ["especialidadesEvento", "tamanoEventoAtendido"],
      stats: ["presupuestoMinimoMxn", "experienciaAnios"],
      rows: ["rolProduccion", "incluyeDirectorEvento"],
    },
  },
  "decoracion-ambientacion-eventos": {
    deltaFields: [
      "especialidadesDecoracion",
      "incluyeMontajeDesmontaje",
      "tiempoMontajeHoras",
      "estructurasPropias",
      "estiloVisual",
      "requiereVisitaVenue",
      "especialidadesEvento",
    ],
    obligatoriosDelta: [
      "especialidadesDecoracion",
      "incluyeMontajeDesmontaje",
      "especialidadesEvento",
      "requiereVisitaVenue",
    ],
    textosAyuda: {
      especialidadesDecoracion: "Piñatas y festejos van aquí — distinto de florería producto floral.",
    },
    previewFicha: {
      chips: ["especialidadesDecoracion", "estiloVisual"],
      rows: ["incluyeMontajeDesmontaje", "estructurasPropias", "tiempoMontajeHoras"],
    },
  },
  "fotografia-video-eventos": {
    deltaFields: [
      "serviciosAudiovisual",
      "especialidadesEvento",
      "horasCobertura",
      "tiempoEntregaDias",
      "incluyeSegundoOperador",
      "licenciaDron",
      "viajaFueraCiudad",
      "costoTraslado",
    ],
    obligatoriosDelta: ["serviciosAudiovisual", "especialidadesEvento", "horasCobertura", "tiempoEntregaDias"],
    previewFicha: {
      chips: ["serviciosAudiovisual", "especialidadesEvento"],
      stats: ["horasCobertura", "tiempoEntregaDias"],
      rows: ["incluyeSegundoOperador", "licenciaDron"],
    },
  },
  "djs-eventos": {
    deltaFields: [
      "especialidadesDj",
      "generosMusicales",
      "duracionSetMinimaHoras",
      "incluyeEquipoDj",
      "aceptaPeticionesEnVivo",
      "experienciaEnEventos",
      "viajaFueraCiudad",
      "costoTraslado",
    ],
    obligatoriosDelta: [
      "especialidadesDj",
      "generosMusicales",
      "duracionSetMinimaHoras",
      "incluyeEquipoDj",
      "aceptaPeticionesEnVivo",
      "experienciaEnEventos",
    ],
    textosAyuda: {
      duracionSetMinimaHoras: "Set mínimo que cobras — no confundir con horario de tu local.",
      incluyeEquipoDj: "Audio, luces, pantalla — lo que traes en tu rider básico.",
    },
    previewFicha: {
      chips: ["generosMusicales", "especialidadesDj"],
      stats: ["duracionSetMinimaHoras"],
      rows: ["incluyeEquipoDj", "aceptaPeticionesEnVivo", "viajaFueraCiudad"],
    },
  },
  "grupos-musicales-eventos": {
    deltaFields: [
      "tipoAgrupacion",
      "numeroIntegrantes",
      "repertorioPrincipal",
      "duracionSetMinutos",
      "numeroSetsIncluidos",
      "incluyeSonidoMusica",
      "aceptaPeticiones",
      "experienciaEnEventos",
      "viajaFueraCiudad",
      "costoTraslado",
      "descripcionFormatoFaraFara",
    ],
    obligatoriosDelta: [
      "tipoAgrupacion",
      "numeroIntegrantes",
      "repertorioPrincipal",
      "duracionSetMinutos",
      "numeroSetsIncluidos",
      "incluyeSonidoMusica",
      "aceptaPeticiones",
      "experienciaEnEventos",
    ],
    textosAyuda: {
      tipoAgrupacion: "Fara Fara es formato propio — selecciónalo si ese es tu show.",
    },
    previewFicha: {
      chips: ["tipoAgrupacion", "repertorioPrincipal"],
      stats: ["numeroIntegrantes", "duracionSetMinutos"],
      rows: ["incluyeSonidoMusica", "aceptaPeticiones", "experienciaEnEventos"],
    },
  },
  "animadores-maestros-ceremonia": {
    deltaFields: [
      "rolPrincipal",
      "rangoEdadPublico",
      "dinamicasOfrecidas",
      "estiloCeremonia",
      "incluyeGuionCeremonia",
      "idiomasAnimacion",
      "trabajaConMenores",
      "especialidadesEvento",
      "duracionShowMinutos",
    ],
    obligatoriosDelta: ["rolPrincipal", "idiomasAnimacion", "especialidadesEvento", "duracionShowMinutos"],
    previewFicha: {
      chips: ["rolPrincipal", "especialidadesEvento"],
      rows: ["rangoEdadPublico", "dinamicasOfrecidas", "estiloCeremonia", "idiomasAnimacion"],
    },
  },
  "shows-para-eventos": {
    deltaFields: [
      "tipoShow",
      "publicoObjetivo",
      "contenidoSensible",
      "duracionShowMinutos",
      "numeroArtistas",
      "requiereEspacioMinimo",
      "incluyeAudioShow",
      "requiereCamerino",
      "restriccionesTecnicas",
      "experienciaAnios",
      "viajaFueraCiudad",
      "costoTraslado",
      "disclaimerReguladoEventos",
    ],
    obligatoriosDelta: [
      "tipoShow",
      "publicoObjetivo",
      "duracionShowMinutos",
      "numeroArtistas",
      "requiereEspacioMinimo",
      "incluyeAudioShow",
      "experienciaAnios",
    ],
    textosAyuda: {
      publicoObjetivo: "Evento para adultos no significa show con desnudez.",
      contenidoSensible: "Marca sí solo si hay desnudez, striptease o contenido explícito.",
    },
    previewFicha: {
      chips: ["tipoShow", "publicoObjetivo"],
      stats: ["duracionShowMinutos", "numeroArtistas"],
      rows: ["requiereEspacioMinimo", "incluyeAudioShow", "viajaFueraCiudad"],
      badge: "contenidoSensible",
    },
  },
  "banquetes-catering-eventos": {
    deltaFields: [
      "formatoBanquete",
      "comensalesMax",
      "menuMuestraDisponible",
      "incluyeMeseros",
      "dietasEspeciales",
      "permisoManipulacionAlimentos",
      "especialidadesEvento",
    ],
    obligatoriosDelta: [
      "formatoBanquete",
      "comensalesMax",
      "incluyeMeseros",
      "permisoManipulacionAlimentos",
      "especialidadesEvento",
    ],
    previewFicha: {
      chips: ["formatoBanquete", "dietasEspeciales"],
      stats: ["comensalesMax"],
      rows: ["incluyeMeseros", "menuMuestraDisponible"],
    },
  },
  "renta-mobiliario-eventos": {
    deltaFields: [
      "inventarioMobiliario",
      "incluyeEntregaRecoleccion",
      "depositoGarantiaMobiliario",
      "minimoRentaMobiliario",
      "especialidadesEvento",
    ],
    obligatoriosDelta: ["inventarioMobiliario", "incluyeEntregaRecoleccion", "minimoRentaMobiliario", "especialidadesEvento"],
    previewFicha: {
      chips: ["inventarioMobiliario"],
      rows: ["incluyeEntregaRecoleccion", "depositoGarantiaMobiliario", "minimoRentaMobiliario"],
    },
  },
  "renta-equipo-eventos": {
    deltaFields: [
      "tipoEquipoRenta",
      "incluyeOperadorTecnico",
      "potenciaAudioWatts",
      "requerimientosElectricos",
      "incluyeEntregaRecoleccion",
      "especialidadesEvento",
    ],
    obligatoriosDelta: ["tipoEquipoRenta", "incluyeOperadorTecnico", "requerimientosElectricos", "especialidadesEvento"],
    previewFicha: {
      chips: ["tipoEquipoRenta"],
      stats: ["potenciaAudioWatts"],
      rows: ["incluyeOperadorTecnico", "requerimientosElectricos"],
    },
  },
  "food-trucks-carritos-eventos": {
    deltaFields: [
      "tipoUnidadFood",
      "cartaPrincipal",
      "comensalesPorHora",
      "permisoManipulacionAlimentos",
      "requiereAguaLuz",
      "radioServicioKm",
      "especialidadesEvento",
    ],
    obligatoriosDelta: [
      "tipoUnidadFood",
      "cartaPrincipal",
      "comensalesPorHora",
      "permisoManipulacionAlimentos",
      "requiereAguaLuz",
    ],
    previewFicha: {
      chips: ["cartaPrincipal", "tipoUnidadFood"],
      stats: ["comensalesPorHora"],
      rows: ["requiereAguaLuz", "radioServicioKm"],
    },
  },
  "pasteles-reposteria-eventos": {
    deltaFields: [
      "productosReposteria",
      "tiempoPedidoAnticipacionDias",
      "incluyeDegustacion",
      "incluyeMontajeMesaPostres",
      "permisoManipulacionAlimentos",
      "especialidadesEvento",
    ],
    obligatoriosDelta: [
      "productosReposteria",
      "tiempoPedidoAnticipacionDias",
      "permisoManipulacionAlimentos",
      "especialidadesEvento",
    ],
    previewFicha: {
      chips: ["productosReposteria"],
      stats: ["tiempoPedidoAnticipacionDias"],
      rows: ["incluyeDegustacion", "incluyeMontajeMesaPostres"],
    },
  },
  "invitaciones-papeleria-eventos": {
    deltaFields: [
      "productosPapeleria",
      "tiempoProduccionDias",
      "revisionesIncluidas",
      "entregaFormato",
      "incluyeDiseno",
      "incluyeImpresion",
    ],
    obligatoriosDelta: [
      "productosPapeleria",
      "tiempoProduccionDias",
      "revisionesIncluidas",
      "entregaFormato",
      "incluyeDiseno",
    ],
    previewFicha: {
      chips: ["productosPapeleria", "entregaFormato"],
      stats: ["tiempoProduccionDias", "revisionesIncluidas"],
    },
  },
  "florerias-eventos": {
    deltaFields: [
      "productosFlorales",
      "incluyeInstalacionFloral",
      "incluyeMontajeDesmontaje",
      "especialidadesEvento",
      "requiereVisitaVenue",
    ],
    obligatoriosDelta: [
      "productosFlorales",
      "incluyeInstalacionFloral",
      "especialidadesEvento",
      "requiereVisitaVenue",
    ],
    textosAyuda: {
      productosFlorales: "Producto floral e instalación — distinto de decoración globos/temática.",
    },
    previewFicha: {
      chips: ["productosFlorales"],
      rows: ["incluyeInstalacionFloral", "requiereVisitaVenue"],
    },
  },
  "pirotecnia-efectos-especiales": {
    deltaFields: [
      "tipoEfectoPirotecnia",
      "ambientePirotecnia",
      "licenciaPirotecnia",
      "jurisdiccionPirotecnia",
      "distanciaSeguridadMetros",
      "polizaSeguroPirotecnia",
      "disclaimerReguladoEventos",
      "especialidadesEvento",
    ],
    obligatoriosDelta: [
      "tipoEfectoPirotecnia",
      "ambientePirotecnia",
      "licenciaPirotecnia",
      "jurisdiccionPirotecnia",
      "distanciaSeguridadMetros",
      "polizaSeguroPirotecnia",
      "disclaimerReguladoEventos",
    ],
    previewFicha: {
      chips: ["tipoEfectoPirotecnia"],
      rows: ["ambientePirotecnia", "distanciaSeguridadMetros", "jurisdiccionPirotecnia"],
      badge: "regulada",
    },
  },
  "seguridad-eventos": {
    deltaFields: [
      "elementosSeguridad",
      "controlAcceso",
      "licenciaSeguridadPrivada",
      "eventosMasivos",
      "especialidadesEvento",
      "disclaimerReguladoEventos",
    ],
    obligatoriosDelta: [
      "elementosSeguridad",
      "controlAcceso",
      "licenciaSeguridadPrivada",
      "disclaimerReguladoEventos",
    ],
    previewFicha: {
      stats: ["elementosSeguridad"],
      rows: ["controlAcceso", "eventosMasivos", "licenciaSeguridadPrivada"],
      badge: "regulada",
    },
  },
  "valet-parking-eventos": {
    deltaFields: [
      "vehiculosPorHora",
      "elementosValet",
      "polizaResponsabilidadValet",
      "uniformeProfesionalValet",
      "coordinacionConVenue",
      "especialidadesEvento",
    ],
    obligatoriosDelta: [
      "vehiculosPorHora",
      "elementosValet",
      "polizaResponsabilidadValet",
      "uniformeProfesionalValet",
      "coordinacionConVenue",
    ],
    previewFicha: {
      stats: ["vehiculosPorHora", "elementosValet"],
      rows: ["polizaResponsabilidadValet", "coordinacionConVenue"],
    },
  },
  "transporte-eventos": {
    deltaFields: [
      "tipoFlotaTransporte",
      "capacidadPasajeros",
      "incluyeChofer",
      "permisoTransporte",
      "polizaTransporte",
      "usoTransporte",
      "radioServicioKm",
    ],
    obligatoriosDelta: [
      "tipoFlotaTransporte",
      "capacidadPasajeros",
      "incluyeChofer",
      "permisoTransporte",
      "polizaTransporte",
      "usoTransporte",
    ],
    previewFicha: {
      chips: ["tipoFlotaTransporte", "usoTransporte"],
      stats: ["capacidadPasajeros"],
      rows: ["incluyeChofer", "permisoTransporte"],
    },
  },
  "renta-vestuario-disfraces-eventos": {
    deltaFields: [
      "categoriasVestuario",
      "tallasDisponibles",
      "higienizacionVestuario",
      "depositoVestuario",
      "especialidadesEvento",
    ],
    obligatoriosDelta: ["categoriasVestuario", "tallasDisponibles", "higienizacionVestuario", "especialidadesEvento"],
    previewFicha: {
      chips: ["categoriasVestuario"],
      rows: ["tallasDisponibles", "higienizacionVestuario", "depositoVestuario"],
    },
  },
};

/** Validaciones mínimas por delta — ValidationEngine coherenciaExtra (Fase 1). */
export const MIN_DELTA_FIELD_COUNT = 5;

export function getCanonDeltaFieldIds(canonId) {
  return SUB_DELTAS[canonId]?.deltaFields || [];
}

export function isDeltaSufficient(canonId) {
  const delta = SUB_DELTAS[canonId];
  if (!delta) return false;
  const specific = delta.deltaFields.filter((f) => !GENERIC_ONLY_FORBIDDEN.includes(f));
  return specific.length >= MIN_DELTA_FIELD_COUNT;
}

/** Plantillas plantillasArquetipo.eventos_pack_* — Fase 1 schema. */
export function buildPackPlantillas() {
  const packs = {};
  for (const packId of PACK_IDS) {
    const subsInPack = CANON_SUBCATEGORIAS.filter((c) => c.pack === packId);
    const allDeltaFields = [...new Set(subsInPack.flatMap((s) => SUB_DELTAS[s.subcategoriaId]?.deltaFields || []))];
    const riskAny = subsInPack.some((s) => REGULATED_CANON_SUBS.has(s.subcategoriaId));
    packs[packPlantillaKey(packId)] = {
      heredaDe: PACK_HEREDA_DE[packId] || "persona_servicio_profesional",
      deltaPack: packId,
      sectorCluster: "eventos",
      camposPublicosPerfil: allDeltaFields.slice(0, 12),
      obligatoriosExtra: [],
      keywordsIA: [PACK_LABELS[packId].toLowerCase(), "eventos", "fiestas"],
      ...(riskAny
        ? {
            regulada: packId === "FX" || packId === "SECURITY",
            requiresAdminReview: packId === "FX" || packId === "SECURITY",
          }
        : {}),
    };
  }
  // Merge obligatorios por sub en apply script — pack plantilla base compartida
  for (const canon of CANON_SUBCATEGORIAS) {
    const key = packPlantillaKey(canon.pack);
    const obl = SUB_DELTAS[canon.subcategoriaId]?.obligatoriosDelta || [];
    packs[key].obligatoriosExtra = [...new Set([...(packs[key].obligatoriosExtra || []), ...obl])];
  }
  // Per-pack overrides
  packs.eventos_pack_fx = {
    ...packs.eventos_pack_fx,
    sensible: true,
    regulada: true,
    requiresAdminReview: true,
    nivelRevisionAdmin: "alta",
    obligatoriosExtra: [
      ...packs.eventos_pack_fx.obligatoriosExtra,
      "disclaimerReguladoEventos",
    ],
    coherenciaExtra: [
      {
        id: "FX_LICENCIA",
        requiere: ["licenciaPirotecnia", "jurisdiccionPirotecnia", "polizaSeguroPirotecnia"],
        severidad: "error",
      },
    ],
  };
  packs.eventos_pack_security = {
    ...packs.eventos_pack_security,
    regulada: true,
    requiresAdminReview: true,
    obligatoriosExtra: [
      ...packs.eventos_pack_security.obligatoriosExtra,
      "licenciaSeguridadPrivada",
      "disclaimerReguladoEventos",
    ],
  };
  packs.eventos_pack_show = {
    ...packs.eventos_pack_show,
    coherenciaExtra: [
      {
        id: "SHOW_SENSIBLE_DISCLAIMER",
        when: { field: "contenidoSensible", equals: true },
        requiere: ["disclaimerReguladoEventos"],
        severidad: "error",
      },
    ],
  };
  packs.eventos_pack_food = {
    ...packs.eventos_pack_food,
    coherenciaExtra: [
      {
        id: "FOOD_PERMISO",
        requiere: ["permisoManipulacionAlimentos"],
        severidad: "error",
        mensaje: "Declara permiso de manipulación de alimentos vigente.",
      },
    ],
  };
  return packs;
}

/** Nested key perfil eventos — anti-contaminación al cambiar sub (Fase 2). */
export const EVENTOS_NESTED_PROFILE_KEY = "eventosPerfil";

export function validateLegacyMapping() {
  const legacyIds = Object.keys(LEGACY_TO_CANON);
  const canonIds = new Set(CANON_SUBCATEGORIAS.map((c) => c.subcategoriaId));
  const errors = [];
  if (legacyIds.length !== 37) errors.push(`LEGACY_TO_CANON debe tener 37 entradas, tiene ${legacyIds.length}`);
  for (const [legacy, canon] of Object.entries(LEGACY_TO_CANON)) {
    if (!canonIds.has(canon)) errors.push(`Legacy ${legacy} → canon desconocido ${canon}`);
  }
  for (const canon of CANON_SUBCATEGORIAS) {
    if (!SUB_DELTAS[canon.subcategoriaId]) errors.push(`Falta SUB_DELTAS para ${canon.subcategoriaId}`);
    if (!isDeltaSufficient(canon.subcategoriaId)) errors.push(`Delta insuficiente (genérico): ${canon.subcategoriaId}`);
    for (const fid of SUB_DELTAS[canon.subcategoriaId]?.deltaFields || []) {
      if (!EVENTOS_FIELD_REGISTRY[fid] && !EVENTOS_BASE_FIELD_IDS.includes(fid) && fid !== "geo") {
        errors.push(`Campo ${fid} en ${canon.subcategoriaId} no está en EVENTOS_FIELD_REGISTRY`);
      }
    }
  }
  return errors;
}
