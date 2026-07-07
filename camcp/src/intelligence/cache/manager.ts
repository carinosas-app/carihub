import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../../policy/permissions.js';
import { assertReportWritePathAllowed } from '../../policy/path-guard.js';
import { resolveReportsRoot } from '../../qa/report-runner.js';
import type { CacheEntryMeta, IntelligenceConfig } from '../types.js';

function cacheRoot(repoRoot: string, config: CamcpConfig): string {
  return path.join(resolveReportsRoot(repoRoot, config), '.cache');
}

export function listCacheEntries(
  repoRoot: string,
  config: CamcpConfig,
  intelConfig: IntelligenceConfig
): CacheEntryMeta[] {
  const root = cacheRoot(repoRoot, config);
  if (!fs.existsSync(root)) return [];

  const entries: CacheEntryMeta[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.json')) continue;
      const stat = fs.statSync(full);
      let gitCommit: string | null = null;
      try {
        const data = JSON.parse(fs.readFileSync(full, 'utf8')) as { gitCommit?: string };
        gitCommit = data.gitCommit ?? null;
      } catch {
        /* ignore */
      }
      const rel = path.relative(root, full).replace(/\\/g, '/');
      const createdAt = stat.birthtime.toISOString();
      const expiresAt = new Date(stat.mtimeMs + intelConfig.cacheTtlMs).toISOString();
      entries.push({
        key: rel.replace(/\.json$/, ''),
        path: path.relative(repoRoot, full).replace(/\\/g, '/'),
        createdAt,
        expiresAt,
        gitCommit,
        sizeBytes: stat.size,
      });
    }
  };
  walk(root);
  return entries.sort((a, b) => a.key.localeCompare(b.key));
}

export function readCache<T>(
  repoRoot: string,
  config: CamcpConfig,
  intelConfig: IntelligenceConfig,
  subdir: string,
  key: string
): T | null {
  const file = path.join(cacheRoot(repoRoot, config), subdir, `${key}.json`);
  if (!fs.existsSync(file)) return null;
  const stat = fs.statSync(file);
  if (Date.now() - stat.mtimeMs > intelConfig.cacheTtlMs) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
  } catch {
    return null;
  }
}

export function writeCache<T extends { gitCommit?: string | null }>(
  repoRoot: string,
  config: CamcpConfig,
  subdir: string,
  key: string,
  payload: T
): string {
  const dir = path.join(cacheRoot(repoRoot, config), subdir);
  assertReportWritePathAllowed(repoRoot, dir, config);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${key}.json`);
  assertReportWritePathAllowed(repoRoot, file, config);
  fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf8');
  return path.relative(repoRoot, file).replace(/\\/g, '/');
}

export function cacheStatusSummary(
  repoRoot: string,
  config: CamcpConfig,
  intelConfig: IntelligenceConfig
) {
  const entries = listCacheEntries(repoRoot, config, intelConfig);
  const now = Date.now();
  const expired = entries.filter((e) => new Date(e.expiresAt).getTime() < now);
  return {
    cacheRoot: path.relative(repoRoot, cacheRoot(repoRoot, config)).replace(/\\/g, '/'),
    ttlMs: intelConfig.cacheTtlMs,
    totalEntries: entries.length,
    expiredEntries: expired.length,
    entries,
  };
}
