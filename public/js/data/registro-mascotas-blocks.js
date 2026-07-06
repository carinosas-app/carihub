/**
 * Bloques registro — sector Mascotas. MP-MASCOTAS-DELTAS-V1 packs A–E.
 */
(function (global) {
  'use strict';

  var SUB_TO_PACK = {
    'paseador-de-perros': 'A',
    'cuidador-de-mascotas': 'A',
    'guarderia-para-mascotas': 'A',
    'hotel-para-mascotas': 'A',
    'entrenador-canino': 'B',
    'adiestrador': 'B',
    'centro-de-entrenamiento-canino': 'B',
    'groomer': 'C',
    'estetica-canina': 'C',
    'fotografo-de-mascotas': 'C',
    'medico-veterinario': 'D',
    'veterinario-especialista': 'D',
    'cirujano-veterinario': 'D',
    'clinica-veterinaria': 'D',
    'hospital-veterinario': 'D',
    'farmacia-veterinaria': 'D',
    'tienda-de-mascotas': 'E',
    'criadero-autorizado': 'E',
    'rescatista-independiente': 'E',
    'servicio-funerario-para-mascotas': 'E'
  };

  var PROFESIONISTA_SUBS = {
    'medico-veterinario': true,
    'veterinario-especialista': true,
    'cirujano-veterinario': true,
    'farmacia-veterinaria': true
  };

  var NEGOCIO_SUBS = {
    'clinica-veterinaria': true,
    'hospital-veterinario': true,
    'estetica-canina': true,
    'centro-de-entrenamiento-canino': true
  };

  var MODALIDAD_MASCOTAS = [
    { value: 'domicilio', label: 'A domicilio' },
    { value: 'consultorio', label: 'Consultorio / local' },
    { value: 'clinica', label: 'Clínica / instalaciones' },
    { value: 'instalaciones', label: 'Instalaciones propias' },
    { value: 'online', label: 'En línea' },
    { value: 'ambos', label: 'Presencial y en línea' }
  ];

  var TIEMPO_RESPUESTA = [
    { value: 'inmediato', label: 'Inmediato / urgencias' },
    { value: 'mismo_dia', label: 'Mismo día' },
    { value: '24_48h', label: '24–48 horas' },
    { value: 'por_cita', label: 'Con cita programada' }
  ];

  var EMERGENCIAS_OPTS = [
    { value: 'si_24h', label: 'Sí, 24 horas' },
    { value: 'si_horario', label: 'Sí, en horario limitado' },
    { value: 'no', label: 'No' },
    { value: 'derivacion', label: 'Solo derivación' }
  ];

  var FIELD_LABELS = {
    modalidadServicioMascotas: 'Modalidad de servicio',
    serviciosMascotas: 'Servicios para mascotas',
    serviciosVeterinarios: 'Servicios veterinarios',
    serviciosEmpresaMascotas: 'Servicios del establecimiento',
    especiesAtendidas: 'Especies que atiendes',
    tamanoMascotasAtendidas: 'Tamaños de mascota',
    especialidadVeterinaria: 'Especialidad veterinaria',
    especialidadesVeterinarias: 'Especialidades veterinarias',
    especialidadesEmpresaMascotas: 'Especialidades',
    emergenciasMascotas: '¿Atiendes emergencias?',
    capacidadInstalacion: 'Capacidad / cupo',
    tiempoRespuestaMascotas: 'Tiempo de respuesta',
    diferenciadorMascotas: 'Tu sello con mascotas',
    coberturaGeografica: 'Zona de cobertura',
    colaboracionesComerciales: '¿Colaboras con veterinarios, refugios o tiendas?',
    tiposColaboracionComercial: 'Tipo de colaboraciones',
    nombreProfesional: 'Nombre profesional público',
    precioConsulta: 'Precio consulta desde (MXN)',
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
      meta: global.CARIHUB_MASCOTAS_SUB_CANON_META || {},
      deltas: global.CARIHUB_MASCOTAS_SUB_DELTAS || {}
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
    if (fieldId === 'modalidadServicioMascotas') {
      return { id: fieldId, label: label, type: 'select', options: MODALIDAD_MASCOTAS };
    }
    if (fieldId === 'tiempoRespuestaMascotas') {
      return { id: fieldId, label: label, type: 'select', options: TIEMPO_RESPUESTA };
    }
    if (fieldId === 'emergenciasMascotas') {
      return { id: fieldId, label: label, type: 'select', options: EMERGENCIAS_OPTS };
    }
    if (fieldId === 'diferenciadorMascotas' || fieldId === 'coberturaGeografica' ||
        fieldId === 'capacidadInstalacion' || fieldId === 'especialidadVeterinaria' ||
        fieldId === 'especialidadesEmpresaMascotas') {
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
      id: 'mascotasBase',
      title: 'Perfil mascotas',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Experiencia y certificaciones',
          type: 'textarea',
          required: false,
          rows: 2,
          placeholder: 'Cursos, certificaciones o años de experiencia'
        }
      ]
    }, {
      id: 'mascotasTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Tarifa desde (MXN)', type: 'text', required: true },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }

  function negocioBaseBlocks() {
    return [{
      id: 'mascotasNegocioBase',
      title: 'Establecimiento mascotas',
      fields: [
        { id: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        { id: 'direccion', label: 'Dirección o zona pública', type: 'textarea', required: true, rows: 2 },
        { id: 'horarioDetalle', label: 'Horario', type: 'text', required: true }
      ]
    }];
  }

  function vetProfesionistaBlocks() {
    return [{
      id: 'packD_vet',
      title: 'Profesional veterinario (cédula)',
      hint: 'Datos públicos — cédula se valida en sección privada.',
      fields: [
        { id: 'nombreProfesional', label: 'Nombre profesional público', type: 'text', required: true },
        { id: 'especialidadVeterinaria', label: 'Especialidad veterinaria', type: 'text', required: true },
        {
          id: 'serviciosVeterinarios',
          label: 'Servicios veterinarios',
          type: 'checklist',
          required: true,
          options: ['Consulta', 'Vacunas', 'Cirugía', 'Urgencias', 'Otro']
        },
        {
          id: 'especiesAtendidas',
          label: 'Especies que atiendes',
          type: 'checklist',
          required: true,
          options: ['Perro', 'Gato', 'Aves', 'Reptiles', 'Exóticos', 'Otro']
        },
        {
          id: 'modalidadServicioMascotas',
          label: 'Modalidad de atención',
          type: 'select',
          required: true,
          options: MODALIDAD_MASCOTAS.filter(function (o) {
            return ['consultorio', 'clinica', 'domicilio', 'online', 'ambos'].indexOf(o.value) >= 0;
          })
        },
        { id: 'precioConsulta', label: 'Precio consulta desde (MXN)', type: 'text', required: true },
        { id: 'horarioAtencion', label: 'Horario de atención', type: 'text', required: true },
        { id: 'emergenciasMascotas', label: '¿Atiendes emergencias?', type: 'select', required: false, options: EMERGENCIAS_OPTS },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksA() {
    return [{
      id: 'packA_cuidado',
      title: 'Cuidado y hospedaje',
      hint: 'Servicios, especies y modalidad.',
      fields: [
        { id: 'serviciosMascotas', label: 'Servicios', type: 'checklist', required: true, options: ['Paseo', 'Cuidado', 'Guardería', 'Hospedaje', 'Otro'] },
        { id: 'especiesAtendidas', label: 'Especies', type: 'checklist', required: true, options: ['Perro', 'Gato', 'Aves', 'Otro'] },
        { id: 'modalidadServicioMascotas', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_MASCOTAS },
        { id: 'tamanoMascotasAtendidas', label: 'Tamaños', type: 'checklist', required: false, options: ['Pequeño', 'Mediano', 'Grande', 'Gigante'] },
        { id: 'capacidadInstalacion', label: 'Capacidad / cupo', type: 'text', required: false, placeholder: '' },
        { id: 'tiempoRespuestaMascotas', label: 'Tiempo de respuesta', type: 'select', required: true, options: TIEMPO_RESPUESTA },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksB(isNegocio) {
    if (isNegocio) {
      return [{
        id: 'packB_centro',
        title: 'Centro de entrenamiento',
        hint: 'Programas e instalaciones.',
        fields: [
          { id: 'serviciosEmpresaMascotas', label: 'Programas', type: 'checklist', required: true, options: ['Grupos', 'Privado', 'Board and train', 'Conducta', 'Otro'] },
          { id: 'especialidadesEmpresaMascotas', label: 'Especialidades', type: 'text', required: true, placeholder: '' },
          { id: 'especiesAtendidas', label: 'Especies', type: 'checklist', required: true, options: ['Perro'] },
          { id: 'capacidadInstalacion', label: 'Cupo', type: 'text', required: false, placeholder: '' },
          { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
        ]
      }];
    }
    return [{
      id: 'packB_entrenamiento',
      title: 'Entrenamiento canino',
      hint: 'Servicios y modalidad.',
      fields: [
        { id: 'serviciosMascotas', label: 'Servicios', type: 'checklist', required: true, options: ['Obediencia', 'Conducta', 'Cachorros', 'Otro'] },
        { id: 'especiesAtendidas', label: 'Especies', type: 'checklist', required: true, options: ['Perro'] },
        { id: 'modalidadServicioMascotas', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_MASCOTAS },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksC(isNegocio) {
    if (isNegocio) {
      return [{
        id: 'packC_estetica_neg',
        title: 'Estética canina',
        hint: 'Servicios del establecimiento.',
        fields: [
          { id: 'serviciosEmpresaMascotas', label: 'Servicios', type: 'checklist', required: true, options: ['Baño', 'Corte', 'Spa', 'Uñas', 'Otro'] },
          { id: 'especialidadesEmpresaMascotas', label: 'Especialidades', type: 'text', required: true, placeholder: '' },
          { id: 'especiesAtendidas', label: 'Especies', type: 'checklist', required: true, options: ['Perro', 'Gato'] },
          { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: false, placeholder: '' }
        ]
      }];
    }
    return [{
      id: 'packC_estetica',
      title: 'Estética y fotografía',
      hint: 'Servicios y modalidad.',
      fields: [
        { id: 'serviciosMascotas', label: 'Servicios', type: 'checklist', required: true, options: ['Baño', 'Corte', 'Fotografía', 'Spa', 'Otro'] },
        { id: 'especiesAtendidas', label: 'Especies', type: 'checklist', required: true, options: ['Perro', 'Gato', 'Aves', 'Otro'] },
        { id: 'modalidadServicioMascotas', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_MASCOTAS },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function packBlocksD(canonId) {
    if (isNegocioSub(canonId)) {
      return [{
        id: 'packD_clinica',
        title: 'Clínica / hospital veterinario',
        hint: 'Servicios, emergencias e instalaciones.',
        fields: [
          { id: 'serviciosEmpresaMascotas', label: 'Servicios', type: 'checklist', required: true, options: ['Consulta', 'Urgencias', 'Cirugía', 'Hospitalización', 'Laboratorio', 'Otro'] },
          { id: 'especialidadesEmpresaMascotas', label: 'Especialidades', type: 'text', required: true, placeholder: '' },
          { id: 'especiesAtendidas', label: 'Especies', type: 'checklist', required: true, options: ['Perro', 'Gato', 'Aves', 'Exóticos', 'Otro'] },
          { id: 'emergenciasMascotas', label: 'Emergencias', type: 'select', required: true, options: EMERGENCIAS_OPTS },
          { id: 'capacidadInstalacion', label: 'Camas / cupo', type: 'text', required: false, placeholder: '' }
        ]
      }];
    }
    return vetProfesionistaBlocks();
  }

  function packBlocksE() {
    return [{
      id: 'packE_retail',
      title: 'Retail, cría y servicios',
      hint: 'Productos, servicios y cobertura.',
      fields: [
        { id: 'serviciosMascotas', label: 'Servicios / productos', type: 'checklist', required: true, options: ['Venta', 'Cría', 'Rescate', 'Funerario', 'Asesoría', 'Otro'] },
        { id: 'especiesAtendidas', label: 'Especies', type: 'checklist', required: true, options: ['Perro', 'Gato', 'Aves', 'Exóticos', 'Otro'] },
        { id: 'modalidadServicioMascotas', label: 'Modalidad', type: 'select', required: true, options: MODALIDAD_MASCOTAS },
        { id: 'capacidadInstalacion', label: 'Cupo / camadas', type: 'text', required: false, placeholder: '' },
        { id: 'coberturaGeografica', label: 'Zona de cobertura', type: 'text', required: true, placeholder: '' }
      ]
    }];
  }

  function appendPackBlocks(pack, canonId) {
    if (pack === 'A') return packBlocksA();
    if (pack === 'B') return packBlocksB(isNegocioSub(canonId));
    if (pack === 'C') return packBlocksC(isNegocioSub(canonId));
    if (pack === 'D') return packBlocksD(canonId);
    if (pack === 'E') return packBlocksE();
    return packBlocksA();
  }

  var PACK_OBLIGATORIOS = {
    A: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosMascotas', 'especiesAtendidas', 'modalidadServicioMascotas', 'coberturaGeografica', 'tiempoRespuestaMascotas'],
    B: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosMascotas', 'modalidadServicioMascotas', 'coberturaGeografica'],
    C: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosMascotas', 'modalidadServicioMascotas', 'coberturaGeografica'],
    D: ['nombreProfesional', 'especialidadVeterinaria', 'serviciosVeterinarios', 'especiesAtendidas', 'modalidadServicioMascotas', 'precioConsulta', 'horarioAtencion', 'coberturaGeografica'],
    E: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosMascotas', 'coberturaGeografica']
  };

  function inferFormularioId(canonId, ctx) {
    if (ctx && ctx.formularioId) return ctx.formularioId;
    if (isProfesionistaSub(canonId)) return 'profesionista_cedula';
    if (isNegocioSub(canonId)) return 'negocio_empresa';
    return 'persona_independiente';
  }

  function resolveBaseObligatorios(canonId, pack) {
    if (isNegocioSub(canonId)) {
      return [
        'nombreComercial',
        'serviciosEmpresaMascotas',
        'especialidadesEmpresaMascotas',
        'especiesAtendidas',
        'direccion',
        'horarioDetalle',
        'coberturaGeografica'
      ];
    }
    if (isProfesionistaSub(canonId)) {
      return (PACK_OBLIGATORIOS.D || []).slice();
    }
    return (PACK_OBLIGATORIOS[pack] || PACK_OBLIGATORIOS.A).slice();
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
    var uiIds = ['ui_ind_mascotas'];
    if (isProfesionistaSub(canonId)) uiIds = ['ui_prof_mascotas'];
    if (isNegocioSub(canonId)) uiIds = ['ui_neg_mascotas'];
    return {
      id: 'mascotas_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'mascotas',
      formularioId: formularioId,
      uiIds: uiIds,
      fotosMin: 3,
      obligatorios: mergeObligatoriosFromDelta(resolveBaseObligatorios(canonId, pack), canonId),
      blocks: blocks,
      nestedProfileKey: 'mascotasPerfil',
      packFlags: isProfesionistaSub(canonId) ? { requiresCedula: true, nivelRevisionAdmin: 'alta' } : {}
    };
  }

  global.CARIHUB_REGISTRO_MASCOTAS_SECTOR_BLOCKS = {
    id: 'mascotas_sector_packs',
    sectorId: 'mascotas',
    subToPack: SUB_TO_PACK,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
