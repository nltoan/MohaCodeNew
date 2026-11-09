const assert = require('node:assert/strict');
const path = require('node:path');
const { createRequire } = require('node:module');
const { chromium } = createRequire(path.join(process.env.LOCALAPPDATA, 'MohaDev/browser-tests/package.json'))('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('i18nextLng', 'vi'));
    let failSpeech = true;
    await page.route('**/PostsByCategory?*', async route => {
      const id = new URL(route.request().url()).searchParams.get('ID');
      if (id === '364' && failSpeech) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return route.fulfill({ status: 503, body: '{}' });
      }
      await new Promise(resolve => setTimeout(resolve, 700));
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ data: [{ ID: 15397, TieuDe: id === '362' ? 'MINISTER_FAST_ACTIVITY' : 'MINISTER_RECOVERED_' + id, NgayXuatBan: '2026-10-02', MoTa: '', AnhDaiDienUrl: '' }] }) });
    });
    await page.goto('http://localhost:5175/bo-truong', { waitUntil: 'domcontentloaded' });
    await page.getByText('Đang tải...', { exact: true }).first().waitFor();
    assert.equal(await page.getByText('Không có dữ liệu', { exact: true }).count(), 0);
    await page.getByText('MINISTER_FAST_ACTIVITY', { exact: true }).first().waitFor();
    assert.ok(await page.getByText('Đang tải...', { exact: true }).count() > 0, 'fast section renders while slower section remains pending');
    await page.getByRole('button', { name: 'Thử lại', exact: true }).waitFor();
    failSpeech = false;
    await page.getByRole('button', { name: 'Thử lại', exact: true }).click();
    await page.getByText('MINISTER_RECOVERED_364', { exact: true }).first().waitFor();
    assert.equal(await page.getByRole('alert').count(), 0);
    console.log('PASS first visit shows loading, fast sections render independently, failed section retries without refresh');
    await page.unroute('**/PostsByCategory?*');
    page.on('response', response => { if (response.url().includes('PostsByCategory')) console.log('API', response.status(), response.url()); });
    page.on('requestfailed', request => { if (request.url().includes('PostsByCategory')) console.log('Failed', request.url(), request.failure()?.errorText); });
    const start = Date.now();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('.mh-minister-news-item-title').first().waitFor({ timeout: 30000 }).catch(async error => { console.log('Language', await page.evaluate(() => localStorage.getItem('i18nextLng'))); console.log((await page.locator('.mh-minister').innerText()).slice(0, 500)); throw error; });
    console.log('PASS real local minister activities visible after ' + (Date.now() - start) + 'ms');
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
