/**
 * Buscador de categorías/subcategorías — compartido (registro-perfil + Home «Ver otras categorías»).
 */
(function (global) {
  'use strict';

  var ICON_GO = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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
    mecanico: ['mecanico', 'mecanicos', 'taller', 'automotriz', 'automotrices', 'auto'],
    cirujano: ['cirujano', 'cirujanos', 'cirugia', 'plastico', 'plastica', 'estetica', 'estetico'],
    cirugia: ['cirugia', 'cirujano', 'plastica', 'estetica'],
    plastico: ['plastico', 'plastica', 'estetica', 'cirugia', 'cirujano'],
    estetica: ['estetica', 'estetico', 'plastica', 'cirugia', 'belleza']
  };

  var subcatIndexCache = null;

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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

  function getSubcatIndex(opts) {
    opts = opts || {};
    if (!opts.excludeAdultos && subcatIndexCache) return subcatIndexCache;
    var index = [];
    if (!global.CARIHUB_SECTORES || !global.CariHubSectores) return index;
    global.CARIHUB_SECTORES.forEach(function (sector) {
      if (opts.excludeAdultos && sector.id === 'adultos') return;
      var subs = global.CariHubSectores.subcategoriasDeSector(sector.id) || [];
      subs.forEach(function (sub) {
        index.push({
          sector: sector,
          sub: sub,
          haystack: norm(sector.nombre + ' ' + sub.nombre)
        });
      });
    });
    if (!opts.excludeAdultos) subcatIndexCache = index;
    return index;
  }

  function searchCatalog(query, opts) {
    opts = opts || {};
    var tokens = expandSearchTokens(query);
    var subHits = [];
    var sectorHits = [];
    if (!tokens.length) {
      return { tokens: tokens, subHits: subHits, sectorHits: sectorHits };
    }
    getSubcatIndex(opts).forEach(function (row) {
      var score = scoreHaystack(row.haystack, tokens);
      if (score > 0) subHits.push({ sector: row.sector, sub: row.sub, score: score });
    });
    subHits.sort(function (a, b) { return b.score - a.score; });
    if (global.CARIHUB_SECTORES) {
      global.CARIHUB_SECTORES.forEach(function (sector) {
        if (opts.excludeAdultos && sector.id === 'adultos') return;
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

  function sectorImageMeta(sectorId) {
    if (global.CariHubSectorCatalogUI && CariHubSectorCatalogUI.sectorImageMeta) {
      return CariHubSectorCatalogUI.sectorImageMeta(sectorId);
    }
    if (global.CariHubSectorCardImages && CariHubSectorCardImages.getSectorCardImage) {
      return CariHubSectorCardImages.getSectorCardImage(sectorId) || { src: 'img/home/promo-perfil.jpg' };
    }
    return { src: 'img/home/promo-perfil.jpg' };
  }

  function buildSectorImageHtml(meta) {
    if (global.CariHubSectorCatalogUI && CariHubSectorCatalogUI.buildSectorImageHtml) {
      return CariHubSectorCatalogUI.buildSectorImageHtml(meta);
    }
    return '<img class="rp-sector-card__img" src="' + esc(meta.src) + '" alt="" loading="lazy" decoding="async">';
  }

  function buildSectorWatermarkHtml(sectorId) {
    if (global.CariHubSectorCategoryWatermarks && CariHubSectorCategoryWatermarks.buildHtml) {
      return CariHubSectorCategoryWatermarks.buildHtml(sectorId);
    }
    return '';
  }

  function sectorNameHtml(sector) {
    if (global.CariHubSectorCatalogUI && CariHubSectorCatalogUI.sectorNameHtml) {
      return CariHubSectorCatalogUI.sectorNameHtml(sector);
    }
    return esc(sector && sector.nombre ? sector.nombre : '');
  }

  function tipoPerfilLabel(subcatId) {
    if (!subcatId) return 'Perfil';
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolvePublicPresentation) {
      var pres = CariHubFieldEngineLite.resolvePublicPresentation({ subcategoriaId: subcatId });
      if (pres && pres.registro && pres.registro.ui && pres.registro.ui.titulo) {
        return pres.registro.ui.titulo;
      }
    }
    return 'Perfil';
  }

  function sortSectors(sectors) {
    if (global.CariHubSectorCatalogUI && CariHubSectorCatalogUI.sortSectors) {
      return CariHubSectorCatalogUI.sortSectors(sectors, { excludeAdultos: true });
    }
    return sectors.filter(function (s) { return s.id !== 'adultos'; });
  }

  function mount(cfg) {
    cfg = cfg || {};
    var ids = cfg.ids || {};
    var mode = cfg.mode || 'browse';
    var excludeAdultos = cfg.excludeAdultos !== false && mode === 'browse';

    function el(id) {
      return document.getElementById(id);
    }

    var input = el(ids.input);
    if (!input || input.dataset.catSearchBound === '1') return { clear: function () {} };
    input.dataset.catSearchBound = '1';

    var bar = el(ids.bar);
    var submitBtn = el(ids.submit);
    var hintEl = el(ids.hint);
    var suggestBox = el(ids.suggest);
    var panel = el(ids.panel);
    var catalog = el(ids.catalog);

    var hintDefault = cfg.hintDefault ||
      (mode === 'register' ? 'Publicar perfil · sugerencias mientras escribes' : 'Explorar categorías · sugerencias mientras escribes');
    var hintActive = cfg.hintActive ||
      (mode === 'register' ? 'Elige un resultado o continúa registro si no está en el catálogo' : 'Elige un resultado para continuar');
    var panelMetaSuffix = mode === 'register' ? ' · publicar perfil' : ' · elige para buscar';

    function setActive(active) {
      document.body.classList.toggle('rp-cat-search-active', !!active);
      document.body.classList.toggle('rp-cat-search-typing', false);
      if (hintEl) {
        hintEl.textContent = active ? hintActive : hintDefault;
      }
    }

    function hideSuggest() {
      if (!suggestBox) return;
      suggestBox.innerHTML = '';
      suggestBox.classList.add('rp-hidden');
      document.body.classList.remove('rp-cat-search-typing');
    }

    function syncBarState() {
      var hasText = !!(input && String(input.value || '').trim());
      if (bar) bar.classList.toggle('has-text', hasText);
      if (submitBtn) submitBtn.classList.toggle('rp-hidden', !hasText);
    }

    function clearSearch(focusInput) {
      if (input) input.value = '';
      hideSuggest();
      if (panel) {
        panel.innerHTML = '';
        panel.classList.add('rp-hidden');
        panel.classList.remove('rp-cat0-search-panel--solicitud');
      }
      syncBarState();
      setActive(false);
      if (focusInput && input) input.focus();
    }

    function buildPanelHead(metaText) {
      var head = document.createElement('div');
      head.className = 'rp-cat0-search-panel__head';
      head.innerHTML =
        '<div>' +
          '<p class="rp-cat0-search-panel__title">Resultados</p>' +
          '<p class="rp-cat0-search-panel__meta">' + esc(metaText) + '</p>' +
        '</div>' +
        '<button type="button" class="rp-cat0-search-panel__clear">Limpiar</button>';
      head.querySelector('.rp-cat0-search-panel__clear').addEventListener('click', function () {
        clearSearch(true);
      });
      return head;
    }

    function buildHitButton(sector, sub) {
      var imgMeta = sectorImageMeta(sector.id);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rp-cat0-search-hit';
      var thumbStyle = imgMeta.bg ? ' style="background:' + esc(imgMeta.bg) + '"' : '';
      btn.innerHTML =
        '<span class="rp-cat0-search-hit__thumb"' + thumbStyle + '>' + buildSectorImageHtml(imgMeta) + '</span>' +
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
        clearSearch(false);
        if (typeof cfg.onPickSubcat === 'function') cfg.onPickSubcat(sector, sub);
      });
      return btn;
    }

    function buildSectorHitButton(sector) {
      var subs = global.CariHubSectores && global.CariHubSectores.subcategoriasDeSector
        ? global.CariHubSectores.subcategoriasDeSector(sector.id)
        : [];
      var imgMeta = sectorImageMeta(sector.id);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rp-cat0-search-hit';
      var thumbStyle = imgMeta.bg ? ' style="background:' + esc(imgMeta.bg) + '"' : '';
      btn.innerHTML =
        '<span class="rp-cat0-search-hit__thumb"' + thumbStyle + '>' + buildSectorImageHtml(imgMeta) + '</span>' +
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
        clearSearch(false);
        if (typeof cfg.onPickSector === 'function') cfg.onPickSector(sector);
      });
      return btn;
    }

    function renderBrowseEmpty(query) {
      var wrap = document.createElement('div');
      wrap.className = 'rp-cat0-search-empty';
      wrap.innerHTML =
        '<div class="rp-cat0-search-empty__query">' + esc(query) + '</div>' +
        '<p class="rp-cat0-search-empty__lead">No encontramos coincidencias. Prueba otra palabra o explora las categorías abajo.</p>';
      return wrap;
    }

    function renderPanel(query) {
      if (!panel) return;
      query = String(query || '').trim();
      if (!query) {
        clearSearch(false);
        return;
      }
      syncBarState();
      setActive(true);
      panel.classList.remove('rp-hidden');
      panel.innerHTML = '';

      var result = searchCatalog(query, { excludeAdultos: excludeAdultos });
      var total = result.subHits.length + result.sectorHits.length;

      if (!total) {
        panel.classList.add('rp-cat0-search-panel--solicitud');
        panel.appendChild(buildPanelHead('Sin coincidencias'));
        panel.appendChild(renderBrowseEmpty(query));
        return;
      }

      panel.classList.remove('rp-cat0-search-panel--solicitud');
      panel.appendChild(buildPanelHead(
        total + (total === 1 ? ' coincidencia' : ' coincidencias') + panelMetaSuffix
      ));

      if (result.subHits.length) {
        var list = document.createElement('ul');
        list.className = 'rp-cat0-search-results';
        result.subHits.forEach(function (hit) {
          var li = document.createElement('li');
          li.appendChild(buildHitButton(hit.sector, hit.sub));
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
          li.appendChild(buildSectorHitButton(hit.sector));
          sectorList.appendChild(li);
        });
        panel.appendChild(sectorList);
      }
    }

    function renderSuggestions(query) {
      if (!suggestBox) return;
      if (panel && !panel.classList.contains('rp-hidden')) {
        hideSuggest();
        return;
      }
      query = String(query || '').trim();
      if (!query) {
        hideSuggest();
        return;
      }

      document.body.classList.add('rp-cat-search-typing');
      suggestBox.classList.remove('rp-hidden');
      suggestBox.innerHTML = '';

      var label = document.createElement('p');
      label.className = 'rp-cat0-search-suggest__label';
      label.textContent = 'Sugerencias';
      suggestBox.appendChild(label);

      var result = searchCatalog(query, { excludeAdultos: excludeAdultos });
      if (!result.subHits.length) {
        var hint = document.createElement('p');
        hint.className = 'rp-cat0-search-suggest__hint';
        hint.innerHTML = 'Ninguna coincide · pulsa la <strong>lupa</strong> para ver resultados de «' + esc(query) + '»';
        suggestBox.appendChild(hint);
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
          clearSearch(false);
          if (typeof cfg.onPickSubcat === 'function') cfg.onPickSubcat(hit.sector, hit.sub);
        });
        li.appendChild(btn);
        list.appendChild(li);
      });
      suggestBox.appendChild(list);

      var foot = document.createElement('p');
      foot.className = 'rp-cat0-search-suggest__foot';
      foot.textContent = '¿No es ninguna? Pulsa la lupa →';
      suggestBox.appendChild(foot);
    }

    function runSearch() {
      var query = String(input.value || '').trim();
      if (!query) {
        if (global.CariHubUiNotices && CariHubUiNotices.showInfoModal) {
          CariHubUiNotices.showInfoModal({ message: 'Escribe el nombre de tu negocio o subcategoría.' });
        } else {
          alert('Escribe el nombre de tu negocio o subcategoría.');
        }
        input.focus();
        return;
      }
      hideSuggest();
      renderPanel(query);
    }

    input.addEventListener('input', function () {
      syncBarState();
      renderSuggestions(this.value);
    });
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        runSearch();
      }
      if (ev.key === 'Escape') clearSearch(true);
    });
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        runSearch();
      });
    }
    syncBarState();

    return {
      clear: clearSearch,
      search: runSearch
    };
  }

  global.CariHubSectorCatSearch = {
    searchCatalog: searchCatalog,
    mount: mount
  };
})(typeof window !== 'undefined' ? window : globalThis);
