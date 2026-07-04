/**
 * Smoke producción — hotfix Adultos + modales + placeholders
 * node agent-tools/prod-smoke-hotfix.mjs
 */
import { chromium } from 'playwright';

const BASE = 'https://carihub-app.web.app';
const results = [];
const consoleByPage = {};

function record(id, pass, detail) {
  results.push({ id, pass, detail: detail || '' });
}

function attachConsole(page, key) {
  consoleByPage[key] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warn') {
      consoleByPage[key].push({ type: msg.type(), text: msg.text() });
    }
  });
  page.on('pageerror', (err) => {
    consoleByPage[key].push({ type: 'pageerror', text: String(err.message || err) });
  });
}

async function dismissAntiBot(page) {
  await page.evaluate(() => {
    try { localStorage.setItem('carihub_acceso_ok', '1'); } catch (e) {}
    const m = document.getElementById('modalAntiBot');
    if (m) { m.style.display = 'none'; m.classList.remove('is-open'); }
  });
}

async function clickEval(page, sel) {
  await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (el) el.click();
  }, sel);
}

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  // Deploy fingerprint
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  const deployMeta = await page.evaluate(() => {
    const css = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((l) => l.getAttribute('href') || '')
      .find((h) => h.includes('home-adultos-cat-picker'));
    const jsHome = Array.from(document.querySelectorAll('script[src]'))
      .map((s) => s.getAttribute('src') || '')
      .find((h) => h.includes('home-ui.js'));
    const jsAdultos = Array.from(document.querySelectorAll('script[src]'))
      .map((s) => s.getAttribute('src') || '')
      .find((h) => h.includes('adultos-cat-picker.js'));
    return { css, jsHome, jsAdultos };
  });
  record('deploy-fingerprint', /20260630hf3/.test(deployMeta.css || '') && /20260630hf3/.test(deployMeta.jsHome || ''), JSON.stringify(deployMeta));

  // 1. Adultos
  attachConsole(page, 'adultos');
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await dismissAntiBot(page);
  await page.waitForSelector('#fieldCategoria', { timeout: 20000 });
  await clickEval(page, '#fieldCategoria');
  await page.waitForSelector('#modal-categorias.is-open', { timeout: 15000 });
  await page.waitForTimeout(3500);
  const adultos = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#catPickerListAdultos .ap-card')).slice(0, 8);
    const grid = document.querySelector('.home-adultos-picker__grid');
    const estadoImg = document.querySelector('#homeAdultosPromoEstados .ch-slot-dock__img');
    const liveImg = document.querySelector('#homeAdultosPromoLibe .ch-slot-dock__img');
    const metrics = cards.map((c) => {
      const t = c.querySelector('.ap-card__name-text');
      const w = c.querySelector('.rp-sector-watermark');
      const n = c.querySelector('.ap-card__name');
      const v = c.querySelector('.ap-card__visual');
      return {
        name: t ? t.textContent.trim() : '',
        textW: t ? t.offsetWidth : 0,
        textH: t ? t.offsetHeight : 0,
        wm: !!w,
        nameW: n ? n.offsetWidth : 0,
        visualW: v ? v.offsetWidth : 0,
        flex: getComputedStyle(c).flexDirection,
      };
    });
    const gridCs = grid ? getComputedStyle(grid) : null;
    return {
      count: cards.length,
      gridCols: gridCs ? gridCs.gridTemplateColumns : '',
      metrics,
      maxCardH: Math.max(...cards.map((c) => c.offsetHeight), 0),
      estadoSrc: estadoImg ? estadoImg.getAttribute('src') : null,
      liveSrc: liveImg ? liveImg.getAttribute('src') : null,
    };
  });
  const adultosNamesOk = adultos.metrics.length >= 6 && adultos.metrics.every((m) => m.name && m.textW > 8 && m.textH > 8);
  const adultosNoWm = adultos.metrics.every((m) => !m.wm);
  const adultosGridOk = adultos.gridCols.split(' ').length === 2;
  const adultosLayoutOk = adultos.metrics.every((m) => m.flex === 'row' && m.visualW > 0 && m.nameW > m.visualW);
  const adultosHeightOk = adultos.maxCardH > 0 && adultos.maxCardH <= 120;
  record('1-adultos-names', adultosNamesOk, 'names=' + adultos.metrics.map((m) => m.name).slice(0, 3).join(', '));
  record('1-adultos-no-image-over-text', adultosNoWm && adultosLayoutOk, 'wm=' + adultos.metrics.filter((m) => m.wm).length);
  record('1-adultos-grid', adultosGridOk && adultosHeightOk, adultos.gridCols + ' maxH=' + adultos.maxCardH);
  record('1-adultos-estado-ph', /estado-placeholder\.webp/.test(adultos.estadoSrc || ''), adultos.estadoSrc);
  record('1-adultos-live-ph', /live-placeholder\.webp/.test(adultos.liveSrc || ''), adultos.liveSrc);

  await clickEval(page, '#modal-categorias .home-modal__close');
  await page.waitForTimeout(400);

  // 2. Vehículos
  attachConsole(page, 'vehiculos');
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await dismissAntiBot(page);
  await page.waitForSelector('#btnVerOtrosSectores', { timeout: 20000 });
  await clickEval(page, '#btnVerOtrosSectores');
  await page.waitForSelector('#modal-otros-sectores.is-open', { timeout: 15000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const btn = document.querySelector('#homeOtrosSectorGrid [data-sector-id="automotriz"]');
    if (btn) btn.click();
  });
  await page.waitForSelector('#modal-otros-sectores.is-step-subcats', { timeout: 15000 });
  await page.waitForTimeout(2000);
  const auto = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#homeOtrosSubcatList .rp-subcat-card')).slice(0, 8);
    return cards.map((c) => {
      const thumb = c.querySelector('.ch-geo-card__thumb');
      const img = thumb && thumb.querySelector('img');
      const label = c.querySelector('.ch-geo-card__label, .rp-subcat-card__label, .ch-geo-card__title');
      const thumbCs = thumb ? getComputedStyle(thumb) : null;
      return {
        label: label ? label.textContent.trim() : '',
        imgOk: !!(img && img.complete && img.naturalWidth > 0 && img.offsetHeight > 20),
        thumbBg: thumbCs ? thumbCs.backgroundColor : '',
        cardH: c.offsetHeight,
      };
    });
  });
  const autoOk = auto.length >= 4 && auto.every((c) => c.imgOk && c.label && c.cardH < 180);
  const autoNoCeleste = auto.every((c) => !/rgb\(135,\s*206,\s*235\)/i.test(c.thumbBg) && c.imgOk);
  record('2-vehiculos', autoOk && autoNoCeleste, 'count=' + auto.length + ' empty=' + auto.filter((c) => !c.imgOk).length);

  await clickEval(page, '#modal-otros-sectores .home-modal__close');
  await page.waitForTimeout(400);

  // 3. Bienestar
  attachConsole(page, 'bienestar');
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await dismissAntiBot(page);
  await page.waitForSelector('#btnVerOtrosSectores', { timeout: 20000 });
  await clickEval(page, '#btnVerOtrosSectores');
  await page.waitForSelector('#modal-otros-sectores.is-open');
  await page.evaluate(() => {
    const btn = document.querySelector('#homeOtrosSectorGrid [data-sector-id="bienestar"]');
    if (btn) btn.click();
  });
  await page.waitForSelector('#modal-otros-sectores.is-step-subcats');
  await page.waitForTimeout(2000);
  const bien = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#homeOtrosSubcatList .rp-subcat-card')).slice(0, 8);
    return {
      count: cards.length,
      bad: cards.filter((c) => {
        const thumb = c.querySelector('.ch-geo-card__thumb');
        const img = thumb && thumb.querySelector('img');
        const label = c.querySelector('.ch-geo-card__label, .rp-subcat-card__label, .ch-geo-card__title');
        return !(img && img.offsetHeight > 20) || !(label && label.textContent.trim());
      }).length,
      tall: cards.filter((c) => c.offsetHeight > 180).length,
    };
  });
  record('3-bienestar', bien.count >= 4 && bien.bad === 0 && bien.tall === 0, JSON.stringify(bien));

  // 4. Registro geo premium
  const pageReg = await ctx.newPage();
  attachConsole(pageReg, 'registro');
  await pageReg.goto(BASE + '/registro-perfil', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await pageReg.waitForTimeout(2000);
  await dismissAntiBot(pageReg);
  const regGeo = await pageReg.evaluate(async () => {
    await new Promise((r) => setTimeout(r, 500));
    const hasGeoPicker = !!document.querySelector('#rpGeoPicker, .ch-geo-picker');
    let paisPremium = false;
    try {
      if (window.openHomeGeoPicker) {
        // registro may use CariHubGeoPicker mount
      }
      const field = document.querySelector('#fieldPais, [data-geo-field="pais"], .rp-geo-field--pais');
      if (field) field.click();
      await new Promise((r) => setTimeout(r, 800));
      const modal = document.getElementById('chGeoModal');
      paisPremium = !!(modal && modal.classList.contains('is-open') && (
        modal.classList.contains('ch-geo-modal--home') ||
        modal.classList.contains('ch-geo-modal--registro') ||
        !!document.querySelector('.ch-geo-card--glass')
      ));
      if (modal) {
        const close = modal.querySelector('.ch-geo-sheet__close, .ch-geo-sheet__nav');
        if (close) close.click();
      }
    } catch (e) {}
    return { hasGeoPicker, paisPremium };
  });
  // fallback: click rp geo field
  if (!regGeo.paisPremium) {
    const regGeo2 = await pageReg.evaluate(async () => {
      const triggers = ['#rpGeoPicker .home-field--pais', '#rpGeoPicker [data-geo="pais"]', '.ch-geo-picker .home-field'];
      for (const sel of triggers) {
        const el = document.querySelector(sel);
        if (!el) continue;
        el.click();
        await new Promise((r) => setTimeout(r, 900));
        const modal = document.getElementById('chGeoModal');
        if (modal && modal.classList.contains('is-open')) {
          const premium = modal.classList.contains('ch-geo-modal--home') ||
            modal.classList.contains('ch-geo-modal--registro') ||
            !!document.querySelector('.ch-geo-card--glass');
          return { premium, sel };
        }
      }
      return { premium: false, sel: null };
    });
    regGeo.paisPremium = regGeo2.premium;
    regGeo.detail = regGeo2.sel;
  }
  record('4-registro-geo', regGeo.hasGeoPicker || regGeo.paisPremium, JSON.stringify(regGeo));

  // 5. Placeholders registro + resultados
  const regPh = await pageReg.evaluate(() => {
    const e = document.querySelector('#rpSubcatPromoEstados .ch-slot-dock__img, [data-promo-slot="home_estados"] .ch-slot-dock__img');
    const l = document.querySelector('#rpSubcatPromoLibe .ch-slot-dock__img, [data-promo-slot="home_libe"] .ch-slot-dock__img');
    return { estado: e && e.getAttribute('src'), live: l && l.getAttribute('src') };
  });
  record('5-registro-estado-ph', /estado-placeholder\.webp/.test(regPh.estado || ''), regPh.estado);
  record('5-registro-live-ph', /live-placeholder\.webp/.test(regPh.live || ''), regPh.live);

  const pageRes = await ctx.newPage();
  attachConsole(pageRes, 'resultados');
  await pageRes.goto(BASE + '/resultados', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await pageRes.waitForTimeout(1500);
  const resPh = await pageRes.evaluate(() => {
    const e = document.querySelector('#resMidEstados img, [data-slot-id="estados"] img');
    const l = document.querySelector('#resMidLibe img, [data-slot-id="libe"] img');
    return { estado: e && e.getAttribute('src'), live: l && l.getAttribute('src') };
  });
  record('5-resultados-estado-ph', /estado-placeholder\.webp/.test(resPh.estado || ''), resPh.estado);
  record('5-resultados-live-ph', /live-placeholder\.webp/.test(resPh.live || ''), resPh.live);

  await browser.close();

  console.log('\n=== PROD SMOKE carihub-app.web.app ===\n');
  const groups = {
    '1. Adultos': ['1-adultos-names', '1-adultos-no-image-over-text', '1-adultos-grid', '1-adultos-estado-ph', '1-adultos-live-ph'],
    '2. Vehículos': ['2-vehiculos'],
    '3. Bienestar': ['3-bienestar'],
    '4. Registro geo': ['4-registro-geo'],
    '5. Placeholders': ['5-registro-estado-ph', '5-registro-live-ph', '5-resultados-estado-ph', '5-resultados-live-ph'],
    Deploy: ['deploy-fingerprint'],
  };
  for (const [g, ids] of Object.entries(groups)) {
    const checks = results.filter((r) => ids.includes(r.id));
    const pass = checks.every((c) => c.pass);
    console.log((pass ? 'PASS' : 'FAIL') + ' — ' + g);
    checks.forEach((c) => {
      if (!c.pass) console.log('  ✗', c.id, c.detail);
    });
  }
  console.log('\n--- Console ---');
  for (const [k, msgs] of Object.entries(consoleByPage)) {
    const uniq = [...new Map(msgs.map((m) => [m.type + m.text.slice(0, 120), m])).values()];
    if (uniq.length) {
      console.log('[' + k + ']');
      uniq.slice(0, 8).forEach((m) => console.log(' ', m.type + ':', m.text.slice(0, 180)));
    }
  }
  const anyFail = results.some((r) => !r.pass);
  process.exit(anyFail ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
