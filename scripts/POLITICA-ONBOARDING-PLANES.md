# Política de onboarding — sin trial en plan Básico

Fecha: 2026-06-23  
Estado: **decisión de producto** (pendiente implementación runtime)  
Relacionado: `scripts/tickets-plan-entitlements-enforcement.json`, auditoría sostenibilidad aceptada

---

## Decisión

**No ofrecer plan Básico como primera experiencia.** El anunciante debe vivir un plan con cupos reales (mensajes, galería, visibilidad) para entender el valor antes de decidir si renueva.

El plan Básico **sigue existiendo** como opción post-trial para categorías de bajo consumo (bienestar, salud local, etc.), pero **nunca** como:
- mes gratis de bienvenida,
- default en registro,
- downgrade automático “silencioso” tras promo.

---

## Propuesta recomendada (elegir una variante)

| Variante | Qué vive el usuario | Costo simbólico | Notas |
|----------|---------------------|-----------------|-------|
| **A — Recomendada** | **30 días Destacado** completos | $0 (gratis) o **$1 MXN simbólico** (valida tarjeta) | Simple de comunicar: *“Tu primer mes Destacado va por nuestra cuenta.”* |
| **B — Híbrida** | **15 días Premium** + **15 días Destacado** | $0 | Más “wow” en semana 1; algo más compleja de explicar y de enforcement. |
| **C — Premium corto** | **15 días Premium** solamente | $0 | Menos cupo que 30d Destacado; mejor para categorías ya Premium/Especial en auditoría. |

**Recomendación:** variante **A (30 días Destacado gratis)** para el lanzamiento general. Reserva B/C para campañas sectoriales (adultos, eventos) cuando Pagos esté estable.

---

## Qué incluye el trial Destacado (30 días)

Alineado a `config-plan-entitlements-schema.json` → plan `destacado`:

- 6 fotos · 1 video · ~0.15 GB perfil  
- Adjuntos imagen en chat (cuando messenger los habilite)  
- 2 estados activos · badge destacado · prioridad media resultados  

**No** incluir VIP/packs/lives extendidos en trial salvo categoría que **exija** Especial (adultos creador, venues): ahí trial = **15d Premium + 15d Destacado** o trial acortado VIP con cupo acotado (decisión comercial aparte).

---

## Después del trial

1. **Notificación** 7 días y 1 día antes del fin.  
2. **Checkout** con plan recomendado por categoría (auditoría), no forzar Básico.  
3. **Downgrade permitido** solo si categoría lo permite (244 subs pueden Básico) **y** el usuario elige explícitamente — nunca auto-Básico sin confirmación.  
4. Si no paga → grace 7d → perfil oculto (ENT-043), no borrar media de golpe.

---

## Presupuesto infra absorbido (~USD 50/mes)

Tu techo de **USD 50/mes** (~875 MXN a 17.5) para Firebase en los **primeros 2–3 meses** es razonable como **CAC operativo** (comparable a Cursor + ChatGPT + herramientas).

Con el modelo de auditoría (costo típico **~$1–4 MXN/perfil/mes** en uso normal):

| Perfiles activos trial | Costo infra estimado/mes |
|------------------------|--------------------------|
| 50 | ~$50–200 MXN |
| 200 | ~$200–800 MXN |
| 300+ con algunos virales | puede acercarse a $875 MXN |

**Salvaguardas (cuando implementen):**

- Alerta admin a **USD 40** acumulado en billing Firebase.  
- Hard cap promos: máx **N trials activos/mes** (ej. 150) si el tráfico explota.  
- Trial **requiere** verificación mínima (email/teléfono) para evitar granjas de cuentas.  
- Sin trial en categorías de abuso conocido hasta ENT-050/051 operativos.

Si pocos clientes pagan pero muchos trial → el riesgo no es storage promedio sino **5–10 perfiles virales**; por eso ENT-011/012 siguen siendo P0 aun con promo generosa.

---

## Mensaje comercial (borrador)

> **Primer mes Destacado gratis** — publica con más fotos, más visibilidad y todas las herramientas para recibir contactos. Después del mes, tú eliges el plan que se ajuste a tu categoría; te mostramos cuánto espacio usaste y qué plan te conviene.

Evitar: *“Plan básico gratis”* — no comunica valor.

---

## Impacto en tickets técnicos

| Ticket | Cambio |
|--------|--------|
| **ENT-051** | Gate checkout: `planTrialOnboarding = destacado` — no permitir checkout `basico` como primera activación salvo opt-in explícito post-trial. |
| **ENT-002** | Resolver entitlements: flag `origenPlan: trial_destacado \| contrato \| promo` + `fechaFinTrial`. |
| **ENT-020** | Dashboard: banner *“Estás en mes de bienvenida Destacado — X días restantes”* + CTA renovación. |
| **ECO-040** | Extender `vencerPerfiles`: vencer trial → estado `trial_expirado` antes de `vencido`. |
| **Nuevo ENT-054** | Promo onboarding — ver JSON tickets. |

---

## Lo que NO cambia

- Auditoría financiera: **244 categorías pueden seguir en Básico** como plan de pago barato **después** de haber probado Destacado.  
- Plan mínimo sostenible por categoría (adultos → VIP, etc.): sigue aplicando en **pago**, no en trial genérico.  
- Runtime / Firebase / deploy: **sin cambios** hasta autorizar implementación.

---

## Próximo paso

Confirmar variante (**A, B o C**). Con eso se puede fijar copy, precios schema y criterios de aceptación de ENT-054 en implementación futura.
