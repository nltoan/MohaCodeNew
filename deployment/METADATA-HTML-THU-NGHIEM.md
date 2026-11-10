# Metadata trong HTML thô: thử nghiệm, chưa sẵn sàng triển khai

API `MetadataPage` dựng phần head cho một số URL công khai dựa trên dữ liệu nguồn, sau đó trả khung SPA có cùng bundle. Không tăng lượt xem khi tạo head. Theo quyết định của đơn vị, trang chủ và chuyên mục thiếu ngày nguồn được ấn định ngày ổn định trong khoảng 01/2025–01/2026, gắn `DC.Date.Source=owner-assigned`. Ngày ấn định không tự chứng minh được ngày tạo/cập nhật theo lịch sử hệ thống; cần đối chiếu quy định và hồ sơ nghiệp vụ. Các loại khác thiếu ngày vẫn không có DC.Date. Đây là head render, không phải SSR đầy đủ nội dung. Rule ứng viên bao gồm một số trang chính, tin, văn bản, chuyên mục, thông báo, nghiên cứu và một số đường dẫn ID cũ. Media và chuyên trang chưa được đưa vào rule do chưa xác định được ý nghĩa toàn bộ trạng thái album.

**Chưa áp dụng rule trên production.** API mặc định trả CSP `default-src 'self'`; IIS/ARR chuyển CSP này về portal có thể chặn tài nguyên. `api-metadata-csp.fragment.xml` là cấu hình riêng cho endpoint, sao chép CSP portal đã quan sát; không sửa CSP chung của API. IIS Express local đã kiểm tra endpoint metadata nhận policy riêng và SitemapIndex vẫn nhận policy API cũ. Cần đối chiếu policy này với CSP thực tế sau mỗi lần thay đổi portal; nếu WAF/IIS portal bổ sung header khác, các policy sẽ cùng được áp dụng. Kiểm tra đầy đủ header qua IIS/ARR, cache, redirect, 404, liên kết, tập tin, truy cập trực tiếp, chuyển trang, mobile, ngôn ngữ và bot trên staging trước khi triển khai.

Template `App_Data/portal-index.html` trên API phải là bản `index.html` khớp tuyệt đối với assets portal; pipeline phải cập nhật cả hai đồng bộ mỗi lần deploy frontend, giữ assets cũ và rollback cùng lúc. Nếu thiếu template hoặc mẫu sai, endpoint trả 503. Không chứa secret trong template. Các rule bot hiện hữu phải được kiểm tra riêng vì đứng trước rule ứng viên và có thể trả HTML metadata khác.

Thử nghiệm local đã xác nhận HTML thô cho tin, văn bản, đường dẫn văn bản cũ `qpid`, dự thảo, chuyên mục, album ảnh và một số trang chính có title, identifier và ngày nếu DB có; chặn đường dẫn không hợp lệ và bản ghi không tồn tại. React đã render trong kiểm thử với CSP endpoint riêng và dữ liệu API giả lập. Điều này không xác nhận IIS/ARR production an toàn. Các loại URL cũ khác, media, chuyên trang và ngày nguồn còn thiếu vẫn cần xử lý trước khi xác nhận hoàn tất.

## Cập nhật 10/11/2026 (đối chiếu Phụ lục IV TT 22/2023/TT-BTTTT)

Phụ lục IV: bắt buộc Title, Creator, Date, Publisher, Description, Identifier; khuyến nghị Language, Source, Contributor, Subject; không để trống yếu tố bắt buộc; áp dụng cho trang chủ, thông tin giới thiệu cơ quan, tin bài (tin tức, chỉ đạo điều hành, tuyên truyền, chiến lược), văn bản, dịch vụ công, Công báo, dự án đầu tư, đề tài khoa học, báo cáo thống kê.

Thay đổi:
- `MetadataPage` thêm `DC.Language=vie` và `DC.Subject` (trước đây bị xoá cùng các thẻ tĩnh của template mà không dựng lại).
- Thêm các trang giới thiệu (`/gioi-thieu`, `/gioi-thieu/{chuc-nang-nhiem-vu|lich-su-bo|lanh-dao-bo|co-cau-to-chuc|lich-su-hinh-thanh-va-phat-trien}`, `/gioi-thieu-bo-truong`) và bài chi tiết của các mục này; bài của chuyên trang `/bo-truong/...` và `/nghi-quyet-tw4/...`.
- Dự thảo văn bản dùng `NgayBatDauLayYKien` làm `DC.Date` (ngày thật, không ấn định).
- Trang giới thiệu dạng danh mục không có ngày nguồn dùng ngày ấn định ổn định (cùng thuật toán ở frontend `PortalSeo` và API) kèm `DC.Date.Source=owner-assigned`; áp dụng cùng quyết định của đơn vị như trang chủ/chuyên mục. Cần chủ nội dung xác nhận.
- `deployment/metadata-head-rewrite.fragment.xml` cập nhật rule tương ứng.
- `scripts/Prepare-ProductionRelease.ps1` tự đặt `api-update/App_Data/portal-index.html` = `portal/index.html` của cùng bản build (đảm bảo khớp assets).
- `scripts/Test-MetadataHead.ps1` thêm kiểm tra trang giới thiệu và mỗi yếu tố DC xuất hiện đúng một lần.

Chưa làm/chưa kiểm chứng: chưa chạy MetadataPage với CSDL thật hoặc IIS/ARR; media (photo/video/audio) và dịch vụ công/Công báo/dự án/báo cáo thống kê chưa có rule vì chưa có trang tương ứng trên portal; giữ nguyên quy tắc kiểm tra CSP/ARR/staging ở trên trước khi bật rule.
