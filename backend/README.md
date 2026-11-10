# Backend - Quản trị Cổng TTĐT Bộ Nội vụ (admin CMS)

Giao diện quản trị (CMS) viết bằng React 18 + Create React App 5 + DevExtreme 22.2 (JS/JSX thuần),
gọi tới API ASP.NET trong thư mục `../api`. Tên thư mục là `backend` nhưng đây là ứng dụng web phía trình duyệt.

## Chạy và build

```bash
npm ci          # cài đặt phụ thuộc theo package-lock.json
npm start       # chạy dev, cổng 5174 (đặt trong .env: PORT=5174)
npm run build   # build production ra thư mục build/
```

## Cấu hình lúc chạy

Địa chỉ API, thư mục upload, ngôn ngữ... nằm trong `public/index.html`, đối tượng `window.env`
(sửa trực tiếp file này khi triển khai, không cần build lại).

Token đăng nhập lưu trong `localStorage` (kèm thời điểm hết hạn) qua `src/utils/token.js`
và được gửi bằng header `Authorization: Bearer`.

## Tài liệu liên quan

- `../DEV-SETUP.md` - thiết lập môi trường phát triển
- `../AGENTS.md` - quy ước làm việc trong repo
