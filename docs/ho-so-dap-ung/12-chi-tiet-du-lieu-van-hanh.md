# 12. Chi tiết phương án chuyển đổi dữ liệu và vận hành bảo mật

## 1. Mục đích, phạm vi và cách đọc

Tài liệu này triển khai chi tiết các hạng mục 10–15 về chuyển đổi/tích hợp dữ liệu và 25–28 về 2FA, mã QR, sao lưu và cảnh báo. Đây là phương án kỹ thuật đề xuất của Tefli để làm cơ sở khảo sát, thiết kế, kiểm thử và nghiệm thu cùng Chủ đầu tư. Mô tả hiện trạng mã nguồn bên dưới là bằng chứng rà soát tĩnh; không xác nhận dữ liệu đã được chuyển đổi trong môi trường đích, các quy trình đã được triển khai đầy đủ hay một chỉ tiêu vận hành đã đạt.

Nguồn yêu cầu chính là [B0738.R013–R018], [B0742.R043–R050], [B0746.R022–R025]; các mục liên quan gồm quy định chuyển đổi/tích hợp tại [B0650–B0654], an toàn thông tin cấp độ 3 tại [B0798–B0802], tải [B0804], và kiến trúc/DR tại [B0751–B0756]. Tên tiêu chí và số hiệu yêu cầu được giữ để liên kết với ma trận 29 hạng mục trong `09-ma-tran-29-hang-muc.md`.

### 1.1 Nguyên tắc triển khai

1. **Khảo sát trước khi chốt mapping.** Nguồn dữ liệu thực tế, phiên bản schema, mã danh mục, quy ước trạng thái, quyền khai thác tệp và tập URL cũ cần được Chủ đầu tư xác nhận. Mapping minh họa trong tài liệu không phải schema nguồn chính thức.
2. **Có thể truy nguyên và đối soát.** Mỗi bản ghi chuyển đổi cần giữ khóa nguồn ổn định, mã tương quan lô và kết quả xử lý; sai khác được phân loại, không âm thầm bỏ qua.
3. **Chạy thử trên bản sao đã được phép sử dụng.** Không chạy reset, xóa hoặc ghi đè lên dữ liệu thật nếu chưa có phê duyệt, bản sao phục hồi và cửa sổ thay đổi được thống nhất.
4. **Quy trình vận hành có kiểm soát.** Thao tác thay đổi xác thực, tải backup, phục hồi dữ liệu, thay đích URL hoặc chạy lại lô được ghi nhận, giới hạn quyền và có người chịu trách nhiệm.
5. **Chỉ tiêu HSYC là ngưỡng nghiệm thu.** RPO/RTO không quá 4 giờ, tải 500 phiên công khai và 84 phiên động, cùng độ sẵn sàng 99,9% là yêu cầu cần đo và xác nhận trên hạ tầng thực tế; tài liệu này không tuyên bố đã đạt.

### 1.2 Bằng chứng mã nguồn và giới hạn suy luận

Mã nguồn có công cụ `migrate/MigrationTool/MigrationProcess.cs`, các tệp mapping JSON và kết nối SharePoint/SQL. Luồng hiện thấy đọc danh sách SharePoint, ánh xạ trường, lookup, tệp đính kèm, ghi nhật ký kết quả và ghi khóa `Migrate_Source`; cấu hình có lựa chọn `migrate`, `skip`, `reset`. Các file cụ thể hiện có gồm `01.2.KNDTinTuc_TinTuc.json`, `02.1.BoTruong_DanhMuc_ChuyenMuc.json`, `02.2.BoTruong_TinTuc_TinTuc.json`, `15.4.Van ban QPPL.json` và `15.5.Van ban CDDH.json`. Mapping Bộ trưởng đọc `/knd/tt`, list `Tin trang bộ trưởng` hoặc `DanhmucTDKT`; mapping CĐĐH đọc `/KND/vb/vbqp`, list `Văn bản chỉ đạo điều hành`. Đây là tên/định tuyến trong cấu hình hiện tại; riêng chúng không xác nhận nguồn thuộc dự án Bộ LĐTBXH hay cùng phạm vi với B0738.R012. HSYC nêu rõ tích hợp giữa Cổng Bộ Nội vụ và Cổng Bộ LĐTBXH [B0738.R012], nhưng danh tính và schema của bộ dữ liệu thực tế vẫn phải được đối chiếu với Chủ đầu tư trước khi tái sử dụng mapping. Sự tồn tại của file không chứng minh mapping đầy đủ hoặc đã chạy thành công trên dữ liệu yêu cầu.

Mã `api/Controllers/API/HomeController.cs` có thao tác tạo secret TOTP, QR setup, và cập nhật trạng thái 2FA sau xác minh PIN. `api/Controllers/API/BackUpsController.cs` có tạo full backup, liệt kê tệp và tải `.bak`; chưa thấy lập lịch hoặc API phục hồi tương ứng ở điểm rà soát. `backend/src/pages/BackUp.js` cung cấp giao diện gọi tạo backup và tải file. `backend/src/pages/ThongBao.js` cùng API thông báo nội bộ không tự chứng minh các cảnh báo API, bất thường đăng nhập hoặc gửi email theo yêu cầu. Các điểm còn thiếu được ghi là phần đề xuất/bổ sung.

## 2. Quy trình quản trị chuyển đổi chung

### 2.1 Vai trò và đầu vào

Trước mỗi đợt, Tefli và Chủ đầu tư chỉ định: chủ sở hữu dữ liệu nguồn; quản trị SharePoint/SQL; đầu mối nghiệp vụ cho từng miền; quản trị Cổng đích; người duyệt thay đổi; người chứng kiến đối soát; đầu mối hạ tầng/tệp; và người quyết định cutover. Tối thiểu cần các đầu vào sau:

- Danh sách site/list/thư viện/tệp nguồn, phạm vi thời gian và trạng thái được chuyển.
- Schema và từ điển trường, kiểu dữ liệu, trường bắt buộc, quan hệ, danh mục chuẩn, ngôn ngữ, múi giờ, quy tắc hiệu lực/xuất bản.
- Danh sách tài khoản dịch vụ và quyền đọc/ghi đã được cấp; endpoint và kết nối đã kiểm soát.
- Danh mục định dạng tệp, dung lượng, tên, checksum nếu có, quyền sử dụng và quy tắc quét an toàn.
- Môi trường đích, dung lượng lưu, giới hạn API/SQL, kế hoạch dừng ghi nguồn hoặc cơ chế đồng bộ tăng dần.
- Quy tắc xử lý trùng, bản ghi thiếu liên kết, bản ghi bị xóa/ẩn, HTML không hợp lệ, tệp mất, URL cũ trùng đích.

Không dùng tài khoản cá nhân tùy tiện để chạy lô. Thông tin kết nối đặt ngoài mã nguồn, được cấp quyền tối thiểu và thu hồi sau công việc nếu không còn nhu cầu. Tệp log phải che thông tin xác thực, dữ liệu nhạy cảm và nội dung bí mật; chỉ người có vai trò được duyệt xem báo cáo chi tiết.

### 2.2 Các trạng thái của một lô

Một lô được quản lý theo trạng thái: **Dự thảo → Đã rà mapping → Đã duyệt phạm vi → Đã chụp baseline → Chạy thử → Đối soát → Chấp thuận chạy chính thức → Cutover → Theo dõi ổn định → Đóng lô**. Trạng thái phụ gồm **Tạm dừng**, **Có lỗi cần xử lý**, **Chạy lại có kiểm soát**, **Quay lui**. Mỗi chuyển trạng thái cần ghi người thực hiện, thời điểm, mã phiên bản mapping, mã lô, nguồn/đích, số bản ghi dự kiến và liên kết biên bản.

Lỗi từng bản ghi không làm mất thông tin các bản ghi khác. Hệ thống báo cáo tối thiểu số đọc, số hợp lệ, số ghi mới, số cập nhật idempotent, số bị bỏ theo quy tắc, số lỗi, số liên kết/tệp thiếu và tổng thời gian. Mỗi lỗi có mã phân loại, khóa nguồn đã che dữ liệu nhạy cảm, thông điệp xử lý được và khuyến nghị hành động. Không đưa toàn bộ nội dung bài viết hay secret OTP vào log.

### 2.3 Bảo toàn tính lặp lại

Chạy lại một lô sau lỗi phải tạo cùng kết quả đích khi đầu vào và mapping không đổi. Khóa nguồn dạng site/list/item hoặc một định danh ổn định khác được sử dụng để nhận biết bản ghi đã chuyển. So sánh số liệu trước/sau theo từng phân hệ và tập ID nguồn, không chỉ so tổng số. Nếu mapping đổi, tăng phiên bản mapping và tạo báo cáo sai khác; không dùng lại mã phiên bản cũ để che thay đổi. Thao tác reset hoặc xóa dữ liệu là nhánh đặc biệt, cần phê duyệt rõ, backup kiểm chứng, xác định các bảng liên quan và trình tự khôi phục.

### 2.4 Đối soát và tiêu chuẩn chấp nhận

Đối soát bao gồm số lượng theo loại/trạng thái/chuyên mục/năm; tỷ lệ thiếu trường bắt buộc; khóa ngoại/danh mục; mẫu nội dung có dấu tiếng Việt; ngày giờ; liên kết và tệp; URL; trạng thái xuất bản; ảnh đại diện/thumbnail; và kiểm tra hiển thị trên các trang mục tiêu. Bộ mẫu được chọn có chủ đích: bản ghi mới/cũ, có nhiều tệp, không có tệp, nhiều quan hệ, ký tự đặc biệt, HTML dài, trạng thái nháp/đã duyệt, bản ghi lỗi lịch sử và các ngoại lệ nghiệp vụ.

Ngưỡng chấp nhận, sai số cho phép, danh sách loại trừ và quyết định dữ liệu không thể khôi phục được thống nhất trước chạy chính thức. Mọi ngoại lệ có mã, lý do, chủ sở hữu và quyết định xử lý. Chỉ Chủ đầu tư hoặc người được ủy quyền chấp thuận biên bản đối soát và cutover.

## 3. Hạng mục 10 — Chuyển đổi, tích hợp dữ liệu tin tức

**Yêu cầu:** [B0738.R013], phối hợp với [B0650–B0654]. Nguồn yêu cầu mô tả chuyển đổi/tích hợp dữ liệu phần tin tức giữa hai Cổng; trường nguồn thực tế cần khảo sát, không mặc định giống mapping JSON sẵn có.

**Dấu vết hiện trạng:** `01.2.KNDTinTuc_TinTuc.json` ánh xạ danh sách “Tin tức” tại `/knd/tt` sang `TinTuc`, có tiêu đề, mô tả, nội dung, tác giả, ngày hiển thị, nguồn, từ khóa, danh mục, trạng thái, nổi bật, ảnh và tệp. `MigrationProcess.cs` chuyển danh sách, xử lý lookup/attachments và ghi kết quả. Mapping có giá trị cố định cho một số trường như người tạo/quy trình; các giá trị này cần được xác minh nghiệp vụ trước khi dùng cho nguồn mới.

### 3.1 Quy trình xử lý

1. **Kiểm kê và chụp baseline:** đếm bản ghi theo năm, danh mục, trạng thái, ngôn ngữ; thu số liệu tệp/thư viện; lập danh sách định danh nguồn và kiểm tra quyền đọc. Ghi thời điểm snapshot và truy vấn/báo cáo dùng làm baseline.
2. **Chuẩn hóa nội dung:** thống nhất UTF-8/Unicode, quy tắc HTML an toàn, khoảng trắng, URL nội bộ, ngày giờ và múi giờ. Không tự viết lại nội dung biên tập. Bản ghi thiếu dữ liệu bắt buộc đi vào hàng chờ xử lý hoặc bị loại theo quy tắc đã duyệt.
3. **Nạp phụ thuộc:** chuyển danh mục/chuyên mục, loại tin, ngôn ngữ hoặc danh mục liên quan trước tin; xây bảng tra khóa nguồn→ID đích. Nếu quan hệ không tìm thấy, ghi lỗi tham chiếu, không gán tùy tiện danh mục mặc định.
4. **Chuyển nội dung:** ánh xạ trường theo phiên bản; bảo toàn trạng thái nghiệp vụ và thời điểm xuất bản theo quy tắc được xác nhận. Chuyển tệp qua kho được duyệt, giữ quan hệ tệp-bài, tên hiển thị và checksum để kiểm tra toàn vẹn.
5. **Kiểm tra đầu ra:** so số bản ghi và mẫu, mở trang danh sách/chi tiết, thử liên kết, ảnh đại diện, tệp đính kèm, tìm kiếm và hiển thị tiếng Việt.
6. **Đồng bộ phần thay đổi:** nếu nguồn tiếp tục ghi trong giai đoạn chuyển đổi, thống nhất cửa sổ đóng ghi hoặc cơ chế delta theo `Modified`/log sự kiện. Ghi rõ xử lý cập nhật, xóa/ẩn và xung đột sửa song song.

### 3.2 Mapping logic và ví dụ minh họa

Các cột sau chỉ là **ví dụ minh họa, không phải schema thực tế của Cổng nguồn Bộ LĐTBXH**. Mapping cuối cùng dựa trên khảo sát schema và được Chủ đầu tư duyệt.

| Trường nguồn minh họa | Trường logic đích | Quy tắc đề xuất |
|---|---|---|
| `SourceItemId` | `Migrate_Source` | Khóa tổng hợp site/list/ID; duy nhất và ổn định qua lần chạy. |
| `Headline` | `TieuDe` | Giữ nguyên Unicode; trim khoảng trắng ngoài; kiểm tra không rỗng và độ dài đích. |
| `Summary` | `MoTa` | Giữ nội dung; xử lý HTML theo whitelist đã duyệt. |
| `BodyHtml` | `NoiDung` | Bảo toàn cấu trúc được hỗ trợ; quét link và thẻ nguy hiểm; không loại nội dung hợp lệ âm thầm. |
| `CategoryKey` | `IDChuyenMuc` | Ánh xạ qua bảng danh mục đã chuyển; lỗi nếu không tìm thấy. |
| `PublishedAt` | `NgayXuatBan` | Quy đổi múi giờ thống nhất; bảo toàn thời điểm nguồn; kiểm tra giá trị ngoài phạm vi. |
| `AuthorName` / `SourceName` | `TacGia` / `NguonTin` | Không tự suy ra người dùng đích; lưu chuỗi hiển thị theo phê duyệt. |
| `Tags` | `TuKhoa` | Chuẩn hóa delimiter; loại trùng không phân biệt hoa thường theo quy tắc đã duyệt. |
| `FeatureFlag` | `NoiBat` | Bảng quy đổi true/false/null; giá trị null cần quyết định nghiệp vụ. |
| `Attachments[]` | `TinTuc_Files`/kho tệp | Chuyển nội dung nhị phân, kiểm tra kích thước/checksum và quan hệ tới đúng bài. |

### 3.3 Lỗi, bảo mật và nghiệm thu

Lỗi điển hình gồm tiêu đề rỗng/vượt giới hạn; ngày không phân tích được; danh mục thiếu; trạng thái không có giá trị tương đương; tệp không đọc được; HTML có cấu trúc không tương thích; slug trùng; lỗi quota/timeout; bản ghi nguồn bị xóa giữa lúc quét. Mỗi nhóm có chính sách: sửa dữ liệu nguồn, bổ sung bảng chuyển đổi được duyệt, đưa vào danh sách ngoại lệ hoặc thử lại. Retry có backoff và giới hạn; chỉ lặp thao tác idempotent. Tệp thất bại được retry riêng theo checksum; không tạo quan hệ giả.

**Ca nghiệm thu đề xuất:** đối chiếu tổng theo năm/danh mục/trạng thái; kiểm tra tập mẫu tiêu đề, nội dung dài, ngày giờ, ảnh/tệp và link; chạy lại cùng lô để chứng minh không sinh trùng; làm lỗi có chủ đích một lookup để xác nhận báo cáo; kiểm tra xử lý ký tự tiếng Việt và URL nội bộ; kiểm tra số bản ghi bị loại có lý do. Bằng chứng gồm manifest, phiên bản mapping, nhật ký đã khử nhạy cảm, báo cáo đối soát, ảnh/URL đầu ra và biên bản Chủ đầu tư.

**[FIG:migration-pipeline]**

## 4. Hạng mục 11 — Chuyển đổi, tích hợp dữ liệu văn bản

**Yêu cầu:** [B0738.R014]. Phạm vi bao gồm dữ liệu văn bản; [B0742.R028–R029] và [B0746.R014] bổ trợ về quản lý văn bản. Cần chốt riêng QPPL và CĐĐH, bao gồm phân loại và quy tắc hiệu lực.

**Dấu vết hiện trạng:** Có mapping `15.4.Van ban QPPL.json` sang `VanBan` và `15.5.Van ban CDDH.json` cũng sang `VanBan`; cả hai cấu hình cùng đường dẫn site `/KND/vb/vbqp` nhưng list nguồn khác nhau. Mẫu QPPL ánh xạ số/ký hiệu, hình thức, người ký, chức danh, ngày ban hành, ngày hiệu lực/hết hiệu lực, trích yếu, toàn văn, cơ quan, lĩnh vực và tệp. Mẫu CĐĐH cần được rà riêng từng trường trước khi dùng. Một số trường QPPL dùng giá trị cố định, ví dụ ngôn ngữ/trạng thái/lớp văn bản; không thể suy ra những giá trị đó phù hợp toàn bộ dữ liệu nguồn. Cấu hình mapping chứng minh có file cho hai nhóm trong repository, nhưng không giải quyết nghi vấn về xuất xứ `/KND/...` so với hệ thống được nêu ở [B0738.R012].

### 4.1 Quy trình và logic dữ liệu

Trước nạp hồ sơ chính, nạp danh mục loại/hình thức, cơ quan, lĩnh vực, lớp văn bản và ngôn ngữ. Lập bảng alias mã cơ quan nguồn–đích và xử lý cơ quan đổi tên/sáp nhập theo quyết định nghiệp vụ. Với mỗi văn bản, lưu khóa truy nguyên, loại văn bản, số/ký hiệu, trích yếu, nội dung/toàn văn, cơ quan ban hành, người ký/chức danh, ngày ban hành, ngày có hiệu lực, ngày hết hiệu lực, trạng thái, phạm vi ngôn ngữ, quan hệ văn bản liên quan và danh sách tệp.

Đây là mô hình logic đích dự kiến, không yêu cầu nguồn có đúng các tên trường này. Các quy tắc cần xác nhận: số/ký hiệu được chuẩn hóa khoảng trắng nhưng giữ nguyên ký tự; ngày ban hành không được sau ngày hiệu lực nếu nghiệp vụ không cho phép; ngày hết hiệu lực không trước ngày có hiệu lực; trường không có giá trị giữ null thay vì tạo ngày mặc định; trạng thái hiệu lực được xác định theo dữ liệu/điều khoản nguồn và không tự tính lại nếu có văn bản đính chính hoặc trạng thái thủ công; QPPL/CĐĐH phải giữ phân loại riêng; quan hệ nhiều-nhiều dùng bảng liên kết và kiểm tra không trùng.

| Nhóm logic | Quy tắc đối soát |
|---|---|
| Nhận dạng | Khóa nguồn duy nhất; số/ký hiệu trùng được báo cáo, không tự gộp. |
| Ngày và hiệu lực | Kiểm tra định dạng, múi giờ, thứ tự; lập danh sách ngoại lệ để đầu mối văn bản quyết định. |
| Cơ quan/lĩnh vực | So mã và tên hiển thị; lookup thiếu không được thay bằng giá trị mặc định khi chưa duyệt. |
| Tệp | Đếm tệp theo hồ sơ, kiểm checksum, mở thử PDF/doc theo chính sách quét; xác nhận link tải. |
| Trạng thái và quan hệ | So lớp QPPL/CĐĐH, tình trạng công khai, văn bản sửa đổi/thay thế/liên quan. |

### 4.2 Xử lý lỗi và nghiệm thu

Hồ sơ có ngày sai, danh mục chưa ánh xạ, thiếu toàn văn, nhiều số/ký hiệu tương tự, tệp hỏng hoặc lookup không tồn tại sẽ được cách ly trong danh sách ngoại lệ. Không tự sửa hiệu lực pháp lý bằng suy luận từ ngày hiện tại. Lỗi SQL/timeout retry theo lô nhỏ; lookup/tệp thất bại retry sau khi phụ thuộc được xử lý. Các cập nhật giữ nguyên khóa nguồn để chạy lại không nhân đôi.

Nghiệm thu gồm đối chiếu số lượng QPPL/CĐĐH theo năm và trạng thái; chọn mẫu có nhiều cơ quan/lĩnh vực/tệp; so số/ký hiệu, trích yếu, ngày, trạng thái và quan hệ; kiểm tra tải tệp; xác nhận không trộn loại; thử ngoại lệ ngày bất hợp lý và danh mục thiếu. Bàn giao danh sách khác biệt, lý do, quyết định nghiệp vụ và biên bản xác nhận.

## 5. Hạng mục 12 — Chuyển đổi dữ liệu Chuyên trang Bộ trưởng

**Yêu cầu:** [B0738.R015], cùng phân hệ nâng cấp [B0738.R022], [B0742.R030–R031], [B0746.R015]. Mục tiêu là nội dung thuộc Chuyên trang Bộ trưởng; phạm vi banner/menu/cấu hình được khảo sát riêng với nội dung bài.

**Dấu vết hiện trạng:** Có mapping `02.1.BoTruong_DanhMuc_ChuyenMuc.json` và `02.2.BoTruong_TinTuc_TinTuc.json`: cả hai khai báo `/knd/tt`, list danh mục `DanhmucTDKT` và list bài `Tin trang bộ trưởng`. Có frontend chuyên trang và phân hệ quản trị tổng quát. Đây là cấu hình trong repository, không chứng minh `/knd/tt` là hệ nguồn được yêu cầu tại [B0738.R012], mapping đầy đủ cho phạm vi hiện tại, hay banner/menu/URL đã được chuyển. Trước khi chạy cho dự án, cần xác nhận nguồn thực tế và lập biên bản tái sử dụng, điều chỉnh hoặc thay mapping.

### 5.1 Phạm vi và mapping đề xuất

Kiểm kê riêng các loại nội dung: tin/bài, bài phát biểu/chỉ đạo nếu có, danh mục, menu, banner, ảnh, tệp, khối hiển thị, ngôn ngữ, trạng thái và metadata SEO. Mỗi bản ghi gắn với định danh chuyên trang để không nhập lẫn vào danh mục tin chung. Nếu nguồn có cấu hình thứ tự ưu tiên, vị trí hiển thị hoặc ngày bắt đầu/kết thúc banner, bảo toàn các giá trị sau khi xác minh ý nghĩa. Liên kết nội bộ được đổi sang URL canonical mới qua bảng URL (hạng mục 15), không thay mọi URL bằng phép thay chuỗi tùy tiện.

Mapping minh họa (không đại diện schema thực): `ArticleKey→Migrate_Source`; `Title→TieuDe`; `SectionKey→IDChuyenMuc`; `DisplayDate→NgayXuatBan`; `HeroImage→AnhDaiDien`; `AttachmentSet→FilesDinhKem`; `PortalCode→MaChuyenTrang`; `MenuNode/SortOrder→cấu hình điều hướng`. Với trường không có đích tương ứng, quyết định lưu metadata, chuyển thành nội dung, bỏ có biên bản hay bổ sung chức năng. Không biến banner thành tin hoặc ngược lại nếu chưa có duyệt.

### 5.2 Thực thi, lỗi và nghiệm thu

Chuyển danh mục/menu trước bài; sau đó chuyển bài và media, cuối cùng gắn banner, liên kết và cấu hình trang. Kiểm thử bằng tài khoản vai trò nội dung và trình duyệt công khai. Lỗi thường gặp: menu mồ côi, danh mục trùng tên khác mã, ảnh ngoài kho, lịch banner hết hạn, link trỏ về site cũ, quyền xem sai hoặc bài Bộ trưởng xuất hiện tại nơi không mong muốn. Tạm dừng phát hành nếu phát hiện rò rỉ phạm vi hoặc nội dung chưa được phép công khai.

Nghiệm thu theo số lượng bài/danh mục, ngày và trạng thái; mở trang chủ/danh sách/chi tiết chuyên trang; kiểm tra ảnh/banner, thứ tự, menu, link, tệp, responsive; kiểm tra cùng bản ghi không xuất hiện nhầm trên trang khác. Đại diện nội dung xác nhận mẫu và ngoại lệ trước công bố.

## 6. Hạng mục 13 — Chuyển đổi dữ liệu Đảng bộ Bộ Nội vụ

**Yêu cầu:** [B0738.R016], bổ trợ phân hệ [B0738.R023], [B0742.R032–R033], [B0746.R016]. Cần xác nhận rõ nguồn và danh mục Đảng bộ; không đồng nhất với Nghị quyết TW4 chỉ vì mã nguồn có mapping cho trang Nghị quyết.

**Dấu vết hiện trạng:** Có mapping `04.1.NghiQuyetTW4_DanhMuc_ChuyenMuc.json` và `04.2.NghiQuyetTW4_TinTuc_TinTuc.json`, nhưng không phải bằng chứng mapping cho dữ liệu Đảng bộ Bộ Nội vụ. Ma trận hiện trạng cũng ghi chưa thấy mapping riêng được xác định cho trang Đảng bộ. Vì vậy, hạng mục này cần khảo sát và chốt phạm vi trước khi lập mapping chính thức.

### 6.1 Khảo sát và mapping

Chủ đầu tư xác nhận site/list nguồn, nội dung thuộc Đảng bộ, danh mục, loại bài, hồ sơ/media, quan hệ menu/banner và trạng thái công khai. Tạo không gian tên/miền riêng ở đích hoặc thuộc tính phân loại đã duyệt; tránh nhập vào chuyên trang khác. Mapping logic có thể gồm khóa nguồn, tiêu đề, nội dung, ngày, tác giả/nguồn, danh mục, loại nội dung, ảnh, tệp, trạng thái, ngôn ngữ, liên kết và metadata hiển thị. Đây là ví dụ khái niệm, không phải schema nguồn.

Trước chuyển dữ liệu, lập bảng phân loại tập nào thuộc Đảng bộ, tập nào thuộc Nghị quyết TW4 và tập nào nằm ngoài phạm vi. Các bản ghi có vẻ trùng nội dung nhưng khác khóa cần được đối chiếu nghiệp vụ; không tự khử trùng. Tệp ảnh và văn bản gắn quan hệ đúng hồ sơ. Mọi alias danh mục được phê duyệt và lưu kèm phiên bản.

### 6.2 Kiểm soát và nghiệm thu

Chạy thử trên bản sao riêng, đối chiếu số liệu theo danh mục/ngày/trạng thái, kiểm tra mẫu liên kết nhiều tầng và tệp. Kiểm tra quyền: người biên tập đúng chuyên trang sửa được, người ngoài quyền không thay đổi được, nội dung chưa duyệt không công khai. Các lỗi phân loại, không rõ nguồn gốc, thiếu tệp, xung đột URL hoặc nội dung nhạy cảm được cách ly cho đầu mối Đảng bộ quyết định.

Nghiệm thu cần xác nhận bằng danh mục nguồn/phạm vi đã ký, báo cáo đối soát, danh sách ngoại lệ đã quyết định, kiểm tra giao diện chuyên trang, URL và media. Không kết luận hoàn tất dựa trên route hoặc mapping Nghị quyết TW4.

## 7. Hạng mục 14 — Chuyển đổi dữ liệu đa phương tiện

**Yêu cầu:** [B0738.R017], liên hệ quản lý đa phương tiện [B0738.R024], [B0742.R034–R035], [B0746.R017]. Bao gồm dữ liệu album/metadata và nội dung tệp; xác định riêng ảnh, video, audio và nguồn nhúng.

**Dấu vết hiện trạng:** Công cụ có các mapping `09.1/09.2` cho infographic, cùng mapping media khác; API/UI có quản trị album. Migration xử lý attachment SharePoint và liên kết bảng file. Không thể từ các dấu vết đó kết luận mọi video/audio hoặc URL nhúng được tải/chuyển đủ.

### 7.1 Lập manifest và chuyển tệp

Trước khi sao chép nhị phân, tạo manifest: ID album, ID media, loại MIME, tên gốc, tên lưu đích, byte, checksum nguồn/đích, thumbnail, thứ tự, ngày, danh mục, mô tả/alt text, quyền truy cập và URI nguồn. Không lấy phần mở rộng làm căn cứ duy nhất về loại tệp. Quét tệp theo cơ chế ATTT được duyệt; cách ly tệp nghi vấn. Tệp ngoài quyền sử dụng hoặc bị hạn chế được đánh dấu chờ quyết định.

Chuyển metadata trước hoặc theo giao dịch có khả năng tiếp tục; đưa tệp vào kho đích theo tên/định danh an toàn, giữ quan hệ album-media. Có thể dùng batch song song có giới hạn, giới hạn kích thước và checksum sau truyền. Tệp lỗi truyền có thể retry theo chunk hoặc truyền lại; trước khi gắn quan hệ phải xác nhận tệp tồn tại và checksum đúng. Với video/audio nhúng từ bên ngoài, giữ URI đã được duyệt, kiểm tra quyền truy cập/HTTPS và quy định CSP; không tải về hoặc phát lại trái quyền.

### 7.2 Lỗi và nghiệm thu

Lỗi gồm tệp thiếu/không đọc được, checksum khác, MIME không khớp, tên xung đột, thumbnail không có, codec không tương thích, link ngoài chết, danh mục không tồn tại hoặc dung lượng kho vượt ngưỡng. Không thay tệp hỏng bằng tệp trống. Hàng đợi ngoại lệ lưu ID nguồn, mã lỗi, bước lỗi và hành động tiếp theo.

Nghiệm thu đối chiếu tổng album/media/tệp/byte theo loại; kiểm checksum toàn bộ hoặc mẫu theo phương án duyệt; mở ảnh, phát media, kiểm thumbnail/thứ tự/mô tả; truy cập URL nhúng; kiểm liên kết trên giao diện và phân quyền. Biên bản nêu rõ các định dạng không hỗ trợ và quyết định xử lý.

## 8. Hạng mục 15 — Chuyển đường dẫn cũ sang đường dẫn mới

**Yêu cầu:** [B0738.R018]. Mục tiêu là duy trì khả năng truy cập từ các URL cũ; phương thức HTTP redirect và thời hạn lưu chuyển hướng cần thống nhất.

**Dấu vết hiện trạng:** Trong các điểm mã nguồn đã rà soát chưa thấy bảng ánh xạ URL cũ–mới hay tập cấu hình chuyển hướng đầy đủ. Vì vậy, triển khai này cần được thiết kế, nhập liệu và kiểm chứng riêng.

### 8.1 Tạo bảng ánh xạ và quy tắc phân giải

Thu thập URL từ sitemap, log truy cập được phép, nội dung liên kết, bookmark/hệ thống tích hợp và danh mục nguồn. Chuẩn hóa scheme/host, chữ hoa-thường theo quy tắc máy chủ, dấu slash, query string và mã hóa tiếng Việt; không bỏ query có ý nghĩa. Lưu tối thiểu: URL cũ chuẩn hóa, URL nguồn nguyên gốc, loại đối tượng, ID nguồn, URL đích canonical, trạng thái, mã redirect, lý do/ngoại lệ, phiên bản mapping, người duyệt và thời hạn xem xét.

Quy tắc ưu tiên: khớp URL đầy đủ; khớp mẫu có biến đã được kiểm thử; giải quyết alias đã duyệt; nếu không tìm thấy đối tượng thì trả 404 thân thiện hoặc trang tìm kiếm theo quyết định, không đưa mọi URL lỗi về trang chủ. Tránh vòng lặp, chuỗi redirect dài, open redirect và chuyển URL độc hại. Redirect dùng 301 chỉ khi URL đích đã được xác nhận ổn định; giai đoạn chạy thử có thể dùng 302/307 theo thiết kế để dễ quay lui. Query tracking được giữ/bỏ theo quy tắc được duyệt.

### 8.2 Vòng đời và cutover

Nhập bảng ánh xạ ở môi trường thử; kiểm tra mã trạng thái, đích chính xác, canonical, redirect chain, URL mã hóa, trang không tồn tại và vòng lặp. Trước cutover chụp bản sao cấu hình; công bố từng nhóm URL; theo dõi 404, 5xx, đích redirect và tỷ lệ truy cập. Có thể quay lại cấu hình trước trong cửa sổ thay đổi. Sau ổn định, duy trì báo cáo link lỗi và quy trình cập nhật mapping có người duyệt.

**Ca nghiệm thu:** bộ mẫu từng nhóm tin, văn bản, album và trang chuyên đề; URL có dấu, query, slash dư, URL trùng đích, không tồn tại, URL độc hại, redirect chain và đích canonical; chứng cứ là danh sách test, kết quả HTTP, log đã khử thông tin người dùng và biên bản chấp thuận.

## 9. Cutover, đồng bộ cuối và quay lui dữ liệu

### 9.1 Kế hoạch cutover đề xuất

Cutover được thực hiện theo cửa sổ đã công bố, người chỉ huy thay đổi và checklist được duyệt. Trình tự khuyến nghị:

1. Chốt bản phát hành và phiên bản mapping; xác nhận thời gian, liên lạc, vai trò và điều kiện dừng.
2. Xác nhận backup trước cutover, khả năng đọc/khôi phục và dung lượng. Ghi nhận ID/đường dẫn backup, checksum, thời gian hoàn tất và người xác minh.
3. Đóng hoặc giới hạn ghi tại nguồn theo thống nhất; ghi thời điểm freeze. Nếu không thể dừng ghi, chạy delta cuối có watermark và quy tắc xử lý xung đột.
4. Nạp thay đổi cuối, tệp và URL; đối soát số liệu trọng yếu; chạy smoke check danh sách, chi tiết, tìm kiếm, đăng nhập quản trị và tải tệp.
5. Quyết định go/no-go bởi người có thẩm quyền; chuyển DNS/route/canonical hoặc bật cấu hình theo runbook; ghi thời điểm bắt đầu phục vụ.
6. Theo dõi lỗi, truy cập, hàng đợi và phản hồi nghiệp vụ trong cửa sổ ổn định; đóng băng các thay đổi không liên quan.
7. Lập biên bản, lưu log, chốt sai khác và kế hoạch xử lý tồn đọng.

**[FIG:cutover]**

### 9.2 Điều kiện dừng và quay lui

Điều kiện go/no-go cần định lượng trước: lỗi 5xx/đăng nhập; sai số lượng vượt dung sai; tệp quan trọng không truy cập; URL trọng yếu sai đích; lỗi phân quyền; không đạt smoke test; backup không kiểm chứng; vượt cửa sổ thay đổi. Khi điều kiện dừng xảy ra, người chỉ huy dừng ghi mới hoặc cô lập chức năng bị ảnh hưởng, bảo toàn log/bản sao, thông báo đầu mối và chọn quay lại route/cấu hình cũ hoặc phục hồi dữ liệu theo runbook.

Quay lui không đồng nghĩa tự động xóa dữ liệu đích. Nếu đích đã nhận nội dung mới sau cutover, cần quyết định bảo toàn, xuất ngược hoặc cô lập các thay đổi phát sinh; không ghi đè để đưa dữ liệu về một thời điểm cũ mà không có chủ sở hữu nghiệp vụ. Trình tự phục hồi xác định phiên bản DB, kho tệp, cấu hình, URL và phụ thuộc. Sau rollback, xác minh tính nhất quán và thông báo trạng thái dịch vụ.

### 9.3 RPO/RTO và bằng chứng

HSYC quy định RPO ≤4 giờ và RTO ≤4 giờ cho dịch vụ trọng yếu [B0756]. RPO đo chênh lệch giữa thời điểm sự cố và điểm dữ liệu gần nhất có thể khôi phục; RTO đo từ thời điểm tuyên bố sự cố đến lúc dịch vụ đạt tiêu chí hoạt động đã định. Cả hai phải đo qua diễn tập trên topology/hạ tầng được cấp, không suy ra từ sự tồn tại của nút backup hoặc giao diện tạo `.bak`. Bằng chứng ghi mốc thời gian, tập dữ liệu, bước chạy, sai khác, kết quả kiểm tra ứng dụng và thời điểm khôi phục đọc/ghi.

## 10. Hạng mục 25 — Xác thực hai bước Authenticator

**Yêu cầu:** [B0738.R029], [B0742.R043–R044], [B0746.R022]; đối chiếu chính sách xác thực [B0802.R003–R017]. Người dùng đăng ký, xác minh, bật/tắt và reset 2FA; khi tài khoản bật thì đăng nhập cần OTP. Google Authenticator là ứng dụng tham chiếu theo HSYC.

**Dấu vết hiện trạng:** `HomeController.cs` có `GenerateAuthenticateSecret`, tạo secret, sinh setup URI/QR và mã nhập tay; `UpdateProfile` kiểm tra PIN trước khi thay đổi `IsTwoFA`. `SimpleAuthorizationServerProvider.cs` cũng kiểm tra OTP khi mật khẩu hợp lệ và `IsTwoFA == 1`; provider có bộ đếm thử sai mật khẩu trong cache. `Startup.cs` loại `Authenticator_Secret` khỏi JSON serialization; các endpoint danh sách tài khoản đã rà soát chỉ chọn một số trường và không trả secret. Tuy vậy, model quản trị frontend `api/Models/User_Account.js` có khai báo trường `Authenticator_Secret`, cần kiểm tra đường ghi/cấu hình trường này và loại bỏ mọi khả năng quản trị tùy ý. Chưa thấy bằng chứng đủ về mã hóa secret lưu DB, hạn mức thử OTP riêng, reset có kiểm soát, thu hồi phiên sau reset, log kiểm toán 2FA hoặc kiểm thử an toàn. Các điểm đó cần hoàn thiện/xác minh trước khi kết luận; dấu vết mã không phải bằng chứng đã nghiệm thu.

### 10.1 Vòng đời 2FA đề xuất

**Chưa đăng ký → Đang thiết lập → Đã xác minh/chờ bật → Đang bật → Tạm khóa hoặc cần reset → Đã tắt/đăng ký lại.** Secret chỉ có hiệu lực cho đúng tài khoản và chỉ sau xác minh OTP. QR setup là dữ liệu bí mật tạm thời: chỉ hiển thị cho đúng người dùng qua phiên đã xác thực, không cache công khai, không ghi vào log/analytics, không gửi email, không cho tải lại sau khi thiết lập kết thúc. Nếu chưa hoàn tất đăng ký trong thời hạn chính sách, hủy secret tạm và tạo secret mới.

1. Người dùng đã đăng nhập truy cập trang bảo mật; hệ thống yêu cầu xác thực lại bằng mật khẩu hoặc yếu tố hiện có theo chính sách.
2. Hệ thống tạo secret bằng bộ sinh số ngẫu nhiên mật mã; ràng buộc với issuer, định danh tài khoản và thuật toán/thời gian OTP đã thống nhất.
3. Hệ thống trả QR enrollment và mã nhập tay một lần qua kênh TLS; hiển thị cảnh báo không chia sẻ mã. QR chứa secret nên được bảo vệ như mật khẩu.
4. Người dùng quét bằng ứng dụng Authenticator và gửi OTP hiện tại. Server kiểm tra định dạng, cửa sổ thời gian sai lệch nhỏ được duyệt, chưa vượt hạn mức và secret thuộc đúng tài khoản.
5. Chỉ khi OTP hợp lệ mới bật 2FA; ghi thời điểm, actor và kết quả, không ghi OTP/secret. Thông báo người dùng về thay đổi bảo mật.
6. Khi đăng nhập, mật khẩu hợp lệ tạo trạng thái xác thực tạm; nếu 2FA bật, chưa cấp session/token đầy đủ trước khi OTP hợp lệ. OTP sai/hết hạn trả thông báo chung, tăng bộ đếm và áp dụng throttle/khóa tạm theo chính sách.

**[FIG:2fa]**

### 10.2 Tắt, reset, mất thiết bị và khôi phục quyền

Người dùng tự tắt 2FA phải chứng minh yếu tố hiện có (OTP hoặc quy trình dự phòng được phê duyệt) và xác thực lại; không chấp nhận thao tác chỉ dựa vào phiên web kéo dài. Reset bởi quản trị viên là quyền đặc biệt, giới hạn cho role được chỉ định, yêu cầu lý do/ticket, xác nhận danh tính theo quy trình Chủ đầu tư, ghi log bất biến và thông báo người dùng qua kênh độc lập khi có thể. Nhân viên hỗ trợ không được xem secret hoặc OTP. Sau reset, secret cũ bị vô hiệu ngay; người dùng buộc đăng ký lại, và session/token hiện hữu được thu hồi hoặc đánh dấu cần xác thực lại theo chính sách.

Nếu tài khoản bị khóa, đổi đơn vị hoặc nghỉ việc, việc thu hồi 2FA không được dùng để vượt qua quy trình khóa danh tính AD/SSO. Tài khoản dịch vụ không tương tác phải có ngoại lệ được phê duyệt, giới hạn mạng/quyền và phương án xác thực riêng; không tự bật OTP tương tác cho tác vụ nền.

### 10.3 Lưu trữ, lỗi và phân quyền

Secret không được lưu plaintext nếu thiết kế có thể tránh; đề xuất mã hóa có xác thực bằng khóa quản lý ngoài DB, phân quyền giải mã tối thiểu, luân chuyển khóa có kế hoạch. Nếu thư viện/luồng hiện tại cần secret để xác minh OTP, phải chứng minh cơ chế bảo vệ ở lớp lưu trữ và backup. Không đưa secret vào API response ngoài luồng enrollment, lỗi, log, telemetry hoặc dữ liệu client lâu dài. Ràng buộc endpoint chỉ cho chủ tài khoản; mọi endpoint admin reset yêu cầu quyền riêng; xác thực và kiểm quyền ở server, không dựa vào ẩn nút UI.

Lỗi dự kiến: QR/OTP sai, mã hết hạn, lệch đồng hồ, đăng ký đồng thời, secret không còn, thử sai nhiều lần, đổi thiết bị, mất mạng, reset trái quyền, CSRF/replay. Hệ thống trả mã lỗi nhất quán, không tiết lộ người dùng có bật 2FA hay không cho đối tượng chưa xác thực, giới hạn tốc độ, chống replay nếu thư viện hỗ trợ và đồng bộ giờ hệ thống. Retry OTP chỉ do người dùng nhập mã kế tiếp; không retry tự động gửi cùng mã.

### 10.4 Ca nghiệm thu

- Bật 2FA: QR đúng issuer/tài khoản, OTP hợp lệ bật thành công; mã sai/hết hạn không bật.
- Đăng nhập: tài khoản bật yêu cầu OTP; OTP hợp lệ cấp phiên; OTP sai/thiếu không cấp phiên; tài khoản chưa bật theo đúng chính sách hiện hành.
- Tắt: OTP/mật khẩu theo chính sách; thao tác không đủ yếu tố bị từ chối; log có actor/thời điểm nhưng không có bí mật.
- Reset: role không đủ quyền bị từ chối; role được cấp thực hiện theo ticket/lý do; secret cũ mất hiệu lực, người dùng được yêu cầu enrollment lại và nhận thông báo.
- Bảo mật: thử gọi endpoint trực tiếp từ tài khoản khác, token hết hạn, CSRF và vượt hạn mức; xác nhận giới hạn tốc độ, thu hồi phiên khi áp dụng, secret không rò trong response/log/backup truy cập trái quyền.

## 11. Hạng mục 26 — Sinh mã QR

**Yêu cầu:** [B0738.R030], [B0742.R045–R046], [B0746.R023]. QR dùng cho enrollment 2FA và cho trang chi tiết tin/văn bản để truy cập nhanh. Hai loại QR có mức nhạy cảm khác nhau.

### 11.1 QR enrollment 2FA: QR mang bí mật

QR enrollment chứa URI otpauth có secret; phải cấp riêng theo phiên đã xác thực, qua TLS, không đặt trong URL công khai, không cache proxy/CDN, không nhúng vào log/screenshot hỗ trợ, và không lưu analytics. Nếu người dùng yêu cầu làm mới, vô hiệu secret cũ trước hoặc cùng giao dịch tạo secret mới. QR chỉ hiển thị trong bước thiết lập; sau khi bật, màn hình không tái hiện lại QR/secret. Mã nhập tay có cùng độ nhạy như QR. Thông tin trả về tối thiểu, chống nhúng chéo nguồn và tránh lưu lâu ở browser storage.

**[FIG:qr]**

### 11.2 QR nội dung công khai: QR trỏ URL canonical

QR cho tin/văn bản chỉ mã hóa URL HTTPS canonical, không chứa ID nội bộ nhạy cảm, access token, query có dữ liệu cá nhân hay URL chưa chuẩn hóa. Dịch vụ sinh QR lấy canonical URL từ dữ liệu đã xuất bản; nội dung nháp/ẩn không phát QR công khai hoặc trả trạng thái phù hợp. Nếu URL thay đổi, quy tắc redirect hạng mục 15 giữ khả năng quét QR đã in. Có thể cache ảnh QR công khai theo phiên bản URL và nội dung; cache phải xóa/vô hiệu khi URL thay đổi.

Không xây URL từ header `Host` không tin cậy; dùng cấu hình domain chuẩn theo môi trường để ngăn host-header injection. Thư viện sinh ảnh phải giới hạn kích thước, định dạng và lỗi; QR có nhãn thay thế/URL chữ cho khả năng tiếp cận. Người dùng cần kiểm tra QR bằng ít nhất hai ứng dụng/thiết bị trên môi trường thử.

### 11.3 Lỗi và ca nghiệm thu

Ca thử gồm QR enrollment quét được và OTP hoạt động; QR enrollment không thể lấy khi chưa xác thực/đã bật 2FA; cache/CDN không lưu QR bí mật; QR tin/văn bản dẫn đến đúng URL canonical; bản ghi nháp không lộ; URL chứa dấu/query được encode chuẩn; đổi URL vẫn xử lý qua redirect; QR không sử dụng host giả; ảnh QR đọc được ở kích thước/độ tương phản được duyệt. Tách rõ biên bản kiểm tra QR bí mật và QR công khai.

## 12. Hạng mục 27 — Sao lưu tự động, tải và phục hồi

**Yêu cầu:** [B0738.R031], [B0742.R047–R048], [B0746.R024]; mục tiêu phục hồi [B0756], yêu cầu backup trong nhóm ATTT [B0802]. HSYC yêu cầu thao tác backup thủ công, tải file và cấu hình lịch tự động. Phục hồi cần được thiết kế và diễn tập dù giao diện hiện trạng chưa chứng minh đầy đủ chức năng restore.

**Dấu vết hiện trạng:** `BackUpsController` có `[PermissionAuthorize("manage-backup")]`, liệt kê file trong `Upload/BackUp`, tạo full backup SQL Server và download `.bak` sau kiểm tra path/extension. Giao diện `BackUp.js` gọi thao tác tạo và tải. Điểm mã rà soát chưa cho thấy lịch tự động, retention, checksum/kiểm tra restore, kho tách biệt hoặc luồng phục hồi. Có chi tiết cần xác minh trước vận hành: đường dẫn tạo backup được dựng trong code và cần đối chiếu với nơi liệt kê/tải; tên DB cấu hình cần quản lý theo môi trường, không hard-code sai môi trường. Đây là các điểm rà soát, không kết luận sự cố vận hành.

### 12.1 Phạm vi và lịch backup đề xuất

Backup cần bao phủ nhất quán SQL Server, tệp upload/media, cấu hình ứng dụng, cấu hình tích hợp, chứng thư/khóa theo cơ chế escrow được Chủ đầu tư cho phép, và tài liệu cần cho khôi phục. Secret không được lưu cùng bản sao mà thiếu mã hóa/quyền kiểm soát. Chủ đầu tư/DBA duyệt loại full/differential/log hoặc snapshot tương đương, tần suất, cửa sổ, retention, vị trí lưu, mã hóa, khóa, người nhận cảnh báo và dung lượng. Lịch phải bảo đảm điểm khôi phục đáp ứng RPO ≤4 giờ; cần tính cả thời gian sao lưu, sao chép, xác nhận và độ trễ đồng bộ.

Tác vụ scheduler ghi run ID, loại backup, nguồn, thời gian bắt đầu/kết thúc, điểm DB (LSN hoặc thông tin tương đương), kích thước, checksum, vị trí, phiên bản cấu hình, trạng thái, lỗi và số lần thử. Tạo backup theo cơ chế nhất quán; phối hợp chụp tệp và DB để không tạo snapshot lệch thời điểm. File chỉ chuyển trạng thái “đã xác nhận” sau khi kiểm integrity và bản sao được sao chép thành công tới vùng lưu được duyệt.

**[FIG:backup-restore]**

### 12.2 Retry, retention và kiểm soát tải file

Scheduler chống chạy trùng cùng cửa sổ, có khóa phân tán hoặc cơ chế lease; timeout theo loại backup, retry có backoff và giới hạn, không ghi đè bản sao hợp lệ bằng bản chạy lỗi. Thất bại cuối cùng kích hoạt cảnh báo; vận hành có thể khởi chạy lại với mã tương quan và lý do. Retention xóa theo chính sách đã duyệt sau khi xác nhận có bản thay thế hợp lệ; thao tác xóa được log và không làm mất bản cuối cùng có thể khôi phục.

Quyền tạo, xem metadata, tải, xóa và restore tách biệt theo nguyên tắc tối thiểu. Download kiểm tra canonical path trong thư mục được cho phép, quyền người gọi, loại file, kích thước và ghi audit; không nhận đường dẫn tùy ý từ client. File backup là dữ liệu nhạy cảm: truyền qua kênh an toàn, mã hóa at-rest, giới hạn thời gian link, không lưu vào thư mục web công khai. Bản tải về không được ghi tên người dùng/path nội bộ không cần thiết.

### 12.3 Khôi phục và diễn tập

Runbook restore xác định người phê duyệt, môi trường cô lập, thứ tự DB→tệp→cấu hình→dịch vụ, kiểm tra malware/integrity, tài khoản phục hồi, cấu hình connection string, version compatibility, kiểm tra nghiệp vụ và quyết định chuyển traffic. Thực hiện restore trước tiên trên môi trường thử được kiểm soát; không ghi đè production bằng thao tác UI không xác nhận. Sau restore, xác minh số bảng/bản ghi trọng yếu, đăng nhập thử, đọc nội dung, mở tệp, kiểm tra liên kết và ghi nhận thời gian từng bước.

Diễn tập ít nhất theo kế hoạch được phê duyệt cho một tình huống dịch vụ trọng yếu; đo RPO/RTO thực tế so ngưỡng ≤4 giờ, ghi sự khác biệt và hành động khắc phục. Có thể dùng backup full cùng log/differential theo thiết kế; bản thân file `.bak` chưa chứng minh khôi phục thành công. Nếu diễn tập không đạt ngưỡng, báo cáo rõ kết quả và lập biện pháp cải thiện trước nghiệm thu.

### 12.4 Ca nghiệm thu

- Tạo backup thủ công với role hợp lệ; role không đủ quyền bị từ chối.
- Scheduler chạy đúng lịch đã duyệt; mô phỏng lỗi SQL, hết dung lượng, mất kết nối kho và timeout; quan sát retry hữu hạn, trạng thái cuối và cảnh báo.
- Kiểm tra tên, metadata, checksum, kích thước, retention, quyền tải; thử path traversal/đuôi file sai và truy cập trái quyền.
- Khôi phục bản backup vào môi trường thử; mở DB/tệp và chạy smoke test; lập biên bản số liệu và thời gian.
- Đo khoảng cách điểm dữ liệu khôi phục và thời gian phục hồi; chỉ xác nhận đạt RPO/RTO khi đo thực tế không quá 4 giờ.

## 13. Hạng mục 28 — Cảnh báo hệ thống và thông báo nội bộ

**Yêu cầu:** [B0738.R032], [B0742.R049–R050], [B0746.R025]. Phạm vi gồm thông báo nội bộ, lỗi API, đăng nhập bất thường và email. Cảnh báo là luồng vận hành, không thay thế nhật ký kiểm toán.

**Dấu vết hiện trạng:** Có UI/thực thể thông báo và API `ThongBaosController`; điểm rà soát chưa đủ để kết luận cảnh báo lỗi API, đăng nhập bất thường, email có retry/dedup đã triển khai. Những hành vi dưới đây là đề xuất thiết kế.

### 13.1 Danh mục sự kiện và phân loại

Chuẩn hóa loại sự kiện: API lỗi theo endpoint/nhóm lỗi; dịch vụ phụ thuộc mất kết nối; backup thất bại/không hoàn tất đúng lịch; đăng nhập thất bại vượt ngưỡng; đăng nhập từ nguồn/thiết bị bất thường theo chính sách; thay đổi/reset 2FA; thay đổi cấu hình/role; dung lượng gần ngưỡng; và thông báo nội bộ do người có quyền tạo. Không gửi email cho mọi lỗi đơn lẻ. Mức độ gồm thông tin, cảnh báo, nghiêm trọng; mỗi mức có ngưỡng, đối tượng nhận, thời gian gộp và SLA phản hồi được duyệt.

Sự kiện tối thiểu gồm `eventId`, `correlationId`, `eventType`, `severity`, thời điểm UTC và hiển thị theo timezone, nguồn dịch vụ, đối tượng đã che dữ liệu nhạy cảm, mã lỗi, số lần, ngữ cảnh an toàn, trạng thái gửi và liên kết runbook. Không ghi password, OTP, secret, bearer token, nội dung request nhạy cảm hoặc thông tin cá nhân vượt nhu cầu. Nhật ký bảo vệ khỏi sửa/xóa trái quyền; quyền xem thông báo không tự cấp quyền xử lý nguồn sự kiện.

### 13.2 Luồng tiếp nhận, dedup, gửi và retry

**[FIG:alert-flow]**

1. Thành phần ứng dụng phát sự kiện có schema/phiên bản, severity và correlation ID. API middleware ghi trạng thái lỗi và metric, loại trừ lỗi xác thực thông thường khỏi cảnh báo nghiêm trọng theo quy tắc đã duyệt.
2. Bộ đánh giá áp dụng điều kiện/ngưỡng theo cửa sổ thời gian. Ví dụ: gom các lỗi cùng service/endpoint/error code trong một khoảng cấu hình thay vì gửi từng request; ngưỡng thực tế cần được vận hành phê duyệt.
3. Dedupe tạo khóa từ loại sự kiện, dịch vụ, đối tượng đã chuẩn hóa và khoảng thời gian. Sự kiện lặp tăng bộ đếm và cập nhật `lastSeen`; cảnh báo mới chỉ phát lại sau cooldown hoặc khi severity tăng. Không gộp sự kiện của hai tài khoản/đối tượng khác nhau nếu điều đó làm mất ý nghĩa điều tra.
4. Tạo thông báo nội bộ và đưa thư vào outbox/hàng đợi bền vững trong giao dịch phù hợp. Trạng thái gồm pending, sending, sent, retryable failure, terminal failure, suppressed/deduplicated; lưu provider/message ID khi được phép.
5. Worker gửi email qua relay được Chủ đầu tư cấp, timeout và retry lỗi tạm thời theo backoff có jitter; lỗi địa chỉ/định dạng hoặc từ chối vĩnh viễn chuyển dead-letter, không retry vô hạn. Retry dùng idempotency key để tránh gửi trùng; khi trạng thái gửi không rõ, tra cứu provider nếu có trước khi phát lại.
6. Quản trị viên được phân quyền xem, xác nhận đã tiếp nhận, gán người xử lý và đóng cảnh báo với ghi chú. Đóng cảnh báo không xóa log gốc; cảnh báo tái diễn sau khi đóng tạo sự kiện mới có liên kết với sự kiện cũ.

### 13.3 Phát hiện bất thường và quản trị false positive

Ngưỡng đăng nhập bất thường cấu hình theo tài khoản/IP/thời gian và chính sách bảo vệ dữ liệu được duyệt. Ví dụ đề xuất: nhiều lần sai liên tiếp, đăng nhập sau chuỗi thất bại, thay đổi nguồn bất thường hoặc reset 2FA. Không coi một IP mới là bằng chứng xâm nhập; đánh giá false positive, mạng NAT/VPN và cách xử lý tài khoản dùng chung trước khi kích hoạt. Phản hồi cảnh báo không tiết lộ cho người chưa xác thực quy tắc phát hiện. Cơ chế khóa/tạm khóa đăng nhập phải phối hợp chính sách tài khoản và có khả năng mở khóa được kiểm soát.

### 13.4 Retry, bảo mật và nghiệm thu

Hàng đợi có giới hạn tuổi/lưu lượng, backpressure và cảnh báo khi backlog tăng. Email hỏng không chặn API công khai; sự cố nhà cung cấp không làm mất outbox. Retry không áp dụng cho lỗi cấu hình vĩnh viễn. Email chỉ gửi tối thiểu dữ liệu cần thiết và đường dẫn tới màn hình yêu cầu xác thực, không đính kèm secret/log nhạy cảm. Cấu hình SMTP/API key nằm trong kho secret ngoài mã nguồn; quyền sửa người nhận/ngưỡng hạn chế; thay đổi được audit.

Ca nghiệm thu: phát lỗi API giả lập đã duyệt và xác nhận ngưỡng/dedup; tạo chuỗi đăng nhập sai có kiểm soát, xác nhận cảnh báo và không lộ OTP/password; kiểm tra thông báo nội bộ theo role; mô phỏng mail relay timeout, lỗi 4xx/5xx, địa chỉ sai, hàng đợi đầy và phục hồi; xác nhận retry hữu hạn, không gửi trùng, dead-letter có thể xử lý, cảnh báo được đóng/gán và audit giữ nguyên. Bàn giao cấu hình đã khử bí mật, danh sách người nhận, ngưỡng, runbook và báo cáo kết quả.

## 14. Quan hệ với chỉ tiêu vận hành và tải

Các luồng chuyển đổi, backup, OTP và email không được làm suy giảm ngoài ngưỡng nghiệm thu khi Cổng phục vụ. HSYC nêu 500 phiên công khai đồng thời và 84 phiên động [B0804], sẵn sàng 99,9% theo tháng và yêu cầu xử lý lỗi/tái thử [B0751–B0755]. Kế hoạch kiểm chứng phải gồm tác vụ vận hành phù hợp, ví dụ tải trang công khai trong khi backup, OTP login đồng thời, cảnh báo burst và queue email; chạy migration nặng trong cửa sổ được duyệt hoặc trên hạ tầng tách biệt. Không đưa ra tuyên bố số đo trước khi có báo cáo kiểm thử/as-built.

Retry chỉ áp dụng cho thao tác idempotent hoặc có idempotency key; timeout, giới hạn thử, jitter và circuit breaker được cấu hình theo endpoint. Không retry vô hạn một thao tác ghi không rõ kết quả. Khi dịch vụ phụ trợ lỗi, ưu tiên giữ khả năng xem nội dung công khai, hiển thị thông báo phù hợp và ghi nhận tác vụ chờ xử lý. Tính sẵn sàng 99,9% được tính theo định nghĩa, khoảng loại trừ bảo trì và telemetry do hai bên phê duyệt.

## 15. Ma trận bàn giao và bằng chứng

| Phạm vi | Tài liệu/bằng chứng cần bàn giao | Người xác nhận chính |
|---|---|---|
| Tin, văn bản, Bộ trưởng, Đảng bộ, media | Inventory nguồn, schema đã duyệt, mapping version, manifest, log/lỗi, báo cáo đối soát, mẫu đầu ra và quyết định ngoại lệ. | Chủ sở hữu từng miền dữ liệu; quản trị Cổng. |
| URL và cutover | Bảng URL đã duyệt, bộ test HTTP, runbook go/no-go, backup trước thay đổi, thời gian freeze/cutover, báo cáo ổn định và rollback. | Đầu mối nội dung, hạ tầng và chỉ huy thay đổi. |
| 2FA và QR | Thiết kế luồng, ma trận quyền, cấu hình bảo vệ secret, test lifecycle, kiểm tra login/QR, audit mẫu đã khử bí mật. | Quản trị ATTT và chủ sở hữu tài khoản. |
| Backup/restore | Chính sách/lịch/retention, vị trí và quyền, kết quả integrity, runbook, biên bản restore, số đo RPO/RTO thực tế. | DBA, vận hành và Chủ đầu tư. |
| Cảnh báo | Event catalog, ngưỡng/dedup/cooldown, danh sách người nhận, cấu hình relay đã che secret, báo cáo retry/dead-letter và biên bản thử. | Vận hành, ATTT và chủ sở hữu ứng dụng. |

Tất cả báo cáo giữ mã lô/phiên bản, timestamp, môi trường và người thực hiện để truy nguyên. Dữ liệu minh chứng được lưu theo thời hạn và quyền truy cập do Chủ đầu tư phê duyệt. Chỉ biên bản kiểm thử/nghiệm thu có kết quả đo trên môi trường đã xác nhận mới là căn cứ kết luận đáp ứng; tài liệu đề xuất và mã nguồn riêng lẻ không thay thế xác nhận đó.

## 16. Tài liệu đối chiếu trong repository

- `docs/ho-so-dap-ung/09-ma-tran-29-hang-muc.md`: mô tả đề xuất, tiêu chí và hiện trạng tĩnh cho 29 hạng mục.
- `docs/ho-so-dap-ung/03-kien-truc-an-toan-van-hanh.md`: kiến trúc, tích hợp, ATTT, backup/DR, hiệu năng và nguyên tắc vận hành.
- `docs/ho-so-dap-ung/06-thuyet-minh-kien-truc.md`: thuyết minh kiến trúc tổng thể và phương án kỹ thuật.
- `docs/ho-so-dap-ung/nguon/HSYC-trich-xuat.txt`: [B0738.R013–R018], [B0742.R043–R050], [B0746.R022–R025], [B0751–B0756], [B0798–B0804].
- `migrate/MigrationTool/MigrationProcess.cs`, `SQLConnector.cs`, `SharePointConnector.cs`, `Mappings/*.json`: dấu vết công cụ chuyển đổi và một số mapping mẫu.
- `api/Controllers/API/HomeController.cs`, `api/OAuth/Startup.cs`, `api/Controllers/API/BackUpsController.cs`, `backend/src/pages/BackUp.js`, `backend/src/pages/ThongBao.js`: dấu vết xác thực, sao lưu và giao diện/thông báo cần xác minh theo luồng hoàn chỉnh.

**Ghi chú:** Các quy tắc chi tiết, trường logic và quy trình trong tài liệu này là phương án cần được rà soát theo dữ liệu thực tế, thiết kế được duyệt, quyền/hạ tầng được cấp và biên bản nghiệm thu. Không coi ví dụ mapping là trường dữ liệu thật của hệ thống nguồn; không coi ngưỡng HSYC là kết quả đã đo.
