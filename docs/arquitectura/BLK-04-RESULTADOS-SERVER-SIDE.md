# ADR — BLK-04: Resultados y lectura Firestore (client-side vs server-side)

| Campo | Valor |
|-------|-------|
| **ID** | BLK-04 |
| **Estado** | Aceptado (interino) — implementación server-side **diferida** |
| **Fecha** | 2026-07-04 |
| **Ámbito** | `resultados.html`, `resultados-registrados.js`, `resultados-demo.js`, `dashboard-buscar.js` |
| **Relacionado** | P0-1 hydrate, P0-3 filtro unificado, RD-07 (SPEC RenderEngine), ACTA P0 Runtime |

---

## Contexto

El módulo **Resultados** lista perfiles públicos por categoría/subcategoría y geo (país, estado, ciudad). Tras P0-1 y P0-3, la **normalización** y el **filtro** están unificados en cliente, pero la **lectura Firestore** sigue trayendo el universo de perfiles aprobados y filtrando en el navegador.

Este ADR documenta la decisión técnica para el **gate P0 Resultados**: no bloquear el cierre visual/contrato por BLK-04, pero registrar el riesgo y el camino de migración.

---

## Problema (BLK-04)

### Comportamiento actual verificado

```318:343:public/js/resultados-registrados.js
  function consultarPublicos() {
    // ...
    return firestore.collection('usuarios')
      .where('aprobado', '==', true)
      .where('activo', '==', true)
      .where('vencido', '==', false)
      .get()
      .then(function (snap) {
        _cache = snap.docs
          .filter(function (doc) { return !estaVencido(doc.data()); })
          .map(normalizarPerfilFirestore);
        // ...
      });
  }
```

| Paso | Dónde | Qué hace |
|------|-------|----------|
| 1. Query Firestore | `consultarPublicos()` | Trae **todos** los `usuarios` con `aprobado + activo + !vencido` (sin filtros cat/geo) |
| 2. Caché global | `_cache` | Se reutiliza en `listar()`, `buscar()`, `totalPublicos()` |
| 3. Filtro cliente | `CariHubPerfilBusquedaFiltro` (P0-3) | Aplica categoría/subcategoría + geo sobre `_cache` |
| 4. Paginación cliente | `paginar()` en `buscar()` | Slice en memoria, no cursor Firestore |

### Consumidores

| Consumidor | Ruta de datos | Usa `buscar()` |
|------------|---------------|----------------|
| `resultados.html` | `componerListaResultados` → `perfilesRegistrados` → `listar()` + filtro demo | **No** |
| `dashboard-buscar.js` | `CariHubResultadosRegistrados.buscar()` | **Sí** |
| `perfil-publico-init.js` | `normalizar(doc)` individual | N/A |

### Reglas e índices

- **Rules:** `usuarios/{userId}` permite `read` si `isPublicProfile()` — el cliente recibe el **documento completo** del perfil público, no una proyección mínima.
- **Índice existente:** compuesto `aprobado + activo + vencido + fechaVencimiento` (`firestore.indexes.json`).
- **Índices ausentes:** no hay compuestos con `subcategoriaId`, `pais`, `estado`, `ciudad` para queries acotadas.

### Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Importante** | Escalabilidad: costo y latencia crecen linealmente con el número de perfiles públicos |
| **Importante** | Payload: posible exposición de campos no necesarios para tarjeta (mitigado parcialmente por rules, no por proyección) |
| **Mejora futura** | SEO programático y landings geo requieren paginación server-side estable |
| **Mejora futura** | Métricas de búsqueda imprecisas si se mezcla caché global con filtros locales |

---

## Opciones consideradas

### A — Mantener client-side (status quo + P0-3)

- **Pros:** Cero cambio en rules/índices; compatible con demo, localhost y gate visual actual; filtro ya unificado.
- **Contras:** No escala; BLK-04 sigue abierto; `resultados.html` y dashboard comparten caché completo.

### B — Firestore query compuesta directa en `usuarios`

Añadir `.where('subcategoriaId'…).where('estado'…)` etc. en `consultarPublicos` / `buscar`.

- **Pros:** Menos datos transferidos; paginación nativa con `limit` + `startAfter`.
- **Contras:** Explosión de índices compuestos; campos geo/categoría no siempre normalizados en docs legacy; categorías adultas usan labels comerciales además de `subcategoriaId`.

### C — Colección proyección `perfiles_publicos` (o subcolección indexada)

Cloud Function / trigger al aprobar perfil → escribe documento público mínimo (campos tarjeta + geo + ids canónicos).

- **Pros:** Alineado con SPEC RenderEngine; rules simples; queries predecibles; separación público/privado.
- **Contras:** Pipeline nuevo (submit → proyección → resultados); migración de docs existentes; trabajo de sincronización.

### D — Cloud Function / Hosting SSR `buscarPerfiles(filtros, page)`

API server-side que consulta Firestore con índices y devuelve solo la página.

- **Pros:** Oculta lógica de índices; prepara SEO head dinámico.
- **Contras:** Infra adicional; auth/rate-limit; fuera del monolito MVP actual.

---

## Decisión

**Adoptar A de forma explícita e interina** para cerrar el gate P0 Resultados (visual + contrato + filtro unificado).

**Diferir B/C/D** a un bloque posterior (**RD-07 / post-gate Resultados**), con preferencia arquitectónica documentada:

> **Opción C (proyección pública)** como destino; **B** como puente solo si el volumen lo exige antes de tener proyección.

### Qué NO se hace en P0 (explícito)

- No cambiar `consultarPublicos()` a query geo/categoría.
- No añadir índices compuestos de búsqueda sin SPEC de campos canónicos en `usuarios`.
- No crear colección paralela ni Cloud Function en este bloque.
- No modificar `firestore.rules` para restringir lectura campo a campo (requiere modelo de proyección).

### Qué SÍ quedó resuelto en P0 (no es BLK-04)

| Ticket | Entrega |
|--------|---------|
| P0-1 | Hydrate unificado legacy + `bloquesPublicos` |
| P0-2 | Slots huérfanos alineados catálogo/rules |
| P0-3 | Filtro único `CariHubPerfilBusquedaFiltro` (demo = registrados = dashboard) |

BLK-04 es **independiente** de esos cierres: mejora la capa de lectura, no la de filtrado.

---

## Consecuencias

### Positivas (corto plazo)

- Gate Resultados puede cerrarse en UX/contrato sin esperar infra server-side.
- Un solo filtro cliente reduce bugs de divergencia (P0-3).
- Dashboard y resultados interpretan categoría/subcategoría/geo de forma consistente.

### Negativas (aceptadas temporalmente)

- Primer paint de resultados depende de descargar todos los perfiles públicos.
- `buscar()` en dashboard es paginación **en memoria**, no cursor remoto.
- BLK-04 permanece en backlog como **importante**, no bloqueador del merge visual P0.

### Invariantes a preservar en la migración futura

1. **`CariHubPerfilBusquedaFiltro`** sigue siendo la fuente de verdad semántica del match (server puede reimplementar, no redefinir).
2. **`hydratePerfilFromFirestoreDoc` / `enriquecerMetadataFirestore`** siguen aplicando en lectura de detalle; la proyección pública no reemplaza el hydrate de ficha completa.
3. **Demo fallback** en `componerListaResultados` no depende de Firestore — debe seguir funcionando sin red.

---

## Plan de migración recomendado (fases)

### Fase 1 — Contrato de campos indexables (prep)

- Normalizar en persistencia: `subcategoriaId`, `sectorId`, `pais`, `estado`, `ciudad` (y opcional `zona`) en todo perfil aprobado.
- Script de auditoría: % perfiles sin `subcategoriaId` canónico.
- Documentar en schema index qué campos son queryables.

### Fase 2 — Índices + query acotada (puente)

- Añadir índices compuestos mínimos, p. ej. `(aprobado, activo, subcategoriaId, estado)`.
- Nuevo `consultarPublicos(filtros)` con `limit` + `startAfter`; mantener fallback client-side si query vacía por legacy.

### Fase 3 — Proyección `perfiles_publicos` (destino)

- Trigger on write/update de perfil aprobado → proyección mínima para tarjeta.
- Rules: lectura anónima solo en proyección; `usuarios` restringido a owner/admin.
- `resultados-registrados.js` lee proyección; hydrate completo solo en `perfil-publico.html?id=`.

### Fase 4 — API / RenderEngine (SEO)

- Endpoint o SSR para landings geo + head dinámico (RD-02, RD-07).
- Paginación y `noindex` según SPEC.

---

## Criterios de cierre de BLK-04

BLK-04 se considera **resuelto** cuando se cumplan **todos**:

- [ ] Query inicial de resultados NO descarga el universo completo de `usuarios` en producción.
- [ ] Paginación con cursor (`limit` / `startAfter` o equivalente API).
- [ ] Índices Firestore desplegados y documentados para las combinaciones soportadas.
- [ ] Lectura anónima usa proyección pública o campo allow-list verificado.
- [ ] QA de paridad: mismos resultados que `CariHubPerfilBusquedaFiltro` en matriz cat/sub/geo (P0-3).
- [ ] `dashboard-buscar.js` y `resultados.html` usan la misma ruta de lectura acotada.

---

## Validación y QA asociados

| Script | Rol |
|--------|-----|
| `scripts/qa-perfil-busqueda-filtro.mjs` | Semántica de filtro (cliente) — **verde post P0-3** |
| `scripts/qa-mp-submit-hydrate.mjs` | Hydrate read-path — **verde post P0-1** |
| *Futuro* `qa-resultados-server-query.mjs` | Paridad query server vs filtro unificado |

---

## Referencias

- `public/js/resultados-registrados.js` — `consultarPublicos`, `buscar`, `_cache`
- `public/js/carihub-perfil-busqueda-filtro.js` — filtro unificado (P0-3)
- `public/js/resultados-demo.js` — `componerListaResultados`, `perfilesRegistrados`
- `firestore.rules` — `isPublicProfile()`
- `firestore.indexes.json` — índice `usuarios` actual
- `scripts/ACTA-CONGELAMIENTO-P0-RUNTIME-FOUNDATION.md` — BLK-04 bloqueador crítico (diseño)
- `docs/gpt-knowledge/RESULTADOS.md` — pendiente server-side
- `scripts/SPEC-RENDERENGINE.md` — `renderResults` server-side (RD-07)

---

## Resumen ejecutivo

**Sí, se puede cerrar el gate P0 Resultados sin resolver BLK-04**, siempre que quede documentado que la lectura sigue siendo client-side. P0-4 **no implementa** server-side; **registra la decisión**, el riesgo y el plan C→B→API para cuando el volumen o SEO lo exijan.
