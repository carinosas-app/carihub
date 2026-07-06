/**
 * Home — «Ver otras categorías»: mismas tarjetas que registro-perfil (CariHubSectorCatalogUI).
 * Destino final: Home + geo picker (no formulario de registro). Sin categoría Adultos.
 */
(function (global) {
  'use strict';

  var TAP_MS = 180;

  var BACK_BTN = {
    salud: 'corporate',
    profesionales: 'corporate',
    tecnologia: 'tech',
    'bienes-raices': 'realestate',
    educacion: 'edu',
    bienestar: 'wellness',
    mascotas: 'mascotas',
    automotriz: 'auto',
    hogar: 'hogar',
    comercio: 'comercio',
    eventos: 'eventos',
    transporte: 'transporte',
    restaurantes: 'gastronomia',
    industria: 'industria'
  };

  var state = {
    step: 'cats',
    sector: null,
    onSelectSubcat: null
  };

  var catSearchCtl = null;

  function $(id) {
    return document.getElementById(id);
  }

  function mountCatSearch() {
    if (!global.CariHubSectorCatSearch || !global.CariHubSectorCatSearch.mount) return;
    catSearchCtl = global.CariHubSectorCatSearch.mount({
      mode: 'browse',
      excludeAdultos: false,
      ids: {
        input: 'homeOtrosCatSearch',
        bar: 'homeOtrosCatSearchBar',
        submit: 'homeOtrosCatSearchSubmit',
        hint: 'homeOtrosCatSearchHint',
        suggest: 'homeOtrosCatSearchSuggest',
        panel: 'homeOtrosCatSearchPanel',
        catalog: 'homeOtrosCatCatalog'
      },
      onPickSubcat: function (sector, sub) {
        if (typeof state.onSelectSubcat === 'function') {
          state.onSelectSubcat(sub, sector);
        }
      },
      onPickSector: function (sector) {
        openSubcats(sector);
      }
    });
  }

  function clearCatSearch() {
    if (catSearchCtl && catSearchCtl.clear) catSearchCtl.clear(false);
  }

  function sectorsForHome() {
    var list = global.CARIHUB_SECTORES || [];
    var UI = global.CariHubSectorCatalogUI;
    if (UI && UI.sortSectors) {
      return UI.sortSectors(list, { excludeAdultos: true, order: UI.SECTOR_DISPLAY_ORDER });
    }
    return list.filter(function (s) { return s.id !== 'adultos'; });
  }

  function renderSectorCards() {
    var grid = $('homeOtrosSectorGrid');
    var hint = $('homeOtrosSectoresHint');
    var sectors = sectorsForHome();
    if (!grid) return;
    if (hint) hint.textContent = sectors.length + ' categorías · elige una para continuar';
    if (global.CariHubSectorCatalogUI && CariHubSectorCatalogUI.renderSectorGrid) {
      CariHubSectorCatalogUI.renderSectorGrid(grid, sectors, {
        onSectorClick: function (sector, btn) {
          btn.classList.add('is-selected');
          window.setTimeout(function () {
            openSubcats(sector);
          }, TAP_MS);
        }
      });
      return;
    }
    grid.innerHTML = '';
  }

  function applySubcatTheme(sector) {
    var modal = $('modal-otros-sectores');
    var back = $('homeOtrosBackToCats');
    if (!modal || !sector) return;
    modal.setAttribute('data-rp-sector', sector.id);
    if (back) {
      var mode = BACK_BTN[sector.id] || 'corporate';
      back.className = 'rp-btn rp-btn--' + mode + ' home-otros-registro__back';
    }
  }

  function renderSubcats(sector) {
    var list = $('homeOtrosSubcatList');
    var title = $('homeOtrosSubcatTitle');
    var hint = $('homeOtrosSubcatHint');
    if (!list || !sector || !global.CariHubSectores) return;
    var items = global.CariHubSectores.subcategoriasDeSector(sector.id) || [];
    if (title) title.textContent = sector.nombre;
    if (hint) {
      hint.textContent = items.length + ' subcategorías · elige una para continuar';
    }
    if (global.CariHubSectorCatalogUI && CariHubSectorCatalogUI.renderSubcatList) {
      CariHubSectorCatalogUI.renderSubcatList(list, items, {
        sectorId: sector.id,
        selectedId: '',
        extraListClass: 'home-otros-subcats__list',
        onSelect: function (cat) {
          if (typeof state.onSelectSubcat === 'function') {
            state.onSelectSubcat(cat, sector);
          }
        }
      });
    } else if (global.CariHubSectorSubcatPicker) {
      global.CariHubSectorSubcatPicker.renderList(list, items, {
        sectorId: sector.id,
        selectedId: '',
        onSelect: function (cat) {
          if (typeof state.onSelectSubcat === 'function') {
            state.onSelectSubcat(cat, sector);
          }
        }
      });
      list.classList.add('home-otros-subcats__list');
    }
  }

  function syncModalSparkles() {
    var S = global.CariHubSectorSparkles;
    if (!S) return;
    var modal = $('modal-otros-sectores');
    if (!modal || !modal.classList.contains('is-open')) return;
    if (state.step === 'cats') {
      S.syncBody('');
      S.ensureLayer(modal.querySelector('.home-otros-registro__scroll'), '');
    } else if (state.step === 'subcats' && state.sector) {
      S.syncBody(state.sector.id);
      S.ensureLayer(modal.querySelector('.home-otros-subcats-wrap'), state.sector.id);
    }
  }

  function syncBodyClasses() {
    var modal = $('modal-otros-sectores');
    var open = !!(modal && modal.classList.contains('is-open'));
    document.body.classList.toggle('home-otros-open', open);
    document.body.classList.toggle('rp-screen0-cats', open && state.step === 'cats');
    document.body.classList.toggle('rp-sector-subcats', open && state.step === 'subcats');
    if (open && state.step === 'subcats' && state.sector && state.sector.id) {
      document.body.setAttribute('data-rp-sector', state.sector.id);
    } else {
      document.body.removeAttribute('data-rp-sector');
    }
  }

  function showStep(step) {
    var modal = $('modal-otros-sectores');
    var cats = $('homeOtrosStepCats');
    var subcats = $('homeOtrosStepSubcats');
    state.step = step;
    if (step === 'cats') clearCatSearch();
    if (cats) cats.hidden = step !== 'cats';
    if (subcats) subcats.hidden = step !== 'subcats';
    if (modal) {
      modal.classList.toggle('is-step-cats', step === 'cats');
      modal.classList.toggle('is-step-subcats', step === 'subcats');
      modal.classList.toggle('rp-sector-subcats', step === 'subcats');
      if (step === 'cats') {
        modal.removeAttribute('data-rp-sector');
      }
    }
    if (step === 'cats') {
      refreshPromoRail({});
    } else if (step === 'subcats' && state.sector) {
      refreshPromoRail({ sectorId: state.sector.id, sectorName: state.sector.nombre });
    }
    syncBodyClasses();
    syncModalSparkles();
  }

  function openSubcats(sector) {
    if (!sector) return;
    state.sector = sector;
    applySubcatTheme(sector);
    showStep('subcats');
    renderSubcats(sector);
  }

  function refreshPromoRail(opts) {
    var modal = $('modal-otros-sectores');
    var rail = modal && modal.querySelector('.home-cat-promo-rail');
    if (!rail || !global.CariHubHomeCatPromoRail) return;
    global.CariHubHomeCatPromoRail.mountRail(rail, opts || {});
  }

  function open(opts) {
    opts = opts || {};
    state.onSelectSubcat = opts.onSelectSubcat || null;
    var modal = $('modal-otros-sectores');
    if (!modal) return;
    renderSectorCards();
    if (opts.step === 'subcats' && opts.sectorId) {
      var sector = global.CariHubSectores && global.CariHubSectores.sectorPorId
        ? global.CariHubSectores.sectorPorId(opts.sectorId)
        : null;
      if (sector && sector.id !== 'adultos') {
        openSubcats(sector);
      } else {
        showStep('cats');
      }
    } else {
      state.sector = null;
      showStep('cats');
    }
    modal.classList.add('is-open');
    syncBodyClasses();
    syncModalSparkles();
    refreshPromoRail(
      state.step === 'subcats' && state.sector
        ? { sectorId: state.sector.id, sectorName: state.sector.nombre }
        : {}
    );
    document.body.style.overflow = 'hidden';
  }

  function releasePageScrollIfAllowed() {
    if (global.CariHubSearchJourneySession &&
        typeof global.CariHubSearchJourneySession.shouldKeepPageLocked === 'function' &&
        global.CariHubSearchJourneySession.shouldKeepPageLocked()) {
      return;
    }
    if (!document.querySelector('.home-modal.is-open')) {
      document.body.style.overflow = '';
    }
  }

  function dismissForGeoTransition() {
    var modal = $('modal-otros-sectores');
    clearCatSearch();
    if (modal) {
      modal.classList.remove('is-open', 'is-step-cats', 'is-step-subcats', 'rp-sector-subcats');
      modal.removeAttribute('data-rp-sector');
    }
    state.sector = null;
    state.step = 'cats';
    syncBodyClasses();
  }

  function close(opts) {
    opts = opts || {};
    dismissForGeoTransition();
    releasePageScrollIfAllowed();
    if (!opts.preserveJourney && global.CariHubSearchJourneySession && global.CariHubSearchJourneySession.isActive()) {
      global.CariHubSearchJourneySession.clear();
      if (global.CariHubGeoPicker && typeof global.CariHubGeoPicker.setFlowMode === 'function') {
        global.CariHubGeoPicker.setFlowMode('field-sync');
      }
    }
  }

  function bind() {
    mountCatSearch();
    var back = $('homeOtrosBackToCats');
    var modal = $('modal-otros-sectores');
    if (back) {
      back.addEventListener('click', function () {
        showStep('cats');
      });
    }
    if (modal) {
      var closeBtn = modal.querySelector('.home-modal__close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          close();
        });
      }
    }
  }

  global.CariHubHomeOtrosSectoresPicker = {
    open: open,
    close: close,
    dismissForGeoTransition: dismissForGeoTransition,
    openSubcats: openSubcats,
    showStep: showStep
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})(typeof window !== 'undefined' ? window : globalThis);
