# Triển khai tra cứu Hội và Quỹ lên moha.gov.vn

Gói này cập nhật ba phần: portal React, admin React, API ASP.NET Framework 4.8, cùng migration bổ sung bảng và quyền. Đây là gói ứng viên đã kiểm tra local; chưa triển khai production. Cần thử staging và đối chiếu phiên bản đang chạy trước khi thay DLL/bundle, vì build chứa toàn bộ ứng dụng trong repo.

## Những gì đã xác minh

- HTML công khai của https://moha.gov.vn/ ngày 01/10/2026 khai báo API https://api-portal.moha.gov.vn/api/Public/ và media https://moha.gov.vn/.
- Portal và admin trong repo có cấu hình IIS URL Rewrite cho React; API target .NET Framework 4.8. Máy dev dùng IIS Express, không có IIS production để lấy thông tin sites/app pools.
- Chưa xác minh URL admin, server/path/app pool, database production, pipeline, reverse proxy/WAF và số node API. Các tên admin thông dụng được thử không có DNS tại máy dev; không coi đó là URL admin thực.

## Thành phần gói

| Thư mục | Cách sử dụng |
|---|---|
| portal | Bundle portal, URL HTTPS production. Giữ Web.config và kho Upload/Media_Share hiện có trên server. |
| admin-candidate | Bundle admin. Nếu manifest.AdminReady=false, phải chốt REACT_APP_BACKEND_URL/các cấu hình của admin đang chạy trước khi triển khai. |
| api-update/bin | DLL build Release. Sao lưu và đối chiếu toàn bộ dependency với phiên bản API đang chạy. |
| api-update/Global.asax | File khởi động tương ứng với API.MvcApplication. |
| deployment/20261001-HoiQuy.sql | Migration bổ sung; không chứa dữ liệu khách hàng hoặc mật khẩu. |
| deployment/api-upload.config.fragment.xml | Phần cấu hình cần gộp vào Web.config API hiện có. |
| deployment/*.web.config.sample.xml | Mẫu tham khảo URL Rewrite; không chép đè cấu hình production. |
| deployment/Verify-HoiQuy.sql | Kiểm tra DB sau migration/import. |
| import-data | Excel gốc để import bằng admin. Giữ ngoài web root công khai. |
| manifest.json | SHA256 và kích thước từng file, commit nguồn, trạng thái cấu hình admin. |

Gói không chứa Web.config API, chuỗi kết nối production, database backup, LocalDB hoặc tài khoản test. Node.js/pnpm/MSBuild dùng trên máy build; production không cần Vite, CRA dev server hoặc Node để phục vụ hai bundle tĩnh.

## 1. Kiểm tra trước khi triển khai

1. Trên server/IIS Manager, ghi lại site, physical path, app pool của portal/admin/API; xem connectionStrings CongTTDT_MOHAEntities để xác nhận đúng database. Không gửi mật khẩu qua chat.
2. Đối chiếu phiên bản nguồn đang chạy với repo/gói, kiểm tra staging dùng bản sao DB và các cấu hình production tương ứng. Bảo đảm các màn hình cũ vẫn hoạt động.
3. API cần IIS ASP.NET 4.8, app pool CLR v4.0 Integrated; giữ kiến trúc và cấu hình ứng dụng hiện tại. Portal/admin cần phục vụ file tĩnh và fallback React; trên IIS cần URL Rewrite.
4. CAPTCHA và phiên import hiện ở cache trong tiến trình. Đặt một worker cho app pool API. Nếu nhiều server API, cần affinity theo IP/routing ổn định cho mọi request API, hoặc thay cache bằng kho dùng chung trước khi triển khai. Fetch hiện không gửi cookie cross-origin, nên không mặc định coi affinity cookie là đủ. Recycle/deploy làm hết hạn các phiên xem trước.
5. WAF/proxy/IIS phải cho phép multipart .xlsx 80 MB và thời gian đọc logo. IIS endpoint Preview cho phép request 81 MB; httpRuntime tối thiểu 82944 KB. Tắt cache CDN/proxy cho /api/HoiQuy/*; API trả Cache-Control no-store/no-cache.
6. Kiểm tra HTTPS và CORS từ portal/admin tới API. Giữ cơ chế đăng nhập/Token hiện tại; quyền import là manage-hoiquy.

## 2. Sao lưu

Trước maintenance, tạo backup SQL Server đầy đủ bằng quy trình hiện có và kiểm tra backup có thể đọc/khôi phục. Sao lưu portal, admin, API bin/Global.asax/Web.config và cấu hình IIS/reverse proxy vào thư mục ngoài web root, gắn thời điểm và phiên bản. Giữ nguyên kho Upload/Media_Share. Không lấy database dev đè lên production.

## 3. Migration trước API

Trong SSMS chọn đúng database production đã xác nhận; kiểm tra SELECT DB_NAME() rồi chạy deployment/20261001-HoiQuy.sql bằng tài khoản triển khai có quyền DDL.

Migration tạo dbo.HoiQuyTrungUong và quyền manage-hoiquy, cấp quyền cho các nhóm đã có manage-user; chạy lại không tạo thêm bảng/quyền trùng. Tài khoản API cần SELECT/INSERT/UPDATE trên bảng mới; nếu đang dùng quyền qua role/schema, kiểm tra quyền kế thừa. Không cần cấp DDL cho tài khoản chạy API.

Chạy Verify-HoiQuy.sql: bảng có thể chưa có dữ liệu, quyền admin phải có. Đăng xuất/đăng nhập lại admin sau triển khai để tải danh sách quyền mới.

## 4. Triển khai API

Trong maintenance, đặt app_offline.htm tại root API hoặc dừng app pool theo quy trình của hệ thống. Sao chép DLL trong api-update/bin và Global.asax sau khi đối chiếu dependency; không xóa các file tùy biến chưa thuộc gói.

Giữ Web.config production. Gộp api-upload.config.fragment.xml bên trong configuration, tránh khai báo location trùng; kiểm tra httpRuntime và giới hạn proxy/WAF. Giữ nguyên connectionStrings, machineKey, secrets, OAuth/LDAP/2FA, binding và các cấu hình media. Gỡ app_offline.htm hoặc khởi động app pool.

Kiểm tra API Public/Menu cũ, GET /api/HoiQuy/Captcha trả 200 JSON Token/Image với no-store, GET /api/HoiQuy/Search?name= trả 400. POST Preview không đăng nhập trả 401, đăng nhập thiếu quyền trả 403.

## 5. Triển khai admin và import

Chốt URL admin từ site đang chạy. Điền AdminUrl trong production.json và chạy lại script đóng gói, hoặc gộp các giá trị runtime window.env của admin production vào index.html ứng viên; API HTTPS trỏ api-portal.moha.gov.vn, frontend/media trỏ moha.gov.vn. Kiểm tra manifest.AdminReady trước khi dùng gói.

Chép static assets trước, index.html sau; giữ Web.config và các thư mục media riêng. Đăng nhập tài khoản đã có manage-hoiquy, mở /HoiQuy/Import.

Chọn file trong import-data, đọc xem trước: 726 dòng, 625 Hội, 101 Quỹ, 228 logo; 2 dòng thiếu tên và 6 dòng thuộc 3 nhóm trùng. Mặc định bỏ qua 8 dòng, import 718 dòng hợp lệ. Lần đầu chọn Chỉ thêm mới. Sửa Excel gốc để bổ sung các dòng bị bỏ qua; không tự gộp nhóm trùng.

Kiểm tra kết quả import và Verify-HoiQuy.sql. DB mới sẽ có 718 bản ghi; nếu có dữ liệu sẵn, đối chiếu Added/Existing/Updated. Logo lưu trong DB, không cần chép logo vào Upload. Import lại ở chế độ chỉ thêm mới phải không tạo trùng.

## 6. Triển khai portal

Chép assets trước, index.html sau; giữ assets cũ trong thời gian client còn cache bundle cũ. Giữ Web.config production và các redirect/bot rules/kho media. Nếu cần, gộp quy tắc React fallback từ mẫu sau các quy tắc đặc thù; không thay toàn bộ cấu hình.

Kiểm tra trực tiếp https://moha.gov.vn/tra-cuu-hoi-quy và refresh/F5 vẫn trả trang React. Cập nhật liên kết banner/menu Hội và Quỹ trong admin tới /tra-cuu-hoi-quy nếu menu production đang trỏ trang cũ. Banner ở sidebar Giới thiệu trong code đã trỏ route mới.

## 7. Nghiệm thu

- Mới mở trang: chỉ form, không bảng và không request Search; tên trống không liệt kê toàn bộ.
- Nhập “an ninh” và mã đúng: thấy Hiệp hội An ninh mạng quốc gia, xem chi tiết chủ tịch/địa chỉ/điện thoại.
- Tìm có/không dấu, phân trang 10 dòng, không tìm thấy hiển thị thông báo; xóa tên ẩn kết quả.
- CAPTCHA sai/hết hạn bị từ chối; đổi mã hoạt động. Logo có trong nguồn hiển thị đúng.
- Admin thiếu quyền không import được; xem trước không tự lưu; import lại không nhân bản.
- Kiểm tra màn hình cũ, đăng nhập, tin tức, media, mobile; Console/Network không mixed-content, 404 assets hoặc lỗi CORS.
- Xóa/purge cache index.html theo chính sách CDN; không cache endpoint CAPTCHA/Search. Theo dõi log IIS/API/WAF sau triển khai.

## 8. Rollback

Nếu lỗi, dừng thao tác import và khôi phục portal/admin/API từ backup cùng thời điểm, giữ cấu hình production. Khôi phục assets cũ/index cũ, DLL cũ/Global.asax và phần Web.config đã chỉnh.

Migration là bổ sung nên có thể giữ bảng/quyền mới khi quay lại code cũ; không DROP bảng hoặc xóa dữ liệu vừa nhập. Nếu import cập nhật gây sai dữ liệu, dùng backup riêng bảng/DB theo quy trình DBA; không restore toàn bộ DB ghi đè các thay đổi nghiệp vụ phát sinh mà chưa đánh giá. Ghi lại số Added/Updated/Existing/Skipped và thời điểm import.

## Tạo lại gói

Sửa deployment/production.json theo môi trường đã xác nhận:

    powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/Prepare-ProductionRelease.ps1

Dùng -UseExistingUiBuilds chỉ khi bundle đã build và nguồn không mới hơn bundle; script kiểm tra timestamp. Gói đặt tại .dev/releases; SHA256 nằm trong manifest.json. Với AdminUrl=null, admin vẫn là ứng viên chưa hoàn tất cấu hình.

Tham khảo Microsoft về maintenance với app_offline.htm: https://learn.microsoft.com/en-us/aspnet/web-forms/overview/deployment/visual-studio-web-deployment/deploying-a-code-update
URL Rewrite IIS: https://learn.iis.net/downloads/microsoft/url-rewrite
