/**
 * Motor DEMO canónico — 3 perfiles fijos (ref. mockup desktop resultados)
 */
(function (global) {
  'use strict';

  var FOTOS = [
    'img/resultados-demo/violeta-1.png',
    'img/resultados-demo/violeta-2.png',
    'img/resultados-demo/violeta-3.png',
    'img/resultados-demo/violeta-4.png'
  ];

  var ZONAS = ['San Pedro', 'Centro', 'Valle Oriente', 'Cumbres', 'Mitras', 'Del Valle'];

  var VISTA_POR_CATEGORIA = {
    escort: 'adult',
    'escort gay': 'escortGay',
    'escort vip': 'escortVip',
    edecan: 'adult',
    stripper: 'stripper',
    modelos: 'adult',
    gigolo: 'escortGay',
    acompanante: 'adult',
    petit: 'adult',
    contenido: 'creador',
    tabledance: 'tableDance',
    'sex shop': 'sexShop',
    spa: 'negocio',
    masajes: 'masajeIndep',
    'club sw': 'clubSw',
    'antro restaurant bar': 'antro',
    'antro restaurant bar lgbt': 'antroLgbt',
    'hotel motel': 'negocio',
    'cabinas glory holes': 'cabinas',
    trans: 'trans',
    femboy: 'trans',
    swinger: 'clubSw',
    unicorns: 'unicorn',
    'cuckold hotwife': 'pareja',
    singles: 'pareja',
    hotwife: 'pareja',
    lesbians: 'pareja',
    'tom boy': 'adult',
    'tom fem': 'adult',
    dotados: 'adult',
    fetiche: 'adult',
    sado: 'dominatrix',
    dominatrix: 'dominatrix',
    'cine xxx': 'cineXxx'
  };

  /** Perfiles exactos del mockup desktop (siempre visibles) */
  var PERFILES_CANON = [
    {
      __id: 'demo-violeta',
      __demo: true,
      __vista: 'adult',
      nombre: 'Violeta',
      edad: 24,
      ubicacion: 'San Pedro, Monterrey',
      zona: 'San Pedro',
      ciudad: 'Monterrey',
      precio: '2,000',
      tagline: 'Complaciente y cariñosa, trato de novia.',
      observaciones: ['Complaciente', 'Cariñosa', 'Trato de novia'],
      modalidades: ['recibe', 'hotel', 'domicilio'],
      categoriaPublica: 'Escort VIP',
      verificada: true,
      nueva: true,
      disponibilidad: 'Disponible ahora',
      respuestaRapida: true,
      fotoURL: FOTOS[0],
      fotosCount: 15
    },
    {
      __id: 'demo-mariana',
      __demo: true,
      __vista: 'adult',
      nombre: 'Mariana',
      edad: 23,
      ubicacion: 'Monterrey Centro',
      zona: 'Monterrey Centro',
      ciudad: 'Monterrey',
      precio: '1,800',
      tagline: 'Acompañante elegante, discreta y muy atenta.',
      observaciones: ['Acompañante', 'Elegante', 'Discreta', 'Atenta'],
      modalidades: ['recibe', 'hotel'],
      categoriaPublica: 'Acompañante',
      verificada: true,
      nueva: false,
      disponibilidad: 'Disponible ahora',
      respuestaRapida: true,
      fotoURL: FOTOS[1],
      fotosCount: 12
    },
    {
      __id: 'demo-sofia',
      __demo: true,
      __vista: 'adult',
      nombre: 'Sofía',
      edad: 22,
      ubicacion: 'Apodaca, Nuevo León',
      zona: 'Apodaca',
      ciudad: 'Apodaca',
      estado: 'Nuevo León',
      precio: '1,500',
      tagline: 'Linda, divertida y muy complaciente.',
      observaciones: ['Linda', 'Divertida', 'Complaciente'],
      modalidades: ['recibe', 'hotel', 'domicilio'],
      categoriaPublica: 'Escort',
      verificada: true,
      nueva: false,
      disponibilidad: 'Ocupada',
      respuestaRapida: true,
      fotoURL: FOTOS[2],
      fotosCount: 18
    }
  ];

  /** Cuarto perfil demo — vista ?vista=con-resultados-4 */
  var PERFIL_CANON_CUARTO = {
    __id: 'demo-valentina',
    __demo: true,
    __vista: 'adult',
    nombre: 'Valentina',
    edad: 30,
    ubicacion: 'Valle Oriente, Monterrey',
    zona: 'Valle Oriente',
    ciudad: 'Monterrey',
    precio: '2,000',
    tagline: 'Elegante, discreta y siempre puntual.',
    observaciones: ['Elegante', 'Discreta', 'Puntual'],
    modalidades: ['recibe', 'hotel', 'domicilio'],
    categoriaPublica: 'Escort VIP',
    verificada: true,
    nueva: false,
    disponibilidad: 'Ocupada',
    respuestaRapida: true,
    fotoURL: FOTOS[3],
    fotosCount: 14
  };

  /** Quinto perfil demo — vista ?vista=con-resultados-4 (peek 4,5 tarjetas) */
  var PERFIL_CANON_QUINTO = {
    __id: 'demo-camila',
    __demo: true,
    __vista: 'adult',
    nombre: 'Camila',
    edad: 26,
    ubicacion: 'Cumbres, Monterrey',
    zona: 'Cumbres',
    ciudad: 'Monterrey',
    precio: '1,800',
    tagline: 'Trato de novia y conversación agradable.',
    observaciones: ['Trato de novia', 'Conversación', 'Agradable'],
    modalidades: ['hotel', 'domicilio'],
    categoriaPublica: 'Escort',
    verificada: false,
    nueva: true,
    disponibilidad: 'Disponible ahora',
    respuestaRapida: true,
    fotoURL: FOTOS[1],
    fotosCount: 10
  };

  var PLANTILLAS = {
    escort: {
      personas: [
        { nombre: 'Mariana', edad: 23, precio: '1,800', tagline: 'Acompañante elegante, discreta y muy atenta.', modalidades: ['recibe', 'hotel'], nueva: false, verificada: true },
        { nombre: 'Violeta', edad: 24, precio: '2,000', tagline: 'Complaciente y cariñosa, trato de novia.', modalidades: ['recibe', 'hotel', 'domicilio'], nueva: true },
        { nombre: 'Valentina', edad: 30, precio: '2,000', tagline: 'Elegante, discreta y siempre puntual.', modalidades: ['recibe', 'hotel', 'domicilio'], disponibilidad: 'Ocupada' },
        { nombre: 'Camila', edad: 26, precio: '1,800', tagline: 'Trato de novia y conversación agradable.', modalidades: ['hotel', 'domicilio'] },
        { nombre: 'Isabella', edad: 28, precio: '2,500', tagline: 'Experiencia premium con total discreción.', modalidades: ['recibe', 'hotel'], verificada: true }
      ]
    },
    dominatrix: {
      personas: [
        { nombre: 'Mistress Alexa', edad: 29, precio: '2,500', tagline: 'Femdom elegante, protocolo claro y límites respetados.', modalidades: ['recibe', 'hotel'] },
        { nombre: 'Lady Raven', edad: 31, precio: '3,000', tagline: 'Dungeon privado y sesiones BDSM profesionales.', modalidades: ['recibe'] }
      ]
    },
    masajes: {
      negocios: [
        { nombreComercial: 'Zen Touch Masajes', precio: '650', tagline: 'Masajes relajantes, terapéuticos y en pareja. Ambiente discreto.', tipoPerfil: 'negocio', categoriaPublica: 'Centro de Masajes' }
      ],
      personas: [
        { nombre: 'Sofía M.', edad: 27, precio: '900', tagline: 'Masajes relajantes y sensoriales a domicilio o espacio privado.', modalidades: ['domicilio', 'recibe'] },
        { nombre: 'Luna R.', edad: 25, precio: '850', tagline: 'Terapia sueca, aromaterapia y sesiones en pareja.', modalidades: ['recibe', 'domicilio'] }
      ]
    }
  };

  var FALLBACK_PERSONAS = [
    { nombre: 'Perfil demo', edad: 25, precio: '1,500', tagline: 'Anuncio de demostración para esta categoría.', modalidades: ['recibe', 'hotel'] },
    { nombre: 'Anuncio local', edad: 27, precio: '1,800', tagline: 'Disponible en tu zona con reservación previa.', modalidades: ['domicilio'] }
  ];

  function norm(t) {
    if (global.CHUI && CHUI.chNorm) return CHUI.chNorm(t);
    return String(t || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function idCategoria(valor) {
    if (global.CariHubCatalogos) return CariHubCatalogos.idCategoria(valor);
    return norm(valor);
  }

  function labelCategoria(valor) {
    if (global.CariHubCatalogos) return CariHubCatalogos.labelCategoria(valor);
    return String(valor || '').trim() || 'Escort';
  }

  function vistaDeCategoria(valor) {
    var id = idCategoria(valor);
    return VISTA_POR_CATEGORIA[id] || 'adult';
  }

  function slug(s) {
    return norm(s).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'perfil';
  }

  function foto(i) {
    return FOTOS[i % FOTOS.length];
  }

  function zonaNombre(i) {
    return ZONAS[i % ZONAS.length];
  }

  function clonarPerfil(base, Q) {
    var u = {};
    var k;
    for (k in base) {
      if (Object.prototype.hasOwnProperty.call(base, k)) u[k] = base[k];
    }
    u.categoria = base.categoria || Q.categoria || 'Escort';
    u.categoriaPublica = base.categoriaPublica || u.categoria;
    u.pais = Q.pais || 'México';
    u.estado = u.estado || Q.estado || 'Nuevo León';
    u.ciudad = u.ciudad || Q.ciudad || 'Monterrey';
    if (u.fotosCount) {
      u.fotosExtraURL = new Array(Math.max(0, u.fotosCount - 1)).fill('demo');
    }
    return u;
  }

  function perfilesCanonicos(Q) {
    Q = Q || {};
    return PERFILES_CANON.map(function (p) { return clonarPerfil(p, Q); });
  }

  function perfilesCanonicosCuatro(Q) {
    Q = Q || {};
    return PERFILES_CANON.concat([PERFIL_CANON_CUARTO]).map(function (p) {
      return clonarPerfil(p, Q);
    });
  }

  function perfilesCanonicosCinco(Q) {
    Q = Q || {};
    return PERFILES_CANON.concat([PERFIL_CANON_CUARTO, PERFIL_CANON_QUINTO]).map(function (p) {
      return clonarPerfil(p, Q);
    });
  }

  function armarPerfil(base, idx, Q, catLabel, catId, vistaDef) {
    var esNeg = !!(base.tipoPerfil === 'negocio' || base.tipoPerfil === 'lugar' || base.nombreComercial);
    var nombre = esNeg ? base.nombreComercial : base.nombre;
    var vista = base.vista || vistaDef;
    var id = 'demo-' + catId + '-' + slug(nombre) + '-' + idx;

    var u = {
      __id: id,
      __demo: true,
      __vista: vista,
      categoria: base.categoria || catLabel,
      categoriaPublica: base.categoriaPublica || catLabel,
      pais: Q.pais,
      estado: Q.estado,
      ciudad: Q.ciudad,
      zona: zonaNombre(idx),
      precio: base.precio || 'Consultar',
      tagline: base.tagline || '',
      verificada: base.verificada !== false,
      verificado: base.verificada !== false,
      disponibilidad: base.disponibilidad || 'Disponible ahora',
      respuestaRapida: base.respuestaRapida !== false,
      nueva: !!base.nueva,
      fotoURL: foto(idx),
      fotosExtraURL: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n']
    };

    if (esNeg) {
      u.tipoPerfil = base.tipoPerfil || 'negocio';
      u.tipoCuenta = 'negocio';
      u.nombreComercial = nombre;
      u.nombre = nombre;
      if (base.tipoNegocio) u.tipoNegocio = base.tipoNegocio;
    } else {
      u.nombre = nombre;
      u.alias = nombre;
      if (base.edad != null) u.edad = base.edad;
      u.modalidades = base.modalidades || ['recibe', 'hotel'];
    }

    return u;
  }

  function plantillaDe(catId) {
    if (PLANTILLAS[catId]) return PLANTILLAS[catId];
    var clave = Object.keys(PLANTILLAS).find(function (k) {
      return catId.indexOf(k) !== -1 || k.indexOf(catId) !== -1;
    });
    if (clave) return PLANTILLAS[clave];
    return { personas: FALLBACK_PERSONAS };
  }

  function generarPerfiles(Q) {
    return componerListaResultados(Q).perfiles;
  }

  function perfilesFallback(Q) {
    return [];
  }

  function campoCoincide(valorPerfil, valorBusqueda, opts) {
    opts = opts || {};
    var b = norm(valorBusqueda);
    if (!b) return true;
    var p = norm(valorPerfil);
    if (!p) return !!opts.opcional;
    if (p === b) return true;
    if (opts.parcial) return p.indexOf(b) !== -1 || b.indexOf(p) !== -1;
    return false;
  }

  function coincideBusqueda(u, Q) {
    if (!u || !Q) return false;
    var catId = idCategoria(u.categoria || u.categoriaPublica);
    var qId = idCategoria(Q.categoria);
    if (catId !== qId && !campoCoincide(u.categoria || u.categoriaPublica, Q.categoria, { parcial: true })) return false;
    return campoCoincide(u.pais, Q.pais, { opcional: !Q.pais }) &&
      campoCoincide(u.estado, Q.estado, { parcial: true, opcional: !Q.estado }) &&
      campoCoincide([u.ciudad, u.zona].filter(Boolean).join(' '), Q.ciudad, { parcial: true, opcional: !Q.ciudad });
  }

  function coincideDemo(u, Q) {
    if (!u || !u.__demo) return false;
    return coincideBusqueda(u, Q);
  }

  /** Perfiles reales guardados en el sitio (Firebase u otro motor). Vacío en demo. */
  function perfilesRegistrados(Q) {
    Q = Q || {};
    if (global.CariHubResultadosRegistrados && typeof CariHubResultadosRegistrados.listar === 'function') {
      var todos = CariHubResultadosRegistrados.listar(Q) || [];
      return todos.filter(function (u) {
        return u && !u.__demo && coincideBusqueda(u, Q);
      });
    }
    return [];
  }

  /** Vista previa en IDE: ?vista=con-resultados | con-resultados-4 | sin-resultados */
  function vistaPreviaModo() {
    try {
      var p = new URL(global.location.href).searchParams.get('vista');
      if (p === 'con-resultados' || p === 'con') return 'con-resultados';
      if (p === 'con-resultados-4' || p === 'con-4' || p === 'cuatro') return 'con-resultados-4';
      if (p === 'sin-resultados' || p === 'sin' || p === 'vacio') return 'sin-resultados';
    } catch (e) { /* opcional */ }
    return null;
  }

  /** Lista final: reales en producción; canónicos demo solo con ?vista=con-resultados* */
  function componerListaResultados(Q) {
    Q = Q || {};
    var modo = vistaPreviaModo();
    if (modo === 'con-resultados-4') {
      return {
        perfiles: perfilesCanonicosCinco(Q).slice(),
        meta: {
          vacio: false,
          totalRegistrados: 0,
          preview: true,
          modoVista: 'con-resultados-4'
        }
      };
    }
    if (modo === 'con-resultados') {
      return {
        perfiles: perfilesCanonicosCinco(Q).slice(),
        meta: {
          vacio: false,
          totalRegistrados: 0,
          preview: true,
          modoVista: 'con-resultados'
        }
      };
    }
    if (modo === 'sin-resultados') {
      return {
        perfiles: [],
        meta: {
          vacio: true,
          totalRegistrados: 0,
          preview: true,
          modoVista: 'sin-resultados'
        }
      };
    }
    var registrados = perfilesRegistrados(Q);
    var totalEnSitio = (global.CariHubResultadosRegistrados && typeof CariHubResultadosRegistrados.totalPublicos === 'function')
      ? CariHubResultadosRegistrados.totalPublicos()
      : registrados.length;
    return {
      perfiles: registrados.slice(),
      meta: {
        vacio: registrados.length === 0,
        totalRegistrados: totalEnSitio,
        modoVista: vistaPreviaModo() || 'produccion'
      }
    };
  }

  function queryFromLocation(href) {
    try {
      var p = new URL(href || global.location.href).searchParams;
      return {
        categoria: p.get('categoria') || 'Escort',
        pais: p.get('pais') || 'México',
        estado: p.get('estado') || '',
        ciudad: p.get('ciudad') || ''
      };
    } catch (e) {
      return { categoria: 'Escort', pais: 'México', estado: '', ciudad: '' };
    }
  }

  /** Solo lo que viene en la URL (sin defaults) — para la línea bajo el nombre del perfil */
  function queryExplicitFromLocation(href) {
    try {
      var p = new URL(href || global.location.href).searchParams;
      return {
        categoria: p.get('categoria') || '',
        pais: p.get('pais') || '',
        estado: p.get('estado') || '',
        ciudad: p.get('ciudad') || ''
      };
    } catch (e) {
      return { categoria: '', pais: '', estado: '', ciudad: '' };
    }
  }

  function nivelBusqueda(Q) {
    Q = Q || {};
    if (Q.ciudad) return 'ciudad';
    if (Q.estado) return 'estado';
    if (Q.pais) return 'pais';
    return 'categoria';
  }

  var TITULO_SIN_RESULTADOS = 'No se encontraron resultados para lo que buscaste';
  var SUB_SIN_RESULTADOS = 'Prueba ampliar tu búsqueda, cambiar categoría o explorar otra zona.';

  function tituloVacio() {
    return TITULO_SIN_RESULTADOS;
  }

  function bannerLateralHTML(lado) {
    if (global.CariHubBannerSinResultados && CariHubBannerSinResultados.renderLateralHTML) {
      return CariHubBannerSinResultados.renderLateralHTML(lado);
    }
    var slot = lado === 'izq' ? 'sin_resultados_estados' : 'sin_resultados_libe';
    var label = lado === 'izq' ? 'Estados y zonas' : 'LIBE';
    var img = lado === 'izq'
      ? 'img/home/banners/ad-banner-pink-02.png'
      : 'img/home/banners/ad-banner-black-02.png';
    return '' +
      '<a class="res-vacio-side__banner" href="registro-banner.html?slot=' + slot + '" aria-label="Anuncio ' + label + '">' +
        '<span class="res-vacio-side__label">' + safeTxt(label) + '</span>' +
        '<img src="' + img + '" alt="Espacio publicitario ' + label + '" width="160" height="320" decoding="async">' +
      '</a>';
  }

  function vacioResultadosHTML(Q) {
    Q = Q || {};
    return '' +
      '<div class="res-vacio res-vacio--inline" role="status" aria-live="polite">' +
        '<span class="res-vacio__sparkles" aria-hidden="true"></span>' +
        '<div class="res-vacio__inner">' +
          '<div class="res-vacio__brand">Cariñosas</div>' +
          '<p class="res-vacio__tag">Encuentra tu compañía ideal</p>' +
          '<h2 class="res-vacio__title">' + safeTxt(tituloVacio()) + '</h2>' +
          '<p class="res-vacio__sub">' + safeTxt(SUB_SIN_RESULTADOS) + '</p>' +
        '</div>' +
      '</div>';
  }

  function urlPerfil(u, Q) {
    if (u && (u.__registrado || u.__demo === false) && u.__id) {
      if (global.CariHubResultadosRegistrados && CariHubResultadosRegistrados.urlPerfil) {
        return CariHubResultadosRegistrados.urlPerfil(u.__id);
      }
      return 'perfil.html?id=' + encodeURIComponent(String(u.__id));
    }
    return urlPerfilDemo(u, Q);
  }

  function urlPerfilDemo(u, Q) {
    Q = Q || {};
    var vista = (u && u.__vista) || vistaDeCategoria(Q.categoria || u.categoria);
    var p = new URLSearchParams();
    p.set('vista', vista);
    if (Q.categoria || u.categoria) p.set('categoria', Q.categoria || u.categoria);
    if (Q.pais) p.set('pais', Q.pais);
    if (Q.estado) p.set('estado', Q.estado);
    if (Q.ciudad) p.set('ciudad', Q.ciudad);
    p.set('from', 'resultados');
    return './preview/perfil-vista-previa.html?' + p.toString();
  }

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
      camera: '<path d="M4 8.5h3l1.6-2.2h6.8L17 8.5h3a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7a2 2 0 012-2z"/><circle cx="12" cy="13" r="3.2"/>'
    };
    return '<span class="' + cls + '" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (p[name] || '') + '</svg></span>';
  }

  function verificadoBadgeHTML() {
    return '<span class="verok"><span class="verok__ic" aria-hidden="true">' +
      '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="10" cy="10" r="8.25"/><path d="M6.4 10.1 8.7 12.4 13.7 7.6"/>' +
      '</svg></span><span class="verok__txt">Verificada</span></span>';
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

  function ubicacionCorta(u) {
    if (u.ubicacion) return String(u.ubicacion).trim();
    var z = String(u.zona || '').trim();
    var c = String(u.ciudad || '').trim();
    if (z && c && z !== c) return z + ', ' + c;
    return z || c || '';
  }

  function verificadoIconHTML() {
    return '<span class="res-card__vcheck" aria-label="Verificada">' +
      '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="10" cy="10" r="8.25"/><path d="M6.4 10.1 8.7 12.4 13.7 7.6"/>' +
      '</svg></span>';
  }

  function esPerfilVip(u, catLabel) {
    if (u.vip === true || u.esVip === true) return true;
    return /vip/i.test(String(catLabel || ''));
  }

  function badgesCompactHTML(u, opts) {
    opts = opts || {};
    var items = [];
    if (opts.vip) {
      items.push('<span class="res-badge res-badge--vip">👑 VIP</span>');
    }
    if (opts.respRapida) {
      items.push('<span class="res-badge res-badge--fast">⚡ Respuesta rápida</span>');
    } else if (u.nueva) {
      items.push('<span class="res-badge res-badge--new">★ Nueva</span>');
    }
    if (!items.length) return '';
    return items.join('');
  }

  function chipModalidadHTML(set) {
    var items = [];
    if (set.recibe) items.push('<span class="modchip mc-pink">' + svgIco('home') + 'Recibe</span>');
    if (set.hotel) items.push('<span class="modchip mc-purple">' + svgIco('hotel') + 'Hotel</span>');
    if (set.domicilio) items.push('<span class="modchip mc-orange">' + svgIco('car') + 'Domicilio</span>');
    return items.join('');
  }

  function precioTexto(u) {
    var p = u.precio;
    if (p == null || String(p).trim() === '') return 'Consultar';
    var s = String(p).trim();
    return /^\$|mxn|usd|consult/i.test(s) ? s : '$' + s;
  }

  function numFotos(u) {
    if (u.fotosCount != null) return u.fotosCount;
    return u.fotoURL ? 1 : 0;
  }

  function disponibilidadDe(u) {
    var d = normTxt(u.disponibilidad || u.estatus || '');
    if (d.indexOf('ocup') !== -1) return { clase: 'busy', txt: 'Ocupada', busy: true };
    if (d.indexOf('dispon') !== -1) return { clase: 'on', txt: 'Disponible', busy: false };
    return { clase: 'on', txt: 'Disponible', busy: false };
  }

  function esSegmentoBusquedaExplicito(val, vacios) {
    var s = String(val || '').trim();
    if (!s || s === '—') return false;
    vacios = vacios || [];
    return vacios.indexOf(s) === -1;
  }

  /** Línea SEO: solo parámetros presentes en la URL (sin defaults de Q) */
  function segmentosBusquedaSeo() {
    var explicit = queryExplicitFromLocation();
    var parts = [];
    if (explicit.categoria) {
      var cat = labelCategoria(explicit.categoria);
      if (cat) parts.push(cat);
    }
    if (esSegmentoBusquedaExplicito(explicit.pais)) parts.push(explicit.pais.trim());
    if (esSegmentoBusquedaExplicito(explicit.estado, ['Todos los estados'])) parts.push(explicit.estado.trim());
    if (esSegmentoBusquedaExplicito(explicit.ciudad, ['Todas las ciudades'])) parts.push(explicit.ciudad.trim());
    return parts;
  }

  function textoSeoResultados(Q) {
    return segmentosBusquedaSeo(Q).join(' · ');
  }

  /** Debajo del nombre del perfil — mismos segmentos que la cabecera SEO */

  function lineaUbicacionPerfil(u, Q) {
    return segmentosBusquedaSeo(Q).join(' · ');
  }

  function observacionesLista(u) {
    if (Array.isArray(u.observaciones) && u.observaciones.length) {
      return u.observaciones.map(function (t) { return String(t || '').trim(); }).filter(Boolean);
    }
    if (u.observaciones) {
      return String(u.observaciones).split(/[,·|]/).map(function (t) { return t.trim(); }).filter(Boolean);
    }
    if (u.tagline) {
      return String(u.tagline).split(/[,.]/).map(function (t) { return t.trim(); }).filter(Boolean).slice(0, 4);
    }
    return [];
  }

  function observacionesHTML(u) {
    var items = observacionesLista(u);
    if (!items.length) return '';
    return '<div class="res-obs">' +
      '<span class="res-obs__label">Observaciones</span>' +
      '<p class="res-obs__txt">' +
      items.map(function (t, i) {
        return (i ? '<span class="res-obs__sep" aria-hidden="true"> · </span>' : '') + safeTxt(t);
      }).join('') +
      '</p></div>';
  }

  function descripcionHTML(u) {
    var txt = u.descripcion || u.tagline || '';
    if (!txt) return '';
    return '<div class="res-desc">' +
      '<span class="res-desc__label">Descripción</span>' +
      '<p class="res-desc__txt">' + svgIco('heart') + '<span>' + safeTxt(txt) + '</span></p>' +
      '</div>';
  }

  function observacionesCompactHTML(u) {
    var items = observacionesLista(u);
    if (!items.length) return '';
    return '<div class="res-card__obs">' +
      '<span class="res-card__obs-label">Observaciones</span>' +
      '<span class="res-card__obs-txt">' +
      items.map(function (t) { return safeTxt(t); }).join(' · ') +
      '</span></div>';
  }

  function descripcionCompactHTML(u) {
    var txt = String(u.descripcion || u.tagline || u.descripcionPublica || '').trim();
    if (!txt) return '';
    return '<p class="res-card__desc">' +
      '<span class="res-card__desc-label">Descripción</span>' +
      '<span class="res-card__desc-txt">' + safeTxt(txt) + '</span>' +
      '</p>';
  }

  function cardHTML(u, Q) {
    Q = Q || {};
    var nombre = u.nombre || u.alias || 'Perfil';
    var edad = u.edad != null ? String(u.edad).trim() + ' años' : '';
    var loc = ubicacionCorta(u);
    var catLabel = labelCategoria(u.categoriaPublica || u.categoria || Q.categoria || '');
    var set = modalidadesSet(u);
    var fotos = numFotos(u);
    var disp = disponibilidadDe(u);
    var verificada = u.verificada === true || u.verificado === true;
    var respRapida = u.respuestaRapida !== false;
    var perfilId = u.__id || '';
    var favBtn = (u.__registrado && perfilId)
      ? '<button type="button" class="res-fav" data-fav-perfil="' + safeTxt(perfilId) + '" aria-label="Guardar en favoritos" aria-pressed="false" onclick="toggleFav(this, event)">♡</button>'
      : '';
    var mods = chipModalidadHTML(set);
    var vip = esPerfilVip(u, catLabel);
    var badges = badgesCompactHTML(u, { vip: vip, respRapida: respRapida });
    var descBlock = descripcionCompactHTML(u);
    var obsBlock = observacionesCompactHTML(u);
    var priceBlock =
      '<div class="res-card__price">' +
        '<span class="res-card__price-ic" aria-hidden="true">' + svgIco('money', 'res-card__price-ic') + '</span>' +
        '<span class="res-card__price-desde">Desde</span>' +
        '<span class="res-card__price-val">' + safeTxt(precioTexto(u)) + '</span>' +
      '</div>';

    var metaRow = '';
    var footer = '';
    if (loc || mods) {
      metaRow = '<div class="res-card__row res-card__row--meta">' +
        (loc ? '<div class="res-card__loc">' + svgIco('pin', 'res-card__loc-ic') + '<span>' + safeTxt(loc) + '</span></div>' : '<span class="res-card__loc-spacer" aria-hidden="true"></span>') +
        (mods ? '<div class="modchips res-card__mods">' + mods + '</div>' : '') +
      '</div>';
    }

    if (catLabel || badges) {
      footer = '<div class="res-card__row res-card__row--foot">' +
        (catLabel ? '<div class="res-card__cat">' + svgIco('heart', 'res-card__cat-ic') + '<span>' + safeTxt(catLabel) + '</span></div>' : '<span class="res-card__cat-spacer" aria-hidden="true"></span>') +
        (badges ? '<div class="res-card__badges">' + badges + '</div>' : '') +
        '</div>';
    }

    return '' +
      '<article class="pcard res-card res-card--compact">' +
        '<div class="res-card__media">' +
          (u.nueva ? '<span class="res-nueva">NUEVA</span>' : '') +
          '<img src="' + safeTxt(u.fotoURL) + '" alt="Foto de ' + safeTxt(nombre) + '" width="360" height="210" loading="lazy" decoding="async">' +
          (fotos > 0 ? '<span class="gal__count">' + svgIco('camera', 'res-fotos-ic') + fotos + '</span>' : '') +
        '</div>' +
        '<div class="res-card__body">' +
          '<div class="res-card__main">' +
            '<div class="res-card__row res-card__row--head">' +
              '<div class="res-card__head">' +
                '<h2 class="res-card__name">' + safeTxt(nombre) + '</h2>' +
                (verificada ? verificadoIconHTML() : '') +
                (edad ? '<span class="age">' + safeTxt(edad) + '</span>' : '') +
              '</div>' +
              favBtn +
              '<span class="res-card__avail res-card__avail--' + disp.clase + '">' +
                '<span class="res-dot res-dot--' + disp.clase + '" aria-hidden="true"></span>' +
                safeTxt(disp.txt) +
              '</span>' +
              priceBlock +
            '</div>' +
            descBlock +
            obsBlock +
            metaRow +
            footer +
          '</div>' +
          '<button class="res-card__ver-btn" type="button" aria-label="Ver perfil de ' + safeTxt(nombre) + '" onclick="abrirPerfil(\'' + safeTxt(perfilId) + '\')">' +
            '<span class="res-card__ver-btn-txt">Ver perfil ›</span>' +
          '</button>' +
        '</div>' +
      '</article>';
  }

  function pasaFiltro(u, filtro) {
    if (filtro === 'todos' || filtro === 'cerca') return true;
    var set = modalidadesSet(u);
    if (filtro === 'nuevas') return u.nueva === true;
    if (filtro === 'verificadas') return u.verificada === true || u.verificado === true;
    if (filtro === 'lugar') return !!set.recibe;
    if (filtro === 'hotel') return !!set.hotel;
    if (filtro === 'domicilio') return !!set.domicilio;
    return true;
  }

  function renderProfiles(listEl, perfiles, opts) {
    if (!listEl || !Array.isArray(perfiles)) return;
    opts = opts || {};
    var filtro = opts.filtro || 'todos';
    var Q = opts.Q || {};
    var porPagina = opts.porPagina;
    var filtrados = perfiles.filter(function (u) { return pasaFiltro(u, filtro); });
    if (!filtrados.length && perfiles.length) filtrados = perfiles;
    var visibles = (porPagina != null && porPagina > 0) ? filtrados.slice(0, porPagina) : filtrados;

    if (!visibles.length) {
      listEl.innerHTML = vacioResultadosHTML(Q);
      listEl.classList.add('res-lista--vacio');
      return;
    }

    listEl.classList.remove('res-lista--vacio');
    listEl.innerHTML = visibles.map(function (u) { return cardHTML(u, Q); }).join('');
  }

  global.CariHubResultadosDemo = {
    PERFILES_CANON: PERFILES_CANON,
    perfilesFallback: perfilesFallback,
    perfilesCanonicos: perfilesCanonicos,
    perfilesRegistrados: perfilesRegistrados,
    vistaPreviaModo: vistaPreviaModo,
    componerListaResultados: componerListaResultados,
    vacioResultadosHTML: vacioResultadosHTML,
    generarPerfiles: generarPerfiles,
    renderProfiles: renderProfiles,
    cardHTML: cardHTML,
    queryFromLocation: queryFromLocation,
    queryExplicitFromLocation: queryExplicitFromLocation,
    vistaDeCategoria: vistaDeCategoria,
    labelCategoria: labelCategoria,
    idCategoria: idCategoria,
    nivelBusqueda: nivelBusqueda,
    textoSeoResultados: textoSeoResultados,
    segmentosBusquedaSeo: segmentosBusquedaSeo,
    lineaUbicacionPerfil: lineaUbicacionPerfil,
    coincideBusqueda: coincideBusqueda,
    coincideDemo: coincideDemo,
    urlPerfil: urlPerfil,
    urlPerfilDemo: urlPerfilDemo
  };
})(typeof window !== 'undefined' ? window : globalThis);
