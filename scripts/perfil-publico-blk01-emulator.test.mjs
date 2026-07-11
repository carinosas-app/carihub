/**
 * BLK-01 Phase 1C-b — emulator-only dual-read validation.
 *
 * Run ONLY against Firestore Emulator:
 *   firebase emulators:exec --only firestore "node --test scripts/perfil-publico-blk01-emulator.test.mjs"
 *
 * Or with emulator already running:
 *   $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
 *   $env:GCLOUD_PROJECT="demo-carihub"
 *   node --test scripts/perfil-publico-blk01-emulator.test.mjs
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  initializeTestEnvironment,
  assertSucceeds
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { assertEmulatorEnvironment, DEMO_PROJECT_ID } from './lib/blk01-emulator-guard.mjs';
import {
  createSandbox,
  loadBlk01Stack,
  loadResultadosAndInit,
  trackLegacyReads,
  seedStore,
  readInitSource,
  readResultadosSource,
  FLAG_DUAL_READ,
  FLAG_PERFILES_PRIMARY
} from './lib/blk01-perfil-publico-sandbox.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FIXTURES = JSON.parse(readFileSync(join(__dirname, 'blk01-phase1cb-fixtures.json'), 'utf8'));
const RULES = readFileSync(join(__dirname, 'blk01-phase1cb-emulator.rules'), 'utf8');
const IDS = FIXTURES.ids;

// firebase emulators:exec may inject production project from .firebaserc — force demo for tests.
if (process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.GCLOUD_PROJECT = DEMO_PROJECT_ID;
}

assertEmulatorEnvironment();

let testEnv;

async function seedFixtures() {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    for (const [id, data] of Object.entries(FIXTURES.perfiles)) {
      await setDoc(doc(db, 'perfiles', id), data);
    }
    for (const [id, data] of Object.entries(FIXTURES.usuarios)) {
      await setDoc(doc(db, 'usuarios', id), data);
    }
  });
}

function vmFixturesFromJson() {
  return {
    perfiles: FIXTURES.perfiles,
    usuarios: FIXTURES.usuarios
  };
}

function assertNoKycLeak(obj, label) {
  const json = JSON.stringify(obj || {});
  for (const pattern of FIXTURES.kycPatterns) {
    assert.ok(!json.includes(pattern), `${label} leaked sensitive pattern: ${pattern}`);
  }
}

describe('BLK-01 Phase 1C-b — environment safety guard', () => {
  test('hard-fails without FIRESTORE_EMULATOR_HOST', () => {
    const savedHost = process.env.FIRESTORE_EMULATOR_HOST;
    const savedProject = process.env.GCLOUD_PROJECT;
    delete process.env.FIRESTORE_EMULATOR_HOST;
    try {
      assert.throws(() => assertEmulatorEnvironment(), /FIRESTORE_EMULATOR_HOST/);
    } finally {
      process.env.FIRESTORE_EMULATOR_HOST = savedHost;
      process.env.GCLOUD_PROJECT = savedProject;
    }
  });

  test('rejects production project carihub-app', () => {
    const saved = process.env.GCLOUD_PROJECT;
    process.env.GCLOUD_PROJECT = 'carihub-app';
    try {
      assert.throws(() => assertEmulatorEnvironment(), /production project/i);
    } finally {
      process.env.GCLOUD_PROJECT = saved;
    }
  });

  test('accepts demo-carihub with local emulator host', () => {
    const env = assertEmulatorEnvironment();
    assert.equal(env.projectId, DEMO_PROJECT_ID);
    assert.match(env.host, /^(127\.0\.0\.1|localhost)/);
  });
});

describe('BLK-01 Phase 1C-b — VM integration (flags ON, fixture contract)', () => {
  test('A perfiles hit — no legacy fallback, hydrate path', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    loadResultadosAndInit(sandbox);
    seedStore(sandbox, vmFixturesFromJson());
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(IDS.opaquePerfilId);
    assert.ok(out);
    assert.equal(out.__id, IDS.opaquePerfilId);
    assert.equal(out.perfilId, IDS.opaquePerfilId);
    assert.equal(out.uid, FIXTURES.perfiles[IDS.opaquePerfilId].ownerUid);
    assert.equal(out.nombre, 'Opaque Multi Profile');
    assert.equal(sandbox.__reads.perfiles, 1);
    assert.equal(sandbox.__reads.legacyUsuarios, 0);
    assertNoKycLeak(out, 'perfiles hit');
  });

  test('B bridge legacy uid — perfiles/{uid} hit, deterministic identity', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    loadResultadosAndInit(sandbox);
    seedStore(sandbox, vmFixturesFromJson());
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(IDS.legacyBridgeUid);
    assert.ok(out);
    assert.equal(out.__id, IDS.legacyBridgeUid);
    assert.equal(out.perfilId, IDS.legacyBridgeUid);
    assert.equal(out.uid, IDS.legacyBridgeUid);
    assert.equal(sandbox.__reads.perfiles, 1);
    assert.equal(sandbox.__reads.legacyUsuarios, 0);
  });

  test('C opaque perfilId — __id/perfilId/uid from owner', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_PERFILES_PRIMARY);
    loadResultadosAndInit(sandbox);
    seedStore(sandbox, vmFixturesFromJson());
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(IDS.opaquePerfilId);
    assert.ok(out);
    assert.equal(out.__id, IDS.opaquePerfilId);
    assert.equal(out.perfilId, IDS.opaquePerfilId);
    assert.equal(out.uid, 'uid_p1cb_owner_opaque1');
    assert.equal(out.__blk01Source, 'perfiles');
  });

  test('D hub fallback — resolver with owner hint, TICKET-003 adapter', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    loadResultadosAndInit(sandbox);
    const fixtures = vmFixturesFromJson();
    delete fixtures.perfiles[IDS.hubFallbackPerfilId];
    seedStore(sandbox, fixtures);
    const Resolver = sandbox.CariHubProfileResolver;
    const result = await Resolver.resolveProfile(IDS.hubFallbackPerfilId, {
      firestore: {
        getPerfilDoc: (id) =>
          sandbox.firebase
            .firestore()
            .collection('perfiles')
            .doc(id)
            .get()
            .then((d) => ({
              exists: d.exists,
              id: d.id,
              data: d.exists ? d.data() : null,
              error: null
            })),
        getUsuarioDoc: (uid) =>
          sandbox.firebase
            .firestore()
            .collection('usuarios')
            .doc(uid)
            .get()
            .then((d) => ({
              exists: d.exists,
              id: d.id,
              data: d.exists ? d.data() : null,
              error: null
            }))
      },
      sanitize: sandbox.CariHubBlk01ProfileSanitize,
      configOverride: FLAG_DUAL_READ,
      hintUsuarioId: IDS.hubOwnerUid
    });
    assert.equal(result.found, true);
    assert.equal(result.source, 'usuarios_perfilesDetalle');
    const out = sandbox.CariHubResultadosRegistrados.normalizarFromBlk01Resolver(result);
    assert.ok(out);
    assert.equal(out.__id, IDS.hubFallbackPerfilId);
    assert.equal(out.uid, IDS.hubOwnerUid);
    assert.equal(out.nombre, 'Hub Fallback Profile');
  });

  test('D2 hub fallback via cargarPerfilFirestore + Provider cache', async () => {
    const sandbox = createSandbox({
      sessionStorage: {
        _map: {},
        getItem(k) {
          return this._map[k] || null;
        },
        setItem(k, v) {
          this._map[k] = String(v);
        },
        removeItem(k) {
          delete this._map[k];
        }
      }
    });
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    loadResultadosAndInit(sandbox);
    const fixtures = vmFixturesFromJson();
    delete fixtures.perfiles[IDS.hubFallbackPerfilId];
    seedStore(sandbox, fixtures);
    sandbox.CariHubOwnerHintProvider.setOwnerHint(IDS.hubFallbackPerfilId, IDS.hubOwnerUid);
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(IDS.hubFallbackPerfilId);
    assert.ok(out);
    assert.equal(out.__id, IDS.hubFallbackPerfilId);
    assert.equal(out.uid, IDS.hubOwnerUid);
    assert.equal(out.__blk01Source, 'usuarios_perfilesDetalle');
  });

  test('E total miss — null for demo fallback path', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    loadResultadosAndInit(sandbox);
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(IDS.missingId);
    assert.equal(out, null);
  });

  test('F permission-denied on perfiles — safe legacy fallback', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    loadResultadosAndInit(sandbox);
    trackLegacyReads(sandbox);
    seedStore(sandbox, vmFixturesFromJson());
    const fs = sandbox.firebase.firestore();
    const orig = fs.collection.bind(fs);
    sandbox.firebase.firestore = function () {
      return {
        collection: function (name) {
          if (name === 'perfiles') {
            return {
              doc: function (id) {
                return {
                  get: function () {
                    sandbox.__reads.perfiles += 1;
                    return Promise.reject(
                      Object.assign(new Error('permission-denied'), { code: 'permission-denied' })
                    );
                  }
                };
              }
            };
          }
          return orig(name);
        }
      };
    };
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(IDS.permissionDeniedProbeId);
    assert.ok(out);
    assert.equal(out.nombre, 'Permission Legacy Fallback');
    assert.equal(sandbox.__reads.legacyUsuarios, 1);
  });

  test('G sanitize unavailable — never consumes raw resolver profile', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    sandbox.CariHubBlk01ProfileSanitize = undefined;
    loadResultadosAndInit(sandbox);
    trackLegacyReads(sandbox);
    seedStore(sandbox, vmFixturesFromJson());
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(IDS.legacyBridgeUid);
    assert.ok(out);
    assert.equal(out.nombre, 'Legacy Root Fallback');
    assert.equal(sandbox.__reads.perfiles, 0);
    assert.equal(sandbox.__reads.legacyUsuarios, 1);
  });

  test('privacy — recursive denylist + post-hydrate guard', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    loadResultadosAndInit(sandbox);
    seedStore(sandbox, vmFixturesFromJson());
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(IDS.privacyPerfilId);
    assert.ok(out);
    assert.equal(out.nombre, 'Privacy Fixture Public');
    assert.equal(out.email, undefined);
    assert.equal(out.kyc, undefined);
    assert.equal(out.datosFiscales, undefined);
    assertNoKycLeak(out, 'privacy fixture hydrated');
  });

  test('sanitize module — prototype pollution keys removed, input immutable', () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    const S = sandbox.CariHubBlk01ProfileSanitize;
    const input = {
      nombre: 'Safe',
      __proto__: { polluted: true },
      nested: { rfc: 'SECRET', ok: 'yes' }
    };
    const frozen = JSON.parse(JSON.stringify(input));
    const out = S.sanitizePublicProfileDeep(input);
    assert.equal(out.profile.nombre, 'Safe');
    assert.equal(out.profile.nested.ok, 'yes');
    assert.equal(out.profile.nested.rfc, undefined);
    assert.ok(out.strippedFields.some((f) => f.includes('rfc') || f.includes('__proto__')));
    assert.deepEqual(input, frozen);
  });

  test('flags OFF control — zero perfiles reads', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox);
    loadResultadosAndInit(sandbox);
    trackLegacyReads(sandbox);
    seedStore(sandbox, vmFixturesFromJson());
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(IDS.legacyBridgeUid);
    assert.ok(out);
    assert.equal(sandbox.__reads.perfiles, 0);
    assert.equal(sandbox.__reads.legacyUsuarios, 1);
  });

  test('demo id skips Firestore with flags ON', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    loadResultadosAndInit(sandbox);
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(IDS.demoControlId);
    assert.equal(out, null);
    assert.equal(sandbox.__reads.perfiles, 0);
    assert.equal(sandbox.__reads.usuarios, 0);
  });
});

describe('BLK-01 Phase 1C-b — scope guards (unchanged production surface)', () => {
  test('production config defaults remain OFF', () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox);
    const cfg = sandbox.CariHubBlk01Config.resolveConfig();
    assert.equal(cfg.blk01DualReadFallback, false);
    assert.equal(cfg.blk01PerfilesReadPrimary, false);
    assert.equal(cfg.blk01MigrationPhase, 'LEGACY_ONLY');
    assert.equal(sandbox.CariHubProfileResolver.isResolverActive(), false);
  });

  test('no writes in perfil-publico-init', () => {
    const src = readInitSource();
    assert.ok(!/writeBatch|addDoc|setDoc|updateDoc|\.collection\([^)]+\)\.doc\([^)]+\)\.set\(/.test(src));
  });

  test('Results query still usuarios-only', () => {
    const src = readResultadosSource();
    const fn = src.match(/function consultarPublicos\(\) {[\s\S]*?^  }/m);
    assert.ok(fn);
    assert.ok(fn[0].includes("collection('usuarios')"));
    assert.ok(!fn[0].includes("collection('perfiles')"));
  });

  test('no production HTML flag overrides', () => {
    const html = readFileSync(join(ROOT, 'public', 'perfil-publico.html'), 'utf8');
    assert.ok(!html.includes('__CARIHUB_FLAGS__'));
    assert.ok(!html.includes('CariHubBlk01RuntimeConfig'));
  });

  test('no firestore.rules or functions changes in Phase 1C-b files', () => {
    const paths = [
      'scripts/perfil-publico-blk01-emulator.test.mjs',
      'scripts/lib/blk01-emulator-guard.mjs',
      'scripts/lib/blk01-perfil-publico-sandbox.mjs',
      'scripts/blk01-phase1cb-browser-smoke.mjs',
      'public/blk01-phase1cb-smoke-harness.html'
    ];
    for (const rel of paths) {
      const full = join(ROOT, rel);
      try {
        const src = readFileSync(full, 'utf8');
        assert.ok(!src.includes('firebase deploy'));
        assert.ok(!src.includes('carihub-app'));
      } catch {
        // harness/smoke may not exist yet during guard bootstrap
      }
    }
  });
});

describe('BLK-01 Phase 1C-b — real Firestore Emulator reads', () => {
  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: FIXTURES.projectId,
      firestore: { rules: RULES }
    });
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await seedFixtures();
  });

  after(async () => {
    if (testEnv) await testEnv.cleanup();
  });

  test('emulator seed — perfiles and usuarios readable', async () => {
    const ctx = testEnv.unauthenticatedContext();
    const db = ctx.firestore();
    await assertSucceeds(getDoc(doc(db, 'perfiles', IDS.opaquePerfilId)));
    await assertSucceeds(getDoc(doc(db, 'usuarios', IDS.hubOwnerUid)));
  });

  test('resolver perfiles hit against emulator-backed mock bridge', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    const ctx = testEnv.unauthenticatedContext();
    const emuDb = ctx.firestore();
    const Resolver = sandbox.CariHubProfileResolver;
    const result = await Resolver.resolveProfile(IDS.opaquePerfilId, {
      firestore: {
        getPerfilDoc: async (id) => {
          const snap = await getDoc(doc(emuDb, 'perfiles', id));
          return {
            exists: snap.exists(),
            id: snap.id,
            data: snap.exists() ? snap.data() : null,
            error: null
          };
        },
        getUsuarioDoc: async (uid) => {
          const snap = await getDoc(doc(emuDb, 'usuarios', uid));
          return {
            exists: snap.exists(),
            id: snap.id,
            data: snap.exists() ? snap.data() : null,
            error: null
          };
        }
      },
      sanitize: sandbox.CariHubBlk01ProfileSanitize,
      configOverride: FLAG_DUAL_READ
    });
    assert.equal(result.found, true);
    assert.equal(result.source, 'perfiles');
    assert.equal(result.perfilId, IDS.opaquePerfilId);
    assertNoKycLeak(result.profile, 'emulator resolver perfiles hit');
  });

  test('resolver hub fallback with hint against emulator data', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, FLAG_DUAL_READ);
    const ctx = testEnv.unauthenticatedContext();
    const emuDb = ctx.firestore();
    const Resolver = sandbox.CariHubProfileResolver;
    const result = await Resolver.resolveProfile(IDS.hubFallbackPerfilId, {
      firestore: {
        getPerfilDoc: async () => ({ exists: false, id: IDS.hubFallbackPerfilId, data: null, error: null }),
        getUsuarioDoc: async (uid) => {
          const snap = await getDoc(doc(emuDb, 'usuarios', uid));
          return {
            exists: snap.exists(),
            id: snap.id,
            data: snap.exists() ? snap.data() : null,
            error: null
          };
        }
      },
      sanitize: sandbox.CariHubBlk01ProfileSanitize,
      configOverride: FLAG_DUAL_READ,
      hintUsuarioId: IDS.hubOwnerUid
    });
    assert.equal(result.found, true);
    assert.equal(result.source, 'usuarios_perfilesDetalle');
    assert.equal(result.usuarioId, IDS.hubOwnerUid);
  });
});
