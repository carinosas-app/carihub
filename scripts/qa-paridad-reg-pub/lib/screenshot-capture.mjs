import path from 'path';
import { ensureDir } from './report-writer.mjs';

/**
 * @param {import('playwright').Page} page
 * @param {string} shotsDir
 * @param {string} subSlug
 */
export async function captureScreenshots(page, shotsDir, subSlug) {
  ensureDir(shotsDir);
  const subDir = path.join(shotsDir, subSlug);
  ensureDir(subDir);

  const files = {};

  const fullPath = path.join(subDir, 'full-desktop.png');
  await page.screenshot({ path: fullPath, fullPage: true });
  files.full = fullPath;

  const hero = page.locator('.playout__tri, .gal, .playout__col--cen').first();
  if (await hero.count()) {
    const heroPath = path.join(subDir, 'hero.png');
    await hero.screenshot({ path: heroPath }).catch(() => {});
    files.hero = heroPath;
  }

  const derstack = page.locator('.playout__derstack').first();
  if (await derstack.count()) {
    const secPath = path.join(subDir, 'section-derstack.png');
    await derstack.screenshot({ path: secPath }).catch(() => {});
    files.derstack = secPath;
  }

  return files;
}
