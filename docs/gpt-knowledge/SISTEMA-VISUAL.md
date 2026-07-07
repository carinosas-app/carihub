# Sistema visual — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

Identidad visual unificada: tokens CSS, temas por sector, fondos premium adulto, sparkles LGBT, componentes compartidos entre Perfil, Resultados, Home, Registro y Dashboard.

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `docs/SISTEMA-VISUAL-CARIHUB.md` | Estrategia v1.0.0 (canónica) |
| `public/css/carihub-premium-theme.css` | Tokens `--ch-*` |
| `public/css/carihub-pink-sheen.css` | Fondo rosa + import adult-pro |
| `public/css/carihub-adult-pro-background.css` | Fondo pro adulto (fucsia, destellos) |
| `public/css/carihub-sector-pro-background.css` | Fondos sectores no adultos |
| `public/css/carihub-page-sector-sparkles.css` | Sparkles página |
| `public/js/carihub-sector-sparkles.js` | Lógica destellos |
| `public/css/resultados.css` | `--res-page-bg`, `data-sector` |
| `public/css/perfil-sector-visual.css` | Tema sector en perfil |
| `public/js/carihub-perfil-sector-visual.js` | Sync tema perfil |
| `public/js/carihub-resultados-sector.js` | `body[data-sector]` |
| `public/css/registro-perfil.css` | Registro visual |
| `public/css/dashboard-rentero-pro.css` | Dashboard pro |
| `public/fonts/fonts.css` | Poppins + Dancing Script |
| `docs/cambios/2026-07-03-resultados-visual/` | Changelog visual resultados |

---

## Flujo funcional

1. Resolver sector desde categoría (`carihub-resultados-sector.js` / schema-index)
2. Aplicar `body[data-sector="salud"]` (etc.) o `data-subtema="lgbt"`
3. Variables CSS cambian fondo (`--res-page-bg`, `--adult-pro-page-bg`)
4. Sparkles opcionales por sector
5. Banners sectoriales `ad-banner-{sector}-01.png`
6. Componentes compartidos: `.wrap`, `.pcard`, `.pbrand`, `.modchip` (Perfil/Resultados)

**Exclusión LGBT:** tema `data-subtema="lgbt"` no usa fondo adult-pro genérico.

---

## Dependencias

- Assets `public/img/home/banners/`, `public/img/home/sector-cards/`
- Schema-index para resolver sector
- Pink-sheen en páginas adulto/registro

---

## Reglas críticas

1. **Canónica visual:** `perfil-vista-previa.html` + `resultados.html` (doc SISTEMA-VISUAL)
2. Migrar **una pantalla a la vez** — no CSS global masivo
3. Home (`home-*`) aún con sistema propio — pendiente unificación
4. Desktop-first en resultados (`min-width: 1180px`) — verificar responsive
5. No `transform: scale()` en producción

---

## Estado actual

| Pantalla | Estado visual |
|----------|---------------|
| Resultados | Migrada v1 + temas sectoriales jul 2026 |
| Perfil público | Fase A sector/LGBT portada |
| Registro | Pink-sheen + adult-pro |
| Home | Parcial — sector cards modernas + geo guiado (PR #110) |
| Dashboard | `dashboard-rentero-pro.css` |
| `perfil.html` legacy | Pendiente migración |

**Estado jul 2026:** cambios visuales sectoriales integrados en `main` (PR #111 slice resultados; PR #110 home geo). QA estático de cadenas CSS: `node scripts/qa-fondos-static.mjs`.

---

## Pendientes

- Unificar Home con tokens Perfil/Resultados
- QA responsive desktop/tablet/móvil fondos pro
- Completar assets SVG LGBT (`ad-banner-lgbt-resultados-*`)
- Deprecar gradientes inline viejos (ej. corregido en `registro-banner.html`)

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Importante** | Duplicación reglas fondo (inline vs CSS externo) |
| **Importante** | LGBT mezclado con adult-pro |
| **Importante** | Legibilidad texto sobre fondos con destellos |
| **Mejora futura** | Dos sistemas `home-*` vs `ch-*` coexistiendo |

---

## Validaciones necesarias

- Por sector: fondo + banner + tarjeta coherentes
- `scripts/qa-fondos-static.mjs` (cadena CSS adult-pro / sector-pro)
- Playwright visual cuando disponible (`agent-tools/qa-fondos-visual.mjs` — local, gitignored)
- Contraste WCAG en textos sobre `--adult-pro-page-bg`

---

## Pendiente de confirmar

- PR #109 (`feat/platform-resultados-sector-visual`) — **abierta**; no confundir con PR #111 ya mergeada
- Cobertura completa 15 sectores en `carihub-sector-pro-background.css`
- Uniformidad dashboard vs páginas públicas
