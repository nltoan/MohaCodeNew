const fs=require('node:fs/promises'),path=require('node:path');
const {createRequire}=require('node:module');
const {chromium}=createRequire(path.join(process.env.LOCALAPPDATA,'MohaDev/browser-tests/package.json'))('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}); const results=[];
 try {
  const discover=await browser.newPage();await discover.goto('http://localhost:5175/');await discover.waitForTimeout(3000);
  const links=await discover.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
  const detail=links.find(x=>/^\/tin-tuc\/.+id\d+$/.test(x)); const category=links.find(x=>/^\/chuyen-muc\/.+id\d+$/.test(x));await discover.close();
  const routes=[['home','/'],['news','/tin-tuc'],['category',category||'/chuyen-muc'],['article',detail],['lookup','/tra-cuu-hoi-quy']].filter(x=>x[1]);
  for(const [device,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]) for(const [name,url] of routes){
   const context=await browser.newContext({viewport}); const page=await context.newPage(), errors=[],failed=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});
   await page.addInitScript(()=>{
    window.auditVitals={lcp:0,cls:0}; let first=0,last=0,session=0;
    new PerformanceObserver(list=>{for(const e of list.getEntries())window.auditVitals.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){if(e.startTime-last>1000||e.startTime-first>5000){first=e.startTime;session=0;}last=e.startTime;session+=e.value;window.auditVitals.cls=Math.max(window.auditVitals.cls,session);}}).observe({type:'layout-shift',buffered:true});
   });
   const response=await page.goto('http://localhost:5175'+url);await page.waitForTimeout(5000);
   const data=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.content||'',canonical:document.querySelector('link[rel="canonical"]')?.href||'',h1:document.querySelectorAll('h1').length,mainText:document.querySelector('main')?.innerText.length||0,vitals:window.auditVitals,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime||0,belowFoldMounted:document.querySelectorAll('.mh-deferred-section section').length,js:performance.getEntriesByType('resource').filter(r=>r.name.includes('/assets/')&&r.name.split('?')[0].endsWith('.js')).map(r=>({url:r.name,bytes:r.transferSize}))}));
   results.push({device,name,url,status:response.status(),...data,errors,failed});console.log(JSON.stringify(results.at(-1)));
   await context.close();
  }
 }finally{await browser.close();}
 await fs.writeFile('.dev/portal-audit.json',JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
