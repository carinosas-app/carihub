#!/usr/bin/env node
/**
 * Genera URLs thumb de Wikimedia Commons a partir de nombres de archivo.
 * node scripts/wiki-thumb-urls.mjs
 */
import crypto from 'crypto';

export function wikiThumb(fileName, width = 640) {
  const name = fileName.replace(/^File:/, '');
  const hash = crypto.createHash('md5').update(name).digest('hex');
  const enc = encodeURIComponent(name).replace(/%20/g, '_');
  const path = `${hash[0]}/${hash.slice(0, 2)}/${enc}`;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${width}px-${enc}`;
}

const MX = {
  'Aguascalientes': 'Barrios_Mágicos_en_Aguascalientes.jpg',
  'Baja California': 'Ensenada_Baja_California_(26234525032).jpg',
  'Baja California Sur': 'El_Arco_de_Cabo_San_Lucas.jpg',
  'Campeche': 'Baluarte_de_San_Francisco,_Campeche.jpg',
  'Chiapas': 'Cañón_del_Sumidero_en_Chiapas.jpg',
  'Chihuahua': 'Copper_Canyon_Mexico.jpg',
  'Ciudad de México': 'Angel_de_la_Independencia_2015.jpg',
  'CDMX': 'Angel_de_la_Independencia_2015.jpg',
  'Coahuila': 'Catedral_de_Saltillo.jpg',
  'Colima': 'Volcán_de_Colima_-_2013-01-05.jpg',
  'Durango': 'Catedral_Basílica_Menor_de_Nuestra_Señora_del_Sacramento,_Durango.jpg',
  'Estado de México': 'Teotihuacan-2014-11-04-02-36-22.jpg',
  'Guanajuato': 'Guanajuato_City,_Mexico.jpg',
  'Guerrero': 'Acapulco_Bay.jpg',
  'Hidalgo': 'Prismas_Basálticos,_Huasca_de_Ocampo,_Hidalgo,_México.jpg',
  'Jalisco': 'Guadalajara,_Jalisco,_Mexico_-_panoramio_(1).jpg',
  'Michoacán': 'Catedral_de_Morelia,_Michoacán,_México.jpg',
  'Morelos': 'Tepozteco,_Morelos.jpg',
  'Nayarit': 'Sayulita_Beach,_Nayarit,_Mexico.jpg',
  'Nuevo León': 'Cerro_de_la_Silla,_Monterrey,_Nuevo_León,_México.jpg',
  'Oaxaca': 'Monte_Alban_West_Side_Platform.jpg',
  'Puebla': 'Puebla_City,_Mexico.jpg',
  'Querétaro': 'Querétaro_Aqueduct.jpg',
  'Quintana Roo': 'Tulum_-_01.jpg',
  'San Luis Potosí': 'Catedral_de_San_Luis_Potosí.jpg',
  'Sinaloa': 'Mazatlán_Beach.jpg',
  'Sonora': 'Puerto_Peñasco_beach.jpg',
  'Tabasco': 'Villahermosa,_Tabasco,_México.jpg',
  'Tamaulipas': 'Playa_Miramar,_Tamaulipas.jpg',
  'Tlaxcala': 'Tlaxcala_de_Xicohténcatl,_Tlaxcala,_México.jpg',
  'Veracruz': 'Puerto_de_Veracruz,_México.jpg',
  'Yucatán': 'Chichen_Itza_3.jpg',
  'Zacatecas': 'Zacatecas_City,_Mexico.jpg'
};

const CO = {
  'Amazonas': 'Leticia,_Amazonas,_Colombia.jpg',
  'Antioquia': 'Medellín,_Colombia_skyline.jpg',
  'Arauca': 'Arauca,_Colombia.jpg',
  'Atlántico': 'Barranquilla,_Colombia.jpg',
  'Bogotá': 'Bogotá_Colombia.jpg',
  'Bolívar': 'Cartagena,_Colombia.jpg',
  'Boyacá': 'Villa_de_Leyva,_Boyacá,_Colombia.jpg',
  'Caldas': 'Manizales,_Caldas,_Colombia.jpg',
  'Caquetá': 'Florencia,_Caquetá.jpg',
  'Casanare': 'Yopal,_Casanare.jpg',
  'Cauca': 'Popayán,_Cauca,_Colombia.jpg',
  'Cesar': 'Valledupar,_Cesar.jpg',
  'Chocó': 'Bahía_Solano,_Chocó.jpg',
  'Córdoba': 'Montería,_Córdoba,_Colombia.jpg',
  'Cundinamarca': 'Catedral_de_Sal,_Zipaquirá,_Colombia.jpg',
  'Guainía': 'Puerto_Inírida.jpg',
  'Guaviare': 'San_José_del_Guaviare.jpg',
  'Huila': 'Neiva,_Huila.jpg',
  'La Guajira': 'Cabo_de_la_Vela,_La_Guajira.jpg',
  'Magdalena': 'Santa_Marta,_Magdalena.jpg',
  'Meta': 'Villavicencio,_Meta.jpg',
  'Nariño': 'Pasto,_Nariño.jpg',
  'Norte de Santander': 'Cúcuta,_Norte_de_Santander.jpg',
  'Putumayo': 'Mocoa,_Putumayo.jpg',
  'Quindío': 'Armenia,_Quindío.jpg',
  'Risaralda': 'Pereira,_Risaralda.jpg',
  'San Andrés': 'San_Andrés_Island.jpg',
  'Santander': 'Cañón_del_Chicamocha.jpg',
  'Sucre': 'Sincelejo,_Sucre.jpg',
  'Tolima': 'Ibagué,_Tolima.jpg',
  'Valle del Cauca': 'Cali,_Valle_del_Cauca,_Colombia.jpg',
  'Vaupés': 'Mitú,_Vaupés.jpg',
  'Vichada': 'Puerto_Carreño.jpg'
};

const PE = {
  'Lima': 'Lima,_Peru_-_skyline.jpg',
  'Arequipa': 'Arequipa,_Peru.jpg',
  'Cusco': 'Machu_Picchu,_Peru.jpg',
  'La Libertad': 'Trujillo,_Peru.jpg'
};

const CL = {
  'Santiago': 'Santiago,_Chile_-_skyline.jpg',
  'Valparaíso': 'Valparaíso,_Chile.jpg',
  'Biobío': 'Concepción,_Chile.jpg',
  'Antofagasta': 'Antofagasta,_Chile.jpg'
};

const AR = {
  'Buenos Aires': 'Buenos_Aires_-_Puerto_Madero.jpg',
  'Córdoba': 'Córdoba,_Argentina.jpg',
  'Santa Fe': 'Rosario,_Santa_Fe.jpg',
  'Mendoza': 'Mendoza,_Argentina.jpg'
};

const BR = {
  'São Paulo': 'São_Paulo_skyline.jpg',
  'Rio de Janeiro': 'Rio_de_Janeiro_from_Sugarloaf.jpg',
  'Minas Gerais': 'Ouro_Preto,_Minas_Gerais.jpg',
  'Bahía': 'Salvador,_Bahia.jpg',
  'Paraná': 'Curitiba,_Paraná.jpg'
};

const CA = {
  'Ontario': 'Toronto_skyline_from_the_islands.jpg',
  'Quebec': 'Montreal_skyline.jpg',
  'British Columbia': 'Vancouver_skyline.jpg',
  'Alberta': 'Calgary_skyline.jpg',
  'Manitoba': 'Winnipeg_skyline.jpg'
};

const US = {
  'Texas': 'Austin,_Texas_skyline_2019.jpg',
  'California': 'Golden_Gate_Bridge,_San_Francisco.jpg',
  'Florida': 'Miami_Beach,_Florida.jpg',
  'New York': 'Manhattan,_New_York_City,_USA.jpg',
  'Illinois': 'Chicago_skyline_from_Lake_Michigan.jpg',
  'Nevada': 'Las_Vegas_Strip.jpg',
  'Arizona': 'Grand_Canyon_view_from_Pima_Point_2010.jpg',
  'Colorado': 'Denver_skyline.jpg',
  'Washington': 'Seattle_skyline_from_Kerry_Park.jpg',
  'Georgia': 'Atlanta_skyline.jpg'
};

const ES = {
  'Madrid': 'Madrid_-_panoramio_(70).jpg',
  'Cataluña': 'Barcelona_skyline.jpg',
  'Andalucía': 'Alhambra,_Granada,_Spain.jpg',
  'Valencia': 'Ciudad_de_las_Artes_y_las_Ciencias,_Valencia,_Spain.jpg',
  'Galicia': 'Santiago_de_Compostela_Cathedral.jpg',
  'País Vasco': 'Guggenheim_Museum_Bilbao.jpg'
};

function mapUrls(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[k] = wikiThumb(v);
  return out;
}

const manifest = {
  mx_states: mapUrls(MX),
  co_states: mapUrls(CO),
  us_states: mapUrls(US),
  es_states: mapUrls(ES),
  pe_states: mapUrls(PE),
  cl_states: mapUrls(CL),
  ar_states: mapUrls(AR),
  br_states: mapUrls(BR),
  ca_states: mapUrls(CA),
  country_fallback: {
    'México': wikiThumb('Angel_de_la_Independencia_2015.jpg'),
    'Colombia': wikiThumb('Bogotá_Colombia.jpg'),
    'Estados Unidos': wikiThumb('Manhattan,_New_York_City,_USA.jpg'),
    'España': wikiThumb('Madrid_-_panoramio_(70).jpg'),
    'Canadá': wikiThumb('Toronto_skyline_from_the_islands.jpg'),
    'Perú': wikiThumb('Machu_Picchu,_Peru.jpg'),
    'Chile': wikiThumb('Santiago,_Chile_-_skyline.jpg'),
    'Argentina': wikiThumb('Buenos_Aires_-_Puerto_Madero.jpg'),
    'Brasil': wikiThumb('Rio_de_Janeiro_from_Sugarloaf.jpg')
  },
  city_photos: [
    'https://images.unsplash.com/photo-1477959856237-14f8425862d8?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599571200750-856268fd664b?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1467269206134-0da4c2a0d36b?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587330979470-3585a3f6a0d8?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552465011-b0e7d7558ea4?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570077188670-e3a8d45ac5b3?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582407947306-fb86f028e40d?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598301256632-934a237f2b7a?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609137144813-7d5932499b9a?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605844554087-3ffb07abd5b8?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611273629569-6fe093accced?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613395877614-349c1c4a0b0e?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609137144813-7d5932499b9a?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605844554087-3ffb07abd5b8?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611273629569-6fe093accced?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613395877614-349c1c4a0b0e?w=640&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=640&q=85&auto=format&fit=crop'
  ]
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
fs.writeFileSync(path.join(__dirname, 'geo-image-manifest.json'), JSON.stringify(manifest, null, 2));

function writeImagesJs(data) {
  const out = path.join(__dirname, '..', 'public', 'js', 'carihub-geo-images.js');
  const body = `/**
 * Imágenes geo — estados por país y pool de ciudades (fotos reales).
 * Generado por scripts/wiki-thumb-urls.mjs
 */
(function (global) {
  'use strict';

  var STATE_BY_COUNTRY = ${JSON.stringify(data.stateByCountry, null, 2)};

  var COUNTRY_FALLBACK = ${JSON.stringify(data.countryFallback, null, 2)};

  var CITY_PHOTOS = ${JSON.stringify(data.cityPhotos, null, 2)};

  var STATE_ALIASES = { 'CDMX': 'Ciudad de México' };

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

writeImagesJs({
  stateByCountry: {
    'México': manifest.mx_states,
    'Colombia': manifest.co_states,
    'Estados Unidos': manifest.us_states,
    'España': manifest.es_states,
    'Perú': manifest.pe_states,
    'Chile': manifest.cl_states,
    'Argentina': manifest.ar_states,
    'Brasil': manifest.br_states,
    'Canadá': manifest.ca_states
  },
  countryFallback: manifest.country_fallback,
  cityPhotos: manifest.city_photos
});

console.log('Nuevo León URL:', manifest.mx_states['Nuevo León']);
console.log('Wrote geo-image-manifest.json');
