# PLAN-MAESTRO-INTERACCIONES v1.0.0

**Fecha:** 2026-06-10 · **Estado:** PLAN DE DISEÑO DOCUMENTAL
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover archivos · no Firestore · no deploy · no commit · no modifica capas existentes.

> **Principio rector:** Interacciones gobierna las **señales sociales** (favoritos, visitas, seguir, likes, comentarios, reportes/bloqueos, stories/lives futuros) con **transparencia de origen** (humano/sistema/indexador/agente). No es mensajería (Messenger), no es panel (Dashboards), no decide moderación (Admin ejecuta), no pinta público (RenderEngine). **Métrica real ≠ estimada ≠ automática**, siempre etiquetada.

---

## 1. Inventario actual

| Señal | Estado | Evidencia |
|---|---|---|
| Favoritos | Parcial | `usuarios/{uid}/favoritos/{perfilId}` (`toggleFavorito` ~L1420); gated en Anonymous ("se activará cuando habilitemos Firebase Anonymous" ~L1461) |
| Visitas | Contador | `visitasTotales`/`visitasHoy` (index.html L58-59); sin eventos ni origen |
| Denuncias | Dual inconsistente | Home → WhatsApp (`enviarDenuncia` ~L1368); `admin.html` → colección `denuncias` |
| Seguir, likes, comentarios, menciones, stories, lives, reputación, ranking, feed, bloqueos | **No existen** | todo futuro |

---

## 2. Frontera

- **Pertenece a Interacciones:** favoritos/guardar, compartir (evento), seguir/seguidos, likes/reacciones, comentarios/respuestas, menciones, visitas de perfil (eventos), feed de actividad, reportes sociales, bloqueos sociales, engagement, stories/lives (futuro), reputación/ranking (futuro), boost legítimo.
- **No pertenece:** mensajería P2P (Messenger), render público (RenderEngine), cobro/contratos (Pagos), inventario publicitario (Banners), decisión de moderación (Admin).
- **Messenger:** conversaciones privadas, contacto directo, notificaciones de mensajes.
- **Dashboards:** visualización de métricas propias y panel de actividad del dueño.
- **Admin:** cola de reportes, decisión aprobar/eliminar/suspender, auditoría de moderación.
- **Perfil Público:** render del contador (si permitido) y botones favorito/compartir/seguir.
- **Agentes IA:** recomendación/feed ranking y antifraude (solo lectura/recomendación); **nunca** genera likes/comentarios reales.

---

## 3. Módulos internos

InteractionLedger (eventos append-only con origen) · VisitTracker (origen humano/sistema/indexador/agente) · FavoritesStore · FollowGraph · EngagementMetrics (real/estimado/automático) · ActivityFeed · CommentsEngine (futuro) · StoriesLivesEngine (futuro) · ReputationEngine (futuro) · SocialModerationQueue · BlockEngine · BoostEngine · AntiFraudAntiSpam · NotificationsBridge.

---

## 4. Ciclos de vida

- **Interacción:** evento → validación (VE) → registro (origen, antifraude) → agregación → (visible|interno) → caducidad/recalculo.
- **Visita:** request → clasificar origen → dedup por sesión → solo humano cuenta en público → agregados.
- **Favorito:** toggle on → `favoritos/{perfilId}` → notif opcional → toggle off → historial.
- **Seguimiento:** follow → FollowGraph → notif → feed del seguido → unfollow → recalcular contadores.
- **Comentario:** crear → VE + filtro spam/lenguaje → publicado|en_revisión → respuestas/menciones → reporte → moderación → oculto/eliminado.
- **Story/Live (futuro):** crear → revisión edad/categoría → activo (temporal) → interacciones → expira/cierra → archivado | moderado.
- **Reporte social:** usuario reporta → SocialModerationQueue → Admin revisa (PrivacyGuard) → acción → notif → log.
- **Bloqueo social:** A bloquea B → BlockEngine → B no ve/interactúa con A → desbloqueo → restaurar.

---

## 5. Origen de actividad y métricas

**Tipos de origen:** humano · sistema · indexador · agente_ia. Todo evento lleva campo `origen`; **solo `humano` cuenta en métricas públicas**; sistema/indexador/agente nunca inflan contadores.

| Métrica | Definición |
|---|---|
| Real | eventos humanos validados server-side |
| Estimada | proyecciones (nunca presentadas como reales) |
| Automática | actividad de sistema/indexador/agente — separada, etiquetada, no pública |

**Transparencia:** la UI distingue real vs estimada vs automática; auditable; crawlers excluidos del conteo.

---

## 6. Boost legítimo (orden, no métricas)

| Caso | Condición | Visibilidad |
|---|---|---|
| Perfil nuevo | recién aprobado | boost temporal en resultados |
| Story/Live activo | en curso | badge + prioridad temporal |
| Plan premium/VIP | contrato activo (Pagos) | prioridad por plan |

> El boost afecta **orden/visibilidad**, nunca los contadores de engagement.

---

## 7. Privacidad y legal

- **noindex:** contenido sensible/adulto y feeds sociales privados (RenderEngine PrivacyGuard).
- **Contenido adulto:** mayoría de edad verificada + límites por categoría (sector adultos).
- **Límites por categoría:** comentarios/stories deshabilitables en categorías sensibles.

| Audiencia | Puede ver |
|---|---|
| Público | counts permitidos, comentarios aprobados |
| Dueño | sus métricas reales, sus seguidores, visitas agregadas/anónimas |
| Admin | todo + origen + reportes + trail de moderación |
| Solo interno | actividad no-humana, métricas estimadas crudas, señales antifraude |

**Cláusulas para Términos/Aviso Legal/Normas de Publicación:** consentimiento de registro de interacciones/visitas y su uso · política de métricas (real/estimada/automática) · normas de comentarios/stories/lives (prohibido ilegal/odio/spam) · política de reportes y bloqueos · derecho a moderar/eliminar · tratamiento de datos de actividad y noindex de sensibles · restricción de edad para contenido adulto.

---

## 8. Anti-fraude / anti-spam

Dedup por sesión/dispositivo · rate-limit por usuario/acción · validación server-side · detección de patrones (IA recomienda) · exclusión de bots/indexadores · umbral de velocidad de likes/follows.
**Regla:** ninguna métrica pública se incrementa sin validación de origen humano.

---

## 9. Relaciones con otras capas

Shared/Core (helpers/tokens) · RenderEngine (pinta contadores/botones; PrivacyGuard oculta sensibles) · ValidationEngine (comentarios/transiciones/reportes) · FieldEngine (campos sociales) · Registro/Cuenta (identidad/edad/estado) · Dashboards (métricas del dueño) · Admin (cola de reportes + decisiones) · Messenger (contacto/notificaciones; no duplica mensajería) · Pagos (boost por plan) · Contratos (vigencia condiciona boost) · Banners (contactos/leads alimentan campañas) · SEO (feeds sensibles noindex; comentarios públicos con moderación) · ThemeEngine (estilo de widgets) · Agentes IA (recomendación/antifraude, solo lectura) · Seguridad MVP (reputación/Turnstile/gates) · Aviso Legal (cláusulas).

---

## 10. Matrices

### Permisos
favorito/seguir/like = usuario registrado (humano) · comentar = registrado verificado · reportar = registrado · bloquear = registrado (su grafo) · moderar comentarios = super_admin/moderador/operador(scope) · ver métricas propias = dueño · ver origen de actividad = super_admin/auditor.

### Visibilidad
público = counts permitidos + comentarios aprobados · dueño = métricas reales + seguidores + visitas agregadas · admin = todo + origen + trail · interno = no-humano + antifraude + estimadas crudas.

### Notificaciones
favorito recibido → dueño (opcional) · nuevo seguidor → dueño · comentario → dueño + mencionados · reporte → admin · bloqueo → silencioso · story/live → seguidores (futuro).

### Origen → visibilidad → uso permitido
| Origen | Visibilidad | Uso |
|---|---|---|
| humano | pública/dueño | métrica real, ranking, boost |
| sistema | interno | health/checks; nunca contador público |
| indexador | interno | excluido de métricas; SEO |
| agente_ia | interno/admin | recomendación; nunca interacción real |

### Interacción → métrica → origen → antifraude
| Interacción | Métrica | Origen | Antifraude |
|---|---|---|---|
| favorito | favoritos | humano | dedup por usuario |
| visita | visitas humanas | clasificado | excluir bots, dedup sesión |
| like | likes | humano | rate-limit + patrón |
| follow | seguidores | humano | umbral velocidad |
| comentario | comentarios | humano verificado | spam/lenguaje + rate-limit |

### Interacción → moderación → acción admin
comentario reportado → revisar/aprobar/ocultar/eliminar/suspender autor · perfil reportado → revisar(PrivacyGuard)/advertir/suspender/restaurar · story/live reportado → revisar/cortar live/eliminar story/suspender · spam → limitar/bloquear acción/escalar.

### Boost legítimo → condición → visibilidad
perfil nuevo (recién aprobado) → boost temporal · story/live activo → badge + prioridad · plan premium/VIP (contrato activo) → prioridad por plan.

---

## 11. Riesgos

| ID | Nivel | Riesgo | Mitigación |
|---|---|---|---|
| IX-R01 | crítico | Métricas infladas por bots/sistema/agentes | campo origen + solo humano cuenta + antifraude |
| IX-R02 | alto | Visitas de indexador/sistema contadas como humanas | VisitTracker clasifica y excluye no-humano |
| IX-R03 | alto | Comentarios/stories con contenido ilegal/abuso | VE + moderación + reportes + límites edad/categoría |
| IX-R04 | alto | Denuncias por WhatsApp (no trazable) vs colección admin | unificar en SocialModerationQueue con trail |
| IX-R05 | alto | Exposición de quién visita (privacidad/acoso) | agregados/anonimato + consentimiento |
| IX-R06 | medio | Contenido sensible/adulto indexado | noindex + PrivacyGuard + límites de edad |
| IX-R07 | medio | Spam de follows/likes | rate-limit + patrones + umbrales |
| IX-R08 | medio | Boost confundido con métrica | boost afecta orden, nunca contadores |
| IX-R09 | medio | Agente IA generando interacciones falsas | IA solo recomienda/modera; deny-write |
| IX-R10 | bajo | Favoritos no operativos (Anonymous deshabilitado) | definir auth/estado en Registro/Cuenta |

---

## 12. Dependencias

- **Congeladas:** Shared/Core 1.0.0 · RenderEngine 1.0.0 · ValidationEngine 1.1.0 · FieldEngine 1.0.1 · Dashboards 1.0.0 · Messenger 1.0.0 · Seguridad MVP 1.0.0.
- **Planes:** PLAN-MAESTRO-ADMIN · REGISTRO-CUENTA · PAGOS-CONTRATOS · BANNERS.
- **Precondiciones:** auth/estado de cuenta resuelto · InteractionLedger + origen · rules para colecciones sociales · antifraude server-side · cláusulas legales actualizadas.

---

## 13. Estructura ideal futura (lógica; sin crear carpetas)

Widgets sociales en Perfil Público/Resultados + feed en `/cuenta` + cola en `/admin`. Núcleo: InteractionLedger, VisitTracker, FollowGraph, EngagementMetrics, SocialModerationQueue, BlockEngine, BoostEngine, AntiFraudAntiSpam. Separación: Interacciones (señales) ⟂ Messenger (mensajes) ⟂ Dashboards (visualización) ⟂ Admin (decisión) ⟂ RenderEngine (pintado).

---

## 14. Rutas sugeridas

- **Público:** botones en `/perfil/:slug` (favorito/seguir/compartir/reportar).
- **Usuario:** `/cuenta/actividad`, `/cuenta/favoritos`, `/cuenta/seguidos`, `/cuenta/notificaciones`.
- **Admin:** `/admin/reportes-sociales`, `/admin/moderacion-comentarios`, `/admin/moderacion-stories`.

---

## 15. Orden recomendado de implementación

1. **P0** — InteractionLedger + VisitTracker con campo origen + antifraude base → cierra IX-R01/R02.
2. **P0** — Unificar denuncias en SocialModerationQueue + integración Admin (trail) → cierra IX-R04.
3. **P1** — FavoritesStore + FollowGraph operativos (resolver auth) + notificaciones → cierra IX-R10.
4. **P1** — CommentsEngine con ValidationEngine + moderación + límites edad/categoría → cierra IX-R03.
5. **P1** — EngagementMetrics + transparencia real/estimada/automática + privacidad de visitas → cierra IX-R05.
6. **P2** — BoostEngine (orden, no métricas) + BlockEngine + cláusulas legales → cierra IX-R08.
7. **P3** — StoriesLivesEngine + ReputationEngine/ranking → cierra IX-R06.

---

## 16. Políticas recomendadas

**Métricas automáticas y actividad del sistema:** campo origen obligatorio · solo `humano` incrementa métricas públicas · sistema/indexador/agente en colecciones internas etiquetadas · auditoría de métricas con separación real/estimada/automática · excluir crawlers conocidos.

**Reportes, bloqueos y moderación social:** el reporte siempre va a SocialModerationQueue (no WhatsApp) · bloqueo bidireccional y silencioso · moderación con VE + humano (Admin) · acceso a contenido reportado con PrivacyGuard + log · límites por edad/categoría antes de publicar · doble confirmación para suspender/eliminar autor.

---

## 17. Procedencia

**Sí procede** `PLAN-MAESTRO-INTERACCIONES.md/json` — entregados. Las interacciones existen de forma mínima y dispersa (favoritos gated, visitas como contador, denuncia por WhatsApp); la visión social requiere plan propio con transparencia de métricas, privacidad y moderación antes de implementar.

**Siguientes pasos sugeridos:** `PLAN-MAESTRO-AGENTES-IA` · `ADR-METRICAS-SOCIALES` (real vs automática) · anexo legal de interacciones/normas de publicación.

> No modifica capas congeladas ni planes existentes (solo los referencia). Sin cambios en producción/Firestore/deploy/commit.
