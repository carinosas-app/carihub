#!/usr/bin/env node
/**
 * Genera catálogos estado → ciudades para LATAM (JSON lazy-load).
 * Fuente: country-state-city (datos administrativos públicos).
 * Uso: npm run build:geo-catalogs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { State, City } from 'country-state-city';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'js', 'geo', 'catalogs');

const TARGETS = [
  { pais: 'Uruguay', iso: 'UY', slug: 'uy' },
  { pais: 'Chile', iso: 'CL', slug: 'cl' },
  { pais: 'Colombia', iso: 'CO', slug: 'co' },
  { pais: 'Perú', iso: 'PE', slug: 'pe' },
  { pais: 'Argentina', iso: 'AR', slug: 'ar' },
  { pais: 'Brasil', iso: 'BR', slug: 'br' }
];

function cleanStateName(iso, name) {
  if (iso === 'UY') return name.replace(/\s+Department$/i, '');
  return name;
}

function buildCatalog(iso) {
  const catalog = Object.create(null);
  const states = State.getStatesOfCountry(iso) || [];
  states.forEach(function (st) {
    const stateName = cleanStateName(iso, st.name);
    const cities = (City.getCitiesOfState(iso, st.isoCode) || [])
      .map(function (c) { return c.name; })
      .filter(Boolean)
      .sort(function (a, b) { return String(a).localeCompare(String(b), 'es'); });
    catalog[stateName] = cities;
  });
  return catalog;
}

fs.mkdirSync(outDir, { recursive: true });

let summary = [];
for (const t of TARGETS) {
  const catalog = buildCatalog(t.iso);
  const states = Object.keys(catalog).length;
  let cities = 0;
  Object.keys(catalog).forEach(function (k) { cities += catalog[k].length; });
  const outPath = path.join(outDir, t.slug + '.json');
  fs.writeFileSync(outPath, JSON.stringify(catalog));
  const bytes = fs.statSync(outPath).size;
  summary.push({ pais: t.pais, slug: t.slug, states, cities, bytes });
  console.log('OK', t.slug + '.json', states, 'estados', cities, 'ciudades', bytes, 'bytes');
}

console.log('\nResumen:', JSON.stringify(summary, null, 2));
