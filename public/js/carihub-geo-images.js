/**
 * Imágenes geo locales — estados, ciudades y banderas SVG.
 * Generado por scripts/write-geo-images-js.mjs
 */
(function (global) {
  'use strict';

  var STATE_BY_COUNTRY = {
  "México": {
    "Aguascalientes": "img/geo/mx/aguascalientes.jpg",
    "Baja California Sur": "img/geo/mx/baja-california-sur.jpg",
    "Baja California": "img/geo/mx/baja-california.jpg",
    "Campeche": "img/geo/mx/campeche.jpg",
    "CDMX": "img/geo/mx/cdmx.jpg",
    "Chiapas": "img/geo/mx/chiapas.jpg",
    "Chihuahua": "img/geo/mx/chihuahua.jpg",
    "Ciudad de México": "img/geo/mx/ciudad-de-mexico.jpg",
    "Coahuila": "img/geo/mx/coahuila.jpg",
    "Colima": "img/geo/mx/colima.jpg",
    "Durango": "img/geo/mx/durango.jpg",
    "Estado de México": "img/geo/mx/estado-de-mexico.jpg",
    "Guanajuato": "img/geo/mx/guanajuato.jpg",
    "Guerrero": "img/geo/mx/guerrero.jpg",
    "Hidalgo": "img/geo/mx/hidalgo.jpg",
    "Jalisco": "img/geo/mx/jalisco.jpg",
    "Michoacán": "img/geo/mx/michoacan.jpg",
    "Morelos": "img/geo/mx/morelos.jpg",
    "Nayarit": "img/geo/mx/nayarit.jpg",
    "Nuevo León": "img/geo/mx/nuevo-leon.jpg",
    "Oaxaca": "img/geo/mx/oaxaca.jpg",
    "Puebla": "img/geo/mx/puebla.jpg",
    "Querétaro": "img/geo/mx/queretaro.jpg",
    "Quintana Roo": "img/geo/mx/quintana-roo.jpg",
    "San Luis Potosí": "img/geo/mx/san-luis-potosi.jpg",
    "Sinaloa": "img/geo/mx/sinaloa.jpg",
    "Sonora": "img/geo/mx/sonora.jpg",
    "Tabasco": "img/geo/mx/tabasco.jpg",
    "Tamaulipas": "img/geo/mx/tamaulipas.jpg",
    "Tlaxcala": "img/geo/mx/tlaxcala.jpg",
    "Veracruz": "img/geo/mx/veracruz.jpg",
    "Yucatán": "img/geo/mx/yucatan.jpg",
    "Zacatecas": "img/geo/mx/zacatecas.jpg"
  }
};

  var COUNTRY_FALLBACK = {
  "México": "img/geo/mx/ciudad-de-mexico.jpg",
  "Colombia": "img/geo/ciudades/ciudad-03.jpg",
  "Estados Unidos": "img/geo/ciudades/ciudad-04.jpg",
  "España": "img/geo/ciudades/ciudad-08.jpg",
  "Canadá": "img/geo/ciudades/ciudad-14.jpg",
  "Perú": "img/geo/ciudades/ciudad-03.jpg",
  "Chile": "img/geo/ciudades/ciudad-04.jpg",
  "Argentina": "img/geo/ciudades/ciudad-08.jpg",
  "Brasil": "img/geo/ciudades/ciudad-02.jpg",
  "Uruguay": "img/geo/ciudades/ciudad-14.jpg"
};

  /** Sin banderas ni rutas /mx/ — pool para países distintos de México */
  var GEO_DECOR_SVGS = [
    "img/geo/ciudad-plaza.svg",
    "img/geo/ciudad-parque.svg",
    "img/geo/ciudad-centro.svg",
    "img/geo/ciudad-calle.svg",
    "img/geo/estado-costa.svg",
    "img/geo/estado-colonial.svg",
    "img/geo/estado-urbano.svg",
    "img/geo/estado-norte.svg"
  ];

  var INTERNATIONAL_JPG_WHITELIST = [
    "img/geo/ciudades/ciudad-02.jpg",
    "img/geo/ciudades/ciudad-03.jpg",
    "img/geo/ciudades/ciudad-04.jpg",
    "img/geo/ciudades/ciudad-08.jpg",
    "img/geo/ciudades/ciudad-14.jpg"
  ];

  var CITY_PHOTOS = [
  "img/geo/ciudades/ciudad-01.jpg",
  "img/geo/ciudades/ciudad-02.jpg",
  "img/geo/ciudades/ciudad-03.jpg",
  "img/geo/ciudades/ciudad-04.jpg",
  "img/geo/ciudades/ciudad-05.jpg",
  "img/geo/ciudades/ciudad-06.jpg",
  "img/geo/ciudades/ciudad-07.jpg",
  "img/geo/ciudades/ciudad-08.jpg",
  "img/geo/ciudades/ciudad-09.jpg",
  "img/geo/ciudades/ciudad-10.jpg",
  "img/geo/ciudades/ciudad-11.jpg",
  "img/geo/ciudades/ciudad-12.jpg",
  "img/geo/ciudades/ciudad-13.jpg",
  "img/geo/ciudades/ciudad-14.jpg",
  "img/geo/ciudades/ciudad-15.jpg",
  "img/geo/ciudades/ciudad-16.jpg",
  "img/geo/ciudades/ciudad-17.jpg",
  "img/geo/ciudades/ciudad-18.jpg",
  "img/geo/ciudades/ciudad-19.jpg",
  "img/geo/ciudades/ciudad-20.jpg",
  "img/geo/ciudades/ciudad-21.jpg",
  "img/geo/ciudades/ciudad-22.jpg",
  "img/geo/ciudades/ciudad-23.jpg",
  "img/geo/ciudades/ciudad-24.jpg",
  "img/geo/ciudades/ciudad-25.jpg",
  "img/geo/ciudades/ciudad-26.jpg",
  "img/geo/ciudades/ciudad-27.jpg",
  "img/geo/ciudades/ciudad-28.jpg",
  "img/geo/ciudades/ciudad-29.jpg",
  "img/geo/ciudades/ciudad-30.jpg",
  "img/geo/ciudades/ciudad-31.jpg",
  "img/geo/ciudades/ciudad-32.jpg",
  "img/geo/ciudades/ciudad-33.jpg",
  "img/geo/ciudades/ciudad-34.jpg",
  "img/geo/ciudades/ciudad-35.jpg",
  "img/geo/ciudades/ciudad-36.jpg",
  "img/geo/ciudades/ciudad-37.jpg",
  "img/geo/ciudades/ciudad-38.jpg",
  "img/geo/ciudades/ciudad-39.jpg",
  "img/geo/ciudades/ciudad-40.jpg"
];

  var FLAG_IMAGES = {
  "México": "img/flags/mx.png",
  "Estados Unidos": "img/flags/us.svg",
  "Colombia": "img/flags/co.svg",
  "Canadá": "img/flags/ca.svg",
  "España": "img/flags/es.svg",
  "Perú": "img/flags/pe.svg",
  "Chile": "img/flags/cl.svg",
  "Argentina": "img/flags/ar.svg",
  "Brasil": "img/flags/br.svg",
  "Reino Unido": "img/flags/gb.svg",
  "Australia": "img/flags/au.svg",
  "Francia": "img/flags/fr.svg",
  "Alemania": "img/flags/de.svg",
  "Italia": "img/flags/it.svg",
  "Portugal": "img/flags/pt.svg",
  "Venezuela": "img/flags/ve.svg",
  "Ecuador": "img/flags/ec.svg",
  "Uruguay": "img/flags/uy.svg",
  "Paraguay": "img/flags/py.svg",
  "Bolivia": "img/flags/bo.svg",
  "Panamá": "img/flags/pa.svg",
  "Costa Rica": "img/flags/cr.svg",
  "Guatemala": "img/flags/gt.svg",
  "Cuba": "img/flags/cu.svg",
  "República Dominicana": "img/flags/do.svg",
  "Puerto Rico": "img/flags/pr.svg"
};

  var CITY_OVERRIDES = {
  "Guadalupe": "img/geo/ciudades/ciudad-guadalupe.jpg",
  "García": "img/geo/ciudades/ciudad-garcia.jpg",
  "Apodaca": "img/geo/ciudades/ciudad-apodaca.jpg",
  "Santa Catarina": "img/geo/ciudades/ciudad-santa-catarina.jpg"
};

  var STATE_ALIASES = { 'CDMX': 'Ciudad de México' };

  var FALLBACK_IMG = 'img/home/promo-perfil.jpg';

  function fnv1a(str) {
    var h = 2166136261;
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function normalizeState(estado) {
    if (!estado) return '';
    return STATE_ALIASES[estado] || estado;
  }

  function internationalImagePool() {
    if (internationalImagePool._cache) {
      return internationalImagePool._cache;
    }
    internationalImagePool._cache = GEO_DECOR_SVGS.concat(INTERNATIONAL_JPG_WHITELIST);
    return internationalImagePool._cache;
  }

  function pickFromPool(pool, key) {
    if (!pool || !pool.length) return FALLBACK_IMG;
    return pool[fnv1a(key) % pool.length] || FALLBACK_IMG;
  }

  function countryFallback(pais) {
    var fb = COUNTRY_FALLBACK[pais];
    if (pais === 'México' && fb) return fb;
    if (fb && fb.indexOf('/mx/') === -1) return fb;
    return pickFromPool(internationalImagePool(), pais || 'country');
  }

  function stateImage(pais, estado) {
    if (!estado) return countryFallback(pais);
    var key = normalizeState(estado);
    if (pais === 'México') {
      var map = STATE_BY_COUNTRY[pais];
      if (map) {
        if (map[estado]) return map[estado];
        if (map[key]) return map[key];
      }
      return countryFallback(pais);
    }
    return pickFromPool(internationalImagePool(), (pais || '') + '|' + key);
  }

  function cityImage(pais, ciudad, estado) {
    if (!ciudad) return pickFromPool(internationalImagePool(), pais || 'city');
    if (pais === 'México') {
      if (CITY_OVERRIDES[ciudad]) return CITY_OVERRIDES[ciudad];
      return CITY_PHOTOS[fnv1a((pais || '') + '|' + (estado || '') + '|' + ciudad) % CITY_PHOTOS.length] || FALLBACK_IMG;
    }
    return pickFromPool(
      internationalImagePool(),
      (pais || '') + '|' + (estado || '') + '|' + ciudad
    );
  }

  function flagImage(pais) {
    return FLAG_IMAGES[pais] || '';
  }

  global.CariHubGeoImages = {
    stateImage: stateImage,
    cityImage: cityImage,
    flagImage: flagImage,
    internationalImagePool: internationalImagePool,
    STATE_BY_COUNTRY: STATE_BY_COUNTRY,
    CITY_PHOTOS: CITY_PHOTOS,
    GEO_DECOR_SVGS: GEO_DECOR_SVGS,
    FLAG_IMAGES: FLAG_IMAGES,
    CITY_OVERRIDES: CITY_OVERRIDES
  };
})(typeof window !== 'undefined' ? window : globalThis);
