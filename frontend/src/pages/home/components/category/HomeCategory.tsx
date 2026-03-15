/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CardEvent, CardNotice, Loading, type CardEventProps, type CardNoticeProps } from '@/components';
import './HomeCategory.scss';
import { useEffect, useState } from 'react';
import { getBox8News, getHomeBanner, type BannerItem } from '@/services/config';
import { APP_DATA_CONFIG } from '@/configs';
import { HttpStatusCode } from 'axios';
import { getUrlImage } from '@/utils/image';
import { type NewsCategoryItem } from '@/services/config';
import { vnFormatter } from '@/utils';
import { getIdFromSlug, getNewURL } from '@/utils/getSlugKey';
import { getLang } from '@/services';
import { CardSectionBanner } from '@/components/card-section/CardSectionBanner';
export interface HomeCategorySectionProps {
  notice: CardNoticeProps;
  event: CardEventProps;
}
export const HomeCategorySection = ({ notice, event }: HomeCategorySectionProps) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [bannerSections, setBannerSections] = useState<NewsCategoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDidMoundData = async () => {
      setLoading(true);
      try {
        const response = await getHomeBanner(
          getLang() === 'vi' ? APP_DATA_CONFIG.HOME_BANNER.VI : APP_DATA_CONFIG.HOME_BANNER.EN,
        );
        if (response.status === HttpStatusCode.Ok) {
          setBanners(response.data.data);
        }
      } catch (error) {
        console.log('err', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDidMoundData();
  }, []);

  useEffect(() => {
    const fetchDidMoundData = async () => {
      setLoading(true);
      try {
        const response = await getHomeBanner(
          getLang() === 'vi' ? APP_DATA_CONFIG.BOX_8NEWS.VI : APP_DATA_CONFIG.BOX_8NEWS.EN,
        );
        if (response.status === HttpStatusCode.Ok && response.data.data.length > 0) {
          try {
            const cate = response.data.data[0];
            const id = getIdFromSlug(cate.URL);
            if(id !== null){
              const results = await getBox8News(id);
              if(results) {
                setBannerSections(results);
              }
            }
          } catch (error) {
            console.error('Có lỗi xảy ra trong quá trình chạy:', error);
          }
        }
      } catch (error) {
        console.log('err', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDidMoundData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="mh-home-cat">
      <Container>
        <div className="mh-home-cat-header">
          <Row>
            <Col xl={8}>
              <Row>
                {banners
                  .filter((_, index) => index < 3)
                  .map((item, index) => (
                    <Col key={item.ID} md={4}>
                      <Link
                        to={item.URL}
                        className={`style-${index + 1}`}
                        style={{
                          backgroundImage: `url(${getUrlImage(item?.AnhBannerUrl)})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <span>{item.TenBanner}</span>
                      </Link>
                    </Col>
                  ))}
              </Row>
            </Col>
            <Col xl={4}>
              <Row>
                {banners
                  .filter((_, index) => index >= 3)
                  .map((item, index) => (
                    <Col key={item.ID} xl={6} lg={3} xs={6}>
                      <Link
                        to={item.URL}
                        className={`sm style-${index + 1}`}
                        style={{
                          backgroundImage: `url(${getUrlImage(item.AnhBannerUrl)})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <span>{item.TenBanner}</span>
                      </Link>
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
        </div>
        <div className="mh-home-cat-body">
          <Row>
            <Col xl={8}>
              <Row className='mh-home-cat-content'>
                {bannerSections.map((b) => (
                  <Col key={b?.TenChuyenMuc} lg={6}>
                    {b?.TopPost && (
                      <CardSectionBanner title={b?.TenChuyenMuc} url={getNewURL('chuyen-muc', b?.TenChuyenMuc, b?.ID)}>
                        <Link to={getNewURL('tin-tuc', b?.TopPost?.TieuDe, b?.TopPost?.ID)} className="mh-home-cat-item">
                          <div className="mh-home-cat-item-image">
                            <Image src={getUrlImage(b?.TopPost?.AnhDaiDienUrl)} alt={b?.TopPost?.TenAnhDaiDien} />
                          </div>
                          <div className="mh-home-cat-item-info">
                            <div className="mh-home-cat-item-title">{b?.TopPost?.TieuDe}</div>
                            <div className="mh-home-cat-item-date">{vnFormatter(b?.TopPost?.NgayXuatBan)}</div>
                          </div>
                        </Link>
                      </CardSectionBanner>
                    )}
                  </Col>
                ))}
              </Row>
            </Col>
            <Col xl={4}>
              <div className="mh-home-cat-widget">
                <CardNotice {...notice} />
                <CardEvent {...event} />
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};
