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
