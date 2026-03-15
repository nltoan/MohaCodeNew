import { NavDropdown, type NavDropdownProps } from 'react-bootstrap';
import { useState } from 'react';

export const HoverNavDropdown = ({ title, id, className, children }: NavDropdownProps) => {
  const [show, setShow] = useState(false);

  return (
    <NavDropdown
      title={title}
      id={id}
      show={show}
      className={className}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
    </NavDropdown>
  );
};
