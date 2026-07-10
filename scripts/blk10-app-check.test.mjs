/**
 * BLK-10a — App Check monitor-safe bootstrap tests.
 * Uso: node --test scripts/blk10-app-check.test.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const PUBLIC = join(process.cwd(), 'public');
const APP_CHECK_SRC = readFileSync(join(PUBLIC, 'js/carihub-app-check.js'), 'utf8');
const CORE_SRC = readFileSync(join(PUBLIC, 'js/carihub-core.js'), 'utf8');

function createSandbox(extra) {
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    location: { search: '' },
    firebase: null,
    CariHubAppCheckConfig: undefined,
    CariHubCore: undefined,
    CariHubAppCheck: undefined,
    CariHubDB: undefined,
    CariHubAuth: undefined,
    CariHubStorage: undefined,
    __CARIHUB_APP_CHECK_ACTIVATED__: undefined,
    document: {
      readyState: 'complete',
      body: { appendChild() {} },
      documentElement: {},
      getElementById() {
        return null;
      },
      addEventListener() {}
    }
  };
  Object.assign(sandbox, extra);
  vm.createContext(sandbox);
  return sandbox;
}

function loadAppCheck(sandbox) {
  vm.runInContext(APP_CHECK_SRC, sandbox, { filename: 'carihub-app-check.js' });
  return sandbox.CariHubAppCheck;
}

function loadCoreWithFirebase(sandbox) {
  sandbox.firebase = {
    apps: [],
    initializeApp(config) {
      this._config = config;
      this.apps.push({});
      return this.apps[0];
    },
    app() {
      return { name: '[DEFAULT]' };
    },
    firestore() {
      return { kind: 'firestore' };
    },
    auth() {
      return {
        onAuthStateChanged(cb) {
          cb(null);
          return function () {};
        }
      };
    },
    storage() {
      return { kind: 'storage' };
    }
  };
  vm.runInContext(APP_CHECK_SRC, sandbox, { filename: 'carihub-app-check.js' });
  vm.runInContext(CORE_SRC, sandbox, { filename: 'carihub-core.js' });
  return sandbox.CariHubCore;
}

describe('BLK-10a App Check config', () => {
  let sandbox;
  let AppCheck;

  beforeEach(() => {
    sandbox = createSandbox();
    AppCheck = loadAppCheck(sandbox);
    AppCheck.resetForTests();
  });

  test('defaults: enabled=false, mode=off', () => {
    const cfg = AppCheck.resolveConfig();
    assert.equal(cfg.enabled, false);
    assert.equal(cfg.mode, 'off');
    assert.equal(cfg.siteKey, null);
  });

  test('enabled without mode stays off', () => {
    const cfg = AppCheck.resolveConfig({ enabled: true, mode: 'off' });
    assert.equal(cfg.enabled, false);
    assert.equal(cfg.mode, 'off');
  });

  test('invalid mode falls back to off', () => {
    const cfg = AppCheck.resolveConfig({ enabled: true, mode: 'invalid' });
    assert.equal(cfg.mode, 'off');
    assert.equal(cfg.enabled, false);
  });

  test('monitor mode requires enabled=true', () => {
    const cfg = AppCheck.resolveConfig({ enabled: true, mode: 'monitor' });
    assert.equal(cfg.enabled, true);
    assert.equal(cfg.mode, 'monitor');
  });

  test('enforce mode is structurally supported', () => {
    const cfg = AppCheck.resolveConfig({ enabled: true, mode: 'enforce' });
    assert.equal(cfg.mode, 'enforce');
  });
});

describe('BLK-10a App Check init (fail-open)', () => {
  let sandbox;
  let AppCheck;

  beforeEach(() => {
    sandbox = createSandbox();
    AppCheck = loadAppCheck(sandbox);
    AppCheck.resetForTests();
  });

  test('off mode is no-op', () => {
    const state = AppCheck.initAppCheck(null, null);
    assert.equal(state.status, 'off');
    assert.equal(state.activated, false);
  });

  test('missing SDK does not throw', () => {
    const firebase = { appCheck: undefined };
    const state = AppCheck.initAppCheck(firebase, { name: 'app' }, { enabled: true, mode: 'monitor', siteKey: 'test-key' });
    assert.equal(state.status, 'skipped');
    assert.equal(state.error, 'app_check_sdk_missing');
    assert.equal(state.activated, false);
  });

  test('missing siteKey does not throw', () => {
    const firebase = {
      appCheck(app) {
        return { activate() {}, getToken() { return Promise.resolve({ token: 'x' }); } };
      },
      appCheck: Object.assign(function () {}, { ReCaptchaV3Provider: function (key) { this.key = key; } })
    };
    const state = AppCheck.initAppCheck(firebase, { name: 'app' }, { enabled: true, mode: 'monitor' });
    assert.equal(state.status, 'skipped');
    assert.equal(state.error, 'site_key_missing');
  });

  test('duplicate activation is prevented', () => {
    const activateCalls = [];
    const firebase = {
      appCheck(app) {
        return {
          activate(provider, refresh) {
            activateCalls.push({ provider, refresh });
          },
          getToken() {
            return Promise.resolve({ token: 'token' });
          }
        };
      }
    };
    firebase.appCheck.ReCaptchaV3Provider = function (key) {
      this.key = key;
    };

    const cfg = { enabled: true, mode: 'monitor', siteKey: 'public-site-key', debug: false };
    const first = AppCheck.initAppCheck(firebase, { name: 'app' }, cfg);
    const second = AppCheck.initAppCheck(firebase, { name: 'app' }, cfg);

    assert.equal(first.status, 'active-monitor');
    assert.equal(first.activated, true);
    assert.equal(second.status, 'already_active');
    assert.equal(activateCalls.length, 1);
  });
});

describe('BLK-10a core integration', () => {
  test('default path: core ready with appCheck off', () => {
    const sandbox = createSandbox();
    const core = loadCoreWithFirebase(sandbox);
    assert.equal(core.ready, true);
    assert.equal(core.initError, null);
    assert.ok(core.db);
    assert.ok(core.auth);
    assert.equal(core.appCheck.status, 'off');
    assert.equal(core.appCheck.activated, false);
  });

  test('missing app-check module does not break core', () => {
    const sandbox = createSandbox();
    sandbox.firebase = {
      apps: [],
      initializeApp() {
        this.apps.push({});
      },
      app() {
        return {};
      },
      firestore() {
        return {};
      },
      auth() {
        return { onAuthStateChanged() { return function () {}; } };
      },
      storage() {
        return {};
      }
    };
    vm.runInContext(CORE_SRC, sandbox, { filename: 'carihub-core.js' });
    assert.equal(sandbox.CariHubCore.ready, true);
    assert.equal(sandbox.CariHubCore.appCheck.status, 'off');
  });

  test('duplicate initFirebase returns same ready state', () => {
    const sandbox = createSandbox();
    const core = loadCoreWithFirebase(sandbox);
    const again = core.initFirebase();
    assert.equal(again.ready, true);
    assert.equal(core.appCheck.status, 'off');
  });
});

describe('BLK-10a static guards', () => {
  test('HTML pages do not load firebase-app-check-compat by default', () => {
    const pages = [
      'index.html',
      'registro-perfil.html',
      'resultados.html',
      'perfil-publico.html',
      'admin.html',
      'dashboard-rentero.html'
    ];
    for (const page of pages) {
      const src = readFileSync(join(PUBLIC, page), 'utf8');
      assert.doesNotMatch(src, /firebase-app-check-compat/, `${page} must not load App Check SDK yet`);
    }
  });

  test('no secret keys embedded in app-check module', () => {
    assert.doesNotMatch(APP_CHECK_SRC, /AIza[0-9A-Za-z_-]{10,}/);
    assert.doesNotMatch(APP_CHECK_SRC, /private[_-]?key/i);
    assert.doesNotMatch(APP_CHECK_SRC, /secret[_-]?key/i);
  });

  test('critical HTML pages load app-check before core', () => {
    const pages = [
      'index.html',
      'registro-perfil.html',
      'resultados.html',
      'perfil-publico.html',
      'admin.html',
      'dashboard-rentero.html'
    ];
    for (const page of pages) {
      const src = readFileSync(join(PUBLIC, page), 'utf8');
      const appCheckIdx = src.indexOf('carihub-app-check.js');
      const coreIdx = src.indexOf('carihub-core.js');
      assert.ok(appCheckIdx >= 0, `${page} missing carihub-app-check.js`);
      assert.ok(coreIdx >= 0, `${page} missing carihub-core.js`);
      assert.ok(appCheckIdx < coreIdx, `${page} app-check must load before core`);
    }
  });
});
