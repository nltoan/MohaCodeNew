// Ảnh Upload/Media_Share (jpg/png) được API thu nhỏ theo bề rộng (api/Public/Img) và cache lâu dài,
// thay vì tải ảnh gốc nhiều MB. Chỉ nhận các bề rộng này; API tự làm tròn lên mốc gần nhất.
const OPTIMIZABLE_PATH = /^(Upload|Media_Share)\/.+\.(jpe?g|png)$/i;
const DEFAULT_IMAGE_WIDTH = 640;

const mediaBase = () => {
  const env = window.env;
  return ((env && env.VITE_MEDIA_URL) ? env.VITE_MEDIA_URL : 'https://moha.gov.vn').replace(/\/+$/, '');
};

const optimizedPath = (url: string): string | null => {
  let path = url;
  if (/^https?:/i.test(url)) {
    try {
      const parsed = new URL(url);
      if (parsed.origin !== new URL(mediaBase()).origin) return null;
      path = decodeURIComponent(parsed.pathname);
    } catch {
      return null;
    }
  } else if (/^(data|blob):/i.test(url)) {
    return null;
  } else {
    try { path = decodeURIComponent(url); } catch { /* giữ nguyên đường dẫn */ }
  }
  path = path.split(/[?#]/)[0].replace(/^\/+/, '');
  return OPTIMIZABLE_PATH.test(path) ? path : null;
};

const getOptimizedUrl = (url: string, width: number): string | null => {
  const apiBase = window.env?.VITE_API_URL;
  const path = optimizedPath(url);
  if (!apiBase || !path) return null;
  return `${apiBase.replace(/\/+$/, '')}/Img?src=${encodeURIComponent(path)}&w=${width}`;
};

const getOriginalUrl = (url: string) => {
  const finalUrl = /^(https?:|data:|blob:)/i.test(url) ? url : new URL(url.replace(/^\/+/, ''), mediaBase() + '/').href;
  return finalUrl;
};

// width: bề rộng hiển thị tối đa (px, theo màn hình 2x nên truyền khoảng 2 lần kích thước khung).
// width = 0 để lấy ảnh gốc (ví dụ og:image cho mạng xã hội).
const getUrlImage = (url: string, width: number = DEFAULT_IMAGE_WIDTH) => {
  if (!url || url === '') return '/images/sample/category-2-bg.png';
  if (width > 0) {
    const optimized = getOptimizedUrl(url, width);
    if (optimized) return optimized;
  }
  return getOriginalUrl(url);
};

// srcSet cho <img>: trình duyệt chọn mốc phù hợp với màn hình; trả về undefined nếu không tối ưu được.
const getUrlImageSrcSet = (url: string, widths: number[]) => {
  if (!url) return undefined;
  const entries = widths.map(width => {
    const optimized = getOptimizedUrl(url, width);
    return optimized ? `${optimized} ${width}w` : null;
  }).filter(Boolean);
  return entries.length ? entries.join(', ') : undefined;
};

const getUrlPdfFile = (url: string) => {
  if (!url) return '';

  const finalUrl = /^https?:/i.test(url) ? url : new URL(url.replace(/^\/+/, ''), mediaBase() + '/').href;

  return finalUrl;
};

export { getUrlImage, getUrlImageSrcSet, getUrlPdfFile };

// CMS article bodies contain site-relative media paths; resolve them against the media host.
// Ảnh trong bài được thu nhỏ (tối đa 1280px) và tải lười.
export const resolveContentMedia = (html?: string): string => {
  if (!html) return '';
  const body = new DOMParser().parseFromString(html, 'text/html');
  body.querySelectorAll('[src], a[href]').forEach(element => {
    const attribute = element.hasAttribute('src') ? 'src' : 'href';
    const value = element.getAttribute(attribute);
    if (value && /^\/?Media_Share\//i.test(value)) {
      element.setAttribute(attribute, element.tagName === 'IMG' ? getUrlImage(value, 1280) : getUrlImage(value, 0));
    }
  });
  body.querySelectorAll('img').forEach(image => {
    if (!image.hasAttribute('loading')) image.setAttribute('loading', 'lazy');
    if (!image.hasAttribute('decoding')) image.setAttribute('decoding', 'async');
    const source = image.getAttribute('src');
    if (source && !image.hasAttribute('srcset') && /^\/?Upload\//i.test(source)) {
      image.setAttribute('src', getUrlImage(source, 1280));
    }
  });
  return body.body.innerHTML;
};
