/**
 * Genera public/js/carihub-gastronomia-sector-render.js desde scripts/gastronomia-packs-v1.mjs
 * node scripts/build-carihub-gastronomia-sector-render.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  LEGACY_TO_CANON,
  SECTOR_UI_SLUG_TO_CANON,
  CANON_SUBCATEGORIAS,
  SUB_TO_PACK,
  SUB_DELTAS,
  GASTRONOMIA_FIELD_REGISTRY,
  PACK_LABELS,
} from './gastronomia-packs-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'public/js/carihub-gastronomia-sector-render.js');

function humanizeOpt(v) {
  return String(v)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/Mx/g, 'MX')
    .replace(/B2b/g, 'B2B');
}

const PREVIEW_FICHA = Object.fromEntries(
  Object.entries(SUB_DELTAS).map(([k, v]) => [k, v.previewFicha || {}])
);

const FIELD_LABELS = Object.fromEntries(
  Object.entries(GASTRONOMIA_FIELD_REGISTRY).map(([k, v]) => [k, v.label || k])
);

const FIELD_TYPES = Object.fromEntries(
  Object.entries(GASTRONOMIA_FIELD_REGISTRY).map(([k, v]) => [k, v.tipo || 'text'])
);

const CANON_BLOCK_TITLES = Object.fromEntries(
  CANON_SUBCATEGORIAS.map((c) => [c.subcategoriaId, c.blockTitle])
);

const NEGOCIO_CANON = CANON_SUBCATEGORIAS.filter((c) => c.formularioId === 'negocio_empresa').map(
  (c) => c.subcategoriaId
);

const ENUM_LABELS = {};
Object.entries(GASTRONOMIA_FIELD_REGISTRY).forEach(([fieldId, meta]) => {
  if (!meta || !Array.isArray(meta.opciones)) return;
  if (meta.tipo !== 'enum' && meta.tipo !== 'select') return;
  ENUM_LABELS[fieldId] = Object.fromEntries(meta.opciones.map((opt) => [opt, humanizeOpt(opt)]));
});

const PACK_TITLES = PACK_LABELS;

const body = `/**
 * Render Preview + Ficha — sector Gastronomía (MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 Fase 3).
 * Fuente: scripts/gastronomia-packs-v1.mjs — regenerar con build-carihub-gastronomia-sector-render.mjs
 */
(function (global) {
  'use strict';

  var LEGACY_TO_CANON = ${JSON.stringify({ ...LEGACY_TO_CANON, ...SECTOR_UI_SLUG_TO_CANON }, null, 2)};

  var PREVIEW_FICHA = ${JSON.stringify(PREVIEW_FICHA, null, 2)};

  var FIELD_LABELS = ${JSON.stringify(FIELD_LABELS, null, 2)};

  var FIELD_TYPES = ${JSON.stringify(FIELD_TYPES, null, 2)};

  var CANON_BLOCK_TITLES = ${JSON.stringify(CANON_BLOCK_TITLES, null, 2)};

  var NEGOCIO_CANON = ${JSON.stringify(NEGOCIO_CANON, null, 2)};

  var PACK_TITLES = ${JSON.stringify(PACK_TITLES, null, 2)};

  var SUB_TO_PACK = ${JSON.stringify(SUB_TO_PACK, null, 2)};

  var ENUM_LABELS = ${JSON.stringify(ENUM_LABELS, null, 2)};

  var SECTOR_IDS = ['restaurantes', 'gastronomia'];

  function txt(v) {
    return String(v == null ? '' : v).trim();
  }

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/_/g, '-');
  }

  function resolveCanonSubId(u) {
    u = u || {};
    var p = perfilNested(u);
    var raw = txt(u.canonSubcategoriaId) || txt(p.canonSubcategoriaId) || txt(u.subcategoriaId) || txt(u.legacySubcategoriaId);
    var key = slugSubId(raw);
    if (CANON_BLOCK_TITLES[key]) return key;
    return LEGACY_TO_CANON[key] || '';
  }

  function perfilNested(u) {
    return (u && u.gastronomiaPerfil) ? u.gastronomiaPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isGastronomiaSectorId(sid) {
    return SECTOR_IDS.indexOf(String(sid || '').trim()) >= 0;
  }

  function isGastronomiaSectorPerfil(u) {
    if (!u) return false;
    if (isGastronomiaSectorId(u.sectorId) && (u.gastronomiaPerfil || u.deltaPack)) return true;
    if (u.gastronomiaPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isGastronomiaNegocioPerfil(u) {
    var canon = resolveCanonSubId(u);
    return NEGOCIO_CANON.indexOf(canon) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isGastronomiaSectorPerfil(u)) return null;
    return isGastronomiaNegocioPerfil(u) ? 'empresa' : 'pro';
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

  function formatMoneyMx(val) {
    var n = txt(val).replace(/[^\\d.,]/g, '');
    if (!n) return '';
    return n.indexOf('$') === 0 ? n : '$' + n;
  }

  function formatFieldValue(fieldId, val) {
    if (val === true) return 'Sí';
    if (val === false) return 'No';
    if (val == null) return '';
    var tipo = FIELD_TYPES[fieldId] || 'text';
    if (tipo === 'boolean') return val === true || val === 'true' || val === 1 ? 'Sí' : (val === false || val === 'false' ? 'No' : txt(val));
    if (tipo === 'checklist' || Array.isArray(val)) return joinList(val);
    if (tipo === 'enum' || tipo === 'select') return formatEnumValue(fieldId, val);
    if (fieldId === 'precioPromedioMx' || fieldId === 'cotizacionDesde' || fieldId === 'precioDesdeMx') return formatMoneyMx(val);
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
    (pf.stats || []).slice(0, 2).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val && items.indexOf(val) < 0) items.push(fieldLabel(fid) + ': ' + val);
    });
    if (p.opcionesDieteticas && Array.isArray(p.opcionesDieteticas)) {
      p.opcionesDieteticas.slice(0, 2).forEach(function (d) {
        var t = formatEnumValue('opcionesDieteticas', d);
        if (t && items.indexOf(t) < 0) items.push(t);
      });
    }
    if (p.unidadCotizacion && p.cotizacionDesde) {
      items.push(formatEnumValue('unidadCotizacion', p.unidadCotizacion) + ' · ' + formatMoneyMx(p.cotizacionDesde));
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
    if (p.horarioAtencionComercial) pushRow(rows, '🕐', 'Horario', p.horarioAtencionComercial, 'horario');
    else if (p.horarioCocina) pushRow(rows, '🕐', 'Horario de cocina', p.horarioCocina, 'horario');
    else if (u.horario) pushRow(rows, '🕐', 'Horario', u.horario, 'horario');
    if (p.menuUrl) pushRow(rows, '📎', 'Menú en línea', 'Disponible');
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.radioEntregaKm) pushRow(rows, '🗺️', 'Radio de entrega', p.radioEntregaKm + ' km');
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var pack = packFrom(u);
    var badges = [];
    if (p.ventaAlcohol === true || pack === 'BAR_BEBIDAS') {
      badges.push({ cls: 'res-badge--alcohol', text: 'Venta de alcohol' });
    }
    if (p.permisoManipulacionAlimentos === true) {
      badges.push({ cls: 'res-badge--food-safe', text: 'Manipulación de alimentos' });
    }
    if (p.requiresAdminReview === true || u.requiresAdminReview === true) {
      badges.push({ cls: 'res-badge--review', text: 'Revisión administrativa' });
    }
    if (p.aceptaReservaciones === true) {
      badges.push({ cls: 'res-badge--reservas', text: 'Reservaciones' });
    }
    if (pack === 'DELIVERY' || pack === 'MOBILE') {
      badges.push({ cls: 'res-badge--movil', text: pack === 'MOBILE' ? 'Operación móvil' : 'Solo entrega' });
    }
    return badges;
  }

  function buildReguladaNotice(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var pack = packFrom(u);
    if (p.ventaAlcohol === true || pack === 'BAR_BEBIDAS') {
      return 'Venta de bebidas alcohólicas: información declarativa sujeta a permisos locales y verificación administrativa. Política de menores según lo declarado en el perfil.';
    }
    if (p.permisoManipulacionAlimentos === true) {
      return 'El establecimiento declaró contar con permiso de manipulación de alimentos vigente. CariHub puede solicitar documentación adicional.';
    }
    return '';
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
        ['Gastronomía', 'Especialidad'],
        ['Consultar', 'Precio'],
        ['Verificado', 'En plataforma'],
        ['Reserva', 'Sujeta a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(canonId, pack) {
    if (pack === 'BAR_BEBIDAS') {
      return ['Carta de bebidas declarada', 'Horarios publicados', 'Política de menores visible', 'Perfil verificable'];
    }
    if (pack === 'DELIVERY' || pack === 'MOBILE') {
      return ['Cobertura declarada', 'Tiempos orientativos', 'Menú o especialidad visible', 'Contacto directo'];
    }
    if (pack === 'PRO_SERVICE') {
      return ['Servicio a domicilio', 'Cotización transparente', 'Experiencia declarada', 'Agenda sujeta a confirmación'];
    }
    return ['Menú y especialidad visibles', 'Horario publicado', 'Precio orientativo', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Aceptan reservaciones?', '¿Cuál es el precio promedio?', '¿Tienen opciones dietéticas?', '¿Cuál es el horario?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.precioPromedioMx != null && p.precioPromedioMx !== '') return formatMoneyMx(p.precioPromedioMx);
    if (p.cotizacionDesde) return formatMoneyMx(p.cotizacionDesde);
    if (p.precioDesdeMx) return formatMoneyMx(p.precioDesdeMx);
    return '';
  }

  function resolvePriceLabel(p, pack) {
    p = p || {};
    if (p.precioPromedioMx != null && p.precioPromedioMx !== '') return 'Precio promedio';
    if (p.unidadCotizacion) return formatEnumValue('unidadCotizacion', p.unidadCotizacion);
    if (pack === 'PRO_SERVICE') return 'Cotización desde';
    return 'Desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.especialidadCasa) return p.especialidadCasa;
    if (p.diferenciadorProfesional) return p.diferenciadorProfesional;
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Gastronomía y bebidas en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isGastronomiaSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__gastronomiaCanon = canonId;
    u.__gastronomiaPack = pack;
    u.sectorId = u.sectorId || 'restaurantes';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Gastronomía';
    u.especialidad = u.especialidad || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.cotizacionDesde = u.cotizacionDesde || p.cotizacionDesde || '';
    u.unidadCotizacion = u.unidadCotizacion || p.unidadCotizacion || '';
    u.nombre = u.nombreComercial || p.nombreComercial || p.alias || u.alias || u.nombre || '';
    u.nombreComercial = u.nombreComercial || p.nombreComercial || (isGastronomiaNegocioPerfil(u) ? u.nombre : '');
    u.alias = p.alias || u.alias || u.nombre;
    u.horario = u.horario || p.horarioAtencionComercial || p.horarioCocina || '';
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (isGastronomiaNegocioPerfil(u) ? 'Comedor / local' : 'Servicio a domicilio');
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || locParts.join(', ') || txt(p.direccionOperacion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    u.__gastronomiaDatos = buildDatosRows(canonId, p, u);
    u.__gastronomiaBadges = buildBadges(u, canonId);
    u.__gastronomiaReguladaNotice = buildReguladaNotice(u, canonId);
    u.__gastronomiaPriceLabel = resolvePriceLabel(p, pack);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Propina no incluida salvo indicación', 'Promociones no declaradas en el perfil', 'Disponibilidad sujeta a confirmación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(canonId, pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || 'Horario sujeto a cambios';
    if (p.requiresAdminReview) u.requiresAdminReview = true;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__gastronomiaCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.tipoCocinaPrincipal && chips.length < 4) {
      var coc = formatFieldValue('tipoCocinaPrincipal', p.tipoCocinaPrincipal);
      if (coc) chips.push(coc.split(' · ')[0].slice(0, 28));
    }
    if (p.aceptaReservaciones === true) chips.push('Reservas');
    if (p.menuDelDia === true && chips.indexOf('Menú del día') < 0) chips.push('Menú del día');
    if (u.horario) chips.push(String(u.horario).slice(0, 28));
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubGastronomiaSectorRender = {
    PACK_TITLES: PACK_TITLES,
    isGastronomiaSectorPerfil: isGastronomiaSectorPerfil,
    isGastronomiaNegocioPerfil: isGastronomiaNegocioPerfil,
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
