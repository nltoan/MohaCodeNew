# 21. Phương án triển khai, đào tạo, chuyển giao và bảo hành

## Phương án bố trí nhân sự và kế hoạch triển khai

### 1. Mục tiêu và nguyên tắc tổ chức

Nhà thầu tổ chức nâng cấp Cổng, cài đặt/triển khai, đào tạo và chuyển giao trên hạ tầng, nền tảng do Chủ đầu tư bố trí. Hoạt động được chia theo nhóm chức năng; yêu cầu, thiết kế và tiêu chí nghiệm thu được thống nhất trước khi phát triển. Nhà thầu sao lưu và chuyển đổi thử trước khi chuyển đổi chính thức, bảo mật dữ liệu và chỉ truy cập hệ thống trong phạm vi quyền được cấp.

Kế hoạch dưới đây được lập theo mốc hoàn thành tối đa 30 ngày lịch từ ngày hợp đồng có hiệu lực đến nghiệm thu tổng thể. Các luồng công việc có thể thực hiện song song khi phụ thuộc đầu vào đã sẵn sàng. Quản lý triển khai duy trì lịch chi tiết, theo dõi đường găng, phụ thuộc dữ liệu/hạ tầng, rủi ro và quyết định cần Chủ đầu tư xác nhận.

### 2. Kế hoạch triển khai 30 ngày và cổng kiểm soát

| Thời gian | Công việc chính | Đầu ra và cổng kiểm soát |
|---|---|---|
| Ngày 1–2 | Khởi động; thống nhất đầu mối, lịch, môi trường, quyền truy cập, yêu cầu và quy trình thay đổi. | Biên bản khởi động, lịch, danh sách đầu vào. **G1:** xác nhận phạm vi và đầu mối. |
| Ngày 2–5 | Khảo sát nội dung, phân hệ, quyền, tích hợp, hạ tầng, dữ liệu mẫu và URL. | Biên bản khảo sát, danh mục nguồn/phụ thuộc. **G2:** xác nhận mẫu dữ liệu và môi trường. |
| Ngày 4–8 | Phân tích; thiết kế giao diện, kiến trúc, cấu hình; ánh xạ dữ liệu; lập kế hoạch kiểm thử, ATTT, backup và rollback. | Hồ sơ phân tích/thiết kế, ma trận truy vết, kế hoạch test/chuyển đổi. **G3:** phê duyệt thiết kế trước khi hoàn thiện bản dựng. |
| Ngày 7–18 | Phát triển/nâng cấp, cấu hình và tích hợp theo thông số được cấp. | Bản dựng, nhật ký thay đổi/lỗi. **G4:** bản dựng đạt kiểm thử nội bộ. |
| Ngày 13–21 | Sao lưu, chuyển đổi thử và đối soát sáu nhóm dữ liệu; hiệu chỉnh mapping theo quyết định nghiệp vụ. | Biên bản thử, báo cáo số liệu/lỗi, bảng URL. **G5:** xác nhận phương án chuyển chính thức. |
| Ngày 19–24 | Kiểm thử chức năng, tích hợp, phân quyền, hiệu năng, ATTT, sao lưu/phục hồi; sửa và chạy lại. | Kịch bản, bằng chứng pass/fail, lỗi và kết quả retest. **G6:** thống nhất kết quả và tồn tại. |
| Ngày 23–26 | Cài đặt trên hạ tầng Chủ đầu tư; kiểm thử nghiệm thu; chuyển đổi cuối sau khi được chấp thuận. | Biên bản cài đặt/chuyển đổi, đối soát, vận hành thử. **G7:** xác nhận sẵn sàng nghiệm thu. |
| Ngày 25–28 | Đào tạo, hướng dẫn và bàn giao tài liệu. | Danh sách tham dự, tài liệu và biên bản đào tạo. |
| Ngày 28–30 | Khắc phục, kiểm thử lại, bàn giao và nghiệm thu tổng thể. | Báo cáo cuối, biên bản bàn giao/nghiệm thu. **G8:** nghiệm thu khi các yêu cầu đạt. |

Tại mỗi cổng, Nhà thầu trình đầu ra, nêu rõ việc đã hoàn tất, phụ thuộc còn mở, lỗi/tồn tại, người chịu trách nhiệm và hạn xử lý. Chuyển giai đoạn chính thức sau khi đầu mối có thẩm quyền xác nhận kết quả theo tiêu chí đã thống nhất.

### 3. Nhân lực theo vai trò

Nhà thầu bố trí nhân lực phù hợp cho khảo sát, phân tích, thiết kế, phát triển, kiểm thử, an toàn thông tin, chuyển đổi dữ liệu, đào tạo và triển khai. Bảng dưới mô tả các vai trò và đầu ra; thành viên cụ thể được phân công trong kế hoạch nhân sự dự án, không thay thế bằng thông tin chức danh/kinh nghiệm chưa được xác nhận.

| Vai trò | Trách nhiệm | Đầu ra và phối hợp |
|---|---|---|
| Quản lý triển khai | Quản lý tiến độ, rủi ro, phiên bản, biên bản, cổng quyết định và liên lạc hai bên. | Lịch, báo cáo, danh sách vấn đề/đầu mối cần xác nhận. |
| Khảo sát và phân tích nghiệp vụ | Thu thập quy trình, chức năng, quyền, dữ liệu, tích hợp và tiêu chí nghiệm thu. | Biên bản khảo sát, yêu cầu, ma trận truy vết. |
| Thiết kế giải pháp | Thiết kế kiến trúc, giao diện, dịch vụ, dữ liệu, phân quyền, mạng và triển khai. | Tài liệu thiết kế, mô hình dữ liệu, điểm tích hợp. |
| Phát triển ứng dụng | Nâng cấp chức năng/giao diện, cấu hình, tích hợp và sửa lỗi trong phạm vi. | Bản dựng, mã nguồn phần tự phát triển, nhật ký thay đổi. |
| Chuyển đổi dữ liệu | Lập mapping, trích xuất/nạp, quản lý tệp/URL, đối soát và chuẩn bị rollback. | Báo cáo chuyển đổi, danh sách ngoại lệ, bằng chứng khôi phục. |
| Kiểm thử | Xây kịch bản chức năng, tích hợp, phân quyền, hiệu năng, dữ liệu và retest. | Kịch bản, bằng chứng pass/fail, báo cáo lỗi. |
| An toàn thông tin/vận hành | Rà soát quyền, nhật ký, ATTT, backup/restore, giám sát và ứng cứu. | Checklist, kết quả phục hồi, hướng dẫn vận hành. |
| Đào tạo/chuyển giao | Chuẩn bị tài liệu và tổ chức hướng dẫn hai nhóm học viên. | Tài liệu, danh sách tham dự, biên bản đào tạo. |

Nhân sự có thể kiêm nhiệm khi Nhà thầu bố trí đủ năng lực và việc kiêm nhiệm không ảnh hưởng tiến độ/chất lượng. Nhà thầu quản lý phân công và bàn giao công việc khi có thay đổi nhân lực; thông báo đầu mối Chủ đầu tư và duy trì liên tục trách nhiệm dự án.

### 4. Khảo sát, thiết kế, phát triển và kiểm thử

Khảo sát ghi nhận cấu trúc nội dung/phân hệ, quy trình biên tập và xuất bản, tài khoản/nhóm quyền, nền tảng, dữ liệu, tích hợp và kết nối hiện có. Nhà thầu xác định đầu vào, quyền truy cập, môi trường và đầu mối cần thiết; lập biên bản các nội dung đã thống nhất và vấn đề cần phối hợp. Kết nối Active Directory, LGSP/API, chữ ký số và EMC được triển khai theo thông số, quyền truy cập, dữ liệu trao đổi và đầu mối được Chủ đầu tư xác nhận.

Thiết kế theo kiến trúc, công nghệ và chức năng đã thống nhất. Mỗi yêu cầu được truy vết tới giải pháp, bản dựng, kịch bản thử và đầu ra nghiệm thu. Sai khác hoặc ngoại lệ được báo cáo, đánh giá tác động và xử lý theo quy trình thay đổi.

Kiểm thử gồm chức năng/kỹ thuật, hiệu năng, an toàn thông tin, phân quyền, dữ liệu, backup/restore và tích hợp thuộc phạm vi. Mỗi kịch bản ghi điều kiện đầu vào, bước chạy, kết quả mong đợi/thực tế và bằng chứng. Kết quả **Pass** khi đáp ứng yêu cầu và không còn lỗi cản trở nghiệm thu; kết quả **Fail** khi thiếu/sai kết quả, có lỗi nghiêm trọng hoặc dữ liệu không toàn vẹn. Nhà thầu ghi lỗi, sửa và chạy lại các kịch bản liên quan.

### 5. Kiểm thử tải, cấu hình và nghiệm thu

Kịch bản tải gồm truy cập trang chủ, tìm kiếm, xem tin bài/văn bản, tải tệp và thao tác quản trị. Mức tải tối thiểu **500 lượt truy cập đồng thời**, trong đó ít nhất **84 phiên/người dùng hoạt động đồng thời**. Thời gian phản hồi tác vụ thông thường trung bình **dưới 2,5 giây**, chậm nhất **dưới 30 giây**; tương tác trực tiếp mục tiêu **không quá 0,6 giây khi điều kiện mạng và tải cho phép**. Tác vụ dài hiển thị trạng thái xử lý.

Trong tải danh định, CPU trung bình từng nút **không quá 75%**, không có swap kéo dài và còn **ít nhất 25%** dư địa tài nguyên. Báo cáo ghi kịch bản, tải thực đạt, điều kiện môi trường, số liệu theo nút, lỗi và ngoại lệ nếu mạng ảnh hưởng phép đo.

Quy mô hạ tầng tối thiểu gồm **13 VM, tổng 76 vCPU/216 GB RAM**: 2 Front-end ReactJS; 2 .NET API/Services; 2 Portal Core/SharePoint; 2 DB HA; 1 Search/Index; 2 File/Object; 1 Log collector/Monitoring; 1 Backup/DR Repository. Tổng OS/System disk **2.700 GB**, data/storage **16,5 TB vật lý/logic** gồm dữ liệu nhân bản và backup. Cấu hình chi tiết được đối chiếu với tài nguyên Chủ đầu tư cấp trước cài đặt. Nhà thầu đo kiểm trên bản hoàn thiện và chứng minh đáp ứng tải trước nghiệm thu.

Độ sẵn sàng dịch vụ công khai tối thiểu **99,9% theo tháng**, không tính bảo trì có kế hoạch đã thông báo. Phương án DR xác định **RPO không quá 04 giờ, RTO không quá 04 giờ** cho dịch vụ trọng yếu và được diễn tập trước nghiệm thu. RTO khôi phục dịch vụ được quản lý độc lập với thời hạn 08/40 giờ hành chính khắc phục lỗi phần mềm.

Kiểm thử nội bộ được thực hiện tại môi trường Nhà thầu; tích hợp, nghiệm thu và vận hành thử được thực hiện trên hạ tầng do Chủ đầu tư bố trí. Thử nghiệm có nguy cơ ảnh hưởng hệ thống đang chạy phải có kế hoạch backup/restore được chấp thuận. Kết quả được ghi biên bản/báo cáo có xác nhận của các bên.

### 6. Chuyển đổi dữ liệu và URL

Phạm vi chuyển đổi gồm sáu nhóm: tin tức; văn bản; Chuyên trang Bộ trưởng; Đảng bộ Bộ Nội vụ; đa phương tiện; URL cũ sang URL mới. Nhà thầu cùng Chủ đầu tư kiểm kê dữ liệu, xác định schema, trạng thái, quan hệ, tệp và số lượng trước khi chốt mapping.

Mỗi nhóm thực hiện theo chu trình: chốt nguồn/trường/quy tắc chuẩn hóa/trạng thái; sao lưu và kiểm tra bản sao; chuyển thử; báo cáo số đọc được, nạp thành công, lỗi/trùng/thiếu; lấy mẫu đối chiếu trường trọng yếu, ngày tháng và tệp; ghi ngoại lệ và quyết định xử lý; chỉ chuyển đổi chính sau khi được xác nhận. Sai khác không bị tự loại bỏ. Với URL, Nhà thầu lập bảng URL cũ–nội dung–URL mới, kiểm tra đích và vòng lặp. Lưu cấu hình cũ và bản sao lưu trước khi thay đổi; nếu vượt điều kiện dừng đã thống nhất, khôi phục cấu hình/dữ liệu, kiểm tra dịch vụ và lập kế hoạch chạy lại.

### 7. Quản lý chất lượng, rủi ro và phối hợp

Quản lý triển khai duy trì sổ rủi ro/vấn đề gồm mô tả, xác suất/ảnh hưởng, chủ sở hữu, biện pháp giảm thiểu, hạn xử lý và trạng thái. Rủi ro chính được theo dõi gồm chậm cấp môi trường/quyền, thiếu danh mục hoặc dữ liệu mẫu, chất lượng tệp, tích hợp phụ thuộc bên ngoài, xung đột dữ liệu, dung lượng và lịch thay đổi.

Thay đổi ảnh hưởng phạm vi, tiến độ, dữ liệu, bảo mật, kiến trúc hoặc tải được ghi yêu cầu thay đổi; đánh giá tác động, phương án, chi phí/thời gian nếu có và phê duyệt trước thực hiện. Nhà thầu họp tiến độ định kỳ, phát hành biên bản, duy trì danh sách quyết định mở và cập nhật kế hoạch theo kết quả cổng kiểm soát.

### 8. Sản phẩm bàn giao

Nhà thầu bàn giao bộ cài đặt; mã nguồn phần tự phát triển trong phạm vi quyền; cấu hình/mã triển khai; hướng dẫn biên dịch, cài đặt, quản trị, vận hành và sử dụng; tài liệu khảo sát–phân tích–thiết kế; tài liệu đào tạo; hồ sơ chuyển đổi/đối soát và URL; cấu trúc dữ liệu; tài khoản quản trị bàn giao an toàn; hướng dẫn sao lưu/khôi phục; biên bản kiểm thử/nghiệm thu; danh sách đầu mối hỗ trợ.


## Phương án đào tạo chuyển giao công nghệ

Đối với thành phần có sẵn hoặc của bên thứ ba, Nhà thầu kê khai chủ thể quyền, phiên bản, giấy phép, thời hạn, phạm vi và hạn chế sử dụng. Việc bàn giao thực hiện theo quyền hợp pháp, phạm vi hợp đồng và quy định của Chủ đầu tư. Hồ sơ bàn giao có danh mục, phiên bản, ngày bàn giao, người nhận và xác nhận tiếp nhận.

### 1. Mục tiêu và đối tượng

Nhà thầu tổ chức đào tạo tập trung tại địa điểm do Chủ đầu tư bố trí, kết hợp tài liệu hướng dẫn và thực hành trên môi trường được cấp. Mục tiêu là giúp quản trị viên vận hành, phân quyền, sao lưu/khôi phục; giúp biên tập viên nhập, cập nhật, duyệt, xuất bản và quản lý nội dung theo quyền.

### 2. Quy mô đào tạo

| Nhóm học viên | Đợt/lớp | Thời lượng | Giảng viên | Máy tính | Học viên |
|---|---:|---:|---:|---:|---:|
| Quản trị hệ thống | 01 đợt / 01 lớp | 01 ngày | 01 giảng viên chính, 0 phụ | 03 máy | 05 học viên |
| Biên tập viên | 01 đợt / 01 lớp | 02 ngày | 01 giảng viên chính, 0 phụ | 05 máy | 05 học viên |

### 3. Nội dung và phương pháp

**Lớp quản trị hệ thống:** cấu hình môi trường; tài khoản, vai trò và quyền; vận hành thường nhật; kiểm tra dịch vụ và nhật ký; sao lưu, kiểm tra bản sao và khôi phục; quản lý thay đổi; tiếp nhận sự cố và liên hệ hỗ trợ. Học viên thực hành thao tác trên môi trường đào tạo, không tác động trực tiếp môi trường sản xuất nếu chưa được cho phép.

**Lớp biên tập viên:** đăng nhập và quyền; nhập/sửa nội dung; quản lý danh mục, ảnh và tệp; quy trình duyệt/xuất bản; xử lý URL/liên kết; kiểm tra hiển thị; tìm kiếm và quản lý nội dung theo vai trò. Bài thực hành gồm tình huống hợp lệ, thiếu trường, tệp không phù hợp và nội dung chờ duyệt.

Nhà thầu chuẩn bị giáo trình, dữ liệu thực hành, hướng dẫn thao tác, bài tập, danh sách tham dự và phiếu ghi nhận câu hỏi. Giảng viên trình bày, thao tác mẫu, hướng dẫn học viên thực hành và giải đáp. Tài liệu được bàn giao bản điện tử theo định dạng thống nhất.

### 4. Đánh giá và hồ sơ chuyển giao

Kết thúc từng lớp, Nhà thầu kiểm tra hoàn thành bài thực hành, ghi nhận nội dung cần hướng dẫn bổ sung và thu ý kiến. Hồ sơ gồm chương trình, tài liệu, danh sách học viên/giảng viên, thời gian, kết quả thực hành, câu hỏi/tồn tại và biên bản đào tạo. Nhà thầu bàn giao hướng dẫn quản trị, vận hành, sử dụng, cài đặt/triển khai, backup/restore, xử lý lỗi thường gặp và đầu mối hỗ trợ.

## Phương án bảo hành bảo trì

### 1. Thời hạn và phạm vi

Nhà thầu cung cấp bảo hành và hỗ trợ phần mềm trong **12 tháng (01 năm)** kể từ ngày nghiệm thu đưa vào sử dụng. Trong thời hạn này, Nhà thầu miễn phí khắc phục lỗi/ khiếm khuyết của phần mềm và sản phẩm do mình cung cấp thuộc phạm vi hợp đồng, đồng thời thực hiện hỗ trợ và bảo trì theo yêu cầu. Các tùy chỉnh/cấu hình thuộc phạm vi hợp đồng được thực hiện theo thống nhất bằng văn bản, không thu thêm chi phí. Yêu cầu bổ sung chức năng/quy trình/khối lượng ngoài hợp đồng được xác định phạm vi, thời gian và chi phí riêng, chỉ thực hiện sau khi được chấp thuận và hoàn tất thủ tục hợp đồng.

Chi phí bảo hành, bảo trì và hỗ trợ kỹ thuật trong thời gian bảo hành được tính trong giá dự thầu và giá hợp đồng. Địa điểm bảo hành là hệ thống Cổng thông tin điện tử Bộ Nội vụ trên hạ tầng do Chủ đầu tư bố trí tại Bộ Nội vụ.

### 2. Tiếp nhận và xử lý sự cố

Nhà thầu cung cấp trước khi bàn giao đầu mối tiếp nhận, số điện thoại đường dây nóng, email và quy trình phân loại/xử lý sự cố. Thông báo được tiếp nhận **24/7**; mọi ticket ghi thời điểm tiếp nhận, người báo, dịch vụ ảnh hưởng, mức độ, phạm vi tác động, thông tin liên lạc, người xử lý, nguyên nhân, biện pháp, thời điểm phục hồi và kết quả.

| Mức lỗi | Tiêu chí | Thời hạn khắc phục |
|---|---|---|
| Lỗi đơn giản | Không cần chỉnh sửa kiến trúc hệ thống hoặc thiết kế cơ sở dữ liệu. | Không quá **08 giờ hành chính** kể từ khi nhận thông báo. |
| Lỗi phức tạp | Bắt buộc chỉnh sửa kiến trúc hệ thống hoặc thiết kế cơ sở dữ liệu. | Không quá **40 giờ hành chính** kể từ khi nhận thông báo. |

Giờ hành chính được tính từ **08:00–12:00 và 13:00–17:00** các ngày làm việc của Chủ đầu tư, không gồm ngày nghỉ/lễ. Thời gian ngoài khung giờ này không cộng vào thời hạn khắc phục 08/40 giờ; việc tiếp nhận vẫn diễn ra liên tục 24/7.

Với sự cố ảnh hưởng nghiêm trọng đến hoạt động hoặc an toàn dữ liệu, Nhà thầu phối hợp ngay với Chủ đầu tư để khoanh vùng, hạn chế thiệt hại và khôi phục hoạt động an toàn. Ứng cứu khẩn cấp không bị giới hạn bởi cách tính giờ hành chính. Nhà thầu có thể xử lý từ xa hoặc bố trí chuyên gia có mặt sớm hơn khi cần để đáp ứng thời hạn khắc phục.

### 3. Hỗ trợ trực tiếp, trực tuyến và bảo trì định kỳ

Nhà thầu duy trì đường dây nóng **24/7** và hỗ trợ kỹ thuật trực tuyến. Theo yêu cầu hỗ trợ trực tiếp qua đầu mối/kênh đã đăng ký, Nhà thầu có mặt tại địa điểm lắp đặt trong thời gian không quá **12 giờ liên tục** kể từ khi nhận yêu cầu; thời hạn này tính cả ngoài giờ hành chính, ngày nghỉ và ngày lễ. Thời hạn có mặt không làm gia hạn thời hạn khắc phục lỗi.

Nhà thầu thực hiện kiểm tra, duy tu/bảo dưỡng định kỳ **01 lần mỗi tháng**. Công việc gồm rà soát sức khỏe dịch vụ, tài nguyên, dung lượng, nhật ký lỗi, trạng thái backup, cảnh báo, chứng thư hết hạn, tác vụ định kỳ và các khuyến nghị tối ưu an toàn. Mỗi kỳ bảo trì có kế hoạch, thời gian, phạm vi, người thực hiện; thay đổi có nguy cơ ảnh hưởng dịch vụ cần được Chủ đầu tư duyệt và có phương án quay lui. Sau bảo trì, Nhà thầu lập báo cáo kết quả và vấn đề cần theo dõi.

### 4. Khôi phục dịch vụ và phân biệt thời hạn

RTO tối đa **04 giờ** là chỉ tiêu khôi phục dịch vụ trọng yếu bằng phương án sao lưu/phục hồi/DR. Chỉ tiêu này tách biệt với 08/40 giờ hành chính dành cho khắc phục lỗi phần mềm; thời hạn sửa lỗi không được dùng để kéo dài khôi phục dịch vụ. Nhà thầu ghi nhận thời điểm sự cố, điểm dữ liệu khôi phục, thời điểm dịch vụ phục hồi, chức năng đã kiểm tra, sai lệch, nguyên nhân và hành động phòng ngừa.

Trước khi bàn giao, Nhà thầu diễn tập khôi phục theo phương án được phê duyệt, lập biên bản số đo RPO/RTO và kiểm tra khả năng đọc/ghi, tài khoản, nội dung, tệp, tích hợp cần thiết. Khi sự cố xảy ra, Nhà thầu thông báo tiến độ theo mức độ, phối hợp Chủ đầu tư và bảo toàn nhật ký phục vụ phân tích.

### 5. Bảo đảm nghĩa vụ bảo hành và kết thúc bảo hành

Giá trị bảo đảm nghĩa vụ bảo hành bằng **5% giá hợp đồng**, theo hình thức khoản tiền giữ lại hoặc bảo lãnh bảo hành thay thế được Chủ đầu tư chấp thuận. Không áp dụng đồng thời khoản giữ lại và bảo lãnh cho cùng một nghĩa vụ. Nếu dùng bảo lãnh, hiệu lực bao phủ thời gian bảo hành còn lại và thời gian bổ sung theo hợp đồng; Nhà thầu gia hạn khi còn lỗi được thông báo trong thời hạn bảo hành chưa khắc phục xong.

Khi hết thời hạn bảo hành và Nhà thầu hoàn thành nghĩa vụ, các bên lập xác nhận hoàn tất; khoản giữ lại được hoàn trả hoặc bảo lãnh được giải tỏa theo điều kiện hợp đồng. Khoản chi phí xử lý bảo hành hợp lệ được đối chiếu trước khi hoàn trả; phần không tranh chấp được giải quyết theo điều kiện đã ký.

### 6. Báo cáo và chỉ số dịch vụ

Nhà thầu duy trì báo cáo sự cố, ticket, thời gian phản hồi/khắc phục, bảo trì tháng, sự cố lặp lại, nguyên nhân gốc, xu hướng cảnh báo, kết quả backup/restore và hành động phòng ngừa. Báo cáo định kỳ gửi đầu mối Chủ đầu tư; sự cố nghiêm trọng được thông báo ngay qua kênh đã thống nhất. Kết thúc mỗi đợt hỗ trợ, ticket ghi rõ kết quả, người xác nhận và khuyến nghị tiếp theo.
