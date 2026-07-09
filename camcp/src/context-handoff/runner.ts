import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../policy/permissions.js';
import { assertReportWritePathAllowed } from '../policy/path-guard.js';
import {
  assessOverflow,
  buildHandoffBrief,
  buildHandoffMetaFindings,
  recommendChatFromOverflow,
  renderContinuationBriefMd,
  resetHandoffFindingSeq,
  validateHandoffBrief,
  type HandoffBriefDocument,
  type HandoffFacet,
  type HandoffInput,
  type RecommendChatOutput,
  type SummarizeOutput,
} from '../core/handoff-engine/index.js';
import { buildReportFromFindings, writeCamcpReport } from '../reports/writer.js';
import type { CamcpReport, ReportFinding, WriteReportOptions } from '../reports/schema.js';

export interface ContextHandoffRunResult {
  ok: boolean;
  facet: HandoffFacet;
  brief: HandoffBriefDocument | null;
  summarize: SummarizeOutput | null;
  overflow: ReturnType<typeof assessOverflow> | null;
  recommendChat: RecommendChatOutput | null;
  report: CamcpReport | null;
  reportPaths: string[];
  handoffBriefPath: string | null;
  continuationBriefPath: string | null;
}

function capabilityForFacet(facet: HandoffFacet): 'read-only' | 'report-only' {
  return facet === 'handoff' || facet === 'continuation_brief' ? 'report-only' : 'read-only';
}

function writeHandoffArtifacts(
  repoRoot: string,
  config: CamcpConfig,
  reportDir: string,
  brief: HandoffBriefDocument,
  facet: HandoffFacet
): { handoffBriefPath: string; continuationBriefPath: string | null; pointerIndexPath: string } {
  const handoffBriefPath = path.join(reportDir, 'handoff-brief.json');
  const continuationBriefPath =
    facet === 'handoff' || facet === 'continuation_brief'
      ? path.join(reportDir, 'continuationBrief.md')
      : null;
  const evidenceDir = path.join(reportDir, 'evidence');
  const pointerIndexPath = path.join(evidenceDir, 'pointer-index.json');

  for (const p of [handoffBriefPath, pointerIndexPath]) {
    assertReportWritePathAllowed(repoRoot, p, config);
  }
  if (continuationBriefPath) {
    assertReportWritePathAllowed(repoRoot, continuationBriefPath, config);
  }

  fs.writeFileSync(handoffBriefPath, JSON.stringify(brief, null, 2), 'utf8');
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(
    pointerIndexPath,
    JSON.stringify({ evidenceRefs: brief.evidenceRefs }, null, 2),
    'utf8'
  );

  if (continuationBriefPath) {
    fs.writeFileSync(continuationBriefPath, renderContinuationBriefMd(brief), 'utf8');
  }

  return {
    handoffBriefPath: path.relative(repoRoot, handoffBriefPath).replace(/\\/g, '/'),
    continuationBriefPath: continuationBriefPath
      ? path.relative(repoRoot, continuationBriefPath).replace(/\\/g, '/')
      : null,
    pointerIndexPath: path.relative(repoRoot, pointerIndexPath).replace(/\\/g, '/'),
  };
}

export function runContextHandoff(
  repoRoot: string,
  config: CamcpConfig,
  input: HandoffInput = {}
): ContextHandoffRunResult {
  resetHandoffFindingSeq();
  const t0 = Date.now();
  const facet: HandoffFacet = input.facet ?? 'summarize';
  const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  const built = buildHandoffBrief(repoRoot, config, input, facet, runId);
  const validationErrors = validateHandoffBrief(built.brief);
  if (validationErrors.length) {
    return {
      ok: false,
      facet,
      brief: null,
      summarize: null,
      overflow: null,
      recommendChat: null,
      report: null,
      reportPaths: [],
      handoffBriefPath: null,
      continuationBriefPath: null,
    };
  }

  const brief = built.brief;
  const overflow = assessOverflow({
    openFindingsCount: brief.openFindings.length,
    evidenceRefsCount: brief.evidenceRefs.length,
    completedChecksCount: brief.completedChecks.length,
    gitChangedFilesCount: brief.git.changedFilesCount,
    taskNarrativeChars:
      (input.session?.title?.length ?? 0) + (input.session?.description?.length ?? 0),
    truncatedFindings: built.truncatedFindings,
    contextBudget: input.contextBudget,
  });

  const recommendChat = recommendChatFromOverflow(overflow);

  const summarize: SummarizeOutput = {
    taskStatus: brief.task.status,
    git: {
      branch: brief.git.branch,
      commit: brief.git.commit,
      dirty: brief.git.dirty,
    },
    openFindingsCount: brief.openFindings.length,
    completedChecksValid: brief.completedChecks.filter((c) => c.valid).length,
    completedChecksStale: built.staleChecksCount,
    overflowRisk: overflow.overflowRisk,
    latestReports: brief.completedChecks.slice(0, 5).map((c) => ({
      toolId: c.toolId,
      runId: c.runId,
      status: c.status,
    })),
  };

  const metaFindings = buildHandoffMetaFindings({
    noEvidence: built.noEvidence,
    prUnavailable: built.prUnavailable,
    staleChecks: brief.completedChecks,
    truncatedFindings: built.truncatedFindings,
    facet,
  });

  const isReportOnly = capabilityForFacet(facet) === 'report-only';
  let report: CamcpReport | null = null;
  let reportPaths: string[] = [];
  let handoffBriefPath: string | null = null;
  let continuationBriefPath: string | null = null;

  if (isReportOnly) {
    report = buildReportFromFindings({
      module: 'context.handoff',
      gitCommit: brief.git.commit,
      durationMs: Date.now() - t0,
      summary: `context.handoff:${facet} — ${brief.openFindings.length} open finding(s), ${built.staleChecksCount} stale check(s)`,
      findings: metaFindings,
      evidencePaths: [],
    });

    const writeOptions: WriteReportOptions = {
      facet,
      capability: 'report-only',
      domains: ['CAMCP'],
      git: {
        commit: brief.git.commit,
        branch: brief.git.branch,
        worktreeId: brief.git.worktree?.id ?? null,
      },
      provenance: {
        engines: [
          { id: 'handoff-engine', version: '1.0.0' },
          { id: 'reports-engine', version: '2.0.0' },
        ],
      },
      suggestedNext: {
        tools: brief.suggestedToolChain,
        qaModules: [],
      },
    };

    reportPaths = writeCamcpReport(repoRoot, config, 'context.handoff', report, writeOptions);
    const manifestPath = reportPaths.find((p) => p.endsWith('manifest.json'));
    if (!manifestPath) {
      throw new Error('context.handoff report manifest missing after write');
    }
    const outDir = path.resolve(repoRoot, path.dirname(manifestPath));
    const artifacts = writeHandoffArtifacts(repoRoot, config, outDir, brief, facet);
    handoffBriefPath = artifacts.handoffBriefPath;
    continuationBriefPath = artifacts.continuationBriefPath;
    reportPaths.push(artifacts.handoffBriefPath, artifacts.pointerIndexPath);
    if (artifacts.continuationBriefPath) reportPaths.push(artifacts.continuationBriefPath);
  }

  const ok =
    validationErrors.length === 0 &&
    !metaFindings.some((f: ReportFinding) => f.severity === 'BLOQUEADOR');

  return {
    ok,
    facet,
    brief,
    summarize,
    overflow,
    recommendChat,
    report,
    reportPaths,
    handoffBriefPath,
    continuationBriefPath,
  };
}
