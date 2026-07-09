import { loadAliasDocuments } from '../loader.js';
import { catalogFinding } from '../findings.js';
import { normId } from '../normalize.js';
import { isIntentionalRedirectOnlyLegacy } from './aliases-intentional.js';
import type { CatalogEngineContext, CatalogEntry } from '../types.js';
import type { ReportFinding } from '../../../reports/schema.js';

export function runAliasesFacet(ctx: CatalogEngineContext): ReportFinding[] {
  const findings: ReportFinding[] = [];
  const aliasDocs = loadAliasDocuments(ctx.repoRoot);
  const byId = ctx.index.byId;
  const aliasToTargets = new Map<string, string>();
  let legacyCount = 0;

  for (const { path, doc } of aliasDocs) {
    const processMap = (
      map: Record<string, string>,
      mapKind: 'legacyToCanon' | 'exclusionAdultos' | 'exclusionEventos'
    ) => {
      for (const [aliasId, targetId] of Object.entries(map)) {
        legacyCount += 1;
        if (aliasToTargets.has(aliasId) && aliasToTargets.get(aliasId) !== targetId) {
          findings.push(
            catalogFinding(
              'CATALOG.ALIAS.DUPLICATE_ALIAS',
              'WARNING',
              'Duplicate alias mapping',
              `Alias ${aliasId} maps to multiple targets`,
              'aliases',
              {
                subject: { type: 'alias', aliasId, targetId },
                evidenceRefs: [{ kind: 'file', path, label: 'alias document' }],
              }
            )
          );
        }
        aliasToTargets.set(aliasId, targetId);

        if (mapKind === 'legacyToCanon') {
          const target = byId[targetId];
          if (!target) {
            findings.push(
              catalogFinding(
                'CATALOG.ALIAS.LEGACY_TARGET_MISSING',
                'BLOQUEADOR',
                'Legacy alias target missing',
                `Alias ${aliasId} → ${targetId} but target not in schema-index`,
                'aliases',
                {
                  subject: { type: 'alias', aliasId, targetId },
                  evidenceRefs: [{ kind: 'file', path, label: 'legacy alias' }],
                }
              )
            );
            continue;
          }

          if (!byId[aliasId] && aliasId !== targetId) {
            const intentional = isIntentionalRedirectOnlyLegacy(ctx, path, aliasId, targetId);
            if (intentional.intentional) {
              findings.push(
                catalogFinding(
                  'CATALOG.ALIAS.INTENTIONAL_REDIRECT',
                  'PASS',
                  'Acta-backed redirect-only legacy alias',
                  `Legacy id ${aliasId} → ${targetId} is redirect-only (no schema byId expected per acta)`,
                  'aliases',
                  {
                    subject: { type: 'alias', aliasId, targetId, redirectOnly: true },
                    evidenceRefs: [
                      { kind: 'file', path, label: 'legacyToCanon' },
                      {
                        kind: 'file',
                        path: intentional.evidence!.actaPath,
                        label: 'acta legacy→canon table',
                      },
                      ...intentional.evidence!.runtimePaths.map((runtimePath) => ({
                        kind: 'file' as const,
                        path: runtimePath,
                        label: 'runtime LEGACY_TO_CANON',
                      })),
                    ],
                    recommendation: {
                      action: 'maintain',
                      hint: 'Redirect via resolveCanonSubId; do not add legacy row to schema-index',
                    },
                  }
                )
              );
            } else {
              findings.push(
                catalogFinding(
                  'CATALOG.ALIAS.LEGACY_ORPHAN',
                  'IMPORTANTE',
                  'Legacy alias without schema entry',
                  `Legacy id ${aliasId} redirects to ${targetId} but has no byId entry`,
                  'aliases',
                  {
                    subject: { type: 'alias', aliasId, targetId },
                    evidenceRefs: [{ kind: 'file', path, label: 'legacy alias orphan' }],
                  }
                )
              );
            }
          }

          if (aliasEntrySectorDrift(byId[aliasId], target)) {
            findings.push(
              catalogFinding(
                'CATALOG.ALIAS.REDIRECT_DRIFT',
                'WARNING',
                'Alias redirect sector drift',
                `Alias ${aliasId} sector differs from target sector ${target.sectorId}`,
                'aliases',
                {
                  confidence: 'medium',
                  subject: { type: 'alias', aliasId, targetId },
                }
              )
            );
          }
          continue;
        }

        const sectorMatch = ctx.index.entries.some(
          (e) => e.sectorId === targetId || e.subcategoriaId === targetId
        );
        if (!sectorMatch) {
          findings.push(
            catalogFinding(
              'CATALOG.ALIAS.REDIRECT_DRIFT',
              'WARNING',
              'Exclusion redirect target not in catalog index',
              `${mapKind} ${aliasId} → ${targetId} (sector/category redirect)`,
              'aliases',
              {
                confidence: 'medium',
                subject: { type: 'alias', aliasId, targetId },
                evidenceRefs: [{ kind: 'file', path, label: mapKind }],
              }
            )
          );
        }
      }
    };

    processMap(doc.legacyToCanon ?? {}, 'legacyToCanon');
    processMap(doc.exclusionAdultos ?? {}, 'exclusionAdultos');
    processMap(doc.exclusionEventos ?? {}, 'exclusionEventos');
  }

  for (const entry of ctx.index.entries) {
    if (entry.subcategoriaId.includes(' ') && !aliasToTargets.has(entry.subcategoriaId)) {
      const normalized = normId(entry.subcategoriaId);
      if (byId[normalized] && normalized !== entry.subcategoriaId) {
        findings.push(
          catalogFinding(
            'CATALOG.ALIAS.REDIRECT_DRIFT',
            'WARNING',
            'Space ID vs normalized ID drift',
            `Entry ${entry.subcategoriaId} may map to ${normalized}`,
            'aliases',
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
  }

  ctx.legacyAliasCount = legacyCount;
  return findings;
}

export function countLegacyAliases(ctx: CatalogEngineContext): number {
  const aliasDocs = loadAliasDocuments(ctx.repoRoot);
  let count = 0;
  for (const { doc } of aliasDocs) {
    count += Object.keys(doc.legacyToCanon ?? {}).length;
    count += Object.keys(doc.exclusionAdultos ?? {}).length;
    count += Object.keys(doc.exclusionEventos ?? {}).length;
  }
  return count;
}

function aliasEntrySectorDrift(
  aliasEntry: CatalogEntry | undefined,
  target: CatalogEntry
): boolean {
  return Boolean(aliasEntry && aliasEntry.sectorId !== target.sectorId);
}
