# Observación arquitectónica — SEO y descubrimiento orgánico

| Campo | Valor |
|-------|-------|
| **Estado** | **Visión general registrada** (capa NO diseñada) |
| **Ampliación** | **Abierta** — solo visión y líneas de análisis |
| **SPEC SEO** | **NO iniciar** |
| **Versión observación** | 1.0.0 |
| **Fecha** | 2026-06-09 |
| **Runtime / Firestore / APIs** | **NO** |

Canónico: [`OBSERVACION-ARQUITECTONICA-SEO.json`](./OBSERVACION-ARQUITECTONICA-SEO.json)

No modifica las siete capas congeladas ni el roadmap consolidado vigente.

---

## Visión general

Capa transversal futura para **descubrimiento orgánico**: cómo CariHub expone e indexa contenido público (perfiles, categorías, landings geo) en buscadores y redes sociales.

**Principios:** geo-primero · solo superficies públicas indexables · metadatos desde datos publicados (FieldEngine + RenderEngine) · URLs canónicas estables · mobile-first · Schema.org/OG generados (no HTML libre usuario) · adultos con indexación restringida · IA SEO asistida con confirmación.

---

## Líneas de análisis futuro (26)

| ID | Tema |
|----|------|
| SEO-AN-01 | SEO técnico |
| SEO-AN-02 | SEO geográfico |
| SEO-AN-03 | SEO de perfiles públicos |
| SEO-AN-04 | SEO de negocios |
| SEO-AN-05 | SEO de categorías |
| SEO-AN-06 | SEO de contenido |
| SEO-AN-07 | SEO social |
| SEO-AN-08 | SEO de reputación |
| SEO-AN-09 | SEO multidioma |
| SEO-AN-10 | IA SEO |
| SEO-AN-11 | Datos estructurados Schema.org |
| SEO-AN-12 | Landing pages por categoría |
| SEO-AN-13 | Landing pages por ciudad |
| SEO-AN-14 | Landing pages por estado |
| SEO-AN-15 | Landing pages por país |
| SEO-AN-16 | URLs amigables |
| SEO-AN-17 | Sitemap XML |
| SEO-AN-18 | Robots.txt |
| SEO-AN-19 | Open Graph |
| SEO-AN-20 | Twitter Cards |
| SEO-AN-21 | Metadatos dinámicos |
| SEO-AN-22 | Breadcrumbs |
| SEO-AN-23 | SEO local |
| SEO-AN-24 | Core Web Vitals |
| SEO-AN-25 | Mobile First |
| SEO-AN-26 | Indexación móvil |

Cada línea incluye preguntas de análisis en el JSON canónico.

---

## Superficies indexables (tentativo)

**Indexables:** home pública · resultados · perfil publicado · landings geo/categoría · legales.

**No indexables:** dashboards · admin · messenger · borradores · stories expirados · contenido login · previews borrador tema.

---

## Compatibilidades futuras

| Capa | Relación |
|------|----------|
| **RenderEngine** | HTML público, `<head>`, JSON-LD en render |
| **ThemeEngine** | CWV, semántica, alt — no romper SEO on-page |
| **Interacciones** | Contenido efímero — noindex / noarchive |
| **Catálogo 1.0.0** | subcategoriaId, slugs, hubs landings |
| **Dashboards 1.0.0** | Área privada — excluida de índice |
| **ValidationEngine 1.0.0** | Gates publicación meta — acciones futuras |
| **FieldEngine 1.0.1** | `camposPublicosPerfil` → meta/schema |
| **Seguridad MVP 1.0.0** | Rate limits IA SEO, categorías sensibles |

---

## Precondiciones sugeridas (futuro)

- SPEC RenderEngine (head y landings)
- Perfiles con URL canónica estable post-migración
- Slugs geo/catálogo documentados
- Política indexación adultos

## No interrumpir (roadmap vigente)

Interacciones P1 · actas pre-runtime · RenderEngine · ThemeEngine workshop.

---

## Riesgos si se anticipa

Indexar borradores · landings thin content · URLs inestables post-migración · schema engañoso · duplicar meta vs FieldEngine · indexar messenger/admin · OG sin moderar adultos · keyword stuffing IA.

---

*Observación v1.0.0 — visión arquitectónica para eventual SPEC SEO.*
