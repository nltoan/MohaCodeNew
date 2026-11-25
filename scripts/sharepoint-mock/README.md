# SharePoint giả lập (chỉ để thử)

Một máy chủ Node nhỏ mô phỏng phần REST của SharePoint 2019/SE mà API cần, để thử đồng bộ văn bản mà chưa có farm thật. Không phải SharePoint: không có NTLM/Kerberos, phân quyền AD, độ trễ và giới hạn tải của farm.

## Chạy thử

1. Bật giả lập (port 55120, chỉ nghe `127.0.0.1`):
   ```powershell
   node scripts\sharepoint-mock\server.mjs
   ```
   Lần đầu sinh tài khoản dịch vụ ngẫu nhiên ở `.dev/sharepoint-mock/credentials.json` (git bỏ qua).
2. Tạo `api/appSettings.local.config` (git bỏ qua; `Dev.ps1` tự chép vào thư mục chạy):
   ```xml
   <appSettings>
     <add key="SharePointSiteUrl" value="http://127.0.0.1:55120/sites/portal" />
     <add key="SharePointAuth" value="Basic" />
     <add key="SharePointUser" value="(user trong credentials.json)" />
     <add key="SharePointPassword" value="(password trong credentials.json)" />
     <add key="SharePointVanBanLopVanBanId" value="104" />
   </appSettings>
   ```
3. Khởi động lại API (`.\scripts\Dev.ps1 -Action Stop` rồi `-Action Start`), đăng nhập tài khoản có quyền `manage-vanban`, rồi gọi:
   - `GET  /api/SharePointSync/Status`: kiểm tra kết nối và xem lần chạy gần nhất.
   - `POST /api/SharePointSync/Run`: đồng bộ phần thay đổi từ lần trước; `?full=true` đồng bộ lại toàn bộ.

## Điều khiển giả lập (chỉ từ máy này)

`POST /__mock/touch/{id}` sửa tiêu đề và tăng phiên bản; `/__mock/unpublish/{id}` và `/__mock/publish/{id}` đổi trạng thái; `/__mock/reset` nạp lại dữ liệu mẫu (`seed.json`).

## Dữ liệu đã đồng bộ

Mỗi văn bản có `VanBan.Migrate_Source = 'sharepoint:<UniqueId>'` và tệp ở `Upload/SharePoint/<UniqueId>/`. Muốn xoá dữ liệu thử: xoá các dòng `VanBan` có `Migrate_Source LIKE 'sharepoint:%'` cùng `VanBan_Files`, `VanBan_LopVanBan`, `Files` tương ứng, và thư mục `Upload/SharePoint`.

## Khi dùng SharePoint thật

Đặt `SharePointAuth` là `Windows` (mặc định), `SharePointSiteUrl` là địa chỉ site, `SharePointUser`/`SharePointPassword`/`SharePointDomain` của tài khoản dịch vụ có quyền đọc thư viện. Thư viện cần các cột `SoKyHieu`, `NgayBanHanh`, `NgayCoHieuLuc`, `NguoiKy`, `ChucDanh`, `TrangThai` (giá trị `Published` thì mới đồng bộ); API đọc `Title` làm trích yếu và tệp của mục làm tệp đính kèm. Tên cột và URL REST chưa được kiểm tra trên farm thật.
