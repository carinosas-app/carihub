/**
 * Suite emulador — reglas Firestore messenger (TICKET-031).
 *
 * Ejecutar SOLO contra emulador:
 *   firebase emulators:exec --only firestore "node --test scripts/messenger-rules.test.mjs"
 * o con emulador ya corriendo:
 *   $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
 *   node --test scripts/messenger-rules.test.mjs
 */
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  Timestamp,
} from 'firebase/firestore';
import { test, describe, before, after, beforeEach } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const RULES_PATH = join(ROOT, 'firestore.rules');
const FIXTURES_PATH = join(__dirname, 'messenger-rules-test-fixtures.json');

function assertEmulator() {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error(
      '[messenger-rules] FIRESTORE_EMULATOR_HOST no definido. Usa firebase emulators:exec o exporta el host.'
    );
  }
}

const rules = readFileSync(RULES_PATH, 'utf8');
const fx = JSON.parse(readFileSync(FIXTURES_PATH, 'utf8'));

let testEnv;

function ctxUser(key) {
  const u = fx.users[key];
  return testEnv.authenticatedContext(u.uid, {
    email: u.email,
    firebase: { sign_in_provider: 'password' },
  });
}

function db(context) {
  return context.firestore();
}

function convPayload(extra) {
  const now = Timestamp.now();
  return Object.assign({}, fx.conversacion, extra || {}, {
    creadoEn: now,
    updatedAt: now,
  });
}

function msgPayload(emisorUid, extra) {
  return Object.assign({}, fx.mensaje, extra || {}, {
    emisorUid: emisorUid,
    createdAt: Timestamp.now(),
  });
}

function reportePayload(extra) {
  return Object.assign({}, fx.reporte, extra || {}, {
    creadoEn: Timestamp.now(),
    actualizadoEn: Timestamp.now()
  });
}

function bloqueoPayload(blockerUid, blockedUid, extra) {
  return Object.assign({}, fx.bloqueo, extra || {}, {
    cuentaUid: blockerUid,
    bloqueadoUid: blockedUid,
    creadoEn: Timestamp.now(),
    actualizadoEn: Timestamp.now()
  });
}

async function seedBloqueo(blockerKey, blockedKey) {
  const blocker = fx.users[blockerKey].uid;
  const blocked = fx.users[blockedKey].uid;
  await testEnv.withSecurityRulesDisabled(async (admin) => {
    const fdb = admin.firestore();
    await setDoc(
      doc(fdb, 'usuarios', blocker, 'bloqueos', blocked),
      bloqueoPayload(blocker, blocked)
    );
  });
}

async function seedConversacion() {
  await testEnv.withSecurityRulesDisabled(async (admin) => {
    const fdb = admin.firestore();
    await setDoc(doc(fdb, 'conversaciones', fx.conversacionId), convPayload());
  });
}

before(async () => {
  assertEmulator();
  testEnv = await initializeTestEnvironment({
    projectId: fx.projectId,
    firestore: { rules },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

after(async () => {
  if (testEnv) await testEnv.cleanup();
});

describe('conversaciones — create', () => {
  test('visitante crea conversación scoped válida', async () => {
    const ref = doc(db(ctxUser('visitante')), 'conversaciones', fx.conversacionId);
    await assertSucceeds(setDoc(ref, convPayload()));
  });

  test('intruso no crea conversación suplantando otro visitante', async () => {
    const ref = doc(db(ctxUser('intruso')), 'conversaciones', 'conv_intruso');
    const bad = convPayload({
      cuentaUid: 'uid_anunciante',
      visitanteUid: 'uid_visitante',
      participantes: [
        { uid: 'uid_anunciante', rol: 'anunciante', alias: 'Valentina' },
        { uid: 'uid_visitante', rol: 'visitante', alias: 'Carlos' },
      ],
      unreadByUid: { uid_anunciante: 0, uid_visitante: 0 },
    });
    await assertFails(setDoc(ref, bad));
  });
});

describe('conversaciones — read', () => {
  beforeEach(async () => {
    await seedConversacion();
  });

  test('anunciante participante lee', async () => {
    const ref = doc(db(ctxUser('anunciante')), 'conversaciones', fx.conversacionId);
    await assertSucceeds(getDoc(ref));
  });

  test('visitante participante lee', async () => {
    const ref = doc(db(ctxUser('visitante')), 'conversaciones', fx.conversacionId);
    await assertSucceeds(getDoc(ref));
  });

  test('intruso no lee', async () => {
    const ref = doc(db(ctxUser('intruso')), 'conversaciones', fx.conversacionId);
    await assertFails(getDoc(ref));
  });

  test('admin lee', async () => {
    const ref = doc(db(ctxUser('admin')), 'conversaciones', fx.conversacionId);
    await assertSucceeds(getDoc(ref));
  });
});

describe('mensajes — create', () => {
  beforeEach(async () => {
    await seedConversacion();
  });

  test('visitante envía mensaje', async () => {
    const ref = doc(
      collection(db(ctxUser('visitante')), 'conversaciones', fx.conversacionId, 'mensajes'),
      'msg1'
    );
    await assertSucceeds(setDoc(ref, msgPayload('uid_visitante')));
  });

  test('intruso no envía mensaje', async () => {
    const ref = doc(
      collection(db(ctxUser('intruso')), 'conversaciones', fx.conversacionId, 'mensajes'),
      'msg2'
    );
    await assertFails(setDoc(ref, msgPayload('uid_intruso')));
  });
});

describe('mensajes — visto (MSG-073)', () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (admin) => {
      const fdb = admin.firestore();
      const now = Timestamp.now();
      await setDoc(doc(fdb, 'conversaciones', fx.conversacionId), convPayload());
      await setDoc(
        doc(fdb, 'conversaciones', fx.conversacionId, 'mensajes', 'msg_v1'),
        msgPayload('uid_visitante', { createdAt: now })
      );
    });
  });

  test('anunciante marca visto con confirmacionVisto visible', async () => {
    await testEnv.withSecurityRulesDisabled(async (admin) => {
      const fdb = admin.firestore();
      const priv = Object.assign({}, fx.privacidadVistoVisible, {
        cuentaUid: 'uid_anunciante',
        creadoEn: Timestamp.now(),
        actualizadoEn: Timestamp.now(),
      });
      await setDoc(
        doc(fdb, 'usuarios', 'uid_anunciante', 'privacidad_mensajes', 'config'),
        priv
      );
    });
    const ref = doc(
      db(ctxUser('anunciante')),
      'conversaciones',
      fx.conversacionId,
      'mensajes',
      'msg_v1'
    );
    await assertSucceeds(
      updateDoc(ref, { estadoEntrega: 'visto', leidoEn: Timestamp.now() })
    );
  });

  test('anunciante no marca visto sin privacidad visible', async () => {
    const ref = doc(
      db(ctxUser('anunciante')),
      'conversaciones',
      fx.conversacionId,
      'mensajes',
      'msg_v1'
    );
    await assertFails(
      updateDoc(ref, { estadoEntrega: 'visto', leidoEn: Timestamp.now() })
    );
  });
});

describe('reportes_mensajeria — MSG-021', () => {
  beforeEach(async () => {
    await seedConversacion();
  });

  test('visitante crea reporte scoped válido', async () => {
    const ref = doc(db(ctxUser('visitante')), 'reportes_mensajeria', fx.reporteId);
    await assertSucceeds(setDoc(ref, reportePayload()));
  });

  test('intruso no crea reporte', async () => {
    const ref = doc(db(ctxUser('intruso')), 'reportes_mensajeria', 'rep_intruso');
    await assertFails(setDoc(ref, reportePayload({ reportanteId: 'uid_intruso' })));
  });

  test('visitante lee su reporte', async () => {
    await testEnv.withSecurityRulesDisabled(async (admin) => {
      const fdb = admin.firestore();
      const now = Timestamp.now();
      await setDoc(
        doc(fdb, 'reportes_mensajeria', fx.reporteId),
        reportePayload({ creadoEn: now, actualizadoEn: now })
      );
    });
    const ref = doc(db(ctxUser('visitante')), 'reportes_mensajeria', fx.reporteId);
    await assertSucceeds(getDoc(ref));
  });

  test('intruso no lee reporte de otro', async () => {
    await testEnv.withSecurityRulesDisabled(async (admin) => {
      const fdb = admin.firestore();
      const now = Timestamp.now();
      await setDoc(
        doc(fdb, 'reportes_mensajeria', fx.reporteId),
        reportePayload({ creadoEn: now, actualizadoEn: now })
      );
    });
    const ref = doc(db(ctxUser('intruso')), 'reportes_mensajeria', fx.reporteId);
    await assertFails(getDoc(ref));
  });

  test('admin actualiza estado', async () => {
    await testEnv.withSecurityRulesDisabled(async (admin) => {
      const fdb = admin.firestore();
      const now = Timestamp.now();
      await setDoc(
        doc(fdb, 'reportes_mensajeria', fx.reporteId),
        reportePayload({ creadoEn: now, actualizadoEn: now })
      );
    });
    const ref = doc(db(ctxUser('admin')), 'reportes_mensajeria', fx.reporteId);
    await assertSucceeds(
      updateDoc(ref, {
        estado: 'en_revision',
        adminAsignadoId: 'uid_admin',
        actualizadoEn: Timestamp.now()
      })
    );
  });
});

describe('bloqueos_mensajeria — MSG-022 / MSG-081', () => {
  test('visitante crea bloqueo válido', async () => {
    const visitante = fx.users.visitante.uid;
    const anunciante = fx.users.anunciante.uid;
    const ref = doc(db(ctxUser('visitante')), 'usuarios', visitante, 'bloqueos', anunciante);
    await assertSucceeds(setDoc(ref, bloqueoPayload(visitante, anunciante)));
  });

  test('intruso no crea bloqueo en subcolección de otro', async () => {
    const visitante = fx.users.visitante.uid;
    const anunciante = fx.users.anunciante.uid;
    const ref = doc(db(ctxUser('intruso')), 'usuarios', visitante, 'bloqueos', anunciante);
    await assertFails(setDoc(ref, bloqueoPayload(visitante, anunciante)));
  });

  test('mensaje rechazado con bloqueo activo', async () => {
    await seedConversacion();
    await seedBloqueo('anunciante', 'visitante');
    const ref = doc(
      collection(db(ctxUser('visitante')), 'conversaciones', fx.conversacionId, 'mensajes'),
      'msg_bloqueado'
    );
    await assertFails(setDoc(ref, msgPayload('uid_visitante')));
  });

  test('conversación nueva rechazada con bloqueo entre partes', async () => {
    await seedBloqueo('visitante', 'anunciante');
    const ref = doc(db(ctxUser('visitante')), 'conversaciones', 'conv_bloqueada');
    await assertFails(setDoc(ref, convPayload({ visitanteUid: 'uid_visitante' })));
  });

  test('dueño elimina su bloqueo', async () => {
    const visitante = fx.users.visitante.uid;
    const anunciante = fx.users.anunciante.uid;
    await seedBloqueo('visitante', 'anunciante');
    const ref = doc(db(ctxUser('visitante')), 'usuarios', visitante, 'bloqueos', anunciante);
    await assertSucceeds(deleteDoc(ref));
  });
});

describe('conversaciones — update', () => {
  beforeEach(async () => {
    await seedConversacion();
  });

  test('anunciante actualiza preview y unread', async () => {
    const ref = doc(db(ctxUser('anunciante')), 'conversaciones', fx.conversacionId);
    await assertSucceeds(
      updateDoc(ref, {
        ultimoMensaje: 'Gracias por escribir',
        updatedAt: Timestamp.now(),
        unreadByUid: { uid_anunciante: 0, uid_visitante: 1 },
      })
    );
  });

  test('intruso no actualiza conversación', async () => {
    const ref = doc(db(ctxUser('intruso')), 'conversaciones', fx.conversacionId);
    await assertFails(
      updateDoc(ref, {
        ultimoMensaje: 'hack',
        updatedAt: Timestamp.now(),
        unreadByUid: { uid_anunciante: 0, uid_visitante: 1 },
      })
    );
  });
});
