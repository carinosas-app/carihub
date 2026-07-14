# Cariñosas / CariHub — Producto Fase 1 (Marketplace de perfiles)

**Estado:** CONGELADO · definición oficial de producto  
**Marca comercial:** Cariñosas  
**Aprobado por:** Product owner  
**Fecha de freeze:** 2026-07-14  
**Acta:** [`scripts/ACTA-CONGELAMIENTO-PRODUCTO-FASE-1.md`](../../scripts/ACTA-CONGELAMIENTO-PRODUCTO-FASE-1.md)  
**Regla Cursor:** [`.cursor/rules/producto-fase-1-marketplace.mdc`](../../.cursor/rules/producto-fase-1-marketplace.mdc)

---

## Definición (SSOT)

**Fase 1** es un **marketplace de perfiles / directorio digital**:

- Los usuarios **descubren** perfiles por categoría y geografía.
- Los anunciantes **registran**, **gestionan** y **publican** fichas.
- El contacto hacia el proveedor ocurre **fuera de la plataforma**, mediante **métodos de contacto públicos**.
- La monetización de Fase 1 se basa en **planes**, **verificación** y **banners** (plazas pagadas).

**Fase 1 no es** red social, messenger, plataforma de lives ni producto de estados/stories.

---

## Incluido en Fase 1

| Capacidad | Rol |
|-----------|-----|
| Registration | Alta y datos de la ficha |
| Dashboard | Operación de perfiles, banners, info pública, contactos públicos, básicos |
| Public Profile | Ficha pública (superficie SEO) |
| Search / Results | Descubrimiento |
| Categories | Taxonomía del marketplace |
| Country / State / City | Geo |
| SEO | Landings / indexación de fichas (según plan vigente) |
| Verification | Confianza de la ficha |
| Plans | Derechos de publicación / monetización |
| Banners | Visibilidad pagada (slots de inventario) |
| Favorites | Guardados del visitante |
| Public contact methods | Única vía de contacto en Fase 1 |
| Basic statistics | Métricas básicas de ficha (no métricas de inbox) |

**Compatibles con Fase 1 (si se mantienen acotados):** promo **canal perfil** (`anunciar` en perfil/resultados); **no** canal mensajes.

---

## Future Architecture (no es Fase 1)

No entregar, no priorizar y no asumir como alcance de launch:

- Internal messaging  
- Inbox  
- States (estados orgánicos / stories)  
- Lives / transmitir en vivo  
- Social feed / red de socios  
- Internal contact button (`msg`)  
- Messaging by banners  
- Messaging by profile  
- Anuncios canal mensajes  
- Privacidad de mensajes (audiencia msgs/estados/lives)  
- Toggle registro “Mensajes internos” / mensaje-interno en banners  

El código, reglas Firestore, Functions, specs y documentación social **pueden existir**. Se tratan como **Future Architecture**: congelados, no borrados.

---

## Distinción crítica — slots `*_estados` / `*_libe`

Los IDs de plaza publicitaria (`home_estados`, `home_libe`, `resultados_*_estados`, `perfil_estados`, etc.) son **inventario de banners**, no el producto States/Lives.

**Fase 1 mantiene** ese inventario publicitario.

---

## Orden de trabajo autorizado tras este freeze

1. **Este documento + acta + regla Cursor** (P0 — fuente de verdad).  
2. **Cerrar PP-01** (contrato Registro ↔ mapToPerfil ↔ Perfil público) — válido en el marketplace.  
3. **Directory Mode Phase B** — capability gating / hide de superficies sociales (sin borrar código).  

**Prohibido por ahora:** borrar Firestore, Functions, rules o docs sociales; implementar messenger/lives/estados como Fase 1.

---

## Documentos relacionados (ahora subordinados a este SSOT para entrega)

| Documento | Tratamiento Fase 1 |
|-----------|-------------------|
| [LIVES-Y-ESTADOS.md](./LIVES-Y-ESTADOS.md) | Future Architecture |
| [ADMIN-Y-DASHBOARDS.md](./ADMIN-Y-DASHBOARDS.md) | Dashboard ops = Fase 1; mensajes sociales = Future Architecture |
| [BANNERS-SLOTS-MONETIZACION.md](./BANNERS-SLOTS-MONETIZACION.md) | Fase 1 (plazas) |
| `scripts/ACTA-CONGELAMIENTO-MESSENGER.md` | Diseño messenger = Future Architecture para runtime Fase 1 |
| `.cursor/rules/dashboard-mensajes-vision.mdc` | Visión histórica; **entrega** no autorizada en Fase 1 |

---

*Fuente de verdad de producto Fase 1 — no implementar superficies de Future Architecture sin acta posterior.*
