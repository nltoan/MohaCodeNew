# Môi trường dev Windows

Quy ước cho người và AI agent: xem `AGENTS.md`. Lịch sử thay đổi và ghi chú từng đợt: xem `CHANGELOG.md`.

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
Backup đã restore trên máy dev ban đầu: `CongTTDT_MOHA_20260331.zip` (SQL Server 2022, 145 bảng).

Backup (`db/*.zip|7z|bak`) không còn trong git (đã git-ignore; vẫn còn trong lịch sử git). Lấy file backup từ chủ dự án qua kênh riêng, đặt vào `db/` hoặc truyền `-BackupPath <đường dẫn>`. Không commit backup.

Khởi tạo trên một môi trường chưa có database:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\Initialize-DevDatabase.ps1
```

Script chọn backup có tên mới nhất trong `db/` (hoặc file chỉ định bằng `-BackupPath`), giải nén và restore. Nếu `db/` không có backup và không truyền `-BackupPath`, script dừng với thông báo nói rõ cách lấy backup. Nếu database dev đã tồn tại, script giữ nguyên dữ liệu; không tự ghi đè. Data/log và backup đã giải nén nằm trong `%LOCALAPPDATA%\MohaDev`.

Backup có data file khoảng 2,2 GB và log file khoảng 13,5 GB; cần đủ dung lượng để restore dù archive nhỏ.

## Chạy và dừng

Chạy từ thư mục gốc repo:

```powershell
.\scripts\Dev.ps1 -Action Start
.\scripts\Dev.ps1 -Action Stop
```

Script chạy API, portal, admin (và preview 5175 nếu đã có `frontend/dist`) dưới dạng tiến trình nền, ghi PID và log vào `.dev/`. Admin có thể mất vài phút để biên dịch lần đầu. Có thể theo dõi `.dev/admin.stdout.log` và `.dev/admin.stderr.log`.

API chạy từ bản runtime `.dev/api`, lấy DLL từ `api/bin`. `Web.config` của bản runtime dùng database dev; `api/Web.config` được giữ nguyên (mật khẩu DB trong đó là `CHANGE_ME`). Các khóa tùy chọn (ví dụ reCAPTCHA) đặt trong `api/appSettings.local.config` (git-ignored, không commit); `Dev.ps1` chép file này vào `.dev/api` khi có. Tạo file này theo mẫu `<appSettings>` và lấy giá trị từ chủ dự án. Sau khi sửa C#, build rồi dừng/chạy lại để cập nhật runtime.

Portal được Vite chèn URL local khi chạy dev. Admin dùng URL local khi `NODE_ENV=development`. Build production giữ các URL được khai báo trong HTML gốc.

Khi API local khởi động, `Dev.ps1` chạy toàn bộ migration trong `db/migrations` (theo thứ tự tên file, đều idempotent) trên LocalDB `MohaDev`, gồm `20261109-TinTuc-NgonNgu.sql`. Lần đầu tạo cột, migration gán `vi` cho tin hiện có theo xác nhận nghiệp vụ; các lần chạy sau không ghi đè ngôn ngữ đã chọn. Trước khi triển khai production, xem `deployment/NGON-NGU-TIN-TUC.md`; không dùng LocalDB hoặc script tự khởi động để thao tác production.

## Build và kiểm tra

```powershell
.\scripts\Dev.ps1 -Action Build
.\scripts\Dev.ps1 -Action Test
& "$env:LOCALAPPDATA\MohaDev\node-v22.23.3-win-x64\node.exe" .\scripts\Smoke-Test.mjs
```

`Test` kiểm tra HTTP của portal, admin, preview 5175 (cần `frontend/dist` đã build) và JSON của API. Smoke test dùng Chrome headless/Playwright để kiểm tra portal tải API local, màn hình login admin và phản hồi từ chối tài khoản không hợp lệ. Ảnh và kết quả nằm trong `.dev/test-results/`.

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

`Dev.ps1 -Action Start` tự áp dụng mọi migration vào LocalDB. Có thể chạy riêng (áp dụng toàn bộ `db\migrations\*.sql` theo thứ tự tên file):

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\Initialize-Migrations.ps1
```

Khi triển khai lên môi trường khác, chạy `db/migrations/20261001-HoiQuy.sql` bằng tài khoản có quyền tạo bảng và thêm quyền trước khi cập nhật API. Migration không tự import dữ liệu. Cấu hình IIS giới hạn upload riêng cho endpoint xem trước; không thêm thư viện Excel bên ngoài.

Kiểm tra chức năng bằng `scripts/Test-HoiQuy.mjs` trên ba URL local. Chạy `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/Prepare-HoiQuyTests.ps1` để tạo hai tài khoản test riêng trong database local. Script dùng hai tài khoản test được lưu trong `.dev/hoi-test-accounts.json` (tài khoản có quyền và tài khoản không có quyền), chạy import vào database dev và lưu ảnh trong `.dev/test-results/hoi-quy/`. Khi log `CAPTCHA_READY` xuất hiện, đọc ảnh `captcha.png`, ghi 5 ký tự vào `.dev/hoi-captcha-answer.txt` trong 120 giây để kiểm tra mã xác nhận thật; script không bỏ qua xác thực CAPTCHA.

## Xem thử bản build production (cổng 5175)

Preview chạy bằng `scripts/Serve-PortalPreview.mjs`, phục vụ `frontend/dist` tại http://localhost:5175/ (chỉ bind localhost, đổi API sang localhost:55104, GA tắt). Cần build portal trước (`.\scripts\Dev.ps1 -Action Build`); `Dev.ps1 -Action Start` tự bật preview khi đã có `frontend/dist`. Dùng Node đã cài để chạy lại thủ công sau khi build lại frontend. PID phiên hiện tại nằm ở `.dev/portal-preview.pid`; kiểm tra tiến trình trước khi dừng, không chạy thêm phiên trùng port.

Kiểm tra bằng Node đã cài: `scripts/Test-PortalSections.cjs`, `scripts/Test-PortalMediaUrls.cjs`, `scripts/Test-HomePerformance.cjs`, `scripts/Test-PortalSeo.cjs`; muốn quét toàn bộ route thì chạy `scripts/Audit-PortalAll.cjs`; đặt biến `PORTAL_AUDIT_ROUTES` (mảng JSON) để chỉ quét vài route. Các bài test trình duyệt cố định tiếng Việt. Kết quả ghi vào `.dev/`.

## Tự khởi động local trên Windows

Tác vụ Task Scheduler `MohaDev-Local` chạy `scripts/AutoStart-Dev.ps1` ẩn khi tài khoản Windows hiện tại đăng nhập. Dùng quyền thường, không lưu mật khẩu; LocalDB thuộc tài khoản này nên không chạy dưới SYSTEM hoặc trước khi đăng nhập. Bật LocalDB MohaDev, API 55104, portal dev 5173, admin 5174 và preview production build 5175. Preview cần frontend/dist đã build; không tự build mỗi lần đăng nhập.

Supervisor kiểm tra định kỳ khoảng 30 giây, bật lại tiến trình bị dừng và kiểm tra kết nối DB/API. Nếu API hỏng 3 lượt liên tiếp, chỉ restart IIS Express được quản lý. Không dừng tiến trình lạ chiếm port. `Dev.ps1 -Action Start` có thể gọi lại khi một phần môi trường đã chạy; chỉ khởi động phần thiếu. Log: `.dev/autostart.log`, `.dev/autostart-start.log` và log từng dịch vụ trong `.dev`.

Đăng ký trên máy mới: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/Install-DevAutoStart.ps1`. Kiểm tra một lần khi supervisor chưa chạy: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/AutoStart-Dev.ps1 -Once`.

Để dừng local và không tự bật lại: chạy `Disable-ScheduledTask -TaskName MohaDev-Local`, `Stop-ScheduledTask -TaskName MohaDev-Local`, rồi `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/Dev.ps1 -Action Stop`. Bật lại bằng `Enable-ScheduledTask -TaskName MohaDev-Local` và `Start-ScheduledTask -TaskName MohaDev-Local`.

Đã thử dừng riêng API/preview: supervisor tự bật lại bằng PID mới, portal/admin giữ PID cũ và các URL local trở lại HTTP 200. Không reboot máy trong kiểm tra này. API có thể cần thời gian warm-up sau khi khởi động.

## Mục lục script

Mọi script nằm trong `scripts/`, chạy từ thư mục gốc repo trên Windows. Script `.cjs`/`.mjs` dùng Playwright và Chrome đã cài (`%LOCALAPPDATA%\MohaDev\browser-tests`), chạy bằng Node đã cài. Kết quả ghi vào `.dev/`.

| Script | Việc làm | Khi nào chạy |
|---|---|---|
| `Dev.ps1` | `-Action Build/Start/Stop/Test`: build, chạy/dừng API, portal, admin, preview, kiểm tra HTTP; Start tự áp dụng migration | Hằng ngày |
| `Initialize-DevDatabase.ps1` | Restore backup trong `db/` (hoặc `-BackupPath`) vào LocalDB `MohaDev`; không ghi đè DB đã có | Một lần trên máy mới |
| `Initialize-Migrations.ps1` | Áp dụng mọi `db\migrations\*.sql` theo thứ tự tên vào LocalDB dev | Khi cần áp dụng migration mà không chạy `Dev.ps1` |
| `AutoStart-Dev.ps1` | Supervisor: bật lại các dịch vụ dev bị dừng, kiểm tra DB/API (`-Once` chạy một lần) | Do Task Scheduler gọi |
| `Install-DevAutoStart.ps1` | Đăng ký tác vụ `MohaDev-Local` chạy `AutoStart-Dev.ps1` khi đăng nhập | Một lần trên máy mới |
| `Serve-PortalPreview.mjs` | Phục vụ `frontend/dist` tại cổng 5175 (API trỏ localhost, GA tắt) | Sau khi build portal; `Dev.ps1 Start` tự gọi |
| `Prepare-ProductionRelease.ps1` | Build và đóng gói bản phát hành vào `.dev/releases` từ `deployment/production.json` | Khi chuẩn bị triển khai (xem `deployment/DEPLOY-MOHA.md`) |
| `Smoke-Test.mjs` | Kiểm tra portal tải API local, màn hình login admin, từ chối tài khoản sai | Sau `Dev.ps1 Start` |
| `Audit-PortalAll.cjs` | Quét mọi route portal trên preview 5175 (lỗi JS, request lỗi); `PORTAL_AUDIT_ROUTES`, `PORTAL_AUDIT_OUTPUT` | Sau khi build portal |
| `Audit-SecurityNuget.cjs` | Đối chiếu package NuGet của API với cơ sở dữ liệu lỗ hổng NuGet (cần mạng) | Định kỳ / trước phát hành |
| `Prepare-HoiQuyTests.ps1` | Tạo hai tài khoản test (có quyền, không quyền) trong DB dev, ghi `.dev/hoi-test-accounts.json` | Trước các test cần đăng nhập |
| `Test-HoiQuy.mjs` | Kiểm tra tra cứu và import Hội/Quỹ trên ba URL local (cần tài khoản test; CAPTCHA đọc tay) | Sau khi đổi chức năng Hội/Quỹ |
| `Test-ChunkUpload.mjs` | Kiểm tra upload từng phần 4 MiB của import Hội/Quỹ qua API | Sau khi đổi API upload |
| `Test-AccountStatus.ps1` | Tạo tài khoản tạm trong DB dev để kiểm tra đăng nhập theo `TrangThai`, rồi xóa | Sau khi đổi logic đăng nhập |
| `Test-MetadataHead.ps1` | Kiểm tra HTML thô của API `MetadataPage` (các thẻ Dublin Core) trên API local | Sau khi đổi `MetadataPage` |
| `Test-DublinCore.cjs` | Kiểm tra thẻ `DC.*` do portal React tạo (API giả lập, `PORTAL_TEST_URL`) | Sau khi đổi `PortalSeo` |
| `Test-PortalSeo.cjs` | Kiểm tra canonical, description, og:url, cập nhật khi chuyển trang, bố cục mobile tin tức | Sau khi đổi SEO portal |
| `Test-PortalSections.cjs` | Kiểm tra landing giới thiệu/văn bản, layout mobile, 404, tìm kiếm | Sau khi đổi các trang này |
| `Test-PortalAuditFixes.cjs` | Kiểm tra landing chuyên mục/giới thiệu không gọi `ID=null`, phân giải URL media trong bài | Sau khi đổi routing/media |
| `Test-PortalMediaUrls.cjs` | Kiểm tra hàm URL media/PDF với và không có dấu `/` cuối | Sau khi đổi `utils/image.ts` |
| `Test-PortalCsp.cjs` | Kiểm tra bản build với CSP production: runtime-config, GA, logo `data:` (mạng giả lập) | Sau khi đổi CSP/runtime-config |
| `Test-Analytics.cjs` | Kiểm tra `analytics.ts` chỉ khởi tạo GA trên host production | Sau khi đổi GA |
| `Test-PublicCache.cjs` | Kiểm tra `public-cache.ts` (gộp request, hết hạn, thử lại) | Sau khi đổi cache API |
| `Test-HomePerformance.cjs` | Đo tải trang chủ desktop/mobile, request và lỗi | Sau khi đổi trang chủ |
| `Test-SimilarLoading.cjs` | Kiểm tra trạng thái đang tải, rỗng, lỗi + thử lại của các trang danh sách | Sau khi đổi trang danh sách |
| `Test-SiteHomeLoading.cjs` | `minister` hoặc `nq`: kiểm tra tải độc lập và thử lại các khối của trang chủ chuyên trang | Sau khi đổi trang `/bo-truong`, `/nghi-quyet-tw4` |
| `New-SecurityFixtures.cjs` | Tạo `xxe.xlsx` và `oversized-xml.xlsx` vào `.dev/security-fixtures/` | Trước `Test-SecurityApi.cjs` |
| `Test-SecurityApi.cjs` | Bộ kiểm tra bảo mật API local (quyền, CORS, upload, import Excel, rate limit) | Trước phát hành; cần tài khoản test và fixture |
| `Test-SecurityAdmin.cjs` | Kiểm tra admin render nội dung HTML an toàn, chặn XSS (đăng nhập tài khoản test) | Trước phát hành |
| `Test-SecurityPortal.cjs` | Kiểm tra portal lọc HTML chèn vào (XSS), API giả lập | Trước phát hành |
| `Test-SecurityUploadHosting.cjs` | Kiểm tra IIS Express chặn phục vụ file cấu hình/backup/thực thi trong thư mục upload (`.dev/api/Upload`) | Sau khi đổi `Upload\web.config` |
