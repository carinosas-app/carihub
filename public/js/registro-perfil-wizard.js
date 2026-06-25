(function (global) {
  'use strict';

  var STORAGE_KEY = 'solicitudPerfilPaso1';
  var STORAGE_SOLICITUDES = 'solicitudesCatalogoCarihub';

  function sectorCardMeta(sectorId) {
    if (global.CariHubSectorCardImages && global.CariHubSectorCardImages.getSectorCardImage) {
      return global.CariHubSectorCardImages.getSectorCardImage(sectorId);
    }
    return null;
  }

  function sectorImageMeta(sectorId) {
    return sectorCardMeta(sectorId) || { src: 'img/home/promo-perfil.jpg' };
  }

  var NEGOCIO_SUBCATS = [
    'spa', 'masajes', 'sex shop', 'club sw', 'antro restaurant bar',
    'antro restaurant bar lgbt', 'hotel motel', 'cabinas glory holes', 'cine xxx'
  ];

  var state = {
    screen: 'screen0',
    sector: null,
    subcategoria: null,
    contexto: null,
    accessMode: 'create',
    authUser: null,
    perfilCount: 0
  };

  var SECTOR_DISPLAY_ORDER = [
    'adultos', 'bienestar', 'eventos', 'restaurantes', 'salud', 'profesionales',
    'tecnologia', 'bienes-raices', 'educacion', 'mascotas', 'industria',
    'automotriz', 'hogar', 'comercio', 'transporte'
  ];

  var TAP_ADVANCE_MS = 180;
  var ICON_GRID = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="2.2" fill="currentColor"/><circle cx="17" cy="7" r="2.2" fill="currentColor"/><circle cx="7" cy="17" r="2.2" fill="currentColor"/><circle cx="17" cy="17" r="2.2" fill="currentColor"/></svg>';
  var ICON_GO = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function sortSectorsForDisplay(sectors) {
    var orderMap = {};
    SECTOR_DISPLAY_ORDER.forEach(function (id, idx) { orderMap[id] = idx; });
    return sectors.slice().sort(function (a, b) {
      var ia = orderMap[a.id];
      var ib = orderMap[b.id];
      if (ia == null && ib == null) return 0;
      if (ia == null) return 1;
      if (ib == null) return -1;
      return ia - ib;
    });
  }

  var geoPicker = null;
  var subcatIndexCache = null;

  var SEARCH_STOP_WORDS = {
    de: true, la: true, el: true, en: true, y: true, a: true, al: true, del: true,
    los: true, las: true, un: true, una: true, por: true, con: true, para: true,
    que: true, es: true, o: true, su: true, sus: true, mi: true, tu: true
  };

  var SEARCH_SYNONYMS = {
    doctor: ['doctor', 'doctores', 'medico', 'medicos', 'clinica', 'consultorio'],
    medico: ['medico', 'medicos', 'doctor', 'salud'],
    dentista: ['dentista', 'dentistas', 'dental', 'odontolog'],
    psicologo: ['psicologo', 'psicologos', 'psicologia', 'terapia', 'terapeuta'],
    abogado: ['abogado', 'abogados', 'legal', 'notario', 'notaria'],
    spa: ['spa', 'masaje', 'masajes', 'temazcal', 'wellness'],
    restaurante: ['restaurante', 'restaurantes', 'comida', 'bar', 'antro', 'cocina'],
    hotel: ['hotel', 'motel', 'hospedaje', 'hostal'],
    mascota: ['mascota', 'mascotas', 'veterin', 'perro', 'gato'],
    sex: ['adulto', 'escort', 'acompanante', 'strip', 'club'],
    tecnologia: ['software', 'web', 'apps', 'digital', 'informatica'],
    construccion: ['plomero', 'electricista', 'albanil', 'hogar', 'obra'],
    cirujano: ['cirujano', 'cirujanos', 'cirugia', 'plastico', 'plastica', 'estetica', 'estetico'],
    cirugia: ['cirugia', 'cirujano', 'plastica', 'estetica'],
    plastico: ['plastico', 'plastica', 'estetica', 'cirugia', 'cirujano'],
    estetica: ['estetica', 'estetico', 'plastica', 'cirugia', 'belleza']
  };

  function prefersLiteMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 768px)').matches;
  }

  function sectorMobPath(pngPath) {
    var path = String(pngPath || '');
    if (path.indexOf('/sector-cards/') >= 0) return path;
    return path
      .replace('/sectores/', '/sectores/mob/')
      .replace(/\.png$/i, '.jpg');
  }

  function pickImageSrc(pngPath) {
    if (window.matchMedia('(max-width: 768px)').matches) {
      return sectorMobPath(pngPath);
    }
    return pngPath;
  }

  function buildSectorImageHtml(pngPathOrMeta, opts) {
    opts = opts || {};
    var meta = typeof pngPathOrMeta === 'object' && pngPathOrMeta !== null
      ? pngPathOrMeta
      : { src: pngPathOrMeta };
    var pngPath = meta.src;
    var mob = sectorMobPath(pngPath);
    var png = esc(pngPath);
    var mobEsc = esc(mob);
    var extra = opts.id ? ' id="' + esc(opts.id) + '"' : '';
    var priority = opts.priority ? ' fetchpriority="high"' : '';
    return (
      '<img class="rp-sector-card__img"' + extra +
      ' src="' + mobEsc + '" data-fallback="' + png + '" alt="" loading="lazy" decoding="async"' + priority +
      ' onerror="if(this.dataset.fallback){this.src=this.dataset.fallback;this.removeAttribute(\'data-fallback\')}">'
    );
  }

  function initGeoPicker() {
    if (geoPicker || !global.CariHubGeoPicker) return;
    geoPicker = global.CariHubGeoPicker.mount({
      prefix: 'rp',
      container: '#rpGeoPicker',
      hidden: { pais: 'fldPais', estado: 'fldEstado', ciudad: 'fldCiudad' },
      onChange: function () {
        if (global.CariHubRegistroPerfilPreview && CariHubRegistroPerfilPreview.refresh) {
          CariHubRegistroPerfilPreview.refresh();
        }
      }
    });
  }

  function ensureGeoReady(cb) {
    initGeoPicker();
    if (!geoPicker) {
      if (cb) cb();
      return;
    }
    geoPicker.ensureReady(function () {
      if (cb) cb();
    });
  }

  function ensureLazyImgLoaded(img) {
    if (!img) return;
    var lazy = img.getAttribute('data-src');
    if (lazy && !img.getAttribute('src')) {
      img.src = lazy;
      img.removeAttribute('data-src');
    }
  }

  var SUBCAT_BACK_BTN = {
    adultos: 'fucsia',
    salud: 'auto',
    profesionales: 'corporate',
    tecnologia: 'tech',
    'bienes-raices': 'realestate',
    educacion: 'edu',
    mascotas: 'mascotas',
    bienestar: 'wellness',
    automotriz: 'auto',
    hogar: 'hogar',
    comercio: 'comercio',
    eventos: 'eventos',
    transporte: 'transporte',
    restaurantes: 'corporate',
    industria: 'industria'
  };

  function backBtnModeForSector(sectorId) {
    return SUBCAT_BACK_BTN[sectorId] || 'corporate';
  }

  function formBtnModeForSector(sectorId) {
    if (!sectorId || sectorId === 'adultos') return 'fucsia';
    return backBtnModeForSector(sectorId);
  }

  function shouldUsePinkSheen() {
    if (!state.sector || state.sector.id !== 'adultos') return false;
    return state.screen === 'screen0b-adultos' ||
      state.screen === 'screen1' ||
      state.screen === 'screen4';
  }

  function syncPinkSheen() {
    var page = document.body;
    if (!page || !global.CariHubPinkSheen) return;
    if (shouldUsePinkSheen()) {
      if (page.dataset.carihubPageSheen !== '1' && CariHubPinkSheen.mountPage) {
        CariHubPinkSheen.mountPage(page);
      }
    } else if (CariHubPinkSheen.unmountPage) {
      CariHubPinkSheen.unmountPage(page);
    }
  }

  function refreshFormBanners() {
    if (!global.CariHubBannerRegistro) return;
    if (state.screen !== 'screen1' && state.screen !== 'screen4') return;
    var sectorId = state.sector && state.sector.id;
    var subId = state.subcategoria && state.subcategoria.id;
    var subName = state.subcategoria && state.subcategoria.nombre;
    if (CariHubBannerRegistro.refreshFormPageBanners) {
      CariHubBannerRegistro.refreshFormPageBanners(sectorId, subId, subName);
    }
  }

  function applyFormScreenTheme() {
    var page = document.body;
    if (!page) return;
    var isForm = state.screen === 'screen1' || state.screen === 'screen4';
    if (!isForm || !state.sector) {
      if (state.screen !== 'screen0' && !isSubcatPickerScreen()) {
        page.classList.remove('rp-has-sector-glow');
      }
      return;
    }
    applySectorAmbience(state.sector);
    syncContactOnlyfansVisibility();
  }

  function syncSectorSparkles(sectorId, container) {
    var S = global.CariHubSectorSparkles;
    if (!S) return;
    S.syncBody(sectorId || '');
    if (container) S.ensureLayer(container, sectorId || '');
  }

  function applySubcatScreenTheme(sector) {
    if (!sector) return;
    var wrap = $('rpSubcatWrap');
    if (wrap) {
      wrap.classList.toggle('home-modal--adultos-premium', sector.id === 'adultos');
    }
    if (sector.id === 'adultos') {
      applySectorAmbience(sector);
      syncSectorSparkles('adultos', $('rpSubcatWrap'));
    } else {
      var page = document.body;
      if (page) {
        page.classList.remove('rp-has-sector-glow');
        page.style.removeProperty('--rp-sector-glow');
        page.style.removeProperty('--rp-sector-flash');
      }
      syncSectorSparkles(sector.id, $('rpSubcatWrap'));
    }
  }

  var SECTOR_AMBIENCE = {
    adultos: { glow: '#ff4081', flash: 'rgba(255, 64, 129, 0.35)' },
    bienestar: { glow: '#b388ff', flash: 'rgba(179, 136, 255, 0.28)' },
    salud: { glow: '#4dd0e1', flash: 'rgba(77, 208, 225, 0.28)' },
    profesionales: { glow: '#ffd54f', flash: 'rgba(255, 213, 79, 0.22)' },
    automotriz: { glow: '#64b5f6', flash: 'rgba(100, 181, 246, 0.28)' },
    hogar: { glow: '#ff8a65', flash: 'rgba(255, 138, 101, 0.25)' },
    comercio: { glow: '#f48fb1', flash: 'rgba(244, 143, 177, 0.3)' },
    'bienes-raices': { glow: '#ce93d8', flash: 'rgba(206, 147, 216, 0.28)' },
    eventos: { glow: '#ff80ab', flash: 'rgba(255, 128, 171, 0.3)' },
    transporte: { glow: '#81d4fa', flash: 'rgba(129, 212, 250, 0.28)' },
    educacion: { glow: '#80cbc4', flash: 'rgba(128, 203, 196, 0.25)' },
    tecnologia: { glow: '#90caf9', flash: 'rgba(144, 202, 249, 0.28)' },
    restaurantes: { glow: '#ffab91', flash: 'rgba(255, 171, 145, 0.25)' },
    mascotas: { glow: '#a5d6a7', flash: 'rgba(165, 214, 167, 0.22)' },
    industria: { glow: '#bcaaa4', flash: 'rgba(188, 170, 164, 0.22)' }
  };

  function sectorNameHtml(sector) {
    return esc(sector.nombre);
  }

  function $(id) {
    return document.getElementById(id);
  }

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function tipoPerfilLabel(subcatId) {
    if (!subcatId) return 'Perfil';
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolvePublicPresentation) {
      var pres = CariHubFieldEngineLite.resolvePublicPresentation({ subcategoriaId: subcatId });
      if (pres && pres.registro && pres.registro.ui && pres.registro.ui.titulo) {
        return pres.registro.ui.titulo;
      }
    }
    if (subcatId === 'contenido') return 'Creador / contenido';
    if (NEGOCIO_SUBCATS.indexOf(subcatId) >= 0) return 'Negocio / local';
    return 'Perfil personal';
  }

  function isSubcatPickerScreen() {
    return state.screen === 'screen0b-adultos';
  }

  function canReturnToSubcatsFromScreen1() {
    return !!(state.sector && state.subcategoria &&
      state.subcategoria.id !== 'solicitud-pendiente');
  }

  function applyBodyScreenClasses() {
    var isSubcat = isSubcatPickerScreen();
    var isAdultosSubcats = isSubcat && state.sector && state.sector.id === 'adultos';
    document.body.classList.toggle('rp-adultos-subcats', isAdultosSubcats);
    document.body.classList.toggle('rp-sector-subcats', isSubcat && !isAdultosSubcats);
    document.body.classList.toggle('rp-subcat-screen', isSubcat);
    document.body.classList.toggle('rp-screen0-cats', state.screen === 'screen0');
    document.body.classList.toggle('rp-screen1-form', state.screen === 'screen1');
    document.body.classList.toggle('rp-screen4-form', state.screen === 'screen4');
    document.body.classList.toggle('rp-lite-motion', prefersLiteMotion());
    if (state.sector && state.sector.id) {
      document.body.setAttribute('data-rp-sector', state.sector.id);
    } else {
      document.body.removeAttribute('data-rp-sector');
    }
    if (isSubcat && state.sector && global.CariHubSectores) {
      var subCount = (global.CariHubSectores.subcategoriasDeSector(state.sector.id) || []).length;
      document.body.setAttribute('data-rp-sub-count', String(subCount));
    } else {
      document.body.removeAttribute('data-rp-sub-count');
    }
  }

  function showScreen(id) {
    document.querySelectorAll('.rp-screen').forEach(function (el) {
      el.classList.toggle('is-active', el.id === id);
    });
    state.screen = id;
    applyBodyScreenClasses();
    applyFormScreenTheme();
    if (id === 'screen0b-adultos') {
      refreshSubcatPromoRail(state.sector);
      if (state.sector && state.sector.id !== 'adultos') {
        syncSectorSparkles(state.sector.id, $('rpSubcatWrap'));
      }
    } else if (id === 'screen0') {
      syncSectorSparkles('', document.querySelector('#screen0 .rp-cat0-scroll'));
    } else if (id === 'screen1') {
      ensureGeoReady();
      applyFormScreenTheme();
    } else if (id === 'screen4') {
      refreshAccessMode(function () {
        fillScreen4();
        applyFormScreenTheme();
      });
    } else {
    }
    updateProgress();
    syncActionsBar();
    syncCat0Foot();
    syncPinkSheen();
    refreshFormBanners();
    syncFormActionsPlacement();
  }

  function updateProgress() {
    /* Sin indicador de pasos — el usuario no ve numeración ni bolitas de progreso. */
  }

  function applySectorAmbience(sector) {
    var page = document.body;
    if (!page) return;
    if (!sector || !sector.id) {
      page.classList.remove('rp-has-sector-glow');
      page.style.removeProperty('--rp-sector-glow');
      page.style.removeProperty('--rp-sector-flash');
      return;
    }
    var palette = SECTOR_AMBIENCE[sector.id] || SECTOR_AMBIENCE.adultos;
    page.style.setProperty('--rp-sector-glow', palette.glow);
    page.style.setProperty('--rp-sector-flash', palette.flash);
    page.classList.add('rp-has-sector-glow');
  }

  function handlePrimaryClick(ev) {
    if (ev) ev.preventDefault();
    var primary = $('rpBtnPrimary');
    if (primary && (primary.disabled || primary.classList.contains('rp-hidden'))) return;

    if (state.screen === 'screen0') {
      onContinueFromSectors();
    } else if (state.screen === 'screen1') {
      continueToPrivateStep();
    } else if (state.screen === 'screen4') {
      submitSolicitudPerfil();
    }
  }

  function handleSecondaryClick(ev) {
    if (ev) ev.preventDefault();
    var secondary = $('rpBtnSecondary');
    if (secondary && secondary.classList.contains('rp-hidden')) return;

    if (state.screen === 'screen0') {
      global.location.href = 'index.html';
    } else if (state.screen === 'screen0b-adultos' || state.screen === 'screen0b-soon') {
      showScreen('screen0');
    } else if (state.screen === 'screen1') {
      if (canReturnToSubcatsFromScreen1()) {
        openSectorSubcats(state.sector);
      } else {
        showScreen('screen0');
      }
    } else if (state.screen === 'screen4') {
      showScreen('screen1');
    }
  }

  function bindActionButtons() {
    var primary = $('rpBtnPrimary');
    var secondary = $('rpBtnSecondary');
    if (primary && primary.dataset.rpBound !== '1') {
      primary.dataset.rpBound = '1';
      primary.addEventListener('click', handlePrimaryClick);
    }
    if (secondary && secondary.dataset.rpBound !== '1') {
      secondary.dataset.rpBound = '1';
      secondary.addEventListener('click', handleSecondaryClick);
    }
  }

  function syncScreenFromDom() {
    var active = document.querySelector('.rp-screen.is-active');
    if (active && active.id) state.screen = active.id;
  }

  function buildSparkfieldHtml(opts) {
    opts = opts || {};
    var positions = opts.positions || [
      [8, 22], [18, 68], [32, 38], [44, 72], [56, 28],
      [68, 58], [78, 34], [88, 66], [24, 48], [62, 44]
    ];
    var durBase = opts.durBase != null ? opts.durBase : 0.85;
    var durStep = opts.durStep != null ? opts.durStep : 0.25;
    var delayStep = opts.delayStep != null ? opts.delayStep : 0.14;
    var stars = '';
    positions.forEach(function (p, i) {
      stars +=
        '<span class="rp-btn-star" style="--sx:' + p[0] + '%;--sy:' + p[1] +
        '%;--sd:' + (i * delayStep) + 's;--dur:' + (durBase + (i % 3) * durStep) + 's"></span>';
    });
    return '<span class="rp-btn__sparkfield" aria-hidden="true">' + stars + '</span>';
  }

  function buildFucsiaBackButton(label) {
    return buildSparkfieldHtml({
      durBase: 2.4,
      durStep: 0.55,
      delayStep: 0.42
    }) + '<span class="rp-btn__label">' + esc(label) + '</span>';
  }

  function setPrimaryButton(mode, label) {
    var primary = $('rpBtnPrimary');
    if (!primary) return;
    primary.textContent = label;
    primary.disabled = false;
    primary.classList.remove('rp-hidden');
    if (mode === 'fucsia') {
      primary.className = 'rp-btn rp-btn--primary';
    } else if (mode === 'corporate' || mode === 'tech' || mode === 'mascotas' ||
      mode === 'edu' || mode === 'wellness' || mode === 'realestate' ||
      mode === 'auto' || mode === 'hogar' || mode === 'comercio' ||
      mode === 'eventos' || mode === 'transporte' || mode === 'industria') {
      primary.className = 'rp-btn rp-btn--' + mode;
    } else {
      primary.className = 'rp-btn rp-btn--primary';
    }
  }

  function setSecondaryButton(mode, label) {
    var secondary = $('rpBtnSecondary');
    if (!secondary) return;
    secondary.classList.remove('rp-hidden');
    if (mode === 'fucsia') {
      secondary.className = 'rp-btn rp-btn--fucsia-stars';
      secondary.innerHTML = buildFucsiaBackButton(label);
    } else if (mode === 'corporate' || mode === 'tech' || mode === 'mascotas' ||
      mode === 'edu' || mode === 'wellness' || mode === 'realestate' ||
      mode === 'auto' || mode === 'hogar' || mode === 'comercio' ||
      mode === 'eventos' || mode === 'transporte' || mode === 'industria') {
      secondary.className = 'rp-btn rp-btn--' + mode;
      secondary.textContent = label;
    } else {
      secondary.className = 'rp-btn rp-btn--ghost';
      secondary.textContent = label;
    }
  }

  function syncCat0Foot() {
    var foot = $('rpCat0Foot');
    if (foot) foot.classList.toggle('rp-hidden', state.screen !== 'screen0');
  }

  function goHomeFromRegistro() {
    global.location.href = 'index.html';
  }

  function syncActionsBar() {
    var bar = $('rpActionsBar');
    if (!bar) return;
    var primary = $('rpBtnPrimary');
    var progressFoot = $('rpActionsProgress');
    bar.classList.remove('rp-actions--nav-only', 'rp-actions--adultos-subcats', 'rp-actions--screen0', 'rp-actions--single');

    bar.classList.remove('rp-hidden');

    if (state.screen === 'screen0') {
      primary.classList.add('rp-hidden');
      var secondary = $('rpBtnSecondary');
      if (secondary) secondary.classList.add('rp-hidden');
      if (progressFoot) progressFoot.classList.add('rp-hidden');
      bar.classList.add('rp-hidden');
    } else if (state.screen === 'screen0b-adultos') {
      primary.classList.add('rp-hidden');
      var subBack = state.sector && state.sector.id === 'adultos'
        ? 'fucsia'
        : backBtnModeForSector(state.sector ? state.sector.id : '');
      setSecondaryButton(subBack, 'Volver a categorías');
      if (progressFoot) progressFoot.classList.add('rp-hidden');
      bar.classList.add('rp-actions--nav-only', 'rp-actions--adultos-subcats');
    } else if (state.screen === 'screen0b-soon') {
      primary.classList.add('rp-hidden');
      setSecondaryButton('ghost', 'Volver a categorías');
      if (progressFoot) progressFoot.classList.add('rp-hidden');
      bar.classList.add('rp-actions--nav-only');
    } else if (state.screen === 'screen1') {
      var formMode = formBtnModeForSector(state.sector ? state.sector.id : '');
      setPrimaryButton(formMode, 'Continuar');
      setSecondaryButton(formMode, 'Volver a subcategorías');
      if (progressFoot) progressFoot.classList.add('rp-hidden');
    } else if (state.screen === 'screen4') {
      var formMode4 = formBtnModeForSector(state.sector ? state.sector.id : '');
      setPrimaryButton(formMode4, 'Enviar solicitud');
      setSecondaryButton(formMode4, 'Volver a datos públicos');
      if (progressFoot) progressFoot.classList.add('rp-hidden');
    }
  }

  function selectSector(sector, selectedBtn) {
    state.sector = sector;
    state.subcategoria = null;
    document.querySelectorAll('.rp-sector-card').forEach(function (c) { c.classList.remove('is-selected'); });
    if (selectedBtn) selectedBtn.classList.add('is-selected');
    applySectorAmbience(sector);
    syncActionsBar();
    setTimeout(function () {
      onContinueFromSectors();
    }, TAP_ADVANCE_MS);
  }

  function selectSubcategoria(cat) {
    state.subcategoria = cat;
    state.contexto = buildContexto(state.sector, cat);
    var sel = $('rpSubcatSelected');
    if (sel) {
      sel.innerHTML = 'Seleccionado: <strong>' + esc(cat.nombre) + '</strong>' +
        ' <span class="rp-badge-tipo">' + esc(tipoPerfilLabel(cat.id)) + '</span>';
      sel.classList.remove('rp-hidden');
    }
    syncActionsBar();
    setTimeout(function () {
      onContinueFromAdultos();
    }, TAP_ADVANCE_MS);
  }

  function buildSectorWatermarkHtml(sectorId) {
    if (global.CariHubSectorCategoryWatermarks && global.CariHubSectorCategoryWatermarks.buildHtml) {
      return global.CariHubSectorCategoryWatermarks.buildHtml(sectorId);
    }
    return '';
  }

  function buildSectorCardButton(sector) {
    var subs = global.CariHubSectores && global.CariHubSectores.subcategoriasDeSector
      ? global.CariHubSectores.subcategoriasDeSector(sector.id)
      : [];
    var imgMeta = sectorImageMeta(sector.id);
    var metaText = subs.length + ' subcategorías';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ch-geo-card rp-sector-card rp-sector-card--portrait' +
      (state.sector && state.sector.id === sector.id ? ' is-selected' : '');
    var thumbStyle = imgMeta.bg ? ' style="background:' + esc(imgMeta.bg) + '"' : '';
    btn.innerHTML =
      '<span class="ch-geo-card__thumb ch-geo-card__thumb--portrait"' + thumbStyle + '>' +
        buildSectorImageHtml(imgMeta) +
      '</span>' +
      '<span class="ch-geo-card__body">' +
        buildSectorWatermarkHtml(sector.id) +
        '<span class="ch-geo-card__text">' +
          '<p class="ch-geo-card__title">' + sectorNameHtml(sector) + '</p>' +
          '<p class="ch-geo-card__meta">' + ICON_GRID + esc(metaText) + '</p>' +
        '</span>' +
        '<span class="ch-geo-card__go" aria-hidden="true">' + ICON_GO + '</span>' +
      '</span>';
    btn.addEventListener('click', function () {
      selectSector(sector, btn);
    });
    return btn;
  }

  function filterSectorList(text) {
    text = String(text || '').trim().toLowerCase();
    if (!global.CARIHUB_SECTORES) return [];
    if (!text) return global.CARIHUB_SECTORES;
    return global.CARIHUB_SECTORES.filter(function (sector) {
      return String(sector.nombre || '').toLowerCase().indexOf(text) >= 0;
    });
  }

  function renderSectorCards(filterText) {
    var list = $('rpSectorGrid');
    if (!list || !global.CARIHUB_SECTORES) return;
    list.innerHTML = '';
    var sectors = filterText != null ? filterSectorList(filterText) : global.CARIHUB_SECTORES;
    sectors = sortSectorsForDisplay(sectors);

    sectors.forEach(function (sector) {
      var li = document.createElement('li');
      li.appendChild(buildSectorCardButton(sector));
      list.appendChild(li);
    });
  }

  function goVisualSlide(stage, nextIdx, slideClass) {
    if (!stage) return 0;
    slideClass = slideClass || '.rp-anuncio-slide';
    var slides = stage.querySelectorAll(slideClass);
    if (!slides.length) return 0;
    var idx = ((nextIdx % slides.length) + slides.length) % slides.length;
    slides.forEach(function (sl, i) {
      var on = i === idx;
      sl.classList.toggle('is-active', on);
      sl.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    return idx;
  }

  function refreshSubcatPromoRail(sector) {
    if (!global.CariHubHomeCatPromoRail) return;
    var rail = $('rpSubcatPromoRail');
    if (!rail) return;
    sector = sector || state.sector;
    if (sector && sector.id) {
      global.CariHubHomeCatPromoRail.mountRail(rail, {
        sectorId: sector.id,
        sectorName: sector.nombre || ''
      });
    } else {
      global.CariHubHomeCatPromoRail.mountRail(rail, {});
    }
  }

  function renderSectorSubcats(sector) {
    sector = sector || state.sector;
    if (!sector) return;
    var list = $('rpAdultosGrid');
    var hint = $('rpAdultosHint');
    var title = $('rpSubcatSectorTitle');
    var screen = $('screen0b-adultos');
    if (!list || !global.CariHubSectores) return;

    var items = global.CariHubSectores.subcategoriasDeSector(sector.id) || [];
    if (title) title.textContent = sector.nombre;
    if (screen) screen.setAttribute('data-sector', sector.id);
    if (hint) {
      if (sector.id === 'adultos' || items.length > 20) {
        hint.textContent = items.length + ' subcategorías · desliza para ver todas';
      } else {
        hint.textContent = items.length + ' subcategorías · elige una para continuar';
      }
    }
    refreshSubcatPromoRail(sector);

    if (sector.id === 'adultos') {
      list.className = 'home-adultos-picker__grid';
      if (global.CariHubAdultosCatPicker) {
        global.CariHubAdultosCatPicker.renderList(list, items, {
          sectorId: 'adultos',
          selectedId: state.subcategoria ? state.subcategoria.id : '',
          onSelect: function (cat) {
            selectSubcategoria(cat);
          }
        });
      }
      return;
    }

    if (global.CariHubSectorSubcatPicker) {
      global.CariHubSectorSubcatPicker.renderList(list, items, {
        sectorId: sector.id,
        selectedId: state.subcategoria ? state.subcategoria.id : '',
        onSelect: function (cat) {
          selectSubcategoria(cat);
        }
      });
    }
  }

  function renderAdultosSubcats() {
    renderSectorSubcats({ id: 'adultos', nombre: 'Adultos y Entretenimiento para Adultos' });
  }

  function openSectorSubcats(sector) {
    if (!sector) return;
    state.sector = sector;
    applySubcatScreenTheme(sector);
    renderSectorSubcats(sector);
    var sel = $('rpSubcatSelected');
    if (sel) sel.classList.add('rp-hidden');
    showScreen('screen0b-adultos');
  }

  function norm(text) {
    return String(text || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function expandSearchTokens(query) {
    var base = norm(query).split(/\s+/).filter(Boolean);
    if (!base.length) return [];
    return base.filter(function (tok) {
      if (SEARCH_STOP_WORDS[tok]) return false;
      if (tok.length < 3 && !SEARCH_SYNONYMS[tok]) return false;
      return true;
    });
  }

  function synonymVariants(tok) {
    var set = {};
    set[tok] = true;
    Object.keys(SEARCH_SYNONYMS).forEach(function (key) {
      var list = SEARCH_SYNONYMS[key];
      if (list.indexOf(tok) >= 0 || key === tok) {
        list.forEach(function (w) { set[w] = true; });
      }
    });
    return Object.keys(set);
  }

  function tokenMatchesQuery(haystack, tok) {
    var variants = synonymVariants(tok);
    var i;
    var best = 0;
    for (i = 0; i < variants.length; i++) {
      best = Math.max(best, tokenMatchesHaystack(haystack, variants[i]));
      if (best >= 4) break;
    }
    return best;
  }

  function haystackWords(haystack) {
    return haystack.split(/[^a-z0-9]+/).filter(Boolean);
  }

  function tokensRelated(tok, word) {
    if (!tok || !word) return 0;
    if (tok === word) return 4;
    if (tok.length >= 4 && word.indexOf(tok) === 0) return 3;
    if (word.length >= 4 && tok.indexOf(word) === 0) return 3;
    var stemLen = 5;
    if (tok.length >= stemLen && word.length >= stemLen &&
        tok.slice(0, stemLen) === word.slice(0, stemLen)) {
      return 2;
    }
    return 0;
  }

  function tokenMatchesHaystack(haystack, tok) {
    var words = haystackWords(haystack);
    var i;
    var best = 0;
    for (i = 0; i < words.length; i++) {
      best = Math.max(best, tokensRelated(tok, words[i]));
      if (best >= 4) return best;
    }
    if (tok.length >= 5 && haystack.indexOf(tok) >= 0) return 2;
    return best;
  }

  function scoreHaystack(haystack, tokens) {
    if (!tokens.length) return 0;
    var score = 0;
    var matched = 0;
    tokens.forEach(function (tok) {
      var pts = tokenMatchesQuery(haystack, tok);
      if (pts > 0) {
        matched += 1;
        score += pts;
      }
    });
    if (matched < tokens.length) return 0;
    return score;
  }

  function getSubcatIndex() {
    if (subcatIndexCache) return subcatIndexCache;
    subcatIndexCache = [];
    if (!global.CARIHUB_SECTORES || !global.CariHubSectores) return subcatIndexCache;
    global.CARIHUB_SECTORES.forEach(function (sector) {
      var subs = global.CariHubSectores.subcategoriasDeSector(sector.id) || [];
      subs.forEach(function (sub) {
        subcatIndexCache.push({
          sector: sector,
          sub: sub,
          haystack: norm(sector.nombre + ' ' + sub.nombre)
        });
      });
    });
    return subcatIndexCache;
  }

  function searchCatalog(query) {
    var tokens = expandSearchTokens(query);
    var subHits = [];
    var sectorHits = [];
    if (!tokens.length) {
      return { tokens: tokens, subHits: subHits, sectorHits: sectorHits };
    }
    getSubcatIndex().forEach(function (row) {
      var score = scoreHaystack(row.haystack, tokens);
      if (score > 0) subHits.push({ sector: row.sector, sub: row.sub, score: score });
    });
    subHits.sort(function (a, b) { return b.score - a.score; });
    if (global.CARIHUB_SECTORES) {
      global.CARIHUB_SECTORES.forEach(function (sector) {
        var sh = norm(sector.nombre);
        var score = scoreHaystack(sh, tokens);
        if (score > 0) sectorHits.push({ sector: sector, score: score });
      });
      sectorHits.sort(function (a, b) { return b.score - a.score; });
    }
    return {
      tokens: tokens,
      subHits: subHits.slice(0, 8),
      sectorHits: sectorHits.slice(0, 3)
    };
  }

  function queueCatalogSolicitud(entry) {
    try {
      var list = [];
      var raw = global.localStorage.getItem(STORAGE_SOLICITUDES);
      if (raw) list = JSON.parse(raw) || [];
      list.unshift(entry);
      global.localStorage.setItem(STORAGE_SOLICITUDES, JSON.stringify(list.slice(0, 50)));
    } catch (e) { /* ignore quota */ }
  }

  function buildContexto(sector, subcat, extras) {
    extras = extras || {};
    var pending = extras.estadoCatalogo === 'pendiente_aprobacion' ||
      (subcat && subcat.id === 'solicitud-pendiente');
    var ctx = {
      categoriaPrincipal: sector ? sector.nombre : '',
      sectorId: sector ? sector.id : '',
      subcategoria: subcat ? subcat.nombre : '',
      subcategoriaId: subcat ? subcat.id : '',
      subcategoriaSolicitada: extras.subcategoriaSolicitada || '',
      sectorSolicitado: extras.sectorSolicitado || '',
      categoriaSolicitada: extras.sectorSolicitado || extras.categoriaSolicitada || '',
      estadoCatalogo: pending ? 'pendiente_aprobacion' : (extras.estadoCatalogo || 'aprobado'),
      solicitudCatalogoId: extras.solicitudCatalogoId || '',
      tipoPerfilLabel: tipoPerfilLabel(subcat ? subcat.id : '')
    };
    return enrichContextSchema(ctx);
  }

  function enrichContextSchema(ctx) {
    if (!global.CariHubFieldEngineLite || !CariHubFieldEngineLite.resolveRegistrationSchema) {
      var uiIdx = global.CARIHUB_REGISTRO_UI_INDEX;
      ctx.schemaVersion = (uiIdx && uiIdx.version) || '2026-06-15';
      return ctx;
    }
    var resolved = CariHubFieldEngineLite.resolveRegistrationSchema(ctx);
    var ident = resolved.identidad || {};
    var uiIdx = global.CARIHUB_REGISTRO_UI_INDEX;
    return Object.assign({}, ctx, {
      formularioId: ident.formularioId || '',
      arquetipo: ident.arquetipo || '',
      tipoPerfil: ident.tipoPerfil || '',
      formularioUiId: resolved.formularioUiId || ident.formularioUiId || '',
      uiProfileKey: resolved.uiProfileKey || '',
      componenteResultados: ident.componenteResultados || '',
      componentePerfil: ident.componentePerfil || '',
      schemaVersion: (uiIdx && uiIdx.version) || '2026-06-15'
    });
  }

  function setCatSearchActive(active) {
    document.body.classList.toggle('rp-cat-search-active', !!active);
    document.body.classList.toggle('rp-cat-search-typing', false);
    var hint = $('rpCatSearchHint');
    if (hint) {
      hint.textContent = active
        ? 'Elige un resultado o continúa registro si no está en el catálogo'
        : 'Publicar perfil · sugerencias mientras escribes';
    }
  }

  function hideCatSearchSuggest() {
    var box = $('rpCatSearchSuggest');
    if (!box) return;
    box.innerHTML = '';
    box.classList.add('rp-hidden');
    document.body.classList.remove('rp-cat-search-typing');
  }

  function renderCatSearchSuggestions(query) {
    var box = $('rpCatSearchSuggest');
    var panel = $('rpCatSearchPanel');
    if (!box) return;
    if (panel && !panel.classList.contains('rp-hidden')) {
      hideCatSearchSuggest();
      return;
    }
    query = String(query || '').trim();
    if (!query) {
      hideCatSearchSuggest();
      return;
    }

    document.body.classList.add('rp-cat-search-typing');
    box.classList.remove('rp-hidden');
    box.innerHTML = '';

    var label = document.createElement('p');
    label.className = 'rp-cat0-search-suggest__label';
    label.textContent = 'Sugerencias';
    box.appendChild(label);

    var result = searchCatalog(query);
    if (!result.subHits.length) {
      var hint = document.createElement('p');
      hint.className = 'rp-cat0-search-suggest__hint';
      hint.innerHTML = 'Ninguna coincide · pulsa la <strong>lupa</strong> para registrar «' + esc(query) + '»';
      box.appendChild(hint);
      return;
    }

    var list = document.createElement('ul');
    list.className = 'rp-cat0-search-suggest__list';
    result.subHits.slice(0, 12).forEach(function (hit) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rp-cat0-search-suggest__item';
      btn.innerHTML =
        '<span class="rp-cat0-search-suggest__name">' + esc(hit.sub.nombre) + '</span>' +
        '<span class="rp-cat0-search-suggest__sector">' + esc(hit.sector.nombre) + '</span>';
      btn.addEventListener('click', function () {
        pickSubcatAndAdvance(hit.sector, hit.sub);
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
    box.appendChild(list);

    var foot = document.createElement('p');
    foot.className = 'rp-cat0-search-suggest__foot';
    foot.textContent = '¿No es ninguna? Pulsa la lupa →';
    box.appendChild(foot);
  }

  function syncCatSearchBarState() {
    var input = $('rpCatSearch');
    var bar = $('rpCatSearchBar');
    var submitBtn = $('rpCatSearchSubmit');
    var hasText = !!(input && String(input.value || '').trim());
    if (bar) bar.classList.toggle('has-text', hasText);
    if (submitBtn) submitBtn.classList.toggle('rp-hidden', !hasText);
  }

  function runCatSearch() {
    var input = $('rpCatSearch');
    if (!input) return;
    var query = String(input.value || '').trim();
    if (!query) {
      alert('Escribe el nombre de tu negocio o subcategoría.');
      input.focus();
      return;
    }
    hideCatSearchSuggest();
    renderCatSearchPanel(query);
  }

  function clearCatSearch(focusInput) {
    var input = $('rpCatSearch');
    var panel = $('rpCatSearchPanel');
    if (input) input.value = '';
    hideCatSearchSuggest();
    if (panel) {
      panel.innerHTML = '';
      panel.classList.add('rp-hidden');
      panel.classList.remove('rp-cat0-search-panel--solicitud');
    }
    syncCatSearchBarState();
    setCatSearchActive(false);
    if (focusInput && input) input.focus();
  }

  function buildSearchPanelHead(metaText) {
    var head = document.createElement('div');
    head.className = 'rp-cat0-search-panel__head';
    head.innerHTML =
      '<div>' +
        '<p class="rp-cat0-search-panel__title">Resultados</p>' +
        '<p class="rp-cat0-search-panel__meta">' + esc(metaText) + '</p>' +
      '</div>' +
      '<button type="button" class="rp-cat0-search-panel__clear">Limpiar</button>';
    head.querySelector('.rp-cat0-search-panel__clear').addEventListener('click', function () {
      clearCatSearch(true);
    });
    return head;
  }

  function buildSearchHitButton(sector, sub) {
    var imgMeta = sectorImageMeta(sector.id);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rp-cat0-search-hit';
    var hitThumbStyle = imgMeta.bg ? ' style="background:' + esc(imgMeta.bg) + '"' : '';
    btn.innerHTML =
      '<span class="rp-cat0-search-hit__thumb"' + hitThumbStyle + '>' + buildSectorImageHtml(imgMeta) + '</span>' +
      '<span class="rp-cat0-search-hit__body">' +
        buildSectorWatermarkHtml(sector.id) +
        '<span class="rp-cat0-search-hit__text">' +
          '<p class="rp-cat0-search-hit__title">' + esc(sub.nombre) + '</p>' +
          '<p class="rp-cat0-search-hit__sector">' + esc(sector.nombre) + '</p>' +
          '<p class="rp-cat0-search-hit__hint">' + esc(tipoPerfilLabel(sub.id)) + '</p>' +
        '</span>' +
        '<span class="rp-cat0-search-hit__go" aria-hidden="true">' + ICON_GO + '</span>' +
      '</span>';
    btn.addEventListener('click', function () {
      pickSubcatAndAdvance(sector, sub);
    });
    return btn;
  }

  function buildSectorSearchHitButton(sector) {
    var subs = global.CariHubSectores && global.CariHubSectores.subcategoriasDeSector
      ? global.CariHubSectores.subcategoriasDeSector(sector.id)
      : [];
    var imgMeta = sectorImageMeta(sector.id);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rp-cat0-search-hit';
    var sectorHitThumbStyle = imgMeta.bg ? ' style="background:' + esc(imgMeta.bg) + '"' : '';
    btn.innerHTML =
      '<span class="rp-cat0-search-hit__thumb"' + sectorHitThumbStyle + '>' + buildSectorImageHtml(imgMeta) + '</span>' +
      '<span class="rp-cat0-search-hit__body">' +
        buildSectorWatermarkHtml(sector.id) +
        '<span class="rp-cat0-search-hit__text">' +
          '<p class="rp-cat0-search-hit__title">' + sectorNameHtml(sector) + '</p>' +
          '<p class="rp-cat0-search-hit__sector">' + esc(subs.length + ' subcategorías') + '</p>' +
          '<p class="rp-cat0-search-hit__hint">Ver categoría completa</p>' +
        '</span>' +
        '<span class="rp-cat0-search-hit__go" aria-hidden="true">' + ICON_GO + '</span>' +
      '</span>';
    btn.addEventListener('click', function () {
      clearCatSearch(false);
      selectSector(sector, null);
    });
    return btn;
  }

  function renderCatSearchEmpty(query) {
    var wrap = document.createElement('div');
    wrap.className = 'rp-cat0-search-empty';
    wrap.innerHTML =
      '<div class="rp-cat0-search-empty__query">' + esc(query) + '</div>' +
      '<p class="rp-cat0-search-empty__lead">No encontramos esta subcategoría en el catálogo.</p>' +
      '<p class="rp-cat0-search-empty__label">¿En qué área encaja tu negocio?</p>' +
      '<ul class="rp-cat0-sector-pick" id="rpCatSearchSectorList" role="listbox" aria-label="Áreas del catálogo"></ul>' +
      '<div class="rp-cat0-solicitud-extra">' +
        '<p class="rp-cat0-solicitud-extra__title">¿No está en ninguna área?</p>' +
        '<p class="rp-cat0-solicitud-extra__hint">Escribe la categoría nueva que quieres agregar</p>' +
        '<input type="text" class="rp-cat0-solicitud-input" id="rpCatSearchNewSector" placeholder="Ej. Servicios ecuestres" autocomplete="off">' +
        '<label class="rp-cat0-search-empty__label" for="rpCatSearchNewSubcat">Subcategoría / negocio a registrar</label>' +
        '<input type="text" class="rp-cat0-solicitud-input" id="rpCatSearchNewSubcat" value="' + esc(query) + '" autocomplete="off">' +
      '</div>' +
      '<div class="rp-cat0-search-empty__actions">' +
        '<button type="button" class="rp-cat0-search-empty__primary">Continuar registro</button>' +
      '</div>';

    var selectedSectorId = '';
    wrap.dataset.selectedSectorId = '';
    var list = wrap.querySelector('#rpCatSearchSectorList');
    sortSectorsForDisplay(global.CARIHUB_SECTORES || []).forEach(function (sector) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rp-cat0-sector-pick__btn';
      btn.setAttribute('data-sector-id', sector.id);
      btn.textContent = sector.nombre;
      btn.addEventListener('click', function () {
        selectedSectorId = sector.id;
        wrap.dataset.selectedSectorId = sector.id;
        list.querySelectorAll('.rp-cat0-sector-pick__btn').forEach(function (b) {
          b.classList.toggle('is-selected', b === btn);
        });
        var newSector = wrap.querySelector('#rpCatSearchNewSector');
        if (newSector) newSector.value = '';
      });
      li.appendChild(btn);
      list.appendChild(li);
    });

    var newSectorInput = wrap.querySelector('#rpCatSearchNewSector');
    if (newSectorInput) {
      newSectorInput.addEventListener('input', function () {
        if (String(this.value || '').trim()) {
          selectedSectorId = '';
          wrap.dataset.selectedSectorId = '';
          list.querySelectorAll('.rp-cat0-sector-pick__btn').forEach(function (b) {
            b.classList.remove('is-selected');
          });
        }
      });
    }

    wrap.querySelector('.rp-cat0-search-empty__primary').addEventListener('click', function () {
      var subInput = wrap.querySelector('#rpCatSearchNewSubcat');
      var sectorInput = wrap.querySelector('#rpCatSearchNewSector');
      var btn = this;
      btn.disabled = true;
      submitCatalogRequest({
        subcategoriaTexto: subInput ? subInput.value.trim() : query,
        sectorId: wrap.dataset.selectedSectorId || selectedSectorId || '',
        sectorSolicitado: sectorInput ? sectorInput.value.trim() : ''
      });
      btn.disabled = false;
    });
    return wrap;
  }

  function renderCatSearchPanel(query) {
    var panel = $('rpCatSearchPanel');
    if (!panel) return;
    query = String(query || '').trim();
    if (!query) {
      clearCatSearch(false);
      return;
    }
    syncCatSearchBarState();
    setCatSearchActive(true);
    panel.classList.remove('rp-hidden');
    panel.innerHTML = '';

    var result = searchCatalog(query);
    var total = result.subHits.length + result.sectorHits.length;

    if (!total) {
      panel.classList.add('rp-cat0-search-panel--solicitud');
      panel.appendChild(buildSearchPanelHead('Sin coincidencias · solicita alta'));
      panel.appendChild(renderCatSearchEmpty(query));
      return;
    }

    panel.classList.remove('rp-cat0-search-panel--solicitud');

    panel.appendChild(buildSearchPanelHead(
      total + (total === 1 ? ' coincidencia' : ' coincidencias') + ' · publicar perfil'
    ));

    if (result.subHits.length) {
      var list = document.createElement('ul');
      list.className = 'rp-cat0-search-results';
      result.subHits.forEach(function (hit) {
        var li = document.createElement('li');
        li.appendChild(buildSearchHitButton(hit.sector, hit.sub));
        list.appendChild(li);
      });
      panel.appendChild(list);
    }

    if (result.sectorHits.length) {
      var divider = document.createElement('p');
      divider.className = 'rp-cat0-search-divider';
      divider.textContent = 'También coincide con estas categorías';
      panel.appendChild(divider);
      var sectorList = document.createElement('ul');
      sectorList.className = 'rp-cat0-search-results';
      result.sectorHits.forEach(function (hit) {
        var li = document.createElement('li');
        li.appendChild(buildSectorSearchHitButton(hit.sector));
        sectorList.appendChild(li);
      });
      panel.appendChild(sectorList);
    }
  }

  function advanceToScreen1() {
    ensureGeoReady(function () {
      fillScreen1();
      showScreen('screen1');
      if (global.scrollTo) global.scrollTo(0, 0);
    });
  }

  function pickSubcatAndAdvance(sector, subcat, extras) {
    state.sector = sector;
    state.subcategoria = subcat;
    state.contexto = buildContexto(sector, subcat, extras || {});
    applySectorAmbience(sector);
    clearCatSearch(false);
    advanceToScreen1();
  }

  function submitCatalogRequest(opts, legacySectorId) {
    if (typeof opts === 'string') {
      opts = { subcategoriaTexto: opts, sectorId: legacySectorId || '' };
    }
    opts = opts || {};
    var subText = String(opts.subcategoriaTexto || '').trim();
    var sectorId = opts.sectorId || '';
    var sectorSolicitado = String(opts.sectorSolicitado || '').trim();

    if (!subText) {
      alert('Escribe la subcategoría o negocio a registrar.');
      return;
    }

    var sector = null;
    if (sectorId && global.CARIHUB_SECTORES) {
      global.CARIHUB_SECTORES.forEach(function (s) {
        if (s.id === sectorId) sector = s;
      });
    }

    if (!sector && sectorSolicitado) {
      sector = { id: 'solicitud-sector-nuevo', nombre: sectorSolicitado };
    }

    if (!sector) {
      sector = { id: 'solicitud-clasificacion-pendiente', nombre: 'Clasificación pendiente' };
    }

    var categoriaDisplay = sectorSolicitado || (sector.id.indexOf('solicitud-') === 0 ? '' : sector.nombre);

    var solicitud = {
      id: 'sol-' + Date.now(),
      texto: subText,
      sectorId: sector.id,
      sectorNombre: sector.nombre,
      sectorCatalogoId: sectorId || '',
      sectorSolicitado: sectorSolicitado,
      categoriaSolicitada: categoriaDisplay || sector.nombre,
      creadoEn: new Date().toISOString(),
      estado: 'pendiente_aprobacion'
    };
    queueCatalogSolicitud(solicitud);
    pickSubcatAndAdvance(sector, { id: 'solicitud-pendiente', nombre: subText }, {
      subcategoriaSolicitada: subText,
      sectorSolicitado: sectorSolicitado,
      categoriaSolicitada: categoriaDisplay || sector.nombre,
      estadoCatalogo: 'pendiente_aprobacion',
      solicitudCatalogoId: solicitud.id
    });
  }

  function bindCatSearch() {
    var input = $('rpCatSearch');
    var submitBtn = $('rpCatSearchSubmit');
    if (!input || input.dataset.rpBound === '1') return;
    input.dataset.rpBound = '1';

    input.addEventListener('input', function () {
      syncCatSearchBarState();
      renderCatSearchSuggestions(this.value);
    });
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        runCatSearch();
      }
      if (ev.key === 'Escape') clearCatSearch(true);
    });
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        runCatSearch();
      });
    }
    syncCatSearchBarState();
  }

  function onContinueFromSectors() {
    if (!state.sector) return;
    var subs = global.CariHubSectores && global.CariHubSectores.subcategoriasDeSector
      ? global.CariHubSectores.subcategoriasDeSector(state.sector.id)
      : [];
    if (!subs.length) {
      var title = $('rpSoonTitle');
      if (title) title.textContent = state.sector.nombre;
      showScreen('screen0b-soon');
      return;
    }
    openSectorSubcats(state.sector);
  }

  function onContinueFromAdultos() {
    if (!state.subcategoria) return;
    advanceToScreen1();
  }

  function profileChipLabel(ctx) {
    return (state.subcategoria && state.subcategoria.nombre) ||
      ctx.subcategoria || ctx.subcategoriaSolicitada || '—';
  }

  function syncUiFormNotice(ctx) {
    ctx = ctx || state.contexto || buildContexto(state.sector, state.subcategoria);
    var text = '';
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolveRegistrationSchema) {
      var resolved = CariHubFieldEngineLite.resolveRegistrationSchema(ctx);
      text = resolved && resolved.ui && resolved.ui.notaPublica ? resolved.ui.notaPublica : '';
    }
    [$('rpUiFormNotice'), $('rpPrivateUiFormNotice')].forEach(function (el) {
      if (!el) return;
      if (text) {
        el.textContent = text;
        el.classList.remove('rp-hidden');
        el.removeAttribute('aria-hidden');
      } else {
        el.textContent = '';
        el.classList.add('rp-hidden');
        el.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function syncProfileExperienceChip(resolved, ctx) {
    ctx = ctx || state.contexto || buildContexto(state.sector, state.subcategoria);
    if (!resolved && global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolveRegistrationSchema) {
      resolved = CariHubFieldEngineLite.resolveRegistrationSchema(ctx);
    }
    var subName = profileChipLabel(ctx);
    var titulo = resolved && resolved.tituloExperiencia ? resolved.tituloExperiencia : '';
    var chipVal = $('rpProfileChipValue');
    var chipSub = $('rpProfileChipSub');
    var privVal = $('rpPrivateChipValue');
    var privSub = $('rpPrivateChipSub');
    if (chipVal) chipVal.textContent = subName;
    if (privVal) privVal.textContent = subName;
    [chipSub, privSub].forEach(function (el) {
      if (!el) return;
      if (titulo) {
        el.textContent = titulo;
        el.classList.remove('rp-hidden');
        el.removeAttribute('aria-hidden');
      } else {
        el.textContent = '';
        el.classList.add('rp-hidden');
        el.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function syncFormActionsPlacement() {
    var bar = $('rpActionsBar');
    if (!bar) return;
    var host = null;
    if (state.screen === 'screen1') host = $('rpFormActionsHost1');
    else if (state.screen === 'screen4') host = $('rpFormActionsHost4');
    var dock = $('rpActionsDock');
    if (!dock) {
      dock = document.createElement('div');
      dock.id = 'rpActionsDock';
      dock.className = 'rp-actions-dock';
      var modal = $('rpValModal');
      if (modal && modal.parentNode) modal.parentNode.insertBefore(dock, modal);
      else document.body.appendChild(dock);
    }
    if (host) {
      host.appendChild(bar);
      bar.classList.add('rp-actions--in-form');
      bar.classList.remove('rp-hidden');
    } else {
      dock.appendChild(bar);
      bar.classList.remove('rp-actions--in-form');
    }
  }

  function syncContactOnlyfansVisibility() {
    var wrap = $('wrapCtOnlyfansToggle');
    var isAdultos = !!(state.sector && state.sector.id === 'adultos');
    if (wrap) wrap.classList.toggle('rp-hidden', !isAdultos);
    if (!isAdultos) {
      var ofCb = $('ctOnlyfans');
      if (ofCb) ofCb.checked = false;
      var ofWrap = $('wrapCtOnlyfans');
      if (ofWrap) ofWrap.classList.add('rp-hidden');
    }
  }

  function mensajeContactoMarca() {
    return (state.sector && state.sector.id === 'adultos') ? 'Cariñosas' : 'CariHub';
  }

  function mensajeContactoBase() {
    var nombre = $('fldAlias') ? $('fldAlias').value.trim() : '';
    if (!nombre) nombre = 'Nombre público';
    return 'Hola, vi tu publicación en ' + mensajeContactoMarca() + ': ' + nombre + '.';
  }

  function mensajeContactoHintText() {
    var marca = mensajeContactoMarca();
    return 'Prepara el mensaje que recibirá quien toque WhatsApp, Telegram u otro contacto. Te sugerimos «Hola, vi tu publicación en ' + marca + ': tu nombre» — puedes borrarlo y escribirlo como quieras, por ejemplo para distinguir varias publicaciones.';
  }

  function mensajeContactoPlaceholder() {
    return 'Hola, vi tu publicación en ' + mensajeContactoMarca() + ': Nombre público.';
  }

  function actualizarMensajeContacto() {
    var textarea = $('fldMensajeContacto');
    var preview = $('rpPreviewMensajeContacto');
    var hint = $('rpMensajeContactoHint');
    if (!textarea) return;
    if (textarea.dataset.auto === '1') {
      textarea.value = mensajeContactoBase();
    }
    if (hint) hint.textContent = mensajeContactoHintText();
    textarea.placeholder = mensajeContactoPlaceholder();
    if (preview) {
      preview.textContent = textarea.value.trim() || mensajeContactoBase();
    }
  }

  function prepararMensajeContactoPorSector() {
    var textarea = $('fldMensajeContacto');
    if (!textarea) return;
    if (!textarea.value.trim()) textarea.dataset.auto = '1';
    actualizarMensajeContacto();
  }

  function bindMensajeContacto() {
    var textarea = $('fldMensajeContacto');
    var alias = $('fldAlias');
    if (textarea && textarea.dataset.rpBound !== '1') {
      textarea.dataset.rpBound = '1';
      textarea.addEventListener('input', function () {
        textarea.dataset.auto = '0';
        actualizarMensajeContacto();
      });
    }
    if (alias && alias.dataset.rpMensajeBound !== '1') {
      alias.dataset.rpMensajeBound = '1';
      alias.addEventListener('input', actualizarMensajeContacto);
    }
    actualizarMensajeContacto();
  }

  function tieneContactoExternoActivo(contact) {
    contact = contact || collectContactConfig();
    return !!(contact.whatsappActivo || contact.telegramActivo || contact.instagramActivo ||
      contact.twitterActivo || contact.facebookActivo || contact.gmailActivo ||
      contact.telefonoActivo || contact.onlyFansActivo);
  }

  function syncContactFieldsVisibility() {
    var map = {
      whatsapp: 'wrapCtWhatsapp',
      telegram: 'wrapCtTelegram',
      instagram: 'wrapCtInstagram',
      twitter: 'wrapCtTwitter',
      facebook: 'wrapCtFacebook',
      gmail: 'wrapCtGmail',
      telefono: 'wrapCtTelefono',
      onlyfans: 'wrapCtOnlyfans',
      ubicacion: 'wrapCtUbicacion'
    };
    var anyLinkField = false;
    Object.keys(map).forEach(function (key) {
      var cb = document.querySelector('[data-contact="' + key + '"]');
      var wrap = $(map[key]);
      if (!wrap || !cb) return;
      var show = !!cb.checked;
      wrap.classList.toggle('rp-hidden', !show);
      if (show) anyLinkField = true;
    });
    var linksCard = $('rpContactLinksCard');
    if (linksCard) linksCard.classList.toggle('rp-hidden', !anyLinkField);
    var msgCard = $('rpMensajeContactoCard');
    if (msgCard) {
      var extMsgKeys = ['whatsapp', 'telegram', 'instagram', 'twitter', 'facebook', 'gmail', 'telefono', 'onlyfans'];
      var ext = extMsgKeys.some(function (key) {
        var cb = document.querySelector('[data-contact="' + key + '"]');
        return cb && cb.checked;
      });
      msgCard.classList.toggle('rp-hidden', !ext);
    }
    actualizarMensajeContacto();
  }

  function bindContactToggles() {
    var toggles = document.querySelectorAll('#rpContactToggles [data-contact]');
    toggles.forEach(function (cb) {
      if (cb.dataset.rpBound === '1') return;
      cb.dataset.rpBound = '1';
      cb.addEventListener('change', syncContactFieldsVisibility);
    });
    syncContactFieldsVisibility();
  }

  function collectContactConfig() {
    function on(id) {
      var el = $(id);
      return el ? el.checked : false;
    }
    return {
      whatsappActivo: on('ctWhatsapp'),
      telegramActivo: on('ctTelegram'),
      instagramActivo: on('ctInstagram'),
      twitterActivo: on('ctTwitter'),
      facebookActivo: on('ctFacebook'),
      correoActivo: on('ctGmail'),
      gmailActivo: on('ctGmail'),
      telefonoActivo: on('ctTelefono'),
      onlyFansActivo: on('ctOnlyfans'),
      googleMapsActivo: on('ctUbicacion'),
      mensajesInternosActivo: on('ctMensajesInternos'),
      mensajeInternoActivo: on('ctMensajesInternos'),
      whatsapp: $('fldWhatsapp') ? $('fldWhatsapp').value.trim() : '',
      telegram: $('fldTelegram') ? $('fldTelegram').value.trim() : '',
      instagram: $('fldInstagram') ? $('fldInstagram').value.trim() : '',
      twitter: $('fldTwitter') ? $('fldTwitter').value.trim() : '',
      facebook: $('fldFacebook') ? $('fldFacebook').value.trim() : '',
      correo: $('fldGmail') ? $('fldGmail').value.trim() : '',
      telefono: $('fldTelefonoPublico') ? $('fldTelefonoPublico').value.trim() : '',
      onlyFans: $('fldOnlyfans') ? $('fldOnlyfans').value.trim() : '',
      googleMaps: $('fldGoogleMaps') ? $('fldGoogleMaps').value.trim() : '',
      mensajeContactoPublicidad: $('fldMensajeContacto') ? $('fldMensajeContacto').value.trim() : ''
    };
  }

  function geoMapsQueryFromForm() {
    var ciudad = $('fldCiudad') ? $('fldCiudad').value.trim() : '';
    var estado = $('fldEstado') ? $('fldEstado').value.trim() : '';
    var pais = $('fldPais') ? $('fldPais').value.trim() : '';
    return [ciudad, estado, pais].filter(Boolean).join(', ');
  }

  function validateContactSelection(contact) {
    var missing = [];
    if (contact.whatsappActivo && !contact.whatsapp) missing.push('WhatsApp');
    if (contact.telegramActivo && !contact.telegram) missing.push('Telegram');
    if (contact.instagramActivo && !contact.instagram) missing.push('Instagram');
    if (contact.twitterActivo && !contact.twitter) missing.push('X / Twitter');
    if (contact.facebookActivo && !contact.facebook) missing.push('Facebook');
    if (contact.gmailActivo && !contact.correo) missing.push('Gmail');
    if (contact.telefonoActivo && !contact.telefono) missing.push('Teléfono para llamadas');
    if (contact.onlyFansActivo && !contact.onlyFans) missing.push('OnlyFans');
    var anyMethod = contact.whatsappActivo || contact.telegramActivo || contact.instagramActivo ||
      contact.twitterActivo || contact.facebookActivo || contact.gmailActivo ||
      contact.telefonoActivo || contact.onlyFansActivo || contact.mensajesInternosActivo ||
      contact.googleMapsActivo;
    if (!anyMethod) missing.push('al menos un método de contacto');
    if (tieneContactoExternoActivo(contact)) {
      var msg = contact.mensajeContactoPublicidad || '';
      if (!msg) missing.push('Mensaje al contactarte');
    }
    return missing;
  }

  function countPublicPhotos() {
    var n = 0;
    var mainBox = $('uploadPrincipalBox');
    if (mainBox && mainBox.dataset.preview) n++;
    document.querySelectorAll('#rpGalleryGrid .rp-gallery__slot').forEach(function (slot) {
      if (slot.classList.contains('rp-hidden')) return;
      if (slot.dataset.preview) n++;
    });
    return n;
  }

  function syncGalleryForSubcategoria(ctx) {
    ctx = ctx || state.contexto || buildContexto(state.sector, state.subcategoria);
    var fotosMin = global.CariHubRegistroPublicBlocks && CariHubRegistroPublicBlocks.getFotosMin
      ? CariHubRegistroPublicBlocks.getFotosMin(ctx) : null;
    var extraSlots = fotosMin === 5 ? 4 : 3;
    var hint = $('rpGalleryHint');
    var label = $('rpGalleryLabel');
    var grid = $('rpGalleryGrid');
    if (hint) {
      hint.textContent = fotosMin === 5
        ? 'Escort VIP: foto principal y mínimo 4 fotos más (5 en total).'
        : 'Foto principal y hasta 3 fotos extra para galería.';
    }
    if (label) {
      label.textContent = fotosMin === 5
        ? 'Galería (mínimo 4 fotos extra)'
        : 'Galería (3 fotos extra)';
    }
    if (!grid) return;
    var existing = grid.querySelectorAll('.rp-gallery__slot').length;
    var i;
    for (i = existing; i < extraSlots; i++) {
      var slot = document.createElement('div');
      slot.className = 'rp-gallery__slot';
      slot.setAttribute('data-index', String(i));
      slot.textContent = '+ Foto';
      grid.appendChild(slot);
    }
    grid.querySelectorAll('.rp-gallery__slot').forEach(function (slot, idx) {
      if (idx >= extraSlots) {
        slot.classList.add('rp-hidden');
        slot.removeAttribute('data-preview');
        var img = slot.querySelector('img');
        if (img) img.remove();
        slot.classList.remove('has-image');
      } else {
        slot.classList.remove('rp-hidden');
      }
    });
    if (document.body) {
      document.body.classList.toggle('rp-fotos-vip', fotosMin === 5);
    }
  }

  function fillScreen1() {
    var ctx = state.contexto || buildContexto(state.sector, state.subcategoria);
    var catLabel = ctx.sectorSolicitado || ctx.categoriaPrincipal || ctx.categoriaSolicitada ||
      (state.sector && state.sector.nombre) || '';
    if (ctx.sectorId && ctx.sectorId.indexOf('solicitud-clasificacion') === 0 && !ctx.sectorSolicitado) {
      catLabel = ctx.categoriaPrincipal || 'Clasificación pendiente';
    }
    if ($('fldCategoria')) $('fldCategoria').value = catLabel;
    if ($('fldSubcategoria')) {
      $('fldSubcategoria').value = ctx.subcategoria || ctx.subcategoriaSolicitada ||
        (state.subcategoria && state.subcategoria.nombre) || '';
    }
    var resolved = null;
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.applyRegistrationSchemaToScreen) {
      resolved = CariHubFieldEngineLite.applyRegistrationSchemaToScreen(ctx);
    } else {
      var edadWrap = $('wrapEdad');
      var modWrap = $('wrapModalidad');
      var isNegocio = NEGOCIO_SUBCATS.indexOf(ctx.subcategoriaId) >= 0;
      if (edadWrap) edadWrap.classList.toggle('rp-hidden', isNegocio);
      if (modWrap) modWrap.classList.toggle('rp-hidden', isNegocio);
    }
    syncProfileExperienceChip(resolved, ctx);
    syncUiFormNotice(ctx);
    syncGalleryForSubcategoria(ctx);
    var bloquesSaved = null;
    try {
      var draftRaw = global.localStorage.getItem(STORAGE_KEY);
      if (draftRaw) {
        var draftData = JSON.parse(draftRaw);
        if (draftData && draftData.camposPublicos && draftData.camposPublicos.bloquesPublicos) {
          bloquesSaved = draftData.camposPublicos.bloquesPublicos;
        }
      }
    } catch (eDraft) { /* ignore */ }
    if (global.CariHubRegistroPublicBlocks && CariHubRegistroPublicBlocks.apply) {
      CariHubRegistroPublicBlocks.apply(ctx, resolved, bloquesSaved);
      CariHubRegistroPublicBlocks.bindChange(function () {
        if (global.CariHubRegistroPerfilPreview && CariHubRegistroPerfilPreview.refresh) {
          CariHubRegistroPerfilPreview.refresh();
        }
      });
    }
    var pendingNotice = $('rpCatalogPendingNotice');
    if (pendingNotice) {
      pendingNotice.classList.toggle('rp-hidden', ctx.estadoCatalogo !== 'pendiente_aprobacion');
    }
    syncContactOnlyfansVisibility();
    syncContactFieldsVisibility();
    prepararMensajeContactoPorSector();
    bindMensajeContacto();
    restoreDraftFields();
    applyFormScreenTheme();
    if (global.CariHubRegistroPerfilPreview && CariHubRegistroPerfilPreview.bind) {
      CariHubRegistroPerfilPreview.bind({
        getContext: function () {
          return state.contexto || buildContexto(state.sector, state.subcategoria);
        },
        getSector: function () { return state.sector; },
        getSubcategoria: function () { return state.subcategoria; }
      });
    }
  }

  function renderPrivateFieldsList(ctx) {
    /* Delegado a CariHubPrivateFieldsLite.renderPrivateForm */
  }

  function refreshAccessMode(cb) {
    var authSvc = global.CariHubAuth;
    if (!authSvc) {
      state.accessMode = 'create';
      state.authUser = null;
      state.perfilCount = 0;
      if (cb) cb();
      return;
    }

    function applyUser(user) {
      if (!user || !user.email) {
        state.accessMode = 'create';
        state.authUser = null;
        state.perfilCount = 0;
        if (cb) cb();
        return;
      }
      state.authUser = user;
      var db = global.CariHubCore && global.CariHubCore.db;
      if (!db) {
        state.accessMode = 'confirm';
        state.perfilCount = 1;
        if (cb) cb();
        return;
      }
      db.collection('usuarios').doc(user.uid).get().then(function (snap) {
        var count = 0;
        if (snap.exists) {
          var d = snap.data() || {};
          var det = d.perfilesDetalle;
          if (det && typeof det === 'object') count = Object.keys(det).length;
          else if (d.perfilId || d.nombrePublico || d.aliasPublico) count = 1;
        }
        state.perfilCount = count;
        state.accessMode = 'confirm';
        if (cb) cb();
      }).catch(function () {
        state.accessMode = 'confirm';
        state.perfilCount = 1;
        if (cb) cb();
      });
    }

    var current = authSvc.currentUser;
    if (current) {
      applyUser(current);
      return;
    }
    authSvc.onAuthStateChanged(function (user) {
      applyUser(user);
    });
  }

  function getAccessOptions() {
    return {
      accessMode: state.accessMode,
      authEmail: state.authUser && state.authUser.email ? state.authUser.email : ''
    };
  }

  function syncScreen4Notice() {
    var notice = $('rpPrivateUiFormNotice');
    if (!notice) return;
    if (state.accessMode === 'confirm') {
      notice.textContent = state.perfilCount > 0
        ? 'Perfil adicional: confirma tu contraseña al final. Los datos fiscales pueden ser distintos si lo necesitas.'
        : 'Confirma tu contraseña al final para verificar tu acceso.';
      notice.classList.remove('rp-hidden');
      notice.removeAttribute('aria-hidden');
    } else {
      notice.classList.add('rp-hidden');
      notice.setAttribute('aria-hidden', 'true');
    }
  }

  function fillScreen4() {
    var ctx = state.contexto || buildContexto(state.sector, state.subcategoria);
    syncProfileExperienceChip(null, ctx);
    syncUiFormNotice(ctx);
    syncScreen4Notice();
    var saved = null;
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.camposPrivados &&
            (!data.contexto || data.contexto.subcategoriaId === (state.subcategoria && state.subcategoria.id))) {
          saved = data.camposPrivados;
        }
      }
    } catch (e) { /* ignore */ }
    if (global.CariHubPrivateFieldsLite && CariHubPrivateFieldsLite.renderPrivateForm) {
      CariHubPrivateFieldsLite.renderPrivateForm($('rpPrivateDynamicHost'), ctx, saved, getAccessOptions());
    }
    applyFormScreenTheme();
  }

  function compressImage(file, maxW, quality, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var w = img.width;
        var h = img.height;
        if (w > maxW) {
          h = Math.round(h * (maxW / w));
          w = maxW;
        }
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        cb(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function bindUploads() {
    var mainInput = $('uploadPrincipal');
    var mainBox = $('uploadPrincipalBox');
    var galInput = $('uploadGaleria');
    var galGrid = $('rpGalleryGrid');

    if (mainInput && mainBox) {
      mainBox.addEventListener('click', function () { mainInput.click(); });
      mainInput.addEventListener('change', function () {
        var f = mainInput.files && mainInput.files[0];
        if (!f) return;
        compressImage(f, 900, 0.72, function (dataUrl) {
          mainBox.classList.add('has-image');
          var existing = mainBox.querySelector('img');
          if (existing) existing.remove();
          var img = document.createElement('img');
          img.src = dataUrl;
          img.alt = 'Vista previa foto principal';
          mainBox.insertBefore(img, mainBox.firstChild);
          mainBox.dataset.preview = dataUrl;
          if (global.CariHubRegistroPerfilPreview && CariHubRegistroPerfilPreview.refresh) {
            CariHubRegistroPerfilPreview.refresh();
          }
        });
      });
    }

    if (galInput && galGrid) {
      if (galGrid.dataset.rpGalBound !== '1') {
        galGrid.dataset.rpGalBound = '1';
        galGrid.addEventListener('click', function (e) {
          var slot = e.target.closest('.rp-gallery__slot');
          if (!slot || slot.classList.contains('rp-hidden')) return;
          galInput.dataset.slotIndex = slot.getAttribute('data-index');
          galInput.click();
        });
      }
      galInput.addEventListener('change', function () {
        var f = galInput.files && galInput.files[0];
        var idx = galInput.dataset.slotIndex;
        if (!f || idx == null) return;
        compressImage(f, 700, 0.7, function (dataUrl) {
          var slot = galGrid.querySelector('[data-index="' + idx + '"]');
          if (!slot) return;
          slot.dataset.preview = dataUrl;
          var existing = slot.querySelector('img');
          if (existing) existing.remove();
          var img = document.createElement('img');
          img.src = dataUrl;
          img.alt = 'Galería ' + (parseInt(idx, 10) + 1);
          slot.insertBefore(img, slot.firstChild);
          slot.classList.add('has-image');
          if (global.CariHubRegistroPerfilPreview && CariHubRegistroPerfilPreview.refresh) {
            CariHubRegistroPerfilPreview.refresh();
          }
        });
        galInput.value = '';
      });
    }
  }

  function collectFormData() {
    var mainBox = $('uploadPrincipalBox');
    var galeria = [];
    document.querySelectorAll('#rpGalleryGrid .rp-gallery__slot').forEach(function (slot) {
      if (slot.dataset.preview) galeria.push(slot.dataset.preview);
    });
    var ctx = state.contexto || buildContexto(state.sector, state.subcategoria);
    var schemaResuelto = null;
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolveRegistrationSchema) {
      schemaResuelto = CariHubFieldEngineLite.resolveRegistrationSchema(ctx);
    }
    var bloquesPublicos = null;
    if (global.CariHubRegistroPublicBlocks && CariHubRegistroPublicBlocks.collect) {
      bloquesPublicos = CariHubRegistroPublicBlocks.collect(ctx, schemaResuelto);
    }

    return {
      contexto: ctx,
      schemaResuelto: schemaResuelto,
      camposPublicos: {
        categoria: $('fldCategoria').value.trim(),
        subcategoria: $('fldSubcategoria').value.trim(),
        alias: $('fldAlias').value.trim(),
        edad: $('fldEdad') ? $('fldEdad').value.trim() : '',
        pais: $('fldPais').value.trim(),
        estado: $('fldEstado').value.trim(),
        ciudad: $('fldCiudad').value.trim(),
        zona: $('fldZona').value.trim(),
        descripcionCorta: $('fldDescripcion').value.trim(),
        precioDesde: $('fldPrecio').value.trim(),
        modalidad: $('fldModalidad') ? $('fldModalidad').value.trim() : '',
        horarioPublico: $('fldHorario').value.trim(),
        serviciosPrincipales: $('fldServicios').value.trim(),
        bloquesPublicos: bloquesPublicos,
        whatsappPublico: $('fldWhatsapp').value.trim(),
        telegramPublico: $('fldTelegram').value.trim(),
        instagramPublico: $('fldInstagram') ? $('fldInstagram').value.trim() : '',
        twitterPublico: $('fldTwitter') ? $('fldTwitter').value.trim() : '',
        facebookPublico: $('fldFacebook') ? $('fldFacebook').value.trim() : '',
        correoPublico: $('fldGmail') ? $('fldGmail').value.trim() : '',
        telefonoPublico: $('fldTelefonoPublico') ? $('fldTelefonoPublico').value.trim() : '',
        onlyfansPublico: $('fldOnlyfans') ? $('fldOnlyfans').value.trim() : '',
        googleMapsPublico: $('fldGoogleMaps') ? $('fldGoogleMaps').value.trim() : '',
        ubicacionPublica: (function () {
          var ct = $('ctUbicacion');
          if (!ct || !ct.checked) return '';
          return geoMapsQueryFromForm();
        })()
      },
      contactoPublico: collectContactConfig(),
      imagenesPublicas: {
        principal: mainBox && mainBox.dataset.preview ? mainBox.dataset.preview : '',
        galeria: galeria
      },
      guardadoEn: new Date().toISOString(),
      fase: 1,
      mensajeContactoPublicidad: $('fldMensajeContacto') ? $('fldMensajeContacto').value.trim() : ''
    };
  }

  function persistDraft(data) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function showValidationModal(items, title) {
    var modal = $('rpValModal');
    var list = $('rpValModalList');
    var titleEl = $('rpValModalTitle');
    var hint = $('rpValModalHint');
    var okBtn = $('rpValModalOk');
    if (!modal || !list) return;
    var safeItems = (items || []).filter(Boolean);
    if (!safeItems.length) return;
    list.innerHTML = safeItems.map(function (item) {
      return '<li>' + esc(item) + '</li>';
    }).join('');
    if (titleEl) titleEl.textContent = title || 'Faltan datos para continuar';
    if (hint) {
      var subName = state.subcategoria && state.subcategoria.nombre;
      hint.textContent = subName
        ? 'En «' + subName + '» completa lo siguiente antes de continuar:'
        : 'Completa lo siguiente antes de continuar:';
    }
    var mode = formBtnModeForSector(state.sector ? state.sector.id : '');
    if (okBtn) {
      okBtn.className = mode === 'fucsia'
        ? 'rp-btn rp-btn--primary'
        : 'rp-btn rp-btn--' + mode;
    }
    modal.classList.remove('rp-hidden');
  }

  function hideValidationModal() {
    var modal = $('rpValModal');
    if (modal) modal.classList.add('rp-hidden');
  }

  function bindValidationModal() {
    var ok = $('rpValModalOk');
    var backdrop = $('rpValModalBackdrop');
    if (ok && ok.dataset.rpBound !== '1') {
      ok.dataset.rpBound = '1';
      ok.addEventListener('click', hideValidationModal);
    }
    if (backdrop && backdrop.dataset.rpBound !== '1') {
      backdrop.dataset.rpBound = '1';
      backdrop.addEventListener('click', hideValidationModal);
    }
  }

  function continueToPrivateStep() {
    var ctx = state.contexto || buildContexto(state.sector, state.subcategoria);
    var missing = [];
    var camposValidacion = {
      fldAlias: $('fldAlias').value.trim(),
      fldEdad: $('fldEdad') ? $('fldEdad').value.trim() : '',
      fldDescripcion: $('fldDescripcion').value.trim(),
      fldPrecio: $('fldPrecio').value.trim(),
      fldModalidad: $('fldModalidad') ? $('fldModalidad').value.trim() : '',
      fldHorario: $('fldHorario').value.trim(),
      fldServicios: $('fldServicios').value.trim(),
      pais: $('fldPais').value.trim(),
      estado: $('fldEstado').value.trim(),
      ciudad: $('fldCiudad').value.trim()
    };
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.validatePublicDraft) {
      var check = CariHubFieldEngineLite.validatePublicDraft(ctx, camposValidacion);
      if (!check.ok) missing = missing.concat(check.missing);
    } else if (!camposValidacion.fldAlias) {
      missing.push('Alias / nombre público');
    }
    if (global.CariHubRegistroPublicBlocks && CariHubRegistroPublicBlocks.collect) {
      var schemaForBlocks = global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolveRegistrationSchema
        ? CariHubFieldEngineLite.resolveRegistrationSchema(ctx) : null;
      var bloquesVals = CariHubRegistroPublicBlocks.collect(ctx, schemaForBlocks);
      if (bloquesVals && CariHubRegistroPublicBlocks.validateValues) {
        var cfgBlocks = CariHubRegistroPublicBlocks.resolveConfig(ctx, schemaForBlocks);
        if (cfgBlocks) {
          var blockMissing = CariHubRegistroPublicBlocks.validateValues(cfgBlocks, bloquesVals, ctx);
          missing = missing.concat(blockMissing);
        }
      }
    }
    var mainBox = $('uploadPrincipalBox');
    if (!mainBox || !mainBox.dataset.preview) {
      missing.push('Foto principal');
    }
    var fotosMin = global.CariHubRegistroPublicBlocks && CariHubRegistroPublicBlocks.getFotosMin
      ? CariHubRegistroPublicBlocks.getFotosMin(ctx) : null;
    if (fotosMin && countPublicPhotos() < fotosMin) {
      missing.push('Mínimo ' + fotosMin + ' fotos (principal + galería)');
    }
    var contactMissing = validateContactSelection(collectContactConfig());
    if (contactMissing.length) {
      missing = missing.concat(contactMissing.map(function (m) {
        return m.indexOf('contacto') >= 0 ? m : 'Contacto: ' + m;
      }));
    }
    if (missing.length) {
      showValidationModal(missing);
      return;
    }
    var data = collectFormData();
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolveRegistrationSchema) {
      data.schemaResuelto = CariHubFieldEngineLite.resolveRegistrationSchema(ctx);
    }
    if (!persistDraft(data)) {
      showValidationModal(['No se pudo guardar. Reduce el tamaño de las imágenes e intenta de nuevo.'], 'Error al guardar');
      return;
    }
    showScreen('screen4');
  }

  function saveDraft() {
    continueToPrivateStep();
  }

  function submitSolicitudPerfil() {
    var ctx = state.contexto || buildContexto(state.sector, state.subcategoria);
    var privCheck = global.CariHubPrivateFieldsLite && CariHubPrivateFieldsLite.validatePrivateForm
      ? CariHubPrivateFieldsLite.validatePrivateForm(ctx)
      : { ok: true, missing: [], data: {} };
    if (!privCheck.ok) {
      showValidationModal(privCheck.missing, 'Faltan datos privados');
      return;
    }
    if (!privCheck.data || !privCheck.data.terminosAceptados) {
      showValidationModal(['Debes abrir y aceptar los términos y condiciones completos.'], 'Confirmaciones legales');
      return;
    }
    if (!global.CariHubRegistroPerfilSubmit || !CariHubRegistroPerfilSubmit.submitRegistroPerfil) {
      alert('El envío a revisión requiere conexión con Firebase. Recarga la página e intenta de nuevo.');
      return;
    }
    var draft;
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      draft = raw ? JSON.parse(raw) : collectFormData();
    } catch (e) {
      draft = collectFormData();
    }
    if (!draft.camposPublicos) {
      showValidationModal(['Completa primero los datos públicos.'], 'Datos incompletos');
      return;
    }
    draft.contactoPublico = collectContactConfig();
    draft.mensajeContactoPublicidad = $('fldMensajeContacto') ? $('fldMensajeContacto').value.trim() : '';
    draft.imagenesPublicas = {
      principal: ($('uploadPrincipalBox') && $('uploadPrincipalBox').dataset.preview) || '',
      galeria: []
    };
    var galGrid = $('rpGalleryGrid');
    if (galGrid) {
      galGrid.querySelectorAll('.rp-gallery__slot').forEach(function (slot) {
        if (slot.dataset.preview) draft.imagenesPublicas.galeria.push(slot.dataset.preview);
      });
    }
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolveRegistrationSchema) {
      draft.schemaResuelto = CariHubFieldEngineLite.resolveRegistrationSchema(ctx);
    }
    var priv = privCheck.data;
    var primary = $('rpBtnPrimary');
    if (primary) {
      primary.disabled = true;
      primary.textContent = 'Enviando solicitud…';
    }
    CariHubRegistroPerfilSubmit.submitRegistroPerfil(draft, priv, function () {})
      .then(function (result) {
        try { global.localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
        try {
          global.sessionStorage.setItem('carihub_dashboard_aviso', JSON.stringify({
            tipo: 'solicitud_enviada',
            perfilId: result && result.perfilId ? result.perfilId : null,
            esPerfilAdicional: result && result.esPerfilAdicional === true
          }));
        } catch (e) { /* ignore */ }
        var dashUrl = 'dashboard-rentero.html';
        if (result && result.perfilId) {
          dashUrl += '?perfilId=' + encodeURIComponent(result.perfilId);
        }
        global.location.href = dashUrl;
      })
      .catch(function (err) {
        var msg = err && err.message ? err.message : String(err);
        var code = err && err.code ? err.code : '';
        if (/email-already-in-use/i.test(msg)) {
          msg = 'Ese correo de acceso ya está registrado. Usa otro correo o inicia sesión con tu cuenta.';
        } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') {
          msg = 'Contraseña incorrecta. Confirma la misma con la que entras al dashboard.';
        }
        alert('No se pudo enviar la solicitud: ' + msg);
      })
      .finally(function () {
        if (primary) {
          primary.disabled = false;
          primary.textContent = 'Enviar solicitud';
        }
      });
  }

  function savePrivateDraft() {
    submitSolicitudPerfil();
  }

  function restorePrivateDraftFields() {
    /* Restauración integrada en fillScreen4 vía renderPrivateForm */
  }

  function restoreDraftFields() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (!data || !data.camposPublicos) return;
      if (data.contexto && data.contexto.subcategoriaId !== (state.subcategoria && state.subcategoria.id)) return;

      var c = data.camposPublicos;
      $('fldAlias').value = c.alias || '';
      if ($('fldEdad')) $('fldEdad').value = c.edad || '';
      if (geoPicker && (c.pais || c.estado || c.ciudad)) {
        geoPicker.setValues({ pais: c.pais || '', estado: c.estado || '', ciudad: c.ciudad || '' });
      }
      $('fldZona').value = c.zona || '';
      $('fldDescripcion').value = c.descripcionCorta || '';
      $('fldPrecio').value = c.precioDesde || '';
      if ($('fldModalidad')) $('fldModalidad').value = c.modalidad || '';
      $('fldHorario').value = c.horarioPublico || '';
      $('fldServicios').value = c.serviciosPrincipales || '';
      if (global.CariHubRegistroPublicBlocks && CariHubRegistroPublicBlocks.apply && c.bloquesPublicos) {
        var ctxRestore = state.contexto || buildContexto(state.sector, state.subcategoria);
        var resolvedRestore = global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolveRegistrationSchema
          ? CariHubFieldEngineLite.resolveRegistrationSchema(ctxRestore) : null;
        CariHubRegistroPublicBlocks.apply(ctxRestore, resolvedRestore, c.bloquesPublicos);
      }
      $('fldWhatsapp').value = c.whatsappPublico || '';
      $('fldTelegram').value = c.telegramPublico || '';
      if ($('fldInstagram')) $('fldInstagram').value = c.instagramPublico || '';
      if ($('fldTwitter')) $('fldTwitter').value = c.twitterPublico || '';
      if ($('fldFacebook')) $('fldFacebook').value = c.facebookPublico || '';
      if ($('fldGmail')) $('fldGmail').value = c.correoPublico || c.gmailPublico || '';
      if ($('fldTelefonoPublico')) $('fldTelefonoPublico').value = c.telefonoPublico || '';
      if ($('fldOnlyfans')) $('fldOnlyfans').value = c.onlyfansPublico || '';
      if ($('fldGoogleMaps')) {
        $('fldGoogleMaps').value = c.googleMapsPublico ||
          (data.contactoPublico && data.contactoPublico.googleMaps) || '';
      }

      if (data.contactoPublico) {
        var cp = data.contactoPublico;
        if ($('ctWhatsapp')) $('ctWhatsapp').checked = cp.whatsappActivo !== false;
        if ($('ctTelegram')) $('ctTelegram').checked = !!cp.telegramActivo;
        if ($('ctInstagram')) $('ctInstagram').checked = !!cp.instagramActivo;
        if ($('ctTwitter')) $('ctTwitter').checked = !!cp.twitterActivo;
        if ($('ctFacebook')) $('ctFacebook').checked = !!cp.facebookActivo;
        if ($('ctGmail')) $('ctGmail').checked = !!(cp.gmailActivo || cp.correoActivo);
        if ($('ctTelefono')) $('ctTelefono').checked = !!cp.telefonoActivo;
        if ($('ctOnlyfans')) $('ctOnlyfans').checked = !!(cp.onlyFansActivo || cp.onlyfansActivo);
        if ($('ctUbicacion')) $('ctUbicacion').checked = !!cp.googleMapsActivo;
        if ($('ctMensajesInternos')) {
          $('ctMensajesInternos').checked = cp.mensajesInternosActivo !== false &&
            cp.mensajeInternoActivo !== false;
        }
        syncContactOnlyfansVisibility();
        syncContactFieldsVisibility();
      }

      var msgDraft = data.mensajeContactoPublicidad ||
        (data.contactoPublico && data.contactoPublico.mensajeContactoPublicidad) || '';
      if ($('fldMensajeContacto')) {
        $('fldMensajeContacto').value = msgDraft;
        if (msgDraft) {
          $('fldMensajeContacto').dataset.auto = '0';
        } else {
          prepararMensajeContactoPorSector();
        }
        actualizarMensajeContacto();
      }

      if (data.imagenesPublicas && data.imagenesPublicas.principal) {
        var mainBox = $('uploadPrincipalBox');
        if (mainBox) {
          mainBox.classList.add('has-image');
          mainBox.dataset.preview = data.imagenesPublicas.principal;
          var img = document.createElement('img');
          img.src = data.imagenesPublicas.principal;
          mainBox.insertBefore(img, mainBox.firstChild);
        }
      }
      if (data.imagenesPublicas && data.imagenesPublicas.galeria) {
        data.imagenesPublicas.galeria.forEach(function (src, i) {
          var slot = document.querySelector('#rpGalleryGrid [data-index="' + i + '"]');
          if (!slot || !src) return;
          slot.dataset.preview = src;
          var gimg = document.createElement('img');
          gimg.src = src;
          slot.insertBefore(gimg, slot.firstChild);
          slot.classList.add('has-image');
        });
      }
    } catch (e) { /* ignore corrupt draft */ }
  }

  var PREVIEW_PRIVADOS_EJEMPLOS = {
    escort: { sectorId: 'adultos', subId: 'escort' },
    medico: { sectorId: 'salud', subId: 'medicos-generales' },
    enfermeria: { sectorId: 'salud', subId: 'enfermeria-a-domicilio' },
    restaurante: { sectorId: 'restaurantes', subId: 'restaurantes' },
    plomero: { sectorId: 'hogar', subId: 'plomeros' },
    'sex-shop': { sectorId: 'adultos', subId: 'sex shop' },
    'club-sw': { sectorId: 'adultos', subId: 'club sw' }
  };

  function findSubInCatalog(sectorId, subId) {
    var subs = global.CariHubSectores && CariHubSectores.subcategoriasDeSector
      ? CariHubSectores.subcategoriasDeSector(sectorId)
      : [];
    for (var i = 0; i < subs.length; i++) {
      if (subs[i].id === subId) return subs[i];
    }
    return { id: subId, nombre: subId };
  }

  function resolvePreviewPrivadosQuery() {
    var params;
    try {
      params = new URLSearchParams(global.location.search);
    } catch (e) {
      return null;
    }
    if (params.get('preview') !== 'privados') return null;
    var key = params.get('ejemplo') || params.get('sub') || 'escort';
    var preset = PREVIEW_PRIVADOS_EJEMPLOS[key];
    if (preset) return preset;
    var sectors = global.CariHubSectores && CariHubSectores.sectores
      ? CariHubSectores.sectores()
      : [];
    var s;
    for (var i = 0; i < sectors.length; i++) {
      s = sectors[i];
      var hit = findSubInCatalog(s.id, key);
      if (hit && hit.id === key) {
        return { sectorId: s.id, subId: key };
      }
    }
    return PREVIEW_PRIVADOS_EJEMPLOS.escort;
  }

  function bootPreviewPrivados(preset) {
    var sector = global.CariHubSectores && CariHubSectores.sectorPorId
      ? CariHubSectores.sectorPorId(preset.sectorId)
      : null;
    if (!sector) return false;
    var sub = findSubInCatalog(sector.id, preset.subId);
    state.sector = sector;
    state.subcategoria = sub;
    state.contexto = buildContexto(sector, sub);
    document.body.classList.add('rp-preview-privados');
    applySectorAmbience(sector);
    showScreen('screen4');
    return true;
  }

  function boot() {
    syncScreenFromDom();
    applyBodyScreenClasses();
    bindActionButtons();
    bindValidationModal();
    syncPinkSheen();
    renderSectorCards();
    initGeoPicker();
    bindUploads();
    bindContactToggles();
    bindMensajeContacto();
    bindCatSearch();
    updateProgress();
    syncActionsBar();
    syncCat0Foot();
    syncFormActionsPlacement();
    syncSectorSparkles('', document.querySelector('#screen0 .rp-cat0-scroll'));
    if (global.CariHubTerminosRegistro && CariHubTerminosRegistro.bindTerminosModal) {
      CariHubTerminosRegistro.bindTerminosModal();
    }

    var previewPreset = resolvePreviewPrivadosQuery();
    if (previewPreset && bootPreviewPrivados(previewPreset)) {
      return;
    }

    refreshAccessMode();

    var closeBtn = $('rpClose');
    if (closeBtn) closeBtn.addEventListener('click', goHomeFromRegistro);

    var catBack = $('rpCatBack');
    if (catBack) catBack.addEventListener('click', goHomeFromRegistro);

    var catVolver = $('rpCatVolver');
    if (catVolver) catVolver.addEventListener('click', goHomeFromRegistro);
  }

  function bindPrivateUploads() {
    /* Archivos privados: bind en carihub-private-fields-lite.js */
  }

  function goBackFromScreen1() {
    handleSecondaryClick();
  }

  global.CariHubRegistroPerfilWizardCompress = compressImage;

  global.CariHubRegistroPerfil = {
    boot: boot,
    showScreen: showScreen,
    saveDraft: saveDraft,
    submitSolicitudPerfil: submitSolicitudPerfil,
    goBackFromScreen1: goBackFromScreen1,
    getAccessOptions: getAccessOptions,
    refreshAccessMode: refreshAccessMode,
    getContext: function () {
      return state.contexto || buildContexto(state.sector, state.subcategoria);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
