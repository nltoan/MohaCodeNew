import { CardSectionBanner } from '@/components/card-section/CardSectionBanner';
import './TopNews.scss';
import { Col, Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { getNewURL } from '@/utils/getSlugKey';
import { useTranslation } from 'react-i18next';
export interface MinisterTopNewsItem {
  url: string;
  image: string;
  title: string;
  date: string;
}
export interface MinisterTopNewsProps {
  id: string;
  title: string;
  items: MinisterTopNewsItem[];
}
export const MinisterTopNews = ({ id, title, items }: MinisterTopNewsProps) => {
    const { t } = useTranslation();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = useMemo(() => items[activeIndex], [activeIndex, items]);
  if(!activeItem){
    return <>{t("common.no_data")}</>;
  }
  return (
    <CardSectionBanner className="mh-minister-news" title={title} url={getNewURL('bo-truong/chuyen-muc', title, id)}>
      <Row>
        <Col lg={4}>
          <div className="mh-minister-news-card">
            <Link to={activeItem.url} className="mh-minister-news-card-image">
              <Image src={activeItem.image} alt={activeItem.title} />
            </Link>
            <Link to={activeItem.url} className="mh-minister-news-card-title">
              {activeItem.title}
            </Link>
            <Link to={activeItem.url} className="mh-minister-news-card-action">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.58 11.9999C15.58 13.9799 13.98 15.5799 12 15.5799C10.02 15.5799 8.41998 13.9799 8.41998 11.9999C8.41998 10.0199 10.02 8.41992 12 8.41992C13.98 8.41992 15.58 10.0199 15.58 11.9999Z"
                  stroke="#0070D7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 20.2707C15.53 20.2707 18.82 18.1907 21.11 14.5907C22.01 13.1807 22.01 10.8107 21.11 9.4007C18.82 5.8007 15.53 3.7207 12 3.7207C8.47003 3.7207 5.18003 5.8007 2.89003 9.4007C1.99003 10.8107 1.99003 13.1807 2.89003 14.5907C5.18003 18.1907 8.47003 20.2707 12 20.2707Z"
                  stroke="#0070D7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Chi tiết</span>
            </Link>
          </div>
        </Col>
        <Col lg={8}>
          <div className="mh-minister-news-body">
            <div className="mh-minister-news-items">
              {items.map((item, index) => (
                <div
                  key={item.title}
                  className={`mh-minister-news-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="mh-minister-news-item-title">{item.title}</div>
                  <div className="mh-minister-news-item-date">{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </CardSectionBanner>
  );
};
