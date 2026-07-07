# CAMCP — Baseline oficial

Documento de referencia del estado mergeado de **CariHub Architecture MCP**.

**Última actualización:** 2026-07-07  
**Rama canónica:** `main` @ **`b365c11`**

---

## Historial de fases

| Fase | PR | Merge | Tools | Estado |
|------|-----|-------|-------|--------|
| 1 — filesystem + git | — | `de37fd6` | 9 | CERRADA |
| 2 — namespace `qa.*` | #115 | `f46e2d3` | 16 | CERRADA |
| 3A — Intelligence Core + `intel.*` | #116 | `b365c11` | **22** | **CERRADA** |
| 3B — `arch.*` + `data.*` + `parity.*` | — | — | ~34 (objetivo) | SPEC pendiente |
| 3C — `perf.*` | — | — | — | No iniciada |
| 3D — `seo.*` + `ads.*` | — | — | — | No iniciada |
| 3E — CI GitHub Actions | — | — | — | No iniciada |

---

## Baseline actual (`main` @ `b365c11`)

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
└── Reports Engine
    ├── schema · parser · writer · aggregator
    └── salida: agent-tools/camcp-reports/
```

### Inventario de tools (22)

| Namespace | Count | Capability |
|-----------|-------|------------|
| `filesystem` | 4 | read-only |
| `git` | 5 | read-only |
| `qa` | 7 | report-only |
| `intel` | 6 | 3 read-only + 3 report-only |
| **Total** | **22** | **0 write-capable** |

### Configuración

| Archivo | Rol |
|---------|-----|
| `camcp/config/camcp.config.json` | Policy global, denyWritePaths, git allowlist |
| `camcp/config/intelligence.config.json` | Dominios, anclas, módulos QA, cache TTL |

### Smokes obligatorios

```bash
cd camcp && npm run build
npm run smoke          # 14 checks
npm run smoke:extended # 27 checks
npm run smoke:qa       # 9 checks
npm run smoke:intel    # 12 checks
```

### Restricciones permanentes

- **0 write-capable tools**
- Escritura report-only limitada a `agent-tools/camcp-reports/`
- No modificar `public/`, Firestore, Firebase, runtime CariHub desde CAMCP
- No deploy CAMCP como servicio de producción
- Reutilizar QA y contratos existentes — no pipelines paralelos

---

## Commits de referencia

```
b365c11  Merge PR #116 — Fase 3A Intelligence Core
4342cb9  feat(camcp): Intelligence Core + intel.*
f46e2d3  Merge PR #115 — Fase 1+2 QA namespace
bd3d169  feat(camcp): namespace QA report-only
de37fd6  feat(camcp): Fase 1 filesystem + git
```

---

## Documentación por fase

| Documento | Contenido |
|-----------|-----------|
| [FASE-3A-INTELLIGENCE-CORE.md](./FASE-3A-INTELLIGENCE-CORE.md) | Diseño e implementación 3A |
| [FASE-3A-CIERRE.md](./FASE-3A-CIERRE.md) | Acta de cierre 3A |
| [FASE-3B-SPEC.md](./FASE-3B-SPEC.md) | SPEC técnico 3B (pendiente aprobación) |
| [../README.md](../README.md) | Guía operativa CAMCP |

---

## Observaciones activas del baseline

1. **`fondos_static ok=false`** — script QA heredado; ticket independiente.
2. **CI remoto** — pendiente Fase 3E.
3. **Grafo intelligence** — monitorear rendimiento con catálogo QA creciente.

---

## Verificación rápida

```bash
git rev-parse HEAD origin/main   # deben coincidir en main limpio
cd camcp && npm run smoke && npm run smoke:intel
# Esperado: tools=22, 0 write-capable
```
