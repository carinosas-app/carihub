# PLAN-MAESTRO-SEO-LANDINGS v1.0.0

**Fecha:** 2026-06-10 · **Estado:** PLAN DE DISEÑO DOCUMENTAL
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover archivos · no Firestore · no deploy · no commit · no modifica capas/observaciones/ADRs/actas existentes.

> Consolida `OBSERVACION-ARQUITECTONICA-SEO v1.0.0` (la **referencia y formaliza**, no la modifica) y **consume** `ADR-URL-CANONICA-PERFILES v1.0.0`, `ADR-RENDER-STRATEGY v1.0.0` y `SPEC-RENDERENGINE v1.0.0` (no los redefine).

> **Principio rector:** SEO es una capa **transversal de presentación indexable**: deriva metadatos de datos publicados (FieldEngine + snapshot RenderEngine), nunca duplica la fuente de verdad ni expone datos privados. Geo-primero coherente con Catálogo. Solo superficies públicas se indexan; dashboards/messenger/admin/borradores **siempre noindex**. Sin thin content (umbral mínimo por landing). Adultos con indexación restringida. IA SEO solo sugiere (confirma humano). Admin controla indexación y aprobación de landings.

---

## 1. Inventario SEO actual (con evidencia)

| Elemento | Estado | Evidencia |
|---|---|---|
| Meta on-page | Mínimo | Solo `<meta name="description">` + viewport en `index.html` (L7); resto sin meta propia |
| Canonical | Inexistente | — |
| Open Graph / Twitter | Inexistente | — |
| JSON-LD / Schema.org | Inexistente | — |
| robots.txt | No existe | sin `public/robots.txt` |
| sitemap.xml | No existe | sin `public/sitemap*.xml` |
| URLs | Query-param | `perfil.html?id={usuarioId}` (ADR-URL-CANONICA L13) |
| hreflang / breadcrumbs | Inexistente | — |
| Render | Cliente (CSR) | meta no garantizada a crawlers sin snapshot |

**Gaps:** sin head dinámico, sin canonical, sin OG/Twitter, sin JSON-LD, sin robots/sitemap, URLs no SEO-friendly, sin landings geo/categoría, sin control de indexación, sin ThinContentGuard.

---

## 2. Frontera

- **Es SEO:** metadatos derivados, JSON-LD, OG/Twitter, robots.txt, sitemaps, política index/noindex, registro y reglas de landings, ThinContentGuard, hreflang futuro, breadcrumbs.
- **No es SEO:** pintar HTML (RenderEngine), datos de negocio (FieldEngine), definir URL canónica base (ADR-URL-CANONICA), estrategia de render (ADR-RENDER-STRATEGY), moderar contenido (Admin), personalización visual (ThemeEngine).
- **Regla:** SEO consume el output de RenderEngine y los datos de FieldEngine; no crea HTML paralelo ni fuente de verdad duplicada.

---

## 3. Módulos internos

MetaResolver · SchemaBuilder (JSON-LD) · CanonicalResolver · OpenGraphBuilder · BreadcrumbBuilder · SitemapGenerator · RobotsPolicy · LandingRegistry · ThinContentGuard · IndexationController · GeoTaxonomyMapper · HreflangResolver (futuro) · SeoModerationQueue (Admin) · SeoIAAdvisor.

---

## 4. Mapa de landings (15 tipos)

| Landing | Patrón | Index | Contenido mínimo | Schema | Estado |
|---|---|---|---|---|---|
| País | `/{pais}` | sí | ≥1 estado activo + texto hub | WebSite+Breadcrumb | futuro |
| Estado | `/{pais}/{estado}` | sí | ≥1 ciudad activa | Breadcrumb | futuro |
| Ciudad | `/{pais}/{estado}/{ciudad}` | condicional | ≥ umbral perfiles | Breadcrumb | futuro |
| Municipio/zona/colonia | `.../{zona}` | condicional | alto umbral (anti-solapamiento) | — | futuro lejano |
| Categoría | `/categoria/{sector}` | sí | editorial admin + perfiles | — | futuro |
| Subcategoría | `/categoria/{sector}/{subcatId}` | condicional | único o canonical a sector | — | futuro |
| Ciudad+Categoría | `/{pais}/{estado}/{ciudad}/{categoria}` | condicional | ≥ umbral geo+cat (la más valiosa) | Breadcrumb+ItemList | futuro (alta) |
| Estado+Categoría | `/{pais}/{estado}/{categoria}` | condicional | — | — | futuro |
| País+Categoría | `/{pais}/{categoria}` | condicional | — | — | futuro |
| Perfil | `/perfil/{perfilId}/{slug}` | condicional | publicado; borrador→noindex | Person | **P0** |
| Negocio | `/perfil/{perfilId}/{slug}` (negocio) | condicional | — | LocalBusiness | futuro |
| Anunciante | alias → 301 | no (alias) | — | — | futuro |
| Campañas | `/campana/{slug}` | no por defecto | efímero/comercial | — | futuro lejano |
| Landing SEO banners | landing con slot | sí (la landing; creativo no) | — | — | futuro |
| Landing SEO interacciones | stories/lives | no (efímero noindex/noarchive) | — | — | futuro |

---

## 5. Estrategia URL y slugs (consume ADR-URL-CANONICA)

- **Canónico perfil:** `/perfil/{perfilId}/{slug}` con canonical a forma con `perfilId` estable (inmutable; bridge `perfilId=usuarioId` legacy).
- **Slug:** derivado de nombre público + geo/categoría; sin PII; normalizado; cambio → 301.
- **Landings geo/categoría:** patrón O5 `/{pais}/{estado}/{ciudad}/{categoria}/...` (no como canónico de perfil).
- **Alias:** `/p/{perfilId}`, `/negocio/{slug}`, `/anunciante/{slug}` → 301 al canónico.
- **Migración:** `perfil.html?id=` → 301 a ruta canónica al activar RenderEngine.

---

## 6-9. Indexación, canonical, sitemap, robots

- **Index:** home, resultados (cuidando parámetros), perfil publicado, landings con contenido suficiente, legales.
- **Noindex:** dashboards, admin, messenger, borradores, perfil no publicado, stories/lives expirados, login, previews de tema, landings sin contenido, facetas infinitas.
- **Canonical + redirecciones:** self-canonical; **301** para cambio de slug, alias vanity, query-param legacy, http→https, trailing slash, mayúsculas; **302** solo temporales; facetas/paginación con canonical a base.
- **Sitemap:** index + segmentos (perfiles publicados no-adultos, landings geo, landings categoría, legales, imágenes); exclusión de noindex/adultos/thin; máx 50k URLs/50MB; `lastmod` desde snapshot.
- **Robots:** allow público; disallow `/admin /messenger /dashboard /cuenta /preview` y `*?borrador=`; referencia a sitemap; staging `Disallow: /` + noindex global. (robots no es privacidad: lo privado va tras auth + noindex + reglas Firestore.)

---

## 10-11. Geo y categoría

- **Geo:** jerarquía país → estado → ciudad → (municipio/zona/colonia futuras) alineada al Catálogo; SEO local con `LocalBusiness`/NAP; **"cerca de mí"** no genera URL indexable (canonical a landing ciudad/ciudad+categoría); anti-duplicados por canonical + umbral.
- **Categoría:** sector → `subcategoriaId` (462); subcategorías de baja demanda → noindex o canonical a sector hasta tener contenido único; contenido editorial admin por hub; alias de búsqueda → canonical oficial.

---

## 12-15. Perfiles/negocios, adultos, Schema.org, social

- **Perfil:** `Person`; title/description desde `camposPublicosPerfil` (FieldEngine); OG con imagen moderada.
- **Negocio:** `LocalBusiness`/`ProfessionalService` según arquetipo; horarios/NAP/verificaciones reales (sin schema falso).
- **Adultos:** indexación restringida (noindex donde aplique legal), previews OG moderados, posible noarchive/nosnippet.
- **Schema.org:** `Person`, `LocalBusiness`, `Organization`, `BreadcrumbList`, `WebSite`+`SearchAction`, `ItemList`; generado por RenderEngine/SchemaBuilder desde datos publicados; validado con Rich Results.
- **Social:** OG (`og:image` ≥1200px, `og:url` canónico) + Twitter `summary_large_image`; fallback por tipoPerfil; previews adultos moderados.

---

## 16. Control SEO desde Admin

Aprobar/rechazar landing · indexar/desindexar manual (override) · marcar thin content · fusionar duplicados (canonical) · editar contenido editorial de hubs · aprobar previews OG sensibles · revisar sugerencias IA. RBAC por scope geo/categoría (PLAN-MAESTRO-ADMIN); toda acción en AuditTrail.

---

## 17. Políticas

- **Thin content:** landing geo/categoría indexable solo si supera umbral mínimo de perfiles/contenido único; si no → noindex (ThinContentGuard).
- **Duplicados:** self-canonical, 301 de alias, canonical de facetas/paginación; no clonar contenido entre landings.
- **Datos sensibles en URL:** prohibido PII en slugs; `perfilId` opaco; sin teléfono/email/INE.
- **"Cerca de mí":** no indexable; canonical a landing geo equivalente.
- **Landings geo/categoría sin contenido:** noindex hasta umbral; contenido editorial admin obligatorio para categoría.
- **Adultos:** indexación restringida + previews moderados + posible noarchive/nosnippet.

---

## 18. Integraciones

Shared/Core (URL/slug helpers) · RenderEngine (inyecta head/meta/JSON-LD/canonical; PrivacyGuard) · ValidationEngine (valida acciones SEO futuras) · FieldEngine (`camposPublicosPerfil` → meta) · App Pública (superficies indexables) · Registro/Cuenta (publicación/edad condiciona) · Dashboards (siempre noindex) · Admin (control/aprobación/moderación) · Banners (landings con slots; creativos no indexan) · Interacciones (efímeros noindex/noarchive) · ThemeEngine (CWV/semántica/alt, no altera canónico) · Agentes IA (SeoIAAdvisor sugiere, confirma humano, auditoría) · Catálogo (sectores/subcat/geo → landings/sitemap) · Seguridad MVP (rate-limit IA, gates adultos).

---

## 19. Matrices

- **URL → indexación:** home/resultados index; perfil publicado index condicional; borrador/dashboard/admin/messenger noindex; efímero noindex/noarchive.
- **Landing → contenido mínimo:** país ≥1 estado; estado ≥1 ciudad; ciudad ≥ umbral perfiles; ciudad+categoría ≥ umbral geo+cat; subcategoría único o canonical a sector.
- **Geo → categoría:** `{geoKey} x {categoriaKey}` → landing candidata; indexable solo si supera ThinContentGuard.
- **Sitemap → página:** perfil publicado no-adulto → sitemap-perfiles; landing geo/categoría index → sus sitemaps; legal → sitemap-legales; noindex/borrador/adulto restringido → excluido.
- **Canonical → redirección:** slug cambiado/alias/query legacy/http/trailing/case → 301; faceta/paginación → canonical a base.
- **Contenido adulto → index/noindex:** perfil adulto → noindex o index-restringido; preview OG → moderado; landing adulta → noindex salvo safe-listing.
- **Admin → acción SEO:** indexar/desindexar, aprobar landing, marcar thin/duplicado, editar hub — con scope + auditoría.
- **IA SEO → acción → aprobación:** sugerir title/description/keywords → confirma humano; detectar thin → automático (alerta); prohibido publicar sin confirmación, keyword stuffing, schema falso, indexar sin aprobación.

---

## 20. Riesgos

| ID | Nivel | Riesgo | Mitigación |
|---|---|---|---|
| SEO-R01 | crítico | Indexar borradores/perfiles no publicados/dashboards (fuga privacidad) | noindex por defecto + PrivacyGuard + robots disallow + IndexationController |
| SEO-R02 | alto | Thin content masivo (462 subcategorías) | ThinContentGuard + umbral + canonical a sector + editorial admin |
| SEO-R03 | alto | URLs inestables al migrar usuarios→perfiles | canónico perfilId estable (ADR-URL-CANONICA) + 301 legacy |
| SEO-R04 | alto | Meta no visible a crawlers (render solo-cliente) | snapshot-first (ADR-RENDER-STRATEGY); head server/edge |
| SEO-R05 | medio | Schema falso → rich result penalties | JSON-LD desde datos reales; validación Rich Results |
| SEO-R06 | medio | Duplicados por landings solapadas | canonical preferente + matriz geoCategoría + umbral |
| SEO-R07 | medio | OG adultos sin moderar | SeoModerationQueue + previews moderados + noarchive |
| SEO-R08 | medio | IA SEO keyword stuffing / meta sin revisar | sugiere; confirma humano; rate-limit; auditoría |
| SEO-R09 | medio | Parámetros query → crawl budget e índice basura | canonical a base, noindex facetas, robots parámetros |
| SEO-R10 | bajo | PII en URLs/slugs | perfilId opaco; prohibición PII; normalización |
| SEO-R11 | bajo | Indexar staging por robots mal configurado | staging Disallow:/ + noindex global |

---

## 21. Dependencias

- **Congeladas:** Shared/Core 1.0.0 · RenderEngine 1.0.0 · ValidationEngine 1.1.0 · FieldEngine 1.0.1 · Dashboards 1.0.0 · Catálogo 1.0.0 · Seguridad MVP 1.0.0.
- **ADRs:** URL-CANONICA-PERFILES 1.0.0 · RENDER-STRATEGY 1.0.0.
- **Planes:** APP-PUBLICA · BANNERS · ANEXO-BANNERS · INTERACCIONES · THEMEENGINE · AGENTES-IA · ADMIN.
- **Observación base:** SEO v1.0.0.
- **Precondiciones:** RenderEngine runtime (head/meta/JSON-LD) · migración usuarios→perfiles con canónico estable · snapshots publicados · política indexación adultos · umbral thin content definido por Admin.

---

## 22. Estructura ideal futura (lógica; sin crear carpetas)

Capa SEO: MetaResolver + SchemaBuilder + CanonicalResolver + OpenGraphBuilder + BreadcrumbBuilder + SitemapGenerator + RobotsPolicy + LandingRegistry + ThinContentGuard + IndexationController + GeoTaxonomyMapper + HreflangResolver + SeoModerationQueue + SeoIAAdvisor. Separación: SEO (metadatos/índice) ⟂ RenderEngine (pintado) ⟂ FieldEngine (datos) ⟂ Admin (moderación) ⟂ ADRs (URL/render decididas).

---

## 23. Rutas sugeridas

- **Públicas:** `/{pais}`, `/{pais}/{estado}`, `/{pais}/{estado}/{ciudad}`, `/{pais}/{estado}/{ciudad}/{categoria}`, `/categoria/{sector}`, `/categoria/{sector}/{subcategoriaId}`, `/perfil/{perfilId}/{slug}`, `/sitemap.xml`, `/robots.txt`.
- **Admin:** `/admin/seo/landings`, `/admin/seo/indexacion`, `/admin/seo/thin-content`, `/admin/seo/duplicados`, `/admin/seo/moderacion-og`.

---

## 24. Orden recomendado de implementación

1. **P0** — robots.txt + sitemap básico + canonical + meta description por página (vía RenderEngine head) → cierra SEO-R01/R04 base.
2. **P0** — Perfil público indexable: ruta canónica perfilId+slug, 301 desde query-param, Schema Person, OG/Twitter, noindex borradores → cierra SEO-R03.
3. **P1** — IndexationController + ThinContentGuard + sitemap-perfiles (solo publicados, no adultos) → cierra SEO-R02/R07.
4. **P1** — Landings geo (país/estado/ciudad) + ciudad+categoría con umbral + BreadcrumbList + sitemaps geo/categoría → cierra SEO-R06.
5. **P2** — Landings categoría/subcategoría con contenido editorial admin + canonical a sector para thin → cierra SEO-R02.
6. **P2** — Control SEO desde Admin (aprobación/indexación/duplicados/moderación OG) + SeoModerationQueue.
7. **P2** — SeoIAAdvisor (sugerencias con confirmación humana + auditoría) → cierra SEO-R08.
8. **P3** — Hreflang/multidioma + SEO local avanzado (GBP) + landings campañas/banners/interacciones.

---

## 25. Procedencia

**Sí procede** `PLAN-MAESTRO-SEO-LANDINGS.md/json` — entregados. La observación SEO v1.0.0 es visión general (`specSEO: NO_INICIAR`); este plan la formaliza en arquitectura accionable consumiendo los ADRs de URL y render ya decididos, sin iniciar SPEC ni runtime.

**Siguientes pasos sugeridos:** `SPEC-SEO-LANDINGS` (post RenderEngine runtime) · `ADR-INDEXACION-ADULTOS` (política legal específica) · definir umbral numérico de `ThinContentGuard` con datos reales.

> No modifica la observación SEO v1.0.0, los ADRs (se consumen), ni capas/planes/actas existentes. Sin cambios en producción/Firestore/deploy/commit.
