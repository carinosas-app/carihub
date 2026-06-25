/**
 * CariHub Geo Picker — Documento Maestro V5 (pantalla completa + tarjetas).
 */
(function (global) {
  'use strict';

  var GEO_LABELS = { pais: 'País', estado: 'Estado', ciudad: 'Ciudad' };
  var GEO_DROP = { pais: 'Elegir país', estado: 'Elegir estado', ciudad: 'Elegir ciudad' };
  var GEO_SEARCH = { pais: 'Buscar país...', estado: 'Buscar estado...', ciudad: 'Buscar ciudad...' };

  var ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-5.4-7-11a7 7 0 1 1 14 0c0 5.6-7 11-7 11z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="2"/></svg>';
  var ICON_USER = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2"/></svg>';
  var ICON_SEARCH = '<svg class="ch-geo-sheet__search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2.5"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
  var ICON_GO = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_PIN_HEADER =
    '<svg class="ch-geo-sheet__pin-svg" viewBox="0 0 32 42" aria-hidden="true">' +
      '<defs><linearGradient id="chGeoPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
        '<stop offset="0%" stop-color="#ff4f9a"/><stop offset="55%" stop-color="#e91e63"/><stop offset="100%" stop-color="#c2185b"/>' +
      '</linearGradient></defs>' +
      '<path d="M16 2C9.4 2 4 7.2 4 13.8c0 8.2 12 26.2 12 26.2s12-18 12-26.2C28 7.2 22.6 2 16 2z" fill="url(#chGeoPinGrad)"/>' +
      '<circle cx="16" cy="14" r="5.5" fill="#fff"/>' +
    '</svg>';
  var ICON_GLOBE =
    '<svg class="ch-geo-sheet__globe-svg" viewBox="0 0 48 48" aria-hidden="true">' +
      '<defs><linearGradient id="chGeoGlobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#fff"/><stop offset="42%" stop-color="#ffe4f0"/><stop offset="100%" stop-color="#ffc2dc"/>' +
      '</linearGradient></defs>' +
      '<circle cx="24" cy="24" r="17" fill="none" stroke="url(#chGeoGlobeGrad)" stroke-width="2.4"/>' +
      '<ellipse cx="24" cy="24" rx="17" ry="6" fill="none" stroke="rgba(255,255,255,.88)" stroke-width="1.35"/>' +
      '<ellipse cx="24" cy="24" rx="6" ry="17" fill="none" stroke="rgba(255,255,255,.78)" stroke-width="1.2"/>' +
      '<path d="M8 24h32" stroke="rgba(255,255,255,.65)" stroke-width="1.1" stroke-linecap="round"/>' +
      '<path d="M24 7c-4.2 4.8-6.4 10.2-6.4 17s2.2 12.2 6.4 17c4.2-4.8 6.4-10.2 6.4-17S28.2 11.8 24 7z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1"/>' +
      '<circle cx="24" cy="21" r="3.2" fill="#fff" opacity=".95"/>' +
      '<circle cx="24" cy="21" r="1.4" fill="#e91e63"/>' +
    '</svg>';

  var scriptsLoaded = false;
  var scriptsLoading = null;
  var modalReady = false;
  var activePicker = null;
  var selectorTipo = null;
  var showAllPaises = false;
  var geoScrollLockY = 0;
  var lastGeoFieldId = null;
  var homePickerInstance = null;
  var geoModalOpenedAt = 0;

  var DATA = global.CariHubGeoPickerData || {};
  var CATALOG = global.CariHubGeoCatalog || null;

  var LIST_BATCH = 40;
  var listState = { version: 0, options: [], rendered: 0 };

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('No se pudo cargar ' + src)); };
      document.head.appendChild(s);
    });
  }

  function loadGeoScripts() {
    if (scriptsLoaded || typeof PAISES_PRINCIPALES !== 'undefined') {
      scriptsLoaded = true;
      return Promise.resolve();
    }
    if (scriptsLoading) return scriptsLoading;
    scriptsLoading = Promise.all([
      loadScript('paises.js'),
      loadScript('estados.js'),
      loadScript('ciudades.js')
    ]).then(function () {
      scriptsLoaded = true;
    });
    return scriptsLoading;
  }

  function getGeoModalRoot() {
    return document.documentElement || document.body;
  }

  function raiseGeoModal(modal) {
    if (!modal) return;
    var root = getGeoModalRoot();
    if (modal.parentNode !== root) root.appendChild(modal);
    else root.appendChild(modal);
    modal.style.setProperty('z-index', '100001', 'important');
  }

  function onGeoCloseClick(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (Date.now() - geoModalOpenedAt < 320) return;
    closeModal();
  }

  function wireModalListeners() {
    var closeBtn = document.getElementById('chGeoClose');
    var backBtn = document.getElementById('chGeoModalBack');
    var navBtn = document.getElementById('chGeoNavBack');
    var input = document.getElementById('chGeoModalInput');
    if (closeBtn && closeBtn.dataset.chGeoWired !== '1') {
      closeBtn.dataset.chGeoWired = '1';
      closeBtn.addEventListener('click', onGeoCloseClick);
    }
    if (backBtn && backBtn.dataset.chGeoWired !== '1') {
      backBtn.dataset.chGeoWired = '1';
      backBtn.addEventListener('click', onGeoCloseClick);
    }
    if (navBtn && navBtn.dataset.chGeoWired !== '1') {
      navBtn.dataset.chGeoWired = '1';
      navBtn.addEventListener('click', onGeoCloseClick);
    }
    if (input && input.dataset.chGeoWired !== '1') {
      input.dataset.chGeoWired = '1';
      input.addEventListener('input', function () {
        if (activePicker) activePicker.renderList();
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var val = this.value.trim();
          if (val && activePicker) activePicker.selectValue(selectorTipo, val);
        }
      });
    }
  }

  function usesHomePaisPremium() {
    return document.body.getAttribute('data-page') === 'home';
  }

  function ensureModal() {
    var stale = document.getElementById('chGeoModal');
    if (stale && (!stale.querySelector('.ch-geo-sheet__crest') || !stale.querySelector('.ch-geo-glow-divider'))) {
      stale.remove();
      modalReady = false;
    }
    if (modalReady) return;
    if (document.getElementById('chGeoModal')) {
      raiseGeoModal(document.getElementById('chGeoModal'));
      wireModalListeners();
      modalReady = true;
      return;
    }

    var wrap = document.createElement('div');
    wrap.className = 'ch-geo-modal';
    wrap.id = 'chGeoModal';
    wrap.innerHTML =
      '<div class="ch-geo-sheet">' +
        '<div class="ch-geo-sheet__crest" id="chGeoCrest">' +
          '<div class="ch-geo-sheet__topbar">' +
            '<button type="button" class="ch-geo-sheet__nav" id="chGeoNavBack" aria-label="Volver">←</button>' +
            '<button type="button" class="ch-geo-sheet__close" id="chGeoClose" aria-label="Cerrar">×</button>' +
          '</div>' +
        '</div>' +
        '<div class="ch-geo-sheet__panel">' +
          '<div class="ch-geo-bg-sparkles" id="chGeoBgSparkles" aria-hidden="true"></div>' +
          '<header class="ch-geo-sheet__head ch-geo-sheet__head--pais">' +
            '<div class="ch-geo-head-deco" id="chGeoHeadDeco" aria-hidden="true" hidden>' +
              '<span class="ch-geo-head-deco__landmark" id="chGeoHeadLandmark" aria-hidden="true"></span>' +
              '<span class="ch-geo-head-deco__wash" aria-hidden="true"></span>' +
              '<span class="ch-geo-sparkle ch-geo-sparkle--tl ch-geo-sparkle--1"></span>' +
              '<span class="ch-geo-sparkle ch-geo-sparkle--tl ch-geo-sparkle--2"></span>' +
              '<span class="ch-geo-sparkle ch-geo-sparkle--tl ch-geo-sparkle--3"></span>' +
              '<span class="ch-geo-sparkle ch-geo-sparkle--tr ch-geo-sparkle--4"></span>' +
              '<span class="ch-geo-sparkle ch-geo-sparkle--tr ch-geo-sparkle--5"></span>' +
              '<span class="ch-geo-sparkle ch-geo-sparkle--tr ch-geo-sparkle--6"></span>' +
              '<span class="ch-geo-world-map" aria-hidden="true"></span>' +
            '</div>' +
            '<div class="ch-geo-sheet__heading" id="chGeoHeadingRow">' +
              '<span class="ch-geo-sheet__icon" id="chGeoHeadIcon" aria-hidden="true" hidden></span>' +
              '<h2 class="ch-geo-sheet__title" id="chGeoModalTitle">Selecciona tu país</h2>' +
            '</div>' +
            '<div class="ch-geo-glow-divider" id="chGeoGlowDivider" aria-hidden="true" hidden>' +
              '<span class="ch-geo-glow-divider__line"></span>' +
              '<span class="ch-geo-glow-divider__gem">✦</span>' +
              '<span class="ch-geo-glow-divider__line"></span>' +
            '</div>' +
            '<p class="ch-geo-sheet__subtitle" id="chGeoModalSubtitle">Explora perfiles, negocios y experiencias cerca de ti</p>' +
          '</header>' +
          '<a class="ch-geo-sheet__banner" href="registro-banner.html?slot=home_categorias" id="chGeoBanner">' +
            '<img src="' + ((global.CariHubBannerGeneral && global.CariHubBannerGeneral.pickGeneralBanner()) || 'img/home/banners/ad-banner-pink-01.png') + '" alt="" loading="lazy" decoding="async">' +
            '<span class="ch-geo-sheet__banner-overlay">' +
              '<span class="ch-geo-sheet__banner-title">¡ANÚNCIATE AQUÍ!</span>' +
              '<span class="ch-geo-sheet__banner-cta">Conoce más</span>' +
            '</span>' +
          '</a>' +
          '<label class="ch-geo-sheet__search">' +
            ICON_SEARCH +
            '<input type="search" id="chGeoModalInput" autocomplete="off">' +
          '</label>' +
          '<div class="ch-geo-sheet__scroll">' +
            '<h3 class="ch-geo-sheet__section-title" id="chGeoSectionTitle">🔥 Más populares</h3>' +
            '<div class="ch-geo-sheet__list" id="chGeoModalList"></div>' +
          '</div>' +
          '<button type="button" class="ch-geo-sheet__footer" id="chGeoModalBack">← Volver</button>' +
        '</div>' +
      '</div>';

    getGeoModalRoot().appendChild(wrap);
    raiseGeoModal(wrap);

    wireModalListeners();

    modalReady = true;
  }

  function readPageScrollY() {
    if (document.body.classList.contains('proto-active')) {
      return document.body.scrollTop || 0;
    }
    return window.scrollY || document.documentElement.scrollTop || 0;
  }

  function restorePageScrollY(y) {
    if (document.body.classList.contains('proto-active')) {
      document.body.scrollTop = y;
      return;
    }
    window.scrollTo(0, y);
  }

  function lockPageScroll() {
    var docEl = document.documentElement;
    geoScrollLockY = readPageScrollY();
    document.body.classList.add('ch-geo-modal-open');
    docEl.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function unlockPageScroll() {
    var docEl = document.documentElement;
    var y = geoScrollLockY;
    document.body.classList.remove('ch-geo-modal-open');
    docEl.style.overflow = '';
    if (!document.querySelector('.home-modal.is-open')) {
      document.body.style.overflow = '';
    }
    restorePageScrollY(y);
  }

  function focusGeoField(fieldId) {
    if (!fieldId) return;
    var field = document.getElementById(fieldId);
    if (!field || !field.focus) return;
    try {
      field.focus({ preventScroll: true });
    } catch (e) {
      field.focus();
    }
  }

  function closeModal() {
    var modal = document.getElementById('chGeoModal');
    if (!modal) return;
    var restoreField = lastGeoFieldId;
    var active = document.activeElement;
    if (active && modal.contains(active) && typeof active.blur === 'function') {
      active.blur();
    }
    modal.classList.remove('is-open');
    unlockPageScroll();
    selectorTipo = null;
    showAllPaises = false;
    lastGeoFieldId = null;
    focusGeoField(restoreField);
  }

  function applyHeadLandmark(picker, tipo) {
    var el = document.getElementById('chGeoHeadLandmark');
    if (!el) return;
    if (!usesHomePaisPremium()) {
      el.style.backgroundImage = '';
      el.hidden = true;
      return;
    }
    var src = DATA.headerLandmarkImage ? DATA.headerLandmarkImage(tipo, picker) : '';
    var pais = picker && picker.state ? picker.state.pais : '';
    if (src && DATA.sanitizeGeoCardImage && tipo !== 'pais') {
      src = DATA.sanitizeGeoCardImage(src, pais, tipo) || src;
    }
    if (src) {
      el.style.backgroundImage = 'url(\'' + String(src).replace(/'/g, '\\\'') + '\')';
      el.hidden = false;
    } else {
      el.style.backgroundImage = '';
      el.hidden = true;
    }
  }

  function shouldShowGeoDeco() {
    if (usesHomePaisPremium()) return true;
    if (usesRegistroGeoShell()) {
      var sector = document.body.getAttribute('data-rp-sector') || 'adultos';
      return sector !== 'adultos';
    }
    return false;
  }

  function syncGeoSparkles(modal) {
    if (!modal) modal = document.getElementById('chGeoModal');
    if (!modal) return;
    var S = global.CariHubSectorSparkles;
    if (!S) return;
    var panel = modal.querySelector('.ch-geo-sheet__panel');
    var sector = modal.getAttribute('data-rp-sector') || document.body.getAttribute('data-rp-sector') || '';
    if (usesRegistroGeoShell() && sector && sector !== 'adultos') {
      S.syncBody(sector);
      if (panel) S.ensureLayer(panel, sector);
    } else if (usesHomePaisPremium()) {
      S.syncBody('');
      if (panel) S.ensureLayer(panel, '');
    } else if (panel) {
      S.ensureLayer(panel, 'adultos');
    }
  }

  function updateSheetHeader(picker, tipo) {
    var icon = document.getElementById('chGeoHeadIcon');
    var title = document.getElementById('chGeoModalTitle');
    var subtitle = document.getElementById('chGeoModalSubtitle');
    var section = document.getElementById('chGeoSectionTitle');
    var input = document.getElementById('chGeoModalInput');
    var nav = document.getElementById('chGeoNavBack');
    var closeBtn = document.getElementById('chGeoClose');
    var modal = document.getElementById('chGeoModal');
    var head = document.querySelector('.ch-geo-sheet__head');
    var deco = document.getElementById('chGeoHeadDeco');
    var divider = document.getElementById('chGeoGlowDivider');
    var isHome = usesHomePaisPremium();
    var showDeco = shouldShowGeoDeco();

    if (modal) {
      modal.classList.remove('ch-geo-modal--pais', 'ch-geo-modal--estado', 'ch-geo-modal--ciudad');
      modal.classList.add('ch-geo-modal--' + tipo);
    }
    if (head) {
      head.classList.remove('ch-geo-sheet__head--pais', 'ch-geo-sheet__head--estado', 'ch-geo-sheet__head--ciudad');
      head.classList.add('ch-geo-sheet__head--' + tipo);
    }

    if (tipo === 'pais') {
      if (icon) {
        if (isHome) {
          icon.hidden = true;
          icon.innerHTML = '';
          icon.className = 'ch-geo-sheet__icon';
        } else {
          icon.hidden = false;
          icon.className = 'ch-geo-sheet__icon ch-geo-sheet__icon--globe';
          icon.innerHTML = ICON_GLOBE;
        }
      }
      if (deco) {
        deco.hidden = !showDeco;
        if (showDeco) {
          deco.classList.remove('ch-geo-head-deco--pais', 'ch-geo-head-deco--estado', 'ch-geo-head-deco--ciudad');
          deco.classList.add('ch-geo-head-deco--pais');
        }
      }
      if (divider) divider.hidden = !showDeco;
      if (title) {
        title.textContent = 'Selecciona tu país';
        title.classList.toggle('ch-geo-sheet__title--gradient', isHome);
      }
      if (subtitle) {
        if (document.body.getAttribute('data-page') === 'home' && global.__homeGeoPaisHint) {
          global.__homeGeoPaisHint = false;
          subtitle.textContent = 'Categoría seleccionada. Elige un país para seguir (× arriba para cerrar).';
        } else {
          subtitle.textContent = 'Explora perfiles, negocios, experiencias cerca de ti';
        }
        subtitle.style.display = '';
      }
      if (section) section.textContent = '🔥 Más populares';
      if (input) input.placeholder = GEO_SEARCH.pais;
      if (nav) nav.style.visibility = 'hidden';
      if (closeBtn) closeBtn.style.visibility = 'visible';
    } else if (tipo === 'estado') {
      if (deco) {
        deco.hidden = !showDeco;
        if (showDeco) {
          deco.classList.remove('ch-geo-head-deco--pais', 'ch-geo-head-deco--estado', 'ch-geo-head-deco--ciudad');
          deco.classList.add('ch-geo-head-deco--estado');
        }
      }
      if (divider) divider.hidden = !showDeco;
      if (title) title.classList.remove('ch-geo-sheet__title--gradient');
      if (icon) {
        icon.hidden = false;
        var flagUrl = DATA.flagImageUrl ? DATA.flagImageUrl(picker.state.pais) : '';
        icon.className = 'ch-geo-sheet__icon ch-geo-sheet__icon--flag-img';
        if (flagUrl) {
          icon.innerHTML = '<img src="' + esc(flagUrl) + '" alt="">';
        } else {
          icon.innerHTML = '';
          icon.textContent = DATA.flagFor ? DATA.flagFor(picker.state.pais) : '🌎';
        }
      }
      if (title) title.textContent = picker.state.pais || 'País';
      if (subtitle) {
        if (document.body.getAttribute('data-page') === 'home' && !localStorage.getItem('carihub_home_geo_estado_hint')) {
          subtitle.textContent = 'Opcional: elige un estado para afinar tu búsqueda';
          localStorage.setItem('carihub_home_geo_estado_hint', '1');
        } else {
          subtitle.textContent = 'Selecciona un estado';
        }
        subtitle.style.display = '';
      }
      if (section) section.textContent = '🔥 Más populares';
      if (input) input.placeholder = GEO_SEARCH.estado;
      if (nav) nav.style.visibility = 'visible';
      if (closeBtn) closeBtn.style.visibility = 'hidden';
    } else if (tipo === 'ciudad') {
      if (deco) {
        deco.hidden = !showDeco;
        if (showDeco) {
          deco.classList.remove('ch-geo-head-deco--pais', 'ch-geo-head-deco--estado', 'ch-geo-head-deco--ciudad');
          deco.classList.add('ch-geo-head-deco--ciudad');
        }
      }
      if (divider) divider.hidden = !showDeco;
      if (title) title.classList.remove('ch-geo-sheet__title--gradient');
      if (icon) {
        icon.hidden = false;
        icon.className = 'ch-geo-sheet__icon ch-geo-sheet__icon--pin';
        icon.innerHTML = ICON_PIN_HEADER;
      }
      if (title) {
        title.textContent = DATA.displayName
          ? DATA.displayName(picker.state.estado)
          : (picker.state.estado || 'Estado');
      }
      if (subtitle) {
        if (document.body.getAttribute('data-page') === 'home' && !localStorage.getItem('carihub_home_geo_ciudad_hint')) {
          subtitle.textContent = 'Opcional: elige una ciudad para mayor precisión';
          localStorage.setItem('carihub_home_geo_ciudad_hint', '1');
        } else {
          subtitle.textContent = 'Selecciona una ciudad';
        }
        subtitle.style.display = '';
      }
      if (section) section.textContent = '🔥 Más populares';
      if (input) input.placeholder = GEO_SEARCH.ciudad;
      if (nav) nav.style.visibility = 'visible';
      if (closeBtn) closeBtn.style.visibility = 'hidden';
    }
    applyHeadLandmark(picker, tipo);
  }

  function openModal(picker, tipo) {
    ensureModal();
    activePicker = picker;
    selectorTipo = tipo;
    showAllPaises = false;
    var modal = document.getElementById('chGeoModal');
    var input = document.getElementById('chGeoModalInput');
    var ids = picker.ids(tipo);
    lastGeoFieldId = ids.field;
    updateSheetHeader(picker, tipo);
    syncRegistroGeoTheme(modal);
    if (input) input.value = '';
    picker.renderList();
    raiseGeoModal(modal);
    lockPageScroll();
    geoModalOpenedAt = Date.now();
    modal.classList.add('is-open');
    setTimeout(function () {
      if (input) {
        try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
      }
    }, 180);
  }

  function resolveCiudadesOptions(picker) {
    if (!picker.state.pais || !picker.state.estado) return [];
    var pais = picker.state.pais;
    var estado = picker.state.estado;
    if (CATALOG && CATALOG.usesLazyCatalog(pais)) {
      return CATALOG.getCiudades(pais, estado);
    }
    if (
      typeof CIUDADES !== 'undefined' &&
      CIUDADES[pais] &&
      CIUDADES[pais][estado]
    ) {
      return CIUDADES[pais][estado];
    }
    if (pais === 'México' && typeof municipiosDeEstadoMexico === 'function') {
      return municipiosDeEstadoMexico(estado);
    }
    return [];
  }

  function resolveEstadosOptions(picker) {
    if (!picker.state.pais) return [];
    var pais = picker.state.pais;
    if (CATALOG && CATALOG.usesLazyCatalog(pais)) {
      return CATALOG.getEstados(pais);
    }
    if (typeof ESTADOS !== 'undefined' && ESTADOS[pais]) {
      return ESTADOS[pais].slice();
    }
    return [];
  }

  function getOptions(picker, tipo) {
    if (tipo === 'pais') {
      if (showAllPaises && typeof TODOS_LOS_PAISES !== 'undefined') return TODOS_LOS_PAISES;
      return typeof PAISES_PRINCIPALES !== 'undefined' ? PAISES_PRINCIPALES : [];
    }
    if (tipo === 'estado') {
      return resolveEstadosOptions(picker);
    }
    if (tipo === 'ciudad') {
      return resolveCiudadesOptions(picker);
    }
    return [];
  }

  var POPULAR_PAISES = [
    'México', 'Estados Unidos', 'Colombia', 'Chile', 'Uruguay',
    'Argentina', 'Brasil', 'Canadá', 'España'
  ];
  var POPULAR_ESTADOS_MX = ['Nuevo León', 'Ciudad de México', 'Jalisco', 'Baja California', 'Puebla'];
  var POPULAR_ESTADOS_UY = ['Montevideo', 'Maldonado', 'Canelones', 'Colonia', 'Salto'];
  var POPULAR_ESTADOS_CL = [
    'Región Metropolitana de Santiago',
    'Valparaíso',
    'Biobío',
    'Antofagasta',
    'Maule'
  ];
  var POPULAR_ESTADOS_CO = ['Antioquia', 'Bogotá D.C.', 'Valle del Cauca', 'Atlántico', 'Santander'];
  var POPULAR_ESTADOS_PE = ['Lima', 'Arequipa', 'La Libertad', 'Piura', 'Cusco'];
  var POPULAR_ESTADOS_AR = ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Ciudad Autónoma de Buenos Aires'];
  var POPULAR_ESTADOS_BR = ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná'];
  var POPULAR_CIUDADES_NL = [
    'Monterrey',
    'San Nicolás',
    'Apodaca',
    'Guadalupe',
    'Escobedo',
    'García',
    'Juárez'
  ];
  var POPULAR_CIUDADES_MONTEVIDEO = [
    'Montevideo',
    'Pocitos',
    'Carrasco',
    'Punta Carretas',
    'Tres Cruces',
    'Malvín'
  ];
  var POPULAR_CIUDADES_MALDONADO = ['Punta del Este', 'Maldonado', 'Piriápolis', 'San Carlos'];
  var POPULAR_CIUDADES_RM = [
    'Santiago',
    'Providencia',
    'Las Condes',
    'Maipú',
    'Puente Alto',
    'La Florida',
    'Ñuñoa'
  ];
  var POPULAR_CIUDADES_VALPO = ['Viña del Mar', 'Valparaíso', 'Quilpué', 'Concón', 'San Antonio'];

  function sortPopular(list, order) {
    if (!order || !order.length) return list;
    var rank = {};
    order.forEach(function (name, i) { rank[name] = i; });
    return list.slice().sort(function (a, b) {
      var ra = rank[a];
      var rb = rank[b];
      if (ra == null && rb == null) return String(a).localeCompare(String(b), 'es');
      if (ra == null) return 1;
      if (rb == null) return -1;
      return ra - rb;
    });
  }

  function getPopularOrder(picker, tipo) {
    if (tipo === 'pais') return POPULAR_PAISES;
    if (tipo === 'estado') {
      var pais = picker.state.pais;
      if (pais === 'México') return POPULAR_ESTADOS_MX;
      if (pais === 'Uruguay') return POPULAR_ESTADOS_UY;
      if (pais === 'Chile') return POPULAR_ESTADOS_CL;
      if (pais === 'Colombia') return POPULAR_ESTADOS_CO;
      if (pais === 'Perú') return POPULAR_ESTADOS_PE;
      if (pais === 'Argentina') return POPULAR_ESTADOS_AR;
      if (pais === 'Brasil') return POPULAR_ESTADOS_BR;
      return null;
    }
    if (tipo === 'ciudad') {
      var estado = picker.state.estado;
      if (estado === 'Nuevo León') return POPULAR_CIUDADES_NL;
      if (estado === 'Montevideo') return POPULAR_CIUDADES_MONTEVIDEO;
      if (estado === 'Maldonado') return POPULAR_CIUDADES_MALDONADO;
      if (estado === 'Región Metropolitana de Santiago') return POPULAR_CIUDADES_RM;
      if (estado === 'Valparaíso') return POPULAR_CIUDADES_VALPO;
      return null;
    }
    return null;
  }

  function needsCatalogLoad(picker, tipo) {
    return CATALOG &&
      CATALOG.usesLazyCatalog(picker.state.pais) &&
      (tipo === 'estado' || tipo === 'ciudad');
  }

  function prepareOptions(picker, listaPersonalizada) {
    if (listaPersonalizada) {
      return Promise.resolve(listaPersonalizada);
    }
    var tipo = selectorTipo;
    var loadPromise = needsCatalogLoad(picker, tipo)
      ? CATALOG.ensureLoaded(picker.state.pais)
      : Promise.resolve();
    return loadPromise.then(function () {
      var opciones = getOptions(picker, tipo);
      var inputEl = document.getElementById('chGeoModalInput');
      var hasQuery = inputEl && String(inputEl.value || '').trim();
      if (!hasQuery) {
        if (tipo === 'estado' || tipo === 'ciudad') {
          var popularOrder = getPopularOrder(picker, tipo);
          if (popularOrder && popularOrder.length) {
            opciones = sortPopular(opciones, popularOrder);
          } else {
            opciones = opciones.slice().sort(function (a, b) {
              return String(a).localeCompare(String(b), 'es');
            });
          }
        } else if (tipo === 'pais' && showAllPaises) {
          opciones = opciones.slice().sort(function (a, b) {
            return String(a).localeCompare(String(b), 'es');
          });
        } else {
          opciones = sortPopular(opciones, getPopularOrder(picker, tipo));
        }
      }
      return opciones;
    });
  }

  function wireListCardClicks(self, list, root) {
    var scope = root || list;
    scope.querySelectorAll('.ch-geo-card:not([data-ch-wired])').forEach(function (btn) {
      btn.setAttribute('data-ch-wired', '1');
      btn.addEventListener('click', function () {
        self.selectValue(selectorTipo, btn.getAttribute('data-value'));
      });
    });
  }

  function appendListBatch(self, list) {
    var from = listState.rendered;
    var to = Math.min(from + LIST_BATCH, listState.options.length);
    if (from >= to) return false;
    var html = '';
    for (var i = from; i < to; i++) {
      html += buildCardHtml(cardDataForOption(self, selectorTipo, listState.options[i]));
    }
    list.insertAdjacentHTML('beforeend', html);
    wireListCardClicks(self, list, list);
    listState.rendered = to;
    return to < listState.options.length;
  }

  function ensureListScrollWatcher(self) {
    var scroll = document.querySelector('.ch-geo-sheet__scroll');
    if (!scroll) return;
    if (scroll.dataset.chGeoListScroll === '1') return;
    scroll.dataset.chGeoListScroll = '1';
    scroll.addEventListener('scroll', function () {
      if (listState.rendered >= listState.options.length) return;
      if (scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 140) {
        var list = document.getElementById('chGeoModalList');
        if (!list) return;
        appendListBatch(self, list);
        var sentinel = list.querySelector('.ch-geo-sheet__list-sentinel');
        if (sentinel && listState.rendered >= listState.options.length) {
          sentinel.remove();
        }
      }
    }, { passive: true });
  }

  function renderMoreList(self, list) {
    var hasMore = appendListBatch(self, list);
    if (hasMore && !list.querySelector('.ch-geo-sheet__list-sentinel')) {
      var sentinel = document.createElement('div');
      sentinel.className = 'ch-geo-sheet__list-sentinel';
      sentinel.setAttribute('aria-hidden', 'true');
      list.appendChild(sentinel);
    }
  }
  function filterOptions(picker, text) {
    var base = getOptions(picker, selectorTipo);
    if (selectorTipo === 'pais' && showAllPaises && typeof TODOS_LOS_PAISES !== 'undefined') {
      base = TODOS_LOS_PAISES;
    }
    text = String(text || '').trim().toLowerCase();
    if (!text) return base;
    return base.filter(function (op) {
      return String(op).toLowerCase().indexOf(text) >= 0;
    });
  }

  function usesRegistroGeoShell() {
    return document.body.classList.contains('rp-screen1-form') ||
      document.body.classList.contains('rp-screen4-form') ||
      document.body.getAttribute('data-page') === 'home';
  }

  function syncRegistroGeoTheme(modal) {
    if (!modal) return;
    var isRegistro = usesRegistroGeoShell();
    var isHome = document.body.getAttribute('data-page') === 'home';
    modal.classList.toggle('ch-geo-modal--home', isHome);
    modal.classList.toggle('ch-geo-modal--registro', isRegistro);
    if (!isRegistro) {
      modal.removeAttribute('data-rp-sector');
      modal.style.removeProperty('--rp-form-accent');
      modal.style.removeProperty('--geo-grad');
      modal.style.removeProperty('--geo-shadow');
      return;
    }
    var sector = document.body.getAttribute('data-rp-sector') || 'adultos';
    if (document.body.getAttribute('data-page') === 'home') {
      sector = 'adultos';
    }
    modal.setAttribute('data-rp-sector', sector);
    var cs = window.getComputedStyle(document.body);
    var accent = cs.getPropertyValue('--rp-form-accent').trim();
    var geoEl = document.getElementById('rpGeoPicker');
    var grad = '';
    if (geoEl) {
      grad = window.getComputedStyle(geoEl).getPropertyValue('--geo-grad').trim();
    }
    if (!grad && sector === 'adultos') {
      grad = 'linear-gradient(180deg, #ff2d6f 0%, #ec1458 45%, #c8004a 100%)';
    }
    if (!grad && accent && sector !== 'adultos') {
      grad = 'linear-gradient(180deg, color-mix(in srgb, ' + accent + ' 70%, #fff) 0%, ' +
        accent + ' 52%, color-mix(in srgb, ' + accent + ' 88%, #000) 100%)';
    }
    if (accent) modal.style.setProperty('--rp-form-accent', accent);
    if (grad) modal.style.setProperty('--geo-grad', grad);
    var shadow = '';
    if (geoEl) {
      shadow = window.getComputedStyle(geoEl).getPropertyValue('--geo-shadow').trim();
    }
    syncGeoSparkles(modal);
    if (!shadow && accent && sector !== 'adultos') {
      shadow = '0 8px 24px color-mix(in srgb, ' + accent + ' 38%, transparent)';
    } else if (!shadow && sector === 'adultos') {
      shadow = '0 8px 24px rgba(233, 30, 99, 0.38)';
    }
    if (shadow) modal.style.setProperty('--geo-shadow', shadow);
  }

  function isFlagLandmarkUrl(url) {
    if (!url) return false;
    return /flagcdn\.com/i.test(url) || /\/flags\//i.test(url);
  }

  function buildHomeGeoPremiumCardHtml(opts) {
    var paisCtx = opts.pais || '';
    var cardImg = DATA.sanitizeGeoCardImage
      ? DATA.sanitizeGeoCardImage(opts.image, paisCtx, opts.tipo)
      : opts.image;
    var textBlock =
      '<span class="ch-geo-card__text">' +
        '<p class="ch-geo-card__title">' + esc(opts.title) + '</p>' +
        (opts.meta1 ? '<p class="ch-geo-card__meta">' + ICON_PIN + '<span>' + esc(opts.meta1) + '</span></p>' : '') +
        (opts.meta2 ? '<p class="ch-geo-card__meta">' + ICON_USER + '<span>' + esc(opts.meta2) + '</span></p>' : '') +
      '</span>';
    var landmarkSrc = opts.tipo === 'pais'
      ? (opts.landmark || '')
      : (opts.landmark || cardImg || '');
    if (opts.tipo === 'pais' && isFlagLandmarkUrl(landmarkSrc)) {
      landmarkSrc = DATA.landmarkImage ? DATA.landmarkImage(opts.value || opts.title) : '';
    }
    if (opts.tipo !== 'pais' && DATA.sanitizeGeoCardImage) {
      landmarkSrc = DATA.sanitizeGeoCardImage(landmarkSrc, paisCtx, opts.tipo) || landmarkSrc;
    }
    var landmarkHtml = landmarkSrc
      ? '<span class="ch-geo-card__landmark" style="background-image:url(\'' + esc(landmarkSrc) + '\')" aria-hidden="true"></span>'
      : '';
    var leftFloatHtml;
    if (opts.tipo === 'pais') {
      var flagCoin;
      if (!opts.image) {
        flagCoin =
          '<span class="ch-geo-card__flag-coin ch-geo-card__flag-coin--emoji" aria-hidden="true">' +
            esc(opts.flag || '🌎') +
          '</span>';
      } else {
        flagCoin =
          '<span class="ch-geo-card__flag-coin" style="background-image:url(\'' + esc(opts.image) + '\')" aria-hidden="true"></span>';
      }
      leftFloatHtml = '<span class="ch-geo-card__flag-float">' + flagCoin + '</span>';
    } else {
      var photoCoin = cardImg
        ? '<span class="ch-geo-card__photo-coin" style="background-image:url(\'' + esc(cardImg) + '\')" aria-hidden="true"></span>'
        : '<span class="ch-geo-card__photo-coin ch-geo-card__photo-coin--fallback" aria-hidden="true"></span>';
      leftFloatHtml = '<span class="ch-geo-card__photo-float">' + photoCoin + '</span>';
    }
    var tipoClass = opts.tipo ? ' ch-geo-card--' + opts.tipo : '';
    return (
      '<button type="button" class="ch-geo-card ch-geo-card--glass' + tipoClass + '" data-value="' + esc(opts.value) + '">' +
        landmarkHtml +
        leftFloatHtml +
        '<span class="ch-geo-card__body">' +
          textBlock +
          '<span class="ch-geo-card__go ch-geo-card__go--float" aria-hidden="true">' + ICON_GO + '</span>' +
        '</span>' +
      '</button>'
    );
  }

  function buildCardHtml(opts) {
    if (usesHomePaisPremium() && (opts.tipo === 'pais' || opts.tipo === 'estado' || opts.tipo === 'ciudad')) {
      return buildHomeGeoPremiumCardHtml(opts);
    }
    var thumbExtra = (DATA.thumbClassFor && opts.tipo)
      ? DATA.thumbClassFor(opts.tipo, opts.value || opts.title)
      : '';
    var thumbClass = 'ch-geo-card__thumb' + (thumbExtra ? ' ' + thumbExtra : '');
    var textBlock =
      '<span class="ch-geo-card__text">' +
        '<p class="ch-geo-card__title">' + esc(opts.title) + '</p>' +
        (opts.meta1 ? '<p class="ch-geo-card__meta">' + ICON_PIN + '<span>' + esc(opts.meta1) + '</span></p>' : '') +
        (opts.meta2 ? '<p class="ch-geo-card__meta">' + ICON_USER + '<span>' + esc(opts.meta2) + '</span></p>' : '') +
      '</span>';
    var tipoClass = opts.tipo ? ' ch-geo-card--' + opts.tipo : '';
    var thumbInner;
    if (opts.tipo === 'pais' && !opts.image) {
      thumbClass += ' ch-geo-card__thumb--flag-emoji';
      thumbInner = '<span class="ch-geo-card__flag-emoji" aria-hidden="true">' + esc(opts.flag || '🌎') + '</span>';
    } else {
      var imgErr = opts.tipo === 'pais'
        ? 'onerror="if(!this.dataset.fb){this.dataset.fb=1;var p=this.parentElement;if(p){p.classList.add(\'ch-geo-card__thumb--flag-emoji\');this.style.display=\'none\';var e=document.createElement(\'span\');e.className=\'ch-geo-card__flag-emoji\';e.setAttribute(\'aria-hidden\',\'true\');e.textContent=\'\\uD83C\\uDF0E\';p.appendChild(e);}}"'
        : 'onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src=\'img/home/promo-perfil.jpg\';}"';
      thumbInner =
        '<img src="' + esc(opts.image) + '" alt="" loading="lazy" decoding="async" ' + imgErr + '>';
    }
    return (
      '<button type="button" class="ch-geo-card' + tipoClass + '" data-value="' + esc(opts.value) + '">' +
        '<span class="' + thumbClass + '">' +
          thumbInner +
        '</span>' +
        '<span class="ch-geo-card__body">' +
          textBlock +
          '<span class="ch-geo-card__go" aria-hidden="true">' + ICON_GO + '</span>' +
        '</span>' +
      '</button>'
    );
  }

  function cardDataForOption(picker, tipo, name) {
    var imgFn = DATA.imageFor || function () { return 'img/home/promo-perfil.jpg'; };
    var fmtFn = DATA.formatPerfiles || function (n, plus) { return String(n) + ' perfiles'; };
    var stubFn = DATA.stubPerfiles || function () { return 1200; };
    var flagFn = DATA.flagFor || function () { return ''; };
    var divFn = DATA.divisionWord || function () { return 'estados'; };
    var capFn = DATA.capitalFor || function (n) { return n; };
    var labelFn = DATA.displayName || function (n) { return n; };

    if (tipo === 'pais') {
      var estCount = (typeof ESTADOS !== 'undefined' && ESTADOS[name]) ? ESTADOS[name].length : 0;
      if (DATA.divisionCount) estCount = DATA.divisionCount(name, estCount);
      var pop = stubFn(name);
      return {
        value: name,
        tipo: 'pais',
        image: imgFn('pais', name, ''),
        flag: flagFn(name),
        landmark: DATA.landmarkImage ? DATA.landmarkImage(name) : '',
        title: name,
        meta1: estCount + ' ' + divFn(name),
        meta2: fmtFn(pop, true)
      };
    }
    if (tipo === 'estado') {
      var cap = capFn(name);
      var label = labelFn(name);
      var estadoImg = imgFn('estado', name, picker.state.pais);
      return {
        value: name,
        tipo: 'estado',
        pais: picker.state.pais,
        image: estadoImg,
        landmark: estadoImg,
        title: label,
        meta1: cap,
        meta2: fmtFn(stubFn(name, 3200), false)
      };
    }
    var ciudadImg = imgFn('ciudad', name, picker.state.pais, picker.state.estado);
    return {
      value: name,
      tipo: 'ciudad',
      pais: picker.state.pais,
      image: ciudadImg,
      landmark: ciudadImg,
      title: labelFn(name),
      meta1: labelFn(name),
      meta2: fmtFn(stubFn(name, 1200), false)
    };
  }

  function GeoPicker(config) {
    config = config || {};
    this.prefix = config.prefix || 'geo';
    this.hidden = config.hidden || {};
    this.externalFields = config.externalFields || null;
    this.onChange = config.onChange || null;
    this.state = { pais: '', estado: '', ciudad: '' };
    this.mounted = false;
  }

  GeoPicker.prototype.ids = function (tipo) {
    if (this.externalFields && this.externalFields[tipo]) {
      return {
        field: this.externalFields[tipo].field,
        label: this.externalFields[tipo].label
      };
    }
    var p = this.prefix;
    return {
      field: p + 'Field' + tipo.charAt(0).toUpperCase() + tipo.slice(1),
      label: p + 'Field' + tipo.charAt(0).toUpperCase() + tipo.slice(1) + 'Label'
    };
  };

  GeoPicker.prototype.fieldHtml = function (tipo) {
    var ids = this.ids(tipo);
    var drop = GEO_DROP[tipo];
    var label = GEO_LABELS[tipo];
    return (
      '<div class="home-field home-field--' + tipo + ' home-surface-pastel" id="' + esc(ids.field) + '" role="button" tabindex="0" aria-label="' + esc(drop) + '">' +
        '<div class="home-field__display" aria-hidden="true">' +
          '<div class="home-field__display-bg home-field__display-bg--carinosas home-field__display-bg--' + tipo + '"></div>' +
          '<div class="home-field__dropzone">' +
            '<span class="home-field__drop-text">' + esc(drop) + '</span>' +
          '</div>' +
        '</div>' +
        '<span class="home-field__value home-field__label" id="' + esc(ids.label) + '">' + esc(label) + '</span>' +
        '<span class="home-field__arrow" aria-hidden="true">▼</span>' +
        '<span class="home-field__glow" aria-hidden="true"></span>' +
      '</div>'
    );
  };

  GeoPicker.prototype.mount = function (container) {
    var self = this;
    if (this.externalFields) {
      return this.bindExternalFields();
    }
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) return this;

    container.classList.add('ch-geo-picker');
    container.innerHTML =
      '<div class="ch-geo-picker__field">' +
        '<span class="ch-geo-picker__label">' + esc(GEO_LABELS.pais) + '</span>' +
        self.fieldHtml('pais') +
      '</div>' +
      '<div class="ch-geo-picker__row">' +
        '<div class="ch-geo-picker__col">' +
          '<span class="ch-geo-picker__label">' + esc(GEO_LABELS.estado) + '</span>' +
          self.fieldHtml('estado') +
        '</div>' +
        '<div class="ch-geo-picker__col">' +
          '<span class="ch-geo-picker__label">' + esc(GEO_LABELS.ciudad) + '</span>' +
          self.fieldHtml('ciudad') +
        '</div>' +
      '</div>';

    ['pais', 'estado', 'ciudad'].forEach(function (tipo) {
      var field = document.getElementById(self.ids(tipo).field);
      if (!field) return;
      field.addEventListener('click', function () { self.open(tipo); });
      field.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          self.open(tipo);
        }
      });
    });

    this.mounted = true;
    return this;
  };

  function bindGeoFieldClick(picker, field, tipo) {
    if (!field || !picker || field.dataset.chGeoBound === '1') return;
    if (field.dataset.bridgeGeoBound === '1') return;
    field.dataset.chGeoBound = '1';
    field.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      picker.open(tipo);
    });
    field.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        picker.open(tipo);
      }
    });
  }

  GeoPicker.prototype.bindExternalFields = function () {
    var self = this;
    if (!this.externalFields) return this;
    ['pais', 'estado', 'ciudad'].forEach(function (tipo) {
      var ids = self.ids(tipo);
      bindGeoFieldClick(self, document.getElementById(ids.field), tipo);
    });
    this.mounted = true;
    return this;
  };

  GeoPicker.prototype.syncHidden = function () {
    var map = this.hidden;
    if (map.pais) {
      var hp = document.getElementById(map.pais);
      if (hp) hp.value = this.state.pais || '';
    }
    if (map.estado) {
      var he = document.getElementById(map.estado);
      if (he) he.value = this.state.estado || '';
    }
    if (map.ciudad) {
      var hc = document.getElementById(map.ciudad);
      if (hc) hc.value = this.state.ciudad || '';
    }
  };

  GeoPicker.prototype.updateFieldUi = function (tipo, value) {
    var ids = this.ids(tipo);
    var field = document.getElementById(ids.field);
    var label = document.getElementById(ids.label);
    if (label) label.textContent = value || GEO_LABELS[tipo];
    if (field) field.classList.toggle('is-selected', !!value);
  };

  GeoPicker.prototype.setValues = function (values) {
    values = values || {};
    this.state.pais = values.pais || '';
    this.state.estado = values.estado || '';
    this.state.ciudad = values.ciudad || '';
    this.updateFieldUi('pais', this.state.pais);
    this.updateFieldUi('estado', this.state.estado);
    this.updateFieldUi('ciudad', this.state.ciudad);
    this.syncHidden();
  };

  GeoPicker.prototype.getValues = function () {
    return {
      pais: this.state.pais,
      estado: this.state.estado,
      ciudad: this.state.ciudad
    };
  };

  GeoPicker.prototype.selectValue = function (tipo, valor) {
    if (tipo === 'pais') {
      this.state.pais = valor;
      this.state.estado = '';
      this.state.ciudad = '';
      this.updateFieldUi('pais', valor);
      this.updateFieldUi('estado', '');
      this.updateFieldUi('ciudad', '');
      if (CATALOG && CATALOG.usesLazyCatalog(valor)) {
        CATALOG.ensureLoaded(valor).catch(function () { /* prefetch best-effort */ });
      }
    } else if (tipo === 'estado') {
      this.state.estado = valor;
      this.state.ciudad = '';
      this.updateFieldUi('estado', valor);
      this.updateFieldUi('ciudad', '');
    } else if (tipo === 'ciudad') {
      this.state.ciudad = valor;
      this.updateFieldUi('ciudad', valor);
    }
    this.syncHidden();
    closeModal();
    if (this.onChange) this.onChange(this.getValues());
  };

  GeoPicker.prototype.renderList = function (listaPersonalizada) {
    var self = this;
    var list = document.getElementById('chGeoModalList');
    if (!list || !selectorTipo) return;

    var version = ++listState.version;
    listState.options = [];
    listState.rendered = 0;
    list.innerHTML = '<div class="ch-geo-sheet__loading">Cargando ubicaciones…</div>';

    var inputEl = document.getElementById('chGeoModalInput');
    var hasQuery = inputEl && String(inputEl.value || '').trim();
    var prepPromise = hasQuery
      ? (needsCatalogLoad(self, selectorTipo)
          ? CATALOG.ensureLoaded(self.state.pais).then(function () {
              return filterOptions(self, inputEl.value);
            })
          : Promise.resolve(filterOptions(self, inputEl.value)))
      : prepareOptions(self, listaPersonalizada);

    prepPromise.then(function (opciones) {
      if (version !== listState.version) return;
      list.innerHTML = '';
      listState.options = opciones || [];

      if (!listState.options.length) {
        list.innerHTML = '<div class="ch-geo-sheet__empty">No hay resultados. Escribe el nombre arriba y presiona Enter.</div>';
        return;
      }

      var useBatches = listState.options.length > LIST_BATCH &&
        (selectorTipo === 'estado' || selectorTipo === 'ciudad') &&
        !hasQuery;

      if (useBatches) {
        renderMoreList(self, list);
        ensureListScrollWatcher(self);
      } else {
        listState.options.forEach(function (name) {
          list.insertAdjacentHTML('beforeend', buildCardHtml(cardDataForOption(self, selectorTipo, name)));
        });
        wireListCardClicks(self, list);
      }

      if (selectorTipo === 'pais' && !listaPersonalizada && !showAllPaises && !hasQuery) {
        var more = document.createElement('button');
        more.type = 'button';
        more.className = 'ch-geo-sheet__more';
        more.textContent = '🌍 Ver más países';
        more.addEventListener('click', function () {
          showAllPaises = true;
          var section = document.getElementById('chGeoSectionTitle');
          if (section) section.textContent = '🌎 Todos los países';
          self.renderList();
        });
        list.appendChild(more);
      }
    }).catch(function () {
      if (version !== listState.version) return;
      list.innerHTML = '<div class="ch-geo-sheet__empty">No se pudo cargar la lista. Revisa tu conexión e intenta de nuevo.</div>';
    });
  };

  GeoPicker.prototype.open = function (tipo) {
    var self = this;
    var modal = document.getElementById('chGeoModal');
    if (modal && modal.classList.contains('is-open') && selectorTipo === tipo) return;
    if (tipo === 'estado' && !this.state.pais) {
      alert('Primero selecciona país.');
      return;
    }
    if (tipo === 'ciudad' && (!this.state.pais || !this.state.estado)) {
      alert('Primero selecciona país y estado.');
      return;
    }
    loadGeoScripts().then(function () {
      openModal(self, tipo);
    }).catch(function () {
      alert('No se pudo cargar la lista de ubicaciones.');
    });
  };

  GeoPicker.prototype.ensureReady = function (cb) {
    loadGeoScripts().then(function () {
      if (cb) cb();
    }).catch(function () {
      if (cb) cb();
    });
  };

  function mount(config) {
    config = config || {};
    ensureModal();
    var picker = new GeoPicker(config);
    if (config.externalFields) {
      picker.externalFields = config.externalFields;
      picker.bindExternalFields();
    } else if (config.container) {
      picker.mount(config.container);
    }
    return picker;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var modal = document.getElementById('chGeoModal');
    if (!modal || !modal.classList.contains('is-open')) return;
    e.preventDefault();
    closeModal();
  });

  function bootHomeGeoPicker(onChange) {
    if (homePickerInstance) return homePickerInstance;
    if (!document.getElementById('fieldPais')) return null;
    ensureModal();
    homePickerInstance = new GeoPicker({
      externalFields: {
        pais: { field: 'fieldPais', label: 'fieldPaisLabel' },
        estado: { field: 'fieldEstado', label: 'fieldEstadoLabel' },
        ciudad: { field: 'fieldCiudad', label: 'fieldCiudadLabel' }
      },
      onChange: onChange || null
    });
    homePickerInstance.mounted = true;
    global.__homeGeoPicker = homePickerInstance;
    global.openHomeGeoPicker = function (tipo) {
      if (homePickerInstance) homePickerInstance.open(tipo);
    };
    return homePickerInstance;
  }

  function initHomePageGeo() {
    if (!document.getElementById('fieldPais')) return;
    if (!homePickerInstance) {
      bootHomeGeoPicker(global.syncHomeGeoFromPicker || null);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePageGeo);
  } else {
    initHomePageGeo();
  }

  global.CariHubGeoPicker = {
    mount: mount,
    loadGeoScripts: loadGeoScripts,
    bootHome: bootHomeGeoPicker
  };
})(typeof window !== 'undefined' ? window : globalThis);
