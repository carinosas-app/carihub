# CAMCP Fase 3B.2 — Cierre (pre-PR)

**Estado:** implementado en rama `feat/camcp-fase-3b2-data` — **pendiente PR**  
**Baseline previo:** 25 tools @ `main` `d383e4e`  
**Alcance:** `data.pipeline_status`, `data.persist_audit`, `data.hydrate_audit`, `data.schema_alignment`  
**Fase congelada:** 3B.1 `parity.*` @ `d383e4e` — sin cambios funcionales  

---

## Entregables

| Componente | Path |
|------------|------|
| Config | `config/data.config.json` |
| Data layer | `src/data/` (runner, parsers, json-read) |
| QA adapters | `qa.tools.ts` (+3 funciones internas) |
| Tools | `src/tools/data.tools.ts`, `data.definitions.ts` |
| Reports | `aggregateDataReport`, parser data-aware |
| Smoke | `scripts/smoke-data.mjs` |
| SPEC | `docs/FASE-3B-2-DATA-SPEC.md` |

## Tools (+4 → 29 total)

| Tool | Delega a |
|------|----------|
| `data.pipeline_status` | `qaRunParidadVm` → `qa-paridad-reg-pub-vm.mjs` |
| `data.persist_audit` | `qaRunP0PersistPrivacy` → `qa-p0-reg-persist-privacy.mjs` |
| `data.hydrate_audit` | `qaRunSubmitHydrate` → `qa-mp-submit-hydrate.mjs` |
| `data.schema_alignment` | `qaRunValidarSchemas` → `validar-schemas-registro.mjs` |

**Write-capable:** 0

## Reglas permanentes cumplidas

- **Regla 1 — Delegación:** sin lógica de validación de pipeline en `data/` (solo parsers de artefactos QA)
- **Regla 2 — Reutilización:** `reuses[]` en `data.config.json` + descriptions en definitions

## Restricciones cumplidas

- Solo `camcp/`
- Report-only `data.*`
- Reutiliza `qa.tools.ts` — sin duplicar scripts QA, mapToPerfil, field-engine, render-lite
- Sin `arch.*`, `perf.*`, `seo.*`, `ads.*`
- Sin cambios funcionales `parity.*`
- Sin cambios `public/`, Firestore, Firebase
- Excluido: `CAMCP-ROADMAP-MAESTRO.md`, `scripts/validacion-schemas-report.json`

## Side-effect documentado

`validar-schemas-registro.mjs` puede escribir `scripts/validacion-schemas-report.json` al ejecutarse — revertir/excluir del commit CAMCP.

---

Ver [FASE-3B-2-DATA-SPEC.md](./FASE-3B-2-DATA-SPEC.md).
