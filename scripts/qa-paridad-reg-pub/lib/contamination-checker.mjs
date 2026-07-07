import { hasVal } from './path-utils.mjs';

/**
 * @param {object} params
 * @returns {object[]}
 */
export function runContaminationChecks(params) {
  const { slimDoc, hydrated, nestedProfileKey, profileNestedKeys } = params;
  const results = [];
  const keys = profileNestedKeys || [];

  const presentInSlim = keys.filter((k) => hasVal(slimDoc?.[k]));
  const presentInHydrated = keys.filter((k) => hasVal(hydrated?.[k]));

  if (nestedProfileKey) {
    for (const k of presentInSlim) {
      if (k !== nestedProfileKey) {
        results.push({
          stage: 'anti_contamination',
          status: 'fail',
          severity: 'bloqueador',
          blockFieldId: k,
          reason: `nested inesperado en slim: ${k} (esperado solo ${nestedProfileKey})`,
          actualValue: Object.keys(slimDoc[k] || {}),
        });
      }
    }
    for (const k of presentInHydrated) {
      if (k !== nestedProfileKey) {
        results.push({
          stage: 'anti_contamination',
          status: 'fail',
          severity: 'bloqueador',
          blockFieldId: k,
          reason: `nested inesperado post-hydrate: ${k}`,
          actualValue: Object.keys(hydrated[k] || {}),
        });
      }
    }
  } else {
    for (const k of presentInSlim) {
      results.push({
        stage: 'anti_contamination',
        status: 'warn',
        severity: 'mejora',
        blockFieldId: k,
        reason: `nested ${k} en slim sin nestedProfileKey declarado`,
      });
    }
  }

  const adultKeys = ['dominatrixPerfil', 'unicornPerfil', 'swingerPerfil', 'cuckoldHotwifePerfil'];
  const sectorKeys = keys.filter((k) => k.endsWith('Perfil') && !adultKeys.includes(k));

  if (nestedProfileKey && adultKeys.includes(nestedProfileKey)) {
    for (const sk of sectorKeys) {
      if (hasVal(slimDoc?.[sk]) || hasVal(hydrated?.[sk])) {
        results.push({
          stage: 'anti_contamination',
          status: 'fail',
          severity: 'bloqueador',
          blockFieldId: sk,
          reason: `contaminación sectorial: ${sk} junto a ${nestedProfileKey}`,
        });
      }
    }
  }

  if (results.length === 0) {
    results.push({ stage: 'anti_contamination', status: 'pass', blockFieldId: '*', reason: 'sin contaminación' });
  }

  return results;
}
