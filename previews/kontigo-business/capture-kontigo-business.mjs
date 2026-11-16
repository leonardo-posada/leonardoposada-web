import { renderBalanceArt } from './kontigo-balance-art.mjs';
import { renderCashflowArt } from './kontigo-cashflow-art.mjs';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 4, colorScheme: 'dark', locale: 'es-VE' });
  await page.goto(process.env.KONTIGO_BUSINESS_URL || 'http://localhost:3202', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Continuar con Google', exact: true }).click();
  await page.getByRole('heading', { name: 'Hola, Jesús', exact: true }).waitFor();
  await page.locator('[data-testid="workspace-curtain"]').waitFor({ state: 'detached' });
  await page.waitForFunction(() => document.querySelector('.business')?.getAttribute('data-theme') === 'dark');
  await page.locator('#business-navigation').getByRole('button', { name: 'Tarjetas', exact: true }).click();
  const operationsPanel = page.locator('[data-slot="panel"]').filter({ has: page.getByRole('heading', { name: 'Operaciones', exact: true }) });
  await operationsPanel.waitFor();
  await page.waitForTimeout(1800);
  const operationsHTML = await operationsPanel.evaluate(el => el.outerHTML);
  await page.locator('#business-navigation').getByRole('button', { name: 'Inicio', exact: true }).click();
  await page.getByRole('heading', { name: 'Hola, Jesús', exact: true }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2000);
  const expandMenu = page.getByRole('button', { name: 'Expandir menú', exact: true });
  if (await expandMenu.isVisible()) await expandMenu.click();
  await page.getByRole('button', { name: 'Líneas', exact: true }).click();
  await page.locator('[data-chart-view="lines"]').waitFor();
  // Portfolio-only presentation changes; Business source remains untouched.
  await page.addStyleTag({ content: 'nextjs-portal, [data-home-landscape], .page-heading { display:none!important; } .overview-grid .interactive-chart .weekly-lines, .overview-grid .interactive-chart .weekly-chart {height:180px!important;min-height:180px!important;max-height:180px!important;flex:none!important;}' });
  await page.addStyleTag({ content: await readFile(new URL('./kontigo-business-preview.css', import.meta.url), 'utf8') });
  const avatar = await readFile(new URL('../public/work/kontigo/screens/business-avatar.jpg', import.meta.url));
  await page.evaluate(async src => {
    const slot = document.querySelector('.header-profile [data-slot="avatar"]');
    if (!slot) throw new Error('Header avatar not found');
    const image = new Image();
    image.src = src;
    image.alt = '';
    image.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block';
    await image.decode();
    slot.replaceChildren(image);
    slot.style.background = 'transparent';
  }, `data:image/jpeg;base64,${avatar.toString('base64')}`);
  await page.evaluate(() => {
    const name = document.querySelector('.header-profile .profile-name');
    if (name?.firstChild) name.firstChild.textContent = 'David González';
    const heading = [...document.querySelectorAll('h1')].find(el => el.textContent === 'Hola, Jesús');
    if (!heading) throw new Error('Dashboard greeting not found');
    heading.textContent = 'Hola, David';
  });
  await page.waitForTimeout(2500);
  // Fictional closed October: weekly cash movements, not cumulative growth.
  // Collections vary; supplier/payroll batches outweigh receipts in week 2.
  // The final bucket contains only October 29–31, so it is intentionally smaller.
  await page.evaluate(() => {
    const weekly = [
      [24800,18400,29600,25900,10300],
      [10200,21800,8600,18900,5300],
    ];
    const month = document.querySelector('.monthly-chart-actions [data-slot="badge"]');
    if (!month) throw new Error('Chart month badge not found');
    month.textContent = 'octubre';
    const ranges = ['1–7 oct.', '8–14 oct.', '15–21 oct.', '22–28 oct.', '29–31 oct.'];
    document.querySelectorAll('.chart-week-label').forEach((label, i) => { label.textContent = ranges[i]; });
  });
  await page.evaluate(renderCashflowArt);
  await page.evaluate(() => {
    const balance = document.querySelector('.balance');
    if (!balance) throw new Error('Balance panel not found');
    const summary = document.createElement('div');
    summary.className = 'portfolio-net-flow';
    summary.innerHTML = '<span>Flujo neto · octubre</span><strong>+47.600,00 <small>USDc</small></strong>';
    balance.append(summary);
  });
  await page.evaluate(renderBalanceArt);
  await page.evaluate(html => {
    const old = document.querySelector('.overview-grid .cards');
    if (!old) throw new Error('Team cards panel missing');
    const template = document.createElement('template');
    template.innerHTML = html;
    const panel = template.content.firstElementChild;
    panel.classList.add('portfolio-operations-card');
    const activeBadge = panel.querySelector('[data-slot="badge"]');
    const monthBadge = document.querySelector('.monthly-chart-actions [data-slot="badge"]');
    if (!activeBadge || !monthBadge) throw new Error('Status or month badge missing');
    activeBadge.className = monthBadge.className;
    activeBadge.style.cssText = monthBadge.style.cssText;
    panel.querySelector('.row-between strong').textContent = '3.250,00 USDc';
    const meter = panel.querySelector('[role="progressbar"]');
    meter.setAttribute('aria-valuenow', '65');
    meter.setAttribute('aria-valuetext', '3.250,00 de 5.000,00 USDc · 65%');
    meter.firstElementChild.style.width = '65%';
    panel.querySelector('.animated-meter').setAttribute('aria-label', 'Uso del límite de Operaciones: 3.250,00 de 5.000,00 USDc · 65%');
    old.replaceWith(panel);
  }, operationsHTML);
  await page.mouse.move(1590, 890);
  await page.waitForTimeout(1200);
  if (process.env.PREVIEW_ONLY === '1') {
    const html = await page.evaluate(async () => {
      const clone = document.documentElement.cloneNode(true);
      clone.querySelectorAll('script, nextjs-portal, link[rel="modulepreload"], link[as="script"]').forEach(el => el.remove());
      let css = [...document.styleSheets].map(sheet => [...sheet.cssRules].map(rule => rule.cssText).join('\n')).join('\n');
      const fontResponse = await fetch('/fonts/geist-latin.woff2');
      if (!fontResponse.ok) throw new Error('Unable to embed Geist font');
      const fontBytes = new Uint8Array(await fontResponse.arrayBuffer());
      const fontData = 'data:font/woff2;base64,' + btoa(Array.from(fontBytes, byte => String.fromCharCode(byte)).join(''));
      css = css.replaceAll('/fonts/geist-latin.woff2', fontData);
      clone.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => el.remove());
      const style = document.createElement('style');
      style.textContent = css;
      clone.querySelector('head').append(style);
      const base = document.createElement('base');
      base.href = location.origin + '/';
      clone.querySelector('head').prepend(base);
      clone.querySelector('title').textContent = 'Kontigo · Portfolio preview';
      return '<!doctype html>' + clone.outerHTML;
    });
    await mkdir('/tmp/kontigo-portfolio-preview', { recursive: true });
    await writeFile('/tmp/kontigo-portfolio-preview/index.html', html);
    console.log('Portfolio HTML preview ready; screenshot not regenerated.');
  } else {
  const buffer = await page.screenshot();
  await sharp(buffer).webp({ quality: 95 }).toFile(new URL('../public/work/kontigo/screens/business-home-dark-operations-spacing-6k.webp', import.meta.url).pathname);
  await sharp(buffer).resize(1200).toFile('/tmp/kontigo-business-preview.png');
  }
} finally { await browser.close(); }
