#!/usr/bin/env node
/**
 * E2E Browser — Auth + Firestore (no photos) against local Emulator Suite.
 *
 * Requires FIRESTORE_EMULATOR_HOST + FIREBASE_AUTH_EMULATOR_HOST (via emulators:exec)
 * or a long-running suite already up with those env vars.
 *
 * Usage:
 *   firebase emulators:exec --only auth,firestore \
 *     "node scripts/e2e-browser-auth-firestore.mjs"
 *
 * Serve: starts an ephemeral static server on public/ (default :5191).
 * Opt-in: all pages use ?firebaseEmulator=1
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const require = createRequire(import.meta.url);

const HTTP_PORT = Number(process.env.E2E_HTTP_PORT || 5191);
const BASE = `http://127.0.0.1:${HTTP_PORT}`;
const EDGE =
  process.env.EDGE_PATH ||
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const FIXTURE = {
  email: `e2e.browser.${Date.now()}@example.com`,
  password: 'E2eBrowser!23456',
  alias: 'E2E Luna Browser',
  descripcionCorta: 'Perfil E2E controlado sin fotografías para validar Auth y Firestore.',
  descripcion: 'Descripción larga E2E: acompañante de prueba local, sin datos sensibles.',
  categoria: 'escort',
  subcategoria: 'Independientes',
  subcategoriaId: 'independientes',
  sectorId: 'adultos',
  pais: 'México',
  estado: 'Jalisco',
  ciudad: 'Guadalajara',
  zona: 'Centro',
  whatsapp: '3312345678',
  telefono: '3312345679',
  telegram: 'e2e_luna_browser',
  correoPublico: 'e2e.luna.public@example.com',
  edad: '28',
  precioDesde: '1500'
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon'
};

function assertLocalEnv() {
  const fsHost = process.env.FIRESTORE_EMULATOR_HOST;
  const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  if (!fsHost || !/^(127\.0\.0\.1|localhost):/.test(fsHost)) {
    console.error('[e2e-browser] ABORT: FIRESTORE_EMULATOR_HOST must be local');
    process.exit(1);
  }
  if (!authHost || !/(127\.0\.0\.1|localhost)/.test(authHost)) {
    console.error('[e2e-browser] ABORT: FIREBASE_AUTH_EMULATOR_HOST must be local');
    process.exit(1);
  }
}

function loadAdmin() {
  try {
    return require('firebase-admin');
  } catch {
    return require(join(ROOT, 'functions', 'node_modules', 'firebase-admin'));
  }
}

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      try {
        const url = new URL(req.url || '/', `http://127.0.0.1:${HTTP_PORT}`);
        let pathname = decodeURIComponent(url.pathname);
        if (pathname === '/') pathname = '/index.html';
        const filePath = join(PUBLIC, pathname.replace(/^\//, ''));
        if (!filePath.startsWith(PUBLIC) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
          res.writeHead(404);
          res.end('not found');
          return;
        }
        const ext = extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(readFileSync(filePath));
      } catch (err) {
        res.writeHead(500);
        res.end(String(err && err.message ? err.message : err));
      }
    });
    server.listen(HTTP_PORT, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

function withEmu(path) {
  const u = new URL(path, BASE);
  u.searchParams.set('firebaseEmulator', '1');
  return u.toString();
}

function approveUid(uid) {
  const script = join(ROOT, 'scripts', 'e2e-emulator-approve-profile.mjs');
  const r = spawnSync(process.execPath, [script, `--uid=${uid}`], {
    env: process.env,
    encoding: 'utf8'
  });
  process.stdout.write(r.stdout || '');
  process.stderr.write(r.stderr || '');
  if (r.status !== 0) throw new Error('approve script failed');
}

async function main() {
  assertLocalEnv();
  const report = {
    ok: false,
    fixture: { email: FIXTURE.email, alias: FIXTURE.alias },
    optIn: {},
    auth: {},
    firestoreBefore: null,
    firestoreAfter: null,
    results: {},
    perfil: {},
    contacts: {},
    socialAbsence: {},
    dashboard: {},
    navigation: {},
    consoleErrors: [],
    pageErrors: [],
    networkToEmulator: [],
    cleanup: {}
  };

  const admin = loadAdmin();
  const projectId = process.env.GCLOUD_PROJECT || 'carihub-app';
  if (!admin.apps.length) admin.initializeApp({ projectId });
  const db = admin.firestore();

  const server = await startStaticServer();
  console.log('[e2e-browser] static server', BASE);

  const launchOpts = { headless: true };
  if (existsSync(EDGE)) launchOpts.executablePath = EDGE;
  const browser = await chromium.launch(launchOpts);
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') report.consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => report.pageErrors.push(String(err)));
  page.on('request', (req) => {
    const u = req.url();
    if (u.includes('127.0.0.1:8080') || u.includes('localhost:8080') ||
        u.includes('127.0.0.1:9099') || u.includes('localhost:9099')) {
      report.networkToEmulator.push({ method: req.method(), url: u.slice(0, 180) });
    }
  });

  let uid = '';
  let perfilId = '';

  try {
    // ── Opt-in gate on localhost ──────────────────────────────────────
    await page.goto(withEmu('/registro-perfil.html'), { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForFunction(() => window.CariHubCore && window.CariHubCore.ready, null, { timeout: 30000 });
    report.optIn = await page.evaluate(() => ({
      hostname: location.hostname,
      usingEmulators: !!(window.CariHubCore && CariHubCore.usingEmulators),
      shouldUse: !!(window.CariHubCore && CariHubCore.shouldUseEmulators && CariHubCore.shouldUseEmulators()),
      query: location.search
    }));
    if (!report.optIn.usingEmulators) {
      throw new Error('Opt-in failed: CariHubCore.usingEmulators !== true');
    }

    // Without opt-in must stay off — probe in an isolated context so we do not
    // warm a production Firestore client before the emulator submit path.
    {
      const probe = await context.newPage();
      await probe.goto(`${BASE}/registro-perfil.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await probe.waitForFunction(() => window.CariHubCore && window.CariHubCore.ready, null, { timeout: 30000 });
      const off = await probe.evaluate(() => !!(window.CariHubCore && CariHubCore.usingEmulators));
      report.optIn.withoutQueryUsesEmulators = off;
      await probe.close();
      if (off) throw new Error('Opt-in leaked: emulators ON without ?firebaseEmulator=1');
    }

    // Fresh emulator page for Auth + Firestore submit
    await page.goto(withEmu('/registro-perfil.html'), { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForFunction(
      () => window.CariHubCore && CariHubCore.usingEmulators && window.CariHubRegistroPerfilSubmit,
      null,
      { timeout: 60000 }
    );
    // Warm Firestore emulator connectivity before submit
    await page.evaluate(async () => {
      try {
        await CariHubCore.db.collection('_e2e_ping').doc('ping').get();
      } catch (e) {
        /* permission-denied / not-found still proves transport is alive */
        if (String(e && e.code ? e.code : e).includes('offline')) throw e;
      }
    });

    const submitResult = await page.evaluate(async (F) => {
      const draft = {
        imagenesPublicas: {},
        schemaResuelto: {
          identidad: {
            arquetipo: 'persona',
            tipoPerfil: 'persona',
            formularioId: 'adultos-escort-independientes'
          }
        },
        contexto: {
          categoriaPrincipal: F.categoria,
          categoriaSolicitada: F.categoria,
          subcategoria: F.subcategoria,
          subcategoriaSolicitada: F.subcategoria,
          subcategoriaId: F.subcategoriaId,
          sectorId: F.sectorId,
          arquetipo: 'persona',
          tipoPerfil: 'persona',
          formularioId: 'adultos-escort-independientes'
        },
        camposPublicos: {
          alias: F.alias,
          descripcionCorta: F.descripcionCorta,
          pais: F.pais,
          estado: F.estado,
          ciudad: F.ciudad,
          zona: F.zona,
          edad: F.edad,
          precioDesde: F.precioDesde,
          bloquesPublicos: {
            sobreMi: F.descripcion,
            tagline: F.descripcionCorta
          }
        },
        contactoPublico: {
          whatsappActivo: true,
          telegramActivo: true,
          telefonoActivo: true,
          gmailActivo: true,
          correoActivo: true,
          mensajeInternoActivo: false,
          whatsapp: F.whatsapp,
          telegram: F.telegram,
          telefono: F.telefono,
          correo: F.correoPublico
        }
      };
      const priv = {
        correoAcceso: F.email,
        contrasenaAcceso: F.password,
        telefonoPrivado: '3399998877',
        correoContactoAdmin: F.email,
        domicilioPrivado: 'PRIVADO-NO-PUBLICAR Calle Falsa 123',
        mayorEdadConfirmado: true,
        aceptoCrearCuenta: true,
        fotosPropioContenido: true,
        publicacionVoluntaria: true,
        terminosAceptados: true,
        aceptoCondicionesUso: true,
        aceptoPoliticaPrivacidad: true,
        autorizoRevisionManual: true,
        validacionDerechosImagenes: true,
        validacionContenidoLegal: true
      };
      const result = await CariHubRegistroPerfilSubmit.submitRegistroPerfil(draft, priv);
      const snap = await CariHubCore.db.collection('usuarios').doc(result.uid).get();
      const data = snap.exists ? snap.data() : null;
      const authUser = CariHubCore.auth.currentUser;
      return {
        uid: result.uid,
        perfilId: result.perfilId,
        authEmail: authUser && authUser.email,
        authUid: authUser && authUser.uid,
        docExists: snap.exists,
        aprobado: data && data.aprobado,
        activo: data && data.activo,
        vencido: data && data.vencido,
        estadoRevision: data && data.estadoRevision,
        estadoPago: data && data.estadoPago,
        mensajeInternoActivo: data && data.contactoPublico && data.contactoPublico.mensajeInternoActivo,
        nombre: data && data.nombre,
        categoria: data && data.categoria,
        subcategoria: data && data.subcategoria,
        subcategoriaId: data && data.subcategoriaId,
        pais: data && data.pais,
        estado: data && data.estado,
        ciudad: data && data.ciudad,
        hasDatosPrivados: !!(data && data.datosPrivados),
        domicilioPrivado: data && data.datosPrivados && data.datosPrivados.domicilio,
        fotoURL: data && data.fotoURL,
        usingEmulators: CariHubCore.usingEmulators
      };
    }, FIXTURE);

    uid = submitResult.uid;
    perfilId = submitResult.perfilId;
    report.auth = {
      uid,
      perfilId,
      email: submitResult.authEmail,
      authUidMatches: submitResult.authUid === uid
    };
    report.firestoreBefore = submitResult;

    if (submitResult.aprobado !== false || submitResult.activo !== false) {
      throw new Error('Initial flags must be aprobado/activo false');
    }
    if (submitResult.mensajeInternoActivo !== false) {
      throw new Error('mensajeInternoActivo must be false');
    }

    // Admin-side before snapshot (emulator only)
    const beforeSnap = await db.collection('usuarios').doc(uid).get();
    report.firestoreBefore.admin = beforeSnap.exists ? {
      aprobado: beforeSnap.data().aprobado,
      activo: beforeSnap.data().activo,
      estadoRevision: beforeSnap.data().estadoRevision,
      estadoPago: beforeSnap.data().estadoPago,
      nombre: beforeSnap.data().nombre
    } : null;

    approveUid(uid);

    const afterSnap = await db.collection('usuarios').doc(uid).get();
    const after = afterSnap.data() || {};
    report.firestoreAfter = {
      aprobado: after.aprobado,
      activo: after.activo,
      vencido: after.vencido,
      estadoRevision: after.estadoRevision,
      estadoPago: after.estadoPago,
      fechaVencimiento: after.fechaVencimiento || null
    };
    if (after.aprobado !== true || after.activo !== true || after.estadoPago !== 'gratis_30_dias') {
      throw new Error('Approve transition failed: ' + JSON.stringify(report.firestoreAfter));
    }

    // ── Results (real emulator query) ─────────────────────────────────
    const resultsUrl = withEmu(
      `/resultados.html?categoria=${encodeURIComponent(FIXTURE.categoria)}` +
        `&subcategoria=${encodeURIComponent(FIXTURE.subcategoriaId)}` +
        `&pais=${encodeURIComponent(FIXTURE.pais)}` +
        `&estado=${encodeURIComponent(FIXTURE.estado)}` +
        `&ciudad=${encodeURIComponent(FIXTURE.ciudad)}`
    );
    await page.goto(resultsUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForFunction(
      () => window.CariHubCore && CariHubCore.usingEmulators && window.CariHubResultadosRegistrados,
      null,
      { timeout: 45000 }
    );
    await page.waitForTimeout(2500);

    report.results = await page.evaluate(async (expected) => {
      const regs = await CariHubResultadosRegistrados.cargar(true);
      const match = (regs || []).find((p) => p.__id === expected.uid || p.nombre === expected.alias);
      const cards = Array.from(document.querySelectorAll(
        'a[href*="perfil-publico"], .card a, [data-perfil-id], article a, .res-card a, .tarjeta a'
      ));
      const hrefs = cards.map((a) => a.getAttribute('href') || '').filter(Boolean);
      const cardHref = hrefs.find((h) => h.includes(expected.uid) || h.includes('perfil-publico')) || '';
      const bodyText = document.body.innerText || '';
      return {
        usingEmulators: CariHubCore.usingEmulators,
        registeredCount: (regs || []).length,
        matchFound: !!match,
        matchId: match && (match.__id || match.uid),
        matchNombre: match && match.nombre,
        matchRegistrado: !!(match && match.__registrado),
        cardHref,
        nameVisibleInDom: bodyText.includes(expected.alias),
        urlPerfil: match && CariHubResultadosRegistrados.urlPerfil
          ? CariHubResultadosRegistrados.urlPerfil(match.__id || expected.uid, {
              categoria: expected.categoria,
              pais: expected.pais,
              estado: expected.estado,
              ciudad: expected.ciudad
            })
          : null
      };
    }, { uid, alias: FIXTURE.alias, categoria: FIXTURE.categoria, pais: FIXTURE.pais, estado: FIXTURE.estado, ciudad: FIXTURE.ciudad });

    if (!report.results.matchFound || !report.results.matchRegistrado) {
      throw new Error('Results did not return registered profile from emulator query');
    }
    if (!report.networkToEmulator.some((n) => n.url.includes(':8080'))) {
      throw new Error('No Firestore emulator network traffic observed for Results');
    }

    const perfilPath = report.results.urlPerfil || `perfil-publico.html?id=${uid}&from=resultados`;
    const perfilUrl = withEmu('/' + String(perfilPath).replace(/^\//, ''));

    await page.goto(perfilUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(3000);

    report.perfil = await page.evaluate((expected) => {
      const text = document.body.innerText || '';
      const html = document.documentElement.innerHTML || '';
      const wa = Array.from(document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]'))
        .some((a) => getComputedStyle(a).display !== 'none');
      const tel = Array.from(document.querySelectorAll('a[href^="tel:"]'))
        .some((a) => getComputedStyle(a).display !== 'none');
      const tg = Array.from(document.querySelectorAll('a[href*="t.me"], a[href*="telegram"]'))
        .some((a) => getComputedStyle(a).display !== 'none');
      const mail = Array.from(document.querySelectorAll('a[href^="mailto:"]'))
        .some((a) => getComputedStyle(a).display !== 'none');
      return {
        usingEmulators: !!(window.CariHubCore && CariHubCore.usingEmulators),
        hasNombre: text.includes(expected.alias),
        hasDescripcion: text.includes('E2E') || text.includes(expected.descripcionCorta.slice(0, 20)),
        hasCategoriaHint: /cariños|escort|independiente/i.test(text + html),
        hasPais: text.includes(expected.pais) || /m[eé]xico/i.test(text),
        hasEstado: text.includes(expected.estado) || /jalisco/i.test(text),
        hasCiudad: text.includes(expected.ciudad) || /guadalajara/i.test(text),
        whatsappVisible: wa,
        telefonoVisible: tel,
        telegramVisible: tg,
        correoVisible: mail,
        leakedPrivateDomicilio: text.includes('PRIVADO-NO-PUBLICAR'),
        leakedPassword: text.includes(expected.password)
      };
    }, FIXTURE);

    report.socialAbsence = await page.evaluate(() => {
      const text = document.body.innerText || '';
      const msgLinks = Array.from(document.querySelectorAll('a[href*="abrir=mensajes"], a[href*="msg"]'))
        .filter((a) => getComputedStyle(a).display !== 'none' && !a.classList.contains('hidden'));
      const navMsg = Array.from(document.querySelectorAll('.pnav__label, nav a, [data-nav]'))
        .filter((el) => /mensajes/i.test(el.textContent || '') && getComputedStyle(el).display !== 'none');
      const feed = document.querySelector('.playout__feed-pair, [data-feed], .feed-red');
      return {
        visibleMsgLinks: msgLinks.length,
        navMensajesVisible: navMsg.length,
        feedHidden: !feed || getComputedStyle(feed).display === 'none',
        textHasEstados: /\bestados\b/i.test(text) && !/unidos|méxico/i.test(text),
        textHasLives: /\blives?\b/i.test(text),
        directoryMode: !!(window.CarihubDirectoryMode && CarihubDirectoryMode.isDirectoryMode())
      };
    });

    report.contacts = {
      whatsapp: report.perfil.whatsappVisible,
      telefono: report.perfil.telefonoVisible,
      telegram: report.perfil.telegramVisible,
      correo: report.perfil.correoVisible,
      noPrivateLeak: !report.perfil.leakedPrivateDomicilio && !report.perfil.leakedPassword
    };

    // Refresh Results + Perfil
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const afterRefreshPerfil = await page.evaluate((alias) => (document.body.innerText || '').includes(alias), FIXTURE.alias);
    await page.goto(resultsUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const afterRefreshResults = await page.evaluate((alias) => (document.body.innerText || '').includes(alias), FIXTURE.alias);
    report.navigation.refreshPerfilOk = afterRefreshPerfil;
    report.navigation.refreshResultsOk = afterRefreshResults;

    // Back/forward
    await page.goto(perfilUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(1000);
    await page.goForward({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(1000);
    report.navigation.backForwardAliasVisible = await page.evaluate(
      (alias) => (document.body.innerText || '').includes(alias),
      FIXTURE.alias
    );

    // Dashboard (basic, if session persists)
    await page.goto(withEmu('/dashboard-rentero.html'), { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(2500);
    report.dashboard = await page.evaluate((alias) => {
      const text = document.body.innerText || '';
      const auth = window.CariHubCore && CariHubCore.auth && CariHubCore.auth.currentUser;
      return {
        usingEmulators: !!(window.CariHubCore && CariHubCore.usingEmulators),
        hasAuth: !!auth,
        authEmail: auth && auth.email,
        aliasVisible: text.includes(alias),
        directoryMode: !!(window.CarihubDirectoryMode && CarihubDirectoryMode.isDirectoryMode())
      };
    }, FIXTURE.alias);

    report.ok =
      report.results.matchFound &&
      report.firestoreAfter.aprobado === true &&
      report.contacts.noPrivateLeak &&
      report.socialAbsence.visibleMsgLinks === 0;

    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 2;
  } catch (err) {
    report.error = String(err && err.stack ? err.stack : err);
    console.error('[e2e-browser] FAILED', err);
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = 1;
  } finally {
    // Cleanup emulator data
    try {
      if (uid) {
        await db.collection('usuarios').doc(uid).delete();
        report.cleanup.firestoreDeleted = true;
      }
      try {
        await admin.auth().deleteUser(uid);
        report.cleanup.authDeleted = true;
      } catch (authErr) {
        report.cleanup.authDeleteError = String(authErr && authErr.message ? authErr.message : authErr);
      }
      const left = uid ? await db.collection('usuarios').doc(uid).get() : null;
      report.cleanup.fixtureGone = !left || !left.exists;
    } catch (cleanErr) {
      report.cleanup.error = String(cleanErr && cleanErr.message ? cleanErr.message : cleanErr);
    }

    await browser.close().catch(() => {});
    await new Promise((r) => server.close(() => r()));
    report.cleanup.serverStopped = true;
    console.log('[e2e-browser] cleanup', JSON.stringify(report.cleanup));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
