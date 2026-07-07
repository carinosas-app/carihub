import fs from 'node:fs';
import path from 'node:path';
import type { ArchToolConfig } from './config-loader.js';

export interface FrozenPathEntry {
  path: string;
  source: string;
}

const PATH_LIKE =
  /^(public\/|scripts\/|camcp\/|\.cursor\/|docs\/)[^\s"'`]+$/;

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, '');
}

function addEntry(map: Map<string, FrozenPathEntry>, raw: string, source: string) {
  const pathNorm = normalizePath(raw);
  if (!PATH_LIKE.test(pathNorm)) return;
  if (!map.has(pathNorm)) {
    map.set(pathNorm, { path: pathNorm, source });
  }
}

function collectPathStrings(value: unknown, source: string, map: Map<string, FrozenPathEntry>) {
  if (typeof value === 'string') {
    addEntry(map, value, source);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectPathStrings(item, source, map);
    return;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) {
      collectPathStrings(v, source, map);
    }
  }
}

function loadActaFrozenPaths(repoRoot: string, actaGlob: string): FrozenPathEntry[] {
  const map = new Map<string, FrozenPathEntry>();
  const dir = path.join(repoRoot, 'scripts');
  if (!fs.existsSync(dir)) return [];

  for (const name of fs.readdirSync(dir)) {
    if (!name.startsWith('ACTA-CONGELAMIENTO') || !name.endsWith('.json')) continue;
    const rel = `scripts/${name}`;
    const full = path.join(repoRoot, rel);
    try {
      const data = JSON.parse(fs.readFileSync(full, 'utf8')) as Record<string, unknown>;
      const estado = String(data.estadoActa ?? data.estado ?? '').toUpperCase();
      const hasBaseline = Array.isArray(data.archivosBaseline) && data.archivosBaseline.length > 0;
      if (!hasBaseline && estado && !estado.includes('CONGEL')) continue;

      const baseline = data.archivosBaseline;
      if (Array.isArray(baseline)) {
        for (const p of baseline) {
          if (typeof p === 'string') addEntry(map, p, rel);
        }
      }

      const auth = data.autorizacion as { artefactosAprobados?: string[] } | undefined;
      if (auth?.artefactosAprobados) {
        for (const p of auth.artefactosAprobados) addEntry(map, p, rel);
      }

      collectPathStrings(data.objetoCongelamiento, rel, map);
    } catch {
      /* skip invalid acta */
    }
  }
  return [...map.values()];
}

function loadRulesFrozenPaths(repoRoot: string, rulesGlob: string): FrozenPathEntry[] {
  const map = new Map<string, FrozenPathEntry>();
  const rulesDir = path.join(repoRoot, '.cursor', 'rules');
  if (!fs.existsSync(rulesDir)) return [];

  const pathRe = /`(public\/[^`]+|scripts\/[^`]+|camcp\/[^`]+)`/g;
  for (const name of fs.readdirSync(rulesDir)) {
    if (!name.endsWith('.mdc')) continue;
    const rel = `.cursor/rules/${name}`;
    const text = fs.readFileSync(path.join(repoRoot, rel), 'utf8');
    let m: RegExpExecArray | null;
    while ((m = pathRe.exec(text)) !== null) {
      addEntry(map, m[1]!, rel);
    }
  }
  return [...map.values()];
}

/** Reads frozen paths from SSOT (ACTA + rules) — no parallel registry persisted. */
export function loadFrozenPathsFromSsot(
  repoRoot: string,
  toolConfig: ArchToolConfig
): FrozenPathEntry[] {
  const map = new Map<string, FrozenPathEntry>();

  for (const entry of loadActaFrozenPaths(repoRoot, toolConfig.actaGlob ?? 'scripts/ACTA-CONGELAMIENTO-*.json')) {
    map.set(entry.path, entry);
  }
  for (const entry of loadRulesFrozenPaths(repoRoot, toolConfig.rulesGlob ?? '.cursor/rules/*.mdc')) {
    map.set(entry.path, entry);
  }
  for (const p of toolConfig.camcpFrozenPaths ?? []) {
    addEntry(map, p, 'arch.config.json');
  }

  return [...map.values()];
}

export function pathMatchesFrozen(changed: string, frozen: FrozenPathEntry): boolean {
  const rel = normalizePath(changed);
  const fp = frozen.path;
  if (rel === fp) return true;
  const prefix = fp.endsWith('/') ? fp : `${fp}/`;
  return rel.startsWith(prefix);
}
