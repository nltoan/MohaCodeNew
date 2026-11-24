import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

// data-cke-csp-* la ten thuoc tinh rieng cua public/ckeditor-csp.js: khong de noi dung CMS mang vao.
DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  if (/^data-cke-csp/i.test(data.attrName)) data.keepAttr = false;
});

export default function safeParse(value) { return parse(DOMPurify.sanitize(value || '')); }
