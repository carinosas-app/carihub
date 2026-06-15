// ============================================================================
// SECCION 1 — ENCABEZADO DE SEGURIDAD
// ============================================================================
//
//   ####  SUITE DE PRUEBAS — BORRADOR — SOLO EMULADOR  ####
//
//   Archivo: scripts/blk05-rules-perfiles.test.mjs
//   Valida:  scripts/blk05-firestore-rules-perfiles-draft.rules (perfiles/{perfilId})
//   Parte de: BLK-05 / GAP-RULES-FIRESTORE-ALIGNMENT v1.0.0 (fase 2)
//
//   ADVERTENCIAS OBLIGATORIAS:
//     - NO EJECUTAR CONTRA PRODUCCION.
//     - SOLO EMULADOR (Firestore emulator).
//     - NO DEPLOY.
//     - NO MODIFICA firestore.rules REAL (carga el borrador, no el real).
//     - REQUIERE @firebase/rules-unit-testing (no instalar en esta fase).
//     - REQUIERE FIRESTORE_EMULATOR_HOST definido.
//     - REQUIERE revision manual antes de correr.
//
//   ESTADO: NO EJECUTADO. Listo para revision. Para correr en el futuro:
//     1) npm i -D @firebase/rules-unit-testing firebase
//     2) firebase emulators:start --only firestore
//     3) $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
//     4) node --test scripts/blk05-rules-perfiles.test.mjs
//
//   Guarda de seguridad: si FIRESTORE_EMULATOR_HOST no esta definido, la suite
//   aborta para no tocar produccion.
// ============================================================================

// ── SECCION 2 — IMPORTS ESPERADOS ──────────────────────────────────────────
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
} from 'firebase/firestore';
import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Guarda: solo emulador ───────────────────────────────────────────────────
function assertEmulator() {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error(
      '[ABORTADO] FIRESTORE_EMULATOR_HOST no definido. Esta suite es SOLO para el emulador.'
    );
  }
}

// ── SECCION 3 — CARGA DEL BORRADOR DE RULES (no el real) ────────────────────
const RULES_PATH = join(__dirname, 'blk05-firestore-rules-perfiles-draft.rules');
const FIXTURES_PATH = join(__dirname, 'blk05-rules-perfiles-test-fixtures.json');
const rules = readFileSync(RULES_PATH, 'utf8'); // NUNCA leer firestore.rules real
const fx = JSON.parse(readFileSync(FIXTURES_PATH, 'utf8'));

let testEnv;

// ── SECCION 4 — CONTEXTOS DE PRUEBA (claims simulados) ──────────────────────
function ctxPublico() {
  return testEnv.unauthenticatedContext();
}
function ctx(rol) {
  const claim = fx.claims[rol];
  if (!claim) return testEnv.unauthenticatedContext();
  const { uid, ...rest } = claim;
  return testEnv.authenticatedContext(uid, rest); // rest = { role: '...' }
}
function db(context) {
  return context.firestore();
}

// ── SECCION 5 — SIEMBRA DE FIXTURES BASE ────────────────────────────────────
async function seed() {
  await testEnv.withSecurityRulesDisabled(async (admin) => {
    const fdb = admin.firestore();
    for (const [uid, data] of Object.entries(fx.usuarios)) {
      await setDoc(doc(fdb, 'usuarios', uid), data);
    }
    for (const [pid, data] of Object.entries(fx.perfiles)) {
      await setDoc(doc(fdb, 'perfiles', pid), data);
    }
    // Subcolecciones de muestra para perfil_activo_publico.
    await setDoc(doc(fdb, 'perfiles/perfil_activo_publico/verificaciones/v1'), { estado: 'pendiente', tipo: 'ine' });
    await setDoc(doc(fdb, 'perfiles/perfil_activo_publico/media/m_pub'), { publica: true, url: 'ref-pub' });
    await setDoc(doc(fdb, 'perfiles/perfil_activo_publico/media/m_priv'), { publica: false, url: 'ref-priv' });
    await setDoc(doc(fdb, 'perfiles/perfil_activo_publico/estadisticas/s1'), { visitas: 10, periodo: '2026-06' });
    await setDoc(doc(fdb, 'perfiles/perfil_activo_publico/auditoria/l1'), { evento: 'perfil_aprobar', por: 'uid_admin' });
    // Colecciones relacionadas.
    await setDoc(doc(fdb, 'pagos/pago_1'), fx.coleccionesRelacionadas.pagos.ejemplo);
    await setDoc(doc(fdb, 'contratos_perfiles/contrato_1'), fx.coleccionesRelacionadas.contratos_perfiles.ejemplo);
    await setDoc(doc(fdb, 'contratos_banners/cb_1'), fx.coleccionesRelacionadas.contratos_banners.ejemplo);
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

// ============================================================================
// PRUEBA 1 — LECTURA PUBLICA
// ============================================================================
describe('1. Lectura publica', () => {
  test('permite leer perfil activo/visible/publicado', async () => {
    await assertSucceeds(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_activo_publico')));
  });
  for (const id of ['perfil_borrador', 'perfil_pendiente', 'perfil_correccion',
    'perfil_aprobado_no_publicado', 'perfil_suspendido', 'perfil_vencido', 'perfil_eliminado']) {
    test(`niega lectura publica de ${id}`, async () => {
      await assertFails(getDoc(doc(db(ctxPublico()), `perfiles/${id}`)));
    });
  }
  test('perfiles con KYC/financieros no se exponen al publico (no estan publicados)', async () => {
    await assertFails(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_con_kyc')));
    await assertFails(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_con_financieros')));
  });
});

// ============================================================================
// PRUEBA 2 — LECTURA OWNER
// ============================================================================
describe('2. Lectura owner', () => {
  test('owner lee su perfil (uid==ownerUid)', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('owner')), 'perfiles/perfil_borrador')));
  });
  test('owner lee via bridge BLK-01 valido', async () => {
    await assertSucceeds(getDoc(doc(db(ctxBridge('uid_owner_bridge')), 'perfiles/perfil_bridge_ok')));
  });
  test('niega a otro usuario leer perfil privado', async () => {
    await assertFails(getDoc(doc(db(ctx('otro_usuario')), 'perfiles/perfil_borrador')));
  });
  test('niega sin sesion en perfil no publico', async () => {
    await assertFails(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_borrador')));
  });
  test('niega bridge BLK-01 invalido', async () => {
    await assertFails(getDoc(doc(db(ctxBridge('uid_owner_bridge_bad')), 'perfiles/perfil_bridge_invalido')));
  });
});

function ctxBridge(uid) {
  return testEnv.authenticatedContext(uid, {});
}

// ============================================================================
// PRUEBA 3 — LECTURA POR ROL
// ============================================================================
describe('3. Lectura por rol', () => {
  test('admin lee cualquier perfil', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('admin')), 'perfiles/perfil_borrador')));
  });
  test('moderador lee perfil pendiente (revision)', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('moderador')), 'perfiles/perfil_pendiente')));
  });
  test('auditor lee perfil (trazabilidad)', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('auditor')), 'perfiles/perfil_activo_publico')));
  });
  test('soporte lee perfil', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('soporte')), 'perfiles/perfil_borrador')));
  });
  test('agente IA no tiene escritura directa', async () => {
    await assertFails(updateDoc(doc(db(ctx('agente_ia')), 'perfiles/perfil_activo_publico'), { alias: 'ia' }));
  });
});

// ============================================================================
// PRUEBA 4 — CREACION DE PERFIL
// ============================================================================
describe('4. Creacion de perfil', () => {
  const base = {
    estadoPublicacion: 'borrador', publicado: false, visible: false,
    suspendido: false, eliminado: false, vencido: false,
  };
  test('permite create owner valido', async () => {
    await assertSucceeds(setDoc(doc(db(ctx('owner')), 'perfiles/nuevo_perfil_owner'),
      { ownerUid: 'uid_owner_1', perfilId: 'nuevo_perfil_owner', ...base }));
  });
  test('niega create con ownerUid ajeno', async () => {
    await assertFails(setDoc(doc(db(ctx('otro_usuario')), 'perfiles/p_ajeno'),
      { ownerUid: 'uid_owner_1', perfilId: 'p_ajeno', ...base }));
  });
  test('niega create en estado activo/publicado directo', async () => {
    await assertFails(setDoc(doc(db(ctx('owner')), 'perfiles/p_activo'),
      { ownerUid: 'uid_owner_1', perfilId: 'p_activo', estadoPublicacion: 'activo', publicado: true, visible: true, suspendido: false, eliminado: false, vencido: false }));
  });
  for (const [campo, val] of [['estadoPago', 'confirmado'], ['contratos', []], ['aprobado', true], ['kyc', {}], ['auditoria', []]]) {
    test(`niega create sembrando campo protegido: ${campo}`, async () => {
      await assertFails(setDoc(doc(db(ctx('owner')), `perfiles/p_${campo}`),
        { ownerUid: 'uid_owner_1', perfilId: `p_${campo}`, ...base, [campo]: val }));
    });
  }
});

// ============================================================================
// PRUEBA 5 — ACTUALIZACION OWNER
// ============================================================================
describe('5. Actualizacion owner', () => {
  test('permite editar campo publico (alias)', async () => {
    await assertSucceeds(updateDoc(doc(db(ctx('owner')), 'perfiles/perfil_borrador'), { alias: 'Nuevo' }));
  });
  for (const patch of [
    { ownerUid: 'uid_otro_2' },
    { perfilId: 'otro' },
    { estadoPublicacion: 'aprobado' },
    { publicado: true },
    { pagos: [] },
    { contratos: [] },
    { kyc: { x: 1 } },
    { notasAdmin: 'x' },
    { auditoria: [] },
    { estadoPago: 'confirmado' },
    { revisadoPor: 'uid_owner_1' },
    { suspendido: true },
  ]) {
    const key = Object.keys(patch)[0];
    test(`niega owner cambiando campo protegido: ${key}`, async () => {
      await assertFails(updateDoc(doc(db(ctx('owner')), 'perfiles/perfil_borrador'), patch));
    });
  }
});

// ============================================================================
// PRUEBA 6 — ACTUALIZACION ADMIN/MODERADOR (transiciones)
// ============================================================================
describe('6. Actualizacion admin/moderador', () => {
  const meta = { revisadoPor: 'uid_admin', decisionAdmin: 'ok' };
  const metaMod = { revisadoPor: 'uid_mod', decisionAdmin: 'ok' };
  test('pendiente -> aprobado (admin)', async () => {
    await assertSucceeds(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_pendiente'), { estadoPublicacion: 'aprobado', ...meta }));
  });
  test('pendiente -> correccion_solicitada (moderador)', async () => {
    await assertSucceeds(updateDoc(doc(db(ctx('moderador')), 'perfiles/perfil_pendiente'), { estadoPublicacion: 'correccion_solicitada', ...metaMod }));
  });
  test('aprobado -> activo (admin)', async () => {
    await assertSucceeds(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_aprobado_no_publicado'), { estadoPublicacion: 'activo', ...meta }));
  });
  test('activo -> suspendido (admin)', async () => {
    await assertSucceeds(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_activo_publico'), { estadoPublicacion: 'suspendido', ...meta }));
  });
  test('niega borrador -> activo directo', async () => {
    await assertFails(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_borrador'), { estadoPublicacion: 'activo', ...meta }));
  });
  test('niega pendiente -> activo sin aprobacion', async () => {
    await assertFails(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_pendiente'), { estadoPublicacion: 'activo', ...meta }));
  });
  test('niega eliminado -> activo sin restauracion', async () => {
    await assertFails(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_eliminado'), { estadoPublicacion: 'activo', ...meta }));
  });
  test('niega admin sin trazabilidad (sin decisionAdmin)', async () => {
    await assertFails(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_pendiente'), { estadoPublicacion: 'aprobado', revisadoPor: 'uid_admin' }));
  });
});

// ============================================================================
// PRUEBA 7 — DELETE
// ============================================================================
describe('7. Delete', () => {
  test('niega delete fisico al owner', async () => {
    await assertFails(deleteDoc(doc(db(ctx('owner')), 'perfiles/perfil_borrador')));
  });
  test('niega delete fisico al admin (soft-delete por estado)', async () => {
    await assertFails(deleteDoc(doc(db(ctx('admin')), 'perfiles/perfil_borrador')));
  });
});

// ============================================================================
// PRUEBA 8 — SUBCOLECCION verificaciones
// ============================================================================
describe('8. verificaciones', () => {
  test('owner crea solicitud pendiente', async () => {
    await assertSucceeds(setDoc(doc(db(ctx('owner')), 'perfiles/perfil_activo_publico/verificaciones/v2'), { estado: 'pendiente' }));
  });
  test('owner lee su solicitud', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('owner')), 'perfiles/perfil_activo_publico/verificaciones/v1')));
  });
  test('publico no lee verificaciones', async () => {
    await assertFails(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_activo_publico/verificaciones/v1')));
  });
  test('moderador actualiza estado de revision', async () => {
    await assertSucceeds(updateDoc(doc(db(ctx('moderador')), 'perfiles/perfil_activo_publico/verificaciones/v1'), { estado: 'aprobada' }));
  });
  test('owner no aprueba su propia verificacion', async () => {
    await assertFails(updateDoc(doc(db(ctx('owner')), 'perfiles/perfil_activo_publico/verificaciones/v1'), { estado: 'aprobada' }));
  });
  test('auditor solo lee', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('auditor')), 'perfiles/perfil_activo_publico/verificaciones/v1')));
  });
});

// ============================================================================
// PRUEBA 9 — SUBCOLECCION media
// ============================================================================
describe('9. media', () => {
  test('owner crea media', async () => {
    await assertSucceeds(setDoc(doc(db(ctx('owner')), 'perfiles/perfil_activo_publico/media/m2'), { publica: false, url: 'x' }));
  });
  test('publico lee media publica', async () => {
    await assertSucceeds(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_activo_publico/media/m_pub')));
  });
  test('publico no lee media privada', async () => {
    await assertFails(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_activo_publico/media/m_priv')));
  });
  test('moderador revisa media', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('moderador')), 'perfiles/perfil_activo_publico/media/m_priv')));
  });
});

// ============================================================================
// PRUEBA 10 — SUBCOLECCION estadisticas
// ============================================================================
describe('10. estadisticas', () => {
  test('owner lee sus estadisticas', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('owner')), 'perfiles/perfil_activo_publico/estadisticas/s1')));
  });
  test('admin lee estadisticas', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('admin')), 'perfiles/perfil_activo_publico/estadisticas/s1')));
  });
  test('auditor lee estadisticas', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('auditor')), 'perfiles/perfil_activo_publico/estadisticas/s1')));
  });
  test('owner no manipula metricas', async () => {
    await assertFails(updateDoc(doc(db(ctx('owner')), 'perfiles/perfil_activo_publico/estadisticas/s1'), { visitas: 9999 }));
  });
  test('sistema escribe estadisticas', async () => {
    await assertSucceeds(setDoc(doc(db(ctx('sistema')), 'perfiles/perfil_activo_publico/estadisticas/s2'), { visitas: 1 }));
  });
});

// ============================================================================
// PRUEBA 11 — SUBCOLECCION auditoria
// ============================================================================
describe('11. auditoria', () => {
  test('admin crea log (append)', async () => {
    await assertSucceeds(setDoc(doc(db(ctx('admin')), 'perfiles/perfil_activo_publico/auditoria/l3'), { evento: 'x', por: 'uid_admin' }));
  });
  test('owner no escribe auditoria', async () => {
    await assertFails(setDoc(doc(db(ctx('owner')), 'perfiles/perfil_activo_publico/auditoria/l4'), { evento: 'x' }));
  });
  test('auditoria inmutable (no update)', async () => {
    await assertFails(updateDoc(doc(db(ctx('admin')), 'perfiles/perfil_activo_publico/auditoria/l1'), { evento: 'y' }));
  });
  test('auditor lee', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('auditor')), 'perfiles/perfil_activo_publico/auditoria/l1')));
  });
  test('publico no lee auditoria', async () => {
    await assertFails(getDoc(doc(db(ctxPublico()), 'perfiles/perfil_activo_publico/auditoria/l1')));
  });
});

// ============================================================================
// PRUEBA 12 — COLECCIONES RELACIONADAS (pagos / contratos)
// ============================================================================
describe('12. colecciones relacionadas', () => {
  test('owner lee pago vinculado a su usuarioId', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('owner')), 'pagos/pago_1')));
  });
  test('admin lee pagos', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('admin')), 'pagos/pago_1')));
  });
  test('auditor lee pagos', async () => {
    await assertSucceeds(getDoc(doc(db(ctx('auditor')), 'pagos/pago_1')));
  });
  test('usuario no vinculado no lee pago', async () => {
    await assertFails(getDoc(doc(db(ctx('otro_usuario')), 'pagos/pago_1')));
  });
  test('owner no edita pagos', async () => {
    await assertFails(updateDoc(doc(db(ctx('owner')), 'pagos/pago_1'), { estado: 'reembolsado' }));
  });
  test('owner no crea contratos', async () => {
    await assertFails(setDoc(doc(db(ctx('owner')), 'contratos_perfiles/c_nuevo'), { usuarioId: 'uid_owner_1', perfilId: 'perfil_activo_publico' }));
  });
});

// ============================================================================
// PRUEBA 13 — CAMPOS PROTEGIDOS (no exponer / no escribir)
// ============================================================================
describe('13. campos protegidos', () => {
  const protegidos = [
    ...fx.camposPrivadosProtegidos,
    ...fx.camposFinancierosProtegidos,
  ];
  for (const campo of protegidos) {
    test(`owner no puede escribir campo protegido: ${campo}`, async () => {
      await assertFails(updateDoc(doc(db(ctx('owner')), 'perfiles/perfil_borrador'), { [campo]: 'x' }));
    });
  }
});

// ============================================================================
// PRUEBA 14 — EDICION CRUZADA
// ============================================================================
describe('14. edicion cruzada', () => {
  test('A no lee perfil privado de B', async () => {
    await assertFails(getDoc(doc(db(ctx('otro_usuario')), 'perfiles/perfil_borrador')));
  });
  test('A no edita perfil de B', async () => {
    await assertFails(updateDoc(doc(db(ctx('otro_usuario')), 'perfiles/perfil_borrador'), { alias: 'hack' }));
  });
  test('owner no modifica contratos raiz', async () => {
    await assertFails(updateDoc(doc(db(ctx('owner')), 'contratos_perfiles/contrato_1'), { estado: 'cancelado' }));
  });
  test('owner no modifica pagos raiz', async () => {
    await assertFails(updateDoc(doc(db(ctx('owner')), 'pagos/pago_1'), { monto: 0 }));
  });
});

// ============================================================================
// PRUEBA 15 — INTENTOS DE BYPASS
// ============================================================================
describe('15. bypass', () => {
  const base = { publicado: false, visible: false, suspendido: false, eliminado: false, vencido: false };
  test('crear perfil ya activo', async () => {
    await assertFails(setDoc(doc(db(ctx('owner')), 'perfiles/bypass_activo'),
      { ownerUid: 'uid_owner_1', perfilId: 'bypass_activo', estadoPublicacion: 'activo', publicado: true, visible: true, suspendido: false, eliminado: false, vencido: false }));
  });
  test('publicar sin aprobacion (owner)', async () => {
    await assertFails(updateDoc(doc(db(ctx('owner')), 'perfiles/perfil_pendiente'), { publicado: true, visible: true }));
  });
  test('aprobar sin rol (otro usuario)', async () => {
    await assertFails(updateDoc(doc(db(ctx('otro_usuario')), 'perfiles/perfil_pendiente'), { estadoPublicacion: 'aprobado', revisadoPor: 'uid_otro_2', decisionAdmin: 'x' }));
  });
  test('cambiar ownerUid', async () => {
    await assertFails(updateDoc(doc(db(ctx('owner')), 'perfiles/perfil_borrador'), { ownerUid: 'uid_otro_2' }));
  });
  test('borrar auditoria', async () => {
    await assertFails(deleteDoc(doc(db(ctx('admin')), 'perfiles/perfil_activo_publico/auditoria/l1')));
  });
  test('escribir pago como usuario', async () => {
    await assertFails(setDoc(doc(db(ctx('owner')), 'pagos/pago_hack'), { usuarioId: 'uid_owner_1', monto: 1 }));
  });
});
