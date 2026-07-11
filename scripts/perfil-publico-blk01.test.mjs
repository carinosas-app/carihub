/**
 * BLK-01 Phase 1C-a — Public Profile resolver wiring tests.
 * Uso: node --test scripts/perfil-publico-blk01.test.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const ROOT = process.cwd();
const PUBLIC_JS = join(ROOT, 'public', 'js');

const MULTI_SRC = readFileSync(join(PUBLIC_JS, 'carihub-multi-perfil.js'), 'utf8');
const SANITIZE_SRC = readFileSync(join(PUBLIC_JS, 'carihub-blk01-profile-sanitize.js'), 'utf8');
const ADAPTER_SRC = readFileSync(join(PUBLIC_JS, 'carihub-blk01-hub-adapter.js'), 'utf8');
const CONFIG_SRC = readFileSync(join(PUBLIC_JS, 'carihub-blk01-config.js'), 'utf8');
const RESOLVER_SRC = readFileSync(join(PUBLIC_JS, 'carihub-profile-resolver.js'), 'utf8');
const OWNER_HINT_SRC = readFileSync(join(PUBLIC_JS, 'carihub-blk01-owner-hint-provider.js'), 'utf8');
const PRIVACY_SRC = readFileSync(join(PUBLIC_JS, 'carihub-public-privacy-guard.js'), 'utf8');
const RESULTADOS_SRC = readFileSync(join(PUBLIC_JS, 'resultados-registrados.js'), 'utf8');
const INIT_SRC = readFileSync(join(PUBLIC_JS, 'perfil-publico-init.js'), 'utf8');

function createSessionStorageMock(initial) {
  const map = new Map(Object.entries(initial || {}));
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
    _dump() {
      return Object.fromEntries(map.entries());
    }
  };
}

function readOwnerHintStore(sessionStorage) {
  const raw = sessionStorage.getItem('carihub_blk01_owner_hint_v1');
  return raw ? JSON.parse(raw) : null;
}

function createSandbox(extra) {
  extra = extra || {};
  const reads = { perfiles: 0, usuarios: 0, legacyUsuarios: 0 };
  const store = {
    perfiles: Object.create(null),
    usuarios: Object.create(null)
  };

  function makeDoc(id, data) {
    return {
      id,
      exists: !!data,
      data: function () { return data; }
    };
  }

  function makeCollection(name) {
    return {
      doc: function (id) {
        return {
          get: function () {
            if (name === 'perfiles') reads.perfiles += 1;
            if (name === 'usuarios') reads.usuarios += 1;
            var data = store[name][id] || null;
            return Promise.resolve(makeDoc(id, data));
          }
        };
      }
    };
  }

  const sandbox = {
    console,
    Promise,
    Object,
    Array,
    String,
    RegExp,
    WeakSet,
    Date,
    URL: URL,
    URLSearchParams: URLSearchParams,
    location: { href: 'http://127.0.0.1/perfil-publico.html', pathname: '/perfil-publico.html' },
    sessionStorage: { getItem: () => null },
    firebase: {
      apps: [{}],
      firestore: function () {
        return {
          collection: function (name) {
            return makeCollection(name);
          }
        };
      }
    },
    CariHubDB: null,
    CariHubFieldEngineLite: null,
    CariHubRegistroPublicBlocks: null,
    CariHubMultiPerfil: undefined,
    CariHubBlk01Config: undefined,
    CariHubBlk01ProfileSanitize: undefined,
    CariHubBlk01HubAdapter: undefined,
    CariHubProfileResolver: undefined,
    CariHubPublicPrivacyGuard: undefined,
    CariHubResultadosRegistrados: undefined,
    CariHubPerfilPublico: undefined,
    __CARIHUB_FLAGS__: undefined,
    __reads: reads,
    __store: store
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  Object.assign(sandbox, extra || {});
  vm.createContext(sandbox);
  return sandbox;
}

function loadBlk01Stack(sandbox, flags) {
  vm.runInContext(MULTI_SRC, sandbox, { filename: 'carihub-multi-perfil.js' });
  vm.runInContext(SANITIZE_SRC, sandbox, { filename: 'carihub-blk01-profile-sanitize.js' });
  vm.runInContext(ADAPTER_SRC, sandbox, { filename: 'carihub-blk01-hub-adapter.js' });
  vm.runInContext(CONFIG_SRC, sandbox, { filename: 'carihub-blk01-config.js' });
  vm.runInContext(RESOLVER_SRC, sandbox, { filename: 'carihub-profile-resolver.js' });
  vm.runInContext(OWNER_HINT_SRC, sandbox, { filename: 'carihub-blk01-owner-hint-provider.js' });
  if (flags) sandbox.__CARIHUB_FLAGS__ = flags;
}

function loadResultadosAndInit(sandbox) {
  vm.runInContext(PRIVACY_SRC, sandbox, { filename: 'carihub-public-privacy-guard.js' });
  vm.runInContext(RESULTADOS_SRC, sandbox, { filename: 'resultados-registrados.js' });
  vm.runInContext(INIT_SRC, sandbox, { filename: 'perfil-publico-init.js' });
}

function trackLegacyReads(sandbox) {
  var fs = sandbox.firebase.firestore();
  var origCollection = fs.collection.bind(fs);
  sandbox.firebase.firestore = function () {
    return {
      collection: function (name) {
        var col = origCollection(name);
        if (name !== 'usuarios') return col;
        return {
          doc: function (id) {
            return {
              get: function () {
                sandbox.__reads.legacyUsuarios += 1;
                var data = sandbox.__store.usuarios[id] || null;
                return Promise.resolve({
                  id,
                  exists: !!data,
                  data: function () { return data; }
                });
              }
            };
          }
        };
      }
    };
  };
}

describe('BLK-01 Phase 1C-a — normalizarFromBlk01Resolver adapter', () => {
  test('sets __id, perfilId, uid from resolver result', () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox);
    vm.runInContext(PRIVACY_SRC, sandbox);
    vm.runInContext(RESULTADOS_SRC, sandbox);
    const RR = sandbox.CariHubResultadosRegistrados;
    const out = RR.normalizarFromBlk01Resolver({
      found: true,
      perfilId: 'perfil_lxyzabc_aaa111',
      usuarioId: 'uid_owner_abc',
      source: 'perfiles',
      profile: {
        nombre: 'Opaque Profile',
        categoria: 'salud',
        email: 'secret@test.com'
      },
      reasons: ['read_perfiles_hit']
    });
    assert.ok(out);
    assert.equal(out.__id, 'perfil_lxyzabc_aaa111');
    assert.equal(out.perfilId, 'perfil_lxyzabc_aaa111');
    assert.equal(out.uid, 'uid_owner_abc');
    assert.equal(out.nombre, 'Opaque Profile');
    assert.equal(out.email, undefined);
    assert.equal(out.__blk01Source, 'perfiles');
  });
});

describe('BLK-01 Phase 1C-a — perfil-publico-init wiring', () => {
  test('flags OFF → legacy usuarios path only (zero BLK-01 reads)', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox);
    loadResultadosAndInit(sandbox);
    trackLegacyReads(sandbox);
    sandbox.__store.usuarios.uid_legacy = {
      uid: 'uid_legacy',
      nombre: 'Legacy User',
      categoria: 'salud',
      aprobado: true,
      activo: true
    };
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore('uid_legacy');
    assert.ok(out);
    assert.equal(out.__id, 'uid_legacy');
    assert.equal(sandbox.__reads.perfiles, 0);
    assert.equal(sandbox.__reads.usuarios, 0);
    assert.equal(sandbox.__reads.legacyUsuarios, 1);
  });

  test('resolver unavailable → legacy path', async () => {
    const sandbox = createSandbox();
    vm.runInContext(PRIVACY_SRC, sandbox);
    vm.runInContext(RESULTADOS_SRC, sandbox);
    vm.runInContext(INIT_SRC, sandbox);
    trackLegacyReads(sandbox);
    sandbox.__store.usuarios.uid_only = { uid: 'uid_only', nombre: 'Only Legacy', categoria: 'salud' };
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore('uid_only');
    assert.ok(out);
    assert.equal(out.nombre, 'Only Legacy');
    assert.equal(sandbox.__reads.legacyUsuarios, 1);
  });

  test('active + perfiles hit → hydrate pipeline', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, { blk01DualReadFallback: true });
    loadResultadosAndInit(sandbox);
    sandbox.__store.perfiles['perfil_lxyzabc_aaa111'] = {
      perfilId: 'perfil_lxyzabc_aaa111',
      usuarioId: 'uid_owner_abc',
      nombre: 'From Perfiles',
      categoria: 'salud'
    };
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore('perfil_lxyzabc_aaa111');
    assert.ok(out);
    assert.equal(out.__id, 'perfil_lxyzabc_aaa111');
    assert.equal(out.perfilId, 'perfil_lxyzabc_aaa111');
    assert.equal(out.uid, 'uid_owner_abc');
    assert.equal(out.nombre, 'From Perfiles');
    assert.equal(sandbox.__reads.perfiles, 1);
    assert.equal(sandbox.__reads.legacyUsuarios, 0);
  });

  test('active + bridge uid fallback → hydrate pipeline', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, { blk01DualReadFallback: true });
    loadResultadosAndInit(sandbox);
    const uid = 'firebaseUid28charsEx';
    sandbox.__store.usuarios[uid] = {
      uid,
      perfilId: uid,
      nombre: 'Legacy Root',
      categoria: 'salud'
    };
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(uid);
    assert.ok(out);
    assert.equal(out.__id, uid);
    assert.equal(out.nombre, 'Legacy Root');
    assert.ok(sandbox.__reads.perfiles >= 1);
    assert.ok(sandbox.__reads.usuarios >= 1);
  });

  test('active + opaque perfilId without owner hint → not found (fail-closed)', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, { blk01DualReadFallback: true });
    loadResultadosAndInit(sandbox);
    const uid = 'uid_multi';
    const opaque = 'perfil_lxyzabc_aaa111';
    sandbox.__store.usuarios[uid] = {
      uid,
      perfilesDetalle: {
        [opaque]: { perfilId: opaque, nombre: 'Opaque Hub' }
      },
      perfilesVinculados: [{ perfilId: opaque }],
      perfilActivoId: opaque
    };
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(opaque);
    assert.equal(out, null);
  });

  test('active + valid cache hint → hub fallback via cargarPerfilFirestore', async () => {
    const ss = createSessionStorageMock();
    const sandbox = createSandbox({ sessionStorage: ss });
    loadBlk01Stack(sandbox, { blk01DualReadFallback: true });
    loadResultadosAndInit(sandbox);
    const uid = 'uid_multi';
    const opaque = 'perfil_lxyzabc_aaa111';
    sandbox.__store.usuarios[uid] = {
      uid,
      perfilesDetalle: {
        [opaque]: { perfilId: opaque, nombre: 'Opaque Hub Cached' }
      },
      perfilesVinculados: [{ perfilId: opaque }],
      perfilActivoId: opaque
    };
    sandbox.CariHubOwnerHintProvider.setOwnerHint(opaque, uid);
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(opaque);
    assert.ok(out);
    assert.equal(out.__id, opaque);
    assert.equal(out.uid, uid);
    assert.equal(out.nombre, 'Opaque Hub Cached');
    assert.equal(out.__blk01Source, 'usuarios_perfilesDetalle');
  });

  test('flags OFF → zero Provider side effects on sessionStorage', async () => {
    const ss = createSessionStorageMock();
    const sandbox = createSandbox({ sessionStorage: ss });
    loadBlk01Stack(sandbox);
    loadResultadosAndInit(sandbox);
    trackLegacyReads(sandbox);
    sandbox.__store.usuarios.uid_legacy = { uid: 'uid_legacy', nombre: 'Legacy User', categoria: 'salud' };
    sandbox.CariHubOwnerHintProvider.setOwnerHint('perfil_should_not_change', 'uid_legacy');
    const before = readOwnerHintStore(ss);
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore('uid_legacy');
    assert.ok(out);
    assert.equal(sandbox.__reads.perfiles, 0);
    assert.deepEqual(readOwnerHintStore(ss), before);
  });

  test('perfiles hit → verified pair cached', async () => {
    const ss = createSessionStorageMock();
    const sandbox = createSandbox({ sessionStorage: ss });
    loadBlk01Stack(sandbox, { blk01DualReadFallback: true });
    loadResultadosAndInit(sandbox);
    const opaque = 'perfil_lxyzabc_aaa111';
    sandbox.__store.perfiles[opaque] = {
      perfilId: opaque,
      usuarioId: 'uid_owner_abc',
      nombre: 'From Perfiles',
      categoria: 'salud'
    };
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(opaque);
    assert.ok(out);
    const stored = readOwnerHintStore(ss);
    assert.equal(stored.entries[opaque].usuarioId, 'uid_owner_abc');
  });

  test('SA3 wrong owner cache → not found and cache invalidated', async () => {
    const ss = createSessionStorageMock();
    const sandbox = createSandbox({ sessionStorage: ss });
    loadBlk01Stack(sandbox, { blk01DualReadFallback: true });
    loadResultadosAndInit(sandbox);
    const uid = 'uid_multi';
    const wrongUid = 'uid_wrong_owner';
    const opaque = 'perfil_lxyzabc_aaa111';
    sandbox.__store.usuarios[uid] = {
      uid,
      perfilesDetalle: { [opaque]: { perfilId: opaque, nombre: 'Opaque Hub' } },
      perfilesVinculados: [{ perfilId: opaque }]
    };
    sandbox.__store.usuarios[wrongUid] = { uid: wrongUid, nombre: 'Wrong Owner Hub' };
    sandbox.CariHubOwnerHintProvider.setOwnerHint(opaque, wrongUid);
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore(opaque);
    assert.equal(out, null);
    assert.equal(sandbox.CariHubOwnerHintProvider.getOwnerHint(opaque), null);
  });

  test('SA1 forged explicit hint via Provider does not bypass verification alone', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, { blk01DualReadFallback: true });
    loadResultadosAndInit(sandbox);
    const opaque = 'perfil_lxyzabc_aaa111';
    const forged = 'uid_attacker_forge';
    sandbox.__store.usuarios[forged] = { uid: forged, nombre: 'Attacker', perfilesDetalle: {} };
    const hint = sandbox.CariHubOwnerHintProvider.deriveOwnerHint(opaque, { explicitHint: forged });
    assert.equal(hint, forged);
    const Resolver = sandbox.CariHubProfileResolver;
    const result = await Resolver.resolveProfile(opaque, {
      configOverride: { blk01DualReadFallback: true },
      hintUsuarioId: hint,
      firestore: {
        getPerfilDoc: () => Promise.resolve({ exists: false, data: null }),
        getUsuarioDoc: (id) => Promise.resolve({
          exists: !!sandbox.__store.usuarios[id],
          data: sandbox.__store.usuarios[id] || null
        })
      },
      sanitize: sandbox.CariHubBlk01ProfileSanitize
    });
    assert.equal(result.found, false);
  });

  test('active + not-found → null (demo path)', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, { blk01DualReadFallback: true });
    loadResultadosAndInit(sandbox);
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore('missing_profile_id');
    assert.equal(out, null);
  });

  test('sanitize unavailable while active → legacy fallback (no raw resolver consume)', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, { blk01DualReadFallback: true });
    sandbox.CariHubBlk01ProfileSanitize = undefined;
    loadResultadosAndInit(sandbox);
    trackLegacyReads(sandbox);
    sandbox.__store.usuarios.uid_sanitize = { uid: 'uid_sanitize', nombre: 'Legacy Sanitize', categoria: 'salud' };
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore('uid_sanitize');
    assert.ok(out);
    assert.equal(out.nombre, 'Legacy Sanitize');
    assert.equal(sandbox.__reads.perfiles, 0);
    assert.equal(sandbox.__reads.legacyUsuarios, 1);
  });

  test('demo id skips Firestore', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox);
    loadResultadosAndInit(sandbox);
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore('demo-escort-1');
    assert.equal(out, null);
    assert.equal(sandbox.__reads.perfiles, 0);
    assert.equal(sandbox.__reads.usuarios, 0);
    assert.equal(sandbox.__reads.legacyUsuarios, 0);
  });

  test('permission-denied on resolver reads → legacy fallback when safe', async () => {
    const sandbox = createSandbox();
    loadBlk01Stack(sandbox, { blk01DualReadFallback: true });
    loadResultadosAndInit(sandbox);
    trackLegacyReads(sandbox);
    sandbox.__store.usuarios.uid_perm = { uid: 'uid_perm', nombre: 'Perm Legacy', categoria: 'salud' };
    const fs = sandbox.firebase.firestore();
    const origCollection = fs.collection.bind(fs);
    sandbox.firebase.firestore = function () {
      return {
        collection: function (name) {
          if (name === 'perfiles') {
            return {
              doc: function (id) {
                return {
                  get: function () {
                    sandbox.__reads.perfiles += 1;
                    return Promise.reject(Object.assign(new Error('permission-denied'), { code: 'permission-denied' }));
                  }
                };
              }
            };
          }
          return origCollection(name);
        }
      };
    };
    const out = await sandbox.CariHubPerfilPublico.cargarPerfilFirestore('uid_perm');
    assert.ok(out);
    assert.equal(out.nombre, 'Perm Legacy');
  });
});

describe('BLK-01 Phase 1C-a — scope guards', () => {
  test('resultados listado query unchanged (usuarios only)', () => {
    const src = readFileSync(join(PUBLIC_JS, 'resultados-registrados.js'), 'utf8');
    const fn = src.match(/function consultarPublicos\(\) {[\s\S]*?^  }/m);
    assert.ok(fn);
    assert.ok(fn[0].includes("collection('usuarios')"));
    assert.ok(!fn[0].includes("collection('perfiles')"));
  });

  test('no Firestore write APIs in perfil-publico-init', () => {
    const src = readFileSync(join(PUBLIC_JS, 'perfil-publico-init.js'), 'utf8');
    assert.ok(!/writeBatch|addDoc|setDoc|updateDoc|\.collection\([^)]+\)\.doc\([^)]+\)\.set\(/.test(src));
  });

  test('no URL owner hint params in perfil-publico-init', () => {
    const src = readFileSync(join(PUBLIC_JS, 'perfil-publico-init.js'), 'utf8');
    assert.ok(!src.includes('hintUid'));
    assert.ok(!/searchParams\.get\(['"]uid['"]\)/.test(src));
    assert.ok(!/searchParams\.get\(['"]ownerUid['"]\)/.test(src));
    assert.ok(!/searchParams\.get\(['"]hintUid['"]\)/.test(src));
  });

  test('no rules/functions/migration references in Phase 1C files', () => {
    for (const rel of [
      'public/js/perfil-publico-init.js',
      'public/js/resultados-registrados.js',
      'public/perfil-publico.html'
    ]) {
      const src = readFileSync(join(ROOT, rel), 'utf8');
      assert.ok(!src.includes('firestore.rules'));
      assert.ok(!src.includes('functions/'));
      assert.ok(!src.includes('blk01-migracion'));
    }
  });
});
