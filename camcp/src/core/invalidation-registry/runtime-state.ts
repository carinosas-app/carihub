import fs from 'node:fs';
import path from 'node:path';
import { hashFileUtf8, sha256Utf8 } from '../contract-engine/hash.js';
import type { SnapshotRef, WatchRegistration } from './types.js';

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/');
}

export function hashGlobFiles(repoRoot: string, pathGlob: string): string | null {
  const norm = normalizePath(pathGlob);
  const dir = path.dirname(norm);
  const globFile = path.basename(norm);
  const base = path.resolve(repoRoot, dir);
  if (!fs.existsSync(base)) return null;

  const re = new RegExp(`^${globFile.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`);
  const files = fs
    .readdirSync(base)
    .filter((f) => re.test(f))
    .sort()
    .map((f) => path.join(base, f));

  if (!files.length) return null;
  const parts = files.map((f) => hashFileUtf8(f).hash);
  return sha256Utf8(parts.join('|'));
}

export function readConfigVersion(
  repoRoot: string,
  filePath: string,
  versionField: string
): string | null {
  const abs = path.resolve(repoRoot, filePath);
  if (!fs.existsSync(abs)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(abs, 'utf8')) as Record<string, unknown>;
    const v = data[versionField];
    return typeof v === 'string' ? v : v != null ? String(v) : null;
  } catch {
    return null;
  }
}

export function snapshotMap(snapshots: SnapshotRef[]): Map<string, SnapshotRef> {
  const map = new Map<string, SnapshotRef>();
  for (const s of snapshots) map.set(s.ssotId, s);
  return map;
}

export function currentWatchFingerprint(
  repoRoot: string,
  watch: WatchRegistration,
  snapshots: Map<string, SnapshotRef>
): { key: string; hash?: string; version?: string | null } | null {
  switch (watch.kind) {
    case 'ssot': {
      if (!watch.ssotId) return null;
      const snap = snapshots.get(watch.ssotId);
      return {
        key: watch.ssotId,
        hash: snap?.contentHash,
        version: snap?.version ?? null,
      };
    }
    case 'file': {
      if (!watch.path) return null;
      const abs = path.resolve(repoRoot, watch.path);
      if (!fs.existsSync(abs)) return { key: normalizePath(watch.path), hash: undefined };
      return { key: normalizePath(watch.path), hash: hashFileUtf8(abs).hash };
    }
    case 'glob': {
      if (!watch.pathGlob) return null;
      return {
        key: normalizePath(watch.pathGlob),
        hash: hashGlobFiles(repoRoot, watch.pathGlob) ?? undefined,
      };
    }
    case 'config': {
      if (!watch.path || !watch.versionField) return null;
      return {
        key: normalizePath(watch.path),
        version: readConfigVersion(repoRoot, watch.path, watch.versionField),
      };
    }
    default:
      return null;
  }
}

export function watchResourceKey(watch: WatchRegistration): string {
  switch (watch.kind) {
    case 'ssot':
      return watch.ssotId ?? watch.watchId;
    case 'git':
      return watch.source ?? watch.watchId;
    case 'glob':
      return watch.pathGlob ?? watch.watchId;
    case 'file':
    case 'config':
      return watch.path ?? watch.watchId;
    default:
      return watch.watchId;
  }
}
