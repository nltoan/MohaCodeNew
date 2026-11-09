const fs=require('node:fs/promises'),path=require('node:path');
const {createRequire}=require('node:module');
const {chromium}=createRequire(path.join(process.env.LOCALAPPDATA,'MohaDev/browser-tests/package.json'))('playwright');
const base='http://localhost:5175';
const targeted=process.env.PORTAL_AUDIT_ROUTES ? JSON.parse(process.env.PORTAL_AUDIT_ROUTES) : null;
const output=process.env.PORTAL_AUDIT_OUTPUT || '.dev/portal-full-audit.json';
const routes=targeted || ['/','/trang-chu','/gioi-thieu','/gioi-thieu/lich-su-hinh-thanh-va-phat-trien','/van-ban','/van-ban/du-thao-van-ban','/tin-tuc','/chuyen-muc','/tim-kiem','/tim-kiem/'+encodeURIComponent('nội vụ'),'/tra-cuu-hoi-quy','/nghien-cuu-khoa-hoc','/multimedia','/multimedia/photo','/multimedia/video','/multimedia/audio','/photo','/video','/audio','/du-lieu','/phan-anh-kien-nghi','/khong-ton-tai','/bo-truong','/bo-truong/trang-chu','/bo-truong/gioi-thieu-bo-truong','/bo-truong/tin-tuc','/bo-truong/chuyen-muc','/nghi-quyet-tw4','/nghi-quyet-tw4/trang-chu','/nghi-quyet-tw4/tin-tuc','/nghi-quyet-tw4/chuyen-muc'];
const families=new Map();
function discover(hrefs){if(targeted)return;for(let href of hrefs){if(!href)continue;try{const u=new URL(href,base);if(![new URL(base).host,'moha.gov.vn','www.moha.gov.vn'].includes(u.host))continue;href=u.pathname;}catch{continue;}
 if(!/^\/(gioi-thieu|tin-tuc|thong-bao|chuyen-muc|van-ban|nghien-cuu-khoa-hoc|photo|video|audio|bo-truong|nghi-quyet-tw4)(\/|$)/.test(href)||/\.(pdf|png|jpg|aspx|html)$/i.test(href)||routes.includes(href))continue;
 const family=href.replace(/\/[^/]+---(?:id|oid|btid|nqid|qpid|cdid|tbid)\d+$/, '/detail');
 const count=families.get(family)||0;if(count>=2)continue;families.set(family,count+1);routes.push(href);
}}
(async()=>{
 const menu=await (await fetch('http://localhost:55104/api/Public/Menu?lang=vi')).json();discover(menu.data.map(x=>x.URL));
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];
 try{for(const [device,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
  const context=await browser.newContext({viewport});await context.addInitScript(()=>localStorage.setItem('i18nextLng','vi'));
  for(const route of routes){const page=await context.newPage(),errors=[],failed=[],requestErrors=[],pendingApi=new Set();let status=0,exception='';
   page.on('request',request=>{if(request.url().includes('/api/Public/'))pendingApi.add(request)});page.on('requestfinished',request=>pendingApi.delete(request));page.on('requestfailed',request=>pendingApi.delete(request));
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()})});page.on('requestfailed',r=>{if(r.url().includes('/api/Public/') || !r.failure()?.errorText.includes('ERR_ABORTED'))requestErrors.push({url:r.url(),error:r.failure()?.errorText})});
   let data={};try{const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:30000});status=response?.status();await page.locator('main').waitFor({timeout:20000});await page.waitForTimeout(3000);
    for(let wait=0;pendingApi.size&&wait<40;wait++)await page.waitForTimeout(250);
    data=await page.evaluate(()=>({actualPath:location.pathname,title:document.title,canonical:[...document.querySelectorAll('link[rel="canonical"]')].map(n=>n.href),description:[...document.querySelectorAll('meta[name="description"]')].map(n=>n.content),h1:[...document.querySelectorAll('h1')].map(n=>n.textContent.trim()),text:document.querySelector('main')?.innerText.slice(0,450),overflow:document.documentElement.scrollWidth>innerWidth+1,loading:document.querySelectorAll('.spinner-border,.mh-detail-loading').length,brokenImages:[...document.querySelectorAll('main img')].filter(n=>n.complete&&n.naturalWidth===0&&n.getAttribute('src')).map(n=>n.src),links:[...document.querySelectorAll('a[href]')].map(n=>n.getAttribute('href'))}));
    if(device==='desktop')discover(data.links);delete data.links;
   }catch(e){exception=e.message;}
   const row={device,route,status,...data,errors,failed,requestErrors,exception};results.push(row);console.log(JSON.stringify(row));await fs.writeFile(output,JSON.stringify(results,null,2));await page.close();
  }await context.close();
 }}finally{await browser.close();}
 console.log(JSON.stringify({completed:true,urls:routes.length,runs:results.length}));
})().catch(e=>{console.error(e);process.exitCode=1});
