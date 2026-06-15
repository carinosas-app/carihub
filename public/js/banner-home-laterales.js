/**
 * Home — slots home_estados · home_libe (dock provisional, sin mover layout).
 */
(function (global) {
  'use strict';

  var MAP = {
    homeMidEstados: 'home_estados',
    homeMidLibe: 'home_libe'
  };

  function mount() {
    if (!global.CariHubSlotDock || !CariHubSlotDock.mountDock) return;
    CariHubSlotDock.mountDock({
      rentals: global.CARIHUB_HOME_SLOT_RENTALS || {},
      map: MAP
    });
  }

  global.CariHubBannerHomeLaterales = {
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
