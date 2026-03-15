import { Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useActiveMenu } from '@/hooks';
import './HeaderNavbar.scss';
import { HoverNavDropdown } from './HoverNavDropdown';
import { getLang } from '@/services';
import { useState } from 'react';
export interface HeaderMenu {
  label: string;
  id?: string;
  url?: string;
  children?: HeaderMenu[];
}
interface HeaderNavbarProps {
  menuTitle?: string;
  items: HeaderMenu[];
  className?: string;
}
export const HeaderNavbar = ({ menuTitle='', items, className }: HeaderNavbarProps) => {
  const { isActive } = useActiveMenu();
  const { pathname } = useLocation();
  menuTitle = (getLang() === 'vi' ? 'CHUNG MỤC' : 'MENU');
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);
  return (
    <Navbar expand="lg" bg="white" variant="light" className={`mh-header-navbar ${className}`}>
      <Container>
        {/* Toggle button */}
        <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />

        {/* Offcanvas */}
        <Navbar.Offcanvas id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" placement="start" show={showOffcanvas} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">{menuTitle}</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="justify-content-xl-center flex-grow-1">
              {items.map((item) => {
                const parentActive = isActive(item.url) || item.children?.some((child) => isActive(child.url));

                if (item.children?.length) {
                  return (
                    <HoverNavDropdown
                      key={item.id || item.label}
                      title={item.label}
                      id={item.id}
                      className={parentActive ? 'active' : ''}
                    >
                      {item.children.map((child) => (
                        <NavDropdown.Item
                          key={child.label}
                          as={NavLink}
                          onClick={handleClose}
                          to={child.url || '/#'}
                          className={isActive(child.url) ? 'active' : ''}
                        >
                          {child.label}
                        </NavDropdown.Item>
                      ))}
                    </HoverNavDropdown>
                  );
                }
                const hasProtocol = item?.url?.startsWith('http://') || item?.url?.startsWith('https://');

                if (hasProtocol) {
                  return <a className='nav-link' key={item.url} href={item.url}>{item.label}</a>;
                }

                if (item.url === "/bo-truong") {
                  return <Link to={item.url} key={item.url} className={`nav-link ${pathname === item.url ? 'active' : ''}`}>{item.label}</Link>
                }

                return (
                  <Nav.Link
                    key={item.label}
                    as={NavLink}
                    to={item.url || '/#'}
                    active={false}
                    onClick={handleClose}
                    className={isActive(item.url) ? 'active' : ''}
                  >
                    {item.label}
                  </Nav.Link>
                );
              })}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};
