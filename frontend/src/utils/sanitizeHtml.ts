import DOMPurify from 'dompurify';

// data-cke-csp-* la ten thuoc tinh rieng cua shim CKEditor ben admin: khong de noi dung CMS mang vao.
DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
  if (/^data-cke-csp/i.test(data.attrName)) data.keepAttr = false;
});

export const sanitizeHtml = (value?: string | null): string => DOMPurify.sanitize(value || '');
