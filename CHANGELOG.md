# Nhật ký thay đổi

Ghi chú theo từng đợt, chuyển từ DEV-SETUP.md. Hướng dẫn cài đặt và chạy nằm ở DEV-SETUP.md.

## Admin 25/11: ảnh chèn vào nội dung không hiện (sau khi tách media theo người tạo)

- Nguyên nhân: sau commit `cf28603`, ảnh tải lên qua tab "Tải lên" của CKEditor có URL `https://api-portal.moha.gov.vn/Upload/...`. CSP admin trên production không có `img-src`; `default-src` chỉ cho `'self'` và `https://moha.gov.vn`, nên trình duyệt chặn ảnh. Kết quả là khung ảnh trắng, và chiều rộng/cao không tự điền. Xem trước trong "Quản lý file" cũng bị chặn vì cùng lý do.
- `FileManager/CKEditorImageUpload` trả đường dẫn `/Upload/...` (JSON tạo bằng `JsonConvert`, không nối chuỗi). Admin đổi đường dẫn này sang host media (`REACT_APP_UPLOAD_URL`).
- Hàm `mediaUrl` (`backend/src/utils/upload.js`) dùng chung cho "Duyệt máy chủ" (FilePicker), xem trước trong thư viện và ảnh tải lên, dán hoặc kéo thả vào CKEditor.
- Khi mở trình soạn thảo, các URL `https://api-portal…/Upload/` có sẵn trong nội dung được đổi sang host media.
- Đã kiểm tra trên production: `/Upload/...` trả ảnh trên cả `moha.gov.vn`, `api-portal` và `quantri-portal`.

## Rà soát lại đợt sửa admin 24–25/11

- **Bảo mật, thư viện file:** chặn `BackUp`/`Thumb` (25/11) chỉ xét đoạn đầu đường dẫn do client gửi, nên `a/../BackUp`, `./BackUp`, `BackUp.` lọt qua, tải được bản sao lưu CSDL. `GuardedFileSystemProvider` nay kiểm tra trên đường dẫn thật (`GetFullPath` từ gốc `~/Upload`), từ chối đoạn `.`/`..`/kết thúc bằng dấu chấm hoặc khoảng trắng, không cho thao tác trên chính thư mục gốc (Copy gốc từng chép cả `BackUp` ra ngoài). `FileFromLibrary` kiểm tra tương tự và trả 400 thay vì 500 khi đường dẫn có `:`.
- Tin tức, quy trình: "Trả về" ở bước ≥ 3 nay về bước liền trước (trước đây luôn về bước 1, `GetBuocQuyTrinh` sắp tăng dần cho cả `prev`). Cột "Người xử lý" hiện tên đăng ký thay vì tên đăng nhập, bỏ tài khoản đã xóa.
- Tin tức, nháp cục bộ: gắn với tài khoản (`tintuc-draft:<UserID>:<ID>`), người khác trên cùng máy không thấy; tự bỏ nháp quá 7 ngày và nháp kiểu cũ; cảnh báo khi bản trên hệ thống đã bị sửa sau lúc lưu nháp.
- Xuất CSV: ô bắt đầu bằng `= + - @` (trừ số âm) được thêm `'` để Excel không chạy công thức (họ tên/nội dung góp ý do người dân nhập).
- Popup "Chi tiết góp ý" luôn có phần tử con (trước đây có thể mở ra trống). Cửa sổ chọn file của CKEditor: nút "Chọn" hiện khi đã chọn file (`FileSelectionItem`). Hồ sơ: bỏ tích rồi tích lại 2FA không còn báo lỗi giả.
- SharePoint: chế độ `Windows` không đặt `SharePointUser` thì dùng danh tính app pool. Còn mở: file của văn bản bị gỡ công bố vẫn nằm trong `Upload/SharePoint/` (tải được nếu biết URL).

## Portal 25/11: tiêu đề khối trang Nghị quyết TW4 theo tên chuyên mục

- Trang chủ `/nghi-quyet-tw4`: tiêu đề 6 khối (Tin tức - Sự kiện, Báo cáo, Bảo vệ nền tảng tư tưởng, Văn bản chỉ đạo, khối chuyên mục 389, Tư liệu hình ảnh) lấy tên chuyên mục trong CSDL (`ChuyenMucDetail`), trước đây lấy chuỗi dịch cố định `nghiquyettw4.home_page.*` trong cấu hình `i18nVietnamese` nên đổi tên chuyên mục ở admin (ví dụ "Đại hội thi đua yêu nước" thành "Dân vận khéo") không có tác dụng. Chuỗi dịch chỉ còn dùng khi không lấy được tên. API gửi `Cache-Control: max-age=300`, nên tên mới có thể chậm tới 5 phút.

## Giao diện admin 25/11: hoàn thiện (nhóm 3)

- Bỏ nút "Remove" (X) của khung AdminLTE ở 87 trang (bấm vào làm biến mất cả bảng); tooltip nút thu gọn tiếng Việt. Ô tìm kiếm không còn `highlightCaseSensitive` (tô sáng không phân biệt hoa thường).
- Menu và tiêu đề trang: bỏ tiền tố "QL"/"DS", viết đầy đủ ("Văn bản quy phạm pháp luật", "Sao lưu dữ liệu", "Vai trò và phân quyền"...); "Trang tổng quan" lên đầu menu. 8 file admin (Aside.js, CauHinh.js, TinTuc.js...) có chữ tiếng Việt dạng Unicode tổ hợp (NFD) làm ô "Tìm chức năng" không khớp với chữ người dùng gõ; đã chuyển về NFC.
- Danh mục lĩnh vực, hình thức, lớp văn bản, cơ quan ban hành sắp theo "Số thứ tự" (cột ID trước đây được ưu tiên).
- Trang tổng quan: trạng thái đang tải, báo lỗi kèm "Thử lại", ô số liệu bấm được để mở danh sách, nhãn đầy đủ, bài trên cổng mở tab mới.
- Đường dẫn không tồn tại hiện trang "Không tìm thấy trang" thay vì âm thầm về trang chủ. Tài khoản đang phải đổi mật khẩu mặc định (`setup_required`) chỉ vào được trang Hồ sơ, menu chỉ còn mục đó.
- Hồ sơ: mã QR, khóa thiết lập và hướng dẫn 3 bước chỉ hiện khi vừa bật 2FA; đã bật sẵn thì hiện dòng xác nhận (trước đây là ảnh vỡ); ô "Mã xác nhận" chỉ hiện khi bật/tắt 2FA.
- Vai trò: cột "Quyền được cấp" liệt kê tên quyền, chọn quyền có hiệu lực ngay, có "Chọn tất cả", vai trò hệ thống có biểu tượng khóa.
- Thư viện file: xem trước ảnh, video, âm thanh, PDF (`components/FilePreview.js`); bỏ popup "Chọn kích cỡ ảnh" không dùng; "Sao chép đường dẫn" có dự phòng khi trình duyệt chặn clipboard. Thư mục `BackUp` và `Thumb` bị ẩn và chặn mọi thao tác (`GuardedFileSystemProvider` trong `FileManagerController`).
- Cửa sổ chọn file của CKEditor: nút "Chọn", chỉ hiện ảnh khi chèn ảnh, không cho xóa/di chuyển/đổi tên.
- Tiếng Việt cho FileManager, HtmlEditor, phân trang... mà gói `vi.json` của DevExtreme 22.2 còn bỏ sót (`utils/viMessagesExtra.js`).
- Lãnh đạo phụ trách đơn vị (`DonVi_LanhDao`): chọn lãnh đạo/đơn vị theo tên thay vì gõ ID, nhãn tiếng Việt. Cấu hình hệ thống: không sửa được ID.
- Lưu ý khi dùng `Popup` của devextreme-react: phải có phần tử con ngay lần render đầu (không để `{cond && ...}` là con duy nhất), nếu không nội dung không bao giờ hiện.

## Giao diện admin 24/11: lỗi dữ liệu và bất tiện thường gặp

Sửa sau đợt rà soát giao diện admin (nhóm 1: lỗi làm sai dữ liệu hoặc chặn thao tác; nhóm 2: bất tiện lớn).

- Văn bản: thêm "Văn bản liên quan"/"Văn bản bị tác động" trước đây ghi `VanBanID` rỗng (`rowDataRef.current.id` thay vì `.ID`); nay gắn đúng văn bản và chặn khi chưa lưu. Trên production nên kiểm tra dữ liệu cũ bằng câu chỉ đọc: `SELECT COUNT(*) FROM VanBan_LienQuan x WHERE NOT EXISTS (SELECT 1 FROM VanBan v WHERE v.ID = x.VanBanID)` (tương tự với `VanBan_BiTacDong`). Văn bản/dự thảo mới mặc định Tiếng Việt nên các ô Lĩnh vực, Cơ quan ban hành, Loại văn bản có dữ liệu. Hiện cột Loại văn bản, Cơ quan ban hành (lọc theo cơ quan qua tham số `CoQuanBanHanhID` của `VanBans/Get`), nút chọn cột; ô chọn văn bản liên quan hiện số ký hiệu – trích yếu – ngày.
- Dự thảo: kiểm tra ngày hết hạn ≥ ngày bắt đầu, cột "Tình trạng lấy ý kiến". Góp ý dự thảo: bỏ Thêm/Sửa (vốn chỉ đọc), có "Xem chi tiết". Phản ánh kiến nghị: cột "Đã trả lời" (API trả `DaTraLoi`), câu chưa trả lời lên đầu, popup toàn màn hình, thông tin người gửi chỉ đọc.
- Xuất Excel (CSV UTF-8, `backend/src/utils/exportCsv.js`, không thêm thư viện): văn bản, góp ý dự thảo, phản ánh kiến nghị.
- Tin tức: hỏi trước khi đóng form có thay đổi chưa lưu (X, Esc, Hủy) và khi đóng tab; nháp cục bộ mỗi 30 giây; nút "Lưu và tiếp tục", "Lưu và gửi duyệt"; cột "Bước hiện tại / Người xử lý" (API `TinTucs/Get`), trạng thái có màu; thao tác quy trình gom vào nút "Thao tác"; popup duyệt bắt buộc lý do khi trả về, có "Xem toàn văn"; hộp xác nhận xuất bản/gỡ nêu tên tin; ô "Tin liên quan" phân trang phía máy chủ.
- Tài khoản: nhập được tên đăng nhập khi tạo mới (API chặn tên trùng hoặc rỗng, `User_AccountController.CheckLoginName`); "Trạng thái" là danh sách Kích hoạt/Đã khóa/Chưa kích hoạt thay cho checkbox.
- Cơ cấu tổ chức: không còn tạo đơn vị con không tên; sửa được "Chức năng nhiệm vụ". Cấu hình bố cục: báo lỗi khi lưu thất bại, hỏi trước khi bỏ thay đổi, khối mới kéo vào cấu hình được. Sao lưu: khóa nút khi đang chạy, hỏi xác nhận.
- Phiên đăng nhập: hết hạn hoặc bị thu hồi thì về `/Login?url=…` và quay lại đúng trang sau khi đăng nhập (chỉ nhận đường dẫn nội bộ); cảnh báo 5 phút trước khi hết hạn (`SessionWatcher`). Hồ sơ: chỉ đăng xuất khi đổi mật khẩu hoặc bật/tắt 2FA. Màn đăng nhập tiếng Việt (test dùng nút "Đăng nhập").
- Menu: tô sáng trang đang mở, tự mở nhóm chứa nó, tự đóng trên màn hình hẹp; tiêu đề trang, breadcrumb và `document.title` theo route.
- Media: lỗi tải lên (kể cả 401) báo tiếng Việt; báo trước định dạng và dung lượng; ảnh xem trước chỉ đổi khi tải xong; chặn Lưu khi còn file đang tải; "Chọn từ thư viện" (`MediaLibraryPicker`); danh sách file album lấy đường dẫn từ API (`FileLinkLuuTru`), không gọi từng dòng.
- Tab đính kèm của bản ghi mới (văn bản, tin, album, thông báo) hiện kèm hướng dẫn "lưu trước", sau lần lưu đầu tự chuyển sang tab đó.
- "Chọn từ thư viện" dùng được cho mọi ảnh trong thư viện: API mới `FileManager/FileFromLibrary?path=/Upload/...` (POST, cùng quyền với upload) trả về dòng `Files` sẵn có hoặc tạo dòng mới; chỉ nhận file có thật trong `~/Upload` (không nhận `Thumb/`, `..`, đuôi ngoài danh sách cho phép), không ghi hay chép file. Đường dẫn đi qua query string vì `MediaUploadValidation` đọc `Request.Form`.
- Lỗi JS "Cannot read properties of undefined (reading 'document')" của CKEditor khi đóng/mở lại form tin: DevExtreme vẽ lại popup làm iframe của editor nạp lại sau khi editor đã bị hủy. Vá một điều kiện trong `backend/public/ckeditor/ckeditor.js` (wysiwygarea `onDomReady`: bỏ qua khi cửa sổ iframe không còn; tìm `a&&a.document`). Nếu thay file CKEditor bằng bản khác thì phải vá lại. `CKEditorWrapper` chỉ tạo editor khi khung đã gắn vào trang, và thoát chế độ toàn màn hình trả khung về đúng kích thước cũ (trước đây bị co lại).
- Tiêu đề popup tải ảnh/video của trình soạn thảo HTML bằng tiếng Việt.
- API dev chạy từ bản sao `.dev\api`; `Dev.ps1 -Action Start` chỉ chép `api\bin` khi API chưa chạy. Sau khi build lại API trong lúc dev đang chạy, chép `api\bin` sang `.dev\api\bin` (hoặc Stop/Start) trước khi chạy test API.

## Rà soát bảo mật 23/11: biểu mẫu góp ý, đăng nhập, CSP admin

- Góp ý dự thảo (`Public/SendCommentVBDT`): kiểm tra đầu vào trước reCAPTCHA (ID số, bắt buộc họ tên và nội dung, độ dài theo cột DB, email). Đầu vào sai trả 400 tiếng Việt thay vì 500. `ReCaptchaValidator` có timeout 10 giây; khi không gọi được Google, API trả 503 "Không kiểm tra được mã xác thực…". Portal hiện thông báo của máy chủ.
- Thu hồi token: token có claim `pwd_stamp` lấy từ hash mật khẩu. Khi đổi mật khẩu (người dùng hoặc admin), khoá hay xoá tài khoản, token cũ bị trả 401 `token_revoked`. Trên máy đã thực hiện thay đổi, token bị từ chối ngay; các máy khác chậm tối đa 20 giây vì cache. **Sau khi triển khai, mọi người dùng admin phải đăng nhập lại một lần** (token cũ không có claim này).
- 2FA: sai lệch đồng hồ cho phép giảm từ 5 phút xuống 60 giây; mỗi mã chỉ dùng một lần (`api/Services/TwoFactorCode.cs`).
- Khoá theo tài khoản: sai 30 lần trong 15 phút thì khoá đến hết cửa sổ 15 phút, bất kể IP; tên đăng nhập được chuẩn hoá (khoảng trắng cuối) trước khi đếm. Giới hạn cũ 10 lần/phút theo tài khoản + IP vẫn giữ.
- Admin có CSP và các header bảo mật trong `backend/public/web.config` (`script-src 'self'`, không `unsafe-eval`). `window.env` chuyển sang `backend/public/runtime-config.js`. `ckeditor-csp.js` chuyển handler inline của CKEditor 4 thành listener (tiền tố ngẫu nhiên mỗi trang; cả hai sanitizer bỏ thuộc tính `data-cke-csp*`). Mẫu biểu đồ (plugin chart) dùng hàm thay vì chuỗi. Biểu tượng và video trống của Plyr tự host. Ngoài ra sửa lỗi xem trước video trong popup trước đây không có điều khiển.
- Runbook: cập nhật `runtime-config.js` và thứ tự chép file admin; nhiều máy API phải dùng chung `<machineKey>`.
- Test mới: `scripts/Test-AdminCsp.cjs`, `scripts/Test-AuthHardening.cjs` (dùng tài khoản tạm `__codex_tmp_*`, chỉ xoá mềm; tuỳ chọn `--full-lockout` chạy khoảng 3 phút).

## Chú thích ảnh trong bài và ô nhập tin tức (góp ý 17/11)

- Portal: ảnh chèn bằng plugin `image2` của CKEditor (`<figure><img><figcaption>`) có chú thích dài làm khung xám rộng hơn ảnh, ảnh lệch trái, chú thích không xuống dòng. `frontend/stylenoivufromSP.css` cho `figcaption` không góp vào bề rộng của `figure` (`width: 0; min-width: 100%`), nên khung ôm theo ảnh và chú thích tự xuống dòng.
- Admin, Tin tức: ô Sapo (`MoTa`) cao 150px thay vì 300px; ô Nội dung (CKEditor) cao 500px thay vì 200px, kéo góc dưới để giãn thêm theo chiều dọc.

## Đồng bộ văn bản từ SharePoint (bản thử, chưa kiểm tra trên farm thật)

- `api/Services/SharePoint/` (`SharePointClient`, `SharePointVanBanSync`) và `SharePointSyncController` (`api/SharePointSync/Status`, `Run`, quyền `manage-vanban`): đọc thư viện `VanBan` qua REST, ghi một chiều vào `VanBan`/`Files` (khoá `Migrate_Source = sharepoint:<UniqueId>`), chỉ mục `TrangThai = Published`; mục bị gỡ công bố thì ẩn, không xoá. Portal vẫn đọc từ SQL nên không phụ thuộc SharePoint lúc chạy. Tắt khi `SharePointSiteUrl` để trống. Cột ngày (SharePoint trả theo UTC) được đổi sang giờ Việt Nam trước khi lấy ngày, nếu không ngày ban hành lùi một ngày; dữ liệu mẫu của giả lập trả ngày theo đúng kiểu này.
- `scripts/sharepoint-mock/`: SharePoint giả lập để thử trên máy dev, kèm hướng dẫn (README.md). Đã thử với giả lập: tạo, cập nhật, ẩn, đồng bộ lại không trùng, SharePoint tắt thì API trả 502 và portal vẫn hiện dữ liệu cũ.

## Máy chủ API production không gọi ra ngoài được (nguyên nhân thật của danh sách trống và ảnh không thu nhỏ)

Chẩn đoán trên máy chủ production: `Invoke-WebRequest https://phananh.moha.gov.vn/Integrated/getList` báo "Unable to connect to the remote server", và `curl` tới chính `api-portal.moha.gov.vn` báo `CRYPT_E_REVOCATION_OFFLINE` (không tới được máy chủ thu hồi chứng chỉ). Tức là máy chủ không có đường ra internet/mạng ngoài; tăng timeout hay thử lại đều vô ích. Đã xử lý ở phía mã, không cần mở mạng:
- Ảnh: `ImageSourceRoot` (appSetting, đường dẫn thư mục gốc site portal chứa `Upload\` và `Media_Share\`, ví dụ `C:\inetpub\moha`) cho API đọc ảnh trực tiếp từ ổ đĩa rồi thu nhỏ, không gọi HTTP. Nếu không đặt hoặc không có file thì mới thử `ImageSourceBaseUrl`. Đường dẫn vẫn bị khóa trong `Upload\` và `Media_Share\` của thư mục đó.
- Phản ánh kiến nghị: API lưu bản chụp `App_Data/external/getPAKN.json` và `getKNCT.json` (ghi mỗi khi gọi được, chỉ nhận mảng JSON hợp lệ) và đọc lại khi không gọi được hệ thống ngoài, trả header `X-Upstream-Source: snapshot`. Khi máy chủ API không gọi ra được hẳn, chạy `scripts/Sync-PhanAnhKienNghi.ps1 -TargetDir <...\App_Data\external>` định kỳ (Task Scheduler, 5-10 phút) từ một máy gọi được hệ thống ngoài; API tự dùng file mới trong vòng khoảng một phút. Không có bản chụp và không gọi được thì trả 503 kèm header `X-Upstream-Error` nêu lý do.

## Sửa danh sách Phản ánh kiến nghị trống ở trang chủ

Hai danh sách "Trả lời phản ánh kiến nghị" và "Trả lời kiến nghị của cử tri" trống trên production: `api/Public/getPAKN` và `getKNCT` gọi `phananh.moha.gov.vn` với timeout 4 giây (đặt trong đợt tối ưu hiệu năng), trong khi từ máy chủ production hệ thống này mất khoảng 5 giây; mọi lần đều quá hạn và trả 503 sau đúng ~4 giây, chưa có bản cache nào để phục vụ. Nay timeout 15 giây (dưới timeout 20 giây của portal), nhiều yêu cầu cùng lúc dùng chung một lần gọi, API tự nạp trước hai danh sách khi khởi động, và portal tải song song hai danh sách và thử lại một lần. Bản cache cũ (tối đa 24 giờ) vẫn được phục vụ khi hệ thống ngoài lỗi. Sau khi triển khai, kiểm tra `https://api-portal.moha.gov.vn/api/Public/getPAKN` trả 200.

## Tối ưu ảnh portal (thu nhỏ theo bề rộng)

Ảnh trong `Upload/` và `Media_Share/` (jpg/png) không còn tải bản gốc nhiều MB. Portal gọi `GET api/Public/Img?src=/Upload/abc.jpg&w=640`; API thu nhỏ theo bề rộng (chỉ các mốc 160/240/320/480/640/800/1024/1280/1600/1920, làm tròn lên), giữ PNG trong suốt, xoay theo EXIF, lưu cache ở `App_Data/img-cache` và trả `Cache-Control` 30 ngày kèm ETag/304. Ví dụ ảnh thật 148 KB còn 33 KB ở 480px. `getUrlImage(url, width)` mặc định 800px; banner dùng 1920, ảnh chính tin 1280, `width = 0` lấy ảnh gốc (og:image). Ảnh trong nội dung bài viết thu nhỏ 1280px và tải lười. (Bản đầu dùng 640/1600/1024; các số ở đây là giá trị hiện hành trong `frontend/src/utils/image.ts` và `api/Services/ImageOptimizer.cs`.)

Chất lượng: JPEG 88, mặc định 800px (banner 1920, ảnh chính tin 1280). Nếu ảnh gốc chỉ lớn hơn bề rộng yêu cầu dưới ~11% thì giữ nguyên ảnh gốc, không thu nhỏ lại để khỏi làm mờ chữ trong ảnh thông báo/infographic. Cache có tiền tố phiên bản (`v3_`); đổi chất lượng thì tăng phiên bản để cache cũ không còn dùng.

Ép nhỏ khi admin tải lên (`FileImageUpload`, `ImageUpload`, `FileUpload`, `CKEditorImageUpload`): jpg/png có cạnh dài trên 2560px được thu về 2560px (JPEG chất lượng 90, PNG giữ nền trong suốt); JPEG đã vừa khung nhưng nặng trên 1 MB được mã hóa lại và chỉ nhận nếu nhẹ hơn ít nhất 20%. Ghi đè tại chỗ, tên và đuôi file không đổi nên liên kết trong CSDL không đổi; chỉ ghi khi kết quả nhỏ hơn bản gốc, lỗi thì giữ file gốc. Ảnh chụp từ điện thoại được xoay đúng theo EXIF và bị bỏ EXIF (gồm vị trí GPS). Ảnh nhỏ, gif, webp không bị đụng tới. Ảnh đã có trong kho không bị xử lý lại; phần hiển thị trên portal vẫn được thu nhỏ qua `api/Public/Img`. `FileImageUpload`/`ImageUpload` với `Width`+`Height` vẫn thu nhỏ đúng kích thước yêu cầu, nay mã hóa JPEG chất lượng 90 thay vì mặc định 75.

Xử lý hàng loạt ảnh cũ: `scripts/Optimize-UploadImages.ps1 -UploadPath <thư mục Upload>`. Mặc định chỉ chạy thử (đọc ảnh, báo dung lượng tiết kiệm, ghi CSV, không ghi gì). Với `-Apply -BackupPath <thư mục ngoài web root>` thì sao lưu bản gốc (giữ cấu trúc thư mục, kiểm tra dung lượng bản sao) rồi ghi đè qua file tạm + `File.Replace`, giữ nguyên ngày sửa. Dùng đúng quy tắc của lúc tải lên (gọi `UploadImageOptimizer.Compute` trong `API.dll`, nạp từ bytes nên không khóa DLL đang chạy; truyền `-ApiDll` trỏ tới `api-update\bin\API.dll` trên server). Chỉ xử lý jpg/png từ 300 KB (`-MinFileKB`) và chỉ ghi khi tiết kiệm ít nhất 50 KB (`-MinSavingKB`); bỏ qua `Thumb/`, `BackUp/` và ảnh sửa trong 10 phút gần đây; `-Limit` để làm từng đợt; chạy lại không xử lý lại ảnh đã ép. `-BackupPath` nằm trong kho Upload bị từ chối. Ảnh hiển thị trên portal vẫn qua `api/Public/Img` nên không cần xóa cache sau khi chạy.

CSP: ảnh thu nhỏ được tải từ origin của API (https://api-portal.moha.gov.vn), mà CSP của trang moha.gov.vn chỉ cho ảnh từ 'self', dantri, google, qrserver và data: (không có img-src, ảnh dùng default-src), nên bản đầu tiên bị trình duyệt chặn toàn bộ. Cần thêm `https://api-portal.moha.gov.vn` vào default-src (hoặc img-src nếu có) của header CSP trên server; đã cập nhật `deployment/api-metadata-csp.fragment.xml` và `CSP-PORTAL.txt`. Portal có lưới an toàn: ảnh lỗi/bị CSP chặn tự chuyển về ảnh gốc và tắt tối ưu trong phiên (`installImageFallback` trong `frontend/src/utils/image.ts`, gồm cả ảnh nền CSS); có thể tắt hẳn bằng `"VITE_IMAGE_OPTIMIZE": 'false'` trong `runtime-config.js` mà không cần build lại.

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
