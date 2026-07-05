/**
 * MP-EVENTOS-ENRICH-V2 — copy y hints por sub (20 canon).
 */
const BASE_AYUDA = {
  especialidadesEvento: "Bodas, XV, corporativos, infantiles — marca todo lo que sí haces.",
  cotizacionDesde: "Precio orientativo — filtra clientes sin prometer paquete fijo.",
  colaboracionesComerciales: "¿Trabajas con otros proveedores de eventos en paquetes conjuntos?",
  diferenciadorProfesional: "Ej. Respuesta en 24 h · Equipo propio · Experiencia en bodas destino",
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
  "espacios-para-eventos": enrich(
    "Tu salón, quinta o jardín — capacidad, políticas de catering y ruido.",
    {
      fieldLabels: {
        tiposEspacio: "Tipos de espacio que ofreces",
        cateringPolitica: "Política de catering externo",
        tiposEventoAceptados: "Eventos que aceptas",
      },
    }
  ),
  "organizadores-produccion-eventos": enrich(
    "Producción integral — rol real, tamaño de evento y presupuesto mínimo.",
    {
      fieldLabels: {
        rolProduccion: "¿Qué coordinas en el evento?",
        presupuestoMinimoMxn: "Presupuesto mínimo de proyecto (MXN)",
      },
    }
  ),
  "decoracion-ambientacion-eventos": enrich(
    "Decoración y ambientación — montaje, estilo visual y visita al venue.",
    { fieldLabels: { especialidadesDecoracion: "Especialidades de decoración" } }
  ),
  "fotografia-video-eventos": enrich(
    "Foto y video — horas de cobertura, entrega y dron si aplica.",
    { fieldLabels: { serviciosAudiovisual: "Servicios audiovisuales" } }
  ),
  "djs-eventos": enrich(
    "DJ para fiestas — géneros, equipo propio y traslado fuera de ciudad.",
    {
      fieldLabels: {
        generosMusicales: "Géneros que manejas",
        incluyeEquipoSonido: "¿Incluyes equipo de sonido?",
      },
    }
  ),
  "grupos-musicales-eventos": enrich(
    "Grupo musical — formación, repertorio y formato Fara Fara si aplica.",
    { fieldLabels: { tipoAgrupacion: "Tipo de agrupación" } }
  ),
  "animadores-maestros-ceremonia": enrich(
    "Animación y MC — rol principal, dinámicas y protección de menores.",
    {
      fieldLabels: { rolPrincipal: "Tu rol principal en el evento" },
      textosAyuda: { rolPrincipal: "MC, animador o mixto — define qué campos aplican." },
    }
  ),
  "shows-para-eventos": enrich(
    "Show escénico — tipo de show, público objetivo y contenido sensible si aplica.",
    {
      fieldLabels: { tipoShow: "Tipos de show que ofreces" },
      textosAyuda: { contenidoSensible: "Marca si incluye contenido para adultos — activa revisión." },
    }
  ),
  "banquetes-catering-eventos": enrich(
    "Banquetes y catering — comensales máximos, dietas especiales y permisos.",
    {
      fieldLabels: {
        comensalesMax: "Capacidad máxima de comensales",
        dietasEspeciales: "Dietas y alergias que cubres",
      },
    }
  ),
  "renta-mobiliario-eventos": enrich(
    "Renta de mobiliario — sillas, mesas, lonas y montaje.",
    { fieldLabels: { tiposMobiliario: "Mobiliario que rentas" } }
  ),
  "renta-equipo-eventos": enrich(
    "Audio, iluminación y escenarios — inventario y operación técnica.",
    { fieldLabels: { tiposEquipoRenta: "Equipo que rentas" } }
  ),
  "food-trucks-carritos-eventos": enrich(
    "Food truck para eventos — menú, capacidad por hora y permisos.",
    { fieldLabels: { tipoCocinaFoodTruck: "Tipo de cocina del carrito" } }
  ),
  "pasteles-reposteria-eventos": enrich(
    "Pasteles y mesa de postres — pedidos personalizados y entrega.",
    { fieldLabels: { productosReposteriaEventos: "Productos de repostería para eventos" } }
  ),
  "invitaciones-papeleria-eventos": enrich(
    "Invitaciones y papelería — diseño, impresión y entregables digitales.",
    { fieldLabels: { serviciosPapeleria: "Servicios de papelería e invitaciones" } }
  ),
  "florerias-eventos": enrich(
    "Florería para eventos — arreglos, instalación y desmontaje.",
    { fieldLabels: { serviciosFlorales: "Servicios florales para eventos" } }
  ),
  "pirotecnia-efectos-especiales": enrich(
    "Pirotecnia regulada — licencias, jurisdicción y póliza obligatorias.",
    {
      fieldLabels: { tipoEfectoPirotecnia: "Tipos de efectos pirotécnicos" },
      textosAyuda: { disclaimerReguladoEventos: "Servicio regulado — revisión administrativa." },
    }
  ),
  "seguridad-eventos": enrich(
    "Seguridad privada — licencia, elementos y cobertura del evento.",
    {
      fieldLabels: { elementosSeguridad: "Número de elementos de seguridad" },
      textosAyuda: { licenciaSeguridadPrivada: "Licencia vigente obligatoria." },
    }
  ),
  "valet-parking-eventos": enrich(
    "Valet parking — capacidad por hora y póliza de responsabilidad.",
    { fieldLabels: { vehiculosPorHora: "Vehículos atendidos por hora" } }
  ),
  "transporte-eventos": enrich(
    "Transporte de invitados — permisos, póliza y capacidad.",
    { fieldLabels: { capacidadPasajeros: "Capacidad de pasajeros por unidad" } }
  ),
  "renta-vestuario-disfraces-eventos": enrich(
    "Renta de vestuario y disfraces — catálogo, tallas y entrega.",
    { fieldLabels: { tiposVestuario: "Tipos de vestuario / disfraces" } }
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
