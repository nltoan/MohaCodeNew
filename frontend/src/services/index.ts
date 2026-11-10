import axios from 'axios';

const env = window.env || {};
const apiUrl = env.VITE_API_URL || 'https://api-portal.moha.gov.vn/api/Public/';

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  },
);

export default axiosInstance;

export const getUrlPath = (path: string, params?: Record<string, string | number>) => {
  const lang = getLang();
  const query = Object.entries(params || {})
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return query ? `${path}?lang=${lang}&${query}` : `${path}?lang=${lang}`;
};

export const getUrlPathWithLang = (path: string, params?: Record<string, string | number>) => {
  const lang = getLang();
  const query = Object.entries(params || {})
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return query ? `${path}${lang}?${query}` : `${path}${lang}`;
};

export const getLang = (): 'vi' | 'en' => {
  const lang = (localStorage.getItem('i18nextLng') || 'vi').trim().toLowerCase();
  if (!localStorage.getItem('i18nextLng')) localStorage.setItem('i18nextLng', 'vi');
  return lang === 'en' || lang.startsWith('en-') || lang.startsWith('en_') ? 'en' : 'vi';
}
