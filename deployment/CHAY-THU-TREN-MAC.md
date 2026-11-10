# Chạy thử trên macOS (Apple Silicon)

Chỉ dùng để chạy thử, bấm thử giao diện trên máy Mac. Production vẫn là IIS trên Windows; cấu hình này không thay thế và không dùng để phát hành.

## Cách hoạt động

| Thành phần | Cách chạy trên Mac | URL |
|---|---|---|
| SQL Server 2022 | Docker, container `moha-dev-mssql` (linux/amd64 qua Rosetta), volume `moha-dev-mssql-data`, chỉ bind `127.0.0.1:14333` | `localhost,14333` |
| API (.NET Framework 4.8) | Biên dịch bằng Roslyn, chạy bằng Mono qua OWIN self-host (`Microsoft.Owin.Hosting`, không dùng IIS/System.Web) | http://localhost:55104 |
| Portal (`frontend`) | `pnpm dev` | http://localhost:5173 |
| Admin (`backend`) | `npm start` | http://localhost:5174 |

Database: `CongTTDT_MOHA_Dev`, restore từ `db/CongTTDT_MOHA_*.zip`, log được thu nhỏ (RECOVERY SIMPLE) nên chỉ chiếm khoảng 2,5 GB.

## Yêu cầu

- Docker Desktop đang chạy; Mono (`brew install mono`, có `/opt/homebrew/bin/mono`); .NET SDK 8 (`~/.dotnet/dotnet`, dùng compiler Roslyn); Node + pnpm + npm; `python3`.
- Bản backup trong `db/` (lấy từ chủ dự án, không commit).
- Các gói NuGet: `scripts/mac/restore-packages.sh` (vào `.dev/mac/pkgs`).

## Cài đặt lần đầu

```bash
scripts/mac/init-db.sh                 # container + restore + migration (vài phút)
scripts/mac/restore-packages.sh        # gói NuGet
scripts/mac/create-test-account.sh     # tài khoản admin thử cục bộ (tùy chọn)
python3 scripts/mac/build-api.py       # biên dịch API và tạo thư mục chạy .dev/mac/api-run
```

Các script chạy được trực tiếp từ `scripts/mac/`; mọi thứ sinh ra nằm trong `.dev/mac/` (git-ignore). Bản sao đã dùng thực tế nằm sẵn trong `.dev/mac/` trên máy đã cài.

## Ba script chính

```bash
.dev/mac/start.sh          # bật container (nếu đang dừng), API, portal, admin; chạy lại nhiều lần vẫn an toàn
.dev/mac/stop.sh           # dừng API, portal, admin và `docker stop moha-dev-mssql` (không xóa volume)
.dev/mac/rebuild-api.sh    # biên dịch lại API.dll từ mã hiện tại rồi khởi động lại API
```

Có thể truyền tham số `api|portal|admin|db` cho `start.sh`, và `api|portal|admin` cho `stop.sh`. Log: `.dev/mac/logs/` (`api.log`, `portal.log`, `admin.log`).

## Thông tin đăng nhập cục bộ (chỉ ghi đường dẫn)

- Mật khẩu SA của SQL Server: `.dev/mac/sa-password.txt`.
- Tài khoản admin thử `dev_local_admin` (chỉ tồn tại trong DB cục bộ): mật khẩu ở `.dev/mac/test-account.txt`.
- Cấu hình API sinh ra (có chuỗi kết nối): `.dev/mac/api-run/MohaDevHost.exe.config`.

Không commit các file này.

## Những gì được dựng riêng cho Mono (không sửa mã trong repo)

- `Program.cs` (host console): khởi động `API.OAuth.Startup` và thay bộ bảo vệ token DPAPI (Mono không có) bằng AES+HMAC với khóa sinh lần đầu tại `.dev/mac/api-run/dataprotection.key`.
- Siêu dữ liệu EF (`.csdl/.ssdl/.msl`) được tách từ `api/Models/MohaModel.edmx` và nhúng vào `API.dll`.
- `MohaDevHost.exe.config` được sinh từ `api/Web.config`: giữ binding redirect, đổi chuỗi kết nối sang container, `frontendSiteUrl=http://localhost:5173`, `AllowedCorsOrigins` gồm 5173/5174/5175, `AllowInsecureOAuthHttp=true`.

## Không chạy được hoặc chưa kiểm chứng trên Mono self-host

- Chức năng dùng `HttpContext.Current` / `HostingEnvironment.MapPath`: quản lý file (`FileManager`, trả 500), sao lưu (`BackUps`, trả 500), `HoiQuy` tải lên/xem trước, trang HTML metadata của portal (`portal-index.html`), lấy tên người tạo bài trong `TinTucs`.
- Tải tệp lên và xử lý ảnh (System.Drawing cần `libgdiplus`, chưa cài).
- Xuất Excel/PDF chưa kiểm tra.
- LDAP vốn đã tắt trong mã.
- Hiệu năng và hành vi không đại diện cho IIS; lỗi chỉ thấy trên Mono không có nghĩa là lỗi production, và ngược lại.
