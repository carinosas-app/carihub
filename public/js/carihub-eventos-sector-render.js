/**
 * Render Preview + Ficha — sector Eventos (MP-EVENTOS-DELTAS-V1 Fase 3).
 * Fuente: scripts/eventos-packs-v1.mjs — regenerar con build-carihub-eventos-sector-render.mjs
 */
(function (global) {
  'use strict';

  var LEGACY_TO_CANON = {
  "dj": "djs-eventos",
  "maestro-de-ceremonias": "animadores-maestros-ceremonia",
  "animador": "animadores-maestros-ceremonia",
  "payaso": "shows-para-eventos",
  "mago": "shows-para-eventos",
  "comediante": "shows-para-eventos",
  "cantante": "grupos-musicales-eventos",
  "mariachi-independiente": "grupos-musicales-eventos",
  "grupo-musical-independiente": "grupos-musicales-eventos",
  "fotografo-de-eventos": "fotografia-video-eventos",
  "videografo": "fotografia-video-eventos",
  "organizador-de-eventos": "organizadores-produccion-eventos",
  "wedding-planner": "organizadores-produccion-eventos",
  "decorador-de-eventos": "decoracion-ambientacion-eventos",
  "sonidista": "renta-equipo-eventos",
  "iluminacion-para-eventos": "renta-equipo-eventos",
  "locutor": "animadores-maestros-ceremonia",
  "presentador": "animadores-maestros-ceremonia",
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
  "espacios-para-eventos": "espacios-para-eventos",
  "organizadores-y-produccion-de-eventos": "organizadores-produccion-eventos",
  "decoracion-y-ambientacion": "decoracion-ambientacion-eventos",
  "fotografia-y-video-para-eventos": "fotografia-video-eventos",
  "dj-s-para-eventos": "djs-eventos",
  "grupos-musicales-para-eventos": "grupos-musicales-eventos",
  "animadores-y-maestros-de-ceremonia": "animadores-maestros-ceremonia",
  "shows-para-eventos": "shows-para-eventos",
  "banquetes-y-catering": "banquetes-catering-eventos",
  "renta-de-equipo-audio-iluminacion-escenarios": "renta-equipo-eventos",
  "food-trucks-y-carritos": "food-trucks-carritos-eventos",
  "pasteles-y-reposteria-para-eventos": "pasteles-reposteria-eventos",
  "invitaciones-y-papeleria": "invitaciones-papeleria-eventos",
  "florerias-para-eventos": "florerias-eventos",
  "pirotecnia-y-efectos-especiales": "pirotecnia-efectos-especiales",
  "seguridad-para-eventos": "seguridad-eventos",
  "valet-parking": "valet-parking-eventos",
  "transporte-para-eventos": "transporte-eventos",
  "renta-de-vestuario-y-disfraces": "renta-vestuario-disfraces-eventos"
};

  var PREVIEW_FICHA = {
  "espacios-para-eventos": {
    "chips": [
      "tiposEspacio",
      "tiposEventoAceptados"
    ],
    "stats": [
      "capacidadMin",
      "capacidadMax",
      "estacionamientoCupo"
    ],
    "rows": [
      "cateringPolitica",
      "permiteMusicaEnVivo",
      "permitePirotecnia",
      "horarioMaximoEvento"
    ],
    "faq": [
      "restriccionRuido",
      "mobiliarioIncluido"
    ]
  },
  "organizadores-produccion-eventos": {
    "chips": [
      "especialidadesEvento",
      "tamanoEventoAtendido"
    ],
    "stats": [
      "presupuestoMinimoMxn",
      "experienciaAnios"
    ],
    "rows": [
      "rolProduccion",
      "incluyeDirectorEvento"
    ]
  },
  "decoracion-ambientacion-eventos": {
    "chips": [
      "especialidadesDecoracion",
      "estiloVisual"
    ],
    "rows": [
      "incluyeMontajeDesmontaje",
      "estructurasPropias",
      "tiempoMontajeHoras"
    ]
  },
  "fotografia-video-eventos": {
    "chips": [
      "serviciosAudiovisual",
      "especialidadesEvento"
    ],
    "stats": [
      "horasCobertura",
      "tiempoEntregaDias"
    ],
    "rows": [
      "incluyeSegundoOperador",
      "licenciaDron"
    ]
  },
  "djs-eventos": {
    "chips": [
      "generosMusicales",
      "especialidadesDj"
    ],
    "stats": [
      "duracionSetMinimaHoras"
    ],
    "rows": [
      "incluyeEquipoDj",
      "aceptaPeticionesEnVivo",
      "viajaFueraCiudad"
    ]
  },
  "grupos-musicales-eventos": {
    "chips": [
      "tipoAgrupacion",
      "repertorioPrincipal"
    ],
    "stats": [
      "numeroIntegrantes",
      "duracionSetMinutos"
    ],
    "rows": [
      "incluyeSonidoMusica",
      "aceptaPeticiones",
      "experienciaEnEventos"
    ]
  },
  "animadores-maestros-ceremonia": {
    "chips": [
      "rolPrincipal",
      "especialidadesEvento"
    ],
    "rows": [
      "rangoEdadPublico",
      "dinamicasOfrecidas",
      "estiloCeremonia",
      "idiomasAnimacion"
    ]
  },
  "shows-para-eventos": {
    "chips": [
      "tipoShow",
      "publicoObjetivo"
    ],
    "stats": [
      "duracionShowMinutos",
      "numeroArtistas"
    ],
    "rows": [
      "requiereEspacioMinimo",
      "incluyeAudioShow",
      "viajaFueraCiudad"
    ],
    "badge": "contenidoSensible"
  },
  "banquetes-catering-eventos": {
    "chips": [
      "formatoBanquete",
      "dietasEspeciales"
    ],
    "stats": [
      "comensalesMax"
    ],
    "rows": [
      "incluyeMeseros",
      "menuMuestraDisponible"
    ]
  },
  "renta-mobiliario-eventos": {
    "chips": [
      "inventarioMobiliario"
    ],
    "rows": [
      "incluyeEntregaRecoleccion",
      "depositoGarantiaMobiliario",
      "minimoRentaMobiliario"
    ]
  },
  "renta-equipo-eventos": {
    "chips": [
      "tipoEquipoRenta"
    ],
    "stats": [
      "potenciaAudioWatts"
    ],
    "rows": [
      "incluyeOperadorTecnico",
      "requerimientosElectricos"
    ]
  },
  "food-trucks-carritos-eventos": {
    "chips": [
      "cartaPrincipal",
      "tipoUnidadFood"
    ],
    "stats": [
      "comensalesPorHora"
    ],
    "rows": [
      "requiereAguaLuz",
      "radioServicioKm"
    ]
  },
  "pasteles-reposteria-eventos": {
    "chips": [
      "productosReposteria"
    ],
    "stats": [
      "tiempoPedidoAnticipacionDias"
    ],
    "rows": [
      "incluyeDegustacion",
      "incluyeMontajeMesaPostres"
    ]
  },
  "invitaciones-papeleria-eventos": {
    "chips": [
      "productosPapeleria",
      "entregaFormato"
    ],
    "stats": [
      "tiempoProduccionDias",
      "revisionesIncluidas"
    ]
  },
  "florerias-eventos": {
    "chips": [
      "productosFlorales"
    ],
    "rows": [
      "incluyeInstalacionFloral",
      "requiereVisitaVenue"
    ]
  },
  "pirotecnia-efectos-especiales": {
    "chips": [
      "tipoEfectoPirotecnia"
    ],
    "rows": [
      "ambientePirotecnia",
      "distanciaSeguridadMetros",
      "jurisdiccionPirotecnia"
    ],
    "badge": "regulada"
  },
  "seguridad-eventos": {
    "stats": [
      "elementosSeguridad"
    ],
    "rows": [
      "controlAcceso",
      "eventosMasivos",
      "licenciaSeguridadPrivada"
    ],
    "badge": "regulada"
  },
  "valet-parking-eventos": {
    "stats": [
      "vehiculosPorHora",
      "elementosValet"
    ],
    "rows": [
      "polizaResponsabilidadValet",
      "coordinacionConVenue"
    ]
  },
  "transporte-eventos": {
    "chips": [
      "tipoFlotaTransporte",
      "usoTransporte"
    ],
    "stats": [
      "capacidadPasajeros"
    ],
    "rows": [
      "incluyeChofer",
      "permisoTransporte"
    ]
  },
  "renta-vestuario-disfraces-eventos": {
    "chips": [
      "categoriasVestuario"
    ],
    "rows": [
      "tallasDisponibles",
      "higienizacionVestuario",
      "depositoVestuario"
    ]
  }
};

  var FIELD_LABELS = {
  "especialidadesEvento": "Tipos de evento que atiendes",
  "tiposEspacio": "Tipo de espacio",
  "capacidadMin": "Capacidad mínima (personas)",
  "capacidadMax": "Capacidad máxima (personas)",
  "areasIncluidas": "Áreas incluidas en el espacio",
  "estacionamientoCupo": "Cupo de estacionamiento",
  "mobiliarioIncluido": "Mobiliario incluido",
  "cateringPolitica": "Política de catering",
  "restriccionRuido": "Restricción de ruido / horario límite música",
  "permiteMusicaEnVivo": "Permite música en vivo",
  "permitePirotecnia": "Permite pirotecnia en el venue",
  "tiposEventoAceptados": "Tipos de evento que aceptas",
  "permisosMunicipalesVenue": "Cuenta con permisos municipales vigentes",
  "horarioMaximoEvento": "Horario máximo del evento",
  "rolProduccion": "Qué coordina tu producción",
  "tamanoEventoAtendido": "Tamaño de evento que atiendes",
  "presupuestoMinimoMxn": "Presupuesto mínimo de proyecto (MXN)",
  "incluyeDirectorEvento": "Incluye director de evento",
  "eventosReferencia": "Eventos de referencia recientes",
  "especialidadesDecoracion": "Estilos y técnicas de decoración",
  "incluyeMontajeDesmontaje": "Montaje y desmontaje",
  "tiempoMontajeHoras": "Tiempo estimado de montaje (horas)",
  "estructurasPropias": "Estructuras propias disponibles",
  "estiloVisual": "Estilos visuales",
  "requiereVisitaVenue": "Requiere visita al venue antes de cotizar",
  "serviciosAudiovisual": "Servicios que ofreces",
  "horasCobertura": "Horas de cobertura incluidas",
  "tiempoEntregaDias": "Tiempo de entrega (días)",
  "incluyeSegundoOperador": "Incluye segundo fotógrafo/videógrafo",
  "licenciaDron": "Cuenta con licencia/registro de dron",
  "especialidadesDj": "Eventos donde te especializas",
  "generosMusicales": "Géneros musicales",
  "duracionSetMinimaHoras": "Duración mínima de set (horas)",
  "incluyeEquipoDj": "Equipo incluido",
  "aceptaPeticionesEnVivo": "Acepta peticiones en vivo",
  "viajaFueraCiudad": "Viaja fuera de tu ciudad",
  "costoTraslado": "Costo de traslado",
  "tipoAgrupacion": "Tipo de agrupación",
  "numeroIntegrantes": "Número de integrantes",
  "repertorioPrincipal": "Repertorio principal",
  "duracionSetMinutos": "Duración de cada set (minutos)",
  "numeroSetsIncluidos": "Sets incluidos por evento",
  "incluyeSonidoMusica": "Incluye equipo de sonido",
  "aceptaPeticiones": "Toca peticiones del público",
  "experienciaEnEventos": "Experiencia en",
  "descripcionFormatoFaraFara": "Describe tu formato Fara Fara",
  "rolPrincipal": "Tu rol principal",
  "rangoEdadPublico": "Rango de edad del público",
  "dinamicasOfrecidas": "Dinámicas y actividades",
  "estiloCeremonia": "Estilo de ceremonia",
  "incluyeGuionCeremonia": "Incluye guion o estructura de ceremonia",
  "idiomasAnimacion": "Idiomas",
  "trabajaConMenores": "Trabaja con menores de edad",
  "tipoShow": "Tipo de show",
  "publicoObjetivo": "Público objetivo",
  "contenidoSensible": "Incluye contenido explícito o show para adultos (+18)",
  "duracionShowMinutos": "Duración del show (minutos)",
  "numeroArtistas": "Número de artistas en escena",
  "requiereEspacioMinimo": "Espacio mínimo requerido",
  "incluyeAudioShow": "Incluye audio / micrófonos",
  "requiereCamerino": "Requiere camerino",
  "restriccionesTecnicas": "Restricciones técnicas",
  "experienciaAnios": "Años de experiencia",
  "formatoBanquete": "Formato de servicio",
  "comensalesMax": "Comensales máximos que atiendes",
  "menuMuestraDisponible": "Ofrece menú de degustación o muestra",
  "incluyeMeseros": "Incluye meseros y servicio",
  "dietasEspeciales": "Dietas que puedes cubrir",
  "permisoManipulacionAlimentos": "Permiso de manipulación de alimentos vigente",
  "inventarioMobiliario": "Mobiliario en renta",
  "incluyeEntregaRecoleccion": "Incluye entrega y recolección",
  "depositoGarantiaMobiliario": "Requiere depósito en garantía",
  "minimoRentaMobiliario": "Mínimo de renta (MXN)",
  "tipoEquipoRenta": "Tipo de equipo",
  "incluyeOperadorTecnico": "Incluye operador técnico",
  "potenciaAudioWatts": "Potencia de audio (W aprox.)",
  "requerimientosElectricos": "Requerimientos eléctricos",
  "tipoUnidadFood": "Tipo de unidad",
  "cartaPrincipal": "Carta o especialidad principal",
  "comensalesPorHora": "Comensales que atiendes por hora",
  "requiereAguaLuz": "Requiere conexión de agua/luz en sitio",
  "radioServicioKm": "Radio de servicio (km)",
  "productosReposteria": "Productos que elaboras",
  "tiempoPedidoAnticipacionDias": "Anticipación mínima de pedido (días)",
  "incluyeDegustacion": "Ofrece degustación previa",
  "incluyeMontajeMesaPostres": "Incluye montaje de mesa de postres",
  "productosPapeleria": "Productos de papelería",
  "tiempoProduccionDias": "Tiempo de producción (días)",
  "revisionesIncluidas": "Revisiones de diseño incluidas",
  "entregaFormato": "Formatos de entrega",
  "incluyeDiseno": "Incluye diseño gráfico",
  "incluyeImpresion": "Incluye impresión",
  "productosFlorales": "Productos florales",
  "incluyeInstalacionFloral": "Incluye instalación y desmontaje",
  "tipoEfectoPirotecnia": "Tipo de efecto",
  "ambientePirotecnia": "Ambiente permitido",
  "licenciaPirotecnia": "Licencia o permiso de pirotecnia vigente",
  "jurisdiccionPirotecnia": "Jurisdicción donde opera",
  "distanciaSeguridadMetros": "Distancia de seguridad requerida (m)",
  "polizaSeguroPirotecnia": "Póliza de seguro vigente",
  "elementosSeguridad": "Elementos de seguridad",
  "controlAcceso": "Ofrece control de acceso / credenciales",
  "licenciaSeguridadPrivada": "Licencia de seguridad privada vigente",
  "eventosMasivos": "Experiencia en eventos masivos (+500 personas)",
  "vehiculosPorHora": "Vehículos que estacionas por hora (aprox.)",
  "elementosValet": "Elementos de valet en equipo",
  "polizaResponsabilidadValet": "Póliza de responsabilidad civil vigente",
  "uniformeProfesionalValet": "Uniforme profesional",
  "coordinacionConVenue": "Coordina con el venue / estacionamiento",
  "tipoFlotaTransporte": "Tipo de flota",
  "capacidadPasajeros": "Capacidad por unidad (pasajeros)",
  "incluyeChofer": "Incluye chofer certificado",
  "permisoTransporte": "Permiso de transporte / SCT vigente",
  "polizaTransporte": "Póliza de seguro de pasajeros vigente",
  "usoTransporte": "Uso principal",
  "categoriasVestuario": "Categorías en renta",
  "tallasDisponibles": "Rango de tallas",
  "higienizacionVestuario": "Higienización entre rentas",
  "depositoVestuario": "Requiere depósito",
  "unidadCotizacion": "Cotizas por",
  "cotizacionDesde": "Cotización desde (MXN)",
  "tagline": "Frase que vende tu servicio",
  "disclaimerReguladoEventos": "Acepto avisos legales y limitaciones del servicio regulado"
};

  var FIELD_TYPES = {
  "especialidadesEvento": "checklist",
  "tiposEspacio": "checklist",
  "capacidadMin": "number",
  "capacidadMax": "number",
  "areasIncluidas": "checklist",
  "estacionamientoCupo": "number",
  "mobiliarioIncluido": "checklist",
  "cateringPolitica": "enum",
  "restriccionRuido": "text",
  "permiteMusicaEnVivo": "boolean",
  "permitePirotecnia": "boolean",
  "tiposEventoAceptados": "checklist",
  "permisosMunicipalesVenue": "boolean",
  "horarioMaximoEvento": "text",
  "rolProduccion": "checklist",
  "tamanoEventoAtendido": "enum",
  "presupuestoMinimoMxn": "number",
  "incluyeDirectorEvento": "boolean",
  "eventosReferencia": "textarea",
  "especialidadesDecoracion": "checklist",
  "incluyeMontajeDesmontaje": "enum",
  "tiempoMontajeHoras": "number",
  "estructurasPropias": "checklist",
  "estiloVisual": "tags",
  "requiereVisitaVenue": "boolean",
  "serviciosAudiovisual": "checklist",
  "horasCobertura": "number",
  "tiempoEntregaDias": "number",
  "incluyeSegundoOperador": "boolean",
  "licenciaDron": "boolean",
  "especialidadesDj": "checklist",
  "generosMusicales": "tags",
  "duracionSetMinimaHoras": "number",
  "incluyeEquipoDj": "checklist",
  "aceptaPeticionesEnVivo": "boolean",
  "viajaFueraCiudad": "boolean",
  "costoTraslado": "enum",
  "tipoAgrupacion": "enum",
  "numeroIntegrantes": "number",
  "repertorioPrincipal": "tags",
  "duracionSetMinutos": "number",
  "numeroSetsIncluidos": "number",
  "incluyeSonidoMusica": "boolean",
  "aceptaPeticiones": "boolean",
  "experienciaEnEventos": "checklist",
  "descripcionFormatoFaraFara": "textarea",
  "rolPrincipal": "enum",
  "rangoEdadPublico": "checklist",
  "dinamicasOfrecidas": "checklist",
  "estiloCeremonia": "checklist",
  "incluyeGuionCeremonia": "boolean",
  "idiomasAnimacion": "tags",
  "trabajaConMenores": "boolean",
  "tipoShow": "checklist",
  "publicoObjetivo": "enum",
  "contenidoSensible": "boolean",
  "duracionShowMinutos": "number",
  "numeroArtistas": "number",
  "requiereEspacioMinimo": "text",
  "incluyeAudioShow": "boolean",
  "requiereCamerino": "boolean",
  "restriccionesTecnicas": "textarea",
  "experienciaAnios": "number",
  "formatoBanquete": "checklist",
  "comensalesMax": "number",
  "menuMuestraDisponible": "boolean",
  "incluyeMeseros": "boolean",
  "dietasEspeciales": "checklist",
  "permisoManipulacionAlimentos": "boolean",
  "inventarioMobiliario": "checklist",
  "incluyeEntregaRecoleccion": "boolean",
  "depositoGarantiaMobiliario": "boolean",
  "minimoRentaMobiliario": "number",
  "tipoEquipoRenta": "checklist",
  "incluyeOperadorTecnico": "boolean",
  "potenciaAudioWatts": "number",
  "requerimientosElectricos": "text",
  "tipoUnidadFood": "enum",
  "cartaPrincipal": "tags",
  "comensalesPorHora": "number",
  "requiereAguaLuz": "boolean",
  "radioServicioKm": "number",
  "productosReposteria": "checklist",
  "tiempoPedidoAnticipacionDias": "number",
  "incluyeDegustacion": "boolean",
  "incluyeMontajeMesaPostres": "boolean",
  "productosPapeleria": "checklist",
  "tiempoProduccionDias": "number",
  "revisionesIncluidas": "number",
  "entregaFormato": "checklist",
  "incluyeDiseno": "boolean",
  "incluyeImpresion": "boolean",
  "productosFlorales": "checklist",
  "incluyeInstalacionFloral": "boolean",
  "tipoEfectoPirotecnia": "checklist",
  "ambientePirotecnia": "enum",
  "licenciaPirotecnia": "boolean",
  "jurisdiccionPirotecnia": "text",
  "distanciaSeguridadMetros": "number",
  "polizaSeguroPirotecnia": "boolean",
  "elementosSeguridad": "number",
  "controlAcceso": "boolean",
  "licenciaSeguridadPrivada": "boolean",
  "eventosMasivos": "boolean",
  "vehiculosPorHora": "number",
  "elementosValet": "number",
  "polizaResponsabilidadValet": "boolean",
  "uniformeProfesionalValet": "boolean",
  "coordinacionConVenue": "boolean",
  "tipoFlotaTransporte": "checklist",
  "capacidadPasajeros": "number",
  "incluyeChofer": "boolean",
  "permisoTransporte": "boolean",
  "polizaTransporte": "boolean",
  "usoTransporte": "checklist",
  "categoriasVestuario": "checklist",
  "tallasDisponibles": "text",
  "higienizacionVestuario": "boolean",
  "depositoVestuario": "boolean",
  "unidadCotizacion": "enum",
  "cotizacionDesde": "number",
  "tagline": "text",
  "disclaimerReguladoEventos": "boolean"
};

  var CANON_BLOCK_TITLES = {
  "espacios-para-eventos": "Tu salón, quinta o espacio para eventos",
  "organizadores-produccion-eventos": "Producción y coordinación de eventos",
  "decoracion-ambientacion-eventos": "Decoración y ambientación para tu evento",
  "fotografia-video-eventos": "Cobertura fotográfica y audiovisual",
  "djs-eventos": "Tu servicio de DJ para fiestas y eventos",
  "grupos-musicales-eventos": "Tu grupo o agrupación musical",
  "animadores-maestros-ceremonia": "Animación, dinámicas y maestro de ceremonias",
  "shows-para-eventos": "Show escénico para tu evento",
  "banquetes-catering-eventos": "Banquetes, buffets y servicio de alimentos",
  "renta-mobiliario-eventos": "Renta de mobiliario para eventos",
  "renta-equipo-eventos": "Renta de equipo técnico para eventos",
  "food-trucks-carritos-eventos": "Food truck o carrito para tu evento",
  "pasteles-reposteria-eventos": "Pasteles, mesa de postres y repostería",
  "invitaciones-papeleria-eventos": "Invitaciones, papelería y diseño gráfico",
  "florerias-eventos": "Flores e instalaciones florales",
  "pirotecnia-efectos-especiales": "Pirotecnia y efectos especiales",
  "seguridad-eventos": "Seguridad privada para eventos",
  "valet-parking-eventos": "Servicio de valet parking",
  "transporte-eventos": "Transporte de invitados y logística",
  "renta-vestuario-disfraces-eventos": "Renta de vestuario, trajes y disfraces"
};

  var NEGOCIO_CANON = [
  "espacios-para-eventos",
  "banquetes-catering-eventos",
  "renta-mobiliario-eventos",
  "renta-equipo-eventos",
  "food-trucks-carritos-eventos",
  "pasteles-reposteria-eventos",
  "florerias-eventos",
  "pirotecnia-efectos-especiales",
  "seguridad-eventos",
  "valet-parking-eventos",
  "transporte-eventos",
  "renta-vestuario-disfraces-eventos"
];

  var PACK_TITLES = {
  "VENUE": "Espacio / venue para eventos",
  "PROD": "Producción y coordinación",
  "CREATIVE": "Creativos (diseño, foto, video, papelería)",
  "MUSIC": "Música en vivo y DJ",
  "SHOW": "Animación, MC y shows escénicos",
  "FOOD": "Alimentos y bebidas para eventos",
  "RENTAL": "Renta de mobiliario, equipo y vestuario",
  "FLORAL": "Florería e instalación floral",
  "FX": "Pirotecnia y efectos especiales",
  "SECURITY": "Seguridad para eventos",
  "VALET": "Valet parking",
  "TRANSPORT": "Transporte para invitados / eventos"
};

  var SUB_TO_PACK = {
  "espacios-para-eventos": "VENUE",
  "organizadores-produccion-eventos": "PROD",
  "decoracion-ambientacion-eventos": "CREATIVE",
  "fotografia-video-eventos": "CREATIVE",
  "djs-eventos": "MUSIC",
  "grupos-musicales-eventos": "MUSIC",
  "animadores-maestros-ceremonia": "SHOW",
  "shows-para-eventos": "SHOW",
  "banquetes-catering-eventos": "FOOD",
  "renta-mobiliario-eventos": "RENTAL",
  "renta-equipo-eventos": "RENTAL",
  "food-trucks-carritos-eventos": "FOOD",
  "pasteles-reposteria-eventos": "FOOD",
  "invitaciones-papeleria-eventos": "CREATIVE",
  "florerias-eventos": "FLORAL",
  "pirotecnia-efectos-especiales": "FX",
  "seguridad-eventos": "SECURITY",
  "valet-parking-eventos": "VALET",
  "transporte-eventos": "TRANSPORT",
  "renta-vestuario-disfraces-eventos": "RENTAL"
};

  var ENUM_LABELS = {
    cateringPolitica: {
      propio_exclusivo: 'Catering propio exclusivo',
      propio_opcional: 'Catering propio opcional',
      externo_permitido: 'Catering externo permitido',
      externo_exclusivo: 'Solo catering externo',
    },
    tipoAgrupacion: {
      fara_fara: 'Fara Fara',
      mariachi: 'Mariachi',
      banda: 'Banda',
      trio: 'Trío',
      solista: 'Solista',
      orquesta: 'Orquesta',
      grupo_regional: 'Grupo regional',
      grupo_tropical: 'Grupo tropical',
      otro: 'Otro formato',
    },
    publicoObjetivo: { infantil: 'Infantil', familiar: 'Familiar', adultos: 'Adultos' },
    rolPrincipal: {
      animador: 'Animador',
      mc: 'MC / maestro de ceremonias',
      presentador: 'Presentador',
      edecan: 'Edecan',
      modelo: 'Modelo',
      mixto: 'Animador + MC',
    },
    tamanoEventoAtendido: { intimo: 'Íntimo', mediano: 'Mediano', masivo: 'Masivo' },
    unidadCotizacion: {
      evento: 'Por evento',
      hora: 'Por hora',
      dia: 'Por día',
      persona: 'Por persona',
      km: 'Por km',
      proyecto: 'Por proyecto',
    },
    costoTraslado: { incluido: 'Traslado incluido', por_km: 'Por km', cotizar_aparte: 'Cotizar aparte' },
    ambientePirotecnia: { exterior: 'Exterior', interior_condicionado: 'Interior condicionado', ambos: 'Interior/exterior' },
    incluyeMontajeDesmontaje: {
      ambos_incluidos: 'Montaje y desmontaje incluidos',
      solo_montaje: 'Solo montaje',
      cotizar_aparte: 'Cotizar aparte',
    },
    tipoUnidadFood: {
      food_truck: 'Food truck',
      carrito: 'Carrito',
      puesto: 'Puesto',
      trailer: 'Trailer',
    },
  };

  function txt(v) {
    return String(v == null ? '' : v).trim();
  }

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolveCanonSubId(u) {
    u = u || {};
    var raw = txt(u.canonSubcategoriaId) || txt(u.subcategoriaId) || txt(u.legacySubcategoriaId);
    var key = slugSubId(raw);
    if (CANON_BLOCK_TITLES[key]) return key;
    return LEGACY_TO_CANON[key] || '';
  }

  function perfilNested(u) {
    return (u && u.eventosPerfil) ? u.eventosPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isEventosSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'eventos' && (u.eventosPerfil || u.deltaPack)) return true;
    if (u.eventosPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isEventosNegocioPerfil(u) {
    var canon = resolveCanonSubId(u);
    return NEGOCIO_CANON.indexOf(canon) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isEventosSectorPerfil(u)) return null;
    return isEventosNegocioPerfil(u) ? 'empresa' : 'pro';
  }

  function joinList(arr) {
    if (!Array.isArray(arr)) return txt(arr);
    return arr.filter(function (x) { return txt(x); }).map(function (x) { return formatEnumValue('', x); }).join(' · ');
  }

  function formatEnumValue(fieldId, val) {
    var k = txt(val);
    if (!k) return '';
    var map = ENUM_LABELS[fieldId];
    if (map && map[k]) return map[k];
    return humanize(k);
  }

  function humanize(v) {
    return String(v).replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function formatFieldValue(fieldId, val) {
    if (val === true) return 'Sí';
    if (val === false) return 'No';
    if (val == null) return '';
    var tipo = FIELD_TYPES[fieldId] || 'text';
    if (tipo === 'boolean') return val === true || val === 'true' || val === 1 ? 'Sí' : (val === false || val === 'false' ? 'No' : txt(val));
    if (tipo === 'checklist' || Array.isArray(val)) return joinList(val);
    if (tipo === 'enum' || tipo === 'select') return formatEnumValue(fieldId, val);
    if (tipo === 'number') return txt(val);
    return txt(val);
  }

  function fieldLabel(fieldId) {
    return FIELD_LABELS[fieldId] || humanize(fieldId);
  }

  function previewFields(canonId) {
    return PREVIEW_FICHA[canonId] || {};
  }

  function collectFieldIds(canonId, kind) {
    var pf = previewFields(canonId);
    var ids = (pf[kind] || []).slice();
    return ids;
  }

  function pushRow(rows, icon, label, value, block) {
    value = txt(value);
    if (!value) return;
    rows.push([icon, label, value, block || '']);
  }

  function buildServiciosList(canonId, p) {
    p = p || {};
    var pf = previewFields(canonId);
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    (pf.stats || []).slice(0, 2).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val && items.indexOf(val) < 0) items.push(fieldLabel(fid) + ': ' + val);
    });
    if (p.tipoAgrupacion === 'fara_fara' && items.indexOf('Fara Fara') < 0) items.unshift('Fara Fara');
    if (p.unidadCotizacion && p.cotizacionDesde) {
      items.push(formatEnumValue('unidadCotizacion', p.unidadCotizacion) + ' · ' + p.cotizacionDesde);
    }
    return items.filter(function (x) { return txt(x); }).slice(0, 8);
  }

  function buildDatosRows(canonId, p, u) {
    p = p || {};
    u = u || {};
    var rows = [];
    var pf = previewFields(canonId);
    var seen = {};
    function addField(fid, icon) {
      if (seen[fid]) return;
      seen[fid] = true;
      var val = formatFieldValue(fid, p[fid]);
      if (!val) return;
      pushRow(rows, icon || '📋', fieldLabel(fid), val);
    }
    (pf.stats || []).forEach(function (fid) { addField(fid, '📊'); });
    (pf.rows || []).forEach(function (fid) { addField(fid, '✨'); });
    (pf.faq || []).slice(0, 2).forEach(function (fid) { addField(fid, 'ℹ️'); });
    if (p.descripcionFormatoFaraFara) pushRow(rows, '🎺', 'Formato Fara Fara', p.descripcionFormatoFaraFara);
    if (p.licenciaDron === true) pushRow(rows, '🚁', 'Licencia dron', 'Cuenta con licencia/registro');
    if (p.viajaFueraCiudad === true && p.costoTraslado) {
      pushRow(rows, '🚐', 'Traslado', formatEnumValue('costoTraslado', p.costoTraslado));
    }
    if (p.unidadCotizacion || p.cotizacionDesde) {
      pushRow(rows, '💲', 'Cotización', [formatEnumValue('unidadCotizacion', p.unidadCotizacion), p.cotizacionDesde].filter(Boolean).join(' · '));
    }
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.radioServicioKm) pushRow(rows, '🗺️', 'Radio de servicio', p.radioServicioKm + ' km');
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var badges = [];
    if (u.sensible === true || p.sensible === true || (canonId === 'shows-para-eventos' && p.contenidoSensible === true)) {
      badges.push({ cls: 'res-badge--sensible', text: 'Contenido sensible' });
    }
    if (u.regulada === true || p.regulada === true || canonId === 'pirotecnia-efectos-especiales' || canonId === 'seguridad-eventos') {
      badges.push({ cls: 'res-badge--regulada', text: 'Servicio regulado' });
    }
    if (u.requiresAdminReview === true || p.requiresAdminReview === true || u.regulada === true) {
      badges.push({ cls: 'res-badge--review', text: 'Revisión administrativa' });
    }
    if (p.tipoAgrupacion === 'fara_fara') badges.push({ cls: 'res-badge--fara-fara', text: 'Fara Fara' });
    return badges;
  }

  function buildReguladaNotice(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    if (canonId === 'pirotecnia-efectos-especiales') {
      return 'Pirotecnia regulada: operación sujeta a permisos, distancias de seguridad y avisos legales. Información declarativa sujeta a verificación administrativa.';
    }
    if (canonId === 'seguridad-eventos') {
      return 'Seguridad privada regulada: licencia y responsabilidad declarativas. CariHub puede solicitar documentación adicional antes de publicar.';
    }
    if (canonId === 'shows-para-eventos' && (p.contenidoSensible === true || (Array.isArray(p.tipoShow) && p.tipoShow.indexOf('strippers') >= 0))) {
      return 'Show para adultos con contenido explícito o stripper: sujeto a revisión administrativa. Evento adulto no implica desnudez automáticamente.';
    }
    if (p.disclaimerReguladoEventos === true && (u.regulada || canonId === 'pirotecnia-efectos-especiales' || canonId === 'seguridad-eventos')) {
      return 'El proveedor declaró aceptar avisos legales y limitaciones del servicio regulado.';
    }
    return '';
  }

  function buildStats(canonId, p) {
    p = p || {};
    var pf = previewFields(canonId);
    var stats = [];
    (pf.stats || []).slice(0, 4).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) stats.push([val, fieldLabel(fid)]);
    });
    while (stats.length < 4) {
      var fillers = [
        ['Eventos', 'Especialidad'],
        ['Cotizar', 'Presupuesto'],
        ['Verificado', 'En plataforma'],
        ['Reserva', 'Sujeta a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(canonId) {
    if (canonId === 'pirotecnia-efectos-especiales' || canonId === 'seguridad-eventos') {
      return ['Permisos declarativos', 'Revisión administrativa', 'Operación regulada', 'Información verificable'];
    }
    if (canonId === 'shows-para-eventos') {
      return ['Show para tu evento', 'Detalle de público y duración', 'Requisitos técnicos claros', 'Cotización transparente'];
    }
    return ['Servicio para eventos', 'Datos útiles del oficio', 'Cotización declarada', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Qué incluye la cotización?', '¿Atienden mi tipo de evento?', '¿Cuál es la cobertura geográfica?', '¿Qué necesito en el venue?'];
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.descripcionFormatoFaraFara) return p.descripcionFormatoFaraFara;
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios profesionales para eventos.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isEventosSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__eventosCanon = canonId;
    u.__eventosPack = pack;
    u.sectorId = u.sectorId || 'eventos';
    u.titulo = u.titulo || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios para eventos';
    u.especialidad = u.especialidad || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = u.precio || p.cotizacionDesde || u.cotizacionDesde || u.tarifaDesde || '';
    u.cotizacionDesde = u.cotizacionDesde || p.cotizacionDesde || u.precio || '';
    u.unidadCotizacion = u.unidadCotizacion || p.unidadCotizacion || '';
    u.nombre = u.nombreComercial || p.nombreComercial || p.alias || u.alias || u.nombre || '';
    u.alias = p.alias || u.alias || u.nombre;
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (isEventosNegocioPerfil(u) ? 'Eventos / cotización' : 'Eventos / contratación directa');
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || locParts.join(', ') || txt(p.jurisdiccionPirotecnia) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    u.__eventosDatos = buildDatosRows(canonId, p, u);
    u.__eventosBadges = buildBadges(u, canonId);
    u.__eventosReguladaNotice = buildReguladaNotice(u, canonId);
    u.__eventosPriceLabel = p.unidadCotizacion ? formatEnumValue('unidadCotizacion', p.unidadCotizacion) : 'Cotización desde';
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Datos personales de menores', 'Promesas no declaradas en el perfil', 'Servicios fuera del alcance publicado'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(canonId);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || 'Agenda sujeta a confirmación';
    if (p.sensible) u.sensible = true;
    if (p.regulada) u.regulada = true;
    if (p.requiresAdminReview) u.requiresAdminReview = true;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__eventosCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.tipoAgrupacion === 'fara_fara') chips.unshift('Fara Fara');
    if (p.unidadCotizacion) chips.push(formatEnumValue('unidadCotizacion', p.unidadCotizacion));
    if (u.__eventosReguladaNotice && (u.regulada || u.requiresAdminReview)) chips.push('Regulado');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubEventosSectorRender = {
    PACK_TITLES: PACK_TITLES,
    isEventosSectorPerfil: isEventosSectorPerfil,
    isEventosNegocioPerfil: isEventosNegocioPerfil,
    resolveVistaPerfil: resolveVistaPerfil,
    resolveCanonSubId: resolveCanonSubId,
    packFrom: packFrom,
    hydrateDisplayFields: hydrateDisplayFields,
    cardMetaChips: cardMetaChips,
    buildServiciosList: buildServiciosList,
    buildDatosRows: buildDatosRows,
    buildBadges: buildBadges,
    formatFieldValue: formatFieldValue,
    fieldLabel: fieldLabel,
  };
})(typeof window !== 'undefined' ? window : globalThis);
