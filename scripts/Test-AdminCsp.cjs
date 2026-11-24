// Kiem tra CSP cua admin: phuc vu backend/build voi dung header trong backend/public/web.config
// (doi URL cho giu staging sang URL dev), dang nhap bang tai khoan test va mo cac trang chinh.
// That bai neu co bat ky vi pham CSP nao. Khong ghi du lieu: cac popup them moi deu dong lai khong luu.
// REACT_APP_UPLOAD_URL tro toi may chu media rieng (cong +1, khac origin API) nhu production; kiem tra them
// iframe video trong HtmlEditor, preview Plyr (icon tu /plyr.svg) va shim CKEditor chi chay thuoc tinh co nonce.
// Chay: node scripts/Test-AdminCsp.cjs (can API 55104 dang chay va da build: cd backend && npm run build)
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { chromium } = createRequire(path.join(process.env.LOCALAPPDATA, 'MohaDev/browser-tests/package.json'))('playwright');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'backend', 'build');
const api = 'http://localhost:55104';
// CORS dev cua API chi cho 5173-5175 (Dev.ps1); goi API qua route() voi Origin 5174 thay vi sua cau hinh API.
const allowedDevOrigin = 'http://localhost:5174';
const port = Number(process.env.ADMIN_CSP_PORT || 5176);
const origin = `http://localhost:${port}`;
// Production: REACT_APP_UPLOAD_URL = MediaUrl, khac origin API. Mo phong bang may chu media rieng (proxy /Upload ve API).
const mediaPort = port + 1;
const mediaOrigin = `http://localhost:${mediaPort}`;
const portalOrigin = 'http://localhost:5173';
// Video gia cho preview Plyr (file that, tra tu may chu media).
const testVideo = '/Upload/csp-test.mp4';

function decodeXml(s) {
  return s.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

// Doc header tu web.config, doi URL cho giu staging giong Prepare-ProductionRelease.ps1
// (mohaapi -> origin API, moha -> "portal media").
function readHeaders() {
  const xml = fs.readFileSync(path.join(root, 'backend', 'public', 'web.config'), 'utf8');
  const headers = {};
  for (const m of xml.matchAll(/<add name="([^"]+)" value="([^"]*)"\s*\/>/g)) headers[m[1]] = decodeXml(m[2]);
  assert.ok(headers['Content-Security-Policy'], 'web.config thieu Content-Security-Policy');
  headers['Content-Security-Policy'] = headers['Content-Security-Policy']
    .replaceAll('http://mohaapi.tefli.vn', api)
    .replaceAll('http://moha.tefli.vn', `${portalOrigin} ${mediaOrigin}`);
  assert.doesNotMatch(headers['Content-Security-Policy'], /tefli\.vn/);
  assert.doesNotMatch(headers['Content-Security-Policy'], /script-src[^;]*'unsafe-inline'/);
  return headers;
}

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject', '.txt': 'text/plain; charset=utf-8', '.map': 'application/json' };

// May chu tinh toi gian: file co thi tra file, khong thi tra index.html (giong rule "React Routes" cua IIS).
function startServer(headers) {
  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, origin).pathname);
    let file = path.normalize(path.join(buildDir, rel));
    if (!file.startsWith(buildDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(buildDir, 'index.html');
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { ...headers, 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    if (rel === '/runtime-config.js') {
      // Media khac origin API nhu production (runtime-config.js dev de chung 55104).
      res.end(fs.readFileSync(file, 'utf8') + `\nwindow.env.REACT_APP_UPLOAD_URL = ${JSON.stringify(mediaOrigin)};\n`);
      return;
    }
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', () => resolve(server)); });
}

function isRootDirContents(url) {
  const u = new URL(url);
  if (!u.pathname.endsWith('/api/FileManager/FileSystem') || u.searchParams.get('command') !== 'GetDirContents') return false;
  try { const a = JSON.parse(u.searchParams.get('arguments') || '{}'); return !a.pathInfo || a.pathInfo.length === 0; } catch { return false; }
}

// May chu media (vai tro MediaUrl): tra video test, con lai chuyen tiep GET ve API (/Upload, /Media_Share...).
function startMediaServer() {
  const server = http.createServer((req, res) => {
    const rel = new URL(req.url, mediaOrigin).pathname;
    if (rel === testVideo) {
      res.writeHead(200, { 'Content-Type': 'video/mp4', 'Cache-Control': 'no-store' });
      fs.createReadStream(path.join(buildDir, 'plyr-blank.mp4')).pipe(res);
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
    const upstream = http.request(api + req.url, { method: req.method, headers: req.headers.range ? { range: req.headers.range } : {} }, up => {
      res.writeHead(up.statusCode, up.headers);
      up.pipe(res);
    });
    upstream.on('error', () => { res.writeHead(502); res.end(); });
    upstream.end();
  });
  return new Promise((resolve, reject) => { server.once('error', reject); server.listen(mediaPort, '127.0.0.1', () => resolve(server)); });
}

(async () => {
  assert.ok(fs.existsSync(path.join(buildDir, 'index.html')), 'Chua build admin (cd backend && npm run build)');
  const builtIndex = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');
  assert.doesNotMatch(builtIndex, /<script(?![^>]*\bsrc=)[^>]*>/i, 'index.html con script inline');
  assert.doesNotMatch(builtIndex, /\son[a-z]+=/i, 'index.html con inline event handler');
  const headers = readHeaders();
  const account = JSON.parse(fs.readFileSync(path.join(root, '.dev/hoi-test-accounts.json'), 'utf8').replace(/^\uFEFF/, ''))[0];
  const response = await fetch(`${api}/api/Token?type=password`, {
    method: 'POST', body: new URLSearchParams({ grant_type: 'password', username: account.name, password: account.password })
  });
  assert.equal(response.status, 200, 'Dang nhap API that bai');
  const token = (await response.json()).access_token;
  const profile = await fetch(`${api}/api/User_Account/GetLoginUser`, { headers: { Authorization: 'Bearer ' + token } });
  const user = (await profile.json()).data[0];
  assert.ok(user);

  assert.ok(fs.existsSync(path.join(buildDir, 'plyr.svg')) && fs.existsSync(path.join(buildDir, 'plyr-blank.mp4')), 'Thieu plyr.svg/plyr-blank.mp4 trong build');
  const server = await startServer(headers);
  const mediaServer = await startMediaServer();
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const violations = [];
  const pageErrors = [];
  const cdnRequests = [];
  let current = '';
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    // Proxy API: giu nguyen URL (CSP van kiem tra origin 55104), chi doi Origin de qua CORS dev.
    await context.route(`${api}/**`, async route => {
      const req = route.request();
      const cors = { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'Authorization,Content-Type,Accept', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', Vary: 'Origin' };
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
      const reqHeaders = { ...req.headers() };
      if (reqHeaders.origin) reqHeaders.origin = allowedDevOrigin;
      try {
        const res = await route.fetch({ headers: reqHeaders, maxRedirects: 0 });
        const resHeaders = { ...res.headers() };
        delete resHeaders['access-control-allow-origin'];
        const outHeaders = reqHeaders.origin ? { ...resHeaders, ...cors } : resHeaders;
        // Them mot video (tren may chu media) vao thu muc goc cua File Manager de mo preview Plyr.
        if (isRootDirContents(req.url())) {
          const body = await res.json();
          if (body && Array.isArray(body.result)) {
            body.result.unshift({ url: mediaOrigin + testVideo, key: 'csp-test.mp4', name: 'csp-test.mp4', dateModified: new Date().toISOString(), isDirectory: false, size: 991, hasSubDirectories: false });
            delete outHeaders['content-length'];
            return route.fulfill({ status: res.status(), headers: outHeaders, body: JSON.stringify(body) });
          }
        }
        await route.fulfill({ response: res, headers: outHeaders });
      } catch (e) { await route.abort().catch(() => {}); }
    });
    await context.addInitScript(({ token, user }) => {
      if (location.origin.startsWith('http://localhost:')) {
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      // Editor CKEditor dang dung: san sang va iframe con gan vao trang (popup render lai co the de editor cu mo coi).
      window.__cspEditor = () => window.CKEDITOR && Object.values(window.CKEDITOR.instances).filter(e => {
        try { return e.status === 'ready' && e.container && e.container.$.isConnected && e.document && e.document.getWindow().$; } catch { return false; }
      }).pop();
      document.addEventListener('securitypolicyviolation', e => {
        console.error(`[csp-violation] ${e.effectiveDirective} blocked=${e.blockedURI} source=${e.sourceFile}:${e.lineNumber} sample=${e.sample}`);
      }, true);
    }, { token, user });
    const page = await context.newPage();
    page.on('console', msg => {
      const text = msg.text();
      if (/\[csp-violation\]|Content Security Policy|Refused to (load|execute|apply|connect|frame|evaluate|create)/i.test(text)) violations.push(`${current}: ${text}`);
    });
    page.on('request', req => { if (/cdn\.plyr\.io/i.test(req.url())) cdnRequests.push(`${current}: ${req.url()}`); });
    page.on('pageerror', error => pageErrors.push(`${current}: ${error.message} @ ${(error.stack || '').split('\n')[1] || ''}`.trim()));

    async function visit(route, ready) {
      current = route;
      await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
      // Phan tu dau tien hien thi (popup canh bao phien dang an nam o dau #root).
      await page.locator('#root *:visible').first().waitFor({ timeout: 60000 });
      assert.ok(!page.url().includes('/Login'), `${route}: bi chuyen ve trang dang nhap`);
      if (ready) await ready();
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(1000);
      console.log(`visited ${route}`);
    }
    const grid = () => page.locator('.dx-datagrid-rowsview, .dx-treelist-rowsview').first().waitFor({ timeout: 60000 });
    async function closePopups() {
      for (let i = 0; i < 3; i++) {
        const cancel = page.locator('.dx-popup-wrapper .dx-toolbar .dx-button[aria-label="Cancel"], .dx-popup-wrapper .dx-closebutton').last();
        if (await cancel.count() && await cancel.isVisible()) await cancel.click().catch(() => {});
        else await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    }

    await visit('/', () => page.locator('.main-sidebar, .content-wrapper').first().waitFor({ timeout: 60000 }));
    assert.equal(await page.evaluate(() => window.env && window.env.REACT_APP_API_URL), `${api}/api`, 'runtime-config.js khong tro ve API dev');
    assert.equal(await page.evaluate(() => window.env.REACT_APP_UPLOAD_URL), mediaOrigin, 'REACT_APP_UPLOAD_URL chua doi sang may chu media');

    await visit('/News/TinTucAll', async () => {
      await grid();
      // Mo trinh soan thao tin (CKEditor 4), thu thanh cong cu va combo (panel iframe), roi huy khong luu.
      await page.locator('.dx-datagrid-addrow-button').first().click();
      await page.waitForFunction(() => window.CKEDITOR && window.__cspEditor(), null, { timeout: 60000 });
      // Popup co the render lai va tao editor moi: doi on dinh roi lay editor con gan vao trang.
      await page.waitForTimeout(1500);
      await page.waitForFunction(() => window.__cspEditor(), null, { timeout: 30000 });
      const editorFrame = page.frameLocator('iframe.cke_wysiwyg_frame').first();
      // Go phim truc tiep de mat ky tu (popup render lai khi doi gia tri, ke ca khi khong co CSP) nen dat noi dung qua API.
      await page.evaluate(() => new Promise(resolve => window.__cspEditor().setData('<p>CSP test</p>', { callback: resolve })));
      await editorFrame.locator('body p').click();
      // Nut toolbar (inline onclick cua CKEditor) phai con hoat dong.
      await page.locator('.cke_button__bold').first().click();
      await page.locator('.cke_button__bold.cke_button_on').first().waitFor({ timeout: 10000 });
      await page.locator('.cke_combo__format .cke_combo_button').first().click();
      const panel = page.frameLocator('iframe.cke_panel_frame').first();
      await panel.locator('.cke_panel_listItem a').first().waitFor({ timeout: 10000 });
      await panel.locator('.cke_panel_listItem a').nth(1).click();
      await page.waitForTimeout(500);
      const data = await page.evaluate(() => window.__cspEditor().getData());
      assert.match(data, /<h1>[^<]*CSP test/, 'Chon dinh dang tu panel CKEditor khong co tac dung: ' + data);
      await page.locator('.cke_button__image').first().click();
      // Lan dau CKEditor tai dialogs/image.js nen co the cham.
      await page.locator('.cke_dialog').first().waitFor({ timeout: 45000 });
      await page.locator('.cke_dialog_ui_button_cancel').first().click();
      console.log('  CKEditor ready, toolbar/combo/dialog OK');

      // Shim chi chay thuoc tinh do chinh no ghi (nonce ngau nhien); data-cke-csp-* co san trong HTML bi bo qua.
      const gadget = await page.evaluate(() => {
        let hits = 0;
        const ref = window.CKEDITOR.tools.addFunction(() => { hits++; });
        const box = document.createElement('div');
        document.body.appendChild(box);
        box.innerHTML = `<button id="g1" data-cke-csp-onclick="CKEDITOR.tools.callFunction(${ref})">a</button>`
          + `<button id="g2" data-cke-csp-0-onclick="CKEDITOR.tools.callFunction(${ref})">b</button>`;
        box.querySelector('#g1').click(); box.querySelector('#g2').click();
        const forged = hits;
        // Doi chung: handler CKEditor that (onclick) van duoc shim doi ten va chay.
        box.innerHTML = `<button id="g3" onclick="CKEDITOR.tools.callFunction(${ref})">c</button>`;
        const g3 = box.querySelector('#g3');
        const names = g3.getAttributeNames();
        g3.click();
        box.remove();
        window.CKEDITOR.tools.removeFunction(ref);
        return { forged, real: hits - forged, names };
      });
      assert.equal(gadget.forged, 0, 'Shim chay thuoc tinh data-cke-csp-* khong do no ghi');
      assert.equal(gadget.real, 1, 'Shim khong chay handler CKEditor hop le');
      assert.ok(gadget.names.some(n => /^data-cke-csp-[0-9a-f]{24}-onclick$/.test(n)), 'Ten thuoc tinh shim khong co nonce: ' + gadget.names.join(','));
      // Du lieu luu (getData) khong duoc chua thuoc tinh cua shim.
      const leak = await page.evaluate(() => new Promise(resolve => {
        const ed = window.__cspEditor();
        ed.setData('<p><a href="#x" onclick="CKEDITOR.tools.callFunction(1)">x</a><span data-cke-csp-onclick="CKEDITOR.tools.callFunction(1)">y</span></p>', {
          callback: () => {
            const body = ed.editable().$;
            // Gia lap thuoc tinh shim lot vao vung soan thao.
            const a = body.ownerDocument.createElement('i');
            a.setAttribute('data-cke-csp-0123456789abcdef01234567-onclick', 'CKEDITOR.tools.callFunction(1)');
            a.textContent = 'z';
            body.querySelector('p').appendChild(a);
            resolve((ed.__ckeCspHooked ? '' : 'NOHOOK ') + ed.getData());
          }
        });
      }));
      assert.doesNotMatch(leak, /data-cke-csp|NOHOOK/i, 'getData() lo thuoc tinh cua shim: ' + leak);
      console.log('  CKEditor shim: nonce + getData sach OK');

      // Bieu do (plugin chart, Chart.js 1.x): noi dung da luu (moi loai) phai ve duoc ma khong can 'unsafe-eval'.
      const saved = ['bar', 'line', 'pie', 'doughnut', 'polar'].map(t =>
        `<div class="chartjs" data-chart="${t}" data-chart-height="200" data-chart-width="300" data-chart-color="RGBA( 0, 0, 255, 1 )" data-chart-value='[{"value":3,"label":"A &lt;b&gt;"},{"value":5,"label":"B"}]'></div>`).join('');
      await page.evaluate(html => new Promise(resolve => window.__cspEditor().setData(html, { callback: resolve })), saved);
      await page.waitForFunction(() => typeof window.Chart !== 'undefined', null, { timeout: 30000 });
      await page.waitForTimeout(1000);
      const charts = await editorFrame.locator('div.chartjs').evaluateAll(divs => divs.map(d => {
        const c = d.querySelector('canvas');
        const px = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        let ink = 0; for (let i = 3; i < px.length; i += 4) if (px[i]) ink++;
        const legend = d.querySelector('.chartjs-legend');
        return { type: d.getAttribute('data-chart'), ink, legend: legend.querySelectorAll('li').length, legendHtml: legend.innerHTML };
      }));
      assert.equal(charts.length, 5, 'Khong upcast duoc widget bieu do');
      for (const c of charts) {
        assert.ok(c.ink > 0, `Bieu do ${c.type} khong ve duoc`);
        if (['pie', 'doughnut', 'polar'].includes(c.type)) {
          assert.equal(c.legend, 2, `Bieu do ${c.type} thieu chu giai`);
          assert.ok(c.legendHtml.includes('A &lt;b&gt;'), `Chu giai ${c.type} khong escape nhan: ${c.legendHtml}`);
        }
      }
      // Re chuot qua bieu do de goi tooltipTemplate.
      for (const box of await editorFrame.locator('div.chartjs canvas').all()) {
        const b = await box.boundingBox();
        if (b) for (const fx of [0.25, 0.5, 0.75]) await page.mouse.move(b.x + b.width * fx, b.y + b.height * 0.6);
      }
      // Chen bieu do moi qua dialog cua plugin.
      await page.evaluate(() => new Promise(resolve => window.__cspEditor().setData('<p>chart</p>', { callback: resolve })));
      await editorFrame.locator('body p').click();
      await page.locator('.cke_button__chart').first().click();
      const chartDialog = page.locator('.cke_dialog').filter({ has: page.locator('select') }).last();
      await chartDialog.waitFor({ timeout: 30000 });
      const inputs = chartDialog.locator('input.cke_dialog_ui_input_text');
      // Thu tu o: height, width, roi tung cap value/label.
      await inputs.nth(2).fill('4');
      await inputs.nth(3).fill('X');
      await inputs.nth(4).fill('6');
      await inputs.nth(5).fill('Y');
      await chartDialog.locator('.cke_dialog_ui_button_ok').click();
      await page.waitForTimeout(1000);
      const inserted = await editorFrame.locator('div.chartjs canvas').evaluateAll(cs => cs.map(c => {
        const px = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        let ink = 0; for (let i = 3; i < px.length; i += 4) if (px[i]) ink++;
        return ink;
      }));
      assert.ok(inserted.length === 1 && inserted[0] > 0, 'Chen bieu do moi khong ve duoc');
      console.log('  CKEditor chart (5 loai + chen moi) OK');
      await closePopups();
    });

    await visit('/ListNews/ChuyenMuc', grid);
    await visit('/System/Role', grid);

    await visit('/Template', async () => {
      await grid();
      // Trinh dung trang grapesjs (canvas iframe).
      await page.locator('.dx-datagrid-addrow-button').first().click();
      // HtmlEditor nhung video upload bang iframe tu REACT_APP_UPLOAD_URL (frame-src phai co MediaUrl).
      const content = page.locator('.dx-popup-wrapper .dx-htmleditor-content').first();
      await content.waitFor({ timeout: 60000 });
      await content.click();
      const videoSrc = mediaOrigin + testVideo;
      await content.evaluate((el, src) => {
        const dt = new DataTransfer();
        dt.setData('text/html', `<iframe class="ql-video" frameborder="0" allowfullscreen="true" src="${src}"></iframe>`);
        dt.setData('text/plain', src);
        el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
      }, videoSrc);
      const frame = page.locator(`.dx-popup-wrapper .dx-htmleditor-content iframe[src="${videoSrc}"]`).first();
      await frame.waitFor({ state: 'attached', timeout: 10000 });
      await page.waitForTimeout(1500);
      console.log('  HtmlEditor iframe video tu origin media OK');
      await page.getByText('Mở chương trình edit HTML').first().click();
      await page.locator('iframe.gjs-frame').first().waitFor({ timeout: 60000 });
      await page.waitForTimeout(1500);
      console.log('  grapesjs canvas OK');
      await closePopups();
    });

    await visit('/MediaFileManager', async () => {
      await page.locator('.dx-filemanager').first().waitFor({ timeout: 60000 });
      // Preview video bang Plyr: icon phai lay tu /plyr.svg (cung origin), video tu may chu media.
      const item = page.locator('.dx-filemanager-files-view').getByText('csp-test.mp4', { exact: true }).first();
      await item.waitFor({ timeout: 60000 });
      await item.dblclick();
      await page.locator('.dx-popup-wrapper .plyr .plyr__controls').first().waitFor({ timeout: 30000 });
      await page.waitForFunction(() => {
        const v = document.querySelector('.dx-popup-wrapper .plyr video');
        return v && v.readyState >= 1;
      }, null, { timeout: 30000 });
      await page.waitForTimeout(1000);
      // Chi xet icon dang hien (icon trang thai kia cua nut bat/tat bi an nen bbox = 0).
      const icons = await page.evaluate(() => Array.from(document.querySelectorAll('.dx-popup-wrapper .plyr__controls svg use'))
        .filter(u => u.ownerSVGElement.getClientRects().length > 0)
        .map(u => {
          const b = u.getBBox();
          return { href: u.getAttribute('href') || u.getAttribute('xlink:href'), w: b.width, h: b.height };
        }));
      assert.ok(icons.length >= 3, 'Plyr khong ve nut dieu khien');
      for (const i of icons) {
        assert.match(i.href || '', /^\/plyr\.svg#plyr-/, 'Icon Plyr khong lay tu /plyr.svg: ' + i.href);
        assert.ok(i.w > 0 && i.h > 0, 'Icon Plyr khong hien (sprite chua tai): ' + i.href);
      }
      console.log(`  Plyr preview OK (${icons.length} icon, video tu ${mediaOrigin})`);
      await closePopups();
    });
    await visit('/ABL_AlbumAnh', grid);
    await visit('/ABL_Video', grid);
    await visit('/Profile');

    assert.deepEqual(violations, [], 'Co vi pham CSP');
    assert.deepEqual(cdnRequests, [], 'Con tai tu cdn.plyr.io');
    if (pageErrors.length) console.warn('Loi JS (khong phai CSP):\n' + pageErrors.join('\n'));
    console.log(`PASS admin CSP: khong co vi pham tren ${origin} (policy tu backend/public/web.config)`);
  } finally {
    if (violations.length) console.error('Vi pham CSP:\n' + [...new Set(violations)].join('\n'));
    await browser.close();
    server.close();
    mediaServer.close();
  }
})().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
