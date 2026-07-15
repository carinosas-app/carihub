import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../../policy/permissions.js';
import { getCamcpRoot } from '../../config/load-config.js';

export type ConfigCheckSeverity = 'pass' | 'fail' | 'warn';

export interface ConfigValidationCheck {
  id: string;
  ok: boolean;
  severity: ConfigCheckSeverity;
  message: string;
}

export interface ConfigValidationResult {
  ok: boolean;
  configPath: string;
  checks: ConfigValidationCheck[];
  summary: {
    pass: number;
    fail: number;
    warn: number;
  };
}

const REQUIRED_KEYS: Array<keyof CamcpConfig> = [
  'version',
  'mode',
  'repoRootEnv',
  'reportsDir',
  'denyWritePaths',
  'gitAllowedSubcommands',
  'filesystemMaxReadBytes',
  'filesystemMaxSearchResults',
  'filesystemMaxTreeDepth',
  'filesystemMaxListEntries',
];

const REQUIRED_DENY_WRITE = [
  'public/',
  'firestore.rules',
  'firestore.indexes.json',
  'storage.rules',
  'firebase.json',
  '.firebaserc',
  'functions/',
];

const REQUIRED_GIT_SUBCOMMANDS = ['status', 'log', 'diff', 'branch', 'rev-parse', 'merge-base', 'show'];

function check(
  id: string,
  ok: boolean,
  message: string,
  severity: ConfigCheckSeverity = ok ? 'pass' : 'fail'
): ConfigValidationCheck {
  return { id, ok, severity: ok ? severity : 'fail', message };
}

export function validateCamcpConfig(config: CamcpConfig, repoRoot: string): ConfigValidationResult {
  const configPath = path.join(getCamcpRoot(), 'config', 'camcp.config.json');
  const checks: ConfigValidationCheck[] = [];

  checks.push(
    check('config.file.exists', fs.existsSync(configPath), `config file at ${configPath}`)
  );

  for (const key of REQUIRED_KEYS) {
    const present = config[key] !== undefined && config[key] !== null;
    checks.push(check(`config.key.${String(key)}`, present, present ? 'present' : `missing ${String(key)}`));
  }

  const modeOk = config.mode === 'read-only' || config.mode === 'report-only';
  checks.push(
    check(
      'config.mode',
      modeOk,
      modeOk ? `mode=${config.mode}` : `invalid mode=${String(config.mode)} (expected read-only|report-only)`
    )
  );

  const versionOk = typeof config.version === 'string' && config.version.trim().length > 0;
  checks.push(check('config.version', versionOk, versionOk ? `version=${config.version}` : 'empty version'));

  const reportsOk =
    typeof config.reportsDir === 'string' &&
    config.reportsDir.trim().length > 0 &&
    !path.isAbsolute(config.reportsDir) &&
    config.reportsDir.replace(/\\/g, '/').startsWith('agent-tools/');
  checks.push(
    check(
      'config.reportsDir',
      reportsOk,
      reportsOk
        ? `reportsDir=${config.reportsDir}`
        : `reportsDir must be relative under agent-tools/ (got ${String(config.reportsDir)})`
    )
  );

  const repoRootOk = typeof repoRoot === 'string' && repoRoot.trim().length > 0 && fs.existsSync(repoRoot);
  checks.push(
    check('config.repoRoot', repoRootOk, repoRootOk ? `repoRoot=${repoRoot}` : `repoRoot missing or not found: ${repoRoot}`)
  );

  const denyList = Array.isArray(config.denyWritePaths) ? config.denyWritePaths : [];
  checks.push(
    check('config.denyWritePaths.array', Array.isArray(config.denyWritePaths), `count=${denyList.length}`)
  );
  for (const required of REQUIRED_DENY_WRITE) {
    const has = denyList.some((p) => p.replace(/\\/g, '/') === required || p.replace(/\\/g, '/').endsWith(required));
    checks.push(check(`config.denyWritePaths.${required}`, has, has ? 'listed' : `missing required deny path ${required}`));
  }

  const gitList = Array.isArray(config.gitAllowedSubcommands) ? config.gitAllowedSubcommands : [];
  checks.push(
    check('config.gitAllowedSubcommands.array', Array.isArray(config.gitAllowedSubcommands), `count=${gitList.length}`)
  );
  for (const sub of REQUIRED_GIT_SUBCOMMANDS) {
    const has = gitList.includes(sub);
    checks.push(check(`config.gitAllowedSubcommands.${sub}`, has, has ? 'allowed' : `missing required subcommand ${sub}`));
  }

  const blockedMutators = ['push', 'commit', 'merge', 'rebase', 'reset', 'clean', 'checkout'];
  for (const bad of blockedMutators) {
    const blocked = !gitList.includes(bad);
    checks.push(
      check(
        `config.gitAllowedSubcommands.block.${bad}`,
        blocked,
        blocked ? `${bad} not allowlisted` : `${bad} must not be allowlisted`
      )
    );
  }

  const pass = checks.filter((c) => c.ok).length;
  const fail = checks.filter((c) => !c.ok).length;
  const warn = checks.filter((c) => c.severity === 'warn').length;

  return {
    ok: fail === 0,
    configPath,
    checks,
    summary: { pass, fail, warn },
  };
}
