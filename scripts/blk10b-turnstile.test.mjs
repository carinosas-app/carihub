/**
 * BLK-10b — Turnstile scaffold tests (client + server, default OFF).
 * Uso: node --test scripts/blk10b-turnstile.test.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const PUBLIC = join(process.cwd(), 'public');
const FUNCTIONS = join(process.cwd(), 'functions');
const TURNSTILE_SRC = readFileSync(join(PUBLIC, 'js/carihub-turnstile.js'), 'utf8');
const INDEX_SRC = readFileSync(join(PUBLIC, 'index.html'), 'utf8');
const REGISTRO_SRC = readFileSync(join(PUBLIC, 'registro-perfil.html'), 'utf8');
const SUBMIT_SRC = readFileSync(join(PUBLIC, 'js/registro-perfil-submit.js'), 'utf8');
const FUNCTIONS_INDEX = readFileSync(join(FUNCTIONS, 'index.js'), 'utf8');
const {
  getServerConfig,
  verifyWithCloudflare,
  SUPPORTED_ACTIONS,
} = require('../functions/turnstile/server-config.js');

function createSandbox(extra) {
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    location: { search: '' },
    document: {
      head: { appendChild() {} },
      documentElement: {},
      querySelector() {
        return null;
      },
      createElement(tag) {
        return { tagName: tag, async: false, defer: false, onload: null, onerror: null };
      }
    },
    firebase: null,
    CariHubTurnstileConfig: undefined,
    CariHubTurnstile: undefined,
    turnstile: undefined,
    __CARIHUB_TURNSTILE_SCRIPT_LOADING__: undefined
  };
  Object.assign(sandbox, extra);
  vm.createContext(sandbox);
  return sandbox;
}

function loadTurnstile(sandbox) {
  vm.runInContext(TURNSTILE_SRC, sandbox, { filename: 'carihub-turnstile.js' });
  return sandbox.CariHubTurnstile;
}

describe('BLK-10b client config', () => {
  beforeEach(() => {
    delete process.env.CARIHUB_TURNSTILE_ENABLED;
    delete process.env.CARIHUB_TURNSTILE_ENFORCE;
  });

  test('defaults: enabled false, mode off, all surfaces false', () => {
    const sandbox = createSandbox();
    const mod = loadTurnstile(sandbox);
    const cfg = mod.resolveConfig();
    assert.equal(cfg.enabled, false);
    assert.equal(cfg.mode, 'off');
    assert.equal(cfg.siteKey, null);
    assert.equal(cfg.surfaces.login, false);
    assert.equal(cfg.surfaces.registration, false);
    assert.equal(cfg.surfaces.passwordReset, false);
  });

  test('gateAction fail-open when disabled', async () => {
    const sandbox = createSandbox();
    const mod = loadTurnstile(sandbox);
    for (const action of ['login', 'registration', 'passwordReset']) {
      const result = await mod.gateAction(action);
      assert.equal(result.ok, true);
      assert.equal(result.skipped, true);
      assert.equal(result.enforced, false);
      assert.equal(result.reason, 'disabled');
    }
  });

  test('enforce config without siteKey still fail-open on widget', async () => {
    const sandbox = createSandbox();
    sandbox.CariHubTurnstileConfig = {
      enabled: true,
      mode: 'enforce',
      siteKey: null,
      surfaces: { login: true, registration: true, passwordReset: true }
    };
    const mod = loadTurnstile(sandbox);
    const result = await mod.gateAction('login');
    assert.equal(result.ok, true);
    assert.equal(result.skipped, true);
  });

  test('verifyServerSide fail-open without callable', async () => {
    const sandbox = createSandbox();
    const mod = loadTurnstile(sandbox);
    const result = await mod.verifyServerSide('login', 'fake-token');
    assert.equal(result.ok, true);
    assert.equal(result.skipped, true);
    assert.equal(result.reason, 'callable_unavailable');
  });

  test('no secret material in public turnstile module', () => {
    assert.doesNotMatch(TURNSTILE_SRC, /TURNSTILE_SECRET/i);
    assert.doesNotMatch(TURNSTILE_SRC, /0x[0-9A-Fa-f]{20,}/);
    assert.doesNotMatch(TURNSTILE_SRC, /secret[_-]?key\s*[:=]\s*['"][^'"]+['"]/i);
  });
});

describe('BLK-10b server config', () => {
  beforeEach(() => {
    delete process.env.CARIHUB_TURNSTILE_ENABLED;
    delete process.env.CARIHUB_TURNSTILE_ENFORCE;
  });

  test('server defaults disabled / not enforcing', () => {
    const cfg = getServerConfig(undefined);
    assert.equal(cfg.enabled, false);
    assert.equal(cfg.enforce, false);
    assert.equal(cfg.secretPresent, false);
  });

  test('secretPresent true only when value provided', () => {
    assert.equal(getServerConfig('').secretPresent, false);
    assert.equal(getServerConfig('  ').secretPresent, false);
    assert.equal(getServerConfig('test-secret').secretPresent, true);
  });

  test('verifyWithCloudflare posts to Cloudflare and validates action', async () => {
    let capturedBody = '';
    const fetchImpl = async (_url, opts) => {
      capturedBody = opts.body;
      return {
        ok: true,
        json: async () => ({ success: true, action: 'login' })
      };
    };
    const result = await verifyWithCloudflare('sec', 'tok', 'login', '1.2.3.4', fetchImpl);
    assert.equal(result.success, true);
    assert.match(capturedBody, /secret=sec/);
    assert.match(capturedBody, /response=tok/);
    assert.match(capturedBody, /remoteip=1\.2\.3\.4/);
  });

  test('verifyWithCloudflare rejects action mismatch', async () => {
    const fetchImpl = async () => ({
      ok: true,
      json: async () => ({ success: true, action: 'registration' })
    });
    const result = await verifyWithCloudflare('sec', 'tok', 'login', undefined, fetchImpl);
    assert.equal(result.success, false);
    assert.deepEqual(result.errorCodes, ['action_mismatch']);
  });

  test('supported actions include auth surfaces only', () => {
    assert.deepEqual([...SUPPORTED_ACTIONS].sort(), ['login', 'passwordReset', 'registration'].sort());
  });
});

describe('BLK-10b static integration', () => {
  test('functions index exports verifyTurnstile callable', () => {
    assert.match(FUNCTIONS_INDEX, /exports\.verifyTurnstile/);
    assert.match(FUNCTIONS_INDEX, /createVerifyTurnstileCallable/);
    assert.doesNotMatch(FUNCTIONS_INDEX, /TURNSTILE_SECRET_KEY\s*=\s*['"]/);
  });

  test('auth pages load turnstile before core', () => {
    for (const [name, src] of [
      ['index.html', INDEX_SRC],
      ['registro-perfil.html', REGISTRO_SRC]
    ]) {
      const turnstileIdx = src.indexOf('carihub-turnstile.js');
      const coreIdx = src.indexOf('carihub-core.js');
      assert.ok(turnstileIdx >= 0, `${name} missing carihub-turnstile.js`);
      assert.ok(coreIdx >= 0, `${name} missing carihub-core.js`);
      assert.ok(turnstileIdx < coreIdx, `${name} turnstile must load before core`);
    }
  });

  test('auth pages include widget slots per surface', () => {
    assert.match(INDEX_SRC, /data-turnstile-action="login"/);
    assert.match(INDEX_SRC, /data-turnstile-action="passwordReset"/);
    assert.match(INDEX_SRC, /data-turnstile-action="registration"/);
    assert.match(REGISTRO_SRC, /data-turnstile-action="registration"/);
  });

  test('auth flows call gateAction hooks', () => {
    assert.match(INDEX_SRC, /CariHubTurnstile\.gateAction\("login"\)/);
    assert.match(INDEX_SRC, /CariHubTurnstile\.gateAction\("registration"\)/);
    assert.match(INDEX_SRC, /CariHubTurnstile\.gateAction\("passwordReset"\)/);
    assert.match(SUBMIT_SRC, /turnstileGateRegistration/);
    assert.match(SUBMIT_SRC, /CariHubTurnstile\.gateAction\('registration'\)/);
  });

  test('auth pages load firebase-functions-compat for callable scaffold', () => {
    assert.match(INDEX_SRC, /firebase-functions-compat\.js/);
    assert.match(REGISTRO_SRC, /firebase-functions-compat\.js/);
  });

  test('no BLK-01/05/04 artifacts introduced', () => {
    const touched = [TURNSTILE_SRC, INDEX_SRC, REGISTRO_SRC, SUBMIT_SRC, FUNCTIONS_INDEX].join('\n');
    assert.doesNotMatch(touched, /perfilId\s*bridge/i);
    assert.doesNotMatch(touched, /BLK-01/);
    assert.doesNotMatch(touched, /BLK-04/);
    assert.doesNotMatch(touched, /BLK-05/);
    assert.doesNotMatch(touched, /firestore\.rules/);
  });
});
