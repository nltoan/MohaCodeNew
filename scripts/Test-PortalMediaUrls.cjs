const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const ts=require(path.resolve('frontend/node_modules/typescript'));
const code=ts.transpileModule(fs.readFileSync('frontend/src/utils/image.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
for(const base of ['https://moha.gov.vn','https://moha.gov.vn/']) {
 const context={exports:{},window:{env:{VITE_MEDIA_URL:base}},URL};vm.runInNewContext(code,context);
 for(const helper of ['getUrlImage','getUrlPdfFile']) {
  assert.equal(context.exports[helper]('/Upload/logo.png'),'https://moha.gov.vn/Upload/logo.png');
  assert.equal(context.exports[helper]('Upload/logo.png'),'https://moha.gov.vn/Upload/logo.png');
  assert.equal(context.exports[helper]('https://files.example.test/logo.png'),'https://files.example.test/logo.png');
 }
 assert.equal(context.exports.getUrlImage('data:image/png;base64,AA'),'data:image/png;base64,AA');
}
console.log('PASS media URLs: relative/absolute, base with/without trailing slash, image data URL.');
