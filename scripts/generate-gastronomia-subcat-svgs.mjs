/**
 * Genera SVG temáticos únicos por subcategoría gastronomía (24 canon).
 * Salida: public/img/registro-subcats/gastronomia/gast-NN-slug.svg
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../public/img/registro-subcats/gastronomia');

const SUBS = [
  { n: '01', slug: 'restaurante-tradicional', title: 'Restaurante', sub: 'Cocina tradicional', icon: '🍽️', c1: '#ff8f00', c2: '#e65100' },
  { n: '02', slug: 'marisqueria', title: 'Marisquería', sub: 'Del mar', icon: '🦐', c1: '#0288d1', c2: '#01579b' },
  { n: '03', slug: 'cocina-economica', title: 'Comida corrida', sub: 'Menú del día', icon: '🍲', c1: '#fb8c00', c2: '#ef6c00' },
  { n: '04', slug: 'taqueria', title: 'Taquería', sub: 'Tacos al momento', icon: '🌮', c1: '#f4511e', c2: '#bf360c' },
  { n: '05', slug: 'hamburgueseria', title: 'Hamburguesas', sub: 'Smash & combos', icon: '🍔', c1: '#ff7043', c2: '#d84315' },
  { n: '06', slug: 'pizzeria', title: 'Pizzería', sub: 'Horno artesanal', icon: '🍕', c1: '#ff5722', c2: '#bf360c' },
  { n: '07', slug: 'polleria-alitas', title: 'Pollería', sub: 'Alitas y combos', icon: '🍗', c1: '#ffa726', c2: '#ef6c00' },
  { n: '08', slug: 'sushi-asiatico', title: 'Sushi', sub: 'Cocina asiática', icon: '🍣', c1: '#e53935', c2: '#b71c1c' },
  { n: '09', slug: 'parrilla', title: 'Parrilla', sub: 'Carnes asadas', icon: '🥩', c1: '#8d6e63', c2: '#4e342e' },
  { n: '10', slug: 'cafeteria', title: 'Cafetería', sub: 'Café de especialidad', icon: '☕', c1: '#6d4c41', c2: '#3e2723' },
  { n: '11', slug: 'panaderia', title: 'Panadería', sub: 'Pan artesanal', icon: '🥖', c1: '#ffb74d', c2: '#f57c00' },
  { n: '12', slug: 'pasteleria', title: 'Pastelería', sub: 'Repostería fina', icon: '🎂', c1: '#f48fb1', c2: '#c2185b' },
  { n: '13', slug: 'neveria', title: 'Nevería', sub: 'Helados y nieves', icon: '🍦', c1: '#81d4fa', c2: '#0288d1' },
  { n: '14', slug: 'jugueria', title: 'Juguería', sub: 'Jugos y smoothies', icon: '🥤', c1: '#aed581', c2: '#689f38' },
  { n: '15', slug: 'food-truck', title: 'Food Truck', sub: 'Cocina móvil', icon: '🚚', c1: '#ff9800', c2: '#e65100' },
  { n: '16', slug: 'comida-domicilio', title: 'A domicilio', sub: 'Entrega preparada', icon: '🛵', c1: '#ff7043', c2: '#d84315' },
  { n: '17', slug: 'dark-kitchen', title: 'Dark Kitchen', sub: 'Solo delivery', icon: '📦', c1: '#455a64', c2: '#263238' },
  { n: '18', slug: 'bar', title: 'Bar', sub: 'Bebidas y botanas', icon: '🍸', c1: '#7b1fa2', c2: '#4a148c' },
  { n: '19', slug: 'cerveceria', title: 'Cervecería', sub: 'Cerveza artesanal', icon: '🍺', c1: '#ffb300', c2: '#ff8f00' },
  { n: '20', slug: 'cantina-vinoteca', title: 'Cantina', sub: 'Vinos y tradición', icon: '🍷', c1: '#8e24aa', c2: '#6a1b9a' },
  { n: '21', slug: 'buffet-comedor', title: 'Buffet', sub: 'Comedor por kilo', icon: '🍱', c1: '#ffa000', c2: '#ff6f00' },
  { n: '22', slug: 'chef-domicilio', title: 'Chef', sub: 'Experiencia en casa', icon: '👨‍🍳', c1: '#ff8f00', c2: '#e65100' },
  { n: '23', slug: 'bartender', title: 'Bartender', sub: 'Barra móvil', icon: '🍹', c1: '#ec407a', c2: '#ad1457' },
  { n: '24', slug: 'distribuidora-b2b', title: 'Distribuidora', sub: 'Mayoreo alimentos', icon: '🏭', c1: '#546e7a', c2: '#37474f' }
];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function svgCard(sub) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" role="img" aria-label="${esc(sub.title)}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${sub.c1}"/>
      <stop offset="100%" stop-color="${sub.c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" rx="28" fill="url(#bg)"/>
  <rect width="400" height="400" rx="28" fill="url(#glow)"/>
  <circle cx="200" cy="148" r="72" fill="rgba(255,255,255,0.18)"/>
  <text x="200" y="168" text-anchor="middle" font-size="72">${sub.icon}</text>
  <text x="200" y="268" text-anchor="middle" fill="#fff" font-family="Segoe UI, system-ui, sans-serif" font-size="28" font-weight="800">${esc(sub.title)}</text>
  <text x="200" y="302" text-anchor="middle" fill="rgba(255,255,255,0.88)" font-family="Segoe UI, system-ui, sans-serif" font-size="16" font-weight="600">${esc(sub.sub)}</text>
</svg>`;
}

function adBannerSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewBox="0 0 800 200" role="img" aria-label="Anúnciate aquí — gastronomía">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffb74d"/>
      <stop offset="50%" stop-color="#ef6c00"/>
      <stop offset="100%" stop-color="#e65100"/>
    </linearGradient>
  </defs>
  <rect width="800" height="200" fill="url(#bg)"/>
  <text x="400" y="88" text-anchor="middle" fill="#fff" font-family="Segoe UI, system-ui, sans-serif" font-size="36" font-weight="800">Anúnciate aquí</text>
  <text x="400" y="128" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Segoe UI, system-ui, sans-serif" font-size="18" font-weight="600">Restaurantes, gastronomía y bebidas</text>
  <text x="400" y="162" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-family="Segoe UI, system-ui, sans-serif" font-size="14">Renta espacio en el directorio CariHub</text>
</svg>`;
}

fs.mkdirSync(OUT, { recursive: true });

const ID_MAP = {
  'restaurantes-tradicional': '01-restaurante-tradicional',
  'marisquerias': '02-marisqueria',
  'cocina-economica': '03-cocina-economica',
  'taquerias': '04-taqueria',
  'hamburgueserias': '05-hamburgueseria',
  'pizzerias': '06-pizzeria',
  'polleryas-alitas': '07-polleria-alitas',
  'sushi-cocina-asiatica': '08-sushi-asiatico',
  'carnes-asadas-parrilla': '09-parrilla',
  'cafeterias': '10-cafeteria',
  'panaderias': '11-panaderia',
  'pastelerias-reposteria': '12-pasteleria',
  'neverias-heladerias': '13-neveria',
  'juguerias': '14-jugueria',
  'food-trucks-gastronomia': '15-food-truck',
  'comida-a-domicilio': '16-comida-domicilio',
  'dark-kitchen': '17-dark-kitchen',
  'bares': '18-bar',
  'cervecerias': '19-cerveceria',
  'cantinas-vinotecas': '20-cantina-vinoteca',
  'buffet-comedor': '21-buffet-comedor',
  'chef-cocinero-domicilio': '22-chef-domicilio',
  'bartender-servicio': '23-bartender',
  'distribuidoras-alimentos-bebidas': '24-distribuidora-b2b'
};

for (const sub of SUBS) {
  const file = `gast-${sub.n}-${sub.slug}.svg`;
  fs.writeFileSync(path.join(OUT, file), svgCard(sub), 'utf8');
  console.log('wrote', file);
}

fs.writeFileSync(
  path.join(__dirname, '../public/img/home/banners/ad-banner-gastronomia-01.svg'),
  adBannerSvg(),
  'utf8'
);
console.log('wrote ad-banner-gastronomia-01.svg');
console.log('ID_MAP entries:', Object.keys(ID_MAP).length);
