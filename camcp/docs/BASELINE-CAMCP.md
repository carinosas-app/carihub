# CAMCP — Baseline oficial

Documento de referencia del estado mergeado de **CariHub Architecture MCP**.

**Última actualización:** 2026-07-07  
**Rama canónica:** `main` @ **`a5fb451`**

---

## Historial de fases

| Fase | PR | Merge | Tools | Estado |
|------|-----|-------|-------|--------|
| 1 — filesystem + git | — | `de37fd6` | 9 | CERRADA |
| 2 — namespace `qa.*` | #115 | `f46e2d3` | 16 | CERRADA |
| 3A — Intelligence Core + `intel.*` | #116 | `b365c11` | 22 | CERRADA |
| 3B.1 — `parity.*` | #118 | `d383e4e` | 25 | CERRADA |
| 3B.2 — `data.*` | #119 | `a5fb451` | **29** | **CERRADA** |
| 3B.3 — `arch.*` | — | — | ~34 (obj.) | No iniciada |
| 3C — `perf.*` | — | — | — | No iniciada |
| 3D — `seo.*` + `ads.*` | — | — | — | No iniciada |
| 3E — CI GitHub Actions | — | — | — | No iniciada |

---

## Baseline mergeado en `main` (`a5fb451`)

### Capacidades

```
CAMCP Core
├── Policy Engine (mode: report-only)
├── Path Guard (realpath + denyWritePaths)
├── Command Guard (git/deploy/shell blocks)
├── Registry automático (ToolDefinition[])
│
├── filesystem.* (4) — read-only
├── git.* (5) — read-only
├── qa.* (7) — report-only → scripts/qa-*.mjs
│
├── Intelligence Core (Fase 3A)
│   ├── domains · contracts · graph · impact · cache · modules
│   └── intel.* (6) — read-only / report-only
│
├── parity.* (3) — report-only → qa.tools.ts → scripts paridad (Fase 3B.1)
├── data.* (4) — report-only → qa.tools.ts → scripts QA pipeline (Fase 3B.2)
│
└── Reports Engine
    ├── schema · parser · writer · aggregator
    └── salida: agent-tools/camcp-reports/
```

### Inventario de tools (29)

| Namespace | Count | Capability |
|-----------|-------|------------|
| `filesystem` | 4 | read-only |
| `git` | 5 | read-only |
| `qa` | 7 | report-only |
| `intel` | 6 | 3 read-only + 3 report-only |
| `parity` | 3 | report-only |
| `data` | 4 | report-only |
| **Total** | **29** | **0 write-capable** |

### Tools `data.*` (Fase 3B.2)

| Tool | Delega a | Script QA |
|------|----------|-----------|
| `data.pipeline_status` | `qaRunParidadVm` | `qa-paridad-reg-pub-vm.mjs` |
| `data.persist_audit` | `qaRunP0PersistPrivacy` | `qa-p0-reg-persist-privacy.mjs` |
| `data.hydrate_audit` | `qaRunSubmitHydrate` | `qa-mp-submit-hydrate.mjs` |
| `data.schema_alignment` | `qaRunValidarSchemas` | `validar-schemas-registro.mjs` |

### Configuración

| Archivo | Rol |
|---------|-----|
| `camcp/config/camcp.config.json` | Policy global, denyWritePaths, git allowlist |
| `camcp/config/intelligence.config.json` | Dominios, anclas, módulos QA, cache TTL |
| `camcp/config/parity.config.json` | Tools parity, deferredTools (`parity.visual`) |
| `camcp/config/data.config.json` | Tools data, `reuses[]` por tool |

### Smokes obligatorios

```bash
cd camcp && npm run build
npm run smoke          # 14 checks
npm run smoke:extended # 27 checks
npm run smoke:qa       # 9 checks
npm run smoke:intel    # 12 checks
npm run smoke:parity   # 14 checks (Fase 3B.1)
npm run smoke:data     # 18 checks (Fase 3B.2)
```

### Restricciones permanentes

- **0 write-capable tools**
- Escritura report-only limitada a `agent-tools/camcp-reports/`
- No modificar `public/`, Firestore, Firebase, runtime CariHub desde CAMCP
- No deploy CAMCP como servicio de producción
- Reutilizar QA y contratos existentes — no pipelines paralelos
- **Regla 1 (3B.2+):** ninguna tool `data.*` implementa validación propia del pipeline — solo delega a QA/adapters
- **Regla 2 (3B.2+):** toda tool nueva declara qué reutiliza (`reuses[]` en config, descriptions, docs)
- **Regla general (aprobada 2026-07-07):** toda nueva tool debe justificar claramente el valor que aporta y reutilizar la arquitectura existente. No se implementarán herramientas que dupliquen QA, contratos, renderizadores o lógica ya existente.

---

## Commits de referencia

```
a5fb451  Merge PR #119 — Fase 3B.2 data.*
1116c9a  feat(camcp): agrega namespace data.* Fase 3B.2
d383e4e  Merge PR #118 — Fase 3B.1 parity.*
848f917  feat(camcp): agrega namespace parity.* Fase 3B.1
4c2594c  Merge PR #117 — docs 3A cierre + baseline + SPEC 3B
b365c11  Merge PR #116 — Fase 3A Intelligence Core
f46e2d3  Merge PR #115 — Fase 1+2 QA namespace
de37fd6  feat(camcp): Fase 1 filesystem + git
```

---

## Documentación por fase

| Documento | Contenido |
|-----------|-----------|
| [FASE-3A-INTELLIGENCE-CORE.md](./FASE-3A-INTELLIGENCE-CORE.md) | Diseño e implementación 3A |
| [FASE-3A-CIERRE.md](./FASE-3A-CIERRE.md) | Acta de cierre 3A |
| [FASE-3B-SPEC.md](./FASE-3B-SPEC.md) | SPEC 3B (dirección técnica aprobada) |
| [FASE-3B-1-PARITY-SPEC.md](./FASE-3B-1-PARITY-SPEC.md) | SPEC 3B.1 parity |
| [FASE-3B-1-CIERRE.md](./FASE-3B-1-CIERRE.md) | Cierre 3B.1 |
| [FASE-3B-2-DATA-SPEC.md](./FASE-3B-2-DATA-SPEC.md) | SPEC 3B.2 data |
| [FASE-3B-2-CIERRE.md](./FASE-3B-2-CIERRE.md) | Acta de cierre 3B.2 |
| [../README.md](../README.md) | Guía operativa CAMCP |

---

## Observaciones activas del baseline

1. **`fondos_static ok=false`** — script QA heredado; ticket independiente.
2. **CI remoto** — pendiente Fase 3E.
3. **Grafo intelligence** — monitorear rendimiento con catálogo QA creciente.
4. **Side-effect `validar-schemas`** — `data.schema_alignment` puede modificar `scripts/validacion-schemas-report.json` al ejecutarse; revertir localmente tras smokes.

---

## Verificación rápida

```bash
git rev-parse HEAD origin/main   # deben coincidir en main limpio @ a5fb451
cd camcp && npm run build
npm run smoke && npm run smoke:extended && npm run smoke:qa
npm run smoke:intel && npm run smoke:parity && npm run smoke:data
# main @ a5fb451: tools=29 · 0 write-capable
```
