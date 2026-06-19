#!/usr/bin/env node
/** Genera banderas SVG locales en public/img/flags/ */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'img', 'flags');

const flags = {
  mx: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="300" height="600" fill="#006847"/><rect x="300" width="300" height="600" fill="#fff"/><rect x="600" width="300" height="600" fill="#ce1126"/><ellipse cx="450" cy="300" rx="78" ry="78" fill="#8B4513"/><ellipse cx="450" cy="300" rx="62" ry="62" fill="#fff"/><ellipse cx="450" cy="300" rx="48" ry="48" fill="#6D4C1A"/></svg>`,
  us: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1900 1000"><rect width="1900" height="1000" fill="#B22234"/><g fill="#fff"><rect y="77" width="1900" height="77"/><rect y="231" width="1900" height="77"/><rect y="385" width="1900" height="77"/><rect y="539" width="1900" height="77"/><rect y="693" width="1900" height="77"/><rect y="847" width="1900" height="77"/></g><rect width="760" height="539" fill="#3C3B6E"/></svg>`,
  co: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="300" fill="#FCD116"/><rect y="300" width="900" height="150" fill="#003893"/><rect y="450" width="900" height="150" fill="#CE1126"/></svg>`,
  ca: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500"><rect width="1000" height="500" fill="#fff"/><rect width="250" height="500" fill="#D80621"/><rect x="750" width="250" height="500" fill="#D80621"/><path d="M500 130 L530 220 H620 L545 275 L570 365 L500 315 L430 365 L455 275 L380 220 H470 Z" fill="#D80621"/></svg>`,
  es: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#AA151B"/><rect y="150" width="900" height="300" fill="#F1BF00"/></svg>`,
  pe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="300" height="600" fill="#D91023"/><rect x="300" width="300" height="600" fill="#fff"/><rect x="600" width="300" height="600" fill="#D91023"/></svg>`,
  cl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="300" fill="#fff"/><rect y="300" width="900" height="300" fill="#D52B1E"/><rect width="300" height="300" fill="#0039A6"/><polygon points="150,60 165,105 212,105 174,132 189,177 150,150 111,177 126,132 88,105 135,105" fill="#fff"/></svg>`,
  ar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="200" fill="#74ACDF"/><rect y="200" width="900" height="200" fill="#fff"/><rect y="400" width="900" height="200" fill="#74ACDF"/><circle cx="450" cy="300" r="60" fill="#F6B40E"/></svg>`,
  br: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700"><rect width="1000" height="700" fill="#009B3A"/><polygon points="500,80 920,350 500,620 80,350" fill="#FEDF00"/><circle cx="500" cy="350" r="140" fill="#002776"/></svg>`,
  gb: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#012169"/><path d="M0,0 L1200,600 M1200,0 L0,600" stroke="#fff" stroke-width="120"/><path d="M0,0 L1200,600 M1200,0 L0,600" stroke="#C8102E" stroke-width="60"/><path d="M600,0 V600 M0,300 H1200" stroke="#fff" stroke-width="200"/><path d="M600,0 V600 M0,300 H1200" stroke="#C8102E" stroke-width="120"/></svg>`,
  au: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#012169"/><g fill="#fff"><polygon points="120,80 135,125 182,125 144,152 159,197 120,170 81,197 96,152 58,125 105,125"/></g><rect width="600" height="300" fill="#012169"/></svg>`,
  fr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="300" height="600" fill="#002395"/><rect x="300" width="300" height="600" fill="#fff"/><rect x="600" width="300" height="600" fill="#ED2939"/></svg>`,
  de: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="200" fill="#000"/><rect y="200" width="900" height="200" fill="#DD0000"/><rect y="400" width="900" height="200" fill="#FFCE00"/></svg>`,
  it: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="300" height="600" fill="#009246"/><rect x="300" width="300" height="600" fill="#fff"/><rect x="600" width="300" height="600" fill="#CE2B37"/></svg>`,
  pt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="360" height="600" fill="#006600"/><rect x="360" width="540" height="600" fill="#FF0000"/><circle cx="360" cy="300" r="110" fill="#FFD700" stroke="#fff" stroke-width="8"/></svg>`,
  ve: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="200" fill="#FFCC00"/><rect y="200" width="900" height="200" fill="#00247D"/><rect y="400" width="900" height="200" fill="#CF142B"/><polygon points="450,250 470,310 532,310 482,345 500,405 450,370 400,405 418,345 368,310 430,310" fill="#fff"/></svg>`,
  ec: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="300" fill="#FFD100"/><rect y="300" width="900" height="150" fill="#034EA2"/><rect y="450" width="900" height="150" fill="#ED1C24"/></svg>`,
  uy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#fff"/><g fill="#0038A8"><rect width="900" height="67"/><rect y="133" width="900" height="67"/><rect y="267" width="900" height="67"/><rect y="400" width="900" height="67"/><rect y="533" width="900" height="67"/></g><rect width="360" height="360" fill="#fff"/></svg>`,
  py: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="200" fill="#D52B1E"/><rect y="200" width="900" height="200" fill="#fff"/><rect y="400" width="900" height="200" fill="#0038A8"/></svg>`,
  bo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="200" fill="#D52B1E"/><rect y="200" width="900" height="200" fill="#F9E300"/><rect y="400" width="900" height="200" fill="#007A33"/></svg>`,
  pa: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="450" height="300" fill="#fff"/><rect y="300" width="450" height="300" fill="#fff"/><rect x="450" width="450" height="300" fill="#DA121A"/><rect x="450" y="300" width="450" height="300" fill="#072357"/><polygon points="225,150 245,210 307,210 257,245 275,305 225,270 175,305 193,245 143,210 205,210" fill="#072357"/></svg>`,
  cr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="120" fill="#002B7F"/><rect y="120" width="900" height="120" fill="#fff"/><rect y="240" width="900" height="120" fill="#CE1126"/><rect y="360" width="900" height="120" fill="#fff"/><rect y="480" width="900" height="120" fill="#002B7F"/></svg>`,
  gt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="400" fill="#4997D0"/><rect y="400" width="900" height="200" fill="#fff"/></svg>`,
  cu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#002A8F"/><polygon points="0,0 450,300 0,600" fill="#fff"/><polygon points="0,0 380,300 0,600" fill="#CF142B"/><polygon points="180,300 210,240 275,240 222,200 242,135 180,175 118,135 138,200 85,240 150,240" fill="#fff"/></svg>`,
  do: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#002D62"/><rect width="900" height="300" fill="#fff"/><rect y="300" width="900" height="300" fill="#CE1126"/><rect width="450" height="600" fill="#002D62"/></svg>`,
  pr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#fff"/><rect y="0" width="900" height="300" fill="#ED1C24"/><rect y="300" width="900" height="300" fill="#fff"/><polygon points="450,220 470,280 532,280 482,315 500,375 450,340 400,375 418,315 368,280 430,280" fill="#0050F0"/></svg>`
};

fs.mkdirSync(outDir, { recursive: true });
for (const [iso, svg] of Object.entries(flags)) {
  fs.writeFileSync(path.join(outDir, iso + '.svg'), svg.trim(), 'utf8');
  console.log('flag', iso + '.svg');
}
