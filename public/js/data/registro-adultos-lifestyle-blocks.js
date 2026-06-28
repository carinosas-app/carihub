/**
 * Bloques públicos registro — persona_lifestyle (v1: unicorns).
 * Infraestructura compartible con lifestyle pareja (fases posteriores).
 */
(function (global) {
  'use strict';

  var OPCIONES_SI_NO = ['Sí', 'No'];
  var OPCIONES_SI_NO_CONVENIR = ['Sí', 'No', 'A convenir'];

  var UNICORN_OBJETIVOS = [
    'Ofrecer servicios',
    'Conocer parejas',
    'Conocer personas',
    'Colaboraciones',
    'Eventos privados',
    'Eventos Swinger',
    'Viajes',
    'Todo lo anterior'
  ];

  var UNICORN_TIPO = ['Mujer', 'Hombre', 'Persona no binaria'];

  var UNICORN_BUSCO_CONOCER = ['Parejas', 'Mujeres', 'Hombres', 'Todos'];

  var UNICORN_TIPO_PAREJA = [
    'Hombre + Mujer',
    'Mujer + Mujer',
    'Hombre + Hombre',
    'Cualquier pareja'
  ];

  var UNICORN_FINALIDAD = [
    'Socializar',
    'Amistad',
    'Citas',
    'Colaboraciones',
    'Eventos privados',
    'A convenir'
  ];

  var UNICORN_COLABORA_CON = [
    'Parejas Swinger',
    'Hotwife',
    'Cuckold',
    'Cariñosas',
    'Lesbians',
    'Femboy',
    'Tom Boy',
    'Tom Fem',
    'Trans',
    'Gigoló',
    'Dotados',
    'Singles',
    'Modelos',
    'Edecanes',
    'Cualquier anunciante'
  ];

  var UNICORN_EXPERIENCIA = ['Principiante', 'Intermedio', 'Experimentado'];

  var UNICORN_AMBIENTE = [
    'Hotel',
    'Casa privada',
    'Club',
    'Evento',
    'Viajes',
    'A convenir'
  ];

  var UNICORN_ESTILO = [
    'Elegante',
    'Casual',
    'Glamour',
    'Fitness',
    'Deportivo',
    'Alternativo',
    'Discreto',
    'Urbano'
  ];

  var UNICORN_ESTADO_PERFIL = [
    'Solo amistades',
    'Solo conocer parejas',
    'Disponible para encuentros',
    'Disponible para colaboraciones',
    'Disponible para eventos',
    'Disponible para viajes'
  ];

  var LIFESTYLE_SERVICIOS = [
    'Acompañamiento social',
    'Citas con parejas',
    'Eventos privados',
    'Eventos swinger',
    'Viajes compartidos',
    'Colaboraciones',
    'A convenir'
  ];

  global.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS = {
    id: 'persona_lifestyle',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_lifestyle'],
    subcategoriaIds: ['unicorns'],
    fotosMin: 3,
    subcategoriaOverrides: {
      unicorns: {
        badges: ['unicorn'],
        obligatoriosExtra: [
          'objetivosPerfil',
          'tipoUnicornio',
          'buscoConocer',
          'haceColaboraciones',
          'estadoPerfil'
        ],
        fieldHints: {
          objetivosPerfil: 'Marca uno o varios objetivos — ayuda a entender qué buscas.',
          tipoUnicornio: 'Tu presentación como unicornio.',
          buscoConocer: 'Indica a quién te gustaría conocer.',
          tipoParejaPreferida: 'Tipos de pareja con los que te interesa conectar (opcional).',
          finalidadEncuentro: 'Qué tipo de encuentros o vínculos buscas.',
          haceColaboraciones: 'Si colaboras con otros anunciantes.',
          colaboraCon: 'Con quién colaboras (solo si respondiste Sí).',
          mostrarColaboraciones: 'Controla si colaboraciones se ven en tarjeta y ficha.',
          experiencia: 'Nivel de experiencia lifestyle — expectativas realistas.',
          ambientePreferido: 'Ambientes donde te sientes más cómodo/a.',
          estilo: 'Tu estética o estilo de presentación.',
          estadoPerfil: 'Qué buscas actualmente — puedes cambiarlo con el tiempo.',
          mostrarObjetivosPerfil: 'Controla si los objetivos aparecen en tarjeta y ficha.',
          modalidades: 'Marca dónde te encuentras o si viajas. Si marcas «Viaja», completa alcance abajo.',
          serviciosLifestyle: 'Resumen de lo que ofreces (categorías generales).'
        }
      }
    },
    obligatorios: ['modalidades', 'metodosPago'],
    blocks: [
      {
        id: 'unicornPerfil',
        title: 'Perfil unicornio',
        hint: 'Datos lifestyle — categorías generales, sin prácticas explícitas.',
        onlySubcategorias: ['unicorns'],
        fields: [
          {
            id: 'objetivosPerfil',
            label: 'Objetivo del perfil',
            type: 'checklist',
            required: true,
            options: UNICORN_OBJETIVOS.slice()
          },
          {
            id: 'mostrarObjetivosPerfil',
            label: '¿Mostrar objetivos en tarjeta y perfil?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'tipoUnicornio',
            label: 'Tipo de unicornio',
            type: 'select',
            required: true,
            options: UNICORN_TIPO.slice()
          },
          {
            id: 'buscoConocer',
            label: 'Busco conocer',
            type: 'checklist',
            required: true,
            options: UNICORN_BUSCO_CONOCER.slice()
          },
          {
            id: 'tipoParejaPreferida',
            label: 'Tipo de pareja preferida',
            type: 'checklist',
            required: false,
            options: UNICORN_TIPO_PAREJA.slice()
          },
          {
            id: 'finalidadEncuentro',
            label: 'Finalidad del encuentro',
            type: 'checklist',
            required: false,
            options: UNICORN_FINALIDAD.slice()
          },
          {
            id: 'estadoPerfil',
            label: '¿Qué buscas actualmente?',
            type: 'select',
            required: true,
            options: UNICORN_ESTADO_PERFIL.slice()
          },
          {
            id: 'haceColaboraciones',
            label: 'Disponibilidad para colaboraciones',
            type: 'select',
            required: true,
            options: OPCIONES_SI_NO_CONVENIR.slice()
          },
          {
            id: 'colaboraCon',
            label: 'Colaboro con',
            type: 'checklist',
            required: false,
            showWhen: { field: 'haceColaboraciones', values: ['Sí'] },
            options: UNICORN_COLABORA_CON.slice()
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
            id: 'experiencia',
            label: 'Experiencia',
            type: 'select',
            required: false,
            options: UNICORN_EXPERIENCIA.slice()
          },
          {
            id: 'ambientePreferido',
            label: 'Ambiente preferido',
            type: 'checklist',
            required: false,
            options: UNICORN_AMBIENTE.slice()
          },
          {
            id: 'estilo',
            label: 'Estilo',
            type: 'select',
            required: false,
            options: UNICORN_ESTILO.slice()
          }
        ]
      },
      {
        id: 'perfilDetalle',
        title: 'Detalle público',
        hint: 'Idiomas y presentación complementaria.',
        fields: [
          {
            id: 'idiomas',
            label: 'Idiomas',
            type: 'text',
            required: false,
            placeholder: 'Ej. Español, Inglés'
          }
        ]
      },
      {
        id: 'modalidades',
        title: 'Modalidad de encuentros',
        hint: 'Marca dónde te encuentras o si viajas. Si marcas «Viaja», indica alcance y condiciones.',
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
        id: 'serviciosLifestyle',
        title: 'Servicios',
        hint: 'Categorías generales de lo que ofreces (opcional).',
        fields: [
          {
            id: 'serviciosLifestyle',
            label: 'Servicios lifestyle',
            type: 'checklist',
            required: false,
            options: LIFESTYLE_SERVICIOS.slice()
          }
        ]
      },
      {
        id: 'metodosPago',
        title: 'Métodos de pago',
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
        fields: [
          {
            id: 'sobreMi',
            label: 'Biografía',
            type: 'textarea',
            required: false,
            placeholder: 'Descríbete: quién eres, qué buscas y qué te hace diferente…',
            rows: 4
          }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
