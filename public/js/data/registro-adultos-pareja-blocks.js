/**
 * Bloques públicos registro — pareja_grupo (shell base + deltas swinger / cuckold_hotwife).
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
    'Conocer parejas',
    'Conocer personas',
    'Colaboraciones',
    'Eventos',
    'Todo lo anterior'
  ];

  var SWINGER_TIPO_INTERACCION = [
    'Intercambio swinger',
    'Tríos',
    'Cuartetos',
    'Reuniones privadas',
    'Eventos swinger',
    'Conocer parejas',
    'Colaboraciones',
    'A convenir'
  ];

  var SWINGER_MODALIDAD_INTERACCION = [
    'Individual',
    'Grupal',
    'Discreta',
    'Social primero',
    'A convenir'
  ];

  var SWINGER_ATIENDEN_A = ['Hombres', 'Mujeres', 'Parejas', 'Todos'];

  var SWINGER_ACEPTAN_SOLTEROS = [
    'Sí',
    'No',
    'Solo hombres',
    'Solo mujeres',
    'A convenir'
  ];

  var SWINGER_COLABORA_CON = [
    'Parejas',
    'Unicorns',
    'Hotwife',
    'Cuckold',
    'Cariñosas',
    'Lesbians',
    'Trans',
    'Femboy',
    'Tom Boy',
    'Tom Fem',
    'Singles',
    'Cualquier anunciante'
  ];

  var SWINGER_ESTILO_PAREJA = [
    'Elegante',
    'Casual',
    'Glamour',
    'Fitness',
    'Alternativo',
    'Discreto',
    'Fiesta'
  ];

  var SWINGER_EXPERIENCIA_LIFESTYLE = [
    'Primera experiencia',
    'Experimentados',
    'Comunidad lifestyle'
  ];

  var CH_DINAMICA = [
    { value: 'cuckold', label: 'Cuckold' },
    { value: 'hotwife', label: 'Hotwife' },
    { value: 'ambos', label: 'Ambos / pareja flexible' }
  ];

  var CH_BUSCAN = [
    'Bulls',
    'Hombres solteros',
    'Mujeres',
    'Parejas',
    'Parejas swinger',
    'Unicorns',
    'Hotwife',
    'Cuckold',
    'Creadores de contenido',
    'Eventos privados',
    'A convenir'
  ];

  var CH_TIPO_EXPERIENCIA = [
    'Encuentros privados',
    'Hotel / motel',
    'Eventos lifestyle',
    'Reuniones swinger',
    'Salidas sociales primero',
    'Viajes',
    'Colaboraciones',
    'Contenido',
    'A convenir'
  ];

  var CH_PARTICIPACION_PAREJA = [
    'Solo observa',
    'Participa parcialmente',
    'Participa activamente',
    'Solo coordina / acuerda',
    'A convenir'
  ];

  var CH_ACEPTAN_SOLTEROS = [
    'Sí',
    'No',
    'Solo hombres',
    'Solo mujeres',
    'A convenir'
  ];

  var CH_EXPERIENCIA_LIFESTYLE = [
    'Primera experiencia',
    'Intermedio',
    'Experimentados',
    'Comunidad lifestyle'
  ];

  var CH_COLABORA_CON = [
    'Parejas swinger',
    'Unicorns',
    'Hotwife',
    'Cuckold',
    'Creadores de contenido',
    'Modelos',
    'A convenir'
  ];

  global.CARIHUB_REGISTRO_PAREJA_BLOCKS = {
    id: 'pareja_grupo',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_pareja'],
    subcategoriaIds: ['swinger', 'cuckold hotwife', 'cuckold_hotwife'],
    fotosMin: 4,
    subcategoriaOverrides: {
      swinger: {
        obligatoriosExtra: [
          'objetivosPerfil',
          'intercambioSwinger',
          'tipoInteraccion',
          'modalidadInteraccion',
          'atiendenA',
          'haceColaboraciones'
        ],
        fieldHints: {
          configuracionGrupo: 'Configuración de quienes publican este perfil.',
          miembros: 'Mínimo 2 integrantes para pareja; 3 o más si eliges «Grupo».',
          reglasAcceso: 'Reglas de acceso generales (máx. 500 caracteres).',
          objetivosPerfil: 'Marca uno o varios objetivos — servicios, conocer parejas, eventos, etc.',
          intercambioSwinger: 'Indica si realizan intercambio swinger.',
          tipoInteraccion: 'Qué buscan o qué tipo de experiencia ofrecen.',
          modalidadInteraccion: 'Cómo prefieren que sea la interacción.',
          atiendenA: 'A quién reciben o con quién buscan conectar.',
          aceptanSolteros: 'Opcional — ayuda a filtrar contactos.',
          haceColaboraciones: 'Si colaboran con otros anunciantes en encuentros o eventos.',
          colaboraCon: 'Obligatorio si respondiste Sí; opcional si es A convenir.',
          estiloPareja: 'Opcional — estilo general de la pareja.',
          mostrarObjetivosPerfil: 'Controla si el objetivo principal aparece en tarjeta y ficha.',
          mostrarAtiendenA: 'Controla si «Atienden a» aparece en tarjeta y ficha.',
          mostrarColaboraciones: 'Controla si colaboraciones se ven en tarjeta y ficha.',
          modalidades: 'Marca dónde se reciben o si viajan. Si marcas «Viaja», completa alcance y condiciones.'
        },
        labels: {
          alias: 'Alias de la pareja / grupo'
        }
      },
      'cuckold hotwife': {
        obligatoriosExtra: [
          'dinamica',
          'buscan',
          'tipoExperiencia',
          'participacionPareja'
        ],
        fieldHints: {
          configuracionGrupo: 'Configuración de quienes publican este perfil.',
          miembros: 'Mínimo 2 integrantes para pareja; 3 o más si eliges «Grupo».',
          reglasAcceso: 'Reglas de acceso generales (máx. 500 caracteres).',
          dinamica: 'Indica la dinámica principal de la pareja.',
          buscan: 'Tipo de personas o entornos con los que buscan conectar (sin prácticas explícitas).',
          tipoExperiencia: 'Qué tipo de experiencias o contextos les interesan.',
          participacionPareja: 'Cómo participa el cónyuge no activo en la dinámica.',
          aceptanSolteros: 'Opcional — ayuda a filtrar contactos.',
          aceptanPrincipiantes: 'Opcional — si reciben parejas o personas nuevas en el ambiente.',
          experienciaEnLifestyle: 'Opcional — nivel de experiencia en lifestyle.',
          haceColaboraciones: 'Si colaboran con otros anunciantes en encuentros o eventos.',
          colaboraCon: 'Obligatorio si respondiste Sí.',
          mostrarBuscan: 'Controla si «Buscan» aparece en tarjeta y ficha.',
          mostrarParticipacion: 'Controla si la participación de la pareja aparece en tarjeta y ficha.',
          mostrarColaboraciones: 'Controla si colaboraciones se ven en tarjeta y ficha.',
          modalidades: 'Marca dónde se reciben o si viajan. Si marcas «Viaja», completa alcance y condiciones.'
        },
        labels: {
          alias: 'Alias de la pareja / grupo'
        }
      },
      cuckold_hotwife: {
        obligatoriosExtra: [
          'dinamica',
          'buscan',
          'tipoExperiencia',
          'participacionPareja'
        ],
        fieldHints: {
          configuracionGrupo: 'Configuración de quienes publican este perfil.',
          miembros: 'Mínimo 2 integrantes para pareja; 3 o más si eliges «Grupo».',
          reglasAcceso: 'Reglas de acceso generales (máx. 500 caracteres).',
          dinamica: 'Indica la dinámica principal de la pareja.',
          buscan: 'Tipo de personas o entornos con los que buscan conectar (sin prácticas explícitas).',
          tipoExperiencia: 'Qué tipo de experiencias o contextos les interesan.',
          participacionPareja: 'Cómo participa el cónyuge no activo en la dinámica.',
          aceptanSolteros: 'Opcional — ayuda a filtrar contactos.',
          aceptanPrincipiantes: 'Opcional — si reciben parejas o personas nuevas en el ambiente.',
          experienciaEnLifestyle: 'Opcional — nivel de experiencia en lifestyle.',
          haceColaboraciones: 'Si colaboran con otros anunciantes en encuentros o eventos.',
          colaboraCon: 'Obligatorio si respondiste Sí.',
          mostrarBuscan: 'Controla si «Buscan» aparece en tarjeta y ficha.',
          mostrarParticipacion: 'Controla si la participación de la pareja aparece en tarjeta y ficha.',
          mostrarColaboraciones: 'Controla si colaboraciones se ven en tarjeta y ficha.',
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
            maxMembers: 2,
            maxMembersGrupo: 8,
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
            rows: 3,
            maxLength: 500
          }
        ]
      },
      {
        id: 'swingerPerfil',
        title: 'Perfil pareja swinger',
        hint: 'Datos específicos swinger. Usa categorías generales, no prácticas explícitas.',
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
            id: 'intercambioSwinger',
            label: 'Intercambio swinger',
            type: 'select',
            required: true,
            options: OPCIONES_SI_NO_CONVENIR.slice()
          },
          {
            id: 'tipoInteraccion',
            label: 'Tipo de interacción (qué buscan)',
            type: 'checklist',
            required: true,
            options: SWINGER_TIPO_INTERACCION.slice()
          },
          {
            id: 'modalidadInteraccion',
            label: 'Modalidad de interacción (cómo prefieren)',
            type: 'checklist',
            required: true,
            options: SWINGER_MODALIDAD_INTERACCION.slice()
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
            required: false,
            options: SWINGER_ACEPTAN_SOLTEROS.slice()
          },
          {
            id: 'aceptanParejasPrincipiantes',
            label: '¿Reciben parejas principiantes?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_CONVENIR.slice()
          },
          {
            id: 'experienciaEnLifestyle',
            label: 'Experiencia en el ambiente lifestyle',
            type: 'select',
            required: false,
            options: SWINGER_EXPERIENCIA_LIFESTYLE.slice()
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
            showWhen: { field: 'haceColaboraciones', values: ['Sí', 'A convenir'] },
            options: SWINGER_COLABORA_CON.slice()
          },
          {
            id: 'estiloPareja',
            label: 'Estilo de pareja',
            type: 'checklist',
            required: false,
            options: SWINGER_ESTILO_PAREJA.slice()
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
            label: '¿Mostrar objetivo del perfil en tarjeta y perfil?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          }
        ]
      },
      {
        id: 'cuckoldHotwifePerfil',
        title: 'Perfil Cuckold / Hotwife',
        hint: 'Datos específicos de la dinámica. Usa categorías generales, no prácticas explícitas.',
        onlySubcategorias: ['cuckold hotwife', 'cuckold_hotwife'],
        fields: [
          {
            id: 'dinamica',
            label: 'Dinámica',
            type: 'select',
            required: true,
            options: CH_DINAMICA.slice()
          },
          {
            id: 'buscan',
            label: 'Buscan',
            type: 'checklist',
            required: true,
            options: CH_BUSCAN.slice()
          },
          {
            id: 'mostrarBuscan',
            label: '¿Mostrar «Buscan» en tarjeta y perfil?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'tipoExperiencia',
            label: 'Tipo de experiencia',
            type: 'checklist',
            required: true,
            options: CH_TIPO_EXPERIENCIA.slice()
          },
          {
            id: 'participacionPareja',
            label: 'Participación de la pareja',
            type: 'select',
            required: true,
            options: CH_PARTICIPACION_PAREJA.slice()
          },
          {
            id: 'mostrarParticipacion',
            label: '¿Mostrar participación de la pareja en tarjeta y perfil?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'aceptanSolteros',
            label: '¿Aceptan personas solteras?',
            type: 'select',
            required: false,
            options: CH_ACEPTAN_SOLTEROS.slice()
          },
          {
            id: 'aceptanPrincipiantes',
            label: '¿Reciben principiantes?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_CONVENIR.slice()
          },
          {
            id: 'experienciaEnLifestyle',
            label: 'Experiencia en el ambiente lifestyle',
            type: 'select',
            required: false,
            options: CH_EXPERIENCIA_LIFESTYLE.slice()
          },
          {
            id: 'haceColaboraciones',
            label: '¿Realizan colaboraciones?',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_CONVENIR.slice()
          },
          {
            id: 'colaboraCon',
            label: 'Colaboran con',
            type: 'checklist',
            required: false,
            showWhen: { field: 'haceColaboraciones', values: ['Sí'] },
            options: CH_COLABORA_CON.slice()
          },
          {
            id: 'mostrarColaboraciones',
            label: '¿Mostrar colaboraciones en tarjeta y perfil?',
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
