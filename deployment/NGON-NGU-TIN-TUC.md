# Triển khai định danh ngôn ngữ tin tức

## Phạm vi

Migration `db/migrations/20261109-TinTuc-NgonNgu.sql` thêm cột `dbo.TinTuc.NgonNgu` (`vi`, `en`, hoặc NULL) và chỉ khi tạo cột mới gán `vi` cho các bản ghi sẵn có. Đây là lựa chọn nghiệp vụ theo xác nhận hiện tại rằng dữ liệu cũ cơ bản là tiếng Việt; phải đối chiếu lại trước khi áp dụng cho một CSDL khác. Chạy lại không phân loại lại bản ghi đã tồn tại. Trước khi chạy, lưu bản sao lưu có thể khôi phục và thống kê trạng thái/khối lượng dữ liệu production.

Quản trị cho chọn ngôn ngữ, tin mới mặc định `vi`; API chi tiết chỉ trả tin công khai có ngôn ngữ khớp, các khối tin nổi bật được lọc theo ngôn ngữ và trạng thái xuất bản. Các tin NULL không được trả trong chi tiết. Danh sách, tìm kiếm và chuyên mục EN vẫn tạm khóa vì chưa xác định được chuyên mục tiếng Anh hoạt động trên production; không gán tạm chuyên mục tiếng Việt. Đây chưa phải tính năng ghép cặp bản dịch. Thông báo, văn bản và các loại dữ liệu ngoài bảng TinTuc chưa có trường ngôn ngữ mới.

## Thứ tự triển khai

1. Trên staging sao chép CSDL và các thành phần cùng phiên bản production; kiểm tra quyền và sao lưu/khôi phục.
2. Chạy migration bằng tài khoản quản trị CSDL; xác nhận cột, constraint, chỉ mục và thống kê `SELECT NgonNgu, COUNT(*) FROM dbo.TinTuc GROUP BY NgonNgu`. Chạy lại xác nhận không đổi các giá trị đã được phân loại.
3. Triển khai API, quản trị và frontend tương ứng, giữ cấu hình và dữ liệu upload hiện hữu. **Không triển khai API mới trước migration**: EDMX mới yêu cầu cột này.
4. Kiểm tra đăng nhập và tạo/sửa tin ở cả hai ngôn ngữ, trạng thái nháp/công khai, block tin nổi bật, truy cập trực tiếp link, API cũ/mới, tìm kiếm/chuyên mục tiếng Việt; xác nhận tin EN không hiện ở VI và ngược lại. Kiểm tra đồng thời ứng dụng khác dùng chung bảng và luồng duyệt/khôi phục lịch sử.
5. Chỉ áp dụng production sau khi staging đạt; sao lưu, chạy migration, cập nhật API/quản trị/frontend theo cùng thứ tự và xóa cache HTML/JS phù hợp. Metadata HTML thô do API `MetadataPage` đảm nhiệm (xem `METADATA-HTML-THU-NGHIEM.md`); cách snapshot HTML tĩnh cũ đã bị gỡ bỏ, không dùng.

Nếu rollback ứng dụng, khôi phục API, quản trị và portal cùng phiên bản cũ và **giữ cột mới** để tránh mất phân loại đã cập nhật; xác minh bản cũ có tương thích schema mở rộng. Chỉ cân nhắc xóa cột sau khi đã xuất/lưu dữ liệu ngôn ngữ, đánh giá các hệ thống dùng chung và có phương án khôi phục được duyệt. Theo dõi tình trạng tin không có ngôn ngữ và không tự gán lại `vi` khi migration chạy lại.
