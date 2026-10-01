const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const {createRequire}=require('node:module');
const {createHash}=require('node:crypto');
const {chromium}=createRequire(path.join(process.env.LOCALAPPDATA,'MohaDev/browser-tests/package.json'))('playwright');
(async()=>{
 const dist=path.resolve('frontend/dist');
 const html=await fs.readFile(path.join(dist,'index.html'),'utf8');
 assert.ok(html.includes('src="/runtime-config.js"'));
 const hashes=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].filter(m=>m[1].trim()).map(m=>"'sha256-"+createHash('sha256').update(m[1]).digest('base64')+"'");
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
  const page=await browser.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.hostname==='moha.gov.vn') {
    const relative=(url.pathname==='/'||url.pathname==='/tra-cuu-hoi-quy')?'index.html':url.pathname.slice(1);
    const file=path.resolve(dist,relative); if(!file.startsWith(dist+path.sep)) return route.abort();
    try { let body=await fs.readFile(file); if(relative==='runtime-config.js') body=Buffer.from(body.toString().replace('http://mohaapi.tefli.vn/api/Public/','https://api-portal.moha.gov.vn/api/Public/').replace('http://moha.tefli.vn/','https://moha.gov.vn/')); return route.fulfill({body,contentType:relative.endsWith('.js')?'application/javascript':relative.endsWith('.html')?'text/html':relative.endsWith('.css')?'text/css':'application/octet-stream',headers:{'Content-Security-Policy':"default-src 'self' data:; script-src 'self' "+hashes.join(' ')+" https://f-emc.ngsp.gov.vn https://www.google.com https://www.gstatic.com https://www.googletagmanager.com; connect-src 'self' https:;"}}); } catch { return route.fulfill({status:404,body:''}); }
   }
   const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
   if(url.pathname.endsWith('/HoiQuy/Captcha')) return route.fulfill({contentType:'application/json',body:JSON.stringify({Token:'mock',Image:'data:image/png;base64,'+png.toString('base64')}),headers:{'Access-Control-Allow-Origin':'*'}});
   if(url.pathname.endsWith('/HoiQuy/Search')) return route.fulfill({contentType:'application/json',body:JSON.stringify({Rows:[{ID:1,Name:'Quỹ test logo',Type:'Quỹ',HasLogo:true}],Total:1,Page:1,PageSize:10}),headers:{'Access-Control-Allow-Origin':'*'}});
   if(url.pathname.endsWith('/HoiQuy/Logo/1')) return route.fulfill({contentType:'image/png',body:png,headers:{'Access-Control-Allow-Origin':'*'}});
   if(url.pathname.endsWith('.js')||url.hostname==='www.googletagmanager.com') return route.fulfill({contentType:'application/javascript',body:''});
   return route.fulfill({contentType:'application/json',body:'[]',headers:{'Access-Control-Allow-Origin':'*'}});
  });
  await page.goto('https://moha.gov.vn/');
  await page.waitForFunction(()=>window.env?.VITE_GA_MEASUREMENT_ID==='G-R36X6C2E0S' && document.getElementById('moha-google-analytics'));
  assert.ok(!errors.some(e=>e.includes('VITE_API_URL')||e.includes('window.env')));
  await page.goto('https://moha.gov.vn/tra-cuu-hoi-quy');
  await page.getByPlaceholder('Tên tổ chức').fill('Quỹ test');
  await page.getByPlaceholder('Mã xác nhận').fill('ABC23');
  await page.getByRole('button',{name:'⌕ Tra cứu',exact:true}).click();
  await page.getByRole('button',{name:'Chi tiết',exact:true}).click();
  await page.waitForFunction(()=>{const img=document.querySelector('.hq-logo');return img?.complete && img.naturalWidth>0 && img.src.startsWith('data:image/png');});
  console.log('PASS logo renders in detail modal via data: with API image origin blocked by img-src.');
  console.log('PASS production portal with CSP: external runtime config loads before bundle and GA initializes; external requests mocked.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
