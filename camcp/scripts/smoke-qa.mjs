/**
 * QA namespace smoke — Fase 2 adapters (no script rewrites).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import { scanQaCatalog } from '../dist/qa/catalog.js';
import { qaListCatalog, qaParseLastReport, qaRunParidadRenderStrict, qaRunParidadVm } from '../dist/tools/qa.tools.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = loadConfig();
const repoRoot = resolveRepoRoot(config);
const results = [];

function pass(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name} — ${detail}`);
}

function assertUnderReports(relPath) {
  const norm = relPath.replace(/\\/g, '/');
  const prefix = config.reportsDir.replace(/\\/g, '/').replace(/\/$/, '');
  if (!norm.startsWith(prefix + '/')) {
    throw new Error(`Report outside ${prefix}: ${norm}`);
  }
}

async function main() {
  console.log('[CAMCP smoke-qa] Fase 2 QA namespace\n');

  const catalog = scanQaCatalog(repoRoot);
  if (catalog.length < 90) {
    fail('catalog-scan', `Expected ~94 scripts, got ${catalog.length}`);
  } else {
    pass('catalog-scan', `${catalog.length} scripts/qa-*.mjs detected`);
  }

  const listed = qaListCatalog(repoRoot);
  if (listed.total !== catalog.length) {
    fail('qa.list_catalog', `total mismatch ${listed.total} vs ${catalog.length}`);
  } else {
    pass('qa.list_catalog', `total=${listed.total}, paridad=${listed.paridad.length}, packs=${listed.packs.length}`);
  }

  const paridadStatic = catalog.find((e) => e.script === 'qa-paridad-reg-pub-static.mjs');
  const paridadVm = catalog.find((e) => e.script === 'qa-paridad-reg-pub-vm.mjs');
  const paridadRender = catalog.find((e) => e.script === 'qa-paridad-reg-pub-render.mjs');
  const fondos = catalog.find((e) => e.script === 'qa-fondos-static.mjs');
  if (paridadStatic && paridadVm && paridadRender && fondos) {
    pass('catalog-paridad-fondos', 'paridad static/vm/render + fondos present');
  } else {
    fail('catalog-paridad-fondos', 'missing core paridad/fondos entries');
  }

  // Example: qa.run_paridad_vm (abogados)
  console.log('\n  → Running qa.run_paridad_vm --sub abogados …');
  const vmRun = qaRunParidadVm(repoRoot, config, { sub: 'abogados' });
  assertUnderReports(vmRun.manifest.reportDir);
  pass(
    'qa.run_paridad_vm(abogados)',
    `exit=${vmRun.manifest.exitCode}, reports=${vmRun.reportFiles.length}, script=${vmRun.manifest.reusedScript}`
  );
  if (!vmRun.manifest.reusedScript.includes('qa-paridad-reg-pub-vm.mjs')) {
    fail('adapter-vm-script', vmRun.manifest.reusedScript);
  } else {
    pass('adapter-vm-script', 'reuses scripts/qa-paridad-reg-pub-vm.mjs');
  }

  // Example: qa.run_paridad_render_strict (abogados) — may fail QA but adapter must run
  console.log('\n  → Running qa.run_paridad_render_strict --sub abogados …');
  const renderRun = qaRunParidadRenderStrict(repoRoot, config, { sub: 'abogados' });
  assertUnderReports(renderRun.manifest.reportDir);
  pass(
    'qa.run_paridad_render_strict(abogados)',
    `exit=${renderRun.manifest.exitCode}, reports=${renderRun.reportFiles.length}, script=${renderRun.manifest.reusedScript}`
  );
  if (!renderRun.manifest.args.includes('--strict')) {
    fail('adapter-render-strict-flag', 'missing --strict in args');
  } else {
    pass('adapter-render-strict-flag', `--strict passed to ${renderRun.manifest.reusedScript}`);
  }

  const parsed = qaParseLastReport(repoRoot, config);
  if (!parsed.manifest) {
    fail('qa.parse_last_report', 'no manifest');
  } else {
    pass('qa.parse_last_report', `tool=${parsed.manifest.tool}, ok=${parsed.ok}`);
  }

  // Report structure sample
  const sampleDir = path.resolve(repoRoot, renderRun.manifest.reportDir);
  const sampleFiles = fs.existsSync(sampleDir) ? fs.readdirSync(sampleDir) : [];
  pass('report-structure', `${renderRun.manifest.reportDir}: ${sampleFiles.join(', ')}`);

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[CAMCP smoke-qa] ${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
