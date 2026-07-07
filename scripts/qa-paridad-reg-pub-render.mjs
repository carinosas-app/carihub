/**
 * QA-PARIDAD-REG-PUB — Fase C: render browser (Playwright + perfil-publico.html).
 * node scripts/qa-paridad-reg-pub-render.mjs [--sub medicos-generales] [--out dir]
 */
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

import { makePipelineCtx, REPO } from './qa-paridad-reg-pub/lib/vm-pipeline-context.mjs';
import { loadSchemaIndex, listSubcategorias } from './qa-paridad-reg-pub/lib/catalog-loader.mjs';
import { createPlaywrightSession } from './qa-paridad-reg-pub/lib/playwright-context.mjs';
import { runSubRender, aggregateRenderResults, SMOKE_SUBS } from './qa-paridad-reg-pub/lib/render-runner.mjs';
import { writePhaseCReports } from './qa-paridad-reg-pub/lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const out = { sub: null, outDir: null, allSmoke: true };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--sub' && argv[i + 1]) {
      out.sub = argv[++i];
      out.allSmoke = false;
    } else if (argv[i] === '--out' && argv[i + 1]) out.outDir = argv[++i];
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

async function main() {
  const args = parseArgs(process.argv);
  const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outBase = args.outDir || path.join(REPO, 'agent-tools', 'qa-paridad-reports', runId);
  const shotsDir = path.join(outBase, 'screenshots');
  const t0 = Date.now();

  const subs = args.allSmoke ? SMOKE_SUBS : [args.sub];

  console.log('[Fase C] VM pipeline + Playwright…');
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
      const result = await runSubRender({ ctx, schemaEntry: entry, session, shotsDir });
      subResults.push(result);

      const icon = result.status === 'pass' ? '✓' : result.status === 'skipped' ? '○' : '✗';
      console.log(
        `  ${icon} ${entry.sectorId}/${entry.subcategoriaId} — ${result.status}` +
          (result.summary ? ` (pass:${result.summary.pass} fail:${result.summary.fail} blockers:${result.summary.blockers})` : '') +
          (result.injectionMode ? ` [${result.injectionMode}]` : '') +
          (result.pipelineError ? ` ERR:${result.pipelineError}` : '')
      );
    }
  } finally {
    await session.close();
  }

  const { summary, failures, topFailures } = aggregateRenderResults(subResults);

  const payload = {
    meta: {
      agentVersion: '1.0.0-fase-c-smoke',
      phase: 'C',
      runId,
      gitCommit: gitCommitShort(),
      generatedAt: new Date().toISOString(),
      durationMs: Date.now() - t0,
      qaBase: session.baseUrl,
      defaultInjection: 'sessionStorage',
      smokeSubs: subs,
    },
    summary,
    topFailures,
    failures,
    subResults,
    subResultsDetailed: subResults,
  };

  writePhaseCReports(outBase, payload);

  console.log('\n=== QA Paridad Fase C — completado ===');
  console.log('Salida:', outBase);
  console.log('Screenshots:', shotsDir);
  console.log('Procesadas:', summary.processed, '/', summary.totalSubs);
  console.log('Subs PASS:', summary.subsPass, '| FAIL:', summary.subsFail);
  console.log('Presencia FAIL:', summary.presenceFail, '| Privacy DOM:', summary.privacyDomViolations);
  console.log('Bloqueadores:', summary.blockers);

  if (summary.subsFail > 0 || summary.blockers > 0) {
    process.exit(1);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error('[Fase C] Error fatal:', e);
  process.exit(2);
});
