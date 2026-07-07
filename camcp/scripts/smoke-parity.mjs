/**
 * Smoke test — CAMCP Fase 3B.1 parity.*
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
  parityRenderStrict,
  parityStatic,
  parityVm,
} from '../dist/tools/parity.tools.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverSource = fs.readFileSync(path.join(__dirname, '../src/server.ts'), 'utf8');
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
  console.log('[CAMCP smoke-parity] Fase 3B.1 parity namespace\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);
  const toolMeta = toolMetaFromDefinitions(ALL_TOOL_DEFINITIONS);

  const writeCapable = toolMeta.filter((t) => t.capability === 'write-capable');
  if (writeCapable.length) {
    fail('policy-write-capable', writeCapable.map((t) => t.name).join(', '));
  } else {
    pass('policy-write-capable', '0 write-capable tools');
  }

  if (ALL_TOOL_DEFINITIONS.length !== 25) {
    fail('policy-tool-count', `expected 25, got ${ALL_TOOL_DEFINITIONS.length}`);
  } else {
    pass('policy-tool-count', '25 tools total');
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

  const parityTools = toolMeta.filter((t) => t.namespace === 'parity');
  const expected = ['parity.static', 'parity.vm', 'parity.render_strict'];
  if (parityTools.length !== 3 || !expected.every((n) => parityTools.some((t) => t.name === n))) {
    fail('parity-namespace', parityTools.map((t) => t.name).join(', '));
  } else {
    pass('parity-namespace', expected.join(', '));
  }

  if (parityTools.some((t) => t.capability !== 'report-only')) {
    fail('parity-capabilities', 'all parity.* must be report-only');
  } else {
    pass('parity-capabilities', '3 report-only');
  }

  console.log('\n  → parity.static --sub abogados …');
  const st = parityStatic(repoRoot, config, { sub: 'abogados' });
  if (!st.qaTool || st.qaTool !== 'qa.run_paridad_static') {
    fail('parity.static-delegation', `qaTool=${st.qaTool}`);
  } else {
    pass('parity.static-delegation', `qa=${st.qaTool}, exit=${st.qaResult.manifest.exitCode}`);
  }
  const stMd = st.reportPaths.find((p) => p.endsWith('report.md'));
  if (!stMd || !fs.existsSync(path.join(repoRoot, stMd))) {
    fail('parity.static-report', 'missing report.md');
  } else {
    const text = fs.readFileSync(path.join(repoRoot, stMd), 'utf8');
    if (text.includes('# CAMCP REPORT')) {
      pass('parity.static-report', `status=${st.report.status}, findings=${st.report.findings.length}`);
    } else {
      fail('parity.static-report', 'invalid CAMCP REPORT');
    }
  }

  console.log('\n  → parity.vm --sub abogados …');
  const vm = parityVm(repoRoot, config, { sub: 'abogados' });
  if (vm.qaTool !== 'qa.run_paridad_vm') {
    fail('parity.vm-delegation', vm.qaTool);
  } else {
    pass('parity.vm-delegation', `exit=${vm.qaResult.manifest.exitCode}, report=${vm.report.status}`);
  }
  if (!vm.reportPaths.length) {
    fail('parity.vm-report', 'no report paths');
  } else {
    pass('parity.vm-report', `findings=${vm.report.findings.length}`);
  }

  console.log('\n  → parity.render_strict --sub abogados …');
  const ren = parityRenderStrict(repoRoot, config, { sub: 'abogados' });
  if (ren.qaTool !== 'qa.run_paridad_render_strict') {
    fail('parity.render_strict-delegation', ren.qaTool);
  } else {
    const args = ren.qaResult.manifest.args.join(' ');
    if (!args.includes('--strict')) {
      fail('parity.render_strict-strict-flag', args);
    } else {
      pass('parity.render_strict-delegation', `exit=${ren.qaResult.manifest.exitCode}, strict=true`);
    }
  }
  if (!ren.reportPaths.find((p) => p.endsWith('report.md'))) {
    fail('parity.render_strict-report', 'missing report.md');
  } else {
    pass('parity.render_strict-report', `status=${ren.report.status}`);
  }

  const parsed = intelParseReport(repoRoot, config);
  if (!parsed.camcpReports.length) {
    fail('intel.parse_report-parity', 'no camcpReports');
  } else {
    const hasParity = parsed.camcpReports.some((r) => r.path.includes('parity.'));
    pass('intel.parse_report-parity', `camcpReports=${parsed.camcpReports.length}, parity=${hasParity}`);
  }

  const renMd = ren.reportPaths.find((p) => p.endsWith('report.md'));
  if (renMd) {
    const text = fs.readFileSync(path.join(repoRoot, renMd), 'utf8');
    if (text.includes('# CAMCP REPORT') && text.includes('parity.render_strict')) {
      pass('reports-engine-format', 'CAMCP REPORT parity.render_strict');
    } else {
      fail('reports-engine-format', 'invalid report content');
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[CAMCP smoke-parity] ${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
}

main();
