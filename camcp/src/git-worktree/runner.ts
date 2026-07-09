import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../policy/permissions.js';
import { assertReportWritePathAllowed } from '../policy/path-guard.js';
import { makeReportRunDir } from '../qa/report-runner.js';
import {
  buildCleanupFindings,
  buildConflictFindings,
  buildDiffFindings,
  buildGitContextHealth,
  buildPrFindings,
  buildRecommendFindings,
  buildStaleFindings,
  buildStateFindings,
  capabilityForFacet,
  composeGitContext,
  facetsForInput,
  loadGitWorktreeConfig,
  resetFindingSeq,
  type GitWorktreeFacet,
  type GitWorktreeInput,
} from '../core/git-context-engine/index.js';
import { buildReportFromFindings, writeCamcpReport } from '../reports/writer.js';
import type { CamcpReport, ReportFinding, WriteReportOptions } from '../reports/schema.js';

export interface GitWorktreeRunResult {
  ok: boolean;
  facet: GitWorktreeFacet;
  report: CamcpReport;
  reportPaths: string[];
  gitContextPath: string | null;
  gitContextHealthPath: string | null;
  bundlePath: string | null;
  gitContext: ReturnType<typeof composeGitContext>['gitContext'];
  gitContextHealth: ReturnType<typeof buildGitContextHealth> | null;
}

function collectFindingsForFacet(
  facet: GitWorktreeFacet,
  composed: ReturnType<typeof composeGitContext>
): ReportFinding[] {
  const wtCfg = loadGitWorktreeConfig();
  const findings: ReportFinding[] = [];

  findings.push(...buildStateFindings(composed.state, facet));

  if (facet === 'diff' || facet === 'full') {
    findings.push(
      ...buildDiffFindings(
        composed.diff,
        composed.diffComputed,
        wtCfg.diff.largeChangeThreshold
      )
    );
  }
  if (facet === 'pr_status' || facet === 'full') {
    findings.push(
      ...buildPrFindings(composed.pr, composed.ghAvailable, composed.prFound)
    );
  }
  if (facet === 'conflicts' || facet === 'full') {
    findings.push(
      ...buildConflictFindings({
        conflictRisk: composed.conflictRisk,
        pathIntersections: [],
      })
    );
  }
  if (facet === 'stale' || facet === 'full') {
    findings.push(
      ...buildStaleFindings(
        { staleWorktreeIds: composed.staleWorktreeIds },
        composed.state.worktrees
      )
    );
  }
  if (facet === 'cleanup_report' || facet === 'full') {
    findings.push(...buildCleanupFindings(composed.cleanupCandidates));
  }
  if (facet === 'recommend' || facet === 'full') {
    findings.push(...buildRecommendFindings(composed.recommendations));
  }

  if (!findings.length) {
    findings.push({
      id: 'GW-OK',
      severity: 'PASS',
      message: `git.worktree:${facet} completed`,
    });
  }

  return findings;
}

function writeGitContextArtifacts(
  repoRoot: string,
  config: CamcpConfig,
  reportDir: string,
  gitContext: ReturnType<typeof composeGitContext>['gitContext'],
  gitContextHealth: ReturnType<typeof buildGitContextHealth>,
  facet: GitWorktreeFacet,
  bundle: unknown | null
): { gitContextPath: string; gitContextHealthPath: string; bundlePath: string | null } {
  const gitContextPath = path.join(reportDir, 'git-context.json');
  const gitContextHealthPath = path.join(reportDir, 'git-context-health.json');

  for (const p of [gitContextPath, gitContextHealthPath]) {
    assertReportWritePathAllowed(repoRoot, p, config);
  }

  fs.writeFileSync(gitContextPath, JSON.stringify(gitContext, null, 2), 'utf8');
  fs.writeFileSync(gitContextHealthPath, JSON.stringify(gitContextHealth, null, 2), 'utf8');

  let bundlePath: string | null = null;
  if (facet === 'full' && bundle) {
    const bundleDir = path.join(reportDir, 'bundles');
    fs.mkdirSync(bundleDir, { recursive: true });
    bundlePath = path.join(bundleDir, 'full-bundle.json');
    assertReportWritePathAllowed(repoRoot, bundlePath, config);
    fs.writeFileSync(bundlePath, JSON.stringify(bundle, null, 2), 'utf8');
  }

  return {
    gitContextPath: path.relative(repoRoot, gitContextPath).replace(/\\/g, '/'),
    gitContextHealthPath: path.relative(repoRoot, gitContextHealthPath).replace(/\\/g, '/'),
    bundlePath: bundlePath
      ? path.relative(repoRoot, bundlePath).replace(/\\/g, '/')
      : null,
  };
}

export function runGitWorktree(
  repoRoot: string,
  config: CamcpConfig,
  input: GitWorktreeInput = {}
): GitWorktreeRunResult {
  resetFindingSeq();
  const t0 = Date.now();
  const facet: GitWorktreeFacet = input.facet ?? 'state';
  const facetSet = facetsForInput(facet);
  const composed = composeGitContext(repoRoot, config, input, facetSet);
  const findings = collectFindingsForFacet(facet, composed);

  const gitContextHealth = buildGitContextHealth({
    state: composed.state,
    diffComputed: composed.diffComputed,
    prStatusKnown: composed.prStatusKnown,
    conflictRiskLevel: composed.conflictRisk,
    staleWorktreeCount: composed.staleWorktreeIds.length,
  });

  const summary = `git.worktree:${facet} — ${composed.state.worktrees.length} worktree(s), risk=${composed.conflictRisk}, health=${gitContextHealth.overallStatus}`;

  const report = buildReportFromFindings({
    module: 'git.worktree',
    gitCommit: composed.state.activeWorktree.headShort ?? composed.state.activeWorktree.headCommit,
    durationMs: Date.now() - t0,
    summary,
    findings,
    evidencePaths: [],
  });

  const writeOptions: WriteReportOptions = {
    facet,
    capability: capabilityForFacet(facet),
    domains: ['GIT', 'WORKTREE', 'PR'],
    git: {
      commit: composed.state.activeWorktree.headShort ?? composed.state.activeWorktree.headCommit,
      branch: composed.state.activeWorktree.branch,
      worktreeId: composed.state.activeWorktree.id,
    },
    provenance: {
      engines: [
        { id: 'git-context-engine', version: '1.0.0' },
        { id: 'reports-engine', version: '2.0.0' },
      ],
    },
    suggestedNext: {
      tools: composed.suggestedTools,
      qaModules: [],
    },
  };

  const reportPaths = writeCamcpReport(repoRoot, config, 'git.worktree', report, writeOptions);
  const manifestPath = reportPaths.find((p) => p.endsWith('manifest.json'));
  const reportDir = manifestPath
    ? path.resolve(repoRoot, path.dirname(manifestPath))
    : makeReportRunDir(repoRoot, config, 'git.worktree').reportDir;

  const bundle =
    facet === 'full'
      ? {
          schemaVersion: '1.0.0',
          toolId: 'git.worktree',
          facet: 'full',
          gitContext: composed.gitContext,
          gitContextHealth,
        }
      : null;

  const ctxPaths = writeGitContextArtifacts(
    repoRoot,
    config,
    reportDir,
    composed.gitContext,
    gitContextHealth,
    facet,
    bundle
  );

  const ok =
    gitContextHealth.overallStatus !== 'FAIL' &&
    !findings.some((f) => f.severity === 'BLOQUEADOR');

  return {
    ok,
    facet,
    report,
    reportPaths: [...reportPaths, ctxPaths.gitContextPath, ctxPaths.gitContextHealthPath].filter(
      Boolean
    ),
    gitContextPath: ctxPaths.gitContextPath,
    gitContextHealthPath: ctxPaths.gitContextHealthPath,
    bundlePath: ctxPaths.bundlePath,
    gitContext: composed.gitContext,
    gitContextHealth,
  };
}
