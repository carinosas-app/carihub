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

  /** Copia nested *Perfil persistidos en el doc (sin inventar campos). */
  function copiarNestedPerfilDesdeDoc(data, target) {
    if (!data || !target) return target;
    Object.keys(data).forEach(function (key) {
      if (!/Perfil$/i.test(key)) return;
      var val = data[key];
      if (!val || typeof val !== 'object' || Array.isArray(val)) return;
      target[key] = Object.assign({}, val);
    });
    return target;
  }

  function copiarColaboracionDesdeDoc(data, target) {
    var cp = data.camposPublicos || {};
    if (cp.colaboracionContenido) target.colaboracionContenido = cp.colaboracionContenido;
    if (cp.mostrarColaboracionContenidoPublico) {
      target.mostrarColaboracionContenidoPublico = cp.mostrarColaboracionContenidoPublico;
    }
    if (data.colaboracionContenido) target.colaboracionContenido = data.colaboracionContenido;
    if (data.mostrarColaboracionContenidoPublico) {
      target.mostrarColaboracionContenidoPublico = data.mostrarColaboracionContenidoPublico;
    }
    return target;
  }

  function resolverPresentacionDesdeDoc(data) {
    data = data || {};
    var fe = global.CariHubFieldEngineLite;
    if (!fe || !fe.resolvePublicPresentation) return null;
    return fe.resolvePublicPresentation({
      subcategoriaId: data.subcategoriaId,
      subcategoria: data.subcategoria,
      categoria: data.categoria || data.categoriaPublica
    });
  }

  /**
   * RES-P0-01 — metadata + nested *Perfil para docs sin bloquesPublicos.
   * Punto único: Resultados (listar) y Perfil (normalizar vía perfil-publico-init).
   */
  function enriquecerMetadataFirestore(data, base) {
    base = base || {};
    data = data || {};
    var u = {};
    var k;
    for (k in base) {
      if (Object.prototype.hasOwnProperty.call(base, k)) u[k] = base[k];
    }

    if (data.subcategoriaId) u.subcategoriaId = data.subcategoriaId;
    if (data.subcategoria) u.subcategoria = data.subcategoria;
    if (data.arquetipo) u.arquetipo = data.arquetipo;
    if (data.tipoPerfil) u.tipoPerfil = data.tipoPerfil;
    if (data.sectorId) u.sectorId = data.sectorId;
    if (data.formularioId) u.formularioId = data.formularioId;
    if (data.alias) u.alias = data.alias;
    if (data.categoria) {
      u.categoria = data.categoria;
      if (!u.categoriaPublica) u.categoriaPublica = data.categoria;
    }
    if (data.categoriaPublica) u.categoriaPublica = data.categoriaPublica;

    copiarNestedPerfilDesdeDoc(data, u);
    copiarColaboracionDesdeDoc(data, u);

    var pres = resolverPresentacionDesdeDoc(data);
    if (pres) {
      if (!u.subcategoriaId && pres.subcategoriaId) u.subcategoriaId = pres.subcategoriaId;
      if (!u.subcategoria && pres.subcategoria) u.subcategoria = pres.subcategoria;
      if (!u.arquetipo && pres.arquetipo) u.arquetipo = pres.arquetipo;
      if (!u.tipoPerfil && pres.tipoPerfil) u.tipoPerfil = pres.tipoPerfil;
      if (!u.sectorId && pres.sectorId) u.sectorId = pres.sectorId;
      if (!u.formularioId && pres.formularioId) u.formularioId = pres.formularioId;
      if (!u.categoriaPublica && pres.subcategoria) u.categoriaPublica = pres.subcategoria;
      u.__componenteResultados = pres.componenteResultados;
      u.__componentePerfil = pres.componentePerfil;
      u.__vista = pres.vistaPerfil;
    }

    var fe = global.CariHubFieldEngineLite;
    if (fe && fe.enriquecerPerfilPublico) {
      fe.enriquecerPerfilPublico(u, {
        subcategoriaId: u.subcategoriaId,
        categoria: u.categoria || u.categoriaPublica
      });
    }

    aplicarComponenteSectorSiConocido(u);

    return u;
  }

  /** Si el doc trae sectorId/nested conocido, alinear componente con registry (sin pipeline paralelo). */
  function aplicarComponenteSectorSiConocido(u) {
    if (!u || !u.sectorId) return u;
    var reg = global.CariHubSectorContractRegistry;
    if (!reg || !reg.resolveContract) return u;
    var contract = reg.resolveContract(u.sectorId);
    if (!contract || !contract.componenteResultados) return u;
    var nestedKey = contract.nestedProfileKey;
    if (nestedKey && u[nestedKey]) {
      u.__componenteResultados = contract.componenteResultados;
    } else if (u.sectorId !== 'adultos') {
      u.__componenteResultados = contract.componenteResultados;
    }
    return u;
  }

  function mergeHydrateBase(hydrated, base, data) {
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
    if (!hydrated.sectorId && data.sectorId) hydrated.sectorId = data.sectorId;
    return hydrated;
  }

  /**
   * MP-SUBMIT-HYDRATE — reconstruye perfil público desde camposPublicos.bloquesPublicos.
   * Sin bloques: enriquecerMetadataFirestore (legacy + nested *Perfil en doc).
   */
  function hydratePerfilFromFirestoreDoc(data, base) {
    base = base || {};
    data = data || {};
    var enriched = enriquecerMetadataFirestore(data, base);
    var cp = data.camposPublicos;
    var bloques = cp && cp.bloquesPublicos;
    if (!bloques) return applyPublicPrivacyGuard(enriched, data);
    var blocks = global.CariHubRegistroPublicBlocks;
    if (!blocks || typeof blocks.mapToPerfil !== 'function') {
      return applyPublicPrivacyGuard(enriched, data);
    }

    var ctx = ctxHydrateFromFirestore(data);
    var seed = {
      __id: enriched.__id,
      uid: enriched.uid,
      __demo: enriched.__demo,
      __registrado: enriched.__registrado,
      nombre: enriched.nombre,
      alias: data.alias || data.nombre || enriched.nombre,
      edad: enriched.edad,
      categoria: enriched.categoria,
      categoriaPublica: enriched.categoriaPublica,
      pais: enriched.pais,
      estado: enriched.estado,
      ciudad: enriched.ciudad,
      zona: enriched.zona,
      fotoURL: enriched.fotoURL,
      subcategoriaId: enriched.subcategoriaId || data.subcategoriaId || '',
      arquetipo: enriched.arquetipo || data.arquetipo || '',
      tipoPerfil: enriched.tipoPerfil || data.tipoPerfil || '',
      sectorId: enriched.sectorId || data.sectorId || '',
      formularioId: enriched.formularioId || data.formularioId || '',
      precio: enriched.precio,
      tagline: enriched.tagline,
      descripcion: enriched.descripcion
    };
    var nk;
    for (nk in enriched) {
      if (!Object.prototype.hasOwnProperty.call(enriched, nk)) continue;
      if (/Perfil$/i.test(nk) && enriched[nk] && typeof enriched[nk] === 'object') {
        seed[nk] = Object.assign({}, enriched[nk]);
      }
    }

    var hydrated = blocks.mapToPerfil(seed, bloques, ctx);
    mergeHydrateBase(hydrated, base, data);
    hydrated.__hydratedFromBloques = true;
    return applyPublicPrivacyGuard(hydrated, data);
  }

  function applyPublicPrivacyGuard(u, data) {
    if (global.CariHubPublicPrivacyGuard && CariHubPublicPrivacyGuard.sanitizePerfilPublico) {
      return CariHubPublicPrivacyGuard.sanitizePerfilPublico(u, data);
    }
    return u;
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

  /**
   * BLK-01 Phase 1C-a — bridge resolver hit into existing hydrate pipeline.
   * Expects deep-sanitized profile payload from BLK-01 resolver.
   *
   * @param {object} resolverResult — structured resolveProfile() result
   * @returns {object|null}
   */
  function normalizarFromBlk01Resolver(resolverResult) {
    resolverResult = resolverResult || {};
    if (!resolverResult.found || !resolverResult.profile) return null;
    var perfilId = String(resolverResult.perfilId || resolverResult.normalizedPerfilId || '').trim();
    if (!perfilId) return null;
    var profile = resolverResult.profile;
    if (!profile || typeof profile !== 'object') return null;

    var usuarioId = resolverResult.usuarioId
      || profile.usuarioId
      || profile.ownerUid
      || profile.uid
      || null;
    usuarioId = usuarioId ? String(usuarioId).trim() : null;

    var data = Object.assign({}, profile);
    if (usuarioId) {
      if (!data.uid) data.uid = usuarioId;
      if (!data.usuarioId) data.usuarioId = usuarioId;
    }
    if (!data.perfilId) data.perfilId = perfilId;

    var base = baseNormalizadoPerfilFirestore(data, perfilId);
    base.__id = perfilId;
    base.perfilId = perfilId;
    base.uid = usuarioId || base.uid || perfilId;

    var hydrated = hydratePerfilFromFirestoreDoc(data, base);
    if (hydrated && typeof hydrated === 'object') {
      hydrated.__blk01Source = resolverResult.source || 'none';
      if (Array.isArray(resolverResult.reasons)) {
        hydrated.__blk01Reasons = resolverResult.reasons.slice();
      }
    }
    return hydrated;
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
    var F = global.CariHubPerfilBusquedaFiltro;
    if (F && F.filtrarPerfiles) return F.filtrarPerfiles(items, filtros);
    return items || [];
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
    normalizarFromBlk01Resolver: normalizarFromBlk01Resolver,
    enriquecerMetadataFirestore: enriquecerMetadataFirestore,
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
