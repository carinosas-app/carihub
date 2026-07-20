/**
 * Tarjetas visuales «Explora otras categorías» — imagen por sector.
 * Cada imagen enlaza al sector; al pulsar se elige el sector y se abre el selector de país.
 * Visuales fotográficos profesionales 2026-07 (nombre en la imagen + escena representativa).
 */
(function (global) {
  'use strict';

  var BASE = 'img/home/sector-cards/';
  var V = '20260718pro1';

  function src(file) {
    return BASE + file + '?v=' + V;
  }

  var SECTOR_CARD_IMAGES = {
    adultos: {
      src: 'img/home/sectores-card/01-adultos.png',
      alt: 'Adultos y Entretenimiento',
      fit: 'contain',
      pos: 'center center',
      bg: '#1a0818'
    },
    bienestar: {
      src: src('bienestar.png'),
      alt: 'Bienestar, Espiritualidad y Terapias Alternativas',
      fit: 'cover',
      pos: 'center center',
      bg: '#1b3d2e'
    },
    transporte: {
      src: src('transporte.png'),
      alt: 'Transporte, Logística y Mensajería',
      fit: 'cover',
      pos: 'center center',
      bg: '#1a3330'
    },
    mascotas: {
      src: src('mascotas.png'),
      alt: 'Mascotas y Servicios Veterinarios',
      fit: 'cover',
      pos: 'center center',
      bg: '#2e4a32'
    },
    industria: {
      src: src('industria.png'),
      alt: 'Industria y Servicios Empresariales',
      fit: 'cover',
      pos: 'center center',
      bg: '#3a3228'
    },
    educacion: {
      src: src('educacion.png'),
      alt: 'Educación y Capacitación',
      fit: 'cover',
      pos: 'center center',
      bg: '#243048'
    },
    comercio: {
      src: src('comercio.png'),
      alt: 'Comercio, Tiendas y Distribución',
      fit: 'cover',
      pos: 'center center',
      bg: '#3a2a48'
    },
    profesionales: {
      src: src('profesionales.png'),
      alt: 'Servicios Profesionales',
      fit: 'cover',
      pos: 'center center',
      bg: '#0d1b2a'
    },
    'bienes-raices': {
      src: src('bienes-raices.png'),
      alt: 'Bienes Raíces',
      fit: 'cover',
      pos: 'center center',
      bg: '#2a4030'
    },
    hogar: {
      src: src('hogar.png'),
      alt: 'Hogar, Construcción y Mantenimiento',
      fit: 'cover',
      pos: 'center center',
      bg: '#4a3420'
    },
    salud: {
      src: src('salud.png'),
      alt: 'Salud y Bienestar',
      fit: 'cover',
      pos: 'center center',
      bg: '#1a3a42'
    },
    eventos: {
      src: src('eventos.png'),
      alt: 'Eventos, Espectáculos y Fiestas',
      fit: 'cover',
      pos: 'center center',
      bg: '#3a2030'
    },
    automotriz: {
      src: src('automotriz.png'),
      alt: 'Vehículos y Servicios Automotrices',
      fit: 'cover',
      pos: 'center center',
      bg: '#263238'
    },
    tecnologia: {
      src: src('tecnologia.png'),
      alt: 'Tecnología y Servicios Digitales',
      fit: 'cover',
      pos: 'center center',
      bg: '#1a1430'
    },
    restaurantes: {
      src: src('restaurantes.png'),
      alt: 'Restaurantes, Alimentos y Servicios',
      fit: 'cover',
      pos: 'center center',
      bg: '#2a1810'
    }
  };

  function getSectorCardImage(sectorId) {
    return SECTOR_CARD_IMAGES[String(sectorId || '')] || null;
  }

  function getSrc(sectorId) {
    var meta = getSectorCardImage(sectorId);
    return meta && meta.src ? meta.src : null;
  }

  function hasSectorCardImage(sectorId) {
    return !!getSectorCardImage(sectorId);
  }

  function applySectorVisual(vis, sectorId) {
    if (!vis) return vis;
    var img = getSectorCardImage(sectorId);
    if (!img) return vis;
    vis.photo = img.src;
    if (img.pos) vis.photoPos = img.pos;
    if (img.fit) vis.photoFit = img.fit;
    if (img.bg) vis.photoBg = img.bg;
    return vis;
  }

  global.CariHubSectorCardImages = {
    BASE: BASE,
    SECTOR_CARD_IMAGES: SECTOR_CARD_IMAGES,
    getSectorCardImage: getSectorCardImage,
    getSrc: getSrc,
    hasSectorCardImage: hasSectorCardImage,
    applySectorVisual: applySectorVisual
  };
})(typeof window !== 'undefined' ? window : globalThis);
