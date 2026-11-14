import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

// Portfolio-only styling is injected into a temporary browser session.
// The kontigo-demo source and its original appearance stay unchanged.
const demo = process.env.KONTIGO_DEMO_URL || 'http://127.0.0.1:3220';
const url = `${demo}/?gallery=true&w=396&h=858&tab=home&currency=usdc&theme=dark`;
const target = new URL('../public/work/kontigo/screens/home-wallet-dark-ds.webp', import.meta.url);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 396, height: 858 }, deviceScaleFactor: 4, colorScheme: 'dark',
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('.home-root')?.dataset.theme === 'dark');
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: `
    nextjs-portal, [data-wallet-mesh] { display: none !important; }
    [data-slot="slider-dots"] > :nth-child(n + 4) { display: none !important; }
  ` });
  await page.waitForTimeout(2500);
  {
    await page.evaluate(() => {
      const card = document.querySelector('[data-slot="kontigocash-balance"]');
      const glass = card?.closest('[data-glass-kind="card"]');
      if (!card || !glass) throw new Error('Wallet balance card not found');
      glass.replaceWith(card.cloneNode(true));
    });
    await page.addStyleTag({ content: `
      [data-theme="dark"] .wallet-hero [data-slot="kontigocash-balance"] {
        background: var(--color-surface-bg) !important;
        border: 1px solid var(--color-surface-muted) !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
    ` });
  }
  const state = await page.evaluate(() => ({
    meshHidden: [...document.querySelectorAll('[data-wallet-mesh]')].every(el => getComputedStyle(el).display === 'none'),
    visibleDots: [...document.querySelectorAll('[data-slot="slider-dots"] > *')].filter(el => getComputedStyle(el).display !== 'none').length,
  }));
  if (!state.meshHidden || state.visibleDots !== 3) throw new Error(JSON.stringify(state));
  await mkdir(new URL('.', target), { recursive: true });
  await sharp(await page.screenshot()).webp({ quality: 95 }).toFile(target.pathname);
  console.log({ ...state, target: target.pathname });
} finally {
  await browser.close();
}
