/**
 * Bloques públicos registro — negocio_hospedaje (hotel_motel v1).
 * Fuente: scripts/config-registro-adultos-schema.json (plantilla negocio_hospedaje).
 * v1: hotel/motel unificados — sin viajes, sin modalidades escort.
 */
(function (global) {
  'use strict';

  var OPCIONES_SI_NO = ['Sí', 'No'];

  var TIPOS_HOSPEDAJE = [
    'Hotel',
    'Motel',
    'Hotel y motel'
  ];

  var TIPOS_HABITACION = [
    'Estándar',
    'Suite jacuzzi',
    'Master suite',
    'Temática romántica',
    'Temática premium',
    'Habitación por horas',
    'Suite noche completa'
  ];

  var AMENIDADES_HOSPEDAJE = [
    'Jacuzzi en habitación',
    'Room service',
    'WiFi',
    'TV por cable',
    'Aire acondicionado',
    'Aromaterapia',
    'Minibar',
    'Toallas y amenidades'
  ];

  var REGLAS_ESTANCIA = [
    'Solo mayores de edad',
    'Identificación obligatoria',
    'Check-in con reservación',
    'Check-out puntual',
    'No menores',
    'No drogas',
    'No armas',
    'Facturación bajo solicitud'
  ];

  var ESTACIONAMIENTO_OPTS = [
    'Sin estacionamiento',
    'Estacionamiento público cercano',
    'Estacionamiento techado',
    'Cochera privada',
    'Acceso directo a habitación',
    'Valet parking'
  ];

  var PRIVACIDAD_OPTS = [
    'Entrada discreta',
    'Cochera privada',
    'Sin ventanas exteriores',
    'Registro mínimo en recepción',
    'Acceso 24 horas',
    'Discreción garantizada'
  ];

  global.CARIHUB_REGISTRO_HOSPEDAJE_BLOCKS = {
    id: 'negocio_hospedaje',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_negocio_hospedaje'],
    subcategoriaIds: ['hotel_motel'],
    fotosMin: 6,
    obligatorios: [
      'nombreComercial',
      'tipoHospedaje',
      'tiposHabitacion',
      'tarifaHora',
      'direccion',
      'horarioDetalle',
      'reglasEstancia',
      'metodosPago',
      'rfc',
      'razonSocial'
    ],
    blocks: [
      {
        id: 'hospedajePerfil',
        title: 'Hotel / motel',
        hint: 'Datos públicos del hospedaje — sin modalidades escort ni viajes.',
        fields: [
          {
            id: 'nombreComercial',
            label: 'Nombre comercial',
            type: 'text',
            required: true,
            placeholder: 'Ej. Motel Cariñoso GDL'
          },
          {
            id: 'tipoHospedaje',
            label: 'Tipo de hospedaje',
            type: 'select',
            required: true,
            options: TIPOS_HOSPEDAJE.slice()
          },
          {
            id: 'tagline',
            label: 'Frase corta',
            type: 'text',
            required: false,
            placeholder: 'Ej. Discreción, confort y habitaciones temáticas'
          },
          {
            id: 'tiposHabitacion',
            label: 'Tipos de habitación',
            type: 'checklist',
            required: true,
            options: TIPOS_HABITACION.slice()
          },
          {
            id: 'tarifaHora',
            label: 'Tarifa por hora desde',
            type: 'text',
            required: true,
            placeholder: 'Ej. $450 MXN / hora'
          },
          {
            id: 'tarifaNoche',
            label: 'Tarifa por noche desde',
            type: 'text',
            required: false,
            placeholder: 'Ej. $1,200 MXN / noche'
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
        id: 'ubicacionHospedaje',
        title: 'Ubicación pública',
        fields: [
          {
            id: 'direccion',
            label: 'Dirección o zona pública',
            type: 'textarea',
            required: true,
            rows: 3,
            placeholder: 'Ej. Providencia, Guadalajara — o calle y referencias públicas'
          },
          {
            id: 'zonaPublica',
            label: 'Zona / barrio (resumen tarjeta)',
            type: 'text',
            required: false,
            placeholder: 'Ej. Providencia'
          },
          {
            id: 'mostrarDireccionExacta',
            label: '¿Mostrar dirección exacta en perfil público?',
            type: 'select',
            required: false,
            defaultValue: 'No',
            options: OPCIONES_SI_NO.slice()
          }
        ]
      },
      {
        id: 'serviciosHospedaje',
        title: 'Amenidades, privacidad y reglas',
        fields: [
          {
            id: 'amenidades',
            label: 'Amenidades',
            type: 'checklist',
            required: false,
            options: AMENIDADES_HOSPEDAJE.slice()
          },
          {
            id: 'estacionamiento',
            label: 'Estacionamiento',
            type: 'select',
            required: false,
            options: ESTACIONAMIENTO_OPTS.slice()
          },
          {
            id: 'privacidadDiscrecion',
            label: 'Privacidad / discreción',
            type: 'checklist',
            required: false,
            options: PRIVACIDAD_OPTS.slice()
          },
          {
            id: 'reglasEstancia',
            label: 'Reglas de estancia',
            type: 'checklist',
            required: true,
            options: REGLAS_ESTANCIA.slice()
          }
        ]
      },
      {
        id: 'agendaHospedaje',
        title: 'Horario y pago',
        fields: [
          {
            id: 'horarioDetalle',
            label: 'Horario',
            type: 'text',
            required: true,
            placeholder: 'Ej. Abierto 24 horas'
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
            label: 'Sobre el establecimiento',
            type: 'textarea',
            required: false,
            rows: 4,
            placeholder: 'Describe habitaciones, limpieza, discreción y experiencia…'
          }
        ]
      },
      {
        id: 'hospedajePrivado',
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
