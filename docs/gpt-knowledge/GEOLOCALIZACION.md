# Geolocalización — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

Selector de país, estado y ciudad en Home, Registro, Resultados y Dashboard. Catálogos estáticos + UI modal pantalla completa (Geo Picker V5).

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `public/js/carihub-geo-picker.js` | Geo Picker V5 — modal, búsqueda, tarjetas |
| `public/js/carihub-geo-picker-data.js` | Datos auxiliares / presets |
| `public/js/carihub-geo-catalog.js` | Catálogo unificado (si cargado) |
| `public/js/carihub-geo-images.js` | Imágenes/banderas geo |
| `public/paises.js` | Lista países |
| `public/estados.js` | Estados por país |
| `public/ciudades.js` | Ciudades por estado |
| `public/js/mexico-estados-municipios.js` | Detalle México |

---

## Flujo funcional

1. Usuario toca campo geo (país/estado/ciudad)
2. `carihub-geo-picker.js` abre sheet modal fullscreen
3. Carga scripts geo bajo demanda si no están (`loadScript`)
4. Búsqueda incremental + render por lotes (`LIST_BATCH = 40`)
5. Selección actualiza inputs ocultos/visibles y dispara eventos
6. Contextos distintos:
   - **Home/resultados:** subtítulo exploración visible
   - **Registro:** al abrir País solo «Selecciona tu país» (subtítulo «Explora perfiles…» oculto — fix 2026-07-03)

---

## Dependencias

- Scripts `paises.js`, `estados.js`, `ciudades.js` en `/public`
- Integración con formularios de registro y búsqueda
- Resultados filtran por geo en query params — **pendiente de confirmar** si filtro es solo client-side

---

## Reglas críticas

1. Geo es **primero** en estrategia SEO/landings (plan maestro SEO)
2. No hardcodear listas geo fuera de catálogos centrales
3. Flujo registro ≠ flujo home en copy del modal país
4. Scroll lock al abrir modal (`geoScrollLockY`)

---

## Estado actual

- Geo Picker V5 operativo con UI premium (gradientes, iconos SVG)
- Home: flujo guiado secuencial País→Estado→Ciudad (PR #110)
- Catálogos estáticos en repo (no Firestore)

---

## Pendientes

- Sincronizar geo en perfil público / mapa si aplica
- Landings geo programáticas (SEO plan)
- Validar cobertura países fuera de México

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Importante** | Catálogos estáticos desactualizados vs demanda real |
| **Importante** | Tamaño `ciudades.js` — carga lazy crítica |
| **Mejora futura** | Sin geocoding inverso / GPS nativo documentado |

---

## Validaciones necesarias

- Abrir picker en home vs registro — copy correcto
- Selección MX completa: país → estado → ciudad
- Navegación resultados con params geo

---

## Pendiente de confirmar

- Si `CariHubGeoCatalog` es fuente única o legacy
- Persistencia geo en Firestore (campos exactos por arquetipo)
