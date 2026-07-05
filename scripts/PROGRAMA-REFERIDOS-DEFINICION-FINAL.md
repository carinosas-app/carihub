# Programa de referidos CariHub — definición final

Fecha: 2026-06-23  
Estado: **congelado definitivo** (topes 6 recompensas · 90 días/año)  
Alineado: freeze v2.2, `PLANES-CARIHUB-DEFINICION-FINAL.md`, `config-promociones-perfiles-schema.json`  
Absorbe en: **ECO-015**, **ECO-030**, **ECO-080**, **ADM-020** — sin módulo ni ticket nuevo.

---

## 1. Diseño del programa (reglas de negocio)

### 1.1 Quién invita — qué recibe

| Concepto | Valor |
|----------|-------|
| Recompensa | **+15 días de vigencia** en el contrato activo del perfil que el referidor elija (default: `perfilActivoId`) |
| Forma | Extensión de `fechaVencimiento` del contrato vigente (no cash, no descuento %, no plan upgrade automático) |
| Acumulable | Sí, hasta topes anuales (ver §1.6) |

### 1.2 Invitado — qué recibe

| Concepto | Valor |
|----------|-------|
| Trial estándar | **30 días Profesional** (igual que cualquier alta nueva aprobada — `primer_mes_gratis`) |
| Extra por referido | **+7 días** adicionales de trial Profesional (**37 días total**) si registró código válido **antes** de la aprobación admin |
| Descuento en primer pago | **No** en MVP (evita doble promo + fraude contable) |
| Si no usa código | Solo 30 días trial estándar |

### 1.3 Cuándo se acredita la recompensa al referidor

```
Registro invitado con ?ref=CODIGO
    → vinculación referidoPorUid (pendiente)
Admin aprueba invitado
    → trial Profesional 37d (con ref) o 30d (sin ref)
Invitado publica y usa trial
    → referidor: estado "en_trial" (sin recompensa aún)
Invitado paga PRIMER mes (cualquier plan de pago, webhook ECO-030/031 OK)
    → referidor: +15 días acreditados (estado "acreditado")
```

**No se acredita:** en registro, en aprobación admin, al iniciar trial, en renovaciones del invitado (solo **primer pago**).

Ventana: el primer pago del invitado debe ocurrir dentro de **90 días** desde su aprobación admin; si no, la recompensa expira (`expirada_sin_pago`).

### 1.4 Invitado nunca paga

- Referidor **no recibe** días extra.
- Registro queda en historial dashboard referidor como **“No convirtió”**.
- Sin reversa (nada que revertir).

### 1.5 Invitado paga — por plan

**Misma recompensa flat para el referidor (+15 días)** sin importar plan del invitado:

| Plan que paga el invitado | Referidor recibe | Invitado (ya tuvo trial) |
|---------------------------|------------------|---------------------------|
| Básico | +15 días | Pasa a Básico pagado |
| Profesional | +15 días | Pasa a Profesional pagado |
| Premium | +15 días | Pasa a Premium pagado |
| Especial | +15 días | Pasa a Especial pagado |

*Razón:* evita incentivar cuentas trucha en Especial solo para premiar al referidor; simplicidad operativa.

### 1.6 Límites máximos por referidor (cuenta) — CERRADO

| Límite | Valor | Nota |
|--------|-------|------|
| Recompensas acreditadas por año calendario | **6** | 6 × 15 = 90 — ambos topes se alcanzan juntos |
| Días bonus acumulados por año | **90** | Coherente con recompensas (no hay tope fantasma) |
| Recompensa por mismo invitado | **1** (vida útil) | — |
| Invitados vinculados activos pendientes | **30** | Cola anti-granja |
| Código referido por cuenta | **1** | Inmutable tras primer uso público |

**Regla:** al llegar a **6 acreditaciones** o **90 días** en el año calendario (UTC-6 México), no se otorgan más recompensas hasta el 1 ene siguiente.

### 1.7 Código y enlace

- Formato: `ref={codigoReferido}` en URL registro (`registro-perfil.html?ref=ABC123XY`).
- Código: 8 caracteres alfanuméricos, generado al crear cuenta verificada.
- Campo: `usuarios/{uid}.codigoReferido`.
- Invitado: `usuarios/{uid}.referidoPorUid` + `referidoCodigoUsado` — **solo escritura en registro**, inmutable tras `enviado_revision`.

---

## 2. Integración técnica (sin módulo nuevo)

### 2.1 ECO-015 — PromoResolver

Extender `config-promociones-perfiles-schema.json` con tipo:

```json
"referido_programa": {
  "id": "referido_programa",
  "beneficioInvitado": { "diasExtraTrial": 7 },
  "beneficioReferidor": { "diasExtensionVigencia": 15 },
  "ventanaPrimerPagoDias": 90,
  "topesAnuales": { "maxAcreditaciones": 6, "maxDiasBonus": 90 }
}
```

Funciones en ECO-015 (mismo bundle Pricing/Entitlements):

| Función | Rol |
|---------|-----|
| `validarCodigoReferido(codigo)` | Existe, activo, no auto-referido |
| `vincularReferido(inviteeUid, codigo)` | Registro; set referidoPorUid |
| `calcularTrialReferido(inviteeUid)` | 30 + 7 días si vinculado |
| `evaluarRecompensaReferidor(inviteeUid, ordenPagoId)` | Post-webhook primer pago |
| `aplicarExtensionVigencia(referrerUid, dias, perfilId)` | Extiende contrato activo |

Campo `ordenes_pago`: `esPrimerPagoReferido`, `referidoPorUid`, `referidorRecompensado: boolean`.

### 2.2 ECO-030 / ECO-031

Tras pago confirmado:

1. Si `esPrimerPagoReferido` y reglas OK → llamar `evaluarRecompensaReferidor`.
2. Idempotencia: `referidorRecompensado === true` → skip.
3. Escribir evento en `usuarios/{referidorUid}.referidosLedger[]` (array acotado, últimos 100) — **no colección nueva**.

### 2.3 ADM-020

Sección **Promociones → Referidos**:

- Activar / pausar programa.
- Editar: días invitado (+7), días referidor (+15), ventana 90d, topes **6/90**.
- Tabla operativa: referidor | invitado | estado | fecha | acción manual (acreditar / revocar / marcar fraude).
- Filtros: pendiente, acreditado, expirado, rechazado_fraude.

### 2.4 ECO-080 — Dashboard anunciante

Bloque **“Invita y gana días”** (col. derecha o módulo Plan):

- Código + botón copiar enlace.
- Contador año: **X / 6** recompensas · **Y / 90** días ganados.
- Tabla simple:

| Invitado (alias) | Estado | Tu beneficio |
|------------------|--------|--------------|
| María · enfermera | En trial | Pendiente de pago |
| Juan · masajes | Pagó Profesional | +15 días ✓ |
| … | No convirtió | — |

Sin PII del invitado más allá de alias público + subcategoría.

### 2.5 Métricas admin (ADM-020 / ADM-030)

| Métrica | Uso |
|---------|-----|
| Referidos vinculados / mes | Volumen programa |
| Tasa trial → primer pago | Efectividad |
| Recompensas acreditadas / mes | Costo en días regalados |
| Recompensas rechazadas fraude | Salud antifraude |
| Top referidores (solo admin) | Detectar granjas |
| Tiempo medio registro → primer pago | Calidad tráfico |
| % invitados con mismo teléfono/dispositivo hash | Señal fraude |

---

## 3. Auditoría fraude y abuso

Escala: **Riesgo** (B/M/A) · **Probabilidad** (B/M/A) · **Impacto** (B/M/A) · **Costo control** (B/M/A operativo)

| Escenario | R | Prob | Imp | Detección | Mitigación | Costo ctrl | Recomendación |
|-----------|---|------|-----|-----------|------------|------------|---------------|
| **Cuentas falsas** | A | M | M | Mismo dispositivo fingerprint hash; patrones registro rápido | Verificación email+tel obligatoria antes de vincular ref; admin aprueba cada perfil | B | **Obligatorio:** no acreditar hasta primer pago + aprobación admin |
| **Auto-referirse** | A | A | M | `referidoPorUid === referrerUid`; mismo tel/email | Bloqueo hard en `vincularReferido` | B | **Obligatorio** |
| **Múltiples correos** | M | A | M | Normalizar email (lowercase, alias gmail+) | 1 cuenta = 1 email verificado; ref solo cuenta nueva | B | **Obligatorio** email verificado |
| **Múltiples teléfonos** | M | M | M | Mismo tel en >2 cuentas → flag | Tel verificado único por cuenta activa; flag admin | M | **Obligatorio** tel verificado para acreditar |
| **Múltiples perfiles mismo referidor** | B | A | B | Varios perfiles, 1 cuenta referidor | Recompensa es por **cuenta invitada nueva**, no por perfil extra del invitado | B | Permitido; 1 pago cuenta = 1 recompensa |
| **Familiares/amigos artificiales** | M | A | M | Mismo IP/dispositivo en 24h; misma geo improbable | Límite 6/año; primer pago real; ventana 90d | B | Aceptar residual; no perseguir familia real |
| **Cancelar tras beneficio referidor** | M | M | B | Invitado paga → +15d → chargeback 14d | Acreditar **14 días después** del pago (hold) o revocar si reembolso | M | **Post-launch:** hold 14d (obligatorio simple: revocar si reembolso ECO-030) |
| **Compras reembolsadas** | M | M | M | Webhook reembolso | Revertir días si aún dentro ventana; marcar `rechazado_fraude` | B | **Obligatorio** hook reembolso → revertir |
| **Cuentas suspendidas** | B | B | B | estadoRevision suspendido | No acreditar si invitado/referidor suspendido | B | **Obligatorio** |
| **Cuentas duplicadas** | A | M | M | Tel/email/device hash duplicado | Bloquear vinculación ref si cuenta previa existía con mismo tel | M | **Obligatorio** dedup tel |
| **VPN** | B | M | B | Geo distinta | No bloquear VPN; confiar en pago real + tel | B | No invertir en anti-VPN MVP |
| **Dispositivos compartidos** | B | A | B | Mismo deviceHash | Solo flag si >3 refs mismo device en 30d | B | Flag manual admin, no auto-block |
| **Granjas de referidos** | A | B | A | >5 refs/mes mismo referidor; mismo device | Topes 6/año · 90d; revisión admin top referidores | M | **Obligatorio** topes + tabla admin |
| **Abuso trials gratis** | M | A | M | Invitado trial 37d sin pagar nunca | Referidor no gana; trial único por cuenta/tel | B | Ya cubierto por diseño |
| **Referidor sin contrato activo** | B | M | B | Sin fechaVencimiento vigente | Acreditar igual: crea extensión en próximo contrato o cola `diasBonusPendientes` max 30d | M | Cola max 30d pendientes |

---

## 4. Reglas antifraude — resumen

### Obligatorias antes de activar programa (puede ser post-LAUNCH-6D pero antes de abrir referidos al público)

1. Email verificado para vincular código.
2. Teléfono verificado antes de **acreditar** referidor (puede registrarse antes).
3. Bloqueo auto-referido (mismo uid / email / tel).
4. Una recompensa por invitado uid (lifetime).
5. Topes **6/año** y **90 días/año** (6 × 15 = 90).
6. Acreditación solo tras **primer pago** webhook (no trial).
7. Reversión si reembolso/chargeback.
8. No acreditar si referidor o invitado suspendido.
9. Cuenta invitada debe ser **nueva** (sin perfil publicado previo en misma cuenta/tel).

### Post-lanzamiento (mejora, no bloquea abrir programa)

1. Hold 14 días antes de acreditar días al referidor.
2. deviceHash fingerprint + flag >3 refs/dispositivo/30d.
3. Alertas automáticas top referidores en ADM-020.
4. Revocación masiva admin por lote fraude.

---

## 5. Clasificación freeze v2.2

| Pregunta | Respuesta |
|----------|-----------|
| ¿Ticket absorbe? | **ECO-015** (motor) + **ECO-030** (acreditación) + **ECO-080** (UI) + **ADM-020** (config/admin) |
| ¿Ticket nuevo? | **No** |
| ¿Bloqueador LAUNCH-6D? | **No** — el sitio lanza sin referidos públicos |
| ¿Importante post-lanzamiento? | **Sí** — activar tras ECO-015 + ADM-020 + primer ciclo pagos estables |
| ¿Mejora futura? | Hold 14d, device fingerprint avanzado |

---

## 6. Copy comercial (anunciante)

> **Invita colegas y gana 15 días extra** en tu plan cuando publiquen y paguen su primer mes.  
> Tu invitado recibe **7 días más** de prueba Profesional con tu enlace.

---

## 7. Checklist implementación

- [ ] Tipo `referido_programa` en `config-promociones-perfiles-schema.json`
- [ ] Campos `usuarios`: codigoReferido, referidoPorUid, referidosLedger, diasBonusAnio, acreditacionesAnio
- [ ] ECO-015: validar, vincular, calcular trial, evaluar recompensa
- [ ] ECO-030: hook primer pago + idempotencia
- [ ] ECO-080: panel referidos
- [ ] ADM-020: CRUD programa + tabla fraude
- [ ] Flag programa `activo: false` hasta post-launch review
