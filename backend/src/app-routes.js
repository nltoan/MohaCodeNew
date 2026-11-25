import HoiQuy from './pages/HoiQuy';
import { withNavigationWatcher } from "./contexts/navigation";
import ABL_AlbumAudio from "./pages//ABL_AlbumAudio";
import ABL_AlbumVideo from "./pages//ABL_AlbumVideo";
import ABL_ChuyenMucAlbumAudio from "./pages//ABL_ChuyenMucAlbumAudio";
import ABL_ChuyenMucAlbumVideo from "./pages//ABL_ChuyenMucAlbumVideo";
import ABL_AlbumAnh from "./pages/ABL_AlbumAnh";
import ABL_Anh from "./pages/ABL_Anh";
import ABL_Audio from "./pages/ABL_Audio";
import ABL_ChuyenMucAlbumAnh from "./pages/ABL_ChuyenMucAlbumAnh";
import ABL_Video from "./pages/ABL_Video";
import ADConfig from "./pages/ADConfig";
import BackUp from "./pages/BackUp";
import Banner from "./pages/Banner";
import Banner_ViTri from "./pages/Banner_ViTri";
import BinhLuan from "./pages/BinhLuan";
import Block from "./pages/Block";
import BlockConfig from "./pages/BlockConfig";
import BuocQuyTrinh from "./pages/BuocQuyTrinh";
import CauHinh from "./pages/CauHinh";
import ChiTieu from "./pages/ChiTieu";
import ChiTieu_DanhMuc from "./pages/ChiTieu_DanhMuc";
import ChucDanh from "./pages/ChucDanh";
import ChuyenMuc from "./pages/ChuyenMuc";
import CoCauToChuc from "./pages/CoCauToChuc";
import CoQuanBanHanh from "./pages/CoQuanBanHanh";
import Crawler_ChuDe from "./pages/Crawler_ChuDe";
import Crawler_LienKet from "./pages/Crawler_LienKet";
import Crawler_Nguon from "./pages/Crawler_Nguon";
import Crawler_NguonCha from "./pages/Crawler_NguonCha";
import DongGopYKien from "./pages/DongGopYKien";
import DongGopYKien_ChuDe from "./pages/DongGopYKien_ChuDe";
import DongSuKien from "./pages/DongSuKien";
import DonVi_LanhDao from "./pages/DonVi_LanhDao";
import File from "./pages/File";
import GioiThieuVanBan from "./pages/GioiThieuVanBan";
import HinhThucVanBan from "./pages/HinhThucVanBan";
import Home from "./pages/Home";
import ImageSize from "./pages/ImageSize";
import LinhVuc from "./pages/LinhVuc";
import LoaiSuKien from "./pages/LoaiSuKien";
import LopVanBan from "./pages/LopVanBan";
import MediaFileManager from "./pages/MediaFileManager";
import Menu_Backend from "./pages/Menu_Backend";
import Menu_FrontEnd from "./pages/Menu_FrontEnd";
import NghienCuuKhoaHoc from "./pages/NghienCuuKhoaHoc";
import PhanAnhKienNghi from "./pages/PhanAnhKienNghi";
import PhanAnhKienNghi_CoQuan from "./pages/PhanAnhKienNghi_CoQuan";
import PhanAnhKienNghi_LinhVuc from "./pages/PhanAnhKienNghi_LinhVuc";
import Profile from "./pages/Profile";
import QuangCao_ViTri from "./pages/QuangCao_ViTri";
import QuyTrinhKiemDuyet from "./pages/QuyTrinhKiemDuyet";
import Role from "./pages/Role";
import SuKienHoiThao from "./pages/SuKienHoiThao";
import Template from "./pages/Template";
import ThoiKyPhatTrien from "./pages/ThoiKyPhatTrien";
import ThongBao from "./pages/ThongBao";
import ThongTinLanhDao from "./pages/ThongTinLanhDao";
import TinTuc from "./pages/TinTuc";
import TinTuc_Temp from "./pages/TinTuc_Temp";
import User_Account from "./pages/User_Account";
import VanBan from "./pages/VanBan";
import VanBanDuThao from "./pages/VanBanDuThao";
import VanBanDuThao_GopYs from "./pages/VanBanDuThao_GopYs";
import VungHienThi from "./pages/VungHienThi";

// Nhom menu (trung nhan menu ben trai trong components/Aside.js), dung cho breadcrumb.
const G_TINTUC = "Tin tức";
const G_MEDIA = "Media";
const G_VANBAN = "Văn bản";
const G_COCAU = "Cơ cấu tổ chức";
const G_BANNER = "Banner";
const G_CHITIEU = "Quản lý chỉ tiêu";
const G_HDPL = "Hỏi đáp pháp luật";
const G_DGYK = "Đóng góp ý kiến";
const G_HETHONG = "Hệ thống";
const G_CRAWLER = "Thu thập tin";

// Tieu de danh sach tin theo :type (trung nhan menu).
const TIN_TUC_TITLES = {
  owner: "Tin của tôi",
  publish: "Tin đã xuất bản của tôi",
  unpublish: "Tin đã gỡ xuất bản",
  wait: "Tin đã gửi duyệt của tôi",
  cancel: "Tin bị trả về",
  draft: "Tin lưu nháp",
  approving: "Tin đang kiểm duyệt",
  ownerApproving: "Tin chờ tôi xuất bản",
  publishUnPublish: "Xuất bản / gỡ xuất bản",
  infographic: "Tin infographic",
  emagazine: "Tin eMagazine",
};
const VAN_BAN_TITLES = {
  101: "Văn bản quy phạm pháp luật",
  104: "Văn bản chỉ đạo điều hành",
};

// title / group: chuoi hoac ham (params) => chuoi; Content.js hien tieu de + breadcrumb va dat document.title.
const routes = [
  { path: "/HoiQuy/Import", element: HoiQuy, title: "Nhập Excel Hội và Quỹ" },
  { path: "/ABL_AlbumAnh", element: ABL_AlbumAnh, title: "Album Ảnh", group: G_MEDIA },
  { path: "/ABL_AlbumAudio", element: ABL_AlbumAudio, title: "Album Audio", group: G_MEDIA },
  { path: "/ABL_AlbumVideo", element: ABL_AlbumVideo, title: "Album Video", group: G_MEDIA },
  { path: "/ABL_Video", element: ABL_Video, title: "Quản lý video", group: G_MEDIA },
  { path: "/ABL_Audio", element: ABL_Audio, title: "Quản lý audio", group: G_MEDIA },
  { path: "/ABL_Anh", element: ABL_Anh, title: "Quản lý ảnh", group: G_MEDIA },
  {
    path: "/Album_ChuyenMuc/ABL_ChuyenMucAlbumAnh",
    element: ABL_ChuyenMucAlbumAnh,
    title: "Chuyên mục Album Ảnh",
    group: G_MEDIA,
  },
  {
    path: "/Album_ChuyenMuc/ABL_ChuyenMucAlbumAudio",
    element: ABL_ChuyenMucAlbumAudio,
    title: "Chuyên mục Album Audio",
    group: G_MEDIA,
  },
  {
    path: "/Album_ChuyenMuc/ABL_ChuyenMucAlbumVideo",
    element: ABL_ChuyenMucAlbumVideo,
    title: "Chuyên mục Album Video",
    group: G_MEDIA,
  },
  { path: "/Banner/Banner", element: Banner, title: "Banner", group: G_BANNER },
  { path: "/Banner/Banner_ViTri", element: Banner_ViTri, title: "Vị trí banner", group: G_BANNER },
  { path: "/BinhLuan", element: BinhLuan, title: "Bình luận", group: G_TINTUC },
  { path: "/BuocQuyTrinh", element: BuocQuyTrinh, title: "Bước quy trình", group: G_HETHONG },
  { path: "/System/ChucDanh", element: ChucDanh, title: "Chức danh", group: G_COCAU },
  { path: "/ListNews/ChuyenMuc", element: ChuyenMuc, title: "Chuyên mục", group: G_TINTUC },
  { path: "/CoCauToChuc", element: CoCauToChuc, title: "Cơ cấu tổ chức", group: G_COCAU },
  { path: "/VanBan/CoQuanBanHanh", element: CoQuanBanHanh, title: "Cơ quan ban hành", group: G_VANBAN },
  { path: "/Crawler_ChuDe", element: Crawler_ChuDe, title: "Chủ đề thu thập tin", group: G_CRAWLER },
  { path: "/Crawler_LienKet/:type", element: Crawler_LienKet, title: "Tin thu thập", group: G_CRAWLER },
  { path: "/Crawler_Nguon", element: Crawler_Nguon, title: "Nguồn tin", group: G_CRAWLER },
  { path: "/Crawler_NguonCha", element: Crawler_NguonCha, title: "Nguồn báo", group: G_CRAWLER },
  { path: "/ListNews/DongSuKien", element: DongSuKien, title: "Dòng sự kiện", group: G_TINTUC },
  { path: "/DonVi_LanhDao", element: DonVi_LanhDao, title: "Lãnh đạo đơn vị", group: G_COCAU },
  { path: "/File", element: File, title: "Quản lý tệp" },
  { path: "/VanBan/HinhThucVanBan", element: HinhThucVanBan, title: "Hình thức văn bản", group: G_VANBAN },
  { path: "/VanBan/LinhVuc", element: LinhVuc, title: "Lĩnh vực văn bản", group: G_VANBAN },
  { path: "/Event/LoaiSuKien", element: LoaiSuKien, title: "Loại sự kiện", group: "Hội nghị, sự kiện" },
  { path: "/VanBan/LopVanBan", element: LopVanBan, title: "Lớp văn bản", group: G_VANBAN },
  { path: "/Menu_Backend", element: Menu_Backend, title: "Menu quản trị", group: G_HETHONG },
  { path: "/System/Menu_FrontEnd", element: Menu_FrontEnd, title: "Menu cổng thông tin", group: G_HETHONG },
  { path: "/NghienCuuKhoaHoc", element: NghienCuuKhoaHoc, title: "Nghiên cứu khoa học" },
  { path: "/System/BackUp", element: BackUp, title: "Sao lưu dữ liệu", group: G_HETHONG },
  { path: "/Banner/QuangCao_ViTri", element: QuangCao_ViTri, title: "Vị trí quảng cáo", group: G_BANNER },
  { path: "/System/CauHinh", element: CauHinh, title: "Cấu hình hệ thống", group: G_HETHONG },
  { path: "/System/Role", element: Role, title: "Vai trò và phân quyền", group: G_HETHONG },
  { path: "/ThoiKyPhatTrien", element: ThoiKyPhatTrien, title: "Thời kỳ phát triển" },
  {
    path: "/News/TinTuc/:type",
    element: TinTuc,
    title: (p) => TIN_TUC_TITLES[p.type] || "Quản lý tin tức",
    group: (p) => (p.type === "infographic" || p.type === "emagazine" ? G_MEDIA : G_TINTUC),
  },
  { path: "/News/TinTucAll", element: TinTuc, title: "Tất cả tin", group: G_TINTUC },
  { path: "/News/TinTuc_Temp", element: TinTuc_Temp, title: "Tin tạm", group: G_TINTUC },
  { path: "/System/User_Account", element: User_Account, title: "Người dùng", group: G_HETHONG },
  {
    path: "/VanBan/VanBan/:IdLopVanBan",
    element: VanBan,
    title: (p) => VAN_BAN_TITLES[p.IdLopVanBan] || "Văn bản",
    group: G_VANBAN,
  },
  { path: "/VanBan/DuThao", element: VanBanDuThao, title: "Văn bản dự thảo", group: G_VANBAN },
  { path: "/VanBan/GopYDuThao", element: VanBanDuThao_GopYs, title: "Góp ý Văn bản dự thảo", group: G_VANBAN },
  { path: "/ListNews/VungHienThi", element: VungHienThi, title: "Vùng hiển thị", group: G_TINTUC },
  { path: "/System/ImageSize", element: ImageSize, title: "Kích cỡ ảnh", group: G_HETHONG },
  { path: "/System/ADConfig", element: ADConfig, title: "Cấu hình đăng nhập AD", group: G_HETHONG },
  { path: "/MediaFileManager", element: MediaFileManager, title: "Thư viện file", group: G_HETHONG },
  { path: "/Block", element: Block, title: "Khối hiển thị", group: G_HETHONG },
  { path: "/BlockConfig", element: BlockConfig, title: "Bố cục hiển thị", group: G_HETHONG },
  { path: "/Template", element: Template, title: "Mẫu Emagazine", group: G_HETHONG },
  { path: "/Profile", element: Profile, title: "Thông tin tài khoản" },
  { path: "/ThongTinLanhDao", element: ThongTinLanhDao, title: "Lãnh đạo Bộ", group: G_COCAU },
  { path: "/HDPL/PhanAnhKienNghi", element: PhanAnhKienNghi, title: "Trả lời phản ánh, kiến nghị", group: G_HDPL },
  { path: "/HDPL/PhanAnhKienNghi_CoQuan", element: PhanAnhKienNghi_CoQuan, title: "Cơ quan tiếp nhận", group: G_HDPL },
  { path: "/HDPL/PhanAnhKienNghi_LinhVuc", element: PhanAnhKienNghi_LinhVuc, title: "Lĩnh vực", group: G_HDPL },
  { path: "/DGYK/DongGopYKien", element: DongGopYKien, title: "Ý kiến đóng góp", group: G_DGYK },
  { path: "/DGYK/DongGopYKien_ChuDe", element: DongGopYKien_ChuDe, title: "Chủ đề", group: G_DGYK },
  { path: "/ChiTieu/ChiTieu_DanhMuc", element: ChiTieu_DanhMuc, title: "Danh mục chỉ tiêu", group: G_CHITIEU },
  { path: "/ChiTieu/ChiTieu", element: ChiTieu, title: "Danh sách chỉ tiêu", group: G_CHITIEU },
  { path: "/ThongBao", element: ThongBao, title: "Thông báo", group: G_TINTUC },
  { path: "/HoiNghiSuKien", element: SuKienHoiThao, title: "Hội nghị, sự kiện" },
  { path: "/QuyTrinhKiemDuyet", element: QuyTrinhKiemDuyet, title: "Quy trình kiểm duyệt", group: G_HETHONG },
  { path: "/GioiThieuVanBan", element: GioiThieuVanBan, title: "Giới thiệu văn bản", group: G_VANBAN },
  { path: "/", element: Home, title: "Trang tổng quan" },
];

// Tieu de + nhom cua mot route da khop (params tu matchRoutes).
export function resolveRouteMeta(route, params = {}) {
  if (!route) return { title: "", group: "" };
  const pick = (v) => (typeof v === "function" ? v(params) : v) || "";
  return { title: pick(route.title), group: pick(route.group) };
}

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
