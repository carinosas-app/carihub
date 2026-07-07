import type { CamcpConfig } from '../policy/permissions.js';
import { getMetaGitCommit } from '../utils/tool-result.js';
import {
  runParityRenderStrict,
  runParityStatic,
  runParityVm,
} from '../parity/runner.js';

export function parityStatic(
  repoRoot: string,
  config: CamcpConfig,
  opts: { sector?: string; sub?: string } = {}
) {
  return runParityStatic(repoRoot, config, { ...opts, gitCommit: getMetaGitCommit(repoRoot, config) });
}

export function parityVm(
  repoRoot: string,
  config: CamcpConfig,
  opts: { sector?: string; sub?: string; maxSubs?: number; failFast?: boolean } = {}
) {
  return runParityVm(repoRoot, config, { ...opts, gitCommit: getMetaGitCommit(repoRoot, config) });
}

export function parityRenderStrict(
  repoRoot: string,
  config: CamcpConfig,
  opts: { sub?: string; compareWith?: string } = {}
) {
  return runParityRenderStrict(repoRoot, config, { ...opts, gitCommit: getMetaGitCommit(repoRoot, config) });
}
