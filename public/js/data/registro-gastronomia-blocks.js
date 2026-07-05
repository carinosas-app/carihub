/**
 * Bloques registro — sector Restaurantes/Gastronomía (24 canon, 10 packs).
 * MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 — fuente: scripts/gastronomia-packs-v1.mjs
 */
(function (global) {
  'use strict';

  var LEGACY_TO_CANON = {
  "chef-privado": "chef-cocinero-domicilio",
  "repostero": "pastelerias-reposteria",
  "panadero-independiente": "panaderias",
  "parrillero": "carnes-asadas-parrilla",
  "cocinero-a-domicilio": "chef-cocinero-domicilio",
  "bartender": "bartender-servicio",
  "elaboracion-de-postres": "pastelerias-reposteria",
  "comida-saludable": "cocina-economica",
  "restaurante": "restaurantes-tradicional",
  "restaurante-bar": "bares",
  "cafeteria": "cafeterias",
  "pasteleria": "pastelerias-reposteria",
  "panaderia": "panaderias",
  "taqueria": "taquerias",
  "pizzeria": "pizzerias",
  "hamburgueseria": "hamburgueserias",
  "food-truck": "food-trucks-gastronomia",
  "cocina-economica": "cocina-economica",
  "marisqueria": "marisquerias",
  "buffet": "buffet-comedor",
  "heladeria": "neverias-heladerias",
  "dark-kitchen": "dark-kitchen",
  "distribuidora-de-alimentos": "distribuidoras-alimentos-bebidas",
  "distribuidora-de-bebidas": "distribuidoras-alimentos-bebidas",
  "comida-a-domicilio": "comida-a-domicilio"
};

  var SECTOR_UI_SLUG_TO_CANON = {
  "restaurantes-tradicional": "restaurantes-tradicional",
  "marisquerias": "marisquerias",
  "cocina-economica": "cocina-economica",
  "taquerias": "taquerias",
  "hamburgueserias": "hamburgueserias",
  "pizzerias": "pizzerias",
  "pollerias-y-alitas": "polleryas-alitas",
  "sushi-y-cocina-asiatica": "sushi-cocina-asiatica",
  "carnes-asadas-y-parrilla": "carnes-asadas-parrilla",
  "cafeterias": "cafeterias",
  "panaderias": "panaderias",
  "pastelerias-y-reposteria": "pastelerias-reposteria",
  "neverias-y-heladerias": "neverias-heladerias",
  "juguerias": "juguerias",
  "food-trucks-gastronomia": "food-trucks-gastronomia",
  "comida-a-domicilio": "comida-a-domicilio",
  "dark-kitchen": "dark-kitchen",
  "bares": "bares",
  "cervecerias": "cervecerias",
  "cantinas-y-vinotecas": "cantinas-vinotecas",
  "buffet-y-comedor": "buffet-comedor",
  "chef-y-cocinero-a-domicilio": "chef-cocinero-domicilio",
  "bartender-a-domicilio": "bartender-servicio",
  "distribuidoras-alimentos-y-bebidas": "distribuidoras-alimentos-bebidas"
};

  var CANON_META = {
  "restaurantes-tradicional": {
    "pack": "LOCAL_DINE",
    "blockTitle": "Tu restaurante de cocina tradicional",
    "formularioId": "negocio_empresa",
    "nombre": "Restaurantes Tradicional"
  },
  "marisquerias": {
    "pack": "LOCAL_DINE",
    "blockTitle": "Tu marisquería y cocina de mar",
    "formularioId": "negocio_empresa",
    "nombre": "Marisquerías"
  },
  "cocina-economica": {
    "pack": "LOCAL_DINE",
    "blockTitle": "Comida corrida y menú del día accesible",
    "formularioId": "negocio_empresa",
    "nombre": "Cocina Económica"
  },
  "taquerias": {
    "pack": "FAST_CASUAL",
    "blockTitle": "Tu taquería y tacos al momento",
    "formularioId": "negocio_empresa",
    "nombre": "Taquerías"
  },
  "hamburgueserias": {
    "pack": "FAST_CASUAL",
    "blockTitle": "Hamburguesas, smash y combos",
    "formularioId": "negocio_empresa",
    "nombre": "Hamburgueserías"
  },
  "pizzerias": {
    "pack": "FAST_CASUAL",
    "blockTitle": "Pizza artesanal, horno y delivery",
    "formularioId": "negocio_empresa",
    "nombre": "Pizzerías"
  },
  "polleryas-alitas": {
    "pack": "FAST_CASUAL",
    "blockTitle": "Pollo rostizado, alitas y combos",
    "formularioId": "negocio_empresa",
    "nombre": "Pollerías y Alitas"
  },
  "sushi-cocina-asiatica": {
    "pack": "FAST_CASUAL",
    "blockTitle": "Sushi, ramen y cocina asiática",
    "formularioId": "negocio_empresa",
    "nombre": "Sushi y Cocina Asiática"
  },
  "carnes-asadas-parrilla": {
    "pack": "LOCAL_DINE",
    "blockTitle": "Parrilla, cortes y asador",
    "formularioId": "negocio_empresa",
    "nombre": "Carnes Asadas y Parrilla"
  },
  "cafeterias": {
    "pack": "CAFE",
    "blockTitle": "Café de especialidad y repostería ligera",
    "formularioId": "negocio_empresa",
    "nombre": "Cafeterías"
  },
  "panaderias": {
    "pack": "BAKERY_DESSERT",
    "blockTitle": "Pan artesanal y bollería",
    "formularioId": "negocio_empresa",
    "nombre": "Panaderías"
  },
  "pastelerias-reposteria": {
    "pack": "BAKERY_DESSERT",
    "blockTitle": "Pasteles, repostería fina y postres",
    "formularioId": "negocio_empresa",
    "nombre": "Pastelerías y Repostería"
  },
  "neverias-heladerias": {
    "pack": "BAKERY_DESSERT",
    "blockTitle": "Helados, nieves y paletas",
    "formularioId": "negocio_empresa",
    "nombre": "Neverías y Heladerías"
  },
  "juguerias": {
    "pack": "CAFE",
    "blockTitle": "Jugos, licuados y smoothies",
    "formularioId": "negocio_empresa",
    "nombre": "Juguerías"
  },
  "food-trucks-gastronomia": {
    "pack": "MOBILE",
    "blockTitle": "Food truck de operación recurrente",
    "formularioId": "negocio_empresa",
    "nombre": "Food Trucks Gastronomía"
  },
  "comida-a-domicilio": {
    "pack": "DELIVERY",
    "blockTitle": "Cocina preparada y entrega a domicilio",
    "formularioId": "persona_independiente",
    "nombre": "Comida a Domicilio"
  },
  "dark-kitchen": {
    "pack": "DELIVERY",
    "blockTitle": "Cocina oculta solo delivery",
    "formularioId": "negocio_empresa",
    "nombre": "Dark Kitchen"
  },
  "bares": {
    "pack": "BAR_BEBIDAS",
    "blockTitle": "Bar gastronómico con comida y bebidas",
    "formularioId": "negocio_empresa",
    "nombre": "Bares"
  },
  "cervecerias": {
    "pack": "BAR_BEBIDAS",
    "blockTitle": "Cerveza artesanal y taproom",
    "formularioId": "negocio_empresa",
    "nombre": "Cervecerías"
  },
  "cantinas-vinotecas": {
    "pack": "BAR_BEBIDAS",
    "blockTitle": "Cantina tradicional y vinos",
    "formularioId": "negocio_empresa",
    "nombre": "Cantinas y Vinotecas"
  },
  "buffet-comedor": {
    "pack": "BUFFET",
    "blockTitle": "Buffet, comedor industrial o por kilo",
    "formularioId": "negocio_empresa",
    "nombre": "Buffet y Comedor"
  },
  "chef-cocinero-domicilio": {
    "pack": "PRO_SERVICE",
    "blockTitle": "Chef privado y experiencias en casa",
    "formularioId": "persona_independiente",
    "nombre": "Chef y Cocinero a Domicilio"
  },
  "bartender-servicio": {
    "pack": "PRO_SERVICE",
    "blockTitle": "Servicio de bartender y barra móvil",
    "formularioId": "persona_independiente",
    "nombre": "Bartender a Domicilio"
  },
  "distribuidoras-alimentos-bebidas": {
    "pack": "B2B_DIST",
    "blockTitle": "Mayoreo y distribución B2B",
    "formularioId": "negocio_empresa",
    "nombre": "Distribuidoras Alimentos y Bebidas"
  }
};

  var SUB_TO_PACK = {
  "restaurantes-tradicional": "LOCAL_DINE",
  "marisquerias": "LOCAL_DINE",
  "cocina-economica": "LOCAL_DINE",
  "taquerias": "FAST_CASUAL",
  "hamburgueserias": "FAST_CASUAL",
  "pizzerias": "FAST_CASUAL",
  "polleryas-alitas": "FAST_CASUAL",
  "sushi-cocina-asiatica": "FAST_CASUAL",
  "carnes-asadas-parrilla": "LOCAL_DINE",
  "cafeterias": "CAFE",
  "panaderias": "BAKERY_DESSERT",
  "pastelerias-reposteria": "BAKERY_DESSERT",
  "neverias-heladerias": "BAKERY_DESSERT",
  "juguerias": "CAFE",
  "food-trucks-gastronomia": "MOBILE",
  "comida-a-domicilio": "DELIVERY",
  "dark-kitchen": "DELIVERY",
  "bares": "BAR_BEBIDAS",
  "cervecerias": "BAR_BEBIDAS",
  "cantinas-vinotecas": "BAR_BEBIDAS",
  "buffet-comedor": "BUFFET",
  "chef-cocinero-domicilio": "PRO_SERVICE",
  "bartender-servicio": "PRO_SERVICE",
  "distribuidoras-alimentos-bebidas": "B2B_DIST"
};

  var SUB_DELTAS = {
  "restaurantes-tradicional": {
    "deltaFields": [
      "tipoCocinaPrincipal",
      "capacidadComensales",
      "servicioMesa",
      "aceptaReservaciones",
      "terrazaPatio",
      "estacionamientoClientes",
      "menuDelDia",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "ventaAlcohol",
      "politicaMenoresAlcohol",
      "opcionesDieteticas",
      "especialidadCasa",
      "chefVisible",
      "maridajeVinos",
      "brunchDisponible",
      "eventosPrivadosSalon",
      "menuTextoSanitizado",
      "servicioSommelier",
      "platillosTemporada",
      "cocinaAbiertaVisible",
      "reservacionesOnline",
      "areasPetFriendly",
      "menuInfantil",
      "pagoSinContacto",
      "estacionamientoValet",
      "horarioDesayuno",
      "accesibilidadSillaRuedas",
      "estacionamientoTipo",
      "buenoParaNinos",
      "codigoVestimenta",
      "menuUrl",
      "nivelRuido",
      "buenoParaGrupos",
      "certificacionHalalKosher",
      "cienPorCientoSinGluten"
    ],
    "obligatoriosDelta": [
      "tipoCocinaPrincipal",
      "capacidadComensales",
      "permisoManipulacionAlimentos",
      "ventaAlcohol",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "especialidadCasa": "Detalla especialidadCasa con datos verificables — evita promesas falsas.",
      "chefVisible": "Detalla chefVisible con datos verificables — evita promesas falsas.",
      "maridajeVinos": "Detalla maridajeVinos con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoCocinaPrincipal": "Tipo de cocina principal"
    },
    "blockHint": "Restaurante con mesa — cocina, capacidad, reservaciones y precio promedio.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "marisquerias": {
    "deltaFields": [
      "tipoCocinaPrincipal",
      "capacidadComensales",
      "servicioMesa",
      "aceptaReservaciones",
      "terrazaPatio",
      "estacionamientoClientes",
      "menuDelDia",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "ventaAlcohol",
      "politicaMenoresAlcohol",
      "opcionesDieteticas",
      "especialidadMar",
      "pescadoDelDia",
      "barraOstiones",
      "platosEstrellaMar",
      "origenPescado",
      "menuTextoSanitizado",
      "coctelesMar",
      "cevicheBar",
      "horarioPescadoFresco",
      "platosSinCascara",
      "servicioPelado",
      "promocionMariscos",
      "estacionamientoMotos",
      "pagoSinContacto",
      "areasPetFriendly",
      "accesibilidadSillaRuedas",
      "estacionamientoTipo",
      "buenoParaNinos",
      "menuUrl",
      "nivelRuido",
      "buenoParaGrupos",
      "certificacionHalalKosher",
      "cienPorCientoSinGluten"
    ],
    "obligatoriosDelta": [
      "especialidadMar",
      "permisoManipulacionAlimentos",
      "capacidadComensales",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "especialidadMar": "Detalla especialidadMar con datos verificables — evita promesas falsas.",
      "pescadoDelDia": "Detalla pescadoDelDia con datos verificables — evita promesas falsas.",
      "barraOstiones": "Detalla barraOstiones con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoCocinaPrincipal": "Especialidad de mariscos"
    },
    "blockHint": "Marisquería — especialidad del mar, capacidad y horario de cocina.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "cocina-economica": {
    "deltaFields": [
      "tipoCocinaPrincipal",
      "capacidadComensales",
      "servicioMesa",
      "aceptaReservaciones",
      "terrazaPatio",
      "estacionamientoClientes",
      "menuDelDia",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "ventaAlcohol",
      "politicaMenoresAlcohol",
      "opcionesDieteticas",
      "menuCorrida",
      "precioMenuCorridaMx",
      "incluyeBebidaMenu",
      "platosRotativos",
      "comedorIndustrial",
      "menuTextoSanitizado",
      "horarioComidaCorrida",
      "diasMenuSemana",
      "porcionesGenerosas",
      "paraLlevarEconomico",
      "combosFamiliaresEconomicos",
      "estacionamientoMotos",
      "pagoSinContacto",
      "servicioRapidoMediodia",
      "menuUrl"
    ],
    "obligatoriosDelta": [
      "menuDelDia",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "menuCorrida": "Detalla menuCorrida con datos verificables — evita promesas falsas.",
      "precioMenuCorridaMx": "Detalla precioMenuCorridaMx con datos verificables — evita promesas falsas.",
      "incluyeBebidaMenu": "Detalla incluyeBebidaMenu con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "menuDelDia": "¿Ofreces menú del día?"
    },
    "blockHint": "Comida corrida accesible — menú del día, precio y horario.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "taquerias": {
    "deltaFields": [
      "tipoServicioRapido",
      "pedidoMostrador",
      "pedidoParaLlevar",
      "deliveryPropio",
      "tiempoPreparacionMin",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "opcionesDieteticas",
      "combosPromociones",
      "capacidadComensales",
      "aceptaPedidosApp",
      "tipoTortilla",
      "especialidadTaco",
      "salsasCasa",
      "hornoTortillas",
      "tacosEstrella",
      "menuTextoSanitizado",
      "guisadosDelDia",
      "ordenTacosMinimo",
      "salsaBar",
      "cocacolaFria",
      "horarioMadrugada",
      "paraEventosPequenos",
      "estacionamientoMotos",
      "pagoSinContacto",
      "promocionMartes",
      "menuUrl",
      "appsDeliveryRatings",
      "pedidoMinimoDelivery"
    ],
    "obligatoriosDelta": [
      "especialidadTaco",
      "permisoManipulacionAlimentos",
      "tipoServicioRapido",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "tipoTortilla": "Detalla tipoTortilla con datos verificables — evita promesas falsas.",
      "especialidadTaco": "Detalla especialidadTaco con datos verificables — evita promesas falsas.",
      "salsasCasa": "Detalla salsasCasa con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoServicioRapido": "Modalidad de servicio"
    },
    "blockHint": "Taquería — tipo de servicio, para llevar y tiempo de preparación.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "hamburgueserias": {
    "deltaFields": [
      "tipoServicioRapido",
      "pedidoMostrador",
      "pedidoParaLlevar",
      "deliveryPropio",
      "tiempoPreparacionMin",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "opcionesDieteticas",
      "combosPromociones",
      "capacidadComensales",
      "aceptaPedidosApp",
      "tipoCarne",
      "panArtesanal",
      "papasCasa",
      "burgersEstrella",
      "opcionesPlantBased",
      "menuTextoSanitizado",
      "papasTipos",
      "malteadasCasa",
      "salsasSignature",
      "comboEjecutivo",
      "horarioNocturno",
      "paraLlevarRapido",
      "pagoSinContacto",
      "estacionamientoMotos",
      "menuUrl",
      "appsDeliveryRatings",
      "pedidoMinimoDelivery"
    ],
    "obligatoriosDelta": [
      "burgersEstrella",
      "permisoManipulacionAlimentos",
      "precioPromedioMx",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "tipoCarne": "Detalla tipoCarne con datos verificables — evita promesas falsas.",
      "panArtesanal": "Detalla panArtesanal con datos verificables — evita promesas falsas.",
      "papasCasa": "Detalla papasCasa con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "combosPromociones": "Combos o promociones destacadas"
    },
    "blockHint": "Hamburguesería — smash, combos y delivery propio.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "pizzerias": {
    "deltaFields": [
      "tipoServicioRapido",
      "pedidoMostrador",
      "pedidoParaLlevar",
      "deliveryPropio",
      "tiempoPreparacionMin",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "opcionesDieteticas",
      "combosPromociones",
      "capacidadComensales",
      "aceptaPedidosApp",
      "tipoHorno",
      "masaFermentacion",
      "tamanosPizza",
      "pizzasEstrella",
      "entregaCaliente",
      "menuTextoSanitizado",
      "pizzaMitades",
      "ingredientesPremium",
      "salsaTomateCasa",
      "promocionMartes",
      "horarioNocturno",
      "paraLlevarCaja",
      "pagoSinContacto",
      "estacionamientoMotos",
      "menuUrl",
      "appsDeliveryRatings",
      "pedidoMinimoDelivery"
    ],
    "obligatoriosDelta": [
      "pizzasEstrella",
      "permisoManipulacionAlimentos",
      "deliveryPropio",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "tipoHorno": "Detalla tipoHorno con datos verificables — evita promesas falsas.",
      "masaFermentacion": "Detalla masaFermentacion con datos verificables — evita promesas falsas.",
      "tamanosPizza": "Detalla tamanosPizza con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoServicioRapido": "Servicio: mostrador, delivery o ambos"
    },
    "blockHint": "Pizzería — horno, delivery y opciones dietéticas.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "polleryas-alitas": {
    "deltaFields": [
      "tipoServicioRapido",
      "pedidoMostrador",
      "pedidoParaLlevar",
      "deliveryPropio",
      "tiempoPreparacionMin",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "opcionesDieteticas",
      "combosPromociones",
      "capacidadComensales",
      "aceptaPedidosApp",
      "cortePollo",
      "salsasAlitas",
      "combosFamiliares",
      "rostizadoHorario",
      "platosPolloEstrella",
      "menuTextoSanitizado",
      "nivelPicante",
      "papasIncluidas",
      "salsasExtra",
      "promocionAlitas",
      "horarioPartido",
      "paraLlevarRapido",
      "pagoSinContacto",
      "estacionamientoMotos",
      "menuUrl",
      "appsDeliveryRatings",
      "pedidoMinimoDelivery"
    ],
    "obligatoriosDelta": [
      "platosPolloEstrella",
      "permisoManipulacionAlimentos",
      "tipoServicioRapido",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "cortePollo": "Detalla cortePollo con datos verificables — evita promesas falsas.",
      "salsasAlitas": "Detalla salsasAlitas con datos verificables — evita promesas falsas.",
      "combosFamiliares": "Detalla combosFamiliares con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoCocinaPrincipal": "Especialidad de pollo / alitas"
    },
    "blockHint": "Pollería y alitas — estilo, combos y capacidad.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "sushi-cocina-asiatica": {
    "deltaFields": [
      "tipoServicioRapido",
      "pedidoMostrador",
      "pedidoParaLlevar",
      "deliveryPropio",
      "tiempoPreparacionMin",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "opcionesDieteticas",
      "combosPromociones",
      "capacidadComensales",
      "aceptaPedidosApp",
      "estiloAsiatico",
      "barraSushi",
      "opcionesCrudo",
      "platosAsiaticosEstrella",
      "teMatcha",
      "menuTextoSanitizado",
      "omakaseDisponible",
      "wasabiReal",
      "sakeSeleccion",
      "rollsTemporada",
      "paraLlevarSushi",
      "horarioCena",
      "pagoSinContacto",
      "reservacionesOnline",
      "menuUrl",
      "appsDeliveryRatings",
      "pedidoMinimoDelivery",
      "certificacionHalalKosher",
      "cienPorCientoSinGluten"
    ],
    "obligatoriosDelta": [
      "estiloAsiatico",
      "permisoManipulacionAlimentos",
      "opcionesCrudo",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "estiloAsiatico": "Detalla estiloAsiatico con datos verificables — evita promesas falsas.",
      "barraSushi": "Detalla barraSushi con datos verificables — evita promesas falsas.",
      "opcionesCrudo": "Detalla opcionesCrudo con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoCocinaPrincipal": "Especialidad asiática"
    },
    "blockHint": "Sushi y cocina asiática — especialidad, barra y delivery.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "carnes-asadas-parrilla": {
    "deltaFields": [
      "tipoCocinaPrincipal",
      "capacidadComensales",
      "servicioMesa",
      "aceptaReservaciones",
      "terrazaPatio",
      "estacionamientoClientes",
      "menuDelDia",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "ventaAlcohol",
      "politicaMenoresAlcohol",
      "opcionesDieteticas",
      "tipoParrilla",
      "cortesEspecialidad",
      "marinadosCasa",
      "servicioAsadorMesa",
      "guarnicionesParrilla",
      "menuTextoSanitizado",
      "cortesImportados",
      "salsasParrilla",
      "hornoPan",
      "promocionFinSemana",
      "musicaEnVivo",
      "estacionamientoAmplio",
      "pagoSinContacto",
      "areasPetFriendly",
      "menuUrl",
      "nivelRuido",
      "buenoParaGrupos"
    ],
    "obligatoriosDelta": [
      "cortesEspecialidad",
      "permisoManipulacionAlimentos",
      "tipoParrilla",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "tipoParrilla": "Detalla tipoParrilla con datos verificables — evita promesas falsas.",
      "cortesEspecialidad": "Detalla cortesEspecialidad con datos verificables — evita promesas falsas.",
      "marinadosCasa": "Detalla marinadosCasa con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoCocinaPrincipal": "Estilo de parrilla / cortes"
    },
    "blockHint": "Parrilla y cortes — asador, terraza y precio promedio.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "cafeterias": {
    "deltaFields": [
      "bebidasPrincipal",
      "granoOrigen",
      "opcionesLacteos",
      "opcionesSinAzucar",
      "horarioBarista",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "wifiClientes",
      "espacioTrabajo",
      "comidaLigera",
      "capacidadComensales",
      "aceptaReservaciones",
      "metodosPreparacion",
      "pastelesLigeros",
      "desayunos",
      "latteArt",
      "origenGranoDetalle",
      "menuTextoSanitizado",
      "pastelesDelDia",
      "sandwichesLigeros",
      "horarioDesayuno",
      "promocionDesayuno",
      "areasPetFriendly",
      "pagoSinContacto",
      "estacionamientoMotos",
      "reservacionesGruposPequenos",
      "menuUrl",
      "appsDeliveryRatings",
      "pedidoMinimoDelivery",
      "nivelRuido",
      "buenoParaGrupos",
      "certificacionHalalKosher",
      "cienPorCientoSinGluten"
    ],
    "obligatoriosDelta": [
      "bebidasPrincipal",
      "permisoManipulacionAlimentos",
      "horarioBarista",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "metodosPreparacion": "Detalla metodosPreparacion con datos verificables — evita promesas falsas.",
      "pastelesLigeros": "Detalla pastelesLigeros con datos verificables — evita promesas falsas.",
      "desayunos": "Detalla desayunos con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoBebidaPrincipal": "Bebidas principales"
    },
    "blockHint": "Cafetería — café de especialidad, repostería y ambiente.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "panaderias": {
    "deltaFields": [
      "productosHorneados",
      "pedidosPersonalizados",
      "entregaADomicilio",
      "horarioHorneado",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "opcionesSinGluten",
      "opcionesVeganas",
      "capacidadProduccionDiaria",
      "mostradorFisico",
      "pedidoAnticipadoHoras",
      "embalajeEspecial",
      "tiposPan",
      "hornoTipo",
      "panDelDia",
      "pedidosPorKilo",
      "productosSinGlutenPan",
      "menuTextoSanitizado",
      "recetasTradicionales",
      "panSinConservadores",
      "pedidosCorporativos",
      "horarioPrimeraSalida",
      "promocionPanNoche",
      "pagoSinContacto",
      "estacionamientoMotos",
      "menuUrl",
      "certificacionHalalKosher",
      "cienPorCientoSinGluten"
    ],
    "obligatoriosDelta": [
      "productosHorneados",
      "permisoManipulacionAlimentos",
      "horarioHorneado",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "tiposPan": "Detalla tiposPan con datos verificables — evita promesas falsas.",
      "hornoTipo": "Detalla hornoTipo con datos verificables — evita promesas falsas.",
      "panDelDia": "Detalla panDelDia con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "productosHorneados": "Productos horneados principales"
    },
    "blockHint": "Panadería — productos horneados, pedidos y horario de horneado.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "pastelerias-reposteria": {
    "deltaFields": [
      "productosHorneados",
      "pedidosPersonalizados",
      "entregaADomicilio",
      "horarioHorneado",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "opcionesSinGluten",
      "opcionesVeganas",
      "capacidadProduccionDiaria",
      "mostradorFisico",
      "pedidoAnticipadoHoras",
      "embalajeEspecial",
      "pastelesPersonalizados",
      "reposteriaFina",
      "tematicasPasteles",
      "degustacionDisponible",
      "entregaEventosPequenos",
      "menuTextoSanitizado",
      "catalogoPasteles",
      "rellenosDisponibles",
      "degustacionSabores",
      "entregaMunicipio",
      "horarioRecoleccion",
      "promocionTemporada",
      "pagoSinContacto",
      "menuUrl",
      "appsDeliveryRatings",
      "pedidoMinimoDelivery",
      "certificacionHalalKosher",
      "cienPorCientoSinGluten"
    ],
    "obligatoriosDelta": [
      "pedidosPersonalizados",
      "permisoManipulacionAlimentos",
      "productosHorneados",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "pastelesPersonalizados": "Detalla pastelesPersonalizados con datos verificables — evita promesas falsas.",
      "reposteriaFina": "Detalla reposteriaFina con datos verificables — evita promesas falsas.",
      "tematicasPasteles": "Detalla tematicasPasteles con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "pedidosPersonalizados": "¿Aceptas pedidos personalizados?"
    },
    "blockHint": "Pastelería — pasteles personalizados, entrega y opciones dietéticas.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "neverias-heladerias": {
    "deltaFields": [
      "productosHorneados",
      "pedidosPersonalizados",
      "entregaADomicilio",
      "horarioHorneado",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "opcionesSinGluten",
      "opcionesVeganas",
      "capacidadProduccionDiaria",
      "mostradorFisico",
      "pedidoAnticipadoHoras",
      "embalajeEspecial",
      "baseHelado",
      "saboresEstacion",
      "paletasArtesanales",
      "opcionesVeganasHelado",
      "eventosCarritoHelado",
      "menuTextoSanitizado",
      "toppingsDisponibles",
      "conosTipos",
      "promocionDoble",
      "horarioVerano",
      "paraLlevarNevera",
      "pagoSinContacto",
      "estacionamientoMotos",
      "menuUrl"
    ],
    "obligatoriosDelta": [
      "productosHorneados",
      "permisoManipulacionAlimentos",
      "saboresEstacion",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "baseHelado": "Detalla baseHelado con datos verificables — evita promesas falsas.",
      "saboresEstacion": "Detalla saboresEstacion con datos verificables — evita promesas falsas.",
      "paletasArtesanales": "Detalla paletasArtesanales con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "productosHorneados": "Productos fríos principales"
    },
    "blockHint": "Nevería — sabores, producción diaria y mostrador.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "juguerias": {
    "deltaFields": [
      "bebidasPrincipal",
      "granoOrigen",
      "opcionesLacteos",
      "opcionesSinAzucar",
      "horarioBarista",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "wifiClientes",
      "espacioTrabajo",
      "comidaLigera",
      "capacidadComensales",
      "aceptaReservaciones",
      "frutasEstacion",
      "boostProteina",
      "jugosDetox",
      "combinacionesEstrella",
      "sinAzucarAnadida",
      "menuTextoSanitizado",
      "superfoodsDisponibles",
      "promocionCombo",
      "horarioManana",
      "paraLlevarVaso",
      "pagoSinContacto",
      "estacionamientoMotos",
      "menuUrl"
    ],
    "obligatoriosDelta": [
      "bebidasPrincipal",
      "permisoManipulacionAlimentos",
      "frutasEstacion",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "frutasEstacion": "Detalla frutasEstacion con datos verificables — evita promesas falsas.",
      "boostProteina": "Detalla boostProteina con datos verificables — evita promesas falsas.",
      "jugosDetox": "Detalla jugosDetox con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoBebidaPrincipal": "Bebidas que preparas"
    },
    "blockHint": "Juguería — jugos, licuados y smoothies.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "food-trucks-gastronomia": {
    "deltaFields": [
      "tipoUnidadMovil",
      "ubicacionHabitual",
      "horarioRuta",
      "diasOperacion",
      "aceptaEventosPrivados",
      "radioServicioKm",
      "permisoManipulacionAlimentos",
      "requiereAguaLuz",
      "precioPromedioMx",
      "pedidoAnticipado",
      "capacidadProduccionHora",
      "formasPago",
      "especialidadTruck",
      "puntosFijosSemana",
      "publicaUbicacionDiaria",
      "eventosPrivadosTruck",
      "redesUbicacion",
      "menuTextoSanitizado",
      "instagramUbicacion",
      "promocionDia",
      "capacidadCola",
      "menuRotativoSemana",
      "aceptaTarjeta",
      "estacionamientoCercano",
      "pagoSinContacto",
      "menuUrl",
      "appsDeliveryRatings",
      "pedidoMinimoDelivery",
      "zonaCoberturaColonias"
    ],
    "obligatoriosDelta": [
      "ubicacionHabitual",
      "permisoManipulacionAlimentos",
      "aceptaEventosPrivados",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "especialidadTruck": "Detalla especialidadTruck con datos verificables — evita promesas falsas.",
      "puntosFijosSemana": "Detalla puntosFijosSemana con datos verificables — evita promesas falsas.",
      "publicaUbicacionDiaria": "Detalla publicaUbicacionDiaria con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "ubicacionesRecurrentes": "Zonas donde operas"
    },
    "blockHint": "Food truck recurrente — ubicaciones, eventos privados y menú.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "comida-a-domicilio": {
    "deltaFields": [
      "modeloOperacion",
      "zonasEntrega",
      "costoEnvioDesde",
      "pedidoMinimoMx",
      "tiempoEntregaMin",
      "horarioEntregas",
      "permisoManipulacionAlimentos",
      "direccionOperacionPrivada",
      "mostrarSoloZonaPublica",
      "precioPromedioMx",
      "aceptaPedidosApp",
      "embalajeEspecial",
      "tipoComidaDomicilio",
      "menuSemanal",
      "diasEntrega",
      "embalajeTermico",
      "pedidoRecurrente",
      "menuTextoSanitizado",
      "porcionesIndividuales",
      "alergenosDeclarados",
      "horarioPedidos",
      "promocionSemanal",
      "pagoTransferencia",
      "embalajeEcologico",
      "menuUrl",
      "appsDeliveryRatings",
      "pedidoMinimoDelivery",
      "zonaCoberturaColonias",
      "certificacionHalalKosher",
      "cienPorCientoSinGluten"
    ],
    "obligatoriosDelta": [
      "zonasEntrega",
      "permisoManipulacionAlimentos",
      "tiempoEntregaMin",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "tipoComidaDomicilio": "Detalla tipoComidaDomicilio con datos verificables — evita promesas falsas.",
      "menuSemanal": "Detalla menuSemanal con datos verificables — evita promesas falsas.",
      "diasEntrega": "Detalla diasEntrega con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoCocinaDomicilio": "Tipo de cocina que preparas",
      "zonaEntregaDomicilio": "Zona de entrega"
    },
    "blockHint": "Comida preparada a domicilio — menú, zona de entrega y pedido mínimo.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "dark-kitchen": {
    "deltaFields": [
      "modeloOperacion",
      "zonasEntrega",
      "costoEnvioDesde",
      "pedidoMinimoMx",
      "tiempoEntregaMin",
      "horarioEntregas",
      "permisoManipulacionAlimentos",
      "direccionOperacionPrivada",
      "mostrarSoloZonaPublica",
      "precioPromedioMx",
      "aceptaPedidosApp",
      "embalajeEspecial",
      "marcasVirtuales",
      "appsDelivery",
      "cocinaCompartida",
      "menuTextoSanitizado",
      "marcasOperadasDetalle",
      "tiempoPromedioApp",
      "horarioPico",
      "embalajePremium",
      "pagoSinContacto",
      "menuUrl",
      "appsDeliveryRatings",
      "pedidoMinimoDelivery",
      "zonaCoberturaColonias",
      "certificacionHalalKosher",
      "cienPorCientoSinGluten"
    ],
    "obligatoriosDelta": [
      "modeloOperacion",
      "direccionOperacionPrivada",
      "permisoManipulacionAlimentos",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "marcasVirtuales": "Detalla marcasVirtuales con datos verificables — evita promesas falsas.",
      "appsDelivery": "Detalla appsDelivery con datos verificables — evita promesas falsas.",
      "cocinaCompartida": "Detalla cocinaCompartida con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores.",
      "mostrarSoloZonaPublica": "No publiques dirección exacta del local."
    },
    "fieldLabels": {
      "modeloOperacion": "Modelo de operación"
    },
    "blockHint": "Dark kitchen — solo delivery; dirección privada y apps de pedido.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "bares": {
    "deltaFields": [
      "tipoBebidasPrincipal",
      "ventaAlcohol",
      "permisoVentaAlcohol",
      "horarioBarra",
      "capacidadComensales",
      "comidaEnMenu",
      "musicaAmbiente",
      "politicaMenoresAlcohol",
      "happyHour",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "terrazaPatio",
      "cartelesCocteles",
      "botanasDestacadas",
      "barraMixologia",
      "ambienteBar",
      "restauranteBarGastronomico",
      "menuTextoSanitizado",
      "cartasVinos",
      "cervezasArtesanales",
      "musicaEnVivoBar",
      "horarioBarraNoche",
      "promocionHappyHour",
      "areasExterior",
      "pagoSinContacto",
      "disclaimerReguladoGastronomia",
      "accesibilidadSillaRuedas",
      "estacionamientoTipo",
      "codigoVestimenta",
      "menuUrl",
      "nivelRuido",
      "buenoParaGrupos"
    ],
    "obligatoriosDelta": [
      "ventaAlcohol",
      "permisoVentaAlcohol",
      "permisoManipulacionAlimentos",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "cartelesCocteles": "Detalla cartelesCocteles con datos verificables — evita promesas falsas.",
      "botanasDestacadas": "Detalla botanasDestacadas con datos verificables — evita promesas falsas.",
      "barraMixologia": "Detalla barraMixologia con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "ventaAlcohol": "¿Vendes bebidas alcohólicas?"
    },
    "blockHint": "Bar gastronómico — comida, coctelería y permiso de alcohol.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "cervecerias": {
    "deltaFields": [
      "tipoBebidasPrincipal",
      "ventaAlcohol",
      "permisoVentaAlcohol",
      "horarioBarra",
      "capacidadComensales",
      "comidaEnMenu",
      "musicaAmbiente",
      "politicaMenoresAlcohol",
      "happyHour",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "terrazaPatio",
      "estilosCerveza",
      "produccionPropia",
      "maridajeCerveza",
      "tapListRotativa",
      "visitaCerveceria",
      "menuTextoSanitizado",
      "flightCerveza",
      "comidaBar",
      "horarioTaproom",
      "promocionGrowler",
      "areasExterior",
      "pagoSinContacto",
      "disclaimerReguladoGastronomia",
      "menuUrl",
      "nivelRuido",
      "buenoParaGrupos"
    ],
    "obligatoriosDelta": [
      "tipoBebidasPrincipal",
      "permisoVentaAlcohol",
      "estilosCerveza",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "estilosCerveza": "Detalla estilosCerveza con datos verificables — evita promesas falsas.",
      "produccionPropia": "Detalla produccionPropia con datos verificables — evita promesas falsas.",
      "maridajeCerveza": "Detalla maridajeCerveza con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "estilosCerveza": "Estilos de cerveza"
    },
    "blockHint": "Cervecería — estilos propios, taproom y comida.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "cantinas-vinotecas": {
    "deltaFields": [
      "tipoBebidasPrincipal",
      "ventaAlcohol",
      "permisoVentaAlcohol",
      "horarioBarra",
      "capacidadComensales",
      "comidaEnMenu",
      "musicaAmbiente",
      "politicaMenoresAlcohol",
      "happyHour",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "terrazaPatio",
      "botellasDestacadas",
      "cavaVinos",
      "botanasCantina",
      "maridajeVinos",
      "ventaBotella",
      "menuTextoSanitizado",
      "tequilaSeleccion",
      "mezcalArtesanal",
      "botanasTradicionales",
      "horarioCantina",
      "promocionBotella",
      "areasExterior",
      "pagoSinContacto",
      "disclaimerReguladoGastronomia",
      "menuUrl",
      "nivelRuido",
      "buenoParaGrupos"
    ],
    "obligatoriosDelta": [
      "tipoBebidasPrincipal",
      "permisoVentaAlcohol",
      "botellasDestacadas",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "botellasDestacadas": "Detalla botellasDestacadas con datos verificables — evita promesas falsas.",
      "cavaVinos": "Detalla cavaVinos con datos verificables — evita promesas falsas.",
      "botanasCantina": "Detalla botanasCantina con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "ventaAlcohol": "Venta de alcohol y vinos"
    },
    "blockHint": "Cantina o vinoteca — vinos, botanas y permisos.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "buffet-comedor": {
    "deltaFields": [
      "tipoBuffet",
      "precioPorPersonaMx",
      "capacidadComensales",
      "horarioServicio",
      "incluyeBebidas",
      "postresIncluidos",
      "opcionesVegetarianas",
      "permisoManipulacionAlimentos",
      "ventaAlcohol",
      "politicaMenoresAlcohol",
      "reservacionesGrupos",
      "diasOperacion",
      "rotacionPlatos",
      "estacionesBuffet",
      "comedorEmpresarial",
      "controlPorciones",
      "platosCalientesFrios",
      "menuTextoSanitizado",
      "platosDelDia",
      "controlAlergenos",
      "horarioComida",
      "promocionFinSemana",
      "estacionamientoEmpleados",
      "pagoSinContacto",
      "menuUrl",
      "nivelRuido",
      "buenoParaGrupos",
      "certificacionHalalKosher",
      "cienPorCientoSinGluten"
    ],
    "obligatoriosDelta": [
      "tipoBuffet",
      "precioPorPersonaMx",
      "permisoManipulacionAlimentos",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "rotacionPlatos": "Detalla rotacionPlatos con datos verificables — evita promesas falsas.",
      "estacionesBuffet": "Detalla estacionesBuffet con datos verificables — evita promesas falsas.",
      "comedorEmpresarial": "Detalla comedorEmpresarial con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoBuffet": "Modalidad de buffet / comedor"
    },
    "blockHint": "Buffet o comedor por peso — capacidad, horarios y tipo de comida.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "chef-cocinero-domicilio": {
    "deltaFields": [
      "tipoServicioProfesional",
      "especialidadCocina",
      "personasAtiendeMax",
      "incluyeCompras",
      "incluyeLimpieza",
      "radioServicioKm",
      "precioDesdeMx",
      "anticipoRequerido",
      "permisoManipulacionAlimentos",
      "equipoPropio",
      "menuDegustacion",
      "certificacionesProfesional",
      "tipoExperienciaChef",
      "menuPersonalizado",
      "cenasPrivadas",
      "clasesCocina",
      "utensiliosIncluidos",
      "menuTextoSanitizado",
      "tiposCocinaChef",
      "experienciaRestaurantes",
      "referenciasClientes",
      "duracionServicioHoras",
      "viajeIncluidoKm",
      "promocionPareja",
      "pagoAnticipoPorcentaje",
      "zonaCoberturaColonias",
      "certificacionHalalKosher",
      "cienPorCientoSinGluten"
    ],
    "obligatoriosDelta": [
      "tipoServicioProfesional",
      "permisoManipulacionAlimentos",
      "personasAtiendeMax",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "tipoExperienciaChef": "Detalla tipoExperienciaChef con datos verificables — evita promesas falsas.",
      "menuPersonalizado": "Detalla menuPersonalizado con datos verificables — evita promesas falsas.",
      "cenasPrivadas": "Detalla cenasPrivadas con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "tipoExperienciaChef": "Experiencias que ofreces",
      "comensalesMaxChef": "Comensales máximos por servicio"
    },
    "blockHint": "Chef a domicilio — experiencias, menú degustación y zona de servicio.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "bartender-servicio": {
    "deltaFields": [
      "tipoServicioProfesional",
      "especialidadCocina",
      "personasAtiendeMax",
      "incluyeCompras",
      "incluyeLimpieza",
      "radioServicioKm",
      "precioDesdeMx",
      "anticipoRequerido",
      "permisoManipulacionAlimentos",
      "equipoPropio",
      "menuDegustacion",
      "certificacionesProfesional",
      "tipoEventoBar",
      "coctelesSignature",
      "barraMovilIncluida",
      "hieloInsumos",
      "servicioAlcoholCliente",
      "menuTextoSanitizado",
      "tiposBarra",
      "experienciaAniosBar",
      "referenciasEventos",
      "duracionServicioHoras",
      "uniformeIncluido",
      "promocionPaquete",
      "pagoAnticipoPorcentaje",
      "zonaCoberturaColonias"
    ],
    "obligatoriosDelta": [
      "tipoServicioProfesional",
      "coctelesSignature",
      "servicioAlcoholCliente",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "tipoEventoBar": "Detalla tipoEventoBar con datos verificables — evita promesas falsas.",
      "coctelesSignature": "Detalla coctelesSignature con datos verificables — evita promesas falsas.",
      "barraMovilIncluida": "Detalla barraMovilIncluida con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores."
    },
    "fieldLabels": {
      "serviciosBarraMovil": "Servicios de barra móvil"
    },
    "blockHint": "Bartender móvil — barra, cocteles y eventos privados.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  },
  "distribuidoras-alimentos-bebidas": {
    "deltaFields": [
      "categoriasProducto",
      "coberturaEntrega",
      "pedidoMinimoMayoreo",
      "horarioReparto",
      "cadenaFrio",
      "permisoManipulacionAlimentos",
      "permisoVentaAlcohol",
      "facturacionDisponible",
      "marcasRepresentadas",
      "tiempoEntregaDias",
      "capacidadAlmacen",
      "clientesTipo",
      "catalogoMayoreo",
      "entregaRefrigerada",
      "creditoComercial",
      "rotacionInventario",
      "zonasCoberturaDetalle",
      "menuTextoSanitizado",
      "minimoPrimeraCompra",
      "entregaProgramada",
      "soporteComercial",
      "devolucionesPolitica",
      "catalogoDigital",
      "certificacionesCalidad",
      "pagoCreditoDias",
      "zonaCoberturaColonias"
    ],
    "obligatoriosDelta": [
      "categoriasProducto",
      "permisoManipulacionAlimentos",
      "pedidoMinimoMayoreo",
      "geo",
      "horarioAtencionComercial"
    ],
    "textosAyuda": {
      "catalogoMayoreo": "Detalla catalogoMayoreo con datos verificables — evita promesas falsas.",
      "entregaRefrigerada": "Detalla entregaRefrigerada con datos verificables — evita promesas falsas.",
      "creditoComercial": "Detalla creditoComercial con datos verificables — evita promesas falsas.",
      "tipoCocinaPrincipal": "Mexicana, mariscos, italiana, fusión — sé específico.",
      "precioPromedioMx": "Ticket promedio por persona — orientativo.",
      "permisoManipulacionAlimentos": "Declara si cuentas con permiso vigente.",
      "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
      "diferenciadorProfesional": "Ej. Ingredientes locales · Horno de leña · Menú degustación",
      "ventaAlcohol": "Si vendes alcohol, declara permisos y política de menores.",
      "disclaimerReguladoGastronomia": "Mayoreo B2B — cumple normativa aplicable."
    },
    "fieldLabels": {
      "categoriasDistribucion": "Categorías que distribuyes",
      "coberturaDistribucion": "Zona de cobertura"
    },
    "blockHint": "Distribución B2B — categorías, cobertura y pedido mínimo.",
    "extraFields": [
      "colaboracionesComerciales",
      "diferenciadorProfesional"
    ],
    "hideFields": [
      "nivelServicio",
      "modalidades",
      "precioDesde",
      "medidas",
      "talla",
      "orientacion",
      "serviciosAdultos",
      "disponibilidadAgenda",
      "nivelPremium",
      "realizaTrios",
      "haceColaboraciones",
      "colaboraCon",
      "mostrarColaboraciones",
      "colaboracionContenido",
      "videoPresentacion",
      "tipoCitaPreferida",
      "disponiblePara",
      "buscanConocer",
      "experienciaVip",
      "distintivosVip",
      "presentacionFemboy",
      "presentacionTom",
      "estiloPredominante",
      "atiendoA",
      "mostrarAtiendoA"
    ],
    "fieldOptions": {
      "colaboracionesComerciales": [
        {
          "value": "si_activo",
          "label": "Sí, colaboro activamente"
        },
        {
          "value": "ocasional",
          "label": "Ocasionalmente"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        },
        {
          "value": "no",
          "label": "No por ahora"
        }
      ]
    }
  }
};

  var CANON_IDS = [
  "restaurantes-tradicional",
  "marisquerias",
  "cocina-economica",
  "taquerias",
  "hamburgueserias",
  "pizzerias",
  "polleryas-alitas",
  "sushi-cocina-asiatica",
  "carnes-asadas-parrilla",
  "cafeterias",
  "panaderias",
  "pastelerias-reposteria",
  "neverias-heladerias",
  "juguerias",
  "food-trucks-gastronomia",
  "comida-a-domicilio",
  "dark-kitchen",
  "bares",
  "cervecerias",
  "cantinas-vinotecas",
  "buffet-comedor",
  "chef-cocinero-domicilio",
  "bartender-servicio",
  "distribuidoras-alimentos-bebidas"
];

  var REGULATED_CANON = [
  "bares",
  "cervecerias",
  "cantinas-vinotecas",
  "distribuidoras-alimentos-bebidas",
  "dark-kitchen"
];

  var UI_IND_GASTRONOMIA = "ui_ind_gastronomia";
  var UI_NEG_GASTRONOMIA = "ui_neg_gastronomia";

  var FIELD_REGISTRY = {
  "tipoCocinaPrincipal": {
    "id": "tipoCocinaPrincipal",
    "label": "Tipo de cocina principal",
    "type": "checklist",
    "options": [
      {
        "value": "mexicana",
        "label": "Mexicana"
      },
      {
        "value": "internacional",
        "label": "Internacional"
      },
      {
        "value": "fusion",
        "label": "Fusion"
      },
      {
        "value": "regional",
        "label": "Regional"
      },
      {
        "value": "saludable",
        "label": "Saludable"
      },
      {
        "value": "otra",
        "label": "Otra"
      }
    ],
    "hint": ""
  },
  "capacidadComensales": {
    "id": "capacidadComensales",
    "label": "Capacidad de comensales",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "servicioMesa": {
    "id": "servicioMesa",
    "label": "Servicio en mesa",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "aceptaReservaciones": {
    "id": "aceptaReservaciones",
    "label": "Acepta reservaciones",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "terrazaPatio": {
    "id": "terrazaPatio",
    "label": "Terraza o patio",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "estacionamientoClientes": {
    "id": "estacionamientoClientes",
    "label": "Estacionamiento para clientes",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "menuDelDia": {
    "id": "menuDelDia",
    "label": "Menú del día",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "precioPromedioMx": {
    "id": "precioPromedioMx",
    "label": "Precio promedio por persona (MXN)",
    "type": "text",
    "options": [],
    "hint": "Rango honesto — no incluye propina."
  },
  "horarioCocina": {
    "id": "horarioCocina",
    "label": "Horario de cocina",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "permisoManipulacionAlimentos": {
    "id": "permisoManipulacionAlimentos",
    "label": "Permiso de manipulación de alimentos vigente",
    "type": "boolean",
    "options": [],
    "hint": "Declaración — puede requerir verificación admin."
  },
  "ventaAlcohol": {
    "id": "ventaAlcohol",
    "label": "Vende bebidas alcohólicas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "politicaMenoresAlcohol": {
    "id": "politicaMenoresAlcohol",
    "label": "Política menores en área de alcohol",
    "type": "select",
    "options": [
      {
        "value": "prohibido_menores",
        "label": "Prohibido Menores"
      },
      {
        "value": "solo_con_adulto",
        "label": "Solo Con Adulto"
      },
      {
        "value": "area_separada",
        "label": "Area Separada"
      },
      {
        "value": "no_aplica",
        "label": "No Aplica"
      }
    ],
    "hint": ""
  },
  "opcionesDieteticas": {
    "id": "opcionesDieteticas",
    "label": "Opciones dietéticas",
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
        "value": "keto",
        "label": "Keto"
      },
      {
        "value": "sin_lactosa",
        "label": "Sin Lactosa"
      }
    ],
    "hint": ""
  },
  "tipoServicioRapido": {
    "id": "tipoServicioRapido",
    "label": "Tipo de servicio rápido",
    "type": "select",
    "options": [
      {
        "value": "mostrador",
        "label": "Mostrador"
      },
      {
        "value": "drive_thru",
        "label": "Drive Thru"
      },
      {
        "value": "mixto",
        "label": "Mixto"
      },
      {
        "value": "solo_delivery",
        "label": "Solo Delivery"
      }
    ],
    "hint": ""
  },
  "pedidoMostrador": {
    "id": "pedidoMostrador",
    "label": "Pedido en mostrador",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "pedidoParaLlevar": {
    "id": "pedidoParaLlevar",
    "label": "Para llevar",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "deliveryPropio": {
    "id": "deliveryPropio",
    "label": "Delivery propio",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tiempoPreparacionMin": {
    "id": "tiempoPreparacionMin",
    "label": "Tiempo promedio de preparación (min)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "combosPromociones": {
    "id": "combosPromociones",
    "label": "Combos o promociones frecuentes",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "aceptaPedidosApp": {
    "id": "aceptaPedidosApp",
    "label": "Pedidos por app (Uber/Didi/Rappi)",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "productosHorneados": {
    "id": "productosHorneados",
    "label": "Productos horneados",
    "type": "checklist",
    "options": [
      {
        "value": "pan",
        "label": "Pan"
      },
      {
        "value": "bolleria",
        "label": "Bolleria"
      },
      {
        "value": "galletas",
        "label": "Galletas"
      },
      {
        "value": "pasteles",
        "label": "Pasteles"
      },
      {
        "value": "pays",
        "label": "Pays"
      },
      {
        "value": "otros",
        "label": "Otros"
      }
    ],
    "hint": ""
  },
  "pedidosPersonalizados": {
    "id": "pedidosPersonalizados",
    "label": "Pedidos personalizados",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "entregaADomicilio": {
    "id": "entregaADomicilio",
    "label": "Entrega a domicilio",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioHorneado": {
    "id": "horarioHorneado",
    "label": "Horario de horneado",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "opcionesSinGluten": {
    "id": "opcionesSinGluten",
    "label": "Opciones sin gluten",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "opcionesVeganas": {
    "id": "opcionesVeganas",
    "label": "Opciones veganas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "capacidadProduccionDiaria": {
    "id": "capacidadProduccionDiaria",
    "label": "Capacidad producción diaria (piezas aprox.)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "mostradorFisico": {
    "id": "mostradorFisico",
    "label": "Mostrador físico",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "pedidoAnticipadoHoras": {
    "id": "pedidoAnticipadoHoras",
    "label": "Anticipación mínima pedido (horas)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "embalajeEspecial": {
    "id": "embalajeEspecial",
    "label": "Embalaje especial / térmico",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "bebidasPrincipal": {
    "id": "bebidasPrincipal",
    "label": "Bebidas principales",
    "type": "checklist",
    "options": [
      {
        "value": "cafe",
        "label": "Cafe"
      },
      {
        "value": "te",
        "label": "Te"
      },
      {
        "value": "jugos",
        "label": "Jugos"
      },
      {
        "value": "smoothies",
        "label": "Smoothies"
      },
      {
        "value": "chocolate",
        "label": "Chocolate"
      },
      {
        "value": "otras",
        "label": "Otras"
      }
    ],
    "hint": ""
  },
  "granoOrigen": {
    "id": "granoOrigen",
    "label": "Origen del grano / proveedor",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "opcionesLacteos": {
    "id": "opcionesLacteos",
    "label": "Opciones de leche",
    "type": "checklist",
    "options": [
      {
        "value": "entera",
        "label": "Entera"
      },
      {
        "value": "deslactosada",
        "label": "Deslactosada"
      },
      {
        "value": "almendra",
        "label": "Almendra"
      },
      {
        "value": "avena",
        "label": "Avena"
      },
      {
        "value": "soya",
        "label": "Soya"
      }
    ],
    "hint": ""
  },
  "opcionesSinAzucar": {
    "id": "opcionesSinAzucar",
    "label": "Bebidas sin azúcar añadida",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioBarista": {
    "id": "horarioBarista",
    "label": "Horario barista / servicio",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "wifiClientes": {
    "id": "wifiClientes",
    "label": "WiFi para clientes",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "espacioTrabajo": {
    "id": "espacioTrabajo",
    "label": "Espacio apto para trabajar",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "comidaLigera": {
    "id": "comidaLigera",
    "label": "Comida ligera disponible",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tipoUnidadMovil": {
    "id": "tipoUnidadMovil",
    "label": "Tipo de unidad móvil",
    "type": "select",
    "options": [
      {
        "value": "food_truck",
        "label": "Food Truck"
      },
      {
        "value": "remolque",
        "label": "Remolque"
      },
      {
        "value": "carrito",
        "label": "Carrito"
      },
      {
        "value": "van",
        "label": "Van"
      }
    ],
    "hint": ""
  },
  "ubicacionHabitual": {
    "id": "ubicacionHabitual",
    "label": "Ubicación o ruta habitual",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "horarioRuta": {
    "id": "horarioRuta",
    "label": "Horario de ruta",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "diasOperacion": {
    "id": "diasOperacion",
    "label": "Días de operación",
    "type": "checklist",
    "options": [
      {
        "value": "lun",
        "label": "Lun"
      },
      {
        "value": "mar",
        "label": "Mar"
      },
      {
        "value": "mie",
        "label": "Mie"
      },
      {
        "value": "jue",
        "label": "Jue"
      },
      {
        "value": "vie",
        "label": "Vie"
      },
      {
        "value": "sab",
        "label": "Sab"
      },
      {
        "value": "dom",
        "label": "Dom"
      }
    ],
    "hint": ""
  },
  "aceptaEventosPrivados": {
    "id": "aceptaEventosPrivados",
    "label": "Acepta eventos privados (campo especialidad)",
    "type": "boolean",
    "options": [],
    "hint": "No cambia de sector — ver regla food truck F0."
  },
  "radioServicioKm": {
    "id": "radioServicioKm",
    "label": "Radio de servicio (km)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "requiereAguaLuz": {
    "id": "requiereAguaLuz",
    "label": "Requiere agua/luz en punto de venta",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "pedidoAnticipado": {
    "id": "pedidoAnticipado",
    "label": "Pedido con anticipación",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "capacidadProduccionHora": {
    "id": "capacidadProduccionHora",
    "label": "Capacidad aprox. por hora (órdenes)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "formasPago": {
    "id": "formasPago",
    "label": "Formas de pago",
    "type": "checklist",
    "options": [
      {
        "value": "efectivo",
        "label": "Efectivo"
      },
      {
        "value": "tarjeta",
        "label": "Tarjeta"
      },
      {
        "value": "transferencia",
        "label": "Transferencia"
      },
      {
        "value": "apps",
        "label": "Apps"
      }
    ],
    "hint": ""
  },
  "modeloOperacion": {
    "id": "modeloOperacion",
    "label": "Modelo de operación",
    "type": "select",
    "options": [
      {
        "value": "solo_delivery",
        "label": "Solo Delivery"
      },
      {
        "value": "dark_kitchen",
        "label": "Dark Kitchen"
      },
      {
        "value": "cloud_kitchen",
        "label": "Cloud Kitchen"
      },
      {
        "value": "mixto",
        "label": "Mixto"
      }
    ],
    "hint": ""
  },
  "zonasEntrega": {
    "id": "zonasEntrega",
    "label": "Zonas de entrega",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "costoEnvioDesde": {
    "id": "costoEnvioDesde",
    "label": "Costo envío desde (MXN)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "pedidoMinimoMx": {
    "id": "pedidoMinimoMx",
    "label": "Pedido mínimo (MXN)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "tiempoEntregaMin": {
    "id": "tiempoEntregaMin",
    "label": "Tiempo entrega estimado (min)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "horarioEntregas": {
    "id": "horarioEntregas",
    "label": "Horario de entregas",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "direccionOperacionPrivada": {
    "id": "direccionOperacionPrivada",
    "label": "Dirección operación (privada)",
    "type": "text",
    "options": [],
    "hint": "Dark kitchen — no se publica en ficha.",
    "maxLength": 200
  },
  "mostrarSoloZonaPublica": {
    "id": "mostrarSoloZonaPublica",
    "label": "Publicar solo zona/colonia (sin calle)",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tipoBebidasPrincipal": {
    "id": "tipoBebidasPrincipal",
    "label": "Bebidas principales",
    "type": "checklist",
    "options": [
      {
        "value": "cerveza",
        "label": "Cerveza"
      },
      {
        "value": "vino",
        "label": "Vino"
      },
      {
        "value": "destilados",
        "label": "Destilados"
      },
      {
        "value": "cocteles",
        "label": "Cocteles"
      },
      {
        "value": "mixto",
        "label": "Mixto"
      }
    ],
    "hint": ""
  },
  "permisoVentaAlcohol": {
    "id": "permisoVentaAlcohol",
    "label": "Permiso venta de alcohol vigente",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioBarra": {
    "id": "horarioBarra",
    "label": "Horario de barra",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "comidaEnMenu": {
    "id": "comidaEnMenu",
    "label": "Comida en menú",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "musicaAmbiente": {
    "id": "musicaAmbiente",
    "label": "Música en vivo o DJ",
    "type": "select",
    "options": [
      {
        "value": "ninguna",
        "label": "Ninguna"
      },
      {
        "value": "ambiente",
        "label": "Ambiente"
      },
      {
        "value": "vivo",
        "label": "Vivo"
      },
      {
        "value": "dj",
        "label": "Dj"
      }
    ],
    "hint": ""
  },
  "happyHour": {
    "id": "happyHour",
    "label": "Happy hour",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "tipoBuffet": {
    "id": "tipoBuffet",
    "label": "Tipo de buffet",
    "type": "select",
    "options": [
      {
        "value": "por_kilo",
        "label": "Por Kilo"
      },
      {
        "value": "por_persona",
        "label": "Por Persona"
      },
      {
        "value": "industrial",
        "label": "Industrial"
      },
      {
        "value": "tematico",
        "label": "Tematico"
      }
    ],
    "hint": ""
  },
  "precioPorPersonaMx": {
    "id": "precioPorPersonaMx",
    "label": "Precio por persona (MXN)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "horarioServicio": {
    "id": "horarioServicio",
    "label": "Horario de servicio",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "incluyeBebidas": {
    "id": "incluyeBebidas",
    "label": "Bebidas incluidas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "postresIncluidos": {
    "id": "postresIncluidos",
    "label": "Postres incluidos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "opcionesVegetarianas": {
    "id": "opcionesVegetarianas",
    "label": "Opciones vegetarianas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "reservacionesGrupos": {
    "id": "reservacionesGrupos",
    "label": "Reservaciones para grupos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tipoServicioProfesional": {
    "id": "tipoServicioProfesional",
    "label": "Tipo de servicio profesional",
    "type": "select",
    "options": [
      {
        "value": "chef_privado",
        "label": "Chef Privado"
      },
      {
        "value": "cocinero",
        "label": "Cocinero"
      },
      {
        "value": "bartender",
        "label": "Bartender"
      },
      {
        "value": "mixto",
        "label": "Mixto"
      }
    ],
    "hint": ""
  },
  "especialidadCocina": {
    "id": "especialidadCocina",
    "label": "Especialidad de cocina",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "personasAtiendeMax": {
    "id": "personasAtiendeMax",
    "label": "Personas que atiendes (máx.)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "incluyeCompras": {
    "id": "incluyeCompras",
    "label": "Incluye compra de insumos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "incluyeLimpieza": {
    "id": "incluyeLimpieza",
    "label": "Incluye limpieza posterior",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "precioDesdeMx": {
    "id": "precioDesdeMx",
    "label": "Precio desde (MXN)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "anticipoRequerido": {
    "id": "anticipoRequerido",
    "label": "Anticipo requerido (%)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "equipoPropio": {
    "id": "equipoPropio",
    "label": "Traes equipo propio",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "menuDegustacion": {
    "id": "menuDegustacion",
    "label": "Menú degustación disponible",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "certificacionesProfesional": {
    "id": "certificacionesProfesional",
    "label": "Certificaciones profesionales",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "categoriasProducto": {
    "id": "categoriasProducto",
    "label": "Categorías de producto",
    "type": "checklist",
    "options": [
      {
        "value": "abarrotes",
        "label": "Abarrotes"
      },
      {
        "value": "frescos",
        "label": "Frescos"
      },
      {
        "value": "congelados",
        "label": "Congelados"
      },
      {
        "value": "bebidas",
        "label": "Bebidas"
      },
      {
        "value": "snacks",
        "label": "Snacks"
      },
      {
        "value": "insumos",
        "label": "Insumos"
      }
    ],
    "hint": ""
  },
  "coberturaEntrega": {
    "id": "coberturaEntrega",
    "label": "Cobertura de entrega",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "pedidoMinimoMayoreo": {
    "id": "pedidoMinimoMayoreo",
    "label": "Pedido mínimo mayoreo (MXN)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "horarioReparto": {
    "id": "horarioReparto",
    "label": "Horario de reparto",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "cadenaFrio": {
    "id": "cadenaFrio",
    "label": "Cadena de frío",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "facturacionDisponible": {
    "id": "facturacionDisponible",
    "label": "Facturación disponible",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "marcasRepresentadas": {
    "id": "marcasRepresentadas",
    "label": "Marcas representadas",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "tiempoEntregaDias": {
    "id": "tiempoEntregaDias",
    "label": "Tiempo entrega mayoreo (días)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "capacidadAlmacen": {
    "id": "capacidadAlmacen",
    "label": "Capacidad almacén (m² aprox.)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "clientesTipo": {
    "id": "clientesTipo",
    "label": "Tipo de clientes B2B",
    "type": "checklist",
    "options": [
      {
        "value": "restaurantes",
        "label": "Restaurantes"
      },
      {
        "value": "retail",
        "label": "Retail"
      },
      {
        "value": "hoteles",
        "label": "Hoteles"
      },
      {
        "value": "escuelas",
        "label": "Escuelas"
      },
      {
        "value": "otros",
        "label": "Otros"
      }
    ],
    "hint": ""
  },
  "horarioAtencionComercial": {
    "id": "horarioAtencionComercial",
    "label": "Horario de atención",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "especialidadCasa": {
    "id": "especialidadCasa",
    "label": "Platillo estrella de la casa",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "chefVisible": {
    "id": "chefVisible",
    "label": "Chef visible en cocina abierta",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "maridajeVinos": {
    "id": "maridajeVinos",
    "label": "Maridaje o carta de vinos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "brunchDisponible": {
    "id": "brunchDisponible",
    "label": "Brunch fines de semana",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "eventosPrivadosSalon": {
    "id": "eventosPrivadosSalon",
    "label": "Eventos privados en salón",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "especialidadMar": {
    "id": "especialidadMar",
    "label": "Especialidad del mar",
    "type": "checklist",
    "options": [
      {
        "value": "pescado",
        "label": "Pescado"
      },
      {
        "value": "mariscos",
        "label": "Mariscos"
      },
      {
        "value": "mixto",
        "label": "Mixto"
      },
      {
        "value": "ceviches",
        "label": "Ceviches"
      },
      {
        "value": "cocteles",
        "label": "Cocteles"
      }
    ],
    "hint": ""
  },
  "pescadoDelDia": {
    "id": "pescadoDelDia",
    "label": "Pescado del día",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "barraOstiones": {
    "id": "barraOstiones",
    "label": "Barra de ostiones",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "platosEstrellaMar": {
    "id": "platosEstrellaMar",
    "label": "Platos estrella",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "origenPescado": {
    "id": "origenPescado",
    "label": "Origen del pescado",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "menuCorrida": {
    "id": "menuCorrida",
    "label": "Menú corrido / comida económica",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "precioMenuCorridaMx": {
    "id": "precioMenuCorridaMx",
    "label": "Precio menú corrido (MXN)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "incluyeBebidaMenu": {
    "id": "incluyeBebidaMenu",
    "label": "Incluye bebida en menú",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "platosRotativos": {
    "id": "platosRotativos",
    "label": "Platos rotativos por día",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "comedorIndustrial": {
    "id": "comedorIndustrial",
    "label": "Comedor industrial / empresas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tipoTortilla": {
    "id": "tipoTortilla",
    "label": "Tipo de tortilla",
    "type": "select",
    "options": [
      {
        "value": "maiz",
        "label": "Maiz"
      },
      {
        "value": "harina",
        "label": "Harina"
      },
      {
        "value": "ambas",
        "label": "Ambas"
      },
      {
        "value": "hecha_a_mano",
        "label": "Hecha A Mano"
      }
    ],
    "hint": ""
  },
  "especialidadTaco": {
    "id": "especialidadTaco",
    "label": "Especialidad de tacos",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "salsasCasa": {
    "id": "salsasCasa",
    "label": "Salsas de la casa",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "hornoTortillas": {
    "id": "hornoTortillas",
    "label": "Tortillas hechas al momento",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tacosEstrella": {
    "id": "tacosEstrella",
    "label": "Tacos estrella",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "tipoCarne": {
    "id": "tipoCarne",
    "label": "Tipo de carne principal",
    "type": "checklist",
    "options": [
      {
        "value": "res",
        "label": "Res"
      },
      {
        "value": "pollo",
        "label": "Pollo"
      },
      {
        "value": "cerdo",
        "label": "Cerdo"
      },
      {
        "value": "mixto",
        "label": "Mixto"
      },
      {
        "value": "plant_based",
        "label": "Plant Based"
      }
    ],
    "hint": ""
  },
  "panArtesanal": {
    "id": "panArtesanal",
    "label": "Pan artesanal propio",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "papasCasa": {
    "id": "papasCasa",
    "label": "Papas / acompañamientos casa",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "burgersEstrella": {
    "id": "burgersEstrella",
    "label": "Hamburguesas estrella",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "opcionesPlantBased": {
    "id": "opcionesPlantBased",
    "label": "Opciones plant-based",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tipoHorno": {
    "id": "tipoHorno",
    "label": "Tipo de horno",
    "type": "select",
    "options": [
      {
        "value": "leña",
        "label": "LeñA"
      },
      {
        "value": "gas",
        "label": "Gas"
      },
      {
        "value": "electric",
        "label": "Electric"
      },
      {
        "value": "piedra",
        "label": "Piedra"
      }
    ],
    "hint": ""
  },
  "masaFermentacion": {
    "id": "masaFermentacion",
    "label": "Masa con fermentación lenta",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tamanosPizza": {
    "id": "tamanosPizza",
    "label": "Tamaños disponibles",
    "type": "checklist",
    "options": [
      {
        "value": "individual",
        "label": "Individual"
      },
      {
        "value": "mediana",
        "label": "Mediana"
      },
      {
        "value": "grande",
        "label": "Grande"
      },
      {
        "value": "familiar",
        "label": "Familiar"
      },
      {
        "value": "por_rebanada",
        "label": "Por Rebanada"
      }
    ],
    "hint": ""
  },
  "pizzasEstrella": {
    "id": "pizzasEstrella",
    "label": "Pizzas estrella",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "entregaCaliente": {
    "id": "entregaCaliente",
    "label": "Garantía entrega caliente",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "cortePollo": {
    "id": "cortePollo",
    "label": "Cortes / preparaciones de pollo",
    "type": "checklist",
    "options": [
      {
        "value": "rostizado",
        "label": "Rostizado"
      },
      {
        "value": "alitas",
        "label": "Alitas"
      },
      {
        "value": "boneless",
        "label": "Boneless"
      },
      {
        "value": "nuggets",
        "label": "Nuggets"
      },
      {
        "value": "mixto",
        "label": "Mixto"
      }
    ],
    "hint": ""
  },
  "salsasAlitas": {
    "id": "salsasAlitas",
    "label": "Salsas para alitas",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "combosFamiliares": {
    "id": "combosFamiliares",
    "label": "Combos familiares",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "rostizadoHorario": {
    "id": "rostizadoHorario",
    "label": "Horario salida del horno",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "platosPolloEstrella": {
    "id": "platosPolloEstrella",
    "label": "Platos estrella de pollo",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "estiloAsiatico": {
    "id": "estiloAsiatico",
    "label": "Estilo asiático",
    "type": "checklist",
    "options": [
      {
        "value": "sushi",
        "label": "Sushi"
      },
      {
        "value": "ramen",
        "label": "Ramen"
      },
      {
        "value": "thai",
        "label": "Thai"
      },
      {
        "value": "china",
        "label": "China"
      },
      {
        "value": "coreana",
        "label": "Coreana"
      },
      {
        "value": "fusion",
        "label": "Fusion"
      }
    ],
    "hint": ""
  },
  "barraSushi": {
    "id": "barraSushi",
    "label": "Barra de sushi",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "opcionesCrudo": {
    "id": "opcionesCrudo",
    "label": "Platos con pescado crudo",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "platosAsiaticosEstrella": {
    "id": "platosAsiaticosEstrella",
    "label": "Platos estrella",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "teMatcha": {
    "id": "teMatcha",
    "label": "Té matcha / postres asiáticos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tipoParrilla": {
    "id": "tipoParrilla",
    "label": "Tipo de parrilla",
    "type": "select",
    "options": [
      {
        "value": "carbon",
        "label": "Carbon"
      },
      {
        "value": "gas",
        "label": "Gas"
      },
      {
        "value": "smoker",
        "label": "Smoker"
      },
      {
        "value": "asador_argentino",
        "label": "Asador Argentino"
      }
    ],
    "hint": ""
  },
  "cortesEspecialidad": {
    "id": "cortesEspecialidad",
    "label": "Cortes especialidad",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "marinadosCasa": {
    "id": "marinadosCasa",
    "label": "Marinados de la casa",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "servicioAsadorMesa": {
    "id": "servicioAsadorMesa",
    "label": "Asador en mesa",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "guarnicionesParrilla": {
    "id": "guarnicionesParrilla",
    "label": "Guarniciones incluidas",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "metodosPreparacion": {
    "id": "metodosPreparacion",
    "label": "Métodos de preparación",
    "type": "checklist",
    "options": [
      {
        "value": "espresso",
        "label": "Espresso"
      },
      {
        "value": "pour_over",
        "label": "Pour Over"
      },
      {
        "value": "chemex",
        "label": "Chemex"
      },
      {
        "value": "cold_brew",
        "label": "Cold Brew"
      },
      {
        "value": "frappe",
        "label": "Frappe"
      }
    ],
    "hint": ""
  },
  "pastelesLigeros": {
    "id": "pastelesLigeros",
    "label": "Pasteles ligeros / repostería",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "desayunos": {
    "id": "desayunos",
    "label": "Desayunos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "latteArt": {
    "id": "latteArt",
    "label": "Latte art",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "origenGranoDetalle": {
    "id": "origenGranoDetalle",
    "label": "Detalle origen del grano",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "tiposPan": {
    "id": "tiposPan",
    "label": "Tipos de pan",
    "type": "checklist",
    "options": [
      {
        "value": "blanco",
        "label": "Blanco"
      },
      {
        "value": "integral",
        "label": "Integral"
      },
      {
        "value": "artesanal",
        "label": "Artesanal"
      },
      {
        "value": "dulce",
        "label": "Dulce"
      },
      {
        "value": "salado",
        "label": "Salado"
      }
    ],
    "hint": ""
  },
  "hornoTipo": {
    "id": "hornoTipo",
    "label": "Tipo de horno",
    "type": "select",
    "options": [
      {
        "value": "piedra",
        "label": "Piedra"
      },
      {
        "value": "rotativo",
        "label": "Rotativo"
      },
      {
        "value": "conveccion",
        "label": "Conveccion"
      },
      {
        "value": "mixto",
        "label": "Mixto"
      }
    ],
    "hint": ""
  },
  "panDelDia": {
    "id": "panDelDia",
    "label": "Pan saliendo del horno (horario)",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "pedidosPorKilo": {
    "id": "pedidosPorKilo",
    "label": "Pedidos por kilo",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "productosSinGlutenPan": {
    "id": "productosSinGlutenPan",
    "label": "Pan sin gluten",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "pastelesPersonalizados": {
    "id": "pastelesPersonalizados",
    "label": "Pasteles personalizados",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "reposteriaFina": {
    "id": "reposteriaFina",
    "label": "Repostería fina",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tematicasPasteles": {
    "id": "tematicasPasteles",
    "label": "Temáticas frecuentes",
    "type": "checklist",
    "options": [
      {
        "value": "bodas",
        "label": "Bodas"
      },
      {
        "value": "infantil",
        "label": "Infantil"
      },
      {
        "value": "corporativo",
        "label": "Corporativo"
      },
      {
        "value": "xv",
        "label": "Xv"
      },
      {
        "value": "otros",
        "label": "Otros"
      }
    ],
    "hint": ""
  },
  "degustacionDisponible": {
    "id": "degustacionDisponible",
    "label": "Degustación previa",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "entregaEventosPequenos": {
    "id": "entregaEventosPequenos",
    "label": "Entrega eventos pequeños (no sector Eventos)",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "baseHelado": {
    "id": "baseHelado",
    "label": "Base del helado",
    "type": "select",
    "options": [
      {
        "value": "crema",
        "label": "Crema"
      },
      {
        "value": "leche",
        "label": "Leche"
      },
      {
        "value": "vegano",
        "label": "Vegano"
      },
      {
        "value": "nieve_agua",
        "label": "Nieve Agua"
      }
    ],
    "hint": ""
  },
  "saboresEstacion": {
    "id": "saboresEstacion",
    "label": "Sabores de temporada",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "paletasArtesanales": {
    "id": "paletasArtesanales",
    "label": "Paletas artesanales",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "opcionesVeganasHelado": {
    "id": "opcionesVeganasHelado",
    "label": "Opciones veganas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "eventosCarritoHelado": {
    "id": "eventosCarritoHelado",
    "label": "Carrito para fiestas (campo especialidad)",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "frutasEstacion": {
    "id": "frutasEstacion",
    "label": "Frutas de temporada",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "boostProteina": {
    "id": "boostProteina",
    "label": "Boost proteína disponible",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "jugosDetox": {
    "id": "jugosDetox",
    "label": "Jugos detox / verdes",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "combinacionesEstrella": {
    "id": "combinacionesEstrella",
    "label": "Combinaciones estrella",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "sinAzucarAnadida": {
    "id": "sinAzucarAnadida",
    "label": "Opciones sin azúcar añadida",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "especialidadTruck": {
    "id": "especialidadTruck",
    "label": "Especialidad del food truck",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "puntosFijosSemana": {
    "id": "puntosFijosSemana",
    "label": "Puntos fijos de la semana",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "publicaUbicacionDiaria": {
    "id": "publicaUbicacionDiaria",
    "label": "Publicar ubicación diaria",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "eventosPrivadosTruck": {
    "id": "eventosPrivadosTruck",
    "label": "Contratación fiestas privadas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "redesUbicacion": {
    "id": "redesUbicacion",
    "label": "Redes donde anuncias ubicación",
    "type": "checklist",
    "options": [
      {
        "value": "instagram",
        "label": "Instagram"
      },
      {
        "value": "facebook",
        "label": "Facebook"
      },
      {
        "value": "tiktok",
        "label": "Tiktok"
      },
      {
        "value": "whatsapp",
        "label": "Whatsapp"
      },
      {
        "value": "ninguna",
        "label": "Ninguna"
      }
    ],
    "hint": ""
  },
  "tipoComidaDomicilio": {
    "id": "tipoComidaDomicilio",
    "label": "Tipo de comida a domicilio",
    "type": "checklist",
    "options": [
      {
        "value": "casera",
        "label": "Casera"
      },
      {
        "value": "saludable",
        "label": "Saludable"
      },
      {
        "value": "internacional",
        "label": "Internacional"
      },
      {
        "value": "meal_prep",
        "label": "Meal Prep"
      },
      {
        "value": "otra",
        "label": "Otra"
      }
    ],
    "hint": ""
  },
  "menuSemanal": {
    "id": "menuSemanal",
    "label": "Menú semanal rotativo",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "diasEntrega": {
    "id": "diasEntrega",
    "label": "Días de entrega",
    "type": "checklist",
    "options": [
      {
        "value": "lun",
        "label": "Lun"
      },
      {
        "value": "mar",
        "label": "Mar"
      },
      {
        "value": "mie",
        "label": "Mie"
      },
      {
        "value": "jue",
        "label": "Jue"
      },
      {
        "value": "vie",
        "label": "Vie"
      },
      {
        "value": "sab",
        "label": "Sab"
      },
      {
        "value": "dom",
        "label": "Dom"
      }
    ],
    "hint": ""
  },
  "embalajeTermico": {
    "id": "embalajeTermico",
    "label": "Embalaje térmico",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "pedidoRecurrente": {
    "id": "pedidoRecurrente",
    "label": "Suscripción / pedido recurrente",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "marcasVirtuales": {
    "id": "marcasVirtuales",
    "label": "Marcas virtuales operadas",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "appsDelivery": {
    "id": "appsDelivery",
    "label": "Apps de delivery",
    "type": "checklist",
    "options": [
      {
        "value": "uber_eats",
        "label": "Uber Eats"
      },
      {
        "value": "rappi",
        "label": "Rappi"
      },
      {
        "value": "didi",
        "label": "Didi"
      },
      {
        "value": "propia",
        "label": "Propia"
      },
      {
        "value": "otras",
        "label": "Otras"
      }
    ],
    "hint": ""
  },
  "cocinaCompartida": {
    "id": "cocinaCompartida",
    "label": "Cocina compartida / ghost",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "cartelesCocteles": {
    "id": "cartelesCocteles",
    "label": "Cocteles de autor",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "botanasDestacadas": {
    "id": "botanasDestacadas",
    "label": "Botanas destacadas",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "barraMixologia": {
    "id": "barraMixologia",
    "label": "Barra de mixología",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "ambienteBar": {
    "id": "ambienteBar",
    "label": "Ambiente del bar",
    "type": "select",
    "options": [
      {
        "value": "casual",
        "label": "Casual"
      },
      {
        "value": "gastronomico",
        "label": "Gastronomico"
      },
      {
        "value": "sport",
        "label": "Sport"
      },
      {
        "value": "speakeasy",
        "label": "Speakeasy"
      },
      {
        "value": "tradicional",
        "label": "Tradicional"
      }
    ],
    "hint": ""
  },
  "restauranteBarGastronomico": {
    "id": "restauranteBarGastronomico",
    "label": "Restaurante-bar gastronómico (no antro)",
    "type": "boolean",
    "options": [],
    "hint": "Si es antro/show adulto → sector Adultos."
  },
  "estilosCerveza": {
    "id": "estilosCerveza",
    "label": "Estilos de cerveza",
    "type": "checklist",
    "options": [
      {
        "value": "lager",
        "label": "Lager"
      },
      {
        "value": "ipa",
        "label": "Ipa"
      },
      {
        "value": "stout",
        "label": "Stout"
      },
      {
        "value": "wheat",
        "label": "Wheat"
      },
      {
        "value": "artesanal_local",
        "label": "Artesanal Local"
      },
      {
        "value": "importada",
        "label": "Importada"
      }
    ],
    "hint": ""
  },
  "produccionPropia": {
    "id": "produccionPropia",
    "label": "Producción propia en sitio",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "maridajeCerveza": {
    "id": "maridajeCerveza",
    "label": "Maridaje con comida",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tapListRotativa": {
    "id": "tapListRotativa",
    "label": "Tap list rotativa",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "visitaCerveceria": {
    "id": "visitaCerveceria",
    "label": "Tour / visita cervecería",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "botellasDestacadas": {
    "id": "botellasDestacadas",
    "label": "Botellas destacadas",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "cavaVinos": {
    "id": "cavaVinos",
    "label": "Cava o selección de vinos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "botanasCantina": {
    "id": "botanasCantina",
    "label": "Botanas de cantina",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "ventaBotella": {
    "id": "ventaBotella",
    "label": "Venta por botella",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "rotacionPlatos": {
    "id": "rotacionPlatos",
    "label": "Rotación de platos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "estacionesBuffet": {
    "id": "estacionesBuffet",
    "label": "Estaciones del buffet",
    "type": "checklist",
    "options": [
      {
        "value": "ensaladas",
        "label": "Ensaladas"
      },
      {
        "value": "calientes",
        "label": "Calientes"
      },
      {
        "value": "postres",
        "label": "Postres"
      },
      {
        "value": "bebidas",
        "label": "Bebidas"
      },
      {
        "value": "parrilla",
        "label": "Parrilla"
      },
      {
        "value": "sushi",
        "label": "Sushi"
      }
    ],
    "hint": ""
  },
  "comedorEmpresarial": {
    "id": "comedorEmpresarial",
    "label": "Comedor empresarial",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "controlPorciones": {
    "id": "controlPorciones",
    "label": "Control de porciones incluido",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "platosCalientesFrios": {
    "id": "platosCalientesFrios",
    "label": "Estaciones calientes y frías",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tipoExperienciaChef": {
    "id": "tipoExperienciaChef",
    "label": "Tipo de experiencia",
    "type": "checklist",
    "options": [
      {
        "value": "cena_privada",
        "label": "Cena Privada"
      },
      {
        "value": "clase",
        "label": "Clase"
      },
      {
        "value": "meal_prep",
        "label": "Meal Prep"
      },
      {
        "value": "banquete_pequeno",
        "label": "Banquete Pequeno"
      }
    ],
    "hint": ""
  },
  "menuPersonalizado": {
    "id": "menuPersonalizado",
    "label": "Menú 100% personalizado",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "cenasPrivadas": {
    "id": "cenasPrivadas",
    "label": "Cenas privadas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "clasesCocina": {
    "id": "clasesCocina",
    "label": "Clases de cocina",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "utensiliosIncluidos": {
    "id": "utensiliosIncluidos",
    "label": "Utensilios incluidos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tipoEventoBar": {
    "id": "tipoEventoBar",
    "label": "Tipo de evento",
    "type": "checklist",
    "options": [
      {
        "value": "casa",
        "label": "Casa"
      },
      {
        "value": "corporativo",
        "label": "Corporativo"
      },
      {
        "value": "boda",
        "label": "Boda"
      },
      {
        "value": "fiesta_privada",
        "label": "Fiesta Privada"
      }
    ],
    "hint": ""
  },
  "coctelesSignature": {
    "id": "coctelesSignature",
    "label": "Cocteles signature",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "barraMovilIncluida": {
    "id": "barraMovilIncluida",
    "label": "Barra móvil incluida",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "hieloInsumos": {
    "id": "hieloInsumos",
    "label": "Hielo e insumos incluidos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "servicioAlcoholCliente": {
    "id": "servicioAlcoholCliente",
    "label": "Alcohol provisto por cliente",
    "type": "boolean",
    "options": [],
    "hint": "Si vendes alcohol tú → permisos aplican."
  },
  "catalogoMayoreo": {
    "id": "catalogoMayoreo",
    "label": "Catálogo mayoreo (resumen)",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 300
  },
  "entregaRefrigerada": {
    "id": "entregaRefrigerada",
    "label": "Entrega refrigerada",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "creditoComercial": {
    "id": "creditoComercial",
    "label": "Crédito comercial",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "rotacionInventario": {
    "id": "rotacionInventario",
    "label": "Rotación de inventario alta",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "zonasCoberturaDetalle": {
    "id": "zonasCoberturaDetalle",
    "label": "Detalle zonas cobertura",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "disclaimerReguladoGastronomia": {
    "id": "disclaimerReguladoGastronomia",
    "label": "Declaro información veraz sobre permisos y alcohol",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "menuTextoSanitizado": {
    "id": "menuTextoSanitizado",
    "label": "Extracto menú (texto plano)",
    "type": "textarea",
    "options": [],
    "hint": "",
    "maxLength": 2000,
    "rows": 3
  },
  "servicioSommelier": {
    "id": "servicioSommelier",
    "label": "Servicio de sommelier",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "platillosTemporada": {
    "id": "platillosTemporada",
    "label": "Platillos de temporada",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "cocinaAbiertaVisible": {
    "id": "cocinaAbiertaVisible",
    "label": "Cocina abierta visible",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "reservacionesOnline": {
    "id": "reservacionesOnline",
    "label": "Reservaciones en línea",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "areasPetFriendly": {
    "id": "areasPetFriendly",
    "label": "Pet friendly",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "menuInfantil": {
    "id": "menuInfantil",
    "label": "Menú infantil",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "pagoSinContacto": {
    "id": "pagoSinContacto",
    "label": "Pago sin contacto / terminal",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "estacionamientoValet": {
    "id": "estacionamientoValet",
    "label": "Valet parking",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioDesayuno": {
    "id": "horarioDesayuno",
    "label": "Horario desayuno",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "coctelesMar": {
    "id": "coctelesMar",
    "label": "Cocteles de mar",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "cevicheBar": {
    "id": "cevicheBar",
    "label": "Barra de ceviches",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioPescadoFresco": {
    "id": "horarioPescadoFresco",
    "label": "Horario pescado fresco",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "platosSinCascara": {
    "id": "platosSinCascara",
    "label": "Platos pelados / sin cáscara",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "servicioPelado": {
    "id": "servicioPelado",
    "label": "Servicio de pelado en mesa",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "promocionMariscos": {
    "id": "promocionMariscos",
    "label": "Promoción mariscos",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "estacionamientoMotos": {
    "id": "estacionamientoMotos",
    "label": "Estacionamiento motos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioComidaCorrida": {
    "id": "horarioComidaCorrida",
    "label": "Horario comida corrida",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "diasMenuSemana": {
    "id": "diasMenuSemana",
    "label": "Menú por día de semana",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "porcionesGenerosas": {
    "id": "porcionesGenerosas",
    "label": "Porciones generosas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "paraLlevarEconomico": {
    "id": "paraLlevarEconomico",
    "label": "Para llevar económico",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "combosFamiliaresEconomicos": {
    "id": "combosFamiliaresEconomicos",
    "label": "Combos familiares",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "servicioRapidoMediodia": {
    "id": "servicioRapidoMediodia",
    "label": "Servicio rápido mediodía",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "guisadosDelDia": {
    "id": "guisadosDelDia",
    "label": "Guisados del día",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "ordenTacosMinimo": {
    "id": "ordenTacosMinimo",
    "label": "Orden mínima (tacos)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "salsaBar": {
    "id": "salsaBar",
    "label": "Barra de salsas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioMadrugada": {
    "id": "horarioMadrugada",
    "label": "Horario madrugada",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "paraEventosPequenos": {
    "id": "paraEventosPequenos",
    "label": "Pedidos eventos pequeños (campo)",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "promocionMartes": {
    "id": "promocionMartes",
    "label": "Promoción día específico",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "papasTipos": {
    "id": "papasTipos",
    "label": "Tipos de papas",
    "type": "checklist",
    "options": [
      {
        "value": "francesa",
        "label": "Francesa"
      },
      {
        "value": "curly",
        "label": "Curly"
      },
      {
        "value": "sweet",
        "label": "Sweet"
      },
      {
        "value": "smash_side",
        "label": "Smash Side"
      }
    ],
    "hint": ""
  },
  "malteadasCasa": {
    "id": "malteadasCasa",
    "label": "Malteadas de la casa",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "salsasSignature": {
    "id": "salsasSignature",
    "label": "Salsas signature",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "comboEjecutivo": {
    "id": "comboEjecutivo",
    "label": "Combo ejecutivo",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioNocturno": {
    "id": "horarioNocturno",
    "label": "Horario nocturno",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "paraLlevarRapido": {
    "id": "paraLlevarRapido",
    "label": "Para llevar en minutos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "pizzaMitades": {
    "id": "pizzaMitades",
    "label": "Mitades y combinadas",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "ingredientesPremium": {
    "id": "ingredientesPremium",
    "label": "Ingredientes premium",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "salsaTomateCasa": {
    "id": "salsaTomateCasa",
    "label": "Salsa de tomate casera",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "paraLlevarCaja": {
    "id": "paraLlevarCaja",
    "label": "Caja para llevar incluida",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "nivelPicante": {
    "id": "nivelPicante",
    "label": "Niveles de picante",
    "type": "checklist",
    "options": [
      {
        "value": "suave",
        "label": "Suave"
      },
      {
        "value": "medio",
        "label": "Medio"
      },
      {
        "value": "hot",
        "label": "Hot"
      },
      {
        "value": "extra_hot",
        "label": "Extra Hot"
      }
    ],
    "hint": ""
  },
  "papasIncluidas": {
    "id": "papasIncluidas",
    "label": "Papas incluidas en combo",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "salsasExtra": {
    "id": "salsasExtra",
    "label": "Salsas extra disponibles",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "promocionAlitas": {
    "id": "promocionAlitas",
    "label": "Promoción alitas",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "horarioPartido": {
    "id": "horarioPartido",
    "label": "Horario partidos / eventos deportivos",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "omakaseDisponible": {
    "id": "omakaseDisponible",
    "label": "Omakase / chef's choice",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "wasabiReal": {
    "id": "wasabiReal",
    "label": "Wasabi real (no polvo)",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "sakeSeleccion": {
    "id": "sakeSeleccion",
    "label": "Selección de sake",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "rollsTemporada": {
    "id": "rollsTemporada",
    "label": "Rolls de temporada",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "paraLlevarSushi": {
    "id": "paraLlevarSushi",
    "label": "Para llevar con empaque sushi",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioCena": {
    "id": "horarioCena",
    "label": "Horario cena",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "cortesImportados": {
    "id": "cortesImportados",
    "label": "Cortes importados",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "salsasParrilla": {
    "id": "salsasParrilla",
    "label": "Salsas de parrilla",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "hornoPan": {
    "id": "hornoPan",
    "label": "Pan de la casa en parrilla",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "promocionFinSemana": {
    "id": "promocionFinSemana",
    "label": "Promoción fin de semana",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "musicaEnVivo": {
    "id": "musicaEnVivo",
    "label": "Música en vivo",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "estacionamientoAmplio": {
    "id": "estacionamientoAmplio",
    "label": "Estacionamiento amplio",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "pastelesDelDia": {
    "id": "pastelesDelDia",
    "label": "Pasteles del día",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "sandwichesLigeros": {
    "id": "sandwichesLigeros",
    "label": "Sandwiches ligeros",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "promocionDesayuno": {
    "id": "promocionDesayuno",
    "label": "Promoción desayuno",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "reservacionesGruposPequenos": {
    "id": "reservacionesGruposPequenos",
    "label": "Reservaciones grupos pequeños",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "recetasTradicionales": {
    "id": "recetasTradicionales",
    "label": "Recetas tradicionales",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "panSinConservadores": {
    "id": "panSinConservadores",
    "label": "Sin conservadores artificiales",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "pedidosCorporativos": {
    "id": "pedidosCorporativos",
    "label": "Pedidos corporativos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioPrimeraSalida": {
    "id": "horarioPrimeraSalida",
    "label": "Horario primera salida del horno",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "promocionPanNoche": {
    "id": "promocionPanNoche",
    "label": "Promoción pan de noche",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "catalogoPasteles": {
    "id": "catalogoPasteles",
    "label": "Catálogo pasteles (resumen)",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 300
  },
  "rellenosDisponibles": {
    "id": "rellenosDisponibles",
    "label": "Rellenos disponibles",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "degustacionSabores": {
    "id": "degustacionSabores",
    "label": "Degustación de sabores",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "entregaMunicipio": {
    "id": "entregaMunicipio",
    "label": "Entrega en municipio",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioRecoleccion": {
    "id": "horarioRecoleccion",
    "label": "Horario recolección pedidos",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "promocionTemporada": {
    "id": "promocionTemporada",
    "label": "Promoción temporada",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "toppingsDisponibles": {
    "id": "toppingsDisponibles",
    "label": "Toppings disponibles",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "conosTipos": {
    "id": "conosTipos",
    "label": "Tipos de cono",
    "type": "checklist",
    "options": [
      {
        "value": "regular",
        "label": "Regular"
      },
      {
        "value": "grande",
        "label": "Grande"
      },
      {
        "value": "waffle",
        "label": "Waffle"
      },
      {
        "value": "paleta",
        "label": "Paleta"
      }
    ],
    "hint": ""
  },
  "promocionDoble": {
    "id": "promocionDoble",
    "label": "Promoción 2x1 / doble",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "horarioVerano": {
    "id": "horarioVerano",
    "label": "Horario temporada calor",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "paraLlevarNevera": {
    "id": "paraLlevarNevera",
    "label": "Para llevar en nevera/portátil",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "superfoodsDisponibles": {
    "id": "superfoodsDisponibles",
    "label": "Superfoods (chia, linaza, etc.)",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "promocionCombo": {
    "id": "promocionCombo",
    "label": "Promoción combo jugo",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "horarioManana": {
    "id": "horarioManana",
    "label": "Horario matutino",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "paraLlevarVaso": {
    "id": "paraLlevarVaso",
    "label": "Vaso reutilizable / para llevar",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "instagramUbicacion": {
    "id": "instagramUbicacion",
    "label": "Publicas ubicación en Instagram",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "promocionDia": {
    "id": "promocionDia",
    "label": "Promoción del día",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "capacidadCola": {
    "id": "capacidadCola",
    "label": "Capacidad cola aprox. (personas)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "menuRotativoSemana": {
    "id": "menuRotativoSemana",
    "label": "Menú rotativo semanal",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "aceptaTarjeta": {
    "id": "aceptaTarjeta",
    "label": "Acepta tarjeta",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "estacionamientoCercano": {
    "id": "estacionamientoCercano",
    "label": "Estacionamiento cercano",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "porcionesIndividuales": {
    "id": "porcionesIndividuales",
    "label": "Porciones individuales",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "alergenosDeclarados": {
    "id": "alergenosDeclarados",
    "label": "Alérgenos declarados en menú",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioPedidos": {
    "id": "horarioPedidos",
    "label": "Horario recepción pedidos",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "promocionSemanal": {
    "id": "promocionSemanal",
    "label": "Promoción semanal",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "pagoTransferencia": {
    "id": "pagoTransferencia",
    "label": "Pago por transferencia",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "embalajeEcologico": {
    "id": "embalajeEcologico",
    "label": "Embalaje ecológico",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "marcasOperadasDetalle": {
    "id": "marcasOperadasDetalle",
    "label": "Detalle marcas operadas",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 300
  },
  "tiempoPromedioApp": {
    "id": "tiempoPromedioApp",
    "label": "Tiempo promedio en apps (min)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "ratingApps": {
    "id": "ratingApps",
    "label": "Rating promedio apps",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "horarioPico": {
    "id": "horarioPico",
    "label": "Horario pico",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "embalajePremium": {
    "id": "embalajePremium",
    "label": "Embalaje premium anti-derrame",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "cartasVinos": {
    "id": "cartasVinos",
    "label": "Carta de vinos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "cervezasArtesanales": {
    "id": "cervezasArtesanales",
    "label": "Cervezas artesanales",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "musicaEnVivoBar": {
    "id": "musicaEnVivoBar",
    "label": "Música en vivo en bar",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioBarraNoche": {
    "id": "horarioBarraNoche",
    "label": "Horario barra noche",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "promocionHappyHour": {
    "id": "promocionHappyHour",
    "label": "Detalle happy hour",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "areasExterior": {
    "id": "areasExterior",
    "label": "Área exterior",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "flightCerveza": {
    "id": "flightCerveza",
    "label": "Flights / degustación cerveza",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "comidaBar": {
    "id": "comidaBar",
    "label": "Comida de bar (snacks)",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "horarioTaproom": {
    "id": "horarioTaproom",
    "label": "Horario taproom",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "promocionGrowler": {
    "id": "promocionGrowler",
    "label": "Promoción growler / para llevar",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "tequilaSeleccion": {
    "id": "tequilaSeleccion",
    "label": "Selección tequilas",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "mezcalArtesanal": {
    "id": "mezcalArtesanal",
    "label": "Mezcal artesanal",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "botanasTradicionales": {
    "id": "botanasTradicionales",
    "label": "Botanas tradicionales",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "horarioCantina": {
    "id": "horarioCantina",
    "label": "Horario cantina",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "promocionBotella": {
    "id": "promocionBotella",
    "label": "Promoción botella",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "platosDelDia": {
    "id": "platosDelDia",
    "label": "Platos del día en buffet",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "controlAlergenos": {
    "id": "controlAlergenos",
    "label": "Control de alérgenos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "horarioComida": {
    "id": "horarioComida",
    "label": "Horario comida",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 80
  },
  "estacionamientoEmpleados": {
    "id": "estacionamientoEmpleados",
    "label": "Estacionamiento empleados/clientes",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "tiposCocinaChef": {
    "id": "tiposCocinaChef",
    "label": "Tipos de cocina que dominas",
    "type": "checklist",
    "options": [
      {
        "value": "mexicana",
        "label": "Mexicana"
      },
      {
        "value": "internacional",
        "label": "Internacional"
      },
      {
        "value": "saludable",
        "label": "Saludable"
      },
      {
        "value": "gourmet",
        "label": "Gourmet"
      },
      {
        "value": "regional",
        "label": "Regional"
      },
      {
        "value": "pasteleria",
        "label": "Pasteleria"
      }
    ],
    "hint": ""
  },
  "experienciaRestaurantes": {
    "id": "experienciaRestaurantes",
    "label": "Experiencia en restaurantes (años)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "referenciasClientes": {
    "id": "referenciasClientes",
    "label": "Referencias verificables",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "duracionServicioHoras": {
    "id": "duracionServicioHoras",
    "label": "Duración típica servicio (horas)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "viajeIncluidoKm": {
    "id": "viajeIncluidoKm",
    "label": "Km incluidos en tarifa",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "promocionPareja": {
    "id": "promocionPareja",
    "label": "Promoción pareja / aniversario",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "pagoAnticipoPorcentaje": {
    "id": "pagoAnticipoPorcentaje",
    "label": "Anticipo requerido (%)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "tiposBarra": {
    "id": "tiposBarra",
    "label": "Tipos de barra",
    "type": "checklist",
    "options": [
      {
        "value": "clasica",
        "label": "Clasica"
      },
      {
        "value": "mixologia",
        "label": "Mixologia"
      },
      {
        "value": "cerveza",
        "label": "Cerveza"
      },
      {
        "value": "vino",
        "label": "Vino"
      },
      {
        "value": "movil",
        "label": "Movil"
      }
    ],
    "hint": ""
  },
  "experienciaAniosBar": {
    "id": "experienciaAniosBar",
    "label": "Años experiencia bartender",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "referenciasEventos": {
    "id": "referenciasEventos",
    "label": "Referencias eventos",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "uniformeIncluido": {
    "id": "uniformeIncluido",
    "label": "Uniforme incluido",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "promocionPaquete": {
    "id": "promocionPaquete",
    "label": "Paquetes promocionales",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  },
  "minimoPrimeraCompra": {
    "id": "minimoPrimeraCompra",
    "label": "Mínimo primera compra (MXN)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "entregaProgramada": {
    "id": "entregaProgramada",
    "label": "Entrega programada recurrente",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "soporteComercial": {
    "id": "soporteComercial",
    "label": "Ejecutivo comercial asignado",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "devolucionesPolitica": {
    "id": "devolucionesPolitica",
    "label": "Política devoluciones",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "catalogoDigital": {
    "id": "catalogoDigital",
    "label": "Catálogo digital / PDF",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "certificacionesCalidad": {
    "id": "certificacionesCalidad",
    "label": "Certificaciones calidad",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 200
  },
  "pagoCreditoDias": {
    "id": "pagoCreditoDias",
    "label": "Crédito (días)",
    "type": "text",
    "options": [],
    "hint": ""
  },
  "accesibilidadSillaRuedas": {
    "id": "accesibilidadSillaRuedas",
    "label": "Accesible silla de ruedas",
    "type": "boolean",
    "options": [],
    "hint": "Común en Google Maps / Yelp — ayuda a decidir."
  },
  "estacionamientoTipo": {
    "id": "estacionamientoTipo",
    "label": "Tipo de estacionamiento",
    "type": "select",
    "options": [
      {
        "value": "propio",
        "label": "Propio"
      },
      {
        "value": "valet",
        "label": "Valet"
      },
      {
        "value": "calle",
        "label": "Calle"
      },
      {
        "value": "ninguno",
        "label": "Ninguno"
      },
      {
        "value": "mixto",
        "label": "Mixto"
      }
    ],
    "hint": ""
  },
  "buenoParaNinos": {
    "id": "buenoParaNinos",
    "label": "Apto para niños",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "codigoVestimenta": {
    "id": "codigoVestimenta",
    "label": "Código de vestimenta",
    "type": "select",
    "options": [
      {
        "value": "casual",
        "label": "Casual"
      },
      {
        "value": "smart_casual",
        "label": "Smart Casual"
      },
      {
        "value": "formal",
        "label": "Formal"
      },
      {
        "value": "sin_codigo",
        "label": "Sin Codigo"
      }
    ],
    "hint": ""
  },
  "menuUrl": {
    "id": "menuUrl",
    "label": "Menú digital (URL)",
    "type": "text",
    "options": [],
    "hint": "https:// o ruta interna permitida — sin javascript:.",
    "maxLength": 500
  },
  "appsDeliveryRatings": {
    "id": "appsDeliveryRatings",
    "label": "Rating apps delivery (Uber Eats / Rappi / DiDi Food)",
    "type": "text",
    "options": [],
    "hint": "Aproximado — declaración del negocio."
  },
  "pedidoMinimoDelivery": {
    "id": "pedidoMinimoDelivery",
    "label": "Pedido mínimo delivery (MXN)",
    "type": "text",
    "options": [],
    "hint": "Mínimo por app o delivery propio."
  },
  "zonaCoberturaColonias": {
    "id": "zonaCoberturaColonias",
    "label": "Colonias / zonas de cobertura (público)",
    "type": "text",
    "options": [],
    "hint": "Sin calle exacta — solo colonias o zonas.",
    "maxLength": 300
  },
  "nivelRuido": {
    "id": "nivelRuido",
    "label": "Nivel de ruido",
    "type": "select",
    "options": [
      {
        "value": "silencioso",
        "label": "Silencioso"
      },
      {
        "value": "moderado",
        "label": "Moderado"
      },
      {
        "value": "animado",
        "label": "Animado"
      },
      {
        "value": "muy_animado",
        "label": "Muy Animado"
      }
    ],
    "hint": ""
  },
  "buenoParaGrupos": {
    "id": "buenoParaGrupos",
    "label": "Bueno para grupos",
    "type": "boolean",
    "options": [],
    "hint": ""
  },
  "certificacionHalalKosher": {
    "id": "certificacionHalalKosher",
    "label": "Certificación halal / kosher (declarativo)",
    "type": "select",
    "options": [
      {
        "value": "ninguna",
        "label": "Ninguna"
      },
      {
        "value": "halal",
        "label": "Halal"
      },
      {
        "value": "kosher",
        "label": "Kosher"
      },
      {
        "value": "halal_y_kosher",
        "label": "Halal Y Kosher"
      },
      {
        "value": "otra_declarativa",
        "label": "Otra Declarativa"
      }
    ],
    "hint": "Declaración del negocio — no verificada automáticamente."
  },
  "cienPorCientoSinGluten": {
    "id": "cienPorCientoSinGluten",
    "label": "100% sin gluten (declarativo)",
    "type": "boolean",
    "options": [],
    "hint": "Declaración del negocio — no verificada automáticamente."
  },
  "cocacolaFria": {
    "id": "cocacolaFria",
    "label": "cocacolaFria",
    "type": "text",
    "options": [],
    "hint": "",
    "maxLength": 120
  }
};

  var SHOW_WHEN_OVERRIDES = {
  "permisoVentaAlcohol": {
    "field": "ventaAlcohol",
    "truthy": true
  },
  "politicaMenoresAlcohol": {
    "field": "ventaAlcohol",
    "truthy": true
  },
  "direccionOperacionPrivada": {
    "field": "modeloOperacion",
    "values": [
      "dark_kitchen",
      "cloud_kitchen"
    ]
  },
  "mostrarSoloZonaPublica": {
    "field": "modeloOperacion",
    "values": [
      "dark_kitchen",
      "cloud_kitchen"
    ]
  },
  "eventosPrivadosTruck": {
    "field": "aceptaEventosPrivados",
    "truthy": true
  },
  "disclaimerReguladoGastronomia": {
    "field": "ventaAlcohol",
    "truthy": true
  }
};

  var BAR_CANON = [
  "bares",
  "cervecerias",
  "cantinas-vinotecas"
];

  var FOOD_NEGOCIO_PACKS = [
  "LOCAL_DINE",
  "FAST_CASUAL",
  "BAKERY_DESSERT",
  "CAFE",
  "MOBILE",
  "DELIVERY",
  "BAR_BEBIDAS",
  "BUFFET",
  "B2B_DIST"
];

  var GENERIC_FORBIDDEN_IDS = ['descripcion', 'horario', 'ubicacion', 'precioDesde', 'serviciosIncluidos'];

  var GASTRONOMIA_PRIVATE_FIELD_IDS = [
  "direccionOperacionPrivada",
  "permisoVentaAlcohol"
];

  var NESTED_PROFILE_KEY = 'gastronomiaPerfil';

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolveCanonSubId(raw) {
    var key = slugSubId(raw);
    if (!key) return '';
    if (CANON_META[key]) return key;
    return LEGACY_TO_CANON[key] || SECTOR_UI_SLUG_TO_CANON[key] || '';
  }

  function resolvePack(canonId) {
    return SUB_TO_PACK[canonId] || '';
  }

  function showWhenForField(fieldId, canonId) {
    var sw = SHOW_WHEN_OVERRIDES[fieldId] || null;
    if (fieldId === 'disclaimerReguladoGastronomia' && BAR_CANON.indexOf(canonId) < 0) {
      return null;
    }
    return sw;
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
    if (delta && delta.fieldLabels && delta.fieldLabels[fieldId]) {
      field.label = delta.fieldLabels[fieldId];
    }
    if (delta && delta.textosAyuda && delta.textosAyuda[fieldId]) {
      var ayuda = delta.textosAyuda[fieldId];
      if (field.type === 'checklist' || field.type === 'select' || field.type === 'boolean') {
        field.hint = ayuda;
      } else {
        field.placeholder = ayuda;
      }
    }
    var sw = showWhenForField(fieldId, canonId);
    if (sw) field.showWhen = sw;
    return field;
  }

  function extraFieldFromId(fieldId, required, canonId) {
    var delta = SUB_DELTAS[canonId];
    if (fieldId === 'colaboracionesComerciales') {
      var opts = (delta && delta.fieldOptions && delta.fieldOptions.colaboracionesComerciales) || [];
      return {
        id: fieldId,
        label: '¿Colaboras con otros negocios o chefs?',
        type: 'select',
        required: !!required,
        options: opts.length ? opts.slice() : [
          { value: 'si_activo', label: 'Sí, colaboro activamente' },
          { value: 'ocasional', label: 'Ocasionalmente' },
          { value: 'convenir', label: 'A convenir por proyecto' },
          { value: 'no', label: 'No por ahora' },
        ],
      };
    }
    if (fieldId === 'diferenciadorProfesional') {
      return {
        id: fieldId,
        label: 'Tu sello / lo que te distingue',
        type: 'text',
        required: !!required,
        placeholder: 'Ej. Ingredientes locales · Horno de leña',
      };
    }
    return null;
  }

  function personaIdentityBlock() {
    return {
      id: 'gastronomiaPersonaIdentidad',
      title: 'Tu servicio gastronómico',
      hint: 'Nombre público, cotización y precio — sin formulario genérico de descripción/horario.',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true, placeholder: 'Ej. Chef Ana · Cocina a domicilio' },
        { id: 'tagline', label: 'Frase que vende tu servicio', type: 'text', required: false, maxLength: 120 },
        {
          id: 'unidadCotizacion',
          label: 'Cotizas por',
          type: 'select',
          required: true,
          options: [
            { value: 'hora', label: 'Hora' },
            { value: 'persona', label: 'Persona' },
            { value: 'evento', label: 'Evento' },
            { value: 'kg', label: 'Kg' },
            { value: 'plato', label: 'Plato' },
            { value: 'orden', label: 'Orden' },
          ],
        },
        { id: 'precioDesdeMx', label: 'Precio desde (MXN)', type: 'text', required: true, placeholder: 'Ej. $800' },
      ],
    };
  }

  function negocioIdentityBlock() {
    return {
      id: 'gastronomiaNegocioIdentidad',
      title: 'Tu negocio gastronómico',
      fields: [
        { id: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
        { id: 'tagline', label: 'Frase que vende tu servicio', type: 'text', required: false, maxLength: 120 },
        { id: 'precioPromedioMx', label: 'Precio promedio por persona (MXN)', type: 'text', required: true, placeholder: 'Ej. $250' },
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
      if (fid === 'precioPromedioMx' || fid === 'precioDesdeMx') return;
      if (delta.hideFields && delta.hideFields.indexOf(fid) >= 0) return;
      var f = fieldFromRegistry(fid, !!oblSet[fid], canonId);
      if (f) fields.push(f);
    });
    (delta.extraFields || []).forEach(function (fid) {
      if (fields.some(function (x) { return x.id === fid; })) return;
      var ef = extraFieldFromId(fid, !!oblSet[fid], canonId);
      if (ef) fields.push(ef);
    });
    if (BAR_CANON.indexOf(canonId) >= 0) {
      var discBar = fieldFromRegistry('disclaimerReguladoGastronomia', false, canonId);
      if (discBar && fields.every(function (x) { return x.id !== discBar.id; })) fields.push(discBar);
    }
    if (canonId === 'distribuidoras-alimentos-bebidas') {
      var discDist = fieldFromRegistry('disclaimerReguladoGastronomia', true, canonId);
      if (discDist && fields.every(function (x) { return x.id !== discDist.id; })) fields.push(discDist);
    }
    return {
      id: 'gastronomiaDelta_' + canonId,
      title: meta.blockTitle,
      hint: delta.blockHint || meta.blockTitle,
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
    var obligatorios = negocio
      ? ['nombreComercial', 'precioPromedioMx']
      : ['alias', 'unidadCotizacion', 'precioDesdeMx'];
    (SUB_DELTAS[canonId].obligatoriosDelta || []).forEach(function (fid) {
      if (fid === 'geo') return;
      if (obligatorios.indexOf(fid) < 0) obligatorios.push(fid);
    });
    var packFlags = {};
    if (REGULATED_CANON.indexOf(canonId) >= 0) {
      packFlags.regulada = true;
      packFlags.requiresAdminReview = true;
    }
    if (canonId === 'dark-kitchen') {
      packFlags.privacidadDireccion = true;
    }
    return {
      id: 'gastronomia_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'restaurantes',
      nestedProfileKey: NESTED_PROFILE_KEY,
      formularioId: negocio ? 'negocio_empresa' : 'persona_independiente',
      uiIds: negocio ? [UI_NEG_GASTRONOMIA] : [UI_IND_GASTRONOMIA],
      fotosMin: negocio ? 3 : 2,
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

  function isNegocioCtx(ctx, canonId) {
    ctx = ctx || {};
    if (ctx.formularioId) return String(ctx.formularioId) === 'negocio_empresa';
    var meta = CANON_META[canonId];
    return meta && String(meta.formularioId) === 'negocio_empresa';
  }

  function validateAlcoholMenores(values) {
    var errors = [];
    if (!isTruthy(values.ventaAlcohol)) return errors;
    if (!isTruthy(values.permisoVentaAlcohol)) {
      errors.push('Declara permiso de alcohol o desactiva venta de alcohol.');
    }
    if (!String(values.politicaMenoresAlcohol || '').trim()) {
      errors.push('Indica política de menores en área de alcohol.');
    }
    return errors;
  }

  function validatePackBAR(values, canonId) {
    var errors = [];
    if (!isTruthy(values.ventaAlcohol)) return errors;
    errors = errors.concat(validateAlcoholMenores(values));
    if (!isTruthy(values.disclaimerReguladoGastronomia)) {
      errors.push('Debes aceptar avisos legales (alcohol/bar).');
    }
    return errors;
  }

  function validatePackDELIVERY(values, canonId) {
    var errors = [];
    if (canonId !== 'dark-kitchen') return errors;
    var modelo = String(values.modeloOperacion || '');
    if (modelo !== 'dark_kitchen' && modelo !== 'cloud_kitchen') return errors;
    if (!String(values.direccionOperacionPrivada || '').trim()) {
      errors.push('Dirección de operación privada obligatoria para dark/cloud kitchen.');
    }
    if (!isTruthy(values.mostrarSoloZonaPublica)) {
      errors.push('Confirma mostrar solo zona pública (sin calle exacta).');
    }
    return errors;
  }

  function validatePackFOOD(values, ctx, canonId, pack) {
    var errors = [];
    if (!isNegocioCtx(ctx, canonId)) return errors;
    if (FOOD_NEGOCIO_PACKS.indexOf(pack) < 0) return errors;
    if (!isTruthy(values.permisoManipulacionAlimentos)) {
      errors.push('Permiso de manipulación de alimentos obligatorio.');
    }
    return errors;
  }

  function validateCondicionales(values, canonId) {
    var errors = [];
    if (canonId === 'distribuidoras-alimentos-bebidas') {
      if (checklistIncludes(values, 'categoriasProducto', 'bebidas') && !isTruthy(values.permisoVentaAlcohol)) {
        errors.push('Permiso de venta de alcohol obligatorio si distribuyes bebidas.');
      }
    }
    if (canonId === 'bartender-servicio') {
      if (isTruthy(values.servicioAlcoholCliente) && !isTruthy(values.permisoVentaAlcohol)) {
        errors.push('Permiso de alcohol recomendado si el cliente provee alcohol.');
      }
    }
    return errors;
  }

  function isSafeMenuUrl(raw) {
    var s = String(raw || '').trim();
    if (!s) return true;
    var lower = s.toLowerCase();
    if (/^javascript:/.test(lower) || /^data:/.test(lower) || /^vbscript:/.test(lower)) return false;
    if (/^https:\/\//i.test(s)) return true;
    if (/^\/[a-z0-9/_\-.]*$/i.test(s)) return true;
    return false;
  }

  function validateSecureUrls(values) {
    var errors = [];
    if (values.menuUrl && !isSafeMenuUrl(values.menuUrl)) {
      errors.push('URL de menú no permitida — usa https:// o ruta interna.');
    }
    return errors;
  }

  function validateGastronomiaSectorValues(values, ctx) {
    values = values || {};
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || values.subcategoriaId || '');
    if (!canonId) return ['Subcategoría de gastronomía no reconocida.'];
    var pack = resolvePack(canonId);
    var errors = [];
    errors = errors.concat(validateCondicionales(values, canonId));
    errors = errors.concat(validateSecureUrls(values));
    if (BAR_CANON.indexOf(canonId) >= 0) {
      errors = errors.concat(validatePackBAR(values, canonId));
    } else if (isTruthy(values.ventaAlcohol)) {
      errors = errors.concat(validateAlcoholMenores(values));
    }
    if (pack === 'DELIVERY') {
      errors = errors.concat(validatePackDELIVERY(values, canonId));
    }
    errors = errors.concat(validatePackFOOD(values, ctx, canonId, pack));
    if (canonId === 'distribuidoras-alimentos-bebidas' && !isTruthy(values.disclaimerReguladoGastronomia)) {
      errors.push('Debes aceptar avisos legales (distribución regulada).');
    }
    return errors;
  }

  function applyGastronomiaFlags(values, canonId) {
    values = values || {};
    if (REGULATED_CANON.indexOf(canonId) >= 0) {
      values.regulada = true;
      values.requiresAdminReview = true;
    }
    if (canonId === 'dark-kitchen') {
      values.privacidadDireccion = true;
      if (String(values.modeloOperacion || '') === 'dark_kitchen' || String(values.modeloOperacion || '') === 'cloud_kitchen') {
        values.requiresAdminReview = true;
      }
    }
    if (BAR_CANON.indexOf(canonId) >= 0 || canonId === 'distribuidoras-alimentos-bebidas') {
      values.declarativaAlcohol = true;
    }
    if (isTruthy(values.ventaAlcohol) && !isTruthy(values.permisoVentaAlcohol)) {
      values.requiresAdminReview = true;
    }
    if (String(values.politicaMenoresAlcohol || '') === 'prohibido_menores') {
      values.cumpleMenores = true;
    }
    if (BAR_CANON.indexOf(canonId) >= 0 && isTruthy(values.ventaAlcohol) && isTruthy(values.disclaimerReguladoGastronomia)) {
      values.disclaimerAceptado = true;
    }
    return values;
  }

  function copyFieldValue(values, key) {
    var val = values[key];
    if (Array.isArray(val)) return val.slice();
    if (val === true || val === false) return val;
    return val != null ? val : '';
  }

  function buildGastronomiaPerfil(values, canonId, pack) {
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
      precioDesdeMx: values.precioDesdeMx != null ? values.precioDesdeMx : '',
      precioPromedioMx: values.precioPromedioMx != null ? values.precioPromedioMx : '',
      regulada: values.regulada === true,
      requiresAdminReview: values.requiresAdminReview === true,
      privacidadDireccion: values.privacidadDireccion === true,
      declarativaAlcohol: values.declarativaAlcohol === true,
      cumpleMenores: values.cumpleMenores === true,
      disclaimerAceptado: values.disclaimerAceptado === true,
    };
    (delta && delta.deltaFields ? delta.deltaFields : []).forEach(function (fid) {
      perfil[fid] = copyFieldValue(values, fid);
    });
    if (values.disclaimerReguladoGastronomia != null) {
      perfil.disclaimerReguladoGastronomia = values.disclaimerReguladoGastronomia === true;
    }
    return perfil;
  }

  function sanitizeGastronomiaPerfilForPublic(perfil) {
    var out = Object.assign({}, perfil || {});
    GASTRONOMIA_PRIVATE_FIELD_IDS.forEach(function (k) {
      delete out[k];
    });
    return out;
  }

  global.CARIHUB_REGISTRO_GASTRONOMIA_SECTOR_BLOCKS = {
    id: 'gastronomia_sector_packs',
    sectorId: 'restaurantes',
    nestedProfileKey: NESTED_PROFILE_KEY,
    legacyToCanon: LEGACY_TO_CANON,
    canonSubcategorias: CANON_IDS.slice(),
    subToPack: SUB_TO_PACK,
    resolveCanonSubId: resolveCanonSubId,
    resolvePack: resolvePack,
    buildConfig: buildConfig,
    buildGastronomiaPerfil: buildGastronomiaPerfil,
    sanitizeGastronomiaPerfilForPublic: sanitizeGastronomiaPerfilForPublic,
    validateGastronomiaSectorValues: validateGastronomiaSectorValues,
    applyGastronomiaFlags: applyGastronomiaFlags,
    isSafeMenuUrl: isSafeMenuUrl,
    genericForbiddenIds: GENERIC_FORBIDDEN_IDS.slice(),
    privateFieldIds: GASTRONOMIA_PRIVATE_FIELD_IDS.slice(),
  };
})(typeof window !== 'undefined' ? window : globalThis);
