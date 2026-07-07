import type { CamcpConfig } from '../policy/permissions.js';
import { loadIntelligenceConfig } from '../config/load-config.js';
import { cacheStatusSummary } from '../intelligence/cache/manager.js';
import { listDomains } from '../intelligence/domains.js';
import { loadGraph } from '../intelligence/graph/store.js';
import { analyzeImpact } from '../intelligence/impact/analyzer.js';
import { listIntelModules } from '../intelligence/modules/registry.js';
import { runIntelModule } from '../intelligence/modules/runner.js';
import { parseLastReport } from '../reports/parser.js';
import { aggregateImpactReport, writeCamcpReport } from '../reports/aggregator.js';
import { getMetaGitCommit } from '../utils/tool-result.js';

export function intelListDomains(repoRoot: string) {
  const intelConfig = loadIntelligenceConfig();
  return {
    count: listDomains(repoRoot, intelConfig).length,
    domains: listDomains(repoRoot, intelConfig),
    modules: listIntelModules(intelConfig),
  };
}

export function intelGraph(
  repoRoot: string,
  config: CamcpConfig,
  options: { refresh?: boolean } = {}
) {
  const intelConfig = loadIntelligenceConfig();
  const gitCommit = getMetaGitCommit(repoRoot, config);
  const { graph, fromCache, cachePath } = loadGraph(repoRoot, config, intelConfig, gitCommit, options);
  return { graph, fromCache, cachePath, gitCommit };
}

export function intelImpact(
  repoRoot: string,
  config: CamcpConfig,
  options: { base?: string; head?: string; paths?: string[] } = {}
) {
  const intelConfig = loadIntelligenceConfig();
  const gitCommit = getMetaGitCommit(repoRoot, config);
  const t0 = Date.now();
  const analysis = analyzeImpact(repoRoot, config, intelConfig, options);
  const report = aggregateImpactReport({
    analysis,
    gitCommit,
    durationMs: Date.now() - t0,
  });
  const reportPaths = writeCamcpReport(repoRoot, config, 'intel.impact', report);
  return { analysis, report, reportPaths };
}

export function intelRunModule(
  repoRoot: string,
  config: CamcpConfig,
  options: {
    moduleId: string;
    sector?: string;
    sub?: string;
    packId?: string;
    layer?: 'motor' | 'persist' | 'render' | 'cierre';
  }
) {
  const intelConfig = loadIntelligenceConfig();
  const gitCommit = getMetaGitCommit(repoRoot, config);
  return runIntelModule(repoRoot, config, intelConfig, options.moduleId, {
    sector: options.sector,
    sub: options.sub,
    packId: options.packId,
    layer: options.layer,
    gitCommit,
  });
}

export function intelCacheStatus(repoRoot: string, config: CamcpConfig) {
  const intelConfig = loadIntelligenceConfig();
  return cacheStatusSummary(repoRoot, config, intelConfig);
}

export function intelParseReport(repoRoot: string, config: CamcpConfig) {
  return parseLastReport(repoRoot, config);
}
