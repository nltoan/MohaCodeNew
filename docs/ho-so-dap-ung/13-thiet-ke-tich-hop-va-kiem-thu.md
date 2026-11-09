# Thiết kế liên phân hệ và tổ chức kiểm chứng

## A Nguyên tắc thiết kế và ranh giới hệ thống

Phương án chi tiết sử dụng SharePoint làm nền tảng portal theo HSYC, React làm lớp giao diện và .NET API hoặc dịch vụ làm lớp thực thi nghiệp vụ. SQL Server lưu dữ liệu theo phạm vi quản lý được phê duyệt. Những thành phần có trong mã nguồn là đầu vào để kế thừa; thiết kế dưới đây không mặc nhiên xác nhận đã có đầy đủ chức năng, cấu hình hạ tầng hoặc kết quả đo. Trước khi xây dựng, Tefli lập bảng phân công chủ sở hữu dữ liệu giữa SharePoint và cơ sở dữ liệu nghiệp vụ để mỗi trường thông tin có một nguồn chính thức. [B0721–B0730; B0824–B0829]

[FIG:architecture]

Một bản tin có thể được trình bày bằng React nhưng quyền biên tập, nơi lưu nội dung và trạng thái xuất bản phải có cơ chế thống nhất. Nếu nội dung thuộc SharePoint, dịch vụ truy cập thông qua giao diện được nền tảng hỗ trợ và tài khoản được cấp phép. Nếu thuộc cơ sở dữ liệu nghiệp vụ mở rộng, API chịu trách nhiệm kiểm tra và ghi nhận giao dịch. Không thiết kế React kết nối SQL Server; không đọc hoặc sửa trực tiếp các bảng nội bộ SharePoint. Luồng đồng bộ phải định danh nguồn, phiên bản và thời điểm cập nhật để phát hiện bản ghi lệch, thay vì ghi đồng thời vào hai nơi mà không có cơ chế đối soát.

Trên mỗi chức năng công khai, lớp truy xuất chỉ trả các trường được phép công bố và nội dung đã xuất bản. Trường liên hệ của người góp ý, lịch sử chỉnh sửa, ghi chú của người duyệt và thông tin vận hành không được đưa vào đối tượng trả cho khách truy cập. Việc ẩn một nút ở giao diện không thay cho kiểm tra quyền tại API. Với tác vụ theo bản ghi, hệ thống kiểm tra đồng thời quyền chức năng, đơn vị hoặc chuyên trang được phân công và trạng thái bản ghi.

### A1 Phân vùng và nguyên tắc kết nối

[FIG:network-zones]

Luồng công khai đi qua điểm tiếp nhận HTTPS và cơ chế kiểm soát truy cập trước khi tới giao diện. Các dịch vụ nghiệp vụ được đặt trong vùng ứng dụng; SQL, kho tệp và hệ thống sao lưu đặt trong vùng dữ liệu theo thiết kế mạng được duyệt. Người vận hành đi qua đường truy cập quản trị được Chủ đầu tư cho phép. Sơ đồ phân vùng thể hiện quan hệ logic, không mặc định có thêm thiết bị hoặc giấy phép ngoài tài nguyên do Chủ đầu tư bố trí. [B0751–B0754; B0813; B0824–B0829]

| Luồng | Dữ liệu được phép | Kiểm soát cần cấu hình | Bằng chứng kiểm tra |
|---|---|---|---|
| Trình duyệt đến giao diện | Yêu cầu trang và tài nguyên công khai | HTTPS, chính sách chứng thư, giới hạn đầu vào phù hợp | Mở trang hợp lệ và thử giao thức hoặc host không được chấp thuận |
| Giao diện đến API | Truy vấn hoặc thao tác nghiệp vụ theo quyền | Xác thực khi cần, kiểm tra dữ liệu, giới hạn yêu cầu | Gọi cùng thao tác qua UI và trực tiếp API để so sánh quyền |
| API đến SharePoint | Nội dung và metadata thuộc nền tảng | Tài khoản dịch vụ tối thiểu quyền, giao diện được hỗ trợ | Nhật ký kết nối và kiểm tra các thao tác được cấp hoặc bị từ chối |
| API đến SQL và kho tệp | Dữ liệu nghiệp vụ và tệp trong phạm vi | Quyền ứng dụng riêng, truy vấn tham số, kiểm soát đường dẫn | Thử tài khoản bị thu hồi quyền, kiểm tra lỗi có kiểm soát |
| Ứng dụng đến LGSP hoặc EMC | Thông điệp theo đặc tả được thống nhất | Endpoint cấu hình, xác thực, timeout, truy vết | Thử dữ liệu hợp lệ, lỗi xác thực, chậm và mất kết nối |
| Thành phần đến giám sát và sao lưu | Log đã lọc và bản sao được bảo vệ | Quyền riêng, kiểm soát truy cập, lưu giữ theo chính sách | Kiểm tra log không chứa bí mật và khôi phục bằng tài khoản được phân công |

Địa chỉ, tên miền, thông tin kết nối và thông số môi trường tách khỏi mã nguồn. Hồ sơ cấu hình phân biệt giá trị không nhạy cảm với bí mật; bí mật được quản lý bằng cơ chế bảo vệ phù hợp hạ tầng. Khi bàn giao, tài liệu chỉ ghi tên tham số, ý nghĩa, chủ sở hữu và quy trình đổi; mật khẩu hoặc secret không được đưa vào bản Word, log, ảnh chụp màn hình hay kho mã nguồn. [B0802.R050; B0830–B0835]

### A2 Tính sẵn sàng và tính nhất quán giữa các nút

[FIG:ha-failover]

Hai nút FE, hai nút API và hai nút Portal triển khai cùng phiên bản cấu hình ứng dụng đã duyệt. Điểm cân bằng tải chỉ gửi yêu cầu tới nút có trạng thái sẵn sàng. Phép kiểm tra sống xác định tiến trình còn hoạt động; phép kiểm tra sẵn sàng xác định nút có đủ phụ thuộc để phục vụ. Đường kiểm tra nội bộ không trả thông tin kết nối hoặc lỗi chi tiết ra Internet. Tài liệu hoàn công ghi điều kiện loại nút, chu kỳ kiểm tra và cách đưa nút trở lại; các thông số được chọn sau chạy thử, không dùng giá trị tùy ý như một yêu cầu của HSYC.

Phiên đăng nhập và trạng thái tác vụ không được phụ thuộc duy nhất vào bộ nhớ của một nút. Cơ chế phiên, khóa bảo vệ dữ liệu, đồng hồ hệ thống và nơi lưu tệp phải thống nhất theo thiết kế nền tảng. Khi người biên tập tải tệp trên API thứ nhất rồi lưu bài qua API thứ hai, tệp phải vẫn truy cập được theo quyền. Tệp tạm chưa gắn bản ghi được quản lý riêng, có quy trình dọn dẹp để tránh xóa tệp đang tham chiếu. Cache phải phân biệt dữ liệu công khai với dữ liệu người dùng; không dùng khóa cache chung cho phản hồi có quyền riêng.

Với cơ sở dữ liệu HA, công nghệ và phương thức chuyển vai được chốt theo giấy phép, phiên bản SQL Server và hạ tầng thực tế. Một bài thử mất nút FE không chứng minh khả năng khôi phục SQL; cần bài thử độc lập cho từng tầng. Sau chuyển vai dữ liệu, kiểm tra bản ghi vừa cập nhật, quyền, tham chiếu tệp và hàng đợi công việc. Chỉ đưa nút lỗi trở lại sau khi xác nhận đồng bộ và xử lý nguy cơ phục vụ dữ liệu cũ. [B0751–B0756; B0813]

## B Hợp đồng dữ liệu và dịch vụ dùng chung

### B1 Mô hình thông tin logic

[FIG:data-model]

Mô hình dưới đây là đề xuất logic phục vụ thiết kế, không phải khẳng định tên bảng hoặc cột đã tồn tại trong code. Các đối tượng nội dung dùng chung định danh, ngôn ngữ, phạm vi chuyên trang, trạng thái, phiên bản và dấu vết cập nhật. Tin, văn bản, sự kiện và album giữ các trường nghiệp vụ riêng để không ép mọi loại nội dung vào một cấu trúc thiếu kiểm soát. Quan hệ giữa nội dung và tệp được quản lý bằng tham chiếu; đổi tên hiển thị không làm mất liên kết tới tệp vật lý.

| Đối tượng logic | Thông tin chính | Quan hệ và quy tắc |
|---|---|---|
| Nội dung xuất bản | Định danh, tiêu đề, slug, ngôn ngữ, trạng thái, phiên bản | Gắn chuyên trang và chuyên mục; slug được kiểm tra trong phạm vi đã thống nhất |
| Chuyên mục | Định danh, tên, cha, thứ tự, trạng thái | Không tạo chu trình; việc ngừng sử dụng phải xử lý các nội dung đang tham chiếu |
| Tệp và media | Định danh, loại, dung lượng, vị trí lưu, mô tả | Truy cập theo quyền của nội dung và chính sách công bố; không dùng tên do người dùng nhập làm đường dẫn thực |
| Lịch sử phê duyệt | Nội dung, phiên bản, người thực hiện, hành động, thời điểm, ý kiến | Lưu chuyển trạng thái; người xem lịch sử cần quyền phù hợp |
| Vai trò và phạm vi | Tài khoản, nhóm quyền, đơn vị, chuyên trang | Kiểm tra tại máy chủ; thu hồi quyền có hiệu lực theo cơ chế phiên được duyệt |
| Ánh xạ dữ liệu | Nguồn, khóa nguồn, khóa đích, lần chạy, kết quả | Chạy lại không tạo trùng; phục vụ đối soát và truy nguyên |
| Công việc nền | Loại công việc, trạng thái, lần thử, thời điểm, lỗi đã lọc | Hỗ trợ nhận lại công việc bị gián đoạn và tránh thực hiện trùng tác động |

Quy tắc chuẩn hóa bao gồm Unicode, định dạng ngày hiển thị dd/mm/yyyy và thời gian 24 giờ. Lưu trữ và trao đổi thời điểm phải thống nhất múi giờ để tránh sai hạn lấy ý kiến hoặc lịch xuất bản; tài liệu giao tiếp ghi rõ quy ước thay vì để từng thành phần tự suy diễn. Trường bắt buộc do nghiệp vụ quyết định; giá trị không có phải phân biệt với số không hoặc chuỗi rỗng. Giới hạn độ dài, loại và dung lượng tệp được chốt trong đặc tả chi tiết và cấu hình, rồi kiểm tra tại máy chủ. [B0783–B0789]

### B2 Giao dịch cập nhật và xử lý xung đột

[FIG:save-sequence]

Khi sửa nội dung, trình duyệt gửi định danh bản ghi và phiên bản đã đọc. API xác thực tài khoản, kiểm tra quyền và đối chiếu phiên bản hiện hành trước khi ghi. Nếu một người khác đã lưu bản mới, API trả tình huống xung đột để giao diện thông báo, giữ nội dung đang nhập và cho phép người dùng tải lại hoặc đối chiếu. Không tự ghi đè bản mới nhất bằng bản cũ mà không cảnh báo. Cơ chế phiên bản cụ thể được chọn theo nơi sở hữu dữ liệu; đây là phương án đề xuất cho bảo toàn dữ liệu khi nhiều người làm việc.

Giao dịch nghiệp vụ bao gồm những thay đổi cần nhất quán, chẳng hạn bản ghi nội dung và quan hệ chuyên mục. Nếu bước bắt buộc lỗi, giao dịch phải quay lui và trả thông báo có mã tra cứu. Tác vụ ngoài giao dịch như cập nhật chỉ mục tìm kiếm hoặc gửi thông báo được ghi nhận để xử lý nền; việc gửi email thất bại không được biến một lần lưu nội dung thành nhiều bản sao. Trạng thái tác vụ nền cho phép quan sát, chạy lại có kiểm soát và xác nhận kết quả. [B0755]

Đối với tệp lớn, quá trình tải lên và xác nhận gắn tệp được tách thành các bước có kiểm tra. Sau tải lên, kiểm tra loại tệp, dung lượng, quyền và điều kiện an toàn được phê duyệt; chỉ tệp hợp lệ mới được gắn vào nội dung công bố. Nếu người dùng hủy biểu mẫu, tệp tạm không tự trở thành tài nguyên công khai. Khi thay thế tệp, liên kết đang được tham chiếu phải có chính sách rõ ràng: giữ phiên bản, cập nhật tham chiếu hoặc ngừng phục vụ theo quyết định nghiệp vụ.

### B3 Mẫu giao tiếp và lỗi thống nhất

Đặc tả API ghi rõ thao tác nghiệp vụ, đầu vào, trường bắt buộc, phạm vi quyền, phản hồi thành công, tình huống lỗi và cách chạy lại. Tên endpoint được thiết kế sau khi rà các controller hiện có; các tài liệu này không tự tạo một endpoint rồi coi đó là bằng chứng code. Các thao tác danh sách có phân trang và bộ lọc được kiểm soát; giới hạn truy vấn tránh tải toàn bộ dữ liệu về trình duyệt. Thứ tự sắp xếp có tiêu chí phụ ổn định để bản ghi không nhảy tùy ý giữa các trang.

| Tình huống | Phản hồi nghiệp vụ | Hành vi giao diện | Dấu vết máy chủ |
|---|---|---|---|
| Thiếu hoặc sai trường | Nêu trường và quy tắc bị vi phạm | Giữ dữ liệu đã nhập, đưa focus tới lỗi | Ghi loại lỗi cần thiết, không ghi mật khẩu hoặc toàn bộ dữ liệu cá nhân |
| Phiên hết hạn | Yêu cầu xác thực lại | Thông báo rõ; không tự lặp thao tác ghi | Ghi sự kiện phiên theo chính sách |
| Không có quyền | Từ chối thao tác hoặc tài nguyên | Không hiển thị nội dung nhạy cảm | Ghi tài khoản, hành động, định danh đối tượng và kết quả |
| Xung đột phiên bản | Yêu cầu đối chiếu bản mới | Giữ bản nhập và hướng dẫn xử lý | Ghi phiên bản tham chiếu và phiên bản hiện hành |
| Phụ thuộc tạm lỗi | Thông báo có thể thử lại khi phù hợp | Tránh vòng lặp liên tục; hiện trạng thái tác vụ | Mã tương quan, phụ thuộc lỗi, thời gian và số lần thử |
| Lỗi không dự kiến | Thông báo chung và mã tra cứu | Hướng dẫn liên hệ hỗ trợ | Chi tiết kỹ thuật trong log nội bộ có phân quyền |

## C Tích hợp và kiểm soát phụ thuộc

[FIG:integration-sequence]

Với AD hoặc SSO, khảo sát trước gồm cơ chế được hỗ trợ, định danh tài khoản, quy tắc ánh xạ nhóm, vòng đời tài khoản và điều kiện đăng xuất. Đăng nhập thành công từ hệ thống danh tính không đồng nghĩa được quyền quản trị mọi chuyên trang. API vẫn kiểm tra vai trò nghiệp vụ đã được phân công. Khi người dùng bị khóa hoặc rút quyền, kịch bản thử phải xác định tác động tới phiên đang có và thời điểm quyền bị thu hồi theo cấu hình được duyệt. [B0824–B0829]

Với LGSP, mỗi luồng trao đổi có bên sở hữu dữ liệu, mục đích sử dụng, danh mục trường, tần suất, cách xác thực và tiêu chí đối soát. Nếu nền tảng chưa triển khai hoặc chưa có endpoint được cấp, ghi rõ phụ thuộc và chuẩn bị điểm cấu hình, không đánh dấu tích hợp đã hoàn thành. Với EMC, xác nhận chức năng hoặc công cụ cần kết nối và dữ liệu giám sát cụ thể; không tự diễn giải EMC là kho quản lý văn bản. [B0713.R007; B0824–B0829]

Luồng gọi ra bên ngoài có timeout để không giữ yêu cầu người dùng vô hạn. Chỉ chạy lại những thao tác được xác định an toàn; thao tác ghi cần khóa tương quan hoặc cơ chế kiểm tra trùng. Sau số lần thất bại theo cấu hình, công việc chuyển trạng thái cần xử lý, phát cảnh báo và lưu dữ liệu đủ để vận hành tra cứu. Không chuyển tiếp mật khẩu, secret hay dữ liệu ngoài phạm vi trao đổi vào log. Khi phụ thuộc lỗi, các module không liên quan tiếp tục phục vụ trong giới hạn thiết kế. [B0754–B0755; B0836–B0845]

| Hồ sơ tích hợp cần chốt | Nội dung phải thể hiện | Điều kiện đóng công việc |
|---|---|---|
| Danh mục giao diện | Hệ thống, chủ quản, endpoint môi trường, chức năng | Chủ quản xác nhận đúng đầu mối và môi trường |
| Hợp đồng dữ liệu | Trường, kiểu, bắt buộc, mã danh mục, múi giờ | Bộ mẫu hợp lệ và mẫu lỗi được hai bên thống nhất |
| Xác thực và quyền | Cơ chế cấp, phạm vi, vòng đời và đổi bí mật | Thử quyền cho phép, từ chối và thu hồi |
| Độ tin cậy | Timeout, retry, khóa tương quan, chống trùng | Thử mất kết nối, trả chậm và gửi lặp |
| Đối soát và vận hành | Số lượng, trạng thái, báo cáo lệch, đầu mối | Có biên bản chạy thử và cách xử lý bản ghi lệch |

## D Thiết kế kiểm thử và bằng chứng nghiệm thu

### D1 Tổ chức bộ ca thử

Mỗi yêu cầu được gắn với một hoặc nhiều ca thử. Bộ ca thử lưu mã yêu cầu nguồn, điều kiện trước, vai trò, dữ liệu thử, bước thao tác, kết quả mong đợi, kết quả thực tế, bằng chứng và lỗi liên quan. Không dùng một ảnh màn hình trang chủ để chứng minh toàn bộ chức năng. Các ca chức năng ở phần chi tiết được mở rộng thành tình huống tích cực, tiêu cực, giới hạn và trường hợp phối hợp nhiều phân hệ. [B0800–B0808; B0880–B0883]

Ví dụ với xuất bản tin: chuẩn bị bản nháp có tệp; biên tập viên gửi duyệt; người không có quyền thử phê duyệt và bị từ chối; người có quyền duyệt bản đúng phiên bản; xuất bản; kiểm tra danh sách, trang chi tiết, tìm kiếm và QR. Sau khi gỡ bài, kiểm tra các đường truy cập công khai và cache theo quy tắc. Bằng chứng phải thể hiện cả trạng thái quản trị và đầu ra công khai, kèm định danh bản tin để đối chiếu xuyên suốt.

| Nhóm thử | Dữ liệu chuẩn bị | Điểm đánh giá | Bằng chứng lưu |
|---|---|---|---|
| Chức năng công khai | Nội dung đã duyệt, chưa duyệt, thiếu ảnh, nhiều trang | Hiển thị, lọc, điều hướng và trạng thái rỗng | Ảnh, dữ liệu đầu vào và danh sách kết quả |
| Biên tập và duyệt | Vai trò khác nhau và bản ghi nhiều phiên bản | Chuyển trạng thái, xung đột, lịch sử và quyền | Log thao tác, phản hồi API, ảnh trước và sau |
| Chuyển đổi dữ liệu | Mẫu đủ loại, trùng, thiếu và tệp hỏng | Đối soát số lượng, nội dung, tệp và URL | Báo cáo từng lần chạy và bảng sai khác |
| Tích hợp | Tài khoản dịch vụ và thông điệp mẫu | Thành công, lỗi quyền, timeout và gửi lặp | Mã tương quan và xác nhận đầu mối |
| An toàn | Tài khoản từng nhóm, dữ liệu kiểm thử riêng | Các kiểm soát tương ứng từng dòng B0802 | Báo cáo, cấu hình đã che bí mật và kết quả kiểm tra lại |
| Vận hành | Hạ tầng thử tương đương và bản sao hợp lệ | Mất nút, cảnh báo, backup, restore, RPO và RTO | Mốc thời gian, log, biên bản và dữ liệu đối soát |

### D2 Kịch bản đo hiệu năng

[FIG:performance-test]

Chạy tải trên bản dựng đã chốt, với dữ liệu đại diện được cấp phép và hạ tầng đã kiểm kê. Bộ kịch bản gồm trang chủ, tìm kiếm, xem tin, tải tệp và thao tác quản trị như HSYC. Xác định 500 phiên truy cập đồng thời, trong đó ít nhất 84 phiên hoạt động; tài liệu cấu hình phải làm rõ thời gian chờ và cách luân phiên thao tác để không đánh đồng 500 kết nối nhàn rỗi với 500 người cùng thực hiện tác vụ. [B0804; B0810]

Mỗi lần chạy có bước khởi động, tăng tải, duy trì và giảm tải; thời lượng cụ thể chốt trong kế hoạch kiểm thử để đạt mẫu đo có ý nghĩa. Ghi rõ môi trường mạng, kích thước dữ liệu, tỷ lệ cache và tình trạng tác vụ nền. Không chỉ chọn các trang đã cache để đo rồi suy rộng sang tìm kiếm hoặc cập nhật dữ liệu. Nếu chạy từ mạng nội bộ, báo cáo nêu rõ phạm vi đó và đánh giá riêng ảnh hưởng đường truyền Internet.

Đối chiếu trung bình dưới 2,5 giây và chậm nhất dưới 30 giây cho tác vụ thông thường; tương tác trực tiếp không quá 0,6 giây khi điều kiện mạng và tải cho phép. Theo dõi CPU trung bình mỗi nút không quá 75%, không swap kéo dài và còn ít nhất 25% dư địa tài nguyên. Phân vị và tỷ lệ lỗi được ghi bổ sung để tìm điểm nghẽn, không tự thay các ngưỡng gốc bằng một phân vị dễ đạt hơn. [B0805–B0806]

Nếu không đạt, phân tích thời gian tại trình duyệt, API, truy vấn, kho tệp và phụ thuộc ngoài. Chỉnh chỉ mục hoặc truy vấn sau khi xác nhận kế hoạch thực thi; phân trang hoặc cache theo phạm vi an toàn; xử lý tác vụ nặng bằng nền khi phù hợp nghiệp vụ. Chạy lại cùng bộ dữ liệu và cấu hình tải để so sánh. Mọi tăng tài nguyên vượt cấu hình được cấp phải được đánh giá và thống nhất, không coi việc yêu cầu thêm máy là kết quả tối ưu đã hoàn tất.

### D3 Diễn tập sự cố và khôi phục

Trước thử lỗi, thống nhất phạm vi, người quyết định dừng, điểm khôi phục và cách bảo vệ dữ liệu. Kịch bản mất một nút FE hoặc API kiểm tra điều phối tải và phiên; kịch bản lỗi Portal hoặc SQL kiểm tra phụ thuộc và cơ chế HA; kịch bản mất tệp kiểm tra tham chiếu và khôi phục nội dung. Mỗi bài thử ghi thời điểm phát hiện, cô lập, phục hồi dịch vụ và kết thúc đối soát, thay vì chỉ ghi thời điểm tiến trình khởi động lại.

RPO được xác định bằng khoảng cách giữa mốc dữ liệu cần bảo vệ và mốc dữ liệu có thể phục hồi hợp lệ; RTO đo từ mốc sự cố được định nghĩa trong kế hoạch tới thời điểm dịch vụ trọng yếu được kiểm tra và phục hồi. Hai chỉ tiêu không quá 04 giờ phải có bằng chứng diễn tập trước nghiệm thu. Sự tồn tại của tệp backup chưa chứng minh khả năng khôi phục; bản sao cần được đọc, phục hồi và kiểm tra dữ liệu cùng cấu hình liên quan. [B0756]

Độ sẵn sàng 99,9% là chỉ tiêu theo tháng, loại trừ bảo trì có kế hoạch theo HSYC. Phép đo cần định nghĩa điểm kiểm tra, chu kỳ, điều kiện xác định gián đoạn và cửa sổ bảo trì được phê duyệt. Báo cáo chạy thử ngắn chỉ chứng minh việc thiết lập đo và thử chuyển tải, không thể thay cho báo cáo độ sẵn sàng cả tháng. [B0752]

## E Quản lý cấu hình phát hành và bàn giao

[FIG:release-gates]

Mỗi bản phát hành ghi phiên bản mã nguồn, cấu hình môi trường không chứa bí mật, thay đổi dữ liệu, gói triển khai và kết quả kiểm thử liên quan. Tách môi trường thử với môi trường vận hành; dữ liệu lấy từ vận hành phải được xử lý theo phạm vi cho phép trước khi đưa sang thử nghiệm. Dịch vụ ngoài có endpoint tương ứng từng môi trường để tránh một lần chạy thử gửi dữ liệu vào hệ thống thật.

Trước chuyển chính thức, khóa phạm vi thay đổi, sao lưu, xác nhận cửa sổ thao tác và đối soát dữ liệu chuyển thử. Sau triển khai, thực hiện bộ kiểm tra nhanh gồm trang chủ, xác thực, truy vấn tin, tải tệp, quyền quản trị và trạng thái công việc nền. Nếu lỗi ảnh hưởng điều kiện vận hành, người có thẩm quyền quyết định quay lui theo phương án đã thử; không chỉ thay file chương trình khi cấu trúc dữ liệu đã thay đổi không tương thích.

| Sản phẩm bàn giao | Nội dung chi tiết | Cách kiểm tra đủ |
|---|---|---|
| Thiết kế và hoàn công | Sơ đồ vùng, thành phần, luồng, cấu hình từng nút và phiên bản | Đối chiếu máy thực, tên dịch vụ và kết nối được cấp |
| Mã nguồn và bộ cài | Phạm vi quyền bàn giao, hướng dẫn dựng và triển khai | Dựng hoặc triển khai lại theo tài liệu trong môi trường được phép |
| Hồ sơ dữ liệu | Mapping, danh mục, kết quả chuyển, URL và sai khác đã xử lý | Lấy mẫu truy nguyên nguồn tới đích và tệp |
| Tài liệu người dùng | Từng vai trò, thao tác, lỗi thường gặp và hướng dẫn xử lý | Học viên thực hành trên tình huống có dữ liệu mẫu |
| Tài liệu vận hành | Giám sát, phát hành, sao lưu, khôi phục, đổi cấu hình và liên hệ | Người tiếp nhận thực hiện bài diễn tập theo tài liệu |
| Hồ sơ kiểm thử | Ca thử, kết quả thực tế, bằng chứng, lỗi và kiểm tra lại | Truy từ yêu cầu đến bằng chứng và kết luận có xác nhận |

Phần bảo hành giữ các yêu cầu 12 tháng, tiếp nhận 24/7, kiểm tra hàng tháng, khắc phục lỗi đơn giản trong 08 giờ hành chính, lỗi phức tạp trong 40 giờ hành chính và có mặt khi cần trong tối đa 12 giờ liên tục. Tổ chức trực và người phụ trách phải được Tefli phân công thực tế; hotline liên hệ công ty không tự trở thành bằng chứng đã bố trí trực. Quy trình sự cố phân biệt thời hạn sửa lỗi theo bảo hành với mục tiêu RTO của dịch vụ trọng yếu. [B0870–B0877; B0962.R024–R025]
