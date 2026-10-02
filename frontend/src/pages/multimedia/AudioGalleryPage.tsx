import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Accordion, Col, Container, Image, Row } from 'react-bootstrap';
import './Gallery.scss';
import { CardSection, Loading, Pagination } from '@/components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUrlImage } from '@/utils/image';
import { vnFormatter } from '@/utils';
import { getMenuMultimedia, getAudioAlbums } from '@/services/multimedia';
import { getNewURL } from '@/utils/getSlugKey';

interface MediaItem {
  ID: number;
  TieuDe: string;
  MoTa: string;
  UrlAnh: string;
  ThoiGianXuatBan?: string;
}

export const AudioGalleryPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [menu, setMenu] = useState<{ ID: string }[]>([]);
  const [pagination, setPagination] = useState({
    albums: [] as MediaItem[],
    activePage: 1,
    totalPages: 0,
    pageSize: 10,
  });

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await getAudioAlbums(pagination.activePage, pagination.pageSize);
        if (!active) return;
        setPagination((prev) => ({
          ...prev,
          albums: res.data || [],
          totalPages: Math.ceil(res.totalCount / prev.pageSize),
        }));
      } catch (err) {
        if (active) setError(true);
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [pagination.activePage, pagination.pageSize]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMenuMultimedia();
        setMenu(res.childs || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mh-gallery">
      <Helmet><title>{t('seo.audioLibrary')}</title></Helmet>
      <Container>
        <Row>
          <Col xl={3}>
            <CardSection title="" className='noHeader'>
              <div className="mh-document-accordion">
                <Accordion defaultActiveKey={[menu?.[0]?.ID]} alwaysOpen>
                  {menu.map((type: any) => (
                    <Accordion.Item key={type.ID} eventKey={type.ID}>
                      <Accordion.Header className={type.SubChilds?.length > 0 ? "hasChild" : "noChild"}>
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
                <h1>Thư viện Audio</h1>
              </div>
              {loading && <Loading />}
              {!loading && (error || pagination.albums.length === 0) && <p role="status">{error ? 'Không thể tải thư viện. Vui lòng thử lại sau.' : 'Chưa có nội dung trong thư viện.'}</p>}
              {!loading && !error && pagination.albums.length > 0 && (
                <div className="mh-gallery-body">
                  <div className="mh-gallery-items">
                    {pagination?.albums?.map((item) => (
                      <div className="mh-gallery-item" key={item?.ID}>
                        <Link to={getNewURL('audio', item.TieuDe, item?.ID)} className="mh-gallery-item-image">
                          <Image src={getUrlImage(item?.UrlAnh)} alt={item?.TieuDe} loading="lazy" />
                        </Link>
                        <div className="mh-gallery-item-info">
                          <Link to={getNewURL('audio', item.TieuDe, item?.ID)} className="mh-gallery-item-title">
                            {item?.TieuDe}
                          </Link>
                          <div className="mh-gallery-item-description" dangerouslySetInnerHTML={{ __html: item?.MoTa }} />
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
