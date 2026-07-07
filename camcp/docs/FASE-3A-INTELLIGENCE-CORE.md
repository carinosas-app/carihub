# CAMCP Fase 3A — Intelligence Core + Reports Engine

**Estado:** **CERRADA** — merge `b365c11` (PR #116)  
**Baseline previo:** Fase 1+2 merge `f46e2d3` (PR #115)  
**Cierre formal:** [FASE-3A-CIERRE.md](./FASE-3A-CIERRE.md)

## Objetivo

Capa de inteligencia CariHub sobre CAMCP existente: grafo de dominios, análisis de impacto git, orquestación de módulos QA, y Reports Engine unificado — **sin modificar runtime** (`public/`, Firestore, deploy).

## Arquitectura

```
CAMCP Core (Fase 1–2)
  filesystem.* · git.* · qa.*
        ↓
Intelligence Core (Fase 3A)
  intelligence/domains · graph · impact · cache · modules
        ↓
Reports Engine
  reports/schema · writer · parser · aggregator
        ↓
intel.* tools (6)
```

## Tools Fase 3A

| Tool | Capability | Descripción |
|------|------------|-------------|
| `intel.list_domains` | read-only | Dominios APP_* + anclas + módulos QA |
| `intel.graph` | report-only | Grafo dominio→archivos→QA; cache en `.cache/graph/` |
| `intel.impact` | report-only | Diff git → dominios → QA sugerido + CAMCP REPORT |
| `intel.run_module` | report-only | Delega `qa.run_*` (paridad, fondos, pack) |
| `intel.cache_status` | read-only | Estado cache intelligence |
| `intel.parse_report` | read-only | Parser canónico Reports Engine |

**Total tools:** 22 (12 read-only, 10 report-only, **0 write-capable**)

## Módulos `intel.run_module` (3A)

| moduleId | Delega a |
|----------|----------|
| `paridad_static` | `qa.run_paridad_static` |
| `paridad_vm` | `qa.run_paridad_vm` |
| `paridad_render_strict` | `qa.run_paridad_render_strict` |
| `fondos_static` | `qa.run_fondos_static` |
| `pack` | `qa.run_pack` (requiere `packId`) |

## Configuración

- `config/camcp.config.json` — policy global (sin cambios estructurales)
- `config/intelligence.config.json` — dominios, anclas, módulos, TTL cache, hints impact

## Reports Engine

Formato estándar **CAMCP REPORT** (`report.md`):

```markdown
# CAMCP REPORT
| Módulo | intel.impact |
| Estado | PASS |
...
```

Artefactos por run:

```
agent-tools/camcp-reports/{tool}/{runId}/
  report.md
  findings.json
  summary.json
  manifest.json (QA runs)
```

Cache intelligence:

```
agent-tools/camcp-reports/.cache/graph/{gitCommit}.json
```

## Fuentes read-only

- `scripts/MAPA-MAESTRO-CARIHUB.json`
- `docs/gpt-knowledge/*.md`
- `scripts/qa-*.mjs` (vía `qa/catalog.ts`)
- Git diff (vía `git.*`)

## Anti-duplicación

- **No** reimplementa `mapToPerfil`, field-engine, render-lite
- **No** crea `arch.*`, `data.*`, `perf.*`, `seo.*`, `ads.*` (Fase 3B+)
- `qa.parse_last_report` delega a `reports/parser.ts`

## Smoke

```bash
cd camcp
npm run build
npm run smoke:intel
```

## Extensiones futuras

- **Fase 3B (SPEC pendiente aprobación):** `arch.*`, `data.*`, `parity.*` — [FASE-3B-SPEC.md](./FASE-3B-SPEC.md)
- Fase 3C: `perf.*`
- Fase 3D: `seo.*`, `ads.*`
- Fase 3E: CI GitHub Actions

Ver [BASELINE-CAMCP.md](./BASELINE-CAMCP.md) para estado canónico del proyecto.
