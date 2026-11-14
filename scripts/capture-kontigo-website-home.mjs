import { chromium } from 'playwright';
import sharp from 'sharp';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:4});
  await page.goto(process.env.KONTIGO_WEBSITE_URL || 'http://localhost:5173/');
  await page.locator('main[data-intro="done"]').waitFor({timeout:90000});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(2500);
  await page.addStyleTag({content:`
    nextjs-portal{display:none!important}
    .reward-odometer[data-value="+3M"] .reward-odo-strip{transform:translate3d(0,-15%,0)!important}
    .reward-odometer[data-value="4.9"] .reward-odo-group:first-child .reward-odo-strip{transform:translate3d(0,-20%,0)!important}
    .reward-odometer[data-value="4.9"] .reward-odo-group:last-child .reward-odo-strip{transform:translate3d(0,-45%,0)!important}
    .reward-cycle-label{animation:none!important;opacity:1!important;transform:none!important}
  `});
  const buffer=await page.screenshot({timeout:60000});
  await sharp(buffer).webp({quality:95}).toFile(new URL('../public/work/kontigo/screens/website-home-still-6k.webp',import.meta.url).pathname);
  await sharp(buffer).resize(1200).toFile('/tmp/website-home-still-review.png');
} finally {await browser.close();}
