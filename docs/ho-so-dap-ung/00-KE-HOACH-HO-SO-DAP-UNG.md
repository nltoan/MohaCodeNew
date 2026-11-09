> Cập nhật 30/10/2026: bộ bàn giao hiện hành nằm trong thư mục `ban-giao`, gồm thuyết minh 111 trang với 33 hình, ma trận 12 trang và biểu mẫu 9 trang. Nội dung đã viết lại theo vai nhà thầu và bố cục mẫu GPKT_Vi nguoi ngheo. Các ghi nhận khảo sát và bản soạn cũ dưới đây là lịch sử làm việc nội bộ; không đưa vào hồ sơ nộp. Xem `ban-giao/00-HUONG-DAN-HOAN-THIEN.md` để hoàn thiện dữ liệu doanh nghiệp.

# Kế hoạch lập hồ sơ đáp ứng gói thầu nâng cấp Cổng thông tin điện tử Bộ Nội vụ

Ngày lập: 28/10/2026. Nhà thầu dự kiến: Công ty cổ phần công nghệ Tefli Việt Nam, MST 0108252059.

Cập nhật ngày 29/10/2026: đã dựng bộ Word tại thư mục `ban-giao`, gồm thuyết minh kỹ thuật, ma trận đáp ứng và biểu mẫu nhà thầu. Xem [hướng dẫn hoàn thiện trước khi nộp](ban-giao/00-HUONG-DAN-HOAN-THIEN.md). Các bước dựng Word nêu dưới đây là kế hoạch ban đầu đã được thực hiện; dữ liệu doanh nghiệp, người ký, giá và chứng từ thực tế vẫn phải được Tefli bổ sung/xác nhận.

## Bộ tài liệu đã soạn

- [Thông tin Tefli và việc cần chốt](01-THONG-TIN-VA-VIEC-CAN-CHOT.md).
- [Ma trận và thuyết minh đáp ứng chức năng](02-dap-ung-chuc-nang.md).
- [Kiến trúc an toàn thông tin và vận hành](03-kien-truc-an-toan-van-hanh.md).
- [Triển khai và hồ sơ nhà thầu](04-trien-khai-va-ho-so-nha-thau.md).

Ba agent đã hoàn thành bản thảo đầu tiên; phần chức năng đã qua một vòng sửa tham chiếu và giới hạn kết luận. Điều phối đã kiểm tra sự tồn tại của file và vị trí dòng đầu của 126 tham chiếu code/tài liệu trong phần 02–03, đồng thời đối chiếu các mốc chính về tiến độ và năng lực với bản trích HSYC. Đây không phải kiểm thử chức năng, kiểm tra đầy đủ từng điều kiện hay chứng nhận đáp ứng. Bước tiếp theo là bổ sung chứng từ, làm rõ các điểm mở, tách ma trận thành yêu cầu kiểm chứng độc lập và chốt nội dung trước khi dựng Word.

Mục tiêu là xây dựng HSĐX bằng tiếng Việt, bám tiêu chí đánh giá Chương II và yêu cầu kỹ thuật Chương IV của file `26.10.19. 1B.Mau-HSYC.docx`. Bộ tài liệu này là kế hoạch và nội dung làm việc để hoàn thiện hồ sơ; chưa phải bộ hồ sơ đã ký hoặc sẵn sàng nộp. Phần chức năng phải dẫn được yêu cầu, giải pháp, bằng chứng mã nguồn và cách kiểm chứng. Phần năng lực, giá và cam kết phải có dữ liệu thực của nhà thầu.

## Các quyết định cần bám

- Lập phương án tiến độ dự thảo 30 ngày tính từ hiệu lực hợp đồng đến nghiệm thu tổng thể. Chương I ghi 02 tháng [B0047], nhưng Chương II đánh giá theo 30 ngày [B0295.R016–R017] và Chương IV cũng ghi 30 ngày [B0660]. Ghi vào danh sách đề nghị làm rõ; không tự sửa HSYC hoặc loại bỏ điểm mâu thuẫn.
- Giá gói thầu trong tài liệu là 800.000.000 đồng [B0661]. Đây không phải giá chào của Tefli. Chỉ đưa giá vào đơn sau khi hoàn thành và duyệt bảng giá.
- Kiến trúc phải xử lý yêu cầu SharePoint làm nền tảng, ReactJS và .NET làm lớp mở rộng, SQL Server làm lớp dữ liệu [B0722–B0730]. Không mô tả riêng React và API như đã đáp ứng toàn bộ yêu cầu nền tảng.
- Các kết luận từ repository là rà soát tĩnh của working tree ngày lập; repository có thay đổi chưa commit. Có file hoặc API không đồng nghĩa đã chạy đúng hoặc đã đáp ứng nghiệm thu.
- Thông tin pháp lý trong bộ kế hoạch là yêu cầu trích từ HSYC, chưa phải kết luận kiểm chứng hiệu lực văn bản pháp luật. Bản trích dùng mã B cho khối và R cho hàng bảng; các mã này không phải số trang Word.

## Cấu trúc hồ sơ dự kiến

| Phần | Nội dung phải có | Nguồn để điền | Điều kiện hoàn thành |
|---|---|---|---|
| 1 Hồ sơ dự thầu và tư cách | Đơn Mẫu 01A, giấy tờ người ký, thông tin nhà thầu; liên danh/ủy quyền nếu áp dụng | Chương I, III; hồ sơ pháp lý Tefli | Đúng tên pháp lý, người ký, hiệu lực 60 ngày và hình thức tham dự |
| 2 Năng lực và kinh nghiệm | Thuế, BCTC, tài sản ròng, doanh thu, hợp đồng tương tự, lịch sử hợp đồng, khả năng bảo hành | Chương II; các mẫu và chứng từ thực | Từng tiêu chí có chứng cứ; xác định áp dụng Bảng 01 hay 02 |
| 3 Phạm vi và hiểu biết gói thầu | Mục tiêu nâng cấp, hiện trạng, toàn bộ phạm vi chức năng và dịch vụ | Chương IV; khảo sát hiện trạng | Không bỏ nhóm chức năng, dữ liệu hay dịch vụ liên quan |
| 4 Giải pháp kỹ thuật | Kiến trúc, nền tảng, các phân hệ, luồng dữ liệu, tích hợp, ATTT, hiệu năng, tiếp cận, vận hành | Bản thảo 02 và 03; sơ đồ và bằng chứng code | Phân biệt đã có, cần bổ sung, cần kiểm thử; có phương án cho mọi khoảng trống |
| 5 Tổ chức triển khai | Khảo sát, thiết kế, nâng cấp, chuyển đổi, tích hợp, cài đặt, nhân lực, lịch 30 ngày | Bản thảo 04; xác nhận nguồn lực | Có đầu ra, phụ thuộc, người phụ trách và tiêu chí kết thúc mỗi giai đoạn |
| 6 Kiểm thử và nghiệm thu | Ma trận ca kiểm thử, chức năng, phân quyền, tải, ATTT, tích hợp, chuyển đổi, restore/DR | Mỗi yêu cầu Chương IV | Chỉ tiêu định lượng đúng HSYC; có mẫu báo cáo và cách thử lại |
| 7 Đào tạo và chuyển giao | Chương trình quản trị và biên tập, tài liệu, mã nguồn, cấu hình, tài khoản, dữ liệu | Chương IV và ĐKCT | Đủ lớp, học viên, thời lượng, danh mục bàn giao |
| 8 Bảo hành và hỗ trợ | 12 tháng, tiếp nhận 24/7, xử lý lỗi, hỗ trợ trực tiếp, bảo trì, bảo đảm bảo hành | Bản thảo 04 và ĐKCT | Đầu mối được xác nhận; phân biệt RTO với hạn khắc phục lỗi |
| 9 Đề xuất tài chính | Mẫu 4.1A, đủ hạng mục/dịch vụ, thuế, giảm giá nếu có, tổng và bằng chữ | Báo giá được Tefli phê duyệt | Tổng khớp đơn và bảng; không lấy ngân sách làm giá chào |
| Phụ lục | Ma trận đáp ứng, bằng chứng, sai khác/ngoại lệ, danh mục phần mềm và xuất xứ, tài liệu năng lực | HSYC B0076–B0078 và các phần trên | Truy vết yêu cầu tới đúng chương, tài liệu và bằng chứng |

## Phân công agent và cách tiết kiệm token

Đã giao ba agent `gpt-6-luna`, mức suy luận `low`, ngữ cảnh mới và file đầu ra riêng. Đây là lựa chọn model và phạm vi để giảm chi phí; không phải cam kết một số token cố định. Không truyền toàn bộ lịch sử hội thoại cho từng agent, không yêu cầu đọc thư viện phụ thuộc hoặc sinh lại toàn bộ hồ sơ sau mỗi thay đổi.

| Agent | Phần việc | File đầu ra | Người duyệt |
|---|---|---|---|
| chuc_nang | Đối chiếu chức năng công khai, CMS, API, migration; soạn ma trận và thuyết minh | `02-dap-ung-chuc-nang.md` | Agent điều phối kiểm tra đường dẫn và mức kết luận |
| kien_truc | Kiến trúc, SharePoint, tích hợp, bảo mật, hiệu năng, sao lưu, vận hành | `03-kien-truc-an-toan-van-hanh.md` | Agent điều phối kiểm tra khoảng trống và bằng chứng |
| trien_khai | Điều kiện đánh giá, biểu mẫu, lịch, đào tạo, nghiệm thu, bảo hành, checklist doanh nghiệp | `04-trien-khai-va-ho-so-nha-thau.md` | Tefli xác nhận năng lực, nhân sự, giá và cam kết |
| Điều phối | Lập kế hoạch, kiểm tra xung đột, rà tính nhất quán, tổng hợp việc cần bổ sung | File này và `01-THONG-TIN-VA-VIEC-CAN-CHOT.md` | Người có thẩm quyền của Tefli trước khi phát hành |

Mỗi lần bổ sung, agent chỉ nhận mã yêu cầu và đoạn cần sửa. Dùng chung bản trích HSYC trong `nguon/HSYC-trich-xuat.txt`. Vòng đầu là điền nội dung từ nguồn hiện có; vòng hai kiểm tra chứng cứ và loại bỏ tên file hoặc khả năng suy đoán; vòng ba tích hợp chứng từ và định dạng Word khi nội dung đã đủ.

## Trình tự dựng và hoàn thiện tài liệu

1. Trích yêu cầu và đánh dấu điều kiện loại. Đối chiếu cả Chương II, IV và ĐKCT; lưu danh sách xung đột. Bước này đã thực hiện ở mức lập kế hoạch.
2. Soạn các phần 02–04 và rà mã nguồn có mục tiêu. Chỉ dùng mức “có bằng chứng tĩnh”, “một phần”, “chưa tìm thấy” hoặc “cần kiểm chứng”; chưa chấm toàn bộ gói thầu là đạt.
3. Chuẩn hóa ma trận cuối: một yêu cầu kiểm chứng độc lập một dòng; các nhóm ở bản thảo phải tách nhỏ trước nghiệm thu. Trường bắt buộc gồm mã HSYC, nội dung, giải pháp, hiện trạng, việc bổ sung, vị trí code, ca kiểm thử, bằng chứng kết quả, người phụ trách và vị trí trong HSĐX.
4. Chốt đầu vào doanh nghiệp và kỹ thuật trong file 01. Hoàn thiện bảng giá riêng; đối chiếu phạm vi giá với tất cả công việc và dịch vụ. Không tự điền số liệu năng lực hoặc ký cam kết.
5. Lập phương án xử lý khoảng trống. Mỗi khoảng trống có khối lượng, người thực hiện, mốc trong 30 ngày, phụ thuộc và cách nghiệm thu. Đánh giá tính khả thi trước khi chuyển câu dự thảo thành cam kết.
6. Tạo bản Word HSĐX theo đúng biểu mẫu HSYC cho phần hành chính/tài chính; ghép thuyết minh kỹ thuật và phụ lục. Ma trận code chi tiết dùng cho kiểm soát nội bộ, chỉ đưa bằng chứng phù hợp vào bản nộp, không đưa secrets hoặc dữ liệu vận hành nhạy cảm.
7. Kiểm tra Word bằng render từng trang; kiểm tra mục lục, bảng dài, số liệu, tên nhà thầu, tham chiếu phụ lục, chỗ trống và chữ ký. Tefli duyệt nội dung và ký/nộp theo thẩm quyền.

## Điều kiện để chuyển sang bản nộp

- Không còn ô chưa điền ở các thành phần bắt buộc; có chứng từ doanh nghiệp và tư cách người ký.
- Mỗi tiêu chí Chương II có vị trí trả lời và chứng cứ tương ứng; xác định đúng nhánh nhà sản xuất/không phải nhà sản xuất.
- Mọi yêu cầu Chương IV đều có giải pháp; các khoảng trống được xử lý bằng công việc cụ thể và tiến độ khả thi, không bằng câu khẳng định chung “đáp ứng”.
- Những chỉ tiêu hiệu năng, bảo mật, tích hợp và khôi phục có kế hoạch kiểm chứng; chỉ nêu kết quả đạt khi có báo cáo thực tế tương ứng.
- Có bảng kê sai khác/ngoại lệ và xử lý rõ xung đột thời gian; chưa gửi yêu cầu làm rõ hoặc hồ sơ ra bên ngoài trong công việc này.
- Giá, thời gian, bảo hành, tên doanh nghiệp và phạm vi thống nhất giữa đơn, thuyết minh, bảng giá và phụ lục.

Các file Markdown được giữ làm nguồn nội dung và bằng chứng rà soát. Bộ Word đã được xuất riêng trong `ban-giao`; file HSYC gốc được giữ nguyên.

## Bổ sung bản chi tiết theo phản hồi

Đã hoàn thiện thuyết minh mở rộng 86 trang với 23 sơ đồ và 35 bảng. Ba agent được giao chi tiết chức năng công khai, quản trị và chuyển đổi dữ liệu vận hành; nội dung lưu ở các file 10–12. File 13 bổ sung thiết kế liên phân hệ và kiểm chứng. Bộ hồ sơ hiện có 114 trang Word; vẫn cần dữ liệu doanh nghiệp thực tế theo danh mục ở thư mục ban-giao.
