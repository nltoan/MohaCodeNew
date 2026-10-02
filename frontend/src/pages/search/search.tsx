import { Container, FormControl, Image } from 'react-bootstrap';
import { CardSection, Loading, Pagination } from '@/components';
import { IconPdfFile } from '@/components/icons';
import './search.scss';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
  const [error, setError] = useState('');
  const [searchVersion, setSearchVersion] = useState(0);
  const previousSlug = useRef(slug);
  const [pagination, setPagination] = useState<PaginationState<SearchResult>>({
    data: [] as SearchResult[],
    activePage: 1,
    totalPages: 0,
    pageSize: 10,
  });

  const onSearchKeyword = async () => {
    const value = keyword.trim();
    setPagination(prev => ({ ...prev, activePage: 1 }));
    setSearchVersion(prev => prev + 1);
    navigate(value ? '/tim-kiem/' + encodeURIComponent(value) : '/tim-kiem');
  };

  useEffect(() => {
    let active = true;
    if (previousSlug.current !== slug) {
      previousSlug.current = slug;
      if (pagination.activePage !== 1) {
        setPagination(prev => ({ ...prev, activePage: 1 }));
        return;
      }
    }
    const fetchData = async () => {
      setKeyword(slug ?? '');
      setError('');
      if (!slug?.trim()) {
        setLoading(false);
        setPagination(prev => ({ ...prev, data: [], totalPages: 0 }));
        return;
      }
      setLoading(true);
      setPagination(prev => ({ ...prev, data: [], totalPages: 0 }));
      try {
        const res: { data: SearchResult[]; totalCount: number } = await searchInformation(
          slug ?? '',
          pagination.activePage,
          pagination.pageSize,
        );
        if (!active) return;
        setPagination((prev) => ({ ...prev, data: res.data, totalPages: Math.ceil(res.totalCount / prev.pageSize) }));
      } catch {
        if (active) setError('Không thể tải kết quả. Vui lòng thử lại sau.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => { active = false; };
  }, [pagination.activePage, pagination.pageSize, slug, searchVersion]);

  return (
    <Container className="py-4">
      <Helmet><title>{slug ? `Tìm kiếm: ${slug} - Bộ Nội vụ` : 'Tìm kiếm thông tin - Bộ Nội vụ'}</title><meta name="robots" content="noindex, follow" /></Helmet>
      <CardSection title={<h1 className="m-0 fs-4">Tìm kiếm thông tin</h1>}>
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
              placeholder="Nhập từ khóa tìm kiếm"
              aria-label="Từ khóa tìm kiếm"
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
          {!loading && !error && pagination?.data?.length > 0 ? (
            pagination.data.map((item) => (
              <Fragment key={`${item.Type}-${item.ID}`}>
                {item.Type == 'tin-tuc' && (
                  <div className="mh-searchbox-item" key={item?.ID}>
                    <Link to={getNewURL('tin-tuc', item.TieuDe, item?.ID)} className="mh-searchbox-item-image">
                      <Image src={getUrlImage(item?.AnhDaiDienUrl)} alt={item?.TieuDe} />
                    </Link>
                    <div className="mh-searchbox-item-info">
                      <Link to={getNewURL('tin-tuc', item.TieuDe, item?.ID)} className="mh-searchbox-item-title">
                        {item?.TieuDe}
                      </Link>
                      <div className="mh-searchbox-item-description" dangerouslySetInnerHTML={{ __html: item?.MoTa }} />
                    </div>
                    <div className="mh-searchbox-item-date">{vnFormatter(item?.NgayXuatBan)}</div>
                  </div>
                )}
                {item.Type == 'pdf-file' && (
                  <div className="mh-searchbox-item" key={item?.ID}>
                    <Link
                      to={getUrlPdfFile(item?.AnhDaiDienUrl)}
                      key={item?.AnhDaiDienUrl}
                      target="_blank"
                      className="mh-searchbox-item-image"
                    >
                      <IconPdfFile />
                    </Link>
                    <div className="mh-searchbox-item-info">
                      <Link
                        to={getUrlPdfFile(item?.AnhDaiDienUrl)}
                        key={item?.AnhDaiDienUrl + '1'}
                        target="_blank"
                        className="mh-searchbox-item-title"
                      >
                        {item?.TieuDe}
                      </Link>
                      <div className="mh-searchbox-item-description" dangerouslySetInnerHTML={{ __html: item?.MoTa }} />
                    </div>
                  </div>
                )}
              </Fragment>
            ))
          ) : (
            !loading && <div className="mh-searchbox-empty" role="status">{error || (slug ? t('common.no_data') : 'Nhập từ khóa để tìm kiếm thông tin.')}</div>
          )}

        </div>
        {!loading && !error && pagination?.totalPages >= 1 && (
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
