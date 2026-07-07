# SEO programático — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

Capa transversal de presentación indexable: metadatos, landings geo/categoría, sitemaps, canonical, JSON-LD. **Hoy es diseño documental** — sin runtime en `public/`.

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `scripts/PLAN-MAESTRO-SEO-LANDINGS.json` | Plan maestro v1.0.0 |
| `scripts/PLAN-MAESTRO-SEO-LANDINGS.md` | Versión legible |
| `docs/seo/SEO-001-KEYWORD-RESEARCH-MAESTRO.md` | Keyword research |
| `docs/seo/SEO-001-sistema-maestro-keyword-research.md` | Sistema keywords |
| `scripts/OBSERVACION-ARQUITECTONICA-SEO.json` | Observación base (referenciada, no modificar) |
| ADRs consumidos (en scripts): `ADR-URL-CANONICA-PERFILES`, `ADR-RENDER-STRATEGY`, `SPEC-RENDERENGINE` | Decisiones congeladas |

**Runtime actual (verificado ausente):**

- No `public/robots.txt`
- No `public/sitemap*.xml`
- Sin canonical/OG/Twitter/JSON-LD en páginas principales (solo description básica en `index.html`)

---

## Flujo funcional (diseño futuro)

```
FieldEngine + datos publicados
    → RenderEngine snapshot (head/meta/JSON-LD)
    → SEO deriva title, description, canonical
    → Landings geo × categoría (ThinContentGuard)
    → Sitemap + robots
    → Crawlers indexan solo superficies públicas aprobadas
```

**Principio rector:** SEO consume output de RenderEngine; no duplica fuente de verdad.

---

## Dependencias

- `registro-schema-index.js` / catálogo subcategorías
- Geo catálogos
- `perfil-publico.html` / URLs canónicas (ADR)
- Admin: control indexación y aprobación landings
- Adultos: indexación restringida por política

---

## Reglas críticas

1. Dashboard, messenger, admin, borradores → **siempre noindex**
2. Sin thin content — umbral mínimo por landing
3. No exponer datos privados en metadatos
4. CSR actual = riesgo crawlers sin RenderEngine snapshot
5. IA SEO solo sugiere; humano confirma

---

## Estado actual

| Ítem | Estado |
|------|--------|
| Plan maestro | `PLAN_DISENO_DOCUMENTAL` |
| On-page meta | Mínimo (index description) |
| Canonical/OG/JSON-LD | Inexistente |
| robots/sitemap | Inexistente |
| Landings programáticas | No implementadas |
| URLs | Query params (`perfil-publico.html?id=`) |

---

## Pendientes

- Implementar RenderEngine snapshot (SPEC congelada)
- robots.txt + sitemap generation
- URLs SEO-friendly / slugs (ADR URL canónica)
- Landings geo × categoría con ThinContentGuard
- Breadcrumbs / BreadcrumbList
- hreflang (futuro)

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Importante** | CSR sin prerender — bajo ranking |
| **Importante** | Indexar dashboards por error |
| **Importante** | Thin content masivo si landings sin guard |
| **Bloqueador launch** | Sin SEO runtime en escala orgánica |

---

## Validaciones necesarias

- Auditoría head en cada página pública
- Lighthouse SEO score baseline
- Verificar noindex en dashboard/admin
- Cuando exista runtime: validar JSON-LD con Google Rich Results

---

## Pendiente de confirmar

- Fecha objetivo implementación RenderEngine
- Política exacta indexación subcategorías adultos
- Si `perfil.html` legacy sigue indexable
