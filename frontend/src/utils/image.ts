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
