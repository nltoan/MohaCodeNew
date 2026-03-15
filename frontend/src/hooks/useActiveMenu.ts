import { useLocation } from 'react-router-dom';

export interface UseActiveMenuResult {
  pathname: string;
  isActive: (url?: string) => boolean;
}
export const useActiveMenu = (): UseActiveMenuResult => {
  const { pathname } = useLocation();
  const isActive = (url?: string): boolean => {
    if (!url) return false;
    if (url === '/') {
      return pathname === '/';
    }
    return pathname === url || pathname.startsWith(url + '/');
  };
  return {
    pathname,
    isActive,
  };
};
