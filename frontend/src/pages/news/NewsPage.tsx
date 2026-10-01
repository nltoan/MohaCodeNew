/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, Col, Container, Image, ListGroup, Row } from 'react-bootstrap';
import './NewsPage.scss';
import { CardSection, Pagination } from '@/components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUrlImage } from '@/utils/image';
import { vnFormatter } from '@/utils';
import { getMenuNew, getPostsByCategory, getTopPostNews } from '@/services/news';
import {  getNewURL } from '@/utils/getSlugKey';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { getLang } from '@/services';
import { APP_DATA_CONFIG } from '@/configs';
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
export const NewsPage = () => {
  const { t } = useTranslation();
  const keyQuery = getLang() === 'vi' ? APP_DATA_CONFIG.DEFAULT_NEWS_CATEGORY.VI : APP_DATA_CONFIG.DEFAULT_NEWS_CATEGORY.EN;
  const [menu, setMenu] = useState<[]>([]);

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

  const [titlePage, setTitlePage] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTopPostNews(keyQuery!, 4);
        const [main, ...cards] = res.topposts;
        setTopPost({ main, cards: cards });
        setTitlePage(res.data.TenChuyenMuc);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [keyQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resNew = await getPostsByCategory(keyQuery!, pagination.activePage, pagination.pageSize);
        setPagination((prev) => ({
          ...prev,
          news: resNew.data,
          totalPages: Math.ceil(resNew.totalCount / prev.pageSize),
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [pagination.activePage, pagination.pageSize, keyQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMenuNew();
        setMenu(res.childs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  const allKeys = menu?.map((item: any) => item.ID.toString()) || [];

  return (
    <div className="mh-news">
      <Helmet>
        <title>{`${t('seo.moha')} - ${titlePage ?? t('seo.home')}`}</title>
        <meta name="description" content={`${titlePage || 'Tin tức Bộ Nội vụ'}: cập nhật tin tức, hoạt động và thông tin chính sách trên Cổng thông tin điện tử Bộ Nội vụ.`} />
      </Helmet>
      <Container>
        <Row>
          <Col xl={3}>
            <CardSection title="" className="noHeader">
              <div className="mh-document-accordion">
                {menu.length > 0 && (
                  <Accordion defaultActiveKey={allKeys} alwaysOpen>
                    {menu?.map((type: any) => (
                      <Accordion.Item eventKey={type.ID.toString()} key={type.ID}>
                        <Accordion.Header className={type.children.length > 0 ? 'hasChild' : 'noChild'}>
                          {type.IconDaiDien && <Image src={getUrlImage(type.IconDaiDien)} />}{' '}
                          <Link to={type.URL} key={type.ID}>
                            {type.TenMenu}
                          </Link>
                        </Accordion.Header>
                        <Accordion.Body>
                          {type.children.length > 0 && (
                            <ListGroup variant="flush">
                              {type?.children.map((child: any) => (
                                <ListGroup.Item
                                  action
                                  key={child.ID}
                                  className="py-3 fw-semibold border-bottom"
                                  style={{ fontSize: '0.9rem' }}
                                >
                                  <Link to={getNewURL('chuyen-muc', child.TenChuyenMuc, child.ID)} key={child.ID} style={{ fontWeight: 400 }}>
                                    {child.TenChuyenMuc}
                                  </Link>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                )}
              </div>
            </CardSection>
          </Col>
          <Col xl={9}>
            <div className="mh-news-content">
              <div className="mh-news-header">
                <h1>{titlePage}</h1>
              </div>
              {!topPost?.main?.ID && <div className="text-center">{t('common.no_data')}</div>}
              {topPost?.main?.ID && (
                <div className="mh-news-body">
                  <div className="mh-news-banner">
                    <Row>
                      <Col xl={8}>
                        <div className="mh-news-banner-main">
                          <Link
                            to={getNewURL('tin-tuc', topPost?.main?.TieuDe, topPost?.main?.ID)}
                            className="mh-news-banner-main-image"
                          >
                            <Image src={getUrlImage(topPost?.main?.AnhDaiDienUrl)} alt={topPost?.main?.TieuDe} />
                          </Link>
                          <div className="mh-news-banner-main-info">
                            <div className="mh-news-banner-main-title">
                              <Link to={getNewURL('tin-tuc', topPost?.main?.TieuDe, topPost?.main?.ID)}>
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

                      <Col xl={4}>
                        <div className="mh-news-banner-cards">
                          {topPost?.cards?.map((item: BannerItem) => (
                            <Link
                              key={item?.ID}
                              to={getNewURL('tin-tuc', item.TieuDe, item?.ID)}
                              className="mh-news-banner-card"
                            >
                              <div className="mh-news-banner-card-image">
                                <Image src={getUrlImage(item?.AnhDaiDienUrl)} alt={item?.TieuDe} />
                              </div>

                              <div className="mh-news-banner-card-title">{item?.TieuDe}</div>
                            </Link>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="mh-news-items">
                    {pagination?.news?.map((item) => (
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
        </Row>
      </Container>
    </div>
  );
};
