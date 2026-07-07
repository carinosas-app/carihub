import type { ReportFinding } from '../../reports/schema.js';
import type { ReportSeverity } from '../../intelligence/types.js';
import type { QaRunResult } from '../../qa/report-runner.js';
import { readQaArtifact } from '../json-read.js';

interface PipelineSummary {
  summary?: {
    totalSubs?: number;
    subsPass?: number;
    subsFail?: number;
    privacyViolations?: number;
    contaminationHits?: number;
    fieldFail?: number;
    pipelineErrors?: number;
  };
  topFailures?: Array<{ sectorId?: string; subcategoriaId?: string; failCount?: number }>;
}

interface VmFailure {
  subcategoriaId?: string;
  stage?: string;
  blockFieldId?: string;
  reason?: string;
  severity?: string;
}

function mapStageSeverity(stage: string | undefined, reason: string | undefined): ReportSeverity {
  const r = (reason ?? '').toLowerCase();
  const s = (stage ?? '').toLowerCase();
  if (s.includes('privacy') || r.includes('privacy') || r.includes('privado')) return 'BLOQUEADOR';
  if (s.includes('contamination') || r.includes('contamin')) return 'BLOQUEADOR';
  return 'IMPORTANTE';
}

export function parseParityVmFindings(
  repoRoot: string,
  qaResult: QaRunResult,
  ok: boolean
): { findings: ReportFinding[]; summary: string } {
  const pipeline = readQaArtifact<PipelineSummary>(repoRoot, qaResult, 'pipeline-summary.json');
  const failures = readQaArtifact<VmFailure[]>(repoRoot, qaResult, 'failures.json') ?? [];
  const findings: ReportFinding[] = [];
  const ps = pipeline?.summary;

  if ((ps?.privacyViolations ?? 0) > 0) {
    findings.push({
      id: 'PARITY-VM-PRIVACY',
      severity: 'BLOQUEADOR',
      message: `${ps!.privacyViolations} violación(es) PrivacyGuard en pipeline VM`,
      impact: 'Posible leak de campos privados en perfil público',
      recommendation: 'Revisar failures.json stage privacy',
    });
  }

  if ((ps?.contaminationHits ?? 0) > 0) {
    findings.push({
      id: 'PARITY-VM-CONTAMINATION',
      severity: 'BLOQUEADOR',
      message: `${ps!.contaminationHits} hit(s) anti-contaminación entre arquetipos`,
      recommendation: 'Revisar mapToPerfil branches',
    });
  }

  if ((ps?.subsFail ?? 0) > 0) {
    findings.push({
      id: 'PARITY-VM-SUBS-FAIL',
      severity: 'IMPORTANTE',
      message: `${ps!.subsFail}/${ps!.totalSubs ?? '?'} sub(s) FAIL en pipeline VM`,
      impact: 'Registro → persist → hydrate inconsistente',
    });
  }

  for (const [i, f] of failures.slice(0, 15).entries()) {
    findings.push({
      id: `PARITY-VM-F${i + 1}`,
      severity: mapStageSeverity(f.stage, f.reason),
      message: `${f.subcategoriaId ?? '?'} / ${f.stage ?? '?'}: ${f.reason ?? 'fail'}`,
      evidence: f.blockFieldId,
    });
  }

  if (failures.length > 15) {
    findings.push({
      id: 'PARITY-VM-MORE',
      severity: 'INFO',
      message: `${failures.length - 15} failure(s) adicionales en failures.json`,
    });
  }

  if (!ok && findings.every((f) => f.severity === 'PASS' || f.severity === 'INFO')) {
    findings.push({
      id: 'PARITY-VM-EXIT',
      severity: 'IMPORTANTE',
      message: `qa.run_paridad_vm exit=${qaResult.manifest.exitCode}`,
      evidence: qaResult.manifest.reportDir,
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: 'PARITY-VM-PASS',
      severity: 'PASS',
      message: 'VM pipeline parity PASS for scoped run',
    });
  }

  const summary = ps
    ? `VM parity: ${ps.subsPass ?? 0} pass, ${ps.subsFail ?? 0} fail, privacy=${ps.privacyViolations ?? 0}, contamination=${ps.contaminationHits ?? 0}.`
    : `VM parity delegated to qa.run_paridad_vm (exit ${qaResult.manifest.exitCode}).`;

  return { findings, summary };
}
