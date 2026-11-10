# Cổng thông tin Bộ Nội vụ - Frontend (moha-portal)

Giao diện công khai của cổng thông tin điện tử Bộ Nội vụ, viết bằng React 19, TypeScript và Vite 7. Có ba giao diện dùng chung mã nguồn: trang chính, trang Bộ trưởng (`/bo-truong`) và trang Nghị quyết TW4 (`/nghi-quyet-tw4`). Dữ liệu lấy từ API công khai (`api/`) của dự án.

## Lệnh thường dùng

Dùng `pnpm`, chạy trong thư mục `frontend/`:

```bash
pnpm install        # cài phụ thuộc
pnpm dev            # chạy dev tại http://localhost:5173
pnpm build          # kiểm tra kiểu (tsc) và build production vào dist/
pnpm lint           # chạy ESLint
pnpm preview        # xem thử bản build
```

## Cấu hình khi chạy (runtime config)

Địa chỉ API và các thông số môi trường không được đóng gói vào bản build mà đọc từ `public/runtime-config.js`, file này gán đối tượng `window.env` trước khi ứng dụng tải. Các khóa chính:

- `VITE_API_URL`: địa chỉ API công khai, ví dụ `http://host/api/Public/`.
- `VITE_MEDIA_URL`: địa chỉ gốc của ảnh và tệp đính kèm.
- `VITE_GA_MEASUREMENT_ID`: mã đo lường Google Analytics.

Khi chạy `pnpm dev`, `vite.config.ts` tự trỏ API về `http://localhost:55104`. Khi triển khai chỉ cần sửa `runtime-config.js` trên máy chủ, không cần build lại. Các mã chuyên mục, menu theo từng giao diện nằm trong `src/configs/app-config.ts`.

## Tài liệu liên quan

- [../DEV-SETUP.md](../DEV-SETUP.md): thiết lập môi trường dev, chạy và dừng các dịch vụ, script.
- [../AGENTS.md](../AGENTS.md): quy ước làm việc và cấu trúc dự án.
