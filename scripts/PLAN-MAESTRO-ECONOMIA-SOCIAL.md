# PLAN-MAESTRO-ECONOMIA-SOCIAL v1.0.0

**Fecha:** 2026-06-11 · **Estado:** PLAN DE DISEÑO DOCUMENTAL
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover · no Firestore · no deploy · no commit · no modifica capas/planes/observaciones/ADRs/actas existentes.

> **Principio rector:** la economía social de Cariñosas monetiza la **relación proveedor↔cliente del nicho real** (acompañantes/negocios/anunciantes), **no un feed social genérico**. Toda función se justifica por captar, retener o convertir en el contexto Cariñosas. El precio de planes/contratos sigue **congelado en MXN** (`politicaPrecioCongelado`); propinas/compras son transacciones aparte. Ninguna IA aprueba pagos. Contenido sensible respeta `ADR-INDEXACION-ADULTOS`, mayoría de edad y moderación.

---

## 1. Validación de orientación a Cariñosas (lo que pediste confirmar)

**Confirmación explícita: SÍ.** Todo el análisis está orientado al ecosistema **CariHub/Cariñosas** (catálogo geo-primero, verticales reales incluyendo acompañantes/negocios/anunciantes), **no** a una red social genérica tipo Instagram/TikTok/OnlyFans.

**Criterio de encaje:** una función encaja si sirve a (a) descubrimiento del proveedor, (b) conversión a contacto/contrato, (c) retención del cliente, o (d) monetización directa del proveedor real. Si solo genera "engagement" sin conversión al nicho → se **acota o excluye**.

**Diferencias con una red social genérica:**
- No es feed infinito de extraños; es **vitrina de proveedores geo-localizados**.
- El "seguir" sirve para **reencontrar al proveedor**, no para construir audiencia masiva.
- Propinas/premium monetizan al **proveedor real**, no a creadores de contenido genérico.
- Stories/lives son **escaparate comercial temporal**, no entretenimiento social puro.

---

## 2. Inventario actual (con evidencia)

| Elemento | Estado |
|---|---|
| Planes Básico/Destacado/Premium/VIP | **Reales** ($299/$599/$999/$1499 MXN, `config-precios-planes-perfiles-schema.json`) |
| Propinas | **No existen** — función nueva |
| Contenido premium/exclusivo | No existe — nuevo |
| Stories/Lives/Publicaciones | No existen — futuros (PLAN-MAESTRO-INTERACCIONES) |
| Compartir / Repost | Compartir = evento social futuro; repost no existe |
| Add-ons media (HD/video) | Campos de media existen; producto de pago no |
| Pagos | Sin pasarela conectada → economía social depende de Pagos operativo |

---

## 3. Módulos internos

TipsEngine (propinas) · PremiumContentGate · ShareService · RepostService · PlanEntitlements · MediaAddonsStore · SocialMonetizationLedger (concilia con Pagos).

---

## 4-6. Matrices

### Función → pantallas Cariñosas
- **Propinas:** Perfil, Estados, Stories, Lives, Publicaciones, Dashboard Perfil (recibidas).
- **Compartir:** Perfil, Resultados, Estados, Publicaciones, Lives.
- **Repost:** Perfil, Dashboard Perfil.
- **Premium/Exclusivo:** Perfil, Publicaciones, Stories, Lives.
- **Planes:** Resultados (prioridad/badge), Home (destacadoHome), Perfil (badge), Dashboards (gestión).
- **Fotos HD/optimizadas:** Perfil, Resultados (thumb), Galería.
- **Videos:** Perfil, Stories, Lives, Publicaciones.
- **Add-ons:** Dashboards (compra), Perfil (efecto).

### Función → módulos
Propinas → TipsEngine+Pagos+Ledger+Interacciones+Admin+Seguridad · Compartir → ShareService+Interacciones+RenderEngine+SEO+ADR-Adultos · Premium → PremiumContentGate+Pagos+FieldEngine+PrivacyGuard+Admin · Planes → PlanEntitlements+Pagos+Contratos+Dashboards · Media/add-ons → MediaAddonsStore+Pagos+Contratos.

### Función → fase

| Función | Fase |
|---|---|
| Planes Básico/Destacado/Premium/VIP | MVP (ya definidos) |
| Fotos optimizadas | MVP |
| Compartir perfil | MVP |
| Propinas en perfil | Nacional |
| Fotos HD / video add-on / repost | Nacional |
| Compartir estados/publicaciones | Nacional |
| Propinas en estados/stories | Internacional / futuro |
| Contenido premium | Internacional / futuro |
| Propinas en lives/publicaciones, exclusivo | Futuro |
| Monetización social completa | Visión futura |

---

## 7. Validación por superficie (15)

| Superficie | Veredicto |
|---|---|
| Perfil Público | ENCAJA — núcleo de conversión |
| Resultados | ENCAJA — descubrimiento; **sin propinas aquí** |
| Home | ENCAJA — solo vitrina por plan (destacadoHome); sin feed genérico |
| Estados | ENCAJA acotado — escaparate temporal, no muro social |
| Stories | ENCAJA futuro — escaparate temporal con edad/moderación |
| Lives | ENCAJA futuro — alto riesgo; moderación live + edad |
| Publicaciones | ENCAJA futuro — contenido del proveedor, no UGC masivo |
| Dashboard Perfil | ENCAJA — panel de monetización del proveedor |
| Dashboard Negocio | ENCAJA |
| Dashboard Anunciante | ENCAJA — monetiza vía Banners, no social |
| Interacciones | ENCAJA — provee señales; no maneja dinero |
| Messenger | **EXCLUIR pagos/propinas en MVP** (riesgo AML/fraude); solo conversación |
| Pagos | ENCAJA — backbone; precio congelado MXN |
| Contratos | ENCAJA — planes/add-ons; **propinas NO son contrato** |
| Banners | ENCAJA pero **separado** de economía social (es publicidad) |

---

## 8. Planes y entitlements

| Plan | MXN | Dimensión social | destacadoHome |
|---|---|---|---|
| Básico | 299 | perfil público, fotos optimizadas, compartir | no |
| Destacado | 599 | + badge, prioridad media | no |
| Premium | 999 | + badge premium, más cupo galería/video | sí |
| VIP | 1499 | + badge vip, máxima prioridad, stories/lives destacados (futuro) | sí |

Precios y entitlements **ya existen** en `config-precios-planes-perfiles-schema.json`; este plan **no los modifica**, solo mapea su dimensión social. **Add-ons** (fotos HD, video extra, destacar story) se cobran vía Pagos como transacción separada y **no rompen el precio congelado** del plan base.

---

## 9. Propinas

Modelo: **emisor (cliente) → receptor (proveedor)** con comisión de plataforma, siempre en MXN, con comprobante, registradas en SocialMonetizationLedger y conciliadas por Admin. Reglas: mayoría de edad de ambos, límites antifraude/rate-limit (Seguridad MVP), reglas fiscales (ingreso del proveedor), **IA no aprueba ni mueve fondos** (RT-08), **sin propinas dentro de Messenger en MVP**. Riesgo clave: AML/fraude/edad → por eso fase nacional+ y nunca P2P libre sin control.

---

## 10. Contenido premium / exclusivo

Gating por pago puntual o plan (PremiumContentGate). **Premium siempre noindex** (PrivacyGuard + ADR-INDEXACION-ADULTOS); moderación Admin + ValidationEngine; edad/categoría obligatorias. Premium = pago para acceder; exclusivo = limitado a cierto tier. **Encaje Cariñosas:** monetiza al proveedor real sin convertir la plataforma en OnlyFans genérico — acotado a vitrina del nicho con moderación estricta.

---

## 11. Compartir / repost

- **Compartir:** evento social (Interacciones) que genera URL canónica (SEO); contenido sensible respeta ADR-INDEXACION-ADULTOS (preview moderado, posible noindex).
- **Repost:** el proveedor reorganiza/destaca **su propio** contenido; **no** repost de terceros (evita UGC masivo y problemas de derechos/consentimiento).
- **Límites:** no compartir contenido premium de pago; no exponer PII; previews adultos moderados.

---

## 12. Exclusiones explícitas (no encajan con Cariñosas)

| Función | Veredicto |
|---|---|
| Feed social infinito de extraños | EXCLUIR — rompe modelo geo-vitrina |
| Repost de contenido de terceros | EXCLUIR — derechos/consentimiento; solo repost propio |
| Pagos/propinas dentro de Messenger (MVP) | EXCLUIR en MVP — riesgo AML/fraude |
| Monetización de creadores ajenos al nicho (UGC genérico) | EXCLUIR — fuera de la visión |
| Propinas anónimas sin verificación de edad | EXCLUIR — riesgo legal/edad |
| Contenido premium indexable | EXCLUIR — siempre noindex |
| Suscripción recurrente automática a perfil (tipo OnlySubs) en MVP | ACOTAR a futuro con marco fiscal/AML |

---

## 13. Riesgos

| ID | Nivel | Riesgo | Mitigación |
|---|---|---|---|
| ES-R01 | crítico | Propinas/premium sin verificación de edad | mayoría de edad obligatoria + gates Seguridad MVP |
| ES-R02 | crítico | AML/lavado por flujos P2P | comisión vía plataforma, sin P2P libre, KYC/límites, conciliación Admin |
| ES-R03 | alto | Fiscal: ingresos sin factura | reglas fiscales, comprobantes, CFDI MXN |
| ES-R04 | alto | Reputación: deriva a OnlyFans/UGC explícito indexable | premium noindex, moderación, exclusiones, ADR-Adultos |
| ES-R05 | alto | Fraude/contracargos en propinas | antifraude, política de disputas (Admin) |
| ES-R06 | medio | Romper precio congelado al mezclar add-ons | add-ons como transacción separada |
| ES-R07 | medio | IA moviendo/aprobando dinero | RT-08: IA solo sugiere/alerta |
| ES-R08 | medio | Premium filtrado a buscadores/IA | PrivacyGuard + noindex + robots IA |

---

## 14. Dependencias e impactos

- **Precondiciones:** Pagos con pasarela operativa; verificación de edad/identidad; StoriesLivesEngine (para propinas en stories/lives); reglas fiscales; moderación social activa.
- **Impactos (diseño futuro, sin modificar nada):** Pagos gana nuevos tipos de transacción (propina/premium/add-on) reutilizando su ciclo, con precio de plan congelado intacto; Contratos cubre planes/add-ons (propinas no son contrato); Interacciones aporta compartir/repost/seguir.

---

## 15. Orden de implementación

1. **P0 (MVP):** PlanEntitlements (dimensión social de planes ya definidos) + fotos optimizadas + compartir perfil.
2. **P1 (nacional):** Pagos operativo → propinas en perfil + add-ons (HD/video) + repost propio.
3. **P2 (nacional→internacional):** Estados/Publicaciones + compartir + propinas en estados.
4. **P2 (internacional):** Contenido premium/exclusivo (gate + noindex + moderación).
5. **P3 (futuro):** StoriesLivesEngine → propinas en stories/lives.
6. **P3 (visión futura):** Monetización social completa + analítica.

---

## 16. Procedencia

**Sí procede** `PLAN-MAESTRO-ECONOMIA-SOCIAL.md/json` — entregados. **Siguientes pasos sugeridos:** `SPEC-ECONOMIA-SOCIAL` (post Pagos operativo) · `ADR-PROPINAS-AML-FISCAL` (reglas de dinero P2P) · definir comisión de plataforma y reglas fiscales con datos reales.

> No modifica los planes/precios, ni PLAN-MAESTRO-INTERACCIONES/PAGOS-CONTRATOS/BANNERS, ni demás capas/actas/ADRs (solo los referencia). Sin cambios en producción/Firestore/deploy/commit.
