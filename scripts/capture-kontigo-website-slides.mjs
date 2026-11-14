import {chromium} from 'playwright';
import sharp from 'sharp';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader','--disable-gpu']});
const scenes=[
 {id:'deposit',button:'Depositar',chapter:0,selector:'[data-flow="Depositar"] [data-slot="numeric-keypad"]'},
 {id:'invest',button:'Explorar Inversiones',chapter:0,selector:'[data-investment-flow="invertir"] button'},
 {id:'mastercard',button:'Explorar KontigoCard',chapter:0,selector:'[data-product-scene="card-virtual"]'},
 {id:'ai-summary',button:'Explorar Kontigo AI',chapter:1,selector:'[data-product-scene="ai-summary"]'},
];
try {for(const scene of scenes.filter(scene=>!process.env.SCENE || scene.id===process.env.SCENE)){
 const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:2});
 await page.goto(process.env.KONTIGO_WEBSITE_URL || 'http://localhost:5173/');
 await page.locator('main[data-intro="done"]').waitFor({timeout:90000});
 await page.addStyleTag({content:'nextjs-portal{display:none!important}'});
 await page.getByRole('button',{name:scene.button,exact:true}).click();
 await page.locator('dialog[data-ready="true"]').waitFor({timeout:60000});
 await page.waitForTimeout(3000);
 await page.locator('[data-money-journey] img').evaluateAll(es=>Promise.all(es.map(e=>e.decode().catch(()=>{}))));
 const target=await page.locator('[data-money-journey]').evaluate((el,index)=>{
   const anchor=el.querySelector(`[data-stack-anchor="${index}"]`),card=el.querySelectorAll('[data-stack-card]')[index];
   return anchor.getBoundingClientRect().top-el.getBoundingClientRect().top+el.scrollTop-(parseFloat(getComputedStyle(card).top)||0)+100;
 },scene.chapter);
 for(let i=1;i<=40;i++){await page.locator('[data-money-journey]').evaluate((el,y)=>{el.scrollTop=y},target*i/40);await page.waitForTimeout(60);}
 await page.locator(scene.selector).first().waitFor({state:'attached',timeout:60000});
 if(scene.id==='deposit') {
   await page.waitForFunction(()=>{
     const flow=document.querySelector('[data-flow="Depositar"]');
     const next=[...flow.querySelectorAll('button')].find(el=>el.textContent?.trim()==='Siguiente');
     return flow.textContent.includes('500') && next && !next.disabled && flow.querySelector('[data-replay-stage="amount"]');
   },{},{timeout:60000});
   // Hold the original replay on its completed amount; keep rendering active.
   await page.evaluate(()=>{
     const timer=window.setTimeout.bind(window);
     window.setTimeout=((fn,delay,...args)=>timer(fn,delay===100?10000:delay,...args));
   });
   await page.waitForTimeout(250);
 } else await page.waitForTimeout(1800);
 const buffer=await page.screenshot({timeout:60000});
 await sharp(buffer).webp({quality:95}).toFile(new URL(`../public/work/kontigo/screens/website-slide-${scene.id}${scene.id==='deposit'?'-500':''}.webp`,import.meta.url).pathname);
 await sharp(buffer).resize(1200).toFile(`/tmp/website-slide-${scene.id}.png`);
 console.log('Captured',scene.id);
 await page.close();
}} finally {await browser.close();}
