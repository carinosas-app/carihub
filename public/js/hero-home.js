(function () {
  'use strict';

  /* Fotos del usuario — nuevas imágenes WhatsApp junio 2026 */
  var U = {
    promo: 'img/home/hero-carinosa-motel-spa-runway.png',
    promoPerfil: 'img/home/hero-carinosa-motel-spa-runway.png',
    lgbt: 'img/home/hero-escort-gay.png',
    lesbianas: 'img/home/hero-lesbianas.png',
    lounge: 'img/home/hero-club-swinger.png',
    motelSpa: 'img/home/hero-motel-spa-fachada.png',
    motel: 'img/home/hero-motel-noche-rojo.png',
    spa: 'img/home/hero-spa-interior.png',
    sexshop: 'img/home/hero-negocios-grid-noche.png',
    nightclub: 'img/home/hero-bar-neon.png',
    antro: 'img/home/hero-antro-restaurante.png',
    negocios: 'img/home/hero-calle-negocios-dia.png',
    grid: 'img/home/hero-negocios-grid-noche.png'
  };

  window.CARIHUB_USER_HERO_SET = [
    U.promo, U.antro, U.lounge, U.lgbt, U.motelSpa, U.spa, U.motel, U.negocios
  ];

  /* Palabras del hero — ortografía revisada */
  var HERO_COPY = {
    escort: { kw: 'acompañantes cariñosas', prefix: 'Encuentra ', subtitle: 'Perfiles reales, verificados y actualizados', showcase: true },
    'escort gay': { kw: 'escorts gay', prefix: 'Encuentra ', subtitle: 'Perfiles LGBT verificados' },
    'escort vip': { kw: 'escorts VIP', prefix: 'Encuentra ', subtitle: 'Experiencias premium cerca de ti' },
    edecan: { kw: 'edecanes', prefix: 'Encuentra ', subtitle: 'Eventos, convenciones y promociones' },
    stripper: { kw: 'strippers', prefix: 'Encuentra ', subtitle: 'Shows y entretenimiento' },
    modelos: { kw: 'modelos', prefix: 'Encuentra ', subtitle: 'Sesiones y casting en tu zona' },
    gigolo: { kw: 'gigolós', prefix: 'Encuentra ', subtitle: 'Acompañantes masculinos verificados' },
    acompanante: { kw: 'acompañantes', prefix: 'Encuentra ', subtitle: 'Compañía y citas discretas' },
    petit: { kw: 'petit', prefix: 'Encuentra ', subtitle: 'Perfiles petit cerca de ti' },
    contenido: { kw: 'creadores de contenido', prefix: 'Encuentra ', subtitle: 'Contenido exclusivo y suscripciones' },
    tabledance: { kw: 'tabledance', prefix: 'Encuentra el mejor ', subtitle: 'Shows y entretenimiento nocturno', negocio: true },
    'sex shop': { kw: 'sex shop', prefix: 'Encuentra el mejor ', subtitle: 'Productos y novedades', negocio: true },
    spa: { kw: 'spa', prefix: 'Encuentra el mejor ', subtitle: 'Relax, masajes y bienestar', negocio: true },
    masajes: { kw: 'masajes', prefix: 'Encuentra los mejores ', subtitle: 'Centros de masaje en tu zona', negocio: true },
    'club sw': { kw: 'club swinger', prefix: 'Encuentra el mejor ', subtitle: 'Experiencias para parejas y grupos', negocio: true },
    'antro restaurant bar': { kw: 'antro y restaurant bar', prefix: 'Encuentra el mejor ', subtitle: 'Antros, bares y gastronomía', negocio: true },
    'antro restaurant bar lgbt': { kw: 'antro LGBT', prefix: 'Encuentra el mejor ', subtitle: 'Ambiente inclusivo y diverso', negocio: true },
    'hotel motel': { kw: 'hoteles', prefix: 'Encuentra los mejores ', subtitle: 'Hospedaje y estadías en tu zona', negocio: true, slotKey: 'hotel' },
    'hotel motel motel': { kw: 'moteles', prefix: 'Encuentra los mejores ', subtitle: 'Estadías discretas cerca de ti', negocio: true, slotKey: 'motel', categoriaId: 'hotel motel' },
    'cabinas glory holes': { kw: 'cabinas', prefix: 'Encuentra las mejores ', subtitle: 'Espacios privados en tu ciudad', negocio: true },
    trans: { kw: 'acompañantes trans', prefix: 'Encuentra ', subtitle: 'Perfiles trans verificados' },
    femboy: { kw: 'femboys', prefix: 'Encuentra ', subtitle: 'Perfiles femboy cerca de ti' },
    swinger: { kw: 'parejas swinger', prefix: 'Encuentra ', subtitle: 'Conexiones para parejas' },
    unicorns: { kw: 'unicorns', prefix: 'Encuentra ', subtitle: 'Perfiles unicorn cerca de ti' },
    'cuckold hotwife': { kw: 'cuckold y hotwife', prefix: 'Encuentra ', subtitle: 'Comunidad y experiencias' },
    singles: { kw: 'singles', prefix: 'Encuentra ', subtitle: 'Conexiones para solteros' },
    hotwife: { kw: 'hotwife', prefix: 'Encuentra ', subtitle: 'Perfiles hotwife verificados' },
    lesbians: { kw: 'lesbians', prefix: 'Encuentra ', subtitle: 'Perfiles lesbian cerca de ti' },
    'tom boy': { kw: 'tom boy', prefix: 'Encuentra ', subtitle: 'Estilo y actitud única' },
    'tom fem': { kw: 'tom fem', prefix: 'Encuentra ', subtitle: 'Perfiles tom fem cerca de ti' },
    dotados: { kw: 'dotados', prefix: 'Encuentra ', subtitle: 'Perfiles destacados' },
    fetiche: { kw: 'fetiche', prefix: 'Encuentra ', subtitle: 'Experiencias y fantasías' },
    sado: { kw: 'sado', prefix: 'Encuentra ', subtitle: 'Comunidad BDSM verificada' },
    dominatrix: { kw: 'dominatrix', prefix: 'Encuentra ', subtitle: 'Sesiones y dominación profesional' },
    'cine xxx': { kw: 'cine XXX', prefix: 'Encuentra el mejor ', subtitle: 'Entretenimiento para adultos', negocio: true }
  };

  var HERO_BG = {
    escort: 'linear-gradient(135deg,#ffc9e0 0%,#e91e63 55%,#ad1457 100%)',
    spa: 'linear-gradient(135deg,#e8f5e9 0%,#26a69a 50%,#00695c 100%)',
    masajes: 'linear-gradient(135deg,#e0f7fa 0%,#4dd0e1 50%,#00838f 100%)',
    'club sw': 'linear-gradient(135deg,#f3e5f5 0%,#8e24aa 55%,#4a148c 100%)',
    'antro restaurant bar': 'linear-gradient(135deg,#fff3e0 0%,#ff7043 55%,#bf360c 100%)',
    tabledance: 'linear-gradient(135deg,#fce4ec 0%,#d81b60 50%,#880e4f 100%)',
    'hotel motel': 'linear-gradient(135deg,#ffe0f0 0%,#7e57c2 50%,#4527a0 100%)',
    'sex shop': 'linear-gradient(135deg,#fce4ec 0%,#ec407a 50%,#ad1457 100%)',
    default: 'linear-gradient(135deg,#fff0f6 0%,#f48fb1 45%,#c2185b 100%)'
  };

  window.CARIHUB_HERO_RENTALS = {};

  window.CARIHUB_HERO_BANNER_SLOTS = [
    'home_hero_1',
    'home_hero_2',
    'home_hero_3',
    'home_hero_4',
    'home_hero_5'
  ];

  window.CARIHUB_HERO_BANNER_RENTALS = {};

  /* Imagen temática por categoría — solo fotos del usuario */
  window.CARIHUB_HERO_PREVIEW_IMAGES = {
    escort: U.promo,
    acompanante: U.promoPerfil,
    'escort gay': U.lgbt,
    'escort vip': U.promo,
    edecan: U.promo,
    stripper: U.antro,
    modelos: U.promo,
    gigolo: U.lgbt,
    petit: U.promo,
    contenido: U.promoPerfil,
    tabledance: U.antro,
    'sex shop': U.sexshop,
    spa: U.spa,
    masajes: U.spa,
    'club sw': U.lounge,
    'antro restaurant bar': U.antro,
    'antro restaurant bar lgbt': U.lgbt,
    hotel: U.motelSpa,
    'hotel motel': U.motelSpa,
    motel: U.motel,
    'cabinas glory holes': U.grid,
    trans: U.promo,
    femboy: U.lgbt,
    swinger: U.lounge,
    unicorns: U.lounge,
    'cuckold hotwife': U.lounge,
    singles: U.lounge,
    hotwife: U.lounge,
    lesbians: U.lesbianas,
    'tom boy': U.promo,
    'tom fem': U.promo,
    dotados: U.promo,
    fetiche: U.lounge,
    sado: U.lounge,
    dominatrix: U.promo,
    'cine xxx': U.nightclub
  };

  function heroBg(id) {
    return HERO_BG[id] || HERO_BG.default;
  }

  function heroTema(id) {
    if (id === 'spa' || id === 'masajes') return 'spa';
    if (id === 'hotel motel' || id === 'hotel motel motel') return 'hotel';
    if (id === 'club sw' || id === 'swinger') return 'swinger';
    if (id.indexOf('antro') === 0) return 'bar';
    if (id === 'tabledance') return 'tabledance';
    return 'escort';
  }

  function defaultCopy(cat) {
    var n = cat.nombre.toLowerCase();
    return {
      kw: n,
      prefix: 'Encuentra ',
      subtitle: 'Encuentra ' + cat.nombre + ' cerca de ti'
    };
  }

  function slideLabel(cat, copy) {
    if (copy.slotKey === 'motel') return 'Motel';
    if (copy.slotKey === 'hotel') return 'Hotel';
    return cat.nombre;
  }

  function buildSlide(cat, copyKey) {
    var key = copyKey || cat.id;
    var copy = HERO_COPY[key] || defaultCopy(cat);

    var categoriaId = copy.categoriaId || cat.id;
    var slotKey = copy.slotKey || categoriaId;

    return {
      categoriaId: categoriaId,
      slotKey: slotKey,
      categoriaNombre: cat.nombre,
      slideLabel: slideLabel(cat, copy),
      tema: heroTema(key),
      titleKeyword: copy.kw,
      titlePrefix: copy.prefix,
      subtitle: copy.subtitle,
      bg: heroBg(categoriaId === 'hotel motel' && copy.slotKey === 'motel' ? 'hotel motel' : categoriaId),
      emoji: cat.emoji,
      negocio: !!copy.negocio,
      showcase: !!copy.showcase,
      showcaseImage: null
    };
  }

  function buildHeroSlides(categorias) {
    var slides = [];
    var motelAdded = false;

    categorias.forEach(function (cat) {
      slides.push(buildSlide(cat));
      if (cat.id === 'hotel motel' && !motelAdded) {
        slides.push(buildSlide(cat, 'hotel motel motel'));
        motelAdded = true;
      }
    });

    return slides.filter(Boolean);
  }

  var cats = window.CARIHUB_CATEGORIAS_HOME;
  if ((!cats || !cats.length) && window.CATALOGO_CATEGORIAS_CARIHUB) {
    cats = window.CATALOGO_CATEGORIAS_CARIHUB.map(function (c) {
      return { id: c.id, nombre: c.nombre, emoji: c.emoji };
    });
    window.CARIHUB_CATEGORIAS_HOME = cats;
  }
  window.CARIHUB_HERO_SLIDES = buildHeroSlides(cats || []);
})();
