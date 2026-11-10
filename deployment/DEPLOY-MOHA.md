# Runbook triển khai moha.gov.vn

Gói cập nhật ba phần: portal React, admin React, API ASP.NET Framework 4.8, cùng các migration SQL. Đây là gói ứng viên đã kiểm tra local; chưa triển khai production. Cần thử staging và đối chiếu phiên bản đang chạy trước khi thay DLL/bundle, vì build chứa toàn bộ ứng dụng trong repo.

Thứ tự bắt buộc: 1 Gói, 2 Kiểm tra trước, 3 Migration, 4 API, 5 Portal, 6 Admin, 7 Nghiệm thu, 8 Rollback. Mục 9 mô tả cách tạo lại gói.

## 1. Thành phần gói

Gói do `scripts/Prepare-ProductionRelease.ps1` tạo tại `.dev/releases/moha-hoiquy-<thời điểm>` (kèm file `.zip`).

| Thành phần | Cách sử dụng |
|---|---|
| portal | Bundle portal, URL HTTPS production (đã thay trong `runtime-config.js`). Giữ Web.config và kho Upload/Media_Share hiện có trên server. |
| admin-candidate | Bundle admin (đã bỏ file `.map`). Nếu manifest.AdminReady=false, phải chốt REACT_APP_BACKEND_URL/các cấu hình của admin đang chạy trước khi triển khai. |
| api-update/bin | DLL build Release (không có `.pdb`, không có `API.dll.config`). Sao lưu và đối chiếu toàn bộ dependency với phiên bản API đang chạy. |
| api-update/Global.asax | File khởi động tương ứng với API.MvcApplication. |
| api-update/App_Data/portal-index.html | Khung HTML cho API MetadataPage; là bản sao `portal/index.html` của cùng bản build, phải khớp bundle portal trong gói. |
| deployment/2026*.sql | Toàn bộ migration trong `db/migrations`; chạy theo thứ tự tên file trước khi cập nhật API (xem mục 3). |
| deployment/*.fragment.xml | Phần cấu hình cần gộp, không chép đè: `api-upload.config.fragment.xml` (Web.config API), `api-metadata-csp.fragment.xml`, `metadata-head-rewrite.fragment.xml`, `sitemap-rewrite.fragment.xml` (Web.config portal). |
| deployment/*.web.config.sample.xml | Mẫu tham khảo URL Rewrite của portal/admin; không chép đè cấu hình production. |
| deployment/Verify-HoiQuy.sql, KIEM-TRA-*.sql | Kiểm tra DB sau migration/import và chẩn đoán đăng nhập/ngày metadata (chỉ đọc). |
| deployment/CSP-PORTAL.txt, production.json | Nguồn CSP cần gộp; cấu hình URL dùng khi đóng gói. |
| deployment/*.md | Chỉ các runbook hiện hành: DEPLOY-MOHA, SECURITY-HARDENING, NGON-NGU-TIN-TUC, SITEMAP-DONG, METADATA-HTML-THU-NGHIEM, LDAP-RESTORE-STAGING, FIX-UPLOAD-413. |
| import-data | Chỉ có khi đóng gói với -IncludeImportData: Excel gốc Hội và Quỹ để import bằng admin. Giữ ngoài web root công khai. |
| manifest.json | SHA256 và kích thước từng file, commit nguồn, trạng thái cấu hình admin. |

Thư mục con `deployment/archive/` (ghi chú và báo cáo theo ngày) và các ghi chú nội bộ không được đóng gói; script chỉ lấy file ở cấp cao nhất của `deployment/` theo danh sách cho phép.

Gói không chứa Web.config API, `appSettings.local.config`, chuỗi kết nối production, database backup, LocalDB hoặc tài khoản test. Node.js/pnpm/MSBuild dùng trên máy build; production không cần Vite, CRA dev server hay Node để phục vụ hai bundle tĩnh.

## 2. Kiểm tra trước khi triển khai

Đã xác minh:

- HTML công khai của https://moha.gov.vn/ ngày 01/10/2026 khai báo API https://api-portal.moha.gov.vn/api/Public/ và media https://moha.gov.vn/.
- Portal và admin trong repo có cấu hình IIS URL Rewrite cho React; API target .NET Framework 4.8. Máy dev dùng IIS Express, không có IIS production để lấy thông tin sites/app pools.
- URL admin đã ghi trong deployment/production.json (AdminUrl). Chưa xác minh server/path/app pool, database production, pipeline, reverse proxy/WAF và số node API.

Việc cần làm:

1. Trên server/IIS Manager, ghi lại site, physical path, app pool của portal/admin/API; xem connectionStrings CongTTDT_MOHAEntities để xác nhận đúng database. Không gửi mật khẩu qua chat.
2. Đối chiếu phiên bản nguồn đang chạy với repo/gói, kiểm tra staging dùng bản sao DB và các cấu hình production tương ứng. Bảo đảm các màn hình cũ vẫn hoạt động.
3. API cần IIS ASP.NET 4.8, app pool CLR v4.0 Integrated; giữ kiến trúc và cấu hình ứng dụng hiện tại. Portal/admin cần phục vụ file tĩnh và fallback React; trên IIS cần URL Rewrite.
4. CAPTCHA và phiên import hiện ở cache trong tiến trình. Đặt một worker cho app pool API. Nếu nhiều server API, cần affinity theo IP/routing ổn định cho mọi request API, hoặc thay cache bằng kho dùng chung trước khi triển khai. Fetch hiện không gửi cookie cross-origin, nên không mặc định coi affinity cookie là đủ. Recycle/deploy làm hết hạn các phiên xem trước.
5. WAF/proxy/IIS phải cho phép request upload Excel và thời gian đọc logo. Admin hiện upload từng phần 4 MiB (xem mục 6); proxy/WAF phải cho phép request 4 MiB. Tắt cache CDN/proxy cho /api/HoiQuy/*; API trả Cache-Control no-store/no-cache.
6. Kiểm tra HTTPS và CORS từ portal/admin tới API. Giữ cơ chế đăng nhập/Token hiện tại; quyền import là manage-hoiquy.
7. Sao lưu: tạo backup SQL Server đầy đủ bằng quy trình hiện có và kiểm tra backup có thể đọc/khôi phục. Sao lưu portal, admin, API bin/Global.asax/Web.config và cấu hình IIS/reverse proxy vào thư mục ngoài web root, gắn thời điểm và phiên bản. Giữ nguyên kho Upload/Media_Share. Không lấy database dev đè lên production.
8. Bí mật nằm ngoài git: mật khẩu DB và khóa reCAPTCHA của production phải có sẵn trên server (Web.config production và `appSettings.local.config` cạnh Web.config, nếu dùng). Xem SECURITY-HARDENING.md.

## 3. Migration cơ sở dữ liệu

Chạy **trước** khi cập nhật API. Trong SSMS chọn đúng database production đã xác nhận, kiểm tra `SELECT DB_NAME()`, rồi chạy bằng tài khoản triển khai có quyền DDL toàn bộ file `deployment/2026*.sql` (bản sao của `db/migrations`) theo thứ tự tên file. Mọi file đều idempotent, chạy lại không tạo trùng. Danh sách hiện có:

| File | Nội dung |
|---|---|
| 20261001-HoiQuy.sql | Tạo dbo.HoiQuyTrungUong và quyền manage-hoiquy, cấp cho các nhóm đã có manage-user. Không tự import dữ liệu. |
| 20261109-TinTuc-NgonNgu.sql | Thêm cột dbo.TinTuc.NgonNgu; lần đầu gán `vi` cho tin hiện có. **Không triển khai API mới trước migration này** (EDMX mới yêu cầu cột). Xem NGON-NGU-TIN-TUC.md. |
| 20261110-MatKhauMacDinh.sql | Thêm cột mật khẩu mặc định cho User_Account. Tài khoản hiện có chỉ được đánh dấu khi DBA tự chạy câu UPDATE mẫu (đang để dạng chú thích trong file); điền danh sách tài khoản thực tế tại chỗ, không lưu vào git. |
| 20261111-BoSungQuyen.sql | Bổ sung quyền (permissions) mà API mới yêu cầu. Chạy trước API. |
| 20261111-TinTucHistory-BoSungCot.sql | Bổ sung cột cho bảng lịch sử tin (TinTucHistory). Chạy trước API; kiểm tra luồng duyệt/khôi phục lịch sử sau khi triển khai. |

Hai file 20261111-* được bổ sung cùng đợt này; đọc nội dung từng file trước khi chạy và đối chiếu với danh sách thực tế trong gói.

Tài khoản API cần SELECT/INSERT/UPDATE trên bảng mới; nếu đang dùng quyền qua role/schema, kiểm tra quyền kế thừa. Không cần cấp DDL cho tài khoản chạy API.

Chạy `Verify-HoiQuy.sql`: bảng có thể chưa có dữ liệu, quyền admin phải có. Đăng xuất/đăng nhập lại admin sau triển khai để tải danh sách quyền mới.

## 4. Triển khai API

1. Trong maintenance, đặt app_offline.htm tại root API hoặc dừng app pool theo quy trình của hệ thống.
2. Sao chép DLL trong `api-update/bin`, `Global.asax` và `App_Data/portal-index.html` (khung HTML cho MetadataPage) sau khi đối chiếu dependency; không xóa các file tùy biến chưa thuộc gói.
3. Giữ Web.config production. Gộp `api-upload.config.fragment.xml` bên trong configuration, tránh khai báo location trùng; kiểm tra httpRuntime và giới hạn proxy/WAF. Giữ nguyên connectionStrings, machineKey, secrets (kể cả `appSettings.local.config`), OAuth/LDAP/2FA, binding và các cấu hình media.
4. Nếu dùng MetadataPage và sitemap động, gộp thêm các rule/CSP tương ứng theo METADATA-HTML-THU-NGHIEM.md (`api-metadata-csp.fragment.xml`) và SITEMAP-DONG.md. `App_Data/portal-index.html` phải luôn khớp bundle portal; nếu thiếu hoặc sai mẫu, endpoint metadata trả 503.
5. Gỡ app_offline.htm hoặc khởi động app pool.

Kiểm tra: API Public/Menu cũ; GET /api/HoiQuy/Captcha trả 200 JSON Token/Image với no-store; GET /api/HoiQuy/Search?name= trả 400; POST Preview không đăng nhập trả 401, đăng nhập thiếu quyền trả 403.

Nếu endpoint upload cũ `HoiQuy/Preview` còn dùng luồng nguyên file, xem FIX-UPLOAD-413.md; luồng chunk mới không cần nâng giới hạn request.

## 5. Triển khai portal

Portal vẫn là React CSR trên IIS, chỉ deploy file tĩnh; không cần Node.js trên server. Có thể chỉ cập nhật thư mục `portal` của gói (không đụng API/admin/migration) khi chỉ thay đổi frontend; khi đó vẫn đồng bộ `App_Data/portal-index.html` của API với `portal/index.html` mới.

1. Chép `assets` trước, rồi `runtime-config.js` và các file public khác, `index.html` **cuối cùng**. Không giữ `runtime-config.js` từ bản cũ. Giữ assets cũ trong thời gian client còn cache bundle cũ.
2. Giữ Web.config production và các redirect/bot rules/kho media. Nếu cần, gộp quy tắc React fallback từ mẫu sau các quy tắc đặc thù; không thay toàn bộ cấu hình. Rule sitemap/metadata gộp theo SITEMAP-DONG.md và METADATA-HTML-THU-NGHIEM.md (đặt trước rule tổng quát).
3. Purge cache `/`, `/index.html` và `/runtime-config.js` theo chính sách CDN.
4. Kiểm tra trực tiếp https://moha.gov.vn/tra-cuu-hoi-quy và refresh/F5 vẫn trả trang React. Cập nhật liên kết banner/menu Hội và Quỹ trong admin tới /tra-cuu-hoi-quy nếu menu production đang trỏ trang cũ. Banner ở sidebar Giới thiệu trong code đã trỏ route mới.

Nội dung trang chủ dưới màn hình tự tải nền sau phần đầu trang, không đòi hỏi cuộn. Description/canonical/og:url tạo phía client; chưa phải SSR (HTML thô cho bot do MetadataPage cung cấp một phần). Hiệu năng tốt hơn không đảm bảo thứ hạng tăng.

## 6. Triển khai admin và import

1. Chốt URL admin từ site đang chạy. Điền AdminUrl trong production.json và chạy lại script đóng gói, hoặc gộp các giá trị runtime window.env của admin production vào index.html ứng viên; API HTTPS trỏ api-portal.moha.gov.vn, frontend/media trỏ moha.gov.vn. Kiểm tra manifest.AdminReady trước khi dùng gói.
2. Chép static assets trước, index.html sau; giữ Web.config và các thư mục media riêng. **Triển khai API trước admin.**
3. Đăng nhập tài khoản đã có manage-hoiquy, mở /HoiQuy/Import.

Admin import gọi UploadStart, UploadChunk và UploadComplete; mỗi phần tối đa 4 MiB, có tiến độ và thử lại tối đa ba lần. Tổng file tối đa 80 MiB. API giữ phần upload trong bộ nhớ cache, một phiên mỗi tài khoản, hết hạn sau 30 phút hoặc được thay bởi phiên mới; không ghi file tạm ra ổ đĩa. Luồng này vẫn yêu cầu một worker hoặc affinity như mục 2. Dự trù RAM cho các tài khoản upload đồng thời; không recycle worker trong lúc import.

Import dữ liệu Hội và Quỹ: chọn file trong import-data, đọc xem trước: 726 dòng, 625 Hội, 101 Quỹ, 228 logo; 2 dòng thiếu tên và 6 dòng thuộc 3 nhóm trùng. Mặc định bỏ qua 8 dòng, import 718 dòng hợp lệ. Lần đầu chọn Chỉ thêm mới. Sửa Excel gốc để bổ sung các dòng bị bỏ qua; không tự gộp nhóm trùng. Kiểm tra kết quả import và Verify-HoiQuy.sql. DB mới sẽ có 718 bản ghi; nếu có dữ liệu sẵn, đối chiếu Added/Existing/Updated. Logo lưu trong DB, không cần chép logo vào Upload. Import lại ở chế độ chỉ thêm mới phải không tạo trùng.

## 7. Nghiệm thu sau triển khai

Tra cứu Hội và Quỹ:

- Mới mở trang: chỉ form, không bảng và không request Search; tên trống không liệt kê toàn bộ.
- Nhập “an ninh” và mã đúng: thấy Hiệp hội An ninh mạng quốc gia, xem chi tiết chủ tịch/địa chỉ/điện thoại.
- Tìm có/không dấu, phân trang 10 dòng, không tìm thấy hiển thị thông báo; xóa tên ẩn kết quả.
- CAPTCHA sai/hết hạn bị từ chối; đổi mã hoạt động. Logo có trong nguồn hiển thị đúng.
- Admin thiếu quyền không import được; xem trước không tự lưu; import lại không nhân bản.

Chung:

- Kiểm tra màn hình cũ, đăng nhập, tin tức (cả hai ngôn ngữ, luồng duyệt/lịch sử), media, mobile; Console/Network không mixed-content, 404 assets hoặc lỗi CORS.
- Xóa/purge cache index.html theo chính sách CDN; không cache endpoint CAPTCHA/Search. Theo dõi log IIS/API/WAF sau triển khai.
- Sitemap (`/sitemap_index.xml`) và metadata HTML thô: kiểm tra theo SITEMAP-DONG.md, METADATA-HTML-THU-NGHIEM.md; Search Console URL Inspection để xác nhận HTML render và canonical Google chọn.

### Google Analytics 4

Portal dùng /runtime-config.js cùng tên miền thay cho script cấu hình inline, nên không cần thêm unsafe-inline hoặc cập nhật hash mỗi lần đổi cấu hình (nhớ chép runtime-config.js trước index.html và purge cache cả hai).

- Mã đo lường: G-R36X6C2E0S. Portal tích hợp qua frontend/src/services/analytics.ts và frontend/public/runtime-config.js. Chỉ bản production trên moha.gov.vn hoặc www.moha.gov.vn khởi tạo thẻ; localhost, staging và admin không gửi dữ liệu vào tài sản này.
- Trong luồng web Google Analytics, kiểm tra Đo lường nâng cao > Lượt xem trang > Cài đặt nâng cao bật đo khi lịch sử trình duyệt thay đổi để ghi nhận chuyển trang React. Không chèn thêm đoạn gtag vào IIS/template hay Google Tag Manager cho cùng mã vì sẽ trùng lượt xem.
- Sau khi deploy, mở site thật, kiểm tra Network tải gtag/js?id=G-R36X6C2E0S, request collect cùng mã, rồi xem báo cáo Thời gian thực. Chưa xác minh nhận dữ liệu production trước khi deploy. Thay đổi GA không cần migration DB.

### CSP

CSP phải được gộp tại server/WAF đang trả header hiệu lực, không thêm header thứ hai (xem CSP-PORTAL.txt và SECURITY-HARDENING.md). script-src giữ 'self'; để GA tải được, bổ sung https://www.googletagmanager.com vào script-src, và https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com vào connect-src (giữ nguyên các nguồn đang dùng). Kiểm tra img-src cho https://*.google-analytics.com nếu phát sinh request ảnh. Mẫu chỉ là các nguồn cần gộp, không thay toàn bộ CSP hiện hữu. Phần SEO/layout không cần thêm nguồn CSP. Endpoint MetadataPage có CSP riêng: xem METADATA-HTML-THU-NGHIEM.md.

## 8. Rollback

Nếu lỗi, dừng thao tác import và khôi phục portal/admin/API từ backup cùng thời điểm, giữ cấu hình production. Khôi phục assets cũ/index cũ (và `App_Data/portal-index.html` cùng bản với portal cũ), DLL cũ/Global.asax và phần Web.config đã chỉnh.

Migration là bổ sung nên có thể giữ bảng/cột/quyền mới khi quay lại code cũ; không DROP bảng hoặc xóa dữ liệu vừa nhập, và giữ cột TinTuc.NgonNgu (xem NGON-NGU-TIN-TUC.md). Nếu import cập nhật gây sai dữ liệu, dùng backup riêng bảng/DB theo quy trình DBA; không restore toàn bộ DB ghi đè các thay đổi nghiệp vụ phát sinh mà chưa đánh giá. Ghi lại số Added/Updated/Existing/Skipped và thời điểm import. Với sitemap/metadata, khôi phục API và Web.config portal từ backup rồi xóa cache.

## 9. Tạo lại gói triển khai

Sửa deployment/production.json theo môi trường đã xác nhận (URL HTTPS portal/API/media, AdminUrl, mã GA), rồi chạy trên Windows:

    powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/Prepare-ProductionRelease.ps1

Script build portal, admin và API Release (cần VS Build Tools 2022, Node 22, pnpm; xem DEV-SETUP.md), kiểm tra bundle không cũ hơn nguồn, thay URL production, từ chối URL không phải production (tefli.vn, localhost) và kiểm tra mã GA khớp production.json. Dùng -UseExistingUiBuilds chỉ khi bundle đã build và nguồn không mới hơn bundle; script kiểm tra timestamp. Gói đặt tại .dev/releases; SHA256 nằm trong manifest.json. Nếu để trống AdminUrl, gói là ứng viên admin chưa hoàn tất cấu hình (manifest.AdminReady=false). Dùng -IncludeImportData để kèm Excel import (mặc định không).

Tham khảo Microsoft về maintenance với app_offline.htm: https://learn.microsoft.com/en-us/aspnet/web-forms/overview/deployment/visual-studio-web-deployment/deploying-a-code-update
URL Rewrite IIS: https://learn.iis.net/downloads/microsoft/url-rewrite
