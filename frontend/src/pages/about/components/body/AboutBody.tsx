/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, type ReactNode } from 'react';
import './AboutBody.scss';
interface AboutBodyProps {
  children: ReactNode;
}

// forwardRef takes the Props type and the Ref type
export const AboutBody = forwardRef<HTMLDivElement, AboutBodyProps>(({ children }, ref) => {
  return (
    <div ref={ref} className="mh-about-body">
      {children}
    </div>
  );
});

export const AboutBodyMinus = ({ children }: AboutBodyProps) => {
  return (
    <div className="mh-about-body" style={{ textAlign: 'center' }}>
      {children}
    </div>
  );
};
