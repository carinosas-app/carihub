# Detalle técnico — Resultados visual 2026-07-03

## 1. Tema LGBT (`data-subtema="lgbt"`)

**Activación:** subcategorías en `LGBT_SUBCATEGORIAS` dentro de `carihub-resultados-sector.js`:
- escort gay, trans, femboy, lesbians, tom boy, tom fem, antro restaurant bar lgbt

**Comportamiento:**
- `body[data-subtema="lgbt"]` — paleta arcoíris fuerte en `--lgbt-warm-*`
- Sheen rosa (`CariHubPinkSheen`) **desactivado** para LGBT
- Capas `.res-shell`, `.res-scroll`, etc. con `background: transparent` para ver el fondo del body

**Colores base:**

| Color | Hex |
|-------|-----|
| Rojo | `#ef3b3b` |
| Naranja | `#ff8a1e` |
| Amarillo | `#ffd21e` |
| Verde | `#29b563` |
| Azul | `#2b7fe0` |
| Morado | `#8f39c9` |

## 2. Destellos LGBT

Capas CSS en `body[data-subtema="lgbt"]::before` y `::after`:
- `::before` — puntos de luz multicolor (`lgbtSparkDrift`)
- `::after` — barrido de brillo + bokeh (`lgbtShineSweep`, `lgbtSparkTwinkle`)
- `#fitOuter { z-index: 1 }` — contenido por encima, clics no bloqueados
- `prefers-reduced-motion` — animaciones desactivadas

## 3. Banners por subcategoría

**Prioridad en `bannersDeSector(cat)`:**

1. `SUBCAT_BANNERS[subcategoriaId]` — negocio adulto con foto propia
2. `LGBT_BANNERS` — personas LGBT (3 PNG rotativos)
3. `SECTOR_BANNER[sector]` — otros sectores
4. `null` — adultos escort estándar (placeholders rosa)

**Rotación:** `banner-resultados-principales.js` desplaza el índice inicial por slot (izq=0, centro=1, der=2).

## 4. Colabora en redes (fila dorada)

**Política:** `CARIHUB_COLABORACION_CONTENIDO_POLICY` en `registro-sector-policy-runtime.js`

**Render:** `colaboracionContenidoRowHTML(u)` en `carihub-public-render-lite.js`

**Ubicación en tarjeta** (`cardShell`):
```
identity → commerce → desc → attrs → context (ubicación) → COLAB → trust (badges) → Ver perfil
```

**Valores mostrados:**

| `colaboracionContenido` | Texto valor |
|-------------------------|-------------|
| Sí | Sí |
| Bajo acuerdo previo | A convenir |

Solo visible si `mostrarColaboracionContenidoPublico` es «Sí» (o vacío por defecto).

**Clases CSS:**
- `.res-card__colab` — contenedor dorado
- `.res-card__colab-valor--si` — verde oliva para «Sí»
- `.res-card__colab-valor--acuerdo` — dorado/itálica para «A convenir»

## 5. Anti-contaminación demo

`esBusquedaAdulta()` en `resultados-demo.js` solo usa pool escort cuando:
- `pres.esAdultoPersona === true`, o
- `componenteResultados === 'ResultCardAdultos'`

Negocios adultos (hotel, spa, etc.) usan su demo de negocio.

## 6. Layout adaptativo tarjetas

`resCardLimits(n)` en `resultados.html` — altura mínima de tarjeta garantiza filas visibles (ubicación, colab, badges).
