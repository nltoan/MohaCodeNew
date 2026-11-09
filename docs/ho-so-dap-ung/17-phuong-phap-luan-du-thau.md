# Giải pháp và phương pháp luận

## 1 Quan điểm và mục tiêu thực hiện

Nhà thầu Công ty cổ phần công nghệ Tefli Việt Nam đề xuất nâng cấp Cổng thông tin điện tử Bộ Nội vụ theo hướng thống nhất nền tảng, bảo đảm liên tục hoạt động cung cấp thông tin, thuận tiện cho công tác biên tập và đáp ứng yêu cầu tích hợp, an toàn và vận hành của Hồ sơ yêu cầu. Giải pháp bao gồm xây dựng và hoàn thiện chức năng, chuyển đổi dữ liệu, triển khai trên hạ tầng của Chủ đầu tư, kiểm thử, đào tạo, bàn giao và bảo hành.

Nhà thầu lấy yêu cầu nghiệp vụ và kết quả sử dụng làm cơ sở tổ chức thực hiện. Mỗi chức năng được xác định từ tác nhân, mục tiêu sử dụng, dữ liệu vào, quy trình xử lý, dữ liệu ra và điều kiện nghiệm thu. Trên cơ sở đó, Nhà thầu xây dựng mô hình kiến trúc, thiết kế giao diện, thiết kế dữ liệu và các dịch vụ phần mềm đồng bộ. Các sản phẩm thiết kế được thống nhất với Chủ đầu tư trước khi đưa vào xây dựng và kiểm thử.

Đối với người dân và tổ chức, hệ thống cung cấp thông tin công khai dễ tìm, dễ đọc và nhất quán giữa các trang. Đối với người biên tập, hệ thống hỗ trợ chuẩn bị nội dung, quản lý phiên bản và phối hợp kiểm duyệt theo phân công. Đối với quản trị, hệ thống cung cấp công cụ quản lý cấu hình, người dùng, quyền, nhật ký, sao lưu và cảnh báo. Việc phân định các nhóm sử dụng ngay từ bước phân tích bảo đảm giao diện và quyền hạn phù hợp từng công việc.

## 2 Nguyên tắc xây dựng phần mềm

### 2.1 Phát triển theo yêu cầu và trường hợp sử dụng

Nhà thầu lập danh mục yêu cầu thống nhất, phân nhóm thành yêu cầu chức năng, dữ liệu, tích hợp, an toàn, hiệu năng và dịch vụ triển khai. Mỗi yêu cầu có mã quản lý và được liên kết với trường hợp sử dụng, thiết kế liên quan và bộ ca kiểm thử. Khi nội dung yêu cầu được làm rõ hoặc điều chỉnh, Nhà thầu cập nhật các thành phần liên quan để không xảy ra tình trạng thiết kế, chương trình và tài liệu người dùng mô tả khác nhau.

Mỗi trường hợp sử dụng xác định tác nhân chính, điều kiện bắt đầu, trình tự nghiệp vụ, luồng thay thế, tình huống lỗi và trạng thái kết thúc. Các tình huống quyền hạn, dữ liệu không hợp lệ, mất kết nối và thao tác lặp được phân tích cùng luồng thành công. Nhờ đó, chức năng được xây dựng đầy đủ cả hành vi sử dụng thông thường và khả năng xử lý ngoại lệ trong vận hành.

### 2.2 Kiến trúc phân lớp và tính mô đun

Giải pháp phân tách lớp trình bày, lớp dịch vụ và nghiệp vụ, lớp tích hợp, lớp truy cập dữ liệu và các dịch vụ vận hành. React đảm nhiệm tương tác người dùng; SharePoint giữ vai trò nền tảng portal; .NET cung cấp API và dịch vụ; SQL Server lưu trữ dữ liệu theo thiết kế được phê duyệt. Từng phân hệ có trách nhiệm rõ ràng và giao tiếp qua các giao diện dịch vụ được quản lý.

Các chức năng tin tức, văn bản, chuyên trang, đa phương tiện, lấy ý kiến, sự kiện và quản trị dùng chung những dịch vụ cần thiết như danh tính, phân quyền, quản lý tệp và nhật ký. Sự dùng chung được kiểm soát để tránh mỗi phân hệ áp dụng một cơ chế quyền hoặc lưu tệp khác nhau. Đồng thời, ranh giới mô đun cho phép sửa lỗi, nâng cấp và mở rộng trong phạm vi ảnh hưởng xác định.

### 2.3 An toàn và bảo toàn dữ liệu ngay trong thiết kế

Nhà thầu đưa kiểm soát an toàn vào từng luồng xử lý: xác thực và phân quyền trước khi thao tác; kiểm tra đầu vào ở máy chủ; làm sạch nội dung hiển thị; bảo vệ bí mật cấu hình; kiểm soát truy cập tệp; ghi nhật ký các hành động quan trọng. Nội dung nháp, ý kiến chưa duyệt và dữ liệu cá nhân không thuộc diện công bố được tách khỏi dữ liệu trả cho khách truy cập công khai.

Các giao dịch ghi dữ liệu được thiết kế bảo đảm tính nhất quán. Hệ thống có cơ chế nhận biết cập nhật đồng thời, quản lý trạng thái công việc nền và kiểm soát tác động trùng khi xử lý lại. Việc chuyển đổi dữ liệu được thực hiện trên cơ sở mapping, đối soát, sao lưu và phương án quay lui; không đưa dữ liệu sang hệ thống mới mà thiếu khả năng truy nguyên nguồn và xác định sai khác.

### 2.4 Thiết kế giao diện nhất quán và dễ tiếp cận

Nhà thầu thống nhất các thành phần giao diện dùng chung gồm nhận diện, menu, breadcrumb, tiêu đề, biểu mẫu, thông báo, phân trang, khối nội dung và footer. Quy tắc hiển thị được áp dụng xuyên suốt cổng công khai và các chuyên trang; nội dung tiếng Việt dùng Unicode, định dạng ngày dd/mm/yyyy và thời gian 24 giờ. Giao diện bảo đảm hiển thị ở kích thước tối thiểu 1024 × 768 và tổ chức thích ứng với các kích thước thiết bị được kiểm thử.

Các thao tác chính sử dụng được bằng bàn phím, có thứ tự focus rõ ràng, nhãn trường và thông báo lỗi dễ hiểu. Ảnh nội dung có mô tả thay thế phù hợp; tương phản và cấu trúc đề mục được kiểm tra trong quá trình thiết kế. Nội dung dài, tệp và media có thông tin giúp người dùng nhận biết trước khi mở hoặc tải. Nhà thầu thực hiện các yêu cầu hỗ trợ người khuyết tật và tiêu chuẩn giao diện theo phạm vi HSYC.

## 3 Quy trình phát triển và kiểm soát chất lượng

[FIG:development-cycle]

Nhà thầu tổ chức phát triển theo các đợt công việc có sản phẩm kiểm tra được, trên nền kiến trúc thống nhất. Trong mỗi đợt, các hoạt động phân tích, thiết kế, xây dựng và kiểm thử được liên kết; phản hồi của Chủ đầu tư được ghi nhận và xử lý theo phạm vi đã thống nhất. Các công việc có thể triển khai song song được điều phối theo phụ thuộc dữ liệu, giao diện và môi trường để đáp ứng tiến độ tổng thể.

### 3.1 Khảo sát và xác định yêu cầu

Nhà thầu khảo sát cơ cấu sử dụng, quy trình biên tập, danh mục thông tin, hệ thống nguồn, hạ tầng, nền tảng SharePoint, cơ chế danh tính và các đầu mối tích hợp. Kết quả khảo sát gồm hiện trạng nghiệp vụ và môi trường, danh mục dữ liệu cần chuyển, các phụ thuộc và đặc tả yêu cầu. Nội dung khảo sát tập trung vào đầu vào phục vụ dự án, không làm thay đổi các tiêu chí bắt buộc trong HSYC.

Các buổi làm việc với nhóm biên tập, quản trị và hạ tầng được lập biên bản. Những vấn đề cần quyết định được ghi rõ nội dung, người phụ trách, thời hạn và tác động. Nhà thầu thống nhất với Chủ đầu tư danh mục màn hình, bộ dữ liệu mẫu, nhóm quyền và quy trình kiểm duyệt để làm cơ sở thiết kế chi tiết.

### 3.2 Phân tích và thiết kế

Nhà thầu lập mô hình ngữ cảnh, mô hình chức năng, mô hình trường hợp sử dụng, kiến trúc logic và vật lý, mô hình thành phần, dữ liệu, trạng thái và trình tự tương tác. Các mô hình được liên kết bằng các đối tượng nghiệp vụ thống nhất. Thiết kế giao diện thể hiện bố cục, trường nhập, trạng thái, thao tác và thông báo; thiết kế dịch vụ thể hiện dữ liệu trao đổi, quyền và cách xử lý lỗi.

Đối với tích hợp và chuyển đổi, Nhà thầu xây dựng đặc tả giao tiếp, mapping nguồn–đích, quy tắc chuẩn hóa và đối soát. Đối với vận hành, thiết kế xác định topology, tài nguyên, điểm đo, kiểm tra sức khỏe, lịch sao lưu và quy trình khôi phục. Các thiết kế được rà soát cùng nhau để bảo đảm chức năng phần mềm phù hợp năng lực và điều kiện hạ tầng.

### 3.3 Xây dựng và tích hợp

Nhà thầu xây dựng các thành phần theo thiết kế, thống nhất quy tắc phát triển, xử lý lỗi, quản lý cấu hình và ghi nhật ký. Các thay đổi được quản lý theo phiên bản và hạng mục công việc. Việc tích hợp các mô đun được thực hiện theo từng đợt, với giao diện dịch vụ và dữ liệu mẫu đã thống nhất để sớm phát hiện sai khác giữa các thành phần.

Trong quá trình xây dựng, các kiểm tra chức năng, quyền và dữ liệu được thực hiện ở cấp thành phần trước khi đưa vào thử nghiệm toàn hệ thống. Các thông tin kết nối và bí mật được quản lý theo môi trường; không đưa dữ liệu truy cập thực tế vào tài liệu công khai. Bộ cài hoặc gói triển khai gắn với phiên bản và hướng dẫn cài đặt tương ứng.

### 3.4 Kiểm thử và xử lý lỗi

Nhà thầu lập kế hoạch kiểm thử bao gồm kiểm thử chức năng, tích hợp, phân quyền, giao diện, dữ liệu chuyển đổi, hiệu năng, an toàn và khôi phục. Các ca thử có điều kiện trước, dữ liệu, bước thao tác, kết quả mong đợi và bằng chứng. Danh sách lỗi ghi mức ảnh hưởng, nguyên nhân, người xử lý, phiên bản sửa và kết quả kiểm tra lại.

Trước khi đề nghị nghiệm thu, Nhà thầu kiểm tra các luồng đầu cuối giữa cổng công khai và quản trị, giữa nội dung và tệp, giữa xuất bản và tìm kiếm, giữa sao lưu và khôi phục. Những lỗi có ảnh hưởng tới tiêu chí nghiệm thu được xử lý và kiểm tra lại. Kết quả được tổng hợp thành báo cáo để Chủ đầu tư xem xét, cùng các hồ sơ cấu hình và dữ liệu liên quan.

### 3.5 Triển khai và tiếp nhận vận hành

Triển khai chính thức thực hiện theo kế hoạch được thống nhất, gồm sao lưu, chuyển đổi cuối, cài đặt, kiểm tra nhanh, đối soát và mở dịch vụ. Người điều phối theo dõi từng bước, kết quả và điều kiện chuyển sang bước tiếp theo. Phương án quay lui xác định gói phiên bản, dữ liệu, cấu hình và trách nhiệm xử lý khi có tình huống ảnh hưởng hoạt động.

Nhà thầu đào tạo theo vai trò, bàn giao tài liệu và hướng dẫn thực hành trên những tình huống cụ thể. Công tác tiếp nhận vận hành bao gồm kiểm tra tài khoản, quyền, lịch sao lưu, trạng thái cảnh báo và danh mục đầu mối hỗ trợ. Sau nghiệm thu, Nhà thầu tổ chức bảo hành theo thời hạn và mức dịch vụ trong HSYC.

## 4 Quản lý sản phẩm và kiểm soát thay đổi

| Giai đoạn | Sản phẩm chính | Nội dung kiểm soát |
|---|---|---|
| Khảo sát | Biên bản và đặc tả yêu cầu | Đủ quy trình dữ liệu môi trường và đầu mối |
| Thiết kế | Mô hình giao diện dữ liệu tích hợp và triển khai | Nhất quán giữa chức năng quyền và cấu hình |
| Xây dựng | Các thành phần và gói triển khai | Phiên bản phạm vi thay đổi và kiểm tra thành phần |
| Kiểm thử | Bộ ca thử báo cáo và danh sách lỗi | Truy vết yêu cầu kết quả và kiểm tra lại |
| Chuyển đổi | Mapping báo cáo đối soát và biên bản | Số lượng nội dung tệp liên kết và sai khác |
| Bàn giao | Tài liệu bộ cài hướng dẫn và đào tạo | Người tiếp nhận thực hành và xác nhận đủ sản phẩm |

Nhà thầu quản lý thay đổi thông qua yêu cầu có mô tả, lý do, ảnh hưởng đến chức năng, dữ liệu, tiến độ và công tác kiểm thử. Những thay đổi thuộc phạm vi hợp đồng được phân công và cập nhật vào kế hoạch; vấn đề vượt phạm vi được tổng hợp để hai bên xem xét theo thẩm quyền. Phiên bản tài liệu và phần mềm được cập nhật đồng bộ sau khi thay đổi được thống nhất.

## 5 Bản quyền tiêu chuẩn và tính tương thích

Nhà thầu tuân thủ quyền sử dụng đối với nền tảng, thư viện và thành phần phần mềm được đưa vào giải pháp. Danh mục bàn giao thể hiện tên thành phần, phiên bản, phạm vi sử dụng, giấy phép hoặc căn cứ quyền sử dụng và trách nhiệm quản lý. Đối với nền tảng và hạ tầng do Chủ đầu tư bố trí, Nhà thầu phối hợp kiểm tra điều kiện triển khai để sử dụng đúng phạm vi được cấp.

Các tiêu chuẩn giao tiếp, dữ liệu và an toàn được đối chiếu theo HSYC và điều kiện của từng hệ thống kết nối. Nhà thầu lập bảng tương thích theo giao diện thực tế, bao gồm giao thức truyền, kiểu dữ liệu, mã hóa ký tự, xác thực, chữ ký hoặc chứng thư khi áp dụng. Việc lựa chọn giao thức tại một giao diện được thực hiện trên cơ sở yêu cầu của hai đầu kết nối và điều kiện an toàn, bảo đảm khả năng tích hợp và vận hành thống nhất.
