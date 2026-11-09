const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { chromium } = createRequire(path.join(process.env.LOCALAPPDATA, 'MohaDev/browser-tests/package.json'))('playwright');

(async () => {
  const account = JSON.parse(fs.readFileSync('.dev/hoi-test-accounts.json', 'utf8').replace(/^\uFEFF/, ''))[0];
  const response = await fetch('http://localhost:55104/api/Token?type=password', {
    method: 'POST', body: new URLSearchParams({ grant_type: 'password', username: account.name, password: account.password })
  });
  assert.equal(response.status, 200);
  const token = (await response.json()).access_token;
  const profile = await fetch('http://localhost:55104/api/User_Account/GetLoginUser', { headers: { Authorization: 'Bearer ' + token } });
  const user = (await profile.json()).data[0];
  assert.ok(user);
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage();
    await page.context().addCookies([{ name: 'access_token', value: token, url: 'http://localhost:5174', sameSite: 'Strict' }]);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(({ token, user }) => {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }, { token, user });
    const html = '<p>ADMIN_SECURITY_SAFE_TEXT</p><img src="/security-missing.png" onerror="window.__SECURITY_XSS=true"><a href="javascript:window.__SECURITY_XSS=true">test</a><script>window.__SECURITY_XSS=true</script>';
    await page.route('**/TinTuc_History/GetCompare?*', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ left: { NoiDung: html }, right: { NoiDung: '<p>Previous content</p>' } }) }));
    await page.goto('http://localhost:5174/DiffPage?ID=1', { waitUntil: 'domcontentloaded' });
    await page.getByText('ADMIN_SECURITY_SAFE_TEXT', { exact: true }).waitFor({ timeout: 60000 });
    assert.deepEqual(await page.evaluate(() => ({ ran: window.__SECURITY_XSS === true, unsafe: document.querySelectorAll('#diffArea [onerror],#diffArea a[href^="javascript:"],#diffArea script').length })), { ran: false, unsafe: 0 });
    assert.deepEqual(errors, []);
    console.log('PASS authenticated admin HTML comparison renders text and blocks XSS; mocked content, no database writes');
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
