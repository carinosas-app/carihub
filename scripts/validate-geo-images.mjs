#!/usr/bin/env node
/** Valida URLs del manifest geo y reporta fallos */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'geo-image-manifest.json'), 'utf8'));

async function check(url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'CariHub-GeoValidator/1.0' },
      redirect: 'follow'
    });
    if (res.status === 405 || res.status === 403) {
      const g = await fetch(url, { headers: { 'User-Agent': 'CariHub-GeoValidator/1.0' } });
      return g.status;
    }
    return res.status;
  } catch (e) {
    return 'ERR:' + e.message;
  }
}

async function section(name, obj) {
  let ok = 0, fail = 0;
  for (const [k, url] of Object.entries(obj)) {
    const st = await check(url);
    if (st === 200) { ok++; }
    else { fail++; console.log(`FAIL [${name}] ${k}: ${st}`); }
  }
  console.log(`${name}: ${ok} ok, ${fail} fail`);
}

(async () => {
  await section('mx', manifest.mx_states);
  await section('co', manifest.co_states);
  await section('us', manifest.us_states);
  let cf = 0;
  for (const [k, url] of Object.entries(manifest.country_fallback)) {
    const st = await check(url);
    if (st !== 200) { cf++; console.log(`FAIL country ${k}: ${st}`); }
  }
  let cc = 0;
  for (let i = 0; i < manifest.city_photos.length; i++) {
    const st = await check(manifest.city_photos[i]);
    if (st !== 200) { cc++; console.log(`FAIL city ${i + 1}: ${st}`); }
  }
  console.log(`cities: ${manifest.city_photos.length - cc} ok, ${cc} fail`);
})();
