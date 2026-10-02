/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { CardSection, Loading } from '@/components';
import { Link, useParams } from 'react-router-dom';
import { getDocumentDetail, getDocumentDetailByqpid, getDocumentDetailBycdid, getDocumentDetailBytbid } from '@/services/documents';
import { getIdFromSlug } from '@/utils/getSlugKey';
import { vnFormatter } from '@/utils/dateUtils';
import DOMPurify from 'dompurify';
import { getUrlPdfFile } from '@/utils/image';
import { useTranslation } from 'react-i18next';
import { IconDocumentDownload } from '@/components/icons';
import { Helmet } from 'react-helmet-async';
import { APP_DATA_CONFIG } from '@/configs';

interface DocumentDetailState {
  documentNumber: string;
  summary: string;
  issueDate: string;
  documentType: string;
  field: string;
  issuingAuthority: string;
  signer: string;
  relatedDocuments: string;
  files: Array<{ name: string; url: string }>;
  content: string;
  lopvanbanid: string;
}

export const DocumentDetailPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<DocumentDetailState | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    try {
      let id = getIdFromSlug(slug, 'qpid');
      let response: any;
      if(!id){
        id = getIdFromSlug(slug, 'cdid');
        if(!id){
          id = getIdFromSlug(slug, 'tbid');
          if(!id){
            id = getIdFromSlug(slug, 'id');
            response = await getDocumentDetail(id + '');
          } else {
            response = await getDocumentDetailBytbid(id + '');
          }
        } else {
          response = await getDocumentDetailBycdid(id + '');
        }
      } else {
        response = await getDocumentDetailByqpid(id + '');
      }
      const data = response;

      if (data) {
        setDetail({
          documentNumber: data.SoKyHieu || '',
          summary: data.TrichYeu || '',
          issueDate: data.NgayBanHanh ? vnFormatter(data.NgayBanHanh) ?? '' : '',
          documentType: data.HinhThucVanBan?.TenHinhThucVanBan || '',
          field: data.VanBan_LinhVuc?.[0]?.LinhVuc?.TenLinhVuc || '',
          issuingAuthority: data.VanBan_CoQuanBanHanh?.[0]?.CoQuanBanHanh?.TenCoQuanBanHanh || '',
          signer: data.NguoiKy || '',
          relatedDocuments: data.VanBanLienQuan || '',
          files:
            data.VanBan_Files?.map((item: any) => ({
              name: item.File?.Ten || 'No Name',
              url: item.File?.LinkLuuTru || '#',
            })) || [],
          content: data.NoiDung || '',
          lopvanbanid: data.VanBan_LopVanBan?.[0]?.LopVanBan?.ID
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
          {t('seo.moha')} - {detail.documentNumber ?? t('seo.documentDetail')}
        </title>
      </Helmet>
      <Col xl={12}>
        <div className="document-detail-wrapper">
          <CardSection title={<h1 className="m-0 fs-4">{t('documents.detail.title')}</h1>}>
            <Table bordered responsive className="mb-0">
              <tbody>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.reference_number')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.documentNumber}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.summary_content')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.summary}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.issue_date')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.issueDate}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.document_type')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.documentType}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.area')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.field}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.issuing_authority')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.issuingAuthority}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.signer')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.signer}</td>
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
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t('documents.detail.related_documents')}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>{detail.relatedDocuments}</td>
                </tr>
              </tbody>
            </Table>
          </CardSection>

          <div className="mt-4 d-flex justify-content-end">
            <Link to={`/van-ban/${ detail.lopvanbanid == APP_DATA_CONFIG.DOCUMENT_DEFAULT_CATEGORY.CDDH ? 'van-ban-chi-dao' : 'van-ban-qppl' }/---id${detail.lopvanbanid}`} className="btn btn-outline-secondary px-4">
              {t('documents.detail.back_to_list')}
            </Link>
          </div>
        </div>
      </Col>
    </Row>
  );
};
