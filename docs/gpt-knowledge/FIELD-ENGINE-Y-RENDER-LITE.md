# Field Engine y Render Lite — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

**Field Engine Lite:** resuelve schema por subcategoría, configura UI de registro, define qué campos son públicos/privados y expone presentación pública.  
**Render Lite:** pinta campos públicos en preview, resultados y perfil público sin exponer privados.

Pipeline central del contrato registro → persist → preview → público.

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `public/js/carihub-field-engine-lite.js` | Motor schema + UI registro |
| `public/js/carihub-public-render-lite.js` | Render público (~2100 líneas) |
| `public/js/carihub-private-fields-lite.js` | Campos privados / validación |
| `public/js/data/registro-schema-index.js` | Índice pregenerado (archivo grande, una línea) |
| `public/js/data/registro-*-blocks.js` | Bloques por sector/arquetipo |
| `public/js/data/registro-*-sub-deltas.js` | Extensiones por subcategoría |
| `public/js/carihub-registro-public-blocks.js` | Bloques preview registro |
| `public/js/carihub-resultados-card-contract.js` | Contrato tarjeta resultados |
| `scripts/MAPA-MAESTRO-CARIHUB.json` | FieldEngine 1.0.1 diseño congelado |

---

## Flujo funcional

```
subcategoriaId
    → CARIHUB_REGISTRO_SCHEMA_INDEX (vía field-engine)
    → arquetipo, tipoPerfil, componenteResultados, componentePerfil
    → blocks (*-blocks.js + sub-deltas)
    → field-engine: show/hide UI_BLOCKS, labels, obligatorios
    → wizard captura valores
    → mapToPerfil (submit) → nested *Perfil en Firestore
    → public-render-lite lee nested *Perfil
    → resultados-card-contract filtra campos tarjeta
```

**API clave field-engine:**
- `resolvePublicPresentation(ctx)` — usado por `carihub-resultados-sector.js`
- `UI_BY_ARQUETIPO` — configuración por arquetipo
- `TEMPORAL_SOLICITUD` — fallback persona independiente

---

## Dependencias

- `registro-schema-index.js` — fuente índice (tamaño ~180KB)
- Blocks por sector (20+ archivos en `data/`)
- `catalogos-carihub.js` — **pendiente de confirmar** relación exacta
- RenderEngine futuro (SPEC congelada) — no sustituye lite hoy
- ValidationEngine 1.1.0 diseño congelado — runtime parcial

---

## Reglas críticas

1. **Una sola fuente schema:** schema-index — no duplicar mappings en otros archivos (usar resolvePublicPresentation)
2. **Anti-contaminación:** namespaces `escortPerfil`, `doctorPerfil`, etc. — nunca mezclar
3. **Preview = persist = público** — cambio en uno exige validar los tres
4. **Congelado:** actas SHARED-CORE y RENDERENGINE — extender, no pipeline paralelo
5. Sub-deltas extienden; no copiar blocks enteros por subcategoría

---

## Estado actual

| Componente | Estado |
|------------|--------|
| field-engine-lite | Operativo registro |
| public-render-lite | Operativo perfil/resultados |
| schema-index | Pregenerado; **443** subcategorías verificadas (QA-REG-PUB Fase A, jul 2026) |
| Blocks adultos | Múltiples packs (escort, pareja, lifestyle…) |
| Blocks sectores nuevos | En expansión (automotriz, salud, etc.) |
| Sector render | `carihub-*-sector-render.js` complementan tarjeta |

**Conteo subcategorías:** **443** en schema-index actual — validado por `scripts/qa-paridad-reg-pub-static.mjs` (5344 FieldContracts). Plan SEO histórico citaba 462; usar schema-index + QA como fuente de verdad.

---

## Pendientes

- ValidationEngine runtime completo
- RenderEngine snapshot (SEO)
- QA contract pipeline todos sectores nuevos
- Documentar mapa arquetipo → blocks file en MPS

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Bloqueador** | mapToPerfil desincronizado → datos corruptos |
| **Importante** | schema-index opaco (1 línea) — difícil diff |
| **Importante** | Fallback FALLBACK_SECTOR en resultados si engine no carga |
| **Importante** | Nuevos sectores sin blocks → TEMPORAL_SOLICITUD genérico |

---

## Validaciones necesarias

- `audit-*-contract-pipeline.mjs` por arquetipo
- `audit-e2e-submit-hydrate-validation.mjs`
- `audit-consolidacion-registro-global.mjs`
- Por subcategoría: registro → Firestore → perfil público campos correctos

---

## Pendiente de confirmar

- Proceso regeneración `registro-schema-index.js` desde `mapa-registro-categorias.json`
- Lista arquetipos en `UI_BY_ARQUETIPO` vs blocks existentes
- Si `carihub-*-sector-render.js` duplica lógica de render-lite
