/**
 * AUTO-GENERADO — MP-TRANSPORTE-DELTAS-V1 (24 subs).
 * Regenerar: node scripts/generate-transporte-sub-deltas.mjs
 */
(function (global) {
  'use strict';
  global.CARIHUB_TRANSPORTE_SUB_CANON_META = {
  "chofer-privado": {
    "canonSubcategoriaId": "chofer-privado",
    "nombre": "Chofer Privado",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "conductor-ejecutivo": {
    "canonSubcategoriaId": "conductor-ejecutivo",
    "nombre": "Conductor Ejecutivo",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "mensajero": {
    "canonSubcategoriaId": "mensajero",
    "nombre": "Mensajero",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "repartidor-local": {
    "canonSubcategoriaId": "repartidor-local",
    "nombre": "Repartidor Local",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "flete-ligero": {
    "canonSubcategoriaId": "flete-ligero",
    "nombre": "Flete Ligero",
    "deltaPack": "C",
    "formularioId": "persona_independiente"
  },
  "mudanzas-pequenas": {
    "canonSubcategoriaId": "mudanzas-pequenas",
    "nombre": "Mudanzas Pequeñas",
    "deltaPack": "C",
    "formularioId": "negocio_empresa"
  },
  "operador-de-carga": {
    "canonSubcategoriaId": "operador-de-carga",
    "nombre": "Operador de Carga",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "motomensajero": {
    "canonSubcategoriaId": "motomensajero",
    "nombre": "Motomensajero",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "courier-independiente": {
    "canonSubcategoriaId": "courier-independiente",
    "nombre": "Courier Independiente",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "empresa-de-mensajeria": {
    "canonSubcategoriaId": "empresa-de-mensajeria",
    "nombre": "Empresa de Mensajería",
    "deltaPack": "E",
    "formularioId": "negocio_empresa"
  },
  "empresa-de-paqueteria": {
    "canonSubcategoriaId": "empresa-de-paqueteria",
    "nombre": "Empresa de Paquetería",
    "deltaPack": "E",
    "formularioId": "negocio_empresa"
  },
  "empresa-de-logistica": {
    "canonSubcategoriaId": "empresa-de-logistica",
    "nombre": "Empresa de Logística",
    "deltaPack": "E",
    "formularioId": "negocio_empresa"
  },
  "transporte-de-carga": {
    "canonSubcategoriaId": "transporte-de-carga",
    "nombre": "Transporte de Carga",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "transporte-refrigerado": {
    "canonSubcategoriaId": "transporte-refrigerado",
    "nombre": "Transporte Refrigerado",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "mudanzas": {
    "canonSubcategoriaId": "mudanzas",
    "nombre": "Mudanzas",
    "deltaPack": "C",
    "formularioId": "negocio_empresa"
  },
  "transporte-ejecutivo": {
    "canonSubcategoriaId": "transporte-ejecutivo",
    "nombre": "Transporte Ejecutivo",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "transporte-turistico": {
    "canonSubcategoriaId": "transporte-turistico",
    "nombre": "Transporte Turístico",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "transporte-escolar": {
    "canonSubcategoriaId": "transporte-escolar",
    "nombre": "Transporte Escolar",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "almacenes-y-bodegas": {
    "canonSubcategoriaId": "almacenes-y-bodegas",
    "nombre": "Almacenes y Bodegas",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "distribucion-de-mercancias": {
    "canonSubcategoriaId": "distribucion-de-mercancias",
    "nombre": "Distribución de Mercancías",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "ultima-milla": {
    "canonSubcategoriaId": "ultima-milla",
    "nombre": "Última Milla",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "logistica-internacional": {
    "canonSubcategoriaId": "logistica-internacional",
    "nombre": "Logística Internacional",
    "deltaPack": "F",
    "formularioId": "persona_independiente"
  },
  "renta-de-camionetas": {
    "canonSubcategoriaId": "renta-de-camionetas",
    "nombre": "Renta de Camionetas",
    "deltaPack": "F",
    "formularioId": "negocio_empresa"
  },
  "logistica-local": {
    "canonSubcategoriaId": "logistica-local",
    "nombre": "Logística Local",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  }
};
  global.CARIHUB_TRANSPORTE_SUB_DELTAS = {
  "chofer-privado": {
    "canonSubcategoriaId": "chofer-privado",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Chofer Privado",
    "packLabel": "Transporte de personas",
    "blockTitle": "Chofer privado",
    "blockHint": "Chofer privado — vehículo, modalidad y cobertura generan confianza.",
    "aliasPlaceholder": "Ej. Chofer privado · CDMX y zona sur",
    "deltaFields": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "tiposClientesTransporte",
      "tiempoRespuestaTransporte",
      "permisosLicencias",
      "diferenciadorTransporte",
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
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosTransportePersonas": "¿Qué servicios ofreces?",
      "tipoVehiculoPasajeros": "¿Con qué vehículo trabajas?"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosTransportePersonas": [
        "Traslados locales",
        "Eventos",
        "Aeropuerto",
        "Por horas",
        "Por día",
        "Otro"
      ],
      "tipoVehiculoPasajeros": [
        "Sedán",
        "SUV",
        "Van",
        "Pick-up",
        "Otro"
      ],
      "tiposClientesTransporte": [
        "Particulares",
        "Ejecutivos",
        "Familias",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "conductor-ejecutivo": {
    "canonSubcategoriaId": "conductor-ejecutivo",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Conductor Ejecutivo",
    "packLabel": "Transporte de personas",
    "blockTitle": "Conductor ejecutivo",
    "blockHint": "Conductor ejecutivo — discreción, vehículo y tipos de cliente son clave.",
    "aliasPlaceholder": "Ej. Conductor ejecutivo · Bilingüe",
    "deltaFields": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "tiposClientesTransporte",
      "tiempoRespuestaTransporte",
      "permisosLicencias",
      "diferenciadorTransporte",
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
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "tiposClientesTransporte": "¿A quién atiendes?",
      "permisosLicencias": "Licencias y certificaciones"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosTransportePersonas": [
        "Ejecutivo",
        "Corporativo",
        "Aeropuerto VIP",
        "Eventos",
        "Por horas",
        "Otro"
      ],
      "tipoVehiculoPasajeros": [
        "Sedán premium",
        "SUV premium",
        "Van ejecutiva",
        "Otro"
      ],
      "tiposClientesTransporte": [
        "Ejecutivos",
        "Corporativo",
        "Diplomático",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "mensajero": {
    "canonSubcategoriaId": "mensajero",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Mensajero",
    "packLabel": "Mensajería y última milla",
    "blockTitle": "Mensajero",
    "blockHint": "Mensajería local — tiempos de respuesta y tipos de envío definen tu servicio.",
    "aliasPlaceholder": "Ej. Mensajero · Same day CDMX",
    "deltaFields": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
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
      "serviciosMensajeria",
      "tiposEnvio",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tiempoRespuestaTransporte",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosMensajeria": "¿Qué entregas?",
      "tiposEnvio": "Tipos de paquete"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosMensajeria": [
        "Documentos",
        "Paquetes pequeños",
        "Recolección",
        "Entrega programada",
        "Otro"
      ],
      "tiposEnvio": [
        "Urgente",
        "Same day",
        "Programado",
        "Sobre",
        "Caja pequeña",
        "Otro"
      ],
      "tipoVehiculoMensajeria": [
        "Auto",
        "Moto",
        "Bicicleta",
        "A pie",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "repartidor-local": {
    "canonSubcategoriaId": "repartidor-local",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Repartidor Local",
    "packLabel": "Mensajería y última milla",
    "blockTitle": "Repartidor local",
    "blockHint": "Reparto local — cobertura, vehículo y horarios de entrega.",
    "aliasPlaceholder": "Ej. Repartidor local · Zona norte",
    "deltaFields": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
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
      "serviciosMensajeria",
      "tiposEnvio",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tiempoRespuestaTransporte",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosMensajeria": "Servicios de reparto",
      "tipoVehiculoMensajeria": "Vehículo de reparto"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosMensajeria": [
        "Reparto local",
        "Recolección",
        "Entrega nocturna",
        "Otro"
      ],
      "tiposEnvio": [
        "Alimentos",
        "Retail",
        "Farmacia",
        "Paquetería",
        "Otro"
      ],
      "tipoVehiculoMensajeria": [
        "Moto",
        "Auto",
        "Bicicleta",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "flete-ligero": {
    "canonSubcategoriaId": "flete-ligero",
    "deltaPack": "C",
    "formularioId": "persona_independiente",
    "nombre": "Flete Ligero",
    "packLabel": "Fletes y mudanzas",
    "blockTitle": "Flete ligero",
    "blockHint": "Flete ligero — capacidad, tipos de mercancía y cobertura local.",
    "aliasPlaceholder": "Ej. Flete ligero · Pick-up 1.5 ton",
    "deltaFields": [
      "serviciosFleteMudanza",
      "capacidadCarga",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosFleteMudanza",
      "capacidadCarga",
      "tiposMercancia",
      "modalidadServicioTransporte",
      "incluyePersonalCarga",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
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
      "serviciosFleteMudanza",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosFleteMudanza": "Servicios de flete",
      "capacidadCarga": "Capacidad del vehículo"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        }
      ],
      "incluyePersonalCarga": [
        {
          "value": "si",
          "label": "Sí, incluido"
        },
        {
          "value": "no",
          "label": "No incluido"
        },
        {
          "value": "opcional",
          "label": "Opcional con costo extra"
        },
        {
          "value": "convenir",
          "label": "A convenir"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosFleteMudanza": [
        "Flete local",
        "Recolección",
        "Entrega punto a punto",
        "Otro"
      ],
      "tiposMercancia": [
        "Muebles",
        "Electrodomésticos",
        "Cajas",
        "Mercancía general",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "mudanzas-pequenas": {
    "canonSubcategoriaId": "mudanzas-pequenas",
    "deltaPack": "C",
    "formularioId": "negocio_empresa",
    "nombre": "Mudanzas Pequeñas",
    "packLabel": "Fletes y mudanzas",
    "blockTitle": "Mudanzas pequeñas",
    "blockHint": "Mudanzas pequeñas — servicios, personal de carga y cobertura.",
    "aliasPlaceholder": "Ej. Flete ligero · Pick-up 1.5 ton",
    "deltaFields": [
      "serviciosFleteMudanza",
      "capacidadCarga",
      "incluyePersonalCarga",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosFleteMudanza",
      "capacidadCarga",
      "tiposMercancia",
      "modalidadServicioTransporte",
      "incluyePersonalCarga",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
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
      "nombreComercial",
      "serviciosFleteMudanza",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "direccion",
      "horarioDetalle",
      "geo",
      "coberturaGeografica"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosFleteMudanza": "Paquetes de mudanza",
      "incluyePersonalCarga": "¿Incluyes ayudantes?"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        }
      ],
      "incluyePersonalCarga": [
        {
          "value": "si",
          "label": "Sí, incluido"
        },
        {
          "value": "no",
          "label": "No incluido"
        },
        {
          "value": "opcional",
          "label": "Opcional con costo extra"
        },
        {
          "value": "convenir",
          "label": "A convenir"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosFleteMudanza": [
        "Mudanza depto",
        "Mudanza casa",
        "Embalaje",
        "Desmontaje",
        "Otro"
      ],
      "tiposMercancia": [
        "Muebles",
        "Electrodomésticos",
        "Oficina",
        "Otro"
      ]
    },
    "negocioLocal": true,
    "personaIndependiente": false
  },
  "operador-de-carga": {
    "canonSubcategoriaId": "operador-de-carga",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Operador de Carga",
    "packLabel": "Carga y logística operativa",
    "blockTitle": "Operador de carga",
    "blockHint": "Operador de carga — rutas, tipos de carga y permisos.",
    "aliasPlaceholder": "Ej. Operador de carga · Rutas regionales",
    "deltaFields": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga"
    ],
    "extraFields": [
      "serviciosLogistica",
      "tiposCarga",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
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
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosLogistica": "Operación de carga",
      "tiposCarga": "Tipos de carga que manejas"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
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
      "serviciosLogistica": [
        "Carga consolidada",
        "Rutas dedicadas",
        "Cross-dock",
        "Otro"
      ],
      "tiposCarga": [
        "General",
        "Seca",
        "Palletizada",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "motomensajero": {
    "canonSubcategoriaId": "motomensajero",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Motomensajero",
    "packLabel": "Mensajería y última milla",
    "blockTitle": "Motomensajero",
    "blockHint": "Motomensajería — rapidez en tráfico urbano y tipos de envío.",
    "aliasPlaceholder": "Ej. Motomensajero · Tráfico urbano",
    "deltaFields": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
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
      "serviciosMensajeria",
      "tiposEnvio",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tiempoRespuestaTransporte",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "tipoVehiculoMensajeria": "Motocicleta / scooter",
      "tiempoRespuestaTransporte": "Tiempo de recolección"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosMensajeria": [
        "Urgente",
        "Documentos",
        "Paquetes",
        "Recolección",
        "Otro"
      ],
      "tiposEnvio": [
        "Urgente",
        "Same day",
        "Sobre",
        "Caja pequeña",
        "Otro"
      ],
      "tipoVehiculoMensajeria": [
        "Moto",
        "Scooter",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "courier-independiente": {
    "canonSubcategoriaId": "courier-independiente",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Courier Independiente",
    "packLabel": "Mensajería y última milla",
    "blockTitle": "Courier independiente",
    "blockHint": "Courier independiente — same-day, documentos o paquetería especializada.",
    "aliasPlaceholder": "Ej. Courier · Documentos y paquetería",
    "deltaFields": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
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
      "serviciosMensajeria",
      "tiposEnvio",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tiempoRespuestaTransporte",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosMensajeria": "Servicios courier",
      "tiposEnvio": "Especialidad de envíos"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosMensajeria": [
        "Courier express",
        "Documentos legales",
        "Paquetería",
        "Otro"
      ],
      "tiposEnvio": [
        "Express",
        "Same day",
        "Internacional ligero",
        "Otro"
      ],
      "tipoVehiculoMensajeria": [
        "Auto",
        "Moto",
        "Van",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "empresa-de-mensajeria": {
    "canonSubcategoriaId": "empresa-de-mensajeria",
    "deltaPack": "E",
    "formularioId": "negocio_empresa",
    "nombre": "Empresa de Mensajería",
    "packLabel": "Empresa de transporte",
    "blockTitle": "Empresa de mensajería",
    "blockHint": "Empresa de mensajería — flota, cobertura y tipos de envío.",
    "aliasPlaceholder": "Ej. Mensajería corporativa · Flotilla propia",
    "deltaFields": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada"
    ],
    "extraFields": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "tamanoClienteTransporte",
      "flotaAproximada",
      "modalidadServicioTransporte",
      "diferenciadorTransporte",
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
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada",
      "direccion",
      "horarioDetalle",
      "geo",
      "modalidadServicioTransporte"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "flotaAproximada": "Ej. 5–20 unidades en operación",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosEmpresaTransporte": "Servicios de mensajería",
      "flotaAproximada": "Unidades en operación"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
        },
        {
          "value": "internacional",
          "label": "Internacional"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tamanoClienteTransporte": [
        "PyME",
        "Mediana",
        "Corporativo",
        "E-commerce",
        "Gobierno",
        "Otro"
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
      "serviciosEmpresaTransporte": [
        "Mensajería local",
        "Same day",
        "Recolección",
        "Rastreo",
        "Otro"
      ],
      "especialidadesEmpresaTransporte": "Mensajería corporativa, legal, e-commerce…"
    },
    "negocioLocal": true,
    "personaIndependiente": false
  },
  "empresa-de-paqueteria": {
    "canonSubcategoriaId": "empresa-de-paqueteria",
    "deltaPack": "E",
    "formularioId": "negocio_empresa",
    "nombre": "Empresa de Paquetería",
    "packLabel": "Empresa de transporte",
    "blockTitle": "Empresa de paquetería",
    "blockHint": "Empresa de paquetería — cobertura, SLA y especialidades.",
    "aliasPlaceholder": "Ej. Mensajería corporativa · Flotilla propia",
    "deltaFields": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada"
    ],
    "extraFields": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "tamanoClienteTransporte",
      "flotaAproximada",
      "modalidadServicioTransporte",
      "diferenciadorTransporte",
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
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada",
      "direccion",
      "horarioDetalle",
      "geo",
      "modalidadServicioTransporte"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "flotaAproximada": "Ej. 5–20 unidades en operación",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "especialidadesEmpresaTransporte": "Especialidades de paquetería"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
        },
        {
          "value": "internacional",
          "label": "Internacional"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tamanoClienteTransporte": [
        "PyME",
        "Mediana",
        "Corporativo",
        "E-commerce",
        "Gobierno",
        "Otro"
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
      "serviciosEmpresaTransporte": [
        "Paquetería local",
        "Nacional",
        "Recolección",
        "Entrega programada",
        "Otro"
      ],
      "especialidadesEmpresaTransporte": "Paquetería B2B, e-commerce, frágil…"
    },
    "negocioLocal": true,
    "personaIndependiente": false
  },
  "empresa-de-logistica": {
    "canonSubcategoriaId": "empresa-de-logistica",
    "deltaPack": "E",
    "formularioId": "negocio_empresa",
    "nombre": "Empresa de Logística",
    "packLabel": "Empresa de transporte",
    "blockTitle": "Empresa de logística",
    "blockHint": "Empresa de logística — servicios integrados y tamaño de cliente.",
    "aliasPlaceholder": "Ej. Mensajería corporativa · Flotilla propia",
    "deltaFields": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada"
    ],
    "extraFields": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "tamanoClienteTransporte",
      "flotaAproximada",
      "modalidadServicioTransporte",
      "diferenciadorTransporte",
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
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada",
      "direccion",
      "horarioDetalle",
      "geo",
      "modalidadServicioTransporte"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "flotaAproximada": "Ej. 5–20 unidades en operación",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosEmpresaTransporte": "Servicios logísticos",
      "tamanoClienteTransporte": "Clientes atendidos"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
        },
        {
          "value": "internacional",
          "label": "Internacional"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tamanoClienteTransporte": [
        "PyME",
        "Mediana",
        "Corporativo",
        "E-commerce",
        "Gobierno",
        "Otro"
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
      "serviciosEmpresaTransporte": [
        "3PL",
        "Distribución",
        "Almacenaje",
        "Fulfillment",
        "Otro"
      ],
      "especialidadesEmpresaTransporte": "Logística integrada, cadena de suministro…"
    },
    "negocioLocal": true,
    "personaIndependiente": false
  },
  "transporte-de-carga": {
    "canonSubcategoriaId": "transporte-de-carga",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Transporte de Carga",
    "packLabel": "Carga y logística operativa",
    "blockTitle": "Transporte de carga",
    "blockHint": "Transporte de carga — capacidad, rutas y tipos de mercancía.",
    "aliasPlaceholder": "Ej. Carga · 3.5 ton regional",
    "deltaFields": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga"
    ],
    "extraFields": [
      "serviciosLogistica",
      "tiposCarga",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
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
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "tiposCarga": "Tipos de carga",
      "coberturaRutas": "Rutas frecuentes"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
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
      "serviciosLogistica": [
        "Carga completa",
        "Consolidada",
        "Rutas fijas",
        "Otro"
      ],
      "tiposCarga": [
        "General",
        "Seca",
        "Construcción",
        "Industrial",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "transporte-refrigerado": {
    "canonSubcategoriaId": "transporte-refrigerado",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Transporte Refrigerado",
    "packLabel": "Carga y logística operativa",
    "blockTitle": "Transporte refrigerado",
    "blockHint": "Carga refrigerada — temperatura, permisos y tipos de producto.",
    "aliasPlaceholder": "Ej. Refrigerado · Cadena de frío",
    "deltaFields": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga"
    ],
    "extraFields": [
      "serviciosLogistica",
      "tiposCarga",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
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
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "capacidadCarga",
      "permisosLicencias"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "tiposCarga": "Productos refrigerados",
      "capacidadCarga": "Capacidad y temperatura"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
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
      "serviciosLogistica": [
        "Refrigerado",
        "Congelado",
        "Cadena de frío",
        "Otro"
      ],
      "tiposCarga": [
        "Alimentos",
        "Farmacéutico",
        "Flores",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "mudanzas": {
    "canonSubcategoriaId": "mudanzas",
    "deltaPack": "C",
    "formularioId": "negocio_empresa",
    "nombre": "Mudanzas",
    "packLabel": "Fletes y mudanzas",
    "blockTitle": "Mudanzas",
    "blockHint": "Empresa de mudanzas — flota, embalaje y cobertura intermunicipal.",
    "aliasPlaceholder": "Ej. Flete ligero · Pick-up 1.5 ton",
    "deltaFields": [
      "serviciosFleteMudanza",
      "flotaAproximada",
      "incluyePersonalCarga",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosFleteMudanza",
      "capacidadCarga",
      "incluyePersonalCarga",
      "modalidadServicioTransporte",
      "flotaAproximada",
      "especialidadesEmpresaTransporte",
      "diferenciadorTransporte",
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
      "serviciosFleteMudanza",
      "flotaAproximada",
      "modalidadServicioTransporte",
      "direccion",
      "horarioDetalle",
      "geo",
      "especialidadesEmpresaTransporte"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "flotaAproximada": "Ej. 5–20 unidades en operación",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "flotaAproximada": "Unidades disponibles",
      "serviciosFleteMudanza": "Servicios de mudanza"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
        },
        {
          "value": "internacional",
          "label": "Internacional"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tamanoClienteTransporte": [
        "PyME",
        "Mediana",
        "Corporativo",
        "E-commerce",
        "Gobierno",
        "Otro"
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
      "serviciosFleteMudanza": [
        "Mudanza local",
        "Interestatal",
        "Embalaje",
        "Guardamuebles",
        "Otro"
      ],
      "incluyePersonalCarga": [
        {
          "value": "si",
          "label": "Sí, incluido"
        },
        {
          "value": "no",
          "label": "No incluido"
        },
        {
          "value": "opcional",
          "label": "Opcional con costo extra"
        },
        {
          "value": "convenir",
          "label": "A convenir"
        }
      ],
      "especialidadesEmpresaTransporte": "Mudanzas residenciales, corporativas, internacionales…"
    },
    "negocioLocal": true,
    "personaIndependiente": false
  },
  "transporte-ejecutivo": {
    "canonSubcategoriaId": "transporte-ejecutivo",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Transporte Ejecutivo",
    "packLabel": "Transporte de personas",
    "blockTitle": "Transporte ejecutivo",
    "blockHint": "Transporte ejecutivo corporativo — flota, SLA y cobertura metropolitana.",
    "aliasPlaceholder": "Ej. Transporte ejecutivo · Flotilla premium",
    "deltaFields": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "tiposClientesTransporte",
      "tiempoRespuestaTransporte",
      "permisosLicencias",
      "diferenciadorTransporte",
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
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosTransportePersonas": "Servicios ejecutivos",
      "tiposClientesTransporte": "Segmentos atendidos"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosTransportePersonas": [
        "Corporativo",
        "Eventos",
        "Roadshow",
        "Aeropuerto",
        "Otro"
      ],
      "tipoVehiculoPasajeros": [
        "Sedán",
        "SUV",
        "Van",
        "Sprinter",
        "Otro"
      ],
      "tiposClientesTransporte": [
        "Corporativo",
        "Agencias",
        "Eventos",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "transporte-turistico": {
    "canonSubcategoriaId": "transporte-turistico",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Transporte Turístico",
    "packLabel": "Transporte de personas",
    "blockTitle": "Transporte turístico",
    "blockHint": "Transporte turístico — rutas, tipos de tour y capacidad del vehículo.",
    "aliasPlaceholder": "Ej. Transporte turístico · Tours y traslados",
    "deltaFields": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "tiposClientesTransporte",
      "tiempoRespuestaTransporte",
      "permisosLicencias",
      "diferenciadorTransporte",
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
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosTransportePersonas": "Servicios turísticos",
      "coberturaGeografica": "Destinos o rutas"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosTransportePersonas": [
        "City tour",
        "Traslados hotel",
        "Excursiones",
        "Grupos",
        "Otro"
      ],
      "tipoVehiculoPasajeros": [
        "Van",
        "Microbús",
        "Sprinter",
        "SUV",
        "Otro"
      ],
      "tiposClientesTransporte": [
        "Turistas",
        "Agencias",
        "Hoteles",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "transporte-escolar": {
    "canonSubcategoriaId": "transporte-escolar",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Transporte Escolar",
    "packLabel": "Transporte de personas",
    "blockTitle": "Transporte escolar",
    "blockHint": "Transporte escolar — permisos, rutas fijas y seguridad son prioritarios.",
    "aliasPlaceholder": "Ej. Transporte escolar · Rutas fijas",
    "deltaFields": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "tiposClientesTransporte",
      "tiempoRespuestaTransporte",
      "permisosLicencias",
      "diferenciadorTransporte",
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
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
      "permisosLicencias"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "permisosLicencias": "Permisos escolares / SCT",
      "modalidadServicioTransporte": "¿Rutas fijas o bajo demanda?"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosTransportePersonas": [
        "Ruta escolar",
        "Transporte colegio",
        "Actividades",
        "Otro"
      ],
      "tipoVehiculoPasajeros": [
        "Van escolar",
        "Microbús",
        "Combis",
        "Otro"
      ],
      "tiposClientesTransporte": [
        "Colegios",
        "Guarderías",
        "Familias",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "almacenes-y-bodegas": {
    "canonSubcategoriaId": "almacenes-y-bodegas",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Almacenes y Bodegas",
    "packLabel": "Carga y logística operativa",
    "blockTitle": "Almacenes y bodegas",
    "blockHint": "Almacenaje y bodegas — servicios logísticos y cobertura.",
    "aliasPlaceholder": "Ej. Bodega · Almacenaje y cross-dock",
    "deltaFields": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga"
    ],
    "extraFields": [
      "serviciosLogistica",
      "tiposCarga",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
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
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosLogistica": "Servicios de almacén",
      "coberturaGeografica": "Ubicación / zonas atendidas"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
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
      "serviciosLogistica": [
        "Almacenaje",
        "Cross-dock",
        "Inventario",
        "Picking",
        "Otro"
      ],
      "tiposCarga": [
        "General",
        "Retail",
        "E-commerce",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "distribucion-de-mercancias": {
    "canonSubcategoriaId": "distribucion-de-mercancias",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Distribución de Mercancías",
    "packLabel": "Carga y logística operativa",
    "blockTitle": "Distribución de mercancías",
    "blockHint": "Distribución de mercancías — rutas, clientes y tipos de producto.",
    "aliasPlaceholder": "Ej. Distribución · Rutas B2B",
    "deltaFields": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga"
    ],
    "extraFields": [
      "serviciosLogistica",
      "tiposCarga",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
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
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosLogistica": "Servicios de distribución",
      "coberturaRutas": "Rutas de distribución"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
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
      "serviciosLogistica": [
        "Distribución local",
        "Rutas fijas",
        "Entrega programada",
        "Otro"
      ],
      "tiposCarga": [
        "Retail",
        "Industrial",
        "Consumo",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "ultima-milla": {
    "canonSubcategoriaId": "ultima-milla",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Última Milla",
    "packLabel": "Mensajería y última milla",
    "blockTitle": "Última milla",
    "blockHint": "Última milla — integración con e-commerce y ventanas de entrega.",
    "aliasPlaceholder": "Ej. Última milla · E-commerce",
    "deltaFields": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
      "tiposClientesTransporte"
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
      "serviciosMensajeria",
      "tiposEnvio",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tiempoRespuestaTransporte",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosMensajeria": "Servicios de última milla",
      "tiposClientesTransporte": "Clientes (e-commerce, retail…)"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tiempoRespuestaTransporte": [
        {
          "value": "inmediato_30min",
          "label": "Inmediato (~30 min)"
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
          "value": "programado",
          "label": "Programado / con cita"
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
      "serviciosMensajeria": [
        "Entrega e-commerce",
        "Recolección",
        "Devoluciones",
        "Rutas fijas",
        "Otro"
      ],
      "tiposEnvio": [
        "Paquetería",
        "Retail",
        "Alimentos",
        "Farmacia",
        "Otro"
      ],
      "tipoVehiculoMensajeria": [
        "Moto",
        "Auto",
        "Van",
        "Otro"
      ],
      "tiposClientesTransporte": [
        "E-commerce",
        "Retail",
        "Marketplaces",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "logistica-internacional": {
    "canonSubcategoriaId": "logistica-internacional",
    "deltaPack": "F",
    "formularioId": "persona_independiente",
    "nombre": "Logística Internacional",
    "packLabel": "Especialidades",
    "blockTitle": "Logística internacional",
    "blockHint": "Logística internacional — aduanas, corredores y tipos de carga.",
    "aliasPlaceholder": "Ej. Logística internacional · Aduanas USA",
    "deltaFields": [
      "serviciosEspecialidadTransporte",
      "modalidadServicioTransporte",
      "coberturaInternacional"
    ],
    "extraFields": [
      "serviciosEspecialidadTransporte",
      "modalidadServicioTransporte",
      "coberturaInternacional",
      "tiposVehiculoRenta",
      "capacidadCarga",
      "permisosLicencias",
      "diferenciadorTransporte",
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
      "serviciosEspecialidadTransporte",
      "modalidadServicioTransporte",
      "coberturaInternacional",
      "permisosLicencias",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "coberturaInternacional": "Países / aduanas",
      "serviciosEspecialidadTransporte": "Servicios internacionales"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
        },
        {
          "value": "internacional",
          "label": "Internacional"
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
      "serviciosEspecialidadTransporte": [
        "Importación",
        "Exportación",
        "Aduanas",
        "Consolidado",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "renta-de-camionetas": {
    "canonSubcategoriaId": "renta-de-camionetas",
    "deltaPack": "F",
    "formularioId": "negocio_empresa",
    "nombre": "Renta de Camionetas",
    "packLabel": "Especialidades",
    "blockTitle": "Renta de camionetas",
    "blockHint": "Renta de camionetas — flota, modalidad y tipos de unidad.",
    "aliasPlaceholder": "Ej. Logística internacional · Aduanas",
    "deltaFields": [
      "tiposVehiculoRenta",
      "serviciosEspecialidadTransporte",
      "flotaAproximada",
      "modalidadServicioTransporte"
    ],
    "extraFields": [
      "tiposVehiculoRenta",
      "serviciosEspecialidadTransporte",
      "modalidadServicioTransporte",
      "flotaAproximada",
      "diferenciadorTransporte",
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
      "tiposVehiculoRenta",
      "serviciosEspecialidadTransporte",
      "flotaAproximada",
      "modalidadServicioTransporte",
      "direccion",
      "horarioDetalle",
      "geo"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "flotaAproximada": "Ej. 5–20 unidades en operación",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "tiposVehiculoRenta": "Unidades en renta",
      "serviciosEspecialidadTransporte": "Servicios de renta"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
        },
        {
          "value": "internacional",
          "label": "Internacional"
        },
        {
          "value": "bajo_demanda",
          "label": "Bajo demanda / app"
        }
      ],
      "tamanoClienteTransporte": [
        "PyME",
        "Mediana",
        "Corporativo",
        "E-commerce",
        "Gobierno",
        "Otro"
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
      "tiposVehiculoRenta": [
        "Pick-up",
        "Van",
        "Camioneta 3.5 ton",
        "Caja seca",
        "Refrigerada",
        "Otro"
      ],
      "serviciosEspecialidadTransporte": [
        "Renta con chofer",
        "Renta sin chofer",
        "Por día",
        "Por mes",
        "Otro"
      ]
    },
    "negocioLocal": true,
    "personaIndependiente": false
  },
  "logistica-local": {
    "canonSubcategoriaId": "logistica-local",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Logística Local",
    "packLabel": "Carga y logística operativa",
    "blockTitle": "Logística local",
    "blockHint": "Logística local — última milla B2B, rutas y almacenaje.",
    "aliasPlaceholder": "Ej. Logística local · Última milla B2B",
    "deltaFields": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga"
    ],
    "extraFields": [
      "serviciosLogistica",
      "tiposCarga",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
      "tamanoClienteTransporte"
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
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorTransporte": "Ej. Disponible 24 h · Flotilla propia · Seguro incluido",
      "coberturaGeografica": "Colonias, municipios, rutas fijas o cobertura metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con e-commerce, flotillas, aseguradoras o plataformas?",
      "modalidadServicioTransporte": "Local, metropolitano, regional, nacional o bajo demanda — nunca hotel ni modalidad escort.",
      "tiempoRespuestaTransporte": "Tiempo habitual de respuesta o llegada al punto de recolección.",
      "permisosLicencias": "Licencia federal, SCT, permisos escolares o turísticos si aplican.",
      "capacidadCarga": "Ej. 1.5 ton · 3.5 ton · caja seca · refrigerada",
      "serviciosTransportePersonas": "Traslados, ejecutivo, turismo, escolar, eventos…",
      "serviciosMensajeria": "Paquetería, documentos, same-day, recolección programada…",
      "serviciosFleteMudanza": "Flete local, mudanza casa/depto, embalaje, maniobras…",
      "serviciosLogistica": "Distribución, cross-dock, almacenaje, rutas dedicadas…",
      "serviciosEmpresaTransporte": "Servicios principales que ofrece tu empresa.",
      "serviciosEspecialidadTransporte": "Import/export, renta con chofer, rutas internacionales…"
    },
    "fieldLabels": {
      "serviciosLogistica": "Servicios logísticos locales",
      "tamanoClienteTransporte": "Tamaño de clientes"
    },
    "fieldOptions": {
      "modalidadServicioTransporte": [
        {
          "value": "local_ciudad",
          "label": "Local / ciudad"
        },
        {
          "value": "metropolitana",
          "label": "Zona metropolitana"
        },
        {
          "value": "regional",
          "label": "Regional / estatal"
        },
        {
          "value": "nacional",
          "label": "Nacional"
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
      "serviciosLogistica": [
        "Distribución",
        "Almacenaje",
        "Fulfillment",
        "Rutas dedicadas",
        "Otro"
      ],
      "tiposCarga": [
        "E-commerce",
        "Retail",
        "Industrial",
        "Otro"
      ],
      "tamanoClienteTransporte": [
        "PyME",
        "Mediana",
        "Corporativo",
        "E-commerce",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  }
};
})(typeof window !== 'undefined' ? window : globalThis);
