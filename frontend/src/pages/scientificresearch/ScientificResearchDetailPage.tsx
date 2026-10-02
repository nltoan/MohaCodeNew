import { useEffect, useState, useCallback } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { CardSection, Loading } from '@/components';
import { Link, useParams } from 'react-router-dom';
import { getScientificResearchDetail, getScientificResearchDetailByoid } from '@/services/scientificresearch';
import { getIdFromSlug } from '@/utils/getSlugKey';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

interface ScientificResearchDetailState {
  tendetai: string;
  capquanly: string;
  linhvuc: string;
  donvichutri: string;
  thoigianthuchien: string;
  mota: string;
  noidung: string;
}

export const ScientificResearchDetailPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<ScientificResearchDetailState | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    try {
      let id = getIdFromSlug(slug, 'oid');
      let response: any;
      if(!id){
        id = getIdFromSlug(slug, 'id');
        response = await getScientificResearchDetail(id + '');
      } else {
        response = await getScientificResearchDetailByoid(id + '');
      }
      const data = response;

      if (data) {
        setDetail({
          tendetai: data.TenDeTai || '',
          capquanly: data.CapQuanLy || '',
          linhvuc: data.LinhVuc ||  '',
          donvichutri: data.DonViChuTri || '',
          thoigianthuchien: data.ThoiGianThucHien || '',
          mota: data.MoTa || '',
          noidung: data.NoiDung || '',
        });
      }
    } catch (error) {
      console.error('Error fetching scientific research details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (isLoading) return <Loading />;
  if (!detail) return <div className="p-4 text-center">{t("scientificresearch.detail.not_found")}</div>;

  const labelColumnStyle = {
    width: '25%',
    fontWeight: 600,
    backgroundColor: '#f8f9fa',
    color: '#333',
    verticalAlign: 'middle'
  };

  return (
    <Container className="py-4"><Row>
      <Col xl={12}>
        <div className="scientificresearch-detail-wrapper">
          <CardSection title={<h1 className="m-0 fs-4">{t("scientificresearch.title")}</h1>}>
            <Table bordered responsive className="mb-0">
              <tbody>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t("scientificresearch.detail.tendetai")}</td>
                  <td style={{textAlign:"left"}}>{detail.tendetai}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t("scientificresearch.detail.capquanly")}</td>
                  <td style={{textAlign:"left"}}>{detail.capquanly}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t("scientificresearch.detail.linhvuc")}</td>
                  <td style={{textAlign:"left"}}>{detail.linhvuc}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t("scientificresearch.detail.donvichutri")}</td>
                  <td style={{textAlign:"left"}}>{detail.donvichutri}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t("scientificresearch.detail.thoigianthuchien")}</td>
                  <td style={{textAlign:"left"}}>{detail.thoigianthuchien}</td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t("scientificresearch.detail.mota")}</td>
                  <td style={{ lineHeight: '1.6', textAlign: 'left' }}>
                    {detail.mota}
                  </td>
                </tr>
                <tr>
                  <td style={{...labelColumnStyle, textAlign:"left"}}>{t("scientificresearch.detail.noidung")}</td>
                  <td style={{textAlign:"left"}}>
                    <div
                      className="mt-3"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(detail?.noidung?.replace(/contenteditable="true"/g, 'contenteditable="false"')),
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardSection>

          <div className="mt-4 d-flex justify-content-end">
            <Link to="/nghien-cuu-khoa-hoc" className="btn btn-outline-secondary px-4">
              {t("documents.detail.back_to_list")}
            </Link>
          </div>
        </div>
      </Col>
    </Row></Container>
  );
};
