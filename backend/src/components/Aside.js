import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth";

const MenuItem = ({
  path,
  icon = "fas fa-angle-right nav-icon",
  linkClass = `nav-link`,
  permission,
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();

  function isHavePermission(name) {
    if (!auth.user) {
      return false;
    }
    if (auth.user?.Role?.RolePermissions?.length <= 0) {
      return false;
    }
    if (auth.user.Role.RolePermissions == undefined) {
      auth.signOut();
    }
    for (var i = 0; i < auth.user.Role.RolePermissions.length; i++) {
      let element = auth.user.Role.RolePermissions[i];
      if (element.Permission.Name == name) {
        return true;
      }
    }
    return false;
  }

  return (
    <>
      {((permission != undefined && isHavePermission(permission)) ||
        permission == undefined) && (
        <li className={`nav-item ${isOpen ? "menu-open" : ""}`}>
          <Link
            to={path}
            className={linkClass}
            onClick={(e) => {
              if (children && children.length > 0) {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(!isOpen);
              }
            }}
          >
            <i className={icon}></i>
            <p>
              {title}
              {children && <i className="right fas fa-angle-left"></i>}
            </p>
          </Link>
          {children && <ul className="nav nav-treeview">{children}</ul>}
        </li>
      )}
    </>
  );
};
export default function Aside() {
  const location = useLocation();
  const auth = useAuth();
  useEffect(() => {
    window.$('[data-widget="treeview"]').each(function () {
      if (window.$(this).data("treeview-init") === undefined) {
        window.$(this).Treeview("init");
        window.$(this).data("treeview-init", true);
      }
    });
  }, []);
  // console.log(auth.user);
  return (
    <aside className="main-sidebar sidebar-light-light elevation-4">
      <div className="navbar-brand d-flex justify-content-center">
        <a href="/" className="app-logo brand-link">
          <img src="/logo.png" alt="App Logo" className="img-fluid" />
        </a>
      </div>
      <div className="sidebar">
        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input
              className="form-control form-control-sidebar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw" />
              </button>
            </div>
          </div>
          <div className="sidebar-search-results">
            <div className="list-group">
              <a href="#" className="list-group-item">
                <div className="search-title">
                  <strong className="text-light">No element found!</strong>
                </div>
                <div className="search-path" />
              </a>
            </div>
          </div>
        </div>
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role={"menu"}
          >
            <MenuItem
              icon="fas fa-chart-line nav-icon"
              title={"Dashboard"}
              path={"/"}
            />
            <MenuItem
              icon="fas fa-newspaper nav-icon"
              permission={"manage-tintuc"}
              title={"QL tin tức"}
            >
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Tin tức"}
                path={"/News/TinTucAll"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS tin của tôi"}
                path={"/News/TinTuc/owner"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS tin xuất bản của tôi"}
                path={"/News/TinTuc/publish"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS tin gửi duyệt của tôi"}
                path={"/News/TinTuc/wait"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS tin bị trả về của tôi"}
                path={"/News/TinTuc/cancel"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS tin lưu nháp của tôi"}
                path={"/News/TinTuc/draft"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS tin đang kiểm duyệt"}
                path={"/News/TinTuc/approving"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS tin chờ tôi xuất bản"}
                path={"/News/TinTuc/ownerApproving"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS tin xuất bản / hủy xuất bản"}
                path={"/News/TinTuc/publishUnPublish"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Thông báo"}
                path={"/ThongBao"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS chuyên mục"}
                path={"/ListNews/ChuyenMuc"}
              />
            </MenuItem>
            <MenuItem
              icon="fas fa-store nav-icon"
              permission={"manage-nckh"}
              title={"Nghiên cứu khoa học"}
              path={"/NghienCuuKhoaHoc"}
            />
            <MenuItem
              icon="fas fa-question nav-icon"
              permission={"manage-dgyk_hdpl"}
              title={"Hỏi đáp pháp luật"}
            >
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Trả lời phản ánh, kiến nghị"}
                path={"/HDPL/PhanAnhKienNghi"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Cơ quan tiếp nhận"}
                path={"/HDPL/PhanAnhKienNghi_CoQuan"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Lĩnh vực"}
                path={"/HDPL/PhanAnhKienNghi_LinhVuc"}
              />
            </MenuItem>
            <MenuItem
              icon="fas fa-question nav-icon"
              permission={"manage-dgyk_hdpl"}
              title={"Đóng góp ý kiến"}
            >
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Ý kiến đóng góp"}
                path={"/DGYK/DongGopYKien"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Chủ đề"}
                path={"/DGYK/DongGopYKien_ChuDe"}
              />
            </MenuItem>
            <MenuItem
              icon="fas fa fa-history nav-icon"
              permission={"manage-thoiky"}
              title={"QL thời kì phát triển"}
              path={"/ThoiKyPhatTrien"}
            />
            <MenuItem
              icon="fas fa-sitemap nav-icon"
              permission={"manage-cocautochuc"}
              title={"QL cơ cấu tổ chức"}
            >
              <MenuItem
                linkClass="nav-link pl-2"
                title={"QL cơ cấu tổ chức"}
                path={"/CoCauToChuc"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"QL lãnh đạo bộ"}
                path={"/ThongTinLanhDao"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"QL Chức danh"}
                path={"/System/ChucDanh"}
              />
            </MenuItem>
            <MenuItem
              icon="fas fa fa-ad nav-icon"
              permission={"manage-banner"}
              title={"QL banner"}
            >
              <MenuItem
                linkClass="nav-link pl-2"
                title={"QL banner"}
                path={"/Banner/Banner"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"QL vị trí"}
                path={"/Banner/QuangCao_ViTri"}
              />
            </MenuItem>
            <MenuItem
              icon="fas fa-book nav-icon"
              permission={"manage-chitieu"}
              title={"Quản lý chỉ tiêu"}
            >
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Danh sách chỉ tiêu"}
                path={"/ChiTieu/ChiTieu"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Danh mục chỉ tiêu"}
                path={"/ChiTieu/ChiTieu_DanhMuc"}
              />
            </MenuItem>
            <MenuItem
              icon="fas fa-book nav-icon"
              permission={"manage-vanban"}
              title={"QL văn bản"}
            >
              <MenuItem
                linkClass="nav-link pl-2"
                title={"QL văn bản QPPL"}
                path={"/VanBan/VanBan/101"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"QL văn bản CĐĐH"}
                path={"/VanBan/VanBan/104"}
              />
              {/* <MenuItem linkClass="nav-link pl-2" title={'DS văn bản Hợp tác quốc tế'} path={"/VanBan/VanBan/2125"} /> */}
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Văn bản dự thảo"}
                path={"/VanBan/DuThao"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Góp ý Văn bản dự thảo"}
                path={"/VanBan/GopYDuThao"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"Giới thiệu văn bản"}
                path={"/GioiThieuVanBan"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS lĩnh vực văn bản"}
                path={"/VanBan/LinhVuc"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS hình thức văn bản"}
                path={"/VanBan/HinhThucVanBan"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS lớp văn bản"}
                path={"/VanBan/LopVanBan"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS Cơ quan ban hành"}
                path={"/VanBan/CoQuanBanHanh"}
              />
            </MenuItem>
            <MenuItem
              icon="fas fa-video nav-icon"
              permission={"manage-tintuc"}
              title={"QL Media"}
            >
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS tin infographic"}
                path={"/News/TinTuc/infographic"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                title={"DS tin Emagazine"}
                path={"/News/TinTuc/emagazine"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                permission={"manage-tintuc"}
                title={"Album Video"}
                path={"/ABL_AlbumVideo"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                permission={"manage-tintuc"}
                title={"Album Audio"}
                path={"/ABL_AlbumAudio"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                permission={"manage-tintuc"}
                title={"Album Ảnh"}
                path={"/ABL_AlbumAnh"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                permission={"manage-tintuc"}
                title={"Chuyên mục Album Video"}
                path={"/Album_ChuyenMuc/ABL_ChuyenMucAlbumVideo"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                permission={"manage-tintuc"}
                title={"Chuyên mục Album Audio"}
                path={"/Album_ChuyenMuc/ABL_ChuyenMucAlbumAudio"}
              />
              <MenuItem
                linkClass="nav-link pl-2"
                permission={"manage-tintuc"}
                title={"Chuyên mục Album Ảnh"}
                path={"/Album_ChuyenMuc/ABL_ChuyenMucAlbumAnh"}
              />
            </MenuItem>
            <MenuItem
              icon="fas fa-calendar nav-icon"
              permission={"manage-sukien"}
              title={"QL Hội nghị, Sự kiện"}
              path={"/HoiNghiSuKien"}
            />
            <li className="nav-header">SYSTEMS</li>
            <MenuItem icon="fas fa-cogs nav-icon" title={"Hệ thống"}>
              <MenuItem
                icon="fas fa-users nav-icon"
                permission={"manage-user"}
                title={"QL người dùng"}
                path={"/System/User_Account"}
              />
              <MenuItem
                icon="fas fa-user-tag nav-icon"
                permission={"manage-role"}
                title={"QL vai trò"}
                path={"/System/Role"}
              />
              <MenuItem
                icon="fas fa-list nav-icon"
                permission={"manage-menu"}
                title={"QL menu frontend"}
                path={"/System/Menu_FrontEnd"}
              />
              <MenuItem
                icon="fas fa-list nav-icon"
                permission={"manage-backup"}
                title={"QL backup"}
                path={"/System/Backup"}
              />
              <MenuItem
                icon="fas fa-list nav-icon"
                permission={"manage-setting"}
                title={"Cấu hình hệ thống"}
                path={"/System/CauHinh"}
              />
              <MenuItem
                icon="fas fa-list nav-icon"
                permission={"manage-setting"}
                title={"QL kích cỡ ảnh"}
                path={"/System/ImageSize"}
              />
              <MenuItem
                icon="fas fa-list nav-icon"
                permission={"manage-setting"}
                title={"QL chuỗi AD"}
                path={"/System/ADConfig"}
              />
              <MenuItem
                icon="fas fa-list nav-icon"
                permission={"manage-block"}
                title={"QL khối hiển thị"}
                path={"/Block"}
              />
              <MenuItem
                icon="fas fa-list nav-icon"
                permission={"manage-block"}
                title={"QL cấu hình hiển thị"}
                path={"/BlockConfig"}
              />
              <MenuItem
                icon="fas fa-photo-video nav-icon"
                permission={"manage-library"}
                title={"QL thư viện"}
                path={"/MediaFileManager"}
              />
              <MenuItem
                icon="fas fa-stream nav-icon"
                permission={"manage-quytrinh"}
                title={"QL quy trình kiểm duyệt"}
                path={"/QuyTrinhKiemDuyet"}
              />
            </MenuItem>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
