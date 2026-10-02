const path=require('node:path');const assert=require('node:assert/strict');const {createRequire}=require('node:module');
const {chromium}=createRequire(path.join(process.env.LOCALAPPDATA,'MohaDev/browser-tests/package.json'))('playwright');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=async()=>{
   const data=await page.evaluate(()=>({canonical:[...document.querySelectorAll('link[rel="canonical"]')].map(n=>n.href),description:[...document.querySelectorAll('meta[name="description"]')].map(n=>n.content),og:document.querySelector('meta[property="og:url"]')?.content,path:location.pathname,title:document.title,h1:document.querySelectorAll('h1').length}));
   assert.deepEqual(data.canonical,['https://moha.gov.vn'+data.path]);assert.equal(data.description.length,1);assert.ok(data.description[0].length>20);assert.equal(data.og,data.canonical[0]);assert.ok(data.title.length>5);assert.equal(data.h1,1);
  };
  await page.addInitScript(()=>localStorage.setItem('i18nextLng','vi'));
  await page.goto('http://localhost:5175/');await page.locator('.mh-home-banner').waitFor();await page.locator('h1').waitFor({state:'attached'});await check();
  // SPA navigation through a real homepage article link, followed by browser Back.
  const article=page.locator('.slick-slide.slick-active:not(.slick-cloned) .mh-home-banner-card-image').first();await article.waitFor();await article.click();
  await page.waitForURL('**/tin-tuc/**');await page.waitForFunction(()=>document.querySelector('.mh-page-header h1')?.textContent.length>0);await check();
  await page.goBack();await page.waitForURL('http://localhost:5175/');await page.locator('.mh-home-banner').waitFor();await check();
  await page.goto('http://localhost:5175/tin-tuc');await page.waitForFunction(()=>document.querySelector('.mh-news-header h1')?.textContent.length>0);await check();
  const menu=page.locator('.mh-document-accordion').first(),content=page.locator('.mh-news-content').first();
  assert.ok((await content.boundingBox()).y<(await menu.boundingBox()).y);
  await page.screenshot({path:'.dev/news-mobile-seo-optimized.png'});
  await page.goto('http://localhost:5175/tra-cuu-hoi-quy');await page.getByPlaceholder('Tên tổ chức').waitFor();await check();
  assert.equal(errors.length,0,errors.join('\n'));console.log('PASS metadata: one absolute canonical, one description, matching og:url; SPA article/back updates; mobile news precedes sidebar; no JS errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
