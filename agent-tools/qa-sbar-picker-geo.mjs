/**
 * QA: picker país/estado/ciudad en resultados — buscador manual + tema LGBT
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:8765/resultados.html';
const LGBT_URL = BASE + '?vista=con-resultados&categoria=Antro+%2F+Restaurant+Bar+LGBT&pais=Per%C3%BA&estado=Lima&ciudad=Lima&preview=1';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const report = { ok: true, checks: [], errors: [] };

  function check(name, pass, detail) {
    report.checks.push({ name, pass, detail });
    if (!pass) report.ok = false;
  }

  try {
    await page.goto(LGBT_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1200);

    const bodySubtema = await page.evaluate(() => document.body.getAttribute('data-subtema'));
    check('body data-subtema=lgbt', bodySubtema === 'lgbt', bodySubtema);

    // Abrir picker Estado
    await page.click('[data-sbar-field="estado"]');
    await page.waitForTimeout(400);

    const searchVisible = await page.locator('#resSbarPickerSearch').isVisible();
    check('buscador visible en estado', searchVisible, String(searchVisible));

    const searchPlaceholder = await page.locator('#resSbarPickerInput').getAttribute('placeholder');
    check('placeholder estado', /estado/i.test(searchPlaceholder || ''), searchPlaceholder);

    const panelSubtema = await page.evaluate(() => {
      const p = document.querySelector('.res-sbar-picker__panel');
      return p ? p.getAttribute('data-subtema') : null;
    });
    check('panel data-subtema=lgbt', panelSubtema === 'lgbt', panelSubtema);

    const panelPink = await page.evaluate(() => {
      const p = document.querySelector('.res-sbar-picker__panel');
      return p ? p.classList.contains('carihub-pink-sheen') : null;
    });
    check('panel sin carihub-pink-sheen', panelPink === false, String(panelPink));

    const panelBg = await page.evaluate(() => {
      const p = document.querySelector('.res-sbar-picker__panel');
      if (!p) return '';
      return getComputedStyle(p).backgroundImage;
    });
    check('panel fondo con gradiente (no rosa plano)', /gradient/i.test(panelBg), panelBg.slice(0, 80));

    // Escribir estado manual
    await page.fill('#resSbarPickerInput', 'Callao');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    const estadoLabel = await page.locator('#resSbarEstadoLabel').textContent();
    check('estado manual guardado', estadoLabel && estadoLabel.trim() === 'Callao', estadoLabel);

    // Abrir picker Ciudad
    await page.click('[data-sbar-field="ciudad"]');
    await page.waitForTimeout(400);

    const ciudadSearch = await page.locator('#resSbarPickerSearch').isVisible();
    check('buscador visible en ciudad', ciudadSearch, String(ciudadSearch));

    await page.fill('#resSbarPickerInput', 'Miraflores');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    const ciudadLabel = await page.locator('#resSbarCiudadLabel').textContent();
    check('ciudad manual guardada', ciudadLabel && ciudadLabel.trim() === 'Miraflores', ciudadLabel);

    await page.screenshot({ path: 'agent-tools/qa-sbar-picker-lgbt.png', fullPage: false });
  } catch (e) {
    report.ok = false;
    report.errors.push(String(e.message || e));
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify(report, null, 2));
  process.exit(report.ok ? 0 : 1);
}

run();
