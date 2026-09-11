// Renders scripts/og-card.html to public/og.png at exactly 1200x630.
//
// Run it after changing SITE.headline. Puppeteer is not a dependency of this
// site — it would pull a whole browser into every CI deploy for a file that
// changes about once a year — so install it, run, and remove it again:
//
//     npm i -D puppeteer && npm run og && npm un puppeteer
//
// The manual route needs no tooling at all, and gives the identical file:
// open scripts/og-card.html in Chrome, size the window to 1200x630, and save a
// screenshot as public/og.png. The card is deliberately static, so this runs
// about once a year.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let puppeteer;
try {
  puppeteer = (await import('puppeteer')).default ?? require('puppeteer');
} catch {
  console.error(
    'puppeteer is not installed. Either run:\n' +
      '    npm i -D puppeteer && npm run og && npm un puppeteer\n' +
      'or open scripts/og-card.html in Chrome at 1200x630 and save the\n' +
      'screenshot as public/og.png. Both give the same file.',
  );
  process.exit(1);
}

const browser = await puppeteer.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(root, 'scripts/og-card.html'), { waitUntil: 'networkidle0' });
// Without this the card renders in the Georgia fallback and looks wrong in a way
// that is easy to miss at thumbnail size.
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: path.join(root, 'public/og.png') });
await browser.close();
console.log('wrote public/og.png (1200x630)');
