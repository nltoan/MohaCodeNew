import { Image, type ImageProps } from 'react-bootstrap';
import './CardImage.scss';
import { Link, type LinkProps } from 'react-router-dom';
import type { CSSProperties } from 'react';
export interface CardImageProps {
  image: ImageProps;
  linkProps?: LinkProps;
  style?: CSSProperties;
}
export const CardImage = ({ image, linkProps, style }: CardImageProps) => {
  return linkProps ? (
    <Link {...linkProps} className={`mh-card-image ${linkProps.className || ''}`}>
      <Image {...image} />
    </Link>
  ) : (
    <div className="mh-card-image" style={style}>
      <Image {...image} />
    </div>
  );
};
