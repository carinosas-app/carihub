import type { CamcpConfig } from '../../policy/permissions.js';
import type { IntelligenceConfig, ImpactAnalysis, ImpactFinding } from '../types.js';
import { gitDiff } from '../../tools/git.tools.js';

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/').replace(/^\.\//, '');
}

function domainsForPath(
  filePath: string,
  intelConfig: IntelligenceConfig
): string[] {
  const rel = normalizePath(filePath);
  const matched: string[] = [];
  for (const [domainId, anchors] of Object.entries(intelConfig.domainAnchors)) {
    for (const anchor of anchors) {
      const a = normalizePath(anchor);
      if (rel === a || rel.startsWith(a.endsWith('/') ? a : `${a}/`)) {
        matched.push(domainId);
        break;
      }
    }
  }
  if (rel.startsWith('camcp/')) matched.push('CAMCP');
  if (rel.startsWith('scripts/qa-')) matched.push('QA_SCRIPTS');
  return [...new Set(matched)];
}

function recommendedModulesForDomains(
  domains: string[],
  intelConfig: IntelligenceConfig
): string[] {
  const mods = new Set<string>();
  for (const d of domains) {
    const hints = intelConfig.impactQaHints[d] ?? intelConfig.impactQaHints.default ?? [];
    for (const m of hints) mods.add(m);
  }
  if (domains.includes('QA_SCRIPTS') || domains.includes('CAMCP')) {
    mods.add('fondos_static');
  }
  return [...mods];
}

export function analyzeImpact(
  repoRoot: string,
  config: CamcpConfig,
  intelConfig: IntelligenceConfig,
  options: { base?: string; head?: string; paths?: string[] } = {}
): ImpactAnalysis {
  let changedFiles: string[] = options.paths ?? [];
  let range = 'custom paths';

  if (!options.paths) {
    const diff = gitDiff(
      repoRoot,
      { base: options.base ?? 'origin/main', head: options.head ?? 'HEAD', stat: true },
      config
    );
    range = diff.range;
    changedFiles = (diff.files ?? [])
      .map((f) => f?.path)
      .filter((p): p is string => Boolean(p));
    if (changedFiles.length === 0 && diff.output) {
      changedFiles = diff.output
        .split('\n')
        .filter((l) => l.trim() && !l.includes('|') && !l.startsWith(' '))
        .map(normalizePath);
    }
  }

  const domainSet = new Set<string>();
  const findings: ImpactFinding[] = [];

  for (const file of changedFiles) {
    const domains = domainsForPath(file, intelConfig);
    for (const d of domains) domainSet.add(d);

    const recommendedModules = recommendedModulesForDomains(domains, intelConfig);
    findings.push({
      id: `IMPACT-${findings.length + 1}`,
      severity: domains.includes('APP_REGISTRO') ? 'IMPORTANTE' : 'INFO',
      domain: domains[0] ?? 'UNKNOWN',
      path: file,
      message:
        domains.length > 0
          ? `File touches domain(s): ${domains.join(', ')}`
          : 'File outside known domain anchors',
      recommendedModules,
    });
  }

  const affectedDomains = [...domainSet].sort();
  const recommendedModules = recommendedModulesForDomains(affectedDomains, intelConfig);

  return {
    range,
    changedFiles,
    affectedDomains,
    findings,
    recommendedModules,
  };
}
