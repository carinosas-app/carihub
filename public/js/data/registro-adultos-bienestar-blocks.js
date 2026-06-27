/**
 * Bloques públicos registro — negocio_bienestar (spa + masajes v1).
 * Fuente: scripts/config-registro-adultos-schema.json (plantilla negocio_bienestar).
 * v1: locales con dirección — sin viajes, sin modalidades escort, sin masajista independiente.
 */
(function (global) {
  'use strict';

  var OPCIONES_SI_NO = ['Sí', 'No'];

  var TIPOS_BIENESTAR = [
    'Spa / centro de bienestar',
    'Centro de masajes'
  ];

  var AMENIDADES_SPA = [
    'Jacuzzi',
    'Sauna',
    'Baño de vapor',
    'Cabinas privadas',
    'Masajes en pareja',
    'Aromaterapia',
    'Estacionamiento',
    'Aire acondicionado',
    'Música ambiental',
    'Toallas y amenidades'
  ];

  var AMENIDADES_MASAJES = [
    'Cabinas privadas',
    'Aromaterapia',
    'Música ambiental',
    'Estacionamiento',
    'Aire acondicionado',
    'Reservación previa',
    'Aceites premium',
    'Masaje en pareja'
  ];

  var SERVICIOS_SPA = [
    'Masaje relajante',
    'Masaje terapéutico',
    'Masaje en pareja',
    'Circuito hidroterapia',
    'Facial / cuidado corporal',
    'Paquetes día spa',
    'Aromaterapia',
    'Facturación bajo solicitud'
  ];

  var SERVICIOS_MASAJES = [
    'Masaje relajante 60 min',
    'Masaje deportivo 60 min',
    'Masaje en pareja 90 min',
    'Piedras calientes',
    'Aromaterapia',
    'Aceites premium',
    'Toallas y amenidades',
    'Facturación bajo solicitud'
  ];

  var POLITICAS_NO = [
    'Menores de edad',
    'Sin reservación (donde aplique)',
    'Servicios fuera del menú',
    'Conducta inapropiada',
    'Grabaciones no autorizadas',
    'Atención sin local físico'
  ];

  global.CARIHUB_REGISTRO_BIENESTAR_BLOCKS = {
    id: 'negocio_bienestar',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_negocio_bienestar'],
    subcategoriaIds: ['spa', 'masajes'],
    fotosMin: 5,
    subcategoriaOverrides: {
      spa: {
        obligatoriosExtra: ['amenidades']
      },
      masajes: {
        obligatoriosExtra: ['serviciosIncluidos', 'serviciosNoRealizo']
      }
    },
    obligatorios: [
      'nombreComercial',
      'tipoBienestar',
      'menuServicios',
      'precioDesde',
      'direccion',
      'horarioDetalle',
      'metodosPago',
      'rfc',
      'razonSocial'
    ],
    blocks: [
      {
        id: 'bienestarPerfil',
        title: 'Local / bienestar',
        hint: 'Datos públicos del negocio — solo local con dirección; sin modalidades escort ni viajes.',
        fields: [
          {
            id: 'nombreComercial',
            label: 'Nombre comercial',
            type: 'text',
            required: true,
            placeholder: 'Ej. Zen Spa MTY'
          },
          {
            id: 'tipoBienestar',
            label: 'Tipo de negocio',
            type: 'select',
            required: true,
            options: TIPOS_BIENESTAR.slice()
          },
          {
            id: 'tagline',
            label: 'Frase corta',
            type: 'text',
            required: false,
            placeholder: 'Ej. Relajación, parejas y cabinas privadas'
          },
          {
            id: 'menuServicios',
            label: 'Menú de servicios',
            type: 'textarea',
            required: true,
            rows: 3,
            placeholder: 'Ej. Relajante · Deportivo · Pareja · Circuito spa'
          },
          {
            id: 'precioDesde',
            label: 'Precio desde',
            type: 'text',
            required: true,
            placeholder: 'Ej. $650 MXN'
          },
          {
            id: 'amenidades',
            label: 'Amenidades',
            type: 'checklist',
            required: false,
            onlySubcategorias: ['spa'],
            options: AMENIDADES_SPA.slice()
          },
          {
            id: 'amenidades',
            label: 'Amenidades del local',
            type: 'checklist',
            required: false,
            onlySubcategorias: ['masajes'],
            options: AMENIDADES_MASAJES.slice()
          },
          {
            id: 'reservaciones',
            label: '¿Acepta reservaciones?',
            type: 'select',
            required: false,
            defaultValue: 'Sí',
            options: OPCIONES_SI_NO.slice()
          }
        ]
      },
      {
        id: 'ubicacionBienestar',
        title: 'Ubicación pública',
        fields: [
          {
            id: 'direccion',
            label: 'Dirección o zona pública',
            type: 'textarea',
            required: true,
            rows: 3,
            placeholder: 'Ej. Valle Oriente, Monterrey — o calle y referencias públicas'
          },
          {
            id: 'zonaPublica',
            label: 'Zona / barrio (resumen tarjeta)',
            type: 'text',
            required: false,
            placeholder: 'Ej. Valle Oriente'
          }
        ]
      },
      {
        id: 'serviciosBienestar',
        title: 'Servicios y políticas',
        fields: [
          {
            id: 'serviciosIncluidos',
            label: 'Servicios incluidos',
            type: 'checklist',
            required: false,
            onlySubcategorias: ['spa'],
            options: SERVICIOS_SPA.slice()
          },
          {
            id: 'serviciosIncluidos',
            label: 'Servicios incluidos',
            type: 'checklist',
            required: false,
            onlySubcategorias: ['masajes'],
            options: SERVICIOS_MASAJES.slice()
          },
          {
            id: 'serviciosNoRealizo',
            label: 'No incluye / reglas',
            type: 'checklist',
            required: false,
            options: POLITICAS_NO.slice()
          }
        ]
      },
      {
        id: 'agendaBienestar',
        title: 'Horario y pago',
        fields: [
          {
            id: 'horarioDetalle',
            label: 'Horario',
            type: 'text',
            required: true,
            placeholder: 'Ej. Lun–Dom 10:00 AM – 10:00 PM'
          },
          {
            id: 'disponibilidad',
            label: 'Estado del local',
            type: 'select',
            required: false,
            options: [
              { value: 'disponible', label: 'Abierto ahora' },
              { value: 'ocupada', label: 'Cerrado temporalmente' },
              { value: 'con_cita', label: 'Solo con reservación' }
            ]
          },
          {
            id: 'metodosPago',
            label: 'Métodos de pago',
            type: 'checklist',
            required: true,
            options: ['Efectivo', 'Tarjeta', 'Transferencia', 'Pago en línea']
          },
          {
            id: 'sobreMi',
            label: 'Sobre el local',
            type: 'textarea',
            required: false,
            rows: 4,
            placeholder: 'Describe ambiente, menú, terapeutas y experiencia…'
          }
        ]
      },
      {
        id: 'bienestarPrivado',
        title: 'Datos privados del negocio',
        hint: 'No se publican en tarjeta ni perfil público.',
        fields: [
          {
            id: 'rfc',
            label: 'RFC',
            type: 'text',
            required: true,
            placeholder: 'RFC del negocio'
          },
          {
            id: 'razonSocial',
            label: 'Razón social',
            type: 'text',
            required: true,
            placeholder: 'Razón social registrada'
          },
          {
            id: 'telefonoContacto',
            label: 'Teléfono privado / administración',
            type: 'text',
            required: false,
            placeholder: 'Solo uso interno y verificación'
          },
          {
            id: 'licenciaOperacion',
            label: 'Licencia / permiso (referencia)',
            type: 'text',
            required: false,
            placeholder: 'Número o folio de licencia'
          },
          {
            id: 'documentos',
            label: 'Documentos (referencia interna)',
            type: 'text',
            required: false,
            placeholder: 'Folio o nota de documentación cargada'
          },
          {
            id: 'notasInternas',
            label: 'Notas internas',
            type: 'textarea',
            required: false,
            rows: 3,
            placeholder: 'Observaciones para revisión admin (no públicas)'
          }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
