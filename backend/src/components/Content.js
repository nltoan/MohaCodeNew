import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWindowSize } from "../utils/windowResize";

const APP_TITLE = "Quản trị nội dung";

// title / group: tieu de trang va nhom menu (lay tu app-routes.js qua LayoutAdmin).
// Thanh tieu de duoc giu gon vi phan lon cac trang da co card-header rieng.
export default function Content({ title, group, children }) {
  const size = useWindowSize();

  useEffect(() => {
    document.title = title ? `${title} - ${APP_TITLE}` : APP_TITLE;
  }, [title]);

  return (
    <div className="content-wrapper" style={{ minHeight: size.height - 59 }}>
      {title && (
        <div className="content-header admin-page-header">
          <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between">
              <h1>{title}</h1>
              <nav aria-label="Đường dẫn">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Trang chủ</Link>
                  </li>
                  {group && group !== title && <li className="breadcrumb-item">{group}</li>}
                  <li className="breadcrumb-item active" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      )}
      <div className="content">
        <div className="container-fluid">{children}</div>
      </div>
    </div>
  );
}
