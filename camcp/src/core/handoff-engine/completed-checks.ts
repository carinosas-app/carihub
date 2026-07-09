import fs from 'node:fs';
import path from 'node:path';
import { runContractGate } from '../contract-engine/gate.js';
import { evaluateInvalidation } from '../invalidation-registry/evaluate.js';
import type { CompletedCheck as IrCompletedCheck } from '../invalidation-registry/types.js';
import type { SnapshotRef } from '../invalidation-registry/types.js';
import { REPORT_SCHEMA_VERSION } from '../../reports/constants.js';
import type { HandoffCompletedCheck, HandoffInput } from './types.js';
import type { LoadedReport } from './report-loader.js';
import { loadHandoffConfig } from './config-loader.js';

function reportMissing(reportRef: string, repoRoot: string): boolean {
  return !fs.existsSync(path.resolve(repoRoot, reportRef));
}

function toIrCheck(report: LoadedReport, maxAgeMs: number): IrCompletedCheck {
  return {
    id: `${report.toolId}:${report.facet ?? 'default'}`,
    toolId: report.toolId,
    facet: report.facet,
    runId: report.runId,
    status: report.status,
    ssotHash: report.ssotHashes,
    ssotVersions: report.ssotVersions,
    gitCommit: report.gitCommit,
    gitBranch: report.gitBranch,
    completedAt: report.generatedAt,
    maxAgeMs,
    schemaVersion: report.legacy ? '1.0.0' : REPORT_SCHEMA_VERSION,
  };
}

function buildCurrentSnapshots(repoRoot: string, reports: LoadedReport[]): SnapshotRef[] {
  const map = new Map<string, SnapshotRef>();
  for (const r of reports) {
    for (const [ssotId, contentHash] of Object.entries(r.ssotHashes)) {
      map.set(ssotId, { ssotId, contentHash, version: r.ssotVersions[ssotId] ?? null });
    }
  }
  if (!map.has('registro-schema-index')) {
    try {
      const gate = runContractGate({ repoRoot, facadeId: 'catalog.audit', facet: 'summary' });
      for (const s of gate.snapshots) {
        map.set(s.ssotId, {
          ssotId: s.ssotId,
          contentHash: s.contentHash,
          version: s.versionField ?? s.version ?? null,
          path: s.path,
        });
      }
    } catch {
      /* optional */
    }
  }
  return [...map.values()];
}

export function buildCompletedChecks(
  repoRoot: string,
  reports: LoadedReport[],
  input: HandoffInput,
  gitContext: { commit: string | null; branch: string | null }
): HandoffCompletedCheck[] {
  const cfg = loadHandoffConfig();
  const maxAgeMs = input.reports?.maxAgeMs ?? cfg.defaults.maxAgeMs;
  const forceRefresh = input.operator?.forceRefresh ?? false;
  const irChecks = reports.map((r) => toIrCheck(r, maxAgeMs));
  const snapshots = buildCurrentSnapshots(repoRoot, reports);
  const evaluation = evaluateInvalidation({
    repoRoot,
    currentSnapshots: snapshots,
    gitContext: { commit: gitContext.commit, branch: gitContext.branch },
    completedChecks: irChecks,
    forceRefresh,
  });
  const evalMap = new Map(evaluation.checks.map((c) => [c.id, c]));

  return reports.map((report) => {
    const id = `${report.toolId}:${report.facet ?? 'default'}`;
    const ev = evalMap.get(id);
    const missing = report.missing || reportMissing(report.reportRef, repoRoot);
    let valid = ev?.valid ?? true;
    let invalidatedReason: HandoffCompletedCheck['invalidatedReason'] = ev?.reason ?? null;
    if (missing) {
      valid = false;
      invalidatedReason = 'report_missing';
    }
    return {
      toolId: report.toolId,
      facet: report.facet,
      runId: report.runId,
      status: report.status,
      maxSeverity: report.maxSeverity,
      reportRef: report.reportRef,
      ssotHash: report.ssotHashes,
      valid,
      invalidatedReason,
      completedAt: report.generatedAt,
      schemaV1: report.legacy,
    };
  });
}

export function aggregateSsotMaps(reports: LoadedReport[]): {
  ssotVersions: Record<string, string>;
  ssotHashes: Record<string, string>;
} {
  const ssotVersions: Record<string, string> = {
    'camcp-report-schema': REPORT_SCHEMA_VERSION,
    'handoff-brief-schema': '1.0.0',
  };
  const ssotHashes: Record<string, string> = {};
  for (const r of reports) {
    Object.assign(ssotVersions, r.ssotVersions);
    Object.assign(ssotHashes, r.ssotHashes);
  }
  return { ssotVersions, ssotHashes };
}
