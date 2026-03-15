import type { CSSProperties, ReactNode } from 'react';
import './CardSection.scss';
interface CardSectionProps {
  title?: string | ReactNode;
  headerAdditional?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}
export const CardSectionTitle = ({
  title,
  className = '',
  onClick,
}: {
  title: string | ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div className={`mh-section-title ${className}`} onClick={onClick}>
      {title}
    </div>
  );
};
export const CardSection = ({ title, headerAdditional, children, className = '', style }: CardSectionProps) => {
  return (
    <div className={`mh-section ${className}`} style={style}>
      <div className="mh-section-header">
        {title ? <CardSectionTitle title={title} /> : <></>}
        {headerAdditional}
      </div>
      {children}
    </div>
  );
};
