const getUrlImage = (url: string) => {
  if (!url || url === '') return '/images/sample/category-2-bg.png';

  const env = (window as any).env;
  const baseUrl = (env && env.VITE_MEDIA_URL) ? env.VITE_MEDIA_URL : 'https://moha.gov.vn';
  const finalUrl = `${baseUrl}${url}`;

  return finalUrl;
};

const getUrlPdfFile = (url: string) => {
  if (!url) return '';

  const env = (window as any).env;
  const baseUrl = (env && env.VITE_MEDIA_URL) ? env.VITE_MEDIA_URL : 'https://moha.gov.vn';
  const finalUrl = `${baseUrl}${url}`;

  return finalUrl;
};

export { getUrlImage, getUrlPdfFile };
