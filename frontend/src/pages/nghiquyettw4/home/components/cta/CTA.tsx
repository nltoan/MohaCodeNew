import { Col, Container, Row } from 'react-bootstrap';
import { ButtonImage } from '@/components';
import './CTA.scss';
import { Link } from 'react-router-dom';
export interface NghiQuyetTW4CTASectionProps {
  main?: { title1: string; url: string; image: string };
  items: { title: string; url: string; image: string }[];
}
export const NghiQuyetTW4CTASection = ({ main, items }: NghiQuyetTW4CTASectionProps) => {
  return (
    <section className="mh-nqtw4-cta">
      <Container>
        <Row>
          <Col lg={8}>
            <Link to={main?.url || '/'} className="mh-nqtw4-cta-banner" style={{ backgroundImage: `url(${main?.image})`, cursor: "pointer" }}>
            </Link>
          </Col>
          <Col lg={4}>
            <div className="mh-nqtw4-cta-actions">
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
