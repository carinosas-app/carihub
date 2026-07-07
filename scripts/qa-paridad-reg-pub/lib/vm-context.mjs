import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.join(__dirname, '..', '..', '..');
export const JS_ROOT = path.join(REPO, 'public', 'js');
export const PUBLIC_ROOT = path.join(REPO, 'public');

export function makeCtx() {
  const ctx = {
    console,
    document: {
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => ({ style: {}, appendChild: () => {} }),
    },
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    Blob: function Blob() {},
    Date,
    Math,
    JSON,
    Object,
    Array,
    String,
    Number,
    Boolean,
    RegExp,
    Promise,
    Error,
    parseInt,
    parseFloat,
    setTimeout,
    clearTimeout,
    URLSearchParams: globalThis.URLSearchParams,
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

export function loadScript(ctx, rel) {
  const file = path.join(JS_ROOT, rel.replace(/^js\//, ''));
  if (!fs.existsSync(file)) {
    throw new Error(`Script no encontrado: ${rel} (${file})`);
  }
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: rel });
}

/** Orden de scripts en registro-perfil.html (sin query strings). */
export function loadRegistroBlocksStack(ctx) {
  const html = fs.readFileSync(path.join(PUBLIC_ROOT, 'registro-perfil.html'), 'utf8');
  const rels = [];
  const re = /src="js\/([^"?]+\.js)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    rels.push(m[1]);
  }
  const needed = rels.filter((r) =>
    r.startsWith('data/registro-') ||
    r === 'carihub-viajes-desplazamiento.js' ||
    r === 'carihub-registro-public-blocks.js' ||
    r === 'data/registro-schema-index.js' ||
    r === 'data/registro-sector-contract-registry.js' ||
    r === 'carihub-field-engine-lite.js'
  );
  for (const rel of needed) {
    loadScript(ctx, rel);
  }
  return needed;
}
