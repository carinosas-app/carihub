/**
 * Render Preview + Ficha — sector Hogar packs A–D (MP-HOGAR-DELTAS-V1 Fase 3).
 * Fuente: scripts/hogar-packs-v1.mjs + hogar-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-hogar-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = {
  "plomeros": {
    "chips": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "electricistas": {
    "chips": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "pintores": {
    "chips": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "especialidadesHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "albaniles": {
    "chips": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "carpinteros": {
    "chips": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar",
      "materialesIncluidos",
      "especialidadesHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "herreros": {
    "chips": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar",
      "materialesIncluidos",
      "especialidadesHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "jardineria": {
    "chips": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "especialidadesHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "fumigacion": {
    "chips": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "especialidadesHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "limpieza-del-hogar": {
    "chips": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "especialidadesHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "mantenimiento-general": {
    "chips": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "especialidadesHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "tecnicos-en-clima-hvac": {
    "chips": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "impermeabilizadores": {
    "chips": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "instaladores-de-paneles-solares": {
    "chips": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "tecnicos-en-camaras-de-seguridad": {
    "chips": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "instaladores-de-pisos": {
    "chips": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar",
      "materialesIncluidos",
      "especialidadesHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "cerrajeros": {
    "chips": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "tiposTrabajoHogar",
      "modalidadServicioHogar",
      "materialesIncluidos",
      "especialidadesHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  },
  "domotica-casa-inteligente": {
    "chips": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioHogar",
      "tiempoRespuestaHogar"
    ],
    "rows": [
      "serviciosHogar",
      "especialidadesHogar",
      "modalidadServicioHogar",
      "tiposInmueble",
      "tiempoRespuestaHogar",
      "garantiaServicioHogar",
      "materialesIncluidos",
      "anosExperienciaHogar"
    ],
    "faq": [
      "garantiaServicioHogar"
    ]
  }
};

  var FIELD_LABELS = {
  "modalidadServicioHogar": "Modalidad de servicio",
  "serviciosHogar": "Servicios que ofreces",
  "especialidadesHogar": "Especialidades",
  "tiposTrabajoHogar": "Tipos de trabajo",
  "tiposInmueble": "Tipos de inmueble",
  "tiempoRespuestaHogar": "Tiempo de respuesta",
  "garantiaServicioHogar": "Garantía del servicio",
  "anosExperienciaHogar": "Años de experiencia",
  "materialesIncluidos": "Materiales incluidos",
  "diferenciadorHogar": "Tu sello en el oficio",
  "coberturaGeografica": "Zona de cobertura",
  "colaboracionesComerciales": "¿Colaboras con otros oficios o constructoras?",
  "tiposColaboracionComercial": "Tipo de colaboraciones"
};

  var FIELD_TYPES = {
  "modalidadServicioHogar": "enum",
  "serviciosHogar": "checklist",
  "especialidadesHogar": "checklist",
  "tiposTrabajoHogar": "checklist",
  "tiposInmueble": "checklist",
  "tiempoRespuestaHogar": "enum",
  "garantiaServicioHogar": "text",
  "anosExperienciaHogar": "enum",
  "materialesIncluidos": "enum",
  "diferenciadorHogar": "text",
  "coberturaGeografica": "text",
  "colaboracionesComerciales": "enum",
  "tiposColaboracionComercial": "checklist"
};

  var CANON_BLOCK_TITLES = {
  "plomeros": "Plomeros",
  "electricistas": "Electricistas",
  "pintores": "Pintores",
  "albaniles": "Albañiles",
  "carpinteros": "Carpinteros",
  "herreros": "Herreros",
  "jardineria": "Jardinería",
  "fumigacion": "Fumigación",
  "limpieza-del-hogar": "Limpieza del hogar",
  "mantenimiento-general": "Mantenimiento general",
  "tecnicos-en-clima-hvac": "Técnicos en clima / HVAC",
  "impermeabilizadores": "Impermeabilizadores",
  "instaladores-de-paneles-solares": "Instaladores de paneles solares",
  "tecnicos-en-camaras-de-seguridad": "Técnicos en cámaras de seguridad",
  "instaladores-de-pisos": "Instaladores de pisos",
  "cerrajeros": "Cerrajeros",
  "domotica-casa-inteligente": "Domótica / casa inteligente"
};

  var PACK_TITLES = {
  "A": "Obra húmeda y albañilería",
  "B": "Electricidad y tecnología hogar",
  "C": "Carpintería, herrería e instalaciones",
  "D": "Acabados, jardín y mantenimiento"
};

  var SUB_TO_PACK = {
  "plomeros": "A",
  "albaniles": "A",
  "impermeabilizadores": "A",
  "electricistas": "B",
  "tecnicos-en-clima-hvac": "B",
  "instaladores-de-paneles-solares": "B",
  "tecnicos-en-camaras-de-seguridad": "B",
  "domotica-casa-inteligente": "B",
  "carpinteros": "C",
  "herreros": "C",
  "instaladores-de-pisos": "C",
  "cerrajeros": "C",
  "pintores": "D",
  "jardineria": "D",
  "fumigacion": "D",
  "limpieza-del-hogar": "D",
  "mantenimiento-general": "D"
};

  var ENUM_LABELS = {
  "modalidadServicioHogar": {
    "domicilio": "Domicilio",
    "taller": "Taller",
    "ambos": "Ambos",
    "emergencia_24h": "Emergencia 24 h"
  },
  "tiempoRespuestaHogar": {
    "emergencia_2h": "Emergencia 2h",
    "mismo_dia": "Mismo Dia",
    "24_48h": "24 48h",
    "por_cita": "Por Cita"
  },
  "anosExperienciaHogar": {
    "1_3": "1 3",
    "4_7": "4 7",
    "8_15": "8 15",
    "16_mas": "16 Mas"
  },
  "materialesIncluidos": {
    "solo_mano_obra": "Solo Mano Obra",
    "con_materiales": "Con Materiales",
    "convenir": "Convenir",
    "mixto": "Mixto"
  },
  "colaboracionesComerciales": {
    "si_activo": "Si Activo",
    "ocasional": "Ocasional",
    "convenir": "Convenir",
    "no": "No"
  }
};

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
    return (u && u.hogarPerfil) ? u.hogarPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isHogarSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'hogar' && (u.hogarPerfil || u.deltaPack)) return true;
    if (u.hogarPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function resolveVistaPerfil(u) {
    if (!isHogarSectorPerfil(u)) return null;
    return 'pro';
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
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    if (p.serviciosHogar) {
      formatFieldValue('serviciosHogar', p.serviciosHogar).split(' · ').forEach(function (x) {
        if (x && items.indexOf(x) < 0) items.push(x);
      });
    }
    if (p.modalidadServicioHogar) {
      var mod = formatEnumValue('modalidadServicioHogar', p.modalidadServicioHogar);
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
    if (p.diferenciadorHogar) pushRow(rows, '🔧', 'Tu sello', p.diferenciadorHogar);
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.coberturaGeografica) pushRow(rows, '🗺️', 'Cobertura', p.coberturaGeografica);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var badges = [];
    if (p.modalidadServicioHogar === 'emergencia_24h' || p.tiempoRespuestaHogar === 'emergencia_2h') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Emergencias 24 h' });
    }
    if (txt(p.garantiaServicioHogar)) {
      badges.push({ cls: 'res-badge--garantia', text: 'Con garantía' });
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
        ['Hogar', 'Especialidad'],
        ['Consultar', 'Tarifa'],
        ['Verificado', 'En plataforma'],
        ['Cita', 'Sujeta a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(pack) {
    if (pack === 'A') {
      return ['Obra húmeda', 'Garantía visible', 'Cobertura clara', 'Tiempos de respuesta'];
    }
    if (pack === 'B') {
      return ['Instalaciones técnicas', 'Modalidad declarada', 'Especialidades visibles', 'Perfil verificable'];
    }
    if (pack === 'C') {
      return ['Trabajos a medida', 'Materiales declarados', 'Cobertura geográfica', 'Perfil verificable'];
    }
    return ['Acabados y mantenimiento', 'Servicios del hogar', 'Cobertura clara', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Incluyen materiales?', '¿Cuál es la tarifa?', '¿Atienden urgencias?', '¿Cuál es la cobertura?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel() {
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorHogar) return p.diferenciadorHogar;
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios para el hogar en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isHogarSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__hogarCanon = canonId;
    u.__hogarPack = pack;
    u.sectorId = u.sectorId || 'hogar';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios para el hogar';
    u.especialidad = u.especialidad || (p.especialidadesHogar && p.especialidadesHogar[0]) || (p.serviciosHogar && p.serviciosHogar[0]) || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioDetalle || '';
    u.nombre = u.alias || p.alias || u.nombre || '';
    u.alias = p.alias || u.alias || u.nombre;
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadServicioHogar ? formatEnumValue('modalidadServicioHogar', p.modalidadServicioHogar) : 'Consultar modalidad');
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || locParts.join(', ') || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación / registro']];
    }
    u.__hogarDatos = buildDatosRows(canonId, p, u);
    u.__hogarBadges = buildBadges(u, canonId);
    u.__hogarPriceLabel = resolvePriceLabel();
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Materiales no declarados', 'Servicios fuera del alcance publicado', 'Urgencias no cubiertas salvo indicación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || formatEnumValue('tiempoRespuestaHogar', p.tiempoRespuestaHogar) || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || (p.modalidadServicioHogar === 'emergencia_24h' || p.tiempoRespuestaHogar === 'emergencia_2h' ? 'Emergencias 24 h' : 'Consultar disponibilidad');
    if (txt(p.garantiaServicioHogar)) u.garantia = p.garantiaServicioHogar;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__hogarCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.modalidadServicioHogar) {
      chips.push(formatEnumValue('modalidadServicioHogar', p.modalidadServicioHogar).slice(0, 28));
    }
    if (p.tiempoRespuestaHogar === 'emergencia_2h' || p.modalidadServicioHogar === 'emergencia_24h') {
      chips.push('Emergencias 24 h');
    }
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubHogarSectorRender = {
    PACK_TITLES: PACK_TITLES,
    isHogarSectorPerfil: isHogarSectorPerfil,
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
