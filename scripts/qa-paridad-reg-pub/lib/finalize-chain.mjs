/**
 * Aplica cadena finalize* (espejo de collectValues post-DOM).
 * @param {Record<string, unknown>} PB - CariHubRegistroPublicBlocks
 */
export function applyFinalizeChain(values, regCtx, PB) {
  let v = { ...(values || {}) };

  if (PB.finalizeViajesValues) {
    v = PB.finalizeViajesValues(v);
  } else if (v.modalidades && !v.viajesDesplazamiento) {
    v.viajesDesplazamiento = { viaja: Array.isArray(v.modalidades) && v.modalidades.includes('viaja') };
  }

  const chain = [
    ['finalizeEdecanValues', true],
    ['finalizeModelosValues', true],
    ['finalizeLesbiansValues', false],
    ['finalizeParejaSwingerValues', true],
    ['finalizeUnicornValues', true],
    ['finalizeCuckoldHotwifeValues', true],
    ['finalizeDominatrixValues', true],
    ['finalizeEspectaculoValues', true],
    ['finalizeCreadorValues', true],
    ['finalizeRetailValues', true],
    ['finalizeVenueValues', true],
    ['finalizeBienestarValues', true],
    ['finalizeHospedajeValues', true],
    ['finalizeParejaGrupoValues', false],
  ];

  for (const [fn, withCtx] of chain) {
    if (typeof PB[fn] !== 'function') continue;
    v = withCtx ? PB[fn](v, regCtx) : PB[fn](v);
  }

  v = applySectorNestedFinalizers(v, regCtx, PB);
  return v;
}

function applySectorNestedFinalizers(values, regCtx, PB) {
  const v = { ...values };
  const pack = v.deltaPack || 'B';

  if (typeof PB.isSaludSectorSubcategoria === 'function' && PB.isSaludSectorSubcategoria(regCtx)) {
    if (typeof PB.buildSaludSectorPerfil === 'function') {
      v.saludPerfil = PB.buildSaludSectorPerfil(v, pack);
    }
  }

  if (typeof PB.isProfesionalesSectorSubcategoria === 'function' && PB.isProfesionalesSectorSubcategoria(regCtx)) {
    if (typeof PB.buildProfesionalesSectorPerfil === 'function') {
      v.profesionalesPerfil = PB.buildProfesionalesSectorPerfil(v, pack);
    }
  }

  if (regCtx.subcategoriaId && !v.canonSubcategoriaId) {
    v.canonSubcategoriaId = regCtx.subcategoriaId;
  }

  return v;
}
