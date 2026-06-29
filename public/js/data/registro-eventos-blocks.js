/**
 * Bloques registro — sector Eventos (20 canon, 12 packs).
 * MP-EVENTOS-DELTAS-V1 Fase 2 — fuente: scripts/eventos-packs-v1.mjs
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
  "pinatas-y-festejos": "decoracion-ambientacion-eventos"
};

  var CANON_META = {
  "espacios-para-eventos": {
    "pack": "VENUE",
    "blockTitle": "Tu salón, quinta o espacio para eventos",
    "formularioId": "negocio_empresa",
    "nombre": "Espacios para Eventos"
  },
  "organizadores-produccion-eventos": {
    "pack": "PROD",
    "blockTitle": "Producción y coordinación de eventos",
    "formularioId": "persona_independiente",
    "nombre": "Organizadores y Producción de Eventos"
  },
  "decoracion-ambientacion-eventos": {
    "pack": "CREATIVE",
    "blockTitle": "Decoración y ambientación para tu evento",
    "formularioId": "persona_independiente",
    "nombre": "Decoración y Ambientación"
  },
  "fotografia-video-eventos": {
    "pack": "CREATIVE",
    "blockTitle": "Cobertura fotográfica y audiovisual",
    "formularioId": "persona_independiente",
    "nombre": "Fotografía y Video para Eventos"
  },
  "djs-eventos": {
    "pack": "MUSIC",
    "blockTitle": "Tu servicio de DJ para fiestas y eventos",
    "formularioId": "persona_independiente",
    "nombre": "DJ's para Eventos"
  },
  "grupos-musicales-eventos": {
    "pack": "MUSIC",
    "blockTitle": "Tu grupo o agrupación musical",
    "formularioId": "persona_independiente",
    "nombre": "Grupos Musicales para Eventos"
  },
  "animadores-maestros-ceremonia": {
    "pack": "SHOW",
    "blockTitle": "Animación, dinámicas y maestro de ceremonias",
    "formularioId": "persona_independiente",
    "nombre": "Animadores y Maestros de Ceremonia"
  },
  "shows-para-eventos": {
    "pack": "SHOW",
    "blockTitle": "Show escénico para tu evento",
    "formularioId": "persona_independiente",
    "nombre": "Shows para Eventos"
  },
  "banquetes-catering-eventos": {
    "pack": "FOOD",
    "blockTitle": "Banquetes, buffets y servicio de alimentos",
    "formularioId": "negocio_empresa",
    "nombre": "Banquetes y Catering"
  },
  "renta-mobiliario-eventos": {
    "pack": "RENTAL",
    "blockTitle": "Renta de mobiliario para eventos",
    "formularioId": "negocio_empresa",
    "nombre": "Renta de Mobiliario"
  },
  "renta-equipo-eventos": {
    "pack": "RENTAL",
    "blockTitle": "Renta de equipo técnico para eventos",
    "formularioId": "negocio_empresa",
    "nombre": "Renta de Equipo (Audio, Iluminación, Escenarios)"
  },
  "food-trucks-carritos-eventos": {
    "pack": "FOOD",
    "blockTitle": "Food truck o carrito para tu evento",
    "formularioId": "negocio_empresa",
    "nombre": "Food Trucks y Carritos"
  },
  "pasteles-reposteria-eventos": {
    "pack": "FOOD",
    "blockTitle": "Pasteles, mesa de postres y repostería",
    "formularioId": "negocio_empresa",
    "nombre": "Pasteles y Repostería para Eventos"
  },
  "invitaciones-papeleria-eventos": {
    "pack": "CREATIVE",
    "blockTitle": "Invitaciones, papelería y diseño gráfico",
    "formularioId": "persona_independiente",
    "nombre": "Invitaciones y Papelería"
  },
  "florerias-eventos": {
    "pack": "FLORAL",
    "blockTitle": "Flores e instalaciones florales",
    "formularioId": "negocio_empresa",
    "nombre": "Florerías para Eventos"
  },
  "pirotecnia-efectos-especiales": {
    "pack": "FX",
    "blockTitle": "Pirotecnia y efectos especiales",
    "formularioId": "negocio_empresa",
    "nombre": "Pirotecnia y Efectos Especiales"
  },
  "seguridad-eventos": {
    "pack": "SECURITY",
    "blockTitle": "Seguridad privada para eventos",
    "formularioId": "negocio_empresa",
    "nombre": "Seguridad para Eventos"
  },
  "valet-parking-eventos": {
    "pack": "VALET",
    "blockTitle": "Servicio de valet parking",
    "formularioId": "negocio_empresa",
    "nombre": "Valet Parking"
  },
  "transporte-eventos": {
    "pack": "TRANSPORT",
    "blockTitle": "Transporte de invitados y logística",
    "formularioId": "negocio_empresa",
    "nombre": "Transporte para Eventos"
  },
  "renta-vestuario-disfraces-eventos": {
    "pack": "RENTAL",
    "blockTitle": "Renta de vestuario, trajes y disfraces",
    "formularioId": "negocio_empresa",
    "nombre": "Renta de Vestuario y Disfraces"
  }
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

  var SUB_DELTAS = {
  "espacios-para-eventos": {
    "deltaFields": [
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
      "permisosMunicipalesVenue"
    ],
    "obligatoriosDelta": [
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
      "geo"
    ],
    "textosAyuda": {
      "tiposEspacio": "Incluye quinta, salón, jardín, viñedo — elige todo lo que aplique.",
      "cateringPolitica": "Si eres exclusivo, el cliente debe contratar tu banquete."
    }
  },
  "organizadores-produccion-eventos": {
    "deltaFields": [
      "especialidadesEvento",
      "rolProduccion",
      "tamanoEventoAtendido",
      "presupuestoMinimoMxn",
      "experienciaAnios",
      "incluyeDirectorEvento",
      "eventosReferencia",
      "radioServicioKm"
    ],
    "obligatoriosDelta": [
      "especialidadesEvento",
      "rolProduccion",
      "tamanoEventoAtendido",
      "presupuestoMinimoMxn",
      "experienciaAnios",
      "incluyeDirectorEvento"
    ],
    "textosAyuda": {
      "rolProduccion": "Marca todo lo que realmente coordinas — no solo 'organizo fiestas'.",
      "presupuestoMinimoMxn": "Filtra clientes; puedes poner 0 si aceptas cualquier tamaño."
    }
  },
  "decoracion-ambientacion-eventos": {
    "deltaFields": [
      "especialidadesDecoracion",
      "incluyeMontajeDesmontaje",
      "tiempoMontajeHoras",
      "estructurasPropias",
      "estiloVisual",
      "requiereVisitaVenue",
      "especialidadesEvento"
    ],
    "obligatoriosDelta": [
      "especialidadesDecoracion",
      "incluyeMontajeDesmontaje",
      "especialidadesEvento",
      "requiereVisitaVenue"
    ],
    "textosAyuda": {
      "especialidadesDecoracion": "Piñatas y festejos van aquí — distinto de florería producto floral."
    }
  },
  "fotografia-video-eventos": {
    "deltaFields": [
      "serviciosAudiovisual",
      "especialidadesEvento",
      "horasCobertura",
      "tiempoEntregaDias",
      "incluyeSegundoOperador",
      "licenciaDron",
      "viajaFueraCiudad",
      "costoTraslado"
    ],
    "obligatoriosDelta": [
      "serviciosAudiovisual",
      "especialidadesEvento",
      "horasCobertura",
      "tiempoEntregaDias"
    ],
    "textosAyuda": {}
  },
  "djs-eventos": {
    "deltaFields": [
      "especialidadesDj",
      "generosMusicales",
      "duracionSetMinimaHoras",
      "incluyeEquipoDj",
      "aceptaPeticionesEnVivo",
      "experienciaEnEventos",
      "viajaFueraCiudad",
      "costoTraslado"
    ],
    "obligatoriosDelta": [
      "especialidadesDj",
      "generosMusicales",
      "duracionSetMinimaHoras",
      "incluyeEquipoDj",
      "aceptaPeticionesEnVivo",
      "experienciaEnEventos"
    ],
    "textosAyuda": {
      "duracionSetMinimaHoras": "Set mínimo que cobras — no confundir con horario de tu local.",
      "incluyeEquipoDj": "Audio, luces, pantalla — lo que traes en tu rider básico."
    }
  },
  "grupos-musicales-eventos": {
    "deltaFields": [
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
      "descripcionFormatoFaraFara"
    ],
    "obligatoriosDelta": [
      "tipoAgrupacion",
      "numeroIntegrantes",
      "repertorioPrincipal",
      "duracionSetMinutos",
      "numeroSetsIncluidos",
      "incluyeSonidoMusica",
      "aceptaPeticiones",
      "experienciaEnEventos"
    ],
    "textosAyuda": {
      "tipoAgrupacion": "Fara Fara es formato propio — selecciónalo si ese es tu show."
    }
  },
  "animadores-maestros-ceremonia": {
    "deltaFields": [
      "rolPrincipal",
      "rangoEdadPublico",
      "dinamicasOfrecidas",
      "estiloCeremonia",
      "incluyeGuionCeremonia",
      "idiomasAnimacion",
      "trabajaConMenores",
      "especialidadesEvento",
      "duracionShowMinutos"
    ],
    "obligatoriosDelta": [
      "rolPrincipal",
      "idiomasAnimacion",
      "especialidadesEvento",
      "duracionShowMinutos"
    ],
    "textosAyuda": {}
  },
  "shows-para-eventos": {
    "deltaFields": [
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
      "disclaimerReguladoEventos"
    ],
    "obligatoriosDelta": [
      "tipoShow",
      "publicoObjetivo",
      "duracionShowMinutos",
      "numeroArtistas",
      "requiereEspacioMinimo",
      "incluyeAudioShow",
      "experienciaAnios"
    ],
    "textosAyuda": {
      "publicoObjetivo": "Evento para adultos no significa show con desnudez.",
      "contenidoSensible": "Marca sí solo si hay desnudez, striptease o contenido explícito."
    }
  },
  "banquetes-catering-eventos": {
    "deltaFields": [
      "formatoBanquete",
      "comensalesMax",
      "menuMuestraDisponible",
      "incluyeMeseros",
      "dietasEspeciales",
      "permisoManipulacionAlimentos",
      "especialidadesEvento"
    ],
    "obligatoriosDelta": [
      "formatoBanquete",
      "comensalesMax",
      "incluyeMeseros",
      "permisoManipulacionAlimentos",
      "especialidadesEvento"
    ],
    "textosAyuda": {}
  },
  "renta-mobiliario-eventos": {
    "deltaFields": [
      "inventarioMobiliario",
      "incluyeEntregaRecoleccion",
      "depositoGarantiaMobiliario",
      "minimoRentaMobiliario",
      "especialidadesEvento"
    ],
    "obligatoriosDelta": [
      "inventarioMobiliario",
      "incluyeEntregaRecoleccion",
      "minimoRentaMobiliario",
      "especialidadesEvento"
    ],
    "textosAyuda": {}
  },
  "renta-equipo-eventos": {
    "deltaFields": [
      "tipoEquipoRenta",
      "incluyeOperadorTecnico",
      "potenciaAudioWatts",
      "requerimientosElectricos",
      "incluyeEntregaRecoleccion",
      "especialidadesEvento"
    ],
    "obligatoriosDelta": [
      "tipoEquipoRenta",
      "incluyeOperadorTecnico",
      "requerimientosElectricos",
      "especialidadesEvento"
    ],
    "textosAyuda": {}
  },
  "food-trucks-carritos-eventos": {
    "deltaFields": [
      "tipoUnidadFood",
      "cartaPrincipal",
      "comensalesPorHora",
      "permisoManipulacionAlimentos",
      "requiereAguaLuz",
      "radioServicioKm",
      "especialidadesEvento"
    ],
    "obligatoriosDelta": [
      "tipoUnidadFood",
      "cartaPrincipal",
      "comensalesPorHora",
      "permisoManipulacionAlimentos",
      "requiereAguaLuz"
    ],
    "textosAyuda": {}
  },
  "pasteles-reposteria-eventos": {
    "deltaFields": [
      "productosReposteria",
      "tiempoPedidoAnticipacionDias",
      "incluyeDegustacion",
      "incluyeMontajeMesaPostres",
      "permisoManipulacionAlimentos",
      "especialidadesEvento"
    ],
    "obligatoriosDelta": [
      "productosReposteria",
      "tiempoPedidoAnticipacionDias",
      "permisoManipulacionAlimentos",
      "especialidadesEvento"
    ],
    "textosAyuda": {}
  },
  "invitaciones-papeleria-eventos": {
    "deltaFields": [
      "productosPapeleria",
      "tiempoProduccionDias",
      "revisionesIncluidas",
      "entregaFormato",
      "incluyeDiseno",
      "incluyeImpresion"
    ],
    "obligatoriosDelta": [
      "productosPapeleria",
      "tiempoProduccionDias",
      "revisionesIncluidas",
      "entregaFormato",
      "incluyeDiseno"
    ],
    "textosAyuda": {}
  },
  "florerias-eventos": {
    "deltaFields": [
      "productosFlorales",
      "incluyeInstalacionFloral",
      "incluyeMontajeDesmontaje",
      "especialidadesEvento",
      "requiereVisitaVenue"
    ],
    "obligatoriosDelta": [
      "productosFlorales",
      "incluyeInstalacionFloral",
      "especialidadesEvento",
      "requiereVisitaVenue"
    ],
    "textosAyuda": {
      "productosFlorales": "Producto floral e instalación — distinto de decoración globos/temática."
    }
  },
  "pirotecnia-efectos-especiales": {
    "deltaFields": [
      "tipoEfectoPirotecnia",
      "ambientePirotecnia",
      "licenciaPirotecnia",
      "jurisdiccionPirotecnia",
      "distanciaSeguridadMetros",
      "polizaSeguroPirotecnia",
      "disclaimerReguladoEventos",
      "especialidadesEvento"
    ],
    "obligatoriosDelta": [
      "tipoEfectoPirotecnia",
      "ambientePirotecnia",
      "licenciaPirotecnia",
      "jurisdiccionPirotecnia",
      "distanciaSeguridadMetros",
      "polizaSeguroPirotecnia",
      "disclaimerReguladoEventos"
    ],
    "textosAyuda": {}
  },
  "seguridad-eventos": {
    "deltaFields": [
      "elementosSeguridad",
      "controlAcceso",
      "licenciaSeguridadPrivada",
      "eventosMasivos",
      "especialidadesEvento",
      "disclaimerReguladoEventos"
    ],
    "obligatoriosDelta": [
      "elementosSeguridad",
      "controlAcceso",
      "licenciaSeguridadPrivada",
      "disclaimerReguladoEventos"
    ],
    "textosAyuda": {}
  },
  "valet-parking-eventos": {
    "deltaFields": [
      "vehiculosPorHora",
      "elementosValet",
      "polizaResponsabilidadValet",
      "uniformeProfesionalValet",
      "coordinacionConVenue",
      "especialidadesEvento"
    ],
    "obligatoriosDelta": [
      "vehiculosPorHora",
      "elementosValet",
      "polizaResponsabilidadValet",
      "uniformeProfesionalValet",
      "coordinacionConVenue"
    ],
    "textosAyuda": {}
  },
  "transporte-eventos": {
    "deltaFields": [
      "tipoFlotaTransporte",
      "capacidadPasajeros",
      "incluyeChofer",
      "permisoTransporte",
      "polizaTransporte",
      "usoTransporte",
      "radioServicioKm"
    ],
    "obligatoriosDelta": [
      "tipoFlotaTransporte",
      "capacidadPasajeros",
      "incluyeChofer",
      "permisoTransporte",
      "polizaTransporte",
      "usoTransporte"
    ],
    "textosAyuda": {}
  },
  "renta-vestuario-disfraces-eventos": {
    "deltaFields": [
      "categoriasVestuario",
      "tallasDisponibles",
      "higienizacionVestuario",
      "depositoVestuario",
      "especialidadesEvento"
    ],
    "obligatoriosDelta": [
      "categoriasVestuario",
      "tallasDisponibles",
      "higienizacionVestuario",
      "especialidadesEvento"
    ],
    "textosAyuda": {}
  }
};

  var CANON_IDS = [
  "espacios-para-eventos",
  "organizadores-produccion-eventos",
  "decoracion-ambientacion-eventos",
  "fotografia-video-eventos",
  "djs-eventos",
  "grupos-musicales-eventos",
  "animadores-maestros-ceremonia",
  "shows-para-eventos",
  "banquetes-catering-eventos",
  "renta-mobiliario-eventos",
  "renta-equipo-eventos",
  "food-trucks-carritos-eventos",
  "pasteles-reposteria-eventos",
  "invitaciones-papeleria-eventos",
  "florerias-eventos",
  "pirotecnia-efectos-especiales",
  "seguridad-eventos",
  "valet-parking-eventos",
  "transporte-eventos",
  "renta-vestuario-disfraces-eventos"
];

  var REGULATED_CANON = [
  "pirotecnia-efectos-especiales",
  "seguridad-eventos"
];

  var UI_IND_EVENTOS = "ui_ind_eventos";
  var UI_NEG_EVENTOS = "ui_neg_eventos";

  var FIELD_REGISTRY = {
  "especialidadesEvento": {
    "id": "especialidadesEvento",
    "label": "Tipos de evento que atiendes",
    "type": "checklist",
    "options": [],
    "hint": ""
  },
  "tiposEspacio": {
    "id": "tiposEspacio",
    "label": "Tipo de espacio",
    "type": "checklist",
    "options": [
      {
        "value": "salon",
        "label": "Salon"
      },
      {
        "value": "quinta",
        "label": "Quinta"
      },
      {
        "value": "jardin",
        "label": "Jardin"
      },
      {
        "value": "terraza",
        "label": "Terraza"
      },
      {
        "value": "hacienda",
        "label": "Hacienda"
      },
      {
        "value": "viniedo",
        "label": "Viniedo"
      },
      {
        "value": "roof_top",
        "label": "Roof Top"
      },
      {
        "value": "salon_industrial",
        "label": "Salon Industrial"
      },
      {
        "value": "otro",
        "label": "Otro"
      }
    ],
    "hint": "Ej.: quinta con jardín, salón con terraza, viñedo."
  },
  "capacidadMin": {
    "id": "capacidadMin",
    "label": "Capacidad mínima (personas)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "capacidadMax": {
    "id": "capacidadMax",
    "label": "Capacidad máxima (personas)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "areasIncluidas": {
    "id": "areasIncluidas",
    "label": "Áreas incluidas en el espacio",
    "type": "checklist",
    "options": [
      {
        "value": "salon",
        "label": "Salon"
      },
      {
        "value": "jardin",
        "label": "Jardin"
      },
      {
        "value": "terraza",
        "label": "Terraza"
      },
      {
        "value": "cocina",
        "label": "Cocina"
      },
      {
        "value": "camerino",
        "label": "Camerino"
      },
      {
        "value": "alberca",
        "label": "Alberca"
      },
      {
        "value": "estacionamiento",
        "label": "Estacionamiento"
      },
      {
        "value": "area_ninos",
        "label": "Area Ninos"
      }
    ],
    "hint": ""
  },
  "estacionamientoCupo": {
    "id": "estacionamientoCupo",
    "label": "Cupo de estacionamiento",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "mobiliarioIncluido": {
    "id": "mobiliarioIncluido",
    "label": "Mobiliario incluido",
    "type": "checklist",
    "options": [
      {
        "value": "mesas",
        "label": "Mesas"
      },
      {
        "value": "sillas",
        "label": "Sillas"
      },
      {
        "value": "manteles",
        "label": "Manteles"
      },
      {
        "value": "sillas_ninos",
        "label": "Sillas Ninos"
      },
      {
        "value": "lounge",
        "label": "Lounge"
      },
      {
        "value": "ninguno",
        "label": "Ninguno"
      }
    ],
    "hint": ""
  },
  "cateringPolitica": {
    "id": "cateringPolitica",
    "label": "Política de catering",
    "type": "select",
    "options": [
      {
        "value": "propio_exclusivo",
        "label": "Propio Exclusivo"
      },
      {
        "value": "propio_opcional",
        "label": "Propio Opcional"
      },
      {
        "value": "externo_permitido",
        "label": "Externo Permitido"
      },
      {
        "value": "externo_exclusivo",
        "label": "Externo Exclusivo"
      }
    ],
    "hint": "¿Deben contratar tu banquete o pueden traer catering externo?"
  },
  "restriccionRuido": {
    "id": "restriccionRuido",
    "label": "Restricción de ruido / horario límite música",
    "type": "text",
    "options": [],
    "hint": "Ej.: música hasta 2:00 am; sin bocinas después de medianoche.",
    "maxLength": 120
  },
  "permiteMusicaEnVivo": {
    "id": "permiteMusicaEnVivo",
    "label": "Permite música en vivo",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "permitePirotecnia": {
    "id": "permitePirotecnia",
    "label": "Permite pirotecnia en el venue",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tiposEventoAceptados": {
    "id": "tiposEventoAceptados",
    "label": "Tipos de evento que aceptas",
    "type": "checklist",
    "options": [
      {
        "value": "infantil",
        "label": "Infantil"
      },
      {
        "value": "xv_anos",
        "label": "XV Anos"
      },
      {
        "value": "boda",
        "label": "Boda"
      },
      {
        "value": "corporativo",
        "label": "Corporativo"
      },
      {
        "value": "social_adulto",
        "label": "Social Adulto"
      },
      {
        "value": "religioso",
        "label": "Religioso"
      },
      {
        "value": "concierto",
        "label": "Concierto"
      },
      {
        "value": "exposicion",
        "label": "Exposicion"
      }
    ],
    "hint": ""
  },
  "permisosMunicipalesVenue": {
    "id": "permisosMunicipalesVenue",
    "label": "Cuenta con permisos municipales vigentes",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioMaximoEvento": {
    "id": "horarioMaximoEvento",
    "label": "Horario máximo del evento",
    "type": "text",
    "options": [],
    "hint": "Ej.: hasta 3:00 am los sábados.",
    "maxLength": 80
  },
  "rolProduccion": {
    "id": "rolProduccion",
    "label": "Qué coordina tu producción",
    "type": "checklist",
    "options": [
      {
        "value": "proveedores",
        "label": "Proveedores"
      },
      {
        "value": "cronograma",
        "label": "Cronograma"
      },
      {
        "value": "montaje_desmontaje",
        "label": "Montaje Desmontaje"
      },
      {
        "value": "diseno_experiencia",
        "label": "Diseno Experiencia"
      },
      {
        "value": "logistica_invitados",
        "label": "Logistica Invitados"
      }
    ],
    "hint": ""
  },
  "tamanoEventoAtendido": {
    "id": "tamanoEventoAtendido",
    "label": "Tamaño de evento que atiendes",
    "type": "select",
    "options": [
      {
        "value": "intimo",
        "label": "Intimo"
      },
      {
        "value": "mediano",
        "label": "Mediano"
      },
      {
        "value": "masivo",
        "label": "Masivo"
      }
    ],
    "hint": ""
  },
  "presupuestoMinimoMxn": {
    "id": "presupuestoMinimoMxn",
    "label": "Presupuesto mínimo de proyecto (MXN)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "incluyeDirectorEvento": {
    "id": "incluyeDirectorEvento",
    "label": "Incluye director de evento",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "eventosReferencia": {
    "id": "eventosReferencia",
    "label": "Eventos de referencia recientes",
    "type": "textarea",
    "options": [],
    "hint": "Menciona 2–3 eventos similares sin datos privados de clientes.",
    "maxLength": 600,
    "rows": 3
  },
  "especialidadesDecoracion": {
    "id": "especialidadesDecoracion",
    "label": "Estilos y técnicas de decoración",
    "type": "checklist",
    "options": [
      {
        "value": "globos",
        "label": "Globos"
      },
      {
        "value": "floral_no_producto",
        "label": "Floral No Producto"
      },
      {
        "value": "tematica",
        "label": "Tematica"
      },
      {
        "value": "backdrop",
        "label": "Backdrop"
      },
      {
        "value": "arcos",
        "label": "Arcos"
      },
      {
        "value": "lounge",
        "label": "Lounge"
      },
      {
        "value": "pinatas_festejos",
        "label": "Pinatas Festejos"
      },
      {
        "value": "iluminacion_decorativa",
        "label": "Iluminacion Decorativa"
      }
    ],
    "hint": ""
  },
  "incluyeMontajeDesmontaje": {
    "id": "incluyeMontajeDesmontaje",
    "label": "Montaje y desmontaje",
    "type": "select",
    "options": [
      {
        "value": "ambos_incluidos",
        "label": "Ambos Incluidos"
      },
      {
        "value": "solo_montaje",
        "label": "Solo Montaje"
      },
      {
        "value": "cotizar_aparte",
        "label": "Cotizar Aparte"
      }
    ],
    "hint": ""
  },
  "tiempoMontajeHoras": {
    "id": "tiempoMontajeHoras",
    "label": "Tiempo estimado de montaje (horas)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "estructurasPropias": {
    "id": "estructurasPropias",
    "label": "Estructuras propias disponibles",
    "type": "checklist",
    "options": [
      {
        "value": "arcos",
        "label": "Arcos"
      },
      {
        "value": "letras",
        "label": "Letras"
      },
      {
        "value": "tarimas",
        "label": "Tarimas"
      },
      {
        "value": "tuneles",
        "label": "Tuneles"
      },
      {
        "value": "carpas",
        "label": "Carpas"
      }
    ],
    "hint": ""
  },
  "estiloVisual": {
    "id": "estiloVisual",
    "label": "Estilos visuales",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "requiereVisitaVenue": {
    "id": "requiereVisitaVenue",
    "label": "Requiere visita al venue antes de cotizar",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "serviciosAudiovisual": {
    "id": "serviciosAudiovisual",
    "label": "Servicios que ofreces",
    "type": "checklist",
    "options": [
      {
        "value": "foto",
        "label": "Foto"
      },
      {
        "value": "video",
        "label": "Video"
      },
      {
        "value": "dron",
        "label": "Dron"
      },
      {
        "value": "video_360",
        "label": "Video 360"
      },
      {
        "value": "same_day_edit",
        "label": "Same Day Edit"
      },
      {
        "value": "photobooth",
        "label": "Photobooth"
      }
    ],
    "hint": ""
  },
  "horasCobertura": {
    "id": "horasCobertura",
    "label": "Horas de cobertura incluidas",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "tiempoEntregaDias": {
    "id": "tiempoEntregaDias",
    "label": "Tiempo de entrega (días)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "incluyeSegundoOperador": {
    "id": "incluyeSegundoOperador",
    "label": "Incluye segundo fotógrafo/videógrafo",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "licenciaDron": {
    "id": "licenciaDron",
    "label": "Cuenta con licencia/registro de dron",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "especialidadesDj": {
    "id": "especialidadesDj",
    "label": "Eventos donde te especializas",
    "type": "checklist",
    "options": [
      {
        "value": "bodas",
        "label": "Bodas"
      },
      {
        "value": "xv_anos",
        "label": "XV Anos"
      },
      {
        "value": "corporativo",
        "label": "Corporativo"
      },
      {
        "value": "privados",
        "label": "Privados"
      },
      {
        "value": "graduaciones",
        "label": "Graduaciones"
      },
      {
        "value": "antros_bares",
        "label": "Antros Bares"
      }
    ],
    "hint": ""
  },
  "generosMusicales": {
    "id": "generosMusicales",
    "label": "Géneros musicales",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "duracionSetMinimaHoras": {
    "id": "duracionSetMinimaHoras",
    "label": "Duración mínima de set (horas)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "incluyeEquipoDj": {
    "id": "incluyeEquipoDj",
    "label": "Equipo incluido",
    "type": "checklist",
    "options": [
      {
        "value": "audio",
        "label": "Audio"
      },
      {
        "value": "luces",
        "label": "Luces"
      },
      {
        "value": "pantalla",
        "label": "Pantalla"
      },
      {
        "value": "microfono",
        "label": "Microfono"
      },
      {
        "value": "cabina",
        "label": "Cabina"
      }
    ],
    "hint": ""
  },
  "aceptaPeticionesEnVivo": {
    "id": "aceptaPeticionesEnVivo",
    "label": "Acepta peticiones en vivo",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "viajaFueraCiudad": {
    "id": "viajaFueraCiudad",
    "label": "Viaja fuera de tu ciudad",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "costoTraslado": {
    "id": "costoTraslado",
    "label": "Costo de traslado",
    "type": "select",
    "options": [
      {
        "value": "incluido",
        "label": "Incluido"
      },
      {
        "value": "por_km",
        "label": "Por Km"
      },
      {
        "value": "cotizar_aparte",
        "label": "Cotizar Aparte"
      }
    ],
    "hint": ""
  },
  "tipoAgrupacion": {
    "id": "tipoAgrupacion",
    "label": "Tipo de agrupación",
    "type": "select",
    "options": [
      {
        "value": "mariachi",
        "label": "Mariachi"
      },
      {
        "value": "banda",
        "label": "Banda"
      },
      {
        "value": "trio",
        "label": "Trio"
      },
      {
        "value": "solista",
        "label": "Solista"
      },
      {
        "value": "orquesta",
        "label": "Orquesta"
      },
      {
        "value": "grupo_regional",
        "label": "Grupo Regional"
      },
      {
        "value": "fara_fara",
        "label": "Fara Fara"
      },
      {
        "value": "grupo_tropical",
        "label": "Grupo Tropical"
      },
      {
        "value": "otro",
        "label": "Otro"
      }
    ],
    "hint": "Fara Fara es formato propio — no lo confundas con vallenato o regional colombiano."
  },
  "numeroIntegrantes": {
    "id": "numeroIntegrantes",
    "label": "Número de integrantes",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "repertorioPrincipal": {
    "id": "repertorioPrincipal",
    "label": "Repertorio principal",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "duracionSetMinutos": {
    "id": "duracionSetMinutos",
    "label": "Duración de cada set (minutos)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "numeroSetsIncluidos": {
    "id": "numeroSetsIncluidos",
    "label": "Sets incluidos por evento",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "incluyeSonidoMusica": {
    "id": "incluyeSonidoMusica",
    "label": "Incluye equipo de sonido",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "aceptaPeticiones": {
    "id": "aceptaPeticiones",
    "label": "Toca peticiones del público",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "experienciaEnEventos": {
    "id": "experienciaEnEventos",
    "label": "Experiencia en",
    "type": "checklist",
    "options": [
      {
        "value": "bodas",
        "label": "Bodas"
      },
      {
        "value": "xv_anos",
        "label": "XV Anos"
      },
      {
        "value": "empresariales",
        "label": "Empresariales"
      },
      {
        "value": "fiestas_privadas",
        "label": "Fiestas Privadas"
      },
      {
        "value": "conciertos",
        "label": "Conciertos"
      }
    ],
    "hint": ""
  },
  "descripcionFormatoFaraFara": {
    "id": "descripcionFormatoFaraFara",
    "label": "Describe tu formato Fara Fara",
    "type": "textarea",
    "options": [],
    "hint": "Duración típica, dinámica con el público, repertorio característico.",
    "maxLength": 400,
    "rows": 3
  },
  "rolPrincipal": {
    "id": "rolPrincipal",
    "label": "Tu rol principal",
    "type": "select",
    "options": [
      {
        "value": "animador",
        "label": "Animador"
      },
      {
        "value": "mc",
        "label": "MC"
      },
      {
        "value": "presentador",
        "label": "Presentador"
      },
      {
        "value": "edecan",
        "label": "Edecan"
      },
      {
        "value": "modelo",
        "label": "Modelo"
      },
      {
        "value": "mixto",
        "label": "Mixto"
      }
    ],
    "hint": ""
  },
  "rangoEdadPublico": {
    "id": "rangoEdadPublico",
    "label": "Rango de edad del público",
    "type": "checklist",
    "options": [
      {
        "value": "infantil",
        "label": "Infantil"
      },
      {
        "value": "familiar",
        "label": "Familiar"
      },
      {
        "value": "adolescentes",
        "label": "Adolescentes"
      },
      {
        "value": "adultos",
        "label": "Adultos"
      }
    ],
    "hint": ""
  },
  "dinamicasOfrecidas": {
    "id": "dinamicasOfrecidas",
    "label": "Dinámicas y actividades",
    "type": "checklist",
    "options": [
      {
        "value": "concursos",
        "label": "Concursos"
      },
      {
        "value": "juegos",
        "label": "Juegos"
      },
      {
        "value": "show_participativo",
        "label": "Show Participativo"
      },
      {
        "value": "baile",
        "label": "Baile"
      },
      {
        "value": "magia_ligera",
        "label": "Magia Ligera"
      }
    ],
    "hint": ""
  },
  "estiloCeremonia": {
    "id": "estiloCeremonia",
    "label": "Estilo de ceremonia",
    "type": "checklist",
    "options": [
      {
        "value": "religiosa",
        "label": "Religiosa"
      },
      {
        "value": "civil",
        "label": "Civil"
      },
      {
        "value": "hibrida",
        "label": "Hibrida"
      },
      {
        "value": "corporativa",
        "label": "Corporativa"
      },
      {
        "value": "xv_anos",
        "label": "XV Anos"
      }
    ],
    "hint": ""
  },
  "incluyeGuionCeremonia": {
    "id": "incluyeGuionCeremonia",
    "label": "Incluye guion o estructura de ceremonia",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "idiomasAnimacion": {
    "id": "idiomasAnimacion",
    "label": "Idiomas",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "trabajaConMenores": {
    "id": "trabajaConMenores",
    "label": "Trabaja con menores de edad",
    "type": "boolean",
    "options": [],
    "hint": "Si sí: no subas fotos identificables de niños sin autorización documentada."
  },
  "tipoShow": {
    "id": "tipoShow",
    "label": "Tipo de show",
    "type": "checklist",
    "options": [
      {
        "value": "payaso",
        "label": "Payaso"
      },
      {
        "value": "mago",
        "label": "Mago"
      },
      {
        "value": "personajes",
        "label": "Personajes"
      },
      {
        "value": "comedia",
        "label": "Comedia"
      },
      {
        "value": "baile",
        "label": "Baile"
      },
      {
        "value": "fuego",
        "label": "Fuego"
      },
      {
        "value": "strippers",
        "label": "Strippers"
      },
      {
        "value": "otro",
        "label": "Otro"
      }
    ],
    "hint": ""
  },
  "publicoObjetivo": {
    "id": "publicoObjetivo",
    "label": "Público objetivo",
    "type": "select",
    "options": [
      {
        "value": "infantil",
        "label": "Infantil"
      },
      {
        "value": "familiar",
        "label": "Familiar"
      },
      {
        "value": "adultos",
        "label": "Adultos"
      }
    ],
    "hint": "Show adulto no implica desnudo automáticamente."
  },
  "contenidoSensible": {
    "id": "contenidoSensible",
    "label": "Incluye contenido explícito o show para adultos (+18)",
    "type": "boolean",
    "options": [],
    "hint": "Marca sí solo si hay desnudez, striptease u otro contenido explícito."
  },
  "duracionShowMinutos": {
    "id": "duracionShowMinutos",
    "label": "Duración del show (minutos)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "numeroArtistas": {
    "id": "numeroArtistas",
    "label": "Número de artistas en escena",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "requiereEspacioMinimo": {
    "id": "requiereEspacioMinimo",
    "label": "Espacio mínimo requerido",
    "type": "text",
    "options": [],
    "hint": "Ej.: 4×4 m, escenario elevado, pista despejada.",
    "maxLength": 120
  },
  "incluyeAudioShow": {
    "id": "incluyeAudioShow",
    "label": "Incluye audio / micrófonos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "requiereCamerino": {
    "id": "requiereCamerino",
    "label": "Requiere camerino",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "restriccionesTecnicas": {
    "id": "restriccionesTecnicas",
    "label": "Restricciones técnicas",
    "type": "textarea",
    "options": [],
    "hint": "",
    "maxLength": 600,
    "rows": 3
  },
  "experienciaAnios": {
    "id": "experienciaAnios",
    "label": "Años de experiencia",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "formatoBanquete": {
    "id": "formatoBanquete",
    "label": "Formato de servicio",
    "type": "checklist",
    "options": [
      {
        "value": "banquete_emplatado",
        "label": "Banquete Emplatado"
      },
      {
        "value": "buffet",
        "label": "Buffet"
      },
      {
        "value": "taquiza",
        "label": "Taquiza"
      },
      {
        "value": "barra_snacks",
        "label": "Barra Snacks"
      },
      {
        "value": "coffee_break",
        "label": "Coffee Break"
      }
    ],
    "hint": ""
  },
  "comensalesMax": {
    "id": "comensalesMax",
    "label": "Comensales máximos que atiendes",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "menuMuestraDisponible": {
    "id": "menuMuestraDisponible",
    "label": "Ofrece menú de degustación o muestra",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "incluyeMeseros": {
    "id": "incluyeMeseros",
    "label": "Incluye meseros y servicio",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "dietasEspeciales": {
    "id": "dietasEspeciales",
    "label": "Dietas que puedes cubrir",
    "type": "checklist",
    "options": [
      {
        "value": "vegetariano",
        "label": "Vegetariano"
      },
      {
        "value": "vegano",
        "label": "Vegano"
      },
      {
        "value": "sin_gluten",
        "label": "Sin Gluten"
      },
      {
        "value": "kosher",
        "label": "Kosher"
      },
      {
        "value": "halal",
        "label": "Halal"
      },
      {
        "value": "sin_mariscos",
        "label": "Sin Mariscos"
      }
    ],
    "hint": ""
  },
  "permisoManipulacionAlimentos": {
    "id": "permisoManipulacionAlimentos",
    "label": "Permiso de manipulación de alimentos vigente",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "inventarioMobiliario": {
    "id": "inventarioMobiliario",
    "label": "Mobiliario en renta",
    "type": "checklist",
    "options": [
      {
        "value": "mesas",
        "label": "Mesas"
      },
      {
        "value": "sillas",
        "label": "Sillas"
      },
      {
        "value": "sillas_ninos",
        "label": "Sillas Ninos"
      },
      {
        "value": "manteles",
        "label": "Manteles"
      },
      {
        "value": "vajilla",
        "label": "Vajilla"
      },
      {
        "value": "lounge",
        "label": "Lounge"
      },
      {
        "value": "carpas",
        "label": "Carpas"
      }
    ],
    "hint": ""
  },
  "incluyeEntregaRecoleccion": {
    "id": "incluyeEntregaRecoleccion",
    "label": "Incluye entrega y recolección",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "depositoGarantiaMobiliario": {
    "id": "depositoGarantiaMobiliario",
    "label": "Requiere depósito en garantía",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "minimoRentaMobiliario": {
    "id": "minimoRentaMobiliario",
    "label": "Mínimo de renta (MXN)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "tipoEquipoRenta": {
    "id": "tipoEquipoRenta",
    "label": "Tipo de equipo",
    "type": "checklist",
    "options": [
      {
        "value": "audio",
        "label": "Audio"
      },
      {
        "value": "iluminacion",
        "label": "Iluminacion"
      },
      {
        "value": "escenario",
        "label": "Escenario"
      },
      {
        "value": "pantallas",
        "label": "Pantallas"
      },
      {
        "value": "generador",
        "label": "Generador"
      },
      {
        "value": "efectos_humo",
        "label": "Efectos Humo"
      }
    ],
    "hint": ""
  },
  "incluyeOperadorTecnico": {
    "id": "incluyeOperadorTecnico",
    "label": "Incluye operador técnico",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "potenciaAudioWatts": {
    "id": "potenciaAudioWatts",
    "label": "Potencia de audio (W aprox.)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "requerimientosElectricos": {
    "id": "requerimientosElectricos",
    "label": "Requerimientos eléctricos",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "tipoUnidadFood": {
    "id": "tipoUnidadFood",
    "label": "Tipo de unidad",
    "type": "select",
    "options": [
      {
        "value": "food_truck",
        "label": "Food Truck"
      },
      {
        "value": "carrito",
        "label": "Carrito"
      },
      {
        "value": "puesto",
        "label": "Puesto"
      },
      {
        "value": "trailer",
        "label": "Trailer"
      }
    ],
    "hint": ""
  },
  "cartaPrincipal": {
    "id": "cartaPrincipal",
    "label": "Carta o especialidad principal",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "comensalesPorHora": {
    "id": "comensalesPorHora",
    "label": "Comensales que atiendes por hora",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "requiereAguaLuz": {
    "id": "requiereAguaLuz",
    "label": "Requiere conexión de agua/luz en sitio",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "radioServicioKm": {
    "id": "radioServicioKm",
    "label": "Radio de servicio (km)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "productosReposteria": {
    "id": "productosReposteria",
    "label": "Productos que elaboras",
    "type": "checklist",
    "options": [
      {
        "value": "pastel_boda",
        "label": "Pastel Boda"
      },
      {
        "value": "pastel_xv",
        "label": "Pastel XV"
      },
      {
        "value": "cupcakes",
        "label": "Cupcakes"
      },
      {
        "value": "mesa_postres",
        "label": "Mesa Postres"
      },
      {
        "value": "galletas",
        "label": "Galletas"
      },
      {
        "value": "personalizado",
        "label": "Personalizado"
      }
    ],
    "hint": ""
  },
  "tiempoPedidoAnticipacionDias": {
    "id": "tiempoPedidoAnticipacionDias",
    "label": "Anticipación mínima de pedido (días)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "incluyeDegustacion": {
    "id": "incluyeDegustacion",
    "label": "Ofrece degustación previa",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "incluyeMontajeMesaPostres": {
    "id": "incluyeMontajeMesaPostres",
    "label": "Incluye montaje de mesa de postres",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "productosPapeleria": {
    "id": "productosPapeleria",
    "label": "Productos de papelería",
    "type": "checklist",
    "options": [
      {
        "value": "invitacion_fisica",
        "label": "Invitacion Fisica"
      },
      {
        "value": "invitacion_digital",
        "label": "Invitacion Digital"
      },
      {
        "value": "save_the_date",
        "label": "Save The Date"
      },
      {
        "value": "menu",
        "label": "Menu"
      },
      {
        "value": "seating_chart",
        "label": "Seating Chart"
      },
      {
        "value": "recuerdos",
        "label": "Recuerdos"
      }
    ],
    "hint": ""
  },
  "tiempoProduccionDias": {
    "id": "tiempoProduccionDias",
    "label": "Tiempo de producción (días)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "revisionesIncluidas": {
    "id": "revisionesIncluidas",
    "label": "Revisiones de diseño incluidas",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "entregaFormato": {
    "id": "entregaFormato",
    "label": "Formatos de entrega",
    "type": "checklist",
    "options": [
      {
        "value": "impresion",
        "label": "Impresion"
      },
      {
        "value": "pdf",
        "label": "Pdf"
      },
      {
        "value": "web",
        "label": "Web"
      },
      {
        "value": "qr",
        "label": "Qr"
      }
    ],
    "hint": ""
  },
  "incluyeDiseno": {
    "id": "incluyeDiseno",
    "label": "Incluye diseño gráfico",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "incluyeImpresion": {
    "id": "incluyeImpresion",
    "label": "Incluye impresión",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "productosFlorales": {
    "id": "productosFlorales",
    "label": "Productos florales",
    "type": "checklist",
    "options": [
      {
        "value": "ramos",
        "label": "Ramos"
      },
      {
        "value": "arcos",
        "label": "Arcos"
      },
      {
        "value": "centros_mesa",
        "label": "Centros Mesa"
      },
      {
        "value": "instalacion_completa",
        "label": "Instalacion Completa"
      },
      {
        "value": "preservadas",
        "label": "Preservadas"
      },
      {
        "value": "temporada",
        "label": "Temporada"
      }
    ],
    "hint": ""
  },
  "incluyeInstalacionFloral": {
    "id": "incluyeInstalacionFloral",
    "label": "Incluye instalación y desmontaje",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tipoEfectoPirotecnia": {
    "id": "tipoEfectoPirotecnia",
    "label": "Tipo de efecto",
    "type": "checklist",
    "options": [
      {
        "value": "fuegos_artificiales",
        "label": "Fuegos Artificiales"
      },
      {
        "value": "cold_sparks",
        "label": "Cold Sparks"
      },
      {
        "value": "confetti",
        "label": "Confetti"
      },
      {
        "value": "humo",
        "label": "Humo"
      },
      {
        "value": "laser",
        "label": "Laser"
      }
    ],
    "hint": ""
  },
  "ambientePirotecnia": {
    "id": "ambientePirotecnia",
    "label": "Ambiente permitido",
    "type": "select",
    "options": [
      {
        "value": "exterior",
        "label": "Exterior"
      },
      {
        "value": "interior_condicionado",
        "label": "Interior Condicionado"
      },
      {
        "value": "ambos",
        "label": "Ambos"
      }
    ],
    "hint": ""
  },
  "licenciaPirotecnia": {
    "id": "licenciaPirotecnia",
    "label": "Licencia o permiso de pirotecnia vigente",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "jurisdiccionPirotecnia": {
    "id": "jurisdiccionPirotecnia",
    "label": "Jurisdicción donde opera",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "distanciaSeguridadMetros": {
    "id": "distanciaSeguridadMetros",
    "label": "Distancia de seguridad requerida (m)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "polizaSeguroPirotecnia": {
    "id": "polizaSeguroPirotecnia",
    "label": "Póliza de seguro vigente",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "elementosSeguridad": {
    "id": "elementosSeguridad",
    "label": "Elementos de seguridad",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "controlAcceso": {
    "id": "controlAcceso",
    "label": "Ofrece control de acceso / credenciales",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "licenciaSeguridadPrivada": {
    "id": "licenciaSeguridadPrivada",
    "label": "Licencia de seguridad privada vigente",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "eventosMasivos": {
    "id": "eventosMasivos",
    "label": "Experiencia en eventos masivos (+500 personas)",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "vehiculosPorHora": {
    "id": "vehiculosPorHora",
    "label": "Vehículos que estacionas por hora (aprox.)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "elementosValet": {
    "id": "elementosValet",
    "label": "Elementos de valet en equipo",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "polizaResponsabilidadValet": {
    "id": "polizaResponsabilidadValet",
    "label": "Póliza de responsabilidad civil vigente",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "uniformeProfesionalValet": {
    "id": "uniformeProfesionalValet",
    "label": "Uniforme profesional",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "coordinacionConVenue": {
    "id": "coordinacionConVenue",
    "label": "Coordina con el venue / estacionamiento",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tipoFlotaTransporte": {
    "id": "tipoFlotaTransporte",
    "label": "Tipo de flota",
    "type": "checklist",
    "options": [
      {
        "value": "sprinter",
        "label": "Sprinter"
      },
      {
        "value": "autobus",
        "label": "Autobus"
      },
      {
        "value": "suv",
        "label": "Suv"
      },
      {
        "value": "sedan_ejecutivo",
        "label": "Sedan Ejecutivo"
      },
      {
        "value": "limousine",
        "label": "Limousine"
      },
      {
        "value": "shuttle",
        "label": "Shuttle"
      }
    ],
    "hint": ""
  },
  "capacidadPasajeros": {
    "id": "capacidadPasajeros",
    "label": "Capacidad por unidad (pasajeros)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "incluyeChofer": {
    "id": "incluyeChofer",
    "label": "Incluye chofer certificado",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "permisoTransporte": {
    "id": "permisoTransporte",
    "label": "Permiso de transporte / SCT vigente",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "polizaTransporte": {
    "id": "polizaTransporte",
    "label": "Póliza de seguro de pasajeros vigente",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "usoTransporte": {
    "id": "usoTransporte",
    "label": "Uso principal",
    "type": "checklist",
    "options": [
      {
        "value": "boda_invitados",
        "label": "Boda Invitados"
      },
      {
        "value": "corporativo",
        "label": "Corporativo"
      },
      {
        "value": "shuttle",
        "label": "Shuttle"
      },
      {
        "value": "traslado_artistas",
        "label": "Traslado Artistas"
      }
    ],
    "hint": ""
  },
  "categoriasVestuario": {
    "id": "categoriasVestuario",
    "label": "Categorías en renta",
    "type": "checklist",
    "options": [
      {
        "value": "trajes_formales",
        "label": "Trajes Formales"
      },
      {
        "value": "vestidos_gala",
        "label": "Vestidos Gala"
      },
      {
        "value": "disfraces",
        "label": "Disfraces"
      },
      {
        "value": "botargas",
        "label": "Botargas"
      },
      {
        "value": "accesorios",
        "label": "Accesorios"
      }
    ],
    "hint": ""
  },
  "tallasDisponibles": {
    "id": "tallasDisponibles",
    "label": "Rango de tallas",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "higienizacionVestuario": {
    "id": "higienizacionVestuario",
    "label": "Higienización entre rentas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "depositoVestuario": {
    "id": "depositoVestuario",
    "label": "Requiere depósito",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "unidadCotizacion": {
    "id": "unidadCotizacion",
    "label": "Cotizas por",
    "type": "select",
    "options": [
      {
        "value": "evento",
        "label": "Evento"
      },
      {
        "value": "hora",
        "label": "Hora"
      },
      {
        "value": "dia",
        "label": "Dia"
      },
      {
        "value": "persona",
        "label": "Persona"
      },
      {
        "value": "km",
        "label": "Km"
      },
      {
        "value": "proyecto",
        "label": "Proyecto"
      }
    ],
    "hint": ""
  },
  "cotizacionDesde": {
    "id": "cotizacionDesde",
    "label": "Cotización desde (MXN)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "tagline": {
    "id": "tagline",
    "label": "Frase que vende tu servicio",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "disclaimerReguladoEventos": {
    "id": "disclaimerReguladoEventos",
    "label": "Acepto avisos legales y limitaciones del servicio regulado",
    "type": "boolean",
    "options": [],
    "hint": ""
  }
};

  var SHOW_WHEN_OVERRIDES = {
  "descripcionFormatoFaraFara": {
    "field": "tipoAgrupacion",
    "values": [
      "fara_fara"
    ]
  },
  "estiloCeremonia": {
    "field": "rolPrincipal",
    "values": [
      "mc",
      "mixto"
    ]
  },
  "incluyeGuionCeremonia": {
    "field": "rolPrincipal",
    "values": [
      "mc",
      "mixto"
    ]
  },
  "rangoEdadPublico": {
    "field": "rolPrincipal",
    "values": [
      "animador",
      "mixto"
    ]
  },
  "dinamicasOfrecidas": {
    "field": "rolPrincipal",
    "values": [
      "animador",
      "mixto"
    ]
  },
  "trabajaConMenores": {
    "field": "rolPrincipal",
    "values": [
      "animador",
      "mixto"
    ]
  },
  "licenciaDron": {
    "field": "serviciosAudiovisual",
    "includes": "dron"
  },
  "costoTraslado": {
    "field": "viajaFueraCiudad",
    "truthy": true
  }
};

  var MENORES_CANON = [
  "animadores-maestros-ceremonia",
  "fotografia-video-eventos",
  "shows-para-eventos"
];

  var MENORES_COPY = 'Protección de imagen de menores: no solicites ni publiques datos personales de niños. Evita fotos identificables sin autorización documentada.';

  var GENERIC_FORBIDDEN_IDS = ['descripcion', 'horario', 'ubicacion', 'precioDesde', 'serviciosIncluidos'];

  var FOOD_PACK_CANON = ['banquetes-catering-eventos', 'food-trucks-carritos-eventos', 'pasteles-reposteria-eventos'];

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolveCanonSubId(raw) {
    var key = slugSubId(raw);
    if (!key) return '';
    if (CANON_META[key]) return key;
    return LEGACY_TO_CANON[key] || '';
  }

  function resolvePack(canonId) {
    return SUB_TO_PACK[canonId] || '';
  }

  function showWhenForField(fieldId) {
    return SHOW_WHEN_OVERRIDES[fieldId] || null;
  }

  function fieldFromRegistry(fieldId, required, canonId) {
    var reg = FIELD_REGISTRY[fieldId];
    if (!reg) return null;
    var field = {
      id: reg.id,
      label: reg.label,
      type: reg.type,
      required: !!required,
    };
    if (reg.hint) field.placeholder = reg.hint;
    if (reg.maxLength) field.maxLength = reg.maxLength;
    if (reg.rows) field.rows = reg.rows;
    if (reg.options && reg.options.length) field.options = reg.options.slice();
    var delta = SUB_DELTAS[canonId];
    if (delta && delta.textosAyuda && delta.textosAyuda[fieldId]) {
      field.placeholder = delta.textosAyuda[fieldId];
    }
    var sw = showWhenForField(fieldId);
    if (sw) field.showWhen = sw;
    return field;
  }

  function personaIdentityBlock() {
    return {
      id: 'eventosPersonaIdentidad',
      title: 'Tu perfil de servicios para eventos',
      hint: 'Nombre público y cómo cotizas — sin formulario genérico de descripción/horario.',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true, placeholder: 'Ej. DJ Luna · Producción Nova' },
        { id: 'tagline', label: 'Frase que vende tu servicio', type: 'text', required: false, maxLength: 120 },
        {
          id: 'unidadCotizacion',
          label: 'Cotizas por',
          type: 'select',
          required: true,
          options: [
            { value: 'evento', label: 'Evento' },
            { value: 'hora', label: 'Hora' },
            { value: 'dia', label: 'Día' },
            { value: 'persona', label: 'Persona' },
            { value: 'km', label: 'Km' },
            { value: 'proyecto', label: 'Proyecto' },
          ],
        },
        { id: 'cotizacionDesde', label: 'Cotización desde (MXN)', type: 'text', required: true, placeholder: 'Ej. $8,000' },
      ],
    };
  }

  function negocioIdentityBlock() {
    return {
      id: 'eventosNegocioIdentidad',
      title: 'Tu negocio de eventos',
      fields: [
        { id: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
        { id: 'tagline', label: 'Frase que vende tu servicio', type: 'text', required: false, maxLength: 120 },
        {
          id: 'unidadCotizacion',
          label: 'Cotizas por',
          type: 'select',
          required: true,
          options: [
            { value: 'evento', label: 'Evento' },
            { value: 'hora', label: 'Hora' },
            { value: 'dia', label: 'Día' },
            { value: 'persona', label: 'Persona' },
            { value: 'km', label: 'Km' },
            { value: 'proyecto', label: 'Proyecto' },
          ],
        },
        { id: 'cotizacionDesde', label: 'Cotización desde (MXN)', type: 'text', required: true, placeholder: 'Ej. $15,000' },
      ],
    };
  }

  function menoresHintBlock(canonId) {
    if (MENORES_CANON.indexOf(canonId) < 0) return null;
    return {
      id: 'eventosMenoresProteccion',
      title: 'Protección de menores',
      hint: MENORES_COPY,
      fields: [
        {
          id: 'avisoProteccionMenoresEventos',
          label: 'Confirmo que no solicitaré datos personales de menores ni publicaré imágenes identificables sin autorización',
          type: 'boolean',
          required: canonId === 'animadores-maestros-ceremonia',
        },
      ],
    };
  }

  function buildDeltaBlock(canonId) {
    var meta = CANON_META[canonId];
    var delta = SUB_DELTAS[canonId];
    if (!meta || !delta) return null;
    var oblSet = {};
    (delta.obligatoriosDelta || []).forEach(function (fid) {
      if (fid === 'geo') return;
      oblSet[fid] = true;
    });
    var fields = [];
    (delta.deltaFields || []).forEach(function (fid) {
      if (GENERIC_FORBIDDEN_IDS.indexOf(fid) >= 0) return;
      var f = fieldFromRegistry(fid, !!oblSet[fid], canonId);
      if (f) fields.push(f);
    });
    if (canonId === 'pirotecnia-efectos-especiales' || canonId === 'seguridad-eventos') {
      var disc = fieldFromRegistry('disclaimerReguladoEventos', true, canonId);
      if (disc && fields.every(function (x) { return x.id !== disc.id; })) fields.push(disc);
    }
    if (canonId === 'shows-para-eventos') {
      var discShow = fieldFromRegistry('disclaimerReguladoEventos', false, canonId);
      if (discShow && fields.every(function (x) { return x.id !== discShow.id; })) fields.push(discShow);
    }
    return {
      id: 'eventosDelta_' + canonId,
      title: meta.blockTitle,
      hint: meta.nombre,
      fields: fields,
    };
  }

  function buildConfig(ctx) {
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || '');
    var meta = CANON_META[canonId];
    if (!meta) return null;
    var pack = meta.pack;
    var negocio = String(ctx.formularioId || meta.formularioId || '') === 'negocio_empresa';
    var blocks = negocio ? [negocioIdentityBlock()] : [personaIdentityBlock()];
    var deltaBlock = buildDeltaBlock(canonId);
    if (deltaBlock) blocks.push(deltaBlock);
    var menores = menoresHintBlock(canonId);
    if (menores) blocks.push(menores);
    var obligatorios = negocio
      ? ['nombreComercial', 'unidadCotizacion', 'cotizacionDesde']
      : ['alias', 'unidadCotizacion', 'cotizacionDesde'];
    (SUB_DELTAS[canonId].obligatoriosDelta || []).forEach(function (fid) {
      if (fid === 'geo') return;
      if (obligatorios.indexOf(fid) < 0) obligatorios.push(fid);
    });
    if (canonId === 'animadores-maestros-ceremonia') {
      obligatorios.push('avisoProteccionMenoresEventos');
    }
    var packFlags = {};
    if (REGULATED_CANON.indexOf(canonId) >= 0) {
      packFlags.regulada = true;
      packFlags.requiresAdminReview = true;
    }
    if (canonId === 'shows-para-eventos') {
      packFlags.sensibleCondicional = true;
    }
    return {
      id: 'eventos_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'eventos',
      formularioId: negocio ? 'negocio_empresa' : 'persona_independiente',
      uiIds: negocio ? [UI_NEG_EVENTOS] : [UI_IND_EVENTOS],
      fotosMin: pack === 'FX' || pack === 'SECURITY' ? 3 : 2,
      obligatorios: obligatorios,
      blocks: blocks,
      packFlags: packFlags,
      legacyResolvedFrom: slugSubId(ctx.subcategoriaId || ctx.subcategoria || '') !== canonId
        ? slugSubId(ctx.subcategoriaId || ctx.subcategoria || '')
        : '',
    };
  }

  function checklistIncludes(values, fieldId, item) {
    var list = values[fieldId];
    if (!Array.isArray(list)) return false;
    return list.some(function (v) { return String(v) === String(item); });
  }

  function isTruthy(val) {
    if (val === true || val === 1) return true;
    var s = String(val == null ? '' : val).trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'si' || s === 'sí';
  }

  function validateCapacidadVenue(values) {
    var min = parseInt(values.capacidadMin, 10);
    var max = parseInt(values.capacidadMax, 10);
    if (isNaN(min) || isNaN(max)) return [];
    if (min > max) return ['La capacidad mínima no puede ser mayor que la máxima.'];
    return [];
  }

  function validatePackFX(values) {
    var errors = [];
    var tipos = values.tipoEfectoPirotecnia;
    if (Array.isArray(tipos) && tipos.length) {
      if (!isTruthy(values.licenciaPirotecnia)) errors.push('Licencia o permiso de pirotecnia obligatorio.');
      if (!String(values.jurisdiccionPirotecnia || '').trim()) errors.push('Jurisdicción de pirotecnia obligatoria.');
      if (!isTruthy(values.polizaSeguroPirotecnia)) errors.push('Póliza de seguro pirotecnia obligatoria.');
      if (!isTruthy(values.disclaimerReguladoEventos)) errors.push('Debes aceptar avisos legales (pirotecnia).');
    }
    return errors;
  }

  function validatePackSECURITY(values) {
    var errors = [];
    if (!isTruthy(values.licenciaSeguridadPrivada)) errors.push('Licencia de seguridad privada obligatoria.');
    var n = parseInt(values.elementosSeguridad, 10);
    if (isNaN(n) || n < 1) errors.push('Número de elementos de seguridad obligatorio.');
    if (!isTruthy(values.disclaimerReguladoEventos)) errors.push('Debes aceptar avisos legales (seguridad).');
    return errors;
  }

  function validatePackSHOW(values) {
    var errors = [];
    var stripper = checklistIncludes(values, 'tipoShow', 'strippers');
    var sensible = isTruthy(values.contenidoSensible);
    if (stripper && !sensible) errors.push('Si incluyes strippers debes marcar contenido sensible.');
    if (stripper && !isTruthy(values.disclaimerReguladoEventos)) {
      errors.push('Disclaimer obligatorio para shows con strippers.');
    }
    if (sensible && !isTruthy(values.disclaimerReguladoEventos)) {
      errors.push('Disclaimer obligatorio para contenido sensible.');
    }
    // publicoObjetivo=adultos no implica desnudo — sin error automático
    return errors;
  }

  function validatePackFOOD(values, canonId) {
    var errors = [];
    if (FOOD_PACK_CANON.indexOf(canonId) >= 0) {
      if (!isTruthy(values.permisoManipulacionAlimentos)) {
        errors.push('Permiso de manipulación de alimentos obligatorio.');
      }
    }
    if (canonId === 'banquetes-catering-eventos') {
      if (!Array.isArray(values.dietasEspeciales) || !values.dietasEspeciales.length) {
        errors.push('Indica dietas especiales o alergias que puedes cubrir.');
      }
      var max = parseInt(values.comensalesMax, 10);
      if (isNaN(max) || max < 1) errors.push('Capacidad de comensales obligatoria.');
    }
    return errors;
  }

  function validatePackVALET(values) {
    var errors = [];
    if (!isTruthy(values.polizaResponsabilidadValet)) {
      errors.push('Póliza de responsabilidad civil valet recomendada/obligatoria.');
    }
    var cap = parseInt(values.vehiculosPorHora, 10);
    if (isNaN(cap) || cap < 1) errors.push('Capacidad de vehículos por hora obligatoria.');
    return errors;
  }

  function validatePackTRANSPORT(values) {
    var errors = [];
    if (!isTruthy(values.permisoTransporte)) errors.push('Permiso de transporte obligatorio.');
    if (!isTruthy(values.polizaTransporte)) errors.push('Póliza de transporte obligatoria.');
    var cap = parseInt(values.capacidadPasajeros, 10);
    if (isNaN(cap) || cap < 1) errors.push('Capacidad de pasajeros obligatoria.');
    return errors;
  }

  function validateCondicionales(values, canonId) {
    var errors = [];
    if (canonId === 'grupos-musicales-eventos' && String(values.tipoAgrupacion || '') === 'fara_fara') {
      if (!String(values.descripcionFormatoFaraFara || '').trim()) errors.push('Describe tu formato Fara Fara.');
    }
    if (canonId === 'animadores-maestros-ceremonia') {
      var rol = String(values.rolPrincipal || '');
      if (rol === 'mc' || rol === 'mixto') {
        if (!Array.isArray(values.estiloCeremonia) || !values.estiloCeremonia.length) {
          errors.push('Estilo de ceremonia obligatorio para MC.');
        }
      }
      if (rol === 'animador' || rol === 'mixto') {
        if (!Array.isArray(values.rangoEdadPublico) || !values.rangoEdadPublico.length) {
          errors.push('Rango de edad del público obligatorio para animador.');
        }
        if (!Array.isArray(values.dinamicasOfrecidas) || !values.dinamicasOfrecidas.length) {
          errors.push('Dinámicas ofrecidas obligatorias para animador.');
        }
      }
    }
    if (canonId === 'fotografia-video-eventos') {
      if (checklistIncludes(values, 'serviciosAudiovisual', 'dron') && !isTruthy(values.licenciaDron)) {
        errors.push('Licencia de dron obligatoria si ofreces dron.');
      }
      if (checklistIncludes(values, 'especialidadesEvento', 'infantil')) {
        if (!isTruthy(values.avisoProteccionMenoresEventos)) {
          errors.push('Confirma protección de imagen de menores (foto/video infantil).');
        }
      }
    }
    if (canonId === 'shows-para-eventos') {
      if (String(values.publicoObjetivo || '') === 'infantil' && !isTruthy(values.avisoProteccionMenoresEventos)) {
        errors.push('Confirma protección de imagen de menores (show infantil).');
      }
    }
    var viajaCanon = ['djs-eventos', 'grupos-musicales-eventos', 'shows-para-eventos'];
    if (viajaCanon.indexOf(canonId) >= 0 && isTruthy(values.viajaFueraCiudad)) {
      if (!String(values.costoTraslado || '').trim()) errors.push('Costo de traslado obligatorio si viajas fuera de ciudad.');
    }
    return errors;
  }

  function validateEventosSectorValues(values, ctx) {
    values = values || {};
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || values.subcategoriaId || '');
    if (!canonId) return ['Subcategoría de eventos no reconocida.'];
    var pack = resolvePack(canonId);
    var errors = [];
    errors = errors.concat(validateCapacidadVenue(values));
    errors = errors.concat(validateCondicionales(values, canonId));
    if (pack === 'FX') errors = errors.concat(validatePackFX(values));
    if (pack === 'SECURITY') errors = errors.concat(validatePackSECURITY(values));
    if (pack === 'SHOW' && canonId === 'shows-para-eventos') errors = errors.concat(validatePackSHOW(values));
    if (pack === 'FOOD') errors = errors.concat(validatePackFOOD(values, canonId));
    if (pack === 'VALET') errors = errors.concat(validatePackVALET(values));
    if (pack === 'TRANSPORT') errors = errors.concat(validatePackTRANSPORT(values));
    return errors;
  }

  function applyEventosFlags(values, canonId) {
    values = values || {};
    if (REGULATED_CANON.indexOf(canonId) >= 0) {
      values.regulada = true;
      values.requiresAdminReview = true;
    }
    if (canonId === 'shows-para-eventos') {
      var stripper = checklistIncludes(values, 'tipoShow', 'strippers');
      var sensible = isTruthy(values.contenidoSensible);
      if (stripper || sensible) {
        values.sensible = true;
        values.requiresAdminReview = true;
        values.nivelRevisionAdmin = 'alta';
      }
    }
    if (checklistIncludes(values, 'especialidadesEvento', 'infantil') || isTruthy(values.trabajaConMenores)) {
      values.restriccionImagenMenores = true;
    }
    return values;
  }

  function copyFieldValue(values, key) {
    var val = values[key];
    if (Array.isArray(val)) return val.slice();
    if (val === true || val === false) return val;
    return val != null ? val : '';
  }

  function buildEventosPerfil(values, canonId, pack) {
    values = values || {};
    canonId = canonId || resolveCanonSubId(values.subcategoriaId || '');
    pack = pack || resolvePack(canonId);
    var delta = SUB_DELTAS[canonId];
    var perfil = {
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      alias: values.alias || '',
      nombreComercial: values.nombreComercial || '',
      tagline: values.tagline || '',
      unidadCotizacion: values.unidadCotizacion || '',
      cotizacionDesde: values.cotizacionDesde || '',
      avisoProteccionMenoresEventos: values.avisoProteccionMenoresEventos === true,
      sensible: values.sensible === true,
      regulada: values.regulada === true,
      requiresAdminReview: values.requiresAdminReview === true,
      restriccionImagenMenores: values.restriccionImagenMenores === true,
    };
    (delta && delta.deltaFields ? delta.deltaFields : []).forEach(function (fid) {
      perfil[fid] = copyFieldValue(values, fid);
    });
    if (values.disclaimerReguladoEventos != null) {
      perfil.disclaimerReguladoEventos = values.disclaimerReguladoEventos === true;
    }
    return perfil;
  }

  global.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS = {
    id: 'eventos_sector_packs',
    sectorId: 'eventos',
    legacyToCanon: LEGACY_TO_CANON,
    canonSubcategorias: CANON_IDS.slice(),
    subToPack: SUB_TO_PACK,
    resolveCanonSubId: resolveCanonSubId,
    resolvePack: resolvePack,
    buildConfig: buildConfig,
    buildEventosPerfil: buildEventosPerfil,
    validateEventosSectorValues: validateEventosSectorValues,
    applyEventosFlags: applyEventosFlags,
    genericForbiddenIds: GENERIC_FORBIDDEN_IDS.slice(),
  };
})(typeof window !== 'undefined' ? window : globalThis);
