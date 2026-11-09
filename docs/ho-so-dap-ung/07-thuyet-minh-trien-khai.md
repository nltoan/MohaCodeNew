# Thuyết minh phương án triển khai

**Nhà thầu đề xuất:** Công ty cổ phần công nghệ Tefli Việt Nam  
**Gói thầu:** Gói thầu số 01 – Nâng cấp Cổng thông tin điện tử Bộ Nội vụ

> Đây là phương án đề xuất để đưa vào HSĐX và hoàn thiện khi nhà thầu xác nhận. Việc nêu phương án không thay cho phê duyệt kế hoạch, cung cấp hạ tầng/dữ liệu hay ký kết cam kết của người có thẩm quyền. Thời hạn đề xuất là tối đa 30 ngày lịch tính từ ngày hợp đồng có hiệu lực đến nghiệm thu tổng thể, phù hợp ngưỡng kỹ thuật của HSYC. HSYC đồng thời ghi mốc 02 tháng tại Chương I; đề nghị Chủ đầu tư làm rõ trước khi nộp/hoàn thiện hợp đồng. [B0047; B0295.R016–R017; B0660]

## 1. Mục tiêu và nguyên tắc tổ chức

Phương án bao gồm nâng cấp Cổng, cài đặt/triển khai, đào tạo và chuyển giao trên hạ tầng, nền tảng do Chủ đầu tư bố trí. Công việc được triển khai theo nhóm chức năng; yêu cầu và thiết kế được xác nhận trước khi phát triển; sao lưu và chuyển đổi thử trước khi chuyển đổi chính thức. Truy cập hệ thống chỉ sau khi được cho phép; dữ liệu được bảo mật và sử dụng trong phạm vi hợp đồng. [B0645–B0659; B0962.R016; B0962.R019–R022]

## 2. Kế hoạch 30 ngày và các cổng kiểm soát

Các khoảng ngày dưới đây là lịch đề xuất, có phần công việc song song. Mốc nghiệm thu tổng thể vẫn nằm trong ngày 30 kể từ hiệu lực hợp đồng. Tiến độ thực tế cần được cập nhật tại cuộc họp khởi động trên cơ sở lịch sẵn sàng của đầu mối, dữ liệu và môi trường phía Chủ đầu tư.

| Thời gian | Công việc chính | Đầu ra/cổng kiểm soát |
|---|---|---|
| Ngày 1–2 | Khởi động; chốt đầu mối, môi trường, quyền truy cập, yêu cầu và quy trình thay đổi. | Biên bản khởi động, lịch, đầu vào thiếu. **G1:** xác nhận phạm vi/đầu mối. |
| Ngày 2–5 | Khảo sát nội dung, phân hệ, quyền, tích hợp, hạ tầng, dữ liệu mẫu và URL. | Biên bản khảo sát, danh mục nguồn/phụ thuộc. **G2:** xác nhận hiện trạng và mẫu dữ liệu. |
| Ngày 4–8 | Phân tích; thiết kế giao diện/kiến trúc/cấu hình; ánh xạ dữ liệu; lập kế hoạch test, bảo mật, sao lưu. | Tài liệu phân tích/thiết kế, ma trận truy vết, kế hoạch test/chuyển đổi/rollback. **G3:** xác nhận trước khi chốt thiết kế. |
| Ngày 7–18 | Phát triển/nâng cấp, cấu hình và tích hợp theo thông số được cấp. | Bản dựng, nhật ký thay đổi/lỗi. **G4:** bản dựng đạt kiểm thử nội bộ. |
| Ngày 13–21 | Sao lưu và chuyển đổi thử; đối soát sáu nhóm, sửa ánh xạ khi cần. | Biên bản thử, báo cáo số liệu/lỗi, ánh xạ URL. **G5:** xác nhận phương án chuyển chính thức. |
| Ngày 19–24 | Kiểm thử chức năng, tích hợp, phân quyền, hiệu năng, ATTT, sao lưu/phục hồi; sửa và chạy lại. | Kịch bản, bằng chứng pass/fail, lỗi và kết quả retest. **G6:** thống nhất kết quả/tồn tại. |
| Ngày 23–26 | Cài đặt trên hạ tầng Chủ đầu tư; kiểm thử nghiệm thu; chuyển cuối khi được chấp thuận. | Biên bản cài đặt/chuyển đổi, đối soát, vận hành thử. **G7:** xác nhận sẵn sàng nghiệm thu. |
| Ngày 25–28 | Đào tạo, hướng dẫn, bàn giao tài liệu. | Danh sách tham dự, tài liệu và biên bản đào tạo. |
| Ngày 28–30 | Khắc phục, kiểm thử lại, bàn giao, nghiệm thu tổng thể. | Báo cáo cuối, biên bản bàn giao/nghiệm thu. **G8:** nghiệm thu khi đạt yêu cầu. |

## 3. Nhân lực theo vai trò

HSYC không đặt yêu cầu nhân sự chủ chốt để chấm đạt/không đạt, nhưng yêu cầu có kế hoạch bố trí người phù hợp cho khảo sát, phân tích, thiết kế, phát triển, kiểm thử, an toàn thông tin, chuyển đổi dữ liệu và đào tạo. Bảng dưới mô tả vai trò cần huy động; tên, số lượng cụ thể và phân công cá nhân chỉ điền sau khi Tefli xác nhận nhân sự sẵn sàng. [B0291]

| Vai trò | Trách nhiệm trong gói thầu | Đầu ra/phối hợp |
|---|---|---|
| Quản lý triển khai | Tiến độ, rủi ro, phiên bản, biên bản và đầu mối phối hợp. | Lịch, báo cáo, quyết định cần Chủ đầu tư xác nhận. |
| Khảo sát/phân tích nghiệp vụ | Thu thập quy trình, chức năng, quyền, dữ liệu, tích hợp; lập ma trận truy vết. | Biên bản khảo sát, yêu cầu/tiêu chí nghiệm thu. |
| Thiết kế giải pháp | Thiết kế kiến trúc, giao diện, dịch vụ, dữ liệu, phân quyền và triển khai. | Tài liệu thiết kế, điểm tích hợp. |
| Phát triển ứng dụng | Nâng cấp chức năng, giao diện, tích hợp; xử lý lỗi trong phạm vi. | Bản dựng, mã nguồn tự phát triển, nhật ký. |
| Chuyển đổi dữ liệu | Ánh xạ, trích xuất/nạp, đối soát bản ghi/tệp/URL, chuẩn bị rollback. | Báo cáo chuyển đổi và bằng chứng đối soát/khôi phục. |
| Kiểm thử | Kịch bản chức năng, tích hợp, phân quyền, hiệu năng, dữ liệu; retest. | Kịch bản, bằng chứng pass/fail, báo cáo lỗi. |
| ATTT/vận hành | Rà soát truy cập, nhật ký, an toàn, backup/restore và ứng cứu. | Checklist, kết quả phục hồi, hướng dẫn vận hành. |
| Đào tạo/chuyển giao | Soạn tài liệu và hướng dẫn hai nhóm học viên. | Tài liệu, danh sách và biên bản đào tạo. |

Người có thể kiêm nhiệm chỉ khi Tefli xác nhận đủ năng lực, không ảnh hưởng tiến độ/chất lượng. Tên và số lượng nhân sự thực tế phải do nhà thầu điền sau khi xác nhận sẵn sàng; tài liệu này không gán nhân sự cụ thể.

## 4. Khảo sát, thiết kế, phát triển và kiểm thử

Khảo sát ghi nhận cấu trúc nội dung/phân hệ, quy trình biên tập và xuất bản, tài khoản/nhóm quyền, nền tảng, dữ liệu và kết nối hiện có; đồng thời xác định đầu vào, quyền truy cập, môi trường và đầu mối còn thiếu. Kết nối Active Directory, LGSP/API, chữ ký số và hệ thống EMC chỉ thực hiện theo thông số, quyền truy cập, dữ liệu trao đổi và đầu mối được Chủ đầu tư xác nhận; EMC được đề cập trong hiện trạng như hệ thống cần tích hợp/giám sát, không coi là hệ thống quản lý nội dung. Kết quả được lập biên bản, phân biệt phạm vi đã rõ và nội dung cần phối hợp. [B0713.R007; B0712–B0729; B0824–B0829]

Thiết kế theo kiến trúc, công nghệ và chức năng Chương IV. Mỗi yêu cầu được truy vết tới giải pháp, bản dựng, kịch bản kiểm thử và đầu ra nghiệm thu; sai khác/ngoại lệ (nếu có) phải kê khai. Kiểm thử gồm chức năng/tính năng kỹ thuật, hiệu năng, an toàn thông tin, phân quyền, dữ liệu, sao lưu/khôi phục và tích hợp thuộc phạm vi. Kịch bản ghi đầu vào, bước chạy, kết quả mong đợi/thực tế và bằng chứng. **Pass:** kết quả đáp ứng yêu cầu và không có lỗi cản trở nghiệm thu. **Fail:** thiếu/sai kết quả, lỗi nghiêm trọng hoặc dữ liệu không toàn vẹn; ghi lỗi, sửa và chạy lại kịch bản liên quan. [B0077–B0078; B0721–B0729; B0738; B0880–B0883; B0962.R021]

### Chỉ tiêu tải, sẵn sàng và cấu hình triển khai

Kịch bản kiểm thử tải bao gồm truy cập trang chủ, tìm kiếm, xem tin bài, tải tệp và thao tác quản trị. Mức tải tối thiểu **500 lượt truy cập đồng thời**, trong đó ít nhất **84 phiên/người dùng hoạt động đồng thời**. Đo thời gian phản hồi trung bình tác vụ thông thường **dưới 2,5 giây**, chậm nhất **dưới 30 giây**; tương tác trực tiếp mục tiêu **không quá 0,6 giây khi điều kiện mạng và tải cho phép**; tác vụ dài hiển thị trạng thái. Trong tải danh định, CPU trung bình từng nút **không quá 75%**, không có swap kéo dài và còn **ít nhất 25%** dư địa tài nguyên. Báo cáo ghi rõ kịch bản, tải thực đạt, điều kiện môi trường, số liệu theo nút và ngoại lệ nếu mạng ảnh hưởng phép đo. [B0804–B0806; B0810.R002–R003]

HSYC định cỡ tối thiểu **13 VM, tổng 76 vCPU/216 GB RAM**, gồm 2 FE ReactJS; 2 .NET API/Services; 2 Portal Core/SharePoint; 2 DB HA; 1 Search/Index; 2 File/Object; 1 Log collector/Monitoring; 1 Backup/DR Repository. Tổng OS/System disk 2.700 GB, data/storage 16,5 TB vật lý/logic gồm dữ liệu nhân bản và backup. Cần đối chiếu bảng cấu hình chi tiết B0813 với hạ tầng Chủ đầu tư cung cấp trước cài đặt; không giả định các tài nguyên đã được cấp. Sizing ứng dụng dùng thông số benchmark tham chiếu và phải đo kiểm lại trên bản hoàn thiện, chứng minh đáp ứng tải trước nghiệm thu. [B0813.R001–R015; B0816]

Chỉ tiêu vận hành: độ sẵn sàng dịch vụ công khai tối thiểu **99,9% theo tháng**, không tính bảo trì có kế hoạch đã thông báo; phương án DR xác định **RPO không quá 04 giờ, RTO không quá 04 giờ** với dịch vụ trọng yếu và phải diễn tập trước nghiệm thu. Kịch bản nghiệm thu lưu bằng chứng đo tải, diễn tập phục hồi và tính sẵn sàng; RTO phục hồi dịch vụ không được đánh đồng với 08/40 giờ hành chính sửa lỗi phần mềm. [B0752; B0756; B0870]

Kiểm thử nội bộ chạy tại môi trường nhà thầu; tích hợp, nghiệm thu và vận hành thử chạy trên hạ tầng do Chủ đầu tư bố trí. Thử nghiệm có nguy cơ ảnh hưởng hệ thống đang chạy phải có kế hoạch sao lưu/khôi phục được chấp thuận. Kết quả ghi biên bản/báo cáo có xác nhận của các bên; nghiệm thu giai đoạn không miễn nghĩa vụ chất lượng, bảo mật, bảo hành. [B0962.R021–R022]

## 5. Chuyển đổi dữ liệu và URL

Phạm vi gồm sáu nhóm: (1) tin tức; (2) văn bản; (3) chuyên trang Bộ trưởng; (4) Đảng bộ Bộ Nội vụ; (5) đa phương tiện; (6) URL cũ sang URL mới. Không giả định trước số bản ghi hay chất lượng dữ liệu; kiểm kê cùng Chủ đầu tư. [B0650; B0738.R012–R018]

Mỗi nhóm thực hiện theo cùng chu trình: chốt nguồn/trường/quy tắc chuẩn hóa/trạng thái; sao lưu và kiểm tra bản sao; chuyển thử; báo cáo số lượng đọc được, nạp thành công, lỗi/trùng/thiếu; lấy mẫu đối chiếu trường trọng yếu, ngày tháng và tệp; ghi ngoại lệ, thống nhất cách xử lý; chỉ chuyển đổi chính sau xác nhận. Không tự loại bỏ sai khác. Với URL, lập bảng ánh xạ URL cũ–nội dung–URL mới, kiểm tra đích và vòng lặp. Lưu cấu hình cũ và bản sao lưu trước khi đổi; nếu vượt điều kiện dừng đã thống nhất, khôi phục cấu hình/dữ liệu, kiểm tra dịch vụ và lập lịch chạy lại. Ngưỡng dừng và người phê duyệt được chốt trong kế hoạch chuyển đổi, không tự đặt số khi chưa có hiện trạng. [B0650; B0962.R019–R022]

## 6. Đào tạo, bàn giao và nghiệm thu

Đào tạo tập trung tại địa điểm Chủ đầu tư bố trí: quản trị hệ thống **01 đợt/01 lớp/01 ngày, 01 giảng viên chính/0 phụ, 03 máy, 05 học viên**; biên tập viên **01 đợt/01 lớp/02 ngày, 01 giảng viên chính/0 phụ, 05 máy, 05 học viên**. Nội dung lần lượt gồm cấu hình, phân quyền, vận hành, sao lưu/khôi phục và quy trình nhập–biên tập–duyệt–xuất bản, quản lý nội dung theo quyền. [B0847–B0855]

Bàn giao: bộ cài đặt; mã nguồn phần tự phát triển trong phạm vi quyền; cấu hình/mã triển khai; hướng dẫn biên dịch, cài đặt, quản trị, vận hành, sử dụng; tài liệu khảo sát–phân tích–thiết kế; tài liệu đào tạo; hồ sơ chuyển đổi/đối soát và URL; cấu trúc dữ liệu; tài khoản quản trị bàn giao an toàn; hướng dẫn sao lưu/khôi phục; biên bản kiểm thử, nghiệm thu; đầu mối hỗ trợ. Với thành phần có sẵn/bên thứ ba, kê khai chủ thể quyền, phiên bản, giấy phép và phạm vi sử dụng. [B0860–B0866; B0962.R016–R017]

Nghiệm thu tổng thể căn cứ phạm vi, kết quả kiểm thử, dữ liệu/tích hợp đã đối soát, bàn giao và đào tạo. Tồn tại được ghi danh sách, sửa và kiểm thử lại trước nghiệm thu. Các phụ thuộc ảnh hưởng mốc được báo cáo tại cổng kiểm soát; thời gian đề xuất tối đa 30 ngày. [B0295.R016–R017; B0962.R021]

## 7. Bảo hành và hỗ trợ sau nghiệm thu

Đề xuất bố trí bảo hành và hỗ trợ phần mềm trong **12 tháng** từ ngày nghiệm thu đưa vào sử dụng; tiếp nhận thông báo qua đường dây nóng **24/7**, hỗ trợ trực tuyến, kiểm tra/bảo trì định kỳ **01 lần/tháng**. Lỗi đơn giản được khắc phục không quá **08 giờ hành chính**; lỗi phức tạp không quá **40 giờ hành chính**. Giờ hành chính tính từ 08:00–12:00 và 13:00–17:00 các ngày làm việc của Chủ đầu tư, không gồm nghỉ/lễ; tiếp nhận vẫn liên tục 24/7. Khi có yêu cầu hỗ trợ trực tiếp, thời gian có mặt tại địa điểm lắp đặt không quá **12 giờ liên tục**, kể cả ngoài giờ/ngày nghỉ/lễ. [B0870–B0877; B0962.R024–R025]

RTO tối đa **04 giờ** là chỉ tiêu khôi phục dịch vụ trọng yếu bằng phương án sao lưu/phục hồi/DR, độc lập với thời hạn 08/40 giờ hành chính để khắc phục lỗi phần mềm; không dùng thời hạn sửa lỗi để kéo dài khôi phục dịch vụ. Đề xuất ghi nhận sự cố, thời điểm tiếp nhận, mức độ ảnh hưởng, nguyên nhân, biện pháp ứng cứu, thời điểm khôi phục và kết quả xử lý; sự cố nghiêm trọng được phối hợp khoanh vùng, giảm thiệt hại và phục hồi an toàn ngay. Trước bàn giao, cung cấp đầu mối, số điện thoại, email và quy trình tiếp nhận/phân loại/xử lý. [B0870; B0875–B0877; B0962.R025]

HSYC quy định bảo đảm nghĩa vụ bảo hành bằng **5% giá hợp đồng**, theo hình thức khoản giữ lại hoặc bảo lãnh thay thế; không thu đồng thời hai hình thức cho cùng nghĩa vụ. Nhà thầu cần xác nhận hình thức thực tế khi hoàn thiện hợp đồng; nội dung này là phương án theo HSYC, không phải bằng chứng Tefli đã phát hành bảo lãnh hay đồng ý một hình thức cụ thể. [B0962.R024]

## 8. Bảng truy vết yêu cầu HSYC

| Yêu cầu | Cách đáp ứng trong phương án | Căn cứ HSYC |
|---|---|---|
| Quy trình khảo sát, phân tích, thiết kế, xây dựng/nâng cấp, kiểm thử, cài đặt, bàn giao | Mục 2, 4, 6 và các cổng G1–G8 | B0295.R005; B0295.R007; B0295.R010 |
| Phạm vi nâng cấp, triển khai, đào tạo; nền tảng do Chủ đầu tư bố trí | Mục 1, 4, 6 | B0655–B0659; B0721–B0729 |
| Sáu nhóm dữ liệu/URL | Mục 5, kiểm kê, chuyển thử, đối soát, rollback | B0650; B0738.R012–R018 |
| Kiểm thử chức năng, hiệu năng, ATTT | Mục 4 và hồ sơ kết quả kiểm thử | B0880–B0883; B0962.R021 |
| Hiệu năng và cấu hình | 500 đồng thời/84 hoạt động; phản hồi <2,5 giây trung bình, <30 giây tối đa, tương tác <=0,6 giây khi điều kiện cho phép; CPU <=75%, >=25% dư địa; 13 VM/76 vCPU/216 GB | B0804–B0806; B0810; B0813; B0816 |
| Sẵn sàng/DR | 99,9% tháng; RPO/RTO <=4 giờ, diễn tập trước nghiệm thu | B0752; B0756 |
| Đào tạo theo số lớp, ngày, người, máy | Mục 6 | B0853.R002–R008; B0855.R002–R008 |
| Hạn hoàn thành | Mốc nghiệm thu tổng thể tối đa 30 ngày; yêu cầu làm rõ xung đột 02 tháng | B0047; B0295.R016–R017; B0660 |
| Bảo hành/SLA/bảo đảm bảo hành | Mục 7 | B0870–B0877; B0962.R024–R025 |

