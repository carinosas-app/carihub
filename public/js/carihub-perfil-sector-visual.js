/**
 * Perfil público — capa visual por sector/LGBT (Fase A).
 * Reutiliza CariHubResultadosSector; no toca contrato tarjeta→ficha ni resolverVistaPerfil.
 */
(function (global) {
  'use strict';

  var VISTA_CATEGORIA = {
    medico: 'Doctor General',
    escort: 'Cariñosas',
    escortGay: 'escort gay',
    escortVip: 'escort vip',
    femboy: 'femboy',
    trans: 'trans',
    lesbians: 'lesbians',
    tomBoy: 'tom boy',
    tomFem: 'tom fem',
    antroLgbt: 'antro restaurant bar lgbt',
    spa: 'spa',
    masajesLocal: 'masajes',
    hotelMotel: 'hotel motel',
    sexShop: 'sex shop',
    antro: 'antro restaurant bar'
  };

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function assetBase() {
    return (global.location && global.location.pathname.indexOf('/preview/') >= 0) ? '../' : '';
  }

  function queryPerfil() {
    if (global.CariHubPerfilPublico && CariHubPerfilPublico.queryPerfilPublico) {
      return CariHubPerfilPublico.queryPerfilPublico();
    }
    try {
      var p = new URL(global.location.href).searchParams;
      return { categoria: p.get('categoria') || '' };
    } catch (e) {
      return { categoria: '' };
    }
  }

  /** Categoría efectiva para tema/banners: query > perfil > vista. */
  function categoriaDePerfil(u, q, vista) {
    q = q || queryPerfil();
    u = u || global.__perfilActual || {};
    if (q.categoria) return q.categoria;
    if (u.categoriaPublica) return u.categoriaPublica;
    if (u.categoria) return u.categoria;
    if (u.subcategoriaId) return String(u.subcategoriaId).replace(/_/g, ' ');
    if (vista && VISTA_CATEGORIA[vista]) return VISTA_CATEGORIA[vista];
    return '';
  }

  function labelsDeSector(cat) {
    var rs = global.CariHubResultadosSector;
    if (rs && rs.esSubcategoriaLgbt && rs.esSubcategoriaLgbt(cat)) {
      return Object.assign({}, global.CARIHUB_LGBT_BANNER_LABELS || {
        izquierda: 'Anúnciate aquí',
        centro: 'Anúnciate aquí',
        derecha: 'Anúnciate aquí',
        inferior: 'Promociona tu perfil — Anúnciate aquí'
      });
    }
    if (!rs || !rs.sectorDeCategoria) return {};
    var sector = rs.sectorDeCategoria(cat);
    if (sector === 'adultos') return {};
    var custom = global.CARIHUB_SECTOR_BANNER_LABELS;
    return (custom && custom[sector]) ? Object.assign({}, custom[sector]) : {};
  }

  function buildDots(count) {
    if (count < 2) return '';
    var html = '<div class="pb-slot__dots" aria-hidden="true">';
    for (var i = 0; i < count; i++) {
      html += '<span class="pb-slot__dot' + (i === 0 ? ' is-on' : '') + '"></span>';
    }
    return html + '</div>';
  }

  function buildSlides(imgs, offset, alt) {
    var html = '';
    for (var i = 0; i < imgs.length; i++) {
      var on = i === 0;
      html +=
        '<div class="pb-slot__slide' + (on ? ' is-active' : '') + '" aria-hidden="' + (on ? 'false' : 'true') + '">' +
          '<img src="' + esc(assetBase() + imgs[(i + offset) % imgs.length]) + '" alt="' + esc(alt) + '" decoding="async">' +
        '</div>';
    }
    return html;
  }

  function aplicarSlotSector(anchor, imgs, offset, alt) {
    if (!anchor || anchor.classList.contains('pb-slot--rented')) return false;
    var stage = anchor.querySelector('.pb-slot__stage');
    if (!stage || !imgs || !imgs.length) return false;
    stage.innerHTML = buildSlides(imgs, offset, alt) + buildDots(imgs.length);
    anchor.setAttribute('aria-label', alt);
    anchor.setAttribute('data-perfil-sector-banner', '1');
    return true;
  }

  /** Sustituye banners demo por sector/LGBT cuando no hay renta activa. */
  function aplicarBannersSector(cat) {
    var rs = global.CariHubResultadosSector;
    if (!rs || !rs.bannersDeSector) return false;
    var imgs = rs.bannersDeSector(cat);
    if (!imgs || !imgs.length) return false;

    var labels = labelsDeSector(cat);
    var slots = [
      { key: 'izquierda', offset: 0 },
      { key: 'centro', offset: 1 },
      { key: 'derecha', offset: 2 }
    ];
    var changed = false;
    var pb = document.querySelector('.pb');
    if (pb) {
      var anchors = pb.querySelectorAll('.pb-slot:not(.pb-slot--bottom)');
      for (var i = 0; i < anchors.length && i < slots.length; i++) {
        var cfg = slots[i];
        var alt = labels[cfg.key] || 'Anuncia tu negocio';
        if (aplicarSlotSector(anchors[i], imgs, cfg.offset, alt)) changed = true;
      }
    }
    document.querySelectorAll('.pb-slot--bottom').forEach(function (anchor) {
      var altInf = labels.inferior || 'Promociona tu perfil';
      if (aplicarSlotSector(anchor, imgs, 0, altInf)) changed = true;
    });
    return changed;
  }

  function aplicarTema(u, q, vista) {
    var rs = global.CariHubResultadosSector;
    if (!rs || !rs.aplicarTemaSector) return '';
    var cat = categoriaDePerfil(u, q, vista);
    if (!cat) {
      rs.aplicarTemaSector('adultos');
      return 'adultos';
    }
    return rs.aplicarTemaSector(cat);
  }

  /** Pintura temprana desde ?categoria= para reducir flash rosa. */
  function pinturaTempranaDesdeQuery() {
    try {
      var cat = new URL(global.location.href).searchParams.get('categoria');
      if (!cat) return;
      var rs = global.CariHubResultadosSector;
      if (rs && rs.aplicarTemaSector) rs.aplicarTemaSector(cat);
    } catch (e) { /* opcional */ }
  }

  function sincronizar(u, q, vista) {
    var cat = categoriaDePerfil(u, q, vista);
    aplicarTema(u, q, vista);
    aplicarBannersSector(cat);
    return cat;
  }

  global.CariHubPerfilSectorVisual = {
    categoriaDePerfil: categoriaDePerfil,
    aplicarTema: aplicarTema,
    aplicarBannersSector: aplicarBannersSector,
    pinturaTempranaDesdeQuery: pinturaTempranaDesdeQuery,
    sincronizar: sincronizar
  };
})(typeof window !== 'undefined' ? window : globalThis);
