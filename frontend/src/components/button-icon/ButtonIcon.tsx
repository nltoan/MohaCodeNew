import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import './ButtonIcon.scss';
import { Image } from 'react-bootstrap';

export interface ButtonIconProps {
  linkProps?: LinkProps;
  target?: '_blank';
  icon?: ReactNode | string;
  label: string | ReactNode;
  style?: CSSProperties;
  className?: string;
  onClick?: (e: MouseEvent) => void;
}
export const ButtonIcon = ({ icon, label, linkProps, className = '', style, onClick }: ButtonIconProps) => {
  return linkProps ? (
    <Link {...linkProps} className={`mh-btn-icon ${className}`} style={style}>
      {typeof icon === 'string' ? <Image width={50} height={50} src={icon} alt="" /> : icon}
      <span>{label}</span>
    </Link>
  ) : (
    <button type="button" className={`mh-btn-icon ${className}`} style={style} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
};
