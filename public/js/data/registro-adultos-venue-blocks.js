/**
 * Bloques públicos registro — negocio_venue (antro + antro_lgbt + club_sw).
 * Fuente: scripts/config-registro-adultos-schema.json (plantilla negocio_venue).
 * v1 antros (NEG-VEN-01); v2 club_sw (NEG-VEN-02) — sin cabinas/cine_xxx; sin viajes escort.
 */
(function (global) {
  'use strict';

  var OPCIONES_SI_NO = ['Sí', 'No'];

  var TIPOS_VENUE = [
    'Antro / Discoteca',
    'Restaurant Bar',
    'Bar nocturno',
    'Lounge',
    'Antro LGBT+'
  ];

  var TIPO_VENUE_CLUB = ['Club Swinger / Lifestyle'];

  var AREAS_VENUE = [
    'Pista principal',
    'Mesas VIP',
    'Bar premium',
    'Área lounge',
    'Terraza',
    'Zona fumadores',
    'Estacionamiento',
    'Valet parking'
  ];

  var AREAS_CLUB_SW = [
    'Salón principal',
    'Bar premium',
    'Área privada',
    'Lockers',
    'Terraza',
    'Valet parking',
    'Estacionamiento techado'
  ];

  var REGLAS_ACESO_OPTS = [
    'Solo mayores de edad',
    'Identificación obligatoria',
    'Dress code estricto',
    'Reservación recomendada',
    'Cover en puerta',
    'Sin armas',
    'Cero tolerancia a discriminación'
  ];

  var REGLAS_CLUB_SW = [
    'Solo mayores de edad',
    'Identificación obligatoria',
    'Registro en recepción',
    'Moderación en puerta',
    'No cámaras no autorizadas',
    'No menores',
    'Conducta respetuosa obligatoria'
  ];

  global.CARIHUB_REGISTRO_VENUE_BLOCKS = {
    id: 'negocio_venue',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_negocio_venue'],
    subcategoriaIds: ['antro', 'antro_lgbt', 'club_sw'],
    fotosMin: 6,
    obligatorios: [
      'nombreComercial',
      'tipoVenue',
      'precioEntrada',
      'cartelera',
      'horarioDetalle',
      'reglasAcceso',
      'dressCode',
      'areasVenue',
      'direccion',
      'metodosPago',
      'rfc',
      'razonSocial'
    ],
    subcategoriaOverrides: {
      club_sw: {
        obligatoriosRemove: ['cartelera'],
        obligatoriosExtra: ['eventosTematicos', 'politicaParejasSingles'],
        fieldPatches: {
          tipoVenue: {
            options: TIPO_VENUE_CLUB.slice(),
            defaultValue: 'Club Swinger / Lifestyle'
          },
          areasVenue: { options: AREAS_CLUB_SW.slice() },
          reglasAcceso: { options: REGLAS_CLUB_SW.slice() }
        }
      }
    },
    blocks: [
      {
        id: 'venuePerfil',
        title: 'Local / venue',
        hint: 'Datos públicos del venue — sin modalidades escort ni viajes.',
        fields: [
          {
            id: 'nombreComercial',
            label: 'Nombre comercial',
            type: 'text',
            required: true,
            placeholder: 'Ej. Nocturna MTY'
          },
          {
            id: 'tipoVenue',
            label: 'Tipo de venue',
            type: 'select',
            required: true,
            options: TIPOS_VENUE.slice(),
            onlySubcategorias: ['antro', 'antro_lgbt']
          },
          {
            id: 'tipoVenue',
            label: 'Tipo de venue',
            type: 'select',
            required: true,
            options: TIPO_VENUE_CLUB.slice(),
            defaultValue: 'Club Swinger / Lifestyle',
            onlySubcategorias: ['club_sw']
          },
          {
            id: 'tagline',
            label: 'Frase corta',
            type: 'text',
            required: false,
            placeholder: 'Ej. Ambiente elegante para parejas y singles'
          },
          {
            id: 'precioEntrada',
            label: 'Cover / precio de entrada desde',
            type: 'text',
            required: true,
            placeholder: 'Ej. $350 MXN'
          },
          {
            id: 'cartelera',
            label: 'Cartelera / eventos',
            type: 'textarea',
            required: true,
            rows: 3,
            placeholder: 'Ej. DJ internacional viernes · Drag show sábado',
            onlySubcategorias: ['antro', 'antro_lgbt']
          },
          {
            id: 'eventosTematicos',
            label: 'Eventos temáticos',
            type: 'textarea',
            required: true,
            rows: 3,
            placeholder: 'Ej. Noche lifestyle viernes · Fiesta temática sábado',
            onlySubcategorias: ['club_sw']
          },
          {
            id: 'politicaParejasSingles',
            label: 'Política parejas / singles',
            type: 'textarea',
            required: true,
            rows: 3,
            placeholder: 'Ej. Parejas y singles bienvenidos con previa reservación',
            onlySubcategorias: ['club_sw']
          },
          {
            id: 'dressCode',
            label: 'Dress code',
            type: 'text',
            required: true,
            placeholder: 'Ej. Elegante casual · No shorts'
          },
          {
            id: 'areasVenue',
            label: 'Áreas del local',
            type: 'checklist',
            required: true,
            options: AREAS_VENUE.slice(),
            onlySubcategorias: ['antro', 'antro_lgbt']
          },
          {
            id: 'areasVenue',
            label: 'Áreas del local',
            type: 'checklist',
            required: true,
            options: AREAS_CLUB_SW.slice(),
            onlySubcategorias: ['club_sw']
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
        id: 'ubicacionVenue',
        title: 'Ubicación pública',
        fields: [
          {
            id: 'direccion',
            label: 'Dirección o zona pública',
            type: 'textarea',
            required: true,
            rows: 3,
            placeholder: 'Ej. Centro, Monterrey — o calle y referencias públicas'
          },
          {
            id: 'zonaPublica',
            label: 'Zona / barrio (resumen tarjeta)',
            type: 'text',
            required: false,
            placeholder: 'Ej. Centro'
          }
        ]
      },
      {
        id: 'accesoVenue',
        title: 'Reglas y horario',
        fields: [
          {
            id: 'reglasAcceso',
            label: 'Reglas de acceso',
            type: 'checklist',
            required: true,
            options: REGLAS_ACESO_OPTS.slice(),
            onlySubcategorias: ['antro', 'antro_lgbt']
          },
          {
            id: 'reglasAcceso',
            label: 'Reglas de acceso',
            type: 'checklist',
            required: true,
            options: REGLAS_CLUB_SW.slice(),
            onlySubcategorias: ['club_sw']
          },
          {
            id: 'horarioDetalle',
            label: 'Horario',
            type: 'text',
            required: true,
            placeholder: 'Ej. Vie–Dom 10:00 PM – 4:00 AM'
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
            options: ['Efectivo', 'Tarjeta', 'Transferencia', 'Reservación con anticipo']
          },
          {
            id: 'sobreMi',
            label: 'Sobre el local',
            type: 'textarea',
            required: false,
            rows: 4,
            placeholder: 'Describe ambiente, música, experiencia y público…'
          }
        ]
      },
      {
        id: 'venuePrivado',
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
