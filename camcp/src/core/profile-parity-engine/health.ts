import { maxSeverityFromFindings } from '../../reports/counts.js';
import { loadProfileConfig } from './config-loader.js';
import type { ProfileEngineContext, ProfileHealthDocument, ProfileAuditFacet } from './types.js';
import type { ReportFinding } from '../../reports/schema.js';

function facetValid(findings: ReportFinding[] | undefined): boolean {
  if (!findings?.length) return true;
  return !findings.some((f) => f.severity === 'IMPORTANTE' || f.severity === 'BLOQUEADOR');
}

function privacyValid(findings: ReportFinding[] | undefined): boolean {
  if (!findings?.length) return true;
  return !findings.some(
    (f) =>
      f.severity === 'BLOQUEADOR' ||
      f.severity === 'IMPORTANTE' ||
      f.code?.startsWith('PRIVACY.')
  );
}

function parityCoverage(findings: ReportFinding[] | undefined): {
  pass: number;
  fail: number;
  skipped: number;
} {
  let fail = 0;
  for (const f of findings ?? []) {
    if (f.severity === 'BLOQUEADOR' || f.severity === 'IMPORTANTE') fail += 1;
  }
  const subs = findings?.length ? Math.max(1, fail) : 0;
  return { pass: Math.max(0, subs - fail), fail, skipped: 0 };
}

export function buildProfileHealth(ctx: ProfileEngineContext): ProfileHealthDocument {
  const cfg = loadProfileConfig();
  const ff = ctx.facetFindings;
  const registrationValid = facetValid(ff.registration);
  const parityValid = facetValid(ff.parity);
  const privacyValidFlag = privacyValid(ff.private_fields);
  const renderValid = facetValid(ff.render);
  const lifecycleValid = facetValid(ff.lifecycle);
  const verificationValid = facetValid(ff.verification);

  const coverageStats = parityCoverage(ff.parity);
  const subsInScope = ctx.scope.subsInScope || coverageStats.pass + coverageStats.fail;
  const passRate = subsInScope ? coverageStats.pass / subsInScope : 1;

  const allFindings = Object.values(ff).flat().filter(Boolean) as ReportFinding[];
  const maxSev = maxSeverityFromFindings(
    allFindings.length
      ? allFindings.map((f) => ({
          id: f.id,
          severity: f.severity,
          code: f.code ?? 'UNKNOWN',
          confidence: f.confidence ?? 'high',
          title: f.title ?? f.message,
          message: f.message,
          domain: f.domain ?? 'APP_REGISTRO',
          category: f.category ?? 'meta',
          evidence: [],
          provenance: { toolId: 'profile.audit' },
        }))
      : [{ id: 'PASS', severity: 'PASS' as const, code: 'PASS', confidence: 'high' as const, title: 'OK', message: 'OK', domain: 'CAMCP', category: 'meta', evidence: [], provenance: { toolId: 'profile.audit' } }]
  );

  let overallStatus: ProfileHealthDocument['overallStatus'] = 'PASS';
  if (!ctx.gate.ssotValid || maxSev === 'BLOQUEADOR' || maxSev === 'IMPORTANTE') {
    overallStatus = 'FAIL';
  } else if (maxSev === 'WARNING') {
    overallStatus = 'WARNING';
  }

  const dependencyGraph: ProfileHealthDocument['dependencyGraph'] = {};
  for (const [key, node] of Object.entries(cfg.profileHealthGraph)) {
    let valid = true;
    for (const dep of node.dependsOn) {
      if (dep === 'contract-gate') valid = valid && ctx.gate.ssotValid;
      else if (dep === 'scope-resolver') valid = valid && ctx.scope.scopeValid;
      else if (dep === 'registration') valid = valid && registrationValid;
      else if (dep === 'parity') valid = valid && parityValid;
      else if (dep === 'private_fields') valid = valid && privacyValidFlag;
      else if (dep === 'render') valid = valid && renderValid;
      else if (dep === 'lifecycle') valid = valid && lifecycleValid;
      else if (dep === 'verification') valid = valid && verificationValid;
    }
    dependencyGraph[key] = { dependsOn: node.dependsOn, valid };
  }

  return {
    schemaVersion: '1.0.0',
    ssotValid: ctx.gate.ssotValid,
    scopeValid: ctx.scope.scopeValid,
    registrationValid,
    parityValid,
    privacyValid: privacyValidFlag,
    renderValid,
    lifecycleValid,
    verificationValid,
    coverage: {
      subsInScope,
      subsPassParity: coverageStats.pass,
      subsFailParity: coverageStats.fail,
      subsSkipped: coverageStats.skipped,
      passRate,
    },
    dependencyGraph,
    overallStatus,
  };
}

export function gateFindingsFromContract(ctx: ProfileEngineContext): ReportFinding[] {
  const findings: ReportFinding[] = [];
  for (const err of ctx.gate.errors) {
    findings.push({
      id: `PRF-GATE-${findings.length + 1}`,
      code: err.code.startsWith('PARITY.') ? err.code : 'PARITY.SSOT.INVALID',
      severity: 'BLOQUEADOR',
      title: 'Contract gate error',
      message: err.message,
      provenance: { toolId: 'profile.audit', facet: 'summary', engineId: 'contract-engine' },
    });
  }
  for (const warn of ctx.gate.warnings) {
    if (warn.code.includes('MISSING_ARQUETIPO')) {
      findings.push({
        id: `PRF-GATE-W-${findings.length + 1}`,
        code: 'PARITY.SSOT.MISSING_FIELD',
        severity: 'IMPORTANTE',
        title: 'Missing required field',
        message: warn.message,
        provenance: { toolId: 'profile.audit', facet: 'summary', engineId: 'contract-engine' },
      });
    }
    if (warn.code.includes('MIRROR')) {
      findings.push({
        id: `PRF-GATE-W-${findings.length + 1}`,
        code: 'PARITY.SSOT.MIRROR_MISMATCH',
        severity: 'IMPORTANTE',
        title: 'Mirror mismatch',
        message: warn.message,
        provenance: { toolId: 'profile.audit', facet: 'summary', engineId: 'contract-engine' },
      });
    }
  }
  return findings;
}

export function facetBlockedByGate(facet: ProfileAuditFacet, ctx: ProfileEngineContext): boolean {
  if (!ctx.gate.ssotValid && facet !== 'summary') return true;
  if (ctx.scope.scopeMissing && facet !== 'summary') return true;
  return false;
}
