# Auditoría de consistencia — SPEC-RENDERENGINE v1.0.0

| Campo | Valor |
|-------|-------|
| **Objeto auditado** | `SPEC-RENDERENGINE.json` v1.0.0 |
| **Fecha** | 2026-06-10 |
| **Estado** | Auditoría de consistencia actualizada (2026-06-10) |
| **Veredicto** | **Apta para congelar — 3 hallazgos bloqueantes CERRADOS** (RE-AU-01/02/03) |

Canónico: [`AUDITORIA-SPEC-RENDERENGINE.json`](./AUDITORIA-SPEC-RENDERENGINE.json) · SPEC: [`SPEC-RENDERENGINE.md`](./SPEC-RENDERENGINE.md)

---

## Matriz de consistencia

| Verificación | Resultado |
|--------------|-----------|
| Componentes y fallback coinciden con `config-renderizado-dinamico-schema.json` | **PASS** |
| Lista negra PrivacyGuard idéntica al `nuncaMostrar` del contrato base (21 campos) | **PASS** |
| `ProfileSnapshot` coherente con `snapshotAlPublicar` de FieldEngine 1.0.1 | **PASS** |
| No llama FieldEngine/ValidationEngine vivo en render | **PASS** |
| Superficies privadas excluidas (dashboards/messenger/admin/borradores) | **PASS** |
| Head/JSON-LD/OG coherentes con OBSERVACION-SEO 1.0.0 | **PASS** |
| Adultos noindex / OG moderado | **PASS** |
| `TokenSet` desde Core/ThemeEngine sin HTML crudo | **PASS** |
| Resultados server-side (no client-side filtering) | **PASS** |
| URL canónica estable en migración | **PASS** |
| Shared/Core (precondición) | **PASS** — congelado 1.0.0 |
| Decisión SSR vs prerender vs snapshot estático | **PASS** — ADR-RENDER-STRATEGY |
| URL canónica de migración | **PASS** — ADR-URL-CANONICA-PERFILES |

---

## Hallazgos bloqueantes para congelar — TODOS CERRADOS

| ID | Tema | Estado | Cierre |
|----|------|--------|--------|
| RE-AU-01 | Shared/Core no congelado | **CERRADO** | ACTA-CONGELAMIENTO-SHARED-CORE 1.0.0 |
| RE-AU-02 | Estrategia de render no decidida | **CERRADO** | ADR-RENDER-STRATEGY 1.0.0 (híbrido snapshot-first) |
| RE-AU-03 | URL canónica de migración | **CERRADO** | ADR-URL-CANONICA-PERFILES 1.0.0 |

## Ajustes menores recomendados

| ID | Tema |
|----|------|
| RE-AM-01 | Política thin content para indexar landings (con SEO) |
| RE-AM-02 | Estrategia de caché/invalidación por `(perfilId, schemaVersion)` |
| RE-AM-03 | Composición de `renderHash` (snapshot + componente + tokens + locale) |
| RE-AM-04 | Imágenes responsive (`srcset`/`sizes`, dimensiones) para LCP/CLS |
| RE-AM-05 | Breadcrumb canónico unificado país>estado>ciudad>categoría |

---

## Riesgos

| ID | Nivel | Riesgo | Mitigación |
|----|-------|--------|------------|
| RE-R01 | Alto | Fuga de datos privados si PrivacyGuard no es universal | Gate único pre-render + R07 + log |
| RE-R02 | Alto | Indexar borradores/dashboards/messenger | Whitelist + robots noindex + R11/R12 |
| RE-R03 | Medio | URLs inestables al migrar → pérdida ranking | perfilId canónico + 301 |
| RE-R04 | Medio | Thin content (462 subcategorías × geo) | Umbral de indexación + editorial hub |
| RE-R05 | Medio | Schema.org engañoso (verificaciones) | Solo datos públicos verificables |
| RE-R06 | Medio | Acoplar RenderEngine a FieldEngine vivo | Consumir solo snapshot |
| RE-R07 | Bajo | Regresión visual por tokens divergentes | TokenSet Core; corregir `--rosa` |

### Riesgos si se extrae/implementa mal
- RenderEngine que lee Firestore vivo y filtra en cliente (repite AP-R01).
- HTML SEO paralelo fuera del motor → doble fuente de verdad.
- ThemeEngine inyectando markup arbitrario → XSS.
- Render que rompe la página por componente faltante (sin fallback).

---

## Dependencias

- **Congeladas:** catálogo 1.0.0 · FieldEngine 1.0.1 · ValidationEngine 1.1.0 · Seguridad MVP 1.0.0 · Dashboards 1.0.0.
- **No congeladas:** Shared/Core v1.0.0 (precondición) · App Pública v1.0.0 (consumidor) · SEO obs 1.0.0 · ThemeEngine obs 1.3.0.
- **Contrato base:** `config-renderizado-dinamico-schema.json`.

## Fuera de alcance

Runtime/SSR/CDN · persistencia Firestore · VE/FE (validación/resolución viva) · inventario/precios Banners · editor ThemeEngine · sitemap/robots/hreflang runtime (SEO) · migración de datos.

---

## Cobertura de fixtures

**15 fixtures** — superficies (home, resultados, perfil adultos/negocio/profesionista, landings ciudad y categoría+geo, banner) · seguridad (PrivacyGuard, superficie privada, borrador, adultos noindex) · resiliencia (fallback arquetipo y genérico) · SEO (head, Schema.org, OG, canonical) · ThemeEngine (TokenSet) · migración (URL canónica).

---

## Recomendación sobre ACTA

**No procede congelar.** Ruta:

1. Congelar **Shared/Core v1.0.0**.
2. Decidir **SSR / prerender / snapshot estático**.
3. Confirmar **URL canónica** en migración usuarios→perfiles.
4. Cerrar ajustes menores `RE-AM-01..05`.
5. Aprobación del product owner → **`ACTA-CONGELAMIENTO-RENDERENGINE`**.

---

*Auditoría documental — no modifica código, Firestore, producción ni capas congeladas. No inicia runtime.*
