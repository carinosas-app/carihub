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
    'masajes': 'adultos', 'spa': 'adultos', 'restaurante': 'restaurantes', 'restaurantes': 'restaurantes',
    'doctor': 'salud', 'medico': 'salud', 'salud': 'salud', 'medico-general': 'salud',
    'mecanico': 'automotriz', 'vulcanizadora': 'automotriz',
    'abogado': 'profesionales', 'veterinario': 'mascotas',
    /* Bienestar holístico / espiritualidad / terapias (no adultos spa/masajes) */
    'yoga': 'bienestar', 'pilates': 'bienestar', 'meditacion': 'bienestar', 'reiki': 'bienestar',
    'tarot': 'bienestar', 'astrologia': 'bienestar', 'temazcales': 'bienestar',
    'terapias-holisticas': 'bienestar', 'terapias-energeticas': 'bienestar', 'terapias-alternativas': 'bienestar',
    'retiros-espirituales': 'bienestar', 'turismo-espiritual': 'bienestar', 'coaching-espiritual': 'bienestar',
    'coaching-de-vida': 'bienestar', 'centros-holisticos': 'bienestar', 'centros-de-yoga': 'bienestar',
    'velas-esotericas': 'bienestar', 'velas-aromaticas': 'bienestar', 'venta-de-inciensos': 'bienestar',
    'venta-de-aceites-esenciales': 'bienestar', 'productos-holisticos': 'bienestar',
    'herbolarios': 'bienestar', 'bienestar': 'bienestar'
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
      centro: 'Yoga, terapias y espiritualidad',
      derecha: 'Registra tu espacio de bienestar',
      inferior: 'Anuncia yoga, terapias o espiritualidad'
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

  /**
   * Subcategorías adultas con tema arcoíris en resultados (SSOT canónico).
   * FOUC en resultados.html debe usar la misma lista + normLgbtSlug (exact match).
   */
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
    'hotel motel': 'img/home/banners/ad-banner-adult-hotel-motel-01.png',
    /* Bienestar retail — fotos reales de categoría (no SVG stub). */
    'velas-aromaticas': 'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    'velas aromaticas': 'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    'velas-esotericas': 'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    'velas esotericas': 'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    'venta-de-velas': 'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    'venta de velas': 'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    'venta-de-inciensos': 'img/registro-subcats/bienestar/bien-05-herbolaria.png',
    'venta de inciensos': 'img/registro-subcats/bienestar/bien-05-herbolaria.png',
    'venta-de-aceites-esenciales': 'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    'venta de aceites esenciales': 'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    'venta-de-aceites': 'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    'venta de aceites': 'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    aromaterapia: 'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    herbolarios: 'img/registro-subcats/bienestar/bien-05-herbolaria.png',
    'productos-holisticos': 'img/registro-subcats/bienestar/bien-09-cristales.png',
    'productos holisticos': 'img/registro-subcats/bienestar/bien-09-cristales.png'
  };

  /** Pool fotográfico bienestar para rotar 3 slots (PNG reales, no placeholders). */
  var BIENESTAR_BANNER_POOL = [
    'img/home/banners/ad-banner-bienestar-01.png',
    'img/registro-subcats/bienestar/bien-08-aromaterapia.png',
    'img/registro-subcats/bienestar/bien-05-herbolaria.png',
    'img/registro-subcats/bienestar/bien-09-cristales.png',
    'img/registro-subcats/bienestar/bien-01-yoga.png',
    'img/registro-subcats/bienestar/bien-10-meditacion.png'
  ];

  function subcategoriaIdDe(cat) {
    var fe = global.CariHubFieldEngineLite;
    if (fe && fe.lookupSubcategoriaId) {
      var id = fe.lookupSubcategoriaId(cat);
      if (id) return norm(id);
    }
    return norm(cat);
  }

  /**
   * Normaliza categoría/subcategoría para detección LGBTQ+ (exact match).
   * Equivalente al FOUC de resultados.html — no usar indexOf parcial.
   * "escort-gay" / "escort_gay" / "Escort Gay" → "escort gay"
   */
  function normLgbtSlug(t) {
    return String(t || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function esSubcategoriaLgbt(cat) {
    if (!cat) return false;
    var raw = normLgbtSlug(cat);
    if (!raw) return false;
    var looked = '';
    var fe = global.CariHubFieldEngineLite;
    if (fe && typeof fe.lookupSubcategoriaId === 'function') {
      looked = normLgbtSlug(fe.lookupSubcategoriaId(cat) || '');
    }
    for (var i = 0; i < LGBT_SUBCATEGORIAS.length; i++) {
      var canon = normLgbtSlug(LGBT_SUBCATEGORIAS[i]);
      if (canon === raw || (looked && canon === looked)) return true;
    }
    return false;
  }

  /** Banner fotográfico de la subcategoría de negocio adulto (o null). */
  function bannerDeSubcategoria(cat) {
    if (!cat) return null;
    var id = subcategoriaIdDe(cat);
    if (SUBCAT_BANNERS[id]) return SUBCAT_BANNERS[id];
    var spaced = normLgbtSlug(id);
    if (SUBCAT_BANNERS[spaced]) return SUBCAT_BANNERS[spaced];
    var dashed = slugCat(id);
    return SUBCAT_BANNERS[dashed] || null;
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
    /* Spa/masajes adultos: no mapear a bienestar holístico */
    if (k === 'spa' || k === 'masajes' || k.indexOf('spa ') === 0) return 'adultos';
    if (k.indexOf('yoga') >= 0 || k.indexOf('reiki') >= 0 || k.indexOf('tarot') >= 0 ||
        k.indexOf('temazcal') >= 0 || k.indexOf('holistic') >= 0 || k.indexOf('espiritual') >= 0 ||
        k.indexOf('terapias-holistic') >= 0 || k.indexOf('terapias-energet') >= 0 ||
        k.indexOf('terapias-alternat') >= 0 || k.indexOf('meditacion') >= 0 || k.indexOf('pilates') >= 0 ||
        k.indexOf('esoteric') >= 0 || k.indexOf('inciens') >= 0 || k.indexOf('aceite') >= 0 ||
        k.indexOf('vela') >= 0 || k.indexOf('herbol') >= 0 || k.indexOf('ayahuasca') >= 0 ||
        k.indexOf('chaman') >= 0 || (k.indexOf('bienestar') >= 0 && k.indexOf('spa') < 0)) return 'bienestar';
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
      if (esSubcategoriaLgbt(cat)) ss.syncBody('lgbt');
      else ss.syncBody(sector);
    }
    syncPageSheen(sector, cat);
    try {
      if (global.document && typeof global.CustomEvent === 'function') {
        document.dispatchEvent(new CustomEvent('carihub:resultados-tema', {
          detail: { sector: sector, categoria: cat, lgbt: esSubcategoriaLgbt(cat) }
        }));
      }
    } catch (e) { /* opcional */ }
    return sector;
  }

  /** Rota un lead + pool hasta n rutas únicas (fotos reales). */
  function poolBannersConLead(lead, pool, n) {
    var out = [];
    var seen = {};
    function push(src) {
      if (!src || seen[src]) return;
      seen[src] = true;
      out.push(src);
    }
    push(lead);
    var i;
    for (i = 0; i < (pool || []).length && out.length < n; i++) push(pool[i]);
    return out.length ? out : null;
  }

  /** Imágenes de banner temático (null si adultos rosa estándar). */
  function bannersDeSector(catOrSector) {
    /* Negocio adulto / bienestar retail con banner fotográfico propio: prioridad máxima. */
    var subImg = bannerDeSubcategoria(catOrSector);
    var sector = esSectorValido(catOrSector) ? catOrSector : sectorDeCategoria(catOrSector);
    if (subImg) {
      if (sector === 'bienestar') {
        return poolBannersConLead(subImg, BIENESTAR_BANNER_POOL, 3);
      }
      return [subImg];
    }
    if (esSubcategoriaLgbt(catOrSector)) return LGBT_BANNERS.slice();
    if (sector === 'adultos') return null;
    if (sector === 'bienestar') {
      return BIENESTAR_BANNER_POOL.slice(0, 3);
    }
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
    normLgbtSlug: normLgbtSlug,
    bannerDeSubcategoria: bannerDeSubcategoria,
    aplicarTemaSector: aplicarTemaSector,
    syncPageSheen: syncPageSheen,
    bannerDeSector: bannerDeSector,
    bannersDeSector: bannersDeSector,
    esSectorValido: esSectorValido
  };
})(typeof window !== 'undefined' ? window : this);
