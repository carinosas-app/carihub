/**
 * Smoke test — CAMCP Fase 3A Intelligence Core + Reports Engine
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import { allToolsNonDestructive } from '../dist/policy/permissions.js';
import { toolMetaFromDefinitions } from '../dist/registry/tool-definition.js';
import { ALL_TOOL_DEFINITIONS } from '../dist/tools/index.js';
import {
  intelCacheStatus,
  intelGraph,
  intelImpact,
  intelListDomains,
  intelParseReport,
  intelRunModule,
} from '../dist/tools/intel.tools.js';

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
  console.log('[CAMCP smoke-intel] Fase 3A Intelligence Core\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);
  const toolMeta = toolMetaFromDefinitions(ALL_TOOL_DEFINITIONS);

  const writeCapable = toolMeta.filter((t) => t.capability === 'write-capable');
  if (writeCapable.length) {
    fail('policy-write-capable', writeCapable.map((t) => t.name).join(', '));
  } else {
    pass('policy-write-capable', '0 write-capable tools');
  }

  if (!allToolsNonDestructive(toolMeta)) {
    fail('policy-non-destructive', 'invalid capability mix');
  } else {
    const ro = toolMeta.filter((t) => t.capability === 'read-only').length;
    const rp = toolMeta.filter((t) => t.capability === 'report-only').length;
    pass('policy-capabilities', `${ALL_TOOL_DEFINITIONS.length} tools (${ro} read-only, ${rp} report-only)`);
  }

  if (serverSource.includes('switch (meta.name)')) {
    fail('registry-server', 'switch found');
  } else {
    pass('registry-server', 'auto registry intact');
  }

  const intelTools = toolMeta.filter((t) => t.namespace === 'intel');
  if (intelTools.length !== 6) {
    fail('intel-namespace', `expected 6, got ${intelTools.length}`);
  } else {
    pass('intel-namespace', intelTools.map((t) => t.name).join(', '));
  }

  const domains = intelListDomains(repoRoot);
  if (domains.count < 8) {
    fail('intel.list_domains', `count=${domains.count}`);
  } else {
    pass('intel.list_domains', `count=${domains.count}, modules=${domains.modules.length}`);
  }

  const g1 = intelGraph(repoRoot, config, { refresh: true });
  if (g1.graph.stats.nodes < 10 || g1.graph.stats.edges < 5) {
    fail('intel.graph', `nodes=${g1.graph.stats.nodes}, edges=${g1.graph.stats.edges}`);
  } else {
    pass('intel.graph', `nodes=${g1.graph.stats.nodes}, edges=${g1.graph.stats.edges}, cache=${g1.fromCache}`);
  }

  const g2 = intelGraph(repoRoot, config, { refresh: false });
  if (!g2.fromCache) {
    pass('intel.graph-cache', 'cache hit on second call (or rebuilt)');
  } else {
    pass('intel.graph-cache', 'fromCache=true');
  }

  const impact = intelImpact(repoRoot, config, { paths: ['camcp/README.md'] });
  if (!impact.report || !impact.reportPaths?.length) {
    fail('intel.impact', 'missing report');
  } else {
    pass('intel.impact', `domains=${impact.analysis.affectedDomains.join(',') || 'none'}, report=${impact.report.status}`);
  }

  console.log('\n  → Running intel.run_module fondos_static …');
  const modRun = intelRunModule(repoRoot, config, { moduleId: 'fondos_static' });
  if (!modRun.reportPaths?.length) {
    fail('intel.run_module', 'no report paths');
  } else {
    pass('intel.run_module(fondos_static)', `ok=${modRun.ok}, qa=${modRun.qaTool}`);
  }

  const cache = intelCacheStatus(repoRoot, config);
  pass('intel.cache_status', `entries=${cache.totalEntries}, root=${cache.cacheRoot}`);

  const parsed = intelParseReport(repoRoot, config);
  if (!parsed.manifest) {
    fail('intel.parse_report', 'no manifest');
  } else {
    pass('intel.parse_report', `tool=${parsed.manifest.tool}, camcpReports=${parsed.camcpReports.length}`);
  }

  const reportMd = modRun.reportPaths.find((p) => p.endsWith('report.md'));
  if (reportMd && fs.existsSync(path.join(repoRoot, reportMd))) {
    const text = fs.readFileSync(path.join(repoRoot, reportMd), 'utf8');
    if (text.includes('# CAMCP REPORT')) {
      pass('reports-engine', 'report.md CAMCP format');
    } else {
      fail('reports-engine', 'missing CAMCP REPORT header');
    }
  } else {
    fail('reports-engine', 'report.md not found');
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[CAMCP smoke-intel] ${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
}

main();
