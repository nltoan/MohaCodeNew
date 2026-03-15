import { Image, type ImageProps } from 'react-bootstrap';
import './HeaderBanner.scss';
import { Link } from 'react-router-dom';

export const HeaderBanner = ({ link, ...props }: ImageProps & { link?: string }) => {
  return props && props.src ? (
    <div className="mh-header-banner">
      <Link to={link || '#'} rel="noopener noreferrer">
        <Image loading="lazy" {...props} />
      </Link>
    </div>
  ) : <div></div>;
};
