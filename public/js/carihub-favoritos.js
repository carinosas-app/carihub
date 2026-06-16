/**
 * Favoritos — usuarios/{uid}/favoritos (requiere cuenta social, no anónima).
 */
(function (global) {
  'use strict';

  function db() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof firebase.firestore === 'function') return firebase.firestore();
    return null;
  }

  function auth() {
    if (global.CariHubAuth) return global.CariHubAuth;
    if (global.auth) return global.auth;
    if (global.firebase && typeof firebase.auth === 'function') return firebase.auth();
    return null;
  }

  function cuentaReal() {
    if (global.CariHubCuentaSocial && CariHubCuentaSocial.cuentaReal) {
      return CariHubCuentaSocial.cuentaReal();
    }
    var user = auth() && auth().currentUser;
    return !!(user && !user.isAnonymous);
  }

  function pedirCuentaSocial(perfilId) {
    if (global.CariHubCuentaSocial && CariHubCuentaSocial.requiereCuentaSocial) {
      return CariHubCuentaSocial.requiereCuentaSocial({
        intencion: 'favoritos',
        perfil: perfilId || '',
        modo: 'entrar'
      });
    }
    if (typeof global.abrirMiPerfil === 'function') {
      global.abrirMiPerfil();
      return false;
    }
    global.location.href = 'index.html?abrir=registro&intencion=favoritos' +
      (perfilId ? '&perfil=' + encodeURIComponent(perfilId) : '');
    return false;
  }

  async function esFavorito(perfilId) {
    try {
      if (!cuentaReal()) return false;
      var user = auth().currentUser;
      if (!user || !perfilId) return false;
      var firestore = db();
      if (!firestore) return false;
      var favDoc = await firestore.collection('usuarios').doc(user.uid).collection('favoritos').doc(perfilId).get();
      return favDoc.exists;
    } catch (e) {
      return false;
    }
  }

  async function toggleFavorito(perfilId, boton) {
    if (!cuentaReal()) {
      pedirCuentaSocial(perfilId);
      return null;
    }

    try {
      var user = auth().currentUser;
      var firestore = db();
      if (!firestore || !user) return false;
      var favRef = firestore.collection('usuarios').doc(user.uid).collection('favoritos').doc(perfilId);
      var favDoc = await favRef.get();

      if (favDoc.exists) {
        await favRef.delete();
        if (boton) {
          boton.classList.remove('is-on', 'activo');
          boton.innerHTML = '♡';
          boton.setAttribute('aria-pressed', 'false');
        }
        return false;
      }

      var perfilDoc = await firestore.collection('usuarios').doc(perfilId).get();
      var p = perfilDoc.exists ? (perfilDoc.data() || {}) : null;

      if (!p && global.CariHubResultadosDemo && CariHubResultadosDemo.perfilPorId) {
        var demo = CariHubResultadosDemo.perfilPorId(perfilId, {});
        if (demo && demo.nombre) {
          p = {
            nombre: demo.nombre,
            ciudad: demo.ciudad || '',
            estado: demo.estado || '',
            pais: demo.pais || '',
            categoria: demo.categoria || demo.categoriaPublica || '',
            fotoURL: demo.fotoURL || (demo.galeria && demo.galeria[0]) || '',
            precio: demo.precio || '',
            modalidad: demo.modalidad || '',
            telefono: demo.telefono || '',
            __demo: true
          };
        }
      }

      if (!p) return false;

      await favRef.set({
        perfilId: perfilId,
        nombre: p.nombre || '',
        ciudad: p.ciudad || '',
        estado: p.estado || '',
        pais: p.pais || '',
        categoria: p.categoria || '',
        fotoURL: p.fotoURL || '',
        precio: p.precio || '',
        modalidad: p.modalidad || '',
        telefono: p.telefono || '',
        esDemo: p.__demo === true,
        fechaGuardado: firebase.firestore.FieldValue.serverTimestamp()
      });

      if (boton) {
        boton.classList.add('is-on', 'activo');
        boton.innerHTML = '♥';
        boton.setAttribute('aria-pressed', 'true');
      }
      return true;
    } catch (error) {
      console.warn('[CariHubFavoritos]', error);
      if (global.alert) global.alert('No se pudo guardar en favoritos. Intenta de nuevo.');
      return null;
    }
  }

  async function sincronizarBotones(root) {
    root = root || document;
    var botones = root.querySelectorAll('[data-fav-perfil]');
    if (!botones.length) return;
    if (!cuentaReal()) return;
    var tareas = [];
    botones.forEach(function (btn) {
      var id = btn.getAttribute('data-fav-perfil');
      if (!id) return;
      tareas.push(esFavorito(id).then(function (on) {
        btn.classList.toggle('is-on', on);
        btn.classList.toggle('activo', on);
        btn.innerHTML = on ? '♥' : '♡';
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      }));
    });
    await Promise.all(tareas);
  }

  async function prepararUsuario() {
    if (!cuentaReal()) return null;
    return auth().currentUser;
  }

  global.CariHubFavoritos = {
    esFavorito: esFavorito,
    toggleFavorito: toggleFavorito,
    sincronizarBotones: sincronizarBotones,
    prepararUsuario: prepararUsuario,
    cuentaReal: cuentaReal
  };
})(typeof window !== 'undefined' ? window : globalThis);
