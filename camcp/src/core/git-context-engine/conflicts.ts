import type { CamcpConfig } from '../../policy/permissions.js';
import { runGitAllowed } from '../../policy/command-guard.js';
import { loadGitWorktreeConfig } from './config-loader.js';
import type { ConflictRiskLevel, WorktreeEntry } from './types.js';

export interface ConflictAnalysis {
  conflictRisk: ConflictRiskLevel;
  pathIntersections: Array<{ worktreeA: string; worktreeB: string; paths: string[] }>;
}

function changedFilesAt(
  repoRoot: string,
  config: CamcpConfig,
  wtPath: string,
  baseRef: string
): string[] {
  const r = runGitAllowed(
    repoRoot,
    'diff',
    ['--name-only', `${baseRef}...HEAD`],
    config,
    { cwd: wtPath }
  );
  if (r.exitCode !== 0) return [];
  return r.stdout
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);
}

export function analyzeConflicts(
  repoRoot: string,
  config: CamcpConfig,
  worktrees: WorktreeEntry[],
  duplicateBranchGroups: Map<string, string[]>,
  baseRef: string,
  activeBehind: number,
  activeDirty: boolean
): ConflictAnalysis {
  const wtCfg = loadGitWorktreeConfig();
  let conflictRisk: ConflictRiskLevel = 'low';
  const pathIntersections: ConflictAnalysis['pathIntersections'] = [];

  for (const [, ids] of duplicateBranchGroups) {
    if (ids.length < 2) continue;
    const members = worktrees.filter((w) => ids.includes(w.id));
    const anyDirty = members.some((m) => m.dirty);
    const allDirty = members.length >= 2 && members.every((m) => m.dirty);
    if (allDirty) {
      conflictRisk = 'high';
    } else if (anyDirty) {
      conflictRisk = bumpRisk(conflictRisk, 'medium');
    }
  }

  if (wtCfg.conflicts.compareWorktrees && worktrees.length >= 2) {
    const fileMap = new Map<string, string[]>();
    for (const wt of worktrees) {
      if (!wt.dirty && wt.behind === 0) continue;
      const files = changedFilesAt(repoRoot, config, wt.path, baseRef);
      fileMap.set(wt.id, files);
    }
    const ids = [...fileMap.keys()];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i]!;
        const b = ids[j]!;
        const setA = new Set(fileMap.get(a));
        const overlap = (fileMap.get(b) ?? []).filter((f) => setA.has(f));
        if (overlap.length) {
          pathIntersections.push({ worktreeA: a, worktreeB: b, paths: overlap });
          conflictRisk = 'high';
        }
      }
    }
  }

  if (activeDirty && activeBehind > wtCfg.conflicts.behindDirtyThreshold) {
    conflictRisk = bumpRisk(conflictRisk, 'medium');
  }

  return { conflictRisk, pathIntersections };
}

export function duplicateBranchWorktreeIds(
  duplicateBranchGroups: Map<string, string[]>
): string[] {
  const out: string[] = [];
  for (const ids of duplicateBranchGroups.values()) {
    if (ids.length >= 2) out.push(...ids);
  }
  return [...new Set(out)];
}

function bumpRisk(current: ConflictRiskLevel, next: ConflictRiskLevel): ConflictRiskLevel {
  const order: ConflictRiskLevel[] = ['low', 'medium', 'high'];
  return order[Math.max(order.indexOf(current), order.indexOf(next))]!;
}

/** Pure heuristic for smoke/unit tests (G6). */
export function assessConflictRiskFromWorktrees(
  worktrees: Array<{ id: string; branch: string | null; dirty: boolean }>
): ConflictRiskLevel {
  const byBranch = new Map<string, typeof worktrees>();
  for (const wt of worktrees) {
    if (!wt.branch) continue;
    const list = byBranch.get(wt.branch) ?? [];
    list.push(wt);
    byBranch.set(wt.branch, list);
  }
  for (const members of byBranch.values()) {
    if (members.length >= 2 && members.every((m) => m.dirty)) return 'high';
    if (members.length >= 2 && members.some((m) => m.dirty)) return 'medium';
  }
  return 'low';
}
