# SEO-001 — Sistema Maestro de Keyword Research / Análisis de Palabras Clave

| Campo | Valor |
|-------|-------|
| **ID** | SEO-001 |
| **Estado** | DISEÑO — sin implementación |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-07-03 |
| **Alcance** | Arquitectura de investigación, análisis y orquestación léxica SEO escalable |
| **No implementa** | Runtime, Firestore, código, deploy |

> **Principio rector:** Las palabras clave **no son contenido** ni fuente de verdad de negocio. Son **capa de inteligencia léxica** que alimenta landings, metadatos y enlazado — siempre derivados de Catálogo + Geo + datos publicados (FieldEngine), nunca duplicando perfiles ni inventando oferta.

---

## Relación con documentos existentes

```
Catálogo 1.0.0 (462 subcategorías, aliases búsqueda)
    → SEO-001 (Keyword Research — ESTE)
    → PLAN-MAESTRO-SEO-LANDINGS / SPEC-SEO-LANDINGS
    → RenderEngine (head, schema, OG)
    → App Pública (URLs indexables)
```

| Documento | Rol | SEO-001 |
|-----------|-----|---------|
| `PLAN-MAESTRO-SEO-LANDINGS` | Landings, indexación, thin content | **Consume** salida de SEO-001 |
| `SPEC-SEO-LANDINGS` | Contratos MetaResolver, ThinContentGuard | **Extiende** con contratos keyword |
| `ACTA-CONGELAMIENTO-CATALOGO` | 15 sectores, 462 subcats, `busqueda-enriquecimiento.json` | **Fuente léxica base** |
| `ADR-URL-CANONICA-PERFILES` | URLs canónicas | SEO-001 **propone slugs**; ADR **decide** |
| `ADR-RENDER-STRATEGY` | Snapshot-first | Blueprint SEO se materializa en render |
| `ADR-INDEXACION-ADULTOS` | Política indexación | Keywords adultas: restringidas |

SEO-001 **no modifica** planes, ADRs, actas ni catálogo congelado.

---

## 1. Arquitectura completa

### 1.1 Visión del sistema

El **Sistema Maestro de Keyword Research (SMKR)** es el cerebro léxico de CariHub: define **qué buscar**, **cómo nombrarlo**, **qué intención cubre**, **qué página debe existir** y **qué copy/schema/enlaces** debe generarse — a escala nacional e internacional.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAPA DATOS (congelada / publicada)                    │
│  Catálogo · GeoTaxonomía · busqueda-enriquecimiento · ProfileSnapshot   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────────┐
│              SEO-001 — SISTEMA MAESTRO KEYWORD RESEARCH                  │
│                                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────────┐   │
│  │ Keyword     │  │ LocalKeyword │  │ SearchIntent + Metrics      │   │
│  │ Registry    │  │ Matrix       │  │ Engine                      │   │
│  └──────┬──────┘  └──────┬───────┘  └──────────────┬──────────────┘   │
│         │                │                          │                    │
│  ┌──────▼────────────────▼──────────────────────────▼──────────────┐   │
│  │              PageSeoBlueprint Generator                          │   │
│  │  Title · Meta · H1/H2 · Slug · OG · Twitter · Schema · Links     │   │
│  └──────────────────────────────┬───────────────────────────────────┘   │
│                                 │                                        │
│  ┌──────────────────────────────▼───────────────────────────────────┐   │
│  │ AutoPageEligibilityEngine + NegativeKeywordGuard + CannibalGuard │   │
│  └──────────────────────────────┬───────────────────────────────────┘   │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────────┐
│           SPEC-SEO-LANDINGS (MetaResolver, SchemaBuilder, etc.)         │
│           RenderEngine · IndexationController · ThinContentGuard         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Módulos internos

| Módulo | Responsabilidad |
|--------|------------------|
| **KeywordRegistry** | Catálogo canónico de keywords (head + long tail); IDs estables |
| **KeywordClusterEngine** | Agrupa variantes bajo keyword primaria; evita duplicados |
| **SynonymVariantResolver** | Sinónimos, typos, variantes regionales (MX, LATAM, ES) |
| **LocalKeywordMatrix** | Producto cartesiano controlado: `{geoKey} × {categoriaKey}` |
| **SearchIntentClassifier** | informacional · comercial · navegacional · transaccional |
| **KeywordMetricsStore** | Volumen estimado, dificultad SEO, competencia, tendencia |
| **NegativeKeywordRegistry** | Exclusiones por superficie, sector, geo, legal |
| **UrlSlugPlanner** | Slugs amigables alineados ADR-URL; normalización NFD |
| **PageCopyGenerator** | Plantillas + variables → title, meta, H1, H2 |
| **SocialCardGenerator** | Open Graph + Twitter Cards desde blueprint |
| **SchemaKeywordMapper** | Mapeo keyword → tipos Schema.org aplicables |
| **InternalLinkGraph** | Reglas y pesos de enlazado interno contextual |
| **AutoPageEligibilityEngine** | ¿Crear/indexar landing? Umbral contenido + oportunidad keyword |
| **CannibalizationGuard** | Detecta solapamiento keyword entre landings |
| **LocalizationKeywordLayer** | Multiidioma, hreflang, variantes por mercado |
| **KeywordDataProvider** *(futuro)* | Abstracción APIs externas (GSC, Semrush, etc.) |
| **SeoIAKeywordAdvisor** | Sugiere clusters/FAQ/copy; **nunca publica** (RT-08) |
| **KeywordAuditTrail** | Trazabilidad cambios léxicos y aprobaciones Admin |

### 1.3 Tipos de keyword

| Tipo | Definición | Ejemplo CariHub |
|------|------------|-----------------|
| **Head Keyword** | Término corto, alto volumen, alta competencia | `escorts`, `abogados`, `restaurantes` |
| **Long Tail Keyword** | Frase específica, menor volumen, mayor intención | `escorts en polanco cdmx`, `abogado laboral veracruz` |
| **Local Keyword** | Head/long tail + geo explícita | `{subcategoria} en {ciudad} {estado}` |
| **Branded** | Marca CariHub o nombre perfil | `carihub`, `perfil {nombrePublico}` |
| **Negative** | Término a excluir de indexación/ads/copy | PII, ilegal, competidor, spam |

### 1.4 Matriz de expansión geo × categoría

Jerarquía geo (alineada Catálogo + `GeoTaxonomyMapper`):

```
País (paisSlug)
 └── Estado (estadoSlug)
      └── Ciudad (ciudadSlug)
           └── [futuro] Zona/Colonia
```

Jerarquía categoría (Catálogo congelado):

```
Sector (sectorId / sectorSlug) — 15 sectores
 └── Subcategoría (subcategoriaId) — 462 únicas
```

**Combinaciones indexables candidatas** (prioridad SPEC-SEO-LANDINGS):

| Nivel landing | Patrón URL | Keyword pattern |
|---------------|------------|-----------------|
| País | `/{pais}` | `{sector} en {pais}` |
| Estado | `/{pais}/{estado}` | `{sector} en {estado}` |
| Ciudad | `/{pais}/{estado}/{ciudad}` | `{subcategoria} en {ciudad}` |
| Ciudad+Categoría | `/{pais}/{estado}/{ciudad}/{categoria}` | **prioridad alta** local |
| Categoría nacional | `/categoria/{sector}` | `{sector} México` |
| Subcategoría | `/categoria/{sector}/{subcategoriaId}` | head long tail sector |

**Regla anti-explosión:** no toda combinación genera página. `AutoPageEligibilityEngine` + `ThinContentGuard` + `CannibalizationGuard` filtran.

### 1.5 Intención de búsqueda

| Intención | Señal usuario | Estrategia copy CariHub |
|-----------|---------------|-------------------------|
| **Informacional** | qué es, cómo, guía | H1 educativo, FAQ schema, enlaces a hubs |
| **Comercial** | mejores, comparar, top | ItemList, filtros, listado perfiles |
| **Navegacional** | carihub, {marca} | WebSite, SearchAction, brand SERP |
| **Transaccional** | contactar, cerca, ahora, tel | CTA fuerte, LocalBusiness, geo precisa |

Cada `Keyword` lleva `intentPrimary` + `intentSecondary[]`. La intención **gobierna plantilla** de `PageSeoBlueprint`, no el ranking interno de perfiles.

### 1.6 Generación automática de assets on-page

`PageSeoBlueprintGenerator` produce paquete **derivado**, no fuente de verdad:

| Asset | Reglas |
|-------|--------|
| **Title** | ≤60 chars; `{keywordLocal} \| {geo} \| CariHub`; sin keyword stuffing |
| **Meta Description** | ≤160 chars; intención + CTA + geo |
| **H1** | Una por página; keyword primaria natural |
| **H2** | Secciones: listado, FAQ, zonas cercanas, CTA |
| **Slug** | ADR normalización; sin PII; estable por `landingKey` |
| **Open Graph** | og:title, og:description, og:image≥1200px, og:url=canonical |
| **Twitter Card** | summary_large_image; fallback title/description |
| **Schema.org** | Ver §1.7 |

**Flujo:** `KeywordTarget` + `LandingContext` + `locale` → `PageSeoBlueprint` → `RenderSeoInput` (SPEC-SEO-LANDINGS).

### 1.7 Schema.org por tipo de página

| Superficie | Schema principal | Schema secundario | Fuente datos |
|------------|------------------|-------------------|--------------|
| Home | WebSite, SearchAction | Organization | estático |
| País/Estado/Ciudad | WebPage, BreadcrumbList | Place | GeoTaxonomy |
| Ciudad+Categoría | WebPage, ItemList | BreadcrumbList, LocalBusiness* | perfiles públicos |
| Categoría hub | WebPage, ItemList | FAQPage (si editorial) | admin editorial |
| Perfil persona | Person (limitado) | BreadcrumbList | FieldEngine snapshot |
| Perfil negocio | LocalBusiness / ProfessionalService | BreadcrumbList, Review* | snapshot + verificaciones |
| FAQ editorial | FAQPage | — | contenido admin |

\* Review/AggregateRating **solo** con datos reales verificados — prohibido inventar (SPEC-SEO-LANDINGS).

`SchemaKeywordMapper` selecciona tipos según `SearchIntent` + `SeoSurface` + política adultos.

### 1.8 Enlazado interno

`InternalLinkGraph` define grafo dirigido con reglas:

```
Home
 ├── País → Estado → Ciudad → Ciudad+Categoría (prioridad)
 ├── Categoría nacional → Subcategoría
 └── Perfil (solo desde listados/contexto)

Ciudad+Categoría ←→ Ciudades vecinas (misma cat)
Ciudad+Categoría ←→ Misma ciudad otras categorías relacionadas (Catálogo)
Perfil → Ciudad+Categoría canónica (breadcrumb + contextual)
```

| Regla | Descripción |
|-------|-------------|
| IL-01 | Toda landing indexable tiene ≥1 enlace entrante desde nivel superior |
| IL-02 | Máx 150 enlaces salientes por landing (crawl budget) |
| IL-03 | Anchor text = keyword local natural; no repetir exact match >30% |
| IL-04 | Perfiles adultos MVP: enlazado interno sí; indexación no (ADR O8) |
| IL-05 | BreadcrumbList JSON-LD refleja mismo camino que HTML |

### 1.9 Reglas de creación automática de páginas SEO

Una landing **se materializa e indexa** solo si cumple **ambos** bloques:

**A) Umbral de contenido (ThinContentGuard — SPEC existente)**

| Landing | Mínimo |
|---------|--------|
| Ciudad | ≥5 perfiles publicados + 150 chars editorial |
| Ciudad+Categoría | ≥3 perfiles geo+cat + 150 chars |
| Subcategoría | ≥5 perfiles nacional o canonical a sector |

**B) Umbral keyword (SEO-001 — AutoPageEligibilityEngine)**

| Criterio | Regla |
|----------|-------|
| Oportunidad | `searchVolumeEst >= umbralSector` OR `strategicPriority = alta` (Admin) |
| Cannibalización | `CannibalizationGuard.score < 0.7` vs landing existente |
| Negativas | keyword ∉ NegativeKeywordRegistry |
| Legal/adulto | política ADR-INDEXACION-ADULTOS |
| Duplicado geo | canonical a landing preferente si solapamiento >80% |

**Si no cumple:** `noindex` + canonical superior + excluir sitemap (no crear URL huérfana).

**Si cumple:** registrar en `LandingRegistry` + generar `PageSeoBlueprint` + encolar render SSG.

### 1.10 Multiidioma y expansión internacional

| Concepto | Diseño |
|----------|--------|
| **Locale** | `es-MX` (default), `es-AR`, `es-CO`, `en-US` (futuro) |
| **KeywordSet por locale** | Misma `landingKey`, distinto `KeywordCluster` |
| **Variantes regionales** | `SynonymVariantResolver`: colectivo vs autobús, celular vs móvil |
| **hreflang** | `HreflangResolver` (SPEC futuro): `es-mx`, `es-ar`, `x-default` |
| **URL internacional** | `/{locale}/{pais}/...` o subdominio — **decisión ADR futura**; SEO-001 prepara `locale` en blueprint |
| **Geo internacional** | País distinto = nueva rama `GeoTaxonomy`; no reutilizar slugs MX |

---

## 2. Estructura de datos

### 2.1 Entidades principales

```
Keyword
KeywordCluster
KeywordVariant
KeywordMetrics
LocalKeywordTarget
PageSeoBlueprint
NegativeKeyword
InternalLinkRule
LocaleKeywordSet
KeywordAuditEvent
```

### 2.2 Keyword (canónica)

```json
{
  "keywordId": "kw_escorts_ciudad_cdmx",
  "text": "escorts en ciudad de méxico",
  "normalizedText": "escorts en ciudad de mexico",
  "type": "local_long_tail",
  "intentPrimary": "transaccional",
  "intentSecondary": ["comercial"],
  "clusterId": "cl_escorts_cdmx",
  "locale": "es-MX",
  "geoKey": { "pais": "mexico", "estado": "cdmx", "ciudad": "ciudad-de-mexico" },
  "categoriaKey": { "sectorId": "adultos", "subcategoriaId": "escorts_ciudad" },
  "metrics": { "volumeEst": 12000, "difficulty": 68, "competition": "alta", "trend": "estable" },
  "status": "activa",
  "source": "catalogo_enriquecimiento|admin|ia_sugerida|externa",
  "policyVersion": "seo-kw-1.0.0"
}
```

### 2.3 KeywordCluster

```json
{
  "clusterId": "cl_escorts_cdmx",
  "primaryKeywordId": "kw_escorts_ciudad_cdmx",
  "headKeywordId": "kw_escorts",
  "variantIds": ["kw_escorts_polanco", "kw_escorts_cdmx"],
  "landingKey": "mexico/cdmx/ciudad-de-mexico/adultos/escorts_ciudad",
  "canonicalKeywordId": "kw_escorts_ciudad_cdmx"
}
```

### 2.4 KeywordVariant (sinónimos / regionales)

```json
{
  "variantId": "kv_001",
  "clusterId": "cl_escorts_cdmx",
  "text": "acompañantes en cdmx",
  "variantType": "sinonimo|regional|typo|alias_busqueda",
  "locale": "es-MX",
  "weight": 0.85,
  "source": "busqueda-enriquecimiento.json"
}
```

**Integración Catálogo:** import inicial desde `scripts/busqueda-enriquecimiento.json` (aliases, sinónimos, conflictos). PATCH catálogo = re-sync variantes sin cambiar `keywordId`.

### 2.5 LocalKeywordTarget (matriz)

```json
{
  "targetId": "lkt_0001842",
  "landingKey": "mexico/jalisco/guadalajara/gastronomia/restaurantes",
  "seoSurface": "landing_ciudad_categoria",
  "geoKey": { "pais": "mexico", "estado": "jalisco", "ciudad": "guadalajara" },
  "categoriaKey": { "sectorId": "gastronomia", "subcategoriaId": "restaurantes" },
  "primaryKeywordId": "kw_restaurantes_guadalajara",
  "clusterId": "cl_restaurantes_gdl",
  "eligibility": {
    "contentThresholdMet": true,
    "keywordThresholdMet": true,
    "cannibalScore": 0.22,
    "indexRecommendation": "index"
  },
  "blueprintId": "psb_0001842",
  "locale": "es-MX"
}
```

### 2.6 PageSeoBlueprint (salida generada)

```json
{
  "blueprintId": "psb_0001842",
  "landingKey": "mexico/jalisco/guadalajara/gastronomia/restaurantes",
  "locale": "es-MX",
  "slug": "/mexico/jalisco/guadalajara/gastronomia/restaurantes",
  "canonical": "https://carihub.app/mexico/jalisco/guadalajara/gastronomia/restaurantes",
  "title": "Restaurantes en Guadalajara, Jalisco | CariHub",
  "metaDescription": "Encuentra restaurantes verificados en Guadalajara. Compara perfiles, ubicaciones y contacto directo en CariHub.",
  "h1": "Restaurantes en Guadalajara",
  "h2": ["Perfiles destacados", "Zonas cercanas", "Preguntas frecuentes"],
  "openGraph": { "ogTitle": "...", "ogDescription": "...", "ogImage": "...", "ogUrl": "..." },
  "twitter": { "card": "summary_large_image", "title": "...", "description": "...", "image": "..." },
  "schemaTypes": ["WebPage", "BreadcrumbList", "ItemList"],
  "internalLinks": [
    { "href": "/mexico/jalisco/guadalajara", "anchor": "Guadalajara", "rel": "breadcrumb" },
    { "href": "/categoria/gastronomia", "anchor": "Gastronomía en México", "rel": "hub" }
  ],
  "robots": "index,follow",
  "generatedAt": "2026-07-03T00:00:00Z",
  "generatorVersion": "seo-kw-1.0.0",
  "approvalStatus": "auto|admin_aprobado|pendiente_ia"
}
```

### 2.7 NegativeKeyword

```json
{
  "negativeId": "neg_001",
  "text": "gratis sin registro",
  "matchType": "broad|phrase|exact",
  "scope": { "global": true, "sectors": [], "surfaces": ["all"] },
  "reason": "spam|legal|brand_safety|off_topic",
  "action": "exclude_copy|noindex|block_landing"
}
```

### 2.8 KeywordMetrics (histórico)

```json
{
  "keywordId": "kw_escorts_ciudad_cdmx",
  "period": "2026-06",
  "volumeEst": 12000,
  "difficulty": 68,
  "competitionIndex": 0.82,
  "cpcEst": 1.45,
  "serpFeatures": ["local_pack", "ads"],
  "dataSource": "manual|gsc|provider_externo",
  "confidence": 0.75
}
```

### 2.9 Almacenamiento lógico (futuro runtime)

| Colección / índice | Contenido | Mutabilidad |
|--------------------|-----------|-------------|
| `seo_keywords` | Keyword canónicas | Admin + sync catálogo |
| `seo_clusters` | Clusters | Admin + IA sugerida |
| `seo_variants` | Sinónimos | Sync catálogo PATCH |
| `seo_local_targets` | Matriz geo×cat | Batch + elegibilidad |
| `seo_blueprints` | PageSeoBlueprint | Regenerable desde targets |
| `seo_negative` | Negativas | Admin |
| `seo_metrics` | Time-series | Provider externo |
| `seo_audit` | KeywordAuditEvent | Append-only |

**Índices compuestos clave:** `(landingKey, locale)`, `(geoKey.hash, subcategoriaId)`, `(clusterId)`, `(intentPrimary, sectorId)`.

### 2.10 Contrato con SPEC-SEO-LANDINGS

Extensión de `RenderSeoInput`:

```typescript
// Diseño — no implementar
interface KeywordSeoExtension {
  blueprint?: PageSeoBlueprint;
  primaryKeyword?: Keyword;
  cluster?: KeywordCluster;
  internalLinks?: InternalLinkRule[];
}

// RenderSeoInput existente + keywordExtension
```

`MetaResolver` prioriza: **Admin override > PageSeoBlueprint > plantilla fallback SPEC**.

---

## 3. Integración con arquitectura actual CariHub

### 3.1 Mapa de integraciones

```
┌────────────────┐     aliases/sinónimos      ┌──────────────────┐
│ Catálogo 1.0.0 │ ─────────────────────────► │ KeywordRegistry  │
│ busqueda-      │     sector/subcategoriaId  │ SynonymResolver  │
│ enriquecimiento│                            └────────┬─────────┘
└────────────────┘                                     │
┌────────────────┐     geo slugs activos               │
│ GeoTaxonomy    │ ───────────────────────────────────►│
│ (Catálogo/App) │                                     ▼
└────────────────┘                            ┌──────────────────┐
┌────────────────┐     perfiles publicados    │ LocalKeyword     │
│ FieldEngine    │ ─────────────────────────► │ Matrix           │
│ snapshots      │     camposPublicos         └────────┬─────────┘
└────────────────┘                                     │
                                                         ▼
┌────────────────┐     RenderSeoInput         ┌──────────────────┐
│ RenderEngine   │ ◄───────────────────────── │ PageSeoBlueprint │
│ renderHead()   │                            │ Generator        │
└────────────────┘                            └──────────────────┘
        ▲                                              ▲
        │                                              │
┌───────┴────────┐                            ┌───────┴──────────┐
│ MetaResolver   │                            │ AutoPage         │
│ SchemaBuilder  │                            │ EligibilityEngine│
│ SitemapGen     │                            │ + Admin SEO      │
└────────────────┘                            └──────────────────┘
```

### 3.2 Catálogo (fuente léxica primaria)

| Artefacto catálogo | Uso SEO-001 |
|--------------------|-------------|
| `sectores-carihub.js` / `catalogos-carihub.js` | Head keywords por sector |
| `mapa-registro-categorias.json` | 462 `subcategoriaId` → long tail base |
| `busqueda-enriquecimiento.json` | Sinónimos, aliases, conflictos → `KeywordVariant` |
| `subcategoriaId` | Clave estable en URLs y matriz (no display name) |

**Regla:** display name puede cambiar (PATCH catálogo); `keywordId` y `landingKey` **no** cambian sin acta MAJOR.

### 3.3 FieldEngine → keywords de perfil

Perfiles aportan keywords **derivadas**, no almacenadas como fuente:

- `nombrePublico`, `tagline`, `descripcionPublica` → long tail branded
- `geoPublica` → refuerzo local
- `subcategoriaId`, `sectorId` → cluster assignment
- **PrivacyGuard:** nunca teléfono/email en keyword ni slug

### 3.4 RenderEngine / SPEC-SEO-LANDINGS

SEO-001 alimenta módulos existentes:

| Módulo SPEC | Input SEO-001 |
|-------------|---------------|
| MetaResolver | `PageSeoBlueprint.title/description` |
| CanonicalResolver | `blueprint.canonical` (validar ADR) |
| OpenGraphBuilder | `blueprint.openGraph` |
| SchemaBuilder | `schemaTypes` + datos snapshot |
| BreadcrumbBuilder | `internalLinks` rel=breadcrumb |
| SitemapGenerator | `LocalKeywordTarget` indexables |
| ThinContentGuard | `eligibility.contentThresholdMet` |
| IndexationController | `eligibility.indexRecommendation` |
| SeoIAAdvisor | sugerencias cluster/FAQ → cola aprobación |

### 3.5 Admin SEO

Nuevas vistas lógicas (extienden `/admin/seo/*`):

| Vista | Acciones |
|-------|----------|
| `/admin/seo/keywords` | CRUD keywords, clusters, negativas |
| `/admin/seo/local-matrix` | Simular elegibilidad geo×cat |
| `/admin/seo/blueprints` | Preview title/H1/schema; aprobar IA |
| `/admin/seo/cannibalization` | Resolver conflictos |
| `/admin/seo/metrics` | Importar volumen/dificultad |

RBAC: scope geo/categoría (PLAN-MAESTRO-ADMIN). Auditoría: `KeywordAuditEvent`.

### 3.6 Agentes IA

`SeoIAKeywordAdvisor` extiende `SeoIAAdvisor`:

| Permitido | Prohibido |
|-----------|-----------|
| Sugerir variantes, FAQ, títulos | Publicar/indexar sin humano |
| Detectar cannibalización | Keyword stuffing |
| Proponer negativas | Inventar volumen métricas |
| Agrupar long tail | Modificar catálogo congelado |

RT-08 deny-write; confirmación Admin obligatoria.

---

## 4. Plan de implementación por fases

> **Precondición global:** RenderEngine runtime + SPEC-SEO-LANDINGS P0 (robots, canonical, meta base) según roadmap vigente.

### Fase 0 — Fundación léxica (P0)

**Objetivo:** Registro canónico sin runtime público.

| Entregable | Descripción |
|------------|-------------|
| `SEO-001.json` | Schema entidades §2 |
| Import catálogo | Pipeline `busqueda-enriquecimiento` → KeywordVariant |
| KeywordRegistry seed | 15 sectores + 462 subcats → clusters base |
| Plantillas copy | Title/meta/H1 por intención × superficie |
| NegativeKeyword seed | Lista inicial brand safety + legal |

**Criterio done:** fixtures JSON validables; 0 colisión `keywordId`.

### Fase 1 — Local MX + Blueprints (P1)

**Objetivo:** Generar blueprints para landings geo prioritarias.

| Entregable | Descripción |
|------------|-------------|
| LocalKeywordMatrix MX | Estados + top ciudades × sectores prioritarios |
| PageSeoBlueprintGenerator | Integración contrato RenderSeoInput |
| UrlSlugPlanner | Validación ADR-URL |
| AutoPageEligibility v1 | Contenido (ThinContent) + negativas |
| Admin preview | Vista blueprint read-only |

**Prioridad landings:** ciudad+categoría (SPEC: alta).

### Fase 2 — Métricas + Enlazado + Cannibal (P2)

| Entregable | Descripción |
|------------|-------------|
| KeywordMetricsStore | Import manual CSV + preparación GSC |
| CannibalizationGuard | Score entre clusters |
| InternalLinkGraph | Reglas IL-01..05 materializadas |
| SchemaKeywordMapper | FAQ + ItemList automático |
| Sitemap enrichment | Prioridad por `volumeEst` |

### Fase 3 — Automatización páginas + IA asistida (P2/P3)

| Entregable | Descripción |
|------------|-------------|
| AutoPageEligibility v2 | Umbral keyword + estrategia |
| Batch landing creation | LandingRegistry + SSG trigger |
| SeoIAKeywordAdvisor | Cola sugerencias + aprobación |
| Admin workflows | Aprobar/rechazar blueprints masivo |

### Fase 4 — Multiidioma + Internacional (P3)

| Entregable | Descripción |
|------------|-------------|
| LocalizationKeywordLayer | es-MX, es-AR, es-CO sets |
| SynonymVariantResolver regional | Variantes por país |
| HreflangResolver | Integración SPEC hreflang futuro |
| Geo internacional | País nuevo = rama taxonomy |
| ADR internacional | Decisión URL locale (input SEO-001) |

### Fase 5 — Data providers externos (P4)

| Entregable | Descripción |
|------------|-------------|
| KeywordDataProvider | Abstracción Semrush/Ahrefs/GSC API |
| Refresh métricas batch | confidence score |
| Opportunity dashboard | Admin: gaps keyword vs contenido |

### Cronograma sugerido (dependiente roadmap)

```
M1: Fase 0 (diseño + seed)
M2: Fase 1 (MX blueprints + integración SPEC)
M3: Fase 2 (métricas + enlazado)
M4: Fase 3 (auto páginas + IA)
M5+: Fase 4-5 (i18n + providers)
```

---

## 5. Riesgos y conflictos accionables

Solo riesgos **relevantes** con mitigación concreta:

| ID | Riesgo | Impacto | Mitigación accionable |
|----|--------|---------|----------------------|
| KR-R01 | **Cannibalización** entre landings ciudad+cat similares | Alto | `CannibalizationGuard`; canonical preferente; matriz prioridad Admin |
| KR-R02 | **Explosión combinatoria** 462×N ciudades | Alto | `AutoPageEligibility`; solo top geo; batch; no generar todas las URLs |
| KR-R03 | **Keyword stuffing** vía IA o plantillas | Alto | Límites densidad keyword; revisión humana; RT-08 |
| KR-R04 | **Desalineación** catálogo PATCH vs keywords | Medio | `subcategoriaId` inmutable; sync pipeline; semver PATCH |
| KR-R05 | **Métricas externas** imprecisas | Medio | `confidence` score; no auto-indexar solo por volumen |
| KR-R06 | **Conflicto** slug ADR vs slug keyword-optimized | Medio | `UrlSlugPlanner` valida ADR primero; keyword influye display, no perfilId |
| KR-R07 | **Adulto** indexado por keyword genérica | Alto | NegativeKeyword + ADR O8; hubs +18 separados de perfiles |
| KR-R08 | **Duplicado meta** multi-locale | Medio | `LocaleKeywordSet` obligatorio; hreflang; no copiar es-MX verbatim |

**No bloquean** inicio Fase 0. KR-R01/R02 deben resolverse **antes** de batch auto páginas (Fase 3).

---

## Apéndice A — Plantillas copy (ejemplos)

### Ciudad + Categoría (transaccional)

```
Title: {subcategoriaDisplay} en {ciudad}, {estado} | CariHub
Meta: Encuentra {subcategoriaDisplay} en {ciudad}. Perfiles verificados, ubicación y contacto. Explora en CariHub.
H1: {subcategoriaDisplay} en {ciudad}
H2: Perfiles destacados | Otras zonas de {estado} | Preguntas frecuentes
```

### Categoría nacional (comercial)

```
Title: {sectorDisplay} en México — Directorio | CariHub
Meta: Compara {sectorDisplay} en todo México. Ciudades, perfiles y reseñas en un solo lugar.
H1: {sectorDisplay} en México
```

### Perfil negocio (navegacional/transaccional)

```
Title: {nombrePublico} — {subcategoriaDisplay} en {ciudad} | CariHub
Meta: {taglineTruncada}. Contacta a {nombrePublico} en {ciudad}, {estado}.
H1: {nombrePublico}
```

---

## Apéndice B — Métricas de éxito (diseño)

| KPI | Medición |
|-----|----------|
| Cobertura matriz | % `LocalKeywordTarget` con blueprint |
| Indexabilidad | % targets que pasan elegibilidad |
| Cannibal rate | % clusters con score >0.7 |
| Rich results | % páginas Schema válido |
| CTR orgánico | GSC por landingKey (futuro) |

---

## Definition of Done — SEO-001 (documento)

| Criterio | Cumplido |
|----------|----------|
| Arquitectura SMKR completa | ✅ §1 |
| Head, long tail, local, sinónimos, intención | ✅ §1.3–1.5 |
| Métricas, negativas, URLs | ✅ §1–2 |
| Generación title/meta/H1/H2/OG/Twitter/Schema | ✅ §1.6–1.7 |
| Enlazado interno | ✅ §1.8 |
| Reglas auto páginas | ✅ §1.9 |
| Multiidioma / internacional | ✅ §1.10 |
| Estructura de datos | ✅ §2 |
| Integración CariHub | ✅ §3 |
| Plan por fases | ✅ §4 |
| Riesgos accionables | ✅ §5 |
| No implementa código | ✅ |
| No modifica docs congelados | ✅ |

---

## Referencias

| Documento | Ruta |
|-----------|------|
| PLAN-MAESTRO-SEO-LANDINGS | `scripts/PLAN-MAESTRO-SEO-LANDINGS.md` |
| SPEC-SEO-LANDINGS | `scripts/SPEC-SEO-LANDINGS.md` |
| OBSERVACION-ARQUITECTONICA-SEO | `scripts/OBSERVACION-ARQUITECTONICA-SEO.md` |
| ACTA-CONGELAMIENTO-CATALOGO | `scripts/ACTA-CONGELAMIENTO-CATALOGO.md` |
| busqueda-enriquecimiento | `scripts/busqueda-enriquecimiento.json` |
| ADR-URL-CANONICA | `scripts/ADR-URL-CANONICA-PERFILES.md` |
| ADR-RENDER-STRATEGY | `scripts/ADR-RENDER-STRATEGY.md` |
| ADR-INDEXACION-ADULTOS | `scripts/ADR-INDEXACION-ADULTOS.md` |

---

**Siguiente paso sugerido (post-aprobación):** `SEO-001.json` schema formal + pipeline import catálogo → KeywordRegistry seed (Fase 0, sin runtime).
