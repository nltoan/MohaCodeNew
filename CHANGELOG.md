# Nhật ký thay đổi

Ghi chú theo từng đợt, chuyển từ DEV-SETUP.md. Hướng dẫn cài đặt và chạy nằm ở DEV-SETUP.md.

## Tối ưu ảnh portal (thu nhỏ theo bề rộng)

Ảnh trong `Upload/` và `Media_Share/` (jpg/png) không còn tải bản gốc nhiều MB. Portal gọi `GET api/Public/Img?src=/Upload/abc.jpg&w=640`; API thu nhỏ theo bề rộng (chỉ các mốc 160/240/320/480/640/800/1024/1280/1600, làm tròn lên), giữ PNG trong suốt, xoay theo EXIF, lưu cache ở `App_Data/img-cache` và trả `Cache-Control` 30 ngày kèm ETag/304. Ví dụ ảnh thật 148 KB còn 33 KB ở 480px. `getUrlImage(url, width)` mặc định 640px; banner dùng 1600, ảnh chính tin 1024, `width = 0` lấy ảnh gốc (og:image). Ảnh trong nội dung bài viết thu nhỏ 1280px và tải lười.

Điểm cần biết khi triển khai:
- API đọc file trong thư mục của nó nếu có; nếu không thì tải từ `ImageSourceBaseUrl` (appSetting, mặc định lấy `frontendSiteUrl`). Production nên đặt `ImageSourceBaseUrl` = https://moha.gov.vn nếu kho Upload nằm ở host portal, không phải host API. Chỉ thêm khóa này vào `appSettings.local.config` hoặc gộp tay, không ghi đè Web.config production.
- Tài khoản chạy app pool cần quyền ghi `App_Data/img-cache`. Có thể xóa thư mục này bất cứ lúc nào; ảnh sẽ được tạo lại khi có yêu cầu.
- Chỉ nhận đường dẫn tương đối trong `Upload/` hoặc `Media_Share/` đuôi jpg/jpeg/png; đường dẫn khác trả 400. Lỗi hoặc ảnh quá lớn thì chuyển hướng về ảnh gốc, trang không mất ảnh.

## Mở rộng ổ C trên máy dev ban đầu

Ổ C đã được mở rộng lên khoảng 146,9 GiB; Recovery 1 GiB được tạo lại ở cuối ổ và Windows RE đã bật lại. Bản sao Recovery và nhật ký thao tác nằm trong `%LOCALAPPDATA%\MohaDev`.

## Kiểm tra tối ưu frontend tại local

Bản build production tối ưu đang được xem thử tại http://localhost:5175/. Server xem thử chạy bằng scripts/Serve-PortalPreview.mjs, phục vụ frontend/dist, thay API sang localhost:55104 và dùng ảnh công khai trên moha.gov.vn. GA tắt trên localhost. Không ghi dữ liệu production. Máy chủ dev/HMR vẫn ở http://localhost:5173/.

Để chạy lại preview sau khi build frontend: dùng Node đã cài để chạy scripts/Serve-PortalPreview.mjs từ repository. Port 5175 chỉ bind localhost. PID phiên hiện tại lưu trong .dev/portal-preview.pid; kiểm tra tiến trình trước khi dừng, không chạy thêm phiên trùng port.

Kiểm tra: Ctrl+Shift+R trang chủ, xem tin/ảnh đầu trang, cuộn dần tới văn bản/tương tác/đa phương tiện/các trang thành phần, mở trang tin rồi quay lại; thử mobile và đổi ngôn ngữ. Các khối phía dưới tải khi cách viewport 400px hoặc tự tải nền sau 2,5 giây + idle (timeout idle 1 giây); không phụ thuộc thao tác cuộn. Menu/banner/tin nổi bật và một số widget công khai dùng cache RAM 30 giây; F5 lấy mới. Các request đồng thời cùng URL được gộp, lỗi không được cache, dữ liệu trả cho mỗi caller được sao chép độc lập. Không cache tìm kiếm/CAPTCHA/import.

Đã kiểm tra build, desktop/mobile, các khối tải khi cuộn, route Hội/Quỹ chưa tìm không hiện kết quả, và cache (gộp request, hết hạn, ngôn ngữ, lỗi thử lại). Bundle entry giảm từ 1.180.834 byte xuống 571.868 byte; gzip giảm 46,9%. Đây là giảm kích thước bundle, không phải khẳng định thời gian tải giảm cùng tỷ lệ. Báo cáo local: .dev/performance-after.json. Chưa triển khai production trong bước tối ưu này.


## Bản tối ưu SEO/layout tiếp theo

Vẫn deploy portal tĩnh, không SSR/Node.js trên production. Đợt này từng dùng scripts/Prepare-PortalRelease.ps1 để đóng gói riêng portal; script đó đã gỡ (11/2026), dùng scripts/Prepare-ProductionRelease.ps1 và chỉ chép thư mục portal của gói. Bản xem thử local port 5175 phục vụ build mới nhất. Đã bổ sung title mặc định, description theo trang, canonical/og:url tuyệt đối và H1 đúng cho các trang chính; đưa menu chuyên mục mobile xuống sau nội dung và giữ chỗ khi tải. Kết quả đo cuối ở .dev/portal-audit-report.md.

## Kiểm tra thêm các phần portal (02/10/2026)

Đã sửa tìm kiếm (encoding, phân trang, retry và phản hồi đến trễ), landing giới thiệu/văn bản theo menu, bộ lọc văn bản mobile, URL media/attachment, thư viện rỗng/lỗi, bảng lịch sử, album, chi tiết đề tài, metadata chuyên đề và trang không tồn tại. Test local production build tại http://localhost:5175/. Chạy scripts/Audit-PortalSections.cjs, scripts/Test-PortalSections.cjs và scripts/Test-PortalMediaUrls.cjs bằng Node đã cài. Các bài test trình duyệt cố định tiếng Việt; dữ liệu multimedia tiếng Anh local hiện rỗng. Báo cáo phạm vi và giới hạn tại .dev/portal-sections-report.md. Chưa deploy; cách chép portal tĩnh không đổi, không cần migration mới cho bản này.

## Dọn tooling và tài liệu (11/2026)

- Gỡ chuỗi sitemap tĩnh (Generate-PublicSitemap, Export-PublicNewsUrls, Export-FromIisApiConfig): thay bằng sitemap động của API (deployment/SITEMAP-DONG.md).
- Gỡ cách snapshot Dublin Core tĩnh (Generate-DublinCoreSnapshots, DUBLIN-CORE-STATIC.md, dublin-core-rewrite.fragment.xml): thay bằng API MetadataPage (deployment/METADATA-HTML-THU-NGHIEM.md).
- Gỡ Prepare-PortalRelease.ps1, Audit-Portal.cjs, Audit-PortalSections.cjs (Audit-PortalAll.cjs thay thế, nhận PORTAL_AUDIT_ROUTES), Inspect-LayoutShift.cjs.
- Gộp Test-MinisterLoading/Test-NqHomeLoading thành Test-SiteHomeLoading.cjs; gộp Initialize-HoiQuy/Initialize-TinTucNgonNgu thành Initialize-Migrations.ps1.
- Báo cáo theo ngày chuyển vào deployment/archive/ (không đóng gói).
- Bản tối ưu hiệu năng và SEO portal (trước đây là mục cuối của DEPLOY-MOHA.md): chỉ cập nhật portal, không migration, không Node.js trên server; quy trình nay nằm ở mục Triển khai portal của DEPLOY-MOHA.md.
