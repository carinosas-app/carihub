import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8765';
const results = [];

function ok(id, pass, detail) {
  results.push({ id, result: pass ? 'OK' : 'FALLA', detail });
}

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(`${BASE}/registro-perfil.html`, { waitUntil: 'networkidle' });

const primaryHidden0 = await page.evaluate(() => ({
  screen: document.querySelector('.rp-screen.is-active')?.id,
  primaryHidden: document.getElementById('rpBtnPrimary')?.classList.contains('rp-hidden'),
  primaryText: document.getElementById('rpBtnPrimary')?.textContent?.trim(),
}));
ok('P0-sin-continuar', primaryHidden0.primaryHidden === true, String(primaryHidden0.primaryHidden));

await page.locator('.rp-sector-card').filter({ hasText: 'Adultos y Entretenimiento' }).first().click();
await page.waitForTimeout(400);
const adult = await page.evaluate(() => ({
  screen: document.querySelector('.rp-screen.is-active')?.id,
  primaryHidden: document.getElementById('rpBtnPrimary')?.classList.contains('rp-hidden'),
}));
ok('tap-adultos', adult.screen === 'screen0b-adultos', adult.screen);
ok('P0B-sin-continuar', adult.primaryHidden === true, String(adult.primaryHidden));

await page.locator('#rpAdultosGrid button.ap-card').filter({ hasText: /^Escort$/ }).first().click();
await page.waitForTimeout(400);
const escort = await page.evaluate(() => ({
  screen: document.querySelector('.rp-screen.is-active')?.id,
  sub: document.getElementById('fldSubcategoria')?.value,
  primaryText: document.getElementById('rpBtnPrimary')?.textContent?.trim(),
  primaryHidden: document.getElementById('rpBtnPrimary')?.classList.contains('rp-hidden'),
}));
ok('tap-escort-screen1', escort.screen === 'screen1', escort.screen);
ok('tap-escort-sub', escort.sub === 'Escort', escort.sub);
ok('P1-guardar-borrador', escort.primaryHidden === false && escort.primaryText === 'Guardar borrador', escort.primaryText);

await page.click('#rpBtnSecondary');
await page.waitForTimeout(300);
ok('volver-screen1', (await page.evaluate(() => document.querySelector('.rp-screen.is-active')?.id)) === 'screen0b-adultos', '');

await page.click('#rpBackAdultos');
await page.waitForTimeout(300);
await page.locator('.rp-sector-card').filter({ hasText: 'Salud y Bienestar' }).first().click();
await page.waitForTimeout(400);
const salud = await page.evaluate(() => document.querySelector('.rp-screen.is-active')?.id);
ok('tap-salud-soon', salud === 'screen0b-soon', salud);

await page.click('#rpBtnSecondary');
await page.waitForTimeout(300);
ok('volver-soon', (await page.evaluate(() => document.querySelector('.rp-screen.is-active')?.id)) === 'screen0', '');

ok('js-errors', errors.length === 0, errors.join(' | ') || '0');

console.log(JSON.stringify({ results, errors, recommendation: results.every((r) => r.result === 'OK') ? 'OK' : 'FALLA' }, null, 2));
await browser.close();
