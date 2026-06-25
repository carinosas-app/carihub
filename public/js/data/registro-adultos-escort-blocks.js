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

  var SINGLES_SERVICIOS_EXTRA = [
    'Tríos con pareja',
    'Hotwife / esposa compartida',
    'Pareja swinger',
    'Solo con la mujer',
    'Gang bang',
    'Eventos lifestyle'
  ];

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
          nivelPremium: 'Aparece en tu tarjeta y ficha como distintivo premium.'
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
        obligatoriosExtra: ['buscan'],
        fieldPatches: {
          buscan: { required: true },
          serviciosIncluidos: {
            options: ESCORT_SERVICIOS_BASE.concat(SINGLES_SERVICIOS_EXTRA)
          }
        },
        fieldHints: {
          buscan: 'Indica con qué dinámicas participas: hotwife, parejas swinger, tríos, solo con la mujer, etc.',
          serviciosIncluidos: 'Marca lo que sí ofreces. Incluye gang bang si participas en ese tipo de escena.'
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
          sobreMi: 'Presentación personal: quién eres, tu estilo y qué te hace diferente como hotwife.'
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
          { id: 'orientacion', label: 'Orientación sexual', type: 'select', required: false, options: ['Heterosexual', 'Bisexual', 'Pansexual', 'Gay', 'Lesbiana', 'Queer'] },
          {
            id: 'identidadGenero',
            label: 'Identidad / presentación',
            type: 'text',
            required: false,
            onlySubcategorias: ['trans'],
            placeholder: 'Ej. Mujer trans, no binaria…'
          },
          { id: 'idiomas', label: 'Idiomas', type: 'text', required: false, placeholder: 'Ej. Español, Inglés' },
          { id: 'nivelServicio', label: 'Nivel de servicios', type: 'select', required: false, options: ['Básico', 'Completo', 'Premium'], helpKey: 'nivelServicio' },
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
            excludeSubcategorias: ['hotwife'],
            options: [
              { value: 'disponible', label: 'Disponible' },
              { value: 'ocupada', label: 'Ocupada' },
              { value: 'con_cita', label: 'Con cita previa' }
            ]
          },
          {
            id: 'buscan',
            label: 'Dinámicas en las que participas',
            type: 'checklist',
            required: false,
            onlySubcategorias: ['singles'],
            options: [
              'Hotwife / esposa compartida',
              'Pareja swinger',
              'Tríos con pareja',
              'Solo con la mujer',
              'Eventos lifestyle'
            ]
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
          }
        ]
      },
      {
        id: 'modalidades',
        title: 'Modalidad de atención',
        hint: 'Marca dónde atiendes (puedes elegir más de una).',
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
          { id: 'ojos', label: 'Color de ojos', type: 'text', required: false, placeholder: 'Ej. Café oscuro' },
          { id: 'tatuajes', label: 'Tatuajes', type: 'select', required: false, options: ['Sí', 'No'] },
          { id: 'piercings', label: 'Piercings', type: 'select', required: false, options: ['Sí', 'No'] }
        ]
      },
      {
        id: 'serviciosIncluidos',
        title: 'Servicios incluidos',
        hint: 'Marca todo lo que sí ofreces en tu servicio base.',
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
            label: 'Descripción personal',
            type: 'textarea',
            required: false,
            placeholder: 'Describe tu estilo, experiencia y qué te hace diferente…',
            rows: 4
          }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
