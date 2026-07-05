/**
 * QA visual/manual automatizado — hotfix placeholders + modal categorías.
 * Usa Edge del sistema (Playwright channel msedge).
 *
 * node agent-tools/hotfix-visual-browser-qa.mjs
 * QA_BASE=http://127.0.0.1:3457 node agent-tools/hotfix-visual-browser-qa.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shotsDir = path.join(__dirname, 'hotfix-qa-shots');
const base = process.env.QA_BASE || 'http://127.0.0.1:3457';

const results = [];
const consoleByPage = {};

function record(screen, check, pass, detail) {
  results.push({ screen, check, pass, detail: detail || '' });
}

async function shot(page, name) {
  fs.mkdirSync(shotsDir, { recursive: true });
  const file = path.join(shotsDir, name + '.png');
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

function attachConsole(page, key) {
  consoleByPage[key] = [];
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warn') {
      consoleByPage[key].push({ type, text: msg.text() });
    }
  });
  page.on('pageerror', (err) => {
    consoleByPage[key].push({ type: 'pageerror', text: String(err.message || err) });
  });
}

async function layoutProbe(page) {
  return page.evaluate(() => {
    function cs(el) {
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        display: s.display,
        gridTemplateColumns: s.gridTemplateColumns,
        flexDirection: s.flexDirection,
        width: el.offsetWidth,
        height: el.offsetHeight
      };
    }
    const grid = document.querySelector('.home-adultos-picker__grid');
    const card = document.querySelector('#catPickerListAdultos .ap-card');
    const visual = card && card.querySelector('.ap-card__visual');
    const photo = card && card.querySelector('.ap-card__photo');
    const estadoImg = document.querySelector('#homeAdultosPromoEstados .ch-slot-dock__img');
    const liveImg = document.querySelector('#homeAdultosPromoLibe .ch-slot-dock__img');
    const centerBanner = document.querySelector('#catPickerAdultos [data-registro-banner-slot="home_categorias"]');
    const closeBtn = document.querySelector('#modal-categorias .home-modal__close');
    const cards = Array.from(document.querySelectorAll('#catPickerListAdultos .ap-card')).slice(0, 6);
    const cardMetrics = cards.map((c) => ({
      w: c.offsetWidth,
      h: c.offsetHeight,
      flex: getComputedStyle(c).flexDirection
    }));
    const maxCardH = cardMetrics.reduce((m, c) => Math.max(m, c.h), 0);
    const minCardH = cardMetrics.reduce((m, c) => Math.min(m, c.h || 9999), 9999);
    return {
      grid: cs(grid),
      card: cs(card),
      visual: cs(visual),
      photoFit: photo ? getComputedStyle(photo).objectFit : null,
      cardMetrics,
      maxCardH,
      minCardH,
      estadoSrc: estadoImg && estadoImg.getAttribute('src'),
      liveSrc: liveImg && liveImg.getAttribute('src'),
      hasCenterBanner: !!(centerBanner && centerBanner.innerHTML.trim()),
      closeVisible: !!(closeBtn && closeBtn.offsetWidth > 0)
    };
  });
}

async function subcatProbe(page) {
  return page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#homeOtrosSubcatList .rp-subcat-card')).slice(0, 8);
    const thumbs = cards.map((c) => {
      const thumb = c.querySelector('.ch-geo-card__thumb');
      const img = thumb && thumb.querySelector('img');
      const thumbCs = thumb ? getComputedStyle(thumb) : null;
      const imgCs = img ? getComputedStyle(img) : null;
      const imgOk = !!(img && img.complete && img.naturalWidth > 0 && img.offsetHeight > 20);
      return {
        thumbH: thumb ? thumb.offsetHeight : 0,
        thumbBg: thumbCs ? thumbCs.backgroundColor : '',
        imgH: img ? img.offsetHeight : 0,
        imgOk,
        cardH: c.offsetHeight,
        display: getComputedStyle(c).display
      };
    });
    const estadoImg = document.querySelector('#homeOtrosPromoEstados .ch-slot-dock__img, #modal-otros-sectores .home-cat-promo-rail [data-promo-slot="home_estados"] .ch-slot-dock__img');
    const liveImg = document.querySelector('#homeOtrosPromoLibe .ch-slot-dock__img, #modal-otros-sectores .home-cat-promo-rail [data-promo-slot="home_libe"] .ch-slot-dock__img');
    const center = document.querySelector('#modal-otros-sectores [data-registro-banner-slot="home_categorias"]');
    return {
      count: cards.length,
      thumbs,
      emptyThumbs: thumbs.filter((t) => !t.imgOk).length,
      tallCards: thumbs.filter((t) => t.cardH > 180).length,
      estadoSrc: estadoImg && estadoImg.getAttribute('src'),
      liveSrc: liveImg && liveImg.getAttribute('src'),
      hasCenterBanner: !!(center && center.innerHTML.trim())
    };
  });
}

async function slotProbe(page, estadoSel, liveSel) {
  return page.evaluate(({ estadoSel, liveSel }) => {
    function src(sel) {
      const el = document.querySelector(sel);
      return el ? (el.getAttribute('src') || (el.querySelector('img') && el.querySelector('img').getAttribute('src'))) : null;
    }
    return { estado: src(estadoSel), live: src(liveSel) };
  }, { estadoSel, liveSel });
}

async function dismissAntiBot(page) {
  await page.evaluate(() => {
    try { localStorage.setItem('carihub_acceso_ok', '1'); } catch (e) {}
    const m = document.getElementById('modalAntiBot');
    if (m) m.style.display = 'none';
  });
}

async function clickSel(page, sel) {
  await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (el) el.click();
  }, sel);
}

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  // ── 1. Adultos ──
  attachConsole(page, 'adultos');
  await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await dismissAntiBot(page);
  await page.waitForSelector('#fieldCategoria', { timeout: 15000 });
  await clickSel(page, '#fieldCategoria');
  await page.waitForSelector('#modal-categorias.is-open', { timeout: 15000 });
  await page.waitForTimeout(1200);
  const adultos = await layoutProbe(page);
  await shot(page, '01-adultos-modal');

  record('Adultos', 'Modal abierto', !!adultos.grid, JSON.stringify(adultos.grid));
  record('Adultos', 'Grid 2 columnas', adultos.grid && adultos.grid.gridTemplateColumns.split(' ').length === 2, adultos.grid && adultos.grid.gridTemplateColumns);
  record('Adultos', 'Cards horizontales (flex-row)', adultos.card && adultos.card.flexDirection === 'row', adultos.card && adultos.card.flexDirection);
  record('Adultos', 'Sin fotos gigantes (max h <= 120)', adultos.maxCardH > 0 && adultos.maxCardH <= 120, 'max=' + adultos.maxCardH);
  record('Adultos', 'Cards altura uniforme', adultos.maxCardH - adultos.minCardH <= 40, 'min=' + adultos.minCardH + ' max=' + adultos.maxCardH);
  record('Adultos', 'Photo object-fit cover', adultos.photoFit === 'cover', adultos.photoFit);
  record('Adultos', 'Estado placeholder webp', /estado-placeholder\.webp/.test(adultos.estadoSrc || ''), adultos.estadoSrc);
  record('Adultos', 'Live placeholder webp', /live-placeholder\.webp/.test(adultos.liveSrc || ''), adultos.liveSrc);
  record('Adultos', 'Banner central montado', adultos.hasCenterBanner, '');
  record('Adultos', 'Botón cerrar visible', adultos.closeVisible, '');

  await clickSel(page, '#modal-categorias .home-modal__close');
  await page.waitForTimeout(400);

  // ── 2. Vehículos ──
  attachConsole(page, 'automotriz');
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await dismissAntiBot(page);
  await page.waitForSelector('#btnVerOtrosSectores', { timeout: 15000 });
  await clickSel(page, '#btnVerOtrosSectores');
  await page.waitForSelector('#modal-otros-sectores.is-open', { timeout: 15000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const btn = document.querySelector('#homeOtrosSectorGrid [data-sector-id="automotriz"]');
    if (btn) btn.click();
  });
  await page.waitForSelector('#modal-otros-sectores.is-step-subcats', { timeout: 15000 });
  await page.waitForTimeout(1200);
  const auto = await subcatProbe(page);
  await shot(page, '02-automotriz-subcats');

  record('Vehículos', 'Subcats renderizadas', auto.count >= 4, 'count=' + auto.count);
  record('Vehículos', 'Sin bloques vacíos (thumbs con img)', auto.emptyThumbs === 0, 'empty=' + auto.emptyThumbs);
  record('Vehículos', 'Cards horizontales (~104px)', auto.tallCards === 0, 'tall=' + auto.tallCards);
  record('Vehículos', 'Estado placeholder webp', /estado-placeholder\.webp/.test(auto.estadoSrc || ''), auto.estadoSrc);
  record('Vehículos', 'Live placeholder webp', /live-placeholder\.webp/.test(auto.liveSrc || ''), auto.liveSrc);
  record('Vehículos', 'Banner central montado', auto.hasCenterBanner, '');

  await clickSel(page, '#modal-otros-sectores .home-modal__close');
  await page.waitForTimeout(400);

  // ── 3. Bienestar ──
  attachConsole(page, 'bienestar');
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await dismissAntiBot(page);
  await page.waitForSelector('#btnVerOtrosSectores', { timeout: 15000 });
  await clickSel(page, '#btnVerOtrosSectores');
  await page.waitForSelector('#modal-otros-sectores.is-open');
  await page.evaluate(() => {
    const btn = document.querySelector('#homeOtrosSectorGrid [data-sector-id="bienestar"]');
    if (btn) btn.click();
  });
  await page.waitForSelector('#modal-otros-sectores.is-step-subcats');
  await page.waitForTimeout(1200);
  const bien = await subcatProbe(page);
  await shot(page, '03-bienestar-subcats');

  record('Bienestar', 'Subcats renderizadas', bien.count >= 4, 'count=' + bien.count);
  record('Bienestar', 'Sin bloques vacíos', bien.emptyThumbs === 0, 'empty=' + bien.emptyThumbs);
  record('Bienestar', 'Cards horizontales', bien.tallCards === 0, 'tall=' + bien.tallCards);
  record('Bienestar', 'Estado placeholder webp', /estado-placeholder\.webp/.test(bien.estadoSrc || ''), bien.estadoSrc);
  record('Bienestar', 'Live placeholder webp', /live-placeholder\.webp/.test(bien.liveSrc || ''), bien.liveSrc);
  record('Bienestar', 'Banner central montado', bien.hasCenterBanner, '');

  // ── 4. Resultados ──
  const pageRes = await context.newPage();
  attachConsole(pageRes, 'resultados');
  await pageRes.goto(base + '/resultados', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageRes.waitForTimeout(1500);
  const resSlots = await slotProbe(pageRes, '#resMidEstados img', '#resMidLibe img');
  await shot(pageRes, '04-resultados-slots');
  record('Resultados', 'Estado placeholder webp', /estado-placeholder\.webp/.test(resSlots.estado || ''), resSlots.estado);
  record('Resultados', 'Live placeholder webp', /live-placeholder\.webp/.test(resSlots.live || ''), resSlots.live);

  // ── Registro ──
  const pageReg = await context.newPage();
  attachConsole(pageReg, 'registro');
  await pageReg.goto(base + '/registro-perfil', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageReg.waitForTimeout(1500);
  const regSlots = await pageReg.evaluate(() => {
    const e = document.querySelector('#rpSubcatPromoEstados .ch-slot-dock__img');
    const l = document.querySelector('#rpSubcatPromoLibe .ch-slot-dock__img');
    return { estado: e && e.getAttribute('src'), live: l && l.getAttribute('src') };
  });
  await shot(pageReg, '05-registro-slots');
  record('Registro', 'Estado placeholder webp', /estado-placeholder\.webp/.test(regSlots.estado || ''), regSlots.estado);
  record('Registro', 'Live placeholder webp', /live-placeholder\.webp/.test(regSlots.live || ''), regSlots.live);

  // ── Dashboard ──
  const pageDash = await context.newPage();
  attachConsole(pageDash, 'dashboard');
  await pageDash.goto(base + '/dashboard-rentero.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageDash.waitForTimeout(2500);
  const dashLive = await pageDash.evaluate(() => {
    const el = document.getElementById('rightLiveThumb');
    const hasMockLive = !!(window.MOCK_LIVE_ACTIVO || window.MOCK_LIVE_PROXIMO);
    return {
      src: el ? el.getAttribute('src') : null,
      hasMockLive: hasMockLive
    };
  });
  await shot(pageDash, '06-dashboard-live');
  if (dashLive.hasMockLive) {
    record('Dashboard', 'Live slot (mock activo — no aplica placeholder)', true, dashLive.src);
  } else {
    record('Dashboard', 'Live vacío usa placeholder', /live-placeholder\.webp/.test(dashLive.src || ''), dashLive.src);
  }

  await browser.close();

  const screens = ['Adultos', 'Vehículos', 'Bienestar', 'Resultados', 'Registro', 'Dashboard'];
  const summary = screens.map((s) => {
    const checks = results.filter((r) => r.screen === s);
    const failed = checks.filter((c) => !c.pass);
    return { screen: s, pass: failed.length === 0, failed: failed.map((f) => f.check + (f.detail ? ': ' + f.detail : '')) };
  });

  const out = {
    base,
    shotsDir,
    summary,
    results,
    consoleByPage
  };

  fs.writeFileSync(path.join(__dirname, 'hotfix-visual-qa-report.json'), JSON.stringify(out, null, 2));

  console.log('\n=== QA VISUAL BROWSER ===');
  console.log('Base:', base);
  console.log('Capturas:', shotsDir);
  summary.forEach((s) => {
    console.log((s.pass ? 'PASS' : 'FAIL') + ' — ' + s.screen);
    if (!s.pass) s.failed.forEach((f) => console.log('  ✗', f));
  });

  Object.entries(consoleByPage).forEach(([k, msgs]) => {
    if (msgs.length) {
      console.log('\nConsole [' + k + ']:');
      msgs.forEach((m) => console.log(' ', m.type + ':', m.text.slice(0, 200)));
    }
  });

  const anyFail = summary.some((s) => !s.pass);
  process.exit(anyFail ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
