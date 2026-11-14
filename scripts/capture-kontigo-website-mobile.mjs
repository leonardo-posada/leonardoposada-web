import { chromium } from 'playwright';
import sharp from 'sharp';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
  const page=await browser.newPage({viewport:{width:396,height:858},deviceScaleFactor:6,isMobile:true,hasTouch:true});
  await page.goto(process.env.KONTIGO_WEBSITE_URL || 'http://localhost:5173/',{waitUntil:'domcontentloaded'});
  await page.locator('main[data-intro="done"]').waitFor({timeout:90000});
  await page.addStyleTag({content:'nextjs-portal,.announcement-bar{display:none!important}'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(3000);
  // Render complete odometer digits in the still, without mutating React's DOM.
  await page.addStyleTag({content:`
    .reward-odometer[data-value="+3M"] .reward-odo-strip {transform:translate3d(0,-15%,0)!important}
    .reward-odometer[data-value="4.9"] .reward-odo-group:first-child .reward-odo-strip {transform:translate3d(0,-20%,0)!important}
    .reward-odometer[data-value="4.9"] .reward-odo-group:last-child .reward-odo-strip {transform:translate3d(0,-45%,0)!important}
    .reward-cycle-label {animation:none!important;opacity:1!important;transform:none!important}
  `});
  const buffer=await page.screenshot({timeout:60000});
  await sharp(buffer).webp({quality:95}).toFile(new URL('../public/work/kontigo/screens/website-home-mobile-no-banner.webp',import.meta.url).pathname);
  await sharp(buffer).resize(396).toFile('/tmp/website-home-mobile.png');
} finally {await browser.close();}
