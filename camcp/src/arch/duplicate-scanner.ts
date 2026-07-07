import { createHash } from 'node:crypto';
import type { CamcpConfig } from '../policy/permissions.js';
import { filesystemSearch } from '../tools/filesystem.tools.js';
import type { ReportFinding } from '../reports/schema.js';

function normalizeLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** Scans repo source via filesystem.search — SSOT is repo files; no duplicate registry. */
export function scanDuplicates(
  repoRoot: string,
  config: CamcpConfig,
  opts: { scope?: string[]; patterns?: string[]; minSimilarity?: number } = {}
): { summary: string; findings: ReportFinding[] } {
  const scope = opts.scope ?? [];
  const patterns = opts.patterns ?? [];
  const findings: ReportFinding[] = [];
  const bodyGroups = new Map<string, Set<string>>();

  for (const pattern of patterns) {
    for (const scopePath of scope) {
      const search = filesystemSearch(
        repoRoot,
        { pattern, path: scopePath, glob: '*.{js,mjs,ts}' },
        config
      );
      for (const match of search.matches) {
        const body = normalizeLine(match.text);
        if (body.length < 20) continue;
        const key = createHash('sha256').update(body).digest('hex').slice(0, 16);
        if (!bodyGroups.has(key)) bodyGroups.set(key, new Set());
        bodyGroups.get(key)!.add(`${match.path}:${match.line}`);
      }
    }
  }

  let dupIndex = 0;
  for (const [, locations] of bodyGroups) {
    if (locations.size < 2) continue;
    const paths = [...locations];
    const uniqueFiles = new Set(paths.map((p) => p.split(':')[0]));
    if (uniqueFiles.size < 2) continue;
    dupIndex++;
    findings.push({
      id: `ARCH-DUP-${String(dupIndex).padStart(3, '0')}`,
      severity: paths.length > 2 ? 'IMPORTANTE' : 'WARNING',
      message: `Código similar en ${uniqueFiles.size} archivo(s): ${[...uniqueFiles].slice(0, 3).join(', ')}`,
      impact: 'Deuda copy-paste en capas críticas',
      recommendation: 'Consolidar helper compartido o documentar excepción',
      evidence: paths.slice(0, 5).join('; '),
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: 'ARCH-DUP-OK',
      severity: 'PASS',
      message: `Sin duplicados detectados en ${scope.length} scope(s), ${patterns.length} patrón(es)`,
    });
  }

  const summary = `Duplicate scan: ${patterns.length} pattern(s), ${scope.length} scope path(s), ${dupIndex} grupo(s) duplicado(s).`;
  return { summary, findings };
}
