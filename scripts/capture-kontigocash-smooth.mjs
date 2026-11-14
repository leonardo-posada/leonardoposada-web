import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const frames='/tmp/kontigocash-smooth-frames';
await mkdir(frames,{recursive:true});
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  await page.goto(process.env.KONTIGO_WEBSITE_URL || 'http://localhost:5173');
  await page.locator('main[data-intro="done"]').waitFor({timeout:90000});
  await page.addStyleTag({content:'nextjs-portal{display:none!important}'});
  await page.getByRole('button',{name:'Depositar',exact:true}).click();
  await page.locator('[data-money-journey]').waitFor({timeout:60000});
  await page.waitForTimeout(4000);
  const total=480;
  for(let i=0;i<total;i++) {
    await page.evaluate(({i,total})=>{
      const el=document.querySelector('[data-money-journey]');
      const t=i/(total-1);
      // Gentle acceleration/deceleration, with equal spatial steps in the middle.
      const ramp=.08;
      const progress=t<ramp?t*t/(2*ramp)/(1-ramp):t>1-ramp?1-(1-t)*(1-t)/(2*ramp)/(1-ramp):(t-ramp/2)/(1-ramp);
      el.scrollTop=(el.scrollHeight-el.clientHeight)*progress;
    },{i,total});
    await page.waitForTimeout(30);
    await page.screenshot({type:'jpeg',quality:90,path:`${frames}/${String(i).padStart(4,'0')}.jpg`});
    if(i%60===0)console.log(`Frames ${i}/${total}`);
  }
  console.log('Footer',await page.locator('[data-money-journey]').evaluate(el=>({scroll:el.scrollTop,max:el.scrollHeight-el.clientHeight})));
} finally {await browser.close();}
// Uniformly sampled frames avoid browser recording stalls. Interpolate for 60fps playback.
execFileSync('ffmpeg',['-y','-v','error','-framerate','20','-i',`${frames}/%04d.jpg`,'-vf','tpad=start_duration=1:start_mode=clone:stop_duration=2:stop_mode=clone,minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart','public/work/kontigo/screens/website-kontigocash-scroll-loop.mp4'],{stdio:'inherit'});
console.log('Smooth loop exported');
