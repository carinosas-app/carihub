/**
 * PP-02 — render matrix integrity gate.
 * node scripts/qa-paridad-reg-pub/pp02-matrix-integrity.test.mjs
 */
import { makePipelineCtx } from './lib/vm-pipeline-context.mjs';
import { assertRenderMatrixReady } from './lib/render-runner.mjs';
import { getMatrixCases, LAYOUT_SHELLS, SECTOR_RENDER_MODULES } from './lib/render-matrix.mjs';

function main() {
  const { ctx } = makePipelineCtx();
  const result = assertRenderMatrixReady(ctx);
  const cases = getMatrixCases();

  console.log('=== PP-02 Render Matrix Integrity ===');
  console.log('Cases:', cases.length);
  console.log('Shells:', LAYOUT_SHELLS.length, '| Sectors:', Object.keys(SECTOR_RENDER_MODULES).length);
  console.log('Coverage:', result.coverage);

  if (result.warnings?.length) {
    console.log('\nWarnings:', result.warnings.length);
    for (const w of result.warnings) console.log('  ⚠', w);
  }

  console.log('\nPASS — matrix integrity OK');
  process.exit(0);
}

try {
  main();
} catch (e) {
  console.error('\nFAIL — matrix integrity');
  console.error(e.message);
  if (e.details?.errors) e.details.errors.forEach((x) => console.error('  ✗', x));
  process.exit(1);
}
