#!/usr/bin/env node
/**
 * Build test-only production-candidate rules: firestore.rules + perfiles block.
 * Does NOT modify firestore.rules. Output: blk05-firestore-rules-production-candidate.rules
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PROD = join(ROOT, 'firestore.rules');
const DRAFT = join(__dirname, 'blk05-firestore-rules-perfiles-draft.rules');
const OUT = join(__dirname, 'blk05-firestore-rules-production-candidate.rules');
const MANIFEST = join(__dirname, 'blk05-rollback-manifest.json');

const CATCH_ALL = '    // ── Denegar todo lo demás ─────────────────────────────────────────';

function extractPerfilesBlock(draft) {
  const fnStart = draft.indexOf('    function isLegacyAdmin()');
  const matchEnd = draft.indexOf('    match /contratos_perfiles/{contratoId}');
  if (fnStart < 0 || matchEnd < 0) {
    throw new Error('Could not extract perfiles block from draft rules');
  }
  return draft.slice(fnStart, matchEnd).trim();
}

const prod = readFileSync(PROD, 'utf8');
const draft = readFileSync(DRAFT, 'utf8');
const perfilesSection = extractPerfilesBlock(draft);

if (!prod.includes(CATCH_ALL)) {
  console.error('[ABORT] Catch-all marker not found in firestore.rules');
  process.exit(1);
}

const merged = prod.replace(
  CATCH_ALL,
  `    // ── BLK-05 Phase 1 — perfiles/{perfilId} (production candidate — NOT DEPLOYED) ──\n\n${perfilesSection}\n\n${CATCH_ALL}`
);

writeFileSync(OUT, merged, 'utf8');

const manifest = {
  generatedAt: new Date().toISOString(),
  baselineProdRulesSha256: createHash('sha256').update(readFileSync(PROD, 'utf8')).digest('hex'),
  candidateRulesSha256: createHash('sha256').update(merged).digest('hex'),
  draftRulesSha256: createHash('sha256').update(draft).digest('hex'),
  rollback: {
    action: 'Redeploy firestore.rules from baselineProdRulesSha256 artifact',
    expectedBehavior: [
      'perfiles/ denied by catch-all',
      'usuarios/ legacy rules unchanged',
      'BLK-01 flags remain OFF'
    ]
  },
  note: 'TEST-ONLY merge. firebase.json still points to firestore.rules. NO DEPLOY.'
};

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');
console.log('[OK] Wrote', OUT);
console.log('[OK] Wrote', MANIFEST);
