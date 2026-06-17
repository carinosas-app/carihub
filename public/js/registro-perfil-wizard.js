(function (global) {
  'use strict';

  var STORAGE_KEY = 'solicitudPerfilPaso1';

  var SECTOR_IMAGES = {
    adultos: 'img/home/sectores/sector-01-adultos.png',
    bienestar: 'img/home/sectores/sector-02-bienestar.png',
    salud: 'img/home/sectores/sector-03-salud.png',
    profesionales: 'img/home/sectores/sector-04-profesionales.png',
    automotriz: 'img/home/sectores/sector-05-automotriz.png',
    hogar: 'img/home/sectores/sector-06-hogar.png',
    comercio: 'img/home/sectores/sector-07-comercio.png',
    'bienes-raices': 'img/home/sectores/sector-08-bienes-raices.png',
    eventos: 'img/home/sectores/sector-09-eventos.png',
    transporte: 'img/home/sectores/sector-10-transporte.png',
    educacion: 'img/home/sectores/sector-11-educacion.png',
    tecnologia: 'img/home/sectores/sector-12-tecnologia.png',
    restaurantes: 'img/home/sectores/sector-13-restaurantes.png',
    mascotas: 'img/home/sectores/sector-14-mascotas.png',
    industria: 'img/home/sectores/sector-15-industria.png'
  };

  var NEGOCIO_SUBCATS = [
    'spa', 'masajes', 'sex shop', 'club sw', 'antro restaurant bar',
    'antro restaurant bar lgbt', 'hotel motel', 'cabinas glory holes', 'cine xxx'
  ];

  var state = {
    screen: 'screen0',
    sector: null,
    subcategoria: null,
    contexto: null
  };

  var TAP_ADVANCE_MS = 180;
  var ANUNCIO_ROTATE_MS = 4800;
  var ADULTOS_CARD_ROTATE_MS = 4200;
  var anuncioRotateTimer = null;
  var adultosCardRotateTimer = null;

  var ADULTOS_CARD_IMAGES = [
    'img/home/sectores/adultos-rotate-01.png',
    'img/home/sectores/adultos-rotate-02.png',
    'img/home/sectores/adultos-rotate-03.png',
    'img/home/sectores/adultos-rotate-04.png',
    'img/home/sectores/adultos-rotate-05.png',
    'img/home/sectores/adultos-rotate-06.png',
    'img/home/sectores/adultos-rotate-07.png'
  ];

  var adultosCardRotateIdx = 0;
  var geoPicker = null;

  function prefersLiteMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 768px)').matches;
  }

  function sectorMobPath(pngPath) {
    return String(pngPath)
      .replace('/sectores/', '/sectores/mob/')
      .replace(/\.png$/i, '.jpg');
  }

  function pickImageSrc(pngPath) {
    if (window.matchMedia('(max-width: 768px)').matches) {
      return sectorMobPath(pngPath);
    }
    return pngPath;
  }

  function buildSectorImageHtml(pngPath) {
    return (
      '<img src="' + esc(pngPath) + '" alt="" loading="lazy" decoding="async" width="320" height="240">'
    );
  }

  function initGeoPicker() {
    if (geoPicker || !global.CariHubGeoPicker) return;
    geoPicker = global.CariHubGeoPicker.mount({
      prefix: 'rp',
      container: '#rpGeoPicker',
      hidden: { pais: 'fldPais', estado: 'fldEstado', ciudad: 'fldCiudad' }
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
    if (subcatId === 'contenido') return 'Creador / contenido';
    if (NEGOCIO_SUBCATS.indexOf(subcatId) >= 0) return 'Negocio / local';
    return 'Perfil personal';
  }

  function applyBodyScreenClasses() {
    var isSubcat = state.screen === 'screen0b-adultos' || state.screen === 'screen0b-soon';
    document.body.classList.toggle('rp-adultos-subcats', state.screen === 'screen0b-adultos');
    document.body.classList.toggle('rp-subcat-screen', isSubcat);
    document.body.classList.toggle('rp-screen0-cats', state.screen === 'screen0');
    document.body.classList.toggle('rp-lite-motion', prefersLiteMotion());
  }

  function showScreen(id) {
    document.querySelectorAll('.rp-screen').forEach(function (el) {
      el.classList.toggle('is-active', el.id === id);
    });
    state.screen = id;
    applyBodyScreenClasses();
    if (id === 'screen0b-adultos') {
      stopAdultosCardRotation();
      startAdultosAnuncioRotation();
    } else if (id === 'screen0') {
      stopAdultosAnuncioRotation();
      startAdultosCardRotation();
    } else if (id === 'screen1') {
      stopAdultosAnuncioRotation();
      stopAdultosCardRotation();
      ensureGeoReady();
    } else {
      stopAdultosAnuncioRotation();
      stopAdultosCardRotation();
    }
    updateProgress();
    syncActionsBar();
  }

  function updateProgress() {
    var step = 1;
    var label = 'Paso 1 · Categoría';
    if (state.screen === 'screen0b-adultos' || state.screen === 'screen0b-soon') {
      step = 2;
      label = 'Paso 2 · Subcategoría';
    } else if (state.screen === 'screen1') {
      step = 3;
      label = 'Paso 3 · Datos públicos';
    }
    var active = document.querySelector('.rp-screen.is-active');
    var dots = active ? active.querySelectorAll('.rp-progress__dot') : [];
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-on', i < step);
    });
    var lbl = $('rpProgressLabel');
    if (lbl) lbl.textContent = label;
  }

  function applySectorAmbience(sector) {
    var page = document.body;
    if (!page) return;
    page.classList.remove('rp-has-sector-glow');
    if (!sector || !sector.id) {
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
      saveDraft();
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
      if (state.sector && state.sector.id === 'adultos') showScreen('screen0b-adultos');
      else showScreen('screen0');
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

  function setSecondaryButton(mode, label) {
    var secondary = $('rpBtnSecondary');
    if (!secondary) return;
    secondary.classList.remove('rp-hidden');
    if (mode === 'fucsia') {
      secondary.className = 'rp-btn rp-btn--fucsia-stars';
      secondary.innerHTML = buildFucsiaBackButton(label);
    } else {
      secondary.className = 'rp-btn rp-btn--ghost';
      secondary.textContent = label;
    }
  }

  function syncActionsBar() {
    var bar = $('rpActionsBar');
    if (!bar) return;
    var primary = $('rpBtnPrimary');
    var progressFoot = $('rpActionsProgress');
    bar.classList.remove('rp-actions--nav-only', 'rp-actions--adultos-subcats', 'rp-actions--screen0', 'rp-actions--single');

    if (state.screen === 'screen0') {
      primary.textContent = 'Continuar';
      primary.classList.remove('rp-hidden');
      primary.disabled = !state.sector;
      var secondary = $('rpBtnSecondary');
      if (secondary) secondary.classList.add('rp-hidden');
      if (progressFoot) progressFoot.classList.add('rp-hidden');
      bar.classList.add('rp-actions--screen0', 'rp-actions--single');
    } else if (state.screen === 'screen0b-adultos') {
      primary.classList.add('rp-hidden');
      setSecondaryButton('fucsia', 'Volver a categorías');
      if (progressFoot) progressFoot.classList.add('rp-hidden');
      bar.classList.add('rp-actions--nav-only', 'rp-actions--adultos-subcats');
    } else if (state.screen === 'screen0b-soon') {
      primary.classList.add('rp-hidden');
      setSecondaryButton('ghost', 'Volver a categorías');
      if (progressFoot) progressFoot.classList.add('rp-hidden');
      bar.classList.add('rp-actions--nav-only');
    } else if (state.screen === 'screen1') {
      primary.textContent = 'Guardar borrador';
      primary.disabled = false;
      primary.classList.remove('rp-hidden');
      setSecondaryButton('ghost', 'Volver a subcategorías');
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

  function buildAdultosVisualHtml() {
    var src = ADULTOS_CARD_IMAGES[0];
    adultosCardRotateIdx = 0;
    return (
      '<span class="rp-sector-card__visual rp-sector-card__visual--rotate">' +
        '<span class="rp-sector-visual-stage" id="rpAdultosCardStage">' +
          '<span class="rp-sector-visual-slide is-active" aria-hidden="false">' +
            '<img src="' + esc(src) + '" alt="" decoding="async" fetchpriority="high" width="320" height="240">' +
          '</span>' +
        '</span>' +
      '</span>'
    );
  }

  function buildSectorCardButton(sector, opts) {
    opts = opts || {};
    var subs = global.CariHubSectores && global.CariHubSectores.subcategoriasDeSector
      ? global.CariHubSectores.subcategoriasDeSector(sector.id)
      : [];
    var img = SECTOR_IMAGES[sector.id] || 'img/home/promo-perfil.jpg';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rp-sector-card' +
      (opts.adultosFixed ? ' rp-sector-card--adultos-fixed' : '') +
      (state.sector && state.sector.id === sector.id ? ' is-selected' : '');
    var visualHtml = opts.adultosFixed
      ? buildAdultosVisualHtml()
      : '<span class="rp-sector-card__visual">' +
          buildSectorImageHtml(img) +
        '</span>';
    var metaText = subs.length + ' subcategorías';
    btn.innerHTML =
      visualHtml +
      '<span class="rp-sector-card__body rp-sector-card__body--fucsia">' +
        buildSparkfieldHtml({ durBase: 2.6, durStep: 0.5, delayStep: 0.38 }) +
        '<span class="rp-sector-card__copy">' +
          '<span class="rp-sector-card__name">' + sectorNameHtml(sector) + '</span>' +
          '<span class="rp-sector-card__meta">' + esc(metaText) + '</span>' +
        '</span>' +
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

    sectors.forEach(function (sector) {
      var li = document.createElement('li');
      li.appendChild(buildSectorCardButton(sector, { adultosFixed: sector.id === 'adultos' }));
      list.appendChild(li);
    });
    if (state.screen === 'screen0') startAdultosCardRotation();
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

  function goAnuncioSlide(stage, nextIdx) {
    if (!stage) return 0;
    var slides = stage.querySelectorAll('.rp-anuncio-slide');
    var dotsWrap = stage.parentElement ? stage.parentElement.querySelector('.rp-anuncio-dots') : null;
    var dots = dotsWrap ? dotsWrap.querySelectorAll('span') : [];
    if (!slides.length) return 0;
    var idx = ((nextIdx % slides.length) + slides.length) % slides.length;
    var activeSlide = slides[idx];
    if (activeSlide) ensureLazyImgLoaded(activeSlide.querySelector('img'));
    slides.forEach(function (sl, i) {
      var on = i === idx;
      sl.classList.toggle('is-active', on);
      sl.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-on', i === idx);
    });
    return idx;
  }

  function advanceAdultosCardImage() {
    var stage = $('rpAdultosCardStage');
    if (!stage) return;
    var img = stage.querySelector('img');
    if (!img) return;
    var nextIdx = (adultosCardRotateIdx + 1) % ADULTOS_CARD_IMAGES.length;
    var nextSrc = ADULTOS_CARD_IMAGES[nextIdx];
    var preload = new Image();
    preload.onload = function () {
      adultosCardRotateIdx = nextIdx;
      img.src = nextSrc;
    };
    preload.src = nextSrc;
  }

  function startAdultosCardRotation() {
    stopAdultosCardRotation();
    if (prefersLiteMotion()) return;
    var stage = $('rpAdultosCardStage');
    if (!stage) return;
    adultosCardRotateTimer = setInterval(advanceAdultosCardImage, ADULTOS_CARD_ROTATE_MS);
  }

  function stopAdultosCardRotation() {
    if (adultosCardRotateTimer) {
      clearInterval(adultosCardRotateTimer);
      adultosCardRotateTimer = null;
    }
  }

  function startAdultosAnuncioRotation() {
    stopAdultosAnuncioRotation();
    if (prefersLiteMotion()) return;
    var stage = $('rpAdultosAnuncioStage');
    if (!stage) return;
    var slides = stage.querySelectorAll('.rp-anuncio-slide');
    if (slides.length < 2) return;
    var rot = { idx: 0 };
    anuncioRotateTimer = setInterval(function () {
      rot.idx = goAnuncioSlide(stage, rot.idx + 1);
    }, ANUNCIO_ROTATE_MS);
  }

  function stopAdultosAnuncioRotation() {
    if (anuncioRotateTimer) {
      clearInterval(anuncioRotateTimer);
      anuncioRotateTimer = null;
    }
  }

  function renderAdultosSubcats() {
    var list = $('rpAdultosGrid');
    var hint = $('rpAdultosHint');
    if (!list || !global.CariHubSectores) return;
    var items = global.CariHubSectores.subcategoriasDeSector('adultos');
    if (hint) hint.textContent = items.length + ' categorías · desliza para ver todas';
    if (global.CariHubAdultosCatPicker) {
      global.CariHubAdultosCatPicker.renderList(list, items, {
        selectedId: state.subcategoria ? state.subcategoria.id : '',
        onSelect: function (cat) {
          selectSubcategoria(cat);
        }
      });
    }
  }

  function buildContexto(sector, subcat) {
    return {
      categoriaPrincipal: sector ? sector.nombre : '',
      sectorId: sector ? sector.id : '',
      subcategoria: subcat ? subcat.nombre : '',
      subcategoriaId: subcat ? subcat.id : '',
      tipoPerfilLabel: tipoPerfilLabel(subcat ? subcat.id : ''),
      schemaVersion: '2026-06-10-fase1'
    };
  }

  function onContinueFromSectors() {
    if (!state.sector) return;
    if (state.sector.id === 'adultos') {
      renderAdultosSubcats();
      var sel = $('rpSubcatSelected');
      if (sel) sel.classList.add('rp-hidden');
      showScreen('screen0b-adultos');
      return;
    }
    var title = $('rpSoonTitle');
    if (title) title.textContent = state.sector.nombre;
    showScreen('screen0b-soon');
  }

  function onContinueFromAdultos() {
    if (!state.subcategoria) return;
    ensureGeoReady(function () {
      fillScreen1();
      showScreen('screen1');
      if (global.CariHubBannerRegistro && global.CariHubBannerRegistro.remount) {
        global.CariHubBannerRegistro.remount();
      }
    });
  }

  function fillScreen1() {
    var ctx = state.contexto || buildContexto(state.sector, state.subcategoria);
    $('fldCategoria').value = ctx.categoriaPrincipal || '';
    $('fldSubcategoria').value = ctx.subcategoria || '';
    var edadWrap = $('wrapEdad');
    var modWrap = $('wrapModalidad');
    var isNegocio = NEGOCIO_SUBCATS.indexOf(ctx.subcategoriaId) >= 0;
    if (edadWrap) edadWrap.classList.toggle('rp-hidden', isNegocio);
    if (modWrap) modWrap.classList.toggle('rp-hidden', isNegocio);
    restoreDraftFields();
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
        });
      });
    }

    if (galInput && galGrid) {
      galGrid.querySelectorAll('.rp-gallery__slot').forEach(function (slot) {
        slot.addEventListener('click', function () {
          galInput.dataset.slotIndex = slot.getAttribute('data-index');
          galInput.click();
        });
      });
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

    return {
      contexto: state.contexto || buildContexto(state.sector, state.subcategoria),
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
        whatsappPublico: $('fldWhatsapp').value.trim(),
        telegramPublico: $('fldTelegram').value.trim()
      },
      imagenesPublicas: {
        principal: mainBox && mainBox.dataset.preview ? mainBox.dataset.preview : '',
        galeria: galeria
      },
      guardadoEn: new Date().toISOString(),
      fase: 1
    };
  }

  function saveDraft() {
    var alias = $('fldAlias').value.trim();
    if (!alias) {
      alert('Escribe un alias o nombre público.');
      return;
    }
    if (!$('fldPais').value || !$('fldEstado').value || !$('fldCiudad').value) {
      alert('Selecciona país, estado y ciudad.');
      return;
    }
    try {
      var data = collectFormData();
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      alert('Borrador guardado en este dispositivo. Fase 2 (datos privados) estará disponible pronto.');
    } catch (e) {
      alert('No se pudo guardar el borrador. Reduce el tamaño de las imágenes e intenta de nuevo.');
    }
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
      $('fldWhatsapp').value = c.whatsappPublico || '';
      $('fldTelegram').value = c.telegramPublico || '';

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

  function boot() {
    syncScreenFromDom();
    applyBodyScreenClasses();
    bindActionButtons();
    if (!prefersLiteMotion() && global.CariHubPinkSheen && global.CariHubPinkSheen.mountPage) {
      global.CariHubPinkSheen.mountPage(document.body);
    }
    renderSectorCards();
    initGeoPicker();
    bindUploads();
    updateProgress();
    syncActionsBar();

    var catSearch = $('rpCatSearch');
    if (catSearch && catSearch.dataset.rpBound !== '1') {
      catSearch.dataset.rpBound = '1';
      catSearch.addEventListener('input', function () {
        renderSectorCards(this.value);
      });
    }

    var closeBtn = $('rpClose');
    if (closeBtn) closeBtn.addEventListener('click', function () {
      global.location.href = 'index.html';
    });

    var phase2Link = $('rpLinkFase2');
    if (phase2Link) {
      phase2Link.addEventListener('click', function () {
        global.location.href = 'registro-perfil2.html';
      });
    }
  }

  global.CariHubRegistroPerfil = {
    boot: boot,
    showScreen: showScreen,
    saveDraft: saveDraft
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
