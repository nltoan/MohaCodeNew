import { Col, Container, Image, Row } from 'react-bootstrap';
import './MediaSection.scss';
import { CardSectionBanner } from '@/components/card-section/CardSectionBanner';
import { IconPictureOne, IconPlayFill, IconPlayTwo } from '@/components/icons';
import { Link } from 'react-router-dom';
import { getPhotosByCategory, getVideosByCategory, getAudiosByCategory } from '@/services/multimedia';
import { useEffect, useState } from 'react';
import { MINISTER_DATA_CONFIG } from '@/configs';
import { getLang } from '@/services';
import { getNewURL } from '@/utils/getSlugKey';
import { getUrlImage } from '@/utils/image';
import { vnFormatter } from '@/utils';

export const MediaSection = () => {
  const [photos, setPhotos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getPhotosByCategory(getLang() === 'vi' ? MINISTER_DATA_CONFIG.PHOTO_CATEGORY.VI : MINISTER_DATA_CONFIG.PHOTO_CATEGORY.EN);
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
          const res = await getAudiosByCategory(getLang() === 'vi' ? MINISTER_DATA_CONFIG.AUDIO_CATEGORY.VI : MINISTER_DATA_CONFIG.AUDIO_CATEGORY.EN);
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
          const res = await getVideosByCategory(getLang() === 'vi' ? MINISTER_DATA_CONFIG.VIDEO_CATEGORY.VI : MINISTER_DATA_CONFIG.VIDEO_CATEGORY.EN);
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
              <Link to={getNewURL('video', (videos[0] as any).TieuDe, (videos[0] as any).ID)} className="mh-minister-media-main">
                <Image src={getUrlImage((videos[0] as any).UrlAnh)} alt={(videos[0] as any).TieuDe} />
                <div className="mh-minister-media-main-info">
                  <IconPictureOne />
                  <span>{(videos[0] as any).TieuDe}</span>
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
                    <Link to={getNewURL('photo', (photos[0] as any).TieuDe, (photos[0] as any).ID)} className="mh-minister-media-item">
                      <div className="mh-minister-media-item-image">
                        <Image src={getUrlImage((photos[0] as any).UrlAnh)} alt={(photos[0] as any).TieuDe} />
                      </div>
                      <div className="mh-minister-media-item-info">
                        <div className="mh-minister-media-item-title">
                          {(photos[0] as any).TieuDe}
                        </div>
                        <div className="mh-minister-media-item-date">{vnFormatter((photos[0] as any).ThoiGianXuatBan)}</div>
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
                    <Link to={getNewURL('audio', (audios[0] as any).TieuDe, (audios[0] as any).ID)} className="mh-minister-media-item">
                      <div className="mh-minister-media-item-image">
                        <Image src={getUrlImage((audios[0] as any).UrlAnh)} alt={(audios[0] as any).TieuDe} />
                      </div>
                      <div className="mh-minister-media-item-info">
                        <div className="mh-minister-media-item-title">
                          {(audios[0] as any).TieuDe}
                        </div>
                        <div className="mh-minister-media-item-date">{vnFormatter((audios[0] as any).ThoiGianXuatBan)}</div>
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
