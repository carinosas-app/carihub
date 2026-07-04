/**
 * CariHub — Resolución de sector para la pantalla de resultados.
 * Fuente única para: (1) resolver el sectorId a partir de la categoría buscada,
 * (2) aplicar el tema visual por sector (body[data-sector]),
 * (3) mapear el sector a su juego de banners.
 *
 * Reutiliza el contrato oficial de CARIHUB_REGISTRO_SCHEMA_INDEX vía
 * CariHubFieldEngineLite.resolvePublicPresentation. No duplica el índice.
 */
(function (global) {
  'use strict';

  /* Sectores con tema/banners definidos. adultos = default (fucsia). */
  var SECTORS = [
    'adultos', 'salud', 'bienestar', 'restaurantes', 'automotriz',
    'profesionales', 'hogar', 'comercio', 'mascotas', 'eventos',
    'educacion', 'tecnologia', 'transporte', 'industria', 'bienes-raices'
  ];

  /* Banner temático por sector (reutiliza assets ad-banner-{sector}). adultos
     conserva su juego propio de banners de resultados (no se sobrescribe). */
  var SECTOR_BANNER = {
    salud: 'img/home/banners/ad-banner-salud-01.png',
    bienestar: 'img/home/banners/ad-banner-bienestar-01.png',
    restaurantes: 'img/home/banners/ad-banner-restaurantes-01.png',
    automotriz: 'img/home/banners/ad-banner-automotriz-01.png',
    profesionales: 'img/home/banners/ad-banner-profesionales-01.png',
    hogar: 'img/home/banners/ad-banner-hogar-01.png',
    comercio: 'img/home/banners/ad-banner-comercio-01.png',
    mascotas: 'img/home/banners/ad-banner-mascotas-01.png',
    eventos: 'img/home/banners/ad-banner-eventos-01.png',
    educacion: 'img/home/banners/ad-banner-educacion-01.png',
    tecnologia: 'img/home/banners/ad-banner-tecnologia-01.png',
    transporte: 'img/home/banners/ad-banner-transporte-01.png',
    industria: 'img/home/banners/ad-banner-industria-01.png',
    'bienes-raices': 'img/home/banners/ad-banner-bienes-raices-01.png'
  };

  /* Fallback ligero por si el field-engine aún no está disponible. Mapea
     etiquetas/ids comunes a su sector. La fuente real es el schema-index. */
  var FALLBACK_SECTOR = {
    'carinosas': 'adultos', 'escort': 'adultos', 'stripper': 'adultos',
    'masajes': 'adultos', 'restaurante': 'restaurantes', 'restaurantes': 'restaurantes',
    'doctor': 'salud', 'medico': 'salud', 'salud': 'salud',
    'mecanico': 'automotriz', 'vulcanizadora': 'automotriz',
    'abogado': 'profesionales', 'veterinario': 'mascotas'
  };

  /** Textos de banners por sector (arriba + abajo). adultos usa los defaults del módulo banner. */
  var SECTOR_BANNER_LABELS = {
    salud: {
      izquierda: '¿Eres médico? Registra tu consultorio',
      centro: 'Salud y bienestar cerca de ti',
      derecha: 'Anuncia tu clínica o consultorio',
      inferior: 'Promociona tu servicio de salud'
    },
    bienestar: {
      izquierda: '¿Ofreces bienestar holístico?',
      centro: 'Encuentra equilibrio cerca de ti',
      derecha: 'Registra tu espacio de bienestar',
      inferior: 'Anuncia masajes, yoga o temazcal'
    },
    restaurantes: {
      izquierda: '¿Tienes un restaurante?',
      centro: 'Sabores de tu ciudad',
      derecha: 'Destaca tu menú en CariHub',
      inferior: 'Promociona tu restaurante'
    },
    automotriz: {
      izquierda: '¿Tienes un taller?',
      centro: 'Servicio automotriz confiable',
      derecha: 'Anuncia tu vulcanizadora o taller',
      inferior: 'Promociona tu negocio automotriz'
    },
    profesionales: {
      izquierda: '¿Eres profesionista?',
      centro: 'Expertos verificados cerca de ti',
      derecha: 'Registra tu despacho o consultorio',
      inferior: 'Anuncia tu servicio profesional'
    },
    mascotas: {
      izquierda: '¿Cuidas mascotas?',
      centro: 'Servicios para mascotas',
      derecha: 'Registra tu veterinaria o paseo',
      inferior: 'Promociona tu servicio para mascotas'
    },
    hogar: {
      izquierda: '¿Ofreces servicios para el hogar?',
      centro: 'Profesionales del hogar',
      derecha: 'Anuncia plomería, limpieza o jardinería',
      inferior: 'Promociona tu servicio del hogar'
    },
    comercio: {
      izquierda: '¿Tienes un negocio?',
      centro: 'Comercio local cerca de ti',
      derecha: 'Destaca tu tienda o servicio',
      inferior: 'Anuncia tu comercio'
    },
    eventos: {
      izquierda: '¿Organizas eventos?',
      centro: 'Fiestas y celebraciones',
      derecha: 'Registra tu servicio de eventos',
      inferior: 'Promociona banquetes, DJ o salones'
    },
    educacion: {
      izquierda: '¿Das clases o tutorías?',
      centro: 'Aprende con expertos locales',
      derecha: 'Anuncia tu academia o curso',
      inferior: 'Promociona tu servicio educativo'
    },
    tecnologia: {
      izquierda: '¿Ofreces servicios tech?',
      centro: 'Soporte y tecnología',
      derecha: 'Registra tu negocio de tecnología',
      inferior: 'Anuncia reparación o desarrollo'
    },
    transporte: {
      izquierda: '¿Ofreces transporte?',
      centro: 'Mudanzas y logística',
      derecha: 'Anuncia tu servicio de transporte',
      inferior: 'Promociona mudanzas o fletes'
    },
    industria: {
      izquierda: '¿Ofreces servicios industriales?',
      centro: 'Soluciones industriales',
      derecha: 'Registra tu empresa industrial',
      inferior: 'Anuncia maquinaria o manufactura'
    },
    'bienes-raices': {
      izquierda: '¿Vendes o rentas propiedades?',
      centro: 'Inmuebles en tu zona',
      derecha: 'Anuncia tu inmobiliaria',
      inferior: 'Promociona casas, departamentos o terrenos'
    }
  };

  global.CARIHUB_SECTOR_BANNER_LABELS = SECTOR_BANNER_LABELS;

  /** Subcategorías adultas con tema arcoíris en resultados. */
  var LGBT_SUBCATEGORIAS = [
    'escort gay',
    'antro restaurant bar lgbt',
    'trans',
    'femboy',
    'lesbians',
    'tom boy',
    'tom fem'
  ];

  var LGBT_BANNERS = [
    'img/home/banners/ad-banner-lgbt-resultados-01.png',
    'img/home/banners/ad-banner-lgbt-resultados-02.png',
    'img/home/banners/ad-banner-lgbt-resultados-03.png'
  ];

  var LGBT_BANNER_LABELS = {
    izquierda: 'Anúnciate aquí',
    centro: 'Anúnciate aquí',
    derecha: 'Anúnciate aquí',
    inferior: 'Promociona tu perfil — Anúnciate aquí'
  };

  global.CARIHUB_LGBT_BANNER_LABELS = LGBT_BANNER_LABELS;

  /* Banners fotográficos por subcategoría de negocio para adultos.
     Keyed por subcategoriaId canónico (normalizado). Tienen prioridad sobre
     el juego LGBT/sector para que cada negocio muestre su imagen representativa. */
  var SUBCAT_BANNERS = {
    'sex shop': 'img/home/banners/ad-banner-adult-sexshop-01.png',
    'spa': 'img/home/banners/ad-banner-adult-spa-01.png',
    'masajes': 'img/home/banners/ad-banner-adult-masajes-01.png',
    'antro restaurant bar': 'img/home/banners/ad-banner-adult-antro-01.png',
    'antro restaurant bar lgbt': 'img/home/banners/ad-banner-adult-antro-lgbt-01.png',
    'hotel motel': 'img/home/banners/ad-banner-adult-hotel-motel-01.png'
  };

  function subcategoriaIdDe(cat) {
    var fe = global.CariHubFieldEngineLite;
    if (fe && fe.lookupSubcategoriaId) {
      var id = fe.lookupSubcategoriaId(cat);
      if (id) return norm(id);
    }
    return norm(cat);
  }

  function esSubcategoriaLgbt(cat) {
    if (!cat) return false;
    var id = subcategoriaIdDe(cat);
    for (var i = 0; i < LGBT_SUBCATEGORIAS.length; i++) {
      if (norm(LGBT_SUBCATEGORIAS[i]) === id) return true;
    }
    return false;
  }

  /** Banner fotográfico de la subcategoría de negocio adulto (o null). */
  function bannerDeSubcategoria(cat) {
    if (!cat) return null;
    var id = subcategoriaIdDe(cat);
    return SUBCAT_BANNERS[id] || null;
  }

  function syncSubtemaLgbt(cat) {
    if (!global.document || !document.body) return;
    if (esSubcategoriaLgbt(cat)) {
      document.body.setAttribute('data-subtema', 'lgbt');
    } else {
      document.body.removeAttribute('data-subtema');
    }
  }

  function norm(t) {
    if (global.CHUI && CHUI.chNorm) return CHUI.chNorm(t);
    return String(t || '')
      .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ').trim();
  }

  function esSectorValido(id) {
    return SECTORS.indexOf(id) >= 0;
  }

  function slugCat(t) {
    return norm(t).replace(/\s+/g, '-');
  }

  /** Variantes de id para etiquetas de UI (ej. «Restaurante Tradicional» → restaurantes-tradicional). */
  function variantesSubcatId(cat) {
    var raw = String(cat || '').trim();
    if (!raw) return [];
    var slug = slugCat(raw);
    var out = [raw, slug];
    if (slug.indexOf('restaur') === 0 && slug.indexOf('restaurantes-') !== 0) {
      out.push('restaurantes-' + slug.replace(/^restaurante-?/, '').replace(/^restaurantes-?/, ''));
    }
    return out.filter(function (v, i, a) { return v && a.indexOf(v) === i; });
  }

  function sectorDesdeSchema(cat) {
    var fe = global.CariHubFieldEngineLite;
    if (!fe || !fe.resolveMapaRow) return '';
    var variants = variantesSubcatId(cat);
    for (var i = 0; i < variants.length; i++) {
      var row = fe.resolveMapaRow(variants[i]);
      if (row && esSectorValido(row.sectorId)) return row.sectorId;
    }
    return '';
  }

  /** Devuelve el sectorId (string) de la categoría/subcategoría buscada. */
  function sectorDeCategoria(cat) {
    var fromRow = sectorDesdeSchema(cat);
    if (fromRow) return fromRow;

    var fe = global.CariHubFieldEngineLite;
    if (fe && fe.resolvePublicPresentation) {
      try {
        var pres = fe.resolvePublicPresentation({
          categoria: cat,
          subcategoriaId: fe.lookupSubcategoriaId ? fe.lookupSubcategoriaId(cat) : undefined
        });
        if (pres && esSectorValido(pres.sectorId)) return pres.sectorId;
      } catch (e) { /* usa fallback */ }
    }
    var k = norm(cat);
    var slug = slugCat(cat);
    if (esSectorValido(k)) return k;
    if (esSectorValido(slug)) return slug;
    if (FALLBACK_SECTOR[slug]) return FALLBACK_SECTOR[slug];
    if (FALLBACK_SECTOR[k]) return FALLBACK_SECTOR[k];
    if (k.indexOf('restaur') >= 0 || k.indexOf('marisquer') >= 0 || k.indexOf('taquer') >= 0) return 'restaurantes';
    if (k.indexOf('medic') >= 0 || k.indexOf('doctor') >= 0 || k.indexOf('enfermer') >= 0 || k.indexOf('dent') >= 0) return 'salud';
    if (k.indexOf('mecan') >= 0 || k.indexOf('vulcaniz') >= 0 || k.indexOf('automo') >= 0) return 'automotriz';
    if (k.indexOf('veterin') >= 0 || k.indexOf('mascot') >= 0 || k.indexOf('pet') >= 0) return 'mascotas';
    return FALLBACK_SECTOR[k] || 'adultos';
  }

  /** Monta el sheen rosa solo en adultos (no LGBT); LGBT y otros sectores usan fondo temático CSS. */
  function syncPageSheen(sector, cat) {
    var ps = global.CariHubPinkSheen;
    if (!ps || !global.document || !document.body) return;
    if (esSubcategoriaLgbt(cat)) {
      ps.unmountPage(document.body);
      return;
    }
    if (sector === 'adultos') {
      ps.mountPage(document.body);
    } else {
      ps.unmountPage(document.body);
    }
  }

  /** Aplica el tema del sector al <body>. Acepta categoría o sectorId directo. */
  function aplicarTemaSector(catOrSector) {
    var cat = catOrSector;
    var sector = esSectorValido(catOrSector) ? catOrSector : sectorDeCategoria(catOrSector);
    if (global.document && document.body) {
      document.body.setAttribute('data-sector', sector);
    }
    syncSubtemaLgbt(cat);
    var ss = global.CariHubSectorSparkles;
    if (ss && ss.syncBody) {
      if (esSubcategoriaLgbt(cat)) ss.syncBody('');
      else ss.syncBody(sector);
    }
    syncPageSheen(sector, cat);
    return sector;
  }

  /** Imágenes de banner temático (null si adultos rosa estándar). */
  function bannersDeSector(catOrSector) {
    /* Negocio adulto con banner fotográfico propio: prioridad máxima. */
    var subImg = bannerDeSubcategoria(catOrSector);
    if (subImg) return [subImg];
    if (esSubcategoriaLgbt(catOrSector)) return LGBT_BANNERS.slice();
    var sector = esSectorValido(catOrSector) ? catOrSector : sectorDeCategoria(catOrSector);
    if (sector === 'adultos') return null;
    var img = SECTOR_BANNER[sector];
    return img ? [img] : null;
  }

  /** Imagen de banner temático del sector (null si adultos o sin asset). */
  function bannerDeSector(catOrSector) {
    var list = bannersDeSector(catOrSector);
    return list && list.length ? list[0] : null;
  }

  global.CariHubResultadosSector = {
    SECTORS: SECTORS,
    LGBT_SUBCATEGORIAS: LGBT_SUBCATEGORIAS,
    sectorDeCategoria: sectorDeCategoria,
    esSubcategoriaLgbt: esSubcategoriaLgbt,
    bannerDeSubcategoria: bannerDeSubcategoria,
    aplicarTemaSector: aplicarTemaSector,
    syncPageSheen: syncPageSheen,
    bannerDeSector: bannerDeSector,
    bannersDeSector: bannersDeSector,
    esSectorValido: esSectorValido
  };
})(typeof window !== 'undefined' ? window : this);
