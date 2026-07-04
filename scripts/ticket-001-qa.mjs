/**
 * TICKET-001 — pruebas manuales automatizadas (servidor local).
 * Uso: node scripts/ticket-001-qa.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

const PORT = 3456;
const BASE = process.argv[2] || `http://127.0.0.1:${PORT}`;
const TEST_ID = 'perfil_test_abc123';

const results = [];

function pass(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ' — ' + detail : ''}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? ' — ' + detail : ''}`);
}

async function startServerIfNeeded() {
  if (process.argv[2]) return null;
  const proc = spawn('npx', ['--yes', 'serve', 'public', '-l', String(PORT)], {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    try {
      const res = await fetch(`${BASE}/perfil.html`);
      if (res.ok) return proc;
    } catch (_) {}
  }
  proc.kill();
  throw new Error('Servidor local no respondió a tiempo');
}

async function testRedirect(page) {
  const url = `${BASE}/perfil.html?id=${TEST_ID}`;
  await page.goto(url, { waitUntil: 'commit', timeout: 15000 });
  await page.waitForURL(
    (u) => {
      const path = u.pathname.replace(/\/$/, '');
      return (path.endsWith('perfil-publico.html') || path.endsWith('perfil-publico'))
        && u.searchParams.get('id') === TEST_ID;
    },
    { timeout: 10000, waitUntil: 'commit' }
  );
  const final = page.url();
  const u = new URL(final);
  const path = u.pathname.replace(/\/$/, '');
  if (!path.endsWith('perfil-publico.html') && !path.endsWith('perfil-publico')) {
    fail('1. Redirect perfil.html', `pathname=${u.pathname}`);
    return;
  }
  if (u.searchParams.get('id') !== TEST_ID) {
    fail('1. Redirect perfil.html', `id=${u.searchParams.get('id')}`);
    return;
  }
  if (u.searchParams.get('from') !== 'resultados') {
    fail('1. Redirect perfil.html', `from=${u.searchParams.get('from')}`);
    return;
  }
  pass('1. Redirect perfil.html', final);
}

async function hookFirebaseInit(context) {
  await context.addInitScript(() => {
    window.__ticket001InitCalls = 0;
    let _firebase = window.firebase;
    Object.defineProperty(window, 'firebase', {
      configurable: true,
      enumerable: true,
      get() {
        return _firebase;
      },
      set(val) {
        _firebase = val;
        if (val && typeof val.initializeApp === 'function' && !val.__ticket001Hooked) {
          const orig = val.initializeApp.bind(val);
          val.initializeApp = function (...args) {
            window.__ticket001InitCalls = (window.__ticket001InitCalls || 0) + 1;
            return orig(...args);
          };
          val.__ticket001Hooked = true;
        }
      }
    });
  });
}

async function collectInitSignals(page) {
  return page.evaluate(() => {
    const appsLen = window.firebase && window.firebase.apps ? window.firebase.apps.length : 0;
    const coreReady = !!(window.CariHubCore && window.CariHubCore.ready);
    const initCalls = window.__ticket001InitCalls || 0;
    return { appsLen, coreReady, initCalls };
  });
}

async function testDashboard(page) {
  const consoleErrors = [];
  const consoleLogs = [];
  page.on('console', (msg) => {
    const t = msg.type();
    const text = msg.text();
    if (t === 'error') consoleErrors.push(text);
    if (/initializeApp|CariHub Core|Firebase/i.test(text)) consoleLogs.push(text);
  });

  const email = process.env.CARIHUB_TEST_EMAIL || '';
  const password = process.env.CARIHUB_TEST_PASSWORD || '';

  if (email && password) {
    await page.goto(`${BASE}/index.html?abrir=login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('#loginEmail', email);
    await page.fill('#loginPassword', password);
    await page.click('button:has-text("Entrar")');
    await page.waitForURL(/dashboard-rentero\.html/, { timeout: 20000 });
  } else {
    await page.goto(`${BASE}/dashboard-rentero.html?preview=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  }

  await page.waitForSelector('#publicationList', { timeout: 15000 });
  await page.waitForFunction(() => window.CariHubCore && window.CariHubCore.ready, { timeout: 20000 });
  await page.waitForTimeout(1500);
  const railItems = await page.locator('#publicationList .dash-activos-tiles [data-tipo], #publicationList button[data-tipo]').count();
  const signals = await collectInitSignals(page);

  const doubleInit = consoleErrors.some((e) => /already exists|duplicate.*app/i.test(e));
  const initErrorBanner = await page.locator('#carihub-init-error-banner').count();

  if (initErrorBanner > 0) {
    fail('2. Dashboard init', 'Banner de error de init visible');
  } else if (!signals.coreReady) {
    fail('2. Dashboard init', 'CariHubCore.ready=false');
  } else if (signals.appsLen !== 1) {
    fail('2. Dashboard init', `firebase.apps.length=${signals.appsLen} (esperado 1)`);
  } else if (signals.initCalls > 1) {
    fail('2. Dashboard init', `initializeApp llamado ${signals.initCalls} veces`);
  } else if (doubleInit) {
    fail('2. Dashboard init', 'Consola reporta app Firebase duplicada');
  } else if (railItems < 1) {
    fail('2. Dashboard rail', `publicationList sin items (${railItems})`);
  } else {
    const mode = email ? 'login real' : 'preview=1 (sin credenciales QA)';
    pass('2. Dashboard auth+rail', `${mode}; apps=${signals.appsLen}; initCalls=${signals.initCalls}; railItems=${railItems}`);
  }

  if (consoleLogs.length) {
    pass('2. Consola init', consoleLogs.slice(0, 3).join(' | '));
  }
  return { signals, consoleErrors, usedLogin: !!(email && password) };
}

async function testRegistroPerfil(page) {
  await page.goto(`${BASE}/registro-perfil.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const state = await page.evaluate(() => {
    const coreReady = !!(window.CariHubCore && window.CariHubCore.ready);
    const btnDisabled = document.getElementById('rpBtnPrimary')?.disabled === true;
    const banner = !!document.getElementById('carihub-init-error-banner');
    let getFirebaseUsesLegacy = false;
    let getFirebaseReturnsCore = false;
    if (window.CariHubRegistroPerfilSubmit) {
      const src = Function.prototype.toString.call(
        Object.getPrototypeOf(window.CariHubRegistroPerfilSubmit).constructor
      );
      // Inspect module source via script tag fetch is unreliable; check global firebase fallback path
    }
    const submitSrc = document.querySelector('script[src*="registro-perfil-submit"]');
    return { coreReady, btnDisabled, banner, hasSubmit: !!window.CariHubRegistroPerfilSubmit };
  });

  const submitJs = await (await fetch(`${BASE}/js/registro-perfil-submit.js`)).text();
  const legacyFallback = /firebase\.auth\(\)|firebase\.firestore\(\)/.test(
    submitJs.replace(/CariHubCore\.auth/g, '').replace(/CariHubCore\.db/g, '')
  );

  const fbProbe = await page.evaluate(() => {
    if (!window.CariHubCore || !window.CariHubCore.ready) return { viaCore: false };
    // Simular getFirebase: solo debe funcionar con CariHubCore
    const hadCore = window.CariHubCore.ready;
    return {
      viaCore: hadCore,
      appsLen: window.firebase?.apps?.length ?? 0
    };
  });

  if (state.banner || state.btnDisabled) {
    fail('3. Registro-perfil init', `banner=${state.banner} btnDisabled=${state.btnDisabled}`);
  } else if (!state.coreReady) {
    fail('3. Registro-perfil init', 'CariHubCore.ready=false');
  } else if (legacyFallback) {
    fail('3. Registro-perfil submit', 'getFirebase aún referencia firebase.* directo');
  } else if (!state.hasSubmit) {
    fail('3. Registro-perfil submit', 'CariHubRegistroPerfilSubmit no cargado');
  } else {
    pass('3. Registro-perfil', `CariHubCore.ready; submit module OK; apps=${fbProbe.appsLen}`);
  }

  // Verificar que submit rechaza sin core (simulación estática del contrato)
  if (!submitJs.includes('return null;') || submitJs.includes('global.firebase.auth()')) {
    fail('3. Registro-perfil fallback', 'Fallback legacy presente en fuente');
  } else {
    pass('3. Sin fallback legacy en getFirebase', 'return null cuando !CariHubCore.ready');
  }
}

async function main() {
  let server = null;
  try {
    server = await startServerIfNeeded();
    const launchOpts = { headless: true };
    try {
      launchOpts.channel = 'msedge';
    } catch (_) {}
    let browser;
    try {
      browser = await chromium.launch(launchOpts);
    } catch (_) {
      try {
        browser = await chromium.launch({ headless: true, channel: 'chrome' });
      } catch (e2) {
        browser = await chromium.launch({ headless: true });
      }
    }
    const context = await browser.newContext();
    await hookFirebaseInit(context);
    const page = await context.newPage();

    await testRedirect(page);
    const dash = await testDashboard(page);
    await testRegistroPerfil(page);

    await browser.close();

    const failed = results.filter((r) => !r.ok);
    console.log('\n--- RESUMEN ---');
    console.log(`Base URL: ${BASE}`);
    console.log(`Pruebas: ${results.length}, OK: ${results.filter((r) => r.ok).length}, FAIL: ${failed.length}`);
    if (!dash?.usedLogin) {
      console.log('NOTA: Prueba 2 usó preview=1 (define CARIHUB_TEST_EMAIL/CARIHUB_TEST_PASSWORD para login real).');
    }
    process.exit(failed.length ? 1 : 0);
  } finally {
    if (server) server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
