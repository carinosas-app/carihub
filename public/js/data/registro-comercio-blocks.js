/**
 * Bloques registro — sector Comercio. MP-COMERCIO-DELTAS-V1 packs A–D.
 */
(function (global) {
  'use strict';

  var SUB_TO_PACK = {
    'abarrotes': 'A',
    'tiendas-de-conveniencia': 'A',
    'zapaterias': 'B',
    'tiendas-de-ropa': 'B',
    'farmacias-de-barrio': 'C',
    'papelerias': 'C',
    'ferreterias': 'C',
    'mayoreo': 'D',
    'distribuidoras': 'D'
  };

  var MODALIDAD_VENTA = [
    { value: 'tienda_fisica', label: 'Tienda física' },
    { value: 'online', label: 'Solo en línea' },
    { value: 'ambos', label: 'Tienda y en línea' },
    { value: 'delivery', label: 'Principalmente delivery / reparto' }
  ];

  var ENTREGA_DOMICILIO = [
    { value: 'si', label: 'Sí, entrego a domicilio' },
    { value: 'no', label: 'No, solo en tienda' },
    { value: 'solo_zona', label: 'Solo en mi zona' },
    { value: 'convenir', label: 'A convenir' }
  ];

  var FIELD_LABELS = {
    modalidadVentaComercio: 'Modalidad de venta',
    categoriasProducto: 'Categorías de producto',
    serviciosComercio: 'Servicios comerciales',
    formasPagoComercio: 'Formas de pago',
    entregaDomicilio: 'Entrega a domicilio',
    generosModa: 'Géneros / público',
    marcasComercializadas: 'Marcas que manejas',
    serviciosMayoreo: 'Servicios de mayoreo',
    volumenMinimoPedido: 'Pedido mínimo (mayoreo)',
    tiposClientesComercio: 'Tipos de clientes',
    serviciosEmpresaComercio: 'Servicios de la empresa',
    especialidadesEmpresaComercio: 'Especialidades',
    flotaEntrega: 'Entrega / flota',
    diferenciadorComercio: 'Tu sello comercial',
    coberturaGeografica: 'Zona de cobertura',
    colaboracionesComerciales: '¿Colaboras con proveedores, marcas o negocios?',
    tiposColaboracionComercial: 'Tipo de colaboraciones'
  };

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolvePack(subId) { return SUB_TO_PACK[slugSubId(subId)] || 'A'; }

  function getSubDeltaApi() {
    return {
      meta: global.CARIHUB_COMERCIO_SUB_CANON_META || {},
      deltas: global.CARIHUB_COMERCIO_SUB_DELTAS || {}
    };
  }

  function resolveCanonSubId(raw) { return slugSubId(raw); }

  function cloneBlocks(blocks) { return JSON.parse(JSON.stringify(blocks || [])); }

  function applyFieldPatch(field, delta) {
    if (!field || !delta) return field;
    var opts = delta.fieldOptions && delta.fieldOptions[field.id];
    if (opts && opts.length && (field.type === 'checklist' || field.type === 'select')) {
      field.options = opts.slice();
    }
    if (delta.fieldLabels && delta.fieldLabels[field.id]) {
      field.label = delta.fieldLabels[field.id];
    }
    if (delta.textosAyuda && delta.textosAyuda[field.id]) {
      var ayuda = delta.textosAyuda[field.id];
      if (field.type === 'checklist' || field.type === 'select' || field.type === 'boolean') {
        field.hint = ayuda;
      } else {
        field.placeholder = ayuda;
      }
    }
    return field;
  }

  function inferFieldFromDelta(fieldId, delta) {
    var label = FIELD_LABELS[fieldId] || fieldId;
    if (fieldId === 'modalidadVentaComercio') {
      return { id: fieldId, label: label, type: 'select', options: MODALIDAD_VENTA };
    }
    if (fieldId === 'entregaDomicilio') {
      return { id: fieldId, label: label, type: 'select', options: ENTREGA_DOMICILIO };
    }
    if (fieldId === 'diferenciadorComercio' || fieldId === 'coberturaGeografica' ||
        fieldId === 'volumenMinimoPedido' || fieldId === 'flotaEntrega' ||
        fieldId === 'especialidadesEmpresaComercio') {
      return { id: fieldId, label: label, type: 'text', placeholder: '' };
    }
    if (fieldId === 'colaboracionesComerciales') {
      return {
        id: fieldId,
        label: label,
        type: 'select',
        options: [
          { value: 'si_activo', label: 'Sí, colaboro activamente' },
          { value: 'ocasional', label: 'Ocasionalmente' },
          { value: 'convenir', label: 'A convenir por proyecto' },
          { value: 'no', label: 'No por ahora' }
        ]
      };
    }
    var opts = delta && delta.fieldOptions && delta.fieldOptions[fieldId];
    if (opts && opts.length) {
      if (typeof opts[0] === 'object' && opts[0].value != null) {
        return { id: fieldId, label: label, type: 'select', options: opts.slice() };
      }
      return { id: fieldId, label: label, type: 'checklist', options: opts.slice() };
    }
    return null;
  }

  function buildExtraField(fieldId, delta, required) {
    var tpl = inferFieldFromDelta(fieldId, delta);
    if (!tpl) return null;
    var field = JSON.parse(JSON.stringify(tpl));
    field.required = !!required;
    applyFieldPatch(field, delta);
    return field;
  }

  function applySubDeltaToBlocks(blocks, subId) {
    var delta = getSubDeltaApi().deltas[subId];
    if (!delta) return blocks;
    var out = cloneBlocks(blocks);
    var oblSet = {};
    (delta.obligatoriosDelta || []).forEach(function (fid) { oblSet[fid] = true; });
    out.forEach(function (block) {
      if (block.id && block.id.indexOf('pack') >= 0) {
        block.title = delta.blockTitle || block.title;
        if (delta.blockHint) block.hint = delta.blockHint;
      }
      if (delta.hideFields && delta.hideFields.length && block.fields) {
        block.fields = block.fields.filter(function (f) {
          return delta.hideFields.indexOf(f.id) < 0;
        });
      }
      (block.fields || []).forEach(function (field) {
        if (field.id === 'alias' && delta.aliasPlaceholder) field.placeholder = delta.aliasPlaceholder;
        applyFieldPatch(field, delta);
      });
      if (delta.extraFields && delta.extraFields.length && block.id && block.id.indexOf('pack') >= 0) {
        delta.extraFields.forEach(function (fid) {
          if ((block.fields || []).some(function (f) { return f.id === fid; })) return;
          var extra = buildExtraField(fid, delta, !!oblSet[fid]);
          if (extra) block.fields.push(extra);
        });
      }
    });
    return out;
  }

  function packBlocksA() {
    return [{
      id: 'packA_abastos',
      title: 'Abastos y conveniencia',
      hint: 'Categorías, modalidad de venta y formas de pago.',
      fields: [
        { id: 'categoriasProducto', label: 'Categorías de producto', type: 'checklist', required: true, options: ['Despensa', 'Bebidas', 'Lácteos', 'Limpieza', 'Otro'] },
        { id: 'serviciosComercio', label: 'Servicios comerciales', type: 'checklist', required: false, options: ['Venta mostrador', 'Delivery', 'Apartado', 'Otro'] },
        { id: 'modalidadVentaComercio', label: 'Modalidad de venta', type: 'select', required: true, options: MODALIDAD_VENTA },
        { id: 'formasPagoComercio', label: 'Formas de pago', type: 'checklist', required: true, options: ['Efectivo', 'Tarjeta', 'Transferencia', 'Otro'] },
        { id: 'entregaDomicilio', label: 'Entrega a domicilio', type: 'select', required: false, options: ENTREGA_DOMICILIO }
      ]
    }];
  }

  function personaBaseBlocks() {
    return [{
      id: 'comercioBase',
      title: 'Perfil comercial',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Experiencia o datos del negocio',
          type: 'textarea',
          required: false,
          rows: 2,
          placeholder: 'Años en el negocio, permisos o datos relevantes'
        }
      ]
    }, {
      id: 'comercioTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Precio referencia (MXN)', type: 'text', required: true, placeholder: 'Ej. Desde $25 o rango de precios' },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }

  function negocioBaseBlocks() {
    return [{
      id: 'comercioNegocioBase',
      title: 'Negocio comercial',
      fields: [
        { id: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        { id: 'direccion', label: 'Dirección o zona pública', type: 'textarea', required: true, rows: 2 },
        { id: 'horarioDetalle', label: 'Horario', type: 'text', required: true }
      ]
    }];
  }

  function packBlocksB() {
    return [{
      id: 'packB_moda',
      title: 'Moda y calzado',
      hint: 'Líneas, géneros y modalidad de venta.',
      fields: [
        { id: 'categoriasProducto', label: 'Categorías de producto', type: 'checklist', required: true, options: ['Casual', 'Formal', 'Deportiva', 'Calzado', 'Otro'] },
        { id: 'generosModa', label: 'Géneros / público', type: 'checklist', required: true, options: ['Hombre', 'Mujer', 'Niño', 'Unisex', 'Otro'] },
        { id: 'marcasComercializadas', label: 'Marcas', type: 'checklist', required: false, options: ['Marca propia', 'Nacional', 'Importado', 'Otro'] },
        { id: 'modalidadVentaComercio', label: 'Modalidad de venta', type: 'select', required: true, options: MODALIDAD_VENTA.filter(function (o) { return o.value !== 'delivery'; }) },
        { id: 'serviciosComercio', label: 'Servicios', type: 'checklist', required: false, options: ['Venta retail', 'Mayoreo chico', 'Otro'] },
        { id: 'formasPagoComercio', label: 'Formas de pago', type: 'checklist', required: true, options: ['Efectivo', 'Tarjeta', 'Transferencia', 'MSI', 'Otro'] }
      ]
    }];
  }

  function packBlocksC() {
    return [{
      id: 'packC_especial',
      title: 'Retail especializado',
      hint: 'Productos, servicios y formas de pago.',
      fields: [
        { id: 'categoriasProducto', label: 'Categorías de producto', type: 'checklist', required: true, options: ['General', 'Especializado', 'Servicios', 'Otro'] },
        { id: 'serviciosComercio', label: 'Servicios comerciales', type: 'checklist', required: true, options: ['Venta mostrador', 'Delivery', 'Asesoría', 'Otro'] },
        { id: 'modalidadVentaComercio', label: 'Modalidad de venta', type: 'select', required: true, options: MODALIDAD_VENTA },
        { id: 'formasPagoComercio', label: 'Formas de pago', type: 'checklist', required: true, options: ['Efectivo', 'Tarjeta', 'Transferencia', 'Otro'] },
        { id: 'entregaDomicilio', label: 'Entrega a domicilio', type: 'select', required: false, options: ENTREGA_DOMICILIO },
        { id: 'marcasComercializadas', label: 'Marcas', type: 'checklist', required: false, options: ['Varias', 'Genérico', 'Otro'] }
      ]
    }];
  }

  function packBlocksD() {
    return [{
      id: 'packD_mayoreo',
      title: 'Mayoreo y distribución',
      hint: 'Servicios de mayoreo, clientes y cobertura.',
      fields: [
        { id: 'serviciosMayoreo', label: 'Servicios de mayoreo', type: 'checklist', required: true, options: ['Mayoreo', 'Medio mayoreo', 'Surtido', 'Entrega', 'Otro'] },
        { id: 'volumenMinimoPedido', label: 'Pedido mínimo', type: 'text', required: true, placeholder: 'Ej. $500 mínimo' },
        { id: 'tiposClientesComercio', label: 'Tipos de clientes', type: 'checklist', required: true, options: ['Negocios', 'Retail', 'Restaurantes', 'Otro'] },
        { id: 'modalidadVentaComercio', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_VENTA.filter(function (o) { return o.value !== 'online'; }) },
        { id: 'formasPagoComercio', label: 'Formas de pago', type: 'checklist', required: false, options: ['Efectivo', 'Transferencia', 'Crédito', 'Otro'] },
        { id: 'entregaDomicilio', label: 'Entrega', type: 'select', required: false, options: ENTREGA_DOMICILIO },
        { id: 'serviciosEmpresaComercio', label: 'Servicios de la empresa', type: 'checklist', required: false, options: ['Distribución B2B', 'Rutas', 'Surtido', 'Otro'] },
        { id: 'especialidadesEmpresaComercio', label: 'Especialidades', type: 'text', required: false, placeholder: '' },
        { id: 'flotaEntrega', label: 'Entrega / flota', type: 'text', required: false, placeholder: '' }
      ]
    }];
  }

  var PACK_BUILDERS = {
    A: packBlocksA,
    B: packBlocksB,
    C: packBlocksC,
    D: packBlocksD
  };

  var PACK_OBLIGATORIOS = {
    A: ['alias', 'tarifaDesde', 'horarioDetalle', 'categoriasProducto', 'modalidadVentaComercio', 'formasPagoComercio', 'coberturaGeografica'],
    B: ['alias', 'tarifaDesde', 'horarioDetalle', 'categoriasProducto', 'generosModa', 'modalidadVentaComercio', 'formasPagoComercio'],
    C: ['alias', 'tarifaDesde', 'horarioDetalle', 'categoriasProducto', 'serviciosComercio', 'modalidadVentaComercio', 'formasPagoComercio'],
    D: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosMayoreo', 'volumenMinimoPedido', 'tiposClientesComercio', 'modalidadVentaComercio', 'coberturaGeografica']
  };

  function appendPackBlocks(pack) {
    var fn = PACK_BUILDERS[pack] || packBlocksA;
    return fn();
  }

  var NEGOCIO_SUBS = new Set(['distribuidoras']);

  function isNegocioSub(subId) {
    return NEGOCIO_SUBS.has(slugSubId(subId));
  }

  function inferFormularioId(pack, ctx) {
    if (ctx && ctx.formularioId) return ctx.formularioId;
    var subId = slugSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '');
    if (isNegocioSub(subId)) return 'negocio_empresa';
    return 'persona_independiente';
  }

  function mergeObligatoriosFromDelta(packOblig, subId) {
    var delta = getSubDeltaApi().deltas[subId];
    var list = (packOblig || []).slice();
    if (!delta || !Array.isArray(delta.obligatoriosDelta)) return list;
    var personaOnly = { alias: true, tarifaDesde: true };
    delta.obligatoriosDelta.forEach(function (fid) {
      if (fid === 'geo') return;
      if (isNegocioSub(subId) && personaOnly[fid]) return;
      if (list.indexOf(fid) < 0) list.push(fid);
    });
    return list;
  }

  function resolveBaseObligatorios(canonId, pack) {
    if (isNegocioSub(canonId)) {
      return [
        'nombreComercial',
        'serviciosEmpresaComercio',
        'especialidadesEmpresaComercio',
        'tiposClientesComercio',
        'flotaEntrega',
        'modalidadVentaComercio',
        'direccion',
        'horarioDetalle'
      ];
    }
    return (PACK_OBLIGATORIOS[pack] || PACK_OBLIGATORIOS.A).slice();
  }

  function buildConfig(ctx) {
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || '');
    var pack = resolvePack(canonId);
    var formularioId = inferFormularioId(pack, ctx);
    var blocks;
    if (isNegocioSub(canonId)) {
      blocks = negocioBaseBlocks().concat(appendPackBlocks(pack));
    } else {
      blocks = personaBaseBlocks().concat(appendPackBlocks(pack));
    }
    blocks = applySubDeltaToBlocks(blocks, canonId);
    return {
      id: 'comercio_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'comercio',
      formularioId: formularioId,
      uiIds: isNegocioSub(canonId) ? ['ui_neg_comercio'] : ['ui_ind_comercio'],
      fotosMin: 3,
      obligatorios: mergeObligatoriosFromDelta(resolveBaseObligatorios(canonId, pack), canonId),
      blocks: blocks,
      nestedProfileKey: 'comercioPerfil',
      packFlags: {}
    };
  }

  global.CARIHUB_REGISTRO_COMERCIO_SECTOR_BLOCKS = {
    id: 'comercio_sector_packs',
    sectorId: 'comercio',
    subToPack: SUB_TO_PACK,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
