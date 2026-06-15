# PLAN-MAESTRO-AGENTES-IA v1.0.0

**Fecha:** 2026-06-10 · **Estado:** PLAN DE DISEÑO DOCUMENTAL
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover archivos · no Firestore · no deploy · no commit · no modifica capas existentes.

> **Principio rector:** La IA **recomienda, redacta y alerta**; el **humano decide**; los **motores ejecutan**. Ningún agente ejecuta acciones críticas sin aprobación humana. Toda acción de agente se registra en AuditTrail con `origen=agente`. **Por defecto: solo lectura (deny-write).**

---

## 1. Reglas transversales obligatorias

| ID | Regla |
|---|---|
| RT-01 | Ningún agente ejecuta acciones críticas sin aprobación humana |
| RT-02 | Toda acción de agente se registra en AuditTrail (origen, modelo, prompt-hash, entrada, salida, decisión humana) |
| RT-03 | Distinguir SIEMPRE 4 salidas: `recomendacion` / `borrador` / `alerta` / `ejecucion` (solo motor autorizado) |
| RT-04 | Registrar origen de actividad: humano / sistema / agente (consistente con Interacciones) |
| RT-05 | Acceso a datos sensibles restringido por rol Y propósito (need-to-know); PrivacyGuard en prompts |
| RT-06 | Prohibidas decisiones automáticas irreversibles |
| RT-07 | Prohibida moderación final sin Admin humano |
| RT-08 | Prohibidos pagos, reembolsos, suspensiones o eliminaciones sin doble confirmación humana |
| RT-09 | Separar agentes visibles al usuario de agentes internos |
| RT-10 | Documentar qué agentes pueden escribir (borrador/staging) y cuáles solo leer |
| RT-11 | Rate-limit y presupuesto de tokens por agente; circuit-breaker ante anomalías |
| RT-12 | Explicabilidad: citar fuentes/datos; sin alucinación (anclar a índices) |

### Niveles de autonomía
- **L0:** solo lectura/respuesta informativa.
- **L1:** recomienda (no escribe).
- **L2:** redacta borrador en staging (requiere aprobación humana para publicar).
- **L3:** dispara ejecución vía motor SOLO con aprobación humana previa + AuditTrail. **Ningún agente es L3 por defecto.**

---

## 2. Inventario de agentes

### Públicos (visibles al usuario, salvo SEO/Landing internos)
| Agente | Visib. | Nivel | Escritura | Aprobación |
|---|---|---|---|---|
| Home | usuario | L0 | ninguna | no |
| Resultados | usuario | L0 | ninguna | no |
| Perfil Público | usuario | L0 | ninguna | no (PrivacyGuard) |
| SEO | interno | L2 | borrador | sí (catalogo_admin) |
| Landing | interno | L2 | borrador | sí |

### Registro
| Agente | Visib. | Nivel | Escritura | Notas |
|---|---|---|---|---|
| Registro Perfil/Negocio/Anunciante | usuario | L2 | borrador | no publica; usuario confirma, Admin aprueba |
| Wizard | usuario | L1 | ninguna | dudas de campos (FieldEngine) |
| Verificación | interno | L2 | borrador | pre-clasifica INE/selfie; **no aprueba** (riesgo privacidad alto) |

### Dashboard
| Agente | Visib. | Nivel | Escritura |
|---|---|---|---|
| Dashboard Perfil/Negocio/Anunciante | usuario | L1 | ninguna (solo datos del dueño) |
| Dashboard Empresa (futuro) | usuario | L1 | ninguna |
| Dashboard Operador (futuro) | interno | L1 | ninguna (dentro de scope) |

### Admin
| Agente | Visib. | Nivel | Escritura | Prohibiciones clave |
|---|---|---|---|---|
| Admin General (Arquitecto) | interno | L1 | ninguna | crear categoría / cambiar precio / aprobar perfil |
| Moderación | interno | L2 | borrador | moderación final sin Admin (RT-07) |
| Seguridad | interno | L1 | ninguna | revocar sesión / cambiar rules |
| Auditoría | interno | L1 | borrador (informes) | modificar logs |
| Cumplimiento | interno | L1 | ninguna | decisión legal final |
| Pagos | interno | L2 | borrador | confirmar/reembolsar (RT-08) |
| Contratos | interno | L1 | ninguna | modificar contrato activo |
| Banners | interno | L2 | borrador | auto-publicar / override inventario |
| SEO Admin | interno | L2 | borrador | publicar sin revisión |
| Messenger (control) | interno | L1 | ninguna | leer conversaciones sin denuncia/auditoría |

### Soporte
| Agente | Visib. | Nivel | Escritura | Notas |
|---|---|---|---|---|
| Soporte Usuario/Anunciante/Negocio | usuario | L2 | borrador (ticket) | escala a humano |
| Recuperación de Cuenta | usuario | L1 | ninguna | no resetea sin verificación (riesgo alto) |
| Facturación | usuario | L2 | borrador | RFC/datos fiscales (riesgo alto) |

### Futuros
Traducción (L1) · Recomendaciones (L1, no genera interacciones reales) · Marketing (L2) · Analítica (L1) · Antifraude (L1) · Optimización SEO (L2) · ThemeEngine (L2, no aplica sin aprobación).

---

## 3. Matrices

### Agente → permisos
- **Solo lectura (L0/L1):** Home, Resultados, Perfil Público, Wizard, Dashboard*, Admin General, Seguridad, Cumplimiento, Contratos, Messenger, Recuperación, Analítica, Antifraude, Recomendaciones.
- **Borrador/staging (L2):** SEO, Landing, Registro*, Verificación, Moderación, Pagos, Banners, SEO Admin, Soporte*, Facturación, Marketing, Optimización SEO, ThemeEngine.
- **Ejecución (L3):** ninguno por defecto — solo vía motor autorizado con aprobación humana puntual + AuditTrail.

### Agente → módulos accesibles
Home/Resultados/Perfil → App Pública (lectura) + RenderEngine (salida) · Registro/Wizard/Verificación → Registro/Cuenta + FieldEngine + VE · Dashboard* → Dashboards (lectura del dueño) · Admin* → Admin (lectura + borrador) + logs · Pagos/Contratos/Facturación → Pagos/Contratos · Banners/SEO/Landing → Banners/SEO + RenderEngine · Messenger → metadatos (contenido solo con denuncia + auditoría).

### Agente → datos accesibles
Públicos (catálogo/geo/perfiles publicados/métricas públicas) · por dueño (Dashboard*) · sensibles con PrivacyGuard (Verificación→INE/selfie, Facturación→RFC, Messenger→conversación solo en denuncia) · prohibidos (datos de terceros sin propósito, logs inmutables, credenciales).

### Agente → aprobación humana
- **No requiere (solo informa):** Home, Resultados, Perfil Público, Wizard, Dashboard* (lectura).
- **Requiere aprobación (publicar/aplicar):** SEO, Landing, Registro*, Verificación, Moderación, Pagos, Banners, SEO Admin, Soporte*, Facturación, ThemeEngine.
- **Doble confirmación (RT-08):** Pagos (reembolso/confirmación), Moderación (suspender/eliminar), Recuperación de Cuenta (reset).

### Agente → riesgo
- **Alto:** Verificación (privacidad INE), Pagos (financiero/legal), Moderación (legal), Messenger (privacidad), Cumplimiento (legal), Facturación (fiscal), Recuperación (seguridad).
- **Medio:** SEO, Landing, Banners, Seguridad, Auditoría.
- **Bajo:** Home, Resultados, Wizard, Dashboard*, Traducción.

---

## 4. Ciclos de vida

- **Agente:** diseño → registro en AgentRegistry (permisos/scope/nivel) → pruebas en sandbox (golden) → habilitación por Admin (feature flag) → operación (L0–L2 con AuditTrail) → monitoreo (rate-limit/anomalías) → revisión periódica → deprecación/rollback.
- **Interacción IA:** trigger → cargar contexto (need-to-know + PrivacyGuard) → razonamiento → salida tipada (recomendacion|borrador|alerta) → AuditTrail (origen=agente) → si requiere acción: cola de aprobación humana → humano decide → motor ejecuta → log resultado → explicabilidad.

---

## 5. Políticas

- **Seguridad:** deny-write por defecto · scope por rol+propósito · service accounts restringidas · circuit-breaker · sin acceso a credenciales/logs inmutables · Turnstile/reputación (Seguridad MVP) condiciona agentes públicos.
- **Privacidad:** PrivacyGuard en prompts y salidas · need-to-know · sin PII en claro en logs (hashes) · acceso a sensibles con propósito + log · no entrenar con datos privados sin base legal.
- **Auditoría:** toda acción en AuditTrail (origen, modelo, prompt-hash, entrada, salida, decisión) · logs append-only · informes marcados `recomendacion_no_accion`.
- **Trazabilidad:** correlación evento→agente→salida→decisión→ejecución · origen humano/sistema/agente · versionado de prompts/modelos.
- **Explicabilidad:** citar fuentes/datos · anclar a índices (no alucinar) · exponer confianza/limitaciones · lenguaje claro para usuario, detalle técnico para Admin/auditor.

---

## 6. Integraciones

Shared/Core (config/clientes; AgentRegistry es cliente, no motor) · RenderEngine (salida vía snapshot + PrivacyGuard) · ValidationEngine (valida borradores/transiciones) · FieldEngine (registro/wizard) · Registro/Cuenta (identidad/edad/estado) · Dashboards (solo datos del dueño) · Admin (AgentRegistry, flags, cola de aprobación, RBAC) · Messenger (metadatos/antispam; contenido solo en denuncia) · Pagos (conciliación asistida; nunca confirma/reembolsa) · Contratos (auditoría; no modifica activos) · Banners (recomienda; no auto-publica) · Interacciones (recomienda; no genera interacciones reales) · SEO (borradores; aprobación humana) · ThemeEngine (sugiere; no aplica sin aprobación) · Seguridad MVP (gates/reputación condicionan ejecución).

---

## 7. Riesgos

| ID | Nivel | Riesgo | Mitigación |
|---|---|---|---|
| AI-R01 | crítico | Agente ejecuta acción irreversible | RT-01/06/08 + deny-write + sin L3 por defecto |
| AI-R02 | crítico | Fuga de datos sensibles en prompts/salidas | PrivacyGuard + need-to-know + log (RT-05) |
| AI-R03 | alto | Moderación/decisión automática sin humano | RT-07 + cola de aprobación + Admin decide |
| AI-R04 | alto | Alucinación sobre entidades inexistentes | anclar a índices + explicabilidad (RT-12) |
| AI-R05 | alto | Agente infla métricas / interacciones falsas | IA solo recomienda; origen=agente nunca cuenta |
| AI-R06 | medio | Costos/abuso (loops, prompt injection) | rate-limit, presupuesto, circuit-breaker, sanitización |
| AI-R07 | medio | Confusión recomendación vs ejecución | salida tipada (RT-03) + UI clara |
| AI-R08 | medio | Agente visible expone info interna | separación visible/interno (RT-09) + PrivacyGuard |
| AI-R09 | medio | Falta de trazabilidad de decisiones IA | AuditTrail + versionado de prompts/modelos |
| AI-R10 | bajo | Dependencia de proveedor de modelo | abstracción de proveedor + fallback |

---

## 8. Dependencias

- **Congeladas:** Shared/Core 1.0.0 · RenderEngine 1.0.0 · ValidationEngine 1.1.0 · FieldEngine 1.0.1 · Messenger 1.0.0 · Seguridad MVP 1.0.0 · Dashboards 1.0.0.
- **Planes:** ADMIN · REGISTRO-CUENTA · PAGOS-CONTRATOS · BANNERS · INTERACCIONES · APP-PUBLICA.
- **Precondiciones:** AgentRegistry + RBAC de agentes · AuditTrail · PrivacyGuard · cola de aprobación humana · sandbox + golden fixtures por agente.

---

## 9. Estructura ideal futura (lógica; sin crear carpetas)

Capa IA: **AgentRegistry** + **AgentRuntime** (orquestador) + **ToolRegistry** (con permisos) + **ApprovalQueue** + **AuditTrail** + **PolicyGuard** (privacidad/seguridad). Separación: agentes visibles (usuario) ⟂ agentes internos (admin); IA recomienda ⟂ motores ejecutan ⟂ humano aprueba.

---

## 10. Rutas sugeridas

- **Usuario:** widget IA en Home/Resultados/Perfil; asistente en `/cuenta` (wizard/soporte).
- **Admin:** `/admin/ia` (registry, flags, aprobaciones), `/admin/ia/auditoria`, `/admin/ia/informes`.

---

## 11. Orden recomendado de implementación

1. **P0** — AgentRegistry + AuditTrail + PolicyGuard (deny-write, RBAC, PrivacyGuard) → cierra AI-R01/R02/R09.
2. **P1** — Agentes públicos L0 (Home/Resultados/Perfil) + Admin General L1.
3. **P1** — Agentes de registro/wizard/soporte L2 (borrador) + ApprovalQueue → cierra AI-R07.
4. **P1** — Moderación/Verificación L2 con aprobación humana → cierra AI-R03.
5. **P2** — Pagos/Banners/SEO L2 + doble confirmación.
6. **P2** — Seguridad/Auditoría/Antifraude (alertas) → cierra AI-R05.
7. **P3** — Agentes futuros (traducción/recomendaciones/marketing/themeengine).

---

## 12. Procedencia

**Sí procede** `PLAN-MAESTRO-AGENTES-IA.md/json` — entregados. El ecosistema IA es transversal y de alto riesgo; requiere gobernanza explícita (permisos, autonomía, aprobación humana, auditoría, privacidad) antes de implementar, para que los agentes no acumulen poder indebido.

**Siguientes pasos sugeridos:** `ADR-GOBERNANZA-IA` (niveles de autonomía y aprobación) · `SPEC-AGENT-REGISTRY` · anexo legal de uso de IA y datos.

> No modifica capas congeladas ni planes existentes (solo los referencia). Sin cambios en producción/Firestore/deploy/commit.
