/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ReactNode } from 'react';
import './HomeInteract.scss';
import {
  ButtonIcon,
  ButtonImage,
  CardQuickLinks,
  CardSection,
  type ButtonIconProps,
  type ButtonImageProps,
} from '@/components';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconMessageQuestion } from '@/components/icons';
import { getHomeBanner, getPhanAnhKienNghi, getPhanAnhKienNghiCuTri } from '@/services/config';
import { HttpStatusCode } from 'axios';
import { getUrlImage } from '@/utils/image';
import { APP_DATA_CONFIG } from '@/configs';
import { getLang } from '@/services';
import { useTranslation } from 'react-i18next';
export interface HomeInteractSectionProps {
  title: string;
  chartArea: ReactNode;
  quickActions?: ButtonIconProps[];
  ads?: { image: string; url: string };
}

export const HomeInteractSection = ({ title }: HomeInteractSectionProps) => {
  const { t } = useTranslation();
  
  const [phanAnhKienNghi, setPhanAnhKienNghi] = useState<any[]>([]);
  const [phanAnhKienNghiCuaCuTri, setPhanAnhKienNghiCuaCuTri] = useState<any[]>([]);

  const [quickLinks, setQuickLinks] = useState<ButtonImageProps[]>([]);
  const [chartArea, setChartArea] = useState<{ image: string }[]>([]);
  const [quickActions, setQuickActions] = useState<ButtonImageProps[]>([]);

  useEffect(() => {
    const fetchDidMoundData = async () => {
      try {
        const response = await getHomeBanner(
          getLang() === 'vi' ? APP_DATA_CONFIG.CHART_AREA.VI : APP_DATA_CONFIG.CHART_AREA.EN,
        );
        if (response.status === HttpStatusCode.Ok) {
          setChartArea(
            response.data.data.map((f) => {
              return {
                image: getUrlImage(f.AnhBannerUrl) || '',
              };
            }),
          );
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchDidMoundData();
  }, []);

  useEffect(() => {
    const fetchDidMoundData = async () => {
      try {
        const response = await getHomeBanner(
          getLang() === 'vi' ? APP_DATA_CONFIG.QUICK_LINK_DOWN.VI : APP_DATA_CONFIG.QUICK_LINK_DOWN.EN,
        );
        if (response.status === HttpStatusCode.Ok) {
          setQuickLinks(
            response.data.data.map((f) => {
              return {
                linkProps: { to: f.URL },
                style: {
                  backgroundImage: `url(${getUrlImage(f.AnhBannerUrl)}`,
                },
                label: f.TenBanner,
              };
            }),
          );
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchDidMoundData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await getPhanAnhKienNghi();
        if (response1.status === HttpStatusCode.Ok) {
          setPhanAnhKienNghi(response1.data.map((item: any) => {
            return {title: item.title, description: item.description, link: item.link, address: item.address, appointment_date: item.appointment_date, date: item.date};
          }));
        }

        const response2 = await getPhanAnhKienNghiCuTri();
        if (response2.status === HttpStatusCode.Ok) {
          setPhanAnhKienNghiCuaCuTri(response2.data.map((item: any) => {
            return {title: item.title, description: item.description, link: item.link};
          }));
        }
      } catch (error) {
        console.log('err', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDidMoundData = async () => {
      try {
        const response = await getHomeBanner(getLang() === 'vi' ? APP_DATA_CONFIG.QUICK_ACTION.VI : APP_DATA_CONFIG.QUICK_ACTION.EN);
        setQuickActions(
          response?.data?.data?.map((item: any) => ({
            linkProps: { to: item?.URL || '/' },
            icon: getUrlImage(item?.AnhBannerUrl) || '',
            label: String(item?.TenBanner || ''),
          })),
        );
      } catch (error) {
        console.log('err', error);
      }
    }
    fetchDidMoundData();
  }, []);

  return (
    <section className="mh-home-interact">
      <Container>
        <Row>
          <Col xl={8}>
            <CardSection title={title}>
              <Row>
                <Col lg={6}>
                  <div className="mh-home-interact-header" style={{ marginBottom: 5 }}>
                    <div className="mh-home-interact-title">{t("home.feedback")}</div>
                  </div>
                  <ul className="mh-home-interact-items">
                    {phanAnhKienNghi?.length > 0 && phanAnhKienNghi.map((item, idx) => (
                      <li key={idx}>
                        <Link target="_blank" to={item.link}>
                          <IconMessageQuestion width={32} height={32} />
                          <div>
                            <b>{item.title}</b>
                          </div>
                          <IconArrowRight width={16} height={16} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mh-home-interact-header" style={{ marginTop: 30, marginBottom: 5 }}>
                    <div className="mh-home-interact-title">{t("home.petition")}</div>
                  </div>
                  <ul className="mh-home-interact-items">
                    {phanAnhKienNghiCuaCuTri?.length > 0 && phanAnhKienNghiCuaCuTri.map((item, idx) => (
                      <li key={idx}>
                        <Link target="_blank" to={item.link}>
                          <IconMessageQuestion width={32} height={32} />
                          <div>
                            <b>{item.title}</b>
                          </div>
                          <IconArrowRight width={16} height={16} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col lg={6}>
                  <div className="mh-home-interact-chart">{<Image src={chartArea?.[0]?.image} alt="" />}</div>
                  {quickActions?.map((item, index) => (
                    <ButtonIcon key={index} {...item} />
                  ))}
                </Col>
              </Row>
            </CardSection>
          </Col>
          <Col xl={4}>
            <Row>
              <Col xl={12} lg={6}>
                <CardQuickLinks />
              </Col>
              <Col xl={12} lg={6}>
                {quickLinks.map((item, index) => (
                  <ButtonImage key={index} {...item} variant={`style-${index >= 2 ? 4 : index + 1}`} />
                ))}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
