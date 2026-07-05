/**
 * Genera public/js/carihub-profesionales-sector-render.js
 * node scripts/build-carihub-profesionales-sector-render.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SUB_TO_PACK,
  PACK_LABELS,
  PROFESIONALES_FIELD_REGISTRY,
  PACK_H_NEGOCIO_SUBS,
  PACK_A_CEDULA_SUBS,
} from './profesionales-packs-v1.mjs';
import { buildProfesionalesSubDeltas } from './profesionales-sub-deltas-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'public/js/carihub-profesionales-sector-render.js');
const mapa = JSON.parse(fs.readFileSync(path.join(root, 'scripts/mapa-registro-categorias.json'), 'utf8'));
const catalogRows = mapa.matrix.filter((r) => r.sectorId === 'profesionales');
const { SUB_DELTAS } = buildProfesionalesSubDeltas(catalogRows);

function humanizeOpt(v) {
  return String(v)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/Rh/g, 'RH')
    .replace(/Py Me/g, 'PyME');
}

function buildPreviewFicha(delta) {
  const fields = [...new Set([...(delta.deltaFields || []), ...(delta.extraFields || []).slice(0, 8)])];
  return {
    chips: fields.slice(0, 3),
    stats: ['precioConsulta', 'tarifaDesde', 'modalidadAtencionProfesional', 'anosExperienciaProfesional'].slice(0, 3),
    rows: fields.slice(0, 14),
    faq: ['colaboracionesComerciales', 'tiempoRespuestaConsulta', 'coberturaGeografica'].filter((f) => fields.includes(f)).slice(0, 3),
  };
}

const PREVIEW_FICHA = Object.fromEntries(
  Object.entries(SUB_DELTAS).map(([k, v]) => [k, buildPreviewFicha(v)])
);

const FIELD_LABELS = Object.fromEntries(
  Object.entries(PROFESIONALES_FIELD_REGISTRY).map(([k, v]) => [k, v.label || k])
);

const FIELD_TYPES = Object.fromEntries(
  Object.entries(PROFESIONALES_FIELD_REGISTRY).map(([k, v]) => [k, v.tipo || 'text'])
);

const CANON_BLOCK_TITLES = Object.fromEntries(
  Object.entries(SUB_DELTAS).map(([k, v]) => [k, v.blockTitle || v.nombre || k])
);

const NEGOCIO_CANON = [...PACK_H_NEGOCIO_SUBS];
const CEDULA_CANON = [...PACK_A_CEDULA_SUBS];

const ENUM_LABELS = {};
Object.entries(PROFESIONALES_FIELD_REGISTRY).forEach(([fieldId, meta]) => {
  if (!meta || !Array.isArray(meta.opciones)) return;
  if (meta.tipo !== 'enum' && meta.tipo !== 'select') return;
  ENUM_LABELS[fieldId] = Object.fromEntries(meta.opciones.map((opt) => [opt, humanizeOpt(opt)]));
});

const PACK_TITLES = PACK_LABELS;

const body = `/**
 * Render Preview + Ficha — sector Profesionales packs A–H (MP-PROFESIONALES-DELTAS-V1 Fase 3).
 * Fuente: scripts/profesionales-packs-v1.mjs + profesionales-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-profesionales-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = ${JSON.stringify(PREVIEW_FICHA, null, 2)};

  var FIELD_LABELS = ${JSON.stringify(FIELD_LABELS, null, 2)};

  var FIELD_TYPES = ${JSON.stringify(FIELD_TYPES, null, 2)};

  var CANON_BLOCK_TITLES = ${JSON.stringify(CANON_BLOCK_TITLES, null, 2)};

  var NEGOCIO_CANON = ${JSON.stringify(NEGOCIO_CANON, null, 2)};

  var CEDULA_CANON = ${JSON.stringify(CEDULA_CANON, null, 2)};

  var PACK_TITLES = ${JSON.stringify(PACK_TITLES, null, 2)};

  var SUB_TO_PACK = ${JSON.stringify(SUB_TO_PACK, null, 2)};

  var ENUM_LABELS = ${JSON.stringify(ENUM_LABELS, null, 2)};

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
    return (u && u.profesionalesPerfil) ? u.profesionalesPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isProfesionalesSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'profesionales' && (u.profesionalesPerfil || u.deltaPack)) return true;
    if (u.profesionalesPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isProfesionalesNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function isProfesionalesCedulaPerfil(u) {
    return CEDULA_CANON.indexOf(resolveCanonSubId(u)) >= 0 || packFrom(u) === 'A';
  }

  function resolveVistaPerfil(u) {
    if (!isProfesionalesSectorPerfil(u)) return null;
    return isProfesionalesNegocioPerfil(u) ? 'empresa' : 'pro';
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
    if (fieldId === 'precioConsulta' || fieldId === 'tarifaDesde') return formatMoney(val);
    if (tipo === 'number') return txt(val);
    if (fieldId === 'portfolioURL' && txt(val)) return 'Portafolio en línea';
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
    (pf.rows || []).slice(0, 4).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val && items.indexOf(val) < 0 && items.length < 8) items.push(fieldLabel(fid) + ': ' + val);
    });
    if (p.modalidadAtencionProfesional) {
      var mod = formatEnumValue('modalidadAtencionProfesional', p.modalidadAtencionProfesional);
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
    if (p.horarioAtencion) pushRow(rows, '🕐', 'Horario', p.horarioAtencion, 'horario');
    else if (p.horarioDetalle) pushRow(rows, '🕐', 'Horario', p.horarioDetalle, 'horario');
    else if (u.horario) pushRow(rows, '🕐', 'Horario', u.horario, 'horario');
    if (p.certificaciones) pushRow(rows, '🎖️', 'Certificaciones', p.certificaciones);
    if (p.portfolioURL) pushRow(rows, '🔗', 'Portafolio', 'Disponible en línea');
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.coberturaGeografica) pushRow(rows, '🗺️', 'Cobertura', p.coberturaGeografica);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var pack = packFrom(u);
    var badges = [];
    if (isProfesionalesCedulaPerfil(u) && (u.cedulaVerificada === true || p.requiresCedula === true || pack === 'A')) {
      badges.push({ cls: 'res-badge--cedula', text: 'Cédula verificada' });
    }
    if (u.verificado === true || u.verificada === true) {
      badges.push({ cls: 'res-badge--ver', text: 'Profesional verificado' });
    }
    if (p.colaboracionesComerciales && txt(p.colaboracionesComerciales) && p.colaboracionesComerciales !== 'no') {
      badges.push({ cls: 'res-badge--colab', text: 'Colabora con otros' });
    }
    if (p.requiresAdminReview === true || u.requiresAdminReview === true) {
      badges.push({ cls: 'res-badge--review', text: 'Revisión administrativa' });
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
        ['Profesional', 'Especialidad'],
        ['Consultar', 'Honorarios'],
        ['Verificado', 'En plataforma'],
        ['Cita', 'Sujeta a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(pack) {
    if (pack === 'H') {
      return ['Servicios empresariales', 'Equipo o firma declarada', 'Cotización transparente', 'Perfil verificable'];
    }
    if (pack === 'A') {
      return ['Profesionista con cédula', 'Especialidad declarada', 'Modalidad de atención clara', 'Honorarios publicados'];
    }
    return ['Servicios profesionales', 'Experiencia declarada', 'Modalidad de atención', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Cuál es el costo de la consulta?', '¿Atienden mi tipo de caso?', '¿Cuál es la modalidad de atención?', '¿Emiten factura?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.precioConsulta) return formatMoney(p.precioConsulta);
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel(pack) {
    if (pack === 'A') return 'Consulta desde';
    if (pack === 'H') return 'Servicios desde';
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorProfesional) return p.diferenciadorProfesional;
    if (p.especialidadProfesional) return p.especialidadProfesional;
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios profesionales en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isProfesionalesSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__profesionalesCanon = canonId;
    u.__profesionalesPack = pack;
    u.sectorId = u.sectorId || 'profesionales';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios profesionales';
    u.especialidad = u.especialidad || p.especialidadProfesional || p.especialidadTecnica || p.areasConsultoria || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioAtencion || p.horarioDetalle || '';
    u.modalidadAtencionProfesional = u.modalidadAtencionProfesional || p.modalidadAtencionProfesional || '';
    if (pack === 'A') {
      u.nombre = u.nombreProfesional || p.nombreProfesional || u.nombre || '';
      u.nombreProfesional = u.nombreProfesional || p.nombreProfesional || u.nombre;
    } else if (isProfesionalesNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadAtencionProfesional ? formatEnumValue('modalidadAtencionProfesional', p.modalidadAtencionProfesional) : 'Consultar modalidad');
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación profesional']];
    }
    u.__profesionalesDatos = buildDatosRows(canonId, p, u);
    u.__profesionalesBadges = buildBadges(u, canonId);
    u.__profesionalesPriceLabel = resolvePriceLabel(pack);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Asesoría fuera del alcance declarado', 'Honorarios no publicados en el perfil', 'Resultados garantizados no prometidos'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || p.tiempoRespuestaConsulta || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || 'Agenda sujeta a confirmación';
    if (isProfesionalesCedulaPerfil(u)) u.cedulaVerificada = u.cedulaVerificada !== false;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__profesionalesCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.modalidadAtencionProfesional) {
      chips.push(formatEnumValue('modalidadAtencionProfesional', p.modalidadAtencionProfesional).slice(0, 28));
    }
    if (u.cedulaVerificada === true && chips.indexOf('Cédula') < 0) chips.push('Cédula verificada');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubProfesionalesSectorRender = {
    PACK_TITLES: PACK_TITLES,
    isProfesionalesSectorPerfil: isProfesionalesSectorPerfil,
    isProfesionalesNegocioPerfil: isProfesionalesNegocioPerfil,
    isProfesionalesCedulaPerfil: isProfesionalesCedulaPerfil,
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
