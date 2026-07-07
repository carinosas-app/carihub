# Categorías y subcategorías — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

Taxonomía completa del directorio: sectores, categorías, subcategorías, arquetipos, componentes UI y presentación pública. Alimenta registro, resultados, home picker y temas visuales.

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `public/js/data/registro-schema-index.js` | Índice maestro pregenerado |
| `public/js/catalogos-carihub.js` | Catálogos UI |
| `public/js/carihub-field-engine-lite.js` | Resolución arquetipo/UI |
| `public/js/carihub-resultados-sector.js` | 15 sectores con tema/banner |
| `public/js/carihub-sector-cat-search.js` | Búsqueda categorías |
| `public/js/data/registro-*-blocks.js` | Definición campos por dominio |
| `public/js/data/registro-*-sub-deltas.js` | Variantes subcategoría |
| `public/js/data/registro-generic-sub-public-copy.js` | Copy público genérico |
| `scripts/config-registro-schema.meta.json` | Meta schema (referenciado en planes) |

---

## Sectores con tema visual (verificado en `carihub-resultados-sector.js`)

```
adultos, salud, bienestar, restaurantes, automotriz,
profesionales, hogar, comercio, mascotas, eventos,
educacion, tecnologia, transporte, industria, bienes-raices
```

**Default:** `adultos` (fucsia).  
**LGBT:** subcategorías con `data-subtema="lgbt"` — tema aparte, no sector listado arriba.

---

## Dominios con blocks dedicados (verificado en repo)

| Dominio | Blocks | Sub-deltas |
|---------|--------|------------|
| Adultos escort | `registro-adultos-escort-blocks.js` | — |
| Adultos espectáculo | `registro-adultos-espectaculo-blocks.js` | — |
| Adultos lifestyle | `registro-adultos-lifestyle-blocks.js` | — |
| Adultos pareja | `registro-adultos-pareja-blocks.js` | — |
| Adultos hospedaje | `registro-adultos-hospedaje-blocks.js` | — |
| Bienestar | `registro-bienestar-blocks.js` | `registro-bienestar-sub-deltas.js` |
| Gastronomía | `registro-gastronomia-blocks.js` | — |
| Salud | `registro-salud-blocks.js` | — |
| Automotriz | `registro-automotriz-blocks.js` | `registro-automotriz-sub-deltas.js` |
| Bienes raíces | `registro-bienes-raices-blocks.js` | `registro-bienes-raices-sub-deltas.js` |
| Comercio | `registro-comercio-blocks.js` | `registro-comercio-sub-deltas.js` |
| Educación | `registro-educacion-blocks.js` | `registro-educacion-sub-deltas.js` |
| Hogar | `registro-hogar-blocks.js` | — |
| Industria | `registro-industria-blocks.js` | — |
| Mascotas | `registro-mascotas-blocks.js` | — |
| Profesionales | `registro-profesionales-blocks.js` | — |
| Tecnología | `registro-tecnologia-blocks.js` | — |
| Transporte | `registro-transporte-blocks.js` | — |
| Eventos | `registro-eventos-blocks.js` | — |

**Pendiente de confirmar:** lista exhaustiva de archivos `registro-*-blocks.js` truncada en git status.

---

## Flujo funcional

```
Usuario elige categoría/subcategoría (home o registro)
    → schema-index lookup por subcategoriaId
    → { arquetipo, tipoPerfil, sectorId, formularioId, ... }
    → Carga blocks + sub-deltas
    → field-engine configura UI
    → resultados-sector resuelve sectorId para tema
    → card-contract define campos tarjeta
```

**Resolver sector:** `CariHubResultadosSector.resolverSectorId()` → schema-index vía `resolvePublicPresentation`, con `FALLBACK_SECTOR` si engine no disponible.

---

## Dependencias

- Todo el pipeline registro/render
- Assets sector-cards y banners por sector
- Home picker adultos (`home-adultos-cat-picker.js`)
- SEO landings futuras (taxonomía × geo)

---

## Reglas críticas

1. **No crear subcategoría** sin revisar infra existente (regla reutilizar antes de crear)
2. Nuevo sector requiere: blocks, sector en `SECTORS`, banner asset, sector-render opcional, QA contract
3. Sub-deltas para variantes — no duplicar blocks base
4. `registro-generic-sub-public-copy.js` para copy homogéneo donde aplique
5. Anti-contaminación adultos ↔ otros sectores en tarjeta y render

---

## Estado actual

- **443 subcategorías** con `resolveConfig` verificadas por QA-REG-PUB Fase A (PR #113)
- Expansión sectores no-adultos en `main`; QA por dominio en `scripts/qa-*.mjs`
- Schema-index monolítico — difícil inspección manual
- Adultos: múltiples arquetipos maduros con QA packs
- Sectores nuevos: blocks creados, QA visual/contract en progreso

---

## Pendientes

- Inventario automático subcategorías sin blocks
- Sincronizar conteo schema-index con catálogo producto
- Cobertura sub-deltas todos los sectores con variantes
- Documentar matriz subcategoría → arquetipo → componente

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Bloqueador potencial** | Subcategoría en índice sin blocks → registro roto |
| **Importante** | Drift schema-index vs blocks files |
| **Importante** | FALLBACK_SECTOR enmascara errores de resolución |
| **Importante** | Subcategoría adulta visible en sector no adulto por bug card-contract |

---

## Validaciones necesarias

- Por subcategoría representativa por sector: registro completo
- `audit-consolidacion-registro-global.mjs`
- grep: subcategoriaId en blocks vs index
- Resultados: tema sector correcto por categoría

---

## Pendiente de confirmar

- Conteo exacto subcategorías en schema-index (443 vs 462)
- Proceso de alta de nueva subcategoría (¿solo JSON o también script?)
- Subcategorías LGBT — lista completa IDs
