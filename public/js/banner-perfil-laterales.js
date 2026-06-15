/**
 * Perfil — slots perfil_estados · perfil_libe (dock provisional, sin mover layout).
 */
(function (global) {
  'use strict';

  var MAP = {
    perfilMidEstados: 'perfil_estados',
    perfilMidLibe: 'perfil_libe'
  };

  function mount() {
    if (!global.CariHubSlotDock || !CariHubSlotDock.mountDock) return;
    CariHubSlotDock.mountDock({
      rentals: global.CARIHUB_PERFIL_RENTALS || {},
      map: MAP
    });
  }

  global.CariHubBannerPerfilLaterales = {
    mount: mount
  };

  function boot() {
    mount();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
