import type {
  ContextOverflowAssessment,
  HandoffBriefDocument,
  HandoffInput,
  OverflowRiskLevel,
  RecommendChatOutput,
} from './types.js';
import { loadHandoffConfig } from './config-loader.js';

export interface OverflowInput {
  openFindingsCount: number;
  evidenceRefsCount: number;
  completedChecksCount: number;
  gitChangedFilesCount: number;
  taskNarrativeChars: number;
  truncatedFindings: boolean;
  contextBudget?: HandoffInput['contextBudget'];
}

export function estimateOverflowMetrics(input: OverflowInput): {
  estimatedTokens: number;
  budgetMaxTokens: number;
  utilizationRatio: number;
  overflowRisk: OverflowRiskLevel;
  recommendNewChat: boolean;
  components: HandoffBriefDocument['contextMetrics']['components'];
} {
  const cfg = loadHandoffConfig();
  const budgetMax =
    input.contextBudget?.maxEstimatedTokens ?? cfg.defaults.contextBudget.maxEstimatedTokens;
  const warnThreshold =
    input.contextBudget?.warnThreshold ?? cfg.defaults.contextBudget.warnThreshold;
  const criticalThreshold =
    input.contextBudget?.criticalThreshold ?? cfg.defaults.contextBudget.criticalThreshold;

  const openFindings = input.openFindingsCount * 80 + 200;
  const evidenceRefs = input.evidenceRefsCount * 40 + 100;
  const completedChecks = input.completedChecksCount * 50;
  const gitContext = 300 + input.gitChangedFilesCount * 20;
  const taskNarrative = Math.min(500, Math.floor(input.taskNarrativeChars / 4));
  const reservedHeadroom = Math.max(1500, Math.floor(budgetMax * 0.2));
  const misc = 200;

  const estimatedTokens =
    openFindings +
    evidenceRefs +
    completedChecks +
    gitContext +
    taskNarrative +
    misc +
    reservedHeadroom;

  const utilizationRatio = budgetMax > 0 ? estimatedTokens / budgetMax : 1;

  let overflowRisk: OverflowRiskLevel = 'low';
  if (input.truncatedFindings || utilizationRatio >= 1) {
    overflowRisk = 'critical';
  } else if (utilizationRatio >= criticalThreshold) {
    overflowRisk = 'high';
  } else if (utilizationRatio >= warnThreshold) {
    overflowRisk = 'medium';
  }

  const recommendNewChat = overflowRisk === 'high' || overflowRisk === 'critical';

  return {
    estimatedTokens,
    budgetMaxTokens: budgetMax,
    utilizationRatio: Math.round(utilizationRatio * 1000) / 1000,
    overflowRisk,
    recommendNewChat,
    components: {
      openFindings,
      evidenceRefs,
      gitContext,
      completedChecks,
      taskNarrative,
      reservedHeadroom,
    },
  };
}

export function assessOverflow(input: OverflowInput): ContextOverflowAssessment {
  const metrics = estimateOverflowMetrics(input);
  const recommendations: string[] = [];
  if (metrics.overflowRisk === 'medium') {
    recommendations.push('Use continuation_brief facet instead of full handoff');
  }
  if (metrics.overflowRisk === 'high' || metrics.overflowRisk === 'critical') {
    recommendations.push('Reduce maxOpenFindings to 10');
    recommendations.push('Start a new chat with continuation brief');
  }
  if (input.truncatedFindings) {
    recommendations.push('Open findings were truncated — review source reports');
  }

  return {
    overflowRisk: metrics.overflowRisk,
    estimatedTokens: metrics.estimatedTokens,
    budgetMaxTokens: metrics.budgetMaxTokens,
    utilizationRatio: metrics.utilizationRatio,
    recommendNewChat: metrics.recommendNewChat,
    recommendContinuationBrief: metrics.overflowRisk !== 'low',
    recommendations,
  };
}

export function recommendChatFromOverflow(
  assessment: ContextOverflowAssessment
): RecommendChatOutput {
  if (assessment.overflowRisk === 'critical' || assessment.overflowRisk === 'high') {
    return {
      recommendNewChat: true,
      reason: `Overflow risk ${assessment.overflowRisk} (${Math.round(assessment.utilizationRatio * 100)}% budget)`,
      suggestedFacet: 'continuation_brief',
      overflowRisk: assessment.overflowRisk,
    };
  }
  if (assessment.overflowRisk === 'medium') {
    return {
      recommendNewChat: false,
      reason: 'Medium overflow — generate continuation_brief when closing session',
      suggestedFacet: 'continuation_brief',
      overflowRisk: assessment.overflowRisk,
    };
  }
  return {
    recommendNewChat: false,
    reason: 'Low overflow — continue current session',
    suggestedFacet: 'handoff',
    overflowRisk: assessment.overflowRisk,
  };
}
