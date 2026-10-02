/* eslint-disable @typescript-eslint/no-explicit-any */
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useEffect, useState, type ChangeEvent } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import imageLeft from '../../assets/images/quoc-huy.svg';
import { Footer } from '../components/footer';
import { HeaderNavbar, HeaderTop, HeaderUtils, type HeaderMenu } from '../components/header';
import './MinisterLayout.scss';
import { HttpStatusCode } from 'axios';
import { getMinisterMenus } from '@/services/minister';
import { getLang } from '@/services';
import { useTranslation } from 'react-i18next';
import { PortalSeo } from '@/components/PortalSeo';

export const MinisterLayout = () => {
    const { t } = useTranslation();
  
  const breadcrumbs = useBreadcrumbs();
  const location = useLocation();
  const navigate = useNavigate();
  const [menus, setMenus] = useState<HeaderMenu[]>([]);
  const [keyword, setKeyword] = useState('');
  const handleLanguageChange = () => {
    const lang = getLang() === 'vi' ? 'en' : 'vi';
    localStorage.setItem('i18nextLng', lang);
    window.location.href = '/bo-truong';
  };
  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    const fetchAppMenus = async () => {
      try {
        const response = await getMinisterMenus();
        if (response.status === HttpStatusCode.Ok) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = response.data.childs.length
            ? response.data.childs.map((f: any) => {
                return { label: f.TenMenu, url: f.URL };
              })
            : [];
          setMenus([...data]);
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchAppMenus();
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSearch = () => {
    navigate(keyword.trim() ? '/tim-kiem/' + encodeURIComponent(keyword.trim()) : '/tim-kiem');
  };
  return (
    <div className="mh-minister-layout">
      <PortalSeo />
      <HeaderTop
        minister
        image={{ src: imageLeft, alt: 'Quốc huy Cộng hòa Xã hội chủ nghĩa Việt Nam' }}
        title={t("minister.minister_page")}
      />
      <HeaderNavbar menuTitle="MENU" items={menus} className="mh-header-bg-main" />
      <HeaderUtils
        minister
        breadcrumbs={breadcrumbs}
        searchPlaceholder={t("common.search")}
        language={getLang() !== 'en' ? 'English' : 'Tiếng Việt'}
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
        onLanguageClick={handleLanguageChange}
        onSearch={handleSearch}
      />
      <main className="mh-main-minister" style={{ overflowX: 'hidden' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
