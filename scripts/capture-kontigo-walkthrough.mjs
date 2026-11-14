import { chromium } from 'playwright';
import sharp from 'sharp';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport:{width:396,height:858},deviceScaleFactor:6,colorScheme:'dark' });
  const demo=process.env.KONTIGO_DEMO_URL || 'http://127.0.0.1:3220';
  await page.goto(`${demo}/?gallery=true&w=396&h=858&screen=walkthrough&theme=dark`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:'nextjs-portal {display:none!important}'});
  await page.waitForTimeout(7000);
  const buffer=await page.screenshot();
  await sharp(buffer).webp({quality:95}).toFile(new URL('../public/work/kontigo/screens/walkthrough-dark.webp',import.meta.url).pathname);
  await sharp(buffer).resize(396).toFile('/tmp/kontigo-walkthrough-preview.png');
} finally { await browser.close(); }
