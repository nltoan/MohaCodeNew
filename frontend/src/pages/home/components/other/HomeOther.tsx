import { CardSection, CardSectionTitle, CommonModal } from '@/components';
import { IconEye, IconMessages } from '@/components/icons';
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HomeOther.scss';
import { getDocumentLegal } from '@/services/config';
import { HttpStatusCode } from 'axios';
import { getNewURL } from '@/utils/getSlugKey';
import { useTranslation } from 'react-i18next';
import SentFeedbackForm from './SentFeedbackForm';
import { vnFormatter } from '@/utils';
// import { getUrlPdfFile } from '@/utils/image';
interface TabItem {
  id: string | number;
  title: string;
  date: string;
  description?: string;
  url: string;
}
interface TabConfig {
  title: string | ReactNode;
}
export interface HomeOtherSectionProps {
  tab1: TabConfig;
  tab2: TabConfig;
  tab3: TabConfig;
  onDownload: (event: MouseEvent, item: TabItem) => void;
  onDisscuss: (event: MouseEvent, item: TabItem) => void;
}

interface Files {
  File: {
    Ten: string;
    LinkLuuTru: string;
  };
}

interface LegalDocument {
  ID: string;
  NoiDung: string;
  TieuDe: string;
  TenHinhThucVanBan: string;
  SoKyHieu: string;
  DangKhaDung: boolean;
  TrichYeu: string;
  NgayBanHanh: string;
  NgayBatDauLayYKien: string;
  NgayHetHanLayYKien: string;
  VanBan_Files: Files[];
  VanBanDuThao_Files: Files[];
}
export const HomeOtherSection = ({ tab1, tab2, tab3 }: HomeOtherSectionProps) => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(1);
  // chỉ đạo điều hành
  const [docsEDs, setDocsEDs] = useState<LegalDocument[]>([]);

  // Văn bản quy phạm pháp luật
  const [docsLegal, setDocsLegal] = useState<LegalDocument[]>([]);

  // LẤY Ý KIẾN DỰ THẢO
  const [docsSFO, setDocsSFO] = useState<LegalDocument[]>([]);
  const [openFBModal, setOpenFBModal] = useState(false);
  const [selectedVBDT, setSelectedVBDT] = useState('');

  useEffect(() => {
    const fetchDidMount = async () => {
      try {
        const response = await getDocumentLegal();
        if (response.status === HttpStatusCode.Ok) {
          setDocsEDs(response?.data?.cddhs);
          setDocsLegal(response?.data?.qppls);
          setDocsSFO(response?.data?.duthaos);
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchDidMount();
  }, []);

  const renderItems = (items: LegalDocument[]) => {
    return items?.map((item, idx) => (
      <div key={idx} className="mh-home-other-item">
        <Link to={getNewURL('van-ban', item.SoKyHieu, item.ID)} className="mh-home-other-item-summary">
          <div className="mh-home-other-item-title">{item.SoKyHieu ?? item.TrichYeu}</div>
        </Link>
        <Link to={getNewURL('van-ban', item.SoKyHieu, item.ID)} className="mh-home-other-item-description">
          <div className="mh-home-other-item-date">{vnFormatter(item.NgayBanHanh)}</div>
          <div dangerouslySetInnerHTML={{ __html: item.TrichYeu ?? item.NoiDung }}></div>
        </Link>
        <div className="mh-home-other-item-action">
          <Link to={getNewURL('van-ban', item.SoKyHieu, item.ID)}>
            <IconEye />
            <span>{t('common.view_document')}</span>
          </Link>
        </div>
      </div>
    ));
  };
  return (
    <section className="mh-home-other">
      <Container>
        <Row>
          <Col xl={6}>
            <CardSection
              className="mh-home-other-docs"
              headerAdditional={
                <>
                  <CardSectionTitle
                    title={tab1.title}
                    className={activeTab === 1 ? 'active' : ''}
                    onClick={() => setActiveTab(1)}
                  />

                  <CardSectionTitle
                    title={tab2.title}
                    className={activeTab === 2 ? 'active' : ''}
                    onClick={() => setActiveTab(2)}
                  />
                </>
              }
            >
              <div className="mh-section-body">
                <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>{renderItems(docsEDs)}</div>
                <div style={{ display: activeTab === 2 ? 'block' : 'none' }}>{renderItems(docsLegal)}</div>
              </div>
            </CardSection>
          </Col>
          <Col xl={6}>
            <CardSection className="mh-home-other-discussion" title={tab3.title}>
              <div className="mh-section-body">
                {docsSFO?.map((item, idx) => (
                  <div key={idx} className="mh-home-other-item">
                    <Link to={getNewURL('van-ban/du-thao', item.TieuDe, item.ID)} className="mh-home-other-item-summary">
                      <div className="mh-home-other-item-title">{item.TenHinhThucVanBan ?? ''}</div>
                    </Link>
                    <Link to={getNewURL('van-ban/du-thao', item.TieuDe, item.ID)} className="mh-home-other-item-description">
                      <div className={"mh-home-other-item-date" + (item.DangKhaDung ? "" : " mh-home-other-item-date-expired")}>{`${t("document.durationStart")}${vnFormatter(item.NgayBatDauLayYKien)}${t("document.durationEnd")}${vnFormatter(item.NgayHetHanLayYKien)}`}</div>
                      <div>{item.TieuDe}</div>
                    </Link>
                    {
                      item.DangKhaDung &&
                      <div className="mh-home-other-item-action">
                        <Link to="#" onClick={(e) => { e.preventDefault(); setSelectedVBDT(item.ID); setOpenFBModal(true); }} >
                          <IconMessages />
                          <span>{t('common.send_feedback')}</span>
                        </Link>
                      </div>
                    }
                  </div>
                ))}
              </div>
            </CardSection>
          </Col>
        </Row>
      </Container>

      <CommonModal show={openFBModal} onHide={() => setOpenFBModal(false)} title={t('common.feedback')} size="lg">
        <SentFeedbackForm ID={selectedVBDT} onSubmitted={() => {setOpenFBModal(false)}} />
      </CommonModal>
    </section>
  );
};
