# 20. Giải pháp hạ tầng, kiến trúc và an toàn vận hành

## 1. Giải pháp tổng thể

Nhà thầu sẽ nâng cấp Cổng thông tin điện tử Bộ Nội vụ theo kiến trúc web tập trung, nhiều lớp, phân tách rõ giao diện công khai, quản trị nội dung, dịch vụ ứng dụng, tích hợp, dữ liệu và vận hành. Microsoft SharePoint tiếp tục là nền tảng portal theo yêu cầu; ReactJS cung cấp giao diện; .NET Web API/.NET Services đảm nhiệm nghiệp vụ mở rộng và tích hợp; Microsoft SQL Server lưu trữ dữ liệu nghiệp vụ. Nhà thầu sẽ khảo sát phiên bản, cấu hình, luồng mạng, danh tính, dữ liệu và năng lực hạ tầng trước khi chốt thiết kế triển khai.

Kiến trúc được xây dựng theo nguyên tắc phân vùng mạng, quyền tối thiểu, kiểm soát truy cập tập trung, tách cấu hình theo môi trường, ghi nhật ký, kiểm tra đầu vào, quản lý lỗi, sao lưu/phục hồi và có thể kiểm thử từng lớp. Thiết kế chi tiết, cấu hình triển khai và hồ sơ kiểm thử sẽ được phối hợp với Chủ đầu tư để nghiệm thu.

## 2. Kiến trúc logic và ranh giới thành phần

1. **Lớp truy cập và trình bày:** người dùng truy cập Cổng công khai qua HTTPS. ReactJS trình bày trang chủ, chuyên mục, tin, văn bản, đa phương tiện, sự kiện và chuyên trang trên các kích thước thiết bị được hỗ trợ. Giao diện quản trị chỉ dành cho người dùng được phân quyền và truy cập qua vùng mạng/chính sách do Chủ đầu tư phê duyệt.
2. **Lớp tiếp nhận và kiểm soát lưu lượng:** reverse proxy/cân bằng tải tiếp nhận kết nối, áp dụng chính sách TLS, định tuyến tới nút khỏe, health-check, giới hạn lưu lượng và ghi nhận truy cập. Cơ sở dữ liệu không mở trực tiếp ra vùng công khai.
3. **Lớp giao diện ReactJS:** xử lý hiển thị, tương tác, kiểm tra dữ liệu phía trình duyệt ở mức hỗ trợ người dùng và gọi API theo endpoint của từng môi trường. Giao diện không kết nối trực tiếp SQL Server hoặc đọc/ghi trực tiếp bảng nội bộ của SharePoint.
4. **Lớp portal và CMS SharePoint:** SharePoint duy trì chức năng portal/CMS theo nền tảng, quản lý nội dung, biên tập, duyệt, xuất bản, danh mục và cấu hình được thống nhất. Kết nối với dịch vụ mở rộng qua giao diện/dịch vụ được hỗ trợ. Nhà thầu xác định nguồn sở hữu từng loại nội dung, quy tắc đồng bộ và mã truy nguyên để tránh cập nhật lệch; không ghi trực tiếp vào cơ sở dữ liệu nội bộ SharePoint.
5. **Lớp dịch vụ .NET:** Web API và dịch vụ nền xử lý nghiệp vụ mở rộng, tìm kiếm/tra cứu, biểu mẫu, thông báo, xác thực và tích hợp. Mỗi API có schema, phiên bản, xác thực, phân quyền, kiểm tra dữ liệu, giới hạn kích thước, timeout và quy tắc phản hồi lỗi.
6. **Lớp dữ liệu nghiệp vụ:** Microsoft SQL Server lưu dữ liệu ứng dụng theo mô hình được duyệt. Dịch vụ chỉ truy cập qua các luồng mạng cần thiết và tài khoản quyền tối thiểu. Giao dịch sử dụng rollback phù hợp; tác vụ nền có trạng thái, mã tương quan, giới hạn retry và cơ chế chống xử lý trùng.
7. **Lớp vận hành và giám sát:** tập trung nhật ký, giám sát sức khỏe, cảnh báo, sao lưu/phục hồi, cấu hình môi trường và quy trình ứng cứu. Tách quyền quản trị ứng dụng, cơ sở dữ liệu và hạ tầng theo nhiệm vụ.

Ranh giới này giữ SharePoint làm nền tảng portal, đồng thời phân tách React, dịch vụ .NET, dữ liệu nghiệp vụ và các điểm kiểm soát tải/tích hợp/vận hành. Nhà thầu lập sơ đồ kết nối, luồng dữ liệu, ma trận port/endpoint và mô hình quyền trong thiết kế chi tiết.

## 3. Cấu hình hạ tầng tham chiếu

Nhà thầu sẽ triển khai theo cấu hình tối thiểu dưới đây, phối hợp Chủ đầu tư kiểm kê tài nguyên, bản quyền, dung lượng và điều kiện vận hành trước khi cài đặt.

| Nhóm máy chủ | Số lượng và cấu hình mỗi nút | Vai trò |
|---|---|---|
| Front-end ReactJS | 2 VM, mỗi VM 4 vCPU, 8 GB RAM, SSD hệ điều hành 100 GB | Phục vụ giao diện, đặt sau cân bằng tải. |
| .NET API/Services | 2 VM, mỗi VM 8 vCPU, 16 GB RAM, SSD 200 GB | API và dịch vụ tích hợp/nghiệp vụ. |
| Portal Core/SharePoint | 2 VM, mỗi VM 8 vCPU, 24 GB RAM, SSD 300 GB | Portal core theo nền tảng SharePoint. |
| Database HA | 2 VM, mỗi VM 8 vCPU, 32 GB RAM, SSD hệ điều hành 500 GB và dữ liệu 1,5 TB | Primary/Secondary theo phương án HA được phê duyệt. |
| Search/Index | 1 VM, 4 vCPU, 16 GB RAM, SSD hệ điều hành 100 GB và dữ liệu 500 GB | Lập chỉ mục và tìm kiếm. |
| File/Object | 2 VM, mỗi VM 4 vCPU, 8 GB RAM, SSD 100 GB; kho dùng chung 4 TB usable | Dịch vụ tệp có khả năng sẵn sàng cao. |
| Log/Monitoring | 1 VM, 4 vCPU, 16 GB RAM, SSD hệ điều hành 100 GB và dữ liệu 1 TB | Thu thập log/giám sát tập trung. |
| Backup/DR | 1 VM, 4 vCPU, 8 GB RAM, SSD 100 GB và kho backup 8 TB | Kho bản sao/DR tách vùng vận hành. |

Tổng quy mô tham chiếu là **13 VM, 76 vCPU, 216 GB RAM**, khoảng **2.700 GB OS disk và 16,5 TB dung lượng vật lý/logic** theo bảng cấu hình. Mỗi VM được yêu cầu băng thông 10 Gbps. Tầng ứng dụng gồm 6 VM, 40 vCPU và 96 GB RAM theo cấu hình sau dự phòng; tầng cơ sở dữ liệu 2 VM, 16 vCPU và 64 GB RAM. Dữ liệu cơ sở dữ liệu logic định cỡ 1,3 TB, làm tròn 1,5 TB mỗi node có nhân bản HA. Kho file 4 TB usable được tính từ 2,5 TB dữ liệu chính và dự phòng; kho backup/DR tối thiểu 8 TB.

Băng thông Internet tối thiểu **200 Mbps** theo định cỡ 500 phiên và dự phòng. Mạng nội bộ giữa ứng dụng, cơ sở dữ liệu, đồng bộ và backup là **10 Gbps**. Nội dung công khai phù hợp được ưu tiên cache/CDN theo chính sách Chủ đầu tư. Nhà thầu phối hợp xác nhận máy ảo, lưu trữ, mạng, bản quyền, vùng HA/DR, load balancer, firewall, DNS, chứng thư số và quyền vận hành.

## 4. Khả dụng cao, mở rộng và quản lý sai hỏng

Nhà thầu triển khai hai nút Front-end ReactJS, hai nút .NET API/Services và hai nút Portal Core/SharePoint sau cân bằng tải hoặc giải pháp tương đương được Chủ đầu tư chấp thuận. Các nút cùng lớp được cấu hình nhất quán. Health-check xác nhận khả năng phục vụ; cân bằng tải ngừng chuyển yêu cầu tới nút không khỏe và đưa nút trở lại sau khi kiểm tra phục hồi. Phiên và tác vụ cần tiếp tục qua nhiều nút dùng trạng thái dùng chung hoặc cơ chế không phụ thuộc bộ nhớ cục bộ của một nút.

Lớp dữ liệu dùng phương án HA/DR phù hợp năng lực, giấy phép và quy trình SQL Server do Chủ đầu tư bố trí. Thiết kế xác định topology, cơ chế chuyển vai, vùng lỗi, đồng bộ, giám sát và trách nhiệm DBA. Tài nguyên được bổ sung hoặc thay đổi sau khi đánh giá tải, dung lượng, bản quyền và phê duyệt cấu hình.

Nhà thầu cấu hình ứng dụng theo nguyên tắc cô lập lỗi: lỗi ở một dịch vụ phụ trợ không làm dừng các chức năng độc lập; áp dụng timeout và retry có giới hạn cho thao tác an toàn/idempotent; circuit breaker, hàng đợi tác vụ và graceful degradation theo nghiệp vụ. Mỗi tác vụ nền ghi trạng thái tiếp nhận/xử lý/thất bại, số lần thử, mã tương quan và người chạy lại. Nghiệm thu gồm ngắt nút, kiểm tra loại khỏi tải, phục hồi nút, lỗi kết nối phụ trợ, thử chạy lại và quay lui bản phát hành.

Độ sẵn sàng dịch vụ công khai tối thiểu **99,9% theo tháng**, không gồm bảo trì có kế hoạch đã thông báo. Nhà thầu lập kế hoạch đo, định nghĩa thời gian dịch vụ, nguồn telemetry, cách loại trừ bảo trì và báo cáo. Mỗi phiên bảo trì có kế hoạch, thời gian, người phê duyệt, ảnh hưởng dự kiến, backup trước thay đổi, checklist và phương án quay lui.

## 5. Tích hợp hệ thống và kết nối mạng

### 5.1 Active Directory và SSO

Nhà thầu tích hợp danh tính với Active Directory và SSO theo giao thức được Chủ đầu tư vận hành/phê duyệt. Danh tính được ánh xạ sang nhóm/role nghiệp vụ theo nguyên tắc quyền tối thiểu. Hai bên thống nhất vòng đời tài khoản, khóa/mở khóa, thay đổi đơn vị, thu hồi quyền và xử lý tài khoản dịch vụ. Đối tượng áp dụng xác thực hai bước sử dụng quy trình đăng ký, xác minh, OTP khi đăng nhập, tắt và reset có kiểm soát.

Kiểm thử tích hợp gồm đăng nhập thành công, từ chối, khóa, thu hồi quyền, timeout, chuyển nhóm và mất kết nối danh tính. Cấp quyền chỉ được nghiệm thu sau khi kiểm tra cả giao diện lẫn API trực tiếp.

### 5.2 LGSP, dữ liệu dùng chung và EMC

Kết nối LGSP và cơ sở dữ liệu dùng chung đi qua API Gateway/LGSP hoặc điểm tích hợp do Chủ đầu tư chỉ định. Nhà thầu lập danh mục endpoint, chủ sở hữu dữ liệu, trường trao đổi, tần suất, phương thức xác thực, quyền, giới hạn tải, timeout, retry, correlation ID và quy trình đối soát. Schema/định dạng, mã hóa ký tự và quy tắc xử lý lỗi được thống nhất với từng hệ thống đích.

EMC được đưa vào danh mục tích hợp cần khảo sát. Nhà thầu phối hợp đơn vị quản lý để xác định chức năng/luồng cụ thể, API, quyền, dữ liệu, cảnh báo và tiêu chí giám sát; kết nối qua giao thức và kênh quản trị an toàn được duyệt. Thiết kế không gán cho EMC chức năng kho nội dung/tài liệu nếu Chủ đầu tư không xác định yêu cầu đó.

### 5.3 IPv6 và tiêu chuẩn kết nối

Địa chỉ máy chủ, DNS và endpoint được tách trong cấu hình từng môi trường để hỗ trợ IPv4, IPv6 hoặc dual-stack theo hạ tầng. Nhà thầu phối hợp kiểm tra kết nối web, API, dữ liệu và tích hợp trên tuyến được phê duyệt; không tự kích hoạt cơ chế làm thay đổi luồng mạng khi chưa được Chủ đầu tư chấp thuận.

Nhà thầu lập ma trận giao thức theo từng kết nối: HTTP/HTTPS, SMTP/MIME, TCP, IPv4/IPv6; XML/UTF-8 khi hệ đích yêu cầu; các định dạng nội dung/tệp áp dụng; TLS/chứng thư, SMTPS, IPsec, XML Encryption/Signature hoặc WS-Security khi phù hợp với đối tác và chính sách. Chỉ mở port cần thiết; xác minh phiên bản, cipher, chứng thư, quyền và tính tương thích trước tích hợp.

| Nhóm giao thức/định dạng | Cách áp dụng | Bằng chứng nghiệm thu |
|---|---|---|
| HTTP v1.1, SMTP/MIME, TCP, IPv4/IPv6 | HTTP/HTTPS cho giao diện/API; SMTP/MIME cho thư; TCP và IPv4/IPv6 theo mạng được cấp. Luồng/port chỉ mở theo danh mục đã duyệt. | Sơ đồ kết nối, danh sách endpoint/port, kiểm tra TLS/mail relay và kết nối từ môi trường triển khai. |
| XML, UTF-8 | Sử dụng schema/định dạng theo thỏa thuận với hệ đích; bảo đảm UTF-8 và quy tắc tiếng Việt trong trao đổi. | Schema mẫu, dữ liệu vào/ra, kiểm thử ký tự tiếng Việt và phản hồi lỗi schema. |
| HTML, CSS/XSL, ảnh JPEG/GIF/TIFF/PNG, ASCII, TCVN 6909:2001, ZIP/GZIP | Đối chiếu định dạng với chức năng và hệ thống trao đổi; bảo toàn Unicode/nội dung và media cần chuyển đổi; thống nhất trường hợp nén/giải nén. | Danh mục định dạng áp dụng, kiểm tra trình duyệt, hiển thị tiếng Việt, tải/mở tệp và mẫu chuyển đổi. |
| IPsec/IP ESP, XML Encryption/Signature, SMTPS, WS-Security v1.1 | Chọn cơ chế theo từng kênh, yêu cầu đối tác và cấu hình hạ tầng; TLS/chứng thư cho kênh web theo thiết kế được duyệt. | Ma trận chuẩn–kênh–endpoint, cấu hình đã che bí mật, kiểm chứng chứng thư/chữ ký và kết quả tương thích. |

Nhà thầu lập ma trận giao thức–điểm cuối–chủ sở hữu–quyền–timeout–mã hóa–định dạng–xử lý lỗi. Nếu một chuẩn không tương thích với đầu cuối, hai bên thống nhất phương án chuyển đổi hoặc cơ chế tương đương trước khi cấu hình; không tự mở kết nối ngoài danh mục.

## 6. An toàn thông tin

Nhà thầu triển khai ma trận kiểm soát an toàn cho các nhóm xác thực, phân quyền, nhật ký, ứng dụng, truyền thông và sao lưu/phục hồi theo yêu cầu cấp độ 3. Ma trận liên kết yêu cầu, thành phần, biện pháp cấu hình, vai trò vận hành, ca kiểm thử và bằng chứng.

### 6.1 Xác thực và quản lý tài khoản

Nhà thầu triển khai giao diện và quy trình quản lý tài khoản, mật khẩu, trạng thái, khóa/mở khóa và xác thực quản trị theo chính sách Chủ đầu tư. Thông tin mật khẩu được lưu dưới dạng hash an toàn; chính sách xác định mật khẩu khởi tạo, độ dài/loại ký tự, tuổi/hết hạn, đổi mật khẩu, mở khóa, giới hạn đăng nhập sai, cảnh báo và ngăn đăng nhập tự động. Thông tin xác thực được bảo vệ khi truyền. 2FA Authenticator áp dụng cho đối tượng/quy trình được phê duyệt; secret được bảo vệ, OTP bị giới hạn thử và không ghi vào log.

### 6.2 Kiểm soát truy cập

Nhà thầu thiết lập timeout phiên, yêu cầu xác thực lại khi hết hạn và ma trận role–permission. Tối thiểu phân biệt ba nhóm: người dùng thông thường; quản trị mức sử dụng; quản trị mức phát triển/vận hành. Quyền được cấp tối thiểu theo nhiệm vụ và tách nội dung với quản trị hạ tầng/cơ sở dữ liệu. Mỗi thao tác đọc/tạo/sửa/xóa/duyệt/cấu hình được kiểm tra ở máy chủ, không chỉ ẩn chức năng trên giao diện.

Kiểm thử gồm quyền đúng/sai, truy cập endpoint trực tiếp, tài khoản khóa/thu hồi, chuyển vai trò, truy cập chéo chuyên mục và hết hạn phiên. Kết quả ghi response, nhật ký và trạng thái dữ liệu.

### 6.3 Nhật ký và giám sát

Nhà thầu thu thập nhật ký truy cập, đăng nhập quản trị, lỗi, quản lý tài khoản và thay đổi cấu hình; tập trung quản lý và thiết lập thời gian lưu được Chủ đầu tư duyệt. Mỗi sự kiện có thời điểm đồng bộ, loại, actor, đối tượng, thao tác, kết quả, mức độ và correlation ID phù hợp. Nhật ký giới hạn quyền đọc, bảo vệ khỏi sửa/xóa trái quyền và không ghi password, OTP, secret, token hoặc nội dung nhạy cảm không cần thiết. Cảnh báo gắn với đầu mối và quy trình phản hồi.

### 6.4 An toàn ứng dụng, mã nguồn và dữ liệu

Nhà thầu kiểm tra dữ liệu đầu vào, kiểm soát lỗi để chỉ trả thông báo phù hợp, quản lý bí mật ngoài gói phát hành và rà soát các nhóm rủi ro SQL injection, OS command injection, RFI/LFI, XPath injection, XSS, CSRF và các rủi ro web liên quan trong phạm vi. Thực hiện đánh giá/kiểm thử an toàn theo kế hoạch, ghi phạm vi, phiên bản, phát hiện, mức độ, khắc phục và kiểm tra lại.

Dữ liệu lưu trữ, tệp và bản sao được phân quyền, mã hóa theo chính sách áp dụng, truyền qua kênh an toàn và xử lý theo mục đích hợp đồng. Quyền truy cập từ xa được kiểm soát; thao tác quản trị và thay đổi cấu hình có audit. Tệp upload được kiểm tra loại/kích thước và xử lý an toàn trước công khai.

### 6.5 Bảo mật liên lạc và chữ ký số

Nhà thầu cấu hình TLS/chứng thư theo hạ tầng và chính sách Chủ đầu tư; kiểm tra thời hạn, chuỗi tin cậy và quy trình gia hạn. Với trao đổi cần chữ ký số, xác định dữ liệu ký, bên ký, quy trình ký/xác minh, chứng thư và quản lý khóa. IPsec, XML Encryption/Signature, SMTPS hoặc WS-Security chỉ áp dụng trên kênh tương ứng khi hệ thống đối tác hỗ trợ và hai bên phê duyệt cấu hình.

## 7. Sao lưu, phục hồi và khôi phục thảm họa

Nhà thầu xây dựng chính sách backup nhất quán cho cơ sở dữ liệu, cấu hình portal/API, cấu hình tích hợp và tệp/nội dung thuộc phạm vi. DBA và Chủ đầu tư phê duyệt loại full/differential/log hoặc phương pháp tương đương, lịch, retention, vị trí, mã hóa, quyền, vùng lưu và người nhận cảnh báo. Bản sao được lưu tách biệt theo vùng/thiết bị được phép và kiểm tra tính toàn vẹn.

Lịch sao lưu phải đáp ứng **RPO không quá 04 giờ**. Runbook phục hồi xác định thứ tự phụ thuộc, người phê duyệt, vai trò DBA, kiểm tra dữ liệu, phục hồi tệp/cấu hình, chuyển dịch vụ và phương án quay lại. Mục tiêu **RTO không quá 04 giờ** đối với dịch vụ trọng yếu. Nhà thầu phối hợp diễn tập ít nhất một tình huống khôi phục trước nghiệm thu; biên bản ghi mốc sự cố, điểm dữ liệu, thời gian phục hồi, chức năng xác nhận, sai lệch và hành động khắc phục. Chỉ số được xác nhận bằng số đo diễn tập.

Backup dùng cho rollback trước thay đổi cũng được kiểm tra khả năng đọc/khôi phục theo thủ tục. Quyền tạo, xem, tải, xóa và restore được tách; file nhạy cảm mã hóa khi lưu/truyền, không đặt trong thư mục công khai. Tác vụ lỗi có trạng thái, retry hữu hạn, mã tương quan và cảnh báo; không xóa bản cuối cùng có thể phục hồi theo retention được duyệt.

## 8. Hiệu năng, giao diện và khả năng tiếp cận

Nhà thầu kiểm thử tải tối thiểu **500 phiên truy cập công khai đồng thời** và **84 phiên tác vụ động/người dùng hoạt động đồng thời**, với trang chủ, tìm kiếm, xem tin/văn bản, tải tệp và thao tác quản trị. Kết quả được ghi theo hành vi, tốc độ tăng tải, thời gian duy trì, điều kiện mạng, lỗi, throughput và tài nguyên từng nút.

Ngưỡng kiểm thử: thời gian phản hồi tác vụ thông thường trung bình **dưới 2,5 giây**, chậm nhất **dưới 30 giây**; tương tác trực tiếp **không quá 0,6 giây khi điều kiện mạng và tải cho phép**; CPU trung bình từng nút **không quá 75%**, không có swap kéo dài và còn **ít nhất 25% dư địa**. Tác vụ dài hiển thị trạng thái xử lý. Báo cáo nêu rõ tải thực đạt và ngoại lệ do điều kiện mạng.

Giao diện hỗ trợ độ phân giải tối thiểu **1024×768**, tiếng Việt Unicode, ngày `dd/mm/yyyy`, giờ 24h `hh:mm:ss`, thông báo lỗi và trạng thái thành công/thất bại khi thêm/sửa/xóa. Nhà thầu kiểm tra nhãn biểu mẫu, điều hướng bàn phím, thứ tự focus, mô tả ảnh, cấu trúc nội dung và tương phản theo yêu cầu áp dụng.

## 9. Kiểm thử kiến trúc và hồ sơ bàn giao

Nhà thầu lập kịch bản nghiệm thu theo lớp và yêu cầu: kết nối, phiên bản, tải, failover, lỗi phụ thuộc, phân quyền, nhật ký, xác thực, dữ liệu, giao thức, backup/restore, IPv6 và an toàn ứng dụng. Mỗi kịch bản nêu điều kiện trước, dữ liệu, bước chạy, kết quả mong đợi/thực tế, người chứng kiến và bằng chứng.

| Nhóm kiểm thử | Nội dung xác nhận | Hồ sơ nghiệm thu |
|---|---|---|
| Kiến trúc và kết nối | Thành phần đúng vai trò; mạng/port/endpoint khớp thiết kế; API và tích hợp trao đổi đúng schema. | Sơ đồ as-built, danh mục thành phần, ma trận endpoint/port và kết quả kết nối. |
| HA và phục hồi nút | Nút lỗi bị loại khỏi tải; các nút còn lại tiếp tục phục vụ; nút được đưa lại sau health-check; chuyển vai DB theo phương án. | Nhật ký thời điểm, health-check, lưu lượng trước/sau và biên bản failover/rollback. |
| An toàn thông tin | Phân quyền đúng/sai, timeout, xác thực, logging không lộ bí mật, kiểm tra ứng dụng và truyền tin. | Ma trận role, log đã khử bí mật, kết quả kiểm thử/pentest và khắc phục. |
| Hiệu năng và tải | 500 phiên công khai, 84 phiên động, ngưỡng phản hồi/tài nguyên; ghi điều kiện mạng và ngoại lệ. | Kịch bản, dữ liệu tải, telemetry theo nút, báo cáo độ trễ/throughput/lỗi. |
| Backup/DR | Tính toàn vẹn, khôi phục DB/tệp/cấu hình, thời gian và điểm dữ liệu. | Manifest backup, biên bản restore, số đo RPO/RTO và hành động khắc phục. |
| Vận hành | Giám sát sức khỏe, cảnh báo, quy trình sự cố, cấu hình và quay lui. | Runbook, danh sách người nhận, trạng thái cảnh báo và biên bản diễn tập. |

Hồ sơ bàn giao gồm sơ đồ logic/vật lý, ma trận luồng mạng/port, danh sách thành phần/phiên bản, cấu hình đã loại bỏ bí mật, ma trận quyền, hợp đồng API, thiết kế dữ liệu, runbook cài đặt/triển khai/quay lui, runbook giám sát/sự cố, chính sách backup/restore, kết quả kiểm thử tải/ATTT/diễn tập và biên bản xác nhận. Nhà thầu phối hợp cập nhật as-built theo cấu hình thực tế sau triển khai.
