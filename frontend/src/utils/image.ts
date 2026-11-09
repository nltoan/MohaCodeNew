const getUrlImage = (url: string) => {
  if (!url || url === '') return '/images/sample/category-2-bg.png';

  const env = (window as any).env;
  const baseUrl = (env && env.VITE_MEDIA_URL) ? env.VITE_MEDIA_URL : 'https://moha.gov.vn';
  const finalUrl = /^(https?:|data:|blob:)/i.test(url) ? url : new URL(url.replace(/^\/+/, ''), baseUrl.replace(/\/+$/, '') + '/').href;

  return finalUrl;
};

const getUrlPdfFile = (url: string) => {
  if (!url) return '';

  const env = (window as any).env;
  const baseUrl = (env && env.VITE_MEDIA_URL) ? env.VITE_MEDIA_URL : 'https://moha.gov.vn';
  const finalUrl = /^https?:/i.test(url) ? url : new URL(url.replace(/^\/+/, ''), baseUrl.replace(/\/+$/, '') + '/').href;

  return finalUrl;
};

export { getUrlImage, getUrlPdfFile };

// CMS article bodies contain site-relative media paths; resolve them against the media host.
export const resolveContentMedia = (html?: string): string => {
  if (!html) return '';
  const body = new DOMParser().parseFromString(html, 'text/html');
  body.querySelectorAll('[src], a[href]').forEach(element => {
    const attribute = element.hasAttribute('src') ? 'src' : 'href';
    const value = element.getAttribute(attribute);
    if (value && /^\/?Media_Share\//i.test(value)) {
      element.setAttribute(attribute, getUrlImage(value));
    }
  });
  return body.body.innerHTML;
};
