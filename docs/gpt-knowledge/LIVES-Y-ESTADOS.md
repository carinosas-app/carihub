# Lives y estados — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

**Estados:** publicaciones tipo story/anuncio en red de socios del perfil activo.  
**Lives:** transmisiones promocionales (propias y feed de socios). Monetización por minutos/duración vía checkout (diseño backlog).

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `public/js/dashboard-rentero-nav.js` | Módulos `estados`, `lives`, `transmitir-live`, `feed-red`, `publicaciones` |
| `public/js/dashboard-publicaciones.js` | Gestión publicaciones perfil |
| `public/dashboard-rentero.html` | Shell módulos |
| `firestore.rules` | `publicaciones_perfil`, solicitudes lives en `solicitudes_anuncios` |
| `functions/index.js` | `vencerPerfiles` — desactiva productos vencidos |
| Backlog | `scripts/github-issues-master-v2.json` bloques EST-* y LIVE-* |

---

## Flujo funcional (diseño + parcial runtime)

### Estados (EST-*)
```
Crear estado en dashboard (perfil activo)
    → Checkout ECO-020 (pendiente)
    → Publicar en feed red socios
    → Vencer por scheduler (ECO-030 / vencerPerfiles)
```

### Lives (LIVE-*)
```
Contratar minutos (LIVE-020)
    → Activar transmisión (transmitir-live módulo)
    → Rail izquierdo muestra lives propios como activo
    → Nav "En vivos" = feed socios (distinto del rail)
```

**Fusión TICKET-026:** `feed-red` → fusionado en módulo `estados` / Red de socios.

---

## Dependencias

- ECO-020 checkout (bloquea EST-030, LIVE-020)
- ECO-030 webhook Stripe activación (launch blocker)
- Dashboard rail: lives propios en columna izquierda
- TICKET-003 multi-perfil para contexto correcto

---

## Reglas críticas

1. **Rail lives ≠ Nav En vivos** — rail = propios; nav = feed socios (TICKET-025)
2. Lives en rail = promo/oferta, **no** indicador presencia/en línea
3. Estados y lives del **perfil activo** — no mezclar perfiles
4. Anuncios canal mensajes ≠ anuncios canal perfil (sets independientes)
5. No mostrar "en línea" del anunciante (privacidad dashboard vision)

---

## Estado actual

| Componente | Estado |
|------------|--------|
| UI módulos dashboard | Parcial — nav definido, MOCK en varios flujos |
| `publicaciones_perfil` | Colección en rules |
| Checkout estados/lives | Pendiente (EST-030, LIVE-020) |
| Transmisión real | **Pendiente de confirmar** runtime streaming |
| Feed red socios | MOCK `MOCK_FEED_POSTS`, `MOCK_LIVES_SOCIOS` en nav |

---

## Pendientes

- EST-000..070 pipeline estados completo
- LIVE-000..070 pipeline lives completo
- ECO-030 activación automática
- Eliminar MOCK en prod (TICKET-050)
- Integración métricas lives

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Bloqueador launch** | ECO-030 sin webhook → servicios sin pago activos |
| **Importante** | Confusión feed-red vs estados vs publicaciones |
| **Importante** | Lives mock confundidos con producto real |
| **Mejora futura** | Infra streaming no documentada en `public/` |

---

## Validaciones necesarias

- Crear publicación → visible solo perfil activo
- Vencimiento estado/live vía function
- Rail vs nav muestran fuentes distintas
- Sin presencia "en línea"

---

## Pendiente de confirmar

- Proveedor streaming lives (si existe integración fuera de repo)
- Campos Firestore exactos para estados vs publicaciones_perfil
- Si `transmitir-live` tiene WebRTC o solo placeholder UI
