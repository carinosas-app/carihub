/**
 * Smoke — CAMCP kernel consolidation (camcp.* namespace).
 */
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import { assertReadOnlyMode, allToolsNonDestructive } from '../dist/policy/permissions.js';
import { assertToolDefinitionsValid, toolMetaFromDefinitions } from '../dist/registry/tool-definition.js';
import { ALL_TOOL_DEFINITIONS } from '../dist/tools/index.js';
import {
  camcpHealth,
  camcpListTools,
  camcpSelfCheck,
  camcpValidateConfig,
  camcpVersion,
} from '../dist/tools/camcp.tools.js';

const REQUIRED = [
  'camcp.version',
  'camcp.self_check',
  'camcp.list_tools',
  'camcp.validate_config',
  'camcp.health',
];

const results = [];

function pass(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name} — ${detail}`);
}

function main() {
  console.log('[CAMCP smoke-camcp] kernel consolidation\n');

  const config = loadConfig();
  assertReadOnlyMode(config);
  const repoRoot = resolveRepoRoot(config);

  try {
    assertToolDefinitionsValid(ALL_TOOL_DEFINITIONS);
    pass('registry', `${ALL_TOOL_DEFINITIONS.length} tools`);
  } catch (e) {
    fail('registry', String(e));
    process.exit(1);
  }

  const meta = toolMetaFromDefinitions(ALL_TOOL_DEFINITIONS);
  if (!allToolsNonDestructive(meta)) {
    fail('policy', 'write-capable detected');
    process.exit(1);
  }
  pass('policy', '0 write-capable');

  const names = new Set(ALL_TOOL_DEFINITIONS.map((t) => t.name));
  for (const t of REQUIRED) {
    if (names.has(t)) pass(`registered:${t}`, meta.find((m) => m.name === t)?.capability);
    else fail(`registered:${t}`, 'missing');
  }

  const namespaces = [...new Set(ALL_TOOL_DEFINITIONS.map((t) => t.namespace))].sort();
  if (namespaces.includes('camcp')) pass('namespace:camcp', 'present');
  else fail('namespace:camcp', 'missing');

  try {
    const v = camcpVersion(repoRoot, config, ALL_TOOL_DEFINITIONS);
    if (v.camcpVersion && v.toolCount === ALL_TOOL_DEFINITIONS.length) {
      pass('camcp.version', `v=${v.camcpVersion} tools=${v.toolCount} ns=${v.namespaces.join(',')}`);
    } else fail('camcp.version', JSON.stringify(v));
  } catch (e) {
    fail('camcp.version', String(e));
  }

  try {
    const catalog = camcpListTools(repoRoot, config, ALL_TOOL_DEFINITIONS);
    if (catalog.toolCount === ALL_TOOL_DEFINITIONS.length && catalog.byNamespace.camcp?.length === 5) {
      pass('camcp.list_tools', `tools=${catalog.toolCount} namespaces=${catalog.namespaces.length}`);
    } else fail('camcp.list_tools', `tools=${catalog.toolCount} camcp=${catalog.byNamespace.camcp?.length}`);
  } catch (e) {
    fail('camcp.list_tools', String(e));
  }

  try {
    const cfg = camcpValidateConfig(repoRoot, config, ALL_TOOL_DEFINITIONS);
    if (cfg.ok && cfg.execution?.exitCode === 0) pass('camcp.validate_config', `checks pass=${cfg.summary.pass}`);
    else fail('camcp.validate_config', JSON.stringify(cfg.summary));
  } catch (e) {
    fail('camcp.validate_config', String(e));
  }

  try {
    const self = camcpSelfCheck(repoRoot, config, ALL_TOOL_DEFINITIONS);
    if (self.ok && self.status === 'PASS') pass('camcp.self_check', `${self.summary.pass}/${self.summary.total}`);
    else fail('camcp.self_check', `${self.status} fail=${self.summary?.fail}`);
  } catch (e) {
    fail('camcp.self_check', String(e));
  }

  try {
    const health = camcpHealth(repoRoot, config, ALL_TOOL_DEFINITIONS);
    if (health.ok && health.status === 'healthy') pass('camcp.health', health.status);
    else fail('camcp.health', JSON.stringify(health));
  } catch (e) {
    fail('camcp.health', String(e));
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n[CAMCP smoke-camcp] ${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
}

main();
