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

  /** Pools de foto por subcategoría LGBT/adulta especializada (no reutilizar Violeta). */
  var FOTOS_POR_SUB = {
    'velas aromaticas': [
      'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
      'img/registro-subcats/bienestar/bien-05-herbolaria.png',
      'img/registro-subcats/bienestar/bien-09-cristales.png',
      'img/registro-subcats/bienestar/bien-10-meditacion.png'
    ],
    'velas esotericas': [
      'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
      'img/registro-subcats/bienestar/bien-09-cristales.png',
      'img/registro-subcats/bienestar/bien-05-herbolaria.png',
      'img/registro-subcats/bienestar/bien-02-temazcal.png'
    ],
    'venta de velas': [
      'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
      'img/registro-subcats/bienestar/bien-05-herbolaria.png',
      'img/registro-subcats/bienestar/bien-09-cristales.png',
      'img/registro-subcats/bienestar/bien-01-yoga.png'
    ],
    'venta de inciensos': [
      'img/registro-subcats/bienestar/bien-05-herbolaria.png',
      'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
      'img/registro-subcats/bienestar/bien-09-cristales.png',
      'img/registro-subcats/bienestar/bien-10-meditacion.png'
    ],
    'venta de aceites esenciales': [
      'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
      'img/registro-subcats/bienestar/bien-05-herbolaria.png',
      'img/registro-subcats/bienestar/bien-06-masaje.png',
      'img/registro-subcats/bienestar/bien-10-meditacion.png'
    ],
    'venta de aceites': [
      'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
      'img/registro-subcats/bienestar/bien-05-herbolaria.png',
      'img/registro-subcats/bienestar/bien-06-masaje.png',
      'img/registro-subcats/bienestar/bien-09-cristales.png'
    ],
    aromaterapia: [
      'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
      'img/registro-subcats/bienestar/bien-05-herbolaria.png',
      'img/registro-subcats/bienestar/bien-06-masaje.png',
      'img/registro-subcats/bienestar/bien-10-meditacion.png'
    ],
    'escort gay': [
      'img/home/escort-gay.jpg',
      'img/home/hero-escort-gay.png',
      'img/home/hero-01-escort-gay.png',
      'img/home/cat-cards/escort-gay-pro.png'
    ],
    trans: [
      'img/home/cat-cards/femboy-pro.png',
      'img/home/cat-cards/femboy.png',
      'img/home/hero-lesbianas.png',
      'img/home/cat-cards/antro-lgbt-pro.png'
    ],
    femboy: [
      'img/home/cat-cards/femboy.png',
      'img/home/cat-cards/femboy-pro.png',
      'img/home/hero-01-escort-gay.png',
      'img/home/escort-gay.jpg'
    ],
    lesbians: [
      'img/home/hero-lesbianas.png',
      'img/resultados-demo/violeta-2.png',
      'img/resultados-demo/violeta-3.png',
      'img/resultados-demo/violeta-4.png'
    ],
    'tom boy': [
      'img/home/hero-lesbianas.png',
      'img/home/cat-cards/femboy-pro.png',
      'img/home/escort-gay.jpg',
      'img/home/hero-escort-gay.png'
    ],
    'tom fem': [
      'img/home/hero-lesbianas.png',
      'img/resultados-demo/violeta-1.png',
      'img/resultados-demo/violeta-3.png',
      'img/home/cat-cards/femboy.png'
    ],
    'antro restaurant bar lgbt': [
      'img/home/cat-cards/antro-lgbt.png',
      'img/home/cat-cards/antro-lgbt-pro.png',
      'img/home/banners/ad-banner-adult-antro-lgbt-01.png',
      'img/home/hero-bar-neon.png'
    ]
  };

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
        { nombreComercial: 'Hotel & Suites Valle', precio: '890', tagline: 'Habitaciones temáticas y total discreción.', horario: '24 horas', categoriaPublica: 'Hotel / Motel', verificada: true, colaboracionContenido: 'Sí', mostrarColaboracionContenidoPublico: 'Sí' },
        { nombreComercial: 'Motel Luna Rosa', precio: '650', tagline: 'Entrada discreta, jacuzzi y estacionamiento privado.', horario: '24 horas', categoriaPublica: 'Hotel / Motel', verificada: true },
        { nombreComercial: 'Suites Express MTY', precio: '720', tagline: 'Habitaciones por horas y noche, Wi‑Fi y room service.', horario: '24 horas', categoriaPublica: 'Hotel / Motel', verificada: true }
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
    },
    /* Personas adultas con demos propios (no reutilizar pool Violeta). */
    ResultCardAdultos: {
      'escort gay': [
        { nombre: 'Mateo R.', edad: 26, precio: '1,800', tagline: 'Compañía masculina, discreción y trato de novio.', modalidades: ['recibe', 'hotel', 'domicilio'], verificada: true, nueva: true, badgeLgbt: true, categoriaPublica: 'Escort Gay' },
        { nombre: 'Diego L.', edad: 28, precio: '2,000', tagline: 'Atlético, puntual y conversación agradable.', modalidades: ['hotel', 'domicilio'], verificada: true, badgeLgbt: true, categoriaPublica: 'Escort Gay' },
        { nombre: 'Andrés V.', edad: 24, precio: '1,600', tagline: 'Perfil LGBT verificado, zonas centro y sur.', modalidades: ['recibe', 'hotel'], verificada: true, badgeLgbt: true, categoriaPublica: 'Escort Gay' },
        { nombre: 'Leo M.', edad: 30, precio: '2,200', tagline: 'Experiencia premium y total confidencialidad.', modalidades: ['recibe', 'hotel', 'domicilio'], verificada: true, badgeLgbt: true, categoriaPublica: 'Escort Gay' }
      ],
      trans: [
        { nombre: 'Valentina T.', edad: 25, precio: '2,200', tagline: 'Trans femenina elegante, discreta y muy atenta.', modalidades: ['recibe', 'hotel'], verificada: true, nueva: true, badgeTrans: true, badgeLgbt: true, categoriaPublica: 'Trans' },
        { nombre: 'Camila Soft', edad: 27, precio: '2,000', tagline: 'Trato cariñoso y buena conversación.', modalidades: ['hotel', 'domicilio'], verificada: true, badgeTrans: true, badgeLgbt: true, categoriaPublica: 'Trans' },
        { nombre: 'Nina Glow', edad: 23, precio: '1,900', tagline: 'Perfil trans verificado en Monterrey.', modalidades: ['recibe', 'hotel', 'domicilio'], verificada: true, badgeTrans: true, badgeLgbt: true, categoriaPublica: 'Trans' }
      ],
      femboy: [
        { nombre: 'Alex Soft', edad: 22, precio: '1,700', tagline: 'Femboy cute, juguetón y con estilo propio.', modalidades: ['recibe', 'hotel'], verificada: true, nueva: true, badgeLgbt: true, categoriaPublica: 'Femboy' },
        { nombre: 'Kai Pink', edad: 24, precio: '1,850', tagline: 'Looks andróginos y trato dulce.', modalidades: ['hotel', 'domicilio'], verificada: true, badgeLgbt: true, categoriaPublica: 'Femboy' },
        { nombre: 'Ren M.', edad: 21, precio: '1,600', tagline: 'Femboy verificado, disponible con cita.', modalidades: ['recibe', 'hotel', 'domicilio'], verificada: true, badgeLgbt: true, categoriaPublica: 'Femboy' }
      ],
      lesbians: [
        { nombre: 'Luna S.', edad: 26, precio: '1,900', tagline: 'Lesbiana verificada, atención a mujeres y parejas.', modalidades: ['recibe', 'hotel'], verificada: true, badgeLgbt: true, categoriaPublica: 'Lesbians' },
        { nombre: 'Sara & Co', edad: 28, precio: '2,100', tagline: 'Estilo femenino, citas discretas y buena energía.', modalidades: ['hotel', 'domicilio'], verificada: true, badgeLgbt: true, categoriaPublica: 'Lesbians' },
        { nombre: 'Meli R.', edad: 24, precio: '1,750', tagline: 'Perfil LGBT · Monterrey sur.', modalidades: ['recibe', 'hotel', 'domicilio'], verificada: true, nueva: true, badgeLgbt: true, categoriaPublica: 'Lesbians' }
      ],
      'tom boy': [
        { nombre: 'Alexa Tom', edad: 25, precio: '1,800', tagline: 'Tom boy confiada, look casual y trato directo.', modalidades: ['recibe', 'hotel'], verificada: true, badgeLgbt: true, categoriaPublica: 'Tom Boy' },
        { nombre: 'Javi T.', edad: 27, precio: '1,950', tagline: 'Estilo masculino suave y gran charla.', modalidades: ['hotel', 'domicilio'], verificada: true, badgeLgbt: true, categoriaPublica: 'Tom Boy' },
        { nombre: 'Sam R.', edad: 23, precio: '1,700', tagline: 'Tom boy verificada, zonas cumbres y centro.', modalidades: ['recibe', 'hotel', 'domicilio'], verificada: true, badgeLgbt: true, categoriaPublica: 'Tom Boy' }
      ],
      'tom fem': [
        { nombre: 'Nora Fem', edad: 26, precio: '1,850', tagline: 'Tom fem elegante: mezcla suave y feminidad.', modalidades: ['recibe', 'hotel'], verificada: true, badgeLgbt: true, categoriaPublica: 'Tom Fem' },
        { nombre: 'Ivy Soft', edad: 24, precio: '1,900', tagline: 'Presentación cuidada y trato de novia.', modalidades: ['hotel', 'domicilio'], verificada: true, nueva: true, badgeLgbt: true, categoriaPublica: 'Tom Fem' },
        { nombre: 'Dana M.', edad: 28, precio: '2,050', tagline: 'Tom fem verificada en San Pedro.', modalidades: ['recibe', 'hotel', 'domicilio'], verificada: true, badgeLgbt: true, categoriaPublica: 'Tom Fem' }
      ]
    }
  };

  /** Demos sector Bienestar holístico (packs A–H). Campos públicos alineados a bienestarHolisticoPerfil. */
  var BIENESTAR_PACK_POR_SUB = {
    temazcales: 'C', 'centros-holisticos': 'C', 'centros-de-bienestar': 'C', 'centros-de-meditacion': 'C',
    'centros-de-yoga': 'C', 'centros-de-sanacion': 'C',
    'retiros-espirituales': 'G', 'turismo-espiritual': 'G', 'cacao-ceremonial': 'G',
    'medicina-ancestral': 'H', chamanismo: 'H', 'ceremonias-tradicionales': 'H',
    'ceremonias-ayahuasca-rape-plantas-de-poder': 'H', 'ceremonias-ayahuasca': 'H',
    'terapias-holisticas': 'A', reiki: 'A', biomagnetismo: 'A', acupuntura: 'A', aromaterapia: 'A',
    'terapias-energeticas': 'A', 'terapias-alternativas': 'A', 'medicina-natural': 'A', naturopatia: 'A',
    'medicina-tradicional-china': 'A', 'flores-de-bach': 'A', homeopatia: 'A',
    'masajes-holisticos': 'A', 'masajes-relajantes': 'A', 'masajes-terapeuticos': 'A',
    'limpias-energeticas': 'A', reflexologia: 'A',
    yoga: 'B', pilates: 'B', meditacion: 'B', breathwork: 'B', sonoterapia: 'B', ayurveda: 'B',
    herbolaria: 'D', 'tiendas-esotericas': 'D', 'productos-holisticos': 'D', 'productos-naturistas': 'D',
    'suplementos-naturales': 'D', herbolarios: 'D', naturistas: 'D',
    'venta-de-inciensos': 'D', 'venta-de-aceites-esenciales': 'D', 'venta-de-aceites': 'D',
    'venta-de-velas': 'D', 'velas-esotericas': 'D', 'velas-aromaticas': 'D', sahumerios: 'D',
    'cosmetica-natural': 'D',
    tarot: 'E', astrologia: 'E', numerologia: 'E', 'lectura-de-cartas': 'E', 'lectura-de-runas': 'E',
    'feng-shui': 'E', cristaloterapia: 'E', 'registros-akashicos': 'E',
    'coaching-de-vida': 'F', 'coaching-espiritual': 'F', 'desarrollo-personal': 'F', 'crecimiento-personal': 'F'
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
    reiki: [
      { alias: 'Luna Reiki MTY', precio: '600', tagline: 'Sesiones de Reiki presencial y a distancia.', certificaciones: 'Certificación Reiki Usui nivel II', modalidadesTerapia: ['Reiki presencial', 'Reiki a distancia'], duracionSesionMinutos: '60_min', horario: 'Mar–Sáb 10:00–19:00', atencionDomicilio: 'No' }
    ],
    acupuntura: [
      { alias: 'Clínica Meridiano Norte', precio: '700', tagline: 'Acupuntura terapéutica para dolor, estrés y equilibrio.', certificaciones: 'Cédula profesional · formación en acupuntura', modalidadesTerapia: ['Acupuntura', 'Electroacupuntura'], duracionSesionMinutos: '60_min', horario: 'Lun–Sáb 9:00–19:00', atencionDomicilio: 'No' },
      { alias: 'Acupuntura del Valle', precio: '650', tagline: 'Sesiones de acupuntura con evaluación inicial.', certificaciones: 'Diplomado en medicina tradicional china', modalidadesTerapia: ['Acupuntura', 'Moxibustión'], duracionSesionMinutos: '45_min', horario: 'Mar–Vie 10:00–18:00' }
    ],
    biomagnetismo: [
      { alias: 'BioCampo MTY', precio: '750', tagline: 'Biomagnetismo médico con seguimiento personalizado.', certificaciones: 'Diplomado en biomagnetismo médico', modalidadesTerapia: ['Biomagnetismo'], duracionSesionMinutos: '90_min', horario: 'Con cita previa' }
    ],
    aromaterapia: [
      { alias: 'Esencia Viva', precio: '550', tagline: 'Aromaterapia clínica y blends personalizados.', certificaciones: 'Formación en aromaterapia terapéutica', modalidadesTerapia: ['Aromaterapia', 'Masaje aromático'], duracionSesionMinutos: '60_min', horario: 'Lun–Sáb 11:00–19:00' }
    ],
    ayurveda: [
      { alias: 'Ayurveda Monterrey', precio: '800', tagline: 'Consultas ayurvédicas y rutinas de equilibrio.', certificaciones: 'Formación en Ayurveda clásico', tipoPractica: 'Ayurveda · consulta', modalidadClase: 'presencial', nivelesAtendidos: 'todos', horario: 'Mar–Sáb 10:00–18:00' }
    ],
    sonoterapia: [
      { alias: 'Sonidos del Centro', precio: '500', tagline: 'Baños de gong, cuencos y sonoterapia en grupo.', certificaciones: 'Formación en sound healing', tipoPractica: 'Sonoterapia', modalidadClase: 'presencial', nivelesAtendidos: 'todos', horario: 'Vie–Dom con reservación' }
    ],
    'masajes-holisticos': [
      { alias: 'Manos Sanadoras', precio: '650', tagline: 'Masaje holístico con aceites esenciales.', certificaciones: 'Certificación en masaje terapéutico holístico', modalidadesTerapia: ['Masaje holístico', 'Aromaterapia'], duracionSesionMinutos: '90_min', horario: 'Lun–Sáb 10:00–20:00' }
    ],
    'masajes-relajantes': [
      { alias: 'Tacto Sereno', precio: '580', tagline: 'Masaje relajante para estrés y tensión muscular.', certificaciones: 'Técnico en masaje relajante', modalidadesTerapia: ['Masaje relajante'], duracionSesionMinutos: '60_min', horario: 'Lun–Dom 10:00–21:00' }
    ],
    'masajes-terapeuticos': [
      { alias: 'Terapia Muscular NX', precio: '720', tagline: 'Masaje terapéutico para rehabilitación y dolor.', certificaciones: 'Certificación en masaje terapéutico', modalidadesTerapia: ['Masaje terapéutico', 'Puntos gatillo'], duracionSesionMinutos: '60_min', horario: 'Lun–Vie 9:00–19:00' }
    ],
    temazcales: DEMO_BIENESTAR_BY_PACK.C,
    'centros-de-yoga': DEMO_BIENESTAR_BY_PACK.B,
    yoga: DEMO_BIENESTAR_BY_PACK.B,
    pilates: [
      { alias: 'Pilates Casa Norte', precio: '400', tagline: 'Pilates mat e reformer en grupos reducidos.', certificaciones: 'Instructora certificada de pilates', tipoPractica: 'Pilates', modalidadClase: 'presencial', nivelesAtendidos: 'todos', horario: 'Lun–Sáb 7:00–20:00' }
    ],
    meditacion: [
      { alias: 'Silencio Práctico', precio: '300', tagline: 'Meditación guiada y mindfulness para principiantes.', certificaciones: 'Instructora de mindfulness', tipoPractica: 'Meditación', modalidadClase: 'hibrido', nivelesAtendidos: 'principiante', horario: 'Mar–Dom 8:00–19:00' }
    ],
    breathwork: [
      { alias: 'Aire Consciente', precio: '450', tagline: 'Breathwork y respiración consciente en sesión grupal.', certificaciones: 'Facilitador de breathwork', tipoPractica: 'Breathwork', modalidadClase: 'presencial', nivelesAtendidos: 'todos', horario: 'Jue–Sáb con cita' }
    ],
    'tiendas-esotericas': DEMO_BIENESTAR_BY_PACK.D,
    herbolaria: [
      { alias: 'Herbolaria del Valle', precio: '80', tagline: 'Plantas medicinales, tinturas y asesoría herbolaria.', certificaciones: 'Herbolaria tradicional', nombreComercial: 'Herbolaria del Valle', surtidoPrincipal: 'Plantas medicinales · Tinturas', categoriasProductoBienestar: ['Herbolaria', 'Tinturas'], ventaPresencial: 'Sí', horario: 'Lun–Vie 9:00–18:00' }
    ],
    herbolarios: [
      { alias: 'Botica Verde', precio: '90', tagline: 'Herbolario con plantas, tés y remedios naturales.', certificaciones: 'Comercio herbolario local', nombreComercial: 'Botica Verde', surtidoPrincipal: 'Tés · Plantas · Ungüentos', categoriasProductoBienestar: ['Herbolaria'], ventaPresencial: 'Sí', direccion: 'Monterrey', horario: 'Lun–Sáb 10:00–19:00' }
    ],
    naturistas: [
      { alias: 'Naturista del Norte', precio: '100', tagline: 'Productos naturistas y orientación de uso cotidiano.', certificaciones: 'Tienda naturista', nombreComercial: 'Naturista del Norte', surtidoPrincipal: 'Suplementos · Tés · Cuidado natural', categoriasProductoBienestar: ['Productos naturistas'], ventaPresencial: 'Sí', horario: 'Lun–Sáb 10:00–20:00' }
    ],
    'productos-naturistas': [
      { alias: 'Casa Naturista', precio: '95', tagline: 'Línea naturista: suplementos, tés y cuidado personal.', certificaciones: 'Distribución naturista', nombreComercial: 'Casa Naturista', surtidoPrincipal: 'Suplementos · Tés · Cremas', categoriasProductoBienestar: ['Productos naturistas'], ventaPresencial: 'Sí', horario: 'Lun–Vie 10:00–19:00' }
    ],
    'productos-holisticos': DEMO_BIENESTAR_BY_PACK.D,
    'suplementos-naturales': [
      { alias: 'Vitalia Suplementos', precio: '250', tagline: 'Suplementos naturales y asesoría básica de uso.', certificaciones: 'Comercio de suplementos', nombreComercial: 'Vitalia Suplementos', surtidoPrincipal: 'Vitaminas · Minerales · Hierbas', categoriasProductoBienestar: ['Suplementos naturales'], ventaPresencial: 'Sí', horario: 'Lun–Sáb 10:00–20:00' }
    ],
    'cosmetica-natural': [
      { alias: 'Piel Nativa', precio: '180', tagline: 'Cosmética natural artesanal sin fragancias sintéticas.', certificaciones: 'Elaboración artesanal', nombreComercial: 'Piel Nativa', surtidoPrincipal: 'Cremas · Jabones · Aceites faciales', categoriasProductoBienestar: ['Cosmética natural'], ventaPresencial: 'Sí', horario: 'Mar–Sáb 11:00–19:00' }
    ],
    sahumerios: [
      { alias: 'Sahumería Luna', precio: '65', tagline: 'Sahumerios, resinas e inciensos para ritual y hogar.', certificaciones: 'Comercio esotérico local', nombreComercial: 'Sahumería Luna', surtidoPrincipal: 'Sahumerios · Resinas · Carbones', categoriasProductoBienestar: ['Sahumerios', 'Inciensos'], ventaPresencial: 'Sí', horario: 'Lun–Sáb 11:00–19:00' }
    ],
    'velas-esotericas': [
      { alias: 'Casa de las Velas', precio: '120', tagline: 'Velas rituales, aromáticas y de intención.', certificaciones: 'Comercio esotérico local', nombreComercial: 'Casa de las Velas', surtidoPrincipal: 'Velas rituales · Aromáticas · Intención', categoriasProductoBienestar: ['Velas esotéricas', 'Velas aromáticas'], ventaPresencial: 'Sí', direccion: 'Barrio Antiguo, Monterrey', horario: 'Lun–Sáb 11:00–20:00' },
      { alias: 'Luz y Cera', precio: '90', tagline: 'Velas artesanales para rituales y meditación.', certificaciones: 'Elaboración artesanal', nombreComercial: 'Luz y Cera', surtidoPrincipal: 'Velas artesanales · Kits rituales', categoriasProductoBienestar: ['Velas esotéricas'], ventaPresencial: 'Sí', horario: 'Mar–Dom 10:00–19:00' }
    ],
    'velas-aromaticas': [
      { alias: 'Aroma y Cera', precio: '110', tagline: 'Velas aromáticas artesanales y de intención.', certificaciones: 'Comercio local', nombreComercial: 'Aroma y Cera', surtidoPrincipal: 'Velas aromáticas · Kits', categoriasProductoBienestar: ['Velas aromáticas'], ventaPresencial: 'Sí', direccion: 'Monterrey', horario: 'Lun–Sáb 10:00–20:00' },
      { alias: 'Vela Serena', precio: '95', tagline: 'Velas de soya con aromas naturales.', certificaciones: 'Elaboración artesanal', nombreComercial: 'Vela Serena', surtidoPrincipal: 'Velas de soya · Aromáticas', categoriasProductoBienestar: ['Velas aromáticas'], ventaPresencial: 'Sí', horario: 'Mar–Dom 11:00–19:00' }
    ],
    'venta-de-inciensos': [
      { alias: 'Humos Sagrados', precio: '80', tagline: 'Inciensos, sahumerios y resinas naturales.', certificaciones: 'Comercio holístico', nombreComercial: 'Humos Sagrados', surtidoPrincipal: 'Inciensos · Sahumerios · Resinas', categoriasProductoBienestar: ['Inciensos', 'Sahumerios'], ventaPresencial: 'Sí', direccion: 'Centro Monterrey', horario: 'Lun–Sáb 10:00–20:00' }
    ],
    'venta-de-aceites-esenciales': [
      { alias: 'Esencias del Valle', precio: '220', tagline: 'Aceites esenciales puros y blends aromáticos.', certificaciones: 'Distribución de aceites terapéuticos', nombreComercial: 'Esencias del Valle', surtidoPrincipal: 'Aceites esenciales · Blends · Difusores', categoriasProductoBienestar: ['Aceites esenciales', 'Aromaterapia'], ventaPresencial: 'Sí', direccion: 'San Pedro Garza García', horario: 'Lun–Sáb 10:00–19:00' }
    ],
    tarot: DEMO_BIENESTAR_BY_PACK.E,
    astrologia: [
      { alias: 'Astros MTY', precio: '500', tagline: 'Carta natal y tránsitos con enfoque práctico.', certificaciones: 'Estudios de astrología evolutiva', enfoqueEspiritual: 'Astrología evolutiva', modalidadLectura: 'online', horario: 'Lun–Sáb' }
    ],
    numerologia: [
      { alias: 'Números del Alma', precio: '350', tagline: 'Numerología para decisiones y autoconocimiento.', certificaciones: 'Formación en numerología', enfoqueEspiritual: 'Numerología', modalidadLectura: 'ambas', horario: 'Con cita' }
    ],
    'lectura-de-cartas': [
      { alias: 'Oráculo Serena', precio: '380', tagline: 'Lectura de cartas oráculo y tarot terapéutico.', certificaciones: 'Formación en lectura de cartas', enfoqueEspiritual: 'Oráculo · Tarot', modalidadLectura: 'ambas', horario: 'Mar–Dom con cita' }
    ],
    'lectura-de-runas': [
      { alias: 'Runas del Norte', precio: '360', tagline: 'Lectura de runas con enfoque simbólico y práctico.', certificaciones: 'Estudio de runas nórdicas', enfoqueEspiritual: 'Runas', modalidadLectura: 'presencial', horario: 'Vie–Dom' }
    ],
    'feng-shui': [
      { alias: 'Espacio Armónico', precio: '1,200', tagline: 'Asesoría de feng shui para hogar y negocio.', certificaciones: 'Consultor de feng shui', enfoqueEspiritual: 'Feng shui', modalidadLectura: 'presencial', horario: 'Lun–Vie con visita' }
    ],
    cristaloterapia: [
      { alias: 'Cristales Vivos', precio: '420', tagline: 'Sesiones de cristaloterapia y selección de piedras.', certificaciones: 'Formación en cristaloterapia', enfoqueEspiritual: 'Cristales', modalidadLectura: 'presencial', horario: 'Mar–Sáb' }
    ],
    'registros-akashicos': [
      { alias: 'Akasha Claro', precio: '700', tagline: 'Lectura de registros akáshicos con integración.', certificaciones: 'Facilitadora de registros akáshicos', enfoqueEspiritual: 'Registros akáshicos', modalidadLectura: 'ambas', horario: 'Con cita previa' }
    ],
    'coaching-de-vida': DEMO_BIENESTAR_BY_PACK.F,
    'coaching-espiritual': [
      { alias: 'Despertar Interior', precio: '750', tagline: 'Coaching espiritual y desarrollo personal.', certificaciones: 'Diplomado en coaching ontológico', areaCoaching: 'Desarrollo personal · espiritualidad', modalidadSesionCoaching: 'mixta', horario: 'Con cita previa' }
    ],
    'desarrollo-personal': [
      { alias: 'Ruta Personal', precio: '850', tagline: 'Sesiones de desarrollo personal y hábitos.', certificaciones: 'Coach de desarrollo personal', areaCoaching: 'Hábitos · metas · claridad', modalidadSesionCoaching: 'individual', horario: 'Lun–Vie 9:00–18:00' }
    ],
    'crecimiento-personal': [
      { alias: 'Crece Contigo', precio: '800', tagline: 'Acompañamiento en crecimiento personal y autoconocimiento.', certificaciones: 'Formación en coaching de vida', areaCoaching: 'Crecimiento personal', modalidadSesionCoaching: 'individual', horario: 'Mar–Sáb' }
    ],
    'retiros-espirituales': DEMO_BIENESTAR_BY_PACK.G,
    'turismo-espiritual': DEMO_BIENESTAR_BY_PACK.G,
    'cacao-ceremonial': [
      { alias: 'Círculo de Cacao', precio: '450', tagline: 'Ceremonias de cacao en círculo con música en vivo.', certificaciones: 'Facilitadora de cacao ceremonial', tipoExperiencia: 'ceremonia', duracionExperiencia: '2.5 horas', fechasExperiencia: 'Consultar calendario', lugarExperiencia: 'Monterrey', cupoMaximo: '18', horario: 'Fines de semana' }
    ],
    'ceremonias-ayahuasca-rape-plantas-de-poder': DEMO_BIENESTAR_BY_PACK.H,
    'ceremonias-ayahuasca': DEMO_BIENESTAR_BY_PACK.H,
    'ceremonias-tradicionales': [
      { alias: 'Fogata Ancestral', precio: 'Consultar', tagline: 'Ceremonias tradicionales con protocolo y respeto cultural.', certificaciones: 'Facilitadores con formación en medicina tradicional', tipoExperienciaCeremonial: 'ceremonia_tradicional', acompanamientoCeremonial: ['Guía experimentado', 'Espacio seguro'], requisitosPrevios: 'Mayor de edad · entrevista previa', fechasCeremonia: 'Consultar', cupoCeremonia: '12', lugarCeremonia: 'Espacio ceremonial privado', horario: 'Solo con cita' }
    ],
    chamanismo: DEMO_BIENESTAR_BY_PACK.H,
    'medicina-ancestral': DEMO_BIENESTAR_BY_PACK.H
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

  /** Dato demo cross-sector: colaboración para contenido en redes.
     Se aplica a todas las subcategorías (dato universal) para que el badge sea
     visible en la vista previa. Determinístico: la mayoría «Sí», algunas «a convenir». */
  function aplicarDemoColaboracion(u) {
    if (!u || !u.__demo) return;
    var actual = String(u.colaboracionContenido || '').trim();
    if (actual) {
      if (u.mostrarColaboracionContenidoPublico == null) u.mostrarColaboracionContenidoPublico = 'Sí';
      return;
    }
    var s = String(u.__id || u.nombre || u.alias || u.nombreComercial || '');
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    u.colaboracionContenido = (h % 4 === 0) ? 'Bajo acuerdo previo' : 'Sí';
    u.mostrarColaboracionContenidoPublico = 'Sí';
  }

  function enriquecerPerfil(u, Q) {
    aplicarDemoColaboracion(u);
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
    return FOTOS[((i % FOTOS.length) + FOTOS.length) % FOTOS.length];
  }

  function normSubFotoKey(catId) {
    return String(catId || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Foto del pool canónico O del pool LGBT/especializado de la subcategoría. */
  function fotoPara(catId, i) {
    var key = normSubFotoKey(catId);
    var pool = FOTOS_POR_SUB[key];
    if (!pool || !pool.length) return foto(i);
    return pool[((i % pool.length) + pool.length) % pool.length];
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
    /* La búsqueda manda: no reusar categoriaPublica fija del mock escort. */
    if (Q && Q.categoria) {
      u.categoria = Q.categoria;
      u.categoriaPublica = labelCategoria(Q.categoria);
      u.subcategoriaId = idCategoria(Q.categoria) || u.subcategoriaId;
    } else {
      u.categoria = base.categoria || 'Cariñosas';
      u.categoriaPublica = base.categoriaPublica || u.categoria;
    }
    u.pais = Q.pais || 'México';
    u.estado = u.estado || Q.estado || 'Nuevo León';
    u.ciudad = u.ciudad || Q.ciudad || 'Monterrey';
    if (u.fotosCount) {
      var extraN = Math.max(0, (u.fotosCount | 0) - 1);
      u.fotosExtraURL = [];
      for (var fi = 0; fi < extraN; fi++) {
        u.fotosExtraURL.push(foto(fi + 1));
      }
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

  /**
   * Vista previa "con resultados" respetando la categoría buscada.
   * Solo las categorías de persona adulta usan el pool canónico adulto;
   * el resto usa el generador sectorial (gastronomía, salud, hogar, etc.)
   * para evitar contaminación de datos entre subcategorías.
   */
  /** Sector real de la búsqueda (usa el resolvedor oficial de resultados). */
  function sectorDeBusqueda(Q) {
    if (global.CariHubResultadosSector && CariHubResultadosSector.sectorDeCategoria) {
      try { return CariHubResultadosSector.sectorDeCategoria((Q && Q.categoria) || ''); }
      catch (e) { /* fallback abajo */ }
    }
    return '';
  }

  /**
   * ¿La búsqueda corresponde a una persona adulta (escort, trans, femboy…)?
   * Anti-contaminación: el pool canónico escort SOLO aplica a ResultCardAdultos.
   * Negocios del sector adultos (hotel/motel, spa, antro…) usan su demo de negocio.
   */
  function esBusquedaAdulta(Q, pres) {
    pres = pres || presentacionDeCategoria((Q && Q.categoria) || '');
    if (pres && pres.esAdultoPersona === true) return true;
    if (pres && pres.componenteResultados === 'ResultCardAdultos') return true;
    var cat = (Q && Q.categoria) ? String(Q.categoria).trim() : '';
    if (!cat) return false;
    var canonId = idCategoria(cat);
    if (canonId) {
      var presCanon = presentacionDeCategoria(canonId);
      if (presCanon && (presCanon.esAdultoPersona || presCanon.componenteResultados === 'ResultCardAdultos')) {
        return true;
      }
    }
    return false;
  }

  /** Hay pool demo específico de la subcategoría (LGBT, etc.) — no usar Violeta genérica. */
  function tieneDemoAdultoEspecializado(pres, Q) {
    var comp = (pres && pres.componenteResultados) || 'ResultCardAdultos';
    if (comp !== 'ResultCardAdultos') return false;
    var subId = (pres && pres.subcategoriaId) || idCategoria((Q && Q.categoria) || '');
    var bucket = DEMO_POR_COMPONENTE.ResultCardAdultos;
    if (!bucket || !subId) return false;
    var key = String(subId).trim().toLowerCase().replace(/_/g, ' ');
    var pool = bucket[key] || bucket[subId];
    return !!(pool && pool.length);
  }

  function perfilesPreviewPorCategoria(Q, incluirQuinto) {
    Q = Q || {};
    var pres = presentacionDeCategoria(Q.categoria);
    if (!esBusquedaAdulta(Q, pres)) {
      return plantillaDemoSchema(Q, pres);
    }
    if (tieneDemoAdultoEspecializado(pres, Q)) {
      return plantillaDemoSchema(Q, pres);
    }
    return incluirQuinto ? perfilesCanonicosCinco(Q) : perfilesCanonicosCuatro(Q);
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
      fotoURL: fotoPara(catId, idx),
      fotosExtraURL: [fotoPara(catId, idx + 1), fotoPara(catId, idx + 2), fotoPara(catId, idx + 3), fotoPara(catId, idx + 4)]
    };
    if (base.badgeLgbt) u.badgeLgbt = true;
    if (base.badgeTrans) u.badgeTrans = true;
    if (base.badgeVip) u.badgeVip = true;
    if (catId) u.subcategoriaId = String(catId).trim().toLowerCase().replace(/_/g, ' ');

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
    var alias = base.alias || base.nombre || base.nombreComercial || 'Facilitador demo';
    var holistico = buildBienestarHolisticoPerfil(base, subId, pack);
    var id = 'demo-bienestar-' + subId + '-' + slug(alias) + '-' + idx;
    var tarifa = base.precio || holistico.tarifaDesde || 'Consultar';
    var esRetail = pack === 'D' || (pres && (pres.arquetipo === 'negocio_comercio' || pres.tipoPerfil === 'negocio'));

    var u = {
      __id: id,
      __demo: true,
      __vista: esRetail ? 'empresa' : 'pro',
      sectorId: 'bienestar',
      subcategoriaId: subId,
      arquetipo: esRetail ? 'negocio_comercio' : 'persona_servicio_bienestar',
      tipoPerfil: esRetail ? 'negocio' : 'persona',
      categoria: catLabel,
      categoriaPublica: catLabel,
      titulo: catLabel,
      especialidad: catLabel,
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
      fotoURL: fotoPara(subId, idx),
      fotosExtraURL: [
        fotoPara(subId, idx + 1),
        fotoPara(subId, idx + 2),
        fotoPara(subId, idx + 3),
        fotoPara(subId, idx + 4)
      ],
      deltaPack: pack,
      bienestarHolisticoPerfil: holistico
    };

    if (base.colaboracionContenido) u.colaboracionContenido = base.colaboracionContenido;
    if (base.mostrarColaboracionContenidoPublico) {
      u.mostrarColaboracionContenidoPublico = base.mostrarColaboracionContenidoPublico;
    }
    if (esRetail) {
      u.nombreComercial = base.nombreComercial || holistico.nombreComercial || alias;
      u.nombre = u.nombreComercial;
      if (base.direccion || holistico.direccion) u.direccion = base.direccion || holistico.direccion;
      if (Array.isArray(holistico.categoriasProductoBienestar)) {
        u.categoriasProducto = holistico.categoriasProductoBienestar.slice();
      }
      if (holistico.surtidoPrincipal) u.surtidoPrincipal = holistico.surtidoPrincipal;
    }
    if (pack === 'H') {
      u.sensible = true;
      u.regulada = true;
    }

    if (global.CariHubBienestarSectorRender && CariHubBienestarSectorRender.resolveVistaPerfil) {
      var vistaBw = CariHubBienestarSectorRender.resolveVistaPerfil(u);
      if (vistaBw) u.__vista = vistaBw;
    }

    u = enriquecerPerfil(u, Q);
    /* Restaurar contrato bienestar tras enriquecer/sanitize (anti-contaminación FE). */
    u.sectorId = 'bienestar';
    u.deltaPack = pack;
    u.bienestarHolisticoPerfil = holistico;
    u.arquetipo = esRetail ? 'negocio_comercio' : 'persona_servicio_bienestar';
    u.tipoPerfil = esRetail ? 'negocio' : (u.tipoPerfil || 'persona');
    /* Anti-contaminación: field-engine no debe dejar vista=negocio adulto. */
    if (u.__vista === 'negocio' || u.__vista === 'hotelMotel' || u.__vista === 'spa' || u.__vista === 'masajesLocal' || u.__vista === 'adult') {
      u.__vista = esRetail || pack === 'D' ? 'empresa' : 'pro';
    }
    if (global.CariHubBienestarSectorRender && CariHubBienestarSectorRender.resolveVistaPerfil) {
      var vistaFinal = CariHubBienestarSectorRender.resolveVistaPerfil(u);
      if (vistaFinal) u.__vista = vistaFinal;
    }
    return u;
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

  var GASTRONOMIA_PACK_POR_SUB = {
    'restaurantes-tradicional': 'LOCAL_DINE', marisquerias: 'LOCAL_DINE', 'cocina-economica': 'LOCAL_DINE',
    taquerias: 'FAST_CASUAL', 'comida-rapida': 'FAST_CASUAL', loncherias: 'FAST_CASUAL',
    panaderias: 'BAKERY_DESSERT', pastelerias: 'BAKERY_DESSERT', neverias: 'BAKERY_DESSERT',
    cafeterias: 'CAFE', 'jugos-y-licuados': 'CAFE', 'cafe-de-especialidad': 'CAFE',
    'food-trucks-gastronomia': 'MOBILE', 'comida-a-domicilio': 'DELIVERY', 'dark-kitchen': 'DELIVERY',
    bares: 'BAR_BEBIDAS', cervecerias: 'BAR_BEBIDAS', 'cantinas-vinotecas': 'BAR_BEBIDAS',
    'buffet-comedor': 'BUFFET', 'chef-cocinero-domicilio': 'PRO_SERVICE', 'bartender-servicio': 'PRO_SERVICE',
    'distribuidoras-alimentos-bebidas': 'B2B_DIST'
  };

  var DEMO_GASTRONOMIA_BY_PACK = {
    LOCAL_DINE: [
      { nombreComercial: 'La Cocina de Monterrey', precio: '180', tagline: 'Cocina regional norteña, terraza y reservaciones.', horario: 'Mar–Dom 13:00–23:00', tipoCocinaPrincipal: ['mexicana', 'regional'], capacidadComensales: 80, servicioMesa: true, aceptaReservaciones: true, terrazaPatio: true, menuDelDia: true, precioPromedioMx: 180, especialidadCasa: 'Cabrito al pastor', ventaAlcohol: true, permisoManipulacionAlimentos: true, verificada: true },
      { nombreComercial: 'El Asador del Norte', precio: '250', tagline: 'Cortes premium y parrilla al carbón.', horario: 'Lun–Dom 12:00–00:00', tipoCocinaPrincipal: ['mexicana'], capacidadComensales: 120, servicioMesa: true, aceptaReservaciones: true, precioPromedioMx: 250, chefVisible: true, maridajeVinos: true, verificada: true },
      { nombreComercial: 'Mariscos del Golfo', precio: '220', tagline: 'Pescado del día y barra de ostiones.', horario: 'Mié–Dom 11:00–22:00', tipoCocinaPrincipal: ['mexicana'], especialidadMar: 'Camarón y pulpo', capacidadComensales: 60, barraOstiones: true, pescadoDelDia: true, precioPromedioMx: 220, verificada: true }
    ],
    FAST_CASUAL: [
      { nombreComercial: 'Tacos Don Memo', precio: '85', tagline: 'Tacos de guisado, bistec y pastor al carbón.', horario: 'Lun–Sáb 8:00–23:00', tipoCocinaPrincipal: ['mexicana'], servicioMostrador: true, paraLlevar: true, precioPromedioMx: 85, especialidadCasa: 'Pastor', verificada: true },
      { nombreComercial: 'Burger & Fries MTY', precio: '120', tagline: 'Hamburguesas artesanales y papas cargadas.', horario: 'Lun–Dom 11:00–23:00', tipoCocinaPrincipal: ['internacional'], servicioMostrador: true, driveThru: true, precioPromedioMx: 120, verificada: true }
    ],
    BAKERY_DESSERT: [
      { nombreComercial: 'Panadería La Espiga', precio: '45', tagline: 'Pan dulce, bolillos y repostería diaria.', horario: 'Lun–Dom 6:00–21:00', productosEstrella: ['Conchas', 'Bolillos', 'Orejas'], horneadoDiario: true, precioPromedioMx: 45, verificada: true },
      { nombreComercial: 'Nevería La Frida', precio: '55', tagline: 'Nieves artesanales y paletas de temporada.', horario: 'Lun–Dom 11:00–22:00', saboresTemporada: true, opcionesSinAzucar: true, precioPromedioMx: 55, verificada: true }
    ],
    CAFE: [
      { nombreComercial: 'Café de Barrio', precio: '65', tagline: 'Espresso, filtrado y repostería de autor.', horario: 'Lun–Sáb 7:00–20:00', tipoCafe: ['Espresso', 'Filtrado'], wifiClientes: true, terrazaPatio: true, precioPromedioMx: 65, verificada: true }
    ],
    MOBILE: [
      { nombreComercial: 'Food Truck Norteño', precio: '95', tagline: 'Tacos y hamburguesas en puntos fijos rotativos.', horario: 'Mar–Sáb 18:00–00:00', tipoUnidadFood: 'food_truck', puntosFijosRotacion: 'San Pedro · Centro · Cumbres', precioPromedioMx: 95, verificada: true }
    ],
    DELIVERY: [
      { nombreComercial: 'Cocina Express Delivery', precio: '110', tagline: 'Comida casera empacada y entrega en 45 min.', horario: 'Lun–Dom 11:00–22:00', radioEntregaKm: 8, tiempoEntregaOrientativo: '35–50 min', precioPromedioMx: 110, verificada: true },
      { alias: 'Chef a tu casa', precio: '1,800', tagline: 'Menú de 3 tiempos preparado en tu cocina.', horario: 'Con reservación', cotizacionDesde: '1800', unidadCotizacion: 'evento', experienciaChef: '8 años', tipoServicioChef: 'Cena privada', verificada: true }
    ],
    BAR_BEBIDAS: [
      { nombreComercial: 'Bar La Catarina', precio: '150', tagline: 'Coctelería de autor y botanas gourmet.', horario: 'Jue–Dom 19:00–02:00', ventaAlcohol: true, cartaCocteles: true, musicaEnVivo: true, precioPromedioMx: 150, permisoManipulacionAlimentos: true, verificada: true }
    ],
    BUFFET: [
      { nombreComercial: 'Buffet del Valle', precio: '99', tagline: 'Comida corrida y buffet por kilo.', horario: 'Lun–Vie 7:00–16:00', modalidadBuffet: 'por_kilo', incluyeBebida: true, precioPromedioMx: 99, verificada: true }
    ],
    PRO_SERVICE: [
      { alias: 'Chef Roberto Vega', precio: '2,200', tagline: 'Experiencias gastronómicas privadas y cenas de autor.', horario: 'Con cita', cotizacionDesde: '2200', unidadCotizacion: 'evento', experienciaChef: '12 años', tipoServicioChef: 'Cena degustación', verificada: true },
      { alias: 'Barra Móvil MX', precio: '1,500', tagline: 'Bartender y barra para eventos sociales.', horario: 'Fines de semana', cotizacionDesde: '1500', unidadCotizacion: 'evento', tipoServicioBartender: 'Barra móvil', verificada: true }
    ],
    B2B_DIST: [
      { nombreComercial: 'Distribuidora Alimentos del Norte', precio: 'Consultar', tagline: 'Mayoreo de abarrotes, lácteos y bebidas.', horario: 'Lun–Sáb 6:00–18:00', tipoClienteB2b: ['Restaurantes', 'Hoteles'], coberturaEntregaB2b: 'Nuevo León y Coahuila', verificada: true }
    ]
  };

  var DEMO_GASTRONOMIA = {
    'restaurantes-tradicional': DEMO_GASTRONOMIA_BY_PACK.LOCAL_DINE,
    taquerias: DEMO_GASTRONOMIA_BY_PACK.FAST_CASUAL,
    bares: DEMO_GASTRONOMIA_BY_PACK.BAR_BEBIDAS,
    'chef-cocinero-domicilio': DEMO_GASTRONOMIA_BY_PACK.PRO_SERVICE
  };

  function gastronomiaPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (GASTRONOMIA_PACK_POR_SUB[key]) return GASTRONOMIA_PACK_POR_SUB[key];
    if (global.CARIHUB_REGISTRO_GASTRONOMIA_SECTOR_BLOCKS && CARIHUB_REGISTRO_GASTRONOMIA_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_GASTRONOMIA_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'LOCAL_DINE';
  }

  function buildGastronomiaPerfilDemo(base, subId, pack) {
    pack = String(pack || 'LOCAL_DINE').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      horarioAtencionComercial: base.horario || base.horarioAtencionComercial || '',
      precioPromedioMx: base.precioPromedioMx || (base.precio && !isNaN(String(base.precio).replace(/,/g, '')) ? String(base.precio).replace(/,/g, '') : ''),
      cotizacionDesde: base.cotizacionDesde || base.precio || '',
      unidadCotizacion: base.unidadCotizacion || ''
    };
    var keys = [
      'nombreComercial', 'alias', 'tipoCocinaPrincipal', 'capacidadComensales', 'servicioMesa',
      'aceptaReservaciones', 'terrazaPatio', 'menuDelDia', 'especialidadCasa', 'chefVisible',
      'maridajeVinos', 'ventaAlcohol', 'permisoManipulacionAlimentos', 'especialidadMar',
      'barraOstiones', 'pescadoDelDia', 'servicioMostrador', 'paraLlevar', 'driveThru',
      'productosEstrella', 'horneadoDiario', 'saboresTemporada', 'opcionesSinAzucar',
      'tipoCafe', 'wifiClientes', 'tipoUnidadFood', 'puntosFijosRotacion', 'radioEntregaKm',
      'tiempoEntregaOrientativo', 'cartaCocteles', 'musicaEnVivo', 'modalidadBuffet',
      'incluyeBebida', 'experienciaChef', 'tipoServicioChef', 'tipoServicioBartender',
      'tipoClienteB2b', 'coberturaEntregaB2b', 'opcionesDieteticas', 'diferenciadorProfesional'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilGastronomia(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || gastronomiaPackDeSub(subId);
    var personaSubs = ['comida-a-domicilio', 'chef-cocinero-domicilio', 'bartender-servicio'];
    var esNegocio = personaSubs.indexOf(subId) < 0;
    var nombre = base.nombreComercial || base.alias || base.nombre || 'Local demo';
    var gastronomia = buildGastronomiaPerfilDemo(base, subId, pack);
    var id = 'demo-gastronomia-' + subId + '-' + slug(nombre) + '-' + idx;
    var tarifa = base.precio || gastronomia.precioPromedioMx || gastronomia.cotizacionDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      __vista: esNegocio ? 'empresa' : 'pro',
      sectorId: 'restaurantes',
      subcategoriaId: subId,
      arquetipo: esNegocio ? 'negocio_alimentos' : 'persona_servicio_profesional',
      tipoPerfil: esNegocio ? 'negocio' : 'persona',
      categoria: catLabel,
      categoriaPublica: catLabel,
      nombre: nombre,
      nombreComercial: esNegocio ? nombre : '',
      alias: esNegocio ? '' : nombre,
      precio: tarifa,
      tagline: base.tagline || '',
      horario: base.horario || gastronomia.horarioAtencionComercial || 'Consultar',
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
      gastronomiaPerfil: gastronomia
    };

    if (base.colaboracionContenido) u.colaboracionContenido = base.colaboracionContenido;
    if (base.mostrarColaboracionContenidoPublico) {
      u.mostrarColaboracionContenidoPublico = base.mostrarColaboracionContenidoPublico;
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoGastronomia(subId) {
    if (DEMO_GASTRONOMIA[subId]) return DEMO_GASTRONOMIA[subId];
    var pack = gastronomiaPackDeSub(subId);
    return DEMO_GASTRONOMIA_BY_PACK[pack] || DEMO_GASTRONOMIA_BY_PACK.LOCAL_DINE;
  }

  function plantillaDemoGastronomia(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoGastronomia(subId).map(function (base, idx) {
      return armarPerfilGastronomia(base, idx, Q, pres);
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

  var MASCOTAS_PACK_POR_SUB = {
    'paseador-de-perros': 'A', 'cuidador-de-mascotas': 'A', 'guarderia-para-mascotas': 'A', 'hotel-para-mascotas': 'A',
    'entrenador-canino': 'B', adiestrador: 'B', 'centro-de-entrenamiento-canino': 'B',
    groomer: 'C', 'estetica-canina': 'C', 'fotografo-de-mascotas': 'C',
    'medico-veterinario': 'D', 'veterinario-especialista': 'D', 'cirujano-veterinario': 'D',
    'clinica-veterinaria': 'D', 'hospital-veterinario': 'D', 'farmacia-veterinaria': 'D',
    'tienda-de-mascotas': 'E', 'criadero-autorizado': 'E', 'rescatista-independiente': 'E',
    'servicio-funerario-para-mascotas': 'E'
  };

  var MASCOTAS_CEDULA_SUBS = [
    'medico-veterinario', 'veterinario-especialista', 'cirujano-veterinario', 'farmacia-veterinaria'
  ];

  var MASCOTAS_NEGOCIO_SUBS = [
    'clinica-veterinaria', 'hospital-veterinario', 'estetica-canina', 'centro-de-entrenamiento-canino'
  ];

  var DEMO_MASCOTAS_BY_PACK = {
    A: [
      { alias: 'Paseos Caninos MTY', precio: '150', tagline: 'Paseos diarios, socialización y reporte con fotos.', serviciosMascotas: ['Paseo', 'Cuidado básico', 'Socialización'], especiesAtendidas: ['perros'], tamanoMascotasAtendidas: ['pequeno', 'mediano', 'grande'], modalidadServicioMascotas: 'domicilio', tarifaDesde: '150', tiempoRespuestaMascotas: 'mismo_dia', coberturaGeografica: 'Monterrey centro y sur', horario: 'Lun–Sáb 6:00–20:00', verificada: true },
      { alias: 'Cuidado Hogar Pet', precio: '280', tagline: 'Cuidado en casa, alimentación y medicación básica.', serviciosMascotas: ['Cuidado en casa', 'Alimentación', 'Medicación'], especiesAtendidas: ['perros', 'gatos'], modalidadServicioMascotas: 'domicilio', tarifaDesde: '280', tiempoRespuestaMascotas: '24_48h', horario: 'Lun–Dom', verificada: true }
    ],
    B: [
      { alias: 'Adiestramiento Alfa', precio: '450', tagline: 'Obediencia básica, corrección y socialización.', serviciosMascotas: ['Obediencia básica', 'Corrección conductual'], especiesAtendidas: ['perros'], modalidadServicioMascotas: 'ambos', tarifaDesde: '450', diferenciadorMascotas: 'Método positivo certificado', horario: 'Lun–Sáb', verificada: true },
      { alias: 'Coach Canino Pro', precio: '380', tagline: 'Entrenamiento a domicilio y en parque.', serviciosMascotas: ['Entrenamiento', 'Paseo educativo'], especiesAtendidas: ['perros'], modalidadServicioMascotas: 'domicilio', tarifaDesde: '380', horario: 'Con cita', verificada: true }
    ],
    C: [
      { alias: 'Groom & Style Pets', precio: '320', tagline: 'Baño, corte y spa para perros y gatos.', serviciosMascotas: ['Baño', 'Corte', 'Spa'], especiesAtendidas: ['perros', 'gatos'], modalidadServicioMascotas: 'instalaciones', tarifaDesde: '320', horario: 'Mar–Sáb 9:00–19:00', verificada: true },
      { alias: 'Foto Mascotas Studio', precio: '1,200', tagline: 'Sesiones fotográficas en estudio y exteriores.', serviciosMascotas: ['Sesión fotográfica', 'Retoque'], especiesAtendidas: ['perros', 'gatos', 'otros'], modalidadServicioMascotas: 'ambos', tarifaDesde: '1200', horario: 'Con cita', verificada: true }
    ],
    D: [
      { nombreProfesional: 'Dra. Vet. Laura Soto', precio: '550', tagline: 'Medicina general, vacunas y consultas preventivas.', especialidadVeterinaria: 'Medicina general', serviciosVeterinarios: ['Consulta', 'Vacunación', 'Desparasitación'], especiesAtendidas: ['perros', 'gatos'], modalidadServicioMascotas: 'consultorio', precioConsulta: '550', emergenciasMascotas: 'si_horario', cedulaVerificada: true, horario: 'Lun–Vie 9:00–19:00', verificada: true },
      { nombreComercial: 'Clínica Veterinaria del Valle', precio: 'Consultar', tagline: 'Hospitalización, cirugía y laboratorio en sitio.', serviciosEmpresaMascotas: ['Consulta', 'Cirugía', 'Hospitalización', 'Laboratorio'], especialidadesEmpresaMascotas: 'Medicina interna · Cirugía', capacidadInstalacion: '12 camas', emergenciasMascotas: 'si_24h', modalidadServicioMascotas: 'clinica', tarifaDesde: 'Consultar', horario: '24 horas', verificada: true }
    ],
    E: [
      { nombreComercial: 'Mundo Mascota Shop', precio: 'Consultar', tagline: 'Alimento premium, accesorios y asesoría nutricional.', serviciosEmpresaMascotas: ['Venta', 'Asesoría'], especiesAtendidas: ['perros', 'gatos', 'aves'], modalidadServicioMascotas: 'instalaciones', tarifaDesde: 'Consultar', horario: 'Lun–Dom 10:00–20:00', verificada: true },
      { alias: 'Rescate Animal NL', precio: 'Donación', tagline: 'Rescate, rehabilitación y adopción responsable.', serviciosMascotas: ['Rescate', 'Rehabilitación', 'Adopción'], especiesAtendidas: ['perros', 'gatos'], modalidadServicioMascotas: 'instalaciones', tarifaDesde: 'Donación', colaboracionesComerciales: 'si_activo', horario: 'Lun–Sáb', verificada: true }
    ]
  };

  var DEMO_MASCOTAS = {
    'paseador-de-perros': DEMO_MASCOTAS_BY_PACK.A,
    'entrenador-canino': DEMO_MASCOTAS_BY_PACK.B,
    groomer: DEMO_MASCOTAS_BY_PACK.C,
    'medico-veterinario': [DEMO_MASCOTAS_BY_PACK.D[0]],
    'clinica-veterinaria': [DEMO_MASCOTAS_BY_PACK.D[1]],
    'tienda-de-mascotas': DEMO_MASCOTAS_BY_PACK.E
  };

  function mascotasPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (MASCOTAS_PACK_POR_SUB[key]) return MASCOTAS_PACK_POR_SUB[key];
    if (global.CARIHUB_REGISTRO_MASCOTAS_SECTOR_BLOCKS && CARIHUB_REGISTRO_MASCOTAS_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_MASCOTAS_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'A';
  }

  function buildMascotasPerfilDemo(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      modalidadServicioMascotas: base.modalidadServicioMascotas || '',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      precioConsulta: base.precio || base.precioConsulta || 'Consultar',
      tiempoRespuestaMascotas: base.tiempoRespuestaMascotas || '',
      coberturaGeografica: base.coberturaGeografica || base.zonaCobertura || '',
      colaboracionesComerciales: base.colaboracionesComerciales || ''
    };
    var keys = [
      'nombreProfesional', 'alias', 'nombreComercial', 'serviciosMascotas', 'especiesAtendidas',
      'tamanoMascotasAtendidas', 'especialidadVeterinaria', 'serviciosVeterinarios',
      'especialidadesVeterinarias', 'emergenciasMascotas', 'serviciosEmpresaMascotas',
      'especialidadesEmpresaMascotas', 'capacidadInstalacion', 'diferenciadorMascotas',
      'tiposColaboracionComercial'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilMascotas(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || mascotasPackDeSub(subId);
    var perfil = buildMascotasPerfilDemo(base, subId, pack);
    var esCedula = MASCOTAS_CEDULA_SUBS.indexOf(subId) >= 0;
    var esNegocio = MASCOTAS_NEGOCIO_SUBS.indexOf(subId) >= 0;
    var nombre = perfil.nombreProfesional || perfil.nombreComercial || perfil.alias || 'Proveedor demo';
    var id = 'demo-mascotas-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || perfil.precioConsulta || perfil.tarifaDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      sectorId: 'mascotas',
      subcategoriaId: subId,
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: base.horario || 'Consultar',
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      cedulaVerificada: base.cedulaVerificada === true || esCedula,
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f'],
      deltaPack: pack,
      mascotasPerfil: perfil
    };

    if (esNegocio) {
      u.tipoPerfil = 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = perfil.nombreComercial || nombre;
      u.nombre = u.nombreComercial;
    } else if (esCedula) {
      u.nombreProfesional = perfil.nombreProfesional || nombre;
      u.nombre = u.nombreProfesional;
      u.alias = u.nombre;
      u.especialidad = perfil.especialidadVeterinaria || base.especialidad || '';
    } else {
      u.alias = perfil.alias || nombre;
      u.nombre = u.alias;
      u.especialidad = (perfil.serviciosMascotas && perfil.serviciosMascotas[0]) || base.especialidad || '';
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoMascotas(subId) {
    if (DEMO_MASCOTAS[subId]) return DEMO_MASCOTAS[subId];
    var pack = mascotasPackDeSub(subId);
    return DEMO_MASCOTAS_BY_PACK[pack] || DEMO_MASCOTAS_BY_PACK.A;
  }

  function plantillaDemoMascotas(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoMascotas(subId).map(function (base, idx) {
      return armarPerfilMascotas(base, idx, Q, pres);
    });
  }

  var HOGAR_PACK_POR_SUB = {
    plomeros: 'A', albaniles: 'A', impermeabilizadores: 'A',
    electricistas: 'B', 'tecnicos-en-clima-hvac': 'B', 'instaladores-de-paneles-solares': 'B',
    'tecnicos-en-camaras-de-seguridad': 'B', 'domotica-casa-inteligente': 'B',
    carpinteros: 'C', herreros: 'C', 'instaladores-de-pisos': 'C', cerrajeros: 'C',
    pintores: 'D', jardineria: 'D', fumigacion: 'D', 'limpieza-del-hogar': 'D', 'mantenimiento-general': 'D'
  };

  var DEMO_HOGAR_BY_PACK = {
    A: [
      { alias: 'Plomería Express MTY', precio: '300', tagline: 'Plomería residencial y comercial con garantía.', serviciosHogar: ['Fugas', 'Instalaciones', 'Destapes'], modalidadServicioHogar: 'domicilio', tiposInmueble: ['casa', 'departamento'], tarifaDesde: '300', tiempoRespuestaHogar: 'mismo_dia', garantiaServicioHogar: '30 días en mano de obra', coberturaGeografica: 'Monterrey y área metropolitana', horario: 'Lun–Dom 7:00–22:00', verificada: true },
      { alias: 'Albañilería del Norte', precio: '450', tagline: 'Remodelaciones, muros y acabados en obra.', serviciosHogar: ['Muros', 'Remodelación', 'Aplanados'], modalidadServicioHogar: 'domicilio', tarifaDesde: '450', anosExperienciaHogar: '8_15', horario: 'Lun–Sáb', verificada: true }
    ],
    B: [
      { alias: 'Electricista Pro MTY', precio: '350', tagline: 'Instalaciones eléctricas y tableros residenciales.', serviciosHogar: ['Instalación', 'Reparación', 'Tableros'], especialidadesHogar: ['Residencial', 'Comercial'], modalidadServicioHogar: 'domicilio', tarifaDesde: '350', tiempoRespuestaHogar: '24_48h', horario: 'Lun–Sáb 8:00–20:00', verificada: true },
      { alias: 'Clima & HVAC Norte', precio: '500', tagline: 'Minisplits, mantenimiento y carga de gas.', serviciosHogar: ['Instalación minisplit', 'Mantenimiento', 'Reparación'], especialidadesHogar: ['HVAC', 'Refrigeración'], modalidadServicioHogar: 'domicilio', tarifaDesde: '500', horario: 'Lun–Dom', verificada: true }
    ],
    C: [
      { alias: 'Carpintería a Medida', precio: '800', tagline: 'Muebles, closets y carpintería fina.', serviciosHogar: ['Closets', 'Muebles', 'Puertas'], tiposTrabajoHogar: ['A medida', 'Reparación'], materialesIncluidos: 'convenir', modalidadServicioHogar: 'ambos', tarifaDesde: '800', horario: 'Con cita', verificada: true },
      { alias: 'Herrería y Estructuras', precio: '600', tagline: 'Portones, barandales y estructuras metálicas.', serviciosHogar: ['Portones', 'Barandales', 'Estructuras'], tiposTrabajoHogar: ['Fabricación', 'Instalación'], modalidadServicioHogar: 'domicilio', tarifaDesde: '600', horario: 'Lun–Sáb', verificada: true }
    ],
    D: [
      { alias: 'Pintura Profesional MTY', precio: '280', tagline: 'Interiores, exteriores y acabados decorativos.', serviciosHogar: ['Interiores', 'Exteriores', 'Texturizados'], modalidadServicioHogar: 'domicilio', tiposInmueble: ['casa', 'departamento', 'local'], tarifaDesde: '280', horario: 'Lun–Sáb 8:00–19:00', verificada: true },
      { alias: 'Jardinería Verde', precio: '400', tagline: 'Diseño, poda y mantenimiento de jardines.', serviciosHogar: ['Diseño', 'Poda', 'Mantenimiento'], modalidadServicioHogar: 'domicilio', tarifaDesde: '400', coberturaGeografica: 'Monterrey sur y Carretera Nacional', horario: 'Mar–Dom', verificada: true }
    ]
  };

  var DEMO_HOGAR = {
    plomeros: DEMO_HOGAR_BY_PACK.A,
    electricistas: DEMO_HOGAR_BY_PACK.B,
    carpinteros: DEMO_HOGAR_BY_PACK.C,
    pintores: DEMO_HOGAR_BY_PACK.D,
    jardineria: [DEMO_HOGAR_BY_PACK.D[1]]
  };

  function hogarPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (HOGAR_PACK_POR_SUB[key]) return HOGAR_PACK_POR_SUB[key];
    if (global.CARIHUB_REGISTRO_HOGAR_SECTOR_BLOCKS && CARIHUB_REGISTRO_HOGAR_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_HOGAR_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'A';
  }

  function buildHogarPerfilDemo(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      modalidadServicioHogar: base.modalidadServicioHogar || '',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      tiempoRespuestaHogar: base.tiempoRespuestaHogar || '',
      garantiaServicioHogar: base.garantiaServicioHogar || '',
      coberturaGeografica: base.coberturaGeografica || base.zonaCobertura || '',
      colaboracionesComerciales: base.colaboracionesComerciales || ''
    };
    var keys = [
      'alias', 'serviciosHogar', 'especialidadesHogar', 'tiposTrabajoHogar', 'tiposInmueble',
      'anosExperienciaHogar', 'materialesIncluidos', 'diferenciadorHogar', 'certificaciones',
      'tiposColaboracionComercial', 'horarioDetalle'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilHogar(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || hogarPackDeSub(subId);
    var perfil = buildHogarPerfilDemo(base, subId, pack);
    var nombre = perfil.alias || base.alias || 'Proveedor demo';
    var id = 'demo-hogar-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || perfil.tarifaDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      sectorId: 'hogar',
      subcategoriaId: subId,
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: base.horario || perfil.horarioDetalle || 'Consultar',
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f'],
      deltaPack: pack,
      hogarPerfil: perfil,
      alias: perfil.alias || nombre,
      nombre: perfil.alias || nombre,
      especialidad: (perfil.serviciosHogar && perfil.serviciosHogar[0]) || base.especialidad || ''
    };

    return enriquecerPerfil(u, Q);
  }

  function poolDemoHogar(subId) {
    if (DEMO_HOGAR[subId]) return DEMO_HOGAR[subId];
    var pack = hogarPackDeSub(subId);
    return DEMO_HOGAR_BY_PACK[pack] || DEMO_HOGAR_BY_PACK.A;
  }

  function plantillaDemoHogar(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoHogar(subId).map(function (base, idx) {
      return armarPerfilHogar(base, idx, Q, pres);
    });
  }

  var SALUD_CEDULA_SUBS = [
    'medicos-generales', 'especialistas-medicos', 'psicologos', 'ambulancias-y-traslado-medico',
    'equipo-medico', 'examenes-medicos-para-empresas', 'servicios-medicos-empresariales',
    'seguros-medicos', 'gastos-medicos-mayores'
  ];

  var SALUD_NEGOCIO_SUBS = [
    'clinicas-medicas', 'centros-de-rehabilitacion', 'centros-de-salud-mental',
    'clinicas-de-adicciones', 'clinicas-de-fertilidad', 'seguridad-e-higiene-industrial',
    'hospitales-privados', 'casas-de-retiro', 'asilos-y-residencias-asistidas', 'servicios-funerarios'
  ];

  var DEMO_SALUD_BY_PACK = {
    A: [
      { nombreProfesional: 'Dra. Ana Lucía Méndez', precio: '800', tagline: 'Medicina general, check-ups y seguimiento.', especialidad: 'Medicina general', serviciosProfesionales: ['Consulta general', 'Control crónico', 'Certificados'], segurosAceptados: 'GNP · MetLife · Particular', consultaEnLinea: true, precioConsulta: '800', horarioAtencion: 'Lun–Vie 9:00–19:00', horario: 'Lun–Vie 9:00–19:00', cedulaVerificada: true, verificada: true },
      { nombreProfesional: 'Dr. Roberto Sánchez', precio: '750', tagline: 'Atención integral, urgencias menores y recetas.', especialidad: 'Medicina familiar', serviciosProfesionales: ['Consulta', 'Urgencias menores', 'Recetas'], segurosAceptados: 'Particular', precioConsulta: '750', horarioAtencion: 'Lun–Sáb 8:00–20:00', horario: 'Lun–Sáb 8:00–20:00', cedulaVerificada: true, verificada: true }
    ],
    B: [
      { alias: 'Dr. García · Dermatología', precio: '950', tagline: 'Dermatología clínica y estética ambulatoria.', especialidadServicio: 'Dermatología', modalidadConsulta: 'hibrido', segurosAceptadosSalud: ['GNP', 'Particular'], tarifaDesde: '950', certificaciones: 'Especialidad en dermatología', horario: 'Mar–Sáb 10:00–19:00', verificada: true },
      { alias: 'Nutrióloga Claudia Ruiz', precio: '600', tagline: 'Nutrición clínica y planes personalizados.', especialidadServicio: 'Nutrición clínica', modalidadConsulta: 'videollamada', tarifaDesde: '600', certificaciones: 'Lic. en Nutrición', horario: 'Lun–Vie 9:00–18:00', verificada: true }
    ],
    C: [
      { alias: 'Enfermería a Domicilio MTY', precio: '500', tagline: 'Curaciones, medicación y cuidados en casa.', serviciosCuidado: ['Curaciones', 'Medicación', 'Signos vitales'], atencionDomicilioSalud: 'Sí', coberturaDomicilioZona: 'Monterrey y área metropolitana', tarifaDesde: '500', certificaciones: 'Enfermería general titulada', horario: '24 horas con cita', verificada: true },
      { alias: 'Cuidado Adulto Mayor Norte', precio: '450', tagline: 'Acompañamiento y cuidados geriátricos.', serviciosCuidado: ['Acompañamiento', 'Higiene', 'Medicación'], atencionDomicilioSalud: 'Sí', tarifaDesde: '450', horario: 'Lun–Dom', verificada: true }
    ],
    D: [
      { alias: 'Laboratorio Clínico Norte', precio: 'Consultar', tagline: 'Análisis clínicos con resultados en 24 h.', estudiosOfrecidos: ['Biometría', 'Química sanguínea', 'Perfil tiroideo'], tiempoEntregaResultados: '24–48 h', tomaMuestrasDomicilio: true, horario: 'Lun–Sáb 7:00–14:00', verificada: true },
      { alias: 'Imagen Diagnóstica MTY', precio: 'Consultar', tagline: 'Ultrasonido, rayos X y estudios de imagen.', estudiosOfrecidos: ['Ultrasonido', 'Rayos X', 'Mastografía'], tiempoEntregaResultados: 'Mismo día', horario: 'Lun–Vie 8:00–20:00', verificada: true }
    ],
    E: [
      { alias: 'Farmacia del Centro', precio: 'Consultar', tagline: 'Medicamentos de patente y genéricos.', categoriasFarmacia: ['Patente', 'Genéricos', 'Dermatológicos'], surtidoFarmaceutico: 'Amplio surtido', ventaConReceta: 'Sí', horario: 'Lun–Dom 8:00–22:00', verificada: true },
      { alias: 'Farmacia Especializada Onco', precio: 'Consultar', tagline: 'Medicamentos de alta especialidad con receta.', categoriasFarmacia: ['Oncológicos', 'Controlados'], surtidoFarmaceutico: 'Alta especialidad', ventaConReceta: 'Sí', horario: 'Lun–Sáb 9:00–19:00', verificada: true }
    ],
    F: [
      { nombreComercial: 'Clínica Integral Sur', precio: 'Consultar', tagline: 'Consulta externa, urgencias y estudios básicos.', serviciosClinica: ['Consulta externa', 'Urgencias', 'Laboratorio'], especialidadesClinica: 'Medicina general · Pediatría', urgencias24h: true, direccion: 'Col. Del Valle, Monterrey', horario: '24 horas', verificada: true },
      { nombreComercial: 'Centro de Rehabilitación Activa', precio: 'Consultar', tagline: 'Fisioterapia, terapia ocupacional y rehabilitación.', serviciosClinica: ['Fisioterapia', 'Terapia ocupacional'], especialidadesClinica: 'Rehabilitación física', direccion: 'San Pedro, N.L.', horario: 'Lun–Sáb 8:00–20:00', verificada: true }
    ],
    G: [
      { nombreComercial: 'Hospital Privado Las Palmas', precio: 'Consultar', tagline: 'Hospitalización, urgencias y cirugía.', serviciosHospital: ['Urgencias', 'Hospitalización', 'Cirugía'], nivelesAtencion: ['Segundo nivel', 'Tercer nivel'], urgencias24h: true, direccion: 'Monterrey, N.L.', horario: '24 horas', verificada: true },
      { nombreComercial: 'Residencia Geriátrica Serenity', precio: 'Consultar', tagline: 'Residencia asistida para adultos mayores.', serviciosResidencia: ['Hospedaje', 'Cuidados', 'Terapia'], capacidadResidentes: '40', direccion: 'Carretera Nacional', horario: '24 horas', verificada: true }
    ],
    H: [
      { alias: 'Salud Ocupacional MX', precio: 'Consultar', tagline: 'Exámenes médicos y programas para empresas.', serviciosCorporativos: ['Examen médico ingreso', 'Periódico', 'NOM-035'], coberturaEmpresas: 'Nuevo León y Coahuila', certificaciones: 'STPS · medicina del trabajo', tarifaDesde: 'Consultar', horario: 'Lun–Vie 8:00–18:00', verificada: true },
      { alias: 'Medicina del Trabajo Norte', precio: 'Consultar', tagline: 'Programas de salud ocupacional y ergonomía.', serviciosCorporativos: ['Ergonomía', 'Capacitación', 'Auditorías'], coberturaEmpresas: 'Monterrey y área metropolitana', tarifaDesde: 'Consultar', horario: 'Lun–Vie', verificada: true }
    ]
  };

  var DEMO_SALUD = {
    'medicos-generales': DEMO_SALUD_BY_PACK.A,
    dermatologia: DEMO_SALUD_BY_PACK.B,
    'enfermeria-a-domicilio': DEMO_SALUD_BY_PACK.C,
    'laboratorios-clinicos': DEMO_SALUD_BY_PACK.D,
    farmacias: DEMO_SALUD_BY_PACK.E,
    'clinicas-medicas': DEMO_SALUD_BY_PACK.F,
    'hospitales-privados': DEMO_SALUD_BY_PACK.G,
    'salud-ocupacional': DEMO_SALUD_BY_PACK.H
  };

  function saludPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (global.CARIHUB_REGISTRO_SALUD_SECTOR_BLOCKS && CARIHUB_REGISTRO_SALUD_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_SALUD_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'B';
  }

  function buildSaludPerfilDemo(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      precioConsulta: base.precio || base.precioConsulta || 'Consultar',
      horarioAtencion: base.horarioAtencion || base.horario || '',
      horarioDetalle: base.horarioDetalle || base.horario || '',
      diferenciadorSalud: base.diferenciadorSalud || ''
    };
    var keys = [
      'nombreProfesional', 'alias', 'nombreComercial', 'especialidad', 'subespecialidad',
      'serviciosProfesionales', 'segurosAceptados', 'consultaEnLinea', 'unidadConsulta',
      'especialidadServicio', 'modalidadConsulta', 'segurosAceptadosSalud', 'atencionDomicilioSalud',
      'serviciosCuidado', 'coberturaDomicilioZona', 'estudiosOfrecidos', 'tiempoEntregaResultados',
      'tomaMuestrasDomicilio', 'categoriasFarmacia', 'surtidoFarmaceutico', 'ventaConReceta',
      'serviciosClinica', 'especialidadesClinica', 'urgencias24h', 'direccion',
      'serviciosHospital', 'nivelesAtencion', 'serviciosResidencia', 'capacidadResidentes',
      'serviciosFunerarios', 'serviciosCorporativos', 'coberturaEmpresas', 'certificaciones',
      'modalidadAtencionProfesional', 'coberturaAtencionSalud', 'idiomasAtencion'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilSalud(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || saludPackDeSub(subId);
    var perfil = buildSaludPerfilDemo(base, subId, pack);
    var esCedula = SALUD_CEDULA_SUBS.indexOf(subId) >= 0;
    var esNegocio = SALUD_NEGOCIO_SUBS.indexOf(subId) >= 0;
    var nombre = perfil.nombreProfesional || perfil.nombreComercial || perfil.alias || 'Proveedor demo';
    var id = 'demo-salud-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || perfil.precioConsulta || perfil.tarifaDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      sectorId: 'salud',
      subcategoriaId: subId,
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: base.horario || perfil.horarioAtencion || perfil.horarioDetalle || 'Consultar',
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      cedulaVerificada: base.cedulaVerificada === true || esCedula,
      requiresCedula: esCedula,
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f'],
      deltaPack: pack,
      saludPerfil: perfil
    };

    if (esNegocio) {
      u.tipoPerfil = 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = perfil.nombreComercial || nombre;
      u.nombre = u.nombreComercial;
    } else if (esCedula) {
      u.nombreProfesional = perfil.nombreProfesional || nombre;
      u.nombre = u.nombreProfesional;
      u.alias = u.nombre;
      u.especialidad = perfil.especialidad || base.especialidad || '';
    } else {
      u.alias = perfil.alias || nombre;
      u.nombre = u.alias;
      u.especialidad = perfil.especialidadServicio || base.especialidad || '';
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoSalud(subId) {
    if (DEMO_SALUD[subId]) return DEMO_SALUD[subId];
    var pack = saludPackDeSub(subId);
    return DEMO_SALUD_BY_PACK[pack] || DEMO_SALUD_BY_PACK.B;
  }

  function plantillaDemoSalud(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoSalud(subId).map(function (base, idx) {
      return armarPerfilSalud(base, idx, Q, pres);
    });
  }

  var TECNOLOGIA_NEGOCIO_SUBS = [
    'agencia-de-marketing-digital', 'agencia-seo', 'agencia-de-publicidad-digital',
    'hosting-y-dominios', 'ciberseguridad-empresarial', 'soporte-empresarial-ti',
    'venta-de-equipo-de-computo'
  ];

  var DEMO_TECNOLOGIA_BY_PACK = {
    A: [
      { alias: 'Dev Full Stack MTY', precio: '1,200', tagline: 'React, Node y APIs para PyME.', stackTecnologico: ['React', 'Node.js', 'PostgreSQL'], serviciosDesarrollo: ['Web', 'APIs', 'Mantenimiento'], modalidadServicioTI: 'hibrido', tarifaDesde: '1200', horario: 'Lun–Vie 9:00–18:00', verificada: true },
      { alias: 'Apps Móviles Norte', precio: '1,500', tagline: 'Desarrollo iOS y Android con entregas iterativas.', stackTecnologico: ['Flutter', 'Firebase'], serviciosDesarrollo: ['Apps móviles', 'MVP'], modalidadServicioTI: 'remoto', tarifaDesde: '1500', horario: 'Con cita', verificada: true }
    ],
    B: [
      { alias: 'Soporte TI Express', precio: '450', tagline: 'Soporte a PC, redes y respaldo de datos.', serviciosSoporteTI: ['Helpdesk', 'Mantenimiento', 'Recuperación de datos'], tiposEquipoSoporte: ['PC', 'Mac', 'Impresoras'], modalidadServicioTI: 'visita_cliente', tiempoRespuestaSoporte: 'mismo_dia', coberturaGeografica: 'Monterrey', tarifaDesde: '450', horario: 'Lun–Sáb 8:00–20:00', verificada: true },
      { alias: 'Técnico en Computadoras', precio: '350', tagline: 'Reparación, limpieza y optimización.', serviciosReparacion: ['Limpieza', 'Formateo', 'Upgrade'], tiposEquipoSoporte: ['PC', 'Laptop'], modalidadServicioTI: 'domicilio', tarifaDesde: '350', horario: 'Lun–Dom', verificada: true }
    ],
    C: [
      { alias: 'Community Manager Pro', precio: '600', tagline: 'Redes sociales, contenido y pauta básica.', serviciosMarketingDigital: ['Community management', 'Contenido', 'Pauta'], canalesMarketing: ['Instagram', 'Facebook', 'TikTok'], modalidadServicioTI: 'remoto', tarifaDesde: '600', horario: 'Lun–Vie', verificada: true },
      { alias: 'SEO Local MTY', precio: '800', tagline: 'Posicionamiento orgánico y auditorías SEO.', serviciosMarketingDigital: ['SEO', 'Auditoría web'], canalesMarketing: ['Google'], modalidadServicioTI: 'hibrido', tarifaDesde: '800', horario: 'Lun–Vie 9:00–17:00', verificada: true }
    ],
    D: [
      { alias: 'Consultor IT Estratega', precio: '1,800', tagline: 'Consultoría tecnológica y roadmap digital.', serviciosConsultoriaTI: ['Diagnóstico', 'Roadmap', 'Implementación'], areasConsultoriaTI: ['Infraestructura', 'Software'], modalidadServicioTI: 'hibrido', tarifaDesde: '1800', horario: 'Con cita', verificada: true },
      { alias: 'Ciberseguridad MX', precio: '2,200', tagline: 'Auditorías, hardening y respuesta a incidentes.', serviciosCiberseguridad: ['Auditoría', 'Pentest básico', 'Capacitación'], certificacionesSeguridad: ['CompTIA Security+'], modalidadServicioTI: 'remoto', tarifaDesde: '2200', horario: 'Lun–Vie', verificada: true }
    ],
    E: [
      { nombreComercial: 'Agencia Digital Impulso', precio: 'Consultar', tagline: 'Marketing digital, SEO y desarrollo web.', serviciosEmpresaTI: ['Marketing', 'Desarrollo web', 'SEO'], especialidadesEmpresaTI: 'PyME y mediana empresa', direccion: 'San Pedro, N.L.', horario: 'Lun–Vie 9:00–19:00', verificada: true },
      { nombreComercial: 'TI Empresarial Norte', precio: 'Consultar', tagline: 'Soporte empresarial, helpdesk y infraestructura.', serviciosEmpresaTI: ['Helpdesk', 'Servidores', 'Redes'], tamanoEmpresaAtendida: ['PyME', 'Mediana'], direccion: 'Monterrey', horario: '24/7 con contrato', verificada: true }
    ],
    F: [
      { alias: 'UX/UI Studio MTY', precio: '900', tagline: 'Diseño de interfaces y prototipos Figma.', serviciosCreativosTI: ['UX/UI', 'Prototipos', 'Design system'], especialidadCreativaTI: ['Web', 'Apps'], portfolioURL: 'https://ejemplo.com', modalidadServicioTI: 'remoto', tarifaDesde: '900', horario: 'Lun–Vie', verificada: true },
      { alias: 'Cloud & Hosting MX', precio: 'Consultar', tagline: 'Hosting, dominios y servicios cloud.', serviciosInfraTI: ['Hosting', 'Dominios', 'Correo'], plataformasInfra: ['AWS', 'Google Cloud'], modalidadServicioTI: 'remoto', tarifaDesde: 'Consultar', horario: 'Lun–Dom', verificada: true }
    ]
  };

  var DEMO_TECNOLOGIA = {
    programador: DEMO_TECNOLOGIA_BY_PACK.A,
    'soporte-tecnico-independiente': DEMO_TECNOLOGIA_BY_PACK.B,
    'community-manager': DEMO_TECNOLOGIA_BY_PACK.C,
    'consultor-it': DEMO_TECNOLOGIA_BY_PACK.D,
    'agencia-de-marketing-digital': DEMO_TECNOLOGIA_BY_PACK.E,
    'disenador-ux-ui': DEMO_TECNOLOGIA_BY_PACK.F
  };

  function tecnologiaPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (global.CARIHUB_REGISTRO_TECNOLOGIA_SECTOR_BLOCKS && CARIHUB_REGISTRO_TECNOLOGIA_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_TECNOLOGIA_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'A';
  }

  function buildTecnologiaPerfilDemo(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      horarioDetalle: base.horarioDetalle || base.horario || '',
      modalidadServicioTI: base.modalidadServicioTI || '',
      coberturaGeografica: base.coberturaGeografica || base.zonaCobertura || '',
      colaboracionesComerciales: base.colaboracionesComerciales || ''
    };
    var keys = [
      'alias', 'nombreComercial', 'stackTecnologico', 'serviciosDesarrollo', 'lenguajesFrameworks',
      'serviciosSoporteTI', 'tiposEquipoSoporte', 'serviciosReparacion', 'tiempoRespuestaSoporte',
      'garantiaServicio', 'serviciosMarketingDigital', 'canalesMarketing', 'serviciosConsultoriaTI',
      'areasConsultoriaTI', 'serviciosCiberseguridad', 'certificacionesSeguridad',
      'serviciosEmpresaTI', 'especialidadesEmpresaTI', 'tamanoEmpresaAtendida',
      'serviciosCreativosTI', 'especialidadCreativaTI', 'serviciosInfraTI', 'plataformasInfra',
      'portfolioURL', 'certificaciones', 'diferenciadorProfesional', 'direccion'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilTecnologia(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || tecnologiaPackDeSub(subId);
    var perfil = buildTecnologiaPerfilDemo(base, subId, pack);
    var esNegocio = TECNOLOGIA_NEGOCIO_SUBS.indexOf(subId) >= 0;
    var nombre = perfil.nombreComercial || perfil.alias || 'Proveedor demo';
    var id = 'demo-tecnologia-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || perfil.tarifaDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      sectorId: 'tecnologia',
      subcategoriaId: subId,
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: base.horario || perfil.horarioDetalle || 'Consultar',
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f'],
      deltaPack: pack,
      tecnologiaPerfil: perfil
    };

    if (esNegocio) {
      u.tipoPerfil = 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = perfil.nombreComercial || nombre;
      u.nombre = u.nombreComercial;
    } else {
      u.alias = perfil.alias || nombre;
      u.nombre = u.alias;
      u.especialidad = (perfil.stackTecnologico && perfil.stackTecnologico[0]) || (perfil.serviciosDesarrollo && perfil.serviciosDesarrollo[0]) || base.especialidad || '';
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoTecnologia(subId) {
    if (DEMO_TECNOLOGIA[subId]) return DEMO_TECNOLOGIA[subId];
    var pack = tecnologiaPackDeSub(subId);
    return DEMO_TECNOLOGIA_BY_PACK[pack] || DEMO_TECNOLOGIA_BY_PACK.A;
  }

  function plantillaDemoTecnologia(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoTecnologia(subId).map(function (base, idx) {
      return armarPerfilTecnologia(base, idx, Q, pres);
    });
  }

  var AUTOMOTRIZ_NEGOCIO_SUBS = ['agencias-de-autos'];

  var DEMO_AUTOMOTRIZ_BY_PACK = {
    A: [
      { alias: 'Taller Mecánico del Norte', precio: '500', tagline: 'Mecánica general, frenos y suspensión.', serviciosMecanica: ['Afinación', 'Frenos', 'Suspensión'], especialidadesMecanica: ['Motor', 'Transmisión'], marcasAtendidas: ['Chevrolet', 'Nissan', 'Ford'], modalidadServicioAuto: 'taller_fijo', tarifaDesde: '500', coberturaGeografica: 'Monterrey norte', horario: 'Lun–Sáb 8:00–19:00', verificada: true },
      { alias: 'Mecánico a Domicilio MTY', precio: '400', tagline: 'Diagnóstico y reparaciones en tu domicilio.', serviciosMecanica: ['Diagnóstico', 'Batería', 'Fugas'], modalidadServicioAuto: 'domicilio', tiempoRespuestaAuto: 'mismo_dia', tarifaDesde: '400', horario: 'Lun–Dom', verificada: true }
    ],
    B: [
      { alias: 'Vulcanizadora Rápida', precio: '350', tagline: 'Llantas, balanceo y alineación.', serviciosLlantas: ['Venta', 'Montaje', 'Balanceo', 'Alineación'], tiposLlantas: ['Radial', 'Run flat'], modalidadServicioAuto: 'taller_fijo', tarifaDesde: '350', horario: 'Lun–Sáb 8:00–20:00', verificada: true }
    ],
    C: [
      { alias: 'Detailing Premium MTY', precio: '800', tagline: 'Lavado, pulido y protección cerámica.', serviciosEsteticaAuto: ['Lavado', 'Detailing', 'Cerámico'], serviciosCarroceria: ['Pulido'], modalidadServicioAuto: 'taller_fijo', tarifaDesde: '800', horario: 'Mar–Dom', verificada: true },
      { alias: 'Hojalatería y Pintura Sur', precio: 'Consultar', tagline: 'Reparación de carrocería y pintura automotriz.', serviciosCarroceria: ['Hojalatería', 'Pintura'], modalidadServicioAuto: 'taller_fijo', tarifaDesde: 'Consultar', horario: 'Lun–Vie', verificada: true }
    ],
    D: [
      { alias: 'Refaccionaria Central', precio: 'Consultar', tagline: 'Refacciones originales y genéricas.', serviciosRefacciones: ['Venta', 'Pedido especial'], lineasRefacciones: ['Frenos', 'Suspensión', 'Motor'], modalidadServicioAuto: 'taller_fijo', tarifaDesde: 'Consultar', horario: 'Lun–Sáb 9:00–19:00', verificada: true },
      { alias: 'A/C Automotriz Pro', precio: '600', tagline: 'Carga de gas, diagnóstico y reparación de A/C.', serviciosEspecialidadAuto: ['A/C', 'Diagnóstico eléctrico'], modalidadServicioAuto: 'ambos', tarifaDesde: '600', horario: 'Lun–Sáb', verificada: true }
    ],
    E: [
      { nombreComercial: 'Autos Seminuevos MTY', precio: 'Consultar', tagline: 'Seminuevos certificados con financiamiento.', serviciosVentaAutos: ['Seminuevos', 'Contado', 'Crédito'], tiposVehiculoVenta: ['Sedán', 'SUV', 'Pickup'], financiamientoDisponible: 'Sí', inventarioAproximado: '40 unidades', horario: 'Lun–Sáb 10:00–20:00', verificada: true },
      { alias: 'Lote de Autos del Valle', precio: 'Consultar', tagline: 'Venta de usados con revisión mecánica.', serviciosVentaAutos: ['Usados', 'Consignación'], tiposVehiculoVenta: ['Económicos', 'SUV'], financiamientoDisponible: 'Parcial', tarifaDesde: 'Consultar', horario: 'Lun–Dom', verificada: true }
    ],
    F: [
      { alias: 'Grúa 24 h Norte', precio: '800', tagline: 'Grúa y auxilio vial en carretera y ciudad.', serviciosGrua: ['Grúa', 'Paso de corriente', 'Cambio de llanta'], modalidadServicioAuto: 'unidad_movil', coberturaCarretera: '100 km radio MTY', tiempoRespuestaAuto: 'emergencia_30min', tarifaDesde: '800', horario: '24 horas', verificada: true }
    ]
  };

  var DEMO_AUTOMOTRIZ = {
    'talleres-mecanicos': DEMO_AUTOMOTRIZ_BY_PACK.A,
    vulcanizadoras: DEMO_AUTOMOTRIZ_BY_PACK.B,
    'lavado-de-autos': DEMO_AUTOMOTRIZ_BY_PACK.C,
    refaccionarias: DEMO_AUTOMOTRIZ_BY_PACK.D,
    'agencias-de-autos': DEMO_AUTOMOTRIZ_BY_PACK.E,
    'gruas-y-auxilio-vial': DEMO_AUTOMOTRIZ_BY_PACK.F
  };

  function automotrizPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (global.CARIHUB_REGISTRO_AUTOMOTRIZ_SECTOR_BLOCKS && CARIHUB_REGISTRO_AUTOMOTRIZ_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_AUTOMOTRIZ_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'A';
  }

  function buildAutomotrizPerfilDemo(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      horarioDetalle: base.horarioDetalle || base.horario || '',
      modalidadServicioAuto: base.modalidadServicioAuto || '',
      coberturaGeografica: base.coberturaGeografica || base.zonaCobertura || '',
      colaboracionesComerciales: base.colaboracionesComerciales || ''
    };
    var keys = [
      'alias', 'nombreComercial', 'serviciosMecanica', 'especialidadesMecanica', 'marcasAtendidas',
      'tiposVehiculoAtendidos', 'garantiaServicioAuto', 'tiempoRespuestaAuto', 'serviciosLlantas',
      'tiposLlantas', 'serviciosCarroceria', 'serviciosEsteticaAuto', 'serviciosRefacciones',
      'lineasRefacciones', 'serviciosEspecialidadAuto', 'serviciosVentaAutos', 'tiposVehiculoVenta',
      'financiamientoDisponible', 'inventarioAproximado', 'serviciosGrua', 'coberturaCarretera',
      'certificaciones', 'diferenciadorAutomotriz', 'direccion'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilAutomotriz(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || automotrizPackDeSub(subId);
    var perfil = buildAutomotrizPerfilDemo(base, subId, pack);
    var esNegocio = AUTOMOTRIZ_NEGOCIO_SUBS.indexOf(subId) >= 0;
    var nombre = perfil.nombreComercial || perfil.alias || 'Proveedor demo';
    var id = 'demo-automotriz-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || perfil.tarifaDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      sectorId: 'automotriz',
      subcategoriaId: subId,
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: base.horario || perfil.horarioDetalle || 'Consultar',
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f'],
      deltaPack: pack,
      automotrizPerfil: perfil
    };

    if (esNegocio) {
      u.tipoPerfil = 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = perfil.nombreComercial || nombre;
      u.nombre = u.nombreComercial;
    } else {
      u.alias = perfil.alias || nombre;
      u.nombre = u.alias;
      u.especialidad = (perfil.serviciosMecanica && perfil.serviciosMecanica[0]) || (perfil.serviciosLlantas && perfil.serviciosLlantas[0]) || base.especialidad || '';
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoAutomotriz(subId) {
    if (DEMO_AUTOMOTRIZ[subId]) return DEMO_AUTOMOTRIZ[subId];
    var pack = automotrizPackDeSub(subId);
    return DEMO_AUTOMOTRIZ_BY_PACK[pack] || DEMO_AUTOMOTRIZ_BY_PACK.A;
  }

  function plantillaDemoAutomotriz(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoAutomotriz(subId).map(function (base, idx) {
      return armarPerfilAutomotriz(base, idx, Q, pres);
    });
  }

  var TRANSPORTE_NEGOCIO_SUBS = [
    'mudanzas-pequenas', 'mudanzas', 'empresa-de-mensajeria',
    'empresa-de-paqueteria', 'empresa-de-logistica', 'renta-de-camionetas'
  ];

  var DEMO_TRANSPORTE_BY_PACK = {
    A: [
      { alias: 'Chofer Privado MTY', precio: '600', tagline: 'Traslados ejecutivos y turísticos con puntualidad.', serviciosTransportePersonas: ['Traslados', 'Ejecutivo', 'Turismo'], tipoVehiculoPasajeros: ['Sedán', 'SUV'], modalidadServicioTransporte: 'metropolitana', tarifaDesde: '600', coberturaGeografica: 'Monterrey y área metropolitana', horario: 'Lun–Dom con cita', verificada: true },
      { alias: 'Transporte Escolar Seguro', precio: 'Consultar', tagline: 'Rutas escolares con permisos y seguro vigente.', serviciosTransportePersonas: ['Escolar'], tipoVehiculoPasajeros: ['Van', 'Microbús'], modalidadServicioTransporte: 'local_ciudad', tarifaDesde: 'Consultar', permisosLicencias: 'Permiso escolar vigente', horario: 'Lun–Vie', verificada: true }
    ],
    B: [
      { alias: 'Mensajero Express Norte', precio: '120', tagline: 'Entregas el mismo día en zona metropolitana.', serviciosMensajeria: ['Paquetería', 'Documentos', 'Última milla'], tiposEnvio: ['Documentos', 'Paquetes pequeños'], tipoVehiculoMensajeria: ['Moto', 'Auto'], modalidadServicioTransporte: 'metropolitana', tiempoRespuestaTransporte: 'mismo_dia', tarifaDesde: '120', horario: 'Lun–Sáb', verificada: true },
      { alias: 'Moto Mensajería 24 h', precio: '90', tagline: 'Envíos urgentes con respuesta inmediata.', serviciosMensajeria: ['Urgente', 'Documentos'], tiposEnvio: ['Urgente'], tipoVehiculoMensajeria: ['Moto'], modalidadServicioTransporte: 'local_ciudad', tiempoRespuestaTransporte: 'inmediato_30min', tarifaDesde: '90', horario: '24 horas', verificada: true }
    ],
    C: [
      { alias: 'Fletes Ligeros del Valle', precio: '450', tagline: 'Fletes urbanos y mudanzas pequeñas.', serviciosFleteMudanza: ['Flete ligero', 'Mudanza pequeña'], tiposMercancia: ['Muebles', 'Electrodomésticos'], capacidadCarga: '1.5 ton', incluyePersonalCarga: 'opcional', modalidadServicioTransporte: 'local_ciudad', tarifaDesde: '450', horario: 'Lun–Sáb', verificada: true },
      { alias: 'Mudanzas Express MTY', precio: '1,800', tagline: 'Mudanzas locales con personal de carga.', serviciosFleteMudanza: ['Mudanza completa', 'Embalaje'], tiposMercancia: ['Hogar', 'Oficina'], capacidadCarga: '3.5 ton', incluyePersonalCarga: 'si', modalidadServicioTransporte: 'metropolitana', tarifaDesde: '1800', horario: 'Lun–Dom', verificada: true }
    ],
    D: [
      { alias: 'Carga Pesada Norte', precio: 'Consultar', tagline: 'Transporte de carga en rutas regionales.', serviciosLogistica: ['Carga general', 'Distribución'], tiposCarga: ['General', 'Paletizada'], coberturaRutas: 'MTY–Saltillo–Monclova', modalidadServicioTransporte: 'regional', tarifaDesde: 'Consultar', horario: 'Lun–Sáb', verificada: true },
      { alias: 'Refrigerados MTY', precio: 'Consultar', tagline: 'Cadena de frío para alimentos y medicinas.', serviciosLogistica: ['Refrigerado', 'Distribución'], tiposCarga: ['Refrigerada'], coberturaRutas: 'Nuevo León y Coahuila', modalidadServicioTransporte: 'regional', tarifaDesde: 'Consultar', horario: '24 horas', verificada: true }
    ],
    E: [
      { nombreComercial: 'Mensajería Rápida del Norte', precio: 'Consultar', tagline: 'Paquetería y última milla para empresas.', serviciosEmpresaTransporte: ['Mensajería', 'Paquetería', 'Última milla'], tamanoClienteTransporte: ['PyME', 'Corporativo'], flotaAproximada: '25 unidades', modalidadServicioTransporte: 'nacional', horario: 'Lun–Sáb 7:00–22:00', verificada: true },
      { nombreComercial: 'Logística Integral MTY', precio: 'Consultar', tagline: 'Distribución, almacenaje y rutas programadas.', serviciosEmpresaTransporte: ['Logística', 'Distribución', 'Almacenaje'], especialidadesEmpresaTransporte: 'Cadena de suministro local', flotaAproximada: '40 unidades', modalidadServicioTransporte: 'nacional', horario: 'Lun–Vie', verificada: true }
    ],
    F: [
      { nombreComercial: 'Renta de Camionetas MTY', precio: '800', tagline: 'Camionetas con y sin chofer para obra y mudanza.', serviciosEspecialidadTransporte: ['Renta con chofer', 'Renta sin chofer'], tiposVehiculoRenta: ['Pickup', '3.5 ton', 'Van'], modalidadServicioTransporte: 'local_ciudad', tarifaDesde: '800', horario: 'Lun–Dom', verificada: true },
      { alias: 'Logística Internacional Norte', precio: 'Consultar', tagline: 'Cruce fronterizo y rutas internacionales.', serviciosEspecialidadTransporte: ['Internacional', 'Aduanas'], coberturaInternacional: 'México–EE.UU.', modalidadServicioTransporte: 'internacional', tarifaDesde: 'Consultar', horario: 'Lun–Vie', verificada: true }
    ]
  };

  var DEMO_TRANSPORTE = {
    'chofer-privado': DEMO_TRANSPORTE_BY_PACK.A,
    mensajero: DEMO_TRANSPORTE_BY_PACK.B,
    'flete-ligero': DEMO_TRANSPORTE_BY_PACK.C,
    'transporte-de-carga': DEMO_TRANSPORTE_BY_PACK.D,
    'empresa-de-mensajeria': DEMO_TRANSPORTE_BY_PACK.E,
    'renta-de-camionetas': DEMO_TRANSPORTE_BY_PACK.F
  };

  function transportePackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (global.CARIHUB_REGISTRO_TRANSPORTE_SECTOR_BLOCKS && CARIHUB_REGISTRO_TRANSPORTE_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_TRANSPORTE_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'A';
  }

  function buildTransportePerfilDemo(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      horarioDetalle: base.horarioDetalle || base.horario || '',
      modalidadServicioTransporte: base.modalidadServicioTransporte || '',
      coberturaGeografica: base.coberturaGeografica || base.zonaCobertura || '',
      colaboracionesComerciales: base.colaboracionesComerciales || ''
    };
    var keys = [
      'alias', 'nombreComercial', 'serviciosTransportePersonas', 'tipoVehiculoPasajeros', 'tiposClientesTransporte',
      'serviciosMensajeria', 'tiposEnvio', 'tipoVehiculoMensajeria', 'serviciosFleteMudanza', 'capacidadCarga',
      'tiposMercancia', 'incluyePersonalCarga', 'serviciosLogistica', 'tiposCarga', 'coberturaRutas',
      'serviciosEmpresaTransporte', 'especialidadesEmpresaTransporte', 'tamanoClienteTransporte', 'flotaAproximada',
      'serviciosEspecialidadTransporte', 'coberturaInternacional', 'tiposVehiculoRenta', 'permisosLicencias',
      'tiempoRespuestaTransporte', 'certificaciones', 'diferenciadorTransporte', 'direccion'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilTransporte(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || transportePackDeSub(subId);
    var perfil = buildTransportePerfilDemo(base, subId, pack);
    var esNegocio = TRANSPORTE_NEGOCIO_SUBS.indexOf(subId) >= 0;
    var nombre = perfil.nombreComercial || perfil.alias || 'Proveedor demo';
    var id = 'demo-transporte-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || perfil.tarifaDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      sectorId: 'transporte',
      subcategoriaId: subId,
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: base.horario || perfil.horarioDetalle || 'Consultar',
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f'],
      deltaPack: pack,
      transportePerfil: perfil
    };

    if (esNegocio) {
      u.tipoPerfil = 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = perfil.nombreComercial || nombre;
      u.nombre = u.nombreComercial;
    } else {
      u.alias = perfil.alias || nombre;
      u.nombre = u.alias;
      u.especialidad = (perfil.serviciosTransportePersonas && perfil.serviciosTransportePersonas[0]) ||
        (perfil.serviciosMensajeria && perfil.serviciosMensajeria[0]) ||
        (perfil.serviciosFleteMudanza && perfil.serviciosFleteMudanza[0]) || base.especialidad || '';
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoTransporte(subId) {
    if (DEMO_TRANSPORTE[subId]) return DEMO_TRANSPORTE[subId];
    var pack = transportePackDeSub(subId);
    return DEMO_TRANSPORTE_BY_PACK[pack] || DEMO_TRANSPORTE_BY_PACK.A;
  }

  function plantillaDemoTransporte(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoTransporte(subId).map(function (base, idx) {
      return armarPerfilTransporte(base, idx, Q, pres);
    });
  }

  var COMERCIO_NEGOCIO_SUBS = ['distribuidoras'];

  var DEMO_COMERCIO_BY_PACK = {
    A: [
      { alias: 'Abarrotes La Esquina', precio: '25', tagline: 'Surte diario y productos de primera necesidad.', categoriasProducto: ['Abarrotes', 'Bebidas', 'Snacks'], serviciosComercio: ['Apartado', 'Pedidos'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Tarjeta'], entregaDomicilio: 'solo_zona', tarifaDesde: '25', coberturaGeografica: 'Col. Centro y alrededores', horario: 'Lun–Dom 7:00–22:00', verificada: true }
    ],
    B: [
      { alias: 'Moda Urbana MTY', precio: '299', tagline: 'Ropa casual y accesorios para toda la familia.', categoriasProducto: ['Ropa casual', 'Accesorios'], generosModa: ['Dama', 'Caballero', 'Joven'], marcasComercializadas: ['Nacionales', 'Importadas'], modalidadVentaComercio: 'ambos', formasPagoComercio: ['Efectivo', 'Tarjeta', 'MSI'], tarifaDesde: '299', horario: 'Lun–Sáb 10:00–20:00', verificada: true }
    ],
    C: [
      { alias: 'Ferretería El Martillo', precio: '50', tagline: 'Herramientas, plomería y materiales eléctricos.', categoriasProducto: ['Herramientas', 'Plomería', 'Eléctrico'], serviciosComercio: ['Cortes', 'Asesoría'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Tarjeta'], tarifaDesde: '50', horario: 'Lun–Sáb 8:00–19:00', verificada: true }
    ],
    D: [
      { alias: 'Mayoreo El Centro', precio: 'Consultar', tagline: 'Surtido a negocios con pedido mínimo.', serviciosMayoreo: ['Mayoreo', 'Surtido'], volumenMinimoPedido: '$1,500', tiposClientesComercio: ['Tienditas', 'Restaurantes'], modalidadVentaComercio: 'tienda_fisica', coberturaGeografica: 'Monterrey y área metropolitana', tarifaDesde: 'Consultar', horario: 'Lun–Sáb 6:00–18:00', verificada: true }
    ]
  };

  /* Demos 1:1 por subcategoría — evita que pack C mezcle ferretería con farmacia/papelería. */
  var DEMO_COMERCIO = {
    abarrotes: [
      { alias: 'Abarrotes La Esquina', precio: '25', tagline: 'Surte diario: abarrotes, bebidas y snacks de primera necesidad.', categoriasProducto: ['Abarrotes', 'Bebidas', 'Snacks'], serviciosComercio: ['Apartado', 'Pedidos'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Tarjeta'], entregaDomicilio: 'solo_zona', tarifaDesde: '25', coberturaGeografica: 'Col. Centro y alrededores', diferenciadorComercio: 'Surtido diario fresco', horario: 'Lun–Dom 7:00–22:00', verificada: true },
      { alias: 'Abarrotes Don Pepe', precio: '20', tagline: 'Abarrotes de barrio con precios accesibles y trato de siempre.', categoriasProducto: ['Abarrotes', 'Lácteos', 'Enlatados'], serviciosComercio: ['Fiado conocido', 'Pedidos'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Transferencia'], entregaDomicilio: 'convenir', tarifaDesde: '20', coberturaGeografica: 'San Nicolás', horario: 'Lun–Sáb 8:00–21:00', verificada: true }
    ],
    'tiendas-de-conveniencia': [
      { alias: 'Mini Súper del Valle', precio: 'Consultar', tagline: 'Conveniencia 24 h: snacks, bebidas y básicos cerca de ti.', categoriasProducto: ['Conveniencia', 'Bebidas', 'Snacks'], serviciosComercio: ['Cajero', 'Recargas'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Tarjeta', 'Transferencia'], entregaDomicilio: 'no', tarifaDesde: 'Consultar', coberturaGeografica: 'San Pedro / Valle', diferenciadorComercio: 'Abierto 24 horas', horario: 'Lun–Dom 24 h', verificada: true },
      { alias: 'Express Night Stop', precio: '35', tagline: 'Tienda de conveniencia nocturna con café y antojitos.', categoriasProducto: ['Conveniencia', 'Café', 'Antojitos'], serviciosComercio: ['Microondas', 'Recargas'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Tarjeta'], entregaDomicilio: 'no', tarifaDesde: '35', horario: 'Todos los días 18:00–6:00', verificada: true }
    ],
    zapaterias: [
      { alias: 'Zapatería El Camino', precio: '450', tagline: 'Calzado escolar, casual y de trabajo para toda la familia.', categoriasProducto: ['Calzado escolar', 'Calzado casual', 'Calzado de trabajo'], generosModa: ['Niño', 'Dama', 'Caballero'], marcasComercializadas: ['Nacionales'], serviciosComercio: ['Probadores', 'Apartado'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Tarjeta'], tarifaDesde: '450', diferenciadorComercio: 'Amplia talla infantil', horario: 'Lun–Sáb 10:00–20:00', verificada: true },
      { alias: 'Pisada Firme', precio: '520', tagline: 'Zapatos industriales y botas de seguridad.', categoriasProducto: ['Calzado industrial', 'Botas de seguridad'], generosModa: ['Caballero', 'Dama'], marcasComercializadas: ['Seguridad industrial'], modalidadVentaComercio: 'ambos', formasPagoComercio: ['Efectivo', 'Tarjeta', 'Transferencia'], tarifaDesde: '520', horario: 'Lun–Vie 9:00–19:00', verificada: true }
    ],
    'tiendas-de-ropa': [
      { alias: 'Moda Urbana MTY', precio: '299', tagline: 'Ropa casual y accesorios para dama, caballero y joven.', categoriasProducto: ['Ropa casual', 'Accesorios'], generosModa: ['Dama', 'Caballero', 'Joven'], marcasComercializadas: ['Nacionales', 'Importadas'], serviciosComercio: ['Probadores', 'Apartado', 'Cambios'], modalidadVentaComercio: 'ambos', formasPagoComercio: ['Efectivo', 'Tarjeta', 'MSI'], tarifaDesde: '299', diferenciadorComercio: 'Colección temporada', horario: 'Lun–Sáb 10:00–20:00', verificada: true },
      { alias: 'Boutique Norte', precio: '450', tagline: 'Ropa de oficina y outfits para ocasiones especiales.', categoriasProducto: ['Ropa formal', 'Vestidos', 'Blusas'], generosModa: ['Dama'], marcasComercializadas: ['Boutique local'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Tarjeta', 'MSI'], tarifaDesde: '450', horario: 'Mar–Sáb 11:00–19:00', verificada: true }
    ],
    ferreterias: [
      { alias: 'Ferretería El Martillo', precio: '50', tagline: 'Herramientas, plomería y materiales eléctricos.', categoriasProducto: ['Herramientas', 'Plomería', 'Eléctrico'], serviciosComercio: ['Cortes', 'Asesoría técnica'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Tarjeta'], entregaDomicilio: 'convenir', tarifaDesde: '50', diferenciadorComercio: 'Asesoría en obra menor', horario: 'Lun–Sáb 8:00–19:00', verificada: true },
      { alias: 'Todo para la Casa', precio: '40', tagline: 'Tornillería, pintura y refacciones de ferretería general.', categoriasProducto: ['Tornillería', 'Pintura', 'Refacciones'], serviciosComercio: ['Cortes', 'Mezcla de pintura'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Transferencia'], tarifaDesde: '40', horario: 'Lun–Sáb 8:00–18:00', verificada: true }
    ],
    'farmacias-de-barrio': [
      { alias: 'Farmacia del Barrio', precio: 'Consultar', tagline: 'Medicamentos genéricos y de marca, higiene y primeros auxilios.', categoriasProducto: ['Medicamentos', 'Higiene', 'Primeros auxilios'], serviciosComercio: ['Entrega local', 'Toma de presión'], modalidadVentaComercio: 'tienda_fisica', entregaDomicilio: 'solo_zona', formasPagoComercio: ['Efectivo', 'Tarjeta'], tarifaDesde: 'Consultar', coberturaGeografica: 'Colonia y colonia vecina', diferenciadorComercio: 'Entrega de medicamentos en zona', horario: 'Lun–Dom 8:00–22:00', verificada: true },
      { alias: 'Botica San José', precio: 'Consultar', tagline: 'Farmacia de barrio con genéricos y vitaminas.', categoriasProducto: ['Genéricos', 'Vitaminas', 'Cuidado personal'], serviciosComercio: ['Asesoría básica'], modalidadVentaComercio: 'tienda_fisica', entregaDomicilio: 'convenir', formasPagoComercio: ['Efectivo', 'Transferencia'], tarifaDesde: 'Consultar', horario: 'Lun–Sáb 9:00–21:00', verificada: true }
    ],
    papelerias: [
      { alias: 'Papelería Estrella', precio: '15', tagline: 'Útiles escolares, impresiones y material de oficina.', categoriasProducto: ['Útiles escolares', 'Papelería', 'Impresiones'], serviciosComercio: ['Impresiones', 'Engargolados', 'Copias'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Transferencia'], entregaDomicilio: 'no', tarifaDesde: '15', diferenciadorComercio: 'Impresiones el mismo día', horario: 'Lun–Sáb 9:00–19:00', verificada: true },
      { alias: 'Office Color', precio: '25', tagline: 'Papelería comercial: cartuchos, resmas y artículos de escritorio.', categoriasProducto: ['Resmas', 'Cartuchos', 'Escritorio'], serviciosComercio: ['Pedidos a empresas', 'Facturación'], modalidadVentaComercio: 'ambos', formasPagoComercio: ['Efectivo', 'Tarjeta', 'Transferencia'], tarifaDesde: '25', coberturaGeografica: 'Monterrey centro', horario: 'Lun–Vie 9:00–18:00', verificada: true }
    ],
    mayoreo: [
      { alias: 'Mayoreo El Centro', precio: 'Consultar', tagline: 'Surtido a tienditas y negocios con pedido mínimo.', serviciosMayoreo: ['Mayoreo', 'Surtido', 'Reposición'], volumenMinimoPedido: '$1,500', tiposClientesComercio: ['Tienditas', 'Restaurantes', 'Misceláneas'], modalidadVentaComercio: 'tienda_fisica', formasPagoComercio: ['Efectivo', 'Transferencia'], coberturaGeografica: 'Monterrey y área metropolitana', tarifaDesde: 'Consultar', diferenciadorComercio: 'Pedido mínimo accesible', horario: 'Lun–Sáb 6:00–18:00', verificada: true },
      { alias: 'Central de Abasto Norte', precio: 'Consultar', tagline: 'Mayoreo de abarrotes y bebidas para reventa.', serviciosMayoreo: ['Mayoreo', 'Carga en piso'], volumenMinimoPedido: '$2,000', tiposClientesComercio: ['Tienditas', 'Mayoristas'], modalidadVentaComercio: 'tienda_fisica', coberturaGeografica: 'NL y Coahuila sur', tarifaDesde: 'Consultar', horario: 'Lun–Sáb 5:00–15:00', verificada: true }
    ],
    distribuidoras: [
      { nombreComercial: 'Distribuidora Norte SA', precio: 'Consultar', tagline: 'Distribución y rutas programadas para retail y abarrotes.', serviciosEmpresaComercio: ['Distribución', 'Rutas', 'Crédito'], especialidadesEmpresaComercio: 'Abarrotes y bebidas', tiposClientesComercio: ['Tienditas', 'Mayoristas', 'Cadenas locales'], flotaEntrega: '12 unidades', modalidadVentaComercio: 'ambos', formasPagoComercio: ['Transferencia', 'Crédito'], coberturaGeografica: 'Nuevo León', tarifaDesde: 'Consultar', horario: 'Lun–Vie 7:00–18:00', verificada: true },
      { nombreComercial: 'Rutas del Norte Distribución', precio: 'Consultar', tagline: 'Flota propia y surtido programado a puntos de venta.', serviciosEmpresaComercio: ['Rutas', 'Inventario en piso', 'Pedidos app'], especialidadesEmpresaComercio: 'Snacks y bebidas', tiposClientesComercio: ['Conveniencia', 'Tienditas'], flotaEntrega: '8 unidades', modalidadVentaComercio: 'ambos', horario: 'Lun–Sáb', verificada: true }
    ]
  };

  var COMERCIO_PACK_POR_SUB = {
    abarrotes: 'A', 'tiendas-de-conveniencia': 'A',
    zapaterias: 'B', 'tiendas-de-ropa': 'B',
    'farmacias-de-barrio': 'C', papelerias: 'C', ferreterias: 'C',
    mayoreo: 'D', distribuidoras: 'D'
  };

  function comercioPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (COMERCIO_PACK_POR_SUB[key]) return COMERCIO_PACK_POR_SUB[key];
    if (global.CARIHUB_REGISTRO_COMERCIO_SECTOR_BLOCKS && CARIHUB_REGISTRO_COMERCIO_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_COMERCIO_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'A';
  }

  function buildComercioPerfilDemo(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      horarioDetalle: base.horarioDetalle || base.horario || '',
      modalidadVentaComercio: base.modalidadVentaComercio || '',
      coberturaGeografica: base.coberturaGeografica || base.zonaCobertura || '',
      colaboracionesComerciales: base.colaboracionesComerciales || ''
    };
    var keys = [
      'alias', 'nombreComercial', 'categoriasProducto', 'serviciosComercio', 'formasPagoComercio',
      'entregaDomicilio', 'generosModa', 'marcasComercializadas', 'serviciosMayoreo', 'volumenMinimoPedido',
      'tiposClientesComercio', 'serviciosEmpresaComercio', 'especialidadesEmpresaComercio', 'flotaEntrega',
      'certificaciones', 'diferenciadorComercio', 'direccion'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilComercio(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || (pres && (pres.subcategoria || pres.categoriaPublica)) || labelCategoria(Q.categoria);
    var pack = base.deltaPack || comercioPackDeSub(subId);
    var perfil = buildComercioPerfilDemo(base, subId, pack);
    var esNegocio = COMERCIO_NEGOCIO_SUBS.indexOf(subId) >= 0;
    var nombre = perfil.nombreComercial || perfil.alias || 'Comercio demo';
    var id = 'demo-comercio-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || perfil.tarifaDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      sectorId: 'comercio',
      subcategoriaId: subId,
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: base.horario || perfil.horarioDetalle || 'Consultar',
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f'],
      deltaPack: pack,
      comercioPerfil: perfil
    };

    if (esNegocio) {
      u.tipoPerfil = 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = perfil.nombreComercial || nombre;
      u.nombre = u.nombreComercial;
    } else {
      u.alias = perfil.alias || nombre;
      u.nombre = u.alias;
      u.especialidad = (perfil.categoriasProducto && perfil.categoriasProducto[0]) || base.especialidad || '';
    }

    if (global.CariHubComercioSectorRender && CariHubComercioSectorRender.resolveVistaPerfil) {
      u.__vista = CariHubComercioSectorRender.resolveVistaPerfil(u);
    } else {
      u.__vista = esNegocio ? 'empresa' : 'pro';
    }

    u = enriquecerPerfil(u, Q);
    u.sectorId = 'comercio';
    u.deltaPack = pack;
    u.comercioPerfil = perfil;
    if (global.CariHubComercioSectorRender && CariHubComercioSectorRender.resolveVistaPerfil) {
      var vistaCom = CariHubComercioSectorRender.resolveVistaPerfil(u);
      if (vistaCom) u.__vista = vistaCom;
    }
    return u;
  }

  function poolDemoComercio(subId) {
    if (DEMO_COMERCIO[subId]) return DEMO_COMERCIO[subId];
    var pack = comercioPackDeSub(subId);
    return DEMO_COMERCIO_BY_PACK[pack] || DEMO_COMERCIO_BY_PACK.A;
  }

  function plantillaDemoComercio(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoComercio(subId).map(function (base, idx) {
      return armarPerfilComercio(base, idx, Q, pres);
    });
  }

  var EDUCACION_CEDULA_SUBS = ['psicopedagogo', 'pedagogo', 'docente-certificado', 'especialista-en-educacion-especial'];
  var EDUCACION_NEGOCIO_SUBS = [
    'capacitador-empresarial', 'academia-de-idiomas', 'escuela-de-musica', 'escuela-de-arte',
    'centro-de-capacitacion', 'instituto-educativo', 'escuela-tecnica', 'escuela-de-manejo',
    'centro-de-certificaciones', 'plataforma-educativa', 'escuelas'
  ];

  var DEMO_EDUCACION_BY_PACK = {
    A: [
      { alias: 'Maestro Particular MTY', precio: '350', tagline: 'Clases personalizadas de primaria y secundaria.', serviciosEducacion: ['Clases particulares', 'Refuerzo escolar'], materiasEducativas: ['Matemáticas', 'Español'], modalidadEducacion: 'hibrido', formatoClase: ['Individual', 'Grupo pequeño'], tarifaDesde: '350', coberturaGeografica: 'Monterrey sur', horario: 'Lun–Sáb', verificada: true },
      { alias: 'Profesor de Idiomas Norte', precio: '400', tagline: 'Inglés conversacional y preparación de exámenes.', serviciosEducacion: ['Idiomas', 'Conversación'], materiasEducativas: ['Inglés'], idiomasEnsenanza: ['Inglés'], modalidadEducacion: 'online', tarifaDesde: '400', horario: 'Flexible', verificada: true }
    ],
    B: [
      { nombreProfesional: 'Lic. Ana Psicopedagoga', precio: '600', tagline: 'Evaluación y apoyo psicopedagógico.', serviciosProfesionalesEducacion: ['Evaluación', 'Terapia de aprendizaje'], especialidadEducativa: 'Psicopedagogía', materiasEducativas: ['Apoyo escolar'], modalidadEducacion: 'presencial', precioConsulta: '600', horarioAtencion: 'Lun–Vie', verificada: true }
    ],
    C: [
      { nombreComercial: 'Academia de Idiomas Global', precio: 'Consultar', tagline: 'Inglés, francés y certificaciones internacionales.', serviciosEmpresaEducacion: ['Idiomas', 'Certificación'], materiasEducativas: ['Inglés', 'Francés'], modalidadEducacion: 'hibrido', formatoClase: ['Grupo', 'Intensivo'], horario: 'Lun–Sáb', verificada: true }
    ],
    D: [
      { nombreComercial: 'Centro de Capacitación Pro', precio: 'Consultar', tagline: 'Cursos técnicos y certificaciones laborales.', serviciosEmpresaEducacion: ['Capacitación', 'Certificación'], nivelesEducativos: ['Técnico', 'Laboral'], certificacionesEducativas: 'DC3 y constancias', modalidadEducacion: 'presencial', horario: 'Lun–Vie', verificada: true }
    ],
    E: [
      { alias: 'Preparatoria Alternativa Norte', precio: 'Consultar', tagline: 'Bachillerato con modalidad flexible.', serviciosEducacion: ['Preparatoria', 'Bachillerato'], nivelesEducativos: ['Preparatoria'], edadesAtendidas: ['15–18 años'], modalidadEducacion: 'hibrido', tarifaDesde: 'Consultar', horario: 'Matutino y vespertino', verificada: true }
    ]
  };

  var DEMO_EDUCACION = {
    'maestro-particular': DEMO_EDUCACION_BY_PACK.A,
    psicopedagogo: DEMO_EDUCACION_BY_PACK.B,
    'academia-de-idiomas': DEMO_EDUCACION_BY_PACK.C,
    'centro-de-capacitacion': DEMO_EDUCACION_BY_PACK.D,
    universidades: DEMO_EDUCACION_BY_PACK.E
  };

  function educacionPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (global.CARIHUB_REGISTRO_EDUCACION_SECTOR_BLOCKS && CARIHUB_REGISTRO_EDUCACION_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_EDUCACION_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'A';
  }

  function buildEducacionPerfilDemo(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      precioConsulta: base.precioConsulta || base.precio || '',
      horarioDetalle: base.horarioDetalle || base.horario || '',
      horarioAtencion: base.horarioAtencion || base.horario || '',
      modalidadEducacion: base.modalidadEducacion || '',
      coberturaGeografica: base.coberturaGeografica || base.zonaCobertura || '',
      colaboracionesComerciales: base.colaboracionesComerciales || ''
    };
    var keys = [
      'alias', 'nombreProfesional', 'nombreComercial', 'serviciosEducacion', 'serviciosEmpresaEducacion',
      'serviciosProfesionalesEducacion', 'materiasEducativas', 'nivelesEducativos', 'edadesAtendidas',
      'formatoClase', 'especialidadEducativa', 'idiomasEnsenanza', 'certificacionesEducativas',
      'tiempoRespuestaEducacion', 'certificaciones', 'diferenciadorEducacion', 'direccion'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilEducacion(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || educacionPackDeSub(subId);
    var perfil = buildEducacionPerfilDemo(base, subId, pack);
    var esCedula = EDUCACION_CEDULA_SUBS.indexOf(subId) >= 0;
    var esNegocio = EDUCACION_NEGOCIO_SUBS.indexOf(subId) >= 0;
    var nombre = perfil.nombreProfesional || perfil.nombreComercial || perfil.alias || 'Educador demo';
    var id = 'demo-educacion-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || perfil.precioConsulta || perfil.tarifaDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      sectorId: 'educacion',
      subcategoriaId: subId,
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: base.horario || perfil.horarioAtencion || perfil.horarioDetalle || 'Consultar',
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f'],
      deltaPack: pack,
      educacionPerfil: perfil
    };

    if (esCedula) {
      u.nombreProfesional = perfil.nombreProfesional || nombre;
      u.nombre = u.nombreProfesional;
      u.requiresCedula = true;
      u.cedulaVerificada = true;
      u.especialidad = perfil.especialidadEducativa || (perfil.materiasEducativas && perfil.materiasEducativas[0]) || '';
    } else if (esNegocio) {
      u.tipoPerfil = 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = perfil.nombreComercial || nombre;
      u.nombre = u.nombreComercial;
    } else {
      u.alias = perfil.alias || nombre;
      u.nombre = u.alias;
      u.especialidad = (perfil.materiasEducativas && perfil.materiasEducativas[0]) || (perfil.serviciosEducacion && perfil.serviciosEducacion[0]) || base.especialidad || '';
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoEducacion(subId) {
    if (DEMO_EDUCACION[subId]) return DEMO_EDUCACION[subId];
    var pack = educacionPackDeSub(subId);
    return DEMO_EDUCACION_BY_PACK[pack] || DEMO_EDUCACION_BY_PACK.A;
  }

  function plantillaDemoEducacion(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoEducacion(subId).map(function (base, idx) {
      return armarPerfilEducacion(base, idx, Q, pres);
    });
  }

  var INDUSTRIA_CEDULA_SUBS = [
    'contador-publico', 'administrador-de-empresas', 'ingeniero-industrial',
    'ingeniero-en-procesos', 'especialista-en-seguridad-industrial'
  ];

  var INDUSTRIA_NEGOCIO_SUBS = [
    'supervisor-industrial', 'tecnico-industrial', 'outsourcing', 'seguridad-industrial',
    'call-center', 'centro-de-negocios-empresarial', 'manufactura', 'maquila',
    'automatizacion-industrial', 'ingenieria-industrial', 'maquinaria-industrial',
    'mantenimiento-industrial', 'soldadura-industrial', 'limpieza-industrial'
  ];

  var DEMO_INDUSTRIA_BY_PACK = {
    A: [
      { alias: 'Consultor Lean MTY', precio: '1,200', tagline: 'Optimización de procesos y mejora continua.', serviciosIndustriales: ['Consultoría', 'Lean manufacturing'], sectoresIndustriales: ['Manufactura', 'Logística'], modalidadServicioIndustrial: 'mixto', tarifaDesde: '1200', coberturaGeografica: 'Monterrey y área metropolitana', horario: 'Lun–Vie', verificada: true },
      { alias: 'Asesor ISO Norte', precio: 'Consultar', tagline: 'Implementación y auditoría de sistemas de calidad.', serviciosIndustriales: ['ISO 9001', 'Auditoría interna'], sectoresIndustriales: ['Industria', 'Servicios'], modalidadServicioIndustrial: 'sitio_cliente', tarifaDesde: 'Consultar', horario: 'Con cita', verificada: true }
    ],
    B: [
      { nombreProfesional: 'Ing. Carlos Procesos', precio: '1,800', tagline: 'Ingeniería industrial y layout de planta.', serviciosProfesionalesIndustrial: ['Layout', 'Balanceo de líneas'], especialidadIndustrial: 'Ingeniería industrial', sectoresIndustriales: ['Manufactura'], modalidadServicioIndustrial: 'sitio_cliente', precioConsulta: '1800', horarioAtencion: 'Lun–Vie', verificada: true }
    ],
    C: [
      { nombreComercial: 'Manufactura del Norte', precio: 'Consultar', tagline: 'Maquinado y ensamble de componentes metálicos.', serviciosEmpresaIndustrial: ['Maquinado CNC', 'Ensamble'], procesosIndustriales: ['Torneado', 'Fresado'], capacidadProduccion: '500 piezas/mes', certificacionesIndustriales: ['ISO 9001'], horario: 'Lun–Sáb', verificada: true }
    ],
    D: [
      { nombreComercial: 'Mantenimiento Industrial Pro', precio: 'Consultar', tagline: 'Mantenimiento preventivo y correctivo en planta.', serviciosEmpresaIndustrial: ['Preventivo', 'Correctivo'], procesosIndustriales: ['Mecánica', 'Eléctrica'], modalidadServicioIndustrial: 'planta', certificacionesIndustriales: ['NOM-022'], horario: '24 h', verificada: true }
    ],
    E: [
      { nombreComercial: 'Outsourcing Operativo MX', precio: 'Consultar', tagline: 'Tercerización de procesos administrativos y operativos.', serviciosEmpresaIndustrial: ['Outsourcing', 'Back office'], sectoresIndustriales: ['Manufactura', 'Servicios'], modalidadServicioIndustrial: 'instalaciones', horario: 'Lun–Vie', verificada: true }
    ]
  };

  var DEMO_INDUSTRIA = {
    'consultor-empresarial-independiente': DEMO_INDUSTRIA_BY_PACK.A,
    'ingeniero-industrial': DEMO_INDUSTRIA_BY_PACK.B,
    manufactura: DEMO_INDUSTRIA_BY_PACK.C,
    'mantenimiento-industrial': DEMO_INDUSTRIA_BY_PACK.D,
    outsourcing: DEMO_INDUSTRIA_BY_PACK.E
  };

  function industriaPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (global.CARIHUB_REGISTRO_INDUSTRIA_SECTOR_BLOCKS && CARIHUB_REGISTRO_INDUSTRIA_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_INDUSTRIA_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'A';
  }

  function buildIndustriaPerfilDemo(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      precioConsulta: base.precioConsulta || base.precio || '',
      horarioDetalle: base.horarioDetalle || base.horario || '',
      horarioAtencion: base.horarioAtencion || base.horario || '',
      modalidadServicioIndustrial: base.modalidadServicioIndustrial || '',
      coberturaGeografica: base.coberturaGeografica || base.zonaCobertura || '',
      colaboracionesComerciales: base.colaboracionesComerciales || ''
    };
    var keys = [
      'alias', 'nombreProfesional', 'nombreComercial', 'serviciosIndustriales', 'serviciosEmpresaIndustrial',
      'serviciosProfesionalesIndustrial', 'sectoresIndustriales', 'procesosIndustriales',
      'certificacionesIndustriales', 'capacidadProduccion', 'equipamientoIndustrial',
      'especialidadIndustrial', 'tiempoRespuestaIndustrial', 'certificaciones', 'diferenciadorIndustrial', 'direccion'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilIndustria(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || industriaPackDeSub(subId);
    var perfil = buildIndustriaPerfilDemo(base, subId, pack);
    var esCedula = INDUSTRIA_CEDULA_SUBS.indexOf(subId) >= 0;
    var esNegocio = INDUSTRIA_NEGOCIO_SUBS.indexOf(subId) >= 0;
    var nombre = perfil.nombreProfesional || perfil.nombreComercial || perfil.alias || 'Industria demo';
    var id = 'demo-industria-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || perfil.precioConsulta || perfil.tarifaDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      sectorId: 'industria',
      subcategoriaId: subId,
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: base.horario || perfil.horarioAtencion || perfil.horarioDetalle || 'Consultar',
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f'],
      deltaPack: pack,
      industriaPerfil: perfil
    };

    if (esCedula) {
      u.nombreProfesional = perfil.nombreProfesional || nombre;
      u.nombre = u.nombreProfesional;
      u.requiresCedula = true;
      u.cedulaVerificada = true;
      u.especialidad = perfil.especialidadIndustrial || (perfil.sectoresIndustriales && perfil.sectoresIndustriales[0]) || '';
    } else if (esNegocio) {
      u.tipoPerfil = 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = perfil.nombreComercial || nombre;
      u.nombre = u.nombreComercial;
    } else {
      u.alias = perfil.alias || nombre;
      u.nombre = u.alias;
      u.especialidad = (perfil.sectoresIndustriales && perfil.sectoresIndustriales[0]) || (perfil.serviciosIndustriales && perfil.serviciosIndustriales[0]) || base.especialidad || '';
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoIndustria(subId) {
    if (DEMO_INDUSTRIA[subId]) return DEMO_INDUSTRIA[subId];
    var pack = industriaPackDeSub(subId);
    return DEMO_INDUSTRIA_BY_PACK[pack] || DEMO_INDUSTRIA_BY_PACK.A;
  }

  function plantillaDemoIndustria(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoIndustria(subId).map(function (base, idx) {
      return armarPerfilIndustria(base, idx, Q, pres);
    });
  }

  var INMO_NEGOCIO_SUBS = [
    'inmobiliaria', 'agencia-de-bienes-raices', 'desarrolladora-inmobiliaria', 'constructora',
    'administracion-de-condominios', 'venta-de-casas', 'venta-de-departamentos', 'venta-de-terrenos',
    'venta-de-locales-comerciales', 'venta-de-bodegas', 'venta-de-oficinas', 'renta-de-casas',
    'renta-de-departamentos', 'renta-de-locales-comerciales', 'renta-de-bodegas', 'renta-de-oficinas',
    'renta-vacacional', 'coworking', 'centros-de-negocios-y-oficinas'
  ];

  var DEMO_INMO_BY_PACK = {
    A: [
      { alias: 'Agente Inmobiliario MTY', precio: 'Consultar', tagline: 'Venta y renta residencial en zona sur.', serviciosInmobiliarios: ['Asesoría', 'Acompañamiento'], tiposInmuebleInmobiliario: ['Casas', 'Departamentos'], modalidadOperacionInmobiliaria: 'venta_y_renta', tarifaDesde: 'Consultar', coberturaGeografica: 'Monterrey sur', horario: 'Lun–Sáb', verificada: true },
      { alias: 'Corredor Residencial Norte', precio: 'Consultar', tagline: 'Especialista en compraventa de casas.', serviciosInmobiliarios: ['Compraventa', 'Valuación'], tiposInmuebleInmobiliario: ['Casas'], modalidadOperacionInmobiliaria: 'venta', tarifaDesde: 'Consultar', horario: 'Con cita', verificada: true }
    ],
    B: [
      { nombreComercial: 'Inmobiliaria del Valle', precio: 'Consultar', tagline: 'Venta, renta y administración de inmuebles.', serviciosEmpresaInmobiliaria: ['Venta', 'Renta', 'Administración'], tiposInmuebleInmobiliario: ['Casas', 'Departamentos', 'Locales'], modalidadOperacionInmobiliaria: 'venta_y_renta', horario: 'Lun–Vie', verificada: true }
    ],
    C: [
      { nombreComercial: 'Casas Residenciales MTY', precio: '2.5M – 8M', tagline: 'Venta de casas en fraccionamientos premium.', operacionInmobiliaria: 'venta', tiposInmuebleInmobiliario: ['Casas'], rangoPrecioInmobiliario: '$2.5M – $8M', amenidadesInmueble: ['Jardín', 'Cochera'], horario: 'Lun–Sáb', verificada: true }
    ],
    D: [
      { nombreComercial: 'Renta Departamentos Centro', precio: '$12,000 – $25,000', tagline: 'Departamentos amueblados y sin amueblar.', operacionInmobiliaria: 'renta', tiposInmuebleInmobiliario: ['Departamentos'], rangoPrecioInmobiliario: '$12,000 – $25,000/mes', amenidadesInmueble: ['Elevador', 'Seguridad'], horario: 'Lun–Vie', verificada: true }
    ],
    E: [
      { nombreComercial: 'Coworking Hub Norte', precio: '$3,500/mes', tagline: 'Oficinas flexibles y salas de juntas.', serviciosEmpresaInmobiliaria: ['Coworking', 'Oficinas privadas'], operacionInmobiliaria: 'coworking', amenidadesInmueble: ['Internet', 'Cafetería'], rangoPrecioInmobiliario: 'Desde $3,500/mes', horario: 'Lun–Dom', verificada: true }
    ]
  };

  var DEMO_INMO = {
    'agente-inmobiliario-independiente': DEMO_INMO_BY_PACK.A,
    inmobiliaria: DEMO_INMO_BY_PACK.B,
    'venta-de-casas': DEMO_INMO_BY_PACK.C,
    'renta-de-departamentos': DEMO_INMO_BY_PACK.D,
    coworking: DEMO_INMO_BY_PACK.E
  };

  function inmoPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (global.CARIHUB_REGISTRO_BIENES_RAICES_SECTOR_BLOCKS && CARIHUB_REGISTRO_BIENES_RAICES_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_BIENES_RAICES_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'A';
  }

  function buildBienesRaicesPerfilDemo(base, subId, pack) {
    pack = String(pack || 'A').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      tarifaDesde: base.precio || base.tarifaDesde || 'Consultar',
      rangoPrecioInmobiliario: base.rangoPrecioInmobiliario || base.precio || '',
      horarioDetalle: base.horarioDetalle || base.horario || '',
      modalidadOperacionInmobiliaria: base.modalidadOperacionInmobiliaria || '',
      operacionInmobiliaria: base.operacionInmobiliaria || '',
      coberturaGeografica: base.coberturaGeografica || base.zonaCobertura || '',
      colaboracionesComerciales: base.colaboracionesComerciales || ''
    };
    var keys = [
      'alias', 'nombreComercial', 'serviciosInmobiliarios', 'serviciosEmpresaInmobiliaria',
      'tiposInmuebleInmobiliario', 'especialidadesInmobiliarias', 'especialidadesEmpresaInmobiliaria',
      'amenidadesInmueble', 'caracteristicasInmueble', 'tiempoRespuestaInmobiliaria',
      'certificaciones', 'diferenciadorInmobiliario', 'direccion'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilBienesRaices(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || inmoPackDeSub(subId);
    var perfil = buildBienesRaicesPerfilDemo(base, subId, pack);
    var esNegocio = INMO_NEGOCIO_SUBS.indexOf(subId) >= 0;
    var nombre = perfil.nombreComercial || perfil.alias || 'Inmobiliario demo';
    var id = 'demo-inmo-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || perfil.rangoPrecioInmobiliario || perfil.tarifaDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      sectorId: 'bienes-raices',
      subcategoriaId: subId,
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: base.horario || perfil.horarioDetalle || 'Consultar',
      pais: Q.pais,
      estado: Q.estado || 'Nuevo León',
      ciudad: Q.ciudad || 'Monterrey',
      zona: zonaNombre(idx),
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      respuestaRapida: base.respuestaRapida !== false,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f'],
      deltaPack: pack,
      bienesRaicesPerfil: perfil
    };

    if (esNegocio) {
      u.tipoPerfil = 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = perfil.nombreComercial || nombre;
      u.nombre = u.nombreComercial;
    } else {
      u.alias = perfil.alias || nombre;
      u.nombre = u.alias;
      u.especialidad = (perfil.tiposInmuebleInmobiliario && perfil.tiposInmuebleInmobiliario[0]) || (perfil.serviciosInmobiliarios && perfil.serviciosInmobiliarios[0]) || base.especialidad || '';
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoBienesRaices(subId) {
    if (DEMO_INMO[subId]) return DEMO_INMO[subId];
    var pack = inmoPackDeSub(subId);
    return DEMO_INMO_BY_PACK[pack] || DEMO_INMO_BY_PACK.A;
  }

  function plantillaDemoBienesRaices(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoBienesRaices(subId).map(function (base, idx) {
      return armarPerfilBienesRaices(base, idx, Q, pres);
    });
  }

  var EVENTOS_PACK_POR_SUB = {
    'espacios-para-eventos': 'VENUE',
    'organizadores-produccion-eventos': 'PROD',
    'decoracion-ambientacion-eventos': 'CREATIVE',
    'fotografia-video-eventos': 'CREATIVE',
    'invitaciones-papeleria-eventos': 'CREATIVE',
    'djs-eventos': 'MUSIC',
    'grupos-musicales-eventos': 'MUSIC',
    'animadores-maestros-ceremonia': 'SHOW',
    'shows-para-eventos': 'SHOW',
    'banquetes-catering-eventos': 'FOOD',
    'food-trucks-carritos-eventos': 'FOOD',
    'pasteles-reposteria-eventos': 'FOOD',
    'renta-mobiliario-eventos': 'RENTAL',
    'renta-equipo-eventos': 'RENTAL',
    'florerias-eventos': 'FLORAL',
    'pirotecnia-efectos-especiales': 'FX',
    'seguridad-eventos': 'SECURITY',
    'valet-parking-eventos': 'VALET',
    'transporte-eventos': 'TRANSPORT'
  };

  var EVENTOS_NEGOCIO_SUBS = [
    'espacios-para-eventos', 'banquetes-catering-eventos', 'renta-mobiliario-eventos',
    'renta-equipo-eventos', 'food-trucks-carritos-eventos', 'pasteles-reposteria-eventos',
    'florerias-eventos', 'pirotecnia-efectos-especiales', 'seguridad-eventos',
    'valet-parking-eventos', 'transporte-eventos'
  ];

  var DEMO_EVENTOS_BY_PACK = {
    VENUE: [
      { nombreComercial: 'Salón Jardín Monterrey', precio: '25,000', tagline: 'Bodas, XV años y eventos corporativos con jardín.', tiposEspacio: ['salon', 'jardin'], tiposEventoAceptados: ['bodas', 'xv_anos'], capacidadMin: 50, capacidadMax: 300, estacionamientoCupo: 80, cateringPolitica: 'externo_permitido', permiteMusicaEnVivo: true, cotizacionDesde: '25000', unidadCotizacion: 'evento', horario: 'Con cita previa', verificada: true },
      { nombreComercial: 'Terraza Sky Events', precio: '18,000', tagline: 'Vista panorámica para cócteles y celebraciones.', tiposEspacio: ['terraza', 'salon'], capacidadMax: 150, cotizacionDesde: '18000', unidadCotizacion: 'evento', verificada: true }
    ],
    PROD: [
      { alias: 'Producción Total MX', precio: '35,000', tagline: 'Coordinación integral de bodas y eventos corporativos.', serviciosProduccion: ['Coordinación', 'Cronograma', 'Proveedores'], tamanoEventoAtendido: 'mediano', cotizacionDesde: '35000', unidadCotizacion: 'evento', horario: 'Lun–Sáb', verificada: true }
    ],
    CREATIVE: [
      { alias: 'Lens & Frame Studio', precio: '15,000', tagline: 'Foto, video y cobertura con dron para bodas.', serviciosAudiovisual: ['foto', 'video', 'dron'], especialidadesEvento: ['bodas', 'corporativo'], horasCobertura: 8, licenciaDron: true, cotizacionDesde: '15000', unidadCotizacion: 'evento', verificada: true },
      { alias: 'Decor Ambient', precio: '8,500', tagline: 'Ambientación temática y montaje floral básico.', serviciosDecoracion: ['Montaje', 'Iluminación'], cotizacionDesde: '8500', unidadCotizacion: 'evento', verificada: true }
    ],
    MUSIC: [
      { alias: 'Fara Fara del Norte', precio: '18,000', tagline: 'Formato tradicional con trompeta y tambora.', tipoAgrupacion: 'fara_fara', descripcionFormatoFaraFara: 'Show de 90 min con repertorio regional.', numeroIntegrantes: 8, repertorioPrincipal: 'Regional mexicano', duracionSetMinutos: 90, incluyeSonidoMusica: true, cotizacionDesde: '18000', unidadCotizacion: 'evento', verificada: true },
      { alias: 'DJ Pulse MTY', precio: '6,500', tagline: 'DJ para fiestas, bodas y eventos corporativos.', tipoAgrupacion: 'dj', duracionSetMinutos: 240, incluyeSonidoMusica: true, cotizacionDesde: '6500', unidadCotizacion: 'evento', verificada: true }
    ],
    SHOW: [
      { alias: 'Mago Corporativo Alex', precio: '8,500', tagline: 'Magia de escena para adultos y familias.', tipoShow: ['mago'], publicoObjetivo: 'familiar', duracionShowMinutos: 45, numeroArtistas: 1, cotizacionDesde: '8500', unidadCotizacion: 'evento', verificada: true },
      { alias: 'MC Dinámica Pro', precio: '5,500', tagline: 'Maestro de ceremonias y animación de eventos.', rolPrincipal: 'mc', publicoObjetivo: 'familiar', duracionShowMinutos: 180, cotizacionDesde: '5500', unidadCotizacion: 'evento', verificada: true }
    ],
    FOOD: [
      { nombreComercial: 'Tacos Rodantes Eventos', precio: '9,500', tagline: 'Food truck para fiestas y eventos al aire libre.', tipoUnidadFood: 'food_truck', cartaPrincipal: 'Tacos y quesadillas', comensalesPorHora: 120, permisoManipulacionAlimentos: true, cotizacionDesde: '9500', unidadCotizacion: 'evento', verificada: true },
      { nombreComercial: 'Banquetes Elegance', precio: 'Consultar', tagline: 'Buffet y servicio de meseros para bodas.', tipoServicioBanquete: 'buffet', capacidadBanquete: 250, cotizacionDesde: 'Consultar', unidadCotizacion: 'persona', verificada: true }
    ],
    RENTAL: [
      { nombreComercial: 'Mobiliario Fiesta', precio: '4,200', tagline: 'Mesas, sillas y mantelería para eventos.', inventarioMobiliario: ['Mesas', 'Sillas', 'Mantelería'], cotizacionDesde: '4200', unidadCotizacion: 'evento', verificada: true }
    ],
    FLORAL: [
      { nombreComercial: 'Flores & Eventos', precio: '7,800', tagline: 'Arreglos florales e instalaciones para bodas.', estilosFlorales: ['Romántico', 'Minimalista'], cotizacionDesde: '7800', unidadCotizacion: 'evento', verificada: true }
    ],
    FX: [
      { nombreComercial: 'FX Pirotecnia Norte', precio: 'Consultar', tagline: 'Fuegos artificiales con permisos declarativos.', tipoEfectoPirotecnia: ['fuegos_artificiales'], ambientePirotecnia: 'exterior', licenciaPirotecnia: true, disclaimerReguladoEventos: true, cotizacionDesde: 'Consultar', unidadCotizacion: 'evento', verificada: true }
    ],
    SECURITY: [
      { nombreComercial: 'Guardia Eventos MTY', precio: '6,000', tagline: 'Seguridad privada para eventos sociales y masivos.', elementosSeguridad: 12, controlAcceso: true, licenciaSeguridadPrivada: true, disclaimerReguladoEventos: true, cotizacionDesde: '6000', unidadCotizacion: 'evento', verificada: true }
    ],
    VALET: [
      { nombreComercial: 'Valet Premium', precio: '4,500', tagline: 'Estacionamiento asistido para bodas y galas.', vehiculosPorHora: 40, elementosValet: 6, polizaResponsabilidadValet: true, cotizacionDesde: '4500', unidadCotizacion: 'evento', verificada: true }
    ],
    TRANSPORT: [
      { nombreComercial: 'Shuttle Invitados', precio: '7,800', tagline: 'Transporte de invitados en sprinter y autobús.', tipoFlotaTransporte: ['sprinter', 'autobus'], capacidadPasajeros: 45, incluyeChofer: true, radioServicioKm: 80, cotizacionDesde: '7800', unidadCotizacion: 'evento', verificada: true }
    ]
  };

  var DEMO_EVENTOS = {
    'espacios-para-eventos': DEMO_EVENTOS_BY_PACK.VENUE,
    'grupos-musicales-eventos': DEMO_EVENTOS_BY_PACK.MUSIC,
    'shows-para-eventos': DEMO_EVENTOS_BY_PACK.SHOW,
    'fotografia-video-eventos': DEMO_EVENTOS_BY_PACK.CREATIVE
  };

  function eventosPackDeSub(subId) {
    var key = String(subId || '').trim().toLowerCase().replace(/_/g, '-');
    if (EVENTOS_PACK_POR_SUB[key]) return EVENTOS_PACK_POR_SUB[key];
    if (global.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS && CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS.resolvePack) {
      return CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS.resolvePack(key);
    }
    return 'PROD';
  }

  function buildEventosPerfilDemo(base, subId, pack) {
    pack = String(pack || 'PROD').toUpperCase();
    var p = {
      deltaPack: pack,
      canonSubcategoriaId: subId,
      tagline: base.tagline || '',
      cotizacionDesde: base.cotizacionDesde || base.precio || 'Consultar',
      unidadCotizacion: base.unidadCotizacion || 'evento',
      horarioAtencionComercial: base.horario || base.horarioAtencionComercial || ''
    };
    var keys = [
      'nombreComercial', 'alias', 'tiposEspacio', 'tiposEventoAceptados', 'capacidadMin', 'capacidadMax',
      'estacionamientoCupo', 'cateringPolitica', 'permiteMusicaEnVivo', 'permitePirotecnia', 'restriccionRuido',
      'serviciosProduccion', 'tamanoEventoAtendido', 'serviciosAudiovisual', 'especialidadesEvento', 'horasCobertura',
      'licenciaDron', 'serviciosDecoracion', 'tipoAgrupacion', 'descripcionFormatoFaraFara', 'numeroIntegrantes',
      'repertorioPrincipal', 'duracionSetMinutos', 'incluyeSonidoMusica', 'tipoShow', 'publicoObjetivo',
      'contenidoSensible', 'duracionShowMinutos', 'numeroArtistas', 'rolPrincipal', 'tipoUnidadFood',
      'cartaPrincipal', 'comensalesPorHora', 'permisoManipulacionAlimentos', 'tipoServicioBanquete',
      'capacidadBanquete', 'inventarioMobiliario', 'estilosFlorales', 'tipoEfectoPirotecnia', 'ambientePirotecnia',
      'licenciaPirotecnia', 'disclaimerReguladoEventos', 'elementosSeguridad', 'controlAcceso', 'licenciaSeguridadPrivada',
      'vehiculosPorHora', 'elementosValet', 'polizaResponsabilidadValet', 'tipoFlotaTransporte', 'capacidadPasajeros',
      'incluyeChofer', 'radioServicioKm', 'colaboracionesComerciales', 'mostrarColaboracionContenidoPublico'
    ];
    keys.forEach(function (k) {
      if (base[k] != null && base[k] !== '') p[k] = base[k];
    });
    return p;
  }

  function armarPerfilEventos(base, idx, Q, pres) {
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var catLabel = base.categoriaPublica || labelCategoria(Q.categoria);
    var pack = base.deltaPack || eventosPackDeSub(subId);
    var esNegocio = EVENTOS_NEGOCIO_SUBS.indexOf(subId) >= 0;
    var eventos = buildEventosPerfilDemo(base, subId, pack);
    var nombre = base.nombreComercial || base.alias || base.nombre || 'Proveedor demo';
    var id = 'demo-eventos-' + subId + '-' + slug(nombre) + '-' + idx;
    var precio = base.precio || eventos.cotizacionDesde || 'Consultar';

    var u = {
      __id: id,
      __demo: true,
      __vista: esNegocio ? 'empresa' : 'pro',
      sectorId: 'eventos',
      subcategoriaId: subId,
      arquetipo: esNegocio ? 'negocio_venue' : 'persona_servicio_profesional',
      tipoPerfil: esNegocio ? 'negocio' : 'persona',
      categoria: catLabel,
      categoriaPublica: catLabel,
      precio: precio,
      tagline: base.tagline || '',
      horario: base.horario || eventos.horarioAtencionComercial || 'Consultar',
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
      eventosPerfil: eventos
    };

    if (esNegocio) {
      u.nombreComercial = eventos.nombreComercial || nombre;
      u.nombre = u.nombreComercial;
    } else {
      u.alias = eventos.alias || nombre;
      u.nombre = u.alias;
    }

    if (base.contenidoSensible === true || (Array.isArray(base.tipoShow) && base.tipoShow.indexOf('strippers') >= 0)) {
      u.sensible = true;
      u.requiresAdminReview = true;
    }
    if (pack === 'FX' || pack === 'SECURITY') {
      u.regulada = true;
      u.requiresAdminReview = true;
    }
    if (base.colaboracionContenido) u.colaboracionContenido = base.colaboracionContenido;
    if (base.mostrarColaboracionContenidoPublico) {
      u.mostrarColaboracionContenidoPublico = base.mostrarColaboracionContenidoPublico;
    }

    return enriquecerPerfil(u, Q);
  }

  function poolDemoEventos(subId) {
    if (DEMO_EVENTOS[subId]) return DEMO_EVENTOS[subId];
    var pack = eventosPackDeSub(subId);
    return DEMO_EVENTOS_BY_PACK[pack] || DEMO_EVENTOS_BY_PACK.PROD;
  }

  function plantillaDemoEventos(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    return poolDemoEventos(subId).map(function (base, idx) {
      return armarPerfilEventos(base, idx, Q, pres);
    });
  }

  function plantillaDemoSchema(Q, pres) {
    pres = pres || presentacionDeCategoria(Q.categoria);
    /* Si el schema no resolvió el sector (subcategoría con nombre no canónico),
       derivarlo con el resolvedor de resultados para enrutar al builder correcto
       del sector y no caer en pool genérico/vacío. */
    if (!pres.sectorId) {
      var sid = sectorDeBusqueda(Q);
      if (sid && sid !== 'adultos') {
        pres = Object.assign({}, pres, { sectorId: sid });
      }
    }
    var R = global.CariHubSectorContractRegistry;
    if (R && R.resolveDemoBuilder) {
      var builderId = R.resolveDemoBuilder(pres.sectorId);
      if (builderId === 'plantillaDemoProfesionales' && typeof plantillaDemoProfesionales === 'function') {
        return plantillaDemoProfesionales(Q, pres);
      }
      if (builderId === 'plantillaDemoBienestar' && typeof plantillaDemoBienestar === 'function') {
        if (!pres.esAdultoPersona) return plantillaDemoBienestar(Q, pres);
      }
      if (builderId === 'plantillaDemoGastronomia' && typeof plantillaDemoGastronomia === 'function') {
        return plantillaDemoGastronomia(Q, pres);
      }
      if (builderId === 'plantillaDemoEventos' && typeof plantillaDemoEventos === 'function') {
        return plantillaDemoEventos(Q, pres);
      }
      if (builderId === 'plantillaDemoMascotas' && typeof plantillaDemoMascotas === 'function') {
        return plantillaDemoMascotas(Q, pres);
      }
      if (builderId === 'plantillaDemoHogar' && typeof plantillaDemoHogar === 'function') {
        return plantillaDemoHogar(Q, pres);
      }
      if (builderId === 'plantillaDemoSalud' && typeof plantillaDemoSalud === 'function') {
        return plantillaDemoSalud(Q, pres);
      }
      if (builderId === 'plantillaDemoTecnologia' && typeof plantillaDemoTecnologia === 'function') {
        return plantillaDemoTecnologia(Q, pres);
      }
      if (builderId === 'plantillaDemoAutomotriz' && typeof plantillaDemoAutomotriz === 'function') {
        return plantillaDemoAutomotriz(Q, pres);
      }
      if (builderId === 'plantillaDemoTransporte' && typeof plantillaDemoTransporte === 'function') {
        return plantillaDemoTransporte(Q, pres);
      }
      if (builderId === 'plantillaDemoComercio' && typeof plantillaDemoComercio === 'function') {
        return plantillaDemoComercio(Q, pres);
      }
      if (builderId === 'plantillaDemoEducacion' && typeof plantillaDemoEducacion === 'function') {
        return plantillaDemoEducacion(Q, pres);
      }
      if (builderId === 'plantillaDemoIndustria' && typeof plantillaDemoIndustria === 'function') {
        return plantillaDemoIndustria(Q, pres);
      }
      if (builderId === 'plantillaDemoBienesRaices' && typeof plantillaDemoBienesRaices === 'function') {
        return plantillaDemoBienesRaices(Q, pres);
      }
    }
    var comp = pres.componenteResultados || 'ResultCardAdultos';
    var subId = pres.subcategoriaId || idCategoria(Q.categoria);
    var subKey = String(subId || '').trim().toLowerCase().replace(/_/g, ' ');
    var compBucket = DEMO_POR_COMPONENTE[comp] || {};
    var pool = compBucket[subId] || compBucket[subKey] || compBucket.default || [];
    var catLabel = labelCategoria(Q.categoria);
    var vistaDef = pres.vistaPerfil || vistaDeCategoria(Q.categoria);
    return pool.map(function (base, idx) {
      return armarPerfil(base, idx, Q, catLabel, subKey || subId, vistaDef);
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
    var F = global.CariHubPerfilBusquedaFiltro;
    if (F && F.campoCoincide) return F.campoCoincide(valorPerfil, valorBusqueda, opts);
    return true;
  }

  function coincideBusqueda(u, Q) {
    if (!u || !Q) return false;
    var F = global.CariHubPerfilBusquedaFiltro;
    if (F && F.perfilCoincideFiltros) return F.perfilCoincideFiltros(u, Q);
    /* Fallback si el módulo de filtro no cargó (p. ej. perfil-publico): al menos subcategoría. */
    var qSub = String(Q.subcategoriaId || Q.categoria || '').trim().toLowerCase().replace(/_/g, '-');
    var uSub = String(u.subcategoriaId || u.categoria || u.categoriaPublica || '').trim().toLowerCase().replace(/_/g, '-');
    if (qSub && uSub && (uSub === qSub || uSub.indexOf(qSub) >= 0 || qSub.indexOf(uSub) >= 0)) return true;
    if (u.sectorId && Q.categoria && String(u.sectorId).toLowerCase() === String(Q.categoria).toLowerCase()) return true;
    return false;
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
        perfiles: perfilesPreviewPorCategoria(Q, true).slice(),
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
        perfiles: perfilesPreviewPorCategoria(Q, true).slice(),
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
      if (tieneDemoAdultoEspecializado(pres, Q)) {
        demo = plantillaDemoSchema(Q, pres).filter(function (u) {
          return coincideBusqueda(u, Q);
        });
      } else {
        demo = perfilesCanonicosCuatro(Q).filter(function (u) {
          return coincideBusqueda(u, Q);
        });
      }
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
      '<div class="res-empty res-empty--inline" role="status" aria-live="polite">' +
        '<h2 class="res-empty__title">' + safeTxt(tituloVacio()) + '</h2>' +
        '<p class="res-empty__sub">' + safeTxt(SUB_SIN_RESULTADOS) + '</p>' +
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

  /** Alias de IDs cortos usados en QA / URLs legacy → canónicos. */
  var DEMO_ID_ALIAS = {
    'demo-1': 'demo-violeta',
    'demo-2': 'demo-mariana',
    'demo-3': 'demo-sofia',
    'demo-4': 'demo-valentina',
    'demo-5': 'demo-camila'
  };

  /** Infiere categoría desde ids tipo demo-escort gay-mateo-r-0. */
  function inferCategoriaFromDemoId(id) {
    var rest = String(id || '').replace(/^demo-/i, '');
    if (!rest) return '';
    var keys = Object.keys((DEMO_POR_COMPONENTE && DEMO_POR_COMPONENTE.ResultCardAdultos) || {})
      .sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (rest === k || rest.indexOf(k + '-') === 0) return k;
    }
    return '';
  }

  /** Busca un perfil demo por __id (canónicos, alias y pools especializados LGBT/sector). */
  function perfilPorId(id, Q) {
    if (!id) return null;
    Q = Q || queryFromLocation();
    id = DEMO_ID_ALIAS[id] || id;
    var todos = PERFILES_CANON.slice();
    if (PERFIL_CANON_CUARTO) todos.push(PERFIL_CANON_CUARTO);
    if (PERFIL_CANON_QUINTO) todos.push(PERFIL_CANON_QUINTO);
    var base = todos.find(function (p) { return p.__id === id; });
    if (base) return enriquecerPerfil(clonarPerfil(base, Q), Q);

    var q2 = Object.assign({}, Q);
    if (!q2.categoria) {
      var inferred = inferCategoriaFromDemoId(id);
      if (inferred) q2.categoria = inferred;
    }
    if (!q2.categoria && Q.categoria) q2.categoria = Q.categoria;
    if (!q2.categoria) return null;

    var lista = [];
    try {
      lista = perfilesPreviewPorCategoria(q2, true) || [];
    } catch (eLista) {
      lista = [];
    }
    var hit = lista.find(function (p) { return p && p.__id === id; });
    return hit || null;
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
    /* Misma pantalla de resultados con o sin perfiles: banners del sector activo. */
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
    syncBannersVista: syncBannersVista,
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
    perfilPorId: perfilPorId,
    plantillaDemoGastronomia: plantillaDemoGastronomia,
    plantillaDemoProfesionales: plantillaDemoProfesionales,
    plantillaDemoEventos: plantillaDemoEventos,
    plantillaDemoMascotas: plantillaDemoMascotas,
    plantillaDemoHogar: plantillaDemoHogar,
    plantillaDemoSalud: plantillaDemoSalud,
    plantillaDemoBienestar: plantillaDemoBienestar,
    plantillaDemoTecnologia: plantillaDemoTecnologia,
    plantillaDemoAutomotriz: plantillaDemoAutomotriz,
    plantillaDemoTransporte: plantillaDemoTransporte,
    plantillaDemoComercio: plantillaDemoComercio,
    plantillaDemoEducacion: plantillaDemoEducacion,
    plantillaDemoIndustria: plantillaDemoIndustria,
    plantillaDemoBienesRaices: plantillaDemoBienesRaices
  };
})(typeof window !== 'undefined' ? window : globalThis);
