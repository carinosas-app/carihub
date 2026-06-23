'use strict';

/**
 * Pure local upload validation — NO enforcement, NO Storage, NO Firestore.
 * @param {object} input
 * @param {string} input.contextoUpload — perfil_galeria | chat_adjunto | estado_media | ...
 * @param {object} input.entitlements — output resolveEntitlements().limites
 * @param {object} [input.usage] — contadores actuales
 * @param {number} [input.archivoBytes]
 * @param {string} [input.mimeType]
 */
function validateUpload(input) {
  input = input || {};
  const ctx = input.contextoUpload;
  const lim = input.entitlements || {};
  const usage = input.usage || {};
  const bytes = Number(input.archivoBytes) || 0;

  if (!ctx) {
    return { allowed: false, code: 'UPLOAD_CONTEXT_REQUIRED', message: 'contextoUpload requerido' };
  }
  if (!lim || typeof lim !== 'object') {
    return { allowed: false, code: 'ENTITLEMENTS_REQUIRED', message: 'entitlements requeridos' };
  }

  const mb = bytes / (1024 * 1024);
  const tam = lim.tamanoMaxArchivoMb || {};

  if (ctx === 'perfil_galeria' || ctx === 'perfil_foto_principal') {
    const max = lim.fotosMax != null ? lim.fotosMax : 0;
    const used = usage.fotosUsadas || 0;
    if (used >= max) {
      return { allowed: false, code: 'FOTOS_MAX', message: 'Cupo de fotos agotado', used, max };
    }
    const maxMb = tam.foto != null ? tam.foto : 5;
    if (mb > maxMb) {
      return { allowed: false, code: 'FOTO_SIZE', message: 'Archivo excede tamaño máximo', maxMb };
    }
    return { allowed: true, code: 'OK' };
  }

  if (ctx === 'perfil_video') {
    const max = lim.videosMax != null ? lim.videosMax : 0;
    const used = usage.videosUsados || 0;
    if (max === 0) {
      return { allowed: false, code: 'VIDEO_NOT_ALLOWED', message: 'Plan sin video en galería' };
    }
    if (used >= max) {
      return { allowed: false, code: 'VIDEOS_MAX', used, max };
    }
    const maxMb = tam.video != null ? tam.video : 25;
    if (mb > maxMb) {
      return { allowed: false, code: 'VIDEO_SIZE', maxMb };
    }
    return { allowed: true, code: 'OK' };
  }

  if (ctx === 'chat_adjunto') {
    const chat = lim.adjuntosChat || {};
    const isVideo = input.mimeType && String(input.mimeType).indexOf('video/') === 0;
    const isImage = input.mimeType && String(input.mimeType).indexOf('image/') === 0;
    if (isVideo && !chat.video) {
      return { allowed: false, code: 'CHAT_VIDEO_NOT_ALLOWED', message: 'Reservado MSG-011' };
    }
    if (isImage && !chat.imagen) {
      return { allowed: false, code: 'CHAT_IMAGE_NOT_ALLOWED' };
    }
    const mesMax = lim.adjuntosChatMesMax != null ? lim.adjuntosChatMesMax : 0;
    const usedMes = usage.adjuntosChatMes || 0;
    if (usedMes >= mesMax) {
      return { allowed: false, code: 'CHAT_MONTHLY_MAX', used: usedMes, max: mesMax };
    }
    return { allowed: true, code: 'OK', nota: 'Enforcement real post MSG-011' };
  }

  if (ctx === 'estado_media') {
    const est = lim.estados || {};
    if (!est.habilitado) {
      return { allowed: false, code: 'ESTADOS_NOT_ALLOWED', message: 'Plan sin estados' };
    }
    const activos = usage.estadosActivos || 0;
    if (activos >= (est.activosMax || 0)) {
      return { allowed: false, code: 'ESTADOS_ACTIVOS_MAX', used: activos, max: est.activosMax };
    }
    return { allowed: true, code: 'OK' };
  }

  if (ctx === 'live_grabacion') {
    const lives = lim.lives || {};
    if (!lives.habilitado) {
      return { allowed: false, code: 'LIVES_NOT_ALLOWED' };
    }
    return { allowed: true, code: 'OK' };
  }

  return { allowed: false, code: 'CONTEXT_UNSUPPORTED', message: 'Contexto no mapeado: ' + ctx };
}

module.exports = {
  validateUpload,
};
