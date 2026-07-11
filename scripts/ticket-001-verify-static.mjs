/**
 * TICKET-001 — verificación estática init Firebase único (sin modificar public/).
 * Uso: node scripts/ticket-001-verify-static.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const PUBLIC = join(process.cwd(), 'public');
const IGNORE = new Set(['index-legacy.html']);

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules') continue;
      walkHtml(p, out);
    } else if (extname(name) === '.html') out.push(p);
  }
  return out;
}

const htmlFiles = walkHtml(PUBLIC);
const dupInit = [];
const missingCore = [];

for (const file of htmlFiles) {
  const rel = file.replace(PUBLIC + '\\', '').replace(PUBLIC + '/', '');
  if (IGNORE.has(rel.split(/[/\\]/).pop())) continue;
  const src = readFileSync(file, 'utf8');
  const hasConfig = /firebaseConfig\s*=/.test(src) || /initializeApp\s*\(/.test(src.replace(/CariHubCore/g, ''));
  const usesCore = /carihub-core\.js/.test(src);
  if (hasConfig && !/index-legacy/.test(rel)) {
    dupInit.push(rel);
  }
  if (/dashboard-rentero|registro-perfil|index\.html|resultados|perfil-publico|admin/.test(rel) && !usesCore) {
    missingCore.push(rel);
  }
}

console.log('--- TICKET-001 verificación estática ---');
console.log('HTML activos revisados:', htmlFiles.length - IGNORE.size);
if (dupInit.length) {
  console.error('FAIL: initializeApp/firebaseConfig inline:', dupInit);
  process.exit(1);
}
console.log('OK: 0 firebaseConfig/initializeApp inline en HTML activos (excl. legacy)');

if (missingCore.length) {
  console.warn('WARN: páginas críticas sin carihub-core.js:', missingCore);
} else {
  console.log('OK: páginas críticas cargan carihub-core.js');
}

const coreSrc = readFileSync(join(PUBLIC, 'js/carihub-core.js'), 'utf8');
const appCheckSrc = readFileSync(join(PUBLIC, 'js/carihub-app-check.js'), 'utf8');
const exportsOk = ['initFirebase', 'requireAuth', 'onAuthStateChanged', 'assertReady'].every(
  (fn) => coreSrc.includes(fn)
);
if (!exportsOk) {
  console.error('FAIL: carihub-core.js incompleto');
  process.exit(1);
}
console.log('OK: carihub-core.js exporta API requerida');

if (!/CariHubAppCheck\.initAppCheck/.test(coreSrc)) {
  console.error('FAIL: carihub-core.js no integra App Check fail-open');
  process.exit(1);
}
console.log('OK: carihub-core.js integra App Check (fail-open)');

if (!/enabled:\s*false/.test(appCheckSrc) || !/mode:\s*'off'/.test(appCheckSrc)) {
  console.error('FAIL: carihub-app-check.js sin defaults seguros off/false');
  process.exit(1);
}
console.log('OK: carihub-app-check.js defaults off/false');

const criticalPages = [
  'index.html',
  'registro-perfil.html',
  'resultados.html',
  'perfil-publico.html',
  'admin.html',
  'dashboard-rentero.html',
];
for (const page of criticalPages) {
  const src = readFileSync(join(PUBLIC, page), 'utf8');
  if (!/carihub-app-check\.js/.test(src)) {
    console.error('FAIL: falta carihub-app-check.js en', page);
    process.exit(1);
  }
}
console.log('OK: páginas críticas cargan carihub-app-check.js antes de core');

const turnstileSrc = readFileSync(join(PUBLIC, 'js/carihub-turnstile.js'), 'utf8');
if (!/enabled:\s*false/.test(turnstileSrc) || !/mode:\s*'off'/.test(turnstileSrc)) {
  console.error('FAIL: carihub-turnstile.js sin defaults seguros off/false');
  process.exit(1);
}
if (!/login:\s*false/.test(turnstileSrc) || !/registration:\s*false/.test(turnstileSrc)) {
  console.error('FAIL: carihub-turnstile.js surfaces no están en false por defecto');
  process.exit(1);
}
console.log('OK: carihub-turnstile.js defaults off/false');

const authTurnstilePages = ['index.html', 'registro-perfil.html'];
for (const page of authTurnstilePages) {
  const src = readFileSync(join(PUBLIC, page), 'utf8');
  if (!/carihub-turnstile\.js/.test(src)) {
    console.error('FAIL: falta carihub-turnstile.js en', page);
    process.exit(1);
  }
  const turnstileIdx = src.indexOf('carihub-turnstile.js');
  const coreIdx = src.indexOf('carihub-core.js');
  if (turnstileIdx < 0 || coreIdx < 0 || turnstileIdx >= coreIdx) {
    console.error('FAIL: orden turnstile/core incorrecto en', page);
    process.exit(1);
  }
}
console.log('OK: páginas auth cargan carihub-turnstile.js antes de core');

const functionsIndex = readFileSync(join(process.cwd(), 'functions/index.js'), 'utf8');
if (!/exports\.verifyTurnstile/.test(functionsIndex)) {
  console.error('FAIL: functions/index.js no exporta verifyTurnstile');
  process.exit(1);
}
console.log('OK: functions exporta verifyTurnstile (scaffold)');

process.exit(0);
