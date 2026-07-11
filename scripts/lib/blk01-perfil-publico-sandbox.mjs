/**
 * Shared VM sandbox helpers for BLK-01 Public Profile tests.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const PUBLIC_JS = join(ROOT, 'public', 'js');

const SRC = {
  multi: readFileSync(join(PUBLIC_JS, 'carihub-multi-perfil.js'), 'utf8'),
  sanitize: readFileSync(join(PUBLIC_JS, 'carihub-blk01-profile-sanitize.js'), 'utf8'),
  adapter: readFileSync(join(PUBLIC_JS, 'carihub-blk01-hub-adapter.js'), 'utf8'),
  config: readFileSync(join(PUBLIC_JS, 'carihub-blk01-config.js'), 'utf8'),
  resolver: readFileSync(join(PUBLIC_JS, 'carihub-profile-resolver.js'), 'utf8'),
  ownerHint: readFileSync(join(PUBLIC_JS, 'carihub-blk01-owner-hint-provider.js'), 'utf8'),
  privacy: readFileSync(join(PUBLIC_JS, 'carihub-public-privacy-guard.js'), 'utf8'),
  resultados: readFileSync(join(PUBLIC_JS, 'resultados-registrados.js'), 'utf8'),
  init: readFileSync(join(PUBLIC_JS, 'perfil-publico-init.js'), 'utf8')
};

export function createSessionStorageMock(initial) {
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

export function createSandbox(extra) {
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
      data: function () {
        return data;
      }
    };
  }

  function makeCollection(name) {
    return {
      doc: function (id) {
        return {
          get: function () {
            if (name === 'perfiles') reads.perfiles += 1;
            if (name === 'usuarios') reads.usuarios += 1;
            const data = store[name][id] || null;
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
    URL,
    URLSearchParams,
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
    __CARIHUB_FLAGS__: undefined,
    __reads: reads,
    __store: store
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  Object.assign(sandbox, extra);
  vm.createContext(sandbox);
  return sandbox;
}

export function loadOwnerHintProvider(sandbox) {
  vm.runInContext(SRC.ownerHint, sandbox, { filename: 'carihub-blk01-owner-hint-provider.js' });
}

export function loadBlk01Stack(sandbox, flags) {
  vm.runInContext(SRC.multi, sandbox, { filename: 'carihub-multi-perfil.js' });
  vm.runInContext(SRC.sanitize, sandbox, { filename: 'carihub-blk01-profile-sanitize.js' });
  vm.runInContext(SRC.adapter, sandbox, { filename: 'carihub-blk01-hub-adapter.js' });
  vm.runInContext(SRC.config, sandbox, { filename: 'carihub-blk01-config.js' });
  vm.runInContext(SRC.resolver, sandbox, { filename: 'carihub-profile-resolver.js' });
  loadOwnerHintProvider(sandbox);
  if (flags) sandbox.__CARIHUB_FLAGS__ = flags;
}

export function loadResultadosAndInit(sandbox) {
  vm.runInContext(SRC.privacy, sandbox, { filename: 'carihub-public-privacy-guard.js' });
  vm.runInContext(SRC.resultados, sandbox, { filename: 'resultados-registrados.js' });
  vm.runInContext(SRC.init, sandbox, { filename: 'perfil-publico-init.js' });
}

export function trackLegacyReads(sandbox) {
  const fs = sandbox.firebase.firestore();
  const origCollection = fs.collection.bind(fs);
  sandbox.firebase.firestore = function () {
    return {
      collection: function (name) {
        const col = origCollection(name);
        if (name !== 'usuarios') return col;
        return {
          doc: function (id) {
            return {
              get: function () {
                sandbox.__reads.legacyUsuarios += 1;
                const data = sandbox.__store.usuarios[id] || null;
                return Promise.resolve({
                  id,
                  exists: !!data,
                  data: function () {
                    return data;
                  }
                });
              }
            };
          }
        };
      }
    };
  };
}

export function seedStore(sandbox, fixtures) {
  Object.assign(sandbox.__store.perfiles, fixtures.perfiles || {});
  Object.assign(sandbox.__store.usuarios, fixtures.usuarios || {});
}

export function readInitSource() {
  return SRC.init;
}

export function readResultadosSource() {
  return SRC.resultados;
}

export const FLAG_DUAL_READ = { blk01DualReadFallback: true };
export const FLAG_PERFILES_PRIMARY = {
  blk01DualReadFallback: false,
  blk01PerfilesReadPrimary: true
};
