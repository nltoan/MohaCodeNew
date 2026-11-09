# THUYẾT MINH GIẢI PHÁP CHỨC NĂNG

**Nhà thầu: Công ty cổ phần công nghệ Tefli Việt Nam**  
**Gói thầu: Nâng cấp Cổng thông tin điện tử Bộ Nội vụ**

## 1. Phạm vi và nguyên tắc triển khai

Phần thuyết minh này trình bày phương án chức năng do Công ty cổ phần công nghệ Tefli Việt Nam (Tefli) đề xuất để đáp ứng Chương IV HSYC. Đại diện có thẩm quyền của Tefli sẽ xem xét, phê duyệt nội dung trước khi sử dụng làm cam kết chính thức trong HSĐX. Phương án gồm giao diện công khai, hệ thống quản trị nội dung, API và dữ liệu, chuyển đổi/tích hợp, bảo mật, sao lưu và cảnh báo. Việc hoàn thành chỉ được xác nhận qua kiểm tra trên môi trường, dữ liệu và cấu hình được Chủ đầu tư chấp thuận.

Tefli đề xuất thống nhất mô hình dữ liệu và hợp đồng API giữa trang công khai và phân hệ quản trị; dùng chung quy tắc phân trang, lọc, trạng thái xuất bản, ngôn ngữ, tệp đính kèm và nhật ký thao tác. Vai trò được cấp theo nhiệm vụ; thao tác tạo, sửa, gửi duyệt, duyệt/từ chối, xuất bản và gỡ xuất bản được giới hạn theo quyền. Dữ liệu đầu ra hiển thị theo trạng thái và phạm vi công khai đã cấu hình. Chức năng được phát triển/cấu hình theo phạm vi gói thầu và nội dung được đại diện có thẩm quyền của Tefli phê duyệt trong HSĐX.

## 2. Giao diện và khai thác thông tin công khai

### 2.1 Trang chủ, tin bài và giao diện thống nhất

Tefli sẽ nâng cấp trang chủ với header, điều hướng, tiện ích tìm kiếm/chuyển ngôn ngữ, banner, các khối chuyên mục và thông tin nổi bật, tin hoạt động, văn bản mới, đa phương tiện và footer. Cấu hình nội dung của từng khối lấy từ dữ liệu quản trị đã xuất bản; quản trị viên được phân quyền sắp xếp hoặc thay nội dung theo cấu hình được phê duyệt. Kết quả hiển thị cần thống nhất thứ tự, liên kết, nhãn ngôn ngữ và trạng thái bản ghi.

Trang chuyên mục sẽ cho phép duyệt tin theo danh mục, lọc theo từ khóa và khoảng thời gian, phân trang và truy cập nội dung nổi bật/xem nhiều khi dữ liệu tương ứng được cấu hình. Trang chi tiết sẽ hiển thị tiêu đề, nội dung, tác giả/nguồn, thời gian, tệp đính kèm và tin liên quan; cung cấp chia sẻ, QR truy cập nhanh và phần bình luận theo chính sách công khai được Chủ đầu tư thống nhất. Tefli sẽ xử lý nội dung HTML trước khi hiển thị và bảo đảm liên kết tệp theo quyền truy cập.

Header, footer, breadcrumb, sidebar, kiểu chữ và bố cục responsive sẽ được đưa về hệ thống thành phần dùng chung, cho phép áp dụng nhất quán qua các mẫu trang. Với chuyên trang tiếng Anh, Tefli sẽ cấu hình nội dung và điều hướng tương ứng; trường hợp nội dung chưa có bản dịch sẽ tuân theo quy tắc hiển thị do Chủ đầu tư phê duyệt, tránh tự dịch nội dung nghiệp vụ.

### 2.2 Chuyên trang Đảng bộ và Chuyên trang Bộ trưởng

Tefli đề xuất xây dựng/cấu hình layout, trang chủ, danh sách và chi tiết nội dung riêng cho trang Đảng bộ Bộ Nội vụ, gồm nhận diện, banner, menu và các vị trí nội dung do đơn vị quản trị. Phạm vi trang Đảng bộ được phân biệt với chuyên trang Nghị quyết TW4; Tefli sẽ làm rõ cấu trúc nội dung, phạm vi trang và quy tắc sử dụng dữ liệu với Chủ đầu tư trước khi cấu hình/phát triển. Hai phạm vi chỉ dùng chung dữ liệu hoặc điều hướng khi được thống nhất.

Chuyên trang Bộ trưởng sẽ có trang chủ và layout riêng; khai thác banner, tin nổi bật, phát biểu/chỉ đạo, nội dung đa phương tiện, danh sách và chi tiết tin. Người biên tập được phân quyền quản lý tin, menu, banner và cấu hình hiển thị của chuyên trang. Tefli sẽ kiểm chứng bằng việc tạo/cập nhật nội dung thử, xuất bản theo quyền, sau đó đối chiếu các vị trí hiển thị trên trang chủ, danh sách và chi tiết.

### 2.3 Văn bản, dự thảo, đa phương tiện và sự kiện

Trang văn bản QPPL và văn bản chỉ đạo, điều hành sẽ hỗ trợ tra cứu theo các tiêu chí thống nhất với trường dữ liệu HSYC; xem hồ sơ chi tiết, trạng thái hiệu lực, tệp đính kèm và văn bản liên quan. Trang lấy ý kiến nhân dân sẽ hiển thị danh sách và chi tiết dự thảo, biểu mẫu nhận góp ý, thông tin người gửi, nội dung, tệp đính kèm và danh sách ý kiến được phép công khai. Biểu mẫu kiểm tra dữ liệu đầu vào và yêu cầu reCAPTCHA; API xác minh token trước khi ghi nhận. Ý kiến mới ở trạng thái chờ xử lý cho tới khi người có quyền duyệt hoặc từ chối. Nghiệm thu gồm truy vấn theo từng bộ lọc, tải tệp, gửi hợp lệ/không hợp lệ và xác minh trạng thái kiểm duyệt.

Trang đa phương tiện sẽ phân loại album ảnh, video và audio; hỗ trợ lọc theo chuyên mục/thời gian, xem chi tiết album, trình phát phù hợp loại nội dung và lightbox ảnh. Trang hội nghị - sự kiện sẽ hiển thị danh sách, thông tin tóm tắt, bộ lọc và timeline theo dữ liệu sự kiện. Tefli sẽ kiểm tra từng loại media, tệp và liên kết nhúng được cho phép, trạng thái xuất bản, bộ lọc có kết quả/không kết quả và liên kết từ danh sách tới chi tiết.

## 3. Quản trị nội dung và quy trình nghiệp vụ

Quản trị viên, biên tập viên và người kiểm duyệt sẽ thao tác theo vai trò được cấp. Tefli đề xuất quy trình nội dung gồm: tạo bản nháp; biên tập và lưu; gửi duyệt; người kiểm duyệt duyệt hoặc trả lại/từ chối; xuất bản khi được duyệt; cập nhật hoặc gỡ xuất bản theo quyền. Trạng thái, người thao tác, thời điểm và nội dung liên quan được lưu phục vụ truy vết. Bản nháp/chờ duyệt không hiển thị công khai. Quyền xóa, xuất bản và cấu hình hệ thống được phân biệt theo vai trò. Tiêu chí kiểm chứng gồm thử với các vai trò được Chủ đầu tư duyệt, xác nhận thao tác được phép/bị từ chối và kiểm tra nhật ký/trạng thái sau từng bước.

Phân hệ quản lý tin tức sẽ hỗ trợ danh sách, tạo, sửa, xóa, phân loại, ngôn ngữ, SEO, ảnh đại diện, tệp, slug và trạng thái. Slug được tạo/kiểm tra tránh xung đột theo quy tắc thống nhất; dữ liệu SEO và tệp phải được lưu, cập nhật cùng bản ghi. Chuyên mục dạng cây, loại tin và menu được quản lý riêng, có kiểm tra quan hệ cha/con và ngăn cấu hình gây mất liên kết.

Phân hệ văn bản cho phép quản lý hồ sơ QPPL/CĐĐH, số/ký hiệu, loại, cơ quan ban hành, người ký, lĩnh vực, ngày tháng, hiệu lực, ngôn ngữ, văn bản liên quan và tệp. Danh sách hỗ trợ lọc đa tiêu chí theo trường đã thống nhất; hồ sơ được hiển thị công khai căn cứ trạng thái và quyền.

Phân hệ chuyên trang Bộ trưởng quản lý tin, banner, menu và cấu hình hiển thị riêng. Phân hệ Đảng bộ được cấu hình/phát triển tương ứng với layout công khai, danh mục, banner, menu và nội dung riêng; phạm vi Nghị quyết TW4 được xác định riêng theo yêu cầu đã nêu. Phân hệ đa phương tiện quản lý album ảnh/video/audio, danh mục, nhiều tệp theo quy tắc được duyệt, thumbnail, nguồn nhúng YouTube/Vimeo nếu được phép và trạng thái. Phân hệ dự thảo quản lý loại dự thảo, cơ quan phụ trách, hạn/đợt lấy ý kiến theo trường được thống nhất, ý kiến nhận được, duyệt/từ chối và thống kê. Phân hệ sự kiện quản lý loại, nội dung, thời gian/timeline, tệp, thành phần tham gia và trạng thái xuất bản. Tefli đề xuất kiểm chứng từng nhóm bằng ca tạo/sửa, phân quyền và trạng thái; đối chiếu dữ liệu lưu với kết quả hiển thị công khai.

Quản trị hệ thống cung cấp quản lý tài khoản, vai trò, quyền, menu quản trị, banner, block, chức danh, cấu hình và danh mục dùng chung trong phạm vi yêu cầu. Tefli sẽ lập ma trận quyền theo vai trò với Chủ đầu tư; áp dụng kiểm tra quyền tại giao diện và API, không chỉ ẩn nút trên màn hình.

## 4. Tích hợp, chuyển đổi, bảo mật và vận hành

### 4.1 Chuyển đổi dữ liệu và đường dẫn

Tefli sẽ lập danh mục nguồn/đích và mapping trường cho tin tức, văn bản, chuyên trang Bộ trưởng, Đảng bộ, đa phương tiện và các đường dẫn cần chuyển đổi theo phạm vi HSYC. Trước khi chạy, các bên xác nhận dữ liệu nguồn, quy tắc xử lý trùng, trường thiếu, danh mục quy đổi, tệp và phạm vi bản ghi. Tefli sẽ chạy chuyển đổi thử trên bản sao dữ liệu, ghi nhận số bản ghi đọc/ghi/bỏ qua/lỗi, kiểm tra liên kết đến tệp và đối soát mẫu với nguồn. Các lỗi được xử lý và chạy lại có kiểm soát; trước chuyển đổi chính thức lập phương án sao lưu, dừng ghi nếu cần, xác nhận kết quả và phương án quay lui.

Với URL cũ, Tefli sẽ thu thập danh sách đường dẫn và quy tắc ánh xạ sang URL mới, xử lý xung đột/không tìm thấy và kiểm tra chuyển hướng theo từng nhóm. Kiểm chứng dựa trên báo cáo đối soát, mẫu bản ghi, tệp truy cập được và ma trận URL cũ/mới.

### 4.2 QR và xác thực hai bước

Tefli sẽ triển khai vòng đời 2FA gồm tạo secret cho tài khoản, hiển thị QR enrollment, xác minh OTP trước khi bật, yêu cầu OTP khi đăng nhập nếu tài khoản đã bật, tắt và reset theo quyền. Secret cần được bảo vệ khi lưu và không ghi vào log; reset phải thu hồi cấu hình cũ và yêu cầu đăng ký lại theo quy trình được duyệt. QR của nội dung là mã động gắn với URL chuẩn của từng trang chi tiết tin/văn bản; khác với QR tĩnh tại khu vực dùng chung.

### 4.3 Sao lưu, cảnh báo và yêu cầu an toàn

Phân hệ backup sẽ cho phép tạo thủ công, xem danh sách và tải file; Tefli sẽ bổ sung cấu hình lịch tự động theo yêu cầu, với chu kỳ, phạm vi, nơi lưu, thời hạn lưu và quyền truy cập được Chủ đầu tư chốt. Kết quả mỗi lần chạy cần thể hiện thời điểm và trạng thái thành công/lỗi; lỗi được ghi nhận để xử lý. Khôi phục và DR được lập quy trình, kiểm tra trên môi trường thử nghiệm theo chỉ tiêu RPO/RTO nêu tại HSYC; không coi có file backup là đã chứng minh khả năng khôi phục. Nghiệm thu gồm kiểm tra lịch, tạo file, quyền tải, cảnh báo lỗi và diễn tập phục hồi có biên bản.

Thông báo nội bộ và cảnh báo sẽ quản lý nội dung, đối tượng nhận và trạng thái; Tefli sẽ cấu hình gửi email cho cảnh báo API/lỗi hệ thống và đăng nhập bất thường theo ngưỡng, điều kiện do Chủ đầu tư phê duyệt. Nhật ký cần đủ thông tin để truy vết, tránh ghi dữ liệu nhạy cảm; xử lý lỗi gửi và thử lại có kiểm soát. Nghiệm thu dùng các tình huống được phép trong môi trường thử, xác nhận người nhận, nội dung, nhật ký và kết quả gửi.

Các yêu cầu an toàn cơ bản được áp dụng xuyên suốt: xác thực đăng nhập, phân quyền API, làm sạch/encode đầu ra để hạn chế XSS, kiểm soát bot/reCAPTCHA, bảo vệ CSRF phù hợp cơ chế xác thực, kiểm tra dữ liệu và slug an toàn, kiểm soát tải tệp và bảo vệ dữ liệu. Tefli sẽ lập danh mục kiểm tra và thực hiện ca thử theo từng điểm tiếp nhận/đầu ra; kết quả bảo mật và các lỗi còn lại được ghi nhận, khắc phục, kiểm tra lại trước nghiệm thu.

## 5. Kiểm chứng và nghiệm thu chức năng

Tefli sẽ lập bộ ca nghiệm thu bám mã HSYC tại Phụ lục, chuẩn bị dữ liệu đại diện và tài khoản theo vai trò. Mỗi ca ghi tiền điều kiện, thao tác, kết quả mong đợi, kết quả thực tế, bằng chứng và trạng thái đạt/chưa đạt. Các nhóm kiểm tra gồm: giao diện và điều hướng; tìm kiếm/lọc/phân trang; CRUD và quy trình duyệt; phân quyền; upload/tải tệp; chuyển đổi/đối soát; 2FA/QR; backup/lịch/phục hồi; cảnh báo/email; kiểm tra an toàn. Lỗi được lập danh sách, xử lý và chạy lại ca liên quan. Chỉ các tiêu chí có kết quả kiểm tra được Chủ đầu tư xác nhận mới được xem là hoàn thành nghiệm thu.

## Phụ lục A. Ma trận truy vết và kiểm chứng

| Mã HSYC | Mục thuyết minh | Tiêu chí kiểm chứng nghiệm thu |
|---|---|---|
| B0738.R003; B0742.R003–R005; B0746.R003 | 2.1 Trang chủ | Banner/khối nội dung, menu, ngôn ngữ, tìm kiếm và footer hiển thị theo cấu hình; liên kết hoạt động |
| B0738.R004; B0742.R006–R008; B0746.R004 | 2.1 Tin bài | Lọc, phân trang, chi tiết, tác giả/nguồn, tệp, tin liên quan, chia sẻ, QR và bình luận theo quyền |
| B0738.R005; B0742.R009–R010; B0746.R005 | 2.2 Đảng bộ | Trang chủ/danh sách/chi tiết theo nhận diện và nội dung được cấu hình; phân biệt phạm vi Nghị quyết TW4 |
| B0738.R006; B0742.R011–R012; B0746.R006 | 2.2 Bộ trưởng | Trang chủ, banner, tin, chỉ đạo, media, danh sách/chi tiết và cấu hình quản trị riêng |
| B0738.R007; B0742.R013–R014; B0746.R007 | 2.3 Văn bản công khai | Tìm theo tiêu chí; chi tiết, hiệu lực, tệp và văn bản liên quan khớp dữ liệu |
| B0738.R008; B0742.R015–R016; B0746.R008 | 2.3 Dự thảo công khai | Danh sách/chi tiết, reCAPTCHA hợp lệ/không hợp lệ, gửi ý kiến/tệp và trạng thái tiếp nhận |
| B0738.R009; B0742.R017–R018; B0746.R009 | 2.3 Đa phương tiện | Album ảnh/video/audio, lọc, chi tiết, phát/lightbox, tệp và liên kết nhúng được phép |
| B0738.R010; B0742.R019–R020; B0746.R010 | 2.3 Sự kiện công khai | Danh sách, bộ lọc, timeline và thông tin tóm tắt khớp bản ghi xuất bản |
| B0738.R011; B0742.R021–R022 | 2.1 Giao diện đồng bộ | Đối chiếu header/footer/breadcrumb/sidebar/typography và responsive trên các layout; kiểm tra ngôn ngữ |
| B0738.R013–R018 | 4.1 Chuyển đổi/tích hợp | Đối soát nguồn/đích theo nhóm dữ liệu, tệp và danh sách URL cũ/mới; ghi nhận lỗi và xử lý |
| B0738.R020; B0742.R024–R027; B0746.R012–R013 | 3 Tin và chuyên mục | CRUD, slug, SEO, loại/ngôn ngữ, tệp, cây danh mục/menu; xác nhận trạng thái và quyền |
| B0738.R021; B0742.R028–R029; B0746.R014 | 3 Văn bản quản trị | CRUD hồ sơ, cơ quan/người ký, hiệu lực, ngôn ngữ, tệp; bộ lọc trả đúng kết quả |
| B0738.R022; B0742.R030–R031; B0746.R015 | 3 Bộ trưởng quản trị | Sửa/xuất bản tin, banner/menu/cấu hình riêng; xác nhận hiển thị tương ứng |
| B0738.R023; B0742.R032–R033; B0746.R016 | 2.2 và 3 Đảng bộ quản trị | Quản trị nội dung/menu/banner riêng và hiển thị đúng trang; xác nhận cấu hình riêng với Nghị quyết TW4 |
| B0738.R024; B0742.R034–R035; B0746.R017 | 3 Đa phương tiện quản trị | Album/danh mục/tệp/thumbnail/nhúng/trạng thái được lưu và hiển thị phù hợp |
| B0738.R025; B0742.R036–R037; B0746.R018 | 3 Dự thảo/góp ý | Quản lý dự thảo, cơ quan/loại, ý kiến, duyệt/từ chối và thống kê đối chiếu bản ghi |
| B0738.R026; B0742.R028–R029; B0746.R014 | 3 Văn bản QPPL/CĐĐH | Kiểm tra riêng loại QPPL/CĐĐH, trường hồ sơ, lọc, hiệu lực và tệp |
| B0738.R027; B0742.R038–R039; B0746.R019 | 3 Sự kiện quản trị | CRUD loại/sự kiện, timeline, tệp/thành phần tham gia, trạng thái xuất bản và hiển thị |
| B0738.R028; B0742.R040–R041; B0746.R020 | 3 Quản trị hệ thống | Thử CRUD tài khoản, vai trò/quyền, menu, block, banner, cấu hình và danh mục theo ma trận quyền |
| B0738.R029; B0742.R043–R044; B0746.R022 | 4.2 2FA | Bật/xác minh/tắt/reset; đăng nhập yêu cầu OTP khi bật; thử OTP đúng/sai và kiểm tra quyền |
| B0738.R030; B0742.R045–R046; B0746.R023 | 4.2 QR | Quét QR setup và QR từng tin/văn bản, xác nhận enrollment hoặc URL đúng |
| B0738.R031; B0742.R047–R048; B0746.R024 | 4.3 Sao lưu | Chạy thủ công/theo lịch, liệt kê/tải file theo quyền; xác nhận trạng thái và phục hồi thử |
| B0738.R032; B0742.R049–R050; B0746.R025 | 4.3 Cảnh báo | Gây tình huống thử được duyệt; xác nhận thông báo nội bộ/email, người nhận, nhật ký và lỗi gửi |
| B0738.R033; B0742.R051–R052; B0746.R026 | 3 Liên kết tích hợp | CRUD nhóm/liên kết/logo/vị trí; xác nhận hiển thị đúng khu vực cấu hình |
| B0742.R053–R054; B0746.R027 | 4.3 An toàn cơ bản | Thử xác thực/phân quyền, XSS, bot/CSRF, slug, tệp và dữ liệu với ca kiểm tra được duyệt |

