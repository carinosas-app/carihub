/**
 * Experiencia maestro interactiva — mock completo (preview only).
 * Simula: catálogo nube, registro público+privado, promos RFC, pago, dashboard, editor layout.
 */
(function () {
  'use strict';

  var PERSONAS = {
    hub_nuevo: {
      label: 'Hub nuevo (solo mensajes)',
      tipo: 'hub',
      rfc: '',
      mesGratisHub: false,
      perfilesActivos: 0,
      primerPerfilVencido: false
    },
    publicador_1: {
      label: 'Publicador — 1.er perfil (mes gratis)',
      tipo: 'publicador',
      rfc: 'XAXX010101000',
      mesGratisPub: true,
      perfilesActivos: 1,
      categoria: 'Enfermera a domicilio',
      sectorId: 'salud',
      primerPerfilVencido: false
    },
    publicador_2: {
      label: 'Publicador — 2.º perfil (50%, pago ya)',
      tipo: 'publicador',
      rfc: 'XAXX010101000',
      mesGratisPub: true,
      perfilesActivos: 1,
      categoria: 'Plomero',
      sectorId: 'hogar',
      primerPerfilVencido: false,
      segundoPerfil: true
    },
    vencido: {
      label: '1.er perfil vencido — sin promos',
      tipo: 'publicador',
      rfc: 'XAXX010101000',
      perfilesActivos: 0,
      primerPerfilVencido: true
    },
    sandra: {
      label: 'Sandra — activo pero aviso fantasma (fix)',
      tipo: 'publicador',
      rfc: 'SAND850101ABC',
      perfilesActivos: 1,
      categoria: 'Masajes',
      sectorId: 'salud',
      avisoFantasma: true
    }
  };

  var CATALOG_CLOUD = {
    enfermera: {
      nombre: 'Enfermera a domicilio',
      sectorId: 'salud',
      preguntasPublicas: [
        { id: 'alias', label: 'Nombre profesional público', obligatorio: true },
        { id: 'especialidad', label: 'Especialidad / servicios de enfermería', obligatorio: true },
        { id: 'precio', label: 'Tarifa visita desde (MXN)', obligatorio: true },
        { id: 'horario', label: 'Horario de atención', obligatorio: true },
        { id: 'zonaCobertura', label: 'Zona de cobertura', obligatorio: false, publicoElegible: true },
        { id: 'idiomas', label: 'Idiomas', obligatorio: false, publicoElegible: true }
      ],
      preguntasPrivadas: [
        { id: 'rfc', label: 'RFC (obligatorio para promos)', obligatorio: true },
        { id: 'cedula', label: 'Cédula profesional', obligatorio: true },
        { id: 'ine', label: 'INE', obligatorio: true },
        { id: 'notasInternas', label: 'Notas solo para ti (no públicas)', obligatorio: false, personalizable: true }
      ]
    },
    plomero: {
      nombre: 'Plomero',
      sectorId: 'hogar',
      preguntasPublicas: [
        { id: 'alias', label: 'Nombre o alias comercial', obligatorio: true },
        { id: 'servicios', label: 'Servicios (fugas, tinaco, etc.)', obligatorio: true },
        { id: 'precio', label: 'Visita / tarifa desde', obligatorio: true },
        { id: 'horario', label: 'Horario', obligatorio: true },
        { id: 'emergencias', label: '¿Atiendes emergencias?', obligatorio: false, publicoElegible: true }
      ],
      preguntasPrivadas: [
        { id: 'rfc', label: 'RFC', obligatorio: true },
        { id: 'ine', label: 'INE', obligatorio: true },
        { id: 'referencias', label: 'Referencias (solo privado)', obligatorio: false, personalizable: true }
      ]
    }
  };

  var STEPS = [
    { id: 'home', label: 'Home', sub: 'Buscar, login, ofertas' },
    { id: 'hub-registro', label: 'Registro hub', sub: 'Solo dashboard / mensajes' },
    { id: 'registro-cat', label: 'Categoría (nube)', sub: 'Catálogo ligero' },
    { id: 'registro-publico', label: 'Datos públicos', sub: 'Solo campos del ramo' },
    { id: 'registro-privado', label: 'Datos privados', sub: 'Personalización + RFC' },
    { id: 'registro-ia', label: 'IA + vista previa', sub: 'Perfil y resultados' },
    { id: 'promo-modal', label: 'Modal promo', sub: 'Antes de + Nuevo perfil' },
    { id: 'pago', label: 'Pago publicación', sub: 'Checkout demo' },
    { id: 'dash-inicio', label: 'Dashboard inicio', sub: 'Aviso sector + rail' },
    { id: 'dash-perfil', label: 'Vista perfil', sub: 'Preview en vivo centro' },
    { id: 'dash-resultados', label: 'Tarjeta resultados', sub: 'Otra pestaña módulo' },
    { id: 'layout-fs', label: 'Editor pantalla completa', sub: 'Arrastrar bloques' },
    { id: 'ofertas', label: 'Ofertas y promos', sub: 'Home + Dashboard' }
  ];

  var state = {
    persona: 'publicador_1',
    screen: 'home',
    categoriaKey: 'enfermera',
    rfcIngresado: '',
    camposPublicosElegidos: {},
    camposPrivadosElegidos: {},
    layoutSaved: null,
    pagoCompletado: false
  };

  var toastEl, personaSelect, journeyNav, trapList;
  var dragState = null;
  var longPressTimer = null;

  function $(id) { return document.getElementById(id); }

  function persona() { return PERSONAS[state.persona] || PERSONAS.publicador_1; }

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 3200);
  }

  function mockApi(label, detail) {
    toast('API mock: ' + label + (detail ? ' — ' + detail : ''));
  }

  function evalPromo() {
    var p = persona();
    if (!state.rfcIngresado && !p.rfc) {
      return { elegible: false, razon: 'Sin RFC — promos bloqueadas', requiereRfc: true };
    }
    if (p.primerPerfilVencido || p.perfilesActivos === 0 && p.tipo === 'publicador' && !p.mesGratisPub) {
      if (p.primerPerfilVencido) {
        return { elegible: false, razon: 'Perfil vencido — precio lista, sin 50%', precioPleno: true };
      }
    }
    if (p.segundoPerfil && p.perfilesActivos >= 1) {
      return {
        elegible: true,
        descuento: 0.5,
        requierePagoInmediato: true,
        texto: '50% primer periodo — debes pagar ya aunque tu 1.er perfil siga en mes gratis'
      };
    }
    if (p.tipo === 'hub' && !p.mesGratisHub) {
      return { elegible: true, tipo: 'hub', texto: '1 mes gratis dashboard con RFC verificado' };
    }
    if (p.mesGratisPub && !p.segundoPerfil) {
      return { elegible: true, tipo: 'publicacion', texto: '1 mes gratis publicación tras aprobación (1× por RFC)' };
    }
    return { elegible: false, razon: 'Sin promo aplicable', precioPleno: true };
  }

  function renderJourney() {
    if (!journeyNav) return;
    journeyNav.innerHTML = '';
    var order = STEPS.map(function (s) { return s.id; });
    var cur = order.indexOf(state.screen);
    STEPS.forEach(function (step, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'exp-step' + (step.id === state.screen ? ' is-active' : '') + (i < cur ? ' is-done' : '');
      btn.innerHTML = step.label + '<small>' + step.sub + '</small>';
      btn.addEventListener('click', function () { go(step.id); });
      journeyNav.appendChild(btn);
    });
  }

  function go(screenId) {
    state.screen = screenId;
    var displayScreen = screenId === 'layout-fs' ? 'dash-perfil' : screenId;
    document.querySelectorAll('.screen').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.screen === displayScreen);
    });
    if (screenId === 'layout-fs') openFsEditor();
    else closeFsEditor(false);
    renderJourney();
    if (screenId !== 'layout-fs') renderScreenContent();
    if (location.hash !== '#' + screenId) {
      try { history.replaceState(null, '', '#' + screenId); } catch (e) { /* */ }
    }
  }

  function renderTrapLog() {
    if (!trapList) return;
    var p = persona();
    var promo = evalPromo();
    var traps = [
      { t: 'RFC duplicado en otra cuenta', ok: !!state.rfcIngresado || !!p.rfc },
      { t: 'Mes gratis publicación 2×', ok: true },
      { t: '50% con perfil vencido', ok: !p.primerPerfilVencido },
      { t: '2.º perfil sin pago inmediato', ok: !p.segundoPerfil || state.pagoCompletado },
      { t: 'Campos de otro ramo en perfil público', ok: state.screen !== 'registro-publico' || state.categoriaKey },
      { t: 'Aviso pendiente con perfil activo (Sandra)', ok: !p.avisoFantasma || state.screen === 'dash-inicio' },
      { t: 'Hub gratis sin RFC', ok: p.tipo !== 'hub' || !!state.rfcIngresado }
    ];
    trapList.innerHTML = traps.map(function (x) {
      return '<li class="' + (x.ok ? 'is-blocked' : 'is-risk') + '">' +
        (x.ok ? '[bloqueado] ' : '[riesgo] ') + x.t + '</li>';
    }).join('');
  }

  function renderFields(containerId, fields, prefix) {
    var el = $(containerId);
    if (!el) return;
    el.innerHTML = fields.map(function (f) {
      var chk = f.publicoElegible || f.personalizable;
      var checked = state[prefix][f.id] !== false;
      var body = chk
        ? '<label class="field-check"><input type="checkbox" data-field="' + f.id + '" data-prefix="' + prefix + '"' +
          (checked ? ' checked' : '') + '> Incluir / personalizar</label>'
        : '';
      return '<div class="field-row"><label>' + f.label + (f.obligatorio ? ' *' : '') + '</label>' +
        (f.id === 'rfc'
          ? '<input type="text" data-rfc-input placeholder="XAXX010101000" value="' + (state.rfcIngresado || '') + '">'
          : '<input type="text" placeholder="' + f.label + '">') +
        body + '</div>';
    }).join('');
    el.querySelectorAll('input[data-field]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        state[inp.dataset.prefix][inp.dataset.field] = inp.checked;
        renderTrapLog();
      });
    });
    var rfcInp = el.querySelector('[data-rfc-input]');
    if (rfcInp) {
      rfcInp.addEventListener('input', function () {
        state.rfcIngresado = rfcInp.value.trim().toUpperCase();
        updateRfcGates();
        renderTrapLog();
      });
    }
  }

  function updateRfcGates() {
    document.querySelectorAll('.rfc-gate').forEach(function (g) {
      var ok = !!state.rfcIngresado || !!persona().rfc;
      g.classList.toggle('is-ok', ok);
      g.querySelector('.rfc-gate__text').textContent = ok
        ? 'RFC capturado — promos habilitadas (validación mock)'
        : 'Sin RFC no hay mes gratis ni 50% — captura RFC para continuar';
    });
  }

  function renderScreenContent() {
    var cat = CATALOG_CLOUD[state.categoriaKey] || CATALOG_CLOUD.enfermera;
    var catLabel = $('catSelectedLabel');
    if (catLabel) catLabel.textContent = cat.nombre;

    renderFields('fieldsPublicos', cat.preguntasPublicas, 'camposPublicosElegidos');
    renderFields('fieldsPrivados', cat.preguntasPrivadas, 'camposPrivadosElegidos');
    updateRfcGates();
    renderTrapLog();
    renderDashAviso();
    renderIaPreview();
    renderPromoModal();
    renderPago();
  }

  function renderDashAviso() {
    var el = $('dashAviso');
    if (!el) return;
    var p = persona();
    if (p.avisoFantasma && !state.pagoCompletado) {
      el.className = 'dash-aviso dash-aviso--sector-salud';
      el.innerHTML = '<span><strong>Fix demo:</strong> Firebase dice ACTIVO pero localStorage muestra «pendiente» — en prod esto se corrige</span>' +
        '<button type="button" class="btn btn--ghost" id="btnFixSandra">Corregir</button>';
      var fix = $('btnFixSandra');
      if (fix) fix.onclick = function () {
        p.avisoFantasma = false;
        mockApi('syncAvisoEntradaPerfil', 'Firebase > localStorage');
        renderDashAviso();
      };
      return;
    }
    if (p.segundoPerfil && !state.pagoCompletado) {
      el.className = 'dash-aviso dash-aviso--pago';
      el.innerHTML = '<span>Admin aprobó tu 2.º perfil — 50% primer periodo. <strong>Pago requerido ya.</strong></span>' +
        '<button type="button" class="btn" id="btnContinuarPago">Continuar</button>';
      var cp = $('btnContinuarPago');
      if (cp) cp.onclick = function () { go('pago'); };
      return;
    }
    var sector = p.sectorId || 'salud';
    el.className = 'dash-aviso dash-aviso--sector-' + sector;
    el.innerHTML = '<span>Tu perfil <strong>ya circula</strong> en ' + (p.categoria || 'tu categoría') +
      (p.mesGratisPub ? ' — mes de prueba gratis hasta 20 jul' : '') + '</span>';
  }

  function renderIaPreview() {
    var pub = $('iaPreviewPublic');
    var res = $('iaPreviewResultados');
    var cat = CATALOG_CLOUD[state.categoriaKey] || CATALOG_CLOUD.enfermera;
    if (pub) {
      pub.innerHTML = '<div class="mini-perfil__hero" style="background-image:url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400)"></div>' +
        '<div class="mini-perfil__body"><b>' + (cat.nombre.split(' ')[0] || 'Perfil') + ' · Demo</b><br>' +
        'Solo campos del ramo: especialidad, tarifa, horario.<br><em>Sin datos de hotel ni retail.</em></div>';
    }
    if (res) {
      res.innerHTML = '<img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120" alt="">' +
        '<div><b>' + cat.nombre + '</b><br><span>Desde $599 · Monterrey</span><br><small>Solo campos elegidos</small></div>';
    }
  }

  function renderPromoModal() {
    var box = $('promoModalText');
    if (!box) return;
    var promo = evalPromo();
    if (promo.elegible) {
      box.innerHTML = '<p class="promo-pct">' + (promo.descuento ? '50%' : 'GRATIS') + '</p><p>' + promo.texto + '</p>';
    } else {
      box.innerHTML = '<p>' + promo.razon + '</p><p>Precio lista — puedes publicar sin promoción.</p>';
    }
  }

  function renderPago() {
    var promo = evalPromo();
    var base = 999;
    var final_ = promo.descuento ? Math.round(base * 0.5) : base;
    var lines = $('pagoLines');
    if (lines) {
      lines.innerHTML = '<div class="pago-line"><span>Perfil adicional · 1 mes</span><span>$' + base + '</span></div>' +
        (promo.descuento ? '<div class="pago-line"><span>Descuento 50%</span><span>-$' + (base - final_) + '</span></div>' : '') +
        '<div class="pago-line"><strong>Total</strong><strong>$' + final_ + ' MXN</strong></div>';
    }
    var tot = $('pagoTotal');
    if (tot) tot.textContent = '$' + final_ + ' MXN';
  }

  /* ——— Layout editor fullscreen ——— */
  var fsEditor, fsCanvas, layoutOriginal;

  function getBlocks() {
    return Array.prototype.slice.call(document.querySelectorAll('#profileMockGrid .profile-block, #fsCanvas .profile-block'));
  }

  function snapshotLayout() {
    var canvas = fsCanvas || $('profileMockGrid');
    if (!canvas) return [];
    return getBlocks().map(function (blk) {
      var r = blk.getBoundingClientRect();
      var c = canvas.getBoundingClientRect();
      return {
        id: blk.dataset.blockId,
        floating: blk.classList.contains('is-floating'),
        left: blk.style.left || '',
        top: blk.style.top || '',
        width: blk.style.width || '',
        height: blk.style.height || ''
      };
    });
  }

  function applyLayoutSnapshot(snap, targetParent) {
    if (!snap) return;
    snap.forEach(function (item) {
      var blk = document.querySelector('[data-block-id="' + item.id + '"]');
      if (!blk) return;
      if (item.floating) {
        blk.classList.add('is-floating');
        if (targetParent) targetParent.appendChild(blk);
        blk.style.left = item.left;
        blk.style.top = item.top;
        blk.style.width = item.width;
        blk.style.height = item.height;
      }
    });
  }

  function cloneBlocksToFs() {
    var grid = $('profileMockGrid');
    if (!fsCanvas || !grid) return;
    fsCanvas.innerHTML = '';
    var blocks = grid.querySelectorAll('.profile-block');
    blocks.forEach(function (blk) {
      var clone = blk.cloneNode(true);
      clone.style.position = blk.classList.contains('is-floating') ? 'absolute' : '';
      clone.style.left = blk.style.left;
      clone.style.top = blk.style.top;
      clone.style.width = blk.style.width;
      clone.style.height = blk.style.height;
      if (blk.classList.contains('is-floating')) clone.classList.add('is-floating');
      fsCanvas.appendChild(clone);
      bindBlockInteractions(clone, fsCanvas);
    });
  }

  function openFsEditor() {
    if (!fsEditor) fsEditor = $('fsEditor');
    if (!fsCanvas) fsCanvas = $('fsCanvas');
    if (!layoutOriginal) layoutOriginal = snapshotLayout();
    cloneBlocksToFs();
    fsEditor.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeFsEditor(restoreScroll) {
    if (!fsEditor) return;
    fsEditor.classList.remove('is-open');
    if (restoreScroll !== false) document.body.style.overflow = '';
  }

  function bindBlockInteractions(blk, canvas) {
    var blockId = blk.dataset.blockId;

    blk.addEventListener('mousedown', function (e) {
      if (e.target.classList.contains('resize-handle')) return;
      longPressTimer = setTimeout(function () {
        blk.classList.add('is-floating', 'is-drag-mode');
        if (blk.parentElement !== canvas) canvas.appendChild(blk);
        var rect = blk.getBoundingClientRect();
        var cRect = canvas.getBoundingClientRect();
        blk.style.width = rect.width + 'px';
        blk.style.height = rect.height + 'px';
        blk.style.left = (rect.left - cRect.left + canvas.scrollLeft) + 'px';
        blk.style.top = (rect.top - cRect.top + canvas.scrollTop) + 'px';
        blk.style.position = 'absolute';
        toast('Bloque «' + blockId + '» despegado — arrastra para mover');
      }, 480);
    });

    blk.addEventListener('mouseup', function () { clearTimeout(longPressTimer); });
    blk.addEventListener('mouseleave', function () { clearTimeout(longPressTimer); });

    blk.addEventListener('dblclick', function () {
      if (blk.classList.contains('is-floating')) {
        blk.classList.remove('is-floating', 'is-drag-mode');
        blk.style.position = '';
        blk.style.left = '';
        blk.style.top = '';
        blk.style.width = '';
        blk.style.height = '';
        toast('Bloque anclado de nuevo al layout');
      }
    });

    blk.addEventListener('mousedown', function (e) {
      if (!blk.classList.contains('is-floating') || e.target.classList.contains('resize-handle')) return;
      e.preventDefault();
      var cRect = canvas.getBoundingClientRect();
      dragState = {
        el: blk,
        canvas: canvas,
        ox: e.clientX - (parseFloat(blk.style.left) || 0),
        oy: e.clientY - (parseFloat(blk.style.top) || 0)
      };
    });

    blk.querySelectorAll('.resize-handle').forEach(function (handle) {
      handle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        if (!blk.classList.contains('is-floating')) return;
        e.preventDefault();
        var startX = e.clientX, startY = e.clientY;
        var startW = blk.offsetWidth, startH = blk.offsetHeight;
        function onMove(ev) {
          var nw = Math.max(80, startW + (ev.clientX - startX));
          var nh = Math.max(40, startH + (ev.clientY - startY));
          blk.style.width = nw + 'px';
          blk.style.height = nh + 'px';
        }
        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    });
  }

  document.addEventListener('mousemove', function (e) {
    if (!dragState) return;
    var cRect = dragState.canvas.getBoundingClientRect();
    dragState.el.style.left = (e.clientX - cRect.left - dragState.ox + dragState.canvas.scrollLeft) + 'px';
    dragState.el.style.top = (e.clientY - cRect.top - dragState.oy + dragState.canvas.scrollTop) + 'px';
  });
  document.addEventListener('mouseup', function () { dragState = null; });

  function init() {
    toastEl = $('expToast');
    personaSelect = $('personaSelect');
    journeyNav = $('journeyNav');
    trapList = $('trapLog');
    fsEditor = $('fsEditor');
    fsCanvas = $('fsCanvas');

    if (personaSelect) {
      personaSelect.innerHTML = Object.keys(PERSONAS).map(function (k) {
        return '<option value="' + k + '"' + (state.persona === k ? ' selected' : '') + '>' + PERSONAS[k].label + '</option>';
      }).join('');
      personaSelect.addEventListener('change', function () {
        state.persona = personaSelect.value;
        state.rfcIngresado = persona().rfc || '';
        state.pagoCompletado = false;
        renderScreenContent();
        toast('Persona: ' + persona().label);
      });
    }

    document.querySelectorAll('.cat-tile').forEach(function (tile) {
      tile.addEventListener('click', function () {
        document.querySelectorAll('.cat-tile').forEach(function (t) { t.classList.remove('is-selected'); });
        tile.classList.add('is-selected');
        state.categoriaKey = tile.dataset.cat;
        mockApi('GET catalogo_subcategorias/' + state.categoriaKey, '12 KB desde nube');
        renderScreenContent();
      });
    });

    $('btnHomeBuscar') && $('btnHomeBuscar').addEventListener('click', function () {
      mockApi('busqueda', $('homeSearch').value || 'enfermera');
      go('registro-cat');
    });
    $('btnHomeCuenta') && $('btnHomeCuenta').addEventListener('click', function () { go('hub-registro'); });
    $('btnHomePublicar') && $('btnHomePublicar').addEventListener('click', function () { go('promo-modal'); $('promoOverlay').classList.add('is-open'); });
    $('btnHomeOfertas') && $('btnHomeOfertas').addEventListener('click', function () { go('ofertas'); });
    $('btnHubContinuar') && $('btnHubContinuar').addEventListener('click', function () {
      if (!state.rfcIngresado) { toast('Captura RFC en el paso privado'); go('registro-privado'); return; }
      mockApi('contratoHub.activar_gratis', '30 días');
      go('dash-inicio');
    });
    $('btnCatSiguiente') && $('btnCatSiguiente').addEventListener('click', function () { go('registro-publico'); });
    $('btnPublicoSiguiente') && $('btnPublicoSiguiente').addEventListener('click', function () { go('registro-privado'); });
    $('btnPrivadoSiguiente') && $('btnPrivadoSiguiente').addEventListener('click', function () { go('registro-ia'); });
    $('btnIaGenerar') && $('btnIaGenerar').addEventListener('click', function () {
      mockApi('POST ia/preview-layout', 'layout JSON + textos sugeridos');
      renderIaPreview();
    });
    $('btnIaEnviar') && $('btnIaEnviar').addEventListener('click', function () {
      mockApi('POST registro-perfil-submit', 'renderSnapshot guardado');
      if (persona().segundoPerfil) go('pago');
      else go('dash-inicio');
    });
    $('btnPromoContinuar') && $('btnPromoContinuar').addEventListener('click', function () {
      $('promoOverlay').classList.remove('is-open');
      go('registro-cat');
    });
    $('btnPromoCerrar') && $('btnPromoCerrar').addEventListener('click', function () {
      $('promoOverlay').classList.remove('is-open');
    });
    $('btnPagar') && $('btnPagar').addEventListener('click', function () {
      state.pagoCompletado = true;
      mockApi('POST pago/demo', 'redirect dashboard?pago=ok');
      go('dash-inicio');
    });
    $('btnDashModPerfil') && $('btnDashModPerfil').addEventListener('click', function () { go('dash-perfil'); });
    $('btnDashModResultados') && $('btnDashModResultados').addEventListener('click', function () { go('dash-resultados'); });
    $('btnOpenFs') && $('btnOpenFs').addEventListener('click', function () { go('layout-fs'); });
    $('btnFsCerrar') && $('btnFsCerrar').addEventListener('click', function () { go('dash-perfil'); });
    $('btnFsGuardar') && $('btnFsGuardar').addEventListener('click', function () {
      state.layoutSaved = snapshotLayout();
      mockApi('PATCH usuarios/{uid}/layoutPerfil', JSON.stringify(state.layoutSaved.length) + ' bloques');
      closeFsEditor();
      go('dash-perfil');
    });
    $('btnFsCancelar') && $('btnFsCancelar').addEventListener('click', function () {
      applyLayoutSnapshot(layoutOriginal, fsCanvas);
      closeFsEditor();
      go('dash-perfil');
    });
    $('btnFsOriginal') && $('btnFsOriginal').addEventListener('click', function () {
      getBlocks().forEach(function (b) {
        b.classList.remove('is-floating', 'is-drag-mode');
        b.style.cssText = '';
      });
      toast('Layout restaurado al original de la categoría');
    });
    $('btnNuevoPerfil') && $('btnNuevoPerfil').addEventListener('click', function () {
      $('promoOverlay').classList.add('is-open');
      go('promo-modal');
    });

    document.querySelectorAll('#profileMockGrid .profile-block').forEach(function (blk) {
      bindBlockInteractions(blk, $('profileMockGrid'));
    });

    document.querySelectorAll('[data-goto]').forEach(function (el) {
      el.addEventListener('click', function () { go(el.getAttribute('data-goto')); });
    });

    window.addEventListener('hashchange', function () {
      var h = (location.hash || '').replace('#', '');
      if (h && STEPS.some(function (s) { return s.id === h; })) go(h);
    });

    var hash = (location.hash || '').replace('#', '');
    if (hash && STEPS.some(function (s) { return s.id === hash; })) state.screen = hash;

    document.querySelectorAll('.screen').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.screen === state.screen);
    });

    state.rfcIngresado = persona().rfc || '';
    renderJourney();
    renderScreenContent();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
