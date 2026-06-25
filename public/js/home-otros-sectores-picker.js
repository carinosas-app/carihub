/**
 * Home — «Ver otras categorías»: mismas pantallas que registro-perfil (categorías → subcategorías).
 * Destino final: Home + geo picker (no formulario de registro).
 */
(function (global) {
  'use strict';

  var ICON_GRID = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="2.2" fill="currentColor"/><circle cx="17" cy="7" r="2.2" fill="currentColor"/><circle cx="7" cy="17" r="2.2" fill="currentColor"/><circle cx="17" cy="17" r="2.2" fill="currentColor"/></svg>';
  var ICON_GO = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var TAP_MS = 180;

  var SECTOR_ORDER = [
    'bienestar', 'eventos', 'restaurantes', 'salud', 'profesionales',
    'tecnologia', 'bienes-raices', 'educacion', 'mascotas', 'industria',
    'automotriz', 'hogar', 'comercio', 'transporte'
  ];

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
    restaurantes: 'corporate',
    industria: 'industria'
  };

  var state = {
    step: 'cats',
    sector: null,
    onSelectSubcat: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sectorMeta(sectorId) {
    if (global.CariHubSectorCardImages && global.CariHubSectorCardImages.getSectorCardImage) {
      return global.CariHubSectorCardImages.getSectorCardImage(sectorId);
    }
    return null;
  }

  function sectorMobPath(pngPath) {
    var path = String(pngPath || '');
    if (path.indexOf('/sector-cards/') >= 0) return path;
    return path.replace('/sectores/', '/sectores/mob/').replace(/\.png$/i, '.jpg');
  }

  function buildSectorImageHtml(meta) {
    var pngPath = (meta && meta.src) || 'img/home/promo-perfil.jpg';
    var mob = sectorMobPath(pngPath);
    return (
      '<img class="rp-sector-card__img" src="' + esc(mob) + '" data-fallback="' + esc(pngPath) + '" alt="" ' +
      'loading="lazy" decoding="async" ' +
      'onerror="if(this.dataset.fallback){this.src=this.dataset.fallback;this.removeAttribute(\'data-fallback\')}">'
    );
  }

  function watermarkHtml(sectorId) {
    if (global.CariHubSectorCategoryWatermarks && global.CariHubSectorCategoryWatermarks.buildHtml) {
      return global.CariHubSectorCategoryWatermarks.buildHtml(sectorId);
    }
    return '';
  }

  function sectorsForHome() {
    var list = global.CARIHUB_SECTORES || [];
    var order = {};
    SECTOR_ORDER.forEach(function (id, i) { order[id] = i; });
    return list.filter(function (s) { return s.id !== 'adultos'; }).sort(function (a, b) {
      var ia = order[a.id];
      var ib = order[b.id];
      if (ia == null && ib == null) return 0;
      if (ia == null) return 1;
      if (ib == null) return -1;
      return ia - ib;
    });
  }

  function buildSectorCard(sector) {
    var subs = global.CariHubSectores && global.CariHubSectores.subcategoriasDeSector
      ? global.CariHubSectores.subcategoriasDeSector(sector.id)
      : [];
    var imgMeta = sectorMeta(sector.id) || { src: 'img/home/promo-perfil.jpg' };
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ch-geo-card rp-sector-card rp-sector-card--portrait';
    btn.setAttribute('data-sector-id', sector.id);
    var thumbStyle = imgMeta.bg ? ' style="background:' + esc(imgMeta.bg) + '"' : '';
    btn.innerHTML =
      '<span class="ch-geo-card__thumb ch-geo-card__thumb--portrait"' + thumbStyle + '>' +
        buildSectorImageHtml(imgMeta) +
      '</span>' +
      '<span class="ch-geo-card__body">' +
        watermarkHtml(sector.id) +
        '<span class="ch-geo-card__text">' +
          '<p class="ch-geo-card__title">' + esc(sector.nombre) + '</p>' +
          '<p class="ch-geo-card__meta">' + ICON_GRID + esc(subs.length + ' subcategorías') + '</p>' +
        '</span>' +
        '<span class="ch-geo-card__go" aria-hidden="true">' + ICON_GO + '</span>' +
      '</span>';
    btn.addEventListener('click', function () {
      btn.classList.add('is-selected');
      window.setTimeout(function () {
        openSubcats(sector);
      }, TAP_MS);
    });
    return btn;
  }

  function renderSectorCards() {
    var grid = $('homeOtrosSectorGrid');
    var hint = $('homeOtrosSectoresHint');
    var sectors = sectorsForHome();
    if (!grid) return;
    if (hint) hint.textContent = sectors.length + ' categorías · elige una para continuar';
    grid.innerHTML = '';
    sectors.forEach(function (sector) {
      var li = document.createElement('li');
      li.appendChild(buildSectorCard(sector));
      grid.appendChild(li);
    });
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
    if (global.CariHubSectorSubcatPicker) {
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

  function close() {
    var modal = $('modal-otros-sectores');
    if (modal) {
      modal.classList.remove('is-open', 'is-step-cats', 'is-step-subcats', 'rp-sector-subcats');
      modal.removeAttribute('data-rp-sector');
    }
    state.sector = null;
    state.step = 'cats';
    syncBodyClasses();
    if (!document.querySelector('.home-modal.is-open')) {
      document.body.style.overflow = '';
    }
  }

  function bind() {
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
    openSubcats: openSubcats,
    showStep: showStep
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})(typeof window !== 'undefined' ? window : globalThis);
