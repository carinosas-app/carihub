/**
 * TICKET-003 — QA perfilActivoId persistencia y restore.
 * Uso: node scripts/ticket-003-qa.mjs [baseUrl]
 *
 * Requiere CARIHUB_TEST_EMAIL + CARIHUB_TEST_PASSWORD para escenarios autenticados.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3457';
const results = [];

function pass(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ' — ' + detail : ''}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? ' — ' + detail : ''}`);
}

async function loginAndOpenDashboard(page, email, password) {
  await page.goto(`${BASE}/index.html?abrir=login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.fill('#loginEmail', email);
  await page.fill('#loginPassword', password);
  await page.click('button:has-text("Entrar")');
  await page.waitForURL(/dashboard-rentero\.html/, { timeout: 30000 });
  await page.waitForFunction(() => window.CariHubCore && window.CariHubCore.ready, { timeout: 20000 });
}

async function readDashboardState(page) {
  return page.evaluate(() => {
    const tiles = document.querySelectorAll('#publicationList .dash-activos-tiles [data-tipo="perfil"]');
    const ids = Array.from(tiles).map((el) => el.getAttribute('data-id')).filter(Boolean);
    const ctx = window.DashContext ? DashContext.get() : null;
    const storage = sessionStorage.getItem('carihub_dash_context');
    return {
      railPerfilIds: ids,
      dashContextId: ctx && ctx.tipo === 'perfil' ? (ctx.perfilId || ctx.id) : null,
      storageRaw: storage,
      hasUser: !!(window.auth && auth.currentUser) || !!(window.CariHubCore && CariHubCore.auth && CariHubCore.auth.currentUser)
    };
  });
}

async function tapPerfilRailByIndex(page, index) {
  const sel = `#publicationList .dash-activos-tiles [data-tipo="perfil"][data-id]`;
  await page.locator(sel).nth(index).click();
  await page.waitForTimeout(800);
}

async function main() {
  const email = process.env.CARIHUB_TEST_EMAIL || '';
  const password = process.env.CARIHUB_TEST_PASSWORD || '';

  if (!email || !password) {
    console.log('NOTA: Define CARIHUB_TEST_EMAIL/CARIHUB_TEST_PASSWORD para QA autenticado completo.');
    process.exit(0);
  }

  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const context = await browser.newContext();
  const page = await context.newPage();

  await loginAndOpenDashboard(page, email, password);
  const boot = await readDashboardState(page);
  if (boot.railPerfilIds.length < 1) {
    fail('Boot rail perfiles', 'Sin perfiles en rail');
  } else {
    pass('Boot rail perfiles', `${boot.railPerfilIds.length} perfil(es)`);
  }

  if (boot.dashContextId && boot.railPerfilIds.includes(boot.dashContextId)) {
    pass('DashContext alineado al boot', boot.dashContextId);
  } else {
    fail('DashContext alineado al boot', `ctx=${boot.dashContextId} rail=${boot.railPerfilIds.join(',')}`);
  }

  if (boot.railPerfilIds.length >= 2) {
    const first = boot.dashContextId;
    await tapPerfilRailByIndex(page, boot.railPerfilIds[0] === first ? 1 : 0);
    const afterTap = await readDashboardState(page);
    if (afterTap.dashContextId && afterTap.dashContextId !== first) {
      pass('Cambio perfil en rail', `${first} → ${afterTap.dashContextId}`);
    } else {
      fail('Cambio perfil en rail', `sigue en ${afterTap.dashContextId}`);
    }

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.CariHubCore && window.CariHubCore.ready, { timeout: 20000 });
    await page.waitForTimeout(1500);
    const afterReload = await readDashboardState(page);
    if (afterReload.dashContextId === afterTap.dashContextId) {
      pass('Reload conserva perfil activo', afterReload.dashContextId);
    } else {
      fail('Reload conserva perfil activo', `esperado ${afterTap.dashContextId}, got ${afterReload.dashContextId}`);
    }
  } else {
    console.log('SKIP: cuenta con 1 perfil — escenarios multi-tap/reload parcial');
  }

  await page.evaluate(() => {
    document.dispatchEvent(new CustomEvent('dash:logout-request'));
  });
  await page.waitForURL(/index\.html/, { timeout: 15000 });
  const storageAfterLogout = await page.evaluate(() => sessionStorage.getItem('carihub_dash_context'));
  if (!storageAfterLogout) {
    pass('Logout limpia carihub_dash_context', 'null');
  } else {
    fail('Logout limpia carihub_dash_context', storageAfterLogout);
  }

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n--- RESUMEN ---\nOK: ${results.length - failed.length}, FAIL: ${failed.length}`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
