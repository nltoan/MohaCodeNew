import { CardSection } from '../card-section/CardSection';
import Slider from 'react-slick';
import './CardEvent.scss';
import { useEffect, useState } from 'react';
// import { Image } from "react-bootstrap";
import { HttpStatusCode } from 'axios';
import { getEvents } from '@/services/config';
import { IconCalendarEdit, IconDocumentDownload, IconDownloadOrange, IconLocation, IconProfile2User } from '../icons';
import { useTranslation } from 'react-i18next';
import { vnFormatter } from '@/utils';
import CommonModal from '../modal';
import { getUrlPdfFile } from '@/utils/image';
import { Link } from 'react-router-dom';
export interface CardEventProps {
  title: string;
}

interface ConferenceItem {
  ID: number;
  TenHoiThao: string;
  LoaiHoiThao: number;
  ThoiGianTu: string;
  ThoiGianDen: string;
  DonViTaiTro: string | null;
  DiaDiemToChuc: string;
  ThanhPhanThamGia: string;
  DonViToChucChinh: string | null;
  FileNoiDung: string | null;
  NoiDungThongTinMoi: string | null;
  ChoPhepDangKy: boolean | null;
  TrangThai: number;
  Lang: number;
  AnhDaiDien: string | null;
  Files: Files[];
}

interface Files {
  Ten: string;
  LinkLuuTru: string;
}

export const CardEvent = ({ title }: CardEventProps) => {
  const slideSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [openModal, setOpenModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Files[]>([]);

  const [events, setEvents] = useState<ConferenceItem[]>([]);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchAppMenus = async () => {
      try {
        const response = await getEvents();
        if (response.status === HttpStatusCode.Ok) {
          setEvents(response.data.data || []);
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchAppMenus();
  }, []);
  return (
    <div className="mh-card-event">
      <CardSection title={title}>
        <div className="mh-card-event-body">
          <Slider {...slideSettings}>
            {events?.length > 0 ? (
              events?.map((item) => (
                <div key={item.ID}>
                  <div className="mh-card-event-info">
                    <div className="mh-card-event-item">
                      <IconCalendarEdit />
                      <span>
                        <b>Thời gian:</b> {vnFormatter(item.ThoiGianDen)}
                      </span>
                    </div>
                    {item?.Files?.length > 1 &&
                      <div className="mh-card-event-item">
                        <span>
                          <b>
                            <Link
                              to={'#'}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedFiles(item.Files);
                                setOpenModal(true);
                              }}
                            >
                              <IconDownloadOrange />
                              <span>{t('common.download')}</span>
                            </Link>
                          </b>
                        </span>
                      </div>
                      
                    }
                    <div className="mh-card-event-item">
                      <IconLocation />
                      <span>
                        <b>Địa điểm:</b> {item.DiaDiemToChuc}
                      </span>
                    </div>
                    <div className="mh-card-event-item">
                      <IconProfile2User />
                      <span>
                        <b>Thành phần:</b> {item.ThanhPhanThamGia}
                      </span>
                    </div>
                  </div>
                  <strong>{item.TenHoiThao}</strong>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', width: '100%' }}>{t('common.no_data')}</div>
            )}
          </Slider>
        </div>
      </CardSection>
      <CommonModal show={openModal} onHide={() => setOpenModal(false)} title={t('common.file_download_list')} size="lg">
        <div className="file-list">
          {selectedFiles.length > 0 ? (
            selectedFiles.map((fileItem, idx) => (
              <div
                key={idx}
                className="file-item"
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #e0e0e0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                onClick={() => {
                  const url = getUrlPdfFile(fileItem.LinkLuuTru);
                  if (url) {
                    window.open(url, '_blank');
                  } else {
                    console.error('Invalid URL:', fileItem.LinkLuuTru);
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconDocumentDownload />
                  <span style={{ flex: 1, fontWeight: 500 }}>{fileItem.Ten}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>{t('common.no_data')}</div>
          )}
        </div>
      </CommonModal>
    </div>
  );
};
