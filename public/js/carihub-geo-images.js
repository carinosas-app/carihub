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
  "España": "img/geo/ciudades/ciudad-05.jpg",
  "Canadá": "img/geo/ciudades/ciudad-06.jpg",
  "Perú": "img/geo/mx/oaxaca.jpg",
  "Chile": "img/geo/ciudades/ciudad-07.jpg",
  "Argentina": "img/geo/ciudades/ciudad-08.jpg",
  "Brasil": "img/geo/ciudades/ciudad-09.jpg"
};

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

  function hashName(name) {
    var n = 0;
    var s = String(name || '');
    for (var i = 0; i < s.length; i++) n += s.charCodeAt(i);
    return n;
  }

  function normalizeState(estado) {
    if (!estado) return '';
    return STATE_ALIASES[estado] || estado;
  }

  function stateImage(pais, estado) {
    if (!estado) return COUNTRY_FALLBACK[pais] || FALLBACK_IMG;
    var key = normalizeState(estado);
    var map = STATE_BY_COUNTRY[pais];
    if (map) {
      if (map[estado]) return map[estado];
      if (map[key]) return map[key];
    }
    if (COUNTRY_FALLBACK[pais]) return COUNTRY_FALLBACK[pais];
    return CITY_PHOTOS[hashName(pais + '|' + key) % CITY_PHOTOS.length] || FALLBACK_IMG;
  }

  function cityImage(pais, ciudad) {
    if (!ciudad) return CITY_PHOTOS[0] || FALLBACK_IMG;
    if (CITY_OVERRIDES[ciudad]) return CITY_OVERRIDES[ciudad];
    return CITY_PHOTOS[hashName(pais + '|' + ciudad) % CITY_PHOTOS.length] || FALLBACK_IMG;
  }

  function flagImage(pais) {
    return FLAG_IMAGES[pais] || '';
  }

  global.CariHubGeoImages = {
    stateImage: stateImage,
    cityImage: cityImage,
    flagImage: flagImage,
    STATE_BY_COUNTRY: STATE_BY_COUNTRY,
    CITY_PHOTOS: CITY_PHOTOS,
    FLAG_IMAGES: FLAG_IMAGES,
    CITY_OVERRIDES: CITY_OVERRIDES
  };
})(typeof window !== 'undefined' ? window : globalThis);
