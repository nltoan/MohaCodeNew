/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CardSection } from '@/components';
import './HomeRefs.scss';
import { useEffect, useRef, useState } from 'react';
import { getHomeBanner } from '@/services/config';
import { getLang } from '@/services';
import { APP_DATA_CONFIG } from '@/configs/app-config';
import { getUrlImage } from '@/utils/image';
export interface HomeRefsSectionProps {
  title: string;
}
export const HomeRefsSection = ({ title }: HomeRefsSectionProps) => {
  const [items, setItems] = useState<any[]>([]);
  const slideRef = useRef<HTMLDivElement>(null);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const slide = slideRef.current;
    if (!slide || !items.length) return;
    const updateControls = () => {
      setCanPrevious(slide.scrollLeft > 1);
      setCanNext(slide.scrollLeft + slide.clientWidth < slide.scrollWidth - 1);
    };
    updateControls();
    slide.addEventListener('scroll', updateControls, { passive: true });
    const observer = new ResizeObserver(updateControls);
    observer.observe(slide);
    return () => {
      slide.removeEventListener('scroll', updateControls);
      observer.disconnect();
    };
  }, [items]);

  const moveSlide = (direction: number) => {
    const slide = slideRef.current;
    const card = slide?.querySelector<HTMLElement>('.mh-home-refs-item');
    if (slide && card) {
      slide.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: 'smooth' });
    }
  };

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
        console.error('err', error);
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
          <div className="mh-home-refs-carousel">
            {(canPrevious || canNext) && (
              <div className="mh-home-refs-controls">
                <button type="button" onClick={() => moveSlide(-1)} disabled={!canPrevious} aria-label={getLang() === 'vi' ? 'Trang thành phần trước' : 'Previous sites'}>‹</button>
                <button type="button" onClick={() => moveSlide(1)} disabled={!canNext} aria-label={getLang() === 'vi' ? 'Trang thành phần tiếp theo' : 'Next sites'}>›</button>
              </div>
            )}
          <div className="mh-home-refs-slide" ref={slideRef} tabIndex={0} aria-label={title}>
            {items?.map((item, index) => (
              <Link key={`${item?.url}-${index}`} to={item?.url} className="mh-home-refs-item">
                <span className="icon text-clamp-2">
                  <Image src={item?.image} alt={item?.title} loading="lazy" />
                </span>
                <span className="name">{item?.title}</span>
              </Link>
            ))}
          </div>
          </div>
        </CardSection>
      </Container>
    </section>
  );
};
