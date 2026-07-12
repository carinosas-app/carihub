/**
 * BLK-05-R1 — perfiles rules emulator tests (draft rules only).
 * Uso: firebase emulators:exec --only firestore "node --test scripts/blk05-rules-perfiles.test.mjs"
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
  Timestamp,
} from 'firebase/firestore';
import { test, describe, before, after, beforeEach } from 'node:test';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RULES_PATH = join(__dirname, 'blk05-firestore-rules-perfiles-draft.rules');
const FIXTURES_PATH = join(__dirname, 'blk05-rules-perfiles-test-fixtures.json');
const rules = readFileSync(RULES_PATH, 'utf8');
const fx = JSON.parse(readFileSync(FIXTURES_PATH, 'utf8'));

let testEnv;

function assertEmulator() {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error('[ABORTADO] FIRESTORE_EMULATOR_HOST no definido.');
  }
}

function ctxPublico() {
  return testEnv.unauthenticatedContext();
}

function ctx(rol) {
  const claim = fx.claims[rol];
  if (!claim) return testEnv.unauthenticatedContext();
  const { uid, email, ...rest } = claim;
  const token = email ? { email, ...rest } : rest;
  return testEnv.authenticatedContext(uid, token);
}

function db(context) {
  return context.firestore();
}

async function seed() {
  await testEnv.withSecurityRulesDisabled(async (admin) => {
    const fdb = admin.firestore();
    for (const [uid, data] of Object.entries(fx.usuarios)) {
      await setDoc(doc(fdb, 'usuarios', uid), data);
    }
    for (const [pid, data] of Object.entries(fx.perfiles)) {
      const row = { ...data };
      if (pid === 'perfil_vencido_fecha') {
        row.fechaVencimiento = Timestamp.fromMillis(1000);
      }
      await setDoc(doc(fdb, 'perfiles', pid), row);
    }
    await setDoc(doc(fdb, 'pagos/pago_1'), fx.coleccionesRelacionadas.pagos.ejemplo);
    await setDoc(doc(fdb, 'contratos_perfiles/contrato_1'), fx.coleccionesRelacionadas.contratos_perfiles.ejemplo);
  });
}

before(async () => {
  assertEmulator();
  testEnv = await initializeTestEnvironment({
    projectId: 'blk05-rules-perfiles-test',
    firestore: { rules },
  });
});
beforeEach(async () => {
  await testEnv.clearFirestore();
  await seed();
});
after(async () => {
  if (testEnv) await testEnv.cleanup();
});

describe('1. Lectura publica', () => {
  test('permite perfil publicado canonico', async () => {
    await assertSucceeds(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_publico_canon')));
  });
  test('permite compat alias activo', async () => {
    await assertSucceeds(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_publico_compat_activo')));
  });
  for (const id of ['perfil_borrador', 'perfil_pendiente', 'perfil_suspendido', 'perfil_vencido', 'perfil_eliminado']) {
    test(`niega publico ${id}`, async () => {
      await assertFails(getDoc(doc(db(ctxPublico()), `perfiles/${id}`)));
    });
  }
  test('niega fechaVencimiento expirada', async () => {
    await assertFails(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_vencido_fecha')));
  });
  test('niega doc con campo forbidden kyc', async () => {
    await assertFails(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_con_kyc')));
  });
  test('niega doc con campo forbidden financiero', async () => {
    await assertFails(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_con_financieros')));
  });
});

describe('2. Lectura owner', () => {
  test('owner lee borrador directo', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('owner')), 'perfiles/perfil_borrador')));
  });
  test('owner lee via nested bridge', async () => {
    const c = testEnv.authenticatedContext('uid_owner_bridge', {});
    await assertSucceeds(getDoc(doc(db(c), 'perfiles/perfil_bridge_ok')));
  });
  test('owner lee via flat bridge perfilesDetalle', async () => {
    const c = testEnv.authenticatedContext('uid_owner_bridge_flat', {});
    await assertSucceeds(getDoc(doc(db(c), 'perfiles/perfil_bridge_flat')));
  });
  test('niega otro usuario', async () => {
    await assertFails(getDoc(doc(db(ctx('otro_usuario')), 'perfiles/perfil_borrador')));
  });
  test('niega bridge invalido nested', async () => {
    const c = testEnv.authenticatedContext('uid_owner_bridge_bad', {});
    await assertFails(getDoc(doc(db(c), 'perfiles/perfil_bridge_invalido')));
  });
  test('niega perfilesVinculados sin perfilesDetalle', async () => {
    const c = testEnv.authenticatedContext('uid_owner_bridge_bad', {});
    await assertFails(getDoc(doc(db(c), 'perfiles/perfil_forged_vinculados')));
  });
  test('owner lee doc con kyc (remediacion)', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('owner')), 'perfiles/perfil_con_kyc')));
  });
});

describe('3. Lectura admin Phase 1', () => {
  test('legacy admin email lee privado', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('legacy_admin')), 'perfiles/perfil_borrador')));
  });
  test('admin claim lee privado', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('admin')), 'perfiles/perfil_borrador')));
  });
  test('moderador claim denegado Phase 1', async () => {
    await assertFails(getDoc(doc(db(ctx('moderador')), 'perfiles/perfil_pendiente')));
  });
});

describe('4. Creacion', () => {
  const base = {
    estadoPublicacion: 'borrador', visible: false, publicado: false, tienePerfilPublico: false,
    suspendido: false, eliminado: false, vencido: false,
  };
  test('owner create valido', async () => {
    await assertSucceeds(setDoc(doc(db(ctx('owner')), 'perfiles/nuevo_ok'),
      { ownerUid: 'uid_owner_1', usuarioId: 'uid_owner_1', perfilId: 'nuevo_ok', ...base }));
  });
  test('niega ownerUid ajeno', async () => {
    await assertFails(setDoc(doc(db(ctx('otro_usuario')), 'perfiles/p_ajeno'),
      { ownerUid: 'uid_owner_1', usuarioId: 'uid_owner_1', perfilId: 'p_ajeno', ...base }));
  });
  test('niega create publicado directo', async () => {
    await assertFails(setDoc(doc(db(ctx('owner')), 'perfiles/p_pub'),
      { ownerUid: 'uid_owner_1', usuarioId: 'uid_owner_1', perfilId: 'p_pub', estadoPublicacion: 'publicado', visible: true, publicado: true, tienePerfilPublico: true, suspendido: false, eliminado: false, vencido: false }));
  });
  test('niega forbidden field en create', async () => {
    await assertFails(setDoc(doc(db(ctx('owner')), 'perfiles/p_kyc'),
      { ownerUid: 'uid_owner_1', usuarioId: 'uid_owner_1', perfilId: 'p_kyc', ...base, kyc: {} }));
  });
});

describe('5. Update owner', () => {
  test('permite alias', async () => {
    await assertSucceeds(updateDoc(doc(db(ctx('owner')), 'perfiles/perfil_borrador'), { alias: 'Nuevo' }));
  });
  test('permite borrador -> pendiente', async () => {
    await assertSucceeds(updateDoc(doc(db(ctx('owner')), 'perfiles/perfil_borrador'), { estadoPublicacion: 'pendiente' }));
  });
  for (const patch of [
    { ownerUid: 'uid_otro_2' }, { usuarioId: 'uid_otro_2' }, { perfilId: 'x' },
    { estadoPublicacion: 'publicado' }, { publicado: true }, { visible: true },
    { kyc: {} }, { pagos: [] }, { suspendido: true }
  ]) {
    const key = Object.keys(patch)[0];
    test(`niega owner patch ${key}`, async () => {
      await assertFails(updateDoc(doc(db(ctx('owner')), 'perfiles/perfil_borrador'), patch));
    });
  }
});

describe('6. Update admin transitions', () => {
  const meta = { revisadoPor: 'uid_admin', decisionAdmin: 'ok' };
  test('pendiente -> publicado', async () => {
    await assertSucceeds(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_pendiente'), {
      estadoPublicacion: 'publicado', visible: true, publicado: true, tienePerfilPublico: true, suspendido: false, ...meta
    }));
  });
  test('publicado -> suspendido', async () => {
    await assertSucceeds(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_publico_canon'), {
      estadoPublicacion: 'suspendido', visible: false, publicado: false, tienePerfilPublico: false, suspendido: true, ...meta
    }));
  });
  test('suspendido -> publicado', async () => {
    await assertSucceeds(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_suspendido'), {
      estadoPublicacion: 'publicado', visible: true, publicado: true, tienePerfilPublico: true, suspendido: false, ...meta
    }));
  });
  test('niega borrador -> publicado directo', async () => {
    await assertFails(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_borrador'), { estadoPublicacion: 'publicado', ...meta }));
  });
  test('niega admin sin decisionAdmin', async () => {
    await assertFails(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_pendiente'), { estadoPublicacion: 'publicado', revisadoPor: 'uid_admin' }));
  });
  test('fake role no admin update', async () => {
    await assertFails(updateDoc(doc(db(ctx('fake_admin')), 'perfiles/perfil_pendiente'), { estadoPublicacion: 'publicado', ...meta }));
  });
  test('W1 niega pendiente -> publicado sin bundle visible', async () => {
    await assertFails(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_pendiente'), {
      estadoPublicacion: 'publicado', ...meta
    }));
  });
  test('W1 niega pendiente -> publicado con bundle parcial', async () => {
    await assertFails(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_pendiente'), {
      estadoPublicacion: 'publicado', visible: true, publicado: true, tienePerfilPublico: false, ...meta
    }));
  });
  test('W1 niega suspendido -> publicado sin bundle', async () => {
    await assertFails(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_suspendido'), {
      estadoPublicacion: 'publicado', ...meta
    }));
  });
  test('W1 niega publicado -> suspendido sin bundle', async () => {
    await assertFails(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_publico_canon'), {
      estadoPublicacion: 'suspendido', ...meta
    }));
  });
});

describe('7. Delete y bypass', () => {
  test('niega delete owner', async () => {
    await assertFails(deleteDoc(doc(db(ctx('owner')), 'perfiles/perfil_borrador')));
  });
  test('niega delete admin', async () => {
    await assertFails(deleteDoc(doc(db(ctx('admin')), 'perfiles/perfil_borrador')));
  });
});

describe('8. Colecciones relacionadas', () => {
  test('owner lee pago propio', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('owner')), 'pagos/pago_1')));
  });
  test('otro no lee pago', async () => {
    await assertFails(getDoc(doc(db(ctx('otro_usuario')), 'pagos/pago_1')));
  });
});
