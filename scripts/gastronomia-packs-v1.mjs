/**
 * MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 — Fase 1 fuente de verdad (sin runtime preview/blocks).
 * Nested key perfil: gastronomiaPerfil
 * sectorId legacy: restaurantes
 * Nombre público: Restaurantes, Gastronomía y Bebidas
 */
export const MP_ID = "MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1";
export const MP_PHASE = "F1-schema-catalogo";
export const SECTOR_ID = "restaurantes";
export const SECTOR_PUBLIC_NAME = "Restaurantes, Gastronomía y Bebidas";
export const CATALOG_VERSION_TARGET = "1.2.0-minor-gastronomia";
export const GASTRONOMIA_NESTED_PROFILE_KEY = "gastronomiaPerfil";

export const PACK_IDS = [
  "LOCAL_DINE",
  "FAST_CASUAL",
  "BAKERY_DESSERT",
  "CAFE",
  "MOBILE",
  "DELIVERY",
  "BAR_BEBIDAS",
  "BUFFET",
  "PRO_SERVICE",
  "B2B_DIST"
];

export const PACK_LABELS = {
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

export const GASTRONOMIA_BASE_FIELD_IDS = [
  "alias", "tagline", "geo", "horarioAtencionComercial", "cotizacionDesde", "unidadCotizacion", "fotos", "contactoWhatsapp",
];

export const GENERIC_ONLY_FORBIDDEN = ["descripcion", "horario", "precioDesde", "ubicacion", "serviciosIncluidos"];

export const CANON_SUBCATEGORIAS = [
  {
    "subcategoriaId": "restaurantes-tradicional",
    "nombre": "Restaurantes Tradicional",
    "pack": "LOCAL_DINE",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Tu restaurante de cocina tradicional"
  },
  {
    "subcategoriaId": "marisquerias",
    "nombre": "Marisquerías",
    "pack": "LOCAL_DINE",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Tu marisquería y cocina de mar"
  },
  {
    "subcategoriaId": "cocina-economica",
    "nombre": "Cocina Económica",
    "pack": "LOCAL_DINE",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Comida corrida y menú del día accesible"
  },
  {
    "subcategoriaId": "taquerias",
    "nombre": "Taquerías",
    "pack": "FAST_CASUAL",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Tu taquería y tacos al momento"
  },
  {
    "subcategoriaId": "hamburgueserias",
    "nombre": "Hamburgueserías",
    "pack": "FAST_CASUAL",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Hamburguesas, smash y combos"
  },
  {
    "subcategoriaId": "pizzerias",
    "nombre": "Pizzerías",
    "pack": "FAST_CASUAL",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Pizza artesanal, horno y delivery"
  },
  {
    "subcategoriaId": "polleryas-alitas",
    "nombre": "Pollerías y Alitas",
    "pack": "FAST_CASUAL",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Pollo rostizado, alitas y combos"
  },
  {
    "subcategoriaId": "sushi-cocina-asiatica",
    "nombre": "Sushi y Cocina Asiática",
    "pack": "FAST_CASUAL",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Sushi, ramen y cocina asiática"
  },
  {
    "subcategoriaId": "carnes-asadas-parrilla",
    "nombre": "Carnes Asadas y Parrilla",
    "pack": "LOCAL_DINE",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Parrilla, cortes y asador"
  },
  {
    "subcategoriaId": "cafeterias",
    "nombre": "Cafeterías",
    "pack": "CAFE",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Café de especialidad y repostería ligera"
  },
  {
    "subcategoriaId": "panaderias",
    "nombre": "Panaderías",
    "pack": "BAKERY_DESSERT",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Pan artesanal y bollería"
  },
  {
    "subcategoriaId": "pastelerias-reposteria",
    "nombre": "Pastelerías y Repostería",
    "pack": "BAKERY_DESSERT",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Pasteles, repostería fina y postres"
  },
  {
    "subcategoriaId": "neverias-heladerias",
    "nombre": "Neverías y Heladerías",
    "pack": "BAKERY_DESSERT",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Helados, nieves y paletas"
  },
  {
    "subcategoriaId": "juguerias",
    "nombre": "Juguerías",
    "pack": "CAFE",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Jugos, licuados y smoothies"
  },
  {
    "subcategoriaId": "food-trucks-gastronomia",
    "nombre": "Food Trucks Gastronomía",
    "pack": "MOBILE",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Food truck de operación recurrente"
  },
  {
    "subcategoriaId": "comida-a-domicilio",
    "nombre": "Comida a Domicilio",
    "pack": "DELIVERY",
    "formularioId": "persona_independiente",
    "tipoPerfil": "persona",
    "arquetipoBase": "persona_servicio_profesional",
    "blockTitle": "Cocina preparada y entrega a domicilio"
  },
  {
    "subcategoriaId": "dark-kitchen",
    "nombre": "Dark Kitchen",
    "pack": "DELIVERY",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Cocina oculta solo delivery"
  },
  {
    "subcategoriaId": "bares",
    "nombre": "Bares",
    "pack": "BAR_BEBIDAS",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Bar gastronómico con comida y bebidas"
  },
  {
    "subcategoriaId": "cervecerias",
    "nombre": "Cervecerías",
    "pack": "BAR_BEBIDAS",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Cerveza artesanal y taproom"
  },
  {
    "subcategoriaId": "cantinas-vinotecas",
    "nombre": "Cantinas y Vinotecas",
    "pack": "BAR_BEBIDAS",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Cantina tradicional y vinos"
  },
  {
    "subcategoriaId": "buffet-comedor",
    "nombre": "Buffet y Comedor",
    "pack": "BUFFET",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Buffet, comedor industrial o por kilo"
  },
  {
    "subcategoriaId": "chef-cocinero-domicilio",
    "nombre": "Chef y Cocinero a Domicilio",
    "pack": "PRO_SERVICE",
    "formularioId": "persona_independiente",
    "tipoPerfil": "persona",
    "arquetipoBase": "persona_servicio_profesional",
    "blockTitle": "Chef privado y experiencias en casa"
  },
  {
    "subcategoriaId": "bartender-servicio",
    "nombre": "Bartender a Domicilio",
    "pack": "PRO_SERVICE",
    "formularioId": "persona_independiente",
    "tipoPerfil": "persona",
    "arquetipoBase": "persona_servicio_profesional",
    "blockTitle": "Servicio de bartender y barra móvil"
  },
  {
    "subcategoriaId": "distribuidoras-alimentos-bebidas",
    "nombre": "Distribuidoras Alimentos y Bebidas",
    "pack": "B2B_DIST",
    "formularioId": "negocio_empresa",
    "tipoPerfil": "negocio",
    "arquetipoBase": "negocio_alimentos",
    "blockTitle": "Mayoreo y distribución B2B"
  }
];

export const NEW_SUBCATEGORIAS = [
  {
    "subcategoriaId": "restaurantes-tradicional",
    "nombre": "Restaurantes Tradicional",
    "pack": "LOCAL_DINE"
  },
  {
    "subcategoriaId": "polleryas-alitas",
    "nombre": "Pollerías y Alitas",
    "pack": "FAST_CASUAL"
  },
  {
    "subcategoriaId": "sushi-cocina-asiatica",
    "nombre": "Sushi y Cocina Asiática",
    "pack": "FAST_CASUAL"
  },
  {
    "subcategoriaId": "juguerias",
    "nombre": "Juguerías",
    "pack": "CAFE"
  },
  {
    "subcategoriaId": "bares",
    "nombre": "Bares",
    "pack": "BAR_BEBIDAS"
  },
  {
    "subcategoriaId": "cervecerias",
    "nombre": "Cervecerías",
    "pack": "BAR_BEBIDAS"
  },
  {
    "subcategoriaId": "cantinas-vinotecas",
    "nombre": "Cantinas y Vinotecas",
    "pack": "BAR_BEBIDAS"
  }
];

export const LEGACY_TO_CANON = {
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

export const ADULTOS_REDIRECTS = {
  "antros-y-bares": "adultos-entretenimiento",
  "vida-nocturna": "adultos-entretenimiento"
};

export const EVENTOS_REDIRECTS = {
  "banquetes": "banquetes-catering-eventos",
  "catering": "banquetes-catering-eventos",
  "catering-independiente": "banquetes-catering-eventos",
  "preparacion-de-banquetes": "banquetes-catering-eventos",
  "mesero-para-eventos": "organizadores-produccion-eventos"
};

export const SECTOR_UI_SLUG_TO_CANON = {
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

export const SUB_TO_PACK = Object.fromEntries(CANON_SUBCATEGORIAS.map((c) => [c.subcategoriaId, c.pack]));

export function packPlantillaKey(pack) {
  return `gastronomia_pack_${pack.toLowerCase()}`;
}

export const GASTRONOMIA_FIELD_REGISTRY = {
  "tipoCocinaPrincipal": {
    "id": "tipoCocinaPrincipal",
    "label": "Tipo de cocina principal",
    "tipo": "checklist",
    "opciones": [
      "mexicana",
      "internacional",
      "fusion",
      "regional",
      "saludable",
      "otra"
    ],
    "iaCopy": true
  },
  "capacidadComensales": {
    "id": "capacidadComensales",
    "label": "Capacidad de comensales",
    "tipo": "number",
    "min": 1,
    "max": 5000,
    "privado": false
  },
  "servicioMesa": {
    "id": "servicioMesa",
    "label": "Servicio en mesa",
    "tipo": "boolean"
  },
  "aceptaReservaciones": {
    "id": "aceptaReservaciones",
    "label": "Acepta reservaciones",
    "tipo": "boolean"
  },
  "terrazaPatio": {
    "id": "terrazaPatio",
    "label": "Terraza o patio",
    "tipo": "boolean"
  },
  "estacionamientoClientes": {
    "id": "estacionamientoClientes",
    "label": "Estacionamiento para clientes",
    "tipo": "boolean"
  },
  "menuDelDia": {
    "id": "menuDelDia",
    "label": "Menú del día",
    "tipo": "boolean"
  },
  "precioPromedioMx": {
    "id": "precioPromedioMx",
    "label": "Precio promedio por persona (MXN)",
    "tipo": "number",
    "min": 20,
    "max": 50000,
    "hint": "Rango honesto — no incluye propina."
  },
  "horarioCocina": {
    "id": "horarioCocina",
    "label": "Horario de cocina",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "permisoManipulacionAlimentos": {
    "id": "permisoManipulacionAlimentos",
    "label": "Permiso de manipulación de alimentos vigente",
    "tipo": "boolean",
    "regulado": true,
    "hint": "Declaración — puede requerir verificación admin."
  },
  "ventaAlcohol": {
    "id": "ventaAlcohol",
    "label": "Vende bebidas alcohólicas",
    "tipo": "boolean"
  },
  "politicaMenoresAlcohol": {
    "id": "politicaMenoresAlcohol",
    "label": "Política menores en área de alcohol",
    "tipo": "enum",
    "opciones": [
      "prohibido_menores",
      "solo_con_adulto",
      "area_separada",
      "no_aplica"
    ]
  },
  "opcionesDieteticas": {
    "id": "opcionesDieteticas",
    "label": "Opciones dietéticas",
    "tipo": "checklist",
    "opciones": [
      "vegetariano",
      "vegano",
      "sin_gluten",
      "keto",
      "sin_lactosa"
    ]
  },
  "tipoServicioRapido": {
    "id": "tipoServicioRapido",
    "label": "Tipo de servicio rápido",
    "tipo": "enum",
    "opciones": [
      "mostrador",
      "drive_thru",
      "mixto",
      "solo_delivery"
    ]
  },
  "pedidoMostrador": {
    "id": "pedidoMostrador",
    "label": "Pedido en mostrador",
    "tipo": "boolean"
  },
  "pedidoParaLlevar": {
    "id": "pedidoParaLlevar",
    "label": "Para llevar",
    "tipo": "boolean"
  },
  "deliveryPropio": {
    "id": "deliveryPropio",
    "label": "Delivery propio",
    "tipo": "boolean"
  },
  "tiempoPreparacionMin": {
    "id": "tiempoPreparacionMin",
    "label": "Tiempo promedio de preparación (min)",
    "tipo": "number",
    "min": 1,
    "max": 180
  },
  "combosPromociones": {
    "id": "combosPromociones",
    "label": "Combos o promociones frecuentes",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "aceptaPedidosApp": {
    "id": "aceptaPedidosApp",
    "label": "Pedidos por app (Uber/Didi/Rappi)",
    "tipo": "boolean"
  },
  "productosHorneados": {
    "id": "productosHorneados",
    "label": "Productos horneados",
    "tipo": "checklist",
    "opciones": [
      "pan",
      "bolleria",
      "galletas",
      "pasteles",
      "pays",
      "otros"
    ]
  },
  "pedidosPersonalizados": {
    "id": "pedidosPersonalizados",
    "label": "Pedidos personalizados",
    "tipo": "boolean"
  },
  "entregaADomicilio": {
    "id": "entregaADomicilio",
    "label": "Entrega a domicilio",
    "tipo": "boolean"
  },
  "horarioHorneado": {
    "id": "horarioHorneado",
    "label": "Horario de horneado",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "opcionesSinGluten": {
    "id": "opcionesSinGluten",
    "label": "Opciones sin gluten",
    "tipo": "boolean"
  },
  "opcionesVeganas": {
    "id": "opcionesVeganas",
    "label": "Opciones veganas",
    "tipo": "boolean"
  },
  "capacidadProduccionDiaria": {
    "id": "capacidadProduccionDiaria",
    "label": "Capacidad producción diaria (piezas aprox.)",
    "tipo": "number",
    "min": 1,
    "max": 100000
  },
  "mostradorFisico": {
    "id": "mostradorFisico",
    "label": "Mostrador físico",
    "tipo": "boolean"
  },
  "pedidoAnticipadoHoras": {
    "id": "pedidoAnticipadoHoras",
    "label": "Anticipación mínima pedido (horas)",
    "tipo": "number",
    "min": 0,
    "max": 720
  },
  "embalajeEspecial": {
    "id": "embalajeEspecial",
    "label": "Embalaje especial / térmico",
    "tipo": "boolean"
  },
  "bebidasPrincipal": {
    "id": "bebidasPrincipal",
    "label": "Bebidas principales",
    "tipo": "checklist",
    "opciones": [
      "cafe",
      "te",
      "jugos",
      "smoothies",
      "chocolate",
      "otras"
    ]
  },
  "granoOrigen": {
    "id": "granoOrigen",
    "label": "Origen del grano / proveedor",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "opcionesLacteos": {
    "id": "opcionesLacteos",
    "label": "Opciones de leche",
    "tipo": "checklist",
    "opciones": [
      "entera",
      "deslactosada",
      "almendra",
      "avena",
      "soya"
    ]
  },
  "opcionesSinAzucar": {
    "id": "opcionesSinAzucar",
    "label": "Bebidas sin azúcar añadida",
    "tipo": "boolean"
  },
  "horarioBarista": {
    "id": "horarioBarista",
    "label": "Horario barista / servicio",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "wifiClientes": {
    "id": "wifiClientes",
    "label": "WiFi para clientes",
    "tipo": "boolean"
  },
  "espacioTrabajo": {
    "id": "espacioTrabajo",
    "label": "Espacio apto para trabajar",
    "tipo": "boolean"
  },
  "comidaLigera": {
    "id": "comidaLigera",
    "label": "Comida ligera disponible",
    "tipo": "boolean"
  },
  "tipoUnidadMovil": {
    "id": "tipoUnidadMovil",
    "label": "Tipo de unidad móvil",
    "tipo": "enum",
    "opciones": [
      "food_truck",
      "remolque",
      "carrito",
      "van"
    ]
  },
  "ubicacionHabitual": {
    "id": "ubicacionHabitual",
    "label": "Ubicación o ruta habitual",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "horarioRuta": {
    "id": "horarioRuta",
    "label": "Horario de ruta",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "diasOperacion": {
    "id": "diasOperacion",
    "label": "Días de operación",
    "tipo": "checklist",
    "opciones": [
      "lun",
      "mar",
      "mie",
      "jue",
      "vie",
      "sab",
      "dom"
    ]
  },
  "aceptaEventosPrivados": {
    "id": "aceptaEventosPrivados",
    "label": "Acepta eventos privados (campo especialidad)",
    "tipo": "boolean",
    "hint": "No cambia de sector — ver regla food truck F0."
  },
  "radioServicioKm": {
    "id": "radioServicioKm",
    "label": "Radio de servicio (km)",
    "tipo": "number",
    "min": 1,
    "max": 500
  },
  "requiereAguaLuz": {
    "id": "requiereAguaLuz",
    "label": "Requiere agua/luz en punto de venta",
    "tipo": "boolean"
  },
  "pedidoAnticipado": {
    "id": "pedidoAnticipado",
    "label": "Pedido con anticipación",
    "tipo": "boolean"
  },
  "capacidadProduccionHora": {
    "id": "capacidadProduccionHora",
    "label": "Capacidad aprox. por hora (órdenes)",
    "tipo": "number",
    "min": 1,
    "max": 5000
  },
  "formasPago": {
    "id": "formasPago",
    "label": "Formas de pago",
    "tipo": "checklist",
    "opciones": [
      "efectivo",
      "tarjeta",
      "transferencia",
      "apps"
    ]
  },
  "modeloOperacion": {
    "id": "modeloOperacion",
    "label": "Modelo de operación",
    "tipo": "enum",
    "opciones": [
      "solo_delivery",
      "dark_kitchen",
      "cloud_kitchen",
      "mixto"
    ]
  },
  "zonasEntrega": {
    "id": "zonasEntrega",
    "label": "Zonas de entrega",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "costoEnvioDesde": {
    "id": "costoEnvioDesde",
    "label": "Costo envío desde (MXN)",
    "tipo": "number",
    "min": 0,
    "max": 5000
  },
  "pedidoMinimoMx": {
    "id": "pedidoMinimoMx",
    "label": "Pedido mínimo (MXN)",
    "tipo": "number",
    "min": 0,
    "max": 50000
  },
  "tiempoEntregaMin": {
    "id": "tiempoEntregaMin",
    "label": "Tiempo entrega estimado (min)",
    "tipo": "number",
    "min": 10,
    "max": 240
  },
  "horarioEntregas": {
    "id": "horarioEntregas",
    "label": "Horario de entregas",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "direccionOperacionPrivada": {
    "id": "direccionOperacionPrivada",
    "label": "Dirección operación (privada)",
    "tipo": "text",
    "maxLength": 200,
    "privado": true,
    "hint": "Dark kitchen — no se publica en ficha."
  },
  "mostrarSoloZonaPublica": {
    "id": "mostrarSoloZonaPublica",
    "label": "Publicar solo zona/colonia (sin calle)",
    "tipo": "boolean",
    "privado": false
  },
  "tipoBebidasPrincipal": {
    "id": "tipoBebidasPrincipal",
    "label": "Bebidas principales",
    "tipo": "checklist",
    "opciones": [
      "cerveza",
      "vino",
      "destilados",
      "cocteles",
      "mixto"
    ]
  },
  "permisoVentaAlcohol": {
    "id": "permisoVentaAlcohol",
    "label": "Permiso venta de alcohol vigente",
    "tipo": "boolean",
    "regulado": true,
    "privado": true
  },
  "horarioBarra": {
    "id": "horarioBarra",
    "label": "Horario de barra",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "comidaEnMenu": {
    "id": "comidaEnMenu",
    "label": "Comida en menú",
    "tipo": "boolean"
  },
  "musicaAmbiente": {
    "id": "musicaAmbiente",
    "label": "Música en vivo o DJ",
    "tipo": "enum",
    "opciones": [
      "ninguna",
      "ambiente",
      "vivo",
      "dj"
    ]
  },
  "happyHour": {
    "id": "happyHour",
    "label": "Happy hour",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "tipoBuffet": {
    "id": "tipoBuffet",
    "label": "Tipo de buffet",
    "tipo": "enum",
    "opciones": [
      "por_kilo",
      "por_persona",
      "industrial",
      "tematico"
    ]
  },
  "precioPorPersonaMx": {
    "id": "precioPorPersonaMx",
    "label": "Precio por persona (MXN)",
    "tipo": "number",
    "min": 30,
    "max": 5000
  },
  "horarioServicio": {
    "id": "horarioServicio",
    "label": "Horario de servicio",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "incluyeBebidas": {
    "id": "incluyeBebidas",
    "label": "Bebidas incluidas",
    "tipo": "boolean"
  },
  "postresIncluidos": {
    "id": "postresIncluidos",
    "label": "Postres incluidos",
    "tipo": "boolean"
  },
  "opcionesVegetarianas": {
    "id": "opcionesVegetarianas",
    "label": "Opciones vegetarianas",
    "tipo": "boolean"
  },
  "reservacionesGrupos": {
    "id": "reservacionesGrupos",
    "label": "Reservaciones para grupos",
    "tipo": "boolean"
  },
  "tipoServicioProfesional": {
    "id": "tipoServicioProfesional",
    "label": "Tipo de servicio profesional",
    "tipo": "enum",
    "opciones": [
      "chef_privado",
      "cocinero",
      "bartender",
      "mixto"
    ]
  },
  "especialidadCocina": {
    "id": "especialidadCocina",
    "label": "Especialidad de cocina",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "personasAtiendeMax": {
    "id": "personasAtiendeMax",
    "label": "Personas que atiendes (máx.)",
    "tipo": "number",
    "min": 1,
    "max": 500
  },
  "incluyeCompras": {
    "id": "incluyeCompras",
    "label": "Incluye compra de insumos",
    "tipo": "boolean"
  },
  "incluyeLimpieza": {
    "id": "incluyeLimpieza",
    "label": "Incluye limpieza posterior",
    "tipo": "boolean"
  },
  "precioDesdeMx": {
    "id": "precioDesdeMx",
    "label": "Precio desde (MXN)",
    "tipo": "number",
    "min": 100,
    "max": 500000
  },
  "anticipoRequerido": {
    "id": "anticipoRequerido",
    "label": "Anticipo requerido (%)",
    "tipo": "number",
    "min": 0,
    "max": 100
  },
  "equipoPropio": {
    "id": "equipoPropio",
    "label": "Traes equipo propio",
    "tipo": "boolean"
  },
  "menuDegustacion": {
    "id": "menuDegustacion",
    "label": "Menú degustación disponible",
    "tipo": "boolean"
  },
  "certificacionesProfesional": {
    "id": "certificacionesProfesional",
    "label": "Certificaciones profesionales",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "categoriasProducto": {
    "id": "categoriasProducto",
    "label": "Categorías de producto",
    "tipo": "checklist",
    "opciones": [
      "abarrotes",
      "frescos",
      "congelados",
      "bebidas",
      "snacks",
      "insumos"
    ]
  },
  "coberturaEntrega": {
    "id": "coberturaEntrega",
    "label": "Cobertura de entrega",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "pedidoMinimoMayoreo": {
    "id": "pedidoMinimoMayoreo",
    "label": "Pedido mínimo mayoreo (MXN)",
    "tipo": "number",
    "min": 500,
    "max": 5000000
  },
  "horarioReparto": {
    "id": "horarioReparto",
    "label": "Horario de reparto",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "cadenaFrio": {
    "id": "cadenaFrio",
    "label": "Cadena de frío",
    "tipo": "boolean"
  },
  "facturacionDisponible": {
    "id": "facturacionDisponible",
    "label": "Facturación disponible",
    "tipo": "boolean"
  },
  "marcasRepresentadas": {
    "id": "marcasRepresentadas",
    "label": "Marcas representadas",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "tiempoEntregaDias": {
    "id": "tiempoEntregaDias",
    "label": "Tiempo entrega mayoreo (días)",
    "tipo": "number",
    "min": 0,
    "max": 30
  },
  "capacidadAlmacen": {
    "id": "capacidadAlmacen",
    "label": "Capacidad almacén (m² aprox.)",
    "tipo": "number",
    "min": 10,
    "max": 50000
  },
  "clientesTipo": {
    "id": "clientesTipo",
    "label": "Tipo de clientes B2B",
    "tipo": "checklist",
    "opciones": [
      "restaurantes",
      "retail",
      "hoteles",
      "escuelas",
      "otros"
    ]
  },
  "horarioAtencionComercial": {
    "id": "horarioAtencionComercial",
    "label": "Horario de atención",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "especialidadCasa": {
    "id": "especialidadCasa",
    "label": "Platillo estrella de la casa",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true,
    "iaCopy": true
  },
  "chefVisible": {
    "id": "chefVisible",
    "label": "Chef visible en cocina abierta",
    "tipo": "boolean"
  },
  "maridajeVinos": {
    "id": "maridajeVinos",
    "label": "Maridaje o carta de vinos",
    "tipo": "boolean"
  },
  "brunchDisponible": {
    "id": "brunchDisponible",
    "label": "Brunch fines de semana",
    "tipo": "boolean"
  },
  "eventosPrivadosSalon": {
    "id": "eventosPrivadosSalon",
    "label": "Eventos privados en salón",
    "tipo": "boolean"
  },
  "especialidadMar": {
    "id": "especialidadMar",
    "label": "Especialidad del mar",
    "tipo": "checklist",
    "opciones": [
      "pescado",
      "mariscos",
      "mixto",
      "ceviches",
      "cocteles"
    ]
  },
  "pescadoDelDia": {
    "id": "pescadoDelDia",
    "label": "Pescado del día",
    "tipo": "boolean"
  },
  "barraOstiones": {
    "id": "barraOstiones",
    "label": "Barra de ostiones",
    "tipo": "boolean"
  },
  "platosEstrellaMar": {
    "id": "platosEstrellaMar",
    "label": "Platos estrella",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "origenPescado": {
    "id": "origenPescado",
    "label": "Origen del pescado",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "menuCorrida": {
    "id": "menuCorrida",
    "label": "Menú corrido / comida económica",
    "tipo": "boolean"
  },
  "precioMenuCorridaMx": {
    "id": "precioMenuCorridaMx",
    "label": "Precio menú corrido (MXN)",
    "tipo": "number",
    "min": 30,
    "max": 500
  },
  "incluyeBebidaMenu": {
    "id": "incluyeBebidaMenu",
    "label": "Incluye bebida en menú",
    "tipo": "boolean"
  },
  "platosRotativos": {
    "id": "platosRotativos",
    "label": "Platos rotativos por día",
    "tipo": "boolean"
  },
  "comedorIndustrial": {
    "id": "comedorIndustrial",
    "label": "Comedor industrial / empresas",
    "tipo": "boolean"
  },
  "tipoTortilla": {
    "id": "tipoTortilla",
    "label": "Tipo de tortilla",
    "tipo": "enum",
    "opciones": [
      "maiz",
      "harina",
      "ambas",
      "hecha_a_mano"
    ]
  },
  "especialidadTaco": {
    "id": "especialidadTaco",
    "label": "Especialidad de tacos",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true,
    "iaCopy": true
  },
  "salsasCasa": {
    "id": "salsasCasa",
    "label": "Salsas de la casa",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "hornoTortillas": {
    "id": "hornoTortillas",
    "label": "Tortillas hechas al momento",
    "tipo": "boolean"
  },
  "tacosEstrella": {
    "id": "tacosEstrella",
    "label": "Tacos estrella",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "tipoCarne": {
    "id": "tipoCarne",
    "label": "Tipo de carne principal",
    "tipo": "checklist",
    "opciones": [
      "res",
      "pollo",
      "cerdo",
      "mixto",
      "plant_based"
    ]
  },
  "panArtesanal": {
    "id": "panArtesanal",
    "label": "Pan artesanal propio",
    "tipo": "boolean"
  },
  "papasCasa": {
    "id": "papasCasa",
    "label": "Papas / acompañamientos casa",
    "tipo": "boolean"
  },
  "burgersEstrella": {
    "id": "burgersEstrella",
    "label": "Hamburguesas estrella",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "opcionesPlantBased": {
    "id": "opcionesPlantBased",
    "label": "Opciones plant-based",
    "tipo": "boolean"
  },
  "tipoHorno": {
    "id": "tipoHorno",
    "label": "Tipo de horno",
    "tipo": "enum",
    "opciones": [
      "leña",
      "gas",
      "electric",
      "piedra"
    ]
  },
  "masaFermentacion": {
    "id": "masaFermentacion",
    "label": "Masa con fermentación lenta",
    "tipo": "boolean"
  },
  "tamanosPizza": {
    "id": "tamanosPizza",
    "label": "Tamaños disponibles",
    "tipo": "checklist",
    "opciones": [
      "individual",
      "mediana",
      "grande",
      "familiar",
      "por_rebanada"
    ]
  },
  "pizzasEstrella": {
    "id": "pizzasEstrella",
    "label": "Pizzas estrella",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "entregaCaliente": {
    "id": "entregaCaliente",
    "label": "Garantía entrega caliente",
    "tipo": "boolean"
  },
  "cortePollo": {
    "id": "cortePollo",
    "label": "Cortes / preparaciones de pollo",
    "tipo": "checklist",
    "opciones": [
      "rostizado",
      "alitas",
      "boneless",
      "nuggets",
      "mixto"
    ]
  },
  "salsasAlitas": {
    "id": "salsasAlitas",
    "label": "Salsas para alitas",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "combosFamiliares": {
    "id": "combosFamiliares",
    "label": "Combos familiares",
    "tipo": "boolean"
  },
  "rostizadoHorario": {
    "id": "rostizadoHorario",
    "label": "Horario salida del horno",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "platosPolloEstrella": {
    "id": "platosPolloEstrella",
    "label": "Platos estrella de pollo",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "estiloAsiatico": {
    "id": "estiloAsiatico",
    "label": "Estilo asiático",
    "tipo": "checklist",
    "opciones": [
      "sushi",
      "ramen",
      "thai",
      "china",
      "coreana",
      "fusion"
    ]
  },
  "barraSushi": {
    "id": "barraSushi",
    "label": "Barra de sushi",
    "tipo": "boolean"
  },
  "opcionesCrudo": {
    "id": "opcionesCrudo",
    "label": "Platos con pescado crudo",
    "tipo": "boolean"
  },
  "platosAsiaticosEstrella": {
    "id": "platosAsiaticosEstrella",
    "label": "Platos estrella",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "teMatcha": {
    "id": "teMatcha",
    "label": "Té matcha / postres asiáticos",
    "tipo": "boolean"
  },
  "tipoParrilla": {
    "id": "tipoParrilla",
    "label": "Tipo de parrilla",
    "tipo": "enum",
    "opciones": [
      "carbon",
      "gas",
      "smoker",
      "asador_argentino"
    ]
  },
  "cortesEspecialidad": {
    "id": "cortesEspecialidad",
    "label": "Cortes especialidad",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "marinadosCasa": {
    "id": "marinadosCasa",
    "label": "Marinados de la casa",
    "tipo": "boolean"
  },
  "servicioAsadorMesa": {
    "id": "servicioAsadorMesa",
    "label": "Asador en mesa",
    "tipo": "boolean"
  },
  "guarnicionesParrilla": {
    "id": "guarnicionesParrilla",
    "label": "Guarniciones incluidas",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "metodosPreparacion": {
    "id": "metodosPreparacion",
    "label": "Métodos de preparación",
    "tipo": "checklist",
    "opciones": [
      "espresso",
      "pour_over",
      "chemex",
      "cold_brew",
      "frappe"
    ]
  },
  "pastelesLigeros": {
    "id": "pastelesLigeros",
    "label": "Pasteles ligeros / repostería",
    "tipo": "boolean"
  },
  "desayunos": {
    "id": "desayunos",
    "label": "Desayunos",
    "tipo": "boolean"
  },
  "latteArt": {
    "id": "latteArt",
    "label": "Latte art",
    "tipo": "boolean"
  },
  "origenGranoDetalle": {
    "id": "origenGranoDetalle",
    "label": "Detalle origen del grano",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "tiposPan": {
    "id": "tiposPan",
    "label": "Tipos de pan",
    "tipo": "checklist",
    "opciones": [
      "blanco",
      "integral",
      "artesanal",
      "dulce",
      "salado"
    ]
  },
  "hornoTipo": {
    "id": "hornoTipo",
    "label": "Tipo de horno",
    "tipo": "enum",
    "opciones": [
      "piedra",
      "rotativo",
      "conveccion",
      "mixto"
    ]
  },
  "panDelDia": {
    "id": "panDelDia",
    "label": "Pan saliendo del horno (horario)",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "pedidosPorKilo": {
    "id": "pedidosPorKilo",
    "label": "Pedidos por kilo",
    "tipo": "boolean"
  },
  "productosSinGlutenPan": {
    "id": "productosSinGlutenPan",
    "label": "Pan sin gluten",
    "tipo": "boolean"
  },
  "pastelesPersonalizados": {
    "id": "pastelesPersonalizados",
    "label": "Pasteles personalizados",
    "tipo": "boolean"
  },
  "reposteriaFina": {
    "id": "reposteriaFina",
    "label": "Repostería fina",
    "tipo": "boolean"
  },
  "tematicasPasteles": {
    "id": "tematicasPasteles",
    "label": "Temáticas frecuentes",
    "tipo": "checklist",
    "opciones": [
      "bodas",
      "infantil",
      "corporativo",
      "xv",
      "otros"
    ]
  },
  "degustacionDisponible": {
    "id": "degustacionDisponible",
    "label": "Degustación previa",
    "tipo": "boolean"
  },
  "entregaEventosPequenos": {
    "id": "entregaEventosPequenos",
    "label": "Entrega eventos pequeños (no sector Eventos)",
    "tipo": "boolean"
  },
  "baseHelado": {
    "id": "baseHelado",
    "label": "Base del helado",
    "tipo": "enum",
    "opciones": [
      "crema",
      "leche",
      "vegano",
      "nieve_agua"
    ]
  },
  "saboresEstacion": {
    "id": "saboresEstacion",
    "label": "Sabores de temporada",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "paletasArtesanales": {
    "id": "paletasArtesanales",
    "label": "Paletas artesanales",
    "tipo": "boolean"
  },
  "opcionesVeganasHelado": {
    "id": "opcionesVeganasHelado",
    "label": "Opciones veganas",
    "tipo": "boolean"
  },
  "eventosCarritoHelado": {
    "id": "eventosCarritoHelado",
    "label": "Carrito para fiestas (campo especialidad)",
    "tipo": "boolean"
  },
  "frutasEstacion": {
    "id": "frutasEstacion",
    "label": "Frutas de temporada",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "boostProteina": {
    "id": "boostProteina",
    "label": "Boost proteína disponible",
    "tipo": "boolean"
  },
  "jugosDetox": {
    "id": "jugosDetox",
    "label": "Jugos detox / verdes",
    "tipo": "boolean"
  },
  "combinacionesEstrella": {
    "id": "combinacionesEstrella",
    "label": "Combinaciones estrella",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "sinAzucarAnadida": {
    "id": "sinAzucarAnadida",
    "label": "Opciones sin azúcar añadida",
    "tipo": "boolean"
  },
  "especialidadTruck": {
    "id": "especialidadTruck",
    "label": "Especialidad del food truck",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true,
    "iaCopy": true
  },
  "puntosFijosSemana": {
    "id": "puntosFijosSemana",
    "label": "Puntos fijos de la semana",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "publicaUbicacionDiaria": {
    "id": "publicaUbicacionDiaria",
    "label": "Publicar ubicación diaria",
    "tipo": "boolean"
  },
  "eventosPrivadosTruck": {
    "id": "eventosPrivadosTruck",
    "label": "Contratación fiestas privadas",
    "tipo": "boolean"
  },
  "redesUbicacion": {
    "id": "redesUbicacion",
    "label": "Redes donde anuncias ubicación",
    "tipo": "checklist",
    "opciones": [
      "instagram",
      "facebook",
      "tiktok",
      "whatsapp",
      "ninguna"
    ]
  },
  "tipoComidaDomicilio": {
    "id": "tipoComidaDomicilio",
    "label": "Tipo de comida a domicilio",
    "tipo": "checklist",
    "opciones": [
      "casera",
      "saludable",
      "internacional",
      "meal_prep",
      "otra"
    ]
  },
  "menuSemanal": {
    "id": "menuSemanal",
    "label": "Menú semanal rotativo",
    "tipo": "boolean"
  },
  "diasEntrega": {
    "id": "diasEntrega",
    "label": "Días de entrega",
    "tipo": "checklist",
    "opciones": [
      "lun",
      "mar",
      "mie",
      "jue",
      "vie",
      "sab",
      "dom"
    ]
  },
  "embalajeTermico": {
    "id": "embalajeTermico",
    "label": "Embalaje térmico",
    "tipo": "boolean"
  },
  "pedidoRecurrente": {
    "id": "pedidoRecurrente",
    "label": "Suscripción / pedido recurrente",
    "tipo": "boolean"
  },
  "marcasVirtuales": {
    "id": "marcasVirtuales",
    "label": "Marcas virtuales operadas",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "appsDelivery": {
    "id": "appsDelivery",
    "label": "Apps de delivery",
    "tipo": "checklist",
    "opciones": [
      "uber_eats",
      "rappi",
      "didi",
      "propia",
      "otras"
    ]
  },
  "cocinaCompartida": {
    "id": "cocinaCompartida",
    "label": "Cocina compartida / ghost",
    "tipo": "boolean"
  },
  "cartelesCocteles": {
    "id": "cartelesCocteles",
    "label": "Cocteles de autor",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "botanasDestacadas": {
    "id": "botanasDestacadas",
    "label": "Botanas destacadas",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "barraMixologia": {
    "id": "barraMixologia",
    "label": "Barra de mixología",
    "tipo": "boolean"
  },
  "ambienteBar": {
    "id": "ambienteBar",
    "label": "Ambiente del bar",
    "tipo": "enum",
    "opciones": [
      "casual",
      "gastronomico",
      "sport",
      "speakeasy",
      "tradicional"
    ]
  },
  "restauranteBarGastronomico": {
    "id": "restauranteBarGastronomico",
    "label": "Restaurante-bar gastronómico (no antro)",
    "tipo": "boolean",
    "hint": "Si es antro/show adulto → sector Adultos."
  },
  "estilosCerveza": {
    "id": "estilosCerveza",
    "label": "Estilos de cerveza",
    "tipo": "checklist",
    "opciones": [
      "lager",
      "ipa",
      "stout",
      "wheat",
      "artesanal_local",
      "importada"
    ]
  },
  "produccionPropia": {
    "id": "produccionPropia",
    "label": "Producción propia en sitio",
    "tipo": "boolean"
  },
  "maridajeCerveza": {
    "id": "maridajeCerveza",
    "label": "Maridaje con comida",
    "tipo": "boolean"
  },
  "tapListRotativa": {
    "id": "tapListRotativa",
    "label": "Tap list rotativa",
    "tipo": "boolean"
  },
  "visitaCerveceria": {
    "id": "visitaCerveceria",
    "label": "Tour / visita cervecería",
    "tipo": "boolean"
  },
  "botellasDestacadas": {
    "id": "botellasDestacadas",
    "label": "Botellas destacadas",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "cavaVinos": {
    "id": "cavaVinos",
    "label": "Cava o selección de vinos",
    "tipo": "boolean"
  },
  "botanasCantina": {
    "id": "botanasCantina",
    "label": "Botanas de cantina",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "ventaBotella": {
    "id": "ventaBotella",
    "label": "Venta por botella",
    "tipo": "boolean"
  },
  "rotacionPlatos": {
    "id": "rotacionPlatos",
    "label": "Rotación de platos",
    "tipo": "boolean"
  },
  "estacionesBuffet": {
    "id": "estacionesBuffet",
    "label": "Estaciones del buffet",
    "tipo": "checklist",
    "opciones": [
      "ensaladas",
      "calientes",
      "postres",
      "bebidas",
      "parrilla",
      "sushi"
    ]
  },
  "comedorEmpresarial": {
    "id": "comedorEmpresarial",
    "label": "Comedor empresarial",
    "tipo": "boolean"
  },
  "controlPorciones": {
    "id": "controlPorciones",
    "label": "Control de porciones incluido",
    "tipo": "boolean"
  },
  "platosCalientesFrios": {
    "id": "platosCalientesFrios",
    "label": "Estaciones calientes y frías",
    "tipo": "boolean"
  },
  "tipoExperienciaChef": {
    "id": "tipoExperienciaChef",
    "label": "Tipo de experiencia",
    "tipo": "checklist",
    "opciones": [
      "cena_privada",
      "clase",
      "meal_prep",
      "banquete_pequeno"
    ]
  },
  "menuPersonalizado": {
    "id": "menuPersonalizado",
    "label": "Menú 100% personalizado",
    "tipo": "boolean"
  },
  "cenasPrivadas": {
    "id": "cenasPrivadas",
    "label": "Cenas privadas",
    "tipo": "boolean"
  },
  "clasesCocina": {
    "id": "clasesCocina",
    "label": "Clases de cocina",
    "tipo": "boolean"
  },
  "utensiliosIncluidos": {
    "id": "utensiliosIncluidos",
    "label": "Utensilios incluidos",
    "tipo": "boolean"
  },
  "tipoEventoBar": {
    "id": "tipoEventoBar",
    "label": "Tipo de evento",
    "tipo": "checklist",
    "opciones": [
      "casa",
      "corporativo",
      "boda",
      "fiesta_privada"
    ]
  },
  "coctelesSignature": {
    "id": "coctelesSignature",
    "label": "Cocteles signature",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "barraMovilIncluida": {
    "id": "barraMovilIncluida",
    "label": "Barra móvil incluida",
    "tipo": "boolean"
  },
  "hieloInsumos": {
    "id": "hieloInsumos",
    "label": "Hielo e insumos incluidos",
    "tipo": "boolean"
  },
  "servicioAlcoholCliente": {
    "id": "servicioAlcoholCliente",
    "label": "Alcohol provisto por cliente",
    "tipo": "boolean",
    "hint": "Si vendes alcohol tú → permisos aplican."
  },
  "catalogoMayoreo": {
    "id": "catalogoMayoreo",
    "label": "Catálogo mayoreo (resumen)",
    "tipo": "text",
    "maxLength": 300,
    "sanitizeHtml": true
  },
  "entregaRefrigerada": {
    "id": "entregaRefrigerada",
    "label": "Entrega refrigerada",
    "tipo": "boolean"
  },
  "creditoComercial": {
    "id": "creditoComercial",
    "label": "Crédito comercial",
    "tipo": "boolean"
  },
  "rotacionInventario": {
    "id": "rotacionInventario",
    "label": "Rotación de inventario alta",
    "tipo": "boolean"
  },
  "zonasCoberturaDetalle": {
    "id": "zonasCoberturaDetalle",
    "label": "Detalle zonas cobertura",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "disclaimerReguladoGastronomia": {
    "id": "disclaimerReguladoGastronomia",
    "label": "Declaro información veraz sobre permisos y alcohol",
    "tipo": "boolean",
    "regulado": true
  },
  "menuTextoSanitizado": {
    "id": "menuTextoSanitizado",
    "label": "Extracto menú (texto plano)",
    "tipo": "textarea",
    "maxLength": 2000,
    "sanitizeHtml": true,
    "iaCopy": true
  },
  "servicioSommelier": {
    "id": "servicioSommelier",
    "label": "Servicio de sommelier",
    "tipo": "boolean"
  },
  "platillosTemporada": {
    "id": "platillosTemporada",
    "label": "Platillos de temporada",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true,
    "iaCopy": true
  },
  "cocinaAbiertaVisible": {
    "id": "cocinaAbiertaVisible",
    "label": "Cocina abierta visible",
    "tipo": "boolean"
  },
  "reservacionesOnline": {
    "id": "reservacionesOnline",
    "label": "Reservaciones en línea",
    "tipo": "boolean"
  },
  "areasPetFriendly": {
    "id": "areasPetFriendly",
    "label": "Pet friendly",
    "tipo": "boolean"
  },
  "menuInfantil": {
    "id": "menuInfantil",
    "label": "Menú infantil",
    "tipo": "boolean"
  },
  "pagoSinContacto": {
    "id": "pagoSinContacto",
    "label": "Pago sin contacto / terminal",
    "tipo": "boolean"
  },
  "estacionamientoValet": {
    "id": "estacionamientoValet",
    "label": "Valet parking",
    "tipo": "boolean"
  },
  "horarioDesayuno": {
    "id": "horarioDesayuno",
    "label": "Horario desayuno",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "coctelesMar": {
    "id": "coctelesMar",
    "label": "Cocteles de mar",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "cevicheBar": {
    "id": "cevicheBar",
    "label": "Barra de ceviches",
    "tipo": "boolean"
  },
  "horarioPescadoFresco": {
    "id": "horarioPescadoFresco",
    "label": "Horario pescado fresco",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "platosSinCascara": {
    "id": "platosSinCascara",
    "label": "Platos pelados / sin cáscara",
    "tipo": "boolean"
  },
  "servicioPelado": {
    "id": "servicioPelado",
    "label": "Servicio de pelado en mesa",
    "tipo": "boolean"
  },
  "promocionMariscos": {
    "id": "promocionMariscos",
    "label": "Promoción mariscos",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "estacionamientoMotos": {
    "id": "estacionamientoMotos",
    "label": "Estacionamiento motos",
    "tipo": "boolean"
  },
  "horarioComidaCorrida": {
    "id": "horarioComidaCorrida",
    "label": "Horario comida corrida",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "diasMenuSemana": {
    "id": "diasMenuSemana",
    "label": "Menú por día de semana",
    "tipo": "boolean"
  },
  "porcionesGenerosas": {
    "id": "porcionesGenerosas",
    "label": "Porciones generosas",
    "tipo": "boolean"
  },
  "paraLlevarEconomico": {
    "id": "paraLlevarEconomico",
    "label": "Para llevar económico",
    "tipo": "boolean"
  },
  "combosFamiliaresEconomicos": {
    "id": "combosFamiliaresEconomicos",
    "label": "Combos familiares",
    "tipo": "boolean"
  },
  "servicioRapidoMediodia": {
    "id": "servicioRapidoMediodia",
    "label": "Servicio rápido mediodía",
    "tipo": "boolean"
  },
  "guisadosDelDia": {
    "id": "guisadosDelDia",
    "label": "Guisados del día",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true,
    "iaCopy": true
  },
  "ordenTacosMinimo": {
    "id": "ordenTacosMinimo",
    "label": "Orden mínima (tacos)",
    "tipo": "number",
    "min": 1,
    "max": 50
  },
  "salsaBar": {
    "id": "salsaBar",
    "label": "Barra de salsas",
    "tipo": "boolean"
  },
  "horarioMadrugada": {
    "id": "horarioMadrugada",
    "label": "Horario madrugada",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "paraEventosPequenos": {
    "id": "paraEventosPequenos",
    "label": "Pedidos eventos pequeños (campo)",
    "tipo": "boolean"
  },
  "promocionMartes": {
    "id": "promocionMartes",
    "label": "Promoción día específico",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "papasTipos": {
    "id": "papasTipos",
    "label": "Tipos de papas",
    "tipo": "checklist",
    "opciones": [
      "francesa",
      "curly",
      "sweet",
      "smash_side"
    ]
  },
  "malteadasCasa": {
    "id": "malteadasCasa",
    "label": "Malteadas de la casa",
    "tipo": "boolean"
  },
  "salsasSignature": {
    "id": "salsasSignature",
    "label": "Salsas signature",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "comboEjecutivo": {
    "id": "comboEjecutivo",
    "label": "Combo ejecutivo",
    "tipo": "boolean"
  },
  "horarioNocturno": {
    "id": "horarioNocturno",
    "label": "Horario nocturno",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "paraLlevarRapido": {
    "id": "paraLlevarRapido",
    "label": "Para llevar en minutos",
    "tipo": "boolean"
  },
  "pizzaMitades": {
    "id": "pizzaMitades",
    "label": "Mitades y combinadas",
    "tipo": "boolean"
  },
  "ingredientesPremium": {
    "id": "ingredientesPremium",
    "label": "Ingredientes premium",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "salsaTomateCasa": {
    "id": "salsaTomateCasa",
    "label": "Salsa de tomate casera",
    "tipo": "boolean"
  },
  "paraLlevarCaja": {
    "id": "paraLlevarCaja",
    "label": "Caja para llevar incluida",
    "tipo": "boolean"
  },
  "nivelPicante": {
    "id": "nivelPicante",
    "label": "Niveles de picante",
    "tipo": "checklist",
    "opciones": [
      "suave",
      "medio",
      "hot",
      "extra_hot"
    ]
  },
  "papasIncluidas": {
    "id": "papasIncluidas",
    "label": "Papas incluidas en combo",
    "tipo": "boolean"
  },
  "salsasExtra": {
    "id": "salsasExtra",
    "label": "Salsas extra disponibles",
    "tipo": "boolean"
  },
  "promocionAlitas": {
    "id": "promocionAlitas",
    "label": "Promoción alitas",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "horarioPartido": {
    "id": "horarioPartido",
    "label": "Horario partidos / eventos deportivos",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "omakaseDisponible": {
    "id": "omakaseDisponible",
    "label": "Omakase / chef's choice",
    "tipo": "boolean"
  },
  "wasabiReal": {
    "id": "wasabiReal",
    "label": "Wasabi real (no polvo)",
    "tipo": "boolean"
  },
  "sakeSeleccion": {
    "id": "sakeSeleccion",
    "label": "Selección de sake",
    "tipo": "boolean"
  },
  "rollsTemporada": {
    "id": "rollsTemporada",
    "label": "Rolls de temporada",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "paraLlevarSushi": {
    "id": "paraLlevarSushi",
    "label": "Para llevar con empaque sushi",
    "tipo": "boolean"
  },
  "horarioCena": {
    "id": "horarioCena",
    "label": "Horario cena",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "cortesImportados": {
    "id": "cortesImportados",
    "label": "Cortes importados",
    "tipo": "boolean"
  },
  "salsasParrilla": {
    "id": "salsasParrilla",
    "label": "Salsas de parrilla",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "hornoPan": {
    "id": "hornoPan",
    "label": "Pan de la casa en parrilla",
    "tipo": "boolean"
  },
  "promocionFinSemana": {
    "id": "promocionFinSemana",
    "label": "Promoción fin de semana",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "musicaEnVivo": {
    "id": "musicaEnVivo",
    "label": "Música en vivo",
    "tipo": "boolean"
  },
  "estacionamientoAmplio": {
    "id": "estacionamientoAmplio",
    "label": "Estacionamiento amplio",
    "tipo": "boolean"
  },
  "pastelesDelDia": {
    "id": "pastelesDelDia",
    "label": "Pasteles del día",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "sandwichesLigeros": {
    "id": "sandwichesLigeros",
    "label": "Sandwiches ligeros",
    "tipo": "boolean"
  },
  "promocionDesayuno": {
    "id": "promocionDesayuno",
    "label": "Promoción desayuno",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "reservacionesGruposPequenos": {
    "id": "reservacionesGruposPequenos",
    "label": "Reservaciones grupos pequeños",
    "tipo": "boolean"
  },
  "recetasTradicionales": {
    "id": "recetasTradicionales",
    "label": "Recetas tradicionales",
    "tipo": "boolean"
  },
  "panSinConservadores": {
    "id": "panSinConservadores",
    "label": "Sin conservadores artificiales",
    "tipo": "boolean"
  },
  "pedidosCorporativos": {
    "id": "pedidosCorporativos",
    "label": "Pedidos corporativos",
    "tipo": "boolean"
  },
  "horarioPrimeraSalida": {
    "id": "horarioPrimeraSalida",
    "label": "Horario primera salida del horno",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "promocionPanNoche": {
    "id": "promocionPanNoche",
    "label": "Promoción pan de noche",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "catalogoPasteles": {
    "id": "catalogoPasteles",
    "label": "Catálogo pasteles (resumen)",
    "tipo": "text",
    "maxLength": 300,
    "sanitizeHtml": true
  },
  "rellenosDisponibles": {
    "id": "rellenosDisponibles",
    "label": "Rellenos disponibles",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "degustacionSabores": {
    "id": "degustacionSabores",
    "label": "Degustación de sabores",
    "tipo": "boolean"
  },
  "entregaMunicipio": {
    "id": "entregaMunicipio",
    "label": "Entrega en municipio",
    "tipo": "boolean"
  },
  "horarioRecoleccion": {
    "id": "horarioRecoleccion",
    "label": "Horario recolección pedidos",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "promocionTemporada": {
    "id": "promocionTemporada",
    "label": "Promoción temporada",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "toppingsDisponibles": {
    "id": "toppingsDisponibles",
    "label": "Toppings disponibles",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "conosTipos": {
    "id": "conosTipos",
    "label": "Tipos de cono",
    "tipo": "checklist",
    "opciones": [
      "regular",
      "grande",
      "waffle",
      "paleta"
    ]
  },
  "promocionDoble": {
    "id": "promocionDoble",
    "label": "Promoción 2x1 / doble",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "horarioVerano": {
    "id": "horarioVerano",
    "label": "Horario temporada calor",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "paraLlevarNevera": {
    "id": "paraLlevarNevera",
    "label": "Para llevar en nevera/portátil",
    "tipo": "boolean"
  },
  "superfoodsDisponibles": {
    "id": "superfoodsDisponibles",
    "label": "Superfoods (chia, linaza, etc.)",
    "tipo": "boolean"
  },
  "promocionCombo": {
    "id": "promocionCombo",
    "label": "Promoción combo jugo",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "horarioManana": {
    "id": "horarioManana",
    "label": "Horario matutino",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "paraLlevarVaso": {
    "id": "paraLlevarVaso",
    "label": "Vaso reutilizable / para llevar",
    "tipo": "boolean"
  },
  "instagramUbicacion": {
    "id": "instagramUbicacion",
    "label": "Publicas ubicación en Instagram",
    "tipo": "boolean"
  },
  "promocionDia": {
    "id": "promocionDia",
    "label": "Promoción del día",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "capacidadCola": {
    "id": "capacidadCola",
    "label": "Capacidad cola aprox. (personas)",
    "tipo": "number",
    "min": 1,
    "max": 500
  },
  "menuRotativoSemana": {
    "id": "menuRotativoSemana",
    "label": "Menú rotativo semanal",
    "tipo": "boolean"
  },
  "aceptaTarjeta": {
    "id": "aceptaTarjeta",
    "label": "Acepta tarjeta",
    "tipo": "boolean"
  },
  "estacionamientoCercano": {
    "id": "estacionamientoCercano",
    "label": "Estacionamiento cercano",
    "tipo": "boolean"
  },
  "porcionesIndividuales": {
    "id": "porcionesIndividuales",
    "label": "Porciones individuales",
    "tipo": "boolean"
  },
  "alergenosDeclarados": {
    "id": "alergenosDeclarados",
    "label": "Alérgenos declarados en menú",
    "tipo": "boolean"
  },
  "horarioPedidos": {
    "id": "horarioPedidos",
    "label": "Horario recepción pedidos",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "promocionSemanal": {
    "id": "promocionSemanal",
    "label": "Promoción semanal",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "pagoTransferencia": {
    "id": "pagoTransferencia",
    "label": "Pago por transferencia",
    "tipo": "boolean"
  },
  "embalajeEcologico": {
    "id": "embalajeEcologico",
    "label": "Embalaje ecológico",
    "tipo": "boolean"
  },
  "marcasOperadasDetalle": {
    "id": "marcasOperadasDetalle",
    "label": "Detalle marcas operadas",
    "tipo": "text",
    "maxLength": 300,
    "sanitizeHtml": true
  },
  "tiempoPromedioApp": {
    "id": "tiempoPromedioApp",
    "label": "Tiempo promedio en apps (min)",
    "tipo": "number",
    "min": 10,
    "max": 120
  },
  "ratingApps": {
    "id": "ratingApps",
    "label": "Rating promedio apps",
    "tipo": "number",
    "min": 1,
    "max": 5
  },
  "horarioPico": {
    "id": "horarioPico",
    "label": "Horario pico",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "embalajePremium": {
    "id": "embalajePremium",
    "label": "Embalaje premium anti-derrame",
    "tipo": "boolean"
  },
  "cartasVinos": {
    "id": "cartasVinos",
    "label": "Carta de vinos",
    "tipo": "boolean"
  },
  "cervezasArtesanales": {
    "id": "cervezasArtesanales",
    "label": "Cervezas artesanales",
    "tipo": "boolean"
  },
  "musicaEnVivoBar": {
    "id": "musicaEnVivoBar",
    "label": "Música en vivo en bar",
    "tipo": "boolean"
  },
  "horarioBarraNoche": {
    "id": "horarioBarraNoche",
    "label": "Horario barra noche",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "promocionHappyHour": {
    "id": "promocionHappyHour",
    "label": "Detalle happy hour",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "areasExterior": {
    "id": "areasExterior",
    "label": "Área exterior",
    "tipo": "boolean"
  },
  "flightCerveza": {
    "id": "flightCerveza",
    "label": "Flights / degustación cerveza",
    "tipo": "boolean"
  },
  "comidaBar": {
    "id": "comidaBar",
    "label": "Comida de bar (snacks)",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "horarioTaproom": {
    "id": "horarioTaproom",
    "label": "Horario taproom",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "promocionGrowler": {
    "id": "promocionGrowler",
    "label": "Promoción growler / para llevar",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "tequilaSeleccion": {
    "id": "tequilaSeleccion",
    "label": "Selección tequilas",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "mezcalArtesanal": {
    "id": "mezcalArtesanal",
    "label": "Mezcal artesanal",
    "tipo": "boolean"
  },
  "botanasTradicionales": {
    "id": "botanasTradicionales",
    "label": "Botanas tradicionales",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "horarioCantina": {
    "id": "horarioCantina",
    "label": "Horario cantina",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "promocionBotella": {
    "id": "promocionBotella",
    "label": "Promoción botella",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "platosDelDia": {
    "id": "platosDelDia",
    "label": "Platos del día en buffet",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "controlAlergenos": {
    "id": "controlAlergenos",
    "label": "Control de alérgenos",
    "tipo": "boolean"
  },
  "horarioComida": {
    "id": "horarioComida",
    "label": "Horario comida",
    "tipo": "text",
    "maxLength": 80,
    "sanitizeHtml": true
  },
  "estacionamientoEmpleados": {
    "id": "estacionamientoEmpleados",
    "label": "Estacionamiento empleados/clientes",
    "tipo": "boolean"
  },
  "tiposCocinaChef": {
    "id": "tiposCocinaChef",
    "label": "Tipos de cocina que dominas",
    "tipo": "checklist",
    "opciones": [
      "mexicana",
      "internacional",
      "saludable",
      "gourmet",
      "regional",
      "pasteleria"
    ]
  },
  "experienciaRestaurantes": {
    "id": "experienciaRestaurantes",
    "label": "Experiencia en restaurantes (años)",
    "tipo": "number",
    "min": 0,
    "max": 50
  },
  "referenciasClientes": {
    "id": "referenciasClientes",
    "label": "Referencias verificables",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "duracionServicioHoras": {
    "id": "duracionServicioHoras",
    "label": "Duración típica servicio (horas)",
    "tipo": "number",
    "min": 1,
    "max": 24
  },
  "viajeIncluidoKm": {
    "id": "viajeIncluidoKm",
    "label": "Km incluidos en tarifa",
    "tipo": "number",
    "min": 0,
    "max": 200
  },
  "promocionPareja": {
    "id": "promocionPareja",
    "label": "Promoción pareja / aniversario",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "pagoAnticipoPorcentaje": {
    "id": "pagoAnticipoPorcentaje",
    "label": "Anticipo requerido (%)",
    "tipo": "number",
    "min": 0,
    "max": 100
  },
  "tiposBarra": {
    "id": "tiposBarra",
    "label": "Tipos de barra",
    "tipo": "checklist",
    "opciones": [
      "clasica",
      "mixologia",
      "cerveza",
      "vino",
      "movil"
    ]
  },
  "experienciaAniosBar": {
    "id": "experienciaAniosBar",
    "label": "Años experiencia bartender",
    "tipo": "number",
    "min": 0,
    "max": 50
  },
  "referenciasEventos": {
    "id": "referenciasEventos",
    "label": "Referencias eventos",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "uniformeIncluido": {
    "id": "uniformeIncluido",
    "label": "Uniforme incluido",
    "tipo": "boolean"
  },
  "promocionPaquete": {
    "id": "promocionPaquete",
    "label": "Paquetes promocionales",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "minimoPrimeraCompra": {
    "id": "minimoPrimeraCompra",
    "label": "Mínimo primera compra (MXN)",
    "tipo": "number",
    "min": 0,
    "max": 500000
  },
  "entregaProgramada": {
    "id": "entregaProgramada",
    "label": "Entrega programada recurrente",
    "tipo": "boolean"
  },
  "soporteComercial": {
    "id": "soporteComercial",
    "label": "Ejecutivo comercial asignado",
    "tipo": "boolean"
  },
  "devolucionesPolitica": {
    "id": "devolucionesPolitica",
    "label": "Política devoluciones",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "catalogoDigital": {
    "id": "catalogoDigital",
    "label": "Catálogo digital / PDF",
    "tipo": "boolean"
  },
  "certificacionesCalidad": {
    "id": "certificacionesCalidad",
    "label": "Certificaciones calidad",
    "tipo": "text",
    "maxLength": 200,
    "sanitizeHtml": true
  },
  "pagoCreditoDias": {
    "id": "pagoCreditoDias",
    "label": "Crédito (días)",
    "tipo": "number",
    "min": 0,
    "max": 90
  },
  "accesibilidadSillaRuedas": {
    "id": "accesibilidadSillaRuedas",
    "label": "Accesible silla de ruedas",
    "tipo": "boolean",
    "hint": "Común en Google Maps / Yelp — ayuda a decidir."
  },
  "estacionamientoTipo": {
    "id": "estacionamientoTipo",
    "label": "Tipo de estacionamiento",
    "tipo": "enum",
    "opciones": [
      "propio",
      "valet",
      "calle",
      "ninguno",
      "mixto"
    ]
  },
  "buenoParaNinos": {
    "id": "buenoParaNinos",
    "label": "Apto para niños",
    "tipo": "boolean"
  },
  "codigoVestimenta": {
    "id": "codigoVestimenta",
    "label": "Código de vestimenta",
    "tipo": "enum",
    "opciones": [
      "casual",
      "smart_casual",
      "formal",
      "sin_codigo"
    ]
  },
  "menuUrl": {
    "id": "menuUrl",
    "label": "Menú digital (URL)",
    "tipo": "url",
    "maxLength": 500,
    "hint": "https:// o ruta interna permitida — sin javascript:."
  },
  "appsDeliveryRatings": {
    "id": "appsDeliveryRatings",
    "label": "Rating apps delivery (Uber Eats / Rappi / DiDi Food)",
    "tipo": "number",
    "min": 1,
    "max": 5,
    "hint": "Aproximado — declaración del negocio."
  },
  "pedidoMinimoDelivery": {
    "id": "pedidoMinimoDelivery",
    "label": "Pedido mínimo delivery (MXN)",
    "tipo": "number",
    "min": 0,
    "max": 50000,
    "hint": "Mínimo por app o delivery propio."
  },
  "zonaCoberturaColonias": {
    "id": "zonaCoberturaColonias",
    "label": "Colonias / zonas de cobertura (público)",
    "tipo": "text",
    "maxLength": 300,
    "sanitizeHtml": true,
    "hint": "Sin calle exacta — solo colonias o zonas."
  },
  "nivelRuido": {
    "id": "nivelRuido",
    "label": "Nivel de ruido",
    "tipo": "enum",
    "opciones": [
      "silencioso",
      "moderado",
      "animado",
      "muy_animado"
    ]
  },
  "buenoParaGrupos": {
    "id": "buenoParaGrupos",
    "label": "Bueno para grupos",
    "tipo": "boolean"
  },
  "certificacionHalalKosher": {
    "id": "certificacionHalalKosher",
    "label": "Certificación halal / kosher (declarativo)",
    "tipo": "enum",
    "opciones": [
      "ninguna",
      "halal",
      "kosher",
      "halal_y_kosher",
      "otra_declarativa"
    ],
    "hint": "Declaración del negocio — no verificada automáticamente."
  },
  "cienPorCientoSinGluten": {
    "id": "cienPorCientoSinGluten",
    "label": "100% sin gluten (declarativo)",
    "tipo": "boolean",
    "hint": "Declaración del negocio — no verificada automáticamente."
  },
  "cocacolaFria": {
    "id": "cocacolaFria",
    "label": "cocacolaFria",
    "tipo": "text",
    "maxLength": 120,
    "sanitizeHtml": true
  },
  "colaboracionesComerciales": {
    "id": "colaboracionesComerciales",
    "label": "¿Colaboras con otros negocios, chefs o marcas?",
    "tipo": "enum",
    "opciones": [
      "si_activo",
      "ocasional",
      "convenir",
      "no"
    ]
  },
  "diferenciadorProfesional": {
    "id": "diferenciadorProfesional",
    "label": "Tu sello / lo que te distingue",
    "tipo": "text",
    "maxLength": 120,
    "iaCopy": true
  }
};

export const SUB_DELTAS = {
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
    "camposPublicosPerfil": [
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
      "especialidadCasa"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "especialidadCasa": "Detalla especialidadCasa con datos verificables — evita promesas falsas.",
      "chefVisible": "Detalla chefVisible con datos verificables — evita promesas falsas.",
      "maridajeVinos": "Detalla maridajeVinos con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "especialidadMar"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "especialidadMar": "Detalla especialidadMar con datos verificables — evita promesas falsas.",
      "pescadoDelDia": "Detalla pescadoDelDia con datos verificables — evita promesas falsas.",
      "barraOstiones": "Detalla barraOstiones con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "menuCorrida"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "menuCorrida": "Detalla menuCorrida con datos verificables — evita promesas falsas.",
      "precioMenuCorridaMx": "Detalla precioMenuCorridaMx con datos verificables — evita promesas falsas.",
      "incluyeBebidaMenu": "Detalla incluyeBebidaMenu con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "especialidadTaco"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "tipoTortilla": "Detalla tipoTortilla con datos verificables — evita promesas falsas.",
      "especialidadTaco": "Detalla especialidadTaco con datos verificables — evita promesas falsas.",
      "salsasCasa": "Detalla salsasCasa con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "panArtesanal"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "tipoCarne": "Detalla tipoCarne con datos verificables — evita promesas falsas.",
      "panArtesanal": "Detalla panArtesanal con datos verificables — evita promesas falsas.",
      "papasCasa": "Detalla papasCasa con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "masaFermentacion"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "tipoHorno": "Detalla tipoHorno con datos verificables — evita promesas falsas.",
      "masaFermentacion": "Detalla masaFermentacion con datos verificables — evita promesas falsas.",
      "tamanosPizza": "Detalla tamanosPizza con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "salsasAlitas"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "cortePollo": "Detalla cortePollo con datos verificables — evita promesas falsas.",
      "salsasAlitas": "Detalla salsasAlitas con datos verificables — evita promesas falsas.",
      "combosFamiliares": "Detalla combosFamiliares con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "barraSushi"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "estiloAsiatico": "Detalla estiloAsiatico con datos verificables — evita promesas falsas.",
      "barraSushi": "Detalla barraSushi con datos verificables — evita promesas falsas.",
      "opcionesCrudo": "Detalla opcionesCrudo con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "tipoParrilla"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "tipoParrilla": "Detalla tipoParrilla con datos verificables — evita promesas falsas.",
      "cortesEspecialidad": "Detalla cortesEspecialidad con datos verificables — evita promesas falsas.",
      "marinadosCasa": "Detalla marinadosCasa con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "pastelesLigeros"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "metodosPreparacion": "Detalla metodosPreparacion con datos verificables — evita promesas falsas.",
      "pastelesLigeros": "Detalla pastelesLigeros con datos verificables — evita promesas falsas.",
      "desayunos": "Detalla desayunos con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "hornoTipo"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "tiposPan": "Detalla tiposPan con datos verificables — evita promesas falsas.",
      "hornoTipo": "Detalla hornoTipo con datos verificables — evita promesas falsas.",
      "panDelDia": "Detalla panDelDia con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "reposteriaFina"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "pastelesPersonalizados": "Detalla pastelesPersonalizados con datos verificables — evita promesas falsas.",
      "reposteriaFina": "Detalla reposteriaFina con datos verificables — evita promesas falsas.",
      "tematicasPasteles": "Detalla tematicasPasteles con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "saboresEstacion"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "baseHelado": "Detalla baseHelado con datos verificables — evita promesas falsas.",
      "saboresEstacion": "Detalla saboresEstacion con datos verificables — evita promesas falsas.",
      "paletasArtesanales": "Detalla paletasArtesanales con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "boostProteina"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "frutasEstacion": "Detalla frutasEstacion con datos verificables — evita promesas falsas.",
      "boostProteina": "Detalla boostProteina con datos verificables — evita promesas falsas.",
      "jugosDetox": "Detalla jugosDetox con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "puntosFijosSemana"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "especialidadTruck": "Detalla especialidadTruck con datos verificables — evita promesas falsas.",
      "puntosFijosSemana": "Detalla puntosFijosSemana con datos verificables — evita promesas falsas.",
      "publicaUbicacionDiaria": "Detalla publicaUbicacionDiaria con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
      "modeloOperacion",
      "zonasEntrega",
      "costoEnvioDesde",
      "pedidoMinimoMx",
      "tiempoEntregaMin",
      "horarioEntregas",
      "permisoManipulacionAlimentos",
      "precioPromedioMx",
      "aceptaPedidosApp",
      "embalajeEspecial",
      "tipoComidaDomicilio",
      "menuSemanal",
      "diasEntrega",
      "embalajeTermico"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos",
      "direccionOperacionPrivada",
      "mostrarSoloZonaPublica"
    ],
    "textosAyuda": {
      "tipoComidaDomicilio": "Detalla tipoComidaDomicilio con datos verificables — evita promesas falsas.",
      "menuSemanal": "Detalla menuSemanal con datos verificables — evita promesas falsas.",
      "diasEntrega": "Detalla diasEntrega con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
      "modeloOperacion",
      "zonasEntrega",
      "costoEnvioDesde",
      "pedidoMinimoMx",
      "tiempoEntregaMin",
      "horarioEntregas",
      "permisoManipulacionAlimentos",
      "precioPromedioMx",
      "aceptaPedidosApp",
      "embalajeEspecial",
      "marcasVirtuales",
      "appsDelivery",
      "cocinaCompartida",
      "menuTextoSanitizado"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos",
      "direccionOperacionPrivada",
      "mostrarSoloZonaPublica"
    ],
    "textosAyuda": {
      "marcasVirtuales": "Detalla marcasVirtuales con datos verificables — evita promesas falsas.",
      "appsDelivery": "Detalla appsDelivery con datos verificables — evita promesas falsas.",
      "cocinaCompartida": "Detalla cocinaCompartida con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "botanasDestacadas"
    ],
    "camposPrivadosPerfil": [
      "permisoVentaAlcohol",
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "cartelesCocteles": "Detalla cartelesCocteles con datos verificables — evita promesas falsas.",
      "botanasDestacadas": "Detalla botanasDestacadas con datos verificables — evita promesas falsas.",
      "barraMixologia": "Detalla barraMixologia con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "produccionPropia"
    ],
    "camposPrivadosPerfil": [
      "permisoVentaAlcohol",
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "estilosCerveza": "Detalla estilosCerveza con datos verificables — evita promesas falsas.",
      "produccionPropia": "Detalla produccionPropia con datos verificables — evita promesas falsas.",
      "maridajeCerveza": "Detalla maridajeCerveza con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "cavaVinos"
    ],
    "camposPrivadosPerfil": [
      "permisoVentaAlcohol",
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "botellasDestacadas": "Detalla botellasDestacadas con datos verificables — evita promesas falsas.",
      "cavaVinos": "Detalla cavaVinos con datos verificables — evita promesas falsas.",
      "botanasCantina": "Detalla botanasCantina con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "estacionesBuffet"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "rotacionPlatos": "Detalla rotacionPlatos con datos verificables — evita promesas falsas.",
      "estacionesBuffet": "Detalla estacionesBuffet con datos verificables — evita promesas falsas.",
      "comedorEmpresarial": "Detalla comedorEmpresarial con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "menuPersonalizado"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "tipoExperienciaChef": "Detalla tipoExperienciaChef con datos verificables — evita promesas falsas.",
      "menuPersonalizado": "Detalla menuPersonalizado con datos verificables — evita promesas falsas.",
      "cenasPrivadas": "Detalla cenasPrivadas con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "coctelesSignature"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos"
    ],
    "textosAyuda": {
      "tipoEventoBar": "Detalla tipoEventoBar con datos verificables — evita promesas falsas.",
      "coctelesSignature": "Detalla coctelesSignature con datos verificables — evita promesas falsas.",
      "barraMovilIncluida": "Detalla barraMovilIncluida con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
    "camposPublicosPerfil": [
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
      "entregaRefrigerada"
    ],
    "camposPrivadosPerfil": [
      "permisoManipulacionAlimentos",
      "permisoVentaAlcohol"
    ],
    "textosAyuda": {
      "catalogoMayoreo": "Detalla catalogoMayoreo con datos verificables — evita promesas falsas.",
      "entregaRefrigerada": "Detalla entregaRefrigerada con datos verificables — evita promesas falsas.",
      "creditoComercial": "Detalla creditoComercial con datos verificables — evita promesas falsas."
    },
    "previewFicha": {
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
  }
};

export const CONDITIONAL_RULES = [
  { id: "ALCOHOL_PERMISO", when: { field: "ventaAlcohol", equals: true }, show: ["permisoVentaAlcohol", "politicaMenoresAlcohol"], require: ["permisoVentaAlcohol", "politicaMenoresAlcohol"], canon: ["bares", "cervecerias", "cantinas-vinotecas", "restaurantes-tradicional", "marisquerias", "carnes-asadas-parrilla", "buffet-comedor"] },
  { id: "ALCOHOL_SIN_PERMISO", when: { field: "ventaAlcohol", equals: true, field2: "permisoVentaAlcohol", equals2: false }, severidad: "error", mensaje: "Declara permiso de alcohol o desactiva venta de alcohol.", flags: { requiresAdminReview: true } },
  { id: "MENORES_ALCOHOL", when: { field: "politicaMenoresAlcohol", equals: "prohibido_menores" }, flags: { cumpleMenores: true } },
  { id: "FOOD_PERMISO", when: { pack: ["LOCAL_DINE", "FAST_CASUAL", "BAKERY_DESSERT", "CAFE", "MOBILE", "DELIVERY", "BAR_BEBIDAS", "BUFFET", "B2B_DIST"] }, require: ["permisoManipulacionAlimentos"], canon: "ALL_NEGOCIO_FOOD" },
  { id: "DARK_KITCHEN_PRIVADA", when: { field: "modeloOperacion", in: ["dark_kitchen", "cloud_kitchen"] }, show: ["direccionOperacionPrivada", "mostrarSoloZonaPublica"], require: ["direccionOperacionPrivada", "mostrarSoloZonaPublica"], canon: "dark-kitchen" },
  { id: "FOOD_TRUCK_EVENTOS_CAMPO", when: { field: "aceptaEventosPrivados", equals: true }, show: ["eventosPrivadosTruck"], require: [], canon: "food-trucks-gastronomia", mensaje: "Eventos privados = especialidad; sector Eventos mantiene contratación por evento." },
  { id: "RESTAURANTE_BAR_NO_ADULTOS", when: { field: "restauranteBarGastronomico", equals: true }, flags: { blockAdultosRedirect: true }, canon: "bares" },
  { id: "PRECIOS_COHERENCIA", validate: "precioPromedioMx >= 20 || precioDesdeMx >= 100", severidad: "warn", mensaje: "Revisa precios — valores sospechosamente bajos.", canon: "ALL" },
  { id: "MENU_XSS", field: "menuTextoSanitizado", sanitizeHtml: true, maxLength: 2000, canon: "ALL" },
  { id: "BARTENDER_ALCOHOL_CLIENTE", when: { field: "servicioAlcoholCliente", equals: false }, require: ["permisoVentaAlcohol"], severidad: "warn", canon: "bartender-servicio" },
  { id: "DISTRIBUIDORA_ALCOHOL", when: { field: "categoriasProducto", includes: "bebidas" }, show: ["permisoVentaAlcohol"], require: ["permisoVentaAlcohol"], canon: "distribuidoras-alimentos-bebidas" },
  { id: "REGULADO_DISCLAIMER", when: { regulado: true }, require: ["disclaimerReguladoGastronomia"], canon: ["bares", "cervecerias", "cantinas-vinotecas", "distribuidoras-alimentos-bebidas"] },
];

export const RISK_PROFILE_BY_CANON = {
  "restaurantes-tradicional": {
    "sensible": false,
    "regulada": "alimentos",
    "requiresAdminReview": false,
    "notas": []
  },
  "marisquerias": {
    "sensible": false,
    "regulada": "alimentos",
    "requiresAdminReview": false,
    "notas": []
  },
  "cocina-economica": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "taquerias": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "hamburgueserias": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "pizzerias": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "polleryas-alitas": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "sushi-cocina-asiatica": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "carnes-asadas-parrilla": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "cafeterias": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "panaderias": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "pastelerias-reposteria": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "neverias-heladerias": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "juguerias": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "food-trucks-gastronomia": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": [
      "Eventos privados = campo; no redirige a Eventos automático."
    ]
  },
  "comida-a-domicilio": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "dark-kitchen": {
    "sensible": false,
    "regulada": "declarativa",
    "requiresAdminReview": "condicional",
    "notas": [
      "Dirección privada — no publicar calle exacta."
    ]
  },
  "bares": {
    "sensible": "bajo",
    "regulada": "declarativa",
    "requiresAdminReview": false,
    "notas": [
      "Alcohol + menores — permisos declarativos.",
      "restaurante-bar legacy → bares gastronómico; antros → Adultos."
    ]
  },
  "cervecerias": {
    "sensible": "bajo",
    "regulada": "declarativa",
    "requiresAdminReview": false,
    "notas": [
      "Alcohol + menores — permisos declarativos."
    ]
  },
  "cantinas-vinotecas": {
    "sensible": "bajo",
    "regulada": "declarativa",
    "requiresAdminReview": false,
    "notas": [
      "Alcohol + menores — permisos declarativos."
    ]
  },
  "buffet-comedor": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "chef-cocinero-domicilio": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "bartender-servicio": {
    "sensible": false,
    "regulada": false,
    "requiresAdminReview": false,
    "notas": []
  },
  "distribuidoras-alimentos-bebidas": {
    "sensible": false,
    "regulada": "declarativa",
    "requiresAdminReview": false,
    "notas": []
  }
};

export const REGULATED_CANON_SUBS = new Set(["bares", "cervecerias", "cantinas-vinotecas", "distribuidoras-alimentos-bebidas", "dark-kitchen"]);

export const PACK_HEREDA_DE = {
  LOCAL_DINE: "negocio_alimentos",
  FAST_CASUAL: "negocio_alimentos",
  BAKERY_DESSERT: "negocio_alimentos",
  CAFE: "negocio_alimentos",
  MOBILE: "negocio_alimentos",
  DELIVERY: "negocio_alimentos",
  BAR_BEBIDAS: "negocio_alimentos",
  BUFFET: "negocio_alimentos",
  PRO_SERVICE: "persona_servicio_profesional",
  B2B_DIST: "negocio_alimentos",
};

export const UI_IND_GASTRONOMIA = "ui_ind_gastronomia";
export const UI_NEG_GASTRONOMIA = "ui_neg_gastronomia";
export const CATALOG_SEMVER = "1.2.0";
/** Compartido con Eventos/Bienestar — no romper QA sectorial al apply. */
export const SCHEMA_VERSION = "2026-06-27";
export const GASTRONOMIA_SCHEMA_REVISION = "2026-06-27-gastronomia";

export const MIN_DELTA_FIELD_COUNT = 15;

export function getCanonDeltaFieldIds(canonId) {
  return SUB_DELTAS[canonId]?.deltaFields || [];
}

export function isDeltaSufficient(canonId) {
  const delta = SUB_DELTAS[canonId];
  if (!delta) return false;
  const specific = delta.deltaFields.filter((f) => !GENERIC_ONLY_FORBIDDEN.includes(f));
  return specific.length >= MIN_DELTA_FIELD_COUNT;
}

export function buildPackPlantillas() {
  const packs = {};
  for (const packId of PACK_IDS) {
    const subsInPack = CANON_SUBCATEGORIAS.filter((c) => c.pack === packId);
    const allDeltaFields = [...new Set(subsInPack.flatMap((s) => SUB_DELTAS[s.subcategoriaId]?.deltaFields || []))];
    packs[packPlantillaKey(packId)] = {
      heredaDe: PACK_HEREDA_DE[packId] || "negocio_alimentos",
      deltaPack: packId,
      sectorCluster: "restaurantes",
      camposPublicosPerfil: allDeltaFields.filter((f) => !["direccionOperacionPrivada", "permisoVentaAlcohol"].includes(f)).slice(0, 12),
      obligatoriosExtra: [],
      keywordsIA: [PACK_LABELS[packId].toLowerCase(), "gastronomia", "comida", "bebidas"],
      ...(packId === "BAR_BEBIDAS" ? { coherenciaExtra: [{ id: "BAR_ALCOHOL", requiere: ["permisoVentaAlcohol"], when: { field: "ventaAlcohol", equals: true }, severidad: "error" }] } : {}),
      ...(packId === "DELIVERY" ? { privacidadExtra: ["direccionOperacionPrivada"] } : {}),
    };
  }
  for (const canon of CANON_SUBCATEGORIAS) {
    const key = packPlantillaKey(canon.pack);
    const obl = SUB_DELTAS[canon.subcategoriaId]?.obligatoriosDelta || [];
    packs[key].obligatoriosExtra = [...new Set([...(packs[key].obligatoriosExtra || []), ...obl])];
  }
  return packs;
}

export function validateLegacyMapping() {
  const errors = [];
  if (Object.keys(LEGACY_TO_CANON).length !== 25) errors.push(`LEGACY_TO_CANON debe tener 25 entradas, tiene ${Object.keys(LEGACY_TO_CANON).length}`);
  if (Object.keys(ADULTOS_REDIRECTS).length !== 2) errors.push("ADULTOS_REDIRECTS debe tener 2 entradas");
  if (Object.keys(EVENTOS_REDIRECTS).length !== 5) errors.push("EVENTOS_REDIRECTS debe tener 5 entradas");
  const canonIds = new Set(CANON_SUBCATEGORIAS.map((c) => c.subcategoriaId));
  for (const [, canon] of Object.entries(LEGACY_TO_CANON)) {
    if (!canonIds.has(canon)) errors.push(`Canon desconocido ${canon}`);
  }
  for (const canon of CANON_SUBCATEGORIAS) {
    if (!SUB_DELTAS[canon.subcategoriaId]) errors.push(`Falta SUB_DELTAS ${canon.subcategoriaId}`);
    if (!isDeltaSufficient(canon.subcategoriaId)) errors.push(`Delta insuficiente ${canon.subcategoriaId}`);
    for (const fid of SUB_DELTAS[canon.subcategoriaId]?.deltaFields || []) {
      if (!GASTRONOMIA_FIELD_REGISTRY[fid] && !GASTRONOMIA_BASE_FIELD_IDS.includes(fid) && fid !== "geo") {
        errors.push(`Campo ${fid} no en registry (${canon.subcategoriaId})`);
      }
    }
  }
  return errors;
}

export const DELTA_DIFFERENTIATOR_FIELD_IDS = [
  "menuUrl",
  "appsDeliveryRatings",
  "pedidoMinimoDelivery",
  "zonaCoberturaColonias",
  "nivelRuido",
  "buenoParaGrupos",
  "certificacionHalalKosher",
  "cienPorCientoSinGluten"
];

export const DELTA_DIFFERENTIATORS_BY_CANON = {
  "restaurantes-tradicional": [
    "menuUrl",
    "nivelRuido",
    "buenoParaGrupos",
    "certificacionHalalKosher",
    "cienPorCientoSinGluten"
  ],
  "marisquerias": [
    "menuUrl",
    "nivelRuido",
    "buenoParaGrupos",
    "certificacionHalalKosher",
    "cienPorCientoSinGluten"
  ],
  "cocina-economica": [
    "menuUrl"
  ],
  "taquerias": [
    "menuUrl",
    "appsDeliveryRatings",
    "pedidoMinimoDelivery"
  ],
  "hamburgueserias": [
    "menuUrl",
    "appsDeliveryRatings",
    "pedidoMinimoDelivery"
  ],
  "pizzerias": [
    "menuUrl",
    "appsDeliveryRatings",
    "pedidoMinimoDelivery"
  ],
  "polleryas-alitas": [
    "menuUrl",
    "appsDeliveryRatings",
    "pedidoMinimoDelivery"
  ],
  "sushi-cocina-asiatica": [
    "menuUrl",
    "appsDeliveryRatings",
    "pedidoMinimoDelivery",
    "certificacionHalalKosher",
    "cienPorCientoSinGluten"
  ],
  "carnes-asadas-parrilla": [
    "menuUrl",
    "nivelRuido",
    "buenoParaGrupos"
  ],
  "cafeterias": [
    "menuUrl",
    "appsDeliveryRatings",
    "pedidoMinimoDelivery",
    "nivelRuido",
    "buenoParaGrupos",
    "certificacionHalalKosher",
    "cienPorCientoSinGluten"
  ],
  "panaderias": [
    "menuUrl",
    "certificacionHalalKosher",
    "cienPorCientoSinGluten"
  ],
  "pastelerias-reposteria": [
    "menuUrl",
    "appsDeliveryRatings",
    "pedidoMinimoDelivery",
    "certificacionHalalKosher",
    "cienPorCientoSinGluten"
  ],
  "neverias-heladerias": [
    "menuUrl"
  ],
  "juguerias": [
    "menuUrl"
  ],
  "food-trucks-gastronomia": [
    "menuUrl",
    "appsDeliveryRatings",
    "pedidoMinimoDelivery",
    "zonaCoberturaColonias"
  ],
  "comida-a-domicilio": [
    "menuUrl",
    "appsDeliveryRatings",
    "pedidoMinimoDelivery",
    "zonaCoberturaColonias",
    "certificacionHalalKosher",
    "cienPorCientoSinGluten"
  ],
  "dark-kitchen": [
    "menuUrl",
    "appsDeliveryRatings",
    "pedidoMinimoDelivery",
    "zonaCoberturaColonias",
    "certificacionHalalKosher",
    "cienPorCientoSinGluten"
  ],
  "bares": [
    "menuUrl",
    "nivelRuido",
    "buenoParaGrupos"
  ],
  "cervecerias": [
    "menuUrl",
    "nivelRuido",
    "buenoParaGrupos"
  ],
  "cantinas-vinotecas": [
    "menuUrl",
    "nivelRuido",
    "buenoParaGrupos"
  ],
  "buffet-comedor": [
    "menuUrl",
    "nivelRuido",
    "buenoParaGrupos",
    "certificacionHalalKosher",
    "cienPorCientoSinGluten"
  ],
  "chef-cocinero-domicilio": [
    "zonaCoberturaColonias",
    "certificacionHalalKosher",
    "cienPorCientoSinGluten"
  ],
  "bartender-servicio": [
    "zonaCoberturaColonias"
  ],
  "distribuidoras-alimentos-bebidas": [
    "zonaCoberturaColonias"
  ]
};

export const SECURITY_CONTROLS = {
  xss: ["sanitizeHtml en text/textarea menú, platos, descripciones", "ValidationEngine strip tags", "menuUrl bloquea javascript:/data:/vbscript:"],
  precios: ["precioPromedioMx min/max", "coherencia warn precios sospechosos", "no aceptar negativos", "pedidoMinimoDelivery min/max"],
  horarios: ["horarioCocina maxLength", "no scripts en horarioAtencionComercial"],
  alcoholMenores: ["ventaAlcohol → permisoVentaAlcohol + politicaMenoresAlcohol", "BAR packs regulados"],
  darkKitchen: ["direccionOperacionPrivada privado", "mostrarSoloZonaPublica obligatorio", "zonaCoberturaColonias público sin calle"],
  publicoPrivado: ["camposPublicosPerfil vs camposPrivadosPerfil en SUB_DELTAS", "sanitizeGastronomiaPerfilForPublic en preview"],
  permisosAlimentos: ["permisoManipulacionAlimentos obligatorio negocio food"],
  dieteticoDeclarativo: ["certificacionHalalKosher y cienPorCientoSinGluten — no verificados automáticamente"],
  bots: ["rate limit registro — fuera F1", "requiresAdminReview dark-kitchen condicional"],
  adultosSeparacion: ["ADULTOS_REDIRECTS antros/vida-nocturna", "restaurante-bar → bares no Adultos"],
};
