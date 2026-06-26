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
    return null;
  }

  function generarPerfilId() {
    return 'perfil_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  var HUB_ONLY_KEYS = ['perfilesDetalle', 'perfilesVinculados', 'perfilActivoId'];

  function isDataUrlString(value) {
    return typeof value === 'string' && value.indexOf('data:image/') === 0;
  }

  function stripDataUrls(value) {
    if (value == null) return value;
    if (typeof value === 'string') {
      return isDataUrlString(value) ? '' : value;
    }
    if (Array.isArray(value)) {
      return value.map(stripDataUrls).filter(function (item) { return item !== ''; });
    }
    if (typeof value === 'object') {
      var out = {};
      Object.keys(value).forEach(function (key) {
        var next = stripDataUrls(value[key]);
        if (next === '' || next == null) return;
        if (typeof next === 'object' && !Array.isArray(next) && Object.keys(next).length === 0) return;
        out[key] = next;
      });
      return out;
    }
    return value;
  }

  function extractProfilePayload(data) {
    data = data || {};
    var out = {};
    Object.keys(data).forEach(function (key) {
      if (HUB_ONLY_KEYS.indexOf(key) >= 0) return;
      out[key] = data[key];
    });
    return out;
  }

  function slimProfileForFirestore(profileDoc) {
    var slim = stripDataUrls(Object.assign({}, profileDoc || {}));
    delete slim.schemaResuelto;
    delete slim.camposPrivados;
    delete slim.camposPublicos;
    HUB_ONLY_KEYS.forEach(function (key) { delete slim[key]; });
    return slim;
  }

  function buildHubRootShim(accountUid, perfilId, slimProfile) {
    slimProfile = slimProfile || {};
    return {
      uid: accountUid,
      cuentaUid: accountUid,
      perfilId: perfilId,
      email: slimProfile.email || '',
      nombre: slimProfile.nombre || slimProfile.alias || '',
      alias: slimProfile.alias || slimProfile.nombre || '',
      telefono: slimProfile.telefono || '',
      pais: slimProfile.pais || '',
      estado: slimProfile.estado || '',
      ciudad: slimProfile.ciudad || '',
      zona: slimProfile.zona || '',
      categoria: slimProfile.categoria || '',
      subcategoria: slimProfile.subcategoria || '',
      subcategoriaId: slimProfile.subcategoriaId || '',
      sectorId: slimProfile.sectorId || '',
      formularioId: slimProfile.formularioId || '',
      arquetipo: slimProfile.arquetipo || '',
      descripcion: slimProfile.descripcion || '',
      descripcionCompleta: slimProfile.descripcionCompleta || '',
      precio: slimProfile.precio || '',
      modalidad: slimProfile.modalidad || '',
      horario: slimProfile.horario || '',
      servicios: slimProfile.servicios || '',
      edad: slimProfile.edad || '',
      fotoURL: slimProfile.fotoURL || '',
      fotosExtraURL: Array.isArray(slimProfile.fotosExtraURL) ? slimProfile.fotosExtraURL : [],
      contactoPublico: slimProfile.contactoPublico || {},
      mensajeContactoPublicidad: slimProfile.mensajeContactoPublicidad || '',
      datosPrivados: slimProfile.datosPrivados || {},
      verificacion: slimProfile.verificacion || {},
      registroWizard: slimProfile.registroWizard || 'registro-perfil-v2',
      aprobado: slimProfile.aprobado === true,
      activo: slimProfile.activo === true,
      vencido: slimProfile.vencido === true,
      primerMesGratis: slimProfile.primerMesGratis !== false,
      perfilAdicional: slimProfile.perfilAdicional === true,
      descuentoPrimerPeriodo: slimProfile.descuentoPrimerPeriodo || 0,
      autorizadoParaPago: slimProfile.autorizadoParaPago === true,
      pagado: slimProfile.pagado === true,
      actualizacionPendiente: slimProfile.actualizacionPendiente === true,
      estadoPago: slimProfile.estadoPago || 'pendiente_aprobacion',
      estadoRevision: slimProfile.estadoRevision || 'registro_pendiente',
      fechaPublicacion: slimProfile.fechaPublicacion || null,
      fechaVencimiento: slimProfile.fechaVencimiento || null,
      fecha: slimProfile.fecha || new Date(),
      fechaSolicitud: slimProfile.fechaSolicitud || new Date().toISOString()
    };
  }

  function slimDetalleMap(existingDetalle, cuentaUid) {
    var detalle = {};
    var src = existingDetalle || {};
    Object.keys(src).forEach(function (id) {
      var raw = src[id] || {};
      detalle[id] = slimProfileForFirestore(
        Object.assign({ perfilId: id, cuentaUid: cuentaUid }, extractProfilePayload(raw))
      );
    });
    return detalle;
  }

  function buildPerfilVinculado(perfilId, doc) {
    if (global.CariHubMultiPerfil) {
      return CariHubMultiPerfil.buildPerfilVinculado(perfilId, doc);
    }
    return {
      perfilId: perfilId,
      nombre: doc.nombre || doc.alias || '',
      categoria: doc.categoria || '',
      fotoThumb: doc.fotoURL || '',
      activo: doc.activo === true
    };
  }

  function buildUsuarioDoc(uid, draft, priv, publicUrls, opts) {
    publicUrls = publicUrls || {};
    opts = opts || {};
    var esAdicional = opts.esPerfilAdicional === true;
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

    var bloques = cp.bloquesPublicos || null;
    var mappedBloques = {};
    if (bloques && global.CariHubRegistroPublicBlocks && CariHubRegistroPublicBlocks.mapToPerfil) {
      mappedBloques = CariHubRegistroPublicBlocks.mapToPerfil({}, bloques, ctx);
    }

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
        draft.schemaResuelto.identidad.formularioId) || ctx.formularioId || '',
      arquetipo: (draft.schemaResuelto && draft.schemaResuelto.identidad &&
        draft.schemaResuelto.identidad.arquetipo) || ctx.arquetipo || '',
      formularioUiId: (draft.schemaResuelto && draft.schemaResuelto.formularioUiId) ||
        ctx.formularioUiId || '',
      schemaVersion: ctx.schemaVersion || '',
      descripcion: cp.descripcionCorta || '',
      descripcionCompleta: mappedBloques.sobreMi || cp.descripcionCorta || '',
      precio: cp.precioDesde || '',
      modalidad: cp.modalidad || '',
      horario: mappedBloques.horario || cp.horarioPublico || '',
      servicios: Array.isArray(mappedBloques.serviciosIncluidos)
        ? mappedBloques.serviciosIncluidos.join('; ')
        : (cp.serviciosPrincipales || ''),
      edad: cp.edad || '',
      orientacion: mappedBloques.orientacion || '',
      identidadGenero: mappedBloques.presentacionFemboy || mappedBloques.presentacionTom || mappedBloques.identidadGenero || '',
      presentacionFemboy: mappedBloques.presentacionFemboy || '',
      presentacionTom: mappedBloques.presentacionTom || '',
      estiloPredominante: mappedBloques.estiloPredominante || '',
      disponiblePara: mappedBloques.disponiblePara || [],
      largoCabello: mappedBloques.largoCabello || '',
      tonoPiel: mappedBloques.tonoPiel || '',
      videoPresentacion: mappedBloques.videoPresentacion || '',
      promociones: mappedBloques.promociones || '',
      buscan: mappedBloques.buscanConocer
        || mappedBloques.tipoPublico
        || (Array.isArray(mappedBloques.buscan) ? mappedBloques.buscan : (mappedBloques.buscan || '')),
      buscanConocer: mappedBloques.buscanConocer || [],
      tipoCitaPreferida: mappedBloques.tipoCitaPreferida || [],
      personalidadPredominante: mappedBloques.personalidadPredominante || '',
      estiloPersonal: mappedBloques.estiloPersonal || '',
      dinamicasParticipa: mappedBloques.dinamicasParticipa || [],
      colaboracionContenido: mappedBloques.colaboracionContenido || '',
      realizaTrios: mappedBloques.realizaTrios || '',
      tiposTrios: mappedBloques.tiposTrios || [],
      esBisexual: mappedBloques.esBisexual || '',
      realizaGangBang: mappedBloques.realizaGangBang || '',
      tipoPublico: mappedBloques.tipoPublico || '',
      participacionPareja: mappedBloques.participacionPareja || '',
      disponibilidadAgenda: mappedBloques.disponibilidadAgenda || [],
      tipoExperiencia: mappedBloques.tipoExperiencia || [],
      loQueBuscaConocer: mappedBloques.loQueBuscaConocer || '',
      aficiones: mappedBloques.aficiones || '',
      personalidad: mappedBloques.personalidad || '',
      pasatiempos: mappedBloques.pasatiempos || '',
      estiloVida: mappedBloques.estiloVida || '',
      idiomas: mappedBloques.idiomas || '',
      nivelServicio: mappedBloques.nivelServicio || '',
      nivelPremium: mappedBloques.nivelPremium || '',
      experienciaVip: mappedBloques.experienciaVip || [],
      distintivosVip: mappedBloques.distintivosVip || [],
      longitudCm: mappedBloques.longitudCm || '',
      categoriaTamaño: mappedBloques.categoriaTamaño || '',
      mostrarLongitudPublico: mappedBloques.mostrarLongitudPublico || '',
      atencionHombres: mappedBloques.atencionHombres || '',
      mostrarAtencionHombresPublico: mappedBloques.mostrarAtencionHombresPublico || '',
      atencionMujeres: mappedBloques.atencionMujeres || '',
      mostrarAtencionMujeresPublico: mappedBloques.mostrarAtencionMujeresPublico || '',
      atencionParejas: mappedBloques.atencionParejas || '',
      mostrarAtencionParejasPublico: mappedBloques.mostrarAtencionParejasPublico || '',
      atencionTrans: mappedBloques.atencionTrans || '',
      mostrarAtencionTransPublico: mappedBloques.mostrarAtencionTransPublico || '',
      mostrarRealizaTriosPublico: mappedBloques.mostrarRealizaTriosPublico || '',
      mostrarColaboracionContenidoPublico: mappedBloques.mostrarColaboracionContenidoPublico || '',
      eventosDisponibles: mappedBloques.eventosDisponibles === true,
      portfolioURL: mappedBloques.portfolioURL || '',
      disponibilidad: mappedBloques.disponibilidad || '',
      estatura: mappedBloques.estatura || '',
      peso: mappedBloques.peso || '',
      complexion: mappedBloques.complexion || '',
      cabello: mappedBloques.cabello || '',
      ojos: mappedBloques.ojos || '',
      tatuajes: mappedBloques.tatuajes || '',
      piercings: mappedBloques.piercings || '',
      serviciosIncluidos: mappedBloques.serviciosIncluidos || [],
      noRealiza: mappedBloques.noRealiza || [],
      metodosPago: mappedBloques.metodosPago || [],
      modalidades: mappedBloques.modalidades || [],
      viajesDesplazamiento: mappedBloques.viajesDesplazamiento || { viaja: false },
      tagline: cp.descripcionCorta || '',
      sobreMi: mappedBloques.sobreMi || '',
      badgeLgbt: mappedBloques.badgeLgbt === true,
      badgeVip: mappedBloques.badgeVip === true,
      badgeTrans: mappedBloques.badgeTrans === true,
      badgeHotwife: mappedBloques.badgeHotwife === true,
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
      aprobado: false,
      activo: false,
      vencido: false,
      perfilAdicional: esAdicional,
      primerMesGratis: !esAdicional,
      descuentoPrimerPeriodo: esAdicional ? 0.5 : 0,
      autorizadoParaPago: false,
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
    var slim = slimProfileForFirestore(profileDoc);
    var entry = buildPerfilVinculado(perfilId, slim);
    var detalle = {};
    detalle[perfilId] = Object.assign({ perfilId: perfilId, cuentaUid: accountUid }, slim);
    return Object.assign(buildHubRootShim(accountUid, perfilId, slim), {
      perfilesVinculados: [entry],
      perfilActivoId: perfilId,
      perfilesDetalle: detalle
    });
  }

  function appendPerfilToHub(existingData, perfilId, profileDoc) {
    var cuentaUid = existingData.uid || existingData.cuentaUid || profileDoc.uid;
    var slimNew = slimProfileForFirestore(profileDoc);
    if (global.CariHubMultiPerfil) {
      return CariHubMultiPerfil.appendPerfilToHub(existingData, perfilId, slimNew, {
        cuentaUid: cuentaUid,
        slimLegacyFn: slimProfileForFirestore
      });
    }
    var vinculados = Array.isArray(existingData.perfilesVinculados)
      ? existingData.perfilesVinculados.slice()
      : [];
    var detalle = slimDetalleMap(existingData.perfilesDetalle, cuentaUid);
    vinculados.push(buildPerfilVinculado(perfilId, slimNew));
    detalle[perfilId] = Object.assign({ perfilId: perfilId, cuentaUid: cuentaUid }, slimNew);
    return {
      perfilesVinculados: vinculados,
      perfilesDetalle: detalle,
      perfilActivoId: perfilId
    };
  }

  function ensureAuthSession(fb, email, password) {
    var current = fb.auth.currentUser;
    if (current && current.email && String(current.email).trim().toLowerCase() === String(email).trim().toLowerCase()) {
      var credential = global.firebase.auth.EmailAuthProvider.credential(email, password);
      return current.reauthenticateWithCredential(credential).then(function () {
        return { uid: current.uid, isNewAccount: false, reauthenticated: true };
      });
    }
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
          return fb.db.collection('usuarios').doc(uid).get().then(function (hubSnap) {
            var esAdicional = hubSnap.exists && tienePerfilesExistentes(hubSnap.data() || {});
            var doc = buildUsuarioDoc(uid, draft, priv, urls, { esPerfilAdicional: esAdicional });
            doc.perfilId = perfilId;
            doc.cuentaUid = uid;
            return guardarPerfilEnFirestore(fb, uid, doc, perfilId).then(function () {
              return { uid: uid, perfilId: perfilId, doc: doc, esPerfilAdicional: esAdicional };
            });
          });
        });
      });
  }

  function tienePerfilesExistentes(hubData) {
    if (global.CariHubMultiPerfil) {
      return CariHubMultiPerfil.hasNestedPerfiles(hubData) ||
        CariHubMultiPerfil.hasLegacyFlatPerfil(hubData);
    }
    var det = hubData.perfilesDetalle;
    if (det && typeof det === 'object' && Object.keys(det).length > 0) return true;
    if (hubData.perfilId || hubData.nombre || hubData.alias) return true;
    if (Array.isArray(hubData.perfilesVinculados) && hubData.perfilesVinculados.length > 0) return true;
    return false;
  }

  global.CariHubRegistroPerfilSubmit = {
    submitRegistroPerfil: submitRegistroPerfil,
    limpiarTelefono: limpiarTelefono,
    generarPerfilId: generarPerfilId,
    buildPerfilVinculado: buildPerfilVinculado,
    buildUsuarioDoc: buildUsuarioDoc,
    buildUsuarioHubDoc: buildUsuarioHubDoc,
    appendPerfilToHub: appendPerfilToHub,
    slimProfileForFirestore: slimProfileForFirestore
  };
})(typeof window !== 'undefined' ? window : globalThis);
