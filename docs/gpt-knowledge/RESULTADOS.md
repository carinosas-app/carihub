# Resultados — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

Listado/búsqueda de perfiles por categoría, subcategoría y geo. Aplica tema visual por sector, banners dinámicos, contrato de tarjeta anti-contaminación y datos demo para QA.

**Entry point:** `public/resultados.html`

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `resultados.html` | Shell |
| `resultados.css` | Layout, `--res-page-bg`, temas `data-sector` / `data-rp-sector` |
| `carihub-resultados-sector.js` | Resolver categoría→sector, pintar `data-sector` en body |
| `carihub-resultados-card-contract.js` | Contrato campos públicos por subcategoría en tarjeta |
| `resultados-registrados.js` | Fetch/normalize Firestore |
| `resultados-demo.js` | Perfiles demo por sector |
| `banner-resultados-principales.js` | Banner superior |
| `banner-resultados-laterales.js` | Banners laterales |
| `carihub-*-sector-render.js` | Render específico por sector (bienestar, gastronomía, salud, etc.) |
| `carihub-sector-sparkles.js` | Destellos visuales |
| `carihub-page-sector-sparkles.css` | CSS sparkles |
| `carihub-adult-pro-background.css` | Fondo pro (adultos) |
| `carihub-sector-pro-background.css` | Fondo pro (otros sectores) |

**Documentación cambios:** `docs/cambios/2026-07-03-resultados-visual/`

---

## Flujo funcional

```
URL ?categoria=&subcategoria=&geo...
    → carihub-resultados-sector.js resuelve sectorId (schema-index)
    → body[data-sector] + variables CSS + sparkles
    → Banners sectoriales (ad-banner-{sector})
    → Carga perfiles: Firestore + demo fallback
    → card-contract filtra campos visibles por subcategoría
    → Tarjeta → enlace perfil-publico.html?id=
```

---

## Dependencias

- `registro-schema-index.js`
- `catalogos-carihub.js`
- `carihub-geo-picker.js`
- `publicidad-activa.js` (banners pagados en slots)
- `carihub-public-render-lite.js` (coherencia con perfil)
- Sector render modules por dominio

---

## Reglas críticas

1. **Anti-contaminación tarjeta:** no mostrar campos de otro arquetipo (ej. datos adultos en salud)
2. **Tema LGBT:** `data-subtema="lgbt"` — paleta propia, excluida de adult-pro genérico
3. **Demo vs real:** IDs `demo-*` para QA; no mezclar con producción en tests de persistencia
4. Filtrado actual mayormente **client-side** — limitación arquitectónica conocida

---

## Estado actual

- Fase visual sectorial implementada (fondo, banners, contrato tarjeta, demos)
- Fase visual sectorial en `main` (PR #111, merge 2026-07-06)
- PR #109 (`feat/platform-resultados-sector-visual`) — **abierta** (alcance plataforma más amplio)
- Múltiples `carihub-*-sector-render.js` para sectores extendidos
- CSS espejo `data-rp-sector` en resultados para compatibilidad

---

## Pendientes

- Queries server-side / índices Firestore (`BLK-04`)
- QA visual completo todos sectores (script `qa-resultados-sector-theme.mjs`)
- Paginación y performance con muchos perfiles

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Importante** | Client-side filter — datos sensibles en payload si rules laxas |
| **Importante** | Regresión visual al cambiar `--res-page-bg` / sector themes |
| **Importante** | card-contract desactualizado vs nuevos blocks |

---

## Validaciones necesarias

- `qa-resultados-sector-theme.mjs`
- Por sector: fondo + banner + tarjeta + sin fuga adultos
- `audit-e2e-behavioral-flow.mjs`
- Comparar demo vs perfil público real post-submit

---

## Pendiente de confirmar

- Cobertura completa sector-render vs lista sectores en schema-index
- Estado producción de banners `ad-banner-lgbt-resultados-*`
