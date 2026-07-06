/**
 * Bloques registro — sector Hogar. MP-HOGAR-DELTAS-V1 packs A–D.
 */
(function (global) {
  'use strict';

  var SUB_TO_PACK = {
    'plomeros': 'A',
    'albaniles': 'A',
    'impermeabilizadores': 'A',
    'electricistas': 'B',
    'tecnicos-en-clima-hvac': 'B',
    'instaladores-de-paneles-solares': 'B',
    'tecnicos-en-camaras-de-seguridad': 'B',
    'domotica-casa-inteligente': 'B',
    'carpinteros': 'C',
    'herreros': 'C',
    'instaladores-de-pisos': 'C',
    'cerrajeros': 'C',
    'pintores': 'D',
    'jardineria': 'D',
    'fumigacion': 'D',
    'limpieza-del-hogar': 'D',
    'mantenimiento-general': 'D'
  };

  var MODALIDAD_HOGAR = [
    { value: 'domicilio', label: 'Servicio a domicilio' },
    { value: 'taller', label: 'Taller / bodega propia' },
    { value: 'ambos', label: 'Domicilio y taller' },
    { value: 'emergencia_24h', label: 'Emergencias / 24 horas' }
  ];

  var TIEMPO_RESPUESTA = [
    { value: 'emergencia_2h', label: 'Emergencia (~2 h)' },
    { value: 'mismo_dia', label: 'Mismo día' },
    { value: '24_48h', label: '24–48 horas' },
    { value: 'por_cita', label: 'Con cita programada' }
  ];

  var ANOS_EXPERIENCIA = [
    { value: '1_3', label: '1–3 años' },
    { value: '4_7', label: '4–7 años' },
    { value: '8_15', label: '8–15 años' },
    { value: '16_mas', label: '16+ años' }
  ];

  var MATERIALES_OPTS = [
    { value: 'solo_mano_obra', label: 'Solo mano de obra' },
    { value: 'con_materiales', label: 'Mano de obra + materiales' },
    { value: 'mixto', label: 'Depende del trabajo' },
    { value: 'convenir', label: 'A convenir por proyecto' }
  ];

  var FIELD_LABELS = {
    modalidadServicioHogar: 'Modalidad de servicio',
    serviciosHogar: 'Servicios que ofreces',
    especialidadesHogar: 'Especialidades',
    tiposTrabajoHogar: 'Tipos de trabajo',
    tiposInmueble: 'Tipos de inmueble',
    tiempoRespuestaHogar: 'Tiempo de respuesta',
    garantiaServicioHogar: 'Garantía del servicio',
    anosExperienciaHogar: 'Años de experiencia',
    materialesIncluidos: 'Materiales incluidos',
    diferenciadorHogar: 'Tu sello en el oficio',
    coberturaGeografica: 'Zona de cobertura',
    colaboracionesComerciales: '¿Colaboras con otros oficios o constructoras?',
    tiposColaboracionComercial: 'Tipo de colaboraciones'
  };

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolvePack(subId) { return SUB_TO_PACK[slugSubId(subId)] || 'A'; }

  function getSubDeltaApi() {
    return {
      meta: global.CARIHUB_HOGAR_SUB_CANON_META || {},
      deltas: global.CARIHUB_HOGAR_SUB_DELTAS || {}
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
    if (fieldId === 'modalidadServicioHogar') {
      return { id: fieldId, label: label, type: 'select', options: MODALIDAD_HOGAR };
    }
    if (fieldId === 'tiempoRespuestaHogar') {
      return { id: fieldId, label: label, type: 'select', options: TIEMPO_RESPUESTA };
    }
    if (fieldId === 'anosExperienciaHogar') {
      return { id: fieldId, label: label, type: 'select', options: ANOS_EXPERIENCIA };
    }
    if (fieldId === 'materialesIncluidos') {
      return { id: fieldId, label: label, type: 'select', options: MATERIALES_OPTS };
    }
    if (fieldId === 'diferenciadorHogar' || fieldId === 'coberturaGeografica' ||
        fieldId === 'garantiaServicioHogar') {
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
      id: 'hogarBase',
      title: 'Perfil oficio hogar',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Experiencia y certificaciones',
          type: 'textarea',
          required: true,
          rows: 2,
          placeholder: 'Años de experiencia, cursos o certificaciones'
        }
      ]
    }, {
      id: 'hogarTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Tarifa desde (MXN)', type: 'text', required: true },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }

  function packBlocksA() {
    return [{
      id: 'packA_obra',
      title: 'Obra húmeda y albañilería',
      hint: 'Servicios, modalidad y cobertura.',
      fields: [
        { id: 'serviciosHogar', label: 'Servicios', type: 'checklist', required: true, options: ['Instalación', 'Reparación', 'Obra menor', 'Urgencias', 'Otro'] },
        { id: 'especialidadesHogar', label: 'Especialidades', type: 'checklist', required: false, options: ['Residencial', 'Comercial', 'Otro'] },
        { id: 'modalidadServicioHogar', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_HOGAR },
        { id: 'tiposInmueble', label: 'Tipos de inmueble', type: 'checklist', required: false, options: ['Casa', 'Departamento', 'Local', 'Otro'] },
        { id: 'tiempoRespuestaHogar', label: 'Tiempo de respuesta', type: 'select', required: true, options: TIEMPO_RESPUESTA },
        { id: 'garantiaServicioHogar', label: 'Garantía', type: 'text', required: false, placeholder: '' },
        { id: 'materialesIncluidos', label: 'Materiales', type: 'select', required: false, options: MATERIALES_OPTS }
      ]
    }];
  }

  function packBlocksB() {
    return [{
      id: 'packB_tecnico',
      title: 'Electricidad y tecnología hogar',
      hint: 'Servicios técnicos y especialidades.',
      fields: [
        { id: 'serviciosHogar', label: 'Servicios', type: 'checklist', required: true, options: ['Instalación', 'Reparación', 'Mantenimiento', 'Urgencias', 'Otro'] },
        { id: 'especialidadesHogar', label: 'Especialidades', type: 'checklist', required: true, options: ['Residencial', 'Comercial', 'Otro'] },
        { id: 'modalidadServicioHogar', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_HOGAR },
        { id: 'tiposInmueble', label: 'Tipos de inmueble', type: 'checklist', required: false, options: ['Casa', 'Departamento', 'Local', 'Otro'] },
        { id: 'tiempoRespuestaHogar', label: 'Tiempo de respuesta', type: 'select', required: false, options: TIEMPO_RESPUESTA },
        { id: 'anosExperienciaHogar', label: 'Años de experiencia', type: 'select', required: false, options: ANOS_EXPERIENCIA }
      ]
    }];
  }

  function packBlocksC() {
    return [{
      id: 'packC_instalacion',
      title: 'Carpintería, herrería e instalaciones',
      hint: 'Tipos de trabajo y materiales.',
      fields: [
        { id: 'serviciosHogar', label: 'Servicios', type: 'checklist', required: true, options: ['Instalación', 'Fabricación', 'Reparación', 'Otro'] },
        { id: 'tiposTrabajoHogar', label: 'Tipos de trabajo', type: 'checklist', required: false, options: ['A medida', 'Reparación', 'Estructural', 'Otro'] },
        { id: 'modalidadServicioHogar', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_HOGAR.filter(function (o) { return o.value !== 'emergencia_24h'; }) },
        { id: 'materialesIncluidos', label: 'Materiales', type: 'select', required: false, options: MATERIALES_OPTS },
        { id: 'tiposInmueble', label: 'Tipos de inmueble', type: 'checklist', required: false, options: ['Casa', 'Departamento', 'Local', 'Otro'] }
      ]
    }];
  }

  function packBlocksD() {
    return [{
      id: 'packD_mantenimiento',
      title: 'Acabados, jardín y mantenimiento',
      hint: 'Servicios y cobertura.',
      fields: [
        { id: 'serviciosHogar', label: 'Servicios', type: 'checklist', required: true, options: ['Mantenimiento', 'Instalación', 'Limpieza', 'Otro'] },
        { id: 'modalidadServicioHogar', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_HOGAR },
        { id: 'tiposInmueble', label: 'Tipos de inmueble', type: 'checklist', required: false, options: ['Casa', 'Departamento', 'Local', 'Otro'] },
        { id: 'tiempoRespuestaHogar', label: 'Tiempo de respuesta', type: 'select', required: false, options: TIEMPO_RESPUESTA },
        { id: 'materialesIncluidos', label: 'Materiales', type: 'select', required: false, options: MATERIALES_OPTS }
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
    A: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosHogar', 'modalidadServicioHogar', 'coberturaGeografica', 'tiempoRespuestaHogar'],
    B: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosHogar', 'especialidadesHogar', 'modalidadServicioHogar', 'coberturaGeografica'],
    C: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosHogar', 'modalidadServicioHogar', 'coberturaGeografica'],
    D: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosHogar', 'modalidadServicioHogar', 'coberturaGeografica']
  };

  function appendPackBlocks(pack) {
    var fn = PACK_BUILDERS[pack] || packBlocksA;
    return fn();
  }

  function mergeObligatoriosFromDelta(packOblig, subId) {
    var delta = getSubDeltaApi().deltas[subId];
    var list = (packOblig || []).slice();
    if (!delta || !Array.isArray(delta.obligatoriosDelta)) return list;
    delta.obligatoriosDelta.forEach(function (fid) {
      if (fid === 'geo') return;
      if (list.indexOf(fid) < 0) list.push(fid);
    });
    return list;
  }

  function buildConfig(ctx) {
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || '');
    var pack = resolvePack(canonId);
    var blocks = personaBaseBlocks().concat(appendPackBlocks(pack));
    blocks = applySubDeltaToBlocks(blocks, canonId);
    return {
      id: 'hogar_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'hogar',
      formularioId: 'persona_independiente',
      uiIds: ['ui_ind_hogar'],
      fotosMin: 2,
      obligatorios: mergeObligatoriosFromDelta((PACK_OBLIGATORIOS[pack] || PACK_OBLIGATORIOS.A).slice(), canonId),
      blocks: blocks,
      nestedProfileKey: 'hogarPerfil',
      packFlags: {}
    };
  }

  global.CARIHUB_REGISTRO_HOGAR_SECTOR_BLOCKS = {
    id: 'hogar_sector_packs',
    sectorId: 'hogar',
    subToPack: SUB_TO_PACK,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
