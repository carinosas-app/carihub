# ADR-INDEXACION-ADULTOS v1.0.0

**Fecha:** 2026-06-10 · **Estado:** PROPUESTA (decisión documental, sin implementar)
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover archivos · no Firestore · no deploy · no commit · no modifica capas/planes/observaciones/ADRs/actas existentes.

> Detalla y oficializa la política de adultos esbozada en `PLAN-MAESTRO-SEO-LANDINGS` (`estrategiaContenidoAdulto`, `SEO-R07`, matriz `contenidoAdultoIndex`). **Consume** `ADR-URL-CANONICA-PERFILES`, `ADR-RENDER-STRATEGY` y `SPEC-RENDERENGINE`. Desbloquea la política de adultos para `SPEC-SEO-LANDINGS`.

---

## 1. Contexto y problema

CariHub tiene un vertical adulto real ([scripts/config-registro-adultos-schema.json](scripts/config-registro-adultos-schema.json)): acompañantes, hotel, spa, sexshop, fetiche/dominación, parejas/singles, shows.

- **Campos públicos:** `alias`, `tagline`, `geo`, `fotoPrincipal`, `galeria`, `sobreMi`, `contactoPublico`, `metodosPago`.
- **Campos privados:** `telefonoContacto`, `whatsappPrivado`, `ineFrente/Reverso`, `selfieVerificacion`, `rfc`, `razonSocial`, `mayorEdadConfirmado`, `terminosAceptados`.

**Tensión:** contenido adulto legal pero de alto riesgo. Indexar agresivamente = riesgo legal/reputacional/privacidad; noindex total = pérdida de descubrimiento y crecimiento. Cuatro ejes de riesgo: **legal, reputacional, SEO, privacidad**.

---

## 2. Definiciones

| Término | Definición |
|---|---|
| Explícito | Desnudez explícita, actos sexuales, material gráfico sexual |
| Sugerente | Insinuante/erótico no explícito, sin desnudez explícita |
| Sensible | Datos/contexto sensibles aunque no explícitos (servicios, ubicación, identidad) |
| Verificado | INE + selfie + `mayorEdadConfirmado` validados |
| No verificado | Sin verificación completa — máxima restricción |
| Categoría sensible | sector/subcategoriaId marcado como adulto en Catálogo |
| Thin content | Sin contenido único suficiente (umbral ThinContentGuard) |

---

## 3. Opciones evaluadas

| Opción | SEO | R. legal | R. reputacional | Privacidad | Veredicto |
|---|---|---|---|---|---|
| O1 Indexar todo público | alta (corto) | muy alto | muy alto | muy bajo | RECHAZADA |
| O2 Noindex todo adulto | nula | mínimo | mínimo | máximo | Fallback seguro |
| O3 Solo landings genéricas | media-alta | bajo | bajo | alto | FUERTE (MVP) |
| O4 Perfiles verificados sin explícito | alta | medio | medio | medio | FUTURO |
| O5 Landings geo/categoría con contenido | alta | bajo | bajo | alto | FUERTE |
| O6 Noindex perfiles sensibles | n/a | bajo | — | — | ADOPTADA (regla) |
| O7 Noindex resultados dinámicos | protege crawl | bajo | — | — | ADOPTADA |
| O8 Híbrida por riesgo | alta y sostenible | controlado | controlado | alto | **RECOMENDADA** |

---

## 4-5. Decisión y recomendaciones

**Decisión: O8 — Política híbrida por riesgo.** noindex conservador por defecto para individuos/explícito; index selectivo de superficies genéricas con contenido suficiente; habilitación futura de perfiles verificados no explícitos por mercado legal.

**MVP:**
- **Index:** landings geo adultas genéricas con contenido suficiente (sin media explícita), landings categoría/geo+categoría con ThinContentGuard superado, páginas legales/+18.
- **Noindex:** todos los perfiles adultos individuales, resultados dinámicos, facetas, no verificados, media explícita, stories/lives.
- **Gate:** puerta +18 + SafeSearch `rating adult`. **OG:** solo landings genéricas con imagen moderada.

**Futuro:** habilitar perfiles adultos **verificados** y **no explícitos**, condicionado a verificación completa, legalidad por país/mercado, OG moderado, snippets limitados y control hreflang. Controles: `max-image-preview:none/standard`, `nosnippet` en campos sensibles, moderación previa.

---

## 6. Qué se indexa / qué permanece noindex

- **Indexable:** landings geo adultas genéricas con contenido, landings categoría/geo+categoría con ThinContentGuard, páginas legales/+18, (futuro) perfiles verificados no explícitos por mercado.
- **Noindex:** perfiles adultos individuales (MVP), no verificados (siempre), explícito (siempre), resultados/facetas, borradores, stories/lives, dashboards/messenger/admin, media explícita.

---

## 7. SafeSearch

- **Etiquetado:** `rating: adult` / RTA (Restricted To Adults) en superficies adultas.
- **Age gate +18:** consentimiento previo; **sin cloaking** (paridad de contenido con el crawler; etiquetar, no servir HTML distinto al bot).
- **Imagen:** `max-image-preview:none` por defecto; `standard` solo futuro para verificados no explícitos.
- **Objetivo:** ser correctamente clasificado como adult (evitar penalización en SERP general).

---

## 8. Políticas por contenido y verificación

- **Explícito:** noindex; sin OG; sin snippet; sin schema Person.
- **Sugerente verificado (futuro):** index limitado; OG moderado; snippet limitado; `max-image-preview` controlado.
- **Sensible no explícito:** landing genérica index; perfil noindex; OG solo de landing.
- **No verificado:** noindex siempre, sin excepción.

---

## 9. Política de snippets

- **Permitido:** título/descripción de landing genérica, texto agregado no sensible (conteos, geo, categoría).
- **Prohibido:** PII (teléfono, contacto, dirección exacta), texto explícito de servicios, descripción sexual.
- **Mecanismos:** `nosnippet`, `max-snippet:0`/limitado, `data-nosnippet` en campos sensibles (RenderEngine), `max-image-preview:none`.

---

## 10. Robots / sitemap / motores IA

- **robots/sitemap:** `sitemap-perfiles` excluye adultos; hubs genéricos pueden ir en `sitemap-landings` con etiqueta; robots disallow para superficies sensibles.
- **Motores IA (GPTBot, Google-Extended, PerplexityBot, ClaudeBot/anthropic-ai, CCBot…):** exponer solo landings genéricas no sensibles; ocultar perfiles individuales, media y PII vía robots IA + `noai`/`noimageai` + `X-Robots-Tag` + **exclusión de datos en origen** (defensa en profundidad). robots no es garantía: lo privado va tras auth + PrivacyGuard.

---

## 11. Matrices

### Tipo página → index/noindex
landing geo genérica con contenido = index (+18); categoría/geo adulta con contenido = index condicional (ThinContentGuard); sin contenido = noindex; perfil individual MVP = noindex; perfil verificado no explícito futuro = index condicional (legal); no verificado = noindex; resultados dinámicos = noindex + nofollow facetas; stories/lives = noindex/noarchive; legales +18 = index.

### Contenido → metadatos permitidos
explícito = noindex/sin OG/sin snippet/sin schema; sugerente verificado = (futuro) index limitado/OG moderado/snippet limitado; sensible no explícito = landing index, perfil noindex; genérico hub = index/OG seguro/Breadcrumb+WebSite.

### Categoría → política SEO
adulto explícito = noindex perfiles, index hubs sin media; adulto sugerente = noindex perfiles MVP, futuro verificados; servicios sensibles = noindex individuos, index hubs geo; no adulto = estándar SEO-LANDINGS.

### Contenido → SafeSearch
explícito = adult + RTA + max-image-preview:none + noindex; sugerente = adult + max-image-preview:none; sensible = adult en contexto; genérico = sin rating salvo contexto.

### Contenido → motores IA
perfil individual = ocultar; media explícita = ocultar (noimageai); landing genérica = exponer; campos privados = nunca (PrivacyGuard).

---

## 12. Riesgos

| ID | Nivel | Riesgo | Mitigación |
|---|---|---|---|
| AD-R01 | crítico | PII/identidad en snippets/OG/IA | noindex perfiles MVP + nosnippet/data-nosnippet + PrivacyGuard |
| AD-R02 | crítico | Indexar menores/no verificados | noindex no verificados siempre; mayorEdad obligatorio; verificación previa |
| AD-R03 | alto | Penalización por adult no etiquetado/thin | rating adult/RTA + ThinContentGuard + canonical |
| AD-R04 | alto | Daño reputacional por SERP explícito | OG moderado, sin media explícita indexable, hubs genéricos |
| AD-R05 | alto | Riesgo legal por jurisdicción | habilitación futura solo por mercado legal + hreflang + revisión legal |
| AD-R06 | medio | Motores IA ignoran robots | defensa en profundidad: robots IA + noai + exclusión en origen |
| AD-R07 | medio | Cloaking accidental por age gate | paridad de contenido + etiquetado en vez de ocultar |
| AD-R08 | medio | OG adultos sin moderar (SEO-R07) | SeoModerationQueue aprueba previews |

---

## Dependencias e impactos

- **Consume:** ADR-URL-CANONICA-PERFILES, ADR-RENDER-STRATEGY, SPEC-RENDERENGINE.
- **Alinea:** SEO-LANDINGS, APP-PUBLICA, INTERACCIONES, BANNERS, AGENTES-IA.
- **Precondiciones:** RenderEngine runtime (meta robots/X-Robots-Tag/JSON-LD), flag de verificación, marca de categoría adulta en Catálogo, umbral ThinContentGuard, SeoModerationQueue.
- **Impacto SEO-LANDINGS:** detalla `estrategiaContenidoAdulto`, amplía la matriz `contenidoAdultoIndex` con 5 matrices, cierra `SEO-R07` a nivel política.
- **Impacto RenderEngine:** documenta que el runtime debe inyectar meta robots (noindex/nosnippet/max-image-preview), rating adult/RTA y X-Robots-Tag; refuerza PrivacyGuard. No modifica el SPEC congelado.
- **Desbloquea SPEC-SEO-LANDINGS:** cierra la decisión de política de adultos (index/noindex, snippets, OG, SafeSearch, IA) sin ambigüedad legal/reputacional.

---

## Siguientes pasos sugeridos

- `SPEC-SEO-LANDINGS` puede especificar reglas técnicas de adultos con esta ADR como fuente.
- Revisión legal por jurisdicción antes de habilitar indexación de perfiles verificados (internacionalización).
- Definir umbral numérico de `ThinContentGuard` y la lista exacta de user-agents IA a bloquear con datos reales.

> No modifica SEO-LANDINGS, la observación SEO, los ADRs (se consumen), ni capas/planes/actas existentes. Sin cambios en producción/Firestore/deploy/commit.
