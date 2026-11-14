import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:396,height:858},deviceScaleFactor:6});
 await page.goto('http://127.0.0.1:3220/?gallery=true&w=396&h=858&tab=investments&currency=usdc&theme=dark');
 await page.locator('[data-investment-coins][data-ready="true"]').waitFor();
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2000);
 const bounds=await page.locator('[data-investment-coins]').boundingBox();
 await page.addStyleTag({content:'nextjs-portal{display:none!important}[data-investment-coins]{visibility:hidden!important}'});
 await page.screenshot({path:'public/work/kontigo/screens/investments-welcome-interface.png'});
 await writeFile('src/components/kontigo/widgets/investments/welcome-layout.json',JSON.stringify(bounds,null,2)+'\n');
 console.log(bounds);
}finally{await browser.close()}
