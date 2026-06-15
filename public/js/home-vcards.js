(function () {
  'use strict';

  var TEMPLATES = ['classic', 'neon', 'sunset', 'bloom', 'noir', 'pulse'];

  var PIN_SVG = '<svg class="home-vcard__pin" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';

  function splitTitle(nombre) {
    var n = String(nombre || '').trim();
    if (n.length <= 14) return [n];
    if (n.indexOf(' / ') > 0) return n.split(' / ');
    if (n.indexOf('/') > 0) return n.split('/').map(function (s) { return s.trim(); });
    var words = n.split(/\s+/);
    if (words.length <= 2) return [n];
    var mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
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
    if (o.photo) photo.style.backgroundImage = "url('" + o.photo + "')";
    else if (o.gradient) photo.style.background = o.gradient;

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
    title.textContent = lines.join(' ');

    var cerca = document.createElement('span');
    cerca.className = 'home-vcard__cerca';
    cerca.innerHTML = PIN_SVG + '<span>Cerca de ti</span>';

    foot.appendChild(lead);
    foot.appendChild(title);
    foot.appendChild(cerca);

    card.appendChild(photo);
    card.appendChild(foot);
    return card;
  }

  var CAT_OVERRIDES = {
    'escort': { template: 'bloom', accent: '#e91e98', photo: 'img/home/promo-perfil.jpg', icon: '💃' },
    'escort gay': { template: 'neon', accent: '#9b5de5', accent2: '#00bbf9', photo: 'img/home/hero-escort-gay.png', icon: '🏳️‍🌈' },
    'escort vip': { template: 'pulse', accent: '#ffd700', accent2: '#ff8c00', photo: 'img/home/hero-carinosa-motel-spa-runway.png', icon: '👑' },
    'edecan': { template: 'sunset', accent: '#ff6b9d', photo: 'img/home/hero-carinosa-motel-spa-runway.png', icon: '✨' },
    'stripper': { template: 'neon', accent: '#c77dff', accent2: '#ff4d9d', photo: 'img/home/nightclub.jpg', icon: '🔥' },
    'modelos': { template: 'bloom', accent: '#f72585', photo: 'img/home/promo-destaca.jpg', icon: '📸' },
    'gigolo': { template: 'noir', accent: '#4cc9f0', photo: 'img/home/escort-gay.jpg', icon: '🤵' },
    'acompanante': { template: 'classic', accent: '#ec2d7a', photo: 'img/home/motel-spa-model.jpg', icon: '🌹' },
    'petit': { template: 'bloom', accent: '#ff85a1', photo: 'img/home/spa-entrada.jpg', icon: '🎀' },
    'contenido': { template: 'pulse', accent: '#ff006e', photo: 'img/home/hero-bar-neon.png', icon: '🎬' },
    'tabledance': { template: 'neon', accent: '#b5179e', accent2: '#7209b7', photo: 'img/home/nightclub.jpg', icon: '🍸' },
    'sex shop': { template: 'classic', accent: '#d000ff', photo: 'img/home/sexshop.jpg', icon: '🛍️' },
    'spa': { template: 'sunset', accent: '#06d6a0', photo: 'img/home/hero-spa-interior.png', icon: '🧖' },
    'masajes': { template: 'bloom', accent: '#2ec4b6', photo: 'img/home/spa-entrada.jpg', icon: '💆' },
    'club sw': { template: 'noir', accent: '#9d4edd', photo: 'img/home/lounge-swinger.jpg', icon: '🍍', titleLines: ['Club SW', 'Parejas'] },
    'antro restaurant bar': { template: 'neon', accent: '#ff4d6d', photo: 'img/home/hero-antro-restaurante.png', icon: '🍾', titleLines: ['Antros', 'Para todos'] },
    'antro restaurant bar lgbt': { template: 'pulse', accent: '#7b2ff7', accent2: '#f107a3', photo: 'img/home/hero-bar-neon.png', icon: '🌈', titleLines: ['Antros', 'LGBT'] },
    'hotel motel': { template: 'classic', accent: '#e63946', photo: 'img/home/motel-noche.jpg', icon: '🏩', titleLines: ['Hotel /', 'Motel'] },
    'cabinas glory holes': { template: 'noir', accent: '#6c757d', photo: 'img/home/hero-motel-noche-rojo.png', icon: '🚪', titleLines: ['Cabinas /', 'Glory Holes'] },
    'trans': { template: 'bloom', accent: '#5fa8d3', photo: 'img/home/hero-01-escort-gay.png', icon: '⚧️' },
    'femboy': { template: 'sunset', accent: '#ff99c8', photo: 'img/home/hero-spa-interior.png', icon: '🌸' },
    'swinger': { template: 'neon', accent: '#ff0054', photo: 'img/home/hero-club-swinger.png', icon: '🍍', titleLines: ['Club', 'Swinger'] },
    'unicorns': { template: 'pulse', accent: '#9b5de5', accent2: '#00f5d4', photo: 'img/home/lounge-swinger.jpg', icon: '🦄' },
    'cuckold hotwife': { template: 'sunset', accent: '#ff4500', photo: 'img/home/motel-spa-model.jpg', icon: '🔥', titleLines: ['Cuckold /', 'Hotwife'] },
    'singles': { template: 'classic', accent: '#fb5607', photo: 'img/home/nightclub.jpg', icon: '💫' },
    'hotwife': { template: 'bloom', accent: '#ff006e', photo: 'img/home/promo-perfil.jpg', icon: '🔥' },
    'lesbians': { template: 'pulse', accent: '#e91e98', accent2: '#9b5de5', photo: 'img/home/hero-lesbianas.png', icon: '👩‍❤️‍👩' },
    'tom boy': { template: 'noir', accent: '#4ea8de', photo: 'img/home/escort-gay.jpg', icon: '🧢' },
    'tom fem': { template: 'bloom', accent: '#ff85a1', photo: 'img/home/hero-carinosa-motel-spa-runway.png', icon: '💄' },
    'dotados': { template: 'classic', accent: '#d62828', photo: 'img/home/motel-noche.jpg', icon: '🍆' },
    'fetiche': { template: 'noir', accent: '#212529', accent2: '#e5383b', photo: 'img/home/hero-motel-noche-rojo.png', icon: '🖤' },
    'sado': { template: 'neon', accent: '#8b0000', photo: 'img/home/hero-motel-noche-rojo.png', icon: '⛓️' },
    'dominatrix': { template: 'noir', accent: '#720026', photo: 'img/home/hero-negocios-grid-noche.png', icon: '🖤' },
    'cine xxx': { template: 'pulse', accent: '#ff006e', accent2: '#8338ec', photo: 'img/home/hero-bar-neon.png', icon: '🎥' }
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
    return {
      template: tpl,
      accent: ov.accent || '#ec2d7a',
      accent2: ov.accent2,
      photo: ov.photo,
      gradient: ov.photo ? null : GRADIENTS[index % GRADIENTS.length],
      icon: ov.icon || cat.emoji || '✨',
      title: cat.nombre,
      titleLines: ov.titleLines,
      catId: id,
      catName: cat.nombre
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

  var SECTOR_PHOTOS = {
    adultos: 'img/home/sectores-card/01-adultos.png',
    bienestar: 'img/home/sectores-card/02-bienestar.png',
    salud: 'img/home/sectores-card/03-salud.png',
    profesionales: 'img/home/sectores-card/04-profesionales.png',
    automotriz: 'img/home/sectores-card/05-automotriz.png',
    hogar: 'img/home/sectores-card/06-hogar.png',
    comercio: 'img/home/sectores-card/07-comercio.png',
    'bienes-raices': 'img/home/sectores-card/08-bienes-raices.png',
    eventos: 'img/home/sectores/sector-09-eventos.png',
    transporte: 'img/home/sectores/sector-10-transporte.png',
    educacion: 'img/home/sectores-card/11-educacion.png',
    tecnologia: 'img/home/sectores/sector-12-tecnologia.png',
    restaurantes: 'img/home/sectores-card/13-restaurantes.png',
    mascotas: 'img/home/sectores-card/14-mascotas.png',
    industria: 'img/home/sectores-card/15-industria.png'
  };

  var SECTOR_PHOTO_ALT = {
    adultos: 'img/home/sectores/sector-01-adultos.png',
    bienestar: 'img/home/sectores/sector-02-bienestar.png',
    salud: 'img/home/sectores/sector-03-salud.png',
    profesionales: 'img/home/sectores/sector-04-profesionales.png',
    automotriz: 'img/home/sectores/sector-05-automotriz.png',
    hogar: 'img/home/sectores/sector-06-hogar.png',
    comercio: 'img/home/sectores/sector-07-comercio.png',
    'bienes-raices': 'img/home/sectores/sector-08-bienes-raices.png',
    educacion: 'img/home/sectores/sector-11-educacion.png',
    restaurantes: 'img/home/sectores/sector-13-restaurantes.png',
    mascotas: 'img/home/sectores/sector-14-mascotas.png',
    industria: 'img/home/sectores/sector-15-industria.png'
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

  function resolveSectorPhoto(sectorId, done) {
    var primary = SECTOR_PHOTOS[sectorId] || '';
    var alt = SECTOR_PHOTO_ALT[sectorId] || '';
    if (!primary) {
      done(alt || '');
      return;
    }
    var probe = new Image();
    probe.onload = function () { done(primary); };
    probe.onerror = function () { done(alt || primary); };
    probe.src = primary;
  }

  function sectorVisual(sector, index, compact) {
    var photo = SECTOR_PHOTOS[sector.id] || SECTOR_PHOTO_ALT[sector.id] || '';
    var nombre = sector.nombre || SECTOR_SHORT[sector.id] || '';
    var short = SECTOR_SHORT[sector.id] || nombre.split(',')[0].split(' y ')[0];
    return {
      template: 'classic',
      accent: '#ffffff',
      photo: photo,
      gradient: photo ? null : GRADIENTS[index % GRADIENTS.length],
      title: compact ? short : nombre,
      titleLines: compact ? [short] : (SECTOR_TITLE_LINES[sector.id] || splitTitle(nombre)),
      sectorId: sector.id,
      sectorCard: true
    };
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
  }

  window.CariHubVCard = {
    build: buildVCard,
    mount: mountVCard,
    catVisual: catVisual,
    sectorVisual: sectorVisual,
    splitTitle: splitTitle
  };
})();
