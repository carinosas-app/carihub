/**
 * Bloques públicos registro — persona_dominatrix (dominatrix / fetiche / sado).
 * Fuente: scripts/config-registro-adultos-schema.json (plantilla persona_dominatrix).
 * v1: sin viajes/desplazamiento (decisión posterior).
 */
(function (global) {
  'use strict';

  var OPCIONES_SI_NO = ['Sí', 'No'];

  var ESTILO_DOMINACION = [
    'Femdom',
    'Maledom',
    'Pro-dom profesional',
    'Switch',
    'Sensual domination',
    'Estricta / protocolo',
    'Roleplay dirigido'
  ];

  var EXPERIENCIA_BDSM = [
    'Principiante',
    '1–3 años',
    '3–5 años',
    '5+ años',
    'Profesional verificada'
  ];

  var ESPACIO_SESION = [
    'Dungeon / espacio propio',
    'Hotel',
    'Espacio neutral acordado',
    'Online',
    'Mixto presencial y online'
  ];

  var MODALIDAD_SESION = [
    'Presencial',
    'Online',
    'Presencial y online'
  ];

  var ROLES_ATENDIDOS = [
    'Sumisos',
    'Sumisas',
    'Switches',
    'Parejas',
    'Principiantes (con orientación)',
    'Clientes con experiencia'
  ];

  var PROTOCOLO_OPCIONES = [
    'SSC (Safe, Sane, Consensual)',
    'RACK (Risk-Aware Consensual Kink)',
    'Contrato de límites antes de cada sesión',
    'Aftercare incluido',
    'Negociación previa obligatoria'
  ];

  var FETICHES_COMUNES = [
    'Bondage',
    'Impact play',
    'Sensory play',
    'Roleplay',
    'Foot fetish',
    'Latex / cuero',
    'CBT consensuado',
    'Wax play',
    'Humillación consensuada',
    'Pet play',
    'Disciplina estructurada',
    'Spanking',
    'Restricción',
    'Tease & denial'
  ];

  var EQUIPAMIENTO_OPCIONES = [
    'Cruz de San Andrés',
    'Bondage / restricciones',
    'Impact play (flogger, paddle)',
    'Sensory deprivation',
    'Wax play',
    'Dungeon equipado',
    'Equipamiento portátil',
    'Muebles de contención'
  ];

  var SERVICIOS_BDSM = [
    'Femdom / Maledom',
    'Bondage y restricción',
    'Impact play',
    'Sensory play',
    'Roleplay',
    'CBT consensuado',
    'Wax play',
    'Humillación consensuada',
    'Aftercare',
    'Disciplina estructurada',
    'Sesión de consulta / negociación'
  ];

  var NO_REALIZA_BDSM = [
    'Servicios sexuales convencionales',
    'Sin protección / bareback',
    'Menores de edad',
    'Sustancias ilegales',
    'Grabaciones no autorizadas',
    'Sangre / escatología',
    'Coerción real (no consensuada)'
  ];

  global.CARIHUB_REGISTRO_DOMINATRIX_BLOCKS = {
    id: 'persona_dominatrix',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_dominatrix'],
    subcategoriaIds: ['dominatrix', 'fetiche', 'sado'],
    fotosMin: 3,
    subcategoriaOverrides: {
      dominatrix: {
        obligatoriosExtra: [
          'estiloDominacion',
          'experienciaBdsm',
          'limitesSesion',
          'equipamiento',
          'protocolo',
          'rolesAtendidos',
          'modalidadSesion',
          'espacioSesion'
        ],
        fieldHints: {
          estiloDominacion: 'Tu estilo profesional de dominación — aparece como especialidad en tu ficha.',
          listaFetiches: 'Opcional: fetiches que ofreces además de tu estilo principal.',
          limitesSesion: 'Límites claros y tono profesional — visible en perfil, no en tagline.',
          equipamiento: 'Resumen del equipamiento disponible.',
          protocolo: 'Marco de seguridad y consentimiento (SSC/RACK, aftercare, etc.).',
          modalidadSesion: 'Si atiendes presencial, online o ambos.',
          espacioSesion: 'Dónde realizas sesiones — sin dirección exacta en público.',
          mostrarEquipamientoPublico: 'Controla si el equipamiento aparece en tarjeta y ficha.',
          mostrarFetichesPublico: 'Controla si los fetiches aparecen en tarjeta y ficha.'
        }
      },
      fetiche: {
        obligatoriosExtra: [
          'listaFetiches',
          'estiloDominacion',
          'modalidadSesion',
          'limitesSesion'
        ],
        fieldHints: {
          listaFetiches: 'Obligatorio: indica los fetiches que ofreces.',
          estiloDominacion: 'Enfoque general de tu práctica.',
          limitesSesion: 'Límites y reglas con tono claro y respetuoso.',
          mostrarFetichesPublico: 'Recomendado Sí — ayuda a encontrarte por fetiche.'
        }
      },
      sado: {
        obligatoriosExtra: [
          'listaFetiches',
          'limitesSesion',
          'protocolo',
          'estiloDominacion',
          'experienciaBdsm',
          'rolesAtendidos',
          'modalidadSesion'
        ],
        fieldHints: {
          listaFetiches: 'Prácticas sado/maso que ofreces con consentimiento.',
          limitesSesion: 'Central en Sado — define hard limits con claridad.',
          protocolo: 'SSC/RACK y reglas de sesión — obligatorio en Sado.',
          experienciaBdsm: 'Años o nivel de experiencia en práctica consensuada.',
          rolesAtendidos: 'A quién atiendes en sesiones sado.'
        }
      }
    },
    obligatorios: [
      'estiloDominacion',
      'limitesSesion',
      'equipamiento',
      'serviciosIncluidos',
      'serviciosNoRealizo',
      'modalidades',
      'modalidadSesion',
      'metodosPago',
      'horarioDetalle'
    ],
    blocks: [
      {
        id: 'dominatrixPerfil',
        title: 'Perfil BDSM / dominación',
        hint: 'Estilo, experiencia y límites — tono profesional, sin lenguaje vulgar en tagline.',
        fields: [
          {
            id: 'estiloDominacion',
            label: 'Estilo (pro/dom)',
            type: 'select',
            required: true,
            options: ESTILO_DOMINACION.slice()
          },
          {
            id: 'experienciaBdsm',
            label: 'Experiencia BDSM',
            type: 'select',
            required: false,
            options: EXPERIENCIA_BDSM.slice()
          },
          {
            id: 'listaFetiches',
            label: 'Fetiches ofrecidos',
            type: 'checklist',
            required: false,
            options: FETICHES_COMUNES.slice()
          },
          {
            id: 'mostrarFetichesPublico',
            label: '¿Mostrar fetiches en tarjeta y perfil?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'rolesAtendidos',
            label: 'Roles que atiendes',
            type: 'checklist',
            required: false,
            options: ROLES_ATENDIDOS.slice()
          },
          {
            id: 'modalidadSesion',
            label: 'Modalidad de sesión',
            type: 'select',
            required: true,
            options: MODALIDAD_SESION.slice()
          },
          {
            id: 'espacioSesion',
            label: 'Espacio de sesión',
            type: 'select',
            required: false,
            options: ESPACIO_SESION.slice()
          },
          {
            id: 'equipamiento',
            label: 'Equipamiento',
            type: 'checklist',
            required: true,
            options: EQUIPAMIENTO_OPCIONES.slice()
          },
          {
            id: 'mostrarEquipamientoPublico',
            label: '¿Mostrar equipamiento en tarjeta y perfil?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'protocolo',
            label: 'Protocolo de seguridad',
            type: 'checklist',
            required: false,
            options: PROTOCOLO_OPCIONES.slice()
          },
          {
            id: 'dressCodeCliente',
            label: 'Dress code del cliente',
            type: 'text',
            required: false,
            placeholder: 'Ej. Formal, desnudo según protocolo, a convenir…'
          },
          {
            id: 'limitesSesion',
            label: 'Límites y reglas de sesión',
            type: 'textarea',
            required: true,
            rows: 4,
            placeholder: 'Hard limits, reglas de consentimiento, tono profesional…'
          }
        ]
      },
      {
        id: 'modalidadesDom',
        title: 'Modalidad de atención',
        hint: 'Dónde recibes sesiones presenciales (v1 sin viajes).',
        fields: [
          {
            id: 'modalidades',
            label: 'Modalidades presenciales',
            type: 'checklist',
            required: true,
            options: [
              { value: 'recibe', label: 'Recibe (espacio propio / dungeon)' },
              { value: 'hotel', label: 'Hotel' }
            ]
          }
        ]
      },
      {
        id: 'serviciosDom',
        title: 'Servicios y límites',
        hint: 'Prácticas BDSM consensuadas — no uses listados de servicios escort.',
        fields: [
          {
            id: 'serviciosIncluidos',
            label: 'Servicios incluidos',
            type: 'checklist',
            required: true,
            options: SERVICIOS_BDSM.slice()
          },
          {
            id: 'serviciosNoRealizo',
            label: 'No realizo',
            type: 'checklist',
            required: true,
            options: NO_REALIZA_BDSM.slice()
          }
        ]
      },
      {
        id: 'agendaDom',
        title: 'Agenda y pago',
        fields: [
          {
            id: 'horarioDetalle',
            label: 'Horario / disponibilidad',
            type: 'text',
            required: true,
            placeholder: 'Ej. Lun–Sáb con cita previa (24 h anticipación)'
          },
          {
            id: 'disponibilidad',
            label: 'Estado de disponibilidad',
            type: 'select',
            required: false,
            options: [
              { value: 'disponible', label: 'Disponible' },
              { value: 'ocupada', label: 'Ocupada' },
              { value: 'con_cita', label: 'Con cita previa' }
            ]
          },
          {
            id: 'metodosPago',
            label: 'Métodos de pago',
            type: 'checklist',
            required: true,
            options: ['Efectivo', 'Transferencia', 'Tarjeta', 'Pago en línea']
          },
          {
            id: 'sobreMi',
            label: 'Sobre mí',
            type: 'textarea',
            required: false,
            rows: 4,
            placeholder: 'Enfoque, experiencia y qué esperar de una sesión…'
          },
          {
            id: 'idiomas',
            label: 'Idiomas',
            type: 'text',
            required: false,
            placeholder: 'Ej. Español · Inglés'
          }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
