/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { CardSection, Loading } from '@/components';
import { Link, useParams } from 'react-router-dom';
import { getDraftLegalDocumentDetail, getDraftLegalDocumentDetailByoid } from '@/services/documents';
import { getIdFromSlug } from '@/utils/getSlugKey';
import { vnFormatter } from '@/utils/dateUtils';
import DOMPurify from 'dompurify';
import { getUrlPdfFile } from '@/utils/image';
import { useTranslation } from 'react-i18next';
import { IconDocumentDownload } from '@/components/icons';
import { Helmet } from 'react-helmet-async';

interface DocumentDetailState {
  title: string;
  summary: string;
  startDate: string;
  endDate: string;
  documentType: string;
  area: string;
  issuingAuthority: string;
  files: Array<{ name: string; url: string }>;
  content: string;
}

export const DraftLegalDetailPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<DocumentDetailState | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    try {
      let id = getIdFromSlug(slug, 'oid');
      let response: any;
      if(!id){
        id = getIdFromSlug(slug, 'id');
        response = await getDraftLegalDocumentDetail(id + '');
      } else {
        response = await getDraftLegalDocumentDetailByoid(id + '');
      }
      const data = response;

      if (data) {
        setDetail({
          title: data.TieuDe || '',
          summary: data.TrichYeu || '',
          startDate: data.NgayBatDauLayYKien ? vnFormatter(data.NgayBatDauLayYKien) ?? '' : '',
          endDate: data.NgayHetHanLayYKien ? vnFormatter(data.NgayHetHanLayYKien) ?? '' : '',
          documentType: data.HinhThucVanBan?.TenHinhThucVanBan || '',
          area: data.VanBanDuThao_LinhVucs?.[0]?.LinhVuc?.TenLinhVuc || '',
          issuingAuthority: data.VanBanDuThao_CoQuanBanHanhs?.[0]?.CoQuanBanHanh?.TenCoQuanBanHanh || '',
          files:
            data.VanBanDuThao_Files?.map((item: any) => ({
              name: item.File?.Ten || 'No Name',
              url: item.File?.LinkLuuTru || '#',
            })) || [],
          content: data.NoiDung || '',
        });
      }
    } catch (error) {
      console.error('Error fetching document details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (isLoading) return <Loading />;
  if (!detail) return <div className="p-4 text-center">{t('documents.detail.not_found')}</div>;

  const labelColumnStyle = {
    width: '25%',
    fontWeight: 600,
    backgroundColor: '#f8f9fa',
    color: '#333',
    verticalAlign: 'middle'
  };

  return (
    <Row>
      <Helmet>
        <title>
          {t('seo.moha')} - {detail.title ?? t('seo.documentDetail')}
        </title>
      </Helmet>
      <Col xl={12}>
        <div className="document-detail-wrapper">
          <CardSection title={<h1 className="m-0 fs-4">{t('documents.detail.title')}</h1>}>
            <Table bordered responsive className="mb-0">
              <tbody>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.subject')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.title}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.summary_content')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.summary}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.start_date')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.startDate}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.end_date')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.endDate}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.document_type')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.documentType}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.area')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.area}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.issuing_authority')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.issuingAuthority}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.download')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>
                    {detail.files && detail.files.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {detail.files.map((file, index) => (
                          <li key={index} className={index !== 0 ? 'mt-2' : ''}>
                            <a
                              href={getUrlPdfFile(file.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none d-flex align-items-center"
                              style={{ color: 'inherit', fontWeight: 500 }}
                            >
                              <IconDocumentDownload />
                              <i className="bi bi-download me-2"></i> {file.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted italic">{t('documents.detail.no_attachments')}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.document_detail')}</td>
                  <td style={{ textAlign: 'left' }}>
                    <div
                      className="mt-3"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(detail.content),
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardSection>

          <div className="mt-4 d-flex justify-content-end">
            <Link to={`/van-ban/du-thao-van-ban`} className="btn btn-outline-secondary px-4">
              {t('documents.detail.back_to_list')}
            </Link>
          </div>
        </div>
      </Col>
    </Row>
  );
};
