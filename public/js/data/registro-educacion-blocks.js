/**
 * Bloques registro — sector Educación. MP-EDUCACION-DELTAS-V1 packs A–E.
 */
(function (global) {
  'use strict';

  var SUB_TO_PACK = {
    'maestro-particular': 'A',
    'tutor-academico': 'A',
    'profesor-de-idiomas': 'A',
    'profesor-de-matematicas': 'A',
    'profesor-de-musica': 'A',
    'profesor-de-arte': 'A',
    'coach-educativo': 'A',
    'instructor-de-manejo': 'A',
    'instructor-deportivo': 'A',
    'instructor-de-computacion': 'A',
    'psicopedagogo': 'B',
    'pedagogo': 'B',
    'docente-certificado': 'B',
    'especialista-en-educacion-especial': 'B',
    'academia-de-idiomas': 'C',
    'escuela-de-musica': 'C',
    'escuela-de-arte': 'C',
    'escuela-de-manejo': 'C',
    'escuela-tecnica': 'C',
    'capacitador-empresarial': 'D',
    'centro-de-capacitacion': 'D',
    'instituto-educativo': 'D',
    'centro-de-certificaciones': 'D',
    'plataforma-educativa': 'D',
    'escuelas': 'D',
    'universidades': 'E',
    'cursos-en-linea': 'E',
    'preparatoria': 'E',
    'guarderias': 'E',
    'talleres-creativos': 'E'
  };

  var PROFESIONISTA_SUBS = {
    'psicopedagogo': true,
    'pedagogo': true,
    'docente-certificado': true,
    'especialista-en-educacion-especial': true
  };

  var NEGOCIO_SUBS = {
    'capacitador-empresarial': true,
    'academia-de-idiomas': true,
    'escuela-de-musica': true,
    'escuela-de-arte': true,
    'centro-de-capacitacion': true,
    'instituto-educativo': true,
    'escuela-tecnica': true,
    'escuela-de-manejo': true,
    'centro-de-certificaciones': true,
    'plataforma-educativa': true,
    'escuelas': true
  };

  var MODALIDAD_EDUC = [
    { value: 'presencial', label: 'Presencial' },
    { value: 'online', label: 'En línea' },
    { value: 'hibrido', label: 'Híbrido' },
    { value: 'domicilio', label: 'A domicilio' },
    { value: 'instalaciones', label: 'En instalaciones propias' }
  ];

  var TIEMPO_RESPUESTA = [
    { value: 'inmediato', label: 'Inmediato' },
    { value: 'mismo_dia', label: 'Mismo día' },
    { value: '24_48h', label: '24–48 horas' },
    { value: 'por_cita', label: 'Con cita programada' }
  ];

  var FIELD_LABELS = {
    modalidadEducacion: 'Modalidad de enseñanza',
    serviciosEducacion: 'Servicios educativos',
    serviciosEmpresaEducacion: 'Servicios del centro',
    materiasEducativas: 'Materias o áreas',
    nivelesEducativos: 'Niveles educativos',
    edadesAtendidas: 'Edades que atiendes',
    formatoClase: 'Formato de clase',
    especialidadEducativa: 'Especialidad educativa',
    serviciosProfesionalesEducacion: 'Servicios profesionales',
    certificacionesEducativas: 'Certificaciones / acreditaciones',
    idiomasEnsenanza: 'Idiomas que enseñas',
    tiempoRespuestaEducacion: 'Tiempo de respuesta',
    diferenciadorEducacion: 'Tu sello educativo',
    coberturaGeografica: 'Zona de cobertura',
    colaboracionesComerciales: '¿Colaboras con escuelas, empresas o instituciones?',
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
      meta: global.CARIHUB_EDUCACION_SUB_CANON_META || {},
      deltas: global.CARIHUB_EDUCACION_SUB_DELTAS || {}
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
    if (fieldId === 'modalidadEducacion') {
      return { id: fieldId, label: label, type: 'select', options: MODALIDAD_EDUC };
    }
    if (fieldId === 'tiempoRespuestaEducacion') {
      return { id: fieldId, label: label, type: 'select', options: TIEMPO_RESPUESTA };
    }
    if (fieldId === 'diferenciadorEducacion' || fieldId === 'coberturaGeografica' ||
        fieldId === 'especialidadEducativa' || fieldId === 'certificacionesEducativas') {
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
      id: 'educacionBase',
      title: 'Perfil educativo',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Experiencia y certificaciones',
          type: 'textarea',
          required: false,
          rows: 2,
          placeholder: 'Título, cursos o años de experiencia'
        }
      ]
    }, {
      id: 'educacionTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Tarifa desde (MXN)', type: 'text', required: true },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }

  function negocioBaseBlocks() {
    return [{
      id: 'educacionNegocioBase',
      title: 'Centro educativo',
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
      title: 'Profesional educativo (cédula)',
      hint: 'Datos públicos — cédula se valida en sección privada.',
      fields: [
        { id: 'nombreProfesional', label: 'Nombre profesional público', type: 'text', required: true },
        { id: 'especialidadEducativa', label: 'Especialidad educativa', type: 'text', required: true },
        {
          id: 'serviciosProfesionalesEducacion',
          label: 'Servicios profesionales',
          type: 'checklist',
          required: true,
          options: ['Asesoría', 'Evaluación', 'Intervención', 'Capacitación', 'Otro']
        },
        {
          id: 'materiasEducativas',
          label: 'Materias o áreas',
          type: 'checklist',
          required: false,
          options: ['Pedagogía', 'Psicopedagogía', 'Educación especial', 'Otro']
        },
        {
          id: 'modalidadEducacion',
          label: 'Modalidad',
          type: 'select',
          required: true,
          options: MODALIDAD_EDUC.filter(function (o) {
            return ['presencial', 'online', 'hibrido', 'domicilio'].indexOf(o.value) >= 0;
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
      id: 'packA_docencia',
      title: 'Docencia e instructores',
      hint: 'Materias, modalidad y cobertura.',
      fields: [
        { id: 'serviciosEducacion', label: 'Servicios', type: 'checklist', required: true, options: ['Clases', 'Tutoría', 'Curso', 'Preparación', 'Otro'] },
        { id: 'materiasEducativas', label: 'Materias', type: 'checklist', required: true, options: ['General', 'Idiomas', 'Matemáticas', 'Arte', 'Deporte', 'Otro'] },
        { id: 'modalidadEducacion', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_EDUC },
        { id: 'formatoClase', label: 'Formato', type: 'checklist', required: false, options: ['Individual', 'Grupal', 'Taller', 'Otro'] },
        { id: 'nivelesEducativos', label: 'Niveles', type: 'checklist', required: false, options: ['Primaria', 'Secundaria', 'Preparatoria', 'Universidad', 'Adultos', 'Otro'] },
        { id: 'tiempoRespuestaEducacion', label: 'Tiempo de respuesta', type: 'select', required: true, options: TIEMPO_RESPUESTA },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksC() {
    return [{
      id: 'packC_academia',
      title: 'Academias especializadas',
      hint: 'Programas y modalidad del centro.',
      fields: [
        { id: 'serviciosEmpresaEducacion', label: 'Programas', type: 'checklist', required: true, options: ['Grupos', 'Privado', 'Intensivo', 'Certificación', 'Otro'] },
        { id: 'materiasEducativas', label: 'Materias', type: 'checklist', required: true, options: ['Idiomas', 'Música', 'Arte', 'Manejo', 'Técnico', 'Otro'] },
        { id: 'modalidadEducacion', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_EDUC },
        { id: 'formatoClase', label: 'Formato', type: 'checklist', required: false, options: ['Grupal', 'Individual', 'Taller', 'Otro'] },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksD() {
    return [{
      id: 'packD_institucion',
      title: 'Centros e instituciones',
      hint: 'Programas, niveles y cobertura.',
      fields: [
        { id: 'serviciosEmpresaEducacion', label: 'Servicios', type: 'checklist', required: true, options: ['Cursos', 'Diplomados', 'Certificación', 'Escolar', 'Otro'] },
        { id: 'nivelesEducativos', label: 'Niveles', type: 'checklist', required: true, options: ['Preescolar', 'Primaria', 'Secundaria', 'Universidad', 'Empresarial', 'Otro'] },
        { id: 'modalidadEducacion', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_EDUC },
        { id: 'certificacionesEducativas', label: 'Certificaciones', type: 'text', required: false, placeholder: '' },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksE() {
    return [{
      id: 'packE_formal',
      title: 'Educación formal y alternativa',
      hint: 'Programas, niveles y modalidad.',
      fields: [
        { id: 'serviciosEducacion', label: 'Programas', type: 'checklist', required: true, options: ['Escolar', 'Universidad', 'En línea', 'Guardería', 'Taller', 'Otro'] },
        { id: 'nivelesEducativos', label: 'Niveles', type: 'checklist', required: true, options: ['Preescolar', 'Preparatoria', 'Universidad', 'Posgrado', 'Otro'] },
        { id: 'modalidadEducacion', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_EDUC },
        { id: 'edadesAtendidas', label: 'Edades', type: 'checklist', required: false, options: ['3–6 años', '7–12 años', '13–17 años', '18+ adultos', 'Todas'] },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function appendPackBlocks(pack, canonId) {
    if (pack === 'B') return profesionistaBlocks();
    if (pack === 'C') return packBlocksC();
    if (pack === 'D') return packBlocksD();
    if (pack === 'E') return packBlocksE();
    return packBlocksA();
  }

  var PACK_OBLIGATORIOS = {
    A: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosEducacion', 'materiasEducativas', 'modalidadEducacion', 'coberturaGeografica', 'tiempoRespuestaEducacion'],
    B: ['nombreProfesional', 'especialidadEducativa', 'serviciosProfesionalesEducacion', 'modalidadEducacion', 'precioConsulta', 'horarioAtencion', 'coberturaGeografica'],
    C: ['nombreComercial', 'serviciosEmpresaEducacion', 'materiasEducativas', 'modalidadEducacion', 'direccion', 'horarioDetalle', 'coberturaGeografica'],
    D: ['nombreComercial', 'serviciosEmpresaEducacion', 'nivelesEducativos', 'modalidadEducacion', 'direccion', 'horarioDetalle', 'coberturaGeografica'],
    E: ['alias', 'serviciosEducacion', 'nivelesEducativos', 'modalidadEducacion', 'coberturaGeografica', 'tarifaDesde', 'horarioDetalle']
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
      blocks = appendPackBlocks(pack, canonId);
    } else if (isNegocioSub(canonId)) {
      blocks = negocioBaseBlocks().concat(appendPackBlocks(pack, canonId));
    } else {
      blocks = personaBaseBlocks().concat(appendPackBlocks(pack, canonId));
    }
    blocks = applySubDeltaToBlocks(blocks, canonId);
    var uiIds = ['ui_ind_educacion'];
    if (isProfesionistaSub(canonId)) uiIds = ['ui_prof_educacion'];
    if (isNegocioSub(canonId)) uiIds = ['ui_neg_educacion'];
    return {
      id: 'educacion_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'educacion',
      formularioId: formularioId,
      uiIds: uiIds,
      fotosMin: fotosMinForSub(canonId),
      obligatorios: mergeObligatoriosFromDelta(resolveBaseObligatorios(canonId, pack), canonId),
      blocks: blocks,
      nestedProfileKey: 'educacionPerfil',
      packFlags: isProfesionistaSub(canonId) ? { requiresCedula: true, nivelRevisionAdmin: 'alta' } : {}
    };
  }

  global.CARIHUB_REGISTRO_EDUCACION_SECTOR_BLOCKS = {
    id: 'educacion_sector_packs',
    sectorId: 'educacion',
    subToPack: SUB_TO_PACK,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
