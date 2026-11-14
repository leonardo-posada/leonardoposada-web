import { chromium } from 'playwright';
import sharp from 'sharp';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader','--disable-gpu']});
try {
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:2});
  await page.goto(process.env.KONTIGO_WEBSITE_URL || 'http://localhost:5173/');
  await page.locator('main[data-intro="done"]').waitFor({timeout:90000});
  await page.addStyleTag({content:'nextjs-portal{display:none!important}'});
  await page.getByRole('button',{name:'Depositar',exact:true}).click();
  await page.locator('[data-money-journey]').waitFor({timeout:60000});
  await page.locator('dialog[data-ready="true"]').waitFor({timeout:60000});
  await page.waitForTimeout(3000);
  await page.locator('[data-money-journey] img').evaluateAll(es=>Promise.all(es.map(e=>e.decode().catch(()=>{}))));
  const target=await page.locator('[data-money-journey]').evaluate(el=>{
    const anchor=el.querySelector('[data-stack-anchor="1"]');
    const card=el.querySelectorAll('[data-stack-card]')[1];
    const top=parseFloat(getComputedStyle(card).top)||0;
    return anchor.getBoundingClientRect().top-el.getBoundingClientRect().top+el.scrollTop-top+100;
  });
  for(let i=1;i<=40;i++) {
    await page.locator('[data-money-journey]').evaluate((el,y)=>{el.scrollTop=y},target*i/40);
    await page.waitForTimeout(60);
  }
  await page.waitForFunction(()=>document.querySelector('[data-flow="Enviar"] [data-replay-stage="summary"]'),{},{timeout:90000});
  await page.waitForTimeout(650);
  const buffer=await page.screenshot({timeout:60000});
  await sharp(buffer).webp({quality:95}).toFile(new URL('../public/work/kontigo/screens/website-kontigocash-send-summary.webp',import.meta.url).pathname);
  await sharp(buffer).resize(1200).toFile('/tmp/cash-send-summary.png');
  console.log('Enviar summary captured');
} finally {await browser.close();}
