import type { ReactNode } from 'react';
import './AboutSection.scss';
interface AboutSectionProps {
  title: string;
  children: ReactNode;
}
export const AboutSection = ({ title, children }: AboutSectionProps) => {
  return (
    <div className="mh-about-section">
      <div className="mh-about-section-title">{title}</div>
      <div className="mh-about-section-body">{children}</div>
    </div>
  );
};
