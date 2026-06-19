/**
 * Genera JPEG ligeros para tarjetas de registro-perfil (móvil).
 * Uso: node scripts/generate-registro-perfil-thumbs.mjs
 */
import { readdir, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcDir = join(root, 'public/img/home/sectores');
const outDir = join(srcDir, 'mob');
const WIDTH = 160;
const QUALITY = 72;

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Instala sharp: npm install --no-save sharp');
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
const files = (await readdir(srcDir)).filter(function (f) {
  return f.endsWith('.png') && (f.startsWith('sector-') || f.startsWith('adultos-rotate-'));
});

for (const file of files) {
  const outName = file.replace(/\.png$/i, '.jpg');
  const outPath = join(outDir, outName);
  await sharp(join(srcDir, file))
    .resize({ width: WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outPath);
  console.log('OK', outName);
}

console.log('Generadas', files.length, 'miniaturas en public/img/home/sectores/mob/');
