# AGENTS.md

## Bản đồ thư mục

- `frontend/`: portal công khai (React 19, Vite 7, pnpm).
- `backend/`: giao diện quản trị (admin GUI: React 18, CRA 5, DevExtreme, npm). Đây là ứng dụng web tĩnh, không phải server.
- `api/`: ASP.NET Web API (.NET Framework 4.8, EF6). Bản build chính thức dùng MSBuild trên Windows.
- `db/migrations/`: migration SQL idempotent.
- `scripts/`: PowerShell và Node (Playwright), nhắm tới Windows. `scripts/mac/` chỉ để chạy thử trên macOS (Mono), không dùng để phát hành.
- `deployment/`: runbook và mẫu cấu hình IIS; `deployment/archive/` là ghi chú cũ theo ngày.
- `docs/ho-so-dap-ung/`: hồ sơ dự thầu (không phải tài liệu kỹ thuật của mã nguồn).
- `web/`, `migrate/`: mã cũ (legacy), xem mục cuối.
- `.dev/`: đầu ra khi chạy (log, gói phát hành, kết quả test), git bỏ qua.

## Lệnh

- Portal: `cd frontend && pnpm install --frozen-lockfile && pnpm build && pnpm lint`
- Admin: `cd backend && npm ci && npm run build`
- Toàn bộ (Windows): `.\scripts\Dev.ps1 -Action Build|Start|Stop|Test`
- Cổng dev: portal 5173, admin 5174, preview production 5175, API 55104.
- Chi tiết môi trường: `DEV-SETUP.md`; lịch sử thay đổi: `CHANGELOG.md`.

## Quy tắc

- Cấu hình runtime nằm trong `window.env` (`frontend/public/runtime-config.js`, `backend/public/index.html`), không dùng `.env` (`backend/.env` chỉ giữ cổng dev).
- URL `tefli.vn` trong `runtime-config.js`, `index.html` của admin và hai `public/web.config` là chỗ giữ của staging; `scripts/Prepare-ProductionRelease.ps1` thay bằng URL trong `deployment/production.json`. Không sửa tay thành URL production.
- Cột/bảng mới cần migration idempotent tên `yyyymmdd-Ten.sql` trong `db/migrations/`; `Dev.ps1` và script phát hành tự lấy mọi file.
- Không nối chuỗi dữ liệu từ client vào SQL. Endpoint ghi dữ liệu phải có `[PermissionAuthorize("manage-…")]`; ngoại lệ hiện có: `HoiQuyAuthorize`, biểu mẫu công khai trong `PublicController` và `Home/UpdateProfile` (tự sửa hồ sơ).
- HTML do CMS cung cấp luôn qua `sanitizeHtml` (portal: `frontend/src/utils/sanitizeHtml.ts`) hoặc `safe-html` (admin: `backend/src/utils/safe-html.js`).
- Đoạn script inline EMC trong `frontend/index.html` có hash trong CSP (`deployment/api-metadata-csp.fragment.xml`); sửa đoạn này thì phải cập nhật hash.
- Chỉ khẳng định `api/` biên dịch được sau khi chạy MSBuild trên Windows; bản dựng Mono trong `scripts/mac/` không thay thế được.
- Không ghi đè `Web.config` production; chỉ gộp phần mẫu/fragment.
- Không commit backup DB, mật khẩu hay tên tài khoản thật.

## Đọc và tìm kiếm

- File nguồn là UTF-8 không BOM. Trong Windows PowerShell 5.1 phải đọc bằng `Get-Content -Encoding UTF8`, nếu không tiếng Việt hiện thành ký tự lỗi (ví dụ `Ä‘`) dù file vẫn đúng.
- Giới hạn phạm vi khi tìm kiếm; bỏ qua `.dev/`, `docs/ho-so-dap-ung/.build/`, `node_modules/`, `api/packages/`, `backend/public/ckeditor/`, `api/Models/MohaModel.*` (mã sinh từ EDMX) và các file lock.

## Mã cũ

`web/` và `migrate/` là mã cũ, giữ để tham khảo; không build, không phát hành. Chuỗi kết nối trong đó chỉ là chỗ giữ (`CHANGE_ME`), không dùng được nếu chưa điền tay.
