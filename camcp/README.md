# CariHub Architecture MCP (CAMCP)

Servidor MCP local **read-only / report-only** para auditoría, gobernanza y orquestación QA de CariHub.

**Fase 1:** filesystem + git · **Fase 2:** namespace `qa.*` · **Fase 3A:** Intelligence Core + `intel.*` · **Fase 3B.1:** `parity.*` · **Fase 3B.2:** `data.*` · **Fase 3B.3:** `arch.*`

**Baseline:** 32 tools · 0 write-capable · `main` @ `28888e6`

| Documento | Contenido |
|-----------|-----------|
| [docs/BASELINE-CAMCP.md](./docs/BASELINE-CAMCP.md) | Baseline oficial |
| [docs/FASE-3A-CIERRE.md](./docs/FASE-3A-CIERRE.md) | Cierre Fase 3A |
| [docs/FASE-3B-1-PARITY-SPEC.md](./docs/FASE-3B-1-PARITY-SPEC.md) | SPEC 3B.1 parity |
| [docs/FASE-3B-2-DATA-SPEC.md](./docs/FASE-3B-2-DATA-SPEC.md) | SPEC 3B.2 data |
| [docs/FASE-3B-3-ARCH-SPEC.md](./docs/FASE-3B-3-ARCH-SPEC.md) | SPEC 3B.3 arch |
| [docs/FASE-3B-3-CIERRE.md](./docs/FASE-3B-3-CIERRE.md) | Cierre Fase 3B.3 |
| [docs/FASE-3B-SPEC.md](./docs/FASE-3B-SPEC.md) | SPEC 3B completo |

## Requisitos

- Node.js **18+**
- Git en PATH
- `rg` (ripgrep) opcional — si falta, `filesystem.search` usa fallback JS

## Instalación

Desde la raíz del repo:

```bash
cd camcp
npm install
npm run build
```

## Ejecutar el servidor MCP (stdio)

```bash
cd camcp
set CARIHUB_REPO_ROOT=C:\Users\ilser\carihub
npm start
```

En PowerShell:

```powershell
cd camcp
$env:CARIHUB_REPO_ROOT = "C:\Users\ilser\carihub"
npm start
```

El servidor habla MCP por **stdio** — pensado para Cursor, Goose u otro cliente MCP.

## Smoke test local

```bash
cd camcp
npm run build
npm run smoke
npm run smoke:extended
npm run smoke:qa
npm run smoke:intel
npm run smoke:parity
npm run smoke:data
npm run smoke:arch
```

## Configuración

`config/camcp.config.json`:

| Campo | Descripción |
|-------|-------------|
| `mode` | `read-only` o `report-only` |
| `repoRootEnv` | Variable de entorno del repo (`CARIHUB_REPO_ROOT`) |
| `denyWritePaths` | Rutas protegidas (incluye `public/`) |
| `gitAllowedSubcommands` | Allowlist git |

Namespaces con config dedicada: `intelligence.config.json`, `parity.config.json`, `data.config.json`, `arch.config.json`.

## Tools (32)

| Namespace | Tools | Capability |
|-----------|-------|------------|
| filesystem | list, read, search, tree | read-only |
| git | status, log, diff, branch, scope_check | read-only |
| qa | list_catalog, run_paridad_*, run_fondos_static, run_pack, parse_last_report | report-only |
| intel | list_domains, graph, impact, run_module, cache_status, parse_report | read-only / report-only |
| parity | static, vm, render_strict | report-only |
| data | pipeline_status, persist_audit, hydrate_audit, schema_alignment | report-only |
| arch | frozen_violations, scan_duplicates, domain_boundaries | read-only / report-only |

Ver [docs/FASE-3B-3-ARCH-SPEC.md](./docs/FASE-3B-3-ARCH-SPEC.md) para detalle `arch.*`.  
**Pospuesto:** `arch.dependencies` (P4), `parity.visual`.

## Cursor (Fase 8 — pendiente)

```json
{
  "mcpServers": {
    "carihub-architecture": {
      "command": "node",
      "args": ["camcp/dist/server.js"],
      "env": {
        "CARIHUB_REPO_ROOT": "${workspaceFolder}"
      }
    }
  }
}
```

## Seguridad

- Policy Engine: `mode=report-only`
- Path Guard: lecturas solo bajo repo root; escapes bloqueados
- Command Guard: git subcommands en allowlist; `push`/`commit`/`deploy` bloqueados
- **0 write-capable tools** — reportes solo en `agent-tools/camcp-reports/`

## Reportes

Salida en `agent-tools/camcp-reports/` (gitignored). Formato **CAMCP REPORT** vía Reports Engine.
