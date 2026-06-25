(function () {
  'use strict';

  var TEMPLATES = ['classic', 'neon', 'sunset', 'bloom', 'noir', 'pulse'];

  var PIN_SVG = '<svg class="home-vcard__pin" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';

  function splitTitle(nombre) {
    var n = String(nombre || '').trim();
    if (n.length <= 11) return [n];
    if (n.indexOf(' / ') > 0) return n.split(' / ').map(function (s) { return s.trim(); });
    if (n.indexOf('/') > 0) return n.split('/').map(function (s) { return s.trim(); });
    var words = n.split(/\s+/);
    if (words.length <= 2) return [n];
    var mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }

  /** Saltos de línea óptimos para la cuadrícula de 6 tarjetas en Home */
  var CAT_GRID_LINES = {
    'escort gay': ['Escort', 'Gay'],
    'escort vip': ['Escort', 'VIP'],
    'antro restaurant bar': ['Antros', 'y bares'],
    'antro restaurant bar lgbt': ['Antro', 'LGBT'],
    'hotel motel': ['Hotel', 'y Motel'],
    'cabinas glory holes': ['Cabinas', 'Glory Holes'],
    'club sw': ['Club', 'Swinger'],
    'parejas swinger': ['Parejas', 'Swinger'],
    'swinger': ['Parejas', 'Swinger'],
    'contenido': ['Creadores de', 'contenido'],
    'cuckold hotwife': ['Cuckold', 'Hotwife'],
    'hotwife': ['Hotwife'],
    'cine xxx': ['Cine', 'XXX'],
    'tom boy': ['Tom', 'Boy'],
    'tom fem': ['Tom', 'Fem'],
    'acompanante': ['Acompañante'],
    'dominatrix': ['Dominatrix'],
    'stripper': ['Stripper'],
    'modelos': ['Modelos'],
    'gigolo': ['Gigoló'],
    'femboy': ['Femboy'],
    'tabledance': ['Table', 'Dance'],
    'unicorns': ['Unicorns']
  };

  function gridTitleLines(cat, ov) {
    var id = (cat.id || '').toLowerCase();
    if (CAT_GRID_LINES[id]) return CAT_GRID_LINES[id].slice();
    if (ov.titleLines && ov.titleLines.length) return ov.titleLines.slice();
    var base = String(cat.nombre || '').trim();
    if (base.length <= 12) return [base];
    return splitTitle(base);
  }

  function fitGridFoot(vcard) {
    if (!vcard) return;
    var foot = vcard.querySelector('.home-vcard__foot');
    if (!foot) return;
    var title = foot.querySelector('.home-vcard__title');
    var titleRows = foot.querySelectorAll('.home-vcard__title-line');
    var sizes = [10.5, 10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4];
    function fits() {
      if (foot.scrollHeight > foot.clientHeight + 1) return false;
      if (titleRows.length) {
        for (var j = 0; j < titleRows.length; j++) {
          if (titleRows[j].scrollWidth > titleRows[j].clientWidth + 1) return false;
        }
        if (title && title.scrollHeight > title.clientHeight + 1) return false;
        return true;
      }
      if (title) {
        if (title.scrollHeight > title.clientHeight + 1) return false;
        if (title.scrollWidth > title.clientWidth + 1) return false;
      }
      return true;
    }
    for (var i = 0; i < sizes.length; i++) {
      var s = sizes[i];
      foot.style.setProperty('--vc-grid-lead', (s * 0.88).toFixed(2) + 'px');
      foot.style.setProperty('--vc-grid-title', (s * 0.98).toFixed(2) + 'px');
      foot.style.setProperty('--vc-grid-cerca', (s * 0.84).toFixed(2) + 'px');
      if (fits()) return;
    }
  }

  function scheduleGridFootFit(layer) {
    if (!layer || !layer.closest('.home-categorias')) return;
    function run() {
      var vcard = layer.querySelector('.home-vcard');
      if (vcard) fitGridFoot(vcard);
    }
    run();
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
    setTimeout(run, 60);
    setTimeout(run, 500);
  }

  function buildVCard(opts) {
    var o = opts || {};
    var tpl = o.template || 'classic';
    var card = document.createElement('div');
    card.className = 'home-vcard home-vcard--' + tpl + (o.sectorCard ? ' home-vcard--sector' : '');
    card.style.setProperty('--vc-accent', o.accent || '#ec2d7a');
    card.style.setProperty('--vc-accent2', o.accent2 || o.accent || '#ff6eb0');
    if (o.catId) card.dataset.catId = o.catId;
    if (o.sectorId) card.dataset.sectorId = o.sectorId;
    if (o.catName) card.dataset.catName = o.catName;

    var photo = document.createElement('div');
    photo.className = 'home-vcard__photo';
    if (o.photo) {
      photo.style.backgroundImage = "url('" + o.photo + "')";
      if (o.photoFit) photo.style.backgroundSize = o.photoFit;
      if (o.photoScale) photo.style.backgroundSize = Math.round(o.photoScale * 100) + '%';
      if (o.photoPos) photo.style.backgroundPosition = o.photoPos;
      if (o.photoBg) photo.style.backgroundColor = o.photoBg;
    } else if (o.gradient) photo.style.background = o.gradient;

    var shade = document.createElement('div');
    shade.className = 'home-vcard__shade';
    photo.appendChild(shade);

    var foot = document.createElement('div');
    foot.className = 'home-vcard__foot';

    var lead = document.createElement('span');
    lead.className = 'home-vcard__lead';
    lead.textContent = 'Encuentra';

    var title = document.createElement('span');
    title.className = 'home-vcard__title home-cat-card__name';
    var lines = o.titleLines || splitTitle(o.title || '');
    if (o.stackTitle && lines.length > 1) {
      title.classList.add('home-vcard__title--stack');
      lines.forEach(function (line) {
        var row = document.createElement('span');
        row.className = 'home-vcard__title-line';
        row.textContent = line;
        title.appendChild(row);
      });
    } else {
      title.textContent = lines.join(' ');
    }

    var cerca = document.createElement('span');
    cerca.className = 'home-vcard__cerca';
    if (o.hideCercaPin || o.gridCompact) {
      cerca.innerHTML = '<span>cerca de ti</span>';
    } else {
      cerca.innerHTML = PIN_SVG + '<span>Cerca de ti</span>';
    }

    foot.appendChild(lead);
    foot.appendChild(title);
    foot.appendChild(cerca);

    card.appendChild(photo);
    card.appendChild(foot);
    return card;
  }

  var CAT_OVERRIDES = {
    'escort': {
      template: 'bloom',
      accent: '#e91e98',
      photo: 'img/home/cat-cards/escort.png',
      photoPos: 'center center',
      icon: '💃',
      titleLines: ['Escort']
    },
    'escort gay': { template: 'neon', accent: '#9b5de5', accent2: '#00bbf9', photo: 'img/home/hero-escort-gay.png', icon: '🏳️‍🌈', titleLines: ['Escort', 'Gay'] },
    'escort vip': { template: 'pulse', accent: '#ffd700', accent2: '#ff8c00', photo: 'img/home/hero-carinosa-motel-spa-runway.png', icon: '👑' },
    'edecan': { template: 'sunset', accent: '#ff6b9d', photo: 'img/home/hero-carinosa-motel-spa-runway.png', icon: '✨' },
    'stripper': {
      template: 'neon',
      accent: '#c77dff',
      accent2: '#ff4d9d',
      photo: 'img/home/cat-cards/stripper.png',
      photoPos: 'center center',
      icon: '🔥',
      titleLines: ['Stripper']
    },
    'modelos': { template: 'bloom', accent: '#f72585', photo: 'img/home/cat-cards/modelos.png', icon: '📸', titleLines: ['Modelos'] },
    'gigolo': {
      template: 'noir',
      accent: '#4cc9f0',
      photo: 'img/home/cat-cards/stripper.png',
      photoPos: 'center center',
      icon: '🤵',
      titleLines: ['Gigoló']
    },
    'acompanante': {
      template: 'classic',
      accent: '#ec2d7a',
      photo: 'img/home/motel-spa-model.jpg',
      icon: '🌹',
      titleLines: ['Acompañante']
    },
    'petit': {
      template: 'bloom',
      accent: '#ff85a1',
      photo: 'img/home/cat-cards/petit.png',
      photoPos: 'center center',
      icon: '🎀',
      titleLines: ['Petit']
    },
    'contenido': {
      template: 'pulse',
      accent: '#ff006e',
      photo: 'img/home/cat-cards/creadora-contenido.png',
      photoPos: 'center center',
      icon: '🎬',
      titleLines: ['Creadores de', 'contenido']
    },
    'tabledance': {
      template: 'neon',
      accent: '#b5179e',
      accent2: '#7209b7',
      photo: 'img/home/cat-cards/tabledance.png',
      photoPos: 'center center',
      icon: '🍸',
      titleLines: ['Table', 'Dance']
    },
    'sex shop': { template: 'classic', accent: '#d000ff', photo: 'img/home/sexshop.jpg', icon: '🛍️' },
    'spa': {
      template: 'sunset',
      accent: '#06d6a0',
      photo: 'img/home/cat-cards/spa.png',
      photoPos: 'center center',
      icon: '🧖',
      titleLines: ['Spa']
    },
    'masajes': {
      template: 'bloom',
      accent: '#2ec4b6',
      photo: 'img/home/cat-cards/spa.png',
      photoPos: 'center center',
      icon: '💆',
      titleLines: ['Masajes']
    },
    'club sw': { template: 'noir', accent: '#9d4edd', photo: 'img/home/lounge-swinger.jpg', icon: '🍍', titleLines: ['Club', 'Swinger'] },
    'antro restaurant bar': {
      template: 'neon',
      accent: '#ff4d6d',
      photo: 'img/home/cat-cards/antros.png',
      photoPos: 'center center',
      icon: '🍾',
      titleLines: ['Antros', 'y bares']
    },
    'antro restaurant bar lgbt': {
      template: 'pulse',
      accent: '#7b2ff7',
      accent2: '#f107a3',
      photo: 'img/home/cat-cards/antro-lgbt.png',
      photoFit: 'cover',
      photoScale: 1.18,
      photoPos: 'center center',
      icon: '🌈',
      titleLines: ['Antro', 'LGBT']
    },
    'hotel motel': { template: 'classic', accent: '#e63946', photo: 'img/home/motel-noche.jpg', icon: '🏩', titleLines: ['Hotel', 'y Motel'] },
    'cabinas glory holes': {
      template: 'noir',
      accent: '#6c757d',
      photo: 'img/home/cat-cards/cabinas-glory-holes.png',
      photoPos: 'center center',
      icon: '🚪',
      titleLines: ['Cabinas', 'Glory Holes']
    },
    'trans': {
      template: 'bloom',
      accent: '#5fa8d3',
      photo: 'img/home/cat-cards/trans.png',
      photoPos: 'center center',
      icon: '⚧️',
      titleLines: ['Trans']
    },
    'femboy': { template: 'sunset', accent: '#ff99c8', photo: 'img/home/cat-cards/femboy.png', icon: '🌸', titleLines: ['Femboy'] },
    'parejas swinger': {
      template: 'neon',
      accent: '#1e88e5',
      photo: 'img/home/cat-cards/parejas-swinger.png',
      photoFit: 'contain',
      photoPos: 'center center',
      photoBg: '#121018',
      icon: '🍍',
      titleLines: ['Parejas', 'Swinger']
    },
    'swinger': {
      template: 'neon',
      accent: '#1e88e5',
      photo: 'img/home/cat-cards/parejas-swinger.png',
      photoFit: 'contain',
      photoPos: 'center center',
      photoBg: '#121018',
      icon: '🍍',
      titleLines: ['Parejas', 'Swinger']
    },
    'unicorns': {
      template: 'pulse',
      accent: '#9b5de5',
      accent2: '#00f5d4',
      photo: 'img/home/lounge-swinger.jpg',
      icon: '🦄',
      titleLines: ['Unicorns']
    },
    'cuckold hotwife': {
      template: 'sunset',
      accent: '#ff4500',
      photo: 'img/home/cat-cards/queen-of-spades.png',
      photoFit: 'contain',
      photoPos: 'center center',
      photoBg: '#ffffff',
      icon: '🔥',
      titleLines: ['Cuckold /', 'Hotwife']
    },
    'singles': { template: 'classic', accent: '#fb5607', photo: 'img/home/nightclub.jpg', icon: '💫' },
    'hotwife': {
      template: 'bloom',
      accent: '#ff006e',
      photo: 'img/home/cat-cards/queen-of-spades.png',
      photoFit: 'contain',
      photoPos: 'center center',
      photoBg: '#ffffff',
      icon: '🔥',
      titleLines: ['Hotwife']
    },
    'lesbians': {
      template: 'pulse',
      accent: '#e91e98',
      accent2: '#9b5de5',
      photo: 'img/home/cat-cards/lesbians.png',
      photoPos: 'center center',
      icon: '👩‍❤️‍👩',
      titleLines: ['Lesbians']
    },
    'tom boy': { template: 'noir', accent: '#4ea8de', photo: 'img/home/escort-gay.jpg', icon: '🧢', titleLines: ['Tomboy'] },
    'tom fem': {
      template: 'bloom',
      accent: '#ff85a1',
      photo: 'img/home/cat-cards/tom-fem.png',
      photoPos: 'center center',
      icon: '💄',
      titleLines: ['Tom', 'Fem']
    },
    'dotados': {
      template: 'classic',
      accent: '#d62828',
      photo: 'img/home/cat-cards/stripper.png',
      photoPos: 'center center',
      icon: '🍆'
    },
    'fetiche': {
      template: 'noir',
      accent: '#212529',
      accent2: '#e5383b',
      photo: 'img/home/cat-cards/dominatrix.png',
      photoFit: 'contain',
      photoPos: 'center center',
      photoBg: '#ffffff',
      icon: '🖤',
      titleLines: ['Fetiche']
    },
    'sado': {
      template: 'neon',
      accent: '#8b0000',
      photo: 'img/home/cat-cards/dominatrix.png',
      photoFit: 'contain',
      photoPos: 'center center',
      photoBg: '#ffffff',
      icon: '⛓️',
      titleLines: ['Sado']
    },
    'dominatrix': {
      template: 'noir',
      accent: '#720026',
      photo: 'img/home/cat-cards/dominatrix.png',
      photoFit: 'contain',
      photoPos: 'center center',
      photoBg: '#ffffff',
      icon: '🖤',
      titleLines: ['Dominatrix']
    },
    'cine xxx': {
      template: 'pulse',
      accent: '#ff006e',
      accent2: '#8338ec',
      photo: 'img/home/cat-cards/cine-xxx.png',
      photoPos: 'center center',
      icon: '🎥',
      titleLines: ['Cine', 'XXX']
    }
  };

  var GRADIENTS = [
    'linear-gradient(145deg,#2d0a1f,#120818)',
    'linear-gradient(145deg,#0f1a2e,#1a0a20)',
    'linear-gradient(145deg,#1a0a10,#0a0a14)',
    'linear-gradient(145deg,#201018,#0c0810)',
    'linear-gradient(145deg,#101828,#180818)',
    'linear-gradient(145deg,#1a1028,#0a1018)'
  ];

  function catVisual(cat, index) {
    var id = (cat.id || '').toLowerCase();
    var ov = CAT_OVERRIDES[id] || {};
    var tpl = ov.template || TEMPLATES[index % TEMPLATES.length];
    var titleLines = gridTitleLines(cat, ov);
    var vis = {
      template: tpl,
      accent: ov.accent || '#ec2d7a',
      accent2: ov.accent2,
      photo: null,
      photoFit: ov.photoFit,
      photoScale: ov.photoScale,
      photoPos: ov.photoPos,
      photoBg: ov.photoBg,
      gradient: GRADIENTS[index % GRADIENTS.length],
      icon: ov.icon || cat.emoji || '✨',
      title: titleLines.join(' '),
      titleLines: titleLines,
      stackTitle: titleLines.length > 1,
      gridCompact: true,
      hideCercaPin: true,
      catId: id,
      catName: cat.nombre
    };
    if (window.CariHubCategoriaImagenes && CariHubCategoriaImagenes.applyCatVisual) {
      CariHubCategoriaImagenes.applyCatVisual(vis, id);
    }
    if (!vis.photo && ov.photo) {
      vis.photo = ov.photo;
      vis.gradient = null;
    }
    return vis;
  }

  function resolveCatLookupId(slide) {
    if (!slide) return '';
    var id = String(slide.categoriaId || slide.slotKey || '').toLowerCase();
    if (slide.slotKey === 'motel') return 'hotel motel';
    return id;
  }

  /** Misma imagen que la tarjeta de «Explora categorías» para el hero derecho. */
  function heroImageForSlide(slide) {
    var id = resolveCatLookupId(slide);
    if (!id) return { src: null };
    var vis = catVisual({ id: id, nombre: slide.categoriaNombre || '' }, 0);
    return {
      src: vis.photo || null,
      photoFit: vis.photoFit,
      photoScale: vis.photoScale,
      photoPos: vis.photoPos,
      photoBg: vis.photoBg
    };
  }

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

  var SECTOR_TITLE_LINES = {
    adultos: ['Adultos y', 'Entretenimiento'],
    bienestar: ['Bienestar, Espiritualidad', 'y Terapias Alternativas'],
    salud: ['Salud y', 'Bienestar'],
    profesionales: ['Servicios', 'Profesionales'],
    automotriz: ['Vehículos y', 'Servicios Automotrices'],
    hogar: ['Hogar, Construcción', 'y Mantenimiento'],
    comercio: ['Comercio, Tiendas', 'y Distribución'],
    'bienes-raices': ['Bienes', 'Raíces'],
    eventos: ['Eventos, Espectáculos', 'y Fiestas'],
    transporte: ['Transporte, Logística', 'y Mensajería'],
    educacion: ['Educación y', 'Capacitación'],
    tecnologia: ['Tecnología y', 'Servicios Digitales'],
    restaurantes: ['Restaurantes, Alimentos', 'y Vida Nocturna'],
    mascotas: ['Mascotas y', 'Servicios Veterinarios'],
    industria: ['Industria y', 'Servicios Empresariales']
  };

  function sectorPhotoMeta(sectorId) {
    if (window.CariHubSectorCardImages && CariHubSectorCardImages.getSectorCardImage) {
      return CariHubSectorCardImages.getSectorCardImage(sectorId);
    }
    return null;
  }

  function resolveSectorPhoto(sectorId, done) {
    var meta = sectorPhotoMeta(sectorId);
    if (meta && meta.src) {
      done(meta.src);
      return;
    }
    done('');
  }

  function sectorVisual(sector, index, compact) {
    var meta = sectorPhotoMeta(sector.id);
    var photo = meta && meta.src ? meta.src : '';
    var nombre = sector.nombre || SECTOR_SHORT[sector.id] || '';
    var short = SECTOR_SHORT[sector.id] || nombre.split(',')[0].split(' y ')[0];
    var vis = {
      template: 'classic',
      accent: '#ffffff',
      photo: photo,
      photoFit: meta && meta.fit,
      photoPos: meta && meta.pos,
      photoBg: meta && meta.bg,
      gradient: photo ? null : GRADIENTS[index % GRADIENTS.length],
      title: compact ? short : nombre,
      titleLines: compact ? [short] : (SECTOR_TITLE_LINES[sector.id] || splitTitle(nombre)),
      sectorId: sector.id,
      sectorCard: true
    };
    if (window.CariHubSectorCardImages && CariHubSectorCardImages.applySectorVisual) {
      CariHubSectorCardImages.applySectorVisual(vis, sector.id);
    }
    return vis;
  }

  function mountVCard(layer, opts) {
    layer.innerHTML = '';
    if (opts.sectorId && opts.sectorCard) {
      resolveSectorPhoto(opts.sectorId, function (url) {
        var next = Object.assign({}, opts, { photo: url || opts.photo, gradient: url ? null : opts.gradient });
        layer.innerHTML = '';
        layer.appendChild(buildVCard(next));
      });
      return;
    }
    layer.appendChild(buildVCard(opts));
    if (opts.gridCompact) scheduleGridFootFit(layer);
  }

  window.CariHubVCard = {
    build: buildVCard,
    mount: mountVCard,
    catVisual: catVisual,
    heroImageForSlide: heroImageForSlide,
    resolveCatLookupId: resolveCatLookupId,
    sectorVisual: sectorVisual,
    splitTitle: splitTitle,
    fitGridFoot: fitGridFoot,
    scheduleGridFootFit: scheduleGridFootFit
  };
})();
