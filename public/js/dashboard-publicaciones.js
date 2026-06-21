/**
 * Publicaciones por perfil — publicaciones_perfil (scoped cuentaUid + perfilId).
 */
(function (global) {
  'use strict';

  var cache = { key: '', items: [] };

  function db() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof global.firebase.firestore === 'function') return global.firebase.firestore();
    return null;
  }

  function storage() {
    if (global.CariHubStorage) return global.CariHubStorage;
    if (global.firebase && typeof global.firebase.storage === 'function') return global.firebase.storage();
    return null;
  }

  function auth() {
    if (global.CariHubAuth) return global.CariHubAuth;
    if (global.firebase && typeof global.firebase.auth === 'function') return global.firebase.auth();
    return null;
  }

  function ts() {
    return global.firebase && global.firebase.firestore && global.firebase.firestore.FieldValue
      ? global.firebase.firestore.FieldValue.serverTimestamp()
      : new Date();
  }

  function formatFecha(val) {
    if (!val) return '—';
    var d = val;
    if (val && typeof val.toDate === 'function') d = val.toDate();
    else if (!(d instanceof Date)) d = new Date(d);
    if (isNaN(d.getTime())) return '—';
    var now = new Date();
    var diff = now - d;
    if (diff < 86400000) return 'Hoy';
    if (diff < 172800000) return 'Ayer';
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  }

  var CANAL_PERFIL = 'perfil';

  function esCanalPerfil(doc) {
    var d = doc.data ? doc.data() : doc;
    d = d || {};
    if (d.canal === 'mensajes') return false;
    if (d.canal && d.canal !== CANAL_PERFIL) return false;
    return true;
  }

  function normalizar(doc) {
    var d = doc.data ? doc.data() : doc;
    d = d || {};
    return {
      id: doc.id || d.id || '',
      cuentaUid: d.cuentaUid || '',
      perfilId: d.perfilId || '',
      titulo: d.titulo || 'Sin título',
      tipo: d.tipo || 'estado',
      estado: d.estado || 'borrador',
      fecha: formatFecha(d.creadoEn),
      creadoEn: d.creadoEn || null,
      vistas: Number(d.vistas || 0),
      interacciones: Number(d.interacciones || 0),
      imgUrl: d.imgUrl || '',
      programadoPara: d.programadoPara || null
    };
  }

  function filtrarTab(tab, items) {
    items = items || [];
    if (!tab || tab === 'estados') {
      return items.filter(function (p) {
        return p.tipo === 'estado' || p.tipo === 'anuncio';
      });
    }
    if (tab === 'lives') return items.filter(function (p) { return p.tipo === 'live'; });
    if (tab === 'promos') return items.filter(function (p) { return p.tipo === 'promocion'; });
    if (tab === 'eventos') return items.filter(function (p) { return p.tipo === 'evento'; });
    if (tab === 'programados') return items.filter(function (p) { return p.estado === 'programado'; });
    if (tab === 'finalizados') {
      return items.filter(function (p) { return p.estado === 'finalizado'; });
    }
    return items;
  }

  function emptyCopy(tab) {
    var map = {
      estados: 'No tienes anuncios todavía. Usa «Anunciar» para publicar uno.',
      lives: 'No tienes lives registrados.',
      promos: 'No tienes promociones.',
      eventos: 'No tienes eventos.',
      programados: 'No hay publicaciones programadas.',
      finalizados: 'No hay publicaciones finalizadas.'
    };
    return map[tab] || 'Sin publicaciones en esta sección.';
  }

  async function listar(cuentaUid, perfilId) {
    if (!cuentaUid || !perfilId) return [];
    var firestore = db();
    if (!firestore) return [];
    try {
      var snap = await firestore
        .collection('publicaciones_perfil')
        .where('cuentaUid', '==', cuentaUid)
        .where('perfilId', '==', perfilId)
        .get();
      var items = snap.docs.map(normalizar).filter(esCanalPerfil);
      items.sort(function (a, b) {
        var ta = a.creadoEn && a.creadoEn.toDate ? a.creadoEn.toDate().getTime() : 0;
        var tb = b.creadoEn && b.creadoEn.toDate ? b.creadoEn.toDate().getTime() : 0;
        return tb - ta;
      });
      cache = { key: cuentaUid + ':' + perfilId, items: items };
      return items;
    } catch (err) {
      console.warn('[DashPublicaciones] listar', err);
      return [];
    }
  }

  function getCached(cuentaUid, perfilId) {
    var key = (cuentaUid || '') + ':' + (perfilId || '');
    return cache.key === key ? cache.items.slice() : [];
  }

  async function subirImagen(cuentaUid, file) {
    var st = storage();
    if (!st || !file || !cuentaUid) return '';
    var ext = (file.name && file.name.split('.').pop()) || 'jpg';
    var ref = st.ref('perfiles/' + cuentaUid + '/anuncio-' + Date.now() + '.' + ext);
    await ref.put(file);
    return ref.getDownloadURL();
  }

  async function crear(payload) {
    var firestore = db();
    var user = auth() && auth().currentUser;
    if (!firestore || !user || !payload || !payload.cuentaUid || !payload.perfilId) {
      return null;
    }
    var doc = {
      cuentaUid: payload.cuentaUid,
      perfilId: payload.perfilId,
      canal: 'perfil',
      tipo: payload.tipo || 'estado',
      titulo: String(payload.titulo || 'Sin título').slice(0, 80),
      estado: payload.estado || 'activo',
      imgUrl: payload.imgUrl || '',
      vistas: 0,
      interacciones: 0,
      creadoEn: ts(),
      programadoPara: payload.programadoPara || null
    };
    var ref = await firestore.collection('publicaciones_perfil').add(doc);
    cache.key = '';
    return ref.id;
  }

  async function marcarFinalizada(pubId) {
    var firestore = db();
    var user = auth() && auth().currentUser;
    if (!firestore || !user || !pubId) return false;
    try {
      await firestore.collection('publicaciones_perfil').doc(pubId).update({
        estado: 'finalizado',
        finalizadoEn: ts()
      });
      cache.key = '';
      return true;
    } catch (err) {
      console.warn('[DashPublicaciones] finalizar', err);
      return false;
    }
  }

  global.DashPublicaciones = {
    CANAL_PERFIL: CANAL_PERFIL,
    esCanalPerfil: esCanalPerfil,
    listar: listar,
    getCached: getCached,
    crear: crear,
    subirImagen: subirImagen,
    marcarFinalizada: marcarFinalizada,
    filtrarTab: filtrarTab,
    emptyCopy: emptyCopy,
    normalizar: normalizar,
    formatFecha: formatFecha
  };
})(typeof window !== 'undefined' ? window : globalThis);
