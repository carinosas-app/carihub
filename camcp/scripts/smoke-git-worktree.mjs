/**
 * Smoke test — CAMCP Phase 1 Step 4 git.worktree + Git Context Engine v1
 * Covers SPEC test plan G1–G15.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import {
  assessConflictRiskFromWorktrees,
  buildRecommendations,
  buildStaleContextFinding,
  isGitContextStale,
  isWorktreeIdle,
  parseWorktreePorcelain,
  toHandoffGitFields,
  validateGitContextShape,
} from '../dist/core/git-context-engine/index.js';
import { evaluateInvalidation } from '../dist/core/invalidation-registry/index.js';
import { runGitWorktree } from '../dist/git-worktree/runner.js';
import {
  CommandGuardError,
  runGitAllowed,
} from '../dist/policy/command-guard.js';
import { gitStatus } from '../dist/tools/git.tools.js';
import { readCamcpReportFromDir } from '../dist/reports/parser.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
  console.log('[CAMCP smoke-git-worktree] git.worktree + Git Context Engine (Step 4)\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);

  try {
    runGitAllowed(repoRoot, 'checkout', ['main'], config);
    fail('G1-guard-checkout', 'should block checkout');
  } catch (e) {
    if (e instanceof CommandGuardError) pass('G1-guard-checkout', 'blocked');
    else fail('G1-guard-checkout', String(e));
  }

  try {
    runGitAllowed(repoRoot, 'worktree', ['remove', '/tmp/x'], config);
    fail('G1-guard-worktree-remove', 'should block remove');
  } catch (e) {
    if (e instanceof CommandGuardError) pass('G1-guard-worktree-remove', 'blocked');
    else fail('G1-guard-worktree-remove', String(e));
  }

  try {
    const wt = runGitAllowed(repoRoot, 'worktree', ['list', '--porcelain'], config);
    if (wt.exitCode === 0) pass('G1-guard-worktree-list', 'allowed');
    else fail('G1-guard-worktree-list', `exit=${wt.exitCode}`);
  } catch (e) {
    fail('G1-guard-worktree-list', String(e));
  }

  const porcelainSample = `worktree ${repoRoot.replace(/\\/g, '/')}
HEAD abcdef1234567890abcdef1234567890abcdef12
branch refs/heads/main

worktree /tmp/wt-feature
HEAD abcdef1234567890abcdef1234567890abcdef12
branch refs/heads/feat/test
`;
  const parsed = parseWorktreePorcelain(porcelainSample);
  if (parsed.length >= 2 && parsed[0]?.branch === 'main') {
    pass('G2-worktree-parse', `${parsed.length} entries`);
  } else {
    fail('G2-worktree-parse', JSON.stringify(parsed));
  }

  const st = gitStatus(repoRoot, config);
  const dirtyOk =
    typeof st.clean === 'boolean' &&
    Array.isArray(st.files) &&
    st.clean === (st.files.length === 0);
  if (dirtyOk) {
    pass('G3-dirty-detection', `clean=${st.clean}, files=${st.files.length}`);
  } else {
    fail('G3-dirty-detection', JSON.stringify({ clean: st.clean, files: st.files.length }));
  }

  const stateRun = runGitWorktree(repoRoot, config, { facet: 'state', git: { baseRef: 'main' } });
  const active = stateRun.gitContext.activeWorktree;
  if (
    typeof active.ahead === 'number' &&
    typeof active.behind === 'number' &&
    active.headCommit
  ) {
    pass('G4-ahead-behind', `ahead=${active.ahead}, behind=${active.behind}`);
  } else {
    fail('G4-ahead-behind', JSON.stringify(active));
  }

  const dupFixture = parseWorktreePorcelain(`worktree /a
HEAD aaa
branch refs/heads/same
worktree /b
HEAD bbb
branch refs/heads/same
`);
  if (dupFixture.length === 2 && dupFixture[0]?.branch === dupFixture[1]?.branch) {
    pass('G5-duplicate-branch', 'fixture same branch');
  } else {
    fail('G5-duplicate-branch', 'parse failed');
  }

  const high = assessConflictRiskFromWorktrees([
    { id: 'a', branch: 'feat/x', dirty: true },
    { id: 'b', branch: 'feat/x', dirty: true },
  ]);
  if (high === 'high') pass('G6-conflict-high', high);
  else fail('G6-conflict-high', high);

  const oldDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  if (isWorktreeIdle(oldDate, 14, new Date())) {
    pass('G7-stale-idle', 'old commit flagged');
  } else {
    fail('G7-stale-idle', 'not idle');
  }

  const cleanupRun = runGitWorktree(repoRoot, config, { facet: 'cleanup_report' });
  const candidates = cleanupRun.gitContext.cleanupCandidates ?? [];
  if (candidates.every((c) => c.autoExecution === false)) {
    pass('G8-cleanup-report-only', `${candidates.length} candidates`);
  } else {
    fail('G8-cleanup-report-only', 'autoExecution not false');
  }

  const prRun = runGitWorktree(repoRoot, config, {
    facet: 'pr_status',
    pr: { enabled: true, inferFromBranch: true },
  });
  if (prRun.gitContext.pr && prRun.gitContext.pr.checks) {
    pass('G9-pr-graceful', `number=${prRun.gitContext.pr.number}`);
  } else {
    fail('G9-pr-graceful', 'invalid pr shape');
  }

  const fullRun = runGitWorktree(repoRoot, config, { facet: 'full', git: { baseRef: 'main' } });
  const missing = validateGitContextShape(fullRun.gitContext);
  if (!missing.length && fullRun.gitContext.schemaVersion === '1.0.0') {
    pass('G10-gitContext-schema', 'golden fields ok');
  } else {
    fail('G10-gitContext-schema', missing.join(', ') || 'version mismatch');
  }

  const handoff = toHandoffGitFields(fullRun.gitContext, fullRun.gitContextPath ?? '');
  if (
    handoff.commit === fullRun.gitContext.activeWorktree.headShort &&
    handoff.branch === fullRun.gitContext.activeWorktree.branch &&
    handoff.dirty === fullRun.gitContext.activeWorktree.dirty
  ) {
    pass('G11-handoff-mapping', `branch=${handoff.branch}`);
  } else {
    fail('G11-handoff-mapping', JSON.stringify(handoff));
  }

  const inv = evaluateInvalidation({
    repoRoot,
    currentSnapshots: [],
    gitContext: {
      commit: fullRun.gitContext.activeWorktree.headCommit,
      branch: fullRun.gitContext.activeWorktree.branch,
    },
    completedChecks: [
      {
        id: 'git.worktree:full',
        toolId: 'git.worktree',
        facet: 'full',
        gitCommit: 'deadbeef00000000000000000000000000000000',
        gitBranch: fullRun.gitContext.activeWorktree.branch,
      },
    ],
  });
  const headInv = inv.checks.find((c) => c.id === 'git.worktree:full');
  if (headInv && headInv.valid === false && headInv.reason === 'git_head_changed') {
    pass('G12-head-invalidation', headInv.message ?? 'invalidated');
  } else {
    fail('G12-head-invalidation', JSON.stringify(headInv));
  }

  if (
    isGitContextStale('abc1234', fullRun.gitContext.activeWorktree.headCommit ?? 'zzz') &&
    buildStaleContextFinding('abc1234', fullRun.gitContext.activeWorktree.headCommit ?? 'zzz')
      .code === 'GIT.CONTEXT.STALE'
  ) {
    pass('G13-stale-context', 'GIT.CONTEXT.STALE');
  } else {
    fail('G13-stale-context', 'stale check failed');
  }

  const recs = buildRecommendations(
    {
      worktrees: [],
      activeDirty: false,
      conflictRisk: 'low',
      diff: {
        baseRef: 'main',
        headRef: 'HEAD',
        filesChanged: 15,
        insertions: 0,
        deletions: 0,
        changedFiles: Array.from({ length: 15 }, (_, i) => `file${i}.ts`),
      },
      behind: 0,
    },
    {}
  );
  if (recs.some((r) => r.code === 'ARCH_REVIEW_RECOMMENDED')) {
    pass('G14-recommend-arch', 'ARCH_REVIEW when >10 files');
  } else {
    fail('G14-recommend-arch', recs.map((r) => r.code).join(','));
  }

  const manifestAbs = fullRun.reportPaths.find((p) => p.endsWith('manifest.json'));
  const ctxAbs = fullRun.gitContextPath;
  if (manifestAbs && ctxAbs && fs.existsSync(path.join(repoRoot, ctxAbs))) {
    const reportDir = path.dirname(path.join(repoRoot, manifestAbs));
    const doc = readCamcpReportFromDir(reportDir);
    if (doc.schemaVersion === '2.0.0' && fs.existsSync(path.join(reportDir, 'git-context.json'))) {
      pass('G15-reports-v2', `status=${doc.status}`);
    } else {
      fail('G15-reports-v2', 'missing v2 artifacts');
    }
  } else {
    fail('G15-reports-v2', 'paths missing');
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[CAMCP smoke-git-worktree] ${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
}

main();
