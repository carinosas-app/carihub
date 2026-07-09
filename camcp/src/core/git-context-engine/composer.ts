import type { CamcpConfig } from '../../policy/permissions.js';
import { loadGitWorktreeConfig } from './config-loader.js';
import { buildCleanupReport } from './cleanup-report.js';
import {
  analyzeConflicts,
  duplicateBranchWorktreeIds,
} from './conflicts.js';
import { fetchPrContext } from './gh-readonly.js';
import { buildRecommendations, suggestedToolChain } from './recommend.js';
import { analyzeStaleWorktrees } from './stale.js';
import { buildDiffSummary, buildGitState } from './state.js';
import type {
  CleanupCandidate,
  GitContextDocument,
  GitRecommendation,
  GitWorktreeFacet,
  GitWorktreeInput,
  PrContext,
} from './types.js';
import { GIT_CONTEXT_SCHEMA_VERSION } from './types.js';
import type { DiffSummary } from './types.js';
import type { ConflictRiskLevel } from './types.js';
import type { StateBuildResult } from './state.js';

export interface ComposeResult {
  gitContext: GitContextDocument;
  state: StateBuildResult;
  diff: DiffSummary | null;
  diffComputed: boolean;
  pr: PrContext;
  prStatusKnown: boolean;
  ghAvailable: boolean;
  prFound: boolean;
  conflictRisk: ConflictRiskLevel;
  staleWorktreeIds: string[];
  cleanupCandidates: CleanupCandidate[];
  recommendations: GitRecommendation[];
  suggestedTools: string[];
}

export function composeGitContext(
  repoRoot: string,
  config: CamcpConfig,
  input: GitWorktreeInput,
  facets: Set<GitWorktreeFacet>
): ComposeResult {
  const wtCfg = loadGitWorktreeConfig();
  const state = buildGitState(repoRoot, config, input);
  const baseRef = input.git?.baseRef ?? wtCfg.defaults.baseRef;

  let diff: DiffSummary | null = null;
  let diffComputed = false;
  if (facets.has('diff') || facets.has('full') || facets.has('recommend') || facets.has('conflicts')) {
    const built = buildDiffSummary(repoRoot, config, input, state.activeWorktree.path);
    diff = built.diff;
    diffComputed = built.computed;
  }

  let pr: PrContext = {
    number: null,
    url: null,
    state: null,
    title: null,
    checks: { total: 0, pass: 0, fail: 0, pending: 0 },
  };
  let prStatusKnown = false;
  let ghAvailable = false;
  let prFound = false;

  const prEnabled = input.pr?.enabled ?? wtCfg.pr.enabled;
  if ((facets.has('pr_status') || facets.has('full')) && prEnabled) {
    const fetched = fetchPrContext(
      repoRoot,
      config,
      state.activeWorktree.branch,
      input.pr?.prNumber ?? null,
      input.pr?.inferFromBranch ?? wtCfg.pr.inferFromBranch
    );
    pr = fetched.pr;
    ghAvailable = fetched.ghAvailable;
    prFound = fetched.prFound;
    prStatusKnown = ghAvailable;
  }

  let conflictRisk: ConflictRiskLevel = 'low';
  if (facets.has('conflicts') || facets.has('full') || facets.has('recommend')) {
    const analysis = analyzeConflicts(
      repoRoot,
      config,
      state.worktrees,
      state.duplicateBranchGroups,
      baseRef,
      state.activeWorktree.behind,
      state.activeWorktree.dirty
    );
    conflictRisk = analysis.conflictRisk;
  }

  let staleWorktreeIds: string[] = [];
  if (facets.has('stale') || facets.has('full') || facets.has('cleanup_report')) {
    staleWorktreeIds = analyzeStaleWorktrees(state.worktrees, input).staleWorktreeIds;
  }

  let cleanupCandidates: CleanupCandidate[] = [];
  if (facets.has('cleanup_report') || facets.has('full')) {
    cleanupCandidates = buildCleanupReport(state.worktrees, input);
  }

  let recommendations: GitRecommendation[] = [];
  if (facets.has('recommend') || facets.has('full')) {
    recommendations = buildRecommendations(
      {
        worktrees: state.worktrees,
        activeDirty: state.activeWorktree.dirty,
        conflictRisk,
        diff,
        behind: state.activeWorktree.behind,
      },
      input
    );
  }

  const gitContext: GitContextDocument = {
    $schema: 'https://carihub.local/camcp/schemas/git-context@1.0.0.json',
    schemaVersion: GIT_CONTEXT_SCHEMA_VERSION,
    capturedAt: new Date().toISOString(),
    repoRoot: state.repoRoot,
    activeWorktree: state.activeWorktree,
    worktrees: state.worktrees,
    diffSummary: diff,
    pr,
    risk: {
      conflictRisk,
      staleWorktrees: staleWorktreeIds,
      duplicateBranchWorktrees: duplicateBranchWorktreeIds(state.duplicateBranchGroups),
    },
    recommendations,
    cleanupCandidates: cleanupCandidates.length ? cleanupCandidates : undefined,
  };

  return {
    gitContext,
    state,
    diff,
    diffComputed,
    pr,
    prStatusKnown,
    ghAvailable,
    prFound,
    conflictRisk,
    staleWorktreeIds,
    cleanupCandidates,
    recommendations,
    suggestedTools: suggestedToolChain(recommendations),
  };
}

export function facetsForInput(facet: GitWorktreeFacet): Set<GitWorktreeFacet> {
  if (facet === 'full') {
    return new Set<GitWorktreeFacet>([
      'state',
      'diff',
      'pr_status',
      'conflicts',
      'stale',
      'cleanup_report',
      'recommend',
      'full',
    ]);
  }
  return new Set<GitWorktreeFacet>([facet, 'state']);
}

export function capabilityForFacet(facet: GitWorktreeFacet): 'read-only' | 'report-only' {
  return facet === 'state' ? 'read-only' : 'report-only';
}
