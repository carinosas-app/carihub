import fs from 'fs';
import path from 'path';
import { JS_ROOT } from './vm-context.mjs';
import { slugSubId } from './slug.mjs';

export function loadSchemaIndex(ctx) {
  if (ctx.CARIHUB_REGISTRO_SCHEMA_INDEX) {
    return ctx.CARIHUB_REGISTRO_SCHEMA_INDEX;
  }
  const raw = fs.readFileSync(path.join(JS_ROOT, 'data/registro-schema-index.js'), 'utf8');
  const json = raw.replace(/^window\.CARIHUB_REGISTRO_SCHEMA_INDEX\s*=\s*/, '').replace(/;\s*$/, '');
  return JSON.parse(json);
}

export function listSubcategorias(index, filter = {}) {
  const byId = index.byId || {};
  let entries = Object.values(byId);
  if (filter.sectorId) {
    entries = entries.filter((e) => e.sectorId === filter.sectorId);
  }
  if (filter.subcategoriaId) {
    const want = slugSubId(filter.subcategoriaId);
    entries = entries.filter((e) => slugSubId(e.subcategoriaId) === want);
  }
  return entries.sort((a, b) =>
    String(a.sectorId).localeCompare(String(b.sectorId)) ||
    String(a.subcategoriaId).localeCompare(String(b.subcategoriaId))
  );
}

export function ctxFromSchemaEntry(entry) {
  return {
    sectorId: entry.sectorId || '',
    subcategoriaId: entry.subcategoriaId || '',
    subcategoria: entry.subcategoria || entry.subcategoriaId || '',
    categoriaPrincipal: entry.categoriaPrincipal || '',
    formularioId: entry.formularioId || '',
    arquetipo: entry.arquetipo || '',
    tipoPerfil: entry.tipoPerfil || '',
  };
}

export function schemaResolvedFromEntry(entry) {
  return {
    identidad: {
      arquetipo: entry.arquetipo || '',
      tipoPerfil: entry.tipoPerfil || '',
      formularioId: entry.formularioId || '',
    },
  };
}
