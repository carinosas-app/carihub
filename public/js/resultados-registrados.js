/**
 * Perfiles reales en resultados — colección usuarios/{uid} (aprobados y activos).
 */
(function (global) {
  'use strict';

  var _cache = [];
  var _loaded = false;
  var _loading = null;
  var _error = null;

  function db() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof firebase.firestore === 'function') return firebase.firestore();
    return null;
  }

  function normTxt(t) {
    return String(t || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function tsToDate(v) {
    if (!v) return null;
    if (typeof v.toDate === 'function') return v.toDate();
    var d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  function estaVencido(data) {
    if (!data) return true;
    if (data.vencido === true) return true;
    var fv = tsToDate(data.fechaVencimiento);
    if (fv && fv <= new Date()) return true;
    return false;
  }

  function modalidadToArray(modalidad) {
    var m = normTxt(modalidad);
    if (!m) return ['recibe', 'hotel'];
    if (m.indexOf('mixto') !== -1) return ['recibe', 'hotel', 'domicilio'];
    if (m.indexOf('domicil') !== -1) return ['domicilio'];
    if (m.indexOf('hotel') !== -1) return ['hotel'];
    if (m.indexOf('lugar') !== -1 || m.indexOf('recib') !== -1 || m.indexOf('con lugar') !== -1) return ['recibe'];
    return ['recibe', 'hotel'];
  }

  function ubicacionTexto(data) {
    var parts = [data.zona, data.ciudad, data.estado].filter(Boolean);
    if (parts.length) return parts.join(', ');
    return data.ciudad || data.estado || data.pais || '';
  }

  function observacionesDe(data, desc) {
    if (data.servicios) {
      return String(data.servicios)
        .split(/[,;|/]+/)
        .map(function (s) { return s.trim(); })
        .filter(Boolean)
        .slice(0, 4);
    }
    if (desc) return [desc.slice(0, 72)];
    return [];
  }

  function ctxHydrateFromFirestore(data) {
    data = data || {};
    return {
      subcategoriaId: data.subcategoriaId || '',
      subcategoria: data.subcategoria || '',
      arquetipo: data.arquetipo || '',
      tipoPerfil: data.tipoPerfil || '',
      categoriaPrincipal: data.categoria || '',
      categoria: data.categoria || '',
      formularioId: data.formularioId || '',
      sectorId: data.sectorId || ''
    };
  }

  /**
   * MP-SUBMIT-HYDRATE — reconstruye perfil público desde camposPublicos.bloquesPublicos.
   * Fallback: devuelve base sin cambios si no hay bloques o mapToPerfil no está cargado.
   */
  function hydratePerfilFromFirestoreDoc(data, base) {
    base = base || {};
    data = data || {};
    var cp = data.camposPublicos;
    var bloques = cp && cp.bloquesPublicos;
    if (!bloques) return base;
    var blocks = global.CariHubRegistroPublicBlocks;
    if (!blocks || typeof blocks.mapToPerfil !== 'function') return base;

    var ctx = ctxHydrateFromFirestore(data);
    var seed = {
      __id: base.__id,
      uid: base.uid,
      __demo: base.__demo,
      __registrado: base.__registrado,
      nombre: base.nombre,
      alias: data.alias || data.nombre || base.nombre,
      edad: base.edad,
      categoria: base.categoria,
      categoriaPublica: base.categoriaPublica,
      pais: base.pais,
      estado: base.estado,
      ciudad: base.ciudad,
      zona: base.zona,
      fotoURL: base.fotoURL,
      subcategoriaId: data.subcategoriaId || '',
      arquetipo: data.arquetipo || '',
      tipoPerfil: data.tipoPerfil || '',
      precio: base.precio,
      tagline: base.tagline,
      descripcion: base.descripcion
    };

    var hydrated = blocks.mapToPerfil(seed, bloques, ctx);
    hydrated.__id = base.__id;
    hydrated.uid = base.uid;
    hydrated.__demo = base.__demo;
    hydrated.__registrado = base.__registrado;
    hydrated.verificada = base.verificada;
    hydrated.verificado = base.verificado;
    hydrated.respuestaRapida = base.respuestaRapida;
    hydrated.nueva = base.nueva;
    hydrated.fechaPublicacion = base.fechaPublicacion;
    hydrated.fotosExtraURL = base.fotosExtraURL;
    hydrated.fotosCount = base.fotosCount;
    hydrated.telefono = base.telefono;
    hydrated.email = base.email;
    hydrated.contactoPublico = base.contactoPublico;
    if (!hydrated.ubicacion) hydrated.ubicacion = base.ubicacion;
    if (!hydrated.observaciones || !hydrated.observaciones.length) {
      hydrated.observaciones = base.observaciones;
    }
    if (!hydrated.categoriaPublica) hydrated.categoriaPublica = base.categoriaPublica;
    if (!hydrated.disponibilidad) hydrated.disponibilidad = base.disponibilidad;
    if (!hydrated.subcategoriaId && data.subcategoriaId) hydrated.subcategoriaId = data.subcategoriaId;
    if (!hydrated.arquetipo && data.arquetipo) hydrated.arquetipo = data.arquetipo;
    if (!hydrated.tipoPerfil && data.tipoPerfil) hydrated.tipoPerfil = data.tipoPerfil;
    hydrated.__hydratedFromBloques = true;
    return hydrated;
  }

  function baseNormalizadoPerfilFirestore(data, id) {
    var extras = Array.isArray(data.fotosExtraURL) ? data.fotosExtraURL.length : 0;
    var foto = data.fotoURL || '';
    var desc = String(data.descripcion || data.descripcionCompleta || '').trim();

    return {
      __id: id,
      uid: data.uid || id,
      __demo: false,
      __registrado: true,
      nombre: data.nombre || 'Sin nombre',
      edad: data.edad != null ? data.edad : null,
      categoria: data.categoria || '',
      categoriaPublica: data.categoria || '',
      pais: data.pais || '',
      estado: data.estado || '',
      ciudad: data.ciudad || '',
      zona: data.zona || '',
      ubicacion: ubicacionTexto(data),
      precio: data.precio || 'Consultar',
      modalidades: modalidadToArray(data.modalidad),
      modalidad: data.modalidad || '',
      tagline: desc.slice(0, 140),
      observaciones: observacionesDe(data, desc),
      descripcion: desc,
      verificada: data.aprobado === true,
      verificado: data.aprobado === true,
      disponibilidad: data.horario ? String(data.horario).slice(0, 48) : 'Consultar disponibilidad',
      respuestaRapida: true,
      nueva: false,
      fotoURL: foto,
      fotosExtraURL: data.fotosExtraURL || [],
      fotosCount: Math.max(foto ? 1 : 0, 1 + extras),
      telefono: data.telefono || '',
      email: data.email || '',
      contactoPublico: data.contactoPublico || null,
      horario: data.horario || '',
      servicios: data.servicios || '',
      fechaPublicacion: data.fechaPublicacion || null
    };
  }

  function normalizarPerfilFirestore(doc) {
    var data = doc.data() || {};
    var id = doc.id;
    var base = baseNormalizadoPerfilFirestore(data, id);
    return hydratePerfilFromFirestoreDoc(data, base);
  }

  function consultarPublicos() {
    var firestore = db();
    if (!firestore) {
      _error = new Error('Firestore no inicializado');
      return Promise.resolve([]);
    }

    return firestore.collection('usuarios')
      .where('aprobado', '==', true)
      .where('activo', '==', true)
      .where('vencido', '==', false)
      .get()
      .then(function (snap) {
        _cache = snap.docs
          .filter(function (doc) { return !estaVencido(doc.data()); })
          .map(normalizarPerfilFirestore);
        _loaded = true;
        _error = null;
        return _cache.slice();
      })
      .catch(function (err) {
        console.error('[CariHubResultadosRegistrados]', err);
        _error = err;
        _loaded = true;
        return _cache.slice();
      });
  }

  function cargar(force) {
    if (_loading && !force) return _loading;
    if (_loaded && !force) return Promise.resolve(_cache.slice());
    _loading = consultarPublicos().finally(function () {
      _loading = null;
    });
    return _loading;
  }

  function listar() {
    return _cache.slice();
  }

  function totalPublicos() {
    return _cache.length;
  }

  function urlPerfil(uid, Q) {
    Q = Q || {};
    if (global.CariHubResultadosDemo && CariHubResultadosDemo.urlPerfilPublico) {
      return CariHubResultadosDemo.urlPerfilPublico({ __id: uid, __registrado: true }, Q);
    }
    var p = new URLSearchParams();
    p.set('id', String(uid));
    if (Q.categoria) p.set('categoria', Q.categoria);
    if (Q.pais) p.set('pais', Q.pais);
    if (Q.estado) p.set('estado', Q.estado);
    if (Q.ciudad) p.set('ciudad', Q.ciudad);
    p.set('from', 'resultados');
    if (Q.resVista) p.set('resVista', Q.resVista);
    return 'perfil-publico.html?' + p.toString();
  }

  function filtrarPerfiles(items, filtros) {
    filtros = filtros || {};
    items = items || [];
    return items.filter(function (p) {
      if (filtros.categoria && filtros.categoria !== 'Todas') {
        if (normTxt(p.categoria) !== normTxt(filtros.categoria)) return false;
      }
      if (filtros.pais) {
        if (normTxt(p.pais) !== normTxt(filtros.pais)) return false;
      }
      if (filtros.estado && filtros.estado !== 'Todos') {
        if (normTxt(p.estado) !== normTxt(filtros.estado)) return false;
      }
      if (filtros.ciudad && filtros.ciudad !== 'Todas') {
        var pc = normTxt(p.ciudad);
        var fc = normTxt(filtros.ciudad);
        if (pc !== fc && pc.indexOf(fc) < 0 && fc.indexOf(pc) < 0) return false;
      }
      return true;
    });
  }

  function paginar(items, page, pageSize) {
    page = Math.max(1, Number(page) || 1);
    pageSize = Math.max(1, Number(pageSize) || 12);
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
      hasNext: page < pages
    };
  }

  /**
   * Busca en caché de perfiles públicos con filtros y paginación (TICKET-024).
   * @returns Promise<{ items, page, pages, total, hasPrev, hasNext, allFiltered }>
   */
  function buscar(filtros, opts) {
    opts = opts || {};
    var page = opts.page || 1;
    var pageSize = opts.pageSize || 12;
    return cargar(opts.force).then(function (all) {
      var filtered = filtrarPerfiles(all, filtros);
      var paged = paginar(filtered, page, pageSize);
      paged.allFiltered = filtered;
      paged.filtros = filtros;
      return paged;
    });
  }

  function toTarjetaDirectorio(perfil, filtros) {
    filtros = filtros || {};
    var uid = perfil.uid || perfil.__id || '';
    return {
      id: uid,
      perfilId: uid,
      nombre: perfil.nombre || 'Sin nombre',
      categoria: perfil.categoria || '',
      pais: perfil.pais || '',
      estado: perfil.estado || '',
      ciudad: perfil.ciudad || '',
      verificado: !!(perfil.verificada || perfil.verificado),
      img: perfil.fotoURL || '',
      ubicacion: perfil.ubicacion || '',
      precio: perfil.precio || '',
      tagline: perfil.tagline || '',
      url: urlPerfil(uid, {
        categoria: filtros.categoria,
        pais: filtros.pais,
        estado: filtros.estado,
        ciudad: filtros.ciudad
      })
    };
  }

  global.CariHubResultadosRegistrados = {
    cargar: cargar,
    listar: listar,
    totalPublicos: totalPublicos,
    normalizar: normalizarPerfilFirestore,
    hydratePerfilFromFirestoreDoc: hydratePerfilFromFirestoreDoc,
    baseNormalizadoPerfilFirestore: baseNormalizadoPerfilFirestore,
    urlPerfil: urlPerfil,
    filtrar: filtrarPerfiles,
    paginar: paginar,
    buscar: buscar,
    toTarjetaDirectorio: toTarjetaDirectorio,
    get error() { return _error; },
    get loaded() { return _loaded; }
  };
})(typeof window !== 'undefined' ? window : this);
