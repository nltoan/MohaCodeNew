# Mô hình phần mềm và thiết kế hệ thống

## 1 Mô hình ngữ cảnh và các đối tượng tham gia

[FIG:context-model]

Cổng thông tin điện tử là đầu mối tiếp nhận và cung cấp thông tin giữa cơ quan quản lý nội dung với người dân, tổ chức và các hệ thống liên quan. Người dùng công khai tra cứu, xem tin, xem văn bản, khai thác đa phương tiện, theo dõi sự kiện và gửi ý kiến đối với dự thảo. Nhóm biên tập chuẩn bị và cập nhật nội dung; nhóm phê duyệt và xuất bản kiểm soát thông tin trước khi công khai. Quản trị hệ thống quản lý tài khoản, cấu hình, giám sát và sao lưu theo quyền được phân công.

Nhà thầu thiết lập các luồng tích hợp với hệ thống danh tính, LGSP và EMC theo phạm vi HSYC, đặc tả và đầu mối do Chủ đầu tư cung cấp. Dữ liệu từ hệ thống nguồn phục vụ chuyển đổi được tiếp nhận qua quy trình có đối soát. Mỗi luồng ra hoặc vào hệ thống được xác định mục đích, chủ sở hữu, dữ liệu trao đổi và yêu cầu bảo vệ; không mở rộng quyền truy cập vượt nhu cầu nghiệp vụ.

| Đối tượng | Trách nhiệm trong hệ thống | Phạm vi tương tác |
|---|---|---|
| Người dân và tổ chức | Khai thác thông tin và góp ý dự thảo | Nội dung công khai và biểu mẫu được cung cấp |
| Người soạn và biên tập | Tạo sửa phân loại và gửi nội dung | Chuyên mục đơn vị hoặc chuyên trang được giao |
| Người duyệt và xuất bản | Kiểm tra phê duyệt công bố và gỡ | Đúng bước quy trình và phạm vi được phân công |
| Quản trị nội dung | Quản lý danh mục bố cục liên kết và cấu hình nội dung | Cấu hình nghiệp vụ theo quyền |
| Quản trị kỹ thuật | Quản lý danh tính cấu hình nhật ký sao lưu cảnh báo | Chức năng vận hành được phân công |
| Hệ thống kết nối | Xác thực trao đổi dữ liệu hoặc giám sát | Giao diện và dữ liệu đã được thống nhất |

## 2 Mô hình phân rã chức năng

[FIG:function-tree]

Nhà thầu tổ chức phần mềm thành sáu nhóm chức năng liên kết. Nhóm cung cấp thông tin công khai hiển thị nội dung theo trạng thái và ngôn ngữ. Nhóm quản trị nội dung thực hiện quy trình từ tạo lập đến phát hành. Nhóm chuyên trang quản lý nhận diện, cấu hình và dữ liệu của Chuyên trang Bộ trưởng và Đảng bộ Bộ Nội vụ. Nhóm chuyển đổi dữ liệu xử lý các miền nội dung và đường dẫn. Nhóm an toàn và vận hành cung cấp xác thực hai bước, QR, sao lưu và cảnh báo. Nhóm dịch vụ dùng chung quản lý danh mục, tệp, tìm kiếm, quyền và nhật ký.

Phân rã trên là cách tổ chức thiết kế để triển khai đủ 29 hạng mục chức năng. Các nhóm có thể dùng chung thành phần kỹ thuật nhưng phải giữ ranh giới nghiệp vụ. Ví dụ, văn bản dùng chung dịch vụ tệp với tin tức nhưng có trường số ký hiệu, hiệu lực và quan hệ văn bản riêng; trang Đảng bộ có phạm vi cấu hình và nội dung riêng, không bị đồng nhất với một chuyên mục khác. Danh mục chức năng chi tiết và trường hợp sử dụng được trình bày trong các phần tiếp theo.

## 3 Mô hình trường hợp sử dụng

[FIG:usecase-model]

Mô hình trường hợp sử dụng xác định tác nhân nào thực hiện nghiệp vụ nào. Khách truy cập khai thác nội dung và gửi ý kiến; người soạn quản lý bản nháp và gửi duyệt; người duyệt xử lý hồ sơ được giao; người xuất bản đưa thông tin ra cổng hoặc gỡ theo thẩm quyền; người quản trị quản lý cấu hình, người dùng và vận hành. Những vai trò có thể được bố trí kiêm nhiệm theo tổ chức thực tế, nhưng hệ thống vẫn kiểm soát từng quyền hành động.

Các nghiệp vụ quản trị yêu cầu xác thực trước khi sử dụng. Kiểm tra quyền được thực hiện ở phía máy chủ, bao gồm quyền thao tác và phạm vi đối tượng. Nghiệp vụ xuất bản có điều kiện nội dung đã hoàn thành quy trình phê duyệt. Nghiệp vụ phục hồi dữ liệu được thực hiện theo quy trình vận hành riêng để tránh nhầm lẫn với quyền tải bản sao. Các bảng UC01 đến UC29 trong phần chức năng là cơ sở đặc tả và kiểm thử từng nghiệp vụ.

## 4 Mô hình kiến trúc logic và thành phần phần mềm

[FIG:component-model]

Lớp trình bày cung cấp cổng công khai và giao diện quản trị bằng React. Các thành phần trình bày sử dụng các dịch vụ nghiệp vụ qua API và hiển thị trạng thái xử lý cho người dùng. Lớp này không quyết định quyền truy cập cuối cùng, không truy cập trực tiếp cơ sở dữ liệu và không quản lý bí mật kết nối đến hệ thống bên ngoài.

Lớp dịch vụ .NET thực hiện các kiểm tra chung gồm xác thực, phân quyền, dữ liệu đầu vào, phân trang, xử lý lỗi và nhật ký. Các dịch vụ nghiệp vụ chuyên trách xử lý tin tức, văn bản, đa phương tiện, dự thảo, sự kiện, chuyên trang và quản trị. Các quy tắc chuyển trạng thái và quyền được tổ chức nhất quán để hành vi từ các màn hình khác nhau vẫn tuân thủ cùng chính sách nghiệp vụ.

Lớp portal SharePoint cung cấp nền tảng và các năng lực quản lý nội dung được phân công trong thiết kế chi tiết. Dịch vụ tích hợp trao đổi với SharePoint qua giao diện được hỗ trợ. Dữ liệu do SharePoint quản lý được truy cập theo cơ chế nền tảng; dữ liệu nghiệp vụ mở rộng sử dụng cơ chế truy cập SQL Server tương ứng. Nhà thầu xác định rõ nguồn dữ liệu chính thức và các luồng đồng bộ để tránh ghi trùng hoặc phân kỳ nội dung.

Các dịch vụ dùng chung gồm quản lý tệp, chỉ mục tìm kiếm, nhật ký, công việc nền, sao lưu và cảnh báo. Công việc đồng bộ chỉ mục hoặc gửi thông báo được quản lý theo trạng thái, có khả năng xử lý lại và kiểm soát trùng. Khi một dịch vụ phụ trợ gặp lỗi, hệ thống cô lập phạm vi ảnh hưởng và thông báo phù hợp, bảo đảm các chức năng độc lập tiếp tục hoạt động theo thiết kế.

| Thành phần | Trách nhiệm | Giao diện chính |
|---|---|---|
| Giao diện công khai | Trình bày và tra cứu thông tin | API công khai và tài nguyên được phép |
| Giao diện quản trị | Biên tập duyệt và vận hành theo vai trò | API có xác thực và kiểm quyền |
| Dịch vụ nghiệp vụ | Quy tắc dữ liệu giao dịch và chuyển trạng thái | Hợp đồng nghiệp vụ theo từng phân hệ |
| Dịch vụ tích hợp | Trao đổi với SharePoint danh tính LGSP EMC | Giao thức và đặc tả kết nối được duyệt |
| Dịch vụ dùng chung | Tệp tìm kiếm nhật ký công việc nền | Các giao diện nội bộ có quyền kiểm soát |
| Lớp dữ liệu | Lưu trữ nhất quán và truy xuất theo quyền | Truy vấn và giao diện nền tảng được hỗ trợ |

## 5 Mô hình triển khai vật lý

[FIG:deployment-model]

Nhà thầu triển khai giải pháp trên cấu hình 13 máy chủ ảo theo HSYC, tổng 76 vCPU và 216 GB RAM. Tầng giao diện gồm hai nút FE, tầng dịch vụ gồm hai nút API và tầng Portal gồm hai nút SharePoint. Hai nút cơ sở dữ liệu được cấu hình theo phương án HA phù hợp nền tảng và giấy phép được cấp. Các thành phần tìm kiếm, kho tệp, nhật ký và sao lưu được bố trí theo vai trò và tài nguyên quy định.

Cấu hình cân bằng tải và kiểm tra sức khỏe điều phối yêu cầu đến nút sẵn sàng. Các nút cùng tầng được triển khai phiên bản thống nhất; phiên, khóa bảo vệ và tham chiếu tệp được tổ chức để không làm mất hoạt động khi yêu cầu chuyển sang nút khác. Mạng nội bộ 10 Gbps phục vụ luồng ứng dụng, đồng bộ dữ liệu và sao lưu; kết nối Internet tối thiểu 200 Mbps phục vụ truy cập công khai theo HSYC.

Kho tệp cung cấp dung lượng dùng được 4 TB và kho sao lưu 8 TB. Cơ chế quản lý tệp kiểm tra quyền truy cập theo nghiệp vụ, đồng thời hỗ trợ các nút ứng dụng cùng sử dụng tài nguyên cần thiết. Khu vực sao lưu được bảo vệ bằng quyền riêng và chính sách truy cập; quy trình khôi phục được kiểm thử với dữ liệu và cấu hình tương ứng. Bảng định cỡ chi tiết ở phần giải pháp hạ tầng là cơ sở đối chiếu khi triển khai và bàn giao.

## 6 Mô hình dữ liệu nghiệp vụ

[FIG:entity-model]

Nhà thầu thiết kế các đối tượng nghiệp vụ theo định danh ổn định và quan hệ được kiểm soát. Đối tượng nội dung gồm thông tin chung như tiêu đề, ngôn ngữ, chuyên trang, trạng thái và phiên bản; các loại tin, văn bản, dự thảo, sự kiện và album bổ sung thuộc tính riêng. Đối tượng chuyên mục tổ chức phân cấp và liên kết với nội dung qua quan hệ được xác định trong thiết kế dữ liệu.

Mỗi nội dung có thể có nhiều phiên bản và nhiều tệp. Lịch sử duyệt tham chiếu đúng nội dung và phiên bản được xử lý, cùng người thực hiện, hành động, ý kiến và thời điểm. Một tài khoản được phân công các vai trò; mỗi vai trò mang các quyền và phạm vi áp dụng. Những quan hệ này là cơ sở thực thi các giới hạn sử dụng, xử lý cập nhật đồng thời và truy nguyên thay đổi.

| Quan hệ | Số lượng logic | Quy tắc bảo toàn |
|---|---|---|
| Chuyên trang với nội dung | Một chuyên trang có nhiều nội dung | Nội dung phải thuộc phạm vi hiển thị được quản lý |
| Nội dung với phiên bản | Một nội dung có nhiều phiên bản | Phiên bản công bố và phiên bản đang sửa được xác định rõ |
| Nội dung với chuyên mục | Nhiều với nhiều theo phạm vi thiết kế | Có chuyên mục chính nếu nghiệp vụ yêu cầu và không tạo tham chiếu lỗi |
| Nội dung với tệp | Nhiều với nhiều qua quan hệ đính kèm | Kiểm soát quyền và không xóa tệp còn được sử dụng |
| Phiên bản với lịch sử duyệt | Một phiên bản có nhiều hành động | Hành động gắn người thời điểm và bước xử lý |
| Tài khoản với vai trò | Nhiều với nhiều | Quyền hiệu lực phụ thuộc vai trò phạm vi và trạng thái tài khoản |
| Dự thảo với ý kiến | Một dự thảo có nhiều ý kiến | Chỉ nhận theo thời hạn và công khai sau kiểm duyệt theo chính sách |

Từ điển dữ liệu chi tiết xác định tên trường, ý nghĩa, kiểu, miền giá trị, bắt buộc, quan hệ và quy tắc kiểm tra. Các thuộc tính như ngày, thời gian, ngôn ngữ và trạng thái được quy ước thống nhất giữa giao diện, API và lưu trữ. Dữ liệu chuyển đổi giữ khóa truy nguyên và lần chạy để phục vụ đối soát nguồn–đích.

## 7 Mô hình trạng thái nội dung

[FIG:state-model]

Nội dung bắt đầu ở trạng thái nháp. Người soạn lưu và gửi duyệt khi đủ thông tin; hệ thống chuyển sang chờ duyệt và xác định người hoặc nhóm xử lý. Người duyệt có thể trả lại kèm lý do hoặc phê duyệt đúng phiên bản. Nội dung đã duyệt được người có quyền xuất bản đưa ra cổng theo thời điểm công bố. Việc gỡ khỏi cổng chuyển nội dung sang trạng thái ngừng công khai và giữ lịch sử.

Nhà thầu kiểm soát các chuyển trạng thái hợp lệ ở máy chủ. Người dùng không thể thay đổi trực tiếp trạng thái để bỏ qua bước duyệt. Sửa nội dung sau phê duyệt được quản lý theo phiên bản và yêu cầu duyệt lại theo quy tắc nghiệp vụ; các bước duyệt cũ không tự có hiệu lực đối với nội dung đã thay đổi. Tại mọi thời điểm, đầu ra công khai được xác định từ phiên bản có quyền công bố.

| Chuyển trạng thái | Chủ thể | Điều kiện | Kết quả ghi nhận |
|---|---|---|---|
| Nháp sang chờ duyệt | Người soạn | Đủ dữ liệu và đúng phạm vi | Phiên bản gửi người nhận thời điểm |
| Chờ duyệt sang trả lại | Người duyệt | Được giao bước hiện tại và có lý do | Ý kiến xử lý người nhận lại |
| Trả lại sang chờ duyệt | Người soạn | Đã sửa và gửi lại | Phiên bản mới và lịch sử liên quan |
| Chờ duyệt sang đã duyệt | Người duyệt | Đủ các bước và đúng phiên bản | Người duyệt thời điểm và kết quả |
| Đã duyệt sang công khai | Người xuất bản | Đúng quyền và thời điểm phát hành | Phiên bản công khai và tác vụ đồng bộ |
| Công khai sang ngừng công khai | Người được phân quyền | Có quyết định hoặc lý do gỡ | Lịch sử gỡ và cập nhật đầu ra liên quan |

## 8 Mô hình trình tự xử lý

[FIG:sequence-model]

Luồng xuất bản minh họa sự phối hợp giữa giao diện, API, nghiệp vụ, lưu trữ và tìm kiếm. Người dùng gửi yêu cầu với định danh nội dung và phiên bản. API xác thực và kiểm quyền trước khi gọi nghiệp vụ; nghiệp vụ kiểm tra trạng thái duyệt và điều kiện xuất bản. Khi hợp lệ, hệ thống ghi giao dịch gồm trạng thái công khai và thông tin cần xử lý tiếp; sau khi giao dịch hoàn thành, phản hồi trả cho người dùng.

Tác vụ cập nhật chỉ mục được xử lý có trạng thái riêng. Nếu tìm kiếm tạm thời không sẵn sàng, công việc được ghi nhận để thử lại và cảnh báo, không nhân bản thao tác xuất bản. Đối với yêu cầu gửi lại do mạng chậm, hệ thống kiểm tra trạng thái hiện hành và mã tương quan để tránh tạo nhiều lần tác động. Nhật ký cho phép đối chiếu từ thao tác trên giao diện tới kết quả nghiệp vụ và công việc nền.

Luồng xem nội dung thực hiện kiểm tra quyền công bố tại nguồn trả dữ liệu. Luồng lưu nháp thực hiện kiểm tra đầu vào và phiên bản để phát hiện sửa đồng thời. Luồng góp ý kiểm tra thời hạn dự thảo, dữ liệu nhập và biện pháp chống spam trước khi lưu trạng thái chờ xử lý. Các trình tự này được triển khai đồng bộ với mô hình trạng thái và các quy tắc ở từng chức năng.

## 9 Mô hình hoạt động và kiểm soát ngoại lệ

[FIG:activity-model]

Hoạt động nghiệp vụ được thiết kế với các điểm quyết định rõ ràng. Với tiếp nhận ý kiến, nếu dự thảo hết hạn thì hệ thống ngừng nhận và thông báo; nếu dữ liệu không hợp lệ thì chỉ ra trường cần sửa, giữ dữ liệu phù hợp; nếu hợp lệ thì lưu ý kiến chờ duyệt và thông báo tiếp nhận. Người kiểm duyệt xử lý riêng việc cho phép công khai, tránh đưa nội dung người dùng gửi trực tiếp ra cổng.

Đối với các thao tác quan trọng khác, Nhà thầu áp dụng cùng nguyên tắc phân nhánh theo điều kiện, kết quả và khả năng phục hồi: không có quyền thì từ chối; dữ liệu xung đột thì yêu cầu đối chiếu; phụ thuộc lỗi thì ghi nhận trạng thái và xử lý theo chính sách chạy lại; giao dịch thất bại thì quay lui các thay đổi cần nhất quán. Thông báo cho người dùng có nội dung phù hợp nghiệp vụ, trong khi chi tiết kỹ thuật được lưu trong nhật ký nội bộ có phân quyền.

## 10 Liên kết các mô hình với xây dựng và nghiệm thu

Nhà thầu sử dụng các mô hình như một bộ thiết kế thống nhất. Tác nhân trong mô hình ngữ cảnh được chuyển thành vai trò trong trường hợp sử dụng; chức năng được phân công cho thành phần phần mềm; dữ liệu và trạng thái được xử lý trong các trình tự; thành phần được bố trí trên mô hình triển khai vật lý. Các yêu cầu về hiệu năng, an toàn và khôi phục được gắn với các thành phần và phép kiểm tra tương ứng.

Khi triển khai chi tiết, Nhà thầu hoàn thiện đặc tả trường, giao diện dịch vụ, cấu hình và kịch bản kiểm thử trên cơ sở các mô hình nêu trên. Kết quả nghiệm thu được tổ chức theo từng chức năng và luồng đầu cuối, đồng thời kiểm tra các chỉ tiêu vận hành chung. Việc bàn giao bao gồm các sơ đồ hoàn công phù hợp cấu hình thực tế để Chủ đầu tư tiếp nhận quản trị, bảo trì và mở rộng hệ thống.
