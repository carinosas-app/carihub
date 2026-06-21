(function (global) {
  'use strict';

  function limpiarTelefono(t) {
    return String(t || '').replace(/\D/g, '');
  }

  function dataUrlToBlob(dataUrl) {
    var parts = String(dataUrl).split(',');
    var mime = (parts[0].match(/:(.*?);/) || [])[1] || 'image/jpeg';
    var bin = atob(parts[1] || '');
    var len = bin.length;
    var arr = new Uint8Array(len);
    for (var i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  function uploadDataUrl(storage, path, dataUrl) {
    if (!dataUrl || String(dataUrl).indexOf('data:') !== 0) return Promise.resolve('');
    var ref = storage.ref(path);
    return ref.put(dataUrlToBlob(dataUrl)).then(function () { return ref.getDownloadURL(); });
  }

  function getFirebase() {
    if (global.CariHubCore && global.CariHubCore.ready) {
      return {
        auth: global.CariHubCore.auth,
        db: global.CariHubCore.db,
        storage: global.CariHubCore.storage
      };
    }
    if (!global.firebase || !global.firebase.apps || !global.firebase.apps.length) return null;
    return {
      auth: global.firebase.auth(),
      db: global.firebase.firestore(),
      storage: global.firebase.storage()
    };
  }

  function generarPerfilId() {
    return 'perfil_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function buildPerfilVinculado(perfilId, doc) {
    return {
      perfilId: perfilId,
      nombre: doc.nombre || doc.alias || '',
      categoria: doc.categoria || '',
      fotoThumb: doc.fotoURL || '',
      activo: doc.activo === true
    };
  }

  function buildUsuarioDoc(uid, draft, priv, publicUrls) {
    publicUrls = publicUrls || {};
    var cp = draft.camposPublicos || {};
    var ctx = draft.contexto || {};
    var ver = {};
    if (priv.verificacion) {
      Object.keys(priv.verificacion).forEach(function (k) {
        if (publicUrls.verificacion && publicUrls.verificacion[k]) ver[k + 'URL'] = publicUrls.verificacion[k];
      });
    }
    ver.nombreReal = priv.nombrePersonal || priv.responsable || cp.alias || '';
    ver.fechaNacimiento = priv.fechaNacimiento || '';
    ver.fecha = new Date();

    return {
      uid: uid,
      cuentaUid: uid,
      nombre: cp.alias || '',
      alias: cp.alias || '',
      email: (priv.correoAcceso || '').trim().toLowerCase(),
      telefono: limpiarTelefono(priv.telefonoPrivado || priv.telefonoContacto || priv.whatsappPrivado || ''),
      pais: cp.pais || '',
      estado: cp.estado || '',
      ciudad: cp.ciudad || '',
      zona: cp.zona || '',
      categoria: ctx.categoriaPrincipal || ctx.categoriaSolicitada || '',
      subcategoria: ctx.subcategoria || ctx.subcategoriaSolicitada || '',
      subcategoriaId: ctx.subcategoriaId || '',
      sectorId: ctx.sectorId || '',
      formularioId: (draft.schemaResuelto && draft.schemaResuelto.identidad &&
        draft.schemaResuelto.identidad.formularioId) || '',
      arquetipo: (draft.schemaResuelto && draft.schemaResuelto.identidad &&
        draft.schemaResuelto.identidad.arquetipo) || '',
      descripcion: cp.descripcionCorta || '',
      descripcionCompleta: cp.descripcionCorta || '',
      precio: cp.precioDesde || '',
      modalidad: cp.modalidad || '',
      horario: cp.horarioPublico || '',
      servicios: cp.serviciosPrincipales || '',
      edad: cp.edad || '',
      fotoURL: publicUrls.fotoPrincipal || '',
      fotosExtraURL: publicUrls.fotosExtra || [],
      contactoPublico: draft.contactoPublico || {},
      mensajeContactoPublicidad: draft.mensajeContactoPublicidad || '',
      camposPublicos: cp,
      camposPrivados: global.CariHubPrivateFieldsLite
        ? CariHubPrivateFieldsLite.sanitizePrivateForStorage(priv)
        : {},
      datosPrivados: {
        domicilio: priv.domicilioPrivado || '',
        correoPrivado: priv.correoContactoAdmin || priv.correoAcceso || '',
        telefonoPrivado: priv.telefonoPrivado || priv.telefonoContacto || '',
        administracion: priv.administracion || {},
        facturacion: priv.facturacion || null,
        consentimientos: {
          mayorEdad: !!priv.mayorEdadConfirmado,
          crearCuenta: !!priv.aceptoCrearCuenta,
          fotosPropias: !!priv.fotosPropioContenido,
          voluntario: !!priv.publicacionVoluntaria,
          terminos: !!priv.terminosAceptados,
          uso: !!priv.aceptoCondicionesUso,
          privacidad: !!priv.aceptoPoliticaPrivacidad,
          revision: !!priv.autorizoRevisionManual,
          derechosImagenes: !!priv.validacionDerechosImagenes,
          contenidoLegal: !!priv.validacionContenidoLegal
        }
      },
      verificacion: ver,
      registroWizard: 'registro-perfil-v2',
      schemaResuelto: draft.schemaResuelto || null,
      aprobado: false,
      activo: false,
      vencido: false,
      primerMesGratis: true,
      pagado: false,
      actualizacionPendiente: false,
      estadoPago: 'pendiente_aprobacion',
      estadoRevision: 'registro_pendiente',
      fechaPublicacion: null,
      fechaVencimiento: null,
      fecha: new Date(),
      fechaSolicitud: new Date().toISOString()
    };
  }

  function buildUsuarioHubDoc(accountUid, perfilId, profileDoc) {
    var entry = buildPerfilVinculado(perfilId, profileDoc);
    var detalle = {};
    detalle[perfilId] = Object.assign({ perfilId: perfilId, cuentaUid: accountUid }, profileDoc);
    return Object.assign({}, profileDoc, {
      uid: accountUid,
      cuentaUid: accountUid,
      perfilId: perfilId,
      perfilesVinculados: [entry],
      perfilActivoId: perfilId,
      perfilesDetalle: detalle
    });
  }

  function appendPerfilToHub(existingData, perfilId, profileDoc) {
    var cuentaUid = existingData.uid || existingData.cuentaUid || profileDoc.uid;
    var vinculados = Array.isArray(existingData.perfilesVinculados)
      ? existingData.perfilesVinculados.slice()
      : [];
    var detalle = Object.assign({}, existingData.perfilesDetalle || {});

    if (!vinculados.length) {
      var legacyId = existingData.perfilId || ('perfil_' + cuentaUid);
      vinculados.push(buildPerfilVinculado(legacyId, existingData));
      detalle[legacyId] = Object.assign({ perfilId: legacyId, cuentaUid: cuentaUid }, existingData);
    }

    vinculados.push(buildPerfilVinculado(perfilId, profileDoc));
    detalle[perfilId] = Object.assign({ perfilId: perfilId, cuentaUid: cuentaUid }, profileDoc);

    return {
      perfilesVinculados: vinculados,
      perfilesDetalle: detalle,
      perfilActivoId: perfilId
    };
  }

  function ensureAuthSession(fb, email, password) {
    return fb.auth.createUserWithEmailAndPassword(email, password)
      .then(function (cred) {
        return { uid: cred.user.uid, isNewAccount: true };
      })
      .catch(function (err) {
        if (err && err.code === 'auth/email-already-in-use') {
          return fb.auth.signInWithEmailAndPassword(email, password).then(function (cred) {
            return { uid: cred.user.uid, isNewAccount: false };
          });
        }
        return Promise.reject(err);
      });
  }

  function guardarPerfilEnFirestore(fb, accountUid, profileDoc, perfilId) {
    return fb.db.collection('usuarios').doc(accountUid).get().then(function (snap) {
      if (!snap.exists) {
        return fb.db.collection('usuarios').doc(accountUid).set(
          buildUsuarioHubDoc(accountUid, perfilId, profileDoc)
        );
      }
      return fb.db.collection('usuarios').doc(accountUid).update(
        appendPerfilToHub(snap.data() || {}, perfilId, profileDoc)
      );
    });
  }

  function submitRegistroPerfil(draft, priv, onProgress) {
    var fb = getFirebase();
    if (!fb) return Promise.reject(new Error('Firebase no está disponible en esta página.'));
    if (!priv.correoAcceso || !priv.contrasenaAcceso) {
      return Promise.reject(new Error('Faltan correo o contraseña de acceso.'));
    }

    var email = String(priv.correoAcceso).trim().toLowerCase();
    var password = priv.contrasenaAcceso;
    var uid;

    function progress(msg) {
      if (typeof onProgress === 'function') onProgress(msg);
    }

    return ensureAuthSession(fb, email, password)
      .then(function (session) {
        uid = session.uid;
        progress('Subiendo fotos públicas…');
        var imgs = draft.imagenesPublicas || {};
        var uploads = [];
        var urls = { verificacion: {}, fotosExtra: [] };

        if (imgs.principal) {
          uploads.push(
            uploadDataUrl(fb.storage, 'perfiles/' + uid + '/foto-principal-' + Date.now() + '.jpg', imgs.principal)
              .then(function (url) { urls.fotoPrincipal = url; })
          );
        }
        (imgs.galeria || []).forEach(function (src, i) {
          if (!src) return;
          uploads.push(
            uploadDataUrl(fb.storage, 'perfiles/' + uid + '/extra-' + Date.now() + '-' + i + '.jpg', src)
              .then(function (url) { urls.fotosExtra.push(url); })
          );
        });

        if (priv.verificacion) {
          progress('Subiendo documentos de verificación…');
          Object.keys(priv.verificacion).forEach(function (key) {
            var src = priv.verificacion[key];
            if (!src) return;
            uploads.push(
              uploadDataUrl(fb.storage, 'verificaciones/' + uid + '/' + key + '-' + Date.now() + '.jpg', src)
                .then(function (url) { urls.verificacion[key] = url; })
            );
          });
        }

        return Promise.all(uploads).then(function () { return urls; });
      })
      .then(function (urls) {
        progress('Guardando solicitud…');
        return fb.auth.currentUser.getIdToken(true).then(function () {
          var perfilId = generarPerfilId();
          var doc = buildUsuarioDoc(uid, draft, priv, urls);
          doc.perfilId = perfilId;
          doc.cuentaUid = uid;
          return guardarPerfilEnFirestore(fb, uid, doc, perfilId).then(function () {
            return { uid: uid, perfilId: perfilId, doc: doc };
          });
        });
      });
  }

  global.CariHubRegistroPerfilSubmit = {
    submitRegistroPerfil: submitRegistroPerfil,
    limpiarTelefono: limpiarTelefono,
    generarPerfilId: generarPerfilId,
    buildPerfilVinculado: buildPerfilVinculado
  };
})(typeof window !== 'undefined' ? window : globalThis);
