# Matriz de reorganización modular CariHub

| Campo | Valor |
|-------|-------|
| **Versión** | 1.0.0 |
| **Fecha** | 2026-06-09 |
| **Modo** | Solo recomendaciones — **sin ejecutar** |

Canónico: [`MATRIZ-MODULARIZACION-CARIHUB.json`](./MATRIZ-MODULARIZACION-CARIHUB.json)

**Acciones permitidas:** mantener · mover · dividir · eliminar · refactorizar · convertir en Shared/Core · dejar legacy temporal · revisar manualmente.

---

## PARTE 5 — Matriz archivo/carpeta → módulo destino → acción

### Páginas HTML

| Actual | → Destino | → Acción |
|--------|-----------|----------|
| `index.html` | PÚBLICA/home (+ 5 apps) | **dividir** |
| `index.html` inline auth/registro | REGISTRO | mover |
| `index.html` inline panel/cuenta | DASHBOARD | mover |
| `index.html` links Stripe/MP | PAGOS | mover |
| `index.html` favoritos CRUD | INTERACCIONES/Cuenta | mover |
| `index.html` solicitud anuncio | BANNERS | mover |
| `index.html` `estadisticas_visitas` | Admin/analytics backend | mover |
| `index.html` `CATEGORIAS_BUSCADOR` | SHARED/Catálogo | eliminar (duplicado) |
| `resultados.html` | PÚBLICA/Resultados | **refactorizar** (query server-side) |
| `perfil.html` | PÚBLICA/Perfil | mantener (+SEO head) |
| `admin.html` | ADMIN | **dividir** (8 módulos) |
| `registro-banner.html` | BANNERS + PAGOS | **dividir** |
| `registro-banner2.html` | BANNERS | **revisar manual** (eliminar si duplicado) |
| `registro-banner-paso3.html` | BANNERS | **revisar manual** |
| `dashboard-rentero.html` | DASHBOARD + THEMEENGINE | **dividir** (tokens→Theme) |
| `index-legacy.html` | — | **eliminar** (ya ignore) |
| `preview/adultos-...html` | — | **eliminar** |
| `404.html` | SHARED | mantener |

### JavaScript

| Actual | → Destino | → Acción |
|--------|-----------|----------|
| `hero-home.js`, `home-ui.js`, `home-sector-scroll.js`, `sector-scroll-data.js`, `adultos-cat-picker.js` | PÚBLICA/home | mantener |
| `home-vcards.js` | SHARED/RenderEngine | refactorizar |
| `home-bridge.js` | PÚBLICA/home | dejar legacy temporal |
| `catalogos-carihub.js` | SHARED/Catálogo | **convertir Core** (alinear 462) |
| `sectores-carihub.js`, `categoria-iconos.js` | SHARED | **convertir Core** |
| `modal-carihub.js` | SHARED/Core | **convertir Core** |
| `precios-publicidad.js`, `banner-inventario-rotacion.js` | BANNERS | mantener |
| `paises.js`, `estados.js`, `ciudades.js` | SHARED/Core geo | **convertir Core** |

### CSS

| Actual | → Destino | → Acción |
|--------|-----------|----------|
| `home.css` | PÚBLICA/home | refactorizar (borrar `proto-*`) |
| `home-vcards.css` | SHARED/RenderEngine | refactorizar |
| `home-sector-scroll.css`, `home-adultos-cat-picker.css` | PÚBLICA/home | mantener |
| `home-modals.css` | con modales destino | dividir (corregir `--rosa*`) |
| `modal-carihub.css`, `banners-publicidad.css` | SHARED/Core | **convertir Core** |

### Configuración y core

| Actual | → Destino | → Acción |
|--------|-----------|----------|
| `firebaseConfig` (x5 copias) | SHARED/Core | **convertir Core** (init único) |
| `firestore.rules` | SHARED/Core | mantener (+colecciones Messenger al implementar) |
| `firestore.indexes.json` | SHARED/Core | refactorizar (índices Resultados) |
| `functions/` | SHARED/Core backend | revisar manual |
| Helpers inline (`textoSeguro`…) | SHARED/Core | **convertir Core** |

### Assets y corpus

| Actual | → Destino | → Acción |
|--------|-----------|----------|
| `img/home/` | PÚBLICA + BANNERS | mantener |
| `img/adultos-cat/`, `img/menu-icons/` | PÚBLICA/home | mantener |
| `scripts/` (corpus congelado) | SHARED/Core docs | mantener (no tocar capas congeladas) |

---

### Resumen de acciones

| Acción | Aprox. ítems |
|--------|--------------|
| Mantener | 12 |
| Convertir en Shared/Core | 11 |
| Mover | 7 |
| Dividir | 6 |
| Refactorizar | 5 |
| Eliminar | 3 |
| Revisar manual | 3 |
| Dejar legacy temporal | 1 |

---

*Matriz documental — recomendaciones de reorganización, sin mover ni modificar archivos.*
