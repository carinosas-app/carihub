/**
 * Smoke post-push — Geo F1 + Placeholders Estado/Live
 * Run: node scripts/qa-post-push-smoke.mjs
 * Requires: npx serve public -l 3457
 */
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3457';
const errs = [];

function track(page) {
  page.on('pageerror', (e) => errs.push('pageerror:' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push('console:' + m.text());
  });
}

async function dismissAntibot(page) {
  await page.evaluate(() => {
    const m = document.getElementById('modalAntiBot');
    if (m) {
      m.style.display = 'none';
      m.classList.remove('is-open');
    }
  });
}

async function smokeHomeGeo(page) {
  await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => typeof window.openHomeGeoPicker === 'function', { timeout: 30000 });
  await dismissAntibot(page);

  await page.click('#fieldPais');
  await page.waitForSelector('#chGeoModal.is-open', { timeout: 10000 });
  const pais = await page.evaluate(() => ({
    premium: document.getElementById('chGeoModal').classList.contains('ch-geo-modal--home'),
    glass: !!document.querySelector('.ch-geo-card--glass'),
  }));

  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  await dismissAntibot(page);

  let alertFired = false;
  page.once('dialog', async (d) => {
    alertFired = true;
    await d.dismiss();
  });
  await page.evaluate(() => window.openHomeGeoPicker('estado'));
  await page.waitForTimeout(800);
  const estado = await page.evaluate(() => {
    const ch = document.getElementById('chUiInfoModal');
    return {
      notice: !!(ch && !ch.classList.contains('rp-hidden')),
      geoOpen: document.getElementById('chGeoModal').classList.contains('is-open'),
    };
  });

  const pass = pais.premium && pais.glass && estado.notice && !estado.geoOpen && !alertFired;
  return { pass: pass ? 'PASS' : 'FAIL', pais, estado, alertFired };
}

async function smokeRegistroGeo(page) {
  await page.goto(`${BASE}/registro-perfil.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1000);
  await dismissAntibot(page);
  await page.evaluate(() => {
    document.body.classList.add('rp-screen1-form');
    document.body.setAttribute('data-rp-sector', 'adultos');
    if (window.CariHubRegistroPerfil && CariHubRegistroPerfil.showScreen) {
      CariHubRegistroPerfil.showScreen('screen1');
    }
    if (window.CariHubGeoPicker && CariHubGeoPicker.mount) {
      CariHubGeoPicker.mount({
        prefix: 'rp',
        container: '#rpGeoPicker',
        hidden: { pais: 'fldPais', estado: 'fldEstado', ciudad: 'fldCiudad' },
      });
    }
  });
  await page.waitForTimeout(600);

  await page.click('#rpFieldPais');
  await page.waitForSelector('#chGeoModal.is-open', { timeout: 10000 });
  const visual = await page.evaluate(() => ({
    premium: document.getElementById('chGeoModal').classList.contains('ch-geo-modal--home'),
    glass: !!document.querySelector('.ch-geo-card--glass'),
  }));
  await page.locator('#chGeoModal .ch-geo-card--glass, #chGeoModal .ch-geo-card').first().click();
  await page.waitForTimeout(400);
  await page.click('#rpFieldEstado');
  await page.waitForSelector('#chGeoModal.is-open', { timeout: 10000 }).catch(() => {});
  await page.locator('#chGeoModal .ch-geo-card').first().click().catch(() => {});
  await page.waitForTimeout(400);
  await page.click('#rpFieldCiudad');
  await page.waitForSelector('#chGeoModal.is-open', { timeout: 10000 }).catch(() => {});
  await page.locator('#chGeoModal .ch-geo-card').first().click().catch(() => {});

  const hidden = await page.evaluate(() => ({
    pais: document.getElementById('fldPais')?.value || '',
    estado: document.getElementById('fldEstado')?.value || '',
    ciudad: document.getElementById('fldCiudad')?.value || '',
  }));

  const pass = visual.premium && visual.glass && hidden.pais && hidden.estado && hidden.ciudad;
  return { pass: pass ? 'PASS' : 'FAIL', visual, hidden };
}

async function smokePlaceholders(page) {
  await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await dismissAntibot(page);
  await page.waitForTimeout(1200);
  const home = await page.evaluate(() => {
    const est = document.querySelector('#homeMidEstados img');
    const live = document.querySelector('#homeMidLibe img');
    return {
      ph: !!(window.CariHubMediaPlaceholders && CariHubMediaPlaceholders.url),
      est: est ? est.getAttribute('src') : '',
      live: live ? live.getAttribute('src') : '',
    };
  });

  await page.goto(`${BASE}/resultados.html?categoria=Cari%C3%B1osas&pais=M%C3%A9xico`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.waitForTimeout(2000);
  const res = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.res-midband__mock img, .res-midband__mock-live-photo, .res-midband__mock-estado-photo'))
      .map((i) => i.getAttribute('src') || '')
  );

  const pass =
    home.ph &&
    home.est.includes('estado-placeholder.webp') &&
    home.live.includes('live-placeholder.webp') &&
    res.some((s) => s.includes('placeholder'));
  return {
    pass: pass ? 'PASS' : 'FAIL',
    home,
    resultados: res,
  };
}

async function smokeFichaPublica(page) {
  await page.goto(`${BASE}/perfil-publico.html?previewSource=registro&from=registro&vista=adult`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.waitForTimeout(2500);
  const data = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('.ch-media-ph'));
    return {
      count: imgs.length,
      srcs: imgs.map((i) => i.getAttribute('src') || ''),
      estadoPh: !!document.querySelector('.playout__estado--ph, .playout__estado .ch-media-ph'),
      livePh: !!document.querySelector('.playout__live--ph, .playout__live .ch-media-ph'),
    };
  });
  const pass =
    data.count >= 1 &&
    data.srcs.some((s) => s.includes('placeholder')) &&
    (data.estadoPh || data.livePh);
  return { pass: pass ? 'PASS' : 'FAIL', data };
}

async function smokeDashboard(page) {
  await page.goto(`${BASE}/dashboard-rentero.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  const data = await page.evaluate(() => ({
    loaded: !!document.getElementById('estadosMiosRow'),
    liveThumb: document.getElementById('rightLiveThumb')?.getAttribute('src') || '',
    ph: !!(window.CariHubMediaPlaceholders && CariHubMediaPlaceholders.url),
  }));
  const pass = data.loaded && data.ph && !!data.liveThumb;
  return { pass: pass ? 'PASS' : 'FAIL', data };
}

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage();
  track(page);

  const results = {
    homeGeo: await smokeHomeGeo(page),
    registroGeo: await smokeRegistroGeo(page),
    placeholders: await smokePlaceholders(page),
    fichaPublica: await smokeFichaPublica(page),
    dashboard: await smokeDashboard(page),
  };

  await browser.close();

  const summary = Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v.pass]));
  const allPass = Object.values(summary).every((v) => v === 'PASS');

  console.log(JSON.stringify({ summary, results, consoleErrors: errs.slice(0, 20) }, null, 2));
  process.exit(allPass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
