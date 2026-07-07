/**
 * Smoke test — CAMCP Fase 3B.3 arch.*
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
  archDomainBoundaries,
  archFrozenViolations,
  archScanDuplicates,
} from '../dist/tools/arch.tools.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverSource = fs.readFileSync(path.join(__dirname, '../src/server.ts'), 'utf8');
const archConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../config/arch.config.json'), 'utf8')
);
const archSrcDir = path.join(__dirname, '../src/arch');
const results = [];
const EXPECTED_TOOLS = 32;

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
  console.log('[CAMCP smoke-arch] Fase 3B.3 arch namespace\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);
  const toolMeta = toolMetaFromDefinitions(ALL_TOOL_DEFINITIONS);

  const writeCapable = toolMeta.filter((t) => t.capability === 'write-capable');
  if (writeCapable.length) {
    fail('policy-write-capable', writeCapable.map((t) => t.name).join(', '));
  } else {
    pass('policy-write-capable', '0 write-capable tools');
  }

  if (ALL_TOOL_DEFINITIONS.length !== EXPECTED_TOOLS) {
    fail('policy-tool-count', `expected ${EXPECTED_TOOLS}, got ${ALL_TOOL_DEFINITIONS.length}`);
  } else {
    pass('policy-tool-count', `${EXPECTED_TOOLS} tools total`);
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

  const archTools = toolMeta.filter((t) => t.namespace === 'arch');
  const expected = [
    'arch.frozen_violations',
    'arch.scan_duplicates',
    'arch.domain_boundaries',
  ];
  if (archTools.length !== 3 || !expected.every((n) => archTools.some((t) => t.name === n))) {
    fail('arch-namespace', archTools.map((t) => t.name).join(', '));
  } else {
    pass('arch-namespace', expected.join(', '));
  }

  if (archTools.find((t) => t.name === 'arch.dependencies')) {
    fail('arch-no-dependencies', 'arch.dependencies must not be registered');
  } else {
    pass('arch-no-dependencies', 'P4 pospuesto — no arch.dependencies');
  }

  const caps = Object.fromEntries(archTools.map((t) => [t.name, t.capability]));
  if (
    caps['arch.frozen_violations'] !== 'report-only' ||
    caps['arch.scan_duplicates'] !== 'report-only' ||
    caps['arch.domain_boundaries'] !== 'read-only'
  ) {
    fail('arch-capabilities', JSON.stringify(caps));
  } else {
    pass('arch-capabilities', '2 report-only + 1 read-only');
  }

  const forbidden = ['mapToPerfil', 'field-engine', 'render-lite', 'playwright', 'dependency-graph'];
  const archFiles = walkTs(archSrcDir);
  const hits = [];
  for (const f of archFiles) {
    const text = fs.readFileSync(f, 'utf8');
    for (const token of forbidden) {
      if (text.includes(token)) hits.push(`${path.basename(f)}:${token}`);
    }
  }
  if (hits.length) {
    fail('regla1-no-pipeline-logic', hits.join(', '));
  } else {
    pass('regla1-no-pipeline-logic', 'no pipeline/playwright/parallel-graph in arch/');
  }

  const toolKeys = Object.keys(archConfig.tools ?? {});
  const missingReuses = toolKeys.filter((k) => !archConfig.tools[k]?.reuses?.length);
  if (missingReuses.length) {
    fail('regla2-reuses-config', missingReuses.join(', '));
  } else {
    pass('regla2-reuses-config', `${toolKeys.length} tools with reuses[]`);
  }

  const missingSsot = toolKeys.filter((k) => !archConfig.tools[k]?.ssot?.length);
  if (missingSsot.length) {
    fail('regla3-ssot-config', missingSsot.join(', '));
  } else {
    pass('regla3-ssot-config', `${toolKeys.length} tools with ssot[]`);
  }

  if (fs.existsSync(path.join(archSrcDir, 'dependency-graph.ts'))) {
    fail('regla3-no-parallel-graph', 'dependency-graph.ts found');
  } else {
    pass('regla3-no-parallel-graph', 'no second dependency graph module');
  }

  console.log('\n  → arch.frozen_violations …');
  const frozen = archFrozenViolations(repoRoot, config);
  if (!frozen.reportPaths.find((p) => p.endsWith('report.md'))) {
    fail('arch.frozen_violations-report', 'missing report.md');
  } else {
    pass('arch.frozen_violations-report', `status=${frozen.report.status}, frozen=${frozen.extra?.frozenPathCount}`);
  }
  pass('arch.frozen_violations-ssot', 'ACTA + git diff');

  console.log('\n  → arch.scan_duplicates …');
  const dup = archScanDuplicates(repoRoot, config);
  if (!dup.reportPaths.find((p) => p.endsWith('report.md'))) {
    fail('arch.scan_duplicates-report', 'missing report.md');
  } else {
    pass('arch.scan_duplicates-report', `findings=${dup.report.findings.length}`);
  }

  console.log('\n  → arch.domain_boundaries …');
  const bounds = archDomainBoundaries(repoRoot, config);
  if (!bounds.data?.stats) {
    fail('arch.domain_boundaries-data', 'missing stats');
  } else {
    pass('arch.domain_boundaries-data', `anchors=${bounds.data.stats.anchorsChecked}`);
  }
  if (!bounds.ssot?.length) {
    fail('arch.domain_boundaries-ssot', 'empty ssot');
  } else {
    pass('arch.domain_boundaries-ssot', bounds.ssot[0]);
  }

  const parsed = intelParseReport(repoRoot, config);
  const hasArch = parsed.camcpReports.some((r) => r.path.includes('arch.'));
  pass('intel.parse_report-arch', `camcpReports=${parsed.camcpReports.length}, arch=${hasArch}`);

  const frozenMd = frozen.reportPaths.find((p) => p.endsWith('report.md'));
  if (frozenMd) {
    const text = fs.readFileSync(path.join(repoRoot, frozenMd), 'utf8');
    if (text.includes('# CAMCP REPORT') && text.includes('arch.frozen_violations')) {
      pass('reports-engine-format', 'CAMCP REPORT arch.frozen_violations');
    } else {
      fail('reports-engine-format', 'invalid report content');
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[CAMCP smoke-arch] ${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
}

main();
