import { chromium } from 'playwright';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
const base=process.env.KONTIGO_WEBSITE_URL || 'http://localhost:5173';
const out=new URL('../public/work/kontigo/screens/',import.meta.url);
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
  if (!process.env.CAPTURE_VIDEO_ONLY) {
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:4});
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:90000});
  await page.addStyleTag({content:'nextjs-portal{display:none!important}'});
  await page.waitForFunction(()=>Number(document.querySelector('.site-loader-percentage')?.getAttribute('data-value'))>=45,{},{timeout:60000});
  // Freeze this browser session at the assembled logo, never the source app.
  await page.evaluate(()=>{window.requestAnimationFrame=()=>0;});
  await sharp(await page.screenshot({timeout:60000})).webp({quality:95}).toFile(new URL('website-splash-6k.webp',out).pathname);
  await page.close();
  const home=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:4});
  await home.goto(base,{waitUntil:'domcontentloaded',timeout:90000});
  await home.locator('main[data-intro="done"]').waitFor({timeout:90000});
  await home.addStyleTag({content:'nextjs-portal{display:none!important}'});
  await home.evaluate(()=>document.fonts.ready);
  await home.waitForTimeout(2500);
  await sharp(await home.screenshot({timeout:60000})).webp({quality:95}).toFile(new URL('website-home-6k.webp',out).pathname);
  const handY=await home.locator('.hero-wallet').evaluate(el=>el.getBoundingClientRect().top+scrollY+60);
  await home.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),handY);
  await home.waitForTimeout(2500);
  await sharp(await home.screenshot({timeout:60000})).webp({quality:95}).toFile(new URL('website-hand-6k.webp',out).pathname);
  await home.close();
  }
  await mkdir('/tmp/kontigo-website-recording',{recursive:true});
  const context=await browser.newContext({viewport:{width:1600,height:900},deviceScaleFactor:1,recordVideo:{dir:'/tmp/kontigo-website-recording',size:{width:1600,height:900}}});
  const videoPage=await context.newPage();
  await videoPage.goto(base,{waitUntil:'domcontentloaded',timeout:90000});
  await videoPage.locator('main[data-intro="done"]').waitFor({timeout:90000});
  await videoPage.addStyleTag({content:'nextjs-portal{display:none!important}'});
  await videoPage.getByRole('button',{name:'Depositar',exact:true}).click();
  await videoPage.locator('[data-money-journey]').waitFor({timeout:60000});
  await videoPage.waitForTimeout(4000);
  await sharp(await videoPage.screenshot()).webp({quality:95}).toFile(new URL('website-cash-poster.webp',out).pathname);
  const started=Date.now();
  await videoPage.waitForTimeout(1500);
  await videoPage.evaluate(()=>new Promise(resolve=>{
    const el=document.querySelector('[data-money-journey]');
    const begin=performance.now(), duration=32000;
    function tick(now){const p=Math.min(1,(now-begin)/duration);el.scrollTop=(el.scrollHeight-el.clientHeight)*p;if(p<1)requestAnimationFrame(tick);else resolve();}
    requestAnimationFrame(tick);
  }));
  await videoPage.waitForTimeout(3000);
  console.log('Scroll end',await videoPage.locator('[data-money-journey]').evaluate(el=>({scroll:el.scrollTop,max:el.scrollHeight-el.clientHeight})));
  const clipSeconds=(Date.now()-started)/1000;
  await context.close();
  await writeFile('/tmp/kontigo-website-recording/clip.json',JSON.stringify({path:await videoPage.video().path(),clipSeconds}));
  const recording=await videoPage.video().path();
  const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',recording],{encoding:'utf8'}));
  execFileSync('ffmpeg',['-y','-v','error','-ss',String(Math.max(0,duration-clipSeconds)),'-i',recording,'-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',new URL('website-kontigocash-scroll.mp4',out).pathname]);
  console.log('Website captures ready');
} finally {await browser.close();}
