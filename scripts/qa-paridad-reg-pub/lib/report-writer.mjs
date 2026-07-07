import fs from 'fs';
import path from 'path';

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function writeJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

export function buildMarkdownSummary(report) {
  const m = report.meta;
  const s = report.summary;
  const g = report.gaps;
  const lines = [
    '# QA Paridad Registro ↔ Perfil Público — Fase A (estático)',
    '',
    `**Run:** ${m.runId} · **Commit:** ${m.gitCommit || 'n/a'} · **Agent:** ${m.agentVersion}`,
    '',
    '## Resumen',
    '',
    '| Métrica | Valor |',
    '|---------|------:|',
    `| Subcategorías en schema-index | ${s.totalSchemaSubs} |`,
    `| Con resolveConfig | ${s.withResolveConfig} |`,
    `| Sin resolveConfig | ${s.withoutResolveConfig} |`,
    `| Con fields extraídos | ${s.withFields} |`,
    `| Total FieldContracts | ${s.totalFieldContracts} |`,
    `| Campos privados detectados | ${s.privateFieldCount} |`,
    `| Toggles mostrar*Publico | ${s.toggleFieldCount} |`,
    '',
    '## Gaps blocks ↔ schema-index',
    '',
    `| Tipo gap | Count |`,
    `|----------|------:|`,
    `| Schema sin resolveConfig | ${g.schemaWithoutResolveConfig.length} |`,
    `| Schema con config pero 0 fields | ${g.schemaWithoutFields.length} |`,
    `| SUB_TO_PACK no en schema | ${g.blocksSubNotInSchema.length} |`,
    `| Schema sub ausente en SUB_TO_PACK | ${g.schemaSubMissingInSubToPack.length} |`,
    '',
  ];

  if (g.schemaWithoutResolveConfig.length) {
    lines.push('## Subcategorías sin resolveConfig (muestra ≤25)', '', '| sectorId | subcategoriaId | arquetipo |', '|----------|----------------|-----------|');
    g.schemaWithoutResolveConfig.slice(0, 25).forEach((x) => {
      lines.push(`| ${x.sectorId} | ${x.subcategoriaId} | ${x.arquetipo || ''} |`);
    });
    if (g.schemaWithoutResolveConfig.length > 25) {
      lines.push('', `_… y ${g.schemaWithoutResolveConfig.length - 25} más en catalog.json_`);
    }
    lines.push('');
  }

  lines.push('## Por sector', '', '| sectorId | subs | con config | fields |', '|----------|-----:|-----------:|-------:|');
  for (const row of report.bySector) {
    lines.push(`| ${row.sectorId} | ${row.total} | ${row.withConfig} | ${row.fieldCount} |`);
  }

  lines.push('', '## Riesgos Fase A', '');
  for (const r of report.risks || []) {
    lines.push(`- **${r.nivel}:** ${r.texto}`);
  }

  lines.push('', '---', '_Fase A — solo catálogo estático. Pipeline y render en fases B/C._');
  return lines.join('\n');
}

export function buildMarkdownSummaryPhaseB(report) {
  const m = report.meta;
  const s = report.summary;
  const lines = [
    '# QA Paridad Registro ↔ Perfil Público — Fase B (pipeline VM)',
    '',
    `**Run:** ${m.runId} · **Commit:** ${m.gitCommit || 'n/a'} · **Agent:** ${m.agentVersion}`,
    '',
    '## Resumen',
    '',
    '| Métrica | Valor |',
    '|---------|------:|',
    `| Subcategorías | ${s.totalSubs} |`,
    `| Procesadas | ${s.processed} |`,
    `| Subs PASS | ${s.subsPass} |`,
    `| Subs FAIL | ${s.subsFail} |`,
    `| Errores pipeline | ${s.pipelineErrors} |`,
    `| Field checks | ${s.fieldChecksTotal} |`,
    `| Field PASS | ${s.fieldPass} |`,
    `| Field FAIL | ${s.fieldFail} |`,
    `| Field WARN | ${s.fieldWarn} |`,
    `| Field SKIP | ${s.fieldSkip} |`,
    `| Violaciones privacy | ${s.privacyViolations} |`,
    `| Anti-contaminación | ${s.contaminationHits} |`,
    '',
  ];

  if (report.topFailures?.length) {
    lines.push('## Top subs con fallos', '', '| sectorId | subcategoriaId | fails |', '|----------|----------------|------:|');
    for (const t of report.topFailures) {
      lines.push(`| ${t.sectorId || ''} | ${t.subcategoriaId} | ${t.failCount} |`);
    }
    lines.push('');
  }

  if (report.failures?.length) {
    lines.push('## Muestra de fallos (≤15)', '');
    report.failures.slice(0, 15).forEach((f) => {
      lines.push(`- **${f.subcategoriaId}** / \`${f.blockFieldId || f.stage}\` [${f.stage}] — ${f.reason}`);
    });
    if (report.failures.length > 15) {
      lines.push('', `_… y ${report.failures.length - 15} más en failures.json_`);
    }
    lines.push('');
  }

  lines.push('---', '_Fase B — pipeline VM. Render DOM en Fase C._');
  return lines.join('\n');
}

export function writePhaseBReports(outBase, payload) {
  writeJson(path.join(outBase, 'pipeline-summary.json'), {
    meta: payload.meta,
    summary: payload.summary,
    topFailures: payload.topFailures,
    subResults: payload.subResults?.map(stripSubDetail),
  });
  writeJson(path.join(outBase, 'failures.json'), payload.failures);
  if (payload.subResultsDetailed) {
    writeJson(path.join(outBase, 'pipeline-detail.json'), payload.subResultsDetailed);
  }
  ensureDir(outBase);
  fs.writeFileSync(path.join(outBase, 'summary-phase-b.md'), buildMarkdownSummaryPhaseB(payload), 'utf8');
}

function stripSubDetail(sub) {
  return {
    subcategoriaId: sub.subcategoriaId,
    sectorId: sub.sectorId,
    arquetipo: sub.arquetipo,
    status: sub.status,
    pipelineError: sub.pipelineError,
    nestedProfileKey: sub.nestedProfileKey,
    summary: sub.summary,
    stages: sub.stages,
    durationMs: sub.durationMs,
  };
}
