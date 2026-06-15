# Anexo — Integración Messenger ↔ Dashboards 1.0.0

| Campo | Valor |
|-------|-------|
| **OB-MSG** | 7 |
| **Estado** | Documento anexo |
| **Modifica Dashboards congelado** | **No** |

Canónico: [`ANEXO-MESSENGER-INTEGRACION-DASHBOARDS.json`](./ANEXO-MESSENGER-INTEGRACION-DASHBOARDS.json)

---

## Principio

Messenger extiende dominios `mensajes` e `historial_mensajes` ya previstos en Dashboards 1.0.0 mediante **tipos de evento nuevos** y `metadata` — sin alterar el acta de Dashboards.

## Notificaciones usuario

| Congelado | Extensión Messenger |
|-----------|---------------------|
| mensaje_nuevo | + metadata automatizado, solicitud |
| mensaje_leido | sin cambio |
| conversacion_archivada | sin cambio |
| — | solicitud_conversacion, solicitud_aceptada, solicitud_rechazada, conversacion_iniciada |

## Notificaciones admin

Tipos `mensajeria.*` → módulo UI `/admin/mensajeria` hasta PATCH dashboards 1.1.0.

## Historial

Eventos extendidos en `historial_mensajes` — solo metadatos; contenido en `conversaciones/.../mensajes`.

---

*Anexo OB-MSG-7 — diseño únicamente*
