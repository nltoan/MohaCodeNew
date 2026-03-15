import type { CSSProperties, ReactNode } from 'react';
import './CardSection.scss';
import { Link } from 'react-router-dom';
interface CardSectionProps {
  title?: string | ReactNode;
  headerAdditional?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  url?: string;
}
export const CardSectionTitle = ({
  title,
  className = '',
  url = "/"
}: {
  title: string | ReactNode;
  className?: string;
  url: string;
}) => {
  return (
    <Link to={url} className={`mh-section-title ${className}`} style={{ cursor: "pointer", textDecoration: "none" }}>
      {title}
    </Link>
  );
};
export const CardSectionBanner = ({ title, headerAdditional, children, className = '', style, url = "/" }: CardSectionProps) => {
  return (
    <div className={`mh-section ${className}`} style={style}>
      <div className="mh-section-header">
        {title ? <CardSectionTitle title={title} url={url} /> : <></>}
        {headerAdditional}
      </div>
      {children}
    </div>
  );
};
