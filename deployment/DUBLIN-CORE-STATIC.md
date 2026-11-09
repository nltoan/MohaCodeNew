# Metadata Dublin Core trong HTML tĩnh

Portal hiện là React CSR, IIS trả cùng một index.html cho các đường dẫn. Bản build không thể tự tạo metadata riêng ở server nếu không bổ sung kết xuất động hoặc xuất ảnh chụp tĩnh. Công cụ `scripts/Generate-DublinCoreSnapshots.cjs` tạo HTML cho danh sách URL đã xác định, sử dụng metadata sau khi React tải dữ liệu. Nó không thay đổi API, cơ sở dữ liệu, IIS hay production.

## Tạo và kiểm tra gói thử nghiệm

1. Build frontend. Chạy bản preview trên loopback với API và dữ liệu staging tương ứng; kiểm tra runtime-config.js của preview thực sự trỏ staging. API PostDetail hiện tăng lượt xem, nên không dùng công cụ này quét production hàng loạt.
2. Lập file JSON UTF-8 là mảng đường dẫn, ví dụ `["/tin-tuc/bai---id123", "/nghien-cuu-khoa-hoc/de-tai---id456"]`. Danh sách phải được lấy từ dữ liệu đã công bố và đối chiếu với sitemap/menu, bao gồm URL cũ đang được dùng. Tool không tự khẳng định đã bao phủ toàn website.
3. Chạy `node scripts/Generate-DublinCoreSnapshots.cjs routes.json .dev/dc-release-unique`. Thư mục đích phải chưa tồn tại. Chỉ dùng địa chỉ preview localhost trong biến `DC_PREVIEW_URL`.
4. Đọc manifest.json: `ok: false` là không tạo snapshot; `hasDate: false` là chưa có ngày trong nguồn. Exit code 2 nghĩa là có lỗi. Không thay ngày thiếu bằng ngày hiện tại hoặc ngày của trang chủ. Kiểm tra title, description, creator, publisher, identifier và ngày từ HTML thô, so với nội dung được duyệt. Thử URL có ký tự đặc biệt, URL cũ, 404, API lỗi, chuyển trang SPA và cả các bot đang dùng.
5. Chỉ sau khi được kiểm thử trên IIS staging: chép index-no-dc.html và thư mục __dc cùng bản frontend tương ứng; gộp rule `deployment/dublin-core-rewrite.fragment.xml` ngay trước fallback React, giữ mọi rule redirect, media và bot. Thay action của fallback thành index-no-dc.html; root tiếp tục phục vụ index.html. Phải kiểm tra quyền ghi, URL Rewrite và thứ tự rule thực tế. Không chép đè Web.config production.

Sau khi xuất bản hoặc sửa nội dung, cần tạo lại snapshot, đối chiếu manifest, xóa snapshot không còn hợp lệ khỏi bản phát hành và purge cache. Bản snapshot cũ có thể mô tả nội dung cũ cho máy đọc HTML; cơ chế này không phải SSR và không tự đồng bộ. Cần kế hoạch nguyên tử/rollback khi thay cả thư mục, và kiểm thử URL có/không dấu `/` cuối theo cấu hình thực tế. Các trang chưa có snapshot dùng fallback không có DC tĩnh, sau đó React tạo metadata khi JavaScript chạy.

Ngày trang chủ 2025-12-17 kế thừa từ cấu hình cũ và phải được đơn vị quản trị xác nhận. Dự thảo không có ngày tạo/đăng trong model hiện tại; thời gian lấy ý kiến không phải ngày ban hành. Cần bổ sung dữ liệu nguồn đáng tin cậy và quy trình biên tập để hoàn tất trường ngày bắt buộc.
