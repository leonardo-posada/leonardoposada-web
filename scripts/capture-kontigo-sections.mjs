import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:4,colorScheme:'dark',locale:'es-VE'});
  await page.goto(process.env.KONTIGO_CORPORATE_URL || 'http://localhost:3202');
  await page.getByRole('button',{name:'Continuar con Google',exact:true}).click();
  await page.getByRole('heading',{name:'Hola, Jesús',exact:true}).waitFor();
  await page.locator('[data-testid="workspace-curtain"]').waitFor({state:'detached'});
  await page.waitForFunction(()=>document.querySelector('.corporate')?.dataset.theme==='dark');
  await page.addStyleTag({content:'nextjs-portal,.ai-launcher{display:none!important}.header-profile .profile-name small{display:none}.corporate .header-profile .profile-name{font-size:12px;font-weight:400}.header-profile [data-slot="avatar"]{width:28px!important;height:28px!important;min-width:28px}'});
  const avatar=await readFile(new URL('../public/work/kontigo/screens/corporate-avatar.jpg',import.meta.url));
  await page.evaluate(src=>{
    const slot=document.querySelector('.header-profile [data-slot="avatar"]');
    const img=new Image();img.src=src;img.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:inherit';slot.replaceChildren(img);
    const name=document.querySelector('.header-profile .profile-name');name.firstChild.textContent='David González';
  },`data:image/jpeg;base64,${avatar.toString('base64')}`);
  await page.locator('#corporate-navigation').getByRole('button',{name:'Cuentas',exact:true}).click();
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(2500);
  await sharp(await page.screenshot()).webp({quality:95}).toFile(new URL('../public/work/kontigo/screens/corporate-accounts-dark-6k.webp',import.meta.url).pathname);
  await page.evaluate(()=>{location.hash='tati'});
  await page.getByRole('heading',{name:'¿Qué hacemos hoy?',exact:true}).waitFor();
  await page.locator('[data-testid="workspace-curtain"]').waitFor({state:'detached'});
  await page.waitForTimeout(3500);
  await sharp(await page.screenshot()).webp({quality:95}).toFile(new URL('../public/work/kontigo/screens/corporate-ai-home-dark-6k.webp',import.meta.url).pathname);
  await page.screenshot({path:'/tmp/kontigo-ai-screen.png'});
} finally { await browser.close(); }
