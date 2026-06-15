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

  function normalizarPerfilFirestore(doc) {
    var data = doc.data() || {};
    var id = doc.id;
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
      disponibilidad: data.horario ? String(data.horario).slice(0, 48) : 'Disponible ahora',
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

  global.CariHubResultadosRegistrados = {
    cargar: cargar,
    listar: listar,
    totalPublicos: totalPublicos,
    normalizar: normalizarPerfilFirestore,
    urlPerfil: urlPerfil,
    get error() { return _error; },
    get loaded() { return _loaded; }
  };
})(typeof window !== 'undefined' ? window : this);
