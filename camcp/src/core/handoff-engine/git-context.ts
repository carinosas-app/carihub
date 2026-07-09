import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../../policy/permissions.js';
import type { GitContextDocument, GitContextHealthDocument } from '../git-context-engine/types.js';
import { runGitWorktree } from '../../git-worktree/runner.js';
import {
  findLatestGitContextPath,
} from './report-loader.js';
import type { HandoffBriefGit } from './types.js';

function readJsonSafe<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

export interface ResolvedGitContext {
  git: HandoffBriefGit;
  gitContextPath: string | null;
  gitContextHealth: GitContextHealthDocument | null;
  prUnavailable: boolean;
  conflictRisk: GitContextDocument['risk']['conflictRisk'];
  staleWorktrees: boolean;
}

export function resolveGitContextForHandoff(
  repoRoot: string,
  config: CamcpConfig,
  input: { baseRef?: string; worktreePath?: string | null; gitContextPath?: string | null }
): ResolvedGitContext {
  let ctxPath = input.gitContextPath ?? findLatestGitContextPath(repoRoot, config);
  let doc: GitContextDocument | null = null;
  let health: GitContextHealthDocument | null = null;

  if (ctxPath) {
    const abs = path.resolve(repoRoot, ctxPath);
    doc = readJsonSafe<GitContextDocument>(abs);
    const healthAbs = path.join(path.dirname(abs), 'git-context-health.json');
    if (fs.existsSync(healthAbs)) {
      health = readJsonSafe<GitContextHealthDocument>(healthAbs);
    }
  }

  if (!doc) {
    const run = runGitWorktree(repoRoot, config, {
      facet: 'state',
      git: { baseRef: input.baseRef ?? 'main' },
      worktreePath: input.worktreePath ?? null,
    });
    doc = run.gitContext;
    health = run.gitContextHealth;
    ctxPath = run.gitContextPath;
  }

  const active = doc.activeWorktree;
  const checks = doc.pr.checks;
  const checksSummary =
    doc.pr.number != null || checks.total > 0
      ? {
          total: checks.total,
          pass: checks.pass,
          fail: checks.fail,
          pending: checks.pending,
        }
      : null;

  const git: HandoffBriefGit = {
    commit: active.headShort ?? active.headCommit ?? 'unknown',
    branch: active.branch ?? 'unknown',
    baseRef: active.baseRef ?? input.baseRef ?? 'main',
    ahead: active.ahead,
    behind: active.behind,
    dirty: active.dirty,
    changedFilesCount: doc.diffSummary?.filesChanged ?? 0,
    worktree: {
      id: active.id,
      path: active.path,
      isPrimary: active.isPrimary,
      linkedBranch: active.branch,
    },
    pr: {
      number: doc.pr.number,
      url: doc.pr.url,
      state: doc.pr.state,
      checksSummary,
    },
  };

  const prUnavailable = health != null && health.prStatusKnown === false;

  return {
    git,
    gitContextPath: ctxPath,
    gitContextHealth: health,
    prUnavailable,
    conflictRisk: doc.risk.conflictRisk,
    staleWorktrees: doc.risk.staleWorktrees.length > 0,
  };
}
