/**
 * Phase 3.0 — Engine wiring smoke: verify MCP registry exposes wired engines.
 */
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import {
  allToolsNonDestructive,
  assertReadOnlyMode,
} from '../dist/policy/permissions.js';
import { assertToolDefinitionsValid, toolMetaFromDefinitions } from '../dist/registry/tool-definition.js';
import { ALL_TOOL_DEFINITIONS } from '../dist/tools/index.js';

const EXPECTED_NEW_TOOLS = [
  'git.worktree',
  'catalog.audit',
  'profile.audit',
  'arch.review',
  'invalidation.watch_list',
  'invalidation.explain',
  'invalidation.evaluate',
  'camcp.version',
  'camcp.self_check',
  'camcp.list_tools',
  'camcp.validate_config',
  'camcp.health',
];

const BASELINE_TOOL_COUNT = 32;
const EXPECTED_TOOL_COUNT = BASELINE_TOOL_COUNT + EXPECTED_NEW_TOOLS.length;

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
  console.log('[CAMCP smoke-wiring] Phase 3.0 engine MCP registry\n');

  const config = loadConfig();
  assertReadOnlyMode(config);
  const repoRoot = resolveRepoRoot(config);

  try {
    assertToolDefinitionsValid(ALL_TOOL_DEFINITIONS);
    pass('registry-valid', `${ALL_TOOL_DEFINITIONS.length} tools`);
  } catch (e) {
    fail('registry-valid', String(e));
    process.exit(1);
  }

  const meta = toolMetaFromDefinitions(ALL_TOOL_DEFINITIONS);
  if (!allToolsNonDestructive(meta)) {
    fail('policy-non-destructive', 'write-capable tool detected');
    process.exit(1);
  }
  pass('policy-non-destructive', `${meta.filter((t) => t.capability === 'read-only').length} read-only, ${meta.filter((t) => t.capability === 'report-only').length} report-only`);

  if (ALL_TOOL_DEFINITIONS.length === EXPECTED_TOOL_COUNT) {
    pass('tool-count', String(EXPECTED_TOOL_COUNT));
  } else {
    fail('tool-count', `expected ${EXPECTED_TOOL_COUNT}, got ${ALL_TOOL_DEFINITIONS.length}`);
  }

  const names = new Set(ALL_TOOL_DEFINITIONS.map((t) => t.name));
  for (const toolName of EXPECTED_NEW_TOOLS) {
    if (names.has(toolName)) {
      const cap = meta.find((t) => t.name === toolName)?.capability;
      pass(`registered:${toolName}`, cap ?? 'unknown');
    } else {
      fail(`registered:${toolName}`, 'missing');
    }
  }

  const namespaces = [...new Set(ALL_TOOL_DEFINITIONS.map((t) => t.namespace))].sort();
  for (const ns of ['catalog', 'profile', 'invalidation', 'camcp']) {
    if (namespaces.includes(ns)) pass(`namespace:${ns}`, 'present');
    else fail(`namespace:${ns}`, 'missing');
  }

  if (namespaces.includes('git') && names.has('git.worktree')) {
    pass('namespace:git.worktree', 'git namespace extended');
  } else {
    fail('namespace:git.worktree', 'missing');
  }

  if (namespaces.includes('arch') && names.has('arch.review')) {
    pass('namespace:arch.review', 'arch namespace extended');
  } else {
    fail('namespace:arch.review', 'missing');
  }

  // Handler smoke — read-only / lightweight facets only
  const gitWt = ALL_TOOL_DEFINITIONS.find((t) => t.name === 'git.worktree');
  if (gitWt) {
    try {
      const out = gitWt.handler({ repoRoot, config }, { facet: 'state' });
      if (out && typeof out.ok === 'boolean') pass('handler:git.worktree', `ok=${out.ok}`);
      else fail('handler:git.worktree', 'unexpected shape');
    } catch (e) {
      fail('handler:git.worktree', String(e));
    }
  }

  const invExplain = ALL_TOOL_DEFINITIONS.find((t) => t.name === 'invalidation.explain');
  if (invExplain) {
    try {
      const out = invExplain.handler({ repoRoot, config }, { checkId: 'catalog.audit:summary' });
      if (out?.checkId === 'catalog.audit:summary') pass('handler:invalidation.explain', 'matched');
      else fail('handler:invalidation.explain', JSON.stringify(out));
    } catch (e) {
      fail('handler:invalidation.explain', String(e));
    }
  }

  const invWatch = ALL_TOOL_DEFINITIONS.find((t) => t.name === 'invalidation.watch_list');
  if (invWatch) {
    try {
      const out = invWatch.handler({ repoRoot, config }, {});
      if (Array.isArray(out?.watches) && out.watches.length >= 10) {
        pass('handler:invalidation.watch_list', `${out.watches.length} watches`);
      } else {
        fail('handler:invalidation.watch_list', `watches=${out?.watches?.length}`);
      }
    } catch (e) {
      fail('handler:invalidation.watch_list', String(e));
    }
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n[CAMCP smoke-wiring] ${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
}

main();
