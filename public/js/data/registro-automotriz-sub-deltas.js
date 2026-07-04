/**
 * AUTO-GENERADO — MP-AUTOMOTRIZ-DELTAS-V1 (14 subs).
 * Regenerar: node scripts/generate-automotriz-sub-deltas.mjs
 */
(function (global) {
  'use strict';
  global.CARIHUB_AUTOMOTRIZ_SUB_CANON_META = {
  "talleres-mecanicos": {
    "canonSubcategoriaId": "talleres-mecanicos",
    "nombre": "Talleres Mecánicos",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "vulcanizadoras": {
    "canonSubcategoriaId": "vulcanizadoras",
    "nombre": "Vulcanizadoras",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "lotes-de-autos": {
    "canonSubcategoriaId": "lotes-de-autos",
    "nombre": "Lotes de Autos",
    "deltaPack": "E",
    "formularioId": "persona_independiente"
  },
  "agencias-de-autos": {
    "canonSubcategoriaId": "agencias-de-autos",
    "nombre": "Agencias de Autos",
    "deltaPack": "E",
    "formularioId": "negocio_empresa"
  },
  "refaccionarias": {
    "canonSubcategoriaId": "refaccionarias",
    "nombre": "Refaccionarias",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "hojalateria-y-pintura": {
    "canonSubcategoriaId": "hojalateria-y-pintura",
    "nombre": "Hojalatería y Pintura",
    "deltaPack": "C",
    "formularioId": "persona_independiente"
  },
  "lavado-de-autos": {
    "canonSubcategoriaId": "lavado-de-autos",
    "nombre": "Lavado de Autos",
    "deltaPack": "C",
    "formularioId": "persona_independiente"
  },
  "gruas-y-auxilio-vial": {
    "canonSubcategoriaId": "gruas-y-auxilio-vial",
    "nombre": "Grúas y Auxilio Vial",
    "deltaPack": "F",
    "formularioId": "persona_independiente"
  },
  "mecanicos-a-domicilio": {
    "canonSubcategoriaId": "mecanicos-a-domicilio",
    "nombre": "Mecánicos a domicilio",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "electromecanicos": {
    "canonSubcategoriaId": "electromecanicos",
    "nombre": "Electromecánicos",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "tecnicos-en-baterias": {
    "canonSubcategoriaId": "tecnicos-en-baterias",
    "nombre": "Técnicos en baterías",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "tecnicos-en-a-c-automotriz": {
    "canonSubcategoriaId": "tecnicos-en-a-c-automotriz",
    "nombre": "Técnicos en A/C automotriz",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "instaladores-de-audio-car-multimedia": {
    "canonSubcategoriaId": "instaladores-de-audio-car-multimedia",
    "nombre": "Instaladores de audio / car multimedia",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "detallado-automotriz-premium": {
    "canonSubcategoriaId": "detallado-automotriz-premium",
    "nombre": "Detallado automotriz premium",
    "deltaPack": "C",
    "formularioId": "persona_independiente"
  }
};
  global.CARIHUB_AUTOMOTRIZ_SUB_DELTAS = {
  "talleres-mecanicos": {
    "canonSubcategoriaId": "talleres-mecanicos",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Talleres Mecánicos",
    "packLabel": "Mecánica y reparación",
    "blockTitle": "Talleres mecánicos",
    "blockHint": "Servicios mecánicos, marcas y modalidad — la cobertura y garantía generan confianza.",
    "aliasPlaceholder": "Ej. Taller Mecánico · Especialista en afinación",
    "deltaFields": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "marcasAtendidas"
    ],
    "extraFields": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "tiempoRespuestaAuto",
      "anosExperienciaAuto",
      "diferenciadorAutomotriz",
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
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "coberturaGeografica",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosMecanica": "¿Qué servicios mecánicos ofreces?",
      "especialidadesMecanica": "¿En qué te especializas?",
      "marcasAtendidas": "¿Qué marcas atiendes?"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "taller_fijo",
          "label": "Taller / local fijo"
        },
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Taller y domicilio"
        }
      ],
      "tiempoRespuestaAuto": [
        {
          "value": "emergencia_30min",
          "label": "Emergencia (~30 min)"
        },
        {
          "value": "1h",
          "label": "Dentro de 1 hora"
        },
        {
          "value": "2h",
          "label": "1–2 horas"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaAuto": [
        {
          "value": "1_3",
          "label": "1–3 años"
        },
        {
          "value": "4_7",
          "label": "4–7 años"
        },
        {
          "value": "8_15",
          "label": "8–15 años"
        },
        {
          "value": "16_mas",
          "label": "16+ años"
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
      "serviciosMecanica": [
        "Afinación",
        "Frenos",
        "Suspensión",
        "Diagnóstico computarizado",
        "Cambio de aceite",
        "Mantenimiento preventivo",
        "Otro"
      ],
      "especialidadesMecanica": [
        "Motor",
        "Transmisión",
        "Frenos",
        "Suspensión",
        "Dirección",
        "Inyección",
        "Diesel",
        "Otro"
      ],
      "marcasAtendidas": [
        "Nissan",
        "VW",
        "Chevrolet",
        "Toyota",
        "Ford",
        "Hyundai",
        "Multimarca",
        "Otro"
      ],
      "tiposVehiculoAtendidos": [
        "Sedán",
        "SUV",
        "Pick-up",
        "Camioneta",
        "Flotilla ligera",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "vulcanizadoras": {
    "canonSubcategoriaId": "vulcanizadoras",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Vulcanizadoras",
    "packLabel": "Llantas y vulcanización",
    "blockTitle": "Vulcanizadoras",
    "blockHint": "Llantas, balanceo y alineación — tipos de llanta y servicios incluidos.",
    "aliasPlaceholder": "Ej. Vulcanizadora · Llantas y alineación",
    "deltaFields": [
      "serviciosLlantas",
      "tiposLlantas",
      "modalidadServicioAuto"
    ],
    "extraFields": [
      "serviciosLlantas",
      "tiposLlantas",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "garantiaServicioAuto",
      "diferenciadorAutomotriz",
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
      "serviciosLlantas",
      "tiposLlantas",
      "modalidadServicioAuto",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosLlantas": "¿Qué servicios de llantas ofreces?",
      "tiposLlantas": "¿Qué tipos de llanta manejas?"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "taller_fijo",
          "label": "Taller / local fijo"
        },
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Taller y domicilio"
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
      "serviciosLlantas": [
        "Venta de llantas",
        "Montaje",
        "Balanceo",
        "Alineación",
        "Reparación de pinchaduras",
        "Rotación",
        "Otro"
      ],
      "tiposLlantas": [
        "Auto",
        "Camioneta / SUV",
        "Pick-up",
        "Moto",
        "Comercial ligero",
        "Otro"
      ],
      "marcasAtendidas": [
        "Michelin",
        "Goodyear",
        "Pirelli",
        "Hankook",
        "Yokohama",
        "Genérico",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "lotes-de-autos": {
    "canonSubcategoriaId": "lotes-de-autos",
    "deltaPack": "E",
    "formularioId": "persona_independiente",
    "nombre": "Lotes de Autos",
    "packLabel": "Venta de vehículos",
    "blockTitle": "Lotes de autos",
    "blockHint": "Seminuevos, contado y financiamiento — unidades disponibles y cobertura.",
    "aliasPlaceholder": "Ej. Lote de seminuevos · Contado y crédito",
    "deltaFields": [
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible",
      "cantidadUnidadesAprox"
    ],
    "extraFields": [
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible",
      "cantidadUnidadesAprox",
      "diferenciadorAutomotriz",
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
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible",
      "cantidadUnidadesAprox",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosVentaAutos": "¿Cómo vendes?",
      "cantidadUnidadesAprox": "Unidades disponibles ahora"
    },
    "fieldOptions": {
      "financiamientoDisponible": [
        {
          "value": "si_propio",
          "label": "Financiamiento propio"
        },
        {
          "value": "si_terceros",
          "label": "Financiamiento con terceros"
        },
        {
          "value": "contado_solo",
          "label": "Solo contado"
        },
        {
          "value": "convenir",
          "label": "A convenir"
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
      "serviciosVentaAutos": [
        "Venta contado",
        "Seminuevos",
        "Consignación",
        "Permuta",
        "Entrega inmediata",
        "Otro"
      ],
      "tiposVehiculoVenta": [
        "Seminuevo",
        "Usado",
        "Consignación",
        "Pick-up",
        "SUV",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "agencias-de-autos": {
    "canonSubcategoriaId": "agencias-de-autos",
    "deltaPack": "E",
    "formularioId": "negocio_empresa",
    "nombre": "Agencias de Autos",
    "packLabel": "Venta de vehículos",
    "blockTitle": "Agencias de autos",
    "blockHint": "Inventario, financiamiento y servicios de agencia — datos del establecimiento.",
    "aliasPlaceholder": "Ej. Seminuevos · Contado y crédito",
    "deltaFields": [
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible",
      "inventarioAproximado"
    ],
    "extraFields": [
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible",
      "inventarioAproximado",
      "diferenciadorAutomotriz",
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
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible",
      "inventarioAproximado",
      "direccion",
      "horarioDetalle",
      "geo"
    ],
    "textosAyuda": {
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "inventarioAproximado": "Ej. 15–30 unidades en piso",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosVentaAutos": "Servicios de la agencia",
      "tiposVehiculoVenta": "¿Qué vendes?",
      "inventarioAproximado": "Unidades en piso (aprox.)"
    },
    "fieldOptions": {
      "financiamientoDisponible": [
        {
          "value": "si_propio",
          "label": "Financiamiento propio"
        },
        {
          "value": "si_terceros",
          "label": "Financiamiento con terceros"
        },
        {
          "value": "contado_solo",
          "label": "Solo contado"
        },
        {
          "value": "convenir",
          "label": "A convenir"
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
      "serviciosVentaAutos": [
        "Venta de nuevos",
        "Venta de seminuevos",
        "Consignación",
        "Permuta",
        "Entrega inmediata",
        "Prueba de manejo",
        "Otro"
      ],
      "tiposVehiculoVenta": [
        "Nuevo",
        "Seminuevo",
        "Usado certificado",
        "Flotilla",
        "Otro"
      ]
    },
    "negocioLocal": true,
    "personaIndependiente": false
  },
  "refaccionarias": {
    "canonSubcategoriaId": "refaccionarias",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Refaccionarias",
    "packLabel": "Refacciones y especialidades",
    "blockTitle": "Refaccionarias",
    "blockHint": "Refacciones, marcas y entrega — líneas que manejas y cobertura.",
    "aliasPlaceholder": "Ej. Refaccionaria · Multimarca y entrega",
    "deltaFields": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto"
    ],
    "extraFields": [
      "serviciosRefacciones",
      "serviciosEspecialidadAuto",
      "lineasRefacciones",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "diferenciadorAutomotriz",
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
      "serviciosEspecialidadAuto",
      "modalidadServicioAuto",
      "tarifaDesde",
      "horarioDetalle",
      "serviciosRefacciones",
      "lineasRefacciones"
    ],
    "textosAyuda": {
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosRefacciones": "¿Qué vendes o surtes?",
      "lineasRefacciones": "Marcas o líneas principales"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "taller_fijo",
          "label": "Taller / local fijo"
        },
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Taller y domicilio"
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
      "serviciosRefacciones": [
        "Venta mostrador",
        "Pedidos especiales",
        "Entrega a domicilio",
        "Mayoreo",
        "Asesoría técnica",
        "Otro"
      ],
      "serviciosEspecialidadAuto": [
        "Frenos",
        "Suspensión",
        "Motor",
        "Eléctrico",
        "Filtros",
        "Otro"
      ],
      "lineasRefacciones": [
        "Bosch",
        "Monroe",
        "NGK",
        "Gates",
        "Genérico",
        "OEM",
        "Otro"
      ],
      "marcasAtendidas": [
        "Nissan",
        "VW",
        "Chevrolet",
        "Toyota",
        "Ford",
        "Multimarca",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "hojalateria-y-pintura": {
    "canonSubcategoriaId": "hojalateria-y-pintura",
    "deltaPack": "C",
    "formularioId": "persona_independiente",
    "nombre": "Hojalatería y Pintura",
    "packLabel": "Carrocería y estética",
    "blockTitle": "Hojalatería y pintura",
    "blockHint": "Carrocería, pintura y enderezado — tipos de daño y garantía de acabado.",
    "aliasPlaceholder": "Ej. Hojalatería · Pintura automotriz",
    "deltaFields": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto"
    ],
    "extraFields": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "diferenciadorAutomotriz",
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
      "modalidadServicioAuto",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "serviciosCarroceria"
    ],
    "textosAyuda": {
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosCarroceria": "Servicios de hojalatería y pintura"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "taller_fijo",
          "label": "Taller / local fijo"
        },
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Taller y domicilio"
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
      "serviciosCarroceria": [
        "Enderezado",
        "Pintura completa",
        "Pintura por panel",
        "Match de color",
        "Detallado post-pintura",
        "Seguros / siniestros",
        "Otro"
      ],
      "serviciosEsteticaAuto": [
        "Pulido",
        "Encerado",
        "Limpieza profunda",
        "Otro"
      ],
      "tiposVehiculoAtendidos": [
        "Sedán",
        "SUV",
        "Pick-up",
        "Camioneta",
        "Motocicleta",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "lavado-de-autos": {
    "canonSubcategoriaId": "lavado-de-autos",
    "deltaPack": "C",
    "formularioId": "persona_independiente",
    "nombre": "Lavado de Autos",
    "packLabel": "Carrocería y estética",
    "blockTitle": "Lavado de autos",
    "blockHint": "Lavado, encerado y paquetes — modalidad en sitio o a domicilio.",
    "aliasPlaceholder": "Ej. Lavado de autos · Express y completo",
    "deltaFields": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto"
    ],
    "extraFields": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "diferenciadorAutomotriz",
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
      "modalidadServicioAuto",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "serviciosEsteticaAuto"
    ],
    "textosAyuda": {
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosEsteticaAuto": "Paquetes y servicios de lavado"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "taller_fijo",
          "label": "Taller / local fijo"
        },
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Taller y domicilio"
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
      "serviciosEsteticaAuto": [
        "Lavado express",
        "Lavado completo",
        "Encerado",
        "Aspirado interior",
        "Lavado de motor",
        "Lavado a domicilio",
        "Otro"
      ],
      "serviciosCarroceria": [],
      "tiposVehiculoAtendidos": [
        "Sedán",
        "SUV",
        "Pick-up",
        "Camioneta",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "gruas-y-auxilio-vial": {
    "canonSubcategoriaId": "gruas-y-auxilio-vial",
    "deltaPack": "F",
    "formularioId": "persona_independiente",
    "nombre": "Grúas y Auxilio Vial",
    "packLabel": "Grúas y auxilio vial",
    "blockTitle": "Grúas y auxilio vial",
    "blockHint": "Grúa, auxilio vial y cobertura en carretera — tiempos de respuesta críticos.",
    "aliasPlaceholder": "Ej. Grúa 24 h · Auxilio en carretera",
    "deltaFields": [
      "serviciosGrua",
      "modalidadServicioAuto",
      "coberturaCarretera",
      "tiempoRespuestaAuto"
    ],
    "extraFields": [
      "serviciosGrua",
      "modalidadServicioAuto",
      "coberturaCarretera",
      "tiempoRespuestaAuto",
      "tiposVehiculoAtendidos",
      "diferenciadorAutomotriz",
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
      "serviciosGrua",
      "modalidadServicioAuto",
      "coberturaGeografica",
      "coberturaCarretera",
      "tiempoRespuestaAuto",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosGrua": "Servicios de grúa y auxilio",
      "coberturaCarretera": "¿Dónde operas en carretera?",
      "tiempoRespuestaAuto": "Tiempo de llegada en emergencia"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "ambos",
          "label": "Taller y domicilio"
        },
        {
          "value": "unidad_movil",
          "label": "Unidad móvil"
        }
      ],
      "tiempoRespuestaAuto": [
        {
          "value": "emergencia_30min",
          "label": "Emergencia (~30 min)"
        },
        {
          "value": "1h",
          "label": "Dentro de 1 hora"
        },
        {
          "value": "2h",
          "label": "1–2 horas"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
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
      "serviciosGrua": [
        "Grúa local",
        "Grúa carretera",
        "Auxilio mecánico",
        "Paso de corriente",
        "Cambio de llanta",
        "Combustible",
        "Otro"
      ],
      "tiposVehiculoAtendidos": [
        "Sedán",
        "SUV",
        "Pick-up",
        "Camioneta",
        "Motocicleta",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "mecanicos-a-domicilio": {
    "canonSubcategoriaId": "mecanicos-a-domicilio",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Mecánicos a domicilio",
    "packLabel": "Mecánica y reparación",
    "blockTitle": "Mecánicos a domicilio",
    "blockHint": "Servicio a domicilio o en sitio — tiempos de respuesta y cobertura son clave.",
    "aliasPlaceholder": "Ej. Mecánico a domicilio · CDMX sur",
    "deltaFields": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "marcasAtendidas"
    ],
    "extraFields": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "tiempoRespuestaAuto",
      "anosExperienciaAuto",
      "diferenciadorAutomotriz",
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
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "coberturaGeografica",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaAuto"
    ],
    "textosAyuda": {
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "modalidadServicioAuto": "Domicilio, estacionamiento del cliente o empresa.",
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "modalidadServicioAuto": "¿Cómo llegas al cliente?",
      "tiempoRespuestaAuto": "¿En cuánto puedes llegar?",
      "coberturaGeografica": "¿Qué zona cubres?"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Taller y domicilio"
        }
      ],
      "tiempoRespuestaAuto": [
        {
          "value": "emergencia_30min",
          "label": "Emergencia (~30 min)"
        },
        {
          "value": "1h",
          "label": "Dentro de 1 hora"
        },
        {
          "value": "2h",
          "label": "1–2 horas"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaAuto": [
        {
          "value": "1_3",
          "label": "1–3 años"
        },
        {
          "value": "4_7",
          "label": "4–7 años"
        },
        {
          "value": "8_15",
          "label": "8–15 años"
        },
        {
          "value": "16_mas",
          "label": "16+ años"
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
      "serviciosMecanica": [
        "Diagnóstico en sitio",
        "Afinación",
        "Frenos",
        "Batería",
        "Cambio de aceite",
        "Arranque en sitio",
        "Otro"
      ],
      "especialidadesMecanica": [
        "Mecánica general",
        "Eléctrico básico",
        "Frenos",
        "Suspensión",
        "Otro"
      ],
      "marcasAtendidas": [
        "Multimarca",
        "Nissan",
        "VW",
        "Chevrolet",
        "Toyota",
        "Otro"
      ],
      "tiposVehiculoAtendidos": [
        "Sedán",
        "SUV",
        "Pick-up",
        "Camioneta",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "electromecanicos": {
    "canonSubcategoriaId": "electromecanicos",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Electromecánicos",
    "packLabel": "Mecánica y reparación",
    "blockTitle": "Electromecánicos",
    "blockHint": "Electricidad automotriz, diagnóstico y sistemas electrónicos — declara especialidades.",
    "aliasPlaceholder": "Ej. Electromecánico · Diagnóstico y CAN bus",
    "deltaFields": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "marcasAtendidas"
    ],
    "extraFields": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "tiempoRespuestaAuto",
      "anosExperienciaAuto",
      "diferenciadorAutomotriz",
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
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "coberturaGeografica",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosMecanica": "Servicios electromecánicos",
      "especialidadesMecanica": "Sistemas que atiendes"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "taller_fijo",
          "label": "Taller / local fijo"
        },
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Taller y domicilio"
        }
      ],
      "tiempoRespuestaAuto": [
        {
          "value": "emergencia_30min",
          "label": "Emergencia (~30 min)"
        },
        {
          "value": "1h",
          "label": "Dentro de 1 hora"
        },
        {
          "value": "2h",
          "label": "1–2 horas"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaAuto": [
        {
          "value": "1_3",
          "label": "1–3 años"
        },
        {
          "value": "4_7",
          "label": "4–7 años"
        },
        {
          "value": "8_15",
          "label": "8–15 años"
        },
        {
          "value": "16_mas",
          "label": "16+ años"
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
      "serviciosMecanica": [
        "Diagnóstico eléctrico",
        "Alternador / marcha",
        "Sensores",
        "Tablero / luces",
        "Inmovilizador",
        "Cableado",
        "Otro"
      ],
      "especialidadesMecanica": [
        "Sistema eléctrico",
        "Inyección electrónica",
        "CAN bus",
        "Alarmas OEM",
        "Híbridos",
        "Otro"
      ],
      "marcasAtendidas": [
        "Nissan",
        "VW",
        "Chevrolet",
        "Toyota",
        "Ford",
        "BMW",
        "Multimarca",
        "Otro"
      ],
      "tiposVehiculoAtendidos": [
        "Sedán",
        "SUV",
        "Pick-up",
        "Camioneta",
        "Moto",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "tecnicos-en-baterias": {
    "canonSubcategoriaId": "tecnicos-en-baterias",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Técnicos en baterías",
    "packLabel": "Refacciones y especialidades",
    "blockTitle": "Técnicos en baterías",
    "blockHint": "Baterías, arrancadores y pruebas — cobertura y tiempos de respuesta.",
    "aliasPlaceholder": "Ej. Baterías automotrices · Prueba y cambio",
    "deltaFields": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto"
    ],
    "extraFields": [
      "serviciosRefacciones",
      "serviciosEspecialidadAuto",
      "lineasRefacciones",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "diferenciadorAutomotriz",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
      "tiempoRespuestaAuto"
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
      "serviciosEspecialidadAuto",
      "modalidadServicioAuto",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaAuto",
      "coberturaGeografica"
    ],
    "textosAyuda": {
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosEspecialidadAuto": "Servicios de baterías",
      "tiempoRespuestaAuto": "Tiempo de llegada habitual"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Taller y domicilio"
        },
        {
          "value": "unidad_movil",
          "label": "Unidad móvil"
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
      "serviciosEspecialidadAuto": [
        "Cambio de batería",
        "Prueba de carga",
        "Arranque auxiliar",
        "Instalación",
        "Reciclaje",
        "Otro"
      ],
      "tiempoRespuestaAuto": [
        {
          "value": "emergencia_30min",
          "label": "Emergencia (~30 min)"
        },
        {
          "value": "1h",
          "label": "Dentro de 1 hora"
        },
        {
          "value": "2h",
          "label": "1–2 horas"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "tecnicos-en-a-c-automotriz": {
    "canonSubcategoriaId": "tecnicos-en-a-c-automotriz",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Técnicos en A/C automotriz",
    "packLabel": "Refacciones y especialidades",
    "blockTitle": "A/C automotriz",
    "blockHint": "Aire acondicionado automotriz — carga, diagnóstico y reparación.",
    "aliasPlaceholder": "Ej. A/C automotriz · Carga y diagnóstico",
    "deltaFields": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto"
    ],
    "extraFields": [
      "serviciosRefacciones",
      "serviciosEspecialidadAuto",
      "lineasRefacciones",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "diferenciadorAutomotriz",
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
      "serviciosEspecialidadAuto",
      "modalidadServicioAuto",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosEspecialidadAuto": "Servicios de A/C automotriz"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "taller_fijo",
          "label": "Taller / local fijo"
        },
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Taller y domicilio"
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
      "serviciosEspecialidadAuto": [
        "Carga de gas",
        "Diagnóstico de fugas",
        "Cambio de compresor",
        "Limpieza de evaporador",
        "Mantenimiento A/C",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "instaladores-de-audio-car-multimedia": {
    "canonSubcategoriaId": "instaladores-de-audio-car-multimedia",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Instaladores de audio / car multimedia",
    "packLabel": "Refacciones y especialidades",
    "blockTitle": "Audio / car multimedia",
    "blockHint": "Audio, pantallas, alarmas y multimedia — marcas y tipos de instalación.",
    "aliasPlaceholder": "Ej. Car audio · Pantallas y amplificadores",
    "deltaFields": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto"
    ],
    "extraFields": [
      "serviciosRefacciones",
      "serviciosEspecialidadAuto",
      "lineasRefacciones",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "diferenciadorAutomotriz",
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
      "serviciosEspecialidadAuto",
      "modalidadServicioAuto",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosEspecialidadAuto": "Instalaciones y equipos"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "taller_fijo",
          "label": "Taller / local fijo"
        },
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Taller y domicilio"
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
      "serviciosEspecialidadAuto": [
        "Estéreos / pantallas",
        "Amplificadores",
        "Bocinas",
        "Alarmas",
        "Cámaras de reversa",
        "Apple CarPlay / Android Auto",
        "Otro"
      ],
      "lineasRefacciones": [
        "Pioneer",
        "Kenwood",
        "Alpine",
        "JBL",
        "Sony",
        "Otro"
      ],
      "serviciosRefacciones": [
        "Venta de equipo",
        "Instalación",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "detallado-automotriz-premium": {
    "canonSubcategoriaId": "detallado-automotriz-premium",
    "deltaPack": "C",
    "formularioId": "persona_independiente",
    "nombre": "Detallado automotriz premium",
    "packLabel": "Carrocería y estética",
    "blockTitle": "Detallado automotriz premium",
    "blockHint": "Detailing premium, protección y acabados — diferenciador y garantías.",
    "aliasPlaceholder": "Ej. Detailing premium · Cerámico y PPF",
    "deltaFields": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto"
    ],
    "extraFields": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "diferenciadorAutomotriz",
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
      "modalidadServicioAuto",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "serviciosEsteticaAuto",
      "garantiaServicioAuto"
    ],
    "textosAyuda": {
      "diferenciadorAutomotriz": "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
      "coberturaGeografica": "Colonias, municipios, carreteras o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
      "modalidadServicioAuto": "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
      "serviciosMecanica": "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
      "especialidadesMecanica": "Motor, transmisión, electricidad, inyección, diesel…",
      "marcasAtendidas": "Marcas que conoces bien o atiendes con frecuencia.",
      "tiposVehiculoAtendidos": "Sedán, SUV, pick-up, moto, flotilla ligera…",
      "garantiaServicioAuto": "Ej. 30 días mano de obra · 90 días en refacciones",
      "tiempoRespuestaAuto": "Tiempo habitual de respuesta o llegada al cliente.",
      "serviciosLlantas": "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
      "serviciosCarroceria": "Hojalatería, pintura, enderezado, match de color…",
      "serviciosEsteticaAuto": "Lavado, encerado, detailing, protección cerámica…",
      "serviciosRefacciones": "Venta mostrador, pedidos especiales, entrega a domicilio…",
      "serviciosEspecialidadAuto": "A/C, baterías, audio, alarmas, electromecánica…",
      "serviciosVentaAutos": "Contado, consignación, permuta, entrega inmediata…",
      "serviciosGrua": "Grúa local, carretera, auxilio mecánico, batería, llanta…",
      "coberturaCarretera": "Autopistas, periféricos o radio de cobertura en km."
    },
    "fieldLabels": {
      "serviciosEsteticaAuto": "Servicios de detailing premium"
    },
    "fieldOptions": {
      "modalidadServicioAuto": [
        {
          "value": "taller_fijo",
          "label": "Taller / local fijo"
        },
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Taller y domicilio"
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
      "serviciosEsteticaAuto": [
        "Detailing completo",
        "Corrección de pintura",
        "Protección cerámica",
        "PPF / película",
        "Limpieza de tapicería",
        "Restauración de faros",
        "Otro"
      ],
      "serviciosCarroceria": [
        "Pulido profesional",
        "Otro"
      ],
      "tiposVehiculoAtendidos": [
        "Sedán",
        "SUV",
        "Pick-up",
        "Deportivo",
        "Clásico",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  }
};
})(typeof window !== 'undefined' ? window : globalThis);
