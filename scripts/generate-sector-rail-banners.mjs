#!/usr/bin/env node
/**
 * Genera banners SVG temáticos para el rail central de categorías (800×200).
 * Uso: node scripts/generate-sector-rail-banners.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'img', 'home', 'banners');

/** @type {Array<{ id: string, subtitle: string, c0: string, c1: string, c2: string, decor: string }>} */
const SECTORS = [
  {
    id: 'bienestar',
    subtitle: 'Bienestar, espiritualidad y terapias alternativas',
    c0: '#7e57c2', c1: '#5e35b1', c2: '#4527a0',
    decor: `
      <circle cx="90" cy="100" r="52" fill="rgba(255,255,255,.08)"/>
      <path d="M90 58c8 18 14 28 22 36-14 2-24 8-32 18 10-2 20-2 32 2-8 10-18 16-32 18 8-8 14-18 22-36 8 18 14 28 22 36-14-2-24-8-32-18 10 2 20 2 32-2-8-10-18-16-32-18z" fill="rgba(255,255,255,.22)"/>
      <circle cx="710" cy="100" r="38" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="3"/>
      <circle cx="710" cy="100" r="24" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="2"/>
      <text x="710" y="108" text-anchor="middle" fill="rgba(255,255,255,.35)" font-size="28">☯</text>
    `
  },
  {
    id: 'eventos',
    subtitle: 'Eventos, espectáculos y fiestas',
    c0: '#ec407a', c1: '#ab47bc', c2: '#7b1fa2',
    decor: `
      <circle cx="78" cy="42" r="6" fill="rgba(255,255,255,.55)"/>
      <circle cx="118" cy="68" r="4" fill="rgba(255,255,255,.45)"/>
      <circle cx="62" cy="118" r="5" fill="rgba(255,255,255,.4)"/>
      <rect x="52" y="148" width="88" height="10" rx="5" fill="rgba(255,255,255,.15)"/>
      <path d="M56 148l12-28 16 20 14-32 18 40z" fill="rgba(255,255,255,.25)"/>
      <circle cx="720" cy="52" r="5" fill="#ffeb3b" opacity=".85"/>
      <circle cx="748" cy="78" r="4" fill="#69f0ae" opacity=".8"/>
      <circle cx="692" cy="92" r="4" fill="#40c4ff" opacity=".8"/>
      <path d="M680 130h120l-60 38z" fill="rgba(255,255,255,.2)"/>
      <circle cx="740" cy="118" r="14" fill="rgba(255,255,255,.12)"/>
    `
  },
  {
    id: 'restaurantes',
    subtitle: 'Restaurantes, gastronomía y bebidas',
    c0: '#ffb74d', c1: '#ef6c00', c2: '#e65100',
    decor: `
      <circle cx="88" cy="100" r="46" fill="rgba(255,255,255,.1)"/>
      <path d="M68 118c0-18 12-32 28-36-4 10-4 22 0 32-8-2-16 0-22 4 6-8 14-12 22-12-6 8-8 18-6 28-10-4-18-10-22-16z" fill="rgba(255,255,255,.28)"/>
      <ellipse cx="88" cy="138" rx="34" ry="8" fill="rgba(0,0,0,.12)"/>
      <path d="M708 72v56c0 8-6 14-14 14h-8c-8 0-14-6-14-14V72h36z" fill="rgba(255,255,255,.22)"/>
      <ellipse cx="690" cy="72" rx="18" ry="6" fill="rgba(255,255,255,.18)"/>
      <path d="M732 88c8 0 14 6 14 14v18c0 8-6 14-14 14h-6V88h6z" fill="rgba(255,255,255,.2)"/>
    `
  },
  {
    id: 'salud',
    subtitle: 'Salud y bienestar',
    c0: '#4fc3f7', c1: '#039be5', c2: '#0277bd',
    decor: `
      <rect x="68" y="78" width="44" height="44" rx="10" fill="rgba(255,255,255,.15)"/>
      <rect x="84" y="88" width="12" height="24" rx="2" fill="rgba(255,255,255,.75)"/>
      <rect x="78" y="94" width="24" height="12" rx="2" fill="rgba(255,255,255,.75)"/>
      <path d="M688 88c0-12 10-22 22-22s22 10 22 22v8c0 12-10 22-22 22h-8v28h-16v-28h-8c-12 0-22-10-22-22v-8z" fill="rgba(255,255,255,.2)"/>
      <circle cx="710" cy="88" r="10" fill="rgba(255,255,255,.35)"/>
    `
  },
  {
    id: 'profesionales',
    subtitle: 'Servicios profesionales',
    c0: '#5c6bc0', c1: '#3949ab', c2: '#283593',
    decor: `
      <rect x="58" y="92" width="64" height="44" rx="8" fill="rgba(255,255,255,.16)"/>
      <rect x="68" y="82" width="44" height="14" rx="4" fill="rgba(255,255,255,.22)"/>
      <circle cx="90" cy="114" r="8" fill="rgba(255,255,255,.35)"/>
      <path d="M688 78h48v12l-24 18-24-18V78z" fill="rgba(255,255,255,.22)"/>
      <rect x="700" y="108" width="24" height="28" rx="3" fill="rgba(255,255,255,.18)"/>
      <line x1="688" y1="148" x2="736" y2="148" stroke="rgba(255,255,255,.25)" stroke-width="4"/>
    `
  },
  {
    id: 'tecnologia',
    subtitle: 'Tecnología y servicios digitales',
    c0: '#26c6da', c1: '#00838f', c2: '#006064',
    decor: `
      <rect x="58" y="72" width="88" height="56" rx="8" fill="rgba(255,255,255,.14)"/>
      <rect x="66" y="80" width="72" height="40" rx="4" fill="rgba(0,0,0,.15)"/>
      <rect x="88" y="132" width="28" height="8" rx="2" fill="rgba(255,255,255,.2)"/>
      <circle cx="710" cy="100" r="34" fill="rgba(255,255,255,.1)"/>
      <path d="M694 100h32M710 84v32" stroke="rgba(255,255,255,.35)" stroke-width="3"/>
      <circle cx="694" cy="84" r="4" fill="#69f0ae" opacity=".9"/>
      <circle cx="726" cy="84" r="4" fill="#40c4ff" opacity=".9"/>
      <circle cx="694" cy="116" r="4" fill="#ffeb3b" opacity=".9"/>
      <circle cx="726" cy="116" r="4" fill="#ff7043" opacity=".9"/>
    `
  },
  {
    id: 'automotriz',
    subtitle: 'Vehículos y servicios automotrices',
    c0: '#ef5350', c1: '#c62828', c2: '#b71c1c',
    decor: `
      <path d="M52 118h96l12-28H64l-12 28z" fill="rgba(255,255,255,.22)"/>
      <circle cx="72" cy="118" r="12" fill="rgba(0,0,0,.25)"/>
      <circle cx="72" cy="118" r="6" fill="rgba(255,255,255,.35)"/>
      <circle cx="128" cy="118" r="12" fill="rgba(0,0,0,.25)"/>
      <circle cx="128" cy="118" r="6" fill="rgba(255,255,255,.35)"/>
      <path d="M668 118h96l12-28H680l-12 28z" fill="rgba(255,255,255,.18)"/>
      <circle cx="688" cy="118" r="12" fill="rgba(0,0,0,.22)"/>
      <circle cx="744" cy="118" r="12" fill="rgba(0,0,0,.22)"/>
    `
  },
  {
    id: 'transporte',
    subtitle: 'Transporte, logística y mensajería',
    c0: '#ffa726', c1: '#ef6c00', c2: '#e65100',
    decor: `
      <rect x="52" y="86" width="72" height="40" rx="6" fill="rgba(255,255,255,.2)"/>
      <rect x="124" y="98" width="28" height="28" rx="4" fill="rgba(255,255,255,.16)"/>
      <circle cx="68" cy="126" r="10" fill="rgba(0,0,0,.22)"/>
      <circle cx="132" cy="126" r="10" fill="rgba(0,0,0,.22)"/>
      <path d="M672 92h88l16 24v20H672V92z" fill="rgba(255,255,255,.18)"/>
      <rect x="688" y="78" width="48" height="18" rx="4" fill="rgba(255,255,255,.14)"/>
    `
  },
  {
    id: 'comercio',
    subtitle: 'Comercio, tiendas y distribución',
    c0: '#66bb6a', c1: '#388e3c', c2: '#2e7d32',
    decor: `
      <path d="M68 78l24-18 24 18v58H68V78z" fill="rgba(255,255,255,.18)"/>
      <rect x="82" y="96" width="20" height="28" rx="2" fill="rgba(255,255,255,.25)"/>
      <path d="M688 88c0-8 6-14 14-14h36c8 0 14 6 14 14v42H688V88z" fill="rgba(255,255,255,.2)"/>
      <path d="M688 88l32-16 32 16" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="3"/>
    `
  },
  {
    id: 'hogar',
    subtitle: 'Hogar, construcción y mantenimiento',
    c0: '#8d6e63', c1: '#6d4c41', c2: '#4e342e',
    decor: `
      <path d="M62 118l38-42 38 42H62z" fill="rgba(255,255,255,.22)"/>
      <rect x="78" y="96" width="24" height="22" rx="2" fill="rgba(255,255,255,.18)"/>
      <rect x="68" y="132" width="12" height="18" rx="2" fill="rgba(255,255,255,.25)"/>
      <path d="M688 132h56v16h-56z" fill="rgba(255,255,255,.2)"/>
      <path d="M712 132V92l-8 8-8-8v40" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="4"/>
    `
  },
  {
    id: 'mascotas',
    subtitle: 'Mascotas y servicios veterinarios',
    c0: '#ba68c8', c1: '#8e24aa', c2: '#6a1b9a',
    decor: `
      <ellipse cx="82" cy="108" rx="22" ry="18" fill="rgba(255,255,255,.2)"/>
      <circle cx="62" cy="82" r="10" fill="rgba(255,255,255,.22)"/>
      <circle cx="102" cy="82" r="10" fill="rgba(255,255,255,.22)"/>
      <circle cx="72" cy="132" r="8" fill="rgba(255,255,255,.18)"/>
      <circle cx="92" cy="132" r="8" fill="rgba(255,255,255,.18)"/>
      <path d="M708 92c12 0 22 10 22 22s-10 22-22 22-22-10-22-22 10-22 22-22z" fill="rgba(255,255,255,.15)"/>
      <circle cx="698" cy="108" r="4" fill="rgba(255,255,255,.5)"/>
      <circle cx="718" cy="108" r="4" fill="rgba(255,255,255,.5)"/>
      <path d="M704 122c8 6 16 6 24 0" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="3"/>
    `
  },
  {
    id: 'bienes-raices',
    subtitle: 'Bienes raíces',
    c0: '#26a69a', c1: '#00897b', c2: '#00695c',
    decor: `
      <path d="M62 118l38-44 38 44H62z" fill="rgba(255,255,255,.22)"/>
      <rect x="78" y="98" width="22" height="20" rx="2" fill="rgba(255,255,255,.16)"/>
      <circle cx="710" cy="108" r="28" fill="rgba(255,255,255,.12)"/>
      <path d="M698 108h24M710 96v24" stroke="rgba(255,255,255,.35)" stroke-width="4"/>
      <circle cx="710" cy="148" r="6" fill="rgba(255,255,255,.25)"/>
    `
  },
  {
    id: 'educacion',
    subtitle: 'Educación y capacitación',
    c0: '#42a5f5', c1: '#1e88e5', c2: '#1565c0',
    decor: `
      <path d="M62 108l38-22 38 22-38 22-38-22z" fill="rgba(255,255,255,.22)"/>
      <path d="M100 130v18l-38-12v-18" fill="rgba(255,255,255,.14)"/>
      <path d="M100 130v18l38-12v-18" fill="rgba(255,255,255,.14)"/>
      <rect x="688" y="88" width="48" height="36" rx="4" fill="rgba(255,255,255,.18)"/>
      <rect x="696" y="96" width="32" height="4" rx="1" fill="rgba(255,255,255,.35)"/>
      <rect x="696" y="106" width="24" height="4" rx="1" fill="rgba(255,255,255,.28)"/>
    `
  },
  {
    id: 'industria',
    subtitle: 'Industria y servicios empresariales',
    c0: '#78909c', c1: '#546e7a', c2: '#37474f',
    decor: `
      <rect x="58" y="82" width="18" height="58" fill="rgba(255,255,255,.18)"/>
      <rect x="82" y="68" width="18" height="72" fill="rgba(255,255,255,.22)"/>
      <rect x="106" y="92" width="18" height="48" fill="rgba(255,255,255,.16)"/>
      <circle cx="710" cy="108" r="34" fill="rgba(255,255,255,.1)"/>
      <path d="M692 108h36M710 90v36" stroke="rgba(255,255,255,.3)" stroke-width="4"/>
      <circle cx="692" cy="90" r="5" fill="rgba(255,255,255,.35)"/>
      <circle cx="728" cy="90" r="5" fill="rgba(255,255,255,.35)"/>
    `
  }
];

function escXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSvg(sector) {
  const gid = `bg-${sector.id}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewBox="0 0 800 200" role="img" aria-label="Anúnciate aquí — ${escXml(sector.subtitle)}">
  <defs>
    <linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${sector.c0}"/>
      <stop offset="52%" stop-color="${sector.c1}"/>
      <stop offset="100%" stop-color="${sector.c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="200" fill="url(#${gid})"/>
  ${sector.decor}
  <text x="400" y="82" text-anchor="middle" fill="#fff" font-family="Segoe UI, system-ui, sans-serif" font-size="34" font-weight="800" letter-spacing=".02em">Anúnciate aquí</text>
  <text x="400" y="118" text-anchor="middle" fill="rgba(255,255,255,.92)" font-family="Segoe UI, system-ui, sans-serif" font-size="16" font-weight="600">${escXml(sector.subtitle)}</text>
  <text x="400" y="148" text-anchor="middle" fill="rgba(255,255,255,.72)" font-family="Segoe UI, system-ui, sans-serif" font-size="12" font-weight="500">Renta espacio en el directorio CariHub</text>
</svg>
`;
}

mkdirSync(OUT_DIR, { recursive: true });

for (const sector of SECTORS) {
  const file = join(OUT_DIR, `ad-banner-${sector.id}-01.svg`);
  writeFileSync(file, buildSvg(sector), 'utf8');
  console.log('wrote', file.replace(/\\/g, '/'));
}

console.log(`\nDone: ${SECTORS.length} sector rail banners.`);
