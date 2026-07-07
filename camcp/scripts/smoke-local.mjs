/**
 * Local smoke test for CAMCP Fase 1 — handlers + registry + guards.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import { assertReadOnlyMode, allToolsReadOnly } from '../dist/policy/permissions.js';
import { toolMetaFromDefinitions } from '../dist/registry/tool-definition.js';
import { ALL_TOOL_DEFINITIONS } from '../dist/tools/index.js';
import { filesystemList, filesystemRead, filesystemSearch, filesystemTree } from '../dist/tools/filesystem.tools.js';
import { gitStatus, gitLog, gitDiff, gitBranch, gitScopeCheck } from '../dist/tools/git.tools.js';
import { PathGuardError } from '../dist/policy/path-guard.js';
import { CommandGuardError } from '../dist/policy/command-guard.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverSource = fs.readFileSync(path.join(__dirname, '../src/server.ts'), 'utf8');
const results = [];

function pass(tool, detail) {
  results.push({ tool, ok: true, detail });
  console.log(`  ✓ ${tool}${detail ? ` — ${detail}` : ''}`);
}

function fail(tool, detail) {
  results.push({ tool, ok: false, detail });
  console.log(`  ✗ ${tool} — ${detail}`);
}

async function main() {
  console.log('[CAMCP smoke] Fase 1 read-only + registry\n');

  const config = loadConfig();
  assertReadOnlyMode(config);
  const repoRoot = resolveRepoRoot(config);
  const toolMeta = toolMetaFromDefinitions(ALL_TOOL_DEFINITIONS);

  if (!allToolsReadOnly(toolMeta)) {
    fail('policy', 'Not all tools are read-only');
    process.exit(1);
  }
  pass('policy', `mode=${config.mode}, tools=${ALL_TOOL_DEFINITIONS.length}`);

  if (serverSource.includes('switch (meta.name)')) {
    fail('registry-server', 'server.ts still contains switch(meta.name)');
  } else {
    pass('registry-server', 'server.ts uses auto registry only');
  }

  if (serverSource.includes('registerToolDefinitions')) {
    pass('registry-wire', 'registerToolDefinitions wired');
  } else {
    fail('registry-wire', 'missing registerToolDefinitions');
  }

  try {
    const list = filesystemList(repoRoot, { path: 'camcp' }, config);
    pass('filesystem.list', `${list.count} entries in camcp/`);
  } catch (e) {
    fail('filesystem.list', String(e));
  }

  try {
    const read = filesystemRead(repoRoot, { path: 'camcp/config/camcp.config.json', limit: 5 }, config);
    pass('filesystem.read', `${read.returnedLines} lines, sha=${read.sha256.slice(0, 8)}`);
  } catch (e) {
    fail('filesystem.read', String(e));
  }

  try {
    const search = filesystemSearch(repoRoot, { pattern: 'CAMCP', path: 'camcp', glob: '*.md' }, config);
    pass('filesystem.search', `${search.count} matches (${search.engine})`);
  } catch (e) {
    fail('filesystem.search', String(e));
  }

  try {
    const tree = filesystemTree(repoRoot, { path: 'camcp', depth: 2 }, config);
    pass('filesystem.tree', `root=${tree.root.path}`);
  } catch (e) {
    fail('filesystem.tree', String(e));
  }

  try {
    const st = gitStatus(repoRoot, config);
    pass('git.status', `branch=${st.branch}, clean=${st.clean}`);
  } catch (e) {
    fail('git.status', String(e));
  }

  try {
    const log = gitLog(repoRoot, { n: 3 }, config);
    pass('git.log', `${log.count} commits`);
  } catch (e) {
    fail('git.log', String(e));
  }

  try {
    const diff = gitDiff(repoRoot, { stat: true }, config);
    pass('git.diff', `range=${diff.range}, files=${diff.files?.length ?? 0}`);
  } catch (e) {
    fail('git.diff', String(e));
  }

  try {
    const br = gitBranch(repoRoot, config);
    pass('git.branch', `current=${br.current}`);
  } catch (e) {
    fail('git.branch', String(e));
  }

  try {
    const scope = gitScopeCheck(repoRoot, { allowedPaths: ['camcp/'] }, config);
    pass('git.scope_check', `inScope=${scope.inScope}, changed=${scope.changedFiles.length}`);
  } catch (e) {
    fail('git.scope_check', String(e));
  }

  try {
    filesystemRead(repoRoot, { path: '../../../etc/passwd' }, config);
    fail('path-guard-escape', 'Should have blocked escape');
  } catch (e) {
    if (e instanceof PathGuardError) pass('path-guard-escape', 'blocked');
    else fail('path-guard-escape', String(e));
  }

  try {
    const { runGitAllowed } = await import('../dist/policy/command-guard.js');
    runGitAllowed(repoRoot, 'push', ['origin', 'main'], config);
    fail('command-guard-push', 'Should have blocked git push');
  } catch (e) {
    if (e instanceof CommandGuardError) pass('command-guard-push', 'blocked');
    else fail('command-guard-push', String(e));
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[CAMCP smoke] ${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
}

main();
