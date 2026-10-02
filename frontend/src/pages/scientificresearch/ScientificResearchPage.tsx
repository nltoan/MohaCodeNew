import './ScientificResearchPage.scss';
import { Link } from 'react-router-dom';
import { CardSection, Loading, Pagination } from '@/components';
import { getScientificResearchs } from '@/services/scientificresearch';
import { useEffect, useState } from 'react';
import type { PaginationState } from '@/types/common';
import { getNewURL } from '@/utils/getSlugKey';
import { useTranslation } from 'react-i18next';

export interface ScientificResearch {
  TenDeTai: string;
  ID: number;
}

export const ScientificResearchPage = () => {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState<ScientificResearch>>({
    data: [] as ScientificResearch[],
    activePage: 1,
    totalPages: 10,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res: { data: ScientificResearch[], totalCount: number } = await getScientificResearchs(pagination.activePage, pagination.pageSize)

        if (!res) return;

        setPagination((prev) => ({ ...prev, data: res.data, totalPages: Math.ceil(res.totalCount / prev.pageSize) }));
      } catch (err) {
        console.error('Error fetching scientific researchs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pagination.activePage, pagination.pageSize]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mh-scientificresearch">
      <div className="mh-scientificresearch-content">
        <CardSection title={<h1 className="m-0 fs-4">{t("scientificresearch.title")}</h1>}>
          <div className="mh-scientificresearch-posts">
            {pagination.data.length > 0 ? (
              pagination.data.map((item) => (
                <div className="mh-scientificresearch-post" key={item.ID}>
                  <Link to={getNewURL('nghien-cuu-khoa-hoc', item.TenDeTai, item.ID)} className="mh-scientificresearch-item-title">
                    {item.TenDeTai}
                  </Link>
                </div>
              ))
            ) : (
              <div className="mh-scientificresearch-empty">{t("common.no_data")}</div>
            )}

          </div>
          {pagination.totalPages >= 1 && (<Pagination
            style={{ marginTop: 10 }}
            showPageSizeSelector
            totalPages={pagination.totalPages}
            activePage={pagination.activePage}
            pageSize={pagination.pageSize}
            onPageChange={(page) => {
              setPagination((prev) => ({ ...prev, activePage: page }));
            }}
            onPageSizeChange={(size) => {
              setPagination((prev) => ({
                ...prev,
                pageSize: size,
                activePage: 1,
              }));
            }}
            maxVisiblePages={3}
            wrapStyle={{ marginBottom: 48 }}
          />)}
        </CardSection>
      </div>
    </div>
  );
};
