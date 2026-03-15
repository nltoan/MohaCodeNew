import { Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import './AboutPage.scss';

export const AboutPage = () => {
  return (
    <div className="mh-about">
      <Container>
        <Row>
          <Col xl={12}>
            <div className="mh-about-content">
              <Outlet />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
