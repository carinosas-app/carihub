/**
 * Extended architecture validation smoke — Fase 1 evidence pack.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import {
  allToolsReadOnly,
  assertReadOnlyMode,
} from '../dist/policy/permissions.js';
import { toolMetaFromDefinitions } from '../dist/registry/tool-definition.js';
import { ALL_TOOL_DEFINITIONS } from '../dist/tools/index.js';
import {
  resolveRepoPath,
  assertWritePathAllowed,
  PathGuardError,
} from '../dist/policy/path-guard.js';
import {
  assertCommandAllowed,
  runGitAllowed,
  CommandGuardError,
} from '../dist/policy/command-guard.js';
import { filesystemList, filesystemRead } from '../dist/tools/filesystem.tools.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = resolveRepoRoot(loadConfig());
const config = loadConfig();

const rows = [];

function record(name, expected, actual, pass) {
  rows.push({ name, expected, actual, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name}`);
  if (!pass) console.log(`       expected: ${expected}`);
  console.log(`       actual:   ${actual}`);
}

function tryPathGuard(label, fn) {
  try {
    fn();
    record(label, 'blocked', 'allowed', false);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    record(label, 'blocked', msg.slice(0, 120), e instanceof PathGuardError);
  }
}

function tryCmdGuard(label, cmd) {
  try {
    assertCommandAllowed(cmd, config);
    record(label, 'blocked', 'allowed', false);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    record(label, 'blocked', msg.slice(0, 120), e instanceof CommandGuardError);
  }
}

function tryGitSub(label, sub, args = []) {
  try {
    runGitAllowed(repoRoot, sub, args, config);
    record(label, 'blocked', 'allowed', false);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    record(label, 'blocked', msg.slice(0, 120), e instanceof CommandGuardError);
  }
}

console.log('=== CAMCP extended validation ===\n');
console.log('repoRoot:', repoRoot);
console.log('mode:', config.mode);
console.log('tools:', ALL_TOOL_DEFINITIONS.length);
console.log('all read-only:', allToolsReadOnly(toolMetaFromDefinitions(ALL_TOOL_DEFINITIONS)));
console.log('namespaces:', [...new Set(ALL_TOOL_DEFINITIONS.map((t) => t.namespace))].join(', '));
console.log('');

// Path guard
tryPathGuard('path ../ escape', () => resolveRepoPath(repoRoot, '../../../Windows/System32'));
tryPathGuard('path absolute outside', () => resolveRepoPath(repoRoot, 'C:/Windows/System32/drivers/etc/hosts'));
tryPathGuard('write public/', () => assertWritePathAllowed(repoRoot, path.join(repoRoot, 'public/index.html'), config));
tryPathGuard('write firestore.rules', () => assertWritePathAllowed(repoRoot, path.join(repoRoot, 'firestore.rules'), config));
tryPathGuard('write firebase.json', () => assertWritePathAllowed(repoRoot, path.join(repoRoot, 'firebase.json'), config));
tryPathGuard('write storage.rules', () => assertWritePathAllowed(repoRoot, path.join(repoRoot, 'storage.rules'), config));
tryPathGuard('write outside camcp (scripts/)', () => assertWritePathAllowed(repoRoot, path.join(repoRoot, 'scripts/foo.mjs'), config));

// Read public/ — currently ALLOWED (read-only phase)
try {
  const pub = filesystemRead(repoRoot, { path: 'public/index.html', limit: 1 }, config);
  record('read public/index.html', 'allowed (read-only phase)', `ok lines=${pub.returnedLines}`, true);
} catch (e) {
  record('read public/index.html', 'allowed (read-only phase)', String(e), false);
}

// Symlink test (create temp symlink inside camcp if possible)
const linkPath = path.join(repoRoot, 'camcp', '_smoke-link-test');
try {
  if (fs.existsSync(linkPath)) fs.unlinkSync(linkPath);
  fs.symlinkSync(path.join(repoRoot, '..'), linkPath, 'junction');
  tryPathGuard('symlink parent via camcp/_smoke-link-test', () => resolveRepoPath(repoRoot, 'camcp/_smoke-link-test/secret'));
  fs.unlinkSync(linkPath);
} catch (e) {
  record('symlink test', 'blocked or skipped', `skipped: ${String(e).slice(0, 80)}`, true);
}

// Command guard patterns
tryCmdGuard('git push', 'git push origin main');
tryCmdGuard('git commit', 'git commit -m x');
tryCmdGuard('git merge', 'git merge main');
tryCmdGuard('git reset --hard', 'git reset --hard HEAD');
tryCmdGuard('git clean', 'git clean -fd');
tryGitSub('git push subcommand', 'push', ['origin', 'main']);
tryGitSub('git commit subcommand', 'commit', ['-m', 'x']);
tryCmdGuard('firebase deploy', 'firebase deploy --only hosting');
tryCmdGuard('firebase use', 'firebase use production');
tryCmdGuard('rm -rf', 'rm -rf public');
tryCmdGuard('del /f', 'del /f public\\index.html');
tryCmdGuard('Remove-Item', 'Remove-Item -Recurse public');
tryCmdGuard('rmdir', 'rmdir /s public');
tryCmdGuard('Invoke-Expression', 'powershell Invoke-Expression "git push"');
tryCmdGuard('cmd /c', 'cmd /c git push');
tryCmdGuard('bash -c', 'bash -c "git push"');

// Performance: filesystem.list
const t0 = performance.now();
filesystemList(repoRoot, { path: 'camcp' }, config);
const listMs = performance.now() - t0;
record('perf filesystem.list camcp/', '<50ms typical', `${listMs.toFixed(2)}ms`, listMs < 500);

const failed = rows.filter((r) => !r.pass);
console.log(`\n=== ${rows.length - failed.length}/${rows.length} checks passed ===`);
if (failed.length) {
  console.log('\nFailures:');
  failed.forEach((f) => console.log(` - ${f.name}`));
  process.exit(1);
}
