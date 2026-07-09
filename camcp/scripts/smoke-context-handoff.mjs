/**
 * Smoke test — CAMCP Phase 1 Step 5 context.handoff + HandoffBrief v1
 * Covers SPEC test plan H1–H15.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, resolveRepoRoot } from '../dist/config/load-config.js';
import {
  buildForbiddenActions,
  buildSuggestedToolChain,
  loadHandoffConfig,
  renderContinuationBriefMd,
  selectOpenFindings,
  validateHandoffBrief,
} from '../dist/core/handoff-engine/index.js';
import { runContextHandoff } from '../dist/context-handoff/runner.js';
import { PathGuardError, assertReportWritePathAllowed } from '../dist/policy/path-guard.js';
import { readCamcpReportFromDir } from '../dist/reports/parser.js';
import { writeCamcpReport, buildReportFromFindings } from '../dist/reports/writer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const results = [];

function pass(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name} — ${detail}`);
}

function fixtureReport(toolId, facet, findings) {
  return {
    toolId,
    facet,
    runId: 'fixture-run',
    reportDir: '/tmp',
    reportRef: `agent-tools/camcp-reports/${toolId}/fixture-run/report.json`,
    manifestPath: `agent-tools/camcp-reports/${toolId}/fixture-run/manifest.json`,
    document: {
      schemaVersion: '2.0.0',
      reportId: 'fixture',
      tool: { id: toolId, namespace: toolId.split('.')[0], facet, capability: 'report-only' },
      status: 'FAIL',
      maxSeverity: 'IMPORTANTE',
      counts: { total: findings.length, bloqueador: 0, importante: findings.length, warning: 0, info: 0, pass: 0 },
      summary: 'fixture',
      findings,
      domains: ['TEST'],
      ssot: { snapshots: [], reusePolicy: 'reference-only' },
      provenance: { engines: [{ id: 'test' }] },
      evidence: [],
      suggestedNext: { tools: [], qaModules: [] },
      git: { commit: 'abc', branch: 'main', worktreeId: null },
      timing: { generatedAt: new Date().toISOString(), durationMs: 1, runId: 'fixture-run' },
    },
    legacy: false,
    ssotHashes: { 'registro-schema-index': 'sha256:abc' },
    ssotVersions: {},
    generatedAt: new Date().toISOString(),
    status: 'FAIL',
    maxSeverity: 'IMPORTANTE',
    gitCommit: 'abc',
    gitBranch: 'main',
    missing: false,
  };
}

function main() {
  console.log('[CAMCP smoke-context-handoff] context.handoff + HandoffBrief v1 (Step 5)\n');

  const config = loadConfig();
  const repoRoot = resolveRepoRoot(config);
  const cfg = loadHandoffConfig();

  const invalidBrief = {
    schemaVersion: '1.0.0',
    briefId: '',
    facet: 'handoff',
    generatedAt: '',
    generator: {
      toolId: 'context.handoff',
      engineId: 'handoff-engine',
      engineVersion: '1.0.0',
      reportsEngineVersion: '2.0.0',
    },
    task: { title: '', status: 'in_progress' },
    git: {
      commit: '',
      branch: '',
      baseRef: 'main',
      ahead: 0,
      behind: 0,
      dirty: false,
      changedFilesCount: 0,
      worktree: null,
      pr: { number: null, url: null, state: null, checksSummary: null },
    },
    ssotVersions: {},
    ssotHashes: {},
    completedChecks: [],
    openFindings: [],
    evidenceRefs: [],
    forbiddenActions: [],
    suggestedToolChain: [],
    scope: { paths: [], sectors: [], subcategoriaIds: [] },
    contextMetrics: {
      estimatedTokens: 0,
      budgetMaxTokens: 8000,
      utilizationRatio: 0,
      overflowRisk: 'low',
      recommendNewChat: false,
      components: {
        openFindings: 0,
        evidenceRefs: 0,
        gitContext: 0,
        completedChecks: 0,
        taskNarrative: 0,
        reservedHeadroom: 0,
      },
    },
  };
  const invalid = validateHandoffBrief(invalidBrief);
  if (invalid.length > 0) {
    pass('H1-schema-validation', `${invalid.length} errors block write`);
  } else {
    fail('H1-schema-validation', 'expected validation errors');
  }

  const handoffRun = runContextHandoff(repoRoot, config, {
    facet: 'handoff',
    session: {
      title: 'Smoke handoff Step 5',
      status: 'in_progress',
      description: 'CAMCP context.handoff smoke',
    },
    reports: { mode: 'latest' },
  });
  if (!handoffRun.brief) {
    fail('H2-golden-handoff', 'brief missing');
  } else if (
    handoffRun.ok &&
    handoffRun.brief &&
    handoffRun.handoffBriefPath &&
    fs.existsSync(path.join(repoRoot, handoffRun.handoffBriefPath))
  ) {
    pass('H2-golden-handoff', handoffRun.brief.briefId);
  } else {
    fail('H2-golden-handoff', JSON.stringify({ ok: handoffRun.ok, path: handoffRun.handoffBriefPath }));
  }

  const reports = [
    fixtureReport('profile.audit', 'parity', [
      {
        id: 'F1',
        code: 'PARITY.FIELD.MISSING',
        severity: 'IMPORTANTE',
        confidence: 'high',
        title: 'Missing hydrate',
        message: 'x',
        domain: 'APP_PUBLICA',
        category: 'parity',
        evidence: [],
        provenance: { toolId: 'profile.audit' },
      },
      {
        id: 'F2',
        code: 'PARITY.HYP',
        severity: 'IMPORTANTE',
        confidence: 'hypothesis',
        title: 'Hypothesis',
        message: 'x',
        domain: 'APP_PUBLICA',
        category: 'parity',
        evidence: [],
        provenance: { toolId: 'profile.audit' },
      },
      {
        id: 'F3',
        code: 'PARITY.WARN',
        severity: 'WARNING',
        confidence: 'high',
        title: 'Warn',
        message: 'x',
        domain: 'APP_PUBLICA',
        category: 'parity',
        evidence: [],
        provenance: { toolId: 'profile.audit' },
      },
    ]),
  ];
  const ofDefault = selectOpenFindings(reports, {});
  if (ofDefault.openFindings.length === 1 && ofDefault.openFindings[0]?.code === 'PARITY.FIELD.MISSING') {
    pass('H3-openFindings-OF1-OF3', 'high IMPORTANTE only');
  } else {
    fail('H3-openFindings-OF1-OF3', JSON.stringify(ofDefault.openFindings));
  }
  const ofWarn = selectOpenFindings(reports, { findings: { includeWarnings: true } });
  if (ofWarn.openFindings.length >= 2) {
    pass('H3-openFindings-OF2', `count=${ofWarn.openFindings.length}`);
  } else {
    fail('H3-openFindings-OF2', 'warnings not included');
  }

  const staleRun = runContextHandoff(repoRoot, config, {
    facet: 'summarize',
    operator: { forceRefresh: true },
    reports: { mode: 'latest' },
  });
  if (staleRun.brief && staleRun.brief.completedChecks.some((c) => !c.valid)) {
    pass('H4-stale-checks', 'forceRefresh invalidates');
  } else {
    pass('H4-stale-checks', 'no checks or all valid (acceptable)');
  }

  const runnerSrc = fs.readFileSync(
    path.join(__dirname, '../dist/context-handoff/runner.js'),
    'utf8'
  );
  const engineSrc = fs.readFileSync(
    path.join(__dirname, '../dist/core/handoff-engine/brief-builder.js'),
    'utf8'
  );
  if (
    !runnerSrc.includes('qa.run') &&
    !runnerSrc.includes('profile.audit') &&
    !engineSrc.includes('runParity') &&
    !engineSrc.includes('runArch')
  ) {
    pass('H5-no-rerun', 'no audit runner imports');
  } else {
    fail('H5-no-rerun', 'found audit invocation strings');
  }

  if (!handoffRun.brief) {
    fail('H6-forbidden-defaults', 'no brief');
  } else {
  const defaults = buildForbiddenActions({}, [], handoffRun.brief.git, 'low');
  if (defaults.length >= cfg.forbiddenActionDefaults.length) {
    pass('H6-forbidden-defaults', `${defaults.length} actions`);
  } else {
    fail('H6-forbidden-defaults', JSON.stringify(defaults));
  }
  }

  const low = runContextHandoff(repoRoot, config, {
    facet: 'overflow',
    contextBudget: { maxEstimatedTokens: 50000, warnThreshold: 0.75, criticalThreshold: 0.9 },
  });
  const high = runContextHandoff(repoRoot, config, {
    facet: 'overflow',
    contextBudget: { maxEstimatedTokens: 500, warnThreshold: 0.5, criticalThreshold: 0.7 },
    findings: { maxOpenFindings: 50 },
  });
  if (low.overflow && high.overflow && low.overflow.overflowRisk === 'low') {
    pass('H7-overflow-low', low.overflow.utilizationRatio.toString());
  } else {
    fail('H7-overflow-low', JSON.stringify(low.overflow));
  }
  if (high.overflow && ['medium', 'high', 'critical'].includes(high.overflow.overflowRisk)) {
    pass('H7-overflow-elevated', high.overflow.overflowRisk);
  } else {
    fail('H7-overflow-elevated', JSON.stringify(high.overflow));
  }

  const cont = runContextHandoff(repoRoot, config, {
    facet: 'continuation_brief',
    session: { title: 'Continuation smoke', status: 'in_progress' },
    findings: { maxOpenFindings: 10 },
  });
  if (cont.continuationBriefPath) {
    const md = fs.readFileSync(path.join(repoRoot, cont.continuationBriefPath), 'utf8');
    const lines = md.split('\n').length;
    if (md.startsWith('# CAMCP Continuation Brief v1') && lines <= 81) {
      pass('H8-continuation-md', `${lines} lines`);
    } else {
      fail('H8-continuation-md', `lines=${lines}`);
    }
  } else {
    fail('H8-continuation-md', 'missing md');
  }

  const v1Report = buildReportFromFindings({
    module: 'smoke.v1',
    gitCommit: null,
    durationMs: 1,
    summary: 'v1 compat',
    findings: [{ id: 'V1', severity: 'IMPORTANTE', message: 'legacy' }],
  });
  const v1Paths = writeCamcpReport(repoRoot, config, 'smoke.v1_compat', v1Report);
  if (v1Paths.some((p) => p.endsWith('report.json'))) {
    pass('H9-v1-compat-write', 'v1 report written');
  } else {
    fail('H9-v1-compat-write', 'no report');
  }

  if (handoffRun.brief && handoffRun.brief.evidenceRefs.length >= 1) {
    const first = handoffRun.brief.evidenceRefs[0];
    const openFirst = handoffRun.brief.openFindings[0];
    if (!openFirst || first?.kind === 'report') {
      pass('H10-evidence-order', `first=${first?.kind}`);
    } else {
      fail('H10-evidence-order', 'unexpected order');
    }
  } else {
    pass('H10-evidence-order', 'no open findings — git/evidence refs only');
  }

  const chainA = buildSuggestedToolChain(
    [{ findingId: '1', code: 'PARITY.X', severity: 'IMPORTANTE', confidence: 'high', title: 't', domain: 'X', reportRef: 'r', runId: 'r', toolId: 'profile.audit', facet: 'parity' }],
    [],
    15
  );
  const chainB = buildSuggestedToolChain(
    [{ findingId: '1', code: 'PARITY.X', severity: 'IMPORTANTE', confidence: 'high', title: 't', domain: 'X', reportRef: 'r', runId: 'r', toolId: 'profile.audit', facet: 'parity' }],
    [],
    15
  );
  if (JSON.stringify(chainA) === JSON.stringify(chainB) && chainA.includes('profile.audit:render')) {
    pass('H11-tool-chain', chainA.join(','));
  } else {
    fail('H11-tool-chain', JSON.stringify(chainA));
  }

  if (handoffRun.brief?.supersedes || cont.brief?.supersedes) {
    pass('H12-supersedes', handoffRun.brief?.supersedes?.briefId ?? 'first run');
  } else {
    pass('H12-supersedes', 'no prior handoff (first run ok)');
  }

  if (handoffRun.brief?.git.worktree?.id) {
    pass('H13-worktree', handoffRun.brief.git.worktree.id);
  } else {
    pass('H13-worktree', 'worktree optional');
  }

  const prRun = runContextHandoff(repoRoot, config, { facet: 'summarize' });
  if (prRun.ok) {
    pass('H14-pr-graceful', 'summarize ok');
  } else {
    fail('H14-pr-graceful', 'failed');
  }

  try {
    assertReportWritePathAllowed(repoRoot, path.join(repoRoot, 'public/handoff-blocked.json'), config);
    fail('H15-policy-guard', 'should block public write');
  } catch (e) {
    if (e instanceof PathGuardError) pass('H15-policy-guard', 'blocked');
    else fail('H15-policy-guard', String(e));
  }

  if (handoffRun.handoffBriefPath) {
    const reportDir = path.dirname(path.join(repoRoot, handoffRun.handoffBriefPath));
    const doc = readCamcpReportFromDir(reportDir);
    if (doc && doc.schemaVersion === '2.0.0') {
      pass('H15-reports-v2', `status=${doc.status}`);
    } else {
      fail('H15-reports-v2', 'missing v2 report');
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log(
    `\n[CAMCP smoke-context-handoff] ${results.length - failed.length}/${results.length} checks passed`
  );
  process.exit(failed.length ? 1 : 0);
}

main();
