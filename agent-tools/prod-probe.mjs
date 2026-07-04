import { chromium } from 'playwright';
const BASE = 'https://carihub-app.web.app';
const b = await chromium.launch({ channel: 'msedge', headless: true });

async function dismiss(page) {
  await page.evaluate(() => {
    try { localStorage.setItem('carihub_acceso_ok', '1'); } catch (e) {}
    const m = document.getElementById('modalAntiBot');
    if (m) m.style.display = 'none';
  });
}

const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await dismiss(p);
await p.waitForSelector('#btnVerOtrosSectores');
await p.evaluate(() => document.querySelector('#btnVerOtrosSectores').click());
await p.waitForSelector('#modal-otros-sectores.is-open');
await p.evaluate(() => document.querySelector('[data-sector-id="automotriz"]').click());
await p.waitForSelector('#modal-otros-sectores.is-step-subcats');
await p.waitForTimeout(3000);
const auto = await p.evaluate(() => {
  const cards = Array.from(document.querySelectorAll('#homeOtrosSubcatList *')).slice(0, 20);
  const items = Array.from(document.querySelectorAll('#homeOtrosSubcatList li, #homeOtrosSubcatList button')).slice(0, 5);
  return {
    childCount: document.querySelector('#homeOtrosSubcatList')?.children.length,
    items: items.map((c) => ({
      tag: c.tagName,
      cls: c.className,
      text: c.textContent.trim().slice(0, 50),
      imgH: c.querySelector('img')?.offsetHeight || 0,
      imgSrc: c.querySelector('img')?.getAttribute('src')?.slice(-40),
    })),
  };
});
console.log('AUTO', JSON.stringify(auto, null, 2));

const pr = await b.newPage();
await pr.goto(BASE + '/registro-perfil', { waitUntil: 'domcontentloaded', timeout: 90000 });
await pr.waitForTimeout(3000);
await dismiss(pr);
const reg = await pr.evaluate(() => ({
  geoPicker: !!document.querySelector('.ch-geo-picker'),
  rpGeo: !!document.getElementById('rpGeoPicker'),
  bodyData: document.body.getAttribute('data-rp-sector'),
  slotImgs: Array.from(document.querySelectorAll('.ch-slot-dock__img')).map((i) => i.getAttribute('src')),
  phImgs: Array.from(document.querySelectorAll('img[src*="placeholder"]')).map((i) => i.getAttribute('src')),
}));
console.log('REG', JSON.stringify(reg, null, 2));

await pr.evaluate(() => {
  document.body.classList.add('rp-screen1-form');
  if (window.CariHubRegistroPerfil?.showScreen) CariHubRegistroPerfil.showScreen('screen1');
});
await pr.waitForTimeout(1000);
const regGeo = await pr.evaluate(async () => {
  const field = document.querySelector('.ch-geo-picker .home-field--pais, #rpGeoPicker .home-field');
  if (field) field.click();
  await new Promise((r) => setTimeout(r, 1000));
  const modal = document.getElementById('chGeoModal');
  return {
    clicked: !!field,
    modalOpen: modal?.classList.contains('is-open'),
    modalClass: modal?.className,
    glass: !!document.querySelector('.ch-geo-card--glass'),
  };
});
console.log('REG_GEO', JSON.stringify(regGeo, null, 2));

const pres = await b.newPage();
await pres.goto(BASE + '/resultados', { waitUntil: 'domcontentloaded', timeout: 90000 });
await pres.waitForTimeout(2500);
const res = await pres.evaluate(() => ({
  slotImgs: Array.from(document.querySelectorAll('.ch-slot-dock__img, .ch-slot-dock img')).map((i) => ({
    src: i.getAttribute('src'),
    id: i.id,
  })),
  resMidEstados: document.getElementById('resMidEstados')?.querySelector('img')?.getAttribute('src'),
  resMidLibe: document.getElementById('resMidLibe')?.querySelector('img')?.getAttribute('src'),
}));
console.log('RES', JSON.stringify(res, null, 2));

await b.close();
