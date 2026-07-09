import { loadCatalogConfig } from './config-loader.js';
import { catalogFinding } from './findings.js';
import { loadHistoricalBaseline } from './skip.js';
import type { CatalogEngineContext, CatalogStatsDocument } from './types.js';
import type { ReportFinding } from '../../reports/schema.js';

export function runHistoricalComparison(
  ctx: CatalogEngineContext,
  stats: CatalogStatsDocument,
  mode: string
): ReportFinding[] {
  if (mode !== 'historical-json') return [];
  const cfg = loadCatalogConfig();
  const ref = cfg.historicalEvidence.refs[0];
  if (!ref) return [];

  const baseline = loadHistoricalBaseline(ctx.repoRoot, ref.path);
  const findings: ReportFinding[] = [];

  findings.push(
    catalogFinding(
      'CATALOG.HIST.BASELINE_REFERENCE',
      'INFO',
      'Historical baseline referenced',
      `Using immutable baseline ${ref.id} at ${ref.path}`,
      'full',
      {
        evidenceRefs: [{ kind: 'file', path: ref.path, label: ref.id }],
      }
    )
  );

  if (!baseline) return findings;

  const golden = cfg.historicalEvidence.goldenStats;
  const totalDrift =
    stats.totalSubcategorias !== golden.totalSubcategorias ||
    stats.totalSectores !== golden.totalSectores;

  const baselineTotal =
    typeof baseline.totalSubcategorias === 'number'
      ? baseline.totalSubcategorias
      : typeof baseline.total === 'number'
        ? baseline.total
        : null;

  if (totalDrift || (baselineTotal != null && baselineTotal !== stats.totalSubcategorias)) {
    findings.push(
      catalogFinding(
        'CATALOG.COMPARE.BASELINE_DRIFT',
        'WARNING',
        'Baseline drift detected',
        `Current ${stats.totalSubcategorias} subs / ${stats.totalSectores} sectors vs golden ${golden.totalSubcategorias}/${golden.totalSectores}`,
        'full',
        {
          confidence: 'medium',
          evidenceRefs: [{ kind: 'file', path: ref.path, label: 'golden-baseline' }],
        }
      )
    );
  }

  return findings;
}
