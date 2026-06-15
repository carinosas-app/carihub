/**
 * Favoritos — usuarios/{uid}/favoritos (auth anónima o registrada).
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
    if (global.firebase && typeof firebase.auth === 'function') return firebase.auth();
    return null;
  }

  function limpiarTelefono(t) {
    return String(t || '').replace(/\D/g, '');
  }

  async function asegurarUsuario() {
    var a = auth();
    if (!a) throw new Error('Auth no disponible');
    if (!a.currentUser) await a.signInAnonymously();
    return a.currentUser;
  }

  async function esFavorito(perfilId) {
    try {
      var user = auth() && auth().currentUser;
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
    try {
      var user = await asegurarUsuario();
      var firestore = db();
      if (!firestore) return false;
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
      if (!perfilDoc.exists) return false;
      var p = perfilDoc.data() || {};

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
      if (global.alert) alert('No se pudo guardar en favoritos. Intenta de nuevo.');
      return null;
    }
  }

  async function sincronizarBotones(root) {
    root = root || document;
    var botones = root.querySelectorAll('[data-fav-perfil]');
    if (!botones.length) return;
    try {
      await asegurarUsuario();
    } catch (e) {
      return;
    }
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
    return asegurarUsuario();
  }

  global.CariHubFavoritos = {
    asegurarUsuario: asegurarUsuario,
    prepararUsuario: prepararUsuario,
    esFavorito: esFavorito,
    toggleFavorito: toggleFavorito,
    sincronizarBotones: sincronizarBotones,
    limpiarTelefono: limpiarTelefono
  };
})(typeof window !== 'undefined' ? window : this);
