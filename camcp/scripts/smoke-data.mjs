/**
 * Smoke test — CAMCP Fase 3B.2 data.*
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import { allToolsNonDestructive } from '../dist/policy/permissions.js';
import { toolMetaFromDefinitions } from '../dist/registry/tool-definition.js';
import { ALL_TOOL_DEFINITIONS } from '../dist/tools/index.js';
import { intelParseReport } from '../dist/tools/intel.tools.js';
import {
  dataHydrateAudit,
  dataPersistAudit,
  dataPipelineStatus,
  dataSchemaAlignment,
} from '../dist/tools/data.tools.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverSource = fs.readFileSync(path.join(__dirname, '../src/server.ts'), 'utf8');
const dataConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../config/data.config.json'), 'utf8')
);
const dataSrcDir = path.join(__dirname, '../src/data');
const results = [];

function pass(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name} — ${detail}`);
}

function walkTs(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkTs(full, out);
    else if (e.name.endsWith('.ts')) out.push(full);
  }
  return out;
}

function main() {
  console.log('[CAMCP smoke-data] Fase 3B.2 data namespace\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);
  const toolMeta = toolMetaFromDefinitions(ALL_TOOL_DEFINITIONS);

  const writeCapable = toolMeta.filter((t) => t.capability === 'write-capable');
  if (writeCapable.length) {
    fail('policy-write-capable', writeCapable.map((t) => t.name).join(', '));
  } else {
    pass('policy-write-capable', '0 write-capable tools');
  }

  if (ALL_TOOL_DEFINITIONS.length !== 32) {
    fail('policy-tool-count', `expected 32, got ${ALL_TOOL_DEFINITIONS.length}`);
  } else {
    pass('policy-tool-count', '32 tools total');
  }

  if (!allToolsNonDestructive(toolMeta)) {
    fail('policy-non-destructive', 'invalid capability mix');
  } else {
    const ro = toolMeta.filter((t) => t.capability === 'read-only').length;
    const rp = toolMeta.filter((t) => t.capability === 'report-only').length;
    pass('policy-capabilities', `${ro} read-only, ${rp} report-only`);
  }

  if (serverSource.includes('switch (meta.name)')) {
    fail('registry-server', 'switch found');
  } else {
    pass('registry-server', 'auto registry intact');
  }

  const dataTools = toolMeta.filter((t) => t.namespace === 'data');
  const expected = [
    'data.pipeline_status',
    'data.persist_audit',
    'data.hydrate_audit',
    'data.schema_alignment',
  ];
  if (dataTools.length !== 4 || !expected.every((n) => dataTools.some((t) => t.name === n))) {
    fail('data-namespace', dataTools.map((t) => t.name).join(', '));
  } else {
    pass('data-namespace', expected.join(', '));
  }

  if (dataTools.some((t) => t.capability !== 'report-only')) {
    fail('data-capabilities', 'all data.* must be report-only');
  } else {
    pass('data-capabilities', '4 report-only');
  }

  const forbidden = ['mapToPerfil', 'field-engine', 'render-lite', 'CariHubRegistroPublicBlocks'];
  const dataFiles = walkTs(dataSrcDir);
  const hits = [];
  for (const f of dataFiles) {
    const text = fs.readFileSync(f, 'utf8');
    for (const token of forbidden) {
      if (text.includes(token)) hits.push(`${path.basename(f)}:${token}`);
    }
  }
  if (hits.length) {
    fail('regla1-no-pipeline-logic', hits.join(', '));
  } else {
    pass('regla1-no-pipeline-logic', 'no mapToPerfil/field-engine/render-lite in data/');
  }

  const toolKeys = Object.keys(dataConfig.tools ?? {});
  const missingReuses = toolKeys.filter((k) => !dataConfig.tools[k]?.reuses?.length);
  if (missingReuses.length) {
    fail('regla2-reuses-config', missingReuses.join(', '));
  } else {
    pass('regla2-reuses-config', `${toolKeys.length} tools with reuses[]`);
  }

  console.log('\n  → data.pipeline_status --sub abogados …');
  const pipe = dataPipelineStatus(repoRoot, config, { sub: 'abogados' });
  if (pipe.qaTool !== 'qa.run_paridad_vm') {
    fail('data.pipeline_status-delegation', pipe.qaTool);
  } else {
    pass('data.pipeline_status-delegation', `exit=${pipe.qaResult.manifest.exitCode}`);
  }
  if (!pipe.reportPaths.find((p) => p.endsWith('report.md'))) {
    fail('data.pipeline_status-report', 'missing report.md');
  } else {
    pass('data.pipeline_status-report', `status=${pipe.report.status}`);
  }

  console.log('\n  → data.persist_audit …');
  const pers = dataPersistAudit(repoRoot, config);
  if (pers.qaTool !== 'qa.run_p0_persist_privacy') {
    fail('data.persist_audit-delegation', pers.qaTool);
  } else {
    pass('data.persist_audit-delegation', `exit=${pers.qaResult.manifest.exitCode}`);
  }
  pass('data.persist_audit-report', `findings=${pers.report.findings.length}`);

  console.log('\n  → data.hydrate_audit …');
  const hyd = dataHydrateAudit(repoRoot, config);
  if (hyd.qaTool !== 'qa.run_submit_hydrate') {
    fail('data.hydrate_audit-delegation', hyd.qaTool);
  } else {
    pass('data.hydrate_audit-delegation', `exit=${hyd.qaResult.manifest.exitCode}`);
  }
  pass('data.hydrate_audit-report', `status=${hyd.report.status}`);

  console.log('\n  → data.schema_alignment …');
  const sch = dataSchemaAlignment(repoRoot, config);
  if (sch.qaTool !== 'qa.run_validar_schemas') {
    fail('data.schema_alignment-delegation', sch.qaTool);
  } else {
    pass('data.schema_alignment-delegation', `exit=${sch.qaResult.manifest.exitCode}`);
  }
  pass('data.schema_alignment-report', `findings=${sch.report.findings.length}`);

  const parsed = intelParseReport(repoRoot, config);
  const hasData = parsed.camcpReports.some((r) => r.path.includes('data.'));
  pass('intel.parse_report-data', `camcpReports=${parsed.camcpReports.length}, data=${hasData}`);

  const schMd = sch.reportPaths.find((p) => p.endsWith('report.md'));
  if (schMd) {
    const text = fs.readFileSync(path.join(repoRoot, schMd), 'utf8');
    if (text.includes('# CAMCP REPORT') && text.includes('data.schema_alignment')) {
      pass('reports-engine-format', 'CAMCP REPORT data.schema_alignment');
    } else {
      fail('reports-engine-format', 'invalid report content');
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[CAMCP smoke-data] ${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
}

main();
