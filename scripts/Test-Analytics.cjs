const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('../frontend/node_modules/typescript');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'frontend/src/services/analytics.ts'), 'utf8');
function run(host, prod, id, twice = false) {
  const scripts = [];
  const window = { location: { hostname: host }, env: { VITE_GA_MEASUREMENT_ID: id } };
  const document = {
    getElementById: id => scripts.find(s => s.id === id),
    createElement: () => ({}),
    head: { appendChild: script => scripts.push(script) },
  };
  const code = ts.transpileModule(source.replace('import.meta.env.PROD', String(prod)), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const context = { window, document, exports: {} };
  vm.runInNewContext(code, context);
  context.exports.initializeGoogleAnalytics();
  if (twice) context.exports.initializeGoogleAnalytics();
  return { window, scripts };
}
const id = 'G-R36X6C2E0S';
for (const host of ['moha.gov.vn', 'www.moha.gov.vn']) {
  const result = run(host, true, id, true);
  assert.equal(result.scripts.length, 1);
  assert.equal(result.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=' + id);
  assert.equal(result.scripts[0].async, true);
  assert.equal(result.window.dataLayer.length, 2);
  assert.equal(result.window.dataLayer[1][0], 'config');
  assert.equal(result.window.dataLayer[1][1], id);
}
for (const args of [
  ['localhost', true, id], ['admin.moha.gov.vn', true, id],
  ['staging.moha.gov.vn', true, id], ['moha.gov.vn', false, id],
  ['moha.gov.vn', true, ''], ['moha.gov.vn', true, 'invalid'],
]) {
  const result = run(...args);
  assert.equal(result.scripts.length, 0);
  assert.equal(result.window.dataLayer, undefined);
}
assert.ok(fs.readFileSync(path.join(root, 'frontend/public/runtime-config.js'), 'utf8').includes(id));
console.log('Analytics checks passed: production hosts, ID, single initialization, local/admin/staging disabled. No requests sent to Google.');
