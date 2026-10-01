import { type BreadcrumbItem } from '@/routes';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // hoặc thư viện translation bạn đang dùng
import { APP_DATA_CONFIG } from '@/configs';

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const location = useLocation();
  const { t } = useTranslation();

  return useMemo(() => {
    // Always start with Home
    const breadcrumbs: BreadcrumbItem[] = [{ label: t('breadcrumb.home'), path: '/' }];
    const BREADCRUMB_LABELS: Record<string, string> = {
      'tra-cuu-hoi-quy': 'Tra cứu Hội và Quỹ',
      // Home
      '': t('breadcrumb.home'),
      'trang-chu': t('breadcrumb.home'),

      // About
      'gioi-thieu': t('breadcrumb.about'),
      'chuc-nang-nhiem-vu': t('breadcrumb.functions_and_tasks'),
      'lanh-dao-bo': t('breadcrumb.leadership'),
      'co-cau-to-chuc': t('breadcrumb.organizational_structure'),
      'lich-su-bo': t('breadcrumb.history_of_ministry'),
      'lich-su-hinh-thanh-va-phat-trien': t('breadcrumb.history_of_formation_and_development'),

      // News
      'tin-tuc': t('breadcrumb.news'),
      'chuyen-muc': t('breadcrumb.category'),
      // Documents
      'van-ban': t('breadcrumb.documents'),
      'van-ban-chi-dao': t('breadcrumb.directive_documents'),
      'van-ban-qppl': t('breadcrumb.legal_documents'),
      'du-thao-van-ban': t('breadcrumb.draft_documents'),

      // Data
      'du-lieu': t('breadcrumb.data'),

      // Multimedia
      multimedia: t('breadcrumb.multimedia'),
      photo: t('breadcrumb.photo'),
      infographics: t('breadcrumb.infographics'),
      video: t('breadcrumb.video'),
      audio: t('breadcrumb.audio'),

      // Feedback
      'phan-anh-kien-nghi': t('breadcrumb.feedback'),

      'bo-truong': t('breadcrumb.botruong'),
      'gioi-thieu-bo-truong': t('breadcrumb.gioithieubotruong'),
      'nghi-quyet-tw4': t('breadcrumb.nghiquyettw4'),
      'nghien-cuu-khoa-hoc': t('breadcrumb.nghiencuukhoahoc'),
    };
    // Process each path segment
    let currentPath = '';
    const arrPath = location.pathname.split('/').filter(Boolean);
    arrPath.forEach((segment, index) => {
      const parentPath = currentPath;
      currentPath = `${currentPath}/${segment}`;
      const label = BREADCRUMB_LABELS[segment];
      var path = index === location.pathname.split('/').filter(Boolean).length - 1 ? undefined : currentPath;
      if(segment === 'van-ban'){
        path = '/van-ban/van-ban-chi-dao/---id' + APP_DATA_CONFIG.DOCUMENT_DEFAULT_CATEGORY.CDDH;
      } else if(segment === 'van-ban-chi-dao'){
        path = '/van-ban/van-ban-chi-dao/---id' + APP_DATA_CONFIG.DOCUMENT_DEFAULT_CATEGORY.CDDH;
      } else if(segment === 'van-ban-qppl'){
        path = '/van-ban/van-ban-qppl/---id' + APP_DATA_CONFIG.DOCUMENT_DEFAULT_CATEGORY.QPPL;
      }
      if (label) {
        if (!breadcrumbs.some((b) => b.path === currentPath)) {
          breadcrumbs.push({
            label,
            parentPath,
            path: path,
          });
        }
      }
    });

    // Remove duplicates and keep only relevant ones
    return breadcrumbs.length > 1 ? breadcrumbs : [{ label: t('breadcrumb.home'), path: '/' }];
  }, [location.pathname, t]);
};
