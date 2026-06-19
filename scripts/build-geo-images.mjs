#!/usr/bin/env node
/**
 * Resuelve, descarga y empaqueta imágenes geo + banderas en public/img/
 * node scripts/build-geo-images.mjs
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const geoRoot = path.join(root, 'public', 'img', 'geo');
const flagRoot = path.join(root, 'public', 'img', 'flags');

const UA = 'CariHub-GeoBuilder/1.0 (contact@carihub.local)';

function slug(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

async function resolveCommonsSearch(query) {
  const api =
    'https://commons.wikimedia.org/w/api.php?action=query&generator=search' +
    '&gsrsearch=' + encodeURIComponent(query) +
    '&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*';
  const data = await fetchJson(api);
  const pages = data.query && data.query.pages;
  if (!pages) return null;
  for (const p of Object.values(pages)) {
    const info = p.imageinfo && p.imageinfo[0];
    if (!info) continue;
    const url = info.thumburl || info.url;
    if (url && /\.(jpe?g|png|webp)(\?|$)/i.test(url)) return url;
  }
  return null;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 800) throw new Error('file too small');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function fetchImage(query, dest, relPath) {
  try {
    const url = await resolveCommonsSearch(query);
    if (!url) throw new Error('no commons result');
    await download(url, dest);
    console.log('OK', relPath);
    return relPath;
  } catch (e) {
    const seed = crypto.createHash('md5').update(query).digest('hex').slice(0, 12);
    const picsum = `https://picsum.photos/seed/${seed}/800/600.jpg`;
    try {
      await download(picsum, dest);
      console.log('OK (picsum)', relPath);
      return relPath;
    } catch (e2) {
      console.warn('FAIL', query, e.message, e2.message);
      return 'img/home/promo-perfil.jpg';
    }
  }
}

const MX_QUERIES = {
  'Aguascalientes': 'Aguascalientes Mexico city cathedral',
  'Baja California': 'Tijuana Mexico skyline',
  'Baja California Sur': 'Cabo San Lucas arch Mexico',
  'Campeche': 'Campeche Mexico walled city',
  'Chiapas': 'Sumidero Canyon Chiapas Mexico',
  'Chihuahua': 'Copper Canyon Chihuahua Mexico',
  'Ciudad de México': 'Angel de la Independencia Mexico City',
  'CDMX': 'Angel de la Independencia Mexico City',
  'Coahuila': 'Saltillo Coahuila cathedral Mexico',
  'Colima': 'Volcan de Colima Mexico',
  'Durango': 'Durango Mexico historic center',
  'Estado de México': 'Teotihuacan pyramids Mexico',
  'Guanajuato': 'Guanajuato Mexico colorful city',
  'Guerrero': 'Acapulco bay Mexico',
  'Hidalgo': 'Prismas Basalticos Hidalgo Mexico',
  'Jalisco': 'Guadalajara Jalisco cathedral Mexico',
  'Michoacán': 'Morelia Michoacan cathedral Mexico',
  'Morelos': 'Tepozteco Morelos Mexico',
  'Nayarit': 'Sayulita beach Nayarit Mexico',
  'Nuevo León': 'Cerro de la Silla Monterrey Mexico',
  'Oaxaca': 'Monte Alban Oaxaca Mexico',
  'Puebla': 'Puebla Mexico city cathedral',
  'Querétaro': 'Queretaro aqueduct Mexico',
  'Quintana Roo': 'Tulum ruins Quintana Roo Mexico',
  'San Luis Potosí': 'San Luis Potosi cathedral Mexico',
  'Sinaloa': 'Mazatlan beach Sinaloa Mexico',
  'Sonora': 'Puerto Penasco Sonora Mexico beach',
  'Tabasco': 'Villahermosa Tabasco Mexico',
  'Tamaulipas': 'Playa Miramar Tamaulipas Mexico',
  'Tlaxcala': 'Tlaxcala Mexico city',
  'Veracruz': 'Veracruz port Mexico',
  'Yucatán': 'Chichen Itza Yucatan Mexico',
  'Zacatecas': 'Zacatecas Mexico city'
};

const CO_QUERIES = {
  'Amazonas': 'Leticia Amazonas Colombia',
  'Antioquia': 'Medellin Colombia skyline',
  'Arauca': 'Arauca Colombia',
  'Atlántico': 'Barranquilla Colombia',
  'Bogotá': 'Bogota Colombia Monserrate',
  'Bolívar': 'Cartagena Colombia walled city',
  'Boyacá': 'Villa de Leyva Boyaca Colombia',
  'Caldas': 'Manizales Colombia',
  'Caquetá': 'Florencia Caqueta Colombia',
  'Casanare': 'Yopal Casanare Colombia',
  'Cauca': 'Popayan Colombia',
  'Cesar': 'Valledupar Colombia',
  'Chocó': 'Bahia Solano Choco Colombia',
  'Córdoba': 'Monteria Cordoba Colombia',
  'Cundinamarca': 'Zipaquira salt cathedral Colombia',
  'Guainía': 'Puerto Inirida Colombia',
  'Guaviare': 'San Jose del Guaviare Colombia',
  'Huila': 'Neiva Huila Colombia',
  'La Guajira': 'Cabo de la Vela La Guajira Colombia',
  'Magdalena': 'Santa Marta Colombia beach',
  'Meta': 'Villavicencio Meta Colombia',
  'Nariño': 'Pasto Narino Colombia',
  'Norte de Santander': 'Cucuta Colombia',
  'Putumayo': 'Mocoa Putumayo Colombia',
  'Quindío': 'Armenia Quindio Colombia coffee',
  'Risaralda': 'Pereira Risaralda Colombia',
  'San Andrés': 'San Andres island Colombia',
  'Santander': 'Chicamocha canyon Colombia',
  'Sucre': 'Sincelejo Sucre Colombia',
  'Tolima': 'Ibague Tolima Colombia',
  'Valle del Cauca': 'Cali Colombia skyline',
  'Vaupés': 'Mitu Vaupes Colombia',
  'Vichada': 'Puerto Carreno Colombia'
};

const US_QUERIES = {
  'Texas': 'Austin Texas skyline',
  'California': 'Golden Gate Bridge San Francisco',
  'Florida': 'Miami beach Florida',
  'New York': 'Manhattan New York skyline',
  'Illinois': 'Chicago skyline',
  'Nevada': 'Las Vegas strip',
  'Arizona': 'Grand Canyon Arizona',
  'Colorado': 'Denver Colorado skyline',
  'Washington': 'Seattle skyline',
  'Georgia': 'Atlanta skyline'
};

const ES_QUERIES = {
  'Madrid': 'Madrid Spain skyline',
  'Cataluña': 'Barcelona Sagrada Familia',
  'Andalucía': 'Alhambra Granada Spain',
  'Valencia': 'City of Arts Sciences Valencia',
  'Galicia': 'Santiago de Compostela cathedral',
  'País Vasco': 'Guggenheim Bilbao'
};

const PE_QUERIES = { 'Lima': 'Lima Peru skyline', 'Arequipa': 'Arequipa Peru', 'Cusco': 'Machu Picchu Peru', 'La Libertad': 'Trujillo Peru' };
const CL_QUERIES = { 'Santiago': 'Santiago Chile skyline', 'Valparaíso': 'Valparaiso Chile', 'Biobío': 'Concepcion Chile', 'Antofagasta': 'Antofagasta Chile' };
const AR_QUERIES = { 'Buenos Aires': 'Buenos Aires Puerto Madero', 'Córdoba': 'Cordoba Argentina', 'Santa Fe': 'Rosario Argentina', 'Mendoza': 'Mendoza Argentina vineyards' };
const BR_QUERIES = { 'São Paulo': 'Sao Paulo skyline', 'Rio de Janeiro': 'Rio de Janeiro Sugarloaf', 'Minas Gerais': 'Ouro Preto Brazil', 'Bahía': 'Salvador Bahia Brazil', 'Paraná': 'Curitiba Brazil' };
const CA_QUERIES = { 'Ontario': 'Toronto skyline', 'Quebec': 'Montreal skyline', 'British Columbia': 'Vancouver skyline', 'Alberta': 'Calgary skyline', 'Manitoba': 'Winnipeg skyline' };

const COUNTRY_QUERIES = {
  'México': 'Mexico City skyline',
  'Colombia': 'Bogota Colombia',
  'Estados Unidos': 'New York skyline',
  'España': 'Madrid Spain',
  'Canadá': 'Toronto skyline',
  'Perú': 'Machu Picchu Peru',
  'Chile': 'Santiago Chile',
  'Argentina': 'Buenos Aires',
  'Brasil': 'Rio de Janeiro'
};

const FLAG_ISO = {
  'México': 'mx', 'Estados Unidos': 'us', 'Colombia': 'co', 'Canadá': 'ca', 'España': 'es',
  'Perú': 'pe', 'Chile': 'cl', 'Argentina': 'ar', 'Brasil': 'br', 'Reino Unido': 'gb',
  'Australia': 'au', 'Francia': 'fr', 'Alemania': 'de', 'Italia': 'it', 'Portugal': 'pt',
  'Venezuela': 've', 'Ecuador': 'ec', 'Uruguay': 'uy', 'Paraguay': 'py', 'Bolivia': 'bo',
  'Panamá': 'pa', 'Costa Rica': 'cr', 'Guatemala': 'gt', 'Cuba': 'cu',
  'República Dominicana': 'do', 'Puerto Rico': 'pr'
};

async function buildStateMap(queries, subdir) {
  const out = {};
  for (const [name, query] of Object.entries(queries)) {
    const file = path.join(geoRoot, subdir, slug(name) + '.jpg');
    const rel = 'img/geo/' + subdir + '/' + slug(name) + '.jpg';
    out[name] = await fetchImage(query, file, rel);
  }
  return out;
}

async function buildCityPool(count = 40) {
  const queries = [
    'city skyline night', 'downtown street', 'urban plaza', 'modern architecture city',
    'city park aerial', 'harbor city', 'european old town', 'asian city night',
    'latin america city', 'coastal city', 'business district', 'city bridge',
    'metro cityscape', 'historic city center', 'tropical city', 'mountain city view'
  ];
  const out = [];
  const dir = path.join(geoRoot, 'ciudades');
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < count; i++) {
    const q = queries[i % queries.length] + ' ' + (i + 1);
    const file = path.join(dir, 'ciudad-' + String(i + 1).padStart(2, '0') + '.jpg');
    const rel = 'img/geo/ciudades/ciudad-' + String(i + 1).padStart(2, '0') + '.jpg';
    out.push(await fetchImage(q, file, rel));
  }
  return out;
}

async function buildFlags() {
  const map = {};
  fs.mkdirSync(flagRoot, { recursive: true });
  for (const [pais, iso] of Object.entries(FLAG_ISO)) {
    const file = path.join(flagRoot, iso + '.png');
    const rel = 'img/flags/' + iso + '.png';
    try {
      await download('https://flagcdn.com/w640/' + iso + '.png', file);
      map[pais] = rel;
      console.log('FLAG', rel);
    } catch (e) {
      try {
        await download('https://flagcdn.com/w320/' + iso + '.png', file);
        map[pais] = rel;
        console.log('FLAG w320', rel);
      } catch (e2) {
        console.warn('FLAG FAIL', iso, e2.message);
      }
    }
  }
  return map;
}

function writeImagesJs(data) {
  const out = path.join(root, 'public', 'js', 'carihub-geo-images.js');
  const body = `/**
 * Imágenes geo locales — estados, ciudades y banderas.
 * Generado por scripts/build-geo-images.mjs
 */
(function (global) {
  'use strict';

  var STATE_BY_COUNTRY = ${JSON.stringify(data.stateByCountry, null, 2)};

  var COUNTRY_FALLBACK = ${JSON.stringify(data.countryFallback, null, 2)};

  var CITY_PHOTOS = ${JSON.stringify(data.cityPhotos, null, 2)};

  var FLAG_IMAGES = ${JSON.stringify(data.flagImages, null, 2)};

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
    FLAG_IMAGES: FLAG_IMAGES
  };
})(typeof window !== 'undefined' ? window : globalThis);
`;
  fs.writeFileSync(out, body, 'utf8');
  console.log('Wrote', out);
}

async function main() {
  console.log('Building geo images (this may take a few minutes)...');
  const stateByCountry = {
    'México': await buildStateMap(MX_QUERIES, 'mx'),
    'Colombia': await buildStateMap(CO_QUERIES, 'co'),
    'Estados Unidos': await buildStateMap(US_QUERIES, 'us'),
    'España': await buildStateMap(ES_QUERIES, 'es'),
    'Perú': await buildStateMap(PE_QUERIES, 'pe'),
    'Chile': await buildStateMap(CL_QUERIES, 'cl'),
    'Argentina': await buildStateMap(AR_QUERIES, 'ar'),
    'Brasil': await buildStateMap(BR_QUERIES, 'br'),
    'Canadá': await buildStateMap(CA_QUERIES, 'ca')
  };

  const countryFallback = {};
  for (const [pais, query] of Object.entries(COUNTRY_QUERIES)) {
    const file = path.join(geoRoot, 'paises', slug(pais) + '.jpg');
    const rel = 'img/geo/paises/' + slug(pais) + '.jpg';
    countryFallback[pais] = await fetchImage(query, file, rel);
  }

  const cityPhotos = await buildCityPool(40);
  const flagImages = await buildFlags();

  writeImagesJs({ stateByCountry, countryFallback, cityPhotos, flagImages });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
