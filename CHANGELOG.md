# Nhật ký thay đổi

Ghi chú theo từng đợt, chuyển từ DEV-SETUP.md. Hướng dẫn cài đặt và chạy nằm ở DEV-SETUP.md.

## Mở rộng ổ C trên máy dev ban đầu

Ổ C đã được mở rộng lên khoảng 146,9 GiB; Recovery 1 GiB được tạo lại ở cuối ổ và Windows RE đã bật lại. Bản sao Recovery và nhật ký thao tác nằm trong `%LOCALAPPDATA%\MohaDev`.

## Kiểm tra tối ưu frontend tại local

Bản build production tối ưu đang được xem thử tại http://localhost:5175/. Server xem thử chạy bằng scripts/Serve-PortalPreview.mjs, phục vụ frontend/dist, thay API sang localhost:55104 và dùng ảnh công khai trên moha.gov.vn. GA tắt trên localhost. Không ghi dữ liệu production. Máy chủ dev/HMR vẫn ở http://localhost:5173/.

Để chạy lại preview sau khi build frontend: dùng Node đã cài để chạy scripts/Serve-PortalPreview.mjs từ repository. Port 5175 chỉ bind localhost. PID phiên hiện tại lưu trong .dev/portal-preview.pid; kiểm tra tiến trình trước khi dừng, không chạy thêm phiên trùng port.

Kiểm tra: Ctrl+Shift+R trang chủ, xem tin/ảnh đầu trang, cuộn dần tới văn bản/tương tác/đa phương tiện/các trang thành phần, mở trang tin rồi quay lại; thử mobile và đổi ngôn ngữ. Các khối phía dưới tải khi cách viewport 400px hoặc tự tải nền sau 2,5 giây + idle (timeout idle 1 giây); không phụ thuộc thao tác cuộn. Menu/banner/tin nổi bật và một số widget công khai dùng cache RAM 30 giây; F5 lấy mới. Các request đồng thời cùng URL được gộp, lỗi không được cache, dữ liệu trả cho mỗi caller được sao chép độc lập. Không cache tìm kiếm/CAPTCHA/import.

Đã kiểm tra build, desktop/mobile, các khối tải khi cuộn, route Hội/Quỹ chưa tìm không hiện kết quả, và cache (gộp request, hết hạn, ngôn ngữ, lỗi thử lại). Bundle entry giảm từ 1.180.834 byte xuống 571.868 byte; gzip giảm 46,9%. Đây là giảm kích thước bundle, không phải khẳng định thời gian tải giảm cùng tỷ lệ. Báo cáo local: .dev/performance-after.json. Chưa triển khai production trong bước tối ưu này.


## Bản tối ưu SEO/layout tiếp theo

Vẫn deploy portal tĩnh, không SSR/Node.js trên production. Dùng scripts/Prepare-PortalRelease.ps1 để đóng gói riêng portal. Bản xem thử local port 5175 phục vụ build mới nhất. Đã bổ sung title mặc định, description theo trang, canonical/og:url tuyệt đối và H1 đúng cho các trang chính; đưa menu chuyên mục mobile xuống sau nội dung và giữ chỗ khi tải. Kết quả đo cuối ở .dev/portal-audit-report.md.

## Kiểm tra thêm các phần portal (02/10/2026)

Đã sửa tìm kiếm (encoding, phân trang, retry và phản hồi đến trễ), landing giới thiệu/văn bản theo menu, bộ lọc văn bản mobile, URL media/attachment, thư viện rỗng/lỗi, bảng lịch sử, album, chi tiết đề tài, metadata chuyên đề và trang không tồn tại. Test local production build tại http://localhost:5175/. Chạy scripts/Audit-PortalSections.cjs, scripts/Test-PortalSections.cjs và scripts/Test-PortalMediaUrls.cjs bằng Node đã cài. Các bài test trình duyệt cố định tiếng Việt; dữ liệu multimedia tiếng Anh local hiện rỗng. Báo cáo phạm vi và giới hạn tại .dev/portal-sections-report.md. Chưa deploy; cách chép portal tĩnh không đổi, không cần migration mới cho bản này.
