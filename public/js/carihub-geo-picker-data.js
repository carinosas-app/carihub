/**
 * Metadatos visuales geo picker — alineado a Documento Maestro V5.
 */
(function (global) {
  'use strict';

  var FLAGS = {
    'México': '🇲🇽',
    'Estados Unidos': '🇺🇸',
    'Colombia': '🇨🇴',
    'Canadá': '🇨🇦',
    'España': '🇪🇸',
    'Perú': '🇵🇪',
    'Chile': '🇨🇱',
    'Argentina': '🇦🇷',
    'Brasil': '🇧🇷',
    'Reino Unido': '🇬🇧',
    'Australia': '🇦🇺',
    'Francia': '🇫🇷'
  };

  var POPULAR_PERFILES = {
    'México': 15000,
    'Estados Unidos': 8000,
    'Colombia': 4000,
    'Canadá': 2500,
    'España': 3200,
    'Perú': 1800,
    'Chile': 1600,
    'Argentina': 2100,
    'Brasil': 2900
  };

  var STATE_PERFILES = {
    'Nuevo León': 3200,
    'CDMX': 8500,
    'Ciudad de México': 8500,
    'Jalisco': 2800,
    'Baja California': 1900,
    'Puebla': 1200
  };

  var CITY_PERFILES = {
    'Monterrey': 1200,
    'San Nicolás': 680,
    'Apodaca': 540,
    'Guadalupe': 490,
    'Escobedo': 420,
    'García': 380,
    'Juárez': 350
  };

  var STATE_CAPITAL = {
    'Nuevo León': 'Monterrey',
    'Jalisco': 'Guadalajara',
    'CDMX': 'Ciudad de México',
    'Ciudad de México': 'Ciudad de México',
    'Estado de México': 'Toluca',
    'Puebla': 'Puebla',
    'Baja California': 'Tijuana',
    'Chihuahua': 'Chihuahua'
  };

  var IMAGES = {
    pais: {
      'México': 'img/home/hero-motel-spa-fachada.png',
      'Estados Unidos': 'img/home/hero-negocios-grid-noche.png',
      'Colombia': 'img/home/nightclub.jpg',
      'Canadá': 'img/home/promo-destaca.jpg',
      'España': 'img/home/lounge-swinger.jpg',
      'Perú': 'img/home/spa-entrada.jpg',
      'Chile': 'img/home/promo-perfil.jpg',
      'Argentina': 'img/home/escort-gay.jpg',
      'Brasil': 'img/home/negocios-grid.jpg'
    },
    estado: {
      'Nuevo León': 'img/home/hero-negocios-grid-noche.png',
      'Jalisco': 'img/home/spa-entrada.jpg',
      'CDMX': 'img/home/hero-antro-restaurante.png',
      'Ciudad de México': 'img/home/hero-antro-restaurante.png',
      'Estado de México': 'img/home/promo-perfil.jpg',
      'Puebla': 'img/home/motel-noche.jpg',
      'Baja California': 'img/home/hero-motel-noche-rojo.png',
      'Chihuahua': 'img/home/promo-destaca.jpg',
      'Querétaro': 'img/home/promo-perfil.jpg',
      'Texas': 'img/home/hero-negocios-grid-noche.png',
      'California': 'img/home/nightclub.jpg'
    },
    ciudad: {
      'Monterrey': 'img/home/hero-motel-spa-fachada.png',
      'San Nicolás': 'img/home/hero-negocios-grid-noche.png',
      'San Nicolás de los Garza': 'img/home/hero-negocios-grid-noche.png',
      'Apodaca': 'img/home/promo-destaca.jpg',
      'Guadalupe': 'img/home/spa-entrada.jpg',
      'Escobedo': 'img/home/motel-noche.jpg',
      'García': 'img/home/promo-perfil.jpg',
      'Juárez': 'img/home/hero-motel-noche-rojo.png',
      'Guadalajara': 'img/home/spa-entrada.jpg',
      'Ciudad de México': 'img/home/hero-antro-restaurante.png',
      'Tijuana': 'img/home/hero-motel-noche-rojo.png'
    }
  };

  var DISPLAY_NAMES = {
    'CDMX': 'Ciudad de México'
  };

  function displayName(name) {
    return DISPLAY_NAMES[name] || name;
  }

  function flagFor(name) {
    return FLAGS[name] || '🌎';
  }

  function formatPerfiles(n, plus) {
    n = Math.max(0, Math.round(n));
    var txt = n.toLocaleString('es-MX');
    if (plus) return '+' + txt + ' perfiles';
    return txt + ' perfiles';
  }

  function stubPerfiles(name, seed) {
    seed = seed || 0;
    if (STATE_PERFILES[name]) return STATE_PERFILES[name];
    if (CITY_PERFILES[name]) return CITY_PERFILES[name];
    if (POPULAR_PERFILES[name]) return POPULAR_PERFILES[name];
    var n = seed;
    var s = String(name || '');
    for (var i = 0; i < s.length; i++) n += s.charCodeAt(i);
    return 800 + (n % 38) * 95;
  }

  var COUNTRY_DIVISION_COUNTS = {
    'México': 32,
    'Estados Unidos': 50,
    'Colombia': 32,
    'Canadá': 13,
    'España': 17
  };

  function divisionCount(pais, fallback) {
    if (COUNTRY_DIVISION_COUNTS[pais] != null) return COUNTRY_DIVISION_COUNTS[pais];
    return fallback;
  }

  function divisionWord(pais) {
    if (pais === 'Colombia') return 'departamentos';
    if (pais === 'Canadá') return 'provincias';
    if (pais === 'España') return 'comunidades';
    return 'estados';
  }

  function imageFor(tipo, name) {
    var bucket = IMAGES[tipo] || {};
    return bucket[name] || 'img/home/promo-perfil.jpg';
  }

  function capitalFor(estado) {
    return STATE_CAPITAL[estado] || estado;
  }

  global.CariHubGeoPickerData = {
    flagFor: flagFor,
    formatPerfiles: formatPerfiles,
    stubPerfiles: stubPerfiles,
    divisionWord: divisionWord,
    imageFor: imageFor,
    capitalFor: capitalFor,
    divisionCount: divisionCount,
    displayName: displayName,
    POPULAR_PERFILES: POPULAR_PERFILES
  };
})(typeof window !== 'undefined' ? window : globalThis);
