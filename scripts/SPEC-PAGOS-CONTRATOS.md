# SPEC-PAGOS-CONTRATOS v1.0.0

**Fecha:** 2026-06-11 · **Estado:** DISEÑO INICIAL · **Implementación autorizada:** NO  
**Modo:** Solo análisis, especificación, fixtures, auditoría y documentación. No runtime · no modifica planes/schemas/actas existentes.

> **Principio rector:** El pago confirma; el contrato congela; el motor activa. Precio y promoción quedan **CONGELADOS** durante la vigencia (`politicaPrecioCongelado`). Admin concilia; ninguna IA modifica contratos activos ni auto-aprueba pagos.

**Cierra:** GAP-SPEC-PAY

---

## 1. Fronteras del módulo

| Módulo | Responsabilidad Pagos-Contratos | Delegado a |
|---|---|---|
| Pricing | Resolución multi-dimensional MXN | config_precios_perfiles |
| Contratos | Snapshot congelado, aceptación digital | contratos_perfiles / contratos_banners |
| Pagos | PaymentLedger, estados, métodos | ValidationEngine |
| Comprobantes | Subida, validación admin | Storage privado + Admin |
| Activación | pago_confirmado → publicado/activo | Registro + RenderEngine |
| Dashboard | DM-04 vigencia, DM-05 pagos, DM-06 renovación | Solo lectura |
| Admin | Conciliación, confirmar, reembolsos | PLAN-MAESTRO-ADMIN |

**Fuera de alcance MVP SPEC:** cripto (ANEXO futuro), CFDI automático (V1.2), pasarela runtime (BLK-02 documentada).

---

## 2. Tipos de cliente y productos

| Cliente | Contrato | Productos |
|---|---|---|
| Perfil / independiente | contratos_perfiles | membresía, renovación |
| Negocio | contratos_perfiles | membresía + fiscal opcional |
| Anunciante | contratos_banners | banner, campaña, espacio |
| Visitante | contratos_perfiles | registro inicial; perfil gratis si contrato vigente |

**Separación obligatoria:** precios/contratos perfiles ⟂ banners (PC-R05).

---

## 3. Flujo principal

```
CotizarPrecio (PricingResolver)
    → CrearContrato (ContractFactory + snapshot congelado)
    → AceptaciónDigital
    → RegistrarPago / SubirComprobante
    → Admin confirma (MVP manual) | Webhook pasarela (futuro BLK-02)
    → pago_confirmado + contrato activo
    → Activación servicio (publicado/activo)
    → RenderEngine publica snapshot
```

### Renovación

```
Contrato vencido → renovarContrato (VE gates)
    → Nuevo contrato con precio VIGENTE (no hereda congelado)
    → Pago → activación
```

---

## 4. Precios y congelamiento

- **Moneda MVP:** MXN, IVA incluido, redondeo 50
- **Planes:** básico, destacado, premium, vip
- **Periodos:** semanal (×0.35), quincenal (×0.65), mensual (×1.0)
- **Resolución:** base → formulario → override geo → periodo → promo
- **Congelado:** `precioContratado` + `versionPrecio` + promo fijos hasta vencimiento
- **Admin:** cambios de config NO afectan contratos activos

---

## 5. Estados

### Pago
pendiente → en_revision → pagado | rechazado | duplicado | parcial

### Contrato
borrador → pendiente_aceptacion → activo → vencido | suspendido | cancelado

### Perfil (publicación)
autorizado_para_pago → pago_pendiente → pago_confirmado → publicado → activo → vencido

---

## 6. Dashboard mínimo (frontera)

| ID | Widget | Fuente |
|---|---|---|
| DM-04 | Vigencia plan | contratos_perfiles.fechaVencimiento |
| DM-05 | Pagos realizados | pagos/{pagoId} |
| DM-06 | CTA renovación | renovarContrato → Pagos |

---

## 7. Matrices obligatorias (14)

`productoPrecioVigencia`, `resolucionPrecio`, `pagoServicioActivacion`, `contratoProducto`, `estadoPagoAcciones`, `transicionPago`, `transicionContrato`, `rolPermisos`, `metodoPago`, `promocionAplicacion`, `fronteraModulos`, `errorMensaje`, `comprobanteValidacion`, `fiscalClasificacion`

---

## 8. Contratos (9)

`Pago`, `ContratoPerfil`, `ContratoBanner`, `Renovacion`, `ComprobantePago`, `PrecioResuelto`, `PromocionAplicada`, `AceptacionDigital`, `SnapshotPrecioCongelado`

---

## 9. API lógica

| Operación | Delegación |
|---|---|
| `cotizarPrecio` | PricingResolver |
| `crearContrato` | ContractFactory |
| `registrarPago` | ValidationEngine + PaymentLedger |
| `subirComprobante` | VE comprobante_pago |
| `confirmarPagoAdmin` | Admin → activación |
| `renovarContrato` | VE renovar_contrato |
| `webhookPasarela` | BLK-02 documentado |
| `obtenerEstadoContrato` | Agregado contrato + pagos |

---

## 10. Seguridad

- Antifraude: duplicados, match monto↔contrato
- Doble confirmación: reembolsos, cancelación activo
- IA: deny-write (RT-08, PC-R09)
- Fiscal: RFC/comprobantes sensibles, PrivacyAccessGuard

---

## 11. Criterios de aceptación

- CA-01: Transiciones vía ValidationEngine
- CA-02: Precio congelado en contrato activo
- CA-03: Renovación precio vigente
- CA-04: Separación perfiles/banners
- CA-05: Comprobantes/RFC nunca públicos
- CA-06: Activación post pago_confirmado
- CA-07: Admin concilia; IA no aprueba
- CA-08: DM-05/06 integrados
- CA-09: Fixtures PAY-01..PAY-10 PASS
- CA-10: Auditoría PASS

---

## 12. Referencias

- `scripts/SPEC-PAGOS-CONTRATOS.json`
- `scripts/fixtures-pagos-contratos-golden.json`
- `scripts/AUDITORIA-SPEC-PAGOS-CONTRATOS.json`
- `scripts/PLAN-MAESTRO-PAGOS-CONTRATOS.json`
