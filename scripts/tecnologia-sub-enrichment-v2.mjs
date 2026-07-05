/**
 * MP-TECNOLOGIA-ENRICH-V2 — copy, hints y labels por sub (32 subs).
 */
const BASE_AYUDA = {
  modalidadServicioTI: "Remoto, presencial, híbrido o visita al cliente — nunca hotel ni modalidad escort.",
  stackTecnologico: "Tecnologías donde tienes experiencia comprobable en proyectos reales.",
  serviciosDesarrollo: "Desarrollo web, apps, APIs, mantenimiento, automatización…",
  serviciosSoporteTI: "Helpdesk, instalación, configuración, backup, recuperación de datos…",
  coberturaGeografica: "Ciudad, colonias o cobertura remoto nacional.",
  diferenciadorProfesional: "Ej. Respuesta en 2 h · Especialista PyME · Certificado AWS",
  colaboracionesComerciales: "¿Trabajas con agencias, freelancers o marcas en proyectos conjuntos?",
  portfolioURL: "GitHub, Behance, sitio propio o demo en vivo — sin datos sensibles de clientes.",
  serviciosMarketingDigital: "Sé específico: gestión, pauta, SEO, contenido, analítica…",
  canalesMarketing: "Redes, buscadores, marketplaces o plataformas de ads.",
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
  programador: enrich(
    "Tu stack y tipos de proyecto — ayuda a quien busca exactamente tu perfil dev.",
    {
      fieldLabels: {
        stackTecnologico: "¿Qué tecnologías dominas?",
        serviciosDesarrollo: "¿Qué servicios de desarrollo ofreces?",
        tipoProyectosDev: "¿Qué tipos de proyecto haces?",
      },
    }
  ),
  "desarrollador-web": enrich(
    "Frontend, backend o full stack — declara stack, entregables y modalidad de trabajo.",
    {
      fieldLabels: {
        stackTecnologico: "Stack web (frameworks y CMS)",
        serviciosDesarrollo: "Servicios web que ofreces",
      },
    }
  ),
  "desarrollador-movil": enrich(
    "Apps nativas o cross-platform — stores, mantenimiento e integraciones.",
    {
      fieldLabels: {
        stackTecnologico: "Plataformas y frameworks móviles",
        serviciosDesarrollo: "Servicios de desarrollo móvil",
      },
    }
  ),
  "automatizacion-ia": enrich(
    "Automatizaciones, integraciones y flujos con IA — sé específico con herramientas.",
    {
      fieldLabels: {
        stackTecnologico: "Herramientas y modelos de IA",
        serviciosDesarrollo: "Automatizaciones que implementas",
      },
    }
  ),
  "prompt-engineer": enrich(
    "Diseño de prompts, evaluación de LLMs y workflows — ideal para equipos que adoptan IA.",
    {
      fieldLabels: {
        serviciosDesarrollo: "Servicios de prompt engineering",
        stackTecnologico: "Modelos y plataformas que usas",
      },
    }
  ),
  "desarrollo-de-software": enrich(
    "Software a medida, SaaS e integraciones — declara alcance y stack principal.",
    {
      fieldLabels: { serviciosDesarrollo: "Tipos de software que desarrollas" },
    }
  ),
  "desarrollo-de-apps": enrich(
    "Apps móviles para startups o empresas — MVP, stores y mantenimiento.",
    { fieldLabels: { serviciosDesarrollo: "Servicios de apps móviles" } }
  ),
  "desarrollo-web": enrich(
    "Sitios, portales e intranets — incluye mantenimiento y SEO técnico si aplica.",
    { fieldLabels: { serviciosDesarrollo: "Servicios de desarrollo web" } }
  ),
  "soporte-tecnico-independiente": enrich(
    "Soporte remoto o presencial — tiempos de respuesta y cobertura generan confianza.",
    {
      fieldLabels: {
        serviciosSoporteTI: "¿Qué incluye tu soporte?",
        tiposEquipoSoporte: "¿Qué equipos atiendes?",
        serviciosReparacion: "¿Qué reparaciones realizas?",
        tiempoRespuestaSoporte: "¿En cuánto respondes normalmente?",
        coberturaGeografica: "¿Dónde das servicio presencial?",
      },
      textosAyuda: {
        garantiaServicio: "Ej. 30 días mano de obra · 90 días en piezas",
        modalidadServicioTI: "Remoto por AnyDesk/TeamViewer, visita a domicilio o en tu taller.",
      },
    }
  ),
  "tecnico-en-computadoras": enrich(
    "Reparación, mantenimiento y armado — detalla equipos, refacciones y garantías.",
    {
      fieldLabels: {
        serviciosReparacion: "Reparaciones y mantenimiento",
        tiposEquipoSoporte: "Equipos que reparas",
        garantiaServicio: "Garantía de tu servicio",
      },
    }
  ),
  "soporte-empresarial-ti": enrich(
    "Helpdesk, mesa de ayuda o outsourcing TI — SLA, cobertura y tamaño de cliente.",
    {
      fieldLabels: {
        serviciosEmpresaTI: "Servicios empresariales TI",
        tiempoRespuestaSoporte: "Tiempo de respuesta / SLA",
        tamanoEmpresaAtendida: "Tamaño de empresas atendidas",
      },
    }
  ),
  "community-manager": enrich(
    "Gestión de comunidades y redes — canales, tono de marca y reportes.",
    {
      fieldLabels: {
        serviciosMarketingDigital: "Servicios de community management",
        canalesMarketing: "Redes que administras",
        especialidadMarketing: "Nicho o industria",
      },
    }
  ),
  "especialista-seo": enrich(
    "Posicionamiento orgánico — auditoría, técnico, contenido y SEO local.",
    {
      fieldLabels: {
        serviciosMarketingDigital: "Servicios SEO que ofreces",
        canalesMarketing: "Motores y plataformas SEO",
      },
    }
  ),
  "especialista-sem": enrich(
    "Publicidad en buscadores y redes — certificaciones y plataformas de ads.",
    {
      fieldLabels: {
        serviciosMarketingDigital: "Servicios de pauta / SEM",
        canalesMarketing: "Plataformas de publicidad",
      },
    }
  ),
  "administrador-de-redes-sociales": enrich(
    "Publicación, copy y métricas — define frecuencia y canales.",
    {
      fieldLabels: {
        serviciosMarketingDigital: "Servicios de social media",
        canalesMarketing: "Redes que manejas",
      },
    }
  ),
  "creador-de-contenido-digital": enrich(
    "UGC, video corto, podcast o newsletter — muestra estilo y canales.",
    {
      fieldLabels: {
        serviciosMarketingDigital: "Formatos de contenido",
        canalesMarketing: "Plataformas donde publicas",
      },
    }
  ),
  "especialista-en-ciberseguridad-independiente": enrich(
    "Servicios de seguridad — no prometas acceso no autorizado ni resultados imposibles.",
    {
      fieldLabels: {
        serviciosCiberseguridad: "Servicios de ciberseguridad",
        certificacionesSeguridad: "Certificaciones de seguridad",
      },
    }
  ),
  "consultor-it": enrich(
    "Consultoría de infraestructura, nube y transformación — diagnóstico e implementación.",
    {
      fieldLabels: {
        areasConsultoriaTI: "Áreas donde consultas",
        serviciosConsultoriaTI: "Servicios de consultoría",
      },
    }
  ),
  "consultoria-tecnologica": enrich(
    "Estrategia digital, procesos y arquitectura — industrias y modalidad de proyecto.",
    {
      fieldLabels: {
        areasConsultoriaTI: "Áreas de consultoría tech",
        industriasAtendidas: "Industrias que atiendes",
      },
    }
  ),
  "ciberseguridad-empresarial": enrich(
    "SOC, compliance y seguridad corporativa — servicios B2B y certificaciones.",
    {
      fieldLabels: {
        serviciosEmpresaTI: "Servicios de ciberseguridad empresarial",
        serviciosCiberseguridad: "Líneas de servicio de seguridad",
      },
    }
  ),
  "agencia-de-marketing-digital": enrich(
    "Agencia 360 — branding, performance, social y producción de contenido.",
    {
      fieldLabels: {
        serviciosEmpresaTI: "Servicios de la agencia",
        especialidadesEmpresaTI: "Especialidades / nichos",
      },
    }
  ),
  "agencia-seo": enrich(
    "Agencia SEO — posicionamiento orgánico para marcas y e-commerce.",
    { fieldLabels: { serviciosEmpresaTI: "Servicios SEO de la agencia" } }
  ),
  "agencia-de-publicidad-digital": enrich(
    "Campañas display, video e influencers — medios programáticos y creatividad.",
    { fieldLabels: { serviciosEmpresaTI: "Servicios de publicidad digital" } }
  ),
  "venta-de-equipo-de-computo": enrich(
    "Venta o renta de cómputo — equipos, licencias y garantía extendida.",
    {
      fieldLabels: {
        serviciosEmpresaTI: "Servicios comerciales",
        especialidadesEmpresaTI: "Tipos de equipo",
      },
    }
  ),
  "disenador-grafico": enrich(
    "Branding, ilustración y piezas gráficas — incluye portafolio visual.",
    {
      fieldLabels: {
        serviciosCreativosTI: "Servicios de diseño gráfico",
        especialidadCreativaTI: "Especialidad creativa",
      },
    }
  ),
  "disenador-ux-ui": enrich(
    "UX research, wireframes y UI — productos digitales, apps y SaaS.",
    {
      fieldLabels: {
        serviciosCreativosTI: "Servicios UX/UI",
        especialidadCreativaTI: "Tipo de producto digital",
      },
    }
  ),
  "editor-de-video": enrich(
    "Edición para Reels, YouTube o corporativo — motion y postproducción.",
    { fieldLabels: { serviciosCreativosTI: "Servicios de edición de video" } }
  ),
  "produccion-audiovisual": enrich(
    "Producción integral — comercial, corporativo, streaming y fotografía.",
    { fieldLabels: { serviciosCreativosTI: "Servicios audiovisuales" } }
  ),
  "estudio-de-diseno": enrich(
    "Estudio creativo — branding, digital y consultoría de diseño.",
    { fieldLabels: { serviciosCreativosTI: "Servicios del estudio" } }
  ),
  "redes-y-telecomunicaciones": enrich(
    "Cableado, WiFi empresarial, VPN y VoIP — infraestructura de conectividad.",
    {
      fieldLabels: {
        serviciosInfraTI: "Servicios de redes y telecom",
        plataformasInfra: "Marcas / plataformas",
      },
    }
  ),
  "hosting-y-dominios": enrich(
    "Dominios, hosting, correo y SSL — planes y plataformas que administras.",
    {
      fieldLabels: {
        serviciosInfraTI: "Servicios de hosting e infra",
        serviciosEmpresaTI: "Servicios comerciales",
        plataformasInfra: "Panel / proveedores cloud",
      },
    }
  ),
  "servicios-cloud": enrich(
    "Migración, arquitectura cloud y DevOps — AWS, Azure, GCP u otros.",
    {
      fieldLabels: {
        serviciosInfraTI: "Servicios cloud",
        plataformasInfra: "Proveedores cloud",
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
  const ayuda = { ...(out.textosAyuda || {}), ...(enrichData.textosAyuda || {}) };
  out.textosAyuda = ayuda;
  if (enrichData.extraFields) {
    out.extraFields = [...new Set([...(out.extraFields || []), ...enrichData.extraFields])];
  }
  return out;
}
