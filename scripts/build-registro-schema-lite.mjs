/**
 * Genera índice compacto subcategoriaId → mapa row para FieldEngine lite (browser).
 * Uso: node scripts/build-registro-schema-lite.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const mapa = JSON.parse(fs.readFileSync(path.join(root, 'scripts/mapa-registro-categorias.json'), 'utf8'));

const index = {};
mapa.matrix.forEach(function (row) {
  index[row.subcategoriaId] = {
    subcategoriaId: row.subcategoriaId,
    subcategoria: row.subcategoria,
    sectorId: row.sectorId,
    categoriaPrincipal: row.categoriaPrincipal,
    formularioId: row.formularioId,
    arquetipo: row.arquetipo,
    tipoPerfil: row.tipoPerfil,
    componenteResultados: row.componenteResultados,
    componentePerfil: row.componentePerfil,
    fotos: row.fotos,
    publico: row.publico || ''
  };
});

const outDir = path.join(root, 'public/js/data');
fs.mkdirSync(outDir, { recursive: true });
const jsonPath = path.join(outDir, 'registro-schema-index.json');
fs.writeFileSync(jsonPath, JSON.stringify({ version: '2026-06-10', total: Object.keys(index).length, byId: index }));

const jsPath = path.join(outDir, 'registro-schema-index.js');
fs.writeFileSync(
  jsPath,
  'window.CARIHUB_REGISTRO_SCHEMA_INDEX=' + JSON.stringify({ version: '2026-06-10', total: Object.keys(index).length, byId: index }) + ';\n'
);

console.log('Wrote', jsonPath, 'and', jsPath, '(' + Object.keys(index).length + ' subcategorías)');
