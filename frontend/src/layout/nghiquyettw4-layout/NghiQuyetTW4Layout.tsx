import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useEffect, useState, type ChangeEvent } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NghiQuyetTW4Footer } from '../components/footer';
import { HeaderNavbar, HeaderTop, HeaderUtils, type HeaderMenu } from '../components/header';
import './NghiQuyetTW4Layout.scss';
import { HttpStatusCode } from 'axios';
import { getMenus } from '@/services/nghiquyettw4';
import { NghiQuyetTW4_DATA_CONFIG } from '@/configs';
import { t } from 'i18next';

export const NghiQuyetTW4Layout = () => {
  const breadcrumbs = useBreadcrumbs();
  const location = useLocation();
  const navigation = useNavigate();

  const [menus, setMenus] = useState<HeaderMenu[]>([]);

  const [language, setLanguage] = useState({ label: 'English', value: 'en' });
  const [keyword, setKeyword] = useState('');
  const handleLanguageChange = () => {
    setLanguage(language.value == 'en' ? { label: 'Tiếng Việt', value: 'vi' } : { label: 'English', value: 'en' });
  };
  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    const fetchAppMenus = async () => {
      try {
        const response = await getMenus();
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
    navigation('/tim-kiem');
  };
  return (
    <div className="mh-nqtw4-layout">
      <HeaderTop
        nqtw4
        image={NghiQuyetTW4_DATA_CONFIG.header.top.image}
        imageRight={NghiQuyetTW4_DATA_CONFIG.header.top.imageRight}
        title={t('nghiquyettw4.header')}
      />
      <HeaderNavbar menuTitle="MENU" items={menus} className="mh-header-bg-main" />
      <HeaderUtils
        nqtw4
        breadcrumbs={breadcrumbs}
        searchPlaceholder="Tìm kiếm"
        language={language.label}
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
        onLanguageClick={handleLanguageChange}
        onSearch={handleSearch}
      />
      <main className="mh-main-nqtw4" style={{ overflowX: 'hidden' }}>
        <Outlet />
      </main>
      <NghiQuyetTW4Footer />
    </div>
  );
};
