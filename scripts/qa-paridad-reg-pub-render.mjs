/**
 * QA-PARIDAD-REG-PUB — Fase C: render browser (Playwright + perfil-publico.html).
 * node scripts/qa-paridad-reg-pub-render.mjs [--sub medicos-generales] [--out dir]
 * node scripts/qa-paridad-reg-pub-render.mjs --strict [--compare-with path/to/render-summary.json]
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

import { makePipelineCtx, REPO } from './qa-paridad-reg-pub/lib/vm-pipeline-context.mjs';
import { loadSchemaIndex, listSubcategorias } from './qa-paridad-reg-pub/lib/catalog-loader.mjs';
import { createPlaywrightSession } from './qa-paridad-reg-pub/lib/playwright-context.mjs';
import { runSubRender, aggregateRenderResults, SMOKE_SUBS } from './qa-paridad-reg-pub/lib/render-runner.mjs';
import { writePhaseCReports } from './qa-paridad-reg-pub/lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_NORMAL_BASELINE = path.join(
  REPO,
  'agent-tools',
  'qa-paridad-reports',
  'analisis-perfil-publico',
  'render-summary.json'
);

function parseArgs(argv) {
  const out = { sub: null, outDir: null, allSmoke: true, strict: false, compareWith: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--sub' && argv[i + 1]) {
      out.sub = argv[++i];
      out.allSmoke = false;
    } else if (argv[i] === '--out' && argv[i + 1]) out.outDir = argv[++i];
    else if (argv[i] === '--strict' || argv[i] === '--production-path') out.strict = true;
    else if (argv[i] === '--compare-with' && argv[i + 1]) out.compareWith = argv[++i];
  }
  return out;
}

function gitCommitShort() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: REPO, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function loadNormalBaseline(comparePath) {
  const file = comparePath || DEFAULT_NORMAL_BASELINE;
  try {
    if (fs.existsSync(file)) {
      return { path: file, data: JSON.parse(fs.readFileSync(file, 'utf8')) };
    }
  } catch {
    /* ignore */
  }
  return { path: file, data: null };
}

function buildStrictComparison(strictPayload, normalBaseline) {
  const normal = normalBaseline?.data;
  if (!normal) {
    return {
      baselinePath: normalBaseline?.path || null,
      baselineFound: false,
      note: 'Sin baseline normal; ejecutar Fase C sin --strict para comparar.',
    };
  }

  const bySub = new Map((normal.subResults || []).map((s) => [s.subcategoriaId, s]));
  const rows = (strictPayload.subResults || []).map((strictSub) => {
    const normalSub = bySub.get(strictSub.subcategoriaId) || null;
    return {
      subcategoriaId: strictSub.subcategoriaId,
      normal: normalSub
        ? {
            status: normalSub.status,
            injectionMode: normalSub.injectionMode,
            pcardCount: normalSub.pcardCount,
            pass: normalSub.summary?.pass ?? 0,
            fail: normalSub.summary?.fail ?? 0,
            blockers: normalSub.summary?.blockers ?? 0,
          }
        : null,
      strict: {
        status: strictSub.status,
        injectionMode: strictSub.injectionMode,
        pcardCount: strictSub.pcardCount,
        pass: strictSub.summary?.pass ?? 0,
        fail: strictSub.summary?.fail ?? 0,
        blockers: strictSub.summary?.blockers ?? 0,
        runtimeCrash: strictSub.runtimeCrash || null,
        paintOk: strictSub.paintOk !== false,
      },
      delta: {
        statusChanged: normalSub ? normalSub.status !== strictSub.status : null,
        pcardDelta: normalSub ? (strictSub.pcardCount ?? 0) - (normalSub.pcardCount ?? 0) : null,
        presenceFailDelta: normalSub
          ? (strictSub.summary?.fail ?? 0) - (normalSub.summary?.fail ?? 0)
          : null,
      },
    };
  });

  return {
    baselinePath: normalBaseline.path,
    baselineFound: true,
    baselineRunId: normal.meta?.runId || null,
    baselineGitCommit: normal.meta?.gitCommit || null,
    summary: {
      normalSubsPass: normal.summary?.subsPass ?? 0,
      strictSubsPass: strictPayload.summary?.subsPass ?? 0,
      normalBlockers: normal.summary?.blockers ?? 0,
      strictBlockers: strictPayload.summary?.blockers ?? 0,
      strictRuntimeCrashes: strictPayload.summary?.runtimeCrashes ?? 0,
    },
    rows,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outBase =
    args.outDir ||
    path.join(
      REPO,
      'agent-tools',
      'qa-paridad-reports',
      args.strict ? 'fase-c-strict' : runId
    );
  const shotsDir = path.join(outBase, 'screenshots');
  const t0 = Date.now();

  const subs = args.allSmoke ? SMOKE_SUBS : [args.sub];

  console.log(`[Fase C${args.strict ? ' STRICT' : ''}] VM pipeline + Playwright…`);
  if (args.strict) {
    console.log('[Fase C STRICT] Sin applyProfileToPage — solo sessionStorage + flujo real');
  }
  const { ctx } = makePipelineCtx();
  const index = loadSchemaIndex(ctx);

  const session = await createPlaywrightSession();
  console.log('[Fase C] QA_BASE:', session.baseUrl);

  const subResults = [];
  try {
    for (const subId of subs) {
      const entries = listSubcategorias(index, { subcategoriaId: subId });
      if (!entries.length) {
        console.log(`  ○ ${subId} — no encontrada en schema-index`);
        continue;
      }
      const entry = entries[0];
      const result = await runSubRender({ ctx, schemaEntry: entry, session, shotsDir, strict: args.strict });
      subResults.push(result);

      const icon = result.status === 'pass' ? '✓' : result.status === 'skipped' ? '○' : '✗';
      const crashNote = result.runtimeCrash ? ` CRASH:${result.runtimeCrash.message.slice(0, 60)}` : '';
      console.log(
        `  ${icon} ${entry.sectorId}/${entry.subcategoriaId} — ${result.status}` +
          (result.summary ? ` (pass:${result.summary.pass} fail:${result.summary.fail} blockers:${result.summary.blockers})` : '') +
          (result.injectionMode ? ` [${result.injectionMode}]` : '') +
          (result.pipelineError ? ` ERR:${result.pipelineError}` : '') +
          crashNote
      );
    }
  } finally {
    await session.close();
  }

  const { summary, failures, topFailures } = aggregateRenderResults(subResults);
  const normalBaseline = args.strict ? loadNormalBaseline(args.compareWith) : null;
  const strictComparison = args.strict ? buildStrictComparison({ summary, subResults }, normalBaseline) : null;

  const payload = {
    meta: {
      agentVersion: args.strict ? '1.0.0-fase-c-strict' : '1.0.0-fase-c-smoke',
      phase: 'C',
      runId,
      gitCommit: gitCommitShort(),
      generatedAt: new Date().toISOString(),
      durationMs: Date.now() - t0,
      qaBase: session.baseUrl,
      defaultInjection: args.strict ? 'sessionStorage-strict' : 'sessionStorage',
      strictMode: args.strict,
      smokeSubs: subs,
    },
    summary,
    topFailures,
    failures,
    subResults,
    subResultsDetailed: subResults,
    strictComparison,
  };

  writePhaseCReports(outBase, payload);

  console.log('\n=== QA Paridad Fase C — completado ===');
  console.log('Salida:', outBase);
  console.log('Screenshots:', shotsDir);
  console.log('Modo:', args.strict ? 'STRICT (producción)' : 'normal (con parche agente)');
  console.log('Procesadas:', summary.processed, '/', summary.totalSubs);
  console.log('Subs PASS:', summary.subsPass, '| FAIL:', summary.subsFail);
  console.log('Presencia FAIL:', summary.presenceFail, '| Privacy DOM:', summary.privacyDomViolations);
  if (args.strict) console.log('Runtime crashes:', summary.runtimeCrashes ?? 0);
  console.log('Bloqueadores:', summary.blockers);
  if (strictComparison?.baselineFound) {
    console.log(
      'Comparación vs normal:',
      `PASS ${strictComparison.summary.normalSubsPass}→${strictComparison.summary.strictSubsPass}`,
      `blockers ${strictComparison.summary.normalBlockers}→${strictComparison.summary.strictBlockers}`
    );
  }

  if (summary.subsFail > 0 || summary.blockers > 0) {
    process.exit(1);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error('[Fase C] Error fatal:', e);
  process.exit(2);
});
