/**
 * Genera public/js/carihub-eventos-sector-render.js desde scripts/eventos-packs-v1.mjs
 * node scripts/build-carihub-eventos-sector-render.mjs
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
  EVENTOS_FIELD_REGISTRY,
  PACK_LABELS,
} from './eventos-packs-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'public/js/carihub-eventos-sector-render.js');

function humanizeOpt(v) {
  return String(v)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/Dj/g, 'DJ')
    .replace(/Mc/g, 'MC')
    .replace(/Xv/g, 'XV')
    .replace(/Sct/g, 'SCT')
    .replace(/Km/g, 'km');
}

const PREVIEW_FICHA = Object.fromEntries(
  Object.entries(SUB_DELTAS).map(([k, v]) => [k, v.previewFicha || {}])
);

const FIELD_LABELS = Object.fromEntries(
  Object.entries(EVENTOS_FIELD_REGISTRY).map(([k, v]) => [k, v.label || k])
);

const FIELD_TYPES = Object.fromEntries(
  Object.entries(EVENTOS_FIELD_REGISTRY).map(([k, v]) => [k, v.tipo || 'text'])
);

const CANON_BLOCK_TITLES = Object.fromEntries(
  CANON_SUBCATEGORIAS.map((c) => [c.subcategoriaId, c.blockTitle])
);

const NEGOCIO_CANON = CANON_SUBCATEGORIAS.filter((c) => c.formularioId === 'negocio_empresa').map(
  (c) => c.subcategoriaId
);

const PACK_TITLES = PACK_LABELS;

const body = `/**
 * Render Preview + Ficha — sector Eventos (MP-EVENTOS-DELTAS-V1 Fase 3).
 * Fuente: scripts/eventos-packs-v1.mjs — regenerar con build-carihub-eventos-sector-render.mjs
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

  var ENUM_LABELS = {
    cateringPolitica: {
      propio_exclusivo: 'Catering propio exclusivo',
      propio_opcional: 'Catering propio opcional',
      externo_permitido: 'Catering externo permitido',
      externo_exclusivo: 'Solo catering externo',
    },
    tipoAgrupacion: {
      fara_fara: 'Fara Fara',
      mariachi: 'Mariachi',
      banda: 'Banda',
      trio: 'Trío',
      solista: 'Solista',
      orquesta: 'Orquesta',
      grupo_regional: 'Grupo regional',
      grupo_tropical: 'Grupo tropical',
      otro: 'Otro formato',
    },
    publicoObjetivo: { infantil: 'Infantil', familiar: 'Familiar', adultos: 'Adultos' },
    rolPrincipal: {
      animador: 'Animador',
      mc: 'MC / maestro de ceremonias',
      presentador: 'Presentador',
      edecan: 'Edecan',
      modelo: 'Modelo',
      mixto: 'Animador + MC',
    },
    tamanoEventoAtendido: { intimo: 'Íntimo', mediano: 'Mediano', masivo: 'Masivo' },
    unidadCotizacion: {
      evento: 'Por evento',
      hora: 'Por hora',
      dia: 'Por día',
      persona: 'Por persona',
      km: 'Por km',
      proyecto: 'Por proyecto',
    },
    costoTraslado: { incluido: 'Traslado incluido', por_km: 'Por km', cotizar_aparte: 'Cotizar aparte' },
    ambientePirotecnia: { exterior: 'Exterior', interior_condicionado: 'Interior condicionado', ambos: 'Interior/exterior' },
    incluyeMontajeDesmontaje: {
      ambos_incluidos: 'Montaje y desmontaje incluidos',
      solo_montaje: 'Solo montaje',
      cotizar_aparte: 'Cotizar aparte',
    },
    tipoUnidadFood: {
      food_truck: 'Food truck',
      carrito: 'Carrito',
      puesto: 'Puesto',
      trailer: 'Trailer',
    },
  };

  function txt(v) {
    return String(v == null ? '' : v).trim();
  }

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/_/g, '-');
  }

  function resolveCanonSubId(u) {
    u = u || {};
    var raw = txt(u.canonSubcategoriaId) || txt(u.subcategoriaId) || txt(u.legacySubcategoriaId);
    var key = slugSubId(raw);
    if (CANON_BLOCK_TITLES[key]) return key;
    return LEGACY_TO_CANON[key] || '';
  }

  function perfilNested(u) {
    return (u && u.eventosPerfil) ? u.eventosPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isEventosSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'eventos' && (u.eventosPerfil || u.deltaPack)) return true;
    if (u.eventosPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isEventosNegocioPerfil(u) {
    var canon = resolveCanonSubId(u);
    return NEGOCIO_CANON.indexOf(canon) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isEventosSectorPerfil(u)) return null;
    return isEventosNegocioPerfil(u) ? 'empresa' : 'pro';
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

  function formatFieldValue(fieldId, val) {
    if (val === true) return 'Sí';
    if (val === false) return 'No';
    if (val == null) return '';
    var tipo = FIELD_TYPES[fieldId] || 'text';
    if (tipo === 'boolean') return val === true || val === 'true' || val === 1 ? 'Sí' : (val === false || val === 'false' ? 'No' : txt(val));
    if (tipo === 'checklist' || Array.isArray(val)) return joinList(val);
    if (tipo === 'enum' || tipo === 'select') return formatEnumValue(fieldId, val);
    if (tipo === 'number') return txt(val);
    return txt(val);
  }

  function fieldLabel(fieldId) {
    return FIELD_LABELS[fieldId] || humanize(fieldId);
  }

  function previewFields(canonId) {
    return PREVIEW_FICHA[canonId] || {};
  }

  function collectFieldIds(canonId, kind) {
    var pf = previewFields(canonId);
    var ids = (pf[kind] || []).slice();
    return ids;
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
    if (p.tipoAgrupacion === 'fara_fara' && items.indexOf('Fara Fara') < 0) items.unshift('Fara Fara');
    if (p.unidadCotizacion && p.cotizacionDesde) {
      items.push(formatEnumValue('unidadCotizacion', p.unidadCotizacion) + ' · ' + p.cotizacionDesde);
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
    if (p.descripcionFormatoFaraFara) pushRow(rows, '🎺', 'Formato Fara Fara', p.descripcionFormatoFaraFara);
    if (p.licenciaDron === true) pushRow(rows, '🚁', 'Licencia dron', 'Cuenta con licencia/registro');
    if (p.viajaFueraCiudad === true && p.costoTraslado) {
      pushRow(rows, '🚐', 'Traslado', formatEnumValue('costoTraslado', p.costoTraslado));
    }
    if (p.unidadCotizacion || p.cotizacionDesde) {
      pushRow(rows, '💲', 'Cotización', [formatEnumValue('unidadCotizacion', p.unidadCotizacion), p.cotizacionDesde].filter(Boolean).join(' · '));
    }
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.radioServicioKm) pushRow(rows, '🗺️', 'Radio de servicio', p.radioServicioKm + ' km');
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var badges = [];
    if (u.sensible === true || p.sensible === true || (canonId === 'shows-para-eventos' && p.contenidoSensible === true)) {
      badges.push({ cls: 'res-badge--sensible', text: 'Contenido sensible' });
    }
    if (u.regulada === true || p.regulada === true || canonId === 'pirotecnia-efectos-especiales' || canonId === 'seguridad-eventos') {
      badges.push({ cls: 'res-badge--regulada', text: 'Servicio regulado' });
    }
    if (u.requiresAdminReview === true || p.requiresAdminReview === true || u.regulada === true) {
      badges.push({ cls: 'res-badge--review', text: 'Revisión administrativa' });
    }
    if (p.tipoAgrupacion === 'fara_fara') badges.push({ cls: 'res-badge--fara-fara', text: 'Fara Fara' });
    return badges;
  }

  function buildReguladaNotice(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    if (canonId === 'pirotecnia-efectos-especiales') {
      return 'Pirotecnia regulada: operación sujeta a permisos, distancias de seguridad y avisos legales. Información declarativa sujeta a verificación administrativa.';
    }
    if (canonId === 'seguridad-eventos') {
      return 'Seguridad privada regulada: licencia y responsabilidad declarativas. CariHub puede solicitar documentación adicional antes de publicar.';
    }
    if (canonId === 'shows-para-eventos' && (p.contenidoSensible === true || (Array.isArray(p.tipoShow) && p.tipoShow.indexOf('strippers') >= 0))) {
      return 'Show para adultos con contenido explícito o stripper: sujeto a revisión administrativa. Evento adulto no implica desnudez automáticamente.';
    }
    if (p.disclaimerReguladoEventos === true && (u.regulada || canonId === 'pirotecnia-efectos-especiales' || canonId === 'seguridad-eventos')) {
      return 'El proveedor declaró aceptar avisos legales y limitaciones del servicio regulado.';
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
        ['Eventos', 'Especialidad'],
        ['Cotizar', 'Presupuesto'],
        ['Verificado', 'En plataforma'],
        ['Reserva', 'Sujeta a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(canonId) {
    if (canonId === 'pirotecnia-efectos-especiales' || canonId === 'seguridad-eventos') {
      return ['Permisos declarativos', 'Revisión administrativa', 'Operación regulada', 'Información verificable'];
    }
    if (canonId === 'shows-para-eventos') {
      return ['Show para tu evento', 'Detalle de público y duración', 'Requisitos técnicos claros', 'Cotización transparente'];
    }
    return ['Servicio para eventos', 'Datos útiles del oficio', 'Cotización declarada', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Qué incluye la cotización?', '¿Atienden mi tipo de evento?', '¿Cuál es la cobertura geográfica?', '¿Qué necesito en el venue?'];
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.descripcionFormatoFaraFara) return p.descripcionFormatoFaraFara;
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios profesionales para eventos.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isEventosSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__eventosCanon = canonId;
    u.__eventosPack = pack;
    u.sectorId = u.sectorId || 'eventos';
    u.titulo = u.titulo || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios para eventos';
    u.especialidad = u.especialidad || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = u.precio || p.cotizacionDesde || u.cotizacionDesde || u.tarifaDesde || '';
    u.cotizacionDesde = u.cotizacionDesde || p.cotizacionDesde || u.precio || '';
    u.unidadCotizacion = u.unidadCotizacion || p.unidadCotizacion || '';
    u.nombre = u.nombreComercial || p.nombreComercial || p.alias || u.alias || u.nombre || '';
    u.alias = p.alias || u.alias || u.nombre;
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (isEventosNegocioPerfil(u) ? 'Eventos / cotización' : 'Eventos / contratación directa');
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || locParts.join(', ') || txt(p.jurisdiccionPirotecnia) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    u.__eventosDatos = buildDatosRows(canonId, p, u);
    u.__eventosBadges = buildBadges(u, canonId);
    u.__eventosReguladaNotice = buildReguladaNotice(u, canonId);
    u.__eventosPriceLabel = p.unidadCotizacion ? formatEnumValue('unidadCotizacion', p.unidadCotizacion) : 'Cotización desde';
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Datos personales de menores', 'Promesas no declaradas en el perfil', 'Servicios fuera del alcance publicado'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(canonId);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || 'Agenda sujeta a confirmación';
    if (p.sensible) u.sensible = true;
    if (p.regulada) u.regulada = true;
    if (p.requiresAdminReview) u.requiresAdminReview = true;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__eventosCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.tipoAgrupacion === 'fara_fara') chips.unshift('Fara Fara');
    if (p.unidadCotizacion) chips.push(formatEnumValue('unidadCotizacion', p.unidadCotizacion));
    if (u.__eventosReguladaNotice && (u.regulada || u.requiresAdminReview)) chips.push('Regulado');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubEventosSectorRender = {
    PACK_TITLES: PACK_TITLES,
    isEventosSectorPerfil: isEventosSectorPerfil,
    isEventosNegocioPerfil: isEventosNegocioPerfil,
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
