/**
 * Bloques registro — sector Industria. MP-INDUSTRIA-DELTAS-V1 packs A–E.
 */
(function (global) {
  'use strict';

  var SUB_TO_PACK = {
    'consultor-empresarial-independiente': 'A',
    'auditor-independiente': 'A',
    'reclutador-independiente': 'A',
    'asesor-de-procesos': 'A',
    'inspector-de-calidad': 'A',
    'consultor-iso': 'A',
    'gestor-de-tramites-empresariales': 'A',
    'consultoria-fiscal': 'A',
    'consultoria-legal': 'A',
    'certificaciones-iso': 'A',
    'servicios-contables': 'A',
    'servicios-administrativos': 'A',
    'servicios-corporativos': 'A',
    'empaques-y-embalaje': 'A',
    'contador-publico': 'B',
    'administrador-de-empresas': 'B',
    'ingeniero-industrial': 'B',
    'ingeniero-en-procesos': 'B',
    'especialista-en-seguridad-industrial': 'B',
    'manufactura': 'C',
    'maquila': 'C',
    'automatizacion-industrial': 'C',
    'maquinaria-industrial': 'C',
    'soldadura-industrial': 'C',
    'supervisor-industrial': 'D',
    'tecnico-industrial': 'D',
    'seguridad-industrial': 'D',
    'mantenimiento-industrial': 'D',
    'limpieza-industrial': 'D',
    'outsourcing': 'E',
    'call-center': 'E',
    'centro-de-negocios-empresarial': 'E',
    'ingenieria-industrial': 'E'
  };

  var PROFESIONISTA_SUBS = {
    'contador-publico': true,
    'administrador-de-empresas': true,
    'ingeniero-industrial': true,
    'ingeniero-en-procesos': true,
    'especialista-en-seguridad-industrial': true
  };

  var NEGOCIO_SUBS = {
    'supervisor-industrial': true,
    'tecnico-industrial': true,
    'outsourcing': true,
    'seguridad-industrial': true,
    'call-center': true,
    'centro-de-negocios-empresarial': true,
    'manufactura': true,
    'maquila': true,
    'automatizacion-industrial': true,
    'ingenieria-industrial': true,
    'maquinaria-industrial': true,
    'mantenimiento-industrial': true,
    'soldadura-industrial': true,
    'limpieza-industrial': true
  };

  var MODALIDAD_IND = [
    { value: 'planta', label: 'En planta / parque industrial' },
    { value: 'sitio_cliente', label: 'En sitio del cliente' },
    { value: 'remoto', label: 'Remoto / consultoría' },
    { value: 'mixto', label: 'Mixto presencial y remoto' },
    { value: 'instalaciones', label: 'Instalaciones propias' }
  ];

  var TIEMPO_RESPUESTA = [
    { value: 'inmediato', label: 'Inmediato / urgencias' },
    { value: 'mismo_dia', label: 'Mismo día' },
    { value: '24_48h', label: '24–48 horas' },
    { value: 'por_cita', label: 'Con cita programada' }
  ];

  var FIELD_LABELS = {
    modalidadServicioIndustrial: 'Modalidad de servicio',
    serviciosIndustriales: 'Servicios industriales',
    serviciosEmpresaIndustrial: 'Servicios de la empresa',
    serviciosProfesionalesIndustrial: 'Servicios profesionales',
    sectoresIndustriales: 'Sectores / industrias atendidas',
    procesosIndustriales: 'Procesos o líneas',
    certificacionesIndustriales: 'Certificaciones (ISO, NOM…)',
    capacidadProduccion: 'Capacidad / volumen',
    equipamientoIndustrial: 'Equipamiento principal',
    especialidadIndustrial: 'Especialidad industrial',
    tiempoRespuestaIndustrial: 'Tiempo de respuesta',
    diferenciadorIndustrial: 'Tu sello industrial',
    coberturaGeografica: 'Zona de cobertura',
    colaboracionesComerciales: '¿Colaboras con plantas, maquiladoras o integradores?',
    tiposColaboracionComercial: 'Tipo de colaboraciones',
    nombreProfesional: 'Nombre profesional público',
    precioConsulta: 'Precio / tarifa desde (MXN)',
    horarioAtencion: 'Horario de atención'
  };

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolvePack(subId) { return SUB_TO_PACK[slugSubId(subId)] || 'A'; }

  function isProfesionistaSub(subId) { return !!PROFESIONISTA_SUBS[slugSubId(subId)]; }

  function isNegocioSub(subId) { return !!NEGOCIO_SUBS[slugSubId(subId)]; }

  function getSubDeltaApi() {
    return {
      meta: global.CARIHUB_INDUSTRIA_SUB_CANON_META || {},
      deltas: global.CARIHUB_INDUSTRIA_SUB_DELTAS || {}
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
    if (fieldId === 'modalidadServicioIndustrial') {
      return { id: fieldId, label: label, type: 'select', options: MODALIDAD_IND };
    }
    if (fieldId === 'tiempoRespuestaIndustrial') {
      return { id: fieldId, label: label, type: 'select', options: TIEMPO_RESPUESTA };
    }
    if (fieldId === 'diferenciadorIndustrial' || fieldId === 'coberturaGeografica' ||
        fieldId === 'capacidadProduccion' || fieldId === 'equipamientoIndustrial' ||
        fieldId === 'especialidadIndustrial') {
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
        if (field.id === 'nombreProfesional' && delta.aliasPlaceholder && !field.placeholder) {
          field.placeholder = delta.aliasPlaceholder;
        }
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
      id: 'industriaBase',
      title: 'Perfil industrial',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Experiencia y certificaciones',
          type: 'textarea',
          required: false,
          rows: 2,
          placeholder: 'ISO, años de experiencia, sectores'
        }
      ]
    }, {
      id: 'industriaTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Tarifa desde (MXN)', type: 'text', required: true },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }

  function negocioBaseBlocks() {
    return [{
      id: 'industriaNegocioBase',
      title: 'Empresa industrial',
      fields: [
        { id: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        { id: 'direccion', label: 'Dirección o zona pública', type: 'textarea', required: true, rows: 2 },
        { id: 'horarioDetalle', label: 'Horario', type: 'text', required: true }
      ]
    }];
  }

  function profesionistaBlocks() {
    return [{
      id: 'packB_prof',
      title: 'Profesional industrial (cédula)',
      hint: 'Datos públicos — cédula se valida en sección privada.',
      fields: [
        { id: 'nombreProfesional', label: 'Nombre profesional público', type: 'text', required: true },
        { id: 'especialidadIndustrial', label: 'Especialidad industrial', type: 'text', required: true },
        {
          id: 'serviciosProfesionalesIndustrial',
          label: 'Servicios profesionales',
          type: 'checklist',
          required: true,
          options: ['Consultoría', 'Auditoría', 'Diseño', 'Capacitación', 'Otro']
        },
        {
          id: 'sectoresIndustriales',
          label: 'Sectores atendidos',
          type: 'checklist',
          required: true,
          options: ['Automotriz', 'Alimentos', 'Metalmecánica', 'Otro']
        },
        {
          id: 'modalidadServicioIndustrial',
          label: 'Modalidad',
          type: 'select',
          required: true,
          options: MODALIDAD_IND.filter(function (o) {
            return ['planta', 'sitio_cliente', 'remoto', 'mixto'].indexOf(o.value) >= 0;
          })
        },
        { id: 'precioConsulta', label: 'Precio / tarifa desde (MXN)', type: 'text', required: true },
        { id: 'horarioAtencion', label: 'Horario de atención', type: 'text', required: true },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksA() {
    return [{
      id: 'packA_consultoria',
      title: 'Consultoría y servicios',
      hint: 'Servicios, sectores y cobertura.',
      fields: [
        { id: 'serviciosIndustriales', label: 'Servicios', type: 'checklist', required: true, options: ['Consultoría', 'Auditoría', 'Capacitación', 'Otro'] },
        { id: 'sectoresIndustriales', label: 'Sectores', type: 'checklist', required: true, options: ['Automotriz', 'Alimentos', 'Metalmecánica', 'Otro'] },
        { id: 'modalidadServicioIndustrial', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_IND },
        { id: 'certificacionesIndustriales', label: 'Certificaciones', type: 'checklist', required: false, options: ['ISO 9001', 'ISO 45001', 'NOM-030', 'Otro'] },
        { id: 'tiempoRespuestaIndustrial', label: 'Tiempo de respuesta', type: 'select', required: true, options: TIEMPO_RESPUESTA },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksC() {
    return [{
      id: 'packC_manufactura',
      title: 'Manufactura y producción',
      hint: 'Procesos, capacidad y certificaciones.',
      fields: [
        { id: 'serviciosEmpresaIndustrial', label: 'Servicios', type: 'checklist', required: true, options: ['Producción', 'Ensamble', 'Maquinado', 'Otro'] },
        { id: 'procesosIndustriales', label: 'Procesos', type: 'checklist', required: true, options: ['Ensamble', 'Maquinado', 'Soldadura', 'Otro'] },
        { id: 'sectoresIndustriales', label: 'Sectores', type: 'checklist', required: true, options: ['Automotriz', 'Alimentos', 'Metalmecánica', 'Otro'] },
        { id: 'capacidadProduccion', label: 'Capacidad', type: 'text', required: true, placeholder: '' },
        { id: 'certificacionesIndustriales', label: 'Certificaciones', type: 'checklist', required: false, options: ['ISO 9001', 'IATF 16949', 'Otro'] },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksD() {
    return [{
      id: 'packD_servicios',
      title: 'Servicios industriales',
      hint: 'Servicios en planta y cobertura.',
      fields: [
        { id: 'serviciosEmpresaIndustrial', label: 'Servicios', type: 'checklist', required: true, options: ['Mantenimiento', 'Supervisión', 'Seguridad', 'Limpieza', 'Otro'] },
        { id: 'procesosIndustriales', label: 'Procesos', type: 'checklist', required: false, options: ['Preventivo', 'Correctivo', 'Producción', 'Otro'] },
        { id: 'sectoresIndustriales', label: 'Sectores', type: 'checklist', required: true, options: ['Automotriz', 'Alimentos', 'Metalmecánica', 'Otro'] },
        { id: 'modalidadServicioIndustrial', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_IND },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksE() {
    return [{
      id: 'packE_corporativo',
      title: 'Corporativo y outsourcing',
      hint: 'Servicios B2B y cobertura.',
      fields: [
        { id: 'serviciosEmpresaIndustrial', label: 'Servicios', type: 'checklist', required: true, options: ['Outsourcing', 'Call center', 'Ingeniería', 'Oficinas', 'Otro'] },
        { id: 'sectoresIndustriales', label: 'Sectores', type: 'checklist', required: true, options: ['Automotriz', 'Alimentos', 'Metalmecánica', 'Otro'] },
        { id: 'modalidadServicioIndustrial', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_IND },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function appendPackBlocks(pack) {
    if (pack === 'B') return profesionistaBlocks();
    if (pack === 'C') return packBlocksC();
    if (pack === 'D') return packBlocksD();
    if (pack === 'E') return packBlocksE();
    return packBlocksA();
  }

  var PACK_OBLIGATORIOS = {
    A: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosIndustriales', 'sectoresIndustriales', 'modalidadServicioIndustrial', 'coberturaGeografica', 'tiempoRespuestaIndustrial'],
    B: ['nombreProfesional', 'especialidadIndustrial', 'serviciosProfesionalesIndustrial', 'modalidadServicioIndustrial', 'precioConsulta', 'horarioAtencion', 'coberturaGeografica'],
    C: ['nombreComercial', 'serviciosEmpresaIndustrial', 'sectoresIndustriales', 'capacidadProduccion', 'direccion', 'horarioDetalle', 'coberturaGeografica'],
    D: ['nombreComercial', 'serviciosEmpresaIndustrial', 'sectoresIndustriales', 'modalidadServicioIndustrial', 'direccion', 'horarioDetalle', 'coberturaGeografica'],
    E: ['nombreComercial', 'serviciosEmpresaIndustrial', 'sectoresIndustriales', 'direccion', 'horarioDetalle', 'coberturaGeografica']
  };

  function inferFormularioId(canonId, ctx) {
    if (ctx && ctx.formularioId) return ctx.formularioId;
    if (isProfesionistaSub(canonId)) return 'profesionista_cedula';
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
      if (isProfesionistaSub(subId) && personaOnly[fid]) return;
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
    if (isProfesionistaSub(canonId)) {
      blocks = appendPackBlocks(pack);
    } else if (isNegocioSub(canonId)) {
      blocks = negocioBaseBlocks().concat(appendPackBlocks(pack));
    } else {
      blocks = personaBaseBlocks().concat(appendPackBlocks(pack));
    }
    blocks = applySubDeltaToBlocks(blocks, canonId);
    var uiIds = ['ui_ind_industria'];
    if (isProfesionistaSub(canonId)) uiIds = ['ui_prof_industria'];
    if (isNegocioSub(canonId)) uiIds = ['ui_neg_industria'];
    return {
      id: 'industria_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'industria',
      formularioId: formularioId,
      uiIds: uiIds,
      fotosMin: fotosMinForSub(canonId),
      obligatorios: mergeObligatoriosFromDelta(resolveBaseObligatorios(canonId, pack), canonId),
      blocks: blocks,
      nestedProfileKey: 'industriaPerfil',
      packFlags: isProfesionistaSub(canonId) ? { requiresCedula: true, nivelRevisionAdmin: 'alta' } : {}
    };
  }

  global.CARIHUB_REGISTRO_INDUSTRIA_SECTOR_BLOCKS = {
    id: 'industria_sector_packs',
    sectorId: 'industria',
    subToPack: SUB_TO_PACK,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
