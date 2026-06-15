# ADR-RENDER-STRATEGY — Estrategia de render para CariHub

| Campo | Valor |
|-------|-------|
| **Versión** | 1.0.0 |
| **Fecha** | 2026-06-10 |
| **Estado** | Propuesta — decisión documental, sin implementar |
| **Modo** | Solo análisis — **sin runtime/carpetas/mover/Firestore/deploy/commit** |

Canónico: [`ADR-RENDER-STRATEGY.json`](./ADR-RENDER-STRATEGY.json)
Base: [`SPEC-RENDERENGINE.md`](./SPEC-RENDERENGINE.md) · [`AUDITORIA-SPEC-RENDERENGINE.md`](./AUDITORIA-SPEC-RENDERENGINE.md) · [`PLAN-MAESTRO-APP-PUBLICA.md`](./PLAN-MAESTRO-APP-PUBLICA.md) · [`OBSERVACION-ARQUITECTONICA-SEO.json`](./OBSERVACION-ARQUITECTONICA-SEO.json)

---

## Contexto

La auditoría de `SPEC-RENDERENGINE v1.0.0` dejó 3 hallazgos bloqueantes; **RE-AU-02 (estrategia de render no decidida)** es el que resuelve este ADR.

**Infraestructura actual (verificada):**
- **Firebase Hosting** estático (`public/`).
- **Cloud Functions v2 / gen2** (Node 24, `firebase-functions ^7`, `firebase-admin ^13`) — hoy solo el job programado `vencerPerfiles`. → SSR vía Functions/Cloud Run + Hosting rewrites es **factible**.
- **Firestore** como datos.
- **Render actual:** CSR. `resultados.html` lee toda la colección y filtra en cliente (**riesgo AP-R01**).

---

## Opciones evaluadas

- **A — Render cliente actual (CSR)**
- **B — SSR por Cloud Functions / Cloud Run** (Hosting rewrites)
- **C — Prerender / SSG** (generación en build)
- **D — Snapshot estático en Hosting** (regenerado al publicar, ISR-like)
- **E — Híbrido** (C/D para estable + B para long-tail + CSR en islas no indexables)

---

## Matriz comparativa

`1 = peor … 5 = mejor` · *(complejidad: 5 = más simple)*

| Opción | SEO | Rend. | CWV | Costo | Complej. | Hosting | Firestore | Privacidad | Esc. Nac. | Esc. Int. | Manten. |
|--------|-----|-------|-----|-------|----------|---------|-----------|------------|-----------|-----------|---------|
| **A** CSR actual | 1 | 2 | 1 | 5 | 5 | 5 | 2 | 1 | 2 | 1 | 2 |
| **B** SSR Functions | 5 | 4 | 4 | 3 | 2 | 4 | 5 | 5 | 4 | 4 | 3 |
| **C** Prerender SSG | 5 | 5 | 5 | 5 | 3 | 5 | 4 | 5 | 4 | 4 | 3 |
| **D** Snapshot estático | 5 | 5 | 5 | 4 | 3 | 5 | 4 | 5 | 5 | 5 | 4 |
| **E** Híbrido | **5** | **5** | **5** | **4** | **2** | **5** | **5** | **5** | **5** | **5** | **4** |

---

## Estrategia por superficie

| Superficie | MVP | Futuro | Nota |
|------------|-----|--------|------|
| **Home** | Estático (shell prerender) + islas CSR no indexables | SSG con regeneración de destacados | LCP crítico, contenido casi fijo |
| **Resultados** | **Consulta server-side** (índices compuestos) + SSR/edge para SEO; canonical | Cache CDN por filtro popular + SSR long-tail | **Eliminar filtrado en cliente (AP-R01)** |
| **Perfil público** | Snapshot estático servido por Hosting o SSR on-demand con cache por `(perfilId, schemaVersion)` | ISR-like vía pipeline publish→snapshot | Snapshot ya filtrado por PrivacyGuard |
| **Landing país** | Estático (pocas, alta demanda) | SSG | — |
| **Landing estado** | Estático top + SSR long-tail | SSG + SSR | — |
| **Landing ciudad** | SSR on-demand con umbral thin-content; estático top | ISR | — |
| **Landing categoría** | Estático populares + SSR resto | SSG + SSR | — |
| **Landing categoría+geo** | SSR on-demand con guard thin-content | ISR selectivo por demanda | 462 × geo es enorme |

---

## Recomendación principal

> **Opción E — Híbrido "snapshot-first".**

Estático/SSG + **snapshots publicados** para contenido estable; **SSR on-demand** (Cloud Functions/Cloud Run vía Hosting rewrites) para long-tail y resultados; **CSR solo en islas** interactivas no indexables. **PrivacyGuard server-side/build**. Cache CDN por `(perfilId, schemaVersion)`.

**Por qué:** maximiza SEO y CWV donde importa, controla costo (compute solo en long-tail), **reutiliza `snapshotAlPublicar` ya diseñado**, mantiene compatibilidad total con la infra Firebase actual y minimiza el riesgo de datos privados.

### Recomendación MVP (sin sobre-ingeniería)

1. **Resultados server-side** con índices compuestos Firestore → mata AP-R01. **(P0)**
2. **Perfil público** vía snapshot servido por Hosting o SSR on-demand con cache. **(P0/P1)**
3. **Home estático** (shell) + islas CSR no indexables. **(P1)**
4. **Landings**: estático para país/estado/ciudad/categoría *top*; diferir long-tail. **(P1)**
5. **`renderHead`** server-side/build (meta/OG/JSON-LD). **(P1)**

**Evitar en MVP:** SSR de todo · generar 462×geo landings · framework SSR completo si no se justifica.

### Recomendación futura
ISR-like con invalidación CDN · SSR multi-región (internacional) · edge cache de meta/landings populares · generación de long-tail guiada por analytics · evaluar Next/Astro **solo si** la complejidad lo justifica.

---

## Riesgos

| ID | Nivel | Riesgo | Mitigación |
|----|-------|--------|------------|
| RS-R01 | Alto | CSR en Resultados perpetúa AP-R01 | server-side + índices en MVP |
| RS-R02 | Medio | Cold starts SSR → TTFB | min instances / Cloud Run + CDN |
| RS-R03 | Medio | Explosión de landings (462×geo) | umbral thin-content + SSR long-tail |
| RS-R04 | Medio | Snapshots viejos en CDN tras republicar | invalidación por `(perfilId, schemaVersion)` |
| RS-R05 | Medio | Fuga de datos privados si PrivacyGuard solo en cliente | PrivacyGuard en build/server (admin SDK) |
| RS-R06 | Bajo | Complejidad operativa del híbrido | límites claros por superficie + pipeline documentado |

---

## Dependencias

- **Shared/Core** (precondición): config/tokens/helpers/catálogo/geo.
- **RenderEngine**: este ADR fija `modoRender` por superficie y la política de caché.
- **FieldEngine 1.0.1**: `snapshotAlPublicar` es el insumo del modelo snapshot-first.
- **SEO**: consume `renderHead`/JSON-LD; define sitemap/robots/hreflang/umbral thin-content.
- **ThemeEngine**: `TokenSet` aplicado en build/SSR.
- **Banners / Interacciones**: islas; no bloquean indexación.
- **Migración usuarios→perfiles**: URL canónica estable (`perfilId`) — **RE-AU-03**.
- **Firebase**: Hosting rewrites → Cloud Functions/Cloud Run (gen2 disponible).

---

## Qué decisión desbloquea SPEC-RENDERENGINE

**Cierra `RE-AU-02`.** Resolución: `modoRender` por defecto = **híbrido snapshot-first**; perfil/landing estable = estático/snapshot; long-tail/resultados = SSR on-demand; islas = CSR.

**Impacto en la SPEC:**
- Fija `RenderContext.modoRender` y su default por superficie.
- Confirma el diseño de **caché por `(perfilId, schemaVersion)`**.
- Confirma **PrivacyGuard server-side/build**.
- Confirma **Resultados server-side** (corrige AP-R01).

**Quedan para congelar la SPEC:** `RE-AU-01` (Shared/Core no congelado) y `RE-AU-03` (URL canónica de migración).

---

## ¿Procede documentar como ADR?

**Sí — ya entregado** (`.md` + `.json`). Es una decisión arquitectónica con alternativas y consecuencias claras; el ADR es el formato correcto y **desbloquea formalmente RE-AU-02**.

### Consecuencias
- **Positivas:** SEO/CWV óptimos en superficies clave · costo controlado · privacidad reforzada · compatibilidad con infra actual · escala nacional e internacional.
- **Negativas:** mayor complejidad operativa que CSR · requiere pipeline de snapshot e invalidación · disciplina de límites por superficie.

---

*ADR documental — no modifica código, Firestore, producción ni capas congeladas (VE 1.1.0 · FieldEngine 1.0.1 · Messenger 1.0.0 · Dashboards 1.0.0 intactos). No inicia runtime.*
