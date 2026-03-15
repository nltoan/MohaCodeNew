import { Link, type LinkProps } from 'react-router-dom';
import './ButtonSpecial.scss';
import { Image } from 'react-bootstrap';
import image from '../../assets/images/dang.png';
export interface ButtonSpecialProps extends LinkProps {
  icon?: string;
  label: string;
}
export const ButtonSpecial = ({ icon = image, label, ...props }: ButtonSpecialProps) => {
  return (
    <Link {...props} className={`mh-button-special ${props.className || ''}`}>
      <Image src={icon} alt={label} loading="lazy" />
      <span>{label}</span>
    </Link>
  );
};
