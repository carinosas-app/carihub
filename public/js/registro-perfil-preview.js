(function (global) {
  'use strict';

  var STORAGE_KEY = 'carihub_rp_public_preview';
  var DEBOUNCE_MS = 280;
  var bound = false;
  var timer = null;
  var hooks = { getContext: null, getSector: null, getSubcategoria: null };
  var lastPerfilSrc = '';

  function $(id) {
    return document.getElementById(id);
  }

  function modalidadesFromForm(val) {
    val = String(val || '').trim();
    if (val === 'con_lugar') return ['recibe'];
    if (val === 'hotel') return ['hotel'];
    if (val === 'domicilio') return ['domicilio'];
    if (val === 'mixto') return ['recibe', 'hotel', 'domicilio'];
    return [];
  }

  function collectGalleryPreviews() {
    var out = [];
    document.querySelectorAll('#rpGalleryGrid .rp-gallery__slot').forEach(function (slot) {
      if (slot.dataset.preview) out.push(slot.dataset.preview);
    });
    return out;
  }

  function collectContactPublico() {
    function val(id) {
      var el = $(id);
      return el ? String(el.value || '').trim() : '';
    }
    function on(id) {
      var el = $(id);
      return !!(el && el.checked);
    }
    return {
      whatsappActivo: on('ctWhatsapp'),
      whatsapp: val('fldWhatsapp'),
      telegramActivo: on('ctTelegram'),
      telegram: val('fldTelegram'),
      instagramActivo: on('ctInstagram'),
      instagram: val('fldInstagram'),
      twitterActivo: on('ctTwitter'),
      twitter: val('fldTwitter'),
      facebookActivo: on('ctFacebook'),
      facebook: val('fldFacebook'),
      gmailActivo: on('ctGmail'),
      correo: val('fldGmail'),
      telefonoActivo: on('ctTelefono'),
      telefono: val('fldTelefonoPublico'),
      onlyFansActivo: on('ctOnlyfans'),
      onlyFans: val('fldOnlyfans'),
      googleMapsActivo: on('ctUbicacion'),
      googleMaps: val('fldGoogleMaps'),
      mensajesInternosActivo: on('ctMensajesInternos'),
      mensajeContactoPublicidad: val('fldMensajeContacto')
    };
  }

  function resolveCtx() {
    if (typeof hooks.getContext === 'function') {
      var ctx = hooks.getContext();
      if (ctx) return ctx;
    }
    return {
      subcategoriaId: '',
      subcategoria: $('fldSubcategoria') ? $('fldSubcategoria').value.trim() : '',
      sectorSolicitado: $('fldCategoria') ? $('fldCategoria').value.trim() : ''
    };
  }

  function sectorEsAdultos() {
    if (typeof hooks.getSector === 'function') {
      var s = hooks.getSector();
      if (s && s.id) return s.id === 'adultos';
    }
    return false;
  }

  function buildPreviewPayload() {
    var ctx = resolveCtx();
    var subId = ctx.subcategoriaId || '';
    var subName = ctx.subcategoria || (hooks.getSubcategoria && hooks.getSubcategoria() && hooks.getSubcategoria().nombre) || '';
    var catName = ctx.sectorSolicitado || ctx.categoriaPrincipal || ctx.categoriaSolicitada || '';
    var aliasEl = $('fldAlias');
    var alias = aliasEl ? aliasEl.value.trim() : '';
    var mainBox = $('uploadPrincipalBox');
    var foto = mainBox && mainBox.dataset.preview ? mainBox.dataset.preview : '';
    var gallery = collectGalleryPreviews();
    var fotosCount = (foto ? 1 : 0) + gallery.length;
    var zona = $('fldZona') ? $('fldZona').value.trim() : '';
    var ciudad = $('fldCiudad') ? $('fldCiudad').value.trim() : '';
    var estado = $('fldEstado') ? $('fldEstado').value.trim() : '';
    var pais = $('fldPais') ? $('fldPais').value.trim() : '';
    var ubicacion = zona && ciudad ? zona + ', ' + ciudad : (zona || ciudad || estado);

    var pres = null;
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolvePublicPresentation) {
      pres = CariHubFieldEngineLite.resolvePublicPresentation({
        subcategoriaId: subId,
        categoria: subName || catName
      });
    }
    var esNegocio = pres && pres.componenteResultados === 'ResultCardNegocio';

    var u = {
      __id: 'preview-registro',
      __demo: true,
      nombre: alias || 'Tu nombre público',
      alias: alias || 'Tu nombre público',
      edad: $('fldEdad') ? $('fldEdad').value.trim() : '',
      zona: zona,
      ciudad: ciudad,
      estado: estado,
      pais: pais || 'México',
      ubicacion: ubicacion,
      descripcion: $('fldDescripcion') ? $('fldDescripcion').value.trim() : '',
      tagline: $('fldDescripcion') ? $('fldDescripcion').value.trim() : '',
      descripcionPublica: $('fldDescripcion') ? $('fldDescripcion').value.trim() : '',
      serviciosPrincipales: $('fldServicios') ? $('fldServicios').value.trim() : '',
      horario: $('fldHorario') ? $('fldHorario').value.trim() : '',
      horarioPublico: $('fldHorario') ? $('fldHorario').value.trim() : '',
      precio: $('fldPrecio') ? $('fldPrecio').value.trim() : '',
      precioDesde: $('fldPrecio') ? $('fldPrecio').value.trim() : '',
      categoria: subName || catName,
      categoriaPublica: subName || catName,
      subcategoriaId: subId,
      modalidades: modalidadesFromForm($('fldModalidad') ? $('fldModalidad').value : ''),
      fotoURL: foto || 'img/resultados-demo/violeta-1.png',
      fotosExtraURL: gallery,
      fotosCount: fotosCount || (foto ? 1 : 0),
      nueva: true,
      disponibilidad: 'Disponible',
      contactoPublico: collectContactPublico(),
      mensajeContactoPublicidad: $('fldMensajeContacto') ? $('fldMensajeContacto').value.trim() : ''
    };

    if (esNegocio) u.nombreComercial = u.nombre;

    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.enriquecerPerfilPublico) {
      global.CariHubFieldEngineLite.enriquecerPerfilPublico(u, {
        subcategoriaId: subId,
        categoria: subName || catName
      });
    }

    return {
      vista: (pres && pres.vistaPerfil) || 'adult',
      tema: sectorEsAdultos() ? 'adult' : 'pro',
      perfil: u,
      query: {
        categoria: subName || catName,
        pais: pais || 'México',
        estado: estado,
        ciudad: ciudad
      }
    };
  }

  function persistPayload(data) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function sanitizePreviewCard(html) {
    return String(html || '')
      .replace(/\sonclick="[^"]*"/gi, '')
      .replace(/\sonclick='[^']*'/gi, '');
  }

  function renderResultadosCard(mount, data, emptyMsg) {
    if (!mount) return;
    mount.setAttribute('data-tema', (data && data.tema) || 'adult');
    var isModal = mount.classList.contains('rp-preview-res-mount--modal');
    mount.style.setProperty('--rp-preview-card-h', (isModal ? 232 : 120) + 'px');
    if (!data || !data.perfil) {
      mount.innerHTML = '<p class="rp-preview-empty">' + (emptyMsg || 'Completa tu nombre y datos públicos para ver la tarjeta.') + '</p>';
      return;
    }
    var html = '';
    if (global.CariHubPublicRenderLite && CariHubPublicRenderLite.cardHTML) {
      html = global.CariHubPublicRenderLite.cardHTML(data.perfil, data.query || {});
    }
    mount.innerHTML = sanitizePreviewCard(html) ||
      '<p class="rp-preview-empty">No se pudo generar la vista previa de la tarjeta.</p>';
  }

  function postToIframe(frame) {
    if (!frame || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage({ type: 'carihub-rp-preview-update' }, '*');
    } catch (e) { /* noop */ }
  }

  function perfilIframeSrc(data) {
    var params = new URLSearchParams();
    params.set('previewSource', 'registro');
    params.set('from', 'registro');
    if (data.vista) params.set('vista', data.vista);
    if (data.query && data.query.categoria) params.set('categoria', data.query.categoria);
    if (data.query && data.query.pais) params.set('pais', data.query.pais);
    if (data.query && data.query.estado) params.set('estado', data.query.estado);
    if (data.query && data.query.ciudad) params.set('ciudad', data.query.ciudad);
    return 'perfil-publico.html?' + params.toString();
  }

  function setLoading(on) {
    document.querySelectorAll('.rp-public-preview').forEach(function (el) {
      el.classList.toggle('is-loading', !!on);
    });
  }

  function refresh() {
    var screen = $('screen1');
    if (!screen || !screen.classList.contains('is-active')) return;

    var data = buildPreviewPayload();
    persistPayload(data);

    renderResultadosCard($('rpPreviewResultadosMount'), data);

    var perfilFrame = $('rpPreviewPerfilFrame');
    if (perfilFrame) {
      var src = perfilIframeSrc(data);
      if (src !== lastPerfilSrc) {
        lastPerfilSrc = src;
        perfilFrame.onload = function () {
          perfilFrame.onload = null;
          postToIframe(perfilFrame);
        };
        perfilFrame.src = src;
      } else {
        postToIframe(perfilFrame);
      }
    }
    setLoading(false);
  }

  function scheduleRefresh() {
    setLoading(true);
    if (timer) clearTimeout(timer);
    timer = setTimeout(refresh, DEBOUNCE_MS);
  }

  function openModal(kind) {
    var modal = $('rpPreviewModal');
    var body = $('rpPreviewModalBody');
    var title = $('rpPreviewModalTitle');
    if (!modal || !body) return;

    var data = buildPreviewPayload();
    persistPayload(data);

    if (kind === 'resultados') {
      if (title) title.textContent = 'Tarjeta en resultados';
      body.innerHTML = '<div class="rp-preview-res-mount rp-preview-res-mount--modal" id="rpPreviewModalCard"></div>';
      renderResultadosCard($('rpPreviewModalCard'), data);
    } else {
      if (title) title.textContent = 'Tu perfil público';
      body.innerHTML = '<iframe title="Perfil público" src="' + perfilIframeSrc(data) + '"></iframe>';
    }
    modal.classList.remove('rp-hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var modal = $('rpPreviewModal');
    if (!modal) return;
    modal.classList.add('rp-hidden');
    var body = $('rpPreviewModalBody');
    if (body) body.innerHTML = '';
    document.body.style.overflow = '';
  }

  function bindUi() {
    if (bound) return;
    bound = true;

    document.querySelectorAll('[data-preview-expand]').forEach(function (el) {
      el.addEventListener('click', function (ev) {
        var kind = el.getAttribute('data-preview-expand');
        if (!kind) return;
        ev.preventDefault();
        openModal(kind);
      });
    });

    var closeBtn = $('rpPreviewModalClose');
    var backdrop = $('rpPreviewModalBackdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') closeModal();
    });

    var screen = $('screen1');
    if (!screen) return;
    ['input', 'change'].forEach(function (evt) {
      screen.addEventListener(evt, function (ev) {
        if (!ev.target || !ev.target.closest) return;
        if (ev.target.closest('#rpPublicPreviews')) return;
        scheduleRefresh();
      });
    });
  }

  function bind(cfg) {
    hooks.getContext = cfg && cfg.getContext ? cfg.getContext : null;
    hooks.getSector = cfg && cfg.getSector ? cfg.getSector : null;
    hooks.getSubcategoria = cfg && cfg.getSubcategoria ? cfg.getSubcategoria : null;
    bindUi();
    scheduleRefresh();
  }

  global.CariHubRegistroPerfilPreview = {
    bind: bind,
    refresh: refresh,
    buildPreviewPayload: buildPreviewPayload,
    renderResultadosCard: renderResultadosCard,
    STORAGE_KEY: STORAGE_KEY
  };
})(typeof window !== 'undefined' ? window : globalThis);
