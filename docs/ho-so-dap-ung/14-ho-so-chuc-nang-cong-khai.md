# Thuyết minh chi tiết giải pháp chức năng công khai

## Phạm vi và nguyên tắc cung cấp

Nhà thầu cam kết thiết kế, xây dựng, tích hợp, kiểm thử và bàn giao các giao diện công khai cho chín hạng mục dưới đây theo yêu cầu HSYC và thiết kế được Chủ đầu tư phê duyệt. Luồng nghiệp vụ, trường dữ liệu, quy tắc kiểm soát và tiêu chí nghiệm thu của từng chức năng được trình bày dưới đây để thống nhất yêu cầu trước khi triển khai.

Nhà thầu tổ chức giao diện công khai theo nguyên tắc lấy nội dung đã duyệt làm nguồn hiển thị, phân định rõ trang chủ, danh sách, chi tiết và chuyên trang; chia sẻ thành phần nền tảng nhưng giữ cấu hình, menu và nhận diện riêng theo phạm vi được duyệt. Biểu mẫu, tệp và liên kết được kiểm tra ở phía máy chủ; trạng thái tải, rỗng, lỗi và thành công được phản hồi rõ cho người dùng.

Nhà thầu quản lý trang Đảng bộ Bộ Nội vụ theo phạm vi nội dung riêng, với quan hệ dữ liệu và điều hướng được Chủ đầu tư phê duyệt. Nhà thầu làm rõ danh mục, nguồn dữ liệu, quyền biên tập và liên kết trước khi cấu hình; không mặc định dùng chuyên trang khác để thay thế trang Đảng bộ.

### Bảng chuyển đổi yêu cầu thành trường hợp sử dụng

| Mã use case | Chức năng | Tác nhân chính | Kích hoạt | Điều kiện trước | Kết quả |
|---|---|---|---|---|---|
| UC01 | Khai thác trang chủ | Khách truy cập | Mở trang chủ hoặc chọn một khối nội dung | Cổng được triển khai; nội dung/khối đã được duyệt để công khai | Trang chủ hiển thị theo cấu hình; người dùng đi tới đúng trang đích |
| UC02 | Duyệt chuyên mục và đọc tin | Khách truy cập | Chọn chuyên mục hoặc đường dẫn tin | Chuyên mục/tin được phép công khai | Danh sách hoặc chi tiết tin được hiển thị; tệp/liên kết mở đúng nội dung |
| UC03 | Khai thác trang Đảng bộ | Khách truy cập | Chọn mục Đảng bộ | Nhận diện, menu, danh mục và nội dung Đảng bộ đã được phê duyệt | Hiển thị đúng phạm vi Đảng bộ, phân biệt với chuyên trang khác |
| UC04 | Khai thác chuyên trang Bộ trưởng | Khách truy cập | Chọn chuyên trang Bộ trưởng | Cấu hình và nội dung chuyên trang đã được duyệt | Hiển thị trang chủ, danh sách hoặc chi tiết thuộc chuyên trang |
| UC05 | Tra cứu văn bản | Khách truy cập | Nhập điều kiện và gửi tìm kiếm | Danh mục tra cứu và dữ liệu văn bản đã sẵn sàng công khai | Danh sách có phân trang hoặc thông báo không có kết quả; mở được hồ sơ phù hợp |
| UC06 | Gửi góp ý dự thảo | Người góp ý; cán bộ tiếp nhận/kiểm duyệt | Chọn dự thảo đang lấy ý kiến và gửi biểu mẫu | Dự thảo đang nhận góp ý; biểu mẫu và chính sách dữ liệu được duyệt | Ý kiến được tiếp nhận, xác nhận và chuyển tới quy trình xử lý |
| UC07 | Khai thác thư viện đa phương tiện | Khách truy cập | Chọn loại đa phương tiện hoặc album | Album và tệp được phép công khai | Album hiển thị; đa phương tiện phát/xem đúng loại và theo quyền công bố |
| UC08 | Tra cứu hội nghị, sự kiện | Khách truy cập | Mở trang sự kiện hoặc lọc danh sách | Sự kiện được duyệt công khai | Danh sách/dòng thời gian và chi tiết sự kiện phản ánh đúng thời gian, trạng thái |
| UC09 | Điều hướng đa trang và đổi ngôn ngữ | Khách truy cập | Chuyển trang, mở URL trực tiếp hoặc đổi ngôn ngữ | Menu, quan hệ bản dịch và bố cục được cấu hình | Điều hướng, breadcrumb, nội dung và siêu dữ liệu nhất quán với trang/ngôn ngữ |

## 1. Giao diện trang chủ


**Mục đích và đối tượng.** Trang chủ là điểm vào cho người dân, cán bộ, cơ quan báo chí và các tổ chức cần tìm tin, văn bản, sự kiện, thông tin chuyên ngành và tiện ích của Bộ. Giao diện cần giúp người dùng nhận biết rõ cơ quan chủ quản, chọn ngôn ngữ, điều hướng đến đúng chuyên mục và phân biệt nội dung mới với nội dung nổi bật. Người dùng không đăng nhập để đọc các nội dung đã công khai. Biên tập viên/quản trị viên là đối tượng gián tiếp: họ chuẩn bị nội dung, menu, banner và cấu hình khối ở hệ thống quản trị; các thao tác quản trị không xuất hiện trong luồng người dùng công khai.

**Giải pháp của Nhà thầu.** Nhà thầu xây dựng trang chủ theo các khối nội dung có cấu hình: banner, tin nổi bật, danh mục, văn bản, tương tác, đa phương tiện, tiện ích và liên kết. Các vùng độc lập được tải theo mức ưu tiên phù hợp để nội dung đầu trang sẵn sàng trước, đồng thời giữ chỗ bố cục cho vùng tải sau. Cấu hình mỗi khối gồm dữ liệu nguồn, ngôn ngữ, thứ tự, trạng thái và liên kết đích; Nhà thầu cung cấp màn hình xem trước để Chủ đầu tư duyệt trước khi xuất bản.

**Khu vực màn hình.** (1) Đầu trang nhận diện Bộ, menu chính, nút tìm kiếm, bộ chọn ngôn ngữ và điều hướng nhỏ trên thiết bị hẹp; (2) banner/slider có tiêu đề thay thế, liên kết đích và điều khiển truy cập được; (3) khối tin tiêu điểm và tin theo danh mục; (4) khối văn bản/chỉ đạo, văn bản mới hoặc đang có hiệu lực; (5) khối dự thảo đang lấy ý kiến, chỉ xuất hiện theo thời gian lấy ý kiến được duyệt; (6) khối sự kiện; (7) khối ảnh/video/audio; (8) khối tiện ích/liên kết dùng chung; (9) cuối trang gồm thông tin cơ quan và liên kết đã duyệt. Thứ tự, số lượng thẻ, khả năng ẩn/hiện, nội dung tiếng Anh và vị trí từng khối là cấu hình cần thống nhất với Chủ đầu tư. Các khối phải có tiêu đề và đường dẫn “xem thêm” rõ ràng, không dùng nội dung giả lập như dữ liệu thật.

[FIG:public-home]

**Luồng chính.**

1. Người dùng mở URL trang chủ; ứng dụng hiển thị khung nhận diện, tiêu đề trang và các vùng nội dung theo cấu hình ngôn ngữ hiện hành.
2. Giao diện lấy dữ liệu công khai cho từng khối. Chỉ bản ghi được phép công khai và còn trong khoảng hiển thị mới được đưa vào danh sách; quy tắc thời gian cần được xác nhận với quy trình xuất bản.
3. Người dùng mở một thẻ tin, văn bản, sự kiện, album hoặc tiện ích; ứng dụng điều hướng đến trang đích phù hợp và giữ đường dẫn có thể chia sẻ/làm mới.
4. Người dùng nhập truy vấn tại vùng tìm kiếm và gửi; giao diện chuyển sang kết quả tìm kiếm với từ khóa được giữ lại. Với tìm kiếm tổng hợp, phạm vi nội dung, bộ lọc và cách phân trang được áp dụng thống nhất trên Cổng thông tin.
5. Người dùng đổi ngôn ngữ; giao diện nạp menu và nội dung theo bản ngôn ngữ có sẵn. Khi một nội dung chưa có bản dịch, hệ thống cần áp dụng phương án được duyệt (ẩn, báo chưa có bản dịch hoặc dẫn về bản gốc) thay vì tạo bản dịch ngầm.
6. Người dùng cuộn đến cuối trang và chọn liên kết cuối trang hoặc tiện ích; đích liên kết mở đúng trang/đơn vị đích theo quy tắc mở tab được thống nhất.

**Dữ liệu hiển thị.**

| Nhóm | Trường dữ liệu | Ghi chú nghiệp vụ |
|---|---|---|
| Khối | Tên/tiêu đề, thứ tự, vị trí, ngôn ngữ, trạng thái hiển thị | Cấu hình phải có người chịu trách nhiệm và bản xem trước |
| Banner | Tiêu đề, mô tả ngắn, ảnh, văn bản thay thế, liên kết, ngày bắt đầu/kết thúc | Không hiển thị liên kết rỗng hoặc ảnh không tải được |
| Thẻ nội dung | Tiêu đề, tóm tắt, ảnh, ngày công khai, nhãn loại, URL đích | Lấy từ nội dung đã duyệt/công khai |
| Tìm kiếm | Từ khóa, phạm vi, loại nội dung nếu được hỗ trợ | Giữ truy vấn khi điều hướng/phân trang |
| Cuối trang/tiện ích | Nhãn, URL, logo/ảnh tùy chọn, thứ tự | Chỉ dùng liên kết đã được kiểm tra và phê duyệt |

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Khách truy cập chỉ đọc nội dung công khai. Không có quyền sửa nội dung qua giao diện này. Mọi lọc theo trạng thái phải được thực hiện ở nguồn dữ liệu/dịch vụ, không dựa riêng vào việc ẩn thẻ trên trình duyệt. Banner cần có tiêu đề/alt phù hợp, kích thước ảnh và URL hợp lệ; mục hết hạn hoặc chưa đến ngày bắt đầu không được xuất hiện. Tiêu đề khối rỗng, URL hỏng, dữ liệu sai ngôn ngữ hoặc bản ghi trùng cần được xử lý theo quy tắc cấu hình; Nhà thầu không phát hành thẻ không có tiêu đề/đích hợp lệ. Nội dung HTML đưa vào trang cần được làm sạch ở điểm hiển thị. Tải trì hoãn không được làm mất khả năng điều hướng hay khiến vùng trang nhảy bố cục quá mức. Nhà thầu cam kết đáp ứng chỉ tiêu hiệu năng và áp dụng cấp hệ thống, không riêng trang chủ: HSYC yêu cầu 500 phiên truy cập công khai đồng thời, trong đó 84 phiên thực hiện tác vụ động; kịch bản tải phải gồm trang chủ, tìm kiếm, xem tin bài, tải tệp và thao tác quản trị. Tác vụ thông thường có thời gian phản hồi trung bình dưới 2,5 giây và thời gian phản hồi tối đa dưới 30 giây; tương tác trực tiếp có mục tiêu không quá 0,6 giây khi điều kiện mạng và tải cho phép; tác vụ dài phải hiển thị trạng thái xử lý. Trong kiểm thử tải danh định, CPU trung bình từng nút không vượt 75%, không có swap kéo dài và còn tối thiểu 25% dư địa tài nguyên. Nhà thầu sẽ đo kiểm các ngưỡng này trên phiên bản phần mềm hoàn thiện và môi trường nghiệm thu đã thống nhất.

**Rỗng, lỗi và biên.** Nếu một khối không có bản ghi, Nhà thầu ẩn khối hoặc hiển thị thông báo rỗng ngắn theo quyết định thiết kế; không để lại khoảng trống lớn. Nếu ảnh/banner lỗi, dùng ảnh dự phòng có alt phù hợp hoặc bỏ ảnh mà vẫn giữ tiêu đề/liên kết. Nếu một nguồn dữ liệu lỗi, các khối độc lập còn lại vẫn nên dùng được; cung cấp thông báo dễ hiểu và nút thử lại khi phù hợp. Nếu menu trống, vẫn cần đường về trang chủ và các lối điều hướng tối thiểu. Trên màn hình hẹp, menu, điều khiển slider và thẻ phải thao tác được bằng cảm ứng/bàn phím. Với trang không hỗ trợ ngôn ngữ đã chọn, phải giữ lựa chọn và thông báo rõ ràng.

**Tích hợp và luồng dữ liệu.** Nhà thầu kết nối các khối trang chủ với nội dung đã duyệt, cấu hình banner, menu, tiện ích và danh sách chuyên mục. Mỗi khối nhận đúng tập dữ liệu, thứ tự, ngôn ngữ và liên kết đích; danh sách được phân trang hoặc giới hạn theo thiết kế. Nhà thầu lập bảng ánh xạ từng vùng giao diện với nguồn dữ liệu, quy tắc công khai, ngôn ngữ và URL trước khi cấu hình.

**Kịch bản nghiệm thu.**

1. Cấu hình banner và các khối có dữ liệu mẫu đã xuất bản; kiểm tra thứ tự, tiêu đề, ảnh, liên kết và điều hướng đến đúng URL.
2. Có nội dung nháp, đã xuất bản, hết hạn và lên lịch; xác nhận chỉ các mục theo quy tắc được duyệt xuất hiện.
3. Mở trang chủ trên máy tính và màn hình hẹp; kiểm tra menu, tìm kiếm, slider, thẻ và cuối trang sử dụng được bằng bàn phím/cảm ứng.
4. Chọn tiếng Anh khi có và khi thiếu bản dịch; xác nhận menu/nội dung theo đúng chính sách bản dịch đã duyệt.
5. Làm cho một nguồn khối phản hồi lỗi và một banner có ảnh hỏng; xác nhận các vùng độc lập còn lại hoạt động và lỗi có phương án dự phòng.
6. Chọn từng đường dẫn của các khối văn bản, tin, đa phương tiện, sự kiện và tiện ích; đối chiếu URL, ngôn ngữ và trạng thái đích.

## 2. Giao diện trang chuyên mục và chi tiết tin


**Mục đích và đối tượng.** Chuyên mục giúp người đọc duyệt tin theo chủ đề; trang chi tiết trình bày một nội dung cụ thể, nguồn/tác giả, tệp và các liên kết liên quan. Khách truy cập là người đọc chính; biên tập viên chỉ tham gia gián tiếp qua trạng thái và dữ liệu xuất bản. Nhà thầu xây dựng danh sách chuyên mục, trang danh sách tin, trang chi tiết và điều hướng qua lại. Chức năng chia sẻ được cung cấp theo thiết kế; chức năng bình luận chỉ được triển khai khi Chủ đầu tư phê duyệt quy trình kiểm duyệt, chống spam và bảo vệ dữ liệu cá nhân.

**Giải pháp của Nhà thầu.** Nhà thầu xây dựng trang danh sách theo chuyên mục và trang chi tiết theo địa chỉ nội dung ổn định. Trang danh sách hỗ trợ lọc, sắp xếp và phân trang; trang chi tiết trình bày siêu dữ liệu, nội dung đã được làm sạch, tệp, bài liên quan, cỡ chữ, in, chia sẻ và URL chuẩn. Các chức năng bình luận chỉ được bật khi quy trình kiểm duyệt và chính sách dữ liệu cá nhân được Chủ đầu tư phê duyệt.

**Khu vực màn hình.** Trang danh sách: breadcrumb; tiêu đề chuyên mục; mô tả/ảnh đầu trang theo cấu hình được duyệt; bộ lọc từ khóa và khoảng thời gian theo phạm vi được xác nhận; thẻ tin nổi bật; danh sách tin có tiêu đề, ngày, tóm tắt, ảnh; điều khiển trang và số bản ghi; trạng thái đang tải/rỗng/lỗi. Trang chi tiết: breadcrumb; nhãn chuyên mục; tiêu đề; ngày xuất bản/cập nhật nếu dữ liệu có; tác giả hoặc nguồn; nút phóng to/thu nhỏ chữ, in và chia sẻ; nội dung; ảnh/video nhúng đã kiểm tra; tệp liên quan; mã QR gắn với URL chuẩn của nội dung; tin liên quan; khu vực bình luận gắn với tin và được xử lý theo quy trình kiểm duyệt, chống spam và bảo vệ dữ liệu cá nhân đã thống nhất.

**Luồng chính.**

1. Người dùng mở chuyên mục từ menu hoặc liên kết; breadcrumb, tiêu đề và danh sách phản ánh đúng chuyên mục đang chọn.
2. Người dùng chọn bộ lọc (khi có dữ liệu), nhập từ khóa hoặc khoảng ngày và áp dụng; giao diện đưa trang về trang đầu, cập nhật truy vấn và danh sách.
3. Người dùng chuyển trang hoặc thay đổi số bản ghi; hệ thống truy vấn lại theo cùng điều kiện và không làm mất bộ lọc.
4. Người dùng mở một tin; URL ổn định và có thể tải lại. Hệ thống tra cứu nội dung theo định danh/đường dẫn định danh, hiển thị trạng thái tải rồi nội dung hoặc trang không tìm thấy.
5. Người đọc điều chỉnh cỡ chữ, in hoặc mở tệp liên quan; hành động không làm thay đổi nội dung lưu trữ.
6. Người dùng chọn tin liên quan hoặc mã QR/chia sẻ; liên kết phải đến nội dung công khai đúng bản ghi.

**Dữ liệu hiển thị.**

| Nhóm | Trường dữ liệu | Ghi chú |
|---|---|---|
| Chuyên mục | Tên, mô tả, ảnh, breadcrumb, ngôn ngữ | Chỉ lấy cấu hình công khai |
| Tin danh sách | Tiêu đề, tóm tắt, ảnh đại diện, ngày xuất bản, loại/nổi bật, URL | Sắp xếp theo quy tắc đã thống nhất |
| Tin chi tiết | Tiêu đề, nội dung, tác giả/nguồn, ngày, từ khóa, ảnh, chuyên mục | Nhà thầu thống nhất trường dữ liệu trong khảo sát và thiết kế chi tiết |
| Tệp/quan hệ | Tên tệp, URL, loại, kích thước; nội dung liên quan | Tệp được liên kết đúng hồ sơ và kiểm soát quyền truy cập |
| Tìm/phân trang | Từ khóa, từ ngày, đến ngày, trang, kích thước trang | Bộ lọc ngày phải xác định múi giờ và tính bao gồm ngày cuối |

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Người chưa đăng nhập chỉ đọc bản ghi được công khai. Không được để lộ nháp bằng cách gọi trực tiếp URL/dịch vụ. Từ ngày không được sau đến ngày; trang phải trở về 1 khi bộ lọc đổi; trang vượt tổng số phải xử lý có kiểm soát. Tiêu đề và đường dẫn định danh phải định tuyến đến đúng nội dung, tránh hai bản ghi cùng đường dẫn định danh gây nhầm. HTML, URL ảnh nhúng và tệp cần được làm sạch/kiểm tra phù hợp; loại tệp được mở/tải theo chính sách của cổng. QR và URL chuẩn phải dùng URL chuẩn, không phải URL môi trường thử hoặc URL có tham số truy vấn ngẫu nhiên. Bình luận công khai (khi có dữ liệu) phải xác định công khai ngay hay chờ duyệt, cách xử lý dữ liệu cá nhân và chống spam; quy trình này được Chủ đầu tư phê duyệt.

**Rỗng, lỗi và biên.** Chuyên mục không có tin cần thông báo không có dữ liệu và vẫn giữ tiêu đề/breadcrumb. Từ khóa không có kết quả hiển thị bộ lọc đã áp dụng cùng thao tác xóa lọc. Tin không tồn tại, bị gỡ hoặc không công khai trả trạng thái không tìm thấy/không truy cập được nhất quán; không hiển thị một phần nội dung riêng tư. Tệp hỏng cần báo rõ và không làm hỏng toàn trang. Nội dung thiếu ảnh vẫn phải có bố cục; thiếu tác giả/ngày thì ẩn nhãn tương ứng thay vì in giá trị rỗng. Tin dài, nhiều ảnh, URL cũ hoặc đường dẫn định danh có dấu cần được kiểm tra. Nếu dịch vụ liên quan lỗi, nội dung chính vẫn có thể đọc được.

**Tích hợp và luồng dữ liệu.** Nhà thầu tích hợp danh sách, chi tiết, tin liên quan, chuyên mục và tệp theo định danh ổn định; truy vấn được phân trang nhất quán, giữ điều kiện lọc và chỉ trả nội dung đã duyệt để công khai. Bộ lọc từ khóa/thời gian và quy tắc ngôn ngữ được thống nhất trong thiết kế chi tiết.

**Kịch bản nghiệm thu.**

1. Dùng dữ liệu có ít nhất hai trang, nhiều ngày và một tin nổi bật; kiểm tra thứ tự, bộ lọc, phân trang và tổng số.
2. Tìm theo từ khóa có/không có kết quả; xác nhận truy vấn được giữ khi chuyển trang và có thể xóa.
3. Mở tin có ảnh, HTML, tệp, tác giả và quan hệ; xác nhận nội dung, siêu dữ liệu, tệp và liên kết đúng bản ghi.
4. Mở URL sai, nội dung nháp và nội dung đã gỡ; xác nhận không lộ dữ liệu và có trang lỗi phù hợp.
5. Kiểm tra cỡ chữ, in, URL chuẩn, chia sẻ và mã QR; mở/quét liên kết để xác nhận đến đúng trang chuẩn.
6. Thử tin thiếu ảnh/tác giả, tệp không truy cập được và dịch vụ tin liên quan lỗi; xác nhận nội dung chính vẫn hiển thị an toàn.

## 3. Giao diện trang Đảng bộ Bộ Nội vụ


**Mục đích và đối tượng.** Chuyên trang là khu vực công khai có nhận diện, điều hướng, danh sách và chi tiết nội dung thuộc phạm vi Đảng bộ Bộ Nội vụ. Đối tượng gồm đảng viên, cán bộ, tổ chức và người dân tìm hiểu thông tin Đảng bộ. Nhà thầu xây dựng chuyên trang riêng, có thể chia sẻ thành phần nền tảng nhưng duy trì cấu hình, nội dung và điều hướng được Chủ đầu tư phê duyệt.

**Phạm vi và giải pháp chuyên trang.** Nhà thầu thiết kế trang Đảng bộ với nhận diện, menu, danh mục và luồng nội dung riêng. quan hệ cha-con, liên kết hoặc dùng chung bản ghi chỉ thực hiện theo phương án được Chủ đầu tư phê duyệt. Danh mục và quyền biên tập được phân định để nội dung của một phạm vi không tự xuất hiện ở phạm vi còn lại.

**Khu vực màn hình.** Trang chủ chuyên trang: nhận diện Đảng bộ được duyệt; menu chuyên trang; banner/khối tin đầu; danh mục nội dung; tin mới/nổi bật; thông tin hoạt động và văn kiện thuộc phạm vi được giao; cuối trang/liên kết về cổng chính. Trang danh sách: breadcrumb, tên chuyên mục, mô tả, lọc/từ khóa (nếu duyệt), danh sách và phân trang. Trang chi tiết: breadcrumb, tiêu đề, ngày, nguồn/tác giả khi có, nội dung, tệp/ảnh liên quan, nội dung cùng chuyên trang. Hệ thống phải phân biệt rõ chuyên trang Đảng bộ với các chuyên trang khác trong tiêu đề, menu, URL, siêu dữ liệu, kết quả tìm kiếm và liên kết từ cổng chính.

**Luồng chính.**

1. Người dùng truy cập từ menu/URL chuyên trang và thấy đúng tên, nhận diện, breadcrumb và menu đã duyệt.
2. Người dùng chọn danh mục; danh sách chỉ lấy nội dung thuộc phạm vi đã cấu hình cho trang Đảng bộ.
3. Người dùng tìm/lọc (theo thiết kế được duyệt), chuyển trang và mở chi tiết; trạng thái lọc/URL phải cho phép chia sẻ và tải lại.
4. Người dùng mở tệp hoặc liên kết nội dung liên quan; liên kết giữ nguyên ranh giới chuyên trang trừ khi đích được xác định rõ là cổng chính/chuyên trang khác.
5. Người dùng chuyển từ trang Đảng bộ sang trang các chuyên trang khác qua liên kết được cấu hình; giao diện và URL cho biết người dùng đã chuyển phạm vi.

**Dữ liệu hiển thị.**

| Nhóm | Trường dữ liệu | Ghi chú |
|---|---|---|
| Nhận diện | Tên chuyên trang, logo/ảnh, mô tả, menu, màu sắc | Nội dung và dấu hiệu nhận diện do Chủ đầu tư duyệt |
| Danh mục | Tên, thứ tự, ngôn ngữ, phạm vi/khóa chuyên trang | Không dùng chung mặc định với chuyên trang khác |
| Bài viết | Tiêu đề, tóm tắt, nội dung, ngày, tác giả/nguồn, ảnh, tệp | Chỉ công khai sau quy trình duyệt được phê chuẩn |
| Điều hướng | URL, nhãn, loại trang đích, quan hệ đến chuyên trang khác/cổng chính | Liên kết ngoài phạm vi phải minh bạch |

Nhà thầu thống nhất danh mục, trường nội dung, nguồn dữ liệu và quan hệ liên kết với Chủ đầu tư trong khảo sát, sau đó cấu hình và kiểm thử theo phạm vi được duyệt.

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Quyền đọc tuân theo trạng thái công khai; nội dung nội bộ/không được phép công khai không xuất hiện qua trang, tìm kiếm hay URL trực tiếp. Danh mục, menu, tiêu đề, đường dẫn định danh và URL cần duyệt để tránh gắn nhầm bản ghi chuyên trang khác. Nếu tái sử dụng nội dung, cần có quy tắc nguồn chuẩn, bản dịch và đồng bộ cập nhật; không tạo bản sao không truy nguyên. Nhà thầu phân quyền biên tập và kiểm duyệt theo vai trò được Chủ đầu tư phê duyệt. Cấu hình ngôn ngữ và nhận diện cần được duyệt trước khi phát hành.

**Rỗng, lỗi và biên.** Nếu chưa có dữ liệu được phép công khai, hiển thị trang thông báo đã duyệt, không lấy tin chuyên trang khác làm dữ liệu thay thế. Danh mục sai/đã xóa trả trang không tìm thấy. Bản ghi liên kết nhầm phạm vi cần được chặn khỏi danh sách và báo cho người quản trị qua quy trình nội bộ đã thống nhất. URL cũ của chuyên trang khác không tự chuyển sang Đảng bộ nếu chưa có bảng ánh xạ và xác nhận. Thiếu bản dịch, banner hoặc nội dung nhận diện cần theo chính sách dự phòng được duyệt; không trộn ngôn ngữ.

**Tích hợp và luồng dữ liệu.** Nhà thầu cùng Chủ đầu tư thống nhất nguồn dữ liệu Đảng bộ, chủ sở hữu, mẫu bản ghi, danh mục, tệp và quan hệ điều hướng với các chuyên trang khác. Nhà thầu xây dựng ánh xạ và khóa phạm vi riêng cho Đảng bộ; giao diện công khai chỉ lấy dữ liệu đúng phạm vi. Các thành phần dùng chung (đầu trang/cuối trang/breadcrumb) được tái sử dụng nhưng không làm nhập nhằng nhận diện hoặc quyền xuất bản.

**Kịch bản nghiệm thu.**

1. Chủ đầu tư duyệt mẫu nhận diện, menu, danh mục và bộ dữ liệu Đảng bộ; xác nhận hiển thị đúng trên trang chủ/danh sách/chi tiết.
2. Có bản ghi Đảng bộ, bản ghi chuyên trang khác và bản ghi nháp; xác nhận mỗi bản ghi chỉ xuất hiện đúng phạm vi, bản nháp không công khai.
3. Kiểm tra URL, breadcrumb, siêu dữ liệu và tìm kiếm của cả hai chuyên trang; xác nhận không định tuyến/hiển thị nhầm.
4. Mở tệp và liên kết liên quan; đối chiếu đích, quyền truy cập và bản ghi nguồn.
5. Thử danh mục rỗng, URL cũ, bản dịch thiếu và banner lỗi; xác nhận trạng thái dự phòng đã duyệt, không thay thế dữ liệu bằng phạm vi khác.
6. Đối chiếu mẫu dữ liệu sau chuyển thử với nguồn Đảng bộ được xác nhận; lập biên bản số lượng và sai khác trước khi kết luận.

## 4. Giao diện chuyên trang Bộ trưởng


**Mục đích và đối tượng.** Chuyên trang tập trung thông tin về Bộ trưởng, hoạt động, phát biểu/chỉ đạo và tin liên quan. Người đọc là cán bộ, báo chí, tổ chức và người dân. Nhà thầu xây dựng giao diện có trang chủ chuyên trang, danh mục, danh sách và chi tiết, đồng thời duy trì nhận diện chung của Cổng Bộ Nội vụ. Tên hiển thị, chức danh và thông tin lịch sử được lấy theo nội dung đã duyệt tại thời điểm công bố.

**Giải pháp của Nhà thầu.** Nhà thầu xây dựng chuyên trang Bộ trưởng gồm trang chủ, danh sách, chi tiết và các vùng nội dung theo cấu hình riêng. Mỗi khối được nối với danh mục và nội dung thuộc đúng phạm vi; banner, menu, phát biểu/chỉ đạo, tin hoạt động và đa phương tiện được quản lý theo quy trình duyệt thống nhất. Các trang vẫn dùng nhận diện nền tảng chung của Cổng nhưng thể hiện rõ ngữ cảnh chuyên trang.

**Khu vực màn hình.** Trang chủ: đầu trang dùng chung, nhãn chuyên trang; banner/ảnh tiêu điểm; thông tin giới thiệu theo thiết kế được duyệt; tin hoạt động và phát biểu/chỉ đạo; nhóm danh mục; đa phương tiện; liên kết về tin Bộ. Danh sách: tiêu đề, lọc/từ khóa/thời gian theo nghiệp vụ, thẻ tin, phân trang. Chi tiết: tiêu đề, ngày, nội dung, nguồn/tác giả, tệp, tin cùng chuyên trang, chia sẻ, in và mã QR trỏ đến URL chuẩn của nội dung. Menu và các vùng nội dung riêng phải được phân biệt với menu toàn cổng.

**Luồng chính.**

1. Mở chuyên trang từ menu hoặc URL; nhận diện và breadcrumb chỉ rõ bối cảnh Bộ trưởng.
2. Chọn mục phát biểu, hoạt động hoặc danh mục khác đã duyệt; hệ thống liệt kê nội dung thuộc chuyên trang.
3. Dùng tìm kiếm/lọc thời gian theo cấu hình được duyệt; kết quả và phân trang giữ nguyên điều kiện lọc.
4. Mở bài viết, đọc nội dung/tệp, xem tin liên quan và trở về danh sách mà không mất bối cảnh.
5. Chọn liên kết sang cổng chính hoặc chuyên trang khác; nhãn/đích cho biết chuyển ngữ cảnh.

**Dữ liệu hiển thị.**

| Nhóm | Trường dữ liệu | Ghi chú |
|---|---|---|
| Cấu hình | Tên, logo/banner, menu, thứ tự khối, ngôn ngữ | Cần xác định cấu hình gắn riêng hay dùng cấu hình chung |
| Nội dung | Tiêu đề, tóm tắt, nội dung, ảnh, ngày, danh mục, tác giả/nguồn | Nội dung đã công khai |
| Tệp/liên kết | Tên, URL, loại tệp, nội dung liên quan | Xác minh quyền tải và đích |
| Lọc | Từ khóa, danh mục, thời gian, trang | Các tiêu chí chính thức do Chủ đầu tư duyệt |



**Kiểm tra nghiệp vụ, xuất bản và quyền.** Chỉ bài đã duyệt và đúng phạm vi chuyên trang được hiển thị. Bài liên quan một hoạt động nhưng được phân loại ở trang khác không tự động xuất hiện nếu không có quan hệ/điều kiện đã duyệt. Tên/chức danh và ảnh nhận diện phải lấy từ nội dung được duyệt, có ngày hiệu lực phù hợp với hồ sơ; Nhà thầu giữ nguyên chức danh tại thời điểm nội dung được đăng. Lọc thời gian phải thống nhất ngày, múi giờ và cách tính mốc cuối. Không phơi bày dữ liệu biên tập qua dịch vụ công khai. Liên kết ảnh, tệp và HTML cần được xác thực/làm sạch.

**Rỗng, lỗi và biên.** Chuyên trang chưa có tin ở một danh mục thì hiển thị trạng thái rỗng cục bộ. Không có banner không được làm mất khả năng đi vào nội dung. Nội dung bị gỡ/không công khai phải trả về trang lỗi an toàn. Nếu một khối đa phương tiện hoặc tin lỗi, phần khác vẫn sử dụng được. Bài lịch sử có chức danh khác thời điểm hiện tại cần giữ thông tin tại thời điểm đăng, theo chính sách biên tập được duyệt; không tự thay bằng giá trị hiện thời.

**Tích hợp và luồng dữ liệu.** Nhà thầu tích hợp nội dung, danh mục, menu và banner theo khóa chuyên trang rõ ràng; thiết lập ánh xạ nguồn–khối, ngôn ngữ, thứ tự và điều kiện xuất bản. Cấu hình được kiểm thử đầu-cuối với trang chủ, danh sách và chi tiết.

**Kịch bản nghiệm thu.**

1. Cập nhật bộ dữ liệu mẫu đã duyệt cho banner, hoạt động, phát biểu, đa phương tiện; xác nhận từng khối và URL đích.
2. Có tin chuyên trang và tin tổng quát gần giống tiêu đề; xác nhận chỉ tin thuộc đúng phạm vi xuất hiện.
3. Kiểm tra lọc danh mục/thời gian và phân trang bằng tập dữ liệu qua nhiều trang.
4. Mở chi tiết có tệp, bài lịch sử và bài thiếu ảnh; xác nhận siêu dữ liệu, nguồn và dự phòng.
5. Kiểm tra menu/breadcrumb trên thiết bị hẹp, đổi ngôn ngữ khi có/thiếu bản dịch.
6. Thử bản nháp, bài hết hạn, URL sai và dịch vụ tra cứu lỗi; xác nhận không lộ dữ liệu và có thông báo phù hợp.

[FIG:search-flow]

## 5. Giao diện văn bản quy phạm pháp luật và văn bản chỉ đạo, điều hành


**Mục đích và đối tượng.** Cung cấp tra cứu và đọc hồ sơ văn bản QPPL/CĐĐH, giúp người dùng xác định đúng văn bản, cơ quan ban hành, thời điểm ban hành/hiệu lực và tải bản tệp công khai. Người dùng là người dân, cán bộ thực thi, doanh nghiệp và đơn vị nghiên cứu. Nhà thầu tách rõ nhóm văn bản và cung cấp lọc đa tiêu chí; tiêu chí, phân loại, quy tắc hiệu lực và nội dung liên quan cần Chủ đầu tư xác nhận.

**Giải pháp của Nhà thầu.** Nhà thầu xây dựng phân hệ tra cứu văn bản với các nhóm điều kiện về nội dung, số ký hiệu, thời gian, lĩnh vực, cơ quan, hình thức và người ký theo phạm vi được duyệt. Truy vấn được xử lý phía máy chủ, kết quả có phân trang và trang chi tiết liên kết tới tệp/toàn văn cùng hồ sơ liên quan. QPPL và CĐĐH được phân loại rõ, có quy tắc hiệu lực, thay thế và đình chỉ thống nhất với dữ liệu do Chủ đầu tư cung cấp.

**Khu vực màn hình.** Trang tra cứu: chọn nhóm QPPL/CĐĐH; từ khóa trích yếu/số ký hiệu; khoảng ngày ban hành và hiệu lực; lĩnh vực; cơ quan ban hành; hình thức; người ký/chức danh nếu áp dụng; nút tìm/làm mới; danh sách kết quả và phân trang. Thẻ kết quả hiển thị số/ký hiệu, trích yếu, loại, cơ quan, ngày ban hành, hiệu lực và nhãn trạng thái đã xác định từ dữ liệu nghiệp vụ. Trang chi tiết: siêu dữ liệu hồ sơ; nội dung/trích yếu; cơ quan/người ký; ngày ban hành/hiệu lực; tệp toàn văn; văn bản liên quan; lịch sử hiệu lực khi có dữ liệu; đường dẫn chuẩn/QR theo phạm vi được phê duyệt. Nhà thầu hiển thị trạng thái hiệu lực theo dữ liệu chính thức về hiệu lực, đình chỉ, thay thế và hết hiệu lực.

[FIG:search-flow]

**Luồng chính.**

1. Người dùng mở khu tra cứu và chọn nhóm văn bản hoặc giữ nhóm mặc định đã được duyệt.
2. Người dùng nhập một hoặc nhiều điều kiện; giao diện kiểm tra khoảng ngày, giữ điều kiện trong URL nếu phù hợp và gửi truy vấn.
3. Hệ thống trả kết quả đã giới hạn theo phân trang; mỗi hàng có đủ dữ liệu để phân biệt văn bản tương tự.
4. Người dùng mở hồ sơ; trang chi tiết hiển thị siêu dữ liệu và các tệp/quan hệ có sẵn.
5. Người dùng tải/mở tệp; giao diện chỉ đưa ra liên kết hợp lệ, cho biết tên/loại tệp và phản hồi khi tệp không truy cập được.
6. Người dùng quay lại danh sách; các điều kiện tìm kiếm và trang trước được giữ khi có thông tin.

**Dữ liệu hiển thị và điều kiện tra cứu.**

| Nhóm | Trường/điều kiện | Quy tắc hiển thị |
|---|---|---|
| Tra cứu | Trích yếu, số/ký hiệu, ngày ban hành, ngày hiệu lực, lĩnh vực, người ký, chức danh, hình thức, cơ quan ban hành, nhóm văn bản | Điều kiện tìm kiếm được kết hợp theo quy tắc đã duyệt |
| Kết quả | Số/ký hiệu, trích yếu, loại, cơ quan, ngày, trạng thái hiệu lực | Kết quả phản ánh dữ liệu nghiệp vụ và trạng thái được duyệt |
| Chi tiết | Hồ sơ, người ký, cơ quan, các mốc ngày, tệp, văn bản liên quan | Chỉ hiển thị thông tin và tệp được phép công khai |
| Truy vấn | Trang, kích thước trang, nhóm, ngôn ngữ | Giữ điều kiện khi phân trang và quay lại danh sách |
**Kiểm tra nghiệp vụ, xuất bản và quyền.** Dữ liệu công khai phải được lọc tại phía máy chủ theo trạng thái/phạm vi. Ngày bắt đầu không sau ngày kết thúc; nếu người dùng nhập cả trích yếu và số ký hiệu, cách kết hợp AND/OR phải thống nhất (Nhà thầu kết hợp trích yếu và số ký hiệu theo quy tắc được duyệt, các tiêu chí khác được áp dụng nhất quán). Bộ lọc phải tránh bỏ qua điều kiện do giá trị rỗng/sai định dạng. Bản ghi có cùng số/ký hiệu cần phân biệt bằng năm/cơ quan/loại. Nhãn hiệu lực chỉ theo trường trạng thái và quy tắc được Chủ đầu tư duyệt, xử lý văn bản bị thay thế/đình chỉ/hết hiệu lực. Tệp phải được quét/kiểm soát theo chính sách cổng trước khi phát hành; quyền tệp phải tương thích quyền hồ sơ. Không yêu cầu đăng nhập với tài liệu công khai.

**Rỗng, lỗi và biên.** Không có kết quả cần hiển thị tiêu chí đã chọn và nút xóa. Ngày không hợp lệ báo tại bộ lọc, không gửi truy vấn mơ hồ. Nếu bản ghi thiếu trường, ẩn nhãn thay vì hiển thị giá trị rỗng; nếu trạng thái hiệu lực chưa xác định thì dùng nhãn trung tính đã duyệt. Tệp lỗi/404 cần thông báo và đường quay lại hồ sơ. Truy vấn quá rộng có thể yêu cầu người dùng thêm điều kiện; giới hạn/nhắc cụ thể phải được xác nhận. Nếu danh mục tra cứu cơ quan/lĩnh vực lỗi, người dùng vẫn có thể tra cứu bằng từ khóa nếu hệ thống hỗ trợ; không làm sai kết quả âm thầm.

**Tích hợp và luồng dữ liệu.** Nhà thầu tích hợp danh sách và chi tiết với phân hệ văn bản; danh mục lĩnh vực, cơ quan, hình thức và người ký cung cấp điều kiện tra cứu; tệp và văn bản liên quan được liên kết tại hồ sơ chi tiết. Văn bản QPPL và CĐĐH dùng bố cục tra cứu chung nhưng giữ phân loại và quy tắc nghiệp vụ riêng. Dữ liệu chuyển đổi được đối soát về số/ký hiệu, cơ quan, hiệu lực và tệp trước khi công khai.

**Kịch bản nghiệm thu.**

1. Tìm lần lượt theo số ký hiệu, trích yếu, cơ quan, lĩnh vực và hình thức; so sánh danh sách với bộ dữ liệu chuẩn.
2. Kết hợp nhiều bộ lọc, cả khoảng ngày hợp lệ và không hợp lệ; xác nhận phép kết hợp theo quy tắc đã phê duyệt.
3. Thử QPPL và CĐĐH có trạng thái hiệu lực khác nhau; xác nhận nhãn không suy diễn và đúng dữ liệu nghiệp vụ.
4. Mở chi tiết có nhiều tệp/văn bản liên quan; kiểm tra tiêu đề, mốc ngày, URL và quyền truy cập tệp.
5. Thử không có kết quả, bản ghi thiếu siêu dữ liệu, tệp lỗi và danh mục tra cứu không sẵn sàng; xác nhận xử lý rõ ràng.
6. Chuyển trang, làm mới URL và quay lại; xác nhận điều kiện tra cứu/nhóm/ngôn ngữ được giữ theo thiết kế đã duyệt.

## 6. Giao diện lấy ý kiến dự thảo


**Mục đích và đối tượng.** Giúp người dân xem dự thảo đang lấy ý kiến, đọc hồ sơ liên quan và gửi góp ý trong khoảng thời gian được phép. Người đóng góp không cần quyền quản trị; cán bộ phụ trách tiếp nhận, kiểm duyệt và xử lý nội bộ. Nhà thầu xây dựng danh sách dự thảo, chi tiết, biểu mẫu và trạng thái thời hạn; việc công khai ý kiến sau gửi phải theo chính sách được Chủ đầu tư phê duyệt. Việc gửi thành công không đồng nghĩa ý kiến được công bố.

**Giải pháp của Nhà thầu.** Nhà thầu cung cấp danh sách và chi tiết dự thảo, biểu mẫu góp ý và luồng tiếp nhận có kiểm soát thời hạn. Biểu mẫu kiểm tra dữ liệu ở trình duyệt để hướng dẫn người dùng và kiểm tra lại ở máy chủ; máy chủ xác minh mã xác minh chống bot, dự thảo, thời hạn và điều kiện tiếp nhận trước khi lưu. Ý kiến được chuyển đến hàng chờ cán bộ phụ trách; chỉ ý kiến được duyệt mới được công khai theo chính sách do Chủ đầu tư phê duyệt. Biểu mẫu hỗ trợ tệp đính kèm theo giới hạn loại, dung lượng và số lượng; tệp được kiểm tra an toàn trước khi lưu và chỉ công khai theo trạng thái duyệt.

**Khu vực màn hình.** Danh sách: dự thảo đang lấy ý kiến, tên, cơ quan phụ trách, ngày bắt đầu/kết thúc, thời gian còn lại theo múi giờ xác định, liên kết hồ sơ và trạng thái đóng/mở. Chi tiết: thông tin dự thảo, nội dung/tệp, cơ quan, phạm vi câu hỏi/hướng dẫn, thời hạn và nút góp ý chỉ khi đang mở. Biểu mẫu: họ tên, email, điện thoại tùy chính sách, địa chỉ tùy chọn, nội dung, thông báo quyền riêng tư, xác minh chống bot ở máy chủ, nút gửi/trạng thái chờ. Nhà thầu quy định loại, dung lượng, số tệp và cơ chế quét an toàn; tệp chỉ được gắn vào ý kiến sau khi vượt qua kiểm tra và tuân thủ chính sách công bố.

[FIG:feedback-flow]

**Luồng chính.**

1. Người dùng mở danh sách; chỉ thấy dự thảo thuộc phạm vi công khai, có trạng thái phù hợp theo thời gian.
2. Người dùng mở chi tiết, đọc hướng dẫn và tệp; ứng dụng thể hiện rõ ngày/giờ đóng góp cuối cùng.
3. Người dùng mở biểu mẫu trong thời gian hiệu lực; nhập thông tin bắt buộc và nội dung theo hướng dẫn.
4. Trình duyệt kiểm tra định dạng sơ bộ; máy chủ phải xác minh lại dữ liệu và mã xác minh chống bot, không tin kết quả kiểm tra phía trình duyệt.
5. Máy chủ đối chiếu dự thảo tồn tại, trạng thái nhận ý kiến và thời gian hiện tại; nếu hợp lệ thì tiếp nhận và trả mã/trạng thái xác nhận phù hợp.
6. Người dùng nhận thông báo thành công hoặc lỗi có thể xử lý; gửi lại không được tạo bản ghi trùng ngoài ý muốn. Ý kiến được đưa vào hàng chờ kiểm duyệt theo chính sách.
7. Cán bộ có thẩm quyền xử lý nội bộ qua phân hệ quản trị; chỉ ý kiến được duyệt mới được công khai nếu chính sách yêu cầu công khai.

**Dữ liệu hiển thị.**

| Nhóm | Trường dữ liệu | Phương án xử lý |
|---|---|---|
| Dự thảo | Tiêu đề, cơ quan, mô tả, nội dung/tệp, thời gian bắt đầu/kết thúc, trạng thái | Nhà thầu cung cấp truy vấn chi tiết theo dữ liệu được duyệt |
| Người góp ý | Họ tên, email, điện thoại, địa chỉ | Thu thập tối thiểu theo chính sách bảo vệ dữ liệu |
| Nội dung | Ý kiến góp ý, định danh dự thảo, thời điểm nhận | Nhà thầu gắn ý kiến với đúng hồ sơ dự thảo và ghi nhận thời điểm tiếp nhận |
| Chống bot | Mã xác minh, mục đích gửi, kết quả kiểm tra | Máy chủ xác minh; giao diện không hiển thị thông tin kiểm soát nội bộ |
| Đính kèm | Tên, loại, kích thước, trạng thái quét, URL truy cập | Nhà thầu kiểm soát tải tệp theo chính sách được duyệt |

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Máy chủ quyết định khả năng nhận góp ý. Nhà thầu kiểm tra thời điểm bắt đầu/kết thúc nhận ý kiến theo múi giờ thống nhất; mọi yêu cầu ngoài hạn bị từ chối. Ngưỡng xác minh chống bot được cấu hình theo chính sách an toàn do Chủ đầu tư phê duyệt. Cần làm rõ thời điểm đóng có tính bao gồm hay không, xử lý thời gian máy chủ và vùng giờ, dự thảo bị tạm dừng, đóng sớm hoặc kéo dài. Các trường họ tên, email và nội dung bắt buộc phải được kiểm tra nhất quán ở giao diện và máy chủ; định dạng email/điện thoại không thể chỉ dựa vào biểu thức kiểm tra ở trình duyệt. Mã xác minh reCAPTCHA có thể hết hạn hoặc bị dùng lại; máy chủ phải kiểm tra hành động và kết quả, có giới hạn tần suất/chống spam thích hợp đã được phê duyệt. Thu thập địa chỉ/điện thoại cần mục đích và thông báo quyền riêng tư. Nội dung nhập phải được mã hóa/làm sạch khi hiển thị ở quản trị, tránh XSS. Quyền đọc dự thảo công khai khác quyền xem thông tin cá nhân của người gửi; chỉ cán bộ được phân công xem dữ liệu nhận dạng. Trạng thái duyệt/công khai và thời hạn lưu giữ cần phê chuẩn.

**Rỗng, lỗi và biên.** Không có dự thảo đang mở: hiển thị thông báo và liên kết đến danh sách đã đóng nếu phù hợp. Đóng góp ngoài thời hạn, hồ sơ sai hoặc không công khai: từ chối phía máy chủ và không ghi nhận như thành công. Mã xác minh sai/hết hạn, yêu cầu không hợp lệ hoặc có dấu hiệu tự động: đưa thông báo thân thiện và cho phép khởi tạo lần gửi mới; không tiết lộ cấu hình chống bot. Gửi lặp do nhấn nhiều lần/mạng chậm cần vô hiệu hóa nút trong khi gửi và xử lý gửi lặp theo thiết kế được duyệt. Nội dung quá ngắn/dài, email sai hoặc HTML nguy hiểm phải bị từ chối/làm sạch. Đính kèm lỗi/quá lớn (khi có dữ liệu) không được làm mất phần góp ý âm thầm. Nếu lưu thành công nhưng phản hồi mạng lỗi, cần có cách tra cứu/nhắc tránh gửi lặp mà không lộ thông tin cá nhân.

**Tích hợp và luồng dữ liệu.** Nhà thầu kết nối danh sách/chi tiết dự thảo với biểu mẫu nhận góp ý. Máy chủ kiểm tra dự thảo, trạng thái và thời hạn; ý kiến hợp lệ được lưu cùng hồ sơ liên quan, sau đó chuyển tới hàng chờ tiếp nhận và kiểm duyệt. Xử lý đính kèm, chống gửi lặp, thông báo xác nhận và công khai kết quả theo quy trình được Chủ đầu tư phê duyệt.

**Kịch bản nghiệm thu.**

1. Gửi góp ý hợp lệ cho dự thảo đang mở; xác nhận người dùng nhận thông báo và ý kiến được gắn đúng dự thảo, mặc định chờ xử lý theo chính sách.
2. Gửi cho dự thảo chưa mở, đã hết hạn, bị đóng hoặc mã định danh không tồn tại; xác nhận máy chủ từ chối và không tạo bản ghi.
3. Thử thiếu hoặc nhập sai họ tên, email, điện thoại, nội dung; kiểm tra nội dung ngắn/dài vượt giới hạn và đối chiếu phản hồi của giao diện với máy chủ.
4. Thử mã xác minh sai, hết hạn, tác vụ khác và điểm dưới ngưỡng; xác nhận không ghi ý kiến và thông báo không tiết lộ thông tin nhạy cảm.
5. Gửi liên tiếp/nhấn nhiều lần, mô phỏng mạng chậm; xác nhận không tạo bản ghi trùng ngoài quy tắc đã duyệt.
6. Nếu có chức năng tải tệp lên: thử tệp hợp lệ, sai loại, vượt dung lượng, tên bất thường và tệp bị từ chối quét; xác nhận tệp không thể truy cập công khai trước khi duyệt.

## 7. Giao diện đa phương tiện


**Mục đích và đối tượng.** Thư viện giúp công chúng tìm và xem album ảnh, video, audio về hoạt động Bộ. Người dùng cần nhận biết loại nội dung, ngày đăng, chuyên mục, quyền phát/tải và mô tả. Nhà thầu xây dựng trang danh sách từng loại, trang chi tiết album, bộ lọc và phân trang; lựa chọn phát nội tuyến, mở khung xem ảnh phóng lớn hoặc tải phụ thuộc bản quyền, khả năng truy cập và nguồn tệp.

**Giải pháp của Nhà thầu.** Nhà thầu xây dựng thư viện ảnh, video, audio có trang danh sách và trang album chi tiết. Ảnh được hiển thị bằng thư viện ảnh/khung xem ảnh phóng lớn; video và audio dùng trình phát đúng loại đa phương tiện, hỗ trợ thao tác chủ động, không tự bật âm thanh. Danh mục, ngày, ảnh thu nhỏ, thứ tự, chú thích/văn bản thay thế, quyền tải và các định dạng được hỗ trợ được cấu hình theo chính sách công bố và bản quyền.

**Khu vực màn hình.** Mục ảnh/video/audio hoặc một trang thư viện tổng hợp; bộ chọn loại/chuyên mục/thời gian theo thiết kế được duyệt; lưới thẻ album với ảnh thu nhỏ, tiêu đề, mô tả, ngày và số lượng tệp nếu nguồn có; phân trang; trang album có tiêu đề/mô tả, thư viện ảnh/khung xem ảnh phóng lớn ảnh hoặc trình phát video/audio, danh sách các mục, chú thích/văn bản thay thế/bản chép lời khi có dữ liệu, tải về khi được phép, breadcrumb và album liên quan. Trình phát cần điều khiển phát/dừng, âm lượng, phụ đề/bản chép lời khi nguồn có; không tự bật âm thanh. Ảnh cần phóng to/thu nhỏ/đóng khung xem ảnh phóng lớn bằng bàn phím; chức năng tải không được làm lộ đường dẫn nội bộ.

[FIG:media-flow]

**Luồng chính.**

1. Người dùng chọn thư viện/loại đa phương tiện và xem các album công khai.
2. Người dùng lọc chuyên mục/thời gian (nếu hỗ trợ) hoặc chuyển trang; trạng thái truy vấn được giữ.
3. Người dùng mở album; trang hiển thị siêu dữ liệu và các tệp theo thứ tự được cấu hình.
4. Với ảnh, chọn ảnh thu nhỏ mở khung xem ảnh phóng lớn và điều hướng ảnh; với video/audio, khởi chạy trình phát sau thao tác chủ động.
5. Người dùng xem mô tả, chú thích hoặc bản chép lời khi có dữ liệu; tải tệp nếu chính sách cho phép.
6. Người dùng chọn album liên quan hoặc trở về danh sách; các URL album dùng được khi tải lại.

**Dữ liệu hiển thị.**

| Nhóm | Trường dữ liệu | Ghi chú |
|---|---|---|
| Album | Tiêu đề, mô tả, loại, chuyên mục, ngày xuất bản, ảnh đại diện, trạng thái | Nội dung hiển thị thống nhất giữa danh sách và chi tiết |
| Tệp đa phương tiện | Tên, URL công khai, loại, thứ tự, chú thích/văn bản thay thế, thời lượng/kích thước khi có dữ liệu | Mỗi tệp gắn với đúng album và quyền công bố |
| Bộ lọc | Loại, chuyên mục, khoảng thời gian, trang/kích thước | Nhà thầu triển khai lọc và phân trang thống nhất |
| Quyền | Cho phép xem/phát/tải/nhúng, ghi chú bản quyền | Quy tắc được cấu hình theo chính sách quyền công bố |

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Chỉ album công khai và tệp thuộc album được công khai mới được gửi tới trình duyệt. Album phải khớp loại nội dung; không phát file dựa vào đuôi tên đơn thuần, cần xác định loại/nguồn được phép. Tệp tải phải đáp ứng quy định bản quyền và bảo mật. URL nhúng ngoài (nếu được cho phép) cần danh sách nguồn hợp lệ, không cho phép script/tự động phát hoặc theo dõi không được phê duyệt. Ảnh phải có alt/caption; nội dung âm thanh/video nên có phụ đề/bản chép lời khi yêu cầu tiếp cận áp dụng. Thứ tự tệp ổn định và không tham chiếu album khác. Lọc theo thời gian cần quy tắc múi giờ. Không suy diễn số lượt xem hoặc độ dài nếu nguồn không có.

**Rỗng, lỗi và biên.** Thư viện không có album hiển thị thông báo rỗng; chuyên mục rỗng giữ điều kiện lọc và cho xóa. Album chưa có tệp hiển thị trạng thái nội dung phù hợp. Tệp không phát được phải kèm thông báo lỗi; chỉ cung cấp đường tải thay thế khi chính sách cho phép. Thumbnail lỗi dùng ảnh dự phòng; khung xem ảnh phóng lớn phải đóng được bằng bàn phím. Album lớn cần tải theo lô. Trình duyệt không hỗ trợ định dạng đa phương tiện nhận thông báo phù hợp. URL album sai/đã gỡ trả trang không tìm thấy, không để lộ đường dẫn lưu trữ.

**Tích hợp và luồng dữ liệu.** Nhà thầu cung cấp danh sách và chi tiết album theo từng loại, với phân trang, lọc, trạng thái công khai và quyền truy cập tệp nhất quán. Nhà thầu kiểm kê tệp, định dạng, dung lượng, quyền phát/tải và liên kết; bảo đảm các tệp sau chuyển đổi mở đúng tại trang đích. Nội dung nhúng ngoài chỉ được sử dụng từ nguồn được Chủ đầu tư cho phép.

**Kịch bản nghiệm thu.**

1. Tạo bộ dữ liệu album ảnh/video/audio công khai và không công khai; xác nhận danh sách chỉ chứa mục đúng trạng thái/loại.
2. Duyệt nhiều trang, lọc chuyên mục/thời gian (theo thiết kế được duyệt); đối chiếu tổng số và thứ tự.
3. Mở album ảnh nhiều tệp, dùng khung xem ảnh phóng lớn/điều khiển bàn phím; xác nhận alt, thứ tự và đường dẫn.
4. Phát video/audio mẫu trên trình duyệt mục tiêu, dừng/tiếp tục/âm lượng; xác nhận không tự phát và lỗi codec có thông báo.
5. Thử ảnh thu nhỏ/tệp hỏng, album rỗng, URL sai và file không được tải; xác nhận dự phòng và kiểm soát quyền.
6. Nếu hỗ trợ nhúng ngoài hoặc tải tệp, thử nguồn/tệp được phép và bị cấm; xác nhận chính sách áp dụng nhất quán.

## 8. Giao diện Hội nghị – Sự kiện


**Mục đích và đối tượng.** Cung cấp lịch sử và thông tin các hội nghị/sự kiện của Bộ, giúp người dùng tìm sự kiện theo thời gian/loại và mở chi tiết khi có nội dung công khai. Đối tượng gồm công chúng, cán bộ và báo chí. Nhà thầu xây dựng danh sách/dòng thời gian theo thời gian, thẻ tóm tắt, bộ lọc, chi tiết và liên kết/tệp. Việc hiển thị sự kiện sắp diễn ra, đang diễn ra hay đã kết thúc cần thống nhất với Chủ đầu tư.

**Giải pháp của Nhà thầu.** Nhà thầu xây dựng giao diện công khai cho danh sách, bộ lọc, dòng thời gian và chi tiết sự kiện. Dữ liệu được lấy theo trạng thái xuất bản và danh mục loại; thời gian, địa điểm, nội dung, tài liệu và liên kết sự kiện được thể hiện nhất quán trên cả dòng thời gian và trang chi tiết.

**Khu vực màn hình.** Trang danh sách: tiêu đề, bộ lọc khoảng ngày/loại/từ khóa, chuyển giữa sắp tới và đã diễn ra theo thiết kế được duyệt, dòng thời gian hoặc danh sách theo ngày, thẻ sự kiện với tên, thời gian, địa điểm, loại, tóm tắt và liên kết chi tiết. Trang chi tiết: tên, ngày/giờ bắt đầu-kết thúc, địa điểm, mô tả, chương trình/thành phần nếu được công khai, ảnh, tệp, liên kết livestream/bản tin và sự kiện liên quan. Trên dòng thời gian cần nhãn ngày rõ, không chỉ dùng màu; trên thiết bị nhỏ chuyển thành danh sách dọc.

**Luồng chính.**

1. Người dùng mở trang sự kiện và chọn khoảng thời gian/loại hoặc chế độ xem mặc định.
2. Giao diện truy vấn danh sách công khai, nhóm/sắp xếp theo thời điểm với quy tắc ổn định.
3. Người dùng chuyển trang hoặc thay đổi lọc; dòng thời gian/danh sách cập nhật và thể hiện điều kiện hiện hành.
4. Người dùng mở một sự kiện để xem thời gian, địa điểm, mô tả và tệp/liên kết.
5. Nếu có liên kết livestream hoặc tài liệu, người dùng mở theo chính sách tab/đích được duyệt.
6. Người dùng quay về danh sách mà không mất bộ lọc; sự kiện đã kết thúc vẫn còn truy cập nếu thuộc kho lưu trữ công khai.

**Dữ liệu hiển thị.**

| Nhóm | Trường dữ liệu | Ghi chú |
|---|---|---|
| Danh sách | Tên, loại, bắt đầu/kết thúc, địa điểm, ảnh, tóm tắt, URL | Chỉ hiển thị dữ liệu công khai |
| Chi tiết | Nội dung, chương trình, thành phần được phép công khai, tệp, liên kết livestream | Các trường tùy chọn theo hồ sơ được duyệt |
| Bộ lọc | Từ ngày, đến ngày, loại, từ khóa, trang | Xác định múi giờ và cách hiểu sự kiện qua đêm |
| Trạng thái | Sắp diễn ra/đang diễn ra/đã kết thúc/ẩn | Tính từ thời gian cùng với trạng thái biên tập được duyệt |
Nhà thầu bảo đảm các trường sự kiện được trình bày nhất quán giữa danh sách và trang chi tiết.

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Phân loại sự kiện phải thống nhất danh mục; sự kiện chỉ xuất hiện sau khi được phép công khai. Ngày/giờ kết thúc không được trước thời điểm bắt đầu; sự kiện qua đêm và múi giờ cần hỗ trợ theo quy tắc. Nếu trạng thái tính tự động, phải phân định với trạng thái biên tập (ẩn/hủy/hoãn). Sự kiện bị hủy/hoãn cần thông báo nổi bật, không để dòng thời gian thể hiện như sắp diễn ra. Thành phần tham dự/dữ liệu cá nhân chỉ hiển thị khi được duyệt. URL livestream/tệp cần kiểm tra hợp lệ và an toàn. Phân trang, dòng thời gian và bộ lọc phải dùng cùng một tập dữ liệu công khai.

**Rỗng, lỗi và biên.** Không có sự kiện trong khoảng lọc phải thông báo rõ, giữ tiêu chí và cho xóa lọc. Thiếu giờ hoặc địa điểm thì ẩn nhãn; không thay bằng dữ liệu bịa. Sự kiện nhiều ngày phải xuất hiện đúng trong các khoảng truy vấn. Sự kiện hoãn/hủy cần nhãn riêng nếu nguồn cung cấp. Tệp/liên kết hỏng không làm mất phần mô tả chính. Ngày không hợp lệ được báo trước khi tìm kiếm; URL sự kiện sai/đã gỡ trả trang không tìm thấy. Nếu dịch vụ lỗi, thông báo và thử lại không được gây trùng hoặc sai thứ tự.

**Tích hợp và luồng dữ liệu.** Nhà thầu tích hợp giao diện công khai với phân hệ sự kiện và danh mục loại sự kiện. Thiết kế thống nhất trạng thái xuất bản, cấu trúc thời gian, tệp, thành phần, địa điểm, liên kết livestream và quy tắc phân trang. Dòng thời gian và danh sách sử dụng cùng quy tắc dữ liệu để kết quả không khác nhau giữa các màn hình.

**Kịch bản nghiệm thu.**

1. Dùng dữ liệu sự kiện đã qua, sắp tới, nhiều ngày, qua đêm và bị hủy; xác nhận phân loại/trạng thái/dòng thời gian theo quy tắc được duyệt.
2. Lọc theo từng loại và khoảng ngày; đối chiếu kết quả, biên thời gian và phân trang.
3. Mở chi tiết có địa điểm, chương trình, tệp và livestream; xác nhận trường nào công khai và URL đích.
4. Thử ngày kết thúc trước ngày bắt đầu, thiếu giờ/địa điểm, loại đã xóa; xác nhận dữ liệu sai không hiển thị sai lệch.
5. Kiểm tra màn hình hẹp, bàn phím và cách đọc thứ tự ngày; xác nhận dòng thời gian vẫn hiểu được không cần dựa màu.
6. Thử danh sách rỗng, dịch vụ tra cứu lỗi, tệp lỗi và URL sự kiện đã gỡ; xác nhận thông báo cùng đường quay lại.

## 9. Đồng bộ giao diện chi tiết, chuyên trang và tiếng Anh


**Mục đích và đối tượng.** Đảm bảo người dùng nhận ra cùng một Cổng thông tin xuyên suốt các trang chủ, danh sách, chi tiết và chuyên trang; giảm nhầm lẫn điều hướng và hỗ trợ người đọc tiếng Anh khi có bản dịch chính thức. Đối tượng là toàn bộ người dùng công khai, đặc biệt người chuyển giữa tin, văn bản, sự kiện, Đảng bộ, Bộ trưởng và tiếng Anh. Hạng mục này là lớp dùng chung và các quy tắc liên kết, không thay thế mô tả riêng của tám chức năng trước.

**Giải pháp của Nhà thầu.** Nhà thầu xây dựng bộ thành phần giao diện dùng chung cho đầu trang, cuối trang, breadcrumb, thanh điều hướng phụ, kiểu chữ, thích ứng và siêu dữ liệu. Bộ thành phần được áp dụng xuyên suốt các mẫu trang, đồng thời nhận cấu hình menu/nhận diện riêng của từng chuyên trang. Nội dung tiếng Anh được biên tập và phê duyệt tương ứng với nội dung tiếng Việt; khi chưa có bản dịch, giao diện áp dụng phương án dự phòng thống nhất.

**Khu vực màn hình và quy tắc trình bày.** Đầu trang phải nhất quán về nhận diện, menu, tìm kiếm và điều khiển ngôn ngữ; menu thu gọn trên màn hình nhỏ phải có tên truy cập và trạng thái mở/đóng. Breadcrumb biểu thị quan hệ thực của trang, mỗi mục có liên kết hợp lệ trừ trang hiện tại. Thanh điều hướng phụ chuyên trang chỉ hiện điều hướng thuộc chuyên trang và không lẫn menu cổng chính. Kiểu chữ quy định cấp tiêu đề, đoạn, trích dẫn, danh sách, bảng, siêu dữ liệu, liên kết và nội dung văn bản dài. Cuối trang giữ thông tin cơ quan/liên kết đã duyệt. Bố cục phải tái sắp xếp trên màn hình nhỏ, không yêu cầu cuộn ngang toàn trang; nội dung nhúng/bảng cần cách xử lý riêng. Ngôn ngữ phải áp dụng nhất quán cho tiêu đề nút, trạng thái tải/lỗi/rỗng, nhãn ngày và siêu dữ liệu. Nhà thầu chỉ phát hành bản tiếng Anh theo nội dung dịch được duyệt và áp dụng phương án dự phòng khi thiếu bản dịch.

**Luồng chính.**

1. Người dùng mở bất kỳ trang công khai; đầu trang, breadcrumb, nội dung chính và cuối trang xuất hiện theo mẫu phù hợp.
2. Người dùng đi từ danh sách sang chi tiết; breadcrumb và thanh điều hướng phụ cập nhật đúng nhánh, không tạo liên kết vòng hoặc nhầm chuyên trang.
3. Người dùng đổi ngôn ngữ; ứng dụng giữ trang tương ứng khi có dữ liệu bản dịch, hoặc thông báo và áp dụng phương án dự phòng theo quy tắc đã duyệt.
4. Người dùng thay đổi kích thước màn hình hoặc dùng bàn phím; menu, bộ lọc, trình phát, phân trang và điều khiển nội dung vẫn sử dụng được.
5. Người dùng mở trang qua URL trực tiếp, tải lại hoặc từ liên kết ngoài; bố cục, tiêu đề, siêu dữ liệu và ngôn ngữ vẫn nhất quán.

**Dữ liệu/cấu hình hiển thị.**

| Nhóm | Trường dữ liệu | Ghi chú |
|---|---|---|
| Điều hướng | Menu, nhãn, URL, thứ tự, nhánh chuyên trang, ngôn ngữ | Cấu hình cần tránh URL mồ côi/vòng lặp |
| Breadcrumb | Nhãn, URL tổ tiên, trang hiện tại | Có thể tính từ đường dẫn trang hoặc dữ liệu; cách chọn cần thống nhất |
| Bản dịch | Khóa nội dung, ngôn ngữ, trạng thái duyệt, URL tương ứng | Không dịch máy tự động thành nội dung chính thức |
| Trình bày | Cỡ chữ, màu sắc, khoảng cách, điểm ngắt thích ứng | Áp dụng thống nhất theo bộ quy chuẩn thiết kế |
| Siêu dữ liệu | Tiêu đề, mô tả, URL chuẩn, thông tin chia sẻ | Dữ liệu cần khớp URL/ngôn ngữ và nội dung hiện tại |

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Nội dung mỗi ngôn ngữ được biên tập/duyệt tương ứng; không suy luận một trang tiếng Anh hoàn chỉnh từ cấu hình ngôn ngữ. URL chuẩn phải trỏ tới phiên bản nội dung đúng ngôn ngữ; bản dịch có quan hệ riêng khi được xác nhận. Breadcrumb và menu không được cấp quyền truy cập ngoài những gì trang công khai cho phép, cũng không thay đổi trạng thái xuất bản. Tất cả điều khiển cần nhãn hỗ trợ truy cập, trạng thái tiêu điểm dễ nhận biết và thứ tự bàn phím hợp lý, tương phản đủ theo tiêu chuẩn nghiệm thu được chọn. Nội dung HTML dài phải được làm sạch; cỡ chữ người dùng chọn không được làm che/ẩn nội dung. Nhà thầu kiểm thử theo tiêu chuẩn tiếp cận và danh sách trình duyệt/thiết bị được Chủ đầu tư phê duyệt.

**Rỗng, lỗi và biên.** Đường dẫn không có trang cha trong breadcrumb phải hiển thị đường về rõ ràng. Menu thiếu URL/nhãn cần bị chặn ở cấu hình hoặc ẩn có kiểm soát. Bản tiếng Anh thiếu bản dịch không được để nhãn một nửa Việt một nửa Anh ngoài thuật ngữ đã duyệt. Trang rộng có bảng/đa phương tiện phải có cuộn cục bộ hoặc cách trình bày thay thế; không tràn ngang toàn cổng. Tiêu đề dài, font phóng lớn, zoom trình duyệt và menu nhiều cấp cần được thử. Nếu tệp trình bày hoặc thành phần tải sau gặp lỗi, nội dung chính không nên bị che hoàn toàn; trạng thái tải trì hoãn có kích thước giữ chỗ. URL chuẩn thiếu/sai không được tạo giá trị tự suy đoán ở môi trường khác nhau.

**Tích hợp và luồng dữ liệu.** Nhà thầu xây dựng thành phần dùng chung cho đầu trang, cuối trang, breadcrumb, thanh điều hướng phụ, menu, kiểu chữ, điều khiển ngôn ngữ và siêu dữ liệu; lập bảng đối chiếu trang × bố cục × ngôn ngữ để bao phủ toàn bộ phạm vi. Mỗi chuyên trang có thể cấu hình menu và nhận diện riêng, bảo đảm các thành phần chung không làm nhập nhằng phạm vi.

**Kịch bản nghiệm thu.**

1. Chọn mẫu trang chủ, danh sách, chi tiết, văn bản, đa phương tiện, sự kiện, chuyên trang Bộ trưởng và Đảng bộ; so sánh đầu trang/cuối trang/kiểu chữ/breadcrumb với mẫu thiết kế.
2. Duyệt toàn bộ menu và breadcrumb ở mỗi mẫu; xác nhận đúng URL/nhánh, không vòng lặp, không lẫn Đảng bộ với chuyên trang khác.
3. Đổi Việt–Anh ở trang có bản dịch và thiếu bản dịch; kiểm tra nhãn, nội dung, ngày, URL chuẩn và quy tắc dự phòng.
4. Kiểm tra ở màn hình máy tính, máy tính bảng và điện thoại; phóng to chữ/zoom trình duyệt và xác nhận không mất chức năng hoặc cuộn ngang toàn trang.
5. Dùng bàn phím/đọc nhãn điều khiển; kiểm tra trạng thái tiêu điểm, menu, phân trang, biểu mẫu, slider/khung xem ảnh phóng lớn và thông báo lỗi theo tiêu chuẩn đã chọn.
6. Mở URL trực tiếp, tải lại, điều hướng qua liên kết ngoài và thử lỗi tải một khối trì hoãn; xác nhận bố cục/siêu dữ liệu ổn định và nội dung chính còn truy cập.

## Cam kết tổ chức thực hiện

Nhà thầu cùng Chủ đầu tư khảo sát nội dung, danh mục, ngôn ngữ, quyền công khai, cấu hình điều hướng và quy tắc biên tập; thống nhất thiết kế giao diện và dữ liệu trước khi xây dựng. Mỗi chức năng được triển khai theo các luồng và trường nghiệp vụ tại tài liệu này, tích hợp với các phân hệ liên quan, kiểm thử chức năng, phân quyền, thích ứng, dữ liệu và tải theo yêu cầu HSYC. Nhà thầu bàn giao kết quả kiểm thử, hướng dẫn khai thác và tài liệu cấu hình để Chủ đầu tư nghiệm thu.







