# Addendum — Arquitectura de asistentes IA en dashboards

| Campo | Valor |
|-------|-------|
| **Fecha** | 2026-06-09 |
| **Alcance** | Diseño únicamente — sin runtime |
| **Base** | Catálogo 1.0.0 · Cuentas 1.0.0 · Seguridad MVP 1.0.0 · FieldEngine 1.0.1 |

Canónico: [`AUDITORIA-DASHBOARDS.json`](./AUDITORIA-DASHBOARDS.json) → `asistentesIA`

---

## 9. Arquitectura futura — decisión

### Opciones evaluadas

| Opción | Descripción | Veredicto |
|--------|-------------|-----------|
| **A** | Un asistente único con contexto dinámico | **Rechazada** |
| **B** | Varios asistentes especializados por dashboard | **Aceptada (núcleo)** |
| **C** | B + orquestador ligero que enruta por contexto UI | **Recomendada** |

### Recomendación: **C — Orquestador + especialistas**

```
                    ┌─────────────────┐
                    │  IAOrchestrator │
                    │  (solo enruta)  │
                    └────────┬────────┘
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
  ia_asistente_cuenta  ia_asistente_perfil  ia_asistente_publicidad
         │                   │                   │
         └───────────────────┴───────────────────┘
                             │
                    Dashboard Shell Usuario

         ┌──────────┬──────────┬──────────┬──────────┐
         ▼          ▼          ▼          ▼          │
   ia_arquitecto  ia_moderador  ia_comercial  ia_seguridad
         └──────────┴──────────┴──────────┴──────────┘
                             │
                      Dashboard Admin
```

**Justificación:**

1. **Permisos incompatibles** — Admin puede leer agregados de catálogo y colas; usuario no debe ver datos de terceros ni INE.
2. **Auditoría separada** — `logsAdmin` por módulo `ia_*`; service accounts distintas en fase producción.
3. **UX unificada posible** — Un panel chat por dashboard; el orquestador elige backend según módulo activo (perfil vs banners).
4. **Alineado con diseño existente** — `config-admin-arquitectura-completa-schema.json` ya define IA Arquitecto separado de `ia_registro` (wizard usuario).

**Anti-patrón:** Un solo agente con “modo admin” activable por prompt — riesgo crítico de escalación privilegios (IA1).

---

## 7. Seguridad de IA — reglas obligatorias

| # | Regla | Implementación diseño |
|---|-------|----------------------|
| R1 | No modificar datos sin confirmación humana | Toda tool write detrás de `confirmarAccion()` UI |
| R2 | No aprobar perfiles automáticamente | `ia_moderador` solo `ia_recomendaciones` |
| R3 | No aprobar banners automáticamente | Igual |
| R4 | No cambiar precios automáticamente | `ia_comercial` informes solo lectura precios |
| R5 | No cambiar categorías automáticamente | Solo `ia_arquitecto` sugiere; Admin ejecuta |
| R6 | No INE/selfies salvo Admin autorizado | PrivacyGuard + `logs_acceso_privado` |
| R7 | No mostrar privados de terceros a usuarios | Allowlist campos por asistente |
| R8 | Respetar roles, permisos, estadoSeguridad, estadoMensajeria | Gates pre-tool en orquestador |
| R9 | Acciones sugeridas ≠ acción final | Colección `ia_recomendaciones/{id}` |
| R10 | IA Arquitecto solo lectura | Rules deny write; solo `ia_arquitecto_informes` |

**Estados recomendación:** `sugerida` → `aceptada_humano` | `rechazada_humano` | `expirada`

---

## 1–6. Asistentes por dashboard

### Dashboard Usuario / Visitante — `ia_asistente_cuenta`

| Campo | Valor |
|-------|-------|
| **Objetivo** | Guiar cuenta visitante: favoritos, upgrade, seguridad, ayuda |
| **Confirmación humana** | **Siempre** antes de persistir |

**Funciones permitidas:** explicar estados cuenta; listar favoritos propios (metadatos públicos); sugerir subcategorías del catálogo; orientar upgrade (`WizardCrearPerfilDesdeVisitante`); explicar categoría sugerida temporal; límites mensajería futura; FAQs.

**Prohibidas:** aprobar/rechazar; leer mensajes ajenos; INE/documentos; modificar contratos/precios; publicar sin confirmación.

**Lee:** `usuarios/{propio}` cuenta/estados; favoritos → perfiles públicos; mapa catálogo; schema visitante.

**No lee:** INE; otros usuarios; logs admin; `riesgoScore` detalle.

| Módulo usuario | Cómo ayuda la IA |
|----------------|------------------|
| Favoritos | Explicar cómo guardar; listar propios |
| Mensajes | Explicar requisitos futuros (`estadoMensajeria`, email verificado) |
| Categorías sugeridas | Explicar flujo temporal; **no enviar** sin confirmación |
| Seguridad cuenta | Explicar `estadoSeguridad`, verificación email |
| Upgrade perfil | Pasos + contrato vigente (FieldEngine F11) |
| Ayuda general | FAQs plataforma |
| Estados cuenta | `estadoCuenta`, `estadoMensajeria`, `estadoSeguridad` en lenguaje claro |

**Ejecutables futuros (post-confirmación):** guardar preferencias; abrir wizard con `subcategoriaId` preseleccionada.

---

### Dashboard Perfil Público — `ia_asistente_perfil`

| Campo | Valor |
|-------|-------|
| **Objetivo** | Completar y mejorar perfil del owner |
| **Motor clave** | FieldEngine `resolveRegistrationSchema` dry-run |

**Funciones permitidas:** campos faltantes; mejorar descripción (sin inventar hechos); explicar `motivoRechazo`; checklist correcciones; explicar stats propias; renovación/verificación; etiqueta mensajes.

**Prohibidas:** aprobar perfil; analizar INE/selfie; modificar snapshot; enviar revisión sin gates.

| Módulo | Ayuda IA |
|--------|----------|
| Completar perfil | Lista `obligatorios` FieldEngine |
| Mejorar descripción | Sugerencia texto (borrador) |
| Campos faltantes | Dry-run resolve |
| Rechazos | Explica `motivoRechazo` admin |
| Correcciones | Checklist reenvío |
| Estadísticas | Agregados propios |
| Renovaciones | `fechaVencimiento`, plan |
| Verificación | Pasos sin ver imagen INE |
| Mensajes | Buenas prácticas |

**Ejecutables futuros:** aplicar borrador campo público; abrir UI subida foto; solicitar reenvío revisión.

---

### Dashboard Publicidad / Banners — `ia_asistente_publicidad`

| Campo | Valor |
|-------|-------|
| **Objetivo** | Explicar espacios, funnel y campañas del anunciante owner |

**Funciones permitidas:** slots y formatos; estimar precio (`precios-publicidad` + Firestore público); listar solicitudes propias; explicar `notaAdmin`; renovación; stats agregadas.

**Prohibidas:** aprobar/activar banner; editar post-pago sin revisión; procesar pago; cambiar precios admin.

| Módulo | Ayuda IA |
|--------|----------|
| Espacios publicitarios | home / resultados / perfil |
| Contratación | Funnel paso 1–2 orientado |
| Campañas | Estado solicitudes |
| Banners activos | Lectura propios (futuro) |
| Renovaciones | Alertas vencimiento |
| Pagos | Explicar estados (futuro) |
| Estadísticas | Impresiones/clics agregados |
| Correcciones admin | Traducir `notaAdmin` a acciones |

---

### Dashboard Admin — cuatro asistentes

#### `ia_arquitecto` — IA Arquitecto / Supervisor

| | |
|--|--|
| **Objetivo** | Supervisión catálogo, schemas, búsqueda, impacto — **solo lectura** |
| **Referencia** | `config-admin-arquitectura-completa-schema.json` |
| **Escribe** | Solo `ia_arquitecto_informes/{id}` recomendaciones |
| **Prohibido** | Cualquier cambio catálogo, precio, aprobación |

Funciones: gaps búsqueda; drift mapa/schema; dry-run validador; informes congelamiento; checklist deploy.

#### `ia_moderador` — IA Moderador

| | |
|--|--|
| **Objetivo** | Priorizar cola; sugerir aprobar/rechazar — **humano decide** |
| **INE/selfie** | Solo si humano moderador abre vista + `logs_acceso_privado`; IA resume metadatos, no almacena imagen en prompt |

Funciones: resumir pendientes; inconsistencias schema; plantillas rechazo; duplicados potenciales; categorías sugeridas.

**Prohibido:** aprobar/rechazar automático; suspender cuenta.

#### `ia_comercial` — IA Comercial

| | |
|--|--|
| **Objetivo** | Contratos, promociones, conversión banners — informes |

Funciones: contratos por vencer; sugerir promoción; analizar embudo solicitudes; proponer ajuste precio **como informe**.

**Prohibido:** cambiar precios; activar banners; otorgar descuentos automáticos.

#### `ia_seguridad` — IA Seguridad

| | |
|--|--|
| **Objetivo** | Correlacionar riesgo, fraude, abuso |

Funciones: resumir `logsSeguridad`; patrones multicuenta (hashes); sugerir `estadoSeguridad`; priorizar `alertas_seguridad`.

**Prohibido:** cambiar `estadoSeguridad` automático; bloquear login sin humano.

---

## 8. Integración con módulos congelados

| Módulo | Relación IA |
|--------|-------------|
| **Catálogo 1.0.0** | Arquitecto lectura total; usuario lectura pública; Moderador coherencia arquetipo; **prohibido** write IA |
| **Cuentas 1.0.0** | `tipoCuenta`, `rolesCuenta[]`, upgrade sin nuevo Auth; orquestador enruta módulos visibles |
| **Seguridad MVP 1.0.0** | Gates `estadoSeguridad`, `estadoMensajeria`, `emailVerificado`; logs; rate limits consultas IA |
| **FieldEngine 1.0.1** | `ia_asistente_perfil` + wizard visitante usan resolve dry-run; gates explicados al usuario; **no persistir** |

---

## Riesgos IA

| ID | Nivel | Riesgo |
|----|-------|--------|
| IA1 | Crítico | Asistente único con tools admin expuestos a usuario |
| IA2 | Alto | Filtración INE/selfie en prompts |
| IA3 | Alto | Auto-ejecución sin confirmación |
| IA4 | Alto | Alucinación `subcategoriaId` en upgrade |
| IA5 | Medio | Moderador sesga aprobar por volumen |
| IA6 | Medio | Coste API sin rate limits |

---

## Recomendaciones

1. **Incluir `asistentesIA` en SPEC-DASHBOARDS antes de congelar** — obligatorio.
2. `IAOrchestrator` con allowlist tools por `asistenteId`.
3. Persistir solo `ia_recomendaciones` + logs.
4. `PrivacyGuard` en pipeline prompts usuario.
5. Anclar catálogo a índice/mapa — no inventar IDs.
6. Admin: service accounts separadas por asistente (futuro).
7. Fases: FAQ cuenta → perfil FieldEngine → admin Arquitecto → Moderador/Comercial/Seguridad.

---

## Fuera de alcance

- Runtime LLM / fine-tuning
- IA genera imágenes banner
- OCR INE automático sin acta privacidad
- IA responde P2P en nombre del usuario sin confirmación
- IA Arquitecto write catálogo aunque se pida en chat

---

## 10. ¿Incluir en SPEC-DASHBOARDS antes de congelar?

**Sí — obligatorio.**

Secciones mínimas en SPEC:

- `asistentesIA.porDashboard`
- `politicaSeguridadGlobal`
- `orquestacion`
- `integracionModulosCongelados`
- Contrato `ia_recomendaciones`
- Matriz permisos IA × rol × dashboard

Sin esta capa, la SPEC-DASHBOARDS quedaría incompleta para ValidationEngine, Messenger y admin modular.

---

*Addendum de diseño — no autoriza implementación.*
