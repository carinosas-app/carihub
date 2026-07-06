/**
 * Bloques registro — sector Tecnologia. MP-TECNOLOGIA-DELTAS-V1 packs A–F.
 */
(function (global) {
  'use strict';

  var SUB_TO_PACK = {
    'programador': 'A',
    'desarrollador-web': 'A',
    'desarrollador-movil': 'A',
    'automatizacion-ia': 'A',
    'prompt-engineer': 'A',
    'desarrollo-de-software': 'A',
    'desarrollo-de-apps': 'A',
    'desarrollo-web': 'A',
    'soporte-tecnico-independiente': 'B',
    'tecnico-en-computadoras': 'B',
    'soporte-empresarial-ti': 'B',
    'community-manager': 'C',
    'especialista-seo': 'C',
    'especialista-sem': 'C',
    'administrador-de-redes-sociales': 'C',
    'creador-de-contenido-digital': 'C',
    'especialista-en-ciberseguridad-independiente': 'D',
    'consultor-it': 'D',
    'consultoria-tecnologica': 'D',
    'ciberseguridad-empresarial': 'D',
    'agencia-de-marketing-digital': 'E',
    'agencia-seo': 'E',
    'agencia-de-publicidad-digital': 'E',
    'venta-de-equipo-de-computo': 'E',
    'disenador-grafico': 'F',
    'disenador-ux-ui': 'F',
    'editor-de-video': 'F',
    'produccion-audiovisual': 'F',
    'estudio-de-diseno': 'F',
    'redes-y-telecomunicaciones': 'F',
    'hosting-y-dominios': 'F',
    'servicios-cloud': 'F'
  };

  var MODALIDAD_TI = [
    { value: 'remoto', label: '100% remoto / en línea' },
    { value: 'presencial', label: 'Presencial en oficina o taller' },
    { value: 'hibrido', label: 'Remoto y presencial' },
    { value: 'visita_cliente', label: 'Visita al cliente / sitio' },
    { value: 'domicilio', label: 'Servicio a domicilio' }
  ];

  var ANOS_EXPERIENCIA_TI_TI = [
    { value: '1_3', label: '1–3 años' },
    { value: '4_7', label: '4–7 años' },
    { value: '8_15', label: '8–15 años' },
    { value: '16_mas', label: '16+ años' }
  ];

  var FIELD_LABELS = {
    modalidadServicioTI: 'Modalidad de servicio',
    stackTecnologico: 'Stack / tecnologías principales',
    lenguajesFrameworks: 'Lenguajes y frameworks',
    serviciosDesarrollo: 'Servicios de desarrollo',
    tipoProyectosDev: 'Tipos de proyecto',
    serviciosSoporteTI: 'Servicios de soporte TI',
    tiposEquipoSoporte: 'Equipos que atiendes',
    serviciosReparacion: 'Reparaciones y mantenimiento',
    tiempoRespuestaSoporte: 'Tiempo de respuesta',
    tiposClientesSoporte: 'Tipos de clientes',
    garantiaServicio: 'Garantía del servicio',
    serviciosMarketingDigital: 'Servicios de marketing digital',
    canalesMarketing: 'Canales que manejas',
    especialidadMarketing: 'Especialidad',
    herramientasMarketing: 'Herramientas / plataformas',
    areasConsultoriaTI: 'Áreas de consultoría TI',
    serviciosConsultoriaTI: 'Servicios de consultoría',
    serviciosCiberseguridad: 'Servicios de ciberseguridad',
    certificacionesSeguridad: 'Certificaciones de seguridad',
    serviciosEmpresaTI: 'Servicios de la empresa',
    especialidadesEmpresaTI: 'Especialidades de la empresa',
    tamanoEmpresaAtendida: 'Tamaño de clientes atendidos',
    serviciosCreativosTI: 'Servicios creativos / audiovisual',
    especialidadCreativaTI: 'Especialidad creativa',
    plataformasInfra: 'Plataformas / proveedores',
    serviciosInfraTI: 'Servicios de infraestructura',
    softwareHerramientas: 'Software / herramientas',
    portfolioURL: 'Portafolio (URL)',
    anosExperienciaTI: 'Años de experiencia',
    industriasAtendidas: 'Industrias atendidas',
    diferenciadorProfesional: 'Tu sello profesional',
    coberturaGeografica: 'Zona de atención',
    tiempoRespuestaConsulta: 'Tiempo de respuesta a consultas',
    colaboracionesComerciales: '¿Colaboras con otros profesionales o negocios?',
    tiposColaboracionComercial: 'Tipo de colaboraciones'
  };

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolvePack(subId) { return SUB_TO_PACK[slugSubId(subId)] || 'B'; }

  function getSubDeltaApi() {
    return {
      meta: global.CARIHUB_TECNOLOGIA_SUB_CANON_META || {},
      deltas: global.CARIHUB_TECNOLOGIA_SUB_DELTAS || {}
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
    if (fieldId === 'modalidadServicioTI') {
      return { id: fieldId, label: label, type: 'select', options: MODALIDAD_TI };
    }
    if (fieldId === 'anosExperienciaTI') {
      return { id: fieldId, label: label, type: 'select', options: ANOS_EXPERIENCIA_TI };
    }
    if (fieldId === 'portfolioURL') {
      return { id: fieldId, label: label, type: 'url', placeholder: 'https://' };
    }
    if (fieldId === 'diferenciadorProfesional' || fieldId === 'coberturaGeografica') {
      return { id: fieldId, label: label, type: 'text', placeholder: '' };
    }
    if (fieldId === 'tiempoRespuestaConsulta') {
      return {
        id: fieldId,
        label: label,
        type: 'select',
        options: [
          { value: 'mismo_dia', label: 'Mismo día hábil' },
          { value: '24_48h', label: '24–48 horas' },
          { value: '3_5_dias', label: '3–5 días hábiles' },
          { value: 'por_cita', label: 'Solo con cita agendada' }
        ]
      };
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
    if (fieldId === 'tiempoRespuestaSoporte') {
      return {
        id: fieldId,
        label: label,
        type: 'select',
        options: [
          { value: 'mismo_dia', label: 'Mismo día' },
          { value: '24h', label: 'Dentro de 24 horas' },
          { value: '48h', label: '24–48 horas' },
          { value: 'por_cita', label: 'Con cita programada' },
          { value: 'sla_contrato', label: 'Según SLA / contrato' }
        ]
      };
    }
    if (fieldId === 'garantiaServicio' || fieldId === 'herramientasMarketing' ||
        fieldId === 'lenguajesFrameworks') {
      return { id: fieldId, label: label, type: 'text', placeholder: '' };
    }
    var opts = delta && delta.fieldOptions && delta.fieldOptions[fieldId];
    if (opts && opts.length) {
      if (typeof opts[0] === 'object' && opts[0].value != null) {
        return { id: fieldId, label: label, type: 'select', options: opts.slice() };
      }
      return { id: fieldId, label: label, type: 'checklist', options: opts.slice() };
    }
    if (fieldId === 'softwareHerramientas' || fieldId === 'idiomasServicio' ||
        fieldId === 'aseguradorasRepresentadas' || fieldId === 'especialidadesEmpresa' ||
        fieldId === 'especialidadesEmpresaTI') {
      return { id: fieldId, label: label, type: 'text', placeholder: '' };
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
        if (field.id === 'nombreProfesional' && delta.aliasPlaceholder) field.placeholder = delta.aliasPlaceholder;
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
      id: 'packA_dev',
      title: 'Desarrollo profesional',
      hint: 'Stack, servicios y modalidad — incluye portafolio si aplica.',
      fields: [
        { id: 'stackTecnologico', label: 'Stack / tecnologías principales', type: 'checklist', required: true, options: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Otro'] },
        { id: 'serviciosDesarrollo', label: 'Servicios de desarrollo', type: 'checklist', required: true, options: ['Desarrollo a medida', 'APIs', 'Mantenimiento', 'MVP', 'Otro'] },
        { id: 'modalidadServicioTI', label: 'Modalidad de servicio', type: 'select', required: true, options: [{ value: 'remoto', label: '100% remoto / en línea' },
        { value: 'presencial', label: 'Presencial en oficina o taller' },
        { value: 'hibrido', label: 'Remoto y presencial' },
        { value: 'visita_cliente', label: 'Visita al cliente / sitio' },
        { value: 'domicilio', label: 'Servicio a domicilio' }] },
        { id: 'lenguajesFrameworks', label: 'Lenguajes y frameworks', type: 'text', required: false, placeholder: 'Ej. React, Node, PostgreSQL' },
        { id: 'tipoProyectosDev', label: 'Tipos de proyecto', type: 'checklist', required: false, options: ['Web', 'Mobile', 'Backend', 'SaaS', 'Otro'] },
        { id: 'anosExperienciaTI', label: 'Años de experiencia', type: 'select', required: false, options: [{ value: '1_3', label: '1–3 años' },
        { value: '4_7', label: '4–7 años' },
        { value: '8_15', label: '8–15 años' },
        { value: '16_mas', label: '16+ años' }] },
        { id: 'portfolioURL', label: 'Portafolio (URL)', type: 'url', required: false, placeholder: 'https://' }
      ]
    }];
  }

  function personaBaseBlocks() {
    return [{
      id: 'tecnologiaBase',
      title: 'Perfil tecnología',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Certificaciones / formación',
          type: 'textarea',
          required: true,
          rows: 2,
          placeholder: 'Certificaciones, cursos o experiencia relevante'
        }
      ]
    }, {
      id: 'tecnologiaTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Tarifa desde (MXN)', type: 'text', required: true },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }

  function negocioBaseBlocks() {
    return [{
      id: 'tecnologiaNegocioBase',
      title: 'Empresa de tecnología',
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
      id: 'packB_soporte',
      title: 'Soporte y reparación',
      hint: 'Servicios de soporte, reparación y cobertura.',
      fields: [
        { id: 'serviciosSoporteTI', label: 'Servicios de soporte TI', type: 'checklist', required: true, options: ['Soporte remoto', 'Soporte presencial', 'Instalación', 'Backup', 'Recuperación de datos', 'Otro'] },
        { id: 'tiposEquipoSoporte', label: 'Equipos que atiendes', type: 'checklist', required: true, options: ['PC Windows', 'Mac', 'Laptop', 'Servidor', 'Impresora', 'Red', 'Otro'] },
        { id: 'serviciosReparacion', label: 'Reparaciones y mantenimiento', type: 'checklist', required: false, options: ['Diagnóstico', 'Formateo', 'Cambio SSD/RAM', 'Limpieza', 'Malware', 'Otro'] },
        { id: 'modalidadServicioTI', label: 'Modalidad de servicio', type: 'select', required: true, options: [{ value: 'remoto', label: '100% remoto / en línea' },
        { value: 'presencial', label: 'Presencial en oficina o taller' },
        { value: 'hibrido', label: 'Remoto y presencial' },
        { value: 'visita_cliente', label: 'Visita al cliente / sitio' },
        { value: 'domicilio', label: 'Servicio a domicilio' }] },
        { id: 'tiempoRespuestaSoporte', label: 'Tiempo de respuesta', type: 'select', required: true, options: [{ value: 'mismo_dia', label: 'Mismo día' },
        { value: '24h', label: 'Dentro de 24 horas' },
        { value: '48h', label: '24–48 horas' },
        { value: 'por_cita', label: 'Con cita programada' },
        { value: 'sla_contrato', label: 'Según SLA / contrato' }] },
        { id: 'tiposClientesSoporte', label: 'Tipos de clientes', type: 'checklist', required: false, options: ['Personas', 'PyME', 'Corporativo', 'Otro'] },
        { id: 'garantiaServicio', label: 'Garantía del servicio', type: 'text', required: false, placeholder: 'Ej. 30 días mano de obra' }
      ]
    }];
  }

  function packBlocksC() {
    return [{
      id: 'packC_marketing',
      title: 'Marketing digital',
      hint: 'Servicios y canales de marketing digital.',
      fields: [
        { id: 'serviciosMarketingDigital', label: 'Servicios de marketing digital', type: 'checklist', required: true, options: ['SEO', 'SEM', 'Social media', 'Email marketing', 'Contenido', 'Otro'] },
        { id: 'canalesMarketing', label: 'Canales que manejas', type: 'checklist', required: true, options: ['Google', 'Meta', 'TikTok', 'LinkedIn', 'YouTube', 'Otro'] },
        { id: 'especialidadMarketing', label: 'Especialidad', type: 'checklist', required: false, options: ['B2B', 'B2C', 'E-commerce', 'Local', 'Otro'] },
        { id: 'modalidadServicioTI', label: 'Modalidad de servicio', type: 'select', required: true, options: [{ value: 'remoto', label: '100% remoto / en línea' },
        { value: 'presencial', label: 'Presencial en oficina o taller' },
        { value: 'hibrido', label: 'Remoto y presencial' },
        { value: 'visita_cliente', label: 'Visita al cliente / sitio' },
        { value: 'domicilio', label: 'Servicio a domicilio' }] },
        { id: 'herramientasMarketing', label: 'Herramientas / plataformas', type: 'text', required: false, placeholder: 'Ej. Google Analytics, HubSpot' },
        { id: 'portfolioURL', label: 'Portafolio (URL)', type: 'url', required: false, placeholder: 'https://' }
      ]
    }];
  }

  function packBlocksD() {
    return [{
      id: 'packD_consultoria',
      title: 'Consultoría y ciberseguridad',
      hint: 'Áreas de consultoría TI y servicios de seguridad.',
      fields: [
        { id: 'areasConsultoriaTI', label: 'Áreas de consultoría TI', type: 'checklist', required: true, options: ['Infraestructura', 'Nube', 'Seguridad', 'Redes', 'Transformación digital', 'Otro'] },
        { id: 'serviciosConsultoriaTI', label: 'Servicios de consultoría', type: 'checklist', required: true, options: ['Diagnóstico', 'Roadmap', 'Implementación', 'Capacitación', 'Auditoría', 'Otro'] },
        { id: 'serviciosCiberseguridad', label: 'Servicios de ciberseguridad', type: 'checklist', required: false, options: ['Pentesting', 'Vulnerabilidades', 'Hardening', 'SOC', 'Awareness', 'Otro'] },
        { id: 'modalidadServicioTI', label: 'Modalidad de servicio', type: 'select', required: true, options: [{ value: 'remoto', label: '100% remoto / en línea' },
        { value: 'presencial', label: 'Presencial en oficina o taller' },
        { value: 'hibrido', label: 'Remoto y presencial' },
        { value: 'visita_cliente', label: 'Visita al cliente / sitio' },
        { value: 'domicilio', label: 'Servicio a domicilio' }] },
        { id: 'certificacionesSeguridad', label: 'Certificaciones de seguridad', type: 'checklist', required: false, options: ['CEH', 'OSCP', 'Security+', 'ISO 27001', 'Otro'] },
        { id: 'industriasAtendidas', label: 'Industrias atendidas', type: 'checklist', required: false, options: ['Retail', 'Manufactura', 'Servicios', 'Salud', 'Finanzas', 'Otro'] }
      ]
    }];
  }

  function packBlocksE() {
    return [{
      id: 'packE_negocio',
      title: 'Negocio / agencia TI',
      hint: 'Datos del establecimiento — servicios y especialidades.',
      fields: [
        { id: 'serviciosEmpresaTI', label: 'Servicios de la empresa', type: 'checklist', required: true, options: ['Marketing digital', 'Desarrollo', 'Soporte TI', 'Hosting', 'Venta equipos', 'Otro'] },
        { id: 'especialidadesEmpresaTI', label: 'Especialidades de la empresa', type: 'text', required: true, placeholder: 'Ej. Agencia SEO B2B, soporte empresarial' },
        { id: 'tamanoEmpresaAtendida', label: 'Tamaño de clientes atendidos', type: 'checklist', required: false, options: ['PyME', 'Mediana', 'Corporativo', 'Startup', 'Otro'] }
      ]
    }];
  }

  function packBlocksF() {
    return [{
      id: 'packF_creative',
      title: 'Creativo e infraestructura',
      hint: 'Diseño, audiovisual, cloud o telecom.',
      fields: [
        { id: 'serviciosCreativosTI', label: 'Servicios creativos / audiovisual', type: 'checklist', required: true, options: ['Diseño gráfico', 'UX/UI', 'Video', 'Motion', 'Branding', 'Otro'] },
        { id: 'especialidadCreativaTI', label: 'Especialidad creativa', type: 'checklist', required: true, options: ['Digital', 'Editorial', 'Producto', 'Motion', 'Infraestructura', 'Otro'] },
        { id: 'modalidadServicioTI', label: 'Modalidad de servicio', type: 'select', required: true, options: [{ value: 'remoto', label: '100% remoto / en línea' },
        { value: 'presencial', label: 'Presencial en oficina o taller' },
        { value: 'hibrido', label: 'Remoto y presencial' },
        { value: 'visita_cliente', label: 'Visita al cliente / sitio' },
        { value: 'domicilio', label: 'Servicio a domicilio' }] },
        { id: 'serviciosInfraTI', label: 'Servicios de infraestructura', type: 'checklist', required: false, options: ['Hosting', 'Cloud', 'Redes', 'Dominios', 'DevOps', 'Otro'] },
        { id: 'plataformasInfra', label: 'Plataformas / proveedores', type: 'checklist', required: false, options: ['AWS', 'Azure', 'Google Cloud', 'cPanel', 'Cisco', 'Otro'] },
        { id: 'portfolioURL', label: 'Portafolio (URL)', type: 'url', required: false, placeholder: 'https://' },
        { id: 'softwareHerramientas', label: 'Software / herramientas', type: 'text', required: false, placeholder: 'Ej. Figma, Adobe, DaVinci' }
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
    A: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'stackTecnologico', 'serviciosDesarrollo', 'modalidadServicioTI'],
    B: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosSoporteTI', 'tiposEquipoSoporte', 'modalidadServicioTI', 'coberturaGeografica', 'tiempoRespuestaSoporte'],
    C: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosMarketingDigital', 'canalesMarketing', 'modalidadServicioTI'],
    D: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'areasConsultoriaTI', 'serviciosConsultoriaTI', 'modalidadServicioTI'],
    E: ['nombreComercial', 'serviciosEmpresaTI', 'especialidadesEmpresaTI', 'direccion', 'horarioDetalle'],
    F: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosCreativosTI', 'especialidadCreativaTI', 'modalidadServicioTI']
  };

  function appendPackBlocks(pack) {
    var fn = PACK_BUILDERS[pack] || packBlocksB;
    return fn();
  }

  var NEGOCIO_SUBS = new Set(['soporte-empresarial-ti', 'ciberseguridad-empresarial', 'agencia-de-marketing-digital', 'agencia-seo', 'agencia-de-publicidad-digital', 'venta-de-equipo-de-computo', 'hosting-y-dominios']);

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
    if (isNegocioSub(canonId)) return PACK_OBLIGATORIOS.E.slice();
    return (PACK_OBLIGATORIOS[pack] || PACK_OBLIGATORIOS.B).slice();
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
      id: 'tecnologia_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'tecnologia',
      formularioId: formularioId,
      uiIds: isNegocioSub(canonId) ? ['ui_neg_tecnologia'] : ['ui_ind_tecnologia'],
      fotosMin: isNegocioSub(canonId) ? 3 : 2,
      obligatorios: mergeObligatoriosFromDelta(resolveBaseObligatorios(canonId, pack), canonId),
      blocks: blocks,
      nestedProfileKey: 'tecnologiaPerfil',
      packFlags: {}
    };
  }

  global.CARIHUB_REGISTRO_TECNOLOGIA_SECTOR_BLOCKS = {
    id: 'tecnologia_sector_packs',
    sectorId: 'tecnologia',
    subToPack: SUB_TO_PACK,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
