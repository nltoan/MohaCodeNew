import { CardSectionBanner } from '@/components/card-section/CardSectionBanner';
import { IconArrowLeft, IconArrowRight } from '@/components/icons';
import { MinisterMainCard } from '@/pages/minister/components/main-card/MainCard';
import { useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import './TopCategory.scss';
import { getNewURL } from '@/utils/getSlugKey';
import { useTranslation } from 'react-i18next';
export interface MinisterTopCategoryItem {
  url: string;
  image: string;
  title: string;
  description: string;
  date: string;
}
export interface MinisterTopCategoryProps {
  id: string;
  title: string;
  items: MinisterTopCategoryItem[];
}
export const MinisterTopCategory = ({ id, title, items }: MinisterTopCategoryProps) => {
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
    <CardSectionBanner title={title} url={getNewURL('bo-truong/chuyen-muc', title, id)} className="mh-minister-cat">
      <div className="mh-minister-cat-slide">
        <MinisterMainCard data={activeItem} />
        <button type="button" className="mh-minister-cat-arrow prev" onClick={handlePrev}>
          <IconArrowLeft width={16} height={16} />
        </button>
        <button type="button" className="mh-minister-cat-arrow next" onClick={handleNext}>
          <IconArrowRight width={16} height={16} />
        </button>
      </div>
      <Row>
        {items.map((item, index) => (
          <Col key={item.title} lg={4}>
            <div
              className={`mh-minister-cat-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="mh-minister-cat-item-title">{item.title}</div>
              <span className="mh-minister-cat-item-date">{item.date}</span>
            </div>
          </Col>
        ))}
      </Row>
    </CardSectionBanner>
  );
};
