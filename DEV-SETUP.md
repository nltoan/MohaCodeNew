# Môi trường dev Windows

Ba thành phần chính:

| Thành phần | Công nghệ | URL dev |
|---|---|---|
| Portal (`frontend`) | React 19, TypeScript, Vite 7 | http://localhost:5173 |
| Admin GUI (`backend`) | React 18, Create React App 5, DevExtreme 22.2 | http://localhost:5174 |
| API (`api`) | ASP.NET, .NET Framework 4.8, EF6 | http://localhost:55104 |

## Công cụ đã cài

- Node.js 22.23.3 và npm 10.9.9: `%LOCALAPPDATA%\MohaDev\node-v22.23.3-win-x64`.
- pnpm 10.34.6: `%LOCALAPPDATA%\MohaDev\npm-global`.
- Visual Studio Build Tools 2022, workload Web Build Tools, .NET Framework 4.8 SDK/Targeting Pack.
- IIS Express 10 x64: `C:\Program Files\IIS Express`.
- SQL Server LocalDB 2022: `C:\Program Files\Microsoft SQL Server\160\Tools\Binn`.
- NuGet CLI, 7-Zip standalone và Playwright: `%LOCALAPPDATA%\MohaDev`.
- Git và Chrome đã có sẵn trên máy.

Node và pnpm được thêm vào PATH của tài khoản; mở terminal mới để nhận PATH. Script bên dưới cũng thiết lập PATH cho phiên chạy.

## Database

Instance dành riêng cho dự án: `(localdb)\MohaDev`.
Database: `CongTTDT_MOHA_Dev`, dùng Windows Authentication.
Backup đã restore: `db/CongTTDT_MOHA_20260331.zip` (SQL Server 2022, 145 bảng).

Khởi tạo trên một môi trường chưa có database:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\Initialize-DevDatabase.ps1
```

Script chọn backup có tên mới nhất trong `db/`, giải nén và restore. Nếu database dev đã tồn tại, script giữ nguyên dữ liệu; không tự ghi đè. Data/log và backup đã giải nén nằm trong `%LOCALAPPDATA%\MohaDev`.

Backup có data file khoảng 2,2 GB và log file khoảng 13,5 GB; cần đủ dung lượng để restore dù archive nhỏ. Ổ C đã được mở rộng lên khoảng 146,9 GiB; Recovery 1 GiB được tạo lại ở cuối ổ và Windows RE đã bật lại. Bản sao Recovery và nhật ký thao tác nằm trong `%LOCALAPPDATA%\MohaDev`.

## Chạy và dừng

Chạy từ thư mục gốc repo:

```powershell
.\scripts\Dev.ps1 -Action Start
.\scripts\Dev.ps1 -Action Stop
```

Script chạy ba tiến trình nền, ghi PID và log vào `.dev/`. Admin có thể mất vài phút để biên dịch lần đầu. Có thể theo dõi `.dev/admin.stdout.log` và `.dev/admin.stderr.log`.

API chạy từ bản runtime `.dev/api`, lấy DLL từ `api/bin`. `Web.config` của bản runtime dùng database dev; chuỗi kết nối triển khai trong `api/Web.config` được giữ nguyên. Sau khi sửa C#, build rồi dừng/chạy lại để cập nhật runtime.

Portal được Vite chèn URL local khi chạy dev. Admin dùng URL local khi `NODE_ENV=development`. Build production giữ các URL được khai báo trong HTML gốc.

## Build và kiểm tra

```powershell
.\scripts\Dev.ps1 -Action Build
.\scripts\Dev.ps1 -Action Test
& "$env:LOCALAPPDATA\MohaDev\node-v22.23.3-win-x64\node.exe" .\scripts\Smoke-Test.mjs
```

`Test` kiểm tra HTTP của hai giao diện và JSON của API. Smoke test dùng Chrome headless/Playwright để kiểm tra portal tải API local, màn hình login admin và phản hồi từ chối tài khoản không hợp lệ. Ảnh và kết quả nằm trong `.dev/test-results/`.

Cài lại dependency khi cần:

```powershell
cd frontend
pnpm install --frozen-lockfile
cd ..\backend
npm ci --no-audit --no-fund
cd ..
& "$env:LOCALAPPDATA\MohaDev\nuget.exe" restore api\API.sln -NonInteractive
```

Portal dùng `pnpm-lock.yaml`; npm lockfile hiện chưa đồng bộ với package.json. Postinstall DevExtreme của admin có cảnh báo thiếu metadata theme, nhưng CSS theme đã có trong source. Build hiện có cảnh báo async C#, ESLint/source map ở admin và kích thước bundle; các cảnh báo cần được xử lý riêng khi bảo trì ứng dụng.

Backup database không gồm kho media/upload. Thư mục upload dev được tạo riêng trong `.dev/api`; ảnh/tài liệu cũ cần bản sao kho file tương ứng. Smoke test không bao gồm đăng nhập thành công bằng tài khoản thật, CRUD nội dung, LDAP, 2FA hay các dịch vụ bên ngoài.

## Tra cứu Hội và Quỹ Trung ương

- Portal: http://localhost:5173/tra-cuu-hoi-quy. Khi mở trang chỉ có form; tên trống không gọi API và API cũng từ chối. Kết quả xuất hiện sau khi nhập tên và mã xác nhận; hỗ trợ tên có/không dấu, phân trang 10 dòng, xem chi tiết.
- Admin: http://localhost:5174/HoiQuy/Import. Quyền `manage-hoiquy` được thêm vào nhóm đã có `manage-user`; có thể cấp cho nhóm khác trong quản lý quyền. API kiểm tra chính xác quyền này.
- Import `.xlsx` tối đa 80 MB, sheet `HoiQuyTrungUong`, tiêu đề dòng 3, dữ liệu từ dòng 4. Xem trước 30 phút, chọn chỉ thêm mới hoặc cập nhật theo tên chuẩn hóa + loại. Logo nhúng được chuyển PNG tối đa 320 px; số điện thoại giữ nguyên chuỗi nguồn.
- File khách hàng có 726 dòng, 228 logo; 2 dòng thiếu tên và 6 dòng thuộc 3 nhóm trùng. Mặc định bỏ qua 8 dòng này, còn 718 dòng hợp lệ. Sửa file nguồn rồi import lại để bổ sung các dòng bị bỏ qua.
- Import lưu trong transaction; chế độ chỉ thêm mới không tạo trùng khi import lại. Chế độ cập nhật giữ logo cũ nếu file không cung cấp logo mới.

`Dev.ps1 -Action Start` tự áp dụng migration Hội và Quỹ vào LocalDB. Có thể chạy riêng:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\Initialize-HoiQuy.ps1
```

Khi triển khai lên môi trường khác, chạy `db/migrations/20261001-HoiQuy.sql` bằng tài khoản có quyền tạo bảng và thêm quyền trước khi cập nhật API. Migration không tự import dữ liệu. Cấu hình IIS giới hạn upload riêng cho endpoint xem trước; không thêm thư viện Excel bên ngoài.

Kiểm tra chức năng bằng `scripts/Test-HoiQuy.mjs` trên ba URL local. Chạy `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/Prepare-HoiQuyTests.ps1` để tạo hai tài khoản test riêng trong database local. Script dùng hai tài khoản test được lưu trong `.dev/hoi-test-accounts.json` (tài khoản có quyền và tài khoản không có quyền), chạy import vào database dev và lưu ảnh trong `.dev/test-results/hoi-quy/`. Khi log `CAPTCHA_READY` xuất hiện, đọc ảnh `captcha.png`, ghi 5 ký tự vào `.dev/hoi-captcha-answer.txt` trong 120 giây để kiểm tra mã xác nhận thật; script không bỏ qua xác thực CAPTCHA.
# Kiểm tra tối ưu frontend tại local

Bản build production tối ưu đang được xem thử tại http://localhost:5175/. Server xem thử chạy bằng scripts/Serve-PortalPreview.mjs, phục vụ frontend/dist, thay API sang localhost:55104 và dùng ảnh công khai trên moha.gov.vn. GA tắt trên localhost. Không ghi dữ liệu production. Máy chủ dev/HMR vẫn ở http://localhost:5173/.

Để chạy lại preview sau khi build frontend: dùng Node đã cài để chạy scripts/Serve-PortalPreview.mjs từ repository. Port 5175 chỉ bind localhost. PID phiên hiện tại lưu trong .dev/portal-preview.pid; kiểm tra tiến trình trước khi dừng, không chạy thêm phiên trùng port.

Kiểm tra: Ctrl+Shift+R trang chủ, xem tin/ảnh đầu trang, cuộn dần tới văn bản/tương tác/đa phương tiện/các trang thành phần, mở trang tin rồi quay lại; thử mobile và đổi ngôn ngữ. Các khối phía dưới tải khi cách viewport 400px hoặc tự tải nền sau 2,5 giây + idle (timeout idle 1 giây); không phụ thuộc thao tác cuộn. Menu/banner/tin nổi bật và một số widget công khai dùng cache RAM 30 giây; F5 lấy mới. Các request đồng thời cùng URL được gộp, lỗi không được cache, dữ liệu trả cho mỗi caller được sao chép độc lập. Không cache tìm kiếm/CAPTCHA/import.

Đã kiểm tra build, desktop/mobile, các khối tải khi cuộn, route Hội/Quỹ chưa tìm không hiện kết quả, và cache (gộp request, hết hạn, ngôn ngữ, lỗi thử lại). Bundle entry giảm từ 1.180.834 byte xuống 571.868 byte; gzip giảm 46,9%. Đây là giảm kích thước bundle, không phải khẳng định thời gian tải giảm cùng tỷ lệ. Báo cáo local: .dev/performance-after.json. Chưa triển khai production trong bước tối ưu này.


## Bản tối ưu SEO/layout tiếp theo

Vẫn deploy portal tĩnh, không SSR/Node.js trên production. Dùng scripts/Prepare-PortalRelease.ps1 để đóng gói riêng portal. Bản xem thử local port 5175 phục vụ build mới nhất. Đã bổ sung title mặc định, description theo trang, canonical/og:url tuyệt đối và H1 đúng cho các trang chính; đưa menu chuyên mục mobile xuống sau nội dung và giữ chỗ khi tải. Kết quả đo cuối ở .dev/portal-audit-report.md.

## Kiểm tra thêm các phần portal (02/10/2026)

Đã sửa tìm kiếm (encoding, phân trang, retry và phản hồi đến trễ), landing giới thiệu/văn bản theo menu, bộ lọc văn bản mobile, URL media/attachment, thư viện rỗng/lỗi, bảng lịch sử, album, chi tiết đề tài, metadata chuyên đề và trang không tồn tại. Test local production build tại http://localhost:5175/. Chạy scripts/Audit-PortalSections.cjs, scripts/Test-PortalSections.cjs và scripts/Test-PortalMediaUrls.cjs bằng Node đã cài. Các bài test trình duyệt cố định tiếng Việt; dữ liệu multimedia tiếng Anh local hiện rỗng. Báo cáo phạm vi và giới hạn tại .dev/portal-sections-report.md. Chưa deploy; cách chép portal tĩnh không đổi, không cần migration mới cho bản này.
