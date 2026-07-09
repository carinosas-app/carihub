import fs from 'node:fs';
import path from 'node:path';
import { assertReadPathAllowed } from '../../policy/path-guard.js';
import { loadProfileConfig } from './config-loader.js';
import { buildScopeMissingFinding, profileFinding } from './findings.js';
import type { ProfileAuditInput, ResolvedScope } from './types.js';
import type { ReportFinding } from '../../reports/schema.js';

interface SchemaEntry {
  subcategoriaId: string;
  sectorId: string;
}

export function resolveScope(
  repoRoot: string,
  input: ProfileAuditInput
): { scope: ResolvedScope; findings: ReportFinding[] } {
  const cfg = loadProfileConfig();
  const findings: ReportFinding[] = [];
  const rel = input.ssot?.schemaIndexPath ?? cfg.ssot.schemaIndexPath;
  const abs = path.resolve(repoRoot, rel);
  assertReadPathAllowed(repoRoot, abs);

  let byId: Record<string, SchemaEntry> = {};
  if (fs.existsSync(abs)) {
    const raw = JSON.parse(fs.readFileSync(abs, 'utf8')) as { byId?: Record<string, SchemaEntry> };
    byId = raw.byId ?? {};
  }

  const explicitSubs = input.scope?.subcategoriaIds ?? [];
  const sectorId = input.scope?.sectorId ?? null;
  const allSubsInSector = input.scope?.allSubsInSector ?? true;

  let subcategoriaIds = [...explicitSubs];

  if (!subcategoriaIds.length && sectorId && allSubsInSector) {
    subcategoriaIds = Object.values(byId)
      .filter((e) => e.sectorId === sectorId)
      .map((e) => e.subcategoriaId);
  }

  const scopeMissing = !sectorId && !subcategoriaIds.length && !input.scope?.packId;
  if (scopeMissing) {
    findings.push(buildScopeMissingFinding());
  }

  for (const subId of subcategoriaIds) {
    if (!byId[subId]) {
      findings.push(
        profileFinding(
          'PARITY.SCOPE.UNKNOWN_SUB',
          'WARNING',
          'Unknown subcategoria in scope',
          `subcategoriaId=${subId} not found in schema-index`,
          'summary',
          {
            subject: { type: 'subcategoria', subcategoriaId: subId },
          }
        )
      );
      continue;
    }
    const entry = byId[subId]!;
    if (sectorId && entry.sectorId !== sectorId) {
      findings.push(
        profileFinding(
          'PARITY.SCOPE.SECTOR_MISMATCH',
          'IMPORTANTE',
          'Scope sector mismatch',
          `${subId} belongs to sector ${entry.sectorId}, not ${sectorId}`,
          'summary',
          {
            subject: {
              type: 'subcategoria',
              subcategoriaId: subId,
              sectorId: entry.sectorId,
            },
          }
        )
      );
    }
  }

  const scopeValid =
    !scopeMissing &&
    !findings.some((f) => f.code === 'PARITY.SCOPE.SECTOR_MISMATCH' || f.severity === 'BLOQUEADOR');

  return {
    scope: {
      sectorId,
      subcategoriaIds,
      subsInScope: subcategoriaIds.length,
      scopeValid,
      scopeMissing,
    },
    findings,
  };
}
