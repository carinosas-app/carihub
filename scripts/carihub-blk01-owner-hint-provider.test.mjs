/**
 * BLK-01 Phase 1C-c — OwnerHintProvider unit tests.
 * Uso: node --test scripts/carihub-blk01-owner-hint-provider.test.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { createSessionStorageMock } from './lib/blk01-perfil-publico-sandbox.mjs';

const ROOT = process.cwd();
const PROVIDER_SRC = readFileSync(
  join(ROOT, 'public', 'js', 'carihub-blk01-owner-hint-provider.js'),
  'utf8'
);

function loadProvider(sessionStorage, dateNow) {
  const sandbox = {
    console,
    Date,
    Object,
    Array,
    String,
    RegExp,
    sessionStorage,
    globalThis: null,
    window: null
  };
  if (typeof dateNow === 'number') {
    const realDateNow = Date.now;
    Date.now = () => dateNow;
    sandbox.__restoreDateNow = () => {
      Date.now = realDateNow;
    };
  }
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(PROVIDER_SRC, sandbox, { filename: 'carihub-blk01-owner-hint-provider.js' });
  return sandbox;
}

function readStored(sessionStorage) {
  const raw = sessionStorage.getItem('carihub_blk01_owner_hint_v1');
  return raw ? JSON.parse(raw) : null;
}

describe('CariHubOwnerHintProvider — constants', () => {
  test('exports frozen constants', () => {
    const ss = createSessionStorageMock();
    const sb = loadProvider(ss);
    const P = sb.CariHubOwnerHintProvider;
    assert.equal(P.STORAGE_KEY, 'carihub_blk01_owner_hint_v1');
    assert.equal(P.VERSION, 1);
    assert.equal(P.TTL_MS, 1800000);
    assert.equal(P.MAX_ENTRIES, 20);
  });
});

describe('CariHubOwnerHintProvider — write/read', () => {
  test('valid write/read roundtrip', () => {
    const ss = createSessionStorageMock();
    const sb = loadProvider(ss, 1_000_000);
    const P = sb.CariHubOwnerHintProvider;
    assert.equal(P.setOwnerHint('perfil_labc_def01', 'uid_owner_valid1'), true);
    assert.equal(P.getOwnerHint('perfil_labc_def01'), 'uid_owner_valid1');
    assert.equal(P.deriveOwnerHint('perfil_labc_def01'), 'uid_owner_valid1');
    const stored = readStored(ss);
    assert.equal(stored.version, 1);
    assert.equal(stored.entries['perfil_labc_def01'].usuarioId, 'uid_owner_valid1');
    assert.equal(stored.entries['perfil_labc_def01'].expiresAt, 1_000_000 + 1_800_000);
  });

  test('explicitHint takes precedence over cache', () => {
    const ss = createSessionStorageMock();
    const sb = loadProvider(ss, 1_000_000);
    const P = sb.CariHubOwnerHintProvider;
    P.setOwnerHint('perfil_labc_def01', 'uid_cached_one');
    assert.equal(P.deriveOwnerHint('perfil_labc_def01', { explicitHint: 'uid_explicit_x' }), 'uid_explicit_x');
  });

  test('no sensitive fields stored', () => {
    const ss = createSessionStorageMock();
    const sb = loadProvider(ss, 1_000_000);
    const P = sb.CariHubOwnerHintProvider;
    P.setOwnerHint('perfil_labc_def01', 'uid_owner_valid1');
    const raw = ss.getItem(P.STORAGE_KEY);
    assert.ok(!/nombre|email|telefono|kyc|fiscal|token|secret|foto/i.test(raw));
    const parsed = JSON.parse(raw);
    const row = parsed.entries['perfil_labc_def01'];
    assert.deepEqual(Object.keys(row).sort(), ['expiresAt', 'storedAt', 'usuarioId']);
  });
});

describe('CariHubOwnerHintProvider — validation', () => {
  test('rejects malformed perfilId', () => {
    const ss = createSessionStorageMock();
    const P = loadProvider(ss).CariHubOwnerHintProvider;
    assert.equal(P.getOwnerHint(''), null);
    assert.equal(P.setOwnerHint('', 'uid_x'), false);
    assert.equal(P.setOwnerHint('  ', 'uid_x'), false);
  });

  test('rejects opaque-shaped usuarioId', () => {
    const ss = createSessionStorageMock();
    const P = loadProvider(ss).CariHubOwnerHintProvider;
    assert.equal(P.setOwnerHint('perfil_labc_def01', 'perfil_lxyzabc_aaa111'), false);
    assert.equal(P.deriveOwnerHint('perfil_labc_def01', { explicitHint: 'perfil_lxyzabc_aaa111' }), null);
  });

  test('rejects malformed usuarioId', () => {
    const ss = createSessionStorageMock();
    const P = loadProvider(ss).CariHubOwnerHintProvider;
    assert.equal(P.setOwnerHint('perfil_labc_def01', ''), false);
    assert.equal(P.setOwnerHint('perfil_labc_def01', '   '), false);
    assert.equal(P.setOwnerHint('perfil_labc_def01', '<script>'), false);
  });
});

describe('CariHubOwnerHintProvider — TTL expiration', () => {
  test('expired cache entry treated as miss', () => {
    const ss = createSessionStorageMock();
    const sb = loadProvider(ss, 5_000_000);
    const P = sb.CariHubOwnerHintProvider;
    P.setOwnerHint('perfil_labc_def01', 'uid_owner_valid1');
    sb.__restoreDateNow();
    const sb2 = loadProvider(ss, 5_000_000 + P.TTL_MS + 1);
    assert.equal(sb2.CariHubOwnerHintProvider.getOwnerHint('perfil_labc_def01'), null);
  });
});

describe('CariHubOwnerHintProvider — schema/version/corruption', () => {
  test('wrong schema version clears namespace', () => {
    const ss = createSessionStorageMock({
      carihub_blk01_owner_hint_v1: JSON.stringify({ version: 99, entries: {} })
    });
    const P = loadProvider(ss).CariHubOwnerHintProvider;
    assert.equal(P.getOwnerHint('perfil_labc_def01'), null);
    assert.equal(ss.getItem(P.STORAGE_KEY), null);
  });

  test('corrupted JSON clears safely', () => {
    const ss = createSessionStorageMock({ carihub_blk01_owner_hint_v1: '{not-json' });
    const P = loadProvider(ss).CariHubOwnerHintProvider;
    assert.equal(P.getOwnerHint('perfil_labc_def01'), null);
    assert.doesNotThrow(() => P.setOwnerHint('perfil_labc_def01', 'uid_owner_valid1'));
  });

  test('malicious JSON with prototype pollution keys ignored on read', () => {
    const ss = createSessionStorageMock({
      carihub_blk01_owner_hint_v1: JSON.stringify({
        version: 1,
        entries: {
          __proto__: { usuarioId: 'evil', expiresAt: 9_999_999_999, storedAt: 1 },
          'perfil_labc_def01': { usuarioId: 'uid_ok', storedAt: 1, expiresAt: 9_999_999_999 }
        }
      })
    });
    const P = loadProvider(ss, 1_000_000).CariHubOwnerHintProvider;
    assert.equal(P.getOwnerHint('perfil_labc_def01'), 'uid_ok');
    assert.equal(P.deriveOwnerHint('__proto__'), null);
  });
});

describe('CariHubOwnerHintProvider — storage failures', () => {
  test('unavailable sessionStorage never throws', () => {
    const sb = loadProvider(null);
    const P = sb.CariHubOwnerHintProvider;
    assert.doesNotThrow(() => {
      assert.equal(P.getOwnerHint('perfil_labc_def01'), null);
      assert.equal(P.setOwnerHint('perfil_labc_def01', 'uid_owner_valid1'), false);
      assert.equal(P.clearAll(), false);
    });
  });

  test('quota/write exception handled', () => {
    const ss = {
      _v: null,
      getItem() {
        return this._v;
      },
      setItem(_k, v) {
        throw new Error('QuotaExceededError');
      },
      removeItem() {
        this._v = null;
      }
    };
    const P = loadProvider(ss).CariHubOwnerHintProvider;
    assert.equal(P.setOwnerHint('perfil_labc_def01', 'uid_owner_valid1'), false);
    assert.equal(P.getOwnerHint('perfil_labc_def01'), null);
  });
});

describe('CariHubOwnerHintProvider — LRU eviction', () => {
  test('deterministic eviction by oldest storedAt at 20 entries', () => {
    const ss = createSessionStorageMock();
    let t = 1_000_000;
    const sb = loadProvider(ss, t);
    const P = sb.CariHubOwnerHintProvider;
    for (let i = 0; i < 21; i++) {
      sb.__restoreDateNow?.();
      const sbN = loadProvider(ss, t + i * 1000);
      sbN.CariHubOwnerHintProvider.setOwnerHint(`perfil_lru_${String(i).padStart(2, '0')}`, `uid_lru_${i}`);
    }
    const stored = readStored(ss);
    assert.equal(Object.keys(stored.entries).length, 20);
    assert.equal(stored.entries.perfil_lru_00, undefined);
    assert.ok(stored.entries.perfil_lru_20);
  });
});

describe('CariHubOwnerHintProvider — clear', () => {
  test('clearOwnerHint removes one mapping', () => {
    const ss = createSessionStorageMock();
    const P = loadProvider(ss, 1_000_000).CariHubOwnerHintProvider;
    P.setOwnerHint('perfil_a', 'uid_a');
    P.setOwnerHint('perfil_b', 'uid_b');
    assert.equal(P.clearOwnerHint('perfil_a'), true);
    assert.equal(P.getOwnerHint('perfil_a'), null);
    assert.equal(P.getOwnerHint('perfil_b'), 'uid_b');
  });

  test('clearAll removes namespace', () => {
    const ss = createSessionStorageMock();
    const P = loadProvider(ss, 1_000_000).CariHubOwnerHintProvider;
    P.setOwnerHint('perfil_a', 'uid_a');
    assert.equal(P.clearAll(), true);
    assert.equal(ss.getItem(P.STORAGE_KEY), null);
  });
});
