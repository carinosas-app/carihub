/**
 * Bloques registro — sector Bienes Raíces. MP-BIENES-RAICES-DELTAS-V1 packs A–E.
 */
(function (global) {
  'use strict';

  var SUB_TO_PACK = {
    'agente-inmobiliario-independiente': 'A',
    'asesor-inmobiliario': 'A',
    'corredor-inmobiliario': 'A',
    'promotor-de-propiedades': 'A',
    'administrador-de-propiedades': 'A',
    'valuador-inmobiliario': 'A',
    'rentas-vacacionales-independiente': 'A',
    'rentas-temporales-independiente': 'A',
    'inmobiliaria': 'B',
    'agencia-de-bienes-raices': 'B',
    'desarrolladora-inmobiliaria': 'B',
    'constructora': 'B',
    'administracion-de-condominios': 'B',
    'venta-de-casas': 'C',
    'venta-de-departamentos': 'C',
    'venta-de-terrenos': 'C',
    'venta-de-locales-comerciales': 'C',
    'venta-de-bodegas': 'C',
    'venta-de-oficinas': 'C',
    'renta-de-casas': 'D',
    'renta-de-departamentos': 'D',
    'renta-de-locales-comerciales': 'D',
    'renta-de-bodegas': 'D',
    'renta-de-oficinas': 'D',
    'renta-vacacional': 'D',
    'coworking': 'E',
    'centros-de-negocios-y-oficinas': 'E'
  };

  var MODALIDAD_OPERACION = [
    { value: 'venta', label: 'Venta' },
    { value: 'renta', label: 'Renta' },
    { value: 'venta_y_renta', label: 'Venta y renta' },
    { value: 'desarrollo', label: 'Desarrollo inmobiliario' },
    { value: 'administracion', label: 'Administración de propiedades' },
    { value: 'temporal', label: 'Renta temporal / vacacional' }
  ];

  var OPERACION = [
    { value: 'venta', label: 'Venta' },
    { value: 'renta', label: 'Renta' },
    { value: 'temporal', label: 'Renta temporal' },
    { value: 'coworking', label: 'Coworking / oficinas flexibles' }
  ];

  var TIEMPO_RESPUESTA = [
    { value: 'inmediato', label: 'Inmediato' },
    { value: 'mismo_dia', label: 'Mismo día' },
    { value: '24_48h', label: '24–48 horas' },
    { value: 'por_cita', label: 'Con cita programada' }
  ];

  var FIELD_LABELS = {
    modalidadOperacionInmobiliaria: 'Modalidad de operación',
    operacionInmobiliaria: 'Operación principal',
    tiposInmuebleInmobiliario: 'Tipos de inmueble',
    serviciosInmobiliarios: 'Servicios inmobiliarios',
    serviciosEmpresaInmobiliaria: 'Servicios de la empresa',
    especialidadesInmobiliarias: 'Especialidades',
    especialidadesEmpresaInmobiliaria: 'Especialidades',
    rangoPrecioInmobiliario: 'Rango de precio / renta',
    amenidadesInmueble: 'Amenidades destacadas',
    caracteristicasInmueble: 'Características del inmueble',
    tiempoRespuestaInmobiliaria: 'Tiempo de respuesta',
    diferenciadorInmobiliario: 'Tu sello inmobiliario',
    coberturaGeografica: 'Zona de cobertura',
    colaboracionesComerciales: '¿Colaboras con notarías, bancos o desarrolladoras?',
    tiposColaboracionComercial: 'Tipo de colaboraciones'
  };

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolvePack(subId) { return SUB_TO_PACK[slugSubId(subId)] || 'A'; }

  function isNegocioSub(subId) {
    var pack = resolvePack(subId);
    return pack !== 'A';
  }

  function getSubDeltaApi() {
    return {
      meta: global.CARIHUB_BIENES_RAICES_SUB_CANON_META || {},
      deltas: global.CARIHUB_BIENES_RAICES_SUB_DELTAS || {}
    };
  }

  function resolveCanonSubId(raw) { return slugSubId(raw); }

  function fotosMinForSub(canonId) {
    var meta = getSubDeltaApi().meta[canonId];
    return (meta && meta.fotosMin) || 3;
  }

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
    if (fieldId === 'modalidadOperacionInmobiliaria') {
      return { id: fieldId, label: label, type: 'select', options: MODALIDAD_OPERACION };
    }
    if (fieldId === 'operacionInmobiliaria') {
      return { id: fieldId, label: label, type: 'select', options: OPERACION };
    }
    if (fieldId === 'tiempoRespuestaInmobiliaria') {
      return { id: fieldId, label: label, type: 'select', options: TIEMPO_RESPUESTA };
    }
    if (fieldId === 'diferenciadorInmobiliario' || fieldId === 'coberturaGeografica' ||
        fieldId === 'rangoPrecioInmobiliario' || fieldId === 'caracteristicasInmueble' ||
        fieldId === 'especialidadesEmpresaInmobiliaria') {
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

  function personaBaseBlocks() {
    return [{
      id: 'inmoBase',
      title: 'Perfil inmobiliario',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Experiencia y certificaciones',
          type: 'textarea',
          required: false,
          rows: 2,
          placeholder: 'AMPI, años de experiencia, certificaciones'
        }
      ]
    }, {
      id: 'inmoTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Tarifa / comisión desde', type: 'text', required: true },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }

  function negocioBaseBlocks() {
    return [{
      id: 'inmoNegocioBase',
      title: 'Empresa inmobiliaria',
      fields: [
        { id: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        { id: 'direccion', label: 'Dirección o zona pública', type: 'textarea', required: true, rows: 2 },
        { id: 'horarioDetalle', label: 'Horario', type: 'text', required: true }
      ]
    }];
  }

  function packBlocksA() {
    return [{
      id: 'packA_asesor',
      title: 'Asesores y profesionales',
      hint: 'Servicios, tipos de inmueble y cobertura.',
      fields: [
        { id: 'serviciosInmobiliarios', label: 'Servicios', type: 'checklist', required: true, options: ['Captación', 'Promoción', 'Negociación', 'Trámite', 'Otro'] },
        { id: 'tiposInmuebleInmobiliario', label: 'Tipos de inmueble', type: 'checklist', required: true, options: ['Casa', 'Departamento', 'Terreno', 'Local', 'Otro'] },
        { id: 'modalidadOperacionInmobiliaria', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_OPERACION },
        { id: 'especialidadesInmobiliarias', label: 'Especialidades', type: 'checklist', required: false, options: ['Residencial', 'Comercial', 'Industrial', 'Otro'] },
        { id: 'tiempoRespuestaInmobiliaria', label: 'Tiempo de respuesta', type: 'select', required: true, options: TIEMPO_RESPUESTA },
        { id: 'rangoPrecioInmobiliario', label: 'Rango de precio', type: 'text', required: false, placeholder: '' },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksB() {
    return [{
      id: 'packB_empresa',
      title: 'Empresas inmobiliarias',
      hint: 'Servicios de la empresa y cobertura.',
      fields: [
        { id: 'serviciosEmpresaInmobiliaria', label: 'Servicios', type: 'checklist', required: true, options: ['Venta', 'Renta', 'Administración', 'Desarrollo', 'Otro'] },
        { id: 'especialidadesEmpresaInmobiliaria', label: 'Especialidades', type: 'text', required: true, placeholder: '' },
        { id: 'tiposInmuebleInmobiliario', label: 'Tipos de inmueble', type: 'checklist', required: true, options: ['Casa', 'Departamento', 'Terreno', 'Local', 'Oficina', 'Otro'] },
        { id: 'modalidadOperacionInmobiliaria', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_OPERACION },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksC() {
    return [{
      id: 'packC_venta',
      title: 'Venta de inmuebles',
      hint: 'Características, precio y amenidades.',
      fields: [
        { id: 'operacionInmobiliaria', label: 'Operación', type: 'select', required: true, options: OPERACION.filter(function (o) { return o.value === 'venta'; }) },
        { id: 'tiposInmuebleInmobiliario', label: 'Tipo de inmueble', type: 'checklist', required: true, options: ['Casa', 'Departamento', 'Terreno', 'Local comercial', 'Bodega', 'Oficina'] },
        { id: 'caracteristicasInmueble', label: 'Características', type: 'text', required: true, placeholder: 'Ej. 85 m² · 2 rec · estacionamiento' },
        { id: 'rangoPrecioInmobiliario', label: 'Rango de precio', type: 'text', required: true, placeholder: '' },
        { id: 'amenidadesInmueble', label: 'Amenidades', type: 'checklist', required: false, options: ['Estacionamiento', 'Seguridad', 'Alberca', 'Gym', 'Otro'] },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksD() {
    return [{
      id: 'packD_renta',
      title: 'Renta de inmuebles',
      hint: 'Rango de renta, amenidades y cobertura.',
      fields: [
        { id: 'operacionInmobiliaria', label: 'Operación', type: 'select', required: true, options: OPERACION.filter(function (o) { return o.value === 'renta' || o.value === 'temporal'; }) },
        { id: 'tiposInmuebleInmobiliario', label: 'Tipo de inmueble', type: 'checklist', required: true, options: ['Casa', 'Departamento', 'Local comercial', 'Bodega', 'Oficina'] },
        { id: 'rangoPrecioInmobiliario', label: 'Rango de renta', type: 'text', required: true, placeholder: '' },
        { id: 'caracteristicasInmueble', label: 'Características', type: 'text', required: false, placeholder: '' },
        { id: 'amenidadesInmueble', label: 'Amenidades', type: 'checklist', required: false, options: ['Estacionamiento', 'Seguridad', 'Amueblado', 'Pet friendly', 'Otro'] },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksE() {
    return [{
      id: 'packE_flexible',
      title: 'Espacios flexibles',
      hint: 'Planes, amenidades y ubicación.',
      fields: [
        { id: 'serviciosEmpresaInmobiliaria', label: 'Servicios / planes', type: 'checklist', required: true, options: ['Hot desk', 'Oficina privada', 'Sala juntas', 'Virtual office', 'Otro'] },
        { id: 'operacionInmobiliaria', label: 'Operación', type: 'select', required: true, options: OPERACION.filter(function (o) { return o.value === 'coworking' || o.value === 'renta'; }) },
        { id: 'rangoPrecioInmobiliario', label: 'Rango de precio', type: 'text', required: true, placeholder: '' },
        { id: 'amenidadesInmueble', label: 'Amenidades', type: 'checklist', required: false, options: ['Internet', 'Sala juntas', 'Recepción', 'Estacionamiento', 'Otro'] },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  var PACK_BUILDERS = {
    A: packBlocksA,
    B: packBlocksB,
    C: packBlocksC,
    D: packBlocksD,
    E: packBlocksE
  };

  var PACK_OBLIGATORIOS = {
    A: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosInmobiliarios', 'tiposInmuebleInmobiliario', 'modalidadOperacionInmobiliaria', 'coberturaGeografica', 'tiempoRespuestaInmobiliaria'],
    B: ['nombreComercial', 'serviciosEmpresaInmobiliaria', 'tiposInmuebleInmobiliario', 'direccion', 'horarioDetalle', 'coberturaGeografica'],
    C: ['nombreComercial', 'operacionInmobiliaria', 'tiposInmuebleInmobiliario', 'rangoPrecioInmobiliario', 'direccion', 'horarioDetalle', 'coberturaGeografica'],
    D: ['nombreComercial', 'operacionInmobiliaria', 'tiposInmuebleInmobiliario', 'rangoPrecioInmobiliario', 'direccion', 'horarioDetalle', 'coberturaGeografica'],
    E: ['nombreComercial', 'serviciosEmpresaInmobiliaria', 'operacionInmobiliaria', 'direccion', 'horarioDetalle', 'coberturaGeografica']
  };

  function appendPackBlocks(pack) {
    var fn = PACK_BUILDERS[pack] || packBlocksA;
    return fn();
  }

  function inferFormularioId(canonId, ctx) {
    if (ctx && ctx.formularioId) return ctx.formularioId;
    if (isNegocioSub(canonId)) return 'negocio_empresa';
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
    return (PACK_OBLIGATORIOS[pack] || PACK_OBLIGATORIOS.A).slice();
  }

  function buildConfig(ctx) {
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || '');
    var pack = resolvePack(canonId);
    var formularioId = inferFormularioId(canonId, ctx);
    var blocks;
    if (isNegocioSub(canonId)) {
      blocks = negocioBaseBlocks().concat(appendPackBlocks(pack));
    } else {
      blocks = personaBaseBlocks().concat(appendPackBlocks(pack));
    }
    blocks = applySubDeltaToBlocks(blocks, canonId);
    return {
      id: 'bienes_raices_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'bienes-raices',
      formularioId: formularioId,
      uiIds: isNegocioSub(canonId) ? ['ui_neg_inmobiliario'] : ['ui_ind_inmobiliario'],
      fotosMin: fotosMinForSub(canonId),
      obligatorios: mergeObligatoriosFromDelta(resolveBaseObligatorios(canonId, pack), canonId),
      blocks: blocks,
      nestedProfileKey: 'bienesRaicesPerfil',
      packFlags: {}
    };
  }

  global.CARIHUB_REGISTRO_BIENES_RAICES_SECTOR_BLOCKS = {
    id: 'bienes_raices_sector_packs',
    sectorId: 'bienes-raices',
    subToPack: SUB_TO_PACK,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
