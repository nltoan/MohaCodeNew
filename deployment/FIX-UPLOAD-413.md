# Sửa lỗi import production

Bản mới đã đổi admin sang UploadStart/UploadChunk/UploadComplete, mỗi request chứa tối đa 4 MiB. Triển khai API trước admin. Hướng dẫn tăng lên 81 MiB bên dưới chỉ dành cho luồng Preview upload nguyên file cũ. Luồng mới không cần cấu hình đó nếu server cho phép 4 MiB. Dữ liệu tạm nằm trong RAM cache API tối đa 30 phút, một phiên mỗi tài khoản; yêu cầu worker/affinity như DEPLOY-MOHA.md.

Ngày 01/10/2026: OPTIONS Preview trả 200 có CORS cho https://quantri-portal.moha.gov.vn; POST không token trả 401 có CORS. POST 31 MB không token trả 413 không có CORS. Giới hạn upload nằm trước bước xác thực/xử lý của API. Chưa xác định tầng trả 413 là IIS hay proxy/WAF.

1. Backup Web.config API. Gộp deployment/api-upload.config.fragment.xml vào configuration của API production (không thay toàn bộ Web.config). IIS Preview cho phép 84934656 byte; system.web/httpRuntime maxRequestLength >=82944 KB. Không thêm trùng location/system.webServer. Nếu section bị khóa, quản trị IIS áp dụng tại cấp cấu hình phù hợp.
2. Nếu phía trước có reverse proxy/WAF/load balancer, tăng giới hạn request body cho /api/HoiQuy/Preview lên ít nhất 81 MiB. Ví dụ Nginx: client_max_body_size 81m; trong location hiện đang proxy endpoint; kiểm tra cấu hình và reload theo quy trình server. Không thay location/proxy_pass hiện hữu chỉ để thêm dòng này.
3. Thử upload thật từ admin, kiểm tra status POST trong Network. Hết 413 rồi mới xử lý lỗi khác nếu có. OPTIONS hiện đã hoạt động, không thêm header CORS trùng vào IIS.
4. Manifest admin đã sửa sizes đúng với ảnh hiện có 750x140. Chép admin-candidate/manifest.json để hết cảnh báo icon; không liên quan lỗi import. AdminUrl đã chốt https://quantri-portal.moha.gov.vn trong production.json.

Việc đổi giới hạn upload và manifest không cần migration DB. Chức năng Hội/Quỹ lần đầu vẫn cần migration 20261001-HoiQuy.sql.
