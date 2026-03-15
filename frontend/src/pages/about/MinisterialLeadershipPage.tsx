/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from 'react';
import { Col, Image, Modal, Row, Table, Spinner } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

import { PageHeader, Loading } from '@/components';
import { AboutBody } from './components/body/AboutBody';
import { getUrlImage } from '@/utils/image';
import { getLeadershipInfoDetail, getOrganizationStructureDetail } from '@/services/about';
import { useParams } from 'react-router-dom';
import { getIdFromSlug } from '@/utils/getSlugKey';
import { Helmet } from 'react-helmet-async';
import { vnFormatter } from '@/utils';

export const MinisterialLeadershipPage = () => {
  const { t } = useTranslation();

  // State to store the list of leaders
  const [data, setData] = useState<any>([]);

  // State to store specific leader details for the modal
  const [detail, setDetail] = useState<any>(undefined);

  // Loading states for better UX
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);

  // Extract the Minister (Rank/Hang = 1) from the data list
  // Safe check: ensure data is an array before searching
  const minister = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return null;
    return data.find((item: any) => item.Hang === 1) ?? null;
  }, [data]);

  // Extract other organization members (Rank/Hang != 1)
  const organizations = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item: any) => item.Hang !== 1);
  }, [data]);

  const { slug } = useParams<{ slug: string }>();

  // Handle click to fetch and show leader details
  const onClickDetail = async (id: string) => {
    if (!id) return;

    setIsDetailLoading(true);
    try {
      const result = await getLeadershipInfoDetail(id);
      if (result) {
        setDetail(result);
      }
    } catch (err) {
      console.error('Error fetching detail:', err);
    } finally {
      // Stop loading spinner regardless of success or failure
      setIsDetailLoading(false);
    }
  };

  // Fetch initial organization structure data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const keyQuery = getIdFromSlug(slug || '');
        const result = await getOrganizationStructureDetail(keyQuery + '');

        // Safety check: only set data if the result is an array
        if (Array.isArray(result)) {
          setData(result);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [slug]);

  // Render a loading spinner while fetching initial data
  if (isLoading) {
    return <Loading />;
  }

  // If no data and no minister found, return null to avoid rendering empty UI
  if (!minister && (!data || data.length === 0)) return null;

  return (
    <>
      <Helmet>
        <title>{t("seo.leadership")}</title>
      </Helmet>
      <PageHeader title={t("minister.title")} />
      <AboutBody>
        <div className="mh-about-org">
          {/* Minister Section */}
          {/* Conditional rendering: Only render if minister data exists */}
          {minister && (
            <div className="mh-about-org-head">
              <button type="button" className="mh-about-org-item lg" onClick={() => onClickDetail(minister.ID)}>
                <div className="mh-about-org-item-image">
                  <Image src={getUrlImage(minister.AnhDaiDien)} alt={minister.HoTenLanhDao} />
                </div>
                <div className="mh-about-org-item-info">
                  <div className="mh-about-org-item-position">{minister.ChucVi}</div>
                  <div className="mh-about-org-item-name">{minister.HoTenLanhDao}</div>
                </div>
              </button>
            </div>
          )}

          {/* Other Leaders Grid */}
          <Row>
            {organizations.map((item: any) => (
              <Col xl={4} lg={6} key={item.ID}>
                <button type="button" className="mh-about-org-item w-100" onClick={() => onClickDetail(item.ID)}>
                  <div className="mh-about-org-item-image">
                    <Image src={getUrlImage(item.AnhDaiDien)} alt={item.HoTenLanhDao} />
                  </div>
                  <div className="mh-about-org-item-info">
                    <div className="mh-about-org-item-position">{item.ChucVi}</div>
                    <div className="mh-about-org-item-name">{item.HoTenLanhDao}</div>
                  </div>
                </button>
              </Col>
            ))}
          </Row>
        </div>
      </AboutBody>

      {/* Detail Modal */}
      <Modal
        scrollable
        size="lg"
        className="mh-org-modal"
        show={!!detail} // Boolean cast to check if detail exists
        onHide={() => setDetail(undefined)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("minister.bio")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Show spinner inside modal if detail is loading */}
          {isDetailLoading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            <>
              {/* Optional chaining (?.) used for safety */}
              <div className="mh-org-modal-image">
                <Image src={getUrlImage(detail?.AnhDaiDien)} alt={detail?.HoTenLanhDao} />
              </div>
              <div className="mh-org-modal-info">
                <Table className="table" bordered={false}>
                  <tbody>
                    <tr>
                      <td style={{ width: '200px', fontWeight: 'bold', textAlign:"left" }}>{t("minister.username")}</td>
                      <td style={{ textAlign:"left" }}>{detail?.HoTenLanhDao ?? '-'}</td>
                    </tr>
                    {detail?.NgaySinh &&
                      <tr>
                        <td style={{ width: '200px', fontWeight: 'bold', textAlign:"left" }}>{t("minister.dateofbirth")}</td>
                        <td style={{ textAlign:"left" }}>{vnFormatter(detail?.NgaySinh) ?? '-'}</td>
                      </tr>
                    }
                    {detail?.DanToc &&
                      <tr>
                        <td style={{ width: '200px', fontWeight: 'bold', textAlign:"left" }}>{t("minister.race")}</td>
                        <td style={{ textAlign:"left" }}>{detail?.DanToc ?? '-'}</td>
                      </tr>
                    }
                    {detail?.TonGiao &&
                      <tr>
                        <td style={{ width: '200px', fontWeight: 'bold', textAlign:"left" }}>{t("minister.religion")}</td>
                        <td style={{ textAlign:"left" }}>{detail?.TonGiao ?? '-'}</td>
                      </tr>
                    }
                    {detail?.NguyenQuan &&
                      <tr>
                        <td style={{ width: '200px', fontWeight: 'bold', textAlign:"left" }}>{t("minister.hometown")}</td>
                        <td style={{ textAlign:"left" }}>{detail?.NguyenQuan ?? '-'}</td>
                      </tr>
                    }
                    {detail?.ChucVuDang &&
                      <tr>
                        <td style={{ width: '200px', fontWeight: 'bold', textAlign:"left" }}>{t("minister.dangrank")}</td>
                        <td style={{ textAlign:"left" }}>{detail?.ChucVuDang ?? '-'}</td>
                      </tr>
                    }
                    {detail?.ChucDanh &&
                      <tr>
                        <td style={{ width: '200px', fontWeight: 'bold', textAlign:"left" }}>{t("minister.level")}</td>
                        <td style={{ textAlign:"left" }}>{detail?.ChucDanh ?? '-'}</td>
                      </tr>
                    }
                    {detail?.NgayVaoDang &&
                      <tr>
                        <td style={{ width: '200px', fontWeight: 'bold', textAlign:"left" }}>{t("minister.joineddate")}</td>
                        <td style={{ textAlign:"left" }}>{vnFormatter(detail?.NgayVaoDang) ?? '-'}</td>
                      </tr>
                    }
                    {detail?.NgayVaoDangChinhThuc &&
                      <tr>
                        <td style={{ width: '200px', fontWeight: 'bold', textAlign:"left" }}>{t("minister.officialjoineddate")}</td>
                        <td style={{ textAlign:"left" }}>{vnFormatter(detail?.NgayVaoDangChinhThuc) ?? '-'}</td>
                      </tr>
                    }
                    {detail?.TrinhDo &&
                      <tr>
                        <td style={{ width: '200px', fontWeight: 'bold', textAlign:"left" }}>{t("minister.education")}</td>
                        <td style={{ textAlign:"left" }}>{detail?.TrinhDo ?? '-'}</td>
                      </tr>
                    }
                    {detail?.TrinhDoLLCT &&
                      <tr>
                        <td style={{ width: '200px', fontWeight: 'bold', textAlign:"left" }}>{t("minister.politicaleducation")}</td>
                        <td style={{ textAlign:"left" }}>{detail?.TrinhDoLLCT ?? '-'}</td>
                      </tr>
                    }
                  </tbody>
                </Table>

                {/* Render HTML safely using DOMPurify */}
                {detail?.TieuSuBanThan && (
                  <div
                    className="mt-3"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(detail.TieuSuBanThan),
                    }}
                  />
                )}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
