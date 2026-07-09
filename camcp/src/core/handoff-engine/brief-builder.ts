import type { CamcpConfig } from '../../policy/permissions.js';
import { REPORT_SCHEMA_VERSION } from '../../reports/constants.js';
import {
  aggregateSsotMaps,
  buildCompletedChecks,
} from './completed-checks.js';
import { buildEvidenceRefs } from './evidence-refs.js';
import { buildForbiddenActions } from './forbidden-actions.js';
import { resolveGitContextForHandoff } from './git-context.js';
import { estimateOverflowMetrics } from './overflow.js';
import { selectOpenFindings } from './open-findings.js';
import {
  findLatestHandoffBrief,
  loadReportsForHandoff,
} from './report-loader.js';
import { buildSuggestedToolChain } from './suggested-chain.js';
import { loadHandoffConfig } from './config-loader.js';
import type {
  HandoffBriefDocument,
  HandoffFacet,
  HandoffInput,
  TaskStatus,
} from './types.js';
import {
  HANDOFF_BRIEF_SCHEMA_VERSION,
  HANDOFF_ENGINE_VERSION,
} from './types.js';

export interface BuildBriefResult {
  brief: HandoffBriefDocument;
  gitContextPath: string | null;
  truncatedFindings: boolean;
  noEvidence: boolean;
  prUnavailable: boolean;
  staleChecksCount: number;
}

export function buildHandoffBrief(
  repoRoot: string,
  config: CamcpConfig,
  input: HandoffInput,
  facet: HandoffFacet,
  runId: string,
  now: Date = new Date()
): BuildBriefResult {
  const cfg = loadHandoffConfig();
  const reports = loadReportsForHandoff(repoRoot, config, input, now);
  const noEvidence = reports.length === 0;

  const gitResolved = resolveGitContextForHandoff(repoRoot, config, {
    baseRef: input.git?.baseRef,
    worktreePath: input.git?.worktreePath,
    gitContextPath: input.git?.gitContextPath,
  });

  const completedChecks = buildCompletedChecks(
    repoRoot,
    reports,
    input,
    {
      commit: gitResolved.git.commit,
      branch: gitResolved.git.branch,
    }
  );
  const staleChecksCount = completedChecks.filter((c) => !c.valid).length;

  const maxOpen =
    facet === 'continuation_brief'
      ? cfg.defaults.maxOpenFindingsContinuation
      : undefined;
  const { openFindings, truncated } = selectOpenFindings(reports, input, maxOpen);

  const previous = input.supersedes ?? findLatestHandoffBrief(repoRoot, config);
  const evidenceRefs = buildEvidenceRefs(
    openFindings,
    reports,
    gitResolved.gitContextPath,
    previous?.path ?? null,
    input.historicalEvidence
  );

  const { ssotHashes, ssotVersions } = aggregateSsotMaps(reports);

  const overflow = estimateOverflowMetrics({
    openFindingsCount: openFindings.length,
    evidenceRefsCount: evidenceRefs.length,
    completedChecksCount: completedChecks.length,
    gitChangedFilesCount: gitResolved.git.changedFilesCount,
    taskNarrativeChars:
      (input.session?.title?.length ?? 0) + (input.session?.description?.length ?? 0),
    truncatedFindings: truncated,
    contextBudget: input.contextBudget,
  });

  const frozenTouched = openFindings.some((f) => f.code.startsWith('GOV.FROZEN'));
  const forbiddenActions = buildForbiddenActions(
    input,
    completedChecks,
    gitResolved.git,
    overflow.overflowRisk,
    {
      frozenModuleTouched: frozenTouched,
      conflictRisk: gitResolved.conflictRisk,
      staleWorktrees: gitResolved.staleWorktrees,
    }
  );

  const previousChain: string[] = [];
  const suggestedToolChain = buildSuggestedToolChain(
    openFindings,
    reports,
    gitResolved.git.changedFilesCount,
    previousChain
  );

  const taskStatus = (input.session?.status ?? 'in_progress') as TaskStatus;
  const brief: HandoffBriefDocument = {
    $schema: 'https://carihub.local/camcp/schemas/handoff-brief@1.0.0.json',
    schemaVersion: HANDOFF_BRIEF_SCHEMA_VERSION,
    briefId: `${runId}:${facet}`,
    facet,
    generatedAt: now.toISOString(),
    generator: {
      toolId: 'context.handoff',
      engineId: 'handoff-engine',
      engineVersion: HANDOFF_ENGINE_VERSION,
      reportsEngineVersion: REPORT_SCHEMA_VERSION,
    },
    task: {
      title: input.session?.title ?? 'CAMCP handoff session',
      description: input.session?.description,
      status: taskStatus,
      objective: input.session?.objective,
      outOfScope: input.session?.outOfScope,
    },
    git: gitResolved.git,
    ssotVersions,
    ssotHashes,
    completedChecks,
    openFindings,
    evidenceRefs,
    forbiddenActions,
    suggestedToolChain,
    scope: {
      paths: input.scope?.paths ?? [],
      sectors: input.scope?.sectors ?? [],
      subcategoriaIds: input.scope?.subcategoriaIds ?? [],
    },
    contextMetrics: {
      estimatedTokens: overflow.estimatedTokens,
      budgetMaxTokens: overflow.budgetMaxTokens,
      utilizationRatio: overflow.utilizationRatio,
      overflowRisk: overflow.overflowRisk,
      recommendNewChat: overflow.recommendNewChat,
      components: overflow.components,
    },
    historicalEvidence: input.historicalEvidence,
  };

  if (previous?.briefId && previous.path) {
    brief.supersedes = {
      briefId: previous.briefId,
      path: previous.path,
    };
  }

  return {
    brief,
    gitContextPath: gitResolved.gitContextPath,
    truncatedFindings: truncated,
    noEvidence,
    prUnavailable: gitResolved.prUnavailable,
    staleChecksCount,
  };
}

export function validateHandoffBrief(brief: HandoffBriefDocument): string[] {
  const errors: string[] = [];
  if (!brief.schemaVersion) errors.push('schemaVersion');
  if (!brief.briefId) errors.push('briefId');
  if (!brief.task?.title) errors.push('task.title');
  if (!brief.git?.commit) errors.push('git.commit');
  if (!brief.git?.branch) errors.push('git.branch');
  if (!Array.isArray(brief.forbiddenActions) || !brief.forbiddenActions.length) {
    errors.push('forbiddenActions');
  }
  for (const f of brief.openFindings) {
    if (!f.reportRef) errors.push(`openFinding.${f.findingId}.reportRef`);
  }
  return errors;
}
