import { Col, Container, Row } from 'react-bootstrap';
import { ButtonImage } from '@/components';
import './CTA.scss';
import { Link } from 'react-router-dom';
export interface MinisterCTASectionProps {
  main?: { title1: string; url: string; image: string };
  items: { title: string; url: string; image: string }[];
}
export const MinisterCTASection = ({ main, items }: MinisterCTASectionProps) => {
  return (
    <section className="mh-minister-cta">
      <Container>
        <Row>
          <Col lg={8}>
            <Link to={main?.url || '/'} className="mh-minister-cta-banner" style={{ backgroundImage: `url(${main?.image})`, cursor: "pointer" }}>
            </Link>
          </Col>
          <Col lg={4}>
            <div className="mh-minister-cta-actions">
              {items.map((item, index) => (
                <ButtonImage
                  key={item.title}
                  linkProps={{ to: item.url }}
                  label={item.title}
                  variant={`style-${index >= 2 ? 4 : index + 1}`}
                  style={{ backgroundImage: `url(${item.image})` }}
                />
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
