/**
 * Motor DEMO canónico — 3 perfiles fijos (ref. mockup desktop resultados)
 */
(function (global) {
  'use strict';

  var FOTOS = [
    'img/resultados-demo/violeta-1.png',
    'img/resultados-demo/violeta-2.png',
    'img/resultados-demo/violeta-3.png',
    'img/resultados-demo/violeta-4.png'
  ];

  var ZONAS = ['San Pedro', 'Centro', 'Valle Oriente', 'Cumbres', 'Mitras', 'Del Valle'];

  var VISTA_POR_CATEGORIA = {
    escort: 'escort',
    'escort gay': 'escortGay',
    'escort vip': 'escortVip',
    edecan: 'adult',
    stripper: 'stripper',
    modelos: 'adult',
    gigolo: 'gigolo',
    acompanante: 'acompanante',
    petit: 'petit',
    contenido: 'creador',
    tabledance: 'tableDance',
    'sex shop': 'sexShop',
    spa: 'negocio',
    masajes: 'masajeIndep',
    'club sw': 'clubSw',
    'antro restaurant bar': 'antro',
    'antro restaurant bar lgbt': 'antroLgbt',
    'hotel motel': 'negocio',
    'cabinas glory holes': 'cabinas',
    trans: 'trans',
    femboy: 'femboy',
    swinger: 'pareja',
    'parejas swinger': 'pareja',
    unicorns: 'unicorn',
    'cuckold hotwife': 'pareja',
    singles: 'singles',
    lesbians: 'lesbians',
    'tom boy': 'adult',
    'tom fem': 'adult',
    dotados: 'adult',
    fetiche: 'dominatrix',
    sado: 'dominatrix',
    dominatrix: 'dominatrix',
    'cine xxx': 'cineXxx'
  };

  /** Perfiles exactos del mockup desktop (siempre visibles) */
  var PERFILES_CANON = [
    {
      __id: 'demo-violeta',
      __demo: true,
      __vista: 'adult',
      nombre: 'Violeta',
      edad: 24,
      ubicacion: 'San Pedro, Monterrey',
      zona: 'San Pedro',
      ciudad: 'Monterrey',
      precio: '2,000',
      tagline: 'Complaciente y cariñosa, trato de novia.',
      observaciones: ['Complaciente', 'Cariñosa', 'Trato de novia'],
      modalidades: ['recibe', 'hotel', 'domicilio'],
      categoriaPublica: 'Cariñosas VIP',
      verificada: true,
      nueva: true,
      disponibilidad: 'Consultar disponibilidad',
      respuestaRapida: true,
      fotoURL: FOTOS[0],
      fotosCount: 15
    },
    {
      __id: 'demo-mariana',
      __demo: true,
      __vista: 'adult',
      nombre: 'Mariana',
      edad: 23,
      ubicacion: 'Monterrey Centro',
      zona: 'Monterrey Centro',
      ciudad: 'Monterrey',
      precio: '1,800',
      tagline: 'Acompañante elegante, discreta y muy atenta.',
      observaciones: ['Acompañante', 'Elegante', 'Discreta', 'Atenta'],
      modalidades: ['recibe', 'hotel'],
      categoriaPublica: 'Acompañante',
      verificada: true,
      nueva: false,
      disponibilidad: 'Consultar disponibilidad',
      respuestaRapida: true,
      fotoURL: FOTOS[1],
      fotosCount: 12
    },
    {
      __id: 'demo-sofia',
      __demo: true,
      __vista: 'adult',
      nombre: 'Sofía',
      edad: 22,
      ubicacion: 'Apodaca, Nuevo León',
      zona: 'Apodaca',
      ciudad: 'Apodaca',
      estado: 'Nuevo León',
      precio: '1,500',
      tagline: 'Linda, divertida y muy complaciente.',
      observaciones: ['Linda', 'Divertida', 'Complaciente'],
      modalidades: ['recibe', 'hotel', 'domicilio'],
      categoriaPublica: 'Cariñosas',
      verificada: true,
      nueva: false,
      disponibilidad: 'Ocupada',
      respuestaRapida: true,
      fotoURL: FOTOS[2],
      fotosCount: 18
    }
  ];

  /** Cuarto perfil demo — vista ?vista=con-resultados-4 */
  var PERFIL_CANON_CUARTO = {
    __id: 'demo-valentina',
    __demo: true,
    __vista: 'adult',
    nombre: 'Valentina',
    edad: 30,
    ubicacion: 'Valle Oriente, Monterrey',
    zona: 'Valle Oriente',
    ciudad: 'Monterrey',
    precio: '2,000',
    tagline: 'Elegante, discreta y siempre puntual.',
    observaciones: ['Elegante', 'Discreta', 'Puntual'],
    modalidades: ['recibe', 'hotel', 'domicilio'],
    categoriaPublica: 'Cariñosas VIP',
    verificada: true,
    nueva: false,
    disponibilidad: 'Ocupada',
    respuestaRapida: true,
    fotoURL: FOTOS[3],
    fotosCount: 14
  };

  /** Quinto perfil demo — vista ?vista=con-resultados-4 (peek 4,5 tarjetas) */
  var PERFIL_CANON_QUINTO = {
    __id: 'demo-camila',
    __demo: true,
    __vista: 'adult',
    nombre: 'Camila',
    edad: 26,
    ubicacion: 'Cumbres, Monterrey',
    zona: 'Cumbres',
    ciudad: 'Monterrey',
    precio: '1,800',
    tagline: 'Trato de novia y conversación agradable.',
    observaciones: ['Trato de novia', 'Conversación', 'Agradable'],
    modalidades: ['hotel', 'domicilio'],
    categoriaPublica: 'Cariñosas',
    verificada: false,
    nueva: true,
    disponibilidad: 'Consultar disponibilidad',
    respuestaRapida: true,
    fotoURL: FOTOS[1],
    fotosCount: 10
  };

  var PLANTILLAS = {
    escort: {
      personas: [
        { nombre: 'Mariana', edad: 23, precio: '1,800', tagline: 'Acompañante elegante, discreta y muy atenta.', modalidades: ['recibe', 'hotel'], nueva: false, verificada: true },
        { nombre: 'Violeta', edad: 24, precio: '2,000', tagline: 'Complaciente y cariñosa, trato de novia.', modalidades: ['recibe', 'hotel', 'domicilio'], nueva: true },
        { nombre: 'Valentina', edad: 30, precio: '2,000', tagline: 'Elegante, discreta y siempre puntual.', modalidades: ['recibe', 'hotel', 'domicilio'], disponibilidad: 'Ocupada' },
        { nombre: 'Camila', edad: 26, precio: '1,800', tagline: 'Trato de novia y conversación agradable.', modalidades: ['hotel', 'domicilio'] },
        { nombre: 'Isabella', edad: 28, precio: '2,500', tagline: 'Experiencia premium con total discreción.', modalidades: ['recibe', 'hotel'], verificada: true }
      ]
    },
    dominatrix: {
      personas: [
        { nombre: 'Mistress Alexa', edad: 29, precio: '2,500', tagline: 'Femdom elegante, protocolo claro y límites respetados.', modalidades: ['recibe', 'hotel'] },
        { nombre: 'Lady Raven', edad: 31, precio: '3,000', tagline: 'Dungeon privado y sesiones BDSM profesionales.', modalidades: ['recibe'] }
      ]
    },
    masajes: {
      negocios: [
        { nombreComercial: 'Zen Touch Masajes', precio: '650', tagline: 'Masajes relajantes, terapéuticos y en pareja. Ambiente discreto.', tipoPerfil: 'negocio', categoriaPublica: 'Centro de Masajes' }
      ],
      personas: [
        { nombre: 'Sofía M.', edad: 27, precio: '900', tagline: 'Masajes relajantes y sensoriales a domicilio o espacio privado.', modalidades: ['domicilio', 'recibe'] },
        { nombre: 'Luna R.', edad: 25, precio: '850', tagline: 'Terapia sueca, aromaterapia y sesiones en pareja.', modalidades: ['recibe', 'domicilio'] }
      ]
    }
  };

  var FALLBACK_PERSONAS = [
    { nombre: 'Perfil demo', edad: 25, precio: '1,500', tagline: 'Anuncio de demostración para esta categoría.', modalidades: ['recibe', 'hotel'] },
    { nombre: 'Anuncio local', edad: 27, precio: '1,800', tagline: 'Disponible en tu zona con reservación previa.', modalidades: ['domicilio'] }
  ];

  var DEMO_POR_COMPONENTE = {
    ResultCardNegocio: {
      'restaurantes-tradicional': [
        { nombreComercial: 'La Cocina de Monterrey', precio: '180', tagline: 'Cocina regional, terraza y reservaciones.', horario: 'Mar–Dom 13:00–23:00', categoriaPublica: 'Restaurante Tradicional', verificada: true, colaboracionContenido: 'Bajo acuerdo previo', mostrarColaboracionContenidoPublico: 'Sí' },
        { nombreComercial: 'El Asador del Norte', precio: '250', tagline: 'Cortes premium y parrilla al carbón.', horario: 'Lun–Dom 12:00–00:00', categoriaPublica: 'Restaurante Tradicional', verificada: true },
        { nombreComercial: 'Cocina de la Abuela', precio: '120', tagline: 'Comida casera, menú del día y postres.', horario: 'Lun–Sáb 8:00–17:00', categoriaPublica: 'Restaurante Tradicional', verificada: true }
      ],
      restaurante: [
        { nombreComercial: 'La Cocina de Monterrey', precio: '180', tagline: 'Cocina regional, terraza y reservaciones.', horario: 'Mar–Dom 13:00–23:00', categoriaPublica: 'Restaurante', verificada: true }
      ],
      'sex shop': [
        { nombreComercial: 'Sensual Shop MTY', precio: '199', tagline: 'Productos premium, envío discreto y asesoría.', horario: 'Lun–Sáb 10:00–22:00', categoriaPublica: 'Sex Shop', verificada: true }
      ],
      spa: [
        { nombreComercial: 'Spa Sensual Monterrey', precio: '800', tagline: 'Masajes, jacuzzi y habitaciones privadas.', horario: 'Lun–Dom 10:00–22:00', categoriaPublica: 'Spa', verificada: true }
      ],
      'hotel motel': [
        { nombreComercial: 'Hotel & Suites Valle', precio: '890', tagline: 'Habitaciones temáticas y total discreción.', horario: '24 horas', categoriaPublica: 'Hotel / Motel', verificada: true }
      ],
      default: [
        { nombreComercial: 'Negocio demo local', precio: 'Consultar', tagline: 'Anuncio de demostración para negocios.', horario: 'Horario público en perfil', verificada: true },
        { nombreComercial: 'Comercio de la zona', precio: '150', tagline: 'Atención personalizada y buen servicio.', horario: 'Lun–Sáb 9:00–20:00', verificada: true }
      ]
    },
    ResultCardServicio: {
      'talleres-mecanicos': [
        { nombre: 'Taller Mecánico Rápido', precio: '350', tagline: 'Diagnóstico, frenos, suspensión y afinación.', especialidad: 'Mecánica general', horario: 'Lun–Sáb 8:00–19:00', zonaCobertura: 'Monterrey y área metropolitana', verificada: true, colaboracionContenido: 'Sí', mostrarColaboracionContenidoPublico: 'Sí' },
        { nombre: 'Auto Service del Valle', precio: '400', tagline: 'Servicio express y garantía por escrito.', especialidad: 'Mecánica automotriz', horario: 'Lun–Vie 8:00–18:00', zonaCobertura: 'San Pedro y Monterrey', verificada: true },
        { nombre: 'Mecánica Hernández', precio: '300', tagline: 'Más de 15 años de experiencia en autos.', especialidad: 'Motor y transmisión', horario: 'Lun–Sáb 7:00–20:00', verificada: true }
      ],
      vulcanizadoras: [
        { nombre: 'Vulcanizadora El Rápido', precio: '150', tagline: 'Llantas nuevas y usadas, balanceo y alineación.', especialidad: 'Vulcanización', horario: 'Lun–Dom 7:00–21:00', zonaCobertura: 'Monterrey', verificada: true },
        { nombre: 'Llantas y Rines MTY', precio: '200', tagline: 'Todas las marcas, servicio a domicilio.', especialidad: 'Vulcanización móvil', horario: '24 horas', verificada: true }
      ],
      plomeros: [
        { nombre: 'Carlos Ramírez', precio: '300', tagline: 'Plomería residencial y comercial con garantía.', especialidad: 'Plomería general', horario: 'Lun–Dom 7:00–22:00', zonaCobertura: 'Monterrey y área metropolitana', verificada: true }
      ],
      'paseador-de-perros': [
        { nombre: 'Paseos Caninos MTY', precio: '150', tagline: 'Paseos diarios, cuidado y socialización.', especialidad: 'Paseo de perros', horario: 'Lun–Sáb 6:00–20:00', zonaCobertura: 'Monterrey centro y sur', verificada: true },
        { nombre: 'Dog Walker Pro', precio: '180', tagline: 'Rutas seguras, reporte con fotos.', especialidad: 'Paseo y cuidado', horario: 'Lun–Dom', verificada: true }
      ],
      'cirugia-plastica-y-estetica': [
        { nombre: 'Dr. Andrés Meza', precio: 'Consultar', tagline: 'Cirugía estética y reconstructiva con valoración previa.', especialidad: 'Cirugía plástica', horario: 'Con cita previa', verificada: true }
      ],
      default: [
        { nombre: 'Profesional demo', precio: '500', tagline: 'Servicio independiente de demostración en tu zona.', especialidad: 'Servicio profesional', horario: 'Lun–Sáb', verificada: true },
        { nombre: 'Servicio local', precio: '400', tagline: 'Atención personalizada con garantía.', especialidad: 'Servicio general', horario: 'Lun–Vie 9:00–18:00', verificada: true }
      ]
    },
    ResultCardProfesional: {
      'medicos-generales': [
        { nombre: 'Dra. Ana Lucía Méndez', precio: '800', tagline: 'Medicina general, check-ups y seguimiento.', especialidad: 'Medicina General', cedulaVerificada: true, horario: 'Lun–Vie 9:00–19:00', verificada: true, colaboracionContenido: 'Sí', mostrarColaboracionContenidoPublico: 'Sí' },
        { nombre: 'Dr. Roberto Sánchez', precio: '750', tagline: 'Atención integral, urgencias menores y recetas.', especialidad: 'Medicina General', cedulaVerificada: true, horario: 'Lun–Sáb 8:00–20:00', verificada: true },
        { nombre: 'Dra. Patricia Vega', precio: '900', tagline: 'Consulta presencial y seguimiento por WhatsApp.', especialidad: 'Medicina Familiar', cedulaVerificada: true, horario: 'Mar–Sáb 10:00–18:00', verificada: true }
      ],
      abogados: [
        { nombre: 'Lic. Roberto Vega', precio: '1,200', tagline: 'Asesoría laboral, civil y contratos.', especialidad: 'Derecho laboral', verificada: true, horario: 'Lun–Vie 9:00–18:00' },
        { nombre: 'Lic. María González', precio: '1,500', tagline: 'Divorcios, pensión alimenticia y custodia.', especialidad: 'Derecho familiar', cedulaVerificada: true, horario: 'Lun–Vie 9:00–17:00', verificada: true }
      ],
      default: [
        { nombre: 'Prof. demo certificado', precio: '700', tagline: 'Profesionista con cédula verificada (demo).', especialidad: 'Consulta profesional', cedulaVerificada: true, verificada: true }
      ]
    }
  };

  /** Demos sector Bienestar holístico (packs A–H). Campos públicos alineados a bienestarHolisticoPerfil. */
  var BIENESTAR_PACK_POR_SUB = {
    temazcales: 'C', 'centros-holisticos': 'C', 'centros-de-bienestar': 'C', 'centros-de-meditacion': 'C',
    'centros-de-yoga': 'C', 'centros-de-sanacion': 'C', reiki: 'A', biomagnetismo: 'A', acupuntura: 'A',
    aromaterapia: 'A', 'masajes-holisticos': 'A', 'masajes-relajantes': 'A', 'masajes-terapeuticos': 'A',
    'terapias-holisticas': 'A', 'terapias-energeticas': 'A', 'terapias-alternativas': 'A', yoga: 'B',
    pilates: 'B', meditacion: 'B', breathwork: 'B', 'centros-de-yoga': 'C', 'tiendas-esotericas': 'D',
    herbolarios: 'D', 'productos-holisticos': 'D', tarot: 'E', astrologia: 'E', numerologia: 'E',
    'coaching-de-vida': 'F', 'coaching-espiritual': 'F', 'retiros-espirituales': 'G', 'turismo-espiritual': 'G',
    'ceremonias-ayahuasca-rape-plantas-de-poder': 'H', chamanismo: 'H', 'medicina-ancestral': 'H'
  };

  var DEMO_BIENESTAR_BY_PACK = {
    A: [
      { alias: 'Luna Reiki MTY', precio: '600', tagline: 'Sesiones de Reiki presencial y a distancia.', certificaciones: 'Certificación Reiki Usui nivel II', modalidadesTerapia: ['Reiki presencial', 'Reiki a distancia'], duracionSesionMinutos: '60_min', horario: 'Mar–Sáb 10:00–19:00', atencionDomicilio: 'No' },
      { alias: 'Armonía Holística', precio: '750', tagline: 'Biomagnetismo y aromaterapia complementaria.', certificaciones: 'Diplomado en biomagnetismo médico', modalidadesTerapia: ['Biomagnetismo', 'Aromaterapia'], duracionSesionMinutos: '90_min', horario: 'Con cita previa' },
      { alias: 'Sana Energía', precio: '550', tagline: 'Masajes holísticos y limpieza energética.', certificaciones: 'Curso avanzado de masaje holístico', modalidadesTerapia: ['Masaje holístico'], duracionSesionMinutos: '60_min', horario: 'Lun–Vie 11:00–20:00' }
    ],
    B: [
      { alias: 'Yoga Vida Norte', precio: '350', tagline: 'Clases de Hatha y Vinyasa para todos los niveles.', certificaciones: 'Instructora certificada Yoga Alliance 200h', tipoPractica: 'Hatha · Vinyasa', modalidadClase: 'presencial', nivelesAtendidos: 'todos', horario: 'Lun–Sáb 7:00–21:00' },
      { alias: 'Centro Prana', precio: '400', tagline: 'Yoga, pilates y breathwork en grupo reducido.', certificaciones: 'Formación en pilates mat y breathwork', tipoPractica: 'Yoga · Pilates', modalidadClase: 'hibrido', nivelesAtendidos: 'intermedio', horario: 'Mar–Dom 8:00–20:00' }
    ],
    C: [
      { alias: 'Temazcal Anáhuac', precio: '450', tagline: 'Ceremonias tradicionales con guía experimentado.', certificaciones: 'Formación en medicina tradicional mexicana', serviciosCentro: ['Temazcal', 'Limpias energéticas', 'Meditación'], capacidadGrupo: '12', horario: 'Sáb y Dom con reservación', colaboracionContenido: 'Bajo acuerdo previo', mostrarColaboracionContenidoPublico: 'Sí' },
      { alias: 'Centro Holístico Luz', precio: '500', tagline: 'Espacio para yoga, meditación y sanación grupal.', certificaciones: 'Centro registrado · facilitadores certificados', serviciosCentro: ['Yoga', 'Meditación', 'Círculos de sanación'], capacidadGrupo: '20', horario: 'Lun–Sáb 9:00–21:00' },
      { alias: 'Casa del Temazcal', precio: '380', tagline: 'Ritual de purificación y cantos ancestrales.', certificaciones: 'Guía temazcalero con 10 años de experiencia', serviciosCentro: ['Temazcal', 'Herbolaria ceremonial'], capacidadGrupo: '8', horario: 'Con cita · fines de semana' }
    ],
    D: [
      { alias: 'Mística Esotérica', precio: '150', tagline: 'Velas, sahumerios, cristales y herramientas holísticas.', certificaciones: 'Comercio local especializado', nombreComercial: 'Mística Esotérica', surtidoPrincipal: 'Velas · Sahumerios · Cristales', categoriasProductoBienestar: ['Velas esotéricas', 'Sahumerios', 'Cristales'], ventaPresencial: 'Sí', direccion: 'Centro Monterrey', horario: 'Lun–Sáb 10:00–20:00' },
      { alias: 'Herbolaria del Valle', precio: '80', tagline: 'Plantas medicinales, tinturas y productos naturales.', certificaciones: 'Herbolaria tradicional', surtidoPrincipal: 'Plantas medicinales · Tinturas', categoriasProductoBienestar: ['Herbolaria', 'Tinturas'], ventaPresencial: 'Sí', horario: 'Lun–Vie 9:00–18:00' }
    ],
    E: [
      { alias: 'Tarot Luna Serena', precio: '400', tagline: 'Lecturas de tarot presenciales y en línea.', certificaciones: 'Formación en tarot terapéutico', enfoqueEspiritual: 'Tarot como herramienta de autoconocimiento', modalidadLectura: 'ambas', horario: 'Mar–Dom con cita' },
      { alias: 'Astros MTY', precio: '500', tagline: 'Carta natal y tránsitos con enfoque práctico.', certificaciones: 'Estudios de astrología evolutiva', enfoqueEspiritual: 'Astrología evolutiva', modalidadLectura: 'online', horario: 'Lun–Sáb' }
    ],
    F: [
      { alias: 'Coach Vida Plena', precio: '900', tagline: 'Coaching de vida y propósito personal.', certificaciones: 'Certificación ICF nivel asociado', areaCoaching: 'Propósito · hábitos · transiciones', modalidadSesionCoaching: 'individual', horario: 'Lun–Vie 9:00–18:00' },
      { alias: 'Despertar Interior', precio: '750', tagline: 'Coaching espiritual y desarrollo personal.', certificaciones: 'Diplomado en coaching ontológico', areaCoaching: 'Desarrollo personal · espiritualidad', modalidadSesionCoaching: 'mixta', horario: 'Con cita previa' }
    ],
    G: [
      { alias: 'Retiro Sierra Serena', precio: '3,500', tagline: 'Retiros de silencio y reconexión en la naturaleza.', certificaciones: 'Facilitadores con experiencia en retiros', tipoExperiencia: 'retiro', duracionExperiencia: '3 días / 2 noches', fechasExperiencia: 'Consultar calendario mensual', lugarExperiencia: 'Santiago, N.L.', cupoMaximo: '16', horario: 'Fines de semana largos' },
      { alias: 'Camino Sagrado', precio: '2,800', tagline: 'Turismo espiritual y ceremonias en espacios naturales.', certificaciones: 'Guías certificados en turismo consciente', tipoExperiencia: 'inmersion', duracionExperiencia: '2 días', fechasExperiencia: 'Próxima salida: consultar', lugarExperiencia: 'Sierra Madre', cupoMaximo: '12', horario: 'Salidas programadas' }
    ],
    H: [
      { alias: 'Centro Ceremonial Ancestral', precio: 'Consultar', tagline: 'Experiencias ceremoniales guiadas con protocolo y acompañamiento.', certificaciones: 'Facilitadores con formación en medicina tradicional', tipoExperienciaCeremonial: 'ceremonia_guiada', acompanamientoCeremonial: ['Guía experimentado', 'Espacio seguro', 'Integración post-ceremonia'], requisitosPrevios: 'Mayor de edad · evaluación previa obligatoria', fechasCeremonia: 'Consultar disponibilidad', cupoCeremonia: '10', lugarCeremonia: 'Retiro privado · ubicación al confirmar', horario: 'Solo con cita y evaluación previa' }
    ]
  };

  var DEMO_BIENESTAR = {
    reiki: DEMO_BIENESTAR_BY_PACK.A,
    temazcales: DEMO_BIENESTAR_BY_PACK.C,
    'centros-de-yoga': DEMO_BIENESTAR_BY_PACK.B,
    'masajes-holisticos': [
      { alias: 'Manos Sanadoras', precio: '650', tagline: 'Masaje holístico con aceites esenciales.', certificaciones: 'Certificación en masaje terapéutico holístico', modalidadesTerapia: ['Masaje holístico', 'Aromaterapia'], duracionSesionMinutos: '90_min', horario: 'Lun–Sáb 10:00–20:00' }
    ].concat(DEMO_BIENESTAR_BY_PACK.A.slice(0, 2)),
    'tiendas-esotericas': DEMO_BIENESTAR_BY_PACK.D,
    tarot: DEMO_BIENESTAR_BY_PACK.E,
    'coaching-de-vida': DEMO_BIENESTAR_BY_PACK.F,
    'retiros-espirituales': DEMO_BIENESTAR_BY_PACK.G,
    'ceremonias-ayahuasca-rape-plantas-de-poder': DEMO_BIENESTAR_BY_PACK.H
  };

  function norm(t) {
    if (global.CHUI && CHUI.chNorm) return CHUI.chNorm(t);
    return String(t || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function idCategoria(valor) {
    if (global.CariHubCatalogos) return CariHubCatalogos.idCategoria(valor);
    return norm(valor);
  }

  function labelCategoria(valor) {
    if (global.CariHubCatalogos) return CariHubCatalogos.labelCategoria(valor);
    return String(valor || '').trim() || 'Cariñosas';
  }

  function vistaDeCategoriaLegacy(valor) {
    var id = idCategoria(valor);
    return VISTA_POR_CATEGORIA[id] || 'adult';
  }

  function vistaDeCategoria(valor) {
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolvePublicPresentation) {
      var pres = CariHubFieldEngineLite.resolvePublicPresentation({
        categoria: valor,
        subcategoriaId: CariHubFieldEngineLite.lookupSubcategoriaId(valor)
      });
      if (pres && pres.vistaPerfil) return pres.vistaPerfil;
    }
    return vistaDeCategoriaLegacy(valor);
  }

  function presentacionDeCategoria(valor) {
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolvePublicPresentation) {
      return CariHubFieldEngineLite.resolvePublicPresentation({
        categoria: valor,
        subcategoriaId: CariHubFieldEngineLite.lookupSubcategoriaId(valor)
      });
    }
    return { componenteResultados: 'ResultCardAdultos', vistaPerfil: vistaDeCategoriaLegacy(valor), esAdultoPersona: true };
  }

  function enriquecerPerfil(u, Q) {
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.enriquecerPerfilPublico) {
      u = CariHubFieldEngineLite.enriquecerPerfilPublico(u, {
        categoria: (Q && Q.categoria) || u.categoria || u.categoriaPublica,
        subcategoriaId: u.subcategoriaId
      });
    } else {
      u.__vista = u.__vista || vistaDeCategoria((Q && Q.categoria) || u.categoria);
    }
    if (global.CariHubResultadosCardContract && CariHubResultadosCardContract.sanitizePerfil) {
      CariHubResultadosCardContract.sanitizePerfil(u, {
        categoria: (Q && Q.categoria) || u.categoria || u.categoriaPublica,
        subcategoriaId: u.subcategoriaId
      });
    }
    return u;
  }

  function slug(s) {
    return norm(s).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'perfil';
  }

  function foto(i) {
    return FOTOS[i % FOTOS.length];
  }

  function zonaNombre(i) {
    return ZONAS[i % ZONAS.length];
  }

  function clonarPerfil(base, Q) {
    var u = {};
    var k;
    for (k in base) {
      if (Object.prototype.hasOwnProperty.call(base, k)) u[k] = base[k];
    }
    u.categoria = base.categoria || Q.categoria || 'Cariñosas';
    u.categoriaPublica = base.categoriaPublica || u.categoria;
    u.pais = Q.pais || 'México';
    u.estado = u.estado || Q.estado || 'Nuevo León';
    u.ciudad = u.ciudad || Q.ciudad || 'Monterrey';
    if (u.fotosCount) {
      u.fotosExtraURL = new Array(Math.max(0, u.fotosCount - 1)).fill('demo');
    }
    return enriquecerPerfil(u, Q);
  }

  function perfilesCanonicos(Q) {
    Q = Q || {};
    return PERFILES_CANON.map(function (p) { return clonarPerfil(p, Q); });
  }

  function perfilesCanonicosCuatro(Q) {
    Q = Q || {};
    return PERFILES_CANON.concat([PERFIL_CANON_CUARTO]).map(function (p) {
      return clonarPerfil(p, Q);
    });
  }

  function perfilesCanonicosCinco(Q) {
    Q = Q || {};
    return PERFILES_CANON.concat([PERFIL_CANON_CUARTO, PERFIL_CANON_QUINTO]).map(function (p) {
      return clonarPerfil(p, Q);
    });
  }

  function armarPerfil(base, idx, Q, catLabel, catId, vistaDef) {
    var esNeg = !!(base.tipoPerfil === 'negocio' || base.tipoPerfil === 'lugar' || base.nombreComercial);
    var nombre = esNeg ? base.nombreComercial : base.nombre;
    var vista = base.vista || vistaDef;
    var id = 'demo-' + catId + '-' + slug(nombre) + '-' + idx;

    var u = {
      __id: id,
      __demo: true,
      __vista: vista,
      categoria: base.categoria || catLabel,
      categoriaPublica: base.categoriaPublica || catLabel,
      pais: Q.pais,
      estado: Q.estado,
      ciudad: Q.ciudad,
      zona: zonaNombre(idx),
      precio: base.precio || 'Consultar',
      tagline: base.tagline || '',
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      disponibilidad: base.disponibilidad || 'Consultar disponibilidad',
      respuestaRapida: base.respuestaRapida !== false,
      nueva: !!base.nueva,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n']
    };

    if (esNeg) {
      u.tipoPerfil = base.tipoPerfil || 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = nombre;
      u.nombre = nombre;
      if (base.tipoNegocio) u.tipoNegocio = base.tipoNegocio;
    } else {
      u.nombre = nombre;
      u.alias = nombre;
      if (base.edad != null) u.edad = base.edad;
      if (base.modalidades) u.modalidades = base.modalidades;
    }
    if (base.especialidad) u.especialidad = base.especialidad;
    if (base.horario) u.horario = base.horario;
    if (base.cedulaVerificada) u.cedulaVerificada = true;
    if (base.zonaCobertura) u.zonaCobertura = base.zonaCobertura;
    if (base.colaboracionContenido) u.colaboracionContenido = base.colaboracionContenido;
    if (base.mostrarColaboracionContenidoPublico) {
      u.mostrarColaboracionContenidoPublico = base.mostrarColaboracionContenidoPublico;
    }

    return enriquecerPerfil(u, Q);
  }

  function bienestarPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (BIENESTAR_PACK_POR_SUB[key]) return BIENESTAR_PACK_POR_SUB[key];
    if (global.CARIHUB_REGISTRO_BIENESTAR_BLOCKS && CARIHUB_REGISTRO_BIENESTAR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_BIENESTAR_BLOCKS.resolvePack(key);
    }
    return 'A';
  }

  function buildBienestarHolisticoPerfil(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      alias: base.alias || base.nombre || '',
      tagline: base.tagline || '',
      certificaciones: base.certificaciones || '',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      horarioDetalle: base.horario || base.horarioDetalle || ''
    };
    var keys = [
      'modalidadesTerapia', 'duracionSesionMinutos', 'contraindicacionesGenerales', 'atencionDomicilio',
      'tipoPractica', 'modalidadClase', 'nivelesAtendidos', 'serviciosCentro', 'capacidadGrupo',
      'categoriasProductoBienestar', 'surtidoPrincipal', 'ventaPresencial', 'nombreComercial', 'direccion',
      'enfoqueEspiritual', 'modalidadLectura', 'areaCoaching', 'modalidadSesionCoaching',
      'tipoExperiencia', 'duracionExperiencia', 'fechasExperiencia', 'lugarExperiencia', 'cupoMaximo',
      'tipoExperienciaCeremonial', 'acompanamientoCeremonial', 'requisitosPrevios',
      'fechasCeremonia', 'cupoCeremonia', 'lugarCeremonia'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilBienestar(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || bienestarPackDeSub(subId);
    var alias = base.alias || base.nombre || 'Facilitador demo';
    var holistico = buildBienestarHolisticoPerfil(base, subId, pack);
    var id = 'demo-bienestar-' + subId + '-' + slug(alias) + '-' + idx;
    var tarifa = base.precio || holistico.tarifaDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      __vista: 'pro',
      sectorId: 'bienestar',
      subcategoriaId: subId,
      arquetipo: 'persona_servicio_bienestar',
      tipoPerfil: 'persona',
      categoria: catLabel,
      categoriaPublica: catLabel,
      nombre: alias,
      alias: alias,
      precio: tarifa,
      tagline: base.tagline || '',
      horario: base.horario || holistico.horarioDetalle || 'Consultar',
      certificaciones: holistico.certificaciones,
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      deltaPack: pack,
      bienestarHolisticoPerfil: holistico
    };

    if (base.colaboracionContenido) u.colaboracionContenido = base.colaboracionContenido;
    if (base.mostrarColaboracionContenidoPublico) {
      u.mostrarColaboracionContenidoPublico = base.mostrarColaboracionContenidoPublico;
    }
    if (pack === 'H') {
      u.sensible = true;
      u.regulada = true;
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoBienestar(subId) {
    if (DEMO_BIENESTAR[subId]) return DEMO_BIENESTAR[subId];
    var pack = bienestarPackDeSub(subId);
    return DEMO_BIENESTAR_BY_PACK[pack] || DEMO_BIENESTAR_BY_PACK.A;
  }

  function plantillaDemoBienestar(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoBienestar(subId).map(function (base, idx) {
      return armarPerfilBienestar(base, idx, Q, pres);
    });
  }

  var PROFESIONALES_PACK_POR_SUB = {
    abogados: 'A', contadores: 'A', ingenieros: 'A',
    'despachos-juridicos': 'B', 'despachos-contables': 'B', 'despachos-de-arquitectura': 'B', 'despachos-de-ingenieria': 'B',
    'asesoria-fiscal': 'C', auditoria: 'C', notarias: 'C', 'corredurias-publicas': 'C', 'gestoria-y-tramites': 'C',
    arquitectos: 'D', topografia: 'D', avaluos: 'D', peritos: 'D',
    'consultoria-financiera': 'E', 'consultoria-de-negocios': 'E', 'recursos-humanos': 'E', 'reclutamiento-y-seleccion': 'E',
    'estudios-socioeconomicos': 'E', 'coaching-ejecutivo': 'E', 'desarrollo-organizacional': 'E', franquicias: 'E',
    'traduccion-e-interpretacion': 'F', 'marketing-y-publicidad': 'F', 'diseno-grafico': 'F', 'diseno-de-interiores': 'F',
    'branding-e-identidad-corporativa': 'F', 'fotografia-profesional': 'F', 'produccion-de-video': 'F',
    'relaciones-publicas': 'F', 'investigacion-de-mercados': 'F',
    seguros: 'G', 'agentes-de-seguros': 'G', 'asesoria-patrimonial': 'G', 'asesoria-en-inversiones': 'G',
    'comercio-internacional': 'G', 'importacion-y-exportacion': 'G', 'certificaciones-y-normatividad': 'G',
    'seguridad-e-higiene': 'G', 'gestion-de-calidad': 'G', 'consultoria-ambiental': 'G',
    'consultoria-empresarial': 'H', 'capacitacion-empresarial': 'H', 'agencias-de-marketing': 'H',
    'diseno-industrial': 'H', 'logistica-empresarial': 'H', 'proteccion-civil-empresarial': 'H',
    'responsabilidad-social-empresarial': 'H'
  };

  var DEMO_PROFESIONALES_BY_PACK = {
    A: [
      { nombreProfesional: 'Lic. Ana Torres', precio: '1,200', tagline: 'Derecho familiar, sucesiones y divorcios amistosos.', especialidadProfesional: 'Derecho familiar', serviciosProfesionales: ['Consulta', 'Asesoría', 'Representación'], modalidadAtencionProfesional: 'hibrido', horario: 'Lun–Vie 9:00–18:00', areasDerecho: ['Familiar', 'Sucesiones', 'Civil'], serviciosLegales: ['Consulta', 'Mediación', 'Contratos'], cedulaVerificada: true, colaboracionContenido: 'Sí', mostrarColaboracionContenidoPublico: 'Sí' },
      { nombreProfesional: 'C.P. Luis Mendoza', precio: '900', tagline: 'Contabilidad y declaraciones para PyME y personas físicas.', especialidadProfesional: 'Contabilidad fiscal', serviciosProfesionales: ['Asesoría', 'Dictamen'], modalidadAtencionProfesional: 'consultorio', horario: 'Lun–Sáb 9:00–17:00', serviciosContables: ['Declaraciones', 'Nómina', 'Contabilidad mensual'], cedulaVerificada: true },
      { nombreProfesional: 'Ing. Carla Ruiz', precio: '1,500', tagline: 'Ingeniería civil, supervisión y dictámenes estructurales.', especialidadProfesional: 'Ingeniería civil', serviciosProfesionales: ['Proyecto', 'Dictamen'], modalidadAtencionProfesional: 'visita_cliente', horario: 'Con cita previa', serviciosTecnicos: ['Supervisión', 'Dictamen'], cedulaVerificada: true }
    ],
    B: [
      { alias: 'Despacho Jurídico Vega & Asoc.', precio: '2,500', tagline: 'Litigio mercantil y laboral para empresas medianas.', serviciosDespacho: ['Litigio', 'Contratos', 'Asesoría corporativa'], areasPracticaDespacho: ['Mercantil', 'Laboral', 'Fiscal'], tamanoEquipoDespacho: 'mediano_6_15', modalidadAtencionProfesional: 'consultorio', horario: 'Lun–Vie 8:00–19:00' },
      { alias: 'Contadores del Norte SC', precio: '1,800', tagline: 'Despacho contable integral con enfoque en manufactura.', serviciosDespacho: ['Consulta', 'Due diligence'], areasPracticaDespacho: ['Fiscal', 'Mercantil'], tamanoEquipoDespacho: 'pequeno_2_5', horario: 'Lun–Vie 9:00–18:00' }
    ],
    C: [
      { alias: 'Notaría Pública No. 45', precio: 'Consultar', tagline: 'Escrituras, poderes, protocolizaciones y fe de hechos.', serviciosFiscalesLegales: ['Notaría', 'Trámites'], tiposClientesProfesionales: ['Personas físicas', 'PyME', 'Corporativo'], modalidadAtencionProfesional: 'consultorio', horario: 'Lun–Vie 9:00–17:00' },
      { alias: 'Gestoría MTY Express', precio: '600', tagline: 'Trámites vehiculares, licencias y permisos municipales.', serviciosFiscalesLegales: ['Trámites'], serviciosTramites: ['Vehicular', 'Municipal', 'Licencias'], horario: 'Lun–Sáb 8:00–18:00' }
    ],
    D: [
      { alias: 'Arq. Sofía Delgado', precio: '2,200', tagline: 'Arquitectura residencial contemporánea y remodelaciones.', especialidadTecnica: ['Arquitectura'], serviciosTecnicos: ['Proyecto ejecutivo', 'Supervisión'], estilosArquitectonicos: ['Contemporáneo', 'Minimalista'], softwareHerramientas: 'Revit · AutoCAD · SketchUp', horario: 'Lun–Vie 10:00–19:00' },
      { alias: 'Topografía Sierra', precio: '1,400', tagline: 'Levantamientos topográficos y mensuras para obra.', especialidadTecnica: ['Topografía'], serviciosTecnicos: ['Levantamiento', 'Dictamen'], horario: 'Lun–Sáb con cita' }
    ],
    E: [
      { alias: 'Consultoría Financiera Atlas', precio: '3,000', tagline: 'Planeación financiera y valuación para PyME.', areasConsultoria: ['Finanzas', 'Estrategia'], serviciosConsultoria: ['Diagnóstico', 'Implementación'], industriasAtendidas: ['Manufactura', 'Retail'], horario: 'Lun–Vie 9:00–18:00' },
      { alias: 'Coach Ejecutivo Pro', precio: '2,500', tagline: 'Coaching de liderazgo y transiciones de dirección.', areasConsultoria: ['RH', 'Transformación'], serviciosConsultoria: ['Coaching'], metodologiasConsultoria: ['Sesiones 1:1', '360°'], horario: 'Con cita' }
    ],
    F: [
      { alias: 'Estudio Creativo Pixel', precio: '1,600', tagline: 'Branding, diseño gráfico y campañas digitales.', serviciosCreativos: ['Branding', 'Diseño gráfico', 'Redes sociales'], especialidadCreativa: ['Identidad visual', 'Packaging'], portfolioURL: 'https://ejemplo.com/portafolio', horario: 'Lun–Vie 9:00–19:00' },
      { alias: 'Traducciones Pro MTY', precio: '800', tagline: 'Traducción técnica y jurada EN–ES.', serviciosCreativos: ['Otro'], especialidadCreativa: ['Editorial'], idiomasServicio: 'Español · Inglés · Francés', horario: 'Lun–Sáb' }
    ],
    G: [
      { alias: 'Seguros Integra', precio: 'Consultar', tagline: 'Seguros de gastos médicos, vida y empresariales.', serviciosFinancieros: ['Seguros', 'Patrimonio'], tiposPolizaSeguros: ['GMM', 'Vida', 'Empresarial'], aseguradorasRepresentadas: 'GNP · MetLife · AXA', horario: 'Lun–Vie 9:00–18:00' },
      { alias: 'Certificación ISO MTY', precio: '4,500', tagline: 'Implementación ISO 9001 y 14001 para industria.', serviciosFinancieros: ['Certificaciones', 'Consultoría ambiental'], normasCertificaciones: ['ISO 9001', 'ISO 14001'], horario: 'Con proyecto' }
    ],
    H: [
      { nombreComercial: 'Consultoría Empresarial Integral', precio: 'Consultar', tagline: 'Estrategia, operaciones y transformación digital.', serviciosEmpresariales: ['Estrategia', 'Operaciones', 'Transformación'], especialidadesEmpresa: 'Manufactura · Retail · Servicios', tamanoEmpresaAtendida: ['PyME', 'Mediana'], direccion: 'San Pedro, N.L.', horario: 'Lun–Vie 8:00–18:00' },
      { nombreComercial: 'Logística Empresarial del Norte', precio: 'Consultar', tagline: 'Fulfillment, almacenaje y distribución regional.', serviciosEmpresariales: ['Almacenaje', 'Distribución', 'Fulfillment'], especialidadesEmpresa: 'E-commerce · Retail', direccion: 'Monterrey, N.L.', horario: '24 horas operación' }
    ]
  };

  var DEMO_PROFESIONALES = {
    abogados: DEMO_PROFESIONALES_BY_PACK.A,
    contadores: [DEMO_PROFESIONALES_BY_PACK.A[1]],
    ingenieros: [DEMO_PROFESIONALES_BY_PACK.A[2]],
    'despachos-juridicos': DEMO_PROFESIONALES_BY_PACK.B,
    notarias: DEMO_PROFESIONALES_BY_PACK.C,
    arquitectos: DEMO_PROFESIONALES_BY_PACK.D,
    'consultoria-financiera': DEMO_PROFESIONALES_BY_PACK.E,
    'diseno-grafico': DEMO_PROFESIONALES_BY_PACK.F,
    seguros: DEMO_PROFESIONALES_BY_PACK.G,
    'consultoria-empresarial': DEMO_PROFESIONALES_BY_PACK.H
  };

  function profesionalesPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (PROFESIONALES_PACK_POR_SUB[key]) return PROFESIONALES_PACK_POR_SUB[key];
    if (global.CARIHUB_REGISTRO_PROFESIONALES_SECTOR_BLOCKS && CARIHUB_REGISTRO_PROFESIONALES_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_PROFESIONALES_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'B';
  }

  function buildProfesionalesPerfilDemo(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      modalidadAtencionProfesional: base.modalidadAtencionProfesional || '',
      horarioAtencion: base.horario || base.horarioAtencion || base.horarioDetalle || '',
      horarioDetalle: base.horario || base.horarioDetalle || '',
      precioConsulta: base.precio || base.precioConsulta || 'Consultar',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      colaboracionContenido: base.colaboracionContenido || '',
      mostrarColaboracionContenidoPublico: base.mostrarColaboracionContenidoPublico || ''
    };
    var keys = [
      'nombreProfesional', 'alias', 'nombreComercial', 'especialidadProfesional', 'certificaciones',
      'serviciosProfesionales', 'unidadConsulta', 'anosExperienciaProfesional', 'areasDerecho',
      'tiposClientesLegales', 'serviciosLegales', 'serviciosDespacho', 'areasPracticaDespacho',
      'tamanoEquipoDespacho', 'serviciosContables', 'tiposClientesContables', 'serviciosFiscalesLegales',
      'tiposClientesProfesionales', 'serviciosTramites', 'especialidadTecnica', 'serviciosTecnicos',
      'softwareHerramientas', 'estilosArquitectonicos', 'areasConsultoria', 'serviciosConsultoria',
      'industriasAtendidas', 'metodologiasConsultoria', 'serviciosCreativos', 'especialidadCreativa',
      'idiomasServicio', 'portfolioURL', 'serviciosFinancieros', 'tiposPolizaSeguros',
      'aseguradorasRepresentadas', 'normasCertificaciones', 'serviciosEmpresariales',
      'especialidadesEmpresa', 'tamanoEmpresaAtendida', 'direccion', 'diferenciadorProfesional',
      'coberturaGeografica', 'tiempoRespuestaConsulta', 'regimenesFiscales', 'instanciasJudiciales',
      'tiposEntregablesCreativos', 'colaboracionesComerciales', 'tiposColaboracionComercial'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilProfesionales(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || profesionalesPackDeSub(subId);
    var perfil = buildProfesionalesPerfilDemo(base, subId, pack);
    var nombre = perfil.nombreProfesional || perfil.nombreComercial || perfil.alias || 'Profesional demo';
    var id = 'demo-prof-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || perfil.precioConsulta || perfil.tarifaDesde || 'Consultar';
    var esEmpresa = pack === 'H';

    var u = {
      __id: id,
      __demo: true,
      sectorId: 'profesionales',
      subcategoriaId: subId,
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: perfil.horarioAtencion || perfil.horarioDetalle || 'Consultar',
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      cedulaVerificada: base.cedulaVerificada === true || (pack === 'A'),
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f'],
      deltaPack: pack,
      profesionalesPerfil: perfil
    };

    if (esEmpresa) {
      u.tipoPerfil = 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = perfil.nombreComercial || nombre;
      u.nombre = u.nombreComercial;
    } else if (pack === 'A') {
      u.nombreProfesional = perfil.nombreProfesional || nombre;
      u.nombre = u.nombreProfesional;
      u.alias = u.nombre;
      u.especialidad = perfil.especialidadProfesional || base.especialidad || '';
    } else {
      u.alias = perfil.alias || nombre;
      u.nombre = u.alias;
      u.especialidad = perfil.especialidadProfesional || perfil.especialidadTecnica || base.especialidad || '';
    }

    if (base.colaboracionContenido) u.colaboracionContenido = base.colaboracionContenido;
    if (base.mostrarColaboracionContenidoPublico) {
      u.mostrarColaboracionContenidoPublico = base.mostrarColaboracionContenidoPublico;
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoProfesionales(subId) {
    if (DEMO_PROFESIONALES[subId]) return DEMO_PROFESIONALES[subId];
    var pack = profesionalesPackDeSub(subId);
    return DEMO_PROFESIONALES_BY_PACK[pack] || DEMO_PROFESIONALES_BY_PACK.B;
  }

  function plantillaDemoProfesionales(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoProfesionales(subId).map(function (base, idx) {
      return armarPerfilProfesionales(base, idx, Q, pres);
    });
  }

  function plantillaDemoSchema(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var R = global.CariHubSectorContractRegistry;
    if (R && R.resolveDemoBuilder) {
      var builderId = R.resolveDemoBuilder(pres.sectorId);
      if (builderId === 'plantillaDemoProfesionales' && typeof plantillaDemoProfesionales === 'function') {
        return plantillaDemoProfesionales(Q, pres);
      }
      if (builderId === 'plantillaDemoBienestar' && typeof plantillaDemoBienestar === 'function') {
        if (!pres.esAdultoPersona) return plantillaDemoBienestar(Q, pres);
      }
    }
    var comp = pres.componenteResultados || 'ResultCardAdultos';
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var pool = (DEMO_POR_COMPONENTE[comp] && (DEMO_POR_COMPONENTE[comp][subId] || DEMO_POR_COMPONENTE[comp].default)) || [];
    var catLabel = labelCategoria(Q.categoria);
    var vistaDef = pres.vistaPerfil || vistaDeCategoria(Q.categoria);
    return pool.map(function (base, idx) {
      return armarPerfil(base, idx, Q, catLabel, subId, vistaDef);
    });
  }

  function plantillaDe(catId) {
    if (PLANTILLAS[catId]) return PLANTILLAS[catId];
    var clave = Object.keys(PLANTILLAS).find(function (k) {
      return catId.indexOf(k) !== -1 || k.indexOf(catId) !== -1;
    });
    if (clave) return PLANTILLAS[clave];
    return { personas: FALLBACK_PERSONAS };
  }

  function generarPerfiles(Q) {
    return componerListaResultados(Q).perfiles;
  }

  function perfilesFallback(Q) {
    return [];
  }

  function campoCoincide(valorPerfil, valorBusqueda, opts) {
    opts = opts || {};
    var b = norm(valorBusqueda);
    if (!b) return true;
    var p = norm(valorPerfil);
    if (!p) return !!opts.opcional;
    if (p === b) return true;
    if (opts.parcial) return p.indexOf(b) !== -1 || b.indexOf(p) !== -1;
    return false;
  }

  function coincideBusqueda(u, Q) {
    if (!u || !Q) return false;
    var catId = idCategoria(u.categoria || u.categoriaPublica);
    var qId = idCategoria(Q.categoria);
    if (catId !== qId && !campoCoincide(u.categoria || u.categoriaPublica, Q.categoria, { parcial: true })) return false;
    return campoCoincide(u.pais, Q.pais, { opcional: !Q.pais }) &&
      campoCoincide(u.estado, Q.estado, { parcial: true, opcional: !Q.estado }) &&
      campoCoincide([u.ciudad, u.zona].filter(Boolean).join(' '), Q.ciudad, { parcial: true, opcional: !Q.ciudad });
  }

  function coincideDemo(u, Q) {
    if (!u || !u.__demo) return false;
    return coincideBusqueda(u, Q);
  }

  /** Perfiles reales guardados en el sitio (Firebase u otro motor). Vacío en demo. */
  function perfilesRegistrados(Q) {
    Q = Q || {};
    if (global.CariHubResultadosRegistrados && typeof CariHubResultadosRegistrados.listar === 'function') {
      var todos = CariHubResultadosRegistrados.listar(Q) || [];
      return todos.filter(function (u) {
        return u && !u.__demo && coincideBusqueda(u, Q);
      });
    }
    return [];
  }

  /** Vista previa en IDE: ?vista=con-resultados | con-resultados-4 | sin-resultados */
  function vistaPreviaModo() {
    try {
      var p = new URL(global.location.href).searchParams.get('vista');
      if (p === 'con-resultados' || p === 'con') return 'con-resultados';
      if (p === 'con-resultados-4' || p === 'con-4' || p === 'cuatro') return 'con-resultados-4';
      if (p === 'sin-resultados' || p === 'sin' || p === 'vacio') return 'sin-resultados';
    } catch (e) { /* opcional */ }
    return null;
  }

  /** Lista final: reales en producción; canónicos demo solo con ?vista=con-resultados* */
  function componerListaResultados(Q) {
    Q = Q || {};
    var modo = vistaPreviaModo();
    if (modo === 'con-resultados-4') {
      return {
        perfiles: perfilesCanonicosCinco(Q).slice(),
        meta: {
          vacio: false,
          totalRegistrados: 0,
          preview: true,
          modoVista: 'con-resultados-4'
        }
      };
    }
    if (modo === 'con-resultados') {
      return {
        perfiles: perfilesCanonicosCinco(Q).slice(),
        meta: {
          vacio: false,
          totalRegistrados: 0,
          preview: true,
          modoVista: 'con-resultados'
        }
      };
    }
    if (modo === 'sin-resultados') {
      return {
        perfiles: [],
        meta: {
          vacio: true,
          totalRegistrados: 0,
          preview: true,
          modoVista: 'sin-resultados'
        }
      };
    }
    var registrados = perfilesRegistrados(Q);
    var totalEnSitio = (global.CariHubResultadosRegistrados && typeof CariHubResultadosRegistrados.totalPublicos === 'function')
      ? CariHubResultadosRegistrados.totalPublicos()
      : registrados.length;
    if (registrados.length > 0) {
      registrados.forEach(function (u) { enriquecerPerfil(u, Q); });
      return {
        perfiles: registrados.slice(),
        meta: {
          vacio: false,
          totalRegistrados: totalEnSitio,
          modoVista: vistaPreviaModo() || 'produccion'
        }
      };
    }
    var pres = presentacionDeCategoria(Q.categoria);
    var demo = [];
    if (pres.esAdultoPersona) {
      demo = perfilesCanonicosCuatro(Q).filter(function (u) {
        return coincideBusqueda(u, Q);
      });
    }
    if (!demo.length) {
      demo = plantillaDemoSchema(Q, pres).filter(function (u) {
        return coincideBusqueda(u, Q);
      });
    }
    if (demo.length) {
      return {
        perfiles: demo,
        meta: {
          vacio: false,
          totalRegistrados: totalEnSitio,
          demoFallback: true,
          presentacion: pres.componenteResultados,
          modoVista: 'produccion-demo'
        }
      };
    }
    return {
      perfiles: [],
      meta: {
        vacio: true,
        totalRegistrados: totalEnSitio,
        modoVista: vistaPreviaModo() || 'produccion'
      }
    };
  }

  function queryFromLocation(href) {
    try {
      var p = new URL(href || global.location.href).searchParams;
      return {
        categoria: p.get('categoria') || 'Cariñosas',
        pais: p.get('pais') || 'México',
        estado: p.get('estado') || '',
        ciudad: p.get('ciudad') || ''
      };
    } catch (e) {
      return { categoria: 'Cariñosas', pais: 'México', estado: '', ciudad: '' };
    }
  }

  /** Solo lo que viene en la URL (sin defaults) — para la línea bajo el nombre del perfil */
  function queryExplicitFromLocation(href) {
    try {
      var p = new URL(href || global.location.href).searchParams;
      return {
        categoria: p.get('categoria') || '',
        pais: p.get('pais') || '',
        estado: p.get('estado') || '',
        ciudad: p.get('ciudad') || ''
      };
    } catch (e) {
      return { categoria: '', pais: '', estado: '', ciudad: '' };
    }
  }

  function nivelBusqueda(Q) {
    Q = Q || {};
    if (Q.ciudad) return 'ciudad';
    if (Q.estado) return 'estado';
    if (Q.pais) return 'pais';
    return 'categoria';
  }

  var TITULO_SIN_RESULTADOS = 'No se encontraron resultados para lo que buscaste';
  var SUB_SIN_RESULTADOS = 'Prueba ampliar tu búsqueda, cambiar categoría o explorar otra zona.';

  function tituloVacio() {
    return TITULO_SIN_RESULTADOS;
  }

  function bannerLateralHTML(lado) {
    if (global.CariHubBannerSinResultados && CariHubBannerSinResultados.renderLateralHTML) {
      return CariHubBannerSinResultados.renderLateralHTML(lado);
    }
    var slot = lado === 'izq' ? 'sin_resultados_estados' : 'sin_resultados_libe';
    var label = lado === 'izq' ? 'Estados y zonas' : 'LIBE';
    var img = lado === 'izq'
      ? 'img/home/banners/ad-banner-pink-02.png'
      : 'img/home/banners/ad-banner-black-02.png';
    return '' +
      '<a class="res-vacio-side__banner" href="registro-banner.html?slot=' + slot + '" aria-label="Anuncio ' + label + '">' +
        '<span class="res-vacio-side__label">' + safeTxt(label) + '</span>' +
        '<img src="' + img + '" alt="Espacio publicitario ' + label + '" width="160" height="320" decoding="async">' +
      '</a>';
  }

  function vacioResultadosHTML(Q) {
    Q = Q || {};
    return '' +
      '<div class="res-vacio res-vacio--inline" role="status" aria-live="polite">' +
        '<span class="res-vacio__sparkles" aria-hidden="true"></span>' +
        '<div class="res-vacio__inner">' +
          '<div class="res-vacio__brand">Cariñosas</div>' +
          '<p class="res-vacio__tag">Encuentra tu compañía ideal</p>' +
          '<h2 class="res-vacio__title">' + safeTxt(tituloVacio()) + '</h2>' +
          '<p class="res-vacio__sub">' + safeTxt(SUB_SIN_RESULTADOS) + '</p>' +
        '</div>' +
      '</div>';
  }

  function urlPerfilPublico(u, Q) {
    Q = Q || {};
    var vista = (u && u.__vista) || vistaDeCategoria(Q.categoria || (u && u.categoria));
    var p = new URLSearchParams();
    if (u && u.__id) p.set('id', String(u.__id));
    p.set('vista', vista);
    if (Q.categoria || (u && u.categoria)) p.set('categoria', Q.categoria || u.categoria);
    if (Q.pais) p.set('pais', Q.pais);
    if (Q.estado) p.set('estado', Q.estado);
    if (Q.ciudad) p.set('ciudad', Q.ciudad);
    p.set('from', 'resultados');
    var modoRes = vistaPreviaModo();
    if (modoRes) p.set('resVista', modoRes);
    return './perfil-publico.html?' + p.toString();
  }

  function urlPerfil(u, Q) {
    if (u && (u.__registrado || u.__demo === false) && u.__id) {
      return urlPerfilPublico(u, Q);
    }
    return urlPerfilDemo(u, Q);
  }

  function urlPerfilDemo(u, Q) {
    return urlPerfilPublico(u, Q);
  }

  /** Busca un perfil demo canónico por __id (p. ej. demo-violeta). */
  function perfilPorId(id, Q) {
    if (!id) return null;
    Q = Q || queryFromLocation();
    var todos = PERFILES_CANON.slice();
    if (PERFIL_CANON_CUARTO) todos.push(PERFIL_CANON_CUARTO);
    if (PERFIL_CANON_QUINTO) todos.push(PERFIL_CANON_QUINTO);
    var base = todos.find(function (p) { return p.__id === id; });
    return base ? enriquecerPerfil(clonarPerfil(base, Q), Q) : null;
  }

  function safeTxt(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function normTxt(t) {
    return String(t || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function svgIco(name, cls) {
    cls = cls || 'mc-ic';
    var p = {
      pin: '<path d="M12 21c4.5-5 7-8.3 7-11a7 7 0 1 0-14 0c0 2.7 2.5 6 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
      money: '<rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.2"/>',
      home: '<path d="M4 11.5 12 5l8 6.5"/><path d="M6 10.5V19h12v-8.5"/>',
      hotel: '<path d="M8 6v12M16 6v12M6 10h12M6 14h12"/>',
      car: '<path d="M5 11l1.4-4.2A2 2 0 0 1 8.3 5.4h7.4a2 2 0 0 1 1.9 1.4L19 11"/><rect x="3.2" y="11" width="17.6" height="6" rx="2"/><circle cx="7.5" cy="17.5" r="1.4"/><circle cx="16.5" cy="17.5" r="1.4"/>',
      heart: '<path d="M12 20.2l-.9-.8C6.8 15.2 4.5 12.6 4.5 9.8 4.5 7 6.6 5 9.4 5c1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1 2.8 0 4.9 2 4.9 4.8 0 2.8-2.3 5.4-6.6 9.4l-.9.9z" fill="currentColor" stroke="none"/>',
      camera: '<path d="M4 8.5h3l1.6-2.2h6.8L17 8.5h3a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7a2 2 0 012-2z"/><circle cx="12" cy="13" r="3.2"/>'
    };
    return '<span class="' + cls + '" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (p[name] || '') + '</svg></span>';
  }

  function verificadoBadgeHTML() {
    return '<span class="verok"><span class="verok__ic" aria-hidden="true">' +
      '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="10" cy="10" r="8.25"/><path d="M6.4 10.1 8.7 12.4 13.7 7.6"/>' +
      '</svg></span><span class="verok__txt">Verificada</span></span>';
  }

  function modalidadesSet(u) {
    var set = {};
    if (Array.isArray(u.modalidades)) {
      u.modalidades.forEach(function (m) {
        var n = normTxt(String(m));
        if (n === 'recibe' || n.indexOf('recib') !== -1 || n.indexOf('lugar') !== -1) set.recibe = true;
        else if (n === 'hotel' || n.indexOf('hotel') !== -1) set.hotel = true;
        else if (n === 'domicilio' || n.indexOf('domicil') !== -1) set.domicilio = true;
      });
    }
    return set;
  }

  function ubicacionCorta(u) {
    if (u.ubicacion) return String(u.ubicacion).trim();
    var z = String(u.zona || '').trim();
    var c = String(u.ciudad || '').trim();
    if (z && c && z !== c) return z + ', ' + c;
    return z || c || '';
  }

  function verificadoIconHTML() {
    return '<span class="res-card__vcheck" aria-label="Verificada">' +
      '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="10" cy="10" r="8.25"/><path d="M6.4 10.1 8.7 12.4 13.7 7.6"/>' +
      '</svg></span>';
  }

  function esPerfilVip(u, catLabel) {
    if (u.vip === true || u.esVip === true) return true;
    return /vip/i.test(String(catLabel || ''));
  }

  function badgesCompactHTML(u, opts) {
    opts = opts || {};
    var items = [];
    if (opts.vip) {
      items.push('<span class="res-badge res-badge--vip">👑 VIP</span>');
    }
    if (opts.respRapida) {
      items.push('<span class="res-badge res-badge--fast">⚡ Respuesta rápida</span>');
    } else if (u.nueva) {
      items.push('<span class="res-badge res-badge--new">★ Nueva</span>');
    }
    if (!items.length) return '';
    return items.join('');
  }

  function chipModalidadHTML(set) {
    var items = [];
    if (set.recibe) items.push('<span class="modchip mc-pink">' + svgIco('home') + 'Recibe</span>');
    if (set.hotel) items.push('<span class="modchip mc-purple">' + svgIco('hotel') + 'Hotel</span>');
    if (set.domicilio) items.push('<span class="modchip mc-orange">' + svgIco('car') + 'Domicilio</span>');
    return items.join('');
  }

  function precioTexto(u) {
    var p = u.precio;
    if (p == null || String(p).trim() === '') return 'Consultar';
    var s = String(p).trim();
    return /^\$|mxn|usd|consult/i.test(s) ? s : '$' + s;
  }

  function numFotos(u) {
    if (u.fotosCount != null) return u.fotosCount;
    return u.fotoURL ? 1 : 0;
  }

  function disponibilidadDe(u) {
    if (global.CariHubMessengerPrivacidadUi && CariHubMessengerPrivacidadUi.disponibilidadCard) {
      return CariHubMessengerPrivacidadUi.disponibilidadCard(u);
    }
    var d = normTxt(u.disponibilidad || u.estatus || '');
    if (d.indexOf('ocup') !== -1) return { clase: 'neutral', txt: 'Consultar disponibilidad', busy: true };
    return { clase: 'neutral', txt: 'Consultar disponibilidad', busy: false };
  }

  function esSegmentoBusquedaExplicito(val, vacios) {
    var s = String(val || '').trim();
    if (!s || s === '—') return false;
    vacios = vacios || [];
    return vacios.indexOf(s) === -1;
  }

  /** Línea SEO: solo parámetros presentes en la URL (sin defaults de Q) */
  function segmentosBusquedaSeo() {
    var explicit = queryExplicitFromLocation();
    var parts = [];
    if (explicit.categoria) {
      var cat = labelCategoria(explicit.categoria);
      if (cat) parts.push(cat);
    }
    if (esSegmentoBusquedaExplicito(explicit.pais)) parts.push(explicit.pais.trim());
    if (esSegmentoBusquedaExplicito(explicit.estado, ['Todos los estados'])) parts.push(explicit.estado.trim());
    if (esSegmentoBusquedaExplicito(explicit.ciudad, ['Todas las ciudades'])) parts.push(explicit.ciudad.trim());
    return parts;
  }

  function textoSeoResultados(Q) {
    return segmentosBusquedaSeo(Q).join(' · ');
  }

  /** Debajo del nombre del perfil — mismos segmentos que la cabecera SEO */

  function lineaUbicacionPerfil(u, Q) {
    return segmentosBusquedaSeo(Q).join(' · ');
  }

  function observacionesLista(u) {
    if (Array.isArray(u.observaciones) && u.observaciones.length) {
      return u.observaciones.map(function (t) { return String(t || '').trim(); }).filter(Boolean);
    }
    if (u.observaciones) {
      return String(u.observaciones).split(/[,·|]/).map(function (t) { return t.trim(); }).filter(Boolean);
    }
    if (u.tagline) {
      return String(u.tagline).split(/[,.]/).map(function (t) { return t.trim(); }).filter(Boolean).slice(0, 4);
    }
    return [];
  }

  function observacionesHTML(u) {
    var items = observacionesLista(u);
    if (!items.length) return '';
    return '<div class="res-obs">' +
      '<span class="res-obs__label">Observaciones</span>' +
      '<p class="res-obs__txt">' +
      items.map(function (t, i) {
        return (i ? '<span class="res-obs__sep" aria-hidden="true"> · </span>' : '') + safeTxt(t);
      }).join('') +
      '</p></div>';
  }

  function descripcionHTML(u) {
    var txt = u.descripcion || u.tagline || '';
    if (!txt) return '';
    return '<div class="res-desc">' +
      '<span class="res-desc__label">Descripción</span>' +
      '<p class="res-desc__txt">' + svgIco('heart') + '<span>' + safeTxt(txt) + '</span></p>' +
      '</div>';
  }

  function observacionesCompactHTML(u) {
    var items = observacionesLista(u);
    if (!items.length) return '';
    return '<div class="res-card__obs">' +
      '<span class="res-card__obs-label">Observaciones</span>' +
      '<span class="res-card__obs-txt">' +
      items.map(function (t) { return safeTxt(t); }).join(' · ') +
      '</span></div>';
  }

  function descripcionCompactHTML(u) {
    var txt = String(u.descripcion || u.tagline || u.descripcionPublica || '').trim();
    if (!txt) return '';
    return '<p class="res-card__desc">' +
      '<span class="res-card__desc-label">Descripción</span>' +
      '<span class="res-card__desc-txt">' + safeTxt(txt) + '</span>' +
      '</p>';
  }

  function cardHTML(u, Q) {
    if (global.CariHubPublicRenderLite && CariHubPublicRenderLite.cardHTML) {
      return CariHubPublicRenderLite.cardHTML(u, Q);
    }
    Q = Q || {};
    var nombre = u.nombre || u.alias || 'Perfil';
    var edad = u.edad != null ? String(u.edad).trim() + ' años' : '';
    var loc = ubicacionCorta(u);
    var catLabel = labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '');
    var set = modalidadesSet(u);
    var fotos = numFotos(u);
    var disp = disponibilidadDe(u);
    var verificada = u.verificada === true || u.verificado === true;
    var respRapida = u.respuestaRapida !== false;
    var perfilId = u.__id || '';
    var favBtn = perfilId
      ? '<button type="button" class="res-fav" data-fav-perfil="' + safeTxt(perfilId) + '" aria-label="Guardar en favoritos" aria-pressed="false" onclick="toggleFav(this, event)">♡</button>'
      : '';
    var mods = chipModalidadHTML(set);
    var vip = esPerfilVip(u, catLabel);
    var badges = badgesCompactHTML(u, { vip: vip, respRapida: respRapida });
    var descBlock = descripcionCompactHTML(u);
    var obsBlock = observacionesCompactHTML(u);
    var priceBlock =
      '<div class="res-card__price">' +
        '<span class="res-card__price-ic" aria-hidden="true">' + svgIco('money', 'res-card__price-ic') + '</span>' +
        '<span class="res-card__price-desde">Desde</span>' +
        '<span class="res-card__price-val">' + safeTxt(precioTexto(u)) + '</span>' +
      '</div>';

    var metaRow = '';
    var footer = '';
    if (loc || mods) {
      metaRow = '<div class="res-card__row res-card__row--meta">' +
        (loc ? '<div class="res-card__loc">' + svgIco('pin', 'res-card__loc-ic') + '<span>' + safeTxt(loc) + '</span></div>' : '<span class="res-card__loc-spacer" aria-hidden="true"></span>') +
        (mods ? '<div class="modchips res-card__mods">' + mods + '</div>' : '') +
      '</div>';
    }

    if (catLabel || badges) {
      footer = '<div class="res-card__row res-card__row--foot">' +
        (catLabel ? '<div class="res-card__cat">' + svgIco('heart', 'res-card__cat-ic') + '<span>' + safeTxt(catLabel) + '</span></div>' : '<span class="res-card__cat-spacer" aria-hidden="true"></span>') +
        (badges ? '<div class="res-card__badges">' + badges + '</div>' : '') +
        '</div>';
    }

    return '' +
      '<article class="pcard res-card res-card--compact">' +
        '<div class="res-card__media">' +
          (u.nueva ? '<span class="res-nueva">NUEVA</span>' : '') +
          '<img src="' + safeTxt(u.fotoURL) + '" alt="Foto de ' + safeTxt(nombre) + '" width="360" height="210" loading="lazy" decoding="async">' +
          (fotos > 0 ? '<span class="gal__count">' + svgIco('camera', 'res-fotos-ic') + fotos + '</span>' : '') +
        '</div>' +
        '<div class="res-card__body">' +
          '<div class="res-card__main">' +
            '<div class="res-card__row res-card__row--head">' +
              '<div class="res-card__head">' +
                '<h2 class="res-card__name">' + safeTxt(nombre) + '</h2>' +
                (verificada ? verificadoIconHTML() : '') +
                (edad ? '<span class="age">' + safeTxt(edad) + '</span>' : '') +
              '</div>' +
              favBtn +
              '<span class="res-card__avail res-card__avail--' + disp.clase + '">' +
                '<span class="res-dot res-dot--' + disp.clase + '" aria-hidden="true"></span>' +
                safeTxt(disp.txt) +
              '</span>' +
              priceBlock +
            '</div>' +
            descBlock +
            obsBlock +
            metaRow +
            footer +
          '</div>' +
          '<button class="res-card__ver-btn" type="button" aria-label="Ver perfil de ' + safeTxt(nombre) + '" onclick="abrirPerfil(\'' + safeTxt(perfilId) + '\')">' +
            '<span class="res-card__ver-btn-txt">Ver perfil ›</span>' +
          '</button>' +
        '</div>' +
      '</article>';
  }

  function pasaFiltro(u, filtro) {
    if (filtro === 'todos' || filtro === 'cerca') return true;
    var set = modalidadesSet(u);
    if (filtro === 'nuevas') return u.nueva === true;
    if (filtro === 'verificadas') return u.verificada === true || u.verificado === true;
    if (filtro === 'lugar') return !!set.recibe;
    if (filtro === 'hotel') return !!set.hotel;
    if (filtro === 'domicilio') return !!set.domicilio;
    return true;
  }

  function syncBannersVista(esVacio, Q) {
    Q = Q || queryFromLocation();
    if (global.CariHubPublicidadActiva && typeof global.CariHubPublicidadActiva.syncBannersResultados === 'function') {
      global.CariHubPublicidadActiva.syncBannersResultados(esVacio, { Q: Q });
      return;
    }
    if (esVacio && global.CariHubBannerSinResultados && global.CariHubBannerSinResultados.syncResultadosPage) {
      global.CariHubBannerSinResultados.syncResultadosPage(true);
      return;
    }
    if (global.CariHubBannerSinResultados && global.CariHubBannerSinResultados.syncResultadosPage) {
      global.CariHubBannerSinResultados.syncResultadosPage(false);
    }
    if (global.CariHubBannerResultadosPrincipales && global.CariHubBannerResultadosPrincipales.mount) {
      global.CariHubBannerResultadosPrincipales.mount({ Q: Q, force: true });
    }
    if (global.CariHubBannerResultadosLaterales && global.CariHubBannerResultadosLaterales.mount) {
      global.CariHubBannerResultadosLaterales.mount({ Q: Q });
    }
    if (global.CariHubResultadosBanners && global.CariHubResultadosBanners.start) {
      global.CariHubResultadosBanners.start();
    }
  }

  function renderProfiles(listEl, perfiles, opts) {
    if (!listEl || !Array.isArray(perfiles)) return;
    opts = opts || {};
    var filtro = opts.filtro || 'todos';
    var Q = opts.Q || {};
    var porPagina = opts.porPagina;
    var filtrados = perfiles.filter(function (u) { return pasaFiltro(u, filtro); });
    if (!filtrados.length && perfiles.length) filtrados = perfiles;
    var visibles = (porPagina != null && porPagina > 0) ? filtrados.slice(0, porPagina) : filtrados;

    if (!visibles.length) {
      listEl.innerHTML = vacioResultadosHTML(Q);
      listEl.classList.add('res-lista--vacio');
      syncBannersVista(true, Q);
      return;
    }

    listEl.classList.remove('res-lista--vacio');
    listEl.innerHTML = visibles.map(function (u) { return cardHTML(u, Q); }).join('');
    syncBannersVista(false, Q);
  }

  global.CariHubResultadosDemo = {
    PERFILES_CANON: PERFILES_CANON,
    perfilesFallback: perfilesFallback,
    perfilesCanonicos: perfilesCanonicos,
    perfilesRegistrados: perfilesRegistrados,
    vistaPreviaModo: vistaPreviaModo,
    componerListaResultados: componerListaResultados,
    vacioResultadosHTML: vacioResultadosHTML,
    generarPerfiles: generarPerfiles,
    renderProfiles: renderProfiles,
    cardHTML: cardHTML,
    queryFromLocation: queryFromLocation,
    queryExplicitFromLocation: queryExplicitFromLocation,
    vistaDeCategoria: vistaDeCategoria,
    vistaDeCategoriaLegacy: vistaDeCategoriaLegacy,
    presentacionDeCategoria: presentacionDeCategoria,
    enriquecerPerfil: enriquecerPerfil,
    labelCategoria: labelCategoria,
    idCategoria: idCategoria,
    nivelBusqueda: nivelBusqueda,
    textoSeoResultados: textoSeoResultados,
    segmentosBusquedaSeo: segmentosBusquedaSeo,
    lineaUbicacionPerfil: lineaUbicacionPerfil,
    coincideBusqueda: coincideBusqueda,
    coincideDemo: coincideDemo,
    urlPerfil: urlPerfil,
    urlPerfilPublico: urlPerfilPublico,
    urlPerfilDemo: urlPerfilDemo,
    perfilPorId: perfilPorId
  };
})(typeof window !== 'undefined' ? window : globalThis);
