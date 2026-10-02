const fs=require('node:fs/promises'),path=require('node:path');
const {createRequire}=require('node:module');
const {chromium}=createRequire(path.join(process.env.LOCALAPPDATA,'MohaDev/browser-tests/package.json'))('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];
 try {
  const discovery=await browser.newPage();await discovery.goto('http://localhost:5175/',{waitUntil:'domcontentloaded'});await discovery.locator('main').waitFor({timeout:60000});await discovery.waitForTimeout(3000);
  const links=await discovery.locator('a[href]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')))]);
  const configured=(await (await fetch('http://localhost:55104/api/Public/menu?lang=vi')).json()).data.map(x=>x.URL);
  const routes=['/gioi-thieu','/van-ban','/van-ban/du-thao-van-ban','/tim-kiem','/tim-kiem/nội vụ','/nghien-cuu-khoa-hoc','/multimedia/photo','/multimedia/video','/multimedia/audio','/du-lieu','/phan-anh-kien-nghi','/khong-ton-tai',...links.concat(configured).filter(x=>/^\/gioi-thieu\/.+|^\/van-ban\/van-ban-qppl\//.test(x))];
  routes.push('/bo-truong','/nghi-quyet-tw4');
  const notification=links.find(x=>/^\/thong-bao\/.+/.test(x));if(notification) routes.push(notification);
  const auditRoutes=[...new Set(routes)];
  await discovery.close();
  for(const [device,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
   const context=await browser.newContext({viewport});await context.addInitScript(()=>localStorage.setItem('i18nextLng','vi'));
   for(const route of auditRoutes){
    const page=await context.newPage(),errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});
    await page.goto('http://localhost:5175'+route,{waitUntil:'domcontentloaded'});await page.locator('main').waitFor({timeout:30000});await page.waitForTimeout(2500);
    const data=await page.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('h1')].map(n=>n.innerText),text:document.querySelector('main')?.innerText.slice(0,700),overflow:document.documentElement.scrollWidth>innerWidth+1,loading:document.querySelectorAll('.spinner-border').length,links:[...document.querySelectorAll('main a[href]')].map(n=>({text:n.innerText.slice(0,70),href:n.getAttribute('href')})).slice(0,20)}));
    results.push({device,route,...data,errors,failed});console.log(JSON.stringify(results.at(-1)));
    if(device==='desktop') for(const prefix of ['/photo/','/video/','/nghien-cuu-khoa-hoc/','/van-ban/du-thao/']) {
     const detail=data.links.find(x=>x.href?.startsWith(prefix));
     if(detail&&!auditRoutes.some(x=>x.startsWith(prefix))) auditRoutes.push(detail.href);
    }
    if(device==='desktop'&&route==='/van-ban') {const detail=data.links.find(x=>/^\/van-ban\/[^/]+---id\d+$/.test(x.href));if(detail&&!auditRoutes.includes(detail.href))auditRoutes.push(detail.href);}
    await page.close();
   }
   await context.close();
  }
 }finally{await browser.close();}
 await fs.writeFile('.dev/portal-sections-audit.json',JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
