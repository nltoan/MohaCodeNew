import { LoadingFallback } from '@/components/LoadingFallback';
import { sanitizeHtml } from '@/utils/sanitizeHtml';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Container, Image, Row } from 'react-bootstrap';
import './NewsPage.scss';
import { Pagination } from '@/components';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUrlImage } from '@/utils/image';
import { vnFormatter } from '@/utils';
import { getPostsByCategory, getPostsByCategoryBynqid, getTopPostNews, getTopPostNewsBynqid } from '@/services/news';
import { getIdFromSlug, getNewURL } from '@/utils/getSlugKey';
import { useTranslation } from 'react-i18next';
import { NghiQuyetTW4Sidebar, type NghiQuyetTW4SidebarItem } from '../nghiquyettw4/components/sidebar/Sidebar';
import { getLang } from '@/services';
import { NghiQuyetTW4_DATA_CONFIG } from '@/configs';

interface BannerItem {
  ID: number;
  TieuDe: string;
  AnhDaiDienUrl: string;
  MoTa: string;
  NgayXuatBan?: string;
}
interface NewsItem {
  ID: number;
  TieuDe: string;
  MoTa: string;
  AnhDaiDienUrl: string;
  NgayXuatBan?: string;
}

interface NewsItemBanner {
  id: string | number;
  image: string;
  url: string;
  title: string;
  date: string;
  description?: string;
}

const mapResponseToItem = (item: any): NewsItemBanner => ({
  id: item?.ID,
  image: getUrlImage(item?.AnhDaiDienUrl),
  url: getNewURL('nghi-quyet-tw4/tin-tuc', item?.TieuDe, item?.ID),
  title: item?.TieuDe,
  date: vnFormatter(item?.NgayXuatBan),
  description: item?.MoTa || ""
});

export const NewsCategoryPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const keyQuery = getIdFromSlug(slug || '') || '';

  const [topPost, setTopPost] = useState<{
    main: BannerItem;
    cards: BannerItem[];
  }>({
    main: {} as BannerItem,
    cards: [],
  });

  const [pagination, setPagination] = useState({
    news: [] as NewsItem[],
    activePage: 1,
    totalPages: 10,
    pageSize: 10,
  });

  const [listStatus, setListStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [titlePage, setTitlePage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [speechSidebar, setSpeechSidebar] = useState<NghiQuyetTW4SidebarItem[]>([]);
  const [staticSidebar, setStaticSidebar] = useState<NghiQuyetTW4SidebarItem[]>([]);

  useEffect(() => {
    const fetchPageData = async () => {
      try {

        // Fetch all data in parallel for better performance
        const [speechRes, staticRes] = await Promise.all([
          getPostsByCategory(getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_REPORT.VI : NghiQuyetTW4_DATA_CONFIG.HOME_REPORT.EN, 1, 10),
          getPostsByCategory(getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_CAPTURE.VI : NghiQuyetTW4_DATA_CONFIG.HOME_CAPTURE.EN, 1, 10),

        ]);

        if (staticRes?.data) {
          setStaticSidebar(staticRes?.data.map(mapResponseToItem));
        }

        // 3. Process Speech Sidebar
        if (speechRes?.data) {
          setSpeechSidebar(speechRes.data.map(mapResponseToItem));
        }
      } catch (error) {
        console.error('Error fetching NghiQuyetTW4 Home Page data:', error);
      }
    };

    fetchPageData();
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    setTopPost({ main: {} as BannerItem, cards: [] });
    const id = getIdFromSlug(slug || '', 'nqid');
    const fetchTop = () => id ? getTopPostNewsBynqid(id, 4) : getTopPostNews(keyQuery, 4);
    const request = fetchTop().catch(() => {
      if (!active) throw new Error('Section no longer active');
      return fetchTop();
    });
    request.then(response => {
      if (!active) return;
      const [main, ...cards] = response.topposts || [];
      setTopPost({ main, cards });
      setTitlePage(response.data?.TenChuyenMuc || 'Tin tức - sự kiện');
    }).catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [keyQuery, slug, attempt]);

  useEffect(() => {
    let active = true;
    setListStatus('loading');
    const fetchData = async () => {
      try {
        let id = getIdFromSlug(slug || '', 'nqid');
        if(!id){
          id = getIdFromSlug(slug || '', 'id');
          const resNew = await getPostsByCategory(id!, pagination.activePage, pagination.pageSize);
          if (!active) return;
          setPagination((prev) => ({
            ...prev,
            news: resNew.data,
            totalPages: Math.ceil(resNew.totalCount / prev.pageSize),
          }));
        } else {
          const resNew = await getPostsByCategoryBynqid(id!, pagination.activePage, pagination.pageSize);
          if (!active) return;
          setPagination((prev) => ({
            ...prev,
            news: resNew.data,
            totalPages: Math.ceil(resNew.totalCount / prev.pageSize),
          }));
        }
        if (active) setListStatus('ready');
      } catch (err) {
        if (active) setListStatus('error');
        console.error(err);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [pagination.activePage, pagination.pageSize, keyQuery, attempt]);


  return (
    <div className="mh-news">
      <Container>
        <Row>
          <Col xl={8}>
            <div className="mh-news-content">
              <div className="mh-news-header">
                <h1>{titlePage}</h1>
              </div>
              {(loading || listStatus === 'loading') && <LoadingFallback />}
              {(loadError || listStatus === 'error') && <div role="alert">Không tải được dữ liệu. <button type="button" onClick={() => setAttempt(value => value + 1)}>Thử lại</button></div>}
              {!loading && !loadError && listStatus === 'ready' && !topPost?.main?.ID && pagination.news.length === 0 && <div className="text-center">{t('common.no_data')}</div>}
              {topPost?.main?.ID && (
                <div className="mh-news-body">
                  <div className="mh-news-banner">
                    <Row>
                      <Col xl={12}>
                        <div className="mh-news-banner-main">
                          <Link
                            to={getNewURL('nghi-quyet-tw4/tin-tuc', topPost?.main?.TieuDe, topPost?.main?.ID)}
                            className="mh-news-banner-main-image"
                          >
                            <Image src={getUrlImage(topPost?.main?.AnhDaiDienUrl)} alt={topPost?.main?.TieuDe} />
                          </Link>

                          <div className="mh-news-banner-main-info">
                            <div className="mh-news-banner-main-title">
                              <Link to={getNewURL('nghi-quyet-tw4/tin-tuc', topPost?.main?.TieuDe, topPost?.main?.ID)}>
                                {topPost?.main?.TieuDe}
                              </Link>
                            </div>
                            {topPost?.main?.NgayXuatBan && (
                              <div className="mh-news-banner-main-date">
                                {vnFormatter(topPost?.main?.NgayXuatBan)}
                              </div>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="mh-news-items">
                    {pagination?.news?.map((item) => (
                      <div className="mh-news-item" key={item?.ID}>
                        <Link to={getNewURL('nghi-quyet-tw4/tin-tuc', item.TieuDe, item?.ID)} className="mh-news-item-image">
                          <Image src={getUrlImage(item?.AnhDaiDienUrl)} alt={item?.TieuDe} />
                        </Link>
                        <div className="mh-news-item-info">
                          <Link to={getNewURL('nghi-quyet-tw4/tin-tuc', item.TieuDe, item?.ID)} className="mh-news-item-title">
                            {item?.TieuDe}
                          </Link>
                          <div className="mh-news-item-description" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item?.MoTa) }} />
                        </div>
                        <div className="mh-news-item-date">{vnFormatter(item?.NgayXuatBan)}</div>
                      </div>
                    ))}
                  </div>

                  <Pagination
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
                </div>
              )}
            </div>
          </Col>
          <Col xl={4}>
            <Col xl={12}>
              <NghiQuyetTW4Sidebar id={getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_REPORT.VI : NghiQuyetTW4_DATA_CONFIG.HOME_REPORT.EN} items={speechSidebar} title={t('nghiquyettw4.home_page.report')} scrollHeight={452} />
            </Col>
            <Col xl={12} style={{ marginTop: 20 }}>
              <NghiQuyetTW4Sidebar id={getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_CAPTURE.VI : NghiQuyetTW4_DATA_CONFIG.HOME_CAPTURE.EN} title={t('nghiquyettw4.home_page.documentaryPhotography')} items={staticSidebar} />
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
