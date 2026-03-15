import { useEffect, useState } from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HomeMedia.scss';
import { HttpStatusCode } from 'axios';
import { getMedias } from '@/services/config';
import Slider from 'react-slick';
import type { ReactNode } from 'react';
import { vnFormatter } from '@/utils';
import { IconPlayFill } from '@/components/icons';
import { getUrlImage } from '@/utils/image';
import { CardSectionBanner } from '@/components/card-section/CardSectionBanner';
export interface HomeMediaSectionProps {
  icon?: string | ReactNode;
  title: string;
}
export interface PostItem {
  image: string;
  title: string;
  url: string;
  date?: string;
}
export interface MediaCategoryItem {
  tabs: { icon: string | ReactNode; label: string; url: string }[];
  posts: PostItem[];
  categories: { icon: string | ReactNode; title: string; url: string; items: PostItem[] }[];
}
export const HomeMediaSection = ({ icon = <IconPlayFill />, title }: HomeMediaSectionProps) => {
  const slideSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const slideSettings2 = {
    dots: true,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 10000, // 5s chuyển 1 lần
    speed: 500, // animation 0.5s (khuyên dùng)
  };

  const [mediaCategoryItem, setMediaCategoryItem] = useState<MediaCategoryItem>();
  useEffect(() => {
    const fetchAppMenus = async () => {
      try {
        const response = await getMedias();
        if (response.status === HttpStatusCode.Ok) {
          setMediaCategoryItem(response?.data);
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchAppMenus();
  }, []);

  if (!mediaCategoryItem || !mediaCategoryItem.posts || mediaCategoryItem.posts.length === 0) {
    return null;
  }

  return (
    <section className="mh-home-media">
      <div className="mh-home-media-header">
        <Container>
          <div className="mh-home-media-header-top">
            <div className="mh-home-media-header-title">
              {typeof icon === 'string' ? <Image src={icon} alt="" /> : icon}
              <span>{title}</span>
            </div>
            <div className="mh-home-media-header-menu">
              {mediaCategoryItem?.tabs?.map((item) => (
                <Link key={item.label} to={item.url} className="mh-home-media-header-menu-item">
                  {typeof item.icon === 'string' ? <Image src={getUrlImage(item.icon)} alt="" /> : item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mh-home-media-header-slide">
            <Slider {...slideSettings2}>
              {mediaCategoryItem?.posts?.map((item) => (
                <div className="mh-home-media-header-slide-card">
                  <Link to={item.url} className="mh-home-media-header-slide-card-image">
                    <Image src={getUrlImage(item.image)} loading="lazy" />
                    <div className="mh-home-media-header-slide-card-title">{item.title}</div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </Container>
      </div>

      <div className="mh-home-media-body">
        <Container>
          <Row>
            {mediaCategoryItem?.categories?.map((item) => (
              <Col key={item.title} lg={6}>
                <CardSectionBanner url={item.url}
                  title={
                    <>
                      {typeof item.icon === 'string' ? <Image src={getUrlImage(item.icon)} alt="" /> : item.icon}
                      <span>{item.title}</span>
                    </>
                  }
                >
                  <div className="mh-home-media-slide">
                    <Slider {...slideSettings}>
                      {item.items?.map((p) => (
                        <div className="d-flex" key={p.title}>
                          <Link key={p.url} to={p.url} className="mh-media-card">
                            <div className="mh-media-card-image">
                              {p.image && <Image src={getUrlImage(p.image)} alt={p.title} />}
                            </div>
                            <div className="mh-media-card-info">
                              <h4>{p.title}</h4>
                              {p?.date && <p>{vnFormatter(p?.date)}</p>}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </CardSectionBanner>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </section>
  );
};
