#!/usr/bin/env node
/**
 * Ping Storage Emulator env after firebase emulators:exec --only storage.
 */
const host = process.env.FIREBASE_STORAGE_EMULATOR_HOST || '';
if (!host) {
  console.error('[e2e-storage-ping] ABORT: FIREBASE_STORAGE_EMULATOR_HOST missing');
  process.exit(1);
}
if (!/127\.0\.0\.1|localhost/i.test(host)) {
  console.error('[e2e-storage-ping] ABORT: non-local host', host);
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, storage: host }, null, 2));
