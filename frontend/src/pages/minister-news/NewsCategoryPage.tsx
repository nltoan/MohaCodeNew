import { LoadingFallback } from '@/components/LoadingFallback';
import { sanitizeHtml } from '@/utils/sanitizeHtml';
import { DublinCore } from '@/components/DublinCore';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Container, Image, Row } from 'react-bootstrap';
import '../news-shared/NewsPage.scss';
import { Pagination } from '@/components';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSettledStatus } from '@/hooks/useSettledStatus';
import { getUrlImage } from '@/utils/image';
import { vnFormatter } from '@/utils';
import { getPostsByCategory, getPostsByCategoryBybtid, getTopPostNews, getTopPostNewsBybtid } from '@/services/news';
import { getIdFromSlug, getNewURL } from '@/utils/getSlugKey';
import { useTranslation } from 'react-i18next';
import { MinisterSidebar, type MinisterSidebarItem } from '../minister/components/sidebar/Sidebar';
import { getLang } from '@/services';
import { MINISTER_DATA_CONFIG, getConfigId } from '@/configs';

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
  url: getNewURL('bo-truong/tin-tuc', item?.TieuDe, item?.ID),
  title: item?.TieuDe,
  date: vnFormatter(item?.NgayXuatBan),
  description: item?.MoTa || ""
});

export const NewsCategoryPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

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

  const [attempt, setAttempt] = useState(0);
  const topKey = `${slug}|${attempt}`;
  const [topStatus, settleTop] = useSettledStatus(topKey);
  const listKey = `${slug}|${pagination.activePage}|${pagination.pageSize}|${attempt}`;
  const [listStatus, settleList] = useSettledStatus(listKey);
  const [titlePage, setTitlePage] = useState('');
  const [categoryMetadata, setCategoryMetadata] = useState<{ MoTa?: string; NgayTao?: string }>();
  const [speechSidebar, setSpeechSidebar] = useState<MinisterSidebarItem[]>([]);
  const [staticSidebar, setStaticSidebar] = useState<MinisterSidebarItem[]>([]);

  useEffect(() => {
    const fetchPageData = async () => {
      try {

        // Fetch all data in parallel for better performance
        const [speechRes, staticRes] = await Promise.all([
          getPostsByCategory(getConfigId(MINISTER_DATA_CONFIG.HOME_SPEECH, getLang()), 1, 10),
          getPostsByCategory(getConfigId(MINISTER_DATA_CONFIG.HOME_OTHERS, getLang()), 1, 10),

        ]);

        if (staticRes?.data) {
          setStaticSidebar(staticRes?.data.map(mapResponseToItem));
        }

        // 3. Process Speech Sidebar
        if (speechRes?.data) {
          setSpeechSidebar(speechRes.data.map(mapResponseToItem));
        }
      } catch (error) {
        console.error('Error fetching Minister Home Page data:', error);
      }
    };

    fetchPageData();
  }, []);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        let id = getIdFromSlug(slug || '', 'btid');
        if(!id){
          id = getIdFromSlug(slug || '', 'id');
          const res = await getTopPostNews(id!, 4);
          const [main, ...cards] = res.topposts;
          if (!active) return;
          setTopPost({ main, cards: cards });
          setTitlePage(res.data.TenChuyenMuc);
          setCategoryMetadata(res.data);
        } else {
          const res = await getTopPostNewsBybtid(id!, 4);
          const [main, ...cards] = res.topposts;
          if (!active) return;
          setTopPost({ main, cards: cards });
          setTitlePage(res.data.TenChuyenMuc);
          setCategoryMetadata(res.data);
        }
        if (active) settleTop({ key: topKey, status: 'ready' });
      } catch (err) {
        if (active) settleTop({ key: topKey, status: 'error' });
        console.error(err);
      }
    };

    fetchData();
    return () => { active = false; };
  }, [slug, attempt, topKey, settleTop]);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        let id = getIdFromSlug(slug || '', 'btid');
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
          const resNew = await getPostsByCategoryBybtid(id!, pagination.activePage, pagination.pageSize);
          if (!active) return;
          setPagination((prev) => ({
            ...prev,
            news: resNew.data,
            totalPages: Math.ceil(resNew.totalCount / prev.pageSize),
          }));
        }
        if (active) settleList({ key: listKey, status: 'ready' });
      } catch (err) {
        if (active) settleList({ key: listKey, status: 'error' });
        console.error(err);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [pagination.activePage, pagination.pageSize, slug, attempt, listKey, settleList]);


  return (
    <div className="mh-news">
      <DublinCore title={titlePage} description={categoryMetadata?.MoTa} date={categoryMetadata?.NgayTao} dateKind="Created" allowAssignedDate />
      <Container>
        <Row>
          <Col xl={8}>
            <div className="mh-news-content">
              <div className="mh-news-header">
                <h1>{titlePage}</h1>
              </div>
              {(topStatus === 'loading' || listStatus === 'loading') && <LoadingFallback />}
              {(topStatus === 'error' || listStatus === 'error') && <div role="alert">Không tải được dữ liệu. <button type="button" onClick={() => setAttempt(value => value + 1)}>Thử lại</button></div>}
              {topStatus === 'ready' && listStatus === 'ready' && !topPost?.main?.ID && pagination.news.length === 0 && <div className="text-center">{t('common.no_data')}</div>}
              {topPost?.main?.ID && (
                <div className="mh-news-body">
                  <div className="mh-news-banner">
                    <Row>
                      <Col xl={12}>
                        <div className="mh-news-banner-main">
                          <Link
                            to={getNewURL('bo-truong/tin-tuc', topPost?.main?.TieuDe, topPost?.main?.ID)}
                            className="mh-news-banner-main-image"
                          >
                            <Image src={getUrlImage(topPost?.main?.AnhDaiDienUrl)} alt={topPost?.main?.TieuDe} />
                          </Link>

                          <div className="mh-news-banner-main-info">
                            <div className="mh-news-banner-main-title">
                              <Link to={getNewURL('bo-truong/tin-tuc', topPost?.main?.TieuDe, topPost?.main?.ID)}>
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
                        <Link to={getNewURL('bo-truong/tin-tuc', item.TieuDe, item?.ID)} className="mh-news-item-image">
                          <Image src={getUrlImage(item?.AnhDaiDienUrl)} alt={item?.TieuDe} loading="lazy" decoding="async" />
                        </Link>
                        <div className="mh-news-item-info">
                          <Link to={getNewURL('bo-truong/tin-tuc', item.TieuDe, item?.ID)} className="mh-news-item-title">
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
              <MinisterSidebar id={getConfigId(MINISTER_DATA_CONFIG.HOME_SPEECH, getLang())} items={speechSidebar} title={t('minister.home_page.speech')} scrollHeight={452} />
            </Col>
            <Col xl={12} style={{ marginTop: 20 }}>
              <MinisterSidebar id={getConfigId(MINISTER_DATA_CONFIG.HOME_OTHERS, getLang())} title={t('minister.home_page.others')} items={staticSidebar} />
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
