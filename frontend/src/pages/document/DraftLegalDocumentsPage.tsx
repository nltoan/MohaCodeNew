import { Link } from 'react-router-dom';
import { CardSection, Loading, Pagination } from '@/components';
import { getDraftLegalDocumentList } from '@/services/documents';
import { useEffect, useState } from 'react';
import type { PaginationState } from '@/types/common';
import { getNewURL } from '@/utils/getSlugKey';
import { vnFormatter } from '@/utils';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export interface Document {
  TieuDe: string;
  NgayBatDauLayYKien: string;
  NgayHetHanLayYKien: string;
  TrichYeu: string;
  detailUrl: string;
  ID: number;
}


export const DraftLegalDocumentsPage = () => {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState<Document>>({
    data: [] as Document[],
    activePage: 1,
    totalPages: 10,
    pageSize: 10,
  });

  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res: { data: Document[], totalCount: number } = await getDraftLegalDocumentList(pagination.activePage, pagination.pageSize)

        if (!res) return;

        setPagination((prev) => ({ ...prev, data: res.data, totalPages: Math.ceil(res.totalCount / prev.pageSize) }));
      } catch (err) {
        console.error('Error fetching directive documents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pagination.activePage, pagination.pageSize, slug]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mh-document-content">
      <Helmet>
        <title>{t("documents.draftLegalDocuments")} - {t("seo.moha")}</title>
      </Helmet>
      <CardSection title={<h1 className="m-0 fs-4">{t("documents.draftLegalDocuments")}</h1>}>
        <div className="mh-document-posts">
          {pagination.data.length > 0 ? (
            pagination.data.map((item) => (
              <div className="mh-document-post" key={item.ID}>
                <Link to={getNewURL('van-ban/du-thao/', item.TieuDe, item.ID)} className="mh-document-item-title">
                  {item.TieuDe}
                </Link>
                <span>{`${t("document.durationStart")}${vnFormatter(item.NgayBatDauLayYKien)}${t("document.durationEnd")}${vnFormatter(item.NgayHetHanLayYKien)}`}</span>
              </div>
            ))
          ) : (
            <div className="mh-document-empty">{t("common.no_data")}</div>
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
  );
};
