/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, Col, Container, Image, Row } from 'react-bootstrap';
import './Gallery.scss';
import { CardSection, Pagination } from '@/components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUrlImage } from '@/utils/image';
import { vnFormatter } from '@/utils';
import { getMenuMultimedia, getPhotoAlbums } from '@/services/multimedia';
import { getNewURL } from '@/utils/getSlugKey';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface MediaItem {
  ID: number;
  TieuDe: string;
  MoTa: string;
  UrlAnh: string;
  ThoiGianXuatBan?: string;
}

export const PhotoGalleryPage = () => {
  const { t } = useTranslation();
  const [menu, setMenu] = useState<{ ID: string }[]>([]);
  const [pagination, setPagination] = useState({
    albums: [] as MediaItem[],
    activePage: 1,
    totalPages: 10,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPhotoAlbums(pagination.activePage, pagination.pageSize);
        setPagination((prev) => ({
          ...prev,
          albums: res.data,
          totalPages: Math.ceil(res.totalCount / prev.pageSize),
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [pagination.activePage, pagination.pageSize]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMenuMultimedia();
        setMenu(res.childs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mh-gallery">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{t('seo.photoLibrary')}</title>
      </Helmet>
      <Container>
        <Row>
          <Col xl={3}>
            <CardSection title="" className="noHeader">
              <div className="mh-document-accordion">
                <Accordion defaultActiveKey={[menu?.[0]?.ID]} alwaysOpen>
                  {menu.map((type: any) => (
                    <Accordion.Item eventKey={type.ID}>
                      <Accordion.Header className={type.SubChilds.length > 0 ? 'hasChild' : 'noChild'}>
                        <Image src={getUrlImage(type.IconDaiDien)} />
                        <Link to={type.URL} key={type.ID}>
                          {type.TenMenu}
                        </Link>
                      </Accordion.Header>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            </CardSection>
          </Col>
          <Col xl={9}>
            <div className="mh-gallery-content">
              <div className="mh-gallery-header">
                <h1>Thư viện Ảnh</h1>
              </div>
              {pagination?.albums && (
                <div className="mh-gallery-body">
                  <div className="mh-gallery-items">
                    {pagination?.albums?.map((item) => (
                      <div className="mh-gallery-item" key={item?.ID}>
                        <Link to={getNewURL('photo', item.TieuDe, item?.ID)} className="mh-gallery-item-image">
                          <Image src={getUrlImage(item?.UrlAnh)} alt={item?.TieuDe} />
                        </Link>
                        <div className="mh-gallery-item-info">
                          <Link to={getNewURL('photo', item.TieuDe, item?.ID)} className="mh-gallery-item-title">
                            {item?.TieuDe}
                          </Link>
                          <div
                            className="mh-gallery-item-description"
                            dangerouslySetInnerHTML={{ __html: item?.MoTa }}
                          />
                        </div>
                        <div className="mh-gallery-item-date">{vnFormatter(item?.ThoiGianXuatBan)}</div>
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
