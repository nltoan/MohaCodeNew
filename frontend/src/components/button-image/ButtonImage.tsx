import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import './ButtonImage.scss';

export interface ButtonImageProps {
  linkProps?: LinkProps;
  target?: '_blank';
  label: string | ReactNode;
  variant?: 'style-1' | 'style-2' | 'style-3' | 'style-4' | string;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent) => void;
}
export const ButtonImage = ({ label, linkProps, variant = '', className = '', style, onClick }: ButtonImageProps) => {
  return linkProps ? (
    <Link {...linkProps} className={`mh-btn-img ${variant} ${className}`} style={style}>
      <span>{label}</span>
    </Link>
  ) : (
    <button type="button" className={`mh-btn-img ${variant} ${className}`} onClick={onClick} style={style}>
      <span>{label}</span>
    </button>
  );
};
