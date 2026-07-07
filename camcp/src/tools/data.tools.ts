import type { CamcpConfig } from '../policy/permissions.js';
import { getMetaGitCommit } from '../utils/tool-result.js';
import {
  runDataHydrateAudit,
  runDataPersistAudit,
  runDataPipelineStatus,
  runDataSchemaAlignment,
} from '../data/runner.js';

export function dataPipelineStatus(
  repoRoot: string,
  config: CamcpConfig,
  opts: { sector?: string; sub?: string; maxSubs?: number; failFast?: boolean } = {}
) {
  return runDataPipelineStatus(repoRoot, config, {
    ...opts,
    gitCommit: getMetaGitCommit(repoRoot, config),
  });
}

export function dataPersistAudit(repoRoot: string, config: CamcpConfig) {
  return runDataPersistAudit(repoRoot, config, {
    gitCommit: getMetaGitCommit(repoRoot, config),
  });
}

export function dataHydrateAudit(repoRoot: string, config: CamcpConfig) {
  return runDataHydrateAudit(repoRoot, config, {
    gitCommit: getMetaGitCommit(repoRoot, config),
  });
}

export function dataSchemaAlignment(repoRoot: string, config: CamcpConfig) {
  return runDataSchemaAlignment(repoRoot, config, {
    gitCommit: getMetaGitCommit(repoRoot, config),
  });
}
