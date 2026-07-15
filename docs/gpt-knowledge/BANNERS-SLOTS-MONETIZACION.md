# Banners, slots y monetización — CariHub

**Última revisión documental:** 2026-07-14  
**Producto Fase 1:** incluido (marketplace). SSOT: [PRODUCTO-FASE-1-MARKETPLACE.md](./PRODUCTO-FASE-1-MARKETPLACE.md)

> Nota: IDs `home_estados`, `home_libe`, `resultados_*_estados`, `perfil_estados`, etc. son **plazas publicitarias**, no el producto orgánico States/Lives (Future Architecture).

---

## Propósito

Inventario de espacios publicitarios (slots), contratación vía funnel banner, activación en Firestore, render en Home/Resultados/Perfil/Registro, precios y rotación.

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `public/registro-banner.html` | Funnel solicitud banner |
| `public/js/slots-catalog.js` | Catálogo slots MVP (28 slots) |
| `public/js/ch-slot-dock.js` | Montaje docks HTML |
| `public/js/publicidad-activa.js` | Lee `configuracion_publicidad` |
| `public/js/precios-publicidad.js` | Tabla precios |
| `public/js/banner-inventario-rotacion.js` | Rotación inventario |
| `public/js/banner-home-laterales.js` | `home_estados`, `home_libe` |
| `public/js/banner-resultados-principales.js` | Banner superior resultados |
| `public/js/banner-resultados-laterales.js` | Laterales resultados |
| `public/js/banner-perfil.js` | Slots perfil |
| `public/js/banner-sin-resultados.js` | Slots sin resultados |
| `public/js/dashboard-solicitudes-negocio.js` | Solicitudes desde dashboard |
| `public/admin.html` | Revisión solicitudes admin |
| `firestore.rules` | `slotIdPublicidadValido`, `solicitudes_anuncios` |
| `scripts/seed-configuracion-publicidad.json` | Seed slots (BAN-010) |

---

## Flujo funcional

```
1. Anunciante elige slot en registro-banner.html o dashboard
2. Crea solicitud → solicitudes_anuncios (estado pendiente)
3. Admin revisa en admin.html → autorizado_pago / rechazado
4. Pago (functions/payments) → activo
5. Snapshot en configuracion_publicidad/banners_activos
6. publicidad-activa.js + banner-*.js montan imagen en data-slot-id
7. vencerPerfiles / scheduler desactiva vencidos (ECO-030)
```

**Estados solicitud (admin):** pendiente, en_revision, requiere_correccion, autorizado_pago, activo, rechazado, vencido.

---

## Slots verificados

### En `slots-catalog.js` y `firestore.rules` (alineados)

- **Home:** `home_izquierda`, `home_derecha`, `home_inferior`, `home_categorias`, `home_hero_1..5`
- **Sin resultados:** `sin_resultados_*` (4)
- **Resultados:** `resultados_*` (4)
- **Perfil:** `perfil_*` (4)
- **Registro:** `registro_superior`

### En UI pero NO en rules ni slots-catalog (inconsistencia)

- `home_estados` — `index.html`, `banner-home-laterales.js`, `registro-banner.html`
- `home_libe` — idem

**Impacto:** solicitudes con estos slotId pueden fallar validación Firestore.

---

## Dependencias

- Firebase Auth + Firestore
- Storage para creativos banner
- `precios-publicidad.js`
- Dashboard rail banners (TICKET-025)
- Entitlements (`scripts/TICKETS-PLAN-ENTITLEMENTS-ENFORCEMENT.md`)

---

## Reglas críticas

1. `slotId` debe pasar `slotIdPublicidadValido()` en rules
2. Banner impago → conversaciones bloqueadas (dashboard vision + ECO)
3. Capacidad máxima por slot en `slots-catalog.js`
4. Banners sectoriales temáticos (`ad-banner-{sector}`) ≠ slots pagados — son decorativos en resultados

---

## Estado actual

- Catálogo 28 slots MVP operativo
- Funnel banner + admin revisión existentes
- Slots laterales home_estados/home_libe en UI sin backend alineado
- Banners sectoriales nuevos en `public/img/home/banners/`

---

## Pendientes

- Añadir `home_estados`/`home_libe` a rules + slots-catalog o retirar de UI
- ECO-030 activación automática post-pago
- Entitlements enforcement
- Métricas clic/impresión en dashboard (diseño rail)

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Bloqueador potencial** | Slot mismatch → solicitudes rechazadas |
| **Importante** | Servicios gratis post-vencimiento sin scheduler |
| **Importante** | Activación pago desde frontend sin webhook |
| **Importante** | Inventario rotación desincronizado con capacidad real |

---

## Validaciones necesarias

- Crear solicitud por cada slotId válido
- Verificar mount en página destino
- Admin flujo completo hasta activo
- Banner vencido → no visible + chat bloqueado

---

## Pendiente de confirmar

- Si `home_estados`/`home_libe` tienen datos en producción pese a rules
- Integración pagos real vs mock
- Tier premium hero slots — ocupación actual
