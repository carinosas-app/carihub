/**
 * Tarjetas visuales «Explora otras categorías» — imagen por sector.
 * Cada imagen enlaza al sector; al pulsar se elige el sector y se abre el selector de país.
 */
(function (global) {
  'use strict';

  var BASE = 'img/home/sector-cards/';

  var SECTOR_CARD_IMAGES = {
    bienestar: {
      src: BASE + 'bienestar.png',
      alt: 'Bienestar, Espiritualidad y Terapias Alternativas',
      fit: 'contain',
      pos: 'center top',
      bg: '#b8ddd4'
    },
    transporte: {
      src: BASE + 'transporte.png',
      alt: 'Transporte, Logística y Mensajería',
      fit: 'contain',
      pos: 'center top',
      bg: '#b5e8df'
    },
    mascotas: {
      src: BASE + 'mascotas.png',
      alt: 'Mascotas y Servicios Veterinarios',
      fit: 'contain',
      pos: 'center top',
      bg: '#d6ead8'
    },
    industria: {
      src: BASE + 'industria.png',
      alt: 'Industria y Servicios Empresariales',
      fit: 'contain',
      pos: 'center top',
      bg: '#f5e6d8'
    },
    educacion: {
      src: BASE + 'educacion.png',
      alt: 'Educación y Capacitación',
      fit: 'contain',
      pos: 'center top',
      bg: '#d8e4f0'
    },
    comercio: {
      src: BASE + 'comercio.png',
      alt: 'Comercio, Tiendas y Distribución',
      fit: 'contain',
      pos: 'center top',
      bg: '#e8dff5'
    },
    profesionales: {
      src: BASE + 'profesionales.png',
      alt: 'Servicios Profesionales',
      fit: 'contain',
      pos: 'center top',
      bg: '#d4e0f2'
    },
    'bienes-raices': {
      src: BASE + 'bienes-raices.png',
      alt: 'Bienes Raíces',
      fit: 'contain',
      pos: 'center top',
      bg: '#d4ead6'
    },
    hogar: {
      src: BASE + 'hogar.png',
      alt: 'Hogar, Construcción y Mantenimiento',
      fit: 'contain',
      pos: 'center top',
      bg: '#f5e8c8'
    },
    salud: {
      src: BASE + 'salud.png',
      alt: 'Salud y Bienestar',
      fit: 'contain',
      pos: 'center top',
      bg: '#f5d4e0'
    },
    eventos: {
      src: BASE + 'eventos.png',
      alt: 'Eventos, Espectáculos y Fiestas',
      fit: 'contain',
      pos: 'center top',
      bg: '#f8e4d0'
    },
    automotriz: {
      src: BASE + 'automotriz.png',
      alt: 'Vehículos y Servicios Automotrices',
      fit: 'contain',
      pos: 'center top',
      bg: '#d0dff5'
    },
    tecnologia: {
      src: BASE + 'tecnologia.png',
      alt: 'Tecnología y Servicios Digitales',
      fit: 'contain',
      pos: 'center top',
      bg: '#e4dcf5'
    },
    restaurantes: {
      src: BASE + 'restaurantes.png',
      alt: 'Restaurantes, Alimentos y Servicios',
      fit: 'contain',
      pos: 'center top',
      bg: '#f5e8d4'
    }
  };

  function getSectorCardImage(sectorId) {
    return SECTOR_CARD_IMAGES[String(sectorId || '')] || null;
  }

  function hasSectorCardImage(sectorId) {
    return !!getSectorCardImage(sectorId);
  }

  global.CariHubSectorCardImages = {
    BASE: BASE,
    SECTOR_CARD_IMAGES: SECTOR_CARD_IMAGES,
    getSectorCardImage: getSectorCardImage,
    hasSectorCardImage: hasSectorCardImage
  };
})(typeof window !== 'undefined' ? window : globalThis);
