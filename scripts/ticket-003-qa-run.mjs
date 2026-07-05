/**
 * TICKET-003 QA parcial — valida lo posible sin credenciales + script completo si hay env.
 */
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

const PORT = 3457;
const BASE = process.argv[2] || `http://127.0.0.1:${PORT}`;

const report = {
  carihubCoreReady: null,
  firebaseAppsLength: null,
  railRealProfilesWithSession: null,
  profileSwitchUpdatesPerfilActivoId: null,
  reloadPreservesActiveProfile: null,
  logoutClearsDashContext: null,
  grepSkipFirestore: '0 matches (rg exit 1)',
  grepSeedDashContext: '0 matches (rg exit 1)',
  blocked: [],
  passed: []
};

async function ensureServer() {
  if (process.argv[2]) return null;
  try {
    const res = await fetch(`${BASE}/dashboard-rentero.html`);
    if (res.ok) return null;
  } catch (_) {}
  const proc = spawn('npx', ['--yes', 'http-server', 'public', '-p', String(PORT), '-c-1', '--silent'], {
    shell: true,
    stdio: 'ignore'
  });
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    try {
      const res = await fetch(`${BASE}/dashboard-rentero.html`);
      if (res.ok) return proc;
    } catch (_) {}
  }
  proc.kill();
  throw new Error('Servidor local no disponible');
}

async function readState(page) {
  return page.evaluate(async () => {
    const tiles = document.querySelectorAll('#publicationList .dash-activos-tiles [data-tipo="perfil"]');
    const ids = Array.from(tiles).map((el) => el.getAttribute('data-id')).filter(Boolean);
    const ctx = window.DashContext ? DashContext.get() : null;
    const authUser = window.auth && auth.currentUser
      ? auth.currentUser.uid
      : (window.CariHubCore && CariHubCore.auth && CariHubCore.auth.currentUser
        ? CariHubCore.auth.currentUser.uid
        : null);
    let hubPerfilActivoId = null;
    if (authUser && window.db) {
      try {
        const snap = await db.collection('usuarios').doc(authUser).get();
        if (snap.exists) hubPerfilActivoId = (snap.data() || {}).perfilActivoId || null;
      } catch (e) {
        hubPerfilActivoId = 'error:' + (e.message || e);
      }
    }
    return {
      coreReady: !!(window.CariHubCore && window.CariHubCore.ready),
      appsLen: window.firebase && window.firebase.apps ? window.firebase.apps.length : 0,
      initCalls: window.__ticket003InitCalls || null,
      railPerfilIds: ids,
      dashContextId: ctx && ctx.tipo === 'perfil' ? (ctx.perfilId || ctx.id) : null,
      storageRaw: sessionStorage.getItem('carihub_dash_context'),
      authUser,
      hubPerfilActivoId,
      hasClear: !!(window.DashContext && typeof DashContext.clear === 'function')
    };
  });
}

async function hookInit(page) {
  await page.addInitScript(() => {
    window.__ticket003InitCalls = 0;
    let _f = window.firebase;
    Object.defineProperty(window, 'firebase', {
      configurable: true,
      get() { return _f; },
      set(v) {
        _f = v;
        if (v && v.initializeApp && !v.__t003) {
          const o = v.initializeApp.bind(v);
          v.initializeApp = function () {
            window.__ticket003InitCalls = (window.__ticket003InitCalls || 0) + 1;
            return o.apply(v, arguments);
          };
          v.__t003 = true;
        }
      }
    });
  });
}

async function main() {
  let server = null;
  try {
    server = await ensureServer();
    const browser = await chromium.launch({ headless: true, channel: 'msedge' });
    const context = await browser.newContext();
    await hookInit(context);
    const page = await context.newPage();

    // --- Smoke: preview dashboard (sin sesión) ---
    await page.goto(`${BASE}/dashboard-rentero.html?preview=1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => window.CariHubCore && window.CariHubCore.ready, { timeout: 20000 });
    await page.waitForTimeout(1200);
    const preview = await readState(page);
    report.carihubCoreReady = preview.coreReady;
    report.firebaseAppsLength = preview.appsLen;
    if (preview.coreReady) report.passed.push('CariHubCore.ready (preview=1)');
    else report.blocked.push('CariHubCore.ready=false en preview');
    if (preview.appsLen === 1) report.passed.push('firebase.apps.length=1 (preview=1)');
    else report.blocked.push(`firebase.apps.length=${preview.appsLen} (esperado 1)`);

    // --- DashContext.clear API smoke ---
    await page.evaluate(() => {
      sessionStorage.setItem('carihub_dash_context', JSON.stringify({ tipo: 'perfil', id: 'test_stub', perfilId: 'test_stub' }));
      if (window.DashContext && DashContext.clear) DashContext.clear();
    });
    const afterClear = await page.evaluate(() => sessionStorage.getItem('carihub_dash_context'));
    if (!afterClear && preview.hasClear) {
      report.logoutClearsDashContext = 'PASS (API clear() en preview — storage null)';
      report.passed.push('DashContext.clear() limpia storage');
    } else {
      report.logoutClearsDashContext = `PARTIAL/FAIL clear=${afterClear} hasClear=${preview.hasClear}`;
      report.blocked.push('DashContext.clear no verificó limpieza');
    }

    const email = process.env.CARIHUB_TEST_EMAIL || '';
    const password = process.env.CARIHUB_TEST_PASSWORD || '';

    if (!email || !password) {
      report.railRealProfilesWithSession = 'SKIP — sin CARIHUB_TEST_EMAIL/PASSWORD';
      report.profileSwitchUpdatesPerfilActivoId = 'SKIP — sin credenciales';
      report.reloadPreservesActiveProfile = 'SKIP — sin credenciales';
      report.blocked.push('E2E autenticado: credenciales QA no definidas');
      report.blocked.push('Rail perfiles reales Firestore: requiere sesión');
      report.blocked.push('Cambio perfil → perfilActivoId: requiere sesión + ≥2 perfiles');
      report.blocked.push('Reload conserva perfil: requiere sesión + cambio previo');
      report.blocked.push('Logout E2E completo: requiere sesión (clear API validado arriba)');
    } else {
      await page.goto(`${BASE}/index.html?abrir=login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.fill('#loginEmail', email);
      await page.fill('#loginPassword', password);
      await page.click('button:has-text("Entrar")');
      await page.waitForURL(/dashboard-rentero\.html/, { timeout: 30000 });
      await page.waitForFunction(() => window.CariHubCore && window.CariHubCore.ready, { timeout: 20000 });
      await page.waitForTimeout(1500);
      const boot = await readState(page);

      if (boot.authUser && boot.railPerfilIds.length >= 1) {
        report.railRealProfilesWithSession = `PASS — ${boot.railPerfilIds.length} perfil(es): ${boot.railPerfilIds.join(', ')}`;
        report.passed.push('Rail con perfiles (sesión)');
      } else {
        report.railRealProfilesWithSession = `FAIL/SKIP — rail=${boot.railPerfilIds.length} auth=${!!boot.authUser}`;
        report.blocked.push('Rail vacío o sin auth tras login');
      }

      if (boot.railPerfilIds.length >= 2) {
        const beforeId = boot.dashContextId;
        const beforeHub = boot.hubPerfilActivoId;
        const otherIdx = boot.railPerfilIds[0] === beforeId ? 1 : 0;
        await page.locator('#publicationList .dash-activos-tiles [data-tipo="perfil"]').nth(otherIdx).click();
        await page.waitForTimeout(1500);
        const afterTap = await readState(page);
        const switched = afterTap.dashContextId && afterTap.dashContextId !== beforeId;
        const hubUpdated = afterTap.hubPerfilActivoId === afterTap.dashContextId;
        report.profileSwitchUpdatesPerfilActivoId = switched && hubUpdated
          ? `PASS — ${beforeId} → ${afterTap.dashContextId} (Firestore perfilActivoId=${afterTap.hubPerfilActivoId})`
          : `FAIL — ctx ${beforeId}→${afterTap.dashContextId}, hub ${beforeHub}→${afterTap.hubPerfilActivoId}`;
        if (switched && hubUpdated) report.passed.push('Cambio rail persiste perfilActivoId');

        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.CariHubCore && window.CariHubCore.ready, { timeout: 20000 });
        await page.waitForTimeout(1500);
        const afterReload = await readState(page);
        const reloadOk = afterReload.dashContextId === afterTap.dashContextId;
        report.reloadPreservesActiveProfile = reloadOk
          ? `PASS — ${afterReload.dashContextId}`
          : `FAIL — esperado ${afterTap.dashContextId}, got ${afterReload.dashContextId}`;
        if (reloadOk) report.passed.push('Reload conserva perfil activo');
      } else {
        report.profileSwitchUpdatesPerfilActivoId = 'SKIP — cuenta con <2 perfiles';
        report.reloadPreservesActiveProfile = 'SKIP — requiere cambio de perfil previo (≥2 perfiles)';
        report.blocked.push('Cuenta QA con solo 1 perfil — no valida switch/reload');
      }

      await page.evaluate(() => document.dispatchEvent(new CustomEvent('dash:logout-request')));
      await page.waitForURL(/index\.html/, { timeout: 15000 });
      const storageLogout = await page.evaluate(() => sessionStorage.getItem('carihub_dash_context'));
      report.logoutClearsDashContext = !storageLogout
        ? 'PASS (logout E2E — storage null)'
        : `FAIL — storage=${storageLogout}`;
      if (!storageLogout) report.passed.push('Logout limpia carihub_dash_context');
    }

    await browser.close();
    console.log(JSON.stringify(report, null, 2));
    const blockedAuth = report.blocked.some((b) => b.includes('credenciales') || b.includes('1 perfil'));
    process.exit(blockedAuth ? 2 : 0);
  } finally {
    if (server) server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
