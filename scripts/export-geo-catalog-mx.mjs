#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'public/js/mexico-estados-municipios.js');
const outDir = path.join(root, 'public/js/geo/catalogs');
const outPath = path.join(outDir, 'mx.json');

const src = fs.readFileSync(srcPath, 'utf8');
const sandbox = { window: {}, globalThis: {} };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

vm.runInNewContext(src, sandbox, { filename: 'mexico-estados-municipios.js' });

const data = sandbox.MEXICO_ESTADOS_MUNICIPIOS || sandbox.window.MEXICO_ESTADOS_MUNICIPIOS;
if (!data) {
  console.error('No se encontró MEXICO_ESTADOS_MUNICIPIOS');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(data));
const bytes = fs.statSync(outPath).size;
console.log('OK', outPath, Object.keys(data).length, 'estados', bytes, 'bytes');
