# Auditoría técnica final — ValidationEngine v1.0.0 (pre-congelamiento)

| Campo | Valor |
|-------|-------|
| **Fecha** | 2026-06-09 |
| **Estado** | **No aprobar congelamiento aún** |
| **Veredicto** | Diseño sólido con hallazgos obligatorios de documentación |

Canónico: [`AUDITORIA-FINAL-SPEC-VALIDATIONENGINE.json`](./AUDITORIA-FINAL-SPEC-VALIDATIONENGINE.json)

---

## Resumen ejecutivo

ValidationEngine v1.0.0 cumple su rol de **puente diseño** entre las cinco capas congeladas y el runtime futuro. La arquitectura (pipeline, delegación FieldEngine, Turnstile/rate limits centralizados, media, IA con confirmación humana) es **coherente y defendible**.

El bloqueador principal para congelar **no es runtime ni Firestore**, sino la **incompletitud del contrato EventBus**: el `mapeoAccionEvento` cubre ~8 acciones de 40+, mientras el texto exige historial/notificaciones en casi todas las acciones exitosas. Eso genera contradicciones con fixtures (V02, V16) y con Dashboards 1.0.0.

**OB-VE1–5:** **Cerrados** (2026-06-09).  
**¿Puede congelarse sin cambios documentales?** **Sí** (post OB-VE).  
**¿Aprobar acta CONGELADO ahora?** **No** — pendiente firma PO.

---

## 1. Compatibilidad con capas congeladas

| Capa | Veredicto | Nota clave |
|------|-----------|------------|
| **Catálogo 1.0.0** | Compatible | Formularios y coherencia OK; falta whitelist edición post-publicación vs RenderEngine |
| **Cuentas 1.0.0** | Compatible con reserva | `anuncianteId`, multi-perfil y upgrade éxito poco especificados |
| **Seguridad MVP 1.0.0** | Compatible con gaps | Turnstile/limits alineados; `validateAuth` ausente en orden JSON; `ESTADO_CUENTA_INVALIDO` faltante |
| **FieldEngine 1.0.1** | Compatible | AM1 borrador restringido OK; riesgo drift matriz VE vs gates FE |
| **Dashboards 1.0.0** | Parcial | Dominios citados; **registry EventBus incompleto**; notificación revisión admin mal modelada |

---

## 2. Dependencias ocultas

- `config-contratos-carihub-schema.json` — upgrade y renovar  
- `config-renderizado-dinamico-schema.json` — campos editables publicados  
- `logs_acceso_privado` — admin INE (Dashboards, no VE)  
- Storage rules + App Check (Seguridad, no VE)  
- Ejecutor persistencia post-`ValidationResult` (implícito)  
- Acta migración `usuarios/{uid}` → `perfiles/{perfilId}` (**crítica**, no en VE)

---

## 3. Contradicciones internas

| ID | Severidad | Hallazgo |
|----|-----------|----------|
| CI-01 | **Alta** | MD: `validateAuth` paso 3; JSON `algoritmoValidacion.orden` **no incluye** `validateAuth` |
| CI-02 | **Alta** | `enviar_revision`: dos filas `mapeoAccionEvento` sin contrato multi-destino |
| CI-03 | **Alta** | “Casi toda acción → historial” vs mapeo ~15% acciones |
| CI-04 | Media | V02 `notificacion_admin.*` vs Dashboards `verificaciones.verificacion_recibida` |
| CI-05 | Media | `ownerChecks.actualizar_solicitud` vs acciones `editar_banner` / `actualizar_solicitud_pre_pago` |
| CI-06 | Media | `matrizAccionEstado` incompleta (admin, media, renovar, upgrade) |
| CI-07 | Media | `GATE_SEGURIDAD_DENEGADO` vs `ESTADO_SEGURIDAD_DENEGADO` |
| CI-08 | Baja | `maxDuracionSegundos` video sin contrato entrada media |

---

## 4. Casos límite no contemplados

- Doble `enviar_revision` con `estadoRevision=en_revision`  
- Borrador sin email verificado (permitido Seguridad — sin fixture)  
- `pendiente_activacion`, verificación vencida, rechazada + reenvío  
- Upload INE en estados revisiones mixtos  
- Banner en `pago_pendiente` + edición  
- `ia_aceptar` → `validateAction` anidado falla (rollback no definido)  
- Autosave borrador vs rate limit 30/h  
- Favorito a `perfilId` inexistente  
- Multi-perfil mismo `usuarioId`

---

## 5–7. Riesgos (implementación, migración, áreas)

### Implementación futura (críticos)

1. **RI-1** — Runtime sin registry acción→eventos → notificaciones/historial rotos  
2. **RI-2** — Persistencia desacoplada de EventBus  
3. **RI-3** — MIME spoofing MVP media  

### Migración

| Entidad | Nivel | Riesgo |
|---------|-------|--------|
| `usuarios/{uid}` monolito | **Crítico** | Owner checks y paths `perfiles/` inoperantes |
| `perfiles/{perfilId}` | Alto | Storage e historial dependen migración |
| Contratos / banners | Alto–medio | Renovación y funnel parcial en producción |
| Dashboard shell | Medio | `evaluateDashboardAction` vs modales `index.html` |

### Turnstile · rate limits · owner · RBAC · EventBus · IA

- **Turnstile:** orden Auth vs anónimo; acciones Cloudflare no catalogadas  
- **Rate limits:** autosave borrador; `ia_consulta` inline vs Seguridad schema  
- **Owner:** `anuncianteId`, bridge `perfilId=uid`, multi-perfil  
- **RBAC:** admin fase 1 email total; sin `logs_acceso_privado` en spec  
- **EventBus:** un evento vs N destinos; sin idempotencia `validationId`  
- **IA:** re-entrada `validateAction`; TTL `expirada` no en VE  

---

## 8. Revisión fixtures V01–V18

| Calidad | Detalle |
|---------|---------|
| **Fortaleza** | Gates seguridad, Turnstile, rate limit, owner, media, IA, admin denegado |
| **Debilidad** | V16 (`renovar_contrato`) sin mapeo EventBus; V02 naming notif; V07 sin historial registro |
| **Faltan** | Upgrade éxito, revisión en restringido, admin aprobar OK, upload selfie historial, favorito, IA aceptar OK |

---

## 9. Costoso si se descubre post-runtime

- Rediseño `EventoCanonico` / fan-out  
- Reordenar pipeline Auth/Turnstile en Callables desplegados  
- Magic bytes media  
- RBAC claims sustituyendo email-admin  
- Paths Storage tras bridge `uid`→`perfilId`  

---

## 10. Cobertura EventBus (acción → evento / notif / historial / logs / IA)

**Veredicto: INCOMPLETO**

Acciones **con** mapeo explícito: `enviar_revision`, `guardar_borrador`, `crear_solicitud_banner`, `categoria_sugerida`, `denuncia`, `ia_aceptar_recomendacion`, `login`.

**Sin** mapeo documentado (ejemplos): `registro_visitante`, `upgrade_perfil_publico`, todos `subir_*`, `renovar_contrato`, `admin_*`, `favorito_*`, `contacto_publico`, `mensaje_enviar`.

Para congelar, cada acción en `acciones.*` debe tener fila en registry con `emitirHistorial`, `emitirNotificacion`, `logsSeguridad`, `iaRecomendaciones` — **aunque sea `false`**.

---

## Fortalezas

- Puente claro entre capas congeladas  
- Fallo temprano sin eventos espurios  
- Delegación FieldEngine 1.0.1 (AM1)  
- Seguridad centralizada server-side  
- Media + IA bien encuadrados  
- Interacciones v1.2.1 fuera de alcance  

## Debilidades

- Registry EventBus ~15% completo  
- Contradicción MD/JSON pipeline  
- Matrices estado/acción parciales  
- Dependencias ocultas migración y RenderEngine  
- Fixtures insuficientes para fan-out  

---

## Ajustes obligatorios (antes de congelar)

| ID | Acción |
|----|--------|
| **OB-VE1** | Unificar orden pipeline JSON+MD; `validateAuth` explícito |
| **OB-VE2** | Contrato multi-destino EventBus; resolver duplicado `enviar_revision` |
| **OB-VE3** | Registry completo acción→eventos (todas las acciones, `false` explícito) |
| **OB-VE4** | Modelar notificación admin al recibir revisión (alineado Dashboards) |
| **OB-VE5** | Catálogo errores: `ESTADO_CUENTA_INVALIDO` + guía códigos gate |

## Ajustes recomendados (no bloquean si se documentan en acta)

AM-VE1 fixtures V16/V19–V24 · AM-VE2 bridge migración · AM-VE3 owner anunciante · AM-VE4 duración video · AM-VE5 logs_acceso_privado · AM-VE6 estadoRevision · AM-VE7 rate limit autosave  

---

## Recomendación final

| Pregunta | Respuesta |
|----------|-----------|
| ¿Congelar sin cambios? | **No** |
| ¿Congelar tras OB-VE1–5? | **Sí**, recomendado |
| ¿Actualizar acta? | **Sí** — checklist OB-VE + AM-VE |
| ¿Aprobar ahora? | **No** — pendiente cierre OB-VE en SPEC/fixtures |

Esfuerzo estimado ajustes: **una sesión de diseño** (JSON/MD/fixtures únicamente).

---

*Auditoría de diseño — sin runtime, Firestore, producción, deploy, commit ni aprobación de congelamiento.*
