import fs from 'node:fs';
import path from 'node:path';
import { assertReadPathAllowed } from '../../../policy/path-guard.js';
import { loadCatalogConfig } from '../config-loader.js';
import { globFilesBounded } from '../loader.js';
import { catalogFinding } from '../findings.js';
import { normId } from '../normalize.js';
import type { CatalogEngineContext } from '../types.js';
import type { ReportFinding } from '../../../reports/schema.js';

function pathExists(repoRoot: string, rel: string): boolean {
  const abs = path.resolve(repoRoot, rel);
  assertReadPathAllowed(repoRoot, abs);
  return fs.existsSync(abs);
}

function matchPattern(rel: string, pattern: string): boolean {
  const regex = new RegExp(
    '^' +
      pattern
        .replace(/\\/g, '/')
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '[^/]*') +
      '$'
  );
  return regex.test(rel);
}

export function runAssetsFacet(ctx: CatalogEngineContext): ReportFinding[] {
  const cfg = loadCatalogConfig();
  const findings: ReportFinding[] = [];
  const blocksFiles = globFilesBounded(
    ctx.repoRoot,
    cfg.ssot.blocksGlob,
    cfg.allowedReadGlobs
  );
  const packFiles = globFilesBounded(
    ctx.repoRoot,
    cfg.ssot.packsGlob,
    cfg.allowedReadGlobs
  );

  let sectorsWithBlocks = 0;
  let subsMissingAssets = 0;
  let missingAssetFindings = 0;
  const sectorsExpected = cfg.knownSectors.length;

  for (const sectorId of cfg.knownSectors) {
    const asset = cfg.sectorAssetMap[sectorId];
    if (!asset) continue;

    const hasBlocks = asset.blocksPatterns.some((pattern) =>
      blocksFiles.some((f) => matchPattern(f, pattern))
    );
    if (hasBlocks) sectorsWithBlocks += 1;
    else {
      missingAssetFindings += 1;
      subsMissingAssets += ctx.index.sectorCounts[sectorId] ?? 0;
      findings.push(
        catalogFinding(
          'CATALOG.ASSETS.BLOCKS_MISSING',
          'IMPORTANTE',
          'Sector blocks file missing',
          `No blocks file matched for sector ${sectorId}`,
          'assets',
          {
            subject: { type: 'asset', sectorId, assetKind: 'blocks' },
          }
        )
      );
    }

    if (asset.renderPath && !pathExists(ctx.repoRoot, asset.renderPath)) {
      missingAssetFindings += 1;
      findings.push(
        catalogFinding(
          'CATALOG.ASSETS.RENDER_MISSING',
          'WARNING',
          'Sector render missing',
          `Expected render file ${asset.renderPath} for sector ${sectorId}`,
          'assets',
          {
            confidence: 'medium',
            subject: { type: 'asset', sectorId, assetKind: 'render', path: asset.renderPath },
          }
        )
      );
    }

    if (
      asset.packPatterns.length &&
      !asset.packPatterns.some((p) => packFiles.includes(p) || pathExists(ctx.repoRoot, p))
    ) {
      missingAssetFindings += 1;
      findings.push(
        catalogFinding(
          'CATALOG.ASSETS.PACK_MISSING',
          'WARNING',
          'Sector pack missing',
          `Expected pack for sector ${sectorId}: ${asset.packPatterns.join(', ')}`,
          'assets',
          {
            subject: { type: 'asset', sectorId, assetKind: 'pack' },
          }
        )
      );
    }
  }

  for (const entry of ctx.index.entries) {
    if (!entry.subcategoriaId.includes(' ')) continue;
    const normalized = normId(entry.subcategoriaId);
    const sectorBlocks = blocksFiles.filter((f) => f.includes('adultos') || f.includes(entry.sectorId));
    for (const blockFile of sectorBlocks.slice(0, 3)) {
      const abs = path.resolve(ctx.repoRoot, blockFile);
      assertReadPathAllowed(ctx.repoRoot, abs);
      const content = fs.readFileSync(abs, 'utf8');
      if (content.includes(normalized) && !content.includes(entry.subcategoriaId)) {
        findings.push(
          catalogFinding(
            'CATALOG.ASSETS.INTERNAL_ID_DRIFT',
            'IMPORTANTE',
            'Schema ID with spaces vs blocks normalized ID',
            `subcategoriaId='${entry.subcategoriaId}' vs blocks '${normalized}' in ${blockFile}`,
            'assets',
            {
              domain: 'APP_REGISTRO',
              subject: {
                type: 'subcategoria',
                sectorId: entry.sectorId,
                subcategoriaId: entry.subcategoriaId,
              },
              recommendation: {
                action: 'alias',
                hint: 'Normalization kebab-case — field-engine-lite mapping',
              },
            }
          )
        );
        break;
      }
    }
  }

  ctx.assetsCoverage = {
    ratio: sectorsExpected ? sectorsWithBlocks / sectorsExpected : 1,
    sectorsWithBlocks,
    sectorsExpected,
    subsWithPack: packFiles.length,
    subsMissingAssets,
    missingAssetFindings,
  };

  return findings;
}
