import DOMPurify from 'dompurify';

export const sanitizeHtml = (value?: string | null): string => DOMPurify.sanitize(value || '');
