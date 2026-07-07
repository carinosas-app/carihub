# QA Agent — Paridad Registro ↔ Perfil Público

## Fase A (implementada)

Análisis estático: catálogo 443 subcategorías, `FieldContract`, gaps blocks ↔ schema-index.

```bash
# Catálogo completo
node scripts/qa-paridad-reg-pub-static.mjs

# Filtros
node scripts/qa-paridad-reg-pub-static.mjs --sector salud
node scripts/qa-paridad-reg-pub-static.mjs --sub medicos-generales

# Salida custom
node scripts/qa-paridad-reg-pub-static.mjs --out agent-tools/qa-paridad-reports/manual-run
```

**Salida:** `agent-tools/qa-paridad-reports/<runId>/`
- `catalog.json` — catálogo completo
- `field-inventory.json` — todos los FieldContract
- `gaps.json` — gaps blocks vs schema
- `summary.md` — resumen humano

Reportes en `.gitignore`.

## Decisiones (v1.0)

| # | Decisión |
|---|----------|
| 4 | Playwright: `page.evaluate` (sin tocar prod) |
| 5 | CI: A+B; Fase C nightly/manual |
| 8 | Reportes en `agent-tools/qa-paridad-reports/` gitignored |

## Fase B (implementada)

Pipeline VM: mock → mapToPerfil → buildUsuarioDoc → slim → hydrate → PrivacyGuard.

```bash
# Smoke (subs individuales)
node scripts/qa-paridad-reg-pub-vm.mjs --sub medicos-generales
node scripts/qa-paridad-reg-pub-vm.mjs --sub dominatrix
node scripts/qa-paridad-reg-pub-vm.mjs --sub unicorns

# Filtros
node scripts/qa-paridad-reg-pub-vm.mjs --sector salud
node scripts/qa-paridad-reg-pub-vm.mjs --max-subs 30

# Salida custom
node scripts/qa-paridad-reg-pub-vm.mjs --out agent-tools/qa-paridad-reports/manual-b
```

**Salida adicional Fase B:**
- `pipeline-summary.json` — resumen + stages por sub
- `failures.json` — fallos detallados
- `pipeline-detail.json` — detalle completo por sub
- `summary-phase-b.md` — resumen humano

Exit code 1 si hay subs FAIL o bloqueadores privacy/contaminación.

## Fases pendientes

- **C** — Playwright render
- **D** — Reporte priorizado
