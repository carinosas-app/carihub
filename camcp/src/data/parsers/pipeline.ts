import type { ReportFinding } from '../../reports/schema.js';
import type { QaRunResult } from '../../qa/report-runner.js';
import { readQaArtifact } from '../json-read.js';

interface StageRecord {
  ok?: boolean;
  fieldCount?: number;
  keys?: number;
}

interface SubPipelineResult {
  subcategoriaId?: string;
  sectorId?: string;
  status?: string;
  pipelineError?: string;
  stages?: Record<string, StageRecord>;
}

interface PipelineSummary {
  summary?: {
    totalSubs?: number;
    subsPass?: number;
    subsFail?: number;
    pipelineErrors?: number;
    fieldFail?: number;
  };
  subResults?: SubPipelineResult[];
  topFailures?: Array<{ subcategoriaId?: string; failCount?: number }>;
}

const STAGE_ORDER = ['mock', 'map', 'build', 'slim', 'hydrate', 'privacyGuard'] as const;

export function parseDataPipelineFindings(
  repoRoot: string,
  qaResult: QaRunResult,
  ok: boolean
): { findings: ReportFinding[]; summary: string } {
  const pipeline = readQaArtifact<PipelineSummary>(repoRoot, qaResult, 'pipeline-summary.json');
  const findings: ReportFinding[] = [];
  const ps = pipeline?.summary;
  const subs = pipeline?.subResults ?? [];

  const stageFails: Record<string, number> = {};
  for (const sub of subs) {
    if (sub.status === 'FAIL' || sub.pipelineError) {
      findings.push({
        id: `DATA-PIPE-SUB-${sub.subcategoriaId ?? 'unknown'}`,
        severity: 'IMPORTANTE',
        message: `Pipeline FAIL ${sub.subcategoriaId ?? '?'}: ${sub.pipelineError ?? sub.status}`,
        impact: 'Etapa del pipeline de datos rota',
        recommendation: 'Revisar pipeline-detail.json stages',
      });
    }
    for (const stage of STAGE_ORDER) {
      const st = sub.stages?.[stage];
      if (st && st.ok === false) {
        stageFails[stage] = (stageFails[stage] ?? 0) + 1;
      }
    }
  }

  for (const [stage, count] of Object.entries(stageFails)) {
    findings.push({
      id: `DATA-PIPE-STAGE-${stage.toUpperCase()}`,
      severity: stage === 'slim' || stage === 'hydrate' ? 'BLOQUEADOR' : 'IMPORTANTE',
      message: `${count} sub(s) con etapa \`${stage}\` FAIL`,
      impact: 'Contrato registro → persist → hydrate inconsistente',
      recommendation: 'Revisar pipeline-summary.json subResults.stages',
    });
  }

  if ((ps?.pipelineErrors ?? 0) > 0) {
    findings.push({
      id: 'DATA-PIPE-ERRORS',
      severity: 'BLOQUEADOR',
      message: `${ps!.pipelineErrors} pipeline error(s) en VM QA`,
      evidence: qaResult.manifest.reportDir,
    });
  }

  if ((ps?.subsFail ?? 0) > 0 && findings.length === 0) {
    findings.push({
      id: 'DATA-PIPE-001',
      severity: 'IMPORTANTE',
      message: `${ps!.subsFail}/${ps!.totalSubs ?? '?'} sub(s) FAIL en pipeline de datos`,
    });
  }

  if (!ok && findings.every((f) => f.severity === 'PASS' || f.severity === 'INFO')) {
    findings.push({
      id: 'DATA-PIPE-EXIT',
      severity: 'IMPORTANTE',
      message: `data pipeline QA exit=${qaResult.manifest.exitCode}`,
      evidence: qaResult.manifest.reportDir,
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: 'DATA-PIPE-PASS',
      severity: 'PASS',
      message: 'Data pipeline stages PASS for scoped run',
    });
  }

  const summary = ps
    ? `Data pipeline: ${ps.subsPass ?? 0} pass, ${ps.subsFail ?? 0} fail, pipelineErrors=${ps.pipelineErrors ?? 0}.`
    : `Data pipeline delegated to qa.run_paridad_vm (exit ${qaResult.manifest.exitCode}).`;

  return { findings, summary };
}
