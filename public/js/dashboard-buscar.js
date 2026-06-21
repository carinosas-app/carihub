/**
 * Buscar directorio en dashboard — query real vía CariHubResultadosRegistrados (TICKET-024).
 */
(function (global) {
  "use strict";

  var PAGE_SIZE = 12;

  var MOCK_DIRECTORIO = [
    { id: "mock-club-velvet", nombre: "Club Velvet", categoria: "Antro", pais: "México", estado: "Nuevo León", ciudad: "Monterrey", verificado: true, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=320&q=80", tagline: "Antro nocturno · Mesa VIP", precio: "Consultar", url: "perfil-publico.html?preview=1" },
    { id: "mock-night-mty", nombre: "Night Antro MTY", categoria: "Antro", pais: "México", estado: "Nuevo León", ciudad: "Monterrey", verificado: false, img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=320&q=80", tagline: "Promo fin de semana", precio: "Consultar", url: "perfil-publico.html?preview=1" },
    { id: "mock-andrea", nombre: "Andrea VIP", categoria: "Escort VIP", pais: "México", estado: "Nuevo León", ciudad: "Monterrey", verificado: true, img: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=320&q=80", tagline: "VIP Monterrey", precio: "3,500", url: "perfil-publico.html?preview=1" },
    { id: "mock-luna", nombre: "Luna M.", categoria: "Escort", pais: "México", estado: "Nuevo León", ciudad: "San Pedro", verificado: true, img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=320&q=80", tagline: "San Pedro · Eventos", precio: "2,000", url: "perfil-publico.html?preview=1" },
    { id: "mock-studio", nombre: "Studio Velvet", categoria: "Table Dance", pais: "México", estado: "Nuevo León", ciudad: "San Pedro", verificado: true, img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=320&q=80", tagline: "Table dance premium", precio: "Consultar", url: "perfil-publico.html?preview=1" },
    { id: "mock-spa", nombre: "Spa Aurora", categoria: "Spa", pais: "México", estado: "Jalisco", ciudad: "Guadalajara", verificado: true, img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=320&q=80", tagline: "Wellness · Masajes", precio: "1,200", url: "perfil-publico.html?preview=1" },
    { id: "mock-velvet-cdmx", nombre: "Club Velvet CDMX", categoria: "Antro", pais: "México", estado: "Ciudad de México", ciudad: "CDMX", verificado: false, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=320&q=80", tagline: "Roma Norte", precio: "Consultar", url: "perfil-publico.html?preview=1" },
    { id: "mock-valentina", nombre: "Valentina", categoria: "Escort VIP", pais: "México", estado: "Nuevo León", ciudad: "Monterrey", verificado: true, img: "https://images.unsplash.com/photo-1512310604669-443f26c35f52?w=320&q=80", tagline: "Monterrey centro", precio: "4,000", url: "perfil-publico.html?preview=1" },
  ];

  function isPreviewMode() {
    try {
      return new URLSearchParams(global.location.search).get("preview") === "1";
    } catch (e) {
      return false;
    }
  }

  function hasAuth() {
    try {
      if (global.CariHubAuth && global.CariHubAuth.currentUser) return true;
      if (global.firebase && global.firebase.auth && global.firebase.auth().currentUser) return true;
    } catch (e) { /* ignore */ }
    return false;
  }

  function useMock() {
    return isPreviewMode() && !hasAuth();
  }

  function normTxt(t) {
    return String(t || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function filtrarMock(filtros) {
    filtros = filtros || {};
    return MOCK_DIRECTORIO.filter(function (d) {
      if (filtros.categoria && filtros.categoria !== "Todas") {
        if (normTxt(d.categoria) !== normTxt(filtros.categoria)) return false;
      }
      if (filtros.pais && normTxt(d.pais) !== normTxt(filtros.pais)) return false;
      if (filtros.estado && filtros.estado !== "Todos") {
        if (normTxt(d.estado) !== normTxt(filtros.estado)) return false;
      }
      if (filtros.ciudad && filtros.ciudad !== "Todas") {
        var pc = normTxt(d.ciudad);
        var fc = normTxt(filtros.ciudad);
        if (pc !== fc && pc.indexOf(fc) < 0 && fc.indexOf(pc) < 0) return false;
      }
      return true;
    });
  }

  function paginarMock(items, page, pageSize) {
    page = Math.max(1, Number(page) || 1);
    pageSize = pageSize || PAGE_SIZE;
    var total = items.length;
    var pages = Math.max(1, Math.ceil(total / pageSize));
    if (page > pages) page = pages;
    var start = (page - 1) * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      page: page,
      pageSize: pageSize,
      total: total,
      pages: pages,
      hasPrev: page > 1,
      hasNext: page < pages,
      source: "mock",
    };
  }

  function buscarMock(filtros, opts) {
    opts = opts || {};
    var filtered = filtrarMock(filtros);
    var paged = paginarMock(filtered, opts.page, opts.pageSize || PAGE_SIZE);
    paged.allFiltered = filtered;
    paged.filtros = filtros;
    return Promise.resolve(paged);
  }

  function buscar(filtros, opts) {
    opts = opts || {};
    if (useMock()) return buscarMock(filtros, opts);
    var reg = global.CariHubResultadosRegistrados;
    if (!reg || !reg.buscar) return buscarMock(filtros, opts);
    return reg.buscar(filtros, {
      page: opts.page,
      pageSize: opts.pageSize || PAGE_SIZE,
      force: opts.force,
    }).then(function (res) {
      res = res || { items: [], total: 0, page: 1, pages: 1 };
      res.items = (res.items || []).map(function (p) {
        return reg.toTarjetaDirectorio(p, filtros);
      });
      res.source = "firestore";
      return res;
    }).catch(function (err) {
      console.warn("[DashBuscar] firestore, fallback mock", err);
      return buscarMock(filtros, opts);
    });
  }

  function sugerencias(limit, filtros) {
    limit = limit || 3;
    filtros = filtros || {};
    if (useMock()) {
      return Promise.resolve(filtrarMock(filtros).slice(0, limit));
    }
    var reg = global.CariHubResultadosRegistrados;
    if (!reg) return Promise.resolve(MOCK_DIRECTORIO.slice(0, limit));
    return reg.cargar().then(function (all) {
      return reg.filtrar(all, filtros).slice(0, limit).map(function (p) {
        return reg.toTarjetaDirectorio(p, filtros);
      });
    });
  }

  global.DashBuscar = {
    PAGE_SIZE: PAGE_SIZE,
    buscar: buscar,
    sugerencias: sugerencias,
    MOCK_DIRECTORIO: MOCK_DIRECTORIO,
    useMock: useMock,
  };
})(typeof window !== "undefined" ? window : globalThis);
