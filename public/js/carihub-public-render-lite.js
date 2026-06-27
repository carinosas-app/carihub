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
      plane: '<path d="M16 10l4-2-2 6-2-1-2 3-1-5-5-1 1-3h4l2-3z"/>',
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
        else if (n === 'viaja' || n.indexOf('viaj') !== -1) set.viaja = true;
      });
    }
    if (!set.viaja && u.viajesDesplazamiento && u.viajesDesplazamiento.viaja === true) set.viaja = true;
    return set;
  }

  function chipModalidadHTML(set) {
    var items = [];
    if (set.recibe) items.push('<span class="modchip mc-pink">' + svgIco('home') + 'Recibe</span>');
    if (set.hotel) items.push('<span class="modchip mc-purple">' + svgIco('hotel') + 'Hotel</span>');
    if (set.domicilio) items.push('<span class="modchip mc-orange">' + svgIco('car') + 'Domicilio</span>');
    if (set.viaja) items.push('<span class="modchip mc-teal">' + svgIco('plane') + 'Viaja</span>');
    return items.join('');
  }

  function cardViajesExtraHTML(u) {
    if (!global.CariHubViajesDesplazamiento) return '';
    var sum = CariHubViajesDesplazamiento.cardViajesSummary(u);
    if (!sum || sum === 'Viaja: Sí') return '';
    return '<p class="res-card__viajes-resumen">' + safeTxt(sum) + '</p>';
  }

  function lesbiansMostrarPublico(u, visibilityKey, contentVal) {
    if (!contentVal) return false;
    var vis = u[visibilityKey];
    if (vis != null && String(vis).trim() !== '') return String(vis).trim() === 'Sí';
    return true;
  }

  function isLesbiansPerfil(u) {
    var id = normTxt(u.subcategoriaId || u.subcategoria || '');
    return id === 'lesbians';
  }

  function lesbiansCardExtraHTML(u) {
    if (!isLesbiansPerfil(u)) return '';
    var lines = [];
    if (lesbiansMostrarPublico(u, 'mostrarAtiendoA', u.atiendoA)) {
      lines.push('Atiende a: ' + String(u.atiendoA).trim());
    }
    if (lesbiansMostrarPublico(u, 'mostrarColaboraciones', u.haceColaboraciones)) {
      lines.push('Colaboraciones: ' + String(u.haceColaboraciones).trim());
    }
    if (!lines.length) return '';
    return '<p class="res-card__viajes-resumen">' + safeTxt(lines.join(' · ')) + '</p>';
  }

  function swingerMostrarPublico(u, visibilityKey, contentVal) {
    return lesbiansMostrarPublico(u, visibilityKey, contentVal);
  }

  function isSwingerPerfil(u) {
    var id = normTxt(u.subcategoriaId || u.subcategoria || '');
    return id === 'swinger' || id === 'parejas swinger';
  }

  function isCuckoldHotwifePerfil(u) {
    var id = normTxt(u.subcategoriaId || u.subcategoria || '').replace(/_/g, ' ');
    return id === 'cuckold hotwife' || id === 'cuckold_hotwife';
  }

  function cuckoldHotwifeMostrarPublico(u, visibilityKey, contentVal) {
    return lesbiansMostrarPublico(u, visibilityKey, contentVal);
  }

  function cuckoldHotwifeDinamicaLabel(u) {
    if (u.dinamicaLabel) return String(u.dinamicaLabel).trim();
    var din = String(u.dinamica || '').trim();
    if (din === 'hotwife') return 'Hotwife';
    if (din === 'cuckold') return 'Cuckold';
    if (din === 'ambos') return 'Ambos / pareja flexible';
    return din;
  }

  function cuckoldHotwifeCardBadgesHTML(u, opts) {
    opts = opts || {};
    return badgesCompactHTML(u, {
      pareja: true,
      hotwife: u.badgeHotwife === true,
      cuckold: u.badgeCuckold === true,
      respRapida: opts.respRapida
    });
  }

  function cardHTMLCuckoldHotwife(u, Q) {
    Q = Q || {};
    var set = modalidadesSet(u);
    var metaRight = set.viaja ? chipModalidadHTML({ viaja: true }) : '';
    var lines = [];
    var dinLabel = cuckoldHotwifeDinamicaLabel(u);
    if (dinLabel) lines.push(dinLabel);
    var buscanArr = Array.isArray(u.buscan) ? u.buscan : [];
    if (cuckoldHotwifeMostrarPublico(u, 'mostrarBuscan', buscanArr) && buscanArr.length) {
      lines.push('Buscan: ' + buscanArr.join(', '));
    }
    var descBlock = lines.length
      ? '<p class="res-card__desc res-card__desc--compact"><span class="res-card__desc-txt">' +
        safeTxt(lines.join(' · ')) + '</span></p>'
      : descripcionCompactHTML(u, 'Presentación');
    var viajesLine = set.viaja ? cardViajesExtraHTML(u) : '';
    var configLabel = u.configuracionGrupoLabel || u.tipoPareja || '';
    var headExtra = configLabel
      ? '<span class="age">' + safeTxt(String(configLabel)) + '</span>'
      : '';
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || 'Cuckold / Hotwife');
    return cardShell(u, Q, {
      cardClass: 'res-card--pareja res-card--cuckold-hotwife',
      nombre: u.aliasPareja || u.nombre || u.alias,
      headExtra: headExtra,
      metaRight: metaRight,
      descBlock: descBlock + viajesLine,
      catLabel: catLabel,
      catIcon: 'heart',
      badges: cuckoldHotwifeCardBadgesHTML(u, { respRapida: !u.__previewRegistro && u.respuestaRapida === true })
    });
  }

  function swingerObjetivoPrincipal(u) {
    if (!swingerMostrarPublico(u, 'mostrarObjetivosPerfil', u.objetivosPerfil)) return '';
    if (u.objetivoPrincipal) return String(u.objetivoPrincipal).trim();
    var arr = u.objetivosPerfil;
    if (!Array.isArray(arr) || !arr.length) return '';
    if (arr.indexOf('Todo lo anterior') >= 0) return 'Todo lo anterior';
    return String(arr[0]).trim();
  }

  function swingerCardExtraHTML(u) {
    return '';
  }

  function swingerCardBadgesHTML(u, opts) {
    opts = opts || {};
    var badges = badgesCompactHTML(u, {
      pareja: true,
      swinger: true,
      respRapida: opts.respRapida
    });
    if (u.experienciaEnLifestyle) {
      badges += '<span class="res-badge res-badge--lifestyle">' + safeTxt(u.experienciaEnLifestyle) + '</span>';
    }
    if (u.aceptanParejasPrincipiantes && String(u.aceptanParejasPrincipiantes).trim() !== 'No') {
      badges += '<span class="res-badge res-badge--principiantes">Principiantes: ' +
        safeTxt(u.aceptanParejasPrincipiantes) + '</span>';
    }
    return badges;
  }

  function cardHTMLParejaSwinger(u, Q) {
    Q = Q || {};
    var set = modalidadesSet(u);
    var metaRight = set.viaja ? chipModalidadHTML({ viaja: true }) : '';
    var lines = [];
    var obj = swingerObjetivoPrincipal(u);
    if (obj) lines.push(obj);
    var compat = [];
    if (swingerMostrarPublico(u, 'mostrarAtiendenA', u.atiendenA) && u.atiendenA) {
      compat.push('Atienden a: ' + String(u.atiendenA).trim());
    }
    if (u.intercambioSwinger) {
      compat.push('Intercambio: ' + String(u.intercambioSwinger).trim());
    }
    if (compat.length) lines.push(compat.join(' · '));
    var descBlock = lines.length
      ? '<p class="res-card__desc res-card__desc--compact"><span class="res-card__desc-txt">' +
        safeTxt(lines.join(' · ')) + '</span></p>'
      : descripcionCompactHTML(u, 'Presentación');
    var viajesLine = set.viaja ? cardViajesExtraHTML(u) : '';
    var configLabel = u.configuracionGrupoLabel || u.tipoPareja || '';
    var headExtra = configLabel
      ? '<span class="age">' + safeTxt(String(configLabel)) + '</span>'
      : '';
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || 'Swinger');
    return cardShell(u, Q, {
      cardClass: 'res-card--pareja res-card--swinger',
      nombre: u.aliasPareja || u.nombre || u.alias,
      headExtra: headExtra,
      metaRight: metaRight,
      descBlock: descBlock + viajesLine,
      catLabel: catLabel,
      catIcon: 'heart',
      badges: swingerCardBadgesHTML(u, { respRapida: !u.__previewRegistro && u.respuestaRapida === true })
    });
  }

  function isUnicornPerfil(u) {
    var id = normTxt(u.subcategoriaId || u.subcategoria || '');
    return id === 'unicorns' || id === 'unicorn';
  }

  function objetivoPrincipalUnicorn(u) {
    if (!lesbiansMostrarPublico(u, 'mostrarObjetivosPerfil', u.objetivosPerfil)) return '';
    var arr = u.objetivosPerfil;
    if (!Array.isArray(arr) || !arr.length) return '';
    if (arr.indexOf('Todo lo anterior') >= 0) return 'Todo lo anterior';
    return String(arr[0]).trim();
  }

  function cardHTMLUnicorn(u, Q) {
    Q = Q || {};
    var edad = u.edad != null ? String(u.edad).trim() + ' años' : '';
    var set = modalidadesSet(u);
    var metaRight = set.viaja ? chipModalidadHTML({ viaja: true }) : '';
    var lines = [];
    var obj = objetivoPrincipalUnicorn(u);
    if (obj) lines.push(obj);
    var busco = Array.isArray(u.buscoConocer) && u.buscoConocer.length
      ? u.buscoConocer.join(', ')
      : (Array.isArray(u.buscan) && u.buscan.length ? u.buscan.join(', ') : String(u.buscan || '').trim());
    if (busco) lines.push('Busco: ' + busco);
    var descBlock = lines.length
      ? '<p class="res-card__desc res-card__desc--compact"><span class="res-card__desc-txt">' + safeTxt(lines.join(' · ')) + '</span></p>'
      : descripcionCompactHTML(u, 'Presentación');
    var viajesLine = set.viaja ? cardViajesExtraHTML(u) : '';
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || '');
    return cardShell(u, Q, {
      cardClass: 'res-card--unicorn',
      headExtra: edad ? '<span class="age">' + safeTxt(edad) + '</span>' : '',
      metaRight: metaRight,
      descBlock: descBlock + viajesLine,
      catLabel: catLabel,
      badges: badgesCompactHTML(u, { unicorn: u.badgeUnicorn !== false })
    });
  }

  function cardPerfilExtraHTML(u) {
    return cardViajesExtraHTML(u) + lesbiansCardExtraHTML(u) + swingerCardExtraHTML(u);
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
    if (p == null || String(p).trim() === '') {
      return u.__previewRegistro ? '' : 'Consultar';
    }
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
    var d = normTxt(u.disponibilidad || u.estatus || '');
    if (!d && u.__previewRegistro) {
      return { clase: 'neutral', txt: '', busy: false, hidden: true };
    }
    if (d.indexOf('ocup') !== -1 || d.indexOf('cerr') !== -1) {
      return { clase: 'neutral', txt: 'Consultar disponibilidad', busy: true };
    }
    if (d.indexOf('dispon') !== -1 || d.indexOf('cita') !== -1) {
      return { clase: 'ok', txt: u.disponibilidad || 'Disponible', busy: false };
    }
    return { clase: 'neutral', txt: d || 'Consultar disponibilidad', busy: false };
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
    if (opts.pareja) items.push('<span class="res-badge res-badge--pareja">Pareja</span>');
    if (opts.swinger) items.push('<span class="res-badge res-badge--swinger">Swinger</span>');
    if (opts.vip) items.push('<span class="res-badge res-badge--vip">VIP</span>');
    if (opts.cedula) items.push('<span class="res-badge res-badge--ver">Cédula</span>');
    if (opts.negocio) items.push('<span class="res-badge res-badge--ver">Verificado</span>');
    if (opts.lgbt || u.badgeLgbt) items.push('<span class="res-badge res-badge--lgbt">LGBT+</span>');
    if (opts.hotwife || u.badgeHotwife) items.push('<span class="res-badge res-badge--hotwife">Hotwife</span>');
    if (opts.cuckold || u.badgeCuckold) items.push('<span class="res-badge res-badge--cuckold">Cuckold</span>');
    if (opts.unicorn || u.badgeUnicorn) items.push('<span class="res-badge res-badge--unicorn">🦄 Unicornio</span>');
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

  function normDomSubId(u) {
    return String((u && u.subcategoriaId) || '').trim().toLowerCase().replace(/_/g, ' ');
  }

  function isDominatrixPerfil(u) {
    if (!u) return false;
    var id = normDomSubId(u);
    if (id === 'dominatrix' || id === 'fetiche' || id === 'sado') return true;
    if (u.arquetipo === 'persona_dominatrix') return true;
    if (u.dominatrixPerfil) return true;
    if (u.especialidadBdsm) return true;
    return false;
  }

  function normEspSubId(u) {
    var id = String((u && u.subcategoriaId) || '').trim().toLowerCase().replace(/_/g, ' ');
    if (id === 'table dance' || id === 'tabledance') return 'tabledance';
    if (id === 'stripper') return 'stripper';
    if (u && u.arquetipo === 'persona_espectaculo') {
      var cat = String(u.categoriaPublica || u.categoria || '').toLowerCase();
      if (cat.indexOf('table') >= 0 && cat.indexOf('dance') >= 0) return 'tabledance';
      if (cat.indexOf('stripper') >= 0) return 'stripper';
    }
    return id;
  }

  function isTableDancePerfil(u) {
    return normEspSubId(u) === 'tabledance';
  }

  function isStripperPerfil(u) {
    return normEspSubId(u) === 'stripper';
  }

  function isEspectaculoPerfil(u) {
    if (!u) return false;
    if (u.arquetipo === 'persona_espectaculo') return true;
    if (u.espectaculoPerfil) return true;
    var id = normEspSubId(u);
    return id === 'stripper' || id === 'tabledance';
  }

  function normCreadorSubId(u) {
    var id = String((u && u.subcategoriaId) || '').trim().toLowerCase().replace(/_/g, ' ');
    if (id === 'contenido' || id === 'creador contenido') return 'contenido';
    if (u && u.arquetipo === 'persona_creador') return 'contenido';
    return id;
  }

  function isCreadorPerfil(u) {
    if (!u) return false;
    if (u.arquetipo === 'persona_creador') return true;
    if (u.creadorPerfil) return true;
    return normCreadorSubId(u) === 'contenido';
  }

  function creadorContentChips(u, opts) {
    opts = opts || {};
    var mods = '';
    var plats = Array.isArray(u.plataformas) ? u.plataformas : [];
    if (plats.length && opts.plataformas !== false) {
      var platTxt = plats[0];
      if (platTxt.length > 26) platTxt = platTxt.slice(0, 24) + '…';
      mods += '<span class="modchip mc-pink">' + svgIco('briefcase') + safeTxt(platTxt) + '</span>';
    }
    var tipos = u.tiposContenido;
    if (typeof tipos === 'string' && tipos.trim()) {
      var tipoTxt = tipos.split(' · ')[0];
      if (tipoTxt.length > 26) tipoTxt = tipoTxt.slice(0, 24) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('heart') + safeTxt(tipoTxt) + '</span>';
    } else if (Array.isArray(tipos) && tipos.length) {
      var t0 = tipos[0];
      if (t0.length > 26) t0 = t0.slice(0, 24) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('heart') + safeTxt(t0) + '</span>';
    } else if (u.tipoServicio) {
      var svcTxt = String(u.tipoServicio).split(' · ')[0];
      if (svcTxt.length > 26) svcTxt = svcTxt.slice(0, 24) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('heart') + safeTxt(svcTxt) + '</span>';
    }
    if (opts.horario && (u.horarioDetalle || u.horario || u.tiempoMinimo)) {
      var h = String(u.horarioDetalle || u.horario || u.tiempoMinimo);
      if (h.length > 28) h = h.slice(0, 26) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('clock') + safeTxt(h) + '</span>';
    }
    return mods;
  }

  function espectaculoShowChips(u, opts) {
    opts = opts || {};
    var mods = '';
    if (u.tipoShow) {
      var showTxt = String(u.tipoShow).split(' · ')[0];
      if (showTxt.length > 26) showTxt = showTxt.slice(0, 24) + '…';
      mods += '<span class="modchip mc-pink">' + svgIco('heart') + safeTxt(showTxt) + '</span>';
    }
    if (opts.venue && u.venueFijo) {
      var venueTxt = String(u.venueFijo);
      if (venueTxt.length > 28) venueTxt = venueTxt.slice(0, 26) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('pin') + safeTxt(venueTxt) + '</span>';
    }
    if (opts.horario && (u.horarioDetalle || u.horario)) {
      var h = String(u.horarioDetalle || u.horario);
      if (h.length > 28) h = h.slice(0, 26) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('clock') + safeTxt(h) + '</span>';
    }
    if (opts.eventos && String(u.eventosDisponibles || '').trim() === 'Sí') {
      mods += '<span class="modchip mc-pink">' + svgIco('briefcase') + 'Eventos</span>';
    }
    if (Array.isArray(u.disponiblePara) && u.disponiblePara.length && opts.contexto) {
      var ctxTxt = u.disponiblePara[0];
      if (ctxTxt.length > 24) ctxTxt = ctxTxt.slice(0, 22) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('chat') + safeTxt(ctxTxt) + '</span>';
    }
    return mods;
  }

  function cardHTMLStripper(u, Q) {
    Q = Q || {};
    var edad = u.edad != null ? String(u.edad).trim() + ' años' : '';
    var mods = espectaculoShowChips(u, { contexto: true, eventos: true });
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || 'Stripper');
    return cardShell(u, Q, {
      cardClass: 'res-card--adult res-card--stripper',
      headExtra: edad ? '<span class="age">' + safeTxt(edad) + '</span>' : '',
      metaRight: mods,
      descBlock: descripcionCompactHTML(u),
      priceLabel: 'Show desde',
      catLabel: catLabel,
      badges: badgesCompactHTML(u, {
        respRapida: !u.__previewRegistro && u.respuestaRapida === true
      })
    });
  }

  function cardHTMLTableDance(u, Q) {
    Q = Q || {};
    var mods = espectaculoShowChips(u, { venue: true, horario: true });
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || 'Table Dance');
    return cardShell(u, Q, {
      cardClass: 'res-card--adult res-card--tabledance',
      metaRight: mods,
      descBlock: descripcionCompactHTML(u),
      priceLabel: 'Show desde',
      catLabel: catLabel,
      badges: badgesCompactHTML(u, {
        respRapida: !u.__previewRegistro && u.respuestaRapida === true
      })
    });
  }

  function cardHTMLEspectaculo(u, Q) {
    if (isTableDancePerfil(u)) return cardHTMLTableDance(u, Q);
    return cardHTMLStripper(u, Q);
  }

  function cardHTMLCreador(u, Q) {
    Q = Q || {};
    var edad = u.edad != null ? String(u.edad).trim() + ' años' : '';
    var mods = creadorContentChips(u, { plataformas: true, horario: true });
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || 'Creadora de contenido');
    return cardShell(u, Q, {
      cardClass: 'res-card--adult res-card--creador',
      headExtra: edad ? '<span class="age">' + safeTxt(edad) + '</span>' : '',
      metaRight: mods,
      descBlock: descripcionCompactHTML(u),
      priceLabel: 'Suscripción desde',
      catLabel: catLabel,
      badges: badgesCompactHTML(u, {
        respRapida: !u.__previewRegistro && u.respuestaRapida === true
      })
    });
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
    var precioVal = precioTexto(u);
    var priceBlock = precioVal
      ? '<div class="res-card__price">' +
          '<span class="res-card__price-ic" aria-hidden="true">' + svgIco('money', 'res-card__price-ic') + '</span>' +
          '<span class="res-card__price-desde">' + safeTxt(priceLabel) + '</span>' +
          '<span class="res-card__price-val">' + safeTxt(precioVal) + '</span>' +
        '</div>'
      : '';
    var availBlock = disp.hidden
      ? ''
      : '<span class="res-card__avail res-card__avail--' + disp.clase + '">' +
          '<span class="res-dot res-dot--' + disp.clase + '" aria-hidden="true"></span>' +
          safeTxt(disp.txt) +
        '</span>';
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
              availBlock +
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

  function cardHTMLDominatrix(u, Q) {
    Q = Q || {};
    var edad = u.edad != null ? String(u.edad).trim() + ' años' : '';
    var set = modalidadesSet(u);
    var mods = chipModalidadHTML(set);
    if (u.modalidadSesion) {
      mods += '<span class="modchip mc-purple">' + svgIco('briefcase') + safeTxt(u.modalidadSesion) + '</span>';
    }
    var estiloChip = u.estiloDominacion ||
      (u.especialidadBdsm ? String(u.especialidadBdsm).split(' · ')[0] : '');
    if (estiloChip) {
      var estTxt = estiloChip.length > 24 ? estiloChip.slice(0, 22) + '…' : estiloChip;
      mods += '<span class="modchip mc-pink">' + svgIco('shield') + safeTxt(estTxt) + '</span>';
    }
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || '');
    return cardShell(u, Q, {
      cardClass: 'res-card--adult res-card--dominatrix',
      headExtra: edad ? '<span class="age">' + safeTxt(edad) + '</span>' : '',
      metaRight: mods,
      descBlock: descripcionCompactHTML(u),
      catLabel: catLabel,
      badges: badgesCompactHTML(u, {
        respRapida: !u.__previewRegistro && u.respuestaRapida === true
      })
    });
  }

  function cardHTMLAdultos(u, Q) {
    Q = Q || {};
    var edad = u.edad != null ? String(u.edad).trim() + ' años' : '';
    var set = modalidadesSet(u);
    var mods = chipModalidadHTML(set);
    var viajesLine = cardPerfilExtraHTML(u);
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || '');
    var vip = u.vip === true || u.esVip === true || u.badgeVip === true || /vip/i.test(String(catLabel || ''));
    return cardShell(u, Q, {
      cardClass: 'res-card--adult',
      headExtra: edad ? '<span class="age">' + safeTxt(edad) + '</span>' : '',
      metaRight: mods,
      descBlock: descripcionCompactHTML(u) + viajesLine,
      catLabel: catLabel,
      badges: badgesCompactHTML(u, {
        vip: vip,
        lgbt: u.badgeLgbt === true,
        hotwife: u.badgeHotwife === true,
        respRapida: !u.__previewRegistro && u.respuestaRapida === true
      })
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

  function normRetailSubId(u) {
    var id = String((u && u.subcategoriaId) || '').trim().toLowerCase().replace(/_/g, ' ');
    if (id === 'sex shop') return 'sex_shop';
    if (u && u.arquetipo === 'negocio_retail') return 'sex_shop';
    return id;
  }

  function isRetailPerfil(u) {
    if (!u) return false;
    if (u.arquetipo === 'negocio_retail') return true;
    if (u.retailPerfil) return true;
    return normRetailSubId(u) === 'sex_shop';
  }

  function isSexShopPerfil(u) {
    return isRetailPerfil(u) && normRetailSubId(u) === 'sex_shop';
  }

  function retailShowChips(u, opts) {
    opts = opts || {};
    var mods = '';
    var cats = String(u.categoriasProducto || '').trim();
    if (cats) {
      var catTxt = cats.split(',')[0].trim();
      if (catTxt.length > 26) catTxt = catTxt.slice(0, 24) + '…';
      mods += '<span class="modchip mc-pink">' + svgIco('briefcase') + safeTxt(catTxt) + '</span>';
    }
    if (u.envioDomicilio === true || String(u.envioDomicilio || '').toLowerCase() === 'true') {
      mods += '<span class="modchip mc-purple">' + svgIco('car') + 'Envío</span>';
    }
    if (u.tiendaOnline === true || String(u.tiendaOnline || '').toLowerCase() === 'true') {
      mods += '<span class="modchip mc-purple">' + svgIco('briefcase') + 'En línea</span>';
    }
    if (opts.horario && (u.horarioDetalle || u.horario)) {
      var h = String(u.horarioDetalle || u.horario);
      if (h.length > 28) h = h.slice(0, 26) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('clock') + safeTxt(h) + '</span>';
    }
    return mods;
  }

  function cardHTMLRetail(u, Q) {
    Q = Q || {};
    var mods = retailShowChips(u, { horario: true });
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || 'Sex Shop');
    return cardShell(u, Q, {
      cardClass: 'res-card--negocio res-card--retail res-card--sexshop',
      nombre: u.nombreComercial || u.nombre || u.alias,
      catIcon: 'briefcase',
      catLabel: catLabel,
      metaRight: mods,
      descBlock: descripcionCompactHTML(u, 'Descripción'),
      priceLabel: 'Desde',
      badges: badgesCompactHTML(u, { negocio: u.verificada !== false })
    });
  }

  function cardHTMLSexShop(u, Q) {
    return cardHTMLRetail(u, Q);
  }

  function normVenueSubId(u) {
    var id = String((u && u.subcategoriaId) || '').trim().toLowerCase().replace(/_/g, ' ');
    if (id === 'antro restaurant bar lgbt' || id === 'antro lgbt') return 'antro_lgbt';
    if (id === 'antro restaurant bar' || id === 'antro') return 'antro';
    if (u && u.arquetipo === 'negocio_venue') {
      if (u.badgeLgbt === true) return 'antro_lgbt';
      if (u.venuePerfil && u.subcategoriaId) {
        var sid = String(u.subcategoriaId).trim().toLowerCase();
        if (sid === 'antro_lgbt') return 'antro_lgbt';
        if (sid === 'antro') return 'antro';
      }
    }
    return id;
  }

  function isVenuePerfil(u) {
    if (!u) return false;
    if (u.arquetipo === 'negocio_venue' && (normVenueSubId(u) === 'antro' || normVenueSubId(u) === 'antro_lgbt')) return true;
    if (u.venuePerfil && (normVenueSubId(u) === 'antro' || normVenueSubId(u) === 'antro_lgbt')) return true;
    var sid = normVenueSubId(u);
    return sid === 'antro' || sid === 'antro_lgbt';
  }

  function isAntroPerfil(u) {
    return isVenuePerfil(u) && normVenueSubId(u) === 'antro';
  }

  function isAntroLgbtPerfil(u) {
    return isVenuePerfil(u) && normVenueSubId(u) === 'antro_lgbt';
  }

  function venueShowChips(u, opts) {
    opts = opts || {};
    var mods = '';
    var cover = String(u.precioEntrada || u.precio || '').trim();
    if (cover) {
      var coverTxt = cover.length > 22 ? cover.slice(0, 20) + '…' : cover;
      mods += '<span class="modchip mc-pink">' + svgIco('wallet') + safeTxt('Cover ' + coverTxt) + '</span>';
    }
    if (u.dressCode) {
      var dc = String(u.dressCode);
      if (dc.length > 24) dc = dc.slice(0, 22) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('briefcase') + safeTxt(dc) + '</span>';
    }
    if (u.reservaciones === true || String(u.reservaciones || '').toLowerCase() === 'true') {
      mods += '<span class="modchip mc-purple">' + svgIco('calendar') + 'Reservaciones</span>';
    }
    if (opts.horario && (u.horarioDetalle || u.horario)) {
      var h = String(u.horarioDetalle || u.horario);
      if (h.length > 28) h = h.slice(0, 26) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('clock') + safeTxt(h) + '</span>';
    }
    if (u.cartelera) {
      var cart = String(u.cartelera).split(/[\n·|]/)[0].trim();
      if (cart.length > 26) cart = cart.slice(0, 24) + '…';
      if (cart) mods += '<span class="modchip mc-pink">' + svgIco('tv') + safeTxt(cart) + '</span>';
    }
    return mods;
  }

  function cardHTMLVenue(u, Q) {
    Q = Q || {};
    var mods = venueShowChips(u, { horario: true });
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || 'Antro');
    var cardExtra = isAntroLgbtPerfil(u) ? ' res-card--antro-lgbt' : ' res-card--antro';
    var badgeOpts = { negocio: u.verificada !== false };
    if (isAntroLgbtPerfil(u)) badgeOpts.lgbt = true;
    return cardShell(u, Q, {
      cardClass: 'res-card--negocio res-card--venue' + cardExtra,
      nombre: u.nombreComercial || u.nombre || u.alias,
      catIcon: 'briefcase',
      catLabel: catLabel,
      metaRight: mods,
      descBlock: descripcionCompactHTML(u, 'Descripción'),
      priceLabel: 'Cover',
      badges: badgesCompactHTML(u, badgeOpts)
    });
  }

  function cardHTMLAntro(u, Q) {
    return cardHTMLVenue(u, Q);
  }

  function cardHTMLAntroLgbt(u, Q) {
    return cardHTMLVenue(u, Q);
  }

  function normBienestarSubId(u) {
    var id = String((u && u.subcategoriaId) || '').trim().toLowerCase().replace(/_/g, ' ');
    if (id === 'spa') return 'spa';
    if (id === 'masajes') return 'masajes';
    if (u && u.arquetipo === 'negocio_bienestar') {
      var tipo = String(u.tipoBienestar || (u.bienestarPerfil && u.bienestarPerfil.tipoBienestar) || '').toLowerCase();
      if (tipo.indexOf('masajes') >= 0) return 'masajes';
      if (u.bienestarPerfil) return 'spa';
    }
    return id;
  }

  function isBienestarPerfil(u) {
    if (!u) return false;
    if (u.arquetipo === 'negocio_bienestar') return true;
    if (u.bienestarPerfil) return true;
    var sid = normBienestarSubId(u);
    return sid === 'spa' || sid === 'masajes';
  }

  function isSpaPerfil(u) {
    return isBienestarPerfil(u) && normBienestarSubId(u) === 'spa';
  }

  function isMasajesLocalPerfil(u) {
    return isBienestarPerfil(u) && normBienestarSubId(u) === 'masajes';
  }

  function bienestarShowChips(u, opts) {
    opts = opts || {};
    var mods = '';
    var menu = String(u.menuServicios || (u.bienestarPerfil && u.bienestarPerfil.menuServicios) || '').trim();
    if (menu) {
      var menuTxt = menu.split(/[\n·|]/)[0].trim();
      if (menuTxt.length > 26) menuTxt = menuTxt.slice(0, 24) + '…';
      if (menuTxt) mods += '<span class="modchip mc-pink">' + svgIco('briefcase') + safeTxt(menuTxt) + '</span>';
    }
    var am = u.amenidades || (u.bienestarPerfil && u.bienestarPerfil.amenidades);
    if (Array.isArray(am) && am.length) {
      var amTxt = String(am[0]);
      if (amTxt.length > 22) amTxt = amTxt.slice(0, 20) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('flower') + safeTxt(amTxt) + '</span>';
    }
    if (u.reservaciones === true || String(u.reservaciones || '').toLowerCase() === 'true') {
      mods += '<span class="modchip mc-purple">' + svgIco('calendar') + 'Reservaciones</span>';
    }
    if (opts.horario && (u.horarioDetalle || u.horario)) {
      var h = String(u.horarioDetalle || u.horario);
      if (h.length > 28) h = h.slice(0, 26) + '…';
      mods += '<span class="modchip mc-purple">' + svgIco('clock') + safeTxt(h) + '</span>';
    }
    return mods;
  }

  function cardHTMLBienestar(u, Q) {
    Q = Q || {};
    var mods = bienestarShowChips(u, { horario: true });
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || 'Bienestar');
    var cardExtra = isMasajesLocalPerfil(u) ? ' res-card--masajes-local' : ' res-card--spa';
    return cardShell(u, Q, {
      cardClass: 'res-card--negocio res-card--bienestar' + cardExtra,
      nombre: u.nombreComercial || u.nombre || u.alias,
      catIcon: 'briefcase',
      catLabel: catLabel,
      metaRight: mods,
      descBlock: descripcionCompactHTML(u, 'Descripción'),
      priceLabel: 'Desde',
      badges: badgesCompactHTML(u, { negocio: u.verificada !== false })
    });
  }

  function cardHTMLSpa(u, Q) {
    return cardHTMLBienestar(u, Q);
  }

  function cardHTMLMasajesLocal(u, Q) {
    return cardHTMLBienestar(u, Q);
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

  function cardHTMLPareja(u, Q) {
    if (isCuckoldHotwifePerfil(u)) return cardHTMLCuckoldHotwife(u, Q);
    if (isSwingerPerfil(u)) return cardHTMLParejaSwinger(u, Q);
    Q = Q || {};
    var set = modalidadesSet(u);
    var mods = chipModalidadHTML(set);
    var viajesLine = cardPerfilExtraHTML(u);
    var catLabel = (global.CariHubResultadosDemo && CariHubResultadosDemo.labelCategoria)
      ? CariHubResultadosDemo.labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '')
      : (u.categoriaPublica || u.categoria || Q.categoria || '');
    var configLabel = u.configuracionGrupoLabel || u.tipoPareja || '';
    var headExtra = configLabel
      ? '<span class="age">' + safeTxt(String(configLabel)) + '</span>'
      : '';
    var miembrosLine = u.miembrosResumen || u.miembrosEdad
      ? '<p class="res-card__viajes-resumen">' + safeTxt(String(u.miembrosResumen || u.miembrosEdad)) + '</p>'
      : '';
    return cardShell(u, Q, {
      cardClass: 'res-card--pareja',
      nombre: u.aliasPareja || u.nombre || u.alias,
      headExtra: headExtra,
      metaRight: mods,
      descBlock: descripcionCompactHTML(u, 'Presentación') + miembrosLine + viajesLine,
      catLabel: catLabel,
      badges: badgesCompactHTML(u, { respRapida: !u.__previewRegistro && u.respuestaRapida === true })
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
    if (comp === 'ResultCardUnicorn' || isUnicornPerfil(u)) return cardHTMLUnicorn(u, Q);
    if (isCuckoldHotwifePerfil(u)) return cardHTMLCuckoldHotwife(u, Q);
    if (comp === 'ResultCardProfesional') return cardHTMLProfesional(u, Q);
    if (comp === 'ResultCardServicio') return cardHTMLServicio(u, Q);
    if (comp === 'ResultCardPareja') return cardHTMLPareja(u, Q);
    if (comp === 'ResultCardEspectaculo' || isEspectaculoPerfil(u)) return cardHTMLEspectaculo(u, Q);
    if (comp === 'ResultCardCreador' || isCreadorPerfil(u)) return cardHTMLCreador(u, Q);
    if (isVenuePerfil(u)) return cardHTMLVenue(u, Q);
    if (isBienestarPerfil(u)) return cardHTMLBienestar(u, Q);
    if (comp === 'ResultCardNegocio' && isRetailPerfil(u)) return cardHTMLRetail(u, Q);
    if (comp === 'ResultCardNegocio') return cardHTMLNegocio(u, Q);
    if (isDominatrixPerfil(u)) return cardHTMLDominatrix(u, Q);
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
    cardHTMLDominatrix: cardHTMLDominatrix,
    cardHTMLEspectaculo: cardHTMLEspectaculo,
    cardHTMLCreador: cardHTMLCreador,
    cardHTMLStripper: cardHTMLStripper,
    cardHTMLTableDance: cardHTMLTableDance,
    isDominatrixPerfil: isDominatrixPerfil,
    isEspectaculoPerfil: isEspectaculoPerfil,
    isCreadorPerfil: isCreadorPerfil,
    isStripperPerfil: isStripperPerfil,
    isTableDancePerfil: isTableDancePerfil,
    cardHTMLNegocio: cardHTMLNegocio,
    cardHTMLRetail: cardHTMLRetail,
    cardHTMLSexShop: cardHTMLSexShop,
    cardHTMLVenue: cardHTMLVenue,
    cardHTMLAntro: cardHTMLAntro,
    cardHTMLAntroLgbt: cardHTMLAntroLgbt,
    cardHTMLBienestar: cardHTMLBienestar,
    cardHTMLSpa: cardHTMLSpa,
    cardHTMLMasajesLocal: cardHTMLMasajesLocal,
    isBienestarPerfil: isBienestarPerfil,
    isSpaPerfil: isSpaPerfil,
    isMasajesLocalPerfil: isMasajesLocalPerfil,
    isRetailPerfil: isRetailPerfil,
    isSexShopPerfil: isSexShopPerfil,
    isVenuePerfil: isVenuePerfil,
    isAntroPerfil: isAntroPerfil,
    isAntroLgbtPerfil: isAntroLgbtPerfil,
    cardHTMLServicio: cardHTMLServicio,
    cardHTMLProfesional: cardHTMLProfesional,
    cardHTMLPareja: cardHTMLPareja,
    cardHTMLParejaSwinger: cardHTMLParejaSwinger,
    cardHTMLCuckoldHotwife: cardHTMLCuckoldHotwife,
    cardHTMLUnicorn: cardHTMLUnicorn,
    isCuckoldHotwifePerfil: isCuckoldHotwifePerfil,
    resolveComponente: resolveComponente,
    applyPublicProfilePresentation: applyPublicProfilePresentation,
    PUB_BLOCKS: PUB_BLOCKS
  };
})(typeof window !== 'undefined' ? window : globalThis);
