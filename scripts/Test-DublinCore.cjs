// Run against the built portal with PORTAL_TEST_URL set to a local preview URL.
const assert = require('node:assert/strict');
const path = require('node:path');
const { createRequire } = require('node:module');
const { chromium } = createRequire(path.join(process.env.LOCALAPPDATA, 'MohaDev/browser-tests/package.json'))('playwright');
const base = process.env.PORTAL_TEST_URL || 'http://127.0.0.1:5199';
if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(base)) throw new Error('Only a local preview may be tested');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage();
    await page.route('**/api/Public/**', async route => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith('/PostDetail')) {
        const id = url.searchParams.get('ID');
        return route.fulfill({ json: { data: { TieuDe: `Bài ${id}`, MoTa: '<p>Mô tả &amp; dữ liệu</p>', TacGia: 'Tác giả', NgayXuatBan: id === '1' ? '2026-10-12T07:30:00' : null, NoiDung: 'Nội dung' } } });
      }
      if (url.pathname.endsWith('/NghienCuuKhoaHocDetail')) {
        return route.fulfill({ json: { data: { TenDeTai: 'Đề tài thử', MoTa: 'Mô tả đề tài', DonViChuTri: 'Đơn vị chủ trì', NgayTao: '2024-02-29T09:00:00' } } });
      }
      return route.fulfill({ json: { data: [], totalCount: 0, childs: [] } });
    });
    const read = () => page.evaluate(() => Object.fromEntries([...document.querySelectorAll('meta[name^="DC."]')].map(node => [node.name, node.content])));
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('meta[data-rh="true"][name="DC.Title"]'));
    let tags = await read();
    for (const name of ['DC.Title', 'DC.Creator', 'DC.Publisher', 'DC.Description', 'DC.Identifier', 'DC.Date.Issued']) assert.ok(tags[name], name);
    await page.goto(`${base}/tin-tuc/bai---id1`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('meta[name="DC.Title"]')?.content === 'Bài 1');
    tags = await read();
    assert.equal(tags['DC.Date.Issued'], '2026-10-12');
    assert.equal(tags['DC.Description'], 'Mô tả & dữ liệu');
    await page.evaluate(() => { history.pushState({}, '', '/tin-tuc/bai---id2'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await page.waitForFunction(() => document.querySelector('meta[name="DC.Title"]')?.content === 'Bài 2');
    tags = await read();
    assert.equal(tags['DC.Date.Issued'], undefined);
    assert.equal(tags['DC.Identifier'], 'https://moha.gov.vn/tin-tuc/bai---id2');
    await page.goto(`${base}/nghien-cuu-khoa-hoc/de-tai---id3`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('meta[name="DC.Title"]')?.content === 'Đề tài thử');
    tags = await read();
    assert.equal(tags['DC.Date.Created'], '2024-02-29');
    assert.equal(tags['DC.Date.Issued'], undefined);
    console.log('Dublin Core: homepage, article navigation and research date passed');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
