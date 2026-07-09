import path from 'node:path';
import type { CamcpConfig } from '../../policy/permissions.js';
import { readReportIndex } from '../../reports/index-manager.js';
import { readCamcpReportFromDir } from '../../reports/parser.js';
import { runDataHydrateAudit, runDataPersistAudit, runDataSchemaAlignment } from '../../data/runner.js';
import { runParityRenderStrict, runParityVm } from '../../parity/runner.js';
import { loadProfileConfig } from './config-loader.js';
import { remapDelegatedFindings } from './findings.js';
import type { DelegationRecord, ProfileAuditFacet, ProfileEngineContext } from './types.js';
import type { ReportFinding } from '../../reports/schema.js';

function findCachedDelegation(
  repoRoot: string,
  config: CamcpConfig,
  module: string,
  maxAgeMs: number
): { reportRef: string; reportDir: string; findings: ReportFinding[] } | null {
  const index = readReportIndex(repoRoot, config);
  const now = Date.now();
  for (const entry of index.entries) {
    if (entry.toolId !== module) continue;
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
      })),
    };
  }
  return null;
}

export function delegateFacet(
  ctx: ProfileEngineContext,
  config: CamcpConfig,
  facet: ProfileAuditFacet
): { findings: ReportFinding[]; record: DelegationRecord } {
  const cfg = loadProfileConfig();
  const mapping = cfg.delegation[facet];
  if (!mapping) {
    return {
      findings: [],
      record: {
        facet,
        delegatedToolId: '',
        reportRef: null,
        qaReportDir: null,
        cached: false,
        ok: true,
      },
    };
  }

  const opts = {
    sector: ctx.scope.sectorId ?? undefined,
    sub: ctx.scope.subcategoriaIds[0],
    maxSubs: ctx.scope.subcategoriaIds.length || undefined,
    gitCommit: ctx.gitCommit,
  };

  if (ctx.delegation.skipIfCached && !ctx.input.operator?.forceRefresh) {
    const cached = findCachedDelegation(
      ctx.repoRoot,
      config,
      mapping.module,
      ctx.delegation.maxAgeMs
    );
    if (cached) {
      return {
        findings: remapDelegatedFindings(cached.findings, facet, mapping.toolId),
        record: {
          facet,
          delegatedToolId: mapping.toolId,
          reportRef: cached.reportRef,
          qaReportDir: path.relative(ctx.repoRoot, cached.reportDir).replace(/\\/g, '/'),
          cached: true,
          ok: true,
        },
      };
    }
  }

  let result;
  switch (facet) {
    case 'registration':
      result = runDataSchemaAlignment(ctx.repoRoot, config, { gitCommit: ctx.gitCommit });
      break;
    case 'parity':
      result = runParityVm(ctx.repoRoot, config, opts);
      break;
    case 'public_fields':
      result = runDataHydrateAudit(ctx.repoRoot, config, { gitCommit: ctx.gitCommit });
      break;
    case 'private_fields':
      result = runDataPersistAudit(ctx.repoRoot, config, { gitCommit: ctx.gitCommit });
      break;
    case 'render':
      result = runParityRenderStrict(ctx.repoRoot, config, {
        sub: opts.sub,
        gitCommit: ctx.gitCommit,
      });
      break;
    default:
      return {
        findings: [],
        record: {
          facet,
          delegatedToolId: mapping.toolId,
          reportRef: null,
          qaReportDir: null,
          cached: false,
          ok: false,
        },
      };
  }

  const reportRef =
    result.reportPaths.find((p) => p.endsWith('report.json')) ??
    result.reportPaths.find((p) => p.endsWith('manifest.json'));
  const qaDir = result.qaResult.manifest?.reportDir
    ? path.relative(ctx.repoRoot, result.qaResult.manifest.reportDir).replace(/\\/g, '/')
    : null;

  return {
    findings: remapDelegatedFindings(result.report.findings, facet, mapping.toolId),
    record: {
      facet,
      delegatedToolId: mapping.toolId,
      reportRef: reportRef ?? null,
      qaReportDir: qaDir,
      cached: false,
      ok: result.ok,
    },
  };
}
