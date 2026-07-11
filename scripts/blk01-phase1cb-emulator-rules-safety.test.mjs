/**
 * BLK-01 Phase 1C-b — static safety: emulator rules must never reach production.
 * Uso: node --test scripts/blk01-phase1cb-emulator-rules-safety.test.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertEmulatorEnvironment,
  PRODUCTION_PROJECT_IDS,
  DEMO_PROJECT_ID
} from './lib/blk01-emulator-guard.mjs';

const ROOT = process.cwd();
const FIREBASE_JSON = join(ROOT, 'firebase.json');
const PROD_RULES = join(ROOT, 'firestore.rules');
const EMULATOR_RULES = join(ROOT, 'scripts', 'blk01-phase1cb-emulator.rules');

function gitDiff(path) {
  try {
    return execSync(`git diff main -- "${path}"`, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

describe('BLK-01 Phase 1C-b — emulator rules isolation (static)', () => {
  test('emulator rules file is isolated under scripts/', () => {
    assert.ok(existsSync(EMULATOR_RULES), 'missing scripts/blk01-phase1cb-emulator.rules');
    assert.ok(!existsSync(join(ROOT, 'blk01-phase1cb-emulator.rules')));
    assert.ok(!existsSync(join(ROOT, 'firestore.rules.draft')));
    const src = readFileSync(EMULATOR_RULES, 'utf8');
    assert.match(src, /EMULATOR TEST ONLY/i);
    assert.match(src, /allow read: if true/);
  });

  test('firebase.json references only approved production rules', () => {
    const raw = readFileSync(FIREBASE_JSON, 'utf8');
    assert.ok(!raw.includes('blk01-phase1cb-emulator.rules'));
    const cfg = JSON.parse(raw);
    assert.equal(cfg.firestore.rules, 'firestore.rules');
    assert.equal(cfg.firestore.indexes, 'firestore.indexes.json');
    assert.ok(!cfg.emulators?.firestore?.rules?.includes?.('blk01-phase1cb'));
  });

  test('production firestore.rules has zero diff vs main', () => {
    const diff = gitDiff('firestore.rules');
    assert.equal(diff, '', 'firestore.rules must not be modified in Phase 1C-b');
    const prod = readFileSync(PROD_RULES, 'utf8');
    assert.ok(!prod.includes('blk01-phase1cb-emulator'));
  });

  test('firebase.json has zero diff vs main', () => {
    const diff = gitDiff('firebase.json');
    assert.equal(diff, '', 'firebase.json must not be modified in Phase 1C-b');
  });
});

describe('BLK-01 Phase 1C-b — emulator guard runtime contract', () => {
  test('hard-fails without FIRESTORE_EMULATOR_HOST', () => {
    const savedHost = process.env.FIRESTORE_EMULATOR_HOST;
    const savedProject = process.env.GCLOUD_PROJECT;
    delete process.env.FIRESTORE_EMULATOR_HOST;
    process.env.GCLOUD_PROJECT = DEMO_PROJECT_ID;
    try {
      assert.throws(() => assertEmulatorEnvironment(), /FIRESTORE_EMULATOR_HOST/);
    } finally {
      if (savedHost !== undefined) process.env.FIRESTORE_EMULATOR_HOST = savedHost;
      else delete process.env.FIRESTORE_EMULATOR_HOST;
      if (savedProject !== undefined) process.env.GCLOUD_PROJECT = savedProject;
      else delete process.env.GCLOUD_PROJECT;
    }
  });

  test('rejects every known production project identifier', () => {
    const savedHost = process.env.FIRESTORE_EMULATOR_HOST;
    const savedProject = process.env.GCLOUD_PROJECT;
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    for (const prodId of PRODUCTION_PROJECT_IDS) {
      process.env.GCLOUD_PROJECT = prodId;
      assert.throws(() => assertEmulatorEnvironment(), /production project/i, `must reject ${prodId}`);
    }
    if (savedHost !== undefined) process.env.FIRESTORE_EMULATOR_HOST = savedHost;
    else delete process.env.FIRESTORE_EMULATOR_HOST;
    if (savedProject !== undefined) process.env.GCLOUD_PROJECT = savedProject;
    else delete process.env.GCLOUD_PROJECT;
  });

  test('requires localhost emulator host', () => {
    const savedHost = process.env.FIRESTORE_EMULATOR_HOST;
    const savedProject = process.env.GCLOUD_PROJECT;
    process.env.FIRESTORE_EMULATOR_HOST = 'firestore.googleapis.com:443';
    process.env.GCLOUD_PROJECT = DEMO_PROJECT_ID;
    try {
      assert.throws(() => assertEmulatorEnvironment(), /not local/i);
    } finally {
      if (savedHost !== undefined) process.env.FIRESTORE_EMULATOR_HOST = savedHost;
      else delete process.env.FIRESTORE_EMULATOR_HOST;
      if (savedProject !== undefined) process.env.GCLOUD_PROJECT = savedProject;
      else delete process.env.GCLOUD_PROJECT;
    }
  });

  test('accepts demo-carihub with local emulator host only', () => {
    const savedHost = process.env.FIRESTORE_EMULATOR_HOST;
    const savedProject = process.env.GCLOUD_PROJECT;
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    process.env.GCLOUD_PROJECT = DEMO_PROJECT_ID;
    try {
      const env = assertEmulatorEnvironment();
      assert.equal(env.projectId, DEMO_PROJECT_ID);
      assert.equal(env.host, '127.0.0.1:8080');
    } finally {
      if (savedHost !== undefined) process.env.FIRESTORE_EMULATOR_HOST = savedHost;
      else delete process.env.FIRESTORE_EMULATOR_HOST;
      if (savedProject !== undefined) process.env.GCLOUD_PROJECT = savedProject;
      else delete process.env.GCLOUD_PROJECT;
    }
  });
});
