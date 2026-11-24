import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

// Trang mo trong cua so rieng (so sanh phien ban, chon tep cho CKEditor).
const TITLES = {
  "/diffpage": "So sánh phiên bản",
  "/filepicker": "Chọn tệp",
};

export default function LayoutAdminWithoutAside({ title, children }) {
  const location = useLocation();
  useEffect(() => {
    const t = title || TITLES[location.pathname.toLowerCase()];
    document.title = t ? `${t} - Quản trị nội dung` : "Quản trị nội dung";
  }, [title, location.pathname]);

  return (
    <>
      <Outlet />
    </>
  );
}
