/**
 * ECO-010 — reglas Firestore ordenes_pago (emulador).
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
  Timestamp,
} from 'firebase/firestore';
import { test, describe, before, after, beforeEach } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const RULES_PATH = join(ROOT, 'firestore.rules');
const FIXTURES_PATH = join(__dirname, 'eco-010-rules-fixtures.json');

function assertEmulator() {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error(
      '[eco-010-rules] FIRESTORE_EMULATOR_HOST no definido. Usa firebase emulators:exec.'
    );
  }
}

const rules = readFileSync(RULES_PATH, 'utf8');
const fx = JSON.parse(readFileSync(FIXTURES_PATH, 'utf8'));
fx.projectId = fx.projectId || 'carihub-eco010-test';

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

function ordenPayload(extra) {
  return Object.assign({}, fx.ordenPendiente, extra || {}, {
    createdAt: Timestamp.now(),
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

describe('ordenes_pago rules', () => {
  test('owner puede leer su orden', async () => {
    await testEnv.withSecurityRulesDisabled(async (admin) => {
      await setDoc(doc(admin.firestore(), 'ordenes_pago', 'ord1'), ordenPayload());
    });
    await assertSucceeds(getDoc(doc(db(ctxUser('owner')), 'ordenes_pago', 'ord1')));
  });

  test('otro usuario no puede leer orden ajena', async () => {
    await testEnv.withSecurityRulesDisabled(async (admin) => {
      await setDoc(doc(admin.firestore(), 'ordenes_pago', 'ord1'), ordenPayload());
    });
    await assertFails(getDoc(doc(db(ctxUser('other')), 'ordenes_pago', 'ord1')));
  });

  test('admin puede leer cualquier orden', async () => {
    await testEnv.withSecurityRulesDisabled(async (admin) => {
      await setDoc(doc(admin.firestore(), 'ordenes_pago', 'ord1'), ordenPayload());
    });
    await assertSucceeds(getDoc(doc(db(ctxUser('admin')), 'ordenes_pago', 'ord1')));
  });

  test('owner puede crear orden pendiente', async () => {
    await assertSucceeds(
      setDoc(doc(db(ctxUser('owner')), 'ordenes_pago', 'ord_new'), ordenPayload())
    );
  });

  test('owner no puede crear orden ya pagada', async () => {
    await assertFails(
      setDoc(
        doc(db(ctxUser('owner')), 'ordenes_pago', 'ord_bad'),
        ordenPayload({ estado: 'pagado' })
      )
    );
  });

  test('owner no puede marcar pagado en update', async () => {
    await testEnv.withSecurityRulesDisabled(async (admin) => {
      await setDoc(doc(admin.firestore(), 'ordenes_pago', 'ord1'), ordenPayload());
    });
    await assertFails(
      updateDoc(doc(db(ctxUser('owner')), 'ordenes_pago', 'ord1'), { estado: 'pagado' })
    );
  });

  test('admin puede confirmar pago', async () => {
    await testEnv.withSecurityRulesDisabled(async (admin) => {
      await setDoc(doc(admin.firestore(), 'ordenes_pago', 'ord1'), ordenPayload());
    });
    await assertSucceeds(
      updateDoc(doc(db(ctxUser('admin')), 'ordenes_pago', 'ord1'), { estado: 'pagado' })
    );
  });
});
