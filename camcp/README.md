# CariHub Architecture MCP (CAMCP) — Fase 1

Servidor MCP local **read-only** para auditoría y gobernanza técnica de CariHub.

**Fase 1:** filesystem + git (solo lectura). Sin QA runners, sin GitHub, sin write tools.

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
```

## Configuración

`config/camcp.config.json`:

| Campo | Descripción |
|-------|-------------|
| `mode` | Debe ser `read-only` en Fase 1 |
| `repoRootEnv` | Variable de entorno del repo (`CARIHUB_REPO_ROOT`) |
| `denyWritePaths` | Rutas protegidas (incluye `public/`) |
| `gitAllowedSubcommands` | Allowlist git |

## Tools Fase 1 (9)

Todas **read-only**:

| Namespace | Tool |
|-----------|------|
| filesystem | `filesystem.list`, `filesystem.read`, `filesystem.search`, `filesystem.tree` |
| git | `git.status`, `git.log`, `git.diff`, `git.branch`, `git.scope_check` |

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

- Policy Engine: `mode=read-only`
- Path Guard: lecturas solo bajo repo root; escapes bloqueados
- Command Guard: git subcommands en allowlist; `push`/`commit`/`deploy` bloqueados
- Fase 1 **no escribe** fuera de `camcp/` (solo archivos nuevos del scaffold)

## Reportes

Fase 2+ escribirá en `agent-tools/camcp-reports/` (gitignored). Fase 1 no genera reportes en runtime MCP.
