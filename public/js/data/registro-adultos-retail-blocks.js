/**
 * Bloques públicos registro — negocio_retail (sex_shop v1).
 * Fuente: scripts/config-registro-adultos-schema.json (plantilla negocio_retail).
 * v1: tienda retail — sin viajes ni modalidades escort.
 */
(function (global) {
  'use strict';

  var OPCIONES_SI_NO = ['Sí', 'No'];

  var CATEGORIAS_PRODUCTO = [
    'Lencería',
    'Juguetes',
    'Lubricantes',
    'Accesorios',
    'BDSM / fetish retail',
    'Preservativos',
    'Lubricantes y cuidado',
    'Paquetes regalo',
    'Productos importados',
    'Asesoría en tienda'
  ];

  var POLITICAS_NO = [
    'Venta a menores',
    'Productos no certificados',
    'Cambios sin ticket',
    'Devoluciones sin empaque original',
    'Contenido ilegal'
  ];

  global.CARIHUB_REGISTRO_RETAIL_BLOCKS = {
    id: 'negocio_retail',
    formularioId: 'adultos',
    uiIds: ['ui_adulto_negocio_retail'],
    subcategoriaIds: ['sex_shop'],
    fotosMin: 5,
    obligatorios: [
      'nombreComercial',
      'categoriasProducto',
      'direccion',
      'horarioDetalle',
      'metodosPago',
      'precioDesde',
      'serviciosIncluidos',
      'serviciosNoRealizo'
    ],
    blocks: [
      {
        id: 'retailPerfil',
        title: 'Tienda / catálogo',
        hint: 'Productos y canales de venta — sin modalidades escort ni viajes.',
        fields: [
          {
            id: 'nombreComercial',
            label: 'Nombre comercial',
            type: 'text',
            required: true,
            placeholder: 'Ej. Pleasure Boutique MTY'
          },
          {
            id: 'categoriasProducto',
            label: 'Categorías de productos',
            type: 'checklist',
            required: true,
            options: CATEGORIAS_PRODUCTO.slice()
          },
          {
            id: 'precioDesde',
            label: 'Precio / compra mínima desde',
            type: 'text',
            required: true,
            placeholder: 'Ej. $199 MXN'
          },
          {
            id: 'envioDomicilio',
            label: '¿Envío a domicilio?',
            type: 'select',
            required: false,
            defaultValue: 'No',
            options: OPCIONES_SI_NO.slice()
          },
          {
            id: 'tiendaOnline',
            label: '¿Tienda en línea?',
            type: 'select',
            required: false,
            defaultValue: 'No',
            options: OPCIONES_SI_NO.slice()
          }
        ]
      },
      {
        id: 'ubicacionRetail',
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
        id: 'serviciosRetail',
        title: 'Servicios y políticas',
        fields: [
          {
            id: 'serviciosIncluidos',
            label: 'Qué ofrece la tienda',
            type: 'checklist',
            required: true,
            options: [
              'Venta en tienda física',
              'Tienda en línea',
              'Envío a domicilio',
              'Asesoría privada',
              'Catálogo premium',
              'Paquetes regalo',
              'Facturación bajo solicitud'
            ]
          },
          {
            id: 'serviciosNoRealizo',
            label: 'Políticas / no incluye',
            type: 'checklist',
            required: true,
            options: POLITICAS_NO.slice()
          }
        ]
      },
      {
        id: 'agendaRetail',
        title: 'Horario y pago',
        fields: [
          {
            id: 'horarioDetalle',
            label: 'Horario',
            type: 'text',
            required: true,
            placeholder: 'Ej. Lun–Sáb 10:00 AM – 8:00 PM'
          },
          {
            id: 'disponibilidad',
            label: 'Estado del local',
            type: 'select',
            required: false,
            options: [
              { value: 'disponible', label: 'Abierto ahora' },
              { value: 'ocupada', label: 'Cerrado temporalmente' },
              { value: 'con_cita', label: 'Solo con cita / pedido' }
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
            label: 'Sobre el negocio',
            type: 'textarea',
            required: false,
            rows: 4,
            placeholder: 'Describe tu tienda, catálogo y atención al cliente…'
          }
        ]
      },
      {
        id: 'retailPrivado',
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
            id: 'licenciaOperacion',
            label: 'Licencia / permiso (referencia)',
            type: 'text',
            required: false,
            placeholder: 'Número o folio de licencia'
          }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
