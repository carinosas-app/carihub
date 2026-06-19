#!/usr/bin/env node
/**
 * Descarga imágenes geo (estados/ciudades) a public/img/geo/
 * Uso: node scripts/fetch-geo-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const manifestPath = path.join(__dirname, 'geo-image-manifest.json');
const outRoot = path.join(root, 'public', 'img', 'geo');

function slug(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'CariHub-GeoImageFetcher/1.0' },
    redirect: 'follow'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function fetchSection(section, subdir) {
  const results = {};
  const dir = path.join(outRoot, subdir);
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, url] of Object.entries(section)) {
    const file = path.join(dir, slug(name) + '.jpg');
    const rel = 'img/geo/' + subdir + '/' + slug(name) + '.jpg';
    try {
      const bytes = await download(url, file);
      results[name] = rel;
      console.log('OK', rel, `(${bytes} bytes)`);
    } catch (err) {
      console.warn('FAIL', name, err.message, '-> using remote URL');
      results[name] = url;
    }
  }
  return results;
}

async function fetchCityPool(urls) {
  const dir = path.join(outRoot, 'ciudades');
  fs.mkdirSync(dir, { recursive: true });
  const results = [];
  let i = 0;
  for (const url of urls) {
    const file = path.join(dir, 'ciudad-' + String(i + 1).padStart(2, '0') + '.jpg');
    const rel = 'img/geo/ciudades/ciudad-' + String(i + 1).padStart(2, '0') + '.jpg';
    try {
      await download(url, file);
      results.push(rel);
      console.log('OK', rel);
    } catch (err) {
      console.warn('FAIL city', i + 1, err.message);
      results.push(url);
    }
    i++;
  }
  return results;
}

function writeImagesJs(data) {
  const out = path.join(root, 'public', 'js', 'carihub-geo-images.js');
  const body = `/**
 * Imágenes geo — estados por país y pool de ciudades.
 * Generado por scripts/fetch-geo-images.mjs — no editar a mano.
 */
(function (global) {
  'use strict';

  var STATE_BY_COUNTRY = ${JSON.stringify(data.stateByCountry, null, 2)};

  var COUNTRY_FALLBACK = ${JSON.stringify(data.countryFallback, null, 2)};

  var CITY_PHOTOS = ${JSON.stringify(data.cityPhotos, null, 2)};

  var STATE_ALIASES = {
    'CDMX': 'Ciudad de México'
  };

  function hashName(name) {
    var n = 0;
    var s = String(name || '');
    for (var i = 0; i < s.length; i++) n += s.charCodeAt(i);
    return n;
  }

  function normalizeState(estado) {
    if (!estado) return '';
    if (STATE_ALIASES[estado]) return STATE_ALIASES[estado];
    return estado;
  }

  function stateImage(pais, estado) {
    if (!estado) return COUNTRY_FALLBACK[pais] || CITY_PHOTOS[0];
    var key = normalizeState(estado);
    var map = STATE_BY_COUNTRY[pais];
    if (map) {
      if (map[estado]) return map[estado];
      if (map[key]) return map[key];
    }
    if (COUNTRY_FALLBACK[pais]) return COUNTRY_FALLBACK[pais];
    return CITY_PHOTOS[hashName(pais + '|' + key) % CITY_PHOTOS.length];
  }

  function cityImage(pais, ciudad) {
    if (!ciudad) return CITY_PHOTOS[0];
    return CITY_PHOTOS[hashName(pais + '|' + ciudad) % CITY_PHOTOS.length];
  }

  global.CariHubGeoImages = {
    stateImage: stateImage,
    cityImage: cityImage,
    STATE_BY_COUNTRY: STATE_BY_COUNTRY,
    CITY_PHOTOS: CITY_PHOTOS
  };
})(typeof window !== 'undefined' ? window : globalThis);
`;
  fs.writeFileSync(out, body, 'utf8');
  console.log('Wrote', out);
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const mx = await fetchSection(manifest.mx_states, 'mx');
  const co = await fetchSection(manifest.co_states, 'co');
  const us = await fetchSection(manifest.us_states, 'us');
  const es = await fetchSection(manifest.es_states, 'es');
  const cityPhotos = await fetchCityPool(manifest.city_photos);

  const countryFallback = {};
  for (const [pais, url] of Object.entries(manifest.country_fallback)) {
    const file = path.join(outRoot, 'paises', slug(pais) + '.jpg');
    const rel = 'img/geo/paises/' + slug(pais) + '.jpg';
    try {
      await download(url, file);
      countryFallback[pais] = rel;
      console.log('OK', rel);
    } catch (err) {
      countryFallback[pais] = url;
      console.warn('FAIL country', pais, err.message);
    }
  }

  writeImagesJs({
    stateByCountry: {
      'México': mx,
      'Colombia': co,
      'Estados Unidos': us,
      'España': es
    },
    countryFallback,
    cityPhotos
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
