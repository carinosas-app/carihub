#!/usr/bin/env node
/** Escribe carihub-geo-images.js con rutas locales verificadas */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(root, 'public');

const SLUG_TO_MX = {
  'aguascalientes': 'Aguascalientes',
  'baja-california': 'Baja California',
  'baja-california-sur': 'Baja California Sur',
  'campeche': 'Campeche',
  'chiapas': 'Chiapas',
  'chihuahua': 'Chihuahua',
  'ciudad-de-mexico': 'Ciudad de México',
  'cdmx': 'CDMX',
  'coahuila': 'Coahuila',
  'colima': 'Colima',
  'durango': 'Durango',
  'estado-de-mexico': 'Estado de México',
  'guanajuato': 'Guanajuato',
  'guerrero': 'Guerrero',
  'hidalgo': 'Hidalgo',
  'jalisco': 'Jalisco',
  'michoacan': 'Michoacán',
  'morelos': 'Morelos',
  'nayarit': 'Nayarit',
  'nuevo-leon': 'Nuevo León',
  'oaxaca': 'Oaxaca',
  'puebla': 'Puebla',
  'queretaro': 'Querétaro',
  'quintana-roo': 'Quintana Roo',
  'san-luis-potosi': 'San Luis Potosí',
  'sinaloa': 'Sinaloa',
  'sonora': 'Sonora',
  'tabasco': 'Tabasco',
  'tamaulipas': 'Tamaulipas',
  'tlaxcala': 'Tlaxcala',
  'veracruz': 'Veracruz',
  'yucatan': 'Yucatán',
  'zacatecas': 'Zacatecas'
};

const FLAG_ISO = {
  'México': 'mx', 'Estados Unidos': 'us', 'Colombia': 'co', 'Canadá': 'ca', 'España': 'es',
  'Perú': 'pe', 'Chile': 'cl', 'Argentina': 'ar', 'Brasil': 'br', 'Reino Unido': 'gb',
  'Australia': 'au', 'Francia': 'fr', 'Alemania': 'de', 'Italia': 'it', 'Portugal': 'pt',
  'Venezuela': 've', 'Ecuador': 'ec', 'Uruguay': 'uy', 'Paraguay': 'py', 'Bolivia': 'bo',
  'Panamá': 'pa', 'Costa Rica': 'cr', 'Guatemala': 'gt', 'Cuba': 'cu',
  'República Dominicana': 'do', 'Puerto Rico': 'pr'
};

function rel(p) {
  return p.replace(/\\/g, '/').replace(/^public\//, '').replace(/^.*?public[/\\]/, '');
}

function scanMx() {
  const dir = path.join(publicRoot, 'img', 'geo', 'mx');
  const out = {};
  for (const file of fs.readdirSync(dir)) {
    const slug = file.replace(/\.(jpg|png|jpeg|webp)$/i, '');
    const name = SLUG_TO_MX[slug];
    if (name) out[name] = 'img/geo/mx/' + file;
  }
  return out;
}

function scanCiudades() {
  const dir = path.join(publicRoot, 'img', 'geo', 'ciudades');
  return fs.readdirSync(dir)
    .filter((f) => /^ciudad-\d{2}\.jpg$/i.test(f))
    .sort()
    .map((f) => 'img/geo/ciudades/' + f);
}

function scanFlags() {
  const out = {};
  for (const [pais, iso] of Object.entries(FLAG_ISO)) {
    if (pais === 'México') {
      const png = path.join(publicRoot, 'img', 'flags', 'mx.png');
      if (fs.existsSync(png)) {
        out[pais] = 'img/flags/mx.png';
        continue;
      }
    }
    const svg = path.join(publicRoot, 'img', 'flags', iso + '.svg');
    if (fs.existsSync(svg)) out[pais] = 'img/flags/' + iso + '.svg';
  }
  return out;
}

const CITY_OVERRIDES = {
  'Guadalupe': 'img/geo/ciudades/ciudad-guadalupe.jpg',
  'García': 'img/geo/ciudades/ciudad-garcia.jpg',
  'Apodaca': 'img/geo/ciudades/ciudad-apodaca.jpg',
  'Santa Catarina': 'img/geo/ciudades/ciudad-santa-catarina.jpg'
};

const data = {
  stateByCountry: {
    'México': scanMx()
  },
  countryFallback: {
    'México': 'img/geo/mx/ciudad-de-mexico.jpg',
    'Colombia': 'img/geo/ciudades/ciudad-03.jpg',
    'Estados Unidos': 'img/geo/ciudades/ciudad-04.jpg',
    'España': 'img/geo/ciudades/ciudad-05.jpg',
    'Canadá': 'img/geo/ciudades/ciudad-06.jpg',
    'Perú': 'img/geo/mx/oaxaca.jpg',
    'Chile': 'img/geo/ciudades/ciudad-07.jpg',
    'Argentina': 'img/geo/ciudades/ciudad-08.jpg',
    'Brasil': 'img/geo/ciudades/ciudad-09.jpg'
  },
  cityPhotos: scanCiudades(),
  flagImages: scanFlags(),
  cityOverrides: CITY_OVERRIDES
};

const outFile = path.join(publicRoot, 'js', 'carihub-geo-images.js');
const body = `/**
 * Imágenes geo locales — estados, ciudades y banderas SVG.
 * Generado por scripts/write-geo-images-js.mjs
 */
(function (global) {
  'use strict';

  var STATE_BY_COUNTRY = ${JSON.stringify(data.stateByCountry, null, 2)};

  var COUNTRY_FALLBACK = ${JSON.stringify(data.countryFallback, null, 2)};

  var CITY_PHOTOS = ${JSON.stringify(data.cityPhotos, null, 2)};

  var FLAG_IMAGES = ${JSON.stringify(data.flagImages, null, 2)};

  var CITY_OVERRIDES = ${JSON.stringify(data.cityOverrides, null, 2)};

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
`;

fs.writeFileSync(outFile, body, 'utf8');
console.log('MX states:', Object.keys(data.stateByCountry['México']).length);
console.log('Cities:', data.cityPhotos.length);
console.log('Flags:', Object.keys(data.flagImages).length);
console.log('Wrote', outFile);
