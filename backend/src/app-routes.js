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
import CKTD_VanBan from "./pages/CKTD_VanBan";
import CoCauToChuc from "./pages/CoCauToChuc";
import CoQuanBanHanh from "./pages/CoQuanBanHanh";
import CrawlBVND from "./pages/CrawlBVND";
import Crawler_ChuDe from "./pages/Crawler_ChuDe";
import Crawler_LienKet from "./pages/Crawler_LienKet";
import Crawler_Nguon from "./pages/Crawler_Nguon";
import Crawler_NguonCha from "./pages/Crawler_NguonCha";
import DangKyNhanMail from "./pages/DangKyNhanMail";
import DongBoDuLieu from "./pages/DongBoDuLieu";
import DongGopYKien from "./pages/DongGopYKien";
import DongGopYKien_ChuDe from "./pages/DongGopYKien_ChuDe";
import DongSuKien from "./pages/DongSuKien";
import DonVi_LanhDao from "./pages/DonVi_LanhDao";
import File from "./pages/File";
import File_DongBoDuLieu from "./pages/File_DongBoDuLieu";
import ForgotPassword from "./pages/ForgotPassword";
import GioiThieuVanBan from "./pages/GioiThieuVanBan";
import HinhThucVanBan from "./pages/HinhThucVanBan";
import Home from "./pages/Home";
import ImageSize from "./pages/ImageSize";
import LanhDao_ThoiKy from "./pages/LanhDao_ThoiKy";
import LinhVuc from "./pages/LinhVuc";
import LoaiSuKien from "./pages/LoaiSuKien";
import Login from "./pages/Login";
import LopVanBan from "./pages/LopVanBan";
import MediaFileManager from "./pages/MediaFileManager";
import Menu_Backend from "./pages/Menu_Backend";
import Menu_FrontEnd from "./pages/Menu_FrontEnd";
import NghienCuuKhoaHoc from "./pages/NghienCuuKhoaHoc";
import NhomNhanVien from "./pages/NhomNhanVien";
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
import User_DichVuCong from "./pages/User_DichVuCong";
import USR_LinkQuanLy from "./pages/USR_LinkQuanLy";
import VanBan from "./pages/VanBan";
import VanBanDuThao from "./pages/VanBanDuThao";
import VanBanDuThao_GopYs from "./pages/VanBanDuThao_GopYs";
import VungHienThi from "./pages/VungHienThi";

const routes = [
  { path: "/ABL_AlbumAnh", element: ABL_AlbumAnh },
  { path: "/ABL_AlbumAudio", element: ABL_AlbumAudio },
  { path: "/ABL_AlbumVideo", element: ABL_AlbumVideo },
  { path: "/ABL_Video", element: ABL_Video },
  { path: "/ABL_Audio", element: ABL_Audio },
  { path: "/ABL_Anh", element: ABL_Anh },
  {
    path: "/Album_ChuyenMuc/ABL_ChuyenMucAlbumAnh",
    element: ABL_ChuyenMucAlbumAnh,
  },
  {
    path: "/Album_ChuyenMuc/ABL_ChuyenMucAlbumAudio",
    element: ABL_ChuyenMucAlbumAudio,
  },
  {
    path: "/Album_ChuyenMuc/ABL_ChuyenMucAlbumVideo",
    element: ABL_ChuyenMucAlbumVideo,
  },
  { path: "/Banner/Banner", element: Banner },
  { path: "/Banner/Banner_ViTri", element: Banner_ViTri },
  { path: "/BinhLuan", element: BinhLuan },
  { path: "/BuocQuyTrinh", element: BuocQuyTrinh },
  { path: "/System/ChucDanh", element: ChucDanh },
  { path: "/ListNews/ChuyenMuc", element: ChuyenMuc },
  { path: "/CKTD_VanBan", element: CKTD_VanBan },
  { path: "/CoCauToChuc", element: CoCauToChuc },
  { path: "/VanBan/CoQuanBanHanh", element: CoQuanBanHanh },
  { path: "/CrawlBVND", element: CrawlBVND },
  { path: "/Crawler_ChuDe", element: Crawler_ChuDe },
  { path: "/Crawler_LienKet/:type", element: Crawler_LienKet },
  { path: "/Crawler_Nguon", element: Crawler_Nguon },
  { path: "/Crawler_NguonCha", element: Crawler_NguonCha },
  { path: "/DangKyNhanMail", element: DangKyNhanMail },
  { path: "/DongBoDuLieu", element: DongBoDuLieu },
  { path: "/ListNews/DongSuKien", element: DongSuKien },
  { path: "/DonVi_LanhDao", element: DonVi_LanhDao },
  { path: "/File", element: File },
  { path: "/File_DongBoDuLieu", element: File_DongBoDuLieu },
  { path: "/VanBan/HinhThucVanBan", element: HinhThucVanBan },
  { path: "/LanhDao_ThoiKy", element: LanhDao_ThoiKy },
  { path: "/VanBan/LinhVuc", element: LinhVuc },
  { path: "/Event/LoaiSuKien", element: LoaiSuKien },
  { path: "/Login", element: Login },
  { path: "/ForgotPassword", element: ForgotPassword },
  { path: "/VanBan/LopVanBan", element: LopVanBan },
  { path: "/Menu_Backend", element: Menu_Backend },
  { path: "/System/Menu_FrontEnd", element: Menu_FrontEnd },
  { path: "/System/NhomNhanVien", element: NhomNhanVien },
  { path: "/NghienCuuKhoaHoc", element: NghienCuuKhoaHoc },
  { path: "/System/BackUp", element: BackUp },
  { path: "/Banner/QuangCao_ViTri", element: QuangCao_ViTri },
  { path: "/System/CauHinh", element: CauHinh },
  { path: "/System/Role", element: Role },
  { path: "/ThoiKyPhatTrien", element: ThoiKyPhatTrien },
  { path: "/News/TinTuc/:type", element: TinTuc },
  { path: "/News/TinTucAll", element: TinTuc },
  { path: "/News/TinTuc_Temp", element: TinTuc_Temp },
  { path: "/System/User_Account", element: User_Account },
  { path: "/User_DichVuCong", element: User_DichVuCong },
  { path: "/USR_LinkQuanLy", element: USR_LinkQuanLy },
  { path: "/VanBan/VanBan/:IdLopVanBan", element: VanBan },
  { path: "/VanBan/DuThao", element: VanBanDuThao },
  { path: "/VanBan/GopYDuThao", element: VanBanDuThao_GopYs },
  { path: "/ListNews/VungHienThi", element: VungHienThi },
  { path: "/System/ImageSize", element: ImageSize },
  { path: "/System/ADConfig", element: ADConfig },
  { path: "/MediaFileManager", element: MediaFileManager },
  { path: "/Block", element: Block },
  { path: "/BlockConfig", element: BlockConfig },
  { path: "/Template", element: Template },
  { path: "/Profile", element: Profile },
  { path: "/ThongTinLanhDao", element: ThongTinLanhDao },
  { path: "/HDPL/PhanAnhKienNghi", element: PhanAnhKienNghi },
  { path: "/HDPL/PhanAnhKienNghi_CoQuan", element: PhanAnhKienNghi_CoQuan },
  { path: "/HDPL/PhanAnhKienNghi_LinhVuc", element: PhanAnhKienNghi_LinhVuc },
  { path: "/DGYK/DongGopYKien", element: DongGopYKien },
  { path: "/DGYK/DongGopYKien_ChuDe", element: DongGopYKien_ChuDe },
  { path: "/ChiTieu/ChiTieu_DanhMuc", element: ChiTieu_DanhMuc },
  { path: "/ChiTieu/ChiTieu", element: ChiTieu },
  { path: "/ThongBao", element: ThongBao },
  { path: "/HoiNghiSuKien", element: SuKienHoiThao },
  { path: "/QuyTrinhKiemDuyet", element: QuyTrinhKiemDuyet },
  { path: "/GioiThieuVanBan", element: GioiThieuVanBan },
  { path: "/", element: Home },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
