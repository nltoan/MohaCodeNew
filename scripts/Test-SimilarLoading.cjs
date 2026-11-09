const assert = require('node:assert/strict');
const path = require('node:path');
const { createRequire } = require('node:module');
const { chromium } = createRequire(path.join(process.env.LOCALAPPDATA, 'MohaDev/browser-tests/package.json'))('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const cases = [
      ['/tin-tuc', /\/(ChuyenMucDetail|PostsByCategory)\?/],
      ['/chuyen-muc/test---id12', /\/(ChuyenMucDetail|PostsByCategory)\?/],
      ['/bo-truong/tin-tuc', /\/(ChuyenMucDetail|PostsByCategory)\?/],
      ['/bo-truong/chuyen-muc/test---id362', /\/(ChuyenMucDetail|PostsByCategory)\?/],
      ['/nghi-quyet-tw4/chuyen-muc/test---id388', /\/(ChuyenMucDetail|PostsByCategory)\?/],
      ['/nghien-cuu-khoa-hoc', /\/NghienCuuKhoaHocs\?/],
      ['/van-ban/du-thao-van-ban', /\/VanBanDuThao\?/],
      ['/van-ban/van-ban-chi-dao/---id104', /\/VanBan\?/],
      ['/van-ban/van-ban-qppl/---id103', /\/VanBan\?/],
    ];
    for (const [route, pattern] of cases) {
      const page = await browser.newPage();
      await page.addInitScript(() => localStorage.setItem('i18nextLng', 'vi'));
      let mode = 'pending', release;
      const gate = new Promise(resolve => { release = resolve; });
      await page.route('**/api/Public/**', async request => {
        if (!pattern.test(request.request().url())) return request.continue();
        if (mode === 'pending') await gate;
        if (mode === 'error') return request.fulfill({ status: 503, body: '{}' });
        const body = request.request().url().includes('ChuyenMucDetail')
          ? { data: { TenChuyenMuc: 'LOADING_TEST_CATEGORY' }, topposts: [], childs: [] }
          : { data: [], totalCount: 0 };
        return request.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
      });
      await page.goto('http://localhost:5175' + route, { waitUntil: 'domcontentloaded' });
      await page.locator('.spinner-border').or(page.getByText('Đang tải...', { exact: true })).first().waitFor({ timeout: 30000 });
      assert.equal(await page.getByText(/Không có dữ liệu/i).count(), 0, route + ' must not show empty before response');
      mode = 'ready'; release();
      await page.getByText(/Không có dữ liệu/i).first().waitFor();
      mode = 'error';
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: 'Thử lại', exact: true }).first().waitFor();
      assert.equal(await page.getByText(/Không có dữ liệu/i).count(), 0, route + ' failure is not empty data');
      mode = 'ready';
      await page.getByRole('button', { name: 'Thử lại', exact: true }).first().click();
      await page.getByText(/Không có dữ liệu/i).first().waitFor();
      console.log('PASS pending/empty/error/retry ' + route);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
