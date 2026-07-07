import type { ReportFinding } from '../../reports/schema.js';
import type { QaRunResult } from '../../qa/report-runner.js';
import { readQaArtifact } from '../json-read.js';

interface GapsJson {
  schemaWithoutResolveConfig?: unknown[];
  schemaWithoutFields?: unknown[];
  blocksSubNotInSchema?: unknown[];
  schemaSubMissingInSubToPack?: unknown[];
}

interface CatalogJson {
  summary?: {
    totalSchemaSubs?: number;
    withResolveConfig?: number;
    withoutResolveConfig?: number;
    totalFieldContracts?: number;
  };
}

export function parseParityStaticFindings(
  repoRoot: string,
  qaResult: QaRunResult,
  ok: boolean
): { findings: ReportFinding[]; summary: string } {
  const gaps = readQaArtifact<GapsJson>(repoRoot, qaResult, 'gaps.json');
  const catalog = readQaArtifact<CatalogJson>(repoRoot, qaResult, 'catalog.json');
  const findings: ReportFinding[] = [];

  const noConfig = gaps?.schemaWithoutResolveConfig?.length ?? 0;
  if (noConfig > 0) {
    findings.push({
      id: 'PARITY-STATIC-001',
      severity: 'IMPORTANTE',
      message: `${noConfig} subcategoría(s) en schema-index sin resolveConfig`,
      impact: 'Registro dinámico no disponible para esas subs',
      recommendation: 'Revisar gaps.json y registro-*-blocks.js',
    });
  }

  const blocksDrift = gaps?.blocksSubNotInSchema?.length ?? 0;
  if (blocksDrift > 0) {
    findings.push({
      id: 'PARITY-STATIC-002',
      severity: 'WARNING',
      message: `${blocksDrift} entrada(s) SUB_TO_PACK sin match en schema-index`,
      impact: 'Posible alias o drift blocks ↔ schema',
    });
  }

  const schemaDrift = gaps?.schemaSubMissingInSubToPack?.length ?? 0;
  if (schemaDrift > 0) {
    findings.push({
      id: 'PARITY-STATIC-003',
      severity: 'WARNING',
      message: `${schemaDrift} sub(s) con config pero slug ausente en SUB_TO_PACK`,
    });
  }

  if (!ok) {
    findings.push({
      id: 'PARITY-STATIC-EXIT',
      severity: 'IMPORTANTE',
      message: `qa.run_paridad_static exit=${qaResult.manifest.exitCode}`,
      evidence: qaResult.manifest.reportDir,
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: 'PARITY-STATIC-PASS',
      severity: 'PASS',
      message: 'Static parity scan completed without blocking gaps for scoped run',
    });
  }

  const s = catalog?.summary;
  const summary = s
    ? `Static parity: ${s.totalSchemaSubs ?? '?'} subs, ${s.withResolveConfig ?? '?'} with resolveConfig, ${s.totalFieldContracts ?? '?'} FieldContracts.`
    : `Static parity delegated to qa.run_paridad_static (exit ${qaResult.manifest.exitCode}).`;

  return { findings, summary };
}
