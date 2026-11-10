# Ghi chú thay đổi 10/11/2026 (nhánh sua-ssr)

Commit: `0bce499` (mật khẩu mặc định), `7ff7f05` (preview + sửa khoảng trống). Chưa deploy; chưa chạy thử trên staging.

## 1. Mật khẩu mặc định chỉ đăng nhập được N lần, sau đó bắt buộc đổi mật khẩu + bật 2FA

- Cột mới `User_Account.MatKhauMacDinh` (0/1) và `SoLanDangNhapMacDinh`. Migration: `db/migrations/20261110-MatKhauMacDinh.sql`.
- Số lần tối đa mặc định 3, đổi bằng appSettings `DefaultPasswordMaxLogins` trong Web.config API.
- Đăng nhập thành công với tài khoản `MatKhauMacDinh = 1` thì đếm lên. Hết lượt: token mang claim `setup_required`, `/api/Token` trả thêm `setup_required: "1"`.
- `api/OAuth/Startup.cs`: middleware chặn mọi API (403 `setup_required`) trừ `Home/UpdateProfile`, `Home/GenerateAuthenticateSecret`, `User_Account/GetLoginUser`.
- `HomeController.UpdateProfile`: phiên bị hạn chế phải đặt mật khẩu mới (>= 12 ký tự, khác mật khẩu cũ) VÀ bật 2FA cùng lúc; xong thì xoá cờ.
- `User_AccountController` Post/Put: admin đặt mật khẩu cho tài khoản => tài khoản tự được đánh dấu mật khẩu mặc định.
- Admin UI: tự chuyển sang `/Profile` + cảnh báo (`backend/src/api/auth.js`, `contexts/auth.js`, `pages/Profile.js`).
- Code mới: `api/Services/DefaultPasswordPolicy.cs` (dùng SQL trực tiếp, không sửa EDMX).
- Migration chỉ thêm cột; tài khoản hiện có phải tự đánh dấu bằng `UPDATE` (mẫu đang comment trong file SQL).
- **Phải chạy migration TRƯỚC khi chép API mới**, nếu không không ai đăng nhập được.

## 2. Xem trước tin nháp trong CMS (không lộ ra frontend)

- API `GET api/TinTucs/Preview?ID=` (cần đăng nhập) trả tin bất kể trạng thái.
- Admin: nút 🔍 "Xem trước (kể cả tin nháp)" ở danh sách tin (`pages/TinTuc.js`), popup `components/NewsPreviewPopup.js` hiển thị trong iframe `sandbox` (không chạy script).
- Quyền xem trước: chỉ người tạo tin và người phê duyệt được gán vào bất kỳ bước nào của cùng quy trình duyệt của tin đó (bảng UserBuocQuyTrinh); nhóm quản trị (có quyền manage-user) xem được mọi tin; người khác nhận 403. Tin chưa gắn quy trình thì chỉ người tạo xem được.

## 3. Portal: sửa khoảng trống ở trang chi tiết tin

- Bỏ `.mh-detail-content .mh-page-header { min-height: 180px; }` trong `frontend/src/pages/news/NewsDetail.scss`.
- `NewsDetailPage.tsx`: khi API trả `data = null` (tin chưa public / sai ngôn ngữ) hiện thông báo thay vì khung trống 900px.

## 4. Chẩn đoán đã làm (chưa sửa DB)

- Lỗi đăng nhập `kiennt`: hash PBKDF2 ở dòng 649 không khớp `1111`; cần đặt lại mật khẩu bằng `UPDATE`.
- `nhungnt` bị trùng tên truy cập với dòng 628 (đã `deleted`); đã đề xuất đổi tên dòng 628. Code đăng nhập dùng `FirstOrDefault(TenTruyCap == ...)` không lọc trạng thái (chưa sửa).
- Đăng nhập chỉ chấp nhận `TrangThai` = `active` hoặc `True`; `NULL`, `False`, `deleted` bị chặn. Đã đề xuất `UPDATE ... SET TrangThai = N'active'` cho UserID 649, 650, 651, 653, 654, 655 (chưa chạy; `cuongnd` 652 là `False`, để nguyên).
- Tin 19842/19843 không hiện: nghi `TrangThai <> 'public'` (tin mới luôn tạo ở `draft`) hoặc `NgonNgu` NULL/khác `vi`. Cần chạy `SELECT ID, TrangThai, NgonNgu FROM dbo.TinTuc WHERE ID IN (19842, 19843)` để xác nhận.

## 5. Build / đóng gói

- Đã cài Mono (brew) và build thử API trong thư mục tạm: 0 lỗi biên dịch. Bản Mono KHÔNG dùng để deploy.
- Build thật trên Windows: `scripts/Prepare-ProductionRelease.ps1` (cần VS Build Tools 2022, Node 22, pnpm; xem `DEV-SETUP.md`).
- Script chỉ chép migration `20261001-HoiQuy.sql` vào gói; phải chép tay thêm `20261109-TinTuc-NgonNgu.sql` và `20261110-MatKhauMacDinh.sql`.
- `deployment/production.json` cần `AdminUrl` hợp lệ, nếu không gói admin chỉ là bản ứng viên.

## Thứ tự deploy

1. Backup DB. 2. Chạy 2 migration mới. 3. Chép API (`bin` + `Global.asax`, giữ Web.config production). 4. Chép portal (assets trước, `index.html` cuối) và admin. 5. Thử staging trước production.

## Chưa làm

- Chưa sửa `FirstOrDefault` đăng nhập để chỉ lấy tài khoản đang hoạt động.
- Chưa kiểm tra trên trình duyệt/IIS thật; chưa push.
