# Anexo: criptomonedas en Pagos y Contratos

**Anexo complementario de** `PLAN-MAESTRO-PAGOS-CONTRATOS v1.0.0` · **Fecha:** 2026-06-10 · **Estado:** ANÁLISIS (no activa cripto)
**Modo:** Solo análisis y documentación. No activar cripto · no runtime · no carpetas · no mover · no Firestore · no deploy · no commit · no actas · no SPEC. **NO modifica el plan host ni ningún documento existente.**

> **Principio rector:** la unidad de cuenta y el **precio congelado** del contrato permanecen en **MXN** (`politicaPrecioCongelado`). Cripto entra (futuro) como **método de pago** con conversión a MXN al momento del pago vía proveedor; preferentemente **stablecoins** y **non-custodial** (CariHub no custodia fondos). Admin concilia; ninguna IA aprueba pagos ni mueve fondos.

> **Estado actual:** sin pasarela conectada (admin.html: "Pagos aparecerán al conectar Stripe/MercadoPago"). Cripto es estrictamente futuro.

---

## 1. Por qué stablecoins-first

Stablecoins (USDC/USDT) eliminan la volatilidad entre cotización y liquidación. BTC/ETH/SOL volátiles exigen conversión inmediata y exponen a riesgo cambiario y fiscal mayor.

---

## 2. Activos analizados

| Activo | Tipo | Volatilidad | Rol | Veredicto |
|---|---|---|---|---|
| BTC | volátil | alta | reserva de valor | Solo montos altos con conversión, o vía Lightning |
| Lightning | L2 BTC | hereda BTC (mitigable) | micropagos/propinas | Buena para micropagos internacionales (futuro) |
| USDT | stablecoin | baja | internacional | Útil; red barata (Solana/Tron); emisor opaco |
| USDC | stablecoin | baja | internacional | **PREFERIDA** (transparente/regulada) |
| Stablecoins futuras | stablecoin | baja | MXN-pegged ideal | Monitorear stablecoin MXN regulada |
| ETH (red) | liquidación | — | settlement USDC/USDT | Usar L2 (Base/Arbitrum), no L1 |
| Solana (red) | liquidación | — | settlement rápido/barato | Buena red para stablecoins |

---

## 3. Casos de uso futuros

| Caso | ¿Aplica? | Fase | Nota |
|---|---|---|---|
| Pagos internacionales | Sí | internacional | Justificación principal: clientes sin medios MXN |
| P2P entre usuarios | No recomendado | futuro lejano | Agrava AML/KYC y custodia |
| Propinas | Posible | futuro | Lightning/USDC; reglas fiscales/antifraude |
| Compras internas | Posible | futuro | Créditos en MXN |
| Campañas publicitarias | Sí | internacional | Anunciantes internacionales en USDC |
| Suscripciones | Limitado | futuro | Cripto no soporta cargos recurrentes nativos |

---

## 4. Conversión y multi-moneda

Factura/CFDI y precio del contrato **siempre en MXN**; cripto se cotiza a MXN al momento del pago con tasa del proveedor y ventana de validez corta. Multi-moneda/multi-país/multi-idioma solo para **visualización**; la fuente de verdad contable es MXN. IVA y CFDI se calculan en MXN: cripto no cambia la obligación fiscal.

---

## 5. Custodia

| Dimensión | Opción | Veredicto |
|---|---|---|
| Custodia | Custodial (CariHub guarda fondos) | **EVITAR** (licencia, hackeo, AML, responsabilidad) |
| Custodia | **Non-custodial** (PSP procesa/liquida) | **RECOMENDADO** (menor carga regulatoria, settlement fiat) |
| Wallet | Propia | No recomendado (claves, monitoring, AML) |
| Wallet | **Proveedor/PSP externo** | **RECOMENDADO** (abstrae redes/conversión) |

---

## 6. Arquitectura recomendada

- **Multi-moneda:** `montoMXN` (congelado, fuente de verdad) + bloque cripto informativo. Campos **sugeridos NO activados**: `criptoActivo`, `redLiquidacion`, `montoCripto`, `tasaConversionMXN`, `ventanaTasaExpira`, `proveedorCripto`, `idTxOnChain`, `confirmaciones*`, `estadoOnChain` (compatibles con `pagos.campos` existentes: `moneda`, `pasarela`, `idTransaccionPasarela`, `duplicadoDe`).
- **Conciliación:** pago iniciado → proveedor detecta tx → confirmaciones on-chain ≥ umbral → liquida (MXN/stablecoin) → webhook → `pago='confirmado'` → contrato activa. Excepciones (subpago/sobrepago/late) en **Admin**; IA no aprueba.
- **Trazabilidad:** hash de tx, red, confirmaciones, proveedor, tasa, timestamp → AuditTrail. Nunca almacenar claves privadas; no exponer wallet en público (PrivacyGuard).
- **Reembolsos/disputas:** on-chain es **irreversible** (sin chargeback) → reembolso como **crédito MXN** o transferencia fiat con aprobación superior; disputas resueltas por Admin con evidencia on-chain.
- **Comprobantes:** montoMXN + equivalente cripto + hash tx; CFDI en MXN.
- **Contratos multi-moneda:** el contrato permanece en MXN con precio congelado; se registra método=cripto y referencia de liquidación, sin romper `politicaPrecioCongelado`.

---

## 7. Compatibilidad

Pagos (nuevo valor del enum, hoy `futuros`) · Contratos (sin cambio de unidad) · Dashboards (visualizan montoMXN + estado on-chain) · Admin (concilia/reembolsa con auditoría) · Facturación (CFDI MXN intacto) · Internacionalización (habilitador clave, por mercado legal) · Agentes IA (recomienda/alerta, nunca aprueba — RT-08) · Marketplace futuro (método internacional opcional) · Banners (campañas internacionales en stablecoin) · Campañas internacionales (USDC preferida).

---

## 8. Riesgos

Fiscales (ISR/IVA, facturar en MXN) · legales (Ley Fintech MX, marco variable) · AML/KYC (screening de wallets; peor en P2P) · fraude (subpago/sobrepago, 0-conf, manipulación de tasa) · operativos (dependencia de proveedor, reorgs, soporte 24/7) · custodia (hackeo/pérdida de claves → se evita non-custodial) · regulatorios por país · volatilidad (BTC/ETH/SOL) · stablecoins vs volátiles (riesgo de emisor/depeg vs riesgo cambiario).

---

## 9. Matrices

### Criptomoneda → ventajas → riesgos
- **BTC:** adopción/reserva · volatilidad/fees/lento → solo montos altos o Lightning.
- **Lightning:** instantáneo/barato/micropagos · liquidez de canales/volatilidad BTC → propinas internacionales futuras.
- **USDT:** estable/líquido/multired · emisor opaco/depeg → internacional, red barata.
- **USDC:** estable/transparente/regulado · emisor centralizado → **preferida**.
- **ETH (red):** ecosistema · gas alto → usar L2.
- **Solana (red):** rápida/barata · estabilidad histórica → buena para stablecoins.

### Método → complejidad → utilidad
- **PSP non-custodial stablecoin:** media / alta → **recomendado** nacional/internacional.
- **PSP Lightning:** media / media → futuro propinas.
- **Wallet propia custodial:** muy alta / alta → **evitar**.
- **On-chain directo sin proveedor:** alta / media → no recomendado.
- **P2P directo:** alta / baja → desaconsejado (AML).

---

## 10. Recomendaciones por fase

- **MVP:** **ninguna criptomoneda activa.** Mantener MXN vía pasarela fiat (Stripe/Mercado Pago) cuando se conecte. Cripto sigue como `futuros`.
- **Nacional:** opcional, **USDC vía PSP non-custodial** con settlement a MXN, solo si hay demanda real; conciliación en Admin; factura en MXN.
- **Internacional:** USDC/USDT vía PSP non-custodial para anunciantes/campañas; Lightning para micropagos/propinas; por mercado legal con KYC/AML.
- **Futuro:** monitorear stablecoin MXN regulada (eliminaría conversión); P2P/propinas solo con AML maduro.

---

## 11. Riesgos abiertos, dependencias e impactos

- **Abiertos:** selección de PSP con settlement MXN; política fiscal/contable de conversión; umbral de confirmaciones y ventana de tasa; cobertura KYC/AML; mapeo regulatorio por país.
- **Dependencias:** plan host (precio congelado MXN), Admin (conciliación/PrivacyAccessGuard), Agentes IA (RT-08), Banners (campañas internacionales), Seguridad MVP (antifraude). Precondición: **pasarela fiat operativa primero**.
- **Impactos en Pagos/Contratos (diseño futuro, NO activados):** cripto como nuevo valor del enum `metodos`; bloque de campos cripto compatible con `pagos.campos`; precio congelado y CFDI en MXN intactos.

> No modifica el plan host ni Firestore. Todos los impactos son de diseño futuro.
