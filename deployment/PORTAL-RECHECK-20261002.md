# Rà soát hiển thị portal local — 02/10/2026 (lượt tiếp theo)

- 65 URL đại diện từ menu/link, 130 lượt desktop và mobile. Không phải toàn bộ bài viết trong DB.
- Không ghi nhận response 502/5xx, lỗi JavaScript, tràn ngang hoặc timeout trong lượt quét này.
- Các đường dẫn hợp lệ không vào màn hình Không tìm thấy trang. `/khong-ton-tai` là ca kiểm tra 404 chủ động; SPA local trả HTML 200 và hiển thị màn hình 404/noindex.
- Kiểm tra các nhóm: trang chủ, giới thiệu, văn bản, tin tức, tìm kiếm, Hội/Quỹ, nghiên cứu khoa học, ảnh/video/audio, Bộ trưởng, Đảng bộ và các trang chi tiết khám phá từ link.

## Đã sửa trong lượt này

Build TypeScript/Vite sau sửa đạt. Kiểm tra lại 4 URL × 2 thiết bị, sau đó kiểm tra cuối thêm 2 đường dẫn Đảng bộ × 2 thiết bị: đều mở đúng Tin tức - sự kiện và hiện bài, không lỗi JavaScript/tràn ngang/404/502. Lượt trung gian có lỗi API tạm thời trên mobile; đã bổ sung một lần tự thử lại và xác nhận lại trên bản cuối.

- `/nghi-quyet-tw4/tin-tuc` trước lấy chuyên mục Gương điển hình tiên tiến. Nay chọn Tin tức - sự kiện từ menu cấu hình.
- `/nghi-quyet-tw4/chuyen-muc` trước tự mở Giới thiệu không có bài. Nay chọn cùng chuyên mục Tin tức - sự kiện.
- Chuyên mục Đảng bộ phân biệt đang tải, lỗi tải và danh sách rỗng; có Thử lại, không báo rỗng trước khi tải xong.
- Bộ quét chờ request API còn chạy trước khi ghi nhận nội dung, giảm đánh giá nhầm khi API chậm.

## Nội dung/dữ liệu còn cần xử lý

### Rà soát trạng thái tải ở các trang tương tự

- Sửa trạng thái tải/rỗng/lỗi cho danh sách tin tức và chuyên mục của portal, Bộ trưởng và Đảng bộ; theo dõi riêng request tin nổi bật và danh sách. Request cũ ở các trang tin không cập nhật trạng thái sau khi đổi trang/rời trang.
- Văn bản chỉ đạo và QPPL bắt đầu ở trạng thái đang tải. Văn bản, dự thảo và nghiên cứu khoa học phân biệt API lỗi với kết quả rỗng, có Thử lại.
- Tìm kiếm và gallery ảnh/video/audio đã có trạng thái pending/error riêng, không cần thay trong lượt này.
- `scripts/Test-SimilarLoading.cjs`: 9 đường dẫn đạt các trường hợp request đang chờ, kết quả rỗng hợp lệ, HTTP 503 và thử lại; response giả lập, không ghi DB. Build và hồi quy thao tác văn bản/tìm kiếm/metadata đạt.

- Dữ liệu và Phản ánh - kiến nghị vẫn là trang placeholder trong source.
- Menu giới thiệu Bộ trưởng đang dẫn tiểu sử Phạm Thị Thanh Trà năm 2023; cần người quản trị cập nhật nội dung/menu theo dữ liệu được phê duyệt. Không tự sửa dữ liệu DB trong lượt test.
- Một số file media không tải được từ máy chủ media. ERR_BLOCKED_BY_ORB chỉ là kết quả trình duyệt, không chứng minh mọi URL đều 404. Cần kiểm tra file và response thực tế trên host media; không tạo ảnh thay thế để che lỗi.
- Kết quả local không kiểm chứng IIS rewrite/WAF/502 trên production. Nội dung được đối chiếu với dữ liệu local, không xác minh tính cập nhật của mọi bài viết.

## Danh sách media lỗi quan sát

| URL | Kết quả |
|---|---|
| https://moha.gov.vn/Upload/114a2c9f-b01a-4b44-a07a-1797f9980a34picture-one.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/1e77e731-e017-4520-aa96-120c1d881e0316-07-20-17-09-2025-1709_0189kyket.jpg | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/3f7e62cc-cff5-401d-a561-7b805106a8e5logo-ban-thi-dua.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/49b4b66c-7bb4-4e2c-9beb-7444ea227038996229678102025164258Vietnam%20Nhatban%20thucdayhoptaclaodongvaphattriennguonnhanluc.mp4 | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/4c09f594-8761-49fa-add3-2559c447394fnothing.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/51e114c7-327f-460f-939e-a50570196656logo-vien-khoa-hoc.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/562e4b9c-2dc1-4d8e-98d1-68b8d5cf0e95picture-one.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/62504583-7ac2-4883-9e92-0265bf64635ea49e8852-11dc-4577-8b47-20a9a88d64faTh%E1%BB%A9%20tr%C6%B0%E1%BB%9Fng%20Th%C6%B0%E1%BB%9Dng%20tr%E1%BB%B1c%20BNV%20%C4%90%E1%BB%97%20Thanh%20B%C3%ACnh.jpg | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/81b812a2-d6d1-4860-8caa-fe52abf8d44d16-20-04-04-09-2025-06.z6975401707333_d8019be8fd11daaee323e7e02942853b.jpg | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/8b7379ce-bea1-414d-9a2b-a24bfcc7fe59logo-cuc-van-thu.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/8ea64f3e-4941-4bb5-92cd-d8ccef95c75216-20-04-04-09-2025-06.z6975401707333_d8019be8fd11daaee323e7e02942853b.jpg | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/8f3afdce-c80f-479a-99a9-f1bdee6b654221-06-46-30-09-2025-z705461189642801afe91760e094ed07a17f76471a5376-1758961005586218188451-1759219398164167569437.jpg | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/8f94cf0f-8a11-4733-a0dc-5be883b4adadnothing.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/9250abcc-558c-4389-b7c2-997c77fd03d1view-grid-list.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/93ddafa2-ff2e-4002-90a0-8f62ae52c5efplay-two.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/9d21938f-2ac2-485a-810a-99a4646b9ebflogo-tap-chi.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/a81e672e-f2b8-4e90-bc26-2f41137062ff09-13-34-30-09-2025-202509290843306002_z7060815493155_bcdf60f6cb22c76097c04fd24475746a.jpg | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/abf01646-c662-49bf-8d4d-1151b97931fcplay-two.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/b4645c2d-5449-4f96-b776-14c5cb75daa4selected.png | net::ERR_BLOCKED_BY_ORB |
| https://moha.gov.vn/Upload/de6fad4d-52ab-472f-8d59-01e4ffd96f17logo-ban-thi-dua.png | net::ERR_BLOCKED_BY_ORB |
