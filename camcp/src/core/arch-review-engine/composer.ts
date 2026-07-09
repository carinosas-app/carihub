import type { CamcpConfig } from '../../policy/permissions.js';
import { runContractGate } from '../contract-engine/gate.js';
import { gateBlocksDomainEngine } from '../contract-engine/snapshot.js';
import { delegateFacet } from './delegate.js';
import { runScopeFacet, runSummaryFacet } from './facets/static.js';
import {
  buildRunCompleteFinding,
  buildSsotInvalidFinding,
  archFinding,
  dedupeFindings,
  resetArchFindingSeq,
  truncateFindings,
} from './findings.js';
import { buildArchReviewHealth, facetBlockedByGate } from './health.js';
import { loadArchReviewConfig } from './config-loader.js';
import { loadGitContextRef } from './git-context.js';
import type {
  ArchReviewComposeResult,
  ArchReviewEngineContext,
  ArchReviewFacet,
  ArchReviewInput,
} from './types.js';
import { ARCH_FACET_ORDER, DELEGATED_ARCH_FACETS } from './types.js';
import type { ReportFinding } from '../../reports/schema.js';

export function facetsForArchReview(facet: ArchReviewFacet): ArchReviewFacet[] {
  if (facet === 'full') return [...ARCH_FACET_ORDER];
  return [facet];
}

export function validateArchReviewInput(input: ArchReviewInput): string[] {
  const errors: string[] = [];
  const facet = input.facet ?? 'summary';
  const valid: ArchReviewFacet[] = [...ARCH_FACET_ORDER, 'full'];
  if (!valid.includes(facet)) errors.push(`Invalid facet: ${facet}`);
  return errors;
}

function buildContext(
  repoRoot: string,
  input: ArchReviewInput,
  gate: ReturnType<typeof runContractGate>,
  config: CamcpConfig
): ArchReviewEngineContext {
  const cfg = loadArchReviewConfig();
  const gitContext = loadGitContextRef(repoRoot, config, input);
  const gitCommit = gate.snapshots[0]?.contentHash?.slice(7, 15) ?? null;

  return {
    repoRoot,
    gate,
    input,
    gitContext,
    gitCommit,
    thresholds: {
      failOnBlocker: input.thresholds?.failOnBlocker ?? cfg.defaults.failOnBlocker,
      maxFindingsPerFacet:
        input.thresholds?.maxFindingsPerFacet ?? cfg.defaults.maxFindingsPerFacet,
    },
    delegation: {
      skipIfCached: input.delegation?.skipIfCached ?? false,
      maxAgeMs: input.delegation?.maxAgeMs ?? cfg.defaults.maxAgeMs,
    },
    delegations: [],
    skippedFacets: [],
    facetFindings: {},
  };
}

function runFacet(
  ctx: ArchReviewEngineContext,
  config: CamcpConfig,
  facet: ArchReviewFacet
): { findings: ReportFinding[]; skipped: boolean } {
  if (facetBlockedByGate(facet, ctx)) {
    ctx.skippedFacets.push(facet);
    return {
      findings: [
        archFinding(
          'ARCH.FACET.SKIPPED',
          'INFO',
          'Facet skipped',
          `${facet} skipped — SSOT invalid`,
          facet
        ),
        buildRunCompleteFinding(facet),
      ],
      skipped: true,
    };
  }

  let findings: ReportFinding[] = [];

  if (facet === 'summary') {
    findings = runSummaryFacet(ctx);
  } else if (facet === 'scope') {
    findings = runScopeFacet(ctx);
  } else if (DELEGATED_ARCH_FACETS.includes(facet)) {
    const delegated = delegateFacet(ctx, config, facet);
    ctx.delegations.push(delegated.record);
    findings = delegated.findings;
  }

  const { findings: truncated } = truncateFindings(
    findings,
    ctx.thresholds.maxFindingsPerFacet,
    facet
  );
  if (!truncated.some((f) => f.code === 'CAMCP.ARCH.RUN_COMPLETE')) {
    truncated.push(buildRunCompleteFinding(facet));
  }
  ctx.facetFindings[facet] = truncated;
  return { findings: truncated, skipped: false };
}

export function composeArchReview(
  repoRoot: string,
  config: CamcpConfig,
  input: ArchReviewInput = {}
): ArchReviewComposeResult {
  resetArchFindingSeq();
  const cfg = loadArchReviewConfig();
  const facet: ArchReviewFacet = input.facet ?? 'summary';

  const gate = runContractGate({
    repoRoot,
    facadeId: 'arch.review',
    facet,
  });

  if (gateBlocksDomainEngine(gate)) {
    const msg = gate.errors.map((e) => e.message).join('; ') || 'Contract gate failed';
    const findings = [buildSsotInvalidFinding(msg)];
    const gitContext = loadGitContextRef(repoRoot, config, input);
    const emptyCtx: ArchReviewEngineContext = {
      repoRoot,
      gate,
      input,
      gitContext,
      gitCommit: null,
      thresholds: {
        failOnBlocker: cfg.defaults.failOnBlocker,
        maxFindingsPerFacet: cfg.defaults.maxFindingsPerFacet,
      },
      delegation: { skipIfCached: false, maxAgeMs: cfg.defaults.maxAgeMs },
      delegations: [],
      skippedFacets: ARCH_FACET_ORDER.filter((f) => f !== 'summary' && f !== 'scope'),
      facetFindings: { summary: findings },
    };
    const health = buildArchReviewHealth(emptyCtx);
    return {
      facet,
      findings,
      health,
      facetResults: [{ facet: 'summary', findings, skipped: false }],
      delegations: [],
      skippedFacets: emptyCtx.skippedFacets,
      bundleFacets: [{ facet: 'summary', findings }],
      gitContextRef: gitContext,
    };
  }

  const ctx = buildContext(repoRoot, input, gate, config);
  const targetFacets = facetsForArchReview(facet);

  const facetResults: ArchReviewComposeResult['facetResults'] = [];
  const bundleFacets: ArchReviewComposeResult['bundleFacets'] = [];
  let allFindings: ReportFinding[] = [];

  for (const f of targetFacets) {
    const result = runFacet(ctx, config, f);
    facetResults.push({ facet: f, findings: result.findings, skipped: result.skipped });
    if (!result.skipped) {
      bundleFacets.push({ facet: f, findings: result.findings });
      allFindings = allFindings.concat(result.findings);
    }
  }

  if (facet === 'full' || facet === 'summary') {
    const summaryIdx = facetResults.findIndex((r) => r.facet === 'summary');
    if (summaryIdx >= 0) {
      const refreshed = runSummaryFacet(ctx);
      const complete = [...refreshed, buildRunCompleteFinding('summary')];
      facetResults[summaryIdx] = { facet: 'summary', findings: complete, skipped: false };
      const bf = bundleFacets.find((b) => b.facet === 'summary');
      if (bf) bf.findings = complete;
      allFindings = allFindings.filter((f) => f.provenance?.facet !== 'summary').concat(complete);
    }
  }

  allFindings = dedupeFindings(allFindings);
  const health = buildArchReviewHealth(ctx);
  const topFindings =
    facet === 'full'
      ? allFindings
      : (facetResults.find((r) => r.facet === facet)?.findings ?? allFindings);

  return {
    facet,
    findings: topFindings,
    health,
    facetResults,
    delegations: ctx.delegations,
    skippedFacets: ctx.skippedFacets,
    bundleFacets,
    gitContextRef: ctx.gitContext,
  };
}

export function capabilityForArchFacet(_facet: ArchReviewFacet): 'report-only' {
  return 'report-only';
}

export function buildSuggestedNext(composed: ArchReviewComposeResult): string[] {
  const cfg = loadArchReviewConfig();
  const chain = [...cfg.handoffPriorities];

  if (!composed.health.ssotValid) return ['arch.review:summary'];
  if (!composed.health.frozenValid) {
    chain.unshift('arch.review:frozen');
  }
  if (!composed.health.boundariesValid) {
    const idx = chain.indexOf('arch.review:boundaries');
    if (idx >= 0) chain.unshift(chain.splice(idx, 1)[0]!);
  }
  if (!composed.health.gitContextFresh) {
    chain.unshift('git.worktree:full');
  }

  return [...new Set(chain)].slice(0, 8);
}
