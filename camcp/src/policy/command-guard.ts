import { spawnSync } from 'node:child_process';
import type { CamcpConfig } from './permissions.js';

export class CommandGuardError extends Error {
  code = 'COMMAND_GUARD';
  constructor(message: string) {
    super(message);
    this.name = 'CommandGuardError';
  }
}

const GLOBAL_DENY_PATTERNS = [
  /\bgit\s+(push|commit|merge|rebase|reset|checkout\s+-f|clean|stash\s+drop)\b/i,
  /\bfirebase\s+deploy\b/i,
  /\bfirebase\s+use\b/i,
  /\brmdir\b/i,
  /\brm\s+-rf\b/i,
  /\bdel\s+\/f\b/i,
  /\bRemove-Item\b/i,
  /\bInvoke-Expression\b/i,
  /\bcmd\s+\/c\b/i,
  /\bbash\s+-c\b/i,
];

export function assertCommandAllowed(rawCommand: string, config: CamcpConfig): void {
  for (const pattern of GLOBAL_DENY_PATTERNS) {
    if (pattern.test(rawCommand)) {
      throw new CommandGuardError(`Command blocked by policy: ${rawCommand}`);
    }
  }
}

export function assertGitSubcommandAllowed(subcommand: string, config: CamcpConfig): void {
  const allowed = config.gitAllowedSubcommands.map((s) => s.toLowerCase());
  if (!allowed.includes(subcommand.toLowerCase())) {
    throw new CommandGuardError(
      `Git subcommand not in allowlist: ${subcommand}. Allowed: ${allowed.join(', ')}`
    );
  }
}

export interface GitRunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export function runGitAllowed(
  repoRoot: string,
  subcommand: string,
  args: string[],
  config: CamcpConfig
): GitRunResult {
  assertGitSubcommandAllowed(subcommand, config);
  const full = `git ${subcommand} ${args.join(' ')}`.trim();
  assertCommandAllowed(full, config);

  const result = spawnSync('git', [subcommand, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    shell: false,
  });

  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    exitCode: result.status ?? 1,
  };
}

export function getGitCommitShort(repoRoot: string, config: CamcpConfig): string | null {
  try {
    const r = runGitAllowed(repoRoot, 'rev-parse', ['--short', 'HEAD'], config);
    if (r.exitCode !== 0) return null;
    return r.stdout.trim() || null;
  } catch {
    return null;
  }
}
