#!/usr/bin/env node
/**
 * BLK-01 Phase 1C-b — emulator-only browser smoke (Edge/Chrome via playwright-core).
 *
 * Prerequisites:
 *   - Firestore emulator running on FIRESTORE_EMULATOR_HOST
 *   - Static server on P1CB_SMOKE_HTTP_PORT (default 8766)
 *   - Seed applied via rules-unit-testing in this script
 *
 * Usage:
 *   firebase emulators:exec --only firestore "node scripts/blk01-phase1cb-browser-smoke.mjs"
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
  join(process.env.TEMP || process.env.TMP || '/tmp', 'blk01-phase1cb-smoke.json');

if (process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.GCLOUD_PROJECT = DEMO_PROJECT_ID;
}

assertEmulatorEnvironment();
const emu = parseEmulatorHost();

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

async function runCase(browser, baseUrl, spec) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push({ kind: 'page', text: String(e) }));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push({ kind: 'console', text: msg.text() });
  });

  const url = `${baseUrl}/blk01-phase1cb-smoke-harness.html?id=${encodeURIComponent(spec.id)}&emuFlags=${spec.flagsOn ? 'on' : 'off'}${spec.hintUid ? `&hintUid=${encodeURIComponent(spec.hintUid)}` : ''}`;
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

  return {
    case: spec.case,
    url,
    httpStatus: navError ? null : 200,
    navError,
    loadOk: !navError,
    jsExecuted: !!evalResult.smoke,
    flagsOn: spec.flagsOn,
    evalResult,
    consoleErrors: errors,
    blk01AttributedErrors: errors.filter((e) => /blk01|carihub-blk01|carihub-profile-resolver/i.test(e.text))
  };
}

async function main() {
  console.log('[P1CB smoke] Seeding emulator fixtures…');
  await seedEmulator();

  console.log('[P1CB smoke] Starting static server on', HTTP_PORT);
  const server = await startStaticServer();
  const baseUrl = `http://127.0.0.1:${HTTP_PORT}`;

  const pw = await loadPlaywright();
  const exe = findBrowserExecutable(pw);
  if (!exe) throw new Error('No Edge/Chrome executable found for browser smoke');

  const browser = await pw.chromium.launch({ executablePath: exe, headless: true });
  const cases = [
    { case: 'legacy-bridge', id: IDS.legacyBridgeUid, flagsOn: true },
    { case: 'opaque-perfil', id: IDS.opaquePerfilId, flagsOn: true },
    { case: 'hub-fallback', id: IDS.hubFallbackPerfilId, flagsOn: true, hintUid: IDS.hubOwnerUid },
    { case: 'missing-id', id: IDS.missingId, flagsOn: true },
    { case: 'demo-flags-off', id: IDS.demoControlId, flagsOn: false }
  ];

  const results = [];
  for (const spec of cases) {
    console.log('[P1CB smoke] Case:', spec.case);
    results.push(await runCase(browser, baseUrl, spec));
  }
  await browser.close();
  server.close();

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
  console.log('[P1CB smoke] Wrote', OUT_PATH);

  const failed = results.filter((r) => !r.loadOk || r.blk01AttributedErrors.length);
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
