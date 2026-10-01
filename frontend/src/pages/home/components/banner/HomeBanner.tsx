/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ButtonIcon, ButtonSpecial } from '@/components';
import './HomeBanner.scss';
import { useEffect, useState, type ReactNode } from 'react';
import { HttpStatusCode } from 'axios';
import { getBoxHot, getHomeBanner } from '@/services/config';
import { getNewURL } from '@/utils/getSlugKey';
import Slider from 'react-slick';
import { getUrlImage } from '@/utils/image';
import { APP_DATA_CONFIG } from '@/configs';
import { getLang } from '@/services';
import { vnFormatter } from '@/utils';
interface HomeBannerWidget {
  isButton?: boolean;
  isSpecial?: boolean;
  label?: string;
  image?: string | ReactNode;
  alt?: string;
  url: string;
  urlTarget?: '_blank' | '';
  className?: string;
  order?: number;
}

interface NewsItem {
  ID: number;
  TieuDe: string;
  MoTa: string;
  NgayXuatBan: string; // or Date if you prefer to parse this into a Date object
  TenAnhDaiDien: string;
  AnhDaiDienUrl: string;
}
export const HomeBanner = () => {
  const [banners, setBanner] = useState<NewsItem[]>();
  const [loading, setLoading] = useState(true);

  const [widgets, setWidgets] = useState<HomeBannerWidget[]>([]);
  const [loadingWidgets, setLoadingWidgets] = useState(true);
  useEffect(() => {
    const fetchDidMoundData = async () => {
      try {
        const response = await getHomeBanner(
          getLang() === 'vi' ? APP_DATA_CONFIG.WIDGET.VI : APP_DATA_CONFIG.WIDGET.EN,
        );
        setWidgets(
          response?.data?.data?.map((item: any) => ({
            url: item?.URL || '/',
            image: getUrlImage(item?.AnhBannerUrl) || '',
            title: item?.TenBanner || '',
          })),
        );
      } catch (error) {
        console.log('err', error);
      } finally { setLoadingWidgets(false); }
    };
    fetchDidMoundData();
  }, []);

  const renderWidgets = (a: HomeBannerWidget[]) => {
    return a.map((item) => {
      if (item.isSpecial)
        return <ButtonSpecial key={item.url} className={item.className} to="/#" label="ĐẢNG BỘ NỘI VỤ" />;
      return item.isButton ? (
        <ButtonIcon
          key={item.url}
          linkProps={{ to: item.url }}
          icon={
            typeof item.image === 'string' ? (
              <div className="mh-home-banner-image">
                <Image src={item.image} alt={item.alt} loading="lazy" />
              </div>
            ) : (
              item.image
            )
          }
          label={item.label || ''}
          style={{ whiteSpace: 'nowrap', height: 64, justifyContent: 'center' }}
          className="mh-home-banner-image md"
          {...(item.order && { style: { order: item.order } })}
        />
      ) : (
        <Link
          key={item.url}
          to={item.url}
          className={item.className}
          {...(item.order && { style: { order: item.order } })}
        >
          {typeof item.image === 'string' ? <Image src={item.image} alt={item.alt} loading="lazy" fluid /> : item.image}
          {item.label ? <span>{item.label}</span> : <></>}
        </Link>
      );
    });
  };

  useEffect(() => {
    const fetchAppMenus = async () => {
      try {
        const response = await getBoxHot();
        if (response.status === HttpStatusCode.Ok) {
          setBanner(response.data.data);
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    void fetchAppMenus().finally(() => setLoading(false));
  }, []);

  const slideSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000, // 5s chuyển 1 lần
    speed: 500, // animation 0.5s (khuyên dùng)
  };
  return (
    <section className="mh-home-banner" aria-label="Bản tin nổi bật">
      <Container>
        <Row>
          <Col xl={8} className="mh-home-banner-slide">
            <div className="mh-home-banner-loading" aria-hidden="true" hidden={!loading} />
            {!loading && !!banners?.length && <Slider {...slideSettings}>
              {banners?.map((banner, index) => (
                <div className="mh-home-banner-card" key={banner.ID}>
                  <Link
                    to={getNewURL('tin-tuc', banner?.TieuDe || '', banner?.ID || '')}
                    className="mh-home-banner-card-image"
                  >
                    <Image src={getUrlImage(banner?.AnhDaiDienUrl)} alt={banner?.TieuDe} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" />
                  </Link>
                  <div className="mh-home-banner-card-info">
                    <Link
                      to={getNewURL('tin-tuc', banner?.TieuDe || '', banner?.ID || '')}
                      className="mh-home-banner-card-title"
                    >
                      {banner?.TieuDe}
                    </Link>
                    <div className="mh-home-banner-card-date">{vnFormatter(banner?.NgayXuatBan)}</div>
                  </div>
                </div>
              ))}
            </Slider>}
          </Col>
          <Col xl={4}>
            <div className="mh-home-banner-widget" style={loadingWidgets ? { minHeight: 360 } : undefined}>
              {renderWidgets(widgets)}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
