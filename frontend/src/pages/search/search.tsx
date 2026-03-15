import { Container, FormControl, Image } from 'react-bootstrap';
import { CardSection, Loading, Pagination } from '@/components';
import { IconPdfFile } from '@/components/icons';
import './search.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PaginationState } from '@/types/common';
import { searchInformation } from '@/services/config';
import { Link, useParams } from 'react-router-dom';
import { getNewURL } from '@/utils/getSlugKey';
import { t } from 'i18next';
import { getUrlImage, getUrlPdfFile } from '@/utils/image';
import { vnFormatter } from '@/utils/dateUtils';
export interface SearchResult {
  ID: string;
  TieuDe: string;
  MoTa: string;
  AnhDaiDienUrl: string;
  NgayXuatBan: string;
  Type: string;
}

export const SearchPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState<SearchResult>>({
    data: [] as SearchResult[],
    activePage: 1,
    totalPages: 10,
    pageSize: 10,
  });

  const onSearchKeyword = async () => {
    navigate('/tim-kiem/' + keyword);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (slug === '') return;
      setKeyword(slug ?? '');
      setLoading(true);
      try {
        const res: { data: SearchResult[]; totalCount: number } = await searchInformation(
          slug ?? '',
          pagination.activePage,
          pagination.pageSize,
        );
        if (!res) return;
        setPagination((prev) => ({ ...prev, data: res.data, totalPages: Math.ceil(res.totalCount / prev.pageSize) }));
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.activePage, pagination.pageSize, slug]);

  return (
    <Container className="py-4">
      <CardSection title="Tìm kiếm thông tin">
        <>
          <div className="mh-searchbox-search">
            <button type="button" aria-label="Tìm kiếm" onClick={onSearchKeyword}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M7.66659 14C11.1644 14 13.9999 11.1645 13.9999 7.66671C13.9999 4.1689 11.1644 1.33337 7.66659 1.33337C4.16878 1.33337 1.33325 4.1689 1.33325 7.66671C1.33325 11.1645 4.16878 14 7.66659 14Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.6666 14.6667L13.3333 13.3334"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <FormControl
              type="search"
              placeholder={'search'}
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSearchKeyword();
                }
              }}
            />
          </div>
        </>
        {loading && <Loading />}

        <div className="mh-searchbox-items">
          {pagination?.data?.length > 0 ? (
            pagination.data.map((item) => (
              <>
                {item.Type == 'tin-tuc' && (
                  <div className="mh-news-item" key={item?.ID}>
                    <Link to={getNewURL('tin-tuc', item.TieuDe, item?.ID)} className="mh-news-item-image">
                      <Image src={getUrlImage(item?.AnhDaiDienUrl)} alt={item?.TieuDe} />
                    </Link>
                    <div className="mh-news-item-info">
                      <Link to={getNewURL('tin-tuc', item.TieuDe, item?.ID)} className="mh-news-item-title">
                        {item?.TieuDe}
                      </Link>
                      <div className="mh-news-item-description" dangerouslySetInnerHTML={{ __html: item?.MoTa }} />
                    </div>
                    <div className="mh-news-item-date">{vnFormatter(item?.NgayXuatBan)}</div>
                  </div>
                )}
                {item.Type == 'pdf-file' && (
                  <div className="mh-news-item" key={item?.ID}>
                    <Link
                      to={getUrlPdfFile(item?.AnhDaiDienUrl)}
                      key={item?.AnhDaiDienUrl}
                      target="_blank"
                      className="mh-news-item-image"
                    >
                      <IconPdfFile />
                    </Link>
                    <div className="mh-news-item-info">
                      <Link
                        to={getUrlPdfFile(item?.AnhDaiDienUrl)}
                        key={item?.AnhDaiDienUrl + '1'}
                        target="_blank"
                        className="mh-news-item-title"
                      >
                        {item?.TieuDe}
                      </Link>
                      <div className="mh-news-item-description" dangerouslySetInnerHTML={{ __html: item?.MoTa }} />
                    </div>
                  </div>
                )}
              </>
            ))
          ) : (
            <div className="mh-searchbox-empty">{t("common.no_data")}</div>
          )}

          {pagination?.data?.length === 0 && <div className="text-center">{t('common.no_data')}</div>}
        </div>
        {pagination?.totalPages >= 1 && (
          <Pagination
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
          />
        )}
      </CardSection>
    </Container>
  );
};
