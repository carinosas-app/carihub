# SPEC-SEO-LANDINGS v1.0.0

**Fecha:** 2026-06-11 · **Estado:** DISEÑO INICIAL · **Implementación autorizada:** NO
**Modo:** Solo análisis, especificación, fixtures, auditoría y documentación. No runtime · no modifica planes/ADRs/actas/capas existentes.

> **Principio rector:** SEO es capa transversal de presentación indexable. Deriva metadatos de snapshots publicados (FieldEngine + RenderEngine). Nunca duplica fuente de verdad ni expone datos privados. Consume ADR-INDEXACION-ADULTOS (O8), ADR-URL-CANONICA-PERFILES y ADR-RENDER-STRATEGY sin redefinirlos.

---

## 1. Superficies SEO

| Superficie | Indexación MVP | Notas |
|---|---|---|
| Home | index,follow | WebSite + SearchAction |
| Resultados | **noindex**, follow | Canonical base o landing geo+cat; query params noindex |
| Perfil público (no adulto) | index condicionado | PUBLICADO + verificado según política |
| Negocio público | index condicionado | LocalBusiness schema |
| Anunciante público | noindex | alias → 301 |
| Landing país/estado/ciudad | index condicional | ThinContentGuard |
| Landing categoría/subcategoría | index condicional | editorial admin |
| Landing geo+categoría | index condicional | **prioridad alta** SEO local |
| Landing "cerca de mí" | noindex | canonical a ciudad/ciudad+cat |
| Estados/Lives/Publicaciones | noindex,noarchive | futuro (Interacciones) |
| Dashboard/Admin/Messenger/Cuenta | noindex + disallow | siempre |
| Contenido premium / actividad contactos | noindex | Economía Social / Red Contactos |

---

## 2. URLs y slugs (ADR-URL-CANONICA — consumida)

- **Canónico perfil/negocio:** `/perfil/{perfilId}/{slug}` — resuelve por `perfilId`; slug decorativo.
- **Legacy:** `perfil.html?id={usuarioId}` → **301** al canónico.
- **Landings geo:** `/{pais}/{estado}/{ciudad}[/{categoria}]`
- **Landings categoría:** `/categoria/{sector}[/{subcategoriaId}]`
- **Alias 301:** `/p/{perfilId}`, `/negocio/{slug}`, `/anunciante/{slug}`
- **Normalización:** NFD sin acentos; a-z0-9-guión; minúsculas; sin PII en URL.
- **Cambio slug:** 301; **cambio ciudad/cat landing:** 301 landing; perfilId estable.

---

## 3. Indexación

**Matriz estado perfil → indexación:**

| Estado | Robots | Sitemap |
|---|---|---|
| Publicado estándar | index,follow | sí |
| Adulto MVP | noindex,follow | no |
| No verificado | noindex,nofollow | no |
| Explícito | noindex,nofollow,noarchive | no |
| Borrador/revisión | noindex,nofollow | no |
| Suspendido/vencido | noindex | no |

**Thin content:** ThinContentGuard → noindex + canonical superior.
**Sitemaps:** index + segmentados (public, geo, categorías, landings, perfiles, negocios, legales, imágenes); excluir noindex/borradores/adultos MVP/thin.

---

## 4. Contenido adulto (ADR-INDEXACION-ADULTOS O8)

**MVP:** noindex perfiles adultos individuales, resultados dinámicos adultos, no verificados, explícito, stories/lives. Index solo hubs genéricos geo/categoría con contenido suficiente (+18, SafeSearch adult).

**Futuro:** perfiles verificados no explícitos por mercado legal (ANALISIS-REEVALUACION opción F).

**Motores IA:** robots.txt + noai/noimageai + PrivacyGuard en origen. Bots: GPTBot, Google-Extended, PerplexityBot, ClaudeBot, CCBot.

**Age gate:** +18 sin cloaking (paridad crawler + etiquetado adult).

---

## 5. Metadatos y Schema.org

Campos: title (≤60), description (≤160), canonical absoluto, robots, OG (≥1200px image moderada), Twitter Card, JSON-LD.

Schema permitido: WebSite, WebPage, BreadcrumbList, LocalBusiness, Organization, Person (limitado), ItemList, Place. **Prohibido:** AggregateRating inventado, PII, schema engañoso.

PrivacyGuard obligatorio pre-meta.

---

## 6. RenderEngine / Snapshots

- **Estrategia:** ADR-RENDER-STRATEGY snapshot-first híbrido.
- **Fuentes:** RenderEngine (head), FieldEngine (snapshot), Shared/Core (tokens), ValidationEngine (reglas futuras).
- **Contrato:** `RenderSeoInput` → `RenderSeoOutput` (metadata + OG + schema + indexation + renderHash + canonicalHash).
- **Errores:** 404 (no encontrado), 410 (eliminado), 301/302 (redirects).

---

## 7. Landings — contenido mínimo (ThinContentGuard)

| Landing | Umbral |
|---|---|
| País | ≥1 estado activo + 300 chars editorial |
| Estado | ≥1 ciudad activa + 200 chars |
| Ciudad | ≥5 perfiles publicados + 150 chars |
| Ciudad+categoría | ≥3 perfiles geo+cat + 150 chars |
| Categoría | ≥10 perfiles nacional + 400 chars editorial |
| Subcategoría | ≥5 perfiles o canonical a sector |

No cumple → **noindex** + canonical superior + excluir sitemap.

---

## 8. Banners, Interacciones, ThemeEngine, IA, Admin

- **Banners:** landing indexable; creativo NO; no contamina meta; lazy/CLS.
- **Interacciones:** visitas/favoritos/estados/lives/publicaciones/reposts/contactos/premium/propinas → **noindex**.
- **ThemeEngine:** NO modifica canonical/robots/meta; solo tokens autorizados.
- **Agentes IA:** sugiere meta/FAQ/canonical/thin/duplicados; **NO publica/indexa** (RT-08).
- **Admin SEO:** aprobar landing, index/noindex override, thin/duplicados, OG adulto, sitemap; RBAC + auditoría + doble confirmación en acciones críticas.

---

## 9. Requisitos funcionales (RF-SEO-01..18)

Resolver URL · generar metadatos · canonical · robots · sitemap · noindex automático · ThinContentGuard · PrivacyGuard · política adulto · Schema.org · integrar RenderEngine/Admin/IA · matrices · fixtures · 301 legacy · robots.txt bots IA · age gate.

## 10. Requisitos no funcionales (RNF-SEO-01..14)

LCP/CLS/INP · privacidad · seguridad · escalabilidad · Firebase Hosting/CDN · accesibilidad · mobile-first · observabilidad · auditoría.

---

## 11. Contratos principales

`SeoContext` · `SeoSurface` · `SeoRoute` · `CanonicalPolicy` · `IndexationPolicy` · `MetadataPayload` · `SchemaPayload` · `ThinContentDecision` · `AdultIndexationDecision` · `RenderSeoInput/Output` · `SeoAuditEvent` · `SeoAgentSuggestion`

Ver JSON completo para definiciones de campos.

---

## 12. Matrices (resumen)

Incluidas en JSON: url→render, url→indexación, url→canonical, url→sitemap, landing→contenido mínimo, landing→schema, adulto→política, perfil→política, banners→SEO, interacciones→noindex, IA→aprobación, Admin→permisos, error→HTTP.

---

## 13. Fixtures y validación

Golden: `scripts/fixtures-seo-landings-golden.json` (18 casos).
Validación futura: `scripts/validar-spec-seo-landings.mjs`.

---

## 14. Criterios de aceptación

1. Toda superficie indexable tiene meta + canonical + robots + JSON-LD.
2. Perfiles adultos MVP excluidos de index y sitemap.
3. Resultados dinámicos noindex.
4. ThinContentGuard activo.
5. Legacy 301 al canónico.
6. PrivacyGuard sin PII en meta.
7. IA no publica sin aprobación.
8. Admin auditado.
9. Fixtures golden PASS.
10. Coherente con ADRs consumidos.

> No modifica planes/ADRs/actas/capas existentes. Sin runtime/Firestore/deploy/commit.
