# 16. Giải pháp chuyển đổi dữ liệu và vận hành bảo mật

## 1. Mục tiêu và phạm vi

Nhà thầu đề xuất thực hiện chuyển đổi, tích hợp dữ liệu giữa Cổng thông tin điện tử Bộ Nội vụ và Cổng thông tin điện tử Bộ Lao động – Thương binh và Xã hội; đồng thời bổ sung quy trình xác thực hai bước, sinh mã QR, sao lưu tự động và cảnh báo hệ thống. Phạm vi chuyển đổi gồm tin tức, văn bản, Chuyên trang Bộ trưởng, dữ liệu Đảng bộ Bộ Nội vụ, dữ liệu đa phương tiện và các đường dẫn cũ. Phạm vi bảo mật/vận hành gồm bật, xác minh, tắt và reset 2FA; QR enrollment và QR cho nội dung công khai; sao lưu thủ công/theo lịch, tải và khôi phục; thông báo nội bộ, cảnh báo lỗi API, đăng nhập bất thường và email.

Nhà thầu sẽ khảo sát, xây dựng mapping và quy trình chi tiết cùng Chủ đầu tư trước khi thực hiện trên dữ liệu thật. Tên trường, bảng và quy tắc trong tài liệu là mô hình logic đề xuất để các bên thống nhất; không hàm ý hai hệ thống đang dùng sẵn những tên trường này. Tập nguồn, schema, cách phân loại, số lượng, trạng thái và lịch sử dữ liệu sẽ được xác nhận bằng biên bản khảo sát.

Các mục tiêu vận hành phải được chứng minh bằng đo kiểm và diễn tập trên môi trường triển khai. Cụ thể: điểm khôi phục RPO không quá 04 giờ, thời gian phục hồi RTO không quá 04 giờ đối với dịch vụ trọng yếu; kiểm thử tối thiểu 500 phiên truy cập công khai đồng thời và 84 phiên tác vụ động/người dùng hoạt động đồng thời; độ sẵn sàng dịch vụ công khai tối thiểu 99,9% theo tháng, không tính thời gian bảo trì có kế hoạch đã thông báo. Đây là ngưỡng nghiệm thu, không phải số đo được khẳng định trước.

## 2. Quy trình quản trị chung cho chuyển đổi dữ liệu

### 2.1 Chuẩn bị phạm vi, vai trò và nguồn dữ liệu

Trước mỗi đợt chuyển đổi, Nhà thầu cùng Chủ đầu tư xác định người sở hữu dữ liệu, người quản trị nguồn, người quản trị đích, đầu mối hạ tầng/lưu trữ, đại diện nghiệp vụ từng miền, người phê duyệt mapping, người chứng kiến đối soát và người quyết định chuyển đổi chính thức. Các vai trò được ghi trong kế hoạch, kèm kênh liên lạc, thời gian phản hồi và quyền quyết định tạm dừng.

Hồ sơ đầu vào tối thiểu gồm:

- Danh mục site, thư viện, danh sách, hệ thống, kho tệp và nhóm URL nguồn được đưa vào phạm vi.
- Từ điển dữ liệu, kiểu dữ liệu, trường bắt buộc, mã danh mục, trạng thái, quan hệ, ngôn ngữ và múi giờ.
- Quy tắc nghiệp vụ về nội dung nháp/đã duyệt/đã xuất bản, hiệu lực văn bản, nội dung bị thu hồi, dữ liệu trùng và bản ghi lịch sử.
- Danh mục tệp, loại MIME, kích thước, quyền sử dụng, quy tắc quét an toàn, yêu cầu giữ tên gốc/metadata và kho lưu đích.
- Phương thức kết nối, danh tính tài khoản dịch vụ, quyền đọc/ghi tối thiểu, giới hạn tải và cơ chế lưu bí mật cấu hình.
- Thời điểm chụp baseline, kế hoạch dừng ghi hoặc đồng bộ delta, thời lượng cửa sổ thay đổi và tiêu chí dừng/go-no-go.

Nhà thầu chỉ sử dụng tài khoản dịch vụ được Chủ đầu tư cấp và phê duyệt. Thông tin xác thực không ghi trong gói bàn giao hoặc báo cáo; thông tin cấu hình nhạy cảm được lưu tại kho bí mật được duyệt. Quyền được giới hạn đúng nguồn, đích, thời gian và thao tác; sau khi kết thúc, tài khoản/quyền tạm được thu hồi hoặc điều chỉnh theo quyết định của Chủ đầu tư. Log và báo cáo được che thông tin xác thực, OTP, secret, token và dữ liệu cá nhân không cần thiết.

### 2.2 Mapping, phiên bản và khóa truy nguyên

Mỗi miền dữ liệu có mapping riêng được quản lý phiên bản. Mapping xác định rõ trường nguồn, trường logic đích, kiểu, quy tắc chuyển đổi, giá trị mặc định nếu có, quy tắc null, quy tắc chuyển mã, cách xử lý lookup, phụ thuộc danh mục, kiểm tra hợp lệ và xử lý lỗi. Giá trị mặc định chỉ được dùng khi nghiệp vụ phê duyệt và phải có dấu vết trong báo cáo.

Mỗi bản ghi đích được gắn khóa truy nguyên ổn định, được cấu thành từ định danh hệ nguồn, tập dữ liệu nguồn và ID bản ghi nguồn hoặc định danh tương đương. Bản ghi tệp và quan hệ nhiều-nhiều cũng có khóa truy nguyên hoặc quy tắc chống trùng. Một mã lô duy nhất gắn với lần chạy; mapping thay đổi phải tăng phiên bản. Chạy lại cùng dữ liệu và cùng mapping không sinh bản ghi trùng, không nhân đôi liên kết hoặc attachment.

### 2.3 Các trạng thái lô và cách xử lý lỗi

Lô chuyển theo các trạng thái: **Lập kế hoạch → Khảo sát → Mapping được duyệt → Chạy thử → Đối soát → Chấp thuận chính thức → Đồng bộ cuối → Cutover → Theo dõi ổn định → Đóng lô**. Có thể chuyển sang **Tạm dừng**, **Chờ xử lý ngoại lệ**, **Chạy lại có kiểm soát** hoặc **Quay lui**. Mỗi trạng thái ghi thời điểm, người thực hiện, phiên bản mapping, mã môi trường, phạm vi dữ liệu, số lượng dự kiến và liên kết biên bản.

Lỗi được phân loại thành lỗi dữ liệu, thiếu quan hệ, sai quy tắc mapping, lỗi quyền/kết nối, lỗi truyền tệp, lỗi hệ thống đích, timeout, trùng khóa hoặc lỗi nghiệp vụ cần quyết định. Bản ghi lỗi được giữ trong danh sách ngoại lệ với mã lỗi, khóa nguồn đã được che theo chính sách, bước lỗi, số lần thử và hướng xử lý. Không âm thầm bỏ bản ghi. Retry có giới hạn và backoff; chỉ áp dụng tự động với bước có thể lặp an toàn. Trường hợp kết quả ghi chưa rõ cần tra cứu khóa truy nguyên trước khi thử lại.

### 2.4 Đối soát và ngưỡng chấp nhận

Nhà thầu đối chiếu tổng số theo miền, năm, danh mục, ngôn ngữ và trạng thái; tập định danh nguồn; số liên kết/tệp; tổng byte; bản ghi thiếu trường bắt buộc; bản ghi trùng; lỗi quan hệ; và các ngoại lệ đã phân loại. Bộ mẫu kiểm tra có chủ đích gồm dữ liệu cũ/mới, tiêu đề tiếng Việt có dấu, nội dung dài, HTML, bản ghi không có tệp, nhiều tệp, nhiều quan hệ, URL cũ, ngày bất thường và trạng thái khác nhau.

Ngưỡng sai khác cho phép, nhóm dữ liệu được loại trừ và cách giải quyết từng ngoại lệ được hai bên thống nhất trước khi chạy chính thức. Đầu mối nghiệp vụ phê duyệt quyết định đối với dữ liệu không rõ, trùng, thiếu hoặc mâu thuẫn; Nhà thầu không tự suy diễn giá trị pháp lý, phạm vi Đảng bộ hoặc quyền công khai. Kết quả được ghi vào biên bản đối soát và chỉ chuyển giai đoạn khi người có thẩm quyền xác nhận.

### 2.5 Bảng trường hợp sử dụng 10–15

| Mã | Tác nhân | Điều kiện trước | Kết quả sau |
|---|---|---|---|
| UC10 — Chuyển đổi tin tức | Chuyên viên dữ liệu Nhà thầu; chủ sở hữu nội dung | Nguồn, schema, danh mục, trạng thái và mẫu dữ liệu được xác nhận; mapping được duyệt | Tin và quan hệ được nạp có khóa truy nguyên; báo cáo số lượng, lỗi, tệp và sai khác sẵn sàng đối soát |
| UC11 — Chuyển đổi văn bản | Chuyên viên dữ liệu; đầu mối nghiệp vụ văn bản | Phân loại QPPL/CĐĐH, danh mục cơ quan/lĩnh vực, quy tắc hiệu lực và tệp đã thống nhất | Hồ sơ văn bản, quan hệ và tệp được chuyển; ngoại lệ pháp lý được cách ly để quyết định |
| UC12 — Chuyển đổi Chuyên trang Bộ trưởng | Chuyên viên dữ liệu; quản trị nội dung chuyên trang | Phạm vi bài, danh mục, banner, menu, media, ngôn ngữ và cấu hình đã xác nhận | Nội dung gắn đúng chuyên trang, thứ tự/hiển thị được đối chiếu, không lẫn vào phân hệ khác |
| UC13 — Chuyển đổi dữ liệu Đảng bộ | Chuyên viên dữ liệu; đầu mối Đảng bộ | Nguồn và ranh giới nội dung Đảng bộ đã được Chủ đầu tư xác nhận; danh mục riêng đã duyệt | Dữ liệu được phân loại đúng miền, quan hệ/tệp giữ nguyên và bản ghi mơ hồ nằm trong ngoại lệ |
| UC14 — Chuyển đổi đa phương tiện | Chuyên viên dữ liệu; quản trị kho tệp | Manifest, định dạng, dung lượng, quyền sử dụng, kho đích và chính sách quét được phê duyệt | Album, metadata, tệp, thumbnail và quan hệ được chuyển/đối soát; tệp lỗi được cách ly |
| UC15 — Chuyển URL cũ | Quản trị nội dung và hạ tầng; chuyên viên dữ liệu | Danh mục URL, quy tắc canonical, mã redirect, ngoại lệ và kế hoạch cutover được duyệt | URL cũ tới đúng đích hoặc xử lý theo chính sách; báo cáo redirect/404/vòng lặp và cấu hình có thể quay lui |

## 3. Hạng mục 10 — Chuyển đổi, tích hợp dữ liệu tin tức

### 3.1 Phạm vi và mô hình logic

Nhà thầu khảo sát và lập danh mục bài viết, danh mục/chuyên mục, loại tin, ngôn ngữ, tác giả/nguồn hiển thị, trạng thái, ngày tạo/hiển thị/xuất bản, từ khóa, ảnh đại diện, tệp đính kèm, link nội bộ và metadata tìm kiếm. Trường dữ liệu đích được chốt cùng Chủ đầu tư sau khi đối chiếu hai hệ thống.

Mô hình logic gợi ý cho một bài gồm: `SourceKey`, `ContentType`, `Title`, `Summary`, `Body`, `CategoryKey`, `Language`, `AuthorDisplay`, `SourceDisplay`, `PublishedAt`, `CreatedAt`, `WorkflowState`, `Featured`, `Tags[]`, `CanonicalSlug`, `HeroMediaKey`, `Attachments[]`, `RelatedContentKeys[]`, `LegacyUrl`, `ModifiedAt`. Đây là mô hình giải pháp; mapping triển khai sẽ ánh xạ tới schema được duyệt.

### 3.2 Luồng chuyển đổi

1. **Kiểm kê:** chốt bản sao nguồn, tập dữ liệu, điều kiện lọc và baseline theo năm/danh mục/trạng thái. Ghi timestamp, truy vấn hoặc báo cáo nguồn, số ID duy nhất, số tệp và quyền đọc.
2. **Chuẩn hóa:** chuyển văn bản theo Unicode, quy tắc HTML an toàn, khoảng trắng, ngày giờ/múi giờ, URL và delimiters từ khóa. Bảo toàn nguyên văn nội dung biên tập hợp lệ; chỉ làm sạch thành phần nguy hiểm theo quy tắc được duyệt và lưu báo cáo thay đổi.
3. **Nạp phụ thuộc:** chuyển ngôn ngữ, danh mục, loại tin và các lookup trước bài viết. Duy trì bảng khóa nguồn–ID đích. Lookup không có đích được ghi ngoại lệ; không tự gán vào danh mục mặc định.
4. **Nạp bài:** ghi nội dung, trạng thái, thời điểm, tác giả/nguồn hiển thị, SEO và khóa truy nguyên. Bảo toàn trạng thái theo quy tắc chuyển đổi; không tự xuất bản bản nháp hoặc nội dung bị thu hồi.
5. **Chuyển media:** sao chép tệp, kiểm tra kích thước/checksum, tạo quan hệ tới đúng bài; giữ metadata hiển thị. Ảnh đại diện cần được kiểm tra định dạng và thumbnail.
6. **Kiểm tra đầu ra:** đối chiếu số liệu và mẫu, mở trang danh sách/chi tiết, kiểm tra tìm kiếm, URL, hình, tệp, tiếng Việt và quyền hiển thị.
7. **Đồng bộ cuối:** nếu nguồn còn ghi, thực hiện cửa sổ đóng ghi hoặc delta theo watermark đã thống nhất. Xử lý tạo mới, cập nhật, xóa/ẩn và xung đột sửa song song theo quy tắc được duyệt.

### 3.3 Quy tắc mapping minh họa

| Trường logic nguồn | Trường logic đích | Quy tắc đề xuất |
|---|---|---|
| `SourceKey` | `MigrationKey` | Định danh hệ nguồn + tập dữ liệu + khóa bản ghi; duy nhất và ổn định. |
| `Title` | `Title` | Giữ Unicode, bỏ khoảng trắng đầu/cuối, kiểm tra rỗng/độ dài; không tự viết lại. |
| `Summary` | `Summary` | Giữ nội dung; lọc HTML theo whitelist đã thống nhất. |
| `Body` | `Body` | Bảo toàn cấu trúc hợp lệ; quét link/thẻ nguy hiểm và lập báo cáo nếu chuyển đổi cấu trúc. |
| `CategoryKey` | `CategoryId` | Tra bảng danh mục đã duyệt; thiếu mapping là ngoại lệ. |
| `PublishedAt` | `PublishedAt` | Quy đổi timezone thống nhất; kiểm tra định dạng và giá trị ngoài phạm vi. |
| `WorkflowState` | `PublicationState` | Bảng quy đổi nháp/chờ duyệt/đã duyệt/đã xuất bản/thu hồi; không mặc định xuất bản. |
| `Tags[]` | `Keywords` | Chuẩn hóa dấu phân cách, bỏ trùng theo quy tắc được duyệt. |
| `HeroMediaKey` | `FeaturedMediaId` | Chỉ gắn sau khi media đã có và checksum hợp lệ. |
| `Attachments[]` | Quan hệ tệp bài viết | Duy trì tên hiển thị, thứ tự, MIME, checksum và liên kết tới bài. |

### 3.4 Lỗi và nghiệm thu

Nhà thầu phân loại tiêu đề rỗng/vượt giới hạn, ngày không hợp lệ, danh mục chưa ánh xạ, trạng thái không tương đương, HTML lỗi, slug trùng, tệp không đọc được, lỗi quota/timeout, ID nguồn biến mất giữa snapshot và bản ghi trùng. Lỗi dữ liệu được xử lý bởi đầu mối nghiệp vụ; lỗi kết nối/tệp được retry hữu hạn; mọi ngoại lệ giữ nguyên khóa truy nguyên. Không tạo tệp trống hoặc quan hệ giả để làm tăng tỷ lệ thành công.

Ca nghiệm thu gồm đối chiếu số lượng theo năm/danh mục/trạng thái; kiểm tra bài có/không có tệp, nội dung dài, tiếng Việt, ngày giờ, link và ảnh; kiểm tra không nhân đôi khi chạy lại; tạo lookup lỗi để xác nhận báo cáo; xác nhận nháp không bị công khai; đối chiếu danh sách ngoại lệ và quyết định xử lý. Bằng chứng gồm phiên bản mapping, mã lô, manifest, báo cáo đối soát, kết quả mở trang/tệp và biên bản Chủ đầu tư.

**[FIG:migration-pipeline]**

## 4. Hạng mục 11 — Chuyển đổi, tích hợp dữ liệu văn bản

### 4.1 Phạm vi và trường logic

Nhà thầu quản lý riêng hai miền văn bản: văn bản quy phạm pháp luật (QPPL) và văn bản chỉ đạo, điều hành (CĐĐH). Việc dùng chung mô hình lưu trữ đích không làm mất phân loại nghiệp vụ. Đầu mối Chủ đầu tư phê duyệt taxonomy, trạng thái, mã cơ quan, lĩnh vực, quan hệ thay thế/sửa đổi, tệp và quy tắc hiệu lực.

Mô hình logic gồm: `SourceKey`, `DocumentClass`, `DocumentType`, `NumberSymbol`, `Title/Abstract`, `FullText`, `IssuingAgencyKey`, `SignerDisplay`, `SignerTitle`, `IssuedAt`, `EffectiveFrom`, `EffectiveTo`, `LegalStatus`, `Language`, `SubjectKeys[]`, `RelatedDocumentKeys[]`, `Attachments[]`, `PublicationState`, `LegacyUrl`. Mô hình không bắt buộc nguồn có cùng tên hoặc cùng cấu trúc trường.

### 4.2 Quy trình và quy tắc nghiệp vụ

Chuyển danh mục loại/hình thức, cơ quan, lĩnh vực, lớp văn bản và ngôn ngữ trước hồ sơ chính. Lập bảng alias mã cơ quan nguồn–đích; trường hợp đổi tên, sáp nhập hoặc chia tách chờ quyết định của Chủ đầu tư. Mỗi văn bản giữ khóa truy nguyên, lớp QPPL/CĐĐH, số/ký hiệu, trích yếu, toàn văn, cơ quan, người ký/chức danh, các mốc ngày, trạng thái, quan hệ và tệp.

Số/ký hiệu được chuẩn hóa khoảng trắng ngoài nhưng giữ nguyên ký tự nghiệp vụ. Ngày phải phân tích theo format và timezone đã chốt; không tự điền ngày mặc định. Hệ thống kiểm tra ngày hết hiệu lực không trước ngày hiệu lực; ngày ban hành sau ngày hiệu lực được đưa vào ngoại lệ nếu không có quy tắc cho phép. Không tự tính lại hiệu lực pháp lý chỉ bằng so sánh ngày hiện tại, vì có thể có văn bản đính chính, thay thế hoặc trạng thái do cơ quan quản lý xác nhận. Lookup thiếu, cơ quan không rõ, lớp văn bản mâu thuẫn, số/ký hiệu trùng hoặc tệp hỏng được cách ly chờ quyết định.

| Nhóm trường | Xử lý và kiểm soát |
|---|---|
| Định danh | Khóa truy nguyên duy nhất; số/ký hiệu trùng được báo cáo, không tự gộp. |
| Phân loại | Tách QPPL và CĐĐH; kiểm tra lớp, loại, trạng thái và ngôn ngữ. |
| Cơ quan/lĩnh vực | Ánh xạ theo mã chuẩn được duyệt; lưu alias phục vụ đối soát. |
| Thời điểm | Kiểm tra định dạng, timezone, thứ tự; báo cáo giá trị thiếu/bất thường. |
| Quan hệ | Bảo toàn liên kết sửa đổi/thay thế/liên quan; không tạo liên kết mồ côi. |
| Tệp | Đối chiếu số lượng, checksum, dung lượng, quyền tải và khả năng mở. |

### 4.3 Lỗi và nghiệm thu

Chạy thử theo từng lớp văn bản; xử lý lỗi danh mục, tệp, ngày, ký hiệu và quan hệ thành danh sách riêng. Lỗi SQL/kết nối thử lại theo lô nhỏ và khóa truy nguyên để tránh nhân đôi. Không sửa nội dung pháp lý tự động. Nghiệm thu đối chiếu tổng theo năm/lớp/trạng thái; chọn mẫu nhiều cơ quan, lĩnh vực, tệp và quan hệ; kiểm tra ngày, số/ký hiệu, trích yếu, toàn văn, tải tệp, link và hiển thị công khai. Đầu mối văn bản quyết định ngoại lệ, ký biên bản đối soát.

## 5. Hạng mục 12 — Chuyển đổi dữ liệu Chuyên trang Bộ trưởng

### 5.1 Khảo sát, phân loại và mapping

Nhà thầu lập inventory độc lập cho nội dung Chuyên trang Bộ trưởng: tin/bài; phát biểu/chỉ đạo nếu nằm trong phạm vi; danh mục; menu; banner; block/khối hiển thị; ảnh; tệp; metadata SEO; ngôn ngữ; thời gian hiển thị và trạng thái. Chủ đầu tư xác nhận loại nội dung nào thuộc chuyên trang, cấu hình nào được chuyển và nội dung nào dùng chung với Cổng.

Mô hình logic gợi ý gồm `SourceKey`, `PortalArea`, `ContentType`, `Title`, `Body`, `CategoryKey`, `Language`, `PublicationState`, `DisplayStart/End`, `SortOrder`, `HeroMediaKey`, `AttachmentKeys[]`, `MenuNodeKey`, `BannerPlacement`, `CanonicalUrl`, `SEOFields`. Nhà thầu chuyển danh mục/menu trước, bài và media tiếp theo, sau đó gắn banner/khối hiển thị và liên kết. Mọi dữ liệu được gắn mã miền chuyên trang để tránh nhập lẫn sang chuyên mục tin chung.

Nếu banner có vị trí, thứ tự hoặc khoảng thời gian hiển thị, nhà thầu bảo toàn sau khi xác minh ý nghĩa và timezone. Liên kết nội bộ được ánh xạ bằng bảng URL đã duyệt, không thay thế URL bằng phép thay chuỗi. Nếu trường không có đích tương ứng, hai bên quyết định lưu metadata, chuyển thành nội dung, bổ sung cấu hình hoặc loại khỏi phạm vi có biên bản.

### 5.2 Lỗi và nghiệm thu

Lỗi dự kiến gồm menu mồ côi, danh mục trùng tên khác mã, ảnh ngoài kho, banner hết hạn, link về hệ cũ, quyền xem sai hoặc bài hiển thị nhầm chuyên trang. Nhà thầu dừng phát hành nếu phát hiện rủi ro công khai nội dung chưa được phép. Nghiệm thu theo số lượng bài/danh mục, ngày/trạng thái, banner, menu, thứ tự, ảnh, tệp, responsive và liên kết. Cùng một bản ghi được kiểm tra tại trang chủ, danh sách và chi tiết để xác nhận không xuất hiện nhầm ở khu vực khác. Đại diện nội dung duyệt mẫu và ngoại lệ trước cutover.

## 6. Hạng mục 13 — Chuyển đổi dữ liệu Đảng bộ Bộ Nội vụ

### 6.1 Xác định ranh giới dữ liệu

Nhà thầu cùng Chủ đầu tư chốt site/list nguồn, nhóm nội dung thuộc Đảng bộ, danh mục, loại bài, media, menu/banner, trạng thái và quy tắc công khai. Phân biệt dữ liệu Đảng bộ với các chuyên trang/chủ đề khác theo quyết định nghiệp vụ; không suy ra ranh giới chỉ từ tiêu đề hay nội dung tương tự. Tạo bảng phân loại ghi từng tập nguồn, chủ sở hữu và quyết định đưa vào/loại trừ.

Mô hình logic có thể gồm khóa truy nguyên, miền `PartyPortal`, tiêu đề/nội dung, ngày, tác giả/nguồn, danh mục, loại nội dung, trạng thái, ngôn ngữ, ảnh/tệp, quan hệ menu/banner, URL cũ và metadata hiển thị. Trường cụ thể phụ thuộc schema được khảo sát và duyệt. Nếu có bản ghi trùng nội dung nhưng khác khóa, Nhà thầu lập danh sách so sánh; không tự khử trùng hoặc nhập vào miền khác.

### 6.2 Kiểm soát và nghiệm thu

Chạy thử trên bản sao được cho phép. Đối chiếu số lượng theo danh mục, ngày, trạng thái và tập nguồn; kiểm tra mẫu liên kết nhiều tầng, media, URL và hiển thị. Kiểm quyền biên tập: đúng vai trò sửa được; tài khoản ngoài quyền không sửa/duyệt được; nội dung chưa duyệt không công khai. Các bản ghi mơ hồ, thiếu tệp, có nội dung cần phân loại hoặc xung đột URL được cách ly cho đầu mối Đảng bộ quyết định.

Nghiệm thu gồm danh mục/phạm vi nguồn đã ký, bảng mapping, báo cáo số lượng/lỗi, danh sách ngoại lệ đã quyết định, kiểm tra giao diện chuyên trang, liên kết và media. Chỉ đóng lô sau khi người có thẩm quyền xác nhận ranh giới dữ liệu.

## 7. Hạng mục 14 — Chuyển đổi dữ liệu đa phương tiện

### 7.1 Manifest và tiếp nhận tệp

Phạm vi gồm metadata album, loại media, danh mục, tiêu đề/mô tả, thứ tự, ngày, thumbnail, tệp ảnh/video/audio, tệp đính kèm, nguồn nhúng và URL. Nhà thầu lập manifest gồm `AlbumKey`, `MediaKey`, loại MIME, tên gốc, tên lưu đích, kích thước byte, checksum, thumbnail key, thứ tự, ngày, danh mục, alt text/mô tả, quyền truy cập, URI nguồn và trạng thái xử lý.

Không xác định loại tệp chỉ theo phần mở rộng. Tệp được kiểm tra chữ ký định dạng, kích thước, checksum, quét an toàn theo chính sách Chủ đầu tư và quyền sử dụng. Tệp nghi vấn hoặc ngoài phạm vi quyền được cách ly. Quy trình sao chép hỗ trợ batch có giới hạn, timeout, tiếp tục truyền và retry riêng từng tệp; chỉ gắn quan hệ album-media sau khi tệp đích tồn tại và kiểm checksum đạt. Giữ tên hiển thị gốc trong metadata; tên vật lý lưu trữ có thể được chuẩn hóa an toàn.

Với video/audio nhúng từ hệ thống bên ngoài, Nhà thầu giữ URI sau khi được duyệt, xác nhận HTTPS, quyền truy cập và chính sách hiển thị. Không tự tải về hoặc phát lại nội dung có hạn chế quyền. Thumbnail được kiểm riêng; nếu nguồn không có, tạo mới chỉ khi được Chủ đầu tư chấp thuận.

### 7.2 Lỗi và nghiệm thu

Lỗi gồm thiếu tệp, không đọc được, checksum sai, MIME không khớp, tên xung đột, thumbnail thiếu, codec không hỗ trợ, link ngoài hỏng, danh mục thiếu hoặc kho vượt dung lượng. Nhà thầu không thay tệp lỗi bằng tệp rỗng; mỗi lỗi giữ ID nguồn, bước lỗi, mã lỗi và hướng xử lý.

Đối soát tổng album/media/tệp/byte theo loại; xác minh checksum theo phạm vi đã duyệt; mở ảnh, phát video/audio, kiểm thumbnail/thứ tự/mô tả, truy cập link nhúng và xác nhận quyền. Biên bản nêu định dạng không hỗ trợ, tệp cách ly, quyết định chủ sở hữu và kết quả sau xử lý.

## 8. Hạng mục 15 — Chuyển đường dẫn cũ sang đường dẫn mới

### 8.1 Bảng ánh xạ URL và quy tắc phân giải

Nhà thầu thu thập URL từ sitemap, danh mục nội dung, liên kết nội bộ, bookmark/hệ thống tích hợp, log truy cập được phép và danh sách do Chủ đầu tư cung cấp. Chuẩn hóa scheme/host, chữ hoa-thường theo quy tắc máy chủ, dấu slash, query string và mã hóa tiếng Việt; không loại query có ý nghĩa.

Bảng ánh xạ có các trường: URL nguồn nguyên gốc, URL cũ chuẩn hóa, loại đối tượng, khóa nguồn, URL đích canonical, mã redirect, trạng thái, lý do/ngoại lệ, phiên bản mapping, người duyệt, ngày hiệu lực và ngày xem xét lại. Quy tắc ưu tiên gồm khớp URL đầy đủ, mẫu URL có biến đã kiểm thử, alias được duyệt; nếu không có đích thì trả 404 thân thiện hoặc trang tra cứu theo quyết định. Không đưa mọi URL lỗi về trang chủ.

Redirect 301 chỉ dùng khi URL đích ổn định đã được xác nhận; môi trường thử/cửa sổ cutover có thể dùng 302/307 để hỗ trợ quay lui. Chặn redirect loop, chuỗi dài, open redirect, scheme không an toàn và URL độc hại. Query tracking được giữ hoặc bỏ theo quy tắc được duyệt. URL canonical được xây từ cấu hình domain tin cậy, không từ header Host không xác thực.

### 8.2 Kiểm thử, cutover và giám sát

Nhập bảng ở môi trường thử; kiểm tra HTTP status, đích chính xác, canonical, redirect chain, URL có dấu/query, slash dư, trang không tồn tại, vòng lặp và mẫu URL độc hại. Trước cutover sao lưu cấu hình, công bố theo nhóm URL và theo dõi 404/5xx, đích sai, tỷ lệ truy cập và hiệu năng. Cấu hình cũ được giữ để quay lui trong cửa sổ thay đổi. Sau ổn định, cập nhật mapping qua quy trình có người duyệt và lưu lịch sử phiên bản.

Ca nghiệm thu lấy mẫu theo tin, văn bản, album và trang chuyên đề; thử URL trùng đích, không tồn tại, query, tiếng Việt, URL độc hại và redirect chain. Bằng chứng là danh sách URL, kết quả HTTP, log đã loại thông tin nhận dạng không cần thiết và biên bản đầu mối nội dung/hạ tầng.

## 9. Cutover, đồng bộ cuối và quay lui

### 9.1 Quy trình cutover

Nhà thầu lập kế hoạch thay đổi có cửa sổ, người chỉ huy, checklist, đầu mối liên lạc, tiêu chí dừng/go-no-go và phương án rollback. Trình tự thực hiện:

1. Chốt phiên bản phần mềm, mapping, danh sách lô và baseline; xác nhận phạm vi, quyền và thời gian đóng ghi.
2. Tạo/kiểm tra bản sao lưu trước cutover; ghi ID bản sao, checksum, thời điểm hoàn tất, vị trí và người xác minh khả năng phục hồi.
3. Đóng hoặc giới hạn ghi tại nguồn theo thống nhất; ghi timestamp freeze. Nếu không dừng ghi, chạy delta với watermark và cơ chế giải quyết xung đột.
4. Chạy đồng bộ cuối cho bản ghi, tệp, quan hệ và URL; đối chiếu số liệu trọng yếu; thực hiện smoke test danh sách, chi tiết, tìm kiếm, đăng nhập quản trị, phân quyền và tải tệp.
5. Người có thẩm quyền quyết định go/no-go; chuyển route/DNS/canonical hoặc bật cấu hình theo runbook; ghi chính xác thời điểm dịch vụ bắt đầu phục vụ.
6. Theo dõi lỗi, truy cập, hàng đợi và phản hồi nghiệp vụ trong cửa sổ ổn định; hạn chế thay đổi ngoài phạm vi.
7. Lập biên bản, lưu log, xác nhận sai khác, gán người xử lý và thời hạn.

**[FIG:cutover]**

### 9.2 Điều kiện dừng và rollback

Điều kiện go/no-go được định lượng trước, gồm lỗi 5xx/đăng nhập, sai lệch số lượng vượt dung sai, mất tệp trọng yếu, URL sai, lỗi phân quyền, smoke test không đạt, backup không kiểm chứng hoặc vượt cửa sổ. Khi xảy ra điều kiện dừng, người chỉ huy dừng ghi mới hoặc cô lập chức năng, bảo toàn log/bản sao, thông báo đầu mối và chuyển route/cấu hình cũ hoặc phục hồi theo runbook.

Rollback không đồng nghĩa tự động xóa dữ liệu đích. Nếu đích đã nhận nội dung mới, Chủ đầu tư quyết định bảo toàn, xuất ngược hoặc cô lập phần phát sinh; không ghi đè trạng thái mới bằng bản cũ khi chưa được phê duyệt. Trình tự phục hồi xác định phiên bản cơ sở dữ liệu, kho tệp, cấu hình, bảng URL và các phụ thuộc. Sau rollback, Nhà thầu xác minh tính nhất quán, chức năng trọng yếu và thông báo trạng thái dịch vụ.

### 9.3 RPO/RTO và bằng chứng

RPO đo khoảng cách từ thời điểm sự cố tới điểm dữ liệu gần nhất khôi phục được; RTO đo từ thời điểm tuyên bố sự cố tới khi dịch vụ đạt tiêu chí hoạt động đã duyệt. Nhà thầu phối hợp DBA và Chủ đầu tư diễn tập trên topology/hạ tầng triển khai, ghi thời điểm, tập dữ liệu, bước chạy, sai khác, kiểm tra ứng dụng và thời điểm khôi phục đọc/ghi. Chỉ xác nhận đáp ứng khi số đo diễn tập cho thấy RPO ≤4 giờ và RTO ≤4 giờ đối với dịch vụ trọng yếu.

## 10. Hạng mục 25 — Xác thực hai bước Authenticator

### 10.1 Bảng trường hợp sử dụng

| Mã | Tác nhân | Điều kiện trước | Kết quả sau |
|---|---|---|---|
| UC25a — Kích hoạt 2FA | Người dùng; dịch vụ xác thực | Tài khoản hợp lệ, người dùng đã đăng nhập và xác thực lại theo chính sách | Secret được xác minh bằng OTP rồi mới bật; người dùng nhận thông báo hoàn tất |
| UC25b — Đăng nhập với 2FA | Người dùng; dịch vụ xác thực | Mật khẩu hợp lệ, 2FA đang bật, thời gian máy chủ được đồng bộ | Phiên/token chỉ được cấp sau OTP hợp lệ; lỗi được ghi nhận và áp dụng giới hạn thử |
| UC25c — Tắt 2FA | Người dùng | Tài khoản đang bật 2FA, xác thực lại bằng yếu tố được duyệt | 2FA tắt có audit; người dùng được thông báo |
| UC25d — Reset 2FA | Quản trị viên được ủy quyền; người dùng | Có ticket/lý do và xác minh danh tính theo quy trình | Secret cũ mất hiệu lực, phiên được xử lý theo chính sách, người dùng bắt buộc đăng ký lại |

### 10.2 Vòng đời đăng ký và đăng nhập

Vòng đời gồm **Chưa đăng ký → Đang thiết lập → Đã xác minh/chờ bật → Đang bật → Tạm khóa/cần reset → Đã tắt hoặc đăng ký lại**. Secret chỉ có hiệu lực sau khi OTP được xác minh. QR setup là dữ liệu bí mật tạm thời; chỉ hiển thị cho đúng người dùng qua phiên đã xác thực, không cache công khai, không ghi log/analytics, không gửi email và không tái hiển thị sau khi hoàn tất.

1. Người dùng vào trang bảo mật và xác thực lại bằng mật khẩu hoặc yếu tố hiện có theo chính sách.
2. Dịch vụ sinh secret bằng bộ sinh số ngẫu nhiên mật mã, ràng buộc với issuer và định danh tài khoản, theo thuật toán/chu kỳ OTP đã thống nhất.
3. Dịch vụ trả QR enrollment và mã nhập tay một lần qua TLS; giao diện nhắc không chia sẻ mã.
4. Người dùng quét QR trong ứng dụng Authenticator và nhập OTP hiện tại. Máy chủ kiểm tra định dạng, khoảng lệch thời gian được duyệt, hạn mức, trạng thái đăng ký và sự gắn kết secret–tài khoản.
5. Chỉ khi OTP hợp lệ mới bật 2FA. Ghi actor, thời điểm và kết quả, không ghi OTP/secret; gửi thông báo thay đổi bảo mật.
6. Khi đăng nhập, sau mật khẩu đúng hệ thống giữ trạng thái xác thực tạm; nếu 2FA bật, chưa cấp phiên/token đầy đủ trước khi OTP đúng. OTP sai/hết hạn trả thông báo phù hợp, tăng bộ đếm và áp dụng throttle/khóa tạm theo chính sách.

**[FIG:2fa]**

### 10.3 Tắt, reset, mất thiết bị và khôi phục quyền

Người dùng tự tắt 2FA phải chứng minh yếu tố hiện có hoặc quy trình dự phòng được duyệt và xác thực lại; phiên web kéo dài không đủ làm căn cứ. Reset bởi quản trị viên là quyền đặc biệt, yêu cầu role chuyên biệt, lý do/ticket, xác minh danh tính theo quy trình Chủ đầu tư, audit chống sửa và thông báo người dùng qua kênh độc lập khi có thể. Nhân viên hỗ trợ không xem secret/OTP. Secret cũ bị vô hiệu ngay; người dùng buộc enrollment mới. Session/token hiện hữu bị thu hồi hoặc yêu cầu xác thực lại theo chính sách.

Khóa tài khoản, đổi đơn vị, thôi việc và thu hồi danh tính AD/SSO tuân theo quy trình quản lý danh tính, không được bỏ qua bằng reset 2FA. Tài khoản dịch vụ không tương tác chỉ có ngoại lệ được phê duyệt, giới hạn mạng/quyền và phương thức xác thực riêng.

### 10.4 Lưu trữ, lỗi và phân quyền

Nhà thầu bảo vệ secret bằng mã hóa có xác thực với khóa quản lý ngoài cơ sở dữ liệu, quyền giải mã tối thiểu và quy trình luân chuyển khóa; secret không xuất hiện trong API response ngoài bước enrollment, log, analytics, thông báo hay màn hình quản trị. Endpoint chỉ cho chủ tài khoản; reset quản trị yêu cầu quyền riêng và kiểm quyền phía server. OTP không được ghi log; thông báo lỗi không tiết lộ dữ liệu tài khoản cho người chưa xác thực.

Nhà thầu đồng bộ giờ máy chủ, giới hạn tốc độ theo tài khoản/IP, áp dụng retry hữu hạn và xử lý replay theo năng lực giao thức. Lỗi gồm OTP sai/hết hạn, lệch đồng hồ, đăng ký đồng thời, secret không tồn tại, quá số lần thử, mất thiết bị, mạng lỗi, CSRF/replay và reset trái quyền. Retry OTP là người dùng nhập mã kế tiếp; hệ thống không tự gửi lại mã cũ.

### 10.5 Ca nghiệm thu

- QR đúng issuer/tài khoản; OTP hợp lệ bật thành công, OTP sai/hết hạn không bật.
- Tài khoản bật 2FA không nhận phiên đầy đủ nếu thiếu OTP; OTP đúng mới hoàn tất đăng nhập.
- Tắt 2FA thiếu yếu tố xác minh bị từ chối; tắt thành công có audit và thông báo.
- Role không đủ quyền không reset được; role được cấp phải nhập lý do/ticket; secret cũ mất hiệu lực, người dùng được yêu cầu enrollment mới.
- Gọi endpoint trực tiếp từ tài khoản khác, token hết hạn, CSRF, OTP vượt hạn mức; xác nhận server từ chối và secret không rò trong response/log/backup bị truy cập trái quyền.

## 11. Hạng mục 26 — Sinh mã QR

### 11.1 Bảng trường hợp sử dụng

| Mã | Tác nhân | Điều kiện trước | Kết quả sau |
|---|---|---|---|
| UC26a — QR enrollment | Người dùng đã xác thực; dịch vụ 2FA | Người dùng đang thiết lập 2FA; secret tạm còn hiệu lực | QR bí mật chỉ hiển thị trong phiên bảo vệ; quét thành công để nhập secret vào ứng dụng Authenticator |
| UC26b — QR nội dung | Người đọc công khai; dịch vụ nội dung | Tin/văn bản ở trạng thái được công khai, có URL canonical | QR chứa URL HTTPS canonical và quét tới đúng trang chi tiết |

### 11.2 QR enrollment mang bí mật

QR enrollment chứa URI có secret. Nhà thầu cấp riêng theo phiên đã xác thực, qua TLS; không đặt secret trong URL công khai, cache proxy/CDN, log, analytics hoặc ảnh hỗ trợ. Làm mới QR phải vô hiệu secret cũ trước hoặc cùng giao dịch tạo secret mới. QR và mã nhập tay chỉ xuất hiện trong bước thiết lập; sau khi bật 2FA, hệ thống không tái hiện lại. Hạn chế lưu ở browser storage và chặn nhúng chéo nguồn.

**[FIG:qr]**

### 11.3 QR nội dung công khai

QR tin/văn bản chỉ mã hóa URL HTTPS canonical; không mang ID nhạy cảm, access token, dữ liệu cá nhân hay URL chưa chuẩn hóa. Dịch vụ lấy URL từ cấu hình domain tin cậy và nội dung đã xuất bản; bản nháp/ẩn không phát QR công khai. Nếu URL thay đổi, ánh xạ URL cũ vẫn cho phép QR đã in hoạt động. Ảnh QR công khai có thể cache theo phiên bản URL; khi URL đổi, cache được vô hiệu.

QR có nhãn thay thế hoặc URL dạng chữ để hỗ trợ truy cập. Dịch vụ giới hạn kích thước/định dạng và xử lý lỗi sinh mã; không dùng Host header không tin cậy để ghép URL. Nghiệm thu quét QR bằng ít nhất hai ứng dụng/thiết bị, kiểm tra URL có dấu/query, URL đổi, bản nháp, host giả và trường hợp cache.

## 12. Hạng mục 27 — Sao lưu tự động, tải và phục hồi

### 12.1 Bảng trường hợp sử dụng

| Mã | Tác nhân | Điều kiện trước | Kết quả sau |
|---|---|---|---|
| UC27a — Sao lưu thủ công | Quản trị viên backup | Role hợp lệ, đích lưu còn dung lượng, nguồn sẵn sàng | Job có mã, trạng thái, thời gian, checksum và vị trí lưu |
| UC27b — Sao lưu theo lịch | Scheduler; DBA | Lịch/retention/phạm vi đã phê duyệt; tài khoản dịch vụ có quyền tối thiểu | Backup nhất quán chạy theo lịch, cảnh báo khi lỗi, không nhân đôi job |
| UC27c — Tải bản sao | Quản trị viên được phép | File đã xác nhận integrity, quyền tải hợp lệ | File truyền an toàn, có audit và không lộ đường dẫn nội bộ |
| UC27d — Khôi phục/diễn tập | DBA và người phê duyệt | Có backup kiểm tra được, môi trường phục hồi và runbook | Dữ liệu/dịch vụ được phục hồi, ghi thời gian/sai khác để đo RPO/RTO |

### 12.2 Phạm vi và lịch backup

Backup bao phủ nhất quán cơ sở dữ liệu, tệp upload/media, cấu hình ứng dụng, cấu hình tích hợp và thành phần cần thiết để phục hồi. Secret/khóa được quản lý theo cơ chế lưu giữ riêng được Chủ đầu tư cho phép, không đóng gói thiếu bảo vệ trong cùng bản sao. DBA và Chủ đầu tư duyệt phương án full/differential/log hoặc snapshot tương đương, lịch, cửa sổ, retention, vùng lưu, mã hóa, khóa, người nhận cảnh báo và dung lượng.

Lịch đáp ứng RPO ≤4 giờ; phép tính tính cả thời gian tạo bản sao, kiểm integrity, sao chép sang vùng lưu, độ trễ và xác nhận hoàn tất. Mỗi job ghi `RunId`, loại backup, nguồn, thời gian bắt đầu/kết thúc, điểm khôi phục DB, kích thước, checksum, vị trí, phiên bản cấu hình, trạng thái, lỗi và số lần thử. DB và tệp được chụp nhất quán để tránh lệch thời điểm. Bản sao chỉ mang trạng thái “đã xác nhận” sau khi kiểm tra integrity và hoàn thành sao chép tới vùng được duyệt.

**[FIG:backup-restore]**

### 12.3 Retry, retention và quyền tải

Scheduler chống chạy trùng cùng cửa sổ bằng lease/khóa; có timeout, retry backoff hữu hạn và không ghi đè bản hợp lệ bằng bản lỗi. Nếu thất bại cuối, phát cảnh báo và cho phép vận hành chạy lại có mã tương quan/lý do. Retention chỉ xóa bản cũ sau khi xác nhận còn chuỗi bản sao đủ khôi phục; thao tác xóa có audit và không xóa bản cuối cùng có thể dùng.

Tách quyền tạo, xem metadata, tải, xóa và restore. Download kiểm tra đường dẫn chuẩn trong vùng cho phép, quyền người dùng, loại file, kích thước và audit; từ chối path traversal. File backup được mã hóa khi lưu, truyền qua kênh an toàn, giới hạn thời gian liên kết và không đặt trong thư mục web công khai. Không để lộ tên người dùng/đường dẫn nội bộ không cần thiết.

### 12.4 Khôi phục và diễn tập

Runbook xác định người phê duyệt, môi trường cô lập, thứ tự DB→tệp→cấu hình→dịch vụ, kiểm tra integrity/quét an toàn, tài khoản phục hồi, cấu hình kết nối, tương thích phiên bản, kiểm tra nghiệp vụ và quyết định chuyển traffic. Nhà thầu diễn tập restore trong môi trường thử trước; không ghi đè production bằng thao tác không xác nhận. Sau phục hồi, xác minh bảng/bản ghi trọng yếu, đăng nhập, nội dung, tệp, link, chức năng và thời gian từng bước.

Diễn tập tối thiểu một kịch bản dịch vụ trọng yếu theo kế hoạch được duyệt. Ghi mốc sự cố, điểm dữ liệu khôi phục, thời gian phục hồi, chức năng được xác nhận, sai lệch và hành động khắc phục. Chỉ xác nhận đạt RPO/RTO khi đo thực tế không quá 4 giờ. File backup tồn tại không thay thế bằng chứng restore thành công.

### 12.5 Ca nghiệm thu

1. Role hợp lệ tạo backup thủ công; role không đủ quyền bị từ chối.
2. Scheduler chạy đúng lịch; mô phỏng lỗi nguồn, hết dung lượng, mất kết nối kho và timeout; xác nhận retry hữu hạn, trạng thái cuối và cảnh báo.
3. Kiểm tra checksum, kích thước, retention, quyền tải; thử path traversal, file sai định dạng và truy cập trái quyền.
4. Khôi phục vào môi trường thử; mở DB/tệp, đăng nhập và chạy smoke test; lập biên bản số liệu/thời gian.
5. Đo khoảng cách điểm dữ liệu và thời gian phục hồi; đối chiếu ngưỡng RPO/RTO ≤4 giờ.

## 13. Hạng mục 28 — Cảnh báo hệ thống và thông báo nội bộ

### 13.1 Bảng trường hợp sử dụng

| Mã | Tác nhân | Điều kiện trước | Kết quả sau |
|---|---|---|---|
| UC28a — Nhận sự kiện hệ thống | Dịch vụ ứng dụng/giám sát | Event schema, severity, ngưỡng và chính sách log được cấu hình | Sự kiện được phân loại, gắn correlation ID và lưu trạng thái an toàn |
| UC28b — Gửi cảnh báo | Bộ đánh giá; worker email | Sự kiện qua ngưỡng, có người nhận/relay được duyệt | Thông báo nội bộ/email được gửi hoặc retry/dead-letter có kiểm soát |
| UC28c — Xử lý thông báo | Quản trị viên/nhân viên vận hành | Người dùng có quyền xem/nhận việc | Cảnh báo được xác nhận, gán, đóng kèm ghi chú; log gốc được giữ |

### 13.2 Danh mục sự kiện và dữ liệu cảnh báo

Nhà thầu thiết kế event catalog gồm lỗi API theo endpoint/nhóm lỗi; dịch vụ phụ thuộc mất kết nối; backup lỗi/không hoàn tất đúng lịch; đăng nhập thất bại vượt ngưỡng; đăng nhập bất thường theo chính sách; thay đổi/reset 2FA; thay đổi cấu hình/role; dung lượng gần ngưỡng; thông báo nội bộ do người có quyền tạo. Mức độ gồm thông tin, cảnh báo, nghiêm trọng; mỗi mức có ngưỡng, người nhận, thời gian gộp và thời gian phản hồi được Chủ đầu tư duyệt.

Sự kiện tối thiểu có `EventId`, `CorrelationId`, `EventType`, `Severity`, timestamp UTC và thời gian hiển thị, nguồn dịch vụ, đối tượng đã che dữ liệu nhạy cảm, mã lỗi, số lần, ngữ cảnh an toàn, trạng thái gửi và liên kết runbook. Không lưu password, OTP, secret, bearer token, request body nhạy cảm hoặc dữ liệu cá nhân quá nhu cầu. Nhật ký bảo vệ khỏi sửa/xóa trái quyền; quyền xem cảnh báo không tự cấp quyền xử lý nguồn sự kiện.

### 13.3 Luồng tiếp nhận, dedup, gửi và retry

1. Ứng dụng phát sự kiện có schema/phiên bản, severity và correlation ID. Middleware ghi trạng thái lỗi/metric, loại trừ lỗi xác thực thông thường khỏi mức nghiêm trọng theo chính sách.
2. Bộ đánh giá áp ngưỡng theo cửa sổ thời gian. Các lỗi cùng service/endpoint/error code được gom thay vì gửi một thư cho mỗi request; ngưỡng cụ thể do vận hành phê duyệt.
3. Khóa dedup dựa trên loại sự kiện, dịch vụ, đối tượng chuẩn hóa và cửa sổ thời gian. Sự kiện lặp tăng bộ đếm và cập nhật `LastSeen`; chỉ gửi lại sau cooldown hoặc khi mức nghiêm trọng tăng. Không gộp sự kiện của các tài khoản khác nhau nếu làm mất thông tin điều tra.
4. Tạo thông báo nội bộ và đưa email vào outbox/hàng đợi bền vững. Trạng thái gồm pending, sending, sent, retryable failure, terminal failure, suppressed/deduplicated; lưu mã nhà cung cấp khi được phép.
5. Worker gửi qua relay được cấp, có timeout và retry lỗi tạm thời theo backoff có jitter. Địa chỉ sai/lỗi vĩnh viễn chuyển dead-letter; không retry vô hạn. Idempotency key hạn chế gửi trùng; nếu không rõ trạng thái gửi, kiểm tra nhà cung cấp trước khi phát lại.
6. Người có quyền xem, xác nhận tiếp nhận, gán người xử lý và đóng cảnh báo kèm ghi chú. Đóng không xóa log gốc; sự kiện tái diễn sau khi đóng tạo cảnh báo mới có liên kết.

**[FIG:alert-flow]**

### 13.4 Phát hiện bất thường và giảm cảnh báo giả

Ngưỡng được cấu hình theo tài khoản/IP/thời gian và chính sách bảo vệ dữ liệu. Tình huống mẫu gồm nhiều lần đăng nhập sai, đăng nhập sau chuỗi thất bại, thay đổi nguồn bất thường hoặc reset 2FA. Địa chỉ IP mới không tự được coi là xâm nhập; đánh giá NAT/VPN, tài khoản dùng chung và tỷ lệ cảnh báo giả trước khi kích hoạt. Không tiết lộ quy tắc phát hiện cho người chưa xác thực. Khóa/tạm khóa tài khoản phối hợp quy trình quản lý danh tính và có phương án mở khóa kiểm soát.

### 13.5 Hàng đợi, bảo mật và nghiệm thu

Hàng đợi có giới hạn tuổi/lưu lượng, backpressure và cảnh báo backlog. Relay lỗi không chặn API công khai và không làm mất outbox. Retry không áp dụng cho lỗi cấu hình vĩnh viễn. Email chỉ chứa dữ liệu tối thiểu và link tới màn hình cần xác thực; không đính kèm secret/log nhạy cảm. SMTP/API key nằm trong kho secret, người sửa ngưỡng/người nhận bị giới hạn; mọi thay đổi có audit.

Ca nghiệm thu gồm phát lỗi API giả lập, kiểm ngưỡng/dedup; tạo chuỗi đăng nhập sai có kiểm soát, xác nhận nội dung không lộ OTP/password; kiểm thông báo nội bộ theo role; mô phỏng relay timeout, lỗi tạm thời/vĩnh viễn, địa chỉ sai, queue đầy và phục hồi. Xác nhận retry hữu hạn, không gửi trùng, dead-letter có thể xử lý, cảnh báo được gán/đóng và audit giữ nguyên. Bàn giao event catalog, cấu hình đã che bí mật, danh sách người nhận, ngưỡng, runbook và biên bản thử.

## 14. Quan hệ với tải, sẵn sàng và vận hành

Nhà thầu lập kế hoạch kiểm thử có tối thiểu 500 phiên truy cập công khai đồng thời và 84 phiên tác vụ động/người dùng hoạt động đồng thời. Kịch bản gồm trang chủ, tìm kiếm, xem tin/văn bản, tải tệp và tác vụ quản trị. Kiểm tra hiệu năng nêu trong HSYC được thực hiện trên phiên bản hoàn thiện, ghi phân bố hành vi, tốc độ tăng tải, thời gian duy trì, điều kiện mạng, lỗi, độ trễ và tài nguyên từng nút.

Các job chuyển đổi/backup được chạy trong cửa sổ thống nhất hoặc hạ tầng tách biệt; kiểm tra tải công khai trong khi backup, nhiều lượt đăng nhập OTP và burst cảnh báo/email. Retry giới hạn theo timeout/backoff, chỉ cho thao tác idempotent hoặc có idempotency key. Không retry vô hạn thao tác ghi có kết quả chưa rõ. Khi phụ thuộc lỗi, ưu tiên duy trì đọc nội dung công khai và ghi nhận tác vụ chờ xử lý.

Độ sẵn sàng tối thiểu 99,9% được đo theo tháng theo định nghĩa dịch vụ, thời gian loại trừ bảo trì và nguồn telemetry do Chủ đầu tư phê duyệt. Nhà thầu bàn giao báo cáo kỳ, các khoảng gián đoạn, nguyên nhân và hành động xử lý; không suy ra kết quả từ cấu hình hoặc thiết kế.

## 15. Sản phẩm bàn giao và bằng chứng nghiệm thu

| Phạm vi | Sản phẩm bàn giao | Chủ thể xác nhận |
|---|---|---|
| Tin, văn bản, Bộ trưởng, Đảng bộ, media | Inventory nguồn; schema/từ điển; mapping có phiên bản; manifest; log/lỗi; báo cáo số lượng/quan hệ/tệp; mẫu đầu ra; quyết định ngoại lệ. | Chủ sở hữu từng miền dữ liệu và quản trị Cổng. |
| URL và cutover | Bảng URL được duyệt; bộ kiểm tra HTTP; runbook go/no-go; backup trước thay đổi; mốc freeze/cutover; báo cáo ổn định/rollback. | Đầu mối nội dung, hạ tầng và chỉ huy thay đổi. |
| 2FA và QR | Thiết kế vòng đời; ma trận quyền; chính sách bảo vệ secret; kết quả thử enrollment/login/reset; kiểm QR bí mật và QR công khai; log mẫu đã khử bí mật. | Quản trị an toàn thông tin và chủ sở hữu tài khoản. |
| Backup/restore | Chính sách phạm vi/lịch/retention; vị trí/quyền; kết quả integrity; runbook; biên bản restore; số đo RPO/RTO. | DBA, vận hành và Chủ đầu tư. |
| Cảnh báo | Event catalog; ngưỡng/dedup/cooldown; người nhận; cấu hình relay đã che bí mật; báo cáo retry/dead-letter; biên bản thử. | Vận hành, an toàn thông tin và chủ sở hữu ứng dụng. |

Mỗi hồ sơ giữ mã phiên bản/lô, thời điểm, môi trường và người thực hiện để truy nguyên. Thời hạn lưu và quyền truy cập bằng chứng do Chủ đầu tư phê duyệt. Kết luận đạt chỉ được đưa ra theo kết quả kiểm thử/diễn tập và biên bản nghiệm thu có thẩm quyền.

## 16. Cơ sở yêu cầu

Phương án này đáp ứng các hạng mục chuyển đổi tin tức, văn bản, Chuyên trang Bộ trưởng, Đảng bộ Bộ Nội vụ, đa phương tiện và URL cũ; các hạng mục 2FA, QR, backup tự động và cảnh báo hệ thống trong Hồ sơ yêu cầu. Phạm vi tích hợp dữ liệu được xác định giữa Cổng thông tin điện tử Bộ Nội vụ và Cổng thông tin điện tử Bộ Lao động – Thương binh và Xã hội. Phần sao lưu/phục hồi bám mục tiêu RPO/RTO không quá 04 giờ cho dịch vụ trọng yếu; phương án hiệu năng và sẵn sàng bám chỉ tiêu 500 phiên công khai, 84 phiên động và uptime 99,9% theo tháng. Các chi tiết schema, ngưỡng cảnh báo, lịch backup, thời hạn lưu, ma trận quyền và điểm cutover sẽ được Nhà thầu trình Chủ đầu tư phê duyệt trong thiết kế chi tiết trước triển khai.
