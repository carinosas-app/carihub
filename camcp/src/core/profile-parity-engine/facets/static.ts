import fs from 'node:fs';
import path from 'node:path';
import { assertReadPathAllowed } from '../../../policy/path-guard.js';
import { loadProfileConfig } from '../config-loader.js';
import { buildProfileHealth, gateFindingsFromContract } from '../health.js';
import { profileFinding } from '../findings.js';
import type { ProfileEngineContext } from '../types.js';
import type { ReportFinding } from '../../../reports/schema.js';

export function runSummaryFacet(ctx: ProfileEngineContext): ReportFinding[] {
  const findings: ReportFinding[] = [...gateFindingsFromContract(ctx)];
  const health = buildProfileHealth(ctx);

  findings.push(
    profileFinding(
      'PARITY.HEALTH.SUMMARY',
      health.overallStatus === 'FAIL' ? 'IMPORTANTE' : health.overallStatus === 'WARNING' ? 'WARNING' : 'INFO',
      'Profile health summary',
      `overall=${health.overallStatus} ssot=${health.ssotValid} scope=${health.scopeValid} parity=${health.parityValid}`,
      'summary',
      { category: 'health' }
    )
  );

  const snap = ctx.gate.snapshots.find((s) => s.ssotId === 'registro-schema-index');
  if (snap) {
    findings.push(
      profileFinding(
        'PARITY.SSOT.SNAPSHOT',
        'INFO',
        'SSOT snapshot',
        `schema-index @ ${snap.version ?? 'unknown'}`,
        'summary',
        {
          ssotRef: {
            ssotId: snap.ssotId,
            path: snap.path,
            version: snap.version ?? undefined,
          },
        }
      )
    );
  }

  return findings;
}

export function runLifecycleFacet(ctx: ProfileEngineContext): ReportFinding[] {
  const cfg = loadProfileConfig();
  const findings: ReportFinding[] = [];
  const rel = cfg.ssot.schemaIndexPath;
  const abs = path.resolve(ctx.repoRoot, rel);
  assertReadPathAllowed(ctx.repoRoot, abs);
  if (!fs.existsSync(abs)) return findings;

  const raw = JSON.parse(fs.readFileSync(abs, 'utf8')) as {
    byId?: Record<string, Record<string, unknown>>;
  };
  const byId = raw.byId ?? {};

  for (const [sectorId, keys] of Object.entries(cfg.lifecycleRuleset.nestedPerfilKeysBySector)) {
    const keyList = keys as string[];
    const sectorEntries = Object.values(byId).filter((e) => e.sectorId === sectorId);
    if (!sectorEntries.length) continue;
    findings.push(
      profileFinding(
        'PIPELINE.LIFECYCLE.NESTED_KEY_EXPECTED',
        'INFO',
        'Nested perfil key contract',
        `Sector ${sectorId} expects nested keys: ${keyList.join(', ')}`,
        'lifecycle',
        {
          subject: { type: 'sector', sectorId, nestedKeys: keyList },
          recommendation: { action: 'review', hint: 'Verify registro-sector-contract-registry SSOT' },
        }
      )
    );
  }

  return findings;
}

export function runVerificationFacet(ctx: ProfileEngineContext): ReportFinding[] {
  const cfg = loadProfileConfig();
  const findings: ReportFinding[] = [];
  const rel = cfg.ssot.schemaIndexPath;
  const abs = path.resolve(ctx.repoRoot, rel);
  assertReadPathAllowed(ctx.repoRoot, abs);
  if (!fs.existsSync(abs)) return findings;

  const raw = JSON.parse(fs.readFileSync(abs, 'utf8')) as {
    byId?: Record<string, { sectorId?: string; arquetipo?: string; subcategoriaId?: string }>;
  };

  for (const entry of Object.values(raw.byId ?? {})) {
    if (!entry.sectorId || !entry.arquetipo) continue;
    if (!cfg.verificationRuleset.cedulaRequiredSectors.includes(entry.sectorId)) continue;
    if (!cfg.verificationRuleset.professionalArquetipos.some((a: string) => entry.arquetipo?.includes(a.replace('persona_', '')))) {
      continue;
    }
    findings.push(
      profileFinding(
        'PIPELINE.VERIFICATION.CEDULA_SECTOR',
        'INFO',
        'Professional sector verification rule',
        `${entry.subcategoriaId} in ${entry.sectorId} may require cedula verification`,
        'verification',
        {
          confidence: 'medium',
          subject: {
            type: 'subcategoria',
            sectorId: entry.sectorId,
            subcategoriaId: entry.subcategoriaId,
          },
        }
      )
    );
  }

  return findings;
}
