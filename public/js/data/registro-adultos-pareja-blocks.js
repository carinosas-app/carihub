/**
 * Bloques públicos registro — pareja_grupo (v1: swinger).
 */
(function (global) {
  'use strict';

  var OPCIONES_SI_NO = ['Sí', 'No'];
  var OPCIONES_SI_NO_CONVENIR = ['Sí', 'No', 'A convenir'];

  var SWINGER_OBJETIVOS = [
    'Ofrecer servicios',
    'Conocer otras parejas',
    'Colaboraciones con otros anunciantes',
    'Asistir a eventos o reuniones privadas',
    'Todo lo anterior'
  ];

  var SWINGER_TIPO_INTERACCION = [
    'Intercambio de parejas',
    'Tríos',
    'Reuniones privadas',
    'Eventos Swinger',
    'Conocer nuevas parejas',
    'A convenir'
  ];

  var SWINGER_TIPO_PAREJA = [
    'Hombre + Mujer',
    'Mujer + Mujer',
    'Hombre + Hombre',
    'Otra configuración'
  ];

  var SWINGER_ATIENDEN_A = ['Hombres', 'Mujeres', 'Parejas', 'Todos'];

  var SWINGER_ACEPTAN_SOLTEROS = [
    'Sí',
    'No',
    'Solo hombres',
    'Solo mujeres'
  ];

  var SWINGER_COLABORA_CON = [
    'Parejas',
    'Escorts',
    'Lesbians',
    'Hotwife',
    'Singles',
    'Femboy',
    'Tom Boy',
    'Tom Fem',
    'Trans',
    'Gigoló',
    'Dotados',
    'Cualquier anunciante'
  ];

  global.CARIHUB_REGISTRO_PAREJA_BLOCKS = {
    id: 'pareja_grupo',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_pareja'],
    subcategoriaIds: ['swinger'],
    fotosMin: 4,
    subcategoriaOverrides: {
      swinger: {
        obligatoriosExtra: [
          'objetivosPerfil',
          'tipoInteraccion',
          'tipoPareja',
          'atiendenA',
          'aceptanSolteros',
          'haceColaboraciones'
        ],
        fieldHints: {
          objetivosPerfil: 'Marca uno o varios objetivos de tu perfil.',
          tipoInteraccion: 'Categorías de interacción — sin detallar prácticas explícitas.',
          tipoPareja: 'Configuración de la pareja que publica el perfil.',
          atiendenA: 'A quién reciben o con quién buscan conectar.',
          aceptanSolteros: 'Indica si aceptan personas solteras y bajo qué condiciones.',
          haceColaboraciones: 'Si colaboran con otros anunciantes en encuentros o eventos.',
          colaboraCon: 'Marca con qué tipos de anunciantes colaboran.',
          mostrarObjetivosPerfil: 'Controla si los objetivos aparecen en tarjeta y ficha pública.',
          mostrarAtiendenA: 'Controla si «Atienden a» aparece en tarjeta y ficha pública.',
          mostrarColaboraciones: 'Controla si colaboraciones se ven en tarjeta y ficha pública.',
          modalidades: 'Marca dónde se reciben o si viajan. Si marcas «Viaja», completa alcance y condiciones.'
        }
      }
    },
    obligatorios: ['modalidades'],
    blocks: [
      {
        id: 'swingerPerfil',
        title: 'Perfil pareja swinger',
        hint: 'Datos específicos de tu perfil. Usa categorías generales de interacción, no prácticas explícitas.',
        onlySubcategorias: ['swinger'],
        fields: [
          {
            id: 'objetivosPerfil',
            label: 'Objetivo del perfil',
            type: 'checklist',
            required: true,
            options: SWINGER_OBJETIVOS.slice()
          },
          {
            id: 'tipoInteraccion',
            label: 'Tipo de interacción que buscan',
            type: 'checklist',
            required: true,
            options: SWINGER_TIPO_INTERACCION.slice()
          },
          {
            id: 'tipoPareja',
            label: 'Tipo de pareja',
            type: 'select',
            required: true,
            options: SWINGER_TIPO_PAREJA.slice()
          },
          {
            id: 'atiendenA',
            label: 'Atienden a',
            type: 'select',
            required: true,
            options: SWINGER_ATIENDEN_A.slice()
          },
          {
            id: 'mostrarAtiendenA',
            label: '¿Mostrar «Atienden a» en tarjeta y perfil?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'aceptanSolteros',
            label: '¿Aceptan personas solteras?',
            type: 'select',
            required: true,
            options: SWINGER_ACEPTAN_SOLTEROS.slice()
          },
          {
            id: 'haceColaboraciones',
            label: '¿Realizan colaboraciones?',
            type: 'select',
            required: true,
            options: OPCIONES_SI_NO_CONVENIR.slice()
          },
          {
            id: 'colaboraCon',
            label: 'Colaboran con',
            type: 'checklist',
            required: false,
            showWhen: { field: 'haceColaboraciones', values: ['Sí'] },
            options: SWINGER_COLABORA_CON.slice()
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
            id: 'mostrarObjetivosPerfil',
            label: '¿Mostrar objetivos del perfil en tarjeta y perfil?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          }
        ]
      },
      {
        id: 'modalidades',
        title: 'Modalidad de encuentros',
        hint: 'Marca dónde reciben o si viajan. Si marcas «Viaja», indica alcance y condiciones abajo.',
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
        title: 'Horario de disponibilidad',
        hint: 'Indica cuándo suelen estar disponibles para encuentros o eventos.',
        fields: [
          {
            id: 'horarioDetalle',
            label: 'Horario',
            type: 'text',
            required: false,
            placeholder: 'Ej. Vie–Dom 20:00–02:00 · Solo con cita previa'
          }
        ]
      },
      {
        id: 'sobreMi',
        title: 'Sobre nosotros',
        hint: 'Texto para la sección «Sobre nosotros» de tu perfil (distinto de la frase corta de arriba).',
        fields: [
          {
            id: 'sobreMi',
            label: 'Presentación de la pareja',
            type: 'textarea',
            required: false,
            placeholder: 'Descríbanse como pareja, qué buscan y qué las hace diferentes…',
            rows: 4
          }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
