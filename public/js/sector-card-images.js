/**
 * Tarjetas visuales «Explora otras categorías» — imagen por sector.
 * Cada imagen enlaza al sector; al pulsar se elige el sector y se abre el selector de país.
 */
(function (global) {
  'use strict';

  var BASE = 'img/home/sector-cards/';

  var SECTOR_CARD_IMAGES = {
    adultos: {
      src: BASE + 'adultos.png',
      alt: 'Adultos y Entretenimiento',
      fit: 'cover',
      pos: 'center center',
      bg: '#1a0818'
    },
    bienestar: {
      src: BASE + 'bienestar.png',
      alt: 'Bienestar, Espiritualidad y Terapias Alternativas',
      fit: 'cover',
      pos: 'center center',
      bg: '#3d2a5c',
      heroFraction: 0.44
    },
    transporte: {
      src: BASE + 'transporte.png',
      alt: 'Transporte, Logística y Mensajería',
      fit: 'cover',
      pos: 'center center',
      bg: '#c45c1a',
      heroFraction: 0.44
    },
    mascotas: {
      src: BASE + 'mascotas.png',
      alt: 'Mascotas y Servicios Veterinarios',
      fit: 'cover',
      pos: 'center center',
      bg: '#5c3d6e',
      heroFraction: 0.44
    },
    industria: {
      src: BASE + 'industria.png',
      alt: 'Industria y Servicios Empresariales',
      fit: 'cover',
      pos: 'center center',
      bg: '#37474f',
      heroFraction: 0.44
    },
    educacion: {
      src: BASE + 'educacion.png',
      alt: 'Educación y Capacitación',
      fit: 'cover',
      pos: 'center center',
      bg: '#1565c0',
      heroFraction: 0.44
    },
    comercio: {
      src: BASE + 'comercio.png',
      alt: 'Comercio, Tiendas y Distribución',
      fit: 'cover',
      pos: 'center center',
      bg: '#2e7d32',
      heroFraction: 0.44
    },
    profesionales: {
      src: BASE + 'profesionales.png',
      alt: 'Servicios Profesionales',
      fit: 'cover',
      pos: 'center center',
      bg: '#1a237e',
      heroFraction: 0.44
    },
    'bienes-raices': {
      src: BASE + 'bienes-raices.png',
      alt: 'Bienes Raíces',
      fit: 'cover',
      pos: 'center center',
      bg: '#00695c',
      heroFraction: 0.44
    },
    hogar: {
      src: BASE + 'hogar.png',
      alt: 'Hogar, Construcción y Mantenimiento',
      fit: 'cover',
      pos: 'center center',
      bg: '#5d4037',
      heroFraction: 0.44
    },
    salud: {
      src: BASE + 'salud.png',
      alt: 'Salud y Bienestar',
      fit: 'cover',
      pos: 'center center',
      bg: '#0277bd',
      heroFraction: 0.44
    },
    eventos: {
      src: BASE + 'eventos.png',
      alt: 'Eventos, Espectáculos y Fiestas',
      fit: 'cover',
      pos: 'center center',
      bg: '#6a1b9a',
      heroFraction: 0.44
    },
    automotriz: {
      src: BASE + 'automotriz.png',
      alt: 'Vehículos y Servicios Automotrices',
      fit: 'cover',
      pos: 'center center',
      bg: '#b71c1c',
      heroFraction: 0.44
    },
    tecnologia: {
      src: BASE + 'tecnologia.png',
      alt: 'Tecnología y Servicios Digitales',
      fit: 'cover',
      pos: 'center center',
      bg: '#006064',
      heroFraction: 0.44
    },
    restaurantes: {
      src: BASE + 'restaurantes.png',
      alt: 'Restaurantes, Alimentos y Servicios',
      fit: 'cover',
      pos: 'center center',
      bg: '#e65100',
      heroFraction: 0.44
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
