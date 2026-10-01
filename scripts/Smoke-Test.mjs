import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolRoot = path.join(process.env.LOCALAPPDATA, 'MohaDev');
const require = createRequire(path.join(toolRoot, 'browser-tests', 'package.json'));
const { chromium } = require('playwright');
const results = [];
const record = (name, details = {}) => {
  results.push({ name, status: 'passed', ...details });
  console.log(`PASS ${name}`);
};
const output = path.join(root, '.dev', 'test-results');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
try {
  const menu = await fetch('http://localhost:55104/api/Public/Menu?lang=vi');
  assert.equal(menu.status, 200);
  const menuData = await menu.json();
  assert.ok(menuData && typeof menuData === 'object');
  record('API public menu returns JSON from local database');

  const deniedLogin = await fetch('http://localhost:55104/api/Token?type=password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'password', username: '__moha_smoke_nonexistent__', password: 'invalid' }),
  });
  assert.equal(deniedLogin.status, 400);
  assert.equal((await deniedLogin.json()).error, 'invalid_grant');
  record('API rejects invalid login');

  const portal = await browser.newPage();
  const portalErrors = [];
  portal.on('pageerror', error => portalErrors.push(error.message));
  const localMenuResponse = portal.waitForResponse(response =>
    response.url().startsWith('http://localhost:55104/api/Public/menu') && response.status() === 200,
    { timeout: 90000 });
  await portal.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await localMenuResponse;
  await portal.locator('#root').waitFor({ state: 'visible', timeout: 90000 });
  assert.ok((await portal.locator('#root').innerText()).length > 100, 'Portal must render content');
  assert.equal(await portal.evaluate(() => window.env.VITE_API_URL), 'http://localhost:55104/api/Public/');
  assert.deepEqual(portalErrors, [], 'Portal has uncaught JavaScript errors');
  await portal.screenshot({ path: path.join(output, 'portal.png'), fullPage: true });
  record('Portal renders and loads local API data');

  const admin = await browser.newPage();
  const adminErrors = [];
  admin.on('pageerror', error => adminErrors.push(error.message));
  await admin.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded', timeout: 180000 });
  await admin.locator('input[type=password]').waitFor({ state: 'visible', timeout: 180000 });
  assert.ok(admin.url().includes('/Login'), 'Unauthenticated admin must show login');
  assert.equal(await admin.evaluate(() => window.env.REACT_APP_API_URL), 'http://localhost:55104/api');
  await admin.locator('input[type=password]').fill('invalid');
  await admin.locator('input').first().fill('__moha_smoke_nonexistent__');
  const rejection = admin.waitForResponse(response =>
    response.url().startsWith('http://localhost:55104/api/Token') && response.status() === 400);
  await admin.getByRole('button', { name: 'Sign In', exact: true }).click();
  await rejection;
  assert.deepEqual(adminErrors, [], 'Admin has uncaught JavaScript errors');
  await admin.screenshot({ path: path.join(output, 'admin-login.png'), fullPage: true });
  record('Admin login screen renders and rejects invalid credentials through local API');
} catch (error) {
  results.push({ name: 'Smoke test', status: 'failed', error: error.message });
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser.close();
  await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ date: new Date().toISOString(), results }, null, 2));
}
