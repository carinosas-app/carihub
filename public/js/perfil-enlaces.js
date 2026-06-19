/**
 * Enlaces del perfil público — mapas, secciones, live, reservas y nav superior.
 */
(function (global) {
  'use strict';

  function isPreviewPath() {
    return (global.location.pathname || '').indexOf('/preview/') >= 0;
  }

  function indexBase() {
    return isPreviewPath() ? '../index.html' : 'index.html';
  }

  function indexHref(params) {
    var p = new URLSearchParams();
    var q = params || {};
    Object.keys(q).forEach(function (k) {
      if (q[k] != null && q[k] !== '') p.set(k, String(q[k]));
    });
    var qs = p.toString();
    return qs ? indexBase() + '?' + qs : indexBase();
  }

  function perfilId(u) {
    if (u && (u.__id || u.uid)) return String(u.__id || u.uid).trim();
    if (global.CariHubPerfilPublico && CariHubPerfilPublico.queryPerfilPublico) {
      return String(CariHubPerfilPublico.queryPerfilPublico().id || '').trim();
    }
    return '';
  }

  function queryPerfil() {
    if (global.CariHubPerfilPublico && CariHubPerfilPublico.queryPerfilPublico) {
      return CariHubPerfilPublico.queryPerfilPublico();
    }
    return {};
  }

  function resultadosHref(q) {
    q = q || queryPerfil();
    if (global.CariHubPerfilPublico && CariHubPerfilPublico.resultadosVolverHref) {
      return CariHubPerfilPublico.resultadosVolverHref(q);
    }
    if (global.CariHubNavQuick && CariHubNavQuick.resultadosHrefFromQuery) {
      return CariHubNavQuick.resultadosHrefFromQuery(q);
    }
    var base = isPreviewPath() ? '../resultados.html' : 'resultados.html';
    return base;
  }

  function direccionTexto(u) {
    u = u || {};
    if (u.direccionCompleta) return String(u.direccionCompleta).trim();
    if (u.direccion) return String(u.direccion).trim();
    if (u.direccionLineas && u.direccionLineas.length) {
      return u.direccionLineas.map(String).join(', ');
    }
    if (u.ubicacionPublica) return String(u.ubicacionPublica).trim();
    if (u.ubicacion) return String(u.ubicacion).trim();
    return [u.ciudad, u.estado, u.pais].filter(Boolean).join(', ');
  }

  function mapsUrl(u, queryOverride) {
    u = u || {};
    var cp = u.contactoPublico || {};
    if (cp.googleMapsActivo === false) return '';
    if (cp.googleMaps) return String(cp.googleMaps).trim();
    if (u.googleMapsPublico) return String(u.googleMapsPublico).trim();
    var directo = u.mapsUrl || u.googleMapsUrl || u.mapaUrl;
    if (directo) return String(directo).trim();
    if (cp.mapsUrl) return String(cp.mapsUrl).trim();
    if (u.lat != null && u.lng != null) {
      return 'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(String(u.lat) + ',' + String(u.lng));
    }
    var q = String(queryOverride || direccionTexto(u)).trim();
    if (!q) q = [u.ciudad, u.estado, u.pais].filter(Boolean).join(', ');
    if (!q) return 'https://www.google.com/maps';
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  }

  function liveUrl(u) {
    u = u || {};
    var url = String(u.liveUrl || u.transmisionUrl || u.streamUrl || '').trim();
    if (url) return url;
    if (global.CariHubPerfilContactos && CariHubPerfilContactos.esDemo(u)) {
      return 'https://www.youtube.com/live';
    }
    return '#perfil-live';
  }

  function recordatorioLiveUrl(u) {
    u = u || {};
    var titulo = u.liveTitulo || ('Live de ' + (u.nombre || 'perfil'));
    var fecha = u.liveFecha || 'Próxima transmisión';
    var hora = u.liveHora || '';
    var detalle = [
      'Recordatorio desde Cariñosas.',
      fecha + (hora ? ' · ' + hora : ''),
      u.liveDesc || u.liveTitulo || ''
    ].filter(Boolean).join('\n');
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(titulo) +
      '&details=' + encodeURIComponent(detalle);
  }

  function reservarUrl(u) {
    u = u || {};
    if (u.pieCtaUrl || u.reservaUrl) return String(u.pieCtaUrl || u.reservaUrl).trim();
    if (global.CariHubPerfilContactos) {
      var wa = CariHubPerfilContactos.buildHref('wa', u);
      if (wa) return wa;
      var tel = CariHubPerfilContactos.buildHref('tel', u);
      if (tel) return tel;
    }
    var id = perfilId(u);
    if (global.CariHubHomeIntenciones && CariHubHomeIntenciones.guardar && CariHubHomeIntenciones.KEYS) {
      CariHubHomeIntenciones.guardar(CariHubHomeIntenciones.KEYS.reservar, {
        perfil: id,
        ts: Date.now(),
        reanudar: true
      });
    }
    return indexHref({
      abrir: 'registro',
      intencion: 'reservar',
      perfil: id
    });
  }

  function publicarUrl(u, tipo) {
    return indexHref({
      abrir: 'registro',
      intencion: tipo === 'live' ? 'publicar_live' : 'publicar_estado',
      perfil: perfilId(u)
    });
  }

  function mensajesUrl(u) {
    var id = perfilId(u);
    return id
      ? indexHref({ abrir: 'mensajes', perfil: id })
      : indexHref({ abrir: 'mensajes' });
  }

  function agendarCitaUrl(u) {
    var id = perfilId(u);
    if (global.CariHubHomeIntenciones && CariHubHomeIntenciones.guardar && CariHubHomeIntenciones.KEYS) {
      CariHubHomeIntenciones.guardar(CariHubHomeIntenciones.KEYS.agendar, {
        perfil: id,
        ts: Date.now(),
        reanudar: true
      });
    }
    return indexHref({
      abrir: 'registro',
      intencion: 'agendar_cita',
      perfil: id
    });
  }

  function aplicarEnlace(el, href, opts) {
    if (!el || !href) return;
    opts = opts || {};
    el.setAttribute('href', href);
    if (opts.blank || /^https?:\/\//i.test(href)) {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    } else {
      el.removeAttribute('target');
      el.removeAttribute('rel');
    }
    if (opts.ariaLabel) el.setAttribute('aria-label', opts.ariaLabel);
  }

  function marcarSecciones(root) {
    if (!root) return;
    var act = root.querySelector('[data-act-neg-wrap], .act-card.playout__estado, .act-negocio, .playout__estado');
    if (act && !act.id) act.id = 'perfil-actividad';

    var live = root.querySelector('.live-card.playout__live, .live-neg.playout__live, .playout__live');
    if (live && !live.id) live.id = 'perfil-live';

    var reviews = root.querySelector('.pcard--negocio-reviews');
    if (reviews && !reviews.id) reviews.id = 'perfil-opiniones';

    root.querySelectorAll('.pcard').forEach(function (card) {
      if (card.id) return;
      var h = card.querySelector('.pcard__h');
      if (!h) return;
      var t = h.textContent || '';
      if (/Actividad reciente/i.test(t)) card.id = 'perfil-actividad';
      else if (/En vivo|Transmis/i.test(t)) card.id = 'perfil-live';
      else if (/Opiniones/i.test(t)) card.id = 'perfil-opiniones';
    });
  }

  function wireVerTodas(root) {
    root.querySelectorAll('.act-negocio__link').forEach(function (a) {
      aplicarEnlace(a, '#perfil-actividad');
    });
    root.querySelectorAll('.negocio-reviews__foot a').forEach(function (a) {
      aplicarEnlace(a, '#perfil-opiniones');
    });
    root.querySelectorAll('.pcard__h .lnk').forEach(function (a) {
      var h = a.closest('.pcard__h');
      var t = (h && h.textContent) || '';
      if (/Actividad/i.test(t)) aplicarEnlace(a, '#perfil-actividad');
      else if (/vivo|Transmis/i.test(t)) aplicarEnlace(a, '#perfil-live');
      else if (/Opiniones/i.test(t)) aplicarEnlace(a, '#perfil-opiniones');
    });
    root.querySelectorAll('.negocio-reviews__foot a').forEach(function (a) {
      aplicarEnlace(a, '#perfil-opiniones');
    });
  }

  function wireMapas(root, u) {
    var url = mapsUrl(u);
    if (!url) return;
    root.querySelectorAll('.negocio-gmaps__cta, .negocio-ubic__cta').forEach(function (a) {
      aplicarEnlace(a, url, { blank: true, ariaLabel: 'Cómo llegar en Google Maps' });
    });
    root.querySelectorAll('.negocio-gmaps__map').forEach(function (mapEl) {
      if (mapEl.dataset.rpMapBound === '1') return;
      mapEl.dataset.rpMapBound = '1';
      mapEl.style.cursor = 'pointer';
      mapEl.setAttribute('role', 'link');
      mapEl.setAttribute('tabindex', '0');
      mapEl.setAttribute('aria-label', 'Abrir ubicación en Google Maps');
      function openMap() {
        global.open(url, '_blank', 'noopener');
      }
      mapEl.addEventListener('click', openMap);
      mapEl.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          openMap();
        }
      });
    });
  }

  function wireLive(root, u) {
    root.querySelectorAll('.live-card__btn').forEach(function (a) {
      aplicarEnlace(a, recordatorioLiveUrl(u), {
        blank: true,
        ariaLabel: 'Activar recordatorio del live'
      });
    });
    root.querySelectorAll('.live-neg__cta').forEach(function (a) {
      aplicarEnlace(a, liveUrl(u), { blank: true, ariaLabel: 'Ver transmisión en vivo' });
    });
  }

  function wireReservas(root, u) {
    root.querySelectorAll('.pb-negocio-promo__cta').forEach(function (a) {
      var href = reservarUrl(u);
      aplicarEnlace(a, href, { blank: /^https?:\/\//i.test(href) });
    });
  }

  function wirePublicar(root, u) {
    var cards = root.querySelectorAll('.pubstrip .pubcard');
    if (cards[0]) aplicarEnlace(cards[0], publicarUrl(u, 'estado'));
    if (cards[1]) aplicarEnlace(cards[1], publicarUrl(u, 'live'));
  }

  function wireNav(root, u) {
    var q = queryPerfil();
    root.querySelectorAll('.pnav a').forEach(function (a) {
      var labelEl = a.querySelector('.pnav__label');
      var label = (labelEl ? labelEl.textContent : a.textContent || '').trim().toLowerCase();
      if (/resultado/i.test(label)) aplicarEnlace(a, resultadosHref(q));
      else if (/mensaje/i.test(label)) aplicarEnlace(a, mensajesUrl(u));
      else if (/favorit/i.test(label)) {
        aplicarEnlace(a, indexHref({ abrir: 'registro', intencion: 'favoritos', perfil: perfilId(u) }));
      } else if (/notific/i.test(label)) {
        aplicarEnlace(a, indexHref({ abrir: 'registro', intencion: 'notificaciones' }));
      }
    });
  }

  function wireProfesional(root, u) {
    root.querySelectorAll('.pro-cta-cita').forEach(function (btn) {
      btn.addEventListener('click', function () {
        global.location.href = agendarCitaUrl(u);
      });
    });
    root.querySelectorAll('.pro-consultorio__addr').forEach(function (el) {
      var addr = (el.textContent || '').trim();
      if (!addr) return;
      el.style.cursor = 'pointer';
      el.style.textDecoration = 'underline';
      el.setAttribute('role', 'link');
      el.setAttribute('tabindex', '0');
      el.addEventListener('click', function () {
        global.open(mapsUrl(u, addr), '_blank', 'noopener');
      });
    });
  }

  function wire(root, u) {
    root = root || global.document.getElementById('wrap');
    u = u || {};
    if (!root) return;
    marcarSecciones(root);
    wireVerTodas(root);
    wireMapas(root, u);
    wireLive(root, u);
    wireReservas(root, u);
    wirePublicar(root, u);
    wireNav(root, u);
    wireProfesional(root, u);
    global.__perfilActual = u;
  }

  global.CariHubPerfilEnlaces = {
    mapsUrl: mapsUrl,
    liveUrl: liveUrl,
    recordatorioLiveUrl: recordatorioLiveUrl,
    reservarUrl: reservarUrl,
    publicarUrl: publicarUrl,
    mensajesUrl: mensajesUrl,
    agendarCitaUrl: agendarCitaUrl,
    resultadosHref: resultadosHref,
    marcarSecciones: marcarSecciones,
    wire: wire
  };
})(typeof window !== 'undefined' ? window : globalThis);
