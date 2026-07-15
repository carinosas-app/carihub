import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import type { CamcpConfig } from '../../policy/permissions.js';
import { allToolsNonDestructive, assertReadOnlyMode } from '../../policy/permissions.js';
import { assertToolDefinitionsValid, toolMetaFromDefinitions } from '../../registry/tool-definition.js';
import type { ToolDefinition } from '../../registry/tool-definition.js';
import { PathGuardError, assertReadPathAllowed } from '../../policy/path-guard.js';
import { CommandGuardError, getGitCommitShort, runGitAllowed } from '../../policy/command-guard.js';
import { getCamcpRoot } from '../../config/load-config.js';
import { validateCamcpConfig } from './validate-config.js';
import { buildToolCatalog } from './catalog.js';
import { getCamcpVersionInfo } from './version.js';

export type SelfCheckSeverity = 'pass' | 'fail' | 'warn';

export interface SelfCheckItem {
  id: string;
  ok: boolean;
  severity: SelfCheckSeverity;
  message: string;
}

export interface SelfCheckResult {
  ok: boolean;
  status: 'PASS' | 'FAIL';
  version: ReturnType<typeof getCamcpVersionInfo>;
  catalog: ReturnType<typeof buildToolCatalog>;
  configValidation: ReturnType<typeof validateCamcpConfig>;
  checks: SelfCheckItem[];
  summary: { pass: number; fail: number; warn: number; total: number };
}

function item(id: string, ok: boolean, message: string, severity: SelfCheckSeverity = ok ? 'pass' : 'fail'): SelfCheckItem {
  return { id, ok, severity: ok ? severity : 'fail', message };
}

export function runCamcpSelfCheck(
  repoRoot: string,
  config: CamcpConfig,
  tools: ToolDefinition[]
): SelfCheckResult {
  const checks: SelfCheckItem[] = [];

  // Registry integrity
  try {
    assertToolDefinitionsValid(tools);
    checks.push(item('registry.integrity', true, `${tools.length} tool definitions valid`));
  } catch (e) {
    checks.push(item('registry.integrity', false, e instanceof Error ? e.message : String(e)));
  }

  const meta = toolMetaFromDefinitions(tools);
  const names = new Set(tools.map((t) => t.name));
  checks.push(
    item(
      'registry.all_registered',
      tools.length > 0 && names.size === tools.length,
      `${names.size} unique tools registered`
    )
  );

  const capsOk = tools.every(
    (t) => t.capability === 'read-only' || t.capability === 'report-only' || t.capability === 'write-capable'
  );
  const nonDestructive = allToolsNonDestructive(meta);
  checks.push(item('capabilities.valid_enum', capsOk, `capabilities ok=${capsOk}`));
  checks.push(
    item(
      'capabilities.non_destructive',
      nonDestructive,
      nonDestructive
        ? `0 write-capable (${meta.filter((t) => t.capability === 'read-only').length} read-only, ${meta.filter((t) => t.capability === 'report-only').length} report-only)`
        : 'write-capable tool detected'
    )
  );

  // Config
  let modeOk = false;
  try {
    assertReadOnlyMode(config);
    modeOk = true;
    checks.push(item('config.mode', true, `mode=${config.mode}`));
  } catch (e) {
    checks.push(item('config.mode', false, e instanceof Error ? e.message : String(e)));
  }

  const configValidation = validateCamcpConfig(config, repoRoot);
  checks.push(
    item(
      'config.validate',
      configValidation.ok,
      configValidation.ok
        ? `validate_config pass=${configValidation.summary.pass}`
        : `validate_config fail=${configValidation.summary.fail}`
    )
  );
  void modeOk;

  // repoRoot / reportsDir
  checks.push(
    item('repoRoot.exists', fs.existsSync(repoRoot), fs.existsSync(repoRoot) ? repoRoot : `missing ${repoRoot}`)
  );
  const reportsAbs = path.resolve(repoRoot, config.reportsDir);
  const reportsParent = path.dirname(reportsAbs);
  checks.push(
    item(
      'reportsDir.resolvable',
      fs.existsSync(reportsParent),
      `reportsDir=${config.reportsDir} → ${reportsAbs}`
    )
  );

  // Node.js
  const nodeMajor = Number(process.versions.node.split('.')[0] || 0);
  checks.push(
    item('runtime.node', nodeMajor >= 18, `node=${process.version} (require >=18)`, nodeMajor >= 18 ? 'pass' : 'fail')
  );

  // SDK MCP
  try {
    const require = createRequire(path.join(getCamcpRoot(), 'package.json'));
    const sdkPkg = require('@modelcontextprotocol/sdk/package.json') as { version?: string };
    checks.push(item('runtime.mcp_sdk', true, `sdk=${sdkPkg.version ?? 'present'}`));
  } catch (e) {
    checks.push(item('runtime.mcp_sdk', false, e instanceof Error ? e.message : String(e)));
  }

  // Git
  try {
    const commit = getGitCommitShort(repoRoot, config);
    const log = runGitAllowed(repoRoot, 'rev-parse', ['--is-inside-work-tree'], config);
    const inside = String(log.stdout || '').trim() === 'true';
    checks.push(item('runtime.git', inside, inside ? `git ok commit=${commit}` : 'not a git work tree'));
  } catch (e) {
    checks.push(item('runtime.git', false, e instanceof Error ? e.message : String(e)));
  }

  // Policy Engine
  checks.push(
    item(
      'policy.engine',
      config.mode === 'read-only' || config.mode === 'report-only',
      `permissions.assertReadOnlyMode + non-destructive registry`
    )
  );

  // Path Guard
  try {
    assertReadPathAllowed(repoRoot, path.join(repoRoot, 'camcp', 'config', 'camcp.config.json'));
    let escapeBlocked = false;
    try {
      assertReadPathAllowed(repoRoot, path.resolve(repoRoot, '..', '..', 'etc', 'passwd'));
    } catch (e) {
      escapeBlocked = e instanceof PathGuardError;
    }
    checks.push(item('policy.path_guard', escapeBlocked, escapeBlocked ? 'escape blocked' : 'escape not blocked'));
  } catch (e) {
    checks.push(item('policy.path_guard', false, e instanceof Error ? e.message : String(e)));
  }

  // Command Guard
  try {
    let pushBlocked = false;
    try {
      runGitAllowed(repoRoot, 'push', ['origin', 'main'], config);
    } catch (e) {
      pushBlocked = e instanceof CommandGuardError;
    }
    checks.push(item('policy.command_guard', pushBlocked, pushBlocked ? 'git push blocked' : 'git push not blocked'));
  } catch (e) {
    checks.push(item('policy.command_guard', false, e instanceof Error ? e.message : String(e)));
  }

  // Required camcp.* tools present (kernel)
  for (const required of [
    'camcp.version',
    'camcp.self_check',
    'camcp.list_tools',
    'camcp.validate_config',
    'camcp.health',
  ]) {
    checks.push(
      item(`kernel.tool.${required}`, names.has(required), names.has(required) ? 'registered' : 'missing')
    );
  }

  const version = getCamcpVersionInfo(repoRoot, config, tools);
  const catalog = buildToolCatalog(tools);

  const pass = checks.filter((c) => c.ok).length;
  const fail = checks.filter((c) => !c.ok).length;
  const warn = checks.filter((c) => c.severity === 'warn').length;
  const ok = fail === 0;

  return {
    ok,
    status: ok ? 'PASS' : 'FAIL',
    version,
    catalog,
    configValidation,
    checks,
    summary: { pass, fail, warn, total: checks.length },
  };
}

export function runCamcpHealth(
  repoRoot: string,
  config: CamcpConfig,
  tools: ToolDefinition[]
): {
  ok: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: ReturnType<typeof getCamcpVersionInfo>;
  selfCheck: Pick<SelfCheckResult, 'ok' | 'status' | 'summary'>;
  configOk: boolean;
  registryOk: boolean;
  timestamp: string;
} {
  const self = runCamcpSelfCheck(repoRoot, config, tools);
  const criticalFail = self.checks.some(
    (c) =>
      !c.ok &&
      (c.id.startsWith('registry.') ||
        c.id.startsWith('capabilities.') ||
        c.id === 'config.mode' ||
        c.id === 'policy.path_guard' ||
        c.id === 'policy.command_guard')
  );
  const status = self.ok ? 'healthy' : criticalFail ? 'unhealthy' : 'degraded';
  return {
    ok: self.ok,
    status,
    version: self.version,
    selfCheck: { ok: self.ok, status: self.status, summary: self.summary },
    configOk: self.configValidation.ok,
    registryOk: self.checks.find((c) => c.id === 'registry.integrity')?.ok === true,
    timestamp: new Date().toISOString(),
  };
}
