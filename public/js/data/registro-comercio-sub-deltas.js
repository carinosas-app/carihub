/**
 * AUTO-GENERADO — MP-COMERCIO-DELTAS-V1 (9 subs).
 * Regenerar: node scripts/generate-comercio-sub-deltas.mjs
 */
(function (global) {
  'use strict';
  global.CARIHUB_COMERCIO_SUB_CANON_META = {
  "abarrotes": {
    "canonSubcategoriaId": "abarrotes",
    "nombre": "Abarrotes",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "zapaterias": {
    "canonSubcategoriaId": "zapaterias",
    "nombre": "Zapaterías",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "tiendas-de-ropa": {
    "canonSubcategoriaId": "tiendas-de-ropa",
    "nombre": "Tiendas de Ropa",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "farmacias-de-barrio": {
    "canonSubcategoriaId": "farmacias-de-barrio",
    "nombre": "Farmacias de Barrio",
    "deltaPack": "C",
    "formularioId": "persona_independiente"
  },
  "papelerias": {
    "canonSubcategoriaId": "papelerias",
    "nombre": "Papelerías",
    "deltaPack": "C",
    "formularioId": "persona_independiente"
  },
  "ferreterias": {
    "canonSubcategoriaId": "ferreterias",
    "nombre": "Ferreterías",
    "deltaPack": "C",
    "formularioId": "persona_independiente"
  },
  "distribuidoras": {
    "canonSubcategoriaId": "distribuidoras",
    "nombre": "Distribuidoras",
    "deltaPack": "D",
    "formularioId": "negocio_empresa"
  },
  "mayoreo": {
    "canonSubcategoriaId": "mayoreo",
    "nombre": "Mayoreo",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "tiendas-de-conveniencia": {
    "canonSubcategoriaId": "tiendas-de-conveniencia",
    "nombre": "Tiendas de Conveniencia",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  }
};
  global.CARIHUB_COMERCIO_SUB_DELTAS = {
  "abarrotes": {
    "canonSubcategoriaId": "abarrotes",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Abarrotes",
    "packLabel": "Abastos y conveniencia",
    "blockTitle": "Abarrotes",
    "blockHint": "Abarrotes de barrio — categorías, horario y entrega generan confianza.",
    "aliasPlaceholder": "Ej. Abarrotes La Esquina · Surte diario",
    "deltaFields": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio"
    ],
    "extraFields": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "diferenciadorComercio",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
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
    "obligatoriosDelta": [
      "alias",
      "categoriasProducto",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorComercio": "Ej. Precios bajos · Surte diario · Abierto 24 h",
      "coberturaGeografica": "Colonia, municipio o zona de reparto.",
      "colaboracionesComerciales": "¿Trabajas con marcas, proveedores o negocios vecinos?",
      "modalidadVentaComercio": "Tienda física, en línea, ambos o solo delivery — nunca hotel ni modalidad escort.",
      "categoriasProducto": "Sé específico con las categorías que realmente manejas.",
      "serviciosComercio": "Apartado, pedidos, surtido, asesoría…",
      "formasPagoComercio": "Efectivo, tarjeta, transferencia, meses sin intereses…",
      "entregaDomicilio": "Indica si entregas y en qué zona.",
      "serviciosMayoreo": "Mayoreo, medio mayoreo, surtido a negocios…",
      "volumenMinimoPedido": "Ej. $500 mínimo · 12 piezas · 1 caja"
    },
    "fieldLabels": {
      "categoriasProducto": "¿Qué surtes en tu abarrotes?"
    },
    "fieldOptions": {
      "modalidadVentaComercio": [
        {
          "value": "tienda_fisica",
          "label": "Tienda física"
        },
        {
          "value": "online",
          "label": "Solo en línea"
        },
        {
          "value": "ambos",
          "label": "Tienda y en línea"
        },
        {
          "value": "delivery",
          "label": "Principalmente delivery / reparto"
        }
      ],
      "entregaDomicilio": [
        {
          "value": "si",
          "label": "Sí, entrego a domicilio"
        },
        {
          "value": "no",
          "label": "No, solo en tienda"
        },
        {
          "value": "solo_zona",
          "label": "Solo en mi zona"
        },
        {
          "value": "convenir",
          "label": "A convenir"
        }
      ],
      "formasPagoComercio": [
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
          "value": "msi",
          "label": "Meses sin intereses"
        },
        {
          "value": "credito",
          "label": "Crédito / fiado"
        },
        {
          "value": "otro",
          "label": "Otro"
        }
      ],
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
      ],
      "tiposColaboracionComercial": [
        "Otros profesionales",
        "Empresas / marcas",
        "Proveedores",
        "Freelancers",
        "Creadores de contenido",
        "Instituciones",
        "Otro"
      ],
      "categoriasProducto": [
        "Despensa",
        "Lácteos",
        "Bebidas",
        "Botanas",
        "Limpieza",
        "Higiene personal",
        "Frutas y verduras",
        "Otro"
      ],
      "serviciosComercio": [
        "Venta mostrador",
        "Pedidos",
        "Apartado",
        "Delivery",
        "Recargas",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "zapaterias": {
    "canonSubcategoriaId": "zapaterias",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Zapaterías",
    "packLabel": "Moda y calzado",
    "blockTitle": "Zapaterías",
    "blockHint": "Zapatería — géneros, marcas y servicios (ajustes, mayoreo chico).",
    "aliasPlaceholder": "Ej. Zapatería · Calzado familiar",
    "deltaFields": [
      "categoriasProducto",
      "generosModa",
      "modalidadVentaComercio",
      "marcasComercializadas"
    ],
    "extraFields": [
      "categoriasProducto",
      "generosModa",
      "marcasComercializadas",
      "modalidadVentaComercio",
      "serviciosComercio",
      "formasPagoComercio",
      "diferenciadorComercio",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
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
    "obligatoriosDelta": [
      "alias",
      "categoriasProducto",
      "generosModa",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorComercio": "Ej. Precios bajos · Surte diario · Abierto 24 h",
      "coberturaGeografica": "Colonia, municipio o zona de reparto.",
      "colaboracionesComerciales": "¿Trabajas con marcas, proveedores o negocios vecinos?",
      "modalidadVentaComercio": "Tienda física, en línea, ambos o solo delivery — nunca hotel ni modalidad escort.",
      "categoriasProducto": "Sé específico con las categorías que realmente manejas.",
      "serviciosComercio": "Apartado, pedidos, surtido, asesoría…",
      "formasPagoComercio": "Efectivo, tarjeta, transferencia, meses sin intereses…",
      "entregaDomicilio": "Indica si entregas y en qué zona.",
      "serviciosMayoreo": "Mayoreo, medio mayoreo, surtido a negocios…",
      "volumenMinimoPedido": "Ej. $500 mínimo · 12 piezas · 1 caja"
    },
    "fieldLabels": {
      "generosModa": "¿A quién vendes?",
      "marcasComercializadas": "Marcas principales"
    },
    "fieldOptions": {
      "modalidadVentaComercio": [
        {
          "value": "tienda_fisica",
          "label": "Tienda física"
        },
        {
          "value": "online",
          "label": "Solo en línea"
        },
        {
          "value": "ambos",
          "label": "Tienda y en línea"
        }
      ],
      "formasPagoComercio": [
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
          "value": "msi",
          "label": "Meses sin intereses"
        },
        {
          "value": "credito",
          "label": "Crédito / fiado"
        },
        {
          "value": "otro",
          "label": "Otro"
        }
      ],
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
      ],
      "tiposColaboracionComercial": [
        "Otros profesionales",
        "Empresas / marcas",
        "Proveedores",
        "Freelancers",
        "Creadores de contenido",
        "Instituciones",
        "Otro"
      ],
      "categoriasProducto": [
        "Calzado casual",
        "Deportivo",
        "Formal",
        "Infantil",
        "Otro"
      ],
      "generosModa": [
        "Hombre",
        "Mujer",
        "Niño",
        "Unisex",
        "Otro"
      ],
      "marcasComercializadas": [
        "Nacional",
        "Importado",
        "Marca propia",
        "Varias marcas",
        "Otro"
      ],
      "serviciosComercio": [
        "Venta retail",
        "Mayoreo chico",
        "Ajustes",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "tiendas-de-ropa": {
    "canonSubcategoriaId": "tiendas-de-ropa",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Tiendas de Ropa",
    "packLabel": "Moda y calzado",
    "blockTitle": "Tiendas de ropa",
    "blockHint": "Tienda de ropa — líneas, géneros y modalidad física u online.",
    "aliasPlaceholder": "Ej. Boutique · Moda casual",
    "deltaFields": [
      "categoriasProducto",
      "generosModa",
      "modalidadVentaComercio",
      "marcasComercializadas"
    ],
    "extraFields": [
      "categoriasProducto",
      "generosModa",
      "marcasComercializadas",
      "modalidadVentaComercio",
      "serviciosComercio",
      "formasPagoComercio",
      "diferenciadorComercio",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
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
    "obligatoriosDelta": [
      "alias",
      "categoriasProducto",
      "generosModa",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorComercio": "Ej. Precios bajos · Surte diario · Abierto 24 h",
      "coberturaGeografica": "Colonia, municipio o zona de reparto.",
      "colaboracionesComerciales": "¿Trabajas con marcas, proveedores o negocios vecinos?",
      "modalidadVentaComercio": "Tienda física, en línea, ambos o solo delivery — nunca hotel ni modalidad escort.",
      "categoriasProducto": "Sé específico con las categorías que realmente manejas.",
      "serviciosComercio": "Apartado, pedidos, surtido, asesoría…",
      "formasPagoComercio": "Efectivo, tarjeta, transferencia, meses sin intereses…",
      "entregaDomicilio": "Indica si entregas y en qué zona.",
      "serviciosMayoreo": "Mayoreo, medio mayoreo, surtido a negocios…",
      "volumenMinimoPedido": "Ej. $500 mínimo · 12 piezas · 1 caja"
    },
    "fieldLabels": {
      "categoriasProducto": "Tipos de prenda",
      "generosModa": "Géneros / edades"
    },
    "fieldOptions": {
      "modalidadVentaComercio": [
        {
          "value": "tienda_fisica",
          "label": "Tienda física"
        },
        {
          "value": "online",
          "label": "Solo en línea"
        },
        {
          "value": "ambos",
          "label": "Tienda y en línea"
        }
      ],
      "formasPagoComercio": [
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
          "value": "msi",
          "label": "Meses sin intereses"
        },
        {
          "value": "credito",
          "label": "Crédito / fiado"
        },
        {
          "value": "otro",
          "label": "Otro"
        }
      ],
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
      ],
      "tiposColaboracionComercial": [
        "Otros profesionales",
        "Empresas / marcas",
        "Proveedores",
        "Freelancers",
        "Creadores de contenido",
        "Instituciones",
        "Otro"
      ],
      "categoriasProducto": [
        "Casual",
        "Formal",
        "Deportiva",
        "Infantil",
        "Accesorios",
        "Otro"
      ],
      "generosModa": [
        "Hombre",
        "Mujer",
        "Niño",
        "Unisex",
        "Otro"
      ],
      "marcasComercializadas": [
        "Marca propia",
        "Nacional",
        "Importado",
        "Varias marcas",
        "Otro"
      ],
      "serviciosComercio": [
        "Venta retail",
        "Mayoreo chico",
        "Personal shopper",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "farmacias-de-barrio": {
    "canonSubcategoriaId": "farmacias-de-barrio",
    "deltaPack": "C",
    "formularioId": "persona_independiente",
    "nombre": "Farmacias de Barrio",
    "packLabel": "Retail especializado",
    "blockTitle": "Farmacias de barrio",
    "blockHint": "Farmacia de barrio — productos, servicios y formas de pago.",
    "aliasPlaceholder": "Ej. Farmacia del barrio · Entrega local",
    "deltaFields": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio"
    ],
    "extraFields": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "marcasComercializadas",
      "diferenciadorComercio",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
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
    "obligatoriosDelta": [
      "alias",
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorComercio": "Ej. Precios bajos · Surte diario · Abierto 24 h",
      "coberturaGeografica": "Colonia, municipio o zona de reparto.",
      "colaboracionesComerciales": "¿Trabajas con marcas, proveedores o negocios vecinos?",
      "modalidadVentaComercio": "Tienda física, en línea, ambos o solo delivery — nunca hotel ni modalidad escort.",
      "categoriasProducto": "Sé específico con las categorías que realmente manejas.",
      "serviciosComercio": "Apartado, pedidos, surtido, asesoría…",
      "formasPagoComercio": "Efectivo, tarjeta, transferencia, meses sin intereses…",
      "entregaDomicilio": "Indica si entregas y en qué zona.",
      "serviciosMayoreo": "Mayoreo, medio mayoreo, surtido a negocios…",
      "volumenMinimoPedido": "Ej. $500 mínimo · 12 piezas · 1 caja"
    },
    "fieldLabels": {
      "serviciosComercio": "Servicios de farmacia",
      "categoriasProducto": "Categorías de producto"
    },
    "fieldOptions": {
      "modalidadVentaComercio": [
        {
          "value": "tienda_fisica",
          "label": "Tienda física"
        },
        {
          "value": "online",
          "label": "Solo en línea"
        },
        {
          "value": "ambos",
          "label": "Tienda y en línea"
        },
        {
          "value": "delivery",
          "label": "Principalmente delivery / reparto"
        }
      ],
      "entregaDomicilio": [
        {
          "value": "si",
          "label": "Sí, entrego a domicilio"
        },
        {
          "value": "no",
          "label": "No, solo en tienda"
        },
        {
          "value": "solo_zona",
          "label": "Solo en mi zona"
        },
        {
          "value": "convenir",
          "label": "A convenir"
        }
      ],
      "formasPagoComercio": [
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
          "value": "msi",
          "label": "Meses sin intereses"
        },
        {
          "value": "credito",
          "label": "Crédito / fiado"
        },
        {
          "value": "otro",
          "label": "Otro"
        }
      ],
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
      ],
      "tiposColaboracionComercial": [
        "Otros profesionales",
        "Empresas / marcas",
        "Proveedores",
        "Freelancers",
        "Creadores de contenido",
        "Instituciones",
        "Otro"
      ],
      "categoriasProducto": [
        "Medicamentos",
        "Genéricos",
        "Dermocosmética",
        "Bebés",
        "Suplementos",
        "Otro"
      ],
      "serviciosComercio": [
        "Venta mostrador",
        "Entrega a domicilio",
        "Toma de presión",
        "Otro"
      ],
      "marcasComercializadas": [
        "Genéricos",
        "Patente",
        "Mixto",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "papelerias": {
    "canonSubcategoriaId": "papelerias",
    "deltaPack": "C",
    "formularioId": "persona_independiente",
    "nombre": "Papelerías",
    "packLabel": "Retail especializado",
    "blockTitle": "Papelerías",
    "blockHint": "Papelería — útiles, impresión y servicios escolares/oficina.",
    "aliasPlaceholder": "Ej. Papelería · Útiles y copias",
    "deltaFields": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio"
    ],
    "extraFields": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "diferenciadorComercio",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
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
    "obligatoriosDelta": [
      "alias",
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorComercio": "Ej. Precios bajos · Surte diario · Abierto 24 h",
      "coberturaGeografica": "Colonia, municipio o zona de reparto.",
      "colaboracionesComerciales": "¿Trabajas con marcas, proveedores o negocios vecinos?",
      "modalidadVentaComercio": "Tienda física, en línea, ambos o solo delivery — nunca hotel ni modalidad escort.",
      "categoriasProducto": "Sé específico con las categorías que realmente manejas.",
      "serviciosComercio": "Apartado, pedidos, surtido, asesoría…",
      "formasPagoComercio": "Efectivo, tarjeta, transferencia, meses sin intereses…",
      "entregaDomicilio": "Indica si entregas y en qué zona.",
      "serviciosMayoreo": "Mayoreo, medio mayoreo, surtido a negocios…",
      "volumenMinimoPedido": "Ej. $500 mínimo · 12 piezas · 1 caja"
    },
    "fieldLabels": {
      "categoriasProducto": "Productos y servicios"
    },
    "fieldOptions": {
      "modalidadVentaComercio": [
        {
          "value": "tienda_fisica",
          "label": "Tienda física"
        },
        {
          "value": "online",
          "label": "Solo en línea"
        },
        {
          "value": "ambos",
          "label": "Tienda y en línea"
        },
        {
          "value": "delivery",
          "label": "Principalmente delivery / reparto"
        }
      ],
      "entregaDomicilio": [
        {
          "value": "si",
          "label": "Sí, entrego a domicilio"
        },
        {
          "value": "no",
          "label": "No, solo en tienda"
        },
        {
          "value": "solo_zona",
          "label": "Solo en mi zona"
        },
        {
          "value": "convenir",
          "label": "A convenir"
        }
      ],
      "formasPagoComercio": [
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
          "value": "msi",
          "label": "Meses sin intereses"
        },
        {
          "value": "credito",
          "label": "Crédito / fiado"
        },
        {
          "value": "otro",
          "label": "Otro"
        }
      ],
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
      ],
      "tiposColaboracionComercial": [
        "Otros profesionales",
        "Empresas / marcas",
        "Proveedores",
        "Freelancers",
        "Creadores de contenido",
        "Instituciones",
        "Otro"
      ],
      "categoriasProducto": [
        "Útiles escolares",
        "Oficina",
        "Impresión",
        "Regalos",
        "Arte",
        "Otro"
      ],
      "serviciosComercio": [
        "Copias",
        "Impresión",
        "Engargolado",
        "Venta retail",
        "Otro"
      ],
      "marcasComercializadas": []
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "ferreterias": {
    "canonSubcategoriaId": "ferreterias",
    "deltaPack": "C",
    "formularioId": "persona_independiente",
    "nombre": "Ferreterías",
    "packLabel": "Retail especializado",
    "blockTitle": "Ferreterías",
    "blockHint": "Ferretería — categorías, marcas y asesoría técnica.",
    "aliasPlaceholder": "Ej. Ferretería · Herramientas y plomería",
    "deltaFields": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio"
    ],
    "extraFields": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "marcasComercializadas",
      "diferenciadorComercio",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
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
    "obligatoriosDelta": [
      "alias",
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorComercio": "Ej. Precios bajos · Surte diario · Abierto 24 h",
      "coberturaGeografica": "Colonia, municipio o zona de reparto.",
      "colaboracionesComerciales": "¿Trabajas con marcas, proveedores o negocios vecinos?",
      "modalidadVentaComercio": "Tienda física, en línea, ambos o solo delivery — nunca hotel ni modalidad escort.",
      "categoriasProducto": "Sé específico con las categorías que realmente manejas.",
      "serviciosComercio": "Apartado, pedidos, surtido, asesoría…",
      "formasPagoComercio": "Efectivo, tarjeta, transferencia, meses sin intereses…",
      "entregaDomicilio": "Indica si entregas y en qué zona.",
      "serviciosMayoreo": "Mayoreo, medio mayoreo, surtido a negocios…",
      "volumenMinimoPedido": "Ej. $500 mínimo · 12 piezas · 1 caja"
    },
    "fieldLabels": {
      "categoriasProducto": "Departamentos de ferretería",
      "marcasComercializadas": "Marcas de herramientas"
    },
    "fieldOptions": {
      "modalidadVentaComercio": [
        {
          "value": "tienda_fisica",
          "label": "Tienda física"
        },
        {
          "value": "online",
          "label": "Solo en línea"
        },
        {
          "value": "ambos",
          "label": "Tienda y en línea"
        },
        {
          "value": "delivery",
          "label": "Principalmente delivery / reparto"
        }
      ],
      "entregaDomicilio": [
        {
          "value": "si",
          "label": "Sí, entrego a domicilio"
        },
        {
          "value": "no",
          "label": "No, solo en tienda"
        },
        {
          "value": "solo_zona",
          "label": "Solo en mi zona"
        },
        {
          "value": "convenir",
          "label": "A convenir"
        }
      ],
      "formasPagoComercio": [
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
          "value": "msi",
          "label": "Meses sin intereses"
        },
        {
          "value": "credito",
          "label": "Crédito / fiado"
        },
        {
          "value": "otro",
          "label": "Otro"
        }
      ],
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
      ],
      "tiposColaboracionComercial": [
        "Otros profesionales",
        "Empresas / marcas",
        "Proveedores",
        "Freelancers",
        "Creadores de contenido",
        "Instituciones",
        "Otro"
      ],
      "categoriasProducto": [
        "Herramientas",
        "Plomería",
        "Eléctrico",
        "Pintura",
        "Construcción",
        "Jardín",
        "Otro"
      ],
      "serviciosComercio": [
        "Asesoría",
        "Cortes",
        "Pedidos especiales",
        "Delivery",
        "Otro"
      ],
      "marcasComercializadas": [
        "Truper",
        "Condor",
        "Urrea",
        "Genérico",
        "Varias",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "distribuidoras": {
    "canonSubcategoriaId": "distribuidoras",
    "deltaPack": "D",
    "formularioId": "negocio_empresa",
    "nombre": "Distribuidoras",
    "packLabel": "Mayoreo y distribución",
    "blockTitle": "Distribuidoras",
    "blockHint": "Distribuidora — servicios B2B, flota y especialidades de la empresa.",
    "aliasPlaceholder": "Ej. Mayoreo · Surtido a negocios",
    "deltaFields": [
      "serviciosEmpresaComercio",
      "especialidadesEmpresaComercio",
      "tiposClientesComercio",
      "flotaEntrega",
      "modalidadVentaComercio"
    ],
    "extraFields": [
      "serviciosEmpresaComercio",
      "especialidadesEmpresaComercio",
      "tiposClientesComercio",
      "flotaEntrega",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "diferenciadorComercio",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
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
    "obligatoriosDelta": [
      "nombreComercial",
      "serviciosEmpresaComercio",
      "especialidadesEmpresaComercio",
      "tiposClientesComercio",
      "flotaEntrega",
      "modalidadVentaComercio",
      "direccion",
      "horarioDetalle",
      "geo"
    ],
    "textosAyuda": {
      "diferenciadorComercio": "Ej. Precios bajos · Surte diario · Abierto 24 h",
      "coberturaGeografica": "Colonia, municipio o zona de reparto.",
      "colaboracionesComerciales": "¿Trabajas con marcas, proveedores o negocios vecinos?",
      "flotaEntrega": "Ej. Reparto diario CDMX · 5 unidades",
      "modalidadVentaComercio": "Tienda física, en línea, ambos o solo delivery — nunca hotel ni modalidad escort.",
      "categoriasProducto": "Sé específico con las categorías que realmente manejas.",
      "serviciosComercio": "Apartado, pedidos, surtido, asesoría…",
      "formasPagoComercio": "Efectivo, tarjeta, transferencia, meses sin intereses…",
      "entregaDomicilio": "Indica si entregas y en qué zona.",
      "serviciosMayoreo": "Mayoreo, medio mayoreo, surtido a negocios…",
      "volumenMinimoPedido": "Ej. $500 mínimo · 12 piezas · 1 caja"
    },
    "fieldLabels": {
      "serviciosEmpresaComercio": "Servicios de la distribuidora",
      "flotaEntrega": "Cobertura de entrega / flota"
    },
    "fieldOptions": {
      "modalidadVentaComercio": [
        {
          "value": "tienda_fisica",
          "label": "Tienda física"
        },
        {
          "value": "ambos",
          "label": "Tienda y en línea"
        },
        {
          "value": "delivery",
          "label": "Principalmente delivery / reparto"
        }
      ],
      "formasPagoComercio": [
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
          "value": "msi",
          "label": "Meses sin intereses"
        },
        {
          "value": "credito",
          "label": "Crédito / fiado"
        },
        {
          "value": "otro",
          "label": "Otro"
        }
      ],
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
      ],
      "tiposColaboracionComercial": [
        "Otros profesionales",
        "Empresas / marcas",
        "Proveedores",
        "Freelancers",
        "Creadores de contenido",
        "Instituciones",
        "Otro"
      ],
      "serviciosEmpresaComercio": [
        "Distribución B2B",
        "Rutas fijas",
        "Cross-dock",
        "Surtido",
        "Crédito comercial",
        "Otro"
      ],
      "tiposClientesComercio": [
        "Retail",
        "Restaurantes",
        "Industria",
        "Gobierno",
        "Otro"
      ]
    },
    "negocioLocal": true,
    "personaIndependiente": false
  },
  "mayoreo": {
    "canonSubcategoriaId": "mayoreo",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Mayoreo",
    "packLabel": "Mayoreo y distribución",
    "blockTitle": "Mayoreo",
    "blockHint": "Mayoreo — pedido mínimo, tipos de cliente y cobertura de entrega.",
    "aliasPlaceholder": "Ej. Mayoreo · Surtido a negocios",
    "deltaFields": [
      "serviciosMayoreo",
      "volumenMinimoPedido",
      "tiposClientesComercio",
      "modalidadVentaComercio"
    ],
    "extraFields": [
      "serviciosMayoreo",
      "volumenMinimoPedido",
      "tiposClientesComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "diferenciadorComercio",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
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
    "obligatoriosDelta": [
      "alias",
      "serviciosMayoreo",
      "volumenMinimoPedido",
      "tiposClientesComercio",
      "modalidadVentaComercio",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorComercio": "Ej. Precios bajos · Surte diario · Abierto 24 h",
      "coberturaGeografica": "Colonia, municipio o zona de reparto.",
      "colaboracionesComerciales": "¿Trabajas con marcas, proveedores o negocios vecinos?",
      "modalidadVentaComercio": "Tienda física, en línea, ambos o solo delivery — nunca hotel ni modalidad escort.",
      "categoriasProducto": "Sé específico con las categorías que realmente manejas.",
      "serviciosComercio": "Apartado, pedidos, surtido, asesoría…",
      "formasPagoComercio": "Efectivo, tarjeta, transferencia, meses sin intereses…",
      "entregaDomicilio": "Indica si entregas y en qué zona.",
      "serviciosMayoreo": "Mayoreo, medio mayoreo, surtido a negocios…",
      "volumenMinimoPedido": "Ej. $500 mínimo · 12 piezas · 1 caja"
    },
    "fieldLabels": {
      "serviciosMayoreo": "¿Qué ofreces en mayoreo?",
      "tiposClientesComercio": "¿A quién vendes?"
    },
    "fieldOptions": {
      "modalidadVentaComercio": [
        {
          "value": "tienda_fisica",
          "label": "Tienda física"
        },
        {
          "value": "ambos",
          "label": "Tienda y en línea"
        },
        {
          "value": "delivery",
          "label": "Principalmente delivery / reparto"
        }
      ],
      "entregaDomicilio": [
        {
          "value": "si",
          "label": "Sí, entrego a domicilio"
        },
        {
          "value": "no",
          "label": "No, solo en tienda"
        },
        {
          "value": "solo_zona",
          "label": "Solo en mi zona"
        },
        {
          "value": "convenir",
          "label": "A convenir"
        }
      ],
      "formasPagoComercio": [
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
          "value": "msi",
          "label": "Meses sin intereses"
        },
        {
          "value": "credito",
          "label": "Crédito / fiado"
        },
        {
          "value": "otro",
          "label": "Otro"
        }
      ],
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
      ],
      "tiposColaboracionComercial": [
        "Otros profesionales",
        "Empresas / marcas",
        "Proveedores",
        "Freelancers",
        "Creadores de contenido",
        "Instituciones",
        "Otro"
      ],
      "serviciosMayoreo": [
        "Mayoreo",
        "Medio mayoreo",
        "Surtido",
        "Entrega programada",
        "Otro"
      ],
      "tiposClientesComercio": [
        "Negocios",
        "Restaurantes",
        "Tienditas",
        "Eventos",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "tiendas-de-conveniencia": {
    "canonSubcategoriaId": "tiendas-de-conveniencia",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Tiendas de Conveniencia",
    "packLabel": "Abastos y conveniencia",
    "blockTitle": "Tiendas de conveniencia",
    "blockHint": "Tienda de conveniencia — productos, horario extendido y servicios extra.",
    "aliasPlaceholder": "Ej. Mini súper 24 h · Col. Centro",
    "deltaFields": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio"
    ],
    "extraFields": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "diferenciadorComercio",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
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
    "obligatoriosDelta": [
      "alias",
      "categoriasProducto",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorComercio": "Ej. Precios bajos · Surte diario · Abierto 24 h",
      "coberturaGeografica": "Colonia, municipio o zona de reparto.",
      "colaboracionesComerciales": "¿Trabajas con marcas, proveedores o negocios vecinos?",
      "modalidadVentaComercio": "Tienda física, en línea, ambos o solo delivery — nunca hotel ni modalidad escort.",
      "categoriasProducto": "Sé específico con las categorías que realmente manejas.",
      "serviciosComercio": "Apartado, pedidos, surtido, asesoría…",
      "formasPagoComercio": "Efectivo, tarjeta, transferencia, meses sin intereses…",
      "entregaDomicilio": "Indica si entregas y en qué zona.",
      "serviciosMayoreo": "Mayoreo, medio mayoreo, surtido a negocios…",
      "volumenMinimoPedido": "Ej. $500 mínimo · 12 piezas · 1 caja"
    },
    "fieldLabels": {
      "serviciosComercio": "Servicios además de venta"
    },
    "fieldOptions": {
      "modalidadVentaComercio": [
        {
          "value": "tienda_fisica",
          "label": "Tienda física"
        },
        {
          "value": "online",
          "label": "Solo en línea"
        },
        {
          "value": "ambos",
          "label": "Tienda y en línea"
        },
        {
          "value": "delivery",
          "label": "Principalmente delivery / reparto"
        }
      ],
      "entregaDomicilio": [
        {
          "value": "si",
          "label": "Sí, entrego a domicilio"
        },
        {
          "value": "no",
          "label": "No, solo en tienda"
        },
        {
          "value": "solo_zona",
          "label": "Solo en mi zona"
        },
        {
          "value": "convenir",
          "label": "A convenir"
        }
      ],
      "formasPagoComercio": [
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
          "value": "msi",
          "label": "Meses sin intereses"
        },
        {
          "value": "credito",
          "label": "Crédito / fiado"
        },
        {
          "value": "otro",
          "label": "Otro"
        }
      ],
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
      ],
      "tiposColaboracionComercial": [
        "Otros profesionales",
        "Empresas / marcas",
        "Proveedores",
        "Freelancers",
        "Creadores de contenido",
        "Instituciones",
        "Otro"
      ],
      "categoriasProducto": [
        "Snacks",
        "Bebidas",
        "Lácteos",
        "Panadería",
        "Higiene",
        "Servicios",
        "Otro"
      ],
      "serviciosComercio": [
        "24 horas",
        "Recargas",
        "Pago servicios",
        "Café",
        "Delivery",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  }
};
})(typeof window !== 'undefined' ? window : globalThis);
