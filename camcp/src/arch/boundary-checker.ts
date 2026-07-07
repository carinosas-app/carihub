import fs from 'node:fs';
import path from 'node:path';
import { loadIntelligenceConfig } from '../config/load-config.js';
import { loadMapaMaestro, listGptKnowledgeDocs } from '../intelligence/contracts/loader.js';
import type { ReportFinding } from '../reports/schema.js';

export interface BoundaryCheckResult {
  summary: string;
  findings: ReportFinding[];
  stats: {
    domainsMapa: number;
    domainsConfig: number;
    anchorsChecked: number;
    docsChecked: number;
    missingAnchors: number;
    orphanDocs: number;
  };
}

/** Cross-check MAPA + intelligence config + gpt-knowledge — SSOT only, no parallel map. */
export function checkDomainBoundaries(
  repoRoot: string,
  opts: { domain?: string } = {}
): BoundaryCheckResult {
  const mapa = loadMapaMaestro(repoRoot);
  const intelConfig = loadIntelligenceConfig();
  const knowledge = listGptKnowledgeDocs(repoRoot);
  const mapaActual = mapa?.mapaActual ?? {};
  const findings: ReportFinding[] = [];

  const domainIds = new Set([
    ...Object.keys(intelConfig.domainAnchors),
    ...Object.keys(mapaActual),
  ]);
  if (opts.domain) {
    for (const id of [...domainIds]) {
      if (id !== opts.domain) domainIds.delete(id);
    }
  }

  let anchorsChecked = 0;
  let missingAnchors = 0;

  for (const domainId of [...domainIds].sort()) {
    const anchors = intelConfig.domainAnchors[domainId] ?? [];
    if (Object.prototype.hasOwnProperty.call(mapaActual, domainId) && anchors.length === 0) {
      findings.push({
        id: `ARCH-BOUND-${domainId}-NO-ANCHORS`,
        severity: 'WARNING',
        message: `Dominio MAPA ${domainId} sin anclas en intelligence.config.json`,
        impact: domainId,
        recommendation: 'Añadir domainAnchors o actualizar MAPA-MAESTRO',
      });
    }

    for (const anchor of anchors) {
      anchorsChecked++;
      const full = path.join(repoRoot, anchor);
      if (!fs.existsSync(full)) {
        missingAnchors++;
        findings.push({
          id: `ARCH-BOUND-MISSING-${anchorsChecked}`,
          severity: 'IMPORTANTE',
          message: `Ancla inexistente: ${anchor} (dominio ${domainId})`,
          impact: domainId,
          evidence: anchor,
          recommendation: 'Corregir ancla o restaurar archivo',
        });
      }
    }
  }

  const docPaths = new Set(knowledge.map((k) => k.file));
  let orphanDocs = 0;
  for (const doc of knowledge) {
    if (opts.domain && !docMatchesDomain(doc.file, opts.domain)) continue;
    const matched = [...domainIds].some((d) => docMatchesDomain(doc.file, d));
    if (!matched) {
      orphanDocs++;
      findings.push({
        id: `ARCH-BOUND-ORPHAN-DOC-${orphanDocs}`,
        severity: 'INFO',
        message: `Documento gpt-knowledge sin dominio claro: ${doc.file}`,
        impact: 'SHARED_CORE',
        evidence: doc.file,
      });
    }
  }

  if (findings.length === 0) {
    findings.push({
      id: 'ARCH-BOUND-OK',
      severity: 'PASS',
      message: 'Fronteras MAPA ↔ anclas ↔ docs coherentes en scope',
    });
  }

  const summary = `Boundary check: ${domainIds.size} dominio(s), ${anchorsChecked} ancla(s), ${docPaths.size} doc(s); ${missingAnchors} ancla(s) faltante(s), ${orphanDocs} doc(s) huérfano(s).`;

  return {
    summary,
    findings,
    stats: {
      domainsMapa: Object.keys(mapaActual).length,
      domainsConfig: Object.keys(intelConfig.domainAnchors).length,
      anchorsChecked,
      docsChecked: docPaths.size,
      missingAnchors,
      orphanDocs,
    },
  };
}

function docMatchesDomain(docPath: string, domainId: string): boolean {
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
