# CAMCP Fase 3B.1 — Cierre (pre-PR)

**Estado:** implementado en rama `feat/camcp-fase-3b1-parity` — **pendiente PR**  
**Baseline previo:** 22 tools @ `main` `4c2594c`  
**Alcance:** `parity.static`, `parity.vm`, `parity.render_strict`  
**Pospuesto:** `parity.visual`  

---

## Entregables

| Componente | Path |
|------------|------|
| Config | `config/parity.config.json` |
| Parity layer | `src/parity/` (runner, parsers, json-read) |
| Tools | `src/tools/parity.tools.ts`, `parity.definitions.ts` |
| Reports | `aggregateParityReport`, parser parity-aware |
| Smoke | `scripts/smoke-parity.mjs` |
| SPEC | `docs/FASE-3B-1-PARITY-SPEC.md` |

## Tools (+3 → 25 total)

| Tool | Delega a |
|------|----------|
| `parity.static` | `qa.run_paridad_static` |
| `parity.vm` | `qa.run_paridad_vm` |
| `parity.render_strict` | `qa.run_paridad_render_strict` |

**Write-capable:** 0

## Restricciones cumplidas

- Solo `camcp/`
- Report-only parity.*
- Reutiliza `qa.tools.ts` — sin duplicar scripts QA
- Sin `parity.visual`, `data.*`, `arch.*`
- Sin cambios `public/`, Firestore, Firebase

## `parity.visual` — pospuesto

Registrado en `parity.config.json` → `deferredTools`. Reactivar cuando temas sectoriales y overrides visuales estén estabilizados.

---

Ver [FASE-3B-1-PARITY-SPEC.md](./FASE-3B-1-PARITY-SPEC.md).
