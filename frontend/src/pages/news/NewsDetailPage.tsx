/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Container, Image, Row } from 'react-bootstrap';
import './NewsDetail.scss';
import { CardSection, PageHeader } from '@/components';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useRef, useMemo, useState } from 'react';
import { getDetailPost, getDetailPostByoid, getRelatedPost, getRelatedPostByoid } from '@/services/news';
import { getUrlImage, getUrlPdfFile } from '@/utils/image';
import { Pagination } from '@/components';
import { vnFormatter } from '@/utils/dateUtils';
import { IconPdfFile } from '@/components/icons';
import { getIdFromSlug, getNewURL } from '@/utils/getSlugKey';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';

interface BannerItem {
  ID: number;
  TieuDe: string;
  AnhDaiDienUrl: string;
  MoTa: string;
  NgayXuatBan?: string;
}
export const NewsDetailPage = () => {
  const { t } = useTranslation();
  const contentRef = useRef(null);
  const { slug } = useParams<{ slug: string }>();
  const [detail, setDetail] = useState<any>(null);
  const [fontSize, setFontSize] = useState<number>(16);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let id = getIdFromSlug(slug || '', 'oid');
        if(!id){
          id = getIdFromSlug(slug || '', 'id');
          const res = await getDetailPost(id || '');
          setDetail(res.data);
        } else {
          const res = await getDetailPostByoid(id || '');
          setDetail(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [slug]);

  const [pagination, setPagination] = useState({
    news: [] as BannerItem[],
    activePage: 1,
    totalPages: 10,
    pageSize: 6,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let id = getIdFromSlug(slug || '', 'oid');
        if(!id){
          id = getIdFromSlug(slug || '', 'id');
          const resNew = await getRelatedPost(id || '', pagination.activePage, pagination.pageSize);
          setPagination((prev) => ({
            ...prev,
            news: resNew.data,
            totalPages: Math.ceil(resNew.totalCount / prev.pageSize),
          }));
        } else {
          const resNew = await getRelatedPostByoid(id || '', pagination.activePage, pagination.pageSize);
          setPagination((prev) => ({
            ...prev,
            news: resNew.data,
            totalPages: Math.ceil(resNew.totalCount / prev.pageSize),
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [pagination.activePage, pagination.pageSize, slug]);

  const files = useMemo(() => {
    if (!detail?.TinTuc_Files.length) {
      return [];
    }
    return detail?.TinTuc_Files;
  }, [detail?.TinTuc_Files]);
  const plainDescription = detail?.MoTa ? detail.MoTa.replace(/<[^>]+>/g, '') : '';
  const imageUrl = detail?.AnhDaiDienUrl ? getUrlImage(detail.AnhDaiDienUrl) : 'https://moha.gov.vn/images/quoc-huy.svg';
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`${t('seo.moha')} - ${detail?.TieuDe ?? t('seo.home')}`}</title>
        <meta name="keywords" content={detail?.TuKhoa ?? 'Tieu De'} />
        <meta name="description" content={plainDescription ?? 'Mo Ta'} />
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={detail?.TieuDe} />
        <meta property="og:description" content={plainDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={getNewURL('tin-tuc', detail?.TieuDe, detail?.Id)} />
        <meta property="canonical" content={getNewURL('tin-tuc', detail?.TieuDe, detail?.Id)} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={detail?.TieuDe} />
        <meta name="twitter:description" content={plainDescription} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>
      {detail?.Type === 3 ? ///Emagazine
        <div className="mh-detail">
          <div className="mh-detail-content">
            <div
              style={{ fontSize: fontSize }}
              className="mh-detail-body"
              dangerouslySetInnerHTML={{ __html: detail?.NoiDung }}
            ></div>
          </div>
        </div>
        : /// not emagazine
        <div className="mh-detail">
          <Container>
            <Row>
              <Col span={24}>
                <div className="mh-detail-content printContentRef" ref={contentRef}>
                  <PageHeader
                    title={detail?.TieuDe}
                    viewCount={detail?.PageCount}
                    date={detail?.NgayXuatBan}
                    onPrint={handlePrint}
                    onDeZoomText={() => {
                      if (fontSize === 10) return;
                      setFontSize(fontSize - 2);
                    }}
                    onInZoomText={() => {
                      if (fontSize === 28) return;
                      setFontSize(fontSize + 2);
                    }}
                  />
                  <div style={{ fontSize: fontSize, fontWeight:"bold", paddingBottom:"20px" }} dangerouslySetInnerHTML={{ __html: detail?.MoTa }}></div>
                  <div
                    style={{ fontSize: fontSize }}
                    className="mh-detail-body"
                    dangerouslySetInnerHTML={{ __html: detail?.NoiDung.replace(/contenteditable="true"/g, 'contenteditable="false"') }}
                  ></div>
                  {files.length > 0 && 
                    <>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 5 }}>Tài liệu liên quan:</div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 15,
                          paddingBottom: 20,
                        }}
                      >
                        {files.map((file: any) => {
                          return (
                            <a href={getUrlPdfFile(file.File.LinkLuuTru)} target="_blank" className={`mh-page-footer-file`}>
                              <IconPdfFile />
                              <span>{file.File.Ten}</span>
                            </a>
                          );
                        })}
                      </div>
                    </>
                  }
                  {detail?.TacGia && 
                    <div style={{ fontSize: fontSize, fontWeight:"bold", paddingBottom:"20px" }}>{detail?.TacGia}</div>
                  }
                </div>
              </Col>
            </Row>
            <Col span={24}>
              <div className="mh-detail-sidebar">
                <CardSection title={t('news.relatedNews')}>
                  {pagination.news.map((item) => (
                    <Link
                      key={item.ID}
                      to={getNewURL('tin-tuc', item?.TieuDe, item?.ID)}
                      className="mh-detail-sidebar-item"
                    >
                      <div className="mh-detail-sidebar-item-image">
                        <Image src={getUrlImage(item.AnhDaiDienUrl)} alt={item.TieuDe} />
                      </div>
                      <div className="mh-detail-sidebar-item-info">
                        <div className="mh-detail-sidebar-item-title">{item.TieuDe}</div>
                        <div
                          className="mh-detail-sidebar-item-date"
                          dangerouslySetInnerHTML={{ __html: item.MoTa }}
                        ></div>
                        <div className="mh-detail-sidebar-item-date">{vnFormatter(item.NgayXuatBan)}</div>
                      </div>
                    </Link>
                  ))}
                </CardSection>
              </div>
            </Col>
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
          </Container>
        </div>}
    </>
  );
};
