# Thông tin Tefli và các việc cần chốt cho hồ sơ

## Thông tin đã được người dùng cung cấp

| Trường | Giá trị |
|---|---|
| Tên doanh nghiệp | Công ty cổ phần công nghệ Tefli Việt Nam |
| Mã số thuế | 0108252059 |
| Địa chỉ liên hệ | Tầng 2, tòa nhà CCB Office, số 2 ngõ 18, đường Nguyễn Cơ Thạch, phường Từ Liêm, thành phố Hà Nội |
| Email | tefli.vn@gmail.com |
| Điện thoại | 024 3512 0898 |
| Hotline | 097 369 8866 |

Thông tin trên được dùng theo lời cung cấp của người dùng; địa chỉ liên hệ chưa được coi là địa chỉ đăng ký doanh nghiệp. Số hotline doanh nghiệp chưa tự động trở thành đầu mối bảo hành có cam kết 24/7.

## Đầu vào cần Tefli bổ sung

| Ưu tiên | Đầu vào | Dùng ở đâu |
|---|---|---|
| P0 | Đăng ký doanh nghiệp; người ký, chức vụ, căn cứ đại diện hoặc ủy quyền | Đơn và hồ sơ hợp lệ |
| P0 | Tham dự độc lập hay liên danh; tư cách nhà sản xuất phần mềm hay không; nhà thầu phụ nếu có | Chọn biểu mẫu và bảng đánh giá đúng |
| P0 | Thông báo mời/phát hành HSYC, hạn đóng thầu, các bản sửa đổi/làm rõ nếu có | Hiệu lực hồ sơ, phiên bản yêu cầu, kỳ tài chính |
| P0 | BCTC 03 năm áp dụng, chứng từ thuế, hợp đồng tương tự và nghiệm thu/giá trị thực hiện | Chứng minh năng lực và kinh nghiệm |
| P0 | Giá từng hạng mục/dịch vụ, thuế, giảm giá nếu có, xác nhận phê duyệt giá | Mẫu 4.1A và đơn dự thầu |
| P1 | Danh sách nhân sự thực, vai trò, thời gian sẵn sàng, người duyệt kỹ thuật | Phương án 30 ngày và tổ chức thực hiện |
| P1 | Đầu mối hỗ trợ được phân công, năng lực bảo hành, lựa chọn bảo đảm bảo hành | Cam kết dịch vụ và điều kiện hợp đồng |
| P1 | Bản build/commit dùng làm căn cứ, tài liệu và kết quả kiểm thử đã có | Chốt bằng chứng kỹ thuật, tránh dùng working tree thay đổi |

## Các nội dung cần làm rõ với Chủ đầu tư

Đây là danh sách soạn sẵn để Tefli xem xét; chưa gửi cho bất kỳ bên nào.

1. Xác nhận tiến độ áp dụng khi Chương I ghi 02 tháng [B0047] nhưng Chương II và IV quy định 30 ngày [B0295.R016–R017; B0660]. Phương án đang lập theo 30 ngày.
2. Xác nhận cấu phần SharePoint tiếp tục vận hành, phạm vi CMS cần kế thừa, quyền truy cập và cơ chế kết nối giữa SharePoint, lớp React, API và dữ liệu [B0722–B0730].
3. Chốt đầu mối, tài liệu giao tiếp, môi trường kiểm thử và quyền kết nối AD/SSO, LGSP, EMC, hệ thống tiếp nhận kiến nghị và các hệ thống nghiệp vụ liên quan [B0713].
4. Chốt số lượng/dung lượng nguồn chuyển đổi, tệp đính kèm, URL cần bảo toàn, dữ liệu lỗi, cửa sổ chuyển đổi và cách đối soát [B0738.R013–R018].
5. Chốt hạ tầng DC/DR, tài nguyên, tài khoản, cách kiểm thử tải và diễn tập phục hồi; không suy ra khả năng thực tế chỉ từ thông số hạ tầng trong HSYC [B0703–B0710; Chương IV; B0962.R021].

## Cách theo dõi việc còn thiếu

Mỗi việc cần có người phụ trách, ngày dự kiến nhận đầu vào, tài liệu chứng minh và trạng thái: chưa có, đã nhận, cần bổ sung hoặc đã xác minh. Thiếu thông tin doanh nghiệp không ngăn việc soạn thuyết minh kỹ thuật, nhưng phải hoàn tất trước khi ký và nộp hồ sơ. Các phần chưa có bằng chứng triển khai phải được ghi nhận trong kế hoạch phát triển và kiểm chứng trước khi Tefli chấp thuận cam kết.
