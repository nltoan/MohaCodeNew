import { Col, Container, Image, Row } from 'react-bootstrap';
import './MediaSection.scss';
import { CardSectionBanner } from '@/components/card-section/CardSectionBanner';
import { IconPictureOne, IconPlayFill, IconPlayTwo } from '@/components/icons';
import { Link } from 'react-router-dom';
import { getPhotosByCategory, getVideosByCategory, getAudiosByCategory } from '@/services/multimedia';
import { useEffect, useState } from 'react';
import { MINISTER_DATA_CONFIG, getConfigId } from '@/configs';
import { getLang } from '@/services';
import { getNewURL } from '@/utils/getSlugKey';
import { getUrlImage } from '@/utils/image';
import { vnFormatter } from '@/utils';

interface MediaItem {
  ID: number;
  TieuDe: string;
  UrlAnh: string;
  ThoiGianXuatBan?: string;
}

export const MediaSection = () => {
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [audios, setAudios] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getPhotosByCategory(getConfigId(MINISTER_DATA_CONFIG.PHOTO_CATEGORY, getLang()));
          setPhotos(res.data);
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchData();
    }, []);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getAudiosByCategory(getConfigId(MINISTER_DATA_CONFIG.AUDIO_CATEGORY, getLang()));
          setAudios(res.data);
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchData();
    }, []);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getVideosByCategory(getConfigId(MINISTER_DATA_CONFIG.VIDEO_CATEGORY, getLang()));
          setVideos(res.data);
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchData();
    }, []);

  return (
    <div className="mh-minister-media">
      <Container>
        <div className="mh-minister-media-header">
          <Link to="/multimedia/video" className='mh-section-title' style={{ cursor: "pointer", textDecoration: "none", borderBottom: "none" }}>
            <IconPlayFill />
            <span>Video</span>
          </Link>
        </div>
        <Row>
          <Col xl={8}>
            {videos?.length > 0 &&
              <Link to={getNewURL('video', videos[0].TieuDe, videos[0].ID)} className="mh-minister-media-main">
                <Image src={getUrlImage(videos[0].UrlAnh)} alt={videos[0].TieuDe} />
                <div className="mh-minister-media-main-info">
                  <IconPictureOne />
                  <span>{videos[0].TieuDe}</span>
                </div>
              </Link>
            }
          </Col>

          <Col xl={4}>
            <Row>
              <Col xl={12} lg={6} xs={12}>
                <CardSectionBanner
                  url='/multimedia/photo'
                  title={
                    <>
                      <IconPictureOne />
                      <span>PHOTOS</span>
                    </>
                  }
                >
                  {photos?.length > 0 && 
                    <Link to={getNewURL('photo', photos[0].TieuDe, photos[0].ID)} className="mh-minister-media-item">
                      <div className="mh-minister-media-item-image">
                        <Image src={getUrlImage(photos[0].UrlAnh)} alt={photos[0].TieuDe} />
                      </div>
                      <div className="mh-minister-media-item-info">
                        <div className="mh-minister-media-item-title">
                          {photos[0].TieuDe}
                        </div>
                        <div className="mh-minister-media-item-date">{vnFormatter(photos[0].ThoiGianXuatBan)}</div>
                      </div>
                    </Link>
                  }
                </CardSectionBanner>
              </Col>

              <Col xl={12} lg={6} xs={12}>
                <CardSectionBanner
                  url='/multimedia/audio'
                  title={
                    <>
                      <IconPlayTwo />
                      <span>Audio</span>
                    </>
                  }
                >
                  {audios?.length > 0 &&
                    <Link to={getNewURL('audio', audios[0].TieuDe, audios[0].ID)} className="mh-minister-media-item">
                      <div className="mh-minister-media-item-image">
                        <Image src={getUrlImage(audios[0].UrlAnh)} alt={audios[0].TieuDe} />
                      </div>
                      <div className="mh-minister-media-item-info">
                        <div className="mh-minister-media-item-title">
                          {audios[0].TieuDe}
                        </div>
                        <div className="mh-minister-media-item-date">{vnFormatter(audios[0].ThoiGianXuatBan)}</div>
                      </div>
                    </Link>
                  }
                </CardSectionBanner>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
