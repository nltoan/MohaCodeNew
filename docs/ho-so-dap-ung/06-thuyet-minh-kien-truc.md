# 06. Thuyết minh kiến trúc, an toàn thông tin và vận hành

## 1. Quan điểm và cam kết phương án

Tefli đề xuất nâng cấp Cổng thông tin điện tử Bộ Nội vụ theo kiến trúc ứng dụng web tập trung, nhiều lớp, kế thừa nền tảng portal hiện hữu và tách rõ trách nhiệm giữa giao diện công khai, quản trị nội dung, dịch vụ ứng dụng, tích hợp, dữ liệu và vận hành. Phương án bám định hướng HSYC: SharePoint tiếp tục giữ vai trò nền tảng portal; ReactJS cung cấp giao diện hiện đại; .NET Web API/.NET Services đảm nhiệm dịch vụ ứng dụng mở rộng, tích hợp và nghiệp vụ; Microsoft SQL Server là nền tảng dữ liệu [B0721–B0730]. Tefli sẽ triển khai theo các ranh giới và kiểm soát dưới đây, lập cấu hình/as-built cùng hồ sơ kiểm thử để Chủ đầu tư nghiệm thu.

Các chỉ tiêu 99,9%, RPO/RTO không quá 04 giờ và yêu cầu an toàn cấp độ 3 được xem là mục tiêu/yêu cầu hợp đồng phải được cấu hình, thử nghiệm và xác nhận. Thuyết minh này không coi các chỉ tiêu đó là kết quả đã đạt trước khi triển khai trên hạ tầng được cấp và hoàn thành kiểm chứng [B0751–B0756; B0798–B0802].

## 2. Kiến trúc logic và ranh giới thành phần

Kiến trúc được tổ chức thành các lớp sau:

1. **Lớp truy cập và trình bày:** người dùng truy cập Cổng công khai qua HTTPS; ReactJS hiển thị trang chủ, chuyên mục, chi tiết, văn bản, đa phương tiện, sự kiện và chuyên trang. Giao diện quản trị nội dung chỉ được cung cấp cho nhóm người dùng được phép, qua vùng mạng và chính sách truy cập do Chủ đầu tư phê duyệt.
2. **Lớp kiểm soát truy cập:** reverse proxy/cân bằng tải và các kiểm soát mạng hiện hữu tiếp nhận lưu lượng, định tuyến tới nút khỏe, ghi nhận truy cập và giới hạn luồng theo cấu hình. Máy chủ dữ liệu không mở trực tiếp ra vùng công khai.
3. **Lớp trình bày React:** React đảm nhiệm tương tác và giao diện đa thiết bị, gọi API qua các endpoint được cấu hình theo môi trường. React không kết nối trực tiếp SQL Server hoặc đọc/ghi trực tiếp cơ sở dữ liệu SharePoint.
4. **Lớp portal và CMS SharePoint:** SharePoint tiếp tục là nền tảng portal theo HSYC, giữ vai trò nền tảng quản trị/portal core và các cấu phần nội dung được xác nhận trong thiết kế chi tiết. CMS xử lý biên tập, kiểm duyệt, xuất bản, danh mục và cấu hình nội dung theo quy trình. Tích hợp với SharePoint qua dịch vụ/giao diện được hỗ trợ và được Chủ đầu tư chấp thuận; không truy cập trực tiếp DB nội bộ SharePoint bằng SQL hoặc ghi thẳng vào các bảng hệ thống. Tefli sẽ lập bản đồ dữ liệu chuẩn, xác định nguồn sở hữu từng loại nội dung và luồng đồng bộ để tránh cập nhật lệch giữa portal và các dịch vụ mở rộng.
5. **Lớp dịch vụ .NET:** .NET Web API/.NET Services mở rộng nghiệp vụ, tìm kiếm/tra cứu, thông báo, góp ý, cảnh báo, xác thực và tích hợp ngoài; mọi thao tác đi qua xác thực, phân quyền, kiểm tra dữ liệu, kiểm soát lỗi và nhật ký. Hợp đồng API quy định schema, phiên bản, timeout, giới hạn tải và cơ chế xử lý lỗi.
6. **Lớp dữ liệu nghiệp vụ:** Microsoft SQL Server lưu dữ liệu ứng dụng theo mô hình được duyệt. Dịch vụ chỉ truy cập qua luồng mạng cần thiết và tài khoản quyền tối thiểu; giao dịch có rollback phù hợp, tác vụ nền có trạng thái và mã tương quan để chạy lại an toàn, tránh xử lý trùng [B0755]. Cơ sở dữ liệu SharePoint do nền tảng quản lý, không phải kho dữ liệu để API tùy ý truy vấn/ghi trực tiếp.
7. **Lớp vận hành:** nhật ký tập trung, giám sát sức khỏe, cảnh báo, sao lưu/phục hồi và quản lý cấu hình được triển khai theo chính sách hạ tầng của Bộ. Cấu hình môi trường và thông tin xác thực được quản lý ngoài mã nguồn; quyền quản trị được tách theo nhiệm vụ.

Ranh giới này kế thừa SharePoint làm nền tảng portal, đồng thời tách giao diện React, dịch vụ .NET, dữ liệu nghiệp vụ và các điểm kiểm soát tải/tích hợp/vận hành như HSYC định hướng [B0722–B0728]. Thiết kế chi tiết sẽ chốt sau khảo sát phiên bản SharePoint/SQL Server, mô hình danh tính, dữ liệu, luồng mạng và năng lực hạ tầng Trung tâm Tích hợp dữ liệu.
### 2.1. Cấu hình tham chiếu và điều kiện hạ tầng

Tefli lấy cấu hình tối thiểu HSYC làm baseline khảo sát/triển khai, sau đó đo kiểm và điều chỉnh theo dữ liệu thực tế, không tự ý hạ thấp ngưỡng:

| Nhóm máy chủ theo HSYC | Số lượng và cấu hình mỗi nút | Vai trò |
|---|---|---|
| Front-end ReactJS | 2 VM, mỗi VM 4 vCPU, 8 GB RAM, SSD hệ điều hành 100 GB | Phục vụ giao diện, đặt sau cân bằng tải. |
| .NET API/Services | 2 VM, mỗi VM 8 vCPU, 16 GB RAM, SSD 200 GB | API và dịch vụ tích hợp/nghiệp vụ. |
| Portal Core/SharePoint | 2 VM, mỗi VM 8 vCPU, 24 GB RAM, SSD 300 GB | Portal core theo nền tảng SharePoint. |
| Database HA | 2 VM, mỗi VM 8 vCPU, 32 GB RAM, SSD hệ điều hành 500 GB và dữ liệu 1,5 TB | Primary/Secondary theo phương án HA được Chủ đầu tư duyệt. |
| Search/Index | 1 VM, 4 vCPU, 16 GB RAM, SSD hệ điều hành 100 GB và dữ liệu 500 GB | Lập chỉ mục/tìm kiếm. |
| File/Object | 2 VM, mỗi VM 4 vCPU, 8 GB RAM, SSD 100 GB; kho dùng chung 4 TB usable | Dịch vụ tệp có HA. |
| Log/Monitoring | 1 VM, 4 vCPU, 16 GB RAM, SSD hệ điều hành 100 GB và dữ liệu 1 TB | Thu thập log/giám sát tập trung. |
| Backup/DR | 1 VM, 4 vCPU, 8 GB RAM, SSD 100 GB và kho backup 8 TB | Kho bản sao/DR tách vùng vận hành. |

Tổng sizing tham chiếu là 13 VM, 76 vCPU, 216 GB RAM, khoảng 2.700 GB OS disk và 16,5 TB dung lượng vật lý/logic theo bảng HSYC [B0813.R001–R015]. Mỗi VM được yêu cầu băng thông 10 Gbps; tầng ứng dụng định cỡ 6 VM, 40 vCPU và 96 GB RAM theo cấu hình đề xuất sau dự phòng; tầng DB 2 VM, 16 vCPU và 64 GB RAM. Dữ liệu DB logic định cỡ 1,3 TB, làm tròn 1,5 TB/node có nhân bản HA. Kho file 4 TB usable được tính từ 2,5 TB dữ liệu chính và dự phòng; kho backup/DR tối thiểu 8 TB. Các số liệu sizing DB/file nêu trong HSYC là tạm tính ở phần dữ liệu hiện hữu, cần kiểm kê và đối soát trong khảo sát [B0817.R002–R028; B0819.R002–R028; B0821.R002–R008].

Băng thông Internet tối thiểu là 200 Mbps theo định cỡ 500 phiên và dự phòng, ưu tiên cache/CDN cho nội dung phù hợp; mạng nội bộ giữa ứng dụng, DB, đồng bộ và backup là 10 Gbps. Chủ đầu tư xác nhận các VM, storage, mạng, bản quyền, vùng HA/DR, load balancer, firewall và quyền vận hành. Nếu tài nguyên hiện hữu khác baseline, Tefli sẽ lập bảng sai khác và đánh giá tác động bằng benchmark trước khi thống nhất cấu hình nghiệm thu [B0817.R025–R028; B0819.R028].
## 3. Topology khả dụng cao và khả năng mở rộng

Tefli đề xuất triển khai theo baseline HSYC **hai nút Front-end ReactJS, hai nút .NET API/Services và hai nút Portal Core/SharePoint**, đặt sau bộ cân bằng tải hoặc giải pháp tương đương do Chủ đầu tư cấp/chấp thuận. Hai nút mỗi lớp được cấu hình nhất quán; health-check kiểm tra khả năng phục vụ, bộ cân bằng tải ngừng định tuyến tới nút không khỏe và đưa nút trở lại sau khi kiểm tra phục hồi. Phiên người dùng và tác vụ cần tiếp tục qua nhiều nút sẽ dùng cơ chế trạng thái dùng chung hoặc token không phụ thuộc bộ nhớ riêng của một nút, theo thiết kế được phê duyệt. Không tính riêng số nút thành phần ngoài phạm vi hợp đồng như đã có nếu hạ tầng chưa được cấp.

Lớp dữ liệu sử dụng phương án HA/DR phù hợp với năng lực, giấy phép và chuẩn vận hành SQL Server mà Chủ đầu tư bố trí. Tefli sẽ khảo sát và trình lựa chọn topology DB, cơ chế chuyển vai, vùng lỗi, đồng bộ và trách nhiệm DBA; chỉ chốt cấu hình sau khi xác nhận khả năng hạ tầng. Nếu năng lực hiện hữu không đáp ứng, hai bên lập danh sách phụ thuộc/rủi ro và phương án xử lý trước khi chốt nghiệm thu, không giả định có sẵn thêm máy chủ hoặc bản quyền.

Mục tiêu dịch vụ công khai là độ sẵn sàng tối thiểu 99,9% theo tháng, loại trừ bảo trì có kế hoạch đã thông báo; phiên bảo trì có kế hoạch quay lui [B0752]. Tefli sẽ cung cấp kế hoạch đo, định nghĩa khoảng thời gian tính dịch vụ, nguồn telemetry, cách loại trừ bảo trì và báo cáo. Cơ chế retry áp dụng có giới hạn, có timeout và chỉ cho thao tác an toàn/idempotent; circuit breaker và graceful degradation cô lập lỗi tích hợp để một dịch vụ phụ trợ không làm dừng toàn Cổng [B0754]. Hàng đợi tác vụ nền có trạng thái tiếp nhận/xử lý/thất bại, số lần thử, mã tương quan và thao tác chạy lại có kiểm soát. Kiểm thử nghiệm thu gồm ngắt nút ứng dụng, kiểm tra loại nút khỏi tải, khôi phục nút, lỗi kết nối phụ trợ và quay lui bản phát hành.

## 4. Tích hợp AD/SSO, LGSP và EMC

Tefli đề xuất tích hợp danh tính với Active Directory và SSO theo cơ chế/giao thức mà Chủ đầu tư đang vận hành và cho phép. Danh tính được ánh xạ sang nhóm/role nghiệp vụ; quyền chỉ cấp tối thiểu theo nhiệm vụ. Quy trình vòng đời tài khoản, khóa/mở khóa, thay đổi đơn vị và thu hồi quyền được thống nhất với đầu mối quản trị AD. Với tài khoản cần xác thực hai bước theo yêu cầu, Tefli triển khai luồng đăng ký, xác minh, bắt buộc OTP khi đăng nhập, vô hiệu hóa và reset có kiểm soát [B0738.R029; B0742.R043–R044]. SSO/AD chỉ được nghiệm thu sau khi có môi trường tích hợp, tài khoản thử nghiệm được phê duyệt và kiểm thử các trường hợp thành công, từ chối, khóa và thu hồi.

Kết nối LGSP và các hệ thống/cơ sở dữ liệu dùng chung đi qua API Gateway/LGSP hoặc điểm tích hợp được Chủ đầu tư chỉ định. Tefli sẽ lập danh mục endpoint, chủ thể dữ liệu, trường dữ liệu, tần suất, phương thức xác thực, phân quyền, giới hạn tải, timeout, xử lý lỗi, retry và đối soát. Dữ liệu được truyền theo schema/định dạng do hai bên thống nhất; các yêu cầu đồng bộ có mã giao dịch để truy vết và chống ghi nhận trùng. Hệ thống EMC được HSYC liệt kê cùng AD/SSO và LGSP là thành phần cần tích hợp; kết nối qua giao thức/API phù hợp và kênh quản trị an toàn, với đầu mối, thông số, dữ liệu trao đổi và cơ chế giám sát được xác định trước nghiệm thu [B0713.R007]. Tefli sẽ xác nhận với đơn vị quản lý EMC chức năng/luồng cụ thể, API, quyền, dữ liệu, cảnh báo và tiêu chí giám sát trước khi cấu hình. HSYC không mô tả EMC là kho quản lý nội dung/tài liệu; vì vậy không giả định chức năng đó.



### 4.1 Sẵn sàng IPv6 và kiểm soát sai hỏng

Địa chỉ máy chủ, DNS và endpoint được tách vào cấu hình theo môi trường để hỗ trợ chuyển IPv4 sang IPv6 mà không sửa logic nghiệp vụ. Tefli phối hợp đầu mối hạ tầng lựa chọn cơ chế chuyển đổi được phê duyệt, kiểm tra kết nối web, API, dữ liệu và tích hợp trên tuyến IPv6 hoặc dual-stack phù hợp. Các cơ chế được mô tả trong HSYC được đối chiếu với hạ tầng thực tế, không tự kích hoạt khi chưa được chấp thuận [B0830–B0835].

Ứng dụng xử lý lỗi có kiểm soát, hỗ trợ bật/tắt hoặc cách ly module lỗi mà không dừng các module độc lập; dữ liệu không hợp lệ được trả thông báo hoặc đưa vào danh sách cần chuẩn hóa để sửa có kiểm soát. Các quy tắc đầu vào được quản lý theo phiên bản/cấu hình được duyệt. Phân quyền tối thiểu, nhật ký thao tác, kiểm soát truy cập từ xa và bảo vệ dữ liệu lưu trữ áp dụng xuyên suốt; phép thử gồm lỗi module, dữ liệu sai, thao tác vượt quyền và kiểm tra trạng thái sau phục hồi [B0836–B0845].

## 5. An toàn thông tin theo nhóm yêu cầu cấp độ 3

Tefli sẽ xây dựng ma trận kiểm soát và bằng chứng nghiệm thu theo bảng yêu cầu tại HSYC [B0798–B0802]. Phạm vi triển khai bao gồm:
- **Xác thực:** giao diện quản lý tài khoản; xác thực khi truy cập/quản trị; lưu thông tin xác thực dưới dạng hash an toàn theo yêu cầu; chính sách mật khẩu gồm mật khẩu lần đầu, độ dài/loại ký tự, tuổi mật khẩu, hết hạn và mở khóa; giới hạn đăng nhập sai, cảnh báo, ngăn đăng nhập tự động/vô hiệu hóa theo chính sách; bảo vệ thông tin xác thực khi truyền [B0802.R003–R017]. 2FA Authenticator áp dụng cho đối tượng và quy trình được Chủ đầu tư phê duyệt.
- **Kiểm soát truy cập:** timeout phiên và yêu cầu xác thực lại khi hết hạn; tối thiểu ba nhóm người dùng thông thường, quản trị mức sử dụng, quản trị mức phát triển/vận hành; quyền tối thiểu theo nhóm và chức năng, phân biệt truy cập nội dung với quản trị hạ tầng [B0802.R019–R028]. Tefli sẽ lập ma trận role-permission, kiểm thử truy cập đúng/sai quyền và kiểm tra trường hợp tài khoản bị khóa/thu hồi.
- **Nhật ký hệ thống:** thu thập ít nhất nhật ký truy cập, đăng nhập quản trị, lỗi, quản lý tài khoản và thay đổi cấu hình; tập trung quản lý và thiết lập thời gian lưu. Mỗi sự kiện có thời điểm, nhóm, mô tả thao tác/lỗi, đối tượng thực hiện và mức độ quan trọng [B0802.R029–R044]. Nhật ký được giới hạn quyền đọc, đồng bộ thời gian và không ghi giá trị bí mật; cảnh báo được cấu hình cùng đầu mối vận hành.
- **An toàn ứng dụng và mã nguồn:** kiểm tra hợp lệ dữ liệu đầu vào; kiểm soát lỗi chỉ trả thông báo phù hợp cho người dùng; quản lý secret bên ngoài mã nguồn; đánh giá và kiểm thử xâm nhập theo tiêu chí OWASP nêu trong HSYC đối với SQL injection, OS command injection, RFI/LFI, XPath injection, XSS và CSRF [B0802.R045–R050]. Kết quả gồm phạm vi, phiên bản, phát hiện, mức độ, khắc phục và kiểm tra lại; không tuyên bố không còn điểm yếu trước khi hoàn tất đánh giá.
- **Bảo mật liên lạc:** mã hóa luồng truyền theo yêu cầu áp dụng, cấu hình TLS/chứng thư theo hạ tầng và chính sách Chủ đầu tư; với trao đổi có chữ ký số, xác định đối tượng dữ liệu, quy trình ký/xác minh và quản lý chứng thư trước triển khai [B0802.R051–R052].

Việc đáp ứng các nhóm trên sẽ được chứng minh bằng tài liệu thiết kế an toàn, cấu hình, ma trận quyền, log mẫu, kết quả kiểm thử/pentest và biên bản khắc phục. Kết luận cấp độ an toàn chỉ do cơ quan/chủ thể có thẩm quyền đánh giá theo hồ sơ và môi trường thực tế; nội dung đề xuất này không thay cho đánh giá/chứng nhận.

## 6. Sao lưu, phục hồi, DR và vận hành

Tefli đề xuất sao lưu nhất quán cơ sở dữ liệu, cấu hình portal/API, cấu hình tích hợp và các tệp/nội dung thuộc phạm vi. Lịch full/differential/log hoặc phương pháp tương đương được DBA và Chủ đầu tư phê duyệt, bảo đảm điểm sao lưu đáp ứng RPO không quá 04 giờ. Bản sao được lưu tách biệt theo vùng/thiết bị được phép, mã hóa nếu chính sách yêu cầu, hạn chế quyền và có kiểm tra tính toàn vẹn. Quy trình phục hồi xác định thứ tự khôi phục phụ thuộc, vai trò phê duyệt, kiểm tra dữ liệu, chuyển dịch vụ và quay lại; mục tiêu RTO không quá 04 giờ cho dịch vụ trọng yếu [B0756].

Trước nghiệm thu, Tefli phối hợp diễn tập ít nhất một tình huống khôi phục dịch vụ trọng yếu và lập biên bản ghi thời điểm sự cố, điểm dữ liệu khôi phục, thời gian phục hồi, chức năng được xác nhận, sai lệch dữ liệu và hành động khắc phục. Chỉ tiêu được xác nhận theo số đo diễn tập, không suy ra từ việc màn hình có chức năng backup. Backup phục vụ rollback trước thay đổi cũng được kiểm tra khả năng đọc/khôi phục theo thủ tục vận hành. Tiếp nhận sự cố được tổ chức 24/7 theo đầu mối đăng ký; thời gian sửa lỗi phần mềm theo điều khoản 08/40 giờ hành chính và có mặt trực tiếp không quá 12 giờ được quản lý riêng, không thay thế RTO 04 giờ của dịch vụ trọng yếu [B0962.R025].

## 7. Hiệu năng, khả năng tiếp cận và kiểm thử nghiệm thu

Theo HSYC, giao diện hỗ trợ độ phân giải tối thiểu 1024×768, thông báo lỗi và trạng thái thành công/thất bại khi thêm, sửa, xóa; sử dụng tiếng Việt Unicode, ngày dd/mm/yyyy, giờ 24h hh:mm:ss và bố cục trực quan, thân thiện [B0783–B0789]. Tefli sẽ kiểm tra trên kích thước yêu cầu và thiết bị đại diện, lập checklist về điều hướng, nhãn biểu mẫu, trạng thái lỗi/thành công và hiển thị nội dung. Đồng thời, Tefli đề xuất hỗ trợ người khuyết tật theo yêu cầu nêu tại B0681: điều hướng bằng bàn phím, thứ tự focus, nhãn biểu mẫu và mô tả ảnh, nội dung có cấu trúc và tương phản dễ đọc. Danh mục kiểm tra cụ thể được đối chiếu với yêu cầu áp dụng của Chủ đầu tư; không coi các kiểm tra giao diện này là chứng nhận đã đạt.

HSYC quy định tải tối thiểu 500 phiên truy cập công khai đồng thời (T) và 84 phiên tác vụ động/người dùng hoạt động đồng thời (N), gồm trang chủ, tìm kiếm, xem tin, tải tệp và thao tác quản trị [B0804; B0810.R001–R003]. Tefli sẽ chạy kịch bản có đủ các hành vi này trên phiên bản hoàn thiện, ghi rõ phân bố hành vi, tốc độ tăng tải, thời gian duy trì, môi trường và điều kiện mạng.

| Chỉ tiêu nghiệm thu | Ngưỡng HSYC | Cách đo/điều kiện |
|---|---|---|
| Tải đồng thời | Tối thiểu 500 phiên công khai; tối thiểu 84 phiên tác vụ động (N = 1/6 T, làm tròn lên). | Công cụ tải tạo phiên và luồng tác vụ theo kịch bản B0804, có cả CMS/quản trị. |
| Phản hồi tác vụ thông thường | Trung bình <2,5 giây; chậm nhất <30 giây. | Đo thời gian đầu-cuối từng nhóm tác vụ, ghi phân vị và ngoại lệ; tác vụ dài hiển thị trạng thái xử lý. |
| Tương tác trực tiếp | ≤0,6 giây khi điều kiện mạng và tải cho phép. | Ghi độ trễ và điều kiện mạng/tải kèm theo; đánh giá theo điều kiện HSYC nêu. |
| Tài nguyên mỗi nút | CPU trung bình ≤75%; không swap kéo dài; còn ≥25% dư địa. | Thu telemetry từng VM trong thời gian tải danh định, đối chiếu CPU, RAM, swap và headroom. |

Các ngưỡng này là chỉ tiêu HSYC, không phải kết quả đã đạt. Tefli sẽ báo cáo số đo thực tế theo lớp/nút, thông lượng, độ trễ, lỗi và tài nguyên; chỉ kết luận đáp ứng khi kết quả kiểm thử trên môi trường triển khai thỏa các ngưỡng [B0803–B0806]. Thiết kế dùng phân trang/giới hạn truy vấn, chỉ mục phù hợp, cache nội dung công khai khi được duyệt và timeout theo nghiệp vụ; tối ưu không thay thế kiểm thử tải.


## 8. Ánh xạ tiêu chuẩn giao thức HSYC và ma trận nghiệm thu

Các tiêu chuẩn dưới đây được xử lý như danh mục HSYC cần đối chiếu và áp dụng phù hợp theo luồng kết nối. Tefli sẽ lập bảng ánh xạ giao thức, điểm cuối, định dạng, cấu hình an toàn và kết quả kiểm tra tương thích; không mặc định mọi giao thức đều dùng cho mọi kết nối [B0733.R002–R029].

| Danh mục HSYC | Phương án tương thích đề xuất | Bằng chứng nghiệm thu |
|---|---|---|
| Kết nối: HTTP v1.1, SMTP/MIME, TCP, IPv4/IPv6 [B0733.R002–R007] | HTTP cho giao diện/API theo cấu hình an toàn được duyệt; SMTP/MIME cho thư thông báo; TCP và IPv4/IPv6 theo mạng Chủ đầu tư cấp. Chỉ mở luồng/port cần thiết. | Sơ đồ luồng, danh sách port/endpoint, cấu hình TLS/mail relay được phép và kiểm tra kết nối từ môi trường triển khai. |
| Tích hợp dữ liệu: XML, UTF-8 [B0733.R008–R010] | API dùng schema/định dạng được các bên thống nhất; hỗ trợ XML khi hệ thống đích yêu cầu; thống nhất mã hóa UTF-8 và quy tắc xử lý tiếng Việt. | Schema mẫu, dữ liệu vào/ra, kiểm thử ký tự tiếng Việt, lỗi schema và biên bản tích hợp với hệ đích. |
| Truy cập thông tin: HTML 4.01, CSS2/XSL, HTML, JPEG/GIF/TIFF/PNG, ASCII, TCVN 6909:2001, ZIP/GZIP [B0733.R011–R023] | Đối chiếu định dạng nội dung/trao đổi với yêu cầu HSYC và hệ thống hiện hữu; bảo toàn nội dung/Unicode và media cần chuyển đổi. Tương thích định dạng áp dụng được xác nhận theo từng chức năng, không áp đặt định dạng cũ cho mọi màn hình hiện đại. | Danh mục định dạng hỗ trợ, kiểm tra hiển thị/trình duyệt, tiếng Việt, tải/mở tệp và mẫu dữ liệu chuyển đổi. |
| An toàn thông tin: IPsec/IP ESP, XML Encryption/Signature, SMTPS, WS-Security v1.1 [B0733.R024–R029] | Chọn cơ chế theo yêu cầu của từng kênh: IPsec khi tuyến mạng được cấu hình; XML Encryption/Signature hoặc WS-Security khi hệ thống đích yêu cầu; SMTPS cho thư; TLS/chứng thư cho kênh web theo thiết kế được duyệt. Xác nhận tương thích phiên bản/cấu hình trước tích hợp. | Bảng ánh xạ chuẩn–kênh–endpoint, cấu hình đã khử secret, xác minh chứng thư/chữ ký và kết quả kiểm thử kết nối; không công bố áp dụng nếu hệ đích/hạ tầng chưa hỗ trợ. |

| Mục HSYC | Nội dung thuyết minh | Phương thức nghiệm thu |
|---|---|---|
| B0721–B0730, B0733 | Kiến trúc nhiều lớp, SharePoint/React/.NET/SQL Server và ánh xạ giao thức | Hồ sơ thiết kế được duyệt; sơ đồ triển khai, danh mục thành phần/phiên bản, ma trận giao thức và kiểm tra luồng kết nối. |
| B0650–B0654, B0713.R004–R007, B0738.R012–R018 | Chuyển đổi dữ liệu, SSO/AD, LGSP, EMC và tích hợp hệ thống | Đặc tả API, test case từng hệ đích, đối soát bản ghi/tệp/URL, log truy vết và biên bản xác nhận của đầu mối. |
| B0751–B0756 | HA, uptime 99,9%, mở rộng, xử lý lỗi và DR RPO/RTO ≤4 giờ | Kiểm tra số nút/as-built, health-check, failover/rollback; báo cáo uptime theo kỳ; biên bản diễn tập với RPO/RTO thực đo. |
| B0803–B0806, B0810 | 500 phiên công khai, 84 phiên động; phản hồi <2,5 giây trung bình, <30 giây tối đa, tương tác ≤0,6 giây khi mạng/tải cho phép; CPU ≤75%, swap không kéo dài, headroom ≥25%. | Báo cáo tải B0804 theo kịch bản và đo từng ngưỡng B0805–B0806 trên từng lớp/nút. |
| B0813, B0817–B0821 | 13 VM/76 vCPU/216 GB RAM; 4 TB usable file, 8 TB backup; Internet ≥200 Mbps, nội bộ 10 Gbps. | Bảng đối chiếu hạ tầng được cấp, kiểm kê dữ liệu và biên bản xác nhận sizing/dung lượng. |
| B0783–B0789 | Giao diện, thông báo trạng thái, Unicode/ngày giờ, thân thiện và responsive | Checklist giao diện trên thiết bị/kích thước duyệt; kiểm tra tiếng Việt, định dạng và thông báo thao tác. |
| B0798–B0802.R003–R055 | ATTT cấp độ 3 theo các nhóm xác thực, truy cập, log, ứng dụng, liên lạc, backup | Ma trận yêu cầu–kiểm soát–bằng chứng; cấu hình/ảnh chụp đã khử bí mật; kiểm thử quyền, log, OWASP/pentest, truyền tin và biên bản restore. |
| B0962.R020–R025 | Triển khai, chuyển giao, bảo hành và hỗ trợ sự cố | Danh mục tài liệu/mã nguồn/quyền hợp pháp; runbook, đào tạo, đầu mối tiếp nhận 24/7 và biên bản diễn tập SLA. |

## 9. Điều kiện phối hợp và sản phẩm bàn giao

Tefli sẽ thống nhất kế hoạch khảo sát, thiết kế chi tiết, cấu hình, kiểm thử, chuyển đổi, đào tạo và nghiệm thu với Chủ đầu tư. Các đầu việc được phân công theo ma trận trách nhiệm; thay đổi ảnh hưởng kiến trúc, dữ liệu hoặc an toàn thông tin được rà soát và phê duyệt trước khi áp dụng.



Tefli bàn giao sơ đồ kiến trúc/triển khai, danh mục thành phần và phiên bản, hợp đồng API, ma trận quyền và kiểm soát, cấu hình vận hành đã loại bỏ bí mật, hướng dẫn cài đặt/triển khai/quay lui, runbook giám sát/sự cố, chính sách và hướng dẫn backup/restore, kết quả kiểm thử/diễn tập, tài liệu quản trị và hướng dẫn sử dụng. Mã nguồn, cấu hình, dữ liệu và quyền bàn giao tuân theo phạm vi hợp đồng và quyền hợp pháp quy định tại HSYC [B0962.R017–R020]. Các thay đổi kiến trúc, dữ liệu hoặc cấu hình ảnh hưởng an toàn cần được Chủ đầu tư duyệt và có phương án sao lưu/quay lui trước khi áp dụng.

**Cam kết đề xuất:** Tefli sẽ triển khai kiến trúc và các cơ chế nêu trên trong phạm vi hợp đồng, phối hợp với Chủ đầu tư để hoàn thiện phụ thuộc hạ tầng và tích hợp, đồng thời cung cấp bằng chứng kiểm thử tương ứng. Kết quả đáp ứng 99,9%, RPO/RTO ≤4 giờ, hiệu năng và yêu cầu an toàn cấp độ 3 chỉ được kết luận theo cấu hình thực tế và biên bản nghiệm thu/đánh giá có thẩm quyền; tài liệu đề xuất không thay thế các kết quả đó.





