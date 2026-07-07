import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import type { CamcpConfig } from '../policy/permissions.js';
import { assertReportWritePathAllowed } from '../policy/path-guard.js';

export interface QaRunManifest {
  tool: string;
  runId: string;
  reportDir: string;
  scriptPath: string;
  args: string[];
  exitCode: number;
  signal: string | null;
  durationMs: number;
  startedAt: string;
  finishedAt: string;
  stdoutPath: string;
  stderrPath: string;
  adapterOnly: boolean;
  reusedScript: string;
}

export interface QaRunResult {
  ok: boolean;
  manifest: QaRunManifest;
  stdout: string;
  stderr: string;
  reportFiles: string[];
}

function makeRunId(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

export function resolveReportsRoot(repoRoot: string, config: CamcpConfig): string {
  return path.resolve(repoRoot, config.reportsDir);
}

export function makeReportRunDir(
  repoRoot: string,
  config: CamcpConfig,
  toolName: string
): { runId: string; reportDir: string } {
  const runId = makeRunId();
  const reportDir = path.join(resolveReportsRoot(repoRoot, config), toolName, runId);
  assertReportWritePathAllowed(repoRoot, reportDir, config);
  fs.mkdirSync(reportDir, { recursive: true });
  return { runId, reportDir };
}

function listReportFiles(reportDir: string, repoRoot: string): string[] {
  if (!fs.existsSync(reportDir)) return [];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else out.push(path.relative(repoRoot, full).replace(/\\/g, '/'));
    }
  };
  walk(reportDir);
  return out.sort();
}

function writeLastRunPointer(repoRoot: string, config: CamcpConfig, manifest: QaRunManifest): void {
  const pointerPath = path.join(resolveReportsRoot(repoRoot, config), 'last-run.json');
  assertReportWritePathAllowed(repoRoot, pointerPath, config);
  fs.writeFileSync(pointerPath, JSON.stringify(manifest, null, 2), 'utf8');
}

export function runQaScript(
  repoRoot: string,
  config: CamcpConfig,
  toolName: string,
  scriptRelPath: string,
  args: string[] = [],
  options: { passOutDir?: boolean } = {}
): QaRunResult {
  const scriptAbs = path.resolve(repoRoot, scriptRelPath);
  if (!fs.existsSync(scriptAbs)) {
    throw new Error(`QA script not found: ${scriptRelPath}`);
  }

  const { runId, reportDir } = makeReportRunDir(repoRoot, config, toolName);
  const scriptArgs = options.passOutDir
    ? [...args, '--out', reportDir.replace(/\\/g, '/')]
    : args;
  const startedAt = new Date().toISOString();
  const t0 = Date.now();

  const result = spawnSync(process.execPath, [scriptAbs, ...scriptArgs], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    shell: false,
    env: { ...process.env },
  });

  const durationMs = Date.now() - t0;
  const stdout = result.stdout ?? '';
  const stderr = result.stderr ?? '';
  const stdoutPath = path.join(reportDir, 'stdout.txt');
  const stderrPath = path.join(reportDir, 'stderr.txt');

  assertReportWritePathAllowed(repoRoot, stdoutPath, config);
  assertReportWritePathAllowed(repoRoot, stderrPath, config);
  fs.writeFileSync(stdoutPath, stdout, 'utf8');
  fs.writeFileSync(stderrPath, stderr, 'utf8');

  const manifest: QaRunManifest = {
    tool: toolName,
    runId,
    reportDir: path.relative(repoRoot, reportDir).replace(/\\/g, '/'),
    scriptPath: scriptRelPath.replace(/\\/g, '/'),
    args: scriptArgs,
    exitCode: result.status ?? 1,
    signal: result.signal,
    durationMs,
    startedAt,
    finishedAt: new Date().toISOString(),
    stdoutPath: path.relative(repoRoot, stdoutPath).replace(/\\/g, '/'),
    stderrPath: path.relative(repoRoot, stderrPath).replace(/\\/g, '/'),
    adapterOnly: true,
    reusedScript: scriptRelPath.replace(/\\/g, '/'),
  };

  const manifestPath = path.join(reportDir, 'manifest.json');
  assertReportWritePathAllowed(repoRoot, manifestPath, config);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  writeLastRunPointer(repoRoot, config, manifest);

  const reportFiles = listReportFiles(reportDir, repoRoot);
  return {
    ok: manifest.exitCode === 0,
    manifest,
    stdout,
    stderr,
    reportFiles,
  };
}

export function runQaScriptChain(
  repoRoot: string,
  config: CamcpConfig,
  toolName: string,
  scripts: string[]
): QaRunResult & { chain: QaRunResult[] } {
  const chain: QaRunResult[] = [];
  let last: QaRunResult | null = null;
  for (const script of scripts) {
    last = runQaScript(repoRoot, config, toolName, script);
    chain.push(last);
    if (!last.ok) break;
  }
  if (!last) throw new Error('Empty script chain');
  return { ...last, chain };
}
