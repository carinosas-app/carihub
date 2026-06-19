(function () {
  'use strict';
/* ── Hero rotativo: 35 slides (34 cat. + motel) + espacio publicitario por categoría ── */
  var HERO_CERCA = '<span class="home-hero__cerca">cerca de ti</span>';
  var HERO_BANNER_SLOTS = window.CARIHUB_HERO_BANNER_SLOTS || [
    'home_hero_1', 'home_hero_2', 'home_hero_3', 'home_hero_4', 'home_hero_5'
  ];
  var HERO_PREVIEW_IMAGES = window.CARIHUB_HERO_PREVIEW_IMAGES || {};

  function getHeroPreviewImage(slide) {
    var key = slide.slotKey || slide.categoriaId;
    return HERO_PREVIEW_IMAGES[key] || HERO_PREVIEW_IMAGES[slide.categoriaId] || null;
  }

  function isLaptopHero() {
    return document.body.classList.contains('proto-laptop') ||
      document.body.classList.contains('proto-tablet-h') ||
      document.body.classList.contains('proto-tablet') ||
      document.body.classList.contains('proto-iphone');
  }

  function isHeroScaleAnim() {
    return document.body.classList.contains('proto-laptop') ||
      document.body.classList.contains('proto-iphone');
  }

  function heroPhraseDisplay(slide) {
    var prefix = (slide.titlePrefix || 'Encuentra ').trim();
    var kw = (slide.titleKeyword || '').trim();
    var extra = prefix.replace(/^encuentra\s*/i, '').trim();
    var phrase = extra ? (extra + ' ' + kw) : kw;
    if (!phrase) return kw;
    return phrase.charAt(0).toLocaleUpperCase('es') + phrase.slice(1);
  }

  function heroTitleHtml(slide) {
    if (isLaptopHero()) {
      return '<span class="home-hero__line home-hero__line--prefix">Encuentra</span>' +
        '<span class="home-hero__line home-hero__accent">' + heroPhraseDisplay(slide) + '</span>' +
        '<span class="home-hero__line home-hero__line--cerca">cerca de ti!!</span>';
    }
    var prefix = (slide.titlePrefix || 'Encuentra ').trim();
    return '<span class="home-hero__line home-hero__line--prefix">' + prefix + '</span>' +
      '<span class="home-hero__line home-hero__accent">' + slide.titleKeyword + '</span>' +
      '<span class="home-hero__line home-hero__line--cerca">cerca de ti</span>';
  }

  function getHeroRental(slide) {
    var rentals = window.CARIHUB_HERO_RENTALS || {};
    var key = slide.slotKey || slide.categoriaId;
    return rentals[key] || null;
  }

  function getHeroBannerSlotId(slideIndex) {
    if (!HERO_BANNER_SLOTS.length) return '';
    return HERO_BANNER_SLOTS[slideIndex % HERO_BANNER_SLOTS.length];
  }

  function getHeroBannerRental(slotId) {
    var rentals = window.CARIHUB_HERO_BANNER_RENTALS || {};
    return slotId ? (rentals[slotId] || null) : null;
  }

  function heroBannerLockLabel(slotId) {
    var n = String(slotId || '').replace('home_hero_', '');
    return 'Hero espacio ' + (n || '—');
  }

  function rentalLockLabel(slide) {
    if (slide.slotKey === 'motel') return 'Solo Motel';
    if (slide.slotKey === 'hotel') return 'Solo Hotel';
    return 'Solo ' + slide.categoriaNombre;
  }

  var HERO_SLIDES = window.CARIHUB_HERO_SLIDES || [];

  var heroIndex = 0;
  var heroTimer = null;

  function buildHeroTextLayer(slide, visible, isFirst) {
    var layer = document.createElement('div');
    layer.className = 'home-hero__text-layer' + (visible ? ' is-active' : '');
    var titleId = isFirst ? ' id="hero-title"' : '';
    var catNow = isLaptopHero()
      ? ''
      : '<span class="home-hero__cat-now">' + (slide.slideLabel || slide.categoriaNombre) + '</span>';
    layer.innerHTML =
      '<h1 class="home-hero__title"' + titleId + '>' + heroTitleHtml(slide) + '</h1>' +
      catNow +
      '<p class="home-hero__subtitle">' + slide.subtitle + '</p>';
    return layer;
  }

  function rebuildHeroCopyLayers() {
    var copyRoot = document.getElementById('heroCopy');
    if (!copyRoot || !HERO_SLIDES.length) return;
    copyRoot.innerHTML = '';
    HERO_SLIDES.forEach(function (slide, i) {
      copyRoot.appendChild(buildHeroTextLayer(slide, i === heroIndex, i === 0));
    });
  }

  function getHeroInterval() {
    return isLaptopHero() ? 7800 : 4500;
  }

  function resetHeroTimer() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(function () {
      goHeroSlide((heroIndex + 1) % HERO_SLIDES.length, false);
    }, getHeroInterval());
  }

  function buildPreviewSlotHtml(slide, src) {
    return (
      '<div class="home-hero__slot home-hero__slot--preview" role="img" aria-label="Vista previa: ' + slide.categoriaNombre + '">' +
        '<img class="home-hero__slot-preview-img" src="' + src + '" alt="" decoding="async">' +
      '</div>'
    );
  }

  function buildEmptySlotHtml(slide) {
    return (
      '<div class="home-hero__slot home-hero__slot--empty" role="presentation" aria-hidden="true" title="Espacio vacío · ' + slide.categoriaNombre + '"></div>'
    );
  }

  function buildVacantHeroBannerHtml(slide, slotId, previewSrc) {
    var href = 'registro-banner.html?slot=' + encodeURIComponent(slotId);
    var previewClass = previewSrc ? ' home-hero__slot--preview' : '';
    var inner = previewSrc
      ? '<img class="home-hero__slot-preview-img" src="' + previewSrc + '" alt="" decoding="async">'
      : '<div class="home-hero__slot-visual">' +
          '<span class="home-hero__slot-emoji" aria-hidden="true">' + slide.emoji + '</span>' +
          '<span class="home-hero__slot-cat">' + (slide.slideLabel || slide.categoriaNombre) + '</span>' +
        '</div>';
    return (
      '<a class="home-hero__slot home-hero__slot--vacant' + previewClass + '" href="' + href + '" aria-label="Anúnciate aquí — hero espacio ' + slotId.replace('home_hero_', '') + '">' +
        inner +
        '<span class="home-hero__slot-msg">Anúnciate aquí</span>' +
        '<span class="home-hero__slot-hint">Desde $5,000/mes · imagen</span>' +
      '</a>'
    );
  }

  function buildRentedSlotHtml(slide, rental, lockLabel) {
    var titulo = rental.titulo || slide.categoriaNombre;
    var inner = rental.imagen
      ? '<img class="home-hero__slot-rented-img" src="' + rental.imagen + '" alt="' + titulo + '" decoding="async">'
      : '<div class="home-hero__slot-rented-card">' +
          '<span class="home-hero__slot-emoji" aria-hidden="true">' + slide.emoji + '</span>' +
          '<span class="home-hero__slot-rented-name">' + titulo + '</span>' +
          (rental.telefono ? '<span class="home-hero__slot-phone">' + rental.telefono + '</span>' : '') +
        '</div>';
    return (
      '<a class="home-hero__slot home-hero__slot--rented" href="' + (rental.url || '#') + '" aria-label="Ver anuncio de ' + titulo + '">' +
        inner +
        '<span class="home-hero__slot-lock">' + (lockLabel || rentalLockLabel(slide)) + '</span>' +
      '</a>'
    );
  }

  function buildHeroVisual(slide, visible, slideIndex) {
    var el = document.createElement('div');
    el.className = 'home-hero__slide-visual' + (visible ? ' is-active' : '');
    el.style.background = slide.bg;
    el.dataset.categoriaId = slide.categoriaId;
    el.dataset.slotKey = slide.slotKey || slide.categoriaId;

    var bannerSlotId = getHeroBannerSlotId(slideIndex);
    var bannerRental = getHeroBannerRental(bannerSlotId);
    if (bannerSlotId) el.dataset.heroBannerSlot = bannerSlotId;

    if (bannerRental) {
      el.innerHTML = buildRentedSlotHtml(slide, bannerRental, heroBannerLockLabel(bannerSlotId));
    } else if (bannerSlotId) {
      el.innerHTML = buildVacantHeroBannerHtml(slide, bannerSlotId, getHeroPreviewImage(slide));
    } else {
      var previewImg = getHeroPreviewImage(slide);
      if (previewImg) {
        el.innerHTML = buildPreviewSlotHtml(slide, previewImg);
      } else if (slide.showcaseImage) {
        el.innerHTML = '<img class="home-hero__slide-photo" src="' + slide.showcaseImage + '" alt="">';
      } else {
        var rental = getHeroRental(slide);
        if (rental && rental.categoriaId === slide.categoriaId) {
          el.innerHTML = buildRentedSlotHtml(slide, rental);
        } else {
          el.innerHTML = buildEmptySlotHtml(slide);
        }
      }
    }
    return el;
  }

  function initHeroCarousel() {
    var visualRoot = document.getElementById('heroVisual');
    var copyRoot = document.getElementById('heroCopy');
    if (!visualRoot || !copyRoot) return;

    visualRoot.innerHTML = '';
    HERO_SLIDES.forEach(function (slide, i) {
      visualRoot.appendChild(buildHeroVisual(slide, i === 0, i));
    });
    rebuildHeroCopyLayers();
    resetHeroTimer();
  }

  function goHeroSlide(next, manual) {
    if (next === heroIndex && manual) return;
    var visualRoot = document.getElementById('heroVisual');
    var copyRoot = document.getElementById('heroCopy');
    var visuals = visualRoot.querySelectorAll('.home-hero__slide-visual');
    var texts = copyRoot.querySelectorAll('.home-hero__text-layer');
    var prev = heroIndex;
    heroIndex = next;

    visuals[prev].classList.remove('is-active');
    visuals[prev].classList.add('is-exit');
    texts[prev].classList.remove('is-active');

    visuals[next].classList.remove('is-exit');
    visuals[next].classList.add('is-active');

    if (isHeroScaleAnim()) {
      texts[prev].classList.add('is-exit');
      texts[next].classList.remove('is-active');
      if (window._heroTextSwapTimer) clearTimeout(window._heroTextSwapTimer);
      window._heroTextSwapTimer = setTimeout(function () {
        texts[prev].classList.remove('is-exit');
        texts[next].classList.add('is-active');
      }, 640);
    } else {
      texts[next].classList.add('is-active');
    }

    var tema = HERO_SLIDES[next].tema;
    document.getElementById('mockupV4').setAttribute('data-hero-tema', tema);

    setTimeout(function () {
      visuals[prev].classList.remove('is-exit');
    }, 700);

    if (manual) resetHeroTimer();
  }

  /* ── Catálogo completo de categorías (35) ── */
  var CATEGORIAS = (window.CARIHUB_CATEGORIAS_HOME || []);
  var NUM_CAT_SLOTS = 6;
  var selectedCategoriaId = '';

  function catAt(index) {
    if (!CATEGORIAS.length) return { id: '', nombre: 'Categoría', emoji: '✨' };
    var i = ((index % CATEGORIAS.length) + CATEGORIAS.length) % CATEGORIAS.length;
    return CATEGORIAS[i];
  }

  function catDisplay(cat) {
    return {
      name: cat.nombreCorto || cat.nombre,
      nameFull: cat.nombre,
      emoji: cat.emoji,
      id: cat.id
    };
  }

  function catSeoLabel(cat) {
    return 'Encuentra ' + (cat.nameFull || cat.name) + ' cerca de ti';
  }

  function fillLayer(layer, cat, catIndex) {
    var raw = CATEGORIAS.find(function (c) {
      return c.id === cat.id || c.nombre === cat.nameFull || c.nombre === cat.name;
    }) || { id: cat.id, nombre: cat.nameFull || cat.name, emoji: cat.emoji };
    var idx = typeof catIndex === 'number' ? catIndex : CATEGORIAS.findIndex(function (c) { return c.id === raw.id; });
    if (window.CariHubVCard && window.CariHubVCard.mount) {
      window.CariHubVCard.mount(layer, window.CariHubVCard.catVisual(raw, idx < 0 ? 0 : idx));
      return;
    }
    layer.innerHTML = '';
    var name = document.createElement('span');
    name.className = 'home-cat-card__name';
    name.textContent = cat.name;
    layer.appendChild(name);
  }

  var slotState = [];
  for (var si = 0; si < NUM_CAT_SLOTS; si++) {
    slotState.push({ index: Math.floor((si * CATEGORIAS.length) / NUM_CAT_SLOTS) });
  }

  function buildLayer(cat, visible, catIndex) {
    var layer = document.createElement('span');
    layer.className = 'home-cat-card__layer' + (visible ? ' is-visible' : '');
    fillLayer(layer, cat, catIndex);
    return layer;
  }

  function initCategorySlots() {
    document.querySelectorAll('.home-cat-card').forEach(function (btn) {
      var slot = parseInt(btn.getAttribute('data-slot'), 10);
      var stage = btn.querySelector('.home-cat-card__stage');
      var first = catDisplay(catAt(slotState[slot].index));
      var second = catDisplay(catAt(slotState[slot].index + 1));
      stage.appendChild(buildLayer(first, true, slotState[slot].index));
      stage.appendChild(buildLayer(second, false, slotState[slot].index + 1));
      var seo = catSeoLabel(first);
      btn.setAttribute('aria-label', seo);
      btn.setAttribute('title', seo);
    });
    refitAllCategoryCards();
  }

  function refitAllCategoryCards() {
    if (!window.CariHubVCard || !CariHubVCard.scheduleGridFootFit) return;
    document.querySelectorAll('.home-categorias .home-cat-card__layer').forEach(function (layer) {
      CariHubVCard.scheduleGridFootFit(layer);
    });
  }

  var catRefitTimer = null;
  window.addEventListener('resize', function () {
    if (catRefitTimer) clearTimeout(catRefitTimer);
    catRefitTimer = setTimeout(refitAllCategoryCards, 120);
  });

  function rotateSlot(slot) {
    var btn = document.querySelector('.home-cat-card[data-slot="' + slot + '"]');
    if (!btn) return;
    var state = slotState[slot];
    var nextIndex = state.index + 1;
    var stage = btn.querySelector('.home-cat-card__stage');
    var layers = stage.querySelectorAll('.home-cat-card__layer');
    var hide = layers[0];
    var show = layers[1];
    if (!hide || !show) return;

    var nextCat = catDisplay(catAt(nextIndex));
    fillLayer(show, nextCat, nextIndex);

    hide.classList.remove('is-visible');
    show.classList.add('is-visible');
    var seo = catSeoLabel(nextCat);
    btn.setAttribute('aria-label', seo);
    btn.setAttribute('title', seo);

    setTimeout(function () {
      fillLayer(hide, nextCat, nextIndex);
      hide.classList.add('is-visible');
      show.classList.remove('is-visible');
      state.index = nextIndex;
      refitAllCategoryCards();
    }, 480);
  }

  /* Categorías, sectores y banners rotan juntos cada 5 s */
  var HOME_ROTATE_MS = 5000;
  var BANNER_SLIDE_COUNT = 3;
  var homeRotateTimer = null;
  var homeBannerSlideIdx = 0;

  function rotateAllCategorySlots() {
    for (var s = 0; s < NUM_CAT_SLOTS; s++) {
      rotateSlot(s);
    }
  }

  function pickVisibleCatFromCard(btn) {
    if (!btn) return null;
    var layer = btn.querySelector('.home-cat-card__layer.is-visible');
    if (!layer) return null;
    var vcard = layer.querySelector('.home-vcard');
    if (vcard) {
      if (vcard.dataset.catName) return vcard.dataset.catName;
      if (vcard.dataset.catId) {
        var byId = CATEGORIAS.find(function (c) { return c.id === vcard.dataset.catId; });
        if (byId) return byId.nombre;
      }
    }
    var nameEl = layer.querySelector('.home-cat-card__name');
    if (!nameEl) return null;
    var shortName = nameEl.textContent.trim();
    var found = CATEGORIAS.find(function (c) {
      return (c.nombreCorto || c.nombre) === shortName || c.nombre === shortName;
    });
    return found ? (found.nombre || shortName) : shortName;
  }

  /* ── Sectores + categorías (dos pasos) ── */
  var SECTORES = window.CARIHUB_SECTORES || [];
  var NUM_SECTOR_SLOTS = 6;
  var SECTOR_SHORT = {
    adultos: 'Adultos',
    bienestar: 'Bienestar',
    salud: 'Salud',
    profesionales: 'Profesionales',
    automotriz: 'Automotriz',
    hogar: 'Hogar',
    comercio: 'Comercio',
    'bienes-raices': 'Bienes raíces',
    eventos: 'Eventos',
    transporte: 'Transporte',
    educacion: 'Educación',
    tecnologia: 'Tecnología',
    restaurantes: 'Restaurantes',
    mascotas: 'Mascotas',
    industria: 'Industria'
  };

  function sectorAt(index) {
    if (!SECTORES.length) {
      return { id: '', nombre: 'Sector', emoji: '✨' };
    }
    var i = ((index % SECTORES.length) + SECTORES.length) % SECTORES.length;
    return SECTORES[i];
  }

  function sectorLabel(sector) {
    return SECTOR_SHORT[sector.id] || sector.nombre.split(',')[0].split(' y ')[0];
  }

  function sectorAriaLabel(sector) {
    return sector.emoji + ' ' + sector.nombre;
  }

  var sectorSlotState = [];
  for (var ssi = 0; ssi < NUM_SECTOR_SLOTS; ssi++) {
    sectorSlotState.push({ index: Math.floor((ssi * SECTORES.length) / NUM_SECTOR_SLOTS) || ssi });
  }

  function fillSectorLayer(layer, sector, sectorIndex, autoplay) {
    layer.dataset.sectorId = sector.id;
    if (window.CariHubSectorScroll && window.CariHubSectorScroll.mount) {
      window.CariHubSectorScroll.mount(layer, sector, autoplay);
      return;
    }
    layer.innerHTML = '';
    var idx = typeof sectorIndex === 'number'
      ? sectorIndex
      : SECTORES.findIndex(function (s) { return s.id === sector.id; });
    if (window.CariHubVCard && window.CariHubVCard.mount) {
      window.CariHubVCard.mount(layer, window.CariHubVCard.sectorVisual(sector, idx < 0 ? 0 : idx, true));
      return;
    }
    var emoji = document.createElement('span');
    emoji.className = 'home-sector-card__emoji';
    emoji.textContent = sector.emoji;
    emoji.setAttribute('aria-hidden', 'true');
    var label = document.createElement('span');
    label.className = 'home-sector-card__label';
    label.textContent = sectorLabel(sector);
    layer.appendChild(emoji);
    layer.appendChild(label);
  }

  function buildSectorLayer(sector, visible, sectorIndex) {
    var layer = document.createElement('span');
    layer.className = 'home-sector-card__layer' + (visible ? ' is-visible' : '');
    fillSectorLayer(layer, sector, sectorIndex);
    return layer;
  }

  function initSectorCards() {
    if (!SECTORES.length) return;
    var useScroll = !!(window.CariHubSectorScroll && window.CariHubSectorScroll.mount);
    document.querySelectorAll('.home-sector-card').forEach(function (btn) {
      var slot = parseInt(btn.getAttribute('data-sector-slot'), 10);
      if (isNaN(slot)) return;
      var stage = btn.querySelector('.home-sector-card__stage');
      if (!stage) return;
      stage.innerHTML = '';
      var first = sectorAt(sectorSlotState[slot].index);
      if (useScroll) {
        stage.appendChild(buildSectorLayer(first, true, sectorSlotState[slot].index));
      } else {
        var second = sectorAt(sectorSlotState[slot].index + 1);
        stage.appendChild(buildSectorLayer(first, true, sectorSlotState[slot].index));
        stage.appendChild(buildSectorLayer(second, false, sectorSlotState[slot].index + 1));
      }
      btn.setAttribute('aria-label', sectorAriaLabel(first));
      btn.dataset.sectorId = first.id;
    });
  }

  function rotateSectorSlot(slot) {
    var btn = document.querySelector('.home-sector-card[data-sector-slot="' + slot + '"]');
    if (!btn || !SECTORES.length) return;
    var state = sectorSlotState[slot];
    var nextIndex = state.index + 1;
    var nextSector = sectorAt(nextIndex);
    var stage = btn.querySelector('.home-sector-card__stage');

    if (window.CariHubSectorScroll && window.CariHubSectorScroll.mount) {
      var layer = stage && stage.querySelector('.home-sector-card__layer');
      if (!layer) return;
      window.CariHubSectorScroll.stop(layer);
      layer.classList.remove('is-visible');
      setTimeout(function () {
        fillSectorLayer(layer, nextSector, nextIndex, true);
        layer.classList.add('is-visible');
        state.index = nextIndex;
        btn.setAttribute('aria-label', sectorAriaLabel(nextSector));
        btn.dataset.sectorId = nextSector.id;
      }, 420);
      return;
    }

    var layers = stage.querySelectorAll('.home-sector-card__layer');
    var hide = layers[0];
    var show = layers[1];
    if (!hide || !show) return;
    fillSectorLayer(show, nextSector, nextIndex);
    hide.classList.remove('is-visible');
    show.classList.add('is-visible');
    btn.setAttribute('aria-label', sectorAriaLabel(nextSector));
    btn.dataset.sectorId = nextSector.id;
    setTimeout(function () {
      fillSectorLayer(hide, nextSector, nextIndex);
      hide.classList.add('is-visible');
      show.classList.remove('is-visible');
      state.index = nextIndex;
    }, 480);
  }

  function rotateAllSectorSlots() {
    if (!SECTORES.length) return;
    for (var s = 0; s < NUM_SECTOR_SLOTS; s++) {
      rotateSectorSlot(s);
    }
  }

  var OTROS_SECTORES_IDS = [
    'bienestar',
    'eventos',
    'restaurantes',
    'salud',
    'profesionales',
    'automotriz',
    'hogar',
    'comercio',
    'bienes-raices',
    'eventos',
    'transporte',
    'educacion',
    'tecnologia',
    'restaurantes',
    'mascotas',
    'industria'
  ];

  function otrosSectoresList() {
    return OTROS_SECTORES_IDS.map(function (id) {
      return SECTORES.find(function (s) { return s.id === id; }) || null;
    }).filter(Boolean);
  }

  function buildOtrosSectoresModal() {
    var list = document.getElementById('otrosSectoresList');
    var hint = document.getElementById('otrosSectoresHint');
    var sectores = otrosSectoresList();
    if (!list || !sectores.length) return;
    if (hint) hint.textContent = sectores.length + ' sectores · elige uno para ver profesiones';
    list.innerHTML = '';
    sectores.forEach(function (sector) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'home-sector-picker__item';
      btn.setAttribute('role', 'option');
      btn.setAttribute('data-sector-id', sector.id);
      btn.setAttribute('aria-label', sectorAriaLabel(sector));
      btn.innerHTML =
        '<span class="home-sector-picker__emoji" aria-hidden="true">' + sector.emoji + '</span>' +
        '<span class="home-sector-picker__name">' + sector.nombre + '</span>';
      btn.addEventListener('click', function () {
        closeOtrosSectoresModal();
        iniciarFlujoOtrosSectores(sector.id);
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function openOtrosSectoresModal() {
    var modal = document.getElementById('modal-otros-sectores');
    if (!modal) return;
    buildOtrosSectoresModal();
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeOtrosSectoresModal() {
    var modal = document.getElementById('modal-otros-sectores');
    if (modal) modal.classList.remove('is-open');
    if (!document.querySelector('.home-modal.is-open')) {
      document.body.style.overflow = '';
    }
  }

  var pendingOtrosSectoresFlow = false;

  function iniciarFlujoOtrosSectores(sectorId) {
    pendingOtrosSectoresFlow = true;
    openSubcatPicker(sectorId);
  }

  function onSectorChosen(sectorId) {
    iniciarFlujoOtrosSectores(sectorId);
  }

  function bindSectoresExpandToggle() {
    var btn = document.getElementById('btnVerOtrosSectores');
    if (!btn) return;
    btn.addEventListener('click', function () {
      openOtrosSectoresModal();
    });
  }
  var selectedSectorId = '';
  var pickerSubcategorias = [];

  function buildSectorPicker() {
    var list = document.getElementById('sectorPickerList');
    var hint = document.getElementById('sectorPickerHint');
    if (!list || !SECTORES.length) return;
    if (hint) hint.textContent = SECTORES.length + ' sectores · elige uno para ver categorías';
    list.innerHTML = '';
    SECTORES.forEach(function (sector) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'home-sector-picker__item';
      btn.setAttribute('role', 'option');
      btn.setAttribute('data-sector-id', sector.id);
      btn.innerHTML =
        '<span class="home-sector-picker__emoji" aria-hidden="true">' + sector.emoji + '</span>' +
        '<span class="home-sector-picker__name">' + sector.nombre + '</span>';
      btn.addEventListener('click', function () { openSubcatPicker(sector.id, { showBack: true }); });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function buildSubcatPickerList(items, sector, opts) {
    opts = opts || {};
    var modal = document.getElementById('modal-categorias');
    var classic = document.getElementById('catPickerClassic');
    var adultos = document.getElementById('catPickerAdultos');
    var isAdultos = !!(sector && sector.id === 'adultos');

    pickerSubcategorias = items || [];

    if (modal) modal.classList.toggle('home-modal--adultos-premium', isAdultos);
    if (classic) classic.hidden = isAdultos;
    if (adultos) adultos.hidden = !isAdultos;

    if (isAdultos && window.CariHubAdultosCatPicker) {
      var titleAdultos = document.getElementById('modal-categorias-title-adultos');
      var countAdultos = document.getElementById('catPickerCountAdultos');
      var listAdultos = document.getElementById('catPickerListAdultos');
      if (titleAdultos && sector) titleAdultos.textContent = sector.nombre;
      if (countAdultos) countAdultos.textContent = pickerSubcategorias.length + ' categorías · desliza para ver todas';
      if (listAdultos) {
        window.CariHubAdultosCatPicker.renderList(listAdultos, pickerSubcategorias, {
          selectedId: selectedCategoriaId,
          onSelect: function (cat) { selectSubcategoria(cat, sector); }
        });
      }
      return;
    }

    var list = document.getElementById('catPickerList');
    var count = document.getElementById('catPickerCount');
    var title = document.getElementById('modal-categorias-title');
    var back = document.getElementById('catPickerBack');
    if (!list) return;
    if (title && sector) title.textContent = sector.emoji + ' ' + sector.nombre;
    if (count) count.textContent = pickerSubcategorias.length + ' opciones · desliza para ver todas';
    if (back) back.hidden = !opts.showBack;
    list.innerHTML = '';
    pickerSubcategorias.forEach(function (cat) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'home-cat-picker__item';
      btn.setAttribute('role', 'option');
      btn.setAttribute('data-cat-id', cat.id);
      btn.setAttribute('aria-selected', selectedCategoriaId === cat.id ? 'true' : 'false');
      if (selectedCategoriaId === cat.id) btn.classList.add('is-selected');
      var iconSvg = window.CariHubCategoriaIconos && window.CariHubCategoriaIconos.iconHtml
        ? window.CariHubCategoriaIconos.iconHtml(cat.id)
        : '';
      btn.innerHTML =
        '<span class="home-cat-picker__icon" aria-hidden="true">' + iconSvg + '</span>' +
        '<span class="home-cat-picker__name">' + cat.nombre + '</span>';
      btn.addEventListener('click', function () { selectSubcategoria(cat, sector); });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function syncCatPickerSelection() {
    var modal = document.getElementById('modal-categorias');
    if (modal && modal.classList.contains('home-modal--adultos-premium')) {
      document.querySelectorAll('#catPickerListAdultos .ap-card').forEach(function (btn) {
        var on = btn.getAttribute('data-cat-id') === selectedCategoriaId;
        btn.classList.toggle('is-selected', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
        if (on) btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
      return;
    }
    document.querySelectorAll('.home-cat-picker__item').forEach(function (btn) {
      var on = btn.getAttribute('data-cat-id') === selectedCategoriaId;
      btn.classList.toggle('is-selected', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  function selectSubcategoria(cat, sector) {
    if (!cat) return;
    var fromOtrosSectores = pendingOtrosSectoresFlow;
    pendingOtrosSectoresFlow = false;
    selectedSectorId = sector ? sector.id : selectedSectorId;
    selectedCategoriaId = cat.id;
    window.sectorSeleccionado = selectedSectorId;
    var field = document.getElementById('fieldCategoria');
    var label = document.getElementById('fieldCategoriaLabel');
    var displayName = cat.nombre;
    if (label) {
      label.textContent = displayName;
      if (field) field.classList.add('is-selected');
    }
    window.categoriaSeleccionada = displayName;
    closeSectorModal();
    closeCatPickerModal(document.getElementById('modal-categorias'));
    if (typeof window.setCategoriaHome === 'function') window.setCategoriaHome(displayName);
  }

  function selectCategoria(id) {
    var cat = pickerSubcategorias.find(function (c) { return c.id === id; }) ||
      CATEGORIAS.find(function (c) { return c.id === id; });
    var sector = window.CariHubSectores && window.CariHubSectores.sectorPorId(selectedSectorId);
    selectSubcategoria(cat, sector);
  }

  function openSectorPicker() {
    var modal = document.getElementById('modal-sectores');
    var field = document.getElementById('fieldCategoria');
    if (!modal) return openSubcatPicker('adultos');
    modal.classList.add('is-open');
    if (field) field.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function openSubcatPicker(sectorId, opts) {
    opts = opts || {};
    var sector = window.CariHubSectores && window.CariHubSectores.sectorPorId(sectorId);
    if (!sector) return;
    selectedSectorId = sectorId;
    var items = window.CariHubSectores.subcategoriasDeSector(sectorId);
    closeSectorModal();
    buildSubcatPickerList(items, sector, opts);
    var modal = document.getElementById('modal-categorias');
    var field = document.getElementById('fieldCategoria');
    if (!modal) return;
    syncCatPickerSelection();
    modal.classList.add('is-open');
    if (field) field.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function openAdultosCatPicker() {
    openSubcatPicker('adultos');
  }

  function openCatPicker() {
    openAdultosCatPicker();
  }

  function closeSectorModal() {
    var modal = document.getElementById('modal-sectores');
    if (modal) modal.classList.remove('is-open');
    if (!document.querySelector('.home-modal.is-open')) {
      document.body.style.overflow = '';
    }
  }

  function closeCatPickerModal(modal) {
    var field = document.getElementById('fieldCategoria');
    var back = document.getElementById('catPickerBack');
    if (back) back.hidden = true;
    if (modal) modal.classList.remove('home-modal--adultos-premium');
    if (field) field.setAttribute('aria-expanded', 'false');
    pendingOtrosSectoresFlow = false;
    closeModal(modal);
  }

  window.openSectorPicker = openSectorPicker;
  window.openSubcatPicker = openSubcatPicker;
  window.openAdultosCatPicker = openAdultosCatPicker;
  window.openCatPicker = openCatPicker;

  /* ── Rotación banners (izquierda, derecha e inferior — 3 slides sincronizados) ── */
  function goAdSlotSlide(stage, nextIdx) {
    if (!stage) return 0;
    var slides = stage.querySelectorAll('.home-ad-slot__slide');
    var dots = stage.querySelectorAll('.home-ad-slot__dot');
    if (!slides.length) return 0;
    var idx = ((nextIdx % slides.length) + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var on = i === idx;
      slide.classList.toggle('is-active', on);
      slide.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-on', i === idx);
    });
    return idx;
  }

  function goBottomBannerSlide(nextIdx) {
    var stage = document.getElementById('bottomBannerStage');
    if (!stage) return;
    var slides = stage.querySelectorAll('.home-ad-bottom__slide');
    var dots = stage.querySelectorAll('.home-ad-bottom__dot');
    if (!slides.length) return;
    var count = Math.min(BANNER_SLIDE_COUNT, slides.length);
    var idx = ((nextIdx % count) + count) % count;
    slides.forEach(function (slide, i) {
      var on = i === idx;
      slide.classList.toggle('is-active', on);
      slide.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-on', i === idx);
    });
    return idx;
  }

  function rotateAllHomeBanners() {
    homeBannerSlideIdx = (homeBannerSlideIdx + 1) % BANNER_SLIDE_COUNT;
    document.querySelectorAll('[data-ad-stage]').forEach(function (stage) {
      var anchor = stage.closest('[data-slot-id]');
      if (anchor && anchor.classList.contains('home-ad-slot--rented')) return;
      var slides = stage.querySelectorAll('.home-ad-slot__slide');
      if (slides.length < 2) return;
      goAdSlotSlide(stage, homeBannerSlideIdx);
    });
    var bottomAnchor = document.getElementById('bannerInferior');
    if (bottomAnchor && bottomAnchor.classList.contains('home-ad-slot--rented')) return;
    var bottomStage = document.getElementById('bottomBannerStage');
    if (!bottomStage) return;
    var bottomSlides = bottomStage.querySelectorAll('.home-ad-bottom__slide');
    if (bottomSlides.length < 2) return;
    goBottomBannerSlide(homeBannerSlideIdx);
  }

  function rotateAllHomeVisuals() {
    rotateAllCategorySlots();
    rotateAllSectorSlots();
    rotateAllHomeBanners();
  }

  function startHomeVisualRotation() {
    if (homeRotateTimer) clearInterval(homeRotateTimer);
    homeRotateTimer = setInterval(rotateAllHomeVisuals, HOME_ROTATE_MS);
  }


  /* ── Modales ── */
  function openModal(id) {
    if (id === 'registro') {
      window.location.href = 'registro-perfil.html';
      return;
    }
    var modal = document.getElementById('modal-' + id);
    if (!modal) return;
    if (id === 'mensajes') {
      updateMensajesModal();
      return;
    }
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    if (!document.querySelector('.home-modal.is-open')) {
      document.body.style.overflow = '';
    }
  }

  function updateMensajesModal() {
    if (window.CariHubHomeMensajes && CariHubHomeMensajes.abrir) {
      CariHubHomeMensajes.abrir({});
      return;
    }
    var registrado = document.body.getAttribute('data-mock-usuario') === 'registrado';
    var lead = document.getElementById('modalMensajesLead');
    var body = document.getElementById('modalMensajesBody');
    if (registrado) {
      lead.textContent = 'Ya puedes enviar mensajes.';
      body.innerHTML = '<p>Con tu perfil activo puedes escribir por mensajes internos a otras personas dentro de la plataforma, de forma privada y segura.</p>';
    } else {
      lead.textContent = 'Regístrate para contactar por mensajes internos.';
      body.innerHTML = '<p>Al crear tu cuenta podrás comunicarte por mensajes internos con todas las personas que están dentro de Cariñosas, sin salir de la plataforma.</p><p><strong>Los visitantes sin registro no pueden enviar mensajes.</strong></p>';
    }
  }

  document.querySelectorAll('[data-modal]').forEach(function (el) {
    var id = el.getAttribute('data-modal');
    if (id === 'favoritos' || id === 'registro' || id === 'avanzada') return;
    el.addEventListener('click', function () { openModal(id); });
  });

  document.querySelectorAll('.home-modal').forEach(function (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.classList.contains('home-modal__close')) {
        if (modal.id === 'modal-sectores') closeSectorModal();
        else if (modal.id === 'modal-otros-sectores') closeOtrosSectoresModal();
        else if (modal.id === 'modal-categorias') closeCatPickerModal(modal);
        else closeModal(modal);
      }
    });
  });

  document.querySelectorAll('[data-cat-picker-trigger]').forEach(function (el) {
    el.addEventListener('click', openCatPicker);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCatPicker(); }
    });
  });

  function iniciarFlujoExploraCategorias(catName) {
    if (catName && typeof window.setCategoriaHome === 'function') {
      window.setCategoriaHome(catName);
    } else if (catName) {
      window.categoriaSeleccionada = catName;
    }
  }

  document.querySelectorAll('.home-cat-card').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var catName = pickVisibleCatFromCard(btn);
      if (catName) {
        iniciarFlujoExploraCategorias(catName);
        return;
      }
      openSubcatPicker('adultos');
    });
  });

  document.querySelectorAll('.home-sector-card').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var layer = btn.querySelector('.home-sector-card__layer.is-visible');
      var id = btn.dataset.sectorId || (layer && layer.dataset.sectorId);
      if (id) onSectorChosen(id);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.home-modal.is-open').forEach(function (modal) {
        if (modal.id === 'modal-sectores') closeSectorModal();
        else if (modal.id === 'modal-otros-sectores') closeOtrosSectoresModal();
        else if (modal.id === 'modal-categorias') closeCatPickerModal(modal);
        else closeModal(modal);
      });
    }
  });

  function applyViewportClass() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    document.body.classList.remove('proto-iphone', 'proto-tablet', 'proto-tablet-h', 'proto-laptop');
    if (w >= 1100) document.body.classList.add('proto-laptop');
    else if (w >= 820 && w > h) document.body.classList.add('proto-tablet-h');
    else if (w >= 600) document.body.classList.add('proto-tablet');
    else document.body.classList.add('proto-iphone');
    rebuildHeroCopyLayers();
    resetHeroTimer();
    mountLowerSparkles();
  }

  function mountLowerSparkles() {
    var root = document.querySelector('.home-page-lower-sparkles');
    if (!root) return;
    root.innerHTML = '';
    if (!document.body.classList.contains('proto-iphone')) return;
    var lower = [
      ['flash','12%','8%','38px','-24px','.2s','3.1s','6px'],['glow','28%','14%','-34px','28px','1.1s','5.4s','7px'],
      ['chrome','46%','10%','42px','-30px','.6s','4.5s','6px'],['star','64%','16%','-40px','-26px','1.8s','4.8s','9px'],
      ['flash','82%','12%','36px','32px','2.4s','3.3s','5px'],['glow','18%','22%','44px','-34px','3.2s','5.9s','7px'],
      ['chrome','36%','26%','-38px','36px','.9s','4.2s','6px'],['star','54%','20%','48px','-22px','2.1s','5.1s','8px'],
      ['flash','72%','28%','-46px','-28px','3.8s','3.6s','5px'],['glow','90%','24%','34px','30px','1.4s','6.1s','7px'],
      ['chrome','8%','34%','-42px','24px','4.2s','4.7s','6px'],['star','24%','38%','40px','-38px','2.7s','4.9s','9px'],
      ['flash','42%','32%','-36px','-32px','.4s','3.4s','5px'],['glow','58%','40%','46px','26px','3.5s','5.6s','7px'],
      ['chrome','76%','36%','-44px','-20px','1.7s','4.4s','6px'],['star','92%','42%','32px','-42px','2.9s','5.2s','8px'],
      ['flash','16%','48%','-50px','18px','4.6s','3.2s','5px'],['glow','34%','52%','38px','-28px','1.2s','6s','7px'],
      ['chrome','52%','46%','-34px','34px','3.1s','4.6s','6px'],['star','68%','54%','42px','-24px','2.2s','4.7s','9px'],
      ['flash','86%','50%','-40px','-30px','.8s','3.5s','5px'],['glow','48%','30%','-28px','40px','5s','5.8s','8px'],
      ['flash','6%','44%','30px','22px','2.5s','3.8s','6px'],['star','38%','56%','-32px','28px','3.7s','4.3s','10px'],
      ['chrome','62%','60%','36px','-36px','1.9s','5.3s','7px'],['glow','22%','62%','44px','30px','4.1s','5.7s','8px'],
      ['flash','78%','66%','-36px','26px','2.8s','3.9s','6px'],['star','50%','70%','40px','-32px','1.5s','4.6s','9px']
    ];
    lower.forEach(function (row) {
      var el = document.createElement('span');
      el.className = 'home-hero__spark home-hero__spark--' + row[0];
      el.setAttribute('style', '--x:' + row[1] + ';--y:' + row[2] + ';--dx:' + row[3] + ';--dy:' + row[4] + ';--d:' + row[5] + ';--dur:' + row[6] + ';--sz:' + row[7]);
      root.appendChild(el);
    });
  }

  document.body.setAttribute('data-logo-sil', 's1');
  var logoSil = document.getElementById('logoSilhouette');
  if (logoSil) logoSil.removeAttribute('hidden');

  applyViewportClass();
  window.addEventListener('resize', applyViewportClass);

  buildSectorPicker();
  var catPickerBack = document.getElementById('catPickerBack');
  if (catPickerBack) {
    catPickerBack.addEventListener('click', function () {
      closeCatPickerModal(document.getElementById('modal-categorias'));
      openSectorPicker();
    });
  }
  function escAttr(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function applyHomeSlotRental(anchor, slotId, rental) {
    if (!anchor || !rental || !rental.imagen) return false;
    var href = rental.url || ('registro-banner.html?slot=' + encodeURIComponent(slotId));
    var titulo = rental.titulo || 'Anuncio';
    anchor.href = href;
    anchor.setAttribute('aria-label', titulo);
    anchor.classList.add('home-ad-slot--rented');

    var stage = anchor.querySelector('.home-ad-slot__stage, .home-ad-bottom__stage');
    if (!stage) return false;

    var isBottom = stage.classList.contains('home-ad-bottom__stage');
    var slideClass = isBottom ? 'home-ad-bottom__slide' : 'home-ad-slot__slide';
    var imgClass = isBottom ? 'home-ad-bottom__art' : 'home-ad-slot__art';

    stage.innerHTML =
      '<div class="' + slideClass + ' is-active" aria-hidden="false">' +
        '<img class="' + imgClass + '" src="' + escAttr(rental.imagen) + '" alt="' + escAttr(titulo) + '" decoding="async">' +
      '</div>';

    return true;
  }

  function remontarHomeAdSlots() {
    var rentals = window.CARIHUB_HOME_SLOT_RENTALS || {};
    var map = [
      { slotId: 'home_izquierda', selector: '[data-slot-id="home_izquierda"]' },
      { slotId: 'home_derecha', selector: '[data-slot-id="home_derecha"]' },
      { slotId: 'home_inferior', selector: '[data-slot-id="home_inferior"]' }
    ];

    map.forEach(function (row) {
      var rental = rentals[row.slotId];
      if (!rental) return;
      var anchor = document.querySelector(row.selector);
      applyHomeSlotRental(anchor, row.slotId, rental);
    });

    var catRental = rentals.home_categorias;
    if (catRental && catRental.imagen) {
      var catAnuncio = document.querySelector('.home-adultos-picker__anuncio');
      if (catAnuncio) {
        catAnuncio.href = catRental.url || 'registro-banner.html?slot=home_categorias';
        var catImg = catAnuncio.querySelector('img');
        if (catImg) {
          catImg.src = catRental.imagen;
          catImg.alt = catRental.titulo || 'Anúnciate aquí';
        }
      }
    }
  }

  function remontarPublicidadHome() {
    initHeroCarousel();
    remontarHomeAdSlots();
    if (window.CariHubBannerHomeLaterales && CariHubBannerHomeLaterales.mount) {
      CariHubBannerHomeLaterales.mount();
    }
  }

  window.CariHubHomeUI = {
    remontarPublicidad: remontarPublicidadHome,
    openModal: openModal,
    closeModal: closeModal
  };

  initHeroCarousel();
  initCategorySlots();
  initSectorCards();
  buildOtrosSectoresModal();
  bindSectoresExpandToggle();
  startHomeVisualRotation();

})();
