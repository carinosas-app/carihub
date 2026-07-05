/**
 * Bloques registro — sector Bienestar (persona independiente + retail D).
 * MP-BIENESTAR-DELTAS-V1 Fase 2 — 8 packs A–H (no 60 formularios).
 * Fuente schema: scripts/bienestar-packs-v1.mjs + config-registro-independiente-schema.json
 */
(function (global) {
  'use strict';

  var RETAIL_NEGOCIO_SUBS = ['venta-de-inciensos', 'venta-de-aceites-esenciales'];

  var SUB_TO_PACK = {
    temazcales: 'C', 'centros-holisticos': 'C', 'centros-de-bienestar': 'C',
    'centros-de-meditacion': 'C', 'centros-de-yoga': 'C', 'centros-de-sanacion': 'C',
    'retiros-espirituales': 'G', 'turismo-espiritual': 'G', 'medicina-ancestral': 'H',
    chamanismo: 'H', 'ceremonias-tradicionales': 'H', 'terapias-holisticas': 'A',
    reiki: 'A', biomagnetismo: 'A', acupuntura: 'A', aromaterapia: 'A', sonoterapia: 'B',
    'terapias-energeticas': 'A', 'terapias-alternativas': 'A', 'medicina-natural': 'A',
    naturopatia: 'A', herbolaria: 'D', ayurveda: 'B', 'medicina-tradicional-china': 'A',
    'flores-de-bach': 'A', homeopatia: 'A', 'masajes-holisticos': 'A', 'masajes-relajantes': 'A',
    'masajes-terapeuticos': 'A', yoga: 'B', pilates: 'B', meditacion: 'B', breathwork: 'B',
    'coaching-de-vida': 'F', 'coaching-espiritual': 'F', 'desarrollo-personal': 'F',
    'crecimiento-personal': 'F', tarot: 'E', astrologia: 'E', numerologia: 'E',
    'lectura-de-cartas': 'E', 'lectura-de-runas': 'E', 'feng-shui': 'E', 'limpias-energeticas': 'A',
    cristaloterapia: 'E', 'tiendas-esotericas': 'D', 'productos-holisticos': 'D',
    'productos-naturistas': 'D', 'suplementos-naturales': 'D', herbolarios: 'D', naturistas: 'D',
    'venta-de-inciensos': 'D', 'venta-de-aceites-esenciales': 'D',
    'ceremonias-ayahuasca-rape-plantas-de-poder': 'H', 'cacao-ceremonial': 'G',
    reflexologia: 'A', 'registros-akashicos': 'E', 'cosmetica-natural': 'D',
    'velas-esotericas': 'D', sahumerios: 'D'
  };

  var PACK_H_PROHIBITED_FIELD_IDS = [
    'catalogoProductos', 'envioDomicilio', 'tiendaOnline', 'stockProductos',
    'dosisSustancia', 'precioPorSustancia', 'carritoEcommerce', 'categoriasProductoBienestar',
    'surtidoPrincipal', 'ventaPresencial'
  ];

  var PACK_H_COMMERCIAL_PATTERNS = [
    /\bventa\s+directa\b/i,
    /\benv[ií]o\s+a\s+domicilio\b/i,
    /\benv[ií]os?\b/i,
    /\bstock\b/i,
    /\bdosis\b/i,
    /\bcarrito\b/i,
    /\be-?\s?commerce\b/i,
    /\bcat[aá]logo\s+de\s+sustancias\b/i,
    /\bdistribuci[oó]n\s+de\s+sustancias\b/i,
    /\bprecio\s+por\s+(gramo|ml|dosis|sustancia)\b/i,
    /\bcomprar\s+(ayahuasca|rap[eé]|huachuma|peyote|iboga)\b/i
  ];

  var DURACION_OPTS = [
    { value: '30_min', label: '30 min' },
    { value: '45_min', label: '45 min' },
    { value: '60_min', label: '60 min' },
    { value: '90_min', label: '90 min' },
    { value: '120_min', label: '120 min' },
    { value: 'variable', label: 'Variable' }
  ];

  var MODALIDAD_CLASE = [
    { value: 'presencial', label: 'Presencial' },
    { value: 'online', label: 'En línea' },
    { value: 'hibrido', label: 'Híbrido' }
  ];

  var NIVELES = [
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' },
    { value: 'todos', label: 'Todos los niveles' }
  ];

  function slugSubId(id) {
    return String(id || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/_/g, '-');
  }

  function resolvePack(subcategoriaId) {
    var key = slugSubId(subcategoriaId);
    return SUB_TO_PACK[key] || 'A';
  }

  function isNegocioRetailSub(subcategoriaId) {
    return RETAIL_NEGOCIO_SUBS.indexOf(slugSubId(subcategoriaId)) >= 0;
  }

  function personaBaseBlocks() {
    return [
      {
        id: 'bienestarBase',
        title: 'Perfil holístico',
        hint: 'Información pública — sin claims médicos ni promesas de curación.',
        fields: [
          { id: 'alias', label: 'Nombre público', type: 'text', required: true, placeholder: 'Ej. Luna Reiki CDMX' },
          { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
          {
            id: 'certificaciones',
            label: 'Certificaciones (no sustituyen cédula)',
            type: 'textarea',
            required: true,
            rows: 2,
            placeholder: 'Cursos, diplomas o certificaciones relevantes'
          }
        ]
      },
      {
        id: 'bienestarTarifaHorario',
        title: 'Tarifa y horario',
        fields: [
          { id: 'tarifaDesde', label: 'Tarifa desde (MXN)', type: 'text', required: true, placeholder: 'Ej. $600' },
          { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true, placeholder: 'Ej. Lun–Sáb 10:00–19:00' }
        ]
      }
    ];
  }

  function packBlocksA() {
    return [{
      id: 'packA_terapia',
      title: 'Terapia corporal / manual',
      fields: [
        {
          id: 'modalidadesTerapia',
          label: 'Modalidades de terapia',
          type: 'checklist',
          required: true,
          options: ['Masaje', 'Presión', 'Energética manual', 'Reflexología', 'Craniosacral', 'Otra modalidad manual']
        },
        { id: 'duracionSesionMinutos', label: 'Duración típica de sesión', type: 'select', required: true, options: DURACION_OPTS },
        {
          id: 'contraindicacionesGenerales',
          label: 'Contraindicaciones generales (informativas)',
          type: 'textarea',
          required: true,
          rows: 3,
          placeholder: 'Información general; no sustituye consulta médica.'
        },
        { id: 'atencionDomicilio', label: '¿Atención a domicilio?', type: 'select', required: false, options: ['Sí', 'No'], defaultValue: 'No' }
      ]
    }];
  }

  function packBlocksB() {
    return [{
      id: 'packB_movimiento',
      title: 'Movimiento / mente-cuerpo',
      fields: [
        { id: 'tipoPractica', label: 'Estilo o linaje', type: 'text', required: true, placeholder: 'Ej. Hatha, Vinyasa, Pilates clásico' },
        { id: 'modalidadClase', label: 'Modalidad de clase', type: 'select', required: true, options: MODALIDAD_CLASE },
        { id: 'nivelesAtendidos', label: 'Niveles atendidos', type: 'select', required: true, options: NIVELES }
      ]
    }];
  }

  function packBlocksC() {
    return [{
      id: 'packC_centro',
      title: 'Centro / espacio holístico',
      fields: [
        {
          id: 'serviciosCentro',
          label: 'Servicios del espacio',
          type: 'checklist',
          required: true,
          options: ['Terapias individuales', 'Grupos', 'Talleres', 'Ceremonias', 'Retiros', 'Estacionamiento', 'Accesibilidad']
        },
        { id: 'capacidadGrupo', label: 'Capacidad máxima (personas)', type: 'text', required: true, placeholder: 'Ej. 12' }
      ]
    }];
  }

  function packBlocksD(isNegocio) {
    if (isNegocio) {
      return [{
        id: 'packD_tienda_negocio',
        title: 'Tienda natural (presencial)',
        hint: 'Venta presencial — sin catálogo de sustancias reguladas ni e-commerce.',
        fields: [
          { id: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
          {
            id: 'categoriasProductoBienestar',
            label: 'Categorías de productos',
            type: 'checklist',
            required: true,
            options: ['Inciensos', 'Aceites esenciales', 'Velas', 'Sahumerios', 'Cosmética natural', 'Hierbas', 'Cristales', 'Otros naturales']
          },
          { id: 'surtidoPrincipal', label: 'Surtido principal (texto breve)', type: 'text', required: true, placeholder: 'Ej. Inciensos artesanales y resinas' },
          { id: 'direccion', label: 'Dirección o zona pública', type: 'textarea', required: true, rows: 2 },
          { id: 'horarioDetalle', label: 'Horario', type: 'text', required: true }
        ]
      }];
    }
    return [{
      id: 'packD_productos',
      title: 'Productos / tienda natural',
      hint: 'Describe surtido presencial; no incluyas venta de sustancias reguladas.',
      fields: [
        {
          id: 'categoriasProductoBienestar',
          label: 'Categorías de productos',
          type: 'checklist',
          required: true,
          options: ['Inciensos', 'Aceites', 'Velas', 'Cosmética', 'Hierbas', 'Suplementos', 'Cristales', 'Otros']
        },
        { id: 'surtidoPrincipal', label: 'Surtido principal', type: 'text', required: true },
        { id: 'ventaPresencial', label: '¿Venta presencial en punto fijo?', type: 'select', required: true, options: ['Sí', 'No'], defaultValue: 'Sí' }
      ]
    }];
  }

  function packBlocksE() {
    return [{
      id: 'packE_espiritual',
      title: 'Espiritualidad / lectura',
      fields: [
        {
          id: 'enfoqueEspiritual',
          label: 'Enfoque espiritual',
          type: 'textarea',
          required: true,
          rows: 3,
          placeholder: 'Orientación simbólica; sin diagnóstico médico.'
        },
        {
          id: 'modalidadLectura',
          label: 'Modalidad',
          type: 'select',
          required: true,
          options: [
            { value: 'presencial', label: 'Presencial' },
            { value: 'online', label: 'En línea' },
            { value: 'ambas', label: 'Ambas' }
          ]
        }
      ]
    }];
  }

  function packBlocksF() {
    return [{
      id: 'packF_coaching',
      title: 'Coaching / desarrollo personal',
      fields: [
        { id: 'areaCoaching', label: 'Áreas de acompañamiento', type: 'text', required: true, placeholder: 'Ej. Propósito, transiciones, hábitos' },
        {
          id: 'modalidadSesionCoaching',
          label: 'Modalidad de sesión',
          type: 'select',
          required: true,
          options: [
            { value: 'individual', label: 'Individual' },
            { value: 'grupal', label: 'Grupal' },
            { value: 'mixta', label: 'Mixta' }
          ]
        }
      ]
    }];
  }

  function packBlocksG() {
    return [{
      id: 'packG_experiencia',
      title: 'Retiros / experiencias / ceremonias',
      fields: [
        {
          id: 'tipoExperiencia',
          label: 'Tipo de experiencia',
          type: 'select',
          required: true,
          options: [
            { value: 'retiro', label: 'Retiro' },
            { value: 'ceremonia', label: 'Ceremonia guiada' },
            { value: 'taller', label: 'Taller' },
            { value: 'inmersion', label: 'Inmersión' },
            { value: 'consulta_fechas', label: 'Consultar fechas / solicitar información' }
          ]
        },
        { id: 'duracionExperiencia', label: 'Duración', type: 'text', required: false, placeholder: 'Ej. 3 días / 1 noche' },
        { id: 'fechasExperiencia', label: 'Fechas o calendario', type: 'text', required: true },
        { id: 'lugarExperiencia', label: 'Lugar', type: 'text', required: true },
        { id: 'cupoMaximo', label: 'Cupo máximo', type: 'text', required: true, placeholder: 'Ej. 10' }
      ]
    }];
  }

  function packBlocksH() {
    return [
      {
        id: 'packH_aviso',
        title: 'Experiencia ceremonial regulada',
        hint: 'Solo ceremonias guiadas, retiros o consulta de fechas. Prohibida venta, envío o comercialización de sustancias. CTA: solicitar información o consultar fechas.',
        fields: [
          {
            id: 'tipoExperienciaCeremonial',
            label: 'Tipo de experiencia',
            type: 'select',
            required: true,
            options: [
              { value: 'ceremonia_guiada', label: 'Ceremonia guiada' },
              { value: 'centro_retiro', label: 'Centro de retiro' },
              { value: 'experiencia_ceremonial', label: 'Experiencia ceremonial' },
              { value: 'facilitador_guia', label: 'Facilitador / guía' },
              { value: 'consulta_fechas', label: 'Solicitar información / consultar fechas' }
            ]
          },
          {
            id: 'acompanamientoCeremonial',
            label: 'Acompañamiento ofrecido',
            type: 'checklist',
            required: true,
            options: ['Antes', 'Durante', 'Después']
          },
          { id: 'requisitosPrevios', label: 'Requisitos previos', type: 'textarea', required: true, rows: 3 },
          { id: 'fechasCeremonia', label: 'Fechas / cupo / calendario', type: 'text', required: true },
          { id: 'cupoCeremonia', label: 'Cupo disponible', type: 'text', required: true },
          { id: 'lugarCeremonia', label: 'Lugar de la ceremonia o retiro', type: 'text', required: true },
          {
            id: 'jurisdiccionDeclarada',
            label: 'Jurisdicción donde opera la experiencia',
            type: 'text',
            required: true,
            placeholder: 'Ej. México — Oaxaca'
          },
          {
            id: 'contraindicacionesObligatorias',
            label: 'Contraindicaciones obligatorias',
            type: 'textarea',
            required: true,
            rows: 4,
            placeholder: 'Declara contraindicaciones; no prometer curación.'
          },
          { id: 'edadMinimaServicio', label: 'Edad mínima del participante', type: 'text', required: true, defaultValue: '18' },
          {
            id: 'disclaimerRegulado',
            label: 'Acepto el aviso legal: solo experiencia ceremonial, sin venta de sustancias',
            type: 'boolean',
            required: true
          }
        ]
      },
      {
        id: 'packH_tarifa',
        title: 'Contribución / participación',
        fields: [
          {
            id: 'tarifaDesde',
            label: 'Contribución o tarifa de participación (MXN)',
            type: 'text',
            required: true,
            placeholder: 'Ej. consultar — no precio por sustancia'
          },
          { id: 'horarioDetalle', label: 'Horario o ventana de contacto', type: 'text', required: true }
        ]
      }
    ];
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
    A: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'modalidadesTerapia', 'duracionSesionMinutos', 'contraindicacionesGenerales'],
    B: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'tipoPractica', 'modalidadClase', 'nivelesAtendidos'],
    C: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosCentro', 'capacidadGrupo'],
    D: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'categoriasProductoBienestar', 'surtidoPrincipal'],
    D_NEGOCIO: ['nombreComercial', 'categoriasProductoBienestar', 'surtidoPrincipal', 'direccion', 'horarioDetalle'],
    E: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'enfoqueEspiritual', 'modalidadLectura'],
    F: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'areaCoaching', 'modalidadSesionCoaching'],
    G: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'tipoExperiencia', 'fechasExperiencia', 'lugarExperiencia', 'cupoMaximo'],
    H: [
      'alias', 'certificaciones', 'disclaimerRegulado', 'edadMinimaServicio', 'jurisdiccionDeclarada',
      'contraindicacionesObligatorias', 'tipoExperienciaCeremonial', 'acompanamientoCeremonial',
      'requisitosPrevios', 'fechasCeremonia', 'cupoCeremonia', 'lugarCeremonia', 'tarifaDesde', 'horarioDetalle'
    ]
  };

  function getSubDeltaApi() {
    return {
      meta: global.CARIHUB_BIENESTAR_SUB_CANON_META || {},
      deltas: global.CARIHUB_BIENESTAR_SUB_DELTAS || {}
    };
  }

  function resolveCanonSubId(raw) {
    var key = slugSubId(raw);
    var api = getSubDeltaApi();
    if (api.deltas[key]) return key;
    return key;
  }

  function cloneBlocks(blocks) {
    return JSON.parse(JSON.stringify(blocks || []));
  }

  function applyFieldPatch(field, delta, subId) {
    if (!field || !delta) return field;
    var opts = delta.fieldOptions && delta.fieldOptions[field.id];
    if (opts && opts.length) {
      if (field.type === 'checklist' || field.type === 'select') {
        field.options = opts.slice();
      }
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
    if (field.id === 'surtidoPrincipal' && delta.surtidoPlaceholder) {
      field.placeholder = delta.surtidoPlaceholder;
    }
    return field;
  }

  function buildBienestarExtraField(fieldId, delta, required) {
    var select = function (label, options) {
      return { id: fieldId, label: label, type: 'select', required: !!required, options: options || MODALIDAD_CLASE };
    };
    var checklist = function (label, options) {
      return { id: fieldId, label: label, type: 'checklist', required: !!required, options: options || [] };
    };
    var text = function (label, ph) {
      return { id: fieldId, label: label, type: 'text', required: !!required, placeholder: ph || '' };
    };
    var map = {
      modalidadSesionEnergetica: select('Modalidad de sesión', MODALIDAD_CLASE),
      modalidadSesionCoaching: select('Modalidad de sesión', MODALIDAD_CLASE),
      modalidadSesionTerapia: select('Modalidad de sesión', [
        { value: 'presencial', label: 'Presencial en consultorio / espacio' },
        { value: 'domicilio', label: 'Visita a domicilio del cliente' },
        { value: 'hibrido', label: 'Ambas modalidades' }
      ]),
      modalidadLecturaDetalle: select('Modalidad de lectura', MODALIDAD_CLASE),
      certificacionReiki: text('Certificación / linaje Reiki', 'Ej. Usui Shiki Ryoho — nivel II'),
      formatoClaseYoga: select('Formato de clase', [
        { value: 'grupal', label: 'Clase grupal' },
        { value: 'privada', label: 'Clase privada' },
        { value: 'ambas', label: 'Ambas' },
        { value: 'retiros', label: 'Retiros / talleres' }
      ]),
      estilosYogaDetalle: checklist('Estilos que impartes', ['Hatha', 'Vinyasa', 'Yin', 'Restaurativo', 'Prenatal', 'Otra']),
      equipamientoPilates: checklist('Equipamiento', ['Mat', 'Reformer', 'Cadillac', 'Otros']),
      duracionMeditacion: select('Duración típica', DURACION_OPTS),
      experienciaMeditacion: checklist('Experiencia ofrecida', ['Principiantes', 'Intermedio', 'Avanzado', 'Todos']),
      areasCoachingDetalle: checklist('Áreas de acompañamiento', ['Propósito', 'Metas', 'Hábitos', 'Transiciones', 'Otro']),
      capacidadTemazcal: text('Capacidad del temazcal (personas)', 'Ej. 8–12'),
      serviciosTemazcal: checklist('Servicios del temazcal', ['Ceremonia grupal', 'Ceremonia privada', 'Integración post-ceremonia']),
      reservacionTemazcal: select('Reservación', [
        { value: 'cita_previa', label: 'Cita previa obligatoria' },
        { value: 'eventos', label: 'Eventos programados' },
        { value: 'ambos', label: 'Ambos' }
      ]),
      zonaCorporalMasaje: checklist('Zonas corporales', ['Espalda', 'Cuello', 'Piernas', 'Cuerpo completo', 'Otro']),
      barajasTarot: checklist('Barajas / oráculos', ['Rider Waite', 'Marsella', 'Oráculos', 'Otra']),
      colaboracionesComerciales: select('¿Colaboras con otros profesionales o centros?', [
        { value: 'si_activo', label: 'Sí, colaboro activamente' },
        { value: 'ocasional', label: 'Ocasionalmente' },
        { value: 'convenir', label: 'A convenir' },
        { value: 'no', label: 'No por ahora' }
      ]),
      diferenciadorProfesional: text('Tu sello / enfoque', 'Ej. Sesiones bilingües · Espacio acogedor'),
      coberturaGeografica: text('Zona de atención', 'Ej. CDMX sur · También en línea')
    };
    var field = map[fieldId];
    if (!field) return null;
    field = JSON.parse(JSON.stringify(field));
    applyFieldPatch(field, delta, '');
    return field;
  }

  function applySubDeltaToBlocks(blocks, subId, negocioRetail) {
    var api = getSubDeltaApi();
    var delta = api.deltas[subId];
    if (!delta) return blocks;
    var oblSet = {};
    (delta.obligatoriosDelta || []).forEach(function (fid) { oblSet[fid] = true; });
    var out = cloneBlocks(blocks);
    out.forEach(function (block) {
      if (block.id === 'bienestarBase') {
        block.fields.forEach(function (field) {
          if (field.id === 'alias' && delta.aliasPlaceholder) {
            field.placeholder = delta.aliasPlaceholder;
          }
        });
        return;
      }
      if (block.id && block.id.indexOf('pack') === 0) {
        block.title = delta.blockTitle || block.title;
        if (delta.blockHint) block.hint = delta.blockHint;
      }
      if (delta.hideFields && delta.hideFields.length && block.fields) {
        block.fields = block.fields.filter(function (f) {
          return delta.hideFields.indexOf(f.id) < 0;
        });
      }
      (block.fields || []).forEach(function (field) {
        applyFieldPatch(field, delta, subId);
      });
      if (delta.extraFields && delta.extraFields.length && block.id && block.id.indexOf('pack') === 0) {
        delta.extraFields.forEach(function (fid) {
          if ((block.fields || []).some(function (f) { return f.id === fid; })) return;
          var extra = buildBienestarExtraField(fid, delta, !!oblSet[fid]);
          if (extra) block.fields.push(extra);
        });
      }
    });
    return out;
  }

  function mergeObligatoriosFromDelta(packOblig, subId) {
    var api = getSubDeltaApi();
    var delta = api.deltas[subId];
    var list = (packOblig || []).slice();
    if (!delta || !Array.isArray(delta.obligatoriosDelta)) return list;
    delta.obligatoriosDelta.forEach(function (fid) {
      if (fid === 'geo') return;
      if (list.indexOf(fid) < 0) list.push(fid);
    });
    return list;
  }

  function appendPackBlocks(pack, negocioRetail) {
    if (pack === 'D') return packBlocksD(negocioRetail);
    var fn = PACK_BUILDERS[pack] || packBlocksA;
    return fn();
  }

  function buildConfig(ctx) {
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || '');
    var pack = resolvePack(canonId);
    var negocioRetail = isNegocioRetailSub(canonId) && String(ctx.formularioId || '') === 'negocio_empresa';
    var blocks = negocioRetail ? appendPackBlocks('D', true) : personaBaseBlocks().concat(appendPackBlocks(pack, false));
    blocks = applySubDeltaToBlocks(blocks, canonId, negocioRetail);
    var obligKey = negocioRetail ? 'D_NEGOCIO' : pack;
    return {
      id: 'bienestar_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'bienestar',
      formularioId: negocioRetail ? 'negocio_empresa' : 'persona_independiente',
      uiIds: ['ui_ind_bienestar', 'ui_ind_coach', 'ui_neg_comercio'],
      fotosMin: pack === 'H' ? 3 : 2,
      obligatorios: mergeObligatoriosFromDelta(PACK_OBLIGATORIOS[obligKey] || PACK_OBLIGATORIOS.A, canonId),
      blocks: blocks,
      packFlags: pack === 'H' ? {
        sensible: true,
        regulada: true,
        requiresAdminReview: true,
        soloExperienciaCeremonial: true,
        camposProhibidos: PACK_H_PROHIBITED_FIELD_IDS.slice()
      } : {},
      negocioRetail: negocioRetail
    };
  }

  function scanPackHCommercialText(values) {
    values = values || {};
    var keys = [
      'tagline', 'requisitosPrevios', 'contraindicacionesObligatorias',
      'fechasCeremonia', 'lugarCeremonia', 'jurisdiccionDeclarada', 'tarifaDesde', 'alias'
    ];
    var hits = [];
    keys.forEach(function (key) {
      var text = String(values[key] || '');
      if (!text.trim()) return;
      PACK_H_COMMERCIAL_PATTERNS.forEach(function (re) {
        if (re.test(text)) hits.push({ campo: key, patron: re.source });
      });
    });
    return hits;
  }

  function validatePackH(values) {
    var errors = [];
    if (!values.disclaimerRegulado) errors.push('Debes aceptar el aviso legal (Pack H).');
    if (String(values.edadMinimaServicio || '').trim() !== '18') errors.push('Edad mínima debe ser 18.');
    if (!String(values.jurisdiccionDeclarada || '').trim()) errors.push('Jurisdicción obligatoria.');
    if (!String(values.contraindicacionesObligatorias || '').trim()) errors.push('Contraindicaciones obligatorias.');
    scanPackHCommercialText(values).forEach(function (hit) {
      errors.push('Lenguaje comercial prohibido en ' + hit.campo);
    });
    PACK_H_PROHIBITED_FIELD_IDS.forEach(function (fid) {
      if (values[fid] != null && String(values[fid]).trim() !== '') {
        errors.push('Campo prohibido en Pack H: ' + fid);
      }
    });
    return errors;
  }

  global.CARIHUB_REGISTRO_BIENESTAR_SECTOR_BLOCKS = {
    id: 'bienestar_sector_packs',
    sectorId: 'bienestar',
    subToPack: SUB_TO_PACK,
    retailNegocioSubs: RETAIL_NEGOCIO_SUBS,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig,
    validatePackH: validatePackH,
    scanPackHCommercialText: scanPackHCommercialText,
    packHProhibitedFieldIds: PACK_H_PROHIBITED_FIELD_IDS
  };
})(typeof window !== 'undefined' ? window : globalThis);
