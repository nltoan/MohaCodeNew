# Kiểm tra bảo mật local — 02/10/2026

Phạm vi: mã nguồn portal, admin, API và các dịch vụ local. Chưa deploy, chưa pentest production/WAF. Đây là kết quả kiểm tra có giới hạn, không phải chứng nhận hệ thống an toàn hoàn toàn.

## Các vấn đề đã sửa

- API mặc định yêu cầu tài khoản đang hoạt động. Các API tài khoản, quyền, cấu hình, backup và menu yêu cầu quyền quản trị tương ứng. Loại thông tin mật khỏi JSON trả về, kể cả entity tài khoản lồng nhau.
- Hồ sơ chỉ được sửa theo tài khoản trong token. Đổi mật khẩu yêu cầu mật khẩu hiện tại; mật khẩu mới/reset dùng PBKDF2-SHA256, salt ngẫu nhiên, 600.000 vòng. Đăng nhập mật khẩu cũ thành công sẽ chuyển sang hash.
- CORS chỉ chấp nhận origin cấu hình; che thông tin lỗi nội bộ. Chặn đăng nhập LDAP khi chưa có bind xác thực, vô hiệu hóa API Proxy/SendMail public cũ.
- Kiểm tra tên, phần mở rộng và giới hạn upload; chặn đường dẫn backup ra ngoài thư mục cho phép. Thư mục Upload có cấu hình IIS static-only và chặn file thực thi/backup.
- Lọc HTML bằng DOMPurify tại các vị trí render HTML của portal và phần so sánh/duyệt nội dung admin. Mã đăng nhập admin encode đúng form, không lưu token khi đăng nhập thất bại.
- Cập nhật dependency trong phạm vi tương thích; sửa cây AJV để admin build được và cập nhật devextreme-cli để bỏ dependency critical cũ.

## Bằng chứng kiểm tra

- `scripts/Test-SecurityApi.cjs`: 108 route quản trị trả 401 khi không đăng nhập; token sai, tài khoản thiếu quyền, profile IDOR, trường thông tin mật, CORS, LDAP fail-closed, upload nguy hiểm, Excel DTD/XXE và XML quá lớn, mật khẩu hiện tại, rate limit và lỗi không lộ stack trace. Không commit import hoặc gửi mail.
- `scripts/Test-SecurityPortal.cjs`: payload XSS giả lập trên tin tức, chuyên trang Bộ trưởng, Nghị quyết TW4 và tìm kiếm; giữ text, loại script/event handler/javascript URL. Không ghi payload vào DB.
- `scripts/Test-SecurityUploadHosting.cjs`: IIS local phục vụ PNG (200), chặn ASPX/BAK/web.config (404); file kiểm tra được dọn sau test.
- `scripts/Test-SecurityAdmin.cjs`: màn hình so sánh nội dung admin sau đăng nhập hiển thị text và chặn XSS; nội dung giả lập, không ghi DB.
- Build cuối API, portal và admin đạt; admin còn warning lint/deprecation cũ. Test hồi quy portal đạt cho giới thiệu/văn bản, tìm kiếm, mobile, 404, metadata SPA, media URL, tải trì hoãn trang chủ và public cache.
- NuGet: đối chiếu 51 package với feed vulnerability chính thức, không có phiên bản khớp advisory tại thời điểm kiểm tra. Không bao gồm OS, IIS, CDN và lỗi chưa có advisory.
- Audit dependency sau cập nhật: portal 1 high, 0 critical; admin 11 low, 10 moderate, 18 high, 0 critical. Các con số là cảnh báo dependency, không đồng nghĩa mọi cảnh báo đều khai thác được từ production.

## Cần xử lý trước khi kết luận sẵn sàng production

1. Rà soát ma trận quyền và sở hữu đối tượng của các API nội dung cũ: biên tập, duyệt, xuất bản và thao tác theo ID. Chặn anonymous không thay thế phân quyền chi tiết cho người đã đăng nhập.
2. Chuyển SunEditor 2 sang phiên bản được vá hoặc editor khác với test tương thích. Admin còn advisory trong CRA/build tooling và cần kế hoạch nâng cấp; không chạy `audit fix --force` mù quáng.
3. Chuyển/reset các mật khẩu legacy chưa đăng nhập; kiểm tra ứng dụng khác dùng chung bảng tài khoản và gói rollback. Rà soát, xoay vòng secret từng được lưu trong source nếu đã lộ.
4. Thiết kế thu hồi token sau đổi mật khẩu; cân nhắc session HttpOnly. Rate limit hiện trong bộ nhớ từng instance, production cần giới hạn phân tán/WAF.
5. Upload cần thêm kiểm tra signature/MIME, antivirus theo yêu cầu vận hành và test thực tế chức năng upload/chunk/rename trên staging. Bảo vệ UploadTemp, backup và mọi host phục vụ media.
6. Kiểm tra CSP thực tế, HTTPS sau reverse proxy, CORS production, các role hiện có, LDAP và tích hợp ngoài repo trên staging. Không thay toàn bộ Web.config production.

Không cần schema migration cho hash mật khẩu vì cột hiện tại đủ chiều dài. Tuy nhiên API và admin phải deploy cùng nhau; dữ liệu mật khẩu đã hash không tương thích API đăng nhập cũ. Xem [hướng dẫn hardening](SECURITY-HARDENING.md).

Tham chiếu: [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html), [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [NuGet vulnerability feed](https://learn.microsoft.com/en-us/nuget/api/vulnerability-info).
