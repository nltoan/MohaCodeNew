import { Col, Container, Row } from 'react-bootstrap';
import { ButtonImage } from '@/components';
import './HomeCTA.scss';
import { useEffect, useState } from 'react';
import { getHomeBanner, type BannerItem } from '@/services/config';
import { APP_DATA_CONFIG } from '@/configs';
import { HttpStatusCode } from 'axios';
import { getUrlImage } from '@/utils/image';
import { getLang } from '@/services';
export interface HomeCTASectionProps {
  main: { title1: string; title2: string; image: string };
  items: { title: string; url: string; image: string }[];
}
export const HomeCTASection = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);

  // http://mohaapi.tefli.vn/api/Public/BannerByViTri?ID_ViTri=3242
  useEffect(() => {
    const fetchDidMoundData = async () => {
      try {
        const response = await getHomeBanner(
          getLang() === 'vi' ? APP_DATA_CONFIG.NOTI_BANNER.VI : APP_DATA_CONFIG.NOTI_BANNER.EN,
        );
        if (response.status === HttpStatusCode.Ok) {
          setBanners(response.data.data);
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchDidMoundData();
  }, []);
  return (
    <section className="mh-home-cta">
      <Container>
        <Row>
          <Col lg={8}>
            <div className="mh-home-cta-banner">
              <ButtonImage
                    key={banners[0]?.ID}
                    linkProps={{ to: banners[0]?.URL }}
                    label={""}
                    style={{ backgroundImage: `url(${getUrlImage(banners[0]?.AnhBannerUrl)})` }}
                  />
            </div>
          </Col>
          <Col lg={4}>
            <div className="mh-home-cta-actions">
              {banners
                .filter((f, idx) => f.AnhBannerUrl && idx !== 0)
                .map((item, index) => (
                  <ButtonImage
                    key={item.ID}
                    linkProps={{ to: item.URL }}
                    label={item.TenBanner}
                    variant={`style-${index >= 2 ? 4 : index + 1}`}
                    style={{ backgroundImage: `url(${getUrlImage(item.AnhBannerUrl)})` }}
                  />
                ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
