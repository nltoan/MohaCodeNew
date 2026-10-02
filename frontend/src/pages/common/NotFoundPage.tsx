import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
export const NotFoundPage = () => {
  return <Container className="py-5"><Helmet><title>Không tìm thấy trang - Bộ Nội vụ</title><meta name="robots" content="noindex, follow" /></Helmet><h1>Không tìm thấy trang</h1><p>Đường dẫn không tồn tại hoặc nội dung đã được chuyển sang địa chỉ khác.</p><Link to="/">Về trang chủ</Link></Container>;
};
