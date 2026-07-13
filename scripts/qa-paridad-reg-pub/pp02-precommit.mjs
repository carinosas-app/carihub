/**
 * PP-02 pre-commit orchestrator (no commit).
 * node scripts/qa-paridad-reg-pub/pp02-precommit.mjs [--skip-render] [--skip-vm] [--render-strict]
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { REPO } from './lib/vm-pipeline-context.mjs';
import { getMatrixCases } from './lib/render-matrix.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = path.join(REPO, 'agent-tools', 'qa-paridad-reports', 'pp02-precommit');

function parseArgs(argv) {
  return {
    skipRender: argv.includes('--skip-render'),
    skipVm: argv.includes('--skip-vm'),
    skipStatic: argv.includes('--skip-static'),
    renderStrict: argv.includes('--render-strict'),
    renderSample: argv.includes('--render-sample'),
  };
}

function runStep(name, cmd, args, opts = {}) {
  console.log(`\n>>> ${name}\n$ node ${[cmd, ...args].join(' ')}`);
  const r = spawnSync(process.execPath, [path.join(REPO, cmd), ...args], {
    cwd: REPO,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ...opts.env },
    timeout: opts.timeoutMs || 45 * 60 * 1000,
  });
  const out = `${r.stdout || ''}${r.stderr || ''}`;
  if (out.trim()) console.log(out.slice(-8000));
  return { name, ok: r.status === 0, exitCode: r.status ?? 1, outputTail: out.slice(-4000) };
}

function readJsonIfExists(file) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    /* ignore */
  }
  return null;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const steps = [];
  steps.push(runStep('PP-02 matrix integrity', 'scripts/qa-paridad-reg-pub/pp02-matrix-integrity.test.mjs', []));

  if (!args.skipStatic) {
    steps.push(
      runStep('parity.static (catalog)', 'scripts/qa-paridad-reg-pub-static.mjs', [
        '--out',
        path.join(REPORT_DIR, 'static'),
      ])
    );
  }

  if (!args.skipVm) {
    steps.push(
      runStep('parity.vm (443 subs — PP-01 gaps expected)', 'scripts/qa-paridad-reg-pub-vm.mjs', [
        '--out',
        path.join(REPORT_DIR, 'vm'),
      ], { timeoutMs: 60 * 60 * 1000 })
    );
  }

  if (!args.skipRender) {
    const renderArgs = ['--matrix', '--out', path.join(REPORT_DIR, args.renderStrict ? 'render-strict' : 'render')];
    if (args.renderStrict) renderArgs.push('--strict');
    if (args.renderSample) {
      renderArgs.length = 0;
      renderArgs.push('--sub', 'medicos-generales', '--out', path.join(REPORT_DIR, 'render-sample'));
    }
    steps.push(
      runStep(
        args.renderStrict ? 'parity.render_strict (35 matrix)' : 'parity.render (35 matrix, agent-enriched)',
        'scripts/qa-paridad-reg-pub-render.mjs',
        renderArgs,
        { timeoutMs: 90 * 60 * 1000 }
      )
    );
  }

  const vmSummary = readJsonIfExists(path.join(REPORT_DIR, 'vm', 'pipeline-summary.json'));
  const renderSummary = readJsonIfExists(
    path.join(REPORT_DIR, args.renderStrict ? 'render-strict' : 'render', 'render-summary.json')
  );

  const report = {
    generatedAt: new Date().toISOString(),
    baselineGit: '40bf4004ce42c3d6a756228635b69c6ce6f2daf8',
    matrixCaseCount: getMatrixCases().length,
    steps,
    vm: vmSummary
      ? {
          processed: vmSummary.summary?.processed,
          subsPass: vmSummary.summary?.subsPass,
          subsFail: vmSummary.summary?.subsFail,
          blockers: vmSummary.summary?.blockers,
          note: 'PP-01: 17 subs expected FAIL (refaccionarias mock coverage fixed in PP-02)',
        }
      : null,
    render: renderSummary
      ? {
          processed: renderSummary.summary?.processed,
          subsPass: renderSummary.summary?.subsPass,
          subsFail: renderSummary.summary?.subsFail,
          blockers: renderSummary.summary?.blockers,
          privacyDomViolations: renderSummary.summary?.privacyDomViolations,
          runtimeCrashes: renderSummary.summary?.runtimeCrashes,
          strictMode: renderSummary.meta?.strictMode,
        }
      : null,
  };

  const reportPath = path.join(REPORT_DIR, 'pp02-precommit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n=== PP-02 Pre-Commit Report written ===');
  console.log(reportPath);

  const hardFail = steps.some((s) => s.name.includes('integrity') && !s.ok);
  process.exit(hardFail ? 1 : 0);
}

main();
