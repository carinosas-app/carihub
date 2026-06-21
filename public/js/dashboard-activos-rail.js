/**
 * Rail de activos — columna izquierda del dashboard rentero.
 * Perfiles, banners y lives renderizados desde datos (no HTML fijo).
 * El centro reacciona según módulo activo (TICKET-045): Inicio → preview;
 * Mensajes → filtra hilos por contexto; el padre escucha carihub:dash-activo-select.
 */
(function (global) {
  'use strict';

  var state = {
    perfiles: [],
    banners: [],
    lives: [],
    seleccion: { tipo: 'perfil', id: null },
    onSelect: null
  };

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderTile(item) {
    var selected = state.seleccion.tipo === item.tipo && state.seleccion.id === item.id;
    var unread = Number(item.unread || 0);
    var avisosUnread = Number(item.avisosUnread || 0);
    var solPending = Number(item.solPending || 0);
    var blocked = item.tipo === 'banner' && item.mensajesBloqueado;
    if (blocked) unread = 0;
    var badge = unread > 0
      ? '<span class="dash-activos-tile__badge" aria-label="' + esc(unread) + ' sin leer">' +
        esc(unread > 99 ? '99+' : unread) + '</span>'
      : '';
    var avisoBadge = avisosUnread > 0 && !blocked
      ? '<span class="dash-activos-tile__badge dash-activos-tile__badge--avisos" aria-label="' +
        esc(avisosUnread) + ' avisos">' +
        esc(avisosUnread > 99 ? '99+' : avisosUnread) + '</span>'
      : '';
    var solBadge = solPending > 0 && !blocked
      ? '<span class="dash-activos-tile__badge dash-activos-tile__badge--sol" aria-label="' +
        esc(solPending) + ' solicitudes">' +
        esc(solPending > 99 ? '99+' : solPending) + '</span>'
      : '';
    var lockBadge = blocked
      ? '<span class="dash-activos-tile__lock" aria-label="Conversaciones bloqueadas">🔒</span>'
      : '';
    var metricsBtn = item.tipo === 'banner'
      ? '<button type="button" class="dash-activos-tile__metrics" data-banner-metrics="' +
        esc(item.id) + '" aria-label="Métricas del banner" title="Métricas">📊</button>'
      : '';
    var cls = ['dash-activos-tile', 'dash-activos-tile--' + item.tipo];
    if (selected) cls.push('is-selected');
    if (item.publicado) cls.push('is-publicado');
    if (unread > 0 && !selected && !blocked) cls.push('has-unread');
    if (avisosUnread > 0 && !selected && !blocked) cls.push('has-avisos-unread');
    if (solPending > 0 && !selected && !blocked) cls.push('has-sol-pending');
    if (blocked) cls.push('is-blocked-mensajes');

    return '<div class="dash-activos-tile-wrap">' +
      metricsBtn +
      '<button type="button" class="' + cls.join(' ') + '"' +
      ' data-tipo="' + esc(item.tipo) + '"' +
      ' data-id="' + esc(item.id) + '"' +
      ' title="' + esc(item.subtitulo || item.nombre || '') + '">' +
      '<span class="dash-activos-tile__ring">' +
        '<img class="dash-activos-tile__img" src="' + esc(item.foto) + '" alt="" loading="lazy" decoding="async">' +
        badge +
        avisoBadge +
        solBadge +
        lockBadge +
      '</span>' +
      '<span class="dash-activos-tile__label">' + esc(item.nombre) + '</span>' +
      (blocked && item.bloqueoEtiqueta
        ? '<span class="dash-activos-tile__state">' + esc(item.bloqueoEtiqueta) + '</span>'
        : '') +
    '</button></div>';
  }

  function bindTiles(container) {
    if (!container) return;
    container.querySelectorAll('.dash-activos-tile').forEach(function (btn) {
      var longTimer = null;
      var longFired = false;

      function clearLong() {
        if (longTimer) {
          clearTimeout(longTimer);
          longTimer = null;
        }
      }

      function startLong() {
        clearLong();
        if (btn.dataset.tipo !== 'banner') return;
        longFired = false;
        longTimer = setTimeout(function () {
          longFired = true;
          global.document.dispatchEvent(new CustomEvent('carihub:dash-banner-metrics', {
            detail: { bannerId: btn.dataset.id }
          }));
        }, 650);
      }

      btn.addEventListener('mousedown', startLong);
      btn.addEventListener('touchstart', startLong, { passive: true });
      btn.addEventListener('mouseup', clearLong);
      btn.addEventListener('mouseleave', clearLong);
      btn.addEventListener('touchend', clearLong);
      btn.addEventListener('touchcancel', clearLong);

      btn.addEventListener('click', function (ev) {
        if (longFired) {
          ev.preventDefault();
          ev.stopPropagation();
          longFired = false;
          return;
        }
        var tipo = btn.dataset.tipo;
        var id = btn.dataset.id;
        if (!tipo || !id) return;
        state.seleccion = { tipo: tipo, id: id };
        render();
        var detail = { tipo: tipo, id: id };
        if (typeof state.onSelect === 'function') state.onSelect(detail);
        global.document.dispatchEvent(new CustomEvent('carihub:dash-activo-select', { detail: detail }));
      });
    });

    container.querySelectorAll('[data-banner-metrics]').forEach(function (metricsBtn) {
      metricsBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var id = metricsBtn.getAttribute('data-banner-metrics');
        if (!id) return;
        global.document.dispatchEvent(new CustomEvent('carihub:dash-banner-metrics', {
          detail: { bannerId: id }
        }));
      });
    });
  }

  function renderSection(containerId, items, emptyMsg, emptyHtml) {
    var el = global.document.getElementById(containerId);
    if (!el) return;
    if (!items.length) {
      var body = emptyHtml ? emptyMsg : esc(emptyMsg);
      el.innerHTML = '<p class="dash-hint dash-hint--compact">' + body + '</p>';
      return;
    }
    el.innerHTML = '<div class="dash-activos-tiles" role="list">' + items.map(renderTile).join('') + '</div>';
    bindTiles(el);
  }

  function render() {
    renderSection('publicationList', state.perfiles, 'Sin perfiles. <a href="registro-perfil.html">+ Nuevo perfil</a>', true);
    renderSection(
      'bannersListSide',
      state.banners,
      'Sin banners. <a href="registro-banner.html">Renta uno</a>',
      true
    );
    renderSection('livesListSide', state.lives, 'Sin lives. Programa uno con + Nuevo live.');
  }

  global.DashActivosRail = {
    init: function (opts) {
      opts = opts || {};
      state.onSelect = opts.onSelect || null;
      render();
    },
    setData: function (data) {
      data = data || {};
      if (data.perfiles) state.perfiles = data.perfiles;
      if (data.banners) state.banners = data.banners;
      if (data.lives) state.lives = data.lives;
      if (data.seleccion) state.seleccion = data.seleccion;
      render();
    },
    setSeleccion: function (tipo, id) {
      state.seleccion = { tipo: tipo, id: id };
      render();
    },
    getSeleccion: function () {
      return { tipo: state.seleccion.tipo, id: state.seleccion.id };
    },
    render: render
  };
})(typeof window !== 'undefined' ? window : globalThis);
