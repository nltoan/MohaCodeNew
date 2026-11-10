// Tao fixture cho scripts/Test-SecurityApi.cjs vao .dev/security-fixtures/ (git-ignored).
// Chi dung node:zlib/node:fs, khong them dependency. Chay: node scripts/New-SecurityFixtures.cjs
//  - xxe.xlsx: sheet1.xml co DOCTYPE + thuc the ngoai tro toi duong dan cuc bo KHONG ton tai (vo hai).
//    API phai tu choi (DtdProcessing.Prohibit) va khong doc file nao.
//  - oversized-xml.xlsx: sheet1.xml hop le nhung 33 MiB sau giai nen (> gioi han 32 MiB/part cua HoiQuyExcel).
//    Nen bang deflate nen file chi vai chuc KB.
const fs = require('node:fs'), path = require('node:path'), zlib = require('node:zlib');

const crcTable = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xFFFFFFFF; for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }

// Zip toi thieu: moi entry deflate, thoi gian co dinh de ket qua xac dinh.
function zip(entries) {
  const DOS_TIME = 0, DOS_DATE = (46 << 9) | (1 << 5) | 1; // 2026-01-01
  const locals = [], central = [];
  let offset = 0;
  for (const [name, content] of entries) {
    const nameBuf = Buffer.from(name, 'utf8'), raw = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
    const data = zlib.deflateRawSync(raw, { level: 9 }), crc = crc32(raw);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x0800, 6); lh.writeUInt16LE(8, 8);
    lh.writeUInt16LE(DOS_TIME, 10); lh.writeUInt16LE(DOS_DATE, 12); lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(data.length, 18); lh.writeUInt32LE(raw.length, 22); lh.writeUInt16LE(nameBuf.length, 26); lh.writeUInt16LE(0, 28);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(0x0800, 8); ch.writeUInt16LE(8, 10);
    ch.writeUInt16LE(DOS_TIME, 12); ch.writeUInt16LE(DOS_DATE, 14); ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(data.length, 20); ch.writeUInt32LE(raw.length, 24); ch.writeUInt16LE(nameBuf.length, 28);
    ch.writeUInt32LE(offset, 42);
    locals.push(lh, nameBuf, data); central.push(ch, nameBuf);
    offset += 30 + nameBuf.length + data.length;
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, end]);
}

const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const RNS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const PNS = 'http://schemas.openxmlformats.org/package/2006/relationships';
const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const workbook = head + `<workbook xmlns="${NS}" xmlns:r="${RNS}"><sheets><sheet name="HoiQuyTrungUong" sheetId="1" r:id="rId1"/></sheets></workbook>`;
const workbookRels = head + `<Relationships xmlns="${PNS}"><Relationship Id="rId1" Type="${RNS}/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`;
const contentTypes = head + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>';
const rootRels = head + `<Relationships xmlns="${PNS}"><Relationship Id="rId1" Type="${RNS}/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
const headers = ['STT', 'Logo', 'Tên đơn vị', 'Loại', 'Chủ tịch', 'Địa chỉ', 'Số điện thoại', 'Email', 'Website', 'Tôn chỉ mục đích'];
const cell = (col, row, text) => `<c r="${col}${row}" t="inlineStr"><is><t>${text}</t></is></c>`;
const headerRow = `<row r="3">${headers.map((h, i) => cell('ABCDEFGHIJ'[i], 3, h)).join('')}</row>`;
const dataRow = `<row r="4">${cell('A', 4, '1')}${cell('C', 4, 'Don vi thu')}${cell('D', 4, 'Hội')}</row>`;
const sheetOf = (before, filler) => head + before + `<worksheet xmlns="${NS}">${filler}<sheetData>${headerRow}${dataRow}</sheetData></worksheet>`;
const build = sheet => zip([['[Content_Types].xml', contentTypes], ['_rels/.rels', rootRels], ['xl/workbook.xml', workbook], ['xl/_rels/workbook.xml.rels', workbookRels], ['xl/worksheets/sheet1.xml', sheet]]);

// Duong dan khong ton tai: du API co (sai) giai quyet thuc the, cung khong doc du lieu that.
const xxeDoc = '<!DOCTYPE worksheet [<!ENTITY xxe SYSTEM "file:///moha-security-fixture/does-not-exist.txt">]>\n';
const xxe = build(sheetOf(xxeDoc, '<sheetPr><tabColor rgb="FF000000"/></sheetPr><extLst><ext uri="moha">&xxe;</ext></extLst>'));
const OVER = 33 * 1024 * 1024; // gioi han API: 32 MiB moi part
const oversized = build(sheetOf('', '<!--' + ' '.repeat(OVER) + '-->'));

const dir = path.join(__dirname, '..', '.dev', 'security-fixtures');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'xxe.xlsx'), xxe);
fs.writeFileSync(path.join(dir, 'oversized-xml.xlsx'), oversized);
console.log('Wrote', path.join(dir, 'xxe.xlsx'), xxe.length, 'bytes');
console.log('Wrote', path.join(dir, 'oversized-xml.xlsx'), oversized.length, 'bytes (sheet1.xml uncompressed > 32 MiB)');
