import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from './permissions.js';

export class PathGuardError extends Error {
  code = 'PATH_GUARD';
  constructor(message: string) {
    super(message);
    this.name = 'PathGuardError';
  }
}

function normalizeSlashes(p: string): string {
  return p.replace(/\\/g, '/');
}

function pathExists(target: string): boolean {
  try {
    fs.lstatSync(target);
    return true;
  } catch {
    return false;
  }
}

function realpathSafe(target: string): string {
  try {
    if (typeof fs.realpathSync.native === 'function') {
      return fs.realpathSync.native(target);
    }
    return fs.realpathSync(target);
  } catch {
    return path.resolve(target);
  }
}

function assertInsideRepoRoot(rootReal: string, targetReal: string, inputPath: string): string {
  const rel = path.relative(rootReal, targetReal);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new PathGuardError(`Path escapes repo root: ${inputPath}`);
  }
  return targetReal;
}

/** Resolve symlinks/junctions on existing prefixes (handles non-existent tail paths). */
function resolveExistingRealPath(root: string, target: string): string {
  let probe = path.resolve(target);
  const tail: string[] = [];

  while (!pathExists(probe)) {
    const base = path.basename(probe);
    if (base) tail.unshift(base);
    const parent = path.dirname(probe);
    if (parent === probe) break;
    probe = parent;
  }

  let resolved = pathExists(probe) ? realpathSafe(probe) : path.resolve(probe);

  for (const segment of tail) {
    resolved = path.join(resolved, segment);
    if (pathExists(resolved)) {
      resolved = realpathSafe(resolved);
    }
  }

  if (pathExists(resolved)) {
    resolved = realpathSafe(resolved);
  }

  return resolved;
}

export function resolveRepoPath(repoRoot: string, inputPath: string): string {
  const root = path.resolve(repoRoot);
  const rootReal = realpathSafe(root);

  const target = path.isAbsolute(inputPath)
    ? path.resolve(inputPath)
    : path.resolve(root, inputPath);

  const targetReal = resolveExistingRealPath(root, target);
  return assertInsideRepoRoot(rootReal, targetReal, inputPath);
}

export function assertReadPathAllowed(repoRoot: string, absolutePath: string): void {
  resolveRepoPath(repoRoot, absolutePath);
}

export function assertReportWritePathAllowed(
  repoRoot: string,
  absolutePath: string,
  config: CamcpConfig
): void {
  const rootReal = realpathSafe(path.resolve(repoRoot));
  const resolved = resolveRepoPath(repoRoot, absolutePath);
  const rel = normalizeSlashes(path.relative(rootReal, resolved));
  const reportsPrefix = normalizeSlashes(config.reportsDir.replace(/^\.\//, '').replace(/\/$/, ''));

  if (rel !== reportsPrefix && !rel.startsWith(`${reportsPrefix}/`)) {
    throw new PathGuardError(`Report writes limited to ${reportsPrefix}/: ${rel}`);
  }

  for (const denied of config.denyWritePaths) {
    const d = normalizeSlashes(denied.replace(/^\.\//, ''));
    if (rel === d || rel.startsWith(d.endsWith('/') ? d : `${d}/`)) {
      throw new PathGuardError(`Write denied to protected path: ${rel}`);
    }
  }
}

export function assertWritePathAllowed(
  repoRoot: string,
  absolutePath: string,
  config: CamcpConfig
): void {
  assertReportWritePathAllowed(repoRoot, absolutePath, config);
}

export function isUnderRepo(repoRoot: string, absolutePath: string): boolean {
  try {
    resolveRepoPath(repoRoot, absolutePath);
    return true;
  } catch {
    return false;
  }
}
