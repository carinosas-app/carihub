import { runContractGate } from '../contract-engine/gate.js';
import { gateBlocksDomainEngine } from '../contract-engine/snapshot.js';
import { loadCatalogConfig } from './config-loader.js';
import { runHistoricalComparison } from './compare.js';
import { countLegacyAliases } from './facets/aliases.js';
import { runAliasesFacet } from './facets/aliases.js';
import { runAssetsFacet } from './facets/assets.js';
import { countSimilarPairs, runDuplicatesFacet } from './facets/duplicates.js';
import { countGapsDeclared, runGapsFacet } from './facets/gaps.js';
import { runPlacementFacet } from './facets/placement.js';
import { gateBlocksCatalog, runSummaryFacet, runTaxonomyFacet } from './facets/summary.js';
import {
  buildRunCompleteFinding,
  buildSsotInvalidFinding,
  dedupeFindingsByPairKey,
  resetCatalogFindingSeq,
  truncateFindings,
} from './findings.js';
import { loadSchemaIndex } from './loader.js';
import { findPreviousFullRun, shouldSkipExpensiveFacets } from './skip.js';
import { buildCatalogStats, gateHash } from './stats.js';
import type {
  CatalogAuditFacet,
  CatalogAuditInput,
  CatalogComposeResult,
  CatalogEngineContext,
  FacetRunResult,
} from './types.js';
import type { CamcpConfig } from '../../policy/permissions.js';
import type { ReportFinding } from '../../reports/schema.js';

const FACET_RUNNERS: Record<
  Exclude<CatalogAuditFacet, 'full'>,
  (ctx: CatalogEngineContext) => ReportFinding[]
> = {
  summary: (ctx) =>
    runSummaryFacet(
      ctx,
      ctx.similarPairsCount ?? 0,
      ctx.legacyAliasCount ?? countLegacyAliases(ctx),
      ctx.gapsDeclared ?? countGapsDeclared(ctx)
    ),
  taxonomy: runTaxonomyFacet,
  aliases: runAliasesFacet,
  duplicates: runDuplicatesFacet,
  placement: runPlacementFacet,
  gaps: runGapsFacet,
  assets: runAssetsFacet,
};

export function facetsForAudit(facet: CatalogAuditFacet): CatalogAuditFacet[] {
  if (facet === 'full') {
    return ['summary', 'taxonomy', 'aliases', 'duplicates', 'placement', 'gaps', 'assets'];
  }
  return [facet];
}

export function validateCatalogAuditInput(input: CatalogAuditInput): string[] {
  const errors: string[] = [];
  const facet = input.facet ?? 'summary';
  const validFacets: CatalogAuditFacet[] = [
    'summary',
    'duplicates',
    'aliases',
    'placement',
    'taxonomy',
    'gaps',
    'assets',
    'full',
  ];
  if (!validFacets.includes(facet)) {
    errors.push(`Invalid facet: ${facet}`);
  }
  return errors;
}

function buildContext(
  repoRoot: string,
  config: CamcpConfig,
  input: CatalogAuditInput,
  gate: ReturnType<typeof runContractGate>,
  loaded: ReturnType<typeof loadSchemaIndex>
): CatalogEngineContext {
  const cfg = loadCatalogConfig();
  const hash = gateHash(gate);
  const previous = findPreviousFullRun(repoRoot, config, hash);
  const forceFullScan = input.operator?.forceFullScan ?? cfg.defaults.forceFullScan;
  const comparisonMode = input.comparison?.mode ?? cfg.defaults.comparisonMode;
  const skipInfo = shouldSkipExpensiveFacets(
    input.facet ?? 'summary',
    forceFullScan,
    comparisonMode,
    previous
  );

  return {
    repoRoot,
    gate,
    index: loaded.index,
    schemaIndexPath: loaded.schemaIndexPath,
    scope: {
      sectorIds: input.scope?.sectorIds ?? [],
      subcategoriaIds: input.scope?.subcategoriaIds ?? [],
      focusGroups: input.scope?.focusGroups ?? [],
    },
    thresholds: {
      similarityJaccardMin:
        input.thresholds?.similarityJaccardMin ?? cfg.defaults.similarityJaccardMin,
      similarityCrossSectorMin:
        input.thresholds?.similarityCrossSectorMin ?? cfg.defaults.similarityCrossSectorMin,
      maxFindingsPerFacet:
        input.thresholds?.maxFindingsPerFacet ?? cfg.defaults.maxFindingsPerFacet,
    },
    skippedFacets: skipInfo.skippedFacets,
    previousFullRunRef: skipInfo.previousRef,
    gaps: { rulesetId: input.gaps?.rulesetId ?? cfg.rulesetIds.gaps },
  };
}

function runSingleFacet(
  ctx: CatalogEngineContext,
  facet: Exclude<CatalogAuditFacet, 'full'>
): FacetRunResult {
  if (ctx.skippedFacets.includes(facet)) {
    return {
      facet,
      findings: [],
      truncated: false,
      skipped: true,
      skipReason: 'CATALOG.SSOT.UNCHANGED',
    };
  }

  if (gateBlocksCatalog(ctx.gate) && facet !== 'summary') {
    return {
      facet,
      findings: [],
      truncated: false,
      skipped: true,
      skipReason: 'CATALOG.SSOT.INVALID',
    };
  }

  let findings = FACET_RUNNERS[facet](ctx);
  const { findings: truncated, truncated: wasTruncated } = truncateFindings(
    findings,
    ctx.thresholds.maxFindingsPerFacet,
    facet
  );
  findings = truncated;
  findings.push(buildRunCompleteFinding(facet));
  return { facet, findings, truncated: wasTruncated, skipped: false };
}

export function composeCatalogAudit(
  repoRoot: string,
  config: CamcpConfig,
  input: CatalogAuditInput = {}
): CatalogComposeResult {
  resetCatalogFindingSeq();
  const cfg = loadCatalogConfig();
  const facet: CatalogAuditFacet = input.facet ?? 'summary';
  const schemaPath = input.ssot?.schemaIndexPath ?? cfg.ssot.schemaIndexPath;

  const gate = runContractGate({
    repoRoot,
    facadeId: 'catalog.audit',
    facet,
  });

  if (gateBlocksDomainEngine(gate)) {
    const findings = [buildSsotInvalidFinding(gate.errors.map((e) => e.message).join('; '))];
    const emptyIndex = {
      version: null,
      total: 0,
      byId: {},
      entries: [],
      sectorCounts: {},
      idsWithSpaces: [],
    };
    const ctx: CatalogEngineContext = {
      repoRoot,
      gate,
      index: emptyIndex,
      schemaIndexPath: schemaPath,
      scope: { sectorIds: [], subcategoriaIds: [], focusGroups: [] },
      thresholds: {
        similarityJaccardMin: cfg.defaults.similarityJaccardMin,
        similarityCrossSectorMin: cfg.defaults.similarityCrossSectorMin,
        maxFindingsPerFacet: cfg.defaults.maxFindingsPerFacet,
      },
      skippedFacets: [],
      previousFullRunRef: null,
    };
    const stats = buildCatalogStats(ctx, facet, findings, []);
    return {
      facet,
      findings,
      stats,
      facetResults: [{ facet: 'summary', findings, truncated: false, skipped: false }],
      skippedFacets: [],
      bundleFacets: [{ facet: 'summary', findings }],
    };
  }

  const loaded = loadSchemaIndex(repoRoot, schemaPath);
  const ctx = buildContext(repoRoot, config, input, gate, loaded);
  const targetFacets = facetsForAudit(facet);

  const facetResults: FacetRunResult[] = [];
  const bundleFacets: Array<{ facet: CatalogAuditFacet; findings: ReportFinding[] }> = [];
  let allFindings: ReportFinding[] = [];
  let taxonomyFindings: ReportFinding[] = [];

  for (const f of targetFacets) {
    if (f === 'full') continue;
    const result = runSingleFacet(ctx, f);
    facetResults.push(result);
    if (!result.skipped) {
      bundleFacets.push({ facet: f, findings: result.findings });
      allFindings = allFindings.concat(result.findings);
      if (f === 'taxonomy') taxonomyFindings = result.findings;
    }
  }

  if (facet === 'full' || facet === 'summary') {
    const summaryIdx = facetResults.findIndex((r) => r.facet === 'summary');
    if (summaryIdx >= 0 && !facetResults[summaryIdx]!.skipped) {
      const refreshed = runSummaryFacet(
        ctx,
        countSimilarPairs(ctx),
        countLegacyAliases(ctx),
        countGapsDeclared(ctx)
      );
      const complete = [...refreshed, buildRunCompleteFinding('summary')];
      facetResults[summaryIdx] = {
        facet: 'summary',
        findings: complete,
        truncated: false,
        skipped: false,
      };
      const bf = bundleFacets.find((b) => b.facet === 'summary');
      if (bf) bf.findings = complete;
      allFindings = allFindings.filter((f) => f.provenance?.facet !== 'summary').concat(complete);
    }
  }

  allFindings = dedupeFindingsByPairKey(allFindings);
  const stats = buildCatalogStats(ctx, facet, allFindings, taxonomyFindings);

  if (facet === 'full') {
    const comparisonFindings = runHistoricalComparison(
      ctx,
      stats,
      input.comparison?.mode ?? cfg.defaults.comparisonMode
    );
    allFindings = allFindings.concat(comparisonFindings);
    bundleFacets.push({ facet: 'full', findings: comparisonFindings });
  }

  const topFindings =
    facet === 'full'
      ? allFindings
      : (facetResults.find((r) => r.facet === facet)?.findings ?? allFindings);

  return {
    facet,
    findings: topFindings,
    stats,
    facetResults,
    skippedFacets: ctx.skippedFacets,
    bundleFacets,
  };
}

export function capabilityForCatalogFacet(_facet: CatalogAuditFacet): 'report-only' {
  return 'report-only';
}
