# Destellos por sector — 2026-07-03

## Qué se añadió

Sistema unificado de **destellos profesionales** con el color de cada categoría/sector.

| Pantalla | Adultos | Otros sectores | LGBT |
|----------|---------|----------------|------|
| **Resultados** | Pink sheen (rosa) | `carihub-page-sector-sparkles.css` | Arcoíris propio (ya existía) |
| **Registro perfil** | Pink sheen | Página + contenedor | — |
| **Home modal otros** | — | Contenedor mejorado | — |
| **Geo picker** | Rosa | Header + panel mejorado | — |

## Archivos nuevos

- `public/css/carihub-page-sector-sparkles.css` — destellos de página completa (`body::before` / `::after`)

## Archivos mejorados

- `public/css/carihub-sector-sparkles.css` — más brillo en estrellas de 4 puntas + barrido `::after`
- `public/js/carihub-sector-sparkles.js` — más puntos de destello (20), sync con `data-sector` en resultados
- `public/js/carihub-resultados-sector.js` — sincroniza color al aplicar tema

## Colores

- **Resultados:** `--ch-sector-spark-color` = `--res-accent` del sector (definido en `resultados.css`)
- **Registro / geo:** `--ch-sector-spark-color` por `data-rp-sector` en `carihub-sector-sparkles.css`

## URLs de prueba

```
http://localhost:8765/resultados.html?vista=con-resultados&categoria=restaurantes&pais=México
http://localhost:8765/resultados.html?vista=con-resultados&categoria=doctor&pais=México
http://localhost:8765/resultados.html?vista=con-resultados&categoria=escort%20gay&pais=México
http://localhost:8765/registro-perfil.html
```

Recargar con **Ctrl+F5**.
