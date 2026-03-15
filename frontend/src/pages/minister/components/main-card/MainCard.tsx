import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './MainCard.scss';

export interface MinisterMainCardItem {
  url: string;
  image: string;
  title: string;
  description: string;
  date?: string;
}
export const MinisterMainCard = ({ data, showDate }: { showDate?: boolean; data: MinisterMainCardItem }) => {
  return (
    <div className="mh-minister-main-card">
      <Link to={data.url} className="mh-minister-main-card-image">
        <Image src={data.image} alt={data.title} />
      </Link>
      <div className="mh-minister-main-card-info">
        <Link to={data.url} className="mh-minister-main-card-title">
          {data.title}
        </Link>
        <div className="mh-minister-main-card-description">{data.description}</div>
        {showDate && data.date ? <div className="mh-minister-main-card-date">{data.date}</div> : <></>}
      </div>
    </div>
  );
};
