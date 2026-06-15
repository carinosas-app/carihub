# PLAN-MAESTRO-PAGOS-CONTRATOS v1.0.0

**Fecha:** 2026-06-10 · **Estado:** PLAN DE DISEÑO DOCUMENTAL
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover archivos · no Firestore · no deploy · no commit · no modifica capas existentes.

> **Principio rector:** El **pago confirma**, el **contrato congela**, el **motor activa**. Precio y promoción quedan **CONGELADOS** durante toda la vigencia del contrato (`politicaPrecioCongelado`). Admin concilia y decide; ninguna IA modifica precios de contratos activos ni auto-aprueba pagos.

Construido sobre los schemas de diseño ya existentes (`config-contratos-carihub-schema.json`, `config-precios-planes-perfiles-schema.json`, `config-promociones-*`), que **referencia y no modifica**.

---

## 1. Inventario actual (pagos · contratos · comprobantes)

| Área | Estado | Evidencia |
|---|---|---|
| **Pagos** | **No implementado** (cobro manual) | `admin.html`: `feedPagos` → "Pagos aparecerán al conectar Stripe/MercadoPago" (1095); `contarColeccion('pagos')` solo cuenta (1048); módulos UI Pagos/Renovaciones (809-810) |
| **Contratos** | Diseño en schema | `config-contratos-carihub-schema.json`: `contratos_perfiles`, `contratos_banners`, `renovaciones` con precio/promoción congelados; sin runtime |
| **Comprobantes** | Parcial (banner) | `flujoBanner`: autorizado_para_pago → pago_pendiente → admin confirma → pago_confirmado; comprobante manual implícito, sin colección formal |
| **Precios** | Diseño detallado | `config_precios_perfiles` (MXN, IVA incluido, redondeo 50, planes/periodos/overrides); banners separados |
| **Vencimientos** | Por flag | `admin.html` usa `u.vencido`; sin contrato formal ni job |

---

## 2. Tipos de cliente

| Cliente | Contrato | Productos |
|---|---|---|
| Perfil independiente | `contratos_perfiles` | membresía, renovación, verificación |
| Negocio | `contratos_perfiles` (negocio_empresa) | + datos fiscales opcionales |
| Anunciante | `contratos_banners` | banner, campaña, espacio, paquete |
| Empresa (futura) | multi-perfil/multi-banner | *futuro* |
| Operador interno | N/A — no paga, actúa por delegación Admin (scope) | — |

---

## 3. Productos cobrables

- **Perfiles:** membresía (publicación/visibilidad), renovación, verificación (KYC/INE futura), promociones.
- **Banners:** banner por espacio, campaña (multi-espacio/tiempo), espacio individual, paquete, promociones (tiempo igual gratis).
- **Futuros:** servicios premium, boost temporal, destacados puntuales.
- **Regla:** productos de perfil **nunca** usan `precios_banners` y viceversa.

---

## 4. Precios y vigencias

- **Moneda:** MXN · **IVA incluido** · **redondeo:** 50.
- **Planes:** básico · destacado · premium · vip.
- **Periodos (factor):** semanal `0.35` · quincenal `0.65` · mensual `1.0` · anual *(reservado, factor 10, inactivo)*.

**Precios base perfil por formulario (mensual):**

| Formulario | básico | destacado | premium | vip |
|---|---|---|---|---|
| adultos | 499 | 899 | 1299 | 1999 |
| persona_independiente | 249 | 499 | 799 | 1199 |
| profesionista_cedula | 399 | 699 | 1099 | 1599 |
| negocio_empresa | 599 | 999 | 1499 | 2499 |
| usuario_visitante | 99 | 149 | 199 | 299 |

**Resolución de precio:** base global → porFormulario → override (subcategoría > sector > formulario > ciudad > estado > país > global) → factorPeriodo → redondeo 50 → IVA incluido.

**Promociones:** perfil → primer mes gratis / 2x1; banner → tiempo igual gratis (7→14, 15→30, 30→60, 90→180 días).
**Prueba gratis:** `puedeCrearPerfilGratis` si contrato vigente sin perfil; `usuario_visitante` cobra registro inicial pero no publica perfil al inicio.
**Reglas futuras editables desde Admin** (comercial_admin): los cambios **no afectan contratos activos** (congelado).

---

## 5. Contratos

- **Tipos:** perfil, negocio, anunciante/banner, campaña, renovación, por servicio (futuro).
- **Colecciones:** `contratos_perfiles` · `contratos_banners` · `renovaciones` · `contratos_historial`.
- **Campos congelados:** `precioContratado`, `versionPrecio`, `promocionAplicada`, `versionPromocion`.
- **Aceptación digital:** `aceptoTerminos`, `versionTerminos`, `fechaAceptacion`, evidencia (ipHash/userAgentHash/uid), `hashContrato`. Sin aceptación → `pendiente_aceptacion` (no activa servicio).
- **Vigencia:** fechaInicio → fechaVencimiento (periodo + días bonificados).
- **Renovaciones:** post-vencimiento o ventana pre-vencimiento; usa precio/promo **vigentes al renovar** (no hereda congelado); registra `contratoAnteriorId`.
- **Estados contractuales:** borrador · pendiente_aceptación · activo · suspendido · vencido · cancelado · renovado · reemplazado.

---

## 6. Pagos y métodos

- **Frecuencias:** único, semanal, quincenal, mensual, trimestral, semestral, anual.
- **Modalidades:** anticipado, vencido, parcial, rechazado, duplicado, manual, automático (futuro).
- **Estados:** pendiente · en_revisión · por_vencer · vencido · pagado · rechazado · cancelado · reembolsado · suspendido · duplicado · parcial.
- **Métodos:** transferencia · SPEI · tarjeta · Stripe · Mercado Pago · depósito · comprobante manual · futuros.
- **Colección:** `pagos/{pagoId}` con `usuarioId, contratoId, producto, monto, metodo, estadoPago, comprobanteId, fechaPago, fechaConfirmacion, confirmadoPor, esManual, pasarela, idTransaccionPasarela, duplicadoDe`.

---

## 7. Facturación y comprobantes

- **Facturación (opcional):** RFC, razón social, uso CFDI, régimen fiscal, correo de facturación, constancia. Documentos: factura, nota, constancia. **No bloquea activación.** Datos fiscales con acceso auditado.
- **Comprobantes:** `comprobantes/{id}` (propuesta) → tipos: pasarela / manual (imagen). Ciclo: subido → en_revisión → validado | rechazado(motivo) → historial. Imagen en Storage privado, acceso admin auditado.

---

## 8. Ciclos de vida

- **Pago:** pendiente → en_revisión → pagado | rechazado | duplicado | parcial → (reembolsado | cancelado).
- **Contrato:** borrador → pendiente_aceptación → activo → (vencido | suspendido | cancelado) → (renovado/reemplazado).
- **Comprobante:** subido → en_revisión → validado | rechazado → historial.
- **Servicio/activación:** contrato activo + pago confirmado → publicado/activo → por_vencer → vencido/oculto → renovado/reactivado.

---

## 9. Relación pago → servicio

| Situación | Resultado |
|---|---|
| Perfil: contrato activo + pago confirmado + revisión OK | **publicado** |
| Banner: autorizado_para_pago → pago_confirmado (sin cambios) | **publicado**; con cambios → `revision_post_pago` |
| Campaña | igual que banner por cada espacio/slot |
| Renueva | pago renovación confirmado → nuevo contrato + nueva vigencia |
| Suspende | impago/denuncia/decisión admin → suspendido, oculto |
| Vence | fechaVencimiento sin renovación → vencido + oculto |
| Oculta | vencido/suspendido → RenderEngine no publica |
| Reactiva | pago/renovación o levantamiento de suspensión → activo |
| **No paga** | no se activa; pendiente/por_vencer → tras gracia vencido/oculto |
| **Paga tarde** | reactivación con precio/promo vigentes (renovación), no congelado anterior |
| **Comprobante rechazado** | pago→rechazado; no activa; permite reenvío |
| **Pago duplicado** | marcar `duplicado`; conciliación → reembolso/crédito |
| **Reembolso** | pago→reembolsado; contrato→cancelado/suspendido; auditoría + aprobación superior |

---

## 10. Dashboards (solo visualización)

- **Perfil:** historial de pagos, próximos vencimientos, contrato activo, comprobantes enviados, renovar.
- **Negocio:** + datos fiscales/facturas.
- **Anunciante:** pagos de banners/campañas, vigencias por espacio, comprobantes.
- **Admin:** conciliación, pagos pendientes/en_revisión, contratos activos/vencidos, comprobantes a validar, reembolsos, ingresos por plan/ciudad.

> Las acciones de aprobación/conciliación viven en **Admin** (PLAN-MAESTRO-ADMIN). Operador con scope ve un subconjunto.

---

## 11. Admin (conciliación)

- **Acciones:** aprobación manual, conciliación, auditoría, revisión pagos/contratos/comprobantes, reembolsos, cancelaciones, excepciones, modificar precios/vigencias, suspensión/reactivación manual.
- **Doble confirmación:** reembolso · cancelar contrato · modificar vigencia de activo · suspensión con impacto público.
- **Auditoría obligatoria:** confirmar/rechazar pago · validar/rechazar comprobante · acceso a datos fiscales · modificar precios · reembolso.
- **Aprobación superior:** reembolso · excepción de precio/vigencia · modificación de contrato activo · cancelación con reembolso.

---

## 12. Automatizaciones

Recordatorio pre-vencimiento · aviso de vencimiento · renovación (manual/auto futura) · suspensión automática por impago · reactivación post-pago · generación de contrato · generación de comprobante (pasarela) · notificación de pago recibido/rechazado · notificación de contrato por vencer.
**Regla:** jobs idempotentes; toda mutación → log + notificación; suspensión/vencimiento **no borra** datos (oculta). Infra: Cloud Functions scheduled.

---

## 13. Seguridad

Trazabilidad (logsAdmin + logs financieros) · antifraude (duplicados, validación de comprobante, límites, match monto↔contrato) · validación documental con PrivacyAccessGuard · permisos (solo comercial_admin/super_admin escriben; auditor lee; datos fiscales auditados) · doble confirmación en reembolsos/cancelaciones/modificación de activos.

---

## 14. Integraciones

Shared/Core (config/helpers/tokens) · ValidationEngine (transiciones/montos) · FieldEngine (datos fiscales/contrato) · RenderEngine (estado decide publicar/ocultar) · Dashboards (visualización) · Admin (conciliación) · Banners (contratos/activación) · Messenger (notificaciones, no cobra en chat) · SEO (vencido → noindex) · ThemeEngine (premium/vip habilita skins) · Agentes IA (iaComercial/iaFinanciera **solo lectura**).

---

## 15. Matrices clave

### Producto → precio → vigencia
| Producto | Precio | Vigencia |
|---|---|---|
| Perfil básico | base global 299 × factor periodo | según periodo |
| Perfil VIP | base global 1499 × factor periodo | según periodo |
| Banner espacio | `precios_banners` por espacio/imagen/video | `diasTotales` (incl. bonificados) |
| Campaña | suma de espacios/paquete | ventana de campaña |

### Contrato → producto
- `contratos_perfiles` → membresía, renovación, verificación.
- `contratos_banners` → banner, campaña, espacio, paquete.
- `renovaciones` → renovación perfil/banner.

### Transición de pago
`pendiente → {en_revisión, cancelado}` · `en_revisión → {pagado, rechazado, duplicado, parcial}` · `pagado → {reembolsado, por_vencer}` · `por_vencer → {pagado(renovación), vencido}` · `parcial → {pagado, cancelado}`.

### Transición de contrato
`borrador → pendiente_aceptación → activo → {suspendido, vencido, cancelado}` · `vencido → renovado` · `renovado → reemplazado`.

### Permisos (resumen)
ver pagos propios = usuario dueño · confirmar pago = comercial_admin/super_admin · validar comprobante = comercial_admin/moderador/super_admin · reembolso = super_admin (aprobación superior) · modificar precios = comercial_admin/super_admin · lectura financiera = auditor/ia_bot.

---

## 16. Módulos internos y rutas

**Módulos:** PricingResolver · ContractFactory · PaymentLedger · ComprobanteValidator · Billing/CFDI (opcional) · RenewalScheduler · ReconciliationConsole · DunningEngine · FinanceReporter (IA solo lectura).

**Rutas usuario:** `/cuenta/pagos`, `/cuenta/pagos/historial`, `/cuenta/pagos/renovar`, `/cuenta/contratos`, `/cuenta/facturacion`.
**Rutas admin:** `/admin/pagos`, `/admin/pagos/conciliacion`, `/admin/contratos`, `/admin/comprobantes`, `/admin/reembolsos`, `/admin/facturacion`.

---

## 17. Riesgos

| ID | Nivel | Riesgo | Mitigación |
|---|---|---|---|
| PC-R01 | crítico | Cobro 100% manual; sin conciliación/trazabilidad | PaymentLedger + estados + auditoría |
| PC-R02 | crítico | Cambio de precio afectaría activos | politicaPrecioCongelado |
| PC-R03 | alto | Pagos duplicados sin detección | `duplicadoDe` + match monto↔contrato + conciliación |
| PC-R04 | alto | Comprobante manual fraudulento | ComprobanteValidator + PrivacyAccessGuard + doble revisión |
| PC-R05 | alto | Mezclar perfiles vs banners | separación obligatoria de colecciones |
| PC-R06 | medio | Reembolso sin control | doble confirmación + aprobación superior + auditoría |
| PC-R07 | medio | Datos fiscales (RFC) expuestos | acceso auditado + rules restrictivas |
| PC-R08 | medio | Vencimiento por flag sin contrato formal | contratos_perfiles + RenewalScheduler |
| PC-R09 | bajo | IA financiera con write accidental | deny-write (ninguna IA modifica activos) |

---

## 18. Dependencias

- **Congeladas:** Shared/Core 1.0.0 · RenderEngine 1.0.0 · ValidationEngine 1.1.0 · FieldEngine 1.0.1 · Dashboards 1.0.0.
- **Planes:** PLAN-MAESTRO-ADMIN (conciliación/RBAC) · PLAN-MAESTRO-REGISTRO-CUENTA (datos cliente/fiscales).
- **Schemas de diseño:** contratos · precios · promociones (perfiles y banners).
- **Precondiciones:** pasarela (Stripe/Mercado Pago) o flujo manual formalizado · Cloud Functions para jobs · rules para pagos/contratos/comprobantes/facturas · migración usuarios→perfiles.

---

## 19. Estructura ideal futura (lógica; sin crear carpetas)

Submódulo de pagos en `/cuenta` (usuario) + consola en `/admin`. Núcleo: PricingResolver, ContractFactory, PaymentLedger, ComprobanteValidator, RenewalScheduler, ReconciliationConsole. Separación estricta perfiles ⟂ banners; pagos/contratos/comprobantes desacoplados de Dashboards (solo lectura) y de Banners (inventario).

---

## 20. Orden recomendado de implementación

1. **P0** — PaymentLedger + estados + comprobante manual + conciliación admin → cierra PC-R01.
2. **P0** — ContractFactory con precio/promoción congelados + aceptación digital → cierra PC-R02.
3. **P1** — RenewalScheduler (recordatorios/vencimiento/suspensión/reactivación) → cierra PC-R08.
4. **P1** — ComprobanteValidator + antifraude (duplicados) + PrivacyAccessGuard fiscal → cierra PC-R03/04/07.
5. **P2** — Integrar pasarela (Stripe/Mercado Pago) + pago automático.
6. **P2** — Facturación CFDI opcional + reportes IA (solo lectura).
7. **P3** — Campañas/paquetes banners avanzados + empresa multi-perfil.

---

## 21. Procedencia

**Sí procede** `PLAN-MAESTRO-PAGOS-CONTRATOS.md/json` — entregados. Es la columna financiera del negocio y unifica precios (ya diseñados), contratos congelados, comprobantes, estados/transiciones y conciliación admin, hoy 100% manual.

**Siguientes pasos sugeridos:** `PLAN-MAESTRO-BANNERS` · `ADR-PASARELA-PAGO` (Stripe vs Mercado Pago) · `SPEC-PAGOS-CONTRATOS` (si se autoriza congelar).

> No modifica capas congeladas ni los schemas de precios/contratos existentes (solo los referencia). Sin cambios en producción/Firestore/deploy/commit.
