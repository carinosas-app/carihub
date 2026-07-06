/**
 * Bloques registro — sector Automotriz. MP-AUTOMOTRIZ-DELTAS-V1 packs A–F.
 */
(function (global) {
  'use strict';

  var SUB_TO_PACK = {
    'talleres-mecanicos': 'A',
    'electromecanicos': 'A',
    'mecanicos-a-domicilio': 'A',
    'vulcanizadoras': 'B',
    'hojalateria-y-pintura': 'C',
    'lavado-de-autos': 'C',
    'detallado-automotriz-premium': 'C',
    'refaccionarias': 'D',
    'instaladores-de-audio-car-multimedia': 'D',
    'tecnicos-en-baterias': 'D',
    'tecnicos-en-a-c-automotriz': 'D',
    'agencias-de-autos': 'E',
    'lotes-de-autos': 'E',
    'gruas-y-auxilio-vial': 'F'
  };

  var MODALIDAD_AUTO = [
    { value: 'taller_fijo', label: 'Taller / local fijo' },
    { value: 'domicilio', label: 'Servicio a domicilio' },
    { value: 'ambos', label: 'Taller y domicilio' },
    { value: 'unidad_movil', label: 'Unidad móvil' }
  ];

  var ANOS_EXPERIENCIA_AUTO = [
    { value: '1_3', label: '1–3 años' },
    { value: '4_7', label: '4–7 años' },
    { value: '8_15', label: '8–15 años' },
    { value: '16_mas', label: '16+ años' }
  ];

  var FINANCIAMIENTO_OPTS = [
    { value: 'si_propio', label: 'Financiamiento propio' },
    { value: 'si_terceros', label: 'Financiamiento con terceros' },
    { value: 'contado_solo', label: 'Solo contado' },
    { value: 'convenir', label: 'A convenir' }
  ];

  var FIELD_LABELS = {
    modalidadServicioAuto: 'Modalidad de servicio',
    serviciosMecanica: 'Servicios mecánicos',
    especialidadesMecanica: 'Especialidades mecánicas',
    marcasAtendidas: 'Marcas que atiendes',
    tiposVehiculoAtendidos: 'Tipos de vehículo',
    garantiaServicioAuto: 'Garantía del servicio',
    tiempoRespuestaAuto: 'Tiempo de respuesta',
    serviciosLlantas: 'Servicios de llantas',
    tiposLlantas: 'Tipos de llantas',
    serviciosCarroceria: 'Servicios de carrocería',
    serviciosEsteticaAuto: 'Servicios de estética automotriz',
    serviciosRefacciones: 'Servicios / productos de refacciones',
    lineasRefacciones: 'Líneas o marcas de refacciones',
    serviciosEspecialidadAuto: 'Servicios especializados',
    serviciosVentaAutos: 'Servicios de venta',
    tiposVehiculoVenta: 'Tipos de vehículo en venta',
    financiamientoDisponible: 'Financiamiento',
    inventarioAproximado: 'Inventario aproximado',
    cantidadUnidadesAprox: 'Unidades disponibles (aprox.)',
    serviciosGrua: 'Servicios de grúa / auxilio',
    coberturaCarretera: 'Cobertura en carretera',
    anosExperienciaAuto: 'Años de experiencia',
    diferenciadorAutomotriz: 'Tu sello automotriz',
    coberturaGeografica: 'Zona de atención',
    colaboracionesComerciales: '¿Colaboras con talleres, agencias o aseguradoras?',
    tiposColaboracionComercial: 'Tipo de colaboraciones'
  };

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolvePack(subId) { return SUB_TO_PACK[slugSubId(subId)] || 'A'; }

  function getSubDeltaApi() {
    return {
      meta: global.CARIHUB_AUTOMOTRIZ_SUB_CANON_META || {},
      deltas: global.CARIHUB_AUTOMOTRIZ_SUB_DELTAS || {}
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
    if (fieldId === 'modalidadServicioAuto') {
      return { id: fieldId, label: label, type: 'select', options: MODALIDAD_AUTO };
    }
    if (fieldId === 'anosExperienciaAuto') {
      return { id: fieldId, label: label, type: 'select', options: ANOS_EXPERIENCIA_AUTO };
    }
    if (fieldId === 'financiamientoDisponible') {
      return { id: fieldId, label: label, type: 'select', options: FINANCIAMIENTO_OPTS };
    }
    if (fieldId === 'diferenciadorAutomotriz' || fieldId === 'coberturaGeografica' ||
        fieldId === 'garantiaServicioAuto' || fieldId === 'coberturaCarretera' ||
        fieldId === 'inventarioAproximado' || fieldId === 'cantidadUnidadesAprox') {
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
    if (fieldId === 'tiempoRespuestaAuto') {
      return {
        id: fieldId,
        label: label,
        type: 'select',
        options: [
          { value: 'emergencia_30min', label: 'Emergencia (~30 min)' },
          { value: '1h', label: 'Dentro de 1 hora' },
          { value: '2h', label: '1–2 horas' },
          { value: 'mismo_dia', label: 'Mismo día' },
          { value: 'por_cita', label: 'Con cita programada' }
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
      id: 'packA_mecanica',
      title: 'Mecánica y reparación',
      hint: 'Servicios mecánicos, marcas y modalidad.',
      fields: [
        { id: 'serviciosMecanica', label: 'Servicios mecánicos', type: 'checklist', required: true, options: ['Afinación', 'Frenos', 'Suspensión', 'Diagnóstico', 'Mantenimiento', 'Otro'] },
        { id: 'especialidadesMecanica', label: 'Especialidades mecánicas', type: 'checklist', required: true, options: ['Motor', 'Transmisión', 'Frenos', 'Eléctrico', 'Diesel', 'Otro'] },
        { id: 'modalidadServicioAuto', label: 'Modalidad de servicio', type: 'select', required: true, options: MODALIDAD_AUTO.filter(function (o) { return o.value !== 'unidad_movil'; }) },
        { id: 'marcasAtendidas', label: 'Marcas que atiendes', type: 'checklist', required: false, options: ['Multimarca', 'Nissan', 'VW', 'Chevrolet', 'Toyota', 'Otro'] },
        { id: 'tiposVehiculoAtendidos', label: 'Tipos de vehículo', type: 'checklist', required: false, options: ['Sedán', 'SUV', 'Pick-up', 'Camioneta', 'Otro'] },
        { id: 'garantiaServicioAuto', label: 'Garantía del servicio', type: 'text', required: false, placeholder: 'Ej. 30 días mano de obra' },
        { id: 'tiempoRespuestaAuto', label: 'Tiempo de respuesta', type: 'select', required: false, options: [
          { value: 'emergencia_30min', label: 'Emergencia (~30 min)' },
          { value: '1h', label: 'Dentro de 1 hora' },
          { value: '2h', label: '1–2 horas' },
          { value: 'mismo_dia', label: 'Mismo día' },
          { value: 'por_cita', label: 'Con cita programada' }
        ] },
        { id: 'anosExperienciaAuto', label: 'Años de experiencia', type: 'select', required: false, options: ANOS_EXPERIENCIA_AUTO }
      ]
    }];
  }

  function personaBaseBlocks() {
    return [{
      id: 'automotrizBase',
      title: 'Perfil automotriz',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Experiencia y certificaciones',
          type: 'textarea',
          required: true,
          rows: 2,
          placeholder: 'Años de experiencia, certificaciones o especialidades'
        }
      ]
    }, {
      id: 'automotrizTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Tarifa desde (MXN)', type: 'text', required: true },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }

  function negocioBaseBlocks() {
    return [{
      id: 'automotrizNegocioBase',
      title: 'Negocio automotriz',
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
      id: 'packB_llantas',
      title: 'Llantas y vulcanización',
      hint: 'Servicios de llantas, balanceo y alineación.',
      fields: [
        { id: 'serviciosLlantas', label: 'Servicios de llantas', type: 'checklist', required: true, options: ['Venta', 'Montaje', 'Balanceo', 'Alineación', 'Reparación', 'Otro'] },
        { id: 'tiposLlantas', label: 'Tipos de llantas', type: 'checklist', required: true, options: ['Auto', 'SUV', 'Pick-up', 'Moto', 'Otro'] },
        { id: 'modalidadServicioAuto', label: 'Modalidad de servicio', type: 'select', required: true, options: MODALIDAD_AUTO.filter(function (o) { return o.value !== 'unidad_movil'; }) },
        { id: 'marcasAtendidas', label: 'Marcas de llantas', type: 'checklist', required: false, options: ['Michelin', 'Goodyear', 'Pirelli', 'Genérico', 'Otro'] },
        { id: 'garantiaServicioAuto', label: 'Garantía del servicio', type: 'text', required: false, placeholder: 'Ej. Garantía en montaje' }
      ]
    }];
  }

  function packBlocksC() {
    return [{
      id: 'packC_carroceria',
      title: 'Carrocería y estética',
      hint: 'Hojalatería, pintura, lavado o detailing.',
      fields: [
        { id: 'serviciosCarroceria', label: 'Servicios de carrocería', type: 'checklist', required: false, options: ['Enderezado', 'Pintura', 'Match de color', 'Seguros', 'Otro'] },
        { id: 'serviciosEsteticaAuto', label: 'Servicios de estética', type: 'checklist', required: false, options: ['Lavado', 'Encerado', 'Detailing', 'Cerámico', 'Otro'] },
        { id: 'modalidadServicioAuto', label: 'Modalidad de servicio', type: 'select', required: true, options: MODALIDAD_AUTO.filter(function (o) { return o.value !== 'unidad_movil'; }) },
        { id: 'tiposVehiculoAtendidos', label: 'Tipos de vehículo', type: 'checklist', required: false, options: ['Sedán', 'SUV', 'Pick-up', 'Otro'] },
        { id: 'garantiaServicioAuto', label: 'Garantía del servicio', type: 'text', required: false, placeholder: '' }
      ]
    }];
  }

  function packBlocksD() {
    return [{
      id: 'packD_refacciones',
      title: 'Refacciones y especialidades',
      hint: 'Refacciones, A/C, baterías, audio u otra especialidad.',
      fields: [
        { id: 'serviciosEspecialidadAuto', label: 'Servicios especializados', type: 'checklist', required: true, options: ['Instalación', 'Reparación', 'Venta', 'Diagnóstico', 'Otro'] },
        { id: 'serviciosRefacciones', label: 'Refacciones', type: 'checklist', required: false, options: ['Mostrador', 'Pedidos', 'Entrega', 'Mayoreo', 'Otro'] },
        { id: 'lineasRefacciones', label: 'Líneas o marcas', type: 'checklist', required: false, options: ['OEM', 'Genérico', 'Premium', 'Otro'] },
        { id: 'modalidadServicioAuto', label: 'Modalidad de servicio', type: 'select', required: true, options: MODALIDAD_AUTO.filter(function (o) { return o.value !== 'unidad_movil'; }) },
        { id: 'marcasAtendidas', label: 'Marcas de vehículo', type: 'checklist', required: false, options: ['Multimarca', 'Nissan', 'VW', 'Toyota', 'Otro'] }
      ]
    }];
  }

  function packBlocksE() {
    return [{
      id: 'packE_venta',
      title: 'Venta de vehículos',
      hint: 'Inventario, tipos de vehículo y financiamiento.',
      fields: [
        { id: 'serviciosVentaAutos', label: 'Servicios de venta', type: 'checklist', required: true, options: ['Contado', 'Seminuevos', 'Consignación', 'Permuta', 'Otro'] },
        { id: 'tiposVehiculoVenta', label: 'Tipos de vehículo en venta', type: 'checklist', required: true, options: ['Nuevo', 'Seminuevo', 'Usado', 'SUV', 'Pick-up', 'Otro'] },
        { id: 'financiamientoDisponible', label: 'Financiamiento', type: 'select', required: true, options: FINANCIAMIENTO_OPTS },
        { id: 'inventarioAproximado', label: 'Inventario aproximado', type: 'text', required: false, placeholder: 'Ej. 15–30 unidades' },
        { id: 'cantidadUnidadesAprox', label: 'Unidades disponibles', type: 'text', required: false, placeholder: 'Ej. 8 unidades' }
      ]
    }];
  }

  function packBlocksF() {
    return [{
      id: 'packF_grua',
      title: 'Grúas y auxilio vial',
      hint: 'Grúa, auxilio vial y cobertura en carretera.',
      fields: [
        { id: 'serviciosGrua', label: 'Servicios de grúa / auxilio', type: 'checklist', required: true, options: ['Grúa local', 'Grúa carretera', 'Auxilio mecánico', 'Paso de corriente', 'Otro'] },
        { id: 'modalidadServicioAuto', label: 'Modalidad de servicio', type: 'select', required: true, options: MODALIDAD_AUTO.filter(function (o) { return o.value === 'unidad_movil' || o.value === 'ambos'; }) },
        { id: 'coberturaCarretera', label: 'Cobertura en carretera', type: 'text', required: true, placeholder: 'Autopistas, periféricos, radio en km…' },
        { id: 'tiempoRespuestaAuto', label: 'Tiempo de respuesta', type: 'select', required: true, options: [
          { value: 'emergencia_30min', label: 'Emergencia (~30 min)' },
          { value: '1h', label: 'Dentro de 1 hora' },
          { value: '2h', label: '1–2 horas' },
          { value: 'mismo_dia', label: 'Mismo día' },
          { value: 'por_cita', label: 'Con cita programada' }
        ] },
        { id: 'tiposVehiculoAtendidos', label: 'Tipos de vehículo', type: 'checklist', required: false, options: ['Sedán', 'SUV', 'Pick-up', 'Camioneta', 'Moto', 'Otro'] }
      ]
    }];
  }

  var PACK_BUILDERS = {
    A: packBlocksA,
    B: packBlocksB,
    C: packBlocksC,
    D: packBlocksD,
    E: packBlocksE,
    F: packBlocksF
  };

  var PACK_OBLIGATORIOS = {
    A: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosMecanica', 'especialidadesMecanica', 'modalidadServicioAuto', 'coberturaGeografica'],
    B: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosLlantas', 'tiposLlantas', 'modalidadServicioAuto'],
    C: ['alias', 'tarifaDesde', 'horarioDetalle', 'modalidadServicioAuto', 'coberturaGeografica'],
    D: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosEspecialidadAuto', 'modalidadServicioAuto'],
    E: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosVentaAutos', 'tiposVehiculoVenta', 'financiamientoDisponible'],
    F: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosGrua', 'modalidadServicioAuto', 'coberturaGeografica', 'coberturaCarretera', 'tiempoRespuestaAuto']
  };

  function appendPackBlocks(pack) {
    var fn = PACK_BUILDERS[pack] || packBlocksA;
    return fn();
  }

  var NEGOCIO_SUBS = new Set(['agencias-de-autos']);

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
    var personaOnly = { alias: true, certificaciones: true, tarifaDesde: true };
    delta.obligatoriosDelta.forEach(function (fid) {
      if (fid === 'geo') return;
      if (isNegocioSub(subId) && personaOnly[fid]) return;
      if (list.indexOf(fid) < 0) list.push(fid);
    });
    return list;
  }

  function resolveBaseObligatorios(canonId, pack) {
    if (isNegocioSub(canonId)) {
      return ['nombreComercial', 'serviciosVentaAutos', 'tiposVehiculoVenta', 'financiamientoDisponible', 'inventarioAproximado', 'direccion', 'horarioDetalle'];
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
      id: 'automotriz_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'automotriz',
      formularioId: formularioId,
      uiIds: isNegocioSub(canonId) ? ['ui_neg_automotriz'] : ['ui_ind_automotriz'],
      fotosMin: 3,
      obligatorios: mergeObligatoriosFromDelta(resolveBaseObligatorios(canonId, pack), canonId),
      blocks: blocks,
      nestedProfileKey: 'automotrizPerfil',
      packFlags: {}
    };
  }

  global.CARIHUB_REGISTRO_AUTOMOTRIZ_SECTOR_BLOCKS = {
    id: 'automotriz_sector_packs',
    sectorId: 'automotriz',
    subToPack: SUB_TO_PACK,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
