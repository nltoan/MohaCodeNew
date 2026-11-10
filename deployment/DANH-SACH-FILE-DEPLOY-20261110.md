# Danh sách file deploy 10/11/2026 (chỉ phần thay đổi)

Gói tham chiếu: `moha-deploy-20261110-final.zip` (giải nén ra thư mục `PKG`). Mục tiêu: chỉ chép đúng phần đổi, không chép cả gói.
Phạm vi thay đổi: đăng nhập mật khẩu mặc định, xem trước tin trong CMS, sửa khoảng trống trang chi tiết tin portal.

## 0. Không chép (nguy hiểm hoặc ngoài phạm vi)

- `PKG\api-update\bin\API.dll.config`: chứa chuỗi kết nối DB của máy build; sẽ đè cấu hình production.
- Mọi `web.config` / `Web.config` production: giữ nguyên.
- `PKG\import-data\*`: dữ liệu Hội và Quỹ cũ, không liên quan.
- `PKG\portal\sitemap.xml`, `sitemap_index.xml`, `robots.txt`, `runtime-config.js`: giữ bản production (đã có cấu hình/sitemap động). Chỉ chép nếu bước so sánh dưới cho thấy khác VÀ bạn xác nhận cần.
- Tài liệu `.md` trong `deployment/`: chỉ để đọc, không chép lên server.

## 1. Cơ sở dữ liệu (làm TRƯỚC khi chép API)

1. Backup DB. `SELECT DB_NAME()` xác nhận đúng DB production.
2. Chạy `PKG\deployment\20261109-TinTuc-NgonNgu.sql` nếu production CHƯA có cột `TinTuc.NgonNgu` (kiểm tra: `SELECT COL_LENGTH('dbo.TinTuc','NgonNgu')`; NULL = chưa có).
3. Chạy `PKG\deployment\20261110-MatKhauMacDinh.sql`.
4. Đánh dấu tài khoản dùng mật khẩu mặc định (xem hướng dẫn trong file SQL).

## 2. API (`api-update`)

Chép bắt buộc:
- `PKG\api-update\bin\API.dll` -> `<API>\bin\API.dll`

Các DLL còn lại trong `bin` (Newtonsoft, EntityFramework, Owin, ...): lần này KHÔNG đổi gói NuGet nào (`api/packages.config` không đổi), nên chỉ chép khi so sánh hash cho thấy khác bản production. Dùng script mục 5.

Chép nếu khác: `PKG\api-update\Global.asax` -> `<API>\Global.asax`.

Cấu hình tuỳ chọn trong `<API>\Web.config` (appSettings): `DefaultPasswordMaxLogins` (mặc định 3 nếu không khai báo).

## 3. Admin (`admin-candidate`)

Bundle React đặt tên theo hash nên chép cả hai thư mục sau, rồi `index.html` CUỐI CÙNG:
1. `PKG\admin-candidate\static\` (css, js, media)
2. `PKG\admin-candidate\asset-manifest.json`
3. `PKG\admin-candidate\index.html` (chép sau cùng)

Các thư mục `ckeditor\`, `assets\fonts\` và ảnh (`logo*.png`, `avatar.png`, `background.jpg`, ...) không đổi: bỏ qua nếu hash giống production.

## 4. Portal (`portal`)

1. `PKG\portal\assets\` (chép trước)
2. `PKG\portal\index.html` (chép sau cùng)
3. Dọn cache/CDN cho `/` và `/index.html`.

`PKG\portal\images\` không đổi: bỏ qua nếu hash giống.

## 5. Script so sánh hash (chạy trên server, chỉ đọc)

```powershell
# $pkg = thư mục đã giải nén gói; $live = thư mục đang chạy trên server
function Compare-Folder($pkg, $live, [string[]]$Exclude = @()) {
  Get-ChildItem $pkg -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($pkg.Length).TrimStart('\')
    if ($Exclude | Where-Object { $rel -like $_ }) { return }
    $t = Join-Path $live $rel
    if (!(Test-Path $t)) { [pscustomobject]@{Status='MOI';File=$rel} }
    elseif ((Get-FileHash $_.FullName).Hash -ne (Get-FileHash $t).Hash) { [pscustomobject]@{Status='KHAC';File=$rel} }
  }
}
Compare-Folder 'D:\PKG\api-update\bin' 'D:\sites\api\bin' @('API.dll.config','*.pdb')
Compare-Folder 'D:\PKG\admin-candidate' 'D:\sites\admin' @('web.config')
Compare-Folder 'D:\PKG\portal' 'D:\sites\portal' @('web.config','sitemap*.xml','robots.txt','runtime-config.js')
```

Chỉ chép các file có `Status` là `MOI` hoặc `KHAC`. Nếu `bin` có nhiều DLL `KHAC` ngoài `API.dll`, DỪNG và đối chiếu phiên bản (gói build có thể dùng phụ thuộc khác bản đang chạy).

## 6. Kiểm tra sau deploy

- `POST /api/Token` với tài khoản thường: đăng nhập được; tài khoản đánh dấu mặc định: lần 4 bị hạn chế, vào được `/Profile`.
- CMS: nút 🔍 xem trước hiện ở danh sách tin; bài nháp xem được trong CMS, không xem được trên portal.
- Portal: trang chi tiết tin không còn khoảng trống dưới tiêu đề; tin chưa public hiện thông báo thay vì khung trống.
- Rollback: giữ bản sao `API.dll`, thư mục admin/portal cũ trước khi chép; cột DB mới giữ nguyên (không ảnh hưởng bản cũ).
