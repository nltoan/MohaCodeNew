import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './MainCard.scss';

export interface NghiQuyetTW4MainCardItem {
  url: string;
  image: string;
  title: string;
  description: string;
  date?: string;
}
export const NghiQuyetTW4MainCard = ({ data, showDate }: { showDate?: boolean; data: NghiQuyetTW4MainCardItem }) => {
  return (
    <div className="mh-nqtw4-main-card">
      <Link to={data.url} className="mh-nqtw4-main-card-image">
        <Image src={data.image} alt={data.title} />
      </Link>
      <div className="mh-nqtw4-main-card-info">
        <Link to={data.url} className="mh-nqtw4-main-card-title">
          {data.title}
        </Link>
        <div className="mh-nqtw4-main-card-description">{data.description}</div>
        {showDate && data.date ? <div className="mh-nqtw4-main-card-date">{data.date}</div> : <></>}
      </div>
    </div>
  );
};
