const path=require('node:path'),assert=require('node:assert/strict');
const {createRequire}=require('node:module');
const {chromium}=createRequire(path.join(process.env.LOCALAPPDATA,'MohaDev/browser-tests/package.json'))('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.addInitScript(()=>localStorage.setItem('i18nextLng','vi'));
  await page.goto('http://localhost:5175/gioi-thieu');await page.waitForURL('**/gioi-thieu/chuc-nang-nhiem-vu/**');await page.locator('main h1').waitFor();
  assert.ok((await page.locator('main').innerText()).length>150);
  await page.goto('http://localhost:5175/gioi-thieu/lich-su-bo/---id13036');await page.getByRole('link',{name:'Tải về',exact:true}).first().waitFor();
  const download=await page.getByRole('link',{name:'Tải về',exact:true}).first().boundingBox();assert.ok(download.x+download.width<=390,'History download link must fit mobile viewport');
  await page.screenshot({path:'.dev/history-mobile-sections.png',fullPage:true});
  await page.goto('http://localhost:5175/van-ban');await page.waitForURL('**/van-ban/van-ban-chi-dao/**');await page.locator('.mh-document-filter').waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Document mobile overflow');
  await page.getByRole('button',{name:'Tìm kiếm nâng cao',exact:true}).click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Advanced filter mobile overflow');
  await page.screenshot({path:'.dev/documents-mobile-sections.png',fullPage:true});
  const lookupRequests=()=>requests.filter(x=>/\/LinhVuc|\/VanBans_GetLookUp|\/CoQuanBanHanh|\/HinhThucVanBan/.test(x)).length;
  const lookups=lookupRequests();
  await page.locator('main .pagination').getByText('2',{exact:true}).click();await page.locator('.mh-document-filter').waitFor();
  await page.waitForFunction(()=>document.querySelector('main .pagination .active')?.textContent.includes('2'));
  assert.equal(lookupRequests(),lookups,'Document lookups must not reload on page change');
  await page.goto('http://localhost:5175/khong-ton-tai');await page.getByRole('heading',{name:'Không tìm thấy trang'}).waitFor();assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, follow');await page.getByRole('link',{name:'Về trang chủ'}).click();await page.waitForURL('http://localhost:5175/');
  // Controlled responses verify encoding, page reset, empty/error and stale-request behavior.
  await page.route('**/api/Public/Search?**',async route=>{
   const url=new URL(route.request().url()),keyword=url.searchParams.get('keyword');
   if(keyword==='lỗi'){await route.fulfill({status:500,json:{}});return;}
   if(keyword==='chậm')await new Promise(resolve=>setTimeout(resolve,700));
   await route.fulfill({json:{data:keyword==='không kết quả'?[]:[{ID:1,TieuDe:keyword,MoTa:'Kết quả thử nghiệm',Type:'tin-tuc',NgayXuatBan:'2026-10-01',AnhDaiDienUrl:''}],totalCount:keyword==='không kết quả'?0:25}});
  });
  await page.goto('http://localhost:5175/tim-kiem');await page.getByText('Nhập từ khóa để tìm kiếm thông tin.').waitFor();assert.equal(requests.filter(x=>x.includes('/Search?')).length,0);
  const input=page.getByRole('searchbox',{name:'Từ khóa tìm kiếm'});
  await input.fill('  nội vụ / 2026 #1?  ');await input.press('Enter');await page.locator('.mh-searchbox-items .mh-searchbox-item-title').waitFor();
  assert.equal(new URL(requests.filter(x=>x.includes('/Search?')).at(-1)).searchParams.get('keyword'),'nội vụ / 2026 #1?');
  assert.ok(!page.url().includes('khong-ton-tai'));await page.locator('main .pagination').getByText('2',{exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.pagination .active')?.textContent.includes('2'));
  await input.fill('mới');await input.press('Enter');await page.locator('.mh-searchbox-item-title').filter({hasText:'mới'}).waitFor();assert.equal(new URL(requests.filter(x=>x.includes('/Search?')).at(-1)).searchParams.get('skip'),'0');
  await input.fill('không kết quả');await input.press('Enter');await page.locator('.mh-searchbox-empty').waitFor();assert.equal(await page.locator('.mh-searchbox-empty').count(),1);assert.equal(await page.locator('main .pagination').count(),0);
  await input.fill('lỗi');await input.press('Enter');await page.getByText('Không thể tải kết quả. Vui lòng thử lại sau.').waitFor();
  const failedQueries=requests.filter(x=>new URL(x).searchParams.get('keyword')==='lỗi').length;
  await Promise.all([page.waitForRequest(r=>new URL(r.url()).searchParams.get('keyword')==='lỗi'),input.press('Enter')]);
  await page.getByText('Không thể tải kết quả. Vui lòng thử lại sau.').waitFor();assert.equal(requests.filter(x=>new URL(x).searchParams.get('keyword')==='lỗi').length,failedQueries+1);
  await input.fill('chậm');await Promise.all([page.waitForRequest(r=>new URL(r.url()).searchParams.get('keyword')==='chậm'),input.press('Enter')]);await input.fill('nhanh');await input.press('Enter');await page.locator('.mh-searchbox-item-title').filter({hasText:'nhanh'}).waitFor();await page.waitForTimeout(900);assert.equal(await page.locator('.mh-searchbox-item-title').innerText(),'nhanh');
  await input.fill(' ');await input.press('Enter');await page.getByText('Nhập từ khóa để tìm kiếm thông tin.').waitFor();assert.equal(await page.locator('main .pagination').count(),0);
  assert.deepEqual(errors,[]);console.log('PASS real about/document landing, mobile basic/advanced layout, 404 navigation; controlled search encoding, page reset, empty/error, stale-response guards; no JS errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
