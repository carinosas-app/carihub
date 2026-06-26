/**
 * Bloques públicos registro — escort / acompañante (persona_acompanante).
 * Fuente: scripts/config-registro-adultos-schema.json (plantilla congelada).
 */
(function (global) {
  'use strict';

  var ESCORT_SERVICIOS_BASE = [
    'Trato de novia', 'Besos', 'Caricias', 'Relaciones', 'Duplex',
    'Oral', 'Anal', 'Juguetes', 'Lencería', 'Fetiches', 'Masaje', 'Overnight (consulta)'
  ];

  var SINGLES_DISPONIBILIDAD = [
    'Disponible ahora',
    'Solo con cita',
    'Entre semana',
    'Fines de semana',
    'Viajes'
  ];

  var SINGLES_DINAMICAS = [
    'Hotwife / esposa compartida',
    'Pareja swinger',
    'Tríos con pareja',
    'Solo con la mujer',
    'Eventos lifestyle',
    'Gang bang'
  ];

  var OPCIONES_SI_NO_ACUERDO = ['Sí', 'No', 'Bajo acuerdo previo'];

  var TIPOS_TRIOS_COMP = [
    'MHM (Mujer–Hombre–Mujer)',
    'HMH (Hombre–Mujer–Hombre)'
  ];

  var VIP_EXPERIENCIA_OPCIONES = [
    'Experiencia exclusiva',
    'Acompañamiento de alto nivel',
    'Eventos sociales',
    'Cenas y reuniones',
    'Viajes',
    'Hoteles y suites',
    'Eventos privados',
    'Citas programadas',
    'Ejecutivos y empresarios',
    'Turismo y acompañamiento'
  ];

  var VIP_DISTINTIVOS_OPCIONES = [
    'Atención personalizada',
    'Máxima discreción',
    'Disponibilidad para viajar',
    'Solo con cita',
    'Excelente presentación',
    'Fotos de alta calidad',
    'Puntualidad',
    'Discreción',
    'Disponibilidad para eventos y viajes',
    'Comunicación profesional'
  ];

  var TOM_BOY_ESTILO = ['Deportivo', 'Urbano', 'Casual', 'Streetwear', 'Rockero', 'Elegante'];
  var TOM_BOY_PRESENTACION = ['Masculina', 'Andrógina', 'Tomboy clásica'];
  var TOM_FEM_ESTILO = ['Elegante', 'Glamour', 'Casual', 'Kawaii', 'Gótico', 'Cosplay'];
  var TOM_FEM_PRESENTACION = ['Muy femenina', 'Femenina', 'Andrógina'];

  global.CARIHUB_REGISTRO_ESCORT_BLOCKS = {
    id: 'persona_acompanante',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_acompanante'],
    subcategoriaIds: [
      'escort', 'escort gay', 'escort vip', 'edecan', 'modelos', 'gigolo',
      'acompanante', 'petit', 'trans', 'femboy', 'singles', 'hotwife',
      'lesbians', 'tom boy', 'tom fem', 'dotados'
    ],
    subcategoriaOverrides: {
      'escort gay': {
        obligatoriosExtra: ['orientacion'],
        badges: ['lgbt'],
        fieldPatches: {
          orientacion: { required: true }
        },
        fieldHints: {
          orientacion: 'Indica orientación y tipo de clientela.'
        }
      },
      'lesbians': {
        obligatoriosExtra: ['orientacion'],
        badges: ['lgbt'],
        fieldPatches: {
          orientacion: { required: true }
        },
        fieldHints: {
          orientacion: 'Indica orientación y tipo de clientela.'
        }
      },
      'escort vip': {
        obligatoriosExtra: ['nivelPremium'],
        badges: ['vip'],
        fotosMin: 5,
        fieldPatches: {
          nivelPremium: { required: true }
        },
        fieldHints: {
          nivelPremium: 'Distintivo premium — aparece en tu tarjeta y ficha.',
          experienciaVip: 'Marca las experiencias VIP que sí ofreces (heredas el formulario Escort completo).',
          distintivosVip: 'Compromisos y cualidades de tu perfil de alto nivel.',
          realizaTrios: 'Indica si ofreces tríos en tu servicio.',
          colaboracionContenido: 'Indica si colaboras en contenido para redes o plataformas.',
          esBisexual: 'Aparece en tu ficha para quien te contacte.'
        }
      },
      'edecan': {
        obligatoriosExtra: ['eventosDisponibles'],
        fieldPatches: {
          eventosDisponibles: { required: true }
        },
        fieldHints: {
          eventosDisponibles: 'Confirma que aceptas contratación para eventos, expos y promociones.'
        }
      },
      'modelos': {
        obligatoriosExtra: ['portfolioURL'],
        fotosMin: 6,
        fieldPatches: {
          portfolioURL: { required: true }
        },
        fieldHints: {
          portfolioURL: 'Enlace público a tu book o portafolio (Instagram, Behance, sitio propio, etc.).'
        }
      },
      'gigolo': {
        labels: { alias: 'Alias masculino' }
      },
      escort: {
        fieldHints: {
          realizaTrios: 'Indica si ofreces tríos en tu servicio.',
          colaboracionContenido: 'Indica si colaboras en contenido para redes o plataformas.',
          esBisexual: 'Aparece en tu ficha para quien te contacte.'
        }
      },
      'petit': {
        fieldPatches: {
          estatura: { placeholder: 'Ej. 1.55 m (máx. 1.58 m)' }
        },
        fieldHints: {
          estatura: 'Petit: estatura máxima 1.58 m. Debe coincidir con tu ficha pública.'
        },
        validaciones: [
          { campo: 'estatura', max: 1.58, mensaje: 'Petit: estatura máxima 1.58 m' }
        ]
      },
      trans: {
        obligatoriosExtra: ['identidadGenero'],
        fieldPatches: {
          identidadGenero: { required: true }
        },
        fieldHints: {
          identidadGenero: 'Cómo te presentas en tu perfil (ej. mujer trans, no binaria…).'
        }
      },
      singles: {
        obligatoriosRemove: ['modalidades', 'serviciosIncluidos', 'serviciosNoRealizo'],
        obligatoriosExtra: [
          'buscanConocer', 'tipoCitaPreferida', 'personalidadPredominante',
          'estiloPersonal', 'disponibilidadAgenda'
        ],
        fieldPatches: {
          buscanConocer: { required: true },
          tipoCitaPreferida: { required: true },
          personalidadPredominante: { required: true },
          estiloPersonal: { required: true },
          disponibilidadAgenda: { required: true }
        },
        fieldHints: {
          buscanConocer: 'Indica a quién te gustaría conocer.',
          tipoCitaPreferida: 'Marca los tipos de cita que prefieres (puedes elegir más de una).',
          personalidadPredominante: 'Cómo te describe la gente que te conoce.',
          estiloPersonal: 'Tu estilo al vestir o presentarte.',
          disponibilidadAgenda: 'Cuándo sueles estar disponible para citas.',
          videoPresentacion: 'Enlace a un video corto de presentación (opcional).',
          dinamicasParticipa: 'Marca las dinámicas lifestyle en las que participas (opcional).',
          colaboracionContenido: 'Indica si colaboras en contenido para redes o plataformas.',
          sobreMi: 'Descríbete: quién eres y qué buscas en una cita.'
        }
      },
      hotwife: {
        badges: ['hotwife'],
        obligatoriosExtra: [
          'participacionPareja', 'tipoPublico', 'disponibilidadAgenda', 'tipoExperiencia', 'sobreMi'
        ],
        fieldPatches: {
          participacionPareja: { required: true },
          tipoPublico: { required: true },
          disponibilidadAgenda: { required: true },
          tipoExperiencia: { required: true },
          sobreMi: { required: true }
        },
        fieldHints: {
          participacionPareja: 'Indica si tu pareja participa en las experiencias o solo acuerda por contacto previo.',
          tipoPublico: 'Singles, parejas o ambos — aparece en tu ficha para quien te contacte.',
          disponibilidadAgenda: 'Marca cuándo sueles estar disponible (puedes elegir más de una).',
          tipoExperiencia: 'Qué tipo de experiencias lifestyle buscas o aceptas.',
          loQueBuscaConocer: 'Describe con quién te gustaría conectar y qué tipo de química buscas.',
          aficiones: 'Hobbies o gustos que ayuden a romper el hielo.',
          estiloVida: 'Cómo vives el lifestyle: discreto, social, viajero, etc.',
          realizaGangBang: 'Indica si participas en gang bang.',
          colaboracionContenido: 'Indica si colaboras en contenido para redes o plataformas.',
          sobreMi: 'Presentación personal: quién eres, tu estilo y qué te hace diferente como hotwife.'
        }
      },
      femboy: {
        badges: ['lgbt'],
        obligatoriosRemove: ['modalidades', 'serviciosIncluidos', 'serviciosNoRealizo'],
        obligatoriosExtra: [
          'presentacionFemboy', 'estiloPredominante', 'disponibilidadAgenda', 'disponiblePara'
        ],
        fieldPatches: {
          presentacionFemboy: { required: true },
          estiloPredominante: { required: true },
          disponibilidadAgenda: { required: true },
          disponiblePara: { required: true }
        },
        fieldHints: {
          presentacionFemboy: 'Cómo te presentas en tu perfil público.',
          estiloPredominante: 'Tu estética principal — aparece en tu ficha.',
          disponibilidadAgenda: 'Marca cuándo sueles estar disponible.',
          disponiblePara: 'Eventos, citas o viajes — elige todo lo que aplique.',
          videoPresentacion: 'Enlace a un video corto de presentación (YouTube, Drive, etc.).',
          promociones: 'Tarifas especiales o promos activas (opcional).',
          realizaTrios: 'Indica si ofreces tríos.',
          tiposTrios: 'Marca los tipos de trío que realizas (puedes elegir más de uno).',
          colaboracionContenido: 'Indica si colaboras en contenido para redes o plataformas.',
          sobreMi: 'Cuéntanos quién eres, tu estilo y qué te hace diferente.'
        }
      },
      'tom boy': {
        badges: ['lgbt'],
        fieldHints: {
          presentacionTom: 'Cómo te presentas en tu perfil público.',
          estiloPredominante: 'Tu estilo predominante al vestir.',
          videoPresentacion: 'Enlace a un video corto de presentación (opcional).',
          realizaTrios: 'Indica si ofreces tríos.',
          tiposTrios: 'MHM o HMH — tipos de trío que realizas.',
          colaboracionContenido: 'Indica si colaboras en contenido para redes o plataformas.',
          sobreMi: 'Biografía: quién eres y qué te hace diferente.',
          personalidad: 'Cómo te describe la gente que te conoce.',
          pasatiempos: 'Hobbies o gustos que aparecen en tu ficha.'
        }
      },
      'tom fem': {
        badges: ['lgbt'],
        fieldHints: {
          presentacionTom: 'Cómo te presentas en tu perfil público.',
          estiloPredominante: 'Tu estilo predominante al vestir.',
          videoPresentacion: 'Enlace a un video corto de presentación (opcional).',
          realizaTrios: 'Indica si ofreces tríos.',
          tiposTrios: 'MHM o HMH — tipos de trío que realizas.',
          colaboracionContenido: 'Indica si colaboras en contenido para redes o plataformas.',
          sobreMi: 'Biografía: quién eres y qué te hace diferente.',
          personalidad: 'Cómo te describe la gente que te conoce.',
          pasatiempos: 'Hobbies o gustos que aparecen en tu ficha.'
        }
      }
    },
    obligatorios: [
      'modalidades', 'serviciosIncluidos', 'serviciosNoRealizo',
      'estatura', 'peso', 'metodosPago'
    ],
    blocks: [
      {
        id: 'perfilDetalle',
        title: 'Tu ficha pública',
        hint: 'Estos datos aparecen en la columna derecha de tu perfil (categoría, idiomas, orientación).',
        fields: [
          { id: 'orientacion', label: 'Orientación sexual', type: 'select', required: false, excludeSubcategorias: ['femboy', 'singles'], options: ['Heterosexual', 'Bisexual', 'Pansexual', 'Gay', 'Lesbiana', 'Queer'] },
          {
            id: 'identidadGenero',
            label: 'Identidad / presentación',
            type: 'text',
            required: false,
            onlySubcategorias: ['trans'],
            placeholder: 'Ej. Mujer trans, no binaria…'
          },
          { id: 'idiomas', label: 'Idiomas', type: 'text', required: false, placeholder: 'Ej. Español, Inglés' },
          { id: 'nivelServicio', label: 'Nivel de servicios', type: 'select', required: false, excludeSubcategorias: ['femboy', 'singles'], options: ['Básico', 'Completo', 'Premium'], helpKey: 'nivelServicio' },
          {
            id: 'nivelPremium',
            label: 'Nivel premium',
            type: 'select',
            required: false,
            onlySubcategorias: ['escort vip'],
            options: [
              'VIP · Alto nivel · Clientes selectos',
              'Premium · Experiencia exclusiva',
              'Exclusivo · Solo con cita y verificación previa',
              'Alto nivel · Hoteles 5★ y suite privada'
            ]
          },
          {
            id: 'eventosDisponibles',
            label: 'Disponible para eventos',
            type: 'boolean',
            required: false,
            onlySubcategorias: ['edecan']
          },
          {
            id: 'portfolioURL',
            label: 'Portafolio',
            type: 'url',
            required: false,
            onlySubcategorias: ['modelos'],
            placeholder: 'https://…'
          },
          {
            id: 'disponibilidad',
            label: 'Disponibilidad',
            type: 'select',
            required: false,
            excludeSubcategorias: ['hotwife', 'femboy', 'singles'],
            options: [
              { value: 'disponible', label: 'Disponible' },
              { value: 'ocupada', label: 'Ocupada' },
              { value: 'con_cita', label: 'Con cita previa' }
            ]
          },
        ]
      },
      {
        id: 'singlesPerfil',
        title: 'Perfil single',
        hint: 'Qué buscas y cómo te gusta conectar.',
        onlySubcategorias: ['singles'],
        fields: [
          {
            id: 'buscanConocer',
            label: 'Busco conocer',
            type: 'checklist',
            required: true,
            options: ['Hombres', 'Mujeres', 'Parejas', 'Cualquiera']
          },
          {
            id: 'tipoCitaPreferida',
            label: 'Tipo de cita preferida',
            type: 'checklist',
            required: true,
            options: ['Cena', 'Café', 'Eventos', 'Viajes', 'Salidas nocturnas', 'A convenir']
          },
          {
            id: 'personalidadPredominante',
            label: 'Personalidad predominante',
            type: 'select',
            required: true,
            options: ['Extrovertida', 'Tranquila', 'Romántica', 'Divertida', 'Elegante', 'Aventurera']
          },
          {
            id: 'estiloPersonal',
            label: 'Estilo',
            type: 'select',
            required: true,
            options: ['Casual', 'Elegante', 'Glamour', 'Deportivo', 'Urbano']
          },
          {
            id: 'disponibilidadAgenda',
            label: 'Disponibilidad',
            type: 'checklist',
            required: true,
            options: SINGLES_DISPONIBILIDAD.slice()
          },
          {
            id: 'videoPresentacion',
            label: 'Video de presentación',
            type: 'url',
            required: false,
            placeholder: 'https://… (opcional)'
          },
          {
            id: 'dinamicasParticipa',
            label: 'Dinámicas en las que participas',
            type: 'checklist',
            required: false,
            options: SINGLES_DINAMICAS.slice()
          },
          {
            id: 'colaboracionContenido',
            label: 'Colaboración para contenido',
            type: 'select',
            required: false,
            options: ['Sí', 'No', 'Bajo acuerdo previo']
          }
        ]
      },
      {
        id: 'femboyPerfil',
        title: 'Perfil femboy',
        hint: 'Presentación, estética y disponibilidad — sin datos explícitos.',
        onlySubcategorias: ['femboy'],
        fields: [
          {
            id: 'presentacionFemboy',
            label: 'Presentación',
            type: 'select',
            required: true,
            options: ['Muy femenino', 'Andrógino', 'Estilo propio']
          },
          {
            id: 'estiloPredominante',
            label: 'Estilo predominante',
            type: 'select',
            required: true,
            options: ['Kawaii', 'Elegante', 'Glamour', 'Gótico', 'Cosplay', 'Casual', 'Urbano']
          },
          {
            id: 'disponibilidadAgenda',
            label: 'Disponibilidad',
            type: 'checklist',
            required: true,
            options: [
              'Disponible ahora',
              'Solo con cita',
              'Entre semana',
              'Fines de semana',
              'Viajes'
            ]
          },
          {
            id: 'disponiblePara',
            label: 'Disponible para',
            type: 'checklist',
            required: true,
            options: ['Eventos', 'Citas', 'Viajes']
          },
          {
            id: 'videoPresentacion',
            label: 'Video de presentación',
            type: 'url',
            required: false,
            placeholder: 'https://… (opcional)'
          },
          {
            id: 'promociones',
            label: 'Promociones',
            type: 'text',
            required: false,
            placeholder: 'Ej. 10% primer encuentro (opcional)'
          },
          {
            id: 'realizaTrios',
            label: '¿Realizas tríos?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_ACUERDO.slice()
          },
          {
            id: 'tiposTrios',
            label: 'Tipo de trío',
            type: 'checklist',
            required: false,
            options: TIPOS_TRIOS_COMP.slice()
          },
          {
            id: 'colaboracionContenido',
            label: 'Colaboración para contenido',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_ACUERDO.slice()
          }
        ]
      },
      {
        id: 'tomPerfil',
        title: 'Presentación y estilo',
        hint: 'Campos distintivos de tu perfil — el resto del formulario es el mismo que Escort.',
        onlySubcategorias: ['tom boy', 'tom fem'],
        fields: [
          {
            id: 'presentacionTom',
            label: 'Presentación',
            type: 'select',
            required: false,
            onlySubcategorias: ['tom boy'],
            options: TOM_BOY_PRESENTACION.slice()
          },
          {
            id: 'presentacionTom',
            label: 'Presentación',
            type: 'select',
            required: false,
            onlySubcategorias: ['tom fem'],
            options: TOM_FEM_PRESENTACION.slice()
          },
          {
            id: 'estiloPredominante',
            label: 'Estilo predominante',
            type: 'select',
            required: false,
            onlySubcategorias: ['tom boy'],
            options: TOM_BOY_ESTILO.slice()
          },
          {
            id: 'estiloPredominante',
            label: 'Estilo predominante',
            type: 'select',
            required: false,
            onlySubcategorias: ['tom fem'],
            options: TOM_FEM_ESTILO.slice()
          },
          {
            id: 'videoPresentacion',
            label: 'Video de presentación',
            type: 'url',
            required: false,
            placeholder: 'https://… (opcional)'
          },
          {
            id: 'realizaTrios',
            label: '¿Realizas tríos?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_ACUERDO.slice()
          },
          {
            id: 'tiposTrios',
            label: 'Tipo de trío',
            type: 'checklist',
            required: false,
            options: TIPOS_TRIOS_COMP.slice()
          },
          {
            id: 'colaboracionContenido',
            label: 'Colaboración para contenido',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_ACUERDO.slice()
          }
        ]
      },
      {
        id: 'hotwifePerfil',
        title: 'Perfil hotwife',
        hint: 'Estos datos diferencian tu perfil en la comunidad lifestyle.',
        onlySubcategorias: ['hotwife'],
        fields: [
          {
            id: 'participacionPareja',
            label: 'Participación de la pareja',
            type: 'select',
            required: true,
            options: ['Presente', 'Opcional', 'Solo contacto previo', 'A convenir']
          },
          {
            id: 'tipoPublico',
            label: 'Busco conocer',
            type: 'select',
            required: true,
            options: ['Singles', 'Parejas', 'Ambos']
          },
          {
            id: 'disponibilidadAgenda',
            label: 'Disponibilidad',
            type: 'checklist',
            required: true,
            options: ['Entre semana', 'Fines de semana', 'Solo con cita', 'Viajes disponibles']
          },
          {
            id: 'tipoExperiencia',
            label: 'Tipo de experiencia que busca',
            type: 'checklist',
            required: true,
            options: [
              'Citas',
              'Eventos sociales',
              'Viajes',
              'Conocer personas',
              'Experiencias para parejas'
            ]
          },
          {
            id: 'loQueBuscaConocer',
            label: 'Lo que busca conocer',
            type: 'textarea',
            required: false,
            rows: 3,
            placeholder: 'Describe qué tipo de conexiones o experiencias te interesan…'
          },
          {
            id: 'aficiones',
            label: 'Aficiones',
            type: 'text',
            required: false,
            placeholder: 'Ej. viajes, gastronomía, deporte…'
          },
          {
            id: 'estiloVida',
            label: 'Estilo de vida',
            type: 'text',
            required: false,
            placeholder: 'Ej. discreta, social, viajera…'
          },
          {
            id: 'realizaGangBang',
            label: '¿Realizas gang bang?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_ACUERDO.slice()
          },
          {
            id: 'colaboracionContenido',
            label: 'Colaboración para contenido',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_ACUERDO.slice()
          }
        ]
      },
      {
        id: 'vipPerfil',
        title: 'Perfil VIP',
        hint: 'Heredas el formulario Escort; aquí marcas experiencia exclusiva y distintivos de alto nivel.',
        onlySubcategorias: ['escort vip'],
        fields: [
          {
            id: 'experienciaVip',
            label: 'Experiencia VIP que ofreces',
            type: 'checklist',
            required: false,
            options: VIP_EXPERIENCIA_OPCIONES.slice()
          },
          {
            id: 'distintivosVip',
            label: 'Distintivos y compromisos de tu perfil',
            type: 'checklist',
            required: false,
            options: VIP_DISTINTIVOS_OPCIONES.slice()
          }
        ]
      },
      {
        id: 'serviciosPreferencias',
        title: 'Preferencias de servicio',
        hint: 'Opciones adicionales que aparecen en tu ficha.',
        onlySubcategorias: ['escort', 'escort vip'],
        fields: [
          {
            id: 'realizaTrios',
            label: '¿Realizas tríos?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_ACUERDO.slice()
          },
          {
            id: 'colaboracionContenido',
            label: 'Colaboración para contenido',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_ACUERDO.slice()
          },
          {
            id: 'esBisexual',
            label: '¿Eres bisexual?',
            type: 'select',
            required: false,
            options: ['Sí', 'No']
          }
        ]
      },
      {
        id: 'modalidades',
        title: 'Modalidad de atención',
        hint: 'Marca dónde atiendes (puedes elegir más de una).',
        excludeSubcategorias: ['femboy', 'singles'],
        fields: [
          {
            id: 'modalidades',
            label: 'Modalidades',
            type: 'checklist',
            required: true,
            options: [
              { value: 'recibe', label: 'Recibe (con lugar)' },
              { value: 'hotel', label: 'Hotel' },
              { value: 'domicilio', label: 'Domicilio' }
            ]
          }
        ]
      },
      {
        id: 'horarios',
        title: 'Horario de atención',
        hint: 'Indica cuándo atiendes. No pedimos duración mínima de cita aquí.',
        fields: [
          { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: false, placeholder: 'Ej. Lun–Sáb 10:00–22:00' }
        ]
      },
      {
        id: 'fisico',
        title: 'Datos físicos (públicos)',
        hint: 'Se muestran en «Sobre mí» y en tu ficha. Sé honesta/o: no los inventamos por ti.',
        fields: [
          { id: 'estatura', label: 'Estatura', type: 'text', required: true, placeholder: 'Ej. 1.65 m' },
          { id: 'peso', label: 'Peso', type: 'text', required: true, placeholder: 'Ej. 55 kg' },
          { id: 'complexion', label: 'Complexión', type: 'select', required: false, options: ['Delgada', 'Atlética', 'Curvy', 'Robusta', 'Promedio'] },
          { id: 'cabello', label: 'Color de cabello', type: 'text', required: false, placeholder: 'Ej. Castaño oscuro' },
          {
            id: 'largoCabello',
            label: 'Largo del cabello',
            type: 'select',
            required: false,
            onlySubcategorias: ['femboy', 'tom boy', 'tom fem'],
            options: ['Corto', 'Medio', 'Largo', 'Muy largo']
          },
          { id: 'ojos', label: 'Color de ojos', type: 'text', required: false, placeholder: 'Ej. Café oscuro' },
          {
            id: 'tonoPiel',
            label: 'Tono de piel',
            type: 'select',
            required: false,
            onlySubcategorias: ['femboy'],
            options: ['Claro', 'Medio', 'Moreno', 'Oscuro']
          },
          { id: 'tatuajes', label: 'Tatuajes', type: 'select', required: false, options: ['Sí', 'No'] },
          { id: 'piercings', label: 'Piercings', type: 'select', required: false, options: ['Sí', 'No'] }
        ]
      },
      {
        id: 'serviciosIncluidos',
        title: 'Servicios incluidos',
        hint: 'Marca todo lo que sí ofreces en tu servicio base.',
        excludeSubcategorias: ['femboy', 'singles'],
        fields: [
          {
            id: 'serviciosIncluidos',
            label: 'Servicios incluidos',
            type: 'checklist',
            required: true,
            options: ESCORT_SERVICIOS_BASE.slice()
          }
        ]
      },
      {
        id: 'serviciosNoRealizo',
        title: 'No realizo / límites',
        hint: 'Marca lo que no ofreces — aparece en tu perfil y evita malentendidos.',
        excludeSubcategorias: ['femboy', 'singles'],
        fields: [
          {
            id: 'serviciosNoRealizo',
            label: 'No realizo',
            type: 'checklist',
            required: true,
            options: [
              'Fiestas', 'Servicios sin protección', 'Menores de edad',
              'Sustancias ilegales', 'Grabaciones no autorizadas', 'Sin cita previa'
            ]
          }
        ]
      },
      {
        id: 'metodosPago',
        title: 'Métodos de pago que aceptas',
        fields: [
          {
            id: 'metodosPago',
            label: 'Métodos de pago',
            type: 'checklist',
            required: true,
            options: [
              { value: 'Efectivo', label: 'Efectivo' },
              { value: 'Transferencia', label: 'Transferencia' },
              { value: 'Tarjeta', label: 'Tarjeta' }
            ]
          }
        ]
      },
      {
        id: 'sobreMi',
        title: 'Sobre mí',
        hint: 'Texto más largo para la sección «Sobre mí» de tu perfil (distinto de la frase corta de arriba).',
        fields: [
          {
            id: 'sobreMi',
            label: 'Biografía',
            type: 'textarea',
            required: false,
            placeholder: 'Describe tu estilo, experiencia y qué te hace diferente…',
            rows: 4
          },
          {
            id: 'personalidad',
            label: 'Personalidad',
            type: 'text',
            required: false,
            onlySubcategorias: ['tom boy', 'tom fem'],
            placeholder: 'Ej. extrovertida, tranquila, aventurera…'
          },
          {
            id: 'pasatiempos',
            label: 'Pasatiempos',
            type: 'text',
            required: false,
            onlySubcategorias: ['tom boy', 'tom fem'],
            placeholder: 'Ej. deporte, música, viajes…'
          }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
