/**
 * Tarjetas visuales «Explora otras categorías» — imagen por sector.
 * Cada imagen enlaza al sector; al pulsar se elige el sector y se abre el selector de país.
 */
(function (global) {
  'use strict';

  var BASE = 'img/home/sector-cards/';

  var SECTOR_CARD_IMAGES = {
    adultos: {
      src: 'img/home/sectores-card/01-adultos.png',
      alt: 'Adultos y Entretenimiento',
      fit: 'contain',
      pos: 'center center',
      bg: '#1a0818'
    },
    bienestar: {
      src: BASE + 'bienestar.png',
      alt: 'Bienestar, Espiritualidad y Terapias Alternativas',
      fit: 'contain',
      pos: 'center top',
      bg: '#b8ddd4',
      heroFraction: 0.44
    },
    transporte: {
      src: BASE + 'transporte.png',
      alt: 'Transporte, Logística y Mensajería',
      fit: 'contain',
      pos: 'center top',
      bg: '#b5e8df',
      heroFraction: 0.44
    },
    mascotas: {
      src: BASE + 'mascotas.png',
      alt: 'Mascotas y Servicios Veterinarios',
      fit: 'contain',
      pos: 'center top',
      bg: '#d6ead8',
      heroFraction: 0.44
    },
    industria: {
      src: BASE + 'industria.png',
      alt: 'Industria y Servicios Empresariales',
      fit: 'contain',
      pos: 'center top',
      bg: '#f5e6d8',
      heroFraction: 0.44
    },
    educacion: {
      src: BASE + 'educacion.png',
      alt: 'Educación y Capacitación',
      fit: 'contain',
      pos: 'center top',
      bg: '#d8e4f0',
      heroFraction: 0.44
    },
    comercio: {
      src: BASE + 'comercio.png',
      alt: 'Comercio, Tiendas y Distribución',
      fit: 'contain',
      pos: 'center top',
      bg: '#e8dff5',
      heroFraction: 0.44
    },
    profesionales: {
      src: BASE + 'profesionales.png',
      alt: 'Servicios Profesionales',
      fit: 'contain',
      pos: 'center top',
      bg: '#d4e0f2',
      heroFraction: 0.44
    },
    'bienes-raices': {
      src: BASE + 'bienes-raices.png',
      alt: 'Bienes Raíces',
      fit: 'contain',
      pos: 'center top',
      bg: '#d4ead6',
      heroFraction: 0.44
    },
    hogar: {
      src: BASE + 'hogar.png',
      alt: 'Hogar, Construcción y Mantenimiento',
      fit: 'contain',
      pos: 'center top',
      bg: '#f5e8c8',
      heroFraction: 0.44
    },
    salud: {
      src: BASE + 'salud.png',
      alt: 'Salud y Bienestar',
      fit: 'contain',
      pos: 'center top',
      bg: '#f5d4e0',
      heroFraction: 0.44
    },
    eventos: {
      src: BASE + 'eventos.png',
      alt: 'Eventos, Espectáculos y Fiestas',
      fit: 'contain',
      pos: 'center top',
      bg: '#f8e4d0',
      heroFraction: 0.44
    },
    automotriz: {
      src: BASE + 'automotriz.png',
      alt: 'Vehículos y Servicios Automotrices',
      fit: 'contain',
      pos: 'center top',
      bg: '#d0dff5',
      heroFraction: 0.44
    },
    tecnologia: {
      src: BASE + 'tecnologia.png',
      alt: 'Tecnología y Servicios Digitales',
      fit: 'contain',
      pos: 'center top',
      bg: '#e4dcf5',
      heroFraction: 0.44
    },
    restaurantes: {
      src: BASE + 'restaurantes.png',
      alt: 'Restaurantes, Alimentos y Servicios',
      fit: 'contain',
      pos: 'center top',
      bg: '#f5e8d4',
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
