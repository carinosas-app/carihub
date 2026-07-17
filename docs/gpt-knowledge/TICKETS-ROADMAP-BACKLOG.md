# Tickets, roadmap y backlog — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

Referencia consolidada de trabajo pendiente, prioridades, dependencias y reglas globales para planificación. Fuente maestra: `scripts/github-issues-master-v2.json` v2.1.0 (158 ítems, post-Sprint 1 PR #60).

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `scripts/github-issues-master-v2.json` | Backlog maestro 158 tickets |
| `scripts/MAPA-MAESTRO-CARIHUB.json` | Mapa módulos y estado |
| `scripts/TICKETS-PLAN-ENTITLEMENTS-ENFORCEMENT.md` | Plan entitlements |
| `scripts/AUDITORIA-ARQUITECTONICA-GLOBAL-CARIHUB.json` | Auditoría |
| `.cursor/rules/dashboard-mensajes-vision.mdc` | TICKET-025/026 resoluciones |
| `.cursor/rules/carihub-disciplina-operativa.mdc` | Clasificación bloqueador/importante/mejoría |

---

## Orden recomendado de bloques

1. **A** — Foundation messenger MVP  
2. **B** — Estados y lives  
3. **C** — Económico core  
4. **D** — Comunidades VIP  
5. **E** — Adjuntos y permisos  
6. **F** — Notificaciones y moderación  
7. **G** — Crypto post-fiat  
8. **H** — Passkeys v1.1  

---

## Bloque inmediato post-Sprint 1

| ID | Tema |
|----|------|
| MSG-000 | Messenger fundación |
| TICKET-001 | carihub-core.js init Firebase único (P0) |
| TICKET-003 | Multi-perfil runtime usuarios/{uid} (P0) |
| MSG-010, MSG-024, MSG-011 | Messenger MVP |
| TICKET-049, TICKET-050 | Preview/MOCK solo ?preview=1 |
| TICKET-012, TICKET-013 | Perfiles rail + lista |
| MSG-043, MSG-082 | Messenger P1 |

---

## Dependencias críticas (verbatim backlog)

- **ECO-030** bloquea activación automática de todos los productos (**launch blocker**)
- **VIP-050** depende de ECO-070 suscripciones
- **EST-030** y **LIVE-020** dependen de ECO-020 checkout
- **CRY-*** depende de ECO-030 fiat estable
- **MSG-043** depende de MSG-024
- **TICKET-012/013** dependen de TICKET-001 y TICKET-003 (partial)
- **MSG-050** consolidado como duplicateOf **TICKET-050**

---

## Qué NO tocar (globalDoNotTouch)

- Shell 3 columnas `dashboard-rentero.html`
- Migrar conversaciones/messages a inglés o inbox plano
- App messenger separada
- Migración BLK perfiles sin plan
- Custodia crypto / wallets propias
- Admin lee chats completos rutinario
- Activación pagos desde frontend sin webhook
- Presencia/en línea por defecto

---

## Tickets clave por dominio

### Fundación (P0)
| ID | Título |
|----|--------|
| TICKET-001 | Firebase core único |
| TICKET-003 | Multi-perfil runtime |
| ECO-030 | Webhook Stripe + activación |
| **REG-SYNTAX-P0** | **Registro Perfil — SyntaxError por cabecera faltante `function bindTerminosTriggers(host) {`** en `public/js/carihub-private-fields-lite.js` (cuerpo huérfano tras `renderAccessConfirmBlock`; síntoma ~L806). Causa preexistente (`410904c`, no B2). **Fix Alternativa A** en rama `fix/registration-syntax-p0`: reinsertar solo esa línea. Estado: **implementado, pendiente commit/PR.** |

### Dashboard UX (P2)
| ID | Título |
|----|--------|
| TICKET-025 | Limpieza nav — sin duplicar rail |
| TICKET-026 | Módulos huérfanos (feed-red, directorio, medios-contacto) |

### Messenger (MSG-*)
Sprint 1 cerró núcleo: `reportes_mensajeria`, bloqueos, privacidad. Pendiente moderación admin.

### Estados (EST-*)
EST-030: estado pagado checkout → publicar → vencer.

### Lives (LIVE-*)
LIVE-020: live pagado por minutos.

### SEO
Sin tickets runtime en backlog v2.1 — cubierto por PLAN-MAESTRO-SEO (diseño).

### Visual / Resultados
- PR #111 mergeada — slice resultados sectorial moderno.
- PR #109 abierta — `feat/platform-resultados-sector-visual` (alcance plataforma/registro multi-sector).

### QA / Paridad
- PR #113 mergeada — agente QA-REG-PUB (Fases A+B+C) en `scripts/qa-paridad-reg-pub-*`.

---

## Estadísticas backlog v2.1

| Bloque | Cantidad |
|--------|----------|
| Total | 158 |
| Admin | 12 |
| Auditoría | 6 |
| Crypto | 6 |
| ECO / PAY | 12 |
| Estados | 7 |
| Lives | 7 |
| Messenger | ~40+ |
| VIP | varios |
| Dashboard/TICKET | varios |

*(Conteos parciales — ver JSON para detalle exacto)*

---

## Clasificación de hallazgos (disciplina operativa)

| Nivel | Acción |
|-------|--------|
| **Bloqueador absoluto** | Resolver antes de merge seguro |
| **Importante** | Registrar; puede ir en siguiente bloque |
| **Mejora futura** | No inflar backlog activo |

---

## Estado actual

- Sprint 1 mergeado (PR #60, commit `a51666c`)
- PRs jul 2026 mergeados: #110 (home geo), #111 (resultados sectorial), #112 (paridad P0 registro), #113 (QA agent)
- Backlog v2.1.0 generado 2026-06-20 — **pendiente de confirmar** sincronización con issues GitHub
- Entitlements: plan documental, runtime incompleto

---

## Pendientes

- Sincronizar issues GitHub con backlog JSON (**pendiente de confirmar** si gh issues están al día)
- Crear tickets formales trabajo visual jul 2026
- Cerrar ECO-030 como launch gate
- Ejecutar bloque A messenger post fundación P0

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Bloqueador launch** | ECO-030 sin webhook |
| **Bloqueador** | TICKET-001/003 incompletos → messenger y multi-perfil frágiles |
| **Importante** | Backlog JSON desactualizado vs trabajo local WIP |
| **Importante** | 158 tickets — priorización drift |

---

## Validaciones necesarias

- Antes de sprint: verificar dependencias en JSON
- Post-implementación: criterios aceptación por ticket
- QA packs por dominio en `agent-tools/`
- Revisar globalDoNotTouch antes de cada PR

---

## Pendiente de confirmar

- Estado issues en GitHub vs `github-issues-master-v2.json`
- PR #109 (abierta) y mapeo formal a tickets backlog
- Fecha próximo sprint formal
