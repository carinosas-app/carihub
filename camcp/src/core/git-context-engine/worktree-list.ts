import path from 'node:path';

export interface ParsedWorktree {
  path: string;
  head: string | null;
  branch: string | null;
  bare: boolean;
  detached: boolean;
  locked: boolean;
  lockedReason: string | null;
  prunable: boolean;
  prunableReason: string | null;
}

export function parseWorktreePorcelain(raw: string): ParsedWorktree[] {
  const entries: ParsedWorktree[] = [];
  let current: ParsedWorktree | null = null;

  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;

    if (line.startsWith('worktree ')) {
      if (current) entries.push(current);
      current = {
        path: line.slice('worktree '.length).trim(),
        head: null,
        branch: null,
        bare: false,
        detached: false,
        locked: false,
        lockedReason: null,
        prunable: false,
        prunableReason: null,
      };
      continue;
    }

    if (!current) continue;

    if (line.startsWith('HEAD ')) {
      current.head = line.slice('HEAD '.length).trim();
    } else if (line.startsWith('branch ')) {
      const ref = line.slice('branch '.length).trim();
      current.branch = ref.startsWith('refs/heads/')
        ? ref.slice('refs/heads/'.length)
        : ref;
    } else if (line === 'bare') {
      current.bare = true;
    } else if (line === 'detached') {
      current.detached = true;
    } else if (line.startsWith('locked')) {
      current.locked = true;
      current.lockedReason = line.slice('locked'.length).trim() || null;
    } else if (line.startsWith('prunable')) {
      current.prunable = true;
      current.prunableReason = line.slice('prunable'.length).trim() || null;
    }
  }

  if (current) entries.push(current);
  return entries;
}

export function worktreeIdFromPath(wtPath: string, primaryPath: string): string {
  const norm = (p: string) => path.resolve(p).replace(/\\/g, '/').toLowerCase();
  if (norm(wtPath) === norm(primaryPath)) return 'wt-primary';
  const base = path.basename(wtPath).replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 40);
  return base ? `wt-${base}` : 'wt-unknown';
}

export function normalizePath(p: string): string {
  return path.resolve(p).replace(/\\/g, '/');
}
