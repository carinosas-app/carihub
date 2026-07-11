/**
 * BLK-01 Phase 1C-b — emulator-only safety guard.
 * Hard-fails unless running against local Firestore Emulator + demo/test project.
 */

export const DEMO_PROJECT_ID = 'demo-carihub';

export const PRODUCTION_PROJECT_IDS = Object.freeze([
  'carihub-app',
  'carihub-prod',
  'carihub-production'
]);

const LOCAL_HOST_RE = /^(127\.0\.0\.1|localhost|\[::1\]):\d+$/i;

/**
 * @returns {{ host: string, projectId: string }}
 */
export function assertEmulatorEnvironment(opts) {
  opts = opts || {};
  const host = process.env.FIRESTORE_EMULATOR_HOST;
  const projectId =
    process.env.GCLOUD_PROJECT ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    (opts.allowFirebaseConfig ? parseFirebaseConfigProject() : null);

  const errors = [];

  if (!host) {
    errors.push('FIRESTORE_EMULATOR_HOST is not set. Emulator-only scripts must not run without it.');
  } else if (!LOCAL_HOST_RE.test(host)) {
    errors.push(`FIRESTORE_EMULATOR_HOST="${host}" is not local. Must be 127.0.0.1/localhost.`);
  }

  if (!projectId) {
    errors.push(
      'GCLOUD_PROJECT (or GOOGLE_CLOUD_PROJECT) must point to a demo/test project (expected demo-carihub).'
    );
  } else if (PRODUCTION_PROJECT_IDS.includes(projectId)) {
    errors.push(`Project "${projectId}" is a production project ID and is rejected.`);
  } else if (projectId !== DEMO_PROJECT_ID && !opts.allowAltTestProject) {
    errors.push(`GCLOUD_PROJECT must be exactly "${DEMO_PROJECT_ID}" (actual: "${projectId}").`);
  }

  if (errors.length) {
    const msg =
      '[BLK-01 emulator guard ABORT]\n' +
      errors.map((e) => '  - ' + e).join('\n') +
      '\n\nSet a safe environment before running:\n' +
      '  $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"\n' +
      `  $env:GCLOUD_PROJECT="${DEMO_PROJECT_ID}"\n`;
    throw new Error(msg);
  }

  return { host, projectId };
}

function parseFirebaseConfigProject() {
  try {
    const raw = process.env.FIREBASE_CONFIG;
    if (!raw) return null;
    const cfg = JSON.parse(raw);
    return cfg && cfg.projectId ? String(cfg.projectId) : null;
  } catch {
    return null;
  }
}

/**
 * Parse FIRESTORE_EMULATOR_HOST into host + port for firebase compat useEmulator.
 */
export function parseEmulatorHost() {
  const env = assertEmulatorEnvironment();
  const m = String(env.host).match(/^([^:]+):(\d+)$/);
  if (!m) throw new Error(`Invalid FIRESTORE_EMULATOR_HOST: ${env.host}`);
  return { host: m[1], port: Number(m[2]), projectId: env.projectId };
}
