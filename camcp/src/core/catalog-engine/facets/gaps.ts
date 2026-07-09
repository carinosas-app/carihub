import { loadCatalogConfig } from '../config-loader.js';
import { catalogFinding } from '../findings.js';
import type { CatalogEngineContext } from '../types.js';
import type { ReportFinding } from '../../../reports/schema.js';

export function runGapsFacet(ctx: CatalogEngineContext): ReportFinding[] {
  const cfg = loadCatalogConfig();
  const findings: ReportFinding[] = [];
  const byId = ctx.index.byId;
  let gapsHit = 0;

  for (const rule of cfg.gapsRuleset.rules) {
    const exists = Boolean(byId[rule.expectedSub]);
    const inSector = ctx.index.entries.some(
      (e) => e.subcategoriaId === rule.expectedSub && e.sectorId === rule.expectedSector
    );

    if (rule.historicalStatus === 'fused') {
      const fusedExists = rule.fusedInto ? Boolean(byId[rule.fusedInto]) : false;
      if (!exists && fusedExists) {
        gapsHit += 1;
        findings.push(
          catalogFinding(
            'CATALOG.GAP.MISSING_SUB',
            'INFO',
            'Gap fused into existing sub',
            `Expected ${rule.expectedSub} fused into ${rule.fusedInto}`,
            'gaps',
            {
              confidence: 'high',
              subject: {
                type: 'gap',
                gapRuleId: rule.gapRuleId,
                sectorId: rule.expectedSector,
              },
              recommendation: {
                action: 'maintain',
                hint: `Historical status: fused in ${rule.fusedInto}`,
              },
            }
          )
        );
      }
      continue;
    }

    if (!inSector) {
      gapsHit += 1;
      findings.push(
        catalogFinding(
          'CATALOG.GAP.MISSING_SUB',
          'WARNING',
          `Subcategoría ${rule.expectedSub} ausente`,
          `Regla ${cfg.gapsRuleset.rulesetId}/${rule.gapRuleId}: no existe subcategoriaId=${rule.expectedSub} en sector ${rule.expectedSector}`,
          'gaps',
          {
            confidence: 'high',
            subject: {
              type: 'gap',
              gapRuleId: rule.gapRuleId,
              sectorId: rule.expectedSector,
            },
            recommendation: {
              action: 'review',
              hint: 'Evaluar añadir sub — decisión producto, no CAMCP',
            },
          }
        )
      );
    }
  }

  if (ctx.gaps?.rulesetId && ctx.gaps.rulesetId !== cfg.gapsRuleset.rulesetId) {
    findings.push(
      catalogFinding(
        'CATALOG.GAP.RULE_STALE',
        'INFO',
        'Gaps ruleset id mismatch',
        `Requested ruleset ${ctx.gaps.rulesetId} differs from config ${cfg.gapsRuleset.rulesetId}`,
        'gaps',
        { confidence: 'medium' }
      )
    );
  }

  ctx.gapsDeclared = gapsHit;
  return findings;
}

export function countGapsDeclared(ctx: CatalogEngineContext): number {
  return ctx.gapsDeclared ?? 0;
}
