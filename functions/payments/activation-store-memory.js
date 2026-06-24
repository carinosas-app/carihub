'use strict';

/**
 * Store en memoria para tests y Fase 0 (sin Firestore prod).
 */
function createMemoryActivationStore(initial) {
  initial = initial || {};
  const docs = Object.assign({}, initial.docs || {});
  const ordenes = Object.assign({}, initial.ordenes || {});

  function parsePath(path) {
    const parts = path.split('/');
    return { col: parts[0], id: parts[1], subcol: parts[2], subid: parts[3] };
  }

  function getDoc(path) {
    if (ordenes[path.split('/').pop()] && path.indexOf('ordenes_pago') === 0) {
      return Promise.resolve(null);
    }
    const p = parsePath(path);
    if (p.subcol) {
      const key = p.col + '/' + p.id + '/' + p.subcol + '/' + p.subid;
      return Promise.resolve(docs[key] ? Object.assign({}, docs[key]) : null);
    }
    const key = p.col + '/' + p.id;
    return Promise.resolve(docs[key] ? Object.assign({}, docs[key]) : null);
  }

  function setDoc(path, data, merge) {
    const p = parsePath(path);
    let key;
    if (p.subcol) {
      key = p.col + '/' + p.id + '/' + p.subcol + '/' + p.subid;
    } else {
      key = p.col + '/' + p.id;
    }
    if (merge && docs[key]) {
      docs[key] = Object.assign({}, docs[key], data);
    } else {
      docs[key] = Object.assign({}, data);
    }
    if (path.indexOf('configuracion_publicidad/banners_activos') === 0 && merge && data.slots) {
      docs[key].slots = Object.assign({}, (docs[key].slots || {}), data.slots);
    }
    return Promise.resolve();
  }

  function getOrden(ordenId) {
    const o = ordenes[ordenId];
    return Promise.resolve(o ? Object.assign({}, o) : null);
  }

  function setOrden(ordenId, data) {
    ordenes[ordenId] = Object.assign({}, data, { ordenId: ordenId });
    return Promise.resolve();
  }

  async function runActivationTransaction(payload) {
    const orden = ordenes[payload.ordenId];
    if (!orden) throw new Error('orden missing');
    if (orden.activacionCompleta === true) {
      const err = new Error('already activated');
      err.code = 'YA_ACTIVADO';
      throw err;
    }
    if (payload.ordenPrecondition && payload.ordenPrecondition.activacionCompleta === false) {
      if (orden.activacionCompleta === true) {
        const err = new Error('already activated');
        err.code = 'YA_ACTIVADO';
        throw err;
      }
    }

    const plan = payload.plan;
    const tipo = payload.tipo;

    if (tipo === 'perfil') {
      await setDoc(plan.contratoPath, plan.contrato, false);
      const usuario = (await getDoc(plan.usuarioPath)) || { perfilesDetalle: {} };
      const det = Object.assign({}, (usuario.perfilesDetalle || {})[plan.perfilId] || {}, plan.mirrorPatch);
      const perfilesDetalle = Object.assign({}, usuario.perfilesDetalle || {}, {});
      perfilesDetalle[plan.perfilId] = det;
      await setDoc(plan.usuarioPath, {
        perfilesDetalle: perfilesDetalle,
        perfilActivoId: plan.perfilId,
      }, true);
      const usageExisting = await getDoc(plan.usagePath);
      if (!usageExisting) {
        await setDoc(plan.usagePath, plan.usageDoc, false);
      }
    } else if (tipo === 'banner') {
      await setDoc(plan.contratoPath, plan.contrato, false);
      await setDoc(plan.solicitudPath, plan.mirrorSolicitud, true);
      if (plan.bannersActivosPatch) {
        const prev = (await getDoc(plan.bannersActivosPatch.path)) || { slots: {} };
        const slots = Object.assign({}, prev.slots || {}, plan.bannersActivosPatch.data.slots);
        await setDoc(plan.bannersActivosPatch.path, { slots: slots }, true);
      }
    } else if (tipo === 'estado' || tipo === 'live') {
      await setDoc(plan.solicitudPath, plan.mirrorSolicitud, true);
    }

    await setDoc('activaciones_pago/' + payload.activacionId, {
      ordenId: payload.ordenId,
      tipoProducto: tipo,
      origen: payload.contextoActivacion.origen,
      actorId: payload.contextoActivacion.actorId,
      creadoEn: new Date(),
      auditWarning: payload.auditWarning || null,
    }, false);

    ordenes[payload.ordenId] = Object.assign({}, orden, payload.ordenPatch);
  }

  function snapshot() {
    return {
      docs: Object.assign({}, docs),
      ordenes: Object.assign({}, ordenes),
    };
  }

  return {
    getDoc,
    setDoc,
    getOrden,
    setOrden,
    runActivationTransaction,
    snapshot,
  };
}

module.exports = {
  createMemoryActivationStore,
};
