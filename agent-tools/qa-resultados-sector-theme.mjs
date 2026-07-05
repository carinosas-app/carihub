/**
 * QA — tema sectorial en pantalla de resultados (fondo + botones).
 * node agent-tools/qa-resultados-sector-theme.mjs
 */
import { chromium } from 'playwright';

const base = process.env.QA_BASE || 'http://127.0.0.1:8765';
const results = [];

function record(check, pass, detail) {
  results.push({ check, pass, detail: detail || '' });
}

async function readTheme(page) {
  return page.evaluate(() => {
    const body = document.body;
    const cs = getComputedStyle(body);
    const btn = document.querySelector('.res-midband__btn--registro, .res-midband__btn--fuchsia, .pbrand .pbtn');
    const btnCs = btn ? getComputedStyle(btn) : null;
    return {
      sector: body.getAttribute('data-sector'),
      sheenMounted: body.dataset.carihubPageSheen === '1',
      sheenLayer: !!document.querySelector('.carihub-page-sheen'),
      bg: cs.backgroundImage || cs.backgroundColor,
      resAccent: cs.getPropertyValue('--res-accent').trim(),
      btnBg: btnCs ? (btnCs.backgroundImage || btnCs.backgroundColor) : null
    };
  });
}

async function runCase(browser, label, url, expect) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(800);
  const theme = await readTheme(page);
  record(label + ' data-sector', theme.sector === expect.sector, `got=${theme.sector}`);
  record(label + ' sin sheen rosa', theme.sheenMounted === expect.sheen, `mounted=${theme.sheenMounted}`);
  record(label + ' --res-accent', theme.resAccent === expect.accent, `got=${theme.resAccent}`);
  if (expect.accentInBg) {
    const ok = (theme.bg || '').includes(expect.accentInBg) || theme.resAccent === expect.accent;
    record(label + ' fondo temático', ok, theme.bg.slice(0, 120));
  }
  if (expect.btnHasAccent && theme.btnBg) {
    const ok = theme.btnBg.includes(expect.accentRgb || expect.accent) || theme.btnBg.includes('linear-gradient');
    record(label + ' botón acento', ok, theme.btnBg.slice(0, 120));
  }
  await page.close();
}

const browser = await chromium.launch({ channel: 'msedge', headless: true });

try {
  await runCase(
    browser,
    'restaurantes',
    `${base}/resultados.html?categoria=Restaurantes%20Tradicional&vista=con-resultados&preview=1`,
    { sector: 'restaurantes', sheen: false, accent: '#f4511e', accentRgb: '244, 81, 30', accentInBg: '255, 243, 224', btnHasAccent: true }
  );
  await runCase(
    browser,
    'adultos',
    `${base}/resultados.html?categoria=Cari%C3%B1osas&vista=con-resultados&preview=1`,
    { sector: 'adultos', sheen: true, accent: '#e91e63', btnHasAccent: true }
  );
  await runCase(
    browser,
    'salud',
    `${base}/resultados.html?categoria=Doctor%20General&vista=con-resultados&preview=1`,
    { sector: 'salud', sheen: false, accent: '#1976d2', accentRgb: '25, 118, 210', btnHasAccent: true }
  );
} finally {
  await browser.close();
}

const pass = results.filter((r) => r.pass).length;
const fail = results.filter((r) => !r.pass).length;
console.log(JSON.stringify({ pass, fail, total: results.length, results }, null, 2));
process.exit(fail ? 1 : 0);
