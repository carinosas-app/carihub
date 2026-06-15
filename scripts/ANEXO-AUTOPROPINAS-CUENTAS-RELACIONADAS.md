# ANEXO — Autopropinas y Cuentas Relacionadas v1.0.0

**Fecha:** 2026-06-11 · **Estado:** ANEXO DE ANÁLISIS DOCUMENTAL
**Complemento de:** `scripts/PLAN-MAESTRO-ECONOMIA-SOCIAL.json` (no lo modifica)
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover · no Firestore · no deploy · no commit · no modifica documentos existentes (solo los referencia).

> **Nota de resolución:** pediste "agregar al análisis de PLAN-MAESTRO-ECONOMIA-SOCIAL" y a la vez "no modificar documentos existentes". Igual que el `ANEXO-CRIPTOMONEDAS` (que no tocó `PLAN-MAESTRO-PAGOS-CONTRATOS`), esto se entrega como **anexo complementario nuevo** referenciado desde fuera del plan maestro.

---

## 1. Principio rector: dos planos independientes

| Plano | Qué incluye | Regla |
|---|---|---|
| **Financiero** | ingreso del receptor + comisión de CariHub | Toda propina **válida** se cobra, **incluyendo** autopropinas y cuentas relacionadas. |
| **Reputacional / social** | ranking, reputación, engagement, "creador destacado" por mérito, métricas públicas | Solo cuenta si la propina es **orgánica** (emisor independiente del receptor). |

**El dinero se cobra; la señal social se gana.** Ninguna IA aprueba pagos (RT-08). El precio de planes/contratos sigue congelado en MXN.

---

## 2. Definiciones

- **Autopropina:** emisor y receptor son la misma persona/propietario (misma identidad verificada o misma cuenta operando ambos lados).
- **Cuenta relacionada:** cuentas distintas vinculadas por señales fuertes (dispositivo, IP, método de pago, identidad, grafo).
- **Multi-cuenta:** un propietario opera proveedor + "clientes" títere para autodirigirse propinas/engagement.
- **Mismo dispositivo / IP / método de pago / identidad verificada:** señales de vínculo (ver §3).

Todas las señales se manejan **hasheadas**; PII prohibida en claro (`logsSeguridad`).

---

## 3. Señales de detección (consumidas, no inventadas)

Fuente congelada: `scripts/config-seguridad-mvp-schema.json`.

| Señal | Origen | Indica |
|---|---|---|
| `mismoDeviceIdHash` | `deteccionFraude.multicuentas` | mismo dispositivo |
| `mismoIPHash_24h` | `deteccionFraude.multicuentas` | misma IP (ventana corta) |
| `ineHash_duplicado` | `duplicadoPotencial` | misma identidad → **autopropina** |
| `email/telefono_similar`, `patronEmailDesechable` | `duplicadoPotencial` | cuentas títere |
| `duplicadoPotencial` / flag `DUPLICADO_SOSPECHOSO` | `riesgoReputacion.flags` | relación sospechosa |
| `mismoMetodoPagoHash` | **FUTURO** (datos de Pagos) | mismo instrumento de pago |
| `grafoRelacionCuentas` | **FUTURO** (derivado) | componente de cuentas vinculadas |
| `patronTemporal` (ráfagas, montos idénticos, reciprocidad) | **FUTURO** (analítica diferida) | coordinación no orgánica |

Scores existentes que se reutilizan: `riesgoScore`, `reputacionCuenta`, `nivelConfianza` (0-100). Las señales marcadas **FUTURO** son propuestas de diseño; no existen aún ni modifican el schema congelado.

---

## 4. Tipología de fraude

- **Fraude de engagement:** inflar interacciones para simular popularidad.
- **Fraude de ranking:** escalar en resultados/orden con propinas autodirigidas, desplazando a proveedores legítimos.
- **Fraude de reputación:** fabricar score/badges con dinero propio reciclado, engañando a clientes reales.

En los tres, el dinero puede ser real (genera comisión) pero la **señal es falsa** → se cobra la transacción pero **no** se concede beneficio reputacional/visibilidad.

---

## 5. Clasificación de propinas

| Clase | Nombre | Criterio | Tratamiento |
|---|---|---|---|
| **A** | Legítima / orgánica | sin señales de relación; riesgo bajo | cuenta para todo |
| **B** | Autopropina | misma identidad (`ineHash_duplicado`) / mismo propietario | financiero sí; reputacional no |
| **C** | Cuenta relacionada | cuentas distintas con señales fuertes | financiero sí; reputacional no |
| **D** | Sospechosa / en revisión | señales parciales/ambiguas | **cuarentena**: financiero en espera; reputacional no |

---

## 6. Matriz de cómputo (núcleo)

`SI` = cuenta · `NO` = excluida · `ESPERA` = retenido hasta resolución

| Clase | Ingreso receptor | Comisión plataforma | Ranking | Reputación | Creador destacado | Métricas públicas |
|---|---|---|---|---|---|---|
| **A** Legítima | SI | SI | SI | SI | SI | SI |
| **B** Autopropina | **SI** | **SI** | NO | NO | NO | NO |
| **C** Relacionada | **SI** | **SI** | NO | NO | NO | NO |
| **D** Sospechosa | ESPERA | ESPERA | NO | NO | NO | NO |

### Definiciones de cómputo (lo que pediste definir)
- **Para ingresos:** toda propina válida (A, B, C); D en espera y se libera si se confirma válida.
- **Para comisión:** CariHub cobra sobre **toda transacción válida procesada** (A, B, C); D en espera.
- **Para ranking:** solo **A**. B/C no afectan orden de resultados.
- **Para reputación:** solo **A**. B/C no suben `reputacionCuenta` ni dan badges.
- **Para creador destacado:** solo **A** por mérito social. (El "destacado/destacadoHome" **comprado por plan** es aparte y legítimo: es pago por plan, no señal orgánica.)
- **Excluidas de métricas públicas:** B, C y D. Se registran internamente marcadas en `SocialMonetizationLedger` para conciliación/auditoría (Admin), pero no se muestran como señal social pública.

---

## 7. Veredicto sobre tu política preliminar

> "Todas las propinas válidas generan comisión e ingreso para el receptor, pero las autopropinas o propinas de cuentas relacionadas no generan reputación, ranking ni métricas de engagement."

**Veredicto: RECOMENDADA.** Es coherente con separar el plano financiero (cobrar siempre) del reputacional (premiar solo lo orgánico), evita incentivar fraude de ranking/reputación sin renunciar a ingresos legítimos y reutiliza señales ya congeladas en Seguridad MVP.

**Refinamientos recomendados:**
1. **R1 — Clase D / cuarentena:** con señales parciales, la propina entra en cuarentena (ingreso/comisión en espera) en vez de contar de inmediato. Reduce reversiones.
2. **R2 — Auditoría y apelación:** toda exclusión reputacional queda auditada y es apelable (Admin), con tolerancia explícita a falsos positivos (familia/oficina/NAT pueden compartir dispositivo/IP legítimamente).
3. **R3 — Alcance ampliado:** excluir también "creador destacado por mérito" y **toda** métrica pública, no solo engagement; el destacado **comprado por plan** permanece válido.
4. **R4 — Reciprocidad/lavado:** ráfagas, montos idénticos y patrones recíprocos elevan `riesgoScore` y mueven a clase D aunque no haya señal dura (cubre mulas/colusión).

---

## 8. Reglas operativas

- **Tiempo real:** clasificación inicial A/B/C/D por señales duras (identidad/dispositivo/IP/método de pago) al procesar la propina.
- **Diferido (batch):** reevaluación con grafo y patrones temporales puede reclasificar y **retirar beneficios reputacionales** ya concedidos. El dinero/comisión **no** se revierte salvo fraude probado por Admin.
- **No doble conteo:** `SocialMonetizationLedger` registra cada propina una vez con su clase; ranking/reputación leen **solo clase A**.
- **Falsos positivos:** mismo dispositivo/IP no implica autopropina por sí solo; se requiere combinación de señales + umbral; siempre apelable.
- **Transparencia:** el receptor ve sus propinas y su clase (orgánica vs no computable), coherente con la transparencia de origen de Interacciones.
- **IA sin dinero:** la IA detecta/sugiere/alerta clasificación, pero **no** aprueba pagos, **no** libera cuarentenas y **no** revierte fondos (RT-08); decide un humano (Admin).

---

## 9. Riesgos

| ID | Nivel | Riesgo | Mitigación |
|---|---|---|---|
| AP-R01 | crítico | Lavado/estructuración vía autopropinas | comisión + registro auditado, límites, KYC, conciliación Admin, AML (ES-R02) |
| AP-R02 | alto | Inflado de ranking con dinero propio | ranking solo clase A; B/C excluidas; reevaluación diferida |
| AP-R03 | alto | Reputación/badges artificiales | reputación solo A; métricas públicas excluyen B/C/D |
| AP-R04 | alto | Evasión vía "mulas" sin señal dura | señales blandas (reciprocidad/montos/ráfagas) → clase D; ML post-MVP |
| AP-R05 | medio | Falsos positivos (familia/oficina/NAT) | umbral multi-señal; apelación; no revertir dinero por sospecha |
| AP-R06 | medio | Fiscal: autopropina infla base gravable | reglas fiscales/CFDI sobre transacciones reales; marcar clase |
| AP-R07 | medio | Contracargos/reversas en cuentas relacionadas | política de disputas (Admin); irreversibilidad controlada; cuarentena D |

---

## 10. Dependencias, impactos y orden

- **Dependencias:** Seguridad MVP 1.0.0 (señales), Pagos backbone (método de pago hash), Interacciones (ranking/reputación/origen), Admin (apelaciones/conciliación), AGENTES-IA (detección, RT-08).
- **Impactos (diseño futuro, sin modificar nada):** Pagos marca clase + método de pago hash (comisión igual, precio congelado intacto); Interacciones lee solo clase A para ranking/reputación; Dashboards muestra clase al receptor; Admin gestiona cuarentena/apelaciones; IA solo alerta.
- **Orden:** P0 definir clases+matriz en SPEC → P1 clasificación en tiempo real + exclusión B/C + cuarentena D → P2 reevaluación diferida (grafo/temporal) → P3 apelaciones/IA/ML.

---

## 11. Procedencia

**Sí procede** este anexo (`.json` + `.md`) — entregados. **Siguientes pasos:** incorporar la matriz en `SPEC-ECONOMIA-SOCIAL`; `ADR-PROPINAS-AML-FISCAL` (umbrales/lavado/fiscal con datos reales); definir `mismoMetodoPagoHash` y `grafoRelacionCuentas` con Pagos operativo.

> No modifica `PLAN-MAESTRO-ECONOMIA-SOCIAL`, `config-seguridad-mvp-schema.json` ni demás capas/actas/ADRs (solo los referencia/consume). Sin cambios en producción/Firestore/deploy/commit.
