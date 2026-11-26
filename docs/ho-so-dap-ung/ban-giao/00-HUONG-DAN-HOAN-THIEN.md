# Bộ hồ sơ đề xuất Tefli Việt Nam

Bản hoàn thiện ngày 30/10/2026 cho Gói thầu số 01 Nâng cấp Cổng thông tin điện tử Bộ Nội vụ. Cập nhật ngày 25/11/2026 theo HSYC bản v7 (`nguon/HSYC-v7-trich-xuat.txt`).

**Đối chiếu HSYC chính thức (bản scan có dấu, 102 trang, 26/11/2026):** nội dung trùng bản v7 trừ Bảng số 03 (trang 34): vị trí 2 là "Nhân sự chủ chốt về lập trình" **02** người (v7 ghi 03); vị trí 3 là "Nhân sự chủ chốt triển khai, hỗ trợ" 02 người. Hồ sơ đã sửa theo bản chính thức: tổng 05 nhân sự chủ chốt. Khi trích dẫn HSYC, căn cứ bản chính thức; bản text v7 chỉ dùng để tra cứu.

## Cập nhật theo HSYC v7 (25/11/2026)

- Thời hạn khắc phục lỗi: 08 giờ (đơn giản) và 40 giờ (phức tạp) tính liên tục từ khi Chủ đầu tư thông báo, không còn tính theo giờ hành chính.
- Đào tạo: 02 lớp (quản trị hệ thống, người dùng) trong 01 ngày; số học viên do Chủ đầu tư sắp xếp.
- Bổ sung căn cứ Chương IV: Thông tư 39/2017/TT-BTTTT, Thông tư 22/2023/TT-BTTTT, Khung kiến trúc (QĐ 1425/QĐ-TTg, 292/QĐ-BKHCN, 1583/QĐ-BNV), Nghị định 331/2026/NĐ-CP, QĐ 742/QĐ-BTTTT, DNSSEC, bảo mật 3 lớp, khóa tài khoản khi sai mật khẩu, lưu phiên làm việc.
- HSYC v7 bỏ phần hiện trạng hạ tầng, RPO/RTO, 500 phiên, SharePoint, LGSP/EMC. Các nội dung này được giữ là đề xuất của Nhà thầu, không ghi "theo HSYC".
- Biểu mẫu: tiến độ 30 ngày; thêm Mẫu 08A/08B/08C (nhân sự chủ chốt theo Bảng số 03), cam kết khả năng bảo hành (tiêu chí 5 Bảng số 01), bảng kê sai khác, thông tin phần mềm và vật tư thay thế (Mục 8 Chương I).
- Thuyết minh có thêm đoạn nên số trang lệch so với bảng dưới; mở bằng Word và cập nhật mục lục (chọn mục lục, nhấn F9) trước khi xuất PDF.

## Sửa sau rà soát độc lập (26/11/2026)

- Xác thực hai bước: bắt buộc với mọi tài khoản ở mỗi lần đăng nhập (Hạng mục 25); người dùng không tự tắt được, chỉ quản trị viên reset để đăng ký lại.
- Bổ sung các chức năng HSYC nêu rõ mà thuyết minh còn thiếu hoặc chỉ làm có điều kiện: tin xem nhiều, bình luận (duyệt trước khi hiển thị), lịch công tác Bộ trưởng, sắp xếp khi tra cứu văn bản, danh sách ý kiến tiếp nhận, trang riêng cho infographic và clip, video YouTube/Vimeo kèm mã nhúng, tự trích xuất ảnh đại diện, tăng dung lượng tải lên, video trong sự kiện, QR theo từng trang hiển thị, Chuyên trang tiếng Anh do Nhà thầu xây dựng và duy trì.
- Chuyển đổi dữ liệu: cam kết 100%, không áp dụng ngưỡng sai khác, không loại trừ dữ liệu (Hạng mục 10–14).
- Các chỉ tiêu HSYC v7 không có (99,9%, RPO/RTO, 500 phiên, cấu hình hạ tầng, kết nối AD/LGSP/EMC) được ghi là mục tiêu Nhà thầu đề xuất, không phải điều kiện nghiệm thu bổ sung.
- Mốc bảo hành: 12 tháng kể từ khi nghiệm thu và thanh lý hợp đồng (Mục 1.2.8 Chương IV, ĐKCT 23.3), không ngắn hơn 12 tháng kể từ ngày nghiệm thu đưa vào sử dụng.
- Thuyết minh III.3: thêm cơ cấu tổ chức và bảng ánh xạ 05 nhân sự chủ chốt theo Bảng số 03. Mục II.2.8 bổ sung các yêu cầu phi chức năng tại Mục 1.2.5 Chương IV.
- Bảng đáp ứng: cột kiểm tra viết riêng cho từng hạng mục, có tham chiếu mục thuyết minh; thêm 2 dòng phi chức năng; nêu thuật toán PBKDF2-HMAC-SHA256; thêm mục D đối chiếu Thông tư 22/2023/TT-BTTTT theo nhóm yêu cầu.
- Biểu mẫu: cam kết bảo hành nêu đủ cụm "phụ tùng thay thế, dịch vụ sau bán hàng"; thêm chứng từ thuế TNDN (tiêu chí 2); kê thành phần bên thứ ba; thêm mục N về Mẫu 11A, 11B và 02.

**Cần Tefli xác nhận trước khi nộp:**

- Sản phẩm thực tế có dùng SharePoint làm nền tảng portal không. Thuyết minh đang mô tả SharePoint là nền tảng portal kế thừa, trong khi mã nguồn hiện tại dùng React + .NET API + SQL Server và chỉ dùng SharePoint để đồng bộ văn bản. Nếu không dùng, cần viết lại phần kiến trúc (II.1.4, II.2.1–II.2.3, II.3.1) và bỏ 2 máy ảo Portal Core/SharePoint.
- Giấy phép DevExtreme 22.2 và CKEditor 4 LTS (đều là giấy phép thương mại) mà phân hệ quản trị đang dùng.
- Chủ đầu tư có sẵn bản quyền Windows Server, SharePoint Server, SQL Server hay không.
- Phạm vi "duy trì nội dung Chuyên trang tiếng Anh": hồ sơ cam kết nhập, cập nhật, xuất bản nội dung tiếng Anh; chưa cam kết tự dịch.
- Các ô [CẦN XÁC NHẬN] ở mục M, N của file biểu mẫu.

## Tài liệu bàn giao

1. **01-HSĐX-Ky-thuat-TEFLI.docx**: thuyết minh khoảng 111 trang, 33 hình và sơ đồ, 65 bảng. Các sơ đồ triển khai, kiến trúc và phân vùng mạng đã bổ sung hình minh họa máy chủ rack, thiết bị mạng, lưu trữ và máy trạm (trang 13, 28, 29). Bố cục theo tài liệu mẫu GPKT_Vi nguoi ngheo: phương pháp luận; giải pháp kỹ thuật; nhân sự và triển khai; đào tạo chuyển giao; bảo hành bảo trì. Nội dung viết theo vai nhà thầu đề xuất giải pháp sẽ xây dựng.
2. **02-Ma-tran-dap-ung-TEFLI.docx**: 12 trang, đối chiếu 29 hạng mục chức năng, các chỉ tiêu định lượng và 48 yêu cầu con về an toàn thông tin; nêu phương án đáp ứng và cách kiểm tra khi nghiệm thu.
3. **03-Bieu-mau-HSĐX-TEFLI.docx**: gồm các mẫu dự thầu, thông tin nhà thầu, năng lực, kinh nghiệm, giá, tiến độ, nhân sự chủ chốt (08A/08B/08C), cam kết bảo hành và bảng kê sai khác. Thông tin Tefli được điền theo dữ liệu đã cung cấp; các nội dung chưa có giữ ô CẦN ĐIỀN.

Số trang tính theo bản kết xuất kiểm tra, có thể thay đổi khi chỉnh sửa hoặc mở bằng trình soạn thảo khác. Mục lục cần cập nhật nếu thay đổi bố cục. Sơ đồ và giao diện minh họa thể hiện phương án đề xuất. Nội dung kiểm tra được trình bày theo yêu cầu HSYC; phương pháp, dữ liệu, môi trường và lịch thực hiện được thống nhất trong kế hoạch nghiệm thu. HSYC v7 yêu cầu kiểm thử chức năng, tính năng kỹ thuật, hiệu năng và an toàn thông tin; kiểm thử tải và diễn tập RPO/RTO là đề xuất của Nhà thầu. Kết quả được tổng hợp trong biên bản hoặc báo cáo chung có xác nhận của các bên.

## Các phần chính của thuyết minh

| Nội dung | Trang bắt đầu |
|---|---:|
| I. Giải pháp và phương pháp luận | 4 |
| II. Giải pháp kỹ thuật và mô hình phần mềm | 9 |
| Công nghệ, hạ tầng và an toàn thông tin | 20 |
| Thiết kế liên phân hệ, tích hợp và kiểm thử | 28 |
| Chức năng công khai | 39 |
| Chức năng quản trị | 62 |
| Chuyển đổi dữ liệu và vận hành | 84 |
| III. Nhân sự và kế hoạch triển khai | 104 |
| IV. Đào tạo và chuyển giao | 108 |
| V. Bảo hành và bảo trì | 109 |
| Danh mục hình | 111 |

## Nội dung doanh nghiệp cần hoàn thiện trước khi nộp

- Đối chiếu tên pháp lý, địa chỉ đăng ký, người đại diện và căn cứ ký hoặc ủy quyền. Địa chỉ đã cung cấp hiện được ghi là địa chỉ liên hệ. Xác nhận hình thức tham dự độc lập hay liên danh.
- Điền ngày đóng thầu, ngày ký, hiệu lực hồ sơ và các văn bản sửa đổi HSYC nếu có. Dự thảo sử dụng hiệu lực 60 ngày.
- Bổ sung báo cáo tài chính, chứng từ thuế và số liệu tương ứng; đối chiếu yêu cầu tài sản ròng dương, doanh thu bình quân ba năm tối thiểu 1,2 tỷ đồng theo nhánh đánh giá áp dụng.
- Kê khai hợp đồng tương tự, chứng từ nghiệm thu và giá trị hoàn thành. HSYC nêu tiêu chí hợp đồng từ ngày 01/01/2023 với giá trị hoàn thành tối thiểu 400 triệu đồng theo nhánh áp dụng.
- Điền nhân sự chủ chốt vào Mẫu 08A/08B/08C: 01 phụ trách kỹ thuật và quản lý triển khai (≥05 năm hoặc ≥02 hợp đồng), 02 nhân sự chủ chốt về lập trình (≥03 năm hoặc ≥01 hợp đồng), 02 nhân sự chủ chốt triển khai, hỗ trợ (≥02 năm hoặc ≥01 hợp đồng); bằng đại học CNTT hoặc ngành gần theo Thông tư 08/2022/TT-BTTTT; kèm hợp đồng phần mềm nội bộ và biên bản nghiệm thu/thanh lý thể hiện vị trí của từng người. Thiếu nhân sự thay thế đạt yêu cầu thì hồ sơ bị loại.
- Ký cam kết khả năng bảo hành (mục L của file biểu mẫu) và điền đầu mối trực 24/7; điền thành phần bên thứ ba trong bảng kê phần mềm (mục M).
- Hoàn thiện đơn giá, thuế, phí và tổng giá chào; kiểm tra thống nhất giữa bảng giá và đơn dự thầu. Giá gói thầu 800 triệu đồng không được coi là giá chào của Tefli.
- Xác minh các cam kết trong biểu mẫu trước khi ký; bổ sung giấy tờ pháp lý và các tài liệu chứng minh. Đăng ký đầu mối bảo hành và lịch trực thực tế.

## Những điểm cần thống nhất khi hoàn thiện

**Tiến độ:** HSYC v7 thống nhất 30 ngày từ ngày hợp đồng có hiệu lực đến nghiệm thu tổng thể; đơn dự thầu và bảng tiến độ đã ghi 30 ngày.

**Hạ tầng và giấy phép:** HSYC v7 không còn mô tả hạ tầng. Phương án đề xuất cấu hình tham chiếu 13 máy ảo, 76 vCPU, 216 GB RAM; nền tảng SharePoint, React, .NET và SQL. Cần thống nhất tài nguyên, giấy phép, quyền truy cập và đầu mối phối hợp do Chủ đầu tư bố trí theo phạm vi gói thầu.

**Điều kiện hợp đồng:** Bảo đảm thực hiện hợp đồng 2% giá hợp đồng; giữ lại bảo hành 5% hoặc bảo lãnh bảo hành thay thế. Theo HSYC v7, giá trị tạm ứng và số lần thanh toán được hai bên thống nhất khi thương thảo (không còn định sẵn 40%/95%). Hoàn thiện các bảo lãnh và thông tin thương mại theo hồ sơ được phê duyệt.

Bộ tài liệu chưa có chữ ký, con dấu và giá chào được phê duyệt. Cần hoàn thành các ô còn thiếu và chứng từ kèm theo trước khi ký, nộp hồ sơ.
