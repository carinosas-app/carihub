/**
 * QA-PARIDAD-REG-PUB — Fase B: pipeline VM (map → build → slim → hydrate → PrivacyGuard).
 * node scripts/qa-paridad-reg-pub-vm.mjs [--sector salud] [--sub medicos-generales] [--out dir]
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

import { makePipelineCtx, REPO } from './qa-paridad-reg-pub/lib/vm-pipeline-context.mjs';
import { loadSchemaIndex, listSubcategorias } from './qa-paridad-reg-pub/lib/catalog-loader.mjs';
import { runSubPipeline, aggregateResults } from './qa-paridad-reg-pub/lib/pipeline-runner.mjs';
import { writePhaseBReports } from './qa-paridad-reg-pub/lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const out = {
    sector: null,
    sub: null,
    outDir: null,
    maxSubs: null,
    failFast: false,
  };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--sector' && argv[i + 1]) out.sector = argv[++i];
    else if (argv[i] === '--sub' && argv[i + 1]) out.sub = argv[++i];
    else if (argv[i] === '--out' && argv[i + 1]) out.outDir = argv[++i];
    else if (argv[i] === '--max-subs' && argv[i + 1]) out.maxSubs = parseInt(argv[++i], 10);
    else if (argv[i] === '--fail-fast') out.failFast = true;
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

function main() {
  const args = parseArgs(process.argv);
  const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outBase = args.outDir || path.join(REPO, 'agent-tools', 'qa-paridad-reports', runId);
  const t0 = Date.now();

  console.log('[Fase B] Cargando pipeline VM…');
  const { ctx, loadedScripts } = makePipelineCtx();

  const index = loadSchemaIndex(ctx);
  let schemaEntries = listSubcategorias(index, {
    sectorId: args.sector || undefined,
    subcategoriaId: args.sub || undefined,
  });

  if (args.maxSubs && schemaEntries.length > args.maxSubs) {
    schemaEntries = schemaEntries.slice(0, args.maxSubs);
  }

  console.log(`[Fase B] Pipeline en ${schemaEntries.length} subcategoría(s)…`);

  const subResults = [];
  for (const entry of schemaEntries) {
    const result = runSubPipeline({ ctx, schemaEntry: entry });
    subResults.push(result);

    const icon = result.status === 'pass' ? '✓' : result.status === 'skipped' ? '○' : '✗';
    console.log(
      `  ${icon} ${entry.sectorId}/${entry.subcategoriaId} — ${result.status}` +
        (result.summary ? ` (pass:${result.summary.pass} fail:${result.summary.fail} skip:${result.summary.skip})` : '') +
        (result.pipelineError ? ` ERR:${result.pipelineError}` : '')
    );

    if (args.failFast && result.status === 'fail') break;
  }

  const { summary, failures, topFailures } = aggregateResults(subResults);
  const blockers = failures.filter((f) => f.severity === 'bloqueador');

  const payload = {
    meta: {
      agentVersion: '1.0.0-fase-b',
      phase: 'B',
      runId,
      gitCommit: gitCommitShort(),
      generatedAt: new Date().toISOString(),
      durationMs: Date.now() - t0,
      loadedScripts,
      filters: { sector: args.sector, sub: args.sub, maxSubs: args.maxSubs },
    },
    summary,
    topFailures,
    failures,
    subResults,
    subResultsDetailed: subResults,
  };

  writePhaseBReports(outBase, payload);

  console.log('\n=== QA Paridad Fase B — completado ===');
  console.log('Salida:', outBase);
  console.log('Procesadas:', summary.processed, '/', summary.totalSubs);
  console.log('Subs PASS:', summary.subsPass, '| FAIL:', summary.subsFail);
  console.log('Field FAIL:', summary.fieldFail, '| Privacy:', summary.privacyViolations);
  console.log('Bloqueadores:', blockers.length);

  if (summary.subsFail > 0 || blockers.length > 0) {
    process.exit(1);
  }
  process.exit(0);
}

main();
