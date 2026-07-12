import type { CamcpConfig } from '../policy/permissions.js';
import { runContractGate } from '../core/contract-engine/gate.js';
import {
  evaluateInvalidation,
  explainInvalidation,
  listAllWatches,
  registryVersion,
  watchList,
} from '../core/invalidation-registry/index.js';
import type { CompletedCheck } from '../core/invalidation-registry/types.js';
import { getMetaGitCommit } from '../utils/tool-result.js';
import { gitStatus } from './git.tools.js';

export function invalidationWatchList() {
  return {
    registryVersion: registryVersion(),
    watches: watchList(),
    allWatches: listAllWatches(),
  };
}

export function invalidationExplain(checkId: string) {
  return explainInvalidation(checkId);
}

export function invalidationEvaluate(
  repoRoot: string,
  config: CamcpConfig,
  opts: {
    completedChecks?: CompletedCheck[];
    forceRefresh?: boolean;
    facadeId?: string;
    facet?: string;
  } = {}
) {
  const st = gitStatus(repoRoot, config);
  const commit = getMetaGitCommit(repoRoot, config);
  const gate = runContractGate({
    repoRoot,
    facadeId: opts.facadeId ?? 'catalog.audit',
    facet: opts.facet ?? 'summary',
  });
  const snapshots = gate.snapshots.map((s) => ({
    ssotId: s.ssotId,
    contentHash: s.contentHash,
    version: s.versionField ?? s.version ?? null,
    path: s.path,
  }));

  return evaluateInvalidation({
    repoRoot,
    currentSnapshots: snapshots,
    gitContext: { commit, branch: st.branch ?? null },
    completedChecks: opts.completedChecks ?? [],
    forceRefresh: opts.forceRefresh,
  });
}
