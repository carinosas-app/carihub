# Home — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

Página de entrada (`public/index.html`): búsqueda, exploración por sectores/categorías, promoción de registro, docks de slots publicitarios, picker de categorías (incl. adultos) y puente hacia resultados y registro.

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `public/index.html` | Shell HTML, carga CSS/JS |
| `public/js/home-cat-promo-rail.js` | Rail promocional categorías |
| `public/js/home-adultos-cat-picker.js` | Modal/picker categorías adultos |
| `public/js/home-otros-registro-bridge.js` | Puente a registro otros sectores |
| `public/js/ch-slot-dock.js` | Docks de slots home |
| `public/js/carihub-sector-cat-search.js` | Búsqueda por sector/categoría |
| `public/js/carihub-geo-picker.js` | Selector geo en búsqueda |
| `public/css/home-cat-promo-rail.css` | Estilos rail |
| `public/css/home-adultos-cat-picker.css` | Estilos picker adultos |
| `public/css/home-otros-registro-bridge.css` | Estilos puente registro |
| `public/css/carihub-pink-sheen.css` | Tema rosa / fondo pro adulto |
| `public/css/carihub-adult-pro-background.css` | Fondo profesional adulto |
| `public/css/carihub-sector-pro-background.css` | Fondos sectores no adultos |
| `public/img/home/sector-cards/*.png` | Tarjetas visuales por sector |
| `public/img/home/banners/ad-banner-*.png/svg` | Banners por sector |

---

## Flujo funcional

1. Usuario llega a `/` o `index.html`
2. Puede buscar por texto + geo (`carihub-geo-picker.js` + catálogos)
3. Explora sectores vía cards/rail → navega a `resultados.html?categoria=...` o abre picker adultos
4. Slots publicitarios se hidratan vía `publicidad-activa.js` + docks
5. CTAs registro → `registro-perfil.html` con query params de categoría/subcategoría

---

## Dependencias

- `catalogos-carihub.js` — taxonomía categorías
- `registro-schema-index.js` — resolución categoría/subcategoría
- `carihub-core.js` — Firebase (favoritos, sesión si aplica)
- `slots-catalog.js` — definición slots home
- Sistema visual compartido con registro/resultados (pink-sheen, sector backgrounds)

---

## Reglas críticas

1. Home es **mezcla** de búsqueda + registro según mapa maestro — no asumir separación app
2. Picker adultos tiene flujo y copy distinto al de otros sectores
3. Slots `home_estados` / `home_libe` en UI — validar contra catálogo Firestore (ver FIRESTORE-Y-DATOS.md)
4. Tema LGBT en subcategorías específicas — no aplicar fondo adult-pro genérico (exclusión en CSS)

---

## Estado actual

- Flujo guiado geo País→Estado→Ciudad desde Home (PR #110, merge jul 2026)
- Sector cards modernas + fondos pro adulto/sectoriales en `main`
- Unificación tokens visuales con Perfil/Resultados documentada como pendiente en `docs/SISTEMA-VISUAL-CARIHUB.md`

---

## Pendientes

- Unificar sistema visual Home ↔ Resultados ↔ Perfil
- Confirmar todos los banners sectoriales tienen fallback si imagen falla
- SEO landing desde home (diseño en `docs/seo/`, sin runtime)

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Importante** | `index.html` carga muchos scripts — orden y duplicados |
| **Importante** | Inconsistencia slots home vs backend |
| **Mejora futura** | Performance LCP por imágenes sector-cards |

---

## Validaciones necesarias

- Smoke navegación: sector → resultados con query correcta
- QA visual docks por sector (scripts en `agent-tools/`)
- Verificar geo picker en contexto home (no registro)

---

## Pendiente de confirmar

- Si `index-legacy.html` sigue enlazado desde algún flujo
- Cobertura completa de los 15+ sectores en sector-cards vs schema-index
