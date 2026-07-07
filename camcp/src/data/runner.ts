import type { CamcpConfig } from '../policy/permissions.js';
import type { QaRunResult } from '../qa/report-runner.js';
import {
  qaRunParidadVm,
  qaRunP0PersistPrivacy,
  qaRunSubmitHydrate,
  qaRunValidarSchemas,
} from '../tools/qa.tools.js';
import { aggregateDataReport, writeCamcpReport } from '../reports/aggregator.js';
import type { CamcpReport } from '../reports/schema.js';
import { listQaEvidencePaths } from './json-read.js';
import { parseDataHydrateFindings } from './parsers/hydrate.js';
import { parseDataPersistFindings } from './parsers/persist.js';
import { parseDataPipelineFindings } from './parsers/pipeline.js';
import { parseDataSchemaFindings } from './parsers/schema.js';

export interface DataRunResult {
  ok: boolean;
  qaTool: string;
  qaResult: QaRunResult;
  report: CamcpReport;
  reportPaths: string[];
}

export function runDataPipelineStatus(
  repoRoot: string,
  config: CamcpConfig,
  opts: {
    sector?: string;
    sub?: string;
    maxSubs?: number;
    failFast?: boolean;
    gitCommit?: string | null;
  } = {}
): DataRunResult {
  const t0 = Date.now();
  const qaResult = qaRunParidadVm(repoRoot, config, opts);
  const parsed = parseDataPipelineFindings(repoRoot, qaResult, qaResult.ok);
  const report = aggregateDataReport({
    module: 'data.pipeline_status',
    qaTool: 'qa.run_paridad_vm',
    gitCommit: opts.gitCommit ?? null,
    durationMs: Date.now() - t0,
    summary: parsed.summary,
    findings: parsed.findings,
    evidencePaths: listQaEvidencePaths(repoRoot, qaResult),
  });
  const reportPaths = writeCamcpReport(repoRoot, config, 'data.pipeline_status', report);
  return {
    ok: report.status === 'PASS',
    qaTool: 'qa.run_paridad_vm',
    qaResult,
    report,
    reportPaths,
  };
}

export function runDataPersistAudit(
  repoRoot: string,
  config: CamcpConfig,
  opts: { gitCommit?: string | null } = {}
): DataRunResult {
  const t0 = Date.now();
  const qaResult = qaRunP0PersistPrivacy(repoRoot, config);
  const parsed = parseDataPersistFindings(repoRoot, qaResult, qaResult.ok);
  const report = aggregateDataReport({
    module: 'data.persist_audit',
    qaTool: 'qa.run_p0_persist_privacy',
    gitCommit: opts.gitCommit ?? null,
    durationMs: Date.now() - t0,
    summary: parsed.summary,
    findings: parsed.findings,
    evidencePaths: listQaEvidencePaths(repoRoot, qaResult),
  });
  const reportPaths = writeCamcpReport(repoRoot, config, 'data.persist_audit', report);
  return {
    ok: report.status === 'PASS',
    qaTool: 'qa.run_p0_persist_privacy',
    qaResult,
    report,
    reportPaths,
  };
}

export function runDataHydrateAudit(
  repoRoot: string,
  config: CamcpConfig,
  opts: { gitCommit?: string | null } = {}
): DataRunResult {
  const t0 = Date.now();
  const qaResult = qaRunSubmitHydrate(repoRoot, config);
  const parsed = parseDataHydrateFindings(repoRoot, qaResult, qaResult.ok);
  const report = aggregateDataReport({
    module: 'data.hydrate_audit',
    qaTool: 'qa.run_submit_hydrate',
    gitCommit: opts.gitCommit ?? null,
    durationMs: Date.now() - t0,
    summary: parsed.summary,
    findings: parsed.findings,
    evidencePaths: listQaEvidencePaths(repoRoot, qaResult),
  });
  const reportPaths = writeCamcpReport(repoRoot, config, 'data.hydrate_audit', report);
  return {
    ok: report.status === 'PASS',
    qaTool: 'qa.run_submit_hydrate',
    qaResult,
    report,
    reportPaths,
  };
}

export function runDataSchemaAlignment(
  repoRoot: string,
  config: CamcpConfig,
  opts: { gitCommit?: string | null } = {}
): DataRunResult {
  const t0 = Date.now();
  const qaResult = qaRunValidarSchemas(repoRoot, config);
  const parsed = parseDataSchemaFindings(repoRoot, qaResult, qaResult.ok);
  const evidence = [
    ...listQaEvidencePaths(repoRoot, qaResult),
    'scripts/validacion-schemas-report.json',
  ];
  const report = aggregateDataReport({
    module: 'data.schema_alignment',
    qaTool: 'qa.run_validar_schemas',
    gitCommit: opts.gitCommit ?? null,
    durationMs: Date.now() - t0,
    summary: parsed.summary,
    findings: parsed.findings,
    evidencePaths: evidence,
  });
  const reportPaths = writeCamcpReport(repoRoot, config, 'data.schema_alignment', report);
  return {
    ok: report.status === 'PASS',
    qaTool: 'qa.run_validar_schemas',
    qaResult,
    report,
    reportPaths,
  };
}
