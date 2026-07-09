import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../../policy/permissions.js';
import { findLatestGitContextPath } from '../handoff-engine/report-loader.js';
import { isGitContextStale } from '../git-context-engine/handoff-mapper.js';
import type { GitContextDocument } from '../git-context-engine/types.js';
import { GIT_CONTEXT_SCHEMA_VERSION } from '../git-context-engine/types.js';
import { getMetaGitCommit } from '../../utils/tool-result.js';
import type { ArchReviewInput, GitContextRef } from './types.js';

export function loadGitContextRef(
  repoRoot: string,
  config: CamcpConfig,
  input: ArchReviewInput
): GitContextRef {
  const empty: GitContextRef = {
    path: null,
    headShort: null,
    baseRef: input.scope?.baseRef ?? 'origin/main',
    headRef: input.scope?.headRef ?? 'HEAD',
    filesChanged: 0,
    changedFiles: input.scope?.paths ?? [],
    stale: false,
  };

  const ctxPath = input.gitContext?.ref ?? findLatestGitContextPath(repoRoot, config);
  if (!ctxPath) return empty;

  const abs = path.resolve(repoRoot, ctxPath);
  if (!fs.existsSync(abs)) return empty;

  let doc: GitContextDocument;
  try {
    doc = JSON.parse(fs.readFileSync(abs, 'utf8')) as GitContextDocument;
  } catch {
    return empty;
  }

  if (doc.schemaVersion !== GIT_CONTEXT_SCHEMA_VERSION) return empty;

  const currentHead = getMetaGitCommit(repoRoot, config);
  const storedHead = doc.activeWorktree.headShort ?? doc.activeWorktree.headCommit;
  const stale = isGitContextStale(storedHead, currentHead);
  const diff = doc.diffSummary;
  const changedFiles =
    input.scope?.paths && input.scope.paths.length > 0
      ? input.scope.paths
      : (diff?.changedFiles ?? []);

  return {
    path: ctxPath,
    headShort: storedHead,
    baseRef: input.scope?.baseRef ?? diff?.baseRef ?? doc.activeWorktree.baseRef ?? 'origin/main',
    headRef: input.scope?.headRef ?? diff?.headRef ?? 'HEAD',
    filesChanged: changedFiles.length || (diff?.filesChanged ?? 0),
    changedFiles,
    stale,
  };
}
