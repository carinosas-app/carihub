/**
 * MP-PROFESIONALES-ENRICH-V2 — copy, hints y campos distintivos por sub (50).
 * Se fusiona sobre SUB_EXTRA_PROFILES en profesionales-sub-extra-fields.mjs
 */

/** Campos nuevos reutilizables — copy profesional, no escort */
export const ENRICH_FIELD_OPTIONS = {
  tiempoRespuestaConsulta: [
    { value: "mismo_dia", label: "Mismo día hábil" },
    { value: "24_48h", label: "24–48 horas" },
    { value: "3_5_dias", label: "3–5 días hábiles" },
    { value: "por_cita", label: "Solo con cita agendada" },
  ],
  regimenesFiscales: [
    "RESICO",
    "Régimen general personas morales",
    "Régimen general personas físicas",
    "Actividad empresarial",
    "Plataformas digitales",
    "Cooperativas",
    "No lucrativas",
    "Otro",
  ],
  instanciasJudiciales: [
    "Primera instancia",
    "Segunda instancia / apelación",
    "Juicio oral",
    "Amparo",
    "Mediación / conciliación",
    "Arbitraje",
    "Otro",
  ],
  estilosArquitectonicos: [
    "Contemporáneo",
    "Minimalista",
    "Industrial",
    "Colonial / tradicional",
    "Sustentable / bioclimático",
    "Comercial / retail",
    "Otro",
  ],
  tiposPolizaSeguros: [
    "Gastos médicos mayores",
    "Vida",
    "Auto",
    "Daños empresariales",
    "Responsabilidad civil",
    "Fianzas",
    "Otro",
  ],
  colaboracionesComerciales: [
    { value: "si_activo", label: "Sí, colaboro activamente" },
    { value: "ocasional", label: "Ocasionalmente" },
    { value: "convenir", label: "A convenir por proyecto" },
    { value: "no", label: "No por ahora" },
  ],
  tiposColaboracionComercial: [
    "Otros profesionales",
    "Empresas / marcas",
    "Despachos aliados",
    "Proveedores",
    "Freelancers",
    "Instituciones",
    "Otro",
  ],
  metodologiasConsultoria: [
    "Diagnóstico + plan de acción",
    "Acompañamiento mensual",
    "Proyecto por entregables",
    "Workshops intensivos",
    "Retainer / fee mensual",
    "Otro",
  ],
  tiposEntregablesCreativos: [
    "Archivos editables",
    "Manual de uso de marca",
    "Sesión de presentación",
    "Revisiones incluidas",
    "Licencia comercial",
    "Otro",
  ],
};

const COMMON_EXTRA = [
  "diferenciadorProfesional",
  "coberturaGeografica",
  "colaboracionesComerciales",
];

/** @type {Record<string, object>} */
export const SUB_ENRICHMENT_V2 = {
  abogados: {
    blockHint: "Tu perfil legal en CariHub — cuéntanos en qué casos eres la mejor opción para quien te busca.",
    fieldLabels: {
      areasDerecho: "¿En qué ramas del derecho ejerces?",
      tiposClientesLegales: "¿A quién sueles representar o asesorar?",
      serviciosLegales: "¿Qué puedes hacer por tu cliente desde el primer contacto?",
      especialidadProfesional: "Tu especialidad principal (como la publicarías)",
    },
    textosAyuda: {
      nombreProfesional: "Ej. Lic. Ana Torres · Derecho familiar y sucesiones",
      especialidadProfesional: "La especialidad que quieres destacar en resultados — coherente con tu cédula.",
      areasDerecho: "Marca solo las áreas donde realmente tomas casos hoy.",
      serviciosLegales: "Consulta, demanda, contratos, mediación… lo que ofreces de forma clara.",
      modalidadAtencionProfesional: "Oficina, videollamada, híbrido o visita al cliente — sin confundir con otros servicios.",
      diferenciadorProfesional: "Ej. Más de 200 divorcios amistosos · Atención empática sin tecnicismos",
      instanciasJudiciales: "¿En qué etapas del proceso te sientes más fuerte?",
      coberturaGeografica: "Ej. CDMX, Edomex y audiencias en Pachuca",
      precioConsulta: "Honorarios desde — puedes indicar si la primera consulta tiene costo distinto.",
    },
    extraFields: [...COMMON_EXTRA, "instanciasJudiciales", "tiempoRespuestaConsulta", "tiposColaboracionComercial"],
    fieldOptions: {
      areasDerecho: [
        "Civil",
        "Familiar",
        "Sucesiones",
        "Penal",
        "Laboral",
        "Mercantil",
        "Fiscal",
        "Amparo",
        "Migratorio",
        "Propiedad intelectual",
        "Inmobiliario",
        "Otro",
      ],
      serviciosLegales: [
        "Consulta legal inicial",
        "Representación judicial",
        "Elaboración de contratos",
        "Mediación / conciliación",
        "Amparo",
        "Asesoría preventiva",
        "Revisión de documentos",
        "Otro",
      ],
      instanciasJudiciales: ENRICH_FIELD_OPTIONS.instanciasJudiciales,
      tiempoRespuestaConsulta: ENRICH_FIELD_OPTIONS.tiempoRespuestaConsulta,
    },
  },
  contadores: {
    blockHint: "Publica cómo ayudas a ordenar finanzas y cumplir con el SAT — tu experiencia vale.",
    fieldLabels: {
      serviciosContables: "¿Qué servicios contables ofreces?",
      tiposClientesContables: "¿Qué tipo de negocios o personas atiendes?",
      especialidadProfesional: "Tu enfoque contable (PyME, nóminas, fiscal…)",
    },
    textosAyuda: {
      serviciosContables: "Contabilidad, nóminas, declaraciones, auditoría interna…",
      regimenesFiscales: "Marca los regímenes que realmente dominas — genera confianza.",
      diferenciadorProfesional: "Ej. Especialista en restaurantes y RESICO · Respuesta en 24 h",
      coberturaGeografica: "Ciudad o zona donde atiendes presencialmente, si aplica.",
      precioConsulta: "Honorarios mensuales o por servicio — sé claro para evitar malentendidos.",
    },
    extraFields: [...COMMON_EXTRA, "regimenesFiscales", "tiempoRespuestaConsulta"],
    fieldOptions: {
      serviciosContables: [
        "Contabilidad mensual",
        "Nóminas e IMSS",
        "Declaraciones mensuales y anuales",
        "Facturación electrónica (CFDI)",
        "Estados financieros",
        "Auditoría interna",
        "Conciliaciones bancarias",
        "Devoluciones y compensaciones",
        "Otro",
      ],
      regimenesFiscales: ENRICH_FIELD_OPTIONS.regimenesFiscales,
      tiempoRespuestaConsulta: ENRICH_FIELD_OPTIONS.tiempoRespuestaConsulta,
    },
  },
  ingenieros: {
    blockHint: "Muestra tu expertise técnico — proyectos, dictámenes y supervisión que sí entregas.",
    fieldLabels: {
      especialidadTecnica: "¿Qué tipo de ingeniería practicas?",
      serviciosTecnicos: "¿Qué entregables o servicios ofreces?",
      softwareHerramientas: "Software, normas o herramientas que dominas",
    },
    textosAyuda: {
      especialidadTecnica: "Civil, estructural, industrial, eléctrica…",
      serviciosTecnicos: "Dictamen, proyecto ejecutivo, supervisión, peritaje…",
      softwareHerramientas: "Ej. AutoCAD, SAP2000, ETABS, Revit, normas NOM",
      diferenciadorProfesional: "Ej. 15 años en naves industriales · Cálculo estructural certificado",
      coberturaGeografica: "Estados o regiones donde tomas obra o visitas técnicas.",
    },
    extraFields: [...COMMON_EXTRA],
    fieldOptions: {
      serviciosTecnicos: [
        "Dictamen técnico",
        "Proyecto ejecutivo",
        "Supervisión de obra",
        "Cálculo estructural",
        "Estudio de mecánica de suelos",
        "Peritaje judicial",
        "Consultoría de normas",
        "Otro",
      ],
    },
  },
  "despachos-juridicos": {
    blockHint: "Presenta tu firma: áreas fuertes, tamaño de equipo y cómo atienden corporativos y particulares.",
    fieldLabels: {
      serviciosDespacho: "Servicios legales del despacho",
      areasPracticaDespacho: "Áreas donde el despacho tiene más experiencia",
      tamanoEquipoDespacho: "¿Cuántos abogados integran el equipo?",
    },
    textosAyuda: {
      alias: "Nombre comercial del despacho — cómo quieres que te encuentren.",
      serviciosDespacho: "Litigio, corporativo, compliance, mediación…",
      instanciasJudiciales: "Etapas procesales donde el despacho tiene más casos ganados o activos.",
      diferenciadorProfesional: "Ej. Boutique mercantil · Respuesta ejecutiva en 24 h",
      coberturaGeografica: "Oficinas y ciudades donde litigan o asesoran.",
    },
    extraFields: [...COMMON_EXTRA, "instanciasJudiciales"],
    fieldOptions: {
      instanciasJudiciales: ENRICH_FIELD_OPTIONS.instanciasJudiciales,
    },
  },
  "despachos-contables": {
    blockHint: "Tu despacho contable en detalle — sectores, regímenes y servicios integrales.",
    fieldLabels: {
      serviciosDespacho: "Servicios contables y fiscales del despacho",
      areasPracticaDespacho: "Sectores o tipos de cliente fuerte del despacho",
    },
    textosAyuda: {
      serviciosDespacho: "Outsourcing, auditoría, nóminas, declaraciones…",
      regimenesFiscales: "Regímenes que el despacho maneja con plantilla especializada.",
      diferenciadorProfesional: "Ej. 120 PyMEs en retail · Portal de documentos 24/7",
      coberturaGeografica: "Sucursales o zonas de cobertura presencial.",
    },
    extraFields: [...COMMON_EXTRA, "regimenesFiscales"],
    fieldOptions: {
      regimenesFiscales: ENRICH_FIELD_OPTIONS.regimenesFiscales,
      areasPracticaDespacho: [
        "PyME",
        "Corporativo",
        "Personas físicas",
        "Restaurantes y hospitalidad",
        "Construcción",
        "Comercio y retail",
        "Manufactura",
        "Tecnología",
        "Otro",
      ],
    },
  },
  "despachos-de-arquitectura": {
    blockHint: "Comparte el estilo y tipo de proyectos de tu estudio — residencial, comercial o institucional.",
    fieldLabels: {
      serviciosDespacho: "Servicios del estudio de arquitectura",
      areasPracticaDespacho: "Tipos de proyecto que más diseñan",
    },
    textosAyuda: {
      estilosArquitectonicos: "Estilos con los que tu estudio se identifica en portafolio.",
      diferenciadorProfesional: "Ej. Diseño sustentable certificado · Desde concepto hasta obra",
      coberturaGeografica: "Ciudades donde desarrollan proyectos.",
    },
    extraFields: [...COMMON_EXTRA, "estilosArquitectonicos"],
    fieldOptions: {
      estilosArquitectonicos: ENRICH_FIELD_OPTIONS.estilosArquitectonicos,
    },
  },
  "despachos-de-ingenieria": {
    blockHint: "Describe las disciplinas y entregables de tu firma de ingeniería.",
    fieldLabels: {
      serviciosDespacho: "Servicios de ingeniería del despacho",
      areasPracticaDespacho: "Disciplinas de ingeniería del equipo",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Firma multidisciplinaria · Proyectos industriales llave en mano",
      coberturaGeografica: "Regiones de operación y supervisión de obra.",
      softwareHerramientas: "Herramientas de cálculo y modelado del equipo.",
    },
    extraFields: [...COMMON_EXTRA, "softwareHerramientas"],
  },
  "asesoria-fiscal": {
    blockHint: "Ayuda a tus clientes a entender tu valor fiscal — planeación, defensa y cumplimiento.",
    fieldLabels: {
      serviciosFiscalesLegales: "Servicios de asesoría fiscal",
      tiposClientesProfesionales: "Perfil de clientes que más atiendes",
    },
    textosAyuda: {
      serviciosFiscalesLegales: "Planeación, declaraciones, defensa, CFDI…",
      regimenesFiscales: "Regímenes donde tienes mayor experiencia.",
      diferenciadorProfesional: "Ej. Defensa SAT exitosa · Especialista PyME en RESICO",
      coberturaGeografica: "Zona de atención presencial o videollamada.",
    },
    extraFields: [...COMMON_EXTRA, "regimenesFiscales", "tiempoRespuestaConsulta"],
    fieldOptions: {
      regimenesFiscales: ENRICH_FIELD_OPTIONS.regimenesFiscales,
      tiempoRespuestaConsulta: ENRICH_FIELD_OPTIONS.tiempoRespuestaConsulta,
    },
  },
  auditoria: {
    blockHint: "Publica el tipo de auditorías y revisiones que realizas — financiera, fiscal o interna.",
    fieldLabels: {
      serviciosFiscalesLegales: "Tipos de auditoría y revisión",
    },
    textosAyuda: {
      serviciosFiscalesLegales: "Auditoría financiera, fiscal, due diligence…",
      diferenciadorProfesional: "Ej. Auditorías ISO + financieras · Sectores regulados",
      coberturaGeografica: "Alcance geográfico de tus auditorías.",
    },
    extraFields: [...COMMON_EXTRA, "tiempoRespuestaConsulta"],
    fieldOptions: {
      tiempoRespuestaConsulta: ENRICH_FIELD_OPTIONS.tiempoRespuestaConsulta,
    },
  },
  notarias: {
    blockHint: "Indica qué actos notariales tramitas — escrituras, sociedades, testamentos y más.",
    fieldLabels: {
      serviciosFiscalesLegales: "Actos y servicios notariales",
    },
    textosAyuda: {
      serviciosFiscalesLegales: "Escrituras, poderes, sociedades, testamentos…",
      diferenciadorProfesional: "Ej. Notaría céntrica · Trámites express con cita",
      coberturaGeografica: "Ubicación y zona de influencia de la notaría.",
      modalidadAtencionProfesional: "Presencial en notaría; algunos trámites pueden iniciarse en línea.",
    },
    extraFields: [...COMMON_EXTRA, "tiempoRespuestaConsulta"],
    fieldOptions: {
      tiempoRespuestaConsulta: ENRICH_FIELD_OPTIONS.tiempoRespuestaConsulta,
    },
  },
  "corredurias-publicas": {
    blockHint: "Servicios de fe pública y certificación — qué documentos y trámites gestionas.",
    fieldLabels: {
      serviciosFiscalesLegales: "Servicios de correduría pública",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Certificación same-day · Atención corporativa",
      coberturaGeografica: "Ciudad de la correduría y clientes que atiendes.",
    },
    extraFields: [...COMMON_EXTRA],
  },
  "gestoria-y-tramites": {
    blockHint: "Lista los trámites que resuelves — vehiculares, permisos, empresariales y más.",
    fieldLabels: {
      serviciosFiscalesLegales: "Trámites generales",
      serviciosTramites: "Categorías de trámites",
    },
    textosAyuda: {
      serviciosTramites: "Vehicular, inmobiliario, empresarial, migratorio…",
      diferenciadorProfesional: "Ej. Gestoría express · Sin filas, entrega en 48 h",
      coberturaGeografica: "Municipios o estados donde gestionas trámites.",
    },
    extraFields: [...COMMON_EXTRA],
  },
  arquitectos: {
    blockHint: "Tu práctica arquitectónica — estilo, tipo de obra y servicios de diseño.",
    fieldLabels: {
      especialidadTecnica: "Tipo de arquitectura que desarrollas",
      serviciosTecnicos: "Servicios desde anteproyecto hasta supervisión",
    },
    textosAyuda: {
      estilosArquitectonicos: "Estilos que predominan en tu portafolio.",
      softwareHerramientas: "Ej. Revit, SketchUp, Lumion, AutoCAD",
      diferenciadorProfesional: "Ej. Remodelaciones residenciales de lujo · Entrega en 6 semanas",
      coberturaGeografica: "Zona donde desarrollas proyectos.",
    },
    extraFields: [...COMMON_EXTRA, "estilosArquitectonicos"],
    fieldOptions: {
      estilosArquitectonicos: ENRICH_FIELD_OPTIONS.estilosArquitectonicos,
    },
  },
  topografia: {
    blockHint: "Detalla levantamientos, replanteos y tecnología — drone, GPS, estación total.",
    fieldLabels: {
      especialidadTecnica: "Especialidad topográfica",
      serviciosTecnicos: "Servicios de levantamiento",
    },
    textosAyuda: {
      softwareHerramientas: "Ej. Drone, estación total, GPS RTK, Civil 3D",
      diferenciadorProfesional: "Ej. Levantamientos en 24 h · Planos para licencia de construcción",
      coberturaGeografica: "Radio de cobertura para trabajo de campo.",
    },
    extraFields: [...COMMON_EXTRA, "softwareHerramientas"],
  },
  avaluos: {
    blockHint: "Tipos de avalúo y destino — bancario, fiscal, comercial o judicial.",
    fieldLabels: {
      especialidadTecnica: "Tipos de bien que avalúas",
      serviciosTecnicos: "Tipos de avalúo que emitas",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Avalúos bancarios certificados · Entrega en 5 días hábiles",
      coberturaGeografica: "Estados o municipios donde realizas avalúos.",
    },
    extraFields: [...COMMON_EXTRA, "tiempoRespuestaConsulta"],
    fieldOptions: {
      tiempoRespuestaConsulta: ENRICH_FIELD_OPTIONS.tiempoRespuestaConsulta,
    },
  },
  peritos: {
    blockHint: "Tu pericia — construcción, contable, grafoscopía o informática para juicios y seguros.",
    fieldLabels: {
      especialidadTecnica: "Rama de pericia",
      serviciosTecnicos: "Servicios periciales",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Perito judicial en construcción · 300+ dictámenes",
      coberturaGeografica: "Tribunales o ciudades donde das servicio pericial.",
    },
    extraFields: [...COMMON_EXTRA],
  },
  "consultoria-financiera": {
    blockHint: "Cómo mejoras las finanzas de empresas — diagnóstico, flujo y reestructura.",
    fieldLabels: {
      areasConsultoria: "Áreas financieras de consultoría",
      serviciosConsultoria: "Servicios concretos",
      industriasAtendidas: "Industrias con las que tienes más casos",
    },
    textosAyuda: {
      metodologiasConsultoria: "Cómo trabajas: diagnóstico, retainer, proyecto cerrado…",
      diferenciadorProfesional: "Ej. CFO fractional para PyME · Resultados en 90 días",
      coberturaGeografica: "Presencial o remoto — indica alcance.",
    },
    extraFields: [...COMMON_EXTRA, "metodologiasConsultoria"],
    fieldOptions: {
      metodologiasConsultoria: ENRICH_FIELD_OPTIONS.metodologiasConsultoria,
    },
  },
  "consultoria-de-negocios": {
    blockHint: "Estrategia, operaciones y procesos — qué transformación ofreces.",
    fieldLabels: {
      areasConsultoria: "Frentes de consultoría de negocios",
      serviciosConsultoria: "Entregables típicos",
    },
    textosAyuda: {
      metodologiasConsultoria: "Formato de trabajo con tus clientes.",
      diferenciadorProfesional: "Ej. Consultoría lean para retail · +20% eficiencia promedio",
      coberturaGeografica: "Mercados o ciudades donde consultas.",
    },
    extraFields: [...COMMON_EXTRA, "metodologiasConsultoria"],
    fieldOptions: {
      metodologiasConsultoria: ENRICH_FIELD_OPTIONS.metodologiasConsultoria,
    },
  },
  "recursos-humanos": {
    blockHint: "Nóminas, clima, capacitación o compliance — tu propuesta de RH.",
    fieldLabels: {
      areasConsultoria: "Áreas de recursos humanos",
      serviciosConsultoria: "Servicios de RH que ofreces",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Outsourcing nóminas + IMSS sin errores · PyME",
      coberturaGeografica: "Cobertura presencial o remota.",
    },
    extraFields: [...COMMON_EXTRA, "metodologiasConsultoria"],
    fieldOptions: {
      metodologiasConsultoria: ENRICH_FIELD_OPTIONS.metodologiasConsultoria,
    },
  },
  "reclutamiento-y-seleccion": {
    blockHint: "Headhunting, evaluación y employer branding — define tu nicho de talento.",
    fieldLabels: {
      areasConsultoria: "Niveles o perfiles que reclutas",
      serviciosConsultoria: "Servicios de reclutamiento",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Ejecutivos C-level tech · Tiempo promedio de colocación 21 días",
      coberturaGeografica: "Mercados laborales donde buscas talento.",
    },
    extraFields: [...COMMON_EXTRA, "tiempoRespuestaConsulta"],
    fieldOptions: {
      tiempoRespuestaConsulta: ENRICH_FIELD_OPTIONS.tiempoRespuestaConsulta,
    },
  },
  "estudios-socioeconomicos": {
    blockHint: "Visitas domiciliarias, referencias y reportes — para arrendamiento, crédito o empleo.",
    fieldLabels: {
      areasConsultoria: "Destino del estudio socioeconómico",
      serviciosConsultoria: "Componentes del estudio",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Reporte en 24 h · Cobertura metropolitana",
      coberturaGeografica: "Zonas donde realizas visitas domiciliarias.",
    },
    extraFields: [...COMMON_EXTRA, "tiempoRespuestaConsulta"],
    fieldOptions: {
      tiempoRespuestaConsulta: ENRICH_FIELD_OPTIONS.tiempoRespuestaConsulta,
    },
  },
  "coaching-ejecutivo": {
    blockHint: "Liderazgo, transición de rol o equipos — cómo acompañas a directivos.",
    fieldLabels: {
      areasConsultoria: "Enfoques de coaching",
      serviciosConsultoria: "Formatos de sesión",
    },
    textosAyuda: {
      certificaciones: "Ej. ICF, metodologías, formación en liderazgo",
      diferenciadorProfesional: "Ej. Coach de directivos en transición · Sesiones bilingües",
      coberturaGeografica: "Presencial o videollamada — alcance.",
    },
    extraFields: [...COMMON_EXTRA, "metodologiasConsultoria"],
    fieldOptions: {
      metodologiasConsultoria: ENRICH_FIELD_OPTIONS.metodologiasConsultoria,
    },
  },
  "desarrollo-organizacional": {
    blockHint: "Cultura, cambio y clima — intervenciones organizacionales que lideras.",
    fieldLabels: {
      areasConsultoria: "Frentes de desarrollo organizacional",
      serviciosConsultoria: "Intervenciones que facilitas",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Transformación cultural post-fusión · Facilitación bilingüe",
      coberturaGeografica: "Empresas atendidas por región.",
    },
    extraFields: [...COMMON_EXTRA, "metodologiasConsultoria"],
  },
  franquicias: {
    blockHint: "Asesoría a franquiciantes o franquiciatarios — evaluación e implementación.",
    fieldLabels: {
      areasConsultoria: "Rol en el ecosistema de franquicias",
      serviciosConsultoria: "Servicios de asesoría",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. 30 aperturas de franquicia alimentos · Due diligence incluido",
      coberturaGeografica: "Regiones donde asesoras expansión.",
    },
    extraFields: [...COMMON_EXTRA],
  },
  "traduccion-e-interpretacion": {
    blockHint: "Idiomas, especialidad y modalidad — jurídico, médico, técnico o marketing.",
    fieldLabels: {
      serviciosCreativos: "Servicios de traducción / interpretación",
      especialidadCreativa: "Especialidad de contenido",
      idiomasServicio: "Idiomas en los que trabajas",
    },
    textosAyuda: {
      idiomasServicio: "Ej. Español ↔ inglés, francés, alemán",
      portfolioURL: "Muestras públicas o sitio con casos (sin datos confidenciales).",
      diferenciadorProfesional: "Ej. Traductor jurídico certificado · Entrega express 24 h",
      coberturaGeografica: "Interpretación presencial en qué ciudades.",
    },
    extraFields: [...COMMON_EXTRA, "portfolioURL", "tiempoRespuestaConsulta"],
    fieldOptions: {
      tiempoRespuestaConsulta: ENRICH_FIELD_OPTIONS.tiempoRespuestaConsulta,
    },
  },
  "marketing-y-publicidad": {
    blockHint: "Estrategia digital, paid media o branding — qué resultados prometes trabajar.",
    fieldLabels: {
      serviciosCreativos: "Servicios de marketing",
      especialidadCreativa: "Enfoque o nicho",
    },
    textosAyuda: {
      portfolioURL: "Casos, campañas o sitio con resultados (métricas si puedes).",
      tiposEntregablesCreativos: "Qué incluye tu servicio: reportes, creativos, revisiones…",
      diferenciadorProfesional: "Ej. Performance marketing PyME · ROAS documentado",
      coberturaGeografica: "Mercados o ciudades objetivo de tus campañas.",
    },
    extraFields: [...COMMON_EXTRA, "portfolioURL", "tiposEntregablesCreativos"],
    fieldOptions: {
      tiposEntregablesCreativos: ENRICH_FIELD_OPTIONS.tiposEntregablesCreativos,
    },
  },
  "diseno-grafico": {
    blockHint: "Identidad, packaging o editorial — tu estilo y entregables.",
    fieldLabels: {
      serviciosCreativos: "Servicios de diseño gráfico",
      especialidadCreativa: "Especialidad visual",
    },
    textosAyuda: {
      portfolioURL: "Behance, Dribbble o sitio con tu mejor trabajo.",
      tiposEntregablesCreativos: "Archivos, manual de marca, revisiones incluidas…",
      diferenciadorProfesional: "Ej. Branding para startups · Identidad en 2 semanas",
    },
    extraFields: [...COMMON_EXTRA, "portfolioURL", "tiposEntregablesCreativos"],
    fieldOptions: {
      tiposEntregablesCreativos: ENRICH_FIELD_OPTIONS.tiposEntregablesCreativos,
    },
  },
  "diseno-de-interiores": {
    blockHint: "Residencial, comercial u hospitalidad — concepto, proyecto y supervisión.",
    fieldLabels: {
      serviciosCreativos: "Servicios de interiorismo",
      especialidadCreativa: "Tipo de espacio que diseñas",
    },
    textosAyuda: {
      portfolioURL: "Antes/después o renders de proyectos reales.",
      diferenciadorProfesional: "Ej. Interiorismo residencial contemporáneo · 3D incluido",
      coberturaGeografica: "Ciudad donde desarrollas proyectos de interior.",
    },
    extraFields: [...COMMON_EXTRA, "portfolioURL"],
  },
  "branding-e-identidad-corporativa": {
    blockHint: "Naming, identidad y estrategia de marca — tu proceso creativo.",
    fieldLabels: {
      serviciosCreativos: "Servicios de branding",
      especialidadCreativa: "Tipo de marcas con las que trabajas",
    },
    textosAyuda: {
      portfolioURL: "Casos de rebranding o identidades completas.",
      tiposEntregablesCreativos: "Manual de marca, archivos, presentación…",
      diferenciadorProfesional: "Ej. Branding 360 para PyME · Workshop de posicionamiento",
    },
    extraFields: [...COMMON_EXTRA, "portfolioURL", "tiposEntregablesCreativos"],
  },
  "fotografia-profesional": {
    blockHint: "Producto, retrato, eventos o arquitectura — tu estilo fotográfico.",
    fieldLabels: {
      serviciosCreativos: "Tipos de sesión fotográfica",
      especialidadCreativa: "Estilo o industria",
    },
    textosAyuda: {
      portfolioURL: "Galería o Instagram profesional con tu mejor trabajo.",
      diferenciadorProfesional: "Ej. Foto de producto e-commerce · Estudio propio",
      coberturaGeografica: "Ciudades donde haces locación o tienes estudio.",
    },
    extraFields: [...COMMON_EXTRA, "portfolioURL"],
  },
  "produccion-de-video": {
    blockHint: "Corporativo, comercial o redes — preproducción, rodaje y post.",
    fieldLabels: {
      serviciosCreativos: "Tipos de producción",
      especialidadCreativa: "Género o industria",
    },
    textosAyuda: {
      portfolioURL: "Reel o canal con muestras de trabajo.",
      tiposEntregablesCreativos: "Formatos de entrega: 4K, vertical, subtítulos…",
      diferenciadorProfesional: "Ej. Spots PyME en 10 días · Drone incluido",
    },
    extraFields: [...COMMON_EXTRA, "portfolioURL", "tiposEntregablesCreativos"],
  },
  "relaciones-publicas": {
    blockHint: "Prensa, crisis o eventos — cómo posicionas marcas ante medios.",
    fieldLabels: {
      serviciosCreativos: "Servicios de relaciones públicas",
      especialidadCreativa: "Sector o tipo de cliente",
    },
    textosAyuda: {
      portfolioURL: "Casos de cobertura mediática o clips (si aplica).",
      diferenciadorProfesional: "Ej. Crisis communication 24/7 · Red de medios nacionales",
      coberturaGeografica: "Mercados donde gestionas prensa.",
    },
    extraFields: [...COMMON_EXTRA, "portfolioURL"],
  },
  "investigacion-de-mercados": {
    blockHint: "Encuestas, focus groups o mystery shopper — insights que entregas.",
    fieldLabels: {
      serviciosCreativos: "Metodologías de investigación",
      especialidadCreativa: "Industrias de especialidad",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Estudios quanti + quali · Entrega en 2 semanas",
      coberturaGeografica: "Cobertura geográfica de fieldwork.",
    },
    extraFields: [...COMMON_EXTRA, "metodologiasConsultoria"],
    fieldOptions: {
      metodologiasConsultoria: ENRICH_FIELD_OPTIONS.metodologiasConsultoria,
    },
  },
  seguros: {
    blockHint: "Broker o comparador — cotización, renovación y siniestros sin prometer aprobación.",
    fieldLabels: {
      serviciosFinancieros: "Servicios de seguros",
      aseguradorasRepresentadas: "Aseguradoras con las que trabajas",
    },
    textosAyuda: {
      aseguradorasRepresentadas: "Ej. GNP, AXA, MetLife — no garantices emisión.",
      tiposPolizaSeguros: "Ramos donde más cotizas.",
      diferenciadorProfesional: "Ej. Seguros empresariales PyME · Comparativa imparcial",
      coberturaGeografica: "Zona de atención a clientes.",
    },
    extraFields: [...COMMON_EXTRA, "tiposPolizaSeguros"],
    fieldOptions: {
      tiposPolizaSeguros: ENRICH_FIELD_OPTIONS.tiposPolizaSeguros,
    },
  },
  "agentes-de-seguros": {
    blockHint: "GMM, vida, auto o daños — aseguradoras que representas y a quién ayudas.",
    fieldLabels: {
      serviciosFinancieros: "Ramos de seguros",
      aseguradorasRepresentadas: "Aseguradoras que representas",
    },
    textosAyuda: {
      aseguradorasRepresentadas: "Lista las aseguradoras — sin prometer aprobación automática.",
      tiposPolizaSeguros: "Tipos de póliza que más colocas.",
      diferenciadorProfesional: "Ej. Agente GMM familiar · Asesoría sin costo de cotización",
      coberturaGeografica: "Ciudad o región de clientes.",
    },
    extraFields: [...COMMON_EXTRA, "tiposPolizaSeguros", "tiempoRespuestaConsulta"],
    obligatoriosExtra: ["aseguradorasRepresentadas", "tiposPolizaSeguros"],
    fieldOptions: {
      tiposPolizaSeguros: ENRICH_FIELD_OPTIONS.tiposPolizaSeguros,
      tiempoRespuestaConsulta: ENRICH_FIELD_OPTIONS.tiempoRespuestaConsulta,
    },
  },
  "asesoria-patrimonial": {
    blockHint: "Plan patrimonial, sucesión y diversificación — enfoque prudente, sin prometer rendimientos.",
    fieldLabels: {
      serviciosFinancieros: "Servicios de asesoría patrimonial",
    },
    textosAyuda: {
      serviciosFinancieros: "Plan patrimonial, sucesión, fideicomisos… No prometas rendimientos garantizados.",
      diferenciadorProfesional: "Ej. Planificación patrimonial familiar · Enfoque conservador",
      coberturaGeografica: "Presencial o remoto.",
    },
    extraFields: [...COMMON_EXTRA],
  },
  "asesoria-en-inversiones": {
    blockHint: "Portafolios y educación financiera — cumple normativa; no prometas rendimientos fijos.",
    fieldLabels: {
      serviciosFinancieros: "Servicios de inversión",
    },
    textosAyuda: {
      serviciosFinancieros: "Asesoría de portafolio, análisis de riesgo, educación financiera…",
      diferenciadorProfesional: "Ej. Asesor independiente · Perfil moderado/conservador",
      certificaciones: "Ej. AMIB, CIPM u otras relevantes",
    },
    extraFields: [...COMMON_EXTRA],
  },
  "comercio-internacional": {
    blockHint: "Aduanas, clasificación arancelaria y logística internacional.",
    fieldLabels: {
      serviciosFinancieros: "Servicios de comercio exterior",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Importación Asia–MX · Clasificación arancelaria especializada",
      coberturaGeografica: "Puertos, fronteras o países de operación.",
    },
    extraFields: [...COMMON_EXTRA],
  },
  "importacion-y-exportacion": {
    blockHint: "Agente aduanal, freight forwarder o trading — tu cadena de suministro.",
    fieldLabels: {
      serviciosFinancieros: "Servicios de import/export",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Despacho aduanal express · Cadena frío alimentos",
      coberturaGeografica: "Aduanas y rutas que manejas.",
    },
    extraFields: [...COMMON_EXTRA],
  },
  "certificaciones-y-normatividad": {
    blockHint: "ISO, NOM y sistemas de gestión — implementación y auditoría interna.",
    fieldLabels: {
      serviciosFinancieros: "Servicios de certificación",
      normasCertificaciones: "Normas que implementas o auditas",
    },
    textosAyuda: {
      normasCertificaciones: "ISO 9001, 14001, 45001, NOM…",
      diferenciadorProfesional: "Ej. ISO 9001 en 90 días · Capacitación incluida",
      coberturaGeografica: "Plantas o sitios donde implementas.",
    },
    extraFields: [...COMMON_EXTRA],
  },
  "seguridad-e-higiene": {
    blockHint: "NOM-035, evaluación de riesgos y programas de seguridad industrial.",
    fieldLabels: {
      serviciosFinancieros: "Servicios de seguridad e higiene",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. NOM-035 integral · Capacitación in company",
      coberturaGeografica: "Plantas o regiones de visita.",
    },
    extraFields: [...COMMON_EXTRA],
  },
  "gestion-de-calidad": {
    blockHint: "Sistemas de calidad, Kaizen, Six Sigma — mejora continua.",
    fieldLabels: {
      serviciosFinancieros: "Servicios de gestión de calidad",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Six Sigma Black Belt · Reducción de mermas documentada",
      coberturaGeografica: "Sitios donde implementas calidad.",
    },
    extraFields: [...COMMON_EXTRA],
  },
  "consultoria-ambiental": {
    blockHint: "Impacto ambiental, residuos y permisos — cumplimiento normativo.",
    fieldLabels: {
      serviciosFinancieros: "Servicios ambientales",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. MIA express · Gestión de residuos peligrosos",
      coberturaGeografica: "Estados donde tramitas permisos.",
    },
    extraFields: [...COMMON_EXTRA],
  },
  "consultoria-empresarial": {
    blockHint: "Tu firma de consultoría — estrategia, operaciones y transformación.",
    fieldLabels: {
      serviciosEmpresariales: "Servicios de la consultora",
      especialidadesEmpresa: "Industrias donde tienes más casos",
    },
    textosAyuda: {
      nombreComercial: "Nombre con el que te buscan en el mercado.",
      diferenciadorProfesional: "Ej. Consultoría estratégica PyME · Diagnóstico gratuito inicial",
      coberturaGeografica: "Oficinas y mercados atendidos.",
    },
    extraFields: ["diferenciadorProfesional", "coberturaGeografica"],
  },
  "capacitacion-empresarial": {
    blockHint: "Cursos in company, e-learning o certificación — temas y formatos.",
    fieldLabels: {
      serviciosEmpresariales: "Formatos de capacitación",
      especialidadesEmpresa: "Temas fuertes de capacitación",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Liderazgo y ventas · Material personalizado incluido",
      coberturaGeografica: "Ciudades donde das cursos presenciales.",
    },
    extraFields: ["diferenciadorProfesional", "coberturaGeografica"],
  },
  "agencias-de-marketing": {
    blockHint: "Agencia full service o especializada — digital, branding, producción.",
    fieldLabels: {
      serviciosEmpresariales: "Líneas de servicio de la agencia",
      especialidadesEmpresa: "Industrias cliente",
    },
    textosAyuda: {
      portfolioURL: "Sitio o casos de la agencia (métricas si es posible).",
      diferenciadorProfesional: "Ej. Agencia digital B2B · Equipo creativo + performance",
      coberturaGeografica: "Mercados donde operan campañas.",
    },
    extraFields: ["diferenciadorProfesional", "coberturaGeografica", "portfolioURL"],
  },
  "diseno-industrial": {
    blockHint: "Producto, prototipado y packaging industrial — sectores que atiendes.",
    fieldLabels: {
      serviciosEmpresariales: "Servicios de diseño industrial",
      especialidadesEmpresa: "Industrias de producto",
    },
    textosAyuda: {
      portfolioURL: "Portafolio de productos diseñados.",
      diferenciadorProfesional: "Ej. Diseño de producto médico · Prototipado rápido",
      coberturaGeografica: "Mercados o plantas donde desarrollan producto.",
    },
    extraFields: ["diferenciadorProfesional", "coberturaGeografica", "portfolioURL"],
  },
  "logistica-empresarial": {
    blockHint: "Almacenaje, distribución, fulfillment — tu propuesta logística.",
    fieldLabels: {
      serviciosEmpresariales: "Servicios logísticos",
      especialidadesEmpresa: "Sectores logísticos",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Fulfillment e-commerce · Entrega same-day local",
      coberturaGeografica: "Centros de distribución y rutas.",
    },
    extraFields: ["diferenciadorProfesional", "coberturaGeografica"],
  },
  "proteccion-civil-empresarial": {
    blockHint: "Programas internos, simulacros y brigadas — cumplimiento y capacitación.",
    fieldLabels: {
      serviciosEmpresariales: "Servicios de protección civil",
      especialidadesEmpresa: "Tipos de instalación",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Programas PC completos · Simulacros trimestrales",
      coberturaGeografica: "Ciudades donde implementas programas.",
    },
    extraFields: ["diferenciadorProfesional", "coberturaGeografica"],
  },
  "responsabilidad-social-empresarial": {
    blockHint: "RSE, sostenibilidad e impacto social — programas y reportes.",
    fieldLabels: {
      serviciosEmpresariales: "Servicios de RSE",
      especialidadesEmpresa: "Sectores con programas RSE",
    },
    textosAyuda: {
      diferenciadorProfesional: "Ej. Reportes GRI · Programas comunitarios medibles",
      coberturaGeografica: "Regiones de impacto social.",
    },
    extraFields: ["diferenciadorProfesional", "coberturaGeografica"],
  },
};

export function mergeEnrichmentV2(baseProfile, subId) {
  const enrich = SUB_ENRICHMENT_V2[subId];
  if (!enrich) return baseProfile;
  const out = { ...baseProfile };
  if (enrich.blockHint) out.blockHint = enrich.blockHint;
  if (enrich.fieldLabels) out.fieldLabels = { ...(out.fieldLabels || {}), ...enrich.fieldLabels };
  const ayuda = { ...(out.textosAyuda || {}), ...(enrich.textosAyuda || {}) };
  if (enrich.textosAyudaMerge) Object.assign(ayuda, enrich.textosAyudaMerge);
  out.textosAyuda = ayuda;
  if (enrich.fieldOptions) {
    out.fieldOptions = { ...(out.fieldOptions || {}), ...enrich.fieldOptions };
  }
  if (enrich.extraFields) {
    out.extraFields = [...new Set([...(out.extraFields || []), ...enrich.extraFields])];
  }
  if (enrich.obligatoriosExtra) {
    out.obligatoriosExtra = [...new Set([...(out.obligatoriosExtra || []), ...enrich.obligatoriosExtra])];
  }
  if (enrich.aliasPlaceholder) out.aliasPlaceholder = enrich.aliasPlaceholder;
  return out;
}
