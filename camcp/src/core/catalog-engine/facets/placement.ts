import { loadCatalogConfig } from '../config-loader.js';
import { catalogFinding } from '../findings.js';
import { normLabel, pairKey } from '../normalize.js';
import type { CatalogEngineContext } from '../types.js';
import type { ReportFinding } from '../../../reports/schema.js';

export function runPlacementFacet(ctx: CatalogEngineContext): ReportFinding[] {
  const cfg = loadCatalogConfig();
  const findings: ReportFinding[] = [];
  const byId = ctx.index.byId;

  for (const rule of cfg.placementRuleset.rules) {
    const ruleId = String(rule.ruleId ?? '');
    const code = String(rule.code ?? 'CATALOG.PLACEMENT.CROSS_SECTOR_AMBIGUITY');
    const severity = (rule.severity as ReportFinding['severity']) ?? 'INFO';
    const confidence = (rule.confidence as ReportFinding['confidence']) ?? 'high';

    if (ruleId === 'adultos-vs-gastronomia-bar' && Array.isArray(rule.pairs)) {
      const pairs = rule.pairs as Array<{ sectorId: string; subcategoriaId: string }>;
      const a = pairs[0];
      const b = pairs[1];
      if (a && b && byId[a.subcategoriaId] && byId[b.subcategoriaId]) {
        findings.push(
          catalogFinding(
            code,
            severity,
            'Bar gastronómico vs antro adulto — separación intencional',
            `${a.sectorId}/${a.subcategoriaId} and ${b.sectorId}/${b.subcategoriaId} coexist — maintain separation`,
            'placement',
            {
              confidence,
              subject: {
                type: 'pair',
                pairKey: pairKey(a, b),
              },
              recommendation: {
                action: String(rule.recommendation ?? 'maintain'),
                hint: 'UX copy + ADULTOS_REDIRECTS already separates antros-y-bares',
              },
            }
          )
        );
      }
      continue;
    }

    if (ruleId === 'ids-with-spaces-adultos') {
      const sectorId = String(rule.sectorId ?? 'adultos');
      for (const entry of ctx.index.entries) {
        if (entry.sectorId !== sectorId) continue;
        if (!entry.subcategoriaId.includes(' ')) continue;
        findings.push(
          catalogFinding(
            code,
            severity,
            'Adultos ID with spaces',
            `subcategoriaId="${entry.subcategoriaId}" uses spaces`,
            'placement',
            {
              confidence,
              subject: {
                type: 'subcategoria',
                sectorId: entry.sectorId,
                subcategoriaId: entry.subcategoriaId,
              },
            }
          )
        );
      }
      continue;
    }

    if (Array.isArray(rule.labelTokens)) {
      const tokens = (rule.labelTokens as string[]).map(normLabel);
      const hits = ctx.index.entries.filter((e) => {
        const nl = normLabel(e.subcategoria);
        return tokens.some((t) => nl.includes(t));
      });
      if (hits.length >= 2) {
        const sectors = [...new Set(hits.map((h) => h.sectorId))];
        if (sectors.length >= 2) {
          findings.push(
            catalogFinding(
              code,
              severity,
              'Cross-sector label ambiguity',
              `Rule ${ruleId}: labels match tokens across sectors ${sectors.join(', ')}`,
              'placement',
              {
                confidence,
                subject: { type: 'sector', ruleId, sectors },
              }
            )
          );
        }
      }
    }
  }

  for (const entry of ctx.index.entries) {
    if (!entry.arquetipo || !entry.formularioId) continue;
    const arquetipoSectorMismatch =
      entry.sectorId === 'restaurantes' &&
      entry.arquetipo.startsWith('negocio_') &&
      !entry.arquetipo.includes('gastronomia');
    if (arquetipoSectorMismatch) {
      findings.push(
        catalogFinding(
          'CATALOG.PLACEMENT.ARQUETIPO_MISMATCH',
          'WARNING',
          'Arquetipo sector mismatch',
          `${entry.subcategoriaId} arquetipo=${entry.arquetipo} in sector ${entry.sectorId}`,
          'placement',
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
  }

  return findings;
}
