# Acta formal de congelamiento — SEO-Landings CariHub

| Campo | Valor |
|---|---|
| **Versión acta** | 1.0.0 |
| **Versión SEO-Landings** | `seo-landings-2026-06-11` @ **1.0.0** |
| **Fecha congelamiento** | 2026-06-11 |
| **Estado** | **CONGELADO** |
| **Veredicto final** | **PASS** (11/11 validación acta; 19/19 auditoría SPEC) |
| **¿Procede congelamiento?** | **SÍ** |
| **Modo** | Solo documentación — **sin runtime/Firestore/deploy/commit; no modifica documentos existentes** |

Canónico: [`ACTA-CONGELAMIENTO-SEO-LANDINGS.json`](./ACTA-CONGELAMIENTO-SEO-LANDINGS.json)

Baseline: [`SPEC-SEO-LANDINGS.md`](./SPEC-SEO-LANDINGS.md) · [`fixtures-seo-landings-golden.json`](./fixtures-seo-landings-golden.json) · [`AUDITORIA-SPEC-SEO-LANDINGS.md`](./AUDITORIA-SPEC-SEO-LANDINGS.md)

---

## Autorización

- **Estado:** APROBADA por product owner / usuario CariHub.
- **Alcance:** baseline de **diseño** SEO-Landings v1.0.0 — referencia **obligatoria** para implementación futura de SEO, indexación, URLs, metadatos, sitemaps, render SEO y crecimiento orgánico.
- **Runtime:** NO autorizado en este congelamiento.

---

## Documentos fuente validados

| Documento | Resultado |
|---|---|
| PLAN-MAESTRO-SEO-LANDINGS v1.0.0 | PASS |
| ADR-INDEXACION-ADULTOS v1.0.0 (O8) | PASS |
| ANALISIS-REEVALUACION-INDEXACION-PERFILES-ADULTOS v1.0.0 | PASS |
| SPEC-SEO-LANDINGS v1.0.0 | PASS |
| fixtures-seo-landings-golden.json (18 casos) | PASS |
| AUDITORIA-SPEC-SEO-LANDINGS v1.0.0 | PASS |
| ADR-URL-CANONICA-PERFILES v1.0.0 | PASS |
| ADR-RENDER-STRATEGY v1.0.0 | PASS |
| ACTA-CONGELAMIENTO-SHARED-CORE v1.0.0 | PASS (dependencia) |
| ACTA-CONGELAMIENTO-RENDERENGINE v1.0.0 | PASS (dependencia) |
| AUDITORIA-ARQUITECTONICA-GLOBAL-CARIHUB | PASS (coherencia) |

**Bloqueantes:** 0

---

## Alcance congelado

- **Superficies SEO:** Home indexable; landings geo/cat; perfiles/negocios condicionados; políticas noindex (resultados, privados, adultos, social).
- **URLs/slugs/canonical:** `/perfil/{perfilId}/{slug}`; landings geo; normalización; 301 legacy; canonical obligatorio.
- **Indexación:** robots meta/txt; sitemaps segmentados; ThinContentGuard; AdultIndexationPolicy O8.
- **Metadatos:** title, description, OG, Twitter, Schema.org, breadcrumbs, PrivacyGuard SEO.
- **Render SEO:** RenderSeoInput/Output; integración RenderEngine; snapshot-first.
- **SEO Admin:** override indexación, auditoría, RBAC.
- **SEO IA:** sugerencias; deny-write RT-08.

## Alcance NO congelado

- Runtime SEO (deploy sitemap/robots/SSR)
- Firestore colecciones SEO
- Validador `validar-spec-seo-landings.mjs`
- Umbrales ThinContentGuard calibrados (propuesta numérica)
- Internacional/hreflang/multidioma
- SEO premium/economía social/marketplace
- Indexación futura perfiles adultos verificados (requiere ADR v1.1+)

---

## Dependencias congeladas

| Dependencia | Versión | Rol |
|---|---|---|
| Shared/Core | 1.0.0 | tokens, helpers URL |
| RenderEngine | 1.0.0 | renderHead, PrivacyGuard |
| FieldEngine | 1.0.1 | snapshot publicado |
| ValidationEngine | 1.1.0 | reglas seo futuras |
| Catálogo | 1.0.0 | geo/taxonomía |
| Seguridad MVP | 1.0.0 | gates edad |
| Admin | plan v1.0.0 | RBAC, auditoría |
| ThemeEngine | plan v1.0.0 | no alterar SEO head |
| Agentes IA | plan v1.0.0 | RT-08 deny-write |

---

## Contratos congelados

`SeoContext` · `SeoSurface` · `SeoRoute` · `CanonicalPolicy` · `IndexationPolicy` · `RobotsPolicy` · `SitemapEntry` · `MetadataPayload` · `SchemaPayload` · `ThinContentDecision` · `AdultIndexationDecision` · `RenderSeoInput` · `RenderSeoOutput` · `SeoAuditEvent` · `SeoAdminAction` · `SeoAgentSuggestion`

## Matrices congeladas

URL→render · URL→indexación · URL→canonical · URL→sitemap · Landing→contenido mínimo · Landing→schema · Landing→robots · Landing→index/noindex · Adulto→política · Perfil→política · Estado perfil→indexación · IA→permisos · Admin→permisos · Banners · Interacciones · ThemeEngine · Error→HTTP

---

## Reglas congeladas (obligatorias)

1. Home **indexable**
2. Resultados dinámicos **noindex**
3. Perfiles adultos MVP **noindex**
4. Perfiles explícitos **noindex** (siempre)
5. Perfiles no verificados **noindex** (siempre)
6. **ThinContentGuard** obligatorio
7. **Canonical** obligatorio
8. **Sitemap segmentado** obligatorio
9. **OG moderado** en adultos
10. **Protección de datos** (PrivacyGuard)
11. Separación SEO público vs privado
12. IA **no publica/indexa** sin aprobación

---

## Decisiones aceptadas (12)

O8 adultos híbrida · canónico `/perfil/{perfilId}/{slug}` · snapshot-first render · resultados noindex · ThinContentGuard · sitemaps segmentados · hubs adultos +18 · legacy 301 · bots IA defensa profundidad · mantener MVP noindex adultos (ANALISIS) · IA sugiere/Admin aprueba · cerca de mí noindex.

## Decisiones rechazadas (10)

Indexar todos perfiles adultos MVP · indexar resultados dinámicos · indexar premium · indexar estados/lives · indexar actividad social · indexar privado · exponer datos sensibles · O1 indexación agresiva · IA auto-publica SEO.

---

## Riesgos

**Aceptados (con mitigación congelada):** thin content masivo · crecimiento geo · adulto/SafeSearch · bots IA · internacionalización futura documentada.

**Abiertos:** hreflang · internacional · calibración ThinContentGuard · política futura verificados · cloaking age gate · validador pendiente · SSR resultados temporal.

---

## Cambios de gobernanza

### Prohibidos sin ADR
Política indexación adultos · URL canónica · canonical/robots/sitemap strategy · ThinContentGuard · render strategy SEO · PrivacyGuard SEO.

### Requieren ADR
Indexación verificados futuro · internacional · multidioma/hreflang · nuevas superficies indexables · cambios canonical/render globales.

### Requieren nueva SPEC
SEO internacional · multidioma · premium · economía social · marketplace.

### Requieren nueva acta
SPEC 1.1+ · cambios contratos · cambios matrices · cambios políticas base.

---

## Observaciones (no bloquean)

| ID | Tema |
|---|---|
| SEO-AM-01 | Validador `.mjs` pendiente |
| SEO-AM-02 | Umbrales ThinContentGuard calibrables |
| SEO-AM-03 | Hreflang fuera MVP |
| SEO-AM-04 | SSR resultados temporal |
| SEO-AM-05 | Age gate vs cloaking — QA |

---

## Compatibilidad futura

SEO consume RenderEngine head (no HTML paralelo) · meta desde FieldEngine snapshot · Admin override auditado · IA RT-08 · ThemeEngine restringido · internacional vía ADR · adultos futuro vía ADR v1.1+ (opción F ANALISIS).

---

## Veredicto final

| Pregunta | Respuesta |
|---|---|
| **PASS o FAIL** | **PASS** |
| **¿Procede congelamiento?** | **SÍ** |
| **Versión congelada** | **1.0.0** |
| **Fecha** | **2026-06-11** |
| **Tipo** | Congelamiento **diseño documental** (runtime no autorizado) |

> No modifica planes, ADRs, actas ni capas existentes. Sin runtime/Firestore/deploy/commit.
