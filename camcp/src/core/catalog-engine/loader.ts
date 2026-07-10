import fs from 'node:fs';
import path from 'node:path';
import { assertReadPathAllowed } from '../../policy/path-guard.js';
import { loadCatalogConfig } from './config-loader.js';
import { normId, normLabel } from './normalize.js';
import type { CatalogEntry, CatalogIndex } from './types.js';

export interface LoadedSchemaIndex {
  index: CatalogIndex;
  schemaIndexPath: string;
  raw: Record<string, unknown>;
}

export function loadSchemaIndex(repoRoot: string, schemaIndexPath?: string): LoadedSchemaIndex {
  const cfg = loadCatalogConfig();
  const rel = schemaIndexPath ?? cfg.ssot.schemaIndexPath;
  const abs = path.resolve(repoRoot, rel);
  assertReadPathAllowed(repoRoot, abs);

  const raw = JSON.parse(fs.readFileSync(abs, 'utf8')) as Record<string, unknown>;
  const byIdRaw = raw.byId as Record<string, unknown> | undefined;
  if (!byIdRaw || typeof byIdRaw !== 'object') {
    throw new Error('schema-index byId missing');
  }

  const byId: Record<string, CatalogEntry> = {};
  const entries = [];
  const sectorCounts: Record<string, number> = {};
  const idsWithSpaces: string[] = [];

  for (const [key, value] of Object.entries(byIdRaw)) {
    if (!value || typeof value !== 'object') continue;
    const row = value as Record<string, unknown>;
    const entry: CatalogEntry = {
      subcategoriaId: String(row.subcategoriaId ?? key),
      subcategoria: String(row.subcategoria ?? key),
      sectorId: String(row.sectorId ?? ''),
      categoriaPrincipal:
        row.categoriaPrincipal != null ? String(row.categoriaPrincipal) : undefined,
      formularioId: row.formularioId != null ? String(row.formularioId) : undefined,
      arquetipo: row.arquetipo != null ? String(row.arquetipo) : undefined,
      tipoPerfil: row.tipoPerfil != null ? String(row.tipoPerfil) : undefined,
      componenteResultados:
        row.componenteResultados != null ? String(row.componenteResultados) : undefined,
      componentePerfil:
        row.componentePerfil != null ? String(row.componentePerfil) : undefined,
    };
    byId[key] = entry;
    if (entry.subcategoriaId.includes(' ') || key.includes(' ')) {
      idsWithSpaces.push(entry.subcategoriaId);
    }
    sectorCounts[entry.sectorId] = (sectorCounts[entry.sectorId] ?? 0) + 1;
    entries.push({
      ...entry,
      normLabel: normLabel(entry.subcategoria),
      normId: normId(entry.subcategoriaId),
    });
  }

  const version = raw.version != null ? String(raw.version) : null;
  const total = typeof raw.total === 'number' ? raw.total : entries.length;

  return {
    index: {
      version,
      total,
      byId,
      entries,
      sectorCounts,
      idsWithSpaces,
    },
    schemaIndexPath: rel,
    raw,
  };
}

export interface AliasDocument {
  legacyToCanon?: Record<string, string>;
  exclusionAdultos?: Record<string, string>;
  exclusionEventos?: Record<string, string>;
}

export function loadAliasDocuments(
  repoRoot: string,
  aliasesPaths?: string[]
): Array<{ path: string; doc: AliasDocument }> {
  const cfg = loadCatalogConfig();
  const paths = aliasesPaths ?? cfg.ssot.aliasesPaths;
  const out: Array<{ path: string; doc: AliasDocument }> = [];
  for (const rel of paths) {
    const abs = path.resolve(repoRoot, rel);
    assertReadPathAllowed(repoRoot, abs);
    if (!fs.existsSync(abs)) continue;
    out.push({ path: rel, doc: JSON.parse(fs.readFileSync(abs, 'utf8')) as AliasDocument });
  }
  return out;
}

/** Walk root for a bounded glob (parent dir when wildcard is inside a filename segment). */
export function resolveGlobWalkBase(pattern: string): string {
  const normalized = pattern.replace(/\\/g, '/');
  const wildcardIndex = normalized.search(/[*?[{]/);
  if (wildcardIndex === -1) {
    return path.dirname(normalized);
  }
  const beforeWildcard = normalized.slice(0, wildcardIndex);
  const lastSlash = beforeWildcard.lastIndexOf('/');
  if (lastSlash === -1) {
    return '.';
  }
  return beforeWildcard.slice(0, lastSlash);
}

export function globFilesBounded(
  repoRoot: string,
  pattern: string,
  allowedGlobs: string[]
): string[] {
  if (!allowedGlobs.includes(pattern)) {
    throw new Error(`Glob pattern not allowlisted: ${pattern}`);
  }
  const walkBaseRel = resolveGlobWalkBase(pattern);
  const baseDir = path.resolve(repoRoot, walkBaseRel);
  const prefix = walkBaseRel === '.' ? '' : walkBaseRel.replace(/\\/g, '/');
  if (!fs.existsSync(baseDir)) return [];

  const regex = globToRegex(pattern);
  const results: string[] = [];

  function walk(dir: string): void {
    for (const name of fs.readdirSync(dir)) {
      const abs = path.join(dir, name);
      const rel = path.relative(repoRoot, abs).replace(/\\/g, '/');
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) {
        if (!prefix || rel.startsWith(prefix) || prefix.startsWith(rel)) walk(abs);
      } else if (regex.test(rel)) {
        results.push(rel);
      }
    }
  }

  walk(baseDir);
  return results.sort();
}

function globToRegex(glob: string): RegExp {
  const escaped = glob
    .replace(/\\/g, '/')
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '§§')
    .replace(/\*/g, '[^/]*')
    .replace(/§§/g, '.*');
  return new RegExp(`^${escaped}$`);
}
