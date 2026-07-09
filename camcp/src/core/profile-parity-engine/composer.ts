import type { CamcpConfig } from '../../policy/permissions.js';
import { runContractGate } from '../contract-engine/gate.js';
import { gateBlocksDomainEngine } from '../contract-engine/snapshot.js';
import { delegateFacet } from './delegate.js';
import { runLifecycleFacet, runSummaryFacet, runVerificationFacet } from './facets/static.js';
import {
  buildRunCompleteFinding,
  buildSsotInvalidFinding,
  dedupeFindings,
  profileFinding,
  resetProfileFindingSeq,
  truncateFindings,
} from './findings.js';
import { buildProfileHealth, facetBlockedByGate } from './health.js';
import { loadProfileConfig } from './config-loader.js';
import { resolveScope } from './scope.js';
import type {
  ProfileAuditFacet,
  ProfileAuditInput,
  ProfileComposeResult,
  ProfileEngineContext,
} from './types.js';
import { PROFILE_FACET_ORDER } from './types.js';
import type { ReportFinding } from '../../reports/schema.js';

export function facetsForProfileAudit(facet: ProfileAuditFacet): ProfileAuditFacet[] {
  if (facet === 'full') return [...PROFILE_FACET_ORDER];
  return [facet];
}

const DELEGATED: ProfileAuditFacet[] = [
  'registration',
  'parity',
  'public_fields',
  'private_fields',
  'render',
];

export function validateProfileAuditInput(input: ProfileAuditInput): string[] {
  const errors: string[] = [];
  const facet = input.facet ?? 'summary';
  const valid: ProfileAuditFacet[] = [...PROFILE_FACET_ORDER, 'full'];
  if (!valid.includes(facet)) errors.push(`Invalid facet: ${facet}`);
  if ((input as { facet?: string }).facet === 'profile.visual.audit') {
    errors.push('profile.visual.audit is RESERVED');
  }
  return errors;
}

function buildContext(
  repoRoot: string,
  input: ProfileAuditInput,
  gate: ReturnType<typeof runContractGate>,
  scopeResult: ReturnType<typeof resolveScope>
): ProfileEngineContext {
  const cfg = loadProfileConfig();
  const gitCommit = gate.snapshots[0]?.contentHash?.slice(7, 15) ?? null;
  return {
    repoRoot,
    gate,
    input,
    scope: scopeResult.scope,
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
  ctx: ProfileEngineContext,
  config: CamcpConfig,
  facet: ProfileAuditFacet
): { findings: ReportFinding[]; skipped: boolean } {
  if (facetBlockedByGate(facet, ctx)) {
    ctx.skippedFacets.push(facet);
    return {
      findings: [
        profileFinding(
          'PARITY.FACET.SKIPPED',
          'INFO',
          'Facet skipped',
          `${facet} skipped — SSOT invalid or scope missing`,
          facet
        ),
      ],
      skipped: true,
    };
  }

  let findings: ReportFinding[] = [];
  if (facet === 'summary') {
    findings = [...runSummaryFacet(ctx), ...resolveScope(ctx.repoRoot, ctx.input).findings];
  } else if (DELEGATED.includes(facet)) {
    const delegated = delegateFacet(ctx, config, facet);
    ctx.delegations.push(delegated.record);
    findings = delegated.findings;
  } else if (facet === 'lifecycle') {
    findings = runLifecycleFacet(ctx);
  } else if (facet === 'verification') {
    findings = runVerificationFacet(ctx);
  }

  const { findings: truncated } = truncateFindings(
    findings,
    ctx.thresholds.maxFindingsPerFacet,
    facet
  );
  truncated.push(buildRunCompleteFinding(facet));
  ctx.facetFindings[facet] = truncated;
  return { findings: truncated, skipped: false };
}

export function composeProfileAudit(
  repoRoot: string,
  config: CamcpConfig,
  input: ProfileAuditInput = {}
): ProfileComposeResult {
  resetProfileFindingSeq();
  const cfg = loadProfileConfig();
  const facet: ProfileAuditFacet = input.facet ?? 'summary';

  const gate = runContractGate({
    repoRoot,
    facadeId: 'profile.audit',
    facet,
    ssotIds: ['registro-schema-index', 'perfil-publico'],
  });

  if (gateBlocksDomainEngine(gate)) {
    const msg = gate.errors.map((e) => e.message).join('; ') || 'Contract gate failed';
    const findings = [buildSsotInvalidFinding(msg)];
    const emptyCtx: ProfileEngineContext = {
      repoRoot,
      gate,
      input,
      scope: {
        sectorId: null,
        subcategoriaIds: [],
        subsInScope: 0,
        scopeValid: false,
        scopeMissing: true,
      },
      gitCommit: null,
      thresholds: {
        failOnBlocker: cfg.defaults.failOnBlocker,
        maxFindingsPerFacet: cfg.defaults.maxFindingsPerFacet,
      },
      delegation: { skipIfCached: false, maxAgeMs: cfg.defaults.maxAgeMs },
      delegations: [],
      skippedFacets: PROFILE_FACET_ORDER.filter((f) => f !== 'summary'),
      facetFindings: { summary: findings },
    };
    const health = buildProfileHealth(emptyCtx);
    return {
      facet,
      findings,
      health,
      facetResults: [{ facet: 'summary', findings, skipped: false }],
      delegations: [],
      skippedFacets: emptyCtx.skippedFacets,
      bundleFacets: [{ facet: 'summary', findings }],
    };
  }

  const scopeResult = resolveScope(repoRoot, input);
  const ctx = buildContext(repoRoot, input, gate, scopeResult);
  const targetFacets = facetsForProfileAudit(facet);

  const facetResults: ProfileComposeResult['facetResults'] = [];
  const bundleFacets: ProfileComposeResult['bundleFacets'] = [];
  let allFindings: ReportFinding[] = [...scopeResult.findings];

  for (const f of targetFacets) {
    const result = runFacet(ctx, config, f);
    facetResults.push({ facet: f, findings: result.findings, skipped: result.skipped });
    if (!result.skipped) {
      bundleFacets.push({ facet: f, findings: result.findings });
      allFindings = allFindings.concat(result.findings);
    }
  }

  if (facet === 'full' || facet === 'summary') {
    const health = buildProfileHealth(ctx);
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
  const health = buildProfileHealth(ctx);
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
  };
}

export function capabilityForProfileFacet(_facet: ProfileAuditFacet): 'report-only' {
  return 'report-only';
}

export function buildSuggestedNext(composed: ProfileComposeResult): string[] {
  const cfg = loadProfileConfig();
  const chain = [...cfg.handoffPriorities];
  if (!composed.health.ssotValid) return ['profile.audit:summary'];
  if (!composed.health.parityValid) {
    const idx = chain.indexOf('profile.audit:parity');
    if (idx > 0) chain.unshift(chain.splice(idx, 1)[0]!);
  }
  if (!composed.health.renderValid) {
    const idx = chain.indexOf('profile.audit:render');
    if (idx >= 0) chain.unshift('profile.audit:render');
  }
  return [...new Set(chain)].slice(0, 8);
}
