import { Container } from 'react-bootstrap';
import { CardSection } from '@/components';

export const DataPage = () => {
  return (
    <Container className="py-4">
      <CardSection title={<h1 className="m-0 fs-4">Dữ liệu</h1>}>
        <i>Nội dung đang được cập nhật</i>
      </CardSection>
    </Container>
  );
};
