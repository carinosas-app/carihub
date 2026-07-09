import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../../policy/permissions.js';
import { readReportIndex } from '../../reports/index-manager.js';
import type { CatalogAuditFacet } from './types.js';

export function findPreviousFullRun(
  repoRoot: string,
  config: CamcpConfig,
  currentHash: string | null
): { manifestPath: string; runId: string } | null {
  if (!currentHash) return null;
  const index = readReportIndex(repoRoot, config);
  for (const entry of index.entries) {
    if (entry.toolId !== 'catalog.audit') continue;
    if (entry.facet !== 'full') continue;
    const hash = entry.ssotHash?.['registro-schema-index'];
    if (hash && hash === currentHash) {
      return { manifestPath: entry.manifestPath, runId: entry.runId };
    }
  }
  return null;
}

export function shouldSkipExpensiveFacets(
  facet: CatalogAuditFacet,
  forceFullScan: boolean,
  comparisonMode: string,
  previousFull: { manifestPath: string } | null
): { skip: boolean; skippedFacets: CatalogAuditFacet[]; previousRef: string | null } {
  if (forceFullScan || comparisonMode !== 'none') {
    return { skip: false, skippedFacets: [], previousRef: null };
  }
  if (!previousFull) {
    return { skip: false, skippedFacets: [], previousRef: null };
  }
  const expensive: CatalogAuditFacet[] = [
    'duplicates',
    'aliases',
    'placement',
    'gaps',
    'assets',
  ];
  if (facet === 'full') {
    return {
      skip: true,
      skippedFacets: expensive,
      previousRef: previousFull.manifestPath,
    };
  }
  if (expensive.includes(facet)) {
    return { skip: true, skippedFacets: [facet], previousRef: previousFull.manifestPath };
  }
  return { skip: false, skippedFacets: [], previousRef: previousFull.manifestPath };
}

export function loadHistoricalBaseline(
  repoRoot: string,
  relPath: string
): Record<string, unknown> | null {
  const abs = path.resolve(repoRoot, relPath);
  if (!fs.existsSync(abs)) return null;
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}
