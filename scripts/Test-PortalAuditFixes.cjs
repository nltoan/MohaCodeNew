const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createRequire}=require('node:module');
const {chromium}=createRequire(path.join(process.env.LOCALAPPDATA,'MohaDev/browser-tests/package.json'))('playwright');
const ts=require(path.resolve('frontend/node_modules/typescript'));
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],bad=[];
  await page.addInitScript(()=>localStorage.setItem('i18nextLng','vi'));
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/[?&]ID=null(&|$)/.test(r.url()))bad.push(r.url())});
  for(const route of ['/chuyen-muc','/bo-truong/chuyen-muc','/nghi-quyet-tw4/chuyen-muc','/bo-truong/gioi-thieu-bo-truong',...['chuc-nang-nhiem-vu','lanh-dao-bo','co-cau-to-chuc','lich-su-bo'].map(x=>'/gioi-thieu/'+x)]) {
   await page.goto('http://localhost:5175'+route);
   await page.waitForFunction(route=>location.pathname!==route&&document.querySelector('main h1')?.textContent.trim().length>0,route,{timeout:30000});
   assert.ok(!(await page.locator('main').innerText()).includes('Không tìm thấy trang'));console.log('PASS landing '+route);
  }
  const code=ts.transpileModule(fs.readFileSync('frontend/src/utils/image.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  const html=await page.evaluate(code=>{const exports={};new Function('exports',code)(exports);return exports.resolveContentMedia('<img src="/Media_Share/image.jpg"><a href="Media_Share/doc.pdf">Tải</a><img src="https://other.example/logo.png"><p>Nội dung</p>')},code);
  assert.ok(html.includes('https://moha.gov.vn/Media_Share/image.jpg'));assert.ok(html.includes('https://moha.gov.vn/Media_Share/doc.pdf'));assert.ok(html.includes('https://other.example/logo.png'));assert.ok(html.includes('Nội dung'));
  assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);console.log('PASS article media resolution, no ID=null requests or JS errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
