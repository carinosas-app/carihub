#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const altAssets = 'C:/Users/ilser/.cursor/projects/c-Users-ilser-carihub/assets';
const assetDir = fs.existsSync(altAssets) ? altAssets : path.join(root, '..', '.cursor', 'projects', 'c-Users-ilser-carihub', 'assets');
const geoMx = path.join(root, 'public', 'img', 'geo', 'mx');
const geoCiudades = path.join(root, 'public', 'img', 'geo', 'ciudades');
const flagsDir = path.join(root, 'public', 'img', 'flags');
const imgHome = path.join(root, 'public', 'img', 'home');

fs.mkdirSync(geoMx, { recursive: true });
fs.mkdirSync(geoCiudades, { recursive: true });
fs.mkdirSync(flagsDir, { recursive: true });

function copy(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn('missing', src);
    return false;
  }
  fs.copyFileSync(src, dest);
  console.log('copied', path.basename(dest));
  return true;
}

const generatedStates = {
  'nuevo-leon': 'nuevo-leon.jpg',
  'ciudad-de-mexico': 'ciudad-de-mexico.jpg',
  'cdmx': 'ciudad-de-mexico.jpg',
  'quintana-roo': 'quintana-roo.jpg',
  'jalisco': 'jalisco.jpg',
  'chihuahua': 'chihuahua.jpg',
  'guanajuato': 'guanajuato.jpg',
  'yucatan': 'yucatan.jpg',
  'baja-california-sur': 'baja-california-sur.jpg',
  'oaxaca': 'oaxaca.jpg',
  'chiapas': 'chiapas.jpg',
  'estado-de-mexico': 'estado-de-mexico.jpg',
  'guerrero': 'guerrero.jpg',
  'puebla': 'puebla.jpg',
  'baja-california': 'estado-baja-california.jpg',
  'coahuila': 'estado-coahuila.jpg',
  'durango': 'estado-durango.jpg',
  'hidalgo': 'estado-hidalgo.jpg',
  'queretaro': 'estado-queretaro.jpg',
  'sinaloa': 'estado-sinaloa.jpg',
  'sonora': 'estado-sonora.jpg',
  'tabasco': 'estado-tabasco.jpg',
  'tamaulipas': 'estado-tamaulipas.jpg',
  'veracruz': 'estado-veracruz.jpg',
  'michoacan': 'estado-michoacan.jpg',
  'morelos': 'estado-morelos.jpg',
  'nayarit': 'estado-nayarit.jpg'
};

for (const [slug, file] of Object.entries(generatedStates)) {
  copy(path.join(assetDir, file), path.join(geoMx, slug + '.jpg'));
}

/** Solo imágenes diurnas / urbanas neutras — sin adultos ni banners */
const safeLocal = {
  'aguascalientes': 'hero-calle-negocios-dia.png',
  'campeche': 'hero-calle-negocios-dia.png',
  'colima': 'negocios-grid.jpg',
  'san-luis-potosi': 'hero-calle-negocios-dia.png',
  'tlaxcala': 'negocios-grid.jpg',
  'zacatecas': 'hero-calle-negocios-dia.png'
};

for (const [slug, rel] of Object.entries(safeLocal)) {
  copy(path.join(imgHome, rel), path.join(geoMx, slug + '.jpg'));
}

copy(path.join(assetDir, 'mexico-flag.png'), path.join(flagsDir, 'mx.png'));

const cityOverrides = {
  'ciudad-guadalupe.jpg': 'ciudad-guadalupe.jpg',
  'ciudad-garcia.jpg': 'ciudad-garcia.jpg',
  'ciudad-apodaca.jpg': 'ciudad-apodaca.jpg',
  'ciudad-santa-catarina.jpg': 'ciudad-santa-catarina.jpg'
};

for (const file of Object.values(cityOverrides)) {
  copy(path.join(assetDir, file), path.join(geoCiudades, file));
}

const plazaPool = [
  'ciudad-plaza-01.jpg',
  'ciudad-plaza-02.jpg',
  'ciudad-plaza-03.jpg',
  'ciudad-plaza-04.jpg',
  'ciudad-plaza-05.jpg'
];

for (const file of plazaPool) {
  copy(path.join(assetDir, file), path.join(geoCiudades, file));
}

for (let i = 0; i < 40; i++) {
  const n = String(i + 1).padStart(2, '0');
  const dest = path.join(geoCiudades, 'ciudad-' + n + '.jpg');
  const srcFile = plazaPool[i % plazaPool.length];
  const src = path.join(geoCiudades, srcFile);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('pool', 'ciudad-' + n + '.jpg', '<-', srcFile);
  }
}
