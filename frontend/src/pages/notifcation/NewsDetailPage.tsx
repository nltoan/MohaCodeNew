/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Container, Row } from 'react-bootstrap';
import './NewsDetail.scss';
import { CardSection, PageHeader } from '@/components';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useRef, useMemo, useState } from 'react';
import { getNotificationPost } from '@/services/news';
import { getUrlPdfFile } from '@/utils/image';
import { vnFormatter } from '@/utils/dateUtils';
import { IconPdfFile } from '@/components/icons';
import { getIdFromSlug, getNewURL } from '@/utils/getSlugKey';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';

export const NewsDetailPage = () => {
  const { t } = useTranslation();
  const contentRef = useRef(null);
  const { slug } = useParams<{ slug: string }>();
  const [detail, setDetail] = useState<any>(null);
  const [relates, setRelates] = useState<any[]>([]);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  useEffect(() => {
    const keyQuery = getIdFromSlug(slug || '');
    if (keyQuery) {
      const fetchData = async () => {
        try {
          const res = await getNotificationPost(keyQuery);
          setDetail(res.data);
          setRelates(res.relates);
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }
  }, [slug]);

  const files = useMemo(() => {
    if (!detail?.ThongBao_Files.length) {
      return [];
    }
    return detail?.ThongBao_Files;
  }, [detail?.ThongBao_Files]);

  return (
    <div className="mh-detail">
      <Helmet>
        <title>
          {t('seo.moha')} - {detail?.TieuDe ?? t('seo.notify')}
        </title>
      </Helmet>
      <Container>
        <Row>
          <Col span={24}>
            <div className="mh-detail-content printContentRef" ref={contentRef}>
              <PageHeader
                title={detail?.TieuDe}
                viewCount={detail?.PageCount || 0}
                onPrint={handlePrint}
              />
              <div className="" dangerouslySetInnerHTML={{ __html: detail?.MoTa }}></div>
              <div className="mh-detail-body" dangerouslySetInnerHTML={{ __html: detail?.NoiDung }}></div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 5 }}>Tài liệu liên quan:</div>
              {files.length > 0 ? (
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
              ) : (
                <>{t('common.no_attachments')}</>
              )}
            </div>
          </Col>
        </Row>
        <Col span={24}>
          <div className="mh-detail-sidebar">
            <CardSection title="THÔNG BÁO LIÊN QUAN">
              {relates.map((item: any) => (
                <Link
                  key={item.ID}
                  to={getNewURL('thong-bao', item?.TieuDe, item?.ID)}
                  className="mh-detail-sidebar-item"
                >
                  <div className="mh-detail-sidebar-item-info">
                    <div className="mh-detail-sidebar-item-title">{item.TieuDe}</div>
                    <div
                      className="mh-detail-sidebar-item-date"
                      dangerouslySetInnerHTML={{ __html: item.NoiDung }}
                    ></div>
                    <div className="mh-detail-sidebar-item-date">{vnFormatter(item.NgayXuatBan)}</div>
                  </div>
                </Link>
              ))}
            </CardSection>
          </div>
        </Col>
      </Container>
    </div>
  );
};
