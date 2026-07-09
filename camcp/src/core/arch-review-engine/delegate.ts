import path from 'node:path';
import type { CamcpConfig } from '../../policy/permissions.js';
import { readReportIndex } from '../../reports/index-manager.js';
import { readCamcpReportFromDir } from '../../reports/parser.js';
import {
  runArchDomainBoundaries,
  runArchFrozenViolations,
  runArchScanDuplicates,
} from '../../arch/runner.js';
import { intelGraph, intelImpact } from '../../tools/intel.tools.js';
import { loadArchReviewConfig } from './config-loader.js';
import { archFinding, remapDelegatedFindings } from './findings.js';
import type { ArchReviewEngineContext, ArchReviewFacet, DelegationRecord } from './types.js';
import type { ReportFinding } from '../../reports/schema.js';
import type { IntelligenceGraph } from '../../intelligence/types.js';

function normalizeFrozenCodes(findings: ReportFinding[]): ReportFinding[] {
  return findings.map((f) => {
    if (f.severity !== 'BLOQUEADOR') return f;
    if (f.code?.startsWith('GOV.FROZEN')) return f;
    if (f.id.startsWith('ARCH-FROZEN-') || f.message.includes('congelado')) {
      return {
        ...f,
        code: 'GOV.FROZEN.MODULE_TOUCHED',
        impact: typeof f.impact === 'string' ? { surfaces: [f.impact], blocksMerge: true } : f.impact,
      };
    }
    return f;
  });
}

function findCachedDelegation(
  repoRoot: string,
  config: CamcpConfig,
  module: string,
  facet: string | null,
  maxAgeMs: number
): { reportRef: string; reportDir: string; findings: ReportFinding[] } | null {
  const index = readReportIndex(repoRoot, config);
  const now = Date.now();
  for (const entry of index.entries) {
    if (entry.toolId !== module) continue;
    if (facet && entry.facet && entry.facet !== facet) continue;
    const age = now - new Date(entry.generatedAt).getTime();
    if (age > maxAgeMs) continue;
    const reportDir = path.resolve(repoRoot, path.dirname(entry.manifestPath));
    const doc = readCamcpReportFromDir(reportDir);
    if (!doc) continue;
    return {
      reportRef: path.join(path.dirname(entry.manifestPath), 'report.json').replace(/\\/g, '/'),
      reportDir,
      findings: doc.findings.map((f) => ({
        id: f.id,
        severity: f.severity,
        message: f.message,
        code: f.code,
        title: f.title,
        domain: f.domain,
        category: f.category,
        subject: f.subject,
        provenance: f.provenance,
        recommendation: f.recommendation,
        evidenceRefs: f.evidence,
        impact: f.impact,
      })),
    };
  }
  return null;
}

function graphFindingsFromIntel(
  graph: IntelligenceGraph,
  fromCache: boolean,
  cachePath: string | null,
  facet: ArchReviewFacet,
  delegatedToolId: string
): ReportFinding[] {
  const findings: ReportFinding[] = [
    archFinding(
      'ARCH.GRAPH.STATS',
      'INFO',
      'Dependency graph stats',
      `${graph.stats.nodes} nodes, ${graph.stats.edges} edges, ${graph.stats.domains} domains`,
      facet,
      {
        category: 'graph',
        provenance: { toolId: 'arch.review', delegatedToolId },
        evidenceRefs: cachePath ? [{ kind: 'file', path: cachePath }] : undefined,
      }
    ),
  ];

  if (fromCache) {
    findings.push(
      archFinding(
        'ARCH.GRAPH.CACHED',
        'INFO',
        'Graph from cache',
        'intel.graph loaded from cache — not rebuilt',
        facet,
        { category: 'graph', provenance: { toolId: 'arch.review', delegatedToolId } }
      )
    );
  }

  if (graph.stats.nodes === 0) {
    findings.push(
      archFinding(
        'ARCH.GRAPH.EMPTY',
        'WARNING',
        'Empty dependency graph',
        'No graph nodes generated',
        facet,
        { category: 'graph', provenance: { toolId: 'arch.review', delegatedToolId } }
      )
    );
  }

  return findings;
}

export function delegateFacet(
  ctx: ArchReviewEngineContext,
  config: CamcpConfig,
  facet: ArchReviewFacet
): { findings: ReportFinding[]; record: DelegationRecord } {
  const cfg = loadArchReviewConfig();
  const mapping = cfg.delegation[facet];
  if (!mapping) {
    return {
      findings: [],
      record: {
        facet,
        delegatedToolId: '',
        reportRef: null,
        cached: false,
        ok: true,
      },
    };
  }

  if (ctx.delegation.skipIfCached && !ctx.input.operator?.forceRefresh) {
    const cached = findCachedDelegation(
      ctx.repoRoot,
      config,
      mapping.module,
      facet === 'boundaries' || facet === 'graph' ? null : null,
      ctx.delegation.maxAgeMs
    );
    if (cached) {
      let findings = remapDelegatedFindings(cached.findings, facet, mapping.toolId);
      if (facet === 'frozen') findings = normalizeFrozenCodes(findings);
      return {
        findings,
        record: {
          facet,
          delegatedToolId: mapping.toolId,
          reportRef: cached.reportRef,
          cached: true,
          ok: true,
        },
      };
    }
  }

  const gc = ctx.gitContext;
  const scopePaths =
    ctx.input.scope?.paths && ctx.input.scope.paths.length > 0
      ? ctx.input.scope.paths
      : gc.changedFiles.length > 0
        ? gc.changedFiles
        : undefined;

  let findings: ReportFinding[] = [];
  let reportRef: string | null = null;
  let ok = true;

  switch (facet) {
    case 'boundaries': {
      const result = runArchDomainBoundaries(ctx.repoRoot, config, {
        domain: ctx.input.scope?.domain,
      });
      ok = result.ok;
      findings = remapDelegatedFindings(result.data.findings, facet, mapping.toolId);
      break;
    }
    case 'frozen': {
      const result = runArchFrozenViolations(ctx.repoRoot, config, {
        base: gc.baseRef ?? undefined,
        head: gc.headRef ?? undefined,
        gitCommit: ctx.gitCommit,
      });
      ok = result.ok;
      reportRef = result.reportPaths.find((p) => p.endsWith('report.json')) ?? null;
      findings = normalizeFrozenCodes(
        remapDelegatedFindings(result.report.findings, facet, mapping.toolId)
      );
      break;
    }
    case 'duplicates': {
      const result = runArchScanDuplicates(ctx.repoRoot, config, {
        scope: scopePaths,
        gitCommit: ctx.gitCommit,
      });
      ok = result.ok;
      reportRef = result.reportPaths.find((p) => p.endsWith('report.json')) ?? null;
      findings = remapDelegatedFindings(result.report.findings, facet, mapping.toolId);
      break;
    }
    case 'impact': {
      const result = intelImpact(ctx.repoRoot, config, {
        base: gc.baseRef ?? undefined,
        head: gc.headRef ?? undefined,
        paths: scopePaths,
      });
      ok = result.report.status !== 'FAIL';
      reportRef = result.reportPaths.find((p) => p.endsWith('report.json')) ?? null;
      findings = remapDelegatedFindings(result.report.findings, facet, mapping.toolId);
      break;
    }
    case 'graph': {
      const result = intelGraph(ctx.repoRoot, config, {
        refresh: ctx.input.operator?.forceRefresh ?? false,
      });
      findings = graphFindingsFromIntel(
        result.graph,
        result.fromCache,
        result.cachePath,
        facet,
        mapping.toolId
      );
      ok = result.graph.stats.nodes > 0;
      break;
    }
    default:
      break;
  }

  return {
    findings,
    record: {
      facet,
      delegatedToolId: mapping.toolId,
      reportRef,
      cached: false,
      ok,
    },
  };
}
