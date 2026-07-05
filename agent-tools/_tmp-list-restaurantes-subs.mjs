import fs from 'fs';
const m = JSON.parse(fs.readFileSync('scripts/mapa-registro-categorias.json', 'utf8'));
const rows = (m.registro || m.subcategorias || m.items || Object.values(m).flat()).filter?.(Boolean) || [];
let list = [];
if (Array.isArray(m.registro)) list = m.registro;
else if (Array.isArray(m.subcategorias)) list = m.subcategorias;
else {
  const walk = (o) => {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') {
      if (o.sectorId === 'restaurantes' && o.subcategoriaId) list.push(o);
      Object.values(o).forEach(walk);
    }
  };
  walk(m);
}
list = list.filter((x) => x.sectorId === 'restaurantes');
console.log('TOTAL', list.length);
list.sort((a, b) => a.subcategoriaId.localeCompare(b.subcategoriaId));
list.forEach((x) => console.log([x.subcategoriaId, x.subcategoria, x.arquetipo, x.formularioId].join(' | ')));
