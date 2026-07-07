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

## Fases pendientes

- **B** — Pipeline VM (persist/hydrate)
- **C** — Playwright render
- **D** — Reporte priorizado
