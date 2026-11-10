import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useEffect, useState, type ChangeEvent } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NghiQuyetTW4Footer } from '../components/footer';
import { HeaderNavbar, HeaderTop, HeaderUtils, type HeaderMenu } from '../components/header';
import './NghiQuyetTW4Layout.scss';
import { HttpStatusCode } from 'axios';
import { getMenus } from '@/services/nghiquyettw4';
import { NghiQuyetTW4_DATA_CONFIG, hasEnglishIds } from '@/configs';
import { t } from 'i18next';
import { PortalSeo } from '@/components/PortalSeo';
import { SkipLink } from '@/components/skip-link/SkipLink';

export const NghiQuyetTW4Layout = () => {
  const breadcrumbs = useBreadcrumbs();
  const location = useLocation();
  const navigation = useNavigate();

  const [menus, setMenus] = useState<HeaderMenu[]>([]);

  const [keyword, setKeyword] = useState('');
  const handleLanguageChange = (lang: string) => {
    localStorage.setItem('i18nextLng', lang);
    window.location.href = '/nghi-quyet-tw4';
  };
  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    const fetchAppMenus = async () => {
      try {
        const response = await getMenus();
        if (response.status === HttpStatusCode.Ok) {
           
          const data = response.data.childs.length
            ? response.data.childs.map((f: { TenMenu: string; URL: string }) => {
                return { label: f.TenMenu, url: f.URL };
              })
            : [];
          setMenus([...data]);
        }
      } catch (error) {
        console.error('err', error);
      }
    };
    fetchAppMenus();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSearch = () => {
    navigation(keyword.trim() ? '/tim-kiem/' + encodeURIComponent(keyword.trim()) : '/tim-kiem');
  };
  return (
    <div className="mh-nqtw4-layout">
      <SkipLink />
      <PortalSeo />
      <HeaderTop
        nqtw4
        image={NghiQuyetTW4_DATA_CONFIG.header.top.image}
        imageRight={NghiQuyetTW4_DATA_CONFIG.header.top.imageRight}
        title={t('nghiquyettw4.header')}
      />
      <HeaderNavbar items={menus} className="mh-header-bg-main" />
      <HeaderUtils
        nqtw4
        breadcrumbs={breadcrumbs}
        searchPlaceholder="Tìm kiếm"
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
        onLanguageChange={handleLanguageChange}
        hideLanguageSwitch={!hasEnglishIds(NghiQuyetTW4_DATA_CONFIG)}
        onSearch={handleSearch}
      />
      <main id="main-content" tabIndex={-1} className="mh-main-nqtw4" style={{ overflowX: 'hidden' }}>
        <Outlet />
      </main>
      <NghiQuyetTW4Footer />
    </div>
  );
};
