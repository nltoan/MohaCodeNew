import { Link } from 'react-router-dom';
import { CardSection, PageHeader, Loading } from '@/components';
import { AboutBody } from './components/body/AboutBody';
import { useEffect, useState, useMemo } from 'react';
import { getOrganizationStructure } from '@/services/about';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { getIdFromSlug } from '@/utils/getSlugKey';
import { Helmet } from 'react-helmet-async';

// 1. Định nghĩa Interface chuẩn theo data API
interface OrgUnit {
  ID: number;
  IDLoaiDV: number | null;
  IDDVCha: number | null;
  TenTiengAnh: string | null;
  TenDonVi: string;
  ChucNangNhiemVu: string;
  SoThuTu: number;
  Level: number;
  LinkBaiViet: string;
  // Các field khác nếu cần
}

export const OrganizationalStructurePage = () => {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<OrgUnit[]>([]);

  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const keyQuery = getIdFromSlug(slug || '');
        const result = await getOrganizationStructure(keyQuery + '');
        if (Array.isArray(result)) {
          // Sắp xếp theo SoThuTu nếu cần
          const sortedData = result.sort((a: OrgUnit, b: OrgUnit) => a.SoThuTu - b.SoThuTu);
          setData(sortedData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [slug]);

  // 2. Xử lý dữ liệu: Tách Level 1 (Sections) và hàm lấy con
  const { rootSections, getChildren } = useMemo(() => {
    // Lọc ra các đơn vị Level 1 để làm Tiêu đề Section
    const rootSections = data.filter((item) => item.Level === 1);

    // Hàm helper để lấy con trực tiếp của một ID cha
    const getChildren = (parentId: number) => {
      return data.filter((item) => item.IDDVCha === parentId);
    };

    return { rootSections, getChildren };
  }, [data]);

  // Hàm đóng popup xem chi tiết con

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>{`${t("seo.moha")} - ${t("organizationStructureMinistryHomeAffairs")}`}</title>
      </Helmet>
      <PageHeader title={t('organizationStructureMinistryHomeAffairs')} />
      <AboutBody>
        {/* Render danh sách dựa trên Level 1 */}
        {rootSections.map((section) => {
          // Lấy danh sách con trực tiếp của Level 1 (tức là Level 2)
          const subItems = getChildren(section.ID);

          // Nếu section này không có con thì có thể ẩn hoặc vẫn hiện tùy logic
          if (subItems.length === 0) return null;

          return (
            <CardSection key={section.ID} title={section.TenDonVi}>
              <div className="grid-items">
                {subItems.map((item) => (
                  <Link
                    key={item.ID}
                    to={item.LinkBaiViet || '/#'} // Hoặc link chi tiết nếu có
                    className="grid-item"
                  >
                    {item.TenDonVi}
                  </Link>
                ))}
              </div>
            </CardSection>
          );
        })}
      </AboutBody>
    </>
  );
};
