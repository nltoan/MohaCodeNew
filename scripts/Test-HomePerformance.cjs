const fs=require('node:fs/promises'); const path=require('node:path'); const assert=require('node:assert/strict');
const {createRequire}=require('node:module');
const {chromium}=createRequire(path.join(process.env.LOCALAPPDATA,'MohaDev/browser-tests/package.json'))('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
  for(const [label,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]) {
   const page=await browser.newPage({viewport}); const errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message)); page.on('request',r=>requests.push(r.url()));
  await page.addInitScript(()=>localStorage.setItem('i18nextLng','vi'));
   await page.goto('http://localhost:5175/');
   await page.locator('.mh-home-banner').waitFor();
   const sections=page.locator('.mh-deferred-section'); assert.equal(await sections.count(),4);
   assert.ok(!requests.some(url=>url.includes('HomeRefs-')||url.includes('HomeMedia-')||url.includes('HomeOther-')));
   const initialJs=requests.filter(url=>url.includes('/assets/')&&url.split('?')[0].endsWith('.js'));
   for(let i=0;i<4;i++){await sections.nth(i).scrollIntoViewIfNeeded(); await sections.nth(i).locator('section').waitFor({timeout:60000});}
   await page.screenshot({path:'.dev/home-'+label+'-optimized.png',fullPage:true});
   assert.ok(requests.some(url=>url.includes('HomeMedia-')));
   assert.ok(!requests.some(url=>url.includes('googletagmanager')));
   assert.equal(errors.length,0,errors.join('\n'));
   console.log('Initial scripts '+label+': '+initialJs.map(url=>url.split('/').pop()).join(', '));
   console.log('PASS '+label+': deferred sections load on scroll, no page errors, GA disabled; initial JS chunks='+initialJs.length);
   await page.goto('http://localhost:5175/tra-cuu-hoi-quy');
   await page.getByPlaceholder('Tên tổ chức').waitFor();
   assert.equal(await page.locator('.hq-results').count(),0);
   await page.close();
  }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
