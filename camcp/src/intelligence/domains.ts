import type { IntelligenceConfig, DomainInfo } from './types.js';
import { loadMapaMaestro, listGptKnowledgeDocs } from './contracts/loader.js';

const DOMAIN_LABELS: Record<string, string> = {
  APP_PUBLICA: 'App pública (Home, Resultados, Perfil)',
  APP_REGISTRO: 'Registro / Wizard',
  APP_DASHBOARD: 'Dashboard rentero',
  APP_ADMIN: 'Admin',
  APP_MESSENGER: 'Messenger (diseño congelado)',
  APP_PAGOS: 'Pagos / Monetización',
  APP_BANNERS: 'Banners / Slots',
  APP_INTERACCIONES: 'Interacciones',
  APP_SEO: 'SEO programático (diseño)',
  APP_THEMEENGINE: 'Theme Engine (observación)',
  APP_AGENTES: 'Agentes (futuro)',
  SHARED_CORE: 'Shared Core',
};

export function listDomains(repoRoot: string, intelConfig: IntelligenceConfig): DomainInfo[] {
  const mapa = loadMapaMaestro(repoRoot);
  const knowledge = listGptKnowledgeDocs(repoRoot);
  const mapaActual = mapa?.mapaActual ?? {};
  const domainIds = new Set([
    ...Object.keys(intelConfig.domainAnchors),
    ...Object.keys(mapaActual),
  ]);

  return [...domainIds].sort().map((id) => ({
    id,
    label: DOMAIN_LABELS[id] ?? id,
    maturity: mapaActual[id] ?? 'UNKNOWN',
    anchorPaths: intelConfig.domainAnchors[id] ?? [],
    knowledgeDocs: knowledge
      .filter((k) => matchKnowledgeToDomain(k.file, id))
      .map((k) => k.file),
  }));
}

function matchKnowledgeToDomain(docPath: string, domainId: string): boolean {
  const upper = docPath.toUpperCase();
  const hints: Record<string, string[]> = {
    APP_PUBLICA: ['HOME', 'RESULTADOS', 'PERFIL-PUBLICO', 'SISTEMA-VISUAL'],
    APP_REGISTRO: ['REGISTRO', 'FIELD-ENGINE', 'CATEGORIAS'],
    APP_DASHBOARD: ['ADMIN-Y-DASHBOARDS'],
    APP_ADMIN: ['ADMIN-Y-DASHBOARDS'],
    APP_BANNERS: ['BANNERS-SLOTS'],
    APP_SEO: ['SEO-PROGRAMATICO'],
    SHARED_CORE: ['ARQUITECTURA', 'FIRESTORE', 'GEOLOCALIZACION', 'FIELD-ENGINE'],
  };
  const keys = hints[domainId] ?? [];
  return keys.some((k) => upper.includes(k));
}
