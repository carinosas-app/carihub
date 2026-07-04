/**
 * Genera public/js/carihub-salud-sector-render.js
 * node scripts/build-carihub-salud-sector-render.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SUB_TO_PACK,
  PACK_LABELS,
  SALUD_FIELD_REGISTRY,
  PACK_A_PROFESIONISTA_SUBS,
  PACK_F_NEGOCIO_SUBS,
  PACK_G_NEGOCIO_SUBS,
} from './salud-packs-v1.mjs';
import { buildSaludSubDeltas } from './salud-sub-deltas-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'public/js/carihub-salud-sector-render.js');
const mapa = JSON.parse(fs.readFileSync(path.join(root, 'scripts/mapa-registro-categorias.json'), 'utf8'));
const catalogRows = mapa.matrix.filter((r) => r.sectorId === 'salud');
const { SUB_DELTAS } = buildSaludSubDeltas(catalogRows);

function humanizeOpt(v) {
  return String(v)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/24h/gi, '24 h');
}

function buildPreviewFicha(delta) {
  const fields = [...new Set([...(delta.deltaFields || []), ...(delta.extraFields || []).slice(0, 8)])];
  return {
    chips: fields.slice(0, 3),
    stats: ['precioConsulta', 'tarifaDesde', 'modalidadConsulta', 'modalidadAtencionProfesional'].filter((f) =>
      fields.includes(f) || ['precioConsulta', 'tarifaDesde'].includes(f)
    ).slice(0, 3),
    rows: fields.slice(0, 14),
    faq: ['urgencias24h', 'segurosAceptados', 'segurosAceptadosSalud', 'consultaEnLinea', 'coberturaAtencionSalud']
      .filter((f) => fields.includes(f))
      .slice(0, 3),
  };
}

const PREVIEW_FICHA = Object.fromEntries(
  Object.entries(SUB_DELTAS).map(([k, v]) => [k, buildPreviewFicha(v)])
);

const FIELD_LABELS = Object.fromEntries(
  Object.entries(SALUD_FIELD_REGISTRY).map(([k, v]) => [k, v.label || k])
);

const FIELD_TYPES = Object.fromEntries(
  Object.entries(SALUD_FIELD_REGISTRY).map(([k, v]) => [k, v.tipo || 'text'])
);

const CANON_BLOCK_TITLES = Object.fromEntries(
  Object.entries(SUB_DELTAS).map(([k, v]) => [k, v.blockTitle || v.nombre || k])
);

const NEGOCIO_CANON = [...PACK_F_NEGOCIO_SUBS, ...PACK_G_NEGOCIO_SUBS];
const CEDULA_CANON = [...PACK_A_PROFESIONISTA_SUBS];

const ENUM_LABELS = {};
Object.entries(SALUD_FIELD_REGISTRY).forEach(([fieldId, meta]) => {
  if (!meta || !Array.isArray(meta.opciones)) return;
  if (meta.tipo !== 'enum' && meta.tipo !== 'select') return;
  ENUM_LABELS[fieldId] = Object.fromEntries(meta.opciones.map((opt) => [opt, humanizeOpt(opt)]));
});

const PACK_TITLES = PACK_LABELS;

const body = `/**
 * Render Preview + Ficha — sector Salud packs A–H (MP-SALUD-DELTAS-V1 Fase 3).
 * Fuente: scripts/salud-packs-v1.mjs + salud-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-salud-sector-render.mjs
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
    return (u && u.saludPerfil) ? u.saludPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isSaludSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'salud' && (u.saludPerfil || u.deltaPack)) return true;
    if (u.saludPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isSaludNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function isSaludCedulaPerfil(u) {
    return CEDULA_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isSaludSectorPerfil(u)) return null;
    return isSaludNegocioPerfil(u) ? 'empresa' : 'pro';
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
    var pack = packFrom({ saludPerfil: p });
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    var listFields = {
      A: ['serviciosProfesionales', 'especialidad'],
      B: ['especialidadServicio', 'serviciosProfesionales'],
      C: ['serviciosCuidado'],
      D: ['estudiosOfrecidos'],
      E: ['categoriasFarmacia', 'surtidoFarmaceutico'],
      F: ['serviciosClinica', 'especialidadesClinica'],
      G: ['serviciosHospital', 'serviciosResidencia', 'serviciosFunerarios'],
      H: ['serviciosCorporativos']
    };
    (listFields[pack] || []).forEach(function (fid) {
      formatFieldValue(fid, p[fid]).split(' · ').forEach(function (x) {
        if (x && items.indexOf(x) < 0) items.push(x);
      });
    });
    if (p.modalidadConsulta) {
      var mod = formatEnumValue('modalidadConsulta', p.modalidadConsulta);
      if (mod && items.indexOf(mod) < 0) items.push(mod);
    }
    if (p.modalidadAtencionProfesional) {
      var mod2 = formatEnumValue('modalidadAtencionProfesional', p.modalidadAtencionProfesional);
      if (mod2 && items.indexOf(mod2) < 0) items.push(mod2);
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
    if (p.diferenciadorSalud) pushRow(rows, '🩺', 'Tu sello', p.diferenciadorSalud);
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.direccion) pushRow(rows, '🏥', 'Dirección', p.direccion);
    if (p.coberturaAtencionSalud) pushRow(rows, '🗺️', 'Cobertura', p.coberturaAtencionSalud);
    else if (p.coberturaDomicilioZona) pushRow(rows, '🗺️', 'Cobertura domicilio', p.coberturaDomicilioZona);
    else if (p.coberturaEmpresas) pushRow(rows, '🗺️', 'Cobertura empresas', p.coberturaEmpresas);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var badges = [];
    if (isSaludCedulaPerfil(u) && (u.cedulaVerificada === true || u.requiresCedula === true)) {
      badges.push({ cls: 'res-badge--cedula', text: 'Cédula verificada' });
    }
    if (p.urgencias24h === true) {
      badges.push({ cls: 'res-badge--urgencias', text: 'Urgencias 24 h' });
    }
    if (p.consultaEnLinea === true) {
      badges.push({ cls: 'res-badge--online', text: 'Consulta en línea' });
    }
    if (txt(p.segurosAceptados) && p.segurosAceptados !== 'solo_particular') {
      badges.push({ cls: 'res-badge--seguros', text: 'Acepta seguros' });
    }
    if (Array.isArray(p.segurosAceptadosSalud) && p.segurosAceptadosSalud.length) {
      badges.push({ cls: 'res-badge--seguros', text: 'Acepta seguros' });
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
        ['Salud', 'Especialidad'],
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
      return ['Consulta con cédula', 'Seguros declarados', 'Modalidad visible', 'Horario publicado'];
    }
    if (pack === 'B') {
      return ['Especialidad clara', 'Modalidad de consulta', 'Certificaciones visibles', 'Perfil verificable'];
    }
    if (pack === 'C') {
      return ['Cuidado a domicilio', 'Servicios declarados', 'Cobertura geográfica', 'Perfil verificable'];
    }
    if (pack === 'D') {
      return ['Estudios ofrecidos', 'Tiempos de entrega', 'Toma a domicilio', 'Ubicación clara'];
    }
    if (pack === 'E') {
      return ['Surtido farmacéutico', 'Venta con receta', 'Horario publicado', 'Ubicación clara'];
    }
    if (pack === 'F' || pack === 'G') {
      return ['Servicios del centro', 'Especialidades visibles', 'Urgencias declaradas', 'Perfil verificable'];
    }
    return ['Salud ocupacional', 'Cobertura empresas', 'Certificaciones', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Aceptan mi seguro?', '¿Cuál es la tarifa?', '¿Atienden urgencias?', '¿Cuál es la cobertura?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.precioConsulta) return formatMoney(p.precioConsulta);
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel(u) {
    if (isSaludCedulaPerfil(u)) return 'Consulta desde';
    if (isSaludNegocioPerfil(u)) return 'Servicios desde';
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorSalud) return p.diferenciadorSalud;
    if (p.especialidad) return p.especialidad;
    if (p.especialidadServicio) return p.especialidadServicio;
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios de salud en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isSaludSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__saludCanon = canonId;
    u.__saludPack = pack;
    u.sectorId = u.sectorId || 'salud';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios de salud';
    u.especialidad = u.especialidad || p.especialidad || p.especialidadServicio || p.especialidadesClinica || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioAtencion || p.horarioDetalle || '';
    if (isSaludCedulaPerfil(u)) {
      u.nombre = u.nombreProfesional || p.nombreProfesional || u.nombre || '';
      u.nombreProfesional = u.nombreProfesional || p.nombreProfesional || u.nombre;
      u.alias = u.nombre;
    } else if (isSaludNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadConsulta ? formatEnumValue('modalidadConsulta', p.modalidadConsulta)
      : (p.modalidadAtencionProfesional ? formatEnumValue('modalidadAtencionProfesional', p.modalidadAtencionProfesional) : 'Consultar modalidad'));
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaAtencionSalud) || txt(p.coberturaDomicilioZona) || txt(p.coberturaEmpresas) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación / registro']];
    }
    u.__saludDatos = buildDatosRows(canonId, p, u);
    u.__saludBadges = buildBadges(u, canonId);
    u.__saludPriceLabel = resolvePriceLabel(u);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Medicamentos no declarados', 'Procedimientos fuera del alcance publicado', 'Urgencias no cubiertas salvo indicación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.urgencias = u.urgencias || (p.urgencias24h === true ? 'Urgencias 24 h' : 'Consultar disponibilidad');
    if (isSaludCedulaPerfil(u)) u.cedulaVerificada = u.cedulaVerificada !== false;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__saludCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.modalidadConsulta) {
      chips.push(formatEnumValue('modalidadConsulta', p.modalidadConsulta).slice(0, 28));
    }
    if (p.consultaEnLinea === true) chips.push('Consulta en línea');
    if (p.urgencias24h === true) chips.push('Urgencias 24 h');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubSaludSectorRender = {
    PACK_TITLES: PACK_TITLES,
    isSaludSectorPerfil: isSaludSectorPerfil,
    isSaludNegocioPerfil: isSaludNegocioPerfil,
    isSaludCedulaPerfil: isSaludCedulaPerfil,
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
