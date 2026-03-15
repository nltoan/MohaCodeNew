import axios from 'axios';

const env = (window as any).env;
const apiUrl = env.VITE_API_URL || 'https://api-portal.moha.gov.vn';

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  },
);

export default axiosInstance;

const axiosPhanAnhExternalInstance = axios.create({
  baseURL: 'https://phananh.moha.gov.vn/Integrated',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

axiosPhanAnhExternalInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  },
);

export { axiosPhanAnhExternalInstance };

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
  const lang = localStorage.getItem('i18nextLng') || 'vi';
  localStorage.getItem('i18nextLng') || localStorage.setItem('i18nextLng', 'vi');
  return lang as 'vi' | 'en';
}
