# Acta formal de congelamiento — Dashboards

| Campo | Valor |
|-------|-------|
| **Estado** | **CONGELADO** |
| **Versión** | `dashboards-2026-06-10` · semver **1.0.0** |
| **Fecha** | 2026-06-09 |
| **Implementación runtime** | **NO autorizada** |

Canónico: [`ACTA-CONGELAMIENTO-DASHBOARDS.json`](./ACTA-CONGELAMIENTO-DASHBOARDS.json)  
Spec: [`SPEC-DASHBOARDS.md`](./SPEC-DASHBOARDS.md)

---

## Baseline aprobado

- [`SPEC-DASHBOARDS.md`](./SPEC-DASHBOARDS.md)
- [`SPEC-DASHBOARDS.json`](./SPEC-DASHBOARDS.json)

---

## Decisiones congeladas

| Decisión | Valor |
|----------|-------|
| Dashboard Admin | **Separado** (`/admin`) |
| Dashboard usuario | **Shell modular** (`/cuenta`) |
| Dashboards independientes visitante/perfil/banners/mensajes | **No** — módulos en shell |
| Visibilidad módulos | `tipoCuentaPrincipal`, `rolesCuenta[]`, estados, permisos |
| Asistentes IA | Orquestador ligero + 7 especialistas |
| Notificaciones | Sistema unificado (10 dominios) |
| Historial | Centro de actividad (9 dominios) |
| Acciones IA | Sin persistencia automática sin confirmación humana |

---

## Cinco capas congeladas

| Capa | Versión |
|------|---------|
| Catálogo | 1.0.0 |
| Cuentas | 1.0.0 |
| Seguridad MVP | 1.0.0 |
| FieldEngine | 1.0.1 |
| **Dashboards** | **1.0.0** |

---

## Restricciones vigentes

Sin runtime · Sin Firestore · Sin producción · Sin deploy · Sin commit · Sin LLM runtime

---

## Siguiente paso diseño

**SPEC ValidationEngine** — ver [`REPORTE-CONGELAMIENTOS-CONSOLIDADO.md`](./REPORTE-CONGELAMIENTOS-CONSOLIDADO.md)

---

## Historial

| Semver | Evento |
|--------|--------|
| 1.0.0 | CONGELAMIENTO_INICIAL — spec + auditoría + IA + notificaciones + historial |
