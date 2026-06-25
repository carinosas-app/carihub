/**
 * Catálogos geo bajo demanda (JSON) — no bloquear carga del Home.
 */
(function (global) {
  'use strict';

  var CACHE = Object.create(null);
  var LOADING = Object.create(null);
  var VERSION = '20260625c';

  /** Catálogos oficiales lazy-load: js/geo/catalogs/{slug}.json */
  var SLUG_BY_PAIS = {
    'México': 'mx',
    'Uruguay': 'uy',
    'Chile': 'cl',
    'Colombia': 'co',
    'Perú': 'pe',
    'Argentina': 'ar',
    'Brasil': 'br'
  };

  function normalizeKey(name) {
    return String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function catalogUrl(slug) {
    return 'js/geo/catalogs/' + slug + '.json?v=' + VERSION;
  }

  function patchLegacyGlobals(pais, data) {
    if (!data || !pais) return;
    try {
      if (typeof ESTADOS !== 'undefined' && ESTADOS && typeof ESTADOS === 'object') {
        ESTADOS[pais] = Object.keys(data).slice();
      }
    } catch (e) { /* noop */ }
    try {
      if (typeof CIUDADES !== 'undefined' && CIUDADES && typeof CIUDADES === 'object') {
        CIUDADES[pais] = data;
      }
    } catch (e) { /* noop */ }
  }

  function loadMexicoScriptFallback() {
    return new Promise(function (resolve, reject) {
      if (global.MEXICO_ESTADOS_MUNICIPIOS) {
        resolve(global.MEXICO_ESTADOS_MUNICIPIOS);
        return;
      }
      var src = 'js/mexico-estados-municipios.js?v=20260625a';
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve(global.MEXICO_ESTADOS_MUNICIPIOS || null);
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = function () {
        resolve(global.MEXICO_ESTADOS_MUNICIPIOS || null);
      };
      s.onerror = function () {
        reject(new Error('No se pudo cargar catálogo México'));
      };
      document.head.appendChild(s);
    });
  }

  function ensureLoaded(pais) {
    var slug = SLUG_BY_PAIS[pais];
    if (!slug) return Promise.resolve(null);
    if (CACHE[slug]) return Promise.resolve(CACHE[slug]);
    if (LOADING[slug]) return LOADING[slug];

    LOADING[slug] = fetch(catalogUrl(slug))
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .catch(function () {
        if (slug === 'mx') return loadMexicoScriptFallback();
        throw new Error('Catálogo no disponible');
      })
      .then(function (data) {
        if (!data) throw new Error('Catálogo vacío');
        CACHE[slug] = data;
        patchLegacyGlobals(pais, data);
        delete LOADING[slug];
        return data;
      })
      .catch(function (err) {
        delete LOADING[slug];
        throw err;
      });

    return LOADING[slug];
  }

  function findEstadoKey(data, estado) {
    if (!data || !estado) return '';
    if (data[estado]) return estado;
    var target = normalizeKey(estado);
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
      if (normalizeKey(keys[i]) === target) return keys[i];
    }
    return '';
  }

  function getEstados(pais) {
    var slug = SLUG_BY_PAIS[pais];
    if (slug && CACHE[slug]) {
      return Object.keys(CACHE[slug]).slice().sort(function (a, b) {
        return String(a).localeCompare(String(b), 'es');
      });
    }
    if (typeof ESTADOS !== 'undefined' && ESTADOS[pais]) {
      return ESTADOS[pais].slice();
    }
    return [];
  }

  function getCiudades(pais, estado) {
    var slug = SLUG_BY_PAIS[pais];
    if (slug && CACHE[slug]) {
      var key = findEstadoKey(CACHE[slug], estado);
      return key ? CACHE[slug][key].slice() : [];
    }
    if (
      typeof CIUDADES !== 'undefined' &&
      CIUDADES[pais] &&
      CIUDADES[pais][estado]
    ) {
      return CIUDADES[pais][estado].slice();
    }
    if (pais === 'México' && typeof municipiosDeEstadoMexico === 'function') {
      return municipiosDeEstadoMexico(estado);
    }
    return [];
  }

  function usesLazyCatalog(pais) {
    return !!SLUG_BY_PAIS[pais];
  }

  global.CariHubGeoCatalog = {
    ensureLoaded: ensureLoaded,
    getEstados: getEstados,
    getCiudades: getCiudades,
    usesLazyCatalog: usesLazyCatalog,
    SLUG_BY_PAIS: SLUG_BY_PAIS
  };
})(typeof window !== 'undefined' ? window : globalThis);
