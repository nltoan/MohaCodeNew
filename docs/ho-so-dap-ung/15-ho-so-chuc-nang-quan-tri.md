# Phần III. Thuyết minh chi tiết giải pháp chức năng quản trị

## Phạm vi và phương pháp trình bày

Tefli sẽ khảo sát, phân tích, thiết kế, xây dựng, cấu hình, kiểm thử và bàn giao các chức năng quản trị từ 16 đến 24 và 29 theo yêu cầu của Cổng thông tin điện tử Bộ Nội vụ. Mỗi chức năng được trình bày theo tác nhân, mục tiêu, màn hình, luồng xử lý, dữ liệu nghiệp vụ, quy tắc, ngoại lệ và tình huống nghiệm thu. Các trường mô tả dưới đây là trường nghiệp vụ; cấu trúc dữ liệu và hợp đồng trao đổi sẽ được đặc tả trong thiết kế chi tiết, bảo đảm phù hợp yêu cầu và không làm phát sinh trường bắt buộc ngoài phạm vi được duyệt.

Giải pháp hướng tới quy trình biên tập có phân vai, trạng thái và khả năng truy vết; nội dung quản trị chỉ được cung cấp ra Cổng khi đã đáp ứng điều kiện phát hành. Tefli sẽ phối hợp Chủ đầu tư thống nhất danh mục, ma trận quyền, dữ liệu khởi tạo và quy tắc nghiệp vụ trong giai đoạn khảo sát; mọi hành động quản trị quan trọng được ghi nhận phục vụ tra cứu và nghiệm thu.

## Danh mục trường hợp sử dụng

| Mã | Trường hợp sử dụng | Tác nhân chính | Tác nhân phối hợp | Sự kiện khởi phát | Tiền điều kiện | Kết quả |
|---|---|---|---|---|---|---|
| UC16 | Quản lý tin tức, chuyên mục và loại tin | Người biên tập | Người kiểm duyệt; quản trị nội dung; người xuất bản | Tạo/sửa tin, quản lý danh mục hoặc gửi duyệt | Đã đăng nhập; được cấp quyền và phạm vi; danh mục dùng cho bài đã sẵn sàng | Bài và danh mục được lưu đúng trạng thái; nội dung được duyệt mới hiển thị công khai |
| UC17 | Quản lý hồ sơ văn bản | Người biên tập văn bản | Người rà soát; người duyệt/xuất bản; quản trị danh mục | Tạo/cập nhật hồ sơ, tệp hoặc quan hệ văn bản | Đã đăng nhập; có phạm vi văn bản và danh mục liên quan | Hồ sơ, quan hệ và tệp được lưu; trạng thái công khai phù hợp quyết định duyệt |
| UC18 | Quản lý Chuyên trang Bộ trưởng | Biên tập viên chuyên trang | Đầu mối văn phòng; người duyệt; quản trị cổng | Soạn nội dung hoặc cập nhật banner/menu/vị trí | Đã đăng nhập; có quyền trên chuyên trang; cấu hình hiển thị khả dụng | Nội dung/cấu hình được phát hành đúng phạm vi và lịch |
| UC19 | Quản lý trang Đảng bộ Bộ Nội vụ | Biên tập viên Đảng bộ | Người duyệt; quản trị cổng; đầu mối dữ liệu | Soạn nội dung hoặc thay đổi cấu hình trang Đảng bộ | Đã đăng nhập; có quyền trên phạm vi Đảng bộ; danh mục đã cấu hình | Nội dung và cấu hình riêng được lưu, duyệt và hiển thị đúng trang |
| UC20 | Quản lý đa phương tiện | Người biên tập media | Người kiểm duyệt; quản trị kho tệp; người xuất bản | Tạo album, thêm/sắp xếp tệp hoặc gửi duyệt | Đã đăng nhập; có quyền; loại tệp/nguồn được phép | Album và mục media được lưu; chỉ nội dung được duyệt mới công khai |
| UC21 | Quản lý lấy ý kiến nhân dân | Đơn vị chủ trì/biên tập dự thảo | Cán bộ tiếp nhận; kiểm duyệt viên; công dân | Mở đợt tham vấn hoặc gửi ý kiến | Hồ sơ dự thảo được duyệt; thời gian nhận ý kiến và biểu mẫu được thiết lập | Ý kiến được tiếp nhận, kiểm duyệt và tổng hợp theo trạng thái |
| UC22 | Quản lý văn bản QPPL và CĐĐH | Người biên tập văn bản | Chuyên viên rà soát; người duyệt; quản trị danh mục | Tạo/cập nhật hồ sơ theo nhóm văn bản | Đã đăng nhập; có quyền; loại hồ sơ/danh mục phù hợp | Hồ sơ được phân loại, tra cứu và công khai theo trạng thái, quyền |
| UC23 | Quản lý Hội nghị - Sự kiện | Đơn vị tổ chức/biên tập viên | Người kiểm duyệt; người xuất bản; quản trị danh mục | Tạo sự kiện hoặc cập nhật lịch/chương trình | Đã đăng nhập; có quyền; loại sự kiện và mốc thời gian hợp lệ | Sự kiện được lưu, duyệt và thể hiện đúng danh sách/timeline |
| UC24 | Quản trị hệ thống và người dùng | Quản trị hệ thống | Quản trị phân quyền; quản trị nội dung; kiểm toán | Tạo/khóa tài khoản, gán quyền hoặc cập nhật cấu hình | Đã xác thực; quyền quản trị phù hợp; dữ liệu thay đổi hợp lệ | Tài khoản, quyền/cấu hình được cập nhật và ghi nhật ký |
| UC29 | Quản lý thông tin kết nối/tích hợp hiển thị trên Cổng | Quản trị nội dung liên kết | Người rà soát đích; người xuất bản; quản trị tích hợp khi có kết nối kỹ thuật | Tạo/sửa nhóm liên kết hoặc thông tin kết nối | Đã đăng nhập; có quyền; vị trí và chính sách đích đã cấu hình | Liên kết được duyệt và hiển thị đúng khu vực; cấu hình kết nối được quản lý riêng nếu thuộc phạm vi |

## 16. Quản lý tin tức, chuyên mục và loại tin

**Trường hợp sử dụng:** UC16 — Quản lý tin tức, chuyên mục và loại tin.

### Vai trò, phạm vi và màn hình

Người soạn tạo và sửa nội dung thuộc phạm vi được giao; biên tập viên quản lý chuyên mục/loại tin theo đơn vị hoặc chuyên trang; người duyệt xem bản gửi, so sánh nội dung và duyệt/trả lại; người xuất bản phát hành hoặc gỡ theo ủy quyền; quản trị nội dung cấu hình danh mục, vùng hiển thị và quy trình. Khách truy cập chỉ nhận bài công khai còn hiệu lực. Tefli sẽ thiết kế ma trận quyền tối thiểu theo vai trò và phạm vi nội dung, thống nhất quy tắc kiêm nhiệm với Chủ đầu tư.

Tefli sẽ xây dựng màn hình danh sách có tìm kiếm theo tiêu đề/từ khóa, chuyên mục, loại tin, người tạo, khoảng ngày, ngôn ngữ và trạng thái; phân trang và sắp xếp; cột mã, tiêu đề, chuyên mục chính, người phụ trách, lần cập nhật, trạng thái, bước duyệt và hành động khả dụng. Bộ lọc không được làm lộ bài ngoài phạm vi người dùng. Hộp soạn thảo chia phần: thông tin chung (tiêu đề, mô tả, nội dung, tác giả/nguồn, chuyên mục chính, chuyên mục hiển thị thêm, loại tin, ngôn ngữ); trình bày (ảnh đại diện, tệp đính kèm, vùng hiển thị, tin liên quan); phát hành/SEO (slug, tiêu đề/mô tả tìm kiếm, ngày dự kiến, canonical nếu thuộc phạm vi); kiểm duyệt (quy trình, ghi chú, lịch sử). Tefli sẽ chốt danh sách trường theo yêu cầu và thiết kế giao diện nhất quán giữa danh sách, biên tập, xem trước và kiểm duyệt.

[FIG:editorial-workflow]

### Luồng xử lý chính



1. Người soạn chọn “Tạo tin”, chọn chuyên mục đang hoạt động và loại tin phù hợp. Hệ thống tải các lựa chọn tham chiếu đã được phép; mặc định ngày lập từ thời điểm máy chủ, không tự suy ra ngày xuất bản chính thức.
2. Người soạn nhập tiêu đề, nội dung, mô tả, nguồn/tác giả, ngôn ngữ và ảnh. Công cụ biên tập lưu bản nháp; bản nháp có thể lưu nhiều lần mà không xuất hiện công khai. Khi cần tệp, người dùng tải lên qua kho tệp được kiểm soát rồi liên kết tệp hợp lệ với bài.
3. Người soạn gán một chuyên mục chính, có thể gán các chuyên mục bổ sung nếu được quy định; đặt loại tin, vùng hiển thị, mức nổi bật và tin liên quan. Hệ thống hiển thị bản xem trước theo giao diện công khai tương ứng, nhưng xem trước không làm thay đổi trạng thái phát hành.
4. Khi gửi duyệt, máy chủ kiểm tra trường bắt buộc, chuyên mục còn hiệu lực, liên kết tệp, slug và quy trình. Bản ghi chuyển sang trạng thái chờ ở bước đầu; hệ thống lưu thời điểm gửi và người gửi. Nếu quy trình có nhiều bước, chỉ người/nhóm được giao ở bước hiện hành nhận quyền xử lý.
5. Người duyệt mở bản ghi trong phạm vi được giao, đọc nội dung và tệp, xem lịch sử, rồi chọn duyệt hoặc trả lại kèm lý do. Trả lại đưa bài về người soạn và ghi chú trở thành bắt buộc; thay đổi nội dung sau duyệt làm mất hiệu lực phê duyệt của phiên bản cũ hoặc khởi tạo lại bước duyệt theo quy tắc được chốt.
6. Người có quyền phát hành duyệt lần cuối, đặt thời điểm xuất bản nếu có chức năng hẹn giờ, rồi xác nhận. Chỉ bản ghi được duyệt, đến thời điểm hiệu lực và không bị gỡ mới xuất hiện trên danh sách/chi tiết công khai. Gỡ bài ghi người, lý do, thời điểm; dữ liệu quan hệ/tệp không bị xóa vật lý theo thao tác gỡ.
7. Sửa bài đã phát hành tạo phiên bản cập nhật và giữ khả năng truy nguyên phiên bản trước. Tùy chính sách, sửa trường hiển thị có thể yêu cầu duyệt lại. Xóa cứng chỉ dành cho quản trị được phân quyền và chỉ khi không còn tham chiếu; thao tác thông thường ưu tiên lưu trữ/ngừng hiển thị.

### Dữ liệu logic

| Đối tượng | Trường nghiệp vụ chính | Ghi chú |
|---|---|---|
| Tin | mã; tiêu đề; mô tả; nội dung; tác giả/nguồn; ngôn ngữ; loại tin; chuyên mục chính; danh sách chuyên mục phụ; ảnh đại diện; slug; SEO; thời điểm dự kiến/thực tế; trạng thái; người tạo/cập nhật | Slug duy nhất trong phạm vi site/ngôn ngữ theo quy tắc Chủ đầu tư duyệt; lịch sử phiên bản tách khỏi bản ghi hiện hành |
| Quan hệ tin | tin; tin liên quan; thứ tự; vùng hiển thị; thời điểm tạo | Kiểm tra đối tượng đích còn tồn tại và có thể công khai |
| Tệp bài tin | tin; mã tệp; vai trò tệp; thứ tự; chú thích | Metadata tệp nằm trong kho tệp; bản ghi quan hệ không thay thế kiểm tra quyền truy cập |
| Nhật ký biên tập | đối tượng; phiên bản; hành động; trạng thái trước/sau; tác nhân; thời điểm; lý do | Nhật ký bất biến ở cấp nghiệp vụ; thời hạn lưu do Chủ đầu tư chốt |

### Quy tắc, trạng thái và quyền

Tefli sẽ cấu hình kiểm tra trường bắt buộc theo loại tin; tiêu đề và dữ liệu nhận diện bài phải hợp lệ, các trường còn lại chỉ bắt buộc theo yêu cầu đã thống nhất. Hệ thống tự sinh slug, kiểm tra trùng và chuẩn hóa đường dẫn; khi đổi slug của bài đã phát hành, lưu đường dẫn cũ để chuyển hướng theo chính sách URL của Cổng. Ngày phát hành không sớm hơn thời điểm cho phép; bài hẹn giờ không hiển thị trước hạn. Quan hệ tin tự tham chiếu hoặc vòng lặp bị chặn. Tệp được liên kết phải tồn tại, đúng loại/kích thước cho phép và được người dùng có quyền lựa chọn. Nội dung HTML được làm sạch theo chính sách an toàn đã thống nhất.

### Ngoại lệ và cách xử lý

- Slug trùng: trả thông báo cụ thể, giữ bản nháp để người soạn điều chỉnh; không ghi đè bản tin khác.
- Chuyên mục bị khóa sau khi mở biểu mẫu: khi lưu/gửi lại phải xác thực trạng thái mới; yêu cầu chọn chuyên mục thay thế hoặc cho quản trị xử lý bản ghi cũ.
- Tệp tải lên lỗi/mất quyền: không tạo liên kết mồ côi; chỉ rõ tệp không được gắn và cho phép thử lại.
- Người duyệt không còn được phân công hoặc quy trình thay đổi: từ chối thao tác theo phiên bản quy trình hiện hành, thông báo cho quản trị, giữ nguyên trạng thái để phân công lại.
- Hai người sửa đồng thời: phát hiện phiên bản đã thay đổi, yêu cầu tải lại/so sánh; không âm thầm ghi đè.
- Lỗi mạng sau khi bấm gửi/phát hành: người dùng có thể truy vấn trạng thái; thao tác lặp có mã định danh/idempotency ở mức thiết kế để tránh phát hành hai lần.
- Gỡ hoặc xóa tin đang được liên kết từ trang khác: cảnh báo tham chiếu, yêu cầu xác nhận và lưu nhật ký; không xóa tệp dùng chung.
- Nội dung có mã nhúng hoặc HTML không an toàn: từ chối hoặc làm sạch theo allowlist; ghi nhận lỗi kiểm tra mà không làm mất nội dung hợp lệ khác.

### Tình huống nghiệm thu

1. Tạo tin với tiêu đề, nội dung, chuyên mục đang hoạt động, ảnh và slug chưa dùng; lưu nháp, thoát/mở lại; đối chiếu toàn bộ trường và xác nhận chưa xuất hiện ở cổng.
2. Nhập slug trùng bài đã có; hệ thống từ chối lưu/phát hành, chỉ rõ slug xung đột và giữ các trường khác.
3. Gửi tin theo quy trình hai bước; tài khoản không được giao không thể duyệt; người bước một duyệt thì bài sang đúng bước hai, chưa ra công khai.
4. Người duyệt trả lại kèm lý do; tác giả thấy lý do và chỉnh sửa; lịch sử thể hiện người/thời điểm/trạng thái trước-sau.
5. Phát hành bài hợp lệ; xác nhận danh sách/chi tiết công khai chỉ hiện khi thỏa điều kiện trạng thái/thời điểm; gỡ bài thì URL xử lý theo quy tắc đã duyệt và nhật ký còn nguyên.
6. Tài khoản không quyền gọi thao tác sửa/xóa trực tiếp ở lớp dịch vụ; máy chủ từ chối dù giao diện không phải điểm xuất phát của yêu cầu.


## 17. Quản lý hồ sơ văn bản

**Trường hợp sử dụng:** UC17 — Quản lý hồ sơ văn bản.

### Vai trò, phạm vi và màn hình

Người nhập hồ sơ chịu trách nhiệm nhập metadata/tệp; chuyên viên pháp chế hoặc đầu mối văn bản rà soát thông tin hiệu lực và quan hệ; người có thẩm quyền duyệt hoặc xác nhận phát hành; quản trị danh mục quản lý hình thức, lớp, lĩnh vực và cơ quan tham chiếu. Nghiệp vụ QPPL và CĐĐH có thể dùng chung màn hình nhưng phải giữ loại nghiệp vụ để áp dụng đúng trường bắt buộc, quy tắc kiểm tra và tra cứu. Chỉ người được phép trong phạm vi tổ chức mới được sửa hoặc xóa; khách truy cập tra cứu theo tập văn bản được công khai.

Danh sách quản trị cần có lọc theo số/ký hiệu, trích yếu, loại/hình thức, lớp, cơ quan, lĩnh vực, người ký, ngôn ngữ, ngày ban hành, ngày hiệu lực, tình trạng và trạng thái đăng. Hiển thị trạng thái hiệu lực tính từ dữ liệu và ngày hiện tại; nếu dữ liệu nguồn khai báo trạng thái khác, cần chỉ ra sai khác thay vì tự sửa. Form chia phần nhận dạng (loại, số/ký hiệu, hình thức, trích yếu, ngôn ngữ), cơ quan/lĩnh vực/lớp, mốc thời gian, nội dung/tệp, quan hệ thay thế/sửa đổi/liên quan và phát hành/ghi chú. Giao diện tệp cần cho biết tên, loại, dung lượng, thứ tự, phiên bản và kết quả kiểm tra, tránh lộ đường dẫn lưu trữ nội bộ.

[FIG:document-lifecycle]

### Luồng xử lý chính



1. Chuyên viên chọn nhóm hồ sơ (QPPL, CĐĐH hoặc nhóm khác đã được Chủ đầu tư xác nhận), chọn ngôn ngữ và nhập số/ký hiệu, hình thức, trích yếu, cơ quan ban hành, người ký cùng các mốc thời gian theo hồ sơ gốc.
2. Hệ thống đưa danh sách tham chiếu từ danh mục đã quản trị. Người dùng gán một hoặc nhiều lớp/lĩnh vực/cơ quan theo nghiệp vụ; các quan hệ lưu cùng giao dịch hoặc theo cơ chế đảm bảo nhất quán để không để lại hồ sơ thiếu liên kết khi xảy ra lỗi giữa chừng.
3. Người dùng tải tệp gốc và tệp công bố/đính kèm nếu khác nhau, kiểm tra xem trước/tải xuống. Lưu mã tệp và metadata; không ghi đường dẫn tùy ý vào giao diện công khai. Nội dung mô tả văn bản có thể được nhập hoặc trích xuất có kiểm soát, nhưng bản gốc là căn cứ.
4. Người dùng bổ sung tình trạng hiệu lực, ngày hiệu lực/hết hiệu lực, hết hiệu lực một phần và văn bản bị tác động nếu áp dụng; gắn văn bản sửa đổi, thay thế hoặc liên quan qua quan hệ có kiểu và chiều rõ ràng.
5. Lưu nháp để rà soát; trình người có thẩm quyền kiểm tra bản ghi so với hồ sơ gốc. Phê duyệt hồ sơ và đưa lên công khai là hai thao tác có thể tách quyền. Khi được duyệt và xuất bản, hồ sơ trở thành kết quả tra cứu; các lần sửa sau lưu phiên bản và có thể cần duyệt lại.
6. Khi thông tin hiệu lực thay đổi hoặc có văn bản tác động, chuyên viên cập nhật bản ghi liên quan và xác nhận quan hệ hai đầu. Trạng thái trên cổng phải nêu mốc và căn cứ, không chỉ đổi nhãn bằng thao tác thủ công thiếu nhật ký.

### Dữ liệu logic

| Đối tượng | Trường nghiệp vụ chính | Ghi chú |
|---|---|---|
| Hồ sơ văn bản | mã; nhóm nghiệp vụ; số/ký hiệu; hình thức; trích yếu; nội dung; ngôn ngữ; cơ quan; người ký/chức danh; ngày ban hành/ký/công bố; trạng thái hồ sơ | Nhóm nghiệp vụ điều khiển bộ trường và quy tắc áp dụng cho từng loại hồ sơ |
| Hiệu lực | ngày hiệu lực; ngày hết hiệu lực; còn hiệu lực; hết hiệu lực một phần; tình trạng; ghi chú/căn cứ | Tách ngày và tình trạng nguồn để xử lý dữ liệu không thống nhất |
| Phân loại | lớp văn bản; lĩnh vực; cơ quan ban hành | Quan hệ nhiều-nhiều nếu nghiệp vụ yêu cầu; danh mục do vai trò quản trị sửa |
| Tệp văn bản | mã hồ sơ; mã tệp; loại tệp (gốc/công bố/phụ lục); thứ tự; tên hiển thị; phiên bản | Đường dẫn lưu trữ thuộc tầng tệp, không phải trường nhập tự do |
| Quan hệ văn bản | hồ sơ nguồn; hồ sơ đích; kiểu quan hệ; phạm vi tác động; ghi chú | Kiểu quan hệ cần thống nhất: sửa đổi, thay thế, bãi bỏ, liên quan |

### Quy tắc, trạng thái và quyền

Tefli sẽ kiểm tra số/ký hiệu và trích yếu theo yêu cầu hồ sơ, chuẩn hóa khoảng trắng/ký tự tìm kiếm nhưng vẫn giữ nguyên dữ liệu pháp lý gốc. Ngày ban hành/hiệu lực/hết hiệu lực có thể thiếu nếu hồ sơ chưa có thông tin; nếu đủ các mốc thì phát hiện ngày hết hiệu lực sớm hơn ngày hiệu lực, ngày ký sau ngày ban hành bất hợp lý hoặc mốc thiếu căn cứ và yêu cầu xác nhận. Không tự tính hiệu lực pháp lý chỉ từ một ngày nếu có trạng thái bị sửa đổi/bãi bỏ một phần. Tệp phải còn tồn tại, mở được, có loại được chấp nhận; kiểm tra trùng số/ký hiệu theo phạm vi loại/ngôn ngữ/cơ quan do Chủ đầu tư quyết định.

### Ngoại lệ và ca nghiệm thu

Nếu số/ký hiệu đã tồn tại, người dùng xem bản ghi trùng để chọn sửa hoặc xác nhận hồ sơ khác biệt; không tự động gộp. Nếu tài liệu gốc thiếu ngày, lưu được trạng thái “chưa xác định” theo chính sách, nhưng không hiển thị khẳng định hiệu lực. Nếu một văn bản tác động tới nhiều hồ sơ, yêu cầu chọn hồ sơ đích và loại tác động, hiển thị cảnh báo khi chỉ cập nhật một đầu. Nếu tệp bị mất sau khi liên kết, báo lỗi và đưa vào danh sách cần xử lý; không xóa metadata âm thầm. Nếu lỗi cập nhật quan hệ sau khi lưu hồ sơ, giao dịch phải rollback hoặc có cơ chế phục hồi/đánh dấu lỗi để tránh bản ghi nửa vời.

Tình huống nghiệm thu: (1) tạo hồ sơ QPPL có nhiều lĩnh vực, cơ quan và tệp gốc; đối chiếu lại quan hệ sau khi tải trang; (2) nhập ngày hết hiệu lực nhỏ hơn ngày hiệu lực và xác nhận lỗi định vị trường; (3) tạo quan hệ văn bản sửa đổi và xác nhận hai đầu/kiểu quan hệ; (4) người nhập không có quyền công khai thử thao tác API trực tiếp và bị từ chối; (5) hồ sơ công khai được cập nhật tình trạng một phần, giữ lịch sử và công khai đúng cảnh báo sau khi duyệt; (6) tệp bị lỗi hoặc không còn quyền tải không thể được trình duyệt như tệp hợp lệ.

## 18. Quản lý Chuyên trang Bộ trưởng

**Trường hợp sử dụng:** UC18 — Quản lý Chuyên trang Bộ trưởng.

### Vai trò, phạm vi và màn hình

Tefli sẽ triển khai vai trò: biên tập viên chuyên trang soạn bài và cấu hình khu vực trong phạm vi được giao; đầu mối văn phòng kiểm tra phát ngôn/chỉ đạo và ưu tiên; người duyệt phê duyệt; người xuất bản phát hành; quản trị cổng quản lý mẫu, menu, vị trí và danh mục. Phạm vi bản ghi phải có khóa chuyên trang rõ ràng, để danh sách “Bộ trưởng” không phụ thuộc suy luận từ tiêu đề hoặc loại tin. Khách công khai chỉ thấy nội dung phát hành.

Màn hình danh sách thống nhất nội dung tin chuyên trang với các cột loại nội dung, tiêu đề, khu vực, thứ tự, ngày hiệu lực, trạng thái, người cập nhật và quyền hành động. Form nội dung dùng trường tin chung khi phù hợp, cộng thuộc tính chuyên trang, loại chỉ đạo/phát biểu, ảnh/tệp/media, thời gian hiển thị, vị trí banner/khối, liên kết đích và thứ tự ưu tiên. Màn hình cấu hình gồm menu, nhóm tin/khối trang chủ, banner và thiết lập bản dịch/nhận diện nếu HSYC yêu cầu. Mọi cấu hình có xem trước trước khi áp dụng.

### Luồng chính và dữ liệu

Người biên tập tạo nội dung mới hoặc chọn nội dung dùng chung theo chính sách; gắn rõ mã chuyên trang và loại bài. Với nội dung chỉ đạo/phát biểu, nhập ngày, nguồn xác thực, người phát biểu, bản ghi/tệp hoặc liên kết media; metadata hiển thị phải được soát. Người biên tập gán khu vực hiển thị (trang chủ/danh sách/khối nổi bật), thứ tự và thời gian bắt đầu/kết thúc; xem trước với dữ liệu và layout dự kiến. Nội dung đi qua quy trình duyệt tương ứng, người duyệt xác nhận cả văn bản lẫn vị trí hiển thị, người xuất bản kích hoạt. Tefli sẽ cấu hình tác vụ thời gian để tự ngừng hiển thị khi hết hạn. Cập nhật menu/banner cũng có phiên bản, người thực hiện và khả năng phục hồi cấu hình trước.

| Đối tượng logic | Trường chính | Quan hệ/ý nghĩa |
|---|---|---|
| Nội dung chuyên trang | mã nội dung; mã chuyên trang; nội dung gốc; loại bài; tiêu đề; nguồn/ngày; trạng thái | Có thể tham chiếu tin dùng chung, không sao chép không kiểm soát |
| Vị trí hiển thị | nội dung; khu vực; thứ tự; bắt đầu/kết thúc; trạng thái | Chặn lịch trùng nếu hai mục không thể cùng giữ vị trí |
| Cấu hình chuyên trang | menu; banner; khối; nhận diện; ngôn ngữ; phiên bản | Giá trị chỉ áp dụng trong phạm vi chuyên trang |
| Nhật ký | đối tượng/cấu hình; người; hành động; thời điểm; lý do | Dùng để truy nguyên, phục hồi và đối chiếu |

Quy tắc bắt buộc gồm: không xuất bản khi chưa duyệt; kiểm tra thời gian hiệu lực; đường dẫn banner/ảnh hợp lệ; liên kết đích dùng giao thức an toàn được phép; nội dung thuộc đúng chuyên trang; không cho đặt hai mục cùng vị trí/thứ tự trong cùng khoảng thời gian nếu chính sách không cho phép. Quyền cấu hình trang chủ khác quyền biên tập bài. Trạng thái áp dụng: Nháp → Chờ duyệt → Được duyệt → Đang hiển thị → Hết lịch/Gỡ; thay đổi cấu hình đang chạy tạo phiên bản mới và có bước xác nhận.

### Ngoại lệ và ca nghiệm thu

Nếu bài được dùng ở nhiều nơi, thay đổi bài gốc phải cảnh báo nơi đang tham chiếu; nếu bài chỉ thuộc chuyên trang, hệ thống không đưa vào luồng tin chung. Lịch banner hết hạn hoặc thiếu ảnh phải bị chặn trước phát hành. Nếu một nội dung bị gỡ khi đang là mục đầu trang, hệ thống cần áp dụng phương án dự phòng đã cấu hình và ghi sự kiện. Nếu hai biên tập viên đồng thời thay đổi menu, kiểm soát xung đột phiên bản và yêu cầu tải lại.

Ca nghiệm thu: (1) tạo bài phát biểu gắn Bộ trưởng, duyệt và xác nhận chỉ xuất hiện ở vị trí đã chọn; (2) bài thuộc chuyên trang khác không lọt vào danh sách Bộ trưởng; (3) banner bắt đầu/kết thúc theo lịch và không hiển thị trước hạn; (4) người có quyền viết nhưng không quyền cấu hình không thể sửa menu cả trên UI lẫn API; (5) cấu hình mới lỗi/không hợp lệ có thể phục hồi phiên bản trước; (6) nội dung hết lịch bị ẩn theo đúng chính sách, còn lịch sử.

## 19. Quản lý trang Đảng bộ Bộ Nội vụ

**Trường hợp sử dụng:** UC19 — Quản lý trang Đảng bộ Bộ Nội vụ.

### Phạm vi và vai trò

Tefli sẽ khảo sát cùng Chủ đầu tư để chốt cấu trúc trang Đảng bộ, mối quan hệ với các chuyên trang khác, phạm vi tin/văn bản/lịch sử/tổ chức/banner/menu/media, nguồn nội dung, nhận diện và cấp duyệt. Sau khi chốt, Tefli sẽ cấu hình mã chuyên trang và phạm vi dữ liệu riêng. Biên tập viên Đảng bộ quản lý nội dung; người duyệt xử lý theo cấp được phân công; quản trị cổng vận hành cấu hình khung/menu; khách truy cập xem nội dung đã công khai. Quan hệ chia sẻ nội dung được khai báo tường minh và giữ lịch sử khi một bên gỡ bài.

Màn hình danh sách có lọc theo chuyên mục, loại nội dung, thời gian/sự kiện, trạng thái và người soạn. Form cấu hình gồm nhận diện, menu nhiều cấp, banner, khối nội dung, trang chủ, trang danh sách/chi tiết, liên kết tài liệu và nội dung nền. Màn hình biên tập cho phép xem trước cả đầu trang, danh sách, breadcrumb và chi tiết theo từng loại nội dung. Cấu hình chuyên trang không làm thay đổi giao diện các chuyên trang khác.

### Luồng, mô hình dữ liệu và kiểm soát

Sau khi chốt phạm vi, quản trị tạo cấu hình chuyên trang (mã, tên, nhận diện, domain/path, ngôn ngữ, trạng thái); khai báo menu, chuyên mục và quy trình gắn cho phạm vi đó. Người biên tập tạo bài, gắn chuyên trang và chuyên mục, điền nội dung/tệp/nguồn; có thể tham chiếu bản ghi dùng chung nhưng phải xem rõ quyền và nơi hiển thị. Bản ghi đi qua quy trình duyệt và phát hành; API/khối công khai lọc theo mã chuyên trang và trạng thái, không chọn chỉ từ URL. Quản trị thay đổi menu/banner tạo phiên bản cấu hình có xem trước và bước xác nhận. Migration (nếu thực hiện) cần giữ khóa nguồn, quy tắc gán chuyên mục, báo cáo bản ghi không ánh xạ và đối soát riêng; Nhà thầu lập mapping riêng theo nguồn dữ liệu và phạm vi Đảng bộ đã được xác nhận.

| Đối tượng logic | Trường | Quy tắc |
|---|---|---|
| Chuyên trang | mã; tên; nhận diện; đường dẫn; ngôn ngữ; trạng thái; chủ sở hữu | mã ổn định, không đổi theo tên hiển thị |
| Nội dung | mã; mã chuyên trang; loại; chuyên mục; nội dung; nguồn; trạng thái; lịch phát hành | mặc định chỉ thuộc một phạm vi; chia sẻ phải tường minh |
| Điều hướng | mã chuyên trang; nút cha/con; nhãn; URL đích; thứ tự; trạng thái | không có vòng lặp, không trỏ nội dung không truy cập |
| Cấu hình hiển thị | vùng; đối tượng; thứ tự; thời hạn; phiên bản | cô lập theo chuyên trang |
| Ánh xạ dữ liệu (nếu di trú) | hệ nguồn; khóa nguồn/đích; kết quả; lỗi; thời điểm | phục vụ đối soát, không thay cho nghiệm thu |

Phân quyền theo mã chuyên trang và thao tác; người không thuộc phạm vi không được đọc bản nháp. Luồng trạng thái được cấu hình thống nhất với cổng biên tập: Nháp → Chờ duyệt → Đã duyệt → Công khai; bài trả lại được đưa về người soạn kèm lý do. Slug/URL phải duy nhất trong cấu trúc đã chốt; thay cấu trúc đường dẫn phải có bảng chuyển hướng; nội dung không có chuyên trang hợp lệ bị chặn xuất bản. Khi đổi menu, kiểm tra liên kết gãy và hiển thị cảnh báo.

### Ngoại lệ và ca nghiệm thu

Tefli sẽ cấu hình phạm vi nội dung Đảng bộ tách biệt với các chuyên trang khác; quan hệ chia sẻ nội dung chỉ được thiết lập theo danh mục do Chủ đầu tư duyệt. Bản ghi di trú thiếu khóa/liên kết được đưa vào hàng xử lý lỗi, không tự gán vào chuyên mục tương tự. Nếu người biên tập bị thu hồi quyền giữa phiên, máy chủ từ chối lần ghi kế tiếp. Nếu menu trỏ tới trang không công khai, không phát hành cấu hình và hiển thị nguyên nhân.

Ca nghiệm thu: (1) tạo nội dung Đảng bộ và xác nhận phạm vi dữ liệu chỉ xuất hiện ở trang Đảng bộ; (2) thử truy cập bản nháp của trang bằng tài khoản ngoài phạm vi và bị từ chối; (3) tạo menu nhiều cấp, kiểm tra thứ tự, URL và phát hiện vòng lặp; (4) thay đổi cấu hình trang chủ, xem trước rồi phát hành; route khác không bị ảnh hưởng; (5) chạy đối soát mẫu mapping đã được Chủ đầu tư duyệt, báo cáo đủ số bản ghi ánh xạ/lỗi và truy nguyên khóa nguồn; (6) xác nhận riêng bằng biên bản mối quan hệ/khác biệt giữa nội dung chuyên trang khác và phạm vi Đảng bộ.

## 20. Quản lý đa phương tiện

**Trường hợp sử dụng:** UC20 — Quản lý đa phương tiện.

### Vai trò, giao diện và luồng

Người phụ trách media tạo album và nhập metadata; biên tập viên phân loại, sắp xếp, gắn ảnh bìa và chú thích; người duyệt xác nhận quyền sử dụng/nội dung; người xuất bản kích hoạt; quản trị viên quản lý danh mục, dung lượng và nguồn nhúng được phép. Màn hình danh sách gom các loại media nhưng có bộ lọc theo loại, chủ đề, chuyên mục, trạng thái, thời gian và người tạo. Màn hình album có tab thông tin, danh sách mục, sắp xếp, bản xem trước và lịch sử. Form mục media tách tệp gốc, bản chuyển mã/thumbnail nếu có, caption, mô tả thay thế, nguồn/tác giả, ngày, vị trí và quyền sử dụng. Không coi URL ngoài là tệp đã được quản lý.

Tefli sẽ triển khai luồng chọn loại album → tạo tiêu đề/mô tả/chuyên mục/ngôn ngữ → tải một hoặc nhiều tệp → kiểm tra định dạng, kích thước, tên và nội dung → sắp xếp, chọn ảnh bìa, nhập caption/alt text và bản quyền → xem trước → trình duyệt → phê duyệt/xuất bản. Với video/audio nhúng, hệ thống chỉ nhận nhà cung cấp/URL trong danh sách cho phép, lưu URL chuẩn hóa, tên nguồn và quyền sử dụng; nội dung nhúng được cách ly khỏi vùng quản trị. Sửa album đang công khai tạo phiên bản metadata; việc thay/xóa tệp đang được tham chiếu có cảnh báo và quy trình duyệt.

| Đối tượng logic | Trường chính | Ghi chú |
|---|---|---|
| Album | mã; loại media; tiêu đề; mô tả; chuyên mục; ảnh bìa; ngôn ngữ; trạng thái; người/giờ | Một album có nhiều mục; loại album cố định sau khi tạo hoặc đổi có kiểm soát |
| Mục media | mã album; mã tệp hoặc URL nguồn; thứ tự; chú thích; alt text; thời lượng/kích thước; bản quyền | Tùy loại, trường kỹ thuật có thể do dịch vụ trích xuất |
| Nguồn nhúng | nhà cung cấp; URL chuẩn; mã nội dung; cho phép nhúng; trạng thái xác minh | Dịch vụ chỉ tiếp nhận nguồn trong danh sách cho phép và kiểm tra an toàn đích |
| Nhật ký tệp | mã tệp; kết quả kiểm tra; người tải; phiên bản; liên kết | Có thể truy ra album sử dụng tệp |

### Quy tắc, trạng thái và ngoại lệ

Chỉ kiểu MIME/đuôi/dung lượng được cho phép theo chính sách cấu hình; không tin MIME do trình duyệt tự khai. Tệp virus/nguy cơ, tệp hỏng hoặc trùng checksum phải được xử lý theo quy trình duyệt/loại bỏ đã thống nhất. Ảnh công khai cần thumbnail/alt text theo yêu cầu khả năng tiếp cận; video/audio cần poster/caption hoặc mô tả nếu HSYC yêu cầu. Thứ tự là duy nhất trong album; album công khai cần ít nhất một mục hợp lệ, trừ album chỉ có nội dung nhúng được phê duyệt. Liên kết nguồn chết hoặc bị nhà cung cấp chặn được đánh dấu cần xử lý và không phát tự động. Trạng thái áp dụng: Nháp → Chờ duyệt → Đã duyệt → Công khai → Tạm ẩn/Ngừng phát hành. Gỡ album không xóa file dùng chung; xóa file chỉ khi không còn tham chiếu và được quyền.

Ngoại lệ gồm: upload một phần thất bại thì báo từng tệp và giữ lại các tệp thành công ở trạng thái nháp; tải lại trùng không tạo bản sao ngoài chính sách; lỗi chuyển mã giữ tệp gốc nhưng không cho hiển thị nếu trải nghiệm phụ thuộc bản chuyển mã; URL nhúng sai domain bị chặn; xóa mục đang được nội dung khác sử dụng phải cảnh báo; thao tác sắp xếp đồng thời phải phát hiện phiên bản xung đột.

### Tình huống nghiệm thu

1. Tạo album ảnh gồm nhiều tệp, gán thumbnail, chuyên mục, alt text và thứ tự; công khai xem được đúng thứ tự.
2. Tải tệp có phần mở rộng được phép nhưng nội dung MIME không khớp; máy chủ từ chối/đưa cách ly và ghi lý do.
3. Tạo video/audio từ nguồn nhúng nằm trong allowlist; xác nhận trang công khai phát được, nguồn và chú thích hiển thị; URL ngoài allowlist bị từ chối.
4. Tài khoản biên tập không thể phê duyệt album của chính mình khi chính sách tách vai trò; API cũng từ chối.
5. Gỡ album có tệp dùng chung; album không còn công khai nhưng bản ghi tệp liên kết khác vẫn tồn tại.
6. Upload nhiều tệp khi một tệp lỗi; kết quả từng tệp được thông báo, không mất các tệp hợp lệ đã nhận.


## 21. Quản lý lấy ý kiến nhân dân

**Trường hợp sử dụng:** UC21 — Quản lý lấy ý kiến nhân dân.

### Vai trò, phạm vi và màn hình

Đơn vị chủ trì tạo hồ sơ dự thảo và thời hạn; người biên tập chuẩn bị nội dung/tệp công bố; quản lý phân công cán bộ tiếp nhận; kiểm duyệt viên phân loại, ẩn/duyệt/từ chối ý kiến; quản trị viên cấu hình biểu mẫu/chống lạm dụng; công chúng xem dự thảo và gửi ý kiến. Hồ sơ dự thảo chỉ cho phép gửi ý kiến trong khung thời gian và theo phương thức được công bố. Danh sách quản trị lọc dự thảo theo cơ quan, thời gian, trạng thái; ý kiến lọc theo hồ sơ, chủ đề, trạng thái kiểm duyệt, ngày nhận và cán bộ phụ trách. Màn hình ý kiến phải che dữ liệu cá nhân theo quyền; thống kê công khai chỉ tổng hợp, không tự động hiển thị nội dung chưa duyệt.

[FIG:feedback-moderation]

### Luồng xử lý chính



Đơn vị tạo dự thảo với trích yếu, nội dung/tệp, cơ quan chủ trì, thời gian bắt đầu/kết thúc, hướng dẫn gửi và chính sách công khai; trình duyệt và công bố. Khi người dân mở biểu mẫu, hệ thống hiển thị hồ sơ/thời hạn, trường ý kiến bắt buộc, trường liên hệ tùy chọn hoặc bắt buộc theo quyết định, thông báo quyền riêng tư và cơ chế chống bot. Người dùng gửi nội dung và tệp nếu được hỗ trợ; máy chủ xác minh token reCAPTCHA, kiểm tra dữ liệu/tệp, giới hạn tần suất và ghi nhận thời gian nhận. Phản hồi cho người gửi là mã tiếp nhận hoặc thông báo thành công, không tiết lộ thông tin của người khác.

Ý kiến mới vào trạng thái Chờ kiểm duyệt. Quản lý có thể phân công theo hồ sơ/chủ đề, kiểm duyệt viên đọc nội dung, đánh dấu nội dung không liên quan/trùng/vi phạm, duyệt công khai hoặc từ chối/ẩn kèm lý do nội bộ. Nếu phải trả lời chính thức, trường trả lời liên kết với ý kiến nhưng không thay ý kiến gốc. Khi hết thời hạn, biểu mẫu ngừng nhận; đơn vị tổng hợp số liệu, lập báo cáo và quyết định nội dung nào được công khai. Bất kỳ tái mở đợt tham vấn nào cũng cần thời hạn/quyết định mới và lịch sử.

| Đối tượng logic | Trường chính | Ghi chú |
|---|---|---|
| Hồ sơ dự thảo | mã; tên/trích yếu; cơ quan; tệp; thời gian mở/đóng; trạng thái; hướng dẫn | Ngày đóng là thời điểm máy chủ; múi giờ phải thống nhất |
| Ý kiến | mã; hồ sơ; nội dung; thời điểm; thông tin người gửi được phép thu; tệp; token/chống spam dạng kết quả | Không lưu token reCAPTCHA như dữ liệu định danh lâu dài |
| Phân công | ý kiến/hồ sơ; cán bộ; thời điểm; người giao; trạng thái | Quyền xem dữ liệu cá nhân theo phạm vi |
| Kiểm duyệt/trả lời | quyết định; lý do nội bộ; nội dung trả lời; người; thời điểm; trạng thái công khai | Không sửa nội dung gốc; sửa phải là bản chỉnh có truy vết |
| Thống kê | số nhận; số hợp lệ; số trùng/ẩn; phân loại; thời điểm chốt | Công khai dưới dạng tổng hợp được duyệt |

### Quy tắc, quyền và xử lý ngoại lệ

Không nhận ý kiến trước thời gian mở hoặc sau thời gian đóng; việc chốt thời gian theo múi giờ được thống nhất và máy chủ là nguồn chuẩn. reCAPTCHA phải được xác minh phía máy chủ và lỗi/hết hạn dẫn tới không nhận bản ghi; token không thay thế giới hạn tần suất, kiểm tra nội dung và tệp. Tệp đính kèm nếu được cho phép phải giới hạn loại, dung lượng, quét mã độc và tránh công khai trước kiểm duyệt. Nội dung có dữ liệu nhạy cảm cần ẩn/giới hạn theo chính sách, nhật ký truy cập dữ liệu cá nhân và thời hạn lưu được Chủ đầu tư phê duyệt. Trạng thái áp dụng: Nháp dự thảo → Chờ duyệt → Đang lấy ý kiến → Đóng tiếp nhận → Tổng hợp/Hoàn tất; ý kiến: Mới nhận → Chờ kiểm duyệt → Đã duyệt công khai/Ẩn/Từ chối/Trùng; có thể thêm Đã trả lời. Chỉ kiểm duyệt viên được phân công quyết định hiển thị; quản lý được phân công nhưng không tự sửa nội dung nguồn.

Nếu xác minh reCAPTCHA lỗi, hiển thị thử lại và không tạo ý kiến. Nếu máy chủ lưu ý kiến nhưng phản hồi mạng thất bại, cần mã tiếp nhận hoặc cơ chế chống gửi lặp để người dân không tạo trùng. Nếu nội dung nghi spam, giữ chờ kiểm duyệt thay vì tự công khai. Nếu người gửi yêu cầu xóa dữ liệu cá nhân, thực hiện theo quy trình pháp lý/chính sách lưu trữ đã được duyệt và giữ thông tin nhật ký tối thiểu hợp lệ. Nếu cán bộ chuyển công tác, quản lý có thể phân công lại mà lịch sử cũ vẫn lưu.

### Tình huống nghiệm thu

1. Mở đợt tham vấn, gửi ý kiến hợp lệ trước hạn; nhận mã tiếp nhận và bản ghi ở trạng thái chờ duyệt.
2. Gửi token reCAPTCHA sai/hết hạn; không có bản ghi ý kiến, giao diện đưa hướng thử lại.
3. Gửi sau giờ đóng và trước giờ mở theo múi giờ đã chốt; cả hai bị từ chối, thông báo đúng thời điểm.
4. Ý kiến có tệp không được phép hoặc vượt ngưỡng cấu hình; máy chủ từ chối tệp, ghi nhận kết quả và không công khai dữ liệu.
5. Kiểm duyệt viên duyệt một ý kiến và ẩn một ý kiến khác; trang công khai chỉ hiện ý kiến được duyệt, nhật ký ghi đủ người/lý do.
6. Đối chiếu thống kê sau khi loại bản ghi trùng/ẩn; tổng số và tiêu chí có thể truy ngược tới các bản ghi nguồn.

## 22. Quản lý văn bản QPPL và văn bản CĐĐH

**Trường hợp sử dụng:** UC22 — Quản lý văn bản QPPL và văn bản CĐĐH.

### Thiết kế màn hình và luồng

Danh sách có bộ lọc chọn trước loại hồ sơ, sau đó hiển thị trường phù hợp. QPPL có thể cần số/ký hiệu, hình thức, ngày ban hành, cơ quan, lĩnh vực, ngày hiệu lực, tình trạng, quan hệ sửa đổi/bãi bỏ và văn bản hợp nhất nếu nằm trong HSYC. CĐĐH có thể cần đơn vị ban hành, người ký/chức danh, phạm vi/đối tượng, thời hạn thực hiện, mức độ lưu hành và tệp; phạm vi trường cụ thể phải được Chủ đầu tư xác nhận. Không đưa trường mật/hạn chế truy cập vào kết quả công khai nếu chưa có chính sách.

Chuyên viên chọn loại hồ sơ, hệ thống nạp form tương ứng; nhập thông tin từ bản gốc, gắn cơ quan, lĩnh vực, lớp, tệp và quan hệ. Quy tắc kiểm tra đánh dấu thiếu trường theo loại; người rà soát đối chiếu bản gốc; người có quyền xác nhận phát hành. Với văn bản đã có hiệu lực, cập nhật trạng thái cần gắn căn cứ/quan hệ; hệ thống tính trạng thái hiển thị từ các trường và quyết định có thẩm quyền. Chỉ nhóm công khai được xuất bản; văn bản nội bộ/hạn chế (nếu nằm trong phạm vi) có quyền truy cập riêng.

| Nhóm logic | Trường chung | Trường cần xác nhận riêng |
|---|---|---|
| QPPL | số/ký hiệu; hình thức; ngày ban hành; cơ quan; người ký; trích yếu; nội dung/tệp; ngày hiệu lực/hết hiệu lực; lĩnh vực; ngôn ngữ; quan hệ pháp lý | tình trạng, tác động một phần, căn cứ sửa đổi/bãi bỏ, loại hiệu lực |
| CĐĐH | số/ký hiệu; loại; cơ quan/đơn vị; người ký; ngày; trích yếu; tệp; trạng thái | đối tượng nhận; mức độ lưu hành; thời hạn/thời điểm thực hiện; cấu hình truy cập |
| Quan hệ | hồ sơ nguồn/đích; kiểu; thời điểm; căn cứ | bắt buộc/tuỳ chọn theo nhóm |

### Quy tắc và trạng thái

Chỉ tiêu tra cứu công khai phải áp dụng cùng tập dữ liệu được quyền xem. Tìm kiếm số/ký hiệu cần chuẩn hóa ký tự thường gặp nhưng giữ nguyên giá trị hiển thị gốc. Bộ lọc ngày bao gồm biên đầu/cuối nhất quán; bộ lọc cơ quan/lĩnh vực/lớp phải hỗ trợ các quan hệ đã xác nhận. Không suy ra “còn hiệu lực” nếu trường hiệu lực rỗng hoặc có quan hệ tác động chưa được giải quyết; thay bằng “chưa xác định” hoặc trạng thái được Chủ đầu tư duyệt. Trạng thái quy trình hồ sơ (nháp/chờ xác nhận/công khai/gỡ) tách khỏi hiệu lực pháp lý (còn/hết/một phần/chưa rõ). Quyền tạo/sửa, xác nhận, phát hành và truy cập tài liệu hạn chế tách biệt.

Ngoại lệ: dữ liệu nhập từ nguồn không đầy đủ được giữ ở hàng chờ và có báo cáo; văn bản trùng không tự gộp; quan hệ vòng lặp hoặc tự tham chiếu bị chặn; một văn bản vừa bị sửa đổi vừa được ghi “còn hiệu lực toàn phần” tạo cảnh báo cần xác minh; hồ sơ CĐĐH hạn chế không đưa vào API công khai; lỗi tệp không làm mất metadata nhưng ngăn công khai nếu tệp là phần bắt buộc.

### Tình huống nghiệm thu

1. Tạo QPPL với ngày hiệu lực, quan hệ sửa đổi và tệp; tra cứu theo số/ký hiệu, cơ quan và khoảng ngày, kết quả khớp bản ghi.
2. Tạo CĐĐH theo form riêng; trường đặc thù được lưu/hiển thị đúng và không bị bỏ qua khi mở lại.
3. Hồ sơ có mốc hết hiệu lực đã qua nhưng chưa được xác nhận nguồn; cổng hiển thị theo quy tắc “cần xác minh”, không khẳng định sai hiệu lực.
4. Tài khoản công khai tìm hồ sơ hạn chế; kết quả và API không để lộ tiêu đề, tệp hoặc metadata không được phép.
5. Cập nhật QPPL tác động một phần; lưu căn cứ, liên kết hồ sơ bị tác động và trạng thái có thể đối chiếu.
6. Thử lọc biên ngày, lớp cha/con và nhiều cơ quan/lĩnh vực; so sánh kết quả với tập dữ liệu được duyệt.


## 23. Quản lý Hội nghị - Sự kiện

**Trường hợp sử dụng:** UC23 — Quản lý Hội nghị - Sự kiện.

### Vai trò, màn hình và luồng



Đơn vị tổ chức tạo sự kiện, chịu trách nhiệm thời gian/địa điểm/đầu mối; biên tập viên soạn tin giới thiệu và cập nhật chương trình; người duyệt kiểm tra nội dung công bố; người xuất bản đưa ra cổng; quản trị viên quản lý danh mục loại sự kiện. Màn hình danh sách lọc loại, ngày/giờ, đơn vị, trạng thái và địa điểm, đồng thời hiển thị sự kiện sắp tới/đã qua theo mốc. Form có thông tin chung, thời gian, địa điểm, mô tả, chương trình, thành phần công khai, hình ảnh, tệp và liên kết nội dung/tin. Timeline dùng dữ liệu sự kiện đã duyệt, cho phép cấu hình cách biểu diễn nhiều ngày/phiên khi được xác nhận.

Luồng: tạo bản nháp → nhập loại, tiêu đề, thời gian bắt đầu/kết thúc, địa điểm, đơn vị tổ chức và mô tả → thêm phiên/hoạt động nếu có → gắn ảnh/tệp/chương trình → xem trước → gửi duyệt → phê duyệt/xuất bản. Sau khi kết thúc, sự kiện không bị xóa; có thể lưu trữ/đánh dấu đã diễn ra, giữ trang chi tiết và tài liệu nếu chính sách yêu cầu. Cập nhật giờ/địa điểm sau khi công bố phải ghi phiên bản và yêu cầu duyệt lại; thông báo thay đổi cho công chúng phụ thuộc phạm vi HSYC.

[FIG:event-flow]

| Đối tượng logic | Trường | Quy tắc |
|---|---|---|

| Sự kiện | mã; tiêu đề; loại; mô tả; đơn vị; địa điểm; múi giờ; bắt đầu/kết thúc; trạng thái | Múi giờ chuẩn do Chủ đầu tư xác nhận |
| Phiên | mã sự kiện; tên; bắt đầu/kết thúc; địa điểm; thứ tự; nội dung | Không chồng mốc trái logic; thứ tự ổn định |
| Thành phần | tên/đơn vị/chức vụ hoặc nhóm; mức công khai; thứ tự | Chỉ thu thập dữ liệu cá nhân cần thiết |
| Tệp/liên kết | mã sự kiện; mã tệp; loại; URL; chú thích | Chỉ loại/URL hợp lệ |
| Nhật ký | tác nhân; hành động; thời điểm; trước/sau; lý do | Bao gồm thay đổi lịch đã công khai |

### Quy tắc, trạng thái và ngoại lệ

Thời gian kết thúc không trước thời gian bắt đầu; mọi mốc lưu theo quy ước múi giờ và hiển thị nhất quán. Sự kiện nhiều ngày có trường thời gian rõ; timeline sắp theo giờ bắt đầu thay vì ngày nhập. Loại sự kiện đang được sử dụng không thể xóa cứng; phải ẩn/ngừng dùng. Trạng thái quy trình: Nháp → Chờ duyệt → Đã duyệt → Sắp diễn ra/Đang diễn ra/Đã diễn ra (trạng thái thời gian) → Lưu trữ/Gỡ. Trạng thái biên tập và trạng thái theo lịch là hai chiều riêng. Quyền sửa sự kiện và xác nhận xuất bản phân tách. Không công khai thông tin thành phần không được phép hoặc tệp nội bộ.

Nếu thay đổi giờ sau khi đã công bố, yêu cầu duyệt lại và ghi lý do; nếu nhiều phiên chồng giờ, cảnh báo nhưng cho phép khi người có thẩm quyền xác nhận. Nếu chưa có mốc kết thúc, cho phép chỉ khi loại sự kiện quy định hoặc cần xác nhận; nếu tệp chương trình không tải được, không đánh dấu hoàn tất phát hành khi tệp là bắt buộc. Nếu loại sự kiện bị ngừng sử dụng giữa lúc soạn, giữ giá trị lịch sử và yêu cầu chọn loại hiện hành trước lần gửi mới.

### Tình huống nghiệm thu

1. Tạo sự kiện tương lai có tệp chương trình; duyệt và xác nhận hiển thị trên danh sách đúng thứ tự thời gian.
2. Nhập giờ kết thúc trước giờ bắt đầu; hệ thống từ chối lưu và đánh dấu cả hai trường.
3. Tạo sự kiện nhiều ngày/nhiều phiên; timeline hiển thị đúng thứ tự, múi giờ và trạng thái sắp diễn ra/đã diễn ra.
4. Thay đổi địa điểm sau khi công khai; hệ thống lưu phiên bản và yêu cầu duyệt lại, không cập nhật công khai âm thầm.
5. Người dùng không có quyền duyệt gọi trực tiếp thao tác công khai; máy chủ từ chối.
6. Ẩn loại sự kiện đang được hồ sơ cũ sử dụng; sự kiện lịch sử vẫn hiển thị loại và dữ liệu không bị mất.


## 24. Quản trị hệ thống và người dùng

**Trường hợp sử dụng:** UC24 — Quản trị hệ thống và người dùng.

### Vai trò, phạm vi và giao diện

Quản trị định danh tạo/khóa tài khoản, gán vai trò và phạm vi tổ chức; quản trị phân quyền thiết kế vai trò/quyền nhưng không tự cấp quyền cao hơn thẩm quyền; quản trị nội dung sửa menu/banner/block/danh mục trong phạm vi; cán bộ biên tập chỉ dùng chức năng nghiệp vụ đã cấp; kiểm toán/giám sát đọc nhật ký và báo cáo. Tách tối thiểu quyền xem, tạo, sửa, xóa/lưu trữ, duyệt, phát hành, quản lý tài khoản, cấp quyền, cấu hình hệ thống và xem nhật ký. Quyền nhạy cảm cần nguyên tắc hai người hoặc phê duyệt bổ sung nếu Chủ đầu tư yêu cầu.

Màn hình tài khoản hiển thị mã, tên đăng nhập, đơn vị, trạng thái, vai trò, ngày tạo/cập nhật và thông tin khóa/đăng nhập cần thiết; không hiển thị mật khẩu/secret. Form tạo/sửa khóa tài khoản, đặt trạng thái, gán vai trò/phạm vi, đặt thời hạn hoặc yêu cầu đổi mật khẩu nếu chính sách. Màn hình vai trò cho phép xem quyền theo nhóm chức năng, so sánh trước/sau và xác nhận; không cho cấp trực tiếp quyền quản trị quyền. Màn hình menu/cấu hình có bản xem trước, phiên bản, trạng thái bật/tắt, thứ tự và nhật ký. Danh mục dùng chung có thông tin số lượng tham chiếu trước khi ngừng/xóa.



### Luồng quản trị và mô hình logic

[FIG:rbac]

Quản trị viên tạo tài khoản bằng định danh duy nhất, khai báo đơn vị/phạm vi và trạng thái; tiếp đó gán một hoặc nhiều vai trò trong ma trận được phê duyệt. Hệ thống gửi hướng dẫn kích hoạt theo kênh được thống nhất và không ghi thông tin xác thực vào nhật ký. Khi thay đổi vai trò, quản trị viên xem quyền trước/sau, nhập lý do và thời hạn nếu quyền tạm thời; thao tác có mức độ nhạy cảm được yêu cầu xác nhận bổ sung.

Quản trị phân quyền cấu hình tập quyền theo chức năng và phạm vi tài nguyên. Cán bộ được phép quản lý menu, banner, block và danh mục thay đổi cấu hình ở bản nháp, xem trước, duyệt/kích hoạt theo vai trò; phiên bản trước được giữ để phục hồi. Mỗi thao tác cập nhật tài khoản, vai trò, cấu hình hoặc danh mục tạo nhật ký gồm tác nhân, thời điểm, mục tiêu, trạng thái trước/sau và kết quả.

| Đối tượng logic | Trường | Kiểm soát |
|---|---|---|
| Tài khoản | mã định danh; tên đăng nhập; đơn vị/phạm vi; trạng thái; thời hạn; dấu thời gian | Không lưu mật khẩu dạng rõ; tên đăng nhập duy nhất |
| Vai trò | mã; tên; mô tả; trạng thái; quyền gắn; phạm vi | Quyền không vượt thẩm quyền của người cấp |
| Quyền | mã chức năng; hành động; phạm vi tài nguyên | Quyền tường minh theo hành động và tài nguyên |
| Gán vai trò | tài khoản; vai trò; phạm vi; thời điểm; người cấp; hạn dùng | Hỗ trợ thu hồi và truy vết |
| Cấu hình | loại; giá trị; phiên bản; trạng thái; hiệu lực | Có kiểm tra hợp lệ trước khi kích hoạt |
| Nhật ký kiểm toán | tác nhân; hành động; mục tiêu; kết quả; thời điểm; nguồn truy cập phù hợp | Không ghi bí mật/credential |


### Quy tắc quyền, ngoại lệ và nghiệm thu

Mặc định từ chối khi không có quyền tường minh. Kiểm tra cả quyền chức năng lẫn phạm vi tài nguyên; tài khoản có quyền sửa tin không mặc nhiên sửa mọi tin. Giao diện chỉ hiển thị hành động phù hợp; mọi API đọc/ghi riêng phải có xác thực/ủy quyền phù hợp với mức dữ liệu. Tài khoản bị khóa hoặc hết hạn không thể tiếp tục dùng token cũ theo chính sách phiên. Việc cấp quyền nhạy cảm cần lưu lý do và xác nhận; không cho tự nâng quyền. Cấu hình phải kiểm tra giá trị, tránh thay đổi làm hỏng menu hay lộ thông tin bí mật. Nhật ký phải đồng bộ giờ và có chính sách chống sửa/xóa trái phép.

Ngoại lệ: người quản trị cuối cùng không thể tự khóa mình nếu không còn người thay thế; thao tác khóa tài khoản đang là chủ sở hữu quy trình phải cảnh báo và yêu cầu phân công lại; thay đổi quyền bị lỗi thì rollback cả gán vai trò và nhật ký kết quả; xóa vai trò đang được dùng phải bị chặn hoặc chuyển đổi có xác nhận; API không sẵn sàng thì không báo thành công giả. Khi hai quản trị cùng sửa một vai trò, phát hiện phiên bản xung đột.

Tình huống nghiệm thu: (1) tạo vai trò biên tập chỉ xem/sửa nội dung được giao, thử bản ghi ngoài phạm vi và bị từ chối; (2) ẩn nút sửa ở UI nhưng gọi API sửa trực tiếp, máy chủ trả từ chối; (3) thu hồi vai trò đang hoạt động, token/phiên cũ mất quyền theo chính sách; (4) người không có quyền cấp vai trò quản trị thử tự gán và bị từ chối, có nhật ký; (5) cấu hình menu sai liên kết không thể kích hoạt, bản đang chạy vẫn hoạt động; (6) thử xóa danh mục/role đang được tham chiếu và nhận cảnh báo/khóa thích hợp, dữ liệu liên kết còn nguyên.

## 29. Quản lý thông tin kết nối/tích hợp hiển thị trên Cổng

**Trường hợp sử dụng:** UC29 — Quản lý thông tin kết nối/tích hợp hiển thị trên Cổng.

### Vai trò, màn hình và luồng

Quản trị nội dung liên kết tạo nhóm/liên kết; người duyệt kiểm tra tên, đích và ý nghĩa; người xuất bản kích hoạt; khách truy cập dùng liên kết công khai. Tefli sẽ cung cấp phần quản trị metadata, URL và vị trí hiển thị; đồng thời thiết kế cấu hình kết nối theo danh mục hệ thống, phương thức xác thực và chính sách truy cập được Chủ đầu tư phê duyệt. Màn hình danh sách lọc theo nhóm, vị trí, trạng thái, thời hạn và người cập nhật; form chỉnh tên, URL, mô tả, logo, vị trí, thứ tự, ngôn ngữ và thời hạn. Có thể xem trước khu vực footer/sidebar/khối đã chọn.

Tefli sẽ triển khai luồng tạo nhóm liên kết; nhập thông tin, URL chuẩn, logo, vị trí và thứ tự; kiểm tra URL; xem trước; duyệt đích nội bộ/ngoài; rồi kích hoạt. Cổng chỉ hiển thị liên kết đang hoạt động, đúng thời hạn và được phê duyệt. Thay URL đang công khai tạo phiên bản và buộc rà soát lại. Cấu hình kết nối kỹ thuật được quản lý riêng với thông tin xác thực bảo vệ an toàn, thời hạn kết nối, ghi nhận lỗi, thử lại có kiểm soát và nhật ký không chứa bí mật.

| Đối tượng logic | Trường chính | Ghi chú |
|---|---|---|
| Nhóm liên kết | mã; tên; mô tả; vị trí; thứ tự; trạng thái | Có thể lồng nhóm nếu HSYC xác nhận |
| Liên kết | mã nhóm; tên hiển thị; mô tả; URL; logo; ngôn ngữ; thứ tự; trạng thái; thời hạn | Không dùng URL làm khóa nghiệp vụ |
| Phiên bản | người sửa; trước/sau; lý do; thời điểm; trạng thái duyệt | Giữ lịch sử URL đã phát hành |
| Cấu hình kết nối | loại kết nối; định danh hệ thống; thông tin truy cập; trạng thái kiểm tra | Thông tin xác thực được bảo vệ riêng, không đưa vào trường hiển thị công khai |

### Quy tắc, quyền và ngoại lệ

Chỉ giao thức và miền được phép theo chính sách; mặc định chặn URL nguy hiểm, javascript/data URI, địa chỉ cục bộ hoặc URL không chuẩn. Nếu cần domain ngoài, người duyệt xác nhận chủ sở hữu/đích; mở liên kết tab mới cần chính sách an toàn tương ứng. Logo phải nằm trong kho tệp đã kiểm tra, có kích thước và văn bản thay thế; nhóm không có link hoạt động không hiển thị tiêu đề rỗng. Tên và thứ tự bắt buộc; thứ tự trong nhóm duy nhất hoặc quy tắc ổn định. Quyền tạo/sửa khác quyền duyệt/phát hành; chỉ cấu hình được duyệt mới ra trang công khai. Với kết nối kỹ thuật, kiểm tra trạng thái không đồng nghĩa xác thực an toàn; credential phải mã hóa/quản lý vòng đời, log không ghi secret, và quy trình retry không tạo tác dụng lặp.

### Tình huống nghiệm thu

1. Tạo nhóm và liên kết có logo, mô tả, vị trí footer, thứ tự; duyệt và xác nhận cổng hiển thị đúng khu vực.
2. Nhập URL với scheme bị cấm hoặc miền nội bộ; máy chủ từ chối, không phát hành và lưu thông báo lỗi.
3. Thay đích liên kết đang công khai; phiên bản mới chờ duyệt, phiên bản cũ tiếp tục hoạt động cho tới khi phê duyệt.
4. Tài khoản chỉ được biên tập link không thể kích hoạt/công khai hoặc thao tác API trực tiếp.
5. Ẩn nhóm có liên kết đang dùng; hệ thống cảnh báo, giữ lịch sử và không tạo nhóm rỗng công khai.
6. Nếu HSYC xác nhận tích hợp máy-máy, kiểm thử riêng kết nối thành công/thất bại, hết hạn credential, timeout/retry, nhật ký không chứa bí mật và xử lý tác dụng lặp; chỉ ghi đạt theo biên bản thực tế.





