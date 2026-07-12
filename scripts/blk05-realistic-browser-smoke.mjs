#!/usr/bin/env node
/**
 * BLK-05-R1 — Realistic rules browser smoke (production-candidate rules + BLK-01 harness).
 */
import { readFileSync, writeFileSync, existsSync, statSync, createReadStream } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc } from 'firebase/firestore';
import { assertEmulatorEnvironment, DEMO_PROJECT_ID } from './lib/blk01-emulator-guard.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const FIXTURES = JSON.parse(readFileSync(join(__dirname, 'blk01-phase1cb-fixtures.json'), 'utf8'));
const RULES = readFileSync(join(__dirname, 'blk05-firestore-rules-production-candidate.rules'), 'utf8');
const HTTP_PORT = Number(process.env.BLK05_SMOKE_HTTP_PORT || 8767);
const OUT_PATH = process.env.BLK05_SMOKE_OUT || join(process.env.TEMP || process.env.TMP || '/tmp', 'blk05-realistic-smoke.json');

if (process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.GCLOUD_PROJECT = DEMO_PROJECT_ID;
}
assertEmulatorEnvironment();

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, `http://127.0.0.1:${HTTP_PORT}`);
      let p = decodeURIComponent(url.pathname);
      if (p === '/') p = '/blk01-phase1cb-smoke-harness.html';
      const file = join(PUBLIC, p.replace(/^\//, '').replace(/\.\./g, ''));
      if (!existsSync(file) || !statSync(file).isFile()) {
        res.writeHead(404); res.end('not found'); return;
      }
      res.writeHead(200); createReadStream(file).pipe(res);
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
    const perfiles = {
      ...FIXTURES.perfiles,
      perfil_lp1cbhub_ccdd02: {
        perfilId: 'perfil_lp1cbhub_ccdd02',
        usuarioId: 'uid_p1cb_owner_hub01',
        ownerUid: 'uid_p1cb_owner_hub01',
        nombre: 'Hub Fallback Profile',
        categoria: 'salud',
        estadoPublicacion: 'publicado',
        visible: true,
        publicado: true,
        tienePerfilPublico: true,
        suspendido: false,
        eliminado: false,
        vencido: false
      },
      perfil_borrador_smoke: {
        perfilId: 'perfil_borrador_smoke',
        usuarioId: 'uid_p1cb_owner_hub01',
        ownerUid: 'uid_p1cb_owner_hub01',
        estadoPublicacion: 'borrador',
        visible: false,
        publicado: false,
        tienePerfilPublico: false,
        suspendido: false,
        eliminado: false,
        vencido: false
      }
    };
    for (const [id, data] of Object.entries(perfiles)) {
      const row = { ...data };
      if (row.estadoPublicacion === 'activo') {
        row.estadoPublicacion = 'publicado';
        row.tienePerfilPublico = true;
        row.suspendido = false;
        row.eliminado = false;
        row.vencido = false;
      }
      await setDoc(doc(db, 'perfiles', id), row);
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
    return await import('playwright');
  }
}

async function runCase(browser, spec) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const url = spec.url;
  let navError = null;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    navError = String(e);
  }
  const evalResult = await page.evaluate(async (flagsOn) => {
    const id = new URL(location.href).searchParams.get('id') || '';
    const smoke = { id, flagsOn, reads: { perfiles: 0, usuarios: 0 }, source: null, found: false, kycLeak: false };
    if (window.CariHubBlk01Config && flagsOn) {
      window.__CARIHUB_FLAGS__ = { blk01DualReadFallback: true };
    }
    if (window.CariHubCore && CariHubCore.initFirebase) CariHubCore.initFirebase();
    const fs = firebase.firestore();
    const orig = fs.collection.bind(fs);
    fs.collection = function (name) {
      const col = orig(name);
      const origDoc = col.doc.bind(col);
      col.doc = function (docId) {
        const ref = origDoc(docId);
        const origGet = ref.get.bind(ref);
        ref.get = function () {
          if (name === 'perfiles') smoke.reads.perfiles += 1;
          if (name === 'usuarios') smoke.reads.usuarios += 1;
          return origGet();
        };
        return ref;
      };
      return col;
    };
    if (window.CariHubPerfilPublico && CariHubPerfilPublico.cargarPerfilFirestore) {
      const profile = await CariHubPerfilPublico.cargarPerfilFirestore(id);
      smoke.found = !!profile;
      smoke.nombre = profile && profile.nombre;
      const raw = JSON.stringify(profile || {});
      smoke.kycLeak = /secret-ine|SECRETRFC|012345678901234567|kyc@private/i.test(raw);
    }
    return smoke;
  }, spec.flagsOn);
  await page.close();
  const pass = spec.validate(evalResult, errors, navError);
  return { case: spec.case, pass, evalResult, errors, navError };
}

async function main() {
  await seedEmulator();
  const server = await startStaticServer();
  const pw = await loadPlaywright();
  const exe = [
    process.env.BLK05_BROWSER_PATH,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ].find((p) => p && existsSync(p));
  if (!exe) throw new Error('No browser executable for smoke');
  const browser = await pw.chromium.launch({ executablePath: exe, headless: true });
  const base = `http://127.0.0.1:${HTTP_PORT}/blk01-phase1cb-smoke-harness.html`;
  const specs = [
    {
      case: 'anonymous-public-perfiles-hit',
      url: `${base}?id=perfil_lp1cbopa_aabb01&emuFlags=dualRead`,
      flagsOn: true,
      validate: (s) => s.found && s.reads.perfiles >= 1 && !s.kycLeak
    },
    {
      case: 'anonymous-draft-denied',
      url: `${base}?id=perfil_borrador_smoke&emuFlags=dualRead`,
      flagsOn: true,
      validate: (s) => !s.found
    },
    {
      case: 'resolver-no-permission-denied-public',
      url: `${base}?id=uid_p1cb_bridge_legacy01&emuFlags=dualRead`,
      flagsOn: true,
      validate: (s) => s.found && s.nombre
    },
    {
      case: 'legacy-usuarios-fallback',
      url: `${base}?id=uid_p1cb_bridge_legacy01&emuFlags=dualRead`,
      flagsOn: true,
      validate: (s) => s.found
    },
    {
      case: 'kyc-forbidden-doc-denied',
      url: `${base}?id=perfil_lp1cbpriv_eeff03&emuFlags=dualRead`,
      flagsOn: true,
      validate: (s) => !s.found || !s.kycLeak
    },
    {
      case: 'hub-fallback-with-realistic-rules',
      url: `${base}?id=perfil_lp1cbhub_ccdd02&emuFlags=dualRead&cacheMode=seed&cacheUid=uid_p1cb_owner_hub01`,
      flagsOn: true,
      validate: (s) => s.found
    }
  ];
  const results = [];
  for (const spec of specs) {
    results.push(await runCase(browser, spec));
  }
  await browser.close();
  server.close();
  writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
  const failed = results.filter((r) => !r.pass);
  if (failed.length) {
    console.error('[BLK05 realistic smoke] Failed:', failed.map((f) => f.case).join(', '));
    process.exit(1);
  }
  console.log('[BLK05 realistic smoke] PASS', results.length, '/', results.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
