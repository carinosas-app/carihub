/**
 * CariHub — SearchJourneySession
 * Sesión reutilizable de navegación/búsqueda (Home, otros sectores, futuro: favoritos, SEO, etc.)
 */
(function (global) {
  'use strict';

  var SECTOR_ACCENT = {
    adultos: '#c2185b',
    salud: '#0d47a1',
    profesionales: '#263238',
    'bienes-raices': '#4e342e',
    bienestar: '#33691e',
    tecnologia: '#283593',
    automotriz: '#1565c0',
    hogar: '#d84315',
    comercio: '#00695c',
    eventos: '#ef6c00',
    transporte: '#0277bd',
    industria: '#37474f',
    educacion: '#3949ab',
    restaurantes: '#e65100',
    mascotas: '#2e7d32'
  };

  var DEFAULT_VISIBLE_KINDS = ['sector', 'subcat'];
  var geoTransitionLock = false;

  var session = {
    active: false,
    origin: '',
    sectorId: '',
    sectorNombre: '',
    sectorEmoji: '',
    subcatId: '',
    subcatNombre: '',
    geo: { pais: '', estado: '', ciudad: '' }
  };

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function start(payload) {
    payload = payload || {};
    var sector = payload.sector || {};
    var subcat = payload.subcat || {};
    session.active = true;
    session.origin = payload.origin || 'otros-sectores';
    session.sectorId = payload.sectorId || sector.id || '';
    session.sectorNombre = payload.sectorNombre || sector.nombre || '';
    session.sectorEmoji = payload.sectorEmoji || sector.emoji || '';
    session.subcatId = payload.subcatId || subcat.id || '';
    session.subcatNombre = payload.subcatNombre || subcat.nombre || '';
    session.geo = { pais: '', estado: '', ciudad: '' };
    syncHomeGlobals();
    syncHomeCategoryField();
    return get();
  }

  function updateGeo(geo) {
    geo = geo || {};
    session.geo.pais = geo.pais || '';
    session.geo.estado = geo.estado || '';
    session.geo.ciudad = geo.ciudad || '';
    syncHomeGlobals();
    return get();
  }

  function clear() {
    session.active = false;
    session.origin = '';
    session.sectorId = '';
    session.sectorNombre = '';
    session.sectorEmoji = '';
    session.subcatId = '';
    session.subcatNombre = '';
    session.geo = { pais: '', estado: '', ciudad: '' };
    geoTransitionLock = false;
  }

  function beginGeoTransition() {
    geoTransitionLock = true;
  }

  function endGeoTransition() {
    geoTransitionLock = false;
  }

  function isGeoTransitionLocked() {
    return !!geoTransitionLock;
  }

  function shouldKeepPageLocked() {
    if (geoTransitionLock) return true;
    var geo = document.getElementById('chGeoModal');
    return !!(geo && geo.classList.contains('is-open'));
  }

  function isActive() {
    return !!session.active;
  }

  function get() {
    return {
      active: session.active,
      origin: session.origin,
      sectorId: session.sectorId,
      sectorNombre: session.sectorNombre,
      sectorEmoji: session.sectorEmoji,
      subcatId: session.subcatId,
      subcatNombre: session.subcatNombre,
      geo: {
        pais: session.geo.pais,
        estado: session.geo.estado,
        ciudad: session.geo.ciudad
      }
    };
  }

  function getSectorAccent(sectorId) {
    return SECTOR_ACCENT[sectorId] || '#e91e63';
  }

  function syncHomeCategoryField() {
    if (!session.subcatNombre) return;
    var label = document.getElementById('fieldCategoriaLabel');
    var field = document.getElementById('fieldCategoria');
    if (label) label.textContent = session.subcatNombre;
    if (field) field.classList.add('is-selected');
    if (typeof global.setCategoriaHome === 'function') {
      global.setCategoriaHome(session.subcatNombre);
    }
  }

  function syncHomeGlobals() {
    if (session.subcatNombre) {
      if (typeof global.setCategoriaHome === 'function') {
        global.setCategoriaHome(session.subcatNombre);
      } else {
        global.categoriaSeleccionada = session.subcatNombre;
      }
    }
    if (session.sectorId) global.sectorSeleccionado = session.sectorId;
    if (typeof global.syncHomeGeoFromPicker === 'function') {
      global.syncHomeGeoFromPicker({
        pais: session.geo.pais || '',
        estado: session.geo.estado || '',
        ciudad: session.geo.ciudad || ''
      });
    } else {
      global.paisSeleccionado = session.geo.pais || '';
      global.estadoSeleccionado = session.geo.estado || '';
      global.ciudadSeleccionada = session.geo.ciudad || '';
    }
    if (typeof global.syncHomeGeoPickerFromGlobals === 'function') {
      global.syncHomeGeoPickerFromGlobals();
    }
    if (global.__homeGeoPicker && typeof global.__homeGeoPicker.setValues === 'function') {
      global.__homeGeoPicker.setValues(session.geo);
    }
  }

  function getBreadcrumbSegments(opts) {
    opts = opts || {};
    var segs = [];
    var sectorLine = (session.sectorEmoji ? session.sectorEmoji + ' ' : '') + session.sectorNombre;
    if (sectorLine.trim()) {
      segs.push({ kind: 'sector', label: sectorLine.trim() });
    }
    if (session.subcatNombre) {
      segs.push({ kind: 'subcat', label: session.subcatNombre });
    }
    if (opts.includeGeo) {
      if (session.geo.pais) segs.push({ kind: 'pais', label: session.geo.pais });
      if (session.geo.estado) segs.push({ kind: 'estado', label: session.geo.estado });
      if (session.geo.ciudad) segs.push({ kind: 'ciudad', label: session.geo.ciudad });
    }
    return segs;
  }

  function renderBreadcrumbEl(el, opts) {
    if (!el) return;
    opts = opts || {};
    var visibleKinds = opts.visibleKinds || DEFAULT_VISIBLE_KINDS;
    var segs = getBreadcrumbSegments({ includeGeo: !!opts.includeGeo });
    if (!segs.length) {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    el.hidden = false;
    var html = '<ol class="ch-geo-context-trail__list">';
    segs.forEach(function (seg) {
      var visible = visibleKinds.indexOf(seg.kind) >= 0;
      html +=
        '<li class="ch-geo-context-trail__item' +
        (seg.kind === 'subcat' ? ' ch-geo-context-trail__item--subcat' : '') +
        (seg.kind === 'pais' || seg.kind === 'estado' || seg.kind === 'ciudad'
          ? ' ch-geo-context-trail__item--geo' : '') +
        (!visible ? ' ch-geo-context-trail__item--hidden' : '') +
        '" data-kind="' + esc(seg.kind) + '"' +
        (visible ? '' : ' hidden') +
        '><span>' + esc(seg.label) + '</span></li>';
    });
    html += '</ol>';
    el.innerHTML = html;
  }

  global.CariHubSearchJourneySession = {
    start: start,
    updateGeo: updateGeo,
    clear: clear,
    isActive: isActive,
    get: get,
    getSectorAccent: getSectorAccent,
    getBreadcrumbSegments: getBreadcrumbSegments,
    renderBreadcrumbEl: renderBreadcrumbEl,
    syncHomeGlobals: syncHomeGlobals,
    beginGeoTransition: beginGeoTransition,
    endGeoTransition: endGeoTransition,
    isGeoTransitionLocked: isGeoTransitionLocked,
    shouldKeepPageLocked: shouldKeepPageLocked,
    DEFAULT_VISIBLE_KINDS: DEFAULT_VISIBLE_KINDS
  };
})(typeof window !== 'undefined' ? window : globalThis);
