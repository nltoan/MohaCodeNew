/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom';
import './CardQuickLinks.scss';
import { useEffect, useState, type ReactNode } from 'react';
import { getHomeBanner, type BannerItem } from '@/services/config';
import { APP_DATA_CONFIG } from '@/configs';
import { HttpStatusCode } from 'axios';
import { IconGlobeEdit, IconInfoCircle, IconPeople } from '../icons';
import { getLang } from '@/services';
export interface QuickLink {
  icon: string | ReactNode;
  label: string;
  url: string;
}
export interface CardQuickLinksProps {
  items: QuickLink[];
}
export const CardQuickLinks = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const env = (window as any).env;
  const baseUrl = (env && env.VITE_MEDIA_URL) ? env.VITE_MEDIA_URL : 'https://moha.gov.vn';
  const icons = [<IconInfoCircle />, <IconGlobeEdit />, <IconPeople />];

  useEffect(() => {
    const fetchDidMoundData = async () => {
      try {
        const response = await getHomeBanner(
          getLang() === 'vi' ? APP_DATA_CONFIG.QUICK_LINK.VI : APP_DATA_CONFIG.QUICK_LINK.EN,
        );
        if (response.status === HttpStatusCode.Ok) {
          setBanners(response.data.data);
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchDidMoundData();
  }, []);
  return (
    <ul className="mh-card-quick-links">
      {banners.map((item, idx) => (
        <li key={item.ID}>
          <Link to={item.URL} target={(item.URL.indexOf('/Upload') === 0 || item.URL.indexOf(baseUrl) === 0) ? '_blank' : ''}>
            {icons[idx]}
            <span>{item.TenBanner}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
