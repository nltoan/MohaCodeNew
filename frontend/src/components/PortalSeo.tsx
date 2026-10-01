import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export function portalCanonical(pathname: string) {
  return new URL(pathname || '/', 'https://moha.gov.vn').href;
}
export function PortalSeo() {
  const { pathname } = useLocation();
  const descriptions: Record<string, string> = {
    '/': 'Cổng thông tin điện tử Bộ Nội vụ: tin tức, hoạt động, văn bản, chính sách và thông tin phục vụ người dân, doanh nghiệp.',
    '/tin-tuc': 'Tin tức và hoạt động của Bộ Nội vụ, cập nhật thông tin về chính sách và các lĩnh vực quản lý nhà nước của Bộ.',
    '/tra-cuu-hoi-quy': 'Tra cứu thông tin Hội và Quỹ Trung ương theo tên tổ chức: địa chỉ, người đại diện và thông tin liên hệ.',
    '/tim-kiem': 'Tìm kiếm tin tức, văn bản và thông tin trên Cổng thông tin điện tử Bộ Nội vụ.',
  };
  const description = descriptions[pathname] || descriptions['/'];
  const canonical = portalCanonical(pathname);
  return <Helmet>
    <title>{pathname === '/tra-cuu-hoi-quy' ? 'Tra cứu Hội và Quỹ Trung ương - Bộ Nội vụ' : 'Cổng thông tin điện tử Bộ Nội vụ'}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:url" content={canonical} />
    <meta property="og:site_name" content="Bộ Nội vụ" />
  </Helmet>;
}
