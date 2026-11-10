# AGENTS.md

## Bản đồ thư mục

- `frontend/`: portal công khai (React 19, Vite 7, pnpm).
- `backend/`: giao diện quản trị (admin GUI: React 18, CRA 5, DevExtreme, npm). Đây là ứng dụng web tĩnh, không phải server.
- `api/`: ASP.NET Web API (.NET Framework 4.8, EF6). Chỉ build được trên Windows.
- `web/`: host cũ (legacy), nằm ngoài quy trình phát hành.
- `db/migrations/`: migration SQL idempotent.
- `scripts/`: PowerShell và Node (Playwright), nhắm tới Windows.
- `deployment/`: runbook và mẫu cấu hình IIS.

## Lệnh

- Portal: `cd frontend && pnpm install --frozen-lockfile && pnpm build && pnpm lint`
- Admin: `cd backend && npm ci && npm run build`
- Toàn bộ (Windows): `.\scripts\Dev.ps1 -Action Build|Start|Test`
- Cổng dev: portal 5173, admin 5174, preview production 5175, API 55104.
- Chi tiết môi trường: `DEV-SETUP.md`; lịch sử thay đổi: `CHANGELOG.md`.

## Quy tắc

- Cấu hình runtime nằm trong `window.env` (`frontend/public/runtime-config.js`, `backend/public/index.html`), không dùng `.env`.
- Cột/bảng mới cần migration idempotent tên `yyyymmdd-Ten.sql` trong `db/migrations/`; `Dev.ps1` và script phát hành tự lấy mọi file.
- Không nối chuỗi dữ liệu từ client vào SQL; endpoint ghi dữ liệu phải có `[PermissionAuthorize("manage-…")]`.
- HTML do CMS cung cấp luôn qua `sanitizeHtml` (portal: `frontend/src/utils/sanitizeHtml.ts`) hoặc `safe-html` (admin: `backend/src/utils/safe-html.js`).
- `api/` không build được trên macOS/Linux: không khẳng định nó biên dịch khi chưa chạy trên Windows.
- Không ghi đè `Web.config` production; chỉ gộp phần mẫu/fragment.
- Không commit backup DB, mật khẩu hay tên tài khoản thật.
