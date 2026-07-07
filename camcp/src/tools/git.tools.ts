import path from 'node:path';
import type { CamcpConfig } from '../policy/permissions.js';
import { runGitAllowed } from '../policy/command-guard.js';
import { resolveRepoPath } from '../policy/path-guard.js';

export interface LogInput {
  n?: number;
  since?: string;
}

export interface DiffInput {
  base?: string;
  head?: string;
  stat?: boolean;
}

export interface ScopeCheckInput {
  allowedPaths: string[];
  base?: string;
}

function normalizeRel(p: string): string {
  return p.replace(/\\/g, '/').replace(/^\.\//, '');
}

export function gitStatus(repoRoot: string, config: CamcpConfig) {
  const porcelain = runGitAllowed(repoRoot, 'status', ['--porcelain', '-b'], config);
  const branchLine = porcelain.stdout.split('\n').find((l) => l.startsWith('##')) ?? '';
  const trackingMatch = branchLine.match(/^## ([^\s.]+)(?:\.\.\.([^ ]+))?(?: \[([^\]]+)\])?/);
  const branch = trackingMatch?.[1] ?? null;
  const tracking = trackingMatch?.[2] ?? null;
  const flags = trackingMatch?.[3] ?? '';

  const files = porcelain.stdout
    .split('\n')
    .filter((l) => l && !l.startsWith('##'))
    .map((line) => {
      const xy = line.slice(0, 2);
      const file = line.slice(3).trim();
      return { index: xy[0], worktree: xy[1], path: file };
    });

  const aheadMatch = flags.match(/ahead (\d+)/);
  const behindMatch = flags.match(/behind (\d+)/);

  return {
    branch,
    tracking,
    clean: files.length === 0,
    ahead: aheadMatch ? Number(aheadMatch[1]) : 0,
    behind: behindMatch ? Number(behindMatch[1]) : 0,
    files,
    rawPorcelain: porcelain.stdout.trim(),
    exitCode: porcelain.exitCode,
  };
}

export function gitLog(repoRoot: string, input: LogInput, config: CamcpConfig) {
  const n = Math.min(Math.max(input.n ?? 10, 1), 100);
  const args = ['--oneline', `-n${n}`, '--decorate'];
  if (input.since) args.push(`--since=${input.since}`);

  const result = runGitAllowed(repoRoot, 'log', args, config);
  const commits = result.stdout
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^([0-9a-f]+)\s+(.+)$/);
      return m ? { hash: m[1], subject: m[2] } : { hash: '', subject: line };
    });

  return { commits, count: commits.length, exitCode: result.exitCode };
}

export function gitDiff(repoRoot: string, input: DiffInput, config: CamcpConfig) {
  const base = input.base ?? 'origin/main';
  const head = input.head ?? 'HEAD';
  const range = `${base}...${head}`;
  const args = input.stat === false ? [range] : ['--stat', range];
  const result = runGitAllowed(repoRoot, 'diff', args, config);

  const files = result.stdout
    .split('\n')
    .filter((l) => l.includes('|'))
    .map((line) => {
      const m = line.match(/^\s*(.+?)\s+\|\s+(\d+)\s*([+-]+)?/);
      return m ? { path: m[1].trim(), changes: Number(m[2]) } : null;
    })
    .filter(Boolean);

  return {
    base,
    head,
    range,
    stat: input.stat !== false,
    output: result.stdout.trim(),
    files,
    exitCode: result.exitCode,
  };
}

export function gitBranch(repoRoot: string, config: CamcpConfig) {
  const current = runGitAllowed(repoRoot, 'branch', ['--show-current'], config);
  const vv = runGitAllowed(repoRoot, 'branch', ['-vv'], config);
  const branch = current.stdout.trim();
  const trackingLine = vv.stdout
    .split('\n')
    .find((l) => l.startsWith('*')) ?? '';
  const remoteMatch = trackingLine.match(/\[([^:\]]+)(?::[^\]]+)?\]/);

  return {
    current: branch || null,
    remote: remoteMatch?.[1] ?? null,
    raw: vv.stdout.trim(),
    exitCode: current.exitCode,
  };
}

export function gitScopeCheck(repoRoot: string, input: ScopeCheckInput, config: CamcpConfig) {
  if (!Array.isArray(input.allowedPaths) || input.allowedPaths.length === 0) {
    return {
      inScope: true,
      violations: [],
      changedFiles: [],
      message: 'No allowedPaths provided; nothing to validate',
    };
  }

  const base = input.base ?? 'origin/main';
  const diff = runGitAllowed(repoRoot, 'diff', ['--name-only', `${base}...HEAD`], config);
  const changedFiles = diff.stdout
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);

  const allowed = input.allowedPaths.map(normalizeRel);
  const violations: Array<{ path: string; reason: string }> = [];

  for (const file of changedFiles) {
    const rel = normalizeRel(file);
    const ok = allowed.some((prefix) => {
      const p = prefix.endsWith('/') ? prefix : `${prefix}/`;
      return rel === prefix.replace(/\/$/, '') || rel.startsWith(p);
    });
    if (!ok) {
      violations.push({
        path: rel,
        reason: `Outside allowed scope: ${allowed.join(', ')}`,
      });
    }
  }

  return {
    inScope: violations.length === 0,
    violations,
    changedFiles,
    base,
    exitCode: diff.exitCode,
  };
}

export function gitResolvePath(repoRoot: string, p: string): string {
  return resolveRepoPath(repoRoot, p);
}
