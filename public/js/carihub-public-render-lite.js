(function (global) {
  'use strict';

  var PUB_BLOCKS = ['edad', 'modalidad', 'descripcion', 'precio', 'horario', 'servicios'];

  function safeTxt(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function normTxt(t) {
    return String(t || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function svgIco(name, cls) {
    cls = cls || 'mc-ic';
    var p = {
      pin: '<path d="M12 21c4.5-5 7-8.3 7-11a7 7 0 1 0-14 0c0 2.7 2.5 6 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
      money: '<rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.2"/>',
      home: '<path d="M4 11.5 12 5l8 6.5"/><path d="M6 10.5V19h12v-8.5"/>',
      hotel: '<path d="M8 6v12M16 6v12M6 10h12M6 14h12"/>',
      car: '<path d="M5 11l1.4-4.2A2 2 0 0 1 8.3 5.4h7.4a2 2 0 0 1 1.9 1.4L19 11"/><rect x="3.2" y="11" width="17.6" height="6" rx="2"/><circle cx="7.5" cy="17.5" r="1.4"/><circle cx="16.5" cy="17.5" r="1.4"/>',
      heart: '<path d="M12 20.2l-.9-.8C6.8 15.2 4.5 12.6 4.5 9.8 4.5 7 6.6 5 9.4 5c1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1 2.8 0 4.9 2 4.9 4.8 0 2.8-2.3 5.4-6.6 9.4l-.9.9z" fill="currentColor" stroke="none"/>',
      camera: '<path d="M4 8.5h3l1.6-2.2h6.8L17 8.5h3a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7a2 2 0 012-2z"/><circle cx="12" cy="13" r="3.2"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>',
      shield: '<path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/>'
    };
    return '<span class="' + cls + '" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (p[name] || p.briefcase) + '</svg></span>';
  }

  function verificadoIconHTML(label) {
    label = label || 'Verificada';
    return '<span class="res-card__vcheck" aria-label="' + safeTxt(label) + '">' +
      '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="10" cy="10" r="8.25"/><path d="M6.4 10.1 8.7 12.4 13.7 7.6"/>' +
      '</svg></span>';
  }

  function modalidadesSet(u) {
    var set = {};
    if (Array.isArray(u.modalidades)) {
      u.modalidades.forEach(function (m) {
        var n = normTxt(String(m));
        if (n === 'recibe' || n.indexOf('recib') !== -1 || n.indexOf('lugar') !== -1) set.recibe = true;
        else if (n === 'hotel' || n.indexOf('hotel') !== -1) set.hotel = true;
        else if (n === 'domicilio' || n.indexOf('domicil') !== -1) set.domicilio = true;
      });
    }
    return set;
  }

  function chipModalidadHTML(set) {
    var items = [];
    if (set.recibe) items.push('<span class="modchip mc-pink">' + svgIco('home') + 'Recibe</span>');
    if (set.hotel) items.push('<span class="modchip mc-purple">' + svgIco('hotel') + 'Hotel</span>');
    if (set.domicilio) items.push('<span class="modchip mc-orange">' + svgIco('car') + 'Domicilio</span>');
    return items.join('');
  }

  function ubicacionCorta(u) {
    if (u.ubicacion) return String(u.ubicacion).trim();
    var z = String(u.zona || '').trim();
    var c = String(u.ciudad || '').trim();
    if (z && c && z !== c) return z + ', ' + c;
    return z || c || '';
  }

  function precioTexto(u, opts) {
    opts = opts || {};
    var p = u.precio || u.precioDesde;
    if (p == null || String(p).trim() === '') return 'Consultar';
    var s = String(p).trim();
    return /^\$|mxn|usd|consult/i.test(s) ? s : '$' + s;
  }

  function numFotos(u) {
    if (u.fotosCount != null) return u.fotosCount;
    return u.fotoURL ? 1 : 0;
  }

  function disponibilidadDe(u) {
    if (global.CariHubMessengerPrivacidadUi && CariHubMessengerPrivacidadUi.disponibilidadCard) {
      return CariHubMessengerPrivacidadUi.disponibilidadCard(u);
    }
    var d = normTxt(u.disponibilidad || u.estatus || u.horario || '');
    if (d.indexOf('ocup') !== -1 || d.indexOf('cerr') !== -1) {
      return { clase: 'neutral', txt: 'Consultar disponibilidad', busy: true };
    }
    return { clase: 'neutral', txt: 'Consultar disponibilidad', busy: false };
  }

  function descripcionCompactHTML(u, label) {
    label = label || 'Descripción';
    var txt = String(u.descripcion || u.tagline || u.descripcionPublica || u.serviciosPrincipales || '').trim();
    if (!txt) return '';
    return '<p class="res-card__desc">' +
      '<span class="res-card__desc-label">' + safeTxt(label) + '</span>' +
      '<span class="res-card__desc-txt">' + safeTxt(txt) + '</span>' +
      '</p>';
  }

  function badgesCompactHTML(u, opts) {
    opts = opts || {};
    var items = [];
    if (opts.vip) items.push('<span class="res-badge res-badge--vip">VIP</span>');
    if (opts.cedula) items.push('<span class="res-badge res-badge--ver">Cédula</span>');
    if (opts.negocio) items.push('<span class="res-badge res-badge--ver">Verificado</span>');
    if (opts.respRapida) items.push('<span class="res-badge res-badge--fast">Respuesta rápida</span>');
    else if (u.nueva) items.push('<span class="res-badge res-badge--new">Nueva</span>');
    if (!items.length) return '';
    return items.join('');
  }

  function resolveComponente(u, Q) {
    if (u && u.__componenteResultados) return u.__componenteResultados;
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolvePublicPresentation) {
      var pres = CariHubFieldEngineLite.resolvePublicPresentation({
        subcategoriaId: u && u.subcategoriaId,
        categoria: (u && (u.categoria || u.categoriaPublica)) || (Q && Q.categoria)
      });
      return pres.componenteResultados || 'ResultCardAdultos';
    }
    return 'ResultCardAdultos';
  }

  function cardShell(u, Q, opts) {
    opts = opts || {};
    Q = Q || {};
    var nombre = opts.nombre || u.nombre || u.alias || u.nombreComercial || 'Perfil';
    var loc = ubicacionCorta(u);
    var catLabel = opts.catLabel || (u.categoriaPublica || u.categoria || Q.categoria || '');
    var fotos = numFotos(u);
    var disp = disponibilidadDe(u);
    var verificada = u.verificada === true || u.verificado === true || u.cedulaVerificada === true;
    var verLabel = u.cedulaVerificada ? 'Cédula verificada' : (opts.verLabel || 'Verificada');
    var perfilId = u.__id || '';
    var favBtn = perfilId
      ? '<button type="button" class="res-fav" data-fav-perfil="' + safeTxt(perfilId) + '" aria-label="Guardar en favoritos" aria-pressed="false" onclick="toggleFav(this, event)">♡</button>'
      : '';
    var extraClass = opts.cardClass || '';
    var headExtra = opts.headExtra || '';
    var metaRight = opts.metaRight || '';
    var descBlock = opts.descBlock != null ? opts.descBlock : descripcionCompactHTML(u);
    var priceLabel = opts.priceLabel || 'Desde';
    var priceBlock =
      '<div class="res-card__price">' +
        '<span class="res-card__price-ic" aria-hidden="true">' + svgIco('money', 'res-card__price-ic') + '</span>' +
        '<span class="res-card__price-desde">' + safeTxt(priceLabel) + '</span>' +
        '<span class="res-card__price-val">' + safeTxt(precioTexto(u)) + '</span>' +
      '</div>';
    var metaRow = '';
    if (loc || metaRight) {
      metaRow = '<div class="res-card__row res-card__row--meta">' +
        (loc ? '<div class="res-card__loc">' + svgIco('pin', 'res-card__loc-ic') + '<span>' + safeTxt(loc) + '</span></div>' : '<span class="res-card__loc-spacer" aria-hidden="true"></span>') +
        (metaRight ? '<div class="res-card__mods">' + metaRight + '</div>' : '') +
      '</div>';
    }
    var footer = '';
    var badges = opts.badges || '';
    if (catLabel || badges) {
      footer = '<div class="res-card__row res-card__row--foot">' +
        (catLabel ? '<div class="res-card__cat">' + svgIco(opts.catIcon || 'heart', 'res-card__cat-ic') + '<span>' + safeTxt(catLabel) + '</span></div>' : '<span class="res-card__cat-spacer" aria-hidden="true"></span>') +
        (badges ? '<div class="res-card__badges">' + badges + '</div>' : '') +
        '</div>';
    }
    var imgSrc = u.fotoURL || (u.__previewRegistro ? '' : 'img/resultados-demo/violeta-1.png');
    var mediaInner = imgSrc
      ? '<img src="' + safeTxt(imgSrc) + '" alt="Foto de ' + safeTxt(nombre) + '" width="360" height="210" loading="lazy" decoding="async">'
      : '<div class="res-card__media-placeholder" aria-hidden="true">Sin foto</div>';
    return '' +
      '<article class="pcard res-card res-card--compact ' + extraClass + '">' +
        '<div class="res-card__media">' +
          (u.nueva ? '<span class="res-nueva">NUEVA</span>' : '') +
          mediaInner +
          (fotos > 0 ? '<span class="gal__count">' + svgIco('camera', 'res-fotos-ic') + fotos + '</span>' : '') +
        '</div>' +
        '<div class="res-card__body">' +
          '<div class="res-card__main">' +
            '<div class="res-card__row res-card__row--head">' +
              '<div class="res-card__head">' +
                '<h2 class="res-card__name">' + safeTxt(nombre) + '</h2>' +
                (verificada ? verificadoIconHTML(verLabel) : '') +
                headExtra +
              '</div>' +
              favBtn +
              '<span class="res-card__avail res-card__avail--' + disp.clase + '">' +
                '<span class="res-dot res-dot--' + disp.clase + '" aria-hidden="true"></span>' +
                safeTxt(disp.txt) +
              '</span>' +
              priceBlock +
            '</div>' +
            descBlock +
            metaRow +
            footer +
          '</div>' +
          '<button class="res-card__ver-btn" type="button" aria-label="Ver perfil de ' + safeTxt(nombre) + '" onclick="abrirPerfil(\'' + safeTxt(perfilId) + '\')">' +
            '<span class="res-card__ver-btn-txt">Ver perfil ›</span>' +
          '</button>' +
        '</div>' +
      '</article>';
  }

  function cardHTMLAdultos(u, Q) {
    Q = Q || {};
    var edad = u.edad != null ? String(u.edad).trim() + ' años' : '';
    var set = modalidadesSet(u);
    var mods = chipModalidadHTML(set);
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || '');
    var vip = u.vip === true || u.esVip === true || /vip/i.test(String(catLabel || ''));
    return cardShell(u, Q, {
      cardClass: 'res-card--adult',
      headExtra: edad ? '<span class="age">' + safeTxt(edad) + '</span>' : '',
      metaRight: mods,
      catLabel: catLabel,
      badges: badgesCompactHTML(u, { vip: vip, respRapida: u.respuestaRapida !== false })
    });
  }

  function cardHTMLNegocio(u, Q) {
    Q = Q || {};
    var horario = String(u.horario || u.horarioPublico || '').trim();
    var metaRight = horario
      ? '<span class="modchip mc-purple res-card__horario-chip">' + svgIco('clock') + safeTxt(horario.length > 28 ? horario.slice(0, 26) + '…' : horario) + '</span>'
      : '<span class="modchip mc-pink">' + svgIco('home') + 'Local</span>';
    return cardShell(u, Q, {
      cardClass: 'res-card--negocio',
      nombre: u.nombreComercial || u.nombre || u.alias,
      catIcon: 'briefcase',
      catLabel: u.categoriaPublica || u.categoria || Q.categoria,
      metaRight: metaRight,
      descBlock: descripcionCompactHTML(u, 'Servicios'),
      badges: badgesCompactHTML(u, { negocio: u.verificada !== false })
    });
  }

  function cardHTMLServicio(u, Q) {
    Q = Q || {};
    var cobertura = String(u.zonaCobertura || u.zona || u.serviciosPrincipales || 'A domicilio').trim();
    var metaRight = '<span class="modchip mc-orange">' + svgIco('car') + safeTxt(cobertura.length > 24 ? cobertura.slice(0, 22) + '…' : cobertura) + '</span>';
    var esp = u.especialidad || u.serviciosPrincipales || u.titulo || '';
    return cardShell(u, Q, {
      cardClass: 'res-card--servicio',
      catIcon: 'briefcase',
      catLabel: u.categoriaPublica || u.categoria || Q.categoria,
      metaRight: metaRight,
      descBlock: descripcionCompactHTML(Object.assign({}, u, { tagline: u.tagline || esp }), 'Servicio'),
      priceLabel: 'Tarifa desde',
      badges: badgesCompactHTML(u, { respRapida: u.respuestaRapida !== false })
    });
  }

  function cardHTMLProfesional(u, Q) {
    Q = Q || {};
    var esp = u.especialidad || u.serviciosPrincipales || u.titulo || u.profesion || '';
    var metaRight = esp
      ? '<span class="modchip mc-purple res-card__esp-chip">' + svgIco('shield') + safeTxt(esp.length > 26 ? esp.slice(0, 24) + '…' : esp) + '</span>'
      : '';
    return cardShell(u, Q, {
      cardClass: 'res-card--profesional',
      catIcon: 'shield',
      catLabel: u.categoriaPublica || u.categoria || Q.categoria,
      metaRight: metaRight,
      descBlock: descripcionCompactHTML(u, 'Especialidad'),
      priceLabel: 'Consulta desde',
      verLabel: 'Profesional verificado',
      badges: badgesCompactHTML(u, { cedula: u.cedulaVerificada === true || u.verificado === true })
    });
  }

  function cardHTML(u, Q) {
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.enriquecerPerfilPublico) {
      CariHubFieldEngineLite.enriquecerPerfilPublico(u, {
        categoria: Q && Q.categoria,
        subcategoriaId: u.subcategoriaId
      });
    }
    var comp = resolveComponente(u, Q);
    if (comp === 'ResultCardNegocio') return cardHTMLNegocio(u, Q);
    if (comp === 'ResultCardProfesional') return cardHTMLProfesional(u, Q);
    if (comp === 'ResultCardServicio') return cardHTMLServicio(u, Q);
    return cardHTMLAdultos(u, Q);
  }

  function setBlockVisibility(el, vis) {
    if (!el) return;
    if (vis) {
      el.style.display = '';
      el.removeAttribute('aria-hidden');
      el.classList.remove('pub-block--hidden');
    } else {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
      el.classList.add('pub-block--hidden');
    }
  }

  function formatPrecioLabel(text) {
    text = String(text || '').trim();
    if (!text) return '';
    if (/^💲/.test(text)) return text;
    if (/desde/i.test(text)) return '💲 ' + text;
    return '💲 ' + text + (/\//.test(text) ? '' : ' desde');
  }

  function applyPublicProfileLabels(container, labels) {
    labels = labels || {};
    if (labels.precio) {
      container.querySelectorAll('[data-pub-label="precio"]').forEach(function (el) {
        var txt = String(labels.precio);
        if (el.classList.contains('lbl')) {
          el.textContent = formatPrecioLabel(txt);
        } else if (el.classList.contains('precio-desde')) {
          el.textContent = /desde/i.test(txt) ? txt.replace(/^💲\s*/, '') : txt;
        }
      });
    }
    if (labels.servicios) {
      container.querySelectorAll('[data-pub-label="servicios"]').forEach(function (el) {
        el.textContent = String(labels.servicios);
      });
    }
  }

  function applyPublicProfilePresentation(container, u) {
    if (!container) return null;
    u = u || {};
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.enriquecerPerfilPublico) {
      CariHubFieldEngineLite.enriquecerPerfilPublico(u, {
        subcategoriaId: u.subcategoriaId,
        categoria: u.categoria || u.categoriaPublica,
        sectorId: u.sectorId
      });
    }
    var pres = null;
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolvePublicPresentation) {
      pres = CariHubFieldEngineLite.resolvePublicPresentation({
        subcategoriaId: u.subcategoriaId,
        categoria: u.categoria || u.categoriaPublica,
        sectorId: u.sectorId
      });
    }
    if (!pres || !pres.registro || !pres.registro.ui) return pres;
    var ui = pres.registro.ui;
    var show = ui.show || [];
    var hide = ui.hide || [];
    var labels = ui.labels || {};

    function visible(key) {
      return show.indexOf(key) >= 0 && hide.indexOf(key) < 0;
    }

    PUB_BLOCKS.forEach(function (key) {
      var vis = visible(key);
      container.querySelectorAll('[data-pub-block="' + key + '"]').forEach(function (el) {
        setBlockVisibility(el, vis);
      });
    });

    applyPublicProfileLabels(container, labels);

    var body = document.body;
    if (body) {
      body.setAttribute('data-ch-formulario-id', pres.formularioId || '');
      body.setAttribute('data-ch-arquetipo', pres.arquetipo || '');
      body.setAttribute('data-ch-ui-id', (pres.registro && pres.registro.formularioUiId) || '');
    }

    return pres;
  }

  global.CariHubPublicRenderLite = {
    cardHTML: cardHTML,
    cardHTMLAdultos: cardHTMLAdultos,
    cardHTMLNegocio: cardHTMLNegocio,
    cardHTMLServicio: cardHTMLServicio,
    cardHTMLProfesional: cardHTMLProfesional,
    resolveComponente: resolveComponente,
    applyPublicProfilePresentation: applyPublicProfilePresentation,
    PUB_BLOCKS: PUB_BLOCKS
  };
})(typeof window !== 'undefined' ? window : globalThis);
