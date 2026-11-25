import { Link, useLocation } from "react-router-dom";

// Duong dan khong ton tai trong admin (go sai, link cu, bookmark cu).
export default function NotFound() {
  const location = useLocation();
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="h4">Không tìm thấy trang</h2>
        <p className="mb-2">
          Đường dẫn <code>{location.pathname}</code> không có trong trang quản trị. Có thể liên kết đã cũ hoặc bị gõ sai.
        </p>
        <p className="mb-3 text-muted">
          Dùng ô "Tìm chức năng" ở đầu menu bên trái để tìm chức năng cần dùng, hoặc quay về trang tổng quan.
        </p>
        <Link to="/" className="btn btn-primary">
          Về trang tổng quan
        </Link>
      </div>
    </div>
  );
}
