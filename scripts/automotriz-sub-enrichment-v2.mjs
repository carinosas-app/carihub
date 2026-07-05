/**
 * MP-AUTOMOTRIZ-ENRICH-V2 — copy, hints y labels por sub (14 subs).
 */
const BASE_AYUDA = {
  modalidadServicioAuto: "Taller fijo, domicilio o unidad móvil — nunca hotel ni modalidad escort.",
  serviciosMecanica: "Afinación, frenos, suspensión, diagnóstico, mantenimiento preventivo…",
  especialidadesMecanica: "Motor, transmisión, electricidad, inyección, diesel…",
  marcasAtendidas: "Marcas que conoces bien o atiendes con frecuencia.",
  tiposVehiculoAtendidos: "Sedán, SUV, pick-up, moto, flotilla ligera…",
  garantiaServicioAuto: "Ej. 30 días mano de obra · 90 días en refacciones",
  tiempoRespuestaAuto: "Tiempo habitual de respuesta o llegada al cliente.",
  coberturaGeografica: "Colonias, municipios, carreteras o cobertura metropolitana.",
  diferenciadorAutomotriz: "Ej. Diagnóstico gratis · Especialista Nissan · Servicio mismo día",
  colaboracionesComerciales: "¿Trabajas con talleres aliados, agencias, aseguradoras o flotillas?",
  serviciosLlantas: "Venta, montaje, balanceo, reparación de pinchaduras, alineación…",
  serviciosCarroceria: "Hojalatería, pintura, enderezado, match de color…",
  serviciosEsteticaAuto: "Lavado, encerado, detailing, protección cerámica…",
  serviciosRefacciones: "Venta mostrador, pedidos especiales, entrega a domicilio…",
  serviciosEspecialidadAuto: "A/C, baterías, audio, alarmas, electromecánica…",
  serviciosVentaAutos: "Contado, consignación, permuta, entrega inmediata…",
  serviciosGrua: "Grúa local, carretera, auxilio mecánico, batería, llanta…",
  coberturaCarretera: "Autopistas, periféricos o radio de cobertura en km.",
};

function enrich(blockHint, extra = {}) {
  return {
    blockHint,
    fieldLabels: extra.fieldLabels || {},
    textosAyuda: { ...BASE_AYUDA, ...(extra.textosAyuda || {}) },
    extraFields: extra.extraFields,
  };
}

/** @type {Record<string, object>} */
export const SUB_ENRICHMENT_V2 = {
  "talleres-mecanicos": enrich(
    "Servicios mecánicos, marcas y modalidad — la cobertura y garantía generan confianza.",
    {
      fieldLabels: {
        serviciosMecanica: "¿Qué servicios mecánicos ofreces?",
        especialidadesMecanica: "¿En qué te especializas?",
        marcasAtendidas: "¿Qué marcas atiendes?",
      },
    }
  ),
  electromecanicos: enrich(
    "Electricidad automotriz, diagnóstico y sistemas electrónicos — declara especialidades.",
    {
      fieldLabels: {
        serviciosMecanica: "Servicios electromecánicos",
        especialidadesMecanica: "Sistemas que atiendes",
      },
    }
  ),
  "mecanicos-a-domicilio": enrich(
    "Servicio a domicilio o en sitio — tiempos de respuesta y cobertura son clave.",
    {
      fieldLabels: {
        modalidadServicioAuto: "¿Cómo llegas al cliente?",
        tiempoRespuestaAuto: "¿En cuánto puedes llegar?",
        coberturaGeografica: "¿Qué zona cubres?",
      },
      textosAyuda: {
        modalidadServicioAuto: "Domicilio, estacionamiento del cliente o empresa.",
      },
    }
  ),
  vulcanizadoras: enrich(
    "Llantas, balanceo y alineación — tipos de llanta y servicios incluidos.",
    {
      fieldLabels: {
        serviciosLlantas: "¿Qué servicios de llantas ofreces?",
        tiposLlantas: "¿Qué tipos de llanta manejas?",
      },
    }
  ),
  "hojalateria-y-pintura": enrich(
    "Carrocería, pintura y enderezado — tipos de daño y garantía de acabado.",
    {
      fieldLabels: {
        serviciosCarroceria: "Servicios de hojalatería y pintura",
      },
    }
  ),
  "lavado-de-autos": enrich(
    "Lavado, encerado y paquetes — modalidad en sitio o a domicilio.",
    {
      fieldLabels: {
        serviciosEsteticaAuto: "Paquetes y servicios de lavado",
      },
    }
  ),
  "detallado-automotriz-premium": enrich(
    "Detailing premium, protección y acabados — diferenciador y garantías.",
    {
      fieldLabels: {
        serviciosEsteticaAuto: "Servicios de detailing premium",
      },
    }
  ),
  refaccionarias: enrich(
    "Refacciones, marcas y entrega — líneas que manejas y cobertura.",
    {
      fieldLabels: {
        serviciosRefacciones: "¿Qué vendes o surtes?",
        lineasRefacciones: "Marcas o líneas principales",
      },
    }
  ),
  "instaladores-de-audio-car-multimedia": enrich(
    "Audio, pantallas, alarmas y multimedia — marcas y tipos de instalación.",
    {
      fieldLabels: {
        serviciosEspecialidadAuto: "Instalaciones y equipos",
      },
    }
  ),
  "tecnicos-en-baterias": enrich(
    "Baterías, arrancadores y pruebas — cobertura y tiempos de respuesta.",
    {
      fieldLabels: {
        serviciosEspecialidadAuto: "Servicios de baterías",
        tiempoRespuestaAuto: "Tiempo de llegada habitual",
      },
    }
  ),
  "tecnicos-en-a-c-automotriz": enrich(
    "Aire acondicionado automotriz — carga, diagnóstico y reparación.",
    {
      fieldLabels: {
        serviciosEspecialidadAuto: "Servicios de A/C automotriz",
      },
    }
  ),
  "agencias-de-autos": enrich(
    "Inventario, financiamiento y servicios de agencia — datos del establecimiento.",
    {
      fieldLabels: {
        serviciosVentaAutos: "Servicios de la agencia",
        tiposVehiculoVenta: "¿Qué vendes?",
        inventarioAproximado: "Unidades en piso (aprox.)",
      },
    }
  ),
  "lotes-de-autos": enrich(
    "Seminuevos, contado y financiamiento — unidades disponibles y cobertura.",
    {
      fieldLabels: {
        serviciosVentaAutos: "¿Cómo vendes?",
        cantidadUnidadesAprox: "Unidades disponibles ahora",
      },
    }
  ),
  "gruas-y-auxilio-vial": enrich(
    "Grúa, auxilio vial y cobertura en carretera — tiempos de respuesta críticos.",
    {
      fieldLabels: {
        serviciosGrua: "Servicios de grúa y auxilio",
        coberturaCarretera: "¿Dónde operas en carretera?",
        tiempoRespuestaAuto: "Tiempo de llegada en emergencia",
      },
    }
  ),
};

export function mergeEnrichmentV2(baseProfile, subId) {
  const enrichData = SUB_ENRICHMENT_V2[subId];
  if (!enrichData) return baseProfile;
  const out = { ...baseProfile };
  if (enrichData.blockHint) out.blockHint = enrichData.blockHint;
  if (enrichData.fieldLabels) {
    out.fieldLabels = { ...(out.fieldLabels || {}), ...enrichData.fieldLabels };
  }
  out.textosAyuda = { ...(out.textosAyuda || {}), ...(enrichData.textosAyuda || {}) };
  if (enrichData.extraFields) {
    out.extraFields = [...new Set([...(out.extraFields || []), ...enrichData.extraFields])];
  }
  return out;
}
