// SharePoint gia lap (chi dung de thu tren may dev; khong phai SharePoint that).
// Mo phong phan REST cua SharePoint 2019/SE ma API can: thu vien tai lieu "VanBan", loc theo Modified, phan trang, tai tep.
// Khong mo phong: NTLM/Kerberos, phan quyen AD, do tre va gioi han tai cua farm.
//
// Chay:  node scripts/sharepoint-mock/server.mjs [--port 55120]
// Tai khoan dich vu sinh ngau nhien o lan chay dau, luu tai .dev/sharepoint-mock/credentials.json (git bo qua).
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const portArg = process.argv.indexOf('--port');
const PORT = portArg > 0 ? Number(process.argv[portArg + 1]) : 55120;
const SITE = '/sites/portal';
const LIST_TITLE = 'VanBan';
const PAGE_SIZE_DEFAULT = 3; // nho de thu phan trang

const credDir = path.join(root, '.dev', 'sharepoint-mock');
const credFile = path.join(credDir, 'credentials.json');
fs.mkdirSync(credDir, { recursive: true });
if (!fs.existsSync(credFile)) {
  const creds = { user: 'svc_portal', password: crypto.randomBytes(18).toString('base64url') };
  fs.writeFileSync(credFile, JSON.stringify(creds, null, 2));
}
const creds = JSON.parse(fs.readFileSync(credFile, 'utf8'));

const seed = JSON.parse(fs.readFileSync(path.join(here, 'seed.json'), 'utf8'));
let items;
function reset() {
  items = seed.map((s, i) => ({
    Id: i + 1,
    UniqueId: crypto.createHash('md5').update('sp-mock-' + (i + 1)).digest('hex'),
    Title: s.title,
    SoKyHieu: s.soKyHieu,
    NgayBanHanh: s.ngayBanHanh,
    NgayCoHieuLuc: s.ngayCoHieuLuc || null,
    NguoiKy: s.nguoiKy,
    ChucDanh: s.chucDanh,
    TrangThai: s.trangThai, // Published | Draft
    FileLeafRef: s.file,
    FileRef: `${SITE}/${LIST_TITLE}/${s.file}`,
    Modified: s.modified,
    Version: 1,
  }));
}
reset();

function pdfFor(item) {
  // PDF toi thieu hop le, chi chua van ban ASCII.
  const text = `${item.SoKyHieu} - mock SharePoint (v${item.Version})`.replace(/[()\\]/g, '');
  const stream = `BT /F1 14 Tf 40 760 Td (${text}) Tj ET`;
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let out = '%PDF-1.4\n';
  const offsets = [];
  objs.forEach((o, i) => { offsets.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offsets.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('');
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, 'latin1');
}

function authorized(req) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Basic ')) return false;
  const [u, ...p] = Buffer.from(h.slice(6), 'base64').toString('utf8').split(':');
  const given = Buffer.from(p.join(':'));
  const want = Buffer.from(creds.password);
  return u === creds.user && given.length === want.length && crypto.timingSafeEqual(given, want);
}

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json;odata=nometadata;charset=utf-8', 'Content-Length': Buffer.byteLength(data) });
  res.end(data);
}

function spError(res, status, message) {
  sendJson(res, status, { 'odata.error': { code: `-1, Microsoft.SharePoint.SPException`, message: { lang: 'en-US', value: message } } });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = decodeURIComponent(url.pathname);
  const loopback = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);

  // Dieu khien cho thu nghiem (chi tu may nay).
  if (p.startsWith('/__mock/')) {
    if (!loopback) return spError(res, 403, 'Forbidden');
    if (p === '/__mock/reset' && req.method === 'POST') { reset(); return sendJson(res, 200, { ok: true, count: items.length }); }
    const m = p.match(/^\/__mock\/(touch|publish|unpublish)\/(\d+)$/);
    if (m && req.method === 'POST') {
      const it = items.find((x) => x.Id === Number(m[2]));
      if (!it) return spError(res, 404, 'Item not found');
      if (m[1] === 'touch') { it.Title += ' (cap nhat)'; it.Version += 1; }
      if (m[1] === 'publish') it.TrangThai = 'Published';
      if (m[1] === 'unpublish') it.TrangThai = 'Draft';
      it.Modified = new Date().toISOString();
      return sendJson(res, 200, it);
    }
    return spError(res, 404, 'Unknown control endpoint');
  }

  if (!authorized(req)) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="SharePoint mock"' });
    return res.end();
  }

  if (p === `${SITE}/_api/web` || p === '/_api/web') {
    return sendJson(res, 200, { Title: 'Portal (mock)', ServerRelativeUrl: SITE });
  }

  const listItems = new RegExp(`^(?:${SITE})?/_api/web/lists/getbytitle\\('${LIST_TITLE}'\\)/items$`, 'i');
  if (listItems.test(p)) {
    let rows = items.slice().sort((a, b) => a.Id - b.Id);
    const filter = url.searchParams.get('$filter') || '';
    const fm = filter.match(/^Modified (gt|ge) datetime'([^']+)'$/);
    if (filter && !fm) return spError(res, 400, 'The query is not supported by the mock: ' + filter);
    if (fm) {
      const t = Date.parse(fm[2]);
      rows = rows.filter((r) => (fm[1] === 'gt' ? Date.parse(r.Modified) > t : Date.parse(r.Modified) >= t));
    }
    const top = Math.min(Number(url.searchParams.get('$top')) || PAGE_SIZE_DEFAULT, 100);
    const after = Number(url.searchParams.get('$skiptoken')) || 0; // Id cuoi cua trang truoc
    const page = rows.filter((r) => r.Id > after).slice(0, top + 1);
    const hasMore = page.length > top;
    const data = page.slice(0, top).map((r) => ({ ...r, File_x0020_Size: pdfFor(r).length }));
    const body = { value: data };
    if (hasMore) {
      const next = new URL(url.href);
      next.searchParams.set('$skiptoken', String(data[data.length - 1].Id));
      body['odata.nextLink'] = `${next.protocol}//${next.host}${next.pathname}${next.search}`;
    }
    return sendJson(res, 200, body);
  }

  const fileMatch = p.match(/^(?:\/sites\/portal)?\/_api\/web\/GetFileByServerRelativeUrl\('([^']+)'\)\/\$value$/i);
  if (fileMatch) {
    const ref = fileMatch[1];
    const it = items.find((x) => x.FileRef.toLowerCase() === ref.toLowerCase());
    if (!it) return spError(res, 404, 'File Not Found.');
    const buf = pdfFor(it);
    res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Length': buf.length });
    return res.end(buf);
  }

  return spError(res, 404, 'Resource not found for the segment in the mock: ' + p);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`SharePoint mock: http://127.0.0.1:${PORT}${SITE}  (${items.length} muc, thu vien "${LIST_TITLE}")`);
  console.log(`Tai khoan dich vu: ${credFile}`);
});
