/**
 * Bloques públicos registro — persona_espectaculo (stripper / tabledance).
 * Fuente: scripts/config-registro-adultos-schema.json (plantilla persona_espectaculo).
 * Stripper: módulo Viaja transversal (sin desplazamiento básico v1).
 */
(function (global) {
  'use strict';

  var OPCIONES_SI_NO = ['Sí', 'No'];

  var TIPO_SHOW_OPCIONES = [
    'Shows privados',
    'Despedidas de soltero(a)',
    'Pole dance / barra',
    'Baile en mesa',
    'Eventos corporativos',
    'Fiestas VIP',
    'Presencia en antro / club',
    'Sesiones fotográficas',
    'Interacción con público'
  ];

  var DURACION_SHOW = [
    'Por canción',
    '15 minutos',
    '30 minutos',
    '45 minutos',
    '1 hora',
    'Show extendido (a convenir)'
  ];

  var MODALIDADES_SHOW = [
    { value: 'fiestas', label: 'Fiestas privadas' },
    { value: 'despedidas', label: 'Despedidas' },
    { value: 'hoteles', label: 'Hoteles / suites' },
    { value: 'clubes', label: 'Clubes / antros' },
    { value: 'eventos_vip', label: 'Eventos VIP' },
    { value: 'eventos_privados', label: 'Eventos privados' }
  ];

  var VIAJES_SUBCAMPOS = [
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
        { value: 'cliente', label: 'El cliente / contratante' },
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
      placeholder: 'Destinos, eventos frecuentes, condiciones, etc.'
    }
  ];

  var DESPLAZAMIENTOS_SHOW = [
    'Zona local / área metropolitana',
    'Sí (costo extra según ubicación)',
    'Solo en venue acordado',
    'No me desplazo'
  ];

  var SERVICIOS_SHOW = [
    'Shows privados',
    'Danzas eróticas',
    'Interacción con el público',
    'Bailes en barra / pole dance',
    'Baile en mesa',
    'Presencia en fiestas y eventos',
    'Despedidas de soltero(a)',
    'Sesiones fotográficas',
    'VIP experience'
  ];

  var NO_REALIZA_SHOW = [
    'Servicios sexuales',
    'Menores de edad',
    'Uso de drogas',
    'Faltas de respeto',
    'Grabaciones sin autorización'
  ];

  var EXPERIENCIA_SHOW = [
    'Principiante',
    '1–3 años',
    '3–5 años',
    '5+ años',
    'Profesional verificada'
  ];

  var VESTUARIO_SHOW = [
    'Lencería / outfit temático',
    'Vestuario de antro',
    'Traje / formal',
    'Desnudo artístico (según venue)',
    'A convenir con el cliente',
    'Traje provisto por el venue'
  ];

  global.CARIHUB_REGISTRO_ESPECTACULO_BLOCKS = {
    id: 'persona_espectaculo',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_espectaculo'],
    subcategoriaIds: ['stripper', 'tabledance'],
    fotosMin: 4,
    subcategoriaOverrides: {
      stripper: {
        obligatoriosExtra: ['modalidades', 'anosExperiencia'],
        obligatoriosRemove: ['desplazamientos'],
        fieldHints: {
          tipoShow: 'Tipos de show que ofreces — aparecen en tarjeta y ficha.',
          modalidades: 'Contextos del show y desplazamiento a eventos.',
          venueFijo: 'Opcional: zona o área donde sueles trabajar.',
          serviciosIncluidos: 'Qué incluye tu show — no uses listados escort.',
          serviciosNoRealizo: 'Restricciones claras y profesionales.'
        }
      },
      tabledance: {
        obligatoriosExtra: ['venueFijo'],
        obligatoriosRemove: ['desplazamientos'],
        fieldHints: {
          venueFijo: 'Obligatorio: antro(s) o venue donde trabajas.',
          tipoShow: 'Enfatiza table dance y shows en antro.',
          modalidades: 'Dónde realizas tus presentaciones de table dance. Indica el tipo de venue, disponibilidad y condiciones del lugar.',
          horarioDetalle: 'Ej. Viernes a domingo · turno nocturno.'
        },
        fieldPatches: {
          desplazamientos: { required: false }
        }
      }
    },
    obligatorios: [
      'tipoShow',
      'precioShow',
      'horarioMinimo',
      'horarioDetalle',
      'modalidades',
      'serviciosIncluidos',
      'serviciosNoRealizo',
      'metodosPago'
    ],
    blocks: [
      {
        id: 'espectaculoPerfil',
        title: 'Perfil de show',
        hint: 'Tipo de show, tarifas y experiencia — tono profesional de espectáculo, no servicios escort.',
        fields: [
          {
            id: 'tipoShow',
            label: 'Tipo de show',
            type: 'checklist',
            required: true,
            options: TIPO_SHOW_OPCIONES.slice()
          },
          {
            id: 'precioShow',
            label: 'Precio show / desde',
            type: 'text',
            required: true,
            placeholder: 'Ej. $1,200 MXN por canción'
          },
          {
            id: 'horarioMinimo',
            label: 'Duración mínima del show',
            type: 'select',
            required: true,
            options: DURACION_SHOW.slice()
          },
          {
            id: 'anosExperiencia',
            label: 'Experiencia',
            type: 'select',
            required: false,
            options: EXPERIENCIA_SHOW.slice()
          },
          {
            id: 'vestuarioShow',
            label: 'Vestuario / estilo escénico',
            type: 'checklist',
            required: false,
            options: VESTUARIO_SHOW.slice()
          },
          {
            id: 'eventosDisponibles',
            label: '¿Disponible para eventos?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'venueFijo',
            label: 'Venue / zona de trabajo',
            type: 'text',
            required: false,
            placeholder: 'Ej. Antros zona centro · área metropolitana'
          },
          {
            id: 'requisitosLugar',
            label: 'Requisitos del lugar',
            type: 'textarea',
            required: false,
            rows: 3,
            placeholder: 'Espacio, privacidad, equipo de sonido, vestidor, etc.'
          }
        ]
      },
      {
        id: 'modalidadesStripper',
        title: 'Modalidad de atención',
        onlySubcategorias: ['stripper'],
        hint: 'Contextos del show. Marca «Viaja a eventos» si te desplazas con alcance y condiciones.',
        fields: [
          {
            id: 'modalidades',
            label: 'Disponible para',
            type: 'checklist',
            required: true,
            options: MODALIDADES_SHOW.concat([
              { value: 'viaja', label: 'Viaja a eventos', onlySubcategoriasViajes: true }
            ])
          }
        ].concat(VIAJES_SUBCAMPOS)
      },
      {
        id: 'modalidadesTabledance',
        title: 'Contexto del show',
        onlySubcategorias: ['tabledance'],
        hint: 'Dónde realizas tus presentaciones de table dance. Indica el tipo de venue, disponibilidad y condiciones del lugar.',
        fields: [
          {
            id: 'modalidades',
            label: 'Disponible para',
            type: 'checklist',
            required: true,
            options: MODALIDADES_SHOW.slice()
          }
        ]
      },
      {
        id: 'serviciosShow',
        title: 'Servicios y restricciones',
        fields: [
          {
            id: 'serviciosIncluidos',
            label: 'Servicios incluidos en el show',
            type: 'checklist',
            required: true,
            options: SERVICIOS_SHOW.slice()
          },
          {
            id: 'serviciosNoRealizo',
            label: 'No incluido / reglas',
            type: 'checklist',
            required: true,
            options: NO_REALIZA_SHOW.slice()
          }
        ]
      },
      {
        id: 'agendaShow',
        title: 'Agenda y pago',
        fields: [
          {
            id: 'horarioDetalle',
            label: 'Horario / disponibilidad',
            type: 'text',
            required: true,
            placeholder: 'Ej. Lun–Sáb · noches · con reserva'
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
            placeholder: 'Experiencia, estilo de show y qué esperar…'
          }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
