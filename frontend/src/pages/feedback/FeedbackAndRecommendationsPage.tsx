import { Container } from 'react-bootstrap';
import { CardSection } from '@/components';

export const FeedbackAndRecommendationsPage = () => {
  return (
    <Container className="py-4">
      <CardSection title={<h1 className="m-0 fs-4">Phản ánh - kiến nghị</h1>}>
        <i>Nội dung đang được cập nhật</i>
      </CardSection>
    </Container>
  );
};
