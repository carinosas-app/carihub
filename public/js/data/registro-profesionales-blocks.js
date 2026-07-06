/**
 * Bloques registro — sector Profesionales. MP-PROFESIONALES-DELTAS-V1 packs A–H.
 */
(function (global) {
  'use strict';

  var SUB_TO_PACK = {
    'abogados': 'A',
    'contadores': 'A',
    'ingenieros': 'A',
    'despachos-juridicos': 'B',
    'despachos-contables': 'B',
    'despachos-de-arquitectura': 'B',
    'despachos-de-ingenieria': 'B',
    'asesoria-fiscal': 'C',
    'auditoria': 'C',
    'notarias': 'C',
    'corredurias-publicas': 'C',
    'gestoria-y-tramites': 'C',
    'arquitectos': 'D',
    'topografia': 'D',
    'avaluos': 'D',
    'peritos': 'D',
    'consultoria-financiera': 'E',
    'consultoria-de-negocios': 'E',
    'recursos-humanos': 'E',
    'reclutamiento-y-seleccion': 'E',
    'estudios-socioeconomicos': 'E',
    'coaching-ejecutivo': 'E',
    'desarrollo-organizacional': 'E',
    'franquicias': 'E',
    'traduccion-e-interpretacion': 'F',
    'marketing-y-publicidad': 'F',
    'diseno-grafico': 'F',
    'diseno-de-interiores': 'F',
    'branding-e-identidad-corporativa': 'F',
    'fotografia-profesional': 'F',
    'produccion-de-video': 'F',
    'relaciones-publicas': 'F',
    'investigacion-de-mercados': 'F',
    'seguros': 'G',
    'agentes-de-seguros': 'G',
    'asesoria-patrimonial': 'G',
    'asesoria-en-inversiones': 'G',
    'comercio-internacional': 'G',
    'importacion-y-exportacion': 'G',
    'certificaciones-y-normatividad': 'G',
    'seguridad-e-higiene': 'G',
    'gestion-de-calidad': 'G',
    'consultoria-ambiental': 'G',
    'consultoria-empresarial': 'H',
    'capacitacion-empresarial': 'H',
    'agencias-de-marketing': 'H',
    'diseno-industrial': 'H',
    'logistica-empresarial': 'H',
    'proteccion-civil-empresarial': 'H',
    'responsabilidad-social-empresarial': 'H'
  };

  var MODALIDAD_PROF = [
    { value: 'consultorio', label: 'Consultorio / oficina' },
    { value: 'videollamada', label: 'Videollamada' },
    { value: 'hibrido', label: 'Presencial y en línea' },
    { value: 'visita_cliente', label: 'Visita al cliente' }
  ];

  var ANOS_EXPERIENCIA = [
    { value: '1_3', label: '1–3 años' },
    { value: '4_7', label: '4–7 años' },
    { value: '8_15', label: '8–15 años' },
    { value: '16_mas', label: '16+ años' }
  ];

  var FIELD_LABELS = {
    modalidadAtencionProfesional: 'Modalidad de atención',
    anosExperienciaProfesional: 'Años de experiencia',
    areasDerecho: 'Áreas del derecho',
    tiposClientesLegales: 'Tipos de clientes',
    serviciosLegales: 'Servicios legales',
    serviciosDespacho: 'Servicios del despacho',
    areasPracticaDespacho: 'Áreas de práctica',
    tamanoEquipoDespacho: 'Tamaño del equipo',
    serviciosContables: 'Servicios contables',
    tiposClientesContables: 'Tipos de clientes',
    serviciosFiscalesLegales: 'Servicios fiscales / legales',
    tiposClientesProfesionales: 'Tipos de clientes atendidos',
    serviciosTramites: 'Trámites y gestiones',
    especialidadTecnica: 'Especialidad técnica',
    serviciosTecnicos: 'Servicios técnicos',
    softwareHerramientas: 'Software / herramientas',
    areasConsultoria: 'Áreas de consultoría',
    serviciosConsultoria: 'Servicios de consultoría',
    industriasAtendidas: 'Industrias atendidas',
    serviciosCreativos: 'Servicios creativos',
    especialidadCreativa: 'Especialidad creativa',
    idiomasServicio: 'Idiomas de servicio',
    serviciosFinancieros: 'Servicios financieros / comerciales',
    aseguradorasRepresentadas: 'Aseguradoras / instituciones',
    normasCertificaciones: 'Normas / certificaciones',
    serviciosEmpresariales: 'Servicios empresariales',
    especialidadesEmpresa: 'Especialidades de la empresa',
    tamanoEmpresaAtendida: 'Tamaño de empresas atendidas',
    portfolioURL: 'Portafolio (URL)',
    diferenciadorProfesional: 'Tu sello profesional',
    coberturaGeografica: 'Zona de atención',
    tiempoRespuestaConsulta: 'Tiempo de respuesta a consultas',
    regimenesFiscales: 'Regímenes fiscales que manejas',
    instanciasJudiciales: 'Instancias y etapas procesales',
    estilosArquitectonicos: 'Estilos arquitectónicos',
    metodologiasConsultoria: 'Cómo trabajas con clientes',
    tiposEntregablesCreativos: 'Qué incluye tu servicio',
    tiposPolizaSeguros: 'Tipos de póliza / ramos',
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
      meta: global.CARIHUB_PROFESIONALES_SUB_CANON_META || {},
      deltas: global.CARIHUB_PROFESIONALES_SUB_DELTAS || {}
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
    if (fieldId === 'modalidadAtencionProfesional') {
      return { id: fieldId, label: label, type: 'select', options: MODALIDAD_PROF };
    }
    if (fieldId === 'anosExperienciaProfesional') {
      return { id: fieldId, label: label, type: 'select', options: ANOS_EXPERIENCIA };
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
    var opts = delta && delta.fieldOptions && delta.fieldOptions[fieldId];
    if (opts && opts.length) {
      if (typeof opts[0] === 'object' && opts[0].value != null) {
        return { id: fieldId, label: label, type: 'select', options: opts.slice() };
      }
      return { id: fieldId, label: label, type: 'checklist', options: opts.slice() };
    }
    if (fieldId === 'softwareHerramientas' || fieldId === 'idiomasServicio' ||
        fieldId === 'aseguradorasRepresentadas' || fieldId === 'especialidadesEmpresa') {
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
      id: 'packA_cedula',
      title: 'Profesionista con cédula',
      hint: 'Datos públicos — cédula se valida en sección privada.',
      fields: [
        { id: 'nombreProfesional', label: 'Nombre profesional público', type: 'text', required: true },
        { id: 'especialidadProfesional', label: 'Especialidad o área principal', type: 'text', required: true },
        { id: 'serviciosProfesionales', label: 'Servicios profesionales', type: 'checklist', required: true, options: ['Consulta', 'Asesoría', 'Dictamen', 'Representación', 'Proyecto', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [{ value: 'consultorio', label: 'Consultorio / oficina' },
        { value: 'videollamada', label: 'Videollamada' },
        { value: 'hibrido', label: 'Presencial y en línea' },
        { value: 'visita_cliente', label: 'Visita al cliente' }] },
        { id: 'precioConsulta', label: 'Tarifa / honorarios desde (MXN)', type: 'text', required: true },
        { id: 'unidadConsulta', label: 'Unidad de cobro', type: 'select', required: false, options: [{ value: 'por_consulta', label: 'Por consulta' },
        { value: 'por_hora', label: 'Por hora' },
        { value: 'por_proyecto', label: 'Por proyecto' },
        { value: 'por_mes', label: 'Por mes' }] },
        { id: 'horarioAtencion', label: 'Horario de atención', type: 'text', required: true },
        { id: 'anosExperienciaProfesional', label: 'Años de experiencia', type: 'select', required: false, options: [{ value: '1_3', label: '1–3 años' },
        { value: '4_7', label: '4–7 años' },
        { value: '8_15', label: '8–15 años' },
        { value: '16_mas', label: '16+ años' }] }
      ]
    }];
  }

  function personaBaseBlocks() {
    return [{
      id: 'profesionalesBase',
      title: 'Perfil profesional',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Certificaciones / formación',
          type: 'textarea',
          required: true,
          rows: 2,
          placeholder: 'Título, cédula auxiliar o certificaciones relevantes'
        }
      ]
    }, {
      id: 'profesionalesTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Tarifa desde (MXN)', type: 'text', required: true },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }

  function negocioBaseBlocks() {
    return [{
      id: 'profesionalesNegocioBase',
      title: 'Empresa de servicios profesionales',
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
      id: 'packB_despacho',
      title: 'Despacho / firma profesional',
      hint: 'Servicios del despacho — áreas y equipo.',
      fields: [
        { id: 'serviciosDespacho', label: 'Servicios del despacho', type: 'checklist', required: true, options: ['Consulta', 'Litigio', 'Contratos', 'Asesoría corporativa', 'Due diligence', 'Otro'] },
        { id: 'areasPracticaDespacho', label: 'Áreas de práctica', type: 'checklist', required: true, options: ['Civil', 'Penal', 'Laboral', 'Mercantil', 'Fiscal', 'Familiar', 'Otro'] },
        { id: 'tamanoEquipoDespacho', label: 'Tamaño del equipo', type: 'select', required: true, options: [{ value: 'individual', label: 'Profesional individual' },
        { value: 'pequeno_2_5', label: 'Equipo pequeño (2–5)' },
        { value: 'mediano_6_15', label: 'Equipo mediano (6–15)' },
        { value: 'grande_16_mas', label: 'Equipo grande (16+)' }] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [{ value: 'consultorio', label: 'Consultorio / oficina' },
        { value: 'videollamada', label: 'Videollamada' },
        { value: 'hibrido', label: 'Presencial y en línea' },
        { value: 'visita_cliente', label: 'Visita al cliente' }] }
      ]
    }];
  }

  function packBlocksC() {
    return [{
      id: 'packC_fiscal',
      title: 'Legal, fiscal y trámites',
      hint: 'Servicios fiscales, legales o gestión.',
      fields: [
        { id: 'serviciosFiscalesLegales', label: 'Servicios fiscales / legales', type: 'checklist', required: true, options: ['Declaraciones', 'Contabilidad', 'Auditoría', 'Trámites', 'Notaría', 'Correduría', 'Otro'] },
        { id: 'tiposClientesProfesionales', label: 'Tipos de clientes', type: 'checklist', required: false, options: ['Personas físicas', 'PyME', 'Corporativo', 'Gobierno', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [{ value: 'consultorio', label: 'Consultorio / oficina' },
        { value: 'videollamada', label: 'Videollamada' },
        { value: 'hibrido', label: 'Presencial y en línea' },
        { value: 'visita_cliente', label: 'Visita al cliente' }] }
      ]
    }];
  }

  function packBlocksD() {
    return [{
      id: 'packD_tecnico',
      title: 'Arquitectura y servicios técnicos',
      hint: 'Especialidad técnica y entregables.',
      fields: [
        { id: 'especialidadTecnica', label: 'Especialidad técnica', type: 'checklist', required: true, options: ['Arquitectura', 'Ingeniería civil', 'Topografía', 'Avalúos', 'Peritaje', 'Otro'] },
        { id: 'serviciosTecnicos', label: 'Servicios técnicos', type: 'checklist', required: true, options: ['Proyecto ejecutivo', 'Supervisión', 'Dictamen', 'Levantamiento', 'Inspección', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [{ value: 'consultorio', label: 'Consultorio / oficina' },
        { value: 'videollamada', label: 'Videollamada' },
        { value: 'hibrido', label: 'Presencial y en línea' },
        { value: 'visita_cliente', label: 'Visita al cliente' }] },
        { id: 'softwareHerramientas', label: 'Software / herramientas (opcional)', type: 'text', required: false, placeholder: 'Ej. AutoCAD, Revit' }
      ]
    }];
  }

  function packBlocksE() {
    return [{
      id: 'packE_consultoria',
      title: 'Consultoría y recursos humanos',
      hint: 'Áreas de consultoría e industrias.',
      fields: [
        { id: 'areasConsultoria', label: 'Áreas de consultoría', type: 'checklist', required: true, options: ['Estrategia', 'Finanzas', 'RH', 'Operaciones', 'Transformación', 'Otro'] },
        { id: 'serviciosConsultoria', label: 'Servicios de consultoría', type: 'checklist', required: true, options: ['Diagnóstico', 'Implementación', 'Capacitación', 'Coaching', 'Reclutamiento', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [{ value: 'consultorio', label: 'Consultorio / oficina' },
        { value: 'videollamada', label: 'Videollamada' },
        { value: 'hibrido', label: 'Presencial y en línea' },
        { value: 'visita_cliente', label: 'Visita al cliente' }] },
        { id: 'industriasAtendidas', label: 'Industrias atendidas', type: 'checklist', required: false, options: ['Manufactura', 'Retail', 'Tecnología', 'Salud', 'Construcción', 'Otro'] }
      ]
    }];
  }

  function packBlocksF() {
    return [{
      id: 'packF_creativo',
      title: 'Creativo, marketing y comunicación',
      hint: 'Servicios creativos — incluye portafolio si aplica.',
      fields: [
        { id: 'serviciosCreativos', label: 'Servicios creativos', type: 'checklist', required: true, options: ['Branding', 'Diseño gráfico', 'Video', 'Foto', 'Redes sociales', 'PR', 'Otro'] },
        { id: 'especialidadCreativa', label: 'Especialidad creativa', type: 'checklist', required: true, options: ['Identidad visual', 'Packaging', 'Motion', 'Editorial', 'UX/UI', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [{ value: 'consultorio', label: 'Consultorio / oficina' },
        { value: 'videollamada', label: 'Videollamada' },
        { value: 'hibrido', label: 'Presencial y en línea' },
        { value: 'visita_cliente', label: 'Visita al cliente' }] },
        { id: 'portfolioURL', label: 'Portafolio (URL opcional)', type: 'url', required: false, placeholder: 'https://' }
      ]
    }];
  }

  function packBlocksG() {
    return [{
      id: 'packG_finanzas',
      title: 'Seguros, finanzas y comercio',
      fields: [
        { id: 'serviciosFinancieros', label: 'Servicios financieros / comerciales', type: 'checklist', required: true, options: ['Seguros', 'Inversiones', 'Patrimonio', 'Comercio exterior', 'Certificaciones', 'Consultoría ambiental', 'Otro'] },
        { id: 'tiposClientesProfesionales', label: 'Tipos de clientes', type: 'checklist', required: false, options: ['Personas físicas', 'PyME', 'Corporativo', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [{ value: 'consultorio', label: 'Consultorio / oficina' },
        { value: 'videollamada', label: 'Videollamada' },
        { value: 'hibrido', label: 'Presencial y en línea' },
        { value: 'visita_cliente', label: 'Visita al cliente' }] }
      ]
    }];
  }

  function packBlocksH() {
    return [{
      id: 'packH_empresa',
      title: 'Negocio / empresa profesional',
      hint: 'Datos del establecimiento — servicios y especialidades.',
      fields: [
        { id: 'serviciosEmpresariales', label: 'Servicios empresariales', type: 'checklist', required: true, options: ['Consultoría', 'Capacitación', 'Marketing', 'Logística', 'Protección civil', 'RSE', 'Diseño industrial', 'Otro'] },
        { id: 'especialidadesEmpresa', label: 'Especialidades de la empresa', type: 'text', required: true, placeholder: 'Ej. Consultoría estratégica, capacitación' },
        { id: 'tamanoEmpresaAtendida', label: 'Tamaño de empresas atendidas', type: 'checklist', required: false, options: ['PyME', 'Mediana', 'Corporativo', 'Startup', 'Otro'] }
      ]
    }];
  }

  var PACK_BUILDERS = {
    A: packBlocksA,
    B: packBlocksB,
    C: packBlocksC,
    D: packBlocksD,
    E: packBlocksE,
    F: packBlocksF,
    G: packBlocksG,
    H: packBlocksH
  };

  var PACK_OBLIGATORIOS = {
    A: ['nombreProfesional', 'especialidadProfesional', 'serviciosProfesionales', 'modalidadAtencionProfesional', 'precioConsulta', 'horarioAtencion'],
    B: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosDespacho', 'areasPracticaDespacho', 'tamanoEquipoDespacho', 'modalidadAtencionProfesional'],
    C: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosFiscalesLegales', 'modalidadAtencionProfesional'],
    D: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'especialidadTecnica', 'serviciosTecnicos', 'modalidadAtencionProfesional'],
    E: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'areasConsultoria', 'serviciosConsultoria', 'modalidadAtencionProfesional'],
    F: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosCreativos', 'especialidadCreativa', 'modalidadAtencionProfesional'],
    G: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosFinancieros', 'modalidadAtencionProfesional'],
    H: ['nombreComercial', 'serviciosEmpresariales', 'especialidadesEmpresa', 'direccion', 'horarioDetalle']
  };

  function appendPackBlocks(pack) {
    var fn = PACK_BUILDERS[pack] || packBlocksB;
    return fn();
  }

  function inferFormularioId(pack, ctx) {
    if (ctx && ctx.formularioId) return ctx.formularioId;
    if (pack === 'A') return 'profesionista_cedula';
    if (pack === 'H') return 'negocio_empresa';
    return 'persona_independiente';
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
    var formularioId = inferFormularioId(pack, ctx);
    var blocks;
    if (pack === 'A') {
      blocks = packBlocksA();
    } else if (pack === 'H') {
      blocks = negocioBaseBlocks().concat(appendPackBlocks(pack, canonId));
    } else {
      blocks = personaBaseBlocks().concat(appendPackBlocks(pack, canonId));
    }
    blocks = applySubDeltaToBlocks(blocks, canonId);
    return {
      id: 'profesionales_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'profesionales',
      formularioId: formularioId,
      uiIds: pack === 'A' ? ['ui_prof_salud'] : (pack === 'H' ? ['ui_neg_servicios_local'] : ['ui_ind_salud_auxiliar']),
      fotosMin: pack === 'A' ? 2 : (pack === 'H' ? 3 : 2),
      obligatorios: mergeObligatoriosFromDelta(PACK_OBLIGATORIOS[pack] || PACK_OBLIGATORIOS.B, canonId),
      blocks: blocks,
      nestedProfileKey: 'profesionalesPerfil',
      packFlags: pack === 'A' ? { requiresCedula: true, nivelRevisionAdmin: 'alta' } : {}
    };
  }

  global.CARIHUB_REGISTRO_PROFESIONALES_SECTOR_BLOCKS = {
    id: 'profesionales_sector_packs',
    sectorId: 'profesionales',
    subToPack: SUB_TO_PACK,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
