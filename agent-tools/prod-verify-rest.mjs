import { chromium } from 'playwright';
const BASE = 'https://carihub-app.web.app';
const b = await chromium.launch({ channel: 'msedge', headless: true });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });

// Registro geo
await p.goto(BASE + '/registro-perfil.html', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForFunction(() => typeof window.CariHubGeoPicker !== 'undefined', { timeout: 30000 }).catch(() => null);
await p.evaluate(() => {
  document.body.classList.add('rp-screen1-form');
  if (window.CariHubRegistroPerfil?.showScreen) CariHubRegistroPerfil.showScreen('screen1');
  if (window.CariHubGeoPicker?.mount) {
    CariHubGeoPicker.mount({ prefix: 'rp', container: '#rpGeoPicker', hidden: { pais: 'fldPais', estado: 'fldEstado', ciudad: 'fldCiudad' } });
  }
});
await p.waitForTimeout(1000);
const hasField = await p.$('#rpFieldPais');
console.log('registro has rpFieldPais', !!hasField);
if (hasField) {
  await hasField.click();
  await p.waitForSelector('#chGeoModal.is-open', { timeout: 10000 });
  const g = await p.evaluate(() => ({
    premium: document.getElementById('chGeoModal')?.classList.contains('ch-geo-modal--home'),
    glass: !!document.querySelector('.ch-geo-card--glass'),
  }));
  console.log('registro geo', g);
}

// Home placeholders
await p.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2000);
const homePh = await p.evaluate(() => {
  const est = document.querySelector('#homeMidEstados img, #homeMidEstados .ch-slot-dock__img');
  const live = document.querySelector('#homeMidLibe img, #homeMidLibe .ch-slot-dock__img');
  return {
    est: est?.getAttribute('src'),
    live: live?.getAttribute('src'),
    midHtml: document.getElementById('homeMidEstados')?.innerHTML?.slice(0, 200),
  };
});
console.log('home ph', homePh);

// Resultados placeholders
await p.goto(BASE + '/resultados.html?categoria=Cari%C3%B1osas&pais=M%C3%A9xico', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(3000);
const resPh = await p.evaluate(() => ({
  imgs: [...document.querySelectorAll('img')].map((i) => i.getAttribute('src')).filter((s) => s && s.includes('placeholder')),
  mid: document.getElementById('resMidEstados')?.innerHTML?.slice(0, 250),
}));
console.log('res ph', resPh);

await b.close();
