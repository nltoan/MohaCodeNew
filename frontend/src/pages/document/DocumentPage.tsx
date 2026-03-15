import { Container } from 'react-bootstrap';
import './DocumentPage.scss';
import { Outlet } from 'react-router-dom';
export const DocumentPage = () => {
  return (
    <div className="mh-document">
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};
