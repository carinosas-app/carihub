/**
 * Genera public/js/carihub-transporte-sector-render.js
 * node scripts/build-carihub-transporte-sector-render.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SUB_TO_PACK,
  PACK_LABELS,
  TRANSPORTE_FIELD_REGISTRY,
  PACK_NEGOCIO_SUBS,
} from './transporte-packs-v1.mjs';
import { buildTransporteSubDeltas } from './transporte-sub-deltas-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'public/js/carihub-transporte-sector-render.js');
const mapa = JSON.parse(fs.readFileSync(path.join(root, 'scripts/mapa-registro-categorias.json'), 'utf8'));
const catalogRows = mapa.matrix.filter((r) => r.sectorId === 'transporte');
const { SUB_DELTAS } = buildTransporteSubDeltas(catalogRows);

function humanizeOpt(v) {
  return String(v)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/24h/gi, '24 h')
    .replace(/A C/g, 'A/C')
    .replace(/30min/gi, '30 min')
    .replace(/inmediato/gi, 'Inmediato');
}

function buildPreviewFicha(delta) {
  const fields = [...new Set([...(delta.deltaFields || []), ...(delta.extraFields || []).slice(0, 8)])];
  return {
    chips: fields.slice(0, 3),
    stats: ['tarifaDesde', 'modalidadServicioTransporte', 'tiempoRespuestaTransporte', 'flotaAproximada'].filter((f) =>
      fields.includes(f) || ['tarifaDesde', 'modalidadServicioTransporte'].includes(f)
    ).slice(0, 3),
    rows: fields.slice(0, 14),
    faq: ['permisosLicencias', 'coberturaGeografica', 'coberturaRutas', 'tiempoRespuestaTransporte', 'colaboracionesComerciales', 'coberturaInternacional']
      .filter((f) => fields.includes(f))
      .slice(0, 3),
  };
}

const PREVIEW_FICHA = Object.fromEntries(
  Object.entries(SUB_DELTAS).map(([k, v]) => [k, buildPreviewFicha(v)])
);

const FIELD_LABELS = Object.fromEntries(
  Object.entries(TRANSPORTE_FIELD_REGISTRY).map(([k, v]) => [k, v.label || k])
);

const FIELD_TYPES = Object.fromEntries(
  Object.entries(TRANSPORTE_FIELD_REGISTRY).map(([k, v]) => [k, v.tipo || 'text'])
);

const CANON_BLOCK_TITLES = Object.fromEntries(
  Object.entries(SUB_DELTAS).map(([k, v]) => [k, v.blockTitle || v.nombre || k])
);

const NEGOCIO_CANON = [...PACK_NEGOCIO_SUBS];

const ENUM_LABELS = {};
Object.entries(TRANSPORTE_FIELD_REGISTRY).forEach(([fieldId, meta]) => {
  if (!meta || !Array.isArray(meta.opciones)) return;
  if (meta.tipo !== 'enum' && meta.tipo !== 'select') return;
  ENUM_LABELS[fieldId] = Object.fromEntries(meta.opciones.map((opt) => [opt, humanizeOpt(opt)]));
});

const PACK_TITLES = PACK_LABELS;

const body = `/**
 * Render Preview + Ficha — sector Transporte packs A–F (MP-TRANSPORTE-DELTAS-V1 Fase 3).
 * Fuente: scripts/transporte-packs-v1.mjs + transporte-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-transporte-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = ${JSON.stringify(PREVIEW_FICHA, null, 2)};

  var FIELD_LABELS = ${JSON.stringify(FIELD_LABELS, null, 2)};

  var FIELD_TYPES = ${JSON.stringify(FIELD_TYPES, null, 2)};

  var CANON_BLOCK_TITLES = ${JSON.stringify(CANON_BLOCK_TITLES, null, 2)};

  var NEGOCIO_CANON = ${JSON.stringify(NEGOCIO_CANON, null, 2)};

  var PACK_TITLES = ${JSON.stringify(PACK_TITLES, null, 2)};

  var SUB_TO_PACK = ${JSON.stringify(SUB_TO_PACK, null, 2)};

  var ENUM_LABELS = ${JSON.stringify(ENUM_LABELS, null, 2)};

  var CARD_PACK_CLASS_PREFIX = 'res-card--trans-pack-';

  var CARD_SECTOR_CLASS = 'res-card--transporte-sector';

  function txt(v) {
    return String(v == null ? '' : v).trim();
  }

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/_/g, '-');
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
    return (u && u.transportePerfil) ? u.transportePerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isTransporteSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'transporte' && (u.transportePerfil || u.deltaPack)) return true;
    if (u.transportePerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isTransporteNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isTransporteSectorPerfil(u)) return null;
    return isTransporteNegocioPerfil(u) ? 'empresa' : 'pro';
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
    return String(v).replace(/_/g, ' ').replace(/\\b\\w/g, function (c) { return c.toUpperCase(); });
  }

  function formatMoney(val) {
    var n = txt(val).replace(/[^\\d.,]/g, '');
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
    var pack = packFrom({ transportePerfil: p });
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    var listFields = {
      A: ['serviciosTransportePersonas', 'tipoVehiculoPasajeros'],
      B: ['serviciosMensajeria', 'tiposEnvio'],
      C: ['serviciosFleteMudanza', 'tiposMercancia'],
      D: ['serviciosLogistica', 'tiposCarga'],
      E: ['serviciosEmpresaTransporte', 'especialidadesEmpresaTransporte'],
      F: ['serviciosEspecialidadTransporte', 'tiposVehiculoRenta']
    };
    (listFields[pack] || []).forEach(function (fid) {
      formatFieldValue(fid, p[fid]).split(' · ').forEach(function (x) {
        if (x && items.indexOf(x) < 0) items.push(x);
      });
    });
    if (p.modalidadServicioTransporte) {
      var mod = formatEnumValue('modalidadServicioTransporte', p.modalidadServicioTransporte);
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
    if (p.diferenciadorTransporte) pushRow(rows, '🚚', 'Tu sello', p.diferenciadorTransporte);
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.direccion) pushRow(rows, '🏢', 'Dirección', p.direccion);
    if (p.coberturaGeografica) pushRow(rows, '🗺️', 'Cobertura', p.coberturaGeografica);
    if (p.coberturaRutas) pushRow(rows, '🛣️', 'Rutas', p.coberturaRutas);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var badges = [];
    if (p.tiempoRespuestaTransporte === 'inmediato_30min') {
      badges.push({ cls: 'res-badge--urgencias', text: '30 min respuesta' });
    } else if (p.tiempoRespuestaTransporte === '1h') {
      badges.push({ cls: 'res-badge--urgencias', text: '1 h respuesta' });
    } else if (p.tiempoRespuestaTransporte === 'mismo_dia') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Mismo día' });
    }
    if (p.colaboracionesComerciales && txt(p.colaboracionesComerciales) && p.colaboracionesComerciales !== 'no') {
      badges.push({ cls: 'res-badge--colab', text: 'Colabora con otros' });
    }
    if (txt(p.permisosLicencias)) {
      badges.push({ cls: 'res-badge--cert', text: 'Permisos declarados' });
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
        ['Transporte', 'Especialidad'],
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
      return ['Transporte de personas', 'Vehículos declarados', 'Modalidad visible', 'Perfil verificable'];
    }
    if (pack === 'B') {
      return ['Mensajería y envíos', 'Tipos de envío', 'Modalidad declarada', 'Perfil verificable'];
    }
    if (pack === 'C') {
      return ['Fletes y mudanzas', 'Capacidad declarada', 'Cobertura clara', 'Perfil verificable'];
    }
    if (pack === 'D') {
      return ['Carga y logística', 'Rutas declaradas', 'Modalidad visible', 'Perfil verificable'];
    }
    if (pack === 'E') {
      return ['Empresa de transporte', 'Flota declarada', 'Cobertura visible', 'Perfil verificable'];
    }
    return ['Especialidades', 'Cobertura internacional', 'Modalidad visible', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Incluyen garantía?', '¿Cuál es la tarifa?', '¿Atienden urgencias?', '¿Cuál es la cobertura?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel(u) {
    if (isTransporteNegocioPerfil(u)) return 'Servicios desde';
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorTransporte) return p.diferenciadorTransporte;
    if (p.serviciosTransportePersonas && p.serviciosTransportePersonas[0]) return p.serviciosTransportePersonas[0];
    if (p.serviciosEmpresaTransporte && p.serviciosEmpresaTransporte[0]) return p.serviciosEmpresaTransporte[0];
    if (p.serviciosMensajeria && p.serviciosMensajeria[0]) return p.serviciosMensajeria[0];
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios de transporte en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isTransporteSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__transporteCanon = canonId;
    u.__transportePack = pack;
    u.sectorId = u.sectorId || 'transporte';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios de transporte';
    u.especialidad = u.especialidad || (p.serviciosTransportePersonas && p.serviciosTransportePersonas[0]) || (p.serviciosMensajeria && p.serviciosMensajeria[0]) || (p.serviciosFleteMudanza && p.serviciosFleteMudanza[0]) || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioDetalle || '';
    if (isTransporteNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadServicioTransporte ? formatEnumValue('modalidadServicioTransporte', p.modalidadServicioTransporte) : 'Consultar modalidad');
    u.modalidadServicioTransporte = u.modalidadServicioTransporte || p.modalidadServicioTransporte || '';
    u.diferenciadorTransporte = u.diferenciadorTransporte || p.diferenciadorTransporte || '';
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || txt(p.coberturaRutas) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación / registro']];
    }
    u.__transporteDatos = buildDatosRows(canonId, p, u);
    u.__transporteBadges = buildBadges(u, canonId);
    u.__transportePriceLabel = resolvePriceLabel(u);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Servicios fuera del alcance publicado', 'Carga no declarada', 'Rutas no cubiertas salvo indicación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || formatEnumValue('tiempoRespuestaTransporte', p.tiempoRespuestaTransporte) || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || (p.tiempoRespuestaTransporte === 'inmediato_30min' || p.tiempoRespuestaTransporte === '1h' ? formatEnumValue('tiempoRespuestaTransporte', p.tiempoRespuestaTransporte) : 'Consultar disponibilidad');
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__transporteCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.modalidadServicioTransporte) {
      chips.push(formatEnumValue('modalidadServicioTransporte', p.modalidadServicioTransporte).slice(0, 28));
    }
    if (p.tiempoRespuestaTransporte === 'inmediato_30min') chips.push('30 min respuesta');
    else if (p.tiempoRespuestaTransporte === '1h') chips.push('1 h respuesta');
    else if (p.tiempoRespuestaTransporte === 'mismo_dia') chips.push('Mismo día');
    if (txt(p.permisosLicencias)) chips.push('Permisos declarados');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubTransporteSectorRender = {
    PACK_TITLES: PACK_TITLES,
    CARD_PACK_CLASS_PREFIX: CARD_PACK_CLASS_PREFIX,
    CARD_SECTOR_CLASS: CARD_SECTOR_CLASS,
    isTransporteSectorPerfil: isTransporteSectorPerfil,
    isTransporteNegocioPerfil: isTransporteNegocioPerfil,
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
`;

fs.writeFileSync(outPath, body, 'utf8');
console.log('Wrote', outPath, '(' + body.length + ' bytes)');
