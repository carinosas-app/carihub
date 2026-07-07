import path from 'node:path';
import type { CamcpConfig } from '../../policy/permissions.js';
import type { IntelligenceConfig, IntelligenceGraph } from '../types.js';
import { readCache, writeCache } from '../cache/manager.js';
import { buildGraph } from './builder.js';

export function loadGraph(
  repoRoot: string,
  config: CamcpConfig,
  intelConfig: IntelligenceConfig,
  gitCommit: string | null,
  options: { refresh?: boolean } = {}
): { graph: IntelligenceGraph; fromCache: boolean; cachePath: string | null } {
  const cacheKey = gitCommit ?? 'unknown';
  const subdir = intelConfig.graphCacheSubdir.replace(/^\.cache\/?/, '').replace(/^cache\/?/, '') || 'graph';

  if (!options.refresh) {
    const cached = readCache<IntelligenceGraph>(repoRoot, config, intelConfig, subdir, cacheKey);
    if (cached) {
      return { graph: cached, fromCache: true, cachePath: null };
    }
  }

  const graph = buildGraph(repoRoot, intelConfig, gitCommit);
  const cachePath = writeCache(repoRoot, config, subdir, cacheKey, graph);
  return { graph, fromCache: false, cachePath };
}

export function graphCacheSubdir(intelConfig: IntelligenceConfig): string {
  return intelConfig.graphCacheSubdir.replace(/^\.cache\/?/, '').replace(/^cache\/?/, '') || 'graph';
}
