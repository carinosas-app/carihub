# Acta formal de congelamiento — Producto Fase 1 (Marketplace)

| Campo | Valor |
|-------|-------|
| **Versión acta** | 1.0.0 |
| **Marca comercial** | Cariñosas |
| **Producto Fase 1** | Marketplace de perfiles / directorio digital |
| **Fecha elaboración** | 2026-07-14 |
| **Fecha congelamiento** | 2026-07-14 |
| **Estado acta** | **CONGELADO** |
| **Aprobado por** | Product owner / usuario CariHub |
| **Implementación Directory Mode (Hide)** | **NO autorizada en esta acta** — solo documentación |
| **Runtime social (mensajes / estados / lives)** | **NO autorizado** como alcance Fase 1 |

SSOT narrativo: [`docs/gpt-knowledge/PRODUCTO-FASE-1-MARKETPLACE.md`](../docs/gpt-knowledge/PRODUCTO-FASE-1-MARKETPLACE.md)  
Regla Cursor: [`.cursor/rules/producto-fase-1-marketplace.mdc`](../.cursor/rules/producto-fase-1-marketplace.mdc)

---

## Objeto

Congelar la **definición oficial de producto** de Cariñosas Fase 1 **antes** de adaptar UI o borrar nada.

Esta acta **no** autoriza:

- implementar Directory Mode (capability gating),
- cerrar PP-01 (commit aparte, orden P0 siguiente),
- eliminar código, reglas, Functions ni documentación social.

---

## Decisiones congeladas

| Decisión | Valor |
|----------|-------|
| Naturaleza Fase 1 | Marketplace de perfiles; contacto vía métodos **públicos** |
| Mensajería interna / inbox | Future Architecture |
| States / Lives / social feed | Future Architecture |
| CTA mensaje interno / msg-by-perfil / msg-by-banner | Future Architecture |
| Planes, verificación, banners, favoritos, SEO, geo, categorías | Fase 1 |
| Slots publicitarios `*_estados` / `*_libe` | **Inventario de banners** — Fase 1 (no confundir con producto States/Lives) |
| Código social existente | Congelado / dormant — **no borrar** en Phase B |
| Orden post-documentación | 1) merge este freeze → 2) cerrar PP-01 → 3) Phase B Hide |

---

## Relación con actas previas

| Acta / visión | Relación |
|---------------|----------|
| `ACTA-CONGELAMIENTO-MESSENGER.md` | Diseño messenger sigue siendo referencia de **Future Architecture**; **no** es entrega Fase 1 |
| `dashboard-mensajes-vision.mdc` | Visión UX histórica; subordinada a esta acta para priorización |
| Actas dashboards / pagos / registro | Siguen vigentes en su dominio; el **alcance de producto** lo define esta acta |

---

## Implementación

Congelamiento de producto = **definición + documentación**.

Próximos pasos **fuera de esta acta** (requieren autorización explícita):

1. Merge de esta documentación.  
2. Commit atómico PP-01 (QA parity).  
3. Directory Mode Phase B: hide / flags — sin deletes.

---

*Acta CONGELADA — aprobación product owner 2026-07-14*
