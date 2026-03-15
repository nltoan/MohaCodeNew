import { CardSectionBanner } from '@/components/card-section/CardSectionBanner';
import { IconArrowLeft, IconArrowRight } from '@/components/icons';
import { NghiQuyetTW4MainCard } from '@/pages/nghiquyettw4/components/main-card/MainCard';
import { useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import './TopCategory.scss';
import { getNewURL } from '@/utils/getSlugKey';
import { useTranslation } from 'react-i18next';
export interface NghiQuyetTW4TopCategoryItem {
  url: string;
  image: string;
  title: string;
  description: string;
  date: string;
}
export interface NghiQuyetTW4TopCategoryProps {
  id: string;
  title: string;
  items: NghiQuyetTW4TopCategoryItem[];
}
export const NghiQuyetTW4TopCategory = ({ id, title, items }: NghiQuyetTW4TopCategoryProps) => {
  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = useMemo(() => items[activeIndex], [activeIndex, items]);
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };
  if (!activeItem) {
    return <>{t('common.no_data')}</>;
  }
  return (
    <CardSectionBanner title={title} url={getNewURL('bo-truong/chuyen-muc', title, id)} className="mh-nqtw4-cat">
      <div className="mh-nqtw4-cat-slide">
        <NghiQuyetTW4MainCard data={activeItem} />
        <button type="button" className="mh-nqtw4-cat-arrow prev" onClick={handlePrev}>
          <IconArrowLeft width={16} height={16} />
        </button>
        <button type="button" className="mh-nqtw4-cat-arrow next" onClick={handleNext}>
          <IconArrowRight width={16} height={16} />
        </button>
      </div>
      <Row>
        {items.map((item, index) => (
          <Col key={item.title} lg={4}>
            <div
              className={`mh-nqtw4-cat-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="mh-nqtw4-cat-item-title">{item.title}</div>
              <span className="mh-nqtw4-cat-item-date">{item.date}</span>
            </div>
          </Col>
        ))}
      </Row>
    </CardSectionBanner>
  );
};
