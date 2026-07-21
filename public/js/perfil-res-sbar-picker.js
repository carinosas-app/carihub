/**
 * Perfil — picker «Cambiar búsqueda» (categoría / país / estado / ciudad).
 * Misma UX y temas por subcategoría que Resultados, sin tocar resultados.html.
 * IDs: perfilSbar* + #perfilSbarPicker
 */
(function (global) {
  'use strict';

  var openField = null;
  var entriesCache = null;
  var wired = false;

  var IDS = {
    cat: 'perfilSbarCat',
    pais: 'perfilSbarPais',
    estado: 'perfilSbarEstado',
    ciudad: 'perfilSbarCiudad'
  };
  var LBL = {
    cat: 'perfilSbarCatLabel',
    pais: 'perfilSbarPaisLabel',
    estado: 'perfilSbarEstadoLabel',
    ciudad: 'perfilSbarCiudadLabel'
  };

  var PICKER_W = 268;
  var PICKER_H = 286;
  var PICKER_H_GEO = 318;

  function safeTxt(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function selectEl(field) {
    return document.getElementById(IDS[field] || '');
  }

  function categoriaActiva() {
    var cat = selectEl('cat');
    if (cat && cat.value) return cat.value;
    var q = global.CariHubPerfilPublico && CariHubPerfilPublico.queryPerfilPublico
      ? CariHubPerfilPublico.queryPerfilPublico()
      : {};
    return q.categoria || '';
  }

  function sectorActivo() {
    if (global.CariHubResultadosSector && CariHubResultadosSector.sectorDeCategoria) {
      return CariHubResultadosSector.sectorDeCategoria(categoriaActiva()) || 'adultos';
    }
    return document.body.getAttribute('data-sector') || 'adultos';
  }

  function paisesLista() {
    if (typeof TODOS_LOS_PAISES !== 'undefined' && TODOS_LOS_PAISES.length) {
      return TODOS_LOS_PAISES.slice();
    }
    if (typeof PAISES_PRINCIPALES !== 'undefined' && PAISES_PRINCIPALES.length) {
      return PAISES_PRINCIPALES.slice();
    }
    return ['México'];
  }

  function estadosDePais(pais) {
    if (typeof ESTADOS !== 'undefined' && ESTADOS[pais]) return ESTADOS[pais].slice();
    return [];
  }

  function ciudadesDe(pais, estado) {
    if (typeof CIUDADES !== 'undefined' && CIUDADES[pais] && CIUDADES[pais][estado]) {
      return CIUDADES[pais][estado].slice();
    }
    return [];
  }

  function fillSelect(el, items, selected) {
    if (!el) return;
    var list = items && items.length ? items : ['—'];
    var sel = selected && list.indexOf(selected) >= 0 ? selected : list[0];
    el.innerHTML = list.map(function (v) {
      return '<option value="' + safeTxt(v) + '"' + (v === sel ? ' selected' : '') + '>' + safeTxt(v) + '</option>';
    }).join('');
    el.value = sel;
  }

  function fillSelectOpcional(el, items, selected, placeholder) {
    if (!el) return;
    var ph = placeholder || 'Todos';
    var opts = [{ v: '', t: ph }];
    (items || []).forEach(function (v) { opts.push({ v: v, t: v }); });
    var sel = selected != null ? selected : '';
    el.innerHTML = opts.map(function (o) {
      return '<option value="' + safeTxt(o.v) + '"' + (o.v === sel ? ' selected' : '') + '>' + safeTxt(o.t) + '</option>';
    }).join('');
    el.value = sel;
  }

  function fillSelectEntries(el, entries, selectedValue) {
    if (!el || !entries || !entries.length) return;
    var sel = String(selectedValue || '').trim();
    var match = entries.find(function (e) { return e.value === sel || e.label === sel; });
    if (!match && global.CariHubCatalogos && CariHubCatalogos.labelCategoria && sel) {
      var resolved = CariHubCatalogos.labelCategoria(sel);
      match = entries.find(function (e) { return e.value === resolved || e.label === resolved; });
      if (match) sel = match.value;
    }
    if (!match) sel = entries[0].value;
    el.innerHTML = entries.map(function (e) {
      return '<option value="' + safeTxt(e.value) + '"' + (e.value === sel ? ' selected' : '') + '>' + safeTxt(e.label) + '</option>';
    }).join('');
    el.value = sel;
  }

  function sbarCategoriasDeSchema(sectorId) {
    var idx = global.CARIHUB_REGISTRO_SCHEMA_INDEX;
    if (!idx || !idx.byId) return [];
    var out = [];
    var vistos = {};
    Object.keys(idx.byId).forEach(function (k) {
      var row = idx.byId[k];
      if (!row || row.sectorId !== sectorId) return;
      var val = String(row.subcategoriaId || '').trim();
      if (!val || vistos[val]) return;
      vistos[val] = true;
      out.push({ value: val, label: String(row.subcategoria || val).trim() });
    });
    out.sort(function (a, b) { return a.label.localeCompare(b.label, 'es'); });
    return out;
  }

  function sbarCategoriasEntries() {
    var entries = [];
    var sectorId = sectorActivo();
    if (sectorId && sectorId !== 'adultos') {
      entries = sbarCategoriasDeSchema(sectorId);
    }
    if (!entries.length && global.CariHubCatalogos && CariHubCatalogos.categorias) {
      CariHubCatalogos.categorias().forEach(function (c) {
        entries.push({ value: c.label, label: c.label });
      });
    }
    if (!entries.length) {
      ['Cariñosas', 'Masajes', 'Stripper'].forEach(function (v) {
        entries.push({ value: v, label: v });
      });
    }
    var sel = categoriaActiva();
    if (sel && !entries.some(function (e) { return e.value === sel || e.label === sel; })) {
      var lbl = sel;
      if (global.CariHubCatalogos && CariHubCatalogos.labelCategoria) {
        lbl = CariHubCatalogos.labelCategoria(sel) || sel;
      }
      entries.unshift({ value: sel, label: lbl });
    }
    return entries;
  }

  function pickerEntries(field) {
    var entries = [];
    if (field === 'cat') return sbarCategoriasEntries();
    if (field === 'pais') {
      paisesLista().forEach(function (v) { entries.push({ value: v, label: v }); });
      return entries;
    }
    if (field === 'estado') {
      entries.push({ value: '', label: 'Todos los estados' });
      var pais = selectEl('pais');
      var paisVal = pais ? pais.value : 'México';
      var estadoEl = selectEl('estado');
      var estSel = estadoEl ? estadoEl.value : '';
      estadosDePais(paisVal).forEach(function (v) { entries.push({ value: v, label: v }); });
      if (estSel && !entries.some(function (e) { return e.value === estSel; })) {
        entries.push({ value: estSel, label: estSel });
      }
      return entries;
    }
    if (field === 'ciudad') {
      entries.push({ value: '', label: 'Todas las ciudades' });
      var paisEl = selectEl('pais');
      var estadoEl2 = selectEl('estado');
      var ciudadEl = selectEl('ciudad');
      var paisVal2 = paisEl ? paisEl.value : 'México';
      var estVal = estadoEl2 ? estadoEl2.value : '';
      var ciuSel = ciudadEl ? ciudadEl.value : '';
      if (estVal) {
        ciudadesDe(paisVal2, estVal).forEach(function (v) { entries.push({ value: v, label: v }); });
      }
      if (ciuSel && !entries.some(function (e) { return e.value === ciuSel; })) {
        entries.push({ value: ciuSel, label: ciuSel });
      }
      return entries;
    }
    return entries;
  }

  function syncLabels() {
    Object.keys(IDS).forEach(function (field) {
      var el = selectEl(field);
      var lbl = document.getElementById(LBL[field]);
      if (!el || !lbl) return;
      var opt = el.options[el.selectedIndex];
      var txt = opt && opt.textContent ? opt.textContent.trim() : '';
      var empty = { cat: 'Categoría', pais: 'País', estado: 'Todos', ciudad: 'Todas' }[field];
      lbl.textContent = txt || empty;
    });
  }

  function refreshOpciones(clearUbic) {
    var pais = selectEl('pais');
    var estado = selectEl('estado');
    var ciudad = selectEl('ciudad');
    if (!pais || !estado || !ciudad) return;
    if (clearUbic) {
      estado.value = '';
      ciudad.value = '';
    }
    var estSel = estado.value || '';
    var estados = estadosDePais(pais.value);
    if (estSel && estados.indexOf(estSel) < 0) estados.unshift(estSel);
    fillSelectOpcional(estado, estados, estSel, 'Todos los estados');
    var est = estado.value || '';
    var ciudades = est ? ciudadesDe(pais.value, est) : [];
    var ciuSel = ciudad.value || '';
    if (ciuSel && ciudades.indexOf(ciuSel) < 0) ciudades.unshift(ciuSel);
    fillSelectOpcional(ciudad, ciudades, ciuSel, 'Todas las ciudades');
    syncLabels();
  }

  function fieldUsaBuscador(field) {
    return field === 'pais' || field === 'estado' || field === 'ciudad';
  }

  function fieldAdmiteManual(field) {
    return field === 'estado' || field === 'ciudad';
  }

  function pickerHeight(field) {
    return fieldUsaBuscador(field) ? PICKER_H_GEO : PICKER_H;
  }

  function mountSheen() {
    var host = document.getElementById('perfilSbarPickerSheen');
    if (!host || host.dataset.mounted === '1') return;
    var sector = sectorActivo();
    var esLgbt = document.body.getAttribute('data-subtema') === 'lgbt';
    var esAdultos = sector === 'adultos' && !esLgbt;
    if (esAdultos && global.CariHubPinkSheen && CariHubPinkSheen.htmlDestellosRosaCarihub) {
      var capa = document.createElement('div');
      capa.className = 'res-sbar-picker__destellos carihub-pink-sheen__destellos';
      capa.setAttribute('aria-hidden', 'true');
      capa.innerHTML = CariHubPinkSheen.htmlDestellosRosaCarihub();
      host.appendChild(capa);
    } else if (global.CariHubSectorSparkles && CariHubSectorSparkles.ensureLayer) {
      CariHubSectorSparkles.ensureLayer(host, esLgbt ? 'lgbt' : sector);
    }
    host.dataset.mounted = '1';
  }

  function syncPickerTheme() {
    var picker = document.getElementById('perfilSbarPicker');
    var panel = picker ? picker.querySelector('.res-sbar-picker__panel') : null;
    if (!panel) return;
    var sector = sectorActivo();
    var esLgbt = document.body.getAttribute('data-subtema') === 'lgbt';
    var esAdultos = sector === 'adultos' && !esLgbt;
    panel.classList.toggle('carihub-pink-sheen', esAdultos);
    panel.classList.toggle('res-sbar-picker__panel--lgbt', esLgbt);
    panel.classList.toggle('res-sbar-picker__panel--sector', !esAdultos && !esLgbt);
    if (esLgbt) panel.setAttribute('data-subtema', 'lgbt');
    else panel.removeAttribute('data-subtema');
    if (sector && !esLgbt) panel.setAttribute('data-sector', sector);
    else if (esLgbt) panel.setAttribute('data-sector', 'adultos');
    else panel.removeAttribute('data-sector');
    var sheen = document.getElementById('perfilSbarPickerSheen');
    if (sheen && sheen.dataset.mounted === '1') {
      sheen.innerHTML = '';
      sheen.dataset.mounted = '0';
      mountSheen();
    }
  }

  function closePicker() {
    var picker = document.getElementById('perfilSbarPicker');
    if (!picker) return;
    picker.hidden = true;
    picker.setAttribute('aria-hidden', 'true');
    openField = null;
    entriesCache = null;
    var searchWrap = document.getElementById('perfilSbarPickerSearch');
    var searchInput = document.getElementById('perfilSbarPickerInput');
    if (searchWrap) searchWrap.hidden = true;
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('#perfilSearchDock .res-sbar-btn[data-sbar-field]').forEach(function (btn) {
      btn.classList.remove('is-picker-open');
    });
  }

  function syncSearch(field) {
    var wrap = document.getElementById('perfilSbarPickerSearch');
    var input = document.getElementById('perfilSbarPickerInput');
    if (!wrap || !input) return;
    var show = fieldUsaBuscador(field);
    wrap.hidden = !show;
    if (!show) {
      input.value = '';
      return;
    }
    var placeholders = {
      pais: 'Buscar país…',
      estado: 'Buscar o escribir estado…',
      ciudad: 'Buscar o escribir ciudad…'
    };
    input.placeholder = placeholders[field] || 'Buscar…';
    input.setAttribute('aria-label', placeholders[field] || 'Buscar');
    input.value = '';
  }

  function renderList(field, entries, current, query) {
    var list = document.getElementById('perfilSbarPickerList');
    if (!list) return;
    list.innerHTML = '';
    query = String(query || '').trim().toLowerCase();

    if (field === 'ciudad') {
      var estadoPick = selectEl('estado');
      if (!estadoPick || !estadoPick.value) {
        list.innerHTML = '<li class="res-sbar-picker__empty">Selecciona un estado para ver municipios.</li>';
        return;
      }
    }

    if (!entries || !entries.length) {
      list.innerHTML = query && fieldAdmiteManual(field)
        ? '<li class="res-sbar-picker__empty">Sin coincidencias. Presiona Enter para usar «' + safeTxt(query) + '».</li>'
        : '<li class="res-sbar-picker__empty">No hay opciones disponibles.</li>';
      return;
    }

    var filtered = entries;
    if (query) {
      filtered = entries.filter(function (entry) {
        return String(entry.label || entry.value || '').toLowerCase().indexOf(query) >= 0;
      });
    }

    if (!filtered.length) {
      list.innerHTML = query && fieldAdmiteManual(field)
        ? '<li class="res-sbar-picker__empty">Sin coincidencias. Presiona Enter para usar «' + safeTxt(query) + '».</li>'
        : '<li class="res-sbar-picker__empty">No hay resultados para «' + safeTxt(query) + '».</li>';
      return;
    }

    filtered.forEach(function (entry) {
      var li = document.createElement('li');
      li.setAttribute('role', 'presentation');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'res-sbar-picker__item' + (entry.value === current ? ' is-selected' : '');
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', entry.value === current ? 'true' : 'false');
      btn.textContent = entry.label;
      btn.dataset.value = entry.value;
      btn.addEventListener('click', function () { commitValue(field, entry.value); });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function positionPicker(anchor, panel) {
    if (!anchor || !panel) return;
    var rect = anchor.getBoundingClientRect();
    var panelW = PICKER_W;
    var panelH = openField ? pickerHeight(openField) : PICKER_H;
    var gap = 10;
    var left = rect.left + (rect.width - panelW) / 2;
    var top = rect.top - panelH - gap;
    if (top < 8) top = rect.bottom + gap;
    left = Math.max(8, Math.min(left, window.innerWidth - panelW - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - panelH - 8));
    panel.style.left = Math.round(left) + 'px';
    panel.style.top = Math.round(top) + 'px';
    panel.style.height = panelH + 'px';
    panel.style.minHeight = panelH + 'px';
    panel.style.maxHeight = panelH + 'px';
  }

  function commitValue(field, valor) {
    valor = String(valor == null ? '' : valor).trim();
    var select = selectEl(field);
    if (!select) return;
    if (valor) {
      var existe = Array.prototype.some.call(select.options, function (o) { return o.value === valor; });
      if (!existe) {
        var opt = document.createElement('option');
        opt.value = valor;
        opt.textContent = valor;
        select.appendChild(opt);
      }
    }
    select.value = valor;
    try {
      select.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (e) {
      var ev = document.createEvent('Event');
      ev.initEvent('change', true, true);
      select.dispatchEvent(ev);
    }
    if (field === 'cat' && global.CariHubResultadosSector && CariHubResultadosSector.aplicarTemaSector) {
      CariHubResultadosSector.aplicarTemaSector(valor);
      if (global.CariHubResultadosSector.syncPageSheen) {
        var sec = sectorActivo();
        var lgbt = document.body.getAttribute('data-subtema') === 'lgbt';
        CariHubResultadosSector.syncPageSheen(sec, lgbt ? 'escort gay' : valor);
      }
    }
    syncLabels();
    closePicker();
  }

  function openPicker(field, anchor) {
    var picker = document.getElementById('perfilSbarPicker');
    var list = document.getElementById('perfilSbarPickerList');
    var title = document.getElementById('perfilSbarPickerTitle');
    var select = selectEl(field);
    if (!picker || !list || !select || !anchor) return;

    syncPickerTheme();
    mountSheen();
    syncSearch(field);

    var titles = {
      cat: 'Categoría',
      pais: 'País',
      estado: 'Estado',
      ciudad: 'Ciudad / Municipio'
    };
    if (title) title.textContent = titles[field] || 'Elegir';

    var entries = pickerEntries(field);
    entriesCache = entries;
    renderList(field, entries, select.value, '');

    document.querySelectorAll('#perfilSearchDock .res-sbar-btn[data-sbar-field]').forEach(function (btn) {
      btn.classList.toggle('is-picker-open', btn === anchor);
    });

    openField = field;
    picker.hidden = false;
    picker.setAttribute('aria-hidden', 'false');
    var panel = picker.querySelector('.res-sbar-picker__panel');
    requestAnimationFrame(function () {
      positionPicker(anchor, panel);
      var searchInput = document.getElementById('perfilSbarPickerInput');
      if (searchInput && fieldUsaBuscador(field)) {
        try { searchInput.focus({ preventScroll: true }); } catch (e) { searchInput.focus(); }
      }
    });
    var selectedBtn = list.querySelector('.res-sbar-picker__item.is-selected');
    if (selectedBtn && typeof selectedBtn.scrollIntoView === 'function') {
      selectedBtn.scrollIntoView({ block: 'nearest' });
    }
  }

  function pintarSelects(seed) {
    seed = seed || {};
    var cat = selectEl('cat');
    var pais = selectEl('pais');
    if (!cat || !pais) return;
    fillSelectEntries(cat, sbarCategoriasEntries(), seed.categoria || cat.value || 'Cariñosas');
    fillSelect(pais, paisesLista(), seed.pais || pais.value || 'México');
    var estado = selectEl('estado');
    var ciudad = selectEl('ciudad');
    var paisVal = pais.value || 'México';
    if (estado) {
      var estados = estadosDePais(paisVal);
      var estSel = seed.estado != null ? seed.estado : (estado.value || '');
      if (estSel && estados.indexOf(estSel) < 0) estados.unshift(estSel);
      fillSelectOpcional(estado, estados, estSel || '', 'Todos los estados');
    }
    if (ciudad) {
      var estVal = estado ? estado.value : '';
      var ciudades = estVal ? ciudadesDe(paisVal, estVal) : [];
      var ciuSel = seed.ciudad != null ? seed.ciudad : (ciudad.value || '');
      if (ciuSel && ciudades.indexOf(ciuSel) < 0) ciudades.unshift(ciuSel);
      fillSelectOpcional(ciudad, ciudades, ciuSel || '', 'Todas las ciudades');
    }
    syncLabels();
  }

  function wireOnce() {
    if (wired) return;
    wired = true;
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('#perfilSearchDock .res-sbar-btn[data-sbar-field]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      var field = btn.getAttribute('data-sbar-field');
      if (!field) return;
      var picker = document.getElementById('perfilSbarPicker');
      if (openField === field && picker && !picker.hidden) {
        closePicker();
        return;
      }
      openPicker(field, btn);
    }, true);
    document.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('[data-perfil-sbar-picker-close]')) {
        closePicker();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePicker();
    });
    window.addEventListener('resize', function () {
      if (!openField) return;
      var anchor = document.querySelector('#perfilSearchDock .res-sbar-btn[data-sbar-field="' + openField + '"]');
      var panel = document.querySelector('#perfilSbarPicker .res-sbar-picker__panel');
      if (anchor && panel) positionPicker(anchor, panel);
    });

    var searchInput = document.getElementById('perfilSbarPickerInput');
    var searchGo = document.getElementById('perfilSbarPickerGo');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        if (!openField) return;
        var select = selectEl(openField);
        renderList(openField, entriesCache || pickerEntries(openField), select ? select.value : '', searchInput.value);
      });
      searchInput.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' || !openField) return;
        e.preventDefault();
        var val = searchInput.value.trim();
        if (!val) return;
        if (fieldAdmiteManual(openField)) {
          commitValue(openField, val);
          return;
        }
        if (openField === 'pais') {
          var entries = entriesCache || pickerEntries('pais');
          var match = entries.find(function (entry) {
            return String(entry.label || '').toLowerCase() === val.toLowerCase() ||
              String(entry.value || '').toLowerCase() === val.toLowerCase();
          });
          if (match) commitValue('pais', match.value);
        }
      });
    }
    if (searchGo) {
      searchGo.addEventListener('click', function () {
        if (!searchInput || !openField) return;
        var val = searchInput.value.trim();
        if (!val) return;
        if (fieldAdmiteManual(openField)) {
          commitValue(openField, val);
          return;
        }
        if (openField === 'pais') {
          var entries = entriesCache || pickerEntries('pais');
          var match = entries.find(function (entry) {
            return String(entry.label || '').toLowerCase() === val.toLowerCase() ||
              String(entry.value || '').toLowerCase() === val.toLowerCase();
          });
          if (match) commitValue('pais', match.value);
        }
      });
    }
  }

  function bindBuscar() {
    var btn = document.getElementById('perfilSbarBuscar');
    if (!btn || btn.dataset.perfilSbarBound === '1') return;
    btn.dataset.perfilSbarBound = '1';
    btn.addEventListener('click', function () {
      var cat = selectEl('cat');
      var pais = selectEl('pais');
      var estado = selectEl('estado');
      var ciudad = selectEl('ciudad');
      var p = new URLSearchParams();
      if (cat && cat.value) p.set('categoria', cat.value);
      if (pais && pais.value) p.set('pais', pais.value);
      if (estado && estado.value && estado.value !== 'Todos') p.set('estado', estado.value);
      if (ciudad && ciudad.value && ciudad.value !== 'Todas') p.set('ciudad', ciudad.value);
      location.href = 'resultados.html?' + p.toString();
    });
  }

  function mount(seed) {
    if (!document.getElementById('perfilSearchDock')) return false;
    wireOnce();
    pintarSelects(seed || {});
    var pais = selectEl('pais');
    var estado = selectEl('estado');
    if (pais && pais.dataset.perfilSbarChange !== '1') {
      pais.dataset.perfilSbarChange = '1';
      pais.addEventListener('change', function () { refreshOpciones(true); syncLabels(); });
    }
    if (estado && estado.dataset.perfilSbarChange !== '1') {
      estado.dataset.perfilSbarChange = '1';
      estado.addEventListener('change', function () { refreshOpciones(false); syncLabels(); });
    }
    bindBuscar();
    syncPickerTheme();
    mountSheen();
    return true;
  }

  global.CariHubPerfilResSbarPicker = {
    mount: mount,
    syncTheme: syncPickerTheme,
    close: closePicker
  };
})(typeof window !== 'undefined' ? window : this);
