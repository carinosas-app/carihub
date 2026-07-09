/**
 * Render Preview + Ficha — sector Gastronomía (MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 Fase 3).
 * Fuente: scripts/gastronomia-packs-v1.mjs — regenerar con build-carihub-gastronomia-sector-render.mjs
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
  "comida-a-domicilio": "comida-a-domicilio",
  "restaurantes-tradicional": "restaurantes-tradicional",
  "marisquerias": "marisquerias",
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
  "bares": "bares",
  "cervecerias": "cervecerias",
  "cantinas-y-vinotecas": "cantinas-vinotecas",
  "buffet-y-comedor": "buffet-comedor",
  "chef-y-cocinero-a-domicilio": "chef-cocinero-domicilio",
  "bartender-a-domicilio": "bartender-servicio",
  "distribuidoras-alimentos-y-bebidas": "distribuidoras-alimentos-bebidas"
};

  var PREVIEW_FICHA = {
  "restaurantes-tradicional": {
    "chips": [
      "especialidadCasa",
      "chefVisible",
      "maridajeVinos"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoCocinaPrincipal",
      "capacidadComensales",
      "servicioMesa",
      "aceptaReservaciones",
      "terrazaPatio",
      "estacionamientoClientes",
      "menuDelDia",
      "precioPromedioMx",
      "colaboracionesComerciales"
    ],
    "faq": [
      "brunchDisponible",
      "eventosPrivadosSalon"
    ]
  },
  "marisquerias": {
    "chips": [
      "especialidadMar",
      "pescadoDelDia",
      "barraOstiones"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoCocinaPrincipal",
      "capacidadComensales",
      "servicioMesa",
      "aceptaReservaciones",
      "terrazaPatio",
      "estacionamientoClientes",
      "menuDelDia",
      "precioPromedioMx",
      "colaboracionesComerciales"
    ],
    "faq": [
      "platosEstrellaMar",
      "origenPescado"
    ]
  },
  "cocina-economica": {
    "chips": [
      "menuCorrida",
      "precioMenuCorridaMx",
      "incluyeBebidaMenu"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoCocinaPrincipal",
      "capacidadComensales",
      "servicioMesa",
      "aceptaReservaciones",
      "terrazaPatio",
      "estacionamientoClientes",
      "menuDelDia",
      "precioPromedioMx",
      "colaboracionesComerciales"
    ],
    "faq": [
      "platosRotativos",
      "comedorIndustrial"
    ]
  },
  "taquerias": {
    "chips": [
      "tipoTortilla",
      "especialidadTaco",
      "salsasCasa"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoServicioRapido",
      "pedidoMostrador",
      "pedidoParaLlevar",
      "deliveryPropio",
      "tiempoPreparacionMin",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "colaboracionesComerciales"
    ],
    "faq": [
      "hornoTortillas",
      "tacosEstrella"
    ]
  },
  "hamburgueserias": {
    "chips": [
      "tipoCarne",
      "panArtesanal",
      "papasCasa"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoServicioRapido",
      "pedidoMostrador",
      "pedidoParaLlevar",
      "deliveryPropio",
      "tiempoPreparacionMin",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "colaboracionesComerciales"
    ],
    "faq": [
      "burgersEstrella",
      "opcionesPlantBased"
    ]
  },
  "pizzerias": {
    "chips": [
      "tipoHorno",
      "masaFermentacion",
      "tamanosPizza"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoServicioRapido",
      "pedidoMostrador",
      "pedidoParaLlevar",
      "deliveryPropio",
      "tiempoPreparacionMin",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "colaboracionesComerciales"
    ],
    "faq": [
      "pizzasEstrella",
      "entregaCaliente"
    ]
  },
  "polleryas-alitas": {
    "chips": [
      "cortePollo",
      "salsasAlitas",
      "combosFamiliares"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoServicioRapido",
      "pedidoMostrador",
      "pedidoParaLlevar",
      "deliveryPropio",
      "tiempoPreparacionMin",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "colaboracionesComerciales"
    ],
    "faq": [
      "rostizadoHorario",
      "platosPolloEstrella"
    ]
  },
  "sushi-cocina-asiatica": {
    "chips": [
      "estiloAsiatico",
      "barraSushi",
      "opcionesCrudo"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoServicioRapido",
      "pedidoMostrador",
      "pedidoParaLlevar",
      "deliveryPropio",
      "tiempoPreparacionMin",
      "precioPromedioMx",
      "horarioCocina",
      "permisoManipulacionAlimentos",
      "colaboracionesComerciales"
    ],
    "faq": [
      "platosAsiaticosEstrella",
      "teMatcha"
    ]
  },
  "carnes-asadas-parrilla": {
    "chips": [
      "tipoParrilla",
      "cortesEspecialidad",
      "marinadosCasa"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoCocinaPrincipal",
      "capacidadComensales",
      "servicioMesa",
      "aceptaReservaciones",
      "terrazaPatio",
      "estacionamientoClientes",
      "menuDelDia",
      "precioPromedioMx",
      "colaboracionesComerciales"
    ],
    "faq": [
      "servicioAsadorMesa",
      "guarnicionesParrilla"
    ]
  },
  "cafeterias": {
    "chips": [
      "metodosPreparacion",
      "pastelesLigeros",
      "desayunos"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "bebidasPrincipal",
      "granoOrigen",
      "opcionesLacteos",
      "opcionesSinAzucar",
      "horarioBarista",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "wifiClientes",
      "colaboracionesComerciales"
    ],
    "faq": [
      "latteArt",
      "origenGranoDetalle"
    ]
  },
  "panaderias": {
    "chips": [
      "tiposPan",
      "hornoTipo",
      "panDelDia"
    ],
    "stats": [
      "precioPromedioMx"
    ],
    "rows": [
      "productosHorneados",
      "pedidosPersonalizados",
      "entregaADomicilio",
      "horarioHorneado",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "opcionesSinGluten",
      "opcionesVeganas",
      "colaboracionesComerciales"
    ],
    "faq": [
      "pedidosPorKilo",
      "productosSinGlutenPan"
    ]
  },
  "pastelerias-reposteria": {
    "chips": [
      "pastelesPersonalizados",
      "reposteriaFina",
      "tematicasPasteles"
    ],
    "stats": [
      "precioPromedioMx"
    ],
    "rows": [
      "productosHorneados",
      "pedidosPersonalizados",
      "entregaADomicilio",
      "horarioHorneado",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "opcionesSinGluten",
      "opcionesVeganas",
      "colaboracionesComerciales"
    ],
    "faq": [
      "degustacionDisponible",
      "entregaEventosPequenos"
    ]
  },
  "neverias-heladerias": {
    "chips": [
      "baseHelado",
      "saboresEstacion",
      "paletasArtesanales"
    ],
    "stats": [
      "precioPromedioMx"
    ],
    "rows": [
      "productosHorneados",
      "pedidosPersonalizados",
      "entregaADomicilio",
      "horarioHorneado",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "opcionesSinGluten",
      "opcionesVeganas",
      "colaboracionesComerciales"
    ],
    "faq": [
      "opcionesVeganasHelado",
      "eventosCarritoHelado"
    ]
  },
  "juguerias": {
    "chips": [
      "frutasEstacion",
      "boostProteina",
      "jugosDetox"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "bebidasPrincipal",
      "granoOrigen",
      "opcionesLacteos",
      "opcionesSinAzucar",
      "horarioBarista",
      "precioPromedioMx",
      "permisoManipulacionAlimentos",
      "wifiClientes",
      "colaboracionesComerciales"
    ],
    "faq": [
      "combinacionesEstrella",
      "sinAzucarAnadida"
    ]
  },
  "food-trucks-gastronomia": {
    "chips": [
      "especialidadTruck",
      "puntosFijosSemana",
      "publicaUbicacionDiaria"
    ],
    "stats": [
      "precioPromedioMx"
    ],
    "rows": [
      "tipoUnidadMovil",
      "ubicacionHabitual",
      "horarioRuta",
      "diasOperacion",
      "aceptaEventosPrivados",
      "radioServicioKm",
      "permisoManipulacionAlimentos",
      "requiereAguaLuz",
      "colaboracionesComerciales"
    ],
    "faq": [
      "eventosPrivadosTruck",
      "redesUbicacion"
    ]
  },
  "comida-a-domicilio": {
    "chips": [
      "tipoComidaDomicilio",
      "menuSemanal",
      "diasEntrega"
    ],
    "stats": [
      "precioPromedioMx",
      "tiempoEntregaMin"
    ],
    "rows": [
      "modeloOperacion",
      "zonasEntrega",
      "costoEnvioDesde",
      "pedidoMinimoMx",
      "tiempoEntregaMin",
      "horarioEntregas",
      "permisoManipulacionAlimentos",
      "direccionOperacionPrivada",
      "colaboracionesComerciales"
    ],
    "faq": [
      "embalajeTermico",
      "pedidoRecurrente"
    ]
  },
  "dark-kitchen": {
    "chips": [
      "marcasVirtuales",
      "appsDelivery",
      "cocinaCompartida"
    ],
    "stats": [
      "precioPromedioMx",
      "tiempoEntregaMin"
    ],
    "rows": [
      "modeloOperacion",
      "zonasEntrega",
      "costoEnvioDesde",
      "pedidoMinimoMx",
      "tiempoEntregaMin",
      "horarioEntregas",
      "permisoManipulacionAlimentos",
      "direccionOperacionPrivada",
      "colaboracionesComerciales"
    ],
    "faq": [
      "direccionOperacionPrivada",
      "mostrarSoloZonaPublica"
    ]
  },
  "bares": {
    "chips": [
      "cartelesCocteles",
      "botanasDestacadas",
      "barraMixologia"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoBebidasPrincipal",
      "ventaAlcohol",
      "permisoVentaAlcohol",
      "horarioBarra",
      "capacidadComensales",
      "comidaEnMenu",
      "musicaAmbiente",
      "politicaMenoresAlcohol",
      "colaboracionesComerciales"
    ],
    "faq": [
      "ambienteBar",
      "restauranteBarGastronomico"
    ]
  },
  "cervecerias": {
    "chips": [
      "estilosCerveza",
      "produccionPropia",
      "maridajeCerveza"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoBebidasPrincipal",
      "ventaAlcohol",
      "permisoVentaAlcohol",
      "horarioBarra",
      "capacidadComensales",
      "comidaEnMenu",
      "musicaAmbiente",
      "politicaMenoresAlcohol",
      "colaboracionesComerciales"
    ],
    "faq": [
      "tapListRotativa",
      "visitaCerveceria"
    ]
  },
  "cantinas-vinotecas": {
    "chips": [
      "botellasDestacadas",
      "cavaVinos",
      "botanasCantina"
    ],
    "stats": [
      "precioPromedioMx",
      "capacidadComensales"
    ],
    "rows": [
      "tipoBebidasPrincipal",
      "ventaAlcohol",
      "permisoVentaAlcohol",
      "horarioBarra",
      "capacidadComensales",
      "comidaEnMenu",
      "musicaAmbiente",
      "politicaMenoresAlcohol",
      "colaboracionesComerciales"
    ],
    "faq": [
      "maridajeVinos",
      "ventaBotella"
    ]
  },
  "buffet-comedor": {
    "chips": [
      "rotacionPlatos",
      "estacionesBuffet",
      "comedorEmpresarial"
    ],
    "stats": [
      "capacidadComensales"
    ],
    "rows": [
      "tipoBuffet",
      "precioPorPersonaMx",
      "capacidadComensales",
      "horarioServicio",
      "incluyeBebidas",
      "postresIncluidos",
      "opcionesVegetarianas",
      "permisoManipulacionAlimentos",
      "colaboracionesComerciales"
    ],
    "faq": [
      "controlPorciones",
      "platosCalientesFrios"
    ]
  },
  "chef-cocinero-domicilio": {
    "chips": [
      "tipoExperienciaChef",
      "menuPersonalizado",
      "cenasPrivadas"
    ],
    "stats": [
      "precioDesdeMx"
    ],
    "rows": [
      "tipoServicioProfesional",
      "especialidadCocina",
      "personasAtiendeMax",
      "incluyeCompras",
      "incluyeLimpieza",
      "radioServicioKm",
      "precioDesdeMx",
      "anticipoRequerido",
      "colaboracionesComerciales"
    ],
    "faq": [
      "clasesCocina",
      "utensiliosIncluidos"
    ]
  },
  "bartender-servicio": {
    "chips": [
      "tipoEventoBar",
      "coctelesSignature",
      "barraMovilIncluida"
    ],
    "stats": [
      "precioDesdeMx"
    ],
    "rows": [
      "tipoServicioProfesional",
      "especialidadCocina",
      "personasAtiendeMax",
      "incluyeCompras",
      "incluyeLimpieza",
      "radioServicioKm",
      "precioDesdeMx",
      "anticipoRequerido",
      "colaboracionesComerciales"
    ],
    "faq": [
      "hieloInsumos",
      "servicioAlcoholCliente"
    ]
  },
  "distribuidoras-alimentos-bebidas": {
    "chips": [
      "catalogoMayoreo",
      "entregaRefrigerada",
      "creditoComercial"
    ],
    "stats": [],
    "rows": [
      "categoriasProducto",
      "coberturaEntrega",
      "pedidoMinimoMayoreo",
      "horarioReparto",
      "cadenaFrio",
      "permisoManipulacionAlimentos",
      "permisoVentaAlcohol",
      "facturacionDisponible",
      "colaboracionesComerciales"
    ],
    "faq": [
      "rotacionInventario",
      "zonasCoberturaDetalle"
    ]
  }
};

  var FIELD_LABELS = {
  "tipoCocinaPrincipal": "Tipo de cocina principal",
  "capacidadComensales": "Capacidad de comensales",
  "servicioMesa": "Servicio en mesa",
  "aceptaReservaciones": "Acepta reservaciones",
  "terrazaPatio": "Terraza o patio",
  "estacionamientoClientes": "Estacionamiento para clientes",
  "menuDelDia": "Menú del día",
  "precioPromedioMx": "Precio promedio por persona (MXN)",
  "horarioCocina": "Horario de cocina",
  "permisoManipulacionAlimentos": "Permiso de manipulación de alimentos vigente",
  "ventaAlcohol": "Vende bebidas alcohólicas",
  "politicaMenoresAlcohol": "Política menores en área de alcohol",
  "opcionesDieteticas": "Opciones dietéticas",
  "tipoServicioRapido": "Tipo de servicio rápido",
  "pedidoMostrador": "Pedido en mostrador",
  "pedidoParaLlevar": "Para llevar",
  "deliveryPropio": "Delivery propio",
  "tiempoPreparacionMin": "Tiempo promedio de preparación (min)",
  "combosPromociones": "Combos o promociones frecuentes",
  "aceptaPedidosApp": "Pedidos por app (Uber/Didi/Rappi)",
  "productosHorneados": "Productos horneados",
  "pedidosPersonalizados": "Pedidos personalizados",
  "entregaADomicilio": "Entrega a domicilio",
  "horarioHorneado": "Horario de horneado",
  "opcionesSinGluten": "Opciones sin gluten",
  "opcionesVeganas": "Opciones veganas",
  "capacidadProduccionDiaria": "Capacidad producción diaria (piezas aprox.)",
  "mostradorFisico": "Mostrador físico",
  "pedidoAnticipadoHoras": "Anticipación mínima pedido (horas)",
  "embalajeEspecial": "Embalaje especial / térmico",
  "bebidasPrincipal": "Bebidas principales",
  "granoOrigen": "Origen del grano / proveedor",
  "opcionesLacteos": "Opciones de leche",
  "opcionesSinAzucar": "Bebidas sin azúcar añadida",
  "horarioBarista": "Horario barista / servicio",
  "wifiClientes": "WiFi para clientes",
  "espacioTrabajo": "Espacio apto para trabajar",
  "comidaLigera": "Comida ligera disponible",
  "tipoUnidadMovil": "Tipo de unidad móvil",
  "ubicacionHabitual": "Ubicación o ruta habitual",
  "horarioRuta": "Horario de ruta",
  "diasOperacion": "Días de operación",
  "aceptaEventosPrivados": "Acepta eventos privados (campo especialidad)",
  "radioServicioKm": "Radio de servicio (km)",
  "requiereAguaLuz": "Requiere agua/luz en punto de venta",
  "pedidoAnticipado": "Pedido con anticipación",
  "capacidadProduccionHora": "Capacidad aprox. por hora (órdenes)",
  "formasPago": "Formas de pago",
  "modeloOperacion": "Modelo de operación",
  "zonasEntrega": "Zonas de entrega",
  "costoEnvioDesde": "Costo envío desde (MXN)",
  "pedidoMinimoMx": "Pedido mínimo (MXN)",
  "tiempoEntregaMin": "Tiempo entrega estimado (min)",
  "horarioEntregas": "Horario de entregas",
  "direccionOperacionPrivada": "Dirección operación (privada)",
  "mostrarSoloZonaPublica": "Publicar solo zona/colonia (sin calle)",
  "tipoBebidasPrincipal": "Bebidas principales",
  "permisoVentaAlcohol": "Permiso venta de alcohol vigente",
  "horarioBarra": "Horario de barra",
  "comidaEnMenu": "Comida en menú",
  "musicaAmbiente": "Música en vivo o DJ",
  "happyHour": "Happy hour",
  "tipoBuffet": "Tipo de buffet",
  "precioPorPersonaMx": "Precio por persona (MXN)",
  "horarioServicio": "Horario de servicio",
  "incluyeBebidas": "Bebidas incluidas",
  "postresIncluidos": "Postres incluidos",
  "opcionesVegetarianas": "Opciones vegetarianas",
  "reservacionesGrupos": "Reservaciones para grupos",
  "tipoServicioProfesional": "Tipo de servicio profesional",
  "especialidadCocina": "Especialidad de cocina",
  "personasAtiendeMax": "Personas que atiendes (máx.)",
  "incluyeCompras": "Incluye compra de insumos",
  "incluyeLimpieza": "Incluye limpieza posterior",
  "precioDesdeMx": "Precio desde (MXN)",
  "anticipoRequerido": "Anticipo requerido (%)",
  "equipoPropio": "Traes equipo propio",
  "menuDegustacion": "Menú degustación disponible",
  "certificacionesProfesional": "Certificaciones profesionales",
  "categoriasProducto": "Categorías de producto",
  "coberturaEntrega": "Cobertura de entrega",
  "pedidoMinimoMayoreo": "Pedido mínimo mayoreo (MXN)",
  "horarioReparto": "Horario de reparto",
  "cadenaFrio": "Cadena de frío",
  "facturacionDisponible": "Facturación disponible",
  "marcasRepresentadas": "Marcas representadas",
  "tiempoEntregaDias": "Tiempo entrega mayoreo (días)",
  "capacidadAlmacen": "Capacidad almacén (m² aprox.)",
  "clientesTipo": "Tipo de clientes B2B",
  "horarioAtencionComercial": "Horario de atención",
  "especialidadCasa": "Platillo estrella de la casa",
  "chefVisible": "Chef visible en cocina abierta",
  "maridajeVinos": "Maridaje o carta de vinos",
  "brunchDisponible": "Brunch fines de semana",
  "eventosPrivadosSalon": "Eventos privados en salón",
  "especialidadMar": "Especialidad del mar",
  "pescadoDelDia": "Pescado del día",
  "barraOstiones": "Barra de ostiones",
  "platosEstrellaMar": "Platos estrella",
  "origenPescado": "Origen del pescado",
  "menuCorrida": "Menú corrido / comida económica",
  "precioMenuCorridaMx": "Precio menú corrido (MXN)",
  "incluyeBebidaMenu": "Incluye bebida en menú",
  "platosRotativos": "Platos rotativos por día",
  "comedorIndustrial": "Comedor industrial / empresas",
  "tipoTortilla": "Tipo de tortilla",
  "especialidadTaco": "Especialidad de tacos",
  "salsasCasa": "Salsas de la casa",
  "hornoTortillas": "Tortillas hechas al momento",
  "tacosEstrella": "Tacos estrella",
  "tipoCarne": "Tipo de carne principal",
  "panArtesanal": "Pan artesanal propio",
  "papasCasa": "Papas / acompañamientos casa",
  "burgersEstrella": "Hamburguesas estrella",
  "opcionesPlantBased": "Opciones plant-based",
  "tipoHorno": "Tipo de horno",
  "masaFermentacion": "Masa con fermentación lenta",
  "tamanosPizza": "Tamaños disponibles",
  "pizzasEstrella": "Pizzas estrella",
  "entregaCaliente": "Garantía entrega caliente",
  "cortePollo": "Cortes / preparaciones de pollo",
  "salsasAlitas": "Salsas para alitas",
  "combosFamiliares": "Combos familiares",
  "rostizadoHorario": "Horario salida del horno",
  "platosPolloEstrella": "Platos estrella de pollo",
  "estiloAsiatico": "Estilo asiático",
  "barraSushi": "Barra de sushi",
  "opcionesCrudo": "Platos con pescado crudo",
  "platosAsiaticosEstrella": "Platos estrella",
  "teMatcha": "Té matcha / postres asiáticos",
  "tipoParrilla": "Tipo de parrilla",
  "cortesEspecialidad": "Cortes especialidad",
  "marinadosCasa": "Marinados de la casa",
  "servicioAsadorMesa": "Asador en mesa",
  "guarnicionesParrilla": "Guarniciones incluidas",
  "metodosPreparacion": "Métodos de preparación",
  "pastelesLigeros": "Pasteles ligeros / repostería",
  "desayunos": "Desayunos",
  "latteArt": "Latte art",
  "origenGranoDetalle": "Detalle origen del grano",
  "tiposPan": "Tipos de pan",
  "hornoTipo": "Tipo de horno",
  "panDelDia": "Pan saliendo del horno (horario)",
  "pedidosPorKilo": "Pedidos por kilo",
  "productosSinGlutenPan": "Pan sin gluten",
  "pastelesPersonalizados": "Pasteles personalizados",
  "reposteriaFina": "Repostería fina",
  "tematicasPasteles": "Temáticas frecuentes",
  "degustacionDisponible": "Degustación previa",
  "entregaEventosPequenos": "Entrega eventos pequeños (no sector Eventos)",
  "baseHelado": "Base del helado",
  "saboresEstacion": "Sabores de temporada",
  "paletasArtesanales": "Paletas artesanales",
  "opcionesVeganasHelado": "Opciones veganas",
  "eventosCarritoHelado": "Carrito para fiestas (campo especialidad)",
  "frutasEstacion": "Frutas de temporada",
  "boostProteina": "Boost proteína disponible",
  "jugosDetox": "Jugos detox / verdes",
  "combinacionesEstrella": "Combinaciones estrella",
  "sinAzucarAnadida": "Opciones sin azúcar añadida",
  "especialidadTruck": "Especialidad del food truck",
  "puntosFijosSemana": "Puntos fijos de la semana",
  "publicaUbicacionDiaria": "Publicar ubicación diaria",
  "eventosPrivadosTruck": "Contratación fiestas privadas",
  "redesUbicacion": "Redes donde anuncias ubicación",
  "tipoComidaDomicilio": "Tipo de comida a domicilio",
  "menuSemanal": "Menú semanal rotativo",
  "diasEntrega": "Días de entrega",
  "embalajeTermico": "Embalaje térmico",
  "pedidoRecurrente": "Suscripción / pedido recurrente",
  "marcasVirtuales": "Marcas virtuales operadas",
  "appsDelivery": "Apps de delivery",
  "cocinaCompartida": "Cocina compartida / ghost",
  "cartelesCocteles": "Cocteles de autor",
  "botanasDestacadas": "Botanas destacadas",
  "barraMixologia": "Barra de mixología",
  "ambienteBar": "Ambiente del bar",
  "restauranteBarGastronomico": "Restaurante-bar gastronómico (no antro)",
  "estilosCerveza": "Estilos de cerveza",
  "produccionPropia": "Producción propia en sitio",
  "maridajeCerveza": "Maridaje con comida",
  "tapListRotativa": "Tap list rotativa",
  "visitaCerveceria": "Tour / visita cervecería",
  "botellasDestacadas": "Botellas destacadas",
  "cavaVinos": "Cava o selección de vinos",
  "botanasCantina": "Botanas de cantina",
  "ventaBotella": "Venta por botella",
  "rotacionPlatos": "Rotación de platos",
  "estacionesBuffet": "Estaciones del buffet",
  "comedorEmpresarial": "Comedor empresarial",
  "controlPorciones": "Control de porciones incluido",
  "platosCalientesFrios": "Estaciones calientes y frías",
  "tipoExperienciaChef": "Tipo de experiencia",
  "menuPersonalizado": "Menú 100% personalizado",
  "cenasPrivadas": "Cenas privadas",
  "clasesCocina": "Clases de cocina",
  "utensiliosIncluidos": "Utensilios incluidos",
  "tipoEventoBar": "Tipo de evento",
  "coctelesSignature": "Cocteles signature",
  "barraMovilIncluida": "Barra móvil incluida",
  "hieloInsumos": "Hielo e insumos incluidos",
  "servicioAlcoholCliente": "Alcohol provisto por cliente",
  "catalogoMayoreo": "Catálogo mayoreo (resumen)",
  "entregaRefrigerada": "Entrega refrigerada",
  "creditoComercial": "Crédito comercial",
  "rotacionInventario": "Rotación de inventario alta",
  "zonasCoberturaDetalle": "Detalle zonas cobertura",
  "disclaimerReguladoGastronomia": "Declaro información veraz sobre permisos y alcohol",
  "menuTextoSanitizado": "Extracto menú (texto plano)",
  "servicioSommelier": "Servicio de sommelier",
  "platillosTemporada": "Platillos de temporada",
  "cocinaAbiertaVisible": "Cocina abierta visible",
  "reservacionesOnline": "Reservaciones en línea",
  "areasPetFriendly": "Pet friendly",
  "menuInfantil": "Menú infantil",
  "pagoSinContacto": "Pago sin contacto / terminal",
  "estacionamientoValet": "Valet parking",
  "horarioDesayuno": "Horario desayuno",
  "coctelesMar": "Cocteles de mar",
  "cevicheBar": "Barra de ceviches",
  "horarioPescadoFresco": "Horario pescado fresco",
  "platosSinCascara": "Platos pelados / sin cáscara",
  "servicioPelado": "Servicio de pelado en mesa",
  "promocionMariscos": "Promoción mariscos",
  "estacionamientoMotos": "Estacionamiento motos",
  "horarioComidaCorrida": "Horario comida corrida",
  "diasMenuSemana": "Menú por día de semana",
  "porcionesGenerosas": "Porciones generosas",
  "paraLlevarEconomico": "Para llevar económico",
  "combosFamiliaresEconomicos": "Combos familiares",
  "servicioRapidoMediodia": "Servicio rápido mediodía",
  "guisadosDelDia": "Guisados del día",
  "ordenTacosMinimo": "Orden mínima (tacos)",
  "salsaBar": "Barra de salsas",
  "horarioMadrugada": "Horario madrugada",
  "paraEventosPequenos": "Pedidos eventos pequeños (campo)",
  "promocionMartes": "Promoción día específico",
  "papasTipos": "Tipos de papas",
  "malteadasCasa": "Malteadas de la casa",
  "salsasSignature": "Salsas signature",
  "comboEjecutivo": "Combo ejecutivo",
  "horarioNocturno": "Horario nocturno",
  "paraLlevarRapido": "Para llevar en minutos",
  "pizzaMitades": "Mitades y combinadas",
  "ingredientesPremium": "Ingredientes premium",
  "salsaTomateCasa": "Salsa de tomate casera",
  "paraLlevarCaja": "Caja para llevar incluida",
  "nivelPicante": "Niveles de picante",
  "papasIncluidas": "Papas incluidas en combo",
  "salsasExtra": "Salsas extra disponibles",
  "promocionAlitas": "Promoción alitas",
  "horarioPartido": "Horario partidos / eventos deportivos",
  "omakaseDisponible": "Omakase / chef's choice",
  "wasabiReal": "Wasabi real (no polvo)",
  "sakeSeleccion": "Selección de sake",
  "rollsTemporada": "Rolls de temporada",
  "paraLlevarSushi": "Para llevar con empaque sushi",
  "horarioCena": "Horario cena",
  "cortesImportados": "Cortes importados",
  "salsasParrilla": "Salsas de parrilla",
  "hornoPan": "Pan de la casa en parrilla",
  "promocionFinSemana": "Promoción fin de semana",
  "musicaEnVivo": "Música en vivo",
  "estacionamientoAmplio": "Estacionamiento amplio",
  "pastelesDelDia": "Pasteles del día",
  "sandwichesLigeros": "Sandwiches ligeros",
  "promocionDesayuno": "Promoción desayuno",
  "reservacionesGruposPequenos": "Reservaciones grupos pequeños",
  "recetasTradicionales": "Recetas tradicionales",
  "panSinConservadores": "Sin conservadores artificiales",
  "pedidosCorporativos": "Pedidos corporativos",
  "horarioPrimeraSalida": "Horario primera salida del horno",
  "promocionPanNoche": "Promoción pan de noche",
  "catalogoPasteles": "Catálogo pasteles (resumen)",
  "rellenosDisponibles": "Rellenos disponibles",
  "degustacionSabores": "Degustación de sabores",
  "entregaMunicipio": "Entrega en municipio",
  "horarioRecoleccion": "Horario recolección pedidos",
  "promocionTemporada": "Promoción temporada",
  "toppingsDisponibles": "Toppings disponibles",
  "conosTipos": "Tipos de cono",
  "promocionDoble": "Promoción 2x1 / doble",
  "horarioVerano": "Horario temporada calor",
  "paraLlevarNevera": "Para llevar en nevera/portátil",
  "superfoodsDisponibles": "Superfoods (chia, linaza, etc.)",
  "promocionCombo": "Promoción combo jugo",
  "horarioManana": "Horario matutino",
  "paraLlevarVaso": "Vaso reutilizable / para llevar",
  "instagramUbicacion": "Publicas ubicación en Instagram",
  "promocionDia": "Promoción del día",
  "capacidadCola": "Capacidad cola aprox. (personas)",
  "menuRotativoSemana": "Menú rotativo semanal",
  "aceptaTarjeta": "Acepta tarjeta",
  "estacionamientoCercano": "Estacionamiento cercano",
  "porcionesIndividuales": "Porciones individuales",
  "alergenosDeclarados": "Alérgenos declarados en menú",
  "horarioPedidos": "Horario recepción pedidos",
  "promocionSemanal": "Promoción semanal",
  "pagoTransferencia": "Pago por transferencia",
  "embalajeEcologico": "Embalaje ecológico",
  "marcasOperadasDetalle": "Detalle marcas operadas",
  "tiempoPromedioApp": "Tiempo promedio en apps (min)",
  "ratingApps": "Rating promedio apps",
  "horarioPico": "Horario pico",
  "embalajePremium": "Embalaje premium anti-derrame",
  "cartasVinos": "Carta de vinos",
  "cervezasArtesanales": "Cervezas artesanales",
  "musicaEnVivoBar": "Música en vivo en bar",
  "horarioBarraNoche": "Horario barra noche",
  "promocionHappyHour": "Detalle happy hour",
  "areasExterior": "Área exterior",
  "flightCerveza": "Flights / degustación cerveza",
  "comidaBar": "Comida de bar (snacks)",
  "horarioTaproom": "Horario taproom",
  "promocionGrowler": "Promoción growler / para llevar",
  "tequilaSeleccion": "Selección tequilas",
  "mezcalArtesanal": "Mezcal artesanal",
  "botanasTradicionales": "Botanas tradicionales",
  "horarioCantina": "Horario cantina",
  "promocionBotella": "Promoción botella",
  "platosDelDia": "Platos del día en buffet",
  "controlAlergenos": "Control de alérgenos",
  "horarioComida": "Horario comida",
  "estacionamientoEmpleados": "Estacionamiento empleados/clientes",
  "tiposCocinaChef": "Tipos de cocina que dominas",
  "experienciaRestaurantes": "Experiencia en restaurantes (años)",
  "referenciasClientes": "Referencias verificables",
  "duracionServicioHoras": "Duración típica servicio (horas)",
  "viajeIncluidoKm": "Km incluidos en tarifa",
  "promocionPareja": "Promoción pareja / aniversario",
  "pagoAnticipoPorcentaje": "Anticipo requerido (%)",
  "tiposBarra": "Tipos de barra",
  "experienciaAniosBar": "Años experiencia bartender",
  "referenciasEventos": "Referencias eventos",
  "uniformeIncluido": "Uniforme incluido",
  "promocionPaquete": "Paquetes promocionales",
  "minimoPrimeraCompra": "Mínimo primera compra (MXN)",
  "entregaProgramada": "Entrega programada recurrente",
  "soporteComercial": "Ejecutivo comercial asignado",
  "devolucionesPolitica": "Política devoluciones",
  "catalogoDigital": "Catálogo digital / PDF",
  "certificacionesCalidad": "Certificaciones calidad",
  "pagoCreditoDias": "Crédito (días)",
  "accesibilidadSillaRuedas": "Accesible silla de ruedas",
  "estacionamientoTipo": "Tipo de estacionamiento",
  "buenoParaNinos": "Apto para niños",
  "codigoVestimenta": "Código de vestimenta",
  "menuUrl": "Menú digital (URL)",
  "appsDeliveryRatings": "Rating apps delivery (Uber Eats / Rappi / DiDi Food)",
  "pedidoMinimoDelivery": "Pedido mínimo delivery (MXN)",
  "zonaCoberturaColonias": "Colonias / zonas de cobertura (público)",
  "nivelRuido": "Nivel de ruido",
  "buenoParaGrupos": "Bueno para grupos",
  "certificacionHalalKosher": "Certificación halal / kosher (declarativo)",
  "cienPorCientoSinGluten": "100% sin gluten (declarativo)",
  "cocacolaFria": "cocacolaFria",
  "colaboracionesComerciales": "¿Colaboras con otros negocios, chefs o marcas?",
  "diferenciadorProfesional": "Tu sello / lo que te distingue"
};

  var FIELD_TYPES = {
  "tipoCocinaPrincipal": "checklist",
  "capacidadComensales": "number",
  "servicioMesa": "boolean",
  "aceptaReservaciones": "boolean",
  "terrazaPatio": "boolean",
  "estacionamientoClientes": "boolean",
  "menuDelDia": "boolean",
  "precioPromedioMx": "number",
  "horarioCocina": "text",
  "permisoManipulacionAlimentos": "boolean",
  "ventaAlcohol": "boolean",
  "politicaMenoresAlcohol": "enum",
  "opcionesDieteticas": "checklist",
  "tipoServicioRapido": "enum",
  "pedidoMostrador": "boolean",
  "pedidoParaLlevar": "boolean",
  "deliveryPropio": "boolean",
  "tiempoPreparacionMin": "number",
  "combosPromociones": "text",
  "aceptaPedidosApp": "boolean",
  "productosHorneados": "checklist",
  "pedidosPersonalizados": "boolean",
  "entregaADomicilio": "boolean",
  "horarioHorneado": "text",
  "opcionesSinGluten": "boolean",
  "opcionesVeganas": "boolean",
  "capacidadProduccionDiaria": "number",
  "mostradorFisico": "boolean",
  "pedidoAnticipadoHoras": "number",
  "embalajeEspecial": "boolean",
  "bebidasPrincipal": "checklist",
  "granoOrigen": "text",
  "opcionesLacteos": "checklist",
  "opcionesSinAzucar": "boolean",
  "horarioBarista": "text",
  "wifiClientes": "boolean",
  "espacioTrabajo": "boolean",
  "comidaLigera": "boolean",
  "tipoUnidadMovil": "enum",
  "ubicacionHabitual": "text",
  "horarioRuta": "text",
  "diasOperacion": "checklist",
  "aceptaEventosPrivados": "boolean",
  "radioServicioKm": "number",
  "requiereAguaLuz": "boolean",
  "pedidoAnticipado": "boolean",
  "capacidadProduccionHora": "number",
  "formasPago": "checklist",
  "modeloOperacion": "enum",
  "zonasEntrega": "text",
  "costoEnvioDesde": "number",
  "pedidoMinimoMx": "number",
  "tiempoEntregaMin": "number",
  "horarioEntregas": "text",
  "direccionOperacionPrivada": "text",
  "mostrarSoloZonaPublica": "boolean",
  "tipoBebidasPrincipal": "checklist",
  "permisoVentaAlcohol": "boolean",
  "horarioBarra": "text",
  "comidaEnMenu": "boolean",
  "musicaAmbiente": "enum",
  "happyHour": "text",
  "tipoBuffet": "enum",
  "precioPorPersonaMx": "number",
  "horarioServicio": "text",
  "incluyeBebidas": "boolean",
  "postresIncluidos": "boolean",
  "opcionesVegetarianas": "boolean",
  "reservacionesGrupos": "boolean",
  "tipoServicioProfesional": "enum",
  "especialidadCocina": "text",
  "personasAtiendeMax": "number",
  "incluyeCompras": "boolean",
  "incluyeLimpieza": "boolean",
  "precioDesdeMx": "number",
  "anticipoRequerido": "number",
  "equipoPropio": "boolean",
  "menuDegustacion": "boolean",
  "certificacionesProfesional": "text",
  "categoriasProducto": "checklist",
  "coberturaEntrega": "text",
  "pedidoMinimoMayoreo": "number",
  "horarioReparto": "text",
  "cadenaFrio": "boolean",
  "facturacionDisponible": "boolean",
  "marcasRepresentadas": "text",
  "tiempoEntregaDias": "number",
  "capacidadAlmacen": "number",
  "clientesTipo": "checklist",
  "horarioAtencionComercial": "text",
  "especialidadCasa": "text",
  "chefVisible": "boolean",
  "maridajeVinos": "boolean",
  "brunchDisponible": "boolean",
  "eventosPrivadosSalon": "boolean",
  "especialidadMar": "checklist",
  "pescadoDelDia": "boolean",
  "barraOstiones": "boolean",
  "platosEstrellaMar": "text",
  "origenPescado": "text",
  "menuCorrida": "boolean",
  "precioMenuCorridaMx": "number",
  "incluyeBebidaMenu": "boolean",
  "platosRotativos": "boolean",
  "comedorIndustrial": "boolean",
  "tipoTortilla": "enum",
  "especialidadTaco": "text",
  "salsasCasa": "text",
  "hornoTortillas": "boolean",
  "tacosEstrella": "text",
  "tipoCarne": "checklist",
  "panArtesanal": "boolean",
  "papasCasa": "boolean",
  "burgersEstrella": "text",
  "opcionesPlantBased": "boolean",
  "tipoHorno": "enum",
  "masaFermentacion": "boolean",
  "tamanosPizza": "checklist",
  "pizzasEstrella": "text",
  "entregaCaliente": "boolean",
  "cortePollo": "checklist",
  "salsasAlitas": "text",
  "combosFamiliares": "boolean",
  "rostizadoHorario": "text",
  "platosPolloEstrella": "text",
  "estiloAsiatico": "checklist",
  "barraSushi": "boolean",
  "opcionesCrudo": "boolean",
  "platosAsiaticosEstrella": "text",
  "teMatcha": "boolean",
  "tipoParrilla": "enum",
  "cortesEspecialidad": "text",
  "marinadosCasa": "boolean",
  "servicioAsadorMesa": "boolean",
  "guarnicionesParrilla": "text",
  "metodosPreparacion": "checklist",
  "pastelesLigeros": "boolean",
  "desayunos": "boolean",
  "latteArt": "boolean",
  "origenGranoDetalle": "text",
  "tiposPan": "checklist",
  "hornoTipo": "enum",
  "panDelDia": "text",
  "pedidosPorKilo": "boolean",
  "productosSinGlutenPan": "boolean",
  "pastelesPersonalizados": "boolean",
  "reposteriaFina": "boolean",
  "tematicasPasteles": "checklist",
  "degustacionDisponible": "boolean",
  "entregaEventosPequenos": "boolean",
  "baseHelado": "enum",
  "saboresEstacion": "text",
  "paletasArtesanales": "boolean",
  "opcionesVeganasHelado": "boolean",
  "eventosCarritoHelado": "boolean",
  "frutasEstacion": "text",
  "boostProteina": "boolean",
  "jugosDetox": "boolean",
  "combinacionesEstrella": "text",
  "sinAzucarAnadida": "boolean",
  "especialidadTruck": "text",
  "puntosFijosSemana": "text",
  "publicaUbicacionDiaria": "boolean",
  "eventosPrivadosTruck": "boolean",
  "redesUbicacion": "checklist",
  "tipoComidaDomicilio": "checklist",
  "menuSemanal": "boolean",
  "diasEntrega": "checklist",
  "embalajeTermico": "boolean",
  "pedidoRecurrente": "boolean",
  "marcasVirtuales": "text",
  "appsDelivery": "checklist",
  "cocinaCompartida": "boolean",
  "cartelesCocteles": "text",
  "botanasDestacadas": "text",
  "barraMixologia": "boolean",
  "ambienteBar": "enum",
  "restauranteBarGastronomico": "boolean",
  "estilosCerveza": "checklist",
  "produccionPropia": "boolean",
  "maridajeCerveza": "boolean",
  "tapListRotativa": "boolean",
  "visitaCerveceria": "boolean",
  "botellasDestacadas": "text",
  "cavaVinos": "boolean",
  "botanasCantina": "text",
  "ventaBotella": "boolean",
  "rotacionPlatos": "boolean",
  "estacionesBuffet": "checklist",
  "comedorEmpresarial": "boolean",
  "controlPorciones": "boolean",
  "platosCalientesFrios": "boolean",
  "tipoExperienciaChef": "checklist",
  "menuPersonalizado": "boolean",
  "cenasPrivadas": "boolean",
  "clasesCocina": "boolean",
  "utensiliosIncluidos": "boolean",
  "tipoEventoBar": "checklist",
  "coctelesSignature": "text",
  "barraMovilIncluida": "boolean",
  "hieloInsumos": "boolean",
  "servicioAlcoholCliente": "boolean",
  "catalogoMayoreo": "text",
  "entregaRefrigerada": "boolean",
  "creditoComercial": "boolean",
  "rotacionInventario": "boolean",
  "zonasCoberturaDetalle": "text",
  "disclaimerReguladoGastronomia": "boolean",
  "menuTextoSanitizado": "textarea",
  "servicioSommelier": "boolean",
  "platillosTemporada": "text",
  "cocinaAbiertaVisible": "boolean",
  "reservacionesOnline": "boolean",
  "areasPetFriendly": "boolean",
  "menuInfantil": "boolean",
  "pagoSinContacto": "boolean",
  "estacionamientoValet": "boolean",
  "horarioDesayuno": "text",
  "coctelesMar": "text",
  "cevicheBar": "boolean",
  "horarioPescadoFresco": "text",
  "platosSinCascara": "boolean",
  "servicioPelado": "boolean",
  "promocionMariscos": "text",
  "estacionamientoMotos": "boolean",
  "horarioComidaCorrida": "text",
  "diasMenuSemana": "boolean",
  "porcionesGenerosas": "boolean",
  "paraLlevarEconomico": "boolean",
  "combosFamiliaresEconomicos": "boolean",
  "servicioRapidoMediodia": "boolean",
  "guisadosDelDia": "text",
  "ordenTacosMinimo": "number",
  "salsaBar": "boolean",
  "horarioMadrugada": "text",
  "paraEventosPequenos": "boolean",
  "promocionMartes": "text",
  "papasTipos": "checklist",
  "malteadasCasa": "boolean",
  "salsasSignature": "text",
  "comboEjecutivo": "boolean",
  "horarioNocturno": "text",
  "paraLlevarRapido": "boolean",
  "pizzaMitades": "boolean",
  "ingredientesPremium": "text",
  "salsaTomateCasa": "boolean",
  "paraLlevarCaja": "boolean",
  "nivelPicante": "checklist",
  "papasIncluidas": "boolean",
  "salsasExtra": "boolean",
  "promocionAlitas": "text",
  "horarioPartido": "text",
  "omakaseDisponible": "boolean",
  "wasabiReal": "boolean",
  "sakeSeleccion": "boolean",
  "rollsTemporada": "text",
  "paraLlevarSushi": "boolean",
  "horarioCena": "text",
  "cortesImportados": "boolean",
  "salsasParrilla": "text",
  "hornoPan": "boolean",
  "promocionFinSemana": "text",
  "musicaEnVivo": "boolean",
  "estacionamientoAmplio": "boolean",
  "pastelesDelDia": "text",
  "sandwichesLigeros": "boolean",
  "promocionDesayuno": "text",
  "reservacionesGruposPequenos": "boolean",
  "recetasTradicionales": "boolean",
  "panSinConservadores": "boolean",
  "pedidosCorporativos": "boolean",
  "horarioPrimeraSalida": "text",
  "promocionPanNoche": "text",
  "catalogoPasteles": "text",
  "rellenosDisponibles": "text",
  "degustacionSabores": "boolean",
  "entregaMunicipio": "boolean",
  "horarioRecoleccion": "text",
  "promocionTemporada": "text",
  "toppingsDisponibles": "text",
  "conosTipos": "checklist",
  "promocionDoble": "text",
  "horarioVerano": "text",
  "paraLlevarNevera": "boolean",
  "superfoodsDisponibles": "boolean",
  "promocionCombo": "text",
  "horarioManana": "text",
  "paraLlevarVaso": "boolean",
  "instagramUbicacion": "boolean",
  "promocionDia": "text",
  "capacidadCola": "number",
  "menuRotativoSemana": "boolean",
  "aceptaTarjeta": "boolean",
  "estacionamientoCercano": "boolean",
  "porcionesIndividuales": "boolean",
  "alergenosDeclarados": "boolean",
  "horarioPedidos": "text",
  "promocionSemanal": "text",
  "pagoTransferencia": "boolean",
  "embalajeEcologico": "boolean",
  "marcasOperadasDetalle": "text",
  "tiempoPromedioApp": "number",
  "ratingApps": "number",
  "horarioPico": "text",
  "embalajePremium": "boolean",
  "cartasVinos": "boolean",
  "cervezasArtesanales": "boolean",
  "musicaEnVivoBar": "boolean",
  "horarioBarraNoche": "text",
  "promocionHappyHour": "text",
  "areasExterior": "boolean",
  "flightCerveza": "boolean",
  "comidaBar": "text",
  "horarioTaproom": "text",
  "promocionGrowler": "text",
  "tequilaSeleccion": "text",
  "mezcalArtesanal": "boolean",
  "botanasTradicionales": "text",
  "horarioCantina": "text",
  "promocionBotella": "text",
  "platosDelDia": "text",
  "controlAlergenos": "boolean",
  "horarioComida": "text",
  "estacionamientoEmpleados": "boolean",
  "tiposCocinaChef": "checklist",
  "experienciaRestaurantes": "number",
  "referenciasClientes": "text",
  "duracionServicioHoras": "number",
  "viajeIncluidoKm": "number",
  "promocionPareja": "text",
  "pagoAnticipoPorcentaje": "number",
  "tiposBarra": "checklist",
  "experienciaAniosBar": "number",
  "referenciasEventos": "text",
  "uniformeIncluido": "boolean",
  "promocionPaquete": "text",
  "minimoPrimeraCompra": "number",
  "entregaProgramada": "boolean",
  "soporteComercial": "boolean",
  "devolucionesPolitica": "text",
  "catalogoDigital": "boolean",
  "certificacionesCalidad": "text",
  "pagoCreditoDias": "number",
  "accesibilidadSillaRuedas": "boolean",
  "estacionamientoTipo": "enum",
  "buenoParaNinos": "boolean",
  "codigoVestimenta": "enum",
  "menuUrl": "url",
  "appsDeliveryRatings": "number",
  "pedidoMinimoDelivery": "number",
  "zonaCoberturaColonias": "text",
  "nivelRuido": "enum",
  "buenoParaGrupos": "boolean",
  "certificacionHalalKosher": "enum",
  "cienPorCientoSinGluten": "boolean",
  "cocacolaFria": "text",
  "colaboracionesComerciales": "enum",
  "diferenciadorProfesional": "text"
};

  var CANON_BLOCK_TITLES = {
  "restaurantes-tradicional": "Tu restaurante de cocina tradicional",
  "marisquerias": "Tu marisquería y cocina de mar",
  "cocina-economica": "Comida corrida y menú del día accesible",
  "taquerias": "Tu taquería y tacos al momento",
  "hamburgueserias": "Hamburguesas, smash y combos",
  "pizzerias": "Pizza artesanal, horno y delivery",
  "polleryas-alitas": "Pollo rostizado, alitas y combos",
  "sushi-cocina-asiatica": "Sushi, ramen y cocina asiática",
  "carnes-asadas-parrilla": "Parrilla, cortes y asador",
  "cafeterias": "Café de especialidad y repostería ligera",
  "panaderias": "Pan artesanal y bollería",
  "pastelerias-reposteria": "Pasteles, repostería fina y postres",
  "neverias-heladerias": "Helados, nieves y paletas",
  "juguerias": "Jugos, licuados y smoothies",
  "food-trucks-gastronomia": "Food truck de operación recurrente",
  "comida-a-domicilio": "Cocina preparada y entrega a domicilio",
  "dark-kitchen": "Cocina oculta solo delivery",
  "bares": "Bar gastronómico con comida y bebidas",
  "cervecerias": "Cerveza artesanal y taproom",
  "cantinas-vinotecas": "Cantina tradicional y vinos",
  "buffet-comedor": "Buffet, comedor industrial o por kilo",
  "chef-cocinero-domicilio": "Chef privado y experiencias en casa",
  "bartender-servicio": "Servicio de bartender y barra móvil",
  "distribuidoras-alimentos-bebidas": "Mayoreo y distribución B2B"
};

  var NEGOCIO_CANON = [
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
  "dark-kitchen",
  "bares",
  "cervecerias",
  "cantinas-vinotecas",
  "buffet-comedor",
  "distribuidoras-alimentos-bebidas"
];

  var PACK_TITLES = {
  "LOCAL_DINE": "Comedor local / restaurante con mesa",
  "FAST_CASUAL": "Comida rápida y casual",
  "BAKERY_DESSERT": "Pan, postres y nevería",
  "CAFE": "Café, jugos y bebidas sin alcohol fuerte",
  "MOBILE": "Food truck y venta móvil recurrente",
  "DELIVERY": "Cocina sin comedor / entrega a domicilio",
  "BAR_BEBIDAS": "Bar, cervecería y cantina",
  "BUFFET": "Buffet y comedor por peso/plato",
  "PRO_SERVICE": "Chef, cocinero y bartender a domicilio",
  "B2B_DIST": "Distribución mayorista alimentos y bebidas"
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

  var ENUM_LABELS = {
  "politicaMenoresAlcohol": {
    "prohibido_menores": "Prohibido Menores",
    "solo_con_adulto": "Solo Con Adulto",
    "area_separada": "Area Separada",
    "no_aplica": "No Aplica"
  },
  "tipoServicioRapido": {
    "mostrador": "Mostrador",
    "drive_thru": "Drive Thru",
    "mixto": "Mixto",
    "solo_delivery": "Solo Delivery"
  },
  "tipoUnidadMovil": {
    "food_truck": "Food Truck",
    "remolque": "Remolque",
    "carrito": "Carrito",
    "van": "Van"
  },
  "modeloOperacion": {
    "solo_delivery": "Solo Delivery",
    "dark_kitchen": "Dark Kitchen",
    "cloud_kitchen": "Cloud Kitchen",
    "mixto": "Mixto"
  },
  "musicaAmbiente": {
    "ninguna": "Ninguna",
    "ambiente": "Ambiente",
    "vivo": "Vivo",
    "dj": "Dj"
  },
  "tipoBuffet": {
    "por_kilo": "Por Kilo",
    "por_persona": "Por Persona",
    "industrial": "Industrial",
    "tematico": "Tematico"
  },
  "tipoServicioProfesional": {
    "chef_privado": "Chef Privado",
    "cocinero": "Cocinero",
    "bartender": "Bartender",
    "mixto": "Mixto"
  },
  "tipoTortilla": {
    "maiz": "Maiz",
    "harina": "Harina",
    "ambas": "Ambas",
    "hecha_a_mano": "Hecha A Mano"
  },
  "tipoHorno": {
    "leña": "LeñA",
    "gas": "Gas",
    "electric": "Electric",
    "piedra": "Piedra"
  },
  "tipoParrilla": {
    "carbon": "Carbon",
    "gas": "Gas",
    "smoker": "Smoker",
    "asador_argentino": "Asador Argentino"
  },
  "hornoTipo": {
    "piedra": "Piedra",
    "rotativo": "Rotativo",
    "conveccion": "Conveccion",
    "mixto": "Mixto"
  },
  "baseHelado": {
    "crema": "Crema",
    "leche": "Leche",
    "vegano": "Vegano",
    "nieve_agua": "Nieve Agua"
  },
  "ambienteBar": {
    "casual": "Casual",
    "gastronomico": "Gastronomico",
    "sport": "Sport",
    "speakeasy": "Speakeasy",
    "tradicional": "Tradicional"
  },
  "estacionamientoTipo": {
    "propio": "Propio",
    "valet": "Valet",
    "calle": "Calle",
    "ninguno": "Ninguno",
    "mixto": "Mixto"
  },
  "codigoVestimenta": {
    "casual": "Casual",
    "smart_casual": "Smart Casual",
    "formal": "Formal",
    "sin_codigo": "Sin Codigo"
  },
  "nivelRuido": {
    "silencioso": "Silencioso",
    "moderado": "Moderado",
    "animado": "Animado",
    "muy_animado": "Muy Animado"
  },
  "certificacionHalalKosher": {
    "ninguna": "Ninguna",
    "halal": "Halal",
    "kosher": "Kosher",
    "halal_y_kosher": "Halal Y Kosher",
    "otra_declarativa": "Otra Declarativa"
  },
  "colaboracionesComerciales": {
    "si_activo": "Sí, colaboro activamente",
    "ocasional": "Ocasionalmente",
    "convenir": "A convenir por proyecto",
    "no": "No por ahora"
  },
  };;;

  var SECTOR_IDS = ['restaurantes', 'gastronomia'];

  function txt(v) {
    return String(v == null ? '' : v).trim();
  }

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolveCanonSubId(u) {
    u = u || {};
    var p = perfilNested(u);
    var raw = txt(u.canonSubcategoriaId) || txt(p.canonSubcategoriaId) || txt(u.subcategoriaId) || txt(u.legacySubcategoriaId);
    var key = slugSubId(raw);
    if (CANON_BLOCK_TITLES[key]) return key;
    return LEGACY_TO_CANON[key] || '';
  }

  function perfilNested(u) {
    return (u && u.gastronomiaPerfil) ? u.gastronomiaPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isGastronomiaSectorId(sid) {
    return SECTOR_IDS.indexOf(String(sid || '').trim()) >= 0;
  }

  function isGastronomiaSectorPerfil(u) {
    if (!u) return false;
    if (isGastronomiaSectorId(u.sectorId) && (u.gastronomiaPerfil || u.deltaPack)) return true;
    if (u.gastronomiaPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isGastronomiaNegocioPerfil(u) {
    var canon = resolveCanonSubId(u);
    return NEGOCIO_CANON.indexOf(canon) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isGastronomiaSectorPerfil(u)) return null;
    return isGastronomiaNegocioPerfil(u) ? 'empresa' : 'pro';
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

  function formatMoneyMx(val) {
    var n = txt(val).replace(/[^\d.,]/g, '');
    if (!n) return '';
    return n.indexOf('$') === 0 ? n : '$' + n;
  }

  function formatFieldValue(fieldId, val) {
    if (val === true) return 'Sí';
    if (val === false) return 'No';
    if (val == null) return '';
    var tipo = FIELD_TYPES[fieldId] || 'text';
    if (tipo === 'boolean') return val === true || val === 'true' || val === 1 ? 'Sí' : (val === false || val === 'false' ? 'No' : txt(val));
    if (tipo === 'checklist' || Array.isArray(val)) return joinList(val);
    if (tipo === 'enum' || tipo === 'select') return formatEnumValue(fieldId, val);
    if (fieldId === 'precioPromedioMx' || fieldId === 'cotizacionDesde' || fieldId === 'precioDesdeMx') return formatMoneyMx(val);
    if (tipo === 'number') return txt(val);
    return txt(val);
  }

  function fieldLabel(fieldId) {
    return FIELD_LABELS[fieldId] || humanize(fieldId);
  }

  function previewFields(canonId) {
    return PREVIEW_FICHA[canonId] || {};
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
    if (p.opcionesDieteticas && Array.isArray(p.opcionesDieteticas)) {
      p.opcionesDieteticas.slice(0, 2).forEach(function (d) {
        var t = formatEnumValue('opcionesDieteticas', d);
        if (t && items.indexOf(t) < 0) items.push(t);
      });
    }
    if (p.unidadCotizacion && p.cotizacionDesde) {
      items.push(formatEnumValue('unidadCotizacion', p.unidadCotizacion) + ' · ' + formatMoneyMx(p.cotizacionDesde));
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
    if (p.horarioAtencionComercial) pushRow(rows, '🕐', 'Horario', p.horarioAtencionComercial, 'horario');
    else if (p.horarioCocina) pushRow(rows, '🕐', 'Horario de cocina', p.horarioCocina, 'horario');
    else if (u.horario) pushRow(rows, '🕐', 'Horario', u.horario, 'horario');
    if (p.menuUrl) pushRow(rows, '📎', 'Menú en línea', 'Disponible');
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.radioEntregaKm) pushRow(rows, '🗺️', 'Radio de entrega', p.radioEntregaKm + ' km');
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var pack = packFrom(u);
    var badges = [];
    if (p.ventaAlcohol === true || pack === 'BAR_BEBIDAS') {
      badges.push({ cls: 'res-badge--alcohol', text: 'Venta de alcohol' });
    }
    if (p.permisoManipulacionAlimentos === true) {
      badges.push({ cls: 'res-badge--food-safe', text: 'Manipulación de alimentos' });
    }
    if (p.requiresAdminReview === true || u.requiresAdminReview === true) {
      badges.push({ cls: 'res-badge--review', text: 'Revisión administrativa' });
    }
    if (p.aceptaReservaciones === true) {
      badges.push({ cls: 'res-badge--reservas', text: 'Reservaciones' });
    }
    if (pack === 'DELIVERY' || pack === 'MOBILE') {
      badges.push({ cls: 'res-badge--movil', text: pack === 'MOBILE' ? 'Operación móvil' : 'Solo entrega' });
    }
    return badges;
  }

  function buildReguladaNotice(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var pack = packFrom(u);
    if (p.ventaAlcohol === true || pack === 'BAR_BEBIDAS') {
      return 'Venta de bebidas alcohólicas: información declarativa sujeta a permisos locales y verificación administrativa. Política de menores según lo declarado en el perfil.';
    }
    if (p.permisoManipulacionAlimentos === true) {
      return 'El establecimiento declaró contar con permiso de manipulación de alimentos vigente. CariHub puede solicitar documentación adicional.';
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
        ['Gastronomía', 'Especialidad'],
        ['Consultar', 'Precio'],
        ['Verificado', 'En plataforma'],
        ['Reserva', 'Sujeta a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(canonId, pack) {
    if (pack === 'BAR_BEBIDAS') {
      return ['Carta de bebidas declarada', 'Horarios publicados', 'Política de menores visible', 'Perfil verificable'];
    }
    if (pack === 'DELIVERY' || pack === 'MOBILE') {
      return ['Cobertura declarada', 'Tiempos orientativos', 'Menú o especialidad visible', 'Contacto directo'];
    }
    if (pack === 'PRO_SERVICE') {
      return ['Servicio a domicilio', 'Cotización transparente', 'Experiencia declarada', 'Agenda sujeta a confirmación'];
    }
    return ['Menú y especialidad visibles', 'Horario publicado', 'Precio orientativo', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Aceptan reservaciones?', '¿Cuál es el precio promedio?', '¿Tienen opciones dietéticas?', '¿Cuál es el horario?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.precioPromedioMx != null && p.precioPromedioMx !== '') return formatMoneyMx(p.precioPromedioMx);
    if (p.cotizacionDesde) return formatMoneyMx(p.cotizacionDesde);
    if (p.precioDesdeMx) return formatMoneyMx(p.precioDesdeMx);
    return '';
  }

  function resolvePriceLabel(p, pack) {
    p = p || {};
    if (p.precioPromedioMx != null && p.precioPromedioMx !== '') return 'Precio promedio';
    if (p.unidadCotizacion) return formatEnumValue('unidadCotizacion', p.unidadCotizacion);
    if (pack === 'PRO_SERVICE') return 'Cotización desde';
    return 'Desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.especialidadCasa) return p.especialidadCasa;
    if (p.diferenciadorProfesional) return p.diferenciadorProfesional;
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Gastronomía y bebidas en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isGastronomiaSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__gastronomiaCanon = canonId;
    u.__gastronomiaPack = pack;
    u.sectorId = u.sectorId || 'restaurantes';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Gastronomía';
    u.especialidad = u.especialidad || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.cotizacionDesde = u.cotizacionDesde || p.cotizacionDesde || '';
    u.unidadCotizacion = u.unidadCotizacion || p.unidadCotizacion || '';
    u.nombre = u.nombreComercial || p.nombreComercial || p.alias || u.alias || u.nombre || '';
    u.nombreComercial = u.nombreComercial || p.nombreComercial || (isGastronomiaNegocioPerfil(u) ? u.nombre : '');
    u.alias = p.alias || u.alias || u.nombre;
    u.horario = u.horario || p.horarioAtencionComercial || p.horarioCocina || '';
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (isGastronomiaNegocioPerfil(u) ? 'Comedor / local' : 'Servicio a domicilio');
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || locParts.join(', ') || txt(p.direccionOperacion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    u.__gastronomiaDatos = buildDatosRows(canonId, p, u);
    u.__gastronomiaBadges = buildBadges(u, canonId);
    u.__gastronomiaReguladaNotice = buildReguladaNotice(u, canonId);
    u.__gastronomiaPriceLabel = resolvePriceLabel(p, pack);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Propina no incluida salvo indicación', 'Promociones no declaradas en el perfil', 'Disponibilidad sujeta a confirmación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(canonId, pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || 'Horario sujeto a cambios';
    if (p.requiresAdminReview) u.requiresAdminReview = true;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__gastronomiaCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.tipoCocinaPrincipal && chips.length < 4) {
      var coc = formatFieldValue('tipoCocinaPrincipal', p.tipoCocinaPrincipal);
      if (coc) chips.push(coc.split(' · ')[0].slice(0, 28));
    }
    if (p.aceptaReservaciones === true) chips.push('Reservas');
    if (p.menuDelDia === true && chips.indexOf('Menú del día') < 0) chips.push('Menú del día');
    if (u.horario) chips.push(String(u.horario).slice(0, 28));
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubGastronomiaSectorRender = {
    PACK_TITLES: PACK_TITLES,
    isGastronomiaSectorPerfil: isGastronomiaSectorPerfil,
    isGastronomiaNegocioPerfil: isGastronomiaNegocioPerfil,
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
