import fs from 'node:fs';
import path from 'node:path';
import type { ReportFinding } from '../../reports/schema.js';
import type { QaRunResult } from '../../qa/report-runner.js';

interface SchemaReport {
  estado?: string;
  resumen?: {
    totalSubcategoriasMapa?: number;
    totalSubcategoriasCubiertasSchemas?: number;
    totalErrores?: number;
    totalAdvertencias?: number;
  };
  faltantes?: unknown[];
  errores?: Array<{ code?: string; mensaje?: string; severidad?: string }>;
  advertencias?: Array<{ code?: string; mensaje?: string }>;
}

function readSchemaReport(repoRoot: string): SchemaReport | null {
  const rel = 'scripts/validacion-schemas-report.json';
  const full = path.join(repoRoot, rel);
  if (!fs.existsSync(full)) return null;
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8')) as SchemaReport;
  } catch {
    return null;
  }
}

export function parseDataSchemaFindings(
  repoRoot: string,
  qaResult: QaRunResult,
  ok: boolean
): { findings: ReportFinding[]; summary: string } {
  const report = readSchemaReport(repoRoot);
  const findings: ReportFinding[] = [];
  const r = report?.resumen;

  const mapa = r?.totalSubcategoriasMapa ?? 0;
  const cubiertas = r?.totalSubcategoriasCubiertasSchemas ?? 0;
  const delta = mapa - cubiertas;

  if (delta > 0) {
    findings.push({
      id: 'DATA-SCHEMA-003',
      severity: 'IMPORTANTE',
      message: `Drift mapa↔schema: ${delta} sub(s) en mapa sin cobertura schema (${mapa} mapa / ${cubiertas} cubiertas)`,
      impact: 'Subcategorías sin contrato schema-index',
      recommendation: 'Revisar faltantes en validacion-schemas-report.json',
    });
  }

  const faltantes = report?.faltantes?.length ?? 0;
  if (faltantes > 0) {
    findings.push({
      id: 'DATA-SCHEMA-001',
      severity: 'IMPORTANTE',
      message: `${faltantes} subcategoría(s) faltantes en alineación mapa↔schema`,
      evidence: 'scripts/validacion-schemas-report.json',
    });
  }

  const errCount = r?.totalErrores ?? report?.errores?.length ?? 0;
  if (errCount > 0) {
    for (const [i, e] of (report?.errores ?? []).slice(0, 10).entries()) {
      findings.push({
        id: `DATA-SCHEMA-ERR-${i + 1}`,
        severity: 'IMPORTANTE',
        message: `[${e.code ?? '?'}] ${e.mensaje ?? 'error'}`,
      });
    }
    if ((report?.errores?.length ?? 0) > 10) {
      findings.push({
        id: 'DATA-SCHEMA-ERR-MORE',
        severity: 'INFO',
        message: `${(report?.errores?.length ?? 0) - 10} error(es) adicionales en schema report`,
      });
    }
  }

  const warnCount = r?.totalAdvertencias ?? report?.advertencias?.length ?? 0;
  if (warnCount > 0 && errCount === 0) {
    findings.push({
      id: 'DATA-SCHEMA-WARN',
      severity: 'INFO',
      message: `${warnCount} advertencia(s) en validación de schemas`,
    });
  }

  if (!ok && findings.every((f) => f.severity === 'PASS' || f.severity === 'INFO')) {
    findings.push({
      id: 'DATA-SCHEMA-EXIT',
      severity: 'IMPORTANTE',
      message: `validar-schemas exit=${qaResult.manifest.exitCode}`,
      evidence: qaResult.manifest.reportDir,
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: 'DATA-SCHEMA-PASS',
      severity: 'PASS',
      message: report?.estado ?? 'Schema alignment PASS',
    });
  }

  const summary = r
    ? `Schema alignment: mapa=${mapa}, cubiertas=${cubiertas}, errores=${errCount}, advertencias=${warnCount}, estado=${report?.estado ?? 'unknown'}.`
    : `Schema alignment delegated (exit ${qaResult.manifest.exitCode}).`;

  return { findings, summary };
}
