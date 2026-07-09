import type { CamcpConfig } from '../../policy/permissions.js';
import { runGitAllowed } from '../../policy/command-guard.js';
import { gitDiff, gitStatus } from '../../tools/git.tools.js';
import { loadGitWorktreeConfig } from './config-loader.js';
import type {
  ActiveWorktree,
  DiffSummary,
  GitWorktreeInput,
  WorktreeEntry,
} from './types.js';
import {
  normalizePath,
  parseWorktreePorcelain,
  worktreeIdFromPath,
} from './worktree-list.js';

export interface StateBuildResult {
  repoRoot: string;
  primaryPath: string;
  worktrees: WorktreeEntry[];
  activeWorktree: ActiveWorktree;
  repoReadable: boolean;
  worktreesEnumerated: boolean;
  branchTrackingValid: boolean;
  dirtyStateKnown: boolean;
  duplicateBranchGroups: Map<string, string[]>;
  rawWorktreeList: string;
}

function countPorcelainFiles(
  porcelain: string,
  includeUntracked: boolean
): { modified: number; untracked: number; dirty: boolean } {
  let modified = 0;
  let untracked = 0;
  for (const line of porcelain.split('\n')) {
    if (!line || line.startsWith('##')) continue;
    const index = line[0] ?? ' ';
    const worktree = line[1] ?? ' ';
    if (index === '?' && worktree === '?') {
      if (includeUntracked) untracked++;
      continue;
    }
    if (index !== ' ' || worktree !== ' ') modified++;
  }
  return {
    modified,
    untracked,
    dirty: modified > 0 || (includeUntracked && untracked > 0),
  };
}

function statusAtPath(
  repoRoot: string,
  wtPath: string,
  config: CamcpConfig,
  includeUntracked: boolean
) {
  const r = runGitAllowed(repoRoot, 'status', ['--porcelain', '-b'], config, { cwd: wtPath });
  const counts = countPorcelainFiles(r.stdout, includeUntracked);
  const branchLine = r.stdout.split('\n').find((l) => l.startsWith('##')) ?? '';
  const branchMatch = branchLine.match(/^## ([^\s.]+)/);
  const flags = branchLine.match(/\[([^\]]+)\]/)?.[1] ?? '';
  const aheadMatch = flags.match(/ahead (\d+)/);
  const behindMatch = flags.match(/behind (\d+)/);
  return {
    exitCode: r.exitCode,
    branch: branchMatch?.[1] ?? null,
    ahead: aheadMatch ? Number(aheadMatch[1]) : 0,
    behind: behindMatch ? Number(behindMatch[1]) : 0,
    ...counts,
    raw: r.stdout,
  };
}

function headAtPath(
  repoRoot: string,
  wtPath: string,
  config: CamcpConfig
): { full: string | null; short: string | null } {
  const full = runGitAllowed(repoRoot, 'rev-parse', ['HEAD'], config, { cwd: wtPath });
  if (full.exitCode !== 0) return { full: null, short: null };
  const sha = full.stdout.trim();
  const short = runGitAllowed(repoRoot, 'rev-parse', ['--short', 'HEAD'], config, { cwd: wtPath });
  return { full: sha || null, short: short.stdout.trim() || sha.slice(0, 7) };
}

function lastCommitDateAtPath(
  repoRoot: string,
  wtPath: string,
  config: CamcpConfig
): string | null {
  const r = runGitAllowed(repoRoot, 'log', ['-1', '--format=%cI'], config, { cwd: wtPath });
  if (r.exitCode !== 0) return null;
  return r.stdout.trim() || null;
}

function aheadBehindVsBase(
  repoRoot: string,
  wtPath: string,
  baseRef: string,
  config: CamcpConfig
): { ahead: number; behind: number } {
  const r = runGitAllowed(
    repoRoot,
    'rev-list',
    ['--left-right', '--count', `${baseRef}...HEAD`],
    config,
    { cwd: wtPath }
  );
  if (r.exitCode !== 0) return { ahead: 0, behind: 0 };
  const parts = r.stdout.trim().split(/\s+/);
  if (parts.length < 2) return { ahead: 0, behind: 0 };
  return { ahead: Number(parts[1]) || 0, behind: Number(parts[0]) || 0 };
}

export function buildGitState(
  repoRoot: string,
  config: CamcpConfig,
  input: GitWorktreeInput
): StateBuildResult {
  const wtCfg = loadGitWorktreeConfig();
  const baseRef = input.git?.baseRef ?? wtCfg.defaults.baseRef;
  const includeUntracked = input.git?.includeUntracked ?? wtCfg.defaults.includeUntracked;
  const targetPath = input.worktreePath ?? repoRoot;

  const top = runGitAllowed(repoRoot, 'rev-parse', ['--show-toplevel'], config);
  const repoReadable = top.exitCode === 0;
  const primaryPath = repoReadable ? normalizePath(top.stdout.trim()) : normalizePath(repoRoot);

  let worktreesEnumerated = false;
  let rawWorktreeList = '';
  const parsed: ReturnType<typeof parseWorktreePorcelain> = [];

  if (repoReadable) {
    const list = runGitAllowed(repoRoot, 'worktree', ['list', '--porcelain'], config);
    rawWorktreeList = list.stdout;
    worktreesEnumerated = list.exitCode === 0;
    if (worktreesEnumerated) {
      parsed.push(...parseWorktreePorcelain(list.stdout));
    }
  }

  if (!parsed.length && repoReadable) {
    parsed.push({
      path: primaryPath,
      head: headAtPath(repoRoot, primaryPath, config).full,
      branch: gitStatus(repoRoot, config).branch,
      bare: false,
      detached: false,
      locked: false,
      lockedReason: null,
      prunable: false,
      prunableReason: null,
    });
  }

  const worktrees: WorktreeEntry[] = [];
  let branchTrackingValid = true;
  let dirtyStateKnown = true;

  for (const wt of parsed) {
    const wtPath = normalizePath(wt.path);
    const id = worktreeIdFromPath(wtPath, primaryPath);
    const st = statusAtPath(repoRoot, wtPath, config, includeUntracked);
    if (st.exitCode !== 0) dirtyStateKnown = false;
    const head = headAtPath(repoRoot, wtPath, config);
    const ab = aheadBehindVsBase(repoRoot, wtPath, baseRef, config);
    const branch = wt.branch ?? (wt.detached ? null : st.branch);
    if (branch == null && !wt.detached) branchTrackingValid = false;

    worktrees.push({
      id,
      path: wtPath,
      isPrimary: wtPath === primaryPath,
      branch,
      headCommit: head.full ?? wt.head,
      headShort: head.short,
      dirty: st.dirty,
      untrackedCount: st.untracked,
      modifiedCount: st.modified,
      ahead: ab.ahead,
      behind: ab.behind,
      locked: wt.locked,
      prunable: wt.prunable,
      detached: wt.detached,
      lastCommitDate: lastCommitDateAtPath(repoRoot, wtPath, config),
    });
  }

  const duplicateBranchGroups = new Map<string, string[]>();
  for (const wt of worktrees) {
    if (!wt.branch) continue;
    const ids = duplicateBranchGroups.get(wt.branch) ?? [];
    ids.push(wt.id);
    duplicateBranchGroups.set(wt.branch, ids);
  }

  const activeCandidate =
    worktrees.find((w) => normalizePath(w.path) === normalizePath(targetPath)) ??
    worktrees.find((w) => w.isPrimary) ??
    worktrees[0];

  let mergeBase: string | null = null;
  if (activeCandidate && repoReadable) {
    const mb = runGitAllowed(
      repoRoot,
      'merge-base',
      [baseRef, 'HEAD'],
      config,
      { cwd: activeCandidate.path }
    );
    mergeBase = mb.exitCode === 0 ? mb.stdout.trim() || null : null;
  }

  const activeWorktree: ActiveWorktree = activeCandidate
    ? {
        ...activeCandidate,
        baseRef,
        mergeBase,
      }
    : {
        id: 'wt-primary',
        path: normalizePath(targetPath),
        isPrimary: true,
        branch: null,
        headCommit: null,
        headShort: null,
        dirty: false,
        untrackedCount: 0,
        modifiedCount: 0,
        ahead: 0,
        behind: 0,
        locked: false,
        prunable: false,
        detached: false,
        baseRef,
        mergeBase: null,
      };

  return {
    repoRoot: primaryPath,
    primaryPath,
    worktrees,
    activeWorktree,
    repoReadable,
    worktreesEnumerated,
    branchTrackingValid,
    dirtyStateKnown,
    duplicateBranchGroups,
    rawWorktreeList,
  };
}

export function buildDiffSummary(
  repoRoot: string,
  config: CamcpConfig,
  input: GitWorktreeInput,
  activePath: string
): { diff: DiffSummary | null; computed: boolean } {
  const wtCfg = loadGitWorktreeConfig();
  const baseRef = input.git?.baseRef ?? wtCfg.defaults.baseRef;
  const headRef = input.git?.headRef ?? wtCfg.defaults.headRef;
  const maxFiles = input.git?.maxChangedFiles ?? wtCfg.defaults.maxChangedFiles;

  const nameOnly = runGitAllowed(
    repoRoot,
    'diff',
    ['--name-status', `${baseRef}...${headRef}`],
    config,
    { cwd: activePath }
  );
  if (nameOnly.exitCode !== 0) {
    return { diff: null, computed: false };
  }

  const changedFiles = nameOnly.stdout
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const parts = l.split(/\s+/);
      return parts.length >= 2 ? parts[parts.length - 1]! : l;
    })
    .slice(0, maxFiles);

  const statDiff = gitDiff(
    repoRoot,
    { base: baseRef, head: headRef, stat: true },
    config
  );

  let insertions = 0;
  let deletions = 0;
  const summaryLine = statDiff.output.split('\n').find((l) => /files changed/.test(l));
  if (summaryLine) {
    const ins = summaryLine.match(/(\d+) insertion/);
    const del = summaryLine.match(/(\d+) deletion/);
    insertions = ins ? Number(ins[1]) : 0;
    deletions = del ? Number(del[1]) : 0;
  }

  return {
    diff: {
      baseRef,
      headRef,
      filesChanged: changedFiles.length,
      insertions,
      deletions,
      changedFiles,
    },
    computed: true,
  };
}
