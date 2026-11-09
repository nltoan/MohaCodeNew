# Thuyết minh chi tiết đề xuất — các chức năng công khai 1–9

## Quy ước, phạm vi và cách đọc

Tài liệu này diễn giải chín hạng mục giao diện công khai đầu trong ma trận 29 hạng mục, theo các mã HSYC được liệt kê tại từng mục. Mục đích là làm rõ phương án, hành vi mong muốn và cách nghiệm thu; không phải cam kết đã hoàn thành, biên bản kiểm thử hoặc xác nhận phù hợp pháp lý. Những nội dung ghi “đề xuất” cần được Chủ đầu tư xác nhận về nghiệp vụ, dữ liệu, chính sách biên tập, nhận diện và vận hành trước khi chốt thiết kế. Các tiêu chí nghiệm thu bên dưới là tình huống có thể kiểm chứng, không phải bằng chứng rằng tình huống đã chạy đạt.

“Bằng chứng mã nguồn” chỉ mô tả dấu vết rà soát tĩnh tại những tệp được dẫn. Nó không khẳng định trang chạy đúng trên môi trường đích, dữ liệu đầy đủ, API an toàn, hoặc hạng mục đã nghiệm thu. “Đề xuất” mô tả năng lực mong muốn và không được hiểu là năng lực đã có. Tên trường trong bảng được chia làm hai loại: trường có bằng chứng được ghi đúng tên khi đã thấy ở mã; trường nghiệp vụ chưa xác nhận được ghi là trường logic đề xuất, không hàm ý tên cột/API/schema. Không tài liệu nào ở đây xác lập endpoint mới, hợp đồng API, mô hình cơ sở dữ liệu hay thông số hạ tầng chưa có bằng chứng.

Phạm vi Đảng bộ cần được xác nhận riêng. Route và trang Nghị quyết TW4 hiện có là bằng chứng về một chuyên trang cụ thể; không đủ căn cứ để xem Nghị quyết TW4 đồng nhất với trang Đảng bộ Bộ Nội vụ theo HSYC. Phần đề xuất Đảng bộ bên dưới vì vậy không mô tả TW4 như trang thay thế, cũng không giả định hai tập nội dung cùng một danh mục.

## 1. Giao diện trang chủ

**Tham chiếu HSYC:** B0738.R003; B0742.R003–R005; B0746.R003.

**Mục đích và đối tượng.** Trang chủ là điểm vào cho người dân, cán bộ, cơ quan báo chí và các tổ chức cần tìm tin, văn bản, sự kiện, thông tin chuyên ngành và tiện ích của Bộ. Giao diện cần giúp người dùng nhận biết rõ cơ quan chủ quản, chọn ngôn ngữ, điều hướng đến đúng chuyên mục và phân biệt nội dung mới với nội dung nổi bật. Người dùng không đăng nhập để đọc các nội dung đã công khai. Biên tập viên/quản trị viên là đối tượng gián tiếp: họ chuẩn bị nội dung, menu, banner và cấu hình khối ở hệ thống quản trị; các thao tác quản trị không xuất hiện trong luồng người dùng công khai.

**Bằng chứng mã nguồn hiện có.** `frontend/src/pages/home/HomePage.tsx` ghép các khối `HomeBanner`, `HomeCategorySection`, `HomeCTASection`, `HomeOtherSection`, `HomeInteractSection`, `HomeMediaSection` và `HomeRefsSection`; một số phần được tải trì hoãn bằng `DeferredSection`/`Suspense`. `frontend/src/pages/home/components/banner/HomeBanner.tsx` tải dữ liệu banner và dùng ảnh ưu tiên cho ảnh đầu. `frontend/src/layout/components/footer/Footer.tsx` là dấu vết footer. Đây chỉ là cấu thành giao diện hiện có; ma trận đánh giá còn thiếu kiểm thử cấu hình, điều hướng, tìm kiếm, nội dung và responsive.

**Khu vực màn hình đề xuất.** (1) Header nhận diện Bộ, menu chính, nút tìm kiếm, bộ chọn ngôn ngữ và điều hướng nhỏ trên thiết bị hẹp; (2) banner/slider có tiêu đề thay thế, liên kết đích và điều khiển truy cập được; (3) khối tin tiêu điểm và tin theo danh mục; (4) khối văn bản/chỉ đạo, văn bản mới hoặc đang có hiệu lực; (5) khối dự thảo đang lấy ý kiến, chỉ xuất hiện theo thời gian lấy ý kiến được duyệt; (6) khối sự kiện; (7) khối ảnh/video/audio; (8) khối tiện ích/liên kết dùng chung; (9) footer gồm thông tin cơ quan và liên kết đã duyệt. Thứ tự, số lượng thẻ, khả năng ẩn/hiện, nội dung tiếng Anh và vị trí từng khối là cấu hình cần thống nhất với Chủ đầu tư. Các khối phải có tiêu đề và đường dẫn “xem thêm” rõ ràng, không dùng nội dung giả lập như dữ liệu thật.

[FIG:public-home]

**Luồng chính đề xuất.**

1. Người dùng mở URL trang chủ; ứng dụng hiển thị khung nhận diện, tiêu đề trang và các vùng nội dung theo cấu hình ngôn ngữ hiện hành.
2. Giao diện lấy dữ liệu công khai cho từng khối. Chỉ bản ghi được phép công khai và còn trong khoảng hiển thị mới được đưa vào danh sách; quy tắc thời gian cần được xác nhận với quy trình xuất bản.
3. Người dùng mở một thẻ tin, văn bản, sự kiện, album hoặc tiện ích; ứng dụng điều hướng đến trang đích phù hợp và giữ đường dẫn có thể chia sẻ/làm mới.
4. Người dùng nhập truy vấn tại vùng tìm kiếm và gửi; giao diện chuyển sang kết quả tìm kiếm với từ khóa được giữ lại. Loại nội dung, phạm vi tìm, lọc và phân trang được diễn giải ở chức năng 9 nếu áp dụng tìm tổng hợp.
5. Người dùng đổi ngôn ngữ; giao diện nạp menu và nội dung theo bản ngôn ngữ có sẵn. Khi một nội dung chưa có bản dịch, hệ thống cần áp dụng phương án được duyệt (ẩn, báo chưa có bản dịch hoặc dẫn về bản gốc) thay vì tạo bản dịch ngầm.
6. Người dùng cuộn đến cuối trang và chọn liên kết footer hoặc tiện ích; đích liên kết mở đúng trang/đơn vị đích theo quy tắc mở tab được thống nhất.

**Dữ liệu hiển thị (trường logic, không phải schema).**

| Nhóm | Trường logic đề xuất | Ghi chú nghiệp vụ |
|---|---|---|
| Khối | Tên/tiêu đề, thứ tự, vị trí, ngôn ngữ, trạng thái hiển thị | Cấu hình phải có người chịu trách nhiệm và bản xem trước |
| Banner | Tiêu đề, mô tả ngắn, ảnh, văn bản thay thế, liên kết, ngày bắt đầu/kết thúc | Không hiển thị liên kết rỗng hoặc ảnh không tải được |
| Thẻ nội dung | Tiêu đề, tóm tắt, ảnh, ngày công khai, nhãn loại, URL đích | Lấy từ nội dung đã duyệt/công khai |
| Tìm kiếm | Từ khóa, phạm vi, loại nội dung nếu được hỗ trợ | Giữ truy vấn khi điều hướng/phân trang |
| Footer/tiện ích | Nhãn, URL, logo/ảnh tùy chọn, thứ tự | Chỉ dùng liên kết đã được kiểm tra và phê duyệt |

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Khách truy cập chỉ đọc nội dung công khai. Không có quyền sửa nội dung qua giao diện này. Mọi lọc theo trạng thái phải được thực hiện ở nguồn dữ liệu/API, không dựa riêng vào việc ẩn thẻ trên trình duyệt. Banner cần có tiêu đề/alt phù hợp, kích thước ảnh và URL hợp lệ; mục hết hạn hoặc chưa đến ngày bắt đầu không được xuất hiện. Tiêu đề khối rỗng, URL hỏng, dữ liệu sai ngôn ngữ hoặc bản ghi trùng cần được xử lý theo quy tắc cấu hình; đề xuất không phát hành thẻ không có tiêu đề/đích hợp lệ. Nội dung HTML đưa vào trang cần được làm sạch ở điểm hiển thị. Tải trì hoãn không được làm mất khả năng điều hướng hay khiến vùng trang nhảy bố cục quá mức. Chỉ tiêu hiệu năng không để ngỏ và áp dụng cấp hệ thống, không riêng trang chủ: HSYC yêu cầu 500 phiên truy cập công khai đồng thời, trong đó 84 phiên thực hiện tác vụ động; kịch bản tải phải gồm trang chủ, tìm kiếm, xem tin bài, tải tệp và thao tác quản trị [B0804]. Tác vụ thông thường có thời gian phản hồi trung bình dưới 2,5 giây và chậm nhất dưới 30 giây; tương tác trực tiếp có mục tiêu không quá 0,6 giây khi điều kiện mạng và tải cho phép; tác vụ dài phải hiển thị trạng thái xử lý [B0805]. Trong kiểm thử tải danh định, CPU trung bình từng nút không vượt 75%, không có swap kéo dài và còn tối thiểu 25% dư địa tài nguyên [B0806]. Đây là ngưỡng kiểm chứng trên bản hoàn thiện và hạ tầng nghiệm thu, không phải kết quả đã đạt; HSYC yêu cầu đo kiểm trên phiên bản phần mềm hoàn thiện [B0816].

**Rỗng, lỗi và biên.** Nếu một khối không có bản ghi, đề xuất ẩn khối hoặc hiển thị thông báo rỗng ngắn theo quyết định thiết kế; không để lại khoảng trống lớn. Nếu ảnh/banner lỗi, dùng ảnh dự phòng có alt phù hợp hoặc bỏ ảnh mà vẫn giữ tiêu đề/liên kết. Nếu một nguồn dữ liệu lỗi, các khối độc lập còn lại vẫn nên dùng được; cung cấp thông báo dễ hiểu và nút thử lại khi phù hợp. Nếu menu trống, vẫn cần đường về trang chủ và các lối điều hướng tối thiểu. Trên màn hình hẹp, menu, điều khiển slider và thẻ phải thao tác được bằng cảm ứng/bàn phím. Với trang không hỗ trợ ngôn ngữ đã chọn, phải giữ lựa chọn và thông báo rõ ràng.

**Tích hợp và luồng dữ liệu.** Nguồn dự kiến là nội dung đã xuất bản cùng cấu hình banner/menu/khối/liên kết do phân hệ quản trị cung cấp. Trang chủ tổng hợp dữ liệu qua các service công khai hiện hữu hoặc hợp đồng được thống nhất; danh sách trong mỗi khối nên giới hạn số bản ghi và có thứ tự nhất quán. Không suy ra từ mã hiện có rằng mọi khối dùng chung một API hay mọi khối được cấu hình động. Cần lập bảng ánh xạ từng vùng UI sang nguồn dữ liệu, quy tắc ngôn ngữ, tiêu chí công khai và URL đích; xác nhận trước khi triển khai.

**Kịch bản nghiệm thu đề xuất.**

1. Cấu hình banner và các khối có dữ liệu mẫu đã xuất bản; kiểm tra thứ tự, tiêu đề, ảnh, liên kết và điều hướng đến đúng URL.
2. Có nội dung nháp, đã xuất bản, hết hạn và lên lịch; xác nhận chỉ các mục theo quy tắc được duyệt xuất hiện.
3. Mở trang chủ trên máy tính và màn hình hẹp; kiểm tra menu, tìm kiếm, slider, thẻ và footer sử dụng được bằng bàn phím/cảm ứng.
4. Chọn tiếng Anh khi có và khi thiếu bản dịch; xác nhận menu/nội dung theo đúng chính sách bản dịch đã duyệt.
5. Làm cho một nguồn khối phản hồi lỗi và một banner có ảnh hỏng; xác nhận các vùng độc lập còn lại hoạt động và lỗi có phương án dự phòng.
6. Chọn từng đường dẫn của các khối văn bản, tin, media, sự kiện và tiện ích; đối chiếu URL, ngôn ngữ và trạng thái đích.

## 2. Giao diện trang chuyên mục và chi tiết tin

**Tham chiếu HSYC:** B0738.R004; B0742.R006–R008; B0746.R004.

**Mục đích và đối tượng.** Chuyên mục giúp người đọc duyệt tin theo chủ đề; trang chi tiết trình bày một nội dung cụ thể, nguồn/tác giả, tệp và các liên kết liên quan. Khách truy cập là người đọc chính; biên tập viên chỉ tham gia gián tiếp qua trạng thái và dữ liệu xuất bản. Đề xuất gồm danh sách chuyên mục, trang danh sách tin, trang chi tiết và điều hướng qua lại; bình luận hoặc chia sẻ tùy thuộc phạm vi và chính sách được Chủ đầu tư xác nhận.

**Bằng chứng mã nguồn hiện có.** Có `frontend/src/pages/news/NewsCategoryPage.tsx`, `NewsPage.tsx`, `NewsDetailPage.tsx` và service `frontend/src/services/news.ts`. Trang danh sách có tải dữ liệu theo trang; chi tiết lấy bản ghi từ slug, hiển thị tiêu đề, ngày, nội dung đã qua `sanitizeHtml`, tệp PDF, tác giả tùy trường có dữ liệu và tin liên quan có phân trang. Có thiết lập metadata/canonical và điều khiển cỡ chữ/in. Các thành phần trên là bằng chứng giao diện; không đủ chứng minh đầy đủ bộ lọc HSYC, QR động, bình luận công khai hoặc mọi trường nguồn.

**Khu vực màn hình đề xuất.** Trang danh sách: breadcrumb; tiêu đề chuyên mục; mô tả/ảnh đầu trang nếu được cấu hình; bộ lọc từ khóa và khoảng thời gian theo phạm vi được xác nhận; thẻ tin nổi bật; danh sách tin có tiêu đề, ngày, tóm tắt, ảnh; điều khiển trang và số bản ghi; trạng thái đang tải/rỗng/lỗi. Trang chi tiết: breadcrumb; nhãn chuyên mục; tiêu đề; ngày xuất bản/cập nhật nếu dữ liệu có; tác giả hoặc nguồn; nút phóng to/thu nhỏ chữ, in và chia sẻ; nội dung; ảnh/video nhúng đã kiểm tra; tệp liên quan; QR đến URL chuẩn nếu hạng mục QR được triển khai; tin liên quan; phần bình luận chỉ khi Chủ đầu tư phê duyệt chính sách và có quy trình kiểm duyệt. Phần bình luận của tin thường không được suy diễn từ chức năng góp ý dự thảo.

**Luồng chính đề xuất.**

1. Người dùng mở chuyên mục từ menu hoặc liên kết; breadcrumb, tiêu đề và danh sách phản ánh đúng chuyên mục đang chọn.
2. Người dùng chọn bộ lọc (nếu có), nhập từ khóa hoặc khoảng ngày và áp dụng; giao diện đưa trang về trang đầu, cập nhật truy vấn và danh sách.
3. Người dùng chuyển trang hoặc thay đổi số bản ghi; hệ thống truy vấn lại theo cùng điều kiện và không làm mất bộ lọc.
4. Người dùng mở một tin; URL ổn định và có thể tải lại. Hệ thống tra cứu nội dung theo định danh/slug, hiển thị trạng thái tải rồi nội dung hoặc trang không tìm thấy.
5. Người đọc điều chỉnh cỡ chữ, in hoặc mở tệp liên quan; hành động không làm thay đổi nội dung lưu trữ.
6. Người dùng chọn tin liên quan hoặc QR/chia sẻ nếu được hỗ trợ; liên kết phải đến nội dung công khai đúng bản ghi.

**Dữ liệu hiển thị (tên trường ghi theo logic).**

| Nhóm | Trường logic đề xuất | Ghi chú |
|---|---|---|
| Chuyên mục | Tên, mô tả, ảnh, breadcrumb, ngôn ngữ | Chỉ lấy cấu hình công khai |
| Tin danh sách | Tiêu đề, tóm tắt, ảnh đại diện, ngày xuất bản, loại/nổi bật, URL | Sắp xếp theo quy tắc đã thống nhất |
| Tin chi tiết | Tiêu đề, nội dung, tác giả/nguồn, ngày, từ khóa, ảnh, chuyên mục | Bằng chứng code dùng `TieuDe`, `NoiDung`, `TacGia`, `NgayXuatBan`, `TuKhoa` và metadata liên quan |
| Tệp/quan hệ | Tên tệp, URL, loại, kích thước; nội dung liên quan | Code truy cập `TinTuc_Files` và `File.LinkLuuTru` |
| Tìm/phân trang | Từ khóa, từ ngày, đến ngày, trang, kích thước trang | Bộ lọc ngày phải xác định múi giờ và tính bao gồm ngày cuối |

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Người chưa đăng nhập chỉ đọc bản ghi được công khai. Không được để lộ nháp bằng cách gọi trực tiếp URL/API. Từ ngày không được sau đến ngày; trang phải trở về 1 khi bộ lọc đổi; trang vượt tổng số phải xử lý có kiểm soát. Tiêu đề và slug phải định tuyến đến đúng nội dung, tránh hai bản ghi cùng slug gây nhầm. HTML, URL ảnh nhúng và tệp cần được làm sạch/kiểm tra phù hợp; loại tệp được mở/tải theo chính sách của cổng. QR và canonical phải dùng URL chuẩn, không phải URL môi trường thử hoặc URL có tham số truy vấn ngẫu nhiên. Bình luận công khai (nếu có) phải xác định công khai ngay hay chờ duyệt, cách xử lý dữ liệu cá nhân và chống spam; đây là đề xuất cần phê duyệt.

**Rỗng, lỗi và biên.** Chuyên mục không có tin cần thông báo không có dữ liệu và vẫn giữ tiêu đề/breadcrumb. Từ khóa không có kết quả hiển thị bộ lọc đã áp dụng cùng thao tác xóa lọc. Tin không tồn tại, bị gỡ hoặc không công khai trả trạng thái không tìm thấy/không truy cập được nhất quán; không hiển thị một phần nội dung riêng tư. Tệp hỏng cần báo rõ và không làm hỏng toàn trang. Nội dung thiếu ảnh vẫn phải có bố cục; thiếu tác giả/ngày thì ẩn nhãn tương ứng thay vì in giá trị rỗng. Tin dài, nhiều ảnh, URL cũ hoặc slug có dấu cần được kiểm tra. Nếu dịch vụ liên quan lỗi, nội dung chính vẫn có thể đọc được.

**Tích hợp và luồng dữ liệu.** Mã hiện hữu gọi service tin cho danh mục, chi tiết và bài liên quan; luồng dùng slug có thể phân biệt định danh cũ/oid. Hợp đồng chính xác của từng truy vấn và tính ổn định của URL cần được xác minh. Nguồn quản trị là tin đã duyệt/xuất bản, chuyên mục và quan hệ tệp. Đề xuất là giữ bộ lọc ở phía truy vấn có kiểm soát và trả tổng số nhất quán cho phân trang; không khẳng định mã nguồn hiện hỗ trợ đầy đủ từng bộ lọc ngày/yêu cầu HSYC. Nội dung đa ngôn ngữ phải ánh xạ về bản dịch tương ứng, không trộn tiêu đề ngôn ngữ này với nội dung ngôn ngữ khác.

**Kịch bản nghiệm thu đề xuất.**

1. Dùng dữ liệu có ít nhất hai trang, nhiều ngày và một tin nổi bật; kiểm tra thứ tự, bộ lọc, phân trang và tổng số.
2. Tìm theo từ khóa có/không có kết quả; xác nhận truy vấn được giữ khi chuyển trang và có thể xóa.
3. Mở tin có ảnh, HTML, tệp, tác giả và quan hệ; xác nhận nội dung, metadata, tệp và liên kết đúng bản ghi.
4. Mở URL sai, nội dung nháp và nội dung đã gỡ; xác nhận không lộ dữ liệu và có trang lỗi phù hợp.
5. Kiểm tra cỡ chữ, in, canonical, chia sẻ/QR nếu thuộc phạm vi nghiệm thu; quét/mở URL xác nhận đến đúng trang chuẩn.
6. Thử tin thiếu ảnh/tác giả, tệp không truy cập được và dịch vụ tin liên quan lỗi; xác nhận nội dung chính vẫn hiển thị an toàn.

## 3. Giao diện trang Đảng bộ Bộ Nội vụ

**Tham chiếu HSYC:** B0738.R005; B0742.R009–R010; B0746.R005.

**Mục đích và đối tượng.** Chuyên trang là khu vực công khai có nhận diện, điều hướng, danh sách và chi tiết nội dung thuộc phạm vi Đảng bộ Bộ Nội vụ. Đối tượng gồm đảng viên, cán bộ, tổ chức và người dân tìm hiểu thông tin Đảng bộ. Phạm vi danh mục, nội dung được phép công khai, nhận diện và quan hệ với cổng chính cần được Chủ đầu tư duyệt. Đề xuất coi đây là một chuyên trang riêng có thể chia sẻ thành phần nền tảng nhưng có cấu hình và nội dung được xác định rõ.

**Ranh giới phạm vi và bằng chứng mã nguồn.** `frontend/src/App.tsx` có route `/nghi-quyet-tw4`; `frontend/src/pages/nghiquyettw4/home/NghiQuyetTW4HomePage.tsx` thể hiện trang chủ chuyên trang Nghị quyết TW4; còn `frontend/src/pages/nghiquyettw4-news/` có các trang tin tương ứng. `frontend/src/services/nghiquyettw4.ts` là service liên quan. Đây là bằng chứng cho chuyên trang Nghị quyết TW4 đang có trong mã. Ma trận rà soát chưa thấy đủ bằng chứng trang Đảng bộ độc lập có quản trị/dữ liệu riêng. Không được kết luận hai phạm vi là một chỉ dựa trên tên SEO, route hay nội dung có liên hệ. Cần xác nhận bằng văn bản danh mục nào thuộc trang Đảng bộ, có dùng chung nội dung hay không, và TW4 là phần con/đường dẫn riêng hay một sản phẩm khác.

**Khu vực màn hình đề xuất.** Trang chủ chuyên trang: nhận diện Đảng bộ được duyệt; menu chuyên trang; banner/khối tin đầu; danh mục nội dung; tin mới/nổi bật; thông tin hoạt động, văn kiện hoặc tổ chức nếu HSYC và Chủ đầu tư xác nhận; footer/liên kết về cổng chính. Trang danh sách: breadcrumb, tên chuyên mục, mô tả, lọc/từ khóa (nếu duyệt), danh sách và phân trang. Trang chi tiết: breadcrumb, tiêu đề, ngày, nguồn/tác giả khi có, nội dung, tệp/ảnh liên quan, nội dung cùng chuyên trang. Hệ thống phải phân biệt rõ chuyên trang Đảng bộ với Nghị quyết TW4 trong tiêu đề, menu, URL, metadata, kết quả tìm kiếm và liên kết từ cổng chính.

**Luồng chính đề xuất.**

1. Người dùng truy cập từ menu/URL chuyên trang và thấy đúng tên, nhận diện, breadcrumb và menu đã duyệt.
2. Người dùng chọn danh mục; danh sách chỉ lấy nội dung thuộc phạm vi đã cấu hình cho trang Đảng bộ.
3. Người dùng tìm/lọc (nếu được duyệt), chuyển trang và mở chi tiết; trạng thái lọc/URL phải cho phép chia sẻ và tải lại.
4. Người dùng mở tệp hoặc liên kết nội dung liên quan; liên kết giữ nguyên ranh giới chuyên trang trừ khi đích được xác định rõ là cổng chính/TW4.
5. Người dùng chuyển từ trang Đảng bộ sang trang Nghị quyết TW4 qua liên kết được cấu hình; giao diện và URL cho biết người dùng đã chuyển phạm vi.

**Dữ liệu hiển thị.**

| Nhóm | Trường logic đề xuất | Ghi chú |
|---|---|---|
| Nhận diện | Tên chuyên trang, logo/ảnh, mô tả, menu, màu sắc | Nội dung và dấu hiệu nhận diện do Chủ đầu tư duyệt |
| Danh mục | Tên, thứ tự, ngôn ngữ, phạm vi/khóa chuyên trang | Không dùng chung mặc định với TW4 |
| Bài viết | Tiêu đề, tóm tắt, nội dung, ngày, tác giả/nguồn, ảnh, tệp | Chỉ công khai sau quy trình duyệt được phê chuẩn |
| Điều hướng | URL, nhãn, loại trang đích, quan hệ đến TW4/cổng chính | Liên kết ngoài phạm vi phải minh bạch |

Các trường trên là mô hình khái niệm. Chưa có căn cứ để đặt tên cột, route mới hay endpoint cụ thể cho Đảng bộ.

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Quyền đọc tuân theo trạng thái công khai; nội dung nội bộ/không được phép công khai không xuất hiện qua trang, tìm kiếm hay URL trực tiếp. Danh mục, menu, tiêu đề, slug và URL cần duyệt để tránh gắn nhầm bản ghi TW4. Nếu tái sử dụng nội dung, cần có quy tắc nguồn chuẩn, bản dịch và đồng bộ cập nhật; không tạo bản sao không truy nguyên. Người quản trị nội dung cần quyền riêng phù hợp (đề xuất) nhưng ma trận vai trò chưa được xác nhận. Cấu hình ngôn ngữ và nhận diện cần được duyệt trước khi phát hành.

**Rỗng, lỗi và biên.** Nếu chưa có dữ liệu được phép công khai, hiển thị trang thông báo đã duyệt, không lấy tin TW4 làm dữ liệu thay thế. Danh mục sai/đã xóa trả trang không tìm thấy. Bản ghi liên kết nhầm phạm vi cần được chặn khỏi danh sách và báo cho người quản trị qua quy trình nội bộ đã thống nhất. URL cũ của TW4 không tự chuyển sang Đảng bộ nếu chưa có bảng ánh xạ và xác nhận. Thiếu bản dịch, banner hoặc nội dung nhận diện cần theo chính sách dự phòng được duyệt; không trộn ngôn ngữ.

**Tích hợp và luồng dữ liệu.** Trước xây dựng, cần có danh sách nguồn dữ liệu Đảng bộ, chủ sở hữu, mẫu bản ghi, danh mục, tệp và quan hệ với dữ liệu Nghị quyết TW4. Ma trận có mapping migration TW4 riêng (`migrate/MigrationTool/Mappings/04.2.NghiQuyetTW4_TinTuc_TinTuc.json`) nhưng đây không chứng minh mapping cho Đảng bộ HSYC. Đề xuất lập mapping/khóa phạm vi riêng sau khi Chủ đầu tư duyệt; công khai chỉ tiêu thụ dữ liệu có nhãn phạm vi đúng. Các thành phần dùng chung (header/footer/breadcrumb) có thể dùng chung kỹ thuật nhưng không làm nhập nhằng nhận diện hoặc quyền xuất bản.

**Kịch bản nghiệm thu đề xuất.**

1. Chủ đầu tư duyệt mẫu nhận diện, menu, danh mục và bộ dữ liệu Đảng bộ; xác nhận hiển thị đúng trên trang chủ/danh sách/chi tiết.
2. Có bản ghi Đảng bộ, bản ghi TW4 và bản ghi nháp; xác nhận mỗi bản ghi chỉ xuất hiện đúng phạm vi, bản nháp không công khai.
3. Kiểm tra URL, breadcrumb, metadata và tìm kiếm của cả hai chuyên trang; xác nhận không định tuyến/hiển thị nhầm.
4. Mở tệp và liên kết liên quan; đối chiếu đích, quyền truy cập và bản ghi nguồn.
5. Thử danh mục rỗng, URL cũ, bản dịch thiếu và banner lỗi; xác nhận trạng thái dự phòng đã duyệt, không thay thế dữ liệu bằng phạm vi khác.
6. Đối chiếu mẫu dữ liệu sau chuyển thử với nguồn Đảng bộ được xác nhận; lập biên bản số lượng và sai khác trước khi kết luận.

## 4. Giao diện chuyên trang Bộ trưởng

**Tham chiếu HSYC:** B0738.R006; B0742.R011–R012; B0746.R006.

**Mục đích và đối tượng.** Chuyên trang tập trung thông tin về Bộ trưởng, hoạt động, phát biểu/chỉ đạo và tin liên quan. Người đọc là cán bộ, báo chí, tổ chức và người dân. Đề xuất giao diện có trang chủ chuyên trang, danh mục, danh sách và chi tiết, đồng thời duy trì nhận diện chung của Cổng Bộ Nội vụ. Cần xác nhận tên hiển thị/chức danh và quy tắc lưu trữ nội dung lịch sử, không suy đoán thông tin chức vụ hiện hành.

**Bằng chứng mã nguồn hiện có.** Có `frontend/src/pages/minister/home/MinisterHomePage.tsx` cùng các khối banner, top news, top category, media và CTA; có các trang tin trong `frontend/src/pages/minister-news/` và service `frontend/src/services/minister.ts`. Ma trận đánh giá là một phần, cần kiểm tra cấu hình và quản trị chuyên trang. Mã này chứng minh thành phần UI tồn tại, không chứng minh mọi dữ liệu gắn đúng, đủ mục phát biểu/chỉ đạo hay cấu hình riêng.

**Khu vực màn hình đề xuất.** Trang chủ: header dùng chung, nhãn chuyên trang; banner/ảnh tiêu điểm; thông tin giới thiệu nếu được duyệt; tin hoạt động và phát biểu/chỉ đạo; nhóm danh mục; media; liên kết về tin Bộ. Danh sách: tiêu đề, lọc/từ khóa/thời gian theo nghiệp vụ, thẻ tin, phân trang. Chi tiết: tiêu đề, ngày, nội dung, nguồn/tác giả, tệp, tin cùng chuyên trang, chia sẻ/in/QR khi các yêu cầu liên quan được triển khai. Menu và các vùng nội dung riêng phải được phân biệt với menu toàn cổng.

**Luồng chính đề xuất.**

1. Mở chuyên trang từ menu hoặc URL; nhận diện và breadcrumb chỉ rõ bối cảnh Bộ trưởng.
2. Chọn mục phát biểu, hoạt động hoặc danh mục khác đã duyệt; hệ thống liệt kê nội dung thuộc chuyên trang.
3. Dùng tìm kiếm/lọc thời gian nếu được cấu hình; kết quả và phân trang giữ nguyên điều kiện lọc.
4. Mở bài viết, đọc nội dung/tệp, xem tin liên quan và trở về danh sách mà không mất bối cảnh.
5. Chọn liên kết sang cổng chính hoặc chuyên trang khác; nhãn/đích cho biết chuyển ngữ cảnh.

**Dữ liệu hiển thị.**

| Nhóm | Trường logic đề xuất | Ghi chú |
|---|---|---|
| Cấu hình | Tên, logo/banner, menu, thứ tự khối, ngôn ngữ | Cần xác định cấu hình gắn riêng hay dùng cấu hình chung |
| Nội dung | Tiêu đề, tóm tắt, nội dung, ảnh, ngày, danh mục, tác giả/nguồn | Nội dung đã công khai |
| Tệp/liên kết | Tên, URL, loại tệp, nội dung liên quan | Xác minh quyền tải và đích |
| Lọc | Từ khóa, danh mục, thời gian, trang | Các tiêu chí chính thức do Chủ đầu tư duyệt |

Các nhãn là trường khái niệm, không quy định schema mới.

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Chỉ bài đã duyệt và đúng phạm vi chuyên trang được hiển thị. Bài liên quan một hoạt động nhưng được phân loại ở trang khác không tự động xuất hiện nếu không có quan hệ/điều kiện đã duyệt. Tên/chức danh và ảnh nhận diện phải lấy từ nội dung được duyệt, có ngày hiệu lực nếu cần; tài liệu đề xuất không duy trì dữ liệu chức danh cụ thể. Lọc thời gian phải thống nhất ngày, múi giờ và cách tính mốc cuối. Không phơi bày dữ liệu biên tập qua endpoint công khai. Liên kết ảnh, tệp và HTML cần được xác thực/làm sạch.

**Rỗng, lỗi và biên.** Chuyên trang chưa có tin ở một danh mục thì hiển thị trạng thái rỗng cục bộ. Không có banner không được làm mất khả năng đi vào nội dung. Nội dung bị gỡ/không công khai phải trả về trang lỗi an toàn. Nếu một khối media hoặc tin lỗi, phần khác vẫn sử dụng được. Bài lịch sử có chức danh khác thời điểm hiện tại cần giữ thông tin tại thời điểm đăng, theo chính sách biên tập được duyệt; không tự thay bằng giá trị hiện thời.

**Tích hợp và luồng dữ liệu.** Mã hiện có service và khối chuyên trang; các nguồn có thể là tin và cấu hình menu/banner tổng quát. Cần lập rõ ánh xạ nguồn–khối, quy tắc chuyên trang, ngôn ngữ, thứ tự và xuất bản. Không suy ra từ `minister.ts` rằng toàn bộ cấu hình riêng đã có; nếu dùng chung module tin, cần khóa định danh/chuyên trang rõ để tránh lẫn danh sách. Quan hệ với hệ thống quản trị banner/menu cần được nghiệm thu đầu cuối.

**Kịch bản nghiệm thu đề xuất.**

1. Cập nhật bộ dữ liệu mẫu đã duyệt cho banner, hoạt động, phát biểu, media; xác nhận từng khối và URL đích.
2. Có tin chuyên trang và tin tổng quát gần giống tiêu đề; xác nhận chỉ tin thuộc đúng phạm vi xuất hiện.
3. Kiểm tra lọc danh mục/thời gian và phân trang bằng tập dữ liệu qua nhiều trang.
4. Mở chi tiết có tệp, bài lịch sử và bài thiếu ảnh; xác nhận metadata, nguồn và dự phòng.
5. Kiểm tra menu/breadcrumb trên thiết bị hẹp, đổi ngôn ngữ khi có/thiếu bản dịch.
6. Thử bản nháp, bài hết hạn, URL sai và API lỗi; xác nhận không lộ dữ liệu và có thông báo phù hợp.

## 5. Giao diện văn bản quy phạm pháp luật và văn bản chỉ đạo, điều hành

**Tham chiếu HSYC:** B0738.R007; B0742.R013–R014; B0746.R007.

**Mục đích và đối tượng.** Cung cấp tra cứu và đọc hồ sơ văn bản QPPL/CĐĐH, giúp người dùng xác định đúng văn bản, cơ quan ban hành, thời điểm ban hành/hiệu lực và tải bản tệp công khai. Người dùng là người dân, cán bộ thực thi, doanh nghiệp và đơn vị nghiên cứu. Đề xuất tách rõ nhóm văn bản và cho phép lọc đa tiêu chí; tiêu chí, phân loại, quy tắc hiệu lực và nội dung liên quan cần Chủ đầu tư xác nhận.

**Bằng chứng mã nguồn hiện có.** `frontend/src/services/documents.ts` có `getDocumentList` xây bộ lọc cho trích yếu/số ký hiệu, ngày ban hành/hiệu lực, lĩnh vực, người ký, chức danh, hình thức, cơ quan, lớp và loại; có service lấy danh sách/chi tiết văn bản, dự thảo và lookup. API công khai liên quan xuất hiện trong `api/Controllers/API/PublicController.cs`; API văn bản và tệp/liên quan có các controller riêng được liệt kê trong ma trận. Tuy nhiên, ma trận nêu chưa đủ bằng chứng về giao diện công khai hoàn chỉnh; service hiện có không chứng minh người dùng đã có toàn bộ màn hình, lọc hiệu lực hoặc liên kết chính xác.

**Khu vực màn hình đề xuất.** Trang tra cứu: chọn nhóm QPPL/CĐĐH; từ khóa trích yếu/số ký hiệu; khoảng ngày ban hành và hiệu lực; lĩnh vực; cơ quan ban hành; hình thức; người ký/chức danh nếu áp dụng; nút tìm/làm mới; danh sách kết quả và phân trang. Thẻ kết quả hiển thị số/ký hiệu, trích yếu, loại, cơ quan, ngày ban hành, hiệu lực và nhãn trạng thái đã xác định từ dữ liệu nghiệp vụ. Trang chi tiết: metadata hồ sơ; nội dung/trích yếu; cơ quan/người ký; ngày ban hành/hiệu lực; tệp toàn văn; văn bản liên quan; lịch sử hiệu lực nếu nguồn có; đường dẫn chuẩn/QR nếu thuộc phạm vi chức năng QR. Không tự suy diễn “còn hiệu lực” chỉ từ ngày hiệu lực nếu cần thêm dữ liệu đình chỉ/thay thế.

**Luồng chính đề xuất.**

1. Người dùng mở khu tra cứu và chọn nhóm văn bản hoặc giữ nhóm mặc định đã được duyệt.
2. Người dùng nhập một hoặc nhiều điều kiện; giao diện kiểm tra khoảng ngày, giữ điều kiện trong URL nếu phù hợp và gửi truy vấn.
3. Hệ thống trả kết quả đã giới hạn theo phân trang; mỗi hàng có đủ dữ liệu để phân biệt văn bản tương tự.
4. Người dùng mở hồ sơ; trang chi tiết hiển thị metadata và các tệp/quan hệ có sẵn.
5. Người dùng tải/mở tệp; giao diện chỉ đưa ra liên kết hợp lệ, cho biết tên/loại tệp và phản hồi khi tệp không truy cập được.
6. Người dùng quay lại danh sách; các điều kiện tìm kiếm và trang trước được giữ nếu có thể.

**Dữ liệu hiển thị (có bằng chứng và phần logic).**

| Nhóm | Trường/điều kiện | Nguồn chứng cứ hoặc lưu ý |
|---|---|---|
| Tra cứu | `TrichYeu`, `SoKyHieu`, `NgayBanHanh`, `NgayHieuLuc`, `LinhVucID`, `NguoiKy`, `ChucDanh`, `ID_HinhThucVanBan`, `CoQuanBanHanhID`, `LopVanBanID`, `VanBan` | Các tên này hiện diện trong `documents.ts`; hỗ trợ thực tế phía API cần chạy xác minh |
| Kết quả | Số/ký hiệu, trích yếu, loại, cơ quan, ngày, nhãn hiệu lực | Trường logic; cần xác nhận dữ liệu đủ và quy tắc trạng thái |
| Chi tiết | Nội dung hồ sơ, người ký, cơ quan, các mốc ngày, tệp, văn bản liên quan | Mã nguồn cho thấy service/controller lookup/detail/file/related; chưa xác nhận đầy đủ từng trường |
| Truy vấn | Trang, kích thước trang, nhóm, ngôn ngữ | Không đặt tên endpoint hoặc payload mới trong tài liệu này |

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Dữ liệu công khai phải được lọc tại phía máy chủ theo trạng thái/phạm vi. Ngày bắt đầu không sau ngày kết thúc; nếu người dùng nhập cả trích yếu và số ký hiệu, cách kết hợp AND/OR phải thống nhất (mã service hiện kết hợp trích yếu hoặc số ký hiệu trong một điều kiện, các tiêu chí khác nối AND). Bộ lọc phải tránh bỏ qua điều kiện do giá trị rỗng/sai định dạng. Bản ghi có cùng số/ký hiệu cần phân biệt bằng năm/cơ quan/loại. Nhãn hiệu lực chỉ theo trường trạng thái và quy tắc được Chủ đầu tư duyệt, xử lý văn bản bị thay thế/đình chỉ/hết hiệu lực. Tệp phải được quét/kiểm soát theo chính sách cổng trước khi phát hành; quyền tệp phải tương thích quyền hồ sơ. Không yêu cầu đăng nhập với tài liệu công khai.

**Rỗng, lỗi và biên.** Không có kết quả cần hiển thị tiêu chí đã chọn và nút xóa. Ngày không hợp lệ báo tại bộ lọc, không gửi truy vấn mơ hồ. Nếu bản ghi thiếu trường, ẩn nhãn thay vì hiển thị `null`; nếu trạng thái hiệu lực chưa xác định thì dùng nhãn trung tính đã duyệt. Tệp lỗi/404 cần thông báo và đường quay lại hồ sơ. Truy vấn quá rộng có thể yêu cầu người dùng thêm điều kiện; giới hạn/nhắc cụ thể phải được xác nhận. Nếu lookup cơ quan/lĩnh vực lỗi, người dùng vẫn có thể tra cứu bằng từ khóa nếu hệ thống hỗ trợ; không làm sai kết quả âm thầm.

**Tích hợp và luồng dữ liệu.** Dự kiến danh sách và chi tiết lấy từ phân hệ văn bản công khai; lookup cung cấp lĩnh vực/cơ quan/hình thức/người ký; liên kết tệp và văn bản liên quan được đưa vào trang chi tiết. Service hiện có dùng phân trang `skip/take`, tổng số và bộ lọc; hợp đồng trả về cần xác minh. Văn bản QPPL và CĐĐH có thể dùng cùng giao diện nhưng phải giữ phân loại/nghiệp vụ rõ. Chuyển đổi dữ liệu phải đối soát số/ký hiệu, cơ quan, hiệu lực và tệp; không xem một mapping QPPL là bằng chứng mapping CĐĐH đã hoàn tất.

**Kịch bản nghiệm thu đề xuất.**

1. Tìm lần lượt theo số ký hiệu, trích yếu, cơ quan, lĩnh vực và hình thức; so sánh danh sách với bộ dữ liệu chuẩn.
2. Kết hợp nhiều bộ lọc, cả khoảng ngày hợp lệ và không hợp lệ; xác nhận phép kết hợp theo quy tắc đã phê duyệt.
3. Thử QPPL và CĐĐH có trạng thái hiệu lực khác nhau; xác nhận nhãn không suy diễn và đúng dữ liệu nghiệp vụ.
4. Mở chi tiết có nhiều tệp/văn bản liên quan; kiểm tra tiêu đề, mốc ngày, URL và quyền truy cập tệp.
5. Thử không có kết quả, bản ghi thiếu metadata, tệp lỗi và lookup không sẵn sàng; xác nhận xử lý rõ ràng.
6. Chuyển trang, làm mới URL và quay lại; xác nhận điều kiện tra cứu/nhóm/ngôn ngữ được giữ theo thiết kế đã duyệt.

## 6. Giao diện lấy ý kiến dự thảo

**Tham chiếu HSYC:** B0738.R008; B0742.R015–R016; B0746.R008.

**Mục đích và đối tượng.** Giúp người dân xem dự thảo đang lấy ý kiến, đọc hồ sơ liên quan và gửi góp ý trong khoảng thời gian được phép. Người đóng góp không cần quyền quản trị; cán bộ phụ trách tiếp nhận, kiểm duyệt và xử lý nội bộ. Đề xuất gồm danh sách dự thảo, chi tiết, biểu mẫu và trạng thái thời hạn; việc công khai ý kiến sau gửi phải theo chính sách được Chủ đầu tư phê duyệt. Việc gửi thành công không đồng nghĩa ý kiến được công bố.

**Bằng chứng mã nguồn hiện có.** Có form `frontend/src/pages/home/components/other/SentFeedbackForm.tsx` với các trường họ tên, email, điện thoại, địa chỉ, nội dung; schema kiểm tra độ dài/tính hợp lệ; form gọi reCAPTCHA rồi `sendComment`. `frontend/src/services/documents.ts` gửi tới `SendCommentVBDT`. Trong `api/Controllers/API/PublicController.cs`, hành động `SendCommentVBDT` xác minh token, action `sendcomment`, điểm bot (ngưỡng trong code là 0.6), kiểm tra hồ sơ dự thảo và thời hạn lấy ý kiến trước khi ghi ý kiến. Đây là dấu vết luồng tiếp nhận; ma trận vẫn đánh giá một phần, chưa chứng minh đầy đủ danh sách/chi tiết dự thảo, upload tệp, kiểm duyệt hay trạng thái công khai. Trang phản ánh/kiến nghị hiện chỉ có nội dung “đang được cập nhật” tại `frontend/src/pages/feedback/FeedbackAndRecommendationsPage.tsx`; không nên dùng trang đó làm bằng chứng đã có biểu mẫu kiến nghị hoạt động.

**Khu vực màn hình đề xuất.** Danh sách: dự thảo đang lấy ý kiến, tên, cơ quan phụ trách, ngày bắt đầu/kết thúc, thời gian còn lại theo múi giờ xác định, liên kết hồ sơ và trạng thái đóng/mở. Chi tiết: thông tin dự thảo, nội dung/tệp, cơ quan, phạm vi câu hỏi/hướng dẫn, thời hạn và nút góp ý chỉ khi đang mở. Biểu mẫu: họ tên, email, điện thoại tùy chính sách, địa chỉ tùy chọn, nội dung, thông báo quyền riêng tư, xác minh chống bot ở máy chủ, nút gửi/trạng thái chờ. Nếu cho phép đính kèm, cần quy định loại, dung lượng, số tệp, lưu trữ và quét bảo mật trước khi công bố; hiện chưa có đủ bằng chứng upload form công khai trong các tệp được rà.

[FIG:feedback-flow]

**Luồng chính đề xuất.**

1. Người dùng mở danh sách; chỉ thấy dự thảo thuộc phạm vi công khai, có trạng thái phù hợp theo thời gian.
2. Người dùng mở chi tiết, đọc hướng dẫn và tệp; ứng dụng thể hiện rõ ngày/giờ đóng góp cuối cùng.
3. Người dùng mở biểu mẫu trong thời gian hiệu lực; nhập thông tin bắt buộc và nội dung theo hướng dẫn.
4. Trình duyệt kiểm tra định dạng sơ bộ; máy chủ phải xác minh lại dữ liệu và token chống bot, không tin kết quả kiểm tra phía trình duyệt.
5. Máy chủ đối chiếu dự thảo tồn tại, trạng thái nhận ý kiến và thời gian hiện tại; nếu hợp lệ thì tiếp nhận và trả mã/trạng thái xác nhận phù hợp.
6. Người dùng nhận thông báo thành công hoặc lỗi có thể xử lý; gửi lại không được tạo bản ghi trùng ngoài ý muốn. Ý kiến được đưa vào hàng chờ kiểm duyệt theo chính sách.
7. Cán bộ có thẩm quyền xử lý nội bộ qua phân hệ quản trị; chỉ ý kiến được duyệt mới được công khai nếu chính sách yêu cầu công khai.

**Dữ liệu.**

| Nhóm | Trường logic | Tình trạng bằng chứng/đề xuất |
|---|---|---|
| Dự thảo | Tiêu đề, cơ quan, mô tả, nội dung/tệp, thời gian bắt đầu/kết thúc, trạng thái | API công khai có truy vấn chi tiết; trường hiển thị cần đối chiếu dữ liệu thật |
| Người góp ý | Họ tên, email, điện thoại, địa chỉ | Có trong schema form/model logic được gửi; thu thập tối thiểu theo chính sách bảo vệ dữ liệu |
| Nội dung | Nội dung góp ý, định danh dự thảo, thời điểm nhận | Code gửi `IDVBDT`, `content`/`NoiDung`; tên logic chưa khẳng định schema chuẩn |
| Chống bot | Token reCAPTCHA, action, kết quả xác minh/điểm | Code xác minh phía máy chủ; không hiển thị token hoặc thông tin bí mật cho người dùng |
| Đính kèm | Tên, loại, kích thước, trạng thái quét, URL nội bộ | Tính năng đề xuất; chưa có bằng chứng đầy đủ về upload công khai |

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Máy chủ là nơi quyết định khả năng nhận góp ý. Mã hiện có kiểm tra mốc `NgayBatDauLayYKien` và `NgayHetHanLayYKien`; ngưỡng và tên trường này là bằng chứng cụ thể nhưng cấu hình/múi giờ thực tế vẫn cần xác minh. Cần làm rõ thời điểm đóng có tính bao gồm hay không, xử lý thời gian máy chủ và vùng giờ, dự thảo bị tạm dừng, đóng sớm hoặc kéo dài. Xác thực bắt buộc với họ tên/email/nội dung cần đồng bộ giữa UI và server; định dạng email/điện thoại không thể dựa riêng vào regex phía trình duyệt. reCAPTCHA token có thể hết hạn/dùng lại; máy chủ phải kiểm tra hành động và kết quả, có giới hạn tần suất/chống spam thích hợp đã được phê duyệt. Thu thập địa chỉ/điện thoại cần mục đích và thông báo quyền riêng tư. Nội dung nhập phải được mã hóa/làm sạch khi hiển thị ở quản trị, tránh XSS. Quyền đọc dự thảo công khai khác quyền xem thông tin cá nhân của người gửi; chỉ cán bộ được phân công xem dữ liệu nhận dạng. Trạng thái duyệt/công khai và thời hạn lưu giữ cần phê chuẩn.

**Rỗng, lỗi và biên.** Không có dự thảo đang mở: hiển thị thông báo và liên kết đến danh sách đã đóng nếu phù hợp. Đóng góp ngoài thời hạn, hồ sơ sai hoặc không công khai: từ chối phía máy chủ và không ghi nhận như thành công. Token sai/hết hạn, action không hợp lệ hoặc nghi bot: đưa thông báo thân thiện và cho phép khởi tạo lần gửi mới; không tiết lộ cấu hình chống bot. Gửi lặp do nhấn nhiều lần/mạng chậm cần vô hiệu hóa nút trong khi gửi và xử lý idempotency theo thiết kế được duyệt. Nội dung quá ngắn/dài, email sai hoặc HTML nguy hiểm phải bị từ chối/làm sạch. Đính kèm lỗi/quá lớn (nếu có) không được làm mất phần góp ý âm thầm. Nếu lưu thành công nhưng phản hồi mạng lỗi, cần có cách tra cứu/nhắc tránh gửi lặp mà không lộ thông tin cá nhân.

**Tích hợp và luồng dữ liệu.** Dự thảo được đọc từ nguồn văn bản dự thảo; form gửi đến hành động tiếp nhận công khai; ý kiến lưu ở phân hệ góp ý, sau đó chuyển tới hàng chờ quản trị/kiểm duyệt. Luồng mã hiện có ghi ý kiến sau khi kiểm tra token và thời hạn; không có bằng chứng từ lát cắt này về trạng thái mặc định, tệp đính kèm, chống gửi lặp, email xác nhận hay công khai kết quả. Mọi năng lực bổ sung nêu trên là đề xuất. Cần đối chiếu UI–service–API–model–màn hình quản trị và xác nhận cả luồng xử lý dữ liệu cá nhân.

**Kịch bản nghiệm thu đề xuất.**

1. Gửi góp ý hợp lệ cho dự thảo đang mở; xác nhận nhận được xác nhận và bản ghi được gắn đúng dự thảo, mặc định chờ xử lý theo chính sách.
2. Gửi cho dự thảo chưa mở, đã hết hạn, bị đóng hoặc ID không tồn tại; xác nhận máy chủ từ chối và không tạo bản ghi.
3. Thử họ tên/email/điện thoại/nội dung thiếu hoặc sai, nội dung dưới/trên giới hạn; đối chiếu phản hồi UI và máy chủ.
4. Thử token sai, hết hạn, action khác và điểm dưới ngưỡng; xác nhận không ghi ý kiến và thông báo không tiết lộ thông tin nhạy cảm.
5. Gửi liên tiếp/nhấn nhiều lần, mô phỏng mạng chậm; xác nhận không tạo bản ghi trùng ngoài quy tắc đã duyệt.
6. Nếu có upload: thử tệp hợp lệ, sai loại, vượt dung lượng, tên bất thường và tệp bị từ chối quét; xác nhận tệp không thể truy cập công khai trước khi duyệt.

## 7. Giao diện đa phương tiện

**Tham chiếu HSYC:** B0738.R009; B0742.R017–R018; B0746.R009.

**Mục đích và đối tượng.** Thư viện giúp công chúng tìm và xem album ảnh, video, audio về hoạt động Bộ. Người dùng cần nhận biết loại nội dung, ngày đăng, chuyên mục, quyền phát/tải và mô tả. Đề xuất có trang danh sách từng loại, trang chi tiết album, bộ lọc và phân trang; lựa chọn phát nội tuyến, mở lightbox hoặc tải phụ thuộc bản quyền, khả năng truy cập và nguồn tệp.

**Bằng chứng mã nguồn hiện có.** Có `PhotoGalleryPage.tsx`, `VideoGalleryPage.tsx`, `AudioGalleryPage.tsx` cùng các trang chi tiết album; `frontend/src/services/multimedia.ts` gọi danh sách album theo trang và thông tin album. `PhotoAlbumDetailPage.tsx` dùng slider ảnh, metadata và danh sách album khác; bằng chứng này chưa xác nhận có lightbox riêng. `VideoAlbumDetailPage.tsx` có trình phát video dùng phần tử `<video>`; `AudioAlbumDetailPage.tsx` hiện cũng dùng `<video>` với nguồn khai báo `video/mp4`, nên chưa thể xem đó là bằng chứng trình phát audio đúng loại. `PublicController.cs` có hành động danh sách/chi tiết album và truy vấn theo chuyên mục. Ma trận chỉ đánh giá một phần; cần kiểm thử lọc, phát đúng từng loại, lightbox, upload nhiều tệp và nội dung thực tế. Không khẳng định tất cả định dạng/codec hay chính sách phát hiện có đã đáp ứng.

**Khu vực màn hình đề xuất.** Mục ảnh/video/audio hoặc một trang thư viện tổng hợp; bộ chọn loại/chuyên mục/thời gian nếu được duyệt; lưới thẻ album với thumbnail, tiêu đề, mô tả, ngày và số lượng tệp nếu nguồn có; phân trang; trang album có tiêu đề/mô tả, gallery/lightbox ảnh hoặc trình phát video/audio, danh sách các mục, caption/alt/transcript nếu có, tải về khi được phép, breadcrumb và album liên quan. Trình phát cần điều khiển phát/dừng, âm lượng, phụ đề/transcript khi nguồn có; không tự bật âm thanh. Ảnh cần phóng to/thu nhỏ/đóng lightbox bằng bàn phím; chức năng tải không được làm lộ đường dẫn nội bộ.

[FIG:media-flow]

**Luồng chính đề xuất.**

1. Người dùng chọn thư viện/loại media và xem các album công khai.
2. Người dùng lọc chuyên mục/thời gian (nếu hỗ trợ) hoặc chuyển trang; trạng thái truy vấn được giữ.
3. Người dùng mở album; trang hiển thị metadata và các tệp theo thứ tự được cấu hình.
4. Với ảnh, chọn thumbnail mở lightbox và điều hướng ảnh; với video/audio, khởi chạy trình phát sau thao tác chủ động.
5. Người dùng xem mô tả, caption hoặc bản chép lời nếu có; tải tệp nếu chính sách cho phép.
6. Người dùng chọn album liên quan hoặc trở về danh sách; các URL album dùng được khi tải lại.

**Dữ liệu hiển thị.**

| Nhóm | Trường logic đề xuất | Ghi chú |
|---|---|---|
| Album | Tiêu đề, mô tả, loại, chuyên mục, ngày xuất bản, thumbnail, trạng thái | `TieuDe`, `MoTa`, `UrlAnh`, `ThoiGianXuatBan` xuất hiện trong giao diện ảnh |
| Tệp media | Tên, URL lưu trữ, loại MIME, thứ tự, caption/alt, thời lượng/kích thước nếu có | Code chi tiết ảnh truy cập `AlbumAnh_Files` và `File.LinkLuuTru` |
| Bộ lọc | Loại, chuyên mục, khoảng thời gian, trang/kích thước | Danh sách API có phân trang; lọc cụ thể cần xác nhận |
| Quyền | Cho phép xem/phát/tải/nhúng, ghi chú bản quyền | Quy tắc nghiệp vụ đề xuất, chưa khẳng định đã có trường |

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Chỉ album công khai và tệp thuộc album được công khai mới được gửi tới trình duyệt. Album phải khớp loại nội dung; không phát file dựa vào đuôi tên đơn thuần, cần xác định loại/nguồn được phép. Tệp tải phải đáp ứng quy định bản quyền và bảo mật. URL nhúng ngoài (nếu được cho phép) cần danh sách nguồn hợp lệ, không cho phép script/tự động phát hoặc theo dõi không được phê duyệt. Ảnh phải có alt/caption; nội dung âm thanh/video nên có phụ đề/bản chép lời khi yêu cầu tiếp cận áp dụng. Thứ tự tệp ổn định và không tham chiếu album khác. Lọc theo thời gian cần quy tắc múi giờ. Không suy diễn số lượt xem hoặc độ dài nếu nguồn không có.

**Rỗng, lỗi và biên.** Thư viện không có album hiển thị thông báo rỗng; chuyên mục rỗng giữ điều kiện lọc và cho xóa. Album có metadata nhưng không còn tệp cần hiện cảnh báo nội dung chưa sẵn sàng hoặc trạng thái phù hợp đã duyệt. Tệp không phát được cho thông tin lỗi và đường tải thay thế chỉ khi cho phép. Thumbnail lỗi dùng ảnh dự phòng; lightbox phải đóng được bằng Escape/điều khiển rõ. Album rất lớn cần tải theo lô hoặc cơ chế tương đương đã chốt. Trình duyệt không hỗ trợ codec phải nhận thông báo/định dạng thay thế nếu có. URL album sai/đã gỡ cần trả trang không tìm thấy, không lộ storage path.

**Tích hợp và luồng dữ liệu.** Quản trị album/tệp cung cấp metadata và liên kết đến hệ thống lưu trữ; API công khai trả danh sách đã công khai và chi tiết theo loại. Service hiện có cung cấp danh sách ảnh/video/audio và thông tin album; cần kiểm tra tương đương ở từng loại, điều kiện trạng thái, phân trang, lọc chuyên mục và bảo vệ file. Đề xuất kiểm kê toàn bộ tệp, mime type, dung lượng, checksum nếu quy trình migration cần, quyền phát/tải và liên kết sau chuyển. Không đưa URL storage nội bộ vào tài liệu hay giao diện. Cần làm rõ video nhúng từ bên thứ ba có thuộc phạm vi hay chỉ file lưu trữ nội bộ.

**Kịch bản nghiệm thu đề xuất.**

1. Tạo bộ dữ liệu album ảnh/video/audio công khai và không công khai; xác nhận danh sách chỉ chứa mục đúng trạng thái/loại.
2. Duyệt nhiều trang, lọc chuyên mục/thời gian (nếu được duyệt); đối chiếu tổng số và thứ tự.
3. Mở album ảnh nhiều tệp, dùng lightbox/điều khiển bàn phím; xác nhận alt, thứ tự và đường dẫn.
4. Phát video/audio mẫu trên trình duyệt mục tiêu, dừng/tiếp tục/âm lượng; xác nhận không tự phát và lỗi codec có thông báo.
5. Thử thumbnail/tệp hỏng, album rỗng, URL sai và file không được tải; xác nhận dự phòng và kiểm soát quyền.
6. Nếu hỗ trợ nhúng ngoài hoặc tải tệp, thử nguồn/tệp được phép và bị cấm; xác nhận chính sách áp dụng nhất quán.

## 8. Giao diện Hội nghị – Sự kiện

**Tham chiếu HSYC:** B0738.R010; B0742.R019–R020; B0746.R010.

**Mục đích và đối tượng.** Cung cấp lịch sử và thông tin các hội nghị/sự kiện của Bộ, giúp người dùng tìm sự kiện theo thời gian/loại và mở chi tiết khi có nội dung công khai. Đối tượng gồm công chúng, cán bộ và báo chí. Đề xuất danh sách/timeline theo thời gian, thẻ tóm tắt, bộ lọc, chi tiết và liên kết/tệp. Việc hiển thị sự kiện sắp diễn ra, đang diễn ra hay đã kết thúc cần thống nhất với Chủ đầu tư.

**Bằng chứng mã nguồn hiện có.** Có quản trị `backend/src/pages/SuKienHoiThao.js`, API `api/Controllers/API/SuKienHoiThaosController.cs` và loại sự kiện `backend/src/pages/LoaiSuKien.js`; mã rà soát chưa thấy bằng chứng đủ về giao diện công khai/timeline. Vì vậy, phần màn hình và tiêu chí dưới đây là phương án đề xuất, không mô tả như UI đã triển khai.

**Khu vực màn hình đề xuất.** Trang danh sách: tiêu đề, bộ lọc khoảng ngày/loại/từ khóa, chuyển giữa sắp tới và đã diễn ra nếu được duyệt, timeline hoặc danh sách theo ngày, thẻ sự kiện với tên, thời gian, địa điểm, loại, tóm tắt và liên kết chi tiết. Trang chi tiết: tên, ngày/giờ bắt đầu-kết thúc, địa điểm, mô tả, chương trình/thành phần nếu được công khai, ảnh, tệp, liên kết livestream/bản tin và sự kiện liên quan. Trên timeline cần nhãn ngày rõ, không chỉ dùng màu; trên thiết bị nhỏ chuyển thành danh sách dọc.

**Luồng chính đề xuất.**

1. Người dùng mở trang sự kiện và chọn khoảng thời gian/loại hoặc chế độ xem mặc định.
2. Giao diện truy vấn danh sách công khai, nhóm/sắp xếp theo thời điểm với quy tắc ổn định.
3. Người dùng chuyển trang hoặc thay đổi lọc; timeline/danh sách cập nhật và thể hiện điều kiện hiện hành.
4. Người dùng mở một sự kiện để xem thời gian, địa điểm, mô tả và tệp/liên kết.
5. Nếu có liên kết livestream hoặc tài liệu, người dùng mở theo chính sách tab/đích được duyệt.
6. Người dùng quay về danh sách mà không mất bộ lọc; sự kiện đã kết thúc vẫn còn truy cập nếu thuộc kho lưu trữ công khai.

**Dữ liệu hiển thị.**

| Nhóm | Trường logic đề xuất | Ghi chú |
|---|---|---|
| Danh sách | Tên, loại, bắt đầu/kết thúc, địa điểm, ảnh, tóm tắt, URL | Chỉ hiển thị dữ liệu công khai |
| Chi tiết | Nội dung, chương trình, thành phần, tệp, liên kết livestream | Một số trường là tùy chọn, phải xác nhận mức công khai |
| Bộ lọc | Từ ngày, đến ngày, loại, từ khóa, trang | Xác định múi giờ và cách hiểu sự kiện qua đêm |
| Trạng thái | Sắp diễn ra/đang diễn ra/đã kết thúc/ẩn | Trạng thái có thể tính từ thời gian nhưng quy tắc do Chủ đầu tư duyệt |

Các trường là mô hình đề xuất; API/model sự kiện cần được đối chiếu để xác nhận trường thực tế.

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Phân loại sự kiện phải thống nhất danh mục; sự kiện chỉ xuất hiện sau khi được phép công khai. Ngày/giờ kết thúc không được trước thời điểm bắt đầu; sự kiện qua đêm và múi giờ cần hỗ trợ theo quy tắc. Nếu trạng thái tính tự động, phải phân định với trạng thái biên tập (ẩn/hủy/hoãn). Sự kiện bị hủy/hoãn cần thông báo nổi bật, không để timeline thể hiện như sắp diễn ra. Thành phần tham dự/dữ liệu cá nhân chỉ hiển thị khi được duyệt. URL livestream/tệp cần kiểm tra hợp lệ và an toàn. Phân trang, timeline và bộ lọc phải dùng cùng một tập dữ liệu công khai.

**Rỗng, lỗi và biên.** Không có sự kiện trong khoảng lọc phải thông báo rõ, giữ tiêu chí và cho xóa lọc. Thiếu giờ hoặc địa điểm thì ẩn nhãn; không thay bằng dữ liệu bịa. Sự kiện nhiều ngày phải xuất hiện đúng trong các khoảng truy vấn. Sự kiện hoãn/hủy cần nhãn riêng nếu nguồn cung cấp. Tệp/liên kết hỏng không làm mất phần mô tả chính. Ngày không hợp lệ được báo trước khi tìm kiếm; URL sự kiện sai/đã gỡ trả trang không tìm thấy. Nếu dịch vụ lỗi, thông báo và thử lại không được gây trùng hoặc sai thứ tự.

**Tích hợp và luồng dữ liệu.** Dự kiến trang công khai tiêu thụ dữ liệu từ phân hệ sự kiện và loại sự kiện; controller hiện có là dấu vết API nhưng không chứng minh phần UI/timeline. Cần xác định trạng thái xuất bản, cấu trúc thời gian, tệp, thành phần, địa điểm, liên kết livestream và phân trang. Nếu timeline dựa trên dữ liệu đã nhập, cần biên bản đối soát sau migration; nếu tính phía giao diện, quy tắc phải khớp API để tránh khác nhau giữa danh sách và chi tiết. Không xác định route hoặc API mới trước khi rà hợp đồng hiện hữu.

**Kịch bản nghiệm thu đề xuất.**

1. Dùng dữ liệu sự kiện đã qua, sắp tới, nhiều ngày, qua đêm và bị hủy; xác nhận phân loại/trạng thái/timeline theo quy tắc được duyệt.
2. Lọc theo từng loại và khoảng ngày; đối chiếu kết quả, biên thời gian và phân trang.
3. Mở chi tiết có địa điểm, chương trình, tệp và livestream; xác nhận trường nào công khai và URL đích.
4. Thử ngày kết thúc trước ngày bắt đầu, thiếu giờ/địa điểm, loại đã xóa; xác nhận dữ liệu sai không hiển thị sai lệch.
5. Kiểm tra màn hình hẹp, bàn phím và cách đọc thứ tự ngày; xác nhận timeline vẫn hiểu được không cần dựa màu.
6. Thử danh sách rỗng, API lỗi, tệp lỗi và URL sự kiện đã gỡ; xác nhận thông báo cùng đường quay lại.

## 9. Đồng bộ giao diện chi tiết, chuyên trang và tiếng Anh

**Tham chiếu HSYC:** B0738.R011; B0742.R021–R022. Hạng mục này bao gồm tính nhất quán giao diện chung, breadcrumb/sidebar/kiểu chữ/responsive và chuyên trang tiếng Anh; phạm vi từng mẫu cần được chốt với Chủ đầu tư.

**Mục đích và đối tượng.** Đảm bảo người dùng nhận ra cùng một Cổng thông tin xuyên suốt các trang chủ, danh sách, chi tiết và chuyên trang; giảm nhầm lẫn điều hướng và hỗ trợ người đọc tiếng Anh khi có bản dịch chính thức. Đối tượng là toàn bộ người dùng công khai, đặc biệt người chuyển giữa tin, văn bản, sự kiện, Đảng bộ, Bộ trưởng và tiếng Anh. Hạng mục này là lớp dùng chung và các quy tắc liên kết, không thay thế mô tả riêng của tám chức năng trước.

**Bằng chứng mã nguồn hiện có.** Có header/footer dùng chung trong `frontend/src/layout/components/`, hook breadcrumb `frontend/src/hooks/useBreadcrumbs.ts`, i18n `frontend/src/i18n/index.ts`; `NewsDetailPage.tsx` có title/meta/canonical và điều khiển cỡ chữ/in. Ma trận đánh giá một phần: các cấu phần tồn tại nhưng chưa chứng minh mọi layout, toàn bộ chuỗi tiếng Anh, responsive, khả năng tiếp cận hoặc liên kết chuyên trang. Không kết luận đồng bộ chỉ vì một số component được dùng lại.

**Khu vực màn hình và quy tắc trình bày đề xuất.** Header phải nhất quán về nhận diện, menu, tìm kiếm và điều khiển ngôn ngữ; menu thu gọn trên màn hình nhỏ phải có tên truy cập và trạng thái mở/đóng. Breadcrumb biểu thị quan hệ thực của trang, mỗi mục có liên kết hợp lệ trừ trang hiện tại. Sidebar chuyên trang chỉ hiện điều hướng thuộc chuyên trang và không lẫn menu cổng chính. Typography quy định cấp tiêu đề, đoạn, trích dẫn, danh sách, bảng, metadata, liên kết và nội dung văn bản dài. Footer giữ thông tin cơ quan/liên kết đã duyệt. Bố cục phải tái sắp xếp trên màn hình nhỏ, không yêu cầu cuộn ngang toàn trang; nội dung nhúng/tables cần cách xử lý riêng. Ngôn ngữ phải áp dụng nhất quán cho tiêu đề nút, trạng thái tải/lỗi/rỗng, nhãn ngày và metadata. Bản tiếng Anh chỉ dùng nội dung dịch được duyệt; fallback khi thiếu bản dịch phải rõ ràng.

**Luồng chính đề xuất.**

1. Người dùng mở bất kỳ trang công khai; header, breadcrumb, nội dung chính và footer xuất hiện theo mẫu phù hợp.
2. Người dùng đi từ danh sách sang chi tiết; breadcrumb và sidebar cập nhật đúng nhánh, không tạo liên kết vòng hoặc nhầm chuyên trang.
3. Người dùng đổi ngôn ngữ; ứng dụng giữ trang tương ứng nếu có bản dịch, hoặc thông báo/fallback theo quy tắc đã duyệt.
4. Người dùng thay đổi kích thước màn hình hoặc dùng bàn phím; menu, bộ lọc, trình phát, phân trang và điều khiển nội dung vẫn sử dụng được.
5. Người dùng mở trang qua URL trực tiếp, tải lại hoặc từ liên kết ngoài; layout, tiêu đề, metadata và ngôn ngữ vẫn nhất quán.

**Dữ liệu/cấu hình hiển thị.**

| Nhóm | Trường logic đề xuất | Ghi chú |
|---|---|---|
| Điều hướng | Menu, nhãn, URL, thứ tự, nhánh chuyên trang, ngôn ngữ | Cấu hình cần tránh URL mồ côi/vòng lặp |
| Breadcrumb | Nhãn, URL tổ tiên, trang hiện tại | Có thể tính từ route hoặc dữ liệu; cách chọn cần thống nhất |
| Bản dịch | Khóa nội dung, ngôn ngữ, trạng thái duyệt, URL tương ứng | Không dịch máy tự động thành nội dung chính thức |
| Trình bày | Token cỡ chữ/màu/khoảng cách, breakpoint, quy tắc responsive | Là quy ước thiết kế, không phải trường schema |
| Metadata | Title, description, canonical, Open Graph | Dữ liệu cần khớp URL/ngôn ngữ và nội dung hiện tại |

**Kiểm tra nghiệp vụ, xuất bản và quyền.** Nội dung mỗi ngôn ngữ được biên tập/duyệt tương ứng; không suy luận một trang tiếng Anh hoàn chỉnh từ cấu hình i18n hiện có. URL canonical phải trỏ đến phiên bản chuẩn của đúng ngôn ngữ; bản dịch có quan hệ riêng khi được xác nhận. Breadcrumb và menu không được cấp quyền truy cập ngoài những gì trang công khai cho phép, cũng không thay đổi trạng thái xuất bản. Tất cả điều khiển cần tiêu đề accessible, focus nhìn thấy, thứ tự tab hợp lý, tương phản đủ theo tiêu chuẩn nghiệm thu được chọn. HTML nội dung dài phải được làm sạch; cỡ chữ người dùng chọn không được làm che/ẩn nội dung. Mức WCAG/chuẩn cụ thể và browser/device matrix cần được chốt, không tự gán mức đạt.

**Rỗng, lỗi và biên.** Route không có breadcrumb cha phải hiển thị đường về rõ ràng. Menu thiếu URL/nhãn cần bị chặn ở cấu hình hoặc ẩn có kiểm soát. Bản tiếng Anh thiếu bản dịch không được để nhãn một nửa Việt một nửa Anh ngoài thuật ngữ đã duyệt. Trang rộng có bảng/media phải có cuộn cục bộ hoặc cách trình bày thay thế; không tràn ngang toàn cổng. Tiêu đề dài, font phóng lớn, zoom trình duyệt và menu nhiều cấp cần được thử. Nếu CSS/chunk tải lỗi, nội dung chính không nên bị che hoàn toàn; trạng thái tải trì hoãn có kích thước giữ chỗ. URL canonical thiếu/sai không được tạo giá trị tự suy đoán ở môi trường khác nhau.

**Tích hợp và luồng dữ liệu.** Dùng component layout, hook breadcrumb, tài nguyên i18n và cấu hình nội dung/menu. Mã nguồn có những thành phần này nhưng cần lập kiểm kê từng route/layout để biết component dùng chung ở đâu, bản dịch nào thiếu và canonical nào khác ngôn ngữ. Đề xuất tạo bảng đối chiếu route × layout × ngôn ngữ × bộ điều khiển giao diện để nghiệm thu; đây là tài liệu triển khai cần lập, không phải bảng đã có trong repository. Việc dùng component chung không buộc các chuyên trang có cùng menu hay nhận diện riêng; cấu hình chuyên trang vẫn được giữ theo phạm vi đã duyệt.

**Kịch bản nghiệm thu đề xuất.**

1. Chọn mẫu trang chủ, danh sách, chi tiết, văn bản, media, sự kiện, chuyên trang Bộ trưởng và Đảng bộ; so sánh header/footer/kiểu chữ/breadcrumb với mẫu thiết kế.
2. Duyệt toàn bộ menu và breadcrumb ở mỗi mẫu; xác nhận đúng URL/nhánh, không vòng lặp, không lẫn Đảng bộ với TW4.
3. Đổi Việt–Anh ở trang có bản dịch và thiếu bản dịch; kiểm tra nhãn, nội dung, ngày, canonical và quy tắc fallback.
4. Kiểm tra ở viewport máy tính, tablet, điện thoại; phóng to chữ/zoom trình duyệt và xác nhận không mất chức năng hoặc cuộn ngang toàn trang.
5. Dùng bàn phím/đọc nhãn điều khiển; kiểm tra focus, menu, phân trang, biểu mẫu, slider/lightbox và thông báo lỗi theo tiêu chuẩn đã chọn.
6. Mở URL trực tiếp, tải lại, điều hướng qua liên kết ngoài và thử lỗi tải một khối trì hoãn; xác nhận layout/metadata ổn định và nội dung chính còn truy cập.

## Hồ sơ bằng chứng và quyết định cần chốt

Trước khi dùng nội dung này làm cam kết, cần đối chiếu từng mô tả với nguyên văn HSYC và thiết kế được Chủ đầu tư duyệt; lập ma trận yêu cầu–màn hình–dữ liệu–quyền–ca thử; chốt trường thực tế, nguồn dữ liệu, ngôn ngữ, URL, chính sách xuất bản, lưu trữ tệp và trạng thái lỗi. Với chức năng có dấu vết trong repository, cần xác minh đường đi đầu-cuối trên môi trường mục tiêu; với tính năng chưa thấy, ghi thành phần việc phát triển hoặc cấu hình, không ghi là đã có. Biên bản nghiệm thu phải chứa dữ liệu thử, bước thực hiện, kết quả, ảnh/chứng cứ và trạng thái lỗi/khắc phục; tài liệu này chỉ chuẩn bị nội dung và tiêu chí cho việc đó.

