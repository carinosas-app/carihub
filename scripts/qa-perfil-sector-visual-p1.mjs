/**
 * QA P1-2 — tema visual por sector (resultados + perfil pintura temprana P1-1).
 * node scripts/qa-perfil-sector-visual-p1.mjs
 * QA_BASE=http://127.0.0.1:8782 node scripts/qa-perfil-sector-visual-p1.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(__dirname, '..');
const shotsDir = path.join(repo, 'agent-tools', 'p1-qa-shots');
const base = process.env.QA_BASE || 'http://127.0.0.1:8782';

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function enc(v) {
  return encodeURIComponent(v);
}

async function readTheme(page) {
  return page.evaluate(() => {
    const body = document.body;
    const cs = getComputedStyle(body);
    return {
      sector: body.getAttribute('data-sector'),
      subtema: body.getAttribute('data-subtema'),
      sheenMounted: body.dataset.carihubPageSheen === '1',
      sheenLayer: !!document.querySelector('.carihub-page-sheen'),
      resAccent: cs.getPropertyValue('--res-accent').trim(),
      acc: cs.getPropertyValue('--acc').trim(),
      bg: cs.backgroundImage || cs.backgroundColor,
      hasWrap: !!document.getElementById('wrap') && document.getElementById('wrap').innerHTML.length > 50,
      sectorBanners: document.querySelectorAll('[data-perfil-sector-banner="1"]').length,
      cards: document.querySelectorAll('.pcard.res-card, .res-card').length
    };
  });
}

function isBenignConsole(msg) {
  const t = typeof msg === 'string'
    ? msg
    : (typeof msg?.text === 'function' ? msg.text() : String(msg || ''));
  return /firebase|Firestore|net::ERR|Failed to load resource|404|CariHubResultadosRegistrados/i.test(t);
}

async function runResultados(browser, spec) {
  const url = `${base}/resultados.html?categoria=${enc(spec.cat)}&vista=con-resultados&preview=1&pais=M%C3%A9xico&estado=Nuevo%20Le%C3%B3n&ciudad=Monterrey`;
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if ((msg.type() === 'error' || msg.type() === 'warning') && !isBenignConsole(msg)) {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => errors.push(String(err.message || err)));

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1200);
  const theme = await readTheme(page);

  const label = `res/${spec.label}`;
  ok(`${label} data-sector`, theme.sector === spec.sector, `got=${theme.sector}`);
  if (spec.subtema) {
    ok(`${label} data-subtema`, theme.subtema === spec.subtema, `got=${theme.subtema}`);
  }
  ok(`${label} sheen`, theme.sheenMounted === !!spec.sheen, `mounted=${theme.sheenMounted}`);
  if (spec.accent) {
    ok(`${label} --res-accent`, theme.resAccent === spec.accent, `got=${theme.resAccent}`);
  }
  if (spec.minCards != null) {
    ok(`${label} tarjetas`, theme.cards >= spec.minCards, `cards=${theme.cards}`);
  }
  ok(`${label} sin errores JS`, errors.length === 0, errors.slice(0, 2).join(' | '));

  fs.mkdirSync(shotsDir, { recursive: true });
  await page.screenshot({ path: path.join(shotsDir, `res-${spec.label}.png`) });
  await page.close();
}

async function runPerfil(browser, spec) {
  const url = `${base}/perfil-publico.html?categoria=${enc(spec.cat)}&from=resultados&pais=M%C3%A9xico&estado=Nuevo%20Le%C3%B3n&ciudad=Monterrey`;
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if ((msg.type() === 'error' || msg.type() === 'warning') && !isBenignConsole(msg)) {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => errors.push(String(err.message || err)));

  let earlySector = null;
  page.on('domcontentloaded', async () => {
    try {
      earlySector = await page.evaluate(() => document.body.getAttribute('data-sector'));
    } catch (e) { /* ignore */ }
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const themeEarly = await readTheme(page);
  const early = earlySector || themeEarly.sector;

  const label = `perfil/${spec.label}`;
  ok(`${label} pintura temprana sector`, early === spec.sector, `early=${early}`);

  await page.waitForTimeout(2000);
  const theme = await readTheme(page);

  ok(`${label} data-sector final`, theme.sector === spec.sector, `got=${theme.sector}`);
  if (spec.accent) {
    ok(`${label} --res-accent`, theme.resAccent === spec.accent, `got=${theme.resAccent}`);
    ok(`${label} --acc puente`, theme.acc === spec.accent, `got=${theme.acc}`);
  }
  if (spec.sheen != null) {
    ok(`${label} sheen`, theme.sheenMounted === !!spec.sheen, `mounted=${theme.sheenMounted}`);
  }
  ok(`${label} contenido render`, theme.hasWrap, 'wrap vacío');
  if (spec.sectorBanners != null) {
    ok(`${label} banners sector`, theme.sectorBanners >= spec.sectorBanners, `banners=${theme.sectorBanners}`);
  }
  ok(`${label} sin errores JS`, errors.length === 0, errors.slice(0, 2).join(' | '));

  fs.mkdirSync(shotsDir, { recursive: true });
  await page.screenshot({ path: path.join(shotsDir, `perfil-${spec.label}.png`) });
  await page.close();
}

// Estático — cable P1-1
const perfilHtml = fs.readFileSync(path.join(repo, 'public', 'perfil-publico.html'), 'utf8');
ok('HTML pinturaTemprana cableada', /pinturaTempranaDesdeQuery/.test(perfilHtml), 'perfil-publico.html');
ok('HTML sin heurística duplicada', !/k\.indexOf\('restaur'\)/.test(perfilHtml), 'inline heuristic removed');

const RESULTADOS = [
  { label: 'adultos', cat: 'Cariñosas', sector: 'adultos', sheen: true, accent: '#e91e63', minCards: 1 },
  { label: 'salud', cat: 'doctor general', sector: 'salud', sheen: false, accent: '#1976d2', minCards: 1 },
  { label: 'restaurantes', cat: 'Restaurantes Tradicional', sector: 'restaurantes', sheen: false, accent: '#f4511e', minCards: 1 },
  { label: 'bienestar', cat: 'centros-de-yoga', sector: 'bienestar', sheen: false, accent: '#7cb342', minCards: 1 },
  { label: 'automotriz', cat: 'mecanico', sector: 'automotriz', sheen: false, accent: '#1976d2', minCards: 1 },
  { label: 'mascotas', cat: 'veterinaria', sector: 'mascotas', sheen: false, accent: '#43a047', minCards: 1 },
  { label: 'profesionales', cat: 'abogados', sector: 'profesionales', sheen: false, accent: '#37474f', minCards: 0 },
  { label: 'hogar', cat: 'plomeros', sector: 'hogar', sheen: false, accent: '#e64a19', minCards: 0 },
  { label: 'comercio', cat: 'abarrotes', sector: 'comercio', sheen: false, accent: '#00897b', minCards: 0 },
  { label: 'eventos', cat: 'espacios-para-eventos', sector: 'eventos', sheen: false, accent: '#ff8f00', minCards: 0 },
  { label: 'educacion', cat: 'maestro-particular', sector: 'educacion', sheen: false, accent: '#5c6bc0', minCards: 0 },
  { label: 'tecnologia', cat: 'programador', sector: 'tecnologia', sheen: false, accent: '#3949ab', minCards: 0 },
  { label: 'transporte', cat: 'chofer-privado', sector: 'transporte', sheen: false, accent: '#0288d1', minCards: 0 },
  { label: 'industria', cat: 'consultor-empresarial-independiente', sector: 'industria', sheen: false, accent: '#455a64', minCards: 0 },
  { label: 'bienes-raices', cat: 'agente-inmobiliario-independiente', sector: 'bienes-raices', sheen: false, accent: '#6d4c41', minCards: 0 },
  { label: 'lgbt', cat: 'escort gay', sector: 'adultos', subtema: 'lgbt', sheen: false, minCards: 1 }
];

const PERFIL = [
  { label: 'salud', cat: 'doctor general', sector: 'salud', accent: '#1976d2', sheen: false, sectorBanners: 1 },
  { label: 'restaurantes', cat: 'Restaurantes Tradicional', sector: 'restaurantes', accent: '#f4511e', sheen: false, sectorBanners: 1 },
  { label: 'profesionales', cat: 'abogados', sector: 'profesionales', accent: '#37474f', sheen: false, sectorBanners: 1 },
  { label: 'bienestar', cat: 'centros-de-yoga', sector: 'bienestar', accent: '#7cb342', sheen: false, sectorBanners: 1 },
  { label: 'adultos', cat: 'Cariñosas', sector: 'adultos', sheen: true, sectorBanners: 0 }
];

let browser;
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  for (const spec of RESULTADOS) await runResultados(browser, spec);
  for (const spec of PERFIL) await runPerfil(browser, spec);
} catch (err) {
  ok('playwright disponible', false, String(err.message || err));
} finally {
  if (browser) await browser.close();
}

console.log('\n=== QA P1-2 — sector visual resultados + perfil ===\n');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? `— ${p.detail}` : ''));
if (fail.length) {
  console.log('\nFAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  console.log(`\nCapturas: ${shotsDir}\n`);
  process.exit(1);
}
console.log(`\nTodos los checks pasaron (${pass.length})`);
console.log(`Capturas: ${shotsDir}\n`);
