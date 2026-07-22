/**
 * Render Preview + Ficha — sector Automotriz packs A–F (MP-AUTOMOTRIZ-DELTAS-V1 Fase 3).
 * Fuente: scripts/automotriz-packs-v1.mjs + automotriz-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-automotriz-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = {
  "talleres-mecanicos": {
    "chips": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto",
      "tiempoRespuestaAuto"
    ],
    "rows": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "tiempoRespuestaAuto",
      "anosExperienciaAuto"
    ],
    "faq": [
      "garantiaServicioAuto"
    ]
  },
  "vulcanizadoras": {
    "chips": [
      "serviciosLlantas",
      "tiposLlantas",
      "modalidadServicioAuto"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto"
    ],
    "rows": [
      "serviciosLlantas",
      "tiposLlantas",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "garantiaServicioAuto",
      "diferenciadorAutomotriz",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "garantiaServicioAuto",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "lotes-de-autos": {
    "chips": [
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto"
    ],
    "rows": [
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible",
      "cantidadUnidadesAprox",
      "diferenciadorAutomotriz",
      "coberturaGeografica",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales",
      "financiamientoDisponible"
    ]
  },
  "agencias-de-autos": {
    "chips": [
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto"
    ],
    "rows": [
      "serviciosVentaAutos",
      "tiposVehiculoVenta",
      "financiamientoDisponible",
      "inventarioAproximado",
      "diferenciadorAutomotriz",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "colaboracionesComerciales",
      "financiamientoDisponible"
    ]
  },
  "refaccionarias": {
    "chips": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto"
    ],
    "rows": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto",
      "lineasRefacciones",
      "marcasAtendidas",
      "diferenciadorAutomotriz",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "hojalateria-y-pintura": {
    "chips": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto"
    ],
    "rows": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "diferenciadorAutomotriz",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "garantiaServicioAuto",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "lavado-de-autos": {
    "chips": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto"
    ],
    "rows": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "diferenciadorAutomotriz",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "garantiaServicioAuto",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "gruas-y-auxilio-vial": {
    "chips": [
      "serviciosGrua",
      "modalidadServicioAuto",
      "coberturaCarretera"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto",
      "tiempoRespuestaAuto"
    ],
    "rows": [
      "serviciosGrua",
      "modalidadServicioAuto",
      "coberturaCarretera",
      "tiempoRespuestaAuto",
      "tiposVehiculoAtendidos",
      "diferenciadorAutomotriz",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "coberturaCarretera",
      "colaboracionesComerciales"
    ]
  },
  "mecanicos-a-domicilio": {
    "chips": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto",
      "tiempoRespuestaAuto"
    ],
    "rows": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "tiempoRespuestaAuto",
      "anosExperienciaAuto"
    ],
    "faq": [
      "garantiaServicioAuto"
    ]
  },
  "electromecanicos": {
    "chips": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto",
      "tiempoRespuestaAuto"
    ],
    "rows": [
      "serviciosMecanica",
      "especialidadesMecanica",
      "modalidadServicioAuto",
      "marcasAtendidas",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "tiempoRespuestaAuto",
      "anosExperienciaAuto"
    ],
    "faq": [
      "garantiaServicioAuto"
    ]
  },
  "tecnicos-en-baterias": {
    "chips": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto"
    ],
    "rows": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto",
      "lineasRefacciones",
      "marcasAtendidas",
      "diferenciadorAutomotriz",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "tecnicos-en-a-c-automotriz": {
    "chips": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto"
    ],
    "rows": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto",
      "lineasRefacciones",
      "marcasAtendidas",
      "diferenciadorAutomotriz",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "instaladores-de-audio-car-multimedia": {
    "chips": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto"
    ],
    "rows": [
      "serviciosEspecialidadAuto",
      "serviciosRefacciones",
      "modalidadServicioAuto",
      "lineasRefacciones",
      "marcasAtendidas",
      "diferenciadorAutomotriz",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "detallado-automotriz-premium": {
    "chips": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioAuto"
    ],
    "rows": [
      "serviciosCarroceria",
      "serviciosEsteticaAuto",
      "modalidadServicioAuto",
      "tiposVehiculoAtendidos",
      "garantiaServicioAuto",
      "diferenciadorAutomotriz",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "garantiaServicioAuto",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  }
};

  var FIELD_LABELS = {
  "modalidadServicioAuto": "Modalidad de servicio",
  "serviciosMecanica": "Servicios mecánicos",
  "especialidadesMecanica": "Especialidades mecánicas",
  "marcasAtendidas": "Marcas que atiendes",
  "tiposVehiculoAtendidos": "Tipos de vehículo",
  "garantiaServicioAuto": "Garantía del servicio",
  "tiempoRespuestaAuto": "Tiempo de respuesta",
  "serviciosLlantas": "Servicios de llantas",
  "tiposLlantas": "Tipos de llantas",
  "serviciosCarroceria": "Servicios de carrocería",
  "serviciosEsteticaAuto": "Servicios de estética automotriz",
  "serviciosRefacciones": "Servicios / productos de refacciones",
  "lineasRefacciones": "Líneas o marcas de refacciones",
  "serviciosEspecialidadAuto": "Servicios especializados",
  "serviciosVentaAutos": "Servicios de venta",
  "tiposVehiculoVenta": "Tipos de vehículo en venta",
  "financiamientoDisponible": "Financiamiento",
  "inventarioAproximado": "Inventario aproximado",
  "cantidadUnidadesAprox": "Unidades disponibles (aprox.)",
  "serviciosGrua": "Servicios de grúa / auxilio",
  "coberturaCarretera": "Cobertura en carretera",
  "anosExperienciaAuto": "Años de experiencia",
  "diferenciadorAutomotriz": "Tu sello automotriz",
  "coberturaGeografica": "Zona de atención",
  "colaboracionesComerciales": "¿Colaboras con talleres, agencias o aseguradoras?",
  "tiposColaboracionComercial": "Tipo de colaboraciones"
};

  var FIELD_TYPES = {
  "modalidadServicioAuto": "enum",
  "serviciosMecanica": "checklist",
  "especialidadesMecanica": "checklist",
  "marcasAtendidas": "checklist",
  "tiposVehiculoAtendidos": "checklist",
  "garantiaServicioAuto": "text",
  "tiempoRespuestaAuto": "enum",
  "serviciosLlantas": "checklist",
  "tiposLlantas": "checklist",
  "serviciosCarroceria": "checklist",
  "serviciosEsteticaAuto": "checklist",
  "serviciosRefacciones": "checklist",
  "lineasRefacciones": "checklist",
  "serviciosEspecialidadAuto": "checklist",
  "serviciosVentaAutos": "checklist",
  "tiposVehiculoVenta": "checklist",
  "financiamientoDisponible": "enum",
  "inventarioAproximado": "text",
  "cantidadUnidadesAprox": "text",
  "serviciosGrua": "checklist",
  "coberturaCarretera": "text",
  "anosExperienciaAuto": "enum",
  "diferenciadorAutomotriz": "text",
  "coberturaGeografica": "text",
  "colaboracionesComerciales": "enum",
  "tiposColaboracionComercial": "checklist"
};

  var CANON_BLOCK_TITLES = {
  "talleres-mecanicos": "Talleres mecánicos",
  "vulcanizadoras": "Vulcanizadoras",
  "lotes-de-autos": "Lotes de autos",
  "agencias-de-autos": "Agencias de autos",
  "refaccionarias": "Refaccionarias",
  "hojalateria-y-pintura": "Hojalatería y pintura",
  "lavado-de-autos": "Lavado de autos",
  "gruas-y-auxilio-vial": "Grúas y auxilio vial",
  "mecanicos-a-domicilio": "Mecánicos a domicilio",
  "electromecanicos": "Electromecánicos",
  "tecnicos-en-baterias": "Técnicos en baterías",
  "tecnicos-en-a-c-automotriz": "A/C automotriz",
  "instaladores-de-audio-car-multimedia": "Audio / car multimedia",
  "detallado-automotriz-premium": "Detallado automotriz premium"
};

  var NEGOCIO_CANON = [
  "agencias-de-autos",
  "lotes-de-autos"
];

  var PACK_TITLES = {
  "A": "Mecánica y reparación",
  "B": "Llantas y vulcanización",
  "C": "Carrocería y estética",
  "D": "Refacciones y especialidades",
  "E": "Venta de vehículos",
  "F": "Grúas y auxilio vial"
};

  var SUB_TO_PACK = {
  "talleres-mecanicos": "A",
  "electromecanicos": "A",
  "mecanicos-a-domicilio": "A",
  "vulcanizadoras": "B",
  "hojalateria-y-pintura": "C",
  "lavado-de-autos": "C",
  "detallado-automotriz-premium": "C",
  "refaccionarias": "D",
  "instaladores-de-audio-car-multimedia": "D",
  "tecnicos-en-baterias": "D",
  "tecnicos-en-a-c-automotriz": "D",
  "agencias-de-autos": "E",
  "lotes-de-autos": "E",
  "gruas-y-auxilio-vial": "F"
};

  var ENUM_LABELS = {
  "modalidadServicioAuto": {
    "taller_fijo": "Taller Fijo",
    "domicilio": "Domicilio",
    "ambos": "Ambos",
    "unidad_movil": "Unidad Movil"
  },
  "tiempoRespuestaAuto": {
    "emergencia_30min": "Emergencia 30 min",
    "1h": "1h",
    "2h": "2h",
    "mismo_dia": "Mismo Dia",
    "por_cita": "Por Cita"
  },
  "financiamientoDisponible": {
    "si_propio": "Si Propio",
    "si_terceros": "Si Terceros",
    "contado_solo": "Contado Solo",
    "convenir": "Convenir"
  },
  "anosExperienciaAuto": {
    "1_3": "1 3",
    "4_7": "4 7",
    "8_15": "8 15",
    "16_mas": "16 Mas"
  },
  "colaboracionesComerciales": {
    "si_activo": "Si Activo",
    "ocasional": "Ocasional",
    "convenir": "Convenir",
    "no": "No"
  }
};

  var CARD_PACK_CLASS_PREFIX = 'res-card--auto-pack-';

  var CARD_SECTOR_CLASS = 'res-card--automotriz-sector';

  function txt(v) {
    return String(v == null ? '' : v).trim();
  }

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolveCanonSubId(u) {
    u = u || {};
    var p = perfilNested(u);
    var raw = txt(u.canonSubcategoriaId) || txt(p.canonSubcategoriaId) || txt(u.subcategoriaId);
    var key = slugSubId(raw);
    if (CANON_BLOCK_TITLES[key]) return key;
    if (SUB_TO_PACK[key]) return key;
    return '';
  }

  function perfilNested(u) {
    return (u && u.automotrizPerfil) ? u.automotrizPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isAutomotrizSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'automotriz' && (u.automotrizPerfil || u.deltaPack)) return true;
    if (u.automotrizPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isAutomotrizNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isAutomotrizSectorPerfil(u)) return null;
    return isAutomotrizNegocioPerfil(u) ? 'empresa' : 'pro';
  }

  function joinList(arr) {
    if (!Array.isArray(arr)) return txt(arr);
    return arr.filter(function (x) { return txt(x); }).map(function (x) { return formatEnumValue('', x); }).join(' · ');
  }

  function formatEnumValue(fieldId, val) {
    var k = txt(val);
    if (!k) return '';
    var map = ENUM_LABELS[fieldId];
    if (map && map[k]) return map[k];
    return humanize(k);
  }

  function humanize(v) {
    return String(v).replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function formatMoney(val) {
    var n = txt(val).replace(/[^\d.,]/g, '');
    if (!n) return txt(val);
    return txt(val).indexOf('$') === 0 ? txt(val) : ('$' + n);
  }

  function formatFieldValue(fieldId, val) {
    if (val === true) return 'Sí';
    if (val === false) return 'No';
    if (val == null) return '';
    var tipo = FIELD_TYPES[fieldId] || 'text';
    if (tipo === 'boolean') return val === true || val === 'true' || val === 1 ? 'Sí' : (val === false || val === 'false' ? 'No' : txt(val));
    if (tipo === 'checklist' || Array.isArray(val)) return joinList(val);
    if (tipo === 'enum' || tipo === 'select') return formatEnumValue(fieldId, val);
    if (fieldId === 'tarifaDesde') return formatMoney(val);
    if (tipo === 'number') return txt(val);
    return txt(val);
  }

  function fieldLabel(fieldId) {
    return FIELD_LABELS[fieldId] || humanize(fieldId);
  }

  function previewFields(canonId) {
    return PREVIEW_FICHA[canonId] || {};
  }

  function pushRow(rows, icon, label, value, block) {
    value = txt(value);
    if (!value) return;
    rows.push([icon, label, value, block || '']);
  }

  function buildServiciosList(canonId, p) {
    p = p || {};
    var pf = previewFields(canonId);
    var pack = packFrom({ automotrizPerfil: p });
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    var listFields = {
      A: ['serviciosMecanica', 'especialidadesMecanica'],
      B: ['serviciosLlantas'],
      C: ['serviciosCarroceria', 'serviciosEsteticaAuto'],
      D: ['serviciosRefacciones', 'serviciosEspecialidadAuto'],
      E: ['serviciosVentaAutos'],
      F: ['serviciosGrua']
    };
    (listFields[pack] || []).forEach(function (fid) {
      formatFieldValue(fid, p[fid]).split(' · ').forEach(function (x) {
        if (x && items.indexOf(x) < 0) items.push(x);
      });
    });
    if (p.modalidadServicioAuto) {
      var mod = formatEnumValue('modalidadServicioAuto', p.modalidadServicioAuto);
      if (mod && items.indexOf(mod) < 0) items.push(mod);
    }
    return items.filter(function (x) { return txt(x); }).slice(0, 8);
  }

  function buildDatosRows(canonId, p, u) {
    p = p || {};
    u = u || {};
    var rows = [];
    var pf = previewFields(canonId);
    var seen = {};
    function addField(fid, icon) {
      if (seen[fid]) return;
      seen[fid] = true;
      var val = formatFieldValue(fid, p[fid]);
      if (!val) return;
      pushRow(rows, icon || '📋', fieldLabel(fid), val);
    }
    (pf.stats || []).forEach(function (fid) { addField(fid, '📊'); });
    (pf.rows || []).forEach(function (fid) { addField(fid, '✨'); });
    (pf.faq || []).slice(0, 2).forEach(function (fid) { addField(fid, 'ℹ️'); });
    if (p.horarioDetalle) pushRow(rows, '🕐', 'Horario', p.horarioDetalle, 'horario');
    else if (u.horario) pushRow(rows, '🕐', 'Horario', u.horario, 'horario');
    if (p.certificaciones) pushRow(rows, '🎖️', 'Certificaciones', p.certificaciones);
    if (p.diferenciadorAutomotriz) pushRow(rows, '🚗', 'Tu sello', p.diferenciadorAutomotriz);
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.direccion) pushRow(rows, '🏢', 'Dirección', p.direccion);
    if (p.coberturaGeografica) pushRow(rows, '🗺️', 'Cobertura', p.coberturaGeografica);
    if (p.coberturaCarretera) pushRow(rows, '🛣️', 'Carretera', p.coberturaCarretera);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var badges = [];
    if (txt(p.garantiaServicioAuto)) {
      badges.push({ cls: 'res-badge--garantia', text: 'Con garantía' });
    }
    if (p.tiempoRespuestaAuto === 'emergencia_30min') {
      badges.push({ cls: 'res-badge--urgencias', text: '30 min respuesta' });
    } else if (p.tiempoRespuestaAuto === '1h') {
      badges.push({ cls: 'res-badge--urgencias', text: '1 h respuesta' });
    } else if (p.tiempoRespuestaAuto === 'mismo_dia') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Mismo día' });
    }
    if (p.colaboracionesComerciales && txt(p.colaboracionesComerciales) && p.colaboracionesComerciales !== 'no') {
      badges.push({ cls: 'res-badge--colab', text: 'Colabora con otros' });
    }
    if (txt(p.certificaciones)) {
      badges.push({ cls: 'res-badge--cert', text: 'Certificado' });
    }
    return badges;
  }

  function buildStats(canonId, p) {
    p = p || {};
    var pf = previewFields(canonId);
    var stats = [];
    (pf.stats || []).slice(0, 4).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) stats.push([val, fieldLabel(fid)]);
    });
    while (stats.length < 4) {
      var fillers = [
        ['Automotriz', 'Especialidad'],
        ['Consultar', 'Tarifa'],
        ['Verificado', 'En plataforma'],
        ['Servicio', 'Sujeto a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(pack) {
    if (pack === 'A') {
      return ['Mecánica y reparación', 'Marcas declaradas', 'Modalidad visible', 'Garantía publicada'];
    }
    if (pack === 'B') {
      return ['Llantas y vulcanización', 'Tipos de llanta', 'Modalidad declarada', 'Perfil verificable'];
    }
    if (pack === 'C') {
      return ['Carrocería y estética', 'Servicios visibles', 'Cobertura clara', 'Perfil verificable'];
    }
    if (pack === 'D') {
      return ['Refacciones y especialidades', 'Líneas declaradas', 'Modalidad visible', 'Perfil verificable'];
    }
    if (pack === 'E') {
      return ['Venta de vehículos', 'Inventario declarado', 'Financiamiento visible', 'Perfil verificable'];
    }
    return ['Grúas y auxilio vial', 'Cobertura carretera', 'Tiempos de respuesta', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId, p) {
    p = p || {};
    var faqs = [];
    function pushFaq(q, a) {
      if (!q || !a) return;
      faqs.push({ q: q, a: String(a) });
    }
    function fallbackAnswer(fid) {
      if (fid === 'garantiaServicioAuto') return 'La garantía publicada aplica sobre mano de obra según el servicio. Pregunta alcance y vigencia antes de autorizar.';
      if (fid === 'coberturaGeografica' || fid === 'coberturaCarretera') return 'Atendemos la zona publicada. Fuera de cobertura, consulta disponibilidad y costo extra.';
      if (fid === 'tiempoRespuestaAuto') return 'El tiempo de respuesta depende de la demanda y la zona; confirma por WhatsApp al momento.';
      if (fid === 'modalidadServicioAuto') return 'Indica si necesitas taller fijo, domicilio o unidad móvil según lo publicado en el perfil.';
      if (fid === 'financiamientoDisponible') return 'Las opciones de financiamiento están en el perfil; valida requisitos con el vendedor.';
      if (fid === 'colaboracionesComerciales') return 'Si colaboramos con talleres, agencias o aseguradoras, lo indicamos en el perfil.';
      return 'Escríbenos por el contacto publicado y te confirmamos detalles al momento.';
    }
    var pf = previewFields(canonId);
    (pf.faq || []).forEach(function (fid) {
      var label = fieldLabel(fid);
      var val = formatFieldValue(fid, p[fid]);
      pushFaq('¿' + label + '?', val || fallbackAnswer(fid));
    });
    if (faqs.length < 2) {
      pushFaq('¿Incluyen garantía?', formatFieldValue('garantiaServicioAuto', p.garantiaServicioAuto) || fallbackAnswer('garantiaServicioAuto'));
      pushFaq('¿Cuál es la cobertura?', formatFieldValue('coberturaGeografica', p.coberturaGeografica) || formatFieldValue('coberturaCarretera', p.coberturaCarretera) || fallbackAnswer('coberturaGeografica'));
    }
    if (faqs.length < 3) {
      pushFaq('¿Cuál es el horario?', p.horarioDetalle || 'Consulta el horario publicado en el perfil.');
    }
    if (faqs.length < 4) {
      pushFaq('¿Atienden urgencias?', formatFieldValue('tiempoRespuestaAuto', p.tiempoRespuestaAuto) || fallbackAnswer('tiempoRespuestaAuto'));
    }
    return faqs.slice(0, 6);
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel(u) {
    if (isAutomotrizNegocioPerfil(u)) return 'Servicios desde';
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorAutomotriz) return p.diferenciadorAutomotriz;
    if (p.serviciosMecanica && p.serviciosMecanica[0]) return p.serviciosMecanica[0];
    if (p.serviciosVentaAutos && p.serviciosVentaAutos[0]) return p.serviciosVentaAutos[0];
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios automotrices en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isAutomotrizSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__automotrizCanon = canonId;
    u.__automotrizPack = pack;
    u.sectorId = u.sectorId || 'automotriz';
    u.titulo = u.categoriaPublica || u.categoria || CANON_BLOCK_TITLES[canonId] || p.blockTitle || PACK_TITLES[pack] || 'Servicios automotrices';
    u.especialidad = u.especialidad
      || (p.serviciosEsteticaAuto && p.serviciosEsteticaAuto[0])
      || (p.serviciosCarroceria && p.serviciosCarroceria[0])
      || (p.serviciosRefacciones && p.serviciosRefacciones[0])
      || (p.serviciosVentaAutos && p.serviciosVentaAutos[0])
      || (p.serviciosGrua && p.serviciosGrua[0])
      || (p.especialidadesMecanica && p.especialidadesMecanica[0])
      || (p.serviciosMecanica && p.serviciosMecanica[0])
      || (p.serviciosLlantas && p.serviciosLlantas[0])
      || (p.serviciosEspecialidadAuto && p.serviciosEspecialidadAuto[0])
      || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioDetalle || '';
    if (isAutomotrizNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadServicioAuto ? formatEnumValue('modalidadServicioAuto', p.modalidadServicioAuto) : 'Consultar modalidad');
    u.modalidadServicioAuto = u.modalidadServicioAuto || p.modalidadServicioAuto || '';
    u.diferenciadorAutomotriz = u.diferenciadorAutomotriz || p.diferenciadorAutomotriz || '';
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || txt(p.coberturaCarretera) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación / registro']];
    }
    u.__automotrizDatos = buildDatosRows(canonId, p, u);
    u.__automotrizBadges = buildBadges(u, canonId);
    u.__automotrizPriceLabel = resolvePriceLabel(u);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId, p);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Refacciones no declaradas', 'Servicios fuera del alcance publicado', 'Auxilio no cubierto salvo indicación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || formatEnumValue('tiempoRespuestaAuto', p.tiempoRespuestaAuto) || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || (p.tiempoRespuestaAuto === 'emergencia_30min' || p.tiempoRespuestaAuto === '1h' ? formatEnumValue('tiempoRespuestaAuto', p.tiempoRespuestaAuto) : 'Consultar disponibilidad');
    if (txt(p.garantiaServicioAuto)) u.garantia = p.garantiaServicioAuto;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__automotrizCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.modalidadServicioAuto) {
      chips.push(formatEnumValue('modalidadServicioAuto', p.modalidadServicioAuto).slice(0, 28));
    }
    if (p.tiempoRespuestaAuto === 'emergencia_30min') chips.push('30 min respuesta');
    else if (p.tiempoRespuestaAuto === '1h') chips.push('1 h respuesta');
    else if (p.tiempoRespuestaAuto === 'mismo_dia') chips.push('Mismo día');
    if (txt(p.garantiaServicioAuto)) chips.push('Con garantía');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubAutomotrizSectorRender = {
    PACK_TITLES: PACK_TITLES,
    CARD_PACK_CLASS_PREFIX: CARD_PACK_CLASS_PREFIX,
    CARD_SECTOR_CLASS: CARD_SECTOR_CLASS,
    isAutomotrizSectorPerfil: isAutomotrizSectorPerfil,
    isAutomotrizNegocioPerfil: isAutomotrizNegocioPerfil,
    resolveVistaPerfil: resolveVistaPerfil,
    resolveCanonSubId: resolveCanonSubId,
    packFrom: packFrom,
    hydrateDisplayFields: hydrateDisplayFields,
    cardMetaChips: cardMetaChips,
    buildServiciosList: buildServiciosList,
    buildDatosRows: buildDatosRows,
    buildBadges: buildBadges,
    formatFieldValue: formatFieldValue,
    fieldLabel: fieldLabel,
  };
})(typeof window !== 'undefined' ? window : globalThis);
