#!/usr/bin/env node
/**
 * BLK-01 Phase 1C-c — emulator-only browser smoke (Edge/Chrome via playwright-core).
 */
import { readFileSync, writeFileSync, mkdirSync, createReadStream, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc } from 'firebase/firestore';
import { assertEmulatorEnvironment, parseEmulatorHost, DEMO_PROJECT_ID } from './lib/blk01-emulator-guard.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const FIXTURES = JSON.parse(readFileSync(join(__dirname, 'blk01-phase1cb-fixtures.json'), 'utf8'));
const RULES = readFileSync(join(__dirname, 'blk01-phase1cb-emulator.rules'), 'utf8');
const IDS = FIXTURES.ids;
const HTTP_PORT = Number(process.env.P1CB_SMOKE_HTTP_PORT || 8766);
const OUT_PATH =
  process.env.P1CB_SMOKE_OUT ||
  join(process.env.TEMP || process.env.TMP || '/tmp', 'blk01-phase1cc-smoke.json');

if (process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.GCLOUD_PROJECT = DEMO_PROJECT_ID;
}

assertEmulatorEnvironment();

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css'
};

function contentType(file) {
  const ext = file.slice(file.lastIndexOf('.'));
  return MIME[ext] || 'application/octet-stream';
}

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      try {
        const url = new URL(req.url, `http://127.0.0.1:${HTTP_PORT}`);
        let p = decodeURIComponent(url.pathname);
        if (p === '/') p = '/blk01-phase1cb-smoke-harness.html';
        const file = join(PUBLIC, p.replace(/^\//, '').replace(/\.\./g, ''));
        if (!existsSync(file) || !statSync(file).isFile()) {
          res.writeHead(404);
          res.end('not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': contentType(file) });
        createReadStream(file).pipe(res);
      } catch (e) {
        res.writeHead(500);
        res.end(String(e));
      }
    });
    server.listen(HTTP_PORT, '127.0.0.1', () => resolve(server));
  });
}

async function seedEmulator() {
  const testEnv = await initializeTestEnvironment({
    projectId: FIXTURES.projectId,
    firestore: { rules: RULES }
  });
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    for (const [id, data] of Object.entries(FIXTURES.perfiles)) {
      await setDoc(doc(db, 'perfiles', id), data);
    }
    for (const [id, data] of Object.entries(FIXTURES.usuarios)) {
      await setDoc(doc(db, 'usuarios', id), data);
    }
  });
  await testEnv.cleanup();
}

async function loadPlaywright() {
  try {
    return await import('playwright-core');
  } catch {
    const mod = await import(join(process.env.TEMP || process.env.TMP || '/tmp', 'blk01-smoke-run', 'node_modules', 'playwright-core', 'index.mjs'));
    return mod;
  }
}

function findBrowserExecutable(pw) {
  const candidates = [
    process.env.P1CB_BROWSER_PATH,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ].filter(Boolean);
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function buildUrl(baseUrl, spec) {
  const q = new URLSearchParams();
  q.set('id', spec.id);
  q.set('emuFlags', spec.flagsOn ? 'on' : 'off');
  if (spec.cacheUid) q.set('cacheUid', spec.cacheUid);
  if (spec.cacheMode) q.set('cacheMode', spec.cacheMode);
  return `${baseUrl}/blk01-phase1cb-smoke-harness.html?${q.toString()}`;
}

async function runCase(browser, baseUrl, spec) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push({ kind: 'page', text: String(e) }));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push({ kind: 'console', text: msg.text() });
  });

  const url = buildUrl(baseUrl, spec);
  let navError = null;
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForFunction(() => window.__P1CB_SMOKE__ && window.__P1CB_SMOKE__.loaded !== undefined, { timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(4000);
  } catch (e) {
    navError = String(e.message || e);
  }

  const evalResult = await page.evaluate(() => {
    const s = window.__P1CB_SMOKE__ || {};
    return {
      title: document.title,
      readyState: document.readyState,
      bodyText: document.getElementById('smoke-root')?.textContent || '',
      smoke: s
    };
  });

  await page.close();

  const smoke = evalResult.smoke || {};
  const pass = spec.validate ? spec.validate(smoke, errors) : !navError && !errors.length;
  const nonFatal404 = errors.length === 1 && /404/.test(errors[0].text || '');
  const effectivePass = pass && (errors.length === 0 || nonFatal404);

  return {
    case: spec.case,
    url,
    httpStatus: navError ? null : 200,
    navError,
    loadOk: !navError,
    jsExecuted: !!smoke,
    flagsOn: spec.flagsOn,
    evalResult,
    consoleErrors: errors,
    blk01AttributedErrors: errors.filter((e) => /blk01|carihub-blk01|carihub-profile-resolver|carihub-owner-hint/i.test(e.text)),
    pass: effectivePass,
    report: {
      pageLoaded: !navError,
      jsExecuted: !!smoke,
      carihubCoreReady: !!smoke.carihubCoreReady,
      firebaseApps: smoke.firebaseApps,
      flagsState: smoke.flags,
      providerAction: smoke.provider && smoke.provider.action,
      resolverSource: smoke.source,
      reads: smoke.reads,
      ids: { __id: smoke.__id, perfilId: smoke.perfilId, uid: smoke.uid },
      cacheAfter: smoke.provider && smoke.provider.cacheAfter,
      kycLeak: smoke.kycLeak,
      render: smoke.render || smoke.nombre || null
    }
  };
}

async function main() {
  console.log('[P1CC smoke] Seeding emulator fixtures…');
  await seedEmulator();

  console.log('[P1CC smoke] Starting static server on', HTTP_PORT);
  const server = await startStaticServer();
  const baseUrl = `http://127.0.0.1:${HTTP_PORT}`;

  const pw = await loadPlaywright();
  const exe = findBrowserExecutable(pw);
  if (!exe) throw new Error('No Edge/Chrome executable found for browser smoke');

  const browser = await pw.chromium.launch({ executablePath: exe, headless: true });
  const cases = [
    {
      case: 'flags-off-legacy',
      id: IDS.legacyBridgeUid,
      flagsOn: false,
      validate(s) {
        return !!s.profile && s.reads.perfiles === 0 && s.resolverActive === false;
      }
    },
    {
      case: 'opaque-perfiles-hit',
      id: IDS.opaquePerfilId,
      flagsOn: true,
      validate(s) {
        return !!s.profile && s.source === 'perfiles';
      }
    },
    {
      case: 'valid-cache-hub-fallback',
      id: IDS.hubFallbackPerfilId,
      flagsOn: true,
      cacheUid: IDS.hubOwnerUid,
      validate(s) {
        return !!s.profile && s.source === 'usuarios_perfilesDetalle' && s.uid === IDS.hubOwnerUid;
      }
    },
    {
      case: 'hub-only-no-hint',
      id: IDS.hubFallbackPerfilId,
      flagsOn: true,
      validate(s) {
        return !s.profile && s.render === 'demo-fallback-null';
      }
    },
    {
      case: 'forged-cache',
      id: IDS.hubFallbackPerfilId,
      flagsOn: true,
      cacheUid: 'uid_p1cb_owner_opaque1',
      validate(s) {
        return !s.profile;
      }
    },
    {
      case: 'wrong-owner',
      id: IDS.hubFallbackPerfilId,
      flagsOn: true,
      cacheUid: 'uid_p1cb_owner_opaque1',
      validate(s) {
        return !s.profile && s.provider && s.provider.cacheAfter == null;
      }
    },
    {
      case: 'expired-cache',
      id: IDS.hubFallbackPerfilId,
      flagsOn: true,
      cacheUid: IDS.hubOwnerUid,
      cacheMode: 'expired',
      validate(s) {
        return !s.profile;
      }
    },
    {
      case: 'corrupted-cache',
      id: IDS.hubFallbackPerfilId,
      flagsOn: true,
      cacheUid: IDS.hubOwnerUid,
      cacheMode: 'corrupted',
      validate(s) {
        return !s.profile;
      }
    },
    {
      case: 'missing-profile',
      id: IDS.missingId,
      flagsOn: true,
      validate(s) {
        return !s.profile;
      }
    },
    {
      case: 'privacy-fixture',
      id: IDS.privacyPerfilId,
      flagsOn: true,
      validate(s) {
        return !!s.profile && s.kycLeak !== true;
      }
    }
  ];

  const results = [];
  for (const spec of cases) {
    console.log('[P1CC smoke] Case:', spec.case);
    results.push(await runCase(browser, baseUrl, spec));
  }
  await browser.close();
  server.close();

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
  console.log('[P1CC smoke] Wrote', OUT_PATH);

  const failed = results.filter((r) => !r.pass || r.blk01AttributedErrors.length);
  if (failed.length) {
    console.error('[P1CC smoke] Failed cases:', failed.map((f) => f.case).join(', '));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
