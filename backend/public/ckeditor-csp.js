// Cho CKEditor 4 chay duoi CSP script-src 'self' (khong 'unsafe-inline').
// CKEditor 4 sinh HTML co inline handler (onclick="CKEDITOR.tools.callFunction(..)") va <script> inline
// trong iframe soan thao/panel. File nay doi cac handler hop le sang data-cke-csp-<nonce>-on* (truoc khi trinh duyet
// phan tich HTML nen khong bi CSP chan/bao loi), roi goi lai qua addEventListener.
// Chi chap nhan cu phap rat hep cua CKEditor (callFunction/getMouseButton/return false); handler khac giu nguyen
// va van bi CSP chan. Khong dung eval/new Function.
// Nonce ngau nhien moi lan tai trang: thuoc tinh data-cke-csp-* co san trong noi dung CMS khong bao gio duoc chay
// (safe-html.js/sanitizeHtml.ts con xoa han). getData() cua CKEditor cung loc bo cac thuoc tinh nay.
(function () {
  'use strict';
  var PREFIX = (function () {
    var b = new Uint8Array(12), s = '';
    window.crypto.getRandomValues(b);
    for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? '0' : '') + b[i].toString(16);
    return 'data-cke-csp-' + s + '-';
  })();
  var STRIP = /\sdata-cke-csp-[\w-]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?/gi;

  // Khong de thuoc tinh do shim ghi lot vao du lieu luu (getData): toDataFormat uu tien 16 = sau khi ghi chuoi.
  function hookEditors() {
    var ck = window.CKEDITOR;
    if (!ck || ck.__ckeCspHooked || !ck.on) return;
    ck.__ckeCspHooked = true;
    var hook = function (editor) {
      if (!editor || editor.__ckeCspHooked) return;
      editor.__ckeCspHooked = true;
      editor.on('toDataFormat', function (evt) {
        if (typeof evt.data.dataValue === 'string') evt.data.dataValue = evt.data.dataValue.replace(STRIP, '');
      }, null, null, 16);
    };
    for (var k in ck.instances) hook(ck.instances[k]);
    ck.on('instanceCreated', function (e) { hook(e.editor); });
  }
  var TYPES = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'keydown', 'keypress', 'keyup', 'focus', 'blur', 'dragstart', 'contextmenu'];
  var CALLS = { 'CKEDITOR.tools.callFunction': 1, 'window.parent.CKEDITOR.tools.callFunction': 1, 'CKEDITOR.tools.getMouseButton': 1 };
  var VALUES = { 'this': 1, 'event': 1, 'null': 1, 'true': 1, 'false': 1, 'CKEDITOR.MOUSE_BUTTON_LEFT': 1 };
  var TOKEN = /\s*(===|==|&&|[(),;=]|-?\d+(?:\.\d+)?|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)/y;
  var cache = new Map();

  function tokenize(code) {
    var out = [], m;
    TOKEN.lastIndex = 0;
    while (TOKEN.lastIndex < code.length) {
      var start = TOKEN.lastIndex;
      m = TOKEN.exec(code);
      if (!m) { if (/^\s*$/.test(code.slice(start))) break; return null; }
      out.push(m[1]);
    }
    return out;
  }

  // Bien dich handler thanh cay lenh; tra null neu khong dung cu phap CKEditor cho phep.
  function compile(code) {
    if (cache.has(code)) return cache.get(code);
    var result = null;
    try { result = parse(tokenize(code)); } catch (e) { result = null; }
    cache.set(code, result);
    return result;
  }

  function parse(tokens) {
    if (!tokens || !tokens.length) return null;
    var i = 0, stmts = [];
    function peek() { return tokens[i]; }
    function next() { return tokens[i++]; }
    function expect(t) { if (next() !== t) throw new Error('csp-shim'); }
    function isPath(t) { return t && /^[A-Za-z_$]/.test(t); }
    function prim() {
      var t = next();
      if (t === undefined) throw new Error('csp-shim');
      if (/^-?\d/.test(t)) return { t: 'val', v: Number(t) };
      if (t[0] === "'" || t[0] === '"') return { t: 'val', v: t.slice(1, -1).replace(/\\(.)/g, '$1') };
      if (!isPath(t)) throw new Error('csp-shim');
      if (peek() === '(') {
        if (!CALLS[t]) throw new Error('csp-shim');
        next();
        var args = [];
        if (peek() !== ')') { args.push(expr()); while (peek() === ',') { next(); args.push(expr()); } }
        expect(')');
        return { t: 'call', p: t, args: args };
      }
      if (!VALUES[t]) throw new Error('csp-shim');
      return { t: 'ref', p: t };
    }
    function eq() {
      var a = prim();
      if (peek() === '===' || peek() === '==') { next(); return { t: 'eq', a: a, b: prim() }; }
      return a;
    }
    function expr() {
      var a = eq();
      while (peek() === '&&') { next(); a = { t: 'and', a: a, b: eq() }; }
      return a;
    }
    while (i < tokens.length) {
      if (peek() === ';') { next(); continue; }
      if (peek() === 'this.style.cssText' && tokens[i + 1] === '=') {
        // Hack cua CKEditor cho Firefox (onblur): bo qua.
        i += 2; expect('this.style.cssText'); stmts.push({ noop: 1 });
      } else if (peek() === 'return') {
        next(); stmts.push({ ret: 1, e: expr() });
      } else {
        stmts.push({ e: expr() });
      }
      if (i < tokens.length) expect(';');
    }
    return stmts.length ? stmts : null;
  }

  function evaluate(node, el, ev) {
    switch (node.t) {
      case 'val': return node.v;
      case 'and': return evaluate(node.a, el, ev) && evaluate(node.b, el, ev);
      case 'eq': return evaluate(node.a, el, ev) === evaluate(node.b, el, ev);
      case 'ref':
        if (node.p === 'this') return el;
        if (node.p === 'event') return ev;
        if (node.p === 'null') return null;
        if (node.p === 'true') return true;
        if (node.p === 'false') return false;
        return window.CKEDITOR ? window.CKEDITOR.MOUSE_BUTTON_LEFT : undefined;
      case 'call': {
        var ck = window.CKEDITOR;
        if (!ck || !ck.tools) return undefined;
        var args = node.args.map(function (a) { return evaluate(a, el, ev); });
        return node.p === 'CKEDITOR.tools.getMouseButton' ? ck.tools.getMouseButton.apply(ck.tools, args) : ck.tools.callFunction.apply(ck.tools, args);
      }
    }
    return undefined;
  }

  function run(stmts, el, ev) {
    for (var i = 0; i < stmts.length; i++) {
      var s = stmts[i];
      if (s.noop) continue;
      var v = evaluate(s.e, el, ev);
      if (s.ret) return v;
    }
    return undefined;
  }

  function decode(v) {
    return v.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  }

  // Doi on*="..." hop le thanh data-cke-csp-on*="..."; iframe src javascript:void(0) -> about:blank (tuong duong).
  function rewriteHtml(html) {
    if (typeof html !== 'string') return html;
    if (html.indexOf('CKEDITOR') < 0 && html.indexOf('return false') < 0 && html.indexOf('javascript:void(0)') < 0) return html;
    html = html.replace(/(\s)(on[a-z]+)\s*=\s*("([^"]*)"|'([^']*)')/gi, function (m, sp, name, q, v1, v2) {
      return compile(decode(v1 != null ? v1 : v2)) ? sp + PREFIX + name.toLowerCase() + '=' + q : m;
    });
    return html.replace(/(<iframe\b[^>]*\ssrc=)(["'])javascript:void\(0\)\2/gi, '$1$2about:blank$2');
  }

  function onEvent(e) {
    var name = PREFIX + 'on' + e.type;
    var el = e.target;
    if (el && el.nodeType !== 1) el = el.parentElement;
    var bubbles = e.type !== 'focus' && e.type !== 'blur';
    while (el && el.nodeType === 1) {
      var code = el.getAttribute(name);
      if (code !== null) {
        var stmts = compile(code);
        if (stmts && run(stmts, el, e) === false) e.preventDefault();
      }
      if (!bubbles) break;
      el = el.parentElement;
    }
  }

  function listen(doc) {
    // addEventListener cung tham so khong dang ky lap; goi lai sau document.open() (open xoa listener).
    for (var i = 0; i < TYPES.length; i++) doc.addEventListener(TYPES[i], onEvent, true);
  }

  function once(fn) { var done = false; return function () { if (!done) { done = true; fn(); } }; }

  // Script inline CKEditor ghi vao iframe: nhan dang dung mau roi thay bang loi goi truc tiep.
  var ACT = /^\s*var wasLoaded\s*=\s*0;\s*function onload\(\)\s*\{\s*if\s*\(!wasLoaded\)\s*window\.parent\.CKEDITOR\s*&&\s*window\.parent\.CKEDITOR\.tools\.callFunction\((\d+),\s*window\);\s*wasLoaded\s*=\s*1;\s*\}\s*document\.addEventListener\(\s*"DOMContentLoaded",\s*onload,\s*false\s*\);\s*$/;
  var FORM = /^\s*window\.parent\.CKEDITOR\.tools\.callFunction\((\d+)\);\s*window\.onbeforeunload\s*=\s*function\s*\(\)\s*\{\s*window\.parent\.CKEDITOR\.tools\.callFunction\((\d+)\)\s*\}\s*$/;

  function patchRealm(win) {
    try {
      if (!win || win.__ckeCspPatched) return;
      win.__ckeCspPatched = true;
      var EP = win.Element.prototype;
      ['innerHTML', 'outerHTML'].forEach(function (prop) {
        var d = Object.getOwnPropertyDescriptor(EP, prop);
        if (!d || !d.set) return;
        Object.defineProperty(EP, prop, {
          configurable: true, enumerable: d.enumerable, get: d.get,
          set: function (v) { d.set.call(this, rewriteHtml(v)); }
        });
      });
      var insertAdjacentHTML = EP.insertAdjacentHTML;
      EP.insertAdjacentHTML = function (pos, html) { return insertAdjacentHTML.call(this, pos, rewriteHtml(html)); };
      var DP = win.Document.prototype;
      var write = DP.write;
      DP.write = function () {
        var doc = this, view = doc.defaultView, jobs = [];
        hookEditors();
        var html = Array.prototype.join.call(arguments, '');
        html = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, function (m, body) {
          var a = ACT.exec(body), f = FORM.exec(body);
          if (a) jobs.push({ when: 'ready', id: +a[1], win: true });
          else if (f) { jobs.push({ when: 'now', id: +f[1] }); jobs.push({ when: 'beforeunload', id: +f[2] }); }
          else return m;
          return '';
        });
        html = html.replace(/(<body\b[^>]*?)\sonload="\s*(?:\(\s*window\.CKEDITOR\s*\|\|\s*window\.parent\.CKEDITOR\s*\)|window\.parent\.CKEDITOR)\.tools\.callFunction\((\d+)\);?\s*"/i, function (m, pre, id) {
          jobs.push({ when: 'load', id: +id });
          return pre;
        });
        var result = write.call(doc, rewriteHtml(html));
        listen(doc);
        jobs.forEach(function (job) {
          var call = function () { if (window.CKEDITOR) window.CKEDITOR.tools.callFunction(job.id, job.win ? view : undefined); };
          if (job.when === 'now') call();
          else if (job.when === 'beforeunload') view.addEventListener('beforeunload', call);
          else {
            var fire = once(call), evt = job.when === 'ready' ? 'DOMContentLoaded' : 'load';
            (job.when === 'ready' ? doc : view).addEventListener(evt, fire);
            // document.close() do CKEditor goi ngay sau write; du phong neu su kien da qua.
            setTimeout(function () { if (doc.readyState === 'complete' || (job.when === 'ready' && doc.readyState !== 'loading')) fire(); }, 0);
          }
        });
        return result;
      };
    } catch (e) { /* iframe khac origin: bo qua */ }
  }

  // Moi iframe cung origin duoc va truoc khi script dung toi (CKEditor lay document qua contentWindow).
  function hookFrames(win) {
    var FP = win.HTMLIFrameElement.prototype;
    if (Object.prototype.hasOwnProperty.call(FP, '__ckeCspHooked')) return;
    Object.defineProperty(FP, '__ckeCspHooked', { value: true });
    var cw = Object.getOwnPropertyDescriptor(FP, 'contentWindow');
    var cd = Object.getOwnPropertyDescriptor(FP, 'contentDocument');
    function prepare(frame) {
      var w = cw.get.call(frame);
      if (w) { patchRealm(w); try { hookFrames(w); } catch (e) { /* khac origin */ } }
      return w;
    }
    Object.defineProperty(FP, 'contentWindow', { configurable: true, enumerable: cw.enumerable, get: function () { return prepare(this); } });
    Object.defineProperty(FP, 'contentDocument', { configurable: true, enumerable: cd.enumerable, get: function () { prepare(this); return cd.get.call(this); } });
  }

  patchRealm(window);
  hookFrames(window);
  listen(document);
})();
