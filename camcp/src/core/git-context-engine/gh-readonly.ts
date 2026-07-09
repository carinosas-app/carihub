import { spawnSync } from 'node:child_process';
import type { CamcpConfig } from '../../policy/permissions.js';
import { CommandGuardError } from '../../policy/command-guard.js';
import type { PrChecksSummary, PrContext } from './types.js';

export interface GhRunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

const GH_DENY = /\bgh\s+pr\s+(create|merge|close|edit|review)\b/i;

export function assertGhCommandAllowed(args: string[]): void {
  const full = `gh ${args.join(' ')}`.trim();
  if (GH_DENY.test(full)) {
    throw new CommandGuardError(`GitHub CLI write command blocked: gh ${args.join(' ')}`);
  }
  if (args[0] !== 'pr') {
    throw new CommandGuardError(
      `gh allowlist: only "pr" subcommands permitted, got: ${args[0] ?? '(empty)'}`
    );
  }
  const action = args[1];
  const allowed = new Set(['view', 'checks', 'list']);
  if (!action || !allowed.has(action)) {
    throw new CommandGuardError(
      `gh pr allowlist: view|checks|list only, got: ${action ?? '(empty)'}`
    );
  }
}

export function runGhAllowed(
  repoRoot: string,
  args: string[],
  _config: CamcpConfig
): GhRunResult {
  assertGhCommandAllowed(args);
  const result = spawnSync('gh', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 5 * 1024 * 1024,
    shell: false,
  });
  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    exitCode: result.status ?? 1,
  };
}

export function isGhAvailable(repoRoot: string, config: CamcpConfig): boolean {
  try {
    const r = runGhAllowed(repoRoot, ['pr', 'list', '--limit', '1'], config);
    return r.exitCode === 0;
  } catch {
    return false;
  }
}

export function fetchPrContext(
  repoRoot: string,
  config: CamcpConfig,
  branch: string | null,
  prNumber: number | null,
  inferFromBranch: boolean
): { pr: PrContext; ghAvailable: boolean; prFound: boolean } {
  const empty: PrContext = {
    number: null,
    url: null,
    state: null,
    title: null,
    checks: { total: 0, pass: 0, fail: 0, pending: 0 },
  };

  try {
    if (prNumber != null) {
      const view = runGhAllowed(
        repoRoot,
        ['pr', 'view', String(prNumber), '--json', 'number,url,state,title'],
        config
      );
      if (view.exitCode !== 0) {
        return { pr: empty, ghAvailable: true, prFound: false };
      }
      const parsed = JSON.parse(view.stdout.trim()) as {
        number: number;
        url: string;
        state: string;
        title: string;
      };
      const checks = fetchPrChecks(repoRoot, config, parsed.number);
      return {
        pr: {
          number: parsed.number,
          url: parsed.url,
          state: parsed.state,
          title: parsed.title,
          checks,
        },
        ghAvailable: true,
        prFound: true,
      };
    }

    if (!inferFromBranch || !branch) {
      return { pr: empty, ghAvailable: true, prFound: false };
    }

    const list = runGhAllowed(
      repoRoot,
      ['pr', 'list', '--head', branch, '--json', 'number,url,state,title', '--limit', '1'],
      config
    );
    if (list.exitCode !== 0) {
      return { pr: empty, ghAvailable: true, prFound: false };
    }
    const rows = JSON.parse(list.stdout.trim() || '[]') as Array<{
      number: number;
      url: string;
      state: string;
      title: string;
    }>;
    if (!rows.length) {
      return { pr: empty, ghAvailable: true, prFound: false };
    }
    const row = rows[0]!;
    const checks = fetchPrChecks(repoRoot, config, row.number);
    return {
      pr: {
        number: row.number,
        url: row.url,
        state: row.state,
        title: row.title,
        checks,
      },
      ghAvailable: true,
      prFound: true,
    };
  } catch {
    return { pr: empty, ghAvailable: false, prFound: false };
  }
}

function fetchPrChecks(
  repoRoot: string,
  config: CamcpConfig,
  prNumber: number
): PrChecksSummary {
  const summary: PrChecksSummary = { total: 0, pass: 0, fail: 0, pending: 0 };
  try {
    const checks = runGhAllowed(repoRoot, ['pr', 'checks', String(prNumber)], config);
    if (checks.exitCode !== 0) return summary;
    for (const line of checks.stdout.split('\n')) {
      const m = line.match(/\s(pass|fail|pending|skipping)\s*$/i);
      if (!m) continue;
      summary.total++;
      const st = m[1]!.toLowerCase();
      if (st === 'pass') summary.pass++;
      else if (st === 'fail') summary.fail++;
      else summary.pending++;
    }
  } catch {
    /* read-only optional */
  }
  return summary;
}
