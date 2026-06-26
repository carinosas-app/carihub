/**
 * Bloques públicos registro — pareja_grupo (shell base + delta swinger).
 */
(function (global) {
  'use strict';

  var OPCIONES_SI_NO = ['Sí', 'No'];
  var OPCIONES_SI_NO_CONVENIR = ['Sí', 'No', 'A convenir'];

  var CONFIGURACION_GRUPO = [
    { value: 'pareja_hm', label: 'Hombre + Mujer' },
    { value: 'pareja_mm', label: 'Mujer + Mujer' },
    { value: 'pareja_hh', label: 'Hombre + Hombre' },
    { value: 'grupo', label: 'Grupo (3 o más integrantes)' },
    { value: 'otra', label: 'Otra configuración' }
  ];

  var GENERO_PRESENTACION = ['Hombre', 'Mujer', 'Otro', 'Prefiero no decir'];

  var FRANJAS_EDAD = ['18-24', '25-34', '35-44', '45-54', '55+'];

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
          'atiendenA',
          'aceptanSolteros',
          'haceColaboraciones'
        ],
        fieldHints: {
          configuracionGrupo: 'Configuración de quienes publican este perfil.',
          miembros: 'Mínimo 2 integrantes para pareja; 3 o más si eliges «Grupo».',
          reglasAcceso: 'Reglas de acceso, dress code o requisitos para contactar o visitar.',
          objetivosPerfil: 'Marca uno o varios objetivos de tu perfil.',
          tipoInteraccion: 'Categorías de interacción — sin detallar prácticas explícitas.',
          atiendenA: 'A quién reciben o con quién buscan conectar.',
          aceptanSolteros: 'Indica si aceptan personas solteras y bajo qué condiciones.',
          haceColaboraciones: 'Si colaboran con otros anunciantes en encuentros o eventos.',
          colaboraCon: 'Marca con qué tipos de anunciantes colaboran.',
          mostrarObjetivosPerfil: 'Controla si los objetivos aparecen en tarjeta y ficha pública.',
          mostrarAtiendenA: 'Controla si «Atienden a» aparece en tarjeta y ficha pública.',
          mostrarColaboraciones: 'Controla si colaboraciones se ven en tarjeta y ficha pública.',
          modalidades: 'Marca dónde se reciben o si viajan. Si marcas «Viaja», completa alcance y condiciones.'
        },
        labels: {
          alias: 'Alias de la pareja / grupo'
        }
      }
    },
    obligatorios: ['configuracionGrupo', 'miembros', 'modalidades', 'metodosPago'],
    blocks: [
      {
        id: 'parejaGrupoBase',
        title: 'Perfil pareja / grupo',
        hint: 'Datos base del perfil grupal. El alias se toma del campo superior «Alias de la pareja / grupo».',
        fields: [
          {
            id: 'configuracionGrupo',
            label: 'Configuración del grupo',
            type: 'select',
            required: true,
            options: CONFIGURACION_GRUPO.slice()
          },
          {
            id: 'miembros',
            label: 'Integrantes',
            type: 'memberList',
            required: true,
            minMembers: 2,
            minMembersGrupo: 3,
            memberFields: [
              {
                id: 'etiquetaPublica',
                label: 'Etiqueta pública',
                type: 'text',
                placeholder: 'Ej. Él, Ella, M1…',
                required: true
              },
              {
                id: 'generoPresentacion',
                label: 'Presentación',
                type: 'select',
                required: true,
                options: GENERO_PRESENTACION.slice()
              },
              {
                id: 'edad',
                label: 'Edad (años)',
                type: 'number',
                min: 18,
                max: 99,
                placeholder: '18+'
              },
              {
                id: 'franjaEdad',
                label: 'O franja de edad',
                type: 'select',
                options: [{ value: '', label: '—' }].concat(FRANJAS_EDAD.map(function (f) {
                  return { value: f, label: f + ' años' };
                }))
              }
            ]
          },
          {
            id: 'reglasAcceso',
            label: 'Reglas de acceso',
            type: 'textarea',
            required: false,
            placeholder: 'Ej. Solo mayores de edad · cita previa · dress code…',
            rows: 3
          }
        ]
      },
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
        id: 'metodosPago',
        title: 'Métodos de pago',
        hint: 'Indica cómo pueden pagarte o acordar el consumo.',
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
