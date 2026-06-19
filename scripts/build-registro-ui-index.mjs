#!/usr/bin/env node
/**
 * Genera public/js/data/registro-ui-index.js desde MATRIZ-FORMULARIO-UI-REGISTRO.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const matrix = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'MATRIZ-FORMULARIO-UI-REGISTRO.json'), 'utf8')
);

const bySubcategoriaId = {};
for (const a of matrix.asignaciones) {
  bySubcategoriaId[a.subcategoriaId] = a.formularioUiId;
}

const catalogo = {};
for (const c of matrix.catalogoUi) {
  catalogo[c.formularioUiId] = {
    titulo: c.titulo,
    formularioSchemaId: c.formularioSchemaId,
    arquetipo: c.arquetipo,
    sectorCluster: c.sectorCluster || null,
    publicoUi: c.publicoUi || {}
  };
}

const payload = {
  version: matrix.version,
  total: matrix.resumen.totalSubcategorias,
  formulariosUi: matrix.resumen.totalFormularioUi,
  bySubcategoriaId,
  catalogo
};

const outPath = path.join(root, 'public/js/data/registro-ui-index.js');
const js =
  'window.CARIHUB_REGISTRO_UI_INDEX=' +
  JSON.stringify(payload) +
  ';\n';

fs.writeFileSync(outPath, js);
console.log('Written', outPath, '-', Object.keys(bySubcategoriaId).length, 'subs,', Object.keys(catalogo).length, 'UI forms');
