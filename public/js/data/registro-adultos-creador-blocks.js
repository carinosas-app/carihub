/**
 * Bloques públicos registro — persona_creador (contenido).
 * Fuente: scripts/config-registro-adultos-schema.json (plantilla persona_creador).
 * v1: perfil digital — sin viajes ni modalidades escort.
 */
(function (global) {
  'use strict';

  var OPCIONES_SI_NO = ['Sí', 'No'];
  var OPCIONES_SI_NO_ACUERDO = ['Sí', 'No', 'A convenir'];

  var TIPOS_CONTENIDO = [
    'Fotos exclusivas',
    'Videos',
    'Lives privados',
    'Mensajes directos',
    'Contenido personalizado',
    'Sets temáticos',
    'PPV (pago por view)',
    'Suscripción mensual',
    'Contenido fitness / lifestyle',
    'Q&A con suscriptores'
  ];

  var PLATAFORMAS = [
    'OnlyFans',
    'Fansly',
    'Telegram VIP',
    'Instagram',
    'X (Twitter)',
    'Patreon',
    'JustForFans',
    'Sitio propio',
    'Otra plataforma'
  ];

  var PAQUETES_CONTENIDO = [
    'Suscripción mensual',
    'Suscripción trimestral',
    'Pack VIP',
    'PPV individual',
    'Bundle promocional',
    'Prueba / trial limitado'
  ];

  var SERVICIOS_INCLUIDOS = [
    'Suscripción mensual',
    'Contenido exclusivo',
    'Lives privados',
    'Mensajes directos',
    'Contenido personalizado bajo pedido',
    'Fotos HD',
    'Videos semanales',
    'Acceso anticipado'
  ];

  var NO_REALIZA_CREADOR = [
    'Encuentros presenciales',
    'Servicios escort / sexuales',
    'Menores de edad',
    'Grabaciones no autorizadas',
    'Contenido ilegal',
    'Compartir datos privados de suscriptores'
  ];

  global.CARIHUB_REGISTRO_CREADOR_BLOCKS = {
    id: 'persona_creador',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_creador'],
    subcategoriaIds: ['contenido'],
    fotosMin: 4,
    obligatorios: [
      'tiposContenido',
      'plataformas',
      'redesSociales',
      'precioSuscripcion',
      'serviciosIncluidos',
      'serviciosNoRealizo',
      'horarioDetalle',
      'metodosPago'
    ],
    blocks: [
      {
        id: 'creadorPerfil',
        title: 'Perfil de creador(a)',
        hint: 'Contenido digital y plataformas — sin modalidades escort ni viajes.',
        fields: [
          {
            id: 'tiposContenido',
            label: 'Tipos de contenido',
            type: 'checklist',
            required: true,
            options: TIPOS_CONTENIDO.slice()
          },
          {
            id: 'plataformas',
            label: 'Plataformas',
            type: 'checklist',
            required: true,
            options: PLATAFORMAS.slice()
          },
          {
            id: 'precioSuscripcion',
            label: 'Precio suscripción / desde',
            type: 'text',
            required: true,
            placeholder: 'Ej. $299 MXN / mes'
          },
          {
            id: 'contenidoPersonalizado',
            label: '¿Ofreces contenido personalizado?',
            type: 'select',
            required: false,
            defaultValue: 'A convenir',
            options: OPCIONES_SI_NO_ACUERDO.slice()
          },
          {
            id: 'paquetesContenido',
            label: 'Paquetes / tiers',
            type: 'checklist',
            required: false,
            options: PAQUETES_CONTENIDO.slice()
          },
          {
            id: 'colaboracionesCreador',
            label: 'Colaboraciones con otros creadores',
            type: 'select',
            required: false,
            options: OPCIONES_SI_NO_ACUERDO.slice()
          }
        ]
      },
      {
        id: 'redesCreador',
        title: 'Redes y enlaces públicos',
        fields: [
          {
            id: 'redesSociales',
            label: 'Enlaces públicos (uno por línea)',
            type: 'textarea',
            required: true,
            rows: 4,
            placeholder: 'https://onlyfans.com/tuusuario\nhttps://instagram.com/tuusuario'
          },
          {
            id: 'mostrarPlataformasPublico',
            label: '¿Mostrar plataformas en tarjeta y perfil?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          }
        ]
      },
      {
        id: 'serviciosCreador',
        title: 'Servicios y reglas',
        fields: [
          {
            id: 'serviciosIncluidos',
            label: 'Qué incluye tu suscripción / contenido',
            type: 'checklist',
            required: true,
            options: SERVICIOS_INCLUIDOS.slice()
          },
          {
            id: 'serviciosNoRealizo',
            label: 'No incluido / reglas',
            type: 'checklist',
            required: true,
            options: NO_REALIZA_CREADOR.slice()
          }
        ]
      },
      {
        id: 'agendaCreador',
        title: 'Disponibilidad y pago',
        fields: [
          {
            id: 'horarioDetalle',
            label: 'Frecuencia / actualizaciones',
            type: 'text',
            required: true,
            placeholder: 'Ej. Publico diario · lives semanales'
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
            options: ['Pago en línea', 'Transferencia', 'Tarjeta', 'Efectivo', 'Cripto']
          },
          {
            id: 'sobreMi',
            label: 'Sobre mí',
            type: 'textarea',
            required: false,
            rows: 4,
            placeholder: 'Enfoque, estilo de contenido y qué esperar como suscriptor…'
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
