/**
 * Verificación producción — cierre hotfix
 * node agent-tools/prod-verify-final.mjs
 */
import { chromium } from 'playwright';

const BASE = 'https://carihub-app.web.app';
const out = { checks: [], console: {} };

function add(id, pass, detail) {
  out.checks.push({ id, pass, detail });
}

function track(page, key) {
  out.console[key] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warn') {
      out.console[key].push({ type: m.type(), text: m.text().slice(0, 220) });
    }
  });
  page.on('pageerror', (e) => {
    out.console[key].push({ type: 'pageerror', text: String(e.message).slice(0, 220) });
  });
}

async function dismiss(page) {
  await page.evaluate(() => {
    try { localStorage.setItem('carihub_acceso_ok', '1'); } catch (e) {}
    const m = document.getElementById('modalAntiBot');
    if (m) { m.style.display = 'none'; m.classList.remove('is-open'); }
  });
}

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
track(page, 'home');

// Deploy fingerprint
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
const fp = await page.evaluate(() => ({
  css: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href).find((h) => h.includes('home-adultos-cat-picker')),
  homeUi: [...document.querySelectorAll('script[src]')].map((s) => s.src).find((h) => h.includes('home-ui.js')),
}));
add('deploy-hf3', /20260630hf3/.test(fp.css || '') && /20260630hf3/.test(fp.homeUi || ''), JSON.stringify(fp));

// 1 Adultos
await dismiss(page);
await page.waitForSelector('#fieldCategoria', { timeout: 20000 });
await page.evaluate(() => document.querySelector('#fieldCategoria').click());
await page.waitForSelector('#modal-categorias.is-open');
await page.waitForTimeout(3500);
const adultos = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('#catPickerListAdultos .ap-card')].slice(0, 8);
  const grid = document.querySelector('.home-adultos-picker__grid');
  const estado = document.querySelector('#homeAdultosPromoEstados .ch-slot-dock__img');
  const live = document.querySelector('#homeAdultosPromoLibe .ch-slot-dock__img');
  const m = cards.map((c) => {
    const t = c.querySelector('.ap-card__name-text');
    const w = c.querySelector('.rp-sector-watermark');
    return { name: t?.textContent?.trim(), tw: t?.offsetWidth, wm: !!w };
  });
  return {
    m,
    grid2: getComputedStyle(grid).gridTemplateColumns.split(' ').length === 2,
    maxH: Math.max(...cards.map((c) => c.offsetHeight)),
    estado: estado?.getAttribute('src'),
    live: live?.getAttribute('src'),
  };
});
add('1-adultos', adultos.m.length >= 6 && adultos.m.every((x) => x.name && x.tw > 8 && !x.wm) && adultos.grid2 && adultos.maxH <= 120,
  JSON.stringify({ names: adultos.m.slice(0, 3).map((x) => x.name), maxH: adultos.maxH }));
add('1-adultos-rail-ph', /estado-placeholder\.webp/.test(adultos.estado || '') && /live-placeholder\.webp/.test(adultos.live || ''),
  (adultos.estado || '') + ' | ' + (adultos.live || ''));

await page.evaluate(() => document.querySelector('#modal-categorias .home-modal__close')?.click());
await page.waitForTimeout(300);

// 2 Vehículos
track(page, 'vehiculos');
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await dismiss(page);
await page.waitForSelector('#btnVerOtrosSectores');
await page.evaluate(() => document.querySelector('#btnVerOtrosSectores').click());
await page.waitForSelector('#modal-otros-sectores.is-open');
await page.evaluate(() => document.querySelector('[data-sector-id="automotriz"]').click());
await page.waitForSelector('#modal-otros-sectores.is-step-subcats');
await page.waitForTimeout(2500);
const auto = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('#homeOtrosSubcatList .ch-geo-card.rp-subcat-card')].slice(0, 8);
  return cards.map((c) => {
    const img = c.querySelector('img');
    const label = c.querySelector('.ch-geo-card__label') || c;
    return {
      label: (c.querySelector('.ch-geo-card__label')?.textContent || c.textContent).trim().slice(0, 40),
      imgH: img?.offsetHeight || 0,
      cardH: c.offsetHeight,
    };
  });
});
add('2-vehiculos', auto.length >= 4 && auto.every((c) => c.label && c.imgH > 20 && c.cardH < 180),
  'count=' + auto.length + ' sample=' + (auto[0]?.label || ''));

// 3 Bienestar
track(page, 'bienestar');
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await dismiss(page);
await page.waitForSelector('#btnVerOtrosSectores');
await page.evaluate(() => document.querySelector('#btnVerOtrosSectores').click());
await page.waitForSelector('#modal-otros-sectores.is-open');
await page.evaluate(() => document.querySelector('[data-sector-id="bienestar"]').click());
await page.waitForSelector('#modal-otros-sectores.is-step-subcats');
await page.waitForTimeout(2500);
const bien = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('#homeOtrosSubcatList .ch-geo-card.rp-subcat-card')].slice(0, 8);
  return {
    count: cards.length,
    bad: cards.filter((c) => !(c.querySelector('img')?.offsetHeight > 20) || !c.textContent.trim()).length,
  };
});
add('3-bienestar', bien.count >= 4 && bien.bad === 0, JSON.stringify(bien));

// 4 Registro geo
const pr = await ctx.newPage();
track(pr, 'registro');
await pr.goto(BASE + '/registro-perfil', { waitUntil: 'domcontentloaded', timeout: 90000 });
await pr.waitForTimeout(1500);
await dismiss(pr);
await pr.evaluate(() => {
  document.body.classList.add('rp-screen1-form');
  document.body.setAttribute('data-rp-sector', 'adultos');
  if (window.CariHubRegistroPerfil?.showScreen) CariHubRegistroPerfil.showScreen('screen1');
  if (window.CariHubGeoPicker?.mount) {
    CariHubGeoPicker.mount({
      prefix: 'rp',
      container: '#rpGeoPicker',
      hidden: { pais: 'fldPais', estado: 'fldEstado', ciudad: 'fldCiudad' },
    });
  }
});
await pr.waitForTimeout(800);
await pr.click('#rpFieldPais');
await pr.waitForSelector('#chGeoModal.is-open', { timeout: 15000 });
const regGeo = await pr.evaluate(() => ({
  premium: document.getElementById('chGeoModal')?.classList.contains('ch-geo-modal--home'),
  glass: !!document.querySelector('.ch-geo-card--glass'),
}));
add('4-registro-geo', regGeo.premium && regGeo.glass, JSON.stringify(regGeo));

// 5 Placeholders home hero + resultados
track(pr, 'registro-ph');
await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded', timeout: 90000 });
await dismiss(page);
await page.waitForTimeout(1500);
const homePh = await page.evaluate(() => {
  const est = document.querySelector('#homeMidEstados img, #homeMidEstados .ch-slot-dock__img');
  const live = document.querySelector('#homeMidLibe img, #homeMidLibe .ch-slot-dock__img');
  return { est: est?.getAttribute('src'), live: live?.getAttribute('src') };
});
add('5-home-estado-ph', /estado-placeholder\.webp/.test(homePh.est || ''), homePh.est);
add('5-home-live-ph', /live-placeholder\.webp/.test(homePh.live || ''), homePh.live);

const pres = await ctx.newPage();
track(pres, 'resultados');
await pres.goto(BASE + '/resultados.html?categoria=Cari%C3%B1osas&pais=M%C3%A9xico', { waitUntil: 'domcontentloaded', timeout: 90000 });
await pres.waitForTimeout(2500);
const resPh = await pres.evaluate(() => {
  const imgs = [...document.querySelectorAll('.res-midband__mock img, .res-midband__mock-live-photo, .res-midband__mock-estado-photo, .ch-slot-dock__img')];
  return imgs.map((i) => i.getAttribute('src') || '');
});
add('5-resultados-ph', resPh.some((s) => s.includes('estado-placeholder')) && resPh.some((s) => s.includes('live-placeholder')),
  resPh.join(' | '));

await browser.close();

const groups = {
  '1. Adultos modal': ['1-adultos', '1-adultos-rail-ph'],
  '2. Vehículos': ['2-vehiculos'],
  '3. Bienestar': ['3-bienestar'],
  '4. Registro geo premium': ['4-registro-geo'],
  '5. Placeholders': ['5-home-estado-ph', '5-home-live-ph', '5-resultados-ph'],
  Deploy: ['deploy-hf3'],
};

console.log('\n=== PRODUCCIÓN carihub-app.web.app ===\n');
for (const [name, ids] of Object.entries(groups)) {
  const cs = out.checks.filter((c) => ids.includes(c.id));
  const pass = cs.every((c) => c.pass);
  console.log((pass ? 'PASS' : 'FAIL') + ' — ' + name);
  cs.filter((c) => !c.pass).forEach((c) => console.log('  ✗', c.id + ':', c.detail));
}
console.log('\n--- Consola (únicos) ---');
for (const [k, msgs] of Object.entries(out.console)) {
  const uniq = [...new Map(msgs.map((m) => [m.type + m.text, m])).values()];
  if (uniq.length) {
    console.log('[' + k + ']');
    uniq.slice(0, 5).forEach((m) => console.log(' ', m.type + ':', m.text));
  }
}
process.exit(out.checks.some((c) => !c.pass) ? 1 : 0);
