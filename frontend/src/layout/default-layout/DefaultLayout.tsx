import { APP_CONFIG, APP_DATA_CONFIG } from '@/configs';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Footer } from '../components/footer';
import { HeaderBanner, HeaderNavbar, HeaderTop, HeaderUtils, type HeaderMenu } from '../components/header';
import './DefaultLayout.scss';
import { getCtxAppConfig, getHomeBanner } from '@/services/config';
import { HttpStatusCode } from 'axios';
import { transformMenuData } from '@/configs/menu-config';
import { useTranslation } from 'react-i18next';
import { getLang } from '@/services';
import { getUrlImage } from '@/utils/image';
import { PortalSeo } from '@/components/PortalSeo';

export const DefaultLayout = () => {
  const { t } = useTranslation();

  const breadcrumbs = useBreadcrumbs();
  const location = useLocation();
  const navigation = useNavigate();

  const [menus, setMenus] = useState<HeaderMenu[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [headerBanner, setHeaderBanner] = useState<{src: string; link: string} | null>(null);

  useEffect(() => {
    const fetchDidMoundData = async () => {
      try {
        const response = await getHomeBanner(
          getLang() === 'vi' ? APP_DATA_CONFIG.HEADER_BANNER.VI : APP_DATA_CONFIG.HEADER_BANNER.EN,
        );
        if (response.status === HttpStatusCode.Ok) {
          if(response.data.data != null && response.data.data.length > 0){
            const urlImage = getUrlImage(response.data.data[0]?.AnhBannerUrl || '');
            setHeaderBanner({ src: urlImage, link: response.data.data[0]?.URL || '' });
          } else {
            setHeaderBanner({ src: '', link: '' });
          }
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchDidMoundData();
  }, []);

  useEffect(() => {
    const fetchAppMenus = async () => {
      try {
        const response = await getCtxAppConfig();
        if (response.status === HttpStatusCode.Ok) {
          const appMenus = transformMenuData(response.data.data);
          setMenus([...appMenus]);
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchAppMenus();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLanguageChange = (lang: string) => {
    localStorage.setItem('i18nextLng', lang);
    window.location.href = '/';
  };
  const handleSearch = () => {
    navigation('/tim-kiem');
  };
  return (
    <div className={`mh-layout ${APP_CONFIG.theme || ''}`}>
      <PortalSeo />
      <HeaderTop
        image={APP_CONFIG.header.top.image}
        imageRight={APP_CONFIG.header.top.imageRight}
        title={t('header.title')}
      />
      <HeaderNavbar menuTitle="MENU" items={menus} className="mh-header-bg-main" />
      <HeaderBanner src={headerBanner?.src || ''} link={headerBanner?.link || ''} title='Header Banner'/>
      <HeaderUtils breadcrumbs={breadcrumbs} onSearch={handleSearch} onLanguageChange={handleLanguageChange} />
      <main className="mh-main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
