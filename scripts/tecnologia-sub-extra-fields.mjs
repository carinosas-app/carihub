/**
 * MP-TECNOLOGIA-DELTAS-V1 — campos extra, ocultos y opciones por subcategoría (32 subs).
 */
import {
  mergeHideAdultLeaks,
  HIDE_ADULT_LEAKS,
  COLABORACIONES_COMERCIALES_OPTIONS,
  TIPOS_COLABORACION_COMERCIAL,
} from "./registro-cross-sector-policy.mjs";
import { mergeEnrichmentV2 } from "./tecnologia-sub-enrichment-v2.mjs";

export const MODALIDAD_SERVICIO_TI = [
  { value: "remoto", label: "100% remoto / en línea" },
  { value: "presencial", label: "Presencial en oficina o taller" },
  { value: "hibrido", label: "Remoto y presencial" },
  { value: "visita_cliente", label: "Visita al cliente / sitio" },
  { value: "domicilio", label: "Servicio a domicilio" },
];

export const TIEMPO_RESPUESTA_SOPORTE = [
  { value: "mismo_dia", label: "Mismo día" },
  { value: "24h", label: "Dentro de 24 horas" },
  { value: "48h", label: "24–48 horas" },
  { value: "por_cita", label: "Con cita programada" },
  { value: "sla_contrato", label: "Según SLA / contrato" },
];

export const ANOS_EXPERIENCIA_TI = [
  { value: "1_3", label: "1–3 años" },
  { value: "4_7", label: "4–7 años" },
  { value: "8_15", label: "8–15 años" },
  { value: "16_mas", label: "16+ años" },
];

export { HIDE_ADULT_LEAKS };

const COLAB_OPTS = {
  colaboracionesComerciales: COLABORACIONES_COMERCIALES_OPTIONS,
  tiposColaboracionComercial: TIPOS_COLABORACION_COMERCIAL,
};

const COMMON = {
  extraFields: [
    "diferenciadorProfesional",
    "coberturaGeografica",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: { ...COLAB_OPTS },
  textosAyuda: {
    diferenciadorProfesional: "Ej. Respuesta en 2 h · Especialista en PyME · Certificado Microsoft",
    coberturaGeografica: "Ciudad, zona o cobertura remota nacional.",
    colaboracionesComerciales: "¿Trabajas con agencias, freelancers o marcas en proyectos conjuntos?",
  },
};

const A_DEV = {
  ...COMMON,
  extraFields: [
    "stackTecnologico",
    "serviciosDesarrollo",
    "modalidadServicioTI",
    "lenguajesFrameworks",
    "tipoProyectosDev",
    "anosExperienciaTI",
    "portfolioURL",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: ["stackTecnologico", "serviciosDesarrollo", "modalidadServicioTI"],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: {
    modalidadServicioTI: MODALIDAD_SERVICIO_TI,
    anosExperienciaTI: ANOS_EXPERIENCIA_TI,
    ...COLAB_OPTS,
  },
};

const B_SOPORTE = {
  ...COMMON,
  extraFields: [
    "serviciosSoporteTI",
    "tiposEquipoSoporte",
    "serviciosReparacion",
    "modalidadServicioTI",
    "tiempoRespuestaSoporte",
    "tiposClientesSoporte",
    "garantiaServicio",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosSoporteTI",
    "tiposEquipoSoporte",
    "modalidadServicioTI",
    "coberturaGeografica",
    "tiempoRespuestaSoporte",
  ],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: {
    modalidadServicioTI: MODALIDAD_SERVICIO_TI,
    tiempoRespuestaSoporte: TIEMPO_RESPUESTA_SOPORTE,
    ...COLAB_OPTS,
  },
};

const C_MARKETING = {
  ...COMMON,
  extraFields: [
    "serviciosMarketingDigital",
    "canalesMarketing",
    "especialidadMarketing",
    "modalidadServicioTI",
    "herramientasMarketing",
    "portfolioURL",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: ["serviciosMarketingDigital", "canalesMarketing", "modalidadServicioTI"],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: {
    modalidadServicioTI: MODALIDAD_SERVICIO_TI,
    ...COLAB_OPTS,
  },
};

const D_CONSULTORIA = {
  ...COMMON,
  extraFields: [
    "areasConsultoriaTI",
    "serviciosConsultoriaTI",
    "serviciosCiberseguridad",
    "modalidadServicioTI",
    "certificacionesSeguridad",
    "industriasAtendidas",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: ["areasConsultoriaTI", "serviciosConsultoriaTI", "modalidadServicioTI"],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: {
    modalidadServicioTI: MODALIDAD_SERVICIO_TI,
    ...COLAB_OPTS,
  },
};

const E_NEGOCIO = {
  extraFields: [
    "serviciosEmpresaTI",
    "especialidadesEmpresaTI",
    "tamanoEmpresaAtendida",
    "diferenciadorProfesional",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  obligatoriosExtra: ["serviciosEmpresaTI", "especialidadesEmpresaTI"],
  fieldOptions: {
    tamanoEmpresaAtendida: ["PyME", "Mediana", "Corporativo", "Gobierno", "Startups"],
    ...COLAB_OPTS,
  },
  textosAyuda: {
    ...COMMON.textosAyuda,
    serviciosEmpresaTI: "Servicios principales que ofrece tu empresa al público.",
  },
};

const F_CREATIVE = {
  ...COMMON,
  extraFields: [
    "serviciosCreativosTI",
    "especialidadCreativaTI",
    "modalidadServicioTI",
    "portfolioURL",
    "softwareHerramientas",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: ["serviciosCreativosTI", "especialidadCreativaTI", "modalidadServicioTI"],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: {
    modalidadServicioTI: MODALIDAD_SERVICIO_TI,
    ...COLAB_OPTS,
  },
};

const F_INFRA = {
  ...F_CREATIVE,
  extraFields: [
    "serviciosInfraTI",
    "plataformasInfra",
    "modalidadServicioTI",
    "serviciosCreativosTI",
    "especialidadCreativaTI",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: ["serviciosInfraTI", "plataformasInfra", "modalidadServicioTI"],
};

/** Perfil por subcategoriaId — se fusiona sobre el pack base en mergeDelta */
export const SUB_EXTRA_PROFILES = {
  programador: {
    ...A_DEV,
    blockTitle: "Programador",
    blockHint: "Tu stack y tipos de proyecto — ayuda a quien busca exactamente tu perfil dev.",
    aliasPlaceholder: "Ej. Dev Backend · Python y APIs",
    fieldOptions: {
      ...A_DEV.fieldOptions,
      stackTecnologico: ["Python", "JavaScript", "Java", "C#", ".NET", "Go", "PHP", "Ruby", "Otro"],
      serviciosDesarrollo: [
        "Desarrollo a medida",
        "APIs / microservicios",
        "Mantenimiento de código",
        "Code review",
        "Migración de sistemas",
        "Otro",
      ],
      tipoProyectosDev: ["Web", "Backend", "Desktop", "Scripts / automatización", "Open source", "Otro"],
    },
    fieldLabels: {
      stackTecnologico: "¿Qué tecnologías dominas?",
      serviciosDesarrollo: "¿Qué servicios de desarrollo ofreces?",
    },
  },
  "desarrollador-web": {
    ...A_DEV,
    blockTitle: "Desarrollador web",
    blockHint: "Frontend, backend o full stack — declara stack y entregables.",
    aliasPlaceholder: "Ej. Dev Web Full Stack · React y Node",
    fieldOptions: {
      ...A_DEV.fieldOptions,
      stackTecnologico: ["React", "Vue", "Angular", "Next.js", "Node.js", "Laravel", "WordPress", "Shopify", "Otro"],
      serviciosDesarrollo: [
        "Landing page",
        "Sitio corporativo",
        "E-commerce",
        "Web app",
        "Mantenimiento web",
        "Optimización performance",
        "Otro",
      ],
      tipoProyectosDev: ["Frontend", "Backend", "Full stack", "CMS", "E-commerce", "Otro"],
    },
  },
  "desarrollador-movil": {
    ...A_DEV,
    blockTitle: "Desarrollador móvil",
    aliasPlaceholder: "Ej. Dev Mobile · Flutter iOS/Android",
    fieldOptions: {
      ...A_DEV.fieldOptions,
      stackTecnologico: ["Flutter", "React Native", "Swift", "Kotlin", "Ionic", "Xamarin", "Otro"],
      serviciosDesarrollo: [
        "App nativa",
        "App híbrida",
        "Publicación stores",
        "Mantenimiento app",
        "Integración APIs",
        "Otro",
      ],
      tipoProyectosDev: ["iOS", "Android", "Cross-platform", "PWA", "Otro"],
    },
  },
  "automatizacion-ia": {
    ...A_DEV,
    blockTitle: "Automatización IA",
    blockHint: "Automatizaciones, integraciones y flujos con IA — sé específico con herramientas.",
    aliasPlaceholder: "Ej. Automatización IA · n8n y OpenAI",
    fieldOptions: {
      ...A_DEV.fieldOptions,
      stackTecnologico: ["OpenAI", "Anthropic", "LangChain", "n8n", "Make", "Zapier", "Python", "Otro"],
      serviciosDesarrollo: [
        "Automatización de procesos",
        "Chatbots",
        "Integración CRM/ERP",
        "RAG / knowledge base",
        "Agentes IA",
        "Otro",
      ],
      tipoProyectosDev: ["PyME", "E-commerce", "Soporte", "Marketing", "Operaciones", "Otro"],
    },
  },
  "prompt-engineer": {
    ...A_DEV,
    blockTitle: "Prompt engineer",
    aliasPlaceholder: "Ej. Prompt Engineer · LLMs empresariales",
    fieldOptions: {
      ...A_DEV.fieldOptions,
      stackTecnologico: ["GPT", "Claude", "Gemini", "Llama", "Midjourney", "Stable Diffusion", "Otro"],
      serviciosDesarrollo: [
        "Diseño de prompts",
        "Evaluación de modelos",
        "Fine-tuning guidance",
        "Workflows multimodal",
        "Capacitación",
        "Otro",
      ],
    },
  },
  "desarrollo-de-software": {
    ...A_DEV,
    blockTitle: "Desarrollo de software",
    aliasPlaceholder: "Ej. Software a medida · ERP y CRM",
    fieldOptions: {
      ...A_DEV.fieldOptions,
      serviciosDesarrollo: [
        "Software a medida",
        "SaaS",
        "Integraciones",
        "Modernización legacy",
        "QA / testing",
        "Otro",
      ],
    },
  },
  "desarrollo-de-apps": {
    ...A_DEV,
    blockTitle: "Desarrollo de apps",
    aliasPlaceholder: "Ej. Apps móviles · Delivery y fintech",
    fieldOptions: {
      ...A_DEV.fieldOptions,
      serviciosDesarrollo: ["App iOS", "App Android", "Cross-platform", "MVP startup", "Mantenimiento", "Otro"],
    },
  },
  "desarrollo-web": {
    ...A_DEV,
    blockTitle: "Desarrollo web",
    aliasPlaceholder: "Ej. Desarrollo Web · Sitios y portales",
    fieldOptions: {
      ...A_DEV.fieldOptions,
      serviciosDesarrollo: ["Sitio web", "Portal", "Intranet", "Web app", "SEO técnico", "Otro"],
    },
  },
  "soporte-tecnico-independiente": {
    ...B_SOPORTE,
    blockTitle: "Soporte técnico independiente",
    blockHint: "Soporte remoto o presencial — tiempos de respuesta y cobertura generan confianza.",
    aliasPlaceholder: "Ej. Soporte TI · Remoto y presencial CDMX",
    fieldLabels: {
      serviciosSoporteTI: "¿Qué incluye tu soporte?",
      tiposEquipoSoporte: "¿Qué equipos atiendes?",
      serviciosReparacion: "¿Qué reparaciones realizas?",
      tiempoRespuestaSoporte: "¿En cuánto respondes normalmente?",
      coberturaGeografica: "¿Dónde das servicio presencial?",
    },
    textosAyuda: {
      serviciosSoporteTI: "Helpdesk, instalación, configuración, backup, recuperación de datos…",
      serviciosReparacion: "Formateo, cambio de piezas, limpieza, diagnóstico, upgrade RAM/SSD…",
      garantiaServicio: "Ej. 30 días en mano de obra · 90 días en piezas",
      coberturaGeografica: "Colonias o municipios — o indica si es 100% remoto.",
      modalidadServicioTI: "Remoto por AnyDesk/TeamViewer, visita a domicilio o en tu taller.",
    },
    fieldOptions: {
      ...B_SOPORTE.fieldOptions,
      serviciosSoporteTI: [
        "Soporte remoto",
        "Soporte presencial",
        "Instalación de software",
        "Configuración de red",
        "Backup y recuperación",
        "Migración de datos",
        "Capacitación básica",
        "Otro",
      ],
      tiposEquipoSoporte: [
        "PC Windows",
        "Mac",
        "Laptop",
        "Servidor",
        "Impresora",
        "Red doméstica",
        "Red empresarial",
        "Otro",
      ],
      serviciosReparacion: [
        "Diagnóstico",
        "Formateo e instalación",
        "Cambio de disco/SSD",
        "Upgrade RAM",
        "Limpieza interna",
        "Reparación pantalla/teclado",
        "Eliminación malware",
        "Otro",
      ],
      tiposClientesSoporte: ["Personas", "PyME", "Home office", "Escuelas", "Otro"],
    },
  },
  "tecnico-en-computadoras": {
    ...B_SOPORTE,
    blockTitle: "Técnico en computadoras",
    blockHint: "Reparación, mantenimiento y armado — detalla equipos y garantías.",
    aliasPlaceholder: "Ej. Técnico PC · Reparación y armado",
    fieldLabels: {
      serviciosReparacion: "Reparaciones y mantenimiento",
      tiposEquipoSoporte: "Equipos que reparas",
    },
    textosAyuda: {
      serviciosReparacion: "Armado de PC, cambio de componentes, soldadura básica, recuperación…",
      garantiaServicio: "Indica garantía de mano de obra y piezas si aplica.",
    },
    fieldOptions: {
      ...B_SOPORTE.fieldOptions,
      serviciosSoporteTI: [
        "Reparación de PC/laptop",
        "Armado de computadoras",
        "Mantenimiento preventivo",
        "Instalación SO",
        "Recuperación de datos",
        "Venta de refacciones",
        "Otro",
      ],
      tiposEquipoSoporte: ["Desktop", "Laptop", "All-in-one", "Gaming", "Workstation", "Otro"],
      serviciosReparacion: [
        "Cambio SSD/HDD",
        "Cambio pantalla",
        "Teclado / touchpad",
        "Fuente de poder",
        "Placa base",
        "Limpieza y pasta térmica",
        "Otro",
      ],
    },
  },
  "soporte-empresarial-ti": {
    ...B_SOPORTE,
    ...E_NEGOCIO,
    blockTitle: "Soporte empresarial TI",
    blockHint: "Helpdesk, mesa de ayuda o outsourcing TI — SLA y cobertura son clave.",
    aliasPlaceholder: "Ej. Soporte Empresarial TI · SLA 4 h",
    extraFields: [
      "serviciosSoporteTI",
      "tiposEquipoSoporte",
      "serviciosReparacion",
      "modalidadServicioTI",
      "tiempoRespuestaSoporte",
      "tamanoEmpresaAtendida",
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "diferenciadorProfesional",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
    ],
    obligatoriosExtra: [
      "serviciosEmpresaTI",
      "serviciosSoporteTI",
      "tiempoRespuestaSoporte",
      "coberturaGeografica",
      "tamanoEmpresaAtendida",
    ],
    fieldOptions: {
      ...B_SOPORTE.fieldOptions,
      ...E_NEGOCIO.fieldOptions,
      serviciosSoporteTI: [
        "Mesa de ayuda",
        "Soporte N1/N2/N3",
        "Monitoreo 24/7",
        "Administración servidores",
        "Backup empresarial",
        "Onboarding equipos",
        "Otro",
      ],
      serviciosEmpresaTI: [
        "Outsourcing TI",
        "Helpdesk",
        "Infraestructura",
        "Microsoft 365 / Google Workspace",
        "SLA garantizado",
        "Otro",
      ],
      tiposEquipoSoporte: ["Workstation", "Servidor", "Red LAN/WAN", "Firewall", "Impresoras", "Otro"],
    },
  },
  "community-manager": {
    ...C_MARKETING,
    blockTitle: "Community manager",
    aliasPlaceholder: "Ej. Community Manager · Restaurantes y retail",
    fieldOptions: {
      ...C_MARKETING.fieldOptions,
      serviciosMarketingDigital: [
        "Gestión de redes",
        "Calendario de contenido",
        "Atención a comunidad",
        "Reportes mensuales",
        "Crisis communication",
        "Otro",
      ],
      canalesMarketing: ["Instagram", "Facebook", "TikTok", "LinkedIn", "X / Twitter", "YouTube", "Otro"],
      especialidadMarketing: ["B2C", "B2B", "Restaurantes", "Retail", "Servicios", "Otro"],
    },
  },
  "especialista-seo": {
    ...C_MARKETING,
    blockTitle: "Especialista SEO",
    aliasPlaceholder: "Ej. SEO Local · PyME y e-commerce",
    fieldOptions: {
      ...C_MARKETING.fieldOptions,
      serviciosMarketingDigital: [
        "Auditoría SEO",
        "SEO on-page",
        "SEO técnico",
        "Link building",
        "SEO local",
        "Migración SEO",
        "Otro",
      ],
      canalesMarketing: ["Google Search", "Google Business", "Bing", "Marketplaces", "Otro"],
    },
  },
  "especialista-sem": {
    ...C_MARKETING,
    blockTitle: "Especialista SEM",
    aliasPlaceholder: "Ej. Google Ads · Meta Ads certificado",
    fieldOptions: {
      ...C_MARKETING.fieldOptions,
      serviciosMarketingDigital: [
        "Google Ads",
        "Meta Ads",
        "Remarketing",
        "Shopping ads",
        "Optimización ROAS",
        "Otro",
      ],
      canalesMarketing: ["Google Ads", "Meta", "LinkedIn Ads", "TikTok Ads", "Otro"],
    },
  },
  "administrador-de-redes-sociales": {
    ...C_MARKETING,
    blockTitle: "Administrador de redes sociales",
    aliasPlaceholder: "Ej. Social Media · Contenido y pauta",
    fieldOptions: {
      ...C_MARKETING.fieldOptions,
      serviciosMarketingDigital: [
        "Publicación diaria",
        "Diseño básico de posts",
        "Copywriting",
        "Hashtag strategy",
        "Análisis de métricas",
        "Otro",
      ],
    },
  },
  "creador-de-contenido-digital": {
    ...C_MARKETING,
    blockTitle: "Creador de contenido digital",
    aliasPlaceholder: "Ej. Creador UGC · TikTok y Reels",
    fieldOptions: {
      ...C_MARKETING.fieldOptions,
      serviciosMarketingDigital: [
        "UGC",
        "Reels / TikTok",
        "YouTube",
        "Podcast",
        "Newsletter",
        "Live streaming",
        "Otro",
      ],
      canalesMarketing: ["TikTok", "Instagram", "YouTube", "Twitch", "LinkedIn", "Otro"],
    },
  },
  "especialista-en-ciberseguridad-independiente": {
    ...D_CONSULTORIA,
    blockTitle: "Ciberseguridad independiente",
    blockHint: "Servicios de seguridad — no prometas resultados imposibles ni acceso no autorizado.",
    aliasPlaceholder: "Ej. Pentester · OWASP y hardening",
    fieldOptions: {
      ...D_CONSULTORIA.fieldOptions,
      serviciosCiberseguridad: [
        "Pentesting",
        "Análisis de vulnerabilidades",
        "Hardening",
        "Respuesta a incidentes",
        "Awareness training",
        "Otro",
      ],
      certificacionesSeguridad: ["CEH", "OSCP", "CompTIA Security+", "ISO 27001", "CISSP", "Otro"],
    },
  },
  "consultor-it": {
    ...D_CONSULTORIA,
    blockTitle: "Consultor IT",
    aliasPlaceholder: "Ej. Consultor IT · Infraestructura y nube",
    fieldOptions: {
      ...D_CONSULTORIA.fieldOptions,
      areasConsultoriaTI: [
        "Infraestructura",
        "Nube",
        "Redes",
        "Microsoft 365",
        "Virtualización",
        "Transformación digital",
        "Otro",
      ],
      serviciosConsultoriaTI: [
        "Diagnóstico TI",
        "Roadmap tecnológico",
        "Selección de proveedores",
        "Implementación",
        "Capacitación",
        "Otro",
      ],
    },
  },
  "consultoria-tecnologica": {
    ...D_CONSULTORIA,
    blockTitle: "Consultoría tecnológica",
    aliasPlaceholder: "Ej. Consultoría Tech · Estrategia digital",
    fieldOptions: {
      ...D_CONSULTORIA.fieldOptions,
      areasConsultoriaTI: ["Estrategia", "Procesos", "Arquitectura", "Datos", "Innovación", "Otro"],
      industriasAtendidas: ["Retail", "Manufactura", "Servicios", "Salud", "Finanzas", "Otro"],
    },
  },
  "ciberseguridad-empresarial": {
    ...D_CONSULTORIA,
    ...E_NEGOCIO,
    blockTitle: "Ciberseguridad empresarial",
    aliasPlaceholder: "Ej. Ciberseguridad Corp · SOC y compliance",
    extraFields: [
      "serviciosCiberseguridad",
      "certificacionesSeguridad",
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "tamanoEmpresaAtendida",
      "diferenciadorProfesional",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
    ],
    obligatoriosExtra: ["serviciosEmpresaTI", "serviciosCiberseguridad", "tamanoEmpresaAtendida"],
    fieldOptions: {
      ...D_CONSULTORIA.fieldOptions,
      ...E_NEGOCIO.fieldOptions,
      serviciosEmpresaTI: [
        "SOC",
        "MDR",
        "Compliance",
        "Auditoría de seguridad",
        "IAM",
        "Otro",
      ],
    },
  },
  "agencia-de-marketing-digital": {
    ...E_NEGOCIO,
    blockTitle: "Agencia de marketing digital",
    aliasPlaceholder: "Ej. Agencia Digital · Performance y branding",
    fieldOptions: {
      ...E_NEGOCIO.fieldOptions,
      serviciosEmpresaTI: [
        "Branding digital",
        "Performance marketing",
        "Social media",
        "SEO / SEM",
        "Producción de contenido",
        "Otro",
      ],
      especialidadesEmpresaTI: ["B2B", "B2C", "E-commerce", "Restaurantes", "Startups"],
    },
  },
  "agencia-seo": {
    ...E_NEGOCIO,
    blockTitle: "Agencia SEO",
    aliasPlaceholder: "Ej. Agencia SEO · Posicionamiento orgánico",
    fieldOptions: {
      ...E_NEGOCIO.fieldOptions,
      serviciosEmpresaTI: [
        "SEO técnico",
        "Content SEO",
        "Link building",
        "SEO local",
        "Consultoría SEO",
        "Otro",
      ],
    },
  },
  "agencia-de-publicidad-digital": {
    ...E_NEGOCIO,
    blockTitle: "Agencia de publicidad digital",
    aliasPlaceholder: "Ej. Publicidad Digital · Campañas 360",
    fieldOptions: {
      ...E_NEGOCIO.fieldOptions,
      serviciosEmpresaTI: [
        "Campañas display",
        "Video ads",
        "Influencer marketing",
        "Medios programáticos",
        "Creatividad digital",
        "Otro",
      ],
    },
  },
  "venta-de-equipo-de-computo": {
    ...E_NEGOCIO,
    blockTitle: "Venta de equipo de cómputo",
    aliasPlaceholder: "Ej. Cómputo Empresarial · Venta y renta",
    fieldOptions: {
      ...E_NEGOCIO.fieldOptions,
      serviciosEmpresaTI: [
        "Venta de equipos",
        "Renta de equipos",
        "Armado a medida",
        "Licencias software",
        "Garantía extendida",
        "Otro",
      ],
      especialidadesEmpresaTI: ["Desktop", "Laptop", "Servidor", "Periféricos", "Redes"],
    },
  },
  "disenador-grafico": {
    ...F_CREATIVE,
    blockTitle: "Diseñador gráfico",
    aliasPlaceholder: "Ej. Diseño Gráfico · Branding e ilustración",
    fieldOptions: {
      ...F_CREATIVE.fieldOptions,
      serviciosCreativosTI: [
        "Logotipo",
        "Identidad visual",
        "Packaging",
        "Ilustración",
        "Editorial",
        "Otro",
      ],
      especialidadCreativaTI: ["Branding", "Editorial", "Digital", "Packaging", "Motion", "Otro"],
    },
  },
  "disenador-ux-ui": {
    ...F_CREATIVE,
    blockTitle: "Diseñador UX/UI",
    aliasPlaceholder: "Ej. UX/UI · Apps y productos digitales",
    fieldOptions: {
      ...F_CREATIVE.fieldOptions,
      serviciosCreativosTI: [
        "UX research",
        "Wireframes",
        "UI design",
        "Design system",
        "Prototipo interactivo",
        "Otro",
      ],
      especialidadCreativaTI: ["Mobile", "Web", "SaaS", "E-commerce", "Dashboard", "Otro"],
    },
  },
  "editor-de-video": {
    ...F_CREATIVE,
    blockTitle: "Editor de video",
    aliasPlaceholder: "Ej. Editor de Video · Reels y YouTube",
    fieldOptions: {
      ...F_CREATIVE.fieldOptions,
      serviciosCreativosTI: [
        "Edición long-form",
        "Reels / Shorts",
        "Motion graphics",
        "Color grading",
        "Subtítulos",
        "Otro",
      ],
    },
  },
  "produccion-audiovisual": {
    ...F_CREATIVE,
    blockTitle: "Producción audiovisual",
    aliasPlaceholder: "Ej. Producción Audiovisual · Comercial y corporativo",
    fieldOptions: {
      ...F_CREATIVE.fieldOptions,
      serviciosCreativosTI: [
        "Video corporativo",
        "Comercial",
        "Streaming",
        "Fotografía de producto",
        "Postproducción",
        "Otro",
      ],
    },
  },
  "estudio-de-diseno": {
    ...F_CREATIVE,
    blockTitle: "Estudio de diseño",
    aliasPlaceholder: "Ej. Estudio Creativo · Branding y digital",
    fieldOptions: {
      ...F_CREATIVE.fieldOptions,
      serviciosCreativosTI: [
        "Branding",
        "Diseño web",
        "Packaging",
        "Producción gráfica",
        "Consultoría creativa",
        "Otro",
      ],
    },
  },
  "redes-y-telecomunicaciones": {
    ...F_INFRA,
    blockTitle: "Redes y telecomunicaciones",
    aliasPlaceholder: "Ej. Redes y Telecom · Cableado estructurado",
    fieldOptions: {
      ...F_INFRA.fieldOptions,
      serviciosInfraTI: [
        "Cableado estructurado",
        "WiFi empresarial",
        "VPN",
        "VoIP",
        "Fibra óptica",
        "Otro",
      ],
      plataformasInfra: ["Cisco", "Ubiquiti", "Mikrotik", "Fortinet", "Otro"],
    },
  },
  "hosting-y-dominios": {
    ...F_INFRA,
    ...E_NEGOCIO,
    blockTitle: "Hosting y dominios",
    aliasPlaceholder: "Ej. Hosting MX · Dominios y correo",
    extraFields: [
      "serviciosInfraTI",
      "plataformasInfra",
      "serviciosEmpresaTI",
      "especialidadesEmpresaTI",
      "diferenciadorProfesional",
      "colaboracionesComerciales",
      "tiposColaboracionComercial",
    ],
    obligatoriosExtra: ["serviciosEmpresaTI", "serviciosInfraTI", "plataformasInfra"],
    fieldOptions: {
      ...F_INFRA.fieldOptions,
      ...E_NEGOCIO.fieldOptions,
      serviciosInfraTI: [
        "Registro de dominios",
        "Hosting compartido",
        "VPS",
        "Servidor dedicado",
        "Correo empresarial",
        "SSL",
        "Otro",
      ],
      serviciosEmpresaTI: ["Hosting", "Dominios", "DNS", "Backup web", "Migración", "Otro"],
      plataformasInfra: ["cPanel", "Plesk", "Cloudflare", "AWS", "Google Cloud", "Otro"],
    },
  },
  "servicios-cloud": {
    ...F_INFRA,
    blockTitle: "Servicios cloud",
    aliasPlaceholder: "Ej. Cloud Consulting · AWS y Azure",
    fieldOptions: {
      ...F_INFRA.fieldOptions,
      serviciosInfraTI: [
        "Migración a nube",
        "Arquitectura cloud",
        "DevOps",
        "Monitoreo",
        "Optimización costos",
        "Otro",
      ],
      plataformasInfra: ["AWS", "Azure", "Google Cloud", "DigitalOcean", "Oracle Cloud", "Otro"],
    },
  },
};

for (const subId of Object.keys(SUB_EXTRA_PROFILES)) {
  SUB_EXTRA_PROFILES[subId] = mergeEnrichmentV2(SUB_EXTRA_PROFILES[subId], subId);
  SUB_EXTRA_PROFILES[subId].hideFields = mergeHideAdultLeaks(SUB_EXTRA_PROFILES[subId].hideFields || []);
}
