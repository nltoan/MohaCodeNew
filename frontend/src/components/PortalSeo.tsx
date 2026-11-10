import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assignedMetadataDate } from '@/utils/assignedMetadataDate';
import { portalCanonical } from './portalCanonical';

// Trang bắt buộc có dữ liệu đặc tả (Phụ lục IV TT 22/2023/TT-BTTTT, mục 2.1) nhưng không có ngày nguồn:
// dùng ngày ổn định do chủ nội dung ấn định, đánh dấu DC.Date.Source (khớp với API MetadataPage).
const ASSIGNED_DATE_PATHS = new Set([
  '/', '/trang-chu', '/gioi-thieu', '/gioi-thieu/chuc-nang-nhiem-vu', '/gioi-thieu/lich-su-bo', '/gioi-thieu/lanh-dao-bo',
  '/gioi-thieu/co-cau-to-chuc', '/gioi-thieu/lich-su-hinh-thanh-va-phat-trien', '/gioi-thieu-bo-truong',
]);
export function PortalSeo() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const descriptions: Record<string, string> = {
    '/': 'Cổng thông tin điện tử Bộ Nội vụ: tin tức, hoạt động, văn bản, chính sách và thông tin phục vụ người dân, doanh nghiệp.',
    '/tin-tuc': 'Tin tức và hoạt động của Bộ Nội vụ, cập nhật thông tin về chính sách và các lĩnh vực quản lý nhà nước của Bộ.',
    '/tra-cuu-hoi-quy': 'Tra cứu thông tin Hội và Quỹ Trung ương theo tên tổ chức: địa chỉ, người đại diện và thông tin liên hệ.',
    '/tim-kiem': 'Tìm kiếm tin tức, văn bản và thông tin trên Cổng thông tin điện tử Bộ Nội vụ.',
    '/gioi-thieu': 'Giới thiệu Bộ Nội vụ: chức năng, nhiệm vụ, cơ cấu tổ chức, lãnh đạo và lịch sử hình thành, phát triển.',
    '/van-ban': 'Tra cứu văn bản chỉ đạo điều hành, văn bản quy phạm pháp luật và dự thảo văn bản của Bộ Nội vụ.',
    '/nghien-cuu-khoa-hoc': 'Thông tin đề tài và hoạt động nghiên cứu khoa học thuộc các lĩnh vực quản lý nhà nước của Bộ Nội vụ.',
    '/multimedia': 'Thư viện ảnh, video và audio về hoạt động và các lĩnh vực quản lý nhà nước của Bộ Nội vụ.',
    '/photo': 'Thư viện ảnh về hoạt động của Bộ Nội vụ.',
    '/video': 'Thư viện video về hoạt động của Bộ Nội vụ.',
    '/audio': 'Thư viện audio về hoạt động của Bộ Nội vụ.',
    '/du-lieu': 'Thông tin dữ liệu trên Cổng thông tin điện tử Bộ Nội vụ.',
    '/phan-anh-kien-nghi': 'Thông tin phản ánh và kiến nghị trên Cổng thông tin điện tử Bộ Nội vụ.',
    '/bo-truong': 'Trang thông tin Bộ trưởng Bộ Nội vụ: tin tức, hoạt động và các thông tin liên quan.',
    '/nghi-quyet-tw4': 'Chuyên trang thông tin về Đảng bộ Bộ Nội vụ và việc thực hiện Nghị quyết Hội nghị Trung ương.',
  };
  const section = '/' + pathname.split('/')[1];
  const description = descriptions[pathname] || descriptions[section] || descriptions['/'];
  const titles: Record<string, string> = { '/gioi-thieu': 'Giới thiệu', '/van-ban': 'Văn bản', '/tim-kiem': 'Tìm kiếm thông tin', '/nghien-cuu-khoa-hoc': 'Nghiên cứu khoa học', '/multimedia': 'Thư viện đa phương tiện', '/photo': 'Thư viện ảnh', '/video': 'Thư viện video', '/audio': 'Thư viện audio', '/du-lieu': 'Dữ liệu', '/phan-anh-kien-nghi': 'Phản ánh - kiến nghị', '/tra-cuu-hoi-quy': 'Tra cứu Hội và Quỹ Trung ương' };
  titles['/bo-truong'] = 'Thông tin Bộ trưởng';
  titles['/nghi-quyet-tw4'] = 'Đảng bộ Bộ Nội vụ';
  const canonical = portalCanonical(pathname);
  const title = titles[section] ? `${titles[section]} - Bộ Nội vụ` : 'Cổng thông tin điện tử Bộ Nội vụ';
  return <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href={canonical} />
    <meta property="og:url" content={canonical} />
    <meta property="og:site_name" content="Bộ Nội vụ" />
    <meta name="DC.Title" content={title} />
    <meta name="DC.Creator" content="Bộ Nội vụ" />
    <meta name="DC.Publisher" content="Bộ Nội vụ" />
    <meta name="DC.Description" content={description} />
    <meta name="DC.Identifier" content={canonical} />
    <meta name="DC.Language" content={i18n.resolvedLanguage?.startsWith('en') ? 'eng' : 'vie'} />
    <meta name="DC.Subject" content="Bộ Nội vụ; Nội vụ; Chính phủ; Việt Nam" />
    {ASSIGNED_DATE_PATHS.has(pathname) && <meta name="DC.Date" content={assignedMetadataDate(pathname)} />}
    {ASSIGNED_DATE_PATHS.has(pathname) && <meta name="DC.Date.Source" content="owner-assigned" />}
  </Helmet>;
}
