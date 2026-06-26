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
    'Fines de semana'
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

  var OPCIONES_SI_NO = ['Sí', 'No'];

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

  var LESBIANS_COLABORA_CON = [
    'Mujeres', 'Lesbians', 'Bisexuales', 'Trans', 'Femboy', 'Tom Boy', 'Tom Fem',
    'Parejas', 'Cualquier anunciante'
  ];

  var LESBIANS_ESTILO = [
    'Elegante', 'Casual', 'Glamour', 'Deportivo', 'Alternativo', 'Urbano', 'Discreto'
  ];

  var OPCIONES_SI_NO_CONVENIR = ['Sí', 'No', 'A convenir'];

  global.CARIHUB_REGISTRO_ESCORT_BLOCKS = {
    id: 'persona_acompanante',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_acompanante'],
    subcategoriaIds: [
      'escort', 'escort gay', 'escort vip', 'edecan', 'modelos', 'gigolo',
      'acompanante', 'petit', 'trans', 'femboy', 'singles',
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
        obligatoriosExtra: ['orientacion', 'atiendoA', 'haceColaboraciones'],
        badges: ['lgbt'],
        fieldPatches: {
          orientacion: { required: true },
          atiendoA: { required: true },
          haceColaboraciones: { required: true },
          mostrarAtiendoA: { defaultValue: 'Sí' },
          mostrarColaboraciones: { defaultValue: 'Sí' }
        },
        fieldHints: {
          orientacion: 'Indica orientación y tipo de clientela.',
          atiendoA: 'Define a quién atiendes en tu perfil.',
          mostrarAtiendoA: 'Controla si «Atiende a» aparece en tarjeta y ficha pública.',
          haceColaboraciones: 'Indica si colaboras con otras anunciantes (distinto de colaboración para contenido).',
          colaboraCon: 'Marca con quién te interesa colaborar.',
          mostrarColaboraciones: 'Controla si colaboraciones se ven en tarjeta y ficha pública.',
          estiloLesbian: 'Tu estilo o estética principal (opcional).'
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
          disponibilidadAgenda: { required: true },
          modalidades: { required: false }
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
          disponiblePara: { required: true },
          modalidades: { required: false }
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
      },
      dotados: {
        fieldHints: {
          longitudCm: 'Medida en centímetros — tono discreto en tu ficha.',
          mostrarLongitudPublico: 'Si eliges No, la longitud no aparece en tu perfil público.',
          atencionHombres: 'Indica si atiendes a hombres.',
          mostrarAtencionHombresPublico: 'Controla si esto se ve en tu ficha pública.',
          atencionMujeres: 'Indica si atiendes a mujeres.',
          mostrarAtencionMujeresPublico: 'Controla si esto se ve en tu ficha pública.',
          atencionParejas: 'Indica si atiendes a parejas.',
          mostrarAtencionParejasPublico: 'Controla si esto se ve en tu ficha pública.',
          atencionTrans: 'Indica si atiendes a personas trans.',
          mostrarAtencionTransPublico: 'Controla si esto se ve en tu ficha pública.',
          realizaTrios: 'Indica si ofreces tríos.',
          mostrarRealizaTriosPublico: 'Controla si esto se ve en tu ficha pública.',
          colaboracionContenido: 'Indica si colaboras en contenido para redes o plataformas.',
          mostrarColaboracionContenidoPublico: 'Controla si esto se ve en tu ficha pública.'
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
            excludeSubcategorias: ['femboy', 'singles'],
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
              'Fines de semana'
            ]
          },
          {
            id: 'disponiblePara',
            label: 'Disponible para',
            type: 'checklist',
            required: true,
            options: ['Eventos', 'Citas']
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
        id: 'lesbiansPerfil',
        title: 'Perfil lesbians',
        hint: 'Datos específicos de tu perfil. El badge LGBT+ se asigna automáticamente.',
        onlySubcategorias: ['lesbians'],
        fields: [
          {
            id: 'atiendoA',
            label: 'Atiende a',
            type: 'select',
            required: true,
            options: ['Mujeres', 'Parejas', 'Ambos']
          },
          {
            id: 'mostrarAtiendoA',
            label: '¿Mostrar «Atiende a» en tarjeta y perfil?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'haceColaboraciones',
            label: 'Colaboraciones con otras anunciantes',
            type: 'select',
            required: true,
            options: OPCIONES_SI_NO_CONVENIR.slice()
          },
          {
            id: 'colaboraCon',
            label: 'Busco colaborar con',
            type: 'checklist',
            required: false,
            showWhen: { field: 'haceColaboraciones', values: ['Sí', 'A convenir'] },
            options: LESBIANS_COLABORA_CON.slice()
          },
          {
            id: 'mostrarColaboraciones',
            label: '¿Mostrar colaboraciones en tarjeta y perfil?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'estiloLesbian',
            label: 'Estilo',
            type: 'select',
            required: false,
            options: LESBIANS_ESTILO.slice()
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
        id: 'dotadosPerfil',
        title: 'Perfil dotados',
        hint: 'Todo se guarda en tu cuenta; en la ficha pública solo aparece lo que marques como visible.',
        onlySubcategorias: ['dotados'],
        fields: [
          {
            id: 'longitudCm',
            label: 'Longitud (cm)',
            type: 'text',
            required: false,
            placeholder: 'Ej. 18'
          },
          {
            id: 'mostrarLongitudPublico',
            label: '¿Mostrar longitud en tu perfil público?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'atencionHombres',
            label: '¿Ofrece atención a hombres?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'mostrarAtencionHombresPublico',
            label: 'Mostrar atención a hombres en perfil',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'atencionMujeres',
            label: '¿Ofrece atención a mujeres?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'mostrarAtencionMujeresPublico',
            label: 'Mostrar atención a mujeres en perfil',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'atencionParejas',
            label: '¿Ofrece atención a parejas?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'mostrarAtencionParejasPublico',
            label: 'Mostrar atención a parejas en perfil',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'atencionTrans',
            label: '¿Ofrece atención a personas trans?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'mostrarAtencionTransPublico',
            label: 'Mostrar atención a personas trans en perfil',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO.slice()
          }
        ]
      },
      {
        id: 'dotadosPreferencias',
        title: 'Preferencias adicionales',
        hint: 'Marca lo que ofreces y decide qué mostrar en tu perfil público.',
        onlySubcategorias: ['dotados'],
        fields: [
          {
            id: 'realizaTrios',
            label: '¿Realizas tríos?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_ACUERDO.slice()
          },
          {
            id: 'mostrarRealizaTriosPublico',
            label: 'Mostrar tríos en perfil',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'colaboracionContenido',
            label: 'Colaboración para contenido',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_ACUERDO.slice()
          },
          {
            id: 'mostrarColaboracionContenidoPublico',
            label: 'Mostrar colaboración para contenido en perfil',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO.slice()
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
        hint: 'Marca dónde atiendes (puedes elegir más de una). Si viajas, marca «Viaja» para indicar alcance y condiciones.',
        fields: [
          {
            id: 'modalidades',
            label: 'Modalidades',
            type: 'checklist',
            required: true,
            options: [
              { value: 'recibe', label: 'Recibe (con lugar)' },
              { value: 'hotel', label: 'Hotel' },
              { value: 'domicilio', label: 'Domicilio' },
              { value: 'viaja', label: 'Viaja', onlySubcategoriasViajes: true }
            ]
          },
          {
            id: 'alcanceDesplazamiento',
            label: 'Alcance de desplazamiento',
            type: 'select',
            required: true,
            showWhenViaja: true,
            options: [
              { value: 'solo_zona', label: 'Solo mi zona' },
              { value: 'toda_ciudad', label: 'Toda mi ciudad' },
              { value: 'todo_estado', label: 'Todo mi estado / provincia / departamento' },
              { value: 'cualquier_ciudad_pais', label: 'Cualquier ciudad de mi país' },
              { value: 'otro_pais', label: 'Otro país' },
              { value: 'internacional', label: 'Internacional / varios países' }
            ]
          },
          {
            id: 'viajesProgramados',
            label: 'Viajes programados',
            type: 'select',
            required: true,
            showWhenViaja: true,
            options: [
              { value: 'si', label: 'Sí' },
              { value: 'no', label: 'No' },
              { value: 'a_convenir', label: 'A convenir' }
            ]
          },
          {
            id: 'gastosTraslado',
            label: 'Gastos de viaje',
            type: 'select',
            required: true,
            showWhenViaja: true,
            options: [
              { value: 'cliente', label: 'El cliente' },
              { value: 'anunciante', label: 'El anunciante' },
              { value: 'se_acuerda', label: 'Se acuerda' }
            ]
          },
          {
            id: 'anticipacionViaje',
            label: 'Anticipación requerida',
            type: 'select',
            required: true,
            showWhenViaja: true,
            options: [
              { value: 'mismo_dia', label: 'Mismo día' },
              { value: '24h', label: '24 horas antes' },
              { value: '48h', label: '48 horas antes' },
              { value: '1_semana', label: 'Una semana antes' },
              { value: 'a_convenir', label: 'A convenir' }
            ]
          },
          {
            id: 'notasViaje',
            label: 'Notas de viaje',
            type: 'text',
            required: false,
            showWhenViaja: true,
            placeholder: 'Opcional — condiciones, destinos frecuentes, etc.'
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
