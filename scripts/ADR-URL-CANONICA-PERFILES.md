# ADR-URL-CANONICA-PERFILES — URL canónica y slugs (migración usuarios → perfiles)

| Campo | Valor |
|-------|-------|
| **Versión** | 1.0.0 |
| **Fecha** | 2026-06-10 |
| **Estado** | Propuesta — decisión documental, sin implementar |
| **Resuelve** | **RE-AU-03** (bloqueante de SPEC-RENDERENGINE) |
| **Modo** | Solo análisis — **sin runtime/carpetas/mover/Firestore/deploy/commit** |

Canónico: [`ADR-URL-CANONICA-PERFILES.json`](./ADR-URL-CANONICA-PERFILES.json)
Base: [`SPEC-RENDERENGINE.md`](./SPEC-RENDERENGINE.md) · [`ADR-RENDER-STRATEGY.md`](./ADR-RENDER-STRATEGY.md) · [`ACTA-MIGRACION-USUARIOS-PERFILES.json`](./ACTA-MIGRACION-USUARIOS-PERFILES.json) · [`OBSERVACION-ARQUITECTONICA-SEO.json`](./OBSERVACION-ARQUITECTONICA-SEO.json)

---

## Contexto

- **URL actual:** `perfil.html?id={usuarioId}` (query param; `id` = doc `usuarios/{uid}`). `resultados.html` enlaza `./perfil.html?id=<uid>`.
- **Modelo de IDs:**
  - `usuarioId` = Firebase Auth uid — **inmutable** (hub `usuarios/{usuarioId}`).
  - `perfilId` = perfil público (`perfiles/{perfilId}`); en **bridge** `perfilId = usuarioId`; multi-perfil futuro = UUID nuevo.
  - `negocioId` = **no es entidad separada** en MVP; un negocio es un perfil (`tipoPerfil=negocio`) → usa `perfilId`.
  - `anuncianteId` = MVP `= usuarioId` (Banners); **no** genera URL pública de perfil.
- **Bridge:** `BRIDGE-MIG-01` perfilId = usuarioId para cuentas legacy.

---

## Opciones comparadas

| # | Patrón | Estabilidad | SEO | Riesgo cambio | Veredicto |
|---|--------|-------------|-----|---------------|-----------|
| O1 | `/perfil/:perfilId` | Máxima | Media | Nulo | Base sólida, SEO pobre sin slug |
| O2 | `/perfil/:slug` | Baja | Alta | Alto | Inestable como canónico |
| O3 | `/p/:perfilId` | Máxima | Pobre | Nulo | Ruta corta secundaria (share) |
| O4 | `/p/:slug` | Baja | Alta | Alto | No canónico |
| O5 | `/mx/:estado/:ciudad/:categoria/:slug` | Baja (perfil) | Muy alta | Alto | **Para landings**, no para perfil |
| O6 | `/categoria/:categoria/:ciudad/:slug` | Baja (perfil) | Muy alta | Alto | Variante landing |
| O7 | `/negocio/:slug` | Baja | Alta | Alto | Solo **alias → 301** |
| O8 | `/anunciante/:slug` | — | — | — | Descartado (no es perfil público) |
| **O9** | **`/perfil/:perfilId/:slug`** | **Máxima** | **Alta** | **Nulo** | **RECOMENDADO (perfil/negocio)** |
| O10 | corta MVP + SEO futura | — | — | — | **RECOMENDADO como estrategia** |

---

## Recomendación principal

> **Perfil/negocio: `/perfil/:perfilId/:slug`** — híbrido **ID interno + slug público** (O9).

- `perfilId` es la **fuente de verdad** y el **canónico**; el `slug` es **decorativo y opcional**.
- El recurso resuelve **siempre por perfilId**, aunque el slug falte o cambie.

**Landings SEO:**
- Geo: `/:pais/:estado/:ciudad`
- Geo + categoría: `/:pais/:estado/:ciudad/:subcategoriaId`
- Categoría: `/c/:subcategoriaId`

**Por qué:** combina estabilidad inmutable (no se pierde ranking al editar alias/ciudad/categoría) con SEO fuerte (slug + landings), y es compatible con el bridge y con multi-perfil futuro.

### Recomendación MVP (durante bridge)
1. Canónico de perfil: `/perfil/:perfilId` (perfilId = usuarioId por `BRIDGE-MIG-01`).
2. **301** de `perfil.html?id={uid}` → `/perfil/{uid}`.
3. `resultados.html` enlaza al nuevo canónico `/perfil/{perfilId}[/{slug}]`.
4. Slug opcional desde el inicio si hay alias; sin slug también es válido.
5. Landings geo/categoría *top* como estáticas (ver ADR-RENDER-STRATEGY).

**Evitar:** geo/categoría como canónico de perfil · slug como único identificador · exponer email/teléfono/uid sensible en slug.

### Recomendación futura
- Multi-perfil: nuevos perfiles = `perfilId` **UUID**; `/perfil/:perfilId/:slug` se mantiene.
- Vanity opcional `/negocio/:slug` y `/@:alias` → **301** al canónico.
- Landings completas geo × categoría con guard thin-content.
- Evaluar **perfilId opaco (UUID) incluso en bridge** si el uid se considera sensible (decisión de seguridad).

---

## Políticas

### Slugs
- Formato: minúsculas, ASCII, guiones; derivado de alias/nombre + desambiguador corto.
- **Sin PII**: nunca email, teléfono, nombre legal completo, RFC ni uid visible.
- **Unicidad no obligatoria** (el `perfilId` garantiza unicidad; colisiones aceptables).
- Máx ~60 chars; normalización unicode (NFKD) + strip diacríticos.
- Cambio de slug permitido (no rompe; resuelve por ID); emitir 301 por higiene.
- Adultos: sin términos explícitos prohibidos; moderación.

### Canonical
- Fuente de verdad = `perfilId`.
- `<link rel="canonical" href="/perfil/{perfilId}/{slugActual}">`.
- Sin slug → canónico `/perfil/{perfilId}` (válido).
- Landings: canónico propio; los perfiles **no** apuntan su canónico a landings.
- Resultados faceted: canónico normalizado por **orden fijo** de parámetros.
- **Un recurso = un canónico**, producido por `RenderEngine.resolveUrl`.

### Noindex
- **noindex:** borrador/no publicado · adultos donde aplique · landings thin-content · resultados vacíos/duplicados · ruta corta `/p/:perfilId` (opcional `noindex,follow`) · dashboards/messenger/admin/wizard.
- **index:** perfil publicado/activo · landings con contenido suficiente · home · resultados canónicos.

### Redirecciones 301
| Origen | Destino |
|--------|---------|
| `perfil.html?id={uid}` | `/perfil/{uid}` |
| `/perfil/{perfilId}/{slugViejo}` | `/perfil/{perfilId}/{slugNuevo}` |
| `/negocio/{slug}`, `/@{alias}` | `/perfil/{perfilId}/{slug}` |
| `/p/{perfilId}` | `/perfil/{perfilId}/{slug}` |
| salida bridge: `/perfil/{uid}` | `/perfil/{uuid}` (+ alias histórico) |

> Toda URL antigua resuelve con 301 a su canónico → **cero pérdida de ranking**.

### Duplicados
- Evitar: mismo perfil por slug y por id sin canónico unificado · landings solapadas (ciudad vs ciudad+categoría) · query params en distinto orden.
- Mitigación: canónico único por `perfilId` · orden fijo de params · jerarquía landing con breadcrumb y canónico propio.

### Bridge `perfilId = usuarioId`
- URL `/perfil/{perfilId}` = `/perfil/{uid}` mantiene compatibilidad sin redirección de datos.
- Favoritos `usuarios/{uid}/favoritos/{perfilId}` válidos con perfilId=uid.
- Multi-perfil futuro introduce UUID; el principal legacy conserva uid o migra con 301.
- Si el uid se clasifica como sensible → recomendar **perfilId opaco** desde el inicio (ver `URL-R02`).

### Negocios / anunciantes
- Negocio = perfil (`tipoPerfil=negocio`) → canónico `/perfil/{perfilId}/{slug}`; vanity `/negocio/{slug}` → 301.
- Anunciante (`anuncianteId`, MVP=usuarioId) pertenece a **Banners**; **no** genera URL pública de perfil.
- Multi-sucursal futuro: cada sucursal = perfil con su propio `perfilId`/canónico.

---

## Impacto

- **SEO:** URLs estables + slug con keywords + landings geo = mejor indexación sin riesgo por cambios de alias; canónico único elimina duplicados.
- **RenderEngine:** define `resolveUrl({perfilId, slug?, geo?, subcategoriaId?}) → {canonical, slug, breadcrumb}`. Cierra el formato de URL del SPEC.
- **Migración:** el bridge hace que las URLs nuevas funcionen **sin mover datos**; 301 desde el query param legacy. Sin pérdida de ranking en cutover.

---

## Riesgos

| ID | Nivel | Riesgo | Mitigación |
|----|-------|--------|------------|
| URL-R01 | Alto | Cambiar el esquema DESPUÉS de indexar → pérdida masiva de ranking | Fijar canónico ahora (este ADR) antes de runtime público |
| URL-R02 | Alto | uid Auth expuesto en URL si es dato sensible | Evaluar perfilId opaco (UUID) desde bridge — decisión seguridad |
| URL-R03 | Medio | Duplicados por slug+id o landings solapadas | Canónico único + orden fijo params + jerarquía |
| URL-R04 | Medio | Slug con PII o términos prohibidos | Política de slugs + moderación |
| URL-R05 | Medio | Romper favoritos/refs legacy al introducir UUID | Bridge + 301 + alias histórico |
| URL-R06 | Bajo | Slug colisiona | ID resuelve; slug no requiere unicidad |

---

## Dependencias

- **RenderEngine** — consume `resolveUrl`/canónico (cierra RE-AU-03).
- **SEO** — sitemap/robots/hreflang sobre estas URLs.
- **Migración** — `BRIDGE-MIG-01` y fases 1–5.
- **FieldEngine** — `snapshotAlPublicar` como fuente de slug/landing.
- **Seguridad** — decisión perfilId opaco vs uid (`URL-R02`).

---

## Qué decisión desbloquea SPEC-RENDERENGINE

**Cierra `RE-AU-03`.** Resolución: canónico de perfil = **`/perfil/{perfilId}/{slug}`**; `perfilId` estable (bridge = usuarioId); 301 desde query param legacy; landings geo/categoría con canónico propio.

**Impacto en la SPEC:** fija `RenderEngine.resolveUrl`, confirma estabilidad de URL en migración y habilita las políticas noindex/301/duplicados.

**Queda para congelar la SPEC:** **RE-AU-01** (Shared/Core no congelado) — único bloqueante restante.

---

## ¿Procede documentar como ADR?

**Sí — ya entregado** (`.md` + `.json`). Decisión arquitectónica con alternativas y consecuencias; cierra `RE-AU-03`.

### Consecuencias
- **Positivas:** estabilidad de URL e identidad · SEO fuerte · cero pérdida de ranking en migración · duplicados controlados · compatibilidad con bridge y multi-perfil.
- **Negativas:** requiere decisión de seguridad sobre uid en URL · necesita capa de 301 y resolución por ID · gestión de slugs (moderación/normalización).

---

*ADR documental — no modifica código, Firestore, producción ni capas congeladas (VE 1.1.0 · FieldEngine 1.0.1 · Messenger 1.0.0 · Dashboards 1.0.0 · Cuentas/Catálogo/Seguridad intactas). No inicia runtime.*
