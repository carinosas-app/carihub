/**
 * Bloques registro — sector Transporte. MP-TRANSPORTE-DELTAS-V1 packs A–F.
 */
(function (global) {
  'use strict';

  var SUB_TO_PACK = {
    'chofer-privado': 'A',
    'conductor-ejecutivo': 'A',
    'transporte-ejecutivo': 'A',
    'transporte-turistico': 'A',
    'transporte-escolar': 'A',
    'mensajero': 'B',
    'repartidor-local': 'B',
    'motomensajero': 'B',
    'courier-independiente': 'B',
    'ultima-milla': 'B',
    'flete-ligero': 'C',
    'mudanzas-pequenas': 'C',
    'mudanzas': 'C',
    'operador-de-carga': 'D',
    'transporte-de-carga': 'D',
    'transporte-refrigerado': 'D',
    'almacenes-y-bodegas': 'D',
    'distribucion-de-mercancias': 'D',
    'logistica-local': 'D',
    'empresa-de-mensajeria': 'E',
    'empresa-de-paqueteria': 'E',
    'empresa-de-logistica': 'E',
    'logistica-internacional': 'F',
    'renta-de-camionetas': 'F'
  };

  var MODALIDAD_TRANSPORTE = [
    { value: 'local_ciudad', label: 'Local / ciudad' },
    { value: 'metropolitana', label: 'Zona metropolitana' },
    { value: 'regional', label: 'Regional / estatal' },
    { value: 'nacional', label: 'Nacional' },
    { value: 'internacional', label: 'Internacional' },
    { value: 'bajo_demanda', label: 'Bajo demanda / app' }
  ];

  var TIEMPO_RESPUESTA = [
    { value: 'inmediato_30min', label: 'Inmediato (~30 min)' },
    { value: '1h', label: 'Dentro de 1 hora' },
    { value: '2h', label: '1–2 horas' },
    { value: 'mismo_dia', label: 'Mismo día' },
    { value: 'programado', label: 'Programado / con cita' }
  ];

  var INCLUYE_PERSONAL = [
    { value: 'si', label: 'Sí, incluido' },
    { value: 'no', label: 'No incluido' },
    { value: 'opcional', label: 'Opcional con costo extra' },
    { value: 'convenir', label: 'A convenir' }
  ];

  var FIELD_LABELS = {
    modalidadServicioTransporte: 'Modalidad de servicio',
    serviciosTransportePersonas: 'Servicios de transporte de personas',
    tipoVehiculoPasajeros: 'Tipo de vehículo',
    tiposClientesTransporte: 'Tipos de clientes',
    serviciosMensajeria: 'Servicios de mensajería',
    tiposEnvio: 'Tipos de envío',
    tipoVehiculoMensajeria: 'Vehículo para envíos',
    serviciosFleteMudanza: 'Servicios de flete / mudanza',
    capacidadCarga: 'Capacidad de carga',
    tiposMercancia: 'Tipos de mercancía',
    incluyePersonalCarga: '¿Incluye personal de carga?',
    serviciosLogistica: 'Servicios logísticos',
    tiposCarga: 'Tipos de carga',
    coberturaRutas: 'Rutas / corredores',
    serviciosEmpresaTransporte: 'Servicios de la empresa',
    especialidadesEmpresaTransporte: 'Especialidades',
    tamanoClienteTransporte: 'Tamaño de clientes',
    flotaAproximada: 'Flota aproximada',
    serviciosEspecialidadTransporte: 'Servicios especializados',
    coberturaInternacional: 'Cobertura internacional',
    tiposVehiculoRenta: 'Vehículos en renta',
    permisosLicencias: 'Permisos / licencias',
    tiempoRespuestaTransporte: 'Tiempo de respuesta',
    diferenciadorTransporte: 'Tu sello en transporte',
    coberturaGeografica: 'Zona de cobertura',
    colaboracionesComerciales: '¿Colaboras con empresas, flotillas o plataformas?',
    tiposColaboracionComercial: 'Tipo de colaboraciones'
  };

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolvePack(subId) { return SUB_TO_PACK[slugSubId(subId)] || 'A'; }

  function getSubDeltaApi() {
    return {
      meta: global.CARIHUB_TRANSPORTE_SUB_CANON_META || {},
      deltas: global.CARIHUB_TRANSPORTE_SUB_DELTAS || {}
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
    if (fieldId === 'modalidadServicioTransporte') {
      return { id: fieldId, label: label, type: 'select', options: MODALIDAD_TRANSPORTE };
    }
    if (fieldId === 'tiempoRespuestaTransporte') {
      return { id: fieldId, label: label, type: 'select', options: TIEMPO_RESPUESTA };
    }
    if (fieldId === 'incluyePersonalCarga') {
      return { id: fieldId, label: label, type: 'select', options: INCLUYE_PERSONAL };
    }
    if (fieldId === 'diferenciadorTransporte' || fieldId === 'coberturaGeografica' ||
        fieldId === 'capacidadCarga' || fieldId === 'coberturaRutas' ||
        fieldId === 'coberturaInternacional' || fieldId === 'permisosLicencias' ||
        fieldId === 'flotaAproximada' || fieldId === 'especialidadesEmpresaTransporte') {
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
      id: 'packA_pasajeros',
      title: 'Transporte de personas',
      hint: 'Servicios, vehículo y cobertura.',
      fields: [
        { id: 'serviciosTransportePersonas', label: 'Servicios de transporte', type: 'checklist', required: true, options: ['Traslados', 'Ejecutivo', 'Turismo', 'Escolar', 'Otro'] },
        { id: 'tipoVehiculoPasajeros', label: 'Tipo de vehículo', type: 'checklist', required: true, options: ['Sedán', 'SUV', 'Van', 'Microbús', 'Otro'] },
        { id: 'modalidadServicioTransporte', label: 'Modalidad de servicio', type: 'select', required: true, options: MODALIDAD_TRANSPORTE.filter(function (o) { return o.value !== 'internacional'; }) },
        { id: 'tiposClientesTransporte', label: 'Tipos de clientes', type: 'checklist', required: false, options: ['Particulares', 'Corporativo', 'Turistas', 'Otro'] },
        { id: 'tiempoRespuestaTransporte', label: 'Tiempo de respuesta', type: 'select', required: false, options: TIEMPO_RESPUESTA },
        { id: 'permisosLicencias', label: 'Permisos / licencias', type: 'text', required: false, placeholder: 'Licencia, SCT, permiso escolar…' }
      ]
    }];
  }

  function personaBaseBlocks() {
    return [{
      id: 'transporteBase',
      title: 'Perfil transporte',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Experiencia y permisos',
          type: 'textarea',
          required: true,
          rows: 2,
          placeholder: 'Años de experiencia, licencias o certificaciones'
        }
      ]
    }, {
      id: 'transporteTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Tarifa desde (MXN)', type: 'text', required: true },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }

  function negocioBaseBlocks() {
    return [{
      id: 'transporteNegocioBase',
      title: 'Empresa de transporte',
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
      id: 'packB_mensajeria',
      title: 'Mensajería y última milla',
      hint: 'Tipos de envío, vehículo y tiempos de respuesta.',
      fields: [
        { id: 'serviciosMensajeria', label: 'Servicios de mensajería', type: 'checklist', required: true, options: ['Documentos', 'Paquetes', 'Same day', 'Recolección', 'Otro'] },
        { id: 'tiposEnvio', label: 'Tipos de envío', type: 'checklist', required: true, options: ['Urgente', 'Same day', 'Programado', 'Otro'] },
        { id: 'tipoVehiculoMensajeria', label: 'Vehículo', type: 'checklist', required: false, options: ['Moto', 'Auto', 'Van', 'Bicicleta', 'Otro'] },
        { id: 'modalidadServicioTransporte', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_TRANSPORTE.filter(function (o) { return ['local_ciudad', 'metropolitana', 'bajo_demanda'].indexOf(o.value) >= 0; }) },
        { id: 'tiempoRespuestaTransporte', label: 'Tiempo de respuesta', type: 'select', required: true, options: TIEMPO_RESPUESTA }
      ]
    }];
  }

  function packBlocksC() {
    return [{
      id: 'packC_flete',
      title: 'Fletes y mudanzas',
      hint: 'Capacidad, mercancía y cobertura.',
      fields: [
        { id: 'serviciosFleteMudanza', label: 'Servicios de flete / mudanza', type: 'checklist', required: true, options: ['Flete local', 'Mudanza', 'Embalaje', 'Recolección', 'Otro'] },
        { id: 'capacidadCarga', label: 'Capacidad de carga', type: 'text', required: true, placeholder: 'Ej. 1.5 ton · pick-up' },
        { id: 'tiposMercancia', label: 'Tipos de mercancía', type: 'checklist', required: false, options: ['Muebles', 'Cajas', 'Electrodomésticos', 'General', 'Otro'] },
        { id: 'modalidadServicioTransporte', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_TRANSPORTE.filter(function (o) { return o.value !== 'internacional'; }) },
        { id: 'incluyePersonalCarga', label: '¿Incluye personal de carga?', type: 'select', required: false, options: INCLUYE_PERSONAL }
      ]
    }];
  }

  function packBlocksD() {
    return [{
      id: 'packD_carga',
      title: 'Carga y logística operativa',
      hint: 'Tipos de carga, rutas y permisos.',
      fields: [
        { id: 'serviciosLogistica', label: 'Servicios logísticos', type: 'checklist', required: true, options: ['Distribución', 'Carga', 'Almacenaje', 'Rutas fijas', 'Otro'] },
        { id: 'tiposCarga', label: 'Tipos de carga', type: 'checklist', required: true, options: ['General', 'Seca', 'Refrigerada', 'Industrial', 'Otro'] },
        { id: 'capacidadCarga', label: 'Capacidad de carga', type: 'text', required: false, placeholder: '' },
        { id: 'modalidadServicioTransporte', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_TRANSPORTE.filter(function (o) { return o.value !== 'bajo_demanda'; }) },
        { id: 'coberturaRutas', label: 'Rutas / corredores', type: 'text', required: false, placeholder: '' },
        { id: 'permisosLicencias', label: 'Permisos / licencias', type: 'text', required: false, placeholder: '' }
      ]
    }];
  }

  function packBlocksE() {
    return [{
      id: 'packE_empresa',
      title: 'Empresa de transporte',
      hint: 'Servicios, flota y especialidades.',
      fields: [
        { id: 'serviciosEmpresaTransporte', label: 'Servicios de la empresa', type: 'checklist', required: true, options: ['Mensajería', 'Paquetería', 'Logística', 'Distribución', 'Otro'] },
        { id: 'especialidadesEmpresaTransporte', label: 'Especialidades', type: 'text', required: true, placeholder: 'Ej. E-commerce, corporativo…' },
        { id: 'tamanoClienteTransporte', label: 'Tamaño de clientes', type: 'checklist', required: false, options: ['PyME', 'Mediana', 'Corporativo', 'E-commerce', 'Otro'] },
        { id: 'flotaAproximada', label: 'Flota aproximada', type: 'text', required: true, placeholder: 'Ej. 10–25 unidades' },
        { id: 'modalidadServicioTransporte', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_TRANSPORTE }
      ]
    }];
  }

  function packBlocksF() {
    return [{
      id: 'packF_especial',
      title: 'Especialidades',
      hint: 'Internacional, renta u otros servicios especializados.',
      fields: [
        { id: 'serviciosEspecialidadTransporte', label: 'Servicios especializados', type: 'checklist', required: true, options: ['Internacional', 'Aduanas', 'Renta', 'Import/export', 'Otro'] },
        { id: 'modalidadServicioTransporte', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_TRANSPORTE },
        { id: 'coberturaInternacional', label: 'Cobertura internacional', type: 'text', required: false, placeholder: 'Países, aduanas…' },
        { id: 'tiposVehiculoRenta', label: 'Vehículos en renta', type: 'checklist', required: false, options: ['Pick-up', 'Van', 'Camioneta', 'Caja seca', 'Otro'] }
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
    A: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosTransportePersonas', 'tipoVehiculoPasajeros', 'modalidadServicioTransporte', 'coberturaGeografica'],
    B: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosMensajeria', 'tiposEnvio', 'modalidadServicioTransporte', 'coberturaGeografica', 'tiempoRespuestaTransporte'],
    C: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosFleteMudanza', 'capacidadCarga', 'modalidadServicioTransporte', 'coberturaGeografica'],
    D: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosLogistica', 'tiposCarga', 'modalidadServicioTransporte', 'coberturaGeografica'],
    E: ['nombreComercial', 'serviciosEmpresaTransporte', 'especialidadesEmpresaTransporte', 'flotaAproximada', 'modalidadServicioTransporte', 'direccion', 'horarioDetalle'],
    F: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosEspecialidadTransporte', 'modalidadServicioTransporte', 'coberturaGeografica']
  };

  function appendPackBlocks(pack) {
    var fn = PACK_BUILDERS[pack] || packBlocksA;
    return fn();
  }

  var NEGOCIO_SUBS = new Set([
    'mudanzas-pequenas',
    'mudanzas',
    'empresa-de-mensajeria',
    'empresa-de-paqueteria',
    'empresa-de-logistica',
    'renta-de-camionetas'
  ]);

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
      if (pack === 'E') return PACK_OBLIGATORIOS.E.slice();
      if (pack === 'C') {
        return ['nombreComercial', 'serviciosFleteMudanza', 'capacidadCarga', 'modalidadServicioTransporte', 'direccion', 'horarioDetalle'];
      }
      if (pack === 'F') {
        return ['nombreComercial', 'tiposVehiculoRenta', 'serviciosEspecialidadTransporte', 'flotaAproximada', 'modalidadServicioTransporte', 'direccion', 'horarioDetalle'];
      }
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
      id: 'transporte_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'transporte',
      formularioId: formularioId,
      uiIds: isNegocioSub(canonId) ? ['ui_neg_transporte'] : ['ui_ind_transporte'],
      fotosMin: 2,
      obligatorios: mergeObligatoriosFromDelta(resolveBaseObligatorios(canonId, pack), canonId),
      blocks: blocks,
      nestedProfileKey: 'transportePerfil',
      packFlags: {}
    };
  }

  global.CARIHUB_REGISTRO_TRANSPORTE_SECTOR_BLOCKS = {
    id: 'transporte_sector_packs',
    sectorId: 'transporte',
    subToPack: SUB_TO_PACK,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
