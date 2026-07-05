/**
 * AUTO-GENERADO — MP-HOGAR-DELTAS-V1 (17 subs).
 * Regenerar: node scripts/generate-hogar-sub-deltas.mjs
 */
(function (global) {
  'use strict';
  global.CARIHUB_HOGAR_SUB_CANON_META = {
  "plomeros": {
    "canonSubcategoriaId": "plomeros",
    "nombre": "Plomeros",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "electricistas": {
    "canonSubcategoriaId": "electricistas",
    "nombre": "Electricistas",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "pintores": {
    "canonSubcategoriaId": "pintores",
    "nombre": "Pintores",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "albaniles": {
    "canonSubcategoriaId": "albaniles",
    "nombre": "Albañiles",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "carpinteros": {
    "canonSubcategoriaId": "carpinteros",
    "nombre": "Carpinteros",
    "deltaPack": "C",
    "formularioId": "persona_independiente"
  },
  "herreros": {
    "canonSubcategoriaId": "herreros",
    "nombre": "Herreros",
    "deltaPack": "C",
    "formularioId": "persona_independiente"
  },
  "jardineria": {
    "canonSubcategoriaId": "jardineria",
    "nombre": "Jardinería",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "fumigacion": {
    "canonSubcategoriaId": "fumigacion",
    "nombre": "Fumigación",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "limpieza-del-hogar": {
    "canonSubcategoriaId": "limpieza-del-hogar",
    "nombre": "Limpieza del Hogar",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "mantenimiento-general": {
    "canonSubcategoriaId": "mantenimiento-general",
    "nombre": "Mantenimiento General",
    "deltaPack": "D",
    "formularioId": "persona_independiente"
  },
  "tecnicos-en-clima-hvac": {
    "canonSubcategoriaId": "tecnicos-en-clima-hvac",
    "nombre": "Técnicos en clima / HVAC",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "impermeabilizadores": {
    "canonSubcategoriaId": "impermeabilizadores",
    "nombre": "Impermeabilizadores",
    "deltaPack": "A",
    "formularioId": "persona_independiente"
  },
  "instaladores-de-paneles-solares": {
    "canonSubcategoriaId": "instaladores-de-paneles-solares",
    "nombre": "Instaladores de paneles solares",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "tecnicos-en-camaras-de-seguridad": {
    "canonSubcategoriaId": "tecnicos-en-camaras-de-seguridad",
    "nombre": "Técnicos en cámaras de seguridad",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  },
  "instaladores-de-pisos": {
    "canonSubcategoriaId": "instaladores-de-pisos",
    "nombre": "Instaladores de pisos",
    "deltaPack": "C",
    "formularioId": "persona_independiente"
  },
  "cerrajeros": {
    "canonSubcategoriaId": "cerrajeros",
    "nombre": "Cerrajeros",
    "deltaPack": "C",
    "formularioId": "persona_independiente"
  },
  "domotica-casa-inteligente": {
    "canonSubcategoriaId": "domotica-casa-inteligente",
    "nombre": "Domótica / casa inteligente",
    "deltaPack": "B",
    "formularioId": "persona_independiente"
  }
};
  global.CARIHUB_HOGAR_SUB_DELTAS = {
  "plomeros": {
    "canonSubcategoriaId": "plomeros",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Plomeros",
    "packLabel": "Obra húmeda y albañilería",
    "blockTitle": "Plomeros",
    "blockHint": "Plomería — urgencias, tipos de trabajo y cobertura generan confianza.",
    "aliasPlaceholder": "Ej. Plomero · Urgencias CDMX sur",
    "deltaFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tiempoRespuestaHogar",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "serviciosHogar": "¿Qué servicios de plomería ofreces?",
      "tiempoRespuestaHogar": "¿Atiendes urgencias?"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Fugas",
        "Instalación",
        "Destape",
        "Calentador",
        "Regaderas",
        "Mantenimiento",
        "Otro"
      ],
      "especialidadesHogar": [
        "Residencial",
        "Comercial",
        "Urgencias",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "electricistas": {
    "canonSubcategoriaId": "electricistas",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Electricistas",
    "packLabel": "Electricidad y tecnología hogar",
    "blockTitle": "Electricistas",
    "blockHint": "Electricidad residencial — servicios, especialidades y tiempos de respuesta.",
    "aliasPlaceholder": "Ej. Electricista · Instalaciones residenciales",
    "deltaFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "serviciosHogar": "Servicios eléctricos",
      "especialidadesHogar": "Especialidades"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Instalación",
        "Reparación",
        "Tablero",
        "Iluminación",
        "Contactos",
        "Urgencias",
        "Otro"
      ],
      "especialidadesHogar": [
        "Residencial",
        "Comercial",
        "Industrial ligero",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "pintores": {
    "canonSubcategoriaId": "pintores",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Pintores",
    "packLabel": "Acabados, jardín y mantenimiento",
    "blockTitle": "Pintores",
    "blockHint": "Pintura — interiores, exteriores, acabados y preparación.",
    "aliasPlaceholder": "Ej. Pintor · Interiores y exteriores",
    "deltaFields": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
      "tiposTrabajoHogar"
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "tiposTrabajoHogar": "Tipos de pintura"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Interiores",
        "Exteriores",
        "Estuco",
        "Impermeabilizante",
        "Otro"
      ],
      "tiposTrabajoHogar": [
        "Habitaciones",
        "Fachada",
        "Comercial",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "albaniles": {
    "canonSubcategoriaId": "albaniles",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Albañiles",
    "packLabel": "Obra húmeda y albañilería",
    "blockTitle": "Albañiles",
    "blockHint": "Albañilería — tipos de obra, materiales y garantía del trabajo.",
    "aliasPlaceholder": "Ej. Albañil · Obra menor y remodelación",
    "deltaFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
      "tiposTrabajoHogar"
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tiempoRespuestaHogar",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "tiposTrabajoHogar": "¿Qué trabajos de albañilería haces?"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Obra menor",
        "Remodelación",
        "Ampliación",
        "Reparación",
        "Otro"
      ],
      "tiposTrabajoHogar": [
        "Muros",
        "Losas",
        "Aplanados",
        "Demolición",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "carpinteros": {
    "canonSubcategoriaId": "carpinteros",
    "deltaPack": "C",
    "formularioId": "persona_independiente",
    "nombre": "Carpinteros",
    "packLabel": "Carpintería, herrería e instalaciones",
    "blockTitle": "Carpinteros",
    "blockHint": "Carpintería — muebles, closets, reparaciones y acabados.",
    "aliasPlaceholder": "Ej. Carpintero · Muebles a medida",
    "deltaFields": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar",
      "materialesIncluidos"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
      "tiposTrabajoHogar"
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "tiposTrabajoHogar": "Tipos de carpintería"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Muebles a medida",
        "Closets",
        "Reparación",
        "Puertas",
        "Otro"
      ],
      "tiposTrabajoHogar": [
        "Madera",
        "MDF",
        "Triplay",
        "Exterior",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "herreros": {
    "canonSubcategoriaId": "herreros",
    "deltaPack": "C",
    "formularioId": "persona_independiente",
    "nombre": "Herreros",
    "packLabel": "Carpintería, herrería e instalaciones",
    "blockTitle": "Herreros",
    "blockHint": "Herrería — rejas, portones, estructuras y soldadura.",
    "aliasPlaceholder": "Ej. Herrero · Rejas y portones",
    "deltaFields": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar",
      "materialesIncluidos"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "serviciosHogar": "Servicios de herrería"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Rejas",
        "Portones",
        "Estructuras",
        "Soldadura",
        "Reparación",
        "Otro"
      ],
      "especialidadesHogar": [
        "Residencial",
        "Comercial",
        "Industrial ligero",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "jardineria": {
    "canonSubcategoriaId": "jardineria",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Jardinería",
    "packLabel": "Acabados, jardín y mantenimiento",
    "blockTitle": "Jardinería",
    "blockHint": "Jardinería — mantenimiento, diseño y poda.",
    "aliasPlaceholder": "Ej. Jardinería · Mantenimiento semanal",
    "deltaFields": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "serviciosHogar": "Servicios de jardinería"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Mantenimiento",
        "Diseño",
        "Poda",
        "Sistema de riego",
        "Fumigación jardín",
        "Otro"
      ],
      "especialidadesHogar": [
        "Residencial",
        "Comercial",
        "Roof garden",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "fumigacion": {
    "canonSubcategoriaId": "fumigacion",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Fumigación",
    "packLabel": "Acabados, jardín y mantenimiento",
    "blockTitle": "Fumigación",
    "blockHint": "Fumigación — plagas, frecuencia y tipos de inmueble.",
    "aliasPlaceholder": "Ej. Fumigación · Plagas y control",
    "deltaFields": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "especialidadesHogar": "Plagas o servicios"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Fumigación",
        "Desinfección",
        "Control de roedores",
        "Mantenimiento",
        "Otro"
      ],
      "especialidadesHogar": [
        "Cucarachas",
        "Hormigas",
        "Roedores",
        "Termitas",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "limpieza-del-hogar": {
    "canonSubcategoriaId": "limpieza-del-hogar",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Limpieza del Hogar",
    "packLabel": "Acabados, jardín y mantenimiento",
    "blockTitle": "Limpieza del hogar",
    "blockHint": "Limpieza del hogar — profunda, regular, post-obra o por evento.",
    "aliasPlaceholder": "Ej. Limpieza profunda · Por hora o por visita",
    "deltaFields": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "serviciosHogar": "Tipos de limpieza"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Limpieza regular",
        "Profunda",
        "Post-obra",
        "Por evento",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "mantenimiento-general": {
    "canonSubcategoriaId": "mantenimiento-general",
    "deltaPack": "D",
    "formularioId": "persona_independiente",
    "nombre": "Mantenimiento General",
    "packLabel": "Acabados, jardín y mantenimiento",
    "blockTitle": "Mantenimiento general",
    "blockHint": "Mantenimiento general — oficios múltiples, visitas programadas.",
    "aliasPlaceholder": "Ej. Mantenimiento general · Multi-oficio",
    "deltaFields": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "serviciosHogar": "Servicios de mantenimiento"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Reparaciones menores",
        "Plomería básica",
        "Electricidad básica",
        "Pintura touch-up",
        "Visitas programadas",
        "Otro"
      ],
      "especialidadesHogar": [
        "Residencial",
        "Condominios",
        "Comercial",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "tecnicos-en-clima-hvac": {
    "canonSubcategoriaId": "tecnicos-en-clima-hvac",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Técnicos en clima / HVAC",
    "packLabel": "Electricidad y tecnología hogar",
    "blockTitle": "Técnicos en clima / HVAC",
    "blockHint": "Clima / HVAC — instalación, mantenimiento y marcas que manejas.",
    "aliasPlaceholder": "Ej. A/C y calefacción · Instalación y servicio",
    "deltaFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "serviciosHogar": "Servicios de clima",
      "especialidadesHogar": "Sistemas que atiendes"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Instalación",
        "Mantenimiento",
        "Reparación",
        "Carga de gas",
        "Limpieza",
        "Otro"
      ],
      "especialidadesHogar": [
        "Mini split",
        "Central",
        "Calefacción",
        "Comercial",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "impermeabilizadores": {
    "canonSubcategoriaId": "impermeabilizadores",
    "deltaPack": "A",
    "formularioId": "persona_independiente",
    "nombre": "Impermeabilizadores",
    "packLabel": "Obra húmeda y albañilería",
    "blockTitle": "Impermeabilizadores",
    "blockHint": "Impermeabilización — tipos de superficie, garantía y materiales.",
    "aliasPlaceholder": "Ej. Impermeabilización · Techos y losas",
    "deltaFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tiempoRespuestaHogar",
      "certificaciones",
      "tarifaDesde",
      "horarioDetalle",
      "garantiaServicioHogar",
      "materialesIncluidos"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "garantiaServicioHogar": "Garantía de impermeabilización"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Techos",
        "Losas",
        "Muros",
        "Terrazas",
        "Mantenimiento",
        "Otro"
      ],
      "especialidadesHogar": [
        "Prefabricado",
        "Asfáltico",
        "Membrana",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "instaladores-de-paneles-solares": {
    "canonSubcategoriaId": "instaladores-de-paneles-solares",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Instaladores de paneles solares",
    "packLabel": "Electricidad y tecnología hogar",
    "blockTitle": "Instaladores de paneles solares",
    "blockHint": "Paneles solares — instalación, mantenimiento y tipos de proyecto.",
    "aliasPlaceholder": "Ej. Solar residencial · Interconexión CFE",
    "deltaFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
      "tiposTrabajoHogar"
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
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "tiposTrabajoHogar": "Tipos de instalación solar"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Instalación",
        "Mantenimiento",
        "Diagnóstico",
        "Ampliación",
        "Otro"
      ],
      "tiposTrabajoHogar": [
        "Residencial",
        "Comercial",
        "Interconexión",
        "Off-grid",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "tecnicos-en-camaras-de-seguridad": {
    "canonSubcategoriaId": "tecnicos-en-camaras-de-seguridad",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Técnicos en cámaras de seguridad",
    "packLabel": "Electricidad y tecnología hogar",
    "blockTitle": "Técnicos en cámaras de seguridad",
    "blockHint": "CCTV y seguridad — instalación, configuración y soporte.",
    "aliasPlaceholder": "Ej. CCTV · Instalación y monitoreo",
    "deltaFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "serviciosHogar": "Servicios de videovigilancia"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Instalación",
        "Configuración",
        "Mantenimiento",
        "Ampliación",
        "Otro"
      ],
      "especialidadesHogar": [
        "IP",
        "Analógico",
        "NVR/DVR",
        "Acceso remoto",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "instaladores-de-pisos": {
    "canonSubcategoriaId": "instaladores-de-pisos",
    "deltaPack": "C",
    "formularioId": "persona_independiente",
    "nombre": "Instaladores de pisos",
    "packLabel": "Carpintería, herrería e instalaciones",
    "blockTitle": "Instaladores de pisos",
    "blockHint": "Pisos — cerámica, madera, vinílico y preparación de superficie.",
    "aliasPlaceholder": "Ej. Instalador de pisos · Cerámica y vinílico",
    "deltaFields": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar",
      "materialesIncluidos"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
      "tiposTrabajoHogar"
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "tiposTrabajoHogar": "Tipos de piso que instalas"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Instalación",
        "Nivelación",
        "Remoción",
        "Mantenimiento",
        "Otro"
      ],
      "tiposTrabajoHogar": [
        "Cerámica",
        "Porcelanato",
        "Madera",
        "Vinílico",
        "Epóxico",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "cerrajeros": {
    "canonSubcategoriaId": "cerrajeros",
    "deltaPack": "C",
    "formularioId": "persona_independiente",
    "nombre": "Cerrajeros",
    "packLabel": "Carpintería, herrería e instalaciones",
    "blockTitle": "Cerrajeros",
    "blockHint": "Cerrajería — aperturas, cambio de chapas y urgencias.",
    "aliasPlaceholder": "Ej. Cerrajero · Urgencias 24 h",
    "deltaFields": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar",
      "materialesIncluidos"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "tiempoRespuestaHogar": "Tiempo de llegada en urgencia"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Apertura",
        "Cambio de chapa",
        "Copiado de llaves",
        "Cerraduras",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  },
  "domotica-casa-inteligente": {
    "canonSubcategoriaId": "domotica-casa-inteligente",
    "deltaPack": "B",
    "formularioId": "persona_independiente",
    "nombre": "Domótica / casa inteligente",
    "packLabel": "Electricidad y tecnología hogar",
    "blockTitle": "Domótica / casa inteligente",
    "blockHint": "Domótica — automatización, integración y marcas compatibles.",
    "aliasPlaceholder": "Ej. Casa inteligente · Alexa y Google Home",
    "deltaFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "extraFields": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar",
      "diferenciadorHogar",
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
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
      "tiempoRespuestaHogar"
    ],
    "textosAyuda": {
      "diferenciadorHogar": "Ej. Urgencias 24 h · Presupuesto sin costo · Garantía por escrito",
      "coberturaGeografica": "Colonias, municipios o zona metropolitana.",
      "colaboracionesComerciales": "¿Trabajas con arquitectos, contratistas u otros oficios?",
      "modalidadServicioHogar": "A domicilio, taller o emergencias — nunca hotel ni modalidad escort.",
      "serviciosHogar": "Sé específico con los servicios que realmente ofreces.",
      "especialidadesHogar": "Instalación, reparación, mantenimiento, obra menor…",
      "tiposInmueble": "Casa, departamento, local comercial, condominio…",
      "tiempoRespuestaHogar": "Tiempo habitual para atender una solicitud.",
      "garantiaServicioHogar": "Ej. 30 días mano de obra · 1 año en impermeabilización",
      "materialesIncluidos": "Indica si cotizas solo mano de obra o incluyes materiales."
    },
    "fieldLabels": {
      "serviciosHogar": "Servicios de casa inteligente"
    },
    "fieldOptions": {
      "modalidadServicioHogar": [
        {
          "value": "domicilio",
          "label": "Servicio a domicilio"
        },
        {
          "value": "taller",
          "label": "Taller / bodega propia"
        },
        {
          "value": "ambos",
          "label": "Domicilio y taller"
        },
        {
          "value": "emergencia_24h",
          "label": "Emergencias / 24 horas"
        }
      ],
      "tiempoRespuestaHogar": [
        {
          "value": "emergencia_2h",
          "label": "Emergencia (~2 h)"
        },
        {
          "value": "mismo_dia",
          "label": "Mismo día"
        },
        {
          "value": "24_48h",
          "label": "24–48 horas"
        },
        {
          "value": "por_cita",
          "label": "Con cita programada"
        }
      ],
      "anosExperienciaHogar": [
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
      "materialesIncluidos": [
        {
          "value": "solo_mano_obra",
          "label": "Solo mano de obra"
        },
        {
          "value": "con_materiales",
          "label": "Mano de obra + materiales"
        },
        {
          "value": "mixto",
          "label": "Depende del trabajo"
        },
        {
          "value": "convenir",
          "label": "A convenir por proyecto"
        }
      ],
      "tiposInmueble": [
        "Casa",
        "Departamento",
        "Local comercial",
        "Condominio",
        "Oficina",
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
      "serviciosHogar": [
        "Automatización",
        "Iluminación",
        "Cerraduras",
        "Integración",
        "Capacitación",
        "Otro"
      ],
      "especialidadesHogar": [
        "Alexa",
        "Google Home",
        "Apple HomeKit",
        "KNX",
        "Otro"
      ]
    },
    "negocioLocal": false,
    "personaIndependiente": true
  }
};
})(typeof window !== 'undefined' ? window : globalThis);
