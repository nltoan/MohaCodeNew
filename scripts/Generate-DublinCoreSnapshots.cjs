// Generates static head metadata for IIS. Run against an explicitly configured
// local preview backed by a suitable read-only/staging data source.
const fs = require('node:fs/promises');
const path = require('node:path');
const { createRequire } = require('node:module');
const { chromium } = createRequire(path.join(process.env.LOCALAPPDATA, 'MohaDev/browser-tests/package.json'))('playwright');

const base = process.env.DC_PREVIEW_URL || 'http://127.0.0.1:5199';
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base)) throw Error('DC_PREVIEW_URL must be a local preview');
const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) throw Error('Usage: node Generate-DublinCoreSnapshots.cjs routes.json NEW_OUTPUT_DIRECTORY');
const templateFile = path.resolve('frontend/dist/index.html');
const allowed = /^\/(?:[a-z0-9-]+\/)*[a-z0-9-]+$/;
const escapeAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

(async () => {
  const routes = JSON.parse(await fs.readFile(input, 'utf8'));
  if (!Array.isArray(routes) || !routes.length || routes.some(r => typeof r !== 'string' || !allowed.test(r) || r.startsWith('/__dc/'))) throw Error('Expected nonempty JSON array of safe, non-root paths');
  if (new Set(routes).size !== routes.length) throw Error('Duplicate routes');
  const template = await fs.readFile(templateFile, 'utf8');
  if (!template.includes('data-portal-dc')) throw Error('Expected a current portal build with static DC metadata');
  const cleanTemplate = template.replace(/^\s*<meta\s+data-portal-dc\b[^>]*\/>\s*$/gm, '');
  if (cleanTemplate.includes('data-portal-dc')) throw Error('Could not safely remove original metadata');
  const target = path.resolve(output);
  await fs.mkdir(target); // Refuse to overwrite a prior release.
  await fs.writeFile(path.join(target, 'index-no-dc.html'), cleanTemplate, 'utf8');
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const results = [];
  try {
    const context = await browser.newContext({ locale: 'vi-VN' });
    await context.addInitScript(() => localStorage.setItem('i18nextLng', 'vi'));
    const generate = async (route) => {
      const page = await context.newPage();
      try {
        const response = await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
        if (!response || !response.ok()) throw Error('Navigation failed');
        await page.waitForTimeout(3000);
        const data = await page.evaluate(() => ({ pathname: location.pathname, title: document.title, tags: [...document.querySelectorAll('meta[name^="DC."]')].map(n => [n.getAttribute('name'), n.content]), text: document.querySelector('main')?.innerText || '' }));
        if (data.pathname !== route) throw Error('Route redirected');
        if (!data.text.trim() || /Không tìm thấy trang|Không tải được nội dung|Đang tải nội dung/.test(data.text)) throw Error('Content unavailable');
        const tags = Object.fromEntries(data.tags);
        if (!tags['DC.Title'] || !tags['DC.Description'] || tags['DC.Identifier'] !== `https://moha.gov.vn${route}`) throw Error('Metadata incomplete or identifier mismatch');
        if (tags['DC.Title'] === 'Cổng thông tin điện tử Bộ Nội vụ') throw Error('Only generic fallback metadata available');
        if (data.tags.length !== Object.keys(tags).length) throw Error('Duplicate metadata');
        const markup = data.tags.map(([name, value]) => `    <meta data-portal-dc name="${escapeAttr(name)}" content="${escapeAttr(value)}" />`).join('\n');
        const html = cleanTemplate.replace('</head>', `${markup}\n  </head>`);
        const directory = path.join(target, '__dc', ...route.slice(1).split('/'));
        await fs.mkdir(directory, { recursive: true });
        await fs.writeFile(path.join(directory, 'index.html'), html, 'utf8');
        results.push({ route, ok: true, hasDate: !!(tags['DC.Date.Issued'] || tags['DC.Date.Created']) });
      } catch (error) { results.push({ route, ok: false, error: error.message }); }
      finally { await page.close(); }
    };
    for (let i = 0; i < routes.length; i += 3) {
      await Promise.all(routes.slice(i, i + 3).map(generate));
      console.log(`Processed ${Math.min(i + 3, routes.length)}/${routes.length}`);
    }
    await context.close();
  } finally { await browser.close(); }
  await fs.writeFile(path.join(target, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), source: base, results }, null, 2));
  console.log(JSON.stringify({ generated: results.filter(x => x.ok).length, failed: results.filter(x => !x.ok).length, missingDate: results.filter(x => x.ok && !x.hasDate).length }));
  if (results.some(x => !x.ok)) process.exitCode = 2;
})().catch(error => { console.error(error); process.exitCode = 1; });
