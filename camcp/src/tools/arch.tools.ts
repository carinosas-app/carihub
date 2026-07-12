import type { CamcpConfig } from '../policy/permissions.js';
import { getMetaGitCommit } from '../utils/tool-result.js';
import {
  runArchDomainBoundaries,
  runArchFrozenViolations,
  runArchScanDuplicates,
} from '../arch/runner.js';
import { runArchReview } from '../arch-review/runner.js';
import type { ArchReviewInput } from '../core/arch-review-engine/types.js';

export function archFrozenViolations(
  repoRoot: string,
  config: CamcpConfig,
  opts: { base?: string; head?: string; includeCamcpFrozen?: boolean } = {}
) {
  return runArchFrozenViolations(repoRoot, config, {
    ...opts,
    gitCommit: getMetaGitCommit(repoRoot, config),
  });
}

export function archScanDuplicates(
  repoRoot: string,
  config: CamcpConfig,
  opts: { scope?: string[]; minSimilarity?: number } = {}
) {
  return runArchScanDuplicates(repoRoot, config, {
    ...opts,
    gitCommit: getMetaGitCommit(repoRoot, config),
  });
}

export function archDomainBoundaries(
  repoRoot: string,
  config: CamcpConfig,
  opts: { domain?: string } = {}
) {
  return runArchDomainBoundaries(repoRoot, config, opts);
}

export function archReview(repoRoot: string, config: CamcpConfig, input: ArchReviewInput = {}) {
  return runArchReview(repoRoot, config, input);
}

export type { ArchReviewInput };
