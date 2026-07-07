import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import type { CamcpConfig } from '../policy/permissions.js';
import { resolveRepoPath, PathGuardError } from '../policy/path-guard.js';

export interface ListInput {
  path?: string;
  glob?: string;
}

export interface ReadInput {
  path: string;
  offset?: number;
  limit?: number;
}

export interface SearchInput {
  pattern: string;
  path?: string;
  glob?: string;
}

export interface TreeInput {
  path?: string;
  depth?: number;
}

function safeStat(fullPath: string): fs.Stats | null {
  try {
    return fs.statSync(fullPath);
  } catch {
    return null;
  }
}

function matchesGlob(name: string, glob?: string): boolean {
  if (!glob) return true;
  const re = new RegExp(
    '^' +
      glob
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*/g, '§§')
        .replace(/\*/g, '[^/\\\\]*')
        .replace(/§§/g, '.*') +
      '$',
    'i'
  );
  return re.test(name.replace(/\\/g, '/'));
}

export function filesystemList(repoRoot: string, input: ListInput, config: CamcpConfig) {
  const rel = input.path ?? '.';
  const dir = resolveRepoPath(repoRoot, rel);
  const st = safeStat(dir);
  if (!st || !st.isDirectory()) {
    throw new PathGuardError(`Not a directory: ${rel}`);
  }

  const names = fs.readdirSync(dir);
  const entries = names
    .filter((name) => matchesGlob(name, input.glob))
    .slice(0, config.filesystemMaxListEntries)
    .map((name) => {
      const full = path.join(dir, name);
      const s = safeStat(full);
      return {
        name,
        path: path.relative(repoRoot, full).replace(/\\/g, '/'),
        type: s?.isDirectory() ? 'directory' : s?.isFile() ? 'file' : 'other',
        size: s?.isFile() ? s.size : undefined,
      };
    });

  return { path: path.relative(repoRoot, dir).replace(/\\/g, '/') || '.', entries, count: entries.length };
}

export function filesystemRead(repoRoot: string, input: ReadInput, config: CamcpConfig) {
  const full = resolveRepoPath(repoRoot, input.path);
  const st = safeStat(full);
  if (!st || !st.isFile()) {
    throw new PathGuardError(`Not a file: ${input.path}`);
  }
  if (st.size > config.filesystemMaxReadBytes) {
    throw new PathGuardError(
      `File exceeds max read size (${st.size} > ${config.filesystemMaxReadBytes}): ${input.path}`
    );
  }

  const content = fs.readFileSync(full, 'utf8');
  const lines = content.split(/\r?\n/);
  const offset = Math.max(0, input.offset ?? 0);
  const limit = input.limit ?? lines.length;
  const slice = lines.slice(offset, offset + limit).join('\n');
  const sha256 = createHash('sha256').update(content).digest('hex');

  return {
    path: path.relative(repoRoot, full).replace(/\\/g, '/'),
    content: slice,
    sha256,
    totalLines: lines.length,
    offset,
    returnedLines: Math.min(limit, Math.max(0, lines.length - offset)),
  };
}

export function filesystemSearch(repoRoot: string, input: SearchInput, config: CamcpConfig) {
  if (!input.pattern?.trim()) {
    throw new PathGuardError('Search pattern is required');
  }

  const searchPath = resolveRepoPath(repoRoot, input.path ?? '.');
  const args = ['--json', '--max-count', String(config.filesystemMaxSearchResults), input.pattern];
  if (input.glob) args.push('--glob', input.glob);
  args.push(searchPath);

  const result = spawnSync('rg', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    shell: false,
  });

  if (result.error && (result.error as NodeJS.ErrnoException).code === 'ENOENT') {
    return searchFallback(repoRoot, input, config);
  }

  const matches: Array<{ path: string; line: number; text: string }> = [];
  const stdout = result.stdout ?? '';
  for (const line of stdout.split('\n').filter(Boolean)) {
    try {
      const row = JSON.parse(line) as { type?: string; data?: { path?: { text?: string }; line_number?: number; lines?: { text?: string } } };
      if (row.type !== 'match' || !row.data?.path?.text) continue;
      const rel = path.relative(repoRoot, row.data.path.text).replace(/\\/g, '/');
      matches.push({
        path: rel,
        line: row.data.line_number ?? 0,
        text: (row.data.lines?.text ?? '').trimEnd(),
      });
    } catch {
      /* skip malformed rg line */
    }
  }

  return {
    pattern: input.pattern,
    matches,
    count: matches.length,
    truncated: matches.length >= config.filesystemMaxSearchResults,
    engine: 'rg',
  };
}

function searchFallback(repoRoot: string, input: SearchInput, config: CamcpConfig) {
  const root = resolveRepoPath(repoRoot, input.path ?? '.');
  const re = new RegExp(input.pattern, 'i');
  const matches: Array<{ path: string; line: number; text: string }> = [];

  function walk(dir: string, depth: number): void {
    if (matches.length >= config.filesystemMaxSearchResults || depth > 12) return;
    let entries: string[];
    try {
      entries = fs.readdirSync(dir);
    } catch {
      return;
    }
    for (const name of entries) {
      if (matches.length >= config.filesystemMaxSearchResults) break;
      if (name === 'node_modules' || name === '.git') continue;
      const full = path.join(dir, name);
      const st = safeStat(full);
      if (!st) continue;
      const relName = path.relative(root, full).replace(/\\/g, '/');
      if (st.isDirectory()) {
        walk(full, depth + 1);
      } else if (st.isFile() && matchesGlob(relName, input.glob)) {
        try {
          if (st.size > config.filesystemMaxReadBytes) continue;
          const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
          lines.forEach((text, idx) => {
            if (matches.length >= config.filesystemMaxSearchResults) return;
            if (re.test(text)) {
              matches.push({
                path: path.relative(repoRoot, full).replace(/\\/g, '/'),
                line: idx + 1,
                text,
              });
            }
          });
        } catch {
          /* skip binary/unreadable */
        }
      }
    }
  }

  const st = safeStat(root);
  if (st?.isDirectory()) walk(root, 0);
  else if (st?.isFile()) {
    const lines = fs.readFileSync(root, 'utf8').split(/\r?\n/);
    lines.forEach((text, idx) => {
      if (re.test(text)) {
        matches.push({
          path: path.relative(repoRoot, root).replace(/\\/g, '/'),
          line: idx + 1,
          text,
        });
      }
    });
  }

  return {
    pattern: input.pattern,
    matches,
    count: matches.length,
    truncated: matches.length >= config.filesystemMaxSearchResults,
    engine: 'fallback',
  };
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'directory' | 'file';
  children?: TreeNode[];
}

export function filesystemTree(repoRoot: string, input: TreeInput, config: CamcpConfig) {
  const rel = input.path ?? '.';
  const dir = resolveRepoPath(repoRoot, rel);
  const maxDepth = Math.min(input.depth ?? config.filesystemMaxTreeDepth, config.filesystemMaxTreeDepth);

  function build(current: string, depth: number): TreeNode {
    const name = path.basename(current) || '.';
    const relPath = path.relative(repoRoot, current).replace(/\\/g, '/') || '.';
    const st = safeStat(current);
    if (!st?.isDirectory()) {
      return { name, path: relPath, type: 'file' };
    }
    const node: TreeNode = { name, path: relPath, type: 'directory', children: [] };
    if (depth >= maxDepth) return node;
    let entries: string[];
    try {
      entries = fs.readdirSync(current).sort();
    } catch {
      return node;
    }
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git') continue;
      const full = path.join(current, entry);
      const s = safeStat(full);
      if (!s) continue;
      if (s.isDirectory()) {
        node.children!.push(build(full, depth + 1));
      } else if (s.isFile()) {
        node.children!.push({
          name: entry,
          path: path.relative(repoRoot, full).replace(/\\/g, '/'),
          type: 'file',
        });
      }
    }
    return node;
  }

  const st = safeStat(dir);
  if (!st) throw new PathGuardError(`Path not found: ${rel}`);

  return {
    root: build(dir, 0),
    maxDepth,
  };
}
