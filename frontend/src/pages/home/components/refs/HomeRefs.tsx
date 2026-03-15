/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CardSection } from '@/components';
import './HomeRefs.scss';
import { useEffect, useState } from 'react';
import { getHomeBanner } from '@/services/config';
import { getLang } from '@/services';
import { APP_DATA_CONFIG } from '@/configs/app-config';
import { getUrlImage } from '@/utils/image';
export interface HomeRefsSectionProps {
  title: string;
}
export const HomeRefsSection = ({ title }: HomeRefsSectionProps) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchDidMoundData = async () => {
      try {
        const response = await getHomeBanner(
          getLang() === 'vi' ? APP_DATA_CONFIG.OTHER_COMPONENT.VI : APP_DATA_CONFIG.OTHER_COMPONENT.EN,
        );
        setItems(
          response?.data?.data?.map((item: any) => ({
            url: item?.URL || '/',
            image: getUrlImage(item?.AnhBannerUrl) || '',
            title: item?.TenBanner || '',
          })),
        );
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchDidMoundData();
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="mh-home-refs">
      <Container>
        <CardSection title={title}>
          <div className="mh-home-refs-slide">
            {items?.map((item) => (
              <Link key={item?.url} to={item?.url} className="mh-home-refs-item">
                <span className="icon text-clamp-2">
                  <Image src={item?.image} alt={item?.title} loading="lazy" />
                </span>
                <span className="name">{item?.title}</span>
              </Link>
            ))}
          </div>
        </CardSection>
      </Container>
    </section>
  );
};
