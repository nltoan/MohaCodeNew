// Usage: node scripts/Test-SiteHomeLoading.cjs <minister|nq>   (hoac bien moi truong SITE=minister|nq)
// Kiem tra trang chu chuyen trang (preview 5175): hien "Dang tai", cac khoi hien doc lap, khoi loi co nut thu lai.
const assert = require('node:assert/strict');
const path = require('node:path');
const { createRequire } = require('node:module');
const { chromium } = createRequire(path.join(process.env.LOCALAPPDATA, 'MohaDev/browser-tests/package.json'))('playwright');
const sites = {
  minister: { route: '/bo-truong', failId: '364', fastId: '362', prefix: 'MINISTER', item: '.mh-minister-news-item-title', root: '.mh-minister', label: 'minister activities' },
  nq: { route: '/nghi-quyet-tw4', failId: '392', fastId: '388', prefix: 'NQ_HOME', item: '.mh-nqtw4-news-item-title', root: '.mh-nqtw4', label: 'Đảng bộ news' }
};
const siteName = process.argv[2] || process.env.SITE;
const site = sites[siteName];
if (!site) { console.error('Usage: node scripts/Test-SiteHomeLoading.cjs <' + Object.keys(sites).join('|') + '>'); process.exit(2); }
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('i18nextLng', 'vi'));
    let failSpeech = true;
    await page.route('**/PostsByCategory?*', async route => {
      const id = new URL(route.request().url()).searchParams.get('ID');
      if (id === site.failId && failSpeech) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return route.fulfill({ status: 503, body: '{}' });
      }
      await new Promise(resolve => setTimeout(resolve, 700));
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ data: [{ ID: 15397, TieuDe: id === site.fastId ? site.prefix + '_FAST_ACTIVITY' : site.prefix + '_RECOVERED_' + id, NgayXuatBan: '2026-10-02', MoTa: '', AnhDaiDienUrl: '' }] }) });
    });
    await page.goto('http://localhost:5175' + site.route, { waitUntil: 'domcontentloaded' });
    await page.getByText('Đang tải...', { exact: true }).first().waitFor();
    assert.equal(await page.getByText('Không có dữ liệu', { exact: true }).count(), 0);
    await page.getByText(site.prefix + '_FAST_ACTIVITY', { exact: true }).first().waitFor();
    assert.ok(await page.getByText('Đang tải...', { exact: true }).count() > 0, 'fast section renders while slower section remains pending');
    await page.getByRole('button', { name: 'Thử lại', exact: true }).waitFor();
    failSpeech = false;
    await page.getByRole('button', { name: 'Thử lại', exact: true }).click();
    await page.getByText(site.prefix + '_RECOVERED_' + site.failId, { exact: true }).first().waitFor();
    assert.equal(await page.getByRole('alert').count(), 0);
    console.log('PASS first visit shows loading, fast sections render independently, failed section retries without refresh');
    await page.unroute('**/PostsByCategory?*');
    page.on('response', response => { if (response.url().includes('PostsByCategory')) console.log('API', response.status(), response.url()); });
    page.on('requestfailed', request => { if (request.url().includes('PostsByCategory')) console.log('Failed', request.url(), request.failure()?.errorText); });
    const start = Date.now();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator(site.item).first().waitFor({ timeout: 30000 }).catch(async error => { console.log('Language', await page.evaluate(() => localStorage.getItem('i18nextLng'))); console.log((await page.locator(site.root).innerText()).slice(0, 500)); throw error; });
    console.log('PASS real local ' + site.label + ' visible after ' + (Date.now() - start) + 'ms');
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
