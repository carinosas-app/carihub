/**
 * BLK-01 Phase 1A/1B-prep — profile resolver, adapter, sanitize tests.
 * Uso: node --test scripts/blk01-profile-resolver.test.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const ROOT = process.cwd();
const PUBLIC_JS = join(ROOT, 'public', 'js');
const CONFIG_SRC = readFileSync(join(PUBLIC_JS, 'carihub-blk01-config.js'), 'utf8');
const SANITIZE_SRC = readFileSync(join(PUBLIC_JS, 'carihub-blk01-profile-sanitize.js'), 'utf8');
const ADAPTER_SRC = readFileSync(join(PUBLIC_JS, 'carihub-blk01-hub-adapter.js'), 'utf8');
const RESOLVER_SRC = readFileSync(join(PUBLIC_JS, 'carihub-profile-resolver.js'), 'utf8');
const MULTI_SRC = readFileSync(join(PUBLIC_JS, 'carihub-multi-perfil.js'), 'utf8');

function createSandbox(extra) {
  const sandbox = {
    console,
    Promise,
    Object,
    Array,
    String,
    RegExp,
    WeakSet,
    globalThis: {},
    window: null,
    CariHubMultiPerfil: undefined,
    CariHubBlk01Config: undefined,
    CariHubBlk01RuntimeConfig: undefined,
    CariHubBlk01ProfileSanitize: undefined,
    CariHubBlk01HubAdapter: undefined,
    CariHubProfileResolver: undefined,
    __CARIHUB_FLAGS__: undefined
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  Object.assign(sandbox, extra || {});
  vm.createContext(sandbox);
  return sandbox;
}

function loadModules(sandbox, flags, opts) {
  opts = opts || {};
  if (opts.multi !== false) {
    vm.runInContext(MULTI_SRC, sandbox, { filename: 'carihub-multi-perfil.js' });
  }
  if (opts.sanitize !== false) {
    vm.runInContext(SANITIZE_SRC, sandbox, { filename: 'carihub-blk01-profile-sanitize.js' });
  }
  if (opts.adapter !== false) {
    vm.runInContext(ADAPTER_SRC, sandbox, { filename: 'carihub-blk01-hub-adapter.js' });
  }
  vm.runInContext(CONFIG_SRC, sandbox, { filename: 'carihub-blk01-config.js' });
  vm.runInContext(RESOLVER_SRC, sandbox, { filename: 'carihub-profile-resolver.js' });
  if (flags) {
    sandbox.__CARIHUB_FLAGS__ = flags;
  }
  return {
    Config: sandbox.CariHubBlk01Config,
    Sanitize: sandbox.CariHubBlk01ProfileSanitize,
    Adapter: sandbox.CariHubBlk01HubAdapter,
    Resolver: sandbox.CariHubProfileResolver,
    Multi: sandbox.CariHubMultiPerfil
  };
}

describe('BLK-01 config contract', () => {
  test('all flags default OFF', () => {
    const sandbox = createSandbox();
    const { Config } = loadModules(sandbox);
    const cfg = Config.resolveConfig();
    assert.equal(cfg.blk01DualWriteShadow, false);
    assert.equal(cfg.blk01DualReadFallback, false);
    assert.equal(cfg.blk01PerfilesReadPrimary, false);
    assert.equal(cfg.blk01PerfilesWritePrimary, false);
    assert.equal(cfg.blk01LegacyDeprecated, false);
    assert.equal(cfg.blk01ResultsPerfilesQuery, false);
    assert.equal(cfg.blk01ReconcileEnabled, false);
    assert.equal(cfg.blk01MigrationPhase, 'LEGACY_ONLY');
    assert.equal(Config.isProfileResolverReadEnabled(cfg), false);
  });

  test('invalid migration phase fails safe to LEGACY_ONLY', () => {
    const sandbox = createSandbox();
    const { Config } = loadModules(sandbox);
    const cfg = Config.resolveConfig({ blk01MigrationPhase: 'NOT_A_REAL_PHASE' });
    assert.equal(cfg.blk01MigrationPhase, 'LEGACY_ONLY');
  });

  test('invalid bool values fail safe to false', () => {
    const sandbox = createSandbox();
    const { Config } = loadModules(sandbox);
    const cfg = Config.resolveConfig({
      blk01DualReadFallback: 'maybe',
      blk01PerfilesReadPrimary: {},
      blk01DualWriteShadow: null
    });
    assert.equal(cfg.blk01DualReadFallback, false);
    assert.equal(cfg.blk01PerfilesReadPrimary, false);
    assert.equal(cfg.blk01DualWriteShadow, false);
  });

  test('valid migration phases accepted', () => {
    const sandbox = createSandbox();
    const { Config } = loadModules(sandbox);
    for (const phase of Config.MIGRATION_PHASES) {
      const cfg = Config.resolveConfig({ blk01MigrationPhase: phase });
      assert.equal(cfg.blk01MigrationPhase, phase);
    }
  });

  test('API export is not used as runtime override source', () => {
    const sandbox = createSandbox();
    const { Config } = loadModules(sandbox);
    Config.blk01DualReadFallback = true;
    Config.MIGRATION_PHASES = ['HACKED'];
    const cfg = Config.resolveConfig();
    assert.equal(cfg.blk01DualReadFallback, false);
    assert.equal(Config.isProfileResolverReadEnabled(cfg), false);
  });

  test('CariHubBlk01RuntimeConfig overrides valid flags only', () => {
    const sandbox = createSandbox({
      CariHubBlk01RuntimeConfig: {
        blk01DualReadFallback: true,
        blk01PerfilesReadPrimary: '1',
        resolveConfig: 'evil',
        MIGRATION_PHASES: ['HACK'],
        extraUnknown: true
      }
    });
    const { Config } = loadModules(sandbox);
    const cfg = Config.resolveConfig();
    assert.equal(cfg.blk01DualReadFallback, true);
    assert.equal(cfg.blk01PerfilesReadPrimary, true);
    assert.equal(cfg.blk01DualWriteShadow, false);
    assert.equal(cfg.blk01MigrationPhase, 'LEGACY_ONLY');
  });

  test('__CARIHUB_FLAGS__ remains supported as override alias', () => {
    const sandbox = createSandbox();
    const { Config } = loadModules(sandbox, { blk01DualReadFallback: true });
    const cfg = Config.resolveConfig();
    assert.equal(cfg.blk01DualReadFallback, true);
    assert.equal(Config.isProfileResolverReadEnabled(cfg), true);
  });
});

describe('BLK-01 profile resolver — inactive by default', () => {
  test('flags OFF → inactive, no Firestore reads', async () => {
    const sandbox = createSandbox();
    const { Resolver } = loadModules(sandbox);
    let reads = 0;
    const result = await Resolver.resolveProfile('uid_demo_1', {
      firestore: {
        getPerfilDoc() { reads++; return Promise.resolve({ exists: true, data: { nombre: 'X' } }); },
        getUsuarioDoc() { reads++; return Promise.resolve({ exists: true, data: {} }); }
      }
    });
    assert.equal(reads, 0);
    assert.equal(result.active, false);
    assert.equal(result.found, false);
    assert.equal(result.wrote, false);
    assert.ok(result.reasons.includes(Resolver.REASON.FLAGS_OFF_INACTIVE));
  });
});

describe('BLK-01 profile resolver — identifier normalization', () => {
  test('legacy uid preserved for bridge', () => {
    const sandbox = createSandbox();
    const { Resolver } = loadModules(sandbox);
    const uid = 'firebaseUid28charsExample12';
    const norm = Resolver.normalizePerfilId(uid);
    assert.equal(norm.valid, true);
    assert.equal(norm.perfilId, uid);
    const bridge = Resolver.bridgeUsuarioCandidates(uid);
    assert.ok(bridge.includes(uid));
    assert.ok(bridge.includes('perfil_' + uid));
  });

  test('opaque perfilId preserved — not collapsed to uid', () => {
    const sandbox = createSandbox();
    const { Resolver } = loadModules(sandbox);
    const opaque = 'perfil_lxyzabc_7f3k2m';
    const norm = Resolver.normalizePerfilId(opaque);
    assert.equal(norm.perfilId, opaque);
    assert.equal(norm.opaque, true);
    assert.ok(norm.reasons.includes(Resolver.REASON.OPAQUE_ID_PRESERVED));
    const bridge = Resolver.bridgeUsuarioCandidates(opaque);
    assert.equal(bridge.length, 1);
    assert.equal(bridge[0], opaque);
  });

  test('multi-profile IDs remain distinct', () => {
    const sandbox = createSandbox();
    const { Resolver } = loadModules(sandbox);
    const a = Resolver.normalizePerfilId('perfil_lxyzabc_aaa111');
    const b = Resolver.normalizePerfilId('perfil_lxyzabc_bbb222');
    assert.notEqual(a.perfilId, b.perfilId);
    assert.equal(a.opaque, true);
    assert.equal(b.opaque, true);
  });

  test('invalid id fails safely', async () => {
    const sandbox = createSandbox();
    const { Resolver } = loadModules(sandbox);
    const result = await Resolver.resolveProfile('   ', {
      configOverride: { blk01DualReadFallback: true }
    });
    assert.equal(result.found, false);
    assert.ok(result.reasons.includes(Resolver.REASON.INVALID_PERFIL_ID));
    assert.equal(result.wrote, false);
  });
});

describe('BLK-01 profile resolver — read order when active', () => {
  const readFlags = { blk01DualReadFallback: true };

  test('perfiles-first contract', async () => {
    const sandbox = createSandbox();
    const { Resolver } = loadModules(sandbox);
    const order = [];
    const result = await Resolver.resolveProfile('perfil_target', {
      configOverride: readFlags,
      firestore: {
        getPerfilDoc(id) {
          order.push('perfiles:' + id);
          return Promise.resolve({
            exists: true,
            data: { perfilId: id, usuarioId: 'uid1', nombre: 'From Perfiles', email: 'secret@test.com' }
          });
        },
        getUsuarioDoc(uid) {
          order.push('usuarios:' + uid);
          return Promise.resolve({ exists: true, data: { nombre: 'From Usuarios' } });
        }
      }
    });
    assert.equal(result.found, true);
    assert.equal(result.source, 'perfiles');
    assert.equal(result.profile.nombre, 'From Perfiles');
    assert.equal(result.profile.email, undefined);
    assert.ok(result.reasons.includes(Resolver.REASON.READ_PERFILES_HIT));
    assert.deepEqual(order, ['perfiles:perfil_target']);
    assert.equal(result.wrote, false);
  });

  test('usuarios fallback when perfiles miss and dual-read ON', async () => {
    const sandbox = createSandbox();
    const { Resolver, Multi } = loadModules(sandbox);
    const uid = 'uid_legacy_bridge';
    const hub = {
      uid,
      perfilesVinculados: [{ perfilId: 'perfil_a' }],
      perfilesDetalle: {
        perfil_a: { perfilId: 'perfil_a', nombre: 'Multi A', categoria: 'salud' }
      },
      perfilActivoId: 'perfil_a'
    };
    assert.ok(Multi.expandPerfilesFromHub(hub, uid).length === 1);

    const result = await Resolver.resolveProfile('perfil_a', {
      configOverride: readFlags,
      hintUsuarioId: uid,
      firestore: {
        getPerfilDoc() {
          return Promise.resolve({ exists: false, data: null });
        },
        getUsuarioDoc(id) {
          if (id === uid) return Promise.resolve({ exists: true, data: hub });
          return Promise.resolve({ exists: false, data: null });
        }
      }
    });
    assert.equal(result.found, true);
    assert.equal(result.source, 'usuarios_perfilesDetalle');
    assert.equal(result.profile.nombre, 'Multi A');
    assert.ok(result.reasons.includes(Resolver.REASON.READ_PERFILES_MISS));
    assert.ok(result.reasons.includes(Resolver.REASON.READ_USUARIOS_FALLBACK_HIT));
    assert.equal(result.wrote, false);
  });

  test('perfiles read primary without fallback → not found after perfiles miss', async () => {
    const sandbox = createSandbox();
    const { Resolver } = loadModules(sandbox);
    let usuarioReads = 0;
    const result = await Resolver.resolveProfile('only_perfiles', {
      configOverride: { blk01PerfilesReadPrimary: true, blk01DualReadFallback: false },
      firestore: {
        getPerfilDoc() {
          return Promise.resolve({ exists: false, data: null });
        },
        getUsuarioDoc() {
          usuarioReads++;
          return Promise.resolve({ exists: true, data: { nombre: 'Hub' } });
        }
      }
    });
    assert.equal(usuarioReads, 0);
    assert.equal(result.found, false);
    assert.ok(result.reasons.includes(Resolver.REASON.READ_PERFILES_MISS));
    assert.ok(result.reasons.includes(Resolver.REASON.PROFILE_NOT_FOUND));
  });

  test('not-found when active, dual-read, no data anywhere', async () => {
    const sandbox = createSandbox();
    const { Resolver } = loadModules(sandbox);
    const result = await Resolver.resolveProfile('missing_id', {
      configOverride: readFlags,
      firestore: {
        getPerfilDoc() { return Promise.resolve({ exists: false, data: null }); },
        getUsuarioDoc() { return Promise.resolve({ exists: false, data: null }); }
      }
    });
    assert.equal(result.found, false);
    assert.equal(result.source, 'none');
    assert.ok(result.reasons.includes(Resolver.REASON.PROFILE_NOT_FOUND));
    assert.equal(result.wrote, false);
  });
});

describe('BLK-01 profile resolver — security & determinism', () => {
  test('denylist / private field filtering', () => {
    const sandbox = createSandbox();
    const { Resolver } = loadModules(sandbox);
    const raw = {
      nombre: 'Public',
      email: 'private@test.com',
      verificacion: { estado: 'aprobada' },
      ineFrente: 'path/secret.jpg',
      kyc: { level: 2 },
      geo: { ciudad: 'CDMX' }
    };
    const out = Resolver.sanitizePublicProfile(raw);
    assert.equal(out.profile.nombre, 'Public');
    assert.equal(out.profile.geo.ciudad, 'CDMX');
    assert.equal(out.profile.email, undefined);
    assert.equal(out.profile.verificacion, undefined);
    assert.equal(out.profile.kyc, undefined);
    assert.ok(out.strippedFields.includes('email'));
    assert.ok(out.strippedFields.includes('verificacion'));
  });

  test('recursive nested denylist removal (W3)', () => {
    const sandbox = createSandbox();
    const { Sanitize } = loadModules(sandbox);
    const raw = {
      nombre: 'Public',
      contacto: { email: 'nested@test.com', telefono: '555' },
      fotos: [{ url: 'ok.jpg', meta: { email: 'hide@x.com' } }]
    };
    const out = Sanitize.sanitizePublicProfileDeep(raw);
    assert.equal(out.profile.nombre, 'Public');
    assert.equal(out.profile.contacto.email, undefined);
    assert.equal(out.profile.contacto.telefono, '555');
    assert.equal(out.profile.fotos[0].url, 'ok.jpg');
    assert.equal(out.profile.fotos[0].meta.email, undefined);
    assert.ok(out.strippedFields.some((p) => p.indexOf('email') >= 0));
  });

  test('immutable input behavior (W3)', () => {
    const sandbox = createSandbox();
    const { Sanitize } = loadModules(sandbox);
    const raw = { nombre: 'A', nested: { email: 'secret@test.com' } };
    const snapshot = JSON.stringify(raw);
    Sanitize.sanitizePublicProfileDeep(raw);
    assert.equal(JSON.stringify(raw), snapshot);
  });

  test('prototype-pollution keys removed (W3)', () => {
    const sandbox = createSandbox();
    const { Sanitize } = loadModules(sandbox);
    const raw = JSON.parse('{"nombre":"Ok","__proto__":{"admin":true},"constructor":{"x":1},"prototype":{"y":2}}');
    const out = Sanitize.sanitizePublicProfileDeep(raw);
    assert.equal(out.profile.nombre, 'Ok');
    assert.equal(Object.prototype.hasOwnProperty.call(out.profile, '__proto__'), false);
    assert.equal(Object.prototype.hasOwnProperty.call(out.profile, 'constructor'), false);
    assert.equal(Object.prototype.hasOwnProperty.call(out.profile, 'prototype'), false);
  });

  test('circular reference deterministic behavior (W3)', () => {
    const sandbox = createSandbox();
    const { Sanitize } = loadModules(sandbox);
    const raw = { nombre: 'Loop' };
    raw.self = raw;
    const out = Sanitize.sanitizePublicProfileDeep(raw);
    assert.equal(out.profile.nombre, 'Loop');
    assert.equal(out.profile.self, null);
    assert.ok(out.strippedFields.some((p) => p.endsWith('[circular]')));
  });

  test('deterministic structured response shape', async () => {
    const sandbox = createSandbox();
    const { Resolver } = loadModules(sandbox);
    const result = await Resolver.resolveProfile('any', {
      configOverride: { blk01DualReadFallback: true },
      firestore: {
        getPerfilDoc() { return Promise.resolve({ exists: false, data: null }); },
        getUsuarioDoc() { return Promise.resolve({ exists: false, data: null }); }
      }
    });
    const keys = Object.keys(result).sort();
    assert.deepEqual(keys, [
      'active', 'error', 'flags', 'found', 'normalizedPerfilId', 'ok',
      'perfilId', 'profile', 'reasons', 'source', 'strippedFields',
      'usuarioId', 'wrote'
    ].sort());
    assert.equal(result.wrote, false);
  });

  test('resolver module exposes no write APIs', () => {
    const sandbox = createSandbox();
    const { Resolver } = loadModules(sandbox);
    const api = Object.keys(Resolver);
    for (const name of api) {
      assert.ok(!/write|save|set|update|commit|batch|delete/i.test(name), 'unexpected write API: ' + name);
    }
  });
});

describe('BLK-01 Phase 1A — no consumer integration', () => {
  const CONSUMER_FILES = [
    'public/js/perfil-publico-init.js',
    'public/js/resultados-registrados.js',
    'public/js/carihub-favoritos.js'
  ];

  for (const rel of CONSUMER_FILES) {
    test(rel + ' does not reference CariHubProfileResolver', () => {
      const src = readFileSync(join(ROOT, rel), 'utf8');
      assert.ok(!src.includes('CariHubProfileResolver'));
      assert.ok(!src.includes('carihub-profile-resolver'));
      assert.ok(!src.includes('carihub-blk01-hub-adapter'));
      assert.ok(!src.includes('carihub-blk01-profile-sanitize'));
    });
  }
});

describe('BLK-01 Phase 1B-prep — W2 hub adapter contract', () => {
  test('TICKET-003 exports legacyPerfilId for adapter', () => {
    const sandbox = createSandbox();
    const { Multi } = loadModules(sandbox, null, { adapter: false, sanitize: false });
    assert.equal(typeof Multi.legacyPerfilId, 'function');
  });

  test('adapter contract requires minimum MultiPerfil methods', () => {
    const sandbox = createSandbox();
    const { Adapter } = loadModules(sandbox, null, { multi: false });
    const bad = Adapter.assertMultiPerfilContract({});
    assert.equal(bad.ok, false);
    assert.ok(bad.missing.includes('expandPerfilesFromHub'));
    const { Multi, Adapter: A2 } = loadModules(createSandbox());
    const good = A2.assertMultiPerfilContract(Multi);
    assert.equal(good.ok, true);
  });

  test('load-order independence via injected hubAdapter', async () => {
    const sandbox = createSandbox();
    vm.runInContext(MULTI_SRC, sandbox, { filename: 'carihub-multi-perfil.js' });
    vm.runInContext(SANITIZE_SRC, sandbox, { filename: 'carihub-blk01-profile-sanitize.js' });
    vm.runInContext(ADAPTER_SRC, sandbox, { filename: 'carihub-blk01-hub-adapter.js' });
    const Multi = sandbox.CariHubMultiPerfil;
    const Adapter = sandbox.CariHubBlk01HubAdapter;
    const injected = Adapter.create(Multi);
    sandbox.CariHubMultiPerfil = undefined;
    vm.runInContext(CONFIG_SRC, sandbox, { filename: 'carihub-blk01-config.js' });
    vm.runInContext(RESOLVER_SRC, sandbox, { filename: 'carihub-profile-resolver.js' });
    const Resolver = sandbox.CariHubProfileResolver;
    const uid = 'uid_inject_only';
    const hub = {
      uid,
      perfilesDetalle: { perfil_x: { perfilId: 'perfil_x', nombre: 'Injected' } },
      perfilesVinculados: [{ perfilId: 'perfil_x' }],
      perfilActivoId: 'perfil_x'
    };
    const result = await Resolver.resolveProfile('perfil_x', {
      configOverride: { blk01DualReadFallback: true },
      hintUsuarioId: uid,
      hubAdapter: injected,
      firestore: {
        getPerfilDoc: () => Promise.resolve({ exists: false, data: null }),
        getUsuarioDoc: (id) => id === uid
          ? Promise.resolve({ exists: true, data: hub })
          : Promise.resolve({ exists: false, data: null })
      }
    });
    assert.equal(result.found, true);
    assert.equal(result.profile.nombre, 'Injected');
    assert.equal(result.wrote, false);
  });

  test('opaque multi-profile ID not collapsed to uid via adapter', () => {
    const sandbox = createSandbox();
    const { Multi, Adapter } = loadModules(sandbox);
    const uid = 'uid_multi';
    const opaque = 'perfil_lxyzabc_aaa111';
    const hub = {
      uid,
      perfilesDetalle: {
        [opaque]: { perfilId: opaque, nombre: 'Opaque A' },
        perfil_lxyzabc_bbb222: { perfilId: 'perfil_lxyzabc_bbb222', nombre: 'Opaque B' }
      },
      perfilesVinculados: [{ perfilId: opaque }, { perfilId: 'perfil_lxyzabc_bbb222' }],
      perfilActivoId: opaque
    };
    const hit = Adapter.findProfileInHub(Multi, hub, opaque, uid);
    assert.ok(hit);
    assert.equal(hit.data.perfilId, opaque);
    assert.equal(hit.data.nombre, 'Opaque A');
    const miss = Adapter.findProfileInHub(Multi, hub, uid, uid);
    assert.equal(miss, null);
  });

  test('legacy uid bridge via adapter legacy flat hub', () => {
    const sandbox = createSandbox();
    const { Multi, Adapter } = loadModules(sandbox);
    const uid = 'firebaseUid28charsEx';
    const hub = {
      uid,
      perfilId: uid,
      nombre: 'Legacy Root',
      categoria: 'salud'
    };
    const hit = Adapter.findProfileInHub(Multi, hub, uid, uid);
    assert.ok(hit);
    assert.equal(hit.source, 'usuarios_legacy_flat');
    assert.equal(hit.data.nombre, 'Legacy Root');
  });

  test('LOAD_ORDER documents script sequence', () => {
    const sandbox = createSandbox();
    const { Adapter } = loadModules(sandbox, null, { multi: false, sanitize: false });
    assert.ok(Array.isArray(Adapter.LOAD_ORDER));
    assert.equal(Adapter.LOAD_ORDER[0], 'carihub-multi-perfil.js');
    assert.ok(Adapter.LOAD_ORDER.includes('carihub-profile-resolver.js'));
  });
});
