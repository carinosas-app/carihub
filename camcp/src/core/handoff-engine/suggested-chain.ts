import type { HandoffOpenFinding } from './types.js';
import type { LoadedReport } from './report-loader.js';
import { loadHandoffConfig } from './config-loader.js';

export function buildSuggestedToolChain(
  openFindings: HandoffOpenFinding[],
  reports: LoadedReport[],
  changedFilesCount: number,
  previousChain: string[] = []
): string[] {
  const cfg = loadHandoffConfig();
  const chain: string[] = [];

  if (openFindings.some((f) => f.code.startsWith('PARITY.') || f.code.startsWith('PROFILE.'))) {
    chain.push('profile.audit:render');
  }

  const hasImpact = reports.some((r) => r.toolId === 'intel.impact');
  if (hasImpact || openFindings.length > 0) {
    chain.push('intel.impact');
  }

  if (changedFilesCount > 10) {
    chain.push('arch.review:full');
  }

  if (openFindings.some((f) => f.code.startsWith('GOV.FROZEN'))) {
    chain.unshift('arch.review:frozen');
  }

  for (const item of previousChain) {
    if (!chain.includes(item)) chain.push(item);
  }

  const deduped: string[] = [];
  for (const item of chain) {
    if (!deduped.includes(item)) deduped.push(item);
  }

  return deduped.slice(0, cfg.suggestedToolChainMax);
}
