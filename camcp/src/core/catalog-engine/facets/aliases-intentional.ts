import fs from 'node:fs';
import path from 'node:path';
import { assertReadPathAllowed } from '../../../policy/path-guard.js';
import { loadCatalogConfig } from '../config-loader.js';
import type { CatalogEngineContext } from '../types.js';

export interface IntentionalRedirectBundle {
  bundleId: string;
  aliasDocumentPath: string;
  actaPath: string;
  runtimeLegacyMapPaths: string[];
}

export interface IntentionalRedirectEvidence {
  actaPairs: Map<string, string>;
  runtimePairs: Map<string, string>;
  actaPath: string;
  runtimePaths: string[];
}

const bundleCache = new WeakMap<CatalogEngineContext, Map<string, IntentionalRedirectEvidence>>();

function parseActaLegacyCanonTable(content: string): Map<string, string> {
  const map = new Map<string, string>();
  const section = content.match(/## Tabla legacy → canon[\s\S]*?(?=\n## |\n$)/i);
  if (!section) return map;
  const rowRe = /\|\s*([a-z0-9-]+)\s*\|\s*([a-z0-9-]+)\s*\|/gi;
  let match: RegExpExecArray | null;
  while ((match = rowRe.exec(section[0])) !== null) {
    const legacy = match[1]!.toLowerCase();
    const canon = match[2]!.toLowerCase();
    if (legacy === 'legacy' || canon === 'canon') continue;
    map.set(legacy, canon);
  }
  return map;
}

function parseRuntimeLegacyMap(content: string): Map<string, string> {
  const map = new Map<string, string>();
  const block = content.match(/LEGACY_TO_CANON\s*=\s*\{([\s\S]*?)\n\s*\}/);
  if (!block) return map;
  const pairRe = /"([^"]+)":\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = pairRe.exec(block[1]!)) !== null) {
    map.set(match[1]!, match[2]!);
  }
  return map;
}

function readFileRel(repoRoot: string, rel: string): string {
  const abs = path.resolve(repoRoot, rel);
  assertReadPathAllowed(repoRoot, abs);
  return fs.readFileSync(abs, 'utf8');
}

function bundleForAliasDoc(aliasDocumentPath: string): IntentionalRedirectBundle | null {
  const cfg = loadCatalogConfig();
  const ruleset = cfg.aliasRuleset;
  if (!ruleset?.intentionalRedirectBundles?.length) return null;
  const normalized = aliasDocumentPath.replace(/\\/g, '/');
  return (
    ruleset.intentionalRedirectBundles.find(
      (b) => b.aliasDocumentPath.replace(/\\/g, '/') === normalized
    ) ?? null
  );
}

function isApprovedActaPath(actaPath: string): boolean {
  const base = path.basename(actaPath.replace(/\\/g, '/'));
  return base.startsWith('ACTA-MINOR-CATALOGO-');
}

function loadBundleEvidence(
  ctx: CatalogEngineContext,
  bundle: IntentionalRedirectBundle
): IntentionalRedirectEvidence {
  let perCtx = bundleCache.get(ctx);
  if (!perCtx) {
    perCtx = new Map();
    bundleCache.set(ctx, perCtx);
  }
  const cached = perCtx.get(bundle.bundleId);
  if (cached) return cached;

  if (!isApprovedActaPath(bundle.actaPath)) {
    const empty: IntentionalRedirectEvidence = {
      actaPairs: new Map(),
      actaPath: bundle.actaPath,
      runtimePairs: new Map(),
      runtimePaths: bundle.runtimeLegacyMapPaths.slice(),
    };
    perCtx.set(bundle.bundleId, empty);
    return empty;
  }

  const actaPairs = parseActaLegacyCanonTable(readFileRel(ctx.repoRoot, bundle.actaPath));
  const runtimePairs = new Map<string, string>();
  for (const rel of bundle.runtimeLegacyMapPaths) {
    const fileMap = parseRuntimeLegacyMap(readFileRel(ctx.repoRoot, rel));
    for (const [legacy, canon] of fileMap) {
      runtimePairs.set(legacy, canon);
    }
  }

  const evidence: IntentionalRedirectEvidence = {
    actaPairs,
    actaPath: bundle.actaPath,
    runtimePairs,
    runtimePaths: bundle.runtimeLegacyMapPaths.slice(),
  };
  perCtx.set(bundle.bundleId, evidence);
  return evidence;
}

/** Acta-backed redirect-only legacy alias (no schema-index byId row expected). */
export function isIntentionalRedirectOnlyLegacy(
  ctx: CatalogEngineContext,
  aliasDocumentPath: string,
  aliasId: string,
  targetId: string
): { intentional: boolean; evidence?: IntentionalRedirectEvidence } {
  const bundle = bundleForAliasDoc(aliasDocumentPath);
  if (!bundle) return { intentional: false };

  const evidence = loadBundleEvidence(ctx, bundle);
  const actaTarget = evidence.actaPairs.get(aliasId);
  const runtimeTarget = evidence.runtimePairs.get(aliasId);

  if (actaTarget !== targetId || runtimeTarget !== targetId) {
    return { intentional: false, evidence };
  }

  return { intentional: true, evidence };
}

export function resetIntentionalRedirectCache(): void {
  // WeakMap clears with ctx; explicit reset for tests via new ctx each run.
}
