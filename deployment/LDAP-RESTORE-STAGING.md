# Khôi phục đăng nhập AD: bản ứng viên staging

Nguyên nhân đã xác nhận cho response `LDAP chưa được cấu hình xác thực an toàn`: API đã tắt nhánh LDAP vì phiên bản cũ không thực hiện bind kiểm tra mật khẩu với AD. Không khôi phục nhánh cũ hoặc tắt kiểm tra chứng chỉ. Response `Username hay mật khẩu không đúng!` của luồng đăng nhập mật khẩu là kết quả khác; chưa đủ dữ liệu để kết luận nguyên nhân.

## Điều kiện trước khi bật

- Nhận FQDN domain controller, cổng LDAPS, domain UPN từ quản trị AD. Không suy đoán `LdapHost` cũ trong repo là server production.
- Xác minh server API kết nối được LDAPS, chứng chỉ khớp FQDN và CA được Windows tin cậy. Không bỏ qua kiểm tra chứng chỉ.
- Mỗi người dùng cần có tên UPN trong `ADConfig`, tài khoản CMS tương ứng đang `active`, có role hợp lệ. Bản này không tự tạo tài khoản, tránh tự cấp quyền. Cần thống kê thiếu tài khoản/quyền bằng truy vấn chỉ đọc trước khi thử.
- Frontend cũ nối `@molisa.gov.vn` khi nhập tên ngắn; bản frontend mới có thể cấu hình `window.env.REACT_APP_LDAP_DOMAIN`, hoặc nhập UPN đầy đủ. Domain phải khớp `LdapDomain` tại API.

Sau khi backup và triển khai API, trên **staging** gộp các appSettings vào API Web.config, giữ nguyên toàn bộ config khác:

```xml
<add key="LdapEnabled" value="true" />
<add key="LdapHost" value="FQDN-DOMAIN-CONTROLLER" />
<add key="LdapPort" value="636" />
<add key="LdapDomain" value="DOMAIN-UPN" />
```

Không thêm key trùng: sửa `LdapHost` hiện có nếu có. `LdapEnabled` phải được bật rõ ràng; thiếu cấu hình sẽ từ chối đăng nhập AD. Không nhập mật khẩu AD vào file cấu hình. Kiểm tra cổng từ server bằng `Test-NetConnection FQDN-DOMAIN-CONTROLLER -Port 636`; cổng mở không đủ xác nhận chứng chỉ hoặc bind thành công.

Trên staging dùng tài khoản AD thử nghiệm: đúng mật khẩu thành công; sai mật khẩu, không có trong allowlist, bị vô hiệu, thiếu quyền, thiếu/sai OTP phải thất bại; kiểm tra cả tài khoản cũ và tài khoản CMS thông thường. Kiểm tra chứng chỉ sai hoặc DC không sẵn sàng không cho đăng nhập. Sau khi nghiệm thu mới đưa lên production. Không ghi mật khẩu, OTP, token hoặc response chứa dữ liệu nhạy cảm vào ticket/log.

Theo dõi Windows trace chỉ ghi mã lỗi LDAP số, không ghi thông tin đăng nhập. API Release bao gồm các thay đổi khác trong repo; so sánh với production và backup API/portal/DB, giữ Web.config, secrets và các file tùy biến. Đây chưa là bản được xác minh với AD production.
