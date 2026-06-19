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
    if (!global.firebase || !global.firebase.apps || !global.firebase.apps.length) return null;
    return {
      auth: global.firebase.auth(),
      db: global.firebase.firestore(),
      storage: global.firebase.storage()
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

    return fb.auth.createUserWithEmailAndPassword(email, password)
      .then(function (cred) {
        uid = cred.user.uid;
        progress('Subiendo fotos públicas…');
        var cp = draft.camposPublicos || {};
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
          var doc = buildUsuarioDoc(uid, draft, priv, urls);
          return fb.db.collection('usuarios').doc(uid).set(doc).then(function () {
            return { uid: uid, doc: doc };
          });
        });
      });
  }

  global.CariHubRegistroPerfilSubmit = {
    submitRegistroPerfil: submitRegistroPerfil,
    limpiarTelefono: limpiarTelefono
  };
})(typeof window !== 'undefined' ? window : globalThis);
